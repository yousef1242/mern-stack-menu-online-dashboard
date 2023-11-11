import { useState } from "react";
import classes from "../../styles/chooseHereOrTakeAway.module.css";
import { AiOutlineClose } from "react-icons/ai";
import LoaderAnimation from "../loaderAnimation/LoaderAnimation";

const ChooseHereOrTakeAway = ({
  setShowChooseHereOrTakeAwayModel,
  setShowCompleteHereOrderModel,
  setShowCompleteTakeAwayOrderModel
}) => {
  const [loading, setLoading] = useState(false);
  const [hereOrTakeAwayOption, setHereOrTakeAwayOption] = useState("");

  const chooseHereOrTakeAwayOptionFunction = (option) => {
    setHereOrTakeAwayOption(option);
  };

  return (
    <>
      <div className={classes.chooseHereOrTakeAway}>
        <div className={classes.chooseHereOrTakeAwayDiv}>
          <h3 className={classes.chooseHereOrTakeAwayDivHeader}>
            <span>Choose one</span>
            <span style={{ cursor: "pointer" }}>
              <AiOutlineClose
                onClick={() => setShowChooseHereOrTakeAwayModel(false)}
              />
            </span>
          </h3>
          <div className="row">
            <div
              className="col-6"
              onClick={() => chooseHereOrTakeAwayOptionFunction("takeaway")}
              style={{ height: "50px", cursor: "pointer" }}
            >
              <div
                className={`${
                  hereOrTakeAwayOption === "takeaway" ? classes.active : ""
                } card h-100 d-flex align-items-center justify-content-center`}
              >
                Take away
              </div>
            </div>
            <div
              className="col-6"
              onClick={() => chooseHereOrTakeAwayOptionFunction("here")}
              style={{ height: "50px", cursor: "pointer" }}
            >
              <div
                className={`${
                  hereOrTakeAwayOption === "here" ? classes.active : ""
                } card h-100 d-flex align-items-center justify-content-center`}
              >
                Here
              </div>
            </div>
          </div>
          {hereOrTakeAwayOption !== "" ? (
            <div className="mt-4">
              <button
                onClick={() => {
                  setShowChooseHereOrTakeAwayModel(false);
                  if (hereOrTakeAwayOption === "takeaway") {
                    setShowCompleteTakeAwayOrderModel(true);
                  }
                  if (hereOrTakeAwayOption === "here") {
                    setShowCompleteHereOrderModel(true);
                  }
                }}
                className="w-100"
              >
                Continue
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {loading ? <LoaderAnimation /> : ""}
    </>
  );
};

export default ChooseHereOrTakeAway;
