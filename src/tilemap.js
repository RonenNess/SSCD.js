/*
* Tilemap is a special type of collision world, designed specifically for a 2d tilemap
* Author: Ronen Ness, 2015
*/


// a collision world. you create an instance of this class and add bodies to it to check collision.
//	@param tile_size: size, in pixels, of a single tile
// @param additional_params: extra params. see SSCD.World for more info.
SSCD.TilemapWorld = function (tile_size, additional_params) {
	
	// set defaults
	var params = additional_params;
	params = params || {};
	params.grid_size = tile_size;
	this.__tiles = {};
	this.__init_world(params);
};

// tilemap collision world
SSCD.TilemapWorld.prototype = {

	// set if a tile blocks or not
	// @param index - the x and y index of the tile to set (vector)
	// @param collision - true if to put a collision shape on this tile, false otherwise
	// @param tags - optional tags to apply on tile, if collision is set to true (note: if not provided will reset tags)
	set_tile: function(index, collision, tags)
	{
		// if already have shape, get it
		var shape = this.get_tile(index);
		
		// if requested to remove the collision from this tile, do it
		if (collision === false)
		{
			this.__set_tile_shape(index, null);
			if (shape)
			{
				this.remove(shape);
				delete shape;
			}
			return;
		}
		
		// if got here it means we need to set collision / update tags for this tile
		// first, check if need to create new collision shape
		if (shape === undefined)
		{
			var tilesize = this.__params.grid_size;
			shape = this.add(new SSCD.Rectangle(index.multiply_scalar(tilesize), new SSCD.Vector(tilesize, tilesize)));
			this.__set_tile_shape(index, shape);
		}
		
		// now update tags, if provided
		shape.set_collision_tags(tags);
	},
	
	// get the collision shape of a tile (or undefined if have no collision shape on this tile)
	// @param index - the x and y index of the tile to get
	get_tile: function(index)
	{
		return this.__tiles[index.x + "_" + index.y];
	},
	
	// set the collision shape of a tile
	__set_tile_shape: function(index, shape)
	{
		if (shape === null)
		{
			delete this.__tiles[index.x + "_" + index.y];
		}
		else
		{
			this.__tiles[index.x + "_" + index.y] = shape;
		}
	},
	
};

// inherit from basic world class.
SSCD.extend(SSCD.World.prototype, SSCD.TilemapWorld.prototype);

