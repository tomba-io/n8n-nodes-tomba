import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class TombaApi implements ICredentialType {
	name = 'tombaApi';
	displayName = 'Tomba API';
	documentationUrl = 'https://app.tomba.io/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true, minValue: 30 },
			default: '',
			placeholder: 'ta_xx',
			description: 'Your Tomba API Key',
			hint: 'You can find your API key in your Tomba account API page.',
		},
		{
			displayName: 'API Secret',
			name: 'secretKey',
			type: 'string',
			typeOptions: { password: true, minValue: 30 },
			default: '',
			placeholder: 'ts_xx',
			description: 'Your Tomba API Secret',
			hint: 'You can find your API secret in your Tomba account API page.',
		},
	];
}
