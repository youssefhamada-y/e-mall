import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

function Compare() {
  // Mock data for product comparison - updated for clothing store
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      image: "https://via.placeholder.com/150",
      price: 39.99,
      rating: 4.5,
      availability: "In Stock",
      brand: "Urban Style",
      category: "T-Shirts",
      features: ["100% Organic Cotton", "Breathable Fabric", "Slim Fit", "Machine Washable"]
    },
    {
      id: 2,
      name: "Slim Fit Jeans",
      image: "https://via.placeholder.com/150",
      price: 59.99,
      rating: 4.2,
      availability: "In Stock",
      brand: "Denim Co.",
      category: "Jeans",
      features: ["Stretch Denim", "High Waist", "Tapered Leg", "Eco-friendly Production"]
    },
    {
      id: 3,
      name: "Casual Linen Shirt",
      image: "https://via.placeholder.com/150",
      price: 49.99,
      rating: 4.8,
      availability: "Limited Stock",
      brand: "Comfort Wear",
      category: "Shirts",
      features: ["100% Linen", "Breathable", "Button-Down", "Regular Fit"]
    }
  ]);

  const removeProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const handleAddToCart = (product) => {
    // Add to cart functionality
    toast.success(`${product.name} added to cart!`, {
      position: "bottom-center",
      icon: "🛒",
      duration: 2000,
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    // Here you would typically update a cart state or send to an API
  };

  // Render star ratings
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star-${i}`} className="fas fa-star text-amber-400"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half-star" className="fas fa-star-half-alt text-amber-400"></i>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-star-${i}`} className="far fa-star text-gray-300"></i>);
    }
    
    return stars;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-24 md:p-16 lg:p-32">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-12 text-center mt-28 md:mt-1 lg:mt-1">
          <i className="fas fa-tshirt mr-3 text-cyan-500"></i>
          <span className="">Compare Items</span>
        </h1>
        
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-10 text-center">
            <i className="fas fa-hanger text-4xl sm:text-5xl text-gray-300 mb-4 sm:mb-6"></i>
            <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-3 sm:mb-4">No items to compare</h2>
            <p className="text-gray-500 mb-6 sm:mb-8">Add clothing items to compare styles, materials, and fits.</p>
            <Link to="/products" className="inline-block px-5 py-2 sm:px-6 sm:py-3 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors shadow-sm">
              <i className="fas fa-shopping-bag mr-2"></i>
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 p-8 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                  <button 
                    onClick={() => removeProduct(product.id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full text-gray-500 hover:text-red-500 transition-colors"
                    title="Remove from comparison"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                    product.availability === "In Stock" 
                      ? "bg-green-100 text-green-800" 
                      : product.availability === "Limited Stock" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-red-100 text-red-800"
                  }`}>
                    {product.availability}
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">{product.name}</h2>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-500 font-bold text-base sm:text-lg">${product.price.toFixed(2)}</span>
                      <div className="flex">
                        {renderRating(product.rating)}
                        <span className="ml-1 text-gray-500 text-xs">({product.rating})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex items-center">
                      <i className="fas fa-tag text-cyan-500 w-5"></i>
                      <span className="ml-2 text-gray-700 text-sm">{product.brand}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <i className="fas fa-folder text-cyan-500 w-5"></i>
                      <span className="ml-2 text-gray-700 text-sm">{product.category}</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <i className="fas fa-list text-cyan-500 w-5"></i>
                        <span className="ml-2 font-medium text-gray-700 text-sm">Features</span>
                      </div>
                      <ul className="pl-7 space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <i className="fas fa-check text-cyan-500 mt-1 mr-2 text-xs"></i>
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 px-3 sm:px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors text-xs sm:text-sm flex items-center justify-center"
                    >
                      <i className="fas fa-shopping-cart mr-1 sm:mr-2"></i>
                      <span className="hidden xs:inline">Add to Cart</span>
                      <span className="xs:hidden">Cart</span>
                    </button>
                    <button className="flex-1 px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs sm:text-sm flex items-center justify-center">
                      <i className="far fa-heart mr-1 sm:mr-2"></i>
                      <span className="hidden xs:inline">Wishlist</span>
                      <span className="xs:hidden">Save</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Add more products section */}
        <div className="mt-8 sm:mt-10 text-center">
          <Link to="/products" className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors shadow-sm text-sm sm:text-base">
            <i className="fas fa-plus mr-2"></i>
            <span className="hidden xs:inline">Add More Items to Compare</span>
            <span className="xs:hidden">Add More Items</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Compare;
