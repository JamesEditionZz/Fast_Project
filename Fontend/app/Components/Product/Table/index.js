"use client";
import {React, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import "./Product.css";

export const dynamic = "force-dynamic";

function index() {
  const routes = useRouter();
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  const selectedProduct = data ? JSON.parse(decodeURIComponent(data)) : null;

  const [product, setProduct] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [checkflip, setCheckFlip] = useState(false);
  const [checkelectric, setCheckElectric] = useState(false);
  const [checkscreen, setCheckScreen] = useState(false);
  const [checksnake, setCheckSnake] = useState();
  const [position, setPosition] = useState(["ซ้าย", "กลาง", "ขวา"]);
  const [dataScreen, setDataScreen] = useState([]);
  const [dataFlip, setDataFlip] = useState([]);
  const [dataEletric, setDataEletric] = useState([]);
  const [dataSnake, setDataSnake] = useState([]);
  const [selectpositionflip, setSelectedPositionFlip] = useState("");
  const [selectpositionelectric, setSelectedPositionElectric] = useState("");

  const [color, setColor] = useState("ML1");
  const [modesty, setModesty] = useState();
  const [modalFlip, setModalFlip] = useState();
  const [modalElectric, setModalElectric] = useState();
  const [modalSnake, setModalSnake] = useState();
  const [modalScreen, setModalScreen] = useState();
  const [textother, setTextOther] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Accessories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedProduct }),
        });

        const data = await res.json();
        setProduct(data);
        setHasFetched(true);
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedProduct && !hasFetched) {
      // ตรวจสอบว่า selectedProduct ไม่ได้เป็นค่า undefined หรือ null
      fetchData();
    }
  }, [selectedProduct, hasFetched]); // useEffect จะทำงานเมื่อ selectedProduct มีการเปลี่ยนแปลง

  const CheckScreen = async (e) => {
    setCheckScreen(e);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Screen`);
      const response = await res.json();

      setDataScreen(response);
    } catch (error) {
      console.error(error);
    }
  };

  const checkboxflip = async (e) => {
    setCheckFlip(e);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Flip`);
      const response = await res.json();

      setDataFlip(response);
    } catch (error) {
      console.error(error);
    }
  };

  const CheckboxElec = async (e) => {
    setCheckElectric(e);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Electric`);
      const response = await res.json();

      setDataEletric(response);
    } catch (error) {
      console.error(error);
    }
  };

  const CheckboxSnake = async (e) => {
    setCheckSnake(e);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Snake`);
      const response = await res.json();

      setDataSnake(response);
    } catch (error) {
      console.error(error);
    }
  };

  const backpage = () => {
    routes.back();
  };

  const SubmitReport = () => {
    const Acccolor = color;
    const Accmodesty = modesty;
    const Accscreen = modalScreen;
    const Accflip = modalFlip;
    const Accflipposition = selectpositionflip;
    const AccElectric = modalElectric;
    const AccElectricposition = selectpositionelectric;
    const AccSnake = modalSnake;

    const dataProduct = encodeURIComponent(JSON.stringify(data));

    routes.push(
      `../Report?data=${dataProduct}&color=${Acccolor}&modesty=${Accmodesty}&screen=${Accscreen}&flip=${Accflip}&positionflip=${Accflipposition}&Electric=${AccElectric}&postionelectric=${AccElectricposition}&Snake=${AccSnake}&other=${textother}`
    );
  };

  const handleModel = () => {
    setShowCatalog(!showCatalog);
  };

  console.log(product);
  

  return (
    <>
      {selectedProduct.type == "Chair" && (
        <div className="container animation-opacity bg-white">
          <div className="row">
            <div className="col-6 border-box">
              <h4 align="center" className="mt-3">
                Accessories
              </h4>
              <div className="row border-Accesseries">
                <div className="col-12">
                  <span className="h6">Color : </span>
                  {product.map((color, index) => (
                    <>
                      <input
                        type="radio"
                        name="Color"
                        className="m-3"
                        value={color.Product_Color}
                        onChange={() => setColor(color.Product_Color)}
                      />
                      <label className="font-size-3">
                        {color.Product_Color}
                      </label>
                    </>
                  ))}
                </div>
              </div>
              <div className="row border-Accesseries">
                <div className="col-3">
                  <div>
                    <input
                      type="checkbox"
                      name="modesty"
                      className="m-3"
                      onChange={() => setModesty("modesty")}
                    />
                    <label className="font-size-3">Modesty</label>
                  </div>
                </div>
                <div className="col-3"></div>
                <div className="col-3">
                  <div>
                    <input
                      type="checkbox"
                      name="Screen"
                      className="m-3"
                      onChange={(e) => CheckScreen(e.target.checked)}
                    />
                    <label className="font-size-3">Screen</label>
                  </div>
                </div>
                <div className="col-3 p-1">
                  {checkscreen == true && (
                    <select
                      className="form-select"
                      onChange={(e) => setModalScreen(e.target.value)}
                    >
                      <option disabled selected value="">
                        เลือกแบบ Screen
                      </option>
                      {dataScreen.map((item, index) => (
                        <option key={index} value={item.Access_name}>
                          {item.Access_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="border-Accesseries row">
                <div className="col-5">
                  <input
                    type="checkbox"
                    name="modesty"
                    className="m-3"
                    onChange={(e) => checkboxflip(e.target.checked)}
                  />
                  <label className="font-size-3">Flip</label>
                </div>
                <div className="col-6 p-1">
                  {checkflip == true && (
                    <>
                      <div className="row">
                        <div className="col-4">
                          <select
                            className="form-select"
                            onChange={(e) => setModalFlip(e.target.value)}
                          >
                            <option disabled selected>
                              รุ่น
                            </option>
                            {dataFlip.map((item, index) => (
                              <option key={index}>{item.Access_name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-6">
                          <select
                            className="form-select"
                            onChange={(e) =>
                              setSelectedPositionFlip(e.target.value)
                            }
                          >
                            <option disabled selected>
                              เลือกตำแหน่ง
                            </option>
                            {position.map((item, index) => (
                              <option
                                key={index}
                                value={item}
                                disabled={item === selectpositionelectric}
                              >
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="border-Accesseries row">
                <div className="col-5">
                  <input
                    type="checkbox"
                    name="modesty"
                    className="m-3"
                    onChange={(e) => CheckboxElec(e.target.checked)}
                  />
                  <label className="font-size-3">ช่องร้อยสายไฟ</label>
                </div>
                <div className="col-6 p-1">
                  {checkelectric == true && (
                    <>
                      <div className="row">
                        <div className="col-4">
                          <select
                            className="form-select"
                            onChange={(e) => setModalElectric(e.target.value)}
                          >
                            <option disabled selected>
                              รุ่น
                            </option>
                            {dataEletric.map((item, index) => (
                              <option key={index} value={item.Access_name}>
                                {item.Access_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-6">
                          <select
                            className="form-select"
                            onChange={(e) =>
                              setSelectedPositionElectric(e.target.value)
                            }
                          >
                            <option disabled selected>
                              เลือกตำแหน่ง
                            </option>
                            {position.map((item, index) => (
                              <option
                                key={index}
                                value={item}
                                disabled={item === selectpositionflip}
                              >
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="border-Accesseries row">
                <div className="col-5">
                  <input
                    type="checkbox"
                    name="modesty"
                    className="m-3"
                    onChange={(e) => CheckboxSnake(e.target.checked)}
                  />
                  <label className="font-size-3">Vertical Wireway</label>
                </div>
                {checksnake === true && (
                  <div className="col-3 p-1">
                    <select
                      className="form-select"
                      onChange={(e) => setModalSnake(e.target.value)}
                    >
                      <option disabled selected>
                        รุ่น
                      </option>
                      {dataSnake.map((item, index) => (
                        <option key={index} value={item.Access_name}>
                          {item.Access_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="border-Accesseries row">
                <div className="col-12 p-1">
                  <textarea
                    className="form-control"
                    id="txtarea"
                    placeholder="รายละเอียดเพิ่มเติม"
                    rows={10}
                    cols={75}
                    onChange={(e) => setTextOther(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="col-6 img-box">
              <div className="row">
                <div className="col-6 img-box">
                  {[...new Set(product.map((item) => item.Product_img))].map(
                    (img, index) => (
                      <>
                        <Image
                          key={index}
                          className="img-width"
                          src={`${process.env.NEXT_PUBLIC_API_URL}${img}`}
                          width={1000}
                          height={1000}
                          alt={img}
                        />
                      </>
                    )
                  )}
                </div>
                <div className="col-6 p-3 img-box">
                  {[...new Set(product.map((item) => item.Product_name))].map(
                    (product, index) => (
                      <>
                        <label>รุ่น :</label>
                        <label className="mx-2" key={index}>
                          {product}
                        </label>
                      </>
                    )
                  )}
                  <hr />
                  {[...new Set(product.map((item) => item.Product_type))].map(
                    (type, index) => (
                      <>
                        <label>ประเภท :</label>
                        <label className="mx-2" key={index}>
                          {type}
                        </label>
                      </>
                    )
                  )}
                  <hr />
                  {[...new Set(product.map((item) => item.Product_width))].map(
                    (width, index) => (
                      <>
                        <label>กว้าง :</label>
                        <label className="mx-2" key={index}>
                          {width}
                        </label>
                      </>
                    )
                  )}
                  <hr />
                  {[...new Set(product.map((item) => item.Product_height))].map(
                    (height, index) => (
                      <>
                        <label>ยาว :</label>
                        <label className="mx-2" key={index}>
                          {height}
                        </label>
                      </>
                    )
                  )}
                  <hr />
                  {[...new Set(product.map((item) => item.Product_depth))].map(
                    (depth, index) => (
                      <>
                        <label>ลึก :</label>
                        <label className="mx-2" key={index}>
                          {depth}
                        </label>
                      </>
                    )
                  )}
                </div>
              </div>
              {/* <div className="col-12 d-flex justify-content-center mt-5 p-5">
              <>
                <button className="btn btn-primary" onClick={handleModel}>
                  ดูแคตตาล๊อค
                </button>
              </>
            </div> */}
            </div>
          </div>
          <div className="mt-3 d-flex justify-content-between">
            <button className="btn btn-secondary" onClick={backpage}>
              ย้อนกลับ
            </button>
            <button className="btn btn-danger" onClick={SubmitReport}>
              ถัดไป
            </button>
          </div>
        </div>
      )}
      {selectedProduct.type == "Table" && (
        <div className="container animation-opacity bg-white">
          <div className="row">
            <div className="col-6 border-box">
              <h4 align="center" className="mt-3">
                Accessories
              </h4>
              <div className="row border-Accesseries">
                <div className="col-12">
                  <span className="h6">Color : </span>
                  {product.map((color, index) => (
                    <>
                      <input
                        type="radio"
                        name="Color"
                        className="m-3"
                        value={color.Product_Color}
                        onChange={() => setColor(color.Product_Color)}
                      />
                      <label className="font-size-3">
                        {color.Product_Color}
                      </label>
                    </>
                  ))}
                </div>
              </div>
              <div className="row border-Accesseries">
                <div className="col-3">
                  <div>
                    <input
                      type="checkbox"
                      name="modesty"
                      className="m-3"
                      onChange={() => setModesty("modesty")}
                    />
                    <label className="font-size-3">Modesty</label>
                  </div>
                </div>
                <div className="col-3"></div>
                <div className="col-3">
                  <div>
                    <input
                      type="checkbox"
                      name="Screen"
                      className="m-3"
                      onChange={(e) => CheckScreen(e.target.checked)}
                    />
                    <label className="font-size-3">Screen</label>
                  </div>
                </div>
                <div className="col-3 p-1">
                  {checkscreen == true && (
                    <select
                      className="form-select"
                      onChange={(e) => setModalScreen(e.target.value)}
                    >
                      <option disabled selected value="">
                        เลือกแบบ Screen
                      </option>
                      {dataScreen.map((item, index) => (
                        <option key={index} value={item.Access_name}>
                          {item.Access_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="border-Accesseries row">
                <div className="col-5">
                  <input
                    type="checkbox"
                    name="modesty"
                    className="m-3"
                    onChange={(e) => checkboxflip(e.target.checked)}
                  />
                  <label className="font-size-3">Flip</label>
                </div>
                <div className="col-6 p-1">
                  {checkflip == true && (
                    <>
                      <div className="row">
                        <div className="col-4">
                          <select
                            className="form-select"
                            onChange={(e) => setModalFlip(e.target.value)}
                          >
                            <option disabled selected>
                              รุ่น
                            </option>
                            {dataFlip.map((item, index) => (
                              <option key={index}>{item.Access_name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-6">
                          <select
                            className="form-select"
                            onChange={(e) =>
                              setSelectedPositionFlip(e.target.value)
                            }
                          >
                            <option disabled selected>
                              เลือกตำแหน่ง
                            </option>
                            {position.map((item, index) => (
                              <option
                                key={index}
                                value={item}
                                disabled={item === selectpositionelectric}
                              >
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="border-Accesseries row">
                <div className="col-5">
                  <input
                    type="checkbox"
                    name="modesty"
                    className="m-3"
                    onChange={(e) => CheckboxElec(e.target.checked)}
                  />
                  <label className="font-size-3">ช่องร้อยสายไฟ</label>
                </div>
                <div className="col-6 p-1">
                  {checkelectric == true && (
                    <>
                      <div className="row">
                        <div className="col-4">
                          <select
                            className="form-select"
                            onChange={(e) => setModalElectric(e.target.value)}
                          >
                            <option disabled selected>
                              รุ่น
                            </option>
                            {dataEletric.map((item, index) => (
                              <option key={index} value={item.Access_name}>
                                {item.Access_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-6">
                          <select
                            className="form-select"
                            onChange={(e) =>
                              setSelectedPositionElectric(e.target.value)
                            }
                          >
                            <option disabled selected>
                              เลือกตำแหน่ง
                            </option>
                            {position.map((item, index) => (
                              <option
                                key={index}
                                value={item}
                                disabled={item === selectpositionflip}
                              >
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="border-Accesseries row">
                <div className="col-5">
                  <input
                    type="checkbox"
                    name="modesty"
                    className="m-3"
                    onChange={(e) => CheckboxSnake(e.target.checked)}
                  />
                  <label className="font-size-3">Vertical Wireway</label>
                </div>
                {checksnake === true && (
                  <div className="col-3 p-1">
                    <select
                      className="form-select"
                      onChange={(e) => setModalSnake(e.target.value)}
                    >
                      <option disabled selected>
                        รุ่น
                      </option>
                      {dataSnake.map((item, index) => (
                        <option key={index} value={item.Access_name}>
                          {item.Access_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="border-Accesseries row">
                <div className="col-12 p-1">
                  <textarea
                    className="form-control"
                    id="txtarea"
                    placeholder="รายละเอียดเพิ่มเติม"
                    rows={10}
                    cols={75}
                    onChange={(e) => setTextOther(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="col-6 img-box">
              <div className="row">
                <div className="col-6 img-box">
                  {[...new Set(product.map((item) => item.Product_img))].map(
                    (img, index) => (
                      <>
                        <Image
                          key={index}
                          className="img-width"
                          src={`${process.env.NEXT_PUBLIC_API_URL}${img}`}
                          width={1000}
                          height={1000}
                          alt={img}
                        />
                      </>
                    )
                  )}
                </div>
                <div className="col-6 p-3 img-box">
                  {[...new Set(product.map((item) => item.Product_name))].map(
                    (product, index) => (
                      <>
                        <label>รุ่น :</label>
                        <label className="mx-2" key={index}>
                          {product}
                        </label>
                      </>
                    )
                  )}
                  <hr />
                  {[...new Set(product.map((item) => item.Product_type))].map(
                    (type, index) => (
                      <>
                        <label>ประเภท :</label>
                        <label className="mx-2" key={index}>
                          {type}
                        </label>
                      </>
                    )
                  )}
                  <hr />
                  {[...new Set(product.map((item) => item.Product_width))].map(
                    (width, index) => (
                      <>
                        <label>กว้าง :</label>
                        <label className="mx-2" key={index}>
                          {width}
                        </label>
                      </>
                    )
                  )}
                  <hr />
                  {[...new Set(product.map((item) => item.Product_height))].map(
                    (height, index) => (
                      <>
                        <label>ยาว :</label>
                        <label className="mx-2" key={index}>
                          {height}
                        </label>
                      </>
                    )
                  )}
                  <hr />
                  {[...new Set(product.map((item) => item.Product_depth))].map(
                    (depth, index) => (
                      <>
                        <label>ลึก :</label>
                        <label className="mx-2" key={index}>
                          {depth}
                        </label>
                      </>
                    )
                  )}
                </div>
              </div>
              {/* <div className="col-12 d-flex justify-content-center mt-5 p-5">
              <>
                <button className="btn btn-primary" onClick={handleModel}>
                  ดูแคตตาล๊อค
                </button>
              </>
            </div> */}
            </div>
          </div>
          <div className="mt-3 d-flex justify-content-between">
            <button className="btn btn-secondary" onClick={backpage}>
              ย้อนกลับ
            </button>
            <button className="btn btn-danger" onClick={SubmitReport}>
              ถัดไป
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default index;
