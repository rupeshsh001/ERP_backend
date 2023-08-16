require("dotenv").config();
const app = require("../src/app");
const mongoose = require("mongoose");
const { Employee } = require("../src/modules/employee/model");
const jwt = require("jsonwebtoken");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const should = chai.should();
const constant = require("../src/constants/constant");

let defaultUser = {
    email: "rahul@valuebound.com",
    password: "qwerty123",
    idToken: " ",
  };
let token;

describe("Employee API tests", () => {
    beforeEach(done => {
        chai
          .request(app)
          .post("/api/login")
          .send(defaultUser)
          .end((err, res) => {
            token = res.body.data.token;
            res.should.have.status(constant.HTTP_200_CODE);
            done();
          });
      });
  after(
    "its execute after all test cases and delete all created test",
    (done) => {
      Employee.deleteMany({ name: "rohan test" }).exec();
      done();
    }
  );
  let orgEmpId;

  describe("Get/api employees from collection", () => {
    it("user can get all/api employees using GET API", (done) => {
      chai
        .request(app)
        .get("/api/employees")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.should.be.a("object");
          res.body.status.should.equal("success");
          res.body.data.should.be.a("array");
          done();
        });
    });
  });

  describe("POST new employee ", () => {
    it("Creates a new employee and stores the document in the database", (done) => {
      const newEmployee = {
        name: "rohan test",
        email: "rohantest22@email.com",
        doj: "12/12/21",
        department: "HR",
        designation: "HR",
        ctc: 100000,
        managerId: "ManagerName12",
        personalEmail: "rohan_personal@email.com",
        primaryNo: "7845652365",
        secondaryNo: "7845652365",
        emergencyNo: "7845652365",
        dob: "10/10/1998",
        aboutMe: "About me goes here",
        graduation: "College name",
      };
      chai
        .request(app)
        .post(`/api/employees/`)
        .set("Authorization", token)
        .send(newEmployee)
        .end((err, res) => {
          orgEmpId = res.body.data._id;
          res.should.have.status(constant.HTTP_201_CODE);
          res.should.be.a("object");
          res.body.status.should.equal("success");
          res.body.data.should.be.a("object");
          done();
        });
    });
  });

  describe("Get employee details by using _id", () => {
    it("Returns employee details using _id", (done) => {
      chai
        .request(app)
        .get(`/api/employees/${orgEmpId}`)
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.should.be.a("object");
          res.body.status.should.equal("success");
          res.body.data.should.be.a("object");
          done();
        });
    });
  });

  describe("PATCH an employee", () => {
    it("Updates an employee using _id", (done) => {
      const data = {
        certifications: ["Aws", "Azure"],
        skillSet: ["Backend", "Dev Ops"],
      };

      chai
        .request(app)
        .patch(`/api/employees/${orgEmpId}`)
        .set("Authorization", token)
        .send(data)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.should.be.a("object");
          res.body.status.should.equal("success");
          res.body.data.should.be.a("object");
          done();
        });
    });
  });

  describe("DELETE an employee", () => {
    it("Deletes an employee using _id", (done) => {
      chai
        .request(app)
        .delete(`/api/employees/${orgEmpId}`)
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.should.be.a("object");
          done();
        });
    });
  });
  after(async () => {
    console.log("end of tests");
  });
});
