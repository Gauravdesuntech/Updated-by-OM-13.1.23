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
  let response = await fetch(url);
  return await response.json();
};

export const getRandomCommonName = async (cid) => {
  let url = Configs.BASE_URL + "random_common_name/?cid=" + cid;
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

export const getApprovalTasks = async (requestObj) => {
  let url = Configs.TASK_URL + "task/get_task_waiting_approval";

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

export const getAllCategory = async (cid, classID) => {
  let url = Configs.BASE_URL + "category/?cid=" + cid;
  if (typeof classID !== "undefined") {
    url += "&class_id=" + classID;
  }
  let response = await fetch(url);
  return await response.json();
};

export const fetchCategoryCoverPhoto = async (cid, classID) => {
  let url = Configs.BASE_URL + "fetch_category_cover_images/?cid=" + cid;
  if (typeof classID !== "undefined") {
    url += "&class_id=" + classID;
  }
  let response = await fetch(url);
  return await response.json();
};

export const addCategory = async (requestObj) => {
  let url = Configs.BASE_URL + "manage_category/";

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

export const searchCategory = async (requestObj = {}) => {
  let url = getRequestUrl(Configs.BASE_URL + "search_cat", requestObj);
  let response = await fetch(url);
  return await response.json();
};

export const searchTasks = async (user_id, value) => {
  let url = getRequestUrl(
    Configs.TASK_URL + "task/searchTask?userid=" + user_id + "&query=" + value
  );
  let response = await fetch(url);
  return await response.json();
};

export const getAllSubCategory = async (cid, categoryID) => {
  let url = Configs.BASE_URL + "sub_category/?cid=" + cid;
  if (typeof categoryID !== "undefined") {
    url += "&category_id=" + categoryID;
  }
  let response = await fetch(url);
  return await response.json();
};

export const getSubCatCoverImage = async (cid, categoryID) => {
  let url = Configs.BASE_URL + "fetch_subcategory_cover_images/?cid=" + cid;
  if (typeof categoryID !== "undefined") {
    url += "&category_id=" + categoryID;
  }
  let response = await fetch(url);
  return await response.json();
};

export const searchSubCategory = async (requestObj = {}) => {
  let url = getRequestUrl(Configs.BASE_URL + "search_sub_category", requestObj);
  let response = await fetch(url);
  return await response.json();
};

export const searchSection = async (requestObj = {}) => {
  let url = getRequestUrl(Configs.BASE_URL + "search_section", requestObj);
  let response = await fetch(url);
  return await response.json();
};

export const searchEnclosure = async (requestObj = {}) => {
  let url = getRequestUrl(
    Configs.BASE_URL +
      "search_enclosure/?search_value=" +
      requestObj.search_value +
      "&cid=" +
      requestObj.cid
  );
  let response = await fetch(url);
  return await response.json();
};

export const addSubCategory = async (requestObj) => {
  let url = Configs.BASE_URL + "manage_sub_category/";

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

export const getAllSpecies = async (cid, categoryID) => {
  let url = Configs.BASE_URL + "species/?cid=" + cid;
  if (typeof categoryID !== "undefined") {
    url += "&category_id=" + categoryID;
  }

  let response = await fetch(url);
  return await response.json();
};

export const getAllSpeciesByClass = async (cid, classID) => {
  let url = Configs.BASE_URL + "species/?cid=" + cid;
  if (typeof classID !== "undefined") {
    url += "&class_id=" + classID;
  }
  let response = await fetch(url);
  return await response.json();
};

export const addSpecies = async (requestObj) => {
  let url = Configs.BASE_URL + "add_species/";

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

export const getAllSubSpecies = async (cid, speciesID) => {
  let url = Configs.BASE_URL + "subspecies/?cid=" + cid;
  if (typeof speciesID !== "undefined") {
    url += "&species_id=" + speciesID;
  }
  let response = await fetch(url);
  return await response.json();
};

export const addSubSpecies = async (requestObj) => {
  let url = Configs.BASE_URL + "add_subspecies/";

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

export const getCommonNames = async (paramObj = {}) => {
  let url = Configs.BASE_URL + "common_names/";
  if (Object.keys(paramObj).length > 0) {
    url += "?params=" + JSON.stringify(paramObj);
  }
  let response = await fetch(url);
  const result = await response.json();
  return result;
};

export const getSectionCommonNames = async (paramObj = {}) => {
  let url = Configs.BASE_URL + "section_common_names/";

  if (Object.keys(paramObj).length > 0) {
    url += "?section_id=" + paramObj.section_id + "&cid=" + paramObj.cid;
  }
  let response = await fetch(url);
  return await response.json();
};

export const getReportView = async (paramObj = {}) => {
  let url = Configs.BASE_URL + "section_report_view/";

  if (Object.keys(paramObj).length > 0) {
    url += "?section_id=" + paramObj.section_id + "&cid=" + paramObj.cid;
  }
  let response = await fetch(url);
  return await response.json();
};

export const manageCommonName = async (requestObj) => {
  let url = Configs.BASE_URL + "manage_common_name/";

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

export const searchCommonName = async (requestObj = {}) => {
  let url = Configs.BASE_URL + "search_common_name";

  let params = [];
  for (const [key, value] of Object.entries(requestObj)) {
    params.push(key + "=" + value);
  }

  if (params.length > 0) {
    url += "/?" + params.join("&");
  }


  let response = await fetch(url);
  return await response.json();
};

export const getCommonNameDetails = async (commonName) => {
  let url =
    Configs.BASE_URL +
    "common_name_details/?common_name=" +
    Base64.encode(commonName);
  let response = await fetch(url);
  return await response.json();
};

export const exportCommonName = async (commonName) => {
  let url =
    Configs.BASE_URL +
    "export_common_name_details/?common_name=" +
    Base64.encode(commonName);
  let response = await fetch(url);
  return await response.json();
};

export const exportSection = async (sectionID) => {
  let url = Configs.BASE_URL + "export_section/?section_id=" + sectionID;
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalsCount = async (commonName) => {
  let url =
    Configs.BASE_URL +
    "animals_count/?common_name=" +
    Base64.encode(commonName);
  let response = await fetch(url);
  return await response.json();
};

export const getCommonNameSections = async (commonName, animalType) => {
  let url =
    Configs.BASE_URL +
    "common_name_sections/?common_name=" +
    Base64.encode(commonName);

  if (typeof animalType !== "undefined") {
    url += "&type=" + animalType;
  }

  let response = await fetch(url);
  return await response.json();
};

export const getCommonNameEnclosures = async (commonName, sectionID) => {
  let url =
    Configs.BASE_URL +
    "common_names_enclosures/?common_name=" +
    Base64.encode(commonName);

  if (typeof sectionID !== "undefined") {
    url += "&section_id=" + sectionID;
  }

  let response = await fetch(url);
  return await response.json();
};

export const getIdentificationTypeCount = async (
  commonName,
  enclosureID,
  gender
) => {
  let url =
    Configs.BASE_URL +
    "enclosure_identification_count/?common_name=" +
    Base64.encode(commonName);

  if (typeof enclosureID !== "undefined") {
    url += "&enclosure_id=" + enclosureID;
  }

  if (typeof gender !== "undefined") {
    url += "&gender=" + gender;
  }
  let response = await fetch(url);
  return await response.json();
};

export const getAnimals = async (params) => {
  let arr = [];
  for (let key in params) {
    arr.push(key + "=" + params[key]);
  }

  let url = Configs.BASE_URL + "animals/?" + arr.join("&");
  let response = await fetch(url);
  return await response.json();
};

export const getSectionAnimals = async (params) => {
  let arr = [];
  for (let key in params) {
    arr.push(key + "=" + params[key]);
  }

  let url = Configs.BASE_URL + "section_animals/?" + arr.join("&");
  let response = await fetch(url);
  return await response.json();
};

export const generateSectionCommonNameReport = async (requestObj) => {
  let url =
    Configs.BASE_URL + "generate_common_name_report_section_wise_excel/";
  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getReportViewSection = async (paramObj = {}) => {
  let url = Configs.BASE_URL + "report_section_view/";

  if (Object.keys(paramObj).length > 0) {
    url += "?section_id=" + paramObj.section_id + "&cid=" + paramObj.cid;
  }
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalsEnclosureBased = async (params) => {
  let arr = [];
  for (let key in params) {
    arr.push(key + "=" + params[key]);
  }

  let url = Configs.BASE_URL + "animals_enclosure_based/?" + arr.join("&");
  let response = await fetch(url);
  return await response.json();
};

export const getAllAnimals = async (cid, enclosure_id) => {
  let url = Configs.BASE_URL + "all_animals/?cid=" + cid;
  if (typeof enclosure_id !== "undefined") {
    url += "&enclosure_id=" + enclosure_id;
  }
  let response = await fetch(url);
  return await response.json();
};

export const getAllEnclosures = async (cid, section_id) => {
  let url = Configs.BASE_URL + "all_enclosures/?cid=" + cid;
  if (typeof section_id !== "undefined") {
    url += "&section_id=" + section_id;
  }
  let response = await fetch(url);
  
  return await response.json();
};

export const getIndividualAnimals = async (englishName) => {
  let url =
    Configs.BASE_URL +
    "individual_animals/?english_name=" +
    Base64.encode(englishName);
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalInfo = async (id) => {
  let url = Configs.BASE_URL + "animal_info/" + id;
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalID = async () => {
  let url = Configs.BASE_URL + "animal_code/";
  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const createAnimalProfile = async (requestObj) => {
  let url = Configs.BASE_URL + "create_animal_profile/";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAnimalProfileData = async (animalID) => {
  let url = Configs.BASE_URL + "animal_profile/" + animalID;
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalPedigree = async (id) => {
  let url = Configs.BASE_URL + "animal_pedigree/" + id;
  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const saveAnimalPedigreeDetails = async (requestObj) => {
  let url = Configs.BASE_URL + "save_animal_pedigree/";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const manage_animal_active_status = async (obj) => {
  let url = Configs.BASE_URL + "manage_active_status";
  let options = getPostRequestOptions(obj);
  let response = await fetch(url, options);
  return await response.json();
};

export const getAnimalVaccineDetails = async (animalID) => {
  let url = Configs.BASE_URL + "animal_vaccines/" + animalID;
  let response = await fetch(url);
  return await response.json();
};

export const getVaccineTypes = async () => {
  let url = Configs.BASE_URL + "vaccine_types/";
  let response = await fetch(url);
  return await response.json();
};

export const getVaccines = async (id) => {
  let url = Configs.BASE_URL + "vaccines/" + id;
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalVaccineRecord = async (id) => {
  let url = Configs.BASE_URL + "animal_vaccine_record/" + id;
  let response = await fetch(url);
  return await response.json();
};

export const saveAnimalVaccineRecord = async (requestObj) => {
  let url = Configs.BASE_URL + "manage_animal_vaccine/";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAnimalVaccinationDetails = async (animalCode) => {
  let url = Configs.BASE_URL + "animal_vaccinations/" + animalCode;
  let response = await fetch(url);
  return await response.json();
};

export const saveAnimalVaccinationsRecord = async (requestObj) => {
  let url = Configs.BASE_URL + "mannage_animal_vaccinations_record/";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAnimalVaccinationRecord = async (id) => {
  let url = Configs.BASE_URL + "animal_vaccination_record/" + id;
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalDiagnosis = async (ref, ref_id) => {
  let url = Configs.BASE_URL + "animal_diagnosis/" + ref + "/" + ref_id;
  let response = await fetch(url);
  return await response.json();
};

export const getDiagnosis = async () => {
  let url = Configs.BASE_URL + "diagnosis/";
  let response = await fetch(url);
  return await response.json();
};

export const saveAnimalDiagnosisRecord = async (requestObj) => {
  let url = Configs.BASE_URL + "manage_animal_diagnosis_record/";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAnimalDiagnosisRecord = async (id) => {
  let url = Configs.BASE_URL + "animal_diagnosis_record/" + id;
  let response = await fetch(url);
  return await response.json();
};

export const getEnclosureTypes = async () => {
  let url = Configs.BASE_URL + "enclosure_types/";
  let response = await fetch(url);
  return await response.json();
};

export const getEnclosureChangeHistory = async (user_id, page) => {
  let url =
    Configs.BASE_URL +
    "enclosure_history/?user_id=" +
    user_id +
    "&page=" +
    page;
  let response = await fetch(url);
  return await response.json();
};

export const getConfirmedEnclosureChangeHistory = async (user_id) => {
  let url =
    Configs.BASE_URL +
    "enclosure_history/?user_id=" +
    user_id +
    "&status=changed";
 
  let response = await fetch(url);
  return await response.json();
};

export const getPendingEnclosure = async (user_id) => {
  let url =
    Configs.BASE_URL + "get_approval_enclosure_for_user?user_id=" + user_id;
 
  let response = await fetch(url);
  return await response.json();
};

export const getEnclosureHistory = async (user_id, enclosure_id) => {
  let url =
    Configs.BASE_URL +
    "enclosure_history/?user_id=" +
    user_id +
    "&status=changed&enclosure_id=" +
    enclosure_id;
 
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalEnclosureID = async () => {
  let url = Configs.BASE_URL + "enclosure_id/";
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalEnclosures = async (animalCode) => {
  let url = Configs.BASE_URL + "animal_enclosures/" + animalCode;
  let response = await fetch(url);
  return await response.json();
};

export const saveAnimalEnclosureRecord = async (requestObj) => {
  let url = Configs.BASE_URL + "manage_animal_enclosure_record/";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAnimalEnclosureRecord = async (id) => {
  let url = Configs.BASE_URL + "animal_enclosure_record/" + id;
  let response = await fetch(url);
  return await response.json();
};

export const getIncidentTypes = async () => {
  let url = Configs.BASE_URL + "incident_types/";
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalIncidentReports = async (ref, ref_id) => {
  let url = Configs.BASE_URL + "animal_incident_reports/" + ref + "/" + ref_id;
  let response = await fetch(url);
 
  return await response.json();
};

export const saveAnimalIncidentRecord = async (requestObj) => {
  let url = Configs.BASE_URL + "manage_animal_incident_record/";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAnimalIncidentDetails = async (id) => {
  let url = Configs.BASE_URL + "animal_incident_record/" + id;
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalMeasurements = async (animalCode) => {
  let url = Configs.BASE_URL + "animal_measurements/" + animalCode;
  let response = await fetch(url);
  return await response.json();
};

export const addAnimalMeasurementRecord = async (requestObj) => {
  let url = Configs.BASE_URL + "add_animal_measurement_record/";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAnimalFeedingAssignments = async (animalCode) => {
  let url = Configs.BASE_URL + "animal_feeding_assignments/" + animalCode;
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalFoods = async () => {
  let url = Configs.BASE_URL + "foods/";
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalMealSlots = async () => {
  let url = Configs.BASE_URL + "meal_slots/";
  let response = await fetch(url);
  return await response.json();
};

export const getUnits = async () => {
  let url = Configs.BASE_URL + "units/";
  let response = await fetch(url);
  return await response.json();
};

export const saveAnimalFeedingAssignment = async (requestObj) => {
  let url = Configs.BASE_URL + "manage_animal_feeding_assignment/";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAnimalAssignFoodDetails = async (id) => {
  let url = Configs.BASE_URL + "animal_assign_food_details/" + id;
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalFeedings = async (animalCode) => {
  let url = Configs.BASE_URL + "animal_feedings/" + animalCode;
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalFoodsForFeeding = async (animalCode) => {
  let url = Configs.BASE_URL + "foods_for_feeding/" + animalCode;
 
  let response = await fetch(url);
  return await response.json();
};

export const saveAnimalFeedingRecord = async (requestObj) => {
  let url = Configs.BASE_URL + "manage_animal_feeding_record/";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAnimalFeedingDetails = async (id) => {
  let url = Configs.BASE_URL + "animal_feeding_details/" + id;
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalFarms = async (cid) => {
  let url = Configs.BASE_URL + "farms/?cid=" + cid;
  let response = await fetch(url);
  return await response.json();
};

export const addFarm = async (requestObj) => {
  let url = Configs.BASE_URL + "manage_farm/";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAnimalOrigins = async () => {
  let url = Configs.BASE_URL + "origins/";
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalOwners = async () => {
  let url = Configs.BASE_URL + "owners/";
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalFullNames = async () => {
  let url = Configs.BASE_URL + "animal_full_names/";
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalEnglishNames = async () => {
  let url = Configs.BASE_URL + "animal_english_names/";
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalDatabases = async (cid) => {
  let url = Configs.BASE_URL + "animal_databases/?cid=" + cid;
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalEnclosureIds = async (requestObj = {}) => {
  let url = getRequestUrl(
    Configs.BASE_URL + "animal_enclosure_ids",
    requestObj
  );
 
  let response = await fetch(url);
  return await response.json();
};

export const getAnimalEnclosureIdDetails = async (id) => {
  let url = Configs.BASE_URL + "animal_enclosure_id_details/?id=" + id;
  let response = await fetch(url);
  return await response.json();
};

export const manageAnimalEnclosureID = async (requestObj) => {
  let galleryData = [];
  let url = Configs.BASE_URL + "manage_animal_enclosure_id/";

  if (requestObj.hasOwnProperty("gallery")) {
    galleryData = requestObj["gallery"];
    delete requestObj["gallery"];
  }

  let formData = getFormData(requestObj);
  (galleryData || []).forEach((value, index) => {
    formData.append("gallery[]", value);
  });

  let requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  };
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const deleteEnclosureidGalleryItem = async (id) => {
  let url = getRequestUrl(Configs.BASE_URL + "delete_enclosureid_gallery_item");
  let response = await fetch(url, getPostRequestOptions({ id }));
  return await response.json();
};

export const downloadUserIDQrcode = async (id) => {
  let url = getRequestUrl(Configs.BASE_URL + "download_userid_qrcode");
  let response = await fetch(url, getPostRequestOptions({ user_id: id }));
  return await response.json();
};

export const getAnimalEnclosureTypes = async (cid) => {
  let url = Configs.BASE_URL + "animal_enclosure_types/?cid=" + cid;
 
  let response = await fetch(url);
  return await response.json();
};

export const manageAnimalEnclosureType = async (requestObj) => {
  let url = Configs.BASE_URL + "manage_animal_eclosure_type/";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAnimalSections = async (cid) => {
  let url = Configs.BASE_URL + "sections/?cid=" + cid;
 
  let response = await fetch(url);
  return await response.json();
};

export const manageSection = async (requestObj) => {
  let url = Configs.BASE_URL + "manage_section/";

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

export const manageDeviceLog = async (requestObj) => {
  let url = Configs.BASE_URL_APP + "journal/log";
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

export const getDistanceand = async (origin, destination) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  let response = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${Configs.GOOGLE_PLACE_API_KEY}&mode=driving`,
    requestOptions
  );

  return await response.json();
};

export const getSectionRelations = async (cid) => {
  let url = Configs.BASE_URL + "section_relations/?cid=" + cid;
  let response = await fetch(url);
  return await response.json();
};

export const getSectionRelationDetails = async (id) => {
  let url = Configs.BASE_URL + "section_relation_details/?id=" + id;
  let response = await fetch(url);
  return await response.json();
};

export const manageSectionRelation = async (requestObj) => {
  let url = Configs.BASE_URL + "manage_section_relation/";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const generateExcel = async (requestObj) => {
  let url = Configs.BASE_URL + "generate_excel/";

  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAnimalEnclosureHistory = async (animalID) => {
  let url =
    Configs.BASE_URL + "animal_enclosure_history/?animal_id=" + animalID;
  let response = await fetch(url);
  return await response.json();
};

export const animalChangeEnclosure = async (requestObj) => {
  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let url = Configs.BASE_URL + "animal_change_enclosure/";
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const animalChangeEnclosureUpdate = async (requestObj) => {
  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let url = Configs.BASE_URL + "animal_change_enclosure_update/";
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getApprovalUser = async (cid, user_id) => {
  let url =
    Configs.BASE_URL + "get_approval_user/?cid=" + cid + "&user_id=" + user_id;
  let response = await fetch(url);
  return await response.json();
};

export const exportAnimals = async (requestObj) => {
  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let url = Configs.BASE_URL + "export_animals/";
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getGalleryData = async (commonNameID) => {
  let url = Configs.BASE_URL + "gallery/?common_name_id=" + commonNameID;
  let response = await fetch(url);
  return await response.json();
};

export const getCommonNameInfo = async (commonNameID) => {
  let url =
    Configs.BASE_URL + "common_name_info/?common_name_id=" + commonNameID;
  let response = await fetch(url);
  return await response.json();
};

export const changeCommonNameCoverImage = async (requestObj) => {
  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };

  let url = Configs.BASE_URL + "change_common_name_cover_image/";
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const delteCommonNameGalleryItem = async (id) => {
  let requestOptions = {
    method: "POST",
    body: getFormData({ id }),
  };

  let url = Configs.BASE_URL + "remove_common_name_gallery_item/";
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const searchAnimal = async (requestObj = {}) => {
  let params = [];
  let url = Configs.BASE_URL + "search_animal";

  for (const [key, value] of Object.entries(requestObj)) {
    params.push(key + "=" + value);
  }

  if (params.length > 0) {
    url += "/?" + params.join("&");
  }
  let response = await fetch(url);
  return await response.json();
};

export const getParentAnimals = async (commonName, enclosureID) => {
  let url =
    Configs.BASE_URL +
    "parent_animals/?common_name=" +
    Base64.encode(commonName) +
    "&enclosure_id=" +
    enclosureID;
  let response = await fetch(url);
  return await response.json();
};

export const uploadAnimalImages = async (requestObj) => {
  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };
  let url = Configs.BASE_URL + "upload_animal_images/";
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getAnimalPrintLabel = async (type, id) => {
  let url = Configs.BASE_URL + `animal_print_label/?type=${type}&id=${id}`;

  let response = await fetch(url);

  return await response.json();
};

export const getAnimalPrintLabelForMutipleIds = async (requestObj) => {
  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };
  let url = Configs.BASE_URL + "animal_print_label/";

  let response = await fetch(url, requestOptions);

  return await response.json();
};

export const addAnnouncement = async (requestObj) => {
  let requestOptions = {
    method: "POST",
    body: getFormData(requestObj),
  };
  let url = Configs.ANNOUNCEMENT_BASE + "manage_announcement/";
 
  let response = await fetch(url, requestOptions);

  await response.json();
};

export const getAnnouncement = async () => {
  let url = Configs.ANNOUNCEMENT_BASE + "get_announcement";
  let response = await fetch(url);
 
  return await response.json();
};
