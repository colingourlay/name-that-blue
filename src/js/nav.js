var crel = require('crel');

module.exports = function (document) {
    var navEl, toggleEl;

    navEl = crel('div', {'class': 'nav'},
        crel('h1', 'Name That Blue'),
        crel('a', {href:'.'}, 'New Game'),
        crel('a', {href:'http://twitter.com/NameThatBlue', target: '_blank'}, 'Follow @NameThatBlue'),
        crel('a', {href:'https://www.facebook.com/NameThatBlue', target: '_blank'}, 'Like Facebook Page'),
        crel('a', {href:'http://colin-gourlay.com/', target: '_blank', 'class': 'credit'}, 'Colin Gourlay ' + (new Date()).getFullYear())
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