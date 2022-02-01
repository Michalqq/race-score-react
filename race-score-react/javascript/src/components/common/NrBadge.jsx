import React from "react";

import Badge from "react-bootstrap/Badge";
import "bootstrap/dist/css/bootstrap.min.css";

export const NrBadge = ({ value }) => {
  return (
    <Badge
      style={{
        paddingTop: "8px",
        paddingLeft: "1px",
        width: "25px",
        height: "25px",
        borderRadius: "20px",
        backgroundColor: "#270ca4 !important",
        fontSize: "10px",
      }}
    >
      {value}
    </Badge>
  );
};
