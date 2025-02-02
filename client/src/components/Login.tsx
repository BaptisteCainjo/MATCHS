// Login.js
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    withCredentials: true,
  });

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post(
        `http://localhost:8000/api/auth/login`,
        {
          email,
          password,
        }
      );

      if (response && response.data) {
        console.log(response.data);
        navigate("/profile");
      } else {
        console.error("Réponse inattendue:", response);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          console.error(error.response.data);
        }
      } else {
        console.error("Erreur inattendue:", error);
      }
    }
  };

  return (
    <>
      {/* <div>
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
      </div> */}

      <div className="login">
        <section>
          <div className="flow-logo">
            <img alt="Logo de l'application Flow'" />
          </div>

          <div className="line"></div>
          <div className="login-form">
            <div className="header">
              <h1>Bon retour sur Flow !</h1>
              <p>Merci d'entrer vos informations</p>
            </div>
            <form>
              <div className="inputs">
                <div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="email">Email</label>
                </div>
                <div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="password">Mot de passe</label>
                  <p>{}</p>
                </div>
              </div>
              <div className="end-form">
                <div>
                  <input
                    type="checkbox"
                    name="memory-check"
                    id="memory-check"
                  />
                  <label htmlFor="memory-check">Se souvenir</label>
                </div>
                <Link to="password-reset" className="underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="buttons">
                <button
                  type="submit"
                  className="large-button pink"
                  onClick={handleLogin}
                >
                  Se connecter
                </button>
                <Link to="/" className="large-button">
                  <img alt="icon de Google" /> Se connecter avec Google
                </Link>
              </div>
            </form>
            <p>
              Pas de compte ?{" "}
              <Link to="/register" className="underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
