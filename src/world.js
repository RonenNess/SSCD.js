/*
* Physical world contains a grid of shapes you can efficiently check collision with
* Author: Ronen Ness, 2015
*/


// set namespace
var SSCD = SSCD || {};

// version identifier
SSCD.VERSION = 1.0;

// a collision world. you create an instance of this class and add bodies to it to check collision.
//
// params is an optional dictionary with the following optional settings:
//			grid_size: for better performance, the world is divided into a grid of world-chunks and when collision is checked we will
//							only match objects from the same chunk(s) on grid. this param defines the grid size. default to 512.
SSCD.World = function (params) {
	// set defaults
	params = params || {};
	params.grid_size = params.grid_size || 512;

	// create grid and set params
	this.__bodies = {};
	this.__params = params;

	// create the empty collision flags dictionary
	this.__collision_tags = {};
	this.__next_coll_tag = 0;
};

// collision world prototype
SSCD.World.prototype = {

	// define a new collision tag
	__create_collision_tag: function (name)
	{
		// if already exist throw exception
		if (this.__collision_tags[name])
		{
			throw new SSCD.IllegalActionError("Collision tag named '" + name + "' already exist!");
		}

		// set collision tag
		this.__collision_tags[name] = 1 << this.__next_coll_tag++;
	},
	
	// all-tags flags
	_ALL_TAGS_VAL: Number.MAX_SAFE_INTEGER || 4294967295,
	
	// clean-up world memory
	cleanup: function()
	{
		// iterate over grid rows
		var rows = Object.keys(this.__bodies);
		for (var _i = 0; _i < rows.length; ++_i)
		{
			var i = rows[_i];
			
			// iterate over grid columns in current row:
			var columns = Object.keys(this.__bodies[i]);
			for (var _j = 0; _j < columns.length; ++_j)
			{
				var j = columns[_j];
				
				// if empty grid chunk delete it
				if (this.__bodies[i][j].length === 0)
				{
					delete this.__bodies[i][j];
				}
			}
			
			// if no more columns are left in current row delete the row itself
			if (Object.keys(this.__bodies[i]).length === 0)
			{
				delete this.__bodies[i];
			}
		}
	},
	
	// get the hash value of a list of collision tags or individual tag
	// tags can either be a single string or a list of strings
	__get_tags_value: function(tags)
	{
		// special case: undefined return all possible tags
		if (tags === undefined)
		{
			return this._ALL_TAGS_VAL;
		}
		
		// single tag:
		if (typeof tags === "string")
		{
			return this.__collision_tag(tags);
		}
		
		// else, assume a list
		var ret = 0;
		for (var i = 0; i < tags.length; ++i)
		{
			ret |= this.__collision_tag(tags[i]);
		}
		return ret;
	},
	
	// return the value of a single collision tag, define it if not exist
	__collision_tag: function (name)
	{		
		// if tag doesn't exist create it
		if (this.__collision_tags[name] === undefined)
		{
			this.__create_collision_tag(name);
		}
		
		// return collision tag
		return this.__collision_tags[name];
	},
	
	// get the grid range that this object touches
	__get_grid_range: function(obj)
	{
		// get bounding box
		var aabb = obj.get_aabb();
		
		// calc all grid chunks this shape touches
		var min_i = Math.floor((aabb.position.x) / this.__params.grid_size);
		var min_j = Math.floor((aabb.position.y) / this.__params.grid_size);
		var max_i = Math.floor((aabb.position.x + aabb.size.x) / this.__params.grid_size);
		var max_j = Math.floor((aabb.position.y + aabb.size.y) / this.__params.grid_size);
		
		// return grid range
		return {min_x: min_i, min_y: min_j, max_x: max_i, max_y: max_j};
	},
	
	// add collision object to world
	add: function (obj)
	{
		// if object already in world throw exception
		if (obj.__world)
		{
			throw new SSCD.IllegalActionError("Object to add is already in a collision world!");
		}
	
		// get grid range
		var grids = this.__get_grid_range(obj);
		
		// add shape to all grid parts
		for (var i = grids.min_x; i <= grids.max_x; ++i)
		{
			for (var j = grids.min_y; j <= grids.max_y; ++j)
			{
				// make sure lists exist
				this.__bodies[i] = this.__bodies[i] || {};
				this.__bodies[i][j] = this.__bodies[i][j] || [];
				
				// get current grid chunk
				var curr_grid_chunk = this.__bodies[i][j];
				
				// add object to grid chunk
				curr_grid_chunk.push(obj);
				
				// add chunk to shape chunks list
				obj.__grid_chunks.push(curr_grid_chunk);
			}
		}
		
		// set world and grid chunks boundaries
		obj.__world = this;
		obj.__grid_bounderies = grids;
		
		// return the newly added object
		return obj;
	},
	
	// remove object from world
	remove: function (obj)
	{
		// if object is not in this world throw exception
		if (obj.__world !== this)
		{
			throw new SSCD.IllegalActionError("Object to remove is not in this collision world!");
		}
		
		// remove from all the grid chunks
		for (var i = 0; i < obj.__grid_chunks.length; ++i)
		{
			// get current grid chunk
			var grid_chunk = obj.__grid_chunks[i];

			// remove object from grid
			for (var j = 0; j < grid_chunk.length; ++j)
			{
				if (grid_chunk[j] === obj)
				{
					grid_chunk.splice(j, 1);
					break;
				}
			}
		}
		
		// clear shape world chunks and world pointer
		obj.__grid_chunks = [];
		obj.__world = null;
		obj.__grid_bounderies = null;
	},
	
	// update object grid when it moves or resize etc.
	// this function is used internally by the collision shapes.
	__update_shape_grid: function(obj)
	{
		this.remove(obj);
		this.add(obj);
	},
	
	// check collision and return first object found.
	// obj: object to check collision with (vector or collision shape)
	// collision_tags: optional single or multiple tags to check collision with
	// return: first object collided with, or null if don't collide with anything
	pick_object: function(obj, collision_tags)
	{
		var outlist = [];
		if (this.test_collision(obj, collision_tags, outlist, 1))
		{
			return outlist[0];
		}
		return null;
	},
	
	// test collision with vector or object
	// obj: object to check collision with, can be either Vector (for point collision) or any collision shape.
	// collision_tags: optional string or list of strings of tags to match collision with. if undefined will accept all tags
	// out_list: optional output list. if provided, will be filled with all objects collided with. note: collision is more efficient if not provided.
	// ret_objs_count: if provided, will limit returned objects to given count.
	// return true if collided with anything, false otherwise.
	test_collision: function (obj, collision_tags, out_list, ret_objs_count)
	{
		// default collision flags
		collision_tags = this.__get_tags_value(collision_tags);
		
		// handle vector
		if (obj instanceof SSCD.Vector)
		{
			return this.__test_collision_point(obj, collision_tags, out_list);
		}
		// handle collision with shape
		if (obj.is_shape)
		{
			return this.__test_collision_shape(obj, collision_tags, out_list);
		}
	},
	
	// test collision for given point
	// see test_collision comment for more info
	__test_collision_point: function (vector, collision_tags_val, out_list, ret_objs_count)
	{
		// get current grid size
		var grid_size = this.__params.grid_size;
		
		// get the grid chunk to test collision with
		var i = Math.floor((vector.x) / grid_size);
		var j = Math.floor((vector.y) / grid_size);
		
		// if grid chunk is not in use return empty list
		if (this.__bodies[i] === undefined || this.__bodies[i][j] === undefined)
		{
			return false;
		}
		
		// get current grid chunk
		var grid_chunk = this.__bodies[i][j];
		
		// iterate over all objects in current grid chunk and add them to render list
		var found = 0;
		for (var i = 0; i < grid_chunk.length; ++i)
		{
			// get current object to test
			var curr_obj = grid_chunk[i];
			
			// if collision tags don't match skip this object
			if (!curr_obj.collision_tags_match(collision_tags_val))
			{
				continue;
			}
			
			// if collide with object:
			if (curr_obj.test_collide_with(vector))
			{
				// if got collision list to fill, add object and set return value to true
				if (out_list)
				{
					found++;
					out_list.push(curr_obj);
					if (ret_objs_count && found >= ret_objs_count)
					{
						return true;
					}
				}
				// if don't have collision list to fill simply return true
				else
				{
					return true;
				}
			}
		}

		// return if collided 
		// note: get here only if got list to fill or if no collision found
		return found > 0;
	},
	
	// test collision with other shape
	// see test_collision comment for more info
	__test_collision_shape: function (obj, collision_tags_val, out_list, ret_objs_count)
	{
		// if shape is in this world, use its grid range from cache
		if (obj.__world === this)
		{
			var grid = obj.__grid_bounderies;
		}
		// if not in world, generate grid range
		else
		{
			var grid = this.__get_grid_range(obj);
		}
		
		// for return value
		var found = 0;
		
		// so we won't test same objects multiple times
		var already_tests = {};
		
		// iterate over grid this shape touches
		for (var i = grid.min_x; i <= grid.max_x; ++i)
		{
			// skip empty rows
			if (this.__bodies[i] === undefined)
			{
				continue;
			}

			// iterate on current grid row
			for (var j = grid.min_y; j <= grid.max_y; ++j)
			{
				var curr_grid_chunk = this.__bodies[i][j];
				
				// skip empty grid chunks
				if (curr_grid_chunk === undefined)
				{
					continue;
				}
				
				// iterate over objects in grid chunk and check collision
				for (var x = 0; x < curr_grid_chunk.length; ++x)
				{
					// get current object
					var curr_obj = curr_grid_chunk[x];
					
					// make sure object is not self
					if (curr_obj === obj)
					{
						continue;
					}
					
					// check if this object was already tested
					if (already_tests[curr_obj.get_id()])
					{
						continue;
					}
					already_tests[curr_obj.get_id()] = true;
					
					// if collision tags don't match skip this object
					if (!curr_obj.collision_tags_match(collision_tags_val))
					{
						continue;
					}
					
					// if collide with object:
					if (curr_obj.test_collide_with(obj))
					{
						// if got collision list to fill, add object and set return value to true
						if (out_list)
						{
							found++;
							out_list.push(curr_obj);
							if (ret_objs_count && found >= ret_objs_count)
							{
								return true;
							}
						}
						// if don't have collision list to fill simply return true
						else
						{
							return true;
						}
					}
				}
				
			}
		}
		
		// return if collided 
		// note: get here only if got list to fill or if no collision found
		return found > 0;
	},
	
	// debug-render all the objects in world
	// canvas: a 2d canvas object to render on.
	// camera_pos: optional, vector that represent the current camera position is 2d space.
	// show_grid: default to true, if set will render background grid that shows which grid chunks are currently active
	// NOTE: this function will NOT clear canvas before rendering, if you render within a main loop its your responsibility.
	render: function (canvas, camera_pos, show_grid)
	{
		// set default camera pos if doesn't exist
		camera_pos = camera_pos || SSCD.Vector.ZERO;
		
		// get ctx and reset previous transformations
		var ctx = canvas.getContext('2d');
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		
		// get current grid size
		var grid_size = this.__params.grid_size;
		
		// get grid parts that are visible based on canvas size and camera position
		var min_i = Math.floor((camera_pos.x) / grid_size);
		var min_j = Math.floor((camera_pos.y) / grid_size);
		var max_i = min_i + Math.ceil(canvas.width / grid_size);
		var max_j = min_j + Math.ceil(canvas.height / grid_size);
		
		// a list of objects to render
		var render_list = [];
		
		// iterate over grid
		for (var i = min_i; i <= max_i; ++i)
		{
			
			// go over grid row
			for (var j = min_j; j <= max_j; ++j)
			{
				// get current grid chunk
				var curr_grid_chunk = undefined;
				if (this.__bodies[i])
				{
					var curr_grid_chunk = this.__bodies[i][j];
				}
								
				// render current grid chunk
				var position = new SSCD.Vector(i * grid_size, j * grid_size).sub_self(camera_pos);
				ctx.beginPath();
				ctx.rect(position.x, position.y, grid_size-1, grid_size-1);
				ctx.lineWidth = "1";
				if ((curr_grid_chunk === undefined) || (curr_grid_chunk.length === 0))
				{
					ctx.strokeStyle = 'rgba(100, 100, 100, 0.255)';
				}
				else
				{
					ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
				}
				ctx.stroke();
				
				
				// if current grid chunk has no objects skip
				if (curr_grid_chunk === undefined)
				{
					continue;
				}
				
				// iterate over all objects in current grid chunk and add them to render list
				for (var x = 0; x < curr_grid_chunk.length; ++x)
				{
					var curr_obj = curr_grid_chunk[x];
					if (render_list.indexOf (curr_obj) === -1)
					{
						render_list.push(curr_grid_chunk[x]);
					}
				}
			}
		}
		
		// now render all objects in render list
		for (var i = 0; i < render_list.length; ++i)
		{
			render_list[i].render(ctx, camera_pos);
		}
	},
};


// for illegal action exception
SSCD.IllegalActionError = function (message) {
    this.name = "Illegal Action";
    this.message = (message || "");
}
SSCD.IllegalActionError.prototype = Error.prototype;

