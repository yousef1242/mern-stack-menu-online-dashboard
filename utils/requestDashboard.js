import axios from "axios";

const requestDashboard = axios.create({
  baseURL: "https://menuonline.onrender.com",
});

export default requestDashboard;