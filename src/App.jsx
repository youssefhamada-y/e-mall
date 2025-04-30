import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Pages/Components/Layout/Layout";
import Auth from "./Pages/Auth/Auth";
import Home from "./Pages/User/Home";
import HomeMallAdmin from "./Pages/MallAdmin/HomeMallAdmin";
import HomeStoreAdmin from "./Pages/StoreAdmin/HomeStoreAdmin";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./Pages/Components/ProtectedRoute/ProtectedRoute";
import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage";
import Stores from "./Pages/Stores/Stores";
import Zara from "./Pages/Stores/Zara";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import VerifyOtp from "./Pages/VerifyOtp/VerifyOtp";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import Userprovider from "./Pages/Components/Context/UserContext/UserContext";
import Categories from "./Pages/Categories/Categories";
import Brands from "./Pages/Brands/Brands";
import UserProfile from "./Pages/UserProfile/UserProfile";
import Compare from "./Pages/Compare/Compare";
import Wishlist from "./Pages/Wishlist/Wishlist";
import ChatBot from "./Pages/ChatBot/ChatBot";
import Cart from "./Pages/Cart/Cart";
import Orders from "./Pages/Orders/Orders";
function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "*", element: <NotFoundPage /> },
        { index: true, element: <Home /> },
        { path: "/admin/home", element: <HomeMallAdmin /> },
        { path: "/store/home", element: <HomeStoreAdmin /> },
        { path: "categories", element: <Categories /> },
        { path: "stores", element: <Stores /> },
        {path:"chatbot",element:<ChatBot/>},
        { path: "brands", element: <Brands /> },
        { path: "userprofile", element: <UserProfile /> },
        { path: "compare", element: <Compare /> },
        { path: "cart", element: <Cart /> },
        { path: "wishlist", element: <Wishlist /> },
        {path:"/stores/zara",element:<Zara/>},
        {path:"orders",element:<Orders/>}
      ],
    },
    {
      path: "/auth",
      element: <Layout />, 
      children: [
        { path: "login", element: <Auth islogin={true} /> },
        { path: "register", element: <Auth islogin={false} /> },
        { path: "forgot-password", element: <ForgetPassword /> },
        { path: "verify-otp", element: <VerifyOtp /> },
        { path: "reset-password", element: <ResetPassword /> },
               

        
      ],
    },
  ]);

  return (
    <>
    <Userprovider>
      
        <RouterProvider router={routes}></RouterProvider>
        <Toaster />
      
    </Userprovider>
  </>
  );
}

export default App;
