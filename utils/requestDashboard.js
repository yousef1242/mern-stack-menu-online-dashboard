import axios from "axios";

const requestDashboard = axios.create({
  baseURL: "http://localhost:8080",
});

export default requestDashboard;