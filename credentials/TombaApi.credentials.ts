import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class TombaApi implements ICredentialType {
	name = 'tombaApi';
	displayName = 'Tomba API';
	documentationUrl = 'https://developer.tomba.io/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'API Secret',
			name: 'secretKey',
			type: 'string',
			default: '',
		},
	];
}
