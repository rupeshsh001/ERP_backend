/*#swagger.tags = ['Employee']
    #swagger.description = 'Create new Employee'
    #swagger.responses[200] = {
          description: 'Get Employee By id successful.',
          schema: { 
            "status": "success",
      "code": 200,
      "message": "success",
      "data": {
          "empId": "VB002",
          "empName": "name2",
          "empEmail": "name2@email.com",
          "empPersonalEmail": "name2@email.com",
          "empPhoneNumber": "898100684645",
          "empDoj": "1990-11-09T18:30:00.000Z",
          "empDob": "2019-12-31T18:30:00.000Z",
          "empDepartment": "Development",
          "empDesignation": "Developer Relations",
          "empReportingManager": "Gautam",
          "empConnections": 0,
          "empHobbies": [
              "Cricket",
              "Movies"
          ],
          "empAboutMe": "Tech Enthusiast",
          "empCurrentAddress": "",
          "empResidentialAddress": "",
          "empBand": "90",
          "empCtc": 600000,
          "empGraduation": "College_name_goes_here",
          "empGraduationUniversity": "",
          "empPostGraduation": "",
          "empPostGraduationUniversity": "",
          "empPrimaryCapability": [],
          "empSkillSet": [],
          "empCertifications": [
              "AWS",
              "Scrum"
          ],
          "role": "LEADERSHIP",
          "slackMemId": "",
          "createdAt": "2021-12-14T10:45:15.026Z",
          "updatedAt": "2021-12-14T10:45:15.035Z",
          "count": 2,
            },
            "error": {}
          }
        }*/

/* 	#swagger.tags = ['Employee']
        #swagger.description = 'Get All Employees from database' 
        #swagger.parameters['page'] = {
          in: 'query',
          type: 'integer',
          description: 'Page number' 
        }
        #swagger.parameters['limit'] = {
          in: 'query',
          type: 'integer',
          description: 'Data limit per page' 
        }
        #swagger.responses[200] = {
          schema:{
            "status": "success",
            "code": 200,
            "message": "success",
            "data": [
               {
              "empId": "VB002",
              "empName": "name2",
              "empEmail": "name2@email.com",
              "empPersonalEmail": "name2@email.com",
              "empPhoneNumber": "898100684645",
              "empDoj": "1990-11-09T18:30:00.000Z",
              "empDob": "2019-12-31T18:30:00.000Z",
              "empDepartment": "Development",
              "empDesignation": "Developer Relations",
              "empReportingManager": "Gautam",
              "empConnections": 0,
              "empHobbies": [
                  "Cricket",
                  "Movies"
              ],
              "empAboutMe": "Tech Enthusiast",
              "empCurrentAddress": "",
              "empResidentialAddress": "",
              "empBand": "90",
              "empCtc": 600000,
              "empGraduation": "College_name_goes_here",
              "empGraduationUniversity": "",
              "empPostGraduation": "",
              "empPostGraduationUniversity": "",
              "empPrimaryCapability": [],
              "empSkillSet": [],
              "empCertifications": [
                  "AWS",
                  "Scrum"
              ],
              "role": "LEADERSHIP",
              "slackMemId": "",
              "createdAt": "2021-12-14T10:45:15.026Z",
              "updatedAt": "2021-12-14T10:45:15.035Z",
              "count": 2,
          },
          {
              "empId": "VB003",
              "empName": "name3",
              "empEmail": "name3@email.com",
              "empPersonalEmail": "name3@email.com",
              "empPhoneNumber": "8984645",
              "empDoj": "1990-11-09T18:30:00.000Z",
              "empDob": "2019-12-31T18:30:00.000Z",
              "empDepartment": "Development",
              "empDesignation": "Developer Relations",
              "empReportingManager": "Gautam",
              "empConnections": 0,
              "empHobbies": [
                  "Cricket",
                  "Movies"
              ],
              "empAboutMe": "Tech Enthusiast",
              "empCurrentAddress": "",
              "empResidentialAddress": "",
              "empBand": "90",
              "empCtc": 600000,
              "empGraduation": "College_name_goes_here",
              "empGraduationUniversity": "",
              "empPostGraduation": "",
              "empPostGraduationUniversity": "",
              "empPrimaryCapability": [],
              "empSkillSet": [],
              "empCertifications": [
                  "AWS",
                  "Scrum"
              ],
              "role": "LEADERSHIP",
              "slackMemId": "",
              "createdAt": "2021-12-14T11:08:22.017Z",
              "updatedAt": "2021-12-14T11:08:22.046Z",
              "count": 3,
          }
            ],
            "error": {}
          }
        }
    */

