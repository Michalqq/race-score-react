import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../components/utils/fetchUtils";
import authHeader from "./auth-header";

export const RefereeChecker = (eventId) => {
  const [referee, setReferee] = useState(false);

  useEffect(() => {
    axios
      .get(`${backendUrl()}/event/checkReferee?eventId=${eventId}`, {
        headers: authHeader(),
      })
      .then((res) => {
        setReferee(res.data);
      });
  }, []);

  return referee;
};
