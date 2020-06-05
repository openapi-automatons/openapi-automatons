import {Method} from "@automatons/tools/dist";
import {ReceiveMethod} from "../types";

export const isReceive = (method: Method): method is ReceiveMethod => ['get', 'head', 'delete', 'options', 'trace'].includes(method);
