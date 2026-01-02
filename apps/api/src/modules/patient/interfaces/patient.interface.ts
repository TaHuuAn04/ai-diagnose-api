import { CreatePatientResponseDto, PatientInfoDto } from "../dtos";

export interface IPatientService {
  getInfo(
    userId: string,
  ): Promise<PatientInfoDto>;

  createPatient(userId: string): Promise<CreatePatientResponseDto>;
}