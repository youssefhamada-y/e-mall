import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Loading from '../Loading/Loading';
const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedItems, setRecommendedItems] = useState([]);

  useEffect(() => {
    // Fetch wishlist data
    const fetchWishlist = () => {
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockItems = [
          {
            id: 1,
            name: 'Wireless Headphones',
            price: 129.99,
            image: 'https://via.placeholder.com/150',
            rating: 4.5,
            inStock: true
          },
          {
            id: 2,
            name: 'Smart Watch',
            price: 199.99,
            image: 'https://via.placeholder.com/150',
            rating: 4.2,
            inStock: true
          },
          {
            id: 3,
            name: 'Bluetooth Speaker',
            price: 79.99,
            image: 'https://via.placeholder.com/150',
            rating: 4.7,
            inStock: false
          }
        ];
        setWishlistItems(mockItems);
        setIsLoading(false);
      }, 1000);
    };

    // Fetch recommended items
    const fetchRecommendedItems = () => {
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockRecommended = [
          {
            id: 101,
            name: 'Premium Earbuds',
            price: 89.99,
            image: 'https://via.placeholder.com/150?text=P1',
            inStock: true
          },
          {
            id: 102,
            name: 'Fitness Tracker',
            price: 69.99,
            image: 'https://via.placeholder.com/150?text=P2',
            inStock: true
          },
          {
            id: 103,
            name: 'Portable Charger',
            price: 49.99,
            image: 'https://via.placeholder.com/150?text=P3',
            inStock: true
          },
          {
            id: 104,
            name: 'Wireless Mouse',
            price: 29.99,
            image: 'https://via.placeholder.com/150?text=P4',
            inStock: true
          },
          {
            id: 105,
            name: 'Mechanical Keyboard',
            price: 119.99,
            image: 'https://via.placeholder.com/150?text=P5',
            inStock: true
          },
          {
            id: 106,
            name: 'USB-C Hub',
            price: 39.99,
            image: 'https://via.placeholder.com/150?text=P6',
            inStock: true
          },
          {
            id: 107,
            name: 'Laptop Stand',
            price: 24.99,
            image: 'https://via.placeholder.com/150?text=P7',
            inStock: true
          },
          {
            id: 108,
            name: 'Noise Cancelling Headphones',
            price: 149.99,
            image: 'https://via.placeholder.com/150?text=P8',
            inStock: true
          }
        ];
        setRecommendedItems(mockRecommended);
      }, 1200);
    };

    fetchWishlist();
    fetchRecommendedItems();
  }, []);

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const addToCart = (item) => {
    console.log('Added to cart:', item);
    removeFromWishlist(item.id);
  };

  const addToWishlist = (item) => {
    console.log('Added to wishlist:', item);
    // Implementation would add the item to the wishlist
  };

  // Custom dot component for the slider
  const CustomDot = ({ onClick, active }) => {
    return (
      <button
        onClick={onClick}
        className={`mx-1 my-2 w-8 h-2 rounded-sm transition-all duration-300 focus:outline-none ${
          active ? 'bg-indigo-600 w-12' : 'bg-gray-300 hover:bg-indigo-300'
        }`}
        aria-label="Slider dot"
      />
    );
  };

  // Settings for the recommendation slider
  const sliderSettings = {
    arrows: true,
    infinite: true,
    speed: 700,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    cssEase: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
    customPaging: function() {
      return <CustomDot active={false} onClick={() => {}} />;
    },
    dotsClass: "slick-dots custom-dots flex justify-center items-center",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          dots: true,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.5,
          dots: true,
          arrows: false,
        }
      }
    ],
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  };

  if (isLoading) {
    return (
     <Loading/>
    );
  }

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-800 inline-block relative">
            <span className="relative z-10">My Wishlist</span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-pink-200 opacity-50 z-0"></span>
          </h1>
          <p className="text-gray-600 mt-2 text-base">Items you've saved for later</p>
        </div>

        {/* Empty state */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="far fa-heart text-indigo-500 text-3xl"></i>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start saving items you love for inspiration or future purchases</p>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <i className="fas fa-search mr-2"></i>
              Discover Products
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Wishlist grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                    <button 
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm text-red-500 hover:text-red-700 transition-colors"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`${
                            i < Math.floor(item.rating) 
                              ? 'fas fa-star text-yellow-400' 
                              : i < Math.ceil(item.rating) 
                                ? 'fas fa-star-half-alt text-yellow-400' 
                                : 'far fa-star text-gray-300'
                          } text-sm`}
                        ></i>
                      ))}
                      <span className="ml-2 text-sm text-gray-500">({item.rating})</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">{item.name}</h3>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-indigo-600">${item.price.toFixed(2)}</span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        item.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <button 
                      onClick={() => addToCart(item)}
                      disabled={!item.inStock}
                      className={`w-full py-2.5 rounded text-sm font-medium flex items-center justify-center ${
                        item.inStock 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* You Might Also Like Section - Slider */}
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <i className="fas fa-lightbulb text-yellow-500 mr-3"></i>
                  You Might Also Like
                </h2>
              </div>
              
              <div className="relative px-6">
                <Slider {...sliderSettings} className="recommendation-slider">
                  {recommendedItems.map((item) => (
                    <div key={item.id} className="px-2 pb-6">
                      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                        <div className="h-40 bg-gray-100 relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          <button 
                            onClick={() => addToWishlist(item)}
                            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <i className="far fa-heart"></i>
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-12"></div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-medium text-gray-800 truncate">{item.name}</h3>
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-sm font-bold text-indigo-600">${item.price.toFixed(2)}</span>
                            <button 
                              onClick={() => addToCart(item)}
                              className="text-white bg-indigo-500 hover:bg-indigo-600 rounded-full p-2 transition-colors shadow-sm"
                            >
                              <i className="fas fa-shopping-cart"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Custom arrow components for the slider
function CustomPrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} z-10 before:content-none`}
      style={{ ...style, display: "block", left: "-25px" }}
      onClick={onClick}
    >
      <button className="p-2.5 bg-cyan-500 text-white hover:bg-cyan-600 transition-all duration-300 shadow-lg hover:shadow-pink-300/50 focus:outline-none w-10 h-10 flex items-center justify-center rounded-full">
        <i className="fas fa-chevron-left"></i>
      </button>
    </div>
  );
}

function CustomNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} z-10 before:content-none`}
      style={{ ...style, display: "block", right: "-25px" }}
      onClick={onClick}
    >
      <button className="p-2.5 bg-cyan-500 text-white hover:bg-cyan-600 transition-all duration-300 shadow-lg hover:shadow-pink-300/50 focus:outline-none w-10 h-10 flex items-center justify-center rounded-full">
        <i className="fas fa-arrow-right"></i>
      </button>
    </div>
  );
}

export default Wishlist;
