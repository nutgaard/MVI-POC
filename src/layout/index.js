var React = require('react');
var List = require('list');


var Layout = React.createClass({
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
                    <List ref="oneone"/>
                    <List ref="onetwo"/>
                </div>
                <div className="base two">
                    <h1>Two</h1>
                    <List ref="twoone"/>
                    <List ref="twotwo"/>
                </div>
            </div>
        );
    }
});

module.exports = Layout;