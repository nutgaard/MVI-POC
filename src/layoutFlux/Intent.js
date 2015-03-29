var Fluxin = require('fluxin');

var Intent = Fluxin.createIntent({
    getEventRouter: function(){
        var routes = {};

        routes['update'] = this.update;

        return routes;
    },
    update: function(){
        this.pushNamed('buttonClick', 'ThePayload', 'Arg2', 'Arg3');
    }
});

module.exports = {
    type: Intent,
    instance: new Intent()
};