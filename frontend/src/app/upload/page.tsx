'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaAngleLeft } from 'react-icons/fa6';
import { uploadFiles } from '../api/api';
import Link from 'next/link';

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const allowedTypes = ['image/*', 'application/pdf', 'application/vnd.ms-excel', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

  const validateFiles = (selectedFiles: File[]) => {
    return selectedFiles.filter((file) => {
      const fileType = file.type;
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      // Check by MIME type or file extension
      return allowedTypes.some((type) =>
        type.includes('/') ? fileType.startsWith(type.split('/')[0]) : fileExtension === type.replace('.', '')
      );
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = validateFiles(selectedFiles);
      setFiles(validFiles);
      setButtonDisabled(validFiles.length === 0);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(droppedFiles);
    setFiles(validFiles);
    setButtonDisabled(validFiles.length === 0);
  };

  const uploadFilesHandler = async () => {
    if (!files.length) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file)); // Correct key 'files'

      await uploadFiles(formData); // API call to upload files
      router.push('/profile');
    } catch (error) {
      console.error('Error uploading files', error);
    } finally {
      setIsUploading(false); // Reset the uploading state
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white px-6">
      <h1 className="text-5xl font-bold mb-10">Upload Documents</h1>

      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <div
          className="border border-dashed border-gray-600 p-4 rounded-lg mb-6 cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <label className="text-gray-400 text-center block cursor-pointer">
            {files.length ? (
              files.map((file, index) => (
                <li key={index} className="truncate">{file.name}</li>
              ))
            ) : (
              'Drag and drop files here, or click to select files'
            )}
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept={allowedTypes.join(',')}
              className="hidden"
              onClick={(e: any) => (e.target.value = null)} // Reset file input
            />
          </label>
        </div>

        <ul className="text-sm text-gray-400 mb-4">
          {files.map((file, index) => (
            <li key={index} className="truncate">
              {file.name}
            </li>
          ))}
        </ul>

        <button
          onClick={uploadFilesHandler}
          disabled={buttonDisabled || isUploading}
          className={`w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400 ${
            buttonDisabled || isUploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
          } transition duration-300`}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
        <Link href="/profile">
          <p className="mt-8 text-center text-gray-400">
            <FaAngleLeft className="inline mr-1" /> Back to Homepage
          </p>
        </Link>
      </div>
    </div>
  );
}
