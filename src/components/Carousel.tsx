
import { useState, useEffect } from 'react';

interface CarouselProps {
  images: string[];
  interval?: number; // in milliseconds
}

const Carousel = ({ images, interval = 5000 }: CarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean[]>(Array(images.length).fill(false));
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 300);
    }, interval);
    
    return () => clearInterval(timer);
  }, [images.length, interval]);

  const handleImageLoad = (index: number) => {
    const newIsLoaded = [...isLoaded];
    newIsLoaded[index] = true;
    setIsLoaded(newIsLoaded);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-64 md:h-96 bg-muted rounded-lg flex items-center justify-center animate-pulse">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg shadow-md">
      {/* Image placeholder/skeleton */}
      <div className="absolute inset-0 bg-muted animate-pulse" />
      
      {/* Images */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            currentImageIndex === index 
              ? isTransitioning 
                ? 'opacity-0' 
                : 'opacity-100' 
              : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Carousel image ${index + 1}`}
            className="w-full h-full object-cover"
            onLoad={() => handleImageLoad(index)}
          />
        </div>
      ))}
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentImageIndex === index 
                ? 'bg-white w-4' 
                : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
