/* eslint-disable react/display-name */
import React, { useMemo, useEffect, useState } from "react";
import ResultTable from "../common/table/ResultTable";
import { TeamDiv } from "../common/Div";
import Badge from "react-bootstrap/Button";
import axios from "axios";
import { backendUrl } from "../utils/fetchUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import authHeader from "../../service/auth-header";

const PenaltyTable = (props) => {
  const [penalties, setPenalties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPenalties = () => {
    axios
      .get(`${backendUrl()}/penalty/getPenalties?eventId=${props.eventId}`)
      .then((res) => {
        setPenalties(res.data);
        setIsLoading(false);
      });
  };

  const removePenalty = (penaltyId) => {
    axios
      .post(`${backendUrl()}/penalty/removePenalty?penaltyId=${penaltyId}`, {
        headers: authHeader(),
      })
      .then((res) => {
        setIsLoading(true);
        props.onRemove();
        fetchPenalties();
      });
  };

  useEffect(() => {
    fetchPenalties();
  }, []);

  const columns = useMemo(
    () => [
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
          />
        ),
      },
      {
        width: "60%",
        id: "penalty",
        Header: "Czas - Powód - OS/PS",
        disableFilters: true,
        disableSortBy: true,
        Cell: (cellInfo) => (
          <table className="font14">
            {cellInfo.row.original.penalties.map((penalty) => (
              <>
                <tr>
                  <td className="text-left fw-bolder">
                    {penalty.penaltySec + " s"}
                  </td>
                  <td className="text-left px-3 width-300">
                    {penalty.description}
                  </td>
                  <td className="text-left px-3">{penalty.name}</td>
                  <td>
                    {props.referee ? (
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        onClick={() => removePenalty(penalty.penaltyId)}
                        title={"Usuń kare"}
                      />
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
              </>
            ))}
          </table>
        ),
      },
    ],
    []
  );

  return (
    <>
      <ResultTable
        columns={columns}
        data={penalties}
        pageCount={3}
        isLoading={isLoading}
        isFooter={false}
        isHeader={true}
        cursor={"pointer"}
      />
    </>
  );
};

export default PenaltyTable;
