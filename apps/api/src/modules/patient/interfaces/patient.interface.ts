import { CreatePatientDto, CreatePatientResponseDto, PatientInfoDto } from "../dtos";

export interface IPatientService {
  getInfo(
    userId: string,
  ): Promise<PatientInfoDto>;

  createPatient(input: CreatePatientDto): Promise<CreatePatientResponseDto>;
}