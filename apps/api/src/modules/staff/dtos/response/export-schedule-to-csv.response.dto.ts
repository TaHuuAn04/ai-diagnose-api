import { Expose } from "class-transformer";


export class ExportScheduleToCSVResponseDto {
  @Expose()
  buffer: Buffer;

  @Expose()
  fileName: string;
}