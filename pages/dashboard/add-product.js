import DashboardNavbar from "@/components/dashboardNavbar/DashboardNavbar";
import classes from "../../styles/addProduct.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Cookies from "js-cookie";
import requestDashboard from "@/utils/requestDashboard";
import { toast } from "react-toastify";
import LoaderAnimation from "@/components/loaderAnimation/LoaderAnimation";

const AddProductPage = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [isAvilable, setIsAvilable] = useState(false);
  const [file, setFile] = useState(null);
  const [sizeAndPriceInputs, setSizeAndPriceInputs] = useState([
    { size: "", price: "" },
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

  const submitFormHandler = async (e) => {
    e.preventDefault();
    const restaurantInfo = Cookies.get("restaurantTokenAndId")
      ? JSON.parse(Cookies.get("restaurantTokenAndId"))
      : null;
    if (restaurantInfo === null) {
      return toast.error("Token doesn't exist please try again");
    }
    if (!name || !category || !ingredients || !file) {
      return toast.error("Please fill in all fields.");
    }
    const formData = new FormData();
    formData.append("restaurantId", restaurantInfo?.id);
    formData.append("name", name);
    formData.append("ingredients", ingredients);
    formData.append("category", category);
    formData.append("isAvilable", isAvilable);
    formData.append("image", file);
    for (let i = 0; i < sizeAndPriceInputs.length; i++) {
      formData.append("size", sizeAndPriceInputs[i].size);
    }
    for (let i = 0; i < sizeAndPriceInputs.length; i++) {
      formData.append("price", sizeAndPriceInputs[i].price);
    }
    setLoading(true);
    try {
      const { data } = await requestDashboard.post(
        "/api/products/create",
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
              Add Product
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
                <select onChange={(e) => setCategory(e.target.value)}>
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
                {sizeAndPriceInputs.map((input, index) => (
                  <div className="d-flex align-items-center mb-2" key={index}>
                    <input
                      onChange={(e) => {
                        const newInputs = [...sizeAndPriceInputs];
                        newInputs[index].size = e.target.value;
                        setSizeAndPriceInputs(newInputs);
                      }}
                      type="text"
                      placeholder="size"
                      value={input.size}
                    />
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
                  </div>
                ))}
              </div>
              <div className={classes.addProductFormGroup}>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <div
                className={`${classes.addProductFormGroup} d-flex align-items-center gap-3`}
              >
                <input
                  onChange={(e) => {
                    setIsAvilable(e.target.checked);
                  }}
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

export default AddProductPage;
