import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { backendUrl } from "../utils/fetchUtils";
import authHeader from "../../service/auth-header";
import { InputLabeled } from "../common/InputLabeled";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

export const QuickJoinPanel = ({ show, handleClose, eventId }) => {
  const [msg, setMsg] = useState();
  const [team, setTeam] = useState({
    coSportLicense: false,
    sportLicense: false,
    birthDate: new Date(),
    currentCar: {
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
    },
  });

  useEffect(() => {
    if (show) {
      setTeam({
        coSportLicense: false,
        sportLicense: false,
        birthDate: new Date(),
        currentCar: {
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
        },
      });
    }
  }, [show]);

  const fetchAddTeam = () => {
    axios
      .post(`${backendUrl()}/team/addTeam?eventId=${eventId}`, team, {
        headers: authHeader(),
      })
      .then(() => {
        setMsg("Dodano nowego zawodnika");
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchAddTeam();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="l"
    >
      <Modal.Header className="bg-dark text-white" closeButton>
        <Modal.Title>Szybkie dodawanie zawodnika</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          <div className="col-lg-9 text-center">
            <form class="" novalidate onSubmit={handleSubmit}>
              <InputLabeled
                label="Imie i nazwisko kierowcy"
                name="driver"
                handleChange={(e) =>
                  setTeam({ ...team, driver: e.target.value })
                }
                value={team.driver}
                big={true}
                required={true}
              />
              <InputLabeled
                label="Imie i nazwisko pilota"
                name="coDriver"
                handleChange={(e) =>
                  setTeam({ ...team, coDriver: e.target.value })
                }
                value={team.coDriver}
                big={true}
              />
              <InputLabeled
                label="Marka samochodu"
                name="carBrand"
                handleChange={(e) =>
                  setTeam({
                    ...team,
                    currentCar: { ...team.currentCar, brand: e.target.value },
                  })
                }
                value={team.currentCar.brand}
                big={true}
                required={true}
              />
              <InputLabeled
                label="Model samochodu"
                name="carModel"
                handleChange={(e) =>
                  setTeam({
                    ...team,
                    currentCar: { ...team.currentCar, model: e.target.value },
                  })
                }
                value={team.currentCar.model}
                big={true}
                required={true}
              />
              <InputLabeled
                label="Pojemność silnika [dm3]"
                name="engineCapacity"
                handleChange={(e) =>
                  setTeam({
                    ...team,
                    currentCar: {
                      ...team.currentCar,
                      engineCapacity: e.target.value,
                    },
                  })
                }
                value={team.currentCar.engineCapacity}
                big={true}
                required={true}
                onlyNumber={true}
              />
              <div className="d-flex justify-content-center">
                <Form>
                  <span className={"py-0 mb-2 mt-1 mx-1 input-group-text"}>
                    Turbo
                  </span>
                  <Form.Check
                    inline
                    label="TAK"
                    name="turbo"
                    type={"radio"}
                    id={`inline-1`}
                    checked={team.currentCar.turbo}
                    onClick={() =>
                      setTeam({
                        ...team,
                        currentCar: { ...team.currentCar, turbo: true },
                      })
                    }
                  />
                  <Form.Check
                    inline
                    label="NIE"
                    name="turbo"
                    type={"radio"}
                    id={`inline-2`}
                    checked={!team.currentCar.turbo}
                    onClick={() =>
                      setTeam({
                        ...team,
                        currentCar: { ...team.currentCar, turbo: false },
                      })
                    }
                  />
                </Form>
              </div>
              <p>{msg}</p>
              <Button
                className={"m-1"}
                variant="success"
                type="submit"
                // disabled={msg}
              >
                Dołącz do wydarzenia
              </Button>
              <Button
                className={"m-1"}
                variant="secondary"
                onClick={() => handleClose()}
              >
                Wyjdź
              </Button>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
