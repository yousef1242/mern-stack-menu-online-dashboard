import ClientNavbar from "@/components/clientNavbar/ClientNavbar";
import Head from "next/head";
import { useRouter } from "next/router";
import waitingImage from "../../../public/waitingImage.png";
import orderDoneImage from "../../../public/order done image.png";
import Image from "next/image";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("https://menuonline.onrender.com");

const OrderCompletePage = () => {
  const router = useRouter();
  const { orderNumber } = router.query;
  const [orderIsDone, setOrderIsDone] = useState("");

  // orderNumber socket io room
  useEffect(() => {
    // Check if localStorage is available (client-side) before using it
    if (typeof sessionStorage !== "undefined") {
      const orderStatusValue = sessionStorage.getItem("isOrderDone");
      if (orderStatusValue) {
        const parsedOrderStatus = JSON.parse(orderStatusValue);
        setOrderIsDone(parsedOrderStatus);
      }
    }

    if (orderNumber) {
      socket.emit("joinOrderNumberRoom", {
        orderNumber: orderNumber,
      });

      socket.on("sendTheOrderHasBeenDone", (data) => {
        // Update sessionStorage and the state when the order status changes
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem("isOrderDone", JSON.stringify(data.isDone));
        }
        setOrderIsDone(data.isDone);
      });
    }
  }, [socket, orderNumber]);

  return (
    <>
      <Head>
        <title>Restaurant</title>
      </Head>
      <ClientNavbar />
      <div
        className="d-flex align-items-center justify-content-center py-5 overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        {!orderIsDone ? (
          <div className="text-center py-5 px-3">
            {" "}
            <h1 style={{ lineHeight: "50px" }}>
              Your order with Order Number:{" "}
              <span style={{ color: "#C63D2F" }}>{orderNumber}</span>
            </h1>
            <h1 style={{ lineHeight: "50px" }}>
              {" "}
              is being prepared. Please wait patiently.
            </h1>
            <Image
              style={{ height: "350px", width: "350px" }}
              src={waitingImage}
              alt="Waiting Image"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="text-center py-5 px-3">
            {" "}
            <h1 style={{ lineHeight: "50px" }}>
              {" "}
              Your order has been prepared.
            </h1>
            <Image
              style={{ height: "350px", width: "350px" }}
              src={orderDoneImage}
              alt="order done Image"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default OrderCompletePage;
