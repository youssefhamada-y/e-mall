import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Zara() {
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
  const videoRef = React.useRef(null);

  // Mock data for Zara products
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const zaraProducts = [
        {
          id: 1,
          name: "Slim Fit Blazer",
          price: 89.99,
          category: "Men",
          image: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?ixlib=rb-4.0.3",
          description: "Elegant slim fit blazer with modern cut",
          rating: 4.5,
          inStock: true
        },
        {
          id: 2,
          name: "Floral Print Dress",
          price: 49.99,
          category: "Women",
          image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3",
          description: "Beautiful floral pattern summer dress",
          rating: 4.7,
          inStock: true
        },
        {
          id: 3,
          name: "Denim Jacket",
          price: 59.99,
          category: "Men",
          image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-4.0.3",
          description: "Classic denim jacket with modern details",
          rating: 4.3,
          inStock: true
        },
        {
          id: 4,
          name: "High Waist Jeans",
          price: 45.99,
          category: "Women",
          image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3",
          description: "Trendy high waist jeans with perfect fit",
          rating: 4.6,
          inStock: false
        },
        {
          id: 5,
          name: "Striped T-Shirt",
          price: 19.99,
          category: "Men",
          image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3",
          description: "Casual striped t-shirt for everyday wear",
          rating: 4.2,
          inStock: true
        },
        {
          id: 6,
          name: "Summer Blouse",
          price: 29.99,
          category: "Women",
          image: "https://images.unsplash.com/photo-1589810635657-232948472d98?ixlib=rb-4.0.3",
          description: "Light and airy summer blouse with delicate details",
          rating: 4.4,
          inStock: true
        },
        {
          id: 7,
          name: "Kids Denim Overall",
          price: 35.99,
          category: "Kids",
          image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3",
          description: "Cute and durable denim overall for active kids",
          rating: 4.8,
          inStock: true
        },
        {
          id: 8,
          name: "Leather Handbag",
          price: 79.99,
          category: "Accessories",
          image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3",
          description: "Elegant leather handbag with multiple compartments",
          rating: 4.9,
          inStock: true
        }
      ];

      setProducts(zaraProducts);
      setFilteredProducts(zaraProducts);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort products
    switch(sortBy) {
      case "priceAsc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "nameAsc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // featured - keep original order
        break;
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchTerm, sortBy]);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Get unique categories
  const categories = ["All", ...new Set(products.map(product => product.category))];

  // Toggle mobile filter drawer
  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  const startCamera = () => {
    setIsCameraActive(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(error => {
        console.error("Error accessing camera:", error);
      });
  };

  const stopCamera = () => {
    const video = videoRef.current;
    video.srcObject.getTracks().forEach(track => track.stop());
    setIsCameraActive(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
    stopCamera();
  };

  const resetCamera = () => {
    setIsCameraActive(false);
    setCapturedImage(null);
    setSimilarProducts([]);
    setIsSimilarProductsLoading(false);
  };

  useEffect(() => {
    if (capturedImage) {
      setIsSimilarProductsLoading(true);
      // Simulate similar products retrieval
      setTimeout(() => {
        const similarProducts = [
          {
            id: 9,
            name: "Similar Blazer",
            price: 89.99,
            category: "Men",
            image: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?ixlib=rb-4.0.3",
            description: "Elegant slim fit blazer with modern cut",
            rating: 4.5,
            inStock: true
          },
          {
            id: 10,
            name: "Similar Dress",
            price: 49.99,
            category: "Women",
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3",
            description: "Beautiful floral pattern summer dress",
            rating: 4.7,
            inStock: true
          },
          {
            id: 11,
            name: "Similar Jacket",
            price: 59.99,
            category: "Men",
            image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-4.0.3",
            description: "Classic denim jacket with modern details",
            rating: 4.3,
            inStock: true
          },
          {
            id: 12,
            name: "Similar Jeans",
            price: 45.99,
            category: "Women",
            image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3",
            description: "Trendy high waist jeans with perfect fit",
            rating: 4.6,
            inStock: false
          },
          {
            id: 13,
            name: "Similar T-Shirt",
            price: 19.99,
            category: "Men",
            image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3",
            description: "Casual striped t-shirt for everyday wear",
            rating: 4.2,
            inStock: true
          },
          {
            id: 14,
            name: "Similar Blouse",
            price: 29.99,
            category: "Women",
            image: "https://images.unsplash.com/photo-1589810635657-232948472d98?ixlib=rb-4.0.3",
            description: "Light and airy summer blouse with delicate details",
            rating: 4.4,
            inStock: true
          },
          {
            id: 15,
            name: "Similar Overall",
            price: 35.99,
            category: "Kids",
            image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3",
            description: "Cute and durable denim overall for active kids",
            rating: 4.8,
            inStock: true
          },
          {
            id: 16,
            name: "Similar Handbag",
            price: 79.99,
            category: "Accessories",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3",
            description: "Elegant leather handbag with multiple compartments",
            rating: 4.9,
            inStock: true
          }
        ];
        setSimilarProducts(similarProducts);
        setIsSimilarProductsLoading(false);
      }, 1000);
    }
  }, [capturedImage]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logo Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-8 md:py-12 flex justify-center"
      >
        <motion.img 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/1200px-Zara_Logo.svg.png" 
          alt="Zara Logo" 
          className="h-12 md:h-16 mt-20 md:mt-20"
        />
      </motion.div>

      <div className="container mx-auto px-4 pb-16 md:pb-20">
        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full mb-8 md:mb-12"
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

        {/* Camera Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full mb-8 md:mb-12 bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-medium">Visual Search</h3>
            <p className="text-sm text-gray-500">Find products by taking a photo</p>
          </div>
          
          {!isCameraActive && !capturedImage ? (
            <div className="p-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <i className="fas fa-camera text-blue-500 text-3xl"></i>
              </div>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                Take a photo of an item you like and we'll help you find similar products in our store.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startCamera}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md"
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
                      whileTap={{ scale: 0.9 }}
                      onClick={stopCamera}
                      className="bg-white rounded-full p-3 shadow-lg"
                    >
                      <i className="fas fa-times text-red-500 text-xl"></i>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={captureImage}
                      className="bg-white rounded-full p-3 shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-full border-4 border-blue-600"></div>
                    </motion.button>
                  </div>
                </>
              ) : capturedImage ? (
                <div>
                  <div className="relative w-full h-80 bg-black">
                    <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
                    {isSimilarProductsLoading ? (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                      </div>
                    ) : null}
                  </div>
                  
                  {!isSimilarProductsLoading && (
                    <div className="p-4">
                      <h4 className="text-lg font-medium mb-3">Similar Products</h4>
                      {similarProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {similarProducts.map(product => (
                            <div key={product.id} className="cursor-pointer hover:opacity-80 transition-opacity">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-32 object-cover rounded-lg shadow-sm"
                              />
                              <p className="text-sm mt-2 font-medium line-clamp-1">{product.name}</p>
                              <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-4">No similar products found</p>
                      )}
                      
                      <div className="mt-6 flex justify-between">
                        <button 
                          onClick={() => {
                            resetCamera();
                            startCamera();
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          Take Another Photo
                        </button>
                        <button 
                          onClick={resetCamera}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </motion.div>

        {/* Mobile Filter Toggle Button */}
        <div className="md:hidden mb-6">
          <button 
            onClick={toggleMobileFilter}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg shadow-sm"
          >
            <i className={`fas ${isMobileFilterOpen ? 'fa-times' : 'fa-filter'}`}></i>
            {isMobileFilterOpen ? 'Close Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Sidebar - Desktop */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block w-full md:w-1/4 lg:w-1/5 bg-white p-5 md:p-6 rounded-xl shadow-sm h-fit sticky top-4"
          >
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg font-semibold mb-3 md:mb-4 text-gray-800 border-b pb-2">Categories</h3>
              <div className="space-y-1">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <button
                      className={`w-full text-left py-2 md:py-2.5 px-3 rounded-md transition-colors ${
                        selectedCategory === category 
                          ? "bg-blue-600 text-white font-medium" 
                          : "hover:bg-blue-50 text-gray-700"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 md:mb-4 text-gray-800 border-b pb-2">Sort By</h3>
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
              <p className="text-sm text-gray-600 mb-3">Our customer service is available 24/7</p>
              <a href="#" className="text-sm font-medium text-blue-600 hover:underline flex items-center">
                <i className="fas fa-headset mr-2"></i> Contact Support
              </a>
            </div>
          </motion.div>

          {/* Sidebar - Mobile */}
          {isMobileFilterOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden w-full bg-white p-5 rounded-xl shadow-sm mb-6"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`py-2 px-3 rounded-md transition-colors text-center ${
                        selectedCategory === category 
                          ? "bg-blue-600 text-white font-medium" 
                          : "bg-gray-100 hover:bg-blue-50 text-gray-700"
                      }`}
                      onClick={() => {
                        setSelectedCategory(category);
                        if (window.innerWidth < 768) setIsMobileFilterOpen(false);
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Sort By</h3>
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
              
              <button 
                onClick={toggleMobileFilter}
                className="w-full py-3 bg-blue-600 text-white rounded-lg mt-2"
              >
                Apply Filters
              </button>
            </motion.div>
          )}

          {/* Product Grid */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-200"></div>
                    <div className="p-4 md:p-5">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 md:py-16 bg-white rounded-xl shadow-sm"
              >
                <i className="fas fa-search text-4xl md:text-5xl text-gray-300 mb-4"></i>
                <h3 className="text-lg md:text-xl text-gray-600 mb-3">No products found matching your criteria</h3>
                <p className="text-gray-500 mb-6 px-4">Try adjusting your search or filter to find what you're looking for.</p>
                <button 
                  className="px-5 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSortBy("featured");
                  }}
                >
                  Reset Filters
                </button>
              </motion.div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg md:text-xl font-medium text-gray-800">
                    {selectedCategory === "All" ? "All Products" : selectedCategory}
                    <span className="text-gray-500 ml-2 text-sm">({filteredProducts.length} items)</span>
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
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>
                </div>
                
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                >
                  {filteredProducts.map(product => (
                    <motion.div 
                      key={product.id}
                      variants={itemVariants}
                      whileHover="hover"
                      className="bg-white rounded-xl shadow-sm overflow-hidden group"
                    >
                      <div className="relative overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-blue-600 bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-0 right-0 p-2 md:p-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-full group-hover:translate-x-0">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                          >
                            <i className="far fa-heart text-gray-600 hover:text-red-500 transition-colors"></i>
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                          >
                            <i className="fas fa-shopping-cart text-gray-600 hover:text-green-500 transition-colors"></i>
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                          >
                            <i className="fas fa-eye text-gray-600 hover:text-purple-500 transition-colors"></i>
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                          >
                            <i className="fas fa-code-compare text-gray-600 hover:text-purple-500 transition-colors"></i>
                          </motion.button>
                        </div>
                        {!product.inStock && (
                          <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-red-500 text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                            Out of Stock
                          </div>
                        )}
                        <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 bg-blue-600 bg-opacity-80 text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                          {product.category}
                        </div>
                      </div>
                      <div className="p-4 md:p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-base md:text-lg font-medium text-gray-800 line-clamp-1">{product.name}</h3>
                          <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                            <i className="fas fa-star text-yellow-400 mr-1 text-xs"></i>
                            <span className="text-gray-600 text-sm">{product.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg md:text-xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm ${
                              product.inStock 
                                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                : "bg-gray-200 cursor-not-allowed text-gray-500"
                            }`}
                            disabled={!product.inStock}
                          >
                            {product.inStock ? "Add to Cart" : "Sold Out"}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Pagination - For future implementation */}
                {filteredProducts.length > 12 && (
                  <div className="mt-10 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                        <i className="fas fa-chevron-left text-xs"></i>
                      </button>
                      <button className="px-3 py-1 rounded-md border border-blue-600 bg-blue-600 text-white">1</button>
                      <button className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">2</button>
                      <button className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">3</button>
                      <span className="px-2 text-gray-500">...</span>
                      <button className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">8</button>
                      <button className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                        <i className="fas fa-chevron-right text-xs"></i>
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
