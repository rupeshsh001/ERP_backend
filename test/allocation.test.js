const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const app = require("../src/app");
const constant = require("../src/constants/constant");
const projectEmployeeModel = require("../src/modules/allocations/model");
chai.use(chaiHttp);

let defaultUser = {
  email: "rahul@valuebound.com",
  password: "qwerty123",
  idToken: " ",
};
let token;

describe("PMO Allocations Unit Testing with Mocha..!!", () => {
  before(done => {
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
  // testing for GET  allocation request
  describe("GET /allocation of PMO", () => {
    it("Returns all allocation data", (done) => {
      chai
        .request(app)
        .get("/api/allocations")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.body.should.be.a("object");
          done();
        });
    });
  });
  // testing for GET  allocation pagination request
  describe("GET /allocation?limit=1&page=1 of PMO", () => {
    it("Returns allocation with limit and page 1", (done) => {
      chai
        .request(app)
        .get("/api/allocations?limit=1&page=1 ")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.body.should.be.a("object");
          done();
        });
    });
  });
  // testing for GET  allocation request
  describe("GET /allocation/onbench of PMO", () => {
    it("Returns all onbech", (done) => {
      chai
        .request(app)
        .get("/api/allocations/onbench")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.body.should.be.a("object");
          done();
        });
    });
  });
  // testing for GET  OnBench pagination request
  describe("GET /allocation/onbench?limit=1&page=1 of PMO", () => {
    it("Returns onbench with limit and page", (done) => {
      chai
        .request(app)
        .get("/api/allocations/onbench?limit=1&page=1 ")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.body.should.be.a("object");
          done();
        });
    });
  });
  // testing for GET  OnBench sorting by field request
  describe("GET /allocation/onbench?sort=fieldName of PMO", () => {
    it("Returns allocation onbench with sorting ", (done) => {
      chai
        .request(app)
        .get("/api/allocations/onbench?sort=empId")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.body.should.be.a("object");
          done();
        });
    });
  });
});
