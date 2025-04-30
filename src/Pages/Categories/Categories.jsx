import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch categories from API (mock data for now)
    const fetchCategories = async () => {
      try {
        // Simulate API call with timeout
        setTimeout(() => {
          const mockCategories = [
            {
              id: 1,
              name: "Men's Fashion",
              image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3",
              itemCount: 1245,
              subcategories: [
                {
                  id: 101,
                  name: "Formal Wear",
                  image: "https://images.unsplash.com/photo-1593032465175-481ac7f401f0?ixlib=rb-4.0.3",
                  itemCount: 328,
                  description: "Professional attire for the modern gentleman"
                },
                {
                  id: 102,
                  name: "Casual Wear",
                  image: "https://images.unsplash.com/photo-1552831388-6a0b3575b32a?ixlib=rb-4.0.3",
                  itemCount: 452,
                  description: "Relaxed styles for everyday comfort"
                },
                {
                  id: 103,
                  name: "Activewear",
                  image: "https://images.unsplash.com/photo-1616690010099-acd383093752?ixlib=rb-4.0.3",
                  itemCount: 215,
                  description: "Performance clothing for sports and fitness"
                },
                {
                  id: 104,
                  name: "Accessories",
                  image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?ixlib=rb-4.0.3",
                  itemCount: 250,
                  description: "Watches, belts, ties and more to complete your look"
                }
              ],
              description: "Explore the latest trends in men's clothing, shoes, and accessories."
            },
            {
              id: 2,
              name: "Women's Fashion",
              image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3",
              itemCount: 2367,
              subcategories: [
                {
                  id: 201,
                  name: "Dresses",
                  image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3",
                  itemCount: 583,
                  description: "From casual to formal, find the perfect dress"
                },
                {
                  id: 202,
                  name: "Tops & Blouses",
                  image: "https://images.unsplash.com/photo-1551163943-3f7fb896e0db?ixlib=rb-4.0.3",
                  itemCount: 674,
                  description: "Stylish tops for every occasion"
                },
                {
                  id: 203,
                  name: "Footwear",
                  image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3",
                  itemCount: 428,
                  description: "Heels, flats, boots and more"
                },
                {
                  id: 204,
                  name: "Jewelry",
                  image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3",
                  itemCount: 682,
                  description: "Elegant pieces to enhance your style"
                }
              ],
              description: "Discover stylish dresses, tops, shoes, and accessories for women."
            }
          ]
          
          setCategories(mockCategories)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories')
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    },
    hover: {
      y: -5,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: { type: 'spring', stiffness: 200 }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-44 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Fashion Categories</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the latest trends and styles for both men and women, curated for the fashion-forward shopper.
          </p>
        </motion.div>

        {/* Main Categories */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
          >
            {categories.map(category => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover="hover"
                className="relative overflow-hidden rounded-xl shadow-lg group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10 flex items-center justify-center">
                  <div className="text-center p-6">
                    <h3 className="text-white text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-white/90 mb-4">{category.description}</p>
                    <Link 
                      to={`/categories/${category.id}`}
                      className="inline-block px-6 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors"
                    >
                      Explore Collection
                    </Link>
                  </div>
                </div>
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent z-[5]">
                  <h3 className="text-white text-2xl font-bold mb-1">{category.name}</h3>
                  <p className="text-white/80">{category.itemCount.toLocaleString()} items</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Subcategories */}
        {!loading && (
          <div className="space-y-16">
            {categories.map(category => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    {category.name} Collections
                  </h2>
                  <Link 
                    to={`/categories/${category.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    View All <span className="ml-1">→</span>
                  </Link>
                </div>
                
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {category.subcategories.map(subcat => (
                    <motion.div
                      key={subcat.id}
                      variants={itemVariants}
                      whileHover="hover"
                      className={`rounded-xl overflow-hidden shadow-sm ${
                        category.id === 1 
                          ? "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200" 
                          : "bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200"
                      }`}
                    >
                      <Link to={`/categories/${category.id}/${subcat.id}`} className="block">
                        <div className="relative h-48 overflow-hidden">
                          <div className={`absolute inset-0 ${
                            category.id === 1 
                              ? "bg-blue-600/10" 
                              : "bg-purple-600/10"
                          }`}></div>
                          <img 
                            src={subcat.image} 
                            alt={subcat.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                        <div className="p-5">
                          <h3 className={`font-medium text-lg mb-1 ${
                            category.id === 1 ? "text-blue-800" : "text-purple-800"
                          }`}>
                            {subcat.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">{subcat.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{subcat.itemCount} items</span>
                            <span className={`text-sm font-medium ${
                              category.id === 1 ? "text-blue-600" : "text-purple-600"
                            }`}>
                              Shop Now →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Fashion Trends Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Latest Fashion Trends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 shadow-sm">
              <div className="h-12 w-12 bg-amber-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <i className="fas fa-tshirt"></i>
              </div>
              <h3 className="text-lg font-medium text-amber-800 mb-2">Sustainable Fashion</h3>
              <p className="text-amber-700/80 text-sm">Eco-friendly clothing options that don't compromise on style.</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 shadow-sm">
              <div className="h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <i className="fas fa-palette"></i>
              </div>
              <h3 className="text-lg font-medium text-emerald-800 mb-2">Seasonal Colors</h3>
              <p className="text-emerald-700/80 text-sm">Explore this season's trending colors and patterns.</p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-6 shadow-sm">
              <div className="h-12 w-12 bg-rose-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <i className="fas fa-gem"></i>
              </div>
              <h3 className="text-lg font-medium text-rose-800 mb-2">Accessories Guide</h3>
              <p className="text-rose-700/80 text-sm">Complete your outfit with the perfect accessories.</p>
            </div>
          </div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with Fashion Trends</h2>
          <p className="mb-6 max-w-2xl mx-auto">Subscribe to our newsletter to receive the latest updates on new arrivals, exclusive offers, and fashion tips.</p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
