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
import { getStorePurchase } from "../public/DashBoard/getStorePurchase";


const Dashboard = () => {
  const { activeUsers, activeUserLoading, activeUsersData } = dailyActiveUsers()
  const { virtualStore, virtualStoreData, virtualStoreLoading } = getVirtualStorePurchase()
  const { storePurchase, storePurchaseLoading, storePurchaseData } = getStorePurchase()
  const { sessionData } = useGetSession()
  const { userCountData } = getUserCount()

  const [activeSection, setActiveSection] = useState("Dashboard");
  const [linkClicks, setLinkClicks] = useState('Line Chart')
  const [dailyUsers, setDailyUsers] = useState([])
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [virtualStoreDateRange, setVirtualStoreDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [storeDateRange, setStoreDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const [selectedKey, setSelectedKey] = useState(null);

  const [startDate, endDate] = dateRange;
  const [virtualStoreStartDate, virtualStoreEndDate] = virtualStoreDateRange;
  const [storeStartDate, storeEndDate] = storeDateRange;

  console.log('storePurchaseData*****', storePurchaseData);


  useEffect(() => {
    getTimestamps()
  }, [])


  function getTimestamps() {
    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - 15);
    setDateRange([pastDate, currentDate])
    setVirtualStoreDateRange([pastDate, currentDate])
    setStoreDateRange([pastDate, currentDate])
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
    type === "activeUsers" ? setDateRange([pastDate, currentDate]) : type === 'storePurchase' ? setStoreDateRange([pastDate, currentDate]) : setVirtualStoreDateRange([pastDate, currentDate])
  }

  const handleSelectChange = (event: any) => {
    const key = event.target.value;
    setSelectedKey(key);
  };

  useEffect(() => {
    if (dateRange && dateRange[1] !== null) {
      let apiData = {
        "from": moment(dateRange[0]).format('YYYY-MM-DD'),
        "to": moment(dateRange[1]).format('YYYY-MM-DD')
      }
      activeUsers(apiData)
    }

  }, [dateRange[1]])

  useEffect(() => {
    if (virtualStoreDateRange && virtualStoreDateRange[1] !== null) {
      let apiData = {
        "startDate": moment(virtualStoreDateRange[0]).format('YYYY-MM-DD'),
        "endDate": moment(virtualStoreDateRange[1]).format('YYYY-MM-DD')
      }
      virtualStore(apiData)
    }

  }, [virtualStoreDateRange[1]])

  useEffect(() => {
    if (storeDateRange && storeDateRange[1] !== null) {
      let apiData = {
        "startDate": moment(storeDateRange[0]).format('YYYY-MM-DD'),
        "endDate": moment(storeDateRange[1]).format('YYYY-MM-DD')
      }
      storePurchase(apiData)
    }

  }, [storeDateRange[1]])

  useEffect(() => {
    if (activeUsersData) {
      let chartData = activeUsersData?.res?.map((item: any) => {
        return ({ date: moment(item?.time).format('YYYY-MM-DD'), users: item?.users?.length })
      })
      setDailyUsers(chartData)
    }
  }, [activeUsersData])

  useEffect(() => {
    if (virtualStoreData && selectedKey === null) {
      let objectsData = virtualStoreData && Object.keys(virtualStoreData)
      setSelectedKey(objectsData?.[0])
    }
  }, [virtualStoreData])

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <SideBar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <NavBar />
        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <section id="overview" className="mb-8">
            <h3 className="text-10xl font-bold mb-6">Overview</h3>
            <div className="flex flex-wrap gap-6 flex-row justify-center">
              {[
                { label: "Total Players", value: userCountData?.totalUsers },
                { label: "Online Players", value: userCountData?.onlineUsers },
                { label: "Average Session Length", value: `${sessionData?.averageLength} mins` },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-2xl p-6 px-20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer "
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h3 className="text-lg font-semibold mb-2 text-center text-gray-700">
                    {item.label}
                  </h3>
                  <p className="text-4xl font-bold text-blue-600 text-center">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Two Graphs in a Row Section */}
          <section id="dailyUsers" className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
            <div className="flex flex-wrap gap-6 w-full flex-row">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full md:w-[calc(50%-12px)]">
                <h3 className="text-lg font-semibold mb-4">Daily Active Users</h3>
                <div className="mb-8 flex  md:flex-col flex-row gap-4 md:gap-10">
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
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
                    className="border p-2 rounded w-full md:w-auto"
                  />

                  <div className="max-w-64 ">
                    <select
                      onChange={(e) => setLinkClicks(e.target.value)}
                      className="border rounded-lg p-2 w-full md:max-w-52 bg-white shadow-sm"
                    >
                      <option>Line Chart</option>
                      <option>Bar Chart</option>
                      <option>Pie Chart</option>
                    </select>
                  </div>

                  <div className="max-w-64">
                    <select
                      onChange={(e) => selectDays(e.target.value, "activeUsers")}
                      className="border rounded-lg p-2 w-full md:max-w-52 bg-white shadow-sm"
                      defaultValue=""
                    >
                      <option value="" disabled>Please select days</option>
                      <option>Last 7 days</option>
                      <option>Last 15 days</option>
                    </select>
                  </div>
                </div>
                {dailyUsers && dailyUsers?.length ? <div>
                  {linkClicks === 'Line Chart' && <LineChartComp data={dailyUsers ? dailyUsers : []} isLoading={activeUserLoading} />}
                  {linkClicks === 'Bar Chart' && <BarChatComp data={dailyUsers ? dailyUsers : []} name={"date"} value={"users"} />}
                  {linkClicks === 'Pie Chart' && <PieChartComp data={dailyUsers ? dailyUsers : []} />}
                </div> : activeUserLoading ? <div className="w-full h-[300px] flex flex-col items-center justify-center space-y-4">
                  <div className="w-full h-[250px] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] rounded-lg relative overflow-hidden shadow-md animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f1f5f9] via-[#e2e8f0] to-[#f1f5f9] animate-[shimmer_1.8s_infinite]"></div>

                    <div className="absolute bottom-0 left-[10%] w-[12%] h-[50%] bg-[#cbd5e1] opacity-60 rounded-lg"></div>
                    <div className="absolute bottom-0 left-[30%] w-[12%] h-[70%] bg-[#94a3b8] opacity-50 rounded-lg"></div>
                    <div className="absolute bottom-0 left-[50%] w-[12%] h-[40%] bg-[#cbd5e1] opacity-60 rounded-lg"></div>
                    <div className="absolute bottom-0 left-[70%] w-[12%] h-[80%] bg-[#94a3b8] opacity-50 rounded-lg"></div>
                    <div className="absolute bottom-0 left-[90%] w-[12%] h-[60%] bg-[#cbd5e1] opacity-60 rounded-lg"></div>
                  </div>
                  <div className="w-1/3 h-6 bg-[#e2e8f0] rounded-md animate-pulse shadow-sm"></div>
                </div> : <div className="h-[300px] w-full flex items-center justify-center">
                  No Record Found.
                </div>}
              </div>
            </div>

          </section>


          {/* virtual  store purchses section */}

          <section id="dailyUsers" className="mb-8">
            <div className="flex flex-wrap gap-6 w-full flex-row">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full md:w-[calc(50%-12px)]">
                <h3 className="text-lg font-semibold mb-4">Virtual Store Purchases</h3>
                <div className="mb-8 flex  md:flex-col flex-row gap-4 md:gap-10">
                  <DatePicker
                    selectsRange
                    startDate={virtualStoreStartDate}
                    endDate={virtualStoreEndDate}
                    onChange={(update) => {
                      const [start, end] = update as [Date | null, Date | null];
                      setVirtualStoreDateRange(update as [Date | null, Date | null]);
                    }}
                    isClearable
                    placeholderText="Select Date Range"
                    className="border p-2 rounded w-full md:w-auto"
                  />

                  <div className="max-w-64">
                    <select
                      onChange={handleSelectChange}
                      className="border rounded-lg p-2 w-full md:max-w-52 bg-white shadow-sm"
                    >
                      {virtualStoreData && Object.keys(virtualStoreData).map((key) => (
                        <option key={key} value={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="max-w-64">

                    <select
                      onChange={(e) => selectDays(e.target.value, 'virtualStorePurchase')}
                      className="border rounded-lg p-2 w-full md:max-w-52 bg-white shadow-sm"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Please select days
                      </option>
                      <option>Last 7 days</option>
                      <option>Last 15 days</option>
                    </select>
                  </div>
                </div>
                {virtualStoreData && selectedKey && virtualStoreData[selectedKey]?.length ? <div>
                  <BarChatComp data={virtualStoreData[selectedKey] ? virtualStoreData[selectedKey] : []} name={"name"} value={"purchaseCount"} loading={virtualStoreLoading} />
                </div> : virtualStoreLoading ? <div className="w-full h-[300px] flex flex-col items-center justify-center space-y-4">
                  <div className="w-full h-[250px] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] rounded-lg relative overflow-hidden shadow-md animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f1f5f9] via-[#e2e8f0] to-[#f1f5f9] animate-[shimmer_1.8s_infinite]"></div>

                    <div className="absolute bottom-0 left-[10%] w-[12%] h-[50%] bg-[#cbd5e1] opacity-60 rounded-lg"></div>
                    <div className="absolute bottom-0 left-[30%] w-[12%] h-[70%] bg-[#94a3b8] opacity-50 rounded-lg"></div>
                    <div className="absolute bottom-0 left-[50%] w-[12%] h-[40%] bg-[#cbd5e1] opacity-60 rounded-lg"></div>
                    <div className="absolute bottom-0 left-[70%] w-[12%] h-[80%] bg-[#94a3b8] opacity-50 rounded-lg"></div>
                    <div className="absolute bottom-0 left-[90%] w-[12%] h-[60%] bg-[#cbd5e1] opacity-60 rounded-lg"></div>
                  </div>
                  <div className="w-1/3 h-6 bg-[#e2e8f0] rounded-md animate-pulse shadow-sm"></div>
                </div> : <div className="h-[300px] w-full flex items-center justify-center">
                  No Record Found.
                </div>}
              </div>
            </div>
          </section>


          {/* store purchases */}

          <section id="dailyUsers" className="mb-8">
            <div className="flex flex-wrap gap-6 w-full flex-row">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full md:w-[calc(50%-12px)]">
                <h3 className="text-lg font-semibold mb-4">Store Purchases</h3>
                <div className="flex row  items-center justify-between">
                  <div className="mb-8 flex  md:flex-col flex-row gap-4 md:gap-10">
                    <DatePicker
                      selectsRange
                      startDate={storeStartDate}
                      endDate={storeEndDate}
                      onChange={(update) => {
                        const [start, end] = update as [Date | null, Date | null];
                        setStoreDateRange(update as [Date | null, Date | null]);
                      }}
                      isClearable
                      placeholderText="Select Date Range"
                      className="border p-2 rounded w-full md:w-auto"
                    />

                    <div className="max-w-64">

                      <select
                        onChange={(e) => selectDays(e.target.value, 'storePurchase')}
                        className="border rounded-lg p-2 w-full md:max-w-52 bg-white shadow-sm"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Please select days
                        </option>
                        <option>Last 7 days</option>
                        <option>Last 15 days</option>
                      </select>
                    </div>
                  </div>
                  <motion.div
                    className="bg-green-400 rounded-lg shadow-2xl p-6 px-10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer "
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <h3 className="text-lg font-semibold mb-2 text-center text-gray-700">
                      Total Revenue
                    </h3>
                    <p className="text-4xl font-bold text-blue-600 text-center">
                      {storePurchaseData?.totalRevenue}
                    </p>
                  </motion.div>
                </div>
                {virtualStoreData && selectedKey && virtualStoreData[selectedKey]?.length ? <div>
                  <BarChatComp data={storePurchaseData?.packsData && storePurchaseData?.packsData?.length ? storePurchaseData?.packsData : []} name={"packName"} value={"packPrice"} loading={storePurchaseLoading} />
                </div> : <div className="h-[300px] w-full flex items-center justify-center">
                  No Record Found.
                </div>}
              </div>
            </div>
          </section>





        </main>
      </div>
    </div>
  );
};

export default Dashboard;