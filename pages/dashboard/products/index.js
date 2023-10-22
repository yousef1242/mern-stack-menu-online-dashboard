import Head from "next/head";
import classes from "../../../styles/dashboard.module.css";
import { BsFilter } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";
import requestDashboard from "@/utils/requestDashboard";
import * as cookie from "cookie";
import { useEffect, useState } from "react";
import ShowProductDetailsModel from "@/components/showProductDetailsModel/ShowProductDetailsModel";
import Link from "next/link";
import DashboardNavbar from "@/components/dashboardNavbar/DashboardNavbar";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Image from "next/image";

const DashboardProducts = ({ products, error }) => {
  const [product, setProduct] = useState({});
  const [showProductDetailsModel, setShowProductDetailsModel] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const router = useRouter();

  // errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      Cookies.remove("restaurantTokenAndId");
      setTimeout(() => {
        router.push("/subscribe");
      }, 2000);
    }
  }, [error]);

  useEffect(() => {
    const getCategoriesDataForRestaurant = async () => {
      const restaurantInfo = Cookies.get("restaurantTokenAndId")
        ? JSON.parse(Cookies.get("restaurantTokenAndId"))
        : null;
      if (restaurantInfo === null) {
        return toast.error("Token doesn't exist please try again");
      }
      const { data } = await requestDashboard.get(
        `/api/categories/${restaurantInfo?.id}`,
        {
          headers: {
            Authorization: `Bearer ${restaurantInfo?.token}`,
          },
        }
      );
      setCategoriesData(data);
    };
    getCategoriesDataForRestaurant();
  }, []);

  useEffect(() => {
    setProductsData(products);
  }, [products]);

  const handleCategoryClick = (categoryValue) => {
    const query = categoryValue === "all" ? {} : { category: categoryValue };
    router.push({
      pathname: `/dashboard/products`,
      query,
    });
  };

  return (
    <>
      <Head>
        <title>Restaurant-dashboard</title>
      </Head>
      <main className={classes.dashbaordPage}>
        {/* navbar */}

        <DashboardNavbar />
        <div
          className="products-section pt-5 pb-3"
          style={{ background: "#efefef" }}
        >
          <div className="container">
            <h2
              className={`${classes.dashboardTitle} mb-5 fw-bold width`}
              style={{ color: "var(--small-headlines-color)" }}
            >
              Products
            </h2>
            <div className="products-filter-div mb-5 d-flex align-items-center justify-content-between">
              <div>
                <button>
                  <Link
                    className="text-white text-decoration-none"
                    href={`/dashboard/add-product`}
                  >
                    Add product
                  </Link>
                </button>
              </div>
              <div>
                <Dropdown className={classes.productsFilterDropDown}>
                  <Dropdown.Toggle className="button" id="dropdown-basic">
                    Filter By <BsFilter />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <span
                      onClick={() => handleCategoryClick("all")}
                      className={
                        !router.query.category ? classes.activeCategory : ""
                      }
                    >
                      All
                    </span>
                    {categoriesData?.map((cat) => (
                      <>
                        <span
                          onClick={() => handleCategoryClick(cat?.title)}
                          key={cat?._id}
                        >
                          {cat?.title}
                        </span>
                      </>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="row">
              {productsData?.length > 0 ? (
                productsData?.map((product) => (
                  <div
                    key={product?._id}
                    className="col-12 mb-3 col-md-6 col-lg-3"
                  >
                    <div className={`${classes.productDiv}`}>
                      <div className={`${classes.imageDiv}`}>
                        <Image
                          alt=""
                          src={product?.image}
                          width={300}
                          height={300}
                          loading="lazy"
                        />
                        {product?.isAvilable ? (
                          ""
                        ) : (
                          <div className={classes.productBodyDivOverlay}></div>
                        )}
                      </div>
                      <div className={classes.productBodyDiv}>
                        <h4
                          onClick={() => {
                            setShowProductDetailsModel(true);
                            setProduct(product);
                          }}
                        >
                          {product.name}
                        </h4>
                        {product?.sizes?.length > 1 ? (
                          <span>
                            EGP {product?.sizes?.slice(0, 1)[0].price} - EGP{" "}
                            {product?.sizes[product.sizes.length - 1].price}
                          </span>
                        ) : (
                          <>
                            <span>
                              {"EGP "} {product?.sizes?.slice(0, 1)[0].price}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h3>No products exist</h3>
              )}
            </div>
          </div>
        </div>
      </main>
      {showProductDetailsModel ? (
        <ShowProductDetailsModel
          setShowProductDetailsModel={setShowProductDetailsModel}
          product={product}
          productsData={productsData}
          setProductsData={setProductsData}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default DashboardProducts;

export async function getServerSideProps(context) {
  const { category } = context.query;
  const parsedCookies = cookie.parse(context.req.headers.cookie);
  const jsonCookie = JSON.parse(parsedCookies.restaurantTokenAndId);
  try {
    const { data } = await requestDashboard.get(
      `/api/products/${jsonCookie?.id}?category=${category}`,
      {
        headers: {
          Authorization: `Bearer ${jsonCookie?.token}`,
        },
      }
    );

    // Return the data as props
    return {
      props: {
        products: data,
      },
    };
  } catch (error) {
    // Return the error as props
    return {
      props: {
        error: error?.response?.data?.message,
      },
    };
  }
}
