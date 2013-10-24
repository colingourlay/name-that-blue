var _ = require('lodash');
var crel = require('crel');
var fastClickAttach = require('fastclick');

var colorSets = require('./color-sets');
var util = require('./util');

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

// Add nav & toggle
var nav = require('./nav')(document);

var allColorsEnabled = false;
var numAttempted = 0;
var numCorrect = 0;
var currentColorSet = 'tech-brands';

if (location.search && colorSets[location.search.substr(1)]) {
    currentColorSet = location.search.substr(1);
}

var choicesFilter = function (set) {
    return function (name) {
        return allColorsEnabled ? true : util.isBlue(set[name]);
    };
};

function getChoices(set) {
    var correctNameCandidtes, correctName, incorrectNameCandidtes, incorrectName;

    correctNameCandidtes = _.filter(_.keys(set), choicesFilter(set));

    if (correctNameCandidtes.length < 2) {
        throw new Error('Color set is too small to play with');
    }

    correctName = util.pick(correctNameCandidtes);

    incorrectNameCandidtes = _.filter(correctNameCandidtes, function (name) {
        return name !== correctName && util.hexesInSameColorGroup(set[correctName], set[name]);
    });

    if (incorrectNameCandidtes.length < 1) {
        throw new Error('Color group is too small to play with');
    }

    incorrectName = util.pick(incorrectNameCandidtes);

    return {
        correct: {
            name: correctName,
            color: set[correctName]
        },
        incorrect: {
            name: incorrectName,
            color: set[incorrectName]
        }

    };
}

function nextRound() {

    var coin = Math.random() > 0.5;
    var choices = getChoices(colorSets[currentColorSet]);

    var choiceA = coin ? choices.correct : choices.incorrect;
    var choiceB = coin ? choices.incorrect : choices.correct;

    var choiceAEl = crel('a', choiceA.name);
    var choiceBEl = crel('a', choiceB.name);
    var orEl = crel('p', 'or');

    var enableAllColorsEl = crel('a', {'class': 'enable-all-colors'}, 'Want more than blues?');

    var onChoose = function () {
        var isCorrect = (this.textContent || this.innerText) === choices.correct.name;

        if (isCorrect) {
            numCorrect++;
        }
        numAttempted++;

        app.el.innerHTML = "";

        var result = isCorrect ? 'Correct!' : 'Nope, it\'s ' + choices.correct.name;
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