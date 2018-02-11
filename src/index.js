import * as Comb from './util/Comb';
import {doRequest} from "./requestor/index";
import {extend} from "./util/index";

const METHOD_NAMES = ['GET', 'POST', 'PUT', 'DELETE'];

/**
 * config metadata key
 * @type {string}
 */
export const KEY_METADATA = '_';

/**
 * metadata order key
 * @type {string}
 */
export const KEY_METADATA_ORDER = 'order';

/**
 * url processors key
 * @type {string}
 */
export const KEY_METADATA_URL_PROCESSORS = 'urlProcessors';

/**
 * data processors key
 * @type {string}
 */
export const KEY_METADATA_DATA_PROCESSORS = 'dataProcessors';

/**
 * lowest order value which is the last key
 * @type {number}
 */
export const METADATA_ORDER_LOWEST = 9999;

/**
 * default for config
 * @type {string}
 */
export const KEY_CFG_DEFAULT = 'defConfig';

/**
 * suffix configs
 * @type {string}
 */
export const KEY_CFG_SUFFIX = 'sufConfigs';

/**
 * method prefix, default to 'json'
 * @type {string}
 */
export const KEY_CFG_METHOD_PREFIX = 'methodPrefix';

export const wrap = (config) => {
    const defConfig = config[KEY_CFG_DEFAULT] || {};
    const sufConfigs = config[KEY_CFG_SUFFIX] || {};
    const methodPrefix = config[KEY_CFG_METHOD_PREFIX] || 'json';

    const getConfigOrder = (configKey) => {

        if (sufConfigs[configKey] && sufConfigs[configKey][KEY_METADATA]) {
            return sufConfigs[configKey][KEY_METADATA][KEY_METADATA_ORDER] || METADATA_ORDER_LOWEST;
        }
        return METADATA_ORDER_LOWEST;
    };

    const sortedSufConfigKeys = Object.keys(sufConfigs).sort(function (configA, configB) {
        const orderA = getConfigOrder(configA);
        const orderB = getConfigOrder(configB);

        return orderA - orderB;
    });

    return METHOD_NAMES
        .reduce((fns, method) => {
            return Comb.power(sortedSufConfigKeys)
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

    const mergedConfig = opts[KEY_METADATA] || {};
    delete opts[KEY_METADATA];

    return function (url, data, options) {

        url = getUrl(url, mergedConfig);

        data = getData(data, mergedConfig);

        return doRequest(method, opts, mergedConfig, url, data, options)
            .then(data => {
                if (data instanceof String) {
                    data = JSON.parse(data)
                }

                return data;
            });
    };
}

function getUrl(url, mergedConfig) {

    const urlProcessors = mergedConfig[KEY_METADATA_URL_PROCESSORS];
    if (urlProcessors) {
        return Object.keys(urlProcessors)
            .reduce(function (url, processorName) {
                return urlProcessors[processorName](url);
            }, url);
    }

    return url;
}

function getData(data, mergedConfig) {

    const processors = mergedConfig[KEY_METADATA_DATA_PROCESSORS];
    if (processors) {
        return Object.keys(processors)
            .reduce(function (data, processorName) {
                return processors[processorName](data);
            }, data);
    }

    return data;
}

const getConfigForSufs = (sfs, sufConfigs, defConfig) => {

    return sfs.reduce(function (result, suf) {
        return extend(true, {}, result, sufConfigs[suf])
    }, {...defConfig})
};