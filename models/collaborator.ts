import mongoose, { Document, Schema, Types } from "mongoose";

export interface Collaborator extends Document {
  userId: Types.ObjectId;
  assessmentId: Types.ObjectId;
  access: {
    cansendemail: boolean;
    cangetresume: boolean;
    canchangeconfig: boolean;
  };
}

const CollaboratorSchema = new Schema<Collaborator>({
  userId: {
    //userid having the collaborated assessments
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  assessmentId: {
    type: Schema.Types.ObjectId,
    ref: "Assessment",
  },
  access: {
    type: {
      cansendemail: {
        type: Boolean,
        default: false,
      },
      cangetresume: {
        type: Boolean,
        default: false,
      },
      canchangeconfig: {
        type: Boolean,
        default: false,
      },
    },
  },
});
CollaboratorSchema.set("timestamps", true);
export default mongoose.models?.Collaborator ||
  mongoose.model<Collaborator>("Collaborator", CollaboratorSchema);
