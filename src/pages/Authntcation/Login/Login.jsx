import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "./../../../services/auth";
import { FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { UserContext } from "../../../App";
import { Alert, Button, Input } from "@heroui/react";
import { toast } from "react-toastify";

const loginSchema = zod.object({
  email: zod.string().email("*Email is invalid"),
  password: zod.string().min(8, "*Password is Too Short"),
});

export default function Login() {
  const [isLoading, setisLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "all",
  });

  const submitLoginForm = async (data) => {
    setisLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const response = await loginUser(data);
      const { token, user } = response;
      const message = response.message || "signed in successfully";

      if (!token) throw new Error("Something went wrong");
      localStorage.setItem("userToken", token);
      if (user) localStorage.setItem("userData", JSON.stringify(user));
      setUserData(user);
      setSuccessMessage(message);
      toast.success(message);
      navigate("/", { replace: true, state: { successMsg: message } });
    } catch (error) {
      const message = error?.message || "Something went wrong";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f0f2f5] px-4 py-8 sm:py-12 lg:flex lg:items-center"
      style={{ fontFamily: "Cairo, sans-serif" }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Section 1: Content (Left/Order 2) */}
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

        {/* Section 2: Login Form (Right/Order 1) */}
        <section className="order-1 w-full max-w-107.5 lg:order-2">
          <div className="rounded-2xl bg-white p-4 sm:p-6">
            {/* Mobile Header */}
            <div className="mb-4 text-center lg:hidden">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#00298d]">
                Route Posts
              </h1>
              <p className="mt-1 text-base font-medium leading-snug text-slate-700">
                Connect with friends and the world around you.
              </p>
            </div>

            {/* Custom Tabs Style */}
            <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button className="rounded-lg py-2 text-sm font-extrabold transition bg-white text-[#00298d] shadow-sm">
                login
              </button>
              <button type="button" className="rounded-lg py-2 text-sm font-extrabold transition text-slate-600 hover:text-slate-800 cursor-pointer">
                <NavLink to="/register">Register</NavLink>
              </button>
            </div>

            <h2 className="text-2xl font-extrabold text-[#00298d]">
              Login to Route Posts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Log in and continue your social journey.
            </p>

            <form
              onSubmit={handleSubmit(submitLoginForm)}
              className="mt-5 space-y-3.5"
            >
              {successMessage && <Alert color="success" title={successMessage} />}
              {errorMessage && <Alert color="danger" title={errorMessage} />}
              {/* Email Input */}
              <div className="relative">
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      labelPlacement="outside"
                      placeholder="email"
                      errorMessage={errors.email?.message}
                      startContent={<MdAlternateEmail className="pointer-events-none mr-2.5 shrink-0 text-xl text-default-400" />}
                      type="email"
                    />
                  )}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      {...field}
                      labelPlacement="outside"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      errorMessage={errors.password?.message}
                      startContent={<FaKey className="pointer-events-none mr-2.5 shrink-0 text-xl text-default-400" />}
                      endContent={showPassword ? <FaEye className="cursor-pointer text-xl text-default-600" onClick={() => setShowPassword(false)} /> : <FaEyeSlash className="cursor-pointer text-xl text-default-600" onClick={() => setShowPassword(true)} />}
                    />
                  )}
                />
              </div>

              <Button isLoading={isLoading} type="submit" className="w-full rounded-xl py-3 text-base font-extrabold text-white bg-[#00298d]">Login</Button>

              <button
                type="button"
                className="mx-auto block text-sm font-semibold text-[#00298d] transition hover:underline"
              >
                Forgot password?
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
