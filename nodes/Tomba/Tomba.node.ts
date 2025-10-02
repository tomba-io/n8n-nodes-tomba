import { IExecuteFunctions } from 'n8n-workflow';
import { IDataObject, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { tombaApiRequest, tombaApiRequestAllItems } from './GenericFunctions';

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
						name: 'Author Finder',
						value: 'authorFinder',
						description: 'Generate or retrieve the most likely email address from a blog post URL',
						action: 'Generate or retrieve the most likely email address from a blog post url',
					},
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
						action:
							'Get every email address found on the internet using a given domain name with sources',
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
						name: 'Email Enrichment',
						value: 'emailEnrichment',
						description: 'Look up person and company data based on an email',
						action: 'Look up person and company data based on an email',
					},
					{
						name: 'Email Finder',
						value: 'emailFinder',
						description:
							'Generate or retrieve the most likely email address from a domain name, a first name and a last name',
						action:
							'Generate or retrieve the most likely email address from a domain name a first name and a last name',
					},
					{
						name: 'Email Format',
						value: 'emailFormat',
						description: 'Retrieve the email format patterns used by a specific domain',
						action: 'Retrieve the email format patterns used by a specific domain',
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
						name: 'LinkedIn Finder',
						value: 'linkedinFinder',
						description: 'Generate or retrieve the most likely email address from a LinkedIn URL',
						action: 'Generate or retrieve the most likely email address from a linkedin url',
					},
					{
						name: 'Location',
						value: 'location',
						description: 'Get employees location based on the domain name',
						action: 'Get employees location based on the domain name',
					},

					{
						name: 'Phone Finder',
						value: 'phoneFinder',
						description: 'Search for phone numbers based on an email, domain, or LinkedIn URL',
						action: 'Search for phone numbers based on an email domain or linkedin url',
					},
					{
						name: 'Phone Validator',
						value: 'phoneValidator',
						description: 'Validate a phone number and retrieve its associated information',
						action: 'Validate a phone number and retrieve its associated information',
					},
					{
						name: 'Similar',
						value: 'similar',
						description: 'Retrieve similar domains based on a specific domain',
						action: 'Retrieve similar domains based on a specific domain',
					},
					{
						name: 'Technology',
						value: 'technology',
						description: 'Retrieve the technologies used by a specific domain',
						action: 'Retrieve the technologies used by a specific domain',
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
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['domainSearch'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
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
								name: 'Accounting',
								value: 'accounting',
							},
							{
								name: 'Administrative',
								value: 'administrative',
							},
							{
								name: 'Communication',
								value: 'communication',
							},
							{
								name: 'Diversity',
								value: 'diversity',
							},
							{
								name: 'Engineering',
								value: 'engineering',
							},
							{
								name: 'Executive',
								value: 'executive',
							},
							{
								name: 'Facilities',
								value: 'facilities',
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
								name: 'Operations',
								value: 'operations',
							},
							{
								name: 'PR',
								value: 'pr',
							},
							{
								name: 'Sales',
								value: 'sales',
							},
							{
								name: 'Security',
								value: 'security',
							},
							{
								name: 'Software',
								value: 'software',
							},
							{
								name: 'Support',
								value: 'support',
							},
							{
								name: 'Warehouse',
								value: 'warehouse',
							},
						],
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
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
			// Email Format parameters
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['emailFormat'],
					},
				},
				default: '',
				required: true,
				description:
					'The domain name from which you want to find the email format patterns. For example, "stripe.com".',
			},
			// Location parameters
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['location'],
					},
				},
				default: '',
				required: true,
				description:
					'The domain name from which you want to find the location. For example, "stripe.com".',
			},
			// Author Finder parameters
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['authorFinder'],
					},
				},
				default: '',
				required: true,
				description:
					'The URL of the article. For example, "https://clearbit.com/blog/company-name-to-domain-api".',
			},
			// LinkedIn Finder parameters
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['linkedinFinder'],
					},
				},
				default: '',
				required: true,
				description:
					'The URL of the LinkedIn profile. For example, "https://www.linkedin.com/in/alex-maccaw-ab592978".',
			},
			// Email Enrichment parameters
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				displayOptions: {
					show: {
						operation: ['emailEnrichment'],
					},
				},
				default: '',
				required: true,
				description: 'The email address to find data for',
			},
			// Phone Finder parameters
			{
				displayName: 'Search Type',
				name: 'phoneSearchType',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['phoneFinder'],
					},
				},
				options: [
					{
						name: 'Email',
						value: 'email',
					},
					{
						name: 'Domain',
						value: 'domain',
					},
					{
						name: 'LinkedIn',
						value: 'linkedin',
					},
				],
				default: 'email',
				required: true,
				description: 'Choose the search method for finding phone numbers',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				displayOptions: {
					show: {
						operation: ['phoneFinder'],
						phoneSearchType: ['email'],
					},
				},
				default: '',
				required: true,
				description: 'The email address you want to find phone for',
			},
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['phoneFinder'],
						phoneSearchType: ['domain'],
					},
				},
				default: '',
				required: true,
				description:
					'Domain name from which you want to find the phone numbers. For example, "stripe.com".',
			},
			{
				displayName: 'LinkedIn URL',
				name: 'linkedin',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['phoneFinder'],
						phoneSearchType: ['linkedin'],
					},
				},
				default: '',
				required: true,
				description:
					'The URL of the LinkedIn profile. For example, "https://www.linkedin.com/in/alex-maccaw-ab592978".',
			},
			// Phone Validator parameters
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['phoneValidator'],
					},
				},
				default: '',
				required: true,
				description: 'The phone number you want to validate',
			},
			{
				displayName: 'Country Code',
				name: 'countryCode',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['phoneValidator'],
					},
				},
				default: '',
				description: 'Country code of the phone number. For example, "US".',
			},
			// Similar parameters
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['similar'],
					},
				},
				default: '',
				required: true,
				description:
					'Domain name from which you want to find similar domains. For example, "stripe.com".',
			},
			// Technology parameters
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['technology'],
					},
				},
				default: '',
				required: true,
				description:
					'Domain name from which you want to find the technology. For example, "stripe.com".',
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
				// https://docs.tomba.io/api/finder#domain-search
				if (operation === 'domainSearch') {
					const returnAll = this.getNodeParameter('returnAll', i);
					const filters = this.getNodeParameter('filters', i);
					const domain = this.getNodeParameter('domain', i) as string;
					const onlyEmails = this.getNodeParameter('onlyEmails', i, false) as boolean;

					qs.domain = domain;
					if (filters.type) {
						qs.type = filters.type;
					}
					if (filters.department) {
						qs.department = filters.department;
					}
					if (filters.country) {
						qs.country = filters.country;
					}
					if (returnAll) {
						responseData = await tombaApiRequestAllItems.call(
							this,
							'data',
							'GET',
							'/domain-search',
							{},
							qs,
						);

						// Make sure that the company information is there only once and
						// the emails are combined underneath it.
						if (!onlyEmails) {
							let tempReturnData: IDataObject = {};

							for (let index = 0; index < responseData.length; index++) {
								if (index === 0) {
									tempReturnData = responseData[index];
									continue;
								}
								(tempReturnData.emails as IDataObject[]).push.apply(
									tempReturnData.emails,
									responseData[index].emails as IDataObject[],
								);
							}

							responseData = tempReturnData;
						}
					} else {
						const limit = this.getNodeParameter('limit', i);
						qs.limit = limit;
						responseData = await tombaApiRequest.call(this, 'GET', '/domain-search', {}, qs);
						responseData = responseData.data;
					}

					if (onlyEmails) {
						let tempReturnData: IDataObject[] = [];

						if (Array.isArray(responseData)) {
							for (const data of responseData) {
								tempReturnData.push.apply(tempReturnData, data.emails as IDataObject[]);
							}
						} else {
							tempReturnData = responseData.emails;
						}

						responseData = tempReturnData;
					}
				}
				// https://docs.tomba.io/api/finder#email-finder
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
				// https://docs.tomba.io/api/verifier#email-verifier
				if (operation === 'emailVerifier') {
					const email = this.getNodeParameter('email', i) as string;
					qs.email = email;
					responseData = await tombaApiRequest.call(this, 'GET', `/email-verifier`, {}, qs);
					responseData = responseData.data;
				}
				// https://docs.tomba.io/api/~endpoints#email-sources
				if (operation === 'emailSources') {
					const email = this.getNodeParameter('email', i) as string;
					qs.email = email;
					responseData = await tombaApiRequest.call(this, 'GET', `/email-sources`, {}, qs);
					responseData = responseData.data;
				}
				// https://docs.tomba.io/api/finder#email-count
				if (operation === 'EmailCount') {
					const domain = this.getNodeParameter('domain', i) as string;
					qs.domain = domain;
					responseData = await tombaApiRequest.call(this, 'GET', '/email-count/', {}, qs);
					responseData = responseData.data;
				}
				// https://docs.tomba.io/api/~endpoints#domain-status
				if (operation === 'DomainStatus') {
					const domain = this.getNodeParameter('domain', i) as string;
					qs.domain = domain;
					responseData = await tombaApiRequest.call(this, 'GET', '/domain-status/', {}, qs);
					responseData = responseData;
				}
				// https://docs.tomba.io/api/domain-suggestions#get-domain-suggestions
				if (operation === 'Autocomplete') {
					const query = this.getNodeParameter('query', i) as string;
					qs.query = query;
					responseData = await tombaApiRequest.call(this, 'GET', '/domain-suggestions', {}, qs);
					responseData = responseData.data;
				}
				// https://docs.tomba.io/api/finder#email-format
				if (operation === 'emailFormat') {
					const domain = this.getNodeParameter('domain', i) as string;
					qs.domain = domain;
					responseData = await tombaApiRequest.call(this, 'GET', '/email-format', {}, qs);
					responseData = responseData.data;
				}
				// https://docs.tomba.io/api/finder#location
				if (operation === 'location') {
					const domain = this.getNodeParameter('domain', i) as string;
					qs.domain = domain;
					responseData = await tombaApiRequest.call(this, 'GET', '/location', {}, qs);
					responseData = responseData.data;
				}
				// https://docs.tomba.io/api/finder#author-finder
				if (operation === 'authorFinder') {
					const url = this.getNodeParameter('url', i) as string;
					qs.url = url;
					responseData = await tombaApiRequest.call(this, 'GET', '/author-finder', {}, qs);
					responseData = responseData.data;
				}
				// https://docs.tomba.io/api/finder#linkedin-finder
				if (operation === 'linkedinFinder') {
					const url = this.getNodeParameter('url', i) as string;
					qs.url = url;
					responseData = await tombaApiRequest.call(this, 'GET', '/linkedin', {}, qs);
					responseData = responseData.data;
				}
				// https://docs.tomba.io/api/finder#email-enrichment
				if (operation === 'emailEnrichment') {
					const email = this.getNodeParameter('email', i) as string;
					qs.email = email;
					responseData = await tombaApiRequest.call(this, 'GET', '/enrich', {}, qs);
					responseData = responseData.data;
				}
				// https://docs.tomba.io/api/phone#phone-finder
				if (operation === 'phoneFinder') {
					const searchType = this.getNodeParameter('phoneSearchType', i) as string;

					if (searchType === 'email') {
						const email = this.getNodeParameter('email', i) as string;
						qs.email = email;
					} else if (searchType === 'domain') {
						const domain = this.getNodeParameter('domain', i) as string;
						qs.domain = domain;
					} else if (searchType === 'linkedin') {
						const linkedin = this.getNodeParameter('linkedin', i) as string;
						qs.linkedin = linkedin;
					}

					responseData = await tombaApiRequest.call(this, 'GET', '/phone-finder', {}, qs);
					responseData = responseData.data;
				}
				// https://docs.tomba.io/api/phone#phone-validator
				if (operation === 'phoneValidator') {
					const phone = this.getNodeParameter('phone', i) as string;
					qs.phone = phone;

					const countryCode = this.getNodeParameter('countryCode', i, '') as string;
					if (countryCode) {
						qs.country_code = countryCode;
					}

					responseData = await tombaApiRequest.call(this, 'GET', '/phone-validator', {}, qs);
					responseData = responseData.data;
				}
				// https://docs.tomba.io/api/~endpoints#similar
				if (operation === 'similar') {
					const domain = this.getNodeParameter('domain', i) as string;
					qs.domain = domain;
					responseData = await tombaApiRequest.call(this, 'GET', '/similar', {}, qs);
					responseData = responseData.data;
				}
				// https://docs.tomba.io/api/~endpoints#technology
				if (operation === 'technology') {
					const domain = this.getNodeParameter('domain', i) as string;
					qs.domain = domain;
					responseData = await tombaApiRequest.call(this, 'GET', '/technology', {}, qs);
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
