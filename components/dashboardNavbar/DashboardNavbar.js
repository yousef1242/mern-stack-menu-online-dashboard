import { useState } from "react";
import { FaBars } from "react-icons/fa6";
import NavbarModel from "../navbarModel/NavbarModel";

const DashboardNavbar = () => {
  const [showNavbarModel, setShowNavbarModel] = useState(false);
  return (
    <>
      <div className="w-100 header bg-white z-1 position-relative py-3">
        <div className="container">
          <div className="row slign-item-center">
            <div className="col-6">
              <h2 className="fw-bold text-black">Dashboard</h2>
            </div>
            <div className="col-6 text-end">
              <h4 onClick={() => setShowNavbarModel(true)}>
                <FaBars style={{ cursor: "pointer" }} />
              </h4>
            </div>
          </div>
        </div>
      </div>
      {showNavbarModel ? <NavbarModel setShowNavbarModel={setShowNavbarModel} /> : ""}
    </>
  );
};

export default DashboardNavbar;
