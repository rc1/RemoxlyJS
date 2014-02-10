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

    var connection = new R.Group( { title: 'Connect' } );

    connection
        .add( new R.TextInput( { title: 'Host' } ) )
        .add( new R.TextInput( { title: 'Port' } ) )
        .add( new R.Button( { title: 'Connect' } ) );

    var particles = new R.Group( { title: 'Particles' } );

    // Testing events
    var trailWidth = new R.Slider( { title: 'Trail Width' } );
    trailWidth.on( 'change', function () {
        console.log( 'trail width change', arguments );
    } );

    var renderParticles = new R.Toggle( { title: 'Render Particles' } );
    renderParticles.on( 'change', function () {
        console.log( 'render particles changed', arguments );
    } );

    particles
        .add( new R.Color( { title: 'Particle Color' } ) )
        .add( new R.Color( { title: 'Trail Color' } ) )
        .add( trailWidth )
        .add( new R.Slider( { title: 'Speed' } ) )
        .add( new R.Slider( { title: 'Number of Particles' } ) )
        .add( new R.Slider( { title: 'Trail Length' } ) )
        .add( renderParticles )
        .add( new R.Toggle( { title: 'Render Trails' } ) )
        .add( new R.Toggle( { title: 'Render Effects' } ) )
        .add( new R.Toggle( { title: 'Spawn Particles' } ) );

    // Create the save and load group

    var saveAndLoad = new R.Group( { title: 'Save and Load' } );

    var button = new R.Button( { title: 'Save' } );
    button.on( 'triggered', function ( b ) {
        console.log( b.options.title );
    } );

    saveAndLoad
        .add( new R.Slider( { title: 'Number of files' } ) )
        .add( button )
        .add( new R.Button( { title: 'Load' } ) );


    //# Create the panel
    var panel = new R.Panel();

    panel
        .add( connection )
        .add( particles )
        .add( saveAndLoad );

    return panel;
}
