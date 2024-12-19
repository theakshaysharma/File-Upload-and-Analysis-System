import React, { useState } from 'react';
import { deleteFileById } from '../api/api';
import Modal from '../modal/modal';

type FileModalProps = {
  isOpen: boolean;
  fileId: number;
  fileName: string;
  fileType: string;
  filePath: string;
  status: string;
  createdAt: string;
  extractedData: string;
  onClose: () => void;
  onDeleteSuccess: () => void; // Callback for successful deletion
};

export default function FileModal({
  isOpen,
  fileId,
  fileName,
  fileType,
  filePath,
  status,
  createdAt,
  extractedData,
  onClose,
  onDeleteSuccess,
}: FileModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!isOpen) return null;

  // Ensure filePath points to the correct URL
  const fullPath = `${process.env.PUBLIC_URL}/uploads/${filePath}`;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFileById(fileId);
      onDeleteSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // Parse the extracted data
  let parsedExtractedData: any = {};
  try {
    parsedExtractedData = JSON.parse(extractedData);
  } catch (error) {
    console.error('Error parsing extracted data:', error);
    parsedExtractedData = extractedData;
  }

  return (
    <>
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
              <span className="font-bold">Created At:</span>{' '}
              {new Date(createdAt).toLocaleString()}
            </li>
          </ul>
          {parsedExtractedData && (
            <>
              <div className="mb-6">
                <h3 className="font-semibold text-lg">Extracted Data:</h3>
                <div className="bg-gray-700 text-white p-4 rounded-lg max-h-60 overflow-y-auto whitespace-pre-wrap break-words">
                  {typeof parsedExtractedData === 'object'
                    ? JSON.stringify(parsedExtractedData, null, 2)
                    : parsedExtractedData}
                </div>
              </div>
            </>
          )}
          <div className="mb-6">
            <a
              href={fullPath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300"
            >
              Open File
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 w-full mb-2"
          >
            Close
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2 bg-red-700 rounded-lg hover:bg-red-800 w-full"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete File'}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        title="Delete Confirmation"
        message={`Are you sure you want to delete the file "${fileName}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
