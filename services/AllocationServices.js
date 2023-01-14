import Configs from "../config/Configs";
import Base64 from "../config/Base64";
import { getRequestUrl, getPostRequestOptions } from "../utils/Util";

const getRequestOptions = async (requestMethod = "GET", requestObj = {}) => {
  let requestHeaders = new Headers();

  let requestOptions = { method: requestMethod };

  if (requestMethod === "GET") {
    requestOptions.headers = requestHeaders;
  } else {
    requestHeaders.append("Content-Type", "multipart/form-data");

    let formData = new FormData();
    for (const [key, value] of Object.entries(requestObj)) {
      formData.append(key, value);
    }

    requestOptions.headers = requestHeaders;
    requestOptions.body = formData;
  }
  return requestOptions;
};

const getFormData = (obj) => {
  let formdata = new FormData();
  for (let key in obj) {
    formdata.append(key, obj[key]);
  }
  return formdata;
};

export const getAnimalGroups = async (cid, groupName) => {
  let url = Configs.BASE_URL + "groups/?cid=" + cid;
  if (typeof groupName !== "undefined") {
    url += "&group_name=" + groupName;
  }
  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const addGroup = async (requestObj) => {
  let url = Configs.BASE_URL + "manage_group/";

  let requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getSections = async (cid) => {
  let url = Configs.BASE_URL + "sections/?cid=" + cid;
  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const getAllocationSections = async (cid, date, user_id) => {
  let url =
    Configs.WORK_ALLOCATION +
    "sections/?cid=" +
    cid +
    "&date=" +
    date +
    "&user_id=" +
    user_id;
  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const getNewSectionInChargeList = async () => {
  let url = Configs.WORK_ALLOCATION + "newSectionInChargeList/";
  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const getUnassignedSectionList = async () => {
  let url = Configs.WORK_ALLOCATION + "get_unassigned_section/";
  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const addSectionInCharge = async (requestObj) => {
  let url = Configs.WORK_ALLOCATION + "addSectionInCharge/";
  console.log({ url, requestObj });

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const addSectionInChargeNew = async (requestObj) => {
  let url = Configs.WORK_ALLOCATION + "addSectionInChargeNew/";
  console.log({ url, requestObj });

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const editSectionInCharge = async (requestObj) => {
  let url = Configs.WORK_ALLOCATION + "editSectionInCharge/";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getFeedMenu = async () => {
  let url = Configs.WORK_ALLOCATION + "workSubCat";
  let response = await fetch(url);
  return await response.json();
};

export const getallFeedMenus = async (requestObj) => {
  let url = Configs.WORK_ALLOCATION + "workSubCat";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };
  let response = await fetch(url, requestOptions);
  // console.log(url,await response.text())
  return await response.json();
};

export const createFeedConfig = async (requestObj) => {
  let url = Configs.WORK_ALLOCATION + "createFeedConfig";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  // console.log(url,await response.text())
  return await response.json();
};

export const getFeedBasedOnConfig = async (requestObj) => {
  let url = Configs.WORK_ALLOCATION + "getFeedBasedOnConfig";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getFeedWorks = async (requestObj) => {
  let url = Configs.WORK_ALLOCATION + "getFeedWorks";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const updateFeedWork = async (requestObj) => {
  let url = Configs.WORK_ALLOCATION + "updateFeedWork ";
  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const syncUpdateFeedWork = async (requestObj) => {
  let url = Configs.WORK_ALLOCATION + "syncUpdateFeedWorkImage ";
  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const createCleaningConfig = async (requestObj) => {
  let url = Configs.WORK_ALLOCATION + "createCleaningConfig";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};
