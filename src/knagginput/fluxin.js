var Fjs = require('f-js');
var F = Fjs.F;
var P = Fjs.P;


Function.prototype.inheritsFrom = function (parentClass) {
    this.prototype = Object.create(parentClass.prototype);
    return this;
}

function Base() {
}
Base.prototype.setInput = function (component) {
    component.getOutput().then(this.handleInput.bind(this));
};
Base.prototype.handleInput = function () {
    throw "" + this.constructor + " did not implement handleInput";
};
Base.prototype.getOutput = function () {
    if (this.output === undefined) {
        this.output = F.stream();
    }
    return this.output;
};

window.Base = Base;

var Mixin = {
    componentWillMount: function () {
        var Model = this.getModelDefinition;
        var Intent = this.getIntentDefinition;

        Model.inheritsFrom(Base);
        Intent.inheritsFrom(Base);

        var model = new Model();
        var intent = new Intent();

        model.setInput = Base.prototype.setInput;
        model.getOutput = Base.prototype.getOutput;

        intent.setInput = Base.prototype.setInput;
        intent.getOutput = Base.prototype.getOutput;

        this.getModel = function () {
            return model;
        };
        this.getIntent = function () {
            return intent;
        };
        this.getView = function () {
            return this;
        };

        this.setInput = Base.prototype.setInput;
        this.getOutput = Base.prototype.getOutput;
        this.handleInput = function (message) {
            console.log('message');
            this.setState(message);
        }.bind(this);

        model.setInput(intent);
        intent.setInput(this);
        this.setInput(model);
    }
};

module.exports = {
    Base: Base,
    Mixin: Mixin
}