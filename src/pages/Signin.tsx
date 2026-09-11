import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import AuthLogo from "@/components/global/AuthLogo";
import FormInput from "@/components/form-fields/FormInput";
import { login } from "@/api/auth";
import { loginSchema } from "@/utils/schemas";
import { useValidateSchema } from "@/hooks/useValidateSchema";

export default function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validatedData = useValidateSchema(loginSchema, formData);
    if (!validatedData) return;

    setLoading(true);

    try {
      const res = await login(validatedData);
      console.log("LOGIN RESPONSE:", res);

      const token = res?.access || res?.data?.access;
      console.log("Storing token:", token ? "yes (length " + token.length + ")" : "NO - token is undefined");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("access");

      if (token) {
        localStorage.setItem("admin_token", token);
      }
      navigate("/admin");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm text-center pt-6 md:pt-10"
      >
        <div className="w-max mx-auto mb-2">
          <AuthLogo />
        </div>

        <h1 className="text-2xl font-bold">Sign in</h1>

        <p className="text-sm text-gray-500 mb-6">
          Enter your email and password you created during registration
        </p>

        <div className="space-y-3 mb-3 text-left">
          <FormInput
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            handleInputChange={handleChange}
            required
          />

          <FormInput
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            handleInputChange={handleChange}
            required
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-gray-600 mt-3">
          Don&apos;t have an account?{" "}
          <Link
            to="/sign-up"
            className="text-primary font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>

        <p className="text-xs text-gray-600 mt-3 leading-snug">
          By clicking the{" "}
          <span className="font-medium text-black">Sign in</span> button you
          accept the{" "}
          <Link
            to="/privacy-policy"
            className="text-primary font-medium hover:underline"
          >
            Terms of the Privacy Policy
          </Link>
        </p>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t-2 border-gray-300" />
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-grow border-t-2 border-gray-300" />
        </div>

        <div className="flex justify-center gap-6">
          <button
            aria-label="Continue with Facebook"
            className="w-8 h-8 rounded-full bg-[#1877F2] grid place-items-center"
          >
            <FaFacebookF className="w-4 h-4" color="#FFFFFF" />
          </button>

          <img
            src="https://img.icons8.com/color/48/google-logo.png"
            alt="Google"
            className="w-8 h-8"
          />
          <img
            src="https://img.icons8.com/ios-filled/50/mac-os.png"
            alt="Apple"
            className="w-8 h-8"
          />
        </div>
      </form>
    </div>
  );
}
