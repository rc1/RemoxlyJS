// #Mixins
// ##Noop
var noop = function (){};

// ##Events
var events = {
    on : function ( event,  callback ) {
        if ( typeof callback !== 'function' ) {
            throw "callback not function";
        }
        this.events()[ event ] = this.events()[ event ] || [];
        if ( this.events()[ event ] ) {
            this.events()[ event ].push( callback );
        }
        return this;
    },
    off : function ( event, callback) {
        if ( !callback ) {
            delete this.events()[ event ];
        } else {
            if ( this.events()[ event ] ) {
                var listeners = this.events()[ event ];
                for ( var i = listeners.length-1; i>=0; --i ){
                    if ( listeners[ i ] === callback ) {
                        listeners.splice( i, 1 );
                    }
                }
            }
        }
        return this;
    },
    // Call the event with name, calling handlers with all other arguments
    trigger : function ( name, data ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        if ( this.events()[ name ] ) {
            var listeners = this.events()[ name ], 
                len = listeners.length;
            if ( len <= 0 ) { return false; }
            while ( len-- ) {
                if ( typeof listeners[ len ] === 'function' ) {
                    listeners[ len ].apply( this, args );
                }
            }
            return true;
        } else {
            return false;
        }
    },
    events : function () {
        this.eventsArray = this.eventsArray || [];
        return this.eventsArray;
    }
};

// #Panel
function Panel ( options ) {
    this.options = options;
    this.el = ich.panel();
    this.contentEl = this.el.find( '.groups' );
    this.groups = [];
}

Panel.prototype.add = function ( group ) {
    this.groups.push( group );
    this.contentEl.append( group.el );
    return this;
};

Panel.prototype.render = function () {
    this.groups.forEach( function ( group ) {
        group.render();
    });
};

// #Group
// __Options__
// * title<string>
// * isCollapsed<Boolean> _default: true_
function Group ( options ) {
    var self = this;

    this.options = options;
    this.el = ich.group( {
        title : options.title
    });
    this.contentEl = this.el.find( '.widgets.body' );
    this.widgets = [];
    this.needsUpdate = true;

    // ##Collapsing
    var collapsedButtonEl = this.el.find( '.widget.header .tool' );
    
    // ###Property: isCollapsed<Boolean>
    var isCollapsed = true;
    Object.defineProperty( this, 'isCollapsed', {
        get : function () { 
            return isCollapsed;
        },
        set : function ( v ) { 
            if ( v === isCollapsed ) { return; }
            isCollapsed = v;
            this.needsUpdate = true;
        }
    });

    // ###Event
    collapsedButtonEl.on( 'click touch', function () {
        self.isCollapsed = !self.isCollapsed;
    });

    // ###Option
    this.isCollapsed = ( typeof options.isCollapsed === 'undefined' ) ? true : options.isCollapsed;
}

Group.prototype.add = function ( widget ) {
    this.widgets.push( widget );
    this.contentEl.append( widget.el );
    return this;
};

Group.prototype.render = function () {
    this.widgets.forEach( function ( widget ) {
        widget.render();
    });
    if ( this.needsUpdate ) {
        if ( this.isCollapsed ) {
            this.contentEl.show();
        } else {
            this.contentEl.hide();
        }
        this.needsUpdate = false;
    }
};

// #Color
// __Options__
// * title<string>
function Color ( options ) {
    this.el = ich.color( {
        title : options.title
    });
    this.needsUpdate = true;
}

Color.prototype.render = function () {
    if ( !this.needsUpdate ) { return; }

    this.needsUpdate =  false;
};

