import React, { useState } from 'react';
import { X, Link } from 'lucide-react';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaEnvelope, FaInstagram } from 'react-icons/fa';

const ShareModal = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareOptions = [
    { name: 'Facebook', icon: FaFacebook, url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { name: 'Twitter', icon: FaTwitter, url: `https://twitter.com/intent/tweet?url=${shareUrl}` },
    { name: 'LinkedIn', icon: FaLinkedin, url: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}` },
    { name: 'WhatsApp', icon: FaWhatsapp, url: `https://api.whatsapp.com/send?text=${shareUrl}` },
    { name: 'Email', icon: FaEnvelope, url: `mailto:?body=${shareUrl}` },
    { name: 'Instagram', icon: FaInstagram, url: `https://instagram.com` },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div dir="rtl" className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">שתף את הספר</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {shareOptions.map((option) => {
            const Icon = option.icon;
            return (
              <a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => copyLink()}
              >
                <Icon className="text-2xl mb-1" />
                <span className="text-sm">{option.name}</span>
              </a>
            );
          })}
        </div>
        <div className="mt-4">
          <button
            onClick={copyLink}
            className="w-full flex items-center justify-center p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Link className="ml-2" />
            {copied ? 'הקישור הועתק!' : 'העתק קישור'}
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>מחבר: עומר גסנר</p>
          <p>צור קשר: omergassner@gmail.com</p>
          <a href="https://www.linkedin.com/in/omer-g-gassner/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            פרופיל LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;