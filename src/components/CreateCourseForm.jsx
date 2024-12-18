// // CreateCourseForm.jsx
// import { useState } from "react";

// const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// export default function CreateCourseForm({ token, onCourseCreated }) {
//   const [titre, setTitre] = useState("");
//   const [description, setDescription] = useState("");
//   const [elevesVises, setElevesVises] = useState("");

//   async function createCourse(e) {
//     e.preventDefault();
//     const res = await fetch(`${API_BASE_URL}/api/courses`, {
//       method: "POST",
//       headers: {
//         "x-auth-token": token,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         titre,
//         description,
//         elevesVises: elevesVises
//           ? elevesVises.split(",").map((id) => id.trim())
//           : [],
//       }),
//     });
//     const data = await res.json();
//     if (res.ok) {
//       setTitre("");
//       setDescription("");
//       setElevesVises("");
//       if (onCourseCreated) onCourseCreated(data.cours);
//     } else {
//       console.error(data.message);
//     }
//   }

//   return (
//     <form onSubmit={createCourse} className="space-y-2">
//       <input
//         type="text"
//         placeholder="Titre du cours"
//         className="input input-bordered w-full"
//         value={titre}
//         onChange={(e) => setTitre(e.target.value)}
//         required
//       />
//       <textarea
//         placeholder="Description du cours"
//         className="textarea textarea-bordered w-full"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       ></textarea>
//       <input
//         type="text"
//         placeholder="Élèves visés (IDs séparés par des virgules)"
//         className="input input-bordered w-full"
//         value={elevesVises}
//         onChange={(e) => setElevesVises(e.target.value)}
//       />
//       <button type="submit" className="btn btn-primary">
//         Créer un cours
//       </button>
//     </form>
//   );
// }

// CreateCourseForm.jsx
import { useState, useEffect, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export default function CreateCourseForm({ token, onCourseCreated }) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [elevesVises, setElevesVises] = useState([]);
  const [students, setStudents] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    // Récupérer les élèves du professeur connecté
    async function fetchTeacherStudents() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/teachers/eleveprof`, {
          headers: {
            "x-auth-token": token,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setStudents(data.students || []);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des élèves du professeur:",
          error
        );
      }
    }

    if (token) {
      fetchTeacherStudents();
    }
  }, [token]);

  useEffect(() => {
    // Fermer le menu déroulant si on clique en dehors
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function toggleDropdown() {
    setDropdownOpen((prev) => !prev);
  }

  function handleCheckboxChange(e, studentId) {
    if (e.target.checked) {
      setElevesVises((prev) => [...prev, studentId]);
    } else {
      setElevesVises((prev) => prev.filter((id) => id !== studentId));
    }
  }

  async function createCourse(e) {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/api/courses`, {
      method: "POST",
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titre,
        description,
        elevesVises,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setTitre("");
      setDescription("");
      setElevesVises([]);
      if (onCourseCreated) onCourseCreated(data.cours);
    } else {
      console.error(data.message);
    }
  }

  const selectedStudents = students.filter((std) =>
    elevesVises.includes(std._id)
  );

  return (
    <form onSubmit={createCourse} className="space-y-2">
      <input
        type="text"
        placeholder="Titre du cours"
        className="input input-bordered w-full"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        required
      />

      <textarea
        placeholder="Description du cours"
        className="textarea textarea-bordered w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      {/* Bloc pour la sélection des étudiants */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className="btn btn-secondary w-full"
          onClick={toggleDropdown}
        >
          {selectedStudents.length > 0
            ? `Étudiants sélectionnés : ${selectedStudents
                .map((s) => `${s.nom} ${s.prenom}`)
                .join(", ")}`
            : "Choisir des étudiants"}
        </button>
        {dropdownOpen && (
          <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-48 overflow-auto mt-1">
            {students.map((student) => (
              <label
                key={student._id}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={elevesVises.includes(student._id)}
                  onChange={(e) => handleCheckboxChange(e, student._id)}
                />
                <span>
                  {student.nom} {student.prenom}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        Créer un cours
      </button>
    </form>
  );
}
