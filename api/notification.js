import connectDB from "../dbMapping/DBconnect.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import sendMail from "../utils/sendMail.js";
import sendInAppNotification from "../utils/sendInAppNotification.js";
import { createNotificationSchema } from "../validations/promotionValidation.js";
import responseHandler from "../helpers/responseHandler.js";

export default async function handler(req, res) {
  await connectDB(req, res);
  const { method, query, body } = req;
  const action = query.action || "";

  try {
    if (method === "POST" && action === "create") {
      const { error } = createNotificationSchema.validate(body, { abortEarly: true })
      if (error) return responseHandler(res, 400, `Invalid input: ${error.message}`);

      let { users, media } = body;

      if (users[0].user === "*") {
        const allUsers = await User.find({ status: { $in: ["active", "awaiting_payment"] } })
        users = allUsers.map((u) => ({ user: u._id }));
      }

      // Send Email
      if (body.type === "email") {
        const emails = [];
        for (const { user } of users) {
          const found = await User.findById(user);
          if (found?.email) emails.push(found.email);
        }

        const attachments = media ?
         [{ filename: media.split("/").pop(), path: media }] : 
         [];

        await sendMail({
          to: emails,
          subject: body.subject,
          text: body.content,
          attachments,
          link: body.link,
        });

      } else if (body.type === "in-app") {
        const fcms = [];
        for (const { user } of users) {
          const found = await User.findById(user);
          if (found?.fcm) fcms.push(found.fcm);
        }

        await sendInAppNotification(fcms, body.subject, body.content, media);
      }

      body.users = users;
      body.senderModel = "Admin";
      body.sender = req.userId;

      const created = await Notification.create(body);
      return responseHandler(res, 200, "Notification created", created);
    }

    if (method === "GET" && query.id) {
      const notification = await Notification.findById(query.id)
        .populate("users.user", "name")
        .populate("sender", "name");

      return responseHandler(res, 200, "Notification fetched", notification);
    }

    if (method === "GET" && !query.id && !query.user) {
      const { page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      const data = await Notification.find()
        .populate("users.user", "name")
        .sort({ _id: -1 })
        .skip(Number(skip))
        .limit(Number(limit));

      const count = await Notification.countDocuments();

      return responseHandler(res, 200, "Notifications fetched", data, count);
    }

    if (method === "GET" && query.user === "true") {
      const userId = req.userId;

      const userNotifications = await Notification.find({
        users: { $elemMatch: { user: userId } },
      })
        .sort({ createdAt: 1 })
        .limit(20);

      if (userNotifications.length > 0) {
        await Notification.updateMany(
          {
            users: { $elemMatch: { user: userId, read: false } },
          },
          { $set: { "users.$.read": true } }
        );
      }

      return responseHandler(res, 200, "User notifications fetched", userNotifications);
    }

    return responseHandler(res, 405, "Method Not Allowed or Unknown Action");
  } catch (error) {
    return responseHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
}
