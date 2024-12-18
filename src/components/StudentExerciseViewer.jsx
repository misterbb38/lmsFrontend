// StudentExerciseViewer.jsx
import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

function StudentExerciseViewer({ token }) {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetchExercises();
  }, []);

  async function fetchExercises() {
    const res = await fetch(`${API_BASE_URL}/api/exercises`, {
      headers: {
        "x-auth-token": token,
      },
    });
    const data = await res.json();
    if (res.ok) {
      setExercises(data);
    } else {
      console.error(data.message);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Mes Exercices</h2>
      {exercises.map((ex) => (
        <div key={ex._id} className="border p-2 rounded">
          <h3 className="font-semibold">{ex.titre}</h3>
          <p className="text-sm">{ex.description}</p>
          <p className="text-xs">Type: {ex.typeExercice}</p>
          {/* Vous pouvez ajouter un bouton pour soumettre une réponse si nécessaire */}
        </div>
      ))}
    </div>
  );
}

export default StudentExerciseViewer;
