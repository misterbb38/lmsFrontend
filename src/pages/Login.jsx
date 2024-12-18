// src/pages/Login.jsx
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    motDePasse: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUtilisateur } = useContext(AuthContext);

  const { email, motDePasse } = formData;

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/connexion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, motDePasse }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      // Vérifier que data contient bien token et user
      if (!data.token || !data.user) {
        throw new Error(
          "Réponse du serveur invalide. Pas de token ou d'utilisateur."
        );
      }

      // Stocker le token et les informations de l'utilisateur dans le localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Mettre à jour le contexte d’authentification
      setUtilisateur(data.user);

      // Vérifier immédiatement le contenu du localStorage
      console.log("Token:", localStorage.getItem("token"));
      console.log("User:", localStorage.getItem("user"));

      // Rediriger vers le tableau de bord
      navigate("/");
    } catch (err) {
      console.error("Erreur lors de la connexion :", err);
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-base-100 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Connexion</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-6">
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
          <button type="submit" className="btn btn-primary w-full">
            Se connecter
          </button>
        </form>
        <p className="text-center">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-primary">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
