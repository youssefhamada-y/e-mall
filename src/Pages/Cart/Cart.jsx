import React, { useContext, useEffect, useState } from "react";
import { cartcontext } from "../Components/Context/CartContext/CartContext";
import { usercontext } from "../Components/Context/UserContext/UserContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function Cart() {
  const { cartinfo, getCartInfo, updateCart, deleteFromCart, clearCart } = useContext(cartcontext);
  const { token } = useContext(usercontext);

  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    async function fetchCart() {
      setIsLoading(true);
      await getCartInfo();
      setIsLoading(false);
    }
    if (token) fetchCart();
    // eslint-disable-next-line
  }, [token]);

  const cartItems = cartinfo?.cart_items || [];
  
  // Calculate subtotal based on the sum of all items
  const subtotal = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0);
  
  const shipping = cartItems.length > 0 ? 60 : 0; // Shipping is now 60 EGP
  
  // Calculate discount if promo applied and subtotal > 1000 EGP
  const discount = promoApplied && subtotal > 1000 ? subtotal * 0.2 : 0;
  const total = subtotal + shipping - discount;
  
  // Check if order exceeds 1000 EGP
  const showPromoSection = subtotal > 1000;

  const handleQuantityChange = async (cartid, quantity) => {
    if (quantity < 1) return;
    setIsLoading(true);
    await updateCart({ cartid, quantity });
    setIsLoading(false);
  };

  const handleRemoveItem = async (cartid) => {
    setIsLoading(true);
    await deleteFromCart(cartid);
    setShowConfirmation(false);
    setItemToDelete(null);
    setIsLoading(false);
  };

  const handleClearCart = async () => {
    setIsLoading(true);
    await clearCart();
    setPromoApplied(false);
    setPromoCode("");
    setIsLoading(false);
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "sale20") {
      setPromoApplied(true);
      setPromoError("");
      toast.success("Promo code applied successfully!");
    } else {
      setPromoError("Invalid promo code");
      setPromoApplied(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <motion.div 
          className="h-20 w-20 mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <div className="h-full w-full rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        </motion.div>
        <p className="text-gray-700 text-xl font-medium">Loading your cart...</p>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="container mx-auto px-4 py-32 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-auto border border-blue-100"
        >
          <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <i className="fas fa-shopping-cart text-5xl text-blue-500"></i>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Your Shopping Cart</h1>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your cart is empty</h2>
          <p className="text-gray-600 mb-10 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Discover amazing products in our stores!
          </p>
          <Link to="/stores" className="inline-block bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium py-4 px-10 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-32 max-w-7xl"
    >
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-12 text-gray-800 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
        Your Shopping Cart
      </h1>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-auto shadow-2xl border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Confirm Removal</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Are you sure you want to remove this item from your cart?</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowConfirmation(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleRemoveItem(itemToDelete)}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Remove
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-100">
            <div className="p-8">
              <div className="hidden md:flex justify-between border-b pb-4 mb-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                <div className="w-2/5">Product</div>
                <div className="w-1/5 text-center">Price</div>
                <div className="w-1/5 text-center">Quantity</div>
                <div className="w-1/5 text-center">Total</div>
              </div>
              {cartItems.map((item) => (
                <motion.div 
                  key={item.cart_id} 
                  className="flex flex-col md:flex-row items-center py-6 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                >
                  {/* Product Info */}
                  <div className="w-full md:w-2/5 flex items-center mb-4 md:mb-0">
                    <div className="h-24 w-24 rounded-xl overflow-hidden mr-5 border border-gray-200 shadow-sm">
                      <img src={item.images[0] || "https://placehold.co/80x80"} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white text-lg">{item.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{item.category}</p>
                    </div>
                  </div>
                  {/* Price */}
                  <div className="w-full md:w-1/5 text-center mb-2 md:mb-0">
                    <span className="text-lg font-bold text-blue-600">{parseFloat(item.price).toFixed(2)} EGP</span>
                  </div>
                  {/* Quantity */}
                  <div className="w-full md:w-1/5 flex justify-center items-center mb-2 md:mb-0">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <i className="fas fa-minus text-gray-600"></i>
                      </button>
                      <span className="px-4 py-2 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <i className="fas fa-plus text-gray-600"></i>
                      </button>
                    </div>
                  </div>
                  {/* Total */}
                  <div className="w-full md:w-1/5 text-center">
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">{(item.price * item.quantity).toFixed(2)} EGP</span>
                  </div>
                  {/* Remove */}
                  <div className="w-full md:w-auto flex justify-center mt-4 md:mt-0">
                    <button
                      onClick={() => { setItemToDelete(item.cart_id); setShowConfirmation(true); }}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.button
            onClick={handleClearCart}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className="fas fa-trash-alt mr-2"></i> Clear Cart
          </motion.button>
        </div>
        {/* Cart Summary */}
        <div className="lg:w-1/3">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white pb-2 border-b border-gray-100">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{subtotal.toFixed(2)} EGP</span>
              </div>
              
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{shipping.toFixed(2)} EGP</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-lg text-green-600">
                  <span>Discount (20%)</span>
                  <span className="font-medium">-{discount.toFixed(2)} EGP</span>
                </div>
              )}
            </div>
            
            {/* Promo Code Section */}
            {showPromoSection && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 pt-4 border-t border-dashed border-gray-200"
              >
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-blue-800 text-sm font-medium">
                    <i className="fas fa-tag mr-2"></i>
                    Your order qualifies for a special discount! Use code <span className="font-bold">SALE20</span> for 20% off.
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className={`flex-1 px-4 py-3 border ${promoError ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-red-500 text-sm mt-2">{promoError}</p>}
                {promoApplied && <p className="text-green-600 text-sm mt-2">Promo code applied successfully!</p>}
              </motion.div>
            )}
            
            <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
              <span className="text-xl font-bold text-gray-800 dark:text-white">Total</span>
              <motion.span 
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
                key={total} // This forces animation to run when total changes
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                {total.toFixed(2)} EGP
              </motion.span>
            </div>
            
            <Link to="/checkout">
              <motion.button 
                className="mt-8 w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-center py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fas fa-credit-card mr-2"></i> Proceed to Checkout
              </motion.button>
            </Link>
            
            {/* Add this inside the Cart Summary section, after the "Continue Shopping" button */}
            <Link to="/orders">
              <motion.button 
                className="mt-4 w-full bg-white border border-gray-300 text-gray-700 text-center py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fas fa-clipboard-list mr-2"></i> View Order History
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Cart;