import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function Home() {
  // State for the interactive product showcase
  const [activeCategory, setActiveCategory] = useState('trending');
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [spotlightProduct, setSpotlightProduct] = useState(null);
  const [cardRotations, setCardRotations] = useState({});
  
  // Simulated product data
  const products = {
    trending: [
      { 
        id: 1, 
        name: 'Ultra Boost Sneakers', 
        price: '$189.99', 
        discount: '15% OFF', 
        tags: ['New', 'Popular'], 
        image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' 
      },
      { 
        id: 2, 
        name: 'Smart Home Hub', 
        price: '$129.99', 
        discount: '', 
        tags: ['Tech'], 
        image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' 
      },
      { 
        id: 3, 
        name: 'Designer Backpack', 
        price: '$79.99', 
        discount: '20% OFF', 
        tags: ['Fashion'], 
        image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' 
      },
    ],
    deals: [
      { 
        id: 4, 
        name: 'Wireless Earbuds', 
        price: '$89.99', 
        discount: '30% OFF', 
        tags: ['Flash Sale'], 
        image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' 
      },
      { 
        id: 5, 
        name: 'Fitness Tracker', 
        price: '$49.99', 
        discount: '25% OFF', 
        tags: ['Tech'], 
        image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63eaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' 
      },
      { 
        id: 6, 
        name: 'Portable Blender', 
        price: '$34.99', 
        discount: '40% OFF', 
        tags: ['Kitchen'], 
        image: 'https://images.unsplash.com/photo-1560107122-e77b0f3443a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' 
      },
    ],
    new: [
      { 
        id: 7, 
        name: 'Sustainable Yoga Mat', 
        price: '$59.99', 
        discount: '', 
        tags: ['Eco-Friendly'], 
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' 
      },
      { 
        id: 8, 
        name: 'Smart Glasses', 
        price: '$299.99', 
        discount: '', 
        tags: ['Tech', 'New'], 
        image: 'https://images.unsplash.com/photo-1629694542904-c1f3d0638783?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' 
      },
      { 
        id: 9, 
        name: 'Vegan Leather Jacket', 
        price: '$149.99', 
        discount: '', 
        tags: ['Fashion'], 
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' 
      },
    ]
  };
  
  // Handle 3D card effect
  const handleCardMove = (e, id) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setCardRotations({
      ...cardRotations,
      [id]: { rotateX, rotateY }
    });
  };
  
  const resetCardRotation = (id) => {
    setCardRotations({
      ...cardRotations,
      [id]: { rotateX: 0, rotateY: 0 }
    });
  };
  
  // Open product spotlight
  const openSpotlight = (product) => {
    setSpotlightProduct(product);
    setShowSpotlight(true);
  };

  return (
    <>
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center bg-gradient-to-r from-cyan-900 to-blue-900 overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/10 rounded-full"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h2 
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-8"
          >
            The Future of <span className="text-blue-400">Shopping</span>
          </motion.h2>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto"
          >
            Experience the next generation of online shopping with AI-powered recommendations 
            and seamless multi-store integration
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-6 justify-center"
          >
            <Link
              to="/stores"
              className="bg-white text-cyan-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 flex items-center gap-2"
            >
              <i className="fas fa-shopping-bag"></i>
              Start Shopping
            </Link>
            <Link
              to="/aboutus"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition duration-300 flex items-center gap-2"
            >
              <i className="fas fa-info-circle"></i>
              Learn More
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Why Choose Our Platform
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "fas fa-robot",
                title: "AI-Powered Shopping",
                description: "Personalized recommendations based on your preferences and shopping history"
              },
              {
                icon: "fas fa-store",
                title: "Multi-Store Platform",
                description: "Access hundreds of verified stores through a single, unified platform"
              },
              {
                icon: "fas fa-shield-alt",
                title: "Secure Transactions",
                description: "Enterprise-grade security for all your shopping transactions"
              },
              {
                icon: "fas fa-shipping-fast",
                title: "Fast Delivery",
                description: "Optimized logistics network for quick and reliable deliveries"
              },
              {
                icon: "fas fa-tags",
                title: "Best Deals",
                description: "Automated price comparison and exclusive platform discounts"
              },
              {
                icon: "fas fa-headset",
                title: "24/7 Support",
                description: "Round-the-clock customer service with AI-assisted support"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="bg-cyan-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className={`${feature.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Trending Categories
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                name: "Fashion",
                icon: "fas fa-tshirt",
                color: "bg-pink-500"
              },
              {
                name: "Electronics",
                icon: "fas fa-mobile-alt",
                color: "bg-blue-500"
              },
              {
                name: "Home & Living",
                icon: "fas fa-home",
                color: "bg-green-500"
              },
              {
                name: "Beauty",
                icon: "fas fa-spa",
                color: "bg-purple-500"
              }
            ].map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.05 }}
                className={`${category.color} rounded-xl p-8 text-white text-center cursor-pointer`}
              >
                <i className={`${category.icon} text-4xl mb-4`}></i>
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Featured Brands
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                name: 'Zara',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/1200px-Zara_Logo.svg.png'
              },
              {
                name: 'H&M',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1200px-H%26M-Logo.svg.png'
              },
              {
                name: 'Nike',
                logo: "https://media.about.nike.com/img/cf68f541-fc92-4373-91cb-086ae0fe2f88/001-nike-logos-swoosh-black.jpg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwiZXh0cmFjdCI6eyJsZWZ0IjowLCJ0b3AiOjAsIndpZHRoIjo1MDAwLCJoZWlnaHQiOjI4MTN9LCJyZXNpemUiOnsid2lkdGgiOjE5MjB9fX0%3D&s=4617fc4ca48a0336d90d25001a63e65147c95885bad727aa1b5473cf672dc459", 
              },
              {
                name: 'Adidas',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png'
              }
            ].map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 flex items-center justify-center hover:shadow-lg transition duration-300"
              >
                <img 
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="h-12 object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Product Showcase */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-4xl font-bold mb-6 md:mb-0">
              <span className="mr-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
                Discover
              </span>
              What's Hot
            </h2>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveCategory("trending")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === "trending"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Trending Now
              </button>
              <button
                onClick={() => setActiveCategory("deals")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === "deals"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Best Deals
              </button>
              <button
                onClick={() => setActiveCategory("new")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === "new"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Just Arrived
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {products[activeCategory].map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                  style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                  }}
                  onMouseMove={(e) => handleCardMove(e, product.id)}
                  onMouseLeave={() => resetCardRotation(product.id)}
                >
                  <div
                    className="transition-all duration-200 ease-out"
                    style={{
                      transform: cardRotations[product.id]
                        ? `rotateX(${
                            cardRotations[product.id].rotateX
                          }deg) rotateY(${
                            cardRotations[product.id].rotateY
                          }deg)`
                        : "none",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {product.discount && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {product.discount}
                        </div>
                      )}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-white/80 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <button
                          onClick={() => openSpotlight(product)}
                          className="w-full py-3 bg-white/90 backdrop-blur-sm rounded-full font-medium text-gray-900 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-300"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {product.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-indigo-600">
                          {product.price}
                        </span>
                        <button
                          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-indigo-100 flex items-center justify-center transition-colors duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add to cart logic
                          }}
                        >
                          <i className="fas fa-shopping-bag text-indigo-600"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-12">
            <Link
              to={`/products/${activeCategory}`}
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
            >
              View All <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Spotlight Modal */}
      <AnimatePresence>
        {showSpotlight && spotlightProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSpotlight(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-90vh flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:w-1/2 relative">
                <img 
                  src={spotlightProduct.image}
                  alt={spotlightProduct.name}
                  className="w-full h-full object-cover"
                />
                {spotlightProduct.discount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {spotlightProduct.discount}
                  </div>
                )}
              </div>
              
              <div className="md:w-1/2 p-8 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{spotlightProduct.name}</h3>
                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="fas fa-star text-yellow-400 mr-1"></i>
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm ml-2">128 reviews</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowSpotlight(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                
                <div className="mb-6">
                  <span className="text-3xl font-bold text-indigo-600">{spotlightProduct.price}</span>
                  {spotlightProduct.discount && (
                    <span className="text-gray-500 line-through ml-2">
                      ${(parseFloat(spotlightProduct.price.replace('$', '')) * 1.2).toFixed(2)}
                    </span>
                  )}
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600">
                    Premium quality product with excellent craftsmanship and attention to detail.
                    This item combines style, functionality and durability for the perfect user experience.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Select Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button 
                        key={size}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Select Color</h4>
                  <div className="flex gap-3">
                    {['bg-black', 'bg-blue-500', 'bg-red-500', 'bg-green-500'].map((color) => (
                      <button 
                        key={color}
                        className={`w-8 h-8 rounded-full ${color} border border-gray-300`}
                      ></button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-4 mt-auto">
                  <button className="flex-1 py-3 border border-indigo-600 text-indigo-600 rounded-full font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center">
                    <i className="far fa-heart mr-2"></i> Save
                  </button>
                  <button className="flex-1 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center">
                    <i className="fas fa-shopping-bag mr-2"></i> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Home;