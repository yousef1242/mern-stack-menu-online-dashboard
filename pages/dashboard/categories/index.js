import Head from "next/head";
import classes from "../../../styles/dashboard.module.css";
import requestDashboard from "@/utils/requestDashboard";
import * as cookie from "cookie";
import { useEffect, useState } from "react";
import DashboardNavbar from "@/components/dashboardNavbar/DashboardNavbar";
import AddCategoryModel from "@/components/addCategoryModel/AddCategoryModel";
import { toast } from "react-toastify";
import swal from "sweetalert";
import Cookies from "js-cookie";
import LoaderAnimation from "@/components/loaderAnimation/LoaderAnimation";

const DashboardCategoriesPage = ({ categories, error }) => {
  const [showAddCategoryModel, setShowAddCategoryModel] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

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
    if (categories) {
      setCategoriesData(categories);
    }
  }, []);

  const submitFormHandler = async () => {
    const restaurantInfo = Cookies.get("restaurantTokenAndId")
      ? JSON.parse(Cookies.get("restaurantTokenAndId"))
      : null;
    if (restaurantInfo === null) {
      return toast.error("Token doesn't exist please try again");
    }
    setLoading(true);
    try {
      const { data } = await requestDashboard.delete(
        `/api/categories/${categoryId}`,
        {
          headers: {
            Authorization: `bearer ${restaurantInfo?.token}`,
          },
        }
      );
      toast.success(data?.message);
      setLoading(false);
      const filterCategories = categoriesData?.filter(
        (cat) => cat._id !== categoryId
      );
      setCategoriesData(filterCategories);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };

  if (showAlert) {
    swal({
      title: "Are you sure?",
      text: "To delete this category",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        submitFormHandler();
        setShowAlert(false);
      } else {
        setShowAlert(false);
      }
    });
  }

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
              Categories
            </h2>
            <div className="products-filter-div mb-5 d-flex align-items-center justify-content-between">
              <div>
                <button
                  onClick={() => {
                    setShowAddCategoryModel(true);
                  }}
                >
                  Add category
                </button>
              </div>
            </div>
            <div className="row">
              {categoriesData?.length > 0 ? (
                categoriesData?.map((cat) => (
                  <div key={cat?._id} className="col-12 mb-3 col-sm-4">
                    <div className={classes.categoryBodyDiv}>
                      <span>{cat?.title}</span>
                      <div
                        onClick={() => {
                          setCategoryId(cat?._id);
                          setShowAlert(true);
                        }}
                        className={classes.dashboardPageOverlayDeleteCategory}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <h3>No categories exist</h3>
              )}
            </div>
          </div>
        </div>
      </main>
      {loading ? <LoaderAnimation /> : ""}
      {showAddCategoryModel ? (
        <AddCategoryModel
          categoriesData={categoriesData}
          setShowAddCategoryModel={setShowAddCategoryModel}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default DashboardCategoriesPage;

export async function getServerSideProps(context) {
  const parsedCookies = cookie.parse(context.req.headers.cookie);
  const jsonCookie = JSON.parse(parsedCookies.restaurantTokenAndId);
  try {
    const { data } = await requestDashboard.get(
      `/api/categories/${jsonCookie?.id}`,
      {
        headers: {
          Authorization: `Bearer ${jsonCookie?.token}`,
        },
      }
    );

    // Return the data as props
    return {
      props: {
        categories: data,
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
