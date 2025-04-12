import { useState } from "react";
import { Box, Table, Button, TableHead, Typography, TableCell, TableRow, TableBody } from "@mui/material";
import axios from "axios";
import { PatientFormValues, Patient, HealthCheckEntryTypes } from "../../types";
import AddPatientModal from "../AddPatientModal";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Link } from "react-router-dom";
import patientService from "../../services/patients";

interface Props {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

const getLastHealthCheckRating = (entries: HealthCheckEntryTypes[]): number | null => {
  const healthCheckEntries = entries.filter(entry => entry.type === "HealthCheck");
  if (healthCheckEntries.length === 0) {
    return null;
  }
  const lastHealthCheck = healthCheckEntries[healthCheckEntries.length - 1];
  return lastHealthCheck.healthCheckRating;
};

const PatientListPage = ({ patients, setPatients }: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      const patient = await patientService.create(values);
      setPatients(patients.concat(patient));
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace("Something went wrong. Error: ", "");
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          Patient list
        </Typography>
      </Box>
      <Table style={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
            <TableCell>Health Rating</TableCell>
            <TableCell>Photo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient: Patient) => {
            const lastHealthCheckRating = getLastHealthCheckRating(patient.entries as HealthCheckEntryTypes[]);
            return (
              <TableRow key={patient.id}>
                <TableCell>
                  <Link to={`/patients/${patient.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    {patient.name}
                  </Link>
                </TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.occupation}</TableCell>
                <TableCell>
                  {lastHealthCheckRating !== null ? (
                    <Favorite
                      style={{
                        color:
                          lastHealthCheckRating === 0
                            ? "green"
                            : lastHealthCheckRating === 1
                            ? "blue"
                            : lastHealthCheckRating === 2
                            ? "yellow"
                            : "red",
                      }}
                    />
                  ) : (
                    <FavoriteBorder style={{ color: "rgba(0, 0, 0, 0.3)" }} />
                  )}
                </TableCell>
                <TableCell>
                  <img
                    src={`/images/patients/${patient.name}.png`}
                    alt={patient.name}
                    width="40"
                    height="40"
                    style={{ borderRadius: "50%", objectFit: "cover", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <AddPatientModal modalOpen={modalOpen} onSubmit={submitNewPatient} error={error} onClose={closeModal} />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Patient
      </Button>
    </div>
  );
};

export default PatientListPage;
