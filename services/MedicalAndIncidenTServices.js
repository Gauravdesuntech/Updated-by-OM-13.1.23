import { getRequestUrl, getPostRequestOptions } from "../utils/Util";
import Configs from "../config/Configs";

export const addIncidentTypes = async (reqObj = {}) => {
  let url = getRequestUrl(
    Configs.MEDICAL_INCIDENT_BASE + "manage_incident_types"
  );
  let response = await fetch(url, getPostRequestOptions(reqObj));
  // console.log(await response.text());
  return await response.json();
};

export const getMedicineImages = async (cid) => {
  let url = Configs.MEDICAL_INCIDENT_BASE + "downloadFiles?id=" + cid;
  let response = await fetch(url);
  return await response.json();
};

export const getIncidentTypes = async (cid) => {
  let url = Configs.MEDICAL_INCIDENT_BASE + "incident_types";

  let options = getRequestUrl(url, { cid });
  let response = await fetch(url, options);
  // console.log(await response.text());return;
  return await response.json();
};

export const getIncidentReports = async (
  cid,
  status,
  page,
  closed_by_id = ""
) => {
  let url = Configs.MEDICAL_INCIDENT_BASE + "incidents";

  let options = getPostRequestOptions({ cid, status, page, closed_by_id });
  let response = await fetch(url, options);
  console.log(url, options);
  // console.log(await response.text())
  return await response.json();
};

export const getObservation = async (cid, status, page, closed_by_id = "") => {
  let url = Configs.OBSERVATION_BASE;

  let options = getPostRequestOptions({ cid, status, page, closed_by_id });
  let response = await fetch(url, options);
  console.log({ url, options, reqObj: { cid, status, page, closed_by_id } });
  // console.log(await response.text());
  return await response.json();
};

export const manage_active_status = async (obj) => {
  let url = Configs.MEDICAL_INCIDENT_BASE + "manage_active_status";
  let options = getPostRequestOptions(obj);
  let response = await fetch(url, options);
  // console.log(url,options);
  // console.log(await response.text())
  return await response.json();
};
export const getAllIncidentReports = async (
  cid,
  enclosure_id,
  closed_by_id
) => {
  let url =
    Configs.BASE_URL_APP +
    "MedicalAndIncidentReport/getIncidentRecords?cid=" +
    cid +
    "&ref=enclosure&ref_id=" +
    enclosure_id +
    "&reported_by=" +
    closed_by_id;

  console.log(url);
  let response = await fetch(url);
  return await response.json();
};

export const addIncident = async (reqObj = {}, files) => {
  let url = getRequestUrl(Configs.MEDICAL_INCIDENT_BASE + "manage_incident");
  let requestOptions = getPostRequestOptions(reqObj);

  if (files.length > 0) {
    files.forEach((item, i) => {
      requestOptions.body.append("media_files[]", {
        uri: item.uri,
        type: item.type,
        name: item.name,
      });
    });
  }

  console.log({ url, requestOptions, reqObj });
  let response = await fetch(url, requestOptions);
  // console.log(await response.text())
  return await response.json();
};

export const addObservation = async (reqObj = {}, files) => {
  let url = getRequestUrl(Configs.OBSERVATION_BASE + "manage_observation");
  let requestOptions = getPostRequestOptions(reqObj);

  if (files.length > 0) {
    files.forEach((item, i) => {
      requestOptions.body.append("media_files[]", {
        uri: item.uri,
        type: item.type,
        name: item.name,
      });
    });
  }

  console.log({ url, requestOptions, reqObj });
  let response = await fetch(url, requestOptions);
  // console.log(await response.text());
  return await response.json();
  // return await response.text();
};

export const updateIncidentStatus = async (reqObj = {}) => {
  let url = getRequestUrl(
    Configs.MEDICAL_INCIDENT_BASE + "update_incident_status"
  );
  let response = await fetch(url, getPostRequestOptions(reqObj));
  return await response.json();
};

export const addDiagnosisName = async (reqObj = {}) => {
  let url = getRequestUrl(Configs.MEDICAL_INCIDENT_BASE + "manage_diagnosis");
  let response = await fetch(url, getPostRequestOptions(reqObj));
  // console.log(await response.text());
  return await response.json();
};

