import { useState } from "react";
import { Patient, DiagnosisTypes, UniversalEntryFormValues } from "../types";
import { Box, Typography, Paper } from "@mui/material";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";
import EntryDetails from "./EntryDetails";
import Togglable from "./Togglable";
import EntryForm from "./EntryForm";

interface Props {
  patient?: Patient;
  diagnoses: DiagnosisTypes[];
  onNewEntry: (values: UniversalEntryFormValues, formikHelpers: { resetForm: () => void }) => void;
}

const PatientInfo = ({ patient, diagnoses, onNewEntry }: Props) => {
  const [visible, setVisible] = useState(false);

  if (!patient) return <div>Loading...</div>;

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const handleSubmit = async (values: UniversalEntryFormValues, formikHelpers: { resetForm: () => void }) => {
    await onNewEntry(values, formikHelpers);
    formikHelpers.resetForm();
  };

  const genderIcon = (() => {
    switch (patient.gender) {
      case "male":
        return <MaleIcon />;
      case "female":
        return <FemaleIcon />;
      case "other":
        return <TransgenderIcon />;
      default:
        return null;
    }
  })();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <img
            src={`/images/patients/${patient.name}.png`}
            alt={patient.name}
            width="60"
            height="60"
            style={{ borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
            onError={e => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <Typography variant="h4">
            {patient.name} {genderIcon}
          </Typography>
        </Box>
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography sx={{ mb: 2 }}>occupation: {patient.occupation}</Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        <div style={{ margin: "16px" }}>
          <Togglable
            buttonLabel="ADD NEW ENTRY"
            toggleVisibility={toggleVisibility}
            hideWhenVisible={hideWhenVisible}
            showWhenVisible={showWhenVisible}
          >
            <EntryForm onSubmit={handleSubmit} diagnoses={diagnoses} toggleVisibility={toggleVisibility} />
          </Togglable>
        </div>
        Entries
      </Typography>
      {patient.entries && patient.entries.length > 0 ? (
        [...patient.entries].reverse().map(entry => (
          <Paper key={entry.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <EntryDetails entry={entry} diagnoses={diagnoses} />
          </Paper>
        ))
      ) : (
        <Typography>No entries available</Typography>
      )}
    </Box>
  );
};

export default PatientInfo;
