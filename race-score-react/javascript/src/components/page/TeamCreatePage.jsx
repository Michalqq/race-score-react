import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { InputLabeled } from "../common/InputLabeled";
import { backendUrl } from "../utils/fetchUtils";
import { useLocation } from "react-router-dom";

export const TeamCreatePage = (props) => {
  const location = useLocation();
  const disable = false;

  const [team, setTeam] = useState({
    driver: "",
    coDriver: "",
    teamName: "",
    car: "",
    carClassId: 4,
    driveType: "RWD",
  });

  const fetchAddTeam = () => {
    axios
      .post(
        `${backendUrl()}/team/addTeam?eventId=${location.state.eventId}`,
        team
      )
      .then((res) => {});
  };

  const handleChange = (event) => {
    setTeam({ ...team, [event.target.name]: event.target.value });
  };

  const addTeam = () => {
    fetchAddTeam();
  };

  return (
    <div className="u-text-center">
      <div className="u-box-shadow">
        <div className="col-xl-12">
          <h4 className="pb-2 mb-3 border-bottom">Panel zawodnika:</h4>
        </div>

        <div className="row">
          <div className="col-lg-4 pb-3  border-bottom">
            <div className="row">
              <div className="col-xl-12">
                <h4>Kierowca</h4>
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
              </div>
            </div>
          </div>

          <div className="col-lg-4 pb-3 border-bottom">
            <div className="row">
              <div className="col-xl-12">
                <h4>Samochód</h4>
                <InputLabeled
                  label="Marka i model"
                  name="car"
                  handleChange={handleChange}
                  disabled={disable}
                  big={true}
                  value={team.car}
                />
                <InputLabeled
                  label="Pojemność [cm3]"
                  name="engine"
                  handleChange={handleChange}
                  disabled={disable}
                  onlyNumber={true}
                  big={true}
                  value={team.engine}
                />
                {/* <Selector
                  label={"Rodzaj napędu"}
                  options={psOptions}
                  handleChange={(value) => setStage(value)}
                  isValid={true}
                  big={true}
                /> */}
                {/* <Selector
                  label={"Klasa"}
                  options={psOptions}
                  handleChange={(value) => setStage(value)}
                  isValid={true}
                  big={true}
                /> */}
                <div className="col-xl-12 pt-5">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={addTeam}
                    disabled={disable}
                  >
                    Dodaj zawodnika
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 pb-1 border-bottom">
            <div className="row">
              <div className="col-xl-12">
                <h4>Pilot</h4>

                <div className="inline-flex">
                  <InputLabeled
                    label="Imie i nazwisko"
                    name="coDriver"
                    handleChange={handleChange}
                    disabled={disable}
                    big={true}
                    value={team.coDriver}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCreatePage;
