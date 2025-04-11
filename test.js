// import handler from "./api/promotion.js";

// const mockReq = {
//   method: "POST",
//   body: {
//     title: "Test Promo",
//     description: "Testing promo from CLI",
//     type: "banner",
//     startDate: new Date(),
//     endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
//     media: "https://example.com/banner.jpg",
//     link: "https://example.com",
//   },
// };

// const mockRes = {
//   status(statusCode) {
//     this.statusCode = statusCode;
//     return this;
//   },
//   json(payload) {
//     console.log("Response:", {
//       statusCode: this.statusCode,
//       ...payload,
//     });
//   },
// };

// handler(mockReq, mockRes);


import handler from "./api/promotion.js";


const fakeReq = {
  method: "POST",
  body: {
    title: "Test Promo",
    description: "Testing full CRUD",
    type: "banner",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    media: "https://example.com/promo.jpg",
    link: "https://example.com",
    status: "active"
  },
  query: {}
};

const fakeRes = {
  status: (code) => ({
    json: (data) => console.log("Response:", { statusCode: code, ...data }),
  }),
};

handler(fakeReq, fakeRes);
