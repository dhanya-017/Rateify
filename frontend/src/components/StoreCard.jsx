import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar, FaClock, FaDollarSign, FaMapPin } from 'react-icons/fa';

const StoreCard = ({ store, onRateChange, isLoading }) => {
  const [isRating, setIsRating] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const renderStars = (rating, interactive = false) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <FaStar
            key={i}
            className={`w-4 h-4 ${
              interactive 
                ? i <= (hoveredStar || rating) 
                  ? 'text-yellow-400 cursor-pointer' 
                  : 'text-gray-300 cursor-pointer hover:text-yellow-400'
                : 'text-yellow-400'
            }`}
            onClick={() => interactive && handleRatingClick(i)}
            onMouseEnter={() => interactive && setHoveredStar(i)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
          />
        );
      } else if (hasHalfStar && i === fullStars + 1) {
        stars.push(
          <FaStarHalfAlt
            key={i}
            className={`w-4 h-4 ${
              interactive 
                ? 'text-yellow-400 cursor-pointer hover:text-yellow-400'
                : 'text-yellow-400'
            }`}
            onClick={() => interactive && handleRatingClick(i)}
            onMouseEnter={() => interactive && setHoveredStar(i)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
          />
        );
      } else {
        stars.push(
          <FaRegStar
            key={i}
            className={`w-4 h-4 ${
              interactive 
                ? 'text-gray-300 cursor-pointer hover:text-yellow-400'
                : 'text-gray-300'
            }`}
            onClick={() => interactive && handleRatingClick(i)}
            onMouseEnter={() => interactive && setHoveredStar(i)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
          />
        );
      }
    }
    return stars;
  };

  const handleRatingClick = async (rating) => {
    setIsRating(true);
    await onRateChange(store.id, rating);
    setIsRating(false);
    setHoveredStar(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Store Header Image */}
      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-bold mb-1">{store.name}</h3>
          <div className="flex items-center text-white text-sm">
            <FaMapPin className="w-4 h-4 mr-1" />
            <span className="truncate">{store.address}</span>
          </div>
        </div>
      </div>

      {/* Store Content */}
      <div className="p-6">
        {/* Overall Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex mr-2">
              {renderStars(parseFloat(store.average_rating))}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {parseFloat(store.average_rating).toFixed(1)}
              </p>
              <p className="text-xs text-gray-500">Overall Rating</p>
            </div>
          </div>
          
          {/* Quick Info */}
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center">
              <FaClock className="w-3 h-3 mr-1" />
              <span>Open</span>
            </div>
            <div className="flex items-center">
              <FaDollarSign className="w-3 h-3 mr-1" />
              <span>$$</span>
            </div>
          </div>
        </div>

        {/* User Rating Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Your Rating</span>
            {store.user_rating ? (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Rated
              </span>
            ) : (
              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                Not Rated
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {renderStars(store.user_rating || 0, true)}
              <span className="ml-2 text-sm text-gray-600">
                {store.user_rating ? `You rated ${store.user_rating}` : 'Click to rate'}
              </span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRatingClick(5)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                store.user_rating 
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Rating...
                </div>
              ) : store.user_rating ? (
                'Update Rating'
              ) : (
                'Rate Now'
              )}
            </motion.button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Store ID: #{store.id}</span>
            <span>Click stars to rate</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StoreCard;
