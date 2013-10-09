var crel = require('crel');
var colors = require('./colors');

var brands = [];
for (var brand in colors) {
    if (colors.hasOwnProperty(brand)) {
        brands.push(brand);
    }
}
var numBrands = brands.length;

function getChoices() {
    var indexA = Math.floor(Math.random() * numBrands);
    var indexB = indexA;

    while (indexA === indexB) {
        indexB = Math.floor(Math.random() * numBrands);
    }

    return {
        correct: {
            brand: brands[indexA],
            color: colors[brands[indexA]]
        },
        incorrect: {
            brand: brands[indexB],
            color: colors[brands[indexB]]
        }

    };
}

var app = {};

app.el = crel('div', {id: 'app', class: 'app'});
document.body.appendChild(app.el);

var numAttempted = 0;
var numCorrect = 0;

function nextRound() {

    var coin = Math.random() > 0.5;
    var choices = getChoices();

    var choiceA = coin ? choices.correct : choices.incorrect;
    var choiceB = coin ? choices.incorrect : choices.correct;

    var choiceAEl = crel('a', choiceA.brand);
    var choiceBEl = crel('a', choiceB.brand);
    var orEl = crel('p', 'or');

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

        /*
        var incorrectChoiceColorEl = crel('span');
        incorrectChoiceColorEl.style.backgroundColor = '#' + choices.incorrect.color;
        var incorrectChoiceEl = crel('p', choices.incorrect.brand + ' is ', incorrectChoiceColorEl);
        app.el.appendChild(incorrectChoiceEl);
        */

        var numEl = crel('p', '' + numCorrect + ' / ' + numAttempted + ' correct');
        app.el.appendChild(numEl);

        setTimeout(nextRound, 2000);
    };

    choiceAEl.onclick = onChoose;
    choiceBEl.onclick = onChoose;

    app.el.innerHTML = "";
    document.body.style.backgroundColor = '#' + choices.correct.color;

    setTimeout(function () {
        app.el.appendChild(choiceAEl);
        app.el.appendChild(orEl);
        app.el.appendChild(choiceBEl);
    }, 250);
}

nextRound();