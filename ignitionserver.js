
// Ignition Hacks v6
// Basic Deno server

const status_NOT_FOUND = 404;
const status_OK = 200;

async function retrieveFileData(path) {
    var contents, status, contentType;
    
    try {
        contents = await Deno.readFile("./www" + path);
        status = status_OK;
        contentType = "text/html"; // temporary placeholder-- might not be necessary
    } catch (error) {
        contents = `<html>
                    <head>
                    <title>${title}</title>
                    </head>
                    <body>
                    <h1>Page not found</h1>
                    </body>`;
        status = status_NOT_FOUND;
        contentType = "text/html";
    }
    
    return { contents, status, contentType };
}

async function handler(req) {

    var originalPath = new URL(req.url).pathname;    
    var path = originalPath;
    
    if (path === "/") {
        path = "/index.html";
    }
    
    var r = await retrieveFileData(path);

    console.log(`${r.status} ${req.method} ${r.contentType} ${originalPath}`); 

    return new Response(r.contents,
                        {status: r.status,
                         headers: {
                             "content-type": r.contentType,
                         }});
}

Deno.serve(handler);