/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { usercontext } from "../Components/Context/UserContext/UserContext";
import { motion } from "framer-motion";


function VerifyOtp() {
  let id;
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const {token , settoken} = useContext(usercontext)

  const [isLoginActive, setIsLoginActive] = useState(true);

  const validationSchemaLogin = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    otp: Yup.string().required("OTP is required"),
  });

  const formikLogin = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    onSubmit: verifyotp,
    validationSchema: validationSchemaLogin,
  });

  async function verifyotp(values) {
    try {
      const options = {
        url: `http://localhost/eMall/Authentication/verifyOTP.php`,
        method: "POST",
        data: values,
      };
      const response = await axios.request(options);
      console.log(response);

      id = toast.loading("Loading...");

      if (response.data.message === "OTP verified. Proceed to reset password.") {
        toast.success("OTP verified. Proceed to reset password.");
        navigate("/auth/reset-password");
        toast.dismiss(id);
      } else {
        toast.error(response.data.message);
        toast.dismiss(id);
      }
    } catch (error) {
      console.log(error);
      toast.dismiss(id);
      const errorMessage =
        error.response?.data?.errors?.[0] || "An unexpected error occurred";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center py-20 sm:py-40 mt-3 bg-gray-100">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Panel */}
          <div
            className={`bg-cyan-900 h-[500px] md:h-[700px] p-5 flex flex-col items-center justify-center gap-6 transition-colors duration-300 ${
              !isLoginActive && "bg-cyan-900"
            }`}
          >
            {isLoginActive ? (
              <>
                <h2 className="text-2xl md:text-3xl text-center font-bold text-white">Welcome Back!</h2>
                <p className="text-white text-center text-sm md:text-base">
                  To keep connected with us please verify your OTP
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl text-center font-bold text-white">
                  Create Account
                </h2>
                <p className="text-white text-center text-sm md:text-base">
                  or use your email for registration
                </p>
                <button
                  onClick={() => setIsLoginActive(true)}
                  className="border-2 border-white rounded-full px-6 py-2 text-sm md:text-base text-white uppercase hover:bg-white hover:text-blue-600 transition-colors duration-300"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Right Panel */}
          <div className="relative overflow-hidden p-4 sm:p-8 h-[500px] md:h-[700px]">
            {/* Verify OTP Form */}
            <form
              onSubmit={formikLogin.handleSubmit}
              className={`w-full absolute top-1/2 left-[10px] p-4 -translate-y-1/2 space-y-4 md:space-y-6 transition-transform duration-300 ${
                isLoginActive ? "translate-x-[0]" : "translate-x-full"
              }`}
            >
              <h3 className="text-xl md:text-2xl text-center font-bold text-cyan-900">
                Verify OTP
              </h3>
              <div className="space-y-3 md:space-y-4">
                <input
                  name="email"
                  onBlur={formikLogin.handleBlur}
                  onChange={formikLogin.handleChange}
                  value={formikLogin.values.email}
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full p-2 text-sm md:text-base border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                />
                {formikLogin.errors.email && formikLogin.touched.email ? (
                  <div className="text-red-500 text-xs md:text-sm">{formikLogin.errors.email}</div>
                ) : (
                  ""
                )}
                
                <div className="mt-6">
                  <div className="flex justify-center space-x-4">
                    {[...Array(6)].map((_, index) => (
                      <motion.input
                        key={index}
                        name={`otpDigit${index}`}
                        type="text"
                        maxLength="1"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:border-cyan-900 focus:ring-2 focus:ring-cyan-900"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value && index < 5) {
                            e.target.nextElementSibling?.focus();
                          }
                          
                          // Update the formik otp value
                          const otpDigits = [...Array(6)].map((_, i) => 
                            document.querySelector(`input[name=otpDigit${i}]`)?.value || ""
                          );
                          formikLogin.setFieldValue("otp", otpDigits.join(""));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !e.target.value && index > 0) {
                            e.target.previousElementSibling?.focus();
                          }
                        }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileFocus={{ scale: 1.05 }}
                      />
                    ))}
                  </div>
                  <input
                    name="otp"
                    type="hidden"
                    value={formikLogin.values.otp}
                    onChange={formikLogin.handleChange}
                    onBlur={formikLogin.handleBlur}
                  />
                  {formikLogin.errors.otp && formikLogin.touched.otp ? (
                    <div className="text-red-500 text-xs md:text-sm text-center mt-2">{formikLogin.errors.otp}</div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-900 text-white py-2 text-sm md:text-base rounded-full hover:bg-cyan-900 transition-colors duration-300 mt-6"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyOtp;
