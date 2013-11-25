var crel = require('crel');

var colorSets = require('./color-sets');

module.exports = function (document) {
    var currentColorSet, navEl, toggleEl;

    if (location.search && colorSets[location.search.substr(1)]) {
        currentColorSet = location.search.substr(1);
    }

    navEl = crel('div', {'class': 'nav'},
        crel('h1', 'Name That Blue'),
        crel('a', {href: '.', 'class': (!currentColorSet || currentColorSet === 'tech-brands') ? 'current' : ''}, 'Tech Brands'),
        crel('a', {href: '?nfl-teams', 'class': currentColorSet === 'nfl-teams' ? 'current' : ''}, 'NFL Teams'),
        crel('a', {href: '?nhl-teams', 'class': currentColorSet === 'nhl-teams' ? 'current' : ''}, 'NHL Teams'),
        crel('a', {href: 'http://twitter.com/NameThatBlue', target: '_blank', 'class': 'twitter'}, '@NameThatBlue'),
        crel('a', {href: 'https://www.facebook.com/NameThatBlue', target: '_blank', 'class': 'facebook'}, 'FB.com/NameThatBlue'),
        crel('a', {href: 'http://colin-gourlay.com/', target: '_blank', 'class': 'credit'}, 'Colin Gourlay ' + (new Date()).getFullYear())
    );

    toggleEl = crel('a', {'class': 'nav_toggle'}, crel('div', {'class': 'nav_toggle__icon'}));
    toggleEl.onclick = function toggle() {
        navEl.className = 'nav' + (navEl.className.length > 3 ? '' : ' nav-open');
        toggleEl.className = 'nav_toggle' + (toggleEl.className.length > 14 ? '' : ' nav_toggle-active');
    };

    document.body.appendChild(navEl);
    document.body.appendChild(toggleEl);

    return {
        navEl: navEl,
        toggleEl: toggleEl
    };

};