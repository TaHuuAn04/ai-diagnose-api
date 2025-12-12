import { Expose } from 'class-transformer';

export class ConversationDto {
  @Expose() id: string;
  @Expose() status: string;
  @Expose() from_end_user_id: string;
  @Expose() from_end_user_session_id: string;
  @Expose() from_end_user_name: string;
  @Expose() name: string;
  @Expose() summary: string;
  @Expose() read_at: number;
  @Expose() created_at: number;
  @Expose() updated_at: number;
  @Expose() message_count: number;
}
