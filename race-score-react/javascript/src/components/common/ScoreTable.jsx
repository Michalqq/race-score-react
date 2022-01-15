/* eslint-disable react/display-name */
import React, { useMemo } from "react";
import ResultTable from "../common/table/ResultTable";

const ScoreTable = (props) => {
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
        accessor: (cellInfo) => cellInfo.teamId,
        disableFilters: true,
      },
      {
        width: "14%",
        id: "team",
        Header: "Załoga",
        accessor: (cellInfo) => cellInfo.driver,
        disableFilters: true,
      },
      {
        width: "12%",
        id: "car",
        Header: "Samochód",
        accessor: (cellInfo) => cellInfo.car,
        disableFilters: true,
      },
      {
        width: "12%",
        id: "score",
        Header: "Czas",
        accessor: (cellInfo) => cellInfo.score,
        disableFilters: true,
      },
      {
        width: "12%",
        id: "timeTo",
        Header: "Do poprzedzającego",
        accessor: (cellInfo) => cellInfo.timeTo,
        disableFilters: true,
      },
      {
        width: "12%",
        id: "timeToFirst",
        Header: "Do najszybszego",
        accessor: (cellInfo) => cellInfo.timeToFirst,
        disableFilters: true,
      },
    ],
    []
  );

  return (
    <>
      <ResultTable
        columns={columns}
        data={props.data}
        pageCount={3}
        isLoading={false}
        isFooter={false}
        isHeader={true}
        cursor={"pointer"}
      />
    </>
  );
};

export default ScoreTable;
