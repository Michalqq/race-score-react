import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import moment from "moment";

export const EventCard = ({ event, onJoin, onTeamList, onScore }) => {
  return (
    <div className="col-lg-6 pb-3 u-box-shadow">
      <Card className="">
        <Card.Header className="bg-secondary text-white text-start fw-bold">
          {event?.name}
        </Card.Header>
        <Card.Body>
          <div className="position-absolute end-0 mx-3 text-end badge bg-primary text-wrap fst-italic">
            {moment(event?.date).format("dddd, DD MMM YYYY, HH:mm")}
          </div>
          <div class="container d-flex">
            <div class="col-2 px-0">
              <img
                src="/akbpLogo.png"
                className="img-fluid rounded float-left"
                alt="..."
              />
            </div>
            <div class="col-10 mt-3">
              <p className="m-4">Organizator: Automobilklub BialskoPodlaski</p>
              <p className=" fw-bold fst-italic m-4">
                {`Koniec zapisów:  ${moment(event?.date).format(
                  "dddd, DD MMM YYYY, HH:mm"
                )}`}
              </p>
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="text-center">
          <div className="row ">
            <div className="col-lg-3 my-1">
              {new Date().getTime() <=
                new Date(event.signDeadline).getTime() && (
                <Button
                  className={"mx-2 start-0 px-2"}
                  variant="success"
                  onClick={onJoin}
                >
                  Zapisz się
                </Button>
              )}
            </div>

            <div className="col-lg-4 my-1"></div>
            <div className="col-lg-5 my-1">
              <Button className={"px-2"} variant="dark" onClick={onTeamList}>
                Lista zapisanych
              </Button>
              <Button
                className={"px-2 mx-3"}
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
