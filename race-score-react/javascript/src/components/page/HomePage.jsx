/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../utils/fetchUtils";
import Button from "react-bootstrap/Button";
import { NewEventForm } from "../event/NewEventForm";
import { EventCard } from "../common/EventCard";
import Card from "react-bootstrap/Card";
import { TeamListModal } from "../team/TeamListModal";
import { TeamPanelModal } from "../team/TeamPanelModal";
import authHeader from "../../service/auth-header";
import { useLocation } from "react-router-dom";

const HomePage = (props) => {
  const [futureEvents, setFutureEvents] = useState([]);
  const [archiveEvents, setArchiveEvents] = useState([]);
  const [createEvent, setCreateEvent] = useState();
  const [eventToTeamList, setEventToTeamList] = useState();
  const [eventToTeamPanel, setEventToTeamPanel] = useState();
  let eventRedirect = useLocation().search;

  const navigate = useNavigate();

  const fetchTeams = () => {
    axios
      .get(`${backendUrl()}/event/getAll`, {
        headers: authHeader(),
      })
      .then((res) => {
        setFutureEvents(
          res.data.filter(
            (x) => new Date().getTime() <= new Date(x.date).getTime()
          )
        );
        setArchiveEvents(
          res.data.filter(
            (x) => new Date().getTime() > new Date(x.date).getTime()
          )
        );
        if (eventRedirect !== undefined) {
          const event = res.data.find(
            (x) => x.eventId === Number(eventRedirect.replace("?", ""))
          );
          setEventToTeamPanel(event);
          eventRedirect = null;
        }
      });
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <>
      <Card className=" my-2 pt-1">
        <h3>Najbliższe wydarzenia</h3>
      </Card>
      <div className="row justify-content-center">
        {futureEvents.map((x) => (
          <EventCard
            key={x.eventId}
            event={x}
            onJoin={() => setEventToTeamPanel(x)}
            onScore={() => navigate("event", { state: { eventId: x.eventId } })}
            onTeamList={() => setEventToTeamList(x)}
            onEdit={() => setCreateEvent(x)}
          />
        ))}
      </div>
      <Card className="my-2 pt-1">
        <h3>Archiwalne wydarzenia</h3>
      </Card>

      <div className="row justify-content-center">
        {archiveEvents.map((x) => (
          <EventCard
            key={x.eventId}
            event={x}
            onJoin={() => setEventToTeamPanel(x)}
            onScore={() => navigate("event", { state: { eventId: x.eventId } })}
            onTeamList={() => setEventToTeamList(x)}
          />
        ))}
      </div>
      <div className="p-3 border-top">
        <Button
          className={"border-top mx-3"}
          variant="primary"
          onClick={() => setCreateEvent(true)}
        >
          Dodaj wydarzenie
        </Button>
      </div>
      <NewEventForm
        show={createEvent !== undefined}
        handleClose={() => setCreateEvent()}
        event={createEvent}
      />
      <TeamListModal
        show={eventToTeamList !== undefined}
        handleClose={() => setEventToTeamList()}
        eventId={eventToTeamList?.eventId}
        started={eventToTeamList?.started}
      />
      <TeamPanelModal
        show={eventToTeamPanel !== undefined}
        handleClose={() => setEventToTeamPanel()}
        event={eventToTeamPanel}
      />
    </>
  );
};

export default HomePage;
