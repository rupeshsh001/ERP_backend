// let mongoose = require("mongoose");
// let reviews = require("../src/modules/reviews/model");
// let chai = require("chai");
// let chaiHttp = require("chai-http");
// let should = chai.should();
// const app = require("../src/app");
// chai.use(chaiHttp);

// //testing for get method
// describe("/GET reviews", () => {
//   it("it should fetch all data from myreviews collection", (done) => {
//     let review = {
//       reqName: "admin",
//       reqType: "profile-creation",
//       status: "accepted",
//       reqId: 15,
//       employeeDetails: {
//         empName: "alan sajan",
//         empEmail: "sajan@mail.com",
//         empPersonalEmail: "alan@mail.com",
//         empDoj: "2021-11-20",
//         empDob: "2021-11-20",
//         empDepartment: "sales",
//         empDesignation: "marketing",
//         empReportingManager: "sunilee",
//         empConnections: 10,
//         empHobbies: ["Music", "Dance"],
//         empAboutMe: "i'm always cool..!",
//         empBand: "12",
//         empGraduation: "bba",
//         empGraduationUniversity: "du",
//         empPostGraduation: "mba",
//         empPostGraduationUniversity: "iim",
//         empPrimaryCapability: ["Communication"],
//         empSkillSet: ["Communication skill"],
//         empCertifications: ["Power Bi"],
//         role: "employee",
//         personalDetails: [],
//         professionalDetails: [],
//         skillsDetails: [],
//       },
//     };
//     chai
//       .request(app)
//       .get(`/api/reviews/`)
//       .send(review)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.be.a("object");
//         res.body.should.have.property("status");
//         done();
//       });
//   });
// });

// describe("/POST reviews", () => {
//   after(
//     "its execute after all test cases and delete all created test",
//     (done) => {
//       reviews.deleteMany({ reqName: "testCase" }).exec();
//       done();
//     }
//   );
//   it("it should post all data into myreviews collection", (done) => {
//     let review = {
//       reqName: "testCase",
//       reqType: "profile-creation",
//       status: "pending",
//       employeeDetails: {
//         empName: "al",
//         empEmail: "sajn@mail.com",
//         empDoj: "2021-11-20T00:00:00.000Z",
//         empDob: "2021-11-20T00:00:00.000Z",
//         empDepartment: "sales",
//         empDesignation: "marketing",
//         empReportingManager: "sunilee",
//         empConnections: 10,
//         empHobbies: ["Music", "Dance"],
//         empCtc: "23",
//         empPhoneNumber: "52164",
//         empPersonalEmail: "div@gmail.com",
//         empAboutMe: "i'm always cool..!",
//         empBand: "12",
//         empPrimaryNo: "7845652365",
//         empSecondaryNo: "7845652365",
//         empEmergencyNo: "7845652365",
//         empGraduation: "bba",
//         empPostGraduation: "mba",
//         empPrimaryCapability: ["Communication"],
//         empSkillSet: ["Communication skill"],
//         empCertifications: ["Power Bi"],
//         role: "APPROVER",
//       },
//     };
//     chai
//       .request(app)
//       .post("/api/reviews")
//       .send(review)
//       .end((err, res) => {
//         res.should.have.status(201);
//         res.body.should.be.a("object");
//         res.body.should.have.property("status");
//         done();
//       });
//   });
// });
