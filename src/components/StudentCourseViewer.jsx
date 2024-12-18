// // StudentCourseViewer.jsx
// import { useState, useEffect } from "react";
// const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// function StudentCourseViewer({ token }) {
//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   async function fetchCourses() {
//     const res = await fetch(`${API_BASE_URL}/api/courses`, {
//       headers: {
//         "x-auth-token": token,
//       },
//     });
//     const data = await res.json();
//     // On suppose que si l'utilisateur est un student, l'API /api/courses return les cours qui lui sont dédiés
//     if (res.ok) {
//       setCourses(data);
//     } else {
//       console.error(data.message);
//     }
//   }

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-xl font-bold">Mes Cours</h2>
//       {courses.map((course) => (
//         <div key={course._id} className="border p-2 rounded">
//           <h3 className="font-semibold">{course.titre}</h3>
//           <p className="text-sm">{course.description}</p>
//           <div className="mt-2 pl-4 space-y-1">
//             {course.chapitres &&
//               course.chapitres.map((chap) => (
//                 <div key={chap._id}>
//                   <strong>{chap.titre}</strong>
//                   <ul className="list-disc list-inside">
//                     {chap.lecons &&
//                       chap.lecons.map((lesson) => (
//                         <li key={lesson._id}>{lesson.titre}</li>
//                       ))}
//                   </ul>
//                 </div>
//               ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default StudentCourseViewer;

// StudentCourseViewer.jsx
import { useState, useEffect } from "react";
import { Trash } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

function StudentCourseViewer({ token }) {
  const [courses, setCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showLessonContent, setShowLessonContent] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/students/my-courses`, {
        headers: { "x-auth-token": token },
      });
      const data = await res.json();
      if (res.ok) {
        setCourses(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des cours :", error);
    }
  }

  function openCourseModal(course) {
    setSelectedCourse(course);
    setModalOpen(true);
    setShowLessonContent({});
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedCourse(null);
  }

  function toggleLessonContent(lessonId) {
    setShowLessonContent((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Mes Cours</h2>
      {courses.length === 0 && (
        <div className="text-gray-500">
          Aucun cours disponible pour le moment.
        </div>
      )}
      {courses.map((course) => (
        <div key={course._id} className="border p-4 rounded shadow-sm bg-white">
          <h3 className="font-semibold text-lg">{course.titre}</h3>
          <p className="text-sm mb-2">{course.description}</p>
          <p className="text-sm text-gray-600">
            Professeur :{" "}
            {course.professeur
              ? `${course.professeur.nom || "Nom inconnu"} ${
                  course.professeur.prenom || ""
                }`
              : "Professeur non défini"}
          </p>
          <button
            className="btn btn-sm mt-2"
            onClick={() => openCourseModal(course)}
          >
            Consulter le cours
          </button>
        </div>
      ))}

      {/* Modal DaisyUI pour afficher les chapitres et leçons */}
      {modalOpen && selectedCourse && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">{selectedCourse.titre}</h3>

            {selectedCourse.chapitres && selectedCourse.chapitres.length > 0 ? (
              selectedCourse.chapitres.map((chap) => (
                <div key={chap._id} className="mb-4">
                  <h4 className="font-medium text-md mb-2">{chap.titre}</h4>
                  {chap.lecons && chap.lecons.length > 0 ? (
                    chap.lecons.map((lesson) => (
                      <div
                        key={lesson._id}
                        className="border p-2 rounded space-y-2 mb-2"
                      >
                        <div className="flex justify-between items-center">
                          <h5 className="font-semibold">{lesson.titre}</h5>
                          <button
                            className="btn btn-xs mt-1"
                            onClick={() => toggleLessonContent(lesson._id)}
                          >
                            {showLessonContent[lesson._id]
                              ? "Cacher le contenu"
                              : "Afficher le contenu"}
                          </button>
                        </div>
                        {showLessonContent[lesson._id] && (
                          <div className="mt-2 text-sm">
                            {/* Affichage sécurisé du contenu sans balises */}
                            <div
                              className="ql-editor"
                              dangerouslySetInnerHTML={{
                                __html: lesson.contenu,
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Aucune leçon disponible</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">Aucun chapitre disponible</p>
            )}

            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                Fermer
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeModal}></div>
        </div>
      )}
    </div>
  );
}

export default StudentCourseViewer;
