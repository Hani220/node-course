// disable-eslint
import axios from "axios";
import { showAlert } from "./alert";

// type is password or data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "/api/v1/users/updateMyPassword"
        : "/api/v1/users/updateMe";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.status === 200) {
      showAlert("success", ` ${type.toUpperCase()} updated successfully!`);
    }
  } catch (error) {
    const message =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Failed to update account";

    showAlert("error", message);
  }
};
