import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userAvatar, setUserAvatar] = useState(null);
  const [showFullSizeImage, setShowFullSizeImage] = useState(false);
  const fileInputRef = useRef(null);

  // Load saved avatar from localStorage on component mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setUserAvatar(savedAvatar);
    }
  }, []);

  // Mock user data for design
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "0123456789",
    address: "123 Main St, New York, NY 10001"
  };

  // Mock orders data for design
  const userOrders = [
    {
      id: "ORD-12345",
      date: "2023-05-15",
      status: "Delivered",
      total: 129.99,
      items: [
        { id: 1, name: "Wireless Headphones", price: 79.99, quantity: 1 },
        { id: 2, name: "Phone Case", price: 25.00, quantity: 2 }
      ]
    },
    {
      id: "ORD-12346",
      date: "2023-06-20",
      status: "Processing",
      total: 349.99,
      items: [
        { id: 3, name: "Smart Watch", price: 349.99, quantity: 1 }
      ]
    },
    {
      id: "ORD-12347",
      date: "2023-07-05",
      status: "Shipped",
      total: 89.97,
      items: [
        { id: 4, name: "T-Shirt", price: 29.99, quantity: 3 }
      ]
    }
  ];

  const handleViewImage = () => {
    if (userAvatar) {
      setShowFullSizeImage(true);
    }
  };

  const handleChangeImage = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatarUrl = e.target.result;
        setUserAvatar(newAvatarUrl);
        // Save to localStorage to persist after logout
        localStorage.setItem('userAvatar', newAvatarUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const closeFullSizeImage = () => {
    setShowFullSizeImage(false);
  };

  const renderProfile = () => (
    <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 hover:border-blue-500 transition-colors">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt="Profile" 
                className="w-full h-full object-cover cursor-pointer"
                onClick={handleViewImage}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="mt-2 flex justify-center space-x-2">
            {userAvatar && (
              <button 
                onClick={handleViewImage}
                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
              >
                View
              </button>
            )}
            <button 
              onClick={handleChangeImage}
              className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
            >
              {userAvatar ? "Change" : "Upload"}
            </button>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{userData.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-800 dark:text-white">{userData.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium text-gray-800 dark:text-white">{userData.phone}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                <p className="font-medium text-gray-800 dark:text-white">{userData.address || "No address provided"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="font-medium text-gray-800 dark:text-white">May 2023</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Edit Profile
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Full size image modal */}
      {showFullSizeImage && userAvatar && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeFullSizeImage}>
          <div className="relative max-w-4xl max-h-screen p-4">
            <button 
              className="absolute top-2 right-2 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200"
              onClick={closeFullSizeImage}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={userAvatar} 
              alt="Profile" 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderOrderHistory = () => (
    <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Order History</h2>
      
      {userOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">You haven't placed any orders yet.</p>
          <Link to="/categories" className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex flex-wrap justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{order.id}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ordered on {order.date}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Items</h4>
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-gray-300">Total</span>
                <span className="font-bold text-lg text-gray-800 dark:text-white">${order.total.toFixed(2)}</span>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Link to={`/orders/${order.id}`} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Wishlist</h2>
      <p className="text-gray-500 dark:text-gray-400">Your wishlist items will appear here.</p>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Account Settings</h2>
      <p className="text-gray-500 dark:text-gray-400">Account settings will appear here.</p>
    </div>
  );

  if (activeTab === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Account</h1>
      
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "profile"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "orders"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Order History
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "wishlist"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Wishlist
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "settings"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Settings
          </button>
        </div>
      </div>
      
      <div className="mb-8">
        {activeTab === "profile" && renderProfile()}
        {activeTab === "orders" && renderOrderHistory()}
        {activeTab === "wishlist" && renderWishlist()}
        {activeTab === "settings" && renderSettings()}
      </div>
    </div>
  );
}

export default UserProfile;
