import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import api from "../../api";

export default function AppointmentCard(props) {
  async function handleCancel() {
    try {
      const res = await api.cancelAppointment({
        data: { pemail: props.pemail, demail: props.demail, doa: props.doa },
      });
      if (res.data.error) {
        alert(res.data.erroMsg);
      } else {
        alert(res.data.msg);
        window.location.reload();
      }
    } catch (error) {
      alert(error.response.data.errorMsg);
      console.log(error);
    }
  }

  return (
    <Card sx={{ maxWidth: "100%", textAlign: "center" }} variant="outlined">
      <CardContent>
        <br />
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Appointment with
        </Typography>
        <Typography variant="h5" component="div">
          {props.doc}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {`on ${props.date}`}
        </Typography>
        <br />
        <CardActions disableSpacing>
          <Button
            variant="contained"
            color="error"
            endIcon={<CancelIcon />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}
