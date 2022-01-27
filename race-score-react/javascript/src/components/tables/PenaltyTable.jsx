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
        width: "20%",
        id: "team",
        Header: "Załoga",
        disableFilters: true,
        disableSortBy: true,
        Cell: (cellInfo) => (
          <>
            <div className="py-1 px-2 mx-1 d-grid">
              <Badge
                style={{
                  paddingTop: "3px",
                  paddingLeft: "1px",
                  width: "25px",
                  height: "25px",
                  borderRadius: "20px",
                  backgroundColor: "#270ca4 !important",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {"#" + cellInfo.row.original.number}
              </Badge>
            </div>
            <div className="px-1 mx-1 d-grid">
              <TeamDiv
                line1={cellInfo.row.original.driver}
                line2={cellInfo.row.original.coDriver}
              />
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
    />
  );
};

export default PenaltyTable;
