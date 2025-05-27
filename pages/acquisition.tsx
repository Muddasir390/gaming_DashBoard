"use client";

import React, { useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const Acquisition = () => {
    const [activeSection, setActiveSection] = useState("Acquisition");


    return (
        <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-indigo-950">
    <SideBar activeSection={activeSection} setActiveSection={setActiveSection}  />
    <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />
        <div className="flex-1 overflow-auto p-6 md:p-8 dark:from-indigo-300 dark:to-purple-400">
           
        </div>
    </div>
</div>
    );
};

export default Acquisition;