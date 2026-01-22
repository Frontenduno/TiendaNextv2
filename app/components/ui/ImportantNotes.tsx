import React from 'react';

interface ImportantNotesProps {
  notes: string[];
  title?: string;
}

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ImportantNotes: React.FC<ImportantNotesProps> = ({ 
  notes,
  title = "Información Importante"
}) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
          <InfoIcon className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-amber-800">
          {title}
        </h2>
      </div>
      
      <ul className="space-y-3">
        {notes.map((note, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 mt-0.5">
              {index + 1}
            </span>
            <p className="text-amber-900 leading-relaxed">
              {note}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImportantNotes;
