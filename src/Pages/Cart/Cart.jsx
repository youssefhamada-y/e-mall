import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { usercontext } from "../Components/Context/UserContext/UserContext";
import toast from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 3999.00, // Converted to Egyptian Pounds
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      quantity: 1,
      store: "Electronics Hub",
      inStock: true
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 5999.00, // Converted to Egyptian Pounds
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
      quantity: 2,
      store: "Tech World",
      inStock: true
    },
    {
      id: 3,
      name: "Smartphone Case",
      price: 499.00, // Converted to Egyptian Pounds
      image: "https://images.unsplash.com/photo-1541877944-ac82a091518a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      quantity: 1,
      store: "Mobile Accessories",
      inStock: false
    }
  ]);
  
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(usercontext);

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 300 : 0; // Adjusted shipping to Egyptian Pounds
  const total = subtotal + shipping - discount;

  // Handle quantity change
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  // Apply promo code
  const applyPromoCode = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (promoCode.toLowerCase() === "discount20") {
        const discountAmount = subtotal * 0.2;
        setDiscount(discountAmount);
        toast.success("Promo code applied successfully!");
      } else {
        toast.error("Invalid promo code");
      }
      setIsLoading(false);
    }, 1000);
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
    setPromoCode("");
    toast.success("Cart cleared");
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
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-32 max-w-7xl"
    >
      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white"
      >
        Your Shopping Cart
      </motion.h1>
      
      {cartItems.length === 0 ? (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-7xl mb-4"
          >
            🛒
          </motion.div>
          <motion.h2 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300"
          >
            Your cart is empty
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-gray-500 dark:text-gray-400 mb-8"
          >
            Looks like you haven't added anything to your cart yet.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="inline-block bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300">
              Continue Shopping
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Cart Items */}
          <motion.div 
            variants={itemVariants}
            className="lg:w-2/3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
              <div className="p-6">
                <div className="hidden md:flex justify-between border-b pb-4 mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <div className="w-2/5">Product</div>
                  <div className="w-1/5 text-center">Price</div>
                  <div className="w-1/5 text-center">Quantity</div>
                  <div className="w-1/5 text-center">Total</div>
                </div>
                
                <motion.div variants={containerVariants}>
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id} 
                      variants={itemVariants}
                      exit={{ opacity: 0, x: -100 }}
                      layout
                      className="flex flex-col md:flex-row items-center py-6 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      {/* Product Info */}
                      <div className="w-full md:w-2/5 flex items-center mb-4 md:mb-0">
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mr-4"
                        >
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </motion.div>
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">{item.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Store: {item.store}</p>
                          {!item.inStock && (
                            <span className="text-xs text-red-500 font-medium">Out of stock</span>
                          )}
                          <motion.button 
                            whileHover={{ scale: 1.05, color: "#ef4444" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeItem(item.id)} 
                            className="text-sm text-red-500 hover:text-red-700 mt-1 transition-colors duration-200"
                          >
                            Remove
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="w-full md:w-1/5 text-center mb-4 md:mb-0">
                        <span className="md:hidden text-gray-500 dark:text-gray-400 mr-2">Price:</span>
                        <span className="font-medium text-gray-800 dark:text-white">{item.price.toFixed(2)} EGP</span> {/* Updated to EGP */}
                      </div>
                      
                      {/* Quantity */}
                      <div className="w-full md:w-1/5 flex justify-center mb-4 md:mb-0">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <motion.button 
                            whileHover={{ backgroundColor: "#e5e7eb" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            -
                          </motion.button>
                          <motion.span 
                            key={item.quantity}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="px-4 py-1 text-center w-10"
                          >
                            {item.quantity}
                          </motion.span>
                          <motion.button 
                            whileHover={{ backgroundColor: "#e5e7eb" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            +
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="w-full md:w-1/5 text-center">
                        <span className="md:hidden text-gray-500 dark:text-gray-400 mr-2">Total:</span>
                        <motion.span 
                          key={item.quantity * item.price}
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="font-medium text-gray-800 dark:text-white"
                        >
                          {(item.price * item.quantity).toFixed(2)} EGP {/* Updated to EGP */}
                        </motion.span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 flex flex-col sm:flex-row justify-between items-center">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearCart}
                  className="w-full sm:w-auto mb-4 sm:mb-0 px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear Cart
                </motion.button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/" 
                    className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full hover:shadow-lg transition-all duration-300"
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {/* Order Summary */}
          <motion.div 
            variants={itemVariants}
            className="lg:w-1/3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden sticky top-24 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-between"
                  >
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <motion.span 
                      key={subtotal}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="font-medium text-gray-800 dark:text-white"
                    >
                      {subtotal.toFixed(2)} EGP {/* Updated to EGP */}
                    </motion.span>
                  </motion.div>
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-between"
                  >
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-medium text-gray-800 dark:text-white">300.00 EGP</span> {/* Updated to EGP */}
                  </motion.div>
                  {discount > 0 && (
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex justify-between text-green-600"
                    >
                      <span>Discount</span>
                      <motion.span
                        key={discount}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                      >
                        -{discount.toFixed(2)} EGP {/* Updated to EGP */}
                      </motion.span>
                    </motion.div>
                  )}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="border-t pt-4 mt-4"
                  >
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-800 dark:text-white">Total</span>
                      <motion.span 
                        key={total}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="font-bold text-xl text-gray-800 dark:text-white"
                      >
                        {total.toFixed(2)} EGP {/* Updated to EGP */}
                      </motion.span>
                    </div>
                  </motion.div>
                </div>
                
                {/* Promo Code */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <label htmlFor="promo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Promo Code</label>
                  <div className="flex">
                    <motion.input
                      whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                      type="text"
                      id="promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={applyPromoCode}
                      disabled={isLoading || !promoCode}
                      className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? "Applying..." : "Apply"}
                    </motion.button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try "DISCOUNT20" for 20% off</p>
                </motion.div>
                
                {/* Checkout Button */}
                <motion.button 
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300"
                >
                  Proceed to Checkout
                </motion.button>
                
                {/* Payment Methods */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 text-center">We Accept</p>
                  <div className="flex justify-center space-x-2">
                    <motion.div 
                      whileHover={{ y: -3 }}
                      className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"
                    ></motion.div>
                    <motion.div 
                      whileHover={{ y: -3 }}
                      transition={{ delay: 0.05 }}
                      className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"
                    ></motion.div>
                    <motion.div 
                      whileHover={{ y: -3 }}
                      transition={{ delay: 0.1 }}
                      className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"
                    ></motion.div>
                    <motion.div 
                      whileHover={{ y: -3 }}
                      transition={{ delay: 0.15 }}
                      className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"
                    ></motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Cart;
