import { AiOutlineClose } from "react-icons/ai";
import classes from "../../styles/showProductDetailsModel.module.css";
import Link from "next/link";
import { toast } from "react-toastify";
import requestDashboard from "@/utils/requestDashboard";
import { useRouter } from "next/router";
import { useState } from "react";
import LoaderAnimation from "../loaderAnimation/LoaderAnimation";
import Cookies from "js-cookie";
import Image from "next/image";

const ShowProductDetailsModel = ({
  product,
  setShowProductDetailsModel,
  productsData,
  setProductsData,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submitFormHandler = async (e) => {
    e.preventDefault();
    const restaurantInfo = Cookies.get("restaurantTokenAndId")
      ? JSON.parse(Cookies.get("restaurantTokenAndId"))
      : null;
    if (restaurantInfo === null) {
      return toast.error("Token doesn't exist please try again");
    }
    setLoading(true);
    try {
      const { data } = await requestDashboard.delete(
        `/api/products/${product?._id}`,
        {
          headers: {
            Authorization: `bearer ${restaurantInfo?.token}`,
          },
        }
      );
      toast.success(data?.message);
      setLoading(false);
      setShowProductDetailsModel(false);
      const filterProducts = productsData?.filter(
        (item) => item._id !== product._id
      );
      setProductsData(filterProducts);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message);
      if (
        error.response.data.message ===
        "This restaurant doesn't subscribe in any plan"
      ) {
        router.push("/dashboard/error");
      }
    }
  };

  return (
    <>
      <div key={product?._id} className={classes.showProductDetailsModel}>
        <h1>
          <AiOutlineClose onClick={() => setShowProductDetailsModel(false)} />
        </h1>
        <div className={classes.showProductDetailsModelDiv}>
          <div className="mb-4 position-relative">
            <div className={product?.isAvilable ? "" : classes.overlay}></div>
            {product?.image ? (
              <Image alt="" src={product?.image} width={300} height={300} />
            ) : (
              <LoaderAnimation />
            )}
          </div>
          <div className="px-4">
            <h3 className="mb-4 fw-bold">{product.name}</h3>
            <h6 className="mb-4" style={{ color: "#777" }}>
              {product?.ingredients}
            </h6>
            {product?.sizes?.map((size) => (
              <div className="mb-4 d-flex justify-content-between">
                <span>{size?.size}</span>
                <span>{size?.price}</span>
              </div>
            ))}
            <div className="mt-5">
              <button className="w-100 mb-2">
                <Link
                  className="d-block text-decoration-none text-white"
                  href={`/dashboard/products/update/${product?._id}`}
                >
                  Update
                </Link>
              </button>
              <button
                type="submit"
                onClick={submitFormHandler}
                className="w-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      {loading ? <LoaderAnimation /> : ""}
    </>
  );
};

export default ShowProductDetailsModel;
