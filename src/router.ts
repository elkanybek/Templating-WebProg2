import { IncomingMessage, ServerResponse } from "http";
import { getHome } from "./controller";

interface RouteHandler {
    (req: IncomingMessage, res: ServerResponse): void;
}

interface Routes {
    [method: string]: {
        [path: string]: RouteHandler;
    };
}

export const routes: Routes = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
};

routes.GET["/"] = getHome;
