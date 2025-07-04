import { useToast } from "@ymwc/react-core";
import React, { useEffect, useState } from "react";
import { updateApiKey } from "../data/setting";

export default function Setting({
  closeModal,
}:{
  closeModal: ()=>void,
}){

  const { addToast } = useToast();

  const [ apiKey, setApiKey ] = useState<string>("");

  function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    
    if (!apiKey || apiKey.trim() === "") {
      addToast("Validation Error", "API Key cannot be empty", "error");
      return;
    }
    
    updateApiKey({ apiKey: apiKey.trim() })
    .then(()=>{
      addToast(null, "API Key was updated successfully.", "success");
      setApiKey("");
      closeModal();
    })
    .catch(error=>{
      console.error("API Key update error:", error);
      addToast(error.title, error.message, "error");
    })
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add API Key</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white p-6 rounded shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="clientId"
            className="block text-sm font-medium text-gray-700"
          >
            ApiKey
          </label>
          <input 
            type="text" 
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
        >Submit</button>
      </form>
    </div>
  );
}