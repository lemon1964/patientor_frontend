export interface DiagnosisTypes {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries?: ExpandedEntry[];
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;

interface BaseEntryTypes {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
  nameDiagnosisCodes?: DiagnosisTypes[];
}

export enum HealthCheckRatingTypes {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export interface HealthCheckEntryTypes extends BaseEntryTypes {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRatingTypes;
}

interface OccupationalHealthcareEntryTypes extends BaseEntryTypes {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

interface HospitalEntryTypes extends BaseEntryTypes {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}

export type EntryTypes = HealthCheckEntryTypes | OccupationalHealthcareEntryTypes | HospitalEntryTypes;

type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
export type EntryWithoutId = UnionOmit<EntryTypes, "id">;

interface ExpandedEntryTypes extends BaseEntryTypes {
  nameDiagnosisCodes?: DiagnosisTypes[];
}

export type ExpandedEntry =
  | (HealthCheckEntryTypes & ExpandedEntryTypes)
  | (HospitalEntryTypes & ExpandedEntryTypes)
  | (OccupationalHealthcareEntryTypes & ExpandedEntryTypes);

  export type ExpandedEntryWithoutId = UnionOmit<ExpandedEntryTypes, "id">;

export interface ExpandedPatientTypes extends Omit<Patient, "entries"> {
  entries?: ExpandedEntry[];
}

export type ErrorMessage = string;

export type UniversalEntryFormValues = {
  type: "Hospital" | "OccupationalHealthcare" | "HealthCheck";
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];

  discharge?: {
    date: string;
    criteria: string;
  };

  employerName?: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };

  healthCheckRating?: HealthCheckRatingTypes;
};
