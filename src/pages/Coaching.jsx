// import { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext.jsx";
// import { Calendar, Edit, Trash2, CheckCircle, X } from "lucide-react";

// const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// const Coaching = () => {
//   const { utilisateur } = useContext(AuthContext);
//   const [appointments, setAppointments] = useState([]);
//   const [students, setStudents] = useState([]);

//   // Champs pour la création d'un rendez-vous
//   const [selectedDate, setSelectedDate] = useState("");
//   const [sujet, setSujet] = useState("");
//   const [periode, setPeriode] = useState("");
//   const [selectedElevesCreate, setSelectedElevesCreate] = useState([]); // tableau d'IDs d'élèves
//   const [eleveError, setEleveError] = useState(false); // État pour l'erreur
//   const [loading, setLoading] = useState(false);

//   // Champs pour la modification d'un rendez-vous
//   const [editingAppointment, setEditingAppointment] = useState(null);
//   const [editingDate, setEditingDate] = useState("");
//   const [editingSujet, setEditingSujet] = useState("");
//   const [editingPeriode, setEditingPeriode] = useState("");
//   const [editingEleves, setEditingEleves] = useState([]); // tableau d'IDs d'élèves

//   const token = localStorage.getItem("token");
//   const isStudent = utilisateur && utilisateur.role === "student";
//   const isTeacherOrAdmin =
//     utilisateur &&
//     (utilisateur.role === "teacher" || utilisateur.role === "admin");

//   // États pour le modal de sélection d'élèves
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState(null); // "create" ou "edit"
//   const [tempSelected, setTempSelected] = useState([]); // sélection temporaire dans le modal

//   // Charger les rendez-vous selon le rôle
//   useEffect(() => {
//     const fetchAppointments = async () => {
//       if (!utilisateur) return;
//       setLoading(true);

//       let endpoint = "/";
//       if (isStudent) endpoint = "/myAppointments/student";
//       else if (isTeacherOrAdmin) endpoint = "/myAppointments/teacher";

//       const res = await fetch(`${API_BASE_URL}/api/appointments`, {
//         headers: { "x-auth-token": token },
//       });

//       const data = await res.json();
//       if (Array.isArray(data)) {
//         setAppointments(data);
//       }
//       setLoading(false);
//     };
//     fetchAppointments();
//   }, [utilisateur, token, isStudent, isTeacherOrAdmin]);

//   // Charger les élèves du professeur via /api/teachers/eleveprof
//   useEffect(() => {
//     const fetchStudents = async () => {
//       if (isTeacherOrAdmin) {
//         const res = await fetch(`${API_BASE_URL}/api/teachers/eleveprof`, {
//           headers: { "x-auth-token": token },
//         });
//         const data = await res.json();
//         if (Array.isArray(data.students)) {
//           setStudents(data.students);
//         }
//       }
//     };
//     fetchStudents();
//   }, [isTeacherOrAdmin, token]);

//   const handleAddAppointment = async () => {
//     if (!selectedDate || !periode || selectedElevesCreate.length === 0) {
//       if (selectedElevesCreate.length === 0) setEleveError(true); // Définir une erreur si aucun élève n'est sélectionné
//       return; // Empêcher la soumission si les champs obligatoires ne sont pas remplis
//     }

//     setLoading(true);
//     const body = {
//       date: selectedDate,
//       sujet,
//       periode,
//       eleve: selectedElevesCreate,
//     };

//     const res = await fetch(`${API_BASE_URL}/api/appointments`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-auth-token": token,
//       },
//       body: JSON.stringify(body),
//     });
//     const data = await res.json();
//     setLoading(false);
//     if (res.ok) {
//       setAppointments((prev) => [...prev, data.appointment]);
//       setSelectedDate("");
//       setSujet("");
//       setPeriode("");
//       setSelectedElevesCreate([]);
//       setEleveError(false); // Réinitialiser l'erreur
//     } else {
//       alert(data.message || "Erreur lors de la création du rendez-vous");
//     }
//   };

