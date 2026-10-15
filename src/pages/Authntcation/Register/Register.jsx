import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCalendarAlt,
  FaUsers,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaKey,
} from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { SlCalender } from "react-icons/sl";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../../../services/auth";
import { Alert, Button, Input, Select, SelectItem } from "@heroui/react";
import { toast } from "react-toastify";

const registSchema = zod
  .object({
    name: zod
      .string()
      .nonempty("Name is Required")
      .min(3, "Not Less than 3 Chars")
      .max(10, "Not more than 10 Chars"),
    username: zod
      .string()
      .nonempty("username is required")
      .min(3, "Not less than 3 Chars")
      .max(10, "Not more than 10 Chars"),
    email: zod.string().nonempty("Email is Required").email("Email is not Valid"),
    password: zod
      .string()
      .nonempty("Password is Required")
      .min(3, "Not Less than 3 Chars")
      .max(11, "Not more than 10 Chars"),
    rePassword: zod.string().nonempty("rePassword is Required"),
    dateOfBirth: zod
      .string()
      .nonempty("Date of Birth is Required")
      .refine((value) => new Date().getFullYear() - new Date(value).getFullYear() >= 18, "Must be older than 18 years old"),
    gender: zod.string().nonempty("Gender is required"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Password doesn't match",
    path: ["rePassword"],
  });

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registSchema),
    mode: "all",
  });

  const submitRegisterForm = async (data) => {
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const response = await registerUser(data);
      const message = response.message || response.data?.message || "Account created successfully";
      setSuccessMessage(message);
      toast.success(message);
      navigate("/login");
    } catch (error) {
      const message = typeof error === "string" ? error : error?.message || "Something went wrong";
      setErrorMessage(message);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f0f2f5] px-4 py-8 sm:py-12 lg:flex lg:items-center"
      style={{ fontFamily: "Cairo, sans-serif" }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Section: Information */}
        <section className="w-full max-w-xl text-left">
          <h1 className="text-5xl font-extrabold -tracking-tight text-routeBlue sm:text-6xl lg:block">
            Route Posts
          </h1>
          <p className="mt-4 text-2xl font-medium text-slate-800 lg:block">
            Connect with friends and the world around you on Route Posts.
          </p>

          <div className="card mt-6 rounded-2xl border border-border bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
            <p className="text-sm font-extrabold uppercase text-routeBlue">
              About Route Academy
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              Egypt's leading it training center since 2012
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Route Academy is the premier IT training center in Egypt,
              established in 2012. We specialize in delivering high-quality training courses in programming, web development, and application development. We've identified the unique challenges people may face when learning new technology and made efforts to provide strategies to overcome them.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { val: "2012", label: "Founded" },
                { val: "40K+", label: "Graduates" },
                { val: "50+", label: "Partner Companies" },
                { val: "5", label: "Branches" },
                { val: "20", label: "Diplomas Available" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-[#f2f6ff] px-3 py-2"
                >
                  <p className="text-routeBlue font-extrabold text-base">
                    {stat.val}
                  </p>
                  <p className="text-[12px] font-bold uppercase tracking-wide text-slate-600">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Section: Register Form */}
        <section className="order-1 w-full max-w-107.5 lg:order-2">
          <div className="rounded-2xl bg-white p-4 sm:p-6">
            {/* Mobile Header */}
            <div className="mb-4 text-center lg:hidden">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#00298d]">
                Route Posts
              </h1>
              <p className="mt-1 text-base font-medium leading-snug text-slate-700">
                Create a new account
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button type="button" className="rounded-lg py-2 text-sm font-extrabold transition text-slate-600 hover:text-slate-800 cursor-pointer"><NavLink to="/login">login</NavLink></button>
              <button className="rounded-lg py-2 text-sm font-extrabold transition bg-white text-[#00298d] shadow-sm">
                Register
              </button>
            </div>

            <h2 className="text-2xl font-extrabold text-[#00298d]">
              Create a new account
            </h2>
            <p className="mt-1 text-sm text-slate-500 mb-5">
              It is quick and easy.
            </p>

            <form
              onSubmit={handleSubmit(submitRegisterForm)}
              className="space-y-3.5"
            >
              {successMessage && <Alert color="success" title={successMessage} />}
              {errorMessage && <Alert color="danger" title={errorMessage} />}
              <div><Input {...register("name")} labelPlacement="outside" placeholder="Full Name" startContent={<FaUser className="text-xl text-default-400 pointer-events-none shrink-0 mr-2.5" />} type="text" />{errors.name && <p className="mt-1 text-tiny text-danger">{errors.name.message}</p>}</div>
              <div><Input {...register("username")} labelPlacement="outside" placeholder="Username" startContent={<MdAlternateEmail className="text-xl text-default-400 pointer-events-none shrink-0 mr-2.5" />} type="text" />{errors.username && <p className="mt-1 text-tiny text-danger">{errors.username.message}</p>}</div>

              <div><Input {...register("email")} labelPlacement="outside" placeholder="Email address" type="email" startContent={<MdAlternateEmail className="text-xl text-default-400 pointer-events-none shrink-0 mr-2.5" />} />{errors.email && <p className="mt-1 text-tiny text-danger">{errors.email.message}</p>}</div>

              {/* Gender */}
              <div><Select {...register("gender")} labelPlacement="outside" placeholder="Select gender" aria-label="gender" startContent={<FiUsers className="text-xl text-default-400 pointer-events-none shrink-0 mr-2.5" />}><SelectItem key="male">Male</SelectItem><SelectItem key="female">Female</SelectItem></Select>{errors.gender && <p className="mt-1 text-tiny text-danger">{errors.gender.message}</p>}</div>

              {/* Date of Birth */}
              <div><Input {...register("dateOfBirth")} labelPlacement="outside" placeholder="Birth date" type="date" startContent={<SlCalender className="text-xl text-default-400 pointer-events-none shrink-0 mr-2.5" />} />{errors.dateOfBirth && <p className="mt-1 text-tiny text-danger">{errors.dateOfBirth.message}</p>}</div>

              <div><Input {...register("password")} labelPlacement="outside" placeholder="Password" type={showPassword ? "text" : "password"} startContent={<FaKey className="text-xl text-default-400 pointer-events-none shrink-0 mr-2.5" />} endContent={showPassword ? <FaEye className="text-xl text-default-600 cursor-pointer" onClick={() => setShowPassword(false)} /> : <FaEyeSlash className="text-xl text-default-600 cursor-pointer" onClick={() => setShowPassword(true)} />} />{errors.password && <p className="mt-1 text-tiny text-danger">{errors.password.message}</p>}</div>
              <div><Input {...register("rePassword")} labelPlacement="outside" placeholder="Confirm Password" type={showConfirmation ? "text" : "password"} startContent={<FaKey className="text-xl text-default-400 pointer-events-none shrink-0 mr-2.5" />} endContent={showConfirmation ? <FaEye className="text-xl text-default-600 cursor-pointer" onClick={() => setShowConfirmation(false)} /> : <FaEyeSlash className="text-xl text-default-600 cursor-pointer" onClick={() => setShowConfirmation(true)} />} />{errors.rePassword && <p className="mt-1 text-tiny text-danger">{errors.rePassword.message}</p>}</div>
              <Button isLoading={isLoading || isSubmitting} type="submit" className="w-full rounded-xl py-3 text-base font-extrabold text-white bg-[#00298d]">Create a new Account</Button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
