import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import { usercontext } from "../Components/Context/UserContext/UserContext";
import axios from "axios";

export default function Stores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState([]);
  const { token } = useContext(usercontext);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stores, setStores] = useState([]);

  async function fetchStores() {
    setIsLoading(true);
    setError(null);
    try {
      const options = {
        url: "http://localhost/eMall/stores/getAllStores.php",
        method: "GET",
        headers: { 
           'Authorization': token
        },
      };
      const response = await axios.request(options);
      const fetchedStores = response.data?.data || [];
      
      if (fetchedStores.length === 0) {
        throw new Error("No stores returned from API");
      }
      
      const formattedStores = fetchedStores.map(store => ({
        id: store.store_id,
        name: store.store_name,
        description: store.description || "Store description not available",
        image: store.image || "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3",
        logo: store.store_logo || "https://via.placeholder.com/150",
        path: `/stores/${store.store_id}`
      }));
      
      setStores(formattedStores);
      setFilteredStores(formattedStores);
      console.log("Stores loaded:", formattedStores);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching stores:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStores();
  }, []);

  // Enhanced search with debouncing and better filtering
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!stores.length) return;
      
      const results = stores.filter(store => {
        const searchLower = searchTerm.toLowerCase().trim();
        const nameLower = store.name.toLowerCase();
        const descLower = store.description.toLowerCase();
        
        // Exact matches get priority
        if (nameLower === searchLower || descLower === searchLower) {
          return true;
        }
        
        // Then check for word matches
        const searchWords = searchLower.split(' ');
        return searchWords.every(word => 
          nameLower.includes(word) || descLower.includes(word)
        );
      });
      
      setFilteredStores(results);
    }, 300); // 300ms delay for debouncing

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, stores]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      y: 50,
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-14 flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stores...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            onClick={fetchStores} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-14">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-8 text-gray-800"
        >
          Featured Stores
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 max-w-2xl mx-auto"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search stores by name or description..."
              className="w-full p-4 pl-12 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="fas fa-search"></i>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          {filteredStores.length === 0 && searchTerm && (
            <p className="text-center text-gray-500 mt-4">No stores found matching your search</p>
          )}
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredStores.map((store, index) => (
            <motion.div 
              key={store.id} 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={index}
            >
              <Link to={store.path} className="block"
              state={{storeData: store}}>
                <motion.div 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative h-64">
                    <motion.img 
                      src={store.image}
                      alt={`${store.name} Store`}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div 
                      className="absolute top-2 left-2 p-2 bg-white rounded-full"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img 
                        src={store.logo}
                        alt={`${store.name} Logo`}
                        className="w-16 h-16 rounded-full object-contain"
                      />
                    </motion.div>
                  </div>
                  <motion.div 
                    className="p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{store.name}</h3>
                    <p className="text-gray-600 line-clamp-2">{store.description}</p>
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredStores.length === 0 && !searchTerm && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <p className="text-gray-500 text-xl">No stores available at the moment.</p>
            <button 
              onClick={fetchStores} 
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              Refresh
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
}