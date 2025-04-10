"use client";

import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { toast } from 'react-toastify'
import { useGetAllFleets } from "../public/DashBoard/useGetAllFleets";
import { useUpdateFleet } from "../public/DashBoard/useUpdateFleet";

const FleetManagement = () => {
    const [activeSection, setActiveSection] = useState("Fleets Management");
    const { fleetsData, fleetsLoading, refetchFleet } = useGetAllFleets();
    const { updateFleet, updateFleetIsSuccess, updateFleetLoading } = useUpdateFleet()
    const [selectedFleets, setSelectedFleets] = useState<Record<string, boolean>>({});
    
    useEffect(() => {
        if (updateFleetIsSuccess) {
            toast.success('Record Updated Successfully,')
            refetchFleet()
        }
    }, [updateFleetIsSuccess])

    const fleetData = () => {
        const fleetData = fleetsData?.FleetCapacity?.map((val: any) => ({
            name: val.Name,
            enabled: val.InstanceCounts.DESIRED,
            id: val.FleetId,
        })) || [];
        return fleetData;
    };


    function compareFleetData() {
        for (const fleetItem of fleetData()) {
          const fleetId = fleetItem.id;
          const fleetEnabled = fleetItem.enabled === 1;
          if (!(fleetId in selectedFleets)) {
            return false; 
          }
          if (selectedFleets[fleetId] !== fleetEnabled) {
            return false; 
          }
        }
        const arrayIds = fleetData().map((item:any) => item.id);
        for (const objectId in selectedFleets) {
          if (!arrayIds.includes(objectId)) {
            return false; 
          }
        }
        return true;
      }
      


    useEffect(() => {
        const initialSelection: Record<string, boolean> = {};
        fleetData().forEach((fleet: any) => {
            initialSelection[fleet.id] = fleet.enabled !== 0;
        });
        setSelectedFleets(initialSelection);
    }, [fleetsData]);

    const toggleFleetSelection = (id: string) => {
        setSelectedFleets((prev: Record<string, boolean>) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const updateSelectedFleets = () => {
        updateFleet({
            "Fleets"
                : [selectedFleets]
        })
    };

    const getStatusLabel = (status: number) => {
        switch (status) {
            case 0: return "Disabled";
            case 1: return "Enabled";
            case 2: return "Enabled";
            default: return "Unknown";
        }
    };

    const getStatusClass = (status: number) => {
        switch (status) {
            case 0: return "bg-red-100 text-red-800";
            case 1: return "bg-green-100 text-green-800";
            case 2: return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const SkeletonRow = () => (
        <tr className="border-b border-blue-100 animate-pulse">
            <td className="py-4 px-4">
                <div className="h-4 bg-[#94a3b8] rounded w-32 mb-2"></div>
            </td>
            <td className="py-4 px-4">
                <div className="h-6 bg-[#94a3b8] rounded w-16"></div>
            </td>
            <td className="py-4 px-4">
                <div className="h-5 w-10 bg-[#94a3b8] rounded"></div>
            </td>
        </tr>
    );

    return (
        <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-100">
            <SideBar activeSection={activeSection} setActiveSection={setActiveSection} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <NavBar />

                <div className="min-h-screen bg-gray-50 p-4">
                    <div className=" bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-100 to-purple-50 p-6">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold ">Fleets Management</h1>
                                <button
                                    onClick={()=> !compareFleetData() && updateSelectedFleets()}
                                    className={`px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-md hover:bg-gray-100 transition-colors ${compareFleetData() && 'opacity-50 cursor-not-allowed' }`}
                                >
                                    {updateFleetLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div> : "Update Fleets"}
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-blue-100">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Fleet Name</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Status</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fleetsLoading ? (
                                            Array(5).fill(0).map((_, index) => <SkeletonRow key={index} />)
                                        ) : (
                                            fleetData().map((fleet: any) => (
                                                <tr key={fleet.id} className="border-b border-blue-100 hover:bg-gray-50">
                                                    <td className="py-4 px-4">
                                                        <div className="text-sm font-medium text-gray-900">{fleet.name}</div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(fleet.enabled)}`}>
                                                            {getStatusLabel(fleet.enabled)}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!selectedFleets[fleet.id]}
                                                                onChange={() => toggleFleetSelection(fleet.id)}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                        </label>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FleetManagement;