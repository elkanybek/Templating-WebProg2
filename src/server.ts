import http, { IncomingMessage, ServerResponse } from "http";
import { promises as fs } from "fs";
import { routes } from "./router";

const hostname = "127.0.0.1";
const port = 3000;

/**
 * A static file is a file that the client requests for
 * directly. This is anything with a valid file extension.
 * Within the context of the web, this is usually .html,
 * .css, .js, and any image/video/audio file types.
 */
const serveStaticFile = async (url: string, res: ServerResponse) => {
    const filePath = `.${url}`;
    const file = await fs.readFile(filePath, "utf-8");

    return res.end(file, "utf-8");
};

const handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
    console.log(`${req.method} ${req.url}`);

    /**
     * The favicon.ico request is a request for a website's icon.
     * The browser sends this request automatically when you visit a website.
     * It's not relevant for our application, so we can ignore it.
     */
    if (req.url === "/favicon.ico") {
        return res.end();
    }

    /**
     * If the request is for a static file, serve it.
     * A static file is a file the ends with a valid file extension.
     * @example /index.html
     */
    if (req.url?.match(/.*\..*/)) {
        return await serveStaticFile(req.url, res);
    }

    // Determine the route handler to use.
    let url = req.url?.startsWith("/pokemon/") ? "/pokemon/:id" : req.url;
    url = url?.split("?")[0]; // Get rid of query parameters.
    const handler = routes[req.method!][url!];

    // If the route handler exists, call it.
    if (handler) {
        await handler(req, res);
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Route not found" }, null, 2));
    }
};

const server = http.createServer(handleRequest);

// https://developer.mozilla.org/en-US/docs/Glossary/IIFE
(async () => {
    await server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
})();
