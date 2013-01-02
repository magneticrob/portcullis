ig.module (
	'game.entities.clickable'
)
.requires (
	'impact.game',	
	'impact.entity'
)
.defines(function() {

EntityClickable = ig.Entity.extend({

	type: ig.Entity.TYPE.B,
	size: {x: 73, y:32},
	font: new ig.Font( 'media/04b03.font.png' ),
	clickStatus: false,
	gravityFactor: 0,
	animSheet: new ig.AnimationSheet( 'media/button.png', 73, 32),
	hover: false,
	resetSound: new ig.Timer(1),
	// clickSound: new ig.Sound( 'media/sounds/click.ogg' ),
	// hoverSound: new ig.Sound( 'media/sounds/hover.ogg' ),
	origPosX: 0,
	origPosY: 0,

	init: function(x, y, settings) {
		this.addAnim('idle', 0.1, [0]);
		this.addAnim('hover', 0.1, [1]);
		this.addAnim('clicked', 0.1, [2]);			
		this.currentAnim = this.anims.idle;
		this.parent(x, y, settings);
		this.origPosX = this.pos.x;
		this.origPosY = this.pos.y;
	},

	show: function () {
		this.pos.x = this.origPosX;
		this.pos.y = this.origPosY;
	},

	hide: function() {
		this.pos.x = -99999999;
		this.pos.y = -99999999;
	},

	update: function(x, y, settings) {
		var clicked = false;

		this.currentAnim = this.anims.idle;
		this.pointer = ig.game.getEntitiesByType( EntityPointer )[0];

		//If the pointer is inside the area of the clickable, set to hovered, otherwise unhover
		if(this.pos.x < this.pointer.pos.x && this.pos.y < this.pointer.pos.y && (this.pos.x + this.size.x) > this.pointer.pos.x && (this.pos.y + this.size.y) > this.pointer.pos.y ) {
			this.hovered();
		} else {
			this.unhover();
		}

		// console.log(Math.floor(this.resetSound.delta()));
		this.parent();
	},

	clicked: function( x, y, settings) {
		this.currentAnim = this.anims.clicked;
		if(this.resetSound.delta() > -1) {
			this.clickSound.play();
			this.resetSound.reset();
		}
		this.clickStatus = true;
	},

	draw: function() {
		if(!this.text) {
			this.text = 'default';
		}

		if( this.currentAnim ) {
			this.currentAnim.draw(
				this.pos.x - this.offset.x - ig.game._rscreen.x,
				this.pos.y - this.offset.y - ig.game._rscreen.y
			);
		}

		this.font.draw( this.text, this.pos.x + 35, this.pos.y + 12, ig.Font.ALIGN.CENTER);
	},

	hovered: function() {
		// this.font = new ig.Font( 'media/04b03.fontGreen.png' );
		this.currentAnim = this.anims.hover;
		if(!this.hover) {
			if(this.resetSound.delta() > -0.5) {
				this.hoverSound.play();
				this.resetSound.reset();
			}

			this.hover = true;
		}
	},

	//This is never called, find a place in entitypointer to do it properly

	unhover: function() {
		// this.font = new ig.Font( 'media/04b03.font.png' );
		this.hover = false;
	}
})

EntityPointer = ig.Entity.extend({
	
	size: {x:2, y:2},
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.B, //Check against menu items
	animSheet: new ig.AnimationSheet( 'media/pointer.png', 2, 2),
	isClicking: false,

	init: function( x, y, settings) {
		this.parent( x, y, settings);
		//Start capturing mouse events
		ig.input.initMouse();
		this.addAnim('idle', 1, [0]);
	},

	update: function() {
		this.parent();
		
		//On update, the pointer entity updates itself to the mouse position
		this.pos.x = ig.input.mouse.x;
		this.pos.y = ig.input.mouse.y;

		// Only check for the click once per frame, instead of
        // for each entity it touches in the 'check' function
        this.isClicking = ig.input.state('click');

        //We're unhovered here, so lets undo everything we set when we set the hover styles
        this.buttons = ig.game.getEntitiesByType( 'EntityClickable' );

        for (i=1;i<=this.buttons.length;i++) {
	        this.buttons[i-1].font = new ig.Font( 'media/04b03.font.png' );	
        }

	},

	check: function( other ) {
        
        other.hovered();

        // User is clicking and the 'other' entity has 
        // a 'clicked' function?
        if( this.isClicking && typeof(other.clicked) == 'function' ) {
            other.clicked();
        }
	}

});

});