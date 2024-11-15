const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const path = require("path");

const app = express();
const port = 8001;

app.use(cors());
app.use(bodyParser.json());

const config = {
  user: "sa",
  password: "P@55w0rd",
  server: "192.168.199.20",
  port: 1433,
  database: "dbXsfq",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

app.get("/api/get", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .query("SELECT DISTINCT Product_type, Product_img FROM Product_group");

      const normalizedResults = result.recordset.map((product) => {
        const productImg = product.Product_img;
  
        if (typeof productImg === "string") {
          // สร้าง URL สำหรับภาพที่แชร์ใน W drive
          const tempUrl = `/api/images/${encodeURIComponent(
            productImg.replace(/\\/g, "/")
          )}`;
          return {
            Product_type: product.Product_type,
            Product_img: tempUrl,
          };
        } else {
          console.warn(`Invalid path for Product_img:`, productImg);
          return {
            Product_type: product.Product_type,
            Product_img: "",
          };
        }
      });

      console.log(normalizedResults);

    res.status(200).json(normalizedResults);
  } catch (error) {
    console.error("SQL error:", error);
    res.status(500).send("Error querying the database");
  } finally {
    await sql.close();
  }
});

app.get(`/api/equipment_list`, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const { id } = req.query;

    if (id) {
      storedProductType = id;
    }

    console.log(storedProductType);
    

    const result = await pool
      .request()
      .input("ProductType", sql.VarChar, storedProductType)
      .query(
        "SELECT DISTINCT Product_name, Product_img FROM Product_List WHERE Product_type LIKE '%'+@ProductType+'%' AND Product_img != '' "
      );

    // แปลงผลลัพธ์เพื่อสร้าง URL ชั่วคราวสำหรับรูปภาพ
    const normalizedResults = result.recordset.map((product) => {
      const productImg = product.Product_img;

      if (typeof productImg === "string") {
        // สร้าง URL สำหรับภาพที่แชร์ใน W drive
        const tempUrl = `/api/images/${encodeURIComponent(
          productImg.replace(/\\/g, "/")
        )}`;
        return {
          Product_name: product.Product_name,
          Product_img: tempUrl,
        };
      } else {
        console.warn(`Invalid path for Product_img:`, productImg);
        return {
          Product_name: product.Product_name,
          Product_img: "",
        };
      }
    });

    res.status(200).json(normalizedResults);
  } catch (error) {
    console.error("Error fetching equipment list:", error);
    res.status(500).send("Internal Server Error");
  }
});

// API สำหรับเข้าถึงไฟล์ภาพ
app.get("/api/images/*", (req, res) => {
  // ดึง path ของภาพจาก URL
  const imgPath = decodeURIComponent(req.path.split("/api/images/")[1]);
  // สร้าง full path สำหรับการเข้าถึงไฟล์
  const fullPath = path.join("", imgPath.replace(/\//g, "\\")); // เปลี่ยน '/' เป็น '\'

  // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Image not found:", fullPath); // Log สำหรับไฟล์ที่ไม่พบ
      return res.status(404).send("Image not found"); // ส่งสถานะ 404 ถ้าไฟล์ไม่พบ
    }

    // ถ้าไฟล์มีอยู่ ส่งไฟล์กลับไปยัง client
    res.sendFile(fullPath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error sending file"); // ส่งสถานะ 500 ถ้ามีข้อผิดพลาดในการส่งไฟล์
      }
    });
  });
});

app.post(`/api/model`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const model = req.body;

    const result = await pool
      .request()
      .input("value", sql.VarChar, model.Product_model)
      .execute("dbGET_model");

    const normalizedResults = result.recordset.map((product) => {
      const productImg = product.Product_img;

      if (typeof productImg === "string") {
        // สร้าง URL สำหรับภาพที่แชร์ใน W drive
        const tempUrl = `/api/images/${encodeURIComponent(
          productImg.replace(/\\/g, "/")
        )}`;
        return {
          Product_name: product.Product_name,
          Product_width: product.Product_width,
          Product_height: product.Product_height,
          Product_depth: product.Product_depth,
          Product_type: product.Product_type,
          Product_img: tempUrl,
        };
      } else {
        console.warn(`Invalid path for Product_img:`, productImg);
        return {
          Product_name: product.Product_name,
          Product_width: product.Product_width,
          Product_height: product.Product_height,
          Product_depth: product.Product_depth,
          Product_type: product.Product_type,
          Product_img: "",
        };
      }
    });

    res.status(200).json(normalizedResults);
  } catch (error) {
    console.error("Error fetching model:", error); // Log ข้อผิดพลาด
    res.status(500).send("Internal Server Error");
  }
});

