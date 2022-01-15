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

const HomePage = (props) => {
  const [futureEvents, setFutureEvents] = useState([]);
  const [archiveEvents, setArchiveEvents] = useState([]);
  const [createEvent, setCreateEvent] = useState(false);
  const [eventToTeamList, setEventToTeamList] = useState();

  const navigate = useNavigate();

  const fetchTeams = () => {
    axios.get(`${backendUrl()}/event/getAll`).then((res) => {
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
    });
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <>
      <Card className="my-2">
        <h3>Najbliższe wydarzenia</h3>
      </Card>
      <div className="row">
        {futureEvents.map((x) => (
          <EventCard
            event={x}
            onJoin={() =>
              navigate("joinToEvent", { state: { eventId: x.eventId } })
            }
            onScore={() => navigate("event", { state: { eventId: x.eventId } })}
            onTeamList={() => setEventToTeamList(x.eventId)}
          />
        ))}
        <Card className="my-2">
          <h3>Archiwalne wydarzenia</h3>
        </Card>

        {archiveEvents.map((x) => (
          <EventCard
            event={x}
            onJoin={() =>
              navigate("joinToEvent", { state: { eventId: x.eventId } })
            }
            onScore={() => navigate("event", { state: { eventId: x.eventId } })}
            onTeamList={() => setEventToTeamList(x.eventId)}
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
        show={createEvent}
        handleClose={() => setCreateEvent(false)}
      />
      <TeamListModal
        show={eventToTeamList !== undefined}
        handleClose={() => setEventToTeamList()}
        eventId={eventToTeamList}
      />
    </>
  );
};

export default HomePage;
