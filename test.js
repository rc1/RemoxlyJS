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

    particles
        .add( new Color( { title: 'Particle Color' } ) )
        .add( new Color( { title: 'Trail Color' } ) )
        .add( new Slider( { title: 'Trail Width' } ) )
        .add( new Slider( { title: 'Speed' } ) )
        .add( new Slider( { title: 'Number of Particles' } ) )
        .add( new Slider( { title: 'Trail Length' } ) )
        .add( new Toggle( { title: 'Render Particles' } ) )
        .add( new Toggle( { title: 'Render Trails' } ) )
        .add( new Toggle( { title: 'Render Effects' } ) )
        .add( new Toggle( { title: 'Spawn Particles' } ) );

    // Create the save and load group

    var saveAndLoad = new Group( { title: 'Save and Load' } );

    saveAndLoad
        .add( new Slider( { title: 'Number of files' } ) )
        .add( new Button( { title: 'Save' } ) )
        .add( new Button( { title: 'Load' } ) );


    //# Create the panel
    var panel = new Panel();

    panel
        .add( connection )
        .add( particles )
        .add( saveAndLoad );

    return panel;
}
