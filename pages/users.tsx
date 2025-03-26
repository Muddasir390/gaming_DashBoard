"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useGetAllUsers } from "../public/DashBoard/useGetAllUsers";

const Users = () => {
  const [activeSection, setActiveSection] = useState("Users");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const { usersData, usersLoading } = useGetAllUsers();
  const router = useRouter();


  const filteredUsers = usersData?.users?.filter((user: any) =>
    user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-purple-100">
      <SideBar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">

            <div className="mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Players List
              </h1>
            </div>


            <div className="mb-6">
              <input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-purple-100 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder:text-purple-300"
              />
            </div>


            <div className="border-2 border-purple-50 rounded-lg overflow-hidden shadow-sm mb-4">
              <div className="grid grid-cols-2 bg-gradient-to-r from-blue-500 to-purple-600 p-3">
                <span className="font-semibold text-white text-sm">Player</span>
                <span className="font-semibold text-white text-sm">Journey</span>
              </div>


              {usersLoading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <div key={index} className="grid grid-cols-2 p-3 border-b border-purple-50 animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="h-6 w-6 bg-purple-100 rounded-full"></div>
                      <div className="h-3 bg-purple-100 rounded w-32"></div>
                    </div>
                    <div className="h-3 bg-purple-100 rounded w-24"></div>
                  </div>
                ))
              ) : (
                <div className="divide-y divide-purple-50">
                  {displayedUsers.map((user: any) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-2 p-3 hover:bg-purple-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {user?.username?.[0]?.toUpperCase()}
                          </div>
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.online ? "bg-green-500" : "bg-gray-200"
                              }`}
                          ></span>
                        </div>
                        <span className="text-gray-800 text-sm font-medium">
                          {user.username}
                        </span>
                      </div>
                      <button
                        onClick={() => router.push(`userDetail?name=${user.username}`)}
                        className="flex items-center justify-end space-x-1 group"
                      >
                        <span className="text-purple-600 group-hover:text-purple-800 text-sm font-medium transition-colors">
                          View Journey
                        </span>
                        <svg
                          className="w-3 h-3 text-purple-600 group-hover:text-purple-800 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-600">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border-2 border-purple-100 rounded-lg text-sm bg-white focus:border-purple-500"
                >
                  {[10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border-2 border-purple-100 rounded-lg hover:bg-purple-50 disabled:opacity-50 transition-colors text-sm"
                >
                  ← Prev
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg transition-all text-sm ${currentPage === page
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'border-2 border-purple-100 hover:bg-purple-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border-2 border-purple-100 rounded-lg hover:bg-purple-50 disabled:opacity-50 transition-colors text-sm"
                >
                  Next →
                </button>
              </div>

              <span className="text-sm text-purple-600">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;