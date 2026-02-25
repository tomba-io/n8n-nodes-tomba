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

### Install from n8n Integrations (Recommended)

The easiest way to install Tomba is directly from the [n8n Tomba integration page](https://n8n.io/integrations/tomba/):

1. **Sign in to n8n** — Sign in to n8n, open the editor, and click **+** in the top right to open the Nodes panel.
2. **Search for Tomba** — Type "Tomba" in the search field to find the node.
3. **Add to Workflow** — Click on the Tomba node to add it to your workflow.

### Install via Community Nodes

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to Settings (Cogwheel)
2. Click on "Community Nodes"
3. Enter "n8n-nodes-tomba" into the text box
4. Click on "I understand the risk ..."
5. Click on "Install"

## Operations

### Company

- **[Search Companies](https://developer.tomba.io/#reveal-search)** - Search for companies using natural language queries or structured filters (location, industry, size, technologies, and more)

### Domain

- **[Autocomplete](https://docs.tomba.io/api/domain-suggestions#get-domain-suggestions)** - Find company names and retrieve logo and domain information
- **[Domain Search](https://docs.tomba.io/api/finder#domain-search)** - Get every email address found on the internet using a given domain name, with sources
- **[Domain Status](https://docs.tomba.io/api/~endpoints#domain-status)** - Find domain status if is webmail or disposable
- **[Location](https://docs.tomba.io/api/finder#location)** - Get employees location based on the domain name
- **[Similar](https://docs.tomba.io/api/~endpoints#similar)** - Retrieve similar domains based on a specific domain
- **[Technology](https://docs.tomba.io/api/~endpoints#technology)** - Retrieve the technologies used by a specific domain

### Email

- **[Email Count](https://docs.tomba.io/api/finder#email-count)** - Find total email addresses we have for one domain
- **[Email Enrichment](https://docs.tomba.io/api/finder#email-enrichment)** - Look up person and company data based on an email
- **[Email Finder](https://docs.tomba.io/api/finder#email-finder)** - Generate or retrieve the most likely email address from a domain name, a first name and a last name
- **[Email Format](https://docs.tomba.io/api/finder#email-format)** - Retrieve the email format patterns used by a specific domain
- **[Email Sources](https://docs.tomba.io/api/~endpoints#email-sources)** - Find email address source somewhere on the web
- **[Email Verifier](https://docs.tomba.io/api/verifier#email-verifier)** - Verify the deliverability of an email address

### Finder

- **[Author Finder](https://docs.tomba.io/api/finder#author-finder)** - Generate or retrieve the most likely email address from a blog post URL
- **[LinkedIn Finder](https://docs.tomba.io/api/finder#linkedin-finder)** - Generate or retrieve the most likely email address from a LinkedIn URL

### Phone

- **[Phone Finder](https://docs.tomba.io/api/phone#phone-finder)** - Search for phone numbers based on an email, domain, or LinkedIn URL
- **[Phone Validator](https://docs.tomba.io/api/phone#phone-validator)** - Validate a phone number and retrieve its associated information

### Custom API Call

Make any authenticated HTTP request directly to the [Tomba API](https://developer.tomba.io/) — useful for endpoints not yet covered by a dedicated operation. Tomba credentials (API Key & Secret) are automatically injected into every request.

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

The Tomba node supports all Tomba API features, including email finding, verification, enrichment, phone finding, company search, and domain analysis. Your credentials will be used to authenticate all requests to the Tomba API.

### Using Tomba Credentials with the HTTP Request Node

You can also use your Tomba credentials directly in the n8n **HTTP Request** node to call any Tomba API endpoint:

1. Add an **HTTP Request** node to your workflow
2. Set **Authentication** to **Predefined Credential Type**
3. Set **Credential Type** to **Tomba API**
4. Select your existing Tomba credential
5. Configure the URL (`https://api.tomba.io/v1/...`) and request details

n8n will automatically inject the `X-Tomba-Key` and `X-Tomba-Secret` headers on every request. See the [Custom API operations docs](https://docs.n8n.io/integrations/custom-operations/) for more details.

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

### Example 5: Company Search

Search for companies matching specific criteria:

**Setup:**

1. Add a trigger node
2. Add a Tomba node with:
   - **Resource**: Company
   - **Operation**: Search Companies
   - **Page**: `1`
   - **Filters**: Expand to add any combination of:
     - **Location Country** → Include: `US, CA`
     - **Industry** → Include: `SaaS, Fintech`
     - **Size** → Include: `51-200, 201-500`
     - **Technologies** → Include: `React, AWS` / Exclude: `PHP`
     - **Founded**, **Revenue**, **Type**, **Keywords**, and more

### Example 6: Custom API Call

Call any Tomba API endpoint not covered by a dedicated operation:

**Setup:**

1. Add a trigger node
2. Add a Tomba node with:
   - **Resource**: Custom API Call
   - **Method**: `GET` (or POST, PUT, etc.)
   - **Endpoint**: `/me` (relative to `https://api.tomba.io/v1`)
   - Optionally add **Query Parameters**, **Body**, or extra **Headers**

Tomba credentials are injected automatically — no manual header setup needed.

### Example 7: Company Intelligence Workflow

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
- In **Search Companies**, combine multiple filters (location, industry, size, technologies) for precise targeting
- Use **Custom API Call** to access any new Tomba endpoint without waiting for a dedicated node update
- The **HTTP Request** node with Tomba credentials works identically to Custom API Call — choose whichever fits your workflow
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

### Available Scripts

| Script      | Command                  | Description                              |
| ----------- | ------------------------ | ---------------------------------------- |
| Build       | `npm run build`          | Compile the node for production          |
| Watch       | `npm run build:watch`    | Watch for changes and recompile          |
| Dev         | `npm run dev`            | Run the node in development mode         |
| Lint        | `npm run lint`           | Check code for linting errors            |
| Lint Fix    | `npm run lint:fix`       | Automatically fix linting errors         |
| Release     | `npm run release`        | Create a new release                     |
| Pre-publish | `npm run prepublishOnly` | Run pre-release checks before publishing |

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
