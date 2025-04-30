import { useContext, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { usercontext } from "../Context/UserContext/UserContext"

export default function ProtectedRoute({children}) {
    const {token}=useContext(usercontext)
    const [validToken, setValidToken] = useState(localStorage.getItem("token") || "");

    useEffect(() => {
        if (token) {
          setValidToken(token); // ✅ Ensure token updates when logging in
        }
      }, [token]);
    
      if (validToken) {
        return children;
      } else {
        return <Navigate to="/auth/login" />;
      }


}