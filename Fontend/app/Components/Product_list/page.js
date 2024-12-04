"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../page.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Product_view from "../Product/Table/page";
import "./Product_list.css";

export default function page() {
  const router = useRouter();
  const [product, setProduct] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [product_model, setProduct_model] = useState("");
  const [lowPrice, setLowPrice] = useState(0);
  const [highPrice, setHighPrice] = useState(0);
  const [depth, setDepth] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [swiftpage, setSwiftPage] = useState("");
  const [viewoption, setViewOption] = useState(0);
  const [dataCatalog, setDataCatalog] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/equipment_list`
        );
        const fetchedData = await response.json();

        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleprice = async (event) => {
    const price_rang = event.target.value;

    if (price_rang === "low") {
      const sortedDatalow = [...data].sort(
        (a, b) => a.Product_price - b.Product_price
      );
      setData(sortedDatalow);
    } else if (price_rang === "high") {
      const sortedDatahigh = [...data].sort(
        (a, b) => b.Product_price - a.Product_price
      );
      setData(sortedDatahigh);
    }
  };

  const handleSelected = async (Product_model) => {
    setProduct_model(Product_model);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/model`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Product_model }),
      });

      const data = await res.json();

      setProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  const btnbackpage = () => {
    setSwiftPage(true);
    setTimeout(() => {
      router.push("../../");
    }, 1000);
  };

  const CheckSizeDepth = (depth) => {
    setDepth(depth);
    CheckSize(depth, width, height);
  };

  const CheckSizeWidth = (width) => {
    setWidth(width);
    CheckSize(depth, width, height);
  };

  const CheckSizeHeight = (height) => {
    setHeight(height);
    CheckSize(depth, width, height);
  };

  const CheckSize = async (depth, width, height) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checksize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ depth, width, height, product_model }),
      });

      const data = await res.json();

      setFilteredData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const checksearch = (e) => {
    setViewOption(e);
    setFilteredData([]);
    setSelectedProduct(null);
    setLowPrice(0);
    setHighPrice(0);
    setDepth(0);
    setWidth(0);
    setHeight(0);
  };

  const searchlowprice = (lowPrice) => {
    setLowPrice(lowPrice);
    searchprice(lowPrice, highPrice);
  };

  const searchhighprice = (highPrice) => {
    setHighPrice(highPrice);
    searchprice(lowPrice, highPrice);
  };

  const searchprice = async (lowPrice, highPrice) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkprice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lowPrice, highPrice, product_model }),
      });

      const data = await res.json();

      setFilteredData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const selectitem = async (type) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/selectItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, product_model }),
      });

      const data = await res.json();

      setFilteredData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    const productData = encodeURIComponent(JSON.stringify(selectedProduct));
    router.push(`../Components/Product/Table?data=${productData}`);
  };

  const cancelModel = () => {
    setProduct(0);
    setFilteredData([]);
    setViewOption(0);
    setSelectedProduct(null);
    setLowPrice(0);
    setHighPrice(0);
    setDepth(0);
    setWidth(0);
    setHeight(0);
  };
  

  return (
    <div>
      {product > "" && (
        <div className="modal-select" style={{ display: "flex" }}>
          <div className="modal-option animation-modal">
            <div className="row">
              <div className="col-12">
                <select
                  className="form-select mb-2"
                  onChange={(e) => checksearch(e.target.value)}
                >
                  <option selected disabled>
                    เลือกประเภทค้นหา
                  </option>
                  <option value={1}>ค้นหาตามขนาด</option>
                  <option value={2}>ค้นหาตามราคา</option>
                  <option value={3}>ค้นหาประเภท</option>
                </select>
              </div>
            </div>

            {viewoption == 1 && (
              <div className="row mb-3 mt-2">
                <div className="col-4">
                  <label>ความกว้าง/ยาว (W)</label>
                  <select
                    className="form-select"
                    onChange={(e) => CheckSizeWidth(e.target.value)}
                  >
                    <option value="" selected disabled>
                      เลือกความกว้าง
                    </option>
                    {[
                      ...new Set(product.map((item) => item.Product_width)),
                    ].map((width, index) => (
                      <option key={index}>{width}</option>
                    ))}
                  </select>
                </div>
                <div className="col-4">
                  <label>ความลึก (D)</label>
                  <select
                    className="form-select"
                    onChange={(e) => CheckSizeDepth(e.target.value)}
                  >
                    <option value="" selected disabled>
                      เลือกความลึก
                    </option>
                    {[
                      ...new Set(product.map((item) => item.Product_depth)),
                    ].map((depth, index) => (
                      <option key={index}>{depth}</option>
                    ))}
                  </select>
                </div>
                <div className="col-4">
                  <label>ความสูง (H)</label>
                  <select
                    className="form-select"
                    onChange={(e) => CheckSizeHeight(e.target.value)}
                  >
                    <option selected disabled>
                      เลือกความสูง
                    </option>
                    {[
                      ...new Set(product.map((item) => item.Product_height)),
                    ].map((height, index) => (
                      <option key={index}>{height}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {viewoption == 2 && (
              <div className="row mb-3 mt-2">
                <div className="col-3">
                  <input
                    className="form-control"
                    placeholder="ราคาต่ำสุด"
                    onChange={(e) => searchlowprice(e.target.value)}
                  />
                </div>
                <div className="col-3">
                  <input
                    className="form-control"
                    placeholder="ราคาสูงสุด"
                    onChange={(e) => searchhighprice(e.target.value)}
                  />
                </div>
              </div>
            )}
            {viewoption == 3 && (
              <div className="row mb-3 mt-2">
                <div className="col-12">
                  <select
                    className="form-select mb-2"
                    onChange={(e) => selectitem(e.target.value)}
                  >
                    <option selected disabled>
                      เลือกประเภท
                    </option>
                    {[
                      ...new Set(product.map((item) => item.Product_category)),
                    ].map((type, index) => (
                      <option key={index}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div className="view-option row mt-2">
              {filteredData.length > 0
                ? filteredData.map((item, index) => (
                    <div
                      className={`col-3 select-product`}
                      key={index}
                      onClick={() =>
                        setSelectedProduct({
                          Product_name: item.Product_name,
                          category: item.Product_category,
                          type: item.Product_type,
                          img: item.Product_img,
                          depth: item.Product_depth,
                          width: item.Product_width,
                          height: item.Product_height,
                        })
                      }
                      style={{
                        border:
                          selectedProduct?.Product_name === item.Product_name &&
                          selectedProduct?.category === item.Product_category &&
                          selectedProduct?.type === item.Product_type &&
                          selectedProduct?.img === item.Product_img &&
                          selectedProduct?.depth === item.Product_depth &&
                          selectedProduct?.width === item.Product_width &&
                          selectedProduct?.height === item.Product_height
                            ? "2px solid rgb(136, 111, 111)"
                            : "none",
                      }}
                    >
                      <div className="row">
                        <div className="col-12 d-flex justify-content-center">
                          <Image
                            className="image-width"
                            src={`${process.env.NEXT_PUBLIC_API_URL}${item.Product_img}`}
                            width={1000}
                            height={1000}
                            alt="table"
                          />
                        </div>
                        <div className="col-12 text-center">
                          {item.Product_model}
                        </div>
                        <div className="col-12 text-center">
                          {item.Product_width} * {item.Product_depth} *{" "}
                          {item.Product_height}
                        </div>
                      </div>
                    </div>
                  ))
                : lowPrice === 0 &&
                  highPrice === 0 &&
                  depth === 0 &&
                  width === 0 &&
                  height === 0 &&
                  product.map((item, index) => (
                    <>
                      <div
                        className="col-3 h-50 select-product mt-2"
                        key={index}
                        onClick={() =>
                          setSelectedProduct({
                            Product_name: item.Product_name,
                            category: item.Product_category,
                            type: item.Product_type,
                            img: item.Product_img,
                            depth: item.Product_depth,
                            width: item.Product_width,
                            height: item.Product_height,
                          })
                        }
                        style={{
                          border:
                            JSON.stringify(selectedProduct) ===
                            JSON.stringify({
                              Product_name: item.Product_name,
                              category: item.Product_category,
                              type: item.Product_type,
                              img: item.Product_img,
                              depth: item.Product_depth,
                              width: item.Product_width,
                              height: item.Product_height,
                            })
                              ? "2px solid rgb(136, 111, 111)"
                              : "none",
                        }}
                      >
                        <div className="row">
                          <div className="col-12 d-flex justify-content-center">
                            <Image
                              className="image-width"
                              src={`${process.env.NEXT_PUBLIC_API_URL}${item.Product_img}`}
                              width={1000}
                              height={1000}
                              alt="table"
                            />
                          </div>
                          <div className="col-12 text-center">
                            {item.Product_model}
                          </div>
                          <div className="col-12 text-center">
                            {item.Product_width} * {item.Product_depth} *{" "}
                            {item.Product_height}
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn btn-danger mx-3"
                onClick={() => {
                  cancelModel();
                }}
              >
                <div>ยกเลิก</div>
              </button>
              <button className="btn btn-success" onClick={handleSubmit}>
                <div>ตกลง</div>
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className={`container animation-opacity ${
          swiftpage ? "animation-bottom-return" : ""
        }`}
      >
        <div className="frame-order">
          <div className="row animation-opacity">
            {[
              ...new Map(
                data.map((item) => [item.Product_name, item])
              ).values(),
            ].map((item, index) => (
              <div
                className="col-2 selector text-center"
                key={index}
                onClick={() => handleSelected(item.Product_name)} // ส่ง Product_name เมื่อกดเลือก
              >
                <div className="col-12">
                  <Image
                    className="view-image"
                    src={`${process.env.NEXT_PUBLIC_API_URL}${item.Product_img}`}
                    width={1000}
                    height={1000}
                    alt={`${item.Product_name}`}
                  />
                </div>
                <div className="col-12 d-flex justify-content-center">{item.Product_name}</div>
              </div>
            ))}
          </div>
        </div>
        {dataCatalog && (
          <div>
            <button className="btn btn-danger mt-3" onClick={btnbackpage}>
              <div>ย้อนกลับ</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
