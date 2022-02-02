import React from "react";

import Badge from "react-bootstrap/Badge";
import "bootstrap/dist/css/bootstrap.min.css";

export const NrBadge = ({ value }) => {
  return (
    <Badge
      className="number-badge"
      bg=""
      style={{
        paddingTop: "5px",
        justifyContent: "center",
        display: "grid",
        width: "22px",
        height: "22px",
        borderRadius: "20px",
        fontSize: "11px",
      }}
    >
      {value}
    </Badge>
  );
};
