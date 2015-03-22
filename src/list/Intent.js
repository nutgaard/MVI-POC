var Fluxin = require('fluxin');
var Actions = require('./Action');

module.exports = Fluxin.createIntent({
    getEventRouter: function () {
        var routes = {};

        routes[Actions.viewActions.buttonclick] = this.clickHandler;

        return routes;
    },
    clickHandler: function () {
        this.pushNamed(Actions.intentActions.addText, 'click');
    }
});