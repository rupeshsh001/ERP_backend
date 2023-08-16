const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const app = require("../src/app");
chai.use(chaiHttp);
const purchaseOrderModel = require("../src/modules/posow/model");
const Invoice = require("../src/modules/invoice/model");

let defaultUser = {
    email: "rahul@valuebound.com",
    password: "qwerty123",
    idToken: " ",
  };
let token;

describe("/posow unit tests", () => {
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
  it("it should fetch all data from posow collection", (done) => {
    chai
      .request(app)
      .get(`/api/posow/details`)
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_200_CODE);
        res.body.should.be.a("object");
        res.body.should.have.property("status");
        done();
      });
  });
  it("it should fetch all posow deatails in sort id", (done) => {
    chai
      .request(app)
      .get(`/api/posow/sort/Id/?keyword=&page=1&limit=50`)
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_200_CODE);
        res.body.should.be.a("object");
        res.body.should.have.property("status");
        done();
      });
  });
  it("it should fetch all posow clients", (done) => {
    chai
      .request(app)
      .get(`/api/posow/clients`)
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_200_CODE);
        res.body.should.be.a("object");
        res.body.should.have.property("status");
        res.body.data.should.be.a("array");
        done();
      });
  });
  it("it should get a posow client detail", (done) => {
    chai
      .request(app)
      .get(`/api/posow/clients/KITS`)
      .set("Authorization", token)
      .send()
      .end((err, res) => {
        res.should.have.status(constant.HTTP_200_CODE);
        res.body.should.be.a("object");
        res.body.should.have.property("status");
        done();
      });
  });
it("it should fetch posow detail by id", (done) => {
    chai
      .request(app)
      .get(`/api/posow/6308c5c7ab2ea6f433f81062`)
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_200_CODE);
        res.body.should.be.a("object");
        res.body.should.have.property("status");
        done();
      });
  });
});

