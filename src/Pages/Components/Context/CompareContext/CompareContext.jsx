import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usercontext } from "../UserContext/UserContext";
import axios from "axios";
import toast from "react-hot-toast";

export const CompareContext = createContext(null);

export default function Compareprovider({children}){
  const { token } = useContext(usercontext); 
  const [compareItems, setCompareItems] = useState([]);
  const [compareCount, setCompareCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const getCompareItems = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const authToken = token || localStorage.getItem("token");
      
      if (!authToken) {
        // console.log("No token available for compare request");
        setIsLoading(false);
        return;
      }
      
      const response = await axios({
        method: 'GET',
        url: 'http://localhost/eMall/compare/getCompareItems.php',
        headers: {
          'Authorization': authToken,
          'Accept': 'application/json',
        },
        // Add timeout to prevent hanging requests
        timeout: 10000
      });
      
      if (response.data && response.data.compare_items) {
        setCompareItems(response.data.compare_items);
        setCompareCount(response.data.compare_items.length);
      }
    } catch (error) {
      // Handle specific error types
      if (error.code === 'ECONNABORTED') {
        toast.error("Request timed out. Please try again later.", {
          position: "bottom-center",
          duration: 3000,
        });
      } else if (error.message && error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
        toast.error("Server is busy. Please try again later.", {
          position: "bottom-center",
          duration: 3000,
        });
      } else {
        // console.error("Error fetching compare items:", error);
        toast.error("Failed to load compare items", {
          position: "bottom-center",
          duration: 2000,
        });
      }
      setCompareItems([]);
      setCompareCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoading]);
  
  useEffect(() => {
    if (token) {
      getCompareItems();
    }
  }, [token, getCompareItems]);
  
  const addToCompare = useCallback(async (product_id) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const authToken = token || localStorage.getItem("token");
      
      if (!authToken) {
        // console.log("No token available for add to compare request");
        setIsLoading(false);
        return;
      }
      
      const response = await axios({
        method: 'POST',
        url: 'http://localhost/eMall/compare/addToCompare.php',
        headers: {
          'Authorization': authToken,
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: new URLSearchParams({
          product_id: product_id
        }),
        timeout: 10000
      });
      
      if (response.data && response.data.message) {
        toast.success(response.data.message, {
          position: "bottom-center",
          icon: "🔄",
          duration: 2000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        
        // Refresh compare items after adding
        getCompareItems();
      }
      
      return response.data;
    } catch (error) {
      // Handle specific error types
      if (error.code === 'ECONNABORTED') {
        toast.error("Request timed out. Please try again later.", {
          position: "bottom-center",
          duration: 3000,
        });
      } else {
        // console.error("Error adding item to compare:", error);
        toast.error("Failed to add item to compare list", {
          position: "bottom-center",
          duration: 2000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoading, getCompareItems]);
  
  const removeFromCompare = useCallback(async (product_id) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const authToken = token || localStorage.getItem("token");
      
      if (!authToken) {
        // console.log("No token available for remove from compare request");
        setIsLoading(false);
        return;
      }
      
      const response = await axios({
        method: 'DELETE',
        url: 'http://localhost/eMall/compare/removeFromCompare.php',
        headers: {
          'Authorization': authToken,
          'Accept': 'application/json',
        },
        params: {
          product_id: product_id
        },
        timeout: 10000
      });
      
      if (response.data && response.data.message) {
        toast.success(response.data.message, {
          position: "bottom-center",
          icon: "🗑️",
          duration: 2000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        
        // Update compare items with the response data
        if (response.data.compare_items) {
          setCompareItems(response.data.compare_items);
          setCompareCount(response.data.compare_items.length);
        } else {
          // If no items returned, reset the state
          setCompareItems([]);
          setCompareCount(0);
        }
      }
      
      return response.data;
    } catch (error) {
      // Handle specific error types
      if (error.code === 'ECONNABORTED') {
        toast.error("Request timed out. Please try again later.", {
          position: "bottom-center",
          duration: 3000,
        });
      } else {
        // console.error("Error removing item from compare:", error);
        toast.error("Failed to remove item from compare list", {
          position: "bottom-center",
          duration: 2000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoading]);
  
  return (
    <CompareContext.Provider value={{
      compareItems,
      compareCount,
      getCompareItems,
      addToCompare,
      removeFromCompare,
      isLoading
    }}>
      {children}
    </CompareContext.Provider>
  );
}