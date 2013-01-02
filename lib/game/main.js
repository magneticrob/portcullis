ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

	// Entities
	'game.entities.clickable',

	// Plugins
	'plugins.director',

	// Levels
	'game.levels.menu'
)
.defines(function(){

Portcullis = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	gatePos: -225,
	gateDropped: false,
	quake: false,
	
	quakeTimer: new ig.Timer(),
	quakeStrength: 5,
	quakeDuration: 1,
	
	
	init: function() {

		// Bind keys
		ig.input.bind( ig.KEY.W, 'up');
		ig.input.bind( ig.KEY.S, 'down');
		ig.input.bind( ig.KEY.A, 'left');
		ig.input.bind( ig.KEY.D, 'right');
		ig.input.bind( ig.KEY.SPACE, 'shoot');
		ig.input.bind( ig.KEY.MOUSE1, 'click' );

		// Init director plugin
		this.director = new ig.Director(this, [LevelMenu]);

		//If we're on the menu
		if(this.director.currentLevel == 0) {
			//Spawn the pointer
			ig.game.spawnEntity( EntityPointer, 0, 0 );

			//Load the title image
			this.titleImage = new ig.Image( 'media/portcullis.png' );
			this.quakeTimer.set(this.quakeDuration);
			this.dropGate();
		}
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();

		if ( this.director.currentLevel == 0 ) {
			if(!this.gateDropped) {
				this.dropGate();
			}

			if ( this.quake ) {
				var delta = this.quakeTimer.delta();
				if( delta < -0.1 ) {
					var s = this.quakeStrength * Math.pow( -delta / this.quakeDuration, 2 );
					if( s > 0.5 ) {
						ig.game.screen.x += Math.random().map( 0, 1, -s, s );
						ig.game.screen.y += Math.random().map( 0, 1, -s, s );
					}
				}
			}

		}
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		// Drop the portcullis
		if ( this.director.currentLevel == 0 ) {
			this.titleImage.draw(ig.system.width / 4, this.gatePos);
		}

	},

	dropGate: function() {
		if ( this.gatePos <= -20 ) {
			this.gatePos += 10;
		} else {
			//earthquake
			this.gateDropped = true;
			this.quake = true;
		}
	}

});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', Portcullis, 60, 320, 240, 2 );

});
