import React, { useState } from "react";
import "./App.css";
import DriverListPage from "./components/page/DriverListPage";
import AddScorePage from "./components/page/AddScorePage";
import StageScorePage from "./components/page/StageScorePage";

function Temp() {
  const [addedNewScore, setAddedNewScore] = useState();

  return (
    <div className="App">
      <header className="App-header">RACE SCORE</header>

      <DriverListPage />
      <AddScorePage setAddedNewScore={setAddedNewScore} />
      <StageScorePage addedNewScore={addedNewScore} />
    </div>
  );
}

export default Temp;
