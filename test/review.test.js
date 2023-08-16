let mongoose = require("mongoose");
let reviews = require("../src/modules/reviews/model");
let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
const app = require("../src/app");
chai.use(chaiHttp);
const constant = require("../src/constants/constant");

let defaultUser = {
    email: "rahul@valuebound.com",
    password: "qwerty123",
    idToken: " ",
  };
let token;

//testing for get method
describe("/GET reviews", () => {
    before(done => {
        chai
          .request(app)
          .post("/api/login")
          .send(defaultUser)
          .end((err, res) => {
            token = res.body.data.token;
            res.should.have.status(200);
            done();
          });
      });
  it("it should fetch all data from myreviews collection", (done) => {
    let review = {
      reqName: "admin",
      reqType: "profile-creation",
      status: "accepted",
      reqId: 15,
      employeeDetails: {
        empName: "alan sajan",
        empEmail: "sajan@mail.com",
        empPersonalEmail: "alan@mail.com",
        empDoj: "2021-11-20",
        empDob: "2021-11-20",
        empDepartment: "sales",
        empDesignation: "marketing",
        empReportingManager: "sunilee",
        empConnections: 10,
        empHobbies: ["Music", "Dance"],
        empAboutMe: "i'm always cool..!",
        empCurrentAddress: "gujrat",
        empResidentialAddress: "gujrat",
        empBand: "12",
        empGraduation: "bba",
        empGraduationUniversity: "du",
        empPostGraduation: "mba",
        empPostGraduationUniversity: "iim",
        empPrimaryCapability: ["Communication"],
        empSkillSet: ["Communication skill"],
        empCertifications: ["Power Bi"],
        role: "employee",
        personalDetails: [],
        professionalDetails: [],
        skillsDetails: [],
      },
    };
    chai
      .request(app)
      .get(`/api/reviews/`)
      .set("Authorization", token)
      .send(review)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_200_CODE);
        res.body.should.be.a("object");
        res.body.should.have.property("status");
        done();
      });
  });
});

describe("/POST reviews", () => {
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
      reviews.deleteMany({ reqName: "testCase" }).exec();
      done();
    }
  );
  it("it should post all data into myreviews collection", (done) => {
    let review = {
        name: "testCase",
        type: "profile-creation",
        status: "pending",
        employeeDetails: {
          name: "al",
          email: "sajn@mail.com",
          doj: "2021-11-20T00:00:00.000Z",
          dob: "2021-11-20T00:00:00.000Z",
          department: "sales",
          designation: "marketing",
          connections: 10,
          hobbies: ["Music", "Dance"],
          managerId: "VB0339",
          ctc: "23",
          personalEmail: "div@gmail.com",
          aboutMe: "i'm always cool..!",
          primaryNo: "7845652365",
          secondaryNo: "7845652365",
          emergencyNo: "7845652365",
          graduation: "bba",
          postGraduation: "mba",
          primaryCapability: ["Communication"],
          skillSet: ["Communication skill"],
          certifications: ["Power Bi"]
        },
    };
    chai
      .request(app)
      .post("/api/reviews")
      .set("Authorization", token)
      .send(review)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_201_CODE);
        res.body.should.be.a("object");
        res.body.should.have.property("status");
        done();
      });
  });
});
