import { useToast } from "maruyu-webcommons/react/toast";
import React, { useEffect, useState } from "react";
import { Button } from "@ymwc/react-components";
import { fetchAuthorizationUrl, revokeToken, updateCredential } from "../data/setting";

export default function Setting({
  closeModal,
}:{
  closeModal: ()=>void,
}){

  const { addToast } = useToast();

  const [clientId, setClientId] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [redirectUri, setRedirectUri] = useState<string>("");
  const [authorizationUrl, setAuthorizationUrl] = useState<string|null>(null);

  function fetchAuthorizationUri(){
    fetchAuthorizationUrl()
    .then(responseObject=>setAuthorizationUrl(responseObject.authorizationUrl))
    .catch(error=>{
      addToast("AuthorizationUrlFetchFailed", error.message, "warning");
    })
  }
  useEffect(()=>{
    fetchAuthorizationUri()
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

  return (
    <div>
      <p>Google Calendar Setting</p>
      <h1 className="text-2xl font-bold mb-6">Add Credential</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white p-6 rounded shadow-md"
      >
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
      {
        authorizationUrl &&
        <>
          <Button className="bg-green-500 w-full h-8"
            onClick={()=>window.open(authorizationUrl, "_blank", "noopener,noreferrer")}
          >
            <p className="my-0">Open Authorization URL</p>
          </Button>
          <Button className="bg-blue-300 w-full h-8" onClick={() => {
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
        </>
      }
    </div>
  );
}