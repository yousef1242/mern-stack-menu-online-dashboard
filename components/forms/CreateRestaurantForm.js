import { useState } from "react";
import classes from "../../styles/restaurantForm.module.css";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import requestDashboard from "@/utils/requestDashboard";
import LoaderAnimation from "../loaderAnimation/LoaderAnimation";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const CreateRestaurantForm = ({ setCreateRestaurantFormShow }) => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [instagramPageLink, setInstagramPageLink] = useState("");
  const [facebookPageLink, setFacebookPageLink] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !title ||
      !email ||
      !password ||
      !address ||
      !openTime ||
      !closeTime ||
      !instagramPageLink ||
      !facebookPageLink ||
      file === null
    ) {
      return toast.error("Please fill in all fields.");
    }
    const formData = new FormData();
    formData.append("restaurantName", name);
    formData.append("restaurantTitle", title);
    formData.append("restaurantPassword", password);
    formData.append("restaurantEmail", email);
    formData.append("restaurantFacebookPageLink", facebookPageLink);
    formData.append("restaurantInstagramPageLink", instagramPageLink);
    formData.append("restaurantAdress", address);
    formData.append("restaurantOpenTime", openTime);
    formData.append("restaurantCloseTime", closeTime);
    formData.append("image", file);
    setLoading(true);
    try {
      const { data } = await requestDashboard.post(
        "/api/restaurant/create",
        formData
      );
      toast.success(data?.message);
      Cookies.set(
        "restaurantId",
        JSON.stringify(data?.saveRestaurant._id)
      );
      router.push("/subscribe");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message);
      if (error.response?.status === 400) {
        toast.error("File type is not supported");
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className={classes.restaurantDiv}>
        <div className={classes.restaurantForm}>
          <h3 className={classes.restaurantFormHeader}>
            <span>Signup</span>
            <span style={{ cursor: "pointer" }}>
              <AiOutlineClose
                onClick={() => setCreateRestaurantFormShow(false)}
              />
            </span>
          </h3>
          <form onSubmit={formSubmitHandler}>
            <div className={classes.restaurantFormGroup}>
              <input
                type="text"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={classes.restaurantFormGroup}>
              <input
                type="text"
                placeholder="title... coffe&drinks"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={classes.restaurantFormGroup}>
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={classes.restaurantFormGroup}>
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={classes.restaurantFormGroup}>
              <input
                type="text"
                placeholder="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className={classes.restaurantFormGroup}>
              <input
                type="text"
                placeholder="time to open"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
              />
            </div>
            <div className={classes.restaurantFormGroup}>
              <input
                type="text"
                placeholder="time to close"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
              />
            </div>
            <div className={classes.restaurantFormGroup}>
              <input
                type="text"
                placeholder="instagram page link"
                value={instagramPageLink}
                onChange={(e) => setInstagramPageLink(e.target.value)}
              />
            </div>
            <div className={classes.restaurantFormGroup}>
              <input
                type="text"
                placeholder="facebook page link"
                value={facebookPageLink}
                onChange={(e) => setFacebookPageLink(e.target.value)}
              />
            </div>
            <div className={classes.restaurantFormGroup}>
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                id="image"
              />
            </div>
            <button type="submit" className="w-100 d-block mt-4">
              Create
            </button>
          </form>
        </div>
      </div>
      {loading ? <LoaderAnimation /> : ""}
    </>
  );
};

export default CreateRestaurantForm;
