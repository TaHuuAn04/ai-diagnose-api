import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import {
  DraftWorkflowDifyAiInputDto,
  DraftWorkflowDifyAiResponseDto,
  PublishWorkflowDifyAiInputDto,
  PublishWorkflowDifyAiResponseDto,
} from './dtos';
import {
  DraftWorkflowDifyAiCommand,
  PublishWorkflowDifyAiCommand,
} from './use-cases';

@Injectable()
export class DifyWorkflowService {
  constructor(private readonly commandBus: CommandBus) {}

  async draftWorkflow(input: DraftWorkflowDifyAiInputDto) {
    const command = new DraftWorkflowDifyAiCommand(input);
    return this.commandBus.execute<
      DraftWorkflowDifyAiCommand,
      DraftWorkflowDifyAiResponseDto
    >(command);
  }

  async publishWorkflow(input: PublishWorkflowDifyAiInputDto) {
    const command = new PublishWorkflowDifyAiCommand(input);
    return this.commandBus.execute<
      PublishWorkflowDifyAiCommand,
      PublishWorkflowDifyAiResponseDto
    >(command);
  }
}
