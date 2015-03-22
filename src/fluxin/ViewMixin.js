var StreamHelpers = require('./StreamHelpers');

function createFor(Model, Intent) {
    return {
        componentWillMount: function () {
            //0. Part of init View
            //Creating and maintained some information about Model and Intent
            this.fluxin = {};
            this.fluxin.Model = Model;
            this.fluxin.Intent = Intent;

            //Setup displaynames for the Intent and Model Component is a displayName was given.
            var prefix = this.constructor.displayName || '';
            this.fluxin.Intent.displayName = prefix + 'Intent';
            this.fluxin.Model.displayName = prefix + 'Model';

            //The initialized model and intent
            //1. Init Intent
            this.fluxin.intent = new Intent();
            //2. Init Model
            this.fluxin.model = new Model();

            //3a. Creating View stream
            //The output stream from the view. This stream is consumed by the intent.
            this.getOutput = StreamHelpers.getOutput.bind(this);

            //A simplified/shorthand version for pushing to the output stream
            this.push = StreamHelpers.push.bind(this);

            //Creates a named eventhandler, should be used for creating events intended for the intent.
            this.namedEvent = StreamHelpers.namedEvent.bind(this);

            //Creates the shorthand listenTo
            this.listenTo = StreamHelpers.listenTo.bind(this);

            //Creates handleEvent, if not present, so every component keeps a similar interface
            this.handleEvent = this.handleEvent || function () {
                this.setState.apply(this, arguments);
            }.bind(this);

            //3b. Creation of View stream and connection to Intent handler
            this.getOutput().then(this.fluxin.intent.handleEvent.bind(this.fluxin.intent));

            //4. Creation of Intent stream and connection to Modal handler
            this.fluxin.intent.getOutput().then(this.fluxin.model.handleEvent.bind(this.fluxin.model));

            //5. Creation of Model stream and connection to View handler
            this.fluxin.model.getOutput().then(this.handleEvent);

            //6. Retrieve initial state from model
            var initialModalState = this.fluxin.model.getInitialData(this.props);
            this.fluxin.model.state = initialModalState || {};
            this.setState(initialModalState);
        }
    };
}
var ViewMixin = {
    createFor: createFor
};


module.exports = ViewMixin;