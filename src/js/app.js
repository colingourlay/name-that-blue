var crel = require('crel');
var brandColors = require('./brand-colors');

var colorGroups = [];
for (var colorGroup in brandColors) {
    if (brandColors.hasOwnProperty(colorGroup)) {
        colorGroups.push(colorGroup);
    }
}
var numColorGroups = colorGroups.length;

var app = {};

app.bg2el = crel('div', {class: 'bg2'});
document.body.appendChild(app.bg2el);

app.el = crel('div', {id: 'app', 'class': 'app'});
document.body.appendChild(app.el);

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

    var choiceAEl = crel('a', {'class': 'color-choice'}, choiceA.brand);
    var choiceBEl = crel('a', {'class': 'color-choice'}, choiceB.brand);
    var orEl = crel('p', {'class': 'color-choice'}, choices.correct.brand);

    var enableAllColorsEl = crel('a', {'class': 'enable-all-colors'}, 'Want more than blues?');

    var onChoose = function () {
        var isCorrect = (this.textContent || this.innerText) === choices.correct.brand;

        if (isCorrect) {
            numCorrect++;
        }
        numAttempted++;

        app.el.innerHTML = "";

        var result = isCorrect ? 'Correct!' : 'Nope, that\'s ' + choices.incorrect.brand;
        var resultEl = crel('p', {'class': 'result color-choice'}, result);
        app.el.appendChild(resultEl);

        var numEl = crel('p', {'class': 'num color-choice'}, '' + numCorrect + ' / ' + numAttempted + ' correct');
        app.el.appendChild(numEl);

        setTimeout(nextRound, 2000);
    };

    var onEnableAllColors = function () {
        allColorsEnabled = true;

        app.el.innerHTML = "";

        var resultEl = crel('p', {'class': 'result color-choice'}, 'You asked for it...');
        app.el.appendChild(resultEl);
        setTimeout(nextRound, 2000);
    };

    choiceAEl.onclick = onChoose;
    choiceBEl.onclick = onChoose;
    enableAllColorsEl.onclick = onEnableAllColors;

    app.el.innerHTML = "";
    document.body.style.backgroundColor = '#' + choiceA.color;
    app.bg2el.style.backgroundColor = '#' + choiceB.color;

    setTimeout(function () {
        app.el.appendChild(choiceAEl);
        app.el.appendChild(choiceBEl);
        app.el.appendChild(orEl);
        if (!allColorsEnabled && numAttempted > 4) {
            app.el.appendChild(enableAllColorsEl);
        }
    }, 250);
}

nextRound();