import mongoose, { Document, Schema, Types } from 'mongoose';

export interface QuestionT extends Document {
 assessmentId: Types.ObjectId;
 question: string;
 options: {
    optionId: Types.ObjectId;
    option: string;
 }[];
 answerId: Types.ObjectId;
}

const QuestionSchema = new Schema<QuestionT>({
  assessmentId: {
    type: Schema.Types.ObjectId,
    ref: "Assessment",
  },
  question: {
    type: String,
  },
  options: [
    {
      optionId: Schema.Types.ObjectId,
      option: String,
    },
  ],
  answerId: {
    type: Schema.Types.ObjectId,
    ref: "Options",
  },
});

export default mongoose.models?.Question || mongoose.model<QuestionT>("Question", QuestionSchema);