import DashboardNavbar from "@/components/dashboardNavbar/DashboardNavbar";
import classes from "../../../../styles/addProduct.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Cookies from "js-cookie";
import requestDashboard from "@/utils/requestDashboard";
import { toast } from "react-toastify";
import LoaderAnimation from "@/components/loaderAnimation/LoaderAnimation";
import { FaX } from "react-icons/fa6";

const UpdateProductPage = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [isAvilable, setIsAvilable] = useState(false);
  const [file, setFile] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [sizeAndPriceInputs, setSizeAndPriceInputs] = useState([
    { size: "", price: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getCategoriesDataForRestaurant = async () => {
      const restaurantInfo = Cookies.get("restaurantTokenAndId")
        ? JSON.parse(Cookies.get("restaurantTokenAndId"))
        : null;
      if (restaurantInfo === null) {
        return toast.error("Token doesn't exist please try again");
      }
      const { data } = await requestDashboard.get(
        `/api/categories/${restaurantInfo?.id}`,
        {
          headers: {
            Authorization: `Bearer ${restaurantInfo?.token}`,
          },
        }
      );
      setCategoriesData(data);
    };
    getCategoriesDataForRestaurant();
  }, []);
  
  // update product function
  const submitFormHandler = async (e) => {
    e.preventDefault();
    const restaurantInfo = Cookies.get("restaurantTokenAndId")
      ? JSON.parse(Cookies.get("restaurantTokenAndId"))
      : null;
    if (restaurantInfo === null) {
      return toast.error("Token doesn't exist please try again");
    }
    if (!name || !category || !ingredients) {
      return toast.error("Please fill in all fields.");
    }
    if (sizeAndPriceInputs.length === 0) {
      return toast.error("Please write size with price.");
    }
    const formData = new FormData();
    formData.append("restaurantId", restaurantInfo?.id);
    formData.append("name", name);
    formData.append("ingredients", ingredients);
    formData.append("category", category);
    formData.append("isAvilable", isAvilable);
    formData.append("file", file);
    formData.append("image", productImage);
    for (let i = 0; i < sizeAndPriceInputs.length; i++) {
      formData.append("size", sizeAndPriceInputs[i].size);
    }
    for (let i = 0; i < sizeAndPriceInputs.length; i++) {
      formData.append("price", sizeAndPriceInputs[i].price);
    }
    setLoading(true);
    try {
      const { data } = await requestDashboard.put(
        `/api/products/update/${router.query.productId}`,
        formData,
        {
          headers: {
            Authorization: `bearer ${restaurantInfo?.token}`,
          },
        }
      );
      toast.success(data?.message);
      router.push("/dashboard/products");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message);
      if (
        error.response.data.message ===
        "This restaurant doesn't subscribe in any plan"
      ) {
        router.push("/dashboard/error");
      }
      if (error.response?.status === 400) {
        toast.error("File type is not supported");
      }
    }
  };

  useEffect(() => {
    const getSingleProductDataForRestaurant = async () => {
      const restaurantInfo = Cookies.get("restaurantTokenAndId")
        ? JSON.parse(Cookies.get("restaurantTokenAndId"))
        : null;
      if (restaurantInfo === null) {
        return toast.error("Token doesn't exist please try again");
      }
      try {
        const { data } = await requestDashboard.get(
          `/api/products/${router.query.productId}/${restaurantInfo?.id}`,
          {
            headers: {
              Authorization: `Bearer ${restaurantInfo?.token}`,
            },
          }
        );
        if (data) {
          setName(data.name);
          setIngredients(data.ingredients);
          setCategory(data.category);
          setIsAvilable(data.isAvilable);
          setSizeAndPriceInputs(data.sizes);
          setProductImage(data.image);
        } else {
          return router.push("/dashboard/products");
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      }
    };
    getSingleProductDataForRestaurant();
  }, [router.query.productId]);

  return (
    <>
      <Head>
        <title>Restaurant-dashboard</title>
      </Head>
      <main className={classes.addProductPage}>
        <DashboardNavbar />
        <div className="add-products-section pt-5 pb-3">
          <div className="container">
            <h2
              className={`${classes.addProductTitle} mb-5 fw-bold width`}
              style={{ color: "var(--small-headlines-color)" }}
            >
              Update Product
            </h2>
          </div>
          <div className={`${classes.addProductPageContainer} container`}>
            <form onSubmit={submitFormHandler}>
              <div className={classes.addProductFormGroup}>
                <input
                  type="text"
                  placeholder="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={classes.addProductFormGroup}>
                <input
                  type="text"
                  placeholder="ingredients"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                />
              </div>
              <div className={classes.addProductFormGroup}>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option selected>Choose category</option>
                  {categoriesData?.map((cat) => (
                    <option key={cat?._id}>{cat?.title}</option>
                  ))}
                </select>
              </div>
              <div className={classes.addProductFormGroup}>
                <button
                  type="button"
                  onClick={() => {
                    setSizeAndPriceInputs([
                      ...sizeAndPriceInputs,
                      { size: "", price: "" },
                    ]);
                  }}
                  className="mb-4 mt-3"
                >
                  Add new size
                </button>
                {sizeAndPriceInputs?.map((input, index) => (
                  <div className="d-flex align-items-center mb-2" key={index}>
                  <select
                  value={input.size}
                      onChange={(e) => {
                        const newInputs = [...sizeAndPriceInputs];
                        newInputs[index].size = e.target.value;
                        setSizeAndPriceInputs(newInputs);
                      }}
                    >
                      <option value={""} selected>Choose size</option>
                      <option value={"small"}>small</option>
                      <option value={"medium"}>medium</option>
                      <option value={"large"}>large</option>
                    </select>
                    <input
                      onChange={(e) => {
                        const newInputs = [...sizeAndPriceInputs];
                        newInputs[index].price = e.target.value;
                        setSizeAndPriceInputs(newInputs);
                      }}
                      type="number"
                      placeholder="price"
                      value={input.price}
                    />
                    <h6
                      onClick={() => {
                        const updatedInputs = [...sizeAndPriceInputs];
                        updatedInputs.splice(index, 1); // Remove the input at the current index
                        setSizeAndPriceInputs(updatedInputs);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <FaX />
                    </h6>
                  </div>
                ))}
              </div>
              <div className={classes.addProductFormGroup}>
                <input
                  className="d-none"
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <div className={classes.addProductFormGroup}>
                <div className={classes.addProductFormGroupDivOverlayImage}>
                  <label htmlFor="file">Update</label>
                  <img
                    src={file ? URL.createObjectURL(file) : productImage}
                    className={`${classes.addProductFormGroupDivImage} img-fluid`}
                    alt=""
                  />
                </div>
              </div>
              <div
                className={`${classes.addProductFormGroup} d-flex align-items-center gap-3`}
              >
                <input
                  onChange={(e) => {
                    setIsAvilable(e.target.checked);
                  }}
                  checked={isAvilable}
                  className={classes.addProductFormGroupIsAvilableInput} // prettier-ignore
                  type="checkbox"
                />
                <span>Is Avilable</span>
              </div>
              <button type="submit" className="w-100 d-block mt-4">
                Create
              </button>
            </form>
          </div>
        </div>
        {loading ? <LoaderAnimation /> : ""}
      </main>
    </>
  );
};

export default UpdateProductPage;
