// #Panel
function Panel ( options ) {
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
function Group ( options ) {
    var self = this;

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
    Object.defineProperty( this, "isCollapsed", {
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
function Slider ( options ) {
    this.el = ich.slider( {
        title : options.title
    });
    this.needsUpdate = true;
}

Slider.prototype.render = function () {
    if ( !this.needsUpdate ) { return; }

    this.needsUpdate =  false;
};

// #Toggle
function Toggle ( options ) {
    var self = this;

    this.el = ich.toggle( {
        title : options.title
    });
    this.toolEl = this.el.find( '.tool' );
    this.needsUpdate = true;

    // ## Value

    // ### Property: Value<Boolean>
    var value = false;
    Object.defineProperty( this, "value", {
        get : function () { 
            return value;
        },
        set : function ( v ) { 
            if ( v === value ) { return; }
            value = v;
            this.needsUpdate = true; 
        }
    });

    // ###Event
    this.el.on( 'click touch', function () {
        console.log(  'touched', value, !value );
        self.value = !value;
    });

    // ###Option
    this.value = ( typeof options.value === 'undefined' ) ? false : options.value;
}

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
function Button ( options ) {
    this.el = ich.button( {
        title : options.title
    });
    this.needsUpdate = true;
}

Button.prototype.render = function () {
    if ( !this.needsUpdate ) { return; }

    this.needsUpdate =  false;
};

