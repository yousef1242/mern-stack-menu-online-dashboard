import classes from '../../styles/loaderAnimation.module.css';

const LoaderAnimation = () => {
  return (
    <>
      <div className={classes.loaderAnimationDiv}>
        <div className="loader"></div>
      </div>
    </>
  );
};

export default LoaderAnimation;
