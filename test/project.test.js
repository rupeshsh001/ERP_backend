const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const app = require("../src/app");
const projects = require("../src/modules/projects/model");
chai.use(chaiHttp);
const constant = require("../src/constants/constant");

let defaultUser = {
    email: "rahul@valuebound.com",
    password: "qwerty123",
    idToken: " ",
  };
let token;
  
describe("PMO Projects Unit Testing with Mocha..!!", () => {
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
  after(
    "its execute after all test cases and delete all created test",
    (done) => {
      projects.deleteMany({ clientName: "testCase" }).exec();
      done();
    }
  );
  //testing for POST request
  let id;
  describe("POST /projects", () => {
    it("Creating project", (done) => {
      let project = {
        clientId: "vb-cl-01",
        clientName: "testCase",
        projectName: "PMO-1",
        clientProjectManager: "M1",
        startDate: "2021-11-20",
        endDate: "2021-11-28",
        clientProjectSponsor: "cS-1",
        clientFinanceController: "cF-1",
        clientPrimaryContact: "1234567890",
        clientPrimaryContactName:"Amit  Kumar",
        vbProjectManager: "VB-Mn",
        domainSector: "Backend APIs",
        vbProjectStatus: "Active",
      };
      chai
        .request(app)
        .post("/api/projects")
        .set("Authorization", token)
        .send(project)
        .end((err, res) => {
          id = res.body._id;
          res.should.have.status(constant.HTTP_201_CODE);
          res.body.should.be.a("object");
          res.body.data.should.have.property("clientName");
          res.body.data.should.have.property("projectName");
          res.body.data.should.have.property("clientProjectManager");
          res.body.data.should.have.property("startDate");
          res.body.data.should.have.property("endDate");
          res.body.data.should.have.property("clientProjectSponsor");
          res.body.data.should.have.property("clientFinanceController");
          res.body.data.should.have.property("clientPrimaryContact");
          res.body.data.should.have.property("domainSector");
          res.body.data.should.have.property("vbProjectStatus");
          res.body.data.should.have.property("vbProjectManager");
          done();
        });
    });
  });
  // testing for GET active projects request
  describe("GET /projects?status=active", () => {
    it("Get active projects", (done) => {
      chai
        .request(app)
        .get("/api/projects?status=Active")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.body.should.be.a("object");
          done();
        });
    });
  });
  // testing for GET active project filtering by any field
  describe("GET /projects?status=Active&fieldName={query}", () => {
    it("Get active project with field name", (done) => {
      chai
        .request(app)
        .get("/api/projects?status=Active&clientName=Atif")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.body.should.be.a("object");
          done();
        });
    });
  });
  // testing for GET active sorted project by any field
  describe("GET /projects?status=Active&fieldName=clientName", () => {
    it("Get projects with clientname", (done) => {
      chai
        .request(app)
        .get("/api/projects?status=Active&fieldName=clientName")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.body.should.be.a("object");
          done();
        });
    });
  });
  // testing for GET done projects request
  describe("GET /projects?status=Done", () => {
    it("Get project status-done", (done) => {
      chai
        .request(app)
        .get("/api/projects?status=Done")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.body.should.be.a("object");
          done();
        });
    });
  });
  // testing for GET done project filtering by any field
  describe("GET /projects?status=Active&fieldName={query}", () => {
    it("Returns status(200)", (done) => {
      chai
        .request(app)
        .get("/api/projects?status=Active&clientName=testCase")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.body.should.be.a("object");
          done();
        });
    });
  });
  // testing for GET done sorted project by any field
  describe("GET /projects?status=Done&fieldName=query", () => {
    it("Returns status(200)", (done) => {
      chai
        .request(app)
        .get("/api/projects?status=Done&fieldName=clientName")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.body.should.be.a("object");
          done();
        });
    });
  });
  //Testing for Update by ID
  describe("PUT /projects/:id", () => {
    it("it should UPDATE a resources given the id", (done) => {
      chai
        .request(app)
        .put("/api/projects/" + id)
        .set("Authorization", token)
        .send({
          clientId: "vb-cl-01",
          clientName: "testCase",
          projectName: "PMO-1",
          clientProjectManager: "M1",
          startDate: "2021-11-20",
          endDate: "2021-11-28",
          clientProjectSponsor: "cS-1",
          clientFinanceController: "cF-1",
          clientPrimaryContact: 1234567890,
          vbProjectManager: "VB-Mn",
          domainSector: "Backend APIs",
          vbProjectStatus: "Done",
        })
        .end((err, res) => {
          res.should.have.status(constant.HTTP_200_CODE);
          res.body.should.be.a("object");
          done();
        });
    });
  });
});
