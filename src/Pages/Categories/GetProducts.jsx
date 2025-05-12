import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function GetProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryId, subCategoryId } = useParams();
  const [subCategoryName, setSubCategoryName] = useState('');

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
      transition: { type: 'spring', stiffness: 100 }
    },
    hover: {
      y: -5,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: { type: 'spring', stiffness: 200 }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [subCategoryId]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost/eMall/products/getProductsBySubCategories.php?subid=${subCategoryId}`
      );

      if (response.data && response.data.products) {
        setProducts(response.data.products);
        
        // Set subcategory name based on first product or default
        if (response.data.products.length > 0) {
          // You might want to fetch the actual subcategory name from another API
          // For now, we'll use a placeholder
          setSubCategoryName('Product Collection');
        }
      } else {
        toast.error('Failed to load products');
        setProducts([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products. Please try again later.');
      setProducts([]);
      setLoading(false);
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
            {subCategoryName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Products</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our curated selection of high-quality products
          </p>
        </motion.div>

        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <Link to="/categories" className="ml-1 text-gray-600 hover:text-blue-600 md:ml-2">
                    Categories
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <Link to={`/categories/${categoryId}`} className="ml-1 text-gray-600 hover:text-blue-600 md:ml-2">
                    Category
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-1 text-blue-600 md:ml-2 font-medium">
                    {subCategoryName}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-gray-500">We couldn't find any products in this category.</p>
                <div className="mt-6">
                  <Link to="/categories" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                    Browse Categories
                  </Link>
                </div>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover="hover"
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x300?text=Product+Image';
                        }}
                      />
                      <div className="absolute top-0 right-0 m-2">
                        <button className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg text-gray-800">{product.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">By {product.store_name}</span>
                        <Link
                          to={`/product/${index}`} // Replace with actual product ID when available
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}