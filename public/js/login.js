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

export const logout = async () => {
  try {
    await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });

    window.location.assign("/");
  } catch (err) {
    const message =
      (err.response && err.response.data && err.response.data.message) ||
      "Logout failed. Please try again.";

    showAlert("error", message);
  }
};
