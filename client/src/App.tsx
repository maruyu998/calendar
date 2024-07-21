import React from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';
import './App.scss';
import V2 from './pages/v2';
import { TopProvider } from './contexts/TopProvider';
import AlertBox from './components/AlertBox';
import Provider from './provider';

export default function App() {
  return (
    <TopProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Provider><V2/></Provider>}></Route>
        </Routes>
      </HashRouter>
      <div className="fixed bottom-2 right-2 z-50">
        <AlertBox />
      </div>
    </TopProvider>
  );
}