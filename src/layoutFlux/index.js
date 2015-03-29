var Fluxin = require('fluxin');
var Model = require('./Model');
var Intent = require('./Intent');
var List = require('list');

var model = Model.instance;
var intent = Intent.instance;

var Layout = Fluxin.createView(model, intent, {
    render: function () {
        return (
            <div>
                <button onClick={this.namedEvent('update', 'extraData. e.g element for an list iteration')}>Update</button>
                <span>{JSON.stringify(this.state)}</span>
            </div>
        );
    }
});

module.exports = Layout;