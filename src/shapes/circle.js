/*
* A circle collision shape
* Author: Ronen Ness, 2015
*/

// define the circle shape
// @param position - center position (vector)
// @param radius - circle radius (integer)
SSCD.Circle = function (position, radius)
{
	// call init chain
	this.init();
	
	// set radius and size
	this.__radius = radius;
	this.__size = new SSCD.Vector(radius, radius).multiply_scalar_self(2);

	// set starting position
	this.set_position(position);
};

// Circle prototype
SSCD.Circle.prototype = {
	
	// set type and collision type
	__type: "circle",
	__collision_type: "circle",
	
	// render (for debug purposes)
	// @param ctx - 2d context of a canvas
	// @param camera_pos - optional camera position to transform the render position
	render: function (ctx, camera_pos)
	{
		// apply camera on position
		var position = this.__position.sub(camera_pos);
					
		// draw the circle
		ctx.beginPath();
		ctx.arc(position.x, position.y, this.__radius, 0, 2 * Math.PI, false);
		
		// draw stroke
		ctx.lineWidth = "7";
		ctx.strokeStyle = this.__get_render_stroke_color(0.75);
		ctx.stroke();
		
		// draw fill
		ctx.fillStyle = this.__get_render_fill_color(0.35);
		ctx.fill();
	},
	
	// return circle radius
	get_radius: function ()
	{
		return this.__radius;
	},
	
	// called to update axis-aligned-bounding-box position
	__update_aabb_pos: function()
	{
		this.__aabb.position = this.__position.sub_scalar(this.__radius);
	},
	
	// return axis-aligned-bounding-box
	build_aabb: function ()
	{
		return new SSCD.AABB(this.__position.sub_scalar(this.__radius), this.__size);
	},
	
	// return the absolute center of the shape
	get_abs_center: function()
	{
		return this.__position.clone();
	},
	
};

// inherit from basic shape class.
// this will fill the missing functions from parent, but will not replace functions existing in child.
SSCD.extend(SSCD.Shape.prototype, SSCD.Circle.prototype);