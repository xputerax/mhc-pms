import { Fragment } from "react";
import Container from "@mui/material/Container";
import DashBar from "../../../DashBar/DashBar";
import AppointmentCard from "../../../Cards/AppointmentCard";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

//search appointment using unique id and store in below array
const appointments = [
  { doc: "Dr. S. Bakshi", date: "12/08/2021" },
  { doc: "Dr. S. Dey", date: "12/10/2021" },
  { doc: "Dr. S. Santra", date: "12/20/2021" },
];

function CancelAppointment() {
  if (appointments.length > 0) {
    return (
      <Fragment>
        <DashBar user={"PatientXyZ"} />
        <Container className="dash-container" maxWidth="md">
          <Grid container spacing={3}>
            {appointments.map((appointment, index) => {
              return (
                <Grid key={index} item xs={12}>
                  <AppointmentCard
                    doc={appointment.doc}
                    date={appointment.date}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <DashBar user={"UserXyZ"} />
        <Container sx={{ textAlign: "center" }}>
          <Typography
            sx={{ marginTop: "30vh" }}
            variant="h5"
            gutterBottom
            component="div"
          >
            **Patient does NOT seem to have any appointment.**
          </Typography>
        </Container>
      </Fragment>
    );
  }
}

export default CancelAppointment;
