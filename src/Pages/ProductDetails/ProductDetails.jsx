import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '@fortawesome/fontawesome-free/css/all.min.css';

function ProductDetails() {
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [rating, setRating] = useState(0);
  
  // Mock product data
  const product = {
    id: 1,
    name: "Premium Cotton T-Shirt",
    price: 39.99,
    description: "This premium cotton t-shirt offers exceptional comfort with its breathable fabric. Perfect for casual outings or daily wear, it features a modern fit and durable construction that will last through countless washes without losing its shape or color.",
    longDescription: "Made from 100% organic cotton, this t-shirt is not only comfortable but also environmentally friendly. The fabric is pre-shrunk to ensure a consistent fit, and the reinforced seams add to its durability. Available in multiple sizes and colors, this versatile piece is a must-have addition to any wardrobe.",
    rating: 4.7,
    reviewCount: 124,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Navy', 'Gray'],
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800',
    ]
  };

  useEffect(() => {
    // Set the main image when component mounts
    if (product.images.length > 0) {
      setMainImage(product.images[0]);
    }
  }, []);

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const toggleSizeChart = () => {
    setShowSizeChart(!showSizeChart);
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

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden pt-16">
        <div className="md:flex">
          {/* Product Images Section */}
          <div className="md:w-1/2 p-6">
            <motion.div 
              className="mb-4 overflow-hidden rounded-lg"
              whileHover="hover"
              variants={imageVariants}
            >
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-80 object-cover"
              />
            </motion.div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <motion.div 
                  key={index}
                  className={`cursor-pointer rounded-md overflow-hidden border-2 ${mainImage === image ? 'border-blue-600' : 'border-transparent'}`}
                  whileHover="hover"
                  variants={imageVariants}
                  onClick={() => setMainImage(image)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} view ${index + 1}`} 
                    className="w-full h-20 object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Product Details Section */}
          <div className="md:w-1/2 p-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star ${i < Math.floor(product.rating) ? '' : 'text-gray-300'}`}></i>
                  ))}
                  {product.rating % 1 !== 0 && (
                    <i className="fas fa-star-half-alt"></i>
                  )}
                </div>
                <span className="text-gray-600">({product.reviewCount} reviews)</span>
              </div>
              
              <p className="text-2xl font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>
              
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-800">Size</h3>
                  <button 
                    onClick={toggleSizeChart}
                    className="text-blue-600 text-sm hover:underline flex items-center"
                  >
                    Size Chart <i className="fas fa-ruler ml-1"></i>
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <motion.button
                      key={size}
                      className={`px-4 py-2 rounded-md border ${
                        selectedSize === size 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-800 border-gray-300 hover:border-blue-600'
                      }`}
                      onClick={() => handleSizeSelect(size)}
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
                
                {/* Size Chart Modal */}
                {showSizeChart && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div 
                      className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Size Chart</h3>
                        <button onClick={toggleSizeChart} className="text-gray-500 hover:text-gray-700">
                          <i className="fas fa-times text-xl"></i>
                        </button>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border px-4 py-2">Size</th>
                              <th className="border px-4 py-2">Chest (in)</th>
                              <th className="border px-4 py-2">Waist (in)</th>
                              <th className="border px-4 py-2">Length (in)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border px-4 py-2 text-center">XS</td>
                              <td className="border px-4 py-2 text-center">34-36</td>
                              <td className="border px-4 py-2 text-center">28-30</td>
                              <td className="border px-4 py-2 text-center">26</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border px-4 py-2 text-center">S</td>
                              <td className="border px-4 py-2 text-center">36-38</td>
                              <td className="border px-4 py-2 text-center">30-32</td>
                              <td className="border px-4 py-2 text-center">27</td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 text-center">M</td>
                              <td className="border px-4 py-2 text-center">38-40</td>
                              <td className="border px-4 py-2 text-center">32-34</td>
                              <td className="border px-4 py-2 text-center">28</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border px-4 py-2 text-center">L</td>
                              <td className="border px-4 py-2 text-center">40-42</td>
                              <td className="border px-4 py-2 text-center">34-36</td>
                              <td className="border px-4 py-2 text-center">29</td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 text-center">XL</td>
                              <td className="border px-4 py-2 text-center">42-44</td>
                              <td className="border px-4 py-2 text-center">36-38</td>
                              <td className="border px-4 py-2 text-center">30</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border px-4 py-2 text-center">XXL</td>
                              <td className="border px-4 py-2 text-center">44-46</td>
                              <td className="border px-4 py-2 text-center">38-40</td>
                              <td className="border px-4 py-2 text-center">31</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-4 text-sm text-gray-600">
                        <p>Measurements are approximate. For the best fit, we recommend taking your own measurements and comparing them to the size chart.</p>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Quantity</h3>
                <div className="flex items-center">
                  <motion.button 
                    className="w-10 h-10 rounded-l-md bg-gray-100 flex items-center justify-center border border-gray-300"
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
                    className="w-16 h-10 border-t border-b border-gray-300 text-center"
                    value={quantity}
                    readOnly
                  />
                  
                  <motion.button 
                    className="w-10 h-10 rounded-r-md bg-gray-100 flex items-center justify-center border border-gray-300"
                    onClick={() => handleQuantityChange('increase')}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <i className="fas fa-plus text-gray-600"></i>
                  </motion.button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <motion.button 
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
                </motion.button>
                
                <motion.button 
                  className="flex-1 border border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-medium flex items-center justify-center"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  <i className="far fa-heart mr-2"></i> Add to Wishlist
                </motion.button>
              </div>
              
              {/* Additional Info */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <i className="fas fa-truck text-blue-600 mr-2"></i>
                    <span>Free shipping</span>
                  </div>
                  
                  <div className="flex items-center">
                    <i className="fas fa-undo text-blue-600 mr-2"></i>
                    <span>30-day returns</span>
                  </div>
                  
                  <div className="flex items-center">
                    <i className="fas fa-shield-alt text-blue-600 mr-2"></i>
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Product Description */}
        <div className="p-6 border-t border-gray-200">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Description</h2>
            <p className="text-gray-600 mb-4">{product.longDescription}</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span>100% premium cotton material</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span>Pre-shrunk to minimize shrinkage</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span>Reinforced seams for durability</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    <span>Machine washable and easy to care for</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Care Instructions</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <i className="fas fa-tshirt text-blue-600 mt-1 mr-2"></i>
                    <span>Machine wash cold with similar colors</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-temperature-low text-blue-600 mt-1 mr-2"></i>
                    <span>Tumble dry low</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-ban text-blue-600 mt-1 mr-2"></i>
                    <span>Do not bleach</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-iron text-blue-600 mt-1 mr-2"></i>
                    <span>Iron on low heat if needed</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* User Feedback Section */}
        <div className="p-6 border-t border-gray-200">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
            
            {/* Write a Review */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
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
                      className="text-2xl focus:outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your experience with this product..."
                  value={feedback}
                  onChange={handleFeedbackChange}
                ></textarea>
              </div>
              
              {/* Submit Button */}
              <motion.button
                onClick={submitFeedback}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium"
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                disabled={!feedback.trim() || rating === 0}
              >
                Submit Review
              </motion.button>
            </div>
            
            {/* Display User Feedbacks */}
            <div className="space-y-6">
              {userFeedbacks.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Your Reviews</h3>
                  {userFeedbacks.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-800">{item.user}</p>
                          <p className="text-sm text-gray-500">{item.date}</p>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fas fa-star ${i < item.rating ? '' : 'text-gray-300'}`}></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{item.text}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Mock Reviews */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Customer Reviews</h3>
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">John D.</p>
                      <p className="text-sm text-gray-500">2 weeks ago</p>
                    </div>
                    <div className="flex text-yellow-400">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                  <p className="text-gray-700">This is the best t-shirt I've ever owned. The fabric is so soft and comfortable, and it fits perfectly. Highly recommend!</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">Sarah M.</p>
                      <p className="text-sm text-gray-500">1 month ago</p>
                    </div>
                    <div className="flex text-yellow-400">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="far fa-star text-gray-300"></i>
                    </div>
                  </div>
                  <p className="text-gray-700">Great quality t-shirt. The material is nice and thick, not see-through at all. I ordered a medium and it fits as expected.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductDetails;
