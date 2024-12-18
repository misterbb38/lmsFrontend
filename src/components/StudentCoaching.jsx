// // src/components/StudentCoaching.jsx

// import { useContext, useState, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext.jsx";
// import { Calendar, CheckCircle } from "lucide-react";

// const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// const StudentCoaching = () => {
//   const { utilisateur } = useContext(AuthContext);
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       if (!utilisateur) return;
//       setLoading(true);
//       try {
//         const res = await fetch(`${API_BASE_URL}/api/appointments/`, {
//           headers: { "x-auth-token": token },
//         });
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setAppointments(data);
//         }
//       } catch (error) {
//         console.error("Erreur lors de la récupération des rendez-vous:", error);
//         alert("Erreur lors de la récupération des rendez-vous.");
//       }
//       setLoading(false);
//     };

//     fetchAppointments();
//   }, [token, utilisateur]);

//   const handleBookAppointment = async (appointmentId) => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `${API_BASE_URL}/api/appointments/book/${appointmentId}`,
//         {
//           method: "POST",
//           headers: { "x-auth-token": token },
//         }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         setAppointments((prev) =>
//           prev.map((appt) =>
//             appt._id === appointmentId ? data.appointment : appt
//           )
//         );
//       } else {
//         alert(data.message || "Erreur lors de la réservation");
//       }
//     } catch (error) {
//       console.error("Erreur lors de la réservation:", error);
//       alert("Erreur lors de la réservation.");
//     }
//     setLoading(false);
//   };

//   // Séparer les rendez-vous en réservés et disponibles
//   const reservedAppointments = appointments.filter((appt) =>
//     appt.eleve?.some((e) => e._id === utilisateur.id)
//   );

//   const availableAppointments = appointments.filter(
//     (appt) => !appt.eleve?.some((e) => e._id === utilisateur.id)
//   );

//   return (
//     <div className="p-4 space-y-6">
//       <h1 className="text-2xl font-bold flex items-center space-x-2">
//         <Calendar className="w-6 h-6" />
//         <span>Coaching</span>
//       </h1>
//       <p className="text-gray-700">
//         Consultez vos réservations et les rendez-vous disponibles.
//       </p>

//       {loading && <div className="text-center">Chargement...</div>}

