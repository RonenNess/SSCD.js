/*
* A strip-of-lines collision shape
* Author: Ronen Ness, 2015
*/


// set namespace
var SSCD = SSCD || {};

// define the line shape
// position - starting position (vector)
// points - list of vectors that will make the lines.
// closed - default to false. if true, will close the shape.
SSCD.LineStrip = function (position, points, closed)
{
	// call init chain
	this.init();
	
	// set points
	this.__points = points;
	
	// if not enough points assert
	if (points.length <= 1)
	{
		throw new SSCD.IllegalActionError("Not enough vectors for LineStrip (got to have at least two vectors)");
	}
	
	// close shape
	if (closed)
	{
		this.__points.push(this.__points[0]);
	}

	// set starting position
	this.set_position(position);
};

// set line methods
SSCD.LineStrip.prototype = {
	
	__type: "line-strip",
	
	// render (for debug purposes)
	render: function (ctx, camera_pos)
	{
					
		// draw the lines
		var to = undefined;
		ctx.beginPath();
		for (var i = 0; i < this.__points.length-1; ++i)
		{
			var from = this.__position.add(this.__points[i]);
			to = this.__position.add(this.__points[i+1]);
			ctx.moveTo(from.x, from.y);
			ctx.lineTo(to.x, to.y);
		}
		
		// add last point
		ctx.moveTo(to.x, to.y);
		to = this.__position.add(this.__points[this.__points.length-1]);
		ctx.lineTo(to.x, to.y);
		
		// draw stroke
		ctx.lineWidth = "7";
		ctx.strokeStyle = this.__get_render_stroke_color(0.75);
		ctx.stroke();
		
	},
	
	// return line list with absolute positions
	get_abs_lines: function()
	{
		// if got lines in cache return it
		if (this.__abs_lines_c)
		{
			return this.__abs_lines_c;
		}
		
		// create list of lines
		var points = this.get_abs_points();
		var ret = [];
		for (var i = 0; i < points.length-1; i++)
		{
			ret.push([points[i], points[i+1]]);
		}
		
		// add to cache and return
		this.__abs_lines_c = ret;
		return ret;
	},
	
	// return points with absolute position
	get_abs_points: function()
	{
		// if got points in cache return it
		if (this.__abs_points_c)
		{
			return this.__abs_points_c;
		}

		// convert points
		var ret = [];
		for (var i = 0; i < this.__points.length; i++)
		{
			ret.push(this.__points[i].add(this.__position));
		}
		
		// add to cache and return
		this.__abs_points_c = ret;
		return ret;
	},
	
	// on position change
	__update_position_hook: function()
	{
		// clear points and lines cache
		this.__abs_points_c = undefined;
		this.__abs_lines_c = undefined;
	},
	
	// called to update axis-aligned-bounding-box position
	__update_aabb_pos: function()
	{
		this.__aabb.position.set(this.__aabb_offset_c.add(this.__position));
	},
	
	// return axis-aligned-bounding-box
	build_aabb: function ()
	{
		var ret = new SSCD.AABB( SSCD.Vector.ZERO, SSCD.Vector.ZERO);
		for (var i = 0; i < this.__points.length; ++i)
		{
			ret.add_vector(this.__points[i]);
		}
		this.__aabb_offset_c = ret.position.clone();
		ret.position.add_self(this.__position);
		return ret;
	},
	
};

// inherit from basic shape class.
// this will fill the missing functions from parent, but will not replace functions existing in child.
SSCD.extend(SSCD.Shape.prototype, SSCD.LineStrip.prototype);