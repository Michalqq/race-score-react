import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import { InputLabeled } from "../common/InputLabeled";
import { backendUrl } from "../utils/fetchUtils";
import { DateInput } from "../common/DateInput";
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

    axios
      .get(`${backendUrl()}/team/getTeam`, {
        headers: authHeader(),
      })
      .then((res) => {
        setTeam(res.data);
      });
    setCarsOption([]);
  }, [show]);

  useEffect(() => {
    let tempOptions = [];
    if (team !== undefined) {
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
    <>
      <Modal
        show={show && !addCar}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <Modal.Header closeButton className="bg-secondary">
          <Modal.Title className="text-white">{`Panel zawodnika: ${team?.driver}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {team === undefined && (
            <Spinner animation="border" variant="secondary" size="lg" />
          )}
          {team !== undefined && (
            <div className="row">
              <div className="col-lg-7 pb-3">
                <Card className="">
                  <Card.Header className="bg-dark text-white">
                    Kierowca
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex">
                      <InputLabeled
                        label="Imie i nazwisko"
                        name="driver"
                        handleChange={handleChange}
                        disabled={disable}
                        big={true}
                        value={team.driver}
                      />
                      <InputLabeled
                        label="Nazwa Teamu"
                        name="teamName"
                        handleChange={handleChange}
                        disabled={disable}
                        big={true}
                        value={team.teamName}
                      />
                      <InputLabeled
                        label="Automobilklub"
                        name="club"
                        handleChange={handleChange}
                        disabled={disable}
                        big={true}
                        value={team.club}
                      />
                    </div>

                    <div className="d-flex mt-3">
                      <InputLabeled
                        label="Email"
                        name="email"
                        handleChange={handleChange}
                        disabled={disable}
                        big={true}
                        value={team.email}
                      />
                      <InputLabeled
                        label="Nr. telefonu"
                        name="phone"
                        handleChange={handleChange}
                        disabled={disable}
                        big={true}
                        value={team.phone}
                      />
                    </div>
                    <div className="d-flex mt-3">
                      <DateInput
                        value={team.birthDate}
                        label={"Data urodzenia"}
                        onChange={(val) => setTeam({ ...team, birthDate: val })}
                        disabled={disable}
                        maxDate={new Date()}
                      />
                      <InputLabeled
                        label="Nr. prawa jazdy"
                        name="drivingLicense"
                        handleChange={handleChange}
                        disabled={disable}
                        big={true}
                        value={team.drivingLicense}
                      />
                    </div>
                    <div className="d-flex mt-3">
                      <InputLabeled
                        label="Imię i nazwisko (wypadek)"
                        name="emergencyPerson"
                        handleChange={handleChange}
                        disabled={disable}
                        big={true}
                        value={team.emergencyPerson}
                      />
                      <InputLabeled
                        label="Nr. telefonu (wypadek)"
                        name="emergencyPhone"
                        handleChange={handleChange}
                        disabled={disable}
                        big={true}
                        value={team.emergencyPhone}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-lg-5 pb-3 ">
                <Card className="text-center">
                  <Card.Header className="bg-dark text-white">
                    Pilot
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex">
                      <InputLabeled
                        label="Imie i nazwisko"
                        name="coDriver"
                        handleChange={handleChange}
                        disabled={disable}
                        big={true}
                        value={team.coDriver}
                      />
                      <InputLabeled
                        label="Email"
                        name="coEmail"
                        handleChange={handleChange}
                        disabled={disable}
                        big={true}
                        value={team.coEmail}
                      />
                      <InputLabeled
                        label="Nr. telefonu"
                        name="coPhone"
                        handleChange={handleChange}
                        disabled={disable}
                        big={true}
                        value={team.coPhone}
                      />
                    </div>
                    <div className="d-flex">
                      <DateInput
                        value={team.coBirthDate}
                        label={"Data urodzenia"}
                        onChange={(val) =>
                          setTeam({ ...team, coBirthDate: val })
                        }
                        disabled={disable}
                        maxDate={new Date()}
                      />
                      <InputLabeled
                        label="Nr. prawa jazdy"
                        name="coDrivingLicense"
                        handleChange={handleChange}
                        disabled={disable}
                        big={true}
                        value={team.coDrivingLicense}
                      />

                      <InputLabeled
                        label="Automobilklub"
                        name="coClub"
                        handleChange={handleChange}
                        disabled={disable}
                        big={true}
                        value={team.coClub}
                      />
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
        handleClose={() => setAddCar(false)}
        teamId={team?.teamId}
        carToEdit={addCar}
      />
    </>
  );
};
