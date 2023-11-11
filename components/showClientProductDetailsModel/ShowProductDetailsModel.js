import { AiOutlineClose } from "react-icons/ai";
import classes from "../../styles/showProductDetailsModel.module.css";
import { toast } from "react-toastify";
import { useState } from "react";
import LoaderAnimation from "../loaderAnimation/LoaderAnimation";
import { useDispatch } from "react-redux";
import { addToCartAction } from "@/redux/slices/cartSlice";
import Image from "next/image";

const ShowProductDetailsModel = ({
  productData,
  setShowProductDetailsModel,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState({ size: "", price: "" });
  const dispatch = useDispatch();

  // Handle size selection
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  return (
    <>
      <div key={productData?._id} className={classes.showProductDetailsModel}>
        <h1>
          <AiOutlineClose onClick={() => setShowProductDetailsModel(false)} />
        </h1>
        <div className={classes.showProductDetailsModelDiv}>
          <div className="mb-4 position-relative">
            <div
              className={productData?.isAvilable ? "" : classes.overlay}
            ></div>
            {productData?.image ? (
              <Image
                width={300}
                height={300}
                loading="lazy"
                src={productData?.image?.url}
                alt=""
              />
            ) : (
              <LoaderAnimation />
            )}
          </div>
          <div className="px-4">
            <h3 className="mb-4 fw-bold">{productData?.name}</h3>
            <h6 className="mb-4" style={{ color: "#777" }}>
              {productData?.ingredients}
            </h6>
            <form className="d-flex justify-content-between flex-wrap align-items-center">
              {productData?.sizes?.map((size, index) => (
                <div key={index}>
                  <input
                    type="radio"
                    id={`size-${size?.size}`}
                    name="size"
                    value={size?.size}
                    checked={selectedSize?.size === size.size}
                    onChange={() =>
                      handleSizeChange({ size: size.size, price: size.price })
                    }
                  />{" "}
                  <label>
                    {size?.size} - EGP {size?.price}
                  </label>
                </div>
              ))}
            </form>
            <div className="mt-5">
              <button
                onClick={() => {
                  if (selectedSize.size !== "" || selectedSize.price !== "") {
                    setLoading(true);
                    setTimeout(() => {
                      setLoading(false);
                      setShowProductDetailsModel(false);
                      dispatch(
                        addToCartAction({
                          productId: productData?._id,
                          name: productData?.name,
                          size: selectedSize?.size,
                          price: selectedSize?.price,
                          quantaty: 1,
                        })
                      );
                      toast.success("Product has been added to cart");
                    }, 1000);
                  } else {
                    toast.error("Please choose size");
                  }
                }}
                type="submit"
                className="w-100"
              >
                Add To Cart
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
