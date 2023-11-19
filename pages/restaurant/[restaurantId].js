import ClientNavbar from "@/components/clientNavbar/ClientNavbar";
import { MdOutlineShoppingCartCheckout } from "react-icons/md"
import classes from "../../styles/singleRestaurantMenu.module.css";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { BsFillBagFill } from "react-icons/bs";
import Link from "next/link";
import ShowProductDetailsModel from "@/components/showClientProductDetailsModel/ShowProductDetailsModel";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItemAction,
  updateCartItemAction,
} from "@/redux/slices/cartSlice";
import { toast } from "react-toastify";
import LoaderAnimation from "@/components/loaderAnimation/LoaderAnimation";
import Image from "next/image";
import ChooseHereOrTakeAway from "@/components/chooseHereOrTakeAway/ChooseHereOrTakeAway";
import CompleteHereOrderModel from "@/components/completeHereOrder/CompleteHereOrderModel";
import CompleteTakeAwayOrderModel from "@/components/completeTakeAwayOrder copy/CompleteTakeAwayOrder";
import requestDashboard from "@/utils/requestDashboard";

const SingleRestaurantPage = ({ products, error, errorMessage }) => {
  const [restaurantData, setRestaurantData] = useState({});
  const [productData, setProductData] = useState({});
  const [categoriesData, setCategoriesData] = useState([]);
  const [showProductDetailsModel, setShowProductDetailsModel] = useState(false);
  const [showCompleteHereOrderModel, setShowCompleteHereOrderModel] =
    useState(false);
  const [showCompleteTakeAwayOrderModel, setShowCompleteTakeAwayOrderModel] =
    useState(false);
  const [showChooseHereOrTakeAwayModel, setShowChooseHereOrTakeAwayModel] =
    useState(false);
  const [cartProductsValues, setCartProductsValues] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { cart } = useSelector((state) => state.cart);
  const numberOptions = [];
  const dispatch = useDispatch();

  for (let i = 1; i <= 30; i++) {
    numberOptions.push(i);
  }

  // errors
  useEffect(() => {
    if (error) {
      router.push("/error");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      setTimeout(() => {
        router.push("/error");
      }, 4000);
    }
  }, [errorMessage, error]);

  useEffect(() => {
    const totalCartValues = cart?.reduce((total, cartItem) => {
      return (total += cartItem.quantaty * cartItem.price);
    }, 0);
    setCartProductsValues(totalCartValues);
  }, [cart]);

  useEffect(() => {
    if (router.query.restaurantId) {
      const getSingleRestaurantData = async () => {
        try {
          const { data } = await requestDashboard.get(
            `/api/restaurant/single/${router.query.restaurantId}`
          );
          setRestaurantData(data);
          setLoading(false);
        } catch (error) {
          router.push("/error");
          if (error.response.data.message) {
            console.log(error.response.data.message);
          }
        }
      };
      getSingleRestaurantData();
    }
  }, [router.query.restaurantId, loading]);

  useEffect(() => {
    if (router.query.restaurantId) {
      const getRestaurantCategoriesData = async () => {
        try {
          const { data } = await requestDashboard.get(
            `/api/categories/${router.query.restaurantId}`
          );
          setCategoriesData(data);
        } catch (error) {
          router.push("/error");
          if (error.response.data.message) {
            console.log(error.response.data.message);
          }
        }
      };
      getRestaurantCategoriesData();
    }
  }, [router.query.restaurantId]);

  const handleCategoryClick = (categoryValue) => {
    const query = categoryValue === "all" ? {} : { category: categoryValue };
    const { restaurantId } = router.query;
    router.push({
      pathname: `/restaurant/${restaurantId}`,
      query,
    });
  };
  
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Head>
        <title>Restaurant</title>
      </Head>
      <ClientNavbar />
      <main className={classes.singleRestaurantMenuPage}>
        <div className={`${classes.singleRestaurantSection} container`}>
          <div className={classes.singleRestaurantSectionHeader}>
            <div className={classes.singleRestaurantSectionHeaderImageDiv}>
              <img src={restaurantData?.restaurantImage} alt="" />
            </div>
            <div className={classes.singleRestaurantSectionHeaderBody}>
              <h3>{restaurantData?.restaurantName}</h3>
              <span>{restaurantData?.restaurantAdress}</span>
              <span>{restaurantData?.restaurantTitle}</span>
              <div>
                <Link
                  target="_blank"
                  href={`${restaurantData?.restaurantInstagramPageLink}`}
                >
                  <FaInstagram />
                </Link>
                <Link
                  target="_blank"
                  href={`${restaurantData?.restaurantFacebookPageLink}`}
                >
                  <FaFacebook />
                </Link>
              </div>
            </div>
          </div>
          <div className={classes.singleRestaurantSectionMenu}>
            <div className="row">
              <div className="col-12 col-lg-3">
                <div className={classes.singleRestaurantSectionMenuCategories}>
                  <span
                    onClick={() => handleCategoryClick("all")}
                    className={
                      !router.query.category ? classes.activeCategory : ""
                    }
                  >
                    All
                  </span>
                  {categoriesData?.map((cat) => (
                    <span
                      onClick={() => handleCategoryClick(cat?.title)}
                      className={
                        router.query.category === cat?.title
                          ? classes.activeCategory
                          : ""
                      }
                      key={cat?._id}
                    >
                      {cat?.title}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-12 col-md-8 col-lg-6 mb-md-0 mb-3">
                <div className={classes.singleRestaurantSectionMenuProducts}>
                  {products?.map((product) => (
                    <div key={product?._id}>
                      <div
                        className={`${classes.singleRestaurantSectionMenuProductsDiv}`}
                        key={product?._id}
                      >
                        <div className="d-flex">
                          {" "}
                          <div
                            className={
                              classes.singleRestaurantSectionMenuProductsDivImageDiv
                            }
                          >
                            {product?.isAvilable ? (
                              ""
                            ) : (
                              <div
                                className={
                                  classes.singleRestaurantSectionMenuProductBodyDivOverlay
                                }
                              ></div>
                            )}
                            <Image
                              width={85}
                              height={85}
                              loading="lazy"
                              src={product?.image?.url}
                              alt=""
                            />
                          </div>
                          <div className="ms-2">
                            <h4
                              onClick={() => {
                                if (product?.isAvilable) {
                                  setShowProductDetailsModel(true);
                                  setProductData(product);
                                }
                              }}
                              className={
                                product?.isAvilable
                                  ? "text-decoration-underline"
                                  : ""
                              }
                            >
                              {product?.name}
                            </h4>
                            <p>{product?.ingredients}</p>
                          </div>
                        </div>
                        <div className="text-end">
                          {product?.sizes?.length > 1 ? (
                            <span>
                              EGP {product?.sizes?.slice(0, 1)[0].price} -{" "}
                              {product?.sizes[product.sizes.length - 1].price}
                            </span>
                          ) : (
                            <>EGP {product?.sizes?.slice(0, 1)[0].price}</>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-12 col-md-4 col-lg-3" id="cartSection">
                <div className={classes.singleRestaurantSectionMenuCart}>
                  {cart?.length > 0 ? (
                    <div className="alert alert-warning mb-3">
                      Don't refresh the page to not delete your cart
                    </div>
                  ) : (
                    ""
                  )}
                  <h5 className={classes.singleRestaurantSectionMenuCartHeader}>
                    Your Cart
                  </h5>
                  <div className={classes.singleRestaurantSectionMenuCartBody}>
                    {cart?.length > 0 ? (
                      <>
                        {cart?.map((cart) => (
                          <div
                            className="border-bottom p-2"
                            style={{ background: "rgb(250, 250, 250)" }}
                          >
                            <span className="w-100 d-block mb-2 text-center fw-bold">
                              {cart?.name}
                            </span>
                            <span className="w-100 d-block mb-2 text-center opacity-75 d-flex align-items-center justify-content-between">
                              <span>Size</span>
                              <span>{cart?.size}</span>
                            </span>
                            <span className="w-100 d-block mb-2 text-center opacity-75 d-flex align-items-center justify-content-between">
                              <span>Price</span>
                              <span>{cart?.price}</span>
                            </span>
                            <select
                              onChange={(e) => {
                                dispatch(
                                  updateCartItemAction({
                                    productId: cart?.productId,
                                    quantaty: parseInt(e.target.value),
                                    size: cart?.size,
                                  })
                                );
                              }}
                              className="w-100 d-block mb-2 text-center"
                              value={cart?.quantaty}
                            >
                              {numberOptions.map((num, index) => (
                                <option key={index}>{num}</option>
                              ))}
                            </select>
                            <span
                              onClick={() => {
                                dispatch(
                                  deleteCartItemAction({
                                    productId: cart?.productId,
                                    size: cart?.size,
                                  })
                                );
                                toast.success("Product has deleted");
                              }}
                              className="w-100 d-block text-center"
                              style={{ cursor: "pointer" }}
                            >
                              <FaX />
                            </span>
                          </div>
                        ))}
                        <div className="p-2">
                          <div className="d-flex align-items-center justify-content-between mb-4">
                            <span className="fw-bold">Total amount</span>
                            <span>{cartProductsValues}</span>
                          </div>
                          <button
                            onClick={() =>
                              setShowChooseHereOrTakeAwayModel(true)
                            }
                            className="w-100"
                          >
                            PROCEED
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className={
                            classes.singleRestaurantSectionMenuCartBodyEmpty
                          }
                        >
                          <h6>
                            <BsFillBagFill />
                          </h6>
                          <span className="fw-bold">
                            There are no items in your cart
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showProductDetailsModel ? (
        <ShowProductDetailsModel
          productData={productData}
          setShowProductDetailsModel={setShowProductDetailsModel}
        />
      ) : (
        ""
      )}
      {loading ? <LoaderAnimation /> : ""}
      {showCompleteHereOrderModel ? (
        <CompleteHereOrderModel
          setShowCompleteHereOrderModel={setShowCompleteHereOrderModel}
        />
      ) : (
        ""
      )}
      {showChooseHereOrTakeAwayModel ? (
        <ChooseHereOrTakeAway
          setShowChooseHereOrTakeAwayModel={setShowChooseHereOrTakeAwayModel}
          setShowCompleteHereOrderModel={setShowCompleteHereOrderModel}
          setShowCompleteTakeAwayOrderModel={setShowCompleteTakeAwayOrderModel}
        />
      ) : (
        ""
      )}
      {showCompleteTakeAwayOrderModel ? (
        <CompleteTakeAwayOrderModel
          setShowCompleteTakeAwayOrderModel={setShowCompleteTakeAwayOrderModel}
        />
      ) : (
        ""
      )}
      <button onClick={() => scrollToSection("cartSection")} className={classes.goToCartSectionBtn}><MdOutlineShoppingCartCheckout /></button>
    </>
  );
};

export default SingleRestaurantPage;

export async function getServerSideProps(context) {
  const { restaurantId, category } = context.query;
  try {
    const { data } = await requestDashboard.get(
      `/api/products/${restaurantId}?category=${category}`
    );

    // Return the data as props
    return {
      props: {
        products: data,
      },
    };
  } catch (error) {
    // Return the error as props
    console.log(error);
    return {
      props: {
        error: error,
        errorMessage: error?.response?.data?.message,
      },
    };
  }
}
