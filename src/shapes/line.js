/*
* A line collision shape
* Author: Ronen Ness, 2015
*/

// define the line shape
// @param source - starting position (vector)
// @param dest - destination point from source (vector)
// output line will be from source to dest, and when you move it you will actually move the source position.
SSCD.Line = function (source, dest)
{
	// call init chain
	this.init();
	
	// set dest position
	this.__dest = dest;

	// set starting position
	this.set_position(source);
};

// Line prototype
SSCD.Line.prototype = {
	
	// set type and collision type
	__type: "line",
	__collision_type: "line",
	
	// render (for debug purposes)
	// @param ctx - 2d context of a canvas
	// @param camera_pos - optional camera position to transform the render position
	render: function (ctx, camera_pos)
	{
					
		// draw the line
		ctx.beginPath();
		ctx.moveTo(this.__position.x, this.__position.y);
		var dest = this.__position.add(this.__dest);
		ctx.lineTo(dest.x, dest.y);
		
		// draw stroke
		ctx.lineWidth = "7";
		ctx.strokeStyle = this.__get_render_stroke_color(0.75);
		ctx.stroke();
		
	},
	
	// return axis-aligned-bounding-box
	build_aabb: function ()
	{
		var pos = new SSCD.Vector(0, 0);
		pos.x = this.__dest.x > 0 ? this.__position.x : this.__position.x + this.__dest.x;
		pos.y = this.__dest.y > 0 ? this.__position.y : this.__position.y + this.__dest.y;
		var size = this.__dest.apply(Math.abs);
		return new SSCD.AABB(pos, size);
	},
	
	// return absolute first point
	get_p1: function()
	{
		this.__p1_c = this.__p1_c || this.__position.clone();
		return this.__p1_c;
	},
	
	// return absolute second point
	get_p2: function()
	{
		this.__p2_c = this.__p2_c || this.__position.add(this.__dest);
		return this.__p2_c;
	},
	
	// on position change
	__update_position_hook: function()
	{
		// clear points cache
		this.__p1_c = undefined;
		this.__p2_c = undefined;
	},
	
};

// inherit from basic shape class.
// this will fill the missing functions from parent, but will not replace functions existing in child.
SSCD.extend(SSCD.Shape.prototype, SSCD.Line.prototype);