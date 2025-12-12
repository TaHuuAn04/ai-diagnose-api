import {
  BlockingModeResponseDto,
  EventType,
  MetadataDto,
  StreamingResponseDto,
} from '../dtos';

export function convertStreamingToBlocking(
  streamingData: string[],
): BlockingModeResponseDto {
  let answer = '';
  let metadata: MetadataDto | undefined = undefined;
  let messageId = '';
  let conversationId = '';
  let createdAt = 0;
  let eventType: EventType = EventType.Message;

  for (const data of streamingData) {
    const parsed = JSON.parse(
      data.replace('data: ', ''),
    ) as StreamingResponseDto;

    if (
      parsed.event === EventType.Message ||
      parsed.event === EventType.AgentMessage
    ) {
      eventType = parsed.event;
      answer += parsed.answer;
      messageId = parsed.message_id;
      conversationId = parsed.conversation_id;
      createdAt = parsed.created_at;
    } else if (parsed.event === EventType.MessageEnd && 'metadata' in parsed) {
      metadata = parsed.metadata;
    }
  }

  return {
    event: eventType,
    message_id: messageId,
    conversation_id: conversationId,
    mode: 'chat',
    answer,
    metadata: metadata ?? ({} as MetadataDto),
    created_at: createdAt,
  };
}
