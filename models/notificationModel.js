import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    users: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        read: { type: Boolean, default: false },
      },
    ],
    subject: { type: String },
    content: { type: String },
    media: { type: String },
    link: { type: String },
    type: {
      type: String,
      enum: ["email", "in-app"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      enum: ["User", "Admin", "Cronjob"],
    },
  },
  { timestamps: true }
);

export default (conn) => conn.models.Notification || conn.model("Notification", notificationSchema);
