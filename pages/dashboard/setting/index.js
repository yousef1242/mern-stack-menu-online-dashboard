import Head from "next/head";
import classes from "../../../styles/dashboard.module.css";
import { useEffect, useState } from "react";
import DashboardNavbar from "@/components/dashboardNavbar/DashboardNavbar";
import QRCode from "react-qr-code";
import requestDashboard from "@/utils/requestDashboard";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import LoaderAnimation from "@/components/loaderAnimation/LoaderAnimation";
import Image from "next/image";

const DashboardSettingPage = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [facebookLinkPage, setFacebookLinkPage] = useState("");
  const [instagramLinkPage, setInstagramLinkPage] = useState("");
  const [address, setAddress] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setClodeTime] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getRestaurantInfo = async () => {
      const restaurantInfo = Cookies.get("restaurantTokenAndId")
        ? JSON.parse(Cookies.get("restaurantTokenAndId"))
        : null;
      if (restaurantInfo === null) {
        router.push("/");
        return toast.error("Token doesn't exist please try again");
      }
      try {
        const { data } = await requestDashboard.get(
          `/api/restaurant/single/${restaurantInfo?.id}`,
          {
            headers: {
              Authorization: `Bearer ${restaurantInfo?.token}`,
            },
          }
        );
        if (data) {
          setLoading(false);
          setName(data.restaurantName);
          setTitle(data.restaurantTitle);
          setImage(data.restaurantImage);
          setEmail(data.restaurantEmail);
          setFacebookLinkPage(data.restaurantFacebookPageLink);
          setInstagramLinkPage(data.restaurantInstagramPageLink);
          setAddress(data.restaurantAdress);
          setOpenTime(data.restaurantOpenTime);
          setClodeTime(data.restaurantCloseTime);
          setRestaurantId(data._id);
          setEndDate(data.restaurantSubscribePlan?.endDate);
        }
      } catch (error) {
        console.log(error);
        if (error.response.data.message) {
          toast.error(error.response.data.message);
        }
      }
    };
    getRestaurantInfo();
  }, [loading]);

  return (
    <>
      <Head>
        <title>Restaurant-dashboard</title>
      </Head>
      <main className={classes.dashbaordPage}>
        {/* navbar */}

        <DashboardNavbar />
        <div
          className="products-section pt-5 pb-3"
          style={{ background: "#efefef" }}
        >
          <div className="container">
            <h2
              className={`${classes.dashboardTitle} mb-5 fw-bold width`}
              style={{ color: "var(--small-headlines-color)" }}
            >
              Setting
            </h2>
            <div className="row">
              <div className="col-12 col-md-4">
                <h3
                  style={{ color: "var(--small-headlines-color)" }}
                  className="fw-bold mb-5"
                >
                  Your qr code
                </h3>
                <div className="rounded bg-white p-5 mb-5 mb-md-0 text-center">
                  <QRCode
                    className="w-100"
                    value={`https://menuonlinedashboard.vercel.app/restaurant/${restaurantId}`}
                  />
                </div>
              </div>
              <div className="col-12 col-md-8">
                <h3
                  style={{ color: "var(--small-headlines-color)" }}
                  className="fw-bold mb-5 text-center"
                >
                  Your information
                </h3>
                <div className="dashboard-setting-form row">
                  <div
                    className={`${classes.dashboardSettingFormGroup} col-12 text-center mb-4`}
                  >
                    <Image
                      alt=""
                      src={image}
                      width={100}
                      height={100}
                      loading="lazy"
                    />
                  </div>
                  <div
                    className={`${classes.dashboardSettingFormGroup} col-12 col-md-6`}
                  >
                    <label>Name</label>
                    <input type="text" disabled value={name} />
                  </div>
                  <div
                    className={`${classes.dashboardSettingFormGroup} col-12 col-md-6`}
                  >
                    <label>Title</label>
                    <input type="text" disabled value={title} />
                  </div>
                  <div
                    className={`${classes.dashboardSettingFormGroup} col-12 col-md-6`}
                  >
                    <label>Email</label>
                    <input type="text" disabled value={email} />
                  </div>
                  <div
                    className={`${classes.dashboardSettingFormGroup} col-12 col-md-6`}
                  >
                    <label>Address</label>
                    <input type="text" disabled value={address} />
                  </div>
                  <div
                    className={`${classes.dashboardSettingFormGroup} col-12 col-md-6`}
                  >
                    <label>Open time</label>
                    <input type="text" disabled value={openTime} />
                  </div>
                  <div
                    className={`${classes.dashboardSettingFormGroup} col-12 col-md-6`}
                  >
                    <label>Close time</label>
                    <input type="text" disabled value={closeTime} />
                  </div>
                  <div
                    className={`${classes.dashboardSettingFormGroup} col-12 col-md-6`}
                  >
                    <label>Facebook link page</label>
                    <input type="text" disabled value={facebookLinkPage} />
                  </div>
                  <div
                    className={`${classes.dashboardSettingFormGroup} col-12 col-md-6`}
                  >
                    <label>Instagram link page</label>
                    <input type="text" disabled value={instagramLinkPage} />
                  </div>
                  <div
                    className={`${classes.dashboardSettingFormGroup} col-12`}
                  >
                    <label>Your subscribe will end in</label>
                    <input type="text" disabled value={endDate} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {loading ? <LoaderAnimation /> : ""}
      </main>
    </>
  );
};

export default DashboardSettingPage;
