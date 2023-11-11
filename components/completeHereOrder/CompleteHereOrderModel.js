import { useEffect, useState } from "react";
import classes from "../../styles/completeHereOrderModel.module.css";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Html5QrcodeScanner } from "html5-qrcode";
import LoaderAnimation from "../loaderAnimation/LoaderAnimation";
import Cookies from "js-cookie";
import io from "socket.io-client";
import { emptyCartItemsAction } from "@/redux/slices/cartSlice";

const socket = io("https://menuonline.onrender.com");

const CompleteHereOrderModel = ({ setShowCompleteHereOrderModel }) => {
  const [loading, setLoading] = useState(false);
  const [cartProductsValues, setCartProductsValues] = useState(0);
  const [productIds, setProductId] = useState([]);
  const [quantatys, setQuantaty] = useState([]);
  const [prices, setPrices] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [notes, setNotes] = useState("");
  const [scanResult, setScanResult] = useState("");
  const { cart } = useSelector((state) => state.cart);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });
    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      setScanResult(result);
    }
    function error(err) {
      console.warn(err);
    }
  }, []);

  const setProductsIds = () => {
    const productIds = cart?.map((cart) => cart.productId);
    setProductId(productIds);
  };

  const setProductsPrices = () => {
    const prices = cart?.map((cart) => cart.price);
    setPrices(prices);
  };

  const setProductsSizes = () => {
    const sizes = cart?.map((cart) => cart.size);
    setSizes(sizes);
  };

  const setProductsQuantanty = () => {
    const productQuantatys = cart?.map((cart) => cart.quantaty);
    setQuantaty(productQuantatys);
  };

  useEffect(() => {
    setProductsIds();
    setProductsQuantanty();
    setProductsSizes();
    setProductsPrices();
  }, [cart]);

  useEffect(() => {
    const totalCartValues = cart?.reduce((total, cartItem) => {
      return (total += cartItem.quantaty * cartItem.price);
    }, 0);
    setCartProductsValues(totalCartValues);
  }, [cart]);
  
  const createOrderFormHandker = async (e) => {
    e.preventDefault();
    if (!scanResult) {
      return toast.error("Please scan the qr code");
    }
    if (router.query.restaurantId) {
      setLoading(true);
      socket.emit("createOrder", {
        restaurantId: router.query.restaurantId,
        tableNumber: scanResult,
        notes: notes,
        totalPrice: cartProductsValues,
        productIds: productIds,
        quantatys: quantatys,
        sizes: sizes,
        prices: prices,
        isPaid: true,
      });
      try {
        socket.on("orderCreated", (data) => {
          toast.success(data?.message);
          router.push(
            `/order/complete?orderNumber=${data?.saveOrder?.orderNumber}`
          );
        });
        Cookies.set("orderComlete", JSON.stringify(true));
        dispatch(emptyCartItemsAction());
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      return toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className={classes.completeOrderModel}>
        <div className={classes.completeOrderModelDiv}>
          <h3 className={classes.completeOrderModelDivHeader}>
            <span>Complete your order</span>
            <span style={{ cursor: "pointer" }}>
              <AiOutlineClose
                onClick={() => setShowCompleteHereOrderModel(false)}
              />
            </span>
          </h3>
          <div className="mb-4">
            <span className="mb-3 d-block fw-bold">Follow the steps : </span>
            <span className="mb-1 d-block">
              1- Request your camera permission
            </span>
            <span className="mb-1 d-block">
              2- Scan the qr code to get the number of your table
            </span>
          </div>
          <form onSubmit={createOrderFormHandker}>
            <div className={classes.completeOrderModelFormGroup}>
              <div>
                {scanResult ? (
                  <div>Your table number is : {scanResult}</div>
                ) : (
                  <div id="reader"></div>
                )}
              </div>
            </div>
            <div className={classes.completeOrderModelFormGroup}>
              <textarea
                onChange={(e) => setNotes(e.target.value)}
                value={notes}
                rows="10"
                placeholder="notes..."
              ></textarea>
            </div>
            <button type="submit" className="w-100 d-block mt-4">
              Order
            </button>
          </form>
        </div>
      </div>
      {loading ? <LoaderAnimation /> : ""}
    </>
  );
};

export default CompleteHereOrderModel;
