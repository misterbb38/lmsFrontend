import { useState, useEffect } from "react";
import CreateCourseForm from "./CreateCourseForm";
import CreateChapterForm from "./CreateChapterForm";
import CreateLessonForm from "./CreateLessonForm";
import EditLessonForm from "./EditLessonForm";
import { Trash } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export default function TeacherCourseManager({ token }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);

  const [allLessons, setAllLessons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showLessonContent, setShowLessonContent] = useState({});
  const [editingLessonId, setEditingLessonId] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchLessons();
  }, []);

  async function fetchCourses() {
    const res = await fetch(`${API_BASE_URL}/api/courses`, {
      headers: { "x-auth-token": token },
    });
    const data = await res.json();
    if (res.ok) {
      setCourses(data);
    } else {
      console.error(data.message);
    }
  }

  async function fetchLessons() {
    const res = await fetch(`${API_BASE_URL}/api/lessons`, {
      headers: { "x-auth-token": token },
    });
    const data = await res.json();
    if (res.ok) {
      setAllLessons(data);
    } else {
      console.error(data.message);
    }
  }

  function handleCourseCreated(newCourse) {
    setCourses([...courses, newCourse]);
  }

  async function deleteCourse(courseId) {
    const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
      method: "DELETE",
      headers: { "x-auth-token": token },
    });
    if (res.ok) {
      setCourses(courses.filter((c) => c._id !== courseId));
      if (selectedCourse && selectedCourse._id === courseId) {
        setSelectedCourse(null);
      }
    } else {
      const data = await res.json();
      console.error(data.message);
    }
  }

  function handleChapterCreated(chap) {
    const updatedCourse = {
      ...selectedCourse,
      chapitres: [...(selectedCourse.chapitres || []), chap],
    };
    setSelectedCourse(updatedCourse);
  }

  async function handleLessonCreated(lesson) {
    await fetchLessons();
  }

  function openModal(course) {
    setSelectedCourse(course);
    setShowModal(true);
    setSelectedChapterId(null);
    setShowLessonContent({});
    setEditingLessonId(null);
  }

  function closeModal() {
    setShowModal(false);
    setSelectedCourse(null);
    setEditingLessonId(null);
  }

  async function deleteLesson(lessonId) {
    const res = await fetch(`${API_BASE_URL}/api/lessons/${lessonId}`, {
      method: "DELETE",
      headers: { "x-auth-token": token },
    });
    if (res.ok) {
      await fetchLessons();
    } else {
      const data = await res.json();
      console.error(data.message);
    }
  }

  function toggleLessonContent(lessonId) {
    setShowLessonContent((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  }

  function startEditingLesson(lessonId) {
    setEditingLessonId(lessonId);
  }

  function cancelEditing() {
    setEditingLessonId(null);
  }

  async function finishEditing() {
    await fetchLessons();
    setEditingLessonId(null);
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Gérer mes cours</h2>

      <CreateCourseForm token={token} onCourseCreated={handleCourseCreated} />

      <div className="space-y-2">
        {courses.map((course) => (
          <div
            key={course._id}
            className="border p-2 rounded flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">{course.titre}</h3>
              <p className="text-sm">{course.description}</p>
            </div>
            <div className="space-x-2">
              <button className="btn btn-sm" onClick={() => openModal(course)}>
                Gérer chapitres & leçons
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => deleteCourse(course._id)}
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedCourse && (
        <div className="modal modal-open">
          <div className="modal-box space-y-4 max-w-4xl">
            <h3 className="font-bold text-lg">
              Gérer chapitres & leçons : {selectedCourse.titre}
            </h3>

            <CreateChapterForm
              token={token}
              coursId={selectedCourse._id}
              onChapterCreated={handleChapterCreated}
            />

            {selectedCourse.chapitres &&
              selectedCourse.chapitres.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-md font-bold">Chapitres :</h4>
                  {selectedCourse.chapitres.map((chap) => {
                    const chapterLessons = allLessons.filter(
                      (lesson) =>
                        lesson.chapitre &&
                        lesson.chapitre._id.toString() === chap._id.toString()
                    );

                    return (
                      <div
                        key={chap._id}
                        className="border p-2 rounded space-y-2"
                      >
                        <span className="font-semibold">{chap.titre}</span>

                        <button
                          className="btn btn-sm"
                          onClick={() => setSelectedChapterId(chap._id)}
                        >
                          Ajouter une leçon
                        </button>

                        {selectedChapterId === chap._id && (
                          <CreateLessonForm
                            token={token}
                            chapitreId={chap._id}
                            onLessonCreated={handleLessonCreated}
                          />
                        )}

                        {chapterLessons && chapterLessons.length > 0 && (
                          <div className="mt-2 pl-4 space-y-1">
                            <h5 className="font-semibold">Leçons :</h5>
                            {chapterLessons.map((lesson) => (
                              <div
                                key={lesson._id}
                                className="border p-2 rounded flex items-start justify-between"
                              >
                                <div className="flex-1 mr-2">
                                  {editingLessonId === lesson._id ? (
                                    <EditLessonForm
                                      token={token}
                                      lesson={lesson}
                                      onLessonUpdated={finishEditing}
                                      onCancel={cancelEditing}
                                    />
                                  ) : (
                                    <>
                                      <h6 className="font-semibold">
                                        {lesson.titre}
                                      </h6>
                                      <button
                                        className="btn btn-xs mt-1"
                                        onClick={() =>
                                          toggleLessonContent(lesson._id)
                                        }
                                      >
                                        {showLessonContent[lesson._id]
                                          ? "Cacher le contenu"
                                          : "Afficher le contenu"}
                                      </button>
                                      {showLessonContent[lesson._id] && (
                                        <div
                                          className="mt-2 text-sm ql-editor"
                                          dangerouslySetInnerHTML={{
                                            __html: lesson.contenu,
                                          }}
                                        ></div>
                                      )}
                                    </>
                                  )}
                                </div>
                                <div className="space-x-2">
                                  {editingLessonId !== lesson._id && (
                                    <button
                                      className="btn btn-sm"
                                      onClick={() =>
                                        startEditingLesson(lesson._id)
                                      }
                                    >
                                      Éditer
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-sm btn-error"
                                    onClick={() => deleteLesson(lesson._id)}
                                  >
                                    <Trash className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
