import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { usercontext } from "../Components/Context/UserContext/UserContext";
import { WishlistContext } from "../Components/Context/WishlistContext/WishlistContext";
import { cartcontext } from "../Components/Context/CartContext/CartContext"; // Added missing import
import { toast } from "react-toastify";
import { CompareContext } from "../Components/Context/CompareContext/CompareContext";
export default function StoreProducts() {
  // Get store ID from URL parameters
  const { store_id } = useParams();
  const location = useLocation();
  const storeData = location.state?.storeData;
  const { token } = useContext(usercontext);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const {  compareItems,
    compareCount,
    getCompareItems,
    addToCompare,
    removeFromCompare, } = useContext(CompareContext);
  const { addProductToCart } = useContext(cartcontext); // Using cartcontext
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isSimilarProductsLoading, setIsSimilarProductsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Function to check if a product is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlist?.some(item => item.product_id === productId);
  }, [wishlist]);

  // Function to toggle wishlist status
  const handleWishlistToggle = useCallback((productId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!token) {
      toast.error("Please login to add items to wishlist");
      return;
    }
    
    if (isInWishlist(productId)) {
      // If item is already in wishlist, show message or remove based on context
      if (e && e.type === "click") {
        // If this is a direct click (not a side effect), remove from wishlist
        removeFromWishlist(productId);
        toast.success("Item removed from wishlist");
      } else {
        // If trying to add an existing item
        toast.info("Item already exists in wishlist");
      }
    } else {
      // Add to wishlist if not already there
      addToWishlist(productId);
      toast.success("Item added to wishlist");
    }
  }, [token, isInWishlist, addToWishlist, removeFromWishlist]);

  // Function to handle adding a product to the compare list
  const handleAddToCompare = useCallback((productId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); 
    }

    if (!token) {
      toast.error("Please login to add items to compare");
      return;
    }

    const isProductInCompare = compareItems?.some(item => item.product_id === productId);

    if (isProductInCompare) {
      removeFromCompare(productId);
      toast.success("Item removed from compare list", {
        position: "bottom-center",
        icon: "🗑️",
        duration: 2000
      });
    } else {
      addToCompare(productId);
      toast.success("Item added to compare list", {
        position: "bottom-center", 
        icon: "🔄",
        duration: 2000
      });
    }
  }, [token, compareItems, addToCompare, removeFromCompare]);
  
  // Function to handle adding a product to the cart
  const handleAddToCart = async (productId, e) => {
    if (e) {
      e.preventDefault(); // Prevent navigation if the button is inside a Link
      e.stopPropagation(); // Stop event bubbling
    }
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }
    // Assuming product.id is the correct identifier for product_id
    await addProductToCart({ product_id: productId });
  };
  
  const [storeInfo, setStoreInfo] = useState({
    id: store_id,
    name: "Store " + store_id,
    logo: "https://placehold.co/150x150?text=Store+" + store_id,
    image: "https://placehold.co/1200x600?text=Store+Banner",
    description: "Welcome to our store!",
    quantity: 0
  });

  // Log for debugging
  
  
  // Update store info if data is available in location state
  useEffect(() => {
    if (storeData) {
      console.log("Setting store info from location state:", storeData);
      setStoreInfo({
        id: storeData.id || store_id,
        name: storeData.name || `Store ${store_id}`,
        logo: storeData.logo || `https://placehold.co/150x150?text=Store+${store_id}`,
        image: storeData.image || "https://placehold.co/1200x600?text=Store+Banner",
        description: storeData.description || "Welcome to our store!",
        quantity: storeData.quantity || 0
      });
    }
  }, [storeData, store_id]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        
        const options = {
          url: "http://localhost/eMall/products/getProductsByStore.php",
          method: "GET",
          params: { id: store_id }
        };
        
        const response = await axios.request(options);
        
        // Check the exact structure of your API response
        const fetchedProducts = response?.data?.products || [];
        
        if (fetchedProducts.length === 0) {
          console.log("No products returned from API");
          setProducts([]);
          setFilteredProducts([]);
        } else {
          setProducts(fetchedProducts);
          setFilteredProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Unable to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (store_id) {
      fetchProducts();
    }
  }, [store_id]);

  // Filter and sort products
  useEffect(() => {
    if (products.length > 0) {
      let result = [...products];

      // Filter by category
      if (selectedCategory !== "All") {
        result = result.filter(
          (product) => product.category === selectedCategory
        );
      }

      // Filter by search term
      if (searchTerm) {
        result = result.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Sort products
      switch (sortBy) {
        case "priceAsc":
          result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case "priceDesc":
          result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case "nameAsc":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "nameDesc":
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "rating":
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        default:
          // featured - keep original order
          break;
      }

      setFilteredProducts(result);
    }
  }, [products, selectedCategory, searchTerm, sortBy]);

  // Get unique categories
  const categories = ["All", 
    ...new Set(products.map((product) => product.category).filter(Boolean))
  ];

  // Toggle mobile filter drawer
  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  // Camera functionality
  const startCamera = () => {
    setIsCameraActive(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
        setError("Unable to access camera. Please check permissions.");
        setIsCameraActive(false);
      });
  };

  const videoRef = React.useRef(null);

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
    stopCamera();

    // Find similar products with the captured image
    findSimilarProducts(imageData);
  };

  const resetCamera = () => {
    setIsCameraActive(false);
    setCapturedImage(null);
    setSimilarProducts([]);
    setIsSimilarProductsLoading(false);
  };

  // Visual search functionality
  const findSimilarProducts = (imageData) => {
    setIsSimilarProductsLoading(true);
    
    // Simulate an API call with a timeout and random products selection
    setTimeout(() => {
      // Get random products as "similar" items
      const randomProducts = [...products]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(6, products.length));
      
      setSimilarProducts(randomProducts);
      setIsSimilarProductsLoading(false);
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 20,
      opacity: 0,
      scale: 0.95
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.5
      }
    }
  };

  // Debug info

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
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
          Loading products...
        </motion.p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
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
          <motion.button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Refresh Page
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Store Header Section - Redesigned with parallax effect */}
      <div className="relative h-72 md:h-[450px] overflow-hidden mt-14">
        <motion.div
          className="absolute inset-0"
          style={{ 
            backgroundImage: `url(${storeInfo.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          initial={{ scale: 1.1 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ duration: 1.2 }}
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl mb-4 border border-white/30"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <img 
              src={storeInfo.logo}
              alt={storeInfo.name}
              className="h-28 w-28 rounded-xl object-contain"
              onError={(e) => {
                console.error("Error loading logo:", e);
                e.target.src = `https://placehold.co/150x150?text=Store+${store_id}`;
              }}
            />
          </motion.div>
          <motion.h1 
            className="text-3xl md:text-5xl font-bold mb-2 text-center px-4 text-shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {storeInfo.name}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-center max-w-3xl px-6 text-white/90 font-light"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {storeInfo.description}
          </motion.p>
        </div>
      </div> 
  
      <div className="container mx-auto px-4 -mt-6 relative z-10">
        {/* Search Bar - Redesigned with glass effect */}
        <motion.div 
          className="w-full mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-4 pl-14 border-none rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg bg-white/90 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-500">
              <i className="fas fa-search text-lg"></i>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </motion.div>
  
        {/* Visual Search Section - Modernized with rounded corners and animations */}
        <motion.div 
          className="w-full mb-12 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <i className="fas fa-camera-retro text-blue-500 mr-3"></i>
              Visual Search
            </h3>
            <p className="text-sm text-gray-500">
              Find products by taking a photo
            </p>
          </div>
  
          {!isCameraActive && !capturedImage ? (
            <div className="p-8 flex flex-col items-center">
              <motion.div 
                className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 15, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
              >
                <i className="fas fa-camera text-white text-4xl"></i>
              </motion.div>
              <p className="text-gray-600 mb-8 text-center max-w-md leading-relaxed">
                Take a photo of an item you like and we'll help you find similar
                products in our store.
              </p>
              <motion.button
                onClick={startCamera}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl font-semibold flex items-center space-x-2"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-camera-retro mr-2"></i>
                Start Camera
              </motion.button>
            </div>
          ) : (
            <div className="relative">
              {isCameraActive && !capturedImage ? (
                <>
                  <div className="w-full h-96 bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    ></video>
                  </div>
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-6">
                    <motion.button
                      onClick={stopCamera}
                      className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl hover:bg-gray-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <i className="fas fa-times text-red-500 text-xl"></i>
                    </motion.button>
                    <motion.button
                      onClick={captureImage}
                      className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl hover:bg-gray-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="w-14 h-14 rounded-full border-4 border-blue-600"></div>
                    </motion.button>
                  </div>
                </>
              ) : capturedImage ? (
                <div>
                  <div className="relative w-full h-96 bg-black">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-full object-contain"
                    />
                    {isSimilarProductsLoading ? (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <motion.div 
                          className="flex flex-col items-center"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <motion.div 
                            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          ></motion.div>
                          <p className="text-white mt-4 font-medium">Finding similar products...</p>
                        </motion.div>
                      </div>
                    ) : null}
                  </div>
  
                  {!isSimilarProductsLoading && (
                    <div className="p-6">
                      <h4 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <i className="fas fa-tag text-blue-500 mr-2"></i>
                        Similar Products
                      </h4>
                      {similarProducts.length > 0 ? (
                        <motion.div 
                          className="grid grid-cols-2 md:grid-cols-4 gap-4"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {similarProducts.map((product) => (
                            <motion.div
                              key={product.id}
                              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 group flex flex-col"
                              variants={itemVariants}
                              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }}
                            >
                              <Link to={`/productdetails/${product.id}`} className="block">
                                <div className="relative overflow-hidden aspect-square">
                                  <img
                                    src={product.images && product.images.length > 0
                                      ? product.images[0]
                                      : "https://placehold.co/300x300?text=No+Image"}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    onError={(e) => { e.target.src = "https://placehold.co/300x300?text=Error"; }}
                                  />
                                  <div className="absolute top-2 right-2">
                                    <motion.button
                                      onClick={(e) => handleWishlistToggle(product.id, e)}
                                      className={`p-2 rounded-full transition-colors duration-300 ${
                                        isInWishlist(product.id) ? 'bg-pink-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-pink-100'
                                      }`}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      aria-label="Toggle Wishlist"
                                    >
                                      <i className={`fas fa-heart ${isInWishlist(product.id) ? '' : 'far'}`}></i>
                                    </motion.button>
                                  </div>
                                </div>
                                <div className="p-4 flex-grow">
                                  <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate group-hover:text-blue-600">
                                    {product.name}
                                  </h3>
                                  <p className="text-xs text-gray-500 mb-2 truncate">{product.category}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-base font-bold text-blue-600">
                                      ${parseFloat(product.price).toFixed(2)}
                                    </span>
                                    {/* Rating can be added here if available */}
                                  </div>
                                </div>
                              </Link>
                              <div className="p-3 border-t border-gray-100">
                                <motion.button
                                  onClick={(e) => handleAddToCart(product.id, e)}
                                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-medium py-2 px-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center"
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                >
                                  <i className="fas fa-cart-plus mr-2"></i>
                                  Add to Cart
                                </motion.button>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <div className="text-center py-8 bg-blue-50 rounded-xl">
                          <i className="fas fa-search text-blue-300 text-4xl mb-4"></i>
                          <p className="text-gray-600">
                            No similar products found
                          </p>
                        </div>
                      )}
  
                      <div className="mt-8 flex justify-between">
                        <motion.button
                          onClick={() => {
                            resetCamera();
                            startCamera();
                          }}
                          className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 shadow-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <i className="fas fa-camera-retro mr-2"></i>
                          Take Another Photo
                        </motion.button>
                        <motion.button
                          onClick={resetCamera}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-md hover:shadow-lg font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Done
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </motion.div>
  
        {/* Mobile Filter Toggle Button - More appealing design */}
        <motion.div 
          className="md:hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={toggleMobileFilter}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl shadow-md font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className={`fas ${isMobileFilterOpen ? "fa-times" : "fa-filter"} text-lg`}></i>
            {isMobileFilterOpen ? "Close Filters" : "Filter & Sort Products"}
          </motion.button>
        </motion.div>
  
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - Desktop - Improved design */}
          <motion.div 
            className="hidden md:block w-full md:w-1/4 lg:w-1/5 bg-white p-6 rounded-2xl shadow-md h-fit sticky top-6 border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-100 pb-3 flex items-center">
                <i className="fas fa-tags text-blue-500 mr-2"></i>
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <motion.button
                      className={`w-full text-left py-3 px-4 rounded-lg transition-all ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md"
                          : "hover:bg-blue-50 text-gray-700 border border-gray-100"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {category}
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
  
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-100 pb-3 flex items-center">
                <i className="fas fa-sort-amount-down text-blue-500 mr-2"></i>
                Sort By
              </h3>
              <select
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="nameAsc">Name: A to Z</option>
                <option value="nameDesc">Name: Z to A</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
  
            <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <i className="fas fa-headset text-blue-600"></i>
                </div>
                <h4 className="font-semibold text-gray-800">Need Help?</h4>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Our customer service team is available 24/7 to assist you
              </p>
              <a
                href="#"
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg py-2 px-4 inline-block w-full text-center transition-colors shadow-sm"
              >
                <i className="fas fa-headset mr-2"></i> Contact Support
              </a>
            </div>
          </motion.div>
  
          {/* Sidebar - Mobile - Updated design */}
          {isMobileFilterOpen && (
            <motion.div 
              className="md:hidden w-full bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-100 pb-2 flex items-center">
                  <i className="fas fa-tags text-blue-500 mr-2"></i>
                  Categories
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      className={`py-3 px-4 rounded-lg transition-all text-center ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md"
                          : "bg-gray-50 hover:bg-blue-50 text-gray-700 border border-gray-100"
                      }`}
                      onClick={() => {
                        setSelectedCategory(category);
                        if (window.innerWidth < 768)
                          setIsMobileFilterOpen(false);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>
  
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-100 pb-2 flex items-center">
                  <i className="fas fa-sort-amount-down text-blue-500 mr-2"></i>
                  Sort By
                </h3>
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    if (window.innerWidth < 768) setIsMobileFilterOpen(false);
                  }}
                >
                  <option value="featured">Featured</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="nameAsc">Name: A to Z</option>
                  <option value="nameDesc">Name: Z to A</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
  
              <motion.button
                onClick={toggleMobileFilter}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md mt-3 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply Filters
              </motion.button>
            </motion.div>
          )}
  
          {/* Product Grid - Redesigned with better cards */}
          <motion.div 
            className="w-full md:w-3/4 lg:w-4/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {filteredProducts.length === 0 ? (
              <motion.div 
                className="text-center py-20 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-md border border-blue-100 overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-300 rounded-full"></div>
                  <div className="absolute top-40 -right-20 w-80 h-80 bg-indigo-300 rounded-full"></div>
                  <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-purple-300 rounded-full"></div>
                </div>
  
                <div className="relative z-10">
                  <motion.div 
                    className="w-28 h-28 mx-auto bg-white rounded-full flex items-center justify-center mb-8 shadow-xl border border-blue-100"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
                  >
                    <i className="fas fa-search text-5xl bg-gradient-to-br from-blue-400 to-indigo-600 bg-clip-text text-transparent"></i>
                  </motion.div>
                  <motion.h3 
                    className="text-2xl text-gray-800 mb-4 font-bold tracking-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    {products.length === 0 ? 
                      "No products available for this store yet" : 
                      "No products found matching your criteria"}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600 mb-10 px-4 max-w-lg mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    {products.length === 0 ? 
                      "Check back later for new products from this store" : 
                      "Try adjusting your search or filter to find what you're looking for"}
                  </motion.p>
                  {products.length > 0 && (
                    <motion.button
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl font-medium transition-all"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("All");
                        setSortBy("featured");
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3 }}
                    >
                      <i className="fas fa-sync-alt mr-2"></i>
                      Reset Filters
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ) : (
              <>
                <motion.div 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center mb-1">
                      <span className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-3 hidden md:block"></span>
                      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                        {selectedCategory === "All" ? "All Products" : selectedCategory}
                      </h2>
                    </div>
                    <div className="flex items-center text-gray-500 ml-0 md:ml-4 text-sm">
                      <span className="font-medium text-blue-600">{filteredProducts.length}</span>
                      <span className="ml-1">products found</span>
                      {searchTerm && (
                        <div className="flex items-center ml-3 bg-blue-50 px-2 py-1 rounded-full">
                          <span className="mr-1">"{searchTerm}"</span>
                          <button 
                            onClick={() => setSearchTerm("")} 
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <i className="fas fa-times-circle"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                      <select
                        className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="featured">Featured</option>
                        <option value="priceAsc">Price: Low to High</option>
                        <option value="priceDesc">Price: High to Low</option>
                        <option value="nameAsc">Name: A to Z</option>
                        <option value="nameDesc">Name: Z to A</option>
                        <option value="rating">Top Rated</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
                        <i className="fas fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                  </div>
                </motion.div>
  
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      whileHover={{ y: -5, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
                      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 group relative flex flex-col h-full"
                    >
                      <Link
                        to={`/productdetails/${product.id}`}
                        state={{ productData: product }}
                        className="block flex-grow"
                      >
                        {/* Product image and details */}
                        <div className="relative h-52 bg-gray-50 flex items-center justify-center overflow-hidden">
                          <img
                            src={product.images && product.images[0] }
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.target.onerror = null;
                            }}
                          />
                          {/* Discount badge */}
                          {product.discount && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                              -{product.discount}%
                            </div>
                          )}
                          {/* Wishlist button - always visible */}
                          <motion.button
                            onClick={(e) => handleWishlistToggle(product.id, e)}
                            className="absolute top-2 right-2 text-2xl"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Add to wishlist"
                          >
                            <i className={`${isInWishlist(product.id) ? "fas text-pink-500" : "far text-gray-600 hover:text-pink-400"} fa-heart`}></i>
                          </motion.button>
                        </div>
                        <div className="p-4">
                          <h3 className="text-base font-medium text-gray-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-gray-500 text-xs mb-2 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-lg font-semibold text-blue-600">
                              {parseFloat(product.price).toFixed(2)} EGP
                            </span>
                            <div className="flex items-center text-amber-400 text-xs">
                              <i className="fas fa-star"></i>
                              <span className="ml-1 text-gray-600">
                                {product.rating || "4.5"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center text-xs">
                            <span className={`${parseInt(product.stock_quantity) > 0 ? "text-green-600" : "text-red-500"}`}>
                              {parseInt(product.stock_quantity) > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                          </div>
                        </div>
                      </Link>
                      <div className="px-4 pb-4 mt-auto">
                        <div className="border-t pt-3">
                          <motion.button
                            onClick={(e) => handleAddToCart(product.id, e)}
                            className={`w-full mb-2 py-2 rounded-md text-sm font-medium flex items-center justify-center ${
                              parseInt(product.stock_quantity) <= 0 
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                              : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm"
                            }`}
                            whileHover={parseInt(product.stock_quantity) > 0 ? { scale: 1.02 } : {}}
                            whileTap={parseInt(product.stock_quantity) > 0 ? { scale: 0.98 } : {}}
                            disabled={parseInt(product.stock_quantity) <= 0}
                          >
                            <i className="fas fa-cart-plus mr-1.5"></i>
                            {parseInt(product.stock_quantity) <= 0 ? "Sold Out" : "Add to Cart"}
                          </motion.button>
                          
                          <div className="flex justify-center space-x-8">
                            <motion.button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Quick view functionality
                              }}
                              className="text-gray-500 hover:text-blue-600 transition-colors flex flex-col items-center"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              aria-label="Quick view"
                            >
                              <Link to={`/productdetails/${product.id}`}
                              state={{ productData: product }}>
                              <i className="fas fa-eye text-lg"></i>
                              </Link>
                              <span className="text-xs mt-1">Quick View</span>
                            </motion.button>
                            <motion.button
                              onClick={(e) => handleAddToCompare(product.id, e)}
                              className={`text-gray-500 hover:text-blue-600 transition-colors flex flex-col items-center ${
                                compareItems?.some(item => item.product_id === product.id) ? 'text-blue-600' : ''
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              aria-label="Compare product"
                            >
                              <i className={`fas fa-exchange-alt text-lg ${compareItems?.some(item => item.product_id === product.id) ? 'text-blue-600' : ''}`}></i>
                              <span className="text-xs mt-1">Compare</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}