var Fluxin = require('fluxin');
var List = require('list');


var Layout = Fluxin.createClass({
    componentDidMount: function(){
        var first = this.refs.first;
        var second = this.refs.second;
        var third = this.refs.third;
        var fourth = this.refs.fourth;

        second.fluxin.intent.listenTo(first);
        third.listenTo(fourth.fluxin.model);
    },
    render: function () {
        return (
            <div>
                <div className="base one">
                    <h1>One</h1>
                    <List ref="first" header="Header1" />
                    <List ref="second"/>
                </div>
                <div className="base two">
                    <h1>Two</h1>
                    <List ref="third" header="Header2" />
                    <List ref="fourth"/>
                </div>
            </div>
        );
    }
});

module.exports = Layout;