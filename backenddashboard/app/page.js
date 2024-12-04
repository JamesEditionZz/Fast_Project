"use client";
import react, { useState } from "react";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import "./form-login.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginfail, setLoginfail] = useState(0);

  const localhost = 'localhost:5002'

  const login = async () => {
    const fecthdata = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/backenddashboard/check/member`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );
    const response = await fecthdata.json();

    if (response.length > 0) {
      router.push(`./Components/Index?id=${response[0].Status}`);
    } else {
      setLoginfail(1);
    }
  };

  return (
    <>
      {loginfail == 1 && (
        <div className="login-fail login-alert">
          <h5 className="p-3">Username หรือ Password ไม่ถูกต้อง</h5>
        </div>
      )}
      <div className="container form-login">
        <div className="frame-login">
          <div className="row">
            <div className="">
              <Image
                className="img-logo"
                src={`/logo/logo.png`}
                width={1000}
                height={1000}
                alt="logo"
              />
            </div>
            <div className="col-12">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="col-12 mt-4">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    login();
                  }
                }}
              />
            </div>
            <div className="col-12 mt-4 d-flex justify-content-center">
              <button className="btn btn-danger"  onClick={() => login()}>
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
