'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function Welcome() {
  const [coupleUsersCount, setCoupleUsersCount] = useState(null);
  const [partnerUsersCount, setPartnerUsersCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch count from user_profile (couple users)
        const { count: coupleCount, error: coupleError } = await supabase
          .from('user_profile')
          .select('*', { count: 'exact', head: true });

        if (coupleError) throw coupleError;

        // Fetch count from partner_profile (partner users)
        const { count: partnerCount, error: partnerError } = await supabase
          .from('partner_profile')
          .select('*', { count: 'exact', head: true });

        if (partnerError) throw partnerError;

        setCoupleUsersCount(coupleCount);
        setPartnerUsersCount(partnerCount);
      } catch (err) {
        setError('Failed to fetch user counts. Please try again later.');
        console.error('Error fetching counts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="space-y-6 animate-slide-in">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 drop-shadow-md">
        Matson Admin Dashboard
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center text-base sm:text-lg">
          {error}
        </div>
      )}
      <div className="bg-white/80 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-gray-200/50 transform transition-all duration-500 hover:shadow-xl">
        <p className="text-gray-600 text-base sm:text-lg">
          Welcome to the Matson Admin Dashboard! Manage couple and partner users, create new accounts, and oversee your platform with ease. Use the sidebar to navigate through different sections.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Card: Total Couple Users */}
        <div className="bg-white/80 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-gray-200/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-cyan-100 rounded-full">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Couple Users</h3>
              <p className="text-2xl font-bold text-cyan-600">
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-cyan-600 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                ) : coupleUsersCount !== null ? (
                  coupleUsersCount
                ) : (
                  'N/A'
                )}
              </p>
              <p className="text-sm text-gray-500">Manage couple accounts</p>
            </div>
          </div>
        </div>
        {/* Stats Card: Total Partner Users */}
        <div className="bg-white/80 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-gray-200/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Partner Users</h3>
              <p className="text-2xl font-bold text-blue-600">
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-blue-600 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                ) : partnerUsersCount !== null ? (
                  partnerUsersCount
                ) : (
                  'N/A'
                )}
              </p>
              <p className="text-sm text-gray-500">Oversee partner accounts</p>
            </div>
          </div>
        </div>
        {/* Stats Card: Recent Activity */}
        <div className="bg-white/80 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-gray-200/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
              <p className="text-2xl font-bold text-green-600">N/A</p>
              <p className="text-sm text-gray-500">View recent actions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;