"use client";

import React, { useEffect, useMemo, useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

import { ChartBar, CreditCard, Filter } from "lucide-react";
import { useGetPurchaseRate } from "../public/Acquisition/useGetPurchaseRate";
import DatePicker from "react-datepicker";
import { getVirtualStorePurchase } from "../public/DashBoard/getVirtualStorePurchase";
import BarChatComp from "../components/BarChatComp";
import { motion } from "framer-motion";
import { getStorePurchase } from "../public/DashBoard/getStorePurchase";
import moment from "moment";
import { dailyActiveUsers } from "../public/DashBoard/dailyActiveUsers";
import { getRoomInfo } from "../public/DashBoard/getRoomInfo";
import { useGetRepeatPurchaseRate } from "../public/Revenue/useGetRepeatPurchaseRate";
import "react-datepicker/dist/react-datepicker.css";

const Revenue = () => {
  // const [productFilter, setProductFilter] = useState("all");
  // const [platformFilter, setPlatformFilter] = useState("all");
  // const [versionFilter, setVersionFilter] = useState("all");
  const [virtualStoreDateRange, setVirtualStoreDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [selectedKey, setSelectedKey] = useState(null);

  const [virtualStoreStartDate, virtualStoreEndDate] = virtualStoreDateRange;
  const { activeUsers, activeUserLoading, activeUsersData } =
    dailyActiveUsers();
  const { roomINfo, roomInfoData } = getRoomInfo();

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [roomDateRange, setRoomDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [storeDateRange, setStoreDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [storeStartDate, storeEndDate] = storeDateRange;
  const { storePurchase, storePurchaseLoading, storePurchaseData } =
    getStorePurchase();

  const { virtualStore, virtualStoreData, virtualStoreLoading } =
    getVirtualStorePurchase();

  const {
    purchaseRateRefetch,
    purchaseRateIsLoading,
    purchaseRateIsSuccess,
    purchaseRateData,
  } = useGetPurchaseRate();

  const {
    repeatPurchaseRateData,
    repeatPurchaseRateIsLoading,
    repeatPurchaseRateIsRefetching,
    repeatPurchaseRateRefetch,
  } = useGetRepeatPurchaseRate();
  console.log(repeatPurchaseRateData);
  useEffect(() => {
    getTimestamps();
  }, []);

  useEffect(() => {
    if (!purchaseRateData && !purchaseRateIsLoading) {
      purchaseRateRefetch();
    }

    if (!repeatPurchaseRateData && !repeatPurchaseRateIsLoading) {
      repeatPurchaseRateRefetch();
    }
  }, [purchaseRateData, purchaseRateRefetch]);

  useEffect(() => {
    if (dateRange && dateRange[1] !== null) {
      let apiData = {
        from: moment(dateRange[0]).format("YYYY-MM-DD"),
        to: moment(dateRange[1]).format("YYYY-MM-DD"),
      };
      activeUsers(apiData);
    }
  }, [dateRange]);

  useEffect(() => {
    if (roomDateRange && roomDateRange[1] !== null) {
      let apiData = {
        from: moment(roomDateRange[0]).format("YYYY-MM-DD"),
        to: moment(roomDateRange[1]).format("YYYY-MM-DD"),
      };
      roomINfo(apiData);
    }
  }, [roomDateRange]);

  useEffect(() => {
    if (virtualStoreDateRange && virtualStoreDateRange[1] !== null) {
      let apiData = {
        startDate: moment(virtualStoreDateRange[0]).format("YYYY-MM-DD"),
        endDate: moment(virtualStoreDateRange[1]).format("YYYY-MM-DD"),
      };
      virtualStore(apiData);
    }
  }, [virtualStoreDateRange]);

  useEffect(() => {
    if (storeDateRange && storeDateRange[1] !== null) {
      let apiData = {
        startDate: moment(storeDateRange[0]).format("YYYY-MM-DD"),
        endDate: moment(storeDateRange[1]).format("YYYY-MM-DD"),
      };
      storePurchase(apiData);
    }
  }, [storeDateRange]);

  useEffect(() => {
    if (virtualStoreData && selectedKey === null) {
      let objectsData = virtualStoreData && Object.keys(virtualStoreData);
      setSelectedKey(objectsData?.[0]);
    }
  }, [virtualStoreData]);

  function getTimestamps() {
    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - 15);
    setDateRange([pastDate, currentDate]);
    setVirtualStoreDateRange([pastDate, currentDate]);
    setStoreDateRange([pastDate, currentDate]);
    setRoomDateRange([pastDate, currentDate]);
  }

  const handleSelectChange = (event: any) => {
    const key = event.target.value;
    setSelectedKey(key);
  };
  function selectDays(data: string, type: string) {
    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    if (data === "Last 7 days") {
      pastDate.setDate(currentDate.getDate() - 7);
    } else if (data === "Last 15 days") {
      pastDate.setDate(currentDate.getDate() - 15);
    } else if (data === "Today") {
      pastDate.setDate(currentDate.getDate());
    } else if (data === "Yesterday") {
      pastDate.setDate(currentDate.getDate() - 1);
    }
    type === "activeUsers"
      ? setDateRange([pastDate, currentDate])
      : type === "storePurchase"
      ? setStoreDateRange([pastDate, currentDate])
      : type === "roominfo"
      ? setRoomDateRange([pastDate, currentDate])
      : setVirtualStoreDateRange([pastDate, currentDate]);
  }

  const selectDateDropDown = (type: string) => {
    return (
      <select
        onChange={(e) => selectDays(e.target.value, type)}
        className="border rounded-lg p-2 cursor-pointer w-full md:max-w-52 bg-white dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 shadow-sm"
        defaultValue=""
      >
        <option value="" disabled>
          Please select days
        </option>
        <option>Today</option>
        <option>Yesterday</option>
        <option>Last 7 days</option>
        <option>Last 15 days</option>
      </select>
    );
  };

  const updatedVirtualStoreData = () => {
    if (virtualStoreData) {
      const transformedData: any = {};
      Object.keys(virtualStoreData).forEach((category) => {
        transformedData[category] = virtualStoreData[category].map(
          (item: any) => {
            const transformedItem = { ...item };
            transformedItem["Purchase Count"] = transformedItem.purchaseCount;
            delete transformedItem.purchaseCount;
            return transformedItem;
          }
        );
      });
      return transformedData;
    }
  };

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

  const transformPackPrice = () => {
    return (
      storePurchaseData?.packsData &&
      storePurchaseData?.packsData.map((item: any) => {
        const transformedItem = { ...item };
        transformedItem[
          "Purchase Count"
        ] = `${transformedItem?.purchaseCount?.toFixed(2)}`;
        delete transformedItem.purchaseCount;
        return transformedItem;
      })
    );
  };
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-indigo-950">
      <SideBar activeSection="Revenue" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />
        <div className="p-4 sm:p-6 space-y-6 flex flex-col gap-4 overflow-auto">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border dark:border-indigo-500/20 w-full rounded-xl border border-purple-100  p-4 sm:p-6">
            <div className="flex flex-col justify-between gap-4">
              <div className="flex flex-wrap w-full md:flex-row gap-3">
                {[
                  {
                    title: "Purchase Rate",
                    value: purchaseRateIsLoading
                      ? "Loading..."
                      : purchaseRateData
                      ? `${purchaseRateData.purchaseRate.toFixed(2)}%`
                      : "0%",
                    icon: (
                      <CreditCard className="w-6 h-6 text-purple-600 dark:text-indigo-400" />
                    ),
                    gradient:
                      "from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800",
                  },

                  {
                    title: "Download To Install Rate",
                    value: repeatPurchaseRateIsLoading
                      ? "Loading..."
                      : `${repeatPurchaseRateData?.repeatPurchaseRate?.toFixed(
                          2
                        )}%`,
                    icon: (
                      <ChartBar className="w-6 h-6 text-purple-600 dark:text-indigo-400" />
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
          <section id="Virtual Store Purchases" className="mb-8">
            <div className="flex flex-wrap gap-6 w-full flex-row">
              <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border dark:border-indigo-500/20 rounded-2xl shadow-2xl p-6 w-full ">
                <h3 className="text-lg font-semibold mb-4 dark:text-indigo-200">
                  In Game Items
                </h3>
                <div className="flex flex-wrap gap-6 flex-row mb-5">
                  <DatePicker
                    selectsRange
                    startDate={virtualStoreStartDate}
                    endDate={virtualStoreEndDate}
                    dateFormat="d-MMM-YYYY"
                    maxDate={new Date()}
                    onChange={(update) => {
                      const [start, end] = update as [Date | null, Date | null];
                      setVirtualStoreDateRange(
                        update as [Date | null, Date | null]
                      );
                    }}
                    isClearable
                    placeholderText="Select Date Range"
                    className="border py-2 px-5 rounded w-full  dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 dark:focus:ring-2 dark:focus:ring-indigo-500/40"
                  />

                  {virtualStoreLoading ? (
                    <div className="w-52 h-10 bg-[#cbd5e1] dark:bg-indigo-600/20 opacity-60 rounded-lg animate-pulse" />
                  ) : (
                    <div className="max-w-64">
                      <select
                        onChange={handleSelectChange}
                        className="border rounded-lg p-2 w-full  bg-white dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 shadow-sm"
                      >
                        {virtualStoreData &&
                          Object.keys(virtualStoreData).map((key) => (
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
                {updatedVirtualStoreData() &&
                selectedKey &&
                updatedVirtualStoreData()[selectedKey]?.length ? (
                  <div className="dark:bg-gray-800/80 dark:p-4 dark:rounded-xl">
                    <BarChatComp
                      data={
                        updatedVirtualStoreData() &&
                        updatedVirtualStoreData()[selectedKey]
                          ? updatedVirtualStoreData()[selectedKey]
                          : []
                      }
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

          <section id="revenueGraph" className="mb-8">
            <div className="flex flex-wrap gap-6 w-full flex-row">
              <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border dark:border-indigo-500/20 rounded-2xl shadow-2xl p-6 w-full ">
                <h3 className="text-lg font-semibold mb-4 dark:text-indigo-200">
                  Bundle Purchases
                </h3>
                <div className="flex row items-center justify-between">
                  <div className="flex flex-wrap gap-6 flex-row sm:justify-center">
                    <DatePicker
                      selectsRange
                      startDate={storeStartDate}
                      endDate={storeEndDate}
                      maxDate={new Date()}
                      dateFormat="d-MMM-YYYY"
                      onChange={(update) => {
                        const [start, end] = update as [
                          Date | null,
                          Date | null
                        ];
                        setStoreDateRange(update as [Date | null, Date | null]);
                      }}
                      isClearable
                      placeholderText="Select Date Range"
                      className="border py-2 px-5 rounded w-full  dark:bg-gray-700 dark:text-indigo-100 dark:border-indigo-500/30 dark:focus:ring-2 dark:focus:ring-indigo-500/40"
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
                      {revenueDays()} {revenueDays() > 1 ? "Days" : "Day"}{" "}
                      Revenue
                    </h3>
                    <p className="text-4xl font-bold text-white text-center">
                      {storePurchaseData?.totalRevenue &&
                        storePurchaseData?.totalRevenue?.toFixed(2)}{" "}
                      SAR
                    </p>
                  </motion.div>
                </div>
                {virtualStoreData &&
                selectedKey &&
                virtualStoreData[selectedKey]?.length ? (
                  <div className="dark:bg-gray-800/80 dark:p-4 dark:rounded-xl">
                    <BarChatComp
                      data={
                        transformPackPrice() && transformPackPrice()?.length
                          ? transformPackPrice()
                          : []
                      }
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
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, icon, gradient }) => (
  <div
    className={`bg-gradient-to-r ${gradient} border border-purple-100 dark:border-indigo-500/30 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow w-full lg:w-48`}
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

export default Revenue;
