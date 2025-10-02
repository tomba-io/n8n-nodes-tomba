import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

export async function tombaApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,

	body: any = {},
	qs: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('tombaApi');
	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}
	let options: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application.json',
			'X-Tomba-Key': credentials.apiKey,
			'X-Tomba-Secret': credentials.secretKey,
		},
		method,
		qs,
		body,
		url: uri || `https://api.tomba.io/v1${resource}`,
		json: true,
	};
	options = Object.assign({}, options, option);
	if (Object.keys(options.body as IDataObject).length === 0) {
		delete options.body;
	}
	try {
		return await this.helpers.httpRequest.call(this, options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function tombaApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	resource: string,

	body: any = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;
	query.page = 0;
	query.limit = 100;

	do {
		responseData = await tombaApiRequest.call(this, method, resource, body, query);
		returnData.push(responseData[propertyName] as IDataObject);
		query.page += query.limit;
	} while (
		responseData.meta?.total !== undefined &&
		responseData.meta.page <= responseData.meta.total
	);
	return returnData;
}
