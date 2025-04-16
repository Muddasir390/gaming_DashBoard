"use client";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import { specificUserDetail } from "../public/DashBoard/specificUserDetail";
import * as Tooltip from "@radix-ui/react-tooltip";
import React, { useState, useMemo } from 'react';
import { Trophy, Users, Star, TowerControl as GameController, Gift, Shield, Clock, History, ShoppingBag, CheckCircle, Timer, UserPlus, User, Ban, FileStackIcon, ArrowUp, ArrowDown, Globe, MapPin, Smartphone } from 'lucide-react';

function SpecificUserDetail() {
    const [activeTab, setActiveTab] = useState('profile');
    const [purchaseId, setPurchaseId] = useState('all');
    const [searchQuery, setSearchQuery] = useState("");
    const [sortDirection, setSortDirection] = useState('asc')


    const router = useRouter();
    const { name } = router.query;
    const { specificUserData, specificUserIsLoading } = specificUserDetail({ id: name })
    const user = specificUserData?.user


    const filteredFriends = useMemo(() => {
        const filtered = user?.friends?.filter((user: any) =>
            user?.username?.toLowerCase().includes(searchQuery.toLowerCase()));
        if (filtered) {
            return [...filtered].sort((a, b) => {
                const nameA = a?.username?.toLowerCase() || '';
                const nameB = b?.username?.toLowerCase() || '';

                if (sortDirection === 'asc') {
                    return nameA.localeCompare(nameB);
                } else {
                    return nameB.localeCompare(nameA);
                }
            });
        }

        return [];
    }, [user?.friends, searchQuery, sortDirection]);




    const formatTime = (minutes: any) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const TabButton = ({ id, icon: Icon, label }: { id: string; icon: any; label: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-indigo-100 hover:text-indigo-700'
                }`}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </button>
    );

    const FilterButton = ({ id, icon: Icon, label }: { id: string; icon?: any; label: string }) => (
        <button
            onClick={() => setPurchaseId(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${purchaseId === id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-indigo-100 hover:text-indigo-700'
                }`}
        >
            {/* <Icon className="w-4 h-4" /> */}
            <span>{label}</span>
        </button>
    );

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };


    const filterPurchasedItems = (): any[] => {
        if (purchaseId === 'all') {
            return user?.purchasedItems || [];
        }

        return user?.purchasedItems?.filter((item: any) => item?.type === purchaseId) || [];
    }


    return (
        <>
            {specificUserIsLoading ? <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 animate-pulse">
                <div className="px-10 mt-10 mx-auto space-y-6">
                    <div className="bg-white rounded-xl shadow p-2 flex gap-2 overflow-x-auto">
                        {[...Array(2)].map((_, index) => (
                            <div key={index} className="h-10 w-24 bg-purple-100 rounded"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(2)].map((_, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="h-6 bg-purple-100 w-40 rounded mb-4"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[...Array(4)].map((_, subIndex) => (
                                        <div key={subIndex} className="h-16 bg-purple-100 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div> : <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
                <NavBar />

                <div className="px-10 mt-10 mx-auto space-y-6">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="mb-4">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
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
                                {/* <span className="text-sm font-medium">Back</span> */}
                            </button>
                        </div>
                        <div className="flex items-center gap-4">

                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center md:hidden">
                                <span className="text-3xl font-bold text-white">{user?.username[0].toUpperCase()}</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {user?.username}
                                    <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-white'
                                        }`}>
                                        {user?.online ? 'Online' : 'Offline'}
                                    </span>
                                </h1>
                                <div className="flex items-center gap-4 mt-2">
                                    {/* Points */}
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span className="text-gray-600">{user?.points.toLocaleString()} points</span>
                                    </div>

                                    {/* Total Time Spent */}
                                    <Tooltip.Provider>
                                        <Tooltip.Root>
                                            <Tooltip.Trigger asChild>
                                                <div className="flex items-center gap-1 cursor-pointer">
                                                    <Clock className="w-4 h-4 text-blue-500" />
                                                    {/* <span className="font-bold">Total time spent</span> */}
                                                    <div className="text-green-500 font-bold pl-2">
                                                        {formatTime(user?.timeSpentTotal)}
                                                    </div>
                                                </div>
                                            </Tooltip.Trigger>
                                            <Tooltip.Portal>
                                                <Tooltip.Content
                                                    side="top"
                                                    className="bg-gray-800 text-white px-3 py-1 rounded shadow-md text-sm"
                                                >
                                                    User has spent a total of {formatTime(user?.timeSpentTotal)} on the platform.
                                                    <Tooltip.Arrow className="fill-gray-800" />
                                                </Tooltip.Content>
                                            </Tooltip.Portal>
                                        </Tooltip.Root>
                                    </Tooltip.Provider>

                                    {/* Time Spent This Week */}
                                    <Tooltip.Provider>
                                        <Tooltip.Root>
                                            <Tooltip.Trigger asChild>
                                                <div className="flex items-center gap-1 cursor-pointer">
                                                    <Timer className="w-4 h-4 text-green-500" />
                                                    {/* <span className="font-bold">Time spent this week</span> */}
                                                    <span className="text-green-500 font-bold pl-2">
                                                        {formatTime(user?.timeSpentPastWeek)}
                                                    </span>
                                                </div>
                                            </Tooltip.Trigger>
                                            <Tooltip.Portal>
                                                <Tooltip.Content
                                                    side="top"
                                                    className="bg-gray-800 text-white px-3 py-1 rounded shadow-md text-sm"
                                                >
                                                    User has spent {formatTime(user?.timeSpentPastWeek)} this week on the platform.
                                                    <Tooltip.Arrow className="fill-gray-800" />
                                                </Tooltip.Content>
                                            </Tooltip.Portal>
                                        </Tooltip.Root>
                                    </Tooltip.Provider>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="bg-white rounded-xl shadow p-2 flex gap-2 overflow-x-auto">
                        <TabButton id="profile" icon={User} label="Profile" />
                        <TabButton id="activity" icon={Clock} label="Activity" />
                        <TabButton id="inventory" icon={Gift} label="Inventory" />
                        <TabButton id="friends" icon={Users} label="Friends" />
                        <TabButton id="tasks" icon={CheckCircle} label="Tasks" />
                        <TabButton id="history" icon={History} label="Match History" />
                        <TabButton id="stats" icon={Trophy} label="Game Statistics" />
                        <TabButton id="loginhistory" icon={FileStackIcon} label="LogIn History" />


                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeTab === 'profile' && (
                            <div className="space-y-4">
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">User Information</h2>
                                    <p className="text-sm text-gray-500 mb-6">Basic details about the user account</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Column 1 */}
                                        <div className="space-y-2">
                                            <div className="bg-indigo-50 p-3 rounded-lg py-6">
                                                <p className="text-sm text-gray-600">Username</p>
                                                <p className="text-lg font-semibold text-indigo-700 line-clamp-1">{user?.username}</p>
                                            </div>
                                            <div className="bg-purple-50 p-3 rounded-lg py-6">
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p className="text-lg font-semibold text-purple-700 line-clamp-1">{user?.email}</p>
                                            </div>

                                            <div className="bg-green-50 p-3 rounded-lg py-6">
                                                <p className="text-sm text-gray-600">Account Type</p>
                                                <p className="text-lg font-semibold text-green-700 line-clamp-1">
                                                    {user?.isGuest ? "Guest" : "Registered"}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg py-6">
                                                <p className="text-sm text-gray-600 line-clamp-1">Notifications</p>
                                                <p className="text-lg font-semibold text-gray-700">
                                                    {user?.notificationCount}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Column 2 */}
                                        <div className="space-y-2">
                                            <div className="bg-green-50 p-3 rounded-lg py-6">
                                                <p className="text-sm text-gray-600 ">Points</p>
                                                <p className="text-lg font-semibold text-amber-700 line-clamp-1">
                                                    {user?.points?.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="bg-cyan-50 p-3 rounded-lg py-6">
                                                <p className="text-sm text-gray-600">Last Activity</p>
                                                <p className="text-lg font-semibold text-cyan-700 line-clamp-1">
                                                    {formatDate(user?.lastReportTime)}
                                                </p>
                                            </div>
                                            <div className="bg-pink-50 p-3 rounded-lg py-6">
                                                <p className="text-sm text-gray-600">Event Count</p>
                                                <p className="text-lg font-semibold text-pink-700 line-clamp-1">
                                                    {user?.eventCounts?.toLocaleString()}
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'activity' && (
                            <div className="space-y-4">
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Time Statistics</h2>
                                    <p className="text-sm text-gray-500 mb-6">User's time spent on the platform</p>

                                    <div>
                                        <div className="bg-blue-50 p-6 rounded-lg flex flex-col items-center justify-center">
                                            <span className="text-blue-500 text-lg font-semibold mb-2">This Week</span>
                                            <span className="text-3xl font-bold">{formatTime(user?.timeSpentPastWeek)}</span>
                                        </div>
                                        <div className="bg-purple-50 p-6 mt-4 rounded-lg flex flex-col items-center justify-center">
                                            <span className="text-purple-500 text-lg font-semibold mb-2">Total Time</span>
                                            <span className="text-3xl font-bold">{formatTime(user?.timeSpentTotal)}</span>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        )}

                        {activeTab === 'stats' && (
                            <>
                                {/* Game Stats */}
                                {user?.gameProfiles && user?.gameProfiles?.length ? user?.gameProfiles.map((profile: any) => (
                                    <div key={profile?.gameName} className="bg-white rounded-2xl shadow-lg p-6">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <GameController className="w-5 h-5 text-indigo-500" />
                                            {profile?.gameName} Statistics
                                        </h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-indigo-50 p-3 rounded-lg">
                                                <div className="text-center mb-4 py-4">
                                                    <div className="text-sm text-blue-500">Level</div>
                                                    <div className="text-3xl font-bold">{profile?.stats.lvl}</div>
                                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${(profile?.stats?.xp / profile?.stats?.nxp) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="text-xs mt-1">
                                                        {profile?.stats?.xp.toLocaleString()} / {profile?.stats?.nxp.toLocaleString()} XP
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="bg-blue-50 p-3 rounded-lg py-12 items-center text-center">
                                                <p className="text-sm text-gray-600">XP</p>
                                                <p className="text-lg font-semibold text-purple-700">{profile?.stats?.xp.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-blue-50 p-3 rounded-lg py-12 items-center text-center">
                                                <p className="text-sm text-gray-600">Total Matches</p>
                                                <p className="text-lg font-semibold text-blue-700">{profile?.stats?.totalmatches}</p>
                                            </div>
                                            <div className="bg-blue-50 p-3 rounded-lg py-12 items-center text-center">
                                                <p className="text-sm text-gray-600">Weekly XP</p>
                                                <p className="text-lg font-semibold text-green-700">{profile?.stats?.weeklyXP}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div className="bg-blue-50 p-3 rounded-lg py-12 items-center text-center">
                                                <p className="text-sm text-gray-600">As Hunter</p>
                                                <p className="text-lg font-semibold text-amber-700">
                                                    {profile.stats.asHunter} games ({profile?.stats?.winAsHunter} wins)
                                                </p>
                                            </div>
                                            <div className="bg-blue-50 p-3 rounded-lg py-12 items-center text-center">
                                                <p className="text-sm text-gray-600">As Prop</p>
                                                <p className="text-lg font-semibold text-cyan-700">
                                                    {profile.stats.asProp} games ({profile?.stats?.winAsProp} wins)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )) : <div className="h-96 text-center flex items-center justify-center">No Record Found.</div>}
                            </>
                        )}

                        {activeTab === 'inventory' && (
                            <>
                                {/* Equipped Items */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Gift className="w-5 h-5 text-purple-500" />
                                        Equipped Items
                                    </h2>
                                    <div className="space-y-4">
                                        {user?.equipedItems?.pet && (
                                            <>
                                                <div className="text-3xl font-bold px-3">Pet</div>
                                                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-800">{user?.equipedItems.pet.name}</p>
                                                        <p className="text-sm text-gray-600">{user?.equipedItems.pet.description}</p>
                                                        <p className="text-sm text-gray-500">{user?.equipedItems.pet.price} {user?.equipedItems.pet.currency}</p>
                                                    </div>
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                                        {user?.equipedItems.pet.rarity}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        {user?.equipedItems?.headwear && (
                                            <>
                                                <div className="text-3xl font-bold px-3">HeadWear</div>

                                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-800">{user?.equipedItems.headwear.name}</p>
                                                        <p className="text-sm text-gray-500">{user?.equipedItems.headwear.price} {user?.equipedItems.headwear.currency}</p>
                                                    </div>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                        {user?.equipedItems.headwear.rarity}
                                                    </span>
                                                </div>
                                            </>)}
                                    </div>
                                </div>

                                {/* Purchased Items */}
                                <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5 text-green-500" />
                                        Purchased Items
                                    </h2>
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <FilterButton id={"all"} label="All" />
                                            <FilterButton id={'emote'} label="Emote" />
                                            <FilterButton id={'pet'} label="Pet" />
                                            <FilterButton id={'headwear'} label="HeadWear" />
                                            <FilterButton id={'backDecoration'} label="Back Decoration" />
                                        </div>
                                        {filterPurchasedItems() && filterPurchasedItems()?.length ? (
                                            <div className="max-h-[450px] pr-5 overflow-y-auto">
                                                {filterPurchasedItems()?.map((item: any, index: any) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3 last:mb-0">
                                                        <div>
                                                            <p className="font-medium text-gray-800">{item?.name}</p>
                                                            <p className="text-sm text-gray-600">{item?.description}</p>
                                                            <p className="text-sm text-gray-500">{item?.price} {item?.currency}</p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2">
                                                            <span className="px-2 py-1 bg-indigo-300 text-white rounded-full text-xs font-medium">
                                                                {item.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="h-96 text-center flex items-center justify-center">
                                                No Record Found.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'friends' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
                                <div className="mb-6 flex flex-row flex-wrap gap-2 justify-start items-center md:justify-center md:items-center">
                                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                        <UserPlus className="w-5 h-5 text-blue-500" />
                                        Friends List
                                    </h2>
                                    <input
                                        type="text"
                                        placeholder="Search friend..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 ml-4 py-2 border-2 max-w-44 border-purple-100 rounded-lg focus:outline-none focus:border-purple-500 text-purple-500 focus:ring-2 focus:ring-purple-200 transition-all placeholder:text-purple-300"
                                    />
                                    <button
                                        onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                                        className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg flex items-center gap-1 hover:bg-purple-200 transition-all"
                                    >
                                        Sort
                                        {sortDirection === 'asc' ?
                                            <ArrowUp className="w-4 h-4" /> :
                                            <ArrowDown className="w-4 h-4" />
                                        }
                                    </button>
                                </div>
                                <div className="space-y-3 max-h-[450px] overflow-y-auto">
                                    {filteredFriends && filteredFriends?.length ? filteredFriends?.map((friend: any, index: any) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 cursor-pointer relative mr-4">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                        {friend?.username?.[0]?.toUpperCase()}
                                                    </div>
                                                    <span
                                                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${friend?.userId?.online ? "bg-green-500" : "bg-gray-200"}`}
                                                    ></span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{friend?.username}</p>
                                                    <p className="font-medium text-gray-800">{friend?.userId?.email}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <div className={`ml-3 inline-flex items-center px-2.5 py-2 rounded-full text-xs font-medium ${friend.status === 'accepted'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {friend.status}
                                                </div>
                                            </div>
                                        </div>
                                    )) : <div className="flex items-center justify-center">
                                        <span className="font-medium">No Record Found.</span>
                                    </div>}
                                </div>
                            </div>
                        )}

                        {activeTab === 'tasks' && (
                            <>
                                {/* Tasks In Progress */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Timer className="w-5 h-5 text-amber-500" />
                                        Tasks In Progress
                                    </h2>
                                    <div className="space-y-4">
                                        {user?.tasksInProgress && user?.tasksInProgress?.length ? user?.tasksInProgress.map((task: any, index: any) => (
                                            <div key={index} className="p-4 bg-amber-50 rounded-lg">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-medium text-gray-800">{task.name}</h3>
                                                        <p className="text-sm text-gray-600">{task.description}</p>
                                                    </div>
                                                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                                                        {task.points} points
                                                    </span>
                                                </div>
                                                <div className="w-full bg-amber-200 rounded-full h-2">
                                                    <div
                                                        className="bg-amber-500 h-2 rounded-full"
                                                        style={{ width: `${(task.progress.current / task.progress.rewardAt) * 100}%` }}
                                                    />
                                                </div>
                                                <p className="text-sm text-amber-700 mt-1">
                                                    {task.progress.current} / {task.progress.rewardAt}
                                                </p>
                                            </div>
                                        )) : <div className="h-[100px] w-full flex items-center justify-center">
                                            No Record Found.
                                        </div>}
                                    </div>
                                </div>

                                {/* Completed Tasks */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        Completed Tasks
                                    </h2>
                                    <div className="space-y-3 max-h-[450px] overflow-y-auto">
                                        {user?.tasksClaimed && user?.tasksClaimed?.length ? user?.tasksClaimed.map((task: any, index: any) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-800">{task.name}</p>
                                                    <p className="text-sm text-gray-600">{task.description}</p>
                                                </div>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                    {task.points} points
                                                </span>
                                            </div>
                                        )) : <div className="h-[100px] w-full flex items-center justify-center">
                                            No Record Found.
                                        </div>}
                                    </div>
                                </div>

                                {/* UnClaimed Tasks */}
                                <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Ban className="w-5 h-5 text-pink-300" />
                                        UnClaimed Tasks
                                    </h2>
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {user?.tasksUnclaimed && user?.tasksUnclaimed?.length ? user?.tasksUnclaimed?.map((task: any, index: any) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-pink-100 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-800">{task?.name}</p>
                                                    <p className="text-sm text-gray-600">{task?.description}</p>
                                                </div>
                                                <span className="px-2 py-1 bg-pink-200 text-pink-400 rounded-full text-xs font-medium">
                                                    {task?.points} points
                                                </span>
                                            </div>
                                        )) : <div className="h-[100px] w-full flex items-center justify-center">
                                            No Record Found.
                                        </div>}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'history' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 px-10 mb-10">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <History className="w-5 h-5 text-indigo-500" />
                                    Recent Matches
                                </h2>
                                <div className="space-y-3 pr-5 max-h-[450px] overflow-y-auto">
                                    {user?.gameProfiles[0]?.history && user?.gameProfiles[0]?.history?.length ? user?.gameProfiles[0]?.history.map((match: any, index: any) => (
                                        <div key={index} className={`p-4 ${match.currentUserData.win ? 'bg-green-50' : 'bg-red-50'
                                            } rounded-lg`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{match.lobbyName}</h3>
                                                    <p className="text-sm text-gray-600">{match.time}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${match.currentUserData.win
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {match.currentUserData.win ? 'Victory' : 'Defeat'}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Role: {match.currentUserData.state}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">XP: +{match.currentUserData.earnedXP}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">GP: +{match.currentUserData.earnedGP}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : <div className="h-[100px] w-full flex items-center justify-center">
                                        No Record Found.
                                    </div>}
                                </div>
                            </div>
                        )}

                        {activeTab === 'loginhistory' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-indigo-500" /> {/* Changed to more relevant icon */}
                                    <div className=""> Login History </div>
                                </h2>
                                <div className="space-y-4 max-h-[450px] overflow-auto pr-5">
                                    {user?.loginHistory && user?.loginHistory?.length ? user?.loginHistory?.map((log: any, index: any) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-gray-50 rounded-lg border-l-4 border-r-4 border-indigo-500 hover:bg-green-50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-medium text-gray-800 flex items-center gap-2">
                                                        {log.ipLogId.city}, {log.ipLogId.region}
                                                        <span className="text-xs font-normal text-gray-500">
                                                            ({log.ipLogId.countryFlag.emoji})
                                                        </span>
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {log.ipLogId.isp}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.ipLogId.continent.code === 'EU' ? 'bg-indigo-100 text-indigo-800' :
                                                    log.ipLogId.continent.code === 'AS' ? 'bg-green-100 text-green-800' :
                                                        'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {log.ipLogId.continent.name}
                                                </span>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Globe className="w-4 h-4 text-gray-500" />
                                                    <p className="text-gray-600">
                                                        {log.ipLogId.country} ({log.ipLogId.countryCode})
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4 text-gray-500" />
                                                    <p className="text-gray-600">
                                                        {new Date(log.time).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4 text-gray-500" />
                                                    <p className="text-gray-600">
                                                        {log.ipLogId.postal} • {log.ipLogId.timezone}
                                                    </p>
                                                </div>
                                            </div>

                                            {log.device && (
                                                <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                                                    <Smartphone className="w-4 h-4 text-gray-500" />
                                                    {log.device} • {log.browser}
                                                </div>
                                            )}
                                        </div>
                                    )) : <div className="h-96 text-center flex items-center justify-center">No Record Found.</div>}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>}
        </>
    );
}

export default SpecificUserDetail;