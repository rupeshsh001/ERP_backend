let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../src/app");
chai.should();
chai.use(chaiHttp);
const constant = require("../src/constants/constant");
let User = require("../src/modules/users/model");

let id = [];
let defaultUser = {
    email: "rahul@valuebound.com",
    password: "qwerty123",
    idToken: " ",
  };
let token;
let userId;

describe("User function unit testing with mocha ... ", () => {
    before(done => {
        chai
          .request(server)
          .post("/api/login")
          .send(defaultUser)
          .end((err, res) => {
            token = res.body.data.token;
            res.should.have.status(200);
            done();
          });
      });
  after("its execute after all test cases and delete all user", (done) => {
    User.deleteMany({ firstName: "test" }).exec();
    done();
  });
  describe("/POST User", () => {
    it("it should throw validation error", (done) => {
      let user = {
        firstName: "test",
        lastName: "Kumar",
        role: ["user"],
        password: "hello",
      };
      chai
        .request(server)
        .post("/api/users")
        .set("Authorization", token)
        .send(user)
        .end((err, res) => {
          res.should.have.status(constant.HTTP_422_CODE);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          done();
        });
    });
    it("it should POST a user", (done) => {
      let user = {
        firstName: "test",
        lastName: "Kumar",
        email: "test@gmail.com",
        role: ["user"],
        password: "anything",
      };
      chai
        .request(server)
        .post("/api/users")
        .set("Authorization", token)
        .send(user)
        .end((err, res) => {
          id.push(res.body.data._id);
          res.should.have.status(constant.HTTP_201_CODE);
          res.body.should.be.a("object");
          done();
        });
    });
    describe("/GET Users", () => {
    it("it should GET all the users", (done) => {
        chai
          .request(server)
          .get("/api/users")
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(constant.HTTP_200_CODE);
            res.body.data.results.should.be.a("array");
            res.body.data.results.length.should.be.above(0);
            done();
        });
    });
});
describe("/GET/:id User", () => {
    it("it should GET a user by the given id", (done) => {
        let user = new User({
          firstName: "test",
          lastName: "Kumar",
          email: "akash1@gmail.com",
          role: ["user"],
          password: "kalpanik",
        });
        user.save((err, user) => {
          chai
            .request(server)
            .get("/api/users/" + user.id)
            .set("Authorization", token)
            .send(user)
            .end((err, res) => {
              id.push(user.id);
              res.should.have.status(constant.HTTP_200_CODE);
              res.body.should.be.a("object");
              res.body.data.should.have.property("firstName");
              res.body.data.should.have.property("email");
              res.body.data.should.have.property("role");
              res.body.data.should.have.property("_id").eql(user.id);
              done();
            });
        });
    });
});
    it("it should UPDATE a user given the id", (done) => {
    let user = new User({
      firstName: "test",
      lastName: "Kumar",
      email: "amit3@gmail.com",
      role: ["user"],
      password: "some",
    });
    user.save((err, user) => {
      chai
        .request(server)
        .put("/api/users/" + user.id)
        .set("Authorization", token)
        .send({
          firstName: "test",
          lastName: "sinha",
          email: "amit@gmail.com",
          role: ["admin"],
        })
        .end((err, res) => {
          id.push(user.id);
          res.should.have.status(constant.HTTP_200_CODE);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("user successfully updated!");
          res.body.data.should.have.property("role").eql(["admin"]);
          done();
        });
    });
  });
  it("it should DELETE a user given the id", (done) => {
    let user = new User({
      firstName: "test",
      lastName: "Kumar",
      email: "amit3@gmail.com",
      role: ["staff"],
      password: "somes",
    });
    user.save((err, user) => {
      chai
        .request(server)
        .delete("/api/users/" + user.id)
        .set("Authorization", token)
        .end((err, res) => {
          id.push(user.id);
          res.should.have.status(constant.HTTP_200_CODE);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("user successfully deleted!");
          res.body.should.have.property("data");
          done();
        });
    });
  });
});

describe("/api/login", () => {
    it("it should login a user", (done) => {
      let user = {
        email: "test@gmail.com",
        password: "anything",
        idToken: " ",
      };
      chai
        .request(server)
        .post("/api/login")
        .send(user)
        .end((err, res) => {
          token = res.body.data.token;
          userId = res.body.data._id;
          res.should.have.status(constant.HTTP_200_CODE);
          res.body.should.be.a("object");
          res.body.data.should.have.property("token");
          res.body.data.should.have.property("email");
          res.body.data.should.have.property("roles");
          done();
        });
    });
    it("it should logout a user", (done) => {
        chai
          .request(server)
          .get("/api/logout")
          .set("Authorization", token)
          .end((err, res) => {
            res.should.have.status(constant.HTTP_200_CODE);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eq("User successfully Logout");
            done();
          });
      });
  });
  it("it should validate token", (done) => {
    chai
      .request(server)
      .get("/api/validate-token")
      .set("Authorization", token)
      .end((err, res) => {
        res.should.have.status(constant.HTTP_200_CODE);
        res.body.should.be.a("object");
        res.body.data.should.have.property("token");
        res.body.data.should.have.property("email");
        res.body.data.should.have.property("roles");
        res.body.should.have.property("message").eq("Valid Token");
        done();
      });
  });
//   it("it should set password", (done) => {
//             chai
//               .request(server)
//               .put(`/api/${userId}/password`)
//               .send({ password: "anythingg" })
//               .end((err, res) => {
//                 res.should.have.status(constant.HTTP_200_CODE);
//                 res.body.should.be.a("object");
//                 res.body.should.have
//                   .property("message")
//                   .eq("user successfully updated!");
//                 done();
//               });
//           });
});


