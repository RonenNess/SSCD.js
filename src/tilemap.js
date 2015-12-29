/*
 * Tilemap is a special type of collision world, optimized specifically for a 2d tilemap.
 * Author: Ronen Ness, 2015
 */
 
// a collision world. you create an instance of this class and add bodies to it to check collision.
// @param tile_size: size, in pixels, of a single tile
// @param additional_params: extra params. see SSCD.World for more info.
SSCD.TilemapWorld = function(tile_size, additional_params) {

	// set defaults
	var params = additional_params;
	params = params || {};
	params.grid_size = tile_size;
	this.__tiles = {};
	this.__init_world(params);
};

// tilemap collision world
SSCD.TilemapWorld.prototype = {

	// set if a tile blocks or not.
	// @param index - the x and y index of the tile to set (vector).
	// @param collision - true if to put a collision shape on this tile, false otherwise.
	// @param tags - optional tags to apply on tile, if collision is set to true (note: null to reset tags).
	set_tile: function(index, collision, tags) {
		// if already have shape, get it
		var shape = this.get_tile(index);

		// if requested to remove the collision from this tile, do it
		if (!collision) {
			if (shape) {
				this.__set_tile_shape(index, null);
				this.remove(shape);
				delete shape;
			}
			return;
		}

		// if got here it means we need to set collision / update tags for this tile.
		// first, check if need to create new collision shape.
		if (shape === undefined) {
			// calc position and size of the shape
			var tilesize = this.__params.grid_size;
			var position = index.multiply_scalar(tilesize);
			var size = new SSCD.Vector(tilesize, tilesize);

			// create and add the shape
			shape = this.__add_tile_shape(new SSCD.Rectangle(position, size), index);
			this.__set_tile_shape(index, shape);
		}

		// set collision tags
		if (tags !== undefined) {
			shape.set_collision_tags(tags);
		}
	},

	// add collision tile (for internal usage).
	// @param obj - object to add to the tile.
	// @param index - tile index.
	__add_tile_shape: function(obj, index) {

		// make sure lists exist
		this.__grid[index.x] = this.__grid[index.x] || {};
		this.__grid[index.x][index.y] = this.__grid[index.x][index.y] || [];

		// get current grid chunk
		var curr_grid_chunk = this.__grid[index.x][index.y];

		// add object to grid chunk
		curr_grid_chunk.push(obj);

		// add chunk to shape chunks list
		obj.__grid_chunks = [curr_grid_chunk];

		// set world and grid chunks boundaries
		obj.__world = this;
		obj.__grid_bounderies = {
			min_x: index.x,
			min_y: index.y,
			max_x: index.x,
			max_y: index.y
		};
		// obj.__last_insert_aabb = obj.get_aabb().clone();

		// add to list of all shapes
		this.__all_shapes[obj.get_id()] = obj;

		// return the newly added object
		return obj;
	},

	// set tilemap from a matrix (array of arrays).
	// @param matrix is the matrix to set, every 1 will be collision, every 0 will not collide. (note: true and false works too).
	set_from_matrix: function(matrix) {
		var index = new SSCD.Vector(0, 0);
		for (var i = 0; i < matrix.length; ++i) {
			index.x = 0;
			for (var j = 0; j < matrix[i].length; ++j) {
				this.set_tile(index, matrix[i][j]);
				index.x++;
			}
			index.y++;
		}
	},

	// get the collision shape of a tile (or undefined if have no collision shape on this tile).
	// @param index - the x and y index of the tile to get.
	get_tile: function(index) {
		return this.__tiles[index.x + "_" + index.y];
	},

	// set the collision shape of a tile.
	// @param index - tile index.
	// @param shape - shape to set.
	__set_tile_shape: function(index, shape) {
		if (shape === null) {
			delete this.__tiles[index.x + "_" + index.y];
		} else {
			this.__tiles[index.x + "_" + index.y] = shape;
		}
	},

};

// inherit from basic world class.
SSCD.extend(SSCD.World.prototype, SSCD.TilemapWorld.prototype);