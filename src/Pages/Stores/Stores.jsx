import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Stores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState([]);

  const stores = [
    {
      name: "Zara",
      description: "Contemporary fashion and trending styles for everyone",
      image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/1200px-Zara_Logo.svg.png",
      path: "/stores/zara"
    },
    {
      name: "H&M", 
      description: "Affordable fashion for the whole family",
      image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1200px-H%26M-Logo.svg.png",
      path: "/stores/hm"
    },
    {
      name: "Uniqlo",
      description: "Simple made better with quality basics",
      image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UNIQLO_logo.svg/1200px-UNIQLO_logo.svg.png",
      path: "/stores/uniqlo"
    },
    {
      name: "Nike",
      description: "Premium sportswear and athletic gear",
      image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3",
      logo: "https://media.about.nike.com/img/cf68f541-fc92-4373-91cb-086ae0fe2f88/001-nike-logos-swoosh-black.jpg?m=eyJlZGl0cyI6eyJqcGVnIjp7InF1YWxpdHkiOjEwMH0sIndlYnAiOnsicXVhbGl0eSI6MTAwfSwiZXh0cmFjdCI6eyJsZWZ0IjowLCJ0b3AiOjAsIndpZHRoIjo1MDAwLCJoZWlnaHQiOjI4MTN9LCJyZXNpemUiOnsid2lkdGgiOjE5MjB9fX0%3D&s=4617fc4ca48a0336d90d25001a63e65147c95885bad727aa1b5473cf672dc459", 
      path: "/stores/nike"
    },
    {
      name: "Adidas",
      description: "Iconic sportswear and street style",
      image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png",
      path: "/stores/adidas"
    },
    {
      name: "Pull&Bear",
      description: "Young and casual street fashion",
      image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3",
      logo: "https://www.logo.wine/a/logo/Pull%26Bear/Pull%26Bear-Logo.wine.svg",
      path: "/stores/pullbear"
    }
  ];

  // Enhanced search with debouncing and better filtering
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
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
  }, [searchTerm]);

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
              key={store.name} 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={index}
            >
              <Link to={store.path} className="block">
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
                      className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img 
                        src={store.logo}
                        alt={`${store.name} Logo`}
                        className="w-10 h-10 object-contain"
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
                    <p className="text-gray-600">{store.description}</p>
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
