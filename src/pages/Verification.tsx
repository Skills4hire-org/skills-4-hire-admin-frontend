import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/utils/axiosConfig";
import { toast } from "sonner";

const BackArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-gray-700"
  >
    <path d="M19 12H5"></path>
    <path d="M12 19L5 12 12 5"></path>
  </svg>
);

export default function Verification() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    const newCode = [...code];

    if (/^\d?$/.test(value)) {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = async () => {
    const enteredCode = code.join("");

    if (enteredCode.length !== 4) {
      alert("Please enter the complete 4-digit code");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/v1/auth/verify/", {
        otp: enteredCode,
      });

      navigate("/onboarding");
    } catch (error: any) {
      toast.error(error?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };





  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 font-sans">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link to='/sign-up' className="p-2 rounded-full hover:bg-gray-200 transition-colors block w-max  "
          >
            <BackArrowIcon />
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900">
            Verification Code
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter the 4-digit code sent to your registered email address
          </p>
        </div>

        <div className="flex justify-center gap-3 sm:gap-4 mb-8">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el: HTMLInputElement | null) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg border border-gray-300 text-center text-xl sm:text-2xl font-semibold text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-primary text-white py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Confirm"}
        </button>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Didn’t get the code?{" "}
          <button className="text-primary font-medium hover:underline">
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
