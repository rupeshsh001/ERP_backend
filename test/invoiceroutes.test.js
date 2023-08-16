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
let invoiceId = "6308a6afab2ea6f433f7ed267";
describe("/invoice unit tests", () => {
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
      it("it should fetch invoices sort by projectName", (done) => {
        chai
          .request(app)
          .get(`/api/invoice/sort/projectName/`)
          .query({keyword: "",page: 1, limit: 50})
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(constant.HTTP_200_CODE);
            res.body.should.be.a("object");
            res.body.should.have.property("status");
            res.body.data.results.should.be.a("array");
            done();
          });
      });
      it("it should fetch account details", (done) => {
        chai
          .request(app)
          .get(`/api/invoice/account`)
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(constant.HTTP_200_CODE);
            res.body.should.be.a("object");
            res.body.should.have.property("status");
            res.body.data.should.be.a("array");
            done();
          });
      });
      it("it should give an error with invalid id", (done) => {
        chai
          .request(app)
          .get(`/api/invoice/`+{invoiceId})
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(constant.HTTP_404_CODE);
            res.body.should.be.a("object");
            res.body.should.have.property("status");
            done();
          });
      });
});