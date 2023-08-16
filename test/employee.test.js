// const chai = require("chai");
// const chaiHttp = require("chai-http");
// let server = require("../src/app");
// chai.should();
// chai.use(chaiHttp);

// describe("employees apis", () => {
//   describe("/GET employees", () => {
//     it("It should get all the employees", (done) => {
//       chai
//         .request(server)
//         .get("/api/employees/reward/employee")
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.data.should.be.a("array");
//           res.body.data.length.should.be.above(0);
//           done();
//         });
//     });
//     it("It gives all employees with filtering", (done) => {
//       chai
//         .request(server)
//         .get("/api/employees/reward/employee")
//         .query({ empId: "VB001" })
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a("object");
//           res.body.data.should.be.a("array");
//           done();
//         });
//     });
//     it("It gives all employees reporting managers list", (done) => {
//       chai
//         .request(server)
//         .get("/api/employees/reward/employee")
//         .query({ empDes: "Manager" })
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a("object");
//           res.body.data.should.be.a("array");
//           done();
//         });
//     });
//     it("It gives all employees with filtering", (done) => {
//       chai
//         .request(server)
//         .get("/api/employees/reward/employee")
//         .query({
//           dob: "",
//           workAnniversary: "",
//           getEmpByID: "VB001",
//           empUnderManager: "",
//           managerDetail: "",
//         })
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a("object");
//           res.body.data.should.be.a("array");
//           done();
//         });
//     });
//   });

//   describe("get /search", () => {
//     it("It search and give employees if any matches found ", (done) => {
//       chai
//         .request(server)
//         .get("/api/employees/rewars/employeesearch")
//         .query({ search: "a" })
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a("object");
//           res.body.data.should.be.a("array");
//           res.body.data.length.should.be.above(0);
//           done();
//         });
//     });
//     it("It search and give when no matches found ", (done) => {
//       chai
//         .request(server)
//         .get("/api/employees/rewars/employeesearch")
//         .query({ search: "abcxyz" })
//         .end((err, res) => {
//           res.should.have.status(400);
//           res.body.should.be.a("object");
//           res.body.should.have
//             .property("message")
//             .eql("Bad Request, No rewards found");
//           done();
//         });
//     });
//     it("It gives all data", (done) => {
//       chai
//         .request(server)
//         .get("/api/employees/rewars/employeesearch")
//         .query()
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a("object");
//           res.body.data.should.be.a("array");
//           done();
//         });
//     });
//     it("It gives an internal server error", (done) => {
//       chai
//         .request(server)
//         .get("/api/employees/rewars/employeesearch")
//         .query({ name: "ann" })
//         .end((err, res) => {
//           res.should.have.status(500);
//           res.body.should.be.a("object");
//           res.body.should.have.property("message").eql("Internal Server Error");
//           done();
//         });
//     });
//   });
// });
