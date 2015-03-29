var F = require('./../f-js').F;

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
    var extraArgs = Array.prototype.slice.call(arguments, 1);

    return function (rawPayload) {
        var payload = [];
        if (rawPayload) {
            payload.push(rawPayload);
        }
        payload = payload.concat(extraArgs);

        this.push({
            name: name,
            payload: payload
        });
    }.bind(this);
}
function listenTo(component, assertUnique) {
    this.fluxin = this.fluxin || {};
    this.fluxin.streamBinding = this.fluxin.streamBinding || [];

    var enforceUnique = true;
    if (assertUnique === false) {
        enforceUnique = assertUnique;
    }

    var stream = component.getOutput();
    if (enforceUnique && this.fluxin.streamBinding.indexOf(stream) !== -1) {
        return;
    }
    stream.then(this.handleEvent);
    this.fluxin.streamBinding.push(stream);
}

var StreamHelpers = {
    getOutput: getOutput,
    push: push,
    namedEvent: namedEvent,
    listenTo: listenTo
};

module.exports = StreamHelpers;