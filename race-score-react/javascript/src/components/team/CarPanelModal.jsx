import React, { useState, useEffect } from "react";

import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { InputLabeled } from "../common/InputLabeled";
import { backendUrl } from "../utils/fetchUtils";
import { DateInput } from "../common/DateInput";
import { Selector } from "../common/Selector";

export const CarPanelModal = ({ show, handleClose, teamId, carToEdit }) => {
  const [options, setOptions] = useState();
  const [car, setCar] = useState({
    carId: null,
    brand: "",
    model: "",
    year: "",
    licensePlate: "",
    vin: "",
    engineCapacity: "",
    turbo: false,
    driveType: "1",
    petrol: "BENZYNA",
    insurance: "",
    insuranceExpiryDate: new Date(),
    carInspectionExpiryDate: new Date(),
  });

  const setEmptyCar = () => {
    setCar({
      carId: null,
      brand: "",
      model: "",
      year: "",
      licensePlate: "",
      vin: "",
      engineCapacity: "",
      turbo: false,
      driveType: "1",
      petrol: "BENZYNA",
      insurance: "",
      insuranceExpiryDate: new Date(),
      carInspectionExpiryDate: new Date(),
    });
  };

  useEffect(() => {
    if (show) {
      axios.get(`${backendUrl()}/team/getTeamOptionList`).then((res) => {
        setOptions(res.data);
      });
      if (carToEdit !== true) setCar(carToEdit);
    }
  }, [show]);

  const handleChange = (event) => {
    setCar({ ...car, [event.target.name]: event.target.value });
  };

  const fetchAddCar = () => {
    axios
      .post(`${backendUrl()}/team/addCar?teamId=${teamId}`, {
        ...car,
        teamId: teamId,
      })
      .then(() => {
        setEmptyCar();
        handleClose();
      });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header closeButton className="bg-secondary">
        <Modal.Title className="text-white">Dodawanie samochodu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-lg-12 pb-3">
            <Card className="">
              <Card.Body>
                <div className="d-flex">
                  <InputLabeled
                    label="Marka"
                    name="brand"
                    handleChange={handleChange}
                    big={true}
                    value={car.brand}
                  />
                  <InputLabeled
                    label="Model"
                    name="model"
                    handleChange={handleChange}
                    big={true}
                    value={car.model}
                  />
                  <InputLabeled
                    label="Rok produkcji"
                    name="year"
                    handleChange={handleChange}
                    big={true}
                    value={car.year}
                  />
                </div>
                <div className="d-flex">
                  <InputLabeled
                    label="Nr. rejestracyjny"
                    name="licensePlate"
                    handleChange={handleChange}
                    big={true}
                    value={car.licensePlate}
                  />
                  <InputLabeled
                    label="VIN"
                    name="vin"
                    handleChange={handleChange}
                    big={true}
                    value={car.vin}
                  />
                </div>
                <div className="d-flex">
                  <InputLabeled
                    label="Silnik [dm3]"
                    name="engineCapacity"
                    handleChange={handleChange}
                    big={true}
                    value={car.engineCapacity}
                  />

                  <Form>
                    <span className={"mt-1 input-group-text"} id="">
                      Turbo
                    </span>
                    <Form.Check
                      inline
                      label="TAK"
                      name="turbo"
                      type={"radio"}
                      id={`inline-1`}
                      checked={car.turbo}
                      onClick={() => setCar({ ...car, turbo: true })}
                    />
                    <Form.Check
                      inline
                      label="NIE"
                      name="turbo"
                      type={"radio"}
                      id={`inline-2`}
                      checked={!car.turbo}
                      onClick={() => setCar({ ...car, turbo: false })}
                    />
                  </Form>
                  <Selector
                    label={"Rodzaj napędu"}
                    options={options?.driveTypeOption}
                    handleChange={(value) =>
                      setCar({ ...car, driveType: value })
                    }
                    isValid={true}
                  />
                  <Selector
                    label={"Paliwo"}
                    options={options?.petrolOption}
                    handleChange={(value) => setCar({ ...car, petrol: value })}
                    isValid={true}
                  />
                </div>
                <div className="d-flex">
                  <DateInput
                    value={car.carInspectionExpiryDate}
                    label={"Data ważności przeglądu samochodu"}
                    onChange={(val) =>
                      setCar({ ...car, carInspectionExpiryDate: val })
                    }
                    minDate={new Date()}
                  />
                </div>
                <div className="d-flex">
                  <InputLabeled
                    label="Nr. polisy ubezpieczeniowej + firma"
                    name="insurance"
                    handleChange={handleChange}
                    big={true}
                    value={car.insurance}
                  />
                  <DateInput
                    value={car.insuranceExpiryDate}
                    label={"Data ważności polisy"}
                    onChange={(val) =>
                      setCar({ ...car, insuranceExpiryDate: val })
                    }
                    minDate={new Date()}
                  />
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className={"justify-content-center"}>
        <Button
          className={"m-1"}
          variant="success"
          onClick={() => fetchAddCar()}
        >
          {carToEdit !== true ? "Zapisz zmiany" : "Dodaj samochód"}
        </Button>
        <Button
          className={"m-1"}
          variant="secondary"
          onClick={() => {
            setEmptyCar();
            handleClose();
          }}
        >
          Anuluj
        </Button>
      </Modal.Footer>
    </Modal>
  );
};