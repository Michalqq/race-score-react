import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TableHeader = ({ isHeader, headerGroups }) => {
  const getSortIcon = (column) => {
    if (column.isSorted) {
      return column.isSortedDesc ? " ▼" : " ▲";
    } else {
      return "";
    }
  };
  if (isHeader) {
    return (
      <thead className="thead-dark">
        {headerGroups.map((headerGroup, index) => (
          <tr
            key={"tableHeader" + index}
            style={{ display: "table-row" }}
            {...headerGroup.getHeaderGroupProps()}
            className="l-table-row text-white bg-dark"
          >
            {headerGroup.headers.map((column) => (
              <th
                key={"tableHeaderCell" + column.id}
                {...column.getHeaderProps()}
                className="p-1"
                style={{
                  width: column.width,
                }}
              >
                <div className="flex flex-column">
                  <div
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="flex align-items-end justify-content-center h6 l-row g-brand2-c table-column-header"
                  >
                    <span className="flex">
                      {column.Header != null && column.render("Header")}
                    </span>
                    <span className="g-gray4-c">{getSortIcon(column)}</span>
                  </div>
                  <div className="flex align-items-end">
                    {column.canFilter ? column.render("Filter") : null}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
    );
  } else {
    return <></>;
  }
};
export default TableHeader;
