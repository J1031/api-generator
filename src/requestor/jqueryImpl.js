import $ from 'jquery';
import {toPromise} from "../util/index";

export const ajax = $['ajax'];

export const when = $['when'];

export function doRequest(method, opts, mConfig, url, data, options) {
    if (method === 'GET') {
        options = data;
        data = undefined;
    }

    options = options || {};
    let extras = {
        ...opts
    };

    if (!!data) {
        let data2Call = data;
        if (data instanceof FormData) {
            extras.contentType = false;
            extras.processData = false;
        } else if (data instanceof String) {
            extras.processData = false;
        } else {
            data2Call = JSON.stringify(data);
        }

        extras.data = data2Call;
    }

    return toPromise(ajax({
        url: url,
        type: method,
        contentType: 'application/json',
        ...extras,
        ...options,
    }));
}
