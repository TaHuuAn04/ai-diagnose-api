import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { BookShiftRequestDto } from '../dtos/requests/book-shift.request.dto';
import { BookShiftResponseDto } from '../dtos/response/book-shift.response.dto';
import { IShiftService } from '../interfaces';

export class BookShiftCommand implements ICommand {
  constructor(public readonly bookShiftDto: BookShiftRequestDto) {}
}

@CommandHandler(BookShiftCommand)
export class BookShiftCommandHandler
  implements ICommandHandler<BookShiftCommand, BookShiftResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.SHIFT_SERVICE)
    private readonly shiftService: IShiftService
  ) {}

  async execute(command: BookShiftCommand): Promise<BookShiftResponseDto> {
    return await this.shiftService.bookShift(command.bookShiftDto);
  }
}
