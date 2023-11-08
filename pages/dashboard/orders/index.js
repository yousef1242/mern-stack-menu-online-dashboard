import Head from "next/head";
import classes from "../../../styles/dashboard.module.css";
import requestDashboard from "@/utils/requestDashboard";
import * as cookie from "cookie";
import DashboardNavbar from "@/components/dashboardNavbar/DashboardNavbar";
import { AiOutlineCheck } from "react-icons/ai";
import { FaX } from "react-icons/fa6";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { BsFilter } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";

const socket = io("https://menuonline.onrender.com");

const DashboardProducts = ({ orders, errorMessage, error }) => {
  const [ordersData, setOrdersData] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const router = useRouter();

  // errors
  useEffect(() => {
    if (errorMessage || error) {
      if (errorMessage) {
        toast.error(errorMessage);
      }
      Cookies.remove("restaurantTokenAndId");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [errorMessage]);

  // set orders in setOrdersData
  useEffect(() => {
    if (orders) {
      setOrdersData(orders);
    }
  }, [orders]);

  // restaurantId socket io room
  useEffect(() => {
    const restaurantData = Cookies.get("restaurantTokenAndId")
      ? JSON.parse(Cookies.get("restaurantTokenAndId"))
      : null;

    if (restaurantData) {
      socket.emit("joinRestaurantRoom", { restaurantId: restaurantData.id });
    }
  }, [router.query.prepared, router.query.paid]);

  useEffect(() => {
    socket.on("newOrderCreatedToRestaurantId", (data) => {
      // console.log(data);
      // Ensure that you're not adding duplicate orders to the state.
      setOrdersData((prevOrders) => {
        // Check if the order with the same ID already exists in the state.
        if (!prevOrders.some((order) => order._id === data._id)) {
          // If not, add the new order to the beginning of the array.
          if (
            router.query.prepared === "notPrepared" &&
            data.isPrepared === false &&
            data.isPaid === true
          ) {
            return [...prevOrders, data];
          } else if (router.query.paid === "notPaid" && data.isPaid === false) {
            return [...prevOrders, data];
          }
        }
        return prevOrders;
      });
    });
    socket.on("updateOrderThatPaidToRestaurantId", (data) => {
      // Ensure that you're not adding duplicate orders to the state.
      setOrdersData((prevOrders) => {
        // Check if the order with the same ID already exists in the state.
        if (!prevOrders.some((order) => order._id === data._id)) {
          // If not, add the new order to the beginning of the array.
          if (
            router.query.prepared === "notPrepared" &&
            data.isPrepared === false &&
            data.isPaid === true
          ) {
            return [...prevOrders, data];
          } else if (router.query.paid === "notPaid" && data.isPaid === false) {
            return [...prevOrders, data];
          }
        }
        return prevOrders;
      });
    });
  }, [socket,router.query.prepared, router.query.paid]);

  // update order status function
  const updateOrderWhichIsPrepared = async (orderId, orderNumber) => {
    // Find the order with the matching orderId
    const orderToUpdate = ordersData.filter((order) => order._id !== orderId);

    // Check if the order was found
    if (orderToUpdate) {
      setOrdersData(orderToUpdate); // Create a new array to trigger a state update
    }
    try {
      const restaurantId = Cookies.get("restaurantTokenAndId")
        ? JSON.parse(Cookies.get("restaurantTokenAndId"))
        : null;
      if (restaurantId) {
        await requestDashboard.put(
          `/api/orders/update/${restaurantId?.id}`,
          {
            orderId,
            updateOption: "prepared",
          },
          {
            headers: {
              Authorization: `Bearer ${restaurantId?.token}`,
            },
          }
        );
        socket.emit("orderHasBeenDone", { orderNumber: orderNumber });
      } else {
        toast.error("Somthing went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.response?.message);
    }
  };

  // update order status function
  const updateOrderWhichIsPaid = async (orderId) => {
    // Find the order with the matching orderId
    const orderToUpdate = ordersData.filter((order) => order._id !== orderId);

    // Check if the order was found
    if (orderToUpdate) {
      setOrdersData(orderToUpdate); // Create a new array to trigger a state update
    }
    try {
      const restaurantId = Cookies.get("restaurantTokenAndId")
        ? JSON.parse(Cookies.get("restaurantTokenAndId"))
        : null;
      if (restaurantId) {
        socket.emit("updateOrderThatPaid", {
          orderId: orderId,
          restaurantId: restaurantId,
        });
      } else {
        toast.error("Somthing went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.response?.message);
    }
  };

  //update status routes
  const handleStatusClick = (preparedValue, isPaidValue) => {
    const query =
      preparedValue === "all"
        ? {}
        : preparedValue
        ? { prepared: preparedValue }
        : isPaidValue && { paid: isPaidValue };
    router.push({
      pathname: `/dashboard/orders`,
      query,
    });
  };

  // filter orders by search input
  const filterorderBySearchInput = () => {
    const filterOrders =
      searchInputValue === ""
        ? ordersData
        : ordersData?.filter((order) =>
            order.orderNumber
              .toLowerCase()
              .includes(searchInputValue.toLowerCase())
          );
    setOrdersData(filterOrders);
  };

  // reset search input
  const resetSearchInput = () => {
    setOrdersData(orders);
    setSearchInputValue("");
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
            <div className="mb-5 d-flex align-items-center justify-content-between">
              <div>
                <h2
                  className={`${classes.dashboardTitle} fw-bold`}
                  style={{ color: "var(--small-headlines-color)" }}
                >
                  Orders
                </h2>
              </div>
              <div>
                <Dropdown className={classes.productsFilterDropDown}>
                  <Dropdown.Toggle className="button" id="dropdown-basic">
                    Filter By <BsFilter />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <span
                      onClick={() => handleStatusClick("all", false)}
                      className={
                        !router.query.category ? classes.activeCategory : ""
                      }
                    >
                      All
                    </span>
                    <span
                      onClick={() => handleStatusClick("notPrepared", false)}
                      className={
                        !router.query.category ? classes.activeCategory : ""
                      }
                    >
                      Not prepared
                    </span>
                    <span
                      onClick={() => handleStatusClick(false, "notPaid")}
                      className={
                        !router.query.category ? classes.activeCategory : ""
                      }
                    >
                      Not paid
                    </span>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="mb-5 d-flex align-items-center justify-content-center gap-2 px-4">
              <input
                type="text"
                className={classes.dashbaordPageSearchInputFilter}
                placeholder="Search by order number..."
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
              />
              <button onClick={filterorderBySearchInput}>Search</button>
              <button onClick={resetSearchInput}>Reset</button>
            </div>
            <div className="row">
              {ordersData?.length > 0 ? (
                ordersData?.map((order) => (
                  <div
                    key={order?._id}
                    className="col-12 col-md-4  border py-2"
                  >
                    <div className="mb-2">
                      <div>
                        <span className="opacity-75">placed on : </span>
                        {order?.createdAt && (
                          <span>
                            {new Date(order?.createdAt).toLocaleDateString(
                              "en-US"
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mb-2">
                      <div>
                        <span className="opacity-75">table number : </span>
                        <span>{order?.tableNumber}</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div>
                        <span className="opacity-75">order number : </span>
                        <span>{order?.orderNumber}</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div>
                        <span className="opacity-75">prepared : </span>
                        <span>
                          {order?.isPrepared ? (
                            <AiOutlineCheck />
                          ) : router.query.prepared ? (
                            <FaX
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                updateOrderWhichIsPrepared(
                                  order?._id,
                                  order?.orderNumber
                                )
                              }
                            />
                          ) : (
                            <span
                              className="opacity-75"
                              style={{
                                background: "#099809",
                                borderRadius: "2px",
                                padding: "1px 2px",
                                color: "#fff",
                              }}
                            >
                              not prepared
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div>
                        <span className="opacity-75">paid : </span>
                        <span>
                          {order?.isPaid ? (
                            <AiOutlineCheck />
                          ) : router.query.paid ? (
                            <FaX
                              onClick={() => updateOrderWhichIsPaid(order?._id)}
                              style={{ cursor: "pointer" }}
                            />
                          ) : (
                            <span
                              className="opacity-75"
                              style={{
                                background: "#099809",
                                borderRadius: "2px",
                                padding: "1px 2px",
                                color: "#fff",
                              }}
                            >
                              not paid
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2 d-flex flex-wrap">
                      <span className="opacity-75">order : </span>{" "}
                      <div className="d-flex align-items-center flex-wrap">
                        {order?.products?.map((product) => (
                          <>
                            <div>
                              <span>{product?.productId?.name}</span>(
                              <span>{product?.size}</span>) (
                              <span>{product?.quantaty}</span>)
                            </div>{" "}
                            {"-"}
                          </>
                        ))}
                      </div>
                    </div>
                    <div className="mb-2">
                      <div>
                        <span className="opacity-75">notes : </span>
                        <span>{order?.notes}</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div>
                        <span className="opacity-75">total price : </span>
                        <span>EGP {order?.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h3>No orders exist</h3>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardProducts;

export async function getServerSideProps(context) {
  const { prepared, paid } = context.query;
  const parsedCookies = cookie.parse(context.req.headers.cookie);
  const jsonCookie = JSON.parse(parsedCookies.restaurantTokenAndId);

  try {
    const { data } = await requestDashboard.get(
      `/api/orders/${jsonCookie?.id}?prepared=${prepared}&paid=${paid}`,
      {
        headers: {
          Authorization: `Bearer ${jsonCookie?.token}`,
        },
      }
    );

    // Return the data as props
    return {
      props: {
        orders: data,
      },
    };
  } catch (error) {
    // In case of an error, return an empty object or an error message, or handle it as needed
    return {
      props: {
        errorMessage: error?.response?.data?.message,
        error: error,
      },
    };
  }
}
