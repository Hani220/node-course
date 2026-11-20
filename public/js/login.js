/*eslint-disable*/
import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
  try {
    await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: { email, password },
    });

    window.location.assign("/overview");
  } catch (err) {
    const message =
      err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : "Something went wrong. Please try again.";

    showAlert("error", message);
  }
};
