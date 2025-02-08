import  { useState } from 'react';
  
const CardList = () => {
  const [position, setPosition] = useState(0);
  const cardWidth = 140; // Adjust based on card size + spacing
  const maxPosition = -cardWidth * 10; // Adjust based on the total number of cards

  const moveLeft = () => {
    setPosition((prev) => Math.min(prev + cardWidth, 0)); // Prevent moving too far left
  };

  const moveRight = () => {
    setPosition((prev) => Math.max(prev - cardWidth, maxPosition)); // Prevent moving too far right
  };

  return (
    <div className="flex items-center">
      <button onClick={moveLeft} className="px-3 py-1 bg-gray-300 rounded">◀</button>

      <div className="overflow-hidden w-[500px] relative">
        <div
          className="flex space-x-4 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${position}px)` }}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="w-32 h-32 bg-gray-200 flex items-center justify-center">
              Card {i + 1}
            </div>
          ))}
        </div>
      </div>

      <button onClick={moveRight} className="px-3 py-1 bg-gray-300 rounded">▶</button>
    </div>
  );
};

export default CardList;
