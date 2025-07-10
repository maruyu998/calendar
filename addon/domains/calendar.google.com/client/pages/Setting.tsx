import { useToast } from "@ymwc/react-core";
import React, { useEffect, useState } from "react";
import { Button } from "@ymwc/react-components";
import { fetchAuthorizationUrl, revokeToken, updateCredential, listCalendars, updateCalendarVisibility } from "../data/setting";

export default function Setting({
  closeModal,
}:{
  closeModal: ()=>void,
}){

  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<"credentials" | "calendars">("credentials");
  const [clientId, setClientId] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [redirectUri, setRedirectUri] = useState<string>("");
  const [authorizationUrl, setAuthorizationUrl] = useState<string|null>(null);
  const [googleCalendars, setGoogleCalendars] = useState<Array<{
    id: string;
    name: string;
    description: string;
    googleCalendarId: string;
    timezone: string;
    accessRole: string;
    color: string;
    display: "showInList" | "hiddenInList";
  }>>([]);

  function fetchAuthorizationUri(){
    fetchAuthorizationUrl()
    .then(responseObject=>setAuthorizationUrl(responseObject.authorizationUrl))
    .catch(error=>{
      addToast("AuthorizationUrlFetchFailed", error.message, "warning");
    })
  }

  async function loadGoogleCalendars(){
    try {
      const response = await listCalendars();
      setGoogleCalendars(response.calendars);
    } catch (error: any) {
      addToast("Failed to load calendars", error.message, "error");
    }
  }

  useEffect(()=>{
    loadGoogleCalendars();
  }, [])

  function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    updateCredential({clientId, clientSecret,redirectUri})
    .then(()=>{
      addToast(null, "Credential was updated successfully", "success");
      setClientId("");
      setClientSecret("");
      setRedirectUri("");
      fetchAuthorizationUri();
    })
    .catch(error=>{
      addToast(error.title, error.message, "error");
    })
  };

  function handleGenerateAuthUrl() {
    fetchAuthorizationUri();
  }

  async function handleToggleVisibility(calendarId: string, currentDisplay: "showInList" | "hiddenInList") {
    try {
      const newDisplay = currentDisplay === "showInList" ? "hiddenInList" : "showInList";
      await updateCalendarVisibility({ calendarId, display: newDisplay });
      await loadGoogleCalendars();
      addToast(null, "Calendar visibility updated successfully", "success");
    } catch (error: any) {
      addToast("Failed to update visibility", error.message, "error");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Google Calendar</h1>
      
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("credentials")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "credentials"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Credentials
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

      {/* Credentials Tab */}
      {activeTab === "credentials" && (
        <div className="space-y-6">
          <form
            onSubmit={handleSubmit}
            className="w-full bg-white p-6 rounded shadow-md"
          >
            <h3 className="text-lg font-medium mb-4">Add Credential</h3>
            <div className="mb-4">
              <label
                htmlFor="clientId"
                className="block text-sm font-medium text-gray-700"
              >
                Client ID
              </label>
              <input
                id="clientId"
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Client ID"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="clientSecret"
                className="block text-sm font-medium text-gray-700"
              >
                Client Secret
              </label>
              <input
                id="clientSecret"
                type="text"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Client Secret"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="redirectUri"
                className="block text-sm font-medium text-gray-700"
              >
                Redirect URI
              </label>
              <input
                id="redirectUri"
                type="text"
                value={redirectUri}
                onChange={(e) => setRedirectUri(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Redirect URI"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </form>
          
          <div className="bg-white p-6 rounded shadow-md space-y-4">
            <h3 className="text-lg font-medium">Authorization</h3>
            
            {!authorizationUrl ? (
              <button
                onClick={handleGenerateAuthUrl}
                className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Generate Authorization URL
              </button>
            ) : (
              <div className="space-y-4">
                <Button className="bg-green-500 w-full h-8"
                  onClick={()=>window.open(authorizationUrl, "_blank", "noopener,noreferrer")}
                >
                  <p className="my-0">Open Authorization URL</p>
                </Button>
                <Button className="bg-red-500 w-full h-8" onClick={() => {
                  revokeToken()
                    .then(() => {
                      addToast(null, "Token revoked successfully", "success");
                      setAuthorizationUrl(null);
                    })
                    .catch(error => {
                      addToast("Token Revoke Failed", error.message, "error");
                    });
                }}>
                  <p className="my-0">Disconnect</p>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Calendars Tab */}
      {activeTab === "calendars" && (
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-lg font-medium mb-4">Google Calendars</h3>
          {googleCalendars.length > 0 ? (
            <div className="space-y-4">
              {googleCalendars.map(calendar => {
                const isVisible = calendar.display === "showInList";
                return (
                  <div key={calendar.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      {/* Visibility Toggle Switch */}
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={isVisible}
                            onChange={() => handleToggleVisibility(calendar.id, calendar.display)}
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

                      {/* Color Display */}
                      <div 
                        className="w-8 h-8 border border-gray-300 rounded"
                        style={{ backgroundColor: calendar.color }}
                        title={`Color: ${calendar.color}`}
                      />

                      {/* Calendar Info */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{calendar.name}</span>
                          <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                            {calendar.accessRole}
                          </span>
                        </div>
                        {calendar.description && (
                          <p className="text-sm text-gray-500 mt-1">{calendar.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">ID: {calendar.googleCalendarId}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No Google calendars found. Make sure you have authorized access and refreshed the calendar list.</p>
          )}
        </div>
      )}
    </div>
  );
}