module.exports = {
    yiq: function (hexcolor) {
        var r = parseInt(hexcolor.substr(0,2),16);
        var g = parseInt(hexcolor.substr(2,2),16);
        var b = parseInt(hexcolor.substr(4,2),16);
        return ((r*299)+(g*587)+(b*114))/1000; // 0->255 (dark->light)
    },
    isLight: function (hexcolor) {
        return (parseInt(hexcolor, 16) > 0xffffff/2);
    }
};