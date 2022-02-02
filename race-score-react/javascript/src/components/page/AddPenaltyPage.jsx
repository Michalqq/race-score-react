import React, { useState, useEffect } from "react";
import { Selector } from "../common/Selector";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import { backendUrl } from "../utils/fetchUtils";
import { useLocation, useNavigate } from "react-router-dom";
import authHeader from "../../service/auth-header";
import Button from "react-bootstrap/Button";
import { InputLabeled } from "../common/InputLabeled";

export const AddPenaltyPage = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const eventId = location.state.eventId;

  const [psOptions, setPsOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [penaltyOptions, setPenaltyOptions] = useState([]);

  const [teamId, setTeamId] = useState();
  const [stage, setStage] = useState();

  const [penalty, setPenalty] = useState({
    penaltyDesc: "",
    penaltyKind: null,
  });

  const [loadingTeams, setLoadingTeams] = useState(false);
  const [disable, setDisable] = useState(false);
  const [msg, setMsg] = useState();
  const [customPenaltySec, setCustomPenaltySec] = useState(-1);

  const fetchPsOptions = () => {
    axios
      .get(`${backendUrl()}/event/getPsOptions?eventId=${eventId}`)
      .then((res) => {
        setPsOptions(res.data);
        setStage(res.data[0]?.value);
      });
  };

  const fetchPenaltyOptions = () => {
    axios.get(`${backendUrl()}/penalty/getPenaltyOptions`).then((res) => {
      setPenaltyOptions(res.data);
    });
  };

  const fetchTeamsOptions = () => {
    setLoadingTeams(true);
    axios
      .get(`${backendUrl()}/team/getTeamOptions?stageId=${stage}&mode=PENALTY`)
      .then((res) => {
        setTeamOptions(res.data);
        setLoadingTeams(false);
        setDisable(false);
        if (res.data.length === 0) {
          setDisable(true);
        }
      });
  };

  const postPenalty = (data, seconds) => {
    axios
      .post(`${backendUrl()}/penalty/addPenalty?seconds=${seconds}`, data, {
        headers: authHeader(),
      })
      .then((res) => {
        if (res.data === 1) {
          const team = teamOptions.find((x) => x.value === data.teamId)?.label;
          const penalty = penaltyOptions.find(
            (x) => x.value === data.penaltyKind
          );
          setMsg(
            `Dodano karę: ${penalty.label} ${
              seconds !== -1 ? ";Liczba sekund: " + seconds + "s " : ""
            }; Kierowca:${team}`
          );
          setTimeout(() => setMsg(), 10000);
        }
      });
  };

  useEffect(() => {
    fetchPenaltyOptions();
  }, []);

  useEffect(() => {
    if (eventId !== undefined) fetchPsOptions();
  }, [eventId]);

  useEffect(() => {
    if (stage !== undefined) fetchTeamsOptions();
  }, [stage]);

  useEffect(() => {
    if (teamOptions.length > 0) setTeamId(teamOptions[0].value);
  }, [teamOptions]);

  const addPenalty = () => {
    const data = {
      teamId: teamId,
      stageId: stage,
      penaltyKind: penalty.penaltyKind,
      description: penalty.penaltyDesc,
    };
    postPenalty(data, customPenaltySec);
    resetPenalty();
  };

  const resetPenalty = () => {
    setPenalty({ ...penalty, penaltyDesc: "" });
    setCustomPenaltySec(-1);
  };

  const handleChange = (event) => {
    setPenalty({ ...penalty, [event.target.name]: event.target.value });
  };

  return (
    <div className="u-text-center">
      <div className="u-box-shadow">
        <div className="col-xl-12">
          <h5 className="pb-2 mb-1 border-bottom">Dodaj kare:</h5>
        </div>
        <div className="row justify-content-center text-center">
          <div className="col-lg-4 pb-1">
            <Selector
              label={"Odcinek PS"}
              options={psOptions}
              handleChange={(value) => setStage(value)}
              isValid={true}
            />
            <Selector
              label={"Załoga"}
              options={teamOptions}
              handleChange={(value) => setTeamId(value)}
              isValid={true}
              isLoading={loadingTeams}
            />
            <div className="d-flex">
              <div style={{ width: "-moz-available" }}>
                <Selector
                  label={"Rodzaj kary"}
                  options={penaltyOptions}
                  handleChange={(value) =>
                    setPenalty({ ...penalty, penaltyKind: value })
                  }
                  isValid={true}
                  isLoading={penaltyOptions.length === 0}
                />
              </div>
              {penalty.penaltyKind === "100" && (
                <div className="px-1">
                  <InputLabeled
                    label="Kara w sekundach"
                    inputPlaceholder="00"
                    value={customPenaltySec}
                    handleChange={(e) => setCustomPenaltySec(e.target.value)}
                    onlyNumber={true}
                    big={true}
                  />
                </div>
              )}
            </div>

            <textarea
              placeholder={"Dodatkowy opis"}
              value={penalty.penaltyDesc}
              name="penaltyDesc"
              onChange={handleChange}
              className={"form-control centered-grid "}
              rows={2}
              disabled={disable}
            />
            <div className="col-xl-12 pt-1">
              <button
                type="button"
                className="btn btn-success"
                onClick={addPenalty}
                disabled={disable || teamId === undefined}
              >
                Zapisz karę
              </button>
            </div>
          </div>
          <div className="col-lg-10 border-bottom" style={{ height: "40px" }}>
            <p className={"px-0"}>{msg}</p>
          </div>
        </div>
      </div>
      <div className="col-sm pt-1"></div>
      <Button
        className={"mx-2 py-1 px-2"}
        variant="primary"
        onClick={() =>
          navigate(`/add_score`, {
            state: { eventId: eventId },
          })
        }
      >
        Przejdź do dodawania wyników
      </Button>
      <Button
        className={"mx-2 py-1 px-2"}
        variant="success"
        onClick={() =>
          navigate(`/event`, {
            state: { eventId: eventId },
          })
        }
      >
        Wyniki
      </Button>
    </div>
  );
};

export default AddPenaltyPage;
