"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./deploy.css";
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get`);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/equipment_list?id=${id}`,
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
                    src={`${process.env.NEXT_PUBLIC_API_URL}${item.Product_img}`}
                    width={500}
                    height={500}
                    alt="image"
                  />
                </div>
                <div className="col-12 mt-2">
                  {item.Product_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
