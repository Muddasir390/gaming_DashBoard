"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import { getUserCount } from "../public/DashBoard/getUserCount";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { toast } from 'react-toastify'
import LineChartComp from "../components/LineChartComp";
import BarChatComp from "../components/BarChatComp";
import PieChartComp from "../components/PieChartComp";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { dailyActiveUsers } from "../public/DashBoard/dailyActiveUsers";
import { getVirtualStorePurchase } from "../public/DashBoard/getVirtualStorePurchase";
import { useGetSession } from "../public/DashBoard/useGetSession";
import { useGetRetentionData } from '../public/DashBoard/useGetRetentionData'
import { getStorePurchase } from "../public/DashBoard/getStorePurchase";
import { getRoomInfo } from "../public/DashBoard/getRoomInfo";
import { useRouter } from 'next/router';


const Dashboard = () => {
  const [selectedDay, setSelectedDay] = useState('weekly')
  const { activeUsers, activeUserLoading, activeUsersData } = dailyActiveUsers()
  const { virtualStore, virtualStoreData, virtualStoreLoading } = getVirtualStorePurchase()
  const { storePurchase, storePurchaseLoading, storePurchaseData } = getStorePurchase()
  const { roomINfo, roomInfoData } = getRoomInfo()
  const { sessionData } = useGetSession()
  const { userCountData } = getUserCount()
  const { retentionData, retentionLoading } = useGetRetentionData(selectedDay?.toLowerCase())


  const [activeSection, setActiveSection] = useState("Dashboard");
  const [linkClicks, setLinkClicks] = useState('Line Chart')
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [virtualStoreDateRange, setVirtualStoreDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [storeDateRange, setStoreDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [roomDateRange, setRoomDateRange] = useState<[Date | null, Date | null]>([null, null]);


  const [selectedKey, setSelectedKey] = useState(null);
  const [startDate, endDate] = dateRange;
  const [virtualStoreStartDate, virtualStoreEndDate] = virtualStoreDateRange;
  const [storeStartDate, storeEndDate] = storeDateRange;
  const [roomStartDate, roomEndDate] = roomDateRange;
  const route = useRouter()

  function revenueDays() {
    const date1 = storeStartDate ? new Date(storeStartDate) : new Date();
    const date2 = storeEndDate ? new Date(storeEndDate) : new Date();
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
      throw new Error("Invalid date format");
    }
    const differenceInMs = Math.abs(date2.getTime() - date1.getTime());
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
    
    return Math.floor(differenceInDays);
  }
  

  const scrollToId = (id: string, behavior: ScrollBehavior = 'smooth') => {
    if (typeof window === 'undefined') return;

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior });
    }
  }

  const cardsData = [
    { label: "Total Players", value: userCountData?.totalUsers },
    { label: "Online Players", value: userCountData?.onlineUsers },
    { label: "Total Revenue", value: `${storePurchaseData?.lifeTimeRevenue ? `${storePurchaseData?.lifeTimeRevenue} SAR` : ''}` },
    { label: "Average Session Length", value: `${sessionData?.averageLength} mins` },
  ]

  function getTimestamps() {
    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - 15);
    setDateRange([pastDate, currentDate])
    setVirtualStoreDateRange([pastDate, currentDate])
    setStoreDateRange([pastDate, currentDate])
    setRoomDateRange([pastDate, currentDate])
  }

  function selectDays(data: string, type: string) {
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
    type === "activeUsers" ? setDateRange([pastDate, currentDate]) : type === 'storePurchase' ? setStoreDateRange([pastDate, currentDate]) : type === 'roominfo' ? setRoomDateRange([pastDate, currentDate]) : setVirtualStoreDateRange([pastDate, currentDate])
  }

  const handleSelectChange = (event: any) => {
    const key = event.target.value;
    setSelectedKey(key);
  };

  const selectDateDropDown = (type: string) => {
    return (<select
      onChange={(e) => selectDays(e.target.value, type)}
      className="border rounded-lg p-2 cursor-pointer w-full md:max-w-52 bg-white dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 shadow-sm"
      defaultValue=""
    >
      <option value="" disabled>Please select days</option>
      <option>Today</option>
      <option>Yesterday</option>
      <option>Last 7 days</option>
      <option>Last 15 days</option>
    </select>)
  }

  const updatedVirtualStoreData = () => {
    if (virtualStoreData) {
      const transformedData: any = {};
      Object.keys(virtualStoreData).forEach(category => {
        transformedData[category] = virtualStoreData[category].map((item: any) => {
          const transformedItem = { ...item };
          transformedItem["Purchase Count"] = transformedItem.purchaseCount;
          delete transformedItem.purchaseCount;
          return transformedItem;
        });
      });
      return transformedData;
    }
  };

  const transformPackPrice = () => {
    return storePurchaseData?.packsData && storePurchaseData?.packsData.map((item: any) => {
      const transformedItem = { ...item };
      transformedItem["Purchase Count"] = `${transformedItem?.purchaseCount?.toFixed(2)}`;
      delete transformedItem.purchaseCount;
      return transformedItem;
    });
  };

  useEffect(() => {
    getTimestamps()
  }, [])

  useEffect(() => {
    if (dateRange && dateRange[1] !== null) {
      let apiData = {
        "from": moment(dateRange[0]).format('YYYY-MM-DD'),
        "to": moment(dateRange[1]).format('YYYY-MM-DD')
      }
      activeUsers(apiData)
    }

  }, [dateRange])

  useEffect(() => {
    if (roomDateRange && roomDateRange[1] !== null) {
      let apiData = {
        "from": moment(roomDateRange[0]).format('YYYY-MM-DD'),
        "to": moment(roomDateRange[1]).format('YYYY-MM-DD')
      }
      roomINfo(apiData)
    }

  }, [roomDateRange])

  useEffect(() => {
    if (virtualStoreDateRange && virtualStoreDateRange[1] !== null) {
      let apiData = {
        "startDate": moment(virtualStoreDateRange[0]).format('YYYY-MM-DD'),
        "endDate": moment(virtualStoreDateRange[1]).format('YYYY-MM-DD')
      }
      virtualStore(apiData)
    }

  }, [virtualStoreDateRange])

  useEffect(() => {
    if (storeDateRange && storeDateRange[1] !== null) {
      let apiData = {
        "startDate": moment(storeDateRange[0]).format('YYYY-MM-DD'),
        "endDate": moment(storeDateRange[1]).format('YYYY-MM-DD')
      }
      storePurchase(apiData)
    }

  }, [storeDateRange])

  useEffect(() => {
    if (virtualStoreData && selectedKey === null) {
      let objectsData = virtualStoreData && Object.keys(virtualStoreData)
      setSelectedKey(objectsData?.[0])
    }
  }, [virtualStoreData])

  const DailyUsersData = () => {
    if (activeUsersData) {
      let chartData = activeUsersData?.userData?.map((item: any) => {
        return ({ date: moment(item?.time).format('YYYY-MM-DD'), "Daily Active Users": item?.users?.length, "New Sign Ups": item?.newSignUP?.length })
      })
      return chartData
    }
  }

  const RetentionData = () => {
    if (retentionData) {
      let chartData = retentionData?.retention && retentionData?.retention?.length && retentionData?.retention?.map((item: any) => {
        return ({ date: moment(item?.intervalKey).format('YYYY-MM-DD'), "Retention": item?.retentionRate?.toFixed(2) })
      })
      return chartData
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-indigo-950">
  <SideBar activeSection={activeSection} setActiveSection={setActiveSection} />
  <div className="flex-1 flex flex-col">
    <NavBar />
    {/* Main Content Area */}
    <main className="flex-1 p-8 overflow-y-auto dark:text-gray-200">
      <section id="overview" className="mb-8">
        <h3 className="text-10xl font-bold mb-6 dark:text-indigo-300">Overview</h3>
        <div className="flex flex-wrap gap-6 flex-row justify-center">
          {cardsData.map((item, index) => (
            <motion.div
              key={index}
              className={`bg-white dark:bg-gray-800 dark:border dark:border-indigo-500/20 rounded-lg shadow-2xl p-6 px-20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                item?.label === 'Average Session Length' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              } dark:shadow-indigo-900/20 dark:hover:shadow-indigo-700/30`}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                item?.label === 'Total Players'
                  ? route.push('/users')
                  : item?.label === "Total Revenue"
                  ? scrollToId("revenueGraph")
                  : (item?.label === 'Online Players' && item?.value >= 1)
                  ? route.push(`/users?status=${"online"}`)
                  : null
              }
            >
              <h3 className="text-lg font-semibold mb-2 text-center text-gray-700 dark:text-indigo-200">
                {item.label}
              </h3>
              <p className="text-4xl font-bold text-blue-600 dark:text-indigo-400 text-center">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="dailyUsers" className="mb-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-indigo-300">Analytics Dashboard</h2>
        <div className="flex flex-wrap gap-6 w-full flex-row">
          <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border dark:border-indigo-500/20 rounded-2xl shadow-2xl p-6 w-full md:w-[calc(50%-12px)]">
            <h3 className="text-lg font-semibold mb-4 dark:text-indigo-200">Users Data</h3>
            <div className="flex flex-wrap gap-6 flex-row sm:justify-center mb-5">
              <DatePicker
                selectsRange
                startDate={startDate}
                maxDate={new Date()}
                endDate={endDate}
                dateFormat="d-MMM-YYYY"
                onChange={(update) => {
                  const [start, end] = update as [Date | null, Date | null];
                  if (start && end && (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) > 15) {
                    toast.info('You can select a maximum of 15 days.')
                    setDateRange([null, null]);
                  } else {
                    setDateRange(update as [Date | null, Date | null]);
                  }
                }}
                isClearable
                placeholderText="Select Date Range"
                className="border py-2 px-5 rounded w-full md:w-auto dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 dark:focus:ring-2 dark:focus:ring-indigo-500/40"
              />

              <div className="max-w-64">
                <select
                  onChange={(e) => setLinkClicks(e.target.value)}
                  className="border rounded-lg p-2 cursor-pointer w-full md:max-w-52 bg-white dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 shadow-sm"
                >
                  <option>Line Chart</option>
                  <option>Bar Chart</option>
                  <option>Pie Chart</option>
                </select>
              </div>

              <div className="max-w-64">
                {selectDateDropDown("activeUsers")}
              </div>
            </div>
            {activeUserLoading ? (
              <div className="w-full h-[300px] flex flex-col items-center justify-center space-y-4">
                <div className="w-full h-[250px] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] dark:from-gray-800 dark:to-indigo-900/40 rounded-lg relative overflow-hidden shadow-md animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f1f5f9] via-[#e2e8f0] to-[#f1f5f9] dark:from-gray-800/80 dark:via-indigo-900/30 dark:to-gray-800/80 animate-[shimmer_1.8s_infinite]"></div>

                  <div className="absolute bottom-0 left-[10%] w-[12%] h-[50%] bg-[#cbd5e1] dark:bg-indigo-600/40 opacity-60 rounded-lg"></div>
                  <div className="absolute bottom-0 left-[30%] w-[12%] h-[70%] bg-[#94a3b8] dark:bg-indigo-500/40 opacity-50 rounded-lg"></div>
                  <div className="absolute bottom-0 left-[50%] w-[12%] h-[40%] bg-[#cbd5e1] dark:bg-indigo-600/40 opacity-60 rounded-lg"></div>
                  <div className="absolute bottom-0 left-[70%] w-[12%] h-[80%] bg-[#94a3b8] dark:bg-indigo-500/40 opacity-50 rounded-lg"></div>
                  <div className="absolute bottom-0 left-[90%] w-[12%] h-[60%] bg-[#cbd5e1] dark:bg-indigo-600/40 opacity-60 rounded-lg"></div>
                </div>
                <div className="w-1/3 h-6 bg-[#e2e8f0] dark:bg-indigo-700/30 rounded-md animate-pulse shadow-sm"></div>
              </div>
            ) : DailyUsersData() && DailyUsersData()?.length ? (
              <div className="dark:bg-gray-800/80 dark:p-4 dark:rounded-xl">
                {linkClicks === 'Line Chart' && <LineChartComp data={DailyUsersData() ? DailyUsersData() : []} isLoading={activeUserLoading} />}
                {linkClicks === 'Bar Chart' && <BarChatComp data={DailyUsersData() ? DailyUsersData() : []} name={"date"} value={["Daily Active Users", "New Sign Ups"]} />}
                {linkClicks === 'Pie Chart' && <PieChartComp data={DailyUsersData() ? DailyUsersData() : []} />}
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center dark:text-indigo-200 dark:bg-gray-800/50 dark:rounded-xl">
                No Record Found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* virtual store purchases section */}
      <section id="Virtual Store Purchases" className="mb-8">
        <div className="flex flex-wrap gap-6 w-full flex-row">
          <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border dark:border-indigo-500/20 rounded-2xl shadow-2xl p-6 w-full md:w-[calc(50%-12px)]">
            <h3 className="text-lg font-semibold mb-4 dark:text-indigo-200">In Game Items</h3>
            <div className="flex flex-wrap gap-6 flex-row sm:justify-center mb-5">
              <DatePicker
                selectsRange
                startDate={virtualStoreStartDate}
                endDate={virtualStoreEndDate}
                dateFormat="d-MMM-YYYY"
                maxDate={new Date()}
                onChange={(update) => {
                  const [start, end] = update as [Date | null, Date | null];
                  setVirtualStoreDateRange(update as [Date | null, Date | null]);
                }}
                isClearable
                placeholderText="Select Date Range"
                className="border py-2 px-5 rounded w-full md:w-auto dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 dark:focus:ring-2 dark:focus:ring-indigo-500/40"
              />

              {virtualStoreLoading ? (
                <div className="w-52 h-10 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-lg animate-pulse" />
              ) : (
                <div className="max-w-64">
                  <select
                    onChange={handleSelectChange}
                    className="border rounded-lg p-2 w-full md:max-w-52 bg-white dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 shadow-sm"
                  >
                    {virtualStoreData && Object.keys(virtualStoreData).map((key) => (
                      <option key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="max-w-64">
                {selectDateDropDown("virtualStorePurchase")}
              </div>
            </div>
            {updatedVirtualStoreData() && selectedKey && updatedVirtualStoreData()[selectedKey]?.length ? (
              <div className="dark:bg-gray-800/80 dark:p-4 dark:rounded-xl">
                <BarChatComp 
                  data={updatedVirtualStoreData() && updatedVirtualStoreData()[selectedKey] ? updatedVirtualStoreData()[selectedKey] : []} 
                  name={"name"} 
                  value={["Purchase Count"]} 
                  loading={virtualStoreLoading} 
                />
              </div>
            ) : virtualStoreLoading ? (
              <div className="w-full h-[300px] flex flex-col items-center justify-center space-y-4">
                <div className="w-full h-[250px] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] dark:from-gray-800 dark:to-indigo-900/40 rounded-lg relative overflow-hidden shadow-md animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f1f5f9] via-[#e2e8f0] to-[#f1f5f9] dark:from-gray-800/80 dark:via-indigo-900/30 dark:to-gray-800/80 animate-[shimmer_1.8s_infinite]"></div>

                  <div className="absolute bottom-0 left-[10%] w-[12%] h-[50%] bg-[#cbd5e1] dark:bg-indigo-600/40 opacity-60 rounded-lg"></div>
                  <div className="absolute bottom-0 left-[30%] w-[12%] h-[70%] bg-[#94a3b8] dark:bg-indigo-500/40 opacity-50 rounded-lg"></div>
                  <div className="absolute bottom-0 left-[50%] w-[12%] h-[40%] bg-[#cbd5e1] dark:bg-indigo-600/40 opacity-60 rounded-lg"></div>
                  <div className="absolute bottom-0 left-[70%] w-[12%] h-[80%] bg-[#94a3b8] dark:bg-indigo-500/40 opacity-50 rounded-lg"></div>
                  <div className="absolute bottom-0 left-[90%] w-[12%] h-[60%] bg-[#cbd5e1] dark:bg-indigo-600/40 opacity-60 rounded-lg"></div>
                </div>
                <div className="w-1/3 h-6 bg-[#e2e8f0] dark:bg-indigo-700/30 rounded-md animate-pulse shadow-sm"></div>
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center dark:text-indigo-200 dark:bg-gray-800/50 dark:rounded-xl">
                No Record Found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* store purchases */}
      <section id="revenueGraph" className="mb-8">
        <div className="flex flex-wrap gap-6 w-full flex-row">
          <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border dark:border-indigo-500/20 rounded-2xl shadow-2xl p-6 w-full md:w-[calc(50%-12px)]">
            <h3 className="text-lg font-semibold mb-4 dark:text-indigo-200">Bundle Purchases</h3>
            <div className="flex row items-center justify-between">
              <div className="flex flex-wrap gap-6 flex-row sm:justify-center">
                <DatePicker
                  selectsRange
                  startDate={storeStartDate}
                  endDate={storeEndDate}
                  maxDate={new Date()}
                  dateFormat="d-MMM-YYYY"
                  onChange={(update) => {
                    const [start, end] = update as [Date | null, Date | null];
                    setStoreDateRange(update as [Date | null, Date | null]);
                  }}
                  isClearable
                  placeholderText="Select Date Range"
                  className="border py-2 px-5 rounded w-full md:w-auto dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 dark:focus:ring-2 dark:focus:ring-indigo-500/40"
                />

                <div className="max-w-64">
                  {selectDateDropDown("storePurchase")}
                </div>
              </div>
              <motion.div
                className="bg-gradient-to-r from-[#4F518C] to-[#6366F1] dark:from-indigo-600 dark:to-purple-700 rounded-lg mb-20 shadow-2xl p-6 px-10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer dark:shadow-indigo-600/30"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3 className="text-lg font-semibold mb-2 text-center text-white">
                  {revenueDays() } {revenueDays() > 1 ? "Days" : "Day"} Revenue
                </h3>
                <p className="text-4xl font-bold text-white text-center">
                  {storePurchaseData?.totalRevenue && storePurchaseData?.totalRevenue?.toFixed(2)} SAR
                </p>
              </motion.div>
            </div>
            {virtualStoreData && selectedKey && virtualStoreData[selectedKey]?.length ? (
              <div className="dark:bg-gray-800/80 dark:p-4 dark:rounded-xl">
                <BarChatComp 
                  data={transformPackPrice() && transformPackPrice()?.length ? transformPackPrice() : []} 
                  name={"packName"} 
                  value={["Purchase Count"]} 
                  loading={storePurchaseLoading} 
                />
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center dark:text-indigo-200 dark:bg-gray-800/50 dark:rounded-xl">
                No Record Found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Room Information */}
      <section id="storePurchase" className="mb-8">
        <div className="flex flex-wrap gap-6 w-full flex-row">
          <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border dark:border-indigo-500/20 rounded-2xl shadow-2xl p-6 w-full md:w-[calc(50%-12px)]">
            <h3 className="text-lg font-semibold mb-4 dark:text-indigo-200">Room Information</h3>
            <div className="flex row items-center justify-between mb-5">
              <div className="flex flex-wrap gap-6 flex-row sm:justify-center">
                <DatePicker
                  selectsRange
                  startDate={roomStartDate}
                  endDate={roomEndDate}
                  maxDate={new Date()}
                  dateFormat="d-MMM-YYYY"
                  onChange={(update) => {
                    const [start, end] = update as [Date | null, Date | null];
                    setRoomDateRange(update as [Date | null, Date | null]);
                  }}
                  isClearable
                  placeholderText="Select Date Range"
                  className="border py-2 px-5 rounded w-full md:w-auto dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 dark:focus:ring-2 dark:focus:ring-indigo-500/40"
                />

                <div className="max-w-64">
                  {selectDateDropDown("roominfo")}
                </div>
              </div>
            </div>
            {roomInfoData?.eventRes && roomInfoData?.eventRes?.length ? (
              <div className="dark:bg-gray-800/80 dark:p-4 dark:rounded-xl">
                <BarChatComp 
                  data={roomInfoData?.eventRes && roomInfoData?.eventRes?.length ? roomInfoData?.eventRes : []} 
                  name={"time"} 
                  value={roomInfoData?.roomNames?.length ? roomInfoData?.roomNames : []} 
                  loading={storePurchaseLoading} 
                />
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center dark:text-indigo-200 dark:bg-gray-800/50 dark:rounded-xl">
                No Record Found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Retention Graph */}
      <section id="Virtual Store Purchases" className="mb-8">
        <div className="flex flex-wrap gap-6 w-full flex-row">
          <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border dark:border-indigo-500/20 rounded-2xl shadow-2xl p-6 w-full md:w-[calc(50%-12px)]">
            <h3 className="text-lg font-semibold mb-4 dark:text-indigo-200">Retention</h3>
            <div className="flex flex-wrap gap-6 flex-row sm:justify-center">
              <div className="max-w-64 mb-16">
                <select
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="border rounded-lg cursor-pointer p-2 w-full md:max-w-52 bg-white dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 shadow-sm"
                  defaultValue=""
                >
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
            {RetentionData() && RetentionData()?.length ? (
              <div className="dark:bg-gray-800/80 dark:p-4 dark:rounded-xl">
                <LineChartComp data={RetentionData() ? RetentionData() : []} isLoading={retentionLoading} rentation />
              </div>
            ) : retentionLoading ? (
              <div className="w-full h-[300px] flex flex-col items-center justify-center space-y-4">
                <div className="w-full h-[250px] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] dark:from-gray-800 dark:to-indigo-900/40 rounded-lg relative overflow-hidden shadow-md animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f1f5f9] via-[#e2e8f0] to-[#f1f5f9] dark:from-gray-800/80 dark:via-indigo-900/30 dark:to-gray-800/80 animate-[shimmer_1.8s_infinite]"></div>

                  <div className="absolute bottom-0 left-[10%] w-[12%] h-[50%] bg-[#cbd5e1] dark:bg-indigo-600/40 opacity-60 rounded-lg"></div>
                  <div className="absolute bottom-0 left-[30%] w-[12%] h-[70%] bg-[#94a3b8] dark:bg-indigo-500/40 opacity-50 rounded-lg"></div>
                  <div className="absolute bottom-0 left-[50%] w-[12%] h-[40%] bg-[#cbd5e1] dark:bg-indigo-600/40 opacity-60 rounded-lg"></div>
                  <div className="absolute bottom-0 left-[70%] w-[12%] h-[80%] bg-[#94a3b8] dark:bg-indigo-500/40 opacity-50 rounded-lg"></div>
                  <div className="absolute bottom-0 left-[90%] w-[12%] h-[60%] bg-[#cbd5e1] dark:bg-indigo-600/40 opacity-60 rounded-lg"></div>
                </div>
                <div className="w-1/3 h-6 bg-[#e2e8f0] dark:bg-indigo-700/30 rounded-md animate-pulse shadow-sm"></div>
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center dark:text-indigo-200 dark:bg-gray-800/50 dark:rounded-xl">
                No Record Found.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  </div>
</div>
  );
};

export default Dashboard;