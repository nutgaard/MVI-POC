var React = require('react');
var F = require('f-js').F;
var assign = Object.assign || require('object.assign');

module.exports = {
    createModel: createModel,
    createView: createView,
    createIntent: createIntent
};

function createView(Model, Intent, options) {
    if (!options.hasOwnProperty('mixins')) {
        options.mixins = [];
    }

    options.mixins.push(createMixin(Model, Intent));

    return React.createClass(options);
}

function createMixin(Model, Intent) {
    return {
        componentWillMount: function () {
            //0. Part of init View
            //Creating and maintained some information about Model and Intent
            this.fluxin = {};
            this.fluxin.Model = Model;
            this.fluxin.Intent = Intent;

            //The initialized model and intent
            //1. Init Intent
            this.fluxin.intent = new Intent();
            //2. Init Model
            this.fluxin.model = new Model();

            //3a. Creating View stream
            //The output stream from the view. This stream is consumed by the intent.
            this.getOutput = getOutput.bind(this);

            //A simplified/shorthand version for pushing to the output stream
            this.push = push.bind(this);

            //Creates a named eventhandler, should be used for creating events intended for the intent.
            this.namedEvent = namedEvent.bind(this);

            //3b. Creation of View stream and connection to Intent handler
            this.getOutput().then(this.fluxin.intent.handleEvent.bind(this.fluxin.intent));

            //4. Creation of Intent stream and connection to Modal handler
            this.fluxin.intent.getOutput().then(this.fluxin.model.handleEvent.bind(this.fluxin.model));

            //5. Creation of Model stream and connection to View handler
            this.fluxin.model.getOutput().then(function () {
                this.setState.apply(this, arguments);
            }.bind(this));

            //6. Retrieve initial state from model
            var initialModalState = this.fluxin.model.getInitialData(this.props);
            this.fluxin.model.state = initialModalState;
            this.setState(initialModalState);
        }
    };
}

function createModel(options) {
    var defaultOptions = {
        getInitialData: function (props) {
            props = props || {};

            return props;
        },
        getEventRouter: function () {
            return {};
        }
    };
    var Model = createComponent(options, defaultOptions);
    Model.prototype.setState = function (newState) {
        this.state = assign(this.state, newState);
        this.push(newState);
    };

    return Model;
}


function createIntent(options) {
    var defaultOptions = {
        getEventRouter: function () {
            return {};
        }
    };

    var Intent = createComponent(options, defaultOptions);
    Intent.prototype.pushNamed = function (name, payload) {
        namedEvent.bind(this)(name)(payload);
    };

    return Intent;
}

function createComponent(options, defaultOptions) {
    var workingOptions = assign({}, defaultOptions, options);

    function Component() {
        createEventHandler.bind(this)();
    }

    Component.prototype.getOutput = getOutput;
    Component.prototype.push = push;

    for (option in workingOptions) {
        Component.prototype[option] = workingOptions[option];
    }

    return Component;
}

function createEventHandler() {
    var routes = this.getEventRouter();
    var dummy = function () {
    };
    this.handleEvent = function (event) {
        (routes[event.name] || dummy).bind(this)(event.payload);
    }.bind(this);
}
function getOutput() {
    if (this.outputStream === undefined) {
        this.outputStream = F.stream();
    }
    return this.outputStream;
}
function push() {
    this.getOutput().push.apply(this.getOutput(), arguments);
}
function namedEvent(name) {
    return function (event) {
        this.push({
            name: name,
            payload: event
        });
    }.bind(this);
}