import React, { useState, useEffect } from "react";

import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import { InputLabeled } from "../common/InputLabeled";
import { CustomDatePicker, TimePicker } from "../common/DateInput";
import { CalendarContainer } from "react-datepicker";
import { backendUrl } from "../utils/fetchUtils";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Selector } from "../common/Selector";
import authHeader from "../../service/auth-header";
import { OkCancelModal } from "../common/Modal";

export const NewEventForm = ({ show, handleClose, event }) => {
  const [myEvent, setMyEvent] = useState({
    name: "",
    description: "",
    date: new Date(),
    signDeadline: new Date(),
    admin: 1,
    stages: [],
    organizer: "",
    logoPath: "",
  });
  const [stage, setStage] = useState({
    index: 0,
    name: "",
    distance: 1.5,
    startTime: new Date(),
    startFrequency: 1,
  });
  const [eventClass, setEventClass] = useState({
    carClassId: 0,
    carClassName: null,
    maxEngineCapacity: null,
    eventId: event?.eventId,
    awd: false,
  });
  const [eventPaths, setEventPaths] = useState([]);
  const [path, setPath] = useState({
    eventId: event?.eventId,
    path: "",
    description: "",
  });
  const [stages, setStages] = useState([]);
  const [referee, setReferee] = useState([]);
  const [refereeOptions, setRefereeOptions] = useState([]);
  const [eventClasses, setEventClasses] = useState([]);
  const [eventClassesOptions, setEventClassesOptions] = useState([]);
  const [removeEvent, setRemoveEvent] = useState(false);

  useEffect(() => {
    if (!show) return;

    axios
      .get(`${backendUrl()}/event/getRefereeOptions`, {
        headers: authHeader(),
      })
      .then((res) => {
        setRefereeOptions(res.data);
      });

    axios
      .get(`${backendUrl()}/event/getEventClassesOptions`, {
        headers: authHeader(),
      })
      .then((res) => {
        setEventClassesOptions(res.data);
      });

    setEventClasses([]);
    setReferee([]);
    setStages([]);
    if (event !== undefined) fetchEventToEdit();
  }, [show]);

  const handleChange = (event) => {
    setMyEvent({ ...myEvent, [event.target.name]: event.target.value });
  };
  const handleStageChange = (event) => {
    setStage({ ...stage, [event.target.name]: event.target.value });
  };

  const handleAccept = () => {
    const data = {
      ...myEvent,
      stages: stages,
      referee: referee,
      eventClasses: eventClasses,
      eventPaths: eventPaths,
    };
    axios.put(`${backendUrl()}/event/createNew`, data).then((res) => {
      handleClose();
    });
  };

  const addStage = () => {
    stages.push(stage);
    setStages(stages);
    setStage({
      index: stage.index + 1,
      name: "",
      distance: "",
      startTime: new Date(),
      startFrequency: 1,
    });
  };

  const addClass = () => {
    eventClasses.push(eventClass);
    setEventClass({
      carClassId: 0,
      carClassName: null,
      maxEngineCapacity: "",
      eventId: event?.eventId,
      awd: false,
    });
  };

  const addPath = () => {
    eventPaths.push(path);
    setPath({
      eventId: event?.eventId,
      path: "",
      description: "",
    });
  };

  const removeFromStages = (id) => {
    const tempStages = stages.filter((x) => x.index !== id);
    setStages(tempStages);
  };

  const removeReferee = (id) => {
    const tempRef = referee.filter((x) => x.userId !== id);
    setReferee(tempRef);
  };

  const removeClass = (id) => {
    const tempClass = eventClasses.filter((x) => x.carClassId !== id);
    setEventClasses(tempClass);
  };

  const addReferee = (id) => {
    const tempRef = refereeOptions.find((x) => x.value === id);
    const newRef = { userId: Number(tempRef.value), username: tempRef.label };
    setReferee([...referee, newRef]);
  };

  const addEventClass = (id) => {
    const tempClass = eventClassesOptions.find((x) => x.value === id);

    setEventClass({
      ...eventClass,
      carClassId: id,
      carClassName: tempClass.label,
    });
  };

  const fetchEventToEdit = () => {
    axios
      .get(`${backendUrl()}/event/getEvent?eventId=${event.eventId}`)
      .then((res) => {
        setMyEvent({
          ...res.data,
          date: res.data.date ? new Date(res.data.date) : new Date(),
          signDeadline: res.data.signDeadline
            ? new Date(res.data.signDeadline)
            : new Date(),
        });
        setStages(
          res.data.stages.map((x) => {
            return { ...x, startTime: new Date(x.startTime) };
          })
        );
        setReferee(res.data.referee);
        setEventClasses(
          res.data.eventClasses.map((x) => {
            return { ...x, carClassName: x.carClass.name };
          })
        );
        setEventPaths(res.data.eventPaths);
      });
  };

  const fetchRemoveEvent = () => {
    axios
      .get(`${backendUrl()}/event/deleteEvent?eventId=${event.eventId}`)
      .then((res) => {
        handleClose();
      });
  };

  const DatePickerContainer = ({ className, children }) => {
    return (
      <>
        <CalendarContainer className={className}>
          <div style={{ display: "flex" }}>{children}</div>
        </CalendarContainer>
      </>
    );
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header className="bg-dark text-white" closeButton>
        <Modal.Title>Dodawanie nowego wydarzenia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row u-text-center justify-content-center">
          <div className="col-lg-4 mx-1 border-right shadow bg-white rounded">
            <div className="col-lg-12 border-right rounded">
              <Card className="text-center">
                <Card.Header className="bg-dark text-white">
                  Wydarzenie
                </Card.Header>
                <Card.Body className="p-0">
                  <InputLabeled
                    label="Nazwa"
                    name="name"
                    handleChange={handleChange}
                    big={true}
                    value={myEvent.name}
                    multiline={2}
                  />
                  <InputLabeled
                    label="Opis"
                    name="description"
                    handleChange={handleChange}
                    big={true}
                    value={myEvent.description}
                    multiline={2}
                  />
                  <InputLabeled
                    label="Nazwa organizatora"
                    name="organizer"
                    handleChange={handleChange}
                    big={true}
                    value={myEvent.organizer}
                  />
                  <InputLabeled
                    label="Ścieżka do logo wydarzenia"
                    inputPlaceholder="http://www.akteam.pl/logo.jpg"
                    name="logoPath"
                    handleChange={handleChange}
                    big={true}
                    value={myEvent.logoPath}
                  />
                  <div className="d-flex">
                    <CustomDatePicker
                      label={"Data wydarzenia"}
                      onChange={(value) =>
                        setMyEvent({ ...myEvent, date: value })
                      }
                      selected={myEvent.date}
                      calendarContainer={DatePickerContainer}
                      //placeholderText={placeholderFrom}
                      minDate={new Date()}
                      maxDate={null}
                    />
                    <CustomDatePicker
                      label={"Koniec zapisów"}
                      onChange={(value) =>
                        setMyEvent({ ...myEvent, signDeadline: value })
                      }
                      selected={myEvent.signDeadline}
                      calendarContainer={DatePickerContainer}
                      //placeholderText={placeholderFrom}
                      minDate={new Date()}
                      maxDate={null}
                    />
                  </div>
                  <Selector
                    label={"Sędziowie"}
                    options={refereeOptions}
                    handleChange={(value) => addReferee(value)}
                    isValid={true}
                    skipDefault={true}
                  />
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Login</th>
                        <th className="text-end">Usuń</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referee.map((x, index) => (
                        <tr key={x.userId + index}>
                          <td>{x.username}</td>
                          <td className="text-end">
                            <FontAwesomeIcon
                              icon={faTimesCircle}
                              onClick={() => removeReferee(x.userId)}
                              title={"Usuń załoge"}
                              cursor={"pointer"}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              <Card className="text-center">
                <Card.Header className="bg-dark text-white">
                  Podział na klasy
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Klasa</th>
                        <th>Max silnik [dm3]</th>
                        <th className="text-end">Usuń</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventClasses.map((x, index) => (
                        <tr key={x.carClassId + index}>
                          <td>{x.carClassName}</td>
                          <td>{x.maxEngineCapacity}</td>
                          <td className="text-end">
                            <FontAwesomeIcon
                              icon={faTimesCircle}
                              onClick={() => removeClass(x.carClassId)}
                              title={"Usuń klase"}
                              cursor={"pointer"}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="d-grid">
                    <Selector
                      className={"w-50"}
                      label={"Klasa"}
                      options={eventClassesOptions}
                      handleChange={(value) => addEventClass(value)}
                      isValid={true}
                      value={eventClass.carClassId}
                      skipDefault={true}
                    />
                    <InputLabeled
                      label="Max silnik [dm3]"
                      name="name"
                      handleChange={(e) =>
                        setEventClass({
                          ...eventClass,
                          maxEngineCapacity: e.target.value,
                        })
                      }
                      big={true}
                      value={eventClass.maxEngineCapacity}
                    />
                  </div>
                  <Button
                    className={"px-4 my-3"}
                    variant="success"
                    onClick={addClass}
                  >
                    Dodaj klase
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </div>
          <div className="col-lg-7 mx-2 shadow mb-1 bg-white rounded">
            <Card>
              <Card.Header className="bg-dark text-white">
                Odcinki PS/OS (w kolejności)
              </Card.Header>
              <Card.Body className="p-0">
                {stages.length > 0 && (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nazwa</th>
                        <th>Czas startu</th>
                        <th>Częstotliwość</th>
                        <th className="text-end">Usuń</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stages.map((x, index) => (
                        <tr key={index}>
                          <td>{index}</td>
                          <td>{x.name}</td>
                          <td>
                            {x.startTime === null
                              ? ""
                              : format(x.startTime, "HH:mm")}
                          </td>
                          <td>{x.startFrequency + " min"}</td>
                          <td className="text-end">
                            <FontAwesomeIcon
                              icon={faTimesCircle}
                              onClick={() => removeFromStages(x.index)}
                              title={"Usuń załoge"}
                              cursor={"pointer"}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                <div className="d-block">
                  <InputLabeled
                    label="Nazwa"
                    name="name"
                    handleChange={handleStageChange}
                    big={true}
                    value={stage.name}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-3">
                    <InputLabeled
                      label="Długość [m]"
                      name="distance"
                      handleChange={handleStageChange}
                      big={true}
                      onlyNumber={true}
                      value={stage.distance}
                    />
                  </div>
                  <div className="col-lg-4">
                    <TimePicker
                      label={"Czas startu odcinka"}
                      onChange={(value) => {
                        setStage({
                          ...stage,
                          startTime: value,
                        });
                      }}
                      calendarContainer={DatePickerContainer}
                      minDate={new Date()}
                      maxDate={null}
                    />
                  </div>
                  <div className="col-lg-5">
                    <InputLabeled
                      label="Częstotliwość startów [min]"
                      name="startFrequency"
                      handleChange={handleStageChange}
                      big={true}
                      value={stage.startFrequency}
                    />
                  </div>
                </div>
                <div className="text-center py-3">
                  <Button
                    className={"px-4 mx-3"}
                    variant="success"
                    onClick={addStage}
                  >
                    Dodaj odcinek
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Card className="text-center">
              <Card.Header className="bg-dark text-white">
                Linki do regulaminow, informacji itd.
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Link</th>
                      <th>Opis</th>
                      <th className="text-end">Usuń</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventPaths.map((path, index) => (
                      <tr key={index}>
                        <td>{path.path}</td>
                        <td>{path.description}</td>
                        <td className="text-end">
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            onClick={() =>
                              setEventPaths(
                                eventPaths.filter(
                                  (elem) => elem.path !== path.path
                                )
                              )
                            }
                            title={"Usuń link"}
                            cursor={"pointer"}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="d-grid">
                  <InputLabeled
                    label="Link/ścieżka"
                    name="path"
                    handleChange={(e) =>
                      setPath({ ...path, path: e.target.value })
                    }
                    big={true}
                    value={path.path}
                  />
                  <InputLabeled
                    label="Opis"
                    name="description"
                    handleChange={(e) =>
                      setPath({ ...path, description: e.target.value })
                    }
                    big={true}
                    value={path.description}
                  />
                </div>
                <Button
                  className={"px-4 my-3"}
                  variant="success"
                  onClick={addPath}
                >
                  Dodaj link
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
        {removeEvent && (
          <OkCancelModal
            show={true}
            title={"Usuwanie wydarzenia"}
            text={`Czy napewno chcesz usunąć wydarzenie? Operacja nieodwracalna`}
            handleAccept={() => {
              fetchRemoveEvent();
              setRemoveEvent(false);
            }}
            handleClose={() => setRemoveEvent(false)}
          />
        )}
      </Modal.Body>
      <Modal.Footer className={"justify-content-center"}>
        {event && (
          <Button
            className={"mx-3"}
            variant="secondary"
            onClick={() => setRemoveEvent(true)}
          >
            Usuń wydarzenie
          </Button>
        )}
        <Button className={"mx-3"} variant="secondary" onClick={handleClose}>
          Anuluj
        </Button>
        <Button
          className={"px-4 mx-3"}
          variant="success"
          onClick={handleAccept}
          disabled={stages.length === 0}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
