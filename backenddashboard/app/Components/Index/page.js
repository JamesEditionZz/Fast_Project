"use client";
import React, { useState } from "react";
import "./index.css";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import PageDashboard from "../Dashboard/page.js";
import PageProduct from "../Product/page.js";
import PageAccessories from "../Accessories/page.js";

function page() {
  const router = useRouter();
  const [swiftpage, setSwitfPage] = useState(0);

  const signout = () => {
    router.push(`../`);
  };

  return (
    <>
      <div className="header-bar p-1">
        <div className="exit-icon h6 d-flex justify-content-between">
          <div className="offcanvas-header">
            <span>Practika</span>
          </div>
          <div className="tab-menu">
            <span className="h6" onClick={() => signout()}>
              ออกจะระบบ{" "}
            </span>
            <Image
              className=""
              src={`/Icon/log-out.png`}
              width={40}
              height={40}
              alt="exit"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-1 tab-bar">
          <div className="row text-center mt-4">
            <div className={`col-12 h6`} onClick={() => setSwitfPage(0)}>
              <span
                className={`${swiftpage == 0 ? "page-active" : "tab-menu"}`}
              >
                Dashboard
              </span>
            </div>
            <hr />
            <div
              className={`col-12 h6 ${swiftpage == 1 ? "page-active" : ""}`}
              onClick={() => setSwitfPage(1)}
            >
              <span
                className={`${swiftpage == 1 ? "page-active" : "tab-menu"}`}
              >
                Product
              </span>
            </div>
            <hr />
            <div
              className={`col-12 h6 ${swiftpage == 2 ? "page-active" : ""}`}
              onClick={() => setSwitfPage(2)}
            >
              <span
                className={`${swiftpage == 2 ? "page-active" : "tab-menu"}`}
              >
                Accessories
              </span>
            </div>
            <hr />
          </div>
        </div>
        {swiftpage == 0 && (
          <div className={`col-11 slide_left`}>
            <PageDashboard />
          </div>
        )}
        {swiftpage == 1 && (
          <div className={`col-11 slide_left`}>
            <PageProduct />
          </div>
        )}
        {swiftpage == 2 && (
          <div className={`col-11 slide_left`}>
            <PageAccessories />
          </div>
        )}
      </div>
    </>
  );
}

export default page;
