// // process.env.NODE_ENV = "test";

// // let chai = require("chai");
// // let chaiHttp = require("chai-http");
// // let server = require("../src/app");
// // let should = chai.should();
// // chai.use(chaiHttp);

// // let assignee = require("../src/models/assignee");

// // describe("Assign Employee Unit Testing with Mocha..!!", () => {
// //     describe("/Assign new Employee", () => {
// //         it("it should throw validation error", (done) => {
// //             let data = new assignee({

// //                 Employee_Name: "Yusuf Shekh",
// //                 Allocation_Rate: 70,
// //                 Start_Date: "04/24/2021",
// //                 End_Date: "06/12/2021"
// //             });
// //             chai
// //                 .request(server)
// //                 .post("/assign")
// //                 .send(data)
// //                 .end((err, res) => {
// //                     res.should.have.status(422);
// //                     res.body.should.be.a("object");
// //                     res.body.should.have.property("error");
// //                     done();
// //                 });
// //         });
// //         it("it should create new PO", (done) => {
// //             let details = {
// //                 PO_Id: "VBERP-34",
// //                 Employee_Id: "VBEMP-45",
// //                 Employee_Name: "Yusuf Shekh",
// //                 Allocation_Rate: 70,
// //                 Start_Date: "04/24/2021",
// //                 End_Date: "06/12/2021"
// //             };
// //             const assigned = new assignee(details)
// //             assigned.save((err, data) => {
// //                 chai
// //                     .request(server)
// //                     .post("/assign")
// //                     .send(details)
// //                     .end((err, res) => {
// //                         res.should.have.status(200);
// //                         res.body.should.be.a("object");
// //                         res.body.should.have.property("PO_Id");
// //                         res.body.should.have.property("Employee_Id");
// //                         res.body.should.have.property("Employee_Name");
// //                         res.body.should.have.property("Allocation_Rate");
// //                         res.body.should.have.property("Start_Date");
// //                         res.body.should.have.property("End_Date");
// //                         done();
// //                     });
// //             });
// //         });
// //     });

// //     describe("/GET Assigned Employee of that Project", () => {
// //         it("it should throw Query validation error", (done) => {
// //             chai
// //                 .request(server)
// //                 .get("/assign/VBERP-34")
// //                 .query({
// //                     page: -1,
// //                     limit: 0
// //                 })
// //                 .end((err, res) => {
// //                     res.should.have.status(422);
// //                     res.body.should.be.a("object");
// //                     res.body.should.have.property("error");
// //                     done();
// //                 });
// //         });

// //         it("it should return all assigned employee based on given Project ID", (done) => {
// //             chai
// //                 .request(server)
// //                 .get("/assign/VBERP-34")
// //                 .end((err, res) => {
// //                     res.should.have.status(200);
// //                     res.body.data.results.should.be.a("array");
// //                     res.body.data.results.length.should.be.above(0);
// //                     done();
// //                 });
// //         });
// //     });

// //     describe("/Update employee details", () => {
// //         it("it should throw validation error", (done) => {
// //             let data = new assignee({

// //                 Employee_Name: "Yusuf Shekh",
// //                 Allocation_Rate: 70,
// //                 Start_Date: "04/24/2021",
// //                 End_Date: "06/12/2021"
// //             });
// //             chai
// //                 .request(server)
// //                 .patch("/assign/VBEMP-45")
// //                 .send(data)
// //                 .end((err, res) => {
// //                     res.should.have.status(422);
// //                     res.body.should.be.a("object");
// //                     res.body.should.have.property("error");
// //                     done();
// //                 });
// //         });
// //         it("it should UPDATE employee details of given id", (done) => {
// //             let user = new assignee({
// //                 first_name: "Amit",
// //                 last_name: "Kumar",
// //                 email: "amit@gmail.com",
// //                 role: "staff",
// //             });
// //             user.save((err, user) => {
// //                 chai
// //                     .request(server)
// //                     .patch("/assign/VBEMP-45")
// //                     .send({
// //                         PO_Id: "VBERP-34",
// //                         Employee_Id: "VBEMP-45",
// //                         Employee_Name: "Yusuf Shekh",
// //                         Allocation_Rate: 80,
// //                         Start_Date: "03/24/2021",
// //                         End_Date: "05/12/2021"
// //                     })
// //                     .end((err, res) => {
// //                         res.should.have.status(200);
// //                         res.body.should.be.a("object");
// //                         res.body.should.have
// //                             .property("message")
// //                             .eql("Details successfully updated!");
// //                         done();
// //                     });
// //             });
// //         });
// //     });

