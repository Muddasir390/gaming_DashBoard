"use client";

import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import {
  Filter,
  Users,
  BarChart2,
  Clock,
  User,
  Search,
} from "lucide-react";
import { useGetRetentionData } from "../public/DashBoard/useGetRetentionData";
import { useGetReactivationRate } from "../public/Retention/useGetReactivationRate";
import { useGetChurnRate } from "../public/Retention/useGetChurnRate";
import { useGetAverageSessionsLength } from "../public/Retention/useGetAverageSessionsLength";
import { useGetActiveUsersCurrentWeek } from "../public/Retention/useGetActiveUsersCurrentWeek";
import LineChartComp from "../components/LineChartComp";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import moment from "moment";

interface Dates {
  startDate: string;
  endDate: string;
  inactivityDays: string;
}

const Retention = () => {
  const today = new Date();
  const calculatedEndDate = today.toISOString().split("T")[0];
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(today.getDate() - 15);
  const calculatedStartDate = fifteenDaysAgo.toISOString().split("T")[0];

  const [selectedDay, setSelectedDay] = useState<string>("monthly");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("weekly");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    fifteenDaysAgo,
    today,
  ]);
  const [selectedRange, setSelectedRange] = useState<string>("15 Days");
  const [inactivityDays, setInactivityDays] = useState<string>("1");
  const [dates, setDates] = useState<Dates>({
    startDate: calculatedStartDate,
    endDate: calculatedEndDate,
    inactivityDays: "1",
  });
  const [dateError, setDateError] = useState<string>("");
  const [inactivityDaysError, setInactivityDaysError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 10;

  const [startDate, endDate] = dateRange;

  const { retentionData, retentionLoading } = useGetRetentionData(
    `${selectedDay}-${selectedPeriod}`.toLowerCase()
  );

  const {
    reactivationRateRefetch,
    reactivationRateIsLoading,
    reactivationRateData,
    reactivationRateIsError,
  } = useGetReactivationRate(dates);

  const {
    churnRateRefetch,
    churnRateIsLoading,
    churnRateData,
    churnRateIsError,
  } = useGetChurnRate(dates);

  const {
    averageSessionsLengthRefetch,
    averageSessionsLengthIsLoading,
    averageSessionsLengthData,
    averageSessionsLengthIsRefetching,
  } = useGetAverageSessionsLength();

  const {
    activeUsersCurrentWeekRefetch,
    activeUsersCurrentWeekIsLoading,
    activeUsersCurrentWeekData,
    activeUsersCurrentWeekIsRefetching,
  } = useGetActiveUsersCurrentWeek();

  // Update dates for API calls
  useEffect(() => {
    if (startDate && endDate) {
      setDates((prev) => ({
        ...prev,
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
      }));
    }
  }, [startDate, endDate]);

  // Validate inactivityDays
  useEffect(() => {
    const inactivityNum = parseInt(inactivityDays, 10);
    if (!inactivityDays || isNaN(inactivityNum)) {
      setInactivityDaysError("Inactivity days must be a valid number.");
    } else if (inactivityNum < 1) {
      setInactivityDaysError("Inactivity days must be at least 1.");
      setInactivityDays("1");
    } else if (inactivityNum > 365) {
      setInactivityDaysError("Inactivity days cannot exceed 365.");
      setInactivityDays("365");
    } else {
      setInactivityDaysError("");
      setDates((prev) => ({ ...prev, inactivityDays }));
    }
  }, [inactivityDays]);

  // Refetch data if missing
  useEffect(() => {
    if (!reactivationRateData) {
      reactivationRateRefetch();
    }
    if (!churnRateData) {
      churnRateRefetch();
    }
    if (!averageSessionsLengthData) {
      averageSessionsLengthRefetch();
    }
    if (!activeUsersCurrentWeekData) {
      activeUsersCurrentWeekRefetch();
    }
  }, [
    reactivationRateData,
    churnRateData,
    averageSessionsLengthData,
    activeUsersCurrentWeekData,
    reactivationRateRefetch,
    churnRateRefetch,
    averageSessionsLengthRefetch,
    activeUsersCurrentWeekRefetch,
  ]);

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const range = e.target.value;
    setSelectedRange(range);

    if (range === "Custom") {
      setDateRange([null, null]);
      setDates((prev) => ({
        ...prev,
        startDate: calculatedStartDate,
        endDate: calculatedEndDate,
      }));
      return;
    }

    const days = parseInt(range.split(" ")[0]);
    const newStartDate = new Date();
    newStartDate.setDate(today.getDate() - days);
    setDateRange([newStartDate, today]);
  };

  const handleReset = () => {
    setSelectedDay("monthly");
    setSelectedPeriod("weekly");
    setDateRange([fifteenDaysAgo, today]);
    setSelectedRange("15 Days");
    setInactivityDays("1");
    setDates({
      startDate: calculatedStartDate,
      endDate: calculatedEndDate,
      inactivityDays: "1",
    });
    setDateError("");
    setInactivityDaysError("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const reset =
    selectedDay !== "monthly" ||
    selectedPeriod !== "weekly" ||
    selectedRange !== "15 Days" ||
    (startDate &&
      moment(startDate).format("YYYY-MM-DD") !== calculatedStartDate) ||
    (endDate && moment(endDate).format("YYYY-MM-DD") !== calculatedEndDate) ||
    inactivityDays !== "1" ||
    searchQuery !== "" ||
    currentPage !== 1;

  const RetentionData = () => {
    if (retentionData) {
      let chartData = retentionData?.retention?.length
        ? retentionData.retention.map((item: any) => ({
            date: moment(item?.intervalKey).format("YYYY-MM-DD"),
            Retention: item?.retentionRate?.toFixed(2),
          }))
        : [];
      return chartData;
    }
  };

  // Filtered and paginated users
  const filteredUsers =
    activeUsersCurrentWeekData?.activeUsers?.filter((user: string) =>
      user.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleInactivityDaysChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (value === "" || (numValue >= 1 && numValue <= 365)) {
      setInactivityDays(value);
    } else if (numValue < 1) {
      setInactivityDays("1");
      setInactivityDaysError("Inactivity days must be at least 1.");
    } else if (numValue > 365) {
      setInactivityDays("365");
      setInactivityDaysError("Inactivity days cannot exceed 365.");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-indigo-950">
      <SideBar activeSection="Retention" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />
        <div className="p-4 sm:p-6 space-y-6 flex flex-col gap-4 overflow-auto">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border w-full rounded-xl border border-purple-100 dark:border-indigo-500/30 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-300 dark:to-purple-400">
                Filters
              </h3>
              <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-indigo-400">
                <Filter className="w-4 h-4" />
                Filters Active: {reset ? "Yes" : "No"}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                disabled={!reset}
                className={`px-3 py-1.5 mb-4 flex items-center gap-1.5 rounded-lg border-2 border-purple-100 text-purple-600 hover:bg-purple-50 transition-colors dark:border-indigo-500/30 dark:text-indigo-300 dark:hover:bg-indigo-900/30 ${
                  !reset && "opacity-50 cursor-not-allowed"
                }`}
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
            <div className="flex flex-col justify-between gap-4">
              <div className="flex flex-col flex-wrap lg:flex-row gap-4">
                {/* Date Range Filter */}
                <div className="w-max">
                  <label className="block text-sm font-medium text-gray-800 dark:text-indigo-200 mb-2">
                    Date Range
                  </label>
                  <div className="flex gap-4">
                    <select
                      value={selectedRange}
                      onChange={handleRangeChange}
                      className="min-w-[120px] px-3 py-2 border border-purple-100 dark:border-indigo-500/30 rounded-lg bg-white dark:bg-gray-700 text-purple-600 dark:text-indigo-100 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                    >
                      <option value="1 Day">1 Day</option>
                      <option value="7 Days">7 Days</option>
                      <option value="15 Days">15 Days</option>
                      <option value="Custom">Custom</option>
                    </select>
                    <div className="relative z-50">
                      <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        maxDate={new Date()}
                        dateFormat="d-MMM-YYYY"
                        onChange={(update) => {
                          const [start, end] = update as [Date | null, Date | null];
                          if (start && end && (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) > 15) {
                            toast.info("You can select a maximum of 15 days.");
                            setDateRange([null, null]);
                            setSelectedRange("Custom");
                          } else {
                            setDateRange(update);
                            setSelectedRange("Custom");
                          }
                        }}
                        isClearable
                        placeholderText="Select Date Range"
                        popperClassName="z-50"
                        className="border py-2 px-5 rounded w-full  border-purple-100 dark:border-indigo-500/30  bg-white dark:bg-gray-700 text-purple-600 dark:text-indigo-100 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  {dateError && (
                    <p className="text-red-500 text-sm mt-2">{dateError}</p>
                  )}
                </div>
                {/* Inactivity Days Filter */}
                <div className="w-max">
                  <label className="block text-sm font-medium text-gray-800 dark:text-indigo-200 mb-2">
                    Inactivity Days
                  </label>
                  <input
                    type="number"
                    value={inactivityDays}
                    onChange={(e) => handleInactivityDaysChange(e.target.value)}
                    min="1"
                    max="365"
                    className="min-w-[200px] px-3 py-2 border border-purple-100 dark:border-indigo-500/30 rounded-lg bg-white dark:bg-gray-700 text-purple-600 dark:text-indigo-100 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                  />
                  {inactivityDaysError && (
                    <p className="text-red-500 text-sm mt-2">{inactivityDaysError}</p>
                  )}
                </div>
              </div>
              {(reactivationRateIsError || churnRateIsError) && (
                <p className="text-red-500 text-sm">
                  Error fetching data. Please try again.
                </p>
              )}
              {/* Summary Cards */}
              <div className="flex flex-wrap w-full md:flex-row gap-3">
                {[
                  {
                    title: "Active Users (Current Week)",
                    value: activeUsersCurrentWeekIsLoading ? (
                      <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : (
                      activeUsersCurrentWeekData?.activeUsersCount || 0
                    ),
                    icon: (
                      <Users className="w-6 h-6 text-purple-600 dark:text-indigo-400" />
                    ),
                    gradient:
                      "from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800",
                  },
                  {
                    title: "Reactivation Rate",
                    value: reactivationRateIsLoading ? (
                      <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : reactivationRateData ? (
                      `${reactivationRateData.reactivationRate}`
                    ) : (
                      "0%"
                    ),
                    icon: (
                      <BarChart2 className="w-6 h-6 text-purple-600 dark:text-indigo-400" />
                    ),
                    gradient:
                      "from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800",
                  },
                  {
                    title: "Churn Rate",
                    value: churnRateIsLoading ? (
                      <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : churnRateData ? (
                      `${churnRateData.churnRate}`
                    ) : (
                      "0%"
                    ),
                    icon: (
                      <BarChart2 className="w-6 h-6 text-purple-600 dark:text-indigo-400" />
                    ),
                    gradient:
                      "from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800",
                  },
                  {
                    title: "Average Session Length",
                    value: averageSessionsLengthIsLoading ? (
                      <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : averageSessionsLengthData ? (
                      `${averageSessionsLengthData.averageLength.toFixed(1)} min`
                    ) : (
                      "0 min"
                    ),
                    icon: (
                      <Clock className="w-6 h-6 text-purple-600 dark:text-indigo-400" />
                    ),
                    gradient:
                      "from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800",
                  },
                ].map((card, index) => (
                  <Card
                    key={index}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    gradient={card.gradient}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Reactivation and Churn Metrics */}
          <div className="w-full flex flex-col lg:flex-row gap-4">
            {/* Reactivation Metrics */}
            <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border rounded-xl border border-purple-100 dark:border-indigo-500/30 p-4 sm:p-6 flex-1">
              <h3 className="text-lg font-medium text-gray-800 dark:text-indigo-200 mb-4">
                Reactivation Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-600 dark:text-indigo-400" />
                    <span className="text-gray-700 dark:text-indigo-100">
                      Total Inactive Users
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-indigo-200">
                    {reactivationRateIsLoading ? (
                      <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : (
                      reactivationRateData?.totalInactiveUsers || 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-600 dark:text-indigo-400" />
                    <span className="text-gray-700 dark:text-indigo-100">
                      Reactivated Users
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-indigo-200">
                    {reactivationRateIsLoading ? (
                      <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : (
                      reactivationRateData?.reactivatedUsers || 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in">
                  <div className="flex items-center gap-3">
                    <BarChart2 className="w-5 h-5 text-purple-600 dark:text-indigo-400" />
                    <span className="text-gray-700 dark:text-indigo-100">
                      Reactivation Rate
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-indigo-200">
                    {reactivationRateIsLoading ? (
                      <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : reactivationRateData ? (
                      `${reactivationRateData.reactivationRate}`
                    ) : (
                      "0%"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Churn Metrics */}
            <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border rounded-xl border border-purple-100 dark:border-indigo-500/30 p-4 sm:p-6 flex-1">
              <h3 className="text-lg font-medium text-gray-800 dark:text-indigo-200 mb-4">
                Churn Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-600 dark:text-indigo-400" />
                    <span className="text-gray-700 dark:text-indigo-100">
                      Starting Users
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-indigo-200">
                    {churnRateIsLoading ? (
                      <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : (
                      churnRateData?.startingUsers || 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-600 dark:text-indigo-400" />
                    <span className="text-gray-700 dark:text-indigo-100">
                      Churned Users
                    </span>
                    </div>
                  <span className="font-medium text-gray-800 dark:text-indigo-200">
                    {churnRateIsLoading ? (
                      <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : (
                      churnRateData?.churnedUsers || 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in">
                  <div className="flex items-center gap-3">
                    <BarChart2 className="w-5 h-5 text-purple-600 dark:text-indigo-400" />
                    <span className="text-gray-700 dark:text-indigo-100">
                      Churn Rate
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-indigo-200">
                    {churnRateIsLoading ? (
                      <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : churnRateData ? (
                      `${churnRateData.churnRate}`
                    ) : (
                      "0%"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Retention Chart */}
          <section id="Retention" className="mb-8">
            <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border rounded-xl border dark:border-indigo-500/20 rounded-2xl shadow-md p-6 w-full">
              <div className="flex flex-col justify-start items-start mb-4 gap-3">
                <h3 className="text-lg font-medium dark:text-indigo-200">
                  Retention
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-max">
                    <label className="block text-sm font-medium text-gray-800 dark:text-indigo-200 mb-2">
                      Retention Type
                    </label>
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      className="min-w-[150px] px-3 py-2 border border-purple-100 dark:border-indigo-500/30 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-indigo-100 focus:ring-2 focus:ring-purple-200 focus:border-blue-500">
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                  <div className="w-max">
                    <label className="block text-sm font-medium text-gray-800 dark:text-indigo-200 mb-2">
                      Period
                    </label>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="min-w-[150px] px-3 py-2 border border-purple-100 dark:border-indigo-500/30 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-indigo-100 focus:ring-2 focus:ring-purple-200 focus:ring-offset-blue-500">
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                </div>
              </div>
              {RetentionData() && RetentionData()?.length ? (
                <div className="dark:bg-gray-800/80 dark:p-4 dark:rounded-xl">
                  <LineChartComp data={RetentionData()} isLoading={retentionLoading} rentation={retentionData} />
                </div>
              ) : retentionLoading ? (
                <div className="w-full h-[300px] flex flex-col items-center justify-center space-y-4">
                  <div className="w-full h-[250px] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] dark:from-gray-800 dark:to-indigo-900/40 rounded-lg relative overflow-hidden shadow-md animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f1f5f9] via-[#e2e8f0] to-[#f1f5f9] dark:from-gray-800/90 dark:via-indigo-900/30 dark:to-gray-800/90 animate-[shimmer_1.5s_infinite]">
                    </div>
                    <div className="absolute bottom-0 left-[10%] w-[12%] h-[50%] bg-[#cbd5e1] dark:bg-indigo-600/40 rounded-lg"></div>
                    <div className="absolute bottom-0 left-[20%] w-[12%] h-[70%] bg-[#94a3b8] dark:bg-indigo-500/40 rounded-lg"></div>
                    <div className="absolute bottom-0 left-[40%] w-[12%] h-[40%] bg-[#cbd5e1] dark:bg-indigo-600/40 rounded-lg"></div>
                    <div className="absolute bottom-0 left-[60%] w-[12%] h-[80%] bg-[#94a3b8] dark:bg-indigo-500/40 rounded-lg"></div>
                    <div className="absolute bottom-0 left-[40%] w-[12%] h-[60%] bg-[#cbd5e1] dark:bg-indigo-600/40 rounded-lg"></div>
                  </div>
                  <div className="w-1/3 h-6 bg-[#e2e8f0] dark:bg-indigo-900/50 rounded-md animate-pulse"></div>
                </div>
              ) : (
                <div className="h-[300px] w-full flex items-center justify-center dark:text-gray-400 dark:bg-gray-800/50 rounded-xl">
                  No Record Found
                </div>
              )}
            </div>
          </section>

          {/* Active Users Section */}
          <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border rounded-xl border border-purple-100 dark:border-indigo-500/30 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <h3 className="text-lg font-medium text-gray-800 dark:text-indigo-200">
                Active Users (Current Week)
              </h3>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-purple-100 dark:border-indigo-500/30 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-indigo-100 focus:ring-blue-500 dark:focus:ring-blue-400">
                </input>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-indigo-400" />
              </div>
            </div>
            <div className="overflow-x-auto mb-4">
              <table className="w-full divide-y divide-purple-50 dark:divide-indigo-500/20">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-white">
                      User Name
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50 dark:divide-indigo-500/20">
                  {activeUsersCurrentWeekIsLoading ? (
                    Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <tr
                          key={index}
                          className="border-b border-purple-100 dark:border-indigo-500/30">
                          
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-full animate-pulse" />
                              <div className="w-32 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                            </div>
                          </td>
                        </tr>
                      )
                      )
                    )
                   : (
                    paginatedUsers.map((user: string, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-purple-50 dark:hover:bg-indigo-900/30 transition-colors animate-fade-in"
                      >
                        <td className="py-3 px-4 text-gray-700 dark:text-indigo-100">
                          <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            {user}
                          </div>
                        </td>
                      </tr>
                    )
                  ))}
                  {filteredUsers.length === 0 && !activeUsersCurrentWeekIsLoading && (
                    <tr>
                      <td
                        colSpan={1}
                        className="text-center py-8 text-purple-600 dark:text-indigo-400"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => { handlePageChange(currentPage - 1) }}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg border border-purple-100 dark:border-indigo-500/30 text-purple-dark-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-blue-900/30 transition-colors
                  ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                Previous
              </button>
              <span className="text-gray-700 dark:text-indigo-200">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => { handlePageChange(currentPage + 1) }}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg border border-purple-100 dark:border-indigo-500/30 text-purple-dark-600 dark:text-purple-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors
                  ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                Next Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

const Card = ({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;
  value: string | number | JSX.Element;
  icon: any;
  gradient: string;
}) => (
  <div className={`bg-gradient-to-r ${gradient} border border-purple-100 dark:border-indigo-500/30 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow w-full lg:w-120`}>
    <div className="flex gap-3 items-center justify-between mb-2">
      <p className="text-sm text-gray-700 dark:text-indigo-100">{title}</p>
      {icon}
    </div>
    <p className="text-xl font-semibold dark:text-gray-400">{value}</p>
  </div>
);

export default Retention;