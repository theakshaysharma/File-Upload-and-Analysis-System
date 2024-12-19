import React from 'react';

type FileModalProps = {
  isOpen: boolean;
  fileName: string;
  fileType: string;
  filePath: string;
  status: string;
  createdAt: string;
  extractedData: string; // Add the extracted data prop
  onClose: () => void;
};

export default function FileModal({
  isOpen,
  fileName,
  fileType,
  filePath,
  status,
  createdAt,
  extractedData, // Receive the extracted data as a prop
  onClose,
}: FileModalProps) {
  if (!isOpen) return null;

  // Parse the extracted data from stringified JSON
  let parsedExtractedData: any = {};
  try {
    parsedExtractedData = JSON.parse(extractedData);
  } catch (error) {
    console.error('Error parsing extracted data:', error);
    parsedExtractedData = extractedData; // If there's an error, show the raw string
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{fileName}</h2>
        <ul className="mb-6">
          <li>
            <span className="font-bold">File Type:</span> {fileType}
          </li>
          <li>
            <span className="font-bold">Status:</span> {status}
          </li>
          <li>
            <span className="font-bold">Created At:</span> {new Date(createdAt).toLocaleString()}
          </li>
        </ul>

        {/* Display extracted data with scrollable area */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg">Extracted Data:</h3>
          <div className="bg-gray-700 text-white p-4 rounded-lg max-h-60 overflow-y-auto whitespace-pre-wrap break-words">
            {/* If extracted data is an object, display it in a formatted manner */}
            {typeof parsedExtractedData === 'object' 
              ? JSON.stringify(parsedExtractedData, null, 2)
              : parsedExtractedData}
          </div>
        </div>

        <div className="mb-6">
          <a
            href={filePath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            Open File
          </a>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}