app.post(`/api/size`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const model = req.body;

    const result = await pool

      .request()
      .input("value", sql.VarChar, model.productName)
      .execute("dbfind_size_model");

      const normalizedResults = result.recordset.map((product) => {
        const productImg = product.Product_img;
  
        if (typeof productImg === "string") {
          // สร้าง URL สำหรับภาพที่แชร์ใน W drive
          const tempUrl = `/api/images/${encodeURIComponent(
            productImg.replace(/\\/g, "/")
          )}`;
          return {
            Product_name: product.Product_name,
            Product_width: product.Product_width,
            Product_height: product.Product_height,
            Product_depth: product.Product_depth,
            Product_type: product.Product_type,
            Product_img: tempUrl,
          };
        } else {
          console.warn(`Invalid path for Product_img:`, productImg);
          return {
            Product_name: product.Product_name,
            Product_width: product.Product_width,
            Product_height: product.Product_height,
            Product_depth: product.Product_depth,
            Product_type: product.Product_type,
            Product_img: "",
          };
        }
      });

    res.status(200).json(normalizedResults);
  } catch (error) {
    console.log(error);
  }
});

app.post(`/api/checksize`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { width, height, depth, product_model } = req.body;

    const widthValue = width ? width : null;
    const heightValue = height ? height : null;
    const depthValue = depth ? depth : null;
    const modelValue = product_model ? product_model : null;

    const result = await pool

      .request()
      .input("width", sql.VarChar, widthValue)
      .input("height", sql.VarChar, heightValue)
      .input("depth", sql.VarChar, depthValue)
      .input("modelValue", sql.VarChar, modelValue)
      .execute("dbfind_model");

      const normalizedResults = result.recordset.map((product) => {
        const productImg = product.Product_img;
  
        if (typeof productImg === "string") {
          // สร้าง URL สำหรับภาพที่แชร์ใน W drive
          const tempUrl = `/api/images/${encodeURIComponent(
            productImg.replace(/\\/g, "/")
          )}`;
          return {
            Product_name: product.Product_name,
            Product_width: product.Product_width,
            Product_height: product.Product_height,
            Product_depth: product.Product_depth,
            Product_type: product.Product_type,
            Product_img: tempUrl,
          };
        } else {
          console.warn(`Invalid path for Product_img:`, productImg);
          return {
            Product_name: product.Product_name,
            Product_width: product.Product_width,
            Product_height: product.Product_height,
            Product_depth: product.Product_depth,
            Product_type: product.Product_type,
            Product_img: "",
          };
        }
      });
    res.status(200).json(normalizedResults);
  } catch (error) {
    console.log(error);
  }
});

app.post(`/api/checkprice`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { lowPrice, highPrice, product_model } = req.body;

    const lowPriceValue = lowPrice ? lowPrice : null;
    const highPriceValue = highPrice ? highPrice : null;
    const modelValue = product_model ? product_model : null;

    const result = await pool

      .request()
      .input("lowPrice", sql.VarChar, lowPriceValue)
      .input("highPrice", sql.VarChar, highPriceValue)
      .input("modelValue", sql.VarChar, modelValue)
      .execute("dbfind_Price_model");

      const normalizedResults = result.recordset.map((product) => {
        const productImg = product.Product_img;
  
        if (typeof productImg === "string") {
          // สร้าง URL สำหรับภาพที่แชร์ใน W drive
          const tempUrl = `/api/images/${encodeURIComponent(
            productImg.replace(/\\/g, "/")
          )}`;
          return {
            Product_name: product.Product_name,
            Product_width: product.Product_width,
            Product_height: product.Product_height,
            Product_depth: product.Product_depth,
            Product_type: product.Product_type,
            Product_img: tempUrl,
          };
        } else {
          console.warn(`Invalid path for Product_img:`, productImg);
          return {
            Product_name: product.Product_name,
            Product_width: product.Product_width,
            Product_height: product.Product_height,
            Product_depth: product.Product_depth,
            Product_type: product.Product_type,
            Product_img: "",
          };
        }
      });

    res.status(200).json(normalizedResults);
  } catch (error) {
    console.log(error);
  }
});

