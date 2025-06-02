"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useGetAllUsers } from "../public/DashBoard/useGetAllUsers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';


const Users = () => {
  const [activeSection, setActiveSection] = useState("Users");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null | any, Date | null | any]>([null, null]);
  const [sortField, setSortField] = useState<string>("");
  const [selectedUsertype, setSelectedUserType] = useState<any>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [dropDownDate, setDropDownDate] = useState<any>("")

  const { getUser, usersData, usersLoading } = useGetAllUsers();
  const [startDate, endDate] = dateRange;
  const router = useRouter();
  const status = router?.query?.status

  const reset = selectedUser === "New SignUps" ||  selectedUser === "All" || searchQuery !== "" || selectedUsertype === "online" || selectedUsertype === "offline" || sortField !== ""

  const handleReset=()=>{
    if(reset){
      setSelectedUser("")
      setSearchQuery("")
      setSelectedUserType("")
      getTimestamps()
      setSortField("")
    }
  }

  useEffect(() => {
    if (dateRange && dateRange[1] !== null) {
      let apidata = {
        "filter": selectedUser === "New SignUps" ? "NewSignUps" : "All",
        "from": moment(dateRange[0]).format('YYYY-MM-DD'),
        "to": moment(dateRange[1]).format('YYYY-MM-DD')
      }
      getUser(apidata)
    }
  }, [dateRange[1]])

  useEffect(() => {
    if (status) {
      setSelectedUserType(status)
    }
  }, [status])

  useEffect(() => {
    getTimestamps()
  }, [])

  const filteredUsers = usersData?.users?.filter((user: any) =>
    user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) && user?.online === (selectedUsertype === "online" ? true : false)
  );


  const sortedUsers = React.useMemo(() => {
    if (!filteredUsers || !sortField) return filteredUsers;

    return [...filteredUsers].sort((a, b) => {
      if (sortField === "timeSpent") {
        const aValue = a.timeSpentPastWeek || 0;
        const bValue = b.timeSpentPastWeek || 0;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      if (sortField === "creationDate") {
        const aValue = new Date(a.creationDate).getTime();
        const bValue = new Date(b.creationDate).getTime();
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      if (sortField === "points") {
        const aValue = a.points || 0;
        const bValue = b.points || 0;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [filteredUsers, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIndicator = (field: string) => {
    if (sortField !== field) {
      return <span className="ml-1 font-bold text-lg">↕</span>;
    }
    return sortDirection === "asc" ? <span className="ml-1 font-bold text-lg">↑</span> : <span className="ml-1 font-bold text-lg">↓</span>;
  };

  const getSelectedUsers = (value: any) => {
    setSelectedUser(value)
    let apidata = {
      "filter": value === "New SignUps" ? "NewSignUps" : "All",
      "from": moment(dateRange[0]).format('YYYY-MM-DD'),
      "to": moment(dateRange[1]).format('YYYY-MM-DD')
    }
    getUser(apidata)
  }

  const totalUsers = sortedUsers?.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedUsers = sortedUsers?.slice(startIndex, endIndex);

  function getTimestamps() {
    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - 15);
    setDateRange([pastDate, currentDate])
  }

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
    setDropDownDate(data)
    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    if (data === 'Last 7 days') {
      pastDate.setDate(currentDate.getDate() - 7);
    }
    else if (data === 'Last 15 days') {
      pastDate.setDate(currentDate.getDate() - 15);
    }
    else if (data === 'Today') {
      pastDate.setDate(currentDate.getDate());
    }
    else if (data === 'Yesterday') {
      pastDate.setDate(currentDate.getDate() - 1);
    }
    setDateRange([pastDate, currentDate])
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-indigo-950">
      <SideBar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border dark:border-indigo-500/20 rounded-2xl shadow-xl p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-300 dark:to-purple-400">
                Players List
              </h1>
            </div>
            <div className="flex justify-end">
            <button
              onClick={() => handleReset()}
              className={`px-3 py-1.5 mb-4 flex items-center gap-1.5 rounded-lg border-2 border-purple-100 text-purple-600 hover:bg-purple-50 transition-colors dark:border-indigo-500/30 dark:text-indigo-300 dark:hover:bg-indigo-900/30 ${!reset && 'opacity-50 cursor-not-allowed'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span className="text-sm font-medium">Reset Filters</span>
            </button>
            </div>


            <div className="mb-6 flex flex-row flex-wrap gap-2 justify-start items-start ">
              <input
                type="text"
                placeholder="Search Players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 max-w-44 border-purple-100 rounded-lg focus:outline-none focus:border-purple-500 text-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder:text-purple-300 dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 dark:focus:ring-2 dark:focus:ring-indigo-500/40 dark:placeholder:text-indigo-300/50"
              />
              <select
                onChange={(e) => getSelectedUsers(e.target.value)}
                className="w-full ml-6 bg-transparent px-4 py-2 border-2 max-w-44 border-purple-100 rounded-lg focus:outline-none focus:border-purple-500 text-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder:text-purple-300 dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 dark:focus:ring-2 dark:focus:ring-indigo-500/40"
                defaultValue=""
                value={selectedUser}
              >
                <option value="" disabled>Select User Type</option>
                <option>New SignUps</option>
                <option>All</option>
              </select>

              <select
                value={selectedUsertype}
                onChange={(e) => setSelectedUserType(e.target.value)}
                className="w-full ml-6 bg-transparent px-4 py-2 border-2 max-w-52 border-purple-100 rounded-lg focus:outline-none focus:border-purple-500 text-purple-500 focus:ring-2 focus:ring-purple-200 transition-all dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 dark:focus:ring-2 dark:focus:ring-indigo-500/40"
              >
                <option value="default">All Users</option>
                <option value="online">Online Users</option>
                <option value="offline">Offline Users</option>
              </select>

              {selectedUser === 'New SignUps' && (
                <>
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="d-MMM-YYYY"
                    onChange={(update) => {
                      [setDateRange(update as [Date | null, Date | null]), setDropDownDate("")];
                    }}
                    isClearable
                    placeholderText="Select Date Range"
                    className="w-full ml-6 bg-transparent px-4 py-2 border-2 max-w-64 border-purple-100 rounded-lg focus:outline-none focus:border-purple-500 text-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder:text-purple-300 dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 dark:focus:ring-2 dark:focus:ring-indigo-500/40 dark:placeholder:text-indigo-300/50"
                  />
                  <select
                    onChange={(e) => selectDays(e.target.value)}
                    className="w-full ml-6 bg-transparent px-4 py-2 border-2 max-w-64 border-purple-100 rounded-lg focus:outline-none focus:border-purple-500 text-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder:text-purple-300 dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 dark:focus:ring-2 dark:focus:ring-indigo-500/40"
                    // defaultValue={dropDownDate}
                    value={dropDownDate}
                  >
                    <option value="" disabled>Please select days</option>
                    <option value="Today">Today</option>
                    <option value="Yesterday">Yesterday</option>
                    <option value="Last 7 days" >Last 7 days</option>
                    <option value="Last 15 days">Last 15 days</option>
                  </select>
                </>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-50 dark:divide-indigo-500/20">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Player
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("timeSpent")}
                    >
                      Time Spent {renderSortIndicator("timeSpent")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("creationDate")}
                    >
                      Creation Date {renderSortIndicator("creationDate")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("points")}
                    >
                      Points {renderSortIndicator("points")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800/80 divide-y divide-purple-50 dark:divide-indigo-500/20">
                  {usersLoading ? (
                    Array.from({ length: itemsPerPage }).map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-purple-100 dark:bg-indigo-600/40 rounded-full"></div>
                            <div className="ml-4">
                              <div className="h-3 bg-purple-100 dark:bg-indigo-600/20 rounded w-32"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-3 bg-purple-100 dark:bg-indigo-600/20 rounded w-full"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-3 bg-purple-100 dark:bg-indigo-600/20 rounded w-full"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-3 bg-purple-100 dark:bg-indigo-600/20 rounded w-full"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-3 bg-purple-100 dark:bg-indigo-600/20 rounded w-full"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="h-3 bg-purple-100 dark:bg-indigo-600/20 rounded w-24 float-right"></div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    displayedUsers && displayedUsers?.length ? (
                      displayedUsers?.map((user: any) => (
                        <tr
                          onClick={() => router.push(`/specificUserDetail?name=${user?.username}`)}
                          key={user.id}
                          className="hover:bg-purple-50 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 cursor-pointer relative">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 dark:from-indigo-500 dark:to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                  {user?.username?.[0]?.toUpperCase()}
                                </div>
                                <span
                                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${user.online ? "bg-green-500" : "bg-gray-200 dark:bg-gray-600"
                                    }`}
                                ></span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-800 dark:text-indigo-200">{user.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700 dark:text-indigo-100">{user?.email ? user?.email : "--"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700 dark:text-indigo-100">{user?.timeSpentPastWeek} Hours</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700 dark:text-indigo-100">
                              {moment(user?.creationDate).format('DD-MMM-YYYY')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700 dark:text-indigo-100">{user?.points}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={(e) => [e.stopPropagation(), router.push(`userDetail?name=${user.username}`)]}
                              className="inline-flex items-center space-x-1 group text-purple-600 dark:text-indigo-400 hover:text-purple-800 dark:hover:text-indigo-300 transition-colors"
                            >
                              <span className="text-sm font-medium">View Journey</span>
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <span className="font-medium dark:text-indigo-200">No Record Found.</span>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-600 dark:text-indigo-300">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border-2 border-purple-100 rounded-lg text-sm bg-white focus:border-purple-500 dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30"
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
                  className="px-3 py-1 border-2 border-purple-100 rounded-lg hover:bg-purple-50 disabled:opacity-50 transition-colors text-sm dark:border-indigo-500/30 dark:hover:bg-indigo-900/30 dark:text-indigo-200"
                >
                  ← Prev
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg transition-all text-sm ${currentPage === page
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white'
                      : 'border-2 border-purple-100 hover:bg-purple-50 dark:border-indigo-500/30 dark:hover:bg-indigo-900/30 dark:text-indigo-200'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border-2 border-purple-100 rounded-lg hover:bg-purple-50 disabled:opacity-50 transition-colors text-sm dark:border-indigo-500/30 dark:hover:bg-indigo-900/30 dark:text-indigo-200"
                >
                  Next →
                </button>
              </div>

              <span className="text-sm text-purple-600 dark:text-indigo-300">
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