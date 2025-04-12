import { Alert } from "@mui/material";
import { ErrorMessage } from "../types";

interface Props {
  errorMessage: ErrorMessage;
}

const Notify = ({ errorMessage }: Props) => {
  if (!errorMessage) {
    return null;
  }
  return (
    <Alert severity="error" style={{ margin: "10px 0" }}>
      {errorMessage}
    </Alert>
  );
};

export default Notify;
