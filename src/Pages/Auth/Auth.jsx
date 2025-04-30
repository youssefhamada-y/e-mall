import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { usercontext } from "../Components/Context/UserContext/UserContext";

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
        url: `http://localhost/eMall/Authentication/login.php`,
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

      if (response.data.message==="Login successful") {
      
        toast.success("Login Successful");

        // Introduce a delay between "Login Successful" and role-based toast
        setTimeout(() => {
          if (response.data.user.role === "user") {
            localStorage.setItem("token", response.data.user.token);

            // Set the token state
            settoken(response.data.token)
            toast.success("Redirecting to User Home...");
            setTimeout(() => navigate("/"), 2000);
          } else if (response.data.user.role === "mallAdmin") {
            localStorage.setItem("token", response.data.token);

            // Set the token state
            settoken(response.data.token)
            toast.success("Redirecting to Mall Admin Dashboard...");
            setTimeout(() => navigate("/admin/home"), 2000);
          } else if (response.data.user.role === "storeAdmin") {
            localStorage.setItem("token", response.data.token);

            // Set the token state
            settoken(response.data.token)
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
      <div className="min-h-screen w-full flex items-center justify-center py-12 mt-36 bg-gray-100">
        <div className="w-full max-w-5xl mx-4 bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Panel */}
          <div
            className={`bg-cyan-900 p-5 flex flex-col items-center justify-center gap-6 transition-colors duration-300 min-h-[400px] md:h-[700px] ${
              !isLoginActive && "bg-cyan-900"
            }`}
          >
            {isLoginActive ? (
              <>
                <h2 className="text-white text-2xl md:text-3xl font-bold text-center">Welcome Back!</h2>
                <p className="text-white text-center text-sm md:text-base px-4">
                  To keep connected with us please login with your personal info
                </p>
                <button
                  onClick={() => setIsLoginActive(false)}
                  className="border-2 border-white rounded-full px-6 md:px-8 py-2 text-white text-sm md:text-base uppercase hover:bg-white hover:text-blue-600 transition-colors duration-300"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <h2 className="text-white text-2xl md:text-3xl font-bold text-center">
                  Create Account
                </h2>
                <p className="text-white text-center text-sm md:text-base px-4">
                  or use your email for registration
                </p>
                <button
                  onClick={() => setIsLoginActive(true)}
                  className="border-2 border-white rounded-full px-6 md:px-8 py-2 text-white text-sm md:text-base uppercase hover:bg-white hover:text-blue-600 transition-colors duration-300"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Right Panel */}
          <div className="relative overflow-hidden p-4 md:p-8 min-h-[400px] md:h-[700px]">
            {/* Login Form */}
            <form
              onSubmit={formikLogin.handleSubmit}
              className={`w-full absolute top-1/2 left-[10px] p-4 -translate-y-1/2 space-y-4 md:space-y-6 transition-transform duration-300 ${
                isLoginActive ? "translate-x-[0]" : "translate-x-full"
              }`}
            >
              <h3 className="text-xl md:text-2xl text-center font-bold text-cyan-900">
                Sign in To Your Account
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
                <div className="relative">
                  <input
                    name="password"
                    onBlur={formikLogin.handleBlur}
                    onChange={formikLogin.handleChange}
                    value={formikLogin.values.password}
                    type={showPassword ? "text" : "password"} // Toggle password visibility
                    required
                    placeholder="Password"
                    className="w-full p-2 text-sm md:text-base border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                    className="absolute right-0 top-0 mt-2 mr-2 text-gray-500"
                  >
                    {showPassword ? "Hide" : "Show"} {/* Button text changes based on state */}
                  </button>
                </div>
                {formikLogin.errors.password && formikLogin.touched.password ? (
                  <div className="text-red-500 text-xs md:text-sm">
                    {formikLogin.errors.password}
                  </div>
                ) : (
                  ""
                )}
                
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-900 text-white py-2 text-sm md:text-base rounded-full hover:bg-cyan-900 transition-colors duration-300"
              >
                SIGN IN
              </button>
             <div className="text-right">
             <Link className="text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-900 transition-all duration-300" to={"/auth/forgot-password"}>
                Forgot Password ?
                </Link>
             </div>
            </form>

            {/* Signup Form */}
            <form
              onSubmit={formik.handleSubmit}
              className={`w-full h-screen absolute top-1/2 left-[10px] p-4 -translate-y-1/2 space-y-4 md:space-y-6 transition-transform duration-300 ${
                !isLoginActive ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <h3 className="text-2xl md:text-3xl text-center font-bold text-cyan-900">
                Create Account
              </h3>
              <div className="space-y-3 md:space-y-4">
                <input
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  type="text"
                  required
                  placeholder="Name"
                  className="w-full p-2 text-sm md:text-base border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                />
                {formik.errors.name && formik.touched.name ? (
                  <div className="text-red-500 text-xs md:text-sm">{formik.errors.name}</div>
                ) : (
                  ""
                )}

                <input
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  type="email"
                  required
                  placeholder="Email"
                  className="w-full p-2 text-sm md:text-base border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                />
                {formik.errors.email && formik.touched.email ? (
                  <div className="text-red-500 text-xs md:text-sm">{formik.errors.email}</div>
                ) : (
                  ""
                )}
                {error ? <div className="text-red-500 text-xs md:text-sm">{error}</div> : ""}
                <div className="relative">
                  <input
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    type={showPassword ? "text" : "password"} // Toggle password visibility
                    required
                    placeholder="Password"
                    className="w-full p-2 text-sm md:text-base border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                    className="absolute right-0 top-0 mt-2 mr-2 text-gray-500"
                  >
                    {showPassword ? "Hide" : "Show"} {/* Button text changes based on state */}
                  </button>
                </div>
                {formik.errors.password && formik.touched.password ? (
                  <div className="text-red-500 text-xs md:text-sm">{formik.errors.password}</div>
                ) : (
                  ""
                )}
                <div className="relative">
                  <input
                    name="confirmPassword"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                    type={showPassword ? "text" : "password"} // Toggle password visibility
                    required
                  placeholder="Confirm Password"
                  className="w-full p-2 text-sm md:text-base border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                    className="absolute right-0 top-0 mt-2 mr-2 text-gray-500"
                  >
                    {showPassword ? "Hide" : "Show"} {/* Button text changes based on state */}
                  </button>
                </div>
                {formik.errors.confirmPassword &&
                formik.touched.confirmPassword ? (
                  <div className="text-red-500 text-xs md:text-sm">
                    {formik.errors.confirmPassword}
                  </div>
                ) : (
                  ""
                )}

                <input
                  name="phone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  type="tel"
                  required
                  placeholder="Phone Number"
                  className="w-full p-2 text-sm md:text-base border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                />
                {formik.errors.phone && formik.touched.phone ? (
                  <div className="text-red-500 text-xs md:text-sm">{formik.errors.phone}</div>
                ) : (
                  ""
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-900 text-white py-2 text-sm md:text-base me-2 rounded-full hover:bg-cyan-900 transition-colors duration-300"
              >
                SIGN UP
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;
