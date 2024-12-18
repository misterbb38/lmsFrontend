// FicheDeTravail.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import TeacherCourseManager from "../components/TeacherCourseManager.jsx";
import TeacherExerciseManager from "../components/TeacherExerciseManager.jsx";
import StudentCourseViewer from "../components/StudentCourseViewer.jsx";
import StudentExerciseViewer from "../components/StudentExerciseViewer.jsx";

function FicheDeTravail() {
  const { utilisateur } = useContext(AuthContext);
  const token = localStorage.getItem("token"); // ou depuis le contexte

  if (!utilisateur) {
    return <p>Veuillez vous connecter</p>;
  }

  return (
    <div className="space-y-8">
      {utilisateur.role === "teacher" && (
        <>
          <TeacherCourseManager token={token} />
          <TeacherExerciseManager token={token} />
        </>
      )}
      {utilisateur.role === "student" && <></>}
    </div>
  );
}

export default FicheDeTravail;
