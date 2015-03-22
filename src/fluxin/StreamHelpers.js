var F = require('F-js').F;

function getOutput() {
    this.fluxin = this.fluxin || {};

    if (this.fluxin.outputStream === undefined) {
        this.fluxin.outputStream = F.stream();
    }
    return this.fluxin.outputStream;
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
var StreamHelpers = {
    getOutput: getOutput,
    push: push,
    namedEvent: namedEvent
};

module.exports = StreamHelpers;