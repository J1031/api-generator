export const toPromise = function ($promise) {
    return new Promise(function (resolve, reject) {
        $promise.then(resolve, reject);
    });
};

export const extendDeep = function () {
    let target = arguments[0];
    for(let i = 1;i < arguments.length;i++) {
        let source = arguments[i];
        for (let prop in source)
            if (prop in target && typeof(target[prop]) === 'object' && typeof(source[prop]) === 'object')
                extendDeep(target[prop], source[prop]);
            else
                target[prop] = source[prop];
    }
    return target;
}