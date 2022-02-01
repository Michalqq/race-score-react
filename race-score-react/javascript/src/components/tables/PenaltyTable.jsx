/* eslint-disable react/display-name */
import React, { useMemo, useEffect, useState } from "react";
import ResultTable from "../common/table/ResultTable";
import { TeamDiv } from "../common/Div";
import { NrBadge } from "../common/NrBadge";
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
        width: "20%",
        id: "team",
        Header: "Załoga",
        disableFilters: true,
        disableSortBy: true,
        Cell: (cellInfo) => (
          <>
            <div className="py-1 px-2 mx-1 d-grid">
              <NrBadge value={"#" + cellInfo.row.original.number}></NrBadge>
            </div>
            <div className="px-1 mx-1 d-grid">
              <TeamDiv team={cellInfo.row.original} />
            </div>
          </>
        ),
      },
      {
        width: "70%",
        id: "penalty",
        Header: "Czas - Powód - OS/PS",
        disableFilters: true,
        disableSortBy: true,
        Cell: (cellInfo) => (
          <table className="font14">
            {cellInfo.row.original.penalties.map((penalty) => (
              <>
                <tr>
                  <td className="text-left fw-bolder" style={{ width: "20%" }}>
                    {penalty.penaltySec + " s"}
                  </td>
                  <td className="text-left px-3" style={{ width: "45%" }}>
                    {penalty.description}
                  </td>
                  <td className="text-left px-3" style={{ width: "50%" }}>
                    {penalty.name}
                  </td>
                  <td style={{ width: "15%" }}>
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
    <ResultTable
      columns={columns}
      data={penalties}
      pageCount={3}
      isLoading={isLoading}
      isFooter={false}
      isHeader={true}
      cursor={"pointer"}
      manualPagination={true}
    />
  );
};

export default PenaltyTable;
