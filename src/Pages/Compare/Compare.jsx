import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CompareContext } from "../Components/Context/CompareContext/CompareContext";
import { usercontext } from "../Components/Context/UserContext/UserContext";
import { cartcontext } from "../Components/Context/CartContext/CartContext";
import { WishlistContext } from "../Components/Context/WishlistContext/WishlistContext";

function Compare() {
  const { compareItems, getCompareItems, removeFromCompare } = useContext(CompareContext);
  const { token } = useContext(usercontext);
  const { addProductToCart } = useContext(cartcontext);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  useEffect(() => {
    if (token) {
      getCompareItems();
    }
  }, [token, getCompareItems]);

  // Handle add to cart
  const handleAddToCart = (product_id) => {
    addProductToCart({ product_id, quantity: 1 });
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (product_id) => {
    const isInWishlist = wishlist?.some(item => item.product_id === product_id);
    
    if (isInWishlist) {
      removeFromWishlist(product_id);
    } else {
      addToWishlist(product_id);
    }
  };

  // Render star ratings
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={`star-${i}`} className="fas fa-star text-amber-400"></i>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i key="half-star" className="fas fa-star-half-alt text-amber-400"></i>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-star-${i}`} className="far fa-star text-gray-300"></i>
      );
    }

    return stars;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-24 md:p-16 lg:p-32">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-12 text-center mt-28 md:mt-1 lg:mt-1">
          <i className="fas fa-exchange-alt mr-3 text-cyan-500"></i>
          <span className="">Compare Items</span>
        </h1>

        {!compareItems || compareItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-10 text-center">
            <i className="fas fa-exchange-alt text-4xl sm:text-5xl text-gray-300 mb-4 sm:mb-6"></i>
            <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-3 sm:mb-4">
              No items to compare
            </h2>
            <p className="text-gray-500 mb-6 sm:mb-8">
              Add products to compare features, prices, and specifications.
            </p>
            <Link
              to="/"
              className="inline-block px-5 py-2 sm:px-6 sm:py-3 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors shadow-sm"
            >
              <i className="fas fa-shopping-bag mr-2"></i>
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 p-8 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {compareItems.map((product) => (
              <div
                key={product.compare_id}
                className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => removeFromCompare(product.product_id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full text-gray-500 hover:text-red-500 transition-colors hover:bg-gray-100 shadow-sm"
                    title="Remove from comparison"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <div
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    In Stock
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 hover:text-cyan-600 transition-colors">
                      {product.name}
                    </h2>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-500 font-bold text-base sm:text-lg">
                        {parseFloat(product.price).toFixed(2)} EGP
                      </span>
                      <div className="flex">
                        {renderRating(4.5)}
                        <span className="ml-1 text-gray-500 text-xs">
                          (4.5)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex items-center">
                      <i className="fas fa-folder text-cyan-500 w-5"></i>
                      <span className="ml-2 text-gray-700 text-sm">
                        Men's Clothing
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <i className="fas fa-list text-cyan-500 w-5"></i>
                        <span className="ml-2 font-medium text-gray-700 text-sm">
                          Description
                        </span>
                      </div>
                      <div className="pl-7">
                        <p className="text-sm text-gray-600 line-clamp-3 hover:line-clamp-none transition-all duration-300">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product.product_id)}
                      className="flex-1 px-3 sm:px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors text-xs sm:text-sm flex items-center justify-center group-hover:shadow-md"
                    >
                      <i className="fas fa-shopping-cart mr-1 sm:mr-2"></i>
                      <span className="hidden xs:inline">Add to Cart</span>
                      <span className="xs:hidden">Cart</span>
                    </button>
                    <button 
                      onClick={() => handleWishlistToggle(product.product_id)}
                      className={`flex-1 px-3 sm:px-4 py-2 ${wishlist?.some(item => item.product_id === product.product_id) ? 'bg-pink-100 text-pink-600' : 'bg-gray-200 text-gray-700'} rounded-md hover:bg-gray-300 transition-colors text-xs sm:text-sm flex items-center justify-center group-hover:shadow-md`}
                    >
                      <i className={`${wishlist?.some(item => item.product_id === product.product_id) ? 'fas fa-heart text-pink-500' : 'far fa-heart'} mr-1 sm:mr-2`}></i>
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
          <Link
            to="/stores"
            className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors shadow-sm text-sm sm:text-base"
          >
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
