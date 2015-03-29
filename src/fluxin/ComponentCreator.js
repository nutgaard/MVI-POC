var StreamHelpers = require('./StreamHelpers');
var assign = Object.assign || require('object.assign');

function createComponent(options, defaultOptions) {
    var workingOptions = assign({}, defaultOptions, options);

    function Component() {
        if (!this.getEventRouter) {
            console.error(Object.getPrototypeOf(this), 'did not define a event router.');
            throw "Components must define a function #getEventRouter() returning the event routes.";
        }

        createEventHandler.bind(this)();
    }

    Component.prototype.getOutput = StreamHelpers.getOutput;
    Component.prototype.push = StreamHelpers.push;
    Component.prototype.listenTo = StreamHelpers.listenTo;

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
        (routes[event.name] || dummy).apply(this, event.payload);
    }.bind(this);
}


var Component = {
    create: createComponent
};

module.exports = Component;