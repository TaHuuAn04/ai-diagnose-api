import { Readable } from 'stream';

import {
  ChatMessageBlockInputDto,
  ChatMessageBlockResponseDto,
  ChatMessageStreamInputDto,
} from '../../dtos';

export interface IEmbeddedChatService {
  chatMessageBlock(
    input: ChatMessageBlockInputDto,
  ): Promise<ChatMessageBlockResponseDto>;

  chatMessageStream(input: ChatMessageStreamInputDto): Promise<Readable>;
}
