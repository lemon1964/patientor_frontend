import { ExpandedEntry, DiagnosisTypes } from "../types";
import { Box, Typography, Icon } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MedicalBagIcon from "@mui/icons-material/MedicalServices";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DefaultBagIcon from "@mui/icons-material/Work";
import { assertNever } from "../utils";

const HEALTH_COLORS = ["green", "blue", "yellow", "red"];

const EntryDetails = ({ entry, diagnoses }: { entry: ExpandedEntry; diagnoses: DiagnosisTypes[] }) => {
  const getHealthColor = (rating: number) => HEALTH_COLORS[rating] || "gray";

  const renderDiagnosisBlock = (codes: string[]) => {
    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="subtitle1">Diagnosis</Typography>
        {codes.map(code => {
          const diagnosis = diagnoses.find(diag => diag.code === code);
          if (!diagnosis) return null;
          return (
            <Typography key={diagnosis.code} variant="body2">
              <strong>{diagnosis.code}</strong> | {diagnosis.name}
              {diagnosis.latin && <br />}
              {diagnosis.latin && <em>({diagnosis.latin})</em>}
            </Typography>
          );
        })}
      </Box>
    );
  };

  switch (entry.type) {
    case "HealthCheck":
      return (
        <Box>
          <Typography variant="h6">
            {entry.date} <MedicalBagIcon sx={{ color: "black" }} />
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            {entry.description}
          </Typography>
          {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && renderDiagnosisBlock(entry.diagnosisCodes)}
          <Icon>
            <FavoriteIcon style={{ color: getHealthColor(entry.healthCheckRating) }} />
          </Icon>
          <Typography variant="body2">Diagnose by: {entry.specialist}</Typography>
        </Box>
      );
    case "OccupationalHealthcare":
      return (
        <Box>
          <Typography variant="h6">
            {entry.date}
            <DefaultBagIcon sx={{ color: "black" }} />
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {entry.employerName}
            </Typography>
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            {entry.description}
          </Typography>
          {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && renderDiagnosisBlock(entry.diagnosisCodes)}
          {entry.sickLeave && (
            <Typography variant="body2">
              Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
            </Typography>
          )}
          <Typography variant="body2">Diagnose by: {entry.specialist}</Typography>
        </Box>
      );
    case "Hospital":
      return (
        <Box>
          <Typography variant="h6">
            {entry.date} <LocalHospitalIcon sx={{ color: "black" }} />
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            {entry.description}
          </Typography>
          {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && renderDiagnosisBlock(entry.diagnosisCodes)}
          <Typography variant="body2" sx={{ mb: 2 }}>
            Discharge: {entry.discharge.date} {entry.discharge.criteria}
          </Typography>
          <Typography variant="body2">Diagnose by: {entry.specialist}</Typography>
        </Box>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