export const getDiagnosis = async (cid) => {
  let url = Configs.MEDICAL_INCIDENT_BASE + "diagnosis";

  let options = getRequestUrl(url, { cid });
  let response = await fetch(url, options);
  // console.log(await response.text())
  return await response.json();
};

export const getMedicine = async (cid) => {
  let url = Configs.MEDICAL_INCIDENT_BASE + "medicines";

  let options = getRequestUrl(url, { cid });
  let response = await fetch(url, options);
  // console.log(await response.text())
  return await response.json();
};

export const addMedicalRecord = async (reqObj = {}, files) => {
  let url = getRequestUrl(
    Configs.MEDICAL_INCIDENT_BASE + "manage_medical_record"
  );
  let requestOptions = getPostRequestOptions(reqObj);

  if (files.length > 0) {
    files.forEach((item, i) => {
      requestOptions.body.append("media_files[]", {
        uri: item.uri,
        type: item.type,
        name: item.name,
      });
    });
  }
  console.log(url, requestOptions);
  let response = await fetch(url, requestOptions);
  return await response.json();
};

export const getMedicalRecords = async (cid, status, page) => {
  let url = Configs.MEDICAL_INCIDENT_BASE + "medical_records";

  let options = getPostRequestOptions({ cid, status, page });
  console.log(url);
  let response = await fetch(url, options);
  // console.log(await response.text());
  return await response.json();
};

export const filterMedicalRecords = async (cid, status) => {
  let url = Configs.MEDICAL_INCIDENT_BASE + "filter_medical_records";

  let options = getPostRequestOptions({ cid, status });
  // console.log(url, options)
  let response = await fetch(url, options);
  // console.log(await response.text());
  return await response.json();
};

export const getAffectedParts = async (cid) => {
  let url = Configs.MEDICAL_INCIDENT_BASE + "affected_parts";

  let options = getRequestUrl(url, { cid });
  let response = await fetch(url, options);

  return await response.json();
};

export const addAffectedParts = async (reqObj) => {
  let url = getRequestUrl(Configs.MEDICAL_INCIDENT_BASE + "add_affected_part");
  let response = await fetch(url, getPostRequestOptions(reqObj));
  // console.log(await response.json())
  return await response.json();
};

export const updateAffectedParts = async (reqObj) => {
  let url = getRequestUrl(
    Configs.MEDICAL_INCIDENT_BASE + "update_affected_part"
  );
  let response = await fetch(url, getPostRequestOptions(reqObj));

  return await response.json();
};

export const deleteAffectedParts = async (reqObj) => {
  let url = getRequestUrl(
    Configs.MEDICAL_INCIDENT_BASE + "delete_affected_part"
  );
  let response = await fetch(url, getPostRequestOptions(reqObj));

  return await response.json();
};

export const getRouteLists = async (cid) => {
  let url = Configs.MEDICAL_INCIDENT_BASE + "medical_record_routes";

  let options = getRequestUrl(url, { cid });
  let response = await fetch(url, options);

  return await response.json();
};

export const addRoute = async (reqObj) => {
  let url = getRequestUrl(
    Configs.MEDICAL_INCIDENT_BASE + "add_medical_record_routes"
  );
  let response = await fetch(url, getPostRequestOptions(reqObj));
  // console.log(await response.json())
  return await response.json();
};

export const updateRoute = async (reqObj) => {
  let url = getRequestUrl(
    Configs.MEDICAL_INCIDENT_BASE + "update_medical_record_routes"
  );
  let response = await fetch(url, getPostRequestOptions(reqObj));

  return await response.json();
};

export const deleteRoute = async (reqObj) => {
  let url = getRequestUrl(
    Configs.MEDICAL_INCIDENT_BASE + "delete_medical_record_routes"
  );
  let response = await fetch(url, getPostRequestOptions(reqObj));

  return await response.json();
};

export const searchIncidentByType = async (type) => {
  let url =
    Configs.MEDICAL_INCIDENT_BASE +
    "search_incident_by_type?incident_type=" +
    type;

  let response = await fetch(url);

  return await response.json();
};
