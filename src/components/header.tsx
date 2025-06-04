"use client";
import {FaGithub} from 'react-icons/fa'; 
import React, { useState } from 'react'; // React and useState are needed for the simulated button
import { ConnectButton } from "@rainbow-me/rainbowkit"; 
export default function Header() {

  return (
    <header className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg rounded-b-xl">
      {/* Logo Area: GitHub Icon and Title */}
      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-inner">
        {/* GitHub Icon (Inline SVG) */}
        <a
          href="https://github.com/SuyashAlphaC" // Replace with your actual GitHub repository link
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
          aria-label="GitHub Repository"
        >
          <FaGithub size= {24}/>
        </a>
        {/* Application Title */}
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight font-inter">
          TSender
        </h1>
      </div>

      {/* Connect Button */}
      <div className="flex items-center space-x-4">
        {/* Simulated Connect Wallet Button */}
        <ConnectButton/>
      </div>
    </header>
  );
}
