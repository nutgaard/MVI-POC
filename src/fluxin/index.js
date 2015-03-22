var React = require('react');
var assign = Object.assign || require('object.assign');

var StreamHelpers = require('./StreamHelpers');
var ComponentCreator = require('./ComponentCreator');
var ViewMixin = require('./ViewMixin');

module.exports = {
    createModel: createModel,
    createView: createView,
    createIntent: createIntent,

    //React Top-Level API
    Component: React.Component,
    createClass: React.createClass,
    createElement: React.createElement,
    cloneElement: React.cloneElement,
    createFactory: React.createFactory,
    render: React.render,
    unmountComponentAtNode: React.unmountComponentAtNode,
    renderToString: React.renderToString,
    renderToStaticMarkup: React.renderToStaticMarkup,
    isValidElement: React.isValidElement,
    findDOMNode: React.findDOMNode,
    DOM: React.DOM,
    PropTypes: React.PropTypes,
    initializeTouchEvents: React.initializeTouchEvents,
    Children: React.Children
};

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

    Intent.prototype.pushNamed = function (name, payload) {
        StreamHelpers.namedEvent.bind(this)(name)(payload);
    };

    return Intent;
}