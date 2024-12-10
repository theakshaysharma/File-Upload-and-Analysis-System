'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '../api/api';
import { FaUpload } from 'react-icons/fa6';
import { FaFilePdf, FaImage, FaFileAlt, FaFileExcel } from 'react-icons/fa';
import Cookies from 'js-cookie';
import Modal from '../modal/modal';

type Document = {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
  status: string;
  createdAt: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await getUserProfile();
        if (response.status === 'success') {
          const userData = response.data;
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setUsername(userData.username);
          setDocuments(userData.documents || []);
          setIsAdmin(['admin', 'owner'].includes(userData.role));
        } else {
          throw new Error('Failed to fetch profile data');
        }
      } catch (error: any) {
        if (
          error.response?.status === 401 ||
          error.message === 'No token found'
        ) {
          Cookies.remove('accessToken');
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = () => {
    Cookies.remove('accessToken');
    router.push('/');
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FaImage className="text-green-500 text-4xl" />;
    } else if (fileType === 'application/pdf') {
      return <FaFilePdf className="text-red-500 text-4xl" />;
    } else if (
      fileType === 'application/vnd.ms-excel' ||
      fileType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return <FaFileExcel className="text-green-400 text-4xl" />;
    } else {
      return <FaFileAlt className="text-gray-400 text-4xl" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white px-6 relative">
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute top-4 right-4 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 text-white"
      >
        Logout
      </button>

      <h1 className="text-5xl font-bold mb-10">
        {loading ? 'Loading...' : `Welcome, ${firstName} ${lastName}`}
      </h1>

      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Uploaded Documents</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 mb-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="relative flex flex-col items-center justify-center bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition duration-300"
            >
              {getFileIcon(doc.fileType)}
              <span className="absolute bottom-4 text-center text-xs bg-gray-900 bg-opacity-75 text-white px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                {doc.fileName}
              </span>
            </div>
          ))}
        </div>

        <Link href="/edit-profile">
          <button className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400 bg-blue-700 hover:bg-blue-800 transition duration-300">
            Edit Details
          </button>
        </Link>

        {isAdmin && (
          <Link href="/edit-users">
            <button className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400 bg-blue-700 hover:bg-blue-800 transition duration-300 mt-4">
              Edit User Roles
            </button>
          </Link>
        )}

        <Link href="/upload">
          <button className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400 mt-4 bg-blue-700 hover:bg-blue-800 transition duration-300">
            <FaUpload className="inline mr-2" /> Upload Documents
          </button>
        </Link>
      </div>

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
