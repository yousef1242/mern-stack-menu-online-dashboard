import Image from "next/image";
import notFoundPageImage from "../public/notFoundPageImage.png";
import DashboardNavbar from "@/components/dashboardNavbar/DashboardNavbar";
import Head from "next/head";

const NorFoundPage = () => {
  return (
    <>
    <Head>
      <title>Not found</title>
    </Head>
      <div
        style={{ height: "100vh", overflow: "hidden" }}
        className="d-flex align-items-center text-center"
      >
        <div className="container">
          <div>
            <Image
              width={400}
              height={400}
              loading="lazy"
              alt=""
              src={notFoundPageImage}
            />
            <h2>Sorry, the page you're looking for could not be found.</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default NorFoundPage;
