import * as Comb from './util/Comb';
import {doRequest} from "./requestor/index";
import {extendDeep} from "./util/index";

const METHOD_NAMES = ['GET', 'POST', 'PUT', 'DELETE'];

export const wrap = (config) => {
    const defConfig = config['defConfig'] || {};
    const sufConfigs = config['sufConfigs'] || {};
    const methodPrefix = config['methodPrefix'] || 'json';

    return METHOD_NAMES
        .reduce((fns, method) => {
            return Comb.power(Object.keys(sufConfigs))
                .reduce((fs, sfs) => {
                    return {
                        ...fs,
                        [`${methodPrefix}${method}${sfs.join('')}`]: factory(method, getConfigForSufs(sfs, sufConfigs, defConfig))
                    };
                }, fns);
        }, {})
};

function factory(method, opts) {
    opts = opts || {};

    const mConfig = opts['_'] || {};
    delete opts['_'];

    return function (url, data, options) {

        url = getUrl(url, mConfig);

        return doRequest(method, opts, mConfig, url, data, options);
    };
}

function getUrl(url, mConfig) {

    const urlProcessors = mConfig['urlProcessors'];
    if (urlProcessors) {
        return Object.keys(urlProcessors)
            .reduce(function (url, processorName) {
                return urlProcessors[processorName](url);
            }, url);
    }

    return url;
}

const getConfigForSufs = (sfs, sufConfigs, defConfig) => {

    return sfs.reduce(function (result, suf) {
        return extendDeep({}, result, sufConfigs[suf])
    }, {...defConfig})
};