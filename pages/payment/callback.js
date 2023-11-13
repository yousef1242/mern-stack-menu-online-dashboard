import requestDashboard from "@/utils/requestDashboard";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { FaX } from "react-icons/fa6";
import classes from "../../styles/paymentCallback.module.css";
import { toast } from "react-toastify";
import LoaderAnimation from "@/components/loaderAnimation/LoaderAnimation";

const PaymentCallback = () => {
  const router = useRouter();
  const [paymentSuccess, setPaymentSuccess] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTransactionInformationPaymob = async () => {
      const { id } = router.query;
      setTimeout(() => {
        const newUrl = {
          pathname: router.pathname,
          query: { id: id },
        };
        router.replace(newUrl, undefined, { shallow: true });
      }, 0);

      if (id) {
        const API_KEY =
          "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T0RJME9UazRMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuY3RsNWNGTUpYbktnRTduYmVGNkYtSlZWa0o5dWtzY2ZZYWZiRTQ5VzNkN3N4UFhYRHdxWkVRTlN4YnhGQmRvVUFsbmxzVngtZ2ZqSmYxUkgyOFlNb2c=";

        let data = {
          api_key: API_KEY,
        };

        setLoading(true);

        try {
          let tokenRequest = await fetch(
            "https://accept.paymob.com/api/auth/tokens",
            {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }
          );

          let tokenResponse = await tokenRequest.json();
          const token = tokenResponse.token;

          const transactionDetails = await axios.get(
            `https://accept.paymob.com/api/acceptance/transactions/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (transactionDetails.data.pending === false) {
            setPaymentSuccess(transactionDetails.data.success);
            setLoading(false);

            if (transactionDetails.data.success === true) {
              try {
                const subscriptionData = await requestDashboard.put(
                  `/api/restaurant/subscribe`,
                  {
                    planName: transactionDetails.data.billing_data?.state,
                    restaurantEmail:
                      transactionDetails.data.billing_data?.email,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

                setLoading(false);

                if (subscriptionData?.data?.message) {
                  toast.success(subscriptionData.data.message);
                } else {
                  toast.error("Payment capture failed.");
                }
              } catch (error) {
                setLoading(false);

                if (error.response.data.message) {
                  toast.error(error.response.data.message);
                  setErrorMessage(error.response.data.message);
                }
              }
            }
          } else {
            toast.error("In pending");
            setErrorMessage("In pending");
          }
        } catch (error) {
          if (error.response?.data?.detail) {
            toast.error(error.response.data.detail);
            setErrorMessage("");
            setPaymentSuccess("");
          }
        }
      }
    };

    getTransactionInformationPaymob();
  }, [router.query.id, errorMessage, paymentSuccess]);

  return (
    <>
      <Head>
        <title>Restaurant-Dashboard</title>
      </Head>
      <div className={classes.paymentCallbackPage}>
        <div className="container">
          <div className={classes.paymentResultDiv}>
            {paymentSuccess && errorMessage === "" ? (
              <div className={classes.containPAndIconDiv}>
                <div className={classes.correctIconDiv}>
                  <AiOutlineCheck />
                </div>
                <p>The operation was accepted</p>
              </div>
            ) : paymentSuccess !== "" ? (
              <div className={classes.containPAndIconDiv}>
                <div className={classes.wrongIconDiv}>
                  <FaX />
                </div>
                <p>
                  {errorMessage !== ""
                    ? errorMessage
                    : "The operation was rejected"}
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      {loading ? <LoaderAnimation /> : ""}
    </>
  );
};

export default PaymentCallback;
