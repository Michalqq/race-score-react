import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import "bootstrap/dist/css/bootstrap.min.css";
import { InputLabeled } from "../common/InputLabeled";
import { backendUrl } from "../utils/fetchUtils";
import { MyDatePicker } from "../common/DateInput";
import { CarPanelModal } from "./CarPanelModal";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { Selector } from "../common/Selector";
import authHeader from "../../service/auth-header";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export const TeamPanelModal = ({ show, handleClose, event }) => {
  const disable = false;
  const navigate = useNavigate();

  const [team, setTeam] = useState(undefined);
  const [carsOption, setCarsOption] = useState([]);
  const [addCar, setAddCar] = useState();
  const [file, setFile] = useState();
  const [uploading, setUploading] = useState(false);
  const [fileMsg, setFileMsg] = useState();
  const [notJoined, setNotJoined] = useState(false);
  const [myEvent, setMyEvent] = useState();

  const loggedUser = sessionStorage.getItem("username") !== null;

  useEffect(() => {
    if (!show) return;

    fetchGetTeam();
    setCarsOption([]);
    setUploading(false);
    setFileMsg();
    setNotJoined(false);
    setMyEvent(event);
  }, [show]);

  const fetchGetTeam = () => {
    axios
      .get(`${backendUrl()}/team/getTeam`, {
        headers: authHeader(),
      })
      .then((res) => {
        setNotJoined(res.data === "");
        if (res.data !== "") setTeam(res.data);
      });
  };

  useEffect(() => {
    let tempOptions = [];
    if (team !== undefined && team.cars) {
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
    if (event?.eventId !== undefined && team?.teamId !== undefined)
      axios
        .get(
          `${backendUrl()}/event/getEntryFeeFile?eventId=${
            event.eventId
          }&teamId=${team.teamId}`
        )
        .then((res) => {
          if (res.status === 204) setNotJoined(true);
          else setFileMsg("Mamy już Twoje potwierdzenie");
        })
        .catch((error) => {
          setFileMsg();
        });
  }, [team]);

  const fetchAddTeam = () => {
    axios
      .post(`${backendUrl()}/team/addTeam?eventId=${event.eventId}`, team, {
        headers: authHeader(),
      })
      .then(() => {
        handleClose();
      });
  };

  const fetchRemoveFromEvent = () => {
    axios
      .post(
        `${backendUrl()}/event/removeTeam?eventId=${event.eventId}&teamId=${
          team?.teamId
        }`,
        {
          headers: authHeader(),
        }
      )
      .then(() => {
        setMyEvent({ ...myEvent, joined: false });
      });
  };

  const handleChange = (event) => {
    setTeam({ ...team, [event.target.name]: event.target.value });
  };

  const addTeam = () => {
    fetchAddTeam();
  };

  const fetchUpload = (eventId, teamId) => {
    if (file.size > 2 * 1024 * 1024) {
      setFileMsg("Plik jest zbyt duży (maksymalnie 2mb)");
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(
        `${backendUrl()}/event/addEntryFeeFile?eventId=${eventId}&teamId=${teamId}`,
        formData,
        {
          headers: authHeader(),
        }
      )
      .then((res) => {
        setUploading(false);
        res.data
          ? setFileMsg("Plik został dodany")
          : setFileMsg("Plik NIE został dodany - błąd");
      });
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
          <Modal.Title className="w-100 row">
            <div className="col-lg-8">{`Informacje o wydarzeniu`}</div>
            {myEvent?.joined && (
              <div className="col-lg-4">
                <FontAwesomeIcon
                  className={"text-success fa-lg"}
                  icon={faStar}
                />
                Jesteś zapisany
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Tabs className="m-0 fw-bold">
          <Tab eventKey="event" title="Informacje">
            <div className="m-2 text-center">
              <h3>{event?.name || ""}</h3>
              <h5>{`Data wydarzenia:  `}</h5>
              <h5 className="fw-bold">
                {moment(event?.date).format(" dddd, DD MMM YYYY, HH:mm")}
              </h5>
              <p className="m-3">{event?.description || ""}</p>
              <p className="fw-bold fst-italic m-4">
                {`Koniec zapisów:  ${moment(event?.signDeadline).format(
                  "dddd, DD MMM YYYY, HH:mm"
                )}`}
              </p>
            </div>
            <div className="row mx-2">
              <div className="col-lg-6 pb-3 px-1">
                <Card className="text-center">
                  <Card.Header className="bg-dark text-white">
                    Lista plików
                  </Card.Header>
                  <Card.Body>
                    <div className="row ">
                      <div className="col-lg-4 px-0">
                        todo pliki do pobrania
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-lg-6 pb-3 px-1">
                <Card className="text-center ">
                  <Card.Header className="bg-dark text-white">
                    Wpisowe
                  </Card.Header>
                  <Card.Body>
                    {notJoined ? (
                      <p>
                        Zapisz się a następnie będziesz miał możliwość
                        przesłania pliku
                      </p>
                    ) : (
                      <p>Dodaj plik z potwierdzeniem opłacenia wpisowego</p>
                    )}
                    <input
                      disabled={notJoined}
                      type="file"
                      name="file"
                      accept="application/pdf,application/vnd.ms-excel"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    {fileMsg && <p className="fw-bold m-2">{fileMsg}</p>}
                    <div>
                      {uploading ? (
                        <Spinner animation="border" variant="secondary" />
                      ) : (
                        <Button
                          className={"mt-2 mb-0"}
                          variant="secondary"
                          onClick={() =>
                            fetchUpload(event.eventId, team.teamId)
                          }
                          disabled={file === undefined}
                        >
                          Wyślij plik
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Tab>
          {!loggedUser ? (
            <></>
          ) : (
            <Tab eventKey="team" title="Moje dane zawodnika">
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
                                currentCar: team.cars.find(
                                  (x) => x.carId === value
                                ),
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
            </Tab>
          )}
        </Tabs>
        <Modal.Footer className={"justify-content-center"}>
          <Button
            className={"m-1"}
            variant="success"
            onClick={() => {
              loggedUser ? addTeam() : navigate(`login?${event.eventId}`);
            }}
          >
            {myEvent?.joined ? "Ok" : "Zapisz / dodaj"}
          </Button>
          <Button className={"m-1"} variant="secondary" onClick={handleClose}>
            Zamknij okno
          </Button>
          {myEvent?.joined && (
            <Button
              className={"mx-3"}
              variant="danger"
              onClick={() => fetchRemoveFromEvent()}
            >
              Wypisz się
            </Button>
          )}
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
