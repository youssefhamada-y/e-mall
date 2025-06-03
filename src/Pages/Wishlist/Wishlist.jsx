import React, { useState, useContext } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Loading from '../Loading/Loading';
import { WishlistContext } from '../Components/Context/WishlistContext/WishlistContext';
import { cartcontext } from '../Components/Context/CartContext/CartContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading } = useContext(WishlistContext);
  const { addProductToCart } = useContext(cartcontext);
  const [recommendedItems] = useState([]);

  const handleRemoveFromWishlist = (productId,) => {
    removeFromWishlist(productId);
    toast.success(`item has been removed from your wishlist`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Handle add to cart
  const handleAddToCart = (productId) => {
    addProductToCart({ product_id: productId, quantity: 1 });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-indigo-50 via-purple-50 to-white min-h-screen py-8 px-4 pt-32"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-extrabold text-indigo-800 inline-block relative">
            <span className="relative z-10">My Wishlist</span>
            <motion.span 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute bottom-0 left-0 h-3 bg-pink-200 opacity-50 z-0"
            ></motion.span>
          </h1>
          <p className="text-gray-600 mt-2 text-base">Items you've saved for later</p>
        </motion.div>

        {/* Empty state */}
        {!wishlist || wishlist.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-10 text-center max-w-md mx-auto backdrop-blur-sm bg-white/90"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <i className="far fa-heart text-indigo-500 text-3xl"></i>
            </motion.div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start saving items you love for inspiration or future purchases</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/categories" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-xl inline-block">
                <i className="fas fa-search mr-2"></i>
                Discover Products
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Wishlist grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {wishlist.map((item, index) => (
                  <motion.div
                    key={item.product_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/90"
                  >
                    <div className="relative group">
                      <img src={item.images[0]} alt={item.name} className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-110" />
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveFromWishlist(item.product_id)}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md text-red-500 hover:text-red-700 transition-colors"
                      >
                        <i className="fas fa-times"></i>
                      </motion.button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <motion.i 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }} 
                            className={`${
                              i < Math.floor(item.rating || 0) 
                                ? 'fas fa-star text-yellow-400' 
                                : i < Math.ceil(item.rating || 0) 
                                  ? 'fas fa-star-half-alt text-yellow-400' 
                                  : 'far fa-star text-gray-300'
                            } text-sm`}
                          ></motion.i>
                        ))}
                        <span className="ml-2 text-sm text-gray-500">({item.rating || "N/A"})</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          ${parseFloat(item.price).toFixed(2)}
                        </span>
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
                            item.stock_quantity > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </motion.span>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddToCart(item.product_id)}
                        disabled={item.stock_quantity <= 0}
                        className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center transition-all duration-300 ${
                          item.stock_quantity > 0 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-xl' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <i className="fas fa-shopping-cart mr-2"></i>
                        Add to Cart
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {recommendedItems.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">You Might Also Like</h2>
                <Slider
                  dots={false}
                  infinite={true}
                  speed={500}
                  slidesToShow={4}
                  slidesToScroll={1}
                  prevArrow={<CustomPrevArrow />}
                  nextArrow={<CustomNextArrow />}
                  responsive={[
                    {
                      breakpoint: 1024,
                      settings: {
                        slidesToShow: 3,
                      }
                    },
                    {
                      breakpoint: 768,
                      settings: {
                        slidesToShow: 2,
                      }
                    },
                    {
                      breakpoint: 640,
                      settings: {
                        slidesToShow: 1,
                      }
                    }
                  ]}
                >
                  {recommendedItems.map((item) => (
                    <motion.div 
                      key={item.id} 
                      className="px-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      {/* Recommended item card content */}
                    </motion.div>
                  ))}
                </Slider>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

function CustomPrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`${className} z-10 before:content-none`}
      style={{ ...style, display: "block", left: "-25px" }}
      onClick={onClick}
    >
      <button className="p-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-300/50 focus:outline-none w-10 h-10 flex items-center justify-center rounded-full">
        <i className="fas fa-chevron-left"></i>
      </button>
    </motion.div>
  );
}

function CustomNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`${className} z-10 before:content-none`}
      style={{ ...style, display: "block", right: "-25px" }}
      onClick={onClick}
    >
      <button className="p-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-300/50 focus:outline-none w-10 h-10 flex items-center justify-center rounded-full">
        <i className="fas fa-arrow-right"></i>
      </button>
    </motion.div>
  );
}

export default Wishlist;
