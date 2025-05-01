"use client";

import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useGetUserJourney } from "../public/DashBoard/useGetUserJouney";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

interface EventData {
  _id?: string;
  userID: string;
  eventType: number;
  eventData?: any;
  eventTime: string;
  __v: number;
}

const UserDetail = () => {
  const router = useRouter();
  const { name } = router.query;
  const { userJourney, userJourneyData, userJourneyLoading } = useGetUserJourney();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [journeyDate, setJourneyDate] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = journeyDate;

  useEffect(() => {
    getTimestamps();
  }, []);

  function getTimestamps() {
    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - 15);
    setJourneyDate([pastDate, currentDate]);
  }

  useEffect(() => {
    if (journeyDate && journeyDate[1] !== null && name) {
      let apiData = {
        "userID": name,
        "eventTime": {
          "$gte": moment(journeyDate[0]).format('YYYY-MM-DD'),
          "$lte": moment(journeyDate[1]).format('YYYY-MM-DD')
        }
      };
      userJourney(apiData);
    }
  }, [journeyDate[1], name]);
  
  const dates = userJourneyData?.eventRes
    ? Object.keys(userJourneyData?.eventRes).sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
      ) 
    : [];

  const getFilteredEvents = () => {
    if (!userJourneyData?.eventRes) return [];
    if (selectedDate === "all") {
      return Object.values(userJourneyData?.eventRes).flat();
    }
    return userJourneyData?.eventRes[selectedDate] || [];
  };

  const filteredEvents = getFilteredEvents();
  const totalItems = filteredEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredEvents.slice(startIndex, endIndex);

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

  function selectDays(data: string) {
    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    if (data === 'Last 7 days') {
      pastDate.setDate(currentDate.getDate() - 7);
    }
    else if (data === 'Last 15 days') {
      pastDate.setDate(currentDate.getDate() - 15);
    }
    setJourneyDate([pastDate, currentDate]);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-indigo-950">
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />
        <div className="p-6 flex-1 overflow-y-auto w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-purple-50 dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border dark:border-indigo-500/20">
            <div className="px-6 py-3 border-b border-purple-50 dark:border-indigo-500/20 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="flex items-center w-full md:w-auto">
                  <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-800 dark:text-indigo-300 dark:hover:text-indigo-100 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    <span className="text-sm font-medium">Back</span>
                  </button>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-4">
                    User Journey Details
                  </h2>
                </div>
                
                <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
                  <select
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-9 px-3 border border-purple-200 rounded-md text-sm bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none flex-grow md:flex-grow-0 max-w-64 dark:bg-gray-700 dark:border-indigo-500/30 dark:text-indigo-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                  >
                    <option value="all">All Dates</option>
                    {dates.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="d-MMM-YYYY"
                    maxDate={new Date()}
                    onChange={(update) => {
                      setJourneyDate(update as [Date | null, Date | null]);
                    }}
                    isClearable
                    placeholderText="Select Date Range"
                    className="h-9 px-3 border border-purple-200 rounded-md text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none w-full max-w-64 dark:bg-gray-700 dark:border-indigo-500/30 dark:text-indigo-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                  />

                  <select
                    onChange={(e) => selectDays(e.target.value)}
                    className="h-9 px-3 border border-purple-200 rounded-md text-sm bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none flex-grow md:flex-grow-0 max-w-64 dark:bg-gray-700 dark:border-indigo-500/30 dark:text-indigo-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select days
                    </option>
                    <option>Last 7 days</option>
                    <option>Last 15 days</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-50 dark:divide-indigo-500/20">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-800 dark:to-indigo-900">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Event Date & Time</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Event Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">UI Element Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Event Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Room Name</th>
                  </tr>
                </thead>
                
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-purple-50 dark:divide-indigo-500/20">
                  {userJourneyLoading ? (
                    Array.from({ length: itemsPerPage }).map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        <td className="px-4 py-2"><div className="h-3 bg-purple-100 dark:bg-indigo-800/50 rounded"></div></td>
                        <td className="px-4 py-2"><div className="h-3 bg-purple-100 dark:bg-indigo-800/50 rounded"></div></td>
                        <td className="px-4 py-2"><div className="h-3 bg-purple-100 dark:bg-indigo-800/50 rounded"></div></td>
                        <td className="px-4 py-2"><div className="h-3 bg-purple-100 dark:bg-indigo-800/50 rounded w-3/4"></div></td>
                        <td className="px-4 py-2"><div className="h-3 bg-purple-100 dark:bg-indigo-800/50 rounded"></div></td>
                      </tr>
                    ))
                  ) : currentData.map((event: any, index: number) => (
                    <tr key={index} className="hover:bg-purple-50 dark:hover:bg-indigo-900/30 transition-colors">
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-700 dark:text-indigo-200 font-mono">
                        {moment(event?.eventTime).format('DD-MMM-YYYY') || "--"}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-600 dark:text-indigo-200">
                        {event?.eventData?.eventName || "--"}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-600 dark:text-indigo-200">
                        {event?.eventData?.UIElementName || "--"}
                      </td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-purple-800 dark:from-indigo-900/40 dark:to-indigo-800/40 dark:text-indigo-200">
                          {event?.eventData?.eventType === "0" && "Api Call"}
                          {event?.eventData?.eventType === "1" && "UI Interaction"}
                          {event?.eventData?.eventType === "2" && "In Game Event"}
                          {!event?.eventData?.eventType && "--"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-600 dark:text-indigo-200">
                        { event?.eventData?.RoomName || "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {(currentData.length === 0 && !userJourneyLoading) && (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-indigo-300 text-sm">No events found for this user</p>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-purple-50 dark:border-indigo-500/20 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-600 dark:text-indigo-300">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-8 px-2 border border-purple-200 rounded-md text-xs bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none dark:bg-gray-700 dark:border-indigo-500/30 dark:text-indigo-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                >
                  {[10, 25, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border border-purple-200 rounded-md hover:bg-purple-50 disabled:opacity-50 transition-colors text-xs dark:border-indigo-500/30 dark:hover:bg-indigo-900/30 dark:text-indigo-200"
                >
                  ← Prev
                </button>
                
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 py-1 rounded-md transition-all text-xs ${
                      currentPage === page 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white dark:from-indigo-600 dark:to-indigo-900'
                        : 'border border-purple-200 hover:bg-purple-50 dark:border-indigo-500/30 dark:hover:bg-indigo-900/30 dark:text-indigo-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border border-purple-200 rounded-md hover:bg-purple-50 disabled:opacity-50 transition-colors text-xs dark:border-indigo-500/30 dark:hover:bg-indigo-900/30 dark:text-indigo-200"
                >
                  Next →
                </button>
              </div>

              <div className="flex items-center">
                <span className="text-xs text-purple-600 dark:text-indigo-300">
                  Page {currentPage} of {totalPages || 1}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;