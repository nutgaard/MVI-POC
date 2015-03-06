var React = require('react');
var Fjs = require('f-js');
var F = Fjs.F;
var P = Fjs.P;
var assign = Object.assign || require('object.assign');

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
    console.log(this.constructor, 'did not override "handleInput".');
};
Base.prototype.getOutput = function () {
    if (this.output === undefined) {
        this.output = F.stream();
    }
    return this.output;
};

function Model() {
    Base.call(this);
    this.handleInput = function(interactionEvents){
        console.log('interactionEvents', interactionEvents)
        this.getOutput().push('[MODEL: '+interactionEvents+"]");
    }
}
Model.inheritsFrom(Base);

function View() {
    Base.call(this);
    this.handleInput = function(dataEvent){
        console.log('dataEvent', dataEvent);
    }
}
View.inheritsFrom(Base);

function Intent() {
    Base.call(this);
    this.handleInput = function(rawEvents){
        console.log('rawEvents', rawEvents);
        this.getOutput().push('[RAW: '+rawEvents+"]");
    }
}
Intent.inheritsFrom(Base);

model = new Model();
intent = new Intent();
view = new View();

model.setInput(intent);
intent.setInput(view);
view.setInput(model);


