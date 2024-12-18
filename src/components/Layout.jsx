// src/components/Layout.jsx

import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Coaching from "../pages/Coaching.jsx";
import MonCours from "../pages/MonCours.jsx";
import FicheDeTravail from "../pages/FicheDeTravail.jsx";
import Offres from "../pages/Offres.jsx";

const Layout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <TopBar />
        {/* Contenu */}
        <div className="p-4 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/coaching" element={<Coaching />} />
            <Route path="/mon-cours" element={<MonCours />} />
            <Route path="/fiche-de-travail" element={<FicheDeTravail />} />
            <Route path="/offres" element={<Offres />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Layout;
