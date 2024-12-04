import React from "react";
import Pie from "./pie/page.js";
import Bar from "./bar/page.js";
import "./dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Page() {
  return (
    <div className="container-fluid mt-4">
      <div className="row d-flex justify-content-between mb-4">
        <div className="col-3 mx-3 p-3 grapy bg-primary">
          <div className="row">
            <div className="col-12 h5 text-white">ยอดขาย</div>
            <div className="col-12 h5 text-end text-white">00000000000 บ.</div>
          </div>
        </div>
        <div className="col-3 mx-3 p-3 grapy bg-secondary">
          <div className="row">
            <div className="col-12 h5 text-white">ยอดขาย</div>
            <div className="col-12 h5 text-end text-white">00000000000 บ.</div>
          </div>
        </div>
        <div className="col-3 mx-3 p-3 grapy bg-danger">
          <div className="row">
            <div className="col-12 h5 text-white">ยอดขาย</div>
            <div className="col-12 h5 text-end text-white">00000000000 บ.</div>
          </div>
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="col-md-4 grapy mx-3">
          <Pie />
        </div>
        <div className="col-md-7 p-3 grapy">
          <Bar />
        </div>
      </div>
    </div>
  );
}

export default Page;
