let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../src/app");
chai.use(chaiHttp);
chai.should();
require("dotenv").config();
let dropdownModel = require("../src/modules/dropDown/model");
const constant = require("../src/constants/constant");

let defaultUser = {
    email: "rahul@valuebound.com",
    password: "qwerty123",
    idToken: " ",
  };
let token;

describe("dropdown/configuration management testing", () => {
    before(done => {
        chai
          .request(server)
          .post("/api/login")
          .send(defaultUser)
          .end((err, res) => {
            token = res.body.data.token;
            res.should.have.status(constant.HTTP_200_CODE);
            done();
          });
      });
  it("It should fetch all the dropdowns", (done) => {
    chai
      .request(server)
      .get("/api/dropdowns")
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_200_CODE);
        res.body.data.should.be.a("array");
        done();
      });
  });

  it("It should fail to fetch all the dropdowns", (done) => {
    chai
      .request(server)
      .get("/api/dropdown")
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_404_CODE);
        done();
      });
  });

  it("It should fetch all the active dropdowns", (done) => {
    chai
      .request(server)
      .get("/api/dropdowns")
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_200_CODE);
        res.body.data.should.be.a("array");
        done();
      });
  });

  it("It should fail to fetch all the active dropdowns", (done) => {
    chai
      .request(server)
      .get("/api/dropdown")
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_404_CODE);
        done();
      });
  });

  it("It should fetch dropdown by id", (done) => {
    chai
      .request(server)
      .get("/api/dropdowns/6237760595af65082db7f8d6")
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_200_CODE);
        res.body.data.should.be.a("object");
        done();
      });
  });

  it("It should fail to fetch dropdown by id", (done) => {
    chai
      .request(server)
      .get("/api/dropdown/620cf75f2fb7a3bd70ae3cf9")
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_404_CODE);
        done();
      });
  });
});