/*#swagger.tags = ['Employee']
    #swagger.description = 'Create new Employee'
        #swagger.parameters['obj'] = {
          in: 'body',
          schema: {
            $empName: "name3",
            $empEmail: "name3@email.com",
            $empDoj: "11/10/90",
            $empDepartment: "Development",
            $empDesignation: "Developer Relations",
            $empBand: "90",
            $empCtc: 600000,
            $empReportingManager: "Gautam",
            $empPersonalEmail: "name3@email.com",
            $empPhoneNumber: "8984645",
            $empDob: "1/1/20",
            $empGraduation:"College_name_goes_here",
            $empAboutMe: "Tech Enthusiast",
            $empHobbies: [ "Cricket", "Movies" ],
            $empPrimaryCapability: [],
            $empSkillSet: [],
            $empCertifications: [ "AWS", "Scrum" ],
            $role: "LEADERSHIP"
          }
        }
        #swagger.responses[201] = {
          description: 'Employee created successfully.',
          schema: { 
            "status": "success",
      "code": 201,
      "message": "success",
      "data": {
          "empId": "",
          "empName": "name3",
          "empEmail": "name3@email.com",
          "empPersonalEmail": "name3@email.com",
          "empPhoneNumber": "8984645",
          "empDoj": "1990-11-09T18:30:00.000Z",
          "empDob": "2019-12-31T18:30:00.000Z",
          "empDepartment": "Development",
          "empDesignation": "Developer Relations",
          "empReportingManager": "Gautam",
          "empConnections": 0,
          "empHobbies": [
              "Cricket",
              "Movies"
          ],
          "empAboutMe": "Tech Enthusiast",
          "empCurrentAddress": "",
          "empResidentialAddress": "",
          "empBand": "90",
          "empCtc": 600000,
          "empGraduation": "College_name_goes_here",
          "empGraduationUniversity": "",
          "empPostGraduation": "",
          "empPostGraduationUniversity": "",
          "empPrimaryCapability": [],
          "empSkillSet": [],
          "empCertifications": [
              "AWS",
              "Scrum"
          ],
          "role": "LEADERSHIP",
          "slackMemId": "",
          "createdAt": "2021-12-14T11:08:22.017Z",
          "updatedAt": "2021-12-14T11:08:22.017Z",
          "count": 3
            },
            "error": {}
          }
        }*/

/*#swagger.tags = ['Employee']
    #swagger.description = 'Update Employee'
        #swagger.parameters['obj'] = {
          in: 'body',
          schema: {
            $role:"USER",
            $empGraduation:"College Name",
            $empEmail:"user2@email.com",
            $empPrimaryCapability:["Frontend","Git"]
          }
        }
        #swagger.responses[200] = {
          description: 'Employee updated successfully.',
          schema: { 
            "status": "success",
      "code": 200,
      "message": "success",
      "data": {
        "empId": "VB002",
          "empName": "name2",
          "empEmail": "user2@email.com",
          "empPersonalEmail": "name2@email.com",
          "empPhoneNumber": "898100684645",
          "empDoj": "1990-11-09T18:30:00.000Z",
          "empDob": "2019-12-31T18:30:00.000Z",
          "empDepartment": "Development",
          "empDesignation": "Developer Relations",
          "empReportingManager": "Gautam",
          "empConnections": 0,
          "empHobbies": [
              "Cricket",
              "Movies"
          ],
          "empAboutMe": "Tech Enthusiast",
          "empCurrentAddress": "",
          "empResidentialAddress": "",
          "empBand": "90",
          "empCtc": 600000,
          "empGraduation": "College Name",
          "empGraduationUniversity": "",
          "empPostGraduation": "",
          "empPostGraduationUniversity": "",
          "empPrimaryCapability": [
              "Frontend",
              "Git"
          ],
          "empSkillSet": [],
          "empCertifications": [
              "AWS",
              "Scrum"
          ],
          "role": "USER",
          "slackMemId": "",
          "createdAt": "2021-12-14T10:45:15.026Z",
          "updatedAt": "2021-12-16T04:10:14.205Z",
          "count": 2,
            },
            "error": {}
          }
        }*/

/*#swagger.tags = ['Employee']
    #swagger.description = 'Delete Employee'
        #swagger.responses[200] = {
          description: 'Employee deleted successfully.',
          schema: { 
            "status": "",
      "code": 204,
      "message": "",
      "data": {        
            },
            "error": {}
          }
        }*/

/* 	
    #swagger.tags = ['Employee']
    #swagger.description = 'Search Employees' 
    #swagger.parameters['search'] = {
      in: 'query',
      type: 'string',
      description: 'Employee name which you want to search' 
    }
    #swagger.responses[200] = {
      schema:{
        "status": "success",
        "code": 200,
        "message": "",
        "data":  {
          "_id": "610bc1b31b82a66f6bcd64ea",
          "empName": "name of employee"  
        },
        "error": {}
      }
    }
    #swagger.responses[400] = {
    description: 'Bad request',
    schema: { 
      "status": "failure",
      "code": 400,
      "message": "Bad request",
      "data":{},
      "error": {}
      }
    }
    #swagger.responses[500] = {
    description: 'Internal Server Error',
    schema: { 
      "status": "failure",
      "code": 400,
      "message": "Internal Server Error",
      "data":{},
      "error": {}
      }
    }
*/