//   const handleBookAppointment = async (appointmentId) => {
//     setLoading(true);
//     const res = await fetch(
//       `${API_BASE_URL}/api/appointments/book/${appointmentId}`,
//       {
//         method: "POST",
//         headers: { "x-auth-token": token },
//       }
//     );
//     const data = await res.json();
//     setLoading(false);
//     if (res.ok) {
//       setAppointments((prev) =>
//         prev.map((appt) =>
//           appt._id === appointmentId ? data.appointment : appt
//         )
//       );
//     } else {
//       alert(data.message || "Erreur lors de la réservation");
//     }
//   };

//   const handleEditClick = (appt) => {
//     setEditingAppointment(appt);
//     setEditingDate(new Date(appt.date).toISOString().split("T")[0]);
//     setEditingSujet(appt.sujet || "");
//     setEditingPeriode(appt.periode || "");
//     // appt.eleve est un tableau d'élèves (ou null)
//     const eleveIds =
//       appt.eleve && Array.isArray(appt.eleve)
//         ? appt.eleve.map((e) => e._id)
//         : [];
//     setEditingEleves(eleveIds);
//   };

//   const handleCancelEdit = () => {
//     setEditingAppointment(null);
//     setEditingDate("");
//     setEditingSujet("");
//     setEditingPeriode("");
//     setEditingEleves([]);
//   };

//   const handleUpdateAppointment = async () => {
//     if (!editingAppointment) return;
//     setLoading(true);

//     const body = {
//       date: editingDate,
//       sujet: editingSujet,
//       periode: editingPeriode,
//       eleve: editingEleves.length === 0 ? null : editingEleves,
//     };

//     const res = await fetch(
//       `${API_BASE_URL}/api/appointments/${editingAppointment._id}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "x-auth-token": token,
//         },
//         body: JSON.stringify(body),
//       }
//     );

//     const data = await res.json();
//     setLoading(false);
//     if (res.ok) {
//       setAppointments((prev) =>
//         prev.map((appt) =>
//           appt._id === editingAppointment._id ? data.appointment : appt
//         )
//       );
//       handleCancelEdit();
//     } else {
//       alert(data.message || "Erreur lors de la mise à jour du rendez-vous");
//     }
//   };

//   const handleDeleteAppointment = async (appointmentId) => {
//     if (!confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) return;
//     setLoading(true);
//     const res = await fetch(
//       `${API_BASE_URL}/api/appointments/${appointmentId}`,
//       {
//         method: "DELETE",
//         headers: { "x-auth-token": token },
//       }
//     );
//     const data = await res.json();
//     setLoading(false);
//     if (res.ok) {
//       setAppointments((prev) =>
//         prev.filter((appt) => appt._id !== appointmentId)
//       );
//     } else {
//       alert(data.message || "Erreur lors de la suppression du rendez-vous");
//     }
//   };