// #Slider
// __Options__
// * title<string>
// * value<Number> _default: 0_
// * min<Number> _default: 0_
// * max<Number> _default: 1_
// * clamp<Boolean> _default: true_
// __Events__
// * 'change' calls handlers with value<Number> and this<Slider>
function Slider ( options ) {
    var self = this;

    this.options = options;
    this.el = ich.slider( {
        title : options.title
    });
    this.max = ( typeof options.max === 'undefined' ) ? 1 : options.max;
    this.min = ( typeof options.min === 'undefined' ) ? 0 : options.min;
    this.clamp = ( typeof options.clamp === 'undefined' ) ? true : options.clamp;
    this.incrementEl = this.el.find( '.tool.inc' );
    this.decrementEl = this.el.find( '.tool.dec' );
    this.numberEl = this.el.find( 'h4' );
    this.sliderEl = this.el.find( 'h3' );
    this.slideEl = this.el.find( '.slide' );
    this.needsUpdate = true;

    // ## Value

    // ### Property: Value<Number>
    var value = false;
    Object.defineProperty( this, 'value', {
        get : function () { 
            return value;
        },
        set : function ( v ) { 
            if ( self.clamp ) {
                v = clamp( v, self.min, self.max );
            }
            if ( v === value ) { return; }
            value = v;
            self.needsUpdate = true;
            self.trigger( 'change', value, self );
        }
    });

    // ###Events
    // #### Increment
    this.incrementEl.on( 'touch click', function ( e ) {
        self.value += getChangeAmount();
    });
    // #### Decrement
    this.decrementEl.on( 'touch click', function ( e ) {
        self.value -= getChangeAmount();
    });
    // ### Number Input
    // This won't work on IE
    this.numberEl.on( 'input', function (e) {
        var text = self.numberEl.text();
        if ( !isNaN(text) ) {
            self.value = +text;
        }
    });
    // When it loses focus update it. This should work in IE
    // it should also revert the number when it is clamped or NaN
    this.numberEl.on( 'blur', function (e) {
        // Delay to ensure value updated
        setTimeout( function () {
            var text = self.numberEl.text();
            if ( !isNaN(text) ) {
                self.value = +text;
            }
            self.needsUpdate = true;
        }, 0 );
    });
    // Slider dragging
    this.sliderEl.on( 'mousedown touch', function ( e ) {
        var documentEl = $( document );
        documentEl.on( 'mouseup touchend', onUpHandler);
        documentEl.on( 'mousemove touchmove', onMoveHandler );
        onMoveHandler( e );
    });
    function onUpHandler () {
        var documentEl = $( document );
        documentEl.off( 'mousemove touchmove', onMoveHandler );
        documentEl.off( 'mouseup touchend', onUpHandler );
    }
    function onMoveHandler ( e ) {
        self.value = map( e.offsetX, 0, self.sliderEl.width(), self.min, self.max, true );
    }

    // ###Option
    this.value = ( typeof options.value === 'undefined' ) ? 0 : options.value;

    // Utils
    function getChangeAmount () {
        var range = Math.abs( self.min - self.max );
        if ( range <= 1 ) {
            return 0.01;
        } 
        return 1;
    }
}

Slider.prototype = Object.create( events );

Slider.prototype.render = function () {
    if ( !this.needsUpdate ) { return; }
    // Set the percntage css of the slide
    this.slideEl.css( { width : Math.floor( map( this.value, this.min, this.max, 0, 100, true ) ) +'%' } );
    // Set the number if it does not have focus
    if ( ! $( document.activeElement ).is( this.numberEl ) ) {
        this.numberEl.text( floatToString( this.value, 9 ) );
    }
    this.needsUpdate = false;
};

// #Toggle
// __Options__
// * title<string>
// * value<Boolean> _default: false_
// __Events__
// * 'change' calls handlers with value<Boolean> and this<Toggle>
function Toggle ( options ) {
    var self = this;

    this.options = options;
    this.el = ich.toggle( {
        title : options.title
    });
    this.toolEl = this.el.find( '.tool' );
    this.needsUpdate = true;

    // ## Value

    // ### Property: Value<Boolean>
    var value = false;
    Object.defineProperty( this, 'value', {
        get : function () { 
            return value;
        },
        set : function ( v ) { 
            if ( v === value ) { return; }
            value = v;
            self.needsUpdate = true; 
            self.trigger( 'change', value, self );
        }
    });

    // ###Event
    this.el.on( 'click touch', function () {
        self.value = !value;
    });

    // ###Option
    this.value = ( typeof options.value === 'undefined' ) ? false : options.value;
}

