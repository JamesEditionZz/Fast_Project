"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import "./accessories.css";

function page() {
  const [product, setProduct] = useState([]);
  const [data_accessories, setData_Accessories] = useState([]);
  const [modalAccessories, setModalAccesories] = useState(false);
  const [boxselect, setBoxSelect] = useState(false);
  const [selectAccessories, setSelectAccessories] = useState("");
  const [checkinputselect, setCheckInputSelect] = useState("");

  const [fg, setFG] = useState("");
  const [modal, setModal] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [height, setHeight] = useState("");
  const [price, setPrice] = useState("");
  const [path_File, setPath_File] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const datafecth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/backenddashboard/list_accessories`
        );
        const data = await response.json();
        setProduct(data);
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

  const InsertAccessories = () => {
    setModalAccesories(true);
  };

  const searchAccessories = async (e) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/backenddashboard/searchaccessories`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ access: e }),
        }
      );

      const res = await response.json();

      setData_Accessories(res);
    } catch (error) {
      console.error(error);
    }
  };

  const SelectAccessories = (value) => {
    setSelectAccessories(value);
    setData_Accessories(
      Array.from(new Set(product.map((item) => item.Access_type))).map((type) =>
        product.find((item) => item.Access_type === type)
      )
    );
  };

  const Insert_type = () => {
    setSelectAccessories(checkinputselect);
    setData_Accessories(
      Array.from(new Set(product.map((item) => item.Access_type))).map((type) =>
        product.find((item) => item.Access_type === type)
      )
    );
  };

  const Insert_Accessories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/backenddashboard/Insert_Accessories`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            fg,
            selectAccessories,
            modal,
            width,
            depth,
            height,
            price,
            path_File,
            image,
          }),
        }
      );

      const text = await response.json();

      if (text == true) {
        alert("Insert Success!!");

        const datafecth = async () => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/backenddashboard/list_accessories`
            );
            const data = await response.json();
            setProduct(data);
          } catch (error) {
            console.error("error", error);
          }
        };
        datafecth();
      }

      setModalAccesories(false);
    } catch (error) {
      console.error(error);
    }
  };

  const Delete_item = async (value, Access_name) => {
    if (value) {
      const userConfirmed = window.confirm(`ต้องการลบ ${Access_name} ?`);
      if (userConfirmed) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/backenddashboard/Delete_Item`,
            {
              method: "POST",
              headers: { "Content-type": "application/json" },
              body: JSON.stringify({ ID: value }),
            }
          );
          const res = await response.json();
          setProduct(res);
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const AccessBoxSelect = () => {
    if (boxselect === true) {
      setBoxSelect(false);
    } else {
      setBoxSelect(true);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0]
    setImage(file.name)
  }

  console.log(product);
  

  return (
    <>
      {modalAccessories == true && (
        <>
          <div className="modal-container">
            <div className="modal-Insert">
              <div className="h6">เพิ่ม Accessories</div>
              <div className="row">
                <div className="col-12 mb-3">
                  <input
                    className={`form-control`}
                    placeholder="FG"
                    onChange={(e) => setFG(e.target.value)}
                  />
                </div>
                <div className="col-12 mb-3">
                  <input
                    className="form-select cursor-pointer"
                    placeholder="เลือกประเภท"
                    value={selectAccessories}
                    onClick={AccessBoxSelect}
                    readOnly
                  />
                  {boxselect && (
                    <>
                      <div className="box-select">
                        <input
                          className="form-control"
                          placeholder="ค้นหาประเภท"
                          onChange={(e) => {
                            searchAccessories(e.target.value);
                            setCheckInputSelect(e.target.value);
                          }}
                        />
                        <div className="data-accessories">
                          {data_accessories.length > 0 ? (
                            data_accessories.map((item, index) => (
                              <div
                                key={index}
                                className="item-select"
                                onClick={() => {
                                  SelectAccessories(item.Access_type);
                                  setBoxSelect(false);
                                }}
                              >
                                {item.Access_type}
                              </div>
                            ))
                          ) : checkinputselect.length == 0 ? (
                            [
                              ...new Set(
                                product.map((item) => item.Access_type)
                              ),
                            ].map((accessType, index) => (
                              <div
                                className="col-12 item-select"
                                key={index}
                                onClick={() => {
                                  SelectAccessories(accessType);
                                  setBoxSelect(false);
                                }}
                              >
                                {accessType}
                              </div>
                            ))
                          ) : (
                            <div>
                              <div>ค้นหาไม่พบข้อมูล</div>
                              <div>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => {
                                    Insert_type();
                                    setBoxSelect(false);
                                  }}
                                >
                                  ต้องการเพิ่ม
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="col-12 mb-3">
                  <input
                    className="form-control"
                    placeholder="รุ่น"
                    onChange={(e) => setModal(e.target.value)}
                  />
                </div>
                <div className="col-4 mb-3">
                  <input
                    className="form-control"
                    placeholder="กว้าง"
                    onChange={(e) => setWidth(e.target.value)}
                  />
                </div>
                <div className="col-4 mb-3">
                  <input
                    className="form-control"
                    placeholder="ลึก"
                    onChange={(e) => setDepth(e.target.value)}
                  />
                </div>
                <div className="col-4 mb-3">
                  <input
                    className="form-control"
                    placeholder="สูง"
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="col-12 mb-3">
                  <input
                    className="form-control"
                    placeholder="ราคา"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="col-12 mb-3">
                  <input
                    className="form-control"
                    placeholder="Path File ex. W:\PTK Shared Center\CAD-Creation\XS Program\Accessories"
                    onChange={(e) => setPath_File(e.target.value)}
                  />
                </div>
                <div className="col-12 mb-3">
                  <input
                    type="file"
                    className="form-control"
                    placeholder="รูปภาพ"
                    onChange={handleImage}
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setModalAccesories(false)}
                  >
                    ยกเลิก
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => Insert_Accessories()}
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="container mt-3 text-center">
        <span className="h3">Accessories List</span>
      </div>
      <div className="mx-5 d-flex justify-content-between">
        <div>
          <button
            className="btn btn-primary"
            onClick={() => InsertAccessories()}
          >
            เพิ่มอุปกรณ์
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
      <div className="mx-5 mt-3 box-data">
        <table className="table table-striped">
          <thead>
            <tr>
              <th width={10}>ลำดับ</th>
              <th>FG</th>
              <th width={200}>ประเภท</th>
              <th>รุ่น</th>
              <th width={100}>กว้าง</th>
              <th width={100}>ลึก</th>
              <th width={100}>สูง</th>
              <th width={100}>ราคา</th>
              <th>รูปภาพ</th>
              <th width={`40`}></th>
            </tr>
          </thead>
          <tbody>
            {product.map((item, index) => (
              <tr key={index}>
                <td className="text-center">
                  {index + 1}
                </td>
                <td className="text-center">{item.Access_FG}</td>
                <td>{item.Access_type}</td>
                <td>{item.Access_name}</td>
                <td>{item.Access_width}</td>
                <td>{item.Access_depth}</td>
                <td>{item.Access_height}</td>
                <td>{item.Access_price}</td>
                <td width={80}>
                  <Image
                    className="img-picture"
                    src={`${process.env.NEXT_PUBLIC_API_URL}${item.Access_img}`}
                    width={1000}
                    height={1000}
                    alt="picture"
                  />
                </td>
                <td>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => Delete_item(item.ID, item.Access_name)}
                  >
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
    </>
  );
}

export default page;
