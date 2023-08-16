/* 	#swagger.tags = ['PO/SOW']
      #swagger.description = 'Get PO/SOW Detail' 
      #swagger.responses[200] = {
        schema:{
          "status": "success",
          "code": 200,
          "message": "",
          "data":  {
            "_id": "61a49363c343b8220cff6c08",
            "projectId": '61bb0622bf6c0b45dff12f77',
            "clientName": "Valuebound Solutions",
            "projectName": "ERP System",
            "clientSponser": 'Jai',
            "clientFinanceController": 'Tanmay',
            "targettedResources": {"ABC":"true","DCH":"false"},
            "targetedResAllocationRate": {"ABC":50,"DCH":60},
            "Type": "PO",
            "poNumber": "ERP34",
            "poAmount": 3434,
            "currency": "USD",
            "documentName": "VB_ERP",
            "posowEndDate": "2014-01-22T14:56:59.301Z",
            "remarks": "Created New PO",
            "__v": 0,
            "Created_At": "2021-12-10T05:55:17.961Z"
          },
          "error": {}
        }
      }
  */

/* 	#swagger.tags = ['PO/SOW']
      #swagger.description = 'Get PO/SOW list' 
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
          "message": "",
          "data": {
            "pageCount": 1,
            "totalCount": 1,
            "currentPage": 1,
            "results": [
              {
                "_id": "61a49363c343b8220cff6c08",
                "projectId": '61bb0622bf6c0b45dff12f77',
                "clientName": "Valuebound Solutions",
                "projectName": "ERP System",
                "clientSponser": 'Jai',
                "clientFinanceController": 'Tanmay',
                "targettedResources": {"ABC":"true","DCH":"false"},
                "targetedResAllocationRate": {"ABC":50,"DCH":60},
                "Type": "PO",
                "poNumber": "ERP34",
                "poAmount": 3434,
                "currency": "USD",
                "documentName": "VB_ERP",
                "posowEndDate": "2014-01-22T14:56:59.301Z",
                "remarks": "Created New PO",
                "__v": 0,
                "Created_At": "2021-12-10T05:55:17.961Z"
              }
            ]
          },
          "error": {}
        } 
      }
  */

/* 	#swagger.tags = ['PO/SOW']
      #swagger.description = 'Get Client list' 
      #swagger.responses[200] = {
        schema:{
         "status": "success",
         "code": 200,
         "message": "",
         "data": [
             {
               "clientName": "Valuebound"
             },
             {
               "clientName": "Nasdaq"
             }
           ],
         "error": {}
       }
      }
  */

/* 	#swagger.tags = ['PO/SOW']
      #swagger.description = 'Get Project list of a Client' 
      #swagger.responses[200] = {
        schema:{
         "status": "success",
         "code": 200,
         "message": "",
         "data": [
           {
             "_id": "61b857d0b08340b2ddad1341",
             "projectName": "Employee Management"
           }
         ],
         "error": {}
       }
      }
  */

/* 	#swagger.tags = ['PO/SOW']
      #swagger.description = 'Get project details of given Id' 
      #swagger.parameters['projectId'] = {
        in: 'query',
        type: 'string',
        description: 'Project ID' 
      }
      #swagger.responses[200] = {
        schema:{
          "status": "success",
          "code": 200,
          "message": "",
          "data": [
           {
             "empPrimaryCapiblities": [],
             "_id": "61b8c18ce56e27b307b73168",
             "projectId": {
                "_id": "61b8c18ce56e27b307b73166",
                "vbProjectId": "VB-PROJ-1",
                "projectName": "Valuebound",
                "clientProjectSponsor": "Jai K",
                "clientFinanceController": "Jai K"
             },
             "primaryCapiblities": [],
             "startDate": "2021-12-14",
             "endDate": "2021-12-17",
             "percentage": 57,
             "rackRate": 45132,
             "__v": 0,
             "empId": {
                "_id": "61b59800430ab0392fd92640",
                "empId": 15,
                "empName": "sanjay"
             }
           }
          ],
         "error": {}
        } 
      }
  */

/* 	#swagger.tags = ['PO/SOW']
      #swagger.description = 'Create new PO/SOW'
      #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
            $projectId: '61bb0622bf6c0b45dff12f77',
            $clientName:'Valuebound Solutions',
            $projectName: 'ERP System',
            $clientSponser: 'Jai',
            $clientFinanceController: 'Tanmay',
            $targettedResources: {"Suresh":"true","Akash":"false"},
            $targetedResAllocationRate: {"ABC":50,"DCH":60},
            $Type: 'PO',
            $poAmount: 3434,
            $currency: 'USD',
            $documentName: 'VB_ERP',
            $posowEndDate: "2014-01-22T14:56:59.301Z",
            $remarks: 'Created New PO'
        }
      }
      #swagger.responses[201] = {
        description: 'User successfully added.',
        schema: { 
          "status": "success",
          "code": 201,
          "message": "",
          "data": {
            "projectId": '61bb0622bf6c0b45dff12f77',
            "clientName":'Valuebound Solutions',
            "projectName": 'ERP System',
            "clientSponser": 'Jai',
            "clientFinanceController": 'Tanmay',
            "targettedResources": {"ABC":"true","DCH":"false"},
            "targetedResAllocationRate": {"ABC":50,"DCH":60},
            "Type": 'PO',
            "poNumber": 'ERP34',
            "poAmount": 3434,
            "currency": 'USD',
            "documentName": 'VB_ERP',
            "posowEndDate": "2014-01-22T14:56:59.301Z",
            "remarks": 'Created New PO',
            "Created_At": "2021-12-10T06:01:50.178Z",
            "__v": 0
          },
          "error": {}
        }
      }
  */

/* 	#swagger.tags = ['PO/SOW'']
      #swagger.description = 'Update PO/SOW details' 
      #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
              $projectId: '61bb0622bf6c0b45dff12f77',
              $clientName:'Valuebound Solutions',
              $projectName: 'ERP System',
              $clientSponser: 'Jai',
              $clientFinanceController: 'Tanmay',
              $targettedResources: {"ABC":"true","DCH":"false"},
              $targetedResAllocationRate: {"ABC":50,"DCH":60},
              $Type: 'PO',
              $poAmount: 3434,
              $currency: 'USD',
              $documentName: 'VB_ERP',
              $posowEndDate: "2014-01-22T14:56:59.301Z",
              $remarks: 'Created New PO'
        }
      }
      #swagger.responses[200] = {
        description: 'PO/SOW details updated successfully.',
        schema: { 
          "status": "success",
          "code": 200,
          "message": "",
          "data": {
              "projectId": '61bb0622bf6c0b45dff12f77',
              "clientName":'Valuebound Solutions',
              "projectName": 'ERP System Backend',
              "clientSponser": 'Jai',
              "clientFinanceController": 'Tanmay',
              "targettedResources": {"ABC":"true","DCH":"false"},
              "targetedResAllocationRate": {"ABC":50,"DCH":60},
              "Type": 'PO',
              "poNumber": 'ERP43',
              "poAmount": 3434,
              "currency": 'INR',
              "documentName": 'VB_ERP',
              "posowEndDate": "2014-01-22T14:56:59.301Z",
              "remarks": 'Created New PO'
          },
          "error": {}
        }
      }
  */
