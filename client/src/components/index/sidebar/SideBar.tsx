import React, { useState, useEffect, useRef } from 'react';
import { useSetting } from '@client/contexts/SettingProvider';
import { useStatus } from '@client/contexts/StatusProvider';

import SideChovenLeft from "@client/assets/icons/tsxs/SideChovenLeft";
import SideChovenRight from "@client/assets/icons/tsxs/SideChovenRight";
import { Switch, Button } from "@ymwc/react-components";
import { Divider } from "@tremor/react";
import { useToast } from '@ymwc/react-core';

export default function SideBar(){

  const { addToast } = useToast();
  const {
    showSide, setShowSide,
    showCalIds, setShowCalIds,
    setIsSettingOpen,
  } = useSetting();
  const { calendarList, setCalendarList } = useStatus();

  const [isHovering, setIsHovering] = useState(false);

  // Mouse proximity detection for toggle button visibility
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const proximity = 60; // Show when within 60px of left
      const isNearLeft = mouseX <= proximity;
      
      setIsHovering(isNearLeft);
    };
    
    // Add event listener
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle manual show/hide button clicks
  const handleToggle = () => {
    setShowSide(!showSide);
  };

  return (
    <div className="relative flex h-full">
      {/* Main Sidebar Content */}
      {showSide && (
        <div className="w-64 bg-white border-r border-gray-200 shadow-sm overflow-hidden">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-800">Calendars</h2>
            <button
              onClick={handleToggle}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Hide sidebar"
            >
              <div className="w-3 h-3">
                <SideChovenLeft />
              </div>
            </button>
          </div>
          
          {/* Content */}
          <div className="flex flex-col h-full">
            {/* Settings Button */}
            <div className="p-3 border-b border-gray-100">
              <button
                onClick={() => setIsSettingOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
            </div>
            
            {/* Calendar List */}
            <div className="flex-1 overflow-y-auto">
              {calendarList && calendarList.length > 0 ? (
                <div className="p-2 space-y-1">
                  {calendarList.map(calendar => (
                    <div 
                      key={calendar.id} 
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors group"
                    >
                      <Switch 
                        id={`switch-${calendar.id}`}
                        size="sm"
                        customColor={calendar.style.color}
                        checked={showCalIds.includes(calendar.id)}
                        onChange={checked => {
                          if (!checked && showCalIds.includes(calendar.id)) {
                            const newShowCalIds = showCalIds.filter(id => id !== calendar.id);
                            setShowCalIds(newShowCalIds);
                          } else if (checked && !showCalIds.includes(calendar.id)) {
                            setShowCalIds([...showCalIds, calendar.id]);
                          }
                        }}
                      />
                      <label 
                        htmlFor={`switch-${calendar.id}`} 
                        className="flex-1 text-sm text-gray-700 cursor-pointer truncate group-hover:text-gray-900 transition-colors"
                        title={calendar.name}
                      >
                        {calendar.name}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No calendars available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Floating Toggle Button - Shows on mouse proximity to left */}
      {!showSide && (
        <div 
          className={`fixed left-0 top-3 z-50 transition-opacity duration-500 ${
            isHovering ? 'opacity-60' : 'opacity-0'
          }`}
        >
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={handleToggle}
            title="Show sidebar"
          >
            <div className="w-3 h-3">
              <SideChovenRight/>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}