# MVI-POC

MVI-POC (Name to be changed) is a small library (49KB unminified, 17KB minified) which tries to utilize the ideas outlined by Andre Medeiros' blogpost [reactive MVC and the virtual DOM](http://futurice.com/blog/reactive-mvc-and-the-virtual-dom).
At its very core the MVI (model-view-intent) describes a unidirectional dataflow (as flux) with the intent of creating application and components that are easier to reason with.

MVI-POC is uses [React](https://facebook.github.io/react/) for its virtual-DOM and rendering, but in order to archieve the *reactive* flow, as described in the blogpost, it uses [F.js](https://github.com/colin-dumitru/F.js).
A combination of react-mixins and by creating a thin wrapper around react it is possible to slightly extend the React top-level API and create a familiar way of creating components.


## Breakdown of the three components
It should be noted the the description below is taken from Medeiros' blogpost, but the concepts are still there.
The most prominent different is shown in MVI-POC's combination of the *view* and *renderer* components (react does both).

### Model
**Input**: user interaction events from the Intent. <br/>
**Output**: data events.

### View
**Input**: data events from the Model. <br />
**Output**: a Virtual DOM rendering of the model, and raw user input events (such as clicks, keyboard typing, accelerometer events, etc).

### Intent
**Input**: raw user input events from the View. <br />
**Output**: model-friendly user intention events.

## Simple Example
Some examples can be seen in */test* directory, including how components may communicate. But for brevity will show some usecases here as well.

### Creating a MVI component

#### Creating a model

```javascript
Fluxin.createModel({
    getInitialData: function(props){
        return {
            text: props.text || 'Initial Value'
        };
    },
    getEventRouter: function(){
        return {
            "eventName": this.eventHandler
        };
    },
    eventHandler: function(eventPayload){
        this.setState({
            text: this.state.text + eventPayload
        });
    }
});
```

When creating a model the only required field is the `getEventRouter`, which should provide a mapping between an *event* and its handler.
In the example below you a a mapping between an event named *eventName*, which should be handled by the function *eventHandler*.

The *getInitialData* function has its clear parallell in react's *getInitialState* (RENAME??), as do the model's *setState*.
It should however be noted that these functions are not react function but imitations of them to make a easier to use API for the developer.

### Creating a intent

```javascript
Fluxin.createIntent({
    getEventRouter: function(){
        return {
            "eventName": this.eventHandler
        };
    },
    eventHandler: function(eventPayload){
        this.pushNamed('NewEventName', 'EventData1', 'EventData2', eventPayload);
    }
});
```

As with the *Model* the only required field is the *getEventRouter*, which follows the same setup as before.
The Intent however **DOES NOT** have a *setState* function. This is because the intent **should not** be holding on to state.
Instead the intent has a function named *pushNamed(<name>, ...data)* which will push a new event onto the intents outgoing stream.

### Creating a view (and binding it together)

```javascript
Fluxin.createView(Model, Intent, {
    displayName: 'MyView', //Needed because how the JSX transformation works
    render: function(){
        return (
            <div>
                <h1>My first MVI Component</h1>
                <button onClick={this.namedEvent('ButtonClick')}>This button</button>
                {this.state.text}
            </div>
        );
    }
});
```

The *createView* function takes the *Model* and *Intent* as arguments,
noted these can be both object-definitions as create by *Fluxin.createModel* and *Fluxin.createIntent*,
or object-instances created by calling the object-definitions constructor. (The latter can be used if you want global models or intents).

Other then the *displayName* (which is normally applied automagically by the JSX transformation) there is nothing special about the *createView* method.
It is simply a thin wrapper around react's *createComponent* with all its methods exposed (e.g `render`, `getDefaultProps`, etc.).

Fluxin works on React components as a mixin, and it this case it has applied some functions to help customize behaviour.
Notebly in the example is the `namedEvent` function. This creates a named event each time the button is clicked.
This event is then pushed onto the view's outgoing stream.

