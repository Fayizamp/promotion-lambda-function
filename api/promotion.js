// import mongoose from 'mongoose';
// import Promotion from '../models/promotionModel.js';
// import responseHandler from '../helpers/responseHandler.js';
// import { createPromotionSchema } from '../validations/promotionValidation.js';
// import dotenv from "dotenv";
// dotenv.config();

// const uri = process.env.MONGO_URI;

// let conn = null;
// async function connectToDB() {
//   if (conn == null) {
//     conn = await mongoose.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   }
// }

// export default async function handler(req, res) {
//   await connectToDB();

//   if (req.method !== "POST") {
//     return responseHandler(res, 405, "Method Not Allowed");
//   }

//   const { error } = createPromotionSchema.validate(req.body);
//   if (error) {
//     return responseHandler(res, 400, `Validation Error: ${error.message}`);
//   }

//   try {
//     const promotion = await Promotion.create(req.body);
//     return responseHandler(res, 201, "Promotion created", promotion);
//   } catch (err) {
//     return responseHandler(res, 500, err.message);
//   }
// }

import mongoose from 'mongoose';
import Promotion from '../models/promotionModel.js';
import responseHandler from '../helpers/responseHandler.js';
import { createPromotionSchema, editPromotionSchema } from '../validations/promotionValidation.js';
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGO_URI;

let conn = null;
async function connectToDB() {
  if (!conn) {
    conn = await mongoose.connect(uri);
  }
}

export default async function handler(req, res) {
  await connectToDB();

  const { method, query, body } = req;

  try {
    if (method === "GET") {
          if (query.id) {
            const promo = await Promotion.findById(query.id);
            return promo
              ? responseHandler(res, 200, "Promotion found", promo)
              : responseHandler(res, 404, "Promotion not found");
          }
          const promos = await Promotion.find({});
          return responseHandler(res, 200, "All promotions retrieved", promos);
        }
    // if (method === "POST") {
    //   const { error } = createPromotionSchema.validate(body);
    //   if (error) return responseHandler(res, 400, `Validation Error: ${error.message}`);
      
    //   const promotion = await Promotion.create(body);
    //   return responseHandler(res, 201, "Promotion created", promotion);
    // }

    // if (method === "GET") {
    //   if (query.id) {
    //     const promo = await Promotion.findById(query.id);
    //     return promo
    //       ? responseHandler(res, 200, "Promotion found", promo)
    //       : responseHandler(res, 404, "Promotion not found");
    //   }
    //   const promos = await Promotion.find({});
    //   return responseHandler(res, 200, "All promotions retrieved", promos);
    // }

    // if (method === "PUT") {
    //   if (!query.id) return responseHandler(res, 400, "Promotion ID required for update");

    //   const { error } = editPromotionSchema.validate(body);
    //   if (error) return responseHandler(res, 400, `Validation Error: ${error.message}`);

    //   const updated = await Promotion.findByIdAndUpdate(query.id, body, { new: true });
    //   return updated
    //     ? responseHandler(res, 200, "Promotion updated", updated)
    //     : responseHandler(res, 404, "Promotion not found");
    // }

    // if (method === "DELETE") {
    //   if (!query.id) return responseHandler(res, 400, "Promotion ID required for delete");

    //   const deleted = await Promotion.findByIdAndDelete(query.id);
    //   return deleted
    //     ? responseHandler(res, 200, "Promotion deleted", deleted)
    //     : responseHandler(res, 404, "Promotion not found");
    // }

    return responseHandler(res, 405, "Method Not Allowed");
  } catch (err) {
    return responseHandler(res, 500, `Server Error: ${err.message}`);
  }
}
