import React, { useState } from 'react';
import { motion } from 'framer-motion';

function Checkout() {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
  });
  
  const [cartItems] = useState([
    { id: 1, name: 'Premium Cotton T-Shirt', price: 39.99, quantity: 2, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800' },
    { id: 2, name: 'Designer Backpack', price: 79.99, quantity: 1, image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
  ]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleNextStep = () => {
    setActiveStep(activeStep + 1);
  };
  
  const handlePrevStep = () => {
    setActiveStep(activeStep - 1);
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const shipping = 5.99;
  const tax = calculateSubtotal() * 0.08;
  const total = calculateSubtotal() + shipping + tax;

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>
          
          {/* Checkout Steps */}
          <div className="flex justify-between mb-8">
            {['Cart', 'Shipping', 'Payment', 'Confirmation'].map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep > index ? 'bg-green-500 text-white' : activeStep === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {activeStep > index ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`mt-2 text-sm ${activeStep === index + 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>{step}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
                          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                          <div className="ml-4 flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNextStep}
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
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your address"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your city"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrevStep}
                        className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Back to Cart
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNextStep}
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
                        <div className="border border-gray-300 rounded-lg p-3 flex items-center flex-1 cursor-pointer">
                          <input type="radio" name="paymentMethod" id="creditCard" className="mr-2" />
                          <label htmlFor="creditCard" className="flex items-center cursor-pointer">
                            <span className="text-blue-600 mr-2"><i className="fas fa-credit-card"></i></span>
                            Credit Card
                          </label>
                        </div>
                        <div className="border border-gray-300 rounded-lg p-3 flex items-center flex-1 cursor-pointer bg-blue-50 border-blue-500">
                          <input type="radio" name="paymentMethod" id="cash" className="mr-2" checked readOnly />
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
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrevStep}
                        className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Back to Shipping
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNextStep}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Complete Order
                      </motion.button>
                    </div>
                  </motion.div>
                )}
                
                {activeStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
                    <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
                    <p className="text-gray-600 mb-2">Order Number: <span className="font-medium">ORD-{Math.floor(Math.random() * 10000)}</span></p>
                    <p className="text-gray-600">Your order will be delivered to <span className="font-medium">{formData.address}, {formData.city}</span></p>
                    
                    <div className="mt-8">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Continue Shopping
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
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold text-blue-600">${total.toFixed(2)}</span>
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
                    <p className="text-sm text-blue-700">Pay with cash when your order is delivered to your doorstep.</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-center">
                    <img src="https://cdn-icons-png.flaticon.com/128/2489/2489756.png" alt="Cash on Delivery" className="h-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