Toggle.prototype = Object.create( events );

Toggle.prototype.render = function () {
    if ( !this.needsUpdate ) { return; }
    if ( this.value ) {
        this.toolEl.addClass( 'active' );
    } else {
        this.toolEl.removeClass( 'active' );
    }
    this.needsUpdate =  false;
};

// #Button
// __Options__
// * title<string>
// __Events__
// * 'triggered' calls handlers with this<Button>
function Button ( options ) {
    var self = this;

    this.options = options;
    this.el = ich.button( {
        title : options.title
    });
    this.needsUpdate = true;

    // ###Event
    this.el.on( 'click touch', function () {
        self.trigger( 'triggered', self );
    });
}

Button.prototype = Object.create( events );

Button.prototype.render = noop;

// #TextInput
// __Options__
// * title<string>
// * value<Number> _default: ''
// __Events__
// * 'change' calls handlers with value<Boolean> and this<TextInput>
function TextInput ( options ) {
    var self = this;

    this.options = options;
    this.el = ich.textInput( {
        title : options.title
    });
    this.textEl = this.el.find( 'h4' );
    this.needsUpdate = true;

    // ## Value

    // ### Property: Value<String>
    var value = false;
    Object.defineProperty( this, 'value', {
        get : function () { 
            return value;
        },
        set : function ( v ) { 
            value = v;
            this.needsUpdate = true; 
            self.trigger( 'change', value, self );
        }
    });

    // ###Events
    // ### Text Input
    // This won't work on IE
    this.textEl.on( 'input', function (e) {
        self.value = self.textEl.text();
    });
    // When it loses focus update it. This should work in IE
    // it should also revert the number when it is clamped or NaN
    this.textEl.on( 'blur', function (e) {
        // Delay to ensure value updated
        setTimeout( function () {
            self.value = self.textEl.text();
        }, 0 );
    });

    // ###Option
    this.value = ( typeof options.value === 'undefined' ) ? 0 : options.value;
}

TextInput.prototype = Object.create( events );

TextInput.prototype.render = noop;

// #Utils

// ##Math

function map ( input, inputMin, inputMax, outputMin, outputMax, clamp, ease ) {
    input = ( input - inputMin ) / ( inputMax - inputMin );
    if ( ease ) {
        input = ease(input);
    } 
    var output = input * ( outputMax - outputMin ) + outputMin;
    if ( !!clamp ) {
        if ( outputMax < outputMin ) {
            if ( output < outputMax ) {
                output = outputMax;
            }
            else if ( output > outputMin ) {
                output = outputMin;
            }
        } else {
            if ( output > outputMax ) {
                output = outputMax;
            }
            else if ( output < outputMin ) {
                output = outputMin;
            }
        }
    }
    return output;
}

function clamp ( value, min, max, callbackOnClamp ) {
    if ( max < min ) {
        if ( value < max ) {
            if ( typeof callbackOnClamp === 'function' ) {
                callbackOnClamp( value, max );
            }
            value = max;
        }
        else if ( value > min ) {
            if ( typeof callbackOnClamp === 'function' ) {
                callbackOnClamp( value, min );
            }
            value = min;
        }
    } else {
        if ( value > max ) {
            if ( typeof callbackOnClamp === 'function' ) {
                callbackOnClamp( value, max );
            }
            value = max;
        }
        else if ( value < min ) {
            if ( typeof callbackOnClamp === 'function' ) {
                callbackOnClamp(value, min);
            }
            value = min;
        }
    }
    return value;
}

// To remove floating point rounding errors
function floatToString ( value, precision ) {
    var power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
}