// //     describe("/Unassign Employee from project", () => {
// //         it("it should Unassign employee based on given Employee ID", (done) => {
// //             chai
// //                 .request(server)
// //                 .patch("/assign/unassign/VBERP-34")
// //                 .end((err, res) => {
// //                     res.should.have.status(200);
// //                     res.body.should.be.a("object");
// //                     res.body.should.have
// //                         .property("message")
// //                         .eql("Employee successfully unassigned!");
// //                     done();
// //                 });
// //         });
// //     });
// // });
// describe("Assign Employee Unit Testing with Mocha..!!", () => {
//   describe("/Assign new Employee", () => {
//     it("it should throw validation error", (done) => {
//       let data = new assignee({
//         Employee_Name: "Yusuf Shekh",
//         Allocation_Rate: 70,
//         Start_Date: "04/24/2021",
//         End_Date: "06/12/2021",
//       });
//       chai
//         .request(server)
//         .post("/assign")
//         .send(data)
//         .end((err, res) => {
//           res.should.have.status(422);
//           res.body.should.be.a("object");
//           res.body.should.have.property("error");
//           done();
//         });
//     });
//     it("it should create new PO", (done) => {
//       let details = {
//         PO_Id: "VBERP-34",
//         Employee_Id: "VBEMP-45",
//         Employee_Name: "Yusuf Shekh",
//         Allocation_Rate: 70,
//         Start_Date: "04/24/2021",
//         End_Date: "06/12/2021",
//       };
//       const assigned = new assignee(details);
//       assigned.save((err, data) => {
//         chai
//           .request(server)
//           .post("/assign")
//           .send(details)
//           .end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.be.a("object");
//             res.body.should.have.property("PO_Id");
//             res.body.should.have.property("Employee_Id");
//             res.body.should.have.property("Employee_Name");
//             res.body.should.have.property("Allocation_Rate");
//             res.body.should.have.property("Start_Date");
//             res.body.should.have.property("End_Date");
//             done();
//           });
//       });
//     });
//   });

//   describe("/GET Assigned Employee of that Project", () => {
//     it("it should throw Query validation error", (done) => {
//       chai
//         .request(server)
//         .get("/assign/VBERP-34")
//         .query({
//           page: -1,
//           limit: 0,
//         })
//         .end((err, res) => {
//           res.should.have.status(422);
//           res.body.should.be.a("object");
//           res.body.should.have.property("error");
//           done();
//         });
//     });

//     it("it should return all assigned employee based on given Project ID", (done) => {
//       chai
//         .request(server)
//         .get("/assign/VBERP-34")
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.data.results.should.be.a("array");
//           res.body.data.results.length.should.be.above(0);
//           done();
//         });
//     });
//   });

//   describe("/Update employee details", () => {
//     it("it should throw validation error", (done) => {
//       let data = new assignee({
//         Employee_Name: "Yusuf Shekh",
//         Allocation_Rate: 70,
//         Start_Date: "04/24/2021",
//         End_Date: "06/12/2021",
//       });
//       chai
//         .request(server)
//         .patch("/assign/VBEMP-45")
//         .send(data)
//         .end((err, res) => {
//           res.should.have.status(422);
//           res.body.should.be.a("object");
//           res.body.should.have.property("error");
//           done();
//         });
//     });
//     it("it should UPDATE employee details of given id", (done) => {
//       let user = new assignee({
//         first_name: "Amit",
//         last_name: "Kumar",
//         email: "amit@gmail.com",
//         role: "staff",
//       });
//       user.save((err, user) => {
//         chai
//           .request(server)
//           .patch("/assign/VBEMP-45")
//           .send({
//             PO_Id: "VBERP-34",
//             Employee_Id: "VBEMP-45",
//             Employee_Name: "Yusuf Shekh",
//             Allocation_Rate: 80,
//             Start_Date: "03/24/2021",
//             End_Date: "05/12/2021",
//           })
//           .end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.be.a("object");
//             res.body.should.have
//               .property("message")
//               .eql("Details successfully updated!");
//             done();
//           });
//       });
//     });
//   });

//   describe("/Unassign Employee from project", () => {
//     it("it should Unassign employee based on given Employee ID", (done) => {
//       chai
//         .request(server)
//         .patch("/assign/unassign/VBERP-34")
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a("object");
//           res.body.should.have
//             .property("message")
//             .eql("Employee successfully unassigned!");
//           done();
//         });
//     });
//   });
// });
