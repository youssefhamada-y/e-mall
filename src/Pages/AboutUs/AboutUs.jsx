import React from 'react';
import { motion } from 'framer-motion';
import logo from "../../assets/images/logonew.png";

function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div 
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <img src={logo} alt="Click & Mart Logo" className="h-28 pt-6" />
          </motion.div>
          <h2 className="text-xl italic mt-2 text-gray-700">Your Online Fashion Destination</h2>
        </div>
        
        <div className="p-6 md:p-10">
          <div className="mb-8">
            <p className="text-gray-700 font-medium mb-6">Dear Customer,</p>
            
            <p className="text-gray-800 mb-6">
              In 2025, <span className="font-semibold">Click & Mart</span> was created with a clear vision:
              <br />
              <span className="italic text-blue-600 font-medium">To offer an innovative and reliable online shopping experience for fashion lovers across Egypt.</span>
            </p>
            
            <p className="text-gray-800 mb-6">
              Our mission is simple — to bring you the latest fashion trends in clothing and accessories, 
              sourced from trusted local and international brands, all in one easy-to-use platform.
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold text-blue-600 mb-4">We are proud to serve you with:</h3>
            
            <ul className="space-y-3 pl-5">
              <motion.li 
                className="flex items-center text-gray-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-blue-600 mr-2">✓</span> A wide variety of stylish and affordable products
              </motion.li>
              
              <motion.li 
                className="flex items-center text-gray-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-blue-600 mr-2">✓</span> Fast and secure delivery across Egypt
              </motion.li>
              
              <motion.li 
                className="flex items-center text-gray-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-blue-600 mr-2">✓</span> Safe and flexible payment options
              </motion.li>
              
              <motion.li 
                className="flex items-center text-gray-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-blue-600 mr-2">✓</span> A bilingual shopping experience in Arabic and English
              </motion.li>
            </ul>
          </div>
          
          <div className="mb-8">
            <p className="text-gray-800 mb-4">
              As you browse Click & Mart, we promise a smooth and enjoyable journey — whether you're discovering a new brand, 
              finding your perfect outfit, or simply exploring the latest looks.
            </p>
            
            <p className="text-gray-800 mb-4">
              The Click & Mart team is committed to continuously improving your shopping experience and becoming your go-to fashion destination.
            </p>
            
            <p className="text-gray-800 mb-6">
              Thank you for being part of our story. We look forward to serving you on Click & Mart.
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-gray-700">Warm regards,</p>
            <p className="font-semibold text-blue-600">The Click & Mart Team</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AboutUs;
