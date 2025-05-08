import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { usercontext } from "../Components/Context/UserContext/UserContext";
import { useContext } from "react";

export default function StoreProducts() {
  // Get store ID from URL parameters
  const { store_id } = useParams();
  const location = useLocation();
  const storeData = location.state?.storeData;
  const { token } = useContext(usercontext);
  
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
  
  const [storeInfo, setStoreInfo] = useState({
    id: store_id,
    name: "Store " + store_id,
    logo: "https://placehold.co/150x150?text=Store+" + store_id,
    image: "https://placehold.co/1200x600?text=Store+Banner",
    description: "Welcome to our store!"
  });

  // Log for debugging
  console.log("Store ID from URL:", store_id);
  console.log("Store data from location state:", storeData);
  
  // Update store info if data is available in location state
  useEffect(() => {
    if (storeData) {
      console.log("Setting store info from location state:", storeData);
      setStoreInfo({
        id: storeData.id || store_id,
        name: storeData.name || `Store ${store_id}`,
        logo: storeData.logo || `https://placehold.co/150x150?text=Store+${store_id}`,
        image: storeData.image || "https://placehold.co/1200x600?text=Store+Banner",
        description: storeData.description || "Welcome to our store!"
      });
    }
  }, [storeData, store_id]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching products for store ID:", store_id);
        
        const options = {
          url: "http://localhost/eMall/products/getProductsByStore.php",
          method: "GET",
          params: { id: store_id }
        };
        
        const response = await axios.request(options);
        console.log("Products API Response:", response.data);
        
        // Check the exact structure of your API response
        const fetchedProducts = response?.data?.products || [];
        
        if (fetchedProducts.length === 0) {
          console.log("No products returned from API");
          setProducts([]);
          setFilteredProducts([]);
        } else {
          setProducts(fetchedProducts);
          setFilteredProducts(fetchedProducts);
          console.log("Products loaded:", fetchedProducts.length);
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
  console.log("Current storeInfo:", storeInfo);

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
    <div className="min-h-screen mt-28 bg-gray-50">
      {/* Store Header Section */}
     <div className="relative">
        <div className="h-60 md:h-96 overflow-hidden bg-gray-300">
          <motion.img
            src={storeInfo.image}
            alt={storeInfo.name}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            onError={(e) => {
              console.error("Error loading image:", e);
              e.target.src = "https://placehold.co/1200x600?text=Store+Banner";
            }}
          />
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          ></motion.div>
        </div>
        
        <div className="absolute   inset-0 flex flex-col items-center justify-center text-white">
          <motion.div 
            className="bg-white rounded-full p-3 shadow-lg mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <img 
              src={storeInfo.logo}
              alt={storeInfo.name}
              className="h-24 w-24  rounded-full object-contain"
              onError={(e) => {
                console.error("Error loading logo:", e);
                e.target.src = `https://placehold.co/150x150?text=Store+${store_id}`;
              }}
            />
          </motion.div>
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-2 text-center px-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {storeInfo.name}
          </motion.h1>
          <motion.p 
            className="text-lg text-center max-w-2xl px-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {storeInfo.description}
          </motion.p>
        </div>
      </div> 

      <div className="container mx-auto px-4 py-12 md:pb-20">
        {/* Search Bar */}
        <motion.div 
          className="w-full mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-3 md:p-4 pl-10 md:pl-12 border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="fas fa-search"></i>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </motion.div>

        {/* Visual Search Section */}
        <motion.div 
          className="w-full mb-8 md:mb-12 bg-white rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-medium">Visual Search</h3>
            <p className="text-sm text-gray-500">
              Find products by taking a photo
            </p>
          </div>

          {!isCameraActive && !capturedImage ? (
            <div className="p-6 flex flex-col items-center">
              <motion.div 
                className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1, rotate: 15 }}
              >
                <i className="fas fa-camera text-blue-500 text-3xl"></i>
              </motion.div>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                Take a photo of an item you like and we'll help you find similar
                products in our store.
              </p>
              <motion.button
                onClick={startCamera}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Camera
              </motion.button>
            </div>
          ) : (
            <div className="relative">
              {isCameraActive && !capturedImage ? (
                <>
                  <div className="w-full h-80 bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    ></video>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                    <motion.button
                      onClick={stopCamera}
                      className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <i className="fas fa-times text-red-500 text-xl"></i>
                    </motion.button>
                    <motion.button
                      onClick={captureImage}
                      className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="w-12 h-12 rounded-full border-4 border-blue-600"></div>
                    </motion.button>
                  </div>
                </>
              ) : capturedImage ? (
                <div>
                  <div className="relative w-full h-80 bg-black">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-full object-contain"
                    />
                    {isSimilarProductsLoading ? (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <motion.div 
                          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        ></motion.div>
                      </div>
                    ) : null}
                  </div>

                  {!isSimilarProductsLoading && (
                    <div className="p-4">
                      <h4 className="text-lg font-medium mb-3">
                        Similar Products
                      </h4>
                      {similarProducts.length > 0 ? (
                        <motion.div 
                          className="grid grid-cols-2 md:grid-cols-3 gap-4"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {similarProducts.map((product) => (
                            <motion.div
                              key={product.id}
                              className="cursor-pointer hover:opacity-80 transition-opacity"
                              variants={itemVariants}
                            >
                              <Link to={`/productdetails/${product.id}`}>
                                <img
                                  src={product.images && product.images.length > 0
                                    ? product.images[0]
                                    : "https://placehold.co/400x320?text=Similar+Product"}
                                  alt={product.name}
                                  className="w-full h-32 object-cover rounded-lg shadow-sm"
                                  onError={(e) => {
                                    e.target.src = "https://placehold.co/400x320?text=Similar+Product";
                                  }}
                                />
                                <p className="text-sm mt-2 font-medium line-clamp-1">
                                  {product.name}
                                </p>
                                <p className="text-blue-600 font-bold">
                                  {parseFloat(product.price).toFixed(2)} EGP
                                </p>
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <p className="text-center text-gray-500 py-4">
                          No similar products found
                        </p>
                      )}

                      <div className="mt-6 flex justify-between">
                        <motion.button
                          onClick={() => {
                            resetCamera();
                            startCamera();
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Take Another Photo
                        </motion.button>
                        <motion.button
                          onClick={resetCamera}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

        {/* Mobile Filter Toggle Button */}
        <motion.div 
          className="md:hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={toggleMobileFilter}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className={`fas ${isMobileFilterOpen ? "fa-times" : "fa-filter"}`}></i>
            {isMobileFilterOpen ? "Close Filters" : "Show Filters"}
          </motion.button>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Sidebar - Desktop */}
          <motion.div 
            className="hidden md:block w-full md:w-1/4 lg:w-1/5 bg-white p-5 md:p-6 rounded-xl shadow-sm h-fit sticky top-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg font-semibold mb-3 md:mb-4 text-gray-800 border-b pb-2">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <motion.button
                      className={`w-full text-left py-2 md:py-2.5 px-3 rounded-md transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white font-medium"
                          : "hover:bg-blue-50 text-gray-700"
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

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 md:mb-4 text-gray-800 border-b pb-2">
                Sort By
              </h3>
              <select
                className="w-full p-2.5 md:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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

            <div className="mt-6 md:mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-gray-800 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-3">
                Our customer service is available 24/7
              </p>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:underline flex items-center"
              >
                <i className="fas fa-headset mr-2"></i> Contact Support
              </a>
            </div>
          </motion.div>

          {/* Sidebar - Mobile */}
          {isMobileFilterOpen && (
            <motion.div 
              className="md:hidden w-full bg-white p-5 rounded-xl shadow-sm mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
                  Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      className={`py-2 px-3 rounded-md transition-colors text-center ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white font-medium"
                          : "bg-gray-100 hover:bg-blue-50 text-gray-700"
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
                <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
                  Sort By
                </h3>
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                className="w-full py-3 bg-blue-600 text-white rounded-lg mt-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply Filters
              </motion.button>
            </motion.div>
          )}

          {/* Product Grid */}
          <motion.div 
            className="w-full md:w-3/4 lg:w-4/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {filteredProducts.length === 0 ? (
              <motion.div 
                className="text-center py-12 md:py-16 bg-white rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <motion.i 
                  className="fas fa-search text-4xl md:text-5xl text-gray-300 mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
                ></motion.i>
                <motion.h3 
                  className="text-lg md:text-xl text-gray-600 mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  {products.length === 0 ? 
                    "No products available for this store yet" : 
                    "No products found matching your criteria"}
                </motion.h3>
                <motion.p 
                  className="text-gray-500 mb-6 px-4"
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
                    className="px-5 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
                    Reset Filters
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <>
                <motion.div 
                  className="flex justify-between items-center mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <h2 className="text-lg md:text-xl font-medium text-gray-800">
                    {selectedCategory === "All"
                      ? "All Products"
                      : selectedCategory}
                    <span className="text-gray-500 ml-2 text-sm">
                      ({filteredProducts.length} items)
                    </span>
                  </h2>
                  <div className="hidden md:block">
                    <select
                      className="p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                </motion.div>

                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300"
                      variants={itemVariants}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={product.images && product.images[0] 
                            ? product.images[0] 
                            : "https://placehold.co/400x320?text=Product+Image"}
                          alt={product.name}
                          className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            console.error("Error loading product image:", e);
                            e.target.src = "https://placehold.co/400x320?text=Product+Image";
                          }}
                        />
                        <div className="absolute inset-0 bg-blue-600 bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-0 right-0 p-2 md:p-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-full group-hover:translate-x-0">
                          <button
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            aria-label="Add to wishlist"
                          >
                            <i className="far fa-heart text-gray-600 hover:text-red-500 transition-colors"></i>
                          </button>
                          <button
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            aria-label="Add to cart"
                          >
                            <i className="fas fa-shopping-cart text-gray-600 hover:text-green-500 transition-colors"></i>
                          </button>
                          <button
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            aria-label="Compare"
                          >
                            <i className="fas fa-code-compare text-gray-600 hover:text-blue-500 transition-colors"></i>
                          </button>
                          
                          <Link 
                            to={`/productdetails/${product.id}`}
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors block text-center"
                            aria-label="View details"
                          >
                            <i className="fas fa-eye text-gray-600 hover:text-purple-500 transition-colors"></i>
                          </Link>
                        </div>
                        {product.stock_quantity <= 0 && (
                          <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-red-500 text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                            Out of Stock
                          </div>
                        )}
                        {product.isNew && (
                          <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-green-500 text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                            New Arrival
                          </div>
                        )}
                        {product.discount && (
                          <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-yellow-500 text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                            {product.discount}% Off
                          </div>
                        )}
                        {product.category && (
                          <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 bg-blue-600 bg-opacity-80 text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                            {product.category}
                          </div>
                        )}
                      </div>
                      <div className="p-4 md:p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-base md:text-lg font-medium text-gray-800 line-clamp-1 hover:text-blue-600 transition-colors">
                            <Link to={`/productdetails/${product.id}`} className="hover:underline">
                              {product.name}
                            </Link>
                          </h3>
                          <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                            <i className="fas fa-star text-yellow-400 mr-1 text-xs"></i>
                            <span className="text-gray-600 text-sm">
                              {product.rating || "4.5"}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-lg md:text-m font-bold text-gray-800">
                              {parseFloat(product.price).toFixed(2)} EGP
                            </span>
                            {product.oldPrice && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                {parseFloat(product.oldPrice).toFixed(2)} EGP
                              </span>
                            )}
                          </div>
                          <motion.button
                            className={`p-1 rounded-lg text-sm ${
                              product.stock_quantity > 0
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-200 cursor-not-allowed text-gray-500"
                            } transition-colors`}
                            disabled={product.stock_quantity <= 0}
                            whileHover={product.stock_quantity > 0 ? { scale: 1.05 } : {}}
                            whileTap={product.stock_quantity > 0 ? { scale: 0.95 } : {}}
                          >
                            {product.stock_quantity > 0 ? "Add to Cart" : "Sold Out"}
                          </motion.button>
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
  );
}