app.post(`/api/selectItem`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { type, product_model } = req.body;

    const result = await pool

      .request()
      .input("type", sql.VarChar, type)
      .input("product_name", sql.VarChar, product_model)
      .execute("dbfind_type");

      const normalizedResults = result.recordset.map((product) => {
        const productImg = product.Product_img;
  
        if (typeof productImg === "string") {
          // สร้าง URL สำหรับภาพที่แชร์ใน W drive
          const tempUrl = `/api/images/${encodeURIComponent(
            productImg.replace(/\\/g, "/")
          )}`;
          return {
            Product_name: product.Product_name,
            Product_width: product.Product_width,
            Product_height: product.Product_height,
            Product_depth: product.Product_depth,
            Product_type: product.Product_type,
            Product_img: tempUrl,
          };
        } else {
          console.warn(`Invalid path for Product_img:`, productImg);
          return {
            Product_name: product.Product_name,
            Product_width: product.Product_width,
            Product_height: product.Product_height,
            Product_depth: product.Product_depth,
            Product_type: product.Product_type,
            Product_img: "",
          };
        }
      });

    res.status(200).json(normalizedResults);
  } catch (error) {
    console.log(error);
  }
});



app.post(`/api/Accessories`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const selectedProduct = req.body.selectedProduct;

    const result = await pool

      .request()
      .input("Product_name", sql.VarChar, selectedProduct.Product_name)
      .input("type", sql.VarChar, selectedProduct.type)
      .input("depth", sql.Int, selectedProduct.depth)
      .input("width", sql.Int, selectedProduct.width)
      .input("height", sql.Int, selectedProduct.height)

      .execute("dbSelect_Accesseries");

      const normalizedResults = result.recordset.map((product) => {
        const productImg = product.Product_img;
  
        if (typeof productImg === "string") {
          // สร้าง URL สำหรับภาพที่แชร์ใน W drive
          const tempUrl = `/api/images/${encodeURIComponent(
            productImg.replace(/\\/g, "/")
          )}`;
          return {
            Color_code: product.Color_code,
            ID: product.ID,
            Product_Cfeature: product.Product_Cfeature,
            Product_Cfunction: product.Product_Cfunction,
            Product_depth: product.Product_depth,
            Product_fg: product.Product_fg,
            Product_height: product.Product_height,
            Product_name: product.Product_name,
            Product_price: product.Product_price,
            Product_rang: product.Product_rang,
            Product_type: product.Product_type,
            Product_width: product.Product_width,
            Product_img: tempUrl,
          };
        } else {
          console.warn(`Invalid path for Product_img:`, productImg);
          return {
            Color_code: product.Color_code,
            ID: product.ID,
            Product_Cfeature: product.Product_Cfeature,
            Product_Cfunction: product.Product_Cfunction,
            Product_depth: product.Product_depth,
            Product_fg: product.Product_fg,
            Product_height: product.Product_height,
            Product_name: product.Product_name,
            Product_price: product.Product_price,
            Product_rang: product.Product_rang,
            Product_type: product.Product_type,
            Product_width: product.Product_width,
            Product_img: "",
          };
        }
      })

    res.status(200).json(normalizedResults);
  } catch (error) {
    console.log(error);
  }
});

