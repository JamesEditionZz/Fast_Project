"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./page.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [data, setData] = useState([]);
  const [numberitem, setNumbuerItem] = useState([]);
  const [openproject, setOpenProject] = useState("");
  const [menunextpage, setMenuNextPage] = useState("");

  const Router = useRouter();

  setTimeout(() => {
    setOpenProject(true);
  }, 1000);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8001/api/get");
      const fetchedData = await response.json();
      setData(fetchedData);
    };

    fetchData();
  }, []);

  const handleSelector = async (id) => {
    setNumbuerItem(id);
    setMenuNextPage(true);
    try {
      const response = await fetch(
        `http://localhost:8001/api/equipment_list?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      setTimeout(() => {
        Router.push(`./Components/Product_list?id=${id}`);
      }, 800);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  
  return (
    <>
      <div className="bg-page">
        <div className="container">
          <div
            className={`row text-center animation-top ${
              menunextpage ? "animation-top-return" : ""
            }`}
          >
            {data.map((item) => (
              <div
                className="col-3 selector p-3"
                key={item.ID}
                onClick={() => handleSelector(item.Product_type)}
              >
                <div className="col-12">
                  <Image
                    className="img-width"
                    src={`http://localhost:8001${item.Product_img}`}
                    width={500}
                    height={500}
                    alt="image"
                  />
                </div>
                <div className="col-12 mt-2">
                  {item.Product_type}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
