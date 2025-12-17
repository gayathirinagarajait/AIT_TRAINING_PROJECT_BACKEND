import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MailQueueDocument = MailQueue & Document;

@Schema({ timestamps: true })
export class MailQueue {
  @Prop({ required: true })
  to!: string;

  @Prop({ required: true })
  subject!: string;

  @Prop()
  html?: string;

  @Prop()
  text?: string;

  @Prop({ type: Array, default: [] })
  attachments!: any[];

  @Prop({ default: 'PENDING' })
  status!: 'PENDING' | 'SENT' | 'FAILED';

  @Prop({ default: 0 })
  retryCount!: number;

  @Prop()
  error?: string;
}

export const MailQueueSchema =
  SchemaFactory.createForClass(MailQueue);
