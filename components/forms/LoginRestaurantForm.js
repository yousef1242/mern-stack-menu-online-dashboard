import { toast } from "react-toastify";
import classes from "../../styles/restaurantForm.module.css";
import { AiOutlineClose } from "react-icons/ai";
import requestDashboard from "@/utils/requestDashboard";
import { useRouter } from "next/router";
import LoaderAnimation from "../loaderAnimation/LoaderAnimation";
import { useState } from "react";
import Cookies from "js-cookie";

const LoginRestaurantForm = ({ setLoginRestaurantFormShow }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // login function
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill in all fields.");
    }
    setLoading(true);
    try {
      const { data } = await requestDashboard.post("/api/restaurant/login", {
        email: email,
        password: password,
      });
      toast.success(data?.message);
      Cookies.set("restaurantTokenAndId", JSON.stringify(data));
      router.push("/dashboard/products");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <div className={classes.restaurantDiv}>
        <div className={classes.restaurantForm}>
          <h3 className={classes.restaurantFormHeader}>
            <span>Login</span>
            <span style={{ cursor: "pointer" }}>
              <AiOutlineClose
                onClick={() => setLoginRestaurantFormShow(false)}
              />
            </span>
          </h3>
          <form onSubmit={formSubmitHandler}>
            <div className={classes.restaurantFormGroup}>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
              />
            </div>
            <div className={classes.restaurantFormGroup}>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
              />
            </div>
            <button type="submit" className="w-100 d-block mt-4">
              Login
            </button>
          </form>
        </div>
      </div>
      {loading ? <LoaderAnimation /> : ""}
    </>
  );
};

export default LoginRestaurantForm;
