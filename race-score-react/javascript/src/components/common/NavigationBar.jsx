import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../utils/fetchUtils";
import authHeader from "../../service/auth-header";

export const NavigationBar = () => {
  const [referee, setReferee] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  let username = sessionStorage.getItem("username");

  useEffect(
    () => {
      if (location.state?.eventId !== undefined)
        axios
          .get(
            `${backendUrl()}/event/checkReferee?eventId=${
              location.state?.eventId
            }`,
            {
              headers: authHeader(),
            }
          )
          .then((res) => {
            setReferee(res.data);
          });
    },
    [location.state?.eventId],
    username
  );

  return (
    <Navbar bg="warning gradient" expand="lg">
      <Container>
        <Navbar.Brand href="/">Wyniki online AKBP</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Lista wydarzeń</Nav.Link>

            {/* {referee && location.state?.eventId !== undefined && ( */}
            {location.state?.eventId !== undefined && (
              <NavDropdown title="Administrator" id="basic-nav-dropdown">
                <NavDropdown.Item
                  onClick={() =>
                    navigate(`add_score`, {
                      state: { eventId: location.state.eventId },
                    })
                  }
                >
                  Dodaj wyniki
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() =>
                    navigate(`add_penalty`, {
                      state: { eventId: location.state.eventId },
                    })
                  }
                >
                  Dodaj kary
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() =>
                    navigate(`drivers`, {
                      state: { eventId: location.state.eventId },
                    })
                  }
                >
                  Lista startowa
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          <Nav>
            {sessionStorage.getItem("username") === null && (
              <>
                <Nav.Link href="/login">Zaloguj</Nav.Link>
                <Nav.Link href="/register">Rejestracja</Nav.Link>
              </>
            )}
            {sessionStorage.getItem("username") !== null && (
              <>
                <Navbar.Brand
                  className="mx-5"
                  href="/"
                >{`Użytkownik: ${sessionStorage.getItem(
                  "username"
                )}`}</Navbar.Brand>

                <Nav.Link
                  onClick={() => {
                    sessionStorage.removeItem("username");
                    window.location.href = "/";
                  }}
                >
                  Wyloguj
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
