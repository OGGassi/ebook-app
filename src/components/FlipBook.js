import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './FlipBook.css';

const FlipBook = ({ pages }) => {
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const book = bookRef.current;
    const leaves = book.querySelectorAll('.leaf');

    const setPagePosition = (page, position, index) => {
      let transform = "";
      transform = `translate3d(0,0,${(position < 0 ? 1 : -1) * Math.abs(index)}px)`;
      
      if (position < 0) {
        transform += "rotate3d(0,1,0,180deg)";
        page.classList.add("turned");
      } else {
        page.classList.remove("turned");
      }
      
      if (page.style.transform !== transform) {
        page.style.transform = transform;
      }
    };

    leaves.forEach((page, index) => {
      setPagePosition(page, index - currentPage, index);
    });
  }, [currentPage]);

  const turnPage = (delta) => {
    setCurrentPage(prev => {
      const newPage = prev + delta;
      if (newPage < 0 || newPage > pages.length) return prev;
      return newPage;
    });
  };

  return (
    <div className="flip-book-container">
      <div id="flipbook" ref={bookRef} className="flip-book">
        {pages.map((page, index) => (
          <div key={index} className="leaf">
            <div className="page front">
              <div className="page-content">{page.front}</div>
            </div>
            <div className="page back">
              <div className="page-content">{page.back}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="controls">
        <button 
          onClick={() => turnPage(-1)} 
          disabled={currentPage === 0}
          className="control-button"
        >
          <ChevronRight />
        </button>
        <button 
          onClick={() => turnPage(1)} 
          disabled={currentPage === pages.length}
          className="control-button"
        >
          <ChevronLeft />
        </button>
      </div>
    </div>
  );
};

export default FlipBook;