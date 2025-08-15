
// Ignition Hacks v6
// Basic Deno server for serving static web pages
// run using command: deno run --allow-read --allow-net ignitionserver.js

const status_NOT_FOUND = 404;
const status_OK = 200;

async function retrieveFileData(path) {
    var contents, status, contentType;
    
    try {
        contents = await Deno.readFile("./" + path);
        status = status_OK;
        contentType = "text/html"; // temporary placeholder-- might not be necessary
    } catch (error) {
        contents = `<html>
                    <head>
                    <title>Page not found</title>
                    </head>
                    <body>
                    <h1>Page not found</h1>
                    </body>`;
        status = status_NOT_FOUND;
        contentType = "text/html";
    }
    
    return { contents, status, contentType };
}

async function handler(request) {

    var originalPath = new URL(request.url).pathname;    
    var path = originalPath;
    
    if (path === "/") {
        path = "/index.html";
    }
    
    var response = await retrieveFileData(path);

    console.log(`${response.status} ${request.method} ${originalPath} ${path}`); 

    return new Response(response.contents, {status: 
                                        response.status,
                                        headers: {
                                            "content-type": response.contentType
                                        }
                                    }
    );
}

Deno.serve(handler);