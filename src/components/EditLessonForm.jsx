// // EditLessonForm.jsx
// import { useState } from "react";

// const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// export default function EditLessonForm({
//   token,
//   lesson,
//   onLessonUpdated,
//   onCancel,
// }) {
//   const [titre, setTitre] = useState(lesson.titre || "");
//   const [contenu, setContenu] = useState(lesson.contenu || "");
//   const [error, setError] = useState("");

//   async function updateLesson(e) {
//     e.preventDefault();
//     setError("");
//     if (!titre.trim()) {
//       setError("Le titre est requis");
//       return;
//     }

//     const res = await fetch(`${API_BASE_URL}/api/lessons/${lesson._id}`, {
//       method: "PUT",
//       headers: {
//         "x-auth-token": token,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ titre, contenu }),
//     });
//     const data = await res.json();
//     if (res.ok) {
//       onLessonUpdated(); // Signaler au parent qu’on a fini
//     } else {
//       setError(data.message || "Erreur lors de la mise à jour de la leçon");
//     }
//   }

//   return (
//     <form onSubmit={updateLesson} className="space-y-2 mt-2">
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
//       <div className="space-x-2">
//         <button className="btn btn-primary">Mettre à jour</button>
//         <button type="button" className="btn" onClick={onCancel}>
//           Annuler
//         </button>
//       </div>
//     </form>
//   );
// }

// EditLessonForm.jsx
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export default function EditLessonForm({
  token,
  lesson,
  onLessonUpdated,
  onCancel,
}) {
  const [titre, setTitre] = useState(lesson.titre || "");
  const [contenu, setContenu] = useState(lesson.contenu || "");
  const [error, setError] = useState("");

  async function updateLesson(e) {
    e.preventDefault();
    setError("");
    if (!titre.trim()) {
      setError("Le titre est requis");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/lessons/${lesson._id}`, {
      method: "PUT",
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ titre, contenu }),
    });
    const data = await res.json();
    if (res.ok) {
      onLessonUpdated(); // Signaler au parent qu’on a fini
    } else {
      setError(data.message || "Erreur lors de la mise à jour de la leçon");
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
    <form onSubmit={updateLesson} className="space-y-2 mt-2">
      {error && <div className="alert alert-error">{error}</div>}
      <input
        type="text"
        placeholder="Titre de la leçon"
        className="input input-bordered w-full"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        required
      />

      <ReactQuill
        value={contenu}
        onChange={setContenu}
        theme="snow"
        placeholder="Modifier le contenu de la leçon"
        className="bg-white"
        modules={quillModules}
      />

      <div className="space-x-2">
        <button className="btn btn-primary">Mettre à jour</button>
        <button type="button" className="btn" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}
