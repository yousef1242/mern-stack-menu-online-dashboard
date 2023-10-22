import Head from "next/head";
import { useEffect, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import PaypalButton from "@/components/paypalButton/PaypalButton";

const Subscribe = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionAmount, setSelectedOptionAmount] = useState(null);
  const [paypalButtonModel, setPaypalButtonModel] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    const addPaypalScript = () => {
      const script = document.createElement("script");
      script.src = `/https://www.paypal.com/sdk/js?client-id=AbTGtqzJWKJ9brn4-2juwbFOunwp92NTqcGQ_-nGuqAR4Bx90MuOhyaoTLHxgQI4dzAUqnXSrSpxECxL`;

      document.body.appendChild(script);
    };
    addPaypalScript();
  }, []);

  return (
    <>
      <Head>
        <title>Restaurant-Dashboard</title>
      </Head>
      <div
        style={{ height: "100vh" }}
        className="d-flex w-100 align-items-center justify-content-center"
      >
        <div className="container">
          <h1
            className="fw-bold mb-5 text-center"
            style={{ color: "var(--headlines-color)" }}
          >
            Pricing
          </h1>
          <div
            style={{ border: "1px solid var(--border-color)" }}
            className="p-5 position-relative"
          >
            <div className="row">
              <div className="col-12 col-md-6 mb-3 mb-md-0">
                <div
                  className={`card py-5 d-flex align-items-center justify-content-center ${
                    selectedOption === "month" ? "selected" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleOptionClick("month");
                    setSelectedOptionAmount(200);
                  }}
                >
                  <span
                    style={{
                      color: "var(--small-headlines-color)",
                      fontWeight: "700",
                    }}
                  >
                    Pay monthly 200 EGP
                  </span>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div
                  className={`card py-5 d-flex align-items-center justify-content-center ${
                    selectedOption === "year" ? "selected" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleOptionClick("year");
                    setSelectedOptionAmount(2000);
                  }}
                >
                  <span
                    style={{
                      color: "var(--small-headlines-color)",
                      fontWeight: "700",
                    }}
                  >
                    Pay yearly 2000 EGP
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              {selectedOption !== null && (
                <button onClick={() => setPaypalButtonModel(true)}>
                  Continue
                </button>
              )}
            </div>
            <div className="d-flex mt-5 align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <AiOutlineCheck />
                <span
                  style={{
                    color: "var(--small-headlines-color)",
                    fontWeight: "700",
                    marginLeft: "5px",
                  }}
                >
                  Unlimited products
                </span>
              </div>
              <div>
                <AiOutlineCheck />
                <span
                  style={{
                    color: "var(--small-headlines-color)",
                    fontWeight: "700",
                    marginLeft: "5px",
                  }}
                >
                  Unlimited orders
                </span>
              </div>
              <div>
                <AiOutlineCheck />
                <span
                  style={{
                    color: "var(--small-headlines-color)",
                    fontWeight: "700",
                    marginLeft: "5px",
                  }}
                >
                  Unlimited categories
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .card.selected {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
          /* Add any other styling you desire */
        }
      `}</style>
      {paypalButtonModel ? (
        <PaypalButton
          selectedOptionAmount={selectedOptionAmount}
          setPaypalButtonModel={setPaypalButtonModel}
          selectedOption={selectedOption}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Subscribe;
