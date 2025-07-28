'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';

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

  const StatCard = ({ title, value, description, icon, color, link }) => (
    <div className="group relative">
      <Link to={link} className="block">
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group-hover:border-${color}-200`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <div className="flex items-baseline space-x-2">
                <p className={`text-3xl font-bold text-${color}-600`}>
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                      <span className="text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    value ?? 'N/A'
                  )}
                </p>
                {!loading && value !== null && (
                  <span className="text-sm text-gray-500">users</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
            <div className={`p-3 rounded-xl bg-${color}-100 group-hover:bg-${color}-200 transition-colors`}>
              {icon}
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
            <span>View details</span>
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );

  const QuickActionCard = ({ title, description, icon, color, link }) => (
    <Link to={link} className="block">
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group cursor-pointer`}>
        <div className={`p-3 rounded-xl bg-${color}-100 w-fit mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
          <span>Get started</span>
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your platform.</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Couple Users"
          value={coupleUsersCount}
          description="Registered couples on the platform"
          icon={
            <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          }
          color="cyan"
          link="/admin/manage-couple-users"
        />
        
        <StatCard
          title="Total Partner Users"
          value={partnerUsersCount}
          description="Registered partners and vendors"
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          }
          color="blue"
          link="/admin/manage-partner-users"
        />

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Platform Status</p>
              <p className="text-2xl font-bold">Active</p>
              <p className="text-purple-100 text-sm mt-1">All systems operational</p>
            </div>
            <div className="p-3 rounded-xl bg-white/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickActionCard
            title="Create New Couple User"
            description="Add a new couple to the platform and set up their account"
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0H3z"></path>
              </svg>
            }
            color="green"
            link="/admin/create-user"
          />
          
          <QuickActionCard
            title="Manage Partner Users"
            description="View and manage partner accounts, verify new partners"
            icon={
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            }
            color="orange"
            link="/admin/manage-partner-users"
          />
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <span className="text-sm text-gray-500">Coming soon</span>
        </div>
        <div className="text-center py-8">
          <div className="p-4 bg-gray-50 rounded-xl w-fit mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
          <p className="text-gray-500">Activity tracking will be available soon</p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;