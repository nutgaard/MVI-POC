var Fluxin = require('./../Fluxin');
var ViewAction = require('./Action').viewActions;
var Model = require('./Model');
var Intent = require('./Intent');

var View = Fluxin.createView(Model, Intent, {
    render: function () {
        return (
            <div>
                <button onClick={this.namedEvent(ViewAction.buttonclick)}>Add to header</button>
            {this.state.text}
            </div>
        );
    }
});


module.exports = View;