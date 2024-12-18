// // src/context/AuthContext.jsx
// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [utilisateur, setUtilisateur] = useState(null);

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       setUtilisateur(JSON.parse(userData));
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ utilisateur, setUtilisateur }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialiser directement à partir du localStorage
  const [utilisateur, setUtilisateur] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  // Ce useEffect n’est plus nécessaire pour la récupération initiale
  // useEffect(() => {
  //   const userData = localStorage.getItem("user");
  //   if (userData) {
  //     setUtilisateur(JSON.parse(userData));
  //   }
  // }, []);

  return (
    <AuthContext.Provider value={{ utilisateur, setUtilisateur }}>
      {children}
    </AuthContext.Provider>
  );
};
