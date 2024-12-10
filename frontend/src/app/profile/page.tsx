'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '../api/api';
import { FaUpload } from 'react-icons/fa6';
import Cookies from 'js-cookie';

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await getUserProfile();
        console.log('Profile API Response:', response);

        if (response.status === 'success') {
          const userData = response.data;
          setFirstName(userData.firstName); // Accessing firstName from the correct path
          setLastName(userData.lastName);
          setUsername(userData.username);
          // Handle documents safely, if applicable in your case
          setDocuments(userData.documents || []);
        } else {
          throw new Error('Failed to fetch profile data');
        }
      } catch (error: any) {
        console.error('Error fetching profile data:', error);

        if (
          error.response?.status === 401 ||
          error.message === 'No token found'
        ) {
          Cookies.remove('accessToken');
          router.push('/');
        }
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white px-6">
      <h1 className="text-5xl font-bold mb-10">
        {loading ? 'Loading...' : `Welcome, ${firstName} ${lastName}`}
      </h1>

      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Uploaded Documents</h2>
        <ul className="mb-6">
          {documents.map((doc: any, index) => (
            <li key={index} className="text-gray-400 mb-2">
              {doc.name}
            </li>
          ))}
        </ul>

        <Link href="/edit-profile">
          <button className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400 bg-blue-700 hover:bg-blue-800 transition duration-300">
            Edit Details
          </button>
        </Link>

        <Link href="/upload">
          <button className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400 mt-4 bg-blue-700 hover:bg-blue-800 transition duration-300">
            <FaUpload className="inline mr-2" /> Upload Documents
          </button>
        </Link>
      </div>
    </div>
  );
}
