import React, { useState, useEffect } from 'react';
import { ChevronLeft, Play, Pause } from 'lucide-react';

const ReadableView = ({ pages, onClose }) => {
  const [isReading, setIsReading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!window.responsiveVoice) {
      setError('שירות ההקראה אינו זמין כרגע. אנא נסו שוב מאוחר יותר.');
      return;
    }

    window.responsiveVoice.init();

    const hebrewVoice = window.responsiveVoice.getVoices().find(voice => voice.name === "Hebrew Female");
    if (!hebrewVoice) {
      setError('קול בעברית אינו זמין כעת. אנא נסו שוב מאוחר יותר.');
    }

    return () => {
      if (window.responsiveVoice) {
        window.responsiveVoice.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isReading && window.responsiveVoice) {
      window.responsiveVoice.speak(pages[currentPage].text, "Hebrew Female", {
        pitch: 1,
        rate: 1,
        volume: 1,
        onend: () => {
          if (currentPage < pages.length - 1) {
            setCurrentPage(prevPage => prevPage + 1);
          } else {
            setIsReading(false);
          }
        },
        onerror: (event) => {
          console.error('Speech synthesis error:', event);
          setError('שגיאה בהפעלת הקראה. אנא נסו שוב מאוחר יותר.');
          setIsReading(false);
        }
      });
    } else if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
    }
  }, [isReading, currentPage, pages]);

  const toggleReading = () => {
    if (window.responsiveVoice) {
      setIsReading(!isReading);
    } else {
      setError('שירות ההקראה אינו זמין כרגע. אנא נסו שוב מאוחר יותר.');
    }
  };

  const renderPage = (page, index) => {
    switch (page.type) {
      case 'cover':
        return (
          <div key={index} className="mb-8">
            <img 
              src={page.image} 
              alt={`כריכת הספר: ${page.title}`}
              className="w-full h-auto object-cover rounded-lg mb-4"
            />
            <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
            <p className="text-xl">{page.subtitle}</p>
          </div>
        );
      case 'dedication':
        return (
          <div key={index} className="mb-8">
            <img 
              src={page.image} 
              alt="אווירת הספר"
              className="w-full h-auto object-cover rounded-lg mb-4"
            />
            <p className="text-lg italic mb-4">{page.dedication}</p>
            <h2 className="text-3xl font-bold mb-2">{page.title}</h2>
            <p className="text-xl mb-4">{page.author}</p>
            <p>{page.summary}</p>
          </div>
        );
      default:
        return (
          <div key={index} className="mb-8">
            <img 
              src={page.image} 
              alt={`איור לפרק ${index + 1}: ${page.imageTitle}`}
              className="w-full h-auto object-cover rounded-lg mb-4"
            />
            <p className="text-lg text-right whitespace-pre-line">
              {page.text}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onClose}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors min-w-[44px] min-h-[44px]"
          aria-label="חזרה לתצוגת ספר"
        >
          <ChevronLeft className="inline mr-2" />
          חזרה לספר
        </button>
        
        <div className="sticky top-4 z-10 bg-white py-2 mb-4 flex justify-between items-center">
          <button 
            onClick={toggleReading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors min-w-[44px] min-h-[44px]"
            aria-label={isReading ? 'הפסק קריאה' : 'התחל קריאה'}
          >
            {isReading ? <Pause className="inline mr-2" /> : <Play className="inline mr-2" />}
            {isReading ? 'הפסק קריאה' : 'התחל קריאה'}
          </button>
          <span className="text-lg font-semibold">
            עמוד {currentPage + 1} מתוך {pages.length}
          </span>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="space-y-8">
          {pages.map((page, index) => renderPage(page, index))}
        </div>
      </div>
    </div>
  );
};

export default ReadableView;