// Profile.js
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
export default function Profile() {
  const [user, setUser] = useState({ username: "", email: "" });
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.get("http://localhost:8000/api/auth/logout", {
      withCredentials: true,
    });
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/auth/profile",
          {
            withCredentials: true,
          }
        );

        if (response && response.data) {
          setUser(response.data.user);
          console.log(response.data.user);
        } else {
          console.error("Réponse inattendue:", response);
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.error(error.response?.data);
        } else {
          console.error("Erreur inattendue:", error);
        }
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h2> Profil </h2>{" "}
      {user ? (
        <p>
          {" "}
          Bienvenue, {user.username} {user.email}{" "}
        </p>
      ) : (
        <p>Non authentifié</p>
      )}{" "}
      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  );
}
