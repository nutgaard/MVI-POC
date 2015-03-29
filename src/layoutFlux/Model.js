var Fluxin = require('fluxin');

var Model = Fluxin.createModel({
    getInitialData: function (props) {
        props = props || {};

        return {
            text: props.text || 'Initial',
            header: props.header || 'Test'
        };
    },
    getEventRouter: function(){
        var routes = {};

        routes['buttonClick'] = this.buttonClick;

        return routes;
    },
    buttonClick: function(payload){
        this.setState({
            text: this.state.text + payload
        });
    }
});

module.exports = {
    type: Model,
    instance: new Model()
};