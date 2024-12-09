// Login.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    withCredentials: true,
  });

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post(`http://localhost:8000/login`, {
        email,
        password,
      });

      if (response && response.data) {
        console.log(response.data);
        navigate("/profile");
      } else {
        console.error("Réponse inattendue:", response);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.error(error.response.data);
      } else {
        console.error("Erreur inattendue:", error);
      }
    }
  };

  return (
    <div>
      <h2> Connexion </h2>{" "}
      <input
        type="text"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />{" "}
      <input
        type="password"
        placeholder="Mot de passe"
        onChange={(e) => setPassword(e.target.value)}
      />{" "}
      <button onClick={handleLogin}> Se connecter </button>{" "}
    </div>
  );
}
