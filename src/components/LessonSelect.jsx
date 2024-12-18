// // LessonSelect.jsx
// import { useState, useEffect } from "react";

// const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// export default function LessonSelect({ token, onChange }) {
//   const [lessons, setLessons] = useState([]);

//   useEffect(() => {
//     fetchLessons();
//   }, []);

//   async function fetchLessons() {
//     const res = await fetch(`${API_BASE_URL}/api/lessons`, {
//       headers: { "x-auth-token": token },
//     });
//     const data = await res.json();
//     if (res.ok) {
//       setLessons(data);
//     } else {
//       console.error(data.message);
//     }
//   }

//   return (
//     <select
//       className="select select-bordered"
//       onChange={(e) => onChange(e.target.value)}
//     >
//       <option value="">Sélectionnez une leçon</option>
//       {lessons.map((lesson) => (
//         <option key={lesson._id} value={lesson._id}>
//           {lesson.titre}
//         </option>
//       ))}
//     </select>
//   );
// }

import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export default function LessonSelect({ token, onChange }) {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetchLessons();
  }, []);

  async function fetchLessons() {
    const res = await fetch(`${API_BASE_URL}/api/lessons`, {
      headers: { "x-auth-token": token },
    });
    const data = await res.json();
    if (res.ok) {
      setLessons(data);
    } else {
      console.error(data.message);
    }
  }

  return (
    <select
      className="select select-bordered w-full"
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Sélectionnez une leçon</option>
      {lessons.map((lesson) => (
        <option key={lesson._id} value={lesson._id}>
          {lesson.titre}
        </option>
      ))}
    </select>
  );
}
