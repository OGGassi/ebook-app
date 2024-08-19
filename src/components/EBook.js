import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, ChevronLeft, ChevronRight, Share2, Info } from 'lucide-react';
import { FaFont } from 'react-icons/fa';
import ShareModal from './ShareModal';
import InfoModal from './InfoModal';
import { pages, pagesWithNikud } from '../data/bookContent';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './EBook.css';

const EBook = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const [showNikud, setShowNikud] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [direction, setDirection] = useState('next');
  const [isMobile, setIsMobile] = useState(false);
  const [pageInput, setPageInput] = useState('');

  const pageRefs = useRef(pages.map(() => React.createRef()));
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    if (typeof window !== 'undefined') {
      const currentViewCount = parseInt(localStorage.getItem('viewCount') || '0');
      setViewCount(currentViewCount + 1);
      localStorage.setItem('viewCount', (currentViewCount + 1).toString());
    }

    // Prevent context menu
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // Prevent copy
    const handleCopy = (e) => {
      e.preventDefault();
      alert('העתקת תוכן אינה מורשית');
    };
    document.addEventListener('copy', handleCopy);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  useEffect(() => {
    if (currentPage === pages.length - 1) {
      const currentReadCount = parseInt(localStorage.getItem('readCount') || '0');
      setReadCount(currentReadCount + 1);
      localStorage.setItem('readCount', (currentReadCount + 1).toString());
    }
  }, [currentPage]);

  const goToPreviousPage = () => {
    setDirection('prev');
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNextPage = () => {
    setDirection('next');
    setCurrentPage((prev) => (prev < pages.length - 1 ? prev + 1 : prev));
  };

  const toggleNikud = () => {
    setShowNikud(!showNikud);
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(pageInput);
    if (pageNumber >= 1 && pageNumber <= pages.length) {
      setCurrentPage(pageNumber - 1);
      setPageInput('');
    } else {
      alert('מספר עמוד לא חוקי');
    }
  };

  const renderPage = (page, index) => {
    if (!page) return null;
  
    let content;
    switch (page.type) {
      case 'cover':
        content = (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full h-[50vh] relative mb-4">
              <img 
                src={page.image} 
                alt={`כריכת הספר: ${page.title}`}
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">{page.title}</h1>
            <p className="text-lg md:text-xl">{page.subtitle}</p>
          </div>
        );
        break;
      case 'dedication':
        content = (
          <div className="flex flex-col h-full">
            <div className="w-full h-[50vh] relative mb-4">
              <img 
                src={page.image} 
                alt="אווירת הספר"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-lg italic mb-2">{page.dedication}</p>
              <h2 className="text-xl md:text-3xl font-bold mb-2">{page.title}</h2>
              <p className="text-lg mb-2">{page.author}</p>
              <p className="text-sm md:text-base">{page.summary}</p>
            </div>
          </div>
        );
        break;
      default:
        content = (
          <div className="flex flex-col h-full">
            <div className="w-full h-[50vh] relative mb-4">
              <img 
                src={page.image} 
                alt={`איור לפרק ${index + 1}: ${page.imageTitle}`}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="overflow-y-auto">
              <p className="text-base md:text-lg text-right whitespace-pre-line">
                {showNikud ? pagesWithNikud[index].text : page.text}
              </p>
            </div>
          </div>
        );
    }
  
    return (
      <CSSTransition
        key={index}
        nodeRef={pageRefs.current[index]}
        timeout={300}
        classNames={direction === 'next' ? 'page-turn-next' : 'page-turn-prev'}
      >
        <div ref={pageRefs.current[index]} className="page-content h-full">
          {content}
        </div>
      </CSSTransition>
    );
  };
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      dir="rtl" 
      className={`flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
      onCopy={(e) => e.preventDefault()}
    >
      {isMobile && (
        <div className="text-center mb-4 text-red-500">
          נא לסובב את המכשיר למצב לאורך לחוויה מיטבית
        </div>
      )}
      <div className={`w-full max-w-4xl shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg p-6`}>
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex flex-wrap items-center space-x-4 space-x-reverse">
            <button 
              onClick={() => setShowShareModal(true)} 
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors min-w-[44px] min-h-[44px]"
              aria-label="שתף את הספר"
            >
              <Share2 className="h-6 w-6 ml-2 inline" />
              שתף
            </button>
            <button 
              onClick={toggleNikud} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors min-w-[44px] min-h-[44px]"
              aria-label={showNikud ? 'הצג ללא ניקוד' : 'הצג עם ניקוד'}
            >
              <FaFont className="inline ml-2" />
              {showNikud ? 'ללא ניקוד' : 'עם ניקוד'}
            </button>
            <button
              onClick={() => setShowInfoModal(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors min-w-[44px] min-h-[44px]"
              aria-label="מידע על האפליקציה"
            >
              <Info className="h-6 w-6 ml-2 inline" />
              מידע
            </button>
          </div>
          <div className="flex items-center mt-4 sm:mt-0">
            <label className="inline-flex items-center cursor-pointer" htmlFor="darkModeToggle">
              <input
                id="darkModeToggle"
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="sr-only peer"
              />
              <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </span>
            </label>
          </div>
        </div>
        <div className="relative h-[calc(90vh-201px)]">
          <TransitionGroup>
            {renderPage(pages[currentPage], currentPage)}
          </TransitionGroup>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={goToPreviousPage} 
            disabled={currentPage === 0}
            className={`flex items-center px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded transition-colors ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''} min-w-[44px] min-h-[44px]`}
            aria-label="לעמוד הקודם"
          >
            <ChevronRight className="ml-2" />
            הקודם
          </button>
          <span className="text-lg font-semibold">
            עמוד {currentPage + 1} מתוך {pages.length}
          </span>
          <button 
            onClick={goToNextPage} 
            disabled={currentPage === pages.length - 1}
            className={`flex items-center px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded transition-colors ${currentPage === pages.length - 1 ? 'opacity-50 cursor-not-allowed' : ''} min-w-[44px] min-h-[44px]`}
            aria-label="לעמוד הבא"
          >
            הבא
            <ChevronLeft className="mr-2" />
          </button>
        </div>
        <form onSubmit={handlePageInputSubmit} className="mt-4 flex justify-center items-center">
          <input
            type="number"
            value={pageInput}
            onChange={handlePageInputChange}
            min="1"
            max={pages.length}
            className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md"
            placeholder="עמוד"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            עבור
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          צפיות: {viewCount} | קריאות מלאות: {readCount}
        </div>
      </div>
      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}
      {showInfoModal && (
        <InfoModal onClose={() => setShowInfoModal(false)} />
      )}
    </div>
  );
};

export default EBook;