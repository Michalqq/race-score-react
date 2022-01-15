/* eslint-disable react/display-name */
import React, { useState, useMemo, useEffect } from "react";
import ResultTable from "../common/table/ResultTable";
import axios from "axios";
import { backendUrl } from "../utils/fetchUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faDollarSign,
  faExclamation,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { OkCancelModal } from "../common/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";

const DriverListPage = (props) => {
  const location = useLocation();
  const eventId = location.state.eventId;
  const [teams, setTeams] = useState();
  const [teamToRemove, setTeamToRemove] = useState({
    driver: null,
    teamId: null,
  });
  const [teamToEntryFee, setTeamToEntryFee] = useState({
    driver: null,
    teamId: null,
  });

  const eraseTeamToRemove = () => {
    setTeamToRemove({
      driver: null,
      teamId: null,
    });
  };

  const eraseTeamToEntryFee = () => {
    setTeamToEntryFee({
      driver: null,
      teamId: null,
    });
  };

  const getDriverAndTeamId = (cellInfo) => {
    return {
      teamId: cellInfo.row.original.teamId,
      driver:
        cellInfo.row.original.team.driver +
        " / " +
        cellInfo.row.original.team.coDriver,
    };
  };

  const fetchTeams = () => {
    axios
      .get(`${backendUrl()}/event/getTeams?eventId=${eventId}`)
      .then((res) => {
        setTeams(res.data);
      });
  };

  const fetchRemoveTeam = (teamId) => {
    axios
      .post(
        `${backendUrl()}/event/removeTeam?eventId=${eventId}&teamId=${teamId}`
      )
      .then(() => {
        fetchTeams();
      });
  };

  const fetchConfirmEntryFee = (teamId) => {
    axios
      .post(
        `${backendUrl()}/event/confirmEntryFee?eventId=${eventId}&teamId=${teamId}`
      )
      .then(() => {
        fetchTeams();
      });
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const columns = useMemo(
    () => [
      {
        width: "5%",
        id: "index",
        Header: "L.p.",
        accessor: (cellInfo) => cellInfo.teamId,
        disableFilters: true,
      },
      {
        width: "1%",
        id: "#",
        Header: "#",
        accessor: (cellInfo) => cellInfo.number,
        disableFilters: true,
      },
      {
        width: "14%",
        id: "team",
        Header: "Załoga",
        accessor: (cellInfo) =>
          cellInfo.team.driver + " " + cellInfo.team.coDriver,
        disableFilters: true,
      },
      {
        width: "12%",
        id: "car",
        Header: "Samochód",
        accessor: (cellInfo) => cellInfo.team.car,
        disableFilters: true,
      },
      {
        width: "12%",
        id: "entryFee",
        Header: "Wpisowe",
        disableFilters: true,
        Cell: (cellInfo) =>
          cellInfo.row.original.entryFeePaid ? (
            <FontAwesomeIcon className={"text-success"} icon={faDollarSign} />
          ) : (
            <FontAwesomeIcon className={"text-danger"} icon={faExclamation} />
          ),
      },
      {
        width: "12%",
        id: "confirmEntryFee",
        Header: "Potwierdź wpisowe",
        disableFilters: true,
        Cell: (cellInfo) => (
          <FontAwesomeIcon
            className={"m-2 fa-lg"}
            icon={faCoins}
            onClick={() => setTeamToEntryFee(getDriverAndTeamId(cellInfo))}
            title={"Potwierdź wpisowe"}
            cursor={"pointer"}
          />
        ),
      },
      {
        width: "12%",
        id: "delete",
        Header: "Usuń załoge",
        disableFilters: true,
        Cell: (cellInfo) => (
          <FontAwesomeIcon
            className={"m-2 fa-lg"}
            icon={faTimesCircle}
            onClick={() => setTeamToRemove(getDriverAndTeamId(cellInfo))}
            title={"Usuń załoge"}
            cursor={"pointer"}
          />
        ),
      },
    ],
    []
  );

  return (
    <>
      <ResultTable
        columns={columns}
        data={teams}
        pageCount={3}
        isLoading={false}
        isFooter={false}
        isHeader={true}
      />
      {teamToRemove.teamId !== null && (
        <OkCancelModal
          show={true}
          title={"Usuwanie załogi"}
          text={`Czy napewno chcesz usunąć załoge: ${teamToRemove.driver}`}
          handleAccept={() => {
            fetchRemoveTeam(teamToRemove.teamId);
            eraseTeamToRemove();
          }}
          handleClose={() => {
            eraseTeamToRemove();
          }}
        />
      )}
      {teamToEntryFee.teamId !== null && (
        <OkCancelModal
          show={true}
          title={"Potwierdzanie wpisowego"}
          text={`Czy napewno chcesz potwierdzić wpłatę wpisowego przez załoge: ${teamToEntryFee.driver}`}
          handleAccept={() => {
            fetchConfirmEntryFee(teamToEntryFee.teamId);
            eraseTeamToEntryFee();
          }}
          handleClose={() => {
            eraseTeamToEntryFee();
          }}
        />
      )}
    </>
  );
};

export default DriverListPage;
