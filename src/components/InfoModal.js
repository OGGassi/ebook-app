import React from 'react';
import { X } from 'lucide-react';

const InfoModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">מידע על האפליקציה</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <p>אפליקציית הספר האלקטרוני הזו פותחה כדי לספק חוויית קריאה נוחה ונגישה.</p>
          <h3 className="font-bold">תכונות נוכחיות:</h3>
          <ul className="list-disc list-inside">
            <li>ניווט קל בין עמודים</li>
            <li>אפשרות להצגת טקסט עם או בלי ניקוד</li>
            <li>מצב לילה לקריאה נוחה בחושך</li>
            <li>אפשרויות שיתוף</li>
            <li>תצוגה מותאמת למכשירים ניידים</li>
          </ul>
          <h3 className="font-bold">תכונות עתידיות:</h3>
          <ul className="list-disc list-inside">
            <li>הקראת הטקסט (Text-to-Speech)</li>
            <li>סימניות ואפשרות לשמור את המיקום בספר</li>
            <li>אפשרות להוספת הערות</li>
            <li>תמיכה במספר שפות</li>
            <li>אינטגרציה עם רשתות חברתיות</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;