import { getRequestUrl, getPostRequestOptions } from "../utils/Util";
import Configs from "../config/Configs";

export const signin = async (requestObj = {}) => {
  let url = Configs.USER_MGMT_BASE + "signin/";
  let options = getPostRequestOptions(requestObj);
  let response = await fetch(url, options);
  // console.log(await response.text(),url,options)
  return await response.json();
};
export const fetchProfile = async (requestObj = {}) => {
  let url = Configs.USER_MGMT_BASE + "fetch_profile/";

  let options = getPostRequestOptions(requestObj);
  let response = await fetch(url, options);
  return await response.json();
};
export const saveDeviceToken = async (requestObj = {}) => {
  let url = Configs.USER_MGMT_BASE + "save_device_token/";
  let options = getPostRequestOptions(requestObj);
  let response = await fetch(url, options);
  return await response.json();
};

export const getEmplyeer = async (cid) => {
  let url = getRequestUrl(Configs.USER_MGMT_BASE + "employeers", { cid });
  let response = await fetch(url);
  console.log(url);
  return await response.json();
};

export const getReportingManager = async (cid) => {
  let url = getRequestUrl(Configs.USER_MGMT_BASE + "reporting_manager", {
    cid,
  });
  let response = await fetch(url);
  return await response.json();
};

export const getAssignedReportingManager = async (cid, user_id) => {
  let url = getRequestUrl(
    Configs.USER_MGMT_BASE + "assigned_reporting_manager",
    { cid, user_id }
  );
  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const manageEmployeer = async (requestObj = {}) => {
  let url = Configs.USER_MGMT_BASE + "manage_employeer/";
  let options = getPostRequestOptions(requestObj);
  let response = await fetch(url, options);
  return await response.json();
};

export const getDepartments = async (cid) => {
  let url = getRequestUrl(Configs.USER_MGMT_BASE + "departments", { cid });
  let response = await fetch(url);
  return await response.json();
};

export const manageDepartment = async (requestObj = {}) => {
  let url = Configs.USER_MGMT_BASE + "manage_department/";
  let options = getPostRequestOptions(requestObj);
  let response = await fetch(url, options);
  return await response.json();
};

export const getDesignations = async (requestObj) => {
  let url = getRequestUrl(Configs.USER_MGMT_BASE + "designations", requestObj);
  let response = await fetch(url);
  return await response.json();
};

export const getDesignationsbySections = async (requestObj) => {
  let url = getRequestUrl(Configs.USER_MGMT_BASE + "designationsbySections", requestObj);
  let response = await fetch(url);
  return await response.json();
};

export const manageDesignation = async (requestObj = {}) => {
  let url = Configs.USER_MGMT_BASE + "manage_designation/";
  let response = await fetch(url, getPostRequestOptions(requestObj));
  return await response.json();
};

export const getUsers = async (requestObj) => {
  let url = getRequestUrl(Configs.USER_MGMT_BASE + "users", requestObj);
  let response = await fetch(url);
  return await response.json();
};

export const mobileExist = async (phn, user_id) => {
  let url = getRequestUrl(
    Configs.USER_MGMT_BASE +
      "mobile_exist/?mobile=" +
      phn +
      "&user_id=" +
      user_id
  );
  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const emailExist = async (email, user_id) => {
  let url = getRequestUrl(
    Configs.USER_MGMT_BASE +
      "email_exist/?email=" +
      email +
      "&user_id=" +
      user_id
  );
  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const userList = async (requestObj) => {
  let url = getRequestUrl(Configs.TASK_URL + "users/", requestObj);
  let response = await fetch(url);
  return await response.json();
};

export const getUserDetails = async (userID) => {
  let url = getRequestUrl(Configs.USER_MGMT_BASE + "user_details", {
    user_id: userID,
  });
  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const getUserDetailsContext = async (userID) => {
  let url = getRequestUrl(Configs.USER_MGMT_BASE + "user_details_context", {
    user_id: userID,
  });
  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const getUserProfile = async (userId) => {
  let url = getRequestUrl(Configs.USER_MGMT_BASE + "user_profile_details", {
    user_id: userId,
  });
  let response = await fetch(url);
  return await response.json();
};

export const saveUserProfile = async (requestObj = {}) => {
  let url = Configs.USER_MGMT_BASE + "save_user_profile";
  let response = await fetch(url, getPostRequestOptions(requestObj));
  return await response.json();
};

export const manageUser = async (requestObj = {}) => {
  let url = Configs.USER_MGMT_BASE + "manage_user";
  let response = await fetch(url, getPostRequestOptions(requestObj));
  console.log(url);
  // return; // don't know why getting json parse error
  return await response.json();
};

export const manageUserPermission = async (requestObj = {}) => {
  let url = Configs.USER_MGMT_BASE + "manage_user_permission";
  let response = await fetch(url, getPostRequestOptions(requestObj));
  console.log(url);
  // return; // don't know why getting json parse error
  return await response.json();
};

export const manage_password = async (requestObj = {}) => {
  let url = Configs.USER_MGMT_BASE + "manage_password";
  let response = await fetch(url, getPostRequestOptions(requestObj));
  console.log(url);
  // return; // don't know why getting json parse error
  // console.log(await response.text());
  return await response.json();
};

export const manage_status = async (requestObj = {}) => {
  let url = Configs.USER_MGMT_BASE + "manage_status";
  let response = await fetch(url, getPostRequestOptions(requestObj));
  console.log(url);
  // return; // don't know why getting json parse error
  // console.log(await response.text());
  return await response.json();
};

export const getAvailableDepartments = async () => {
  let url = Configs.USER_MGMT_BASE + "get_available_departments";
  let response = await fetch(url);
  
  return await response.json();
};

export const getUserList = async () => {
  let url = Configs.USER_MGMT_BASE + "get_user_list";
  let response = await fetch(url);
  return await response.json();
};

export const manageLocationPermission = async (requestObj = {}) => {
  let url = Configs.USER_MGMT_BASE + "manage_location_permission/";
  let options = getPostRequestOptions(requestObj);
  let response = await fetch(url, options);
  return await response.json();
};

export const manageRangeChange = async (requestObj = {}) => {
  let url = Configs.USER_MGMT_BASE + "handle_range_change/";
  let options = getPostRequestOptions(requestObj);
  let response = await fetch(url, options);
  return await response.json();
};
