"use client";
import { useState } from "react";
import Head from "next/head";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <Head>
        <title>{isLogin ? "Login" : "Register"} | Mobgsm</title>
        <meta
          name="description"
          content={
            isLogin
              ? "Log in to manage your account"
              : "Create your account "
          }
        />
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        {/* Left section: form */}
        <div className="flex w-full items-center justify-center p-6">
          <div className="w-full max-w-md space-y-6">
            {isLogin ? <LoginForm /> : <RegisterForm />}

            {/* Toggle link */}
            <p className="text-center text-gray-600">
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    className="text-blue-600 font-semibold hover:underline"
                    onClick={() => setIsLogin(false)}
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    className="text-blue-600 font-semibold hover:underline"
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

       
      </div>
    </>
  );
}
