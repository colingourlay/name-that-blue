var crel = require('crel');
var fastClickAttach = require('fastclick');

var brandColors = require('./brand-colors');
var util = require('./util');

var colorGroups = [];
for (var colorGroup in brandColors) {
    if (brandColors.hasOwnProperty(colorGroup)) {
        colorGroups.push(colorGroup);
    }
}
var numColorGroups = colorGroups.length;

fastClickAttach(document.body);

document.ontouchmove = function (e) {
    e.preventDefault();
};

if (util.isStandalone()) {
    document.body.className += ' standalone';
}


var app = {};

app.el = crel('section', {id: 'app', class: 'app'});
document.body.appendChild(app.el);

var navEl = crel('div', {'class': 'nav'},
    crel('h1', 'Name That Blue'),
    crel('a', {href:'.'}, 'New Game'),
    crel('a', {href:'http://twitter.com/NameThatBlue', target: '_blank'}, 'Follow @NameThatBlue'),
    crel('a', {href:'https://www.facebook.com/NameThatBlue', target: '_blank'}, 'Like Facebook Page'),
    crel('a', {href:'http://colin-gourlay.com/', target: '_blank', 'class': 'credit'}, 'Colin Gourlay ' + (new Date()).getFullYear())
);
document.body.appendChild(navEl);
var navToggleEl = crel('a', {'class': 'nav_toggle'}, crel('div', {'class': 'nav_toggle__icon'}));
navToggleEl.onclick = function () {
    navEl.className = 'nav' + (navEl.className.length > 3 ? '' : ' nav-open');
    navToggleEl.className = 'nav_toggle' + (navToggleEl.className.length > 14 ? '' : ' nav_toggle-active');
};
document.body.appendChild(navToggleEl);

var allColorsEnabled = false;
var numAttempted = 0;
var numCorrect = 0;

function getChoices() {
    var brand, brands, numBrands, indexA, indexB;

    var colorGroup = allColorsEnabled ? colorGroups[Math.floor(Math.random() * numColorGroups)] : 'blues';

    if (!getChoices[colorGroup]) {
        getChoices[colorGroup] = [];
        for (brand in brandColors[colorGroup]) {
            if (brandColors[colorGroup].hasOwnProperty(brand)) {
                getChoices[colorGroup].push(brand);
            }
        }
    }

    brands = getChoices[colorGroup];
    numBrands = brands.length;

    indexA = Math.floor(Math.random() * numBrands);
    indexB = indexA;

    while (indexA === indexB) {
        indexB = Math.floor(Math.random() * numBrands);
    }

    return {
        correct: {
            brand: brands[indexA],
            color: brandColors[colorGroup][brands[indexA]]
        },
        incorrect: {
            brand: brands[indexB],
            color: brandColors[colorGroup][brands[indexB]]
        }

    };
}

function nextRound() {

    var coin = Math.random() > 0.5;
    var choices = getChoices();

    var choiceA = coin ? choices.correct : choices.incorrect;
    var choiceB = coin ? choices.incorrect : choices.correct;

    var choiceAEl = crel('a', choiceA.brand);
    var choiceBEl = crel('a', choiceB.brand);
    var orEl = crel('p', 'or');

    var enableAllColorsEl = crel('a', {'class': 'enable-all-colors'}, 'Want more than blues?');

    var onChoose = function () {
        var isCorrect = (this.textContent || this.innerText) === choices.correct.brand;

        if (isCorrect) {
            numCorrect++;
        }
        numAttempted++;

        app.el.innerHTML = "";

        var result = isCorrect ? 'Correct!' : 'Nope, it\'s ' + choices.correct.brand;
        var resultEl = crel('a', {'class': 'result'}, result);
        app.el.appendChild(resultEl);

        var numEl = crel('p', '' + numCorrect + ' / ' + numAttempted + ' correct');
        app.el.appendChild(numEl);

        setTimeout(nextRound, 2000);
    };

    var onEnableAllColors = function () {
        allColorsEnabled = true;

        app.el.innerHTML = "";

        var resultEl = crel('a', {'class': 'result'}, 'You asked for it...');
        app.el.appendChild(resultEl);
        setTimeout(nextRound, 2000);
    };

    choiceAEl.onclick = onChoose;
    choiceBEl.onclick = onChoose;
    enableAllColorsEl.onclick = onEnableAllColors;

    app.el.innerHTML = "";
    document.body.style.backgroundColor = '#' + choices.correct.color;
    // document.body.className = util.yiq(choices.correct.color) > 200 ? 'light' : 'dark';

    setTimeout(function () {
        app.el.appendChild(choiceAEl);
        app.el.appendChild(orEl);
        app.el.appendChild(choiceBEl);
        if (!allColorsEnabled && numAttempted > 4) {
            app.el.appendChild(enableAllColorsEl);
        }
    }, 250);
}

nextRound();