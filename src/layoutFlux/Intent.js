var Fluxin = require('fluxin');

var Intent = Fluxin.createIntent({
    getEventRouter: function(){
        var routes = {};

        routes['update'] = this.update;

        return routes;
    },
    update: function(event){
        this.pushNamed('buttonClick', 'ThePayload');
    }
});

module.exports = {
    type: Intent,
    instance: new Intent()
};