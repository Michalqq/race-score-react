export const TeamDiv = ({ line1, line2, line3 }) => {
  return (
    <div className="float-left">
      <h6 className="text-left font14 fw-bolder text-primary m-0">{line1}</h6>
      <p className="text-left font12 fw-lighter m-0 p-0">{line2}</p>
      <p className="text-left font12 fw-bolder m-0 p-0">{line3}</p>
    </div>
  );
};
export const CarDiv = ({ line1, line2 }) => {
  return (
    <div className="">
      <h6 className="font14  m-0">{line1}</h6>
      <p className="font13 m-0 p-0">{line2}</p>
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
