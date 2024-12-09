// Profile.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/profile", {
          withCredentials: true,
        });

        if (response && response.data) {
          setUser(response.data.user);
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

    fetchProfile();
  }, []);

  return (
    <div>
      <h2> Profil </h2>{" "}
      {user ? <p> Bienvenue, {user.email} </p> : <p>Non authentifié</p>}{" "}
    </div>
  );
}
