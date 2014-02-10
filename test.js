// Request Animation Polyfill
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


// Onload
$( function () {
    console.log( 'Testing Remoxly yay!' );

    // Create the panels

    var fixedWidthPanel = createTestPanel();
    $( '.test-fixed-width' ).append( fixedWidthPanel.el );

    var fluidWidthPanel = createTestPanel();
    $( '.test-fluid-width' ).append( fluidWidthPanel.el );

    // Draw loop
    (function render () {
        fixedWidthPanel.render();
        fluidWidthPanel.render();
        window.requestAnimationFrame( render );
    }());

});

// Returns a panel created with groups and widgets
function createTestPanel () {

    // Create the particles group

    var connection = new Group( { title: 'Connect' } );

    connection
        .add( new TextInput( { title: 'Host' } ) )
        .add( new TextInput( { title: 'Port' } ) )
        .add( new Button( { title: 'Connect' } ) );

    var particles = new Group( { title: 'Particles' } );

    // Testing events
    var trailWidth = new Slider( { title: 'Trail Width' } );
    trailWidth.on( 'change', function () {
        console.log( 'trail width change', arguments );
    } );

    var renderParticles = new Toggle( { title: 'Render Particles' } );
    renderParticles.on( 'change', function () {
        console.log( 'render particles changed', arguments );
    } );

    particles
        .add( new Color( { title: 'Particle Color' } ) )
        .add( new Color( { title: 'Trail Color' } ) )
        .add( trailWidth )
        .add( new Slider( { title: 'Speed' } ) )
        .add( new Slider( { title: 'Number of Particles' } ) )
        .add( new Slider( { title: 'Trail Length' } ) )
        .add( renderParticles )
        .add( new Toggle( { title: 'Render Trails' } ) )
        .add( new Toggle( { title: 'Render Effects' } ) )
        .add( new Toggle( { title: 'Spawn Particles' } ) );

    // Create the save and load group

    var saveAndLoad = new Group( { title: 'Save and Load' } );

    var button = new Button( { title: 'Save' } );
    button.on( 'triggered', function ( b ) {
        console.log( b.options.title );
    } );

    saveAndLoad
        .add( new Slider( { title: 'Number of files' } ) )
        .add( button )
        .add( new Button( { title: 'Load' } ) );


    //# Create the panel
    var panel = new Panel();

    panel
        .add( connection )
        .add( particles )
        .add( saveAndLoad );

    return panel;
}
