import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:8000/signup", {
        password,
        email,
      });

      // Vérifier si la propriété 'data' existe avant d'y accéder
      if (response && response.data) {
        console.log(response.data);
      } else {
        console.error("Réponse inattendue:", response);
      }
    } catch (error: any) {
      // Vérifier si la propriété 'response' et 'data' existent avant d'y accéder
      if (error.response && error.response.data) {
        console.error(error.response.data);
      } else {
        console.error("Erreur inattendue:", error);
      }
    }
  };

  return (
    <div>
      <h2> Inscription </h2>{" "}
      <input
        type="password"
        placeholder="Mot de passe"
        onChange={(e) => setPassword(e.target.value)}
      />{" "}
      <input
        type="email"
        placeholder="Adresse e-mail"
        onChange={(e) => setEmail(e.target.value)}
      />{" "}
      <button onClick={handleSignup}> S 'inscrire</button>{" "}
    </div>
  );
}
