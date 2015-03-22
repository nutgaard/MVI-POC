var Fluxin = require('fluxin');
var List = require('list');


var Layout = Fluxin.createClass({
    componentDidMount: function(){
        var oo = this.refs.oneone;
        var ot = this.refs.onetwo;
        var to = this.refs.twoone;
        var tt = this.refs.twotwo;

        oo.getOutput().then(ot.fluxin.intent.handleEvent.bind(ot));
        tt.fluxin.model.getOutput().then(to.setState.bind(to));
    },
    render: function () {
        return (
            <div>
                <div className="base one">
                    <h1>One</h1>
                    <List ref="oneone" header="Header1" />
                    <List ref="onetwo"/>
                </div>
                <div className="base two">
                    <h1>Two</h1>
                    <List ref="twoone" header="Header2" />
                    <List ref="twotwo"/>
                </div>
            </div>
        );
    }
});

module.exports = Layout;