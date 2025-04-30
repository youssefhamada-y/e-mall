import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const [countdown, setCountdown] = useState(10);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [asteroids, setAsteroids] = useState([]);
  const containerRef = useRef(null);
  
  // Ship position follows mouse
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
      const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height);
      setPosition({ x, y });
    }
  };
  
  // Generate random asteroids
  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        if (asteroids.length < 15) {
          const newAsteroid = {
            id: Date.now(),
            x: Math.random() * 100,
            size: Math.random() * 50 + 20,
            speed: Math.random() * 3 + 1
          };
          setAsteroids(prev => [...prev, newAsteroid]);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [asteroids.length, gameActive]);
  
  // Move asteroids and check collisions
  useEffect(() => {
    if (gameActive) {
      const gameLoop = setInterval(() => {
        setAsteroids(prev => 
          prev
            .map(asteroid => ({
              ...asteroid,
              y: (asteroid.y || 0) + asteroid.speed,
            }))
            .filter(asteroid => asteroid.y < 100)
        );
      }, 50);
      
      return () => clearInterval(gameLoop);
    }
  }, [gameActive]);
  
  // Countdown for redirect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      console.log("Redirecting to home page...");
      setGameActive(false);
      // Actually redirect to home page after a short delay to show the game over screen
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  }, [countdown]);
  
  // Handle asteroid collection/destruction
  const destroyAsteroid = (id) => {
    setAsteroids(prev => prev.filter(a => a.id !== id));
    setScore(prev => prev + 10);
  };

  return (
    <motion.div 
      ref={containerRef}
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
    >
      {/* Stars background */}
      {Array.from({ length: 100 }).map((_, i) => (
        <div 
          key={`star-${i}`}
          className="absolute bg-white rounded-full"
          style={{
            width: Math.random() < 0.8 ? '1px' : '2px',
            height: Math.random() < 0.8 ? '1px' : '2px',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.3
          }}
        />
      ))}
      
      {/* 404 text as a nebula */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <h1 className="text-9xl font-bold tracking-tighter text-blue-400 select-none">404</h1>
      </div>
      
      {/* Game area */}
      <div className="relative w-full h-full flex-1">
        {/* Asteroids (404 fragments) */}
        {asteroids.map((asteroid) => (
          <motion.div
            key={asteroid.id}
            className="absolute bg-gray-300 rounded-full flex items-center justify-center cursor-pointer"
            style={{ 
              left: `${asteroid.x}%`, 
              top: `${asteroid.y || -10}%`,
              width: `${asteroid.size}px`,
              height: `${asteroid.size}px`
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.7, scale: 1 }}
            onClick={() => destroyAsteroid(asteroid.id)}
            whileHover={{ scale: 1.2 }}
          >
            <span className="text-xs font-mono text-gray-800">404</span>
          </motion.div>
        ))}
        
        {/* Spaceship (cursor) */}
        {gameActive && (
          <motion.div
            className="absolute z-10 pointer-events-none"
            style={{ 
              left: position.x - 20, 
              top: position.y - 20,
            }}
            animate={{ x: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
          >
            <i className="fas fa-rocket text-blue-400 text-3xl transform -rotate-45"></i>
          </motion.div>
        )}
      </div>
      
      {/* Info panel */}
      <motion.div 
        className="absolute top-0 left-0 right-0 bg-gray-900 bg-opacity-70 p-4 flex justify-between items-center"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div>
          <h2 className="text-xl font-bold text-blue-300">Page Not Found</h2>
          <p className="text-gray-300 text-sm">
            Help collect 404 fragments while waiting
          </p>
        </div>
        
        <div className="flex gap-8 items-center">
          <div className="text-center">
            <div className="text-sm text-gray-400">SCORE</div>
            <div className="text-2xl font-bold text-yellow-300">{score}</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-400">REDIRECT IN</div>
            <motion.div 
              key={countdown}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-red-400"
            >
              {countdown}s
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Bottom action buttons */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-70 p-4 flex justify-between items-center"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button 
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2 transition-colors"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Go Back</span>
        </button>
        
        <div className="text-gray-300 text-sm">
          <span className="mr-2">Lost in space?</span>
          <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">
            Return to Earth <i className="fas fa-home"></i>
          </a>
        </div>
        
        <button 
          onClick={() => setGameActive(!gameActive)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center gap-2 transition-colors"
        >
          <i className={`fas fa-${gameActive ? 'pause' : 'play'}`}></i>
          <span>{gameActive ? 'Pause' : 'Play'}</span>
        </button>
      </motion.div>
      
      {/* Progress bar for countdown */}
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-red-500"
        initial={{ width: "100%" }}
        animate={{ width: `${(countdown / 10) * 100}%` }}
        transition={{ ease: "linear" }}
      />
      
      {/* Game Over message when countdown reaches 0 */}
      {countdown === 0 && (
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.h2 
            className="text-5xl font-bold text-blue-300 mb-4"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            Redirecting...
          </motion.h2>
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 1 }}
          >
            <i className="fas fa-sync-alt text-5xl text-blue-400 animate-spin"></i>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-300 text-xl mb-2">Final Score: {score}</p>
            <p className="text-gray-400">Thanks for playing!</p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NotFoundPage;