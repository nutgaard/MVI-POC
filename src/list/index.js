var Fluxin = require('fluxin');
var ViewAction = require('./Action').viewActions;
var Model = require('./Model');
var Intent = require('./Intent');

var View = Fluxin.createView(Model, Intent, {
    displayName: 'List', //Since the JSX transformation with displaynames only work with React.createClass
    render: function () {
        return (
            <div>
                <h2>{this.state.header}</h2>
                <button onClick={this.namedEvent(ViewAction.buttonclick)}>Add to header</button>
            {this.state.text}
            </div>
        );
    }
});


module.exports = View;