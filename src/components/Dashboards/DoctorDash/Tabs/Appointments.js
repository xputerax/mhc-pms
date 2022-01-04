import { Fragment, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import DashBar from "../../../DashBar/DashBar";
import DocAppointmentCard from "../../../Cards/DocAppointmentCard";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import jwt from "jsonwebtoken";
import api from "../../../../api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const token = localStorage.getItem("accessToken");
        const payload = token && jwt.decode(token);
        const demail = payload.userType === "doctor" && payload.email;
        const res = await api.myAppointments();
        if (res.data.error) {
          alert(res.data.errorMsg);
        } else {
          const appoints = res.data.filter(
            (appoint) => appoint.demail === demail
          );
          setAppointments(appoints);
        }
      } catch (error) {
        alert(error.response.data.errorMsg);
        console.log(error);
      }
    }
    fetchAppointments();
  }, []);

  if (appointments.length > 0) {
    return (
      <Fragment>
        <DashBar />
        <Container className="dash-container" maxWidth="md">
          <Grid container spacing={3}>
            {appointments.map((appointment, index) => {
              return (
                <Grid key={index} item xs={12}>
                  <DocAppointmentCard
                    patient={appointment.patient}
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
        <DashBar />
        <Container sx={{ textAlign: "center" }}>
          <Typography
            sx={{ marginTop: "30vh" }}
            variant="h5"
            gutterBottom
            component="div"
          >
            **No upcoming appointments.**
          </Typography>
        </Container>
      </Fragment>
    );
  }
}

export default Appointments;
