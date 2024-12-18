// src/components/StudentRequests.jsx
import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const StudentRequests = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUnassignedStudents = async () => {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/teachers/new-students`, {
        headers: {
          "x-auth-token": token,
        },
      });
      const data = await res.json();
      setLoading(false);
      if (Array.isArray(data)) {
        setStudents(data);
      }
    };
    fetchUnassignedStudents();
  }, [token]);

  const handleAcceptStudent = async (student) => {
    if (
      !confirm(
        `Voulez-vous accepter ${student.user.prenom} ${student.user.nom} ?`
      )
    )
      return;
    setLoading(true);
    const res = await fetch(
      `${API_BASE_URL}/api/teachers/accept-student/${student.user._id}`,
      {
        method: "POST",
        headers: {
          "x-auth-token": token,
        },
      }
    );
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      // Supprimer l'élève de la liste
      setStudents((prev) => prev.filter((el) => el._id !== student._id));
      alert(data.message || "Élève accepté avec succès");
    } else {
      alert(data.message || "Erreur lors de l'acceptation de l'élève");
    }
  };

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (students.length === 0) {
    return <div className="p-4">Aucun nouvel élève en attente.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Nouveaux Élèves</h2>
      <div className="overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.user.nom}</td>
                <td>{student.user.prenom}</td>
                <td>{student.user.email}</td>
                <td>
                  <button
                    className="btn btn-sm btn-success flex items-center"
                    onClick={() => handleAcceptStudent(student)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Accepter
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentRequests;
