import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { usercontext } from "../Components/Context/UserContext/UserContext";
import { WishlistContext } from "../Components/Context/WishlistContext/WishlistContext";
import { cartcontext } from "../Components/Context/CartContext/CartContext";
import { toast } from 'react-toastify';

function ProductDetails() {
  // Log all available route parameters to help debug
  const params = useParams();
  
  // Try multiple possible parameter names or use a hardcoded value for testing
  const productId = params.productid || params.id || params.product_id || "7"; // Fallback to ID 7 for testing
  
  // Access location state for potential product data
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [rating, setRating] = useState(0);
  
  const { token } = useContext(usercontext);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addProductToCart } = useContext(cartcontext);
  
  // Check if we already have the product data in location state
  useEffect(() => {
    if (location.state && location.state.productData) {
      setProduct(location.state.productData);
      
      if (location.state.productData.images && location.state.productData.images.length > 0) {
        setMainImage(location.state.productData.images[0]);
      }
      
      setIsLoading(false);
    }
  }, [location.state]);
  
  // Function to check if a product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist?.some(item => item.product_id === productId);
  };
  
  // Function to toggle wishlist status
  const handleWishlistToggle = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!token) {
      toast.error("Please login to add items to wishlist");
      return;
    }
    
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
        toast.success("Item removed from wishlist");
      } else {
        addToWishlist(product.id);
        toast.success("Item added to wishlist");
      }
    }
  };
  
  // Function to handle adding a product to the cart
  const handleAddToCart = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }
    
    if (product) {
      try {
        await addProductToCart({ 
          product_id: product.id,
          quantity: quantity
        });
        toast.success("Item added to cart");
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add item to cart");
      }
    }
  };
  
  // Fetch product details if we don't have it from location state
  useEffect(() => {
    // Skip API call if we already have the product data from location state
    if (location.state?.productData) {
      return;
    }
    
    if (!productId) {
      console.warn("No productId available, cannot fetch details");
      setError("Product ID is missing");
      setIsLoading(false);
      return;
    }
    
    const fetchProductDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`http://localhost/eMall/products/productDetails.php?product_id=${productId}`, {
          headers: {
            'Authorization': token || localStorage.getItem('token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true // Include cookies if needed
        });
        
        
        if (response.data.status === "success") {
          setProduct(response.data.product);
          
          if (response.data.product.images && response.data.product.images.length > 0) {
            setMainImage(response.data.product.images[0]);
          }
        } else {
          setError("Failed to load product details: " + (response.data.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          setError(`Server error: ${error.response.status}`);
        } else if (error.request) {
          console.error("No response received:", error.request);
          setError("No response from server. Please check your network connection.");
        } else {
          console.error("Error message:", error.message);
          setError("Error: " + error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [productId, token, location.state]);

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const submitFeedback = () => {
    if (feedback.trim() && rating > 0) {
      const newFeedback = {
        id: Date.now(),
        text: feedback,
        rating: rating,
        date: new Date().toLocaleDateString(),
        user: 'You'
      };
      setUserFeedbacks([newFeedback, ...userFeedbacks]);
      setFeedback('');
      setRating(0);
      toast.success("Review submitted successfully");
    } else {
      toast.error("Please provide both rating and review text");
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0 }
  };

  const imageVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pt-20">
        <motion.div 
          className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        ></motion.div>
        <motion.p 
          className="text-gray-600 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading product details...
        </motion.p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pt-20 p-4">
        <motion.div 
          className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-red-500 text-4xl mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <i className="fas fa-exclamation-circle"></i>
          </motion.div>
          <motion.h2 
            className="text-lg font-medium text-gray-800 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Something went wrong
          </motion.h2>
          <motion.p 
            className="text-gray-600 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {error}
          </motion.p>
          <div className="flex justify-center space-x-4">
            <motion.button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Refresh Page
            </motion.button>
            <motion.button 
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render if no product found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pt-20 p-4">
        <motion.div 
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-yellow-500 text-4xl mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <i className="fas fa-search"></i>
          </motion.div>
          <motion.h2 
            className="text-lg font-medium text-gray-800 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Product Not Found
          </motion.h2>
          <motion.p 
            className="text-gray-600 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We couldn't find the product you're looking for.
          </motion.p>
          <motion.button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Calculate discounted price
  const discountedPrice = product.discount 
    ? (parseFloat(product.price) * (1 - parseFloat(product.discount) / 100)).toFixed(2) 
    : product.price;

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 pt-20"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-10">
        <div className="md:flex">
          {/* Product Images Section */}
          <div className="md:w-1/2 p-6">
            <motion.div 
              className="mb-4 overflow-hidden rounded-lg shadow-md"
              whileHover="hover"
              variants={imageVariants}
            >
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-96 object-contain bg-gray-50"
                onError={(e) => {
                  console.error("Failed to load main image:", mainImage);
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/800x600?text=Product+Image";
                }}
              />
            </motion.div>
            
            <div className="grid grid-cols-5 gap-2">
              {product.images && product.images.map((image, index) => (
                <motion.div 
                  key={index}
                  className={`cursor-pointer rounded-md overflow-hidden border-2 ${mainImage === image ? 'border-blue-600' : 'border-transparent'} hover:shadow-lg transition-shadow duration-300`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMainImage(image)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} view ${index + 1}`} 
                    className="w-full h-16 object-cover"
                    onError={(e) => {
                      console.error("Failed to load thumbnail image:", image);
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/100x100?text=Image";
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Product Details Section */}
          <div className="md:w-1/2 p-6 bg-gradient-to-br from-white to-gray-50">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star ${i < Math.floor(4) ? '' : 'text-gray-300'}`}></i>
                  ))}
                </div>
                <span className="text-gray-600">(0 reviews)</span>
              </div>
              
              <div className="mb-4">
                {product.discount ? (
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-blue-600 mr-2">${discountedPrice}</p>
                    <p className="text-lg text-gray-500 line-through">${parseFloat(product.price).toFixed(2)}</p>
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {product.discount}% OFF
                    </span>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-blue-600">${parseFloat(product.price).toFixed(2)}</p>
                )}
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
              
              {/* Stock Information */}
              <div className="mb-6">
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${parseInt(product.stock_quantity) > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className={`text-sm font-medium ${parseInt(product.stock_quantity) > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {parseInt(product.stock_quantity) > 0 
                      ? `In Stock (${product.stock_quantity} available)` 
                      : 'Out of Stock'}
                  </span>
                </div>
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Quantity</h3>
                <div className="flex items-center">
                  <motion.button 
                    className="w-12 h-12 rounded-l-md bg-gray-100 flex items-center justify-center border border-gray-300 hover:bg-gray-200"
                    onClick={() => handleQuantityChange('decrease')}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    disabled={quantity <= 1}
                  >
                    <i className="fas fa-minus text-gray-600"></i>
                  </motion.button>
                  
                  <input 
                    type="number" 
                    className="w-20 h-12 border-t border-b border-gray-300 text-center text-lg font-medium"
                    value={quantity}
                    readOnly
                  />
                  
                  <motion.button 
                    className="w-12 h-12 rounded-r-md bg-gray-100 flex items-center justify-center border border-gray-300 hover:bg-gray-200"
                    onClick={() => handleQuantityChange('increase')}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    disabled={quantity >= parseInt(product.stock_quantity)}
                  >
                    <i className="fas fa-plus text-gray-600"></i>
                  </motion.button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <motion.button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center disabled:bg-gray-400 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={parseInt(product.stock_quantity) <= 0}
                >
                  <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
                </motion.button>
                
                <motion.button 
                  className={`flex-1 border-2 py-4 px-6 rounded-lg font-medium flex items-center justify-center shadow-sm hover:shadow
                    ${isInWishlist(product.id) 
                      ? 'border-pink-600 text-pink-600 bg-pink-50 hover:bg-pink-100' 
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWishlistToggle}
                >
                  <i className={`${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart mr-2`}></i> 
                  {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </motion.button>
              </div>
              
              {/* Additional Info */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <i className="fas fa-truck text-blue-600 mr-3 text-xl"></i>
                    <span>Free shipping</span>
                  </div>
                  
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <i className="fas fa-undo text-green-600 mr-3 text-xl"></i>
                    <span>30-day returns</span>
                  </div>
                  
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <i className="fas fa-shield-alt text-purple-600 mr-3 text-xl"></i>
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Product Description */}
        <div className="p-8 border-t border-gray-200 bg-white">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-info-circle text-blue-500 mr-2"></i>
              Product Description
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p className="leading-relaxed">{product.description}</p>
            </div>
          </motion.div>
        </div>
        
        {/* User Feedback Section */}
        <div className="p-8 border-t border-gray-200 bg-gray-50">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-comments text-blue-500 mr-2"></i>
              Customer Reviews
            </h2>
            
            {/* Write a Review */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Write Your Review</h3>
              
              {/* Star Rating */}
              <div className="mb-4">
                <p className="text-gray-700 mb-2">Your Rating</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="text-2xl focus:outline-none transition-transform hover:scale-110"
                    >
                      <i className={`${star <= rating ? 'fas' : 'far'} fa-star text-yellow-400`}></i>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Feedback Text Area */}
              <div className="mb-4">
                <label htmlFor="feedback" className="block text-gray-700 mb-2">Your Review</label>
                <textarea
                  id="feedback"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow focus:shadow-md"
                  placeholder="Share your experience with this product..."
                  value={feedback}
                  onChange={handleFeedbackChange}
                ></textarea>
              </div>
              
              {/* Submit Button */}
              <motion.button
                onClick={submitFeedback}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!feedback.trim() || rating === 0}
              >
                Submit Review
              </motion.button>
            </div>
            
            {/* Display User Feedbacks */}
            <div className="space-y-6">
              {userFeedbacks.length > 0 ? (
                userFeedbacks.map(feedback => (
                  <div key={feedback.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-blue-800">{feedback.user}</p>
                        <div className="flex text-yellow-400 my-1">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`${i < feedback.rating ? 'fas' : 'far'} fa-star text-sm`}></i>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{feedback.date}</span>
                    </div>
                    <p className="mt-3 text-gray-700 leading-relaxed">{feedback.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                  <i className="far fa-comment-dots text-5xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 max-w-md mx-auto">No reviews yet. Be the first to share your experience with this product!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductDetails;