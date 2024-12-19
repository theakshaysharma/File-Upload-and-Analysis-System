'use client';

import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaImage, FaFileAlt, FaFileExcel } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { getAllFiles, getFileDetails } from '../api/api';
import FileModal from '../modal/filemodal';

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
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

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

  const handleSearch = () => {
    let filtered = documents;

    if (fileName.trim()) {
      filtered = filtered.filter((doc) =>
        doc.fileName.toLowerCase().includes(fileName.toLowerCase())
      );
    }

    if (fileType) {
      filtered = filtered.filter((doc) => doc.fileType === fileType);
    }

    setFilteredDocuments(filtered);
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
            className="cursor-pointer flex flex-col items-center bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            {getFileIcon(doc.fileType)}
            {/* <span className="mt-2 text-center text-sm">{doc.fileName}</span> */}
          </div>
        ))}
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
    </div>
  );
}
