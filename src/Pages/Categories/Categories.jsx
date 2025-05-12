import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { usercontext } from '../Components/Context/UserContext/UserContext'
import axios from 'axios'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [subCatLoading, setSubCatLoading] = useState(true)
  const [categoryType, setCategoryType] = useState('women')
  const {token} = useContext(usercontext) 


  async function fetchCategories(type) {
    try {
      const options = {
        url: `http://localhost/eMall/categories/getNumberOfCategories.php`,
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        params: {
          'type': type
        }
      }
      
      setLoading(true);
      const response = await axios(options);
      
      if (response.data.message === "success") {
        console.log(response.data);
        
        // Create a category based on the response data
        const categoryData = [
          {
            id: 1,
            name: `${type.charAt(0).toUpperCase() + type.slice(1)}'s Fashion`,
            description: `Explore our ${type}'s collection with the latest trends`,
            image: type === 'women' 
              ? 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
              : 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
            total: response.data.total || 0
          }
        ];
        
        setCategories(categoryData);
        
        // Fetch subcategories after main categories are loaded
        if (categoryData.length > 0) {
          fetchSubCategories(type);
        }
      } else {
        toast.error(response.data.message || "Failed to load categories");
        setCategories([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories. Please try again later.');
      setCategories([]);
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchCategories(categoryType);
  }, [token, categoryType]);

  async function fetchSubCategories(type) {
    try {
      setSubCatLoading(true);
      const options = {
        url: `http://localhost/eMall/categories/getSubCategories.php`,
        method: "GET",
        params: {
          'sub': type
        }
      };
      
      const response = await axios(options);
      
      if (response.data && Array.isArray(response.data)) {
        // Enhance the subcategories with images and item counts
        const enhancedSubCategories = response.data.map(subCat => ({
          ...subCat,
          image: getSubCategoryImage(subCat.title, type),
          itemCount: Math.floor(Math.random() * 100) + 20 // Placeholder for item count
        }));
        
        setSubCategories(enhancedSubCategories);
      } else {
        console.error('Invalid subcategories response:', response.data);
        setSubCategories([]);
      }
      setSubCatLoading(false);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Failed to load subcategories. Please try again later.');
      setSubCategories([]);
      setSubCatLoading(false);
    }
  }
  
  // Helper function to get images for subcategories
  function getSubCategoryImage(title, type) {
    const images = {
      'Formal Wear': type === 'women' 
        ? 'https://images.unsplash.com/photo-1548609036-7d31e7f38c0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
        : 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
      'Casual Wear': type === 'women'
        ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=720&q=80'
        : 'https://images.unsplash.com/photo-1552831388-6a0b3575b32a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      'Active Wear': type === 'women'
        ? 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        : 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'Accessories': type === 'women'
        ? 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80'
        : 'https://images.unsplash.com/photo-1624526267942-ab0c0e53d0e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    };
    
    return images[title] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
  }

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

        {/* Category Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white rounded-full shadow-md p-1 inline-flex">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategoryType('women')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                categoryType === 'women' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Women
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategoryType('men')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                categoryType === 'men' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Men
            </motion.button>
          </div>
        </motion.div>

        {/* Main Categories */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm animate-pulse flex ">
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
            key={categoryType} // Re-render animation when category type changes
          >
            {categories.map(category => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover="hover"
                className="relative overflow-hidden rounded-xl shadow-lg group "
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
                  <p className="text-white/80">{category.total.toLocaleString()} items</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Subcategories */}
        {!loading && !subCatLoading && subCategories.length > 0 && (
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
                  {subCategories.map(subcat => (
                    <motion.div
                      key={subcat.id}
                      variants={itemVariants}
                      whileHover="hover"
                      className={`rounded-xl overflow-hidden shadow-sm ${
                        categoryType === 'women' 
                          ? "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200" 
                          : "bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200"
                      }`}
                    >
                      <Link to={`/categories/${category.id}/${subcat.id}`} className="block">
                        <div className="relative h-48 overflow-hidden">
                          <div className={`absolute inset-0 ${
                            categoryType === 'women' 
                              ? "bg-blue-600/10" 
                              : "bg-purple-600/10"
                          }`}></div>
                          <img 
                            src={subcat.image} 
                            alt={subcat.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                        <div className="p-5">
                          <h3 className={`font-medium text-lg mb-1 ${
                            categoryType === 'women' ? "text-blue-800" : "text-purple-800"
                          }`}>
                            {subcat.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">{subcat.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{subcat.product_count} items</span>
                            <span className={`text-sm font-medium ${
                              categoryType === 'women' ? "text-blue-600" : "text-purple-600"
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

     

      
      </div>
    </div>
  )
}
