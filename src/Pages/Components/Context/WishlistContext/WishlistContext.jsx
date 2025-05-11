import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usercontext } from "../UserContext/UserContext";
import axios from "axios";
import { toast } from 'react-toastify';

export const WishlistContext = createContext(null);
export const WishlistProvider = ({ children }) => {
  const { token } = useContext(usercontext);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Memoize the getWishlist function to prevent it from being recreated on every render
  const getWishlist = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost/eMall/wishlist/getWishlist.php",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.message === "success") {
        setWishlist(response.data.wishlist);
        setWishlistCount(response.data.count);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  }, [token]); // Include token in the dependency array

  // Fetch wishlist when component mounts or token changes
  useEffect(() => {
    if (token) {
      getWishlist();
    }
  }, [token, getWishlist]); // Include getWishlist in the dependency array

  async function addToWishlist(productId) {
    setLoading(true);
    try {
      // Use JSON format instead of FormData
      const response = await axios.post(
        "http://localhost/eMall/wishlist/addToWishlist.php",
        { product_id: productId },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.message === "Item added to wishlist") {
        setWishlist(response.data.wishlist_items);
        setWishlistCount(response.data.count);
        toast.success('Item added to wishlist successfully!');
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error('Failed to add item to wishlist');
    } finally {
      setLoading(false);
    }
  }

  async function removeFromWishlist(productId) {
    setLoading(true);
    try {
      const response = await axios.delete(
        "http://localhost/eMall/wishlist/removeWishlist.php",
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          },
          data: { product_id: productId }
        }
      );

      if (response.data.message === "Product removed from wishlist") {
        setWishlist(response.data.wishlist_items);
        setWishlistCount(response.data.count);
        toast.success('Item removed from wishlist successfully!');
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error('Failed to remove item from wishlist');
    } finally {
      setLoading(false);
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        getWishlist,
        addToWishlist,
        removeFromWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    // throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
