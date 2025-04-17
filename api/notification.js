import connectDB from "../dbMapping/DBconnect.js";
import NotificationModel from "../models/notificationModel.js";
import UserModel from "../models/userModel.js";
import sendMail from "../utils/sendMail.js";
import { createNotificationSchema } from "../validations/promotionValidation.js";
import responseHandler from "../helpers/responseHandler.js";

export default async function handler(req, res) {
  const { method, query, body } = req;
  const { project, action = "" } = query;

  if (!project) return responseHandler(res, 400, "Project name is required");

  try {
    const conn = await connectDB(project);
    const Notification = NotificationModel(conn);
    const User = UserModel(conn);

    // if (method === "POST" && action === "create") {
    //   const { error } = createNotificationSchema.validate(body, { abortEarly: true });
    //   if (error) return responseHandler(res, 400, `Invalid input: ${error.message}`);

    //   let { users, media } = body;

    //   if (users[0].user === "*") {
    //     const allUsers = await User.find({ status: { $in: ["active", "awaiting_payment"] } });
    //     users = allUsers.map((u) => ({ user: u._id }));
    //   }

    //   const emails = [];
    //   for (const { user } of users) {
    //     const found = await User.findById(user);
    //     if (found?.email) emails.push(found.email);
    //   }

    //   const attachments = media
    //     ? [{ filename: media.split("/").pop(), path: media }]
    //     : [];

    //   await sendMail({
    //     to: emails,
    //     subject: body.subject,
    //     text: body.content,
    //     attachments,
    //     link: body.link,
    //   });

    //   body.users = users;
    //   body.senderModel = "Admin";
    //   body.sender = req.userId;

    //   const created = await Notification.create(body);
    //   return responseHandler(res, 200, "Notification created", created);
    // }

    if (method === "POST" && action === "create") {
      const { error } = createNotificationSchema.validate(body, { abortEarly: true });
      if (error) return responseHandler(res, 400, `Invalid input: ${error.message}`);
    
      let { users, media } = body;
      const emails = [];
    
      if (users[0].user === "*") {
        const allUsers = await User.find({ status: { $in: ["active", "awaiting_payment"] }, email: { $exists: true, $ne: null } });
        
        // Set users directly from allUsers
        users = allUsers.map((u) => ({ user: u._id }));
        emails.push(...allUsers.map(u => u.email));
      } else {
        // Loop through users to fetch their emails
        for (const { user } of users) {
          const found = await User.findById(user);
          if (found?.email) emails.push(found.email);
        }
      }
    
      const attachments = media
        ? [{ filename: media.split("/").pop(), path: media }]
        : [];
    
      await sendMail({
        to: emails,
        subject: body.subject,
        text: body.content,
        attachments,
        link: body.link,
      });
    
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
          { users: { $elemMatch: { user: userId, read: false } } },
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