app.get(`/api/Screen`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute("db_Accessories_Screen");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.get(`/api/Flip`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute("db_Accesseries_Flip");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.get(`/api/Electric`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute("db_Accesseries_Electric");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.get(`/api/Snake`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute("db_Accesseries_Snake");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/ProductReport`, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { Product, color, modesty, screen, flip, Electric, Snake } = req.body;

    const productData = JSON.parse(Product);

    const result = await pool

      .request()
      .input("Product_name", sql.VarChar, productData.Product_name)
      .input("type", sql.VarChar, productData.type)
      .input("depth", sql.Int, productData.depth)
      .input("width", sql.Int, productData.width)
      .input("height", sql.Int, productData.height)
      .input("color", sql.VarChar, color)
      // .input("modesty", sql.VarChar, modesty)
      // .input("screen", sql.VarChar, screen)
      // .input("flip", sql.VarChar, flip)
      // .input("electric", sql.VarChar, Electric)
      // .input("snake", sql.VarChar, Snake)
      .execute("db_Report");

      const normalizedResults = result.recordset.map((product) => {
        const productImg = product.Product_img;
  
        if (typeof productImg === "string") {
          // สร้าง URL สำหรับภาพที่แชร์ใน W drive
          const tempUrl = `/api/images/${encodeURIComponent(
            productImg.replace(/\\/g, "/")
          )}`;
          return {
            Color_code: product.Color_code,
            ID: product.ID,
            Product_Cfeature: product.Product_Cfeature,
            Product_Cfunction: product.Product_Cfunction,
            Product_depth: product.Product_depth,
            Product_fg: product.Product_fg,
            Product_height: product.Product_height,
            Product_name: product.Product_name,
            Product_price: product.Product_price,
            Product_rang: product.Product_rang,
            Product_type: product.Product_type,
            Product_width: product.Product_width,
            Product_img: tempUrl,
          };
        } else {
          console.warn(`Invalid path for Product_img:`, productImg);
          return {
            Color_code: product.Color_code,
            ID: product.ID,
            Product_Cfeature: product.Product_Cfeature,
            Product_Cfunction: product.Product_Cfunction,
            Product_depth: product.Product_depth,
            Product_fg: product.Product_fg,
            Product_height: product.Product_height,
            Product_name: product.Product_name,
            Product_price: product.Product_price,
            Product_rang: product.Product_rang,
            Product_type: product.Product_type,
            Product_width: product.Product_width,
            Product_img: "",
          };
        }
      })

    res.status(200).json(normalizedResults);
  } catch (error) {
    console.log(error);
  }
});

app.post(`/api/Report/modesty`, async (req, res) => {

  try {
    const pool = await sql.connect(config);

    const modesty = req.body

    const result = await pool
    .request()
    .input("modesty", sql.VarChar, modesty.modesty)
    .query(
      "SELECT * FROM Accessories WHERE Access_name = @modesty"
    );

    const normalizedResults = result.recordset.map((product) => {
      const productImg = product.Access_img;

      if (typeof productImg === "string") {
        // สร้าง URL สำหรับภาพที่แชร์ใน W drive
        const tempUrl = `/api/images/${encodeURIComponent(
          productImg.replace(/\\/g, "/")
        )}`;
        return {
          Access_depth: product.Access_depth,
          Access_height: product.Access_height,
          Access_name: product.Access_name,
          Access_price: product.Access_price,
          Access_type: product.Access_type,
          Access_width: product.Access_width,
          Access_img: tempUrl,
        };
      } else {
        console.warn(`Invalid path for Product_img:`, productImg);
        return {
          Color_code: product.Color_code,
          ID: product.ID,
          Access_depth: product.Access_depth,
          Access_height: product.Access_height,
          Access_name: product.Access_name,
          Access_price: product.Access_price,
          Access_type: product.Access_type,
          Access_width: product.Access_width,
          Access_img: "",
        };
      }
    })

    res.status(200).json(normalizedResults);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/Report/Screen`, async (req, res) => {

  try {
    const pool = await sql.connect(config);

    const screen = req.body

    const result = await pool
    .request()
    .input("screen", sql.VarChar, screen.screen)
    .query(
      "SELECT * FROM Accessories WHERE Access_name = @screen"
    );

    const normalizedResults = result.recordset.map((product) => {
      const productImg = product.Access_img;

      if (typeof productImg === "string") {
        // สร้าง URL สำหรับภาพที่แชร์ใน W drive
        const tempUrl = `/api/images/${encodeURIComponent(
          productImg.replace(/\\/g, "/")
        )}`;
        return {
          Access_depth: product.Access_depth,
          Access_height: product.Access_height,
          Access_name: product.Access_name,
          Access_price: product.Access_price,
          Access_type: product.Access_type,
          Access_width: product.Access_width,
          Access_img: tempUrl,
        };
      } else {
        console.warn(`Invalid path for Product_img:`, productImg);
        return {
          Color_code: product.Color_code,
          ID: product.ID,
          Access_depth: product.Access_depth,
          Access_height: product.Access_height,
          Access_name: product.Access_name,
          Access_price: product.Access_price,
          Access_type: product.Access_type,
          Access_width: product.Access_width,
          Access_img: "",
        };
      }
    })

    res.status(200).json(normalizedResults);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/Report/Flip`, async (req, res) => {

  try {
    const pool = await sql.connect(config);

    const flip = req.body

    const result = await pool
    .request()
    .input("flip", sql.VarChar, flip.flip)
    .query(
      "SELECT * FROM Accessories WHERE Access_name = @flip"
    );

    const normalizedResults = result.recordset.map((product) => {
      const productImg = product.Access_img;

      if (typeof productImg === "string") {
        // สร้าง URL สำหรับภาพที่แชร์ใน W drive
        const tempUrl = `/api/images/${encodeURIComponent(
          productImg.replace(/\\/g, "/")
        )}`;
        return {
          Access_depth: product.Access_depth,
          Access_height: product.Access_height,
          Access_name: product.Access_name,
          Access_price: product.Access_price,
          Access_type: product.Access_type,
          Access_width: product.Access_width,
          Access_img: tempUrl,
        };
      } else {
        console.warn(`Invalid path for Product_img:`, productImg);
        return {
          Color_code: product.Color_code,
          ID: product.ID,
          Access_depth: product.Access_depth,
          Access_height: product.Access_height,
          Access_name: product.Access_name,
          Access_price: product.Access_price,
          Access_type: product.Access_type,
          Access_width: product.Access_width,
          Access_img: "",
        };
      }
    })

    res.status(200).json(normalizedResults);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/Report/Wireway`, async (req, res) => {

  try {
    const pool = await sql.connect(config);

    const wireway = req.body

    const result = await pool
    .request()
    .input("wireway", sql.VarChar, wireway.Snake)
    .query(
      "SELECT * FROM Accessories WHERE Access_name = @wireway"
    );

    const normalizedResults = result.recordset.map((product) => {
      const productImg = product.Access_img;

      if (typeof productImg === "string") {
        // สร้าง URL สำหรับภาพที่แชร์ใน W drive
        const tempUrl = `/api/images/${encodeURIComponent(
          productImg.replace(/\\/g, "/")
        )}`;
        return {
          Access_depth: product.Access_depth,
          Access_height: product.Access_height,
          Access_name: product.Access_name,
          Access_price: product.Access_price,
          Access_type: product.Access_type,
          Access_width: product.Access_width,
          Access_img: tempUrl,
        };
      } else {
        console.warn(`Invalid path for Product_img:`, productImg);
        return {
          Color_code: product.Color_code,
          ID: product.ID,
          Access_depth: product.Access_depth,
          Access_height: product.Access_height,
          Access_name: product.Access_name,
          Access_price: product.Access_price,
          Access_type: product.Access_type,
          Access_width: product.Access_width,
          Access_img: "",
        };
      }
    })

    res.status(200).json(normalizedResults);
  } catch (error) {
    console.error(error);
  }
});

app.post(`/api/Report/Electric`, async (req, res) => {

  try {
    const pool = await sql.connect(config);

    const Electric = req.body

    const result = await pool
    .request()
    .input("Electric", sql.VarChar, Electric.Electric)
    .query(
      "SELECT * FROM Accessories WHERE Access_name = @Electric"
    );

    const normalizedResults = result.recordset.map((product) => {
      const productImg = product.Access_img;

      if (typeof productImg === "string") {
        // สร้าง URL สำหรับภาพที่แชร์ใน W drive
        const tempUrl = `/api/images/${encodeURIComponent(
          productImg.replace(/\\/g, "/")
        )}`;
        return {
          Access_depth: product.Access_depth,
          Access_height: product.Access_height,
          Access_name: product.Access_name,
          Access_price: product.Access_price,
          Access_type: product.Access_type,
          Access_width: product.Access_width,
          Access_img: tempUrl,
        };
      } else {
        console.warn(`Invalid path for Product_img:`, productImg);
        return {
          Color_code: product.Color_code,
          ID: product.ID,
          Access_depth: product.Access_depth,
          Access_height: product.Access_height,
          Access_name: product.Access_name,
          Access_price: product.Access_price,
          Access_type: product.Access_type,
          Access_width: product.Access_width,
          Access_img: "",
        };
      }
    })

    res.status(200).json(normalizedResults);
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
