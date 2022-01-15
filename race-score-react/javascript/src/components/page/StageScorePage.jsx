/* eslint-disable react/display-name */
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import ResultTable from "../common/table/ResultTable";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ScoreDiv, ScoreDivPenalty, TeamDiv, CarDiv } from "../common/Div";
import { Selector } from "../common/Selector";
import Badge from "react-bootstrap/Button";
import { backendUrl } from "../utils/fetchUtils";
import PenaltyTable from "../tables/PenaltyTable";
import DisqualificationTable from "../tables/DisqualificationTable";
import authHeader from "../../service/auth-header";

const StageScorePage = (props) => {
  const location = useLocation();
  const eventId = location.state.eventId;

  const GENERAL = "GENERALNA";

  const [scores, setScores] = useState([]);
  const [referee, setReferee] = useState(false);

  const [summedScores, setSummedScores] = useState([]);
  const [psOptions, setPsOptions] = useState([]);
  const [classesOptions, setClassesOptions] = useState([]);

  const [currentClass, setCurrentClass] = useState(GENERAL);
  const [stage, setStage] = useState();

  const [stageName, setStageName] = useState("");

  const [loading, setLoading] = useState(true);

  const fetchScores = () => {
    axios
      .get(`${backendUrl()}/score/getStageScores?stageId=${stage}`)
      .then((res) => {
        setScores(res.data);
        setLoading(false);
      });
  };

  const fetchSummedScores = () => {
    axios
      .get(
        `${backendUrl()}/score/getStagesSumScores?eventId=${eventId}&stageId=${stage}`
      )
      .then((res) => {
        setSummedScores(res.data);
        setLoading(false);
      });
  };

  const fetchPsOptions = () => {
    axios
      .get(`${backendUrl()}/event/getStagesAndClasses?eventId=${eventId}`)
      .then((res) => {
        setPsOptions(res.data.psOptions || []);
        setClassesOptions(res.data.classesOptions || []);
      });
  };

  const fetchData = () => {
    setLoading(true);
    if (stage !== undefined) {
      fetchScores();
      fetchSummedScores();
    }
  };

  useEffect(() => {
    axios
      .get(`${backendUrl()}/event/checkReferee?eventId=${eventId}`, {
        headers: authHeader(),
      })
      .then((res) => {
        setReferee(res.data);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [stage]);

  useEffect(() => {
    fetchPsOptions();
    fetchData();
  }, [props.addedNewScore]);

  const columns = useMemo(
    () => [
      {
        width: "2%",
        id: "place",
        Header: "P.",
        accessor: (cellInfo) => cellInfo.place,
        disableFilters: true,
        disableSortBy: true,
        Cell: (row) => <> {row.row.index + 1}</>,
      },
      {
        width: "5%",
        id: "nr",
        Header: "Nr",
        accessor: (cellInfo) => cellInfo.number,
        disableFilters: true,
        disableSortBy: true,
        Cell: (row) => (
          <Badge className={"p-1 py-0 "} bg="primary">
            {row.value}
          </Badge>
        ),
      },
      {
        width: "20%",
        id: "team",
        Header: "Załoga",
        disableFilters: true,
        disableSortBy: true,
        Cell: (cellInfo) => (
          <TeamDiv
            line1={cellInfo.row.original.driver}
            line2={cellInfo.row.original.coDriver}
            line3={cellInfo.row.original.teamName}
          />
        ),
      },
      {
        width: "20%",
        id: "car",
        Header: "Samochód",
        disableFilters: true,
        disableSortBy: true,
        Cell: (cellInfo) => (
          <CarDiv
            line1={cellInfo.row.original.car}
            line2={cellInfo.row.original.className}
          />
        ),
      },
      {
        width: "15%",
        id: "score",
        Header: "Czas / kary",
        accessor: (cellInfo) => cellInfo.stageScore,
        disableFilters: true,
        disableSortBy: true,
        Cell: (cellInfo) => (
          <ScoreDivPenalty
            line1={cellInfo.row.original.stageScore}
            line2={cellInfo.row.original.totalPenalty}
          />
        ),
      },
      {
        width: "15%",
        id: "result",
        Header: "Wynik",
        accessor: (cellInfo) => cellInfo.stageScore,
        disableFilters: true,
        disableSortBy: true,
        Cell: (cellInfo) => (
          <ScoreDiv
            line1={cellInfo.row.original.totalTime}
            line2={cellInfo.row.original.timeTo}
            line3={cellInfo.row.original.timeToFirst}
          />
        ),
      },
    ],
    []
  );

  return (
    <div className="row">
      <div className="col-xl-12">
        <Selector
          label={"Klasyfikacja"}
          options={classesOptions}
          handleChange={(value) => {
            setCurrentClass(
              classesOptions.find((e) => e.value === value).label
            );
          }}
          isValid={true}
        />
      </div>
      <div className="col-xl-12">
        <Selector
          label={"PS"}
          options={psOptions}
          handleChange={(value) => {
            setStage(value);
            setStageName(psOptions.find((e) => e.value === value).label);
          }}
          isValid={true}
        />
      </div>
      <div className="col-xl-6">
        <div className="shadow bg-body rounded">
          <div className="alert alert-secondary p-1 m-0" role="alert">
            {`Czas NA - ${stageName}`}
          </div>
          <ResultTable
            columns={columns}
            data={
              currentClass !== GENERAL
                ? scores.filter((x) => x.className === currentClass)
                : scores
            }
            pageCount={3}
            isLoading={loading}
            isFooter={false}
            isHeader={true}
            cursor={"pointer"}
          />
        </div>
      </div>
      <div className="col-xl-6">
        <div className="shadow bg-body rounded">
          <div className="alert alert-secondary p-1 m-0" role="alert">
            {`Czas PO - ${stageName}`}
          </div>
          <ResultTable
            columns={columns}
            data={
              currentClass !== GENERAL
                ? summedScores.filter((x) => x.className === currentClass)
                : summedScores
            }
            pageCount={3}
            isLoading={loading}
            isFooter={false}
            isHeader={true}
            cursor={"pointer"}
          />
        </div>
      </div>
      <div className="col-xl-12">
        <div className="shadow bg-body rounded mt-4 p-0">
          <div className="alert alert-secondary p-1 m-0" role="alert">
            {"Kary"}
          </div>
          <PenaltyTable
            eventId={eventId}
            onRemove={fetchData}
            referee={referee}
          />
        </div>
        <div className="shadow bg-body rounded mt-4">
          <div className="alert alert-secondary p-1 m-0" role="alert">
            {`Dyskwalifikacje / Wycofania`}
          </div>
          <DisqualificationTable
            eventId={eventId}
            onRemove={fetchData}
            referee={referee}
          />
        </div>
      </div>
    </div>
  );
};

export default StageScorePage;
