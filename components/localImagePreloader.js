import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const LocalImagePreloader = ({ children }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const importAll = (r) => {
      return r.keys().map(r);
    };

    // Import all images from the public/images directory
    const images = importAll(require.context('../public', false, /\.(png|jpe?g|svg)$/));
    setImageUrls(images.map((image) => image.default.src));
  }, []);

  useEffect(() => {
    if (imageUrls.length === 0) return;

    const preloadImages = async () => {
      const imagePromises = imageUrls.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setImagesLoaded(false);
      }
    };

    preloadImages();
  }, [imageUrls]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (!imagesLoaded) {
        router.events.emit('routeChangeError');
        throw 'Images are still loading. Please wait...';
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [imagesLoaded, router]);

  if (!imagesLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
      <div className="relative">
        <svg className="animate-spin-slow" width="200" height="200" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4FD1C5" /> {/* Teal */}
              <stop offset="50%" stopColor="#63B3ED" /> {/* Light Blue */}
              <stop offset="100%" stopColor="#B794F4" /> {/* Light Purple */}
            </linearGradient>
          </defs>
          <path d="M50 10 A40 40 0 0 1 50 90 A40 40 0 0 1 50 10" fill="none" stroke="url(#loader-gradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="251.2">
            <animate attributeName="stroke-dashoffset" from="251.2" to="0" dur="2s" repeatCount="indefinite" />
          </path>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-blue-200 rounded-full animate-pulse opacity-30"></div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-twinkle"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#4FD1C5', '#63B3ED', '#B794F4'][Math.floor(Math.random() * 3)],
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>
      <p className="absolute bottom-10 text-3xl font-bold text-blue-200 animate-pulse">
        Loading amazing content...
      </p>
    </div>
    );
  }

  return <>{children}</>;
};

export default LocalImagePreloader;