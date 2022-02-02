export const TeamDiv = ({ team }) => {
  const getWithBracketIfNotEmpty = (value) => {
    if (value !== undefined && value !== null) return " (" + value + ")";

    return "";
  };

  return (
    <div className="float-left">
      <div className="d-flex pt-1" style={{ flexWrap: "wrap" }}>
        <h6 className="text-left font14 fw-bolder fst-italic m-0">
          {team.driver}
        </h6>
        <p className="text-left font12 p-0 div-club">
          {getWithBracketIfNotEmpty(team.club)}
        </p>
      </div>
      <div className="d-flex" style={{ flexWrap: "wrap" }}>
        <p className="text-left font13 fw-bolder m-0 p-0">{team.coDriver}</p>
        <p className="text-left font12 p-0 div-club">
          {getWithBracketIfNotEmpty(team.coClub)}
        </p>
      </div>
      <p className="text-left font13 fw-bolder m-0 p-0">
        {team.teamName || ""}
      </p>
    </div>
  );
};
export const CarDiv = ({ line1, line2, carBrand }) => {
  let brand = carBrand?.toLowerCase().replace(/ /g, "");

  if (brand === "vw") brand = "volkswagen";

  const path = `https://vehapi.com/img/car-logos/${brand}.png`;

  return (
    <div className="col-12 d-flex">
      <div className="col-xl-3 col-4 py-2">
        <img
          className="img-fluid"
          style={{ height: "23px" }}
          src={path}
          alt=""
        ></img>
      </div>
      <div className="col-xl-9 col-7">
        <h6 className="font13  m-0">{line1}</h6>
        <p className="font12 m-0 p-0">{line2}</p>
      </div>
    </div>
  );
};

export const ScoreDiv = ({ line1, line2, line3 }) => {
  return (
    <div className="float-left">
      <h6 className="font13 fw-bolder m-0">{line1}</h6>
      <p className="font12 m-0 p-0">{line2}</p>
      <p className="font12 m-0 p-0">{line3}</p>
    </div>
  );
};

export const ScoreDivPenalty = ({ line1, line2 }) => {
  return (
    <div className="float-left">
      <h6 className="font13 fw-bolder m-0">{line1}</h6>
      {line2 === "0" ? (
        <></>
      ) : (
        <p className="font11 m-0 p-0 fw-bolder text-danger">
          {"+" + line2 + " s"}
        </p>
      )}
    </div>
  );
};
