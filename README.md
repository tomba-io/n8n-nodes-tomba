# [<img src="https://tomba.io/logo.svg" alt="Tomba" width="25"/>](https://tomba.io/) Tomba.io n8n Nodes

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
3. Enter "n8n-nodes-tomba" into the text box
4. Click on "I understand the risk ..."
5. Click on "Install"

## Operations

- **[Author Finder](https://docs.tomba.io/api/finder#author-finder)** - Generate or retrieve the most likely email address from a blog post URL
- **[Autocomplete](https://docs.tomba.io/api/domain-suggestions#get-domain-suggestions)** - Find company names and retrieve logo and domain information
- **[Domain Search](https://docs.tomba.io/api/finder#domain-search)** - Get every email address found on the internet using a given domain name, with sources
- **[Domain Status](https://docs.tomba.io/api/~endpoints#domain-status)** - Find domain status if is webmail or disposable
- **[Email Count](https://docs.tomba.io/api/finder#email-count)** - Find total email addresses we have for one domain
- **[Email Enrichment](https://docs.tomba.io/api/finder#email-enrichment)** - Look up person and company data based on an email
- **[Email Finder](https://docs.tomba.io/api/finder#email-finder)** - Generate or retrieve the most likely email address from a domain name, a first name and a last name
- **[Email Format](https://docs.tomba.io/api/finder#email-format)** - Retrieve the email format patterns used by a specific domain
- **[Email Sources](https://docs.tomba.io/api/~endpoints#email-sources)** - Find email address source somewhere on the web
- **[Email Verifier](https://docs.tomba.io/api/verifier#email-verifier)** - Verify the deliverability of an email address
- **[LinkedIn Finder](https://docs.tomba.io/api/finder#linkedin-finder)** - Generate or retrieve the most likely email address from a LinkedIn URL
- **[Location](https://docs.tomba.io/api/finder#location)** - Get employees location based on the domain name
- **[Phone Finder](https://docs.tomba.io/api/phone#phone-finder)** - Search for phone numbers based on an email, domain, or LinkedIn URL
- **[Phone Validator](https://docs.tomba.io/api/phone#phone-validator)** - Validate a phone number and retrieve its associated information
- **[Similar](https://docs.tomba.io/api/~endpoints#similar)** - Retrieve similar domains based on a specific domain
- **[Technology](https://docs.tomba.io/api/~endpoints#technology)** - Retrieve the technologies used by a specific domain

## Credentials

To use the Tomba node, you need to authenticate with your Tomba API credentials. Follow these steps to set up authentication:

### Getting Your API Credentials

1. Sign up for a free account at [Tomba.io](https://tomba.io)
2. Navigate to your [API Settings](https://app.tomba.io/api) in your Tomba dashboard
3. Copy your **API Key** and **Secret Key**

### Setting Up Credentials in n8n

1. In your n8n workflow, add a Tomba node
2. Click on the **Credential to connect with** dropdown
3. Select **Create New** and choose **Tomba API**
4. Enter your credentials:
   - **API Key**: Your Tomba API key
   - **Secret**: Your Tomba secret key
5. Click **Save** to store your credentials securely

The Tomba node supports all Tomba API features, including email finding, verification, enrichment, phone finding, and domain analysis. Your credentials will be used to authenticate all requests to the Tomba API.

## Usage

The Tomba node provides powerful email intelligence capabilities for your n8n workflows. Here are some common usage examples:

### Example 1: Email Verification Workflow

This workflow verifies the deliverability of email addresses:

**Nodes needed:**

- **Manual Trigger** (or any trigger node)
- **Tomba** node

**Setup:**

1. Add a Manual Trigger node to start your workflow
2. Add a Tomba node and connect it to the trigger
3. Configure the Tomba node:
   - **Operation**: Email Verifier
   - **Email**: Enter the email address to verify (e.g., `test@example.com`)
4. Execute the workflow to get verification results

### Example 2: Domain Email Discovery

Find all email addresses associated with a company domain:

**Setup:**

1. Add a trigger node
2. Add a Tomba node with these settings:
   - **Operation**: Domain Search
   - **Domain**: Company domain (e.g., `stripe.com`)
   - **Limit**: Number of results to return
   - **Filters**: Optional filters for department, type, etc.

### Example 3: Email Finder for Lead Generation

Generate email addresses using names and company domains:

**Setup:**

1. Add a trigger node
2. Add a Tomba node with:
   - **Operation**: Email Finder
   - **Domain**: Target company domain
   - **First Name**: Contact's first name
   - **Last Name**: Contact's last name

### Example 4: Phone Number Discovery

Find phone numbers associated with emails or domains:

**Setup:**

1. Add a trigger node
2. Add a Tomba node with:
   - **Operation**: Phone Finder
   - **Search Type**: Choose Email, Domain, or LinkedIn
   - Configure the relevant field based on your search type

### Example 5: Company Intelligence Workflow

Gather comprehensive company data:

**Setup:**

1. **Domain Search**: Find all emails for a domain
2. **Location**: Get company location data
3. **Technology**: Discover technologies used
4. **Similar**: Find similar companies

### Pro Tips

- Use the **Return All** option in Domain Search for comprehensive results
- Combine multiple operations in sequence for enriched data
- Use filters in Domain Search to target specific departments
- Cache results using n8n's built-in functionality to avoid duplicate API calls
- Set up error handling for rate limits and invalid inputs

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Tomba Email Finder](https://tomba.io)
- [Tomba API docs](https://docs.tomba.io/introduction)
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
