import { CreatePatientResponseDto, PatientInfoDto, UpdatePatientDto } from "../dtos";

export interface IPatientService {
  getInfo(
    userId: string,
  ): Promise<PatientInfoDto>;

  createPatient(userId: string): Promise<CreatePatientResponseDto>;

  updatePatient(
    userId: string,
    input: UpdatePatientDto,
  ): Promise<PatientInfoDto>;
}