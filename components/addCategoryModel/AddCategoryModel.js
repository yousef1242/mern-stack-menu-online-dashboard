import { useState } from "react";
import classes from "../../styles/addCategory.module.css";
import LoaderAnimation from "../loaderAnimation/LoaderAnimation";
import { toast } from "react-toastify";
import requestDashboard from "@/utils/requestDashboard";
import Cookies from "js-cookie";
import { AiOutlineClose } from "react-icons/ai";

const AddCategoryModel = ({ categoriesData, setShowAddCategoryModel }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const restaurantInfo = Cookies.get("restaurantTokenAndId")
      ? JSON.parse(Cookies.get("restaurantTokenAndId"))
      : null;
    if (restaurantInfo === null) {
      return toast.error("Token doesn't exist please try again");
    }
    if (!title) {
      return toast.error("Please fill in all fields.");
    }
    setLoading(true);
    try {
      const { data } = await requestDashboard.post(
        "/api/categories/create",
        {
          title: title,
          restaurantId: restaurantInfo?.id,
        },
        {
          headers: {
            Authorization: `bearer ${restaurantInfo?.token}`,
          },
        }
      );
      toast.success(data?.message);
      categoriesData.push({ title: title });
      setShowAddCategoryModel(false);;
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <div className={classes.dashboardAddCategorytDiv}>
        <div className={classes.dashboardAddCategoryForm}>
          <h3 className={classes.dashboardAddCategoryFormHeader}>
            <span>Add category</span>
            <span style={{ cursor: "pointer" }}>
              <AiOutlineClose onClick={() => setShowAddCategoryModel(false)} />
            </span>
          </h3>
          <form onSubmit={formSubmitHandler}>
            <div className={classes.dashboardAddCategoryFormGroup}>
              <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="title"
              />
            </div>
            <button type="submit" className="w-100 d-block mt-4">
              Add
            </button>
          </form>
        </div>
      </div>
      {loading ? <LoaderAnimation /> : ""}
    </>
  );
};

export default AddCategoryModel;
