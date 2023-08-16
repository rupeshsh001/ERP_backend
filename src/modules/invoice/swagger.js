/* 	#swagger.tags = ['invoices']
      #swagger.description = 'Get sorted Invoice list' 
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
            "results": [
              {
            "_id": "610bc1b31b82a66f6bcd64ea",
            "PO_Id": {
                "targettedResources": {"ABC":"true","DCH":"false"},
                "_id": "61aee1b97af12a205c1a16c5",
                "clientName": "Tanmay kesarwani",
                "projectName": "valuebound",
                "poNumber": "GK475f",
                "poAmount": 28274
              },
            "client_sponsor": "Tanmay",
            "clientFinanceController": "xyz",
            "invoice_raised": 4738687,
            "invoice_amount_received": 5689339,
            "vb_bank_account": "dwrjhgcriwog",
            "amount_received_on": "2014-01-22T14:56:59.301Z",
            "__v": 0
          }
            ]
          },
          "error": {}
        } 
      }
  */

/* 	#swagger.tags = ['invoices']
      #swagger.description = 'Get invoice Detail by id' 
      #swagger.responses[200] = {
        schema:{
          "status": "success",
          "code": 200,
          "message": "",
          "data":  {
            "_id": "610bc1b31b82a66f6bcd64ea",
            "PO_Id": {
                "targettedResources": {"ABC":"true","DCH":"false"},
                "_id": "61aee1b97af12a205c1a16c5",
                "clientName": "Tanmay kesarwani",
                "projectName": "valuebound",
                "poNumber": "GK475f",
                "poAmount": 28274
              },
            "client_sponsor": "Tanmay",
            "clientFinanceController": "xyz",
            "invoice_raised": 736398,
            "invoice_amount_received": 5689339,
            "vb_bank_account": "dwrjhgcriwog",
            "amount_received_on": "2014-01-22T14:56:59.301Z",
            "__v": 0
          },
          "error": {}
        }
      }
  */

/*
  #swagger.tags = ['invoices']
      #swagger.description = 'Add new invoice'
      #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
            $PO_Id: '61a8bb6ab7dcd452dc0f5e05',
            $client_sponsor: 'AB',
            $clientFinanceController: 'CD',
            $invoice_raised: "Yes",
            $invoice_received: "Yes",
            $invoice_amount_received: 87634788,
            $vb_bank_account: 'SBIN00004567',
            $amount_received_on: '2021-12-10T06:01:50.178Z'
        }
      }
      #swagger.responses[201] = {
        description: 'User successfully added.',
        schema: {
          "status": "success",
          "code": 201,
          "message": "",
          "data": {
            "PO_Id": '61a8bb6ab7dcd452dc0f5e05',
            "client_sponsor": 'AB',
            "clientFinanceController": 'CD',
            "invoice_raised": "Yes",
            "invoice_received": "Yes",
            "invoice_amount_received": 467389738,
            "vb_bank_account": 'SBIN00004567',
            "amount_received_on": '2021-12-10T06:01:50.178Z',
            "created_at": '2021-12-10T06:01:50.178Z',
          },
          "error": {}
        }
      }
  */

/*
      #swagger.tags = ['invoices']
      #swagger.description = 'Update invoice details'
      #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
            $PO_Id: '61d41dcdf2e1e074360371ee',
            $client_sponsor: 'AB',
            $clientFinanceController: 'CD',
            $invoice_raised: "Yes",
            $invoice_received: "Yes",
            $invoice_amount_received: 87634788,
            $vb_bank_account: 'SBIN00004567',
            $amount_received_on: '2021-12-10T06:01:50.178Z'
        }
      }
      #swagger.responses[200] = {
        description: 'Invoice Details updated successfully.',
        schema: {
          "status": "success",
          "code": 200,
          "message": "",
          "data": {
            "PO_Id": '61d41dcdf2e1e074360371ee',
            "client_sponsor": 'AB',
            "clientFinanceController": 'CD',
            "invoice_raised": "Yes",
            "invoice_received": "Yes",
            "invoice_amount_received": 467389738,
            "vb_bank_account": 'SBIN00004567',
            "amount_received_on": '2021-12-10T06:01:50.178Z',
            "created_at": '2021-12-10T06:01:50.178Z',
          },
          "error": {}
        }
      }
  */
