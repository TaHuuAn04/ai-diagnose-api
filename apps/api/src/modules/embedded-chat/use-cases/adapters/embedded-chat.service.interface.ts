import { Readable } from 'stream';

import { UploadFileChatDifyAiResponseDto } from '../../../dify-ai/dtos';
import {
  ChatMessageBlockInputDto,
  ChatMessageBlockResponseDto,
  ChatMessageStreamInputDto,
  UploadFileChatInputDto,
} from '../../dtos';

export interface IEmbeddedChatService {
  chatMessageBlock(
    input: ChatMessageBlockInputDto,
  ): Promise<ChatMessageBlockResponseDto>;

  chatMessageStream(input: ChatMessageStreamInputDto): Promise<Readable>;

  uploadFile(input: UploadFileChatInputDto): Promise<UploadFileChatDifyAiResponseDto>;
}
