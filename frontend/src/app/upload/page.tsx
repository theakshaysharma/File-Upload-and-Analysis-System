'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaAngleLeft } from 'react-icons/fa6';
import { uploadFiles } from '../api/api';
import Link from 'next/link';
import Cookies from 'js-cookie';
import Modal from '../modal/modal';

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (!token) {
      router.push('/');
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('accessToken');
    router.push('/');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const uploadFilesHandler = async () => {
    if (!files.length) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      await uploadFiles(formData);
      router.push('/profile');
    } catch (error) {
      console.error('Error uploading files', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white px-6 relative">
      {/* Logout Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute top-4 right-4 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 text-white"
      >
        Logout
      </button>

      <h1 className="text-5xl font-bold mb-10">Upload Documents</h1>

      <div
        className={`w-full max-w-md p-8 border-2 ${
          isDragging ? 'border-blue-500' : 'border-gray-600'
        } border-dashed rounded-lg bg-gray-800 text-center shadow-lg transition duration-300`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer block w-full h-full text-center"
        >
          {files.length > 0 ? (
            <p className="text-lg text-green-400 font-medium">
              {files.length} file(s) selected. Drag more to add or click here.
            </p>
          ) : isDragging ? (
            <p className="text-lg text-blue-400 font-medium">
              Drop your files here!
            </p>
          ) : (
            <p className="text-lg text-gray-400">
              Drag and drop files here or{' '}
              <span className="text-blue-500">click to browse</span>
            </p>
          )}
        </label>
      </div>

      <button
        onClick={uploadFilesHandler}
        disabled={!files.length || isUploading}
        className={`w-full max-w-md mt-6 p-3 rounded-lg transition duration-300 ${
          !files.length || isUploading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-blue-700 hover:bg-blue-800'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>

      <Link href="/profile">
        <p className="mt-8 text-center text-gray-400">
          <FaAngleLeft className="inline mr-1" /> Back to Homepage
        </p>
      </Link>

      {/* Generalized Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Logout Confirmation"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}
