"use client";

import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { Download, Filter, Search } from "lucide-react";
import { useGetUTMInfo } from "../public/Awareness/useGetUTMInfo";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import moment from "moment";

interface Dates {
  startDate: string;
  endDate: string;
}

const Awareness = () => {
  const today = new Date();
  const calculatedEndDate = today.toISOString().split("T")[0];
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(today.getDate() - 15);
  const calculatedStartDate = fifteenDaysAgo.toISOString().split("T")[0];

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    fifteenDaysAgo,
    today,
  ]);
  const [selectedRange, setSelectedRange] = useState<string>("15 Days");
  const [dates, setDates] = useState<Dates>({
    startDate: calculatedStartDate,
    endDate: calculatedEndDate,
  });
  const [dateError, setDateError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [firstVisitNumber, setFirstVisitNumber] = useState(0);
  const [zoaverseDownloadNumber, setZoaverseDownload] = useState(0);

  const [startDate, endDate] = dateRange;

  const { utmInfoRefetch, utmInfoIsLoading, utmInfoData, utmInfoIsError } =
    useGetUTMInfo(dates);

  // Update dates for API calls
  useEffect(() => {
    if (startDate && endDate) {
      setDates({
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
      });
    }
  }, [startDate, endDate]);

  // Refetch data if missing
  useEffect(() => {
    if (!utmInfoData && !utmInfoIsLoading) {
      utmInfoRefetch();
    }
  }, [utmInfoData]);

  const filteredEvents =
    utmInfoData?.responseData?.filter(([event]: [string, string]) =>
      event.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  // Update first visit and download numbers
  useEffect(() => {
    const firstVisitValue = filteredEvents?.find(
      (val: any) => val[0] === "first_visit"
    );
    const zoaverse_downloadValue = filteredEvents?.find(
      (val: any) => val[0] === "zoaverse_download"
    );
    firstVisitValue ? setFirstVisitNumber(firstVisitValue[1]) : setFirstVisitNumber(0);
    zoaverse_downloadValue
      ? setZoaverseDownload(zoaverse_downloadValue[1])
      : setZoaverseDownload(0);
  }, [filteredEvents]);

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const range = e.target.value;
    setSelectedRange(range);

    if (range === "Custom") {
      setDateRange([null, null]);
      setDates({ startDate: calculatedStartDate, endDate: calculatedEndDate });
      return;
    }

    const days = parseInt(range.split(" ")[0]);
    const newStartDate = new Date();
    newStartDate.setDate(today.getDate() - days);
    setDateRange([newStartDate, today]);
  };

  const handleReset = () => {
    setDateRange([fifteenDaysAgo, today]);
    setSelectedRange("15 Days");
    setDates({ startDate: calculatedStartDate, endDate: calculatedEndDate });
    setDateError("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const reset =
    selectedRange !== "15 Days" ||
    (startDate &&
      moment(startDate).format("YYYY-MM-DD") !== calculatedStartDate) ||
    (endDate && moment(endDate).format("YYYY-MM-DD") !== calculatedEndDate) ||
    searchQuery !== "" ||
    currentPage !== 1;

  // Filtered and paginated data
  const filteredUTMs =
    utmInfoData?.utmResponseData?.filter(([utm]: [string, string]) =>
      utm.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const totalEventPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const totalUTMPages = Math.ceil(filteredUTMs.length / itemsPerPage);

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedUTMs = filteredUTMs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number, totalPages: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-indigo-950">
      <SideBar activeSection="Awareness" />
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
                        className="border py-2 px-5  w-full  border-purple-100 dark:border-indigo-500/30 rounded-lg bg-white dark:bg-gray-700 text-purple-600 dark:text-indigo-100 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  {dateError && (
                    <p className="text-red-500 text-sm mt-2">{dateError}</p>
                  )}
                </div>
              </div>
              {utmInfoIsError && (
                <p className="text-red-500 text-sm">
                  Error fetching data. Please try again.
                </p>
              )}
            </div>
            <div className="mt-5">
              <Card
                key={"22"}
                title={"Download Rate"}
                value={
                  utmInfoIsLoading ? (
                    <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                  ) : firstVisitNumber && zoaverseDownloadNumber ? (
                    `${((zoaverseDownloadNumber / firstVisitNumber) * 100).toFixed(2)} %`
                  ) : (
                    "0 %"
                  )
                }
                icon={<Download />}
                gradient={
                  "from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800"
                }
              />
            </div>
          </div>
          <div className="flex max-lg:flex-wrap lg:flex-row w-full gap-4">
            {/* Event Statistics */}
            <div className="bg-white dark:bg-gray-800/90 w-full dark:backdrop-blur-sm dark:border rounded-xl border border-purple-100 dark:border-indigo-500/30 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h3 className="text-lg font-medium text-gray-800 dark:text-indigo-200">
                  Event Statistics
                </h3>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-purple-100 dark:border-indigo-500/30 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-indigo-100 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-indigo-400" />
                </div>
              </div>
              <div className="overflow-x-auto mb-4">
                <table className="w-full divide-y divide-purple-50 dark:divide-indigo-500/20">
                  <thead className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-white">
                        Event
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-white">
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50 dark:divide-indigo-500/20">
                    {utmInfoIsLoading ? (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <tr
                            key={index}
                            className="border-b border-purple-100 dark:border-indigo-500/30"
                          >
                            <td className="py-3 px-4">
                              <div className="w-32 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="w-16 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse ml-auto" />
                            </td>
                          </tr>
                        ))
                    ) : (
                      paginatedEvents.map(
                        ([event, count]: [string, string], index: number) => (
                          <tr
                            key={index}
                            className="hover:bg-purple-50 dark:hover:bg-indigo-900/30 transition-colors animate-fade-in"
                          >
                            <td className="py-3 px-4 text-gray-700 dark:text-indigo-100">
                              {event}
                            </td>
                            <td className="py-3 px-4 text-right font-medium text-gray-800 dark:text-indigo-200">
                              {count}
                            </td>
                          </tr>
                        )
                      )
                    )}
                    {!utmInfoIsLoading && filteredEvents.length === 0 && (
                      <tr>
                        <td
                          colSpan={2}
                          className="text-center py-8 text-purple-600 dark:text-indigo-400"
                        >
                          No events found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {totalEventPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() =>
                      handlePageChange(currentPage - 1, totalEventPages)
                    }
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-lg border border-purple-100 dark:border-indigo-500/30 text-purple-600 dark:text-indigo-300 hover:bg-purple-50 dark:hover:bg-indigo-900/30 transition-colors ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 dark:text-indigo-200">
                    Page {currentPage} of {totalEventPages}
                  </span>
                  <button
                    onClick={() =>
                      handlePageChange(currentPage + 1, totalEventPages)
                    }
                    disabled={currentPage === totalEventPages}
                    className={`px-3 py-1.5 rounded-lg border border-purple-100 dark:border-indigo-500/30 text-purple-600 dark:text-indigo-300 hover:bg-purple-50 dark:hover:bg-indigo-900/30 transition-colors ${
                      currentPage === totalEventPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* UTM Source Statistics */}
            <div className="bg-white w-full dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border rounded-xl border border-purple-100 dark:border-indigo-500/30 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h3 className="text-lg font-medium text-gray-800 dark:text-indigo-200">
                  UTM Source Statistics
                </h3>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search UTM sources..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-purple-100 dark:border-indigo-500/30 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-indigo-100 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-indigo-400" />
                </div>
              </div>
              <div className="overflow-x-auto mb-4">
                <table className="w-full divide-y divide-purple-50 dark:divide-indigo-500/20">
                  <thead className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-white">
                        UTM Source
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-white">
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50 dark:divide-indigo-500/20">
                    {utmInfoIsLoading ? (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <tr
                            key={index}
                            className="border-b border-purple-100 dark:border-indigo-500/30"
                          >
                            <td className="py-3 px-4">
                              <div className="w-32 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="w-16 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse ml-auto" />
                            </td>
                          </tr>
                        ))
                    ) : (
                      paginatedUTMs.map(
                        ([utm, count]: [string, string], index: number) => (
                          <tr
                            key={index}
                            className="hover:bg-purple-50 dark:hover:bg-indigo-900/30 transition-colors animate-fade-in"
                          >
                            <td className="py-3 px-4 text-gray-700 dark:text-indigo-100">
                              {utm}
                            </td>
                            <td className="py-3 px-4 text-right font-medium text-gray-800 dark:text-indigo-200">
                              {count}
                            </td>
                          </tr>
                        )
                      )
                    )}
                    {!utmInfoIsLoading && filteredUTMs.length === 0 && (
                      <tr>
                        <td
                          colSpan={2}
                          className="text-center py-8 text-purple-600 dark:text-indigo-400"
                        >
                          No UTM sources found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {totalUTMPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() =>
                      handlePageChange(currentPage - 1, totalUTMPages)
                    }
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-lg border border-purple-100 dark:border-indigo-500/30 text-purple-600 dark:text-indigo-300 hover:bg-purple-50 dark:hover:bg-indigo-900/30 transition-colors ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 dark:text-indigo-200">
                    Page {currentPage} of {totalUTMPages}
                  </span>
                  <button
                    onClick={() =>
                      handlePageChange(currentPage + 1, totalUTMPages)
                    }
                    disabled={currentPage === totalUTMPages}
                    className={`px-3 py-1.5 rounded-lg border border-purple-100 dark:border-indigo-500/30 text-purple-600 dark:text-indigo-300 hover:bg-purple-50 dark:hover:bg-indigo-900/30 transition-colors ${
                      currentPage === totalUTMPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
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
  icon: React.ReactNode;
  gradient: string;
}) => (
  <div
    className={`bg-gradient-to-r ${gradient} border border-purple-100 dark:border-indigo-500/30 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow w-full lg:w-52`}
  >
    <div className="flex gap-3 items-center justify-between mb-2">
      <p className="text-sm text-gray-700 dark:text-indigo-100">{title}</p>
      {icon}
    </div>
    <p className="text-xl font-bold text-gray-800 dark:text-indigo-200">
      {value}
    </p>
  </div>
);

export default Awareness;