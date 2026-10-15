export default function PostPlaceHolder() {
  return (
    <div className="w-full animate-pulse space-y-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-default-300" />
        <div className="flex w-full flex-col gap-2">
          <div className="h-3 w-3/5 rounded-lg bg-default-300" />
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        </div>
      </div>
      <div className="h-24 rounded-lg bg-default-300" />
      <div className="space-y-3">
        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
        <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        <div className="h-3 w-2/5 rounded-lg bg-default-300" />
      </div>
    </div>
  );
}
