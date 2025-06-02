
"use client";

import React, { useEffect } from "react";
import { useGetFirstSessionRateInstall } from "../public/Activation/useGetFirstSessionRateInstall";
import { useGetRegistrationToFirstSessionRate } from "../public/Activation/useGetRegistrationToFirstSessionRate";
import { useGetTimeToFirstSession } from "../public/Activation/useGetTimeToFirstSession";
import { Users, BarChart2, Clock } from "lucide-react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const Activation = () => {
  const {
    getFirstSessionRateInstallRefetch,
    getFirstSessionRateInstallIsLoading,
    getFirstSessionRateInstallIsSuccess,
    getFirstSessionRateInstallData,
  } = useGetFirstSessionRateInstall();

  const {
    getRegistrationToFirstSessionRateRefetch,
    getRegistrationToFirstSessionRateIsLoading,
    getRegistrationToFirstSessionRateIsSuccess,
    getRegistrationToFirstSessionRateData,
  } = useGetRegistrationToFirstSessionRate();

  const {
    getTimeToFirstSessionRefetch,
    getTimeToFirstSessionIsLoading,
    getTimeToFirstSessionIsSuccess,
    getTimeToFirstSessionData,
  } = useGetTimeToFirstSession();

  useEffect(() => {
    getFirstSessionRateInstallRefetch();
    getRegistrationToFirstSessionRateRefetch();
    getTimeToFirstSessionRefetch();
  }, [
    getFirstSessionRateInstallRefetch,
    getRegistrationToFirstSessionRateRefetch,
    getTimeToFirstSessionRefetch,
  ]);

  const formatTime = (seconds) => {
    if (!seconds) return "0s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${remainingSeconds}s`;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-indigo-950">
      <SideBar activeSection="Activation" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />
        <div className="p-4 sm:p-6 space-y-6 flex flex-col gap-6 overflow-auto">
          <div className="flex max-md:flex-wrap w-full md:flex-row gap-4">
            <Card
              title="Registration to First Session Rate"
              value={
                getRegistrationToFirstSessionRateIsLoading
                  ? <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                  : getRegistrationToFirstSessionRateIsSuccess
                  ? `${getRegistrationToFirstSessionRateData?.firstSessionRate?.toFixed(2)}%`
                  : "0%"
              }
              icon={<BarChart2 className="w-8 h-8 text-purple-600 dark:text-indigo-400" />}
              gradient="from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800"
            />
            <Card
              title="Install to First Session Rate"
              value={
                getFirstSessionRateInstallIsLoading
                  ? <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                  : getFirstSessionRateInstallIsSuccess
                  ? `${getFirstSessionRateInstallData?.firstSessionRate?.toFixed(2)}%`
                  : "0%"
              }
              icon={<Users className="w-8 h-8 text-purple-600 dark:text-indigo-400" />}
              gradient="from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800"
            />
            <Card
              title="Avg Time to First Session"
              value={
                getTimeToFirstSessionIsLoading
                  ? <div className="w-24 h-6 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-md animate-pulse" />
                  : getTimeToFirstSessionIsSuccess
                  ? formatTime(getTimeToFirstSessionData?.avgTimeToFirstSessionSeconds)
                  : "0s"
              }
              icon={<Clock className="w-8 h-8 text-purple-600 dark:text-indigo-400" />}
              gradient="from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, icon, gradient }) => (
  <div className={`bg-gradient-to-r ${gradient} border border-purple-100 dark:border-indigo-500/30 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow w-full`}>
    <div className="flex gap-4 items-center justify-between mb-3">
      <p className="text-base text-gray-700 dark:text-indigo-100 font-medium">{title}</p>
      {icon}
    </div>
    <p className="text-2xl font-bold text-gray-800 dark:text-indigo-200">{value}</p>
  </div>
);

export default Activation;
