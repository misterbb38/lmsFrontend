// src/components/AllAppointments.jsx
import { useState, useEffect } from "react";
import { CheckCircle, Calendar } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const AllAppointments = ({ token, onAppointmentBooked, utilisateur }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const isStudent = utilisateur && utilisateur.role === "student";

  useEffect(() => {
    const fetchAllAppointments = async () => {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/appointments`, {
        headers: { "x-auth-token": token },
      });
      const data = await res.json();
      setLoading(false);
      if (Array.isArray(data)) {
        setAppointments(data);
      } else {
        console.error("Erreur lors du chargement des rendez-vous :", data);
      }
    };
    if (token && isStudent) {
      fetchAllAppointments();
    }
  }, [token, isStudent]);

  const handleBookAppointment = async (appointmentId) => {
    if (!isStudent) return;
    const res = await fetch(
      `${API_BASE_URL}/api/appointments/book/${appointmentId}`,
      {
        method: "POST",
        headers: { "x-auth-token": token },
      }
    );
    const data = await res.json();
    if (res.ok) {
      // Mettre à jour l'affichage des rendez-vous
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? data.appointment : appt
        )
      );
      if (onAppointmentBooked) {
        onAppointmentBooked(data.appointment);
      }
      alert("Rendez-vous réservé avec succès !");
    } else {
      alert(data.message || "Erreur lors de la réservation");
    }
  };

  if (!isStudent) {
    return null; // Le composant ne s'affiche que si c'est un étudiant
  }

  return (
    <div className="p-4 space-y-6 bg-base-100 rounded shadow">
      <h2 className="text-xl font-semibold flex items-center space-x-2">
        <Calendar className="w-5 h-5" />
        <span>Tous les Rendez-vous</span>
      </h2>

      {loading && (
        <div className="text-center">Chargement des rendez-vous...</div>
      )}

      {!loading && appointments.length === 0 && (
        <div className="text-center text-gray-500">
          Aucun rendez-vous disponible.
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr>
              <th>Date</th>
              <th>Sujet</th>
              <th>Période</th>
              <th>Professeur</th>
              <th>Élèves</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => {
              const dateStr = new Date(appt.date).toLocaleString();
              const prof = appt.professeur ? appt.professeur.prenom : "N/A";
              const eleves =
                appt.eleve && appt.eleve.length > 0
                  ? appt.eleve
                      .map((e) =>
                        e.user && e.user.prenom ? e.user.prenom : "Inconnu"
                      )
                      .join(", ")
                  : "Libre";

              // Si aucun élève ou vous souhaitez autoriser plusieurs élèves, ajustez la condition
              const isAvailable = !appt.eleve || appt.eleve.length === 0;

              // Vérifier si l'étudiant actuel a déjà réservé
              const isAlreadyBooked =
                appt.eleve && appt.eleve.some((e) => e._id === utilisateur.id);

              return (
                <tr key={appt._id}>
                  <td>{dateStr}</td>
                  <td>{appt.sujet || "N/A"}</td>
                  <td>{appt.periode}</td>
                  <td>{prof}</td>
                  <td>{eleves}</td>
                  <td>
                    {isAlreadyBooked && (
                      <span className="text-green-600 font-semibold">
                        Réservé par vous
                      </span>
                    )}
                    {!isAlreadyBooked && isAvailable && (
                      <button
                        className="btn btn-sm btn-success flex items-center"
                        onClick={() => handleBookAppointment(appt._id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Réserver
                      </button>
                    )}
                    {!isAlreadyBooked && !isAvailable && (
                      <span className="text-gray-500">Déjà réservé</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAppointments;
