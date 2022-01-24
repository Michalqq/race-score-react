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
  faDownload,
  faExclamation,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { OkCancelModal } from "../common/Modal";
import authHeader from "../../service/auth-header";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Card from "react-bootstrap/Card";

export const TeamListModal = ({ show, handleClose, eventId, started }) => {
  const [teams, setTeams] = useState([]);
  const [startEvent, setStartEvent] = useState(false);
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
    if (eventId === undefined) return;
    axios
      .get(`${backendUrl()}/event/getTeams?eventId=${eventId}`)
      .then((res) => {
        setTeams(res.data);
        setLoading(false);
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

  const fetchEntryFeeFile = (teamId, teamName) => {
    download(
      `${backendUrl()}/event/getEntryFeeFile?eventId=${eventId}&teamId=${teamId}`,
      "potwierdzenie_wplaty_" + teamName + ".pdf"
    );
  };

  function download(url, filename) {
    fetch(url).then(function (t) {
      return t.blob().then((b) => {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.setAttribute("download", filename);
        a.click();
      });
    });
  }

  const fetchReferee = () => {
    axios
      .get(`${backendUrl()}/event/checkReferee?eventId=${eventId}`, {
        headers: authHeader(),
      })
      .then((res) => {
        setReferee(res.data);
      });
  };

  const fetchStartEvent = () => {
    axios
      .post(`${backendUrl()}/event/startEvent?eventId=${eventId}`, {
        headers: authHeader(),
      })
      .then(() => {});
  };

  useEffect(() => {
    if (show) {
      fetchReferee();
      setLoading(true);
      setTeams([]);
    }
    fetchTeams();
  }, [show]);

  useEffect(() => {
    setTeams([]);
    fetchTeams();
  }, [referee]);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(teams);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    let index = 0;
    items.map((x) => (x.number = index++));

    setTeams(items);
  };

  const columns = useMemo(
    () => [
      {
        width: "5%",
        id: "index",
        Header: "L.p.",
        accessor: (row) => row.id - 1,
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
          cellInfo.team.driver +
          " " +
          (cellInfo.team.coDriver ? cellInfo.team.coDriver : ""),
        disableFilters: true,
      },
      {
        width: "12%",
        id: "car",
        Header: "Samochód",
        accessor: (cellInfo) =>
          (cellInfo.team.currentCar?.brand || "") +
          " " +
          (cellInfo.team.currentCar?.model || ""),
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
        id: "entryFeeFile",
        Header: "Wpisowe plik",
        disableFilters: true,
        Cell: (cellInfo) =>
          cellInfo.row.original.entryFeeFile !== null ? (
            <FontAwesomeIcon
              className={"m-2 fa-lg"}
              icon={faDownload}
              onClick={() =>
                fetchEntryFeeFile(
                  cellInfo.row.original.teamId,
                  cellInfo.row.original.team.driver
                )
              }
              title={"Pobierz plik"}
              cursor={"pointer"}
            />
          ) : (
            <></>
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
      <Modal.Header className="bg-dark text-white" closeButton>
        <Modal.Title>Lista zapisanych</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center">
            <Spinner animation="border" variant="secondary" size="lg" />
          </div>
        )}
        {!loading && teams.length === 0 && (
          <h1 className="text-center">Brak zgłoszeń</h1>
        )}
        {!loading && teams?.length > 0 && (
          <ResultTable
            columns={columns}
            data={teams}
            isLoading={false}
            isFooter={false}
            isHeader={true}
            hiddenColumns={
              referee
                ? [""]
                : ["entryFee", "confirmEntryFee", "entryFeeFile", "delete"]
            }
            manualPagination={true}
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
        {startEvent && (
          <OkCancelModal
            show={true}
            title={"Zamykanie listy / Rozpoczynanie wydarzenia"}
            text={`Czy napewno chcesz zamknąć listę i rozpocząć wydarzenie? Operacja nieodwracalna`}
            handleAccept={() => {
              fetchStartEvent();
              setStartEvent(false);
            }}
            handleClose={() => setStartEvent(false)}
          />
        )}
        {teams && (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="selectedCases">
              {(provided) => (
                <ol
                  className="selectedCases"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {teams?.map((item, index) => {
                    console.log(item);
                    return (
                      <Draggable
                        key={item.number}
                        draggableId={item.number.toString()}
                        index={index}
                        draggable={false}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card className="my-2">
                              <Card.Body className="p-1">
                                <table>
                                  <tr className="d-table-row">
                                    <th style={{ width: "250px" }}>
                                      &#9776; {item.team.driver}
                                    </th>
                                    <th style={{ width: "250px" }}>
                                      {item.team.currentCar?.brand +
                                        " " +
                                        item.team.currentCar?.model}
                                    </th>
                                    <th style={{ width: "250px" }}>Country</th>
                                  </tr>
                                </table>
                              </Card.Body>
                            </Card>
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Modal.Body>
      <Modal.Footer className={"justify-content-center"}>
        <div className="d-grid">
          {referee && (
            <Button
              className={"m-2"}
              variant="success"
              onClick={() => setStartEvent(true)}
              disabled={started}
            >
              Zamknij liste / Rozpocznij wydarzenie
            </Button>
          )}
          <Button className={"m-1"} variant="secondary" onClick={handleClose}>
            Anuluj
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
