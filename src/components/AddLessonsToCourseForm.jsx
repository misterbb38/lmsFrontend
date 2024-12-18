// AddLessonsToCourseForm.jsx
import { useState } from "react";
import LessonSelect from "./LessonSelect";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export default function AddLessonsToCourseForm({
  token,
  courseId,
  onCourseUpdated,
}) {
  const [selectedLesson, setSelectedLesson] = useState("");

  async function addLessonToCourse(e) {
    e.preventDefault();
    const res = await fetch(
      `${API_BASE_URL}/api/courses/${courseId}/addLessons`,
      {
        method: "PUT",
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lessons: [selectedLesson] }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      if (onCourseUpdated) onCourseUpdated(data);
    } else {
      console.error(data.message);
    }
  }

  return (
    <form onSubmit={addLessonToCourse} className="space-y-2">
      <LessonSelect token={token} onChange={setSelectedLesson} />
      <button className="btn btn-primary">Ajouter la leçon au cours</button>
    </form>
  );
}
