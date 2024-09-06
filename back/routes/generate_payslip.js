import express from "express";
import filterPayslip from "../misc/filterPayslip.js";
import createPayslip from "../misc/generatePayslipPDF.js";
import payslipBreakdown from "../misc/payslip_breakdown.js";

const router = express.Router();

router.post("/generatePayslip", async (req, res) => {
  try {
    const { from_year, from_month, to_year, to_month } = req.body;
    const user = req.session.user;
    const filteredData = filterPayslip(
      user.salary_data,
      from_year,
      from_month,
      to_year,
      to_month
    );
    const payslip_breakdown = payslipBreakdown(filteredData);
    const department = (() => {
      switch (user.department) {
        case "technical":
          return "Technical Services";
        case "general":
          return "General Services";
        default:
          return "Unknown";
      }
    })();
    const htmlContent =
      `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playwrite+CU:wght@100..400&display=swap"
        rel="stylesheet">

    <style>
        @media print {
            @page {
                size: A4;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                margin: 0;
            }

            body {
                font-family: "Montserrat", Helvetica, sans-serif sans-serif;
            }
        }

        body {
            width: 8.27in;
            height: 11.69in;
            margin: auto;
            padding: 0;
        }
    </style>
</head>

<body>
    <div
        style="background-color: rgb(240, 240, 240); display: flex; justify-content: space-between; padding: 25px; padding-top: 10px; border-bottom: 10px solid rgb(56,30,51);">
        <div>
            <h1 style="font-family: 'Playwrite CU', cursive; font-size: 23px;margin-bottom: 3px; color: rgb(56,30,51);">
                BT Technologies
                Ltd.</h1>
            <p style="font-size: 15px; font-family: Montserrat; margin-top: 3px; color: rgb(56,30,51);">50/52 Broad
                Street,
                <br />
                Bookshop House, Marina, Lagos.
                <br />
                info@yourcompany.com | (555) 123-1234
            </p>

        </div>
        <img width="40%" height="40%" style="align-self: center;"
            src="https://bttechltd.com/assets/img/bt-logo-2.png" />
    </div>

    <h1
        style="font-family: Montserrat; font-size: 30px;margin-bottom: 3px; color: rgb(56,30,51); letter-spacing: 0.2cm; margin-left: 20px;">
        PAYSLIP</h1>
    <hr style="border-color:rgb(56,30,51)" />

    <div style="padding: 0px 20px; display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: end;">
            <h1
                style="font-family: Montserrat; font-size: 15px;margin-bottom: 3px; color: rgb(56,30,51); font-weight:bold;">
                Employee Details</h1>
            <h1
                style="font-family: Montserrat; font-size: 15px;margin-bottom: 3px; color: rgb(56,30,51); font-weight:bold;">
                Net Pay:
                <span style="font-weight: bold; font-size: 25px;font-weight:bold;">₦${payslip_breakdown.netPay.toLocaleString()}</span>
            </h1>
        </div>

        <div style="justify-content: space-between; display: flex; margin-top: 25px;">
            <div style="display: flex; flex-direction: column; width: 40%">
                <div style="display: flex; align-items: center;">
                    <h1
                        style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold; width:30%;">
                        Name:</h1>
                    <h1 style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:normal;">
                        ${user.last_name} ${user.first_name} ${
        user.other_name || ""
      }</h1>
                </div>
                <hr style="border-color:rgb(56,30,51); width: 100%;" />
                <div style="display: flex; align-items: center;">
                    <h1
                        style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold; width:30%;">
                        Email:</h1>
                    <h1 style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:normal;">
                        ${user.email}</h1>
                </div>
                <hr style="border-color:rgb(56,30,51); width: 100%;" />
                <div style="display: flex; align-items: center;">
                    <h1
                        style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold; width:30%;">
                        Phone No.:</h1>
                    <h1 style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:normal;">
                        ${"+234 " + user.phone_number.substring(1)}</h1>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; width: 50%">
                <div style="display: flex; align-items: center;">
                    <h1
                        style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold; width:30%;">
                        Department:</h1>
                    <h1 style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:normal;">
                        ${department}</h1>
                </div>
                <hr style="border-color:rgb(56,30,51); width: 100%;" />
                <div style="display: flex; align-items: center;">
                    <h1
                        style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold; width:30%;">
                        Account No.:</h1>
                    <h1 style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:normal;">
                        ${user.account_number}</h1>
                </div>
                <hr style="border-color:rgb(56,30,51); width: 100%;" />
                <div style="display: flex; align-items: center;">
                    <h1
                        style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold; width:25%;">
                        Pay Period:</h1>
                    <h1 style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold;">
                        ${from_month} ${from_year} <span style="font-weight: normal;">to</span> ${to_month} ${to_year}</h1>
                </div>
            </div>
        </div>

        <div style="justify-content: space-between; display: flex; margin-top: 50px;">
            <div style="justify-content: space-between; display: flex; flex-direction: column; width: 45%;">
                <div
                    style="background-color: rgb(240, 240, 240); display: flex; justify-content: space-between; padding-left: 10px;">
                    <h1
                        style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold; width:30%;">
                        Earnings</h1>
                    <h1
                        style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold; width:30%;">
                        Amount</h1>
                </div>` +
      Object.keys(payslip_breakdown.additions)
        .map((key) => {
          return `
    <div style=" display: flex; justify-content: space-between; padding-left: 10px; margin-top: 10px;">
        <h1
            style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:normal; width:30%; margin: 0;">
            ${
              key == "basePay"
                ? "Base Pay"
                : key.charAt(0).toUpperCase() + key.slice(1)
            } <!-- Capitalize the first letter of the key -->
        </h1>
        <h1
            style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold; width:30%; margin: 0;">
            ₦${payslip_breakdown.additions[
              key
            ].toLocaleString()} <!-- Format the number -->
        </h1>
    </div>
    <hr style="border-color:rgb(56,30,51); width: 100%;" />
  `;
        })
        .join("") +
      `
            </div>
            <div
                style="justify-content: space-between; display: flex; flex-direction: column; width: 45%; height: fit-content;">
                <div
                    style="background-color: rgb(240, 240, 240); display: flex; justify-content: space-between; padding-left: 10px;">
                    <h1
                        style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold; width:30%;">
                        Deductions</h1>
                    <h1
                        style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold; width:30%;">
                        Amount</h1>
                </div>
                ` +
      Object.keys(payslip_breakdown.subtractions)
        .map((key) => {
          return `
    <div style=" display: flex; justify-content: space-between; padding-left: 10px; margin-top: 10px;">
        <h1
            style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:normal; width:30%; margin: 0;">
            ${key.charAt(0).toUpperCase() + key.slice(1)}
        </h1>
        <h1
            style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold; width:30%; margin: 0;">
            ₦${payslip_breakdown.subtractions[key].toLocaleString()}
        </h1>
    </div>
    <hr style="border-color:rgb(56,30,51); width: 100%;" />
  `;
        })
        .join("") +
      `
            </div>
        </div>

        <div style="display: flex; margin-top: 35px; align-self: self-end; width: 45%; flex-direction: column;">
            <div style=" display: flex; justify-content: space-between; padding-left: 10px;">
                <h1
                    style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:normal; width:40%; margin: 0;">
                    Gross Salary</h1>
                <h1
                    style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold; width:30%; margin: 0;">
                    ₦${payslip_breakdown.totalAdditions.toLocaleString()}</h1>
            </div>
            <div style=" display: flex; justify-content: space-between; padding-left: 10px; margin-top: 10px;">
                <h1
                    style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:normal; width:40%;">
                    Total Deductions</h1>
                <h1
                    style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold; width:30%;">
                    ₦${payslip_breakdown.totalSubtractions.toLocaleString()}</h1>
            </div>
            <hr style="border-color:rgb(56,30,51); width: 100%;" />
            <div style=" display: flex; justify-content: space-between; padding-left: 10px; margin-top: 10px;">
                <h1
                    style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:normal; width:40%; margin: 0;">
                    NET Salary</h1>
                <h1
                    style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:bold; width:30%; margin: 0;">
                    ₦${payslip_breakdown.netPay.toLocaleString()}</h1>
            </div>
        </div>

        <div style="justify-content: space-between; display: flex; margin-top: 45px;">
            <div style=" display: flex; margin-top: 10px; width: 45%; align-items: end;">
                <h1
                    style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:normal; width:fit-content; margin: 0;">
                    Employer Signature:</h1>
                <hr style="border-color:rgb(56,30,51); width: 50%; margin: 0; margin-left: 5px; border-width: 0.1px;" />
            </div>
            <div style=" display: flex; margin-top: 10px; width: 45%; align-items: end;">
                <h1
                    style="font-family: Montserrat; font-size: 15px; color: rgb(56,30,51); font-weight:normal; width:fit-content; margin: 0;">
                    Employee Signature:</h1>
                <hr style="border-color:rgb(56,30,51); width: 50%; margin: 0; margin-left: 5px; border-width: 0.1px;" />
            </div>
        </div>
</body>

</html>`;

    const pdfBuffer = await createPayslip(htmlContent);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="payslip.pdf"',
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error(error.stack);
    res.status(error.status || 500).render("error", {
      code: error.status || 500,
      desc: error.message || "Error generating PDF",
      message:
        "Our hamsters haven't been given enough food, please try again...",
    });
  }
});

export default router;
