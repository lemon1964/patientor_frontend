import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import { HealthCheckRatingTypes, DiagnosisTypes, UniversalEntryFormValues } from "../types";

interface FormData {
  description: string;
  date: string;
  specialist: string;
  healthCheckRating: HealthCheckRatingTypes;
  discharge: {
    date: string;
    criteria: string;
  };
  employerName: string;
  sickLeave: {
    startDate: string;
    endDate: string;
  };
  diagnosisCodes: string[];
}

interface EntryFormProps {
  onSubmit: (values: UniversalEntryFormValues, formikHelpers: { resetForm: () => void }) => void;
  diagnoses: DiagnosisTypes[];
  toggleVisibility: () => void;
}

const EntryForm = ({ onSubmit, diagnoses, toggleVisibility }: EntryFormProps) => {
  const [type, setType] = useState("HealthCheck");
  const [formData, setFormData] = useState<FormData>({
    description: "",
    date: "",
    specialist: "",
    healthCheckRating: HealthCheckRatingTypes.Healthy,
    discharge: {
      date: "",
      criteria: "",
    },
    employerName: "",
    sickLeave: {
      startDate: "",
      endDate: "",
    },
    diagnosisCodes: [],
  });
  

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const [parent, child] = name.split(".");

    if (child) {
      setFormData(prevData => {
        const updatedParent = {
          ...(prevData[parent as keyof FormData] as unknown as Record<string, unknown>),
          [child]: value,
        };

        return {
          ...prevData,
          [parent as keyof FormData]: updatedParent,
        };
      });
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    setFormData(prevData => ({
      ...prevData,
      diagnosisCodes: event.target.value as string[],
    }));
  };

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      let entryData: UniversalEntryFormValues;
    
      switch (type) {
        case "HealthCheck":
          entryData = {
            type: "HealthCheck",
            description: formData.description,
            date: formData.date,
            specialist: formData.specialist,
            healthCheckRating: formData.healthCheckRating,
            diagnosisCodes: formData.diagnosisCodes,
          };
          break;
        case "Hospital":
          entryData = {
            type: "Hospital",
            description: formData.description,
            date: formData.date,
            specialist: formData.specialist,
            discharge: formData.discharge,
            diagnosisCodes: formData.diagnosisCodes,
          };
          break;
        case "OccupationalHealthcare":
          entryData = {
            type: "OccupationalHealthcare",
            description: formData.description,
            date: formData.date,
            specialist: formData.specialist,
            employerName: formData.employerName,
            sickLeave: formData.sickLeave,
            diagnosisCodes: formData.diagnosisCodes,
          };
          break;
        default:
          throw new Error("Invalid entry type");
      }
  
    onSubmit(entryData, {
      resetForm: () =>
        setFormData({
          description: "",
          date: "",
          specialist: "",
          healthCheckRating: HealthCheckRatingTypes.Healthy,
          discharge: {
            date: "",
            criteria: "",
          },
          employerName: "",
          sickLeave: {
            startDate: "",
            endDate: "",
          },
          diagnosisCodes: [],
        }),
    });
    toggleVisibility();
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px dotted", padding: "16px", borderRadius: "8px" }}>
      <Typography variant="h6">Add New Entry</Typography>

      <TextField select label="Select entry type" value={type} onChange={handleTypeChange} fullWidth margin="normal">
        <MenuItem value="HealthCheck">HealthCheck</MenuItem>
        <MenuItem value="Hospital">Hospital</MenuItem>
        <MenuItem value="OccupationalHealthcare">OccupationalHealthcare</MenuItem>
      </TextField>

      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Date"
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Specialist"
        name="specialist"
        value={formData.specialist}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      {type === "HealthCheck" && (
        <Box>
          <TextField
            label="Health Check Rating"
            name="healthCheckRating"
            select
            value={formData.healthCheckRating}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value={HealthCheckRatingTypes.Healthy}>Healthy</MenuItem>
            <MenuItem value={HealthCheckRatingTypes.LowRisk}>Low Risk</MenuItem>
            <MenuItem value={HealthCheckRatingTypes.HighRisk}>High Risk</MenuItem>
            <MenuItem value={HealthCheckRatingTypes.CriticalRisk}>Critical Risk</MenuItem>
          </TextField>
        </Box>
      )}

      {type === "Hospital" && (
        <Box>
          <TextField
            label="Discharge Date"
            type="date"
            name="discharge.date"
            value={formData.discharge.date}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Discharge Criteria"
            name="discharge.criteria"
            value={formData.discharge.criteria}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Box>
      )}

      {type === "OccupationalHealthcare" && (
        <Box>
          <TextField
            label="Employer Name"
            name="employerName"
            value={formData.employerName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Sick Leave Start Date"
            name="sickLeave.startDate"
            type="date"
            value={formData.sickLeave.startDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Sick Leave End Date"
            name="sickLeave.endDate"
            type="date"
            value={formData.sickLeave.endDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      )}

      <FormControl fullWidth margin="normal">
        <InputLabel id="diagnosis-codes-label">Diagnosis Codes</InputLabel>
        <Select
          labelId="diagnosis-codes-label"
          multiple
          value={formData.diagnosisCodes}
          onChange={handleDiagnosisChange}
          renderValue={selected => (selected as string[]).join(", ")}
        >
          {diagnoses.map(diagnosis => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>
              <Checkbox checked={formData.diagnosisCodes.indexOf(diagnosis.code) > -1} />
              <ListItemText primary={diagnosis.name} />
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Select diagnosis codes</FormHelperText>
      </FormControl>
      <Box display="flex" justifyContent="space-between" marginTop={2}>
        <Button variant="contained" color="error" onClick={toggleVisibility}>
          CANCEL
        </Button>
        <Button type="submit" variant="contained" color="inherit">
          ADD
        </Button>
      </Box>
    </form>
  );
};

export default EntryForm;
