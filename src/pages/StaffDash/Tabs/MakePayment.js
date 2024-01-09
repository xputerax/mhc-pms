import React, { Fragment, useState } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { useSearchParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import API from "../../../api";
import Dashboard from "../../../components/Dashboards/Dashboard";
import DashBar from "../../../components/DashBar/DashBar";
import DuePaymentCard from "../../../components/Cards/DuePaymentCard";
import { message } from "antd";
import { Breadcrumbs, Link } from "@mui/material";

export const StaffPaymentContext = React.createContext();

const cardTitles = ["Card Payment", "UPI Payment", "Cash Payment"];

function MakePaymentStaff() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [dues, setDues] = useState([]);
  const [searched, setSearched] = useState(false);
  const [email, setEmail] = useState("");

  const [searchParams] = useSearchParams();
  const patientEmail = searchParams ? searchParams.get("patientEmail") : null;
  const doctorEmail = searchParams ? searchParams.get("doctorEmail") : null;
  const appointmentDate = searchParams
    ? searchParams.get("appointmentDate")
    : null;

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  async function fetchUnpaid() {
    setOpenBackdrop(true);
    if (!validateEmail(email)) {
      setOpenBackdrop(false);
      message.error("Enter a valid Email.");
      return;
    }
    try {
      const ptemail = email;
      const res = await API.duePayment();
      if (res.data.error) {
        setOpenBackdrop(false);
        message.error(res.data.errorMsg);
      } else {
        setOpenBackdrop(false);
        const unpaids = res.data.filter((unp) => unp.patientEmail === ptemail);
        setDues(unpaids);
        setSearched(true);
      }
    } catch (error) {
      setOpenBackdrop(false);
      message.error(error.response.data.errorMsg);
      console.log(error);
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  if (patientEmail && doctorEmail && appointmentDate) {
    return (
      <Fragment>
        <StaffPaymentContext.Provider
          value={{ patientEmail, doctorEmail, appointmentDate }}
        >
          <Dashboard cards={cardTitles} lgspace={4} from="staff" />
        </StaffPaymentContext.Provider>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Fragment>
    );
  } else {
    if (searched) {
      if (dues.length > 0) {
        return (
          <Fragment>
            <DashBar />
            <Container className="dash-container" maxWidth="lg">
              <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/dashboard/staff">
                  Dashboard
                </Link>
                <Typography color="text.primary">Make Payment</Typography>
              </Breadcrumbs>
              <Grid container spacing={3}>
                {dues.map((due, index) => {
                  return (
                    <Grid key={index} item xs={12}>
                      <DuePaymentCard
                        key={index}
                        patientEmail={due.patientEmail}
                        doctorEmail={due.doctorEmail}
                        appointmentDate={due.appointmentDate}
                        doc={due.doctor}
                        date={due.date}
                        caller="staff"
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
            <Container className="dash-container" maxWidth="lg">
              <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/dashboard/staff">
                  Dashboard
                </Link>
                <Typography color="text.primary">Make Payment</Typography>
              </Breadcrumbs>

              <Container sx={{ textAlign: "center" }}>
                <Typography
                  sx={{ marginTop: "30vh" }}
                  variant="h5"
                  gutterBottom
                  component="div"
                >
                  **This patient don't have any outstanding payment.**
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
    } else {
      return (
        <Fragment>
          <DashBar />
          <Container className="dash-container" maxWidth="lg">
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="/dashboard/staff">
                Dashboard
              </Link>
              <Typography color="text.primary">Make Payment</Typography>
            </Breadcrumbs>
            <Container sx={{ textAlign: "center" }}>
              <Stack
                spacing={0}
                direction="row"
                sx={{ marginTop: "30vh" }}
                justifyContent="center"
              >
                <TextField
                  id="outlined-basic"
                  label="Patient's Email Id"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  variant="outlined"
                  autoComplete="off"
                  sx={{ width: "90%" }}
                />
                <Button onClick={fetchUnpaid} variant="outlined">
                  Search
                </Button>
              </Stack>
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
}

export default MakePaymentStaff;
