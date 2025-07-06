import { useToast } from "@ymwc/react-core";
import React, { useEffect, useState } from "react";
import { updateApiKey } from "../data/setting";
import { createCalendar } from "../data/calendar";
import { useStatus } from "@client/contexts/StatusProvider";
import { fetchCalendarList } from "@client/data/calendar";
import { convertFetchListResponseToClient } from "@client/types/calendar";
import { CategoryList } from "../../share/types/calendar";
import { CalendarType } from "@client/types/calendar";

export default function Setting({
  closeModal,
}:{
  closeModal: ()=>void,
}){

  const { addToast } = useToast();
  const { calendarList, setCalendarList } = useStatus();

  const [ apiKey, setApiKey ] = useState<string>("");
  const [ activeTab, setActiveTab ] = useState<"apikey" | "calendars">("apikey");

  // Get time calendars
  const timeCalendars = calendarList.filter((cal: CalendarType) => cal.calendarSource === "time.maruyu.work");

  async function refreshCalendar() {
    try {
      const response = await fetchCalendarList();
      const calendars = convertFetchListResponseToClient(response);
      setCalendarList(calendars);
    } catch (error) {
      console.error("Failed to refresh calendar list:", error);
    }
  }

  function handleApiKeySubmit(e: React.FormEvent){
    e.preventDefault();
    updateApiKey({ apiKey })
    .then(()=>{
      addToast(null, "API Key was updated successfully.", "success");
      setApiKey("");
    })
    .catch(error=>{
      addToast(error.title, error.message, "error");
    })
  };

  async function handleCreateCalendar(category: "record" | "budget") {
    try {
      const title = `${category.charAt(0).toUpperCase() + category.slice(1)} Calendar`;
      await createCalendar({ category, title });
      addToast(null, `${title} created successfully!`, "success");
      await refreshCalendar();
    } catch (error: any) {
      addToast(error.title, error.message, "error");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Time Tracker Settings</h1>
      
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("apikey")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "apikey"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            API Key
          </button>
          <button
            onClick={() => setActiveTab("calendars")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "calendars"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Calendars
          </button>
        </nav>
      </div>

      {/* API Key Tab */}
      {activeTab === "apikey" && (
        <form
          onSubmit={handleApiKeySubmit}
          className="w-full bg-white p-6 rounded shadow-md"
        >
          <div className="mb-4">
            <label
              htmlFor="apiKey"
              className="block text-sm font-medium text-gray-700"
            >
              API Key
            </label>
            <input 
              type="text" 
              id="apiKey"
              value={apiKey}
              onChange={(e)=>setApiKey(e.target.value)} 
              required={true}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter API Key" 
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update API Key
          </button>
        </form>
      )}

      {/* Calendars Tab */}
      {activeTab === "calendars" && (
        <div className="space-y-6">
          {/* Existing Calendars */}
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-medium mb-4">Existing Calendars</h3>
            {timeCalendars.length > 0 ? (
              <div className="space-y-2">
                {timeCalendars.map(calendar => (
                  <div key={calendar.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <span className="font-medium">{calendar.name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({calendar.data?.category || "unknown"})
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      calendar.style?.display === "showInList" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {calendar.style?.display === "showInList" ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No time calendars found. Create one below.</p>
            )}
          </div>

          {/* Create New Calendar */}
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-medium mb-4">Create New Calendar</h3>
            <div className="space-y-3">
              {CategoryList.map(category => {
                const existing = timeCalendars.find(cal => cal.data?.category === category);
                return (
                  <div key={category} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <span className="font-medium capitalize">{category} Calendar</span>
                      <p className="text-sm text-gray-500">
                        {category === "record" ? "Track time records and activities" : "Manage time budgets and limits"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCreateCalendar(category)}
                      disabled={!!existing}
                      className={`px-4 py-2 text-sm font-medium rounded ${
                        existing 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                          : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      }`}
                    >
                      {existing ? "Already Created" : "Create"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}