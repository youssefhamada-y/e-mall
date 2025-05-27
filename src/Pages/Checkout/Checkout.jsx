import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { cartcontext } from '../Components/Context/CartContext/CartContext';
import { usercontext } from '../Components/Context/UserContext/UserContext';

function Checkout() {
  const { cartinfo, clearCart } = useContext(cartcontext);
  const { token, } = useContext(usercontext);
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(1);
  const [orderResponse, setOrderResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  
  // Get cart items from context instead of hardcoded data
  const cartItems = cartinfo?.cart_items || [];
  
  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && activeStep === 1) {
      toast.error("Your cart is empty");
      navigate('/cart');
    }
  }, [cartItems, navigate, activeStep]);

  // Check authentication on component mount
  useEffect(() => {
    if (!token) {
      setAuthError(true);
      toast.error("You need to be logged in to place an order");
      // Allow user to stay on page and see error message instead of immediately redirecting
    }
  }, [token]);
  
  // Validation schema for shipping information
  const shippingValidationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required')
  });

  const handlePlaceOrder = async (values) => {
    // Check token before attempting API call
    // if (!token) {
    //   toast.error("You need to be logged in to place an order");
    //   setAuthError(true);
    //   // Save the form data in sessionStorage so user doesn't lose it after login
    //   sessionStorage.setItem('checkout_form', JSON.stringify(values));
    //   navigate('/login?redirect=checkout');
    //   return;
    // }

    try {
      setIsLoading(true);
      
      // Add authorization header with token and use proper API URL
      const response = await axios.post(
        'http://localhost/eMall/order/placeOrder.php', 
        {
          fullName: values.fullName,
          city: values.city,
          address: values.address
        },
        {
          headers: {
            'Authorization':  token,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data && response.data.message === "Order placed successfully") {
        setOrderResponse(response.data);
        setActiveStep(4); // Move to confirmation step
        
        // Clear cart after successful order
        await clearCart();
        toast.success("Order placed successfully!");
      } else {
        // Handle API error response
        const errorMessage = response.data?.message || "Failed to place order";
        toast.error(errorMessage);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error("An error occurred while placing your order");
      setIsLoading(false);
    }
  };
  
  const handleNextStep = (values) => {
    // Check authentication first
    if (!token) {
      toast.error("You need to be logged in to proceed");
      sessionStorage.setItem('checkout_form', JSON.stringify(values));
      navigate('/login?redirect=checkout');
      return;
    }
    
    if (activeStep === 3) {
      handlePlaceOrder(values);
    } else {
      setActiveStep(activeStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    setActiveStep(activeStep - 1);
  };
  
  // Calculate subtotal based on the sum of all items
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };
  
  const shipping = cartItems.length > 0 ? 60 : 0; // Match shipping cost with Cart page (60 EGP)
  const tax = 0; // Remove tax calculation to match Cart page
  const total = calculateSubtotal() + shipping;
  
  // Render authentication error
  if (authError && !token) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-8 bg-white rounded-xl shadow-md p-8"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
              <p className="text-gray-600 mb-6">You need to be logged in to checkout. Please log in to continue.</p>
              
              <div className="mt-8 flex justify-center space-x-4">
                <Link to="/login?redirect=checkout">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i> Log In
                  </motion.button>
                </Link>
                <Link to="/cart">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-shopping-cart mr-2"></i> Return to Cart
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render confirmation step separately if order is complete
  if (activeStep === 4 && orderResponse) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-8 bg-white rounded-xl shadow-md p-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
              <p className="text-gray-600 mb-6">{orderResponse.message}</p>
              <p className="text-gray-600 mb-2">Order Number: <span className="font-medium">#{orderResponse.order_id}</span></p>
              <p className="text-gray-600">Total Price: <span className="font-medium">{orderResponse.total_price} EGP</span></p>
              
              <div className="mt-8 flex justify-center space-x-4">
                <Link to="/orders">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                  >
                    <i className="fas fa-clipboard-list mr-2"></i> View My Orders
                  </motion.button>
                </Link>
                <Link to="/stores">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-shopping-bag mr-2"></i> Continue Shopping
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-10 mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Progress bar */}
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    1
                  </div>
                  <div className="ml-2 text-sm font-medium">Cart</div>
                </div>
                <div className={`flex-1 h-1 mx-4 ${activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    2
                  </div>
                  <div className="ml-2 text-sm font-medium">Shipping</div>
                </div>
                <div className={`flex-1 h-1 mx-4 ${activeStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    3
                  </div>
                  <div className="ml-2 text-sm font-medium">Payment</div>
                </div>
              </div>
            </div>
            
            <Formik
              initialValues={{
                fullName: '',
                address: '',
                city: ''
              }}
              validationSchema={shippingValidationSchema}
              onSubmit={(values) => {
                if (activeStep === 3) {
                  handlePlaceOrder(values);
                } else {
                  handleNextStep(values);
                }
              }}
            >
              {({ values, isValid, dirty }) => (
                <Form>
                  <div className="md:flex">
                    {/* Left Column - Form */}
                    <div className="md:w-2/3 p-6 md:p-8 border-r border-gray-200">
                      {activeStep === 1 && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h2 className="text-xl font-semibold mb-4">Review Your Cart</h2>
                          <div className="space-y-4">
                            {cartItems.map(item => (
                              <div key={item.id} className="flex items-center border-b border-gray-200 pb-4">
                                <img src={item.images?.[0] || '/placeholder-image.jpg'} alt={item.name} 
                                    className="w-20 h-20 object-cover rounded-md"
                                    onError={(e) => { e.target.src = '/placeholder-image.jpg'; }} />
                                <div className="ml-4 flex-1">
                                  <h3 className="font-medium">{item.name}</h3>
                                  <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{(item.price * item.quantity).toFixed(2)} EGP</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 flex justify-end">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setActiveStep(2)}
                              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Continue to Shipping
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                      
                      {activeStep === 2 && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                              <Field
                                type="text"
                                name="fullName"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your full name"
                              />
                              <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-2">Address</label>
                              <Field
                                type="text"
                                name="address"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your address"
                              />
                              <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-2">City</label>
                              <Field
                                type="text"
                                name="city"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your city"
                              />
                              <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                          </div>
                          <div className="mt-6 flex justify-between">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handlePrevStep}
                              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Back to Cart
                            </motion.button>
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                if (isValid && dirty) {
                                  setActiveStep(3);
                                } else {
                                  toast.error("Please fill in all shipping information");
                                }
                              }}
                              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Continue to Payment
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                      
                      {activeStep === 3 && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                          <div className="mb-6">
                            <div className="flex items-center space-x-4 mb-4">
                              <div 
                                className="border rounded-lg p-3 flex items-center flex-1 cursor-pointer bg-blue-50 border-blue-500"
                              >
                                <input 
                                  type="radio" 
                                  name="paymentMethod" 
                                  id="cash" 
                                  className="mr-2" 
                                  checked={true} 
                                  readOnly
                                />
                                <label htmlFor="cash" className="flex items-center cursor-pointer">
                                  <span className="text-green-600 mr-2"><i className="fas fa-money-bill"></i></span>
                                  Cash on Delivery
                                </label>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <p className="text-gray-700">You will pay when your order is delivered. Please have the exact amount ready.</p>
                            </div>
                          </div>
                          <div className="mt-6 flex justify-between">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handlePrevStep}
                              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Back to Shipping
                            </motion.button>
                            <motion.button
                              type="submit"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              disabled={isLoading}
                            >
                              {isLoading ? 'Processing...' : 'Complete Order'}
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Right Column - Order Summary */}
                    <div className="md:w-1/3 bg-gray-50 p-6 md:p-8">
                      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                      <div className="space-y-3 mb-6">
                        {cartItems.map(item => (
                          <div key={item.id} className="flex justify-between">
                            <span className="text-gray-600">{item.name} × {item.quantity}</span>
                            <span className="font-medium">{(item.price * item.quantity).toFixed(2)} EGP</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 pt-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">{calculateSubtotal().toFixed(2)} EGP</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium">{shipping.toFixed(2)} EGP</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-medium">{tax.toFixed(2)} EGP</span>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 mt-4 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total</span>
                          <span className="text-xl font-bold text-blue-600">{total.toFixed(2)} EGP</span>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Cash on Delivery
                          </h3>
                          <p className="text-sm text-blue-700">
                            Pay with cash when your order is delivered to your doorstep.
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex items-center justify-center">
                          <img src="https://cdn-icons-png.flaticon.com/128/2489/2489756.png" alt="Cash on Delivery" className="h-12" 
                              onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;