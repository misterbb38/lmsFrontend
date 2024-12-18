// // CreateLessonForm.jsx
// import { useState } from "react";

// const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// export default function CreateLessonForm({
//   token,
//   chapitreId,
//   onLessonCreated,
// }) {
//   const [titre, setTitre] = useState("");
//   const [contenu, setContenu] = useState("");
//   const [error, setError] = useState("");

//   async function addLesson(e) {
//     e.preventDefault();
//     setError("");
//     if (!titre.trim()) {
//       setError("Le titre est requis");
//       return;
//     }

//     const res = await fetch(`${API_BASE_URL}/api/lessons`, {
//       method: "POST",
//       headers: {
//         "x-auth-token": token,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ titre, contenu, chapitreId }),
//     });
//     const data = await res.json();
//     if (res.ok) {
//       setTitre("");
//       setContenu("");
//       if (onLessonCreated) onLessonCreated(data.lecon);
//     } else {
//       setError(data.message || "Erreur lors de la création de la leçon");
//     }
//   }

//   return (
//     <form onSubmit={addLesson} className="space-y-2 mt-2">
//       {error && <div className="alert alert-error">{error}</div>}
//       <input
//         type="text"
//         placeholder="Titre de la leçon"
//         className="input input-bordered w-full"
//         value={titre}
//         onChange={(e) => setTitre(e.target.value)}
//         required
//       />
//       <textarea
//         placeholder="Contenu de la leçon"
//         className="textarea textarea-bordered w-full"
//         value={contenu}
//         onChange={(e) => setContenu(e.target.value)}
//       ></textarea>
//       <button className="btn btn-primary">Ajouter Leçon</button>
//     </form>
//   );
// }

import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import du CSS de Quill

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export default function CreateLessonForm({
  token,
  chapitreId,
  onLessonCreated,
}) {
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [error, setError] = useState("");

  async function addLesson(e) {
    e.preventDefault();
    setError("");
    if (!titre.trim()) {
      setError("Le titre est requis");
      return;
    }

    // contenu est du HTML généré par l'éditeur Quill
    const res = await fetch(`${API_BASE_URL}/api/lessons`, {
      method: "POST",
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ titre, contenu, chapitreId }),
    });
    const data = await res.json();
    if (res.ok) {
      setTitre("");
      setContenu("");
      if (onLessonCreated) onLessonCreated(data.lecon);
    } else {
      setError(data.message || "Erreur lors de la création de la leçon");
    }
  }

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  return (
    <form onSubmit={addLesson} className="space-y-2 mt-2">
      {error && <div className="alert alert-error">{error}</div>}
      <input
        type="text"
        placeholder="Titre de la leçon"
        className="input input-bordered w-full"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        required
      />

      {/* Éditeur riche ReactQuill pour le contenu */}
      <ReactQuill
        value={contenu}
        onChange={setContenu}
        theme="snow"
        placeholder="Contenu de la leçon (texte formaté, listes, etc.)"
        className="bg-white"
        modules={quillModules}
      />

      <button className="btn btn-primary">Ajouter Leçon</button>
    </form>
  );
}
