var Fluxin = require('fluxin');
var IntentActions = require('./Action').intentActions;

module.exports = Fluxin.createModel({
    getInitialData: function (props) {
        props = props || {};

        return {
            text: props.text || 'Initial',
            header: props.header || 'Test'
        };
    },
    getEventRouter: function () {
        var routes = {};

        routes[IntentActions.addText] = this.addText;

        return routes;
    },
    addText: function (text) { //argument is the payload of the event. setState will update the initial state of the model, as well as pushing the update to the output stream
        this.setState({
            text: this.state.text + text
        });
    }
});