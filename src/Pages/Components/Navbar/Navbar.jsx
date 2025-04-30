import {  useContext, useEffect, useState,  } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { usercontext } from "../Context/UserContext/UserContext";
import logo from "../../../assets/images/logonew.png";
function Navbar() {
  
  const { token, settoken } = useContext(usercontext);
  const [validToken, setValidToken] = useState(localStorage.getItem("token") || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (token) {
      setValidToken(token);
    }
  }, [token]);
 
  const navigate=useNavigate();
  function LogOut() {
    settoken(null);
    localStorage.removeItem("token");
    navigate("/auth/login");
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Add this constant for desktop NavLink styles
  const desktopNavLinkStyle = ({ isActive }) => `
    relative before:h-[2px] hover:before:w-full before:transition-[width] 
    before:duration-300 hover:font-bold before:bg-blue-400 before:absolute 
    before:left-0 before:-bottom-1 ${isActive ? "before:w-full font-bold" : "before:w-0"}
  `;


  return (
    <>
      <header className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 shadow-md">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-300"></div>
          <div className="flex h-16 items-center justify-between m-4 sm:m-6">
            <div className="flex flex-col items-center cursor-pointer">
              <Link to="/">
                <img className="w-[90px] sm:w-[115px] transition-all duration-300" src={logo} alt="logo" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block p-4 lg:p-6">
              <nav aria-label="Global" className="transition-all duration-300">
                {validToken && (
                  <ul className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-sm">
                    <li>
                      <NavLink
                        className={desktopNavLinkStyle}
                        to={"/"}
                      >
                        Home
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        className={desktopNavLinkStyle}
                        to={"/categories"}
                      >
                        Categories
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        className={desktopNavLinkStyle}
                        to={"/stores"}
                      >
                        Stores
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        className={desktopNavLinkStyle}
                        to={"/orders"}
                      >
                        Orders
                      </NavLink>
                    </li>

                    
                   
                    <li>
                      <NavLink
                        className={desktopNavLinkStyle}
                        to={"/chatbot"}
                      >
                        AI Assistant
                      </NavLink>
                    </li>
                  </ul>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex gap-2 sm:gap-4">
                {validToken ? (
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Link to="/compare" className="group relative p-2 hover:scale-110 transition-all duration-300" aria-label="Compare products">
                      <i className="fa-solid fa-code-compare text-lg sm:text-xl text-gray-700 dark:text-gray-200 group-hover:text-blue-500 transition-colors duration-300"></i>
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Compare</span>
                    </Link>
                    <Link to="/wishlist" className="group relative p-2 hover:scale-110 transition-all duration-300" aria-label="Wishlist">
                      <i className="fa-solid fa-heart text-lg sm:text-xl text-gray-700 dark:text-gray-200 group-hover:text-pink-500 transition-colors duration-300"></i>
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Wishlist</span>
                    </Link>
                    <Link to="/cart" className="group relative p-2 hover:scale-110 transition-all duration-300" aria-label="Shopping cart">
                      <i className="fa-solid fa-cart-shopping text-lg sm:text-xl text-gray-700 dark:text-gray-200 group-hover:text-blue-500 transition-colors duration-300"></i>
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                        0
                      </span>
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Cart</span>
                    </Link>
                    <Link to="/userprofile" className="group relative p-2 hover:scale-110 transition-all duration-300" aria-label="User profile">
                      <i className="fa-solid fa-user text-lg sm:text-xl text-gray-700 dark:text-gray-200 group-hover:text-blue-500 transition-colors duration-300"></i>
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Profile</span>
                    </Link>
                  </div>
                ) : null}

                <ul className="flex gap-2 sm:gap-4">
                  {validToken ? (
                    <li className="cursor-pointer">
                      <span onClick={LogOut} className="group relative p-2 hover:scale-110 transition-all duration-300 inline-block">
                        <i className="fa-solid fa-right-from-bracket text-lg sm:text-xl text-gray-700 dark:text-gray-200 group-hover:text-red-500 transition-colors duration-300"></i>
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Logout</span>
                      </span>
                    </li>
                  ) : (
                    <>
                     <li>
                      <NavLink
                        className={({ isactive }) => {
                          return `relative px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium hover:shadow-lg transition-all duration-300 text-sm sm:text-base
                          ${isactive ? "shadow-md" : ""}`;
                        }}
                        to="/auth/login"
                      >
                        Login
                      </NavLink>
                    </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Mobile menu toggle button - only show when user is authenticated */}
              {validToken && (
                <div className="block md:hidden">
                  <button 
                    onClick={toggleMenu}
                    className="rounded-lg p-2 text-gray-600 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400 hover:text-white dark:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && validToken && (
            <div className="md:hidden bg-white dark:bg-gray-900 pb-4">
              <nav aria-label="Mobile Global">
                <ul className="flex flex-col space-y-4 px-4">
                  <li>
                    <NavLink
                      className={({ isActive }) => 
                        `block py-2 ${isActive ? "text-blue-500 font-bold" : "text-gray-600"}`
                      }
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) => 
                        `block py-2 ${isActive ? "text-blue-500 font-bold" : "text-gray-600"}`
                      }
                      to="/brands"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Brands
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) => 
                        `block py-2 ${isActive ? "text-blue-500 font-bold" : "text-gray-600"}`
                      }
                      to="/stores"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Stores
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) => 
                        `block py-2 ${isActive ? "text-blue-500 font-bold" : "text-gray-600"}`
                      }
                      to="/orders"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Orders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) => 
                        `block py-2 ${isActive ? "text-blue-500 font-bold" : "text-gray-600"}`
                      }
                      to="/categories"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Categories
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) => 
                        `block py-2 ${isActive ? "text-blue-500 font-bold" : "text-gray-600"}`
                      }
                      to="/ar-showcase"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      AR Showcase
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Navbar;
