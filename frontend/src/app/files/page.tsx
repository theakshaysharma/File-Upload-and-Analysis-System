'use client';

import React, { useState, useEffect } from 'react';
import {
  FaFilePdf,
  FaImage,
  FaFileAlt,
  FaFileExcel,
  FaAngleLeft,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { getAllFiles, getFileDetails } from '../api/api';
import FileModal from '../modal/filemodal';
import Link from 'next/link';

type Document = {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
  status: string;
  extractedData: string;
  createdAt: string;
};

export default function AllFiles() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response: any = await getAllFiles();
        if (response.status === 'success') {
          const allDocs = response.data.documents || [];
          setDocuments(allDocs);
          setFilteredDocuments(allDocs);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
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
      console.error('Error fetching file details:', error);
      setSelectedDocument(null);
    }
  };

  const handleSearch = async () => {
    try {
      const filters: any = {};
      if (fileName.trim()) {
        filters.fileName = fileName.trim();
      }
      if (fileType) {
        filters.fileType = fileType;
      }

      setLoading(true);
      const response: any = await getAllFiles(filters);
      if (response.status === 'success') {
        setFilteredDocuments(response.data.documents || []);
      }
    } catch (error) {
      console.error('Error searching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuccess = () => {
    console.log('File deleted successfully');
    router.replace('/files');
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
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white px-6">
      <h1 className="text-5xl font-bold mb-8">All Files</h1>

      {/* Search Section */}
      <div className="w-full max-w-4xl mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by file name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
          />
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-600 bg-gray-900 text-white focus:outline-none focus:border-gray-400"
          >
            <option value="">Search by file type</option>
            <option value="application/pdf">PDF</option>
            <option value="image/jpeg">Image (JPEG)</option>
            <option value="image/png">Image (PNG)</option>
            <option value="application/vnd.ms-excel">Excel</option>
            <option value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
              Excel (XLSX)
            </option>
          </select>
          <button
            onClick={handleSearch}
            className="w-full p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
          >
            Search
          </button>
        </div>
      </div>

      {/* File List */}
      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-6 w-full max-w-6xl">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            onClick={() => fetchFileDetails(doc.id)}
            className="cursor-pointer relative flex flex-col items-center justify-center bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            {getFileIcon(doc.fileType)}

            {/* File Name with Tooltip */}
            <div
              className="mt-2 max-w-full text-center text-xs text-white overflow-hidden text-ellipsis whitespace-nowrap"
              title={doc.fileName} // Tooltip for full name
            >
              {doc.fileName}
            </div>
          </div>
        ))}
      </div>
      <Link href="/profile">
        <p className="mt-8 text-center text-gray-400">
          <FaAngleLeft className="inline mr-1" /> Back to Homepage
        </p>
      </Link>
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
          fileId={selectedDocument.id}
          onDeleteSuccess={() => handleDeleteSuccess()}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}
