const generatePattern = (prefix, number) => {
    let paddedNumber = String(number).padStart(4, '0');
    return `${prefix}${paddedNumber}`;
};

module.exports = {
    generatePattern
};
