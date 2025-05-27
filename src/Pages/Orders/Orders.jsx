import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { cartcontext } from "../Components/Context/CartContext/CartContext";
import { usercontext } from '../Components/Context/UserContext/UserContext';

function Orders() {
  const { updateCart } = useContext(cartcontext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const { token } = useContext(usercontext)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost/eMall/order/getAllOrders.php', {
          method: 'GET',
          headers: {
            'Authorization': token
          }
        })
        
        const data = await response.json()
        if (data.status === 'success') {
          setOrders(data.orders)
        } else {
          toast.error('Failed to load orders')
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to load orders')
        setLoading(false)
      }
    }

    fetchOrders()
  }, [token])

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab)

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
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  }

  const tabVariants = {
    inactive: { borderBottom: "2px solid transparent" },
    active: { borderBottom: "2px solid #3B82F6", color: "#3B82F6" }
  }

  const statusColors = {
    pending: {
      bg: "bg-gradient-to-r from-yellow-300 to-yellow-400",
      text: "text-gray-800"
    },
    processing: {
      bg: "bg-gradient-to-r from-blue-400 to-blue-500",
      text: "text-white"
    },
    shipped: {
      bg: "bg-gradient-to-r from-purple-400 to-purple-500",
      text: "text-white"
    },
    delivered: {
      bg: "bg-gradient-to-r from-green-400 to-green-500",
      text: "text-white"
    }
  }

  // Add function to handle reordering
  const handleReorder = async (order) => {
    try {
      setLoading(true);
      // Add all items from this order to cart
      for (const item of order.items) {
        await updateCart({ 
          productid: item.product_id, 
          quantity: item.quantity 
        });
      }
      toast.success("Items added to cart");
      navigate('/cart');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to add items to cart');
      setLoading(false);
    }
  };

  if (filteredOrders.length === 0 && !loading) {
    return (
      <div className="container mx-auto px-4 py-40 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <motion.h1 
          className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Orders
        </motion.h1>
        
        <motion.div 
          className="flex mb-6 border-b"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {['all', 'pending', 'processing', 'shipped', 'delivered'].map(tab => (
            <motion.button 
              key={tab}
              className="px-4 py-2"
              variants={tabVariants}
              animate={activeTab === tab ? 'active' : 'inactive'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center py-12 bg-white rounded-xl shadow-md max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <i className="fas fa-shopping-bag text-5xl text-blue-500"></i>
          </div>
          <p className="text-2xl font-semibold text-gray-700 mb-4">No orders found</p>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You haven't placed any orders yet. Start shopping to discover amazing products!
          </p>
          <Link to="/stores">
            <motion.button 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-shopping-bag mr-2"></i> Start Shopping
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-40 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Orders
      </motion.h1>
      
      <motion.div 
        className="flex justify-center mb-10 border-b"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {['all', 'pending', 'processing', 'shipped', 'delivered'].map(tab => (
          <motion.button 
            key={tab}
            className="px-6 py-3 text-lg"
            variants={tabVariants}
            animate={activeTab === tab ? 'active' : 'inactive'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div 
            className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : (
        <motion.div 
          className="space-y-10 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredOrders.map(order => (
            <motion.div 
              key={order.order_id} 
              className="border-0 rounded-xl p-8 shadow-lg bg-white"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.1)" }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-2xl text-gray-800">Order #{order.order_id}</h3>
                  <p className="text-md text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className={`px-6 py-2 rounded-full text-md font-medium ${
                    statusColors[order.status]?.bg || "bg-gray-200"
                  } ${statusColors[order.status]?.text || "text-gray-800"}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </motion.div>
              </div>
              
              <div className="border-t border-gray-100 pt-6">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <motion.div 
                      key={`${order.order_id}-${item.product_id}`} 
                      className="flex justify-between py-4 border-b border-gray-50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)", borderRadius: "12px" }}
                    >
                      <div className="flex items-center">
                        <motion.img 
                          src={item.product_images && item.product_images.length > 0 ? item.product_images[0] : ''} 
                          alt={item.product_name}
                          className="w-24 h-24 object-cover rounded-xl shadow-md mr-6"
                          whileHover={{ scale: 1.1 }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                          }}
                        />
                        <div>
                          <p className="text-xl font-medium text-gray-800">{item.product_name}</p>
                          <p className="text-md text-gray-500">Store: {item.store_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg text-gray-700">{parseFloat(item.price).toFixed(2)} EGP × {item.quantity}</p>
                        <p className="text-md font-bold text-indigo-600">Total: {(parseFloat(item.price) * item.quantity).toFixed(2)} EGP</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 py-4 text-center">No items available for this order</p>
                )}
              </div>
              
              <div className="mt-6 pt-6 flex justify-between items-center bg-gray-50 p-6 rounded-xl">
                <div>
                  <p className="text-md text-gray-500 mb-2">Shipping Address:</p>
                  <p className="text-lg font-medium text-gray-800">{order.full_name}</p>
                  <p className="text-md text-gray-700">{order.address}, {order.city}</p>
                </div>
                <motion.div 
                  className="text-right bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl shadow-sm"
                  whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(59, 130, 246, 0.2)" }}
                >
                  <p className="text-md text-gray-500 mb-1">Order Total:</p>
                  <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 text-2xl">
                    {parseFloat(order.total_price).toFixed(2)} EGP
                  </p>
                </motion.div>
              </div>
              
              {order.status === 'delivered' && (
                <div className="mt-6 flex justify-end">
                  <motion.button 
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-md"
                    whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(139, 92, 246, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fas fa-star mr-2"></i> Write a Review
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Add a button to go back to shopping */}
      <div className="mt-12 flex justify-center">
        <Link to="/cart">
          <motion.button
            className="mr-6 px-8 py-4 border-2 border-blue-500 text-blue-500 rounded-xl text-lg font-medium"
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(59, 130, 246, 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-shopping-cart mr-2"></i> View Cart
          </motion.button>
        </Link>
        <Link to="/stores">
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-md text-lg font-medium"
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(79, 70, 229, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-store mr-2"></i> Continue Shopping
          </motion.button>
        </Link>
      </div>
    </div>
  )
}

export default Orders
