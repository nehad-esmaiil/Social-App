import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { AiFillDislike, AiOutlineLike, AiOutlineRetweet } from "react-icons/ai";
import { FaBookmark, FaCamera, FaImage, FaRegCommentAlt, FaRegEdit, FaRegSmile, FaTrash } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { MdPublic } from "react-icons/md";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { toast } from "react-toastify";
import { UserContext } from "../../App";
import fallbackAvatar from "../../assets/Images/HomeImgs/defaultProfile.png";
import { toggleBookmark } from "../../services/addRemoveBookmark";
import { addComment } from "../../services/addCommnt";
import { deleteComment, fetchComments, updateComment } from "../../services/comments";
import { deletePost } from "../../services/deletePost";
import { likePost } from "../../services/likePost";
import { sharePost } from "../../services/sharePost";
import { updatePost } from "../../services/updatePost";

const validImage = (src) => src && !String(src).includes("undefined") ? src : fallbackAvatar;

export default function PostCard({ post, onUnsave, onDeleteSuccess, isSavedPage = false }) {
  const { userData } = useContext(UserContext);
  const postId = post.id || post._id;
  const likes = post.likes || [];
  const [menuOpen, setMenuOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount ?? likes.length);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [sending, setSending] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareBody, setShareBody] = useState("");
  const [sharing, setSharing] = useState(false);
  const [sharesCount, setSharesCount] = useState(post.sharesCount || 0);
  const [commentMenu, setCommentMenu] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editing, setEditing] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [editPostOpen, setEditPostOpen] = useState(false);
  const [editBody, setEditBody] = useState(post.body || "");
  const [editImage, setEditImage] = useState(null);
  const [displayBody, setDisplayBody] = useState(post.body || "");
  const [displayImage, setDisplayImage] = useState(post.image || "");
  const [updatingPost, setUpdatingPost] = useState(false);

  useEffect(() => {
    if (!userData?._id) return;
    setLiked(likes.some((item) => (item?._id || item) === userData._id));
  }, [post.likes, userData?._id]);

  const toggleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikesCount((count) => count + (next ? 1 : -1));
    try {
      const { data } = await likePost(postId);
      if (data?.data?.likesCount != null) setLikesCount(data.data.likesCount);
    } catch {
      setLiked(!next);
      setLikesCount((count) => count + (next ? -1 : 1));
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const { data } = await fetchComments(postId);
      setComments(data?.data?.comments || []);
    } finally {
      setLoadingComments(false);
    }
  };

  const submitComment = async () => {
    if (!comment.trim()) return;
    setSending(true);
    try {
      const { data } = await addComment(postId, { content: comment.trim() });
      setComment("");
      toast.success(data?.message || "Comment created successfully");
      await loadComments();
    } catch {
      toast.error("comment Failed");
    } finally {
      setSending(false);
    }
  };

  const removeComment = async (commentId) => {
    try {
      const { data } = await deleteComment(postId, commentId);
      toast.success(data?.message || "Comment deleted successfully");
      setCommentMenu(null);
      await loadComments();
    } catch {
      toast.error("comment delete Failed");
    }
  };

  const openCommentEditor = (item) => {
    setEditingComment(item);
    setEditCommentText(item.content || "");
    setCommentMenu(null);
  };

  const saveComment = async () => {
    if (!editCommentText.trim()) return;
    try {
      setEditing(true);
      const { data } = await updateComment(postId, editingComment._id, editCommentText.trim());
      toast.success(data?.message || "Comment updated successfully");
      setEditingComment(null);
      await loadComments();
    } catch {
      toast.error("Comment wasn't updated");
    } finally {
      setEditing(false);
    }
  };

  const bookmark = async () => {
    await toggleBookmark(postId);
    setMenuOpen(false);
    if (isSavedPage && onUnsave) onUnsave(postId);
  };

  const remove = async () => {
    try {
      await deletePost(postId);
      setMenuOpen(false);
      setRemoved(true);
      if (onDeleteSuccess) onDeleteSuccess(postId);
      window.dispatchEvent(new CustomEvent("postDeleted", { detail: { postId } }));
      toast.success("Deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Post deletion failed");
    }
  };

  const submitShare = async () => {
    setSharing(true);
    try {
      await sharePost(postId, shareBody);
      setShareBody("");
      setShareOpen(false);
      setSharesCount((count) => count + 1);
      toast.success("Post was shared!");
      window.dispatchEvent(new Event("refreshPosts"));
    } catch {
      toast.error("Post wasn't created");
    } finally {
      setSharing(false);
    }
  };

  const submitPostEdit = async () => {
    if (!editBody.trim() && !editImage && !displayImage) return;
    const formData = new FormData();
    formData.append("body", editBody.trim());
    if (editImage) formData.append("image", editImage);
    try {
      setUpdatingPost(true);
      const { data } = await updatePost(postId, formData);
      setDisplayBody(editBody.trim());
      setDisplayImage(data?.data?.post?.image || data?.post?.image || (editImage ? URL.createObjectURL(editImage) : displayImage));
      setEditPostOpen(false);
      setMenuOpen(false);
      setEditImage(null);
      toast.success(data?.message || "Post updated successfully");
      window.dispatchEvent(new Event("refreshPosts"));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Post wasn't updated");
    } finally {
      setUpdatingPost(false);
    }
  };

  const renderedComments = comments.length ? comments : post.topComment ? [post.topComment] : [];

  if (removed) return null;

  return (
    <article className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <img src={validImage(post.user?.photo)} alt={post.user?.name || "unknown"} className="h-11 w-11 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <NavLink to={`/profile/${post.user?._id}`} className="block truncate text-sm font-bold text-foreground hover:underline">{post.user?.name || "unknown"}</NavLink>
            <div className="flex flex-wrap items-center gap-1 space-x-1.5 text-xs text-muted-foreground">
              <NavLink to={`/profile/${post.user?._id}`}>@{post.user?.username || "unknown"}.</NavLink>
              <span>{post.createdAt ? new Date(post.createdAt).toLocaleString() : "unknown"}.</span>
              <span className="inline-flex items-center gap-1 capitalize"><MdPublic />{post.privacy || "public"}.</span>
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setMenuOpen((open) => !open)} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"><BsThreeDots /></button>
            {menuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                {post.user?._id === userData?._id ? <>
                  <button onClick={() => { setEditBody(displayBody); setEditPostOpen(true); setMenuOpen(false); }} className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"><FaRegEdit />Edit</button>
                  <button onClick={remove} className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-red-700 hover:bg-slate-50"><FaTrash />Delete</button>
                </> : <button onClick={bookmark} className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"><FaBookmark />{post.bookmarked ? "UnBookmark" : "Bookmark"}</button>}
              </div>
            )}
          </div>
        </div>
      </div>

      {displayBody && <NavLink to={`/post/${postId}`}><div className="px-4 pb-3"><p className="wrap-break-word whitespace-pre-line text-medium leading-relaxed">{displayBody}</p></div></NavLink>}
      {displayImage && <NavLink to={`/post/${postId}`}><img src={displayImage} alt="post-image" className="max-h-125 w-full object-cover" /></NavLink>}

      {post.isShare && post.sharedPost && <NavLink to={`/post/${post.sharedPost.id}`} className="mx-4 mb-3 block rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex items-center gap-2"><img src={validImage(post.sharedPost.user?.photo)} alt="" className="h-8 w-8 rounded-full object-cover" /><div><p className="text-sm font-bold text-slate-900">{post.sharedPost.user?.name}</p><p className="text-xs text-slate-500">@{post.sharedPost.user?.username}</p></div></div>
        {post.sharedPost.body && <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{post.sharedPost.body}</p>}
        {post.sharedPost.image && <img src={post.sharedPost.image} alt="shared-post" className="mt-2 max-h-80 w-full rounded-xl object-cover" />}
      </NavLink>}

      <div className="px-4 pb-2 pt-3 text-sm text-slate-500"><div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">{liked ? <AiFillDislike className="text-red-400" /> : <AiOutlineLike />}<button className="cursor-pointer font-semibold transition hover:text-[#1877f2] hover:underline">{likesCount} likes</button></div>
        <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm"><span className="inline-flex items-center gap-1"><AiOutlineRetweet />{sharesCount} Shares</span><button onClick={loadComments} className="inline-flex cursor-pointer items-center gap-1 hover:text-slate-700"><FaRegCommentAlt />{post.commentsCount || 0} Comments</button><NavLink to={`/post/${postId}`} className="rounded-md px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff]">View Details</NavLink></div>
      </div></div>
      <div className="mx-4 border-t border-slate-200" />
      <div className="grid grid-cols-3 gap-1 p-1">
        <button onClick={toggleLike} className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 sm:gap-2 sm:text-sm">{liked ? <AiFillDislike /> : <AiOutlineLike />}<span>{liked ? "Dislike" : "Like"}</span></button>
        <button onClick={loadComments} className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 sm:gap-2 sm:text-sm"><FaRegCommentAlt /><span>Comment</span></button>
        <button onClick={() => setShareOpen(true)} className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 sm:gap-2 sm:text-sm"><AiOutlineRetweet /><span>Share</span></button>
      </div>
      <div className="mx-4 mb-2 border-b border-slate-200" />
      <div className="flex flex-wrap items-center gap-2 p-2">
        <input value={comment} onChange={(event) => setComment(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submitComment()} type="text" placeholder="Comment on Post" className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-[17px] leading-relaxed text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white" />
        <div className="flex items-start"><button onClick={submitComment} disabled={!comment.trim() || sending} className="hidden rounded-full p-2.5 text-[18px] text-blue-400 hover:bg-gray-200 hover:text-blue-600 disabled:cursor-not-allowed sm:flex"><IoMdSend /></button><button className="hidden rounded-full p-2.5 text-[18px] text-blue-400 hover:bg-gray-200 hover:text-blue-600 sm:flex"><FaCamera /></button><button className="hidden rounded-full p-2.5 text-[18px] text-blue-400 hover:bg-gray-200 hover:text-blue-600 sm:flex"><FaRegSmile /></button></div>
      </div>

      {loadingComments && <p className="px-4 py-2 text-xs text-slate-500">Loading...</p>}
      {renderedComments.slice(0, 2).map((item) => <div key={item._id} className="flex gap-3 px-4 py-1">
        <img src={validImage(item.commentCreator?.photo)} alt="" className="h-8 w-8 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1"><div className="inline-block rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2"><NavLink to={`/profile/${item.commentCreator?._id}`}><p className="text-[15px] font-semibold text-gray-900">{item.commentCreator?.name || "unknown"}</p></NavLink><p className="mt-0.5 text-[15px] text-gray-800">{item.content}</p></div>{item.createdAt && <p className="ml-1 mt-1 text-[12px] text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>}<p className="ml-1 text-[12px] text-gray-500">{item.likes?.length || 0} Likes</p></div>
        <div className="relative self-start"><button onClick={() => setCommentMenu((current) => current === item._id ? null : item._id)} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"><BsThreeDots /></button>{commentMenu === item._id && <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">{userData?._id === item.commentCreator?._id ? <><button onClick={() => openCommentEditor(item)} className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"><FaRegEdit />Edit</button><button onClick={() => removeComment(item._id)} className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-red-700 hover:bg-slate-50"><FaTrash />Delete</button></> : <button className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"><AiOutlineLike />Like</button>}</div>}</div>
      </div>)}

      <Modal isOpen={Boolean(editingComment)} placement="top-center" onOpenChange={(open) => !open && setEditingComment(null)}>
        <ModalContent>{(onClose) => <><ModalHeader className="flex flex-col gap-1">Edit Comment</ModalHeader><ModalBody><textarea value={editCommentText} onChange={(event) => setEditCommentText(event.target.value)} rows="4" className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[17px] leading-relaxed text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white" /></ModalBody><ModalFooter><Button color="danger" variant="flat" onPress={onClose}>Cancel</Button><Button color="primary" isLoading={editing} onPress={saveComment}>Edit</Button></ModalFooter></>}</ModalContent>
      </Modal>

      <Modal isOpen={editPostOpen} placement="top-center" onOpenChange={setEditPostOpen}>
        <ModalContent>{(onClose) => <><ModalHeader className="flex flex-col gap-1">Edit Post</ModalHeader><ModalBody><div className="mb-3 flex items-center gap-3"><img src={validImage(userData?.photo)} alt="profile-pic" className="h-11 w-11 rounded-full object-cover" /><div className="flex-1"><p className="text-base font-extrabold text-slate-900">{userData?.name}</p><div className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700"><select className="bg-transparent outline-none"><option value="public">Public</option><option value="following">Followers</option><option value="only_me">Only me</option></select></div></div></div><div className="relative"><textarea value={editBody} onChange={(event) => setEditBody(event.target.value)} rows="4" placeholder={displayBody || `What's on your mind, ${userData?.name || "Name"}?`} className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[17px] leading-relaxed text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white" />{displayImage && <img src={editImage ? URL.createObjectURL(editImage) : displayImage} alt="post preview" className="max-h-125 w-full rounded-2xl object-cover" />}</div></ModalBody><ModalFooter><div className="mt-3 flex w-full flex-wrap items-center justify-between gap-2 border-t border-border pt-3"><div className="relative flex items-center gap-2"><label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"><FaImage className="text-medium text-green-500" /><span className="hidden sm:inline">Photo/Video</span><input onChange={(event) => setEditImage(event.target.files?.[0] || null)} type="file" accept="image/*" className="hidden" /></label><button type="button" className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"><FaRegSmile className="text-medium text-yellow-500" /><span className="hidden sm:inline">Feeling/Activity</span></button></div><div className="flex items-center gap-3"><Button color="danger" variant="flat" onPress={onClose}>Cancel</Button><Button color="primary" isLoading={updatingPost} onPress={submitPostEdit}>Edit</Button></div></div></ModalFooter></>}</ModalContent>
      </Modal>

      <Modal isOpen={shareOpen} placement="top-center" onOpenChange={setShareOpen}>
        <ModalContent>
          {(onClose) => <>
            <ModalHeader className="flex flex-col gap-1">Share Post</ModalHeader>
            <ModalBody>
              <div className="mb-3 flex items-center gap-3">
                <img src={validImage(userData?.photo)} alt="profile-pic" className="h-11 w-11 rounded-full object-cover" />
                <div className="flex-1"><p className="text-base font-extrabold text-slate-900">{userData?.name}</p><div className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700"><select className="bg-transparent outline-none"><option>Public</option><option>Followers</option><option>Only me</option></select></div></div>
              </div>
              <textarea value={shareBody} onChange={(event) => setShareBody(event.target.value)} rows="4" placeholder={`What's on your mind, ${userData?.name || "Route user"}?`} className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[17px] leading-relaxed text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white" />
              <div className="mx-4 mb-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="mb-2 flex items-center gap-2"><img src={validImage(post.user?.photo)} alt="" className="h-8 w-8 rounded-full object-cover" /><div><p className="text-sm font-bold text-slate-900">{post.user?.name}</p><p className="text-xs text-slate-500">@{post.user?.username}</p></div></div>{post.body && <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{post.body}</p>}{post.image && <img src={post.image} alt="shared-post" className="mt-2 max-h-80 w-full rounded-xl object-cover" />}</div>
            </ModalBody>
            <ModalFooter><div className="mt-3 flex w-full flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3"><button type="button" className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"><FaRegSmile className="text-yellow-500" /><span className="hidden sm:inline">Feeling/Activity</span></button><div className="flex items-center gap-3"><Button color="danger" variant="flat" onPress={onClose}>Cancel</Button><Button color="primary" isLoading={sharing} onPress={submitShare}>Share</Button></div></div></ModalFooter>
          </>}
        </ModalContent>
      </Modal>
    </article>
  );
}
