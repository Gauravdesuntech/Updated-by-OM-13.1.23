import { getRequestUrl, getPostRequestOptions } from "../utils/Util";
import Configs from "../config/Configs";

export const getItemTypes = async (cid) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "item_types", { cid });
	console.log(url)
	let response = await fetch(url);
	return await response.json();
};

export const manageItemType = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "manage_item_type");
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const getStoreNames = async (cid) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "store_names", { cid });
	let response = await fetch(url);
	return await response.json();
};

export const manageStoreName = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "manage_store_name");
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const getProducts = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "products", requestObj);
	let response = await fetch(url);
	return await response.json();
};

export const getUnit = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "units", requestObj);
	console.log(url)
	let response = await fetch(url);
	return await response.json();
};

export const manageProduct = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "manage_product");
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const updateProductData = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "update_product_data");
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const updateItemData = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "update_item_data");
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const getProductDetails = async (productCode) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "product_details", {
		product_code: productCode,
	});
	let response = await fetch(url);
	return await response.json();
};

export const getProductAvailableStocks = async (productCode) => {
	let url = getRequestUrl(
		Configs.INVENTORY_MGMT_BASE + "product_available_stocks",
		{
			product_code: productCode,
		}
	);
	let response = await fetch(url);
	return await response.json();
};

export const getStockTransactions = async (productCode) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "stock_transactions", {
		product_code: productCode,
	});
	let response = await fetch(url);
	return await response.json();
};

export const addRequestPurchase = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "add_request_purchase");
	console.log(url, getPostRequestOptions(requestObj))
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const getRequestDetails = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "get_request_detail");
	console.log(url, getPostRequestOptions(requestObj))
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const addStock = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "add_stock");
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const getTotalAvailableStock = async (productCode, storeID) => {
	let params = { product_code: productCode };
	if (typeof storeID !== "undefined") {
		params.store_id = storeID;
	}
	let url = getRequestUrl(
		Configs.INVENTORY_MGMT_BASE + "product_total_stock",
		params
	);
	let response = await fetch(url);
	return await response.json();
};

export const reduceStock = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "deduct_stock");
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const getLowStockProducts = async (requestObj = {}) => {
	let url = getRequestUrl(
		Configs.INVENTORY_MGMT_BASE + "low_stock_items",
		requestObj
	);
	let response = await fetch(url);
	return await response.json();
};

export const generateExcel = async (requestObj = {}) => {
	let url = getRequestUrl(
		Configs.INVENTORY_MGMT_BASE + "export_low_stock",
		requestObj
	);
	let response = await fetch(url);
	return await response.json();
};

export const getRecipes = async (cid) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "recipes", { cid });
	let response = await fetch(url);
	return await response.json();
};

export const manageRecipe = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "manage_recipe");
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const getRecipeDetails = async (recipeCode) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "recipe_details", {
		recipe_code: recipeCode,
	});
	let response = await fetch(url);
	return await response.json();
};

export const getParties = async (cid) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "parties", { cid });
	let response = await fetch(url);
	return await response.json();
};

export const manageParty = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "manage_party");
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const getPartyDetails = async (partyID) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "party_details", {
		party_id: partyID,
	});
	let response = await fetch(url);
	return await response.json();
};

export const importStock = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "import_stock");
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const getConsumptions = async (cid, status) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "consumptions", {
		cid,
		status,
	});
	let response = await fetch(url);
	return await response.json();
};

export const addConsumption = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "add_consumption");
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const getConsumptionDetails = async (id, status) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "consumption_details", {
		consumption_id: id,
		status: status,
	});
	let response = await fetch(url);
	return await response.json();
};

export const manageConsumption = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "manage_consumption");
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const manageRequestItem = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "manage_request_item");
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const transferStock = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "transfer_stock");
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const getPurchaseOrders = async (cid, key) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "purchase_orders", {
		cid, key
	});
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const getItemRequests = async (cid, key) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "item_requests", {
		cid, key
	});
	console.log(url)
	let response = await fetch(url);
	return await response.json();
};

export const getItemRequestNumber = async (cid) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "generate_req_no", {
		cid,
	});
	let response = await fetch(url);
	return await response.json();
}

export const getPurchaseRequestNumber = async (cid) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "generate_po_no", {
		cid,
	});
	let response = await fetch(url);
	return await response.json();
}

export const generatePurchaseOrder = async (requestObj = {}) => {
	let url = getRequestUrl(
		Configs.INVENTORY_MGMT_BASE + "generate_purchase_order"
	);
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const generateItemRequest = async (requestObj = {}) => {
	let url = getRequestUrl(
		Configs.INVENTORY_MGMT_BASE + "generate_item_request"
	);
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const updatePurchaseOrder = async (requestObj = {}) => {
	let url = getRequestUrl(
		Configs.INVENTORY_MGMT_BASE + "update_purchase_request"
	);
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const getPurchaseOrderDetails = async (poNo) => {
	let url = getRequestUrl(
		Configs.INVENTORY_MGMT_BASE + "purchase_order_details",
		{ po_no: poNo }
	);
	let response = await fetch(url);
	return await response.json();
};

export const approvePurchaseRequest = async (requestObj = {}) => {
	let url = getRequestUrl(
		Configs.INVENTORY_MGMT_BASE + "approve_purchase_request"
	);
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};

export const rejectPurchaseRequest = async (requestObj = {}) => {
	let url = getRequestUrl(
		Configs.INVENTORY_MGMT_BASE + "reject_purchase_request"
	);
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};


export const getRequestItemDetails = async (reqNo) => {
	let url = getRequestUrl(
		Configs.INVENTORY_MGMT_BASE + "request_item_details",
		{ req_no: reqNo }
	);
	let response = await fetch(url);
	return await response.json();
};

export const convertToPurchase = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.INVENTORY_MGMT_BASE + "convert_to_purchase");
	let response = await fetch(url, getPostRequestOptions(requestObj));
	return await response.json();
};
