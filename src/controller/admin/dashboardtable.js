const oracledb = require("oracledb");
const { connectToDatabase } = require("../../db.js");

async function fetchTableData() {
  try {
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    const connection = await connectToDatabase();
    const buyer_data = await connection.execute(
      `SELECT BUYER_EMAIL, NAME, PHONE_NO, ADDRESS, CITY FROM BUYERDATA ORDER BY NAME`
    );
    const seller_data = await connection.execute(
      `SELECT EMAIL AS SELLER_EMAIL, NAME, PHONE_NO,  SELLER_ADDRESS, CITY  FROM SELLER_DATA ORDER BY NAME`
    );
    const crop_data = await connection.execute(
      `SELECT * FROM CROPDATA ORDER BY CROPID`
    );

    const complaint_data = await connection.execute(
      `SELECT * FROM COMPLAIN ORDER BY COMPLAIN_NO`
    );

    const sold_data = await connection.execute(
     `SELECT 
    bd.NAME AS BUYER_NAME,
    sd.NAME AS SELLER_NAME,
    cd.NAME AS CROP_NAME,
    ci.QUANTITY,
    ci.AMOUNT,
    ci.AMOUNT * 0.05 AS ADMIN_PROFIT,
    ci.STATUS
    FROM 
        craditems ci
    JOIN 
        buyerdata bd ON ci.BUYER_EMAIL = bd.BUYER_EMAIL
    JOIN 
        seller_data sd ON ci.EMAIL = sd.EMAIL
    JOIN 
        cropdata cd ON ci.CROPID = cd.CROPID
    WHERE 
        ci.STATUS = 'SOLD'`
    );

    await connection.close();
    const result = {
      BUYER_DATA: buyer_data.rows,
      BUYER_COUNT: buyer_data.rows.length,

      SELLER_DATA: seller_data.rows,
      SELLER_COUNT: seller_data.rows.length,

      CROP_DATA: crop_data.rows,
      CROP_COUNT: crop_data.rows.length,
      
      COMPLAINT_DATA: complaint_data.rows,
      COMPLAINT_COUNT: complaint_data.rows.length,

      SOLD_DATA: sold_data.rows,
      SOLD_COUNT: sold_data.rows.length
    };
    return result;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
}

module.exports = { fetchTableData };
