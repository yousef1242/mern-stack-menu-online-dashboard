import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <ToastContainer theme="light" position="top-center" />
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
