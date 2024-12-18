// import { useState, useEffect } from "react";
// import { Calendar, Briefcase, User } from "lucide-react";

// const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// const StudentDashboard = ({ utilisateur, token }) => {
//   const [appointments, setAppointments] = useState([]);
//   const [exercises, setExercises] = useState([]);
//   const [offers, setOffers] = useState([]);

//   useEffect(() => {
//     if (!utilisateur) return;

//     // Charger les rendez-vous
//     fetch(`${API_BASE_URL}/api/appointments/myAppointments/student`, {
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

//     // Charger les offres
//     fetch(`${API_BASE_URL}/api/offers`, {
//       headers: {
//         "x-auth-token": token,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) {
//           setOffers(data);
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
//                 Professeur
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
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <div className="bg-base-100 shadow p-6 rounded space-y-4">
//       <h3 className="text-lg font-medium mb-2">Progression</h3>
//       <div className="stat bg-base-200 p-4 rounded">
//         <div className="stat-title text-gray-600">Exercices Assignés</div>
//         <div className="stat-value text-primary">{exercises.length}</div>
//       </div>

//       <h3 className="text-lg font-medium mt-4 mb-2">Prochains Rendez-vous</h3>
//       {renderAppointmentsTable(appointments)}

//       {offers.length > 0 && (
//         <>
//           <h3 className="text-lg font-medium mt-4 mb-2">Offres disponibles</h3>
//           <ul className="list-none space-y-2">
//             {offers.map((offer) => (
//               <li key={offer._id} className="p-2 bg-base-200 rounded">
//                 <strong>{offer.titre}</strong> - {offer.description}
//               </li>
//             ))}
//           </ul>
//         </>
//       )}
//     </div>
//   );
// };

// export default StudentDashboard;

// import { useState, useEffect } from "react";
// import { Calendar, Briefcase, User } from "lucide-react";

// const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// const StudentDashboard = ({ utilisateur, token }) => {
//   const [appointments, setAppointments] = useState([]);
//   const [exercises, setExercises] = useState([]);
//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!utilisateur) return;

//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         // Charger les rendez-vous
//         const appointmentsRes = await fetch(
//           `${API_BASE_URL}/api/appointments/myAppointments/student`,
//           {
//             headers: {
//               "x-auth-token": token,
//             },
//           }
//         );
//         const appointmentsData = await appointmentsRes.json();
//         if (appointmentsRes.ok && Array.isArray(appointmentsData)) {
//           setAppointments(appointmentsData);
//         } else {
//           throw new Error(
//             appointmentsData.message ||
//               "Erreur lors du chargement des rendez-vous."
//           );
//         }

//         // Charger les exercices
//         const exercisesRes = await fetch(`${API_BASE_URL}/api/exercises`, {
//           headers: {
//             "x-auth-token": token,
//           },
//         });
//         const exercisesData = await exercisesRes.json();
//         if (exercisesRes.ok && Array.isArray(exercisesData)) {
//           setExercises(exercisesData);
//         } else {
//           throw new Error(
//             exercisesData.message || "Erreur lors du chargement des exercices."
//           );
//         }

//         // // Charger les offres
//         // const offersRes = await fetch(`${API_BASE_URL}/api/offers`, {
//         //   headers: {
//         //     "x-auth-token": token,
//         //   },
//         // });
//         // const offersData = await offersRes.json();
//         // if (offersRes.ok && Array.isArray(offersData)) {
//         //   setOffers(offersData);
//         // } else {
//         //   throw new Error(
//         //     offersData.message || "Erreur lors du chargement des offres."
//         //   );
//         // }
//       } catch (err) {
//         console.error("Erreur lors du chargement des données :", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
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
//             </tr>
//           </thead>
//           <tbody>
//             {list.map((appt) => (
//               <tr key={appt._id}>
//                 <td>{new Date(appt.date).toLocaleString()}</td>
//                 <td>{appt.sujet || "N/A"}</td>
//                 <td>
//                   {appt.professeur && appt.professeur.user
//                     ? `${appt.professeur.user.nom} ${appt.professeur.user.prenom}`
//                     : "Professeur inconnu"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   if (loading) {
//     return <div>Chargement en cours...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500">Erreur : {error}</div>;
//   }

//   return (
//     <div className="bg-base-100 shadow p-6 rounded space-y-4">
//       <h3 className="text-lg font-medium mb-2">Progression</h3>
//       <div className="stat bg-base-200 p-4 rounded">
//         <div className="stat-title text-gray-600">Exercices Assignés</div>
//         <div className="stat-value text-primary">{exercises.length}</div>
//       </div>

//       <h3 className="text-lg font-medium mt-4 mb-2">Prochains Rendez-vous</h3>
//       {renderAppointmentsTable(appointments)}

//       {/* {offers.length > 0 && (
//         <>
//           <h3 className="text-lg font-medium mt-4 mb-2">Offres disponibles</h3>
//           <ul className="list-none space-y-2">
//             {offers.map((offer) => (
//               <li key={offer._id} className="p-2 bg-base-200 rounded">
//                 <strong>{offer.titre}</strong> - {offer.description}
//               </li>
//             ))}
//           </ul>
//         </>
//       )} */}
//     </div>
//   );
// };

// export default StudentDashboard;

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Calendar, Briefcase, User } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const StudentDashboard = ({ utilisateur, token }) => {
  const [appointments, setAppointments] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!utilisateur) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Charger les rendez-vous
        const appointmentsRes = await fetch(
          `${API_BASE_URL}/api/appointments/myAppointments/student`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        const appointmentsData = await appointmentsRes.json();
        if (appointmentsRes.ok && Array.isArray(appointmentsData)) {
          setAppointments(appointmentsData);
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
          setExercises(exercisesData);
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
                Professeur
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((appt) => (
              <tr key={appt._id}>
                <td>{new Date(appt.date).toLocaleString()}</td>
                <td>{appt.sujet || "N/A"}</td>
                <td>
                  {appt.professeur && appt.professeur.user
                    ? `${appt.professeur.user.nom} ${appt.professeur.user.prenom}`
                    : "Professeur inconnu"}
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
      <h3 className="text-lg font-medium mb-2">Progression</h3>
      <div className="stat bg-base-200 p-4 rounded">
        <div className="stat-title text-gray-600">Exercices Assignés</div>
        <div className="stat-value text-primary">{exercises.length}</div>
      </div>

      <h3 className="text-lg font-medium mt-4 mb-2">Prochains Rendez-vous</h3>
      {renderAppointmentsTable(appointments)}
    </div>
  );
};

// Validation des props avec PropTypes
StudentDashboard.propTypes = {
  utilisateur: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nom: PropTypes.string,
    prenom: PropTypes.string,
  }).isRequired,
  token: PropTypes.string.isRequired,
};

export default StudentDashboard;
