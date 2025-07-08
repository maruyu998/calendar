import { useToast } from "@ymwc/react-core";
import React, { useEffect, useState } from "react";
import { updateApiKey } from "../data/setting";
import { createCalendar, updateCalendar, deleteCalendar } from "../data/calendar";
import { useStatus } from "@client/contexts/StatusProvider";
import { fetchCalendarList } from "@client/data/calendar";
import { convertFetchListResponseToClient } from "@client/types/calendar";
import { CategoryList } from "../../share/types/calendar";
import { CalendarType, CalendarIdType } from "@client/types/calendar";
import { HexColorType } from "@ymwc/utils";

function CalendarEditItem({
  calendar,
  isEditing,
  onEdit,
  onCancel,
  onUpdate,
  onDelete,
}: {
  calendar: CalendarType;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onUpdate: (updates: {
    name?: string;
    description?: string;
    color?: HexColorType;
    display?: "showInList" | "hiddenInList";
  }) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(calendar.name);
  const [description, setDescription] = useState(calendar.description);
  const [color, setColor] = useState(calendar.style.color);
  const [isColorChanged, setIsColorChanged] = useState(false);

  const handleSave = () => {
    const updates: any = {};
    if (name !== calendar.name) updates.name = name;
    if (description !== calendar.description) updates.description = description;
    
    if (Object.keys(updates).length > 0) {
      onUpdate(updates);
    } else {
      onCancel();
    }
  };

  const handleToggleDisplay = () => {
    const newDisplay = calendar.style.display === "showInList" ? "hiddenInList" : "showInList";
    onUpdate({ display: newDisplay });
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor as HexColorType);
    setIsColorChanged(true);
  };

  const handleColorSave = () => {
    if (isColorChanged) {
      onUpdate({ color: color });
      setIsColorChanged(false);
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calendar Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter calendar name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter calendar description"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isVisible = calendar.style.display === "showInList";

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        {/* Visibility Toggle Switch */}
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={handleToggleDisplay}
              className="sr-only"
            />
            <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${
              isVisible ? "bg-green-500" : "bg-gray-300"
            }`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                isVisible ? "transform translate-x-4" : ""
              }`} />
            </div>
          </div>
          <span className="ml-2 text-sm text-gray-700">
            {isVisible ? "表示" : "非表示"}
          </span>
        </label>

        {/* Color Picker */}
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={isColorChanged ? color : calendar.style.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            title="Change color"
          />
          {isColorChanged && (
            <button
              onClick={handleColorSave}
              className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
            >
              Apply
            </button>
          )}
        </div>

        {/* Calendar Info */}
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">{calendar.name}</span>
            <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
              {calendar.data?.category || "unknown"}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{calendar.description}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function Setting({
  closeModal,
}:{
  closeModal: ()=>void,
}){

  const { addToast } = useToast();
  const { calendarList, setCalendarList } = useStatus();

  const [ apiKey, setApiKey ] = useState<string>("");
  const [ activeTab, setActiveTab ] = useState<"apikey" | "calendars">("apikey");
  const [ editingCalendar, setEditingCalendar ] = useState<string | null>(null);

  // Get datafoot calendars
  const datafootCalendars = calendarList.filter((cal: CalendarType) => cal.calendarSource === "datafoot.maruyu.work");

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
    
    if (!apiKey || apiKey.trim() === "") {
      addToast("Validation Error", "API Key cannot be empty", "error");
      return;
    }
    
    updateApiKey({ apiKey: apiKey.trim() })
    .then(()=>{
      addToast(null, "API Key was updated successfully.", "success");
      setApiKey("");
    })
    .catch(error=>{
      console.error("API Key update error:", error);
      addToast(error.title, error.message, "error");
    })
  };

  async function handleCreateCalendar(category: "androidAppUsage") {
    try {
      const title = getCalendarTitle(category);
      await createCalendar({ category, title });
      addToast(null, `${title} created successfully!`, "success");
      await refreshCalendar();
    } catch (error: any) {
      addToast(error.title, error.message, "error");
    }
  }

  function getCalendarTitle(category: string): string {
    switch (category) {
      case "androidAppUsage":
        return "Android App Usage";
      default:
        return `${category.charAt(0).toUpperCase() + category.slice(1)} Calendar`;
    }
  }

  function getCalendarDescription(category: string): string {
    switch (category) {
      case "androidAppUsage":
        return "Track Android application usage data";
      default:
        return `Monitor ${category} data from Datafoot`;
    }
  }

  async function handleUpdateCalendar(calendarId: CalendarIdType, updates: {
    name?: string;
    description?: string;
    color?: HexColorType;
    display?: "showInList" | "hiddenInList";
  }) {
    try {
      await updateCalendar({ calendarId, ...updates });
      addToast(null, "Calendar updated successfully!", "success");
      await refreshCalendar();
      setEditingCalendar(null);
    } catch (error: any) {
      addToast(error.title, error.message, "error");
    }
  }

  async function handleDeleteCalendar(calendarId: CalendarIdType, calendarName: string) {
    if (!confirm(`Are you sure you want to delete "${calendarName}"?`)) {
      return;
    }
    try {
      await deleteCalendar({ calendarId });
      addToast(null, "Calendar deleted successfully!", "success");
      await refreshCalendar();
    } catch (error: any) {
      addToast(error.title, error.message, "error");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Datafoot Settings</h1>
      
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
            {datafootCalendars.length > 0 ? (
              <div className="space-y-4">
                {datafootCalendars.map(calendar => (
                  <CalendarEditItem
                    key={calendar.id}
                    calendar={calendar}
                    isEditing={editingCalendar === calendar.id}
                    onEdit={() => setEditingCalendar(calendar.id)}
                    onCancel={() => setEditingCalendar(null)}
                    onUpdate={(updates) => handleUpdateCalendar(calendar.id, updates)}
                    onDelete={() => handleDeleteCalendar(calendar.id, calendar.name)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No datafoot calendars found. Create one below.</p>
            )}
          </div>

          {/* Create New Calendar */}
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-medium mb-4">Create New Calendar</h3>
            <div className="space-y-3">
              {CategoryList.map(category => {
                const existing = datafootCalendars.find(cal => cal.data?.category === category);
                return (
                  <div key={category} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <span className="font-medium">{getCalendarTitle(category)}</span>
                      <p className="text-sm text-gray-500">
                        {getCalendarDescription(category)}
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