import { Expose, Type } from 'class-transformer';

export class AgentThoughtDto {
  @Expose() id: string;
  @Expose() chain_id: string | null;
  @Expose() message_id: string;
  @Expose() position: number;
  @Expose() thought: string;
  @Expose() tool: string;
  @Expose() tool_labels: Record<string, unknown>;
  @Expose() tool_input: string;
  @Expose() created_at: number;
  @Expose() observation: string;
  @Expose() files: unknown[];
}

export class MessageDto {
  @Expose() id: string;
  @Expose() conversation_id: string;
  @Expose() inputs: Record<string, unknown>;
  @Expose() query: string;
  @Expose() answer: string;
  @Expose() message_files: unknown[];
  @Expose() feedback: unknown;
  @Expose() retriever_resources: unknown[];
  @Expose() created_at: number;

  @Expose()
  @Type(() => AgentThoughtDto)
  agent_thoughts: AgentThoughtDto[];

  @Expose() status: string;
  @Expose() error: unknown;
}
