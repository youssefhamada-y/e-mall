import { createContext, useContext, useState, useEffect } from "react";
import { usercontext } from "../UserContext/UserContext";
import axios from "axios";
import toast from "react-hot-toast";

export const cartcontext = createContext(null);

export default function Cartprovider({children}) {
  const { token } = useContext(usercontext);
  const [isLoading, setIsLoading] = useState(false);
  const [cartinfo, setcartinfo] = useState({
    cart_items: [],
    count: 0,
    subtotal: 0
  });
  
  // Get cart info when token changes
  useEffect(() => {
    if (token) {
      getCartInfo();
    }
  }, [token]);
  
  // Get cart info function - updated to match the Cart.jsx needs
  async function getCartInfo() {
    try {
      // Use token from context or localStorage as fallback
      const authToken = token || localStorage.getItem("token");
      
      // Don't proceed if no token
      if (!authToken) {
        console.log("No token available for cart request");
        return null;
      }
      
      const response = await axios({
        method: 'GET',
        url: 'http://localhost/eMall/cart/getCartItems.php',
        headers: {
          'Authorization': authToken,
          'Accept': 'application/json',
        }
      });
      
      // Set cart info based on the response structure
      if (response.data) {
        setcartinfo(response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching cart info:", error);
      
      if (error.response?.data?.message?.includes("No cart")) {
        // Reset cart if "No cart" message received
        setcartinfo({ 
          cart_items: [],
          count: 0,
          subtotal: 0
        });
      }
      
      return null;
    }
  }

  // Add product to cart function
  async function addProductToCart({ product_id, quantity = 1 }) {
    try {
      // Use token from context or localStorage as fallback
      const authToken = token || localStorage.getItem("token");
      
      if (!authToken) {
        toast.error("Please login to add items to cart");
        return null;
      }
      
      // Use URLSearchParams for form data
      const params = new URLSearchParams();
      params.append('product_id', product_id);
      params.append('quantity', quantity);
      
      console.log(`Adding product_id=${product_id} with quantity=${quantity} to cart`);
      
      // Make the API request
      const response = await axios({
        method: 'POST',
        url: 'http://localhost/eMall/cart/addToCart.php',
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: params
      });
      
      console.log("Add to cart response:", response.data);
      
      if (response.data.message === "Item added to cart successfully") {
        toast.success("Product added to cart successfully");
        
        // Refresh cart info
        await getCartInfo();
        
        return response.data;
      } else {
        response.data.message && toast.error(response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      
      if (error.response) {
        toast.error(error.response.data?.message || `Server error: ${error.response.status}`);
      } else {
        toast.error("Error adding product to cart");
      }
      
      return null;
    }
  }

  // Update cart item function
  async function updateCart({ cartid, quantity }) {
    try {
      const authToken = token || localStorage.getItem("token");
      
      if (!authToken) {
        toast.error("Please login to update cart");
        return null;
      }

      const response = await axios({
        method: 'PUT',
        url: 'http://localhost/eMall/cart/updateCart.php',
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        },
        data: {
          cartid,
          quantity
        }
      });

      if (response.data.message === "Cart item updated") {
        toast.success("Cart updated successfully");
        await getCartInfo();
        return response.data;
      } else {
        response.data.message && toast.error(response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error(error.response?.data?.message || "Error updating cart");
      return null;
    }
  }

  // Delete item from cart function
  async function deleteFromCart(cartid) {
    try {
      const authToken = token || localStorage.getItem("token");
      
      if (!authToken) {
        toast.error("Please login to delete items from cart");
        return null;
      }

      const response = await axios({
        method: 'DELETE',
        url: 'http://localhost/eMall/cart/deleteFromCart.php',
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        },
        data: {
          cartid
        }
      });

      if (response.data.message === "Item deleted from cart") {
        toast.success("Item deleted from cart successfully");
        await getCartInfo();
        return response.data;
      } else {
        response.data.message && toast.error(response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error deleting item from cart:", error);
      toast.error(error.response?.data?.message || "Error deleting item from cart");
      return null;
    }
  }

  // Clear cart function - FIXED to match endpoint requirements
  async function clearCart() {
    try {
      // Use token from context or localStorage as fallback
      const authToken = token || localStorage.getItem("token");
      
      if (!authToken) {
        toast.error("Please login to clear cart");
        return { success: false };
      }
      
      console.log("Clearing cart");
      
      // Make the API request
      const response = await axios({
        method: 'DELETE',
        url: 'http://localhost/eMall/cart/clearCart.php',
        headers: {
          'Authorization': authToken
        }
      });
      
      if (response.data.message === "Cart cleared successfully") {
        toast.success("Cart cleared successfully");
        
        // Reset cart info
        setcartinfo({
          cart_items: [],
          count: 0,
          subtotal: 0
        });
        
        return { success: true };
      } else {
        response.data.message && toast.error(response.data.message);
        return { success: false };
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      
      // Try alternative approach if first method fails
      try {
        console.log("Trying alternative clear cart approach...");
        
        const authToken = token || localStorage.getItem("token");
        
        const response = await axios({
          method: 'POST',  // Try POST instead of DELETE
          url: 'http://localhost/eMall/cart/clearCart.php',
          headers: {
            'Authorization': authToken
          }
        });
        
        console.log("Alternative clear cart response:", response.data);
        
        if (response.data.message === "Cart cleared successfully") {
          toast.success("Cart cleared successfully");
          
          // Reset cart info
          setcartinfo({
            cart_items: [],
            count: 0,
            subtotal: 0
          });
          
          return { success: true };
        }
      } catch (altError) {
        console.error("Alternative clear cart approach also failed:", altError);
      }
      
      toast.error("Failed to clear cart");
      return { success: false };
    }
  }
  
  return (
    <cartcontext.Provider value={{
      getCartInfo, 
      cartinfo, 
      setcartinfo, 
      addProductToCart,
      updateCart,
      deleteFromCart,
      clearCart
    }}>
      {children}
    </cartcontext.Provider>
  );
}