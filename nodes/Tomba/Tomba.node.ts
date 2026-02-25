import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { tombaApiRequest, tombaApiRequestAllItems } from './GenericFunctions';

export class Tomba implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tomba',
		name: 'tomba',
		icon: { light: 'file:../../icons/tomba.svg', dark: 'file:../../icons/tomba.dark.svg' },
		group: ['output'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
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
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Company',
						value: 'company',
						description: 'Search for companies using natural language or structured filters',
					},
					{
						name: 'Custom API Call',
						value: 'customApiCall',
						description:
							'Make an authenticated HTTP request to any Tomba API endpoint. Tomba auth is handled automatically.',
					},
					{
						name: 'Domain',
						value: 'domain',
						description: 'Domain search, status, location, similar, technology, autocomplete',
					},
					{
						name: 'Email',
						value: 'email',
						description: 'Email finder, verifier, sources, enrichment, count, format',
					},
					{ name: 'Finder', value: 'finder', description: 'Author finder, LinkedIn finder' },
					{ name: 'Phone', value: 'phone', description: 'Phone finder, phone validator' },
				],
				default: 'domain',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['domain'] } },
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
						name: 'Location',
						value: 'location',
						description: 'Get employees location based on the domain name',
						action: 'Get employees location based on the domain name',
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
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['email'] } },
				options: [
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
				],
				default: 'emailFinder',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['finder'] } },
				options: [
					{
						name: 'Author Finder',
						value: 'authorFinder',
						description: 'Generate or retrieve the most likely email address from a blog post URL',
						action: 'Generate or retrieve the most likely email address from a blog post url',
					},
					{
						name: 'LinkedIn Finder',
						value: 'linkedinFinder',
						description: 'Generate or retrieve the most likely email address from a LinkedIn URL',
						action: 'Generate or retrieve the most likely email address from a linkedin url',
					},
				],
				default: 'authorFinder',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['phone'] } },
				options: [
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
				],
				default: 'phoneFinder',
			},
			// ─── Company operations ──────────────────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['company'] } },
				options: [
					{
						name: 'Search Companies',
						value: 'searchCompanies',
						description:
							'Search for companies using natural language queries or structured filters',
						action: 'Search for companies using natural language queries or structured filters',
					},
				],
				default: 'searchCompanies',
			},
			// ─── Search Companies fields ─────────────────────────────────────────────
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 1000 },
				displayOptions: { show: { resource: ['company'], operation: ['searchCompanies'] } },
				default: 1,
				description: 'Page number for pagination (1–1000)',
			},
			{
				displayName: 'Filters',
				name: 'companyFilters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: { show: { resource: ['company'], operation: ['searchCompanies'] } },
				description:
					'Structured include/exclude filters for company search. Each filter accepts comma-separated values (max 50 each).',
				options: [
					{
						displayName: 'Company',
						name: 'company',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								name: 'val',
								displayName: 'Company',
								values: [
									{
										displayName: 'Include',
										name: 'include',
										type: 'string',
										default: '',
										placeholder: 'e.g. Stripe, Airbnb',
										description: 'Comma-separated company names to include (max 50)',
									},
									{
										displayName: 'Exclude',
										name: 'exclude',
										type: 'string',
										default: '',
										placeholder: 'e.g. Google, Meta',
										description: 'Comma-separated company names to exclude (max 50)',
									},
								],
							},
						],
					},
					{
						displayName: 'Founded',
						name: 'founded',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								name: 'val',
								displayName: 'Founded',
								values: [
									{
										displayName: 'Include',
										name: 'include',
										type: 'string',
										default: '',
										placeholder: 'e.g. 2010, 2015',
										description: 'Comma-separated founding years to include (max 50)',
									},
									{
										displayName: 'Exclude',
										name: 'exclude',
										type: 'string',
										default: '',
										placeholder: 'e.g. 2000, 2001',
										description: 'Comma-separated founding years to exclude (max 50)',
									},
								],
							},
						],
					},
					{
						displayName: 'Funding',
						name: 'funding',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								name: 'val',
								displayName: 'Funding',
								values: [
									{
										displayName: 'Include',
										name: 'include',
										type: 'string',
										default: '',
										placeholder: 'e.g. Series A, Series B',
										description: 'Comma-separated funding stages to include (max 50)',
									},
									{
										displayName: 'Exclude',
										name: 'exclude',
										type: 'string',
										default: '',
										placeholder: 'e.g. Seed',
										description: 'Comma-separated funding stages to exclude (max 50)',
									},
								],
							},
						],
					},
					{
						displayName: 'Industry',
						name: 'industry',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								name: 'val',
								displayName: 'Industry',
								values: [
									{
										displayName: 'Include',
										name: 'include',
										type: 'string',
										default: '',
										placeholder: 'e.g. SaaS, Fintech',
										description: 'Comma-separated industries to include (max 50)',
									},
									{
										displayName: 'Exclude',
										name: 'exclude',
										type: 'string',
										default: '',
										placeholder: 'e.g. Gaming',
										description: 'Comma-separated industries to exclude (max 50)',
									},
								],
							},
						],
					},
					{
						displayName: 'Keywords',
						name: 'keywords',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								name: 'val',
								displayName: 'Keywords',
								values: [
									{
										displayName: 'Include',
										name: 'include',
										type: 'string',
										default: '',
										placeholder: 'e.g. AI, automation',
										description: 'Comma-separated keywords to include (max 50)',
									},
									{
										displayName: 'Exclude',
										name: 'exclude',
										type: 'string',
										default: '',
										placeholder: 'e.g. blockchain',
										description: 'Comma-separated keywords to exclude (max 50)',
									},
								],
							},
						],
					},
					{
						displayName: 'Location City',
						name: 'location_city',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								name: 'val',
								displayName: 'Location City',
								values: [
									{
										displayName: 'Include',
										name: 'include',
										type: 'string',
										default: '',
										placeholder: 'e.g. San Francisco, New York',
										description: 'Comma-separated cities to include (max 50)',
									},
									{
										displayName: 'Exclude',
										name: 'exclude',
										type: 'string',
										default: '',
										placeholder: 'e.g. Austin',
										description: 'Comma-separated cities to exclude (max 50)',
									},
								],
							},
						],
					},
					{
						displayName: 'Location Country',
						name: 'location_country',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								name: 'val',
								displayName: 'Location Country',
								values: [
									{
										displayName: 'Include',
										name: 'include',
										type: 'string',
										default: '',
										placeholder: 'e.g. US, CA',
										description: 'Comma-separated country codes to include (max 50)',
									},
									{
										displayName: 'Exclude',
										name: 'exclude',
										type: 'string',
										default: '',
										placeholder: 'e.g. IN, BR',
										description: 'Comma-separated country codes to exclude (max 50)',
									},
								],
							},
						],
					},
					{
						displayName: 'Location State',
						name: 'location_state',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								name: 'val',
								displayName: 'Location State',
								values: [
									{
										displayName: 'Include',
										name: 'include',
										type: 'string',
										default: '',
										placeholder: 'e.g. California, Texas',
										description: 'Comma-separated states to include (max 50)',
									},
									{
										displayName: 'Exclude',
										name: 'exclude',
										type: 'string',
										default: '',
										placeholder: 'e.g. Florida',
										description: 'Comma-separated states to exclude (max 50)',
									},
								],
							},
						],
					},
					{
						displayName: 'NAICS',
						name: 'naics',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								name: 'val',
								displayName: 'NAICS',
								values: [
									{
										displayName: 'Include',
										name: 'include',
										type: 'string',
										default: '',
										placeholder: 'e.g. 518210, 541511',
										description: 'Comma-separated NAICS codes to include (max 50)',
									},
									{
										displayName: 'Exclude',
										name: 'exclude',
										type: 'string',
										default: '',
										placeholder: 'e.g. 722511',
										description: 'Comma-separated NAICS codes to exclude (max 50)',
									},
								],
							},
						],
					},
					{
						displayName: 'Revenue',
						name: 'revenue',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								name: 'val',
								displayName: 'Revenue',
								values: [
									{
										displayName: 'Include',
										name: 'include',
										type: 'string',
										default: '',
										placeholder: 'e.g. 1M-10M, 10M-50M',
										description: 'Comma-separated revenue ranges to include (max 50)',
									},
									{
										displayName: 'Exclude',
										name: 'exclude',
										type: 'string',
										default: '',
										placeholder: 'e.g. <1M',
										description: 'Comma-separated revenue ranges to exclude (max 50)',
									},
								],
							},
						],
					},
					{
						displayName: 'SIC',
						name: 'sic',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								name: 'val',
								displayName: 'SIC',
								values: [
									{
										displayName: 'Include',
										name: 'include',
										type: 'string',
										default: '',
										placeholder: 'e.g. 7372, 7371',
										description: 'Comma-separated SIC codes to include (max 50)',
									},
									{
										displayName: 'Exclude',
										name: 'exclude',
										type: 'string',
										default: '',
										placeholder: 'e.g. 5812',
										description: 'Comma-separated SIC codes to exclude (max 50)',
									},
								],
							},
						],
					},
					{
						displayName: 'Similar',
						name: 'similar',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								name: 'val',
								displayName: 'Similar',
								values: [
									{
										displayName: 'Include',
										name: 'include',
										type: 'string',
										default: '',
										placeholder: 'e.g. stripe.com, twilio.com',
										description: 'Comma-separated similar domains to include (max 50)',
									},
									{
										displayName: 'Exclude',
										name: 'exclude',
										type: 'string',
										default: '',
										placeholder: 'e.g. paypal.com',
										description: 'Comma-separated similar domains to exclude (max 50)',
									},
								],
							},
						],
					},
					{
						displayName: 'Size',
						name: 'size',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								name: 'val',
								displayName: 'Size',
								values: [
									{
										displayName: 'Include',
										name: 'include',
										type: 'string',
										default: '',
										placeholder: 'e.g. 11-50, 51-200',
										description: 'Comma-separated employee size ranges to include (max 50)',
									},
									{
										displayName: 'Exclude',
										name: 'exclude',
										type: 'string',
										default: '',
										placeholder: 'e.g. 1-10',
										description: 'Comma-separated employee size ranges to exclude (max 50)',
									},
								],
							},
						],
					},
					{
						displayName: 'Technologies',
						name: 'technologies',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								name: 'val',
								displayName: 'Technologies',
								values: [
									{
										displayName: 'Include',
										name: 'include',
										type: 'string',
										default: '',
										placeholder: 'e.g. React, AWS',
										description: 'Comma-separated technologies to include (max 50)',
									},
									{
										displayName: 'Exclude',
										name: 'exclude',
										type: 'string',
										default: '',
										placeholder: 'e.g. PHP',
										description: 'Comma-separated technologies to exclude (max 50)',
									},
								],
							},
						],
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'fixedCollection',
						default: {},
						options: [
							{
								name: 'val',
								displayName: 'Type',
								values: [
									{
										displayName: 'Include',
										name: 'include',
										type: 'string',
										default: '',
										placeholder: 'e.g. privately held, public',
										description: 'Comma-separated company types to include (max 50)',
									},
									{
										displayName: 'Exclude',
										name: 'exclude',
										type: 'string',
										default: '',
										placeholder: 'e.g. non-profit',
										description: 'Comma-separated company types to exclude (max 50)',
									},
								],
							},
						],
					},
				],
			},
			// Custom API Call operation
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['customApiCall'] } },
				options: [
					{
						name: 'Custom API Call',
						value: 'customApiCall',
						description: 'Make an authenticated HTTP request to any Tomba API endpoint',
						action: 'Make a custom authenticated api call to the tomba api',
					},
				],
				default: 'customApiCall',
			},
			// ─── Custom API Call fields ───────────────────────────────────────────────
			{
				displayName: 'Method',
				name: 'method',
				type: 'options',
				displayOptions: { show: { resource: ['customApiCall'], operation: ['customApiCall'] } },
				options: [
					{ name: 'DELETE', value: 'DELETE' },
					{ name: 'GET', value: 'GET' },
					{ name: 'PATCH', value: 'PATCH' },
					{ name: 'POST', value: 'POST' },
					{ name: 'PUT', value: 'PUT' },
				],
				default: 'GET',
				description: 'The HTTP method to use for the request',
			},
			{
				displayName: 'Endpoint',
				name: 'endpoint',
				type: 'string',
				displayOptions: { show: { resource: ['customApiCall'], operation: ['customApiCall'] } },
				default: '',
				required: true,
				placeholder: '/domain-search',
				description:
					'The path to call, relative to <code>https://api.tomba.io/v1</code>. For example, <code>/domain-search</code>.',
			},
			{
				displayName: 'Send Query Parameters',
				name: 'sendQueryParameters',
				type: 'boolean',
				displayOptions: { show: { resource: ['customApiCall'], operation: ['customApiCall'] } },
				default: false,
				description: 'Whether to append query parameters to the request URL',
			},
			{
				displayName: 'Query Parameters',
				name: 'queryParameters',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				displayOptions: {
					show: {
						resource: ['customApiCall'],
						operation: ['customApiCall'],
						sendQueryParameters: [true],
					},
				},
				placeholder: 'Add Parameter',
				default: {},
				options: [
					{
						name: 'parameters',
						displayName: 'Parameters',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Name of the query parameter',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value of the query parameter',
							},
						],
					},
				],
			},
			{
				displayName: 'Send Body',
				name: 'sendBody',
				type: 'boolean',
				displayOptions: { show: { resource: ['customApiCall'], operation: ['customApiCall'] } },
				default: false,
				description: 'Whether to send a JSON body with the request',
			},
			{
				displayName: 'Body (JSON)',
				name: 'body',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['customApiCall'],
						operation: ['customApiCall'],
						sendBody: [true],
					},
				},
				default: '{}',
				description: 'The JSON body to send with the request',
			},
			{
				displayName: 'Send Headers',
				name: 'sendHeaders',
				type: 'boolean',
				displayOptions: { show: { resource: ['customApiCall'], operation: ['customApiCall'] } },
				default: false,
				description: 'Whether to send extra headers with the request',
			},
			{
				displayName: 'Headers',
				name: 'headerParameters',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				displayOptions: {
					show: {
						resource: ['customApiCall'],
						operation: ['customApiCall'],
						sendHeaders: [true],
					},
				},
				placeholder: 'Add Header',
				default: {},
				options: [
					{
						name: 'parameters',
						displayName: 'Parameters',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Name of the header',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value of the header',
							},
						],
					},
				],
			},
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['domainSearch'],
					},
				},
				default: '',
				description:
					'Domain name from which you want to find the email addresses. For example, "stripe.com".',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['domainSearch'],
					},
				},
				default: '',
				typeOptions: {
					minLength: 3,
					maxLength: 75,
				},
				description:
					'The company name from which you want to find the email addresses. For example, "stripe". Note that providing the domain name gives better results as it removes the conversion from the company name. If you send a request with both the domain and the company name, the domain name will be used. The company name doesn\'t need to be in lowercase.',
			},
			{
				displayName: 'Only Emails',
				name: 'onlyEmails',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['domain'],
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
						resource: ['domain'],
						operation: ['domainSearch'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['domainSearch'],
					},
				},
				options: [
					{ name: '10', value: '10' },
					{ name: '20', value: '20' },
					{ name: '50', value: '50' },
				],
				default: '10',
				description: 'Specifies the max number of email addresses to return',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['domain'],
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
						resource: ['email'],
						operation: ['emailFinder'],
					},
				},
				description:
					'Domain name from which you want to find the email addresses. For example, "stripe.com".',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['emailFinder'],
					},
				},
				default: '',
				typeOptions: {
					minLength: 3,
					maxLength: 75,
				},
				description:
					'The company name from which you want to find the email addresses. For example, "stripe". Note that providing the domain name gives better results as it removes the conversion from the company name. If you send a request with both the domain and the company name, the domain name will be used. The company name doesn\'t need to be in lowercase.',
			},
			{
				displayName: 'Enrich Mobile',
				name: 'enrichMobile',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['emailFinder'],
					},
				},
				default: false,
				description: 'Whether to get the phone number associated with the email address found',
			},
			{
				displayName: 'First Name',
				name: 'firstname',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['email'],
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
						resource: ['email'],
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
						resource: ['email'],
						operation: ['emailVerifier'],
					},
				},
				default: '',
				required: true,
				description: 'The email address you want to verify',
			},
			{
				displayName: 'Enrich Mobile',
				name: 'enrichMobile',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['emailVerifier'],
					},
				},
				default: false,
				description: 'Whether to get the phone number associated with the email address found',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				displayOptions: {
					show: {
						resource: ['email'],
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
						resource: ['email'],
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
						resource: ['domain'],
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
						resource: ['domain'],
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
						resource: ['email'],
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
						resource: ['domain'],
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
						resource: ['finder'],
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
						resource: ['finder'],
						operation: ['linkedinFinder'],
					},
				},
				default: '',
				required: true,
				description:
					'The URL of the LinkedIn profile. For example, "https://www.linkedin.com/in/alex-maccaw-ab592978".',
			},
			{
				displayName: 'Enrich Mobile',
				name: 'enrichMobile',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['finder'],
						operation: ['linkedinFinder'],
					},
				},
				default: false,
				description: 'Whether to get the phone number associated with the email address found',
			},
			// Email Enrichment parameters
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['emailEnrichment'],
					},
				},
				default: '',
				required: true,
				description: 'The email address to find data for',
			},
			{
				displayName: 'Enrich Mobile',
				name: 'enrichMobile',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['emailEnrichment'],
					},
				},
				default: false,
				description: 'Whether to get the phone number associated with the email address found',
			},
			// Phone Finder parameters
			{
				displayName: 'Search Type',
				name: 'phoneSearchType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['phone'],
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
						resource: ['phone'],
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
						resource: ['phone'],
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
						resource: ['phone'],
						operation: ['phoneFinder'],
						phoneSearchType: ['linkedin'],
					},
				},
				default: '',
				required: true,
				description:
					'The URL of the LinkedIn profile. For example, "https://www.linkedin.com/in/alex-maccaw-ab592978".',
			},
			{
				displayName: 'Full',
				name: 'full',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['phone'],
						operation: ['phoneFinder'],
					},
				},
				default: false,
				description:
					'Whether to get the array of all phone numbers associated with the email or domain or LinkedIn URL provided',
			},
			// Phone Validator parameters
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['phone'],
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
						resource: ['phone'],
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
						resource: ['domain'],
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
						resource: ['domain'],
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
		const returnData: INodeExecutionData[] = [];
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
					const company = this.getNodeParameter('company', i, '') as string;
					const onlyEmails = this.getNodeParameter('onlyEmails', i, false) as boolean;

					if (domain) qs.domain = domain;
					if (company) qs.company = company;
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
							tempReturnData = (responseData as IDataObject).emails as IDataObject[];
						}

						responseData = tempReturnData;
					}
				}
				// https://docs.tomba.io/api/finder#email-finder
				if (operation === 'emailFinder') {
					const domain = this.getNodeParameter('domain', i) as string;
					const company = this.getNodeParameter('company', i, '') as string;
					const firstname = this.getNodeParameter('firstname', i) as string;
					const lastname = this.getNodeParameter('lastname', i) as string;
					const enrichMobile = this.getNodeParameter('enrichMobile', i, false) as boolean;
					if (domain) qs.domain = domain;
					if (company) qs.company = company;
					qs.first_name = firstname;
					qs.last_name = lastname;
					if (enrichMobile) qs.enrich_mobile = enrichMobile;
					responseData = await tombaApiRequest.call(this, 'GET', '/email-finder', {}, qs);
					responseData = responseData.data;
				}
				// https://docs.tomba.io/api/verifier#email-verifier
				if (operation === 'emailVerifier') {
					const email = this.getNodeParameter('email', i) as string;
					const enrichMobile = this.getNodeParameter('enrichMobile', i, false) as boolean;
					qs.email = email;
					if (enrichMobile) qs.enrich_mobile = enrichMobile;
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
					const enrichMobile = this.getNodeParameter('enrichMobile', i, false) as boolean;
					qs.url = url;
					if (enrichMobile) qs.enrich_mobile = enrichMobile;
					responseData = await tombaApiRequest.call(this, 'GET', '/linkedin', {}, qs);
					responseData = responseData.data;
				}
				// https://docs.tomba.io/api/finder#email-enrichment
				if (operation === 'emailEnrichment') {
					const email = this.getNodeParameter('email', i) as string;
					const enrichMobile = this.getNodeParameter('enrichMobile', i, false) as boolean;
					qs.email = email;
					if (enrichMobile) qs.enrich_mobile = enrichMobile;
					responseData = await tombaApiRequest.call(this, 'GET', '/enrich', {}, qs);
					responseData = responseData.data;
				}
				// https://docs.tomba.io/api/phone#phone-finder
				if (operation === 'phoneFinder') {
					const searchType = this.getNodeParameter('phoneSearchType', i) as string;
					const full = this.getNodeParameter('full', i, false) as boolean;

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

					if (full) qs.full = full;
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

				// https://api.tomba.io/v1/reveal/search
				if (operation === 'searchCompanies') {
					const page = this.getNodeParameter('page', i, 1) as number;
					const rawFilters = this.getNodeParameter('companyFilters', i, {}) as IDataObject;

					const FILTER_KEYS = [
						'company',
						'founded',
						'funding',
						'industry',
						'keywords',
						'location_city',
						'location_country',
						'location_state',
						'naics',
						'revenue',
						'sic',
						'similar',
						'size',
						'technologies',
						'type',
					];

					const splitValues = (raw: string): string[] =>
						raw
							.split(',')
							.map((v) => v.trim())
							.filter(Boolean)
							.slice(0, 50);

					const filters: IDataObject = {};
					for (const key of FILTER_KEYS) {
						const slot = (rawFilters[key] as IDataObject | undefined)?.val as
							| { include?: string; exclude?: string }
							| undefined;
						if (!slot) continue;
						const entry: { include?: string[]; exclude?: string[] } = {};
						if (slot.include?.trim()) entry.include = splitValues(slot.include);
						if (slot.exclude?.trim()) entry.exclude = splitValues(slot.exclude);
						if (entry.include || entry.exclude) filters[key] = entry;
					}

					const body: IDataObject = { page };
					if (Object.keys(filters).length) body.filters = filters;

					responseData = await tombaApiRequest.call(this, 'POST', '/reveal/search', body, {});
				}

				// Custom API Call – delegates to helpers.httpRequestWithAuthentication
				// so Tomba credentials (X-Tomba-Key / X-Tomba-Secret) are injected automatically.
				if (operation === 'customApiCall') {
					const method = this.getNodeParameter('method', i) as IHttpRequestMethods;
					const endpoint = this.getNodeParameter('endpoint', i) as string;

					// Build query params
					const sendQueryParameters = this.getNodeParameter(
						'sendQueryParameters',
						i,
						false,
					) as boolean;
					const queryParams: IDataObject = {};
					if (sendQueryParameters) {
						const rawQs = this.getNodeParameter('queryParameters.parameters', i, []) as Array<{
							name: string;
							value: string;
						}>;
						for (const param of rawQs) {
							queryParams[param.name] = param.value;
						}
					}

					// Build extra headers
					const sendHeaders = this.getNodeParameter('sendHeaders', i, false) as boolean;
					const extraHeaders: IDataObject = {};
					if (sendHeaders) {
						const rawHeaders = this.getNodeParameter(
							'headerParameters.parameters',
							i,
							[],
						) as Array<{ name: string; value: string }>;
						for (const header of rawHeaders) {
							extraHeaders[header.name] = header.value;
						}
					}

					// Build body
					const sendBody = this.getNodeParameter('sendBody', i, false) as boolean;
					let body: IDataObject | undefined;
					if (sendBody) {
						const rawBody = this.getNodeParameter('body', i, '{}') as string;
						body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
					}

					responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'tombaApi', {
						method,
						url: `https://api.tomba.io/v1${endpoint}`,
						qs: queryParams,
						headers: extraHeaders,
						body,
						json: true,
					});
				}

				// Handle responseData and add with proper pairedItem tracking
				if (Array.isArray(responseData)) {
					for (const item of responseData) {
						returnData.push({
							json: item as IDataObject,
							pairedItem: { item: i },
						});
					}
				} else {
					returnData.push({
						json: responseData as IDataObject,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.errors },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}
		return [returnData];
	}
}
