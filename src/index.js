/*
  Using Cloudflare workers to redirect a user based on their location (according to Cloudflare).

  Certain user-agents are excluded from this redirect.
*/

// Creating the array with the strings of user-agents we want to exclude
const excludeArray = [
  `googlebot`,
  `bingbot`,
  `test-abc`,
  `screamingfrog`
];

// Object with 3 pages, so we can quickly create the pages on the fly.
const pages = {
  index: {
    status:200,
    title: `Link selector page - Not redirected - Geo-redirect-exlcusion-test`,
    canonical: `https://cloudflare-bot-redirect-geo-excluding-googlebot-js-wrangler.boxlab.workers.dev/`,
    html: `<h1>You have not been redirected!</h1>
    <p>Your user-agent contains one of the following strings:</p>
    <ul>
      ${excludeArray.map(item => `<li>${item}</li>`).join('')}
    </ul>
    <p>These are links to the other pages:</p>
    <ul>
      <li><a href="/uk">United Kingdom</a></li>
      <li><a href="/other">Other countries</a></li>
    </ul>`
  },
  uk: {
    status: 200,
    title: `UK page - Geo-redirect-exlcusion-test`,
    canonical: `https://cloudflare-bot-redirect-geo-excluding-googlebot-js-wrangler.boxlab.workers.dev/uk`,
    html: `<h1>UK page</h1>
    <p>You are currently seeing the UK page now.</p>`
  },
  other: {
    status: 200,
    title: `Other page - Geo-redirect-exlcusion-test`,
    canonical: `https://cloudflare-bot-redirect-geo-excluding-googlebot-js-wrangler.boxlab.workers.dev/other`,
    html: `<h1>Other page</h1>
    <p>You are currently seeing the other countries page now.</p>`
  },
  notFound: {
    status: 404,
    title: `Not found!`,
    html: `<h1>Page not found</h1>
    <p>Return to <a href="/">Home</a>.</p>`
  }

}

// Provide a response to the 'fetch' event - Gotta start somewhere!
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// Now let's do something with the event and provide a response!
const handleRequest = async (request) => {
  
  // Store the request URL as an URL object
  const url = new URL(request.url);

  // We need to first make sure that the request is not to the root. If it is not to the root, we show the content of the page. Normally we'd use a fetch() request, but as we don't have a page to fetch, we just simply create one on the fly.
  if(url.pathname !== '/'){

    // As the test is simple and small, we can easily create two if statements

    // UK page
    if(url.pathname === '/uk'){
      return response(pages.uk);
    }

    // Other page
    if(url.pathname === '/other'){
      return response(pages.other);
    }

    // No page found, let's 404
    return response(pages.notFound);

  }

  // The page is the root, so now we need to check whether the user-agent matches to any of the array entries.

  // Store the user-agent string
  const ua = request.headers.get('User-Agent') || '';

  // check if the UA string contains any of the values in exludeArray - If TRUE, we show the content, if FALSE we continue with the process. As we cannot directly return the new Response inside the some method for some reason, we will store the TRUE/null value.
  const matched = excludeArray.some(item => {

    // ensure to lowercase everything to avoid casing issues
    if(ua.toLowerCase().includes(item.toLowerCase())){
      return true;
    }
  });

  // If the UA matches in the array, show the page
  if(matched){
    return response(pages.index);
  }

  // We not know that our user-agent is not excluded from the redirects, we also know that the request is to the root page. So now we can use a geo-redirect.

  // We store the country of the request first
  const country = request.cf.country;

  // if the country is set to the UK (GB), redirect to the UK
  if(country === 'GB'){

    // Set the path to the UK:
    url.pathname = `/uk`;

    // Return the redirect - ensure that the redirect is a temporary redirect (302 is actually default, but we use a 307)
    return Response.redirect(url, 307);
  }

  // Anything else goes to 'the other page'

  // Set the path to /other
  url.pathname = `/other`;

  // Return the redirect - ensure that the redirect is a temporary redirect (302 is actually default, but we use a 307)
  return Response.redirect(url,307);
}

// Create a simple function to formulate a response, allowing for DRY
const response = (data) => new Response(
  `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>${data.title}</title>
      ${data.status === 200 ? `<link rel="canonical" href="${data.canonical}">` : ''}
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      ${data.html}
    </body>
  </html>`,
  {
    status:data.status,
    headers:{
      'content-type':'text/html',
      'x-robots-tag':'noindex'
    }
  }
);

