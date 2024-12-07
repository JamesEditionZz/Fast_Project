"use client";
import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import "./ptk.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function index() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  const Product = data ? JSON.parse(decodeURIComponent(data)) : {};
  const [productReport, setProductReport] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Chairproductreport`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Product,
            }),
          }
        );

        const result = await res.json();

        setProductReport(result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [data]);

  const btnviewsale = () => {
    window.print();
  };

  const btnloadpfd = () => {
    const input = document.getElementById("pdf-content");

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const doc = new jsPDF({
        unit: "px", // ใช้ px เป็นหน่วย
        format: [595.28, 841.89], // กำหนดขนาด A4
      });

      // คำนวณขนาดหลังจากห่างจากขอบ 1 เซนติเมตร (28.35 px)
      const margin = 28.35; // ขอบ 1 เซนติเมตร
      const width = 595.28 - 2 * margin; // ความกว้างที่ลดจากขอบ
      const height = 841.89 - 2 * margin; // ความสูงที่ลดจากขอบ

      // คำนวณสัดส่วนการย่อให้พอดีกับขนาดที่กำหนด
      const ratio = Math.min(width / canvas.width, height / canvas.height);
      const imgWidth = canvas.width * ratio;
      const imgHeight = canvas.height * ratio;

      // เพิ่มรูปภาพจาก canvas ลงใน PDF พร้อมกับขอบที่ตั้งไว้
      doc.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);

      const filename = `${Product.Product_name}_${Product.Product_model}_${Product.width}_${Product.depth}_${Product.height}.pdf`;
      
      // ดาวน์โหลดไฟล์ PDF
      doc.save(filename);
    });
  };

  const btnbackpage = () => {
    router.back();
  };

  const windownreload = () => {
    window.location.reload();
  };

  console.log(Product);

  return (
    <>
      <div className="d-flex fixed-top mt-5">
        <button className="btn btn-danger mx-5" onClick={() => btnbackpage()}>
          ย้อนกลับ
        </button>
        <button className="btn btn-danger mx-5" onClick={() => btnviewsale()}>
          Print
        </button>
        <button className="btn btn-warning" onClick={() => btnloadpfd()}>
          Download PDF
        </button>
      </div>
      <div id="pdf-content" className="width-print">
        <div className="row">
          <div className="col-12 ptk-font-header">
            เก้าอี้ {productReport?.[0]?.Product_name}/
            {productReport?.[0]?.Product_model}
          </div>
          <div className="col-12 ptk-border-fixed">
            <div className="row">
              <div className="col-4"></div>
              <div className="col-4">
                <Image
                  className="ptk-img-width"
                  src={`/${productReport?.[0]?.Product_img}/${productReport?.[0]?.Product_model}.jpg`}
                  width={10000}
                  height={10000}
                />
              </div>
              <div className="col-4"></div>
            </div>
          </div>
          <div className="col-12 ptk-font-description mt-3 ptk-line-header">
            FEATURES
          </div>
          {productReport.map((item, index) => (
            <div key={index} className="col-4 ptk-text-detail">
              {item.Access_name}
            </div>
          ))}
          <div className="ptk-line-header"></div>
          <div className="col-12 ptk-font-description mt-4 ptk-line-header">
            DESCRIPTIONS
          </div>
          <div className="row ptk-line-description">
            <div className="col-3 ptk-text-description">ราคาเฟอร์นิเจอร์</div>
            <div className="col-1 ptk-text-detail"></div>
            <div className="col-6 ptk-text-detail">000,000 บาท</div>
          </div>
          <div className="row ptk-line-description">
            <div className="col-3 ptk-text-description">ภาษีมูลค่าเพิ่ม</div>
            <div className="col-1 ptk-text-detail"></div>
            <div className="col-6 ptk-text-detail">000,000 บาท</div>
          </div>
          <div className="row ptk-line-description">
            <div className="col-3 ptk-text-description">
              ราคาเสนอรวมทั้งสิ้น
            </div>
            <div className="col-1 ptk-text-detail"></div>
            <div className="col-6 ptk-text-detail">000,000 บาท</div>
          </div>
          <div className="row ptk-line-description">
            <div className="col-3 ptk-text-description">กำหนดยืนราคา</div>
            <div className="col-1 ptk-text-detail"></div>
            <div className="col-6 ptk-text-detail">XX / XX / XXXX</div>
          </div>
          <div className="line-space-1"></div>
          <div className="row ptk-line-description">
            <div className="col-3 ptk-text-description">พนักพิง</div>
            <div className="col-1 ptk-text-detail"></div>
            <div className="col-6 ptk-text-detail">XXXXXXXXXX</div>
          </div>
          <div className="row ptk-line-description">
            <div className="col-3 ptk-text-description">เบาะนั่ง</div>
            <div className="col-1 ptk-text-detail"></div>
            <div className="col-6 ptk-text-detail">XXXXXXXXXX</div>
          </div>
          <div className="line-space-2"></div>
        </div>
      </div>
    </>
  );
}

export default index;
