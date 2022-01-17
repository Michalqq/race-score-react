import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import { InputLabeled } from "../common/InputLabeled";
import { backendUrl } from "../utils/fetchUtils";
import { MyDatePicker, DateInput } from "../common/DateInput";
import { CarPanelModal } from "./CarPanelModal";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { Selector } from "../common/Selector";
import authHeader from "../../service/auth-header";

export const TeamPanelModal = ({ show, handleClose, eventId }) => {
  const disable = false;
  const navigate = useNavigate();

  const [team, setTeam] = useState(undefined);
  const [carsOption, setCarsOption] = useState([]);
  const [addCar, setAddCar] = useState();

  useEffect(() => {
    if (!show) return;

    if (sessionStorage.getItem("username") === null) navigate("login");

    fetchGetTeam();
    setCarsOption([]);
  }, [show]);

  const fetchGetTeam = () => {
    axios
      .get(`${backendUrl()}/team/getTeam`, {
        headers: authHeader(),
      })
      .then((res) => {
        setTeam(res.data);
      });
  };

  useEffect(() => {
    let tempOptions = [];
    if (team !== undefined && team.cars !== null) {
      team.cars.map((x) => {
        const option = {
          label: x.brand + " " + x.model + " " + x.licensePlate,
          value: x.carId,
          defValue: false,
        };
        tempOptions.push(option);
      });
      setCarsOption(tempOptions);
    }
  }, [team]);

  const fetchAddTeam = () => {
    axios
      .post(`${backendUrl()}/team/addTeam?eventId=${eventId}`, team, {
        headers: authHeader(),
      })
      .then(() => {
        handleClose();
      });
  };

  const handleChange = (event) => {
    setTeam({ ...team, [event.target.name]: event.target.value });
  };

  const addTeam = () => {
    fetchAddTeam();
  };

  return (
    <div>
      <Modal
        show={show && !addCar}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <Modal.Header className="bg-dark text-white" closeButton>
          <Modal.Title className="text-white">{`Panel zawodnika: ${
            team?.driver || ""
          }`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {team === undefined && (
            <div className="text-center">
              <Spinner animation="border" variant="secondary" size="lg" />
            </div>
          )}
          {team !== undefined && (
            <div className="row">
              <div className="col-lg-7 pb-3 px-1">
                <Card className="">
                  <Card.Header className="bg-dark text-white">
                    Kierowca
                  </Card.Header>
                  <Card.Body>
                    <div className="row d-flex">
                      <div className="col-lg-4 px-0">
                        <InputLabeled
                          label="Imie i nazwisko"
                          name="driver"
                          handleChange={handleChange}
                          disabled={disable}
                          big={true}
                          value={team.driver}
                        />
                      </div>
                      <div className="col-lg-4 px-0">
                        <InputLabeled
                          label="Nazwa Teamu"
                          name="teamName"
                          handleChange={handleChange}
                          disabled={disable}
                          big={true}
                          value={team.teamName}
                        />
                      </div>
                      <div className="col-lg-4 px-0">
                        <InputLabeled
                          label="Automobilklub"
                          name="club"
                          handleChange={handleChange}
                          disabled={disable}
                          big={true}
                          value={team.club}
                        />
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-lg-6 px-0">
                        <InputLabeled
                          label="Email"
                          name="email"
                          handleChange={handleChange}
                          disabled={disable}
                          big={true}
                          value={team.email}
                        />
                      </div>
                      <div className="col-lg-6 px-0">
                        <InputLabeled
                          label="Nr. telefonu"
                          name="phone"
                          handleChange={handleChange}
                          disabled={disable}
                          big={true}
                          value={team.phone}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-6 px-0">
                        <MyDatePicker
                          label={"Data urodzenia"}
                          onChange={(val) =>
                            setTeam({ ...team, birthDate: val })
                          }
                          selected={team.birthDate || new Date()}
                        />
                      </div>
                      <div className="col-lg-6 px-0">
                        <InputLabeled
                          label="Nr. prawa jazdy"
                          name="drivingLicense"
                          handleChange={handleChange}
                          disabled={disable}
                          big={true}
                          value={team.drivingLicense}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-6 px-0">
                        <InputLabeled
                          label="Imię i nazwisko (wypadek)"
                          name="emergencyPerson"
                          handleChange={handleChange}
                          disabled={disable}
                          big={true}
                          value={team.emergencyPerson}
                        />
                      </div>
                      <div className="col-lg-6 px-0">
                        <InputLabeled
                          label="Nr. telefonu (wypadek)"
                          name="emergencyPhone"
                          handleChange={handleChange}
                          disabled={disable}
                          big={true}
                          value={team.emergencyPhone}
                        />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-lg-5 pb-3 px-1">
                <Card className="text-center">
                  <Card.Header className="bg-dark text-white">
                    Pilot
                  </Card.Header>
                  <Card.Body>
                    <div className="row ">
                      <div className="col-lg-5 px-0">
                        <InputLabeled
                          label="Imie i nazwisko"
                          name="coDriver"
                          handleChange={handleChange}
                          disabled={disable}
                          big={true}
                          value={team.coDriver}
                        />
                      </div>
                      <div className="col-lg-3 px-0">
                        <InputLabeled
                          label="Email"
                          name="coEmail"
                          handleChange={handleChange}
                          disabled={disable}
                          big={true}
                          value={team.coEmail}
                        />
                      </div>
                      <div className="col-lg-4 px-0">
                        <InputLabeled
                          label="Nr. telefonu"
                          name="coPhone"
                          handleChange={handleChange}
                          disabled={disable}
                          big={true}
                          value={team.coPhone}
                        />
                      </div>
                    </div>
                    <div className="row px-0">
                      <div className="col-lg-4 px-0">
                        <MyDatePicker
                          label={"Data urodzenia"}
                          onChange={(val) =>
                            setTeam({ ...team, coBirthDate: val })
                          }
                          selected={team.coBirthDate || new Date()}
                        />
                      </div>
                      <div className="col-lg-4 px-0">
                        <InputLabeled
                          label="Nr. prawa jazdy"
                          name="coDrivingLicense"
                          handleChange={handleChange}
                          disabled={disable}
                          big={true}
                          value={team.coDrivingLicense}
                        />
                      </div>
                      <div className="col-lg-4 px-0">
                        <InputLabeled
                          label="Automobilklub"
                          name="coClub"
                          handleChange={handleChange}
                          disabled={disable}
                          big={true}
                          value={team.coClub}
                        />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                <Card className="text-center">
                  {team.currentCar !== undefined &&
                    team.currentCar !== null && (
                      <Card.Header className="bg-dark text-white">{`Aktualny samochód: ${team.currentCar.brand} ${team.currentCar.model} ${team.currentCar.licensePlate}`}</Card.Header>
                    )}
                  <Card.Body>
                    <Selector
                      label={"Samochody"}
                      options={carsOption}
                      handleChange={(value) =>
                        setTeam({
                          ...team,
                          currentCar: team.cars.find((x) => x.carId === value),
                        })
                      }
                      isValid={true}
                      skipDefault={true}
                    />
                    <Button
                      className="m-1"
                      variant="primary"
                      onClick={() => setAddCar(true)}
                    >
                      Dodaj samochód
                    </Button>
                    <Button
                      className="m-1"
                      variant="secondary"
                      onClick={() => setAddCar(team.currentCar)}
                    >
                      Edytuj
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className={"justify-content-center"}>
          <Button className={"m-1"} variant="success" onClick={() => addTeam()}>
            Zapisz / dodaj
          </Button>
          <Button className={"m-1"} variant="secondary" onClick={handleClose}>
            Anuluj
          </Button>
        </Modal.Footer>
      </Modal>
      <CarPanelModal
        show={addCar}
        handleClose={() => {
          setAddCar(false);
          fetchGetTeam();
        }}
        teamId={team?.teamId}
        carToEdit={addCar}
      />
    </div>
  );
};
