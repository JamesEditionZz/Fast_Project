"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import "./product.css";

function page() {
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [form_modal, setForm_Model] = useState(0);
  const [countcolor, setCountColor] = useState(1);

  const [product_Type, setProduct_type] = useState("");
  const [product_name, setProduct_name] = useState("");
  const [product_Model, setProduct_Model] = useState("");
  const [product_Category, setProduct_Category] = useState("");
  const [product_FG, setProduct_FG] = useState("");
  const [product_Width, setProduct_Width] = useState("");
  const [product_Depth, setProduct_Depth] = useState("");
  const [product_Height, setProduct_Height] = useState("");
  const [product_Price, setProduct_Price] = useState("");
  const [product_Ctype, setProduct_Ctype] = useState("");
  const [product_Cfunction, setProduct_Cfunction] = useState("");
  const [product_Cfeature, setProduct_Cfeature] = useState("");
  const [product_Color, setProduct_Color] = useState([]);
  const [pathFile, setPathFile] = useState("");
  const [product_Image, setProduct_Image] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 100;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPageProducts, setCurrentPageProducts] = useState([]);

  useEffect(() => {
    const datafecth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/backenddashboard/list_product`
        );
        const data = await response.json();
        setTotalPages(Math.ceil(data.length / itemsPerPage)); // Calculate total pages
        setCurrentPageProducts(data.slice(0, itemsPerPage));
        setProduct(data);
      } catch (error) {
        console.error("error", error);
      }
    };
    datafecth();
  }, []);

  useEffect(() => {
    const datafecth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/backenddashboard/list_group`
        );
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error("error", error);
      }
    };
    datafecth();
  }, []);

  const SearchItem = async (value) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/backenddashboard/searchItem`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ model: value }),
        }
      );
      const res = await response.json();

      setProduct(res);

      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const countinputcolor = () => {
    const inputcolor = countcolor + 1;
    if (inputcolor <= 5) {
      setCountColor(inputcolor);
    } else {
      alert("ไม่สามารถเพิ่มช่องสีได้อีก");
    }
  };

  const cancelModel = () => {
    setForm_Model(0);
    setCountColor(0);
  };

  const handleColorChange = (index, value) => {
    setProduct_Color((prev) => {
      const updatedColors = [...prev];
      updatedColors[index] = value; // Update the specific color
      return updatedColors;
    });
  };

  const handerImage = (e) => {
    setProduct_Image(e.target.files[0]);
  };

  const recordProduct = async () => {
    try {
      const fetchpostData = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/post/product`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            product_Type: product_Type,
            product_name: product_name,
            product_Model: product_Model,
            product_Category: product_Category,
            product_FG: product_FG,
            product_Width: product_Width,
            product_Depth: product_Depth,
            product_Height: product_Height,
            product_Price: product_Price,
            product_Ctype: product_Ctype,
            product_Cfunction: product_Cfunction,
            product_Cfeature: product_Cfeature,
            product_Color: product_Color,
            pathFile: pathFile,
            Image: product_Image.name,
          }), // No need to set content-type, as it is automatically handled by FormData
        }
      );

      const res = await fetchpostData.json();

      alert("บันทึกข้อมูลแล้ว")

      if (res === "true") {
        setForm_Model(0);
        setProduct_type("");
        setProduct_name("");
        setProduct_Model("");
        setProduct_Category("");
        setProduct_FG("");
        setProduct_Width("");
        setProduct_Depth("");
        setProduct_Height("");
        setProduct_Price("");
        setProduct_Ctype("");
        setProduct_Cfunction("");
        setProduct_Cfeature("");
        setProduct_Color([]);
        setCountColor(1)
        setPathFile("");
        setProduct_Image("");
      }
    } catch (error) {}
  };

  const handlePageClick = (pageIndex) => {
    if (pageIndex < 0 || pageIndex >= totalPages) return; // Prevent out-of-bound clicks
    setCurrentPage(pageIndex);
    const start = pageIndex * itemsPerPage;
    const end = start + itemsPerPage;
    setCurrentPageProducts(product.slice(start, end));
  };

  return (
    <>
      {form_modal === 1 && (
        <div className="form-model">
          <div className="model-content">
            <h5>เพิ่มสินค้า</h5>
            <div className="row">
              <div className="col-12 mb-2">
                <select
                  className="form-select"
                  defaultValue=""
                  onChange={(e) => setProduct_type(e.target.value)}
                >
                  <option value="" disabled>
                    เลือกประเภท
                  </option>
                  {category.map((item, index) => (
                    <option key={index} value={item.Product_type}>
                      {item.Product_type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 mb-2">
                <input
                  className="form-control"
                  placeholder="รุ่น"
                  onChange={(e) => setProduct_name(e.target.value)}
                />
              </div>
              <div className="col-12 mb-2">
                <input
                  className="form-control"
                  placeholder="โมเดล"
                  onChange={(e) => setProduct_Model(e.target.value)}
                />
              </div>
              <div className="col-12 mb-2">
                <input
                  className="form-control"
                  placeholder="ประเภท"
                  onChange={(e) => setProduct_Category(e.target.value)}
                />
              </div>
              <div className="col-12 mb-2">
                <input
                  className="form-control"
                  placeholder="FG"
                  onChange={(e) => setProduct_FG(e.target.value)}
                />
              </div>
              <div className="col-4">
                <input
                  className="form-control"
                  placeholder="กว้าง"
                  onChange={(e) => setProduct_Width(e.target.value)}
                />
              </div>
              <div className="col-4">
                <input
                  className="form-control"
                  placeholder="ลึก"
                  onChange={(e) => setProduct_Depth(e.target.value)}
                />
              </div>
              <div className="col-4">
                <input
                  className="form-control"
                  placeholder="ยาว"
                  onChange={(e) => setProduct_Height(e.target.value)}
                />
              </div>
              <div className="col-12 mt-2 mb-2">
                <input
                  className="form-control"
                  placeholder="ราคา"
                  onChange={(e) => setProduct_Price(e.target.value)}
                />
              </div>
              <div className="col-4 mb-2">
                <input
                  className="form-control"
                  placeholder="Ctype"
                  onChange={(e) => setProduct_Ctype(e.target.value)}
                />
              </div>
              <div className="col-4 mb-2">
                <input
                  className="form-control"
                  placeholder="Cfunction"
                  onChange={(e) => setProduct_Cfunction(e.target.value)}
                />
              </div>
              <div className="col-4 mb-2">
                <input
                  className="form-control"
                  placeholder="Cfeature"
                  onChange={(e) => setProduct_Cfeature(e.target.value)}
                />
              </div>
              {Array.from({ length: countcolor }, (_, index) => (
                <div key={index} className="col-10 mb-2">
                  <input
                    className="form-control"
                    placeholder={`สี`}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                  />
                </div>
              ))}
              <div className="col-1">
                <button
                  className="btn btn-warning"
                  onClick={() => countinputcolor()}
                >
                  <span className="h5">+</span>
                </button>
              </div>
              <div className="col-12 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Path File ex.W:\PTK Shared Center\CAD-Creation\XS Program\Desk & Table\Workstation & desk\STUDIO-A"
                  onChange={(e) => setPathFile(e.target.value)}
                />
              </div>
              <div className="col-12 mb-2">
                <input
                  type="file"
                  className="form-control"
                  placeholder="Image"
                  onChange={handerImage}
                />
              </div>
              <div className="col-6">
                <button
                  className="btn btn-secondary"
                  onClick={() => cancelModel()}
                >
                  ยกเลิก
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-danger"
                  onClick={() => recordProduct()}
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container mt-3 text-center slide_left">
        <span className="h3">Product List</span>
      </div>
      <div className="mx-5 d-flex justify-content-between">
        <div>
          <button className="btn btn-primary" onClick={() => setForm_Model(1)}>
            เพิ่มสินค้า
          </button>
        </div>
        <div>
          <input
            type="text"
            className="form-control"
            placeholder="ค้นหารุ่น"
            onKeyUp={(e) => SearchItem(e.target.value)}
          />
        </div>
      </div>
      <div className="mx-5 mt-3 box-table">
        <table className="table table-striped">
          <thead>
            <tr>
              <th width={10}>ลำดับ</th>
              <th width={15}>ประเภท</th>
              <th>รุ่น</th>
              <th width={100}>กว้าง</th>
              <th width={100}>ลึก</th>
              <th width={100}>สูง</th>
              <th width={100}>ราคา</th>
              <th width={100}>สี</th>
              <th>รูปภาพ</th>
              <th width={`40`}></th>
            </tr>
          </thead>
          <tbody>
            {currentPageProducts.map((item, index) => (
              <tr key={index}>
                <td className="text-center">
                  {index + 1 + currentPage * itemsPerPage}
                </td>
                <td>
                  {item.Product_type} {item.Product_category}
                </td>
                <td>{item.Product_model}</td>
                <td>{item.Product_width}</td>
                <td>{item.Product_depth}</td>
                <td>{item.Product_height}</td>
                <td>{item.Product_price}</td>
                <td>{item.Product_Color}</td>
                <td width={80}>
                  <Image
                    className="img-picture"
                    src={`${process.env.NEXT_PUBLIC_API_URL}${item.Product_img}`}
                    width={1000}
                    height={1000}
                    alt="picture"
                  />
                </td>
                <td>
                  <button className="btn btn-outline-danger">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-container d-flex justify-content-end mx-5">
        <button
          className="btn btn-outline-secondary"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Prev
        </button>
        <span className="mx-3">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          className="btn btn-outline-secondary"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default page;
