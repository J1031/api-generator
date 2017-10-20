import $ from 'jquery';

export const toPromise = function ($promise) {
    return new Promise(function (resolve, reject) {
        $promise.then(resolve, reject);
    });
};

export const extend = $.extend;