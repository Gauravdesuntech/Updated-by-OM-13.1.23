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

export const getTagGroups = async (cid, id) => {
  let url = Configs.TAG_AND_TAGGROUP_BASE + "tag_group/?cid=" + cid;
  if (typeof id !== "undefined") {
    url += "&id=" + id;
  }

  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const manageTagGroup = async (requestObj) => {
  let url = Configs.TAG_AND_TAGGROUP_BASE + "manage_tag_group/";

  if (requestObj.id === undefined) {
    delete requestObj.id;
  }

  let requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: getFormData(requestObj),
  };

  console.log(url);
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAllTags = async (cid, id) => {
  let url = Configs.TAG_AND_TAGGROUP_BASE + "tag/?cid=" + cid;
  if (typeof id !== "undefined") {
    url += "&id=" + id;
  }

  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const getAllTagsbyGroup = async (cid,assign) => {
  let url = Configs.TAG_AND_TAGGROUP_BASE + "tagbyGroup/?cid=" + cid +"&assign="+assign;
  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const manageTags = async (requestObj) => {
  let url = Configs.TAG_AND_TAGGROUP_BASE + "manage_tag/";

  if (requestObj.id === undefined) {
    delete requestObj.id;
  }

  let requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: getFormData(requestObj),
  };

  console.log(url);

  let response = await fetch(url, requestOptions);
  // console.log(await response.text());
  return await response.json();
};

export const assignTags = async (requestObj) => {
  let url = Configs.TAG_AND_TAGGROUP_BASE + "assign/";

  let requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: getFormData(requestObj),
  };

  console.log({ url, requestOptions });

  let response = await fetch(url, requestOptions);
  console.log(await response.text());
  return 
await response.json();
};

export const getAssignedTags = async (requestObj) => {
  let url = Configs.TAG_AND_TAGGROUP_BASE + "assigned_tag/";

  let requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: getFormData(requestObj),
  };

  console.log({ url, requestOptions });

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const removeAssignedTag = async (requestObj) => {
  let url = Configs.TAG_AND_TAGGROUP_BASE + "remove_assigned_tag/";

  let requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: getFormData(requestObj),
  };

  console.log({ url, requestOptions });

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getCategories = async (cid, class_id) => {
  let url = Configs.TAG_AND_TAGGROUP_BASE + "category/?cid=" + cid;
  if (typeof class_id !== "undefined") {
    url += "&class_id=" + class_id;
  }

  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const getSubCategories = async (cid, category_id) => {
  let url = Configs.TAG_AND_TAGGROUP_BASE + "sub_category/?cid=" + cid;
  if (typeof category_id !== "undefined") {
    url += "&category_id=" + category_id;
  }

  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const getCommonNames = async (cid, sub_category) => {
  let url = Configs.TAG_AND_TAGGROUP_BASE + "common_names/?cid=" + cid;
  if (typeof sub_category !== "undefined") {
    url += "&sub_category=" + sub_category;
  }

  console.log(url);
  let response = await fetch(url);
  return await response.json();
};
