import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function Home() {
  // State for the interactive product showcase
  const [showSpotlight, setShowSpotlight] = useState(false);

  
 

  

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
            Your Fashion <span className="text-blue-400">Destination</span>
          </motion.h2>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto"
          >
            Discover the perfect blend of local designers like Novincci and global brands 
            like Zara and Adidas, all in one place
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
              Explore stores
            </Link>
            <Link
              to="/aboutus"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition duration-300 flex items-center gap-2"
            >
              <i className="fas fa-info-circle"></i>
About Us            </Link>
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
            The Ultimate Shopping Experience
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "fas fa-tshirt",
                title: "Local & Global Brands",
                description: "Shop from local designers like Novincci alongside international favorites like Zara and Adidas"
              },
              {
                icon: "fas fa-store",
                title: "All Under One Roof",
                description: "Access all your favorite clothing brands through our unified e-mall platform"
              },
              {
                icon: "fas fa-shield-alt",
                title: "Authentic Products",
                description: "Every item is guaranteed authentic with direct partnerships with brands"
              },
              {
                icon: "fas fa-shipping-fast",
                title: "Fast Delivery",
                description: "Enjoy quick shipping options for both local and international brands"
              },
              {
                icon: "fas fa-tags",
                title: "Exclusive Collections",
                description: "Access limited edition pieces and e-mall exclusive collaborations"
              },
              {
                icon: "fas fa-headset",
                title: "Dedicated Support",
                description: "Our fashion experts are available to help with styling advice and product questions"
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
            Shop By Category
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                name: "Local Designers",
                icon: "fas fa-gem",
                color: "bg-emerald-500"
              },
              {
                name: "High-End Brands",
                icon: "fas fa-crown",
                color: "bg-indigo-500"
              },
              {
                name: "Activewear",
                icon: "fas fa-running",
                color: "bg-orange-500"
              },
              {
                name: "Accessories",
                icon: "fas fa-glasses",
                color: "bg-rose-500"
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
            Our Featured Brands
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                name: 'Zara',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/1200px-Zara_Logo.svg.png',
                type: 'High-End'
              },
              {
                name: 'Novincci',
                logo: 'https://novenccieg.com/cdn/shop/files/BACK_copy_ad12c809-ab61-4aa9-9319-51ea3529ee8d.png?v=1707655958&width=100',
                type: 'Local'
              },
              {
                name: 'Nike',
                logo: "https://media.about.nike.com/img/cf68f541-fc92-4373-91cb-086ae0fe2f88/001-nike-logos-swoosh-black.jpg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwiZXh0cmFjdCI6eyJsZWZ0IjowLCJ0b3AiOjAsIndpZHRoIjo1MDAwLCJoZWlnaHQiOjI4MTN9LCJyZXNpemUiOnsid2lkdGgiOjE5MjB9fX0%3D&s=4617fc4ca48a0336d90d25001a63e65147c95885bad727aa1b5473cf672dc459",
                type: 'Premium'
              },
              {
                name: 'Adidas',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png',
                type: 'Premium'
              }
            ].map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-lg transition duration-300"
              >
                <img 
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="h-12 object-contain mb-3"
                />
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  brand.type === 'Local' ? 'bg-emerald-100 text-emerald-800' : 
                  brand.type === 'High-End' ? 'bg-indigo-100 text-indigo-800' : 
                  'bg-orange-100 text-orange-800'
                }`}>
                  {brand.type}
                </span>
              </motion.div>
            ))}
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
                    Premium quality clothing with excellent craftsmanship and attention to detail.
                    This piece combines style, comfort and durability for the perfect addition to your wardrobe.
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