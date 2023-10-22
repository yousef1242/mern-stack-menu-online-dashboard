import DashboardNavbar from "@/components/dashboardNavbar/DashboardNavbar";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import classes from "../../styles/addCategory.module.css";

const AddCategoryPage = () => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Restaurant-dashboard</title>
      </Head>
      <main className={classes.AddCategoryPage}>
        <DashboardNavbar />
        <div className="add-products-section pt-5 pb-3">
          <div className="container">
            <h2
              className={`${classes.AddCategoryPageTitle} mb-5 fw-bold width`}
              style={{ color: "var(--small-headlines-color)" }}
            >
              Add Category
            </h2>
          </div>
          <div
            className={`${classes.AddCategoryPageContainer} h-100 container`}
          >
            <div className={classes.addCategoryPageFormDiv}>
              <form>
                <div className={classes.AddCategoryPageGroup}>
                  <input
                    type="text"
                    placeholder="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-100 d-block mt-4">
                  Create
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AddCategoryPage;
