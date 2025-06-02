"use client";

import React, { useEffect, useMemo, useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useGetLauncherAndZoaverseDetails } from "../public/Acquisition/useGetLauncherAndZoaverseDetails";
import { useGetlauncherInstallDetails } from "../public/Acquisition/useGetLauncherInstallDetails";
import { useGetPurchaseRate } from "../public/Acquisition/useGetPurchaseRate.js";
import { useGetTotalDownloads } from "../public/Acquisition/useGetTotalDownloads.js";
import {
  Filter,
  Download,
  Monitor,
  Apple,
  Smartphone,
  CreditCard,
  Users,
  BarChart2,
  DownloadIcon,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import moment from "moment";

interface Dates {
  startDate: string;
  endDate: string;
}

const Acquisition = () => {
  const today = new Date();
  const calculatedEndDate = today.toISOString().split("T")[0];
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(today.getDate() - 15);
  const calculatedStartDate = fifteenDaysAgo.toISOString().split("T")[0];

  const [productFilter, setProductFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [versionFilter, setVersionFilter] = useState<string>("all");
  const [downloadToInstallRate, setDownloadToInstallRate] = useState<string>("0");
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

  const [startDate, endDate] = dateRange;

  const {
    launcherAndZoaverseDetailsRefetch,
    launcherAndZoaverseDetailsIsLoading,
    launcherAndZoaverseDetailsData,
    launcherAndZoaverseDetailsIsError,
  } = useGetLauncherAndZoaverseDetails(dates);

  const {
    launcherInstallDetailsRefetch,
    launcherInstallDetailsIsLoading,
    launcherInstallDetailsData,
    launcherInstallDetailsIsError,
  } = useGetlauncherInstallDetails(dates);

  const {
    purchaseRateRefetch,
    purchaseRateIsLoading,
    purchaseRateData,
  } = useGetPurchaseRate();

  const {
    totalDownloadsRefetch,
    totalDownloadsIsLoading,
    totalDownloadsData,
  } = useGetTotalDownloads();

  useEffect(() => {
    if (startDate && endDate) {
      setDates({
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
      });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (
      totalDownloadsData &&
      totalDownloadsData?.length > 0 &&
      launcherAndZoaverseDetailsData
    ) {
      const totalInstall = launcherAndZoaverseDetailsData?.totalInstalls || 0;
      const totalDownloads = totalDownloadsData?.reduce(
        (acc: number, a: { count: number }) => acc + a.count,
        0
      );
      const rate =
        totalDownloads > 0
          ? ((totalInstall / totalDownloads) * 100).toFixed(2)
          : "0";
      setDownloadToInstallRate(rate);
    }
  }, [totalDownloadsData, launcherAndZoaverseDetailsData]);

  useEffect(() => {
    if (!launcherAndZoaverseDetailsData && !launcherAndZoaverseDetailsIsLoading) {
      launcherAndZoaverseDetailsRefetch();
    }
    if (!launcherInstallDetailsData && !launcherInstallDetailsIsLoading) {
      launcherInstallDetailsRefetch();
    }
    if (!purchaseRateData && !purchaseRateIsLoading) {
      purchaseRateRefetch();
    }
    if (!totalDownloadsData && !totalDownloadsIsLoading) {
      totalDownloadsRefetch();
    }
  }, []);

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
    setProductFilter("all");
    setPlatformFilter("all");
    setVersionFilter("all");
    setSelectedRange("15 Days");
    setDateRange([fifteenDaysAgo, today]);
    setDates({ startDate: calculatedStartDate, endDate: calculatedEndDate });
    setDateError("");
  };

  const reset =
    productFilter !== "all" ||
    platformFilter !== "all" ||
    versionFilter !== "all" ||
    selectedRange !== "15 Days" ||
    (startDate &&
      moment(startDate).format("YYYY-MM-DD") !== calculatedStartDate) ||
    (endDate && moment(endDate).format("YYYY-MM-DD") !== calculatedEndDate);

  const processedLauncherData = useMemo(() => {
    if (!launcherAndZoaverseDetailsData || !launcherAndZoaverseDetailsData.dailyStats) {
      return { filteredStats: [], totalFiltered: 0 };
    }

    let filteredStats = launcherAndZoaverseDetailsData.dailyStats;

    if (productFilter !== "all") {
      filteredStats = filteredStats.filter(
        (stat: any) => stat._id[1]?.toLowerCase() === productFilter.toLowerCase()
      );
    }

    if (platformFilter !== "all") {
      filteredStats = filteredStats.filter(
        (stat: any) => stat._id[0]?.toLowerCase() === platformFilter.toLowerCase()
      );
    }

    const totalFiltered = filteredStats.reduce(
      (sum: number, stat: any) => sum + stat.count,
      0
    );

    return { filteredStats, totalFiltered };
  }, [launcherAndZoaverseDetailsData, productFilter, platformFilter]);

  const processedInstallDetails = useMemo(() => {
    if (!launcherInstallDetailsData || !launcherInstallDetailsData.versionStats) {
      return { filteredStats: [], totalFiltered: 0 };
    }

    let filteredStats = launcherInstallDetailsData.versionStats;

    if (platformFilter !== "all") {
      filteredStats = filteredStats.filter(
        (stat: any) => stat._id[1]?.toLowerCase() === platformFilter.toLowerCase()
      );
    }

    if (versionFilter !== "all") {
      filteredStats = filteredStats.filter(
        (stat: any) => stat._id[0]?.toLowerCase() === versionFilter.toLowerCase()
      );
    }

    const totalFiltered = filteredStats.reduce(
      (sum: number, stat: any) => sum + stat.count,
      0
    );

    return { filteredStats, totalFiltered };
  }, [launcherInstallDetailsData, platformFilter, versionFilter]);

  const processedDownloads = useMemo(() => {
    if (!totalDownloadsData) {
      return { filteredStats: [], totalFiltered: 0 };
    }

    let filteredStats = totalDownloadsData;

    if (platformFilter !== "all") {
      filteredStats = filteredStats.filter(
        (stat: any) =>
          stat._id.platform?.toLowerCase() === platformFilter.toLowerCase()
      );
    }

    if (versionFilter !== "all") {
      filteredStats = filteredStats.filter(
        (stat: any) =>
          stat._id.version?.toLowerCase() === versionFilter.toLowerCase()
      );
    }

    const totalFiltered = filteredStats.reduce(
      (sum: number, stat: any) => sum + stat.count,
      0
    );

    return { filteredStats, totalFiltered };
  }, [totalDownloadsData, platformFilter, versionFilter]);

  const getPlatformIcon = (platform?: string) => {
    switch (platform?.toLowerCase()) {
      case "mac":
        return <Apple className="w-5 h-5 text-purple-600 dark:text-indigo-400" />;
      case "windows":
        return <Monitor className="w-5 h-5 text-purple-600 dark:text-indigo-400" />;
      case "linux":
        return <Smartphone className="w-5 h-5 text-purple-600 dark:text-indigo-400" />;
      default:
        return <Monitor className="w-5 h-5 text-purple-600 dark:text-indigo-400" />;
    }
  };

  const getUniqueVersions = () => {
    const versions = new Set<string>();
    launcherInstallDetailsData?.versionStats?.forEach((stat: any) =>
      versions.add(stat._id[0])
    );
    totalDownloadsData?.forEach((stat: any) => versions.add(stat._id.version));
    return [...versions].sort();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-indigo-950">
      <SideBar activeSection="Acquisition" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />
        <div className="p-4 sm:p-6 space-y-6 flex flex-col gap-4 overflow-auto">
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
                    Product
                  </label>
                  <select
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="min-w-[200px] px-3 py-2 border border-purple-100 dark:border-indigo-500/30 rounded-lg bg-white dark:bg-gray-700 text-purple-600 dark:text-indigo-100 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                  >
                    <option value="all">All Products</option>
                    <option value="zoaverse">Zoaverse</option>
                    <option value="zoalauncher">ZoaLauncher</option>
                  </select>
                </div>
                <div className="w-max">
                  <label className="block text-sm font-medium text-gray-800 dark:text-indigo-200 mb-2">
                    Platform
                  </label>
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="min-w-[200px] px-3 py-2 border border-purple-100 dark:border-indigo-500/30 rounded-lg bg-white dark:bg-gray-700 text-purple-600 dark:text-indigo-100 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                  >
                    <option value="all">All Platforms</option>
                    <option value="mac">macOS</option>
                    <option value="windows">Windows</option>
                    <option value="linux">Linux</option>
                  </select>
                </div>
                <div className="w-max">
                  <label className="block text-sm font-medium text-gray-800 dark:text-indigo-200 mb-2">
                    Launcher Version
                  </label>
                  <select
                    value={versionFilter}
                    onChange={(e) => setVersionFilter(e.target.value)}
                    className="min-w-[200px] px-3 py-2 border border-purple-100 dark:border-indigo-500/30 rounded-lg bg-white dark:bg-gray-700 text-purple-600 dark:text-indigo-100 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                  >
                    <option value="all">All Versions</option>
                    {getUniqueVersions().map((version, index) => (
                      <option key={`version-${index}`} value={version}>
                        {version}
                      </option>
                    ))}
                  </select>
                </div>
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
                        popperClassName="z-50 "
                        className="border py-2 px-5 rounded w-full border-purple-100 dark:border-indigo-500/30 bg-white dark:bg-gray-700 text-purple-600 dark:text-indigo-100 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  {dateError && (
                    <p className="text-red-500 text-sm mt-2">{dateError}</p>
                  )}
                </div>
              </div>
              {(launcherAndZoaverseDetailsIsError ||
                launcherInstallDetailsIsError) && (
                <p className="text-red-500 text-sm">
                  Error fetching data. Please try again.
                </p>
              )}
              <div className="flex flex-wrap w-full md:flex-row gap-3">
                {[
                  {
                    title: "Total Installs",
                    value: launcherAndZoaverseDetailsIsLoading ? (
                      <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : (
                      launcherAndZoaverseDetailsData?.totalInstalls || 0
                    ),
                    icon: (
                      <Download className="w-6 h-6 text-purple-600 dark:text-indigo-400" />
                    ),
                    gradient:
                      "from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800",
                  },
                  {
                    title: "Filtered Installs",
                    value: launcherAndZoaverseDetailsIsLoading ? (
                      <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : (
                      processedLauncherData.totalFiltered
                    ),
                    icon: (
                      <Filter className="w-6 h-6 text-purple-600 dark:text-indigo-400" />
                    ),
                    gradient:
                      "from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800",
                  },
                  {
                    title: "Purchase Rate",
                    value: purchaseRateIsLoading ? (
                      <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : purchaseRateData ? (
                      `${purchaseRateData.purchaseRate.toFixed(2)}%`
                    ) : (
                      "0%"
                    ),
                    icon: (
                      <CreditCard className="w-6 h-6 text-purple-600 dark:text-indigo-400" />
                    ),
                    gradient:
                      "from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800",
                  },
                  {
                    title: "Verified Users",
                    value: purchaseRateIsLoading ? (
                      <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : (
                      purchaseRateData?.verifiedUsers || 0
                    ),
                    icon: (
                      <Users className="w-6 h-6 text-purple-600 dark:text-indigo-400" />
                    ),
                    gradient:
                      "from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800",
                  },
                  {
                    title: "Download To Install Rate",
                    value: totalDownloadsIsLoading ? (
                      <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : (
                      `${downloadToInstallRate}%`
                    ),
                    icon: (
                      <DownloadIcon className="w-6 h-6 text-purple-600 dark:text-indigo-400" />
                    ),
                    gradient:
                      "from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800",
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

          <div className="w-full flex flex-col justify-between gap-4 z-[20]">
            <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border rounded-xl border border-purple-100 dark:border-indigo-500/30 p-4 sm:p-6 flex-1">
              <h3 className="text-lg font-medium text-gray-800 dark:text-indigo-200 mb-4">
                Install Details{" "}
                {processedLauncherData.filteredStats.length !==
                  launcherAndZoaverseDetailsData?.dailyStats?.length &&
                  "(Filtered)"}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-purple-50 dark:divide-indigo-500/20">
                  <thead className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-white">
                        Platform
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-white">
                        Product
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-white">
                        Installs
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-white">
                        % of Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50 dark:divide-indigo-500/20">
                    {launcherAndZoaverseDetailsIsLoading ? (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <tr
                            key={index}
                            className="border-b border-purple-100 dark:border-indigo-500/30"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-full animate-pulse" />
                                <div className="w-32 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="w-24 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="w-16 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse ml-auto" />
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="w-16 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse ml-auto" />
                            </td>
                          </tr>
                        ))
                    ) : processedLauncherData.filteredStats.map((stat: any, index: number) => (
                      <tr
                        key={index}
                        className={`${
                          index !== processedLauncherData.filteredStats.length - 1
                            ? "border-b"
                            : ""
                        } border-purple-100 dark:border-indigo-500/30 hover:bg-purple-50 dark:hover:bg-indigo-900/30`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getPlatformIcon(stat._id[0])}
                            <span className="text-gray-700 dark:text-indigo-100 capitalize">
                              {stat._id[0] || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-indigo-100">
                          {stat._id[1] || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-800 dark:text-indigo-200">
                          {stat.count}
                        </td>
                        <td className="py-3 px-4 text-right text-purple-600 dark:text-indigo-400">
                          {launcherAndZoaverseDetailsData?.totalInstalls === undefined
                            ? 0
                            : (
                                (stat.count /
                                  launcherAndZoaverseDetailsData.totalInstalls) *
                                100
                              ).toFixed(1)}
                          %
                        </td>
                      </tr>
                    ))}
                    {processedLauncherData?.filteredStats?.length === 0 && !launcherAndZoaverseDetailsIsLoading && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-8 text-purple-600 dark:text-indigo-400"
                        >
                          No data matches the selected filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border rounded-xl border border-purple-100 dark:border-indigo-500/30 p-4 sm:p-6 flex-1">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white-200 mb-4">
                Launcher Version Distribution{" "}
                {processedInstallDetails.filteredStats.length !==
                  launcherInstallDetailsData?.versionStats?.length &&
                  "(Filtered)"}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-purple-50 dark:divide-indigo-500/20">
                  <thead className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-indigo-600 dark:to-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-white dark:text-white">
                        Version
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-white">
                        Platform
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-white">
                        Installs
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-white">
                        % of Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50 dark:divide-indigo-500/20">
                    {launcherInstallDetailsIsLoading ? (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <tr
                            key={index}
                            className="border-b border-purple-100 dark:border-indigo-500/30"
                          >
                            <td className="py-3 px-4">
                              <div className="w-24 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-full animate-pulse" />
                                <div className="w-32 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="w-16 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse ml-auto" />
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="w-16 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse ml-auto" />
                            </td>
                          </tr>
                        ))
                    ) : processedInstallDetails.filteredStats.map(
                      (stat: any, index: number) => (
                        <tr
                          key={index}
                          className={`${
                            index !== processedInstallDetails.filteredStats.length - 1
                              ? "border-b"
                              : ""
                          } border-purple-100 dark:border-indigo-500/30 hover:bg-purple-50 dark:hover:bg-indigo-900/30`}
                        >
                          <td className="py-3 px-4 text-gray-700 dark:text-indigo-100">
                            {stat._id[0] || "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {getPlatformIcon(stat._id[1])}
                              <span className="text-gray-700 dark:text-indigo-100 capitalize">
                                {stat._id[1] || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-gray-800 dark:text-indigo-200">
                            {stat.count}
                          </td>
                          <td className="py-3 px-4 text-right text-purple-600 dark:text-indigo-400">
                            {launcherInstallDetailsData?.totalInstalls
                              ? (
                                  (stat.count /
                                    launcherInstallDetailsData.totalInstalls) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </td>
                        </tr>
                      )
                    )}
                    {processedInstallDetails.filteredStats.length === 0 && !launcherInstallDetailsIsLoading && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-8 text-purple-600 dark:text-indigo-400"
                        >
                          No data matches the selected filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-4">
            <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border dark:border-indigo-500/20 rounded-xl border border-purple-100 p-4 sm:p-6 flex-1">
              <h3 className="text-lg font-medium text-gray-800 dark:text-indigo-200 mb-4">
                Purchase Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-600 dark:text-indigo-400" />
                    <span className="text-gray-700 dark:text-indigo-100">
                      Verified Users
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-indigo-200">
                    {purchaseRateIsLoading ? (
                      <div className="w-24 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : (
                      purchaseRateData?.verifiedUsers || 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-purple-600 dark:text-indigo-400" />
                    <span className="text-gray-700 dark:text-indigo-100">
                      Purchasers
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-indigo-200">
                {purchaseRateIsLoading ? (
                      <div className="w-24 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                    ) : (
                      purchaseRateData?.purchasers || 0
                    )}
                  </span>
                </div>
                
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BarChart2 className="w-5 h-5 text-purple-600 dark:text-indigo-400" />
                      <span className="text-gray-700 dark:text-indigo-100">
                        Purchase Rate
                      </span>
                    </div>
                    <span className="font-medium text-gray-800 dark:text-indigo-200">
                      {purchaseRateIsLoading ? (
                        <div className="w-24 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                      ) : purchaseRateData ? (
                        `${purchaseRateData?.purchaseRate?.toFixed(2)}%`
                      ) : (
                        "0%"
                      )}
                    </span>
                  </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border rounded-xl border border-purple-100 dark:border-indigo-500/30 p-4 sm:p-6 flex-1">
              <h3 className="text-lg font-medium text-gray-800 dark:text-indigo-200 mb-4">
                Version Downloads{" "}
                {processedDownloads.filteredStats.length !==
                  totalDownloadsData?.length && "(Filtered)"}
              </h3>
              <div className="space-y-4">
                {totalDownloadsIsLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-full animate-pulse" />
                          <div className="w-32 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                        </div>
                        <div className="w-24 h-5 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                      </div>
                    ))
                ) : processedDownloads.filteredStats.length > 0 ? (
                  processedDownloads.filteredStats.map((download: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(download._id.platform)}
                        <span className="text-gray-700 dark:text-indigo-100">
                          v{download._id.version} ({download._id.platform || "N/A"})
                        </span>
                      </div>
                      <span className="font-medium text-gray-800 dark:text-indigo-200">
                        {download.count} downloads
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-purple-600 dark:text-indigo-400">
                    No download data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, icon, gradient }: { title: string; value: string | number | JSX.Element; icon: React.ReactNode; gradient: string }) => (
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

export default Acquisition;