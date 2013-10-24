var _ = require('lodash');
var rgb2hsl = require('color-convert').rgb2hsl;

var util = module.exports = {};

util.isStandalone = function() {
    return ('standalone' in window.navigator) && (window.navigator.standalone === true);
};

util.pick = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
};

util.hex2rgb = _.memoize(function (hex) {
    return [
        parseInt(hex.substr(0, 2), 16),
        parseInt(hex.substr(2, 2), 16),
        parseInt(hex.substr(4, 2), 16)
    ];
});

util.hex2hsl = _.memoize(function (hex) {
    return rgb2hsl(util.hex2rgb(hex));
});

util.hexHue = _.memoize(function (hex) {
    return util.hex2hsl(hex)[0];
});

function fnIsHueInRange(min, max) {
    return function (hex) {
        var hue = util.hexHue(hex);

        if (min > max) {
            return hue >= min || hue <= max;
        }

        return hue >= min && hue <= max;
    };
}

util.isOrange = _.memoize(fnIsHueInRange(14, 44));
util.isYellow = _.memoize(fnIsHueInRange(45, 59));
util.isGreen = _.memoize(fnIsHueInRange(60, 164));
util.isBlue = _.memoize(fnIsHueInRange(165, 239));
util.isPurple = _.memoize(fnIsHueInRange(240, 314));
util.isRed = _.memoize(fnIsHueInRange(315, 14));

util.hexColorGroup = _.memoize(function (hex) {
    if (util.isOrange(hex)) {
        return 'orange';
    } else if (util.isYellow(hex)) {
        return 'yellow';
    } else if (util.isOrange(hex)) {
        return 'orange';
    } else if (util.isGreen(hex)) {
        return 'green';
    } else if (util.isBlue(hex)) {
        return 'blue';
    } else if (util.isPurple(hex)) {
        return 'purple';
    }
    return 'red';
});

util.hexesInSameColorGroup = function (hexA, hexB) {
   return util.hexColorGroup(hexA) === util.hexColorGroup(hexB);
};

util.yiq = _.memoize(function (hex) {
    var rgb = util.hex2rgb(hex);

    return ((rgb[0]*299)+(rgb[1]*587)+(rgb[2]*114))/1000; // 0->255 (dark->light)
});

util.isLight = _.memoize(function (hex) {
    return (parseInt(hex, 16) > 0xffffff/2);
});