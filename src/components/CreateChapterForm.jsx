// CreateChapterForm.jsx
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export default function CreateChapterForm({
  token,
  coursId,
  onChapterCreated,
}) {
  const [titre, setTitre] = useState("");

  async function addChapter(e) {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/api/chapters`, {
      method: "POST",
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ titre, coursId }),
    });
    const data = await res.json();
    if (res.ok) {
      setTitre("");
      if (onChapterCreated) onChapterCreated(data.chapitre);
    } else {
      console.error(data.message);
    }
  }

  return (
    <form onSubmit={addChapter} className="space-y-2 mt-2">
      <input
        type="text"
        placeholder="Titre du chapitre"
        className="input input-bordered w-full"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        required
      />
      <button className="btn btn-primary">Ajouter Chapitre</button>
    </form>
  );
}