//       <div className="space-y-10">
//         {/* Rendez-vous réservés */}
//         <section>
//           <h2 className="text-2xl font-semibold mb-4">Vos réservations</h2>
//           {reservedAppointments.length === 0 ? (
//             <p className="text-gray-500">Aucun rendez-vous réservé.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {reservedAppointments.map((appt) => (
//                 <div
//                   key={appt._id}
//                   className="bg-green-100 border border-green-300 rounded-lg shadow-md p-4 space-y-2"
//                 >
//                   <h3 className="text-lg font-semibold">
//                     {appt.sujet || "Coaching"}
//                   </h3>
//                   <p>
//                     <strong>Date :</strong>{" "}
//                     {new Date(appt.date).toLocaleDateString()}
//                   </p>
//                   <p>
//                     <strong>Période :</strong> {appt.periode}
//                   </p>
//                   <p>
//                     <strong>Professeur :</strong>{" "}
//                     {appt.professeur
//                       ? `${appt.professeur.user.nom} ${appt.professeur.user.prenom}`
//                       : "N/A"}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Rendez-vous disponibles */}
//         <section>
//           <h2 className="text-2xl font-semibold mb-4">
//             Rendez-vous disponibles
//           </h2>
//           {availableAppointments.length === 0 ? (
//             <p className="text-gray-500">Aucun rendez-vous disponible.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {availableAppointments.map((appt) => (
//                 <div
//                   key={appt._id}
//                   className="bg-blue-100 border border-blue-300 rounded-lg shadow-md p-4 space-y-2"
//                 >
//                   <h3 className="text-lg font-semibold">
//                     {appt.sujet || "Coaching"}
//                   </h3>
//                   <p>
//                     <strong>Date :</strong>{" "}
//                     {new Date(appt.date).toLocaleDateString()}
//                   </p>
//                   <p>
//                     <strong>Période :</strong> {appt.periode}
//                   </p>
//                   <p>
//                     <strong>Professeur :</strong>{" "}
//                     {appt.professeur
//                       ? `${appt.professeur.nom} ${appt.professeur.prenom}`
//                       : "N/A"}
//                   </p>
//                   <button
//                     onClick={() => handleBookAppointment(appt._id)}
//                     className="btn btn-success w-full flex items-center justify-center"
//                     disabled={loading}
//                   >
//                     <CheckCircle className="w-5 h-5 mr-2" />
//                     Réserver
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default StudentCoaching;

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Calendar, CheckCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const StudentCoaching = () => {
  const { utilisateur } = useContext(AuthContext);
  const [reservedAppointments, setReservedAppointments] = useState([]);
  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReservedAppointments = async () => {
      if (!utilisateur) return;
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/appointments/myAppointments/student`,
          {
            headers: { "x-auth-token": token },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setReservedAppointments(data);
        } else {
          alert(
            data.message ||
              "Erreur lors de la récupération des rendez-vous réservés."
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des rendez-vous réservés:",
          error
        );
        alert("Erreur lors de la récupération des rendez-vous réservés.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAvailableAppointments = async () => {
      if (!utilisateur) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/appointments/`, {
          headers: { "x-auth-token": token },
        });
        const data = await res.json();
        if (res.ok) {
          setAvailableAppointments(
            data.filter(
              (appt) => !appt.eleve?.some((e) => e._id === utilisateur.id)
            )
          );
        } else {
          alert(
            data.message ||
              "Erreur lors de la récupération des rendez-vous disponibles."
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des rendez-vous disponibles:",
          error
        );
        alert("Erreur lors de la récupération des rendez-vous disponibles.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservedAppointments();
    fetchAvailableAppointments();
  }, [token, utilisateur]);

  const handleBookAppointment = async (appointmentId) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/appointments/book/${appointmentId}`,
        {
          method: "POST",
          headers: { "x-auth-token": token },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setReservedAppointments((prev) => [...prev, data.appointment]);
        setAvailableAppointments((prev) =>
          prev.filter((appt) => appt._id !== appointmentId)
        );
        alert("Rendez-vous réservé avec succès.");
      } else {
        alert(data.message || "Erreur lors de la réservation.");
      }
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      alert("Erreur lors de la réservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold flex items-center space-x-2">
        <Calendar className="w-6 h-6" />
        <span>Coaching</span>
      </h1>
      <p className="text-gray-700">
        Consultez vos réservations et les rendez-vous disponibles.
      </p>

      {loading && <div className="text-center">Chargement...</div>}

      <div className="space-y-10">
        {/* Rendez-vous réservés */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Vos réservations</h2>
          {reservedAppointments.length === 0 ? (
            <p className="text-gray-500">Aucun rendez-vous réservé.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reservedAppointments.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-green-100 border border-green-300 rounded-lg shadow-md p-4 space-y-2"
                >
                  <h3 className="text-lg font-semibold">
                    {appt.sujet || "Coaching"}
                  </h3>
                  <p>
                    <strong>Date :</strong>{" "}
                    {new Date(appt.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Sujet :</strong> {appt.sujet}
                  </p>
                  <p>
                    <strong>Période :</strong> {appt.periode}
                  </p>
                  <p>
                    <strong>Professeur :</strong>{" "}
                    {appt.professeur
                      ? `${appt.professeur.user.nom} ${appt.professeur.user.prenom}`
                      : "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Rendez-vous disponibles */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Rendez-vous disponibles
          </h2>
          {availableAppointments.length === 0 ? (
            <p className="text-gray-500">Aucun rendez-vous disponible.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableAppointments.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-blue-100 border border-blue-300 rounded-lg shadow-md p-4 space-y-2"
                >
                  <h3 className="text-lg font-semibold">
                    {appt.sujet || "Coaching"}
                  </h3>
                  <p>
                    <strong>Date :</strong>{" "}
                    {new Date(appt.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Sujet :</strong> {appt.sujet}
                  </p>
                  <p>
                    <strong>Période :</strong> {appt.periode}
                  </p>
                  <p>
                    <strong>Professeur :</strong>{" "}
                    {appt.professeur
                      ? `${appt.professeur.user.nom} ${appt.professeur.user.prenom}`
                      : "N/A"}
                  </p>
                  <button
                    onClick={() => handleBookAppointment(appt._id)}
                    className="btn btn-success w-full flex items-center justify-center"
                    disabled={loading}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Réserver
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentCoaching;
