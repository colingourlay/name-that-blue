var test = require('tap').test;
var _ = require('lodash');

var colorSets = require('../src/js/color-sets');
var util = require('../src/js/util');

test('make sure every item in every set can be paired', function (t) {
    _.each(colorSets, function (set, setName) {
        t.test('make sure every item in the ' + setName + ' set can be paired', function (t) {
            _.each(set, function (colorA, nameA) {
                var pairable = _.filter(set, function (colorB, nameB) {
                    return nameA !== nameB &&
                        colorA !== colorB &&
                        util.hexesInSameColorGroup(colorA, colorB);
                });
                t.ok(pairable.length > 0, pairable.length + ' pairs for ' + nameA + ' in ' + setName);
            });
            t.end();
        });
    });
    t.end();
});