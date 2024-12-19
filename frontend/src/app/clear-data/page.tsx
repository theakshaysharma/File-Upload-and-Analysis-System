'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Modal from '../modal/modal';
import { clearAll, getUserProfile } from '../api/api';

export default function ClearAllDataPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal for Logout
  const [isClearDataModalOpen, setIsClearDataModalOpen] =
    useState<boolean>(false); // Modal for Clear Data

  const handleClearData = async () => {
    try {
      // Placeholder API call to clear all data
      const response = await clearAll();

      const result = await response.json();

      if (result.status === 'success') {
        alert('All data cleared successfully!');
        router.push('/');
      } else {
        throw new Error('Failed to clear data');
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Failed to clear data. Please try again later.');
    } finally {
      setIsClearDataModalOpen(false);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) {
          throw new Error('No token found');
        }

        // Fetch the user profile details
        const response = await getUserProfile();
        if (response.status === 'success') {
          const userData = response.data;
          if (userData.role !== 'owner') {
            Cookies.remove('accessToken');
            router.push('/');
          }
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
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white px-6 relative">
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute top-4 right-4 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 text-white"
      >
        Logout
      </button>

      <h1 className="text-5xl font-bold mb-10">Clear Application Data</h1>

      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Warning</h2>

        <p className="text-lg mb-6">
          Clearing all application data will remove{' '}
          <span className="font-bold">all information</span> from the database,
          including users, settings, and other stored data. This action is
          irreversible.
        </p>

        <button
          onClick={() => setIsClearDataModalOpen(true)}
          className="px-6 py-3 bg-red-600 text-white font-bold text-lg rounded-lg hover:bg-red-700"
        >
          Clear All Data
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Logout Confirmation"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={() => {
          Cookies.remove('accessToken');
          router.push('/');
        }}
        onCancel={() => setIsModalOpen(false)}
      />

      <Modal
        isOpen={isClearDataModalOpen}
        title="Clear All Data Confirmation"
        message="Are you sure you want to clear all application data? This action cannot be undone."
        confirmText="Clear Data"
        cancelText="Cancel"
        onConfirm={handleClearData}
        onCancel={() => setIsClearDataModalOpen(false)}
      />
    </div>
  );
}
