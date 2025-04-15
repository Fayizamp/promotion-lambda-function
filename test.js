// // import handler from "./api/promotion.js";

// // const mockReq = {
// //   method: "POST",
// //   body: {
// //     title: "Test Promo",
// //     description: "Testing promo from CLI",
// //     type: "banner",
// //     startDate: new Date(),
// //     endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
// //     media: "https://example.com/banner.jpg",
// //     link: "https://example.com",
// //   },
// // };

// // const mockRes = {
// //   status(statusCode) {
// //     this.statusCode = statusCode;
// //     return this;
// //   },
// //   json(payload) {
// //     console.log("Response:", {
// //       statusCode: this.statusCode,
// //       ...payload,
// //     });
// //   },
// // };

// // handler(mockReq, mockRes);

// import handler from './api/product.js';

// // Mock Request and Response
// const mockRequest = {
//   method: "POST",
//   body: {
//     projectName: "kssia",
//     name: "Sample Product",
//     price: 100,
//     offerPrice: 90,
//     description: "A cool product",
//     moq: 10,
//     units: "pcs",
//     tags: ["cool", "new"],
//     status: "pending",
//     reason: "",
//   },
//   query: {}
// };

// const mockResponse = {
//   status(statusCode) {
//     this.statusCode = statusCode;
//     return this;
//   },
//   json(data) {
//     console.log("Response:", {
//       status: this.statusCode,
//       ...data,
//     });
//   },
// };

// handler(mockRequest, mockResponse);

import sendMail from "./utils/sendMail.js";

const run = async () => {
  try {
    await sendMail({
      to: "receiver@gmail.com",
      subject: "📧 Local Test Email",
      text: "This is a local test email using Nodemailer with Gmail App Password!",
      attachments: [
        {
          filename: "sample.txt", 
          path: "./sample.txt",
        },
      ],
    });

    console.log(" Email test complete.");
  } catch (err) {
    console.error("Error during test email:", err.message);
  }
};

run();

