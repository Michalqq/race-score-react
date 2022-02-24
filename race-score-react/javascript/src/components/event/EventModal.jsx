import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import "bootstrap/dist/css/bootstrap.min.css";
import { backendUrl } from "../utils/fetchUtils";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import authHeader from "../../service/auth-header";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { QuickJoinPanel } from "../join/QuickJoinPanel";
import { TeamModal } from "../team/TeamModal";

export const EventModal = ({ show, handleClose, event }) => {
  const navigate = useNavigate();

  const [team, setTeam] = useState(undefined);
  const [file, setFile] = useState();
  const [uploading, setUploading] = useState(false);
  const [fileMsg, setFileMsg] = useState();
  const [notJoined, setNotJoined] = useState(false);
  const [myEvent, setMyEvent] = useState();
  const [quickJoin, setQuickJoin] = useState();
  const [activeTab, setActiveTab] = useState(1);
  const [fillTeam, setFillTeam] = useState();

  const loggedUser = sessionStorage.getItem("username") !== null;

  useEffect(() => {
    if (!show) return;

    fetchGetTeam();
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
        style={{ zIndex: quickJoin || fillTeam ? 1000 : 1055 }}
        show={show}
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
        <p style={{ fontSize: "11px" }} className="text-center my-0 py-0">
          Aplikacja w fazie testów
        </p>
        <Tabs
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
          className="m-0 fw-bold"
        >
          <Tab eventKey={1} title="Informacje">
            <div className="row">
              <div className="col-lg-6 pb-3 px-3">
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
              </div>
              <div className="col-lg-6 pb-3 px-3">
                <Card className="text-center">
                  <Card.Header className="bg-dark text-white">
                    Linki związane z wydarzeniem
                  </Card.Header>
                  <Card.Body>
                    <div className="row ">
                      <div className="col-lg-12 px-0">
                        {event?.eventPaths?.map((path, index) => (
                          <h6 key={index} className="my-1">
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={path.path}
                            >
                              {path.description}
                            </a>
                          </h6>
                        )) || "Organizator nie dodał linków"}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Tab>
          {!loggedUser ? (
            <></>
          ) : (
            <Tab eventKey={2} title="Wpisowe">
              <div className="row mx-2 justify-content-center">
                <div className="col-lg-6 pb-3 px-1">
                  <h5 className="text-center py-4">
                    Tutaj możesz dodać plik z potwierdzeniem wpisowego,
                    przyspieszy to proces odbioru administracyjnego
                  </h5>
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
          )}
        </Tabs>
        <Modal.Footer>
          <div className="row justify-content-center">
            <div className="col-xl-12 d-flex">
              <div className="">
                <Button
                  className={"m-1"}
                  variant="success"
                  form="teamForm"
                  type="submit"
                  onClick={() => {
                    loggedUser
                      ? setFillTeam(true)
                      : navigate(`login?${event.eventId}`);
                  }}
                  disabled={event?.started}
                >
                  Zapisz się
                </Button>
              </div>
              <div className="">
                {/* <Button
                className={"m-1"}
                variant="success"
                onClick={() => {
                  loggedUser ? setFillTeam(true) : navigate(`login?${event.eventId}`);
                }}
              >
                {myEvent?.joined ? "Ok" : "Zapisz (po zalogowaniu)"}
              </Button> */}
                <Button
                  className={"m-1"}
                  variant="secondary"
                  onClick={handleClose}
                >
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
              </div>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
      <QuickJoinPanel
        show={quickJoin}
        handleClose={() => setQuickJoin()}
        eventId={event?.eventId}
      />
      <TeamModal
        show={fillTeam}
        handleClose={() => setFillTeam()}
        handleOk={() => handleClose()}
        event={event}
      />
    </div>
  );
};
