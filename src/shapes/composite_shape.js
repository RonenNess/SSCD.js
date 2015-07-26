/*
* a special shape made from multiple shapes combined together
* Author: Ronen Ness, 2015
*/


// set namespace
var SSCD = SSCD || {};

// create a composite shape
// position - optional starting position (vector)
// objects - optional list of collision objects to start with
SSCD.CompositeShape = function (position, objects)
{
	// call init chain
	this.init();
	
	// create empty list of shapes
	this.__shapes = [];
	
	// default position
	position = position || SSCD.Vector.ZERO;
	this.set_position(position);

	// add objects if provided
	if (objects)
	{
		for (var i = 0; i < objects.length; ++i)
		{
			this.add(objects[i]);
		}
	}
};

// set Rectangle methods
SSCD.CompositeShape.prototype = {
	
	__type: "composite-shape",
	
	// render (for debug purposes)
	render: function (ctx, camera_pos)
	{
		// first render all shapes
		for (var i = 0; i < this.__shapes.length; ++i)
		{
			this.__shapes[i].shape.render(ctx, camera_pos);
		}
		
		// now render bounding-box to mark their group boundaries
		var box = this.get_aabb();
				
		// draw the rect
		ctx.beginPath();
		ctx.rect(box.position.x - camera_pos.x, box.position.y - camera_pos.y, box.size.x, box.size.y);
		
		// draw stroke
		ctx.lineWidth = "1";
		ctx.strokeStyle = 'rgba(150, 75, 45, 0.5)';
		ctx.stroke();
	},
	
	// get shapes list
	get_shapes: function()
	{
		// if already got shapes list in cache return it
		if (this.__shapes_list_c)
		{
			return this.__shapes_list_c;
		}

		// create shapes list
		var ret = [];
		for (var i = 0; i < this.__shapes.length; ++i)
		{
			ret.push(this.__shapes[i].shape);
		}
		
		// add to cache and return
		this.__shapes_list_c = ret;
		return ret;
	},
	
	// return axis-aligned-bounding-box
	build_aabb: function ()
	{
		// if no shapes return zero aabb
		if (this.__shapes.length === 0)
		{
			return new SSCD.AABB(SSCD.Vector.ZERO, SSCD.Vector.ZERO);
		}
		
		// return combined aabb
		var ret = null;
		for (var i = 0; i < this.__shapes.length; ++i)
		{
			var curr_aabb = this.__shapes[i].shape.get_aabb();
			if (ret)
			{
				ret.expand(curr_aabb);
			}
			else
			{
				ret = curr_aabb;
			}
		}
		return ret;
	},
	
	// add shape to the composite shape
	// shape is shape to add
	add: function (shape)
	{
		// make sure shape don't have a collision world
		if (shape.__world)
		{
			throw new SSCD.IllegalActionError("Can't add shape with collision world to a composite shape!");
		}
		
		// store shape offset
		var offset = shape.__position;
		
		// reset shapes list cache
		this.__shapes_list_c = undefined;
		
		// add shape to list of shapes and fix position
		this.__shapes.push({shape: shape, offset: offset.clone()});
		shape.set_position(this.__position.add(offset));

		// reset bounding-box and notify collision world about the change
		this.reset_aabb();
		this.__update_parent_world();
		
		// set shape tags to be the composite shape tags
		shape.__collision_tags_val = this.__collision_tags_val;
		shape.__collision_tags = this.__collision_tags;
		
		// return the newly added shape
		return shape;
	},
	
	// hook to call when update tags - update all child objects with new tags
	__update_tags_hook: function()
	{
		// update all shapes about the new tags
		for (var i = 0; i < this.__shapes; ++i)
		{
			var shape = this.__shapes[i].shape;
			shape.__collision_tags_val = this.__collision_tags_val;
			shape.__collision_tags = this.__collision_tags;
		}
	},
	
	// remove a shape
	remove: function (shape)
	{
		this.__shapes_list_c = undefined;
		for (var i = 0; i < this.__shapes.length; ++i)
		{
			if (this.__shapes[i].shape === shape)
			{
				this.__shapes.splice(i, 1);
				this.__update_parent_world();
				return;
			}
		}
		
		throw new SSCD.IllegalActionError("Shape to remove is not in composite shape!");
	},
	
	// on position change - update all shapes
	__update_position_hook: function ()
	{
		for (var i = 0; i < this.__shapes.length; ++i)
		{
			this.__shapes[i].shape.set_position(this.__position.add(this.__shapes[i].offset));
		}
	}
};

// inherit from basic shape class.
// this will fill the missing functions from parent, but will not replace functions existing in child.
SSCD.extend(SSCD.Shape.prototype, SSCD.CompositeShape.prototype);