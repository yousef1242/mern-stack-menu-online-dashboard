import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import classes from "../../styles/paypalButton.module.css";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import requestDashboard from "@/utils/requestDashboard";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import LoaderAnimation from "../loaderAnimation/LoaderAnimation";

const PaypalButton = ({
  selectedOptionAmount,
  setPaypalButtonModel,
  selectedOption,
  restaurantEmail,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
                return actions.order
                  .capture()
                  .then(async (details) => {
                    setLoading(true);
                    try {
                      const { data } = await requestDashboard.put(
                        `/api/restaurant/subscribe`,
                        {
                          planName: selectedOption,
                          restaurantEmail: restaurantEmail,
                        }
                      );
                      if (data?.message) {
                        // Subscription was successful, capture the payment
                        const captureResult = await actions.order.capture();
                        if (captureResult.status === "COMPLETED") {
                          toast.success(data.message);
                          router.push("/");
                        } else {
                          // Handle payment capture failure
                          toast.error("Payment capture failed.");
                        }
                      } else {
                        // Handle unexpected response from the API
                        toast.error("An unexpected error occurred.");
                      }
                    } catch (error) {
                      console.log(error);
                      setLoading(false);
                      if (error.response) {
                        toast.error(error.response.data.message);
                      } else {
                        // Handle other types of errors (e.g., network issues)
                        toast.error(
                          "An error occurred while processing your request."
                        );
                      }
                    }
                  })
                  .catch((captureError) => {
                    console.log(captureError);
                    setLoading(false);
                    toast.error("An error occurred during payment capture.");
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
