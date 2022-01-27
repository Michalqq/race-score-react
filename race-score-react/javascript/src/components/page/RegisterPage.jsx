import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import { InputLabeled } from "../common/InputLabeled";
import { backendUrl } from "../utils/fetchUtils";

export const RegisterPage = (props) => {
  const [user, setUser] = useState({ username: "", password: null, email: "" });
  const [registred, setRegistred] = useState();
  const [error, setError] = useState();

  const registerUser = () => {
    axios
      .post(`${backendUrl()}/auth/signup`, user)
      .then((res) => {
        setRegistred(res.data.username);
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };
  return (
    <div className="u-text-center">
      <div className="u-box-shadow">
        <div className="row justify-content-center">
          <div className="col-lg-4 pb-3 u-box-shadow">
            <Card className="text-center">
              <Card.Header className="bg-dark text-white">
                Rejestracja
              </Card.Header>
              <Card.Body>
                <InputLabeled
                  label="Login"
                  name="username"
                  handleChange={handleChange}
                  big={true}
                  value={user.username}
                />
                <InputLabeled
                  label="Email"
                  name="email"
                  handleChange={handleChange}
                  big={true}
                  value={user.email}
                />
                <InputLabeled
                  label="Hasło"
                  name="password"
                  handleChange={handleChange}
                  big={true}
                  value={user.password}
                  type="password"
                />
                {registred && (
                  <p>{`Zarejestrowano użytkownika: ${registred}`}</p>
                )}
                {error && <p>{`${error}. Popraw formularz`}</p>}
                <Button
                  className={"px-4 mt-3"}
                  variant="success"
                  onClick={() => registerUser()}
                >
                  Zarejestruj
                </Button>
              </Card.Body>
              <Card.Footer className="text-muted">
                Masz konto -<a href="login"> zaloguj się</a>
              </Card.Footer>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
