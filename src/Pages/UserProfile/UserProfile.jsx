import { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { usercontext } from "../Components/Context/UserContext/UserContext";
import Swal from "sweetalert2";
function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userAvatar, setUserAvatar] = useState(null);
  const {token}=useContext(usercontext)
  const [showFullSizeImage, setShowFullSizeImage] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    phone: "",
    address: ""
  });
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });
  const fileInputRef = useRef(null);
  
  // Fetch user data from API
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost/eMall/user/getSpecifcUser.php', {
        headers: {
          'Authorization': token
        }
      });
      
      if (response.data.status === "success") {
        const user = response.data.user;
        setUserData(user);
        setEditFormData({
          phone: user.phone || "",
          address: user.address || ""
        });
        
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        console.error('Failed to fetch user data');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load user profile data',
          background: '#ffffff',
          iconColor: '#d33'
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Could not connect to the server. Please try again later.',
        background: '#ffffff',
        iconColor: '#d33'
      });
    }
  };
  
  // Load saved avatar from localStorage on component mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setUserAvatar(savedAvatar);
    }
    
    // Fetch user data from API
    fetchUserData();
    
    // Fallback to localStorage if API fails
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData(user);
      setEditFormData({
        phone: user.phone || "",
        address: user.address || ""
      });
    }
  }, [token]);
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost/eMall/user/editUser.php', 
        editFormData,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.status === "success") {
        // Update local user data
        const updatedUserData = {
          ...userData,
          phone: editFormData.phone,
          address: editFormData.address
        };
        
        // Update state and localStorage
        setUserData(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        setIsEditing(false);
        
        // Using SweetAlert2 for beautiful alerts instead of toast
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Profile updated successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#ffffff',
          iconColor: '#4CAF50',
          customClass: {
            popup: 'animated fadeInDown',
            title: 'text-green-600',
            content: 'text-gray-700'
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Failed to update profile: ' + response.data.message,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Try Again',
          background: '#ffffff',
          iconColor: '#d33',
          customClass: {
            popup: 'animated fadeInDown'
          }
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while updating your profile. Please try again.',
        footer: '<span class="text-gray-500">Check your connection and try again</span>',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Dismiss',
        background: '#ffffff',
        iconColor: '#d33',
        customClass: {
          popup: 'animated fadeInDown'
        }
      });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordData.new_password !== passwordData.confirm_password) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'New password and confirmation do not match',
        confirmButtonColor: '#3085d6',
        background: '#ffffff',
        iconColor: '#d33'
      });
      return;
    }
    
    try {
      const response = await axios.post('http://localhost/eMall/user/changePassword.php', 
        passwordData,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.status === "success") {
        // Reset form
        setPasswordData({
          old_password: "",
          new_password: "",
          confirm_password: ""
        });
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Password updated successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#ffffff',
          iconColor: '#4CAF50',
          customClass: {
            popup: 'animated fadeInDown',
            title: 'text-green-600',
            content: 'text-gray-700'
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: response.data.message || 'Failed to update password',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Try Again',
          background: '#ffffff',
          iconColor: '#d33'
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while updating your password. Please try again.',
        footer: '<span class="text-gray-500">Check your connection and try again</span>',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Dismiss',
        background: '#ffffff',
        iconColor: '#d33'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Rest of the handlers remain the same
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
        {/* Avatar section remains the same */}
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
          {!isEditing ? (
            <>
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
                    <p className="font-medium text-gray-800 dark:text-white">{new Date(userData.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                <input
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
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

  // Rest of the component remains the same
  const renderOrderHistory = () => (
    <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Order History</h2>
      <p className="text-gray-500 dark:text-gray-400">Your order history will appear here.</p>
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
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
            <div className="relative">
              <input
                type={passwordData.showOldPassword ? "text" : "password"}
                name="old_password"
                value={passwordData.old_password}
                onChange={handlePasswordInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setPasswordData({...passwordData, showOldPassword: !passwordData.showOldPassword})}
              >
                <i className={`fas ${passwordData.showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <div className="relative">
              <input
                type={passwordData.showNewPassword ? "text" : "password"}
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setPasswordData({...passwordData, showNewPassword: !passwordData.showNewPassword})}
              >
                <i className={`fas ${passwordData.showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <div className="relative">
              <input
                type={passwordData.showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setPasswordData({...passwordData, showConfirmPassword: !passwordData.showConfirmPassword})}
              >
                <i className={`fas ${passwordData.showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Notification Preferences</h3>
        <p className="text-gray-500 dark:text-gray-400">Notification settings will appear here.</p>
      </div>
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
          <Link to="/orders" >
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

          </Link>
         
          <Link to="/wishlist">
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
          </Link>
         
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
