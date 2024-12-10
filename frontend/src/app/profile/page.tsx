'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '../api/api';
import { FaUpload, FaAngleLeft } from 'react-icons/fa6';
import Cookies from 'js-cookie';

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const  [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Check if the token exists
        const token = Cookies.get('accessToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await getUserProfile(); 
        if (response.status === 200) {
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setUsername(response.data.username);
          // setDocuments(response.documents);
        } else {
          throw new Error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data', error);
        // Clear the access token cookie
        Cookies.remove('accessToken');
        // Redirect to login page
        router.push('/login');
      } finally {
        setLoading(false); // Only set loading to false if data is fetched successfully
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
