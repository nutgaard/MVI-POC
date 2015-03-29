var React = require('react');
var assign = Object.assign || require('object.assign');

var StreamHelpers = require('./StreamHelpers');
var ComponentCreator = require('./ComponentCreator');
var ViewMixin = require('./ViewMixin');

var Fluxin = {
    createModel: createModel,
    createView: createView,
    createIntent: createIntent
};
for (var prop in React) {
    if (React.hasOwnProperty(prop)) {
        Fluxin[prop] = React[prop];
    }
}

module.exports = Fluxin;

function createView(Model, Intent, options) {
    if (!options.hasOwnProperty('mixins')) {
        options.mixins = [];
    }

    options.mixins.push(ViewMixin.createFor(Model, Intent));
    return React.createClass(options);
}

function createModel(options) {
    var defaultOptions = {
        getInitialData: function (props) {
            props = props || {};

            return props;
        }
    };
    var Model = ComponentCreator.create(options, defaultOptions);
    Model.prototype.setState = function (newState) {
        this.state = assign(this.state, newState);
        this.push(newState);
    };

    return Model;
}

function createIntent(options) {
    var Intent = ComponentCreator.create(options, {});

    Intent.prototype.pushNamed = function () {
        StreamHelpers.namedEvent.apply(this, arguments)();
    };

    return Intent;
}