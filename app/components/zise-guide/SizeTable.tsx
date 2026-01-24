'use client';

import React from 'react';

interface SizeTableProps {
  headers: string[];
  sizes: Record<string, string>[];
  title?: string;
}

export const SizeTable: React.FC<SizeTableProps> = ({
  headers,
  sizes,
  title,
}) => {
  return (
    <div className="overflow-x-auto">
      {title && (
        <h4 className="text-lg font-semibold mb-3 text-blue-600 text-center">
          {title}
        </h4>
      )}
      <table className="w-full text-center">
        <thead>
          <tr className="bg-blue-600 text-white">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-3 text-sm font-semibold first:rounded-tl-lg last:rounded-tr-lg"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sizes.map((size, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              } hover:bg-gray-100 transition-colors`}
            >
              {Object.values(size).map((value, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-4 py-3 text-sm border-b border-gray-200 text-gray-800 ${
                    cellIndex === 0 ? 'font-semibold text-gray-900' : ''
                  }`}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SizeTable;