import Configs from "../config/Configs";
import Base64 from "../config/Base64";
import { getRequestUrl, getPostRequestOptions } from "../utils/Util";

const getFormData = (obj) => {
	let formdata = new FormData();
	for (let key in obj) {
		formdata.append(key, obj[key]);
	}
	return formdata;
};

export const journalRecords = async (requestObj) => {
	let url = Configs.BASE_URL_APP + "journal/get_journal_record";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
    console.log(url);
	return await response.json();
};

export const get_journal_record_for_pdf = async (requestObj) => {
	let url = Configs.BASE_URL_APP + "journal/get_journal_record_for_pdf";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
    console.log(url);
	return await response.json();
};

export const downloadJournal = async (requestObj) => {
	let url = Configs.BASE_URL_APP + "journal/generateExcel";
	console.log(url);
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
    // console.log(response.text());
	return await response.json();
};


export const filterJournalRecord = async (requestObj) => {
	let url = Configs.BASE_URL_APP + "journal/filter_journal";
	console.log(url);
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
    // console.log(response.text());
	return await response.json();
};
