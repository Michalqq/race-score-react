import React, { useState, useEffect } from "react";
import { Selector } from "../common/Selector";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import { backendUrl } from "../utils/fetchUtils";
import { useLocation, Link } from "react-router-dom";
import authHeader from "../../service/auth-header";

export const AddPenaltyPage = (props) => {
  const location = useLocation();
  const eventId = location.state.eventId;

  const [psOptions, setPsOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [penaltyOptions, setPenaltyOptions] = useState([]);

  const [teamId, setTeamId] = useState();
  const [stage, setStage] = useState();

  const [penalty, setPenalty] = useState({
    penaltyDesc: null,
    penaltyKind: null,
  });

  const [loadingTeams, setLoadingTeams] = useState(false);
  const [disable, setDisable] = useState(false);

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

  const postPenalty = (data) => {
    axios
      .post(`${backendUrl()}/penalty/addPenalty`, data, {
        headers: authHeader(),
      })
      .then((res) => {
        setPenaltyOptions(res.data);
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
    postPenalty(data);
    resetPenalty();
  };

  const resetPenalty = () => {
    setPenalty({
      penaltyDesc: null,
      penaltyKind: null,
    });
  };

  const handleChange = (event) => {
    setPenalty({ ...penalty, [event.target.name]: event.target.value });
  };

  return (
    <div className="u-text-center">
      <div className="u-box-shadow">
        <div className="col-xl-12">
          <h4 className="pb-2 mb-3 border-bottom">Dodaj kare:</h4>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-4 pb-3 border-bottom">
            <div className="pb-3" />
            <Selector
              label={"PS"}
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
          </div>

          <div className="col-lg-4 pb-1 border-bottom">
            <div className="row">
              <div className="col-xl-12">
                <h4>Kara</h4>

                <div className="inline-flex">
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
                <div className="inline-flex">
                  <textarea
                    placeholder={"Dodatkowy opis"}
                    value={penalty.penaltyDesc}
                    name="penaltyDesc"
                    onChange={handleChange}
                    className={"form-control centered-grid "}
                    rows={2}
                    disabled={disable}
                  />
                </div>

                <div className="col-xl-12 pt-3">
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
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm pt-5"></div>{" "}
      <Link to={"/add_score?" + eventId} className="btn btn-primary">
        Przejdź do dodawania wyników
      </Link>
    </div>
  );
};

export default AddPenaltyPage;
