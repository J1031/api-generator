export const power = (arr) => {
    const size = 1 << arr.length;

    const ret = [];

    for (let idx = 0; idx < size; idx++) {
        let row = [];
        for (let i = 0, n = idx; n; n >>>= 1, i++) if (n & 1) row.push(arr[i]);
        ret.push(row);
    }

    return ret;
}