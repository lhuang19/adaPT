// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from "@env";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://adapt-350.herokuapp.com/api"
    : `${BASE_URL}/api`;

export default baseUrl;
