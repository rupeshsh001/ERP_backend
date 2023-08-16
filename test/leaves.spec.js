const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const app = require("../src/app");
chai.use(chaiHttp);

let defaultUser = {
    email: "rahul@valuebound.com",
    password: "qwerty123",
    idToken: " ",
  };
let token;
let leaveTypeId;
describe("/leaves unit tests", () => {
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
  it("it should fetch leaves under review", (done) => {
    chai
      .request(app)
      .get(`/api/leaves/review`)
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_200_CODE);
        res.body.should.be.a("object");
        res.body.should.have.property("status");
        res.body.data.should.be.a("array");
        done();
      });
  });
  it("it should fetch leave records", (done) => {
    chai
      .request(app)
      .get(`/api/leaves/records`)
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_200_CODE);
        res.body.should.be.a("object");
        res.body.should.have.property("status");
        done();
      });
  });
  it("it should fetch all leave types", (done) => {
    chai
      .request(app)
      .get(`/api/leaves/type`)
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_200_CODE);
        res.body.should.be.a("object");
        res.body.should.have.property("status");
        done();
      });
  });
  it("it should create a leave type", (done) => {
    let newLeave = {
        creditInterval: "yearly",
        lapsedCondition: "all-leaves",
        name: "Annual",
        quota: "1",
    }
    chai
      .request(app)
      .post(`/api/leaves/type`)
      .set("Authorization", token)
      .send(newLeave)
      .end((err, res) => {
        leaveTypeId = res.body.data._id
        res.should.have.status(constant.HTTP_201_CODE);
        res.body.should.be.a("object");
        res.body.should.have.property("status");
        done();
      });
  });
it("it should update leave type", (done) => {
    let updatedType = {
        name: "Annual",
        quota: "2",
        creditInterval: "yearly",
        lapsedCondition: "all-leaves"
    }
    chai
      .request(app)
      .patch(`/api/leaves/type`)
      .query({id: leaveTypeId})
      .set("Authorization", token)
      .send(updatedType)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_200_CODE);
        res.body.should.be.a("object");
        res.body.should.have.property("status");
        done();
      });
  });
  it("it should delete leave type", (done) => {
    chai
      .request(app)
      .delete(`/api/leaves/type`)
      .query({id: leaveTypeId})
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_200_CODE);
        res.body.should.be.a("object");
        res.body.should.have.property("status");
        done();
      });
  });
});

