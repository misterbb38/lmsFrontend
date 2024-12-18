// // src/pages/Dashboard.jsx
// import { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext.jsx";
// import { Calendar, User, Briefcase } from "lucide-react"; // des icônes par exemple
// import StudentRequests from "../components/StudentRequests.jsx"; // import du composant

// const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// const Dashboard = () => {
//   const { utilisateur } = useContext(AuthContext);
//   const [appointments, setAppointments] = useState([]);
//   const [exercises, setExercises] = useState([]);
//   const [offers, setOffers] = useState([]);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!utilisateur) return;

//     // Charger les rendez-vous
//     fetch(`${API_BASE_URL}/api/appointments/`, {
//       headers: {
//         "x-auth-token": token,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) {
//           setAppointments(data);
//         }
//       });

//     // Charger les exercices
//     fetch(`${API_BASE_URL}/api/exercises`, {
//       headers: {
//         "x-auth-token": token,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) {
//           setExercises(data);
//         }
//       });

//     // Charger les offres (uniquement pour les élèves ayant réussi leur formation)
//     if (utilisateur.role === "student") {
//       fetch(`${API_BASE_URL}/api/offers`, {
//         headers: {
//           "x-auth-token": token,
//         },
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (Array.isArray(data)) {
//             setOffers(data);
//           }
//         });
//     }
//   }, [utilisateur, token]);

//   const renderAppointmentsTable = (list) => {
//     if (list.length === 0) return <p>Aucun rendez-vous</p>;

//     return (
//       <div className="overflow-x-auto">
//         <table className="table w-full text-sm">
//           <thead>
//             <tr>
//               <th>
//                 <Calendar className="w-4 h-4 inline-block mr-1" />
//                 Date
//               </th>
//               <th>
//                 <Briefcase className="w-4 h-4 inline-block mr-1" />
//                 Sujet
//               </th>
//               <th>
//                 <User className="w-4 h-4 inline-block mr-1" />
//                 Professeur
//               </th>
//               <th>
//                 <User className="w-4 h-4 inline-block mr-1" />
//                 Élève
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {list.map((appt) => (
//               <tr key={appt._id}>
//                 <td>{new Date(appt.date).toLocaleString()}</td>
//                 <td>{appt.sujet || "N/A"}</td>
//                 <td>
//                   {appt.professeur ? appt.professeur.prenom : "Professeur"}
//                 </td>
//                 <td>{appt.eleve ? appt.eleve.prenom : "Libre"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <div className="p-4 space-y-6">
//       <h1 className="text-2xl font-bold">Tableau de bord</h1>

//       <div className="bg-base-100 shadow p-6 rounded space-y-2">
//         <h2 className="text-xl font-semibold">
//           Bienvenue, {utilisateur ? utilisateur.prenom : "Utilisateur"} !
//         </h2>
//         <p className="text-gray-700">
//           Retrouvez ici vos informations clés et votre progression.
//         </p>
//       </div>
//       <div className="p-4 space-y-6">
//         {utilisateur &&
//           (utilisateur.role === "teacher" || utilisateur.role === "admin") && (
//             <StudentRequests />
//           )}
//       </div>

//       {utilisateur && utilisateur.role === "student" && (
//         <div className="bg-base-100 shadow p-6 rounded space-y-4">
//           <h3 className="text-lg font-medium mb-2">Progression</h3>
//           <div className="flex items-center space-x-4">
//             <div className="stat bg-base-200 p-4 rounded">
//               <div className="stat-title text-gray-600">Exercices Assignés</div>
//               <div className="stat-value text-primary">{exercises.length}</div>
//             </div>
//           </div>

//           <h3 className="text-lg font-medium mt-4 mb-2">
//             Prochains Rendez-vous
//           </h3>
//           {renderAppointmentsTable(appointments)}

//           {offers.length > 0 && (
//             <>
//               <h3 className="text-lg font-medium mt-4 mb-2">
//                 Offres disponibles
//               </h3>
//               <ul className="list-none space-y-2">
//                 {offers.map((offer) => (
//                   <li key={offer._id} className="p-2 bg-base-200 rounded">
//                     <strong>{offer.titre}</strong> - {offer.description}
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}
//         </div>
//       )}

//       {utilisateur && utilisateur.role === "teacher" && (
//         <div className="bg-base-100 shadow p-6 rounded space-y-4">
//           <h3 className="text-lg font-medium mb-2">Statistiques Enseignant</h3>
//           <div className="stat bg-base-200 p-4 rounded">
//             <div className="stat-title text-gray-600">Exercices créés</div>
//             <div className="stat-value text-primary">{exercises.length}</div>
//           </div>

//           <h3 className="text-lg font-medium mt-4 mb-2">Vos Rendez-vous</h3>
//           {renderAppointmentsTable(appointments)}
//         </div>
//       )}

//       {utilisateur && utilisateur.role === "admin" && (
//         <div className="bg-base-100 shadow p-6 rounded space-y-4">
//           <h3 className="text-lg font-medium mb-2">Administration</h3>
//           <div className="stat bg-base-200 p-4 rounded">
//             <div className="stat-title text-gray-600">
//               Nombre total d’exercices
//             </div>
//             <div className="stat-value text-primary">{exercises.length}</div>
//           </div>
//           <p className="text-gray-700">
//             Gérer les utilisateurs, les cours, et plus encore.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import StudentDashboard from "../components/StudentDashboard.jsx";
import TeacherDashboard from "../components/TeacherDashboard.jsx";

const Dashboard = () => {
  const { utilisateur } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>

      {utilisateur && utilisateur.role === "student" && (
        <StudentDashboard utilisateur={utilisateur} token={token} />
      )}

      {utilisateur && utilisateur.role === "teacher" && (
        <TeacherDashboard utilisateur={utilisateur} token={token} />
      )}
    </div>
  );
};

export default Dashboard;
