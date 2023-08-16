const Mustache = require("mustache");

const emailContentForEmpAcknowlegement = async (data, emailTo) => {
  const bodyHtml = `<head><meta name="description" content="leave status">
    <meta name="keywords" content="html tutorial template">
      <style>
    h2,p {
      text-align: center;
    }
      td {
      text-align: center;
    }
        .center {
      margin-left: auto;
      margin-right: auto;
    }
    .image{
      display: block;
      margin-left: auto;
      margin-right: auto;
      width: 8rem;
      margin-top:0
    }
    #leaveDetails {
      font-family: Arial, Helvetica, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }
    #leaveDetails td, #leaveDetails th {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;
    
    }
    #leaveDetails th {
      padding-top: 10px;
      padding-bottom: 10px;
      text-align: center;
      background-color: grey;
      color: white;
      font-size:1rem
    }
    td{
      font-size:0.9rem
    }
    footer {
      text-align: center;
      padding: 3px;
      background-color: transparent;
      color: black;
    }
    .button {
      background-color: #4CAF50;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
    }
    </style>
    </head>
    <body style='font-size:18px'>
  
   <p><img src="https://i.ibb.co/StBxM4g/emp-Leave-removebg-preview.png" alt="leave-logo" border="0" width="300" height="300" ></p>
      <h2>Leave Summary</h2>
      <hr/>
      <table class="center" id = "leaveDetails">
      <tr>
      <th>Applied On</th>
      <th>Leave type</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Applied to</th>
        <th>Status</th>
      </tr>
      <tr>
      <td>{{applied_on}}</td>
      <td>{{leave_type}}</td>
        <td>{{from_date}}</td>
        <td>{{to_date}}</td>
        <td>{{applied_to}}</td>
        <td>{{status}}</td>
      </tr>
    </table>
    <br>
    <div align="center"><a href ="https://oneplace.valuebound.net/" style="  text-decoration: none">
    <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:44px;width:201px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#8a3b8f" fillcolor="#0068a5"><w:anchorlock/><v:textbox inset="0px,10px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
    <div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#0068a5;border-radius:4px;width:auto;border-top:1px solid #8a3b8f;font-weight:400;border-right:1px solid #8a3b8f;border-bottom:1px solid #8a3b8f;border-left:1px solid #8a3b8f;padding-top:10px;padding-bottom:0px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">Login Here</span></span></div>
    <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
    </a></div>
    <p><small style ="text-align: center; font-size: 10px" >This email is auto-generated by <strong>oneplace</strong></small>.</p>
    <p><small style ="text-align: center ;font-size: 10px"><i>Please do not reply to this message</i></small></p>
    <hr/>
    <footer>
    <p><small style="font-size: 10px">©2022 Valuebound. All Rights Reserved</small></p>
  </footer>
    </body>`;
  const subjectText = `Your leave application has been {{status}}`;
  const subject = Mustache.render(subjectText, data);
  const body = Mustache.render(bodyHtml, data);
  return (content = { subject, body, to: emailTo });
};
module.exports = {
  emailContentForEmpAcknowlegement,
};
