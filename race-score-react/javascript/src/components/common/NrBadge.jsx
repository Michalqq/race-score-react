import React from "react";

import Badge from "react-bootstrap/Badge";
import "bootstrap/dist/css/bootstrap.min.css";

export const NrBadge = ({ value }) => {
  return (
    <Badge
      bg="success"
      style={{
        paddingTop: "6px",
        justifyContent: "center",
        display: "grid",
        width: "22px",
        height: "22px",
        borderRadius: "20px",
        fontSize: "10px",
      }}
    >
      {value}
    </Badge>
  );
};
