import React from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import './App.scss';
import Index from './page';
import { TopProvider } from './contexts/TopProvider';
import Provider from './provider';

export default function App(){
  return (
    <TopProvider>
      <BrowserRouter basename='/app/'>
        <Routes>
          <Route path="/" element={<Provider><Index/></Provider>}></Route>
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
      </BrowserRouter>
    </TopProvider>
  );
}