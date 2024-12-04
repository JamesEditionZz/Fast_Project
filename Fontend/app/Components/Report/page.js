"use client";
import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import "./sale.css";
import "./ptk.css";
import html2pdf from "html2pdf.js";

function page() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  const modesty = searchParams.get("modesty");
  const screen = searchParams.get("screen");
  const color = searchParams.get("color");
  const flip = searchParams.get("flip");
  const Flipposition = searchParams.get("positionflip");
  const Electric = searchParams.get("Electric");
  const Electricposition = searchParams.get("postionelectric");
  const Snake = searchParams.get("Snake");
  const Other = searchParams.get("other");
  const Product = data ? JSON.parse(decodeURIComponent(data)) : {};

  const [productreport, setProductReport] = useState([]);
  const [viewpresale, setViewPreSale] = useState(0);
  const [datamodesty, setDataModesty] = useState([]);
  const [datascreen, setDataScreen] = useState([]);
  const [dataflip, setDataFlip] = useState([]);
  const [datawireway, setDataWireway] = useState([]);
  const [dataelectric, setDataElectric] = useState([]);

  const Product_header = JSON.parse(Product);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8001/api/ProductReport`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Product,
            color,
          }), // ใช้ data จาก query string
        });

        const result = await res.json(); // ใช้ชื่อ 'result' แทน 'data' เพื่อหลีกเลี่ยงการซ้ำซ้อน

        setProductReport(result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [data]); // useEffect จะทำงานเมื่อ selectedProduct มีการเปลี่ยนแปลง

  if (modesty) {
    useEffect(() => {
      const imgmodesty = async () => {
        try {
          const res = await fetch(`http://localhost:8001/api/Report/modesty`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ modesty }),
          });

          const response = await res.json();

          setDataModesty(response);
        } catch (error) {
          console.error(error);
        }
      };
      imgmodesty();
    }, []);
  }

  if (screen) {
    useEffect(() => {
      const imgscreen = async () => {
        try {
          const res = await fetch(`http://localhost:8001/api/Report/Screen`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ screen }),
          });

          const response = await res.json();

          setDataScreen(response);
        } catch (error) {
          console.error(error);
        }
      };
      imgscreen();
    }, []);
  }

  if (flip) {
    useEffect(() => {
      const imgFlip = async () => {
        try {
          const res = await fetch(`http://localhost:8001/api/Report/Flip`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ flip }),
          });

          const response = await res.json();

          setDataFlip(response);
        } catch (error) {
          console.error(error);
        }
      };
      imgFlip();
    }, []);
  }

  if (Snake) {
    useEffect(() => {
      const imgWireway = async () => {
        try {
          const res = await fetch(`http://localhost:8001/api/Report/Wireway`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Snake }),
          });

          const response = await res.json();

          setDataWireway(response);
        } catch (error) {
          console.error(error);
        }
      };
      imgWireway();
    }, []);
  }

  if (Electric) {
    useEffect(() => {
      const imgElectric = async () => {
        try {
          const res = await fetch(`http://localhost:8001/api/Report/Electric`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Electric }),
          });

          const response = await res.json();

          setDataElectric(response);
        } catch (error) {
          console.error(error);
        }
      };
      imgElectric();
    }, []);
  }

  const btnviewsale = () => {
    window.print();
  };

  const btnloadpfd = () => {
    setViewPreSale(1);
    const element = contentRef.current;

    const options = {
      margin: [8, 17, 0, 13],
      filename: `${Product_header.Product_name}/${Product_header.type}/${Product_header.width}/${Product_header.depth}/${Product_header.height}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(options).save();

    setTimeout(() => {
      windownreload();
    }, 500);
  };

  const btnbackpage = () => {
    router.back()
  }

  const windownreload = () => {
    window.location.reload();
  };

  console.log(productreport);
  

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
      {viewpresale == 0 && (
        <div className="width-print">
          {productreport.map((item) => (
            <div className="row">
              <div className="col-12 ptk-font-header">
                {Product_header.type} {Product_header.Product_name} / {productreport[0].Product_model}
              </div>
              <div className="col-12 ptk-border-fixed">
                <div className="row">
                  <div className="col-4"></div>
                  <div className="col-4">
                    <Image
                      className="ptk-img-width"
                      src={`http://localhost:8001${item.Product_img}`}
                      width={10000}
                      height={10000}
                    />
                  </div>
                  <div className="col-4"></div>
                </div>
              </div>
              {(modesty !== "undefined" ||
                screen !== "undefined" ||
                flip !== "undefined" ||
                Electric !== "undefined" ||
                Snake !== "undefined") && (
                <div className="mb-4">
                  <div className="col-12 ptk-font-accessories">ACCESSORIES</div>
                  <div className="col-12 w-100">
                    <div className="row">
                      {modesty != "undefined" && (
                        <div className="ptk-col-2-accessories">
                          <div className="row">
                            <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories ptk-border-top ptk-border-left text-center">
                              FG________
                            </div>
                            {datamodesty.map((item) => (
                              <>
                                <div className="col-12 ptk-border-box-accessories ptk-border-left text-center">
                                  <Image
                                    className="ptk-img-accessories"
                                    src={`http://localhost:8001${item.Access_img}`}
                                    width={1000}
                                    height={1000}
                                  />
                                </div>
                                <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories ptk-border-left text-center">
                                  <div className="col-12" align="center">
                                    <label>Modesty</label>
                                  </div>
                                </div>
                              </>
                            ))}
                            <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories ptk-border-left text-center">
                              <label>
                                {item.Product_width} x {item.Product_depth} x{" "}
                                {item.Product_height}
                              </label>
                            </div>
                            <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories ptk-border-left text-center">
                              <label>1</label>
                            </div>
                          </div>
                        </div>
                      )}
                      {screen != "undefined" && (
                        <div className="ptk-col-2-accessories">
                          <div className="row">
                            <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories ptk-border-top text-center">
                              FG________
                            </div>
                            {datascreen.map((item) => (
                              <>
                                <div className="col-12 ptk-border-box-accessories text-center">
                                  <Image
                                    className="ptk-img-accessories"
                                    src={`http://localhost:8001${item.Access_img}`}
                                    width={1000}
                                    height={1000}
                                  />
                                </div>
                                <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories text-center">
                                  <div className="col-12" align="center">
                                    <label>Screen</label>
                                  </div>
                                </div>
                                <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories text-center">
                                  <label>{item.Access_name}</label>
                                </div>
                              </>
                            ))}
                            <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories text-center">
                              <label>1</label>
                            </div>
                          </div>
                        </div>
                      )}
                      {flip != "undefined" && (
                        <div className="ptk-col-2-accessories">
                          <div className="row">
                            <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories ptk-border-top ptk-border-top text-center">
                              FG________
                            </div>
                            {dataflip.map((item) => (
                              <>
                                <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories text-center">
                                  <Image
                                    className="ptk-img-accessories"
                                    src={`http://localhost:8001${item.Access_img}`}
                                    width={1000}
                                    height={1000}
                                  />
                                </div>
                                <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories text-center">
                                  <div className="col-12" align="center">
                                    <label>Flip Outlet</label>
                                  </div>
                                </div>
                                <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories text-center">
                                  <label>{item.Access_name}</label>
                                </div>
                              </>
                            ))}
                            <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories text-center">
                              <label>1</label>
                            </div>
                          </div>
                        </div>
                      )}
                      {Snake != "undefined" && (
                        <div className="ptk-col-2-accessories">
                          <div className="row">
                            <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories ptk-border-top text-center">
                              FG________
                            </div>
                            {datawireway.map((item) => (
                              <>
                                <div className="col-12 ptk-border-box-accessories text-center">
                                  <Image
                                    className="ptk-img-accessories"
                                    src={`http://localhost:8001${item.Access_img}`}
                                    width={1000}
                                    height={1000}
                                  />
                                </div>
                                <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories text-center">
                                  <div className="col-12" align="center">
                                    <label>Vertical Wireway</label>
                                  </div>
                                </div>
                                <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories text-center">
                                  <label>{item.Access_name}</label>
                                </div>
                              </>
                            ))}
                            <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories text-center">
                              <label>1</label>
                            </div>
                          </div>
                        </div>
                      )}
                      {Electric != "undefined" && (
                        <div className="ptk-col-2-accessories">
                          <div className="row">
                            <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories ptk-border-top text-center">
                              FG________
                            </div>
                            {dataelectric.map((item) => (
                              <>
                                <div className="col-12 ptk-border-box-accessories text-center">
                                  <Image
                                    className="ptk-img-accessories"
                                    src={`http://localhost:8001${item.Access_img}`}
                                    width={1000}
                                    height={1000}
                                  />
                                </div>
                                <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories text-center">
                                  <div className="col-12" align="center">
                                    <label>ช่องร้อยสายไฟ</label>
                                  </div>
                                </div>
                                <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories text-center">
                                  <label>{item.Access_name}</label>
                                </div>
                              </>
                            ))}
                            <div className="col-12 ptk-border-box-accessories ptk-font-text-accessories text-center">
                              <label>1</label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="col-12 ptk-font-description mt-3 ptk-line-header">
                DESCRIPTIONS
              </div>
              <div className="row ptk-line-description">
                <div className="col-3 ptk-text-description">
                  ราคาเฟอร์นิเจอร์
                </div>
                <div className="col-2 ptk-text-detail"></div>
                <div className="col-6 ptk-text-detail">000,000 บาท</div>
              </div>
              <div className="row ptk-line-description">
                <div className="col-3 ptk-text-description">
                  ภาษีมูลค่าเพิ่ม
                </div>
                <div className="col-2 ptk-text-detail"></div>
                <div className="col-6 ptk-text-detail">000,000 บาท</div>
              </div>
              <div className="row ptk-line-description">
                <div className="col-3 ptk-text-description">
                  ราคาเสนอรวมทั้งสิ้น
                </div>
                <div className="col-2 ptk-text-detail"></div>
                <div className="col-6 ptk-text-detail">000,000 บาท</div>
              </div>
              <div className="row ptk-line-description">
                <div className="col-3 ptk-text-description">กำหนดยืนราคา</div>
                <div className="col-2 ptk-text-detail"></div>
                <div className="col-6 ptk-text-detail">XX / XX / XXXX</div>
              </div>
              <div className="line-space-1"></div>
              <div className="row ptk-line-description">
                <div className="col-3 ptk-text-description">ขนาด (มม.)</div>
                <div className="col-2 ptk-text-detail">กว้าง x ลึก x สูง</div>
                <div className="col-6 ptk-text-detail">
                  {item.Product_width} x {item.Product_depth} x{" "}
                  {item.Product_height}
                </div>
              </div>
              <div className="row ptk-line-description">
                <div className="col-3 ptk-text-description">TOP</div>
                <div className="col-2 ptk-text-detail"></div>
                <div className="col-6 ptk-text-detail">XXXXXXXXXX</div>
              </div>
              <div className="row ptk-line-description">
                <div className="col-3 ptk-text-description">ขา</div>
                <div className="col-2 ptk-text-detail"></div>
                <div className="col-6 ptk-text-detail">XXXXXXXXXX</div>
              </div>
              <div className="line-space-2"></div>
              {modesty != "undefined" && (
                <div className="row ptk-line-description">
                  <div className="col-3 ptk-text-description">
                    Modesty
                  </div>
                  <div className="col-2 ptk-text-detail"></div>
                  <div className="col-6 ptk-text-detail">{modesty}</div>
                </div>
              )}
              {screen != "undefined" && (
                <div className="row ptk-line-description">
                  <div className="col-3 ptk-text-description">Screen</div>
                  <div className="col-2 ptk-text-detail"></div>
                  <div className="col-6 ptk-text-detail">{screen}</div>
                </div>
              )}
              {flip != "undefined" && (
                <div className="row ptk-line-description">
                  <div className="col-3 ptk-text-description">Flip Outlet</div>
                  <div className="col-2 ptk-text-detail">{Flipposition}</div>
                  <div className="col-6 ptk-text-detail">{flip}</div>
                </div>
              )}
              {Snake != "undefined" && (
                <div className="row ptk-line-description">
                  <div className="col-3 ptk-text-description">
                    Vertical Wireway
                  </div>
                  <div className="col-2 ptk-text-detail"></div>
                  <div className="col-6 ptk-text-detail">{Snake}</div>
                </div>
              )}
              {Electric != "undefined" && (
                <div className="row ptk-line-description">
                  <div className="col-3 ptk-text-description">ช่องรอยสายไฟ</div>
                  <div className="col-2 ptk-text-detail">
                    {Electricposition}
                  </div>
                  <div className="col-6 ptk-text-detail">{Electric}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div ref={contentRef}>
        {viewpresale == 1 && (
          <div className="container">
            <div className="logo">
              <Image
                className="image-logo"
                src="/img/logo.png"
                width={120}
                height={70}
              />
            </div>

            {productreport.map((item) => (
              <div className="row">
                <div className="col-12 font-header">
                  {Product_header.type} {Product_header.Product_name}
                </div>
                <div className="col-12 border-fixed">
                  <div className="row">
                    <div className="col-4"></div>
                    <div className="col-4">
                      <Image
                        className="img-width"
                        src={`http://localhost:8001${item.Product_img}`}
                        width={10000}
                        height={10000}
                      />
                    </div>
                    <div className="col-4"></div>
                  </div>
                </div>
                {(modesty !== "undefined" ||
                  screen !== "undefined" ||
                  flip !== "undefined" ||
                  Electric !== "undefined" ||
                  Snake !== "undefined") && (
                  <>
                    <div className="col-12 font-accessories">ACCESSORIES</div>
                    <div className="col-12">
                      <div className="row">
                        {modesty != "undefined" && (
                          <div className="col-2-accessories border-left border-box">
                            <div className="row">
                              {datamodesty.map((item) => (
                                <>
                                  <div className="col-12 text-center">
                                    <Image
                                      className="img-accessories"
                                      src={`http://localhost:8001${item.Access_img}`}
                                      width={10000}
                                      height={10000}
                                    />
                                  </div>
                                  <div className="col-12 text-center">
                                    <div className="col-12" align="center">
                                      <label className="text-accessories">
                                        {item.Access_name}
                                      </label>
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                          </div>
                        )}
                        {screen != "undefined" && (
                          <div className="col-2-accessories border-box">
                            <div className="row">
                              {datascreen.map((item) => (
                                <>
                                  <div className="col-12 text-center">
                                    <Image
                                      className="img-accessories"
                                      src={`http://localhost:8001${item.Access_img}`}
                                      width={1000}
                                      height={1000}
                                    />
                                  </div>
                                  <div className="col-12 text-center">
                                    <div className="col-12" align="center">
                                      <label className="text-accessories">
                                        {item.Access_name}
                                      </label>
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                          </div>
                        )}
                        {flip != "undefined" && (
                          <div className="col-2-accessories border-box">
                            <div className="row">
                              {dataflip.map((item) => (
                                <>
                                  <div className="col-12 text-center">
                                    <Image
                                      className="img-accessories"
                                      src={`http://localhost:8001${item.Access_img}`}
                                      width={1000}
                                      height={1000}
                                    />
                                  </div>
                                  <div className="col-12 text-center">
                                    <div className="col-12" align="center">
                                      <label className="text-accessories">
                                        {item.Access_name}
                                      </label>
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                          </div>
                        )}
                        {Snake != "undefined" && (
                          <div className="col-2-accessories border-box">
                            <div className="row">
                              {datawireway.map((item) => (
                                <>
                                  <div className="col-12 text-center">
                                    <Image
                                      className="img-accessories"
                                      src={`http://localhost:8001${item.Access_img}`}
                                      width={1000}
                                      height={1000}
                                    />
                                  </div>
                                  <div className="col-12 text-center">
                                    <div className="col-12" align="center">
                                      <label className="text-accessories">
                                        {item.Access_name}
                                      </label>
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                          </div>
                        )}
                        {Electric != "undefined" && (
                          <div className="col-2-accessories border-box">
                            <div className="row">
                              {dataelectric.map((item) => (
                                <>
                                  <div className="col-12 text-center">
                                    <Image
                                      className="img-accessories"
                                      src={`http://localhost:8001${item.Access_img}`}
                                      width={1000}
                                      height={1000}
                                    />
                                  </div>
                                  <div className="col-12 text-center">
                                    <div className="col-12" align="center">
                                      <label className="text-accessories">
                                        {item.Access_name}
                                      </label>
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                <div className="col-12 font-description report-cm line-header">
                  DESCRIPTIONS
                </div>
                <div className="line-description">
                  <div className="row">
                    <div className="col-3 text-description">
                      ราคาเฟอร์นิเจอร์
                    </div>
                    <div className="col-2 text-detail"></div>
                    <div className="col-6 text-detail">000,000 บาท</div>
                  </div>
                </div>
                <br />
                <div className="line-description">
                  <div className="row">
                    <div className="col-3 text-description">
                      ภาษีมูลค่าเพิ่ม
                    </div>
                    <div className="col-2 text-detail"></div>
                    <div className="col-6 text-detail">000,000 บาท</div>
                  </div>
                </div>
                <div className="line-description">
                  <div className="row">
                    <div className="col-3 text-description">
                      ราคาเสนอรวมทั้งสิ้น
                    </div>
                    <div className="col-2 text-detail"></div>
                    <div className="col-6 text-detail">000,000 บาท</div>
                  </div>
                </div>
                <div className="line-description">
                  <div className="row">
                    <div className="col-3 text-description">กำหนดยืนราคา</div>
                    <div className="col-2 text-detail"></div>
                    <div className="col-6 text-detail">XX / XX / XXXX</div>
                  </div>
                </div>
                <div className="line-space-1"></div>
                <div className="line-space-1"></div>
                <div className="line-description">
                  <div className="row">
                    <div className="col-3 text-description">ขนาด (มม.)</div>
                    <div className="col-2 text-detail">กว้าง x ลึก x สูง</div>
                    <div className="col-6 text-detail">
                      {item.Product_width} x {item.Product_depth} x{" "}
                      {item.Product_height}
                    </div>
                  </div>
                </div>
                <div className="line-description">
                  <div className="row">
                    <div className="col-3 text-description">TOP</div>
                    <div className="col-2 text-detail"></div>
                    <div className="col-6 text-detail">XXXXXXXXXX</div>
                  </div>
                </div>
                <div className="line-description">
                  <div className="row">
                    <div className="col-3 text-description">ขา</div>
                    <div className="col-2 text-detail"></div>
                    <div className="col-6 text-detail">XXXXXXXXXX</div>
                  </div>
                </div>
                <div className="line-space-2"></div>
                {modesty != "undefined" && (
                  <div className="line-description">
                    <div className="row">
                      <div className="col-3 text-description">Modesty</div>
                      <div className="col-2 text-detail"></div>
                      <div className="col-6 text-detail">{modesty}</div>
                    </div>
                  </div>
                )}
                {screen != "undefined" && (
                  <div className="line-description">
                    <div className="row">
                      <div className="col-3 text-description">Screen</div>
                      <div className="col-2 text-detail"></div>
                      <div className="col-6 text-detail">{screen}</div>
                    </div>
                  </div>
                )}
                {flip != "undefined" && (
                  <div className="line-description">
                    <div className="row">
                      <div className="col-3 text-description">Flip Outlet</div>
                      <div className="col-2 text-detail">{Flipposition}</div>
                      <div className="col-6 text-detail">{flip}</div>
                    </div>
                  </div>
                )}
                {Snake != "undefined" && (
                  <div className="line-description">
                    <div className="row">
                      <div className="col-3 text-description">
                        Vertical Wireway
                      </div>
                      <div className="col-2 text-detail"></div>
                      <div className="col-6 text-detail">{Snake}</div>
                    </div>
                  </div>
                )}
                {Electric != "undefined" && (
                  <div className="line-description">
                    <div className="row">
                      <div className="col-3 text-description">ช่องรอยสายไฟ</div>
                      <div className="col-2 text-detail">
                        {Electricposition}
                      </div>
                      <div className="col-6 text-detail">{Electric}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default page;
