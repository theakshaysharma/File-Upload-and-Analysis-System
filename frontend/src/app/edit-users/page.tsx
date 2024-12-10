'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getUsers,
  updateUserRole,
  deleteUser,
  getUserProfile,
} from '../api/api';
import Cookies from 'js-cookie';
import Modal from '../modal/modal';
import Link from 'next/link';
import { FaAngleLeft, FaTrashAlt } from 'react-icons/fa';

type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
};

export default function EditUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal for Logout
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false); // Modal for Delete User
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userId, setUserId] = useState(0);
  const [userRole, setUserRole] = useState<string>(''); // Track the logged-in user's role

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await getUsers();
        if (response.status === 'success') {
          setUsers(response.data);
        } else {
          throw new Error('Failed to fetch users');
        }
      } catch (error: any) {
        if (
          error.response?.status === 401 ||
          error.message === 'No token found'
        ) {
          Cookies.remove('accessToken');
          router.push('/');
        } else {
          console.error('Error fetching users:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchProfileData = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await getUserProfile();
        if (response.status === 'success') {
          const userData = response.data;
          setUserId(userData.id);
          setUserRole(userData.role);

          // Redirect team members to the profile page
          if (userData.role === 'teammember') {
            router.push('/profile');
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
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
    fetchUsers();
  }, [router]);

  const handleMakeAdmin = async (userId: number) => {
    try {
      const response = await updateUserRole(userId, 'admin');
      if (response.status === 'success') {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: 'admin' } : user,
          ),
        );
      }
    } catch (error) {
      console.error('Error making user admin:', error);
    }
  };

  const handleRemoveAdmin = async (userId: number) => {
    try {
      const response = await updateUserRole(userId, 'teammember');
      if (response.status === 'success') {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: 'teammember' } : user,
          ),
        );
      }
    } catch (error) {
      console.error('Error removing admin role:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUserId === null) return;

    try {
      const response = await deleteUser(selectedUserId);
      if (response.status === 'success') {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== selectedUserId),
        );
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setIsDeleteModalOpen(false);
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
        {loading ? 'Loading...' : 'Manage Users'}
      </h1>

      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Users List</h2>

        <table className="w-full table-auto text-left text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2 w-32 text-center truncate">
                  {user.role}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  {user.id !== userId && userRole === 'owner' && (
                    <>
                      {user.role === 'teammember' && (
                        <button
                          onClick={() => handleMakeAdmin(user.id)}
                          className="w-36 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                        >
                          Make Admin
                        </button>
                      )}
                      {user.role === 'admin' && (
                        <button
                          onClick={() => handleRemoveAdmin(user.id)}
                          className="w-36 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded"
                        >
                          Remove Admin
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                      >
                        <FaTrashAlt />
                      </button>
                    </>
                  )}
                  {user.id !== userId &&
                    userRole === 'admin' &&
                    user.role === 'teammember' && (
                      <>
                        <button
                          onClick={() => handleMakeAdmin(user.id)}
                          className="w-36 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                        >
                          Make Admin
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                        >
                          <FaTrashAlt />
                        </button>
                      </>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link href="/profile">
        <p className="mt-8 text-gray-400">
          <FaAngleLeft className="inline mr-1" /> Back to Profile
        </p>
      </Link>

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
        isOpen={isDeleteModalOpen}
        title="Delete User Confirmation"
        message="Are you sure you want to delete this user?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteUser}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
