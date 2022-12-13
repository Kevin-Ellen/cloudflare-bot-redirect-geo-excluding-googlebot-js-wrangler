# 👷 Worker that redirects all user-agents except a few that are defined in an array
The Worker will redirect all requests based on the geographical location of the request, with the exception user-agents that are defined in an array.

## Exceptions / Array
The user-agents are matched against strings in the array. The match is loose and based on partial matching, meaning that it should be Evergreen and compatible with updates to the various (bot) user-agents.

### Entries
User-agents containing the following strings are excluded:
* `googlebot`
* `bingbot`
* `test-abc`
* `screamingfrog`

## Deployment
* Cloudflare Wrangler

## Development language
* JavaScript

## Testing

### To get redirected:
1. Ensure your user-agent is not excluded from the redirect
2. Make a request to https://cloudflare-bot-redirect-geo-excluding-googlebot-js-wrangler.boxlab.workers.dev/
3. Confirm you have been redirected, destination as below
   *  UK users: 
   *  Non-UK users: 

### Not to get redirected:
1. Ensure your user-agent is not excluded from the redirect
   * Can set this in the Network Conditions panel in Chrome
   * Example user-agent: `Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)`
2. Make a request to https://cloudflare-bot-redirect-geo-excluding-googlebot-js-wrangler.boxlab.workers.dev/
3. You should see the page with links


## Files
* [src/index.js](src/index.js) - the Cloudflare Worker

## Documentation
* **Cloudflare Workers**: https://developers.cloudflare.com/workers
* **Cloudflare Workers Examples**: https://developers.cloudflare.com/workers/examples
* **Cloudflare Workers Examples - Country code redirect:** https://developers.cloudflare.com/workers/examples/country-code-redirect/
* **Cloudflare Wrangler**: https://github.com/cloudflare/wrangler
* **Dev.to: Country code from Cloudflare:** https://dev.to/0xbf/get-country-code-from-request-proxied-by-cloudflare-4eeg

## Developed by
Kevin Ellen, Global Director of Web Experience & Organic Innovation