var React = require('react');
var Fluxin = require('./fluxin');

var KnaggInput = React.createClass({
    mixins: [Fluxin.Mixin],
    getInitialState: function () {
        return {
            text: this.props.text || 'Initial'
        };
    },
    getModelDefinition: function Model() {
        console.log('new model');
        var text = '';
        this.handleInput = function (data) {
            text += data.text;
            this.getOutput().push({text: text});
        }
    },
    getIntentDefinition: function Intent() {
        this.handleInput = function (event) {
            if (event.type == 'click') {
                this.getOutput().push(
                    {text: 'click'}
                );
            } else {
                this.getOutput().push({text: event.target.value});
            }
        }
    },
    render: function () {
        return <h1>a{this.state.text}</h1>;
    }
});

module.exports = KnaggInput;