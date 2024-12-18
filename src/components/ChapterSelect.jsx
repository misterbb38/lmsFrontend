// // ChapterSelect.jsx
// import { useState, useEffect } from "react";

// const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// export default function ChapterSelect({ token, onChange }) {
//   const [chapters, setChapters] = useState([]);

//   useEffect(() => {
//     fetchChapters();
//   }, []);

//   async function fetchChapters() {
//     // Endpoint hypothétique
//     const res = await fetch(`${API_BASE_URL}/api/chapters`, {
//       headers: { "x-auth-token": token },
//     });
//     const data = await res.json();
//     if (res.ok) {
//       setChapters(data);
//     } else {
//       console.error(data.message);
//     }
//   }

//   return (
//     <select
//       className="select select-bordered"
//       onChange={(e) => onChange(e.target.value)}
//     >
//       <option value="">Sélectionnez un chapitre</option>
//       {chapters.map((chap) => (
//         <option key={chap._id} value={chap._id}>
//           {chap.titre}
//         </option>
//       ))}
//     </select>
//   );
// }

import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export default function ChapterSelect({ token, onChange }) {
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    fetchChapters();
  }, []);

  async function fetchChapters() {
    const res = await fetch(`${API_BASE_URL}/api/chapters`, {
      headers: { "x-auth-token": token },
    });
    const data = await res.json();
    if (res.ok) {
      setChapters(data);
    } else {
      console.error(data.message);
    }
  }

  return (
    <select
      className="select select-bordered w-full"
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Sélectionnez un chapitre</option>
      {chapters.map((chap) => (
        <option key={chap._id} value={chap._id}>
          {chap.titre}
        </option>
      ))}
    </select>
  );
}