//   // Modal de sélection d'élèves
//   const openModal = (mode) => {
//     // mode: "create" ou "edit"
//     setModalMode(mode);
//     if (mode === "create") {
//       setTempSelected(selectedElevesCreate);
//     } else {
//       setTempSelected(editingEleves);
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = (confirm) => {
//     if (confirm && modalMode === "create") {
//       setSelectedElevesCreate(tempSelected);
//     } else if (confirm && modalMode === "edit") {
//       setEditingEleves(tempSelected);
//     }
//     setIsModalOpen(false);
//     setModalMode(null);
//   };

//   const toggleSelectEleve = (eleveId) => {
//     if (tempSelected.includes(eleveId)) {
//       setTempSelected(tempSelected.filter((id) => id !== eleveId));
//     } else {
//       setTempSelected([...tempSelected, eleveId]);
//     }
//   };

//   // Regrouper les rendez-vous par date
//   const appointmentsByDate = appointments.reduce((acc, appt) => {
//     const dateKey = new Date(appt.date).toLocaleDateString();
//     if (!acc[dateKey]) acc[dateKey] = [];
//     acc[dateKey].push(appt);
//     return acc;
//   }, {});

//   return (
//     <div className="p-4 space-y-6">
//       {/* Modal de sélection d'élèves */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-base-100 p-6 rounded shadow-lg w-full max-w-md space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-xl font-semibold">Sélectionner des élèves</h3>
//               <button
//                 onClick={() => closeModal(false)}
//                 className="btn btn-ghost btn-sm"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//             <div className="max-h-60 overflow-auto space-y-2">
//               {students.map((st) => (
//                 <label
//                   key={st._id}
//                   className="flex items-center space-x-2 cursor-pointer"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={tempSelected.includes(st._id)}
//                     onChange={() => toggleSelectEleve(st._id)}
//                   />
//                   <span>
//                     {st.nom} {st.prenom}
//                   </span>
//                 </label>
//               ))}
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="btn btn-ghost"
//                 onClick={() => closeModal(false)}
//               >
//                 Annuler
//               </button>
//               <button
//                 className="btn btn-primary"
//                 onClick={() => closeModal(true)}
//               >
//                 Valider
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <h1 className="text-2xl font-bold flex items-center space-x-2">
//         <Calendar className="w-6 h-6" />
//         <span>Coaching</span>
//       </h1>
//       <p className="text-gray-700">
//         Gérez ou réservez vos rendez-vous de coaching.
//       </p>

//       {loading && <div className="text-center">Chargement...</div>}

//       {/* Formulaire d'ajout (teacher/admin) */}
//       {isTeacherOrAdmin && (
//         <div className="bg-base-100 p-4 rounded shadow space-y-4">
//           <h2 className="text-xl font-semibold">Ajouter une date disponible</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
//             <div>
//               <label className="label">Date</label>
//               <input
//                 type="date"
//                 className="input input-bordered w-full"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="label">Période</label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full"
//                 value={periode}
//                 onChange={(e) => setPeriode(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="label">Sujet (optionnel)</label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full"
//                 value={sujet}
//                 onChange={(e) => setSujet(e.target.value)}
//               />
//             </div>
//           </div>
//           <div>
//             <label className="label">
//               Élèves <span className="text-red-500">*</span>
//             </label>
//             <div className="space-x-2 flex items-center flex-wrap">
//               {selectedElevesCreate.length === 0 && (
//                 <span className="text-gray-500">Aucun élève sélectionné</span>
//               )}
//               {selectedElevesCreate.map((id) => {
//                 const st = students.find((s) => s._id === id);
//                 return st ? (
//                   <span key={id} className="badge badge-info">
//                     {st.nom} {st.prenom}
//                   </span>
//                 ) : null;
//               })}
//               <button
//                 className="btn btn-sm btn-primary"
//                 onClick={() => openModal("create")}
//               >
//                 Choisir des élèves
//               </button>
//             </div>
//             {eleveError && (
//               <p className="text-red-500 text-sm mt-2">
//                 Veuillez sélectionner au moins un élève.
//               </p>
//             )}
//           </div>

//           <button
//             onClick={handleAddAppointment}
//             className="btn btn-primary mt-4"
//             disabled={!selectedDate || !periode || loading}
//           >
//             Ajouter le rendez-vous
//           </button>
//         </div>
//       )}

//       {/* Formulaire d'édition */}
//       {editingAppointment && (
//         <div className="bg-base-200 p-4 rounded shadow space-y-4">
//           <h2 className="text-xl font-semibold">Modifier le rendez-vous</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="label">Date</label>
//               <input
//                 type="date"
//                 className="input input-bordered w-full"
//                 value={editingDate}
//                 onChange={(e) => setEditingDate(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="label">Période</label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full"
//                 value={editingPeriode}
//                 onChange={(e) => setEditingPeriode(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="label">Sujet</label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full"
//                 value={editingSujet}
//                 onChange={(e) => setEditingSujet(e.target.value)}
//               />
//             </div>
//           </div>
//           <div>
//             <label className="label">Élèves (optionnel)</label>
//             <div className="space-x-2 flex items-center flex-wrap">
//               {editingEleves.length === 0 && (
//                 <span className="text-gray-500">Aucun élève sélectionné</span>
//               )}
//               {editingEleves.map((id) => {
//                 const st = students.find((s) => s._id === id);
//                 return st ? (
//                   <span key={id} className="badge badge-info">
//                     {st.nom} {st.prenom}
//                   </span>
//                 ) : null;
//               })}
//               <button
//                 className="btn btn-sm btn-primary"
//                 onClick={() => openModal("edit")}
//               >
//                 Choisir des élèves
//               </button>
//             </div>
//           </div>
//           <div className="space-x-2">
//             <button
//               className="btn btn-success"
//               onClick={handleUpdateAppointment}
//               disabled={loading}
//             >
//               Enregistrer
//             </button>
//             <button
//               className="btn btn-ghost"
//               onClick={handleCancelEdit}
//               disabled={loading}
//             >
//               Annuler
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Affichage des rendez-vous par date */}
//       <div className="space-y-4">
//         {Object.keys(appointmentsByDate).length === 0 && !loading && (
//           <div className="bg-base-200 p-4 rounded">
//             <p>Aucun rendez-vous disponible.</p>
//           </div>
//         )}
//         {Object.entries(appointmentsByDate).map(([date, appts]) => (
//           <div key={date} className="bg-base-100 p-4 rounded shadow space-y-4">
//             <h3 className="text-lg font-semibold">{date}</h3>
//             <div className="overflow-x-auto">
//               <table className="table w-full text-sm">
//                 <thead>
//                   <tr>
//                     <th>Sujet</th>
//                     <th>Période</th>
//                     <th>Professeur</th>
//                     <th>Élève(s)</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appts.map((appt) => (
//                     <tr key={appt._id}>
//                       <td>{appt.sujet || "N/A"}</td>
//                       <td>{appt.periode}</td>
//                       <td>
//                         {appt.professeur ? appt.professeur.prenom : "N/A"}
//                       </td>
//                       <td>
//                         {appt.eleve && appt.eleve.length > 0
//                           ? appt.eleve
//                               .map((e) => {
//                                 const nom = e.user?.nom;
//                                 const prenom = e.user?.prenom;
//                                 // Si nom et prenom sont définis, on les affiche, sinon "Inconnu"
//                                 return nom && prenom
//                                   ? `${nom} ${prenom}`
//                                   : "Inconnu";
//                               })
//                               .join(", ")
//                           : "Libre"}
//                       </td>

