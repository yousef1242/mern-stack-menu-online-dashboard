import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import classes from "../../styles/paypalButton.module.css";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import requestDashboard from "@/utils/requestDashboard";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import LoaderAnimation from "../loaderAnimation/LoaderAnimation";
import Cookies from "js-cookie";

const PaypalButton = ({
  selectedOptionAmount,
  setPaypalButtonModel,
  selectedOption,
}) => {
  let restaurantId;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getRestaurantId = Cookies.get("restaurantId")
      ? JSON.parse(Cookies.get("restaurantId"))
      : null;
    if (getRestaurantId) {
      restaurantId = getRestaurantId;
    }
  }, []);

  const initialOptions = {
    clientId:
      "AbTGtqzJWKJ9brn4-2juwbFOunwp92NTqcGQ_-nGuqAR4Bx90MuOhyaoTLHxgQI4dzAUqnXSrSpxECxL",
    currency: "USD",
    intent: "capture",
  };
  return (
    <>
      <div className={classes.paypalButtonModel}>
        <h1>
          <AiOutlineClose onClick={() => setPaypalButtonModel(false)} />
        </h1>
        <div className={classes.paypalButtonDiv}>
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: selectedOptionAmount,
                      },
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(async (details) => {
                  setLoading(true);
                  try {
                    const { data } = await requestDashboard.put(
                      `/api/restaurant/subscribe/${restaurantId}`,
                      {
                        planName: selectedOption,
                      }
                    );
                    toast.success(data?.message);
                    router.push("/");
                  } catch (error) {
                    console.log(error);
                    setLoading(false);
                    toast.error(error?.response?.data?.message)
                  }
                });
              }}
            />
          </PayPalScriptProvider>
        </div>
      </div>
      {loading ? <LoaderAnimation /> : ""}
    </>
  );
};

export default PaypalButton;
