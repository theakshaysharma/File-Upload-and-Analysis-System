'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile, getFileDetails} from '../api/api';
import { FaUpload } from 'react-icons/fa6';
import { FaFilePdf, FaImage, FaFileAlt, FaFileExcel } from 'react-icons/fa';
import Cookies from 'js-cookie';
import Link from 'next/link';
import FileModal from '../modal/filemodal';
import Modal from '../modal/modal';

type Document = {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
  status: string;
  extractedData: string;
  createdAt: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [totalDoc, setTotalDoc] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) {
          console.error('No access token found.');
          throw new Error('No token found');
        }

        const response:any = await getUserProfile();
        if (response.status === 'success') {
          const userData = response.data;
          setDocuments(userData.documents || []);
          setTotalDoc(userData.documentCount || 0);
          setIsAdmin(['admin', 'owner'].includes(userData.role));
        } else {
          console.error('Failed to fetch profile data:', response);
          throw new Error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        Cookies.remove('accessToken');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  const fetchFileDetails = async (docId: number) => {
    try {
      const response = await getFileDetails(docId);
      if (response.status === 'success' && response.data) {
        setSelectedDocument(response.data);
      } else {
        setSelectedDocument(null);
      }
    } catch (error) {
      setSelectedDocument(null);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FaImage className="text-green-500 text-4xl" />;
    } else if (fileType === 'application/pdf') {
      return <FaFilePdf className="text-red-500 text-4xl" />;
    } else if (
      fileType === 'application/vnd.ms-excel' ||
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return <FaFileExcel className="text-green-400 text-4xl" />;
    } else {
      return <FaFileAlt className="text-gray-400 text-4xl" />;
    }
  };

  const handleViewAllFiles =() => {
    router.push('/files');
  }

  const handleLogout = () => {
    Cookies.remove('accessToken');
    router.push('/');
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
        {loading ? 'Loading...' : 'Your Documents'}
      </h1>

      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-lg">
     {totalDoc>0 &&    <h2 className="text-2xl font-bold mb-6">Uploaded Documents</h2>}
       <div className="grid grid-cols-4 sm:grid-cols-5 gap-6 mb-6 justify-center">
  {documents.slice(0, totalDoc > 4 ? 3 : 4).map((doc) => (
    <div
      key={doc.id}
      onClick={() => fetchFileDetails(doc.id)}
      className="cursor-pointer relative flex flex-col items-center justify-center bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition duration-300"
    >
      {getFileIcon(doc.fileType)}
      <span className="absolute bottom-4 text-center text-xs bg-gray-900 bg-opacity-75 text-white px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
        {doc.fileName}
      </span>
    </div>
  ))}

  {/* Conditional button */}
  {totalDoc > 4 && (
    <div className="flex items-center justify-center">
      <button
        onClick={() => handleViewAllFiles()}
        className="cursor-pointer flex items-center justify-center bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-500 transition duration-300"
      >
        View All Files
      </button>
    </div>
  )}
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

      {/* File Modal */}
      {selectedDocument && (
        <FileModal
          isOpen={!!selectedDocument}
          fileName={selectedDocument.fileName}
          fileType={selectedDocument.fileType}
          filePath={selectedDocument.filePath}
          status={selectedDocument.status}
          extractedData={selectedDocument.extractedData}
          createdAt={selectedDocument.createdAt}
          onClose={() => setSelectedDocument(null)}
        />
      )}
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