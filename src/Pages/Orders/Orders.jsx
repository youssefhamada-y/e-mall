import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    // Fetch orders from API
    const fetchOrders = async () => {
      try {
        // Mock data for now - would be replaced with actual API call
        const mockOrders = [
          {
            id: 'ORD-1234',
            date: '2023-05-15',
            total: 129.99,
            status: 'delivered',
            items: [
              { id: 1, name: 'Slim Fit Blazer', price: 89.99, quantity: 1 },
              { id: 2, name: 'Striped T-Shirt', price: 19.99, quantity: 2 }
            ]
          },
          {
            id: 'ORD-5678',
            date: '2023-06-02',
            total: 45.99,
            status: 'processing',
            items: [
              { id: 4, name: 'High Waist Jeans', price: 45.99, quantity: 1 }
            ]
          },
          {
            id: 'ORD-9012',
            date: '2023-06-10',
            total: 49.99,
            status: 'shipped',
            items: [
              { id: 2, name: 'Floral Print Dress', price: 49.99, quantity: 1 }
            ]
          }
        ]
        
        setOrders(mockOrders)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to load orders')
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab)

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

  // Status color mapping
  const statusColors = {
    delivered: {
      bg: "bg-gradient-to-r from-green-400 to-green-500",
      text: "text-white"
    },
    shipped: {
      bg: "bg-gradient-to-r from-blue-400 to-blue-500",
      text: "text-white"
    },
    processing: {
      bg: "bg-gradient-to-r from-yellow-300 to-yellow-400",
      text: "text-gray-800"
    }
  }

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
      
      {/* Order status tabs */}
      <motion.div 
        className="flex mb-6 border-b"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.button 
          className="px-4 py-2"
          variants={tabVariants}
          animate={activeTab === 'all' ? 'active' : 'inactive'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('all')}
        >
          All Orders
        </motion.button>
        <motion.button 
          className="px-4 py-2"
          variants={tabVariants}
          animate={activeTab === 'processing' ? 'active' : 'inactive'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('processing')}
        >
          Processing
        </motion.button>
        <motion.button 
          className="px-4 py-2"
          variants={tabVariants}
          animate={activeTab === 'shipped' ? 'active' : 'inactive'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('shipped')}
        >
          Shipped
        </motion.button>
        <motion.button 
          className="px-4 py-2"
          variants={tabVariants}
          animate={activeTab === 'delivered' ? 'active' : 'inactive'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div 
            className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : filteredOrders.length === 0 ? (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl text-gray-500">No orders found</p>
          <motion.button 
            className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredOrders.map(order => (
            <motion.div 
              key={order.id} 
              className="border rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-gray-800">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">Placed on {order.date}</p>
                </div>
                <div>
                  <span className={`px-4 py-1 rounded-full text-sm ${
                    statusColors[order.status].bg
                  } ${statusColors[order.status].text}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                {order.items.map(item => (
                  <motion.div 
                    key={item.id} 
                    className="flex justify-between py-2"
                    whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                  >
                    <div>
                      <p className="text-gray-700">{item.name} × {item.quantity}</p>
                    </div>
                    <p className="text-gray-700">${item.price.toFixed(2)}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="border-t mt-4 pt-4 flex justify-between">
                <p className="font-bold text-gray-800">Total</p>
                <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                  ${order.total.toFixed(2)}
                </p>
              </div>
              
              <div className="mt-4 flex space-x-4">
                <motion.button 
                  className="px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details
                </motion.button>
                {order.status === 'delivered' && (
                  <motion.button 
                    className="px-4 py-2 border border-purple-500 text-purple-500 rounded-full hover:bg-purple-50"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Write a Review
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default Orders
