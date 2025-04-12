
// import mongoose from 'mongoose';
// import Promotion from '../models/promotionModel.js';
import responseHandler from '../helpers/responseHandler.js';
import { createPromotionSchema, editPromotionSchema } from '../validations/promotionValidation.js';
// import dotenv from "dotenv";
import connectDB from '../dbMapping/DBconnect.js';
import PromotionModel from '../models/promotionModel.js';

// dotenv.config();
// const uri = process.env.MONGO_URI;

// let conn = null;
// async function connectToDB() {
//   if (!conn) {
//     conn = await mongoose.connect(uri);
//   }
// }


export default async function handler(req, res) {
  const { method, query, body } = req;
  const { project, id } = query;

  if (!project) {
    return responseHandler(res, 400, "Project name is required");
  }

  try {

    const conn = await connectDB(project);
    const Promotion = PromotionModel(conn);

    if (method === "GET") {
      if (id) {
        const promo = await Promotion.findById(id);
        return promo
          ? responseHandler(res, 200, "Promotion found", promo)
          : responseHandler(res, 404, "Promotion not found");
      }
      const promos = await Promotion.find({});
      return responseHandler(res, 200, "All promotions retrieved", promos);
    }

    if (method === "POST") {
      const { error } = createPromotionSchema.validate(body);
      if (error) return responseHandler(res, 400, `Validation Error: ${error.message}`);

      const promotion = await Promotion.create(body);
      return responseHandler(res, 201, "Promotion created", promotion);
    }

    if (method === "PUT") {
      if (!id) return responseHandler(res, 400, "Promotion ID required for update");

      const { error } = editPromotionSchema.validate(body);
      if (error) return responseHandler(res, 400, `Validation Error: ${error.message}`);

      const updated = await Promotion.findByIdAndUpdate(id, body, { new: true });
      return updated
        ? responseHandler(res, 200, "Promotion updated", updated)
        : responseHandler(res, 404, "Promotion not found");
    }

    if (method === "DELETE") {
      if (!id) return responseHandler(res, 400, "Promotion ID required for delete");

      const deleted = await Promotion.findByIdAndDelete(id);
      return deleted
        ? responseHandler(res, 200, "Promotion deleted", deleted)
        : responseHandler(res, 404, "Promotion not found");
    }

    return responseHandler(res, 405, "Method Not Allowed");
  } catch (err) {
    return responseHandler(res, 500, `Server Error: ${err.message}`);
  }
}