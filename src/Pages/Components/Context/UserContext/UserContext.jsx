import { createContext, useState } from "react";





 export const usercontext=createContext('') 
 export default function Userprovider({children}){
    
    const [token, settoken] = useState(localStorage.getItem('token'))


    // 🔴 This ensures all components update when token changes


   
return <usercontext.Provider value={{token, settoken}}>
{children}
</usercontext.Provider>
 }