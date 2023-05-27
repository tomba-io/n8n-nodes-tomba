import { IExecuteFunctions } from 'n8n-core';
import { IDataObject, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { tombaApiRequest } from './GenericFunctions';

export class Tomba implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tomba',
		name: 'tomba',
		icon: 'file:tomba.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Consume Tomba API',
		defaults: {
			name: 'Tomba',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'tombaApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Autocomplete',
						value: 'Autocomplete',
						description: 'Find company names and retrieve logo and domain information',
						action: 'Find company names and retrieve logo and domain information',
					},
					{
						name: 'Domain Search',
						value: 'domainSearch',
						description:
							'Get every email address found on the internet using a given domain name, with sources',
						action: 'Get every email address found on the internet using a given domain name with sources',
					},
					{
						name: 'Domain Status',
						value: 'DomainStatus',
						description: 'Find domain status if is webmail or disposable',
						action: 'Find domain status if is webmail or disposable',
					},
					{
						name: 'Email Count',
						value: 'EmailCount',
						description: 'Find total email addresses we have for one domain',
						action: 'Find total email addresses we have for one domain',
					},
					{
						name: 'Email Finder',
						value: 'emailFinder',
						description:
							'Generate or retrieve the most likely email address from a domain name, a first name and a last name',
						action: 'Generate or retrieve the most likely email address from a domain name a first name and a last name',
					},
					{
						name: 'Email Sources',
						value: 'emailSources',
						description: 'Find email address source somewhere on the web',
						action: 'Find email address source somewhere on the web',
					},
					{
						name: 'Email Verifier',
						value: 'emailVerifier',
						description: 'Verify the deliverability of an email address',
						action: 'Verify the deliverability of an email address',
					},
					{
						name: 'Phone Finder',
						value: 'PhoneFinder',
						description: 'Find email address of an phone',
						action: 'Find email address of an phone',
					},
				],
				default: 'domainSearch',
				description: 'Operation to consume',
			},
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['domainSearch'],
					},
				},
				default: '',
				required: true,
				description:
					'Domain name from which you want to find the email addresses. For example, "stripe.com".',
			},
			{
				displayName: 'Only Emails',
				name: 'onlyEmails',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['domainSearch'],
					},
				},
				default: true,
				description: 'Whether only the the found emails',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['domainSearch'],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						operation: ['domainSearch'],
					},
				},
				options: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						default: 'personal',
						options: [
							{
								name: 'Personal',
								value: 'personal',
							},
							{
								name: 'Generic',
								value: 'generic',
							},
						],
					},
					{
						displayName: 'Department',
						name: 'department',
						type: 'multiOptions',
						default: [],
						options: [
							{
								name: 'Communication',
								value: 'communication',
							},
							{
								name: 'Executive',
								value: 'executive',
							},
							{
								name: 'Finance',
								value: 'finance',
							},
							{
								name: 'HR',
								value: 'hr',
							},
							{
								name: 'IT',
								value: 'it',
							},
							{
								name: 'Legal',
								value: 'legal',
							},
							{
								name: 'Management',
								value: 'management',
							},
							{
								name: 'Marketing',
								value: 'marketing',
							},
							{
								name: 'Sales',
								value: 'sales',
							},
							{
								name: 'Support',
								value: 'support',
							},
						],
					},
				],
			},
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['emailFinder'],
					},
				},
				required: true,
				description:
					'Domain name from which you want to find the email addresses. For example, "stripe.com".',
			},
			{
				displayName: 'First Name',
				name: 'firstname',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['emailFinder'],
					},
				},
				default: '',
				required: true,
				description: "The person's first name. It doesn't need to be in lowercase.",
			},
			{
				displayName: 'Last Name',
				name: 'lastname',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['emailFinder'],
					},
				},
				default: '',
				required: true,
				description: "The person's last name. It doesn't need to be in lowercase.",
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				displayOptions: {
					show: {
						operation: ['emailVerifier'],
					},
				},
				default: '',
				required: true,
				description: 'The email address you want to verify',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				displayOptions: {
					show: {
						operation: ['emailSources'],
					},
				},
				default: '',
				required: true,
				description: 'The email address you want to find sources',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				displayOptions: {
					show: {
						operation: ['PhoneFinder'],
					},
				},
				default: '',
				required: true,
				description: 'The email address you want to find phone',
			},
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['EmailCount'],
					},
				},
				default: '',
				required: true,
				description:
					'Domain name from which you want to find the email addresses. For example, "stripe.com".',
			},
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['DomainStatus'],
					},
				},
				default: '',
				required: true,
				description: 'Domain name from which you want to check. For example, "gmail.com".',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['Autocomplete'],
					},
				},
				default: '',
				required: true,
				description: 'Name of the company or website',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length;
		const qs: IDataObject = {};
		let responseData;
		for (let i = 0; i < length; i++) {
			try {
				const operation = this.getNodeParameter('operation', 0) as string;
				// https://developer.tomba.io/#domain-search
				if (operation === 'domainSearch') {
					const filters = this.getNodeParameter('filters', i) as IDataObject;
					const domain = this.getNodeParameter('domain', i) as string;
					const onlyEmails = this.getNodeParameter('onlyEmails', i, false) as boolean;

					qs.domain = domain;
					if (filters.type) {
						qs.type = filters.type;
					}

					if (filters.department) {
						qs.department = (filters.department as string[]).join(',');
					}

					const limit = this.getNodeParameter('limit', i) as number;
					qs.limit = limit;
					responseData = await tombaApiRequest.call(this, 'GET', '/domain-search', {}, qs);
					responseData = responseData.data;

					if (onlyEmails === true) {
						let tempReturnData: IDataObject[] = [];

						if (Array.isArray(responseData)) {
							for (const data of responseData) {
								tempReturnData.push.apply(tempReturnData, data.emails);
							}
						} else {
							tempReturnData = responseData.emails;
						}

						responseData = tempReturnData;
					}
				}
				// https://developer.tomba.io/#email-finder
				if (operation === 'emailFinder') {
					const domain = this.getNodeParameter('domain', i) as string;
					const firstname = this.getNodeParameter('firstname', i) as string;
					const lastname = this.getNodeParameter('lastname', i) as string;
					qs.domain = domain;
					qs.first_name = firstname;
					qs.last_name = lastname;
					responseData = await tombaApiRequest.call(this, 'GET', '/email-finder', {}, qs);
					responseData = responseData.data;
				}
				// https://developer.tomba.io/#email-verifier
				if (operation === 'emailVerifier') {
					const email = this.getNodeParameter('email', i) as string;
					responseData = await tombaApiRequest.call(
						this,
						'GET',
						`/email-verifier/${email}`,
						{},
						qs,
					);
					responseData = responseData.data;
				}
				// https://developer.tomba.io/#email-sources
				if (operation === 'emailSources') {
					const email = this.getNodeParameter('email', i) as string;
					responseData = await tombaApiRequest.call(this, 'GET', `/email-sources/${email}`, {}, qs);
					responseData = responseData.data;
				}
				// https://developer.tomba.io/#phone-finder
				if (operation === 'PhoneFinder') {
					const email = this.getNodeParameter('email', i) as string;
					responseData = await tombaApiRequest.call(this, 'GET', `/phone/${email}`, {}, qs);
					responseData = responseData.data;
				}
				// https://developer.tomba.io/#email-count
				if (operation === 'EmailCount') {
					const domain = this.getNodeParameter('domain', i) as string;
					qs.domain = domain;
					responseData = await tombaApiRequest.call(this, 'GET', '/email-count/', {}, qs);
					responseData = responseData.data;
				}
				// https://developer.tomba.io/#email-count
				if (operation === 'DomainStatus') {
					const domain = this.getNodeParameter('domain', i) as string;
					qs.domain = domain;
					responseData = await tombaApiRequest.call(this, 'GET', '/domain-status/', {}, qs);
					responseData = responseData;
				}
				// https://developer.tomba.io/#autocomplete
				if (operation === 'Autocomplete') {
					const query = this.getNodeParameter('query', i) as string;
					qs.query = query;
					responseData = await tombaApiRequest.call(this, 'GET', '/domains-suggestion/', {}, qs);
					responseData = responseData.data;
				}
				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData as IDataObject[]);
				} else {
					returnData.push(responseData as IDataObject);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.errors });
					continue;
				}
				throw error;
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
