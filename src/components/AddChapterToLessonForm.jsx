// AddChapterToLessonForm.jsx
import { useState } from "react";
import ChapterSelect from "./ChapterSelect";
import LessonSelect from "./LessonSelect";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export default function AddChapterToLessonForm({ token, onUpdated }) {
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");

  async function linkChapterToLesson(e) {
    e.preventDefault();
    // Endpoint hypothétique
    const res = await fetch(
      `${API_BASE_URL}/api/lessons/${selectedLesson}/addChapter`,
      {
        method: "PUT",
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chapterId: selectedChapter }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      if (onUpdated) onUpdated(data);
    } else {
      console.error(data.message);
    }
  }

  return (
    <form onSubmit={linkChapterToLesson} className="space-y-2">
      <ChapterSelect token={token} onChange={setSelectedChapter} />
      <LessonSelect token={token} onChange={setSelectedLesson} />
      <button className="btn btn-primary">
        Ajouter le chapitre à la leçon
      </button>
    </form>
  );
}
