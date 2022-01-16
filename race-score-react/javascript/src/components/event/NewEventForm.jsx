import React, { useState, useEffect } from "react";

import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
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

export const NewEventForm = ({ show, handleClose }) => {
  const [myEvent, setMyEvent] = useState({
    name: "",
    description: "",
    date: new Date(),
    signDeadline: new Date(),
    admin: 1,
    stages: [],
  });
  const [stage, setStage] = useState({
    index: 0,
    name: "",
    distance: 1.5,
    startTime: new Date(),
    startFrequency: 1,
  });
  const [stages, setStages] = useState([]);
  const [referee, setReferee] = useState([]);
  const [refereeOptions, setRefereeOptions] = useState([]);

  useEffect(() => {
    if (!show) return;

    axios
      .get(`${backendUrl()}/event/getRefereeOptions`, {
        headers: authHeader(),
      })
      .then((res) => {
        setRefereeOptions(res.data);
      });
    setReferee([]);
    setStages([]);
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

  const removeFromStages = (id) => {
    const tempStages = stages.filter((x) => x.index !== id);
    setStages(tempStages);
  };

  const removeReferee = (id) => {
    const tempRef = referee.filter((x) => x.userId !== id);
    setReferee(tempRef);
  };

  const addReferee = (id) => {
    const tempRef = refereeOptions.find((x) => x.value === id);
    const newRef = { userId: Number(tempRef.value), username: tempRef.label };
    setReferee([...referee, newRef]);
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
          <div className="col-lg-4 mx-1 border-right shadow mb-1 bg-white rounded">
            <h5>Wydarzenie</h5>
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
            <div className="d-flex">
              <CustomDatePicker
                label={"Data wydarzenia"}
                onChange={(value) => setMyEvent({ ...myEvent, date: value })}
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
                        className={"fa-lg"}
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
          </div>
          <div className="col-lg-7 mx-2 shadow mb-1 bg-white rounded">
            <h5>Odcinki PS/OS (w kolejności)</h5>
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
                      <td>{format(x.startTime, "HH:mm")}</td>
                      <td>{x.startFrequency + " min"}</td>
                      <td className="text-end">
                        <FontAwesomeIcon
                          className={"m-2 fa-lg"}
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
                    console.log(value);
                    setStage({
                      ...stage,
                      startTime: value,
                    });
                  }}
                  selected={stage.startTime}
                  calendarContainer={DatePickerContainer}
                  //placeholderText={placeholderFrom}
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
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className={"justify-content-center"}>
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
