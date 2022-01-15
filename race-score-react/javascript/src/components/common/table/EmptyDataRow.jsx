import React from "react";
const EmptyDataRow = ({ headerGroups }) => {
  return (
    <tbody>
      <tr
        style={{
          textDecoration: "none",
          display: "table-row",
        }}
        className="font14 l-table-row u-border u-link"
      >
        {headerGroups[0].headers.map((column) => (
          <th
            key={"emptyRowCell" + column.id}
            {...column.getHeaderProps()}
            className="l-col u-padding-m u-padding-s u-padding-top-m u-border"
            style={{
              width: column.width,
            }}
          >
            {headerGroups[0].headers[0].id === column.id
              ? "Brak danych"
              : "___"}
          </th>
        ))}
      </tr>
    </tbody>
  );
};
export default EmptyDataRow;
