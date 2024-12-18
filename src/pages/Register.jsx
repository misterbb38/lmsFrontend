// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    role: "student", // Par défaut
    coordonnees: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { nom, prenom, email, motDePasse, role, coordonnees } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/inscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          motDePasse,
          role,
          coordonnees,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      // Stocker le token et les informations de l'utilisateur dans le localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Rediriger vers le tableau de bord
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-base-100 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Inscription</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">Nom</label>
            <input
              type="text"
              name="nom"
              value={nom}
              onChange={onChange}
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={prenom}
              onChange={onChange}
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">Mot de passe</label>
            <input
              type="password"
              name="motDePasse"
              value={motDePasse}
              onChange={onChange}
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">Rôle</label>
            <select
              name="role"
              value={role}
              onChange={onChange}
              className="select select-bordered"
            >
              <option value="student">Étudiant</option>
              <option value="teacher">Professeur</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">Coordonnées</label>
            <input
              type="text"
              name="coordonnees"
              value={coordonnees}
              onChange={onChange}
              className="input input-bordered"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            S'inscrire
          </button>
        </form>
        <p className="text-center">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="text-primary">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
