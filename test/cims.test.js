let chai = require("chai");
let chaiHttp = require("chai-http");
const { after } = require("lodash");
let server = require("../src/app");
let should = chai.should();
chai.use(chaiHttp);
require("dotenv").config();
let compModal = require("../src/modules/clients/model");

let defaultUser = {
    email: "rahul@valuebound.com",
    password: "qwerty123",
    idToken: " ",
  };
let token;
let createdId;
describe("CIMS unit testing with Mocha..!!", () => {
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
      // after(
      //   "its execute after all test cases and delete created new client data",
      //   (done) => {
      //   compModal.deleteOne({legalName: "TestCaseClient"}).exec();
      // done();
      // });
  describe("/Get all the CIMS records", () => {
    it("It should return Data fetched successfully", (done) => {
      chai
        .request(server)
        .get("/api/cims")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.data.should.be.a("array");
          //   res.body.data.data.length.should.be.eql(5)
          res.body.should.have
            .property("message")
            .eq("Data fetched successfully");
          done();
        });
    });
  });

  describe("/Post CIMS record", () => {
    // it("It should send Data created successfully", (done) => {
    //   let data = {
    //     legalName: "TestCaseClient",
    //     brandName: "testing",
    //     domain: "Manufacturing",
    //     gstNumber: "22AABCU9603R1ZX",
    //     panNumber: "",
    //     companyType: "GST Registered",
    //     registeredAddress: {
    //         addressLine1: "#1",
    //         addressLine2: "",
    //         pincode: "560102",
    //         country: "India-in",
    //         state: "Karnataka",
    //         district: "Bengaluru",
    //         area: "HSR Layout",
    //         landmark: ""
    //     },
    //     communicationAddress: {
    //         addressLine1: "#1",
    //         addressLine2: "",
    //         pincode: "560102",
    //         country: "India-in",
    //         state: "Karnataka",
    //         district: "Bengaluru",
    //         area: "HSR Layout",
    //         landmark: ""
    //     },
    //     contacts: {
    //         primaryContact: {
    //             designation: "Manager",
    //             firstName: "Ram",
    //             lastName: "G",
    //             email: "myedutech@gmail.com",
    //             contactNumber: "91999911111",
    //             otherContactNumber: "91999911111"
    //         },
    //         secondaryContact: {
    //             designation: "CEO",
    //             firstName: "Jai",
    //             lastName: "J",
    //             email: "Jay@gmail.com",
    //             contactNumber: "919196969696",
    //             otherContactNumber: "919196969696"
    //         },
    //         tertiaryContact: {
    //             designation: "",
    //             firstName: "",
    //             lastName: "",
    //             email: "",
    //             contactNumber: "",
    //             otherContactNumber: ""
    //         }
    //     }
    // };
    //   chai
    //     .request(server)
    //     .post("/api/cims")
    //     .set("Authorization", token)
    //     .send(data)
    //     .end((err, res) => {
    //         createdId=res.body._id;
    //       res.should.have.status(201);
    //       res.body.should.be.a("object");
    //       //   res.body.should.have
    //       //     .property("message")
    //       //     .eq("Data fetched successfully");
    //       done();
    //     });
    // });

    it("It should send Invalid request data", (done) => {
      let data = {
        legalName: "TestCase",
        brandName: "testing",
        domain: "Manufacturing",
        gstNumber: "22AABCU9603R1ZX",
        panNumber: "",
        companyType: "GST Registered",
        registeredAddress: {
            addressLine1: "#1",
            addressLine2: "",
            pincode: "560102",
            country: "India-in",
            state: "Karnataka",
            district: "Bengaluru",
            area: "HSR Layout",
            landmark: ""
        },
        communicationAddress: {
            addressLine1: "#1",
            addressLine2: "",
            pincode: "560102",
            country: "India-in",
            state: "Karnataka",
            district: "Bengaluru",
            area: "HSR Layout",
            landmark: ""
        },
        contacts: {
            primaryContact: {
                designation: "Manager",
                firstName: "Ram",
                lastName: "G",
                email: "myedutech@gmail.com",
                contactNumber: "91999911111",
                otherContactNumber: "91999911111"
            },
            secondaryContact: {
                designation: "CEO",
                firstName: "Jai",
                lastName: "J",
                email: "Jay@gmail.com",
                contactNumber: "919196969696",
                otherContactNumber: "919196969696"
            },
            tertiaryContact: {
                designation: "",
                firstName: "",
                lastName: "",
                email: "",
                contactNumber: "",
                otherContactNumber: ""
            }
        }
    };
      chai
        .request(server)
        .post("/api/cims")
        .set("Authorization", token)
        .send(data)
        .end((err, res) => {
        //   res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("code").eq(422);
        //   res.body.should.have.property("message").eq("Invalid request data");
          done();
        });
    });
  });

  describe("/Update a CIMS record", () => {
    it("It should update the values of a CIMS record", (done) => {
      let recordupdate = {
        legalName: "TestCase",
        brandName: "testing",
        domain: "Manufacturing",
        gstNumber: "22AABCU9603R1ZX",
        panNumber: "",
        companyType: "GST Registered",
        registeredAddress: {
            addressLine1: "#1",
            addressLine2: "",
            pincode: "560102",
            country: "India-in",
            state: "Karnataka",
            district: "Bengaluru",
            area: "HSR Layout",
            landmark: ""
        },
        communicationAddress: {
            addressLine1: "#1",
            addressLine2: "",
            pincode: "560102",
            country: "India-in",
            state: "Karnataka",
            district: "Bengaluru",
            area: "HSR Layout",
            landmark: ""
        },
        contacts: {
            primaryContact: {
                designation: "Manager",
                firstName: "Ram",
                lastName: "G",
                email: "myedutech@gmail.com",
                contactNumber: "91999911111",
                otherContactNumber: "91999911111"
            },
            secondaryContact: {
                designation: "Manager",
                firstName: "Jai",
                lastName: "J",
                email: "Jay@gmail.com",
                contactNumber: "919196969696",
                otherContactNumber: "919196969696"
            },
            tertiaryContact: {
                designation: "",
                firstName: "",
                lastName: "",
                email: "",
                contactNumber: "",
                otherContactNumber: ""
            }
        }
    };
      chai
        .request(server)
        .put("/api/cims")
        .set("Authorization", token)
        .send(recordupdate)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("/Get location API should send State, Districts and Postal locations accoring to the Pincode and Country passed", () => {
    it("It should send Data fetched successfully", (done) => {
      chai
        .request(server)
        .get("/api/location")
        .set({Authorization: token,
          pincode: "110093",
          country: "in",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("message")
            .eq("Data fetched successfully");
          done();
        });
    });

    it("It should send Invalid request data", (done) => {
      chai
        .request(server)
        .get("/api/location")
        .set({Authorization: token,
          pincode: "1100933",
          country: "in",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("code").eq(400);
          done();
        });
    });

    it("It should send the pincode doesnt exist", (done) => {
      chai
        .request(server)
        .get("/api/location")
        .set("Authorization", token,{
          pincode: 1100932,
          country: "in",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("code").eq(400);
          res.body.should.have
            .property("message")
            .eq("The pincode doesnt exist");
          done();
        });
    });
  });

  describe("/Get Countries should send names of Countries for the Frontend dropdown", () => {
    it("It should send Data fetched successfully", (done) => {
      chai
        .request(server)
        .get("/api/countries")
        .set("Authorization", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("message")
            .eq("Data fetched successfully");
          done();
        });
    });
  });
});
