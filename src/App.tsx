import { useState, useEffect } from "react";
import axios from "axios";
import { Route, Link, Routes, useMatch } from "react-router-dom";
import { Button, Divider, Container, Typography } from "@mui/material";
import { apiBaseUrl } from "./constants";
import { Patient, DiagnosisTypes, ErrorMessage, EntryWithoutId, UniversalEntryFormValues } from "./types";
import patientService from "./services/patients";
import diagnosesService from "./services/diagnoses";
import PatientListPage from "./components/PatientListPage";
import PatientInfo from "./components/PatientInfo";
import Notify from "./components/Notify";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>(undefined);
  const [diagnoses, setDiagnoses] = useState<DiagnosisTypes[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const match = useMatch("/patients/:id");

  const notify = (message: ErrorMessage) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  };

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      try {
        const patients = await patientService.getAll();
        setPatients(patients);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (!error.response) {
            console.error("Server is not available");
            notify("Server is currently unavailable. Please try again later.");
          } else {
            console.error("Error response:", error.response);
            notify(error.response?.data?.error[0]?.message || "An unknown error occurred");
          }
        } else {
          console.error("Unexpected error:", error);
          notify("An unexpected error occurred");
        }
      }
    };
    void fetchPatientList();
  }, []);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnosesService.getAllDiagnoses();
      setDiagnoses(diagnoses);
    };
    void fetchDiagnoses();
  }, []);

  useEffect(() => {
    if (match) {
      const fetchPatient = async () => {
        try {
          const patient = await patientService.getOne(match.params.id as string);
          setSelectedPatient(patient);
        } catch (error) {
          console.error("Failed to fetch patient", error);
        }
      };
      void fetchPatient();
    }
  }, [match]);

  const handleNewEntry = async (values: UniversalEntryFormValues, { resetForm }: { resetForm: () => void }) => {
    let entryWithoutId: EntryWithoutId;
    switch (values.type) {
      case "HealthCheck":
        if (values.healthCheckRating === undefined) {
          throw new Error("HealthCheckRating is required for HealthCheck entry");
        }
        entryWithoutId = {
          type: "HealthCheck",
          description: values.description,
          date: values.date,
          specialist: values.specialist,
          healthCheckRating: values.healthCheckRating,
          diagnosisCodes: values.diagnosisCodes,
        };
        break;

      case "Hospital":
        if (!values.discharge) {
          throw new Error("Discharge is required for Hospital entry");
        }
        entryWithoutId = {
          type: "Hospital",
          description: values.description,
          date: values.date,
          specialist: values.specialist,
          discharge: values.discharge,
          diagnosisCodes: values.diagnosisCodes,
        };
        break;

      case "OccupationalHealthcare":
        if (!values.employerName) {
          throw new Error("Employer name is required for OccupationalHealthcare entry");
        }
        entryWithoutId = {
          type: "OccupationalHealthcare",
          description: values.description,
          date: values.date,
          specialist: values.specialist,
          employerName: values.employerName,
          sickLeave: values.sickLeave,
          diagnosisCodes: values.diagnosisCodes,
        };
        break;
      default:
        throw new Error("Invalid entry type");
    }

    if (selectedPatient) {
      console.log("Adding new entry:", values);
      try {
        const updatedPatient = await patientService.createEntry(selectedPatient.id, entryWithoutId);
        setSelectedPatient(updatedPatient);
        resetForm();
        setPatients(prevPatients =>
          prevPatients.map(patient =>
            patient.id === updatedPatient.id ? { ...patient, entries: updatedPatient.entries } : patient
          )
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error.response);
          notify(error.response?.data?.error[0]?.message || "An unknown error occurred");
        } else {
          console.error("Unexpected error:", error);
          notify("An unexpected error occurred");
        }
      }
    }
  };

  return (
    <div className="App">
      <Container>
        <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>
        <Divider hidden />
        <Notify errorMessage={errorMessage} />
        <Routes>
          <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
          <Route
            path="/patients/:id"
            element={<PatientInfo patient={selectedPatient} diagnoses={diagnoses} onNewEntry={handleNewEntry} />}
          />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
