import classes from '../../styles/clientNavbar.module.css';

const ClientNavbar = () => {
  return (
    <>
      <div className={`${classes.clientNavbar} w-100 header z-1 py-3`}>
        <div className="container">
          <div className="row slign-item-center">
            <div className="col-12">
            <h2 className="fw-bold text-white">Restaurant</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientNavbar;
