import React, { useState, useEffect, useMemo } from "react";

import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { backendUrl } from "../utils/fetchUtils";
import ResultTable from "../common/table/ResultTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faDollarSign,
  faExclamation,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { OkCancelModal } from "../common/Modal";
import authHeader from "../../service/auth-header";

export const TeamListModal = ({ show, handleClose, eventId }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [referee, setReferee] = useState(false);
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
    setLoading(false);
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

  const fetchReferee = () => {
    axios
      .get(`${backendUrl()}/event/checkReferee?eventId=${eventId}`, {
        headers: authHeader(),
      })
      .then((res) => {
        setReferee(res.data);
      });
  };

  useEffect(() => {
    if (show) {
      fetchReferee();
      fetchTeams();
    }
  }, [show]);

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
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Lista zapisanych</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <Spinner animation="border" variant="secondary" size="lg" />
        )}
        {!loading && teams.length === 0 && (
          <h1 className="text-center">Brak zgłoszeń</h1>
        )}
        {!loading && teams?.length > 0 && (
          <ResultTable
            columns={columns}
            data={teams}
            pageCount={3}
            isLoading={false}
            isFooter={false}
            isHeader={true}
            hiddenColumns={
              referee ? [""] : ["entryFee", "confirmEntryFee", "delete"]
            }
          />
        )}
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
      </Modal.Body>
      <Modal.Footer className={"justify-content-center"}>
        <Button className={"mx-3"} variant="secondary" onClick={handleClose}>
          Anuluj
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
