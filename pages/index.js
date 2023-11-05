import Head from "next/head";
import classes from "../styles/Home.module.css";
import { useState } from "react";
import CreateRestaurantForm from "@/components/forms/CreateRestaurantForm";
import LoginRestaurantForm from "@/components/forms/LoginRestaurantForm";
import Link from "next/link";

const Home = () => {
  const [loginRestaurantFormShow, setLoginRestaurantFormShow] = useState(false);
  const [createRestaurantFormShow, setCreateRestaurantFormShow] =
    useState(false);

  return (
    <>
      <Head>
        <title>Restaurant-dashboard</title>
      </Head>
      <div className={`${classes.homePage} main`}>
        <div className="container h-100">
          {/* navbar */}
          <div className="w-100 header z-1 position-relative py-3">
            <div className="row slign-item-center">
              <div className="col-6">
                <h2 className="fw-bold text-white">Restaurant</h2>
              </div>
              <div className="col-6 text-end">
                <div className="d-flex align-items-center gap-3 justify-content-end">
                  <span
                    onClick={() => setLoginRestaurantFormShow(true)}
                    className="ms-3 text-white fw-bold fs-6"
                    style={{ cursor: "pointer" }}
                  >
                    Login
                  </span>
                    <button
                      onClick={() => setCreateRestaurantFormShow(true)}
                      className="me-3 fs-6"
                    >
                      Signup
                    </button>
                </div>
              </div>
            </div>
          </div>
          {/* Home page content */}
          <div
            className="home-page-content position-relative text-white fw-bold text-center pt-5 z-1"
            style={{ marginTop: "100px" }}
          >
            <h1 style={{ fontSize: "60px" }} className="mb-3 fw-bold">
              Control your restaurant
            </h1>
            <h1 style={{ fontSize: "60px" }} className="fw-bold">
              menu online
            </h1>
            <button className="mt-3 text-white">
              <Link
                className="text-white text-decoration-none"
                href={`/subscribe`}
              >
                Subscribe
              </Link>
            </button>
          </div>
        </div>
        {createRestaurantFormShow ? (
          <CreateRestaurantForm
            setCreateRestaurantFormShow={setCreateRestaurantFormShow}
          />
        ) : (
          ""
        )}
        {loginRestaurantFormShow ? (
          <LoginRestaurantForm
            setLoginRestaurantFormShow={setLoginRestaurantFormShow}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Home;