//                       <td className="space-x-2 flex items-center">
//                         {isStudent &&
//                           (!appt.eleve || appt.eleve.length === 0) && (
//                             <button
//                               className="btn btn-sm btn-success flex items-center"
//                               onClick={() => handleBookAppointment(appt._id)}
//                               disabled={loading}
//                             >
//                               <CheckCircle className="w-4 h-4 mr-1" />
//                               Réserver
//                             </button>
//                           )}

//                         {isStudent &&
//                           appt.eleve &&
//                           appt.eleve.some((e) => e._id === utilisateur.id) && (
//                             <span className="text-green-600 font-semibold">
//                               Réservé par vous
//                             </span>
//                           )}

//                         {!isStudent && (
//                           <span className="text-gray-700 mr-2">
//                             {appt.eleve && appt.eleve.length > 0
//                               ? "Déjà réservé"
//                               : "Disponible"}
//                           </span>
//                         )}
//                         {isTeacherOrAdmin && (
//                           <>
//                             <button
//                               className="btn btn-sm btn-warning"
//                               onClick={() => handleEditClick(appt)}
//                               disabled={loading}
//                             >
//                               <Edit className="w-4 h-4" />
//                             </button>
//                             <button
//                               className="btn btn-sm btn-error"
//                               onClick={() => handleDeleteAppointment(appt._id)}
//                               disabled={loading}
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Coaching;
// src/components/Coaching.jsx

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import TeacherCoaching from "../components/TeacherCoaching.jsx";
import StudentCoaching from "../components/StudentCoaching.jsx";

const Coaching = () => {
  const { utilisateur } = useContext(AuthContext);

  const isStudent = utilisateur && utilisateur.role === "student";
  const isTeacherOrAdmin =
    utilisateur &&
    (utilisateur.role === "teacher" || utilisateur.role === "admin");

  return (
    <div>
      {isStudent && <StudentCoaching />}
      {isTeacherOrAdmin && <TeacherCoaching />}
    </div>
  );
};

export default Coaching;
