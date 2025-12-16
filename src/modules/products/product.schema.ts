import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop()
  price!: number;

  @Prop()
  stock!: number;

  @Prop([String])
  images!: string[];
//for soft delete 
@Prop({ default: false })
  isDeleted!: boolean;

 @Prop({ type: Date, default: null })
deletedAt!: Date | null;

}
export const ProductSchema = SchemaFactory.createForClass(Product);
