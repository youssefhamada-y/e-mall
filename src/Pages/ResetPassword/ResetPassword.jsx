/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { usercontext } from "../Components/Context/UserContext/UserContext";

function ResetPassword() {
  let id;
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { token, settoken } = useContext(usercontext);

  const [isLoginActive, setIsLoginActive] = useState(true);
  const passwordregex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

  const validationSchemaLogin = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    new_password: Yup.string()
      .required("Password is required")
      .matches(
        passwordregex,
        "Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"
      ),
  });

  const formikLogin = useFormik({
    initialValues: {
      email: "",
      new_password: "",
    },
    onSubmit: resetpassword,
    validationSchema: validationSchemaLogin,
  });

  async function resetpassword(values) {
    try {
      const options = {
        url: `http://localhost/eMall/Authentication/resetPassword.php`,
        method: "POST",
        data: values,
      };
      const response = await axios.request(options);
      console.log(response);

      id = toast.loading("Loading...");

      if (response.data.message === "Password reset successful") {
        toast.success("Password reset successful");
        navigate("/auth/login");
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
                  To keep connected with us please reset your password
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
            {/* Reset Password Form */}
            <form
              onSubmit={formikLogin.handleSubmit}
              className={`w-full absolute top-1/2 left-[10px] p-4 -translate-y-1/2 space-y-4 md:space-y-6 transition-transform duration-300 ${
                isLoginActive ? "translate-x-[0]" : "translate-x-full"
              }`}
            >
              <h3 className="text-xl md:text-2xl text-center font-bold text-cyan-900">
                Reset Password
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
                <input
                  name="new_password"
                  onBlur={formikLogin.handleBlur}
                  onChange={formikLogin.handleChange}
                  value={formikLogin.values.new_password}
                  type="password"
                  placeholder="New Password"
                  required
                  className="w-full p-2 text-sm md:text-base border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                />
                {formikLogin.errors.new_password && formikLogin.touched.new_password ? (
                  <div className="text-red-500 text-xs md:text-sm">{formikLogin.errors.new_password}</div>
                ) : (
                  ""
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-900 text-white py-2 text-sm md:text-base rounded-full hover:bg-cyan-900 transition-colors duration-300"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
