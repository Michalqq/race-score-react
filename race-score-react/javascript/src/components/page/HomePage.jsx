/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { backendUrl } from "../utils/fetchUtils";
import Button from "react-bootstrap/Button";
import { NewEventForm } from "../event/NewEventForm";
import { EventCard } from "../common/EventCard";
import Card from "react-bootstrap/Card";
import { TeamListModal } from "../team/TeamListModal";
import { EventModal } from "../event/EventModal";
import authHeader from "../../service/auth-header";
import { AdminTeamList } from "../team/AdminTeamList";
import Spinner from "react-bootstrap/Spinner";

const HomePage = (props) => {
  const [futureEvents, setFutureEvents] = useState([]);
  const [archiveEvents, setArchiveEvents] = useState([]);
  const [createEvent, setCreateEvent] = useState();
  const [eventToTeamList, setEventToTeamList] = useState();
  const [eventToTeamPanel, setEventToTeamPanel] = useState();
  const [loading, setLoading] = useState(true);
  const [mainAdmin, setMainAdmin] = useState(false);

  let eventRedirect = useLocation().search;

  const navigate = useNavigate();

  const fetchEvents = () => {
    setLoading(true);

    let endDay = new Date();
    endDay.setHours(23, 59, 59, 999);
    endDay.setDate(new Date().getDate() - 1);

    axios
      .get(`${backendUrl()}/event/getAll`, {
        headers: authHeader(),
      })
      .then((res) => {
        setFutureEvents(
          res.data
            .filter((x) => endDay.getTime() <= new Date(x.date).getTime())
            .sort((x, y) => (x.date < y.date ? -1 : 1))
        );
        setArchiveEvents(
          res.data
            .filter((x) => endDay.getTime() > new Date(x.date).getTime())
            .sort((x, y) => (x.date > y.date ? -1 : 1))
        );
        if (eventRedirect !== undefined) {
          const event = res.data.find(
            (x) => x.eventId === Number(eventRedirect.replace("?", ""))
          );
          setEventToTeamPanel(event);
          eventRedirect = null;
        }
        setLoading(false);
      });
  };

  const fetchMainAdmin = () => {
    if (sessionStorage.getItem("username") !== null)
      axios
        .get(
          `${backendUrl()}/auth/isMainAdmin?login=${sessionStorage.getItem(
            "username"
          )}`,
          {
            headers: authHeader(),
          }
        )
        .then((res) => {
          setMainAdmin(res.data);
        });
  };

  useEffect(() => {
    fetchEvents();
    fetchMainAdmin();
  }, []);

  return (
    <>
      <p style={{ fontSize: "11px" }} className="my-0 py-0">
        Aplikacja w fazie testów
      </p>
      <Card className=" my-1 bg-dark text-white">
        <h3>Najbliższe wydarzenia</h3>
      </Card>
      <div className="row justify-content-center">
        {loading && (
          <div className="text-center">
            <Spinner animation="border" variant="secondary" size="lg" />
          </div>
        )}
        {futureEvents.map((x) => (
          <EventCard
            key={x.eventId}
            event={x}
            onJoin={() => setEventToTeamPanel(x)}
            onScore={() => {
              localStorage.setItem("eventId", x.eventId);
              navigate("event", { state: { eventId: x.eventId } });
            }}
            onTeamList={() => setEventToTeamList(x)}
            onEdit={() => setCreateEvent(x)}
            mainAdmin={mainAdmin}
          />
        ))}
      </div>
      <Card className="my-1 bg-dark text-white">
        <h3>Archiwalne wydarzenia</h3>
      </Card>

      <div className="row justify-content-center">
        {loading && (
          <div className="text-center">
            <Spinner animation="border" variant="secondary" size="lg" />
          </div>
        )}
        {archiveEvents.map((x) => (
          <EventCard
            key={x.eventId}
            event={x}
            onJoin={() => setEventToTeamPanel(x)}
            onScore={() => {
              localStorage.setItem("eventId", x.eventId);
              navigate("event", { state: { eventId: x.eventId } });
            }}
            onTeamList={() => setEventToTeamList(x)}
            onEdit={() => setCreateEvent(x)}
            mainAdmin={mainAdmin}
          />
        ))}
      </div>
      <div className="p-3 border-top">
        {mainAdmin && (
          <Button
            className={"border-top mx-3"}
            variant="primary"
            onClick={() => setCreateEvent(true)}
          >
            Dodaj wydarzenie
          </Button>
        )}
      </div>
      <NewEventForm
        show={createEvent !== undefined}
        handleClose={() => {
          setCreateEvent();
          fetchEvents();
        }}
        event={createEvent}
      />
      {mainAdmin && (
        <AdminTeamList
          show={eventToTeamList !== undefined}
          handleClose={() => {
            setEventToTeamList();
            fetchEvents();
          }}
          eventId={eventToTeamList?.eventId}
          started={eventToTeamList?.started}
        />
      )}
      {!mainAdmin && (
        <TeamListModal
          show={eventToTeamList !== undefined}
          handleClose={() => {
            setEventToTeamList();
            fetchEvents();
          }}
          eventId={eventToTeamList?.eventId}
          started={eventToTeamList?.started}
        />
      )}
      <EventModal
        show={eventToTeamPanel !== undefined}
        handleClose={() => {
          setEventToTeamPanel();
          fetchEvents();
        }}
        event={eventToTeamPanel}
      />
    </>
  );
};

export default HomePage;
