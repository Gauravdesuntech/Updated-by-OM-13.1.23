import Configs from "../config/Configs";

const getFormData = (obj) => {
	let formdata = new FormData();
	for (let key in obj) {
		formdata.append(key, obj[key]);
	}
	return formdata;
};


export const get_feed_factor = async (id) => {
    let url = Configs.KITCHEN_BASEURL + "get_feed_factor";
    if (typeof id !== "undefined") {
      url += "?id=" + id;
    }
    console.log(url);
    let response = await fetch(url);
    return await response.json();
  };

  export const manageFeedFactor = async (requestObj) => {
    let url = Configs.KITCHEN_BASEURL + "manage_feed_factor";
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

export const getfeedmealslot = async (id) => {
    let url = Configs.KITCHEN_BASEURL + "get_feed_meal_slot";
    if (typeof id !== "undefined") {
      url += "?id=" + id;
    }
    console.log(url);
    let response = await fetch(url);
    return await response.json();
  };

  export const managefeedmealslot = async (requestObj) => {
    let url = Configs.KITCHEN_BASEURL + "manage_feed_meal_slot";
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

export const getfeedplaters = async (id) => {
    let url = Configs.KITCHEN_BASEURL + "get_feed_platers";
    if (typeof id !== "undefined") {
      url += "?id=" + id;
    }
    console.log(url);
    let response = await fetch(url);
    return await response.json();
  };

  export const managefeedplaters = async (requestObj) => {
    let url = Configs.KITCHEN_BASEURL + "manage_feed_platers";
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
export const getfeedtype = async (id) => {
    let url = Configs.KITCHEN_BASEURL + "get_feed_type";
    if (typeof id !== "undefined") {
      url += "?id=" + id;
    }
    console.log(url);
    let response = await fetch(url);
    return await response.json();
  };

  export const managefeedtype = async (requestObj) => {
    let url = Configs.KITCHEN_BASEURL + "manage_feed_type";
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
export const getfoods = async (id) => {
    let url = Configs.KITCHEN_BASEURL + "get_foods";
    if (typeof id !== "undefined") {
      url += "?id=" + id;
    }
    console.log(url);
    let response = await fetch(url);
    return await response.json();
  };

export const getUnitsAndStores = async () => {
    let url = Configs.KITCHEN_BASEURL + "get_unitsAndstores";
    console.log(url);
    let response = await fetch(url);
    return await response.json();
  };

  export const managefoods = async (requestObj) => {
    let url = Configs.KITCHEN_BASEURL + "manage_foods";
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
