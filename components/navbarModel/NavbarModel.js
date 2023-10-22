import Link from "next/link";
import classes from "../../styles/navbarModel.module.css";
import { FaX } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";
import LoaderAnimation from "../loaderAnimation/LoaderAnimation";

const NavbarModel = ({ setShowNavbarModel }) => {
  const [logout, setLogout] = useState(false);
  const router = useRouter();
  return (
    <>
      <main className={classes.navbarModel}>
        <div className={classes.navbarModelDiv}>
          <div className="mb-5 fs-4 text-end">
            <FaX
              onClick={() => setShowNavbarModel(false)}
              style={{ cursor: "pointer" }}
            />
          </div>
          <Link href={`/dashboard/products`}>Products</Link>
          <Link href={`/dashboard/categories`}>Categories</Link>
          <Link href={`/dashboard/setting`}>Setting</Link>
          <Link href={`/dashboard/orders`}>Orders</Link>
          <span
            onClick={() => {
              setLogout(true);
              Cookies.remove("restaurantTokenAndId");
              router.push("/");
            }}
          >
            Log out
          </span>
        </div>
      </main>
      {logout ? <LoaderAnimation /> : ""}
    </>
  );
};

export default NavbarModel;
