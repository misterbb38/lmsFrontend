// TeacherExerciseManager.jsx
import { useState, useEffect } from "react";
import { Plus, Trash } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

function TeacherExerciseManager({ token }) {
  const [exercises, setExercises] = useState([]);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [typeExercice, setTypeExercice] = useState("fichier");
  const [elevesCibles, setElevesCibles] = useState("");
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState("");

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

  async function createExercise(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("typeExercice", typeExercice);
    elevesCibles
      .split(",")
      .map((id) => id.trim())
      .forEach((id) => formData.append("elevesCibles", id));

    if (typeExercice === "fichier" && file) {
      formData.append("fichierExercice", file);
    }
    if (typeExercice === "qcm" && questions) {
      formData.append("questions", questions); // questions en JSON string
    }

    const res = await fetch(`${API_BASE_URL}/api/exercises`, {
      method: "POST",
      headers: {
        "x-auth-token": token,
      },
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      setExercises([...exercises, data.exercice]);
      setTitre("");
      setDescription("");
      setElevesCibles("");
      setFile(null);
      setQuestions("");
    } else {
      console.error(data.message);
    }
  }

  async function deleteExercise(exerciceId) {
    const res = await fetch(`${API_BASE_URL}/api/exercises/${exerciceId}`, {
      method: "DELETE",
      headers: {
        "x-auth-token": token,
      },
    });
    if (res.ok) {
      setExercises(exercises.filter((e) => e._id !== exerciceId));
    } else {
      const data = await res.json();
      console.error(data.message);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Gérer mes exercices</h2>

      {/* Formulaire création d'exercice */}
      <form onSubmit={createExercise} className="space-y-2">
        <input
          type="text"
          placeholder="Titre"
          className="input input-bordered w-full"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="input input-bordered w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="select select-bordered w-full"
          value={typeExercice}
          onChange={(e) => setTypeExercice(e.target.value)}
        >
          <option value="fichier">Exercice par fichier</option>
          <option value="qcm">QCM</option>
        </select>
        <input
          type="text"
          placeholder="Élèves cibles (IDs, séparés par des virgules)"
          className="input input-bordered w-full"
          value={elevesCibles}
          onChange={(e) => setElevesCibles(e.target.value)}
        />

        {typeExercice === "fichier" && (
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={(e) => setFile(e.target.files[0])}
          />
        )}

        {typeExercice === "qcm" && (
          <textarea
            placeholder='Questions en JSON (ex: [{"question":"...","options":["A","B","C"],"bonneReponse":"A"}])'
            className="textarea textarea-bordered w-full"
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
          ></textarea>
        )}

        <button type="submit" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-1" /> Créer Exercice
        </button>
      </form>

      <div className="space-y-2">
        {exercises.map((ex) => (
          <div
            key={ex._id}
            className="border p-2 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{ex.titre}</h3>
              <p className="text-sm">{ex.description}</p>
              <p className="text-xs">Type: {ex.typeExercice}</p>
            </div>
            <button
              className="btn btn-sm btn-error"
              onClick={() => deleteExercise(ex._id)}
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherExerciseManager;
