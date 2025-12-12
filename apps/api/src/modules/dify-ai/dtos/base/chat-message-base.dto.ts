import { Expose, Type } from 'class-transformer';

export enum EventType {
  Message = 'message',
  MessageEnd = 'message_end',
  AgentMessage = 'agent_message',
  AgentThought = 'agent_thought',
  MessageReplace = 'message_replace',
  MessageFile = 'message_file',
  TtsMessage = 'tts_message',
  TtsMessageEnd = 'tts_message_end',
  Error = 'error',
  Ping = 'ping',
}

export class UsageDto {
  @Expose() prompt_tokens: number;
  @Expose() completion_tokens: number;
  @Expose() total_tokens: number;
  @Expose() prompt_price: string;
  @Expose() completion_price: string;
  @Expose() total_price: string;
  @Expose() currency: string;
  @Expose() latency: number;
  @Expose() prompt_unit_price: string;
  @Expose() completion_unit_price: string;
  @Expose() prompt_price_unit: string;
  @Expose() completion_price_unit: string;
}

export class RetrieverResourceDto {
  @Expose() dataset_id: string;
  @Expose() dataset_name: string;
  @Expose() document_id: string;
  @Expose() document_name: string;
  @Expose() segment_id: string;
  @Expose() content: string;
  @Expose() score: number;
  @Expose() position: number;
}

export class MetadataDto {
  @Expose()
  @Type(() => RetrieverResourceDto)
  retriever_resources: RetrieverResourceDto[];

  @Expose()
  @Type(() => UsageDto)
  usage: UsageDto;
}

export class BlockingModeResponseDto {
  @Expose() answer: string;
  @Expose() conversation_id: string;
  @Expose() message_id: string;
  @Expose() created_at: number;
  @Expose() event: EventType;
  @Expose() mode: string;

  @Expose()
  @Type(() => MetadataDto)
  metadata: MetadataDto;
}

// Base class for streaming messages
export class BaseStreamingDto {
  @Expose() event: EventType;
  @Expose() task_id: string;
  @Expose() conversation_id: string;
  @Expose() message_id: string;
}

// Base class for streaming messages with creation time
export class BaseStreamingWithTimeDto extends BaseStreamingDto {
  @Expose() created_at: number;
}

export class StreamingMessageDto extends BaseStreamingWithTimeDto {
  @Expose() event: EventType.Message;
  @Expose() id: string;
  @Expose() answer: string;
}

export class StreamingMessageEndDto extends BaseStreamingWithTimeDto {
  @Expose() event: EventType.MessageEnd;
  @Expose() id: string;

  @Expose()
  @Type(() => MetadataDto)
  metadata: MetadataDto;
}

export class StreamingTtsMessageDto extends BaseStreamingWithTimeDto {
  @Expose() event: EventType.TtsMessage;
  @Expose() audio: string;
}

export class StreamingTtsMessageEndDto extends BaseStreamingWithTimeDto {
  @Expose() event: EventType.TtsMessageEnd;
  @Expose() audio: string;
}

export class StreamingAgentThoughtDto extends BaseStreamingWithTimeDto {
  @Expose() event: EventType.AgentThought;
  @Expose() id: string;
  @Expose() thought: string;
  @Expose() observation: string;
  @Expose() tool: string;
  @Expose() tool_input: string;
  @Expose() tool_labels: Record<string, unknown>;
  @Expose() message_files: string[];
  @Expose() position: number;
  @Expose() file_id?: string;
}

export class StreamingMessageFileDto {
  @Expose() event: EventType.MessageFile;
  @Expose() id: string;
  @Expose() conversation_id: string;
  @Expose() belongs_to: string;
  @Expose() type: string;
  @Expose() url: string;
}

export class StreamingErrorDto {
  @Expose() event: EventType.Error;
  @Expose() task_id: string;
  @Expose() message_id: string;
  @Expose() code: string;
  @Expose() message: string;
  @Expose() status: number;
}

export class StreamingAgentMessageDto extends BaseStreamingWithTimeDto {
  @Expose() event: EventType.AgentMessage;
  @Expose() id: string;
  @Expose() answer: string;
}

export class StreamingMessageReplaceDto extends BaseStreamingWithTimeDto {
  @Expose() event: EventType.MessageReplace;
  @Expose() answer: string;
}

export class StreamingPingDto {
  @Expose() event: EventType.Ping;
}

export type StreamingResponseDto =
  | StreamingMessageDto
  | StreamingMessageEndDto
  | StreamingAgentMessageDto
  | StreamingAgentThoughtDto
  | StreamingMessageReplaceDto
  | StreamingMessageFileDto
  | StreamingTtsMessageDto
  | StreamingTtsMessageEndDto
  | StreamingErrorDto
  | StreamingPingDto;
