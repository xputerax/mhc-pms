import { Fragment, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import jwt from "jsonwebtoken";
import API from "../../../api";
import DashBar from "../../../components/DashBar/DashBar";
import DocAppointmentCard from "../../../components/Cards/DocAppointmentCard";
import { message } from "antd";
import { Breadcrumbs, Link } from "@mui/material";

function Appointments() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [defMsg, setDefMsg] = useState("");

  useEffect(() => {
    async function fetchAppointments() {
      setOpenBackdrop(true);
      try {
        const token = localStorage.getItem("accessToken");
        const payload = token && jwt.decode(token);
        const doctorEmail = payload.userType === "doctor" && payload.email;
        const res = await API.myAppointments();
        if (res.data.error) {
          setOpenBackdrop(false);
          message.error(res.data.errorMsg);
        } else {
          setOpenBackdrop(false);
          const appoints = res.data.filter(
            (appoint) => appoint.doctorEmail === doctorEmail
          );
          setAppointments(appoints);
          setDefMsg(appoints.length === 0 && "No upcoming appointments!");
        }
      } catch (error) {
        setOpenBackdrop(false);
        message.error(error.response.data.errorMsg);
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
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              href="/dashboard/doctor"
            >
              Dashboard
            </Link>
            <Typography color="text.primary">Appointments</Typography>
          </Breadcrumbs>

          <Grid container spacing={3}>
            {appointments.map((appointment, index) => {
              return (
                <Grid key={index} item xs={12}>
                  {/* TODO: change to patient name */}
                  <DocAppointmentCard
                    patient={appointment.patientEmail}
                    date={appointment.appointmentDate}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Container>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <DashBar />
        <Container className="dash-container" maxWidth="md">
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              href="/dashboard/doctor"
            >
              Dashboard
            </Link>
            <Typography color="text.primary">Appointments</Typography>
          </Breadcrumbs>
          <Container sx={{ textAlign: "center" }}>
            <Typography
              sx={{ marginTop: "30vh" }}
              variant="h5"
              gutterBottom
              component="div"
            >
              {defMsg}
            </Typography>
          </Container>
        </Container>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Fragment>
    );
  }
}

export default Appointments;
