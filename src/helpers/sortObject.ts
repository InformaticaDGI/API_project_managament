export function sortObjectByValue(obj: Object) {
    const nonNumericValues = Object.keys(obj)
        .filter(key => isNaN(obj[key] as number))
        .map(key => ({ [key]: obj[key] }));
    const ordered = Object
        .keys(obj)
        .filter(key => !isNaN(obj[key] as number))
        .sort((a, b) => obj[b] - obj[a])
        .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
    return { ...ordered, ...Object.assign({}, ...nonNumericValues) };
}