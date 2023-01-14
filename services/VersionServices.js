import Configs from "../config/Configs";

const getFormData = (obj) => {
  let formdata = new FormData();
  for (let key in obj) {
    formdata.append(key, obj[key]);
  }
  return formdata;
};

export const getVersion = async () => {
  let url = Configs.VERSION_CONTROL + "get_version";
  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

// export const addGroup = async (requestObj) => {
//   let url = Configs.BASE_URL + "manage_group/";

//   let requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//     body: getFormData(requestObj),
//   };

//   let response = await fetch(url, requestOptions);
//   return await response.json();
// };

