/* eslint-disable react/display-name */
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import ResultTable from "../common/table/ResultTable";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ScoreDiv, ScoreDivPenalty, TeamDiv, CarDiv } from "../common/Div";
import { Selector } from "../common/Selector";
import { backendUrl } from "../utils/fetchUtils";
import PenaltyTable from "../tables/PenaltyTable";
import DisqualificationTable from "../tables/DisqualificationTable";
import authHeader from "../../service/auth-header";
import moment from "moment";
import { NrBadge } from "../common/NrBadge";
import Button from "react-bootstrap/Button";

const StageScorePage = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const eventId = localStorage.getItem("eventId") || location.state.eventId;

  const GENERAL = "GENERALNA";

  const [event, setEvent] = useState();

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

  const fetchEvent = () => {
    axios
      .get(`${backendUrl()}/event/getEvent?eventId=${eventId}`)
      .then((res) => {
        setEvent({
          ...res.data,
          date: new Date(res.data.date),
          signDeadline: new Date(res.data.signDeadline),
        });
      });
  };
  const fetchData = () => {
    setLoading(true);
    if (stage !== undefined) {
      fetchScores();
      fetchSummedScores();
      fetchEvent();
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
        width: "1%",
        id: "place",
        Header: "P.",
        accessor: (cellInfo) => cellInfo.place,
        disableFilters: true,
        disableSortBy: true,
        Cell: (row) => <> {row.row.index + 1}</>,
      },
      {
        width: "3%",
        id: "nr",
        Header: "Nr",
        accessor: (cellInfo) => cellInfo.number,
        disableFilters: true,
        disableSortBy: true,
        Cell: (row) => <NrBadge value={"#" + row.value}></NrBadge>,
      },
      {
        width: "40%",
        id: "team",
        Header: "Załoga",
        disableFilters: true,
        disableSortBy: true,
        Cell: (cellInfo) => <TeamDiv team={cellInfo.row.original} />,
      },
      {
        width: "30%",
        id: "car",
        Header: "Samochód",
        disableFilters: true,
        disableSortBy: true,
        Cell: (cellInfo) => (
          <CarDiv
            line1={cellInfo.row.original.car}
            line2={cellInfo.row.original.className}
            carBrand={cellInfo.row.original.brand}
          />
        ),
      },
      {
        width: "15%",
        id: "score",
        Header: "Czas/kary",
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
    <>
      <div className="row">
        <p style={{ fontSize: "11px" }} className="my-0 py-0">
          Aplikacja w fazie testów
        </p>
        <h4>{event?.name || ""}</h4>
        <div className="col-xl-8 d-flex justify-content-center">
          {event?.logoPath !== undefined && event?.logoPath !== null && (
            <div className="col-6">
              <div className="m-2 text-center">
                <img
                  style={{ height: "140px" }}
                  className="img-fluid rounded float-left"
                  src="http://www.automobilklub.chelm.pl/img_news/30wospb.jpg"
                  alt="Logo"
                ></img>
              </div>
            </div>
          )}
          <div className="col-6">
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
        </div>
        <div className="col-xl-4">
          <div className="m-2 text-center">
            <h6>{`Data wydarzenia:  `}</h6>
            <h6 className="fw-bold">
              {moment(event?.date).format(" dddd, DD MMM YYYY, HH:mm")}
            </h6>
            {referee && (
              <>
                <Button
                  className={"m-1"}
                  variant="success"
                  onClick={() =>
                    navigate(`/add_score`, {
                      state: { eventId: eventId },
                    })
                  }
                >
                  Dodaj wynik
                </Button>
                <Button
                  className={"m-1"}
                  variant="primary"
                  onClick={() =>
                    navigate(`/add_penalty`, {
                      state: { eventId: eventId },
                    })
                  }
                >
                  Dodaj kare
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-6 px-1">
          <div className="shadow bg-body rounded">
            <div
              className="fw-bold alert alert-secondary p-1 m-0 "
              role="alert"
            >
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
              manualPagination={true}
            />
          </div>
        </div>
        <div className="col-xl-6 px-1">
          <div className="shadow bg-body rounded">
            <div className="fw-bold alert alert-secondary p-1 m-0" role="alert">
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
              manualPagination={true}
            />
          </div>
        </div>
        <div className="col-xl-12 px-1">
          <div className="shadow bg-body rounded mt-4 p-0">
            <div className="fw-bold alert alert-secondary p-1 m-0" role="alert">
              {"Kary"}
            </div>
            <PenaltyTable
              eventId={eventId}
              onRemove={fetchData}
              referee={referee}
            />
          </div>
          <div className="shadow bg-body rounded mt-4">
            <div className="fw-bold alert alert-secondary p-1 m-0" role="alert">
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
    </>
  );
};

export default StageScorePage;
