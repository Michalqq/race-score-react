import React, { useState, useEffect } from "react";
import { Selector } from "../common/Selector";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { InputLabeled } from "../common/InputLabeled";
import { RadioButton } from "../common/Button";
import { backendUrl } from "../utils/fetchUtils";
import { useLocation, Link } from "react-router-dom";
import authHeader from "../../service/auth-header";

export const AddScorePage = (props) => {
  const location = useLocation();
  const eventId = location.state.eventId;

  const mode = [
    { value: "NEW", desc: "Wprowadzanie nowych wyników" },
    { value: "EDIT", desc: "Tryb edycji wyników" },
  ];

  const [msg, setMsg] = useState("");
  const [editMode, setEditMode] = useState(mode[0].value);
  const [stageScoreId, setStageScoreId] = useState();

  const [psOptions, setPsOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);

  const [stageStartHour, setStageStartHour] = useState();
  const [stageStartMin, setStageStartMin] = useState();

  const [scoreMin, setScoreMin] = useState();
  const [scoreSec, setScoreSec] = useState();
  const [scoreMiliSec, setScoreMiliSec] = useState();
  const [teamId, setTeamId] = useState();
  const [stage, setStage] = useState();

  const [penaltySec, setPenaltySec] = useState("");
  const [penaltyDesc, setPenaltyDesc] = useState("");

  const [loadingTeams, setLoadingTeams] = useState(false);
  const [disable, setDisable] = useState(false);

  const fetchPsOptions = () => {
    axios
      .get(`${backendUrl()}/event/getPsOptions?eventId=${eventId}`, {
        headers: authHeader(),
      })
      .then((res) => {
        setPsOptions(res.data);
        setStage(res.data[0]?.value);
      });
  };

  const fetchTeamsOptions = () => {
    setLoadingTeams(true);
    axios
      .get(
        `${backendUrl()}/team/getTeamOptions?stageId=${stage}&mode=${editMode}`,
        {
          headers: authHeader(),
        }
      )
      .then((res) => {
        setTeamOptions(res.data);
        setLoadingTeams(false);
        setMsg("");
        setDisable(false);
        if (res.data.length === 0) {
          resetData();
          setMsg("Wszystkie wyniki wybranego odcinka zostały wprowadzone");
        }
      });
  };

  const addScore = (data) => {
    axios
      .post(`${backendUrl()}/score/addScore`, data, {
        headers: authHeader(),
      })
      .then((res) => {
        fetchTeamsOptions();
      });
  };

  useEffect(() => {
    fetchPsOptions();
  }, []);

  useEffect(() => {
    if (psOptions.length > 0 && stage !== undefined) fetchTeamsOptions();
  }, [stage, psOptions]);

  useEffect(() => {
    if (teamOptions.length > 0) setTeamId(teamOptions[0].value);
  }, [teamOptions]);

  useEffect(() => {
    if (teamId !== undefined && editMode === mode[1].value) getTeamData();
  }, [teamId]);

  useEffect(() => {
    if (stage !== undefined) fetchTeamsOptions();
  }, [editMode]);

  const getTeamData = () => {
    axios
      .get(
        `${backendUrl()}/score/getTeamScore?stageId=${stage}&teamId=${teamId}`
      )
      .then((res) => {
        setScoreMin(res.data.scoreMin);
        setScoreSec(res.data.scoreSec);
        setScoreMiliSec(res.data.scoreMiliSec);
        setStageScoreId(res.data.stageScoreId);
      });
  };

  const addScoreClick = () => {
    const startStageInMin = stageStartHour * 60 + stageStartMin;
    const scoreInMilis =
      scoreMin * 60 * 1000 + scoreSec * 1000 + scoreMiliSec * 10;

    const data = {
      teamId: teamId,
      stageId: stage,
      stageStartTime: startStageInMin,
      score: scoreInMilis,
      stageScoreId: editMode === mode[1].value ? stageScoreId : null,
    };
    addScore(data);
    props.setAddedNewScore(data);
    resetData();
  };

  const checkboxChange = (e) => {
    if (e.target.checked && editMode !== e.target.value) {
      setEditMode(e.target.value);
      resetData();
      setTeamOptions([]);
      console.log(e.target.value);
    }
  };

  const resetData = () => {
    setDisable(true);
    setScoreMin("");
    setScoreSec("");
    setScoreMiliSec("");

    setPenaltyDesc("");
    setPenaltySec("");
  };

  return (
    <div className="u-text-center">
      <div className="u-box-shadow">
        <div className="col-xl-12">
          <h4 className="pb-2 mb-3 border-bottom">Dodaj wynik:</h4>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-4 pb-3 border-bottom">
            <div className="centered-grid form-group ">
              <RadioButton
                label={mode[0].desc}
                value={mode[0].value}
                isConfirmed={editMode === mode[0].value}
                onClick={(e) => checkboxChange(e)}
                name={"editMode"}
              />
              <RadioButton
                label={mode[1].desc}
                value={mode[1].value}
                isConfirmed={false}
                onClick={(e) => checkboxChange(e)}
                name={"editMode"}
              />
            </div>

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

          <div className="col-lg-4 pb-3 border-bottom">
            <div className="row">
              <div className="col-xl-12">
                <h4>Wynik</h4>
                <div className="inline-flex">
                  <InputLabeled
                    label="Minuty"
                    inputPlaceholder="00"
                    value={scoreMin}
                    handleChange={(e) => setScoreMin(e.target.value)}
                    disabled={disable}
                    onlyNumber={true}
                  />
                  <InputLabeled
                    label="Sekundy"
                    inputPlaceholder="00"
                    value={scoreSec}
                    handleChange={(e) => setScoreSec(e.target.value)}
                    disabled={disable}
                    onlyNumber={true}
                    max={59}
                  />
                  <InputLabeled
                    label="Setne"
                    inputPlaceholder="00"
                    value={scoreMiliSec}
                    handleChange={(e) => setScoreMiliSec(e.target.value)}
                    disabled={disable}
                    onlyNumber={true}
                    max={99}
                  />
                </div>
                <div className="col-xl-12 pt-1 fw-bolder">{msg}</div>
                <div className="col-xl-12 pt-3">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={addScoreClick}
                    disabled={disable}
                  >
                    Zapisz wynik
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm pt-5"></div>
      <Link to={"/add_penalty?" + eventId} className="btn btn-primary">
        Przejdź do dodawania kar
      </Link>
    </div>
  );
};

export default AddScorePage;
