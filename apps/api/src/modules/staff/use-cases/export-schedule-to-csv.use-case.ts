import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { ExportScheduleToCSVResponseDto, GetScheduleRequestDto } from '../dtos';
import { IStaffService } from '../interfaces'

export class ExportScheduleToCSVQuery implements IQuery {
  constructor(
    public readonly staffId: string,
    public readonly request: GetScheduleRequestDto
  ) { }
}

@QueryHandler(ExportScheduleToCSVQuery)
export class ExportScheduleToCSVQueryHandler
  implements IQueryHandler<ExportScheduleToCSVQuery, ExportScheduleToCSVResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.STAFF_SERVICE)
    private readonly staffService: IStaffService
  ) {}

  async execute(query: ExportScheduleToCSVQuery): Promise<ExportScheduleToCSVResponseDto> {
    const result = await this.staffService.exportScheduleToCSV(
      query.staffId,
      query.request
    );

    return result;
  }
}
