// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Calendar, Book, FileText, Gift } from "lucide-react"; // Icônes pour le menu

const menuItems = [
  { name: "Tableau de bord", icon: Home, path: "/" },
  { name: "Coaching", icon: Calendar, path: "/coaching" },
  { name: "Mon cours", icon: Book, path: "/mon-cours" },
  { name: "Fiche de travail", icon: FileText, path: "/fiche-de-travail" },
  { name: "Offres", icon: Gift, path: "/offres" },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-neutral text-neutral-content flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-neutral-focus">
        <span className="text-xl font-bold">Mon Application</span>
      </div>
      <nav className="sidebar-nav flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `nav-item flex items-center px-4 py-2 hover:bg-gay-100 ${
                  isActive ? "bg-yellow-400 text-black" : ""
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
