// import { useState, useEffect } from "react";
// import { Calendar, Briefcase, User } from "lucide-react";

// const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// const TeacherDashboard = ({ utilisateur, token }) => {
//   const [appointments, setAppointments] = useState([]);
//   const [exercises, setExercises] = useState([]);

//   useEffect(() => {
//     if (!utilisateur) return;

//     // Charger les rendez-vous
//     fetch(`${API_BASE_URL}/api/appointments/myAppointments/teacher`, {
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
//                 Élèves
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {list.map((appt) => (
//               <tr key={appt._id}>
//                 <td>{new Date(appt.date).toLocaleString()}</td>
//                 <td>{appt.sujet || "N/A"}</td>
//                 <td>
//                   {appt.eleve && appt.eleve.length > 0 ? (
//                     <ul className="list-disc list-inside">
//                       {appt.eleve.map((student) => (
//                         <li key={student._id}>
//                           {student.user.nom} {student.user.prenom}
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     "Libre"
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <div className="bg-base-100 shadow p-6 rounded space-y-4">
//       <h3 className="text-lg font-medium mb-2">Statistiques Enseignant</h3>
//       <div className="stat bg-base-200 p-4 rounded">
//         <div className="stat-title text-gray-600">Exercices créés</div>
//         <div className="stat-value text-primary">{exercises.length}</div>
//       </div>

//       <h3 className="text-lg font-medium mt-4 mb-2">Vos Rendez-vous</h3>
//       {renderAppointmentsTable(appointments)}
//     </div>
//   );
// };

// export default TeacherDashboard;

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Calendar, Briefcase, User } from "lucide-react";
import StudentRequests from "./StudentRequests";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const TeacherDashboard = ({ utilisateur, token, appointments, exercises }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localAppointments, setLocalAppointments] = useState(
    appointments || []
  );
  const [localExercises, setLocalExercises] = useState(exercises || []);

  useEffect(() => {
    if (!utilisateur) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Charger les rendez-vous
        const appointmentsRes = await fetch(
          `${API_BASE_URL}/api/appointments/myAppointments/teacher`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        const appointmentsData = await appointmentsRes.json();
        if (appointmentsRes.ok && Array.isArray(appointmentsData)) {
          setLocalAppointments(appointmentsData);
        } else {
          throw new Error(
            appointmentsData.message ||
              "Erreur lors du chargement des rendez-vous."
          );
        }

        // Charger les exercices
        const exercisesRes = await fetch(`${API_BASE_URL}/api/exercises`, {
          headers: {
            "x-auth-token": token,
          },
        });
        const exercisesData = await exercisesRes.json();
        if (exercisesRes.ok && Array.isArray(exercisesData)) {
          setLocalExercises(exercisesData);
        } else {
          throw new Error(
            exercisesData.message || "Erreur lors du chargement des exercices."
          );
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données :", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [utilisateur, token]);

  const renderAppointmentsTable = (list) => {
    if (list.length === 0) return <p>Aucun rendez-vous</p>;

    return (
      <div className="overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr>
              <th>
                <Calendar className="w-4 h-4 inline-block mr-1" />
                Date
              </th>
              <th>
                <Briefcase className="w-4 h-4 inline-block mr-1" />
                Sujet
              </th>
              <th>
                <User className="w-4 h-4 inline-block mr-1" />
                Élèves
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((appt) => (
              <tr key={appt._id}>
                <td>{new Date(appt.date).toLocaleString()}</td>
                <td>{appt.sujet || "N/A"}</td>
                <td>
                  {appt.eleve && appt.eleve.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {appt.eleve.map((student) => (
                        <li key={student._id}>
                          {student.user.nom} {student.user.prenom}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "Libre"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="bg-base-100 shadow p-6 rounded space-y-4">
      <div>
        <StudentRequests />
      </div>
      <h3 className="text-lg font-medium mb-2">Statistiques Enseignant</h3>
      <div className="stat bg-base-200 p-4 rounded">
        <div className="stat-title text-gray-600">Exercices créés</div>
        <div className="stat-value text-primary">{localExercises.length}</div>
      </div>

      <h3 className="text-lg font-medium mt-4 mb-2">Vos Rendez-vous</h3>
      {renderAppointmentsTable(localAppointments)}
    </div>
  );
};

// Validation des props avec PropTypes
TeacherDashboard.propTypes = {
  utilisateur: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nom: PropTypes.string,
    prenom: PropTypes.string,
  }).isRequired,
  token: PropTypes.string.isRequired,
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      sujet: PropTypes.string,
      eleve: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          user: PropTypes.shape({
            nom: PropTypes.string.isRequired,
            prenom: PropTypes.string.isRequired,
          }).isRequired,
        })
      ),
    })
  ),
  exercises: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      titre: PropTypes.string,
    })
  ),
};

export default TeacherDashboard;
