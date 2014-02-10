var collectionOfPanelsTestData = [{            // panel, the groups follow next in the 'g' array
    "g": [{        // g is the group element, it's an array with all the widgets. subject to change
        "t": 3,                             // Type of the element, see gui/include/gui/Types.h
        "step": 0.10000000149011612,        // Specific value for slider type, the step 
        "l": "Trail Width",                 // 'l' holds the label for the widget
        "maxv": 100.0,                      // max value for the slider
        "i": 9,                             // i - unique ID for this element. this id is used for networking
        "v": 10.0,                          // current value of the slider
        "minv": 0.0                         // min value of the slider
    }, {
        "t": 3,
        "step": 0.0099999997764825821,
        "l": "Speed",
        "maxv": 50.0,
        "i": 12,
        "v": 5.5,
        "minv": 0.0
    }, {
        "t": 2,
        "step": 1,
        "l": "Number Of Particles",
        "maxv": 500,
        "i": 15,
        "v": 10,
        "minv": 0
    }, {
        "t": 2,
        "step": 2,
        "l": "Trail Length",
        "maxv": 100,
        "i": 18,
        "v": 10,
        "minv": 0
    }, {
        "t": 5,
        "l": "Render Particles",
        "i": 21
    }, {
        "t": 5,
        "l": "Render Trails",
        "i": 22
    }, {
        "t": 5,
        "l": "Render Effects",
        "i": 23
    }, {
        "t": 5,
        "l": "Spawn Particles",
        "i": 24
    }]
}, {
    "g": [{
        "t": 2,
        "step": 1,
        "l": "Number of files",
        "maxv": 15,
        "i": 28,
        "v": 5,
        "minv": 0
    }]
}];


$( function () {

	createClient( {
		panelsJson : collectionOfPanelsTestData
	} );
});