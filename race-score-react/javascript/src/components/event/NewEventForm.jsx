import React, { useState } from "react";

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

export const NewEventForm = ({ show, handleClose }) => {
  const [myEvent, setMyEvent] = useState({
    name: "",
    description: "",
    date: new Date(),
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

  const handleChange = (event) => {
    setMyEvent({ ...myEvent, [event.target.name]: event.target.value });
  };
  const handleStageChange = (event) => {
    setStage({ ...stage, [event.target.name]: event.target.value });
  };

  const handleAccept = () => {
    const data = { ...myEvent, stages: stages };
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
    setStages([]);
    setStages(tempStages);
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
      <Modal.Header closeButton>
        <Modal.Title>Dodawanie nowego wydarzenia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row u-text-center justify-content-center">
          <div className="col-lg-4 mx-1 border-right shadow-sm p-3 mb-2 bg-white rounded">
            <h5>Wydarzenie</h5>
            <InputLabeled
              label="Nazwa"
              name="name"
              handleChange={handleChange}
              big={true}
              value={myEvent.name}
            />
            <InputLabeled
              label="Opis"
              name="description"
              handleChange={handleChange}
              big={true}
              value={myEvent.description}
            />
            <CustomDatePicker
              label={"Data wydarzenia"}
              onChange={(value) => setMyEvent({ ...myEvent, date: value })}
              selected={myEvent.date}
              calendarContainer={DatePickerContainer}
              //placeholderText={placeholderFrom}
              minDate={new Date()}
              maxDate={null}
            />
          </div>
          <div className="col-lg-7 mx-2 shadow-sm p-3 mb-2 bg-white rounded">
            <h5>Odcinki PS/OS (w kolejności)</h5>
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nazwa</th>
                  <th>Czas startu</th>
                  <th>Częstotliwość</th>
                  <th>Usuń</th>
                </tr>
              </thead>
              <tbody>
                {stages.map((x, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{x.name}</td>
                    <td>{format(x.startTime, "HH:mm")}</td>
                    <td>{x.startFrequency + " min"}</td>
                    <td>
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
              <div className="col-xl-3">
                <InputLabeled
                  label="Długość [m]"
                  name="distance"
                  handleChange={handleStageChange}
                  big={true}
                  onlyNumber={true}
                  value={stage.distance}
                />
              </div>
              <div className="col-xl-4">
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
              <div className="col-xl-5">
                <InputLabeled
                  label="Częstotliwość startów [min]"
                  name="startFrequency"
                  handleChange={handleStageChange}
                  big={true}
                  value={stage.startFrequency}
                />
              </div>
            </div>
            <Button
              className={"px-4 mx-3"}
              variant="success"
              onClick={addStage}
            >
              Dodaj odcinek
            </Button>
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
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
