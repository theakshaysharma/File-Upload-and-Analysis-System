'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Modal from '../modal/modal';
import { getUserProfile, updateUserProfile } from '../api/api';

export default function EditProfilePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
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

  const handleSaveChanges = async () => {
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      // Make an API call to update the user's details
      const response = await updateUserProfile(firstName, lastName);
      if (response.status === 'success') {
        router.push('/profile'); // Redirect to profile page after saving changes
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error saving changes', error);
    }
  };

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
        {loading ? 'Loading...' : 'Edit Profile'}
      </h1>

      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">First Name</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-600 rounded-lg text-white bg-gray-700 focus:outline-none"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Last Name</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-600 rounded-lg text-white bg-gray-700 focus:outline-none"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <button
          onClick={handleSaveChanges}
          className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400 bg-blue-700 hover:bg-blue-800 transition duration-300"
        >
          Save Changes
        </button>
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
