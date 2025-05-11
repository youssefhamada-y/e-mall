import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { usercontext } from "../Components/Context/UserContext/UserContext";
import { motion } from "framer-motion"; // Add framer-motion for animations

function Auth() {
  let id;
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const {token , settoken} = useContext(usercontext)

  const passwordregex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  const validationSchema = Yup.object({
    name: Yup.string()
      .required(" Name is required")
      .min(2, " Name is too short")
      .max(15, " Name is too long"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        passwordregex,
        "Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"
      ),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref('password'), null], "Passwords must match"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^01[0125][0-9]{8}$/, "Phone number must be 10 digits"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
    onSubmit: sendDataToRegister,
    validationSchema,
  });
  async function sendDataToRegister(values) {
    try {
      const options = {
        url: `http://localhost/eMall/Authentication/register.php`,
        method: "POST",
        data: values,
      };
      id = toast.loading("Loading...");
      const response = await axios.request(options);
      console.log(response);
      toast.dismiss(id);
      if (response.data.errors) {
        toast.error(response.data.errors[0]); // Show the first error message
        setError(response.data.errors[0]); // Set error state to display it in the form
        return; // Stop execution if there's an error
      }
      if (response.data.message == "User created successfully") {
        toast.success("Registeration Success");
        setIsLoginActive(true);
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

  const [isLoginActive, setIsLoginActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // loginnnnnnnnnnnnnnnn

  const validationSchemaLogin = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        passwordregex,
        "Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"
      ),
  });
  const formikLogin = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: login,
    validationSchema: validationSchemaLogin,
  });

  async function login(values) {
    try {
      const options = {
        url: `http://localhost/eMall/Authentication/logintest.php`,
        method: "POST",
        data: values,
      };
      id = toast.loading("Loading...");
      const response = await axios.request(options);
      console.log(response);
      toast.dismiss(id);
      if (response.data.errors) {
        toast.error(response.data.errors[0]); // Show the first error message
        setError(response.data.errors[0]); // Set error state
        return; // Stop execution if there's an error
      }

      if (response.data.message === "Login successful") {
        toast.success("Login Successful");

        // Introduce a delay between "Login Successful" and role-based toast
        setTimeout(() => {
          if (response.data.user.role === "user") {
            localStorage.setItem("token", response.data.user.token); // FIXED: Changed from response.data.token

            // Set the token state
            settoken(response.data.user.token) // FIXED: Changed from response.data.token
            toast.success("Redirecting to User Home...");
            setTimeout(() => navigate("/"), 2000);
          } else if (response.data.user.role === "mallAdmin") {
            localStorage.setItem("token", response.data.user.token); // FIXED: Changed from response.data.token

            // Set the token state
            settoken(response.data.user.token) // FIXED: Changed from response.data.token
            toast.success("Redirecting to Mall Admin Dashboard...");
            setTimeout(() => navigate("/admin/home"), 2000);
          } else if (response.data.user.role === "storeAdmin") {
            localStorage.setItem("token", response.data.user.token); // FIXED: Changed from response.data.token

            // Set the token state
            settoken(response.data.user.token) // FIXED: Changed from response.data.token
            toast.success("Redirecting to Store Admin Dashboard...");
            setTimeout(() => navigate("/store/home"), 2000);
          }
        }, 1500); // Delay before showing role-based toast
      } else {
        toast.error("Invalid login credentials");
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
      <div className="min-h-screen w-full flex items-center justify-center py-12 mt-36 bg-gradient-to-b from-gray-50 to-gray-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
        >
          {/* Left Panel */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`bg-gradient-to-br ${
              isLoginActive ? "from-cyan-800 to-blue-900" : "from-blue-800 to-cyan-900"
            } p-5 flex flex-col items-center justify-center gap-6 transition-all duration-500 min-h-[400px] md:h-[700px] relative overflow-hidden`}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-5 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-5 rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-5 rounded-full"></div>
            </div>
            
            {isLoginActive ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="z-10 flex flex-col items-center"
              >
                <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-4">Welcome Back!</h2>
                <div className="w-16 h-1 bg-white rounded-full mb-6"></div>
                <p className="text-white text-center text-sm md:text-base px-4 mb-8 max-w-xs">
                  To keep connected with us please login with your personal info
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLoginActive(false)}
                  className="border-2 border-white rounded-full px-8 py-3 text-white text-sm md:text-base uppercase hover:bg-white hover:text-blue-600 transition-colors duration-300 font-semibold tracking-wide"
                >
                  Sign Up
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="z-10 flex flex-col items-center"
              >
                <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-4">
                  Create Account
                </h2>
                <div className="w-16 h-1 bg-white rounded-full mb-6"></div>
                <p className="text-white text-center text-sm md:text-base px-4 mb-8 max-w-xs">
                  Join our community and discover amazing products
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLoginActive(true)}
                  className="border-2 border-white rounded-full px-8 py-3 text-white text-sm md:text-base uppercase hover:bg-white hover:text-blue-600 transition-colors duration-300 font-semibold tracking-wide"
                >
                  Sign In
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* Right Panel */}
          <div className="relative overflow-hidden p-4 md:p-8 min-h-[400px] md:h-[700px] bg-white">
            {/* Login Form */}
            <motion.form
              onSubmit={formikLogin.handleSubmit}
              className={`w-full absolute top-1/2 left-[10px] p-4 -translate-y-1/2 space-y-6 transition-all duration-500 ${
                isLoginActive ? "translate-x-[0]" : "translate-x-full"
              }`}
            >
              <h3 className="text-xl md:text-2xl text-center font-bold bg-gradient-to-r from-cyan-800 to-blue-600 bg-clip-text text-transparent mb-8">
                Sign in To Your Account
              </h3>
              <div className="space-y-5">
                <div className="relative">
                  <input
                    name="email"
                    onBlur={formikLogin.handleBlur}
                    onChange={formikLogin.handleChange}
                    value={formikLogin.values.email}
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full p-3 pl-10 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
                {formikLogin.errors.email && formikLogin.touched.email ? (
                  <div className="text-red-500 text-xs md:text-sm -mt-2">{formikLogin.errors.email}</div>
                ) : (
                  ""
                )}
                <div className="relative">
                  <input
                    name="password"
                    onBlur={formikLogin.handleBlur}
                    onChange={formikLogin.handleChange}
                    value={formikLogin.values.password}
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    className="w-full p-3 pl-10 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
                {formikLogin.errors.password && formikLogin.touched.password ? (
                  <div className="text-red-500 text-xs md:text-sm -mt-2">
                    {formikLogin.errors.password}
                  </div>
                ) : (
                  ""
                )}
                
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-800 to-blue-600 text-white py-3 text-sm md:text-base rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
              >
                SIGN IN
              </motion.button>
             <div className="text-right mt-4">
             <Link className="text-sm md:text-base font-semibold text-blue-600 hover:text-blue-900 transition-all duration-300" to={"/auth/forgot-password"}>
                Forgot Password?
                </Link>
             </div>
             
            
            </motion.form>

            {/* Signup Form */}
            <motion.form
              onSubmit={formik.handleSubmit}
              className={`w-full h-screen absolute top-1/2 left-[10px] p-4 -translate-y-1/2 space-y-5 transition-all duration-500 ${
                !isLoginActive ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <h3 className="text-2xl md:text-3xl text-center font-bold bg-gradient-to-r from-blue-800 to-cyan-600 bg-clip-text text-transparent mb-6">
                Create Account
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    name="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    type="text"
                    required
                    placeholder="Name"
                    className="w-full p-3 pl-10 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
                {formik.errors.name && formik.touched.name ? (
                  <div className="text-red-500 text-xs md:text-sm -mt-2">{formik.errors.name}</div>
                ) : (
                  ""
                )}

                <div className="relative">
                  <input
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    type="email"
                    required
                    placeholder="Email"
                    className="w-full p-3 pl-10 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
                {formik.errors.email && formik.touched.email ? (
                  <div className="text-red-500 text-xs md:text-sm -mt-2">{formik.errors.email}</div>
                ) : (
                  ""
                )}
                {error ? <div className="text-red-500 text-xs md:text-sm -mt-2">{error}</div> : ""}
                
                <div className="relative">
                  <input
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    className="w-full p-3 pl-10 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
                {formik.errors.password && formik.touched.password ? (
                  <div className="text-red-500 text-xs md:text-sm -mt-2">{formik.errors.password}</div>
                ) : (
                  ""
                )}
                
                <div className="relative">
                  <input
                    name="confirmPassword"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Confirm Password"
                    className="w-full p-3 pl-10 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
                {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
                  <div className="text-red-500 text-xs md:text-sm -mt-2">
                    {formik.errors.confirmPassword}
                  </div>
                ) : (
                  ""
                )}

                <div className="relative">
                  <input
                    name="phone"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                    type="tel"
                    required
                    placeholder="Phone Number"
                    className="w-full p-3 pl-10 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <i className="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
                {formik.errors.phone && formik.touched.phone ? (
                  <div className="text-red-500 text-xs md:text-sm -mt-2">{formik.errors.phone}</div>
                ) : (
                  ""
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-800 to-cyan-600 text-white py-3 text-sm md:text-base rounded-lg hover:shadow-lg transition-all duration-300 font-semibold mt-4"
              >
                SIGN UP
              </motion.button>
              
              {/* Terms and conditions */}
              <p className="text-xs text-center text-gray-500 mt-4">
                By signing up, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Auth;
