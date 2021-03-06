import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faEdit } from "@fortawesome/free-solid-svg-icons";

export const EventCard = ({
  event,
  onJoin,
  onTeamList,
  onScore,
  onEdit,
  mainAdmin,
}) => {
  return (
    <div className="col-lg-6 pb-3 u-box-shadow">
      <Card className="">
        <Card.Header className="bg-secondary text-white text-start fw-bold py-1">
          <div class="row px-1">
            <div class="col-11 px-0">{event?.name}</div>
            <div class="col-1 px-0 text-end">
              {onEdit !== undefined && mainAdmin && (
                <FontAwesomeIcon
                  className={"text-white fa-lg"}
                  icon={faEdit}
                  onClick={onEdit}
                  cursor={"pointer"}
                />
              )}
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-1">
          <div className="position-absolute end-0 mx-3 text-end badge bg-primary text-wrap fst-italic">
            {moment(event?.date).format("dddd, DD MMM YYYY, HH:mm")}
          </div>
          <div class="container d-flex">
            <div class="col-2 px-0 align-self-center" style={{ width: "90px" }}>
              {event.logoPath !== undefined && event.logoPath !== null ? (
                <img
                  className="img-fluid rounded float-left"
                  src="http://www.automobilklub.chelm.pl/img_news/30wospb.jpg"
                  alt="Logo"
                ></img>
              ) : (
                <img
                  src="/akbpLogo.png"
                  className="img-fluid rounded float-left"
                  alt="..."
                />
              )}
            </div>
            <div class="col-10 mt-3">
              {event.organizer !== undefined && event.organizer !== null && (
                <p className="m-4">{`Organizator: ${event.organizer}`}</p>
              )}
              <p className=" fw-bold fst-italic m-4">
                {`Koniec zapis??w:  ${moment(event?.signDeadline).format(
                  "dddd, DD MMM YYYY, HH:mm"
                )}`}
              </p>
              {event.joined && (
                <div className="d-inline-flex">
                  <FontAwesomeIcon
                    className={"text-success fa-lg"}
                    icon={faStar}
                  />
                  <h6>Jeste?? zapisany</h6>
                </div>
              )}
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="text-start py-0">
          <div className="row my-2">
            <div className="col-6 px-0">
              {new Date().getTime() <=
                new Date(event.signDeadline).getTime() && (
                <Button
                  className={"start-0 py-1 px-1"}
                  variant="success"
                  onClick={onJoin}
                >
                  {event.joined ? "Moje zg??oszenie" : "Info / Zg??oszenia"}
                </Button>
              )}
            </div>
            <div className="col-6 px-0 d-flex justify-content-end">
              <Button
                className={"py-1 px-1"}
                variant="dark"
                onClick={onTeamList}
              >
                Lista
              </Button>
              <Button
                className={"py-1 px-1 mx-1"}
                variant="warning"
                onClick={onScore}
              >
                Wyniki
              </Button>
            </div>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};
