import axios from "axios";

const request = axios.create({
  baseURL: "https://650d8cbea8b42265ec2c5f8c.mockapi.io/",
  timeout: 10000,
});

export default request;
