import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: {
    type: String,
    enum: ["banner", "video", "poster", "notice"],
  },
  startDate: Date,
  endDate: Date,
  media: String,
  link: String,
  status: {
    type: String,
    enum: ["active", "experied"],
    default: "active",
  }
}, { 
    timestamps: true,
 });


export default mongoose.models.Promotion || mongoose.model("Promotion", promotionSchema);
