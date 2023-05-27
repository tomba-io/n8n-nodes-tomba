# n8n-nodes-tomba

This is an n8n community node. It lets you use Tomba.io in your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials) <!-- delete if no auth needed -->  
[Compatibility](#compatibility)  
[Usage](#usage) <!-- delete if not using this section -->  
[Resources](#resources)  
[Version history](#version-history) <!-- delete if not using this section -->

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to Settings (Cogwheel)
2. Click on "Community Nodes"
3. Enter "n8n-nodes-text-tomba" into the text box
4. Click on "I understand the risk ..."
5. Click on "Install"

## Operations

- Get every email address found on the internet using a given domain name, with sources
- Generate or retrieve the most likely email address from a domain name, a first name and a last name
- Verify the deliverability of an email address
- Find email address source somewhere on the web
- Find email address of an phone
- Find total email addresses we have for one domain.
- Find domain status if is webmail or disposable.
- Find company names and retrieve logo and domain information.

## Credentials

You can use these credentials to authenticate the following nodes with Tomba.

The Tomba node allows you to automate work in Tomba, and integrate Tomba with other applications. n8n has built-in support for a wide range of Tomba features, including getting, generating, and verifying email addresses.

## Usage

This workflow allows you to verify the deliverability of an email address using Tomba. You can also find the workflow on the website. This example usage workflow would use the following two nodes. - Start - Tomba

### Start node

The start node exists by default when you create a new workflow.

### Tomba node

1. First of all, you'll have to enter credentials for the Tomba node. You can find out how to do that here.
2. Select 'Email Verifier' from the Operation dropdown list.
3. Enter the email in the Email field.
4. Click on Execute Node to run the workflow.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Tomba Email Finder](https://tomba.io)
- [Tomba API docs](https://developer.tomba.io/#introduction)
- [Tomba knowledge base](https://help.tomba.io/en/)

## Test the node

You can test your node as you build it by running it in a local n8n instance.

### Install n8n using npm

```bash
npm install n8n -g
```

### Clone git repository

```bash
git clone https://github.com/tomba-io/n8n-nodes-tomba.git
cd n8n-nodes-tomba/
```

### Publish it locally

```bash
# In the node directory
npm run build
npm link
```

### Install the node into your local n8n instance

```bash
# In the nodes directory within your n8n installation
npm link n8n-nodes-tomba
```

> Make sure you run <b>npm link n8n-nodes-tomba</b> in the nodes directory within your n8n installation. This is probably something like <b>~/.n8n/nodes/</b>

## More information

Refer to N8N's [documentation on creating nodes](https://docs.n8n.io/integrations/creating-nodes/) for detailed information on building your own nodes.

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
