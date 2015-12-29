/*
* here we define all the collision-detection functions for all possible shape combinations
* Author: Ronen Ness, 2015
*/


// set namespace
var SSCD = SSCD || {};

SSCD.CollisionManager = {
	
	// test collision between two objects, a and b.
	// @param a, b - instances to check collision. can be any shape or vector.
	test_collision: function (a, b)
	{
		// vector-vector collision
		if (a instanceof SSCD.Vector && b instanceof SSCD.Vector)
		{
			return this._test_collision_vector_vector(a, b);
		}
				
		// composite shape collision
		if (a.__collision_type == "composite-shape")
		{
			return this._test_collision_composite_shape(a, b);
		}
		if (b.__collision_type == "composite-shape")
		{
			return this._test_collision_composite_shape(b, a);
		}
		
		// circle-vector collision
		if (a instanceof SSCD.Vector && b.__collision_type == "circle")
		{
			return this._test_collision_circle_vector(b, a);
		}
		if (a.__collision_type == "circle" && b instanceof SSCD.Vector)
		{
			return this._test_collision_circle_vector(a, b);
		}
		
		// circle-circle collision
		if (a.__collision_type == "circle" && b.__collision_type == "circle")
		{
			return this._test_collision_circle_circle(b, a);
		}
		
		// circle-rectangle collision
		if (a.__collision_type == "circle" && b.__collision_type == "rectangle")
		{
			return this._test_collision_circle_rect(a, b);
		}
		if (a.__collision_type == "rectangle" && b.__collision_type == "circle")
		{
			return this._test_collision_circle_rect(b, a);
		}
		
		// circle-line collision
		if (a.__collision_type == "circle" && b.__collision_type == "line")
		{
			return this._test_collision_circle_line(a, b);
		}
		if (a.__collision_type == "line" && b.__collision_type == "circle")
		{
			return this._test_collision_circle_line(b, a);
		}
		
		// linestrip-line collision
		if (a.__collision_type == "line-strip" && b.__collision_type == "line")
		{
			return this._test_collision_linestrip_line(a, b);
		}
		if (a.__collision_type == "line" && b.__collision_type == "line-strip")
		{
			return this._test_collision_linestrip_line(b, a);
		}
		
		// circle-linestrip collision
		if (a.__collision_type == "circle" && b.__collision_type == "line-strip")
		{
			return this._test_collision_circle_linestrip(a, b);
		}
		if (a.__collision_type == "line-strip" && b.__collision_type == "circle")
		{
			return this._test_collision_circle_linestrip(b, a);
		}		
	
		// rect-vector collision
		if (a instanceof SSCD.Vector && b.__collision_type == "rectangle")
		{
			return this._test_collision_rect_vector(b, a);
		}
		if (a.__collision_type == "rectangle" && b instanceof SSCD.Vector)
		{
			return this._test_collision_rect_vector(a, b);
		}
		
		// rect-rect collision
		if (a.__collision_type == "rectangle" && b.__collision_type == "rectangle")
		{
			return this._test_collision_rect_rect(b, a);
		}
		
		// line-strip with line-strip collision
		if (a.__collision_type == "line-strip" && b.__collision_type == "line-strip")
		{
			return this._test_collision_linestrip_linestrip(a, b);
		}

		// rect-line collision
		if (a.__collision_type == "line" && b.__collision_type == "rectangle")
		{
			return this._test_collision_rect_line(b, a);
		}
		if (a.__collision_type == "rectangle" && b.__collision_type == "line")
		{
			return this._test_collision_rect_line(a, b);
		}	
		
		// rect-linestrip collision
		if (a.__collision_type == "line-strip" && b.__collision_type == "rectangle")
		{
			return this._test_collision_rect_linestrip(b, a);
		}
		if (a.__collision_type == "rectangle" && b.__collision_type == "line-strip")
		{
			return this._test_collision_rect_linestrip(a, b);
		}	
		
		// line-line collision
		if (a.__collision_type == "line" && b.__collision_type == "line")
		{
			return this._test_collision_line_line(a, b);
		}
		
		// vector-line collision
		if (a.__collision_type == "line" && b instanceof SSCD.Vector)
		{
			return this._test_collision_vector_line(b, a);
		}
		if (a instanceof SSCD.Vector && b.__collision_type == "line")
		{
			return this._test_collision_vector_line(a, b);
		}	
		
		// vector-linestrip collision
		if (a.__collision_type == "line-strip" && b instanceof SSCD.Vector)
		{
			return this._test_collision_vector_linestrip(b, a);
		}
		if (a instanceof SSCD.Vector && b.__collision_type == "line-strip")
		{
			return this._test_collision_vector_linestrip(a, b);
		}	
	
		// unsupported shapes!
		throw new SSCD.UnsupportedShapes(a, b);
	},
	
	// test collision between two vectors
	_test_collision_vector_vector: function(a, b)
	{
		return (a.x === b.x) && (a.y === b.y);
	},
	
	// test collision between circle and vector
	_test_collision_circle_vector: function (circle, vector)
	{
		return SSCD.Math.distance(circle.__position, vector) <= circle.__radius;
	},
	
	// test collision between circle and another circle
	_test_collision_circle_circle: function (a, b)
	{
		return SSCD.Math.distance(a.__position, b.__position) <= a.__radius + b.__radius;
	},
	
	// test collision between rectangle and vector
	_test_collision_rect_vector: function (rect, vector)
	{
		return 	(vector.x >= rect.__position.x) && (vector.y >= rect.__position.y) &&
					(vector.x <= rect.__position.x + rect.__size.x) &&
					(vector.y <= rect.__position.y + rect.__size.y);
	},
	
	// test collision vector with line
	_test_collision_vector_line: function (v, line)
	{
		return SSCD.Math.is_on_line(v, line.get_p1(), line.get_p2());
	},
	
	// test collision vector with linestrip
	_test_collision_vector_linestrip: function(v, linestrip)
	{
		var lines = linestrip.get_abs_lines();
		for (var i = 0; i < lines.length; ++i)
		{
			if (SSCD.Math.is_on_line(v, lines[i][0], lines[i][1]))
			{
				return true;
			}
		}
		return false;
	},
	
	// test collision between circle and line
	_test_collision_circle_line: function (circle, line)
	{
		return SSCD.Math.distance_to_line(circle.__position, line.get_p1(), line.get_p2()) <= circle.__radius;
	},
	
	// test collision between circle and line-strip
	_test_collision_circle_linestrip: function (circle, linestrip)
	{
		var lines = linestrip.get_abs_lines();
		for (var i = 0; i < lines.length; ++i)
		{
			if (SSCD.Math.distance_to_line(circle.__position, lines[i][0], lines[i][1]) <= circle.__radius)
			{
				return true;
			}
		}
		return false;
	},
	
	// test collision between linestrip and a single line
	_test_collision_linestrip_line: function(linestrip, line)
	{
		var lines = linestrip.get_abs_lines();
		var p1 = line.get_p1(), p2 = line.get_p2();
		for (var i = 0; i < lines.length; ++i)
		{
			if (SSCD.Math.line_intersects(p1, p2, lines[i][0], lines[i][1]))
			{
				return true;
			}
		}
		return false;
	},
	
	// check collision line with line
	_test_collision_line_line: function (a, b)
	{
		return SSCD.Math.line_intersects(a.get_p1(),  a.get_p2(), 
														b.get_p1(),  b.get_p2());
	},
	
	// check collision between rectangle and line
	_test_collision_rect_line: function (rect, line)
	{
		// get the line's two points
		var p1 = line.get_p1();
		var p2 = line.get_p2();
		
		// first check if one of the line points is contained inside the rectangle
		if (SSCD.CollisionManager._test_collision_rect_vector(rect, p1) || 
			SSCD.CollisionManager._test_collision_rect_vector(rect, p2))
			{
				return true;
			}
		
		// now check collision between line and rect lines
		
		// left side
		var r1 = rect.get_top_left();
		var r2 = rect.get_bottom_left();
		if (SSCD.Math.line_intersects(p1, p2, r1, r2))
		{
			return true;
		}
		
		// right side
		var r3 = rect.get_top_right();
		var r4 = rect.get_bottom_right();
		if (SSCD.Math.line_intersects(p1, p2, r3, r4))
		{
			return true;
		}

		// top side
		if (SSCD.Math.line_intersects(p1, p2, r1, r3))
		{
			return true;
		}
		
		// bottom side
		if (SSCD.Math.line_intersects(p1, p2, r2, r4))
		{
			return true;
		}
		
		// no collision
		return false;
	},
	
	// test collision between rectagnle and linesstrip
	_test_collision_rect_linestrip: function(rect, linesstrip)
	{
		// first check all points
		var points = linesstrip.get_abs_points();
		for (var i = 0; i < points.length; ++i)
		{
			if (this._test_collision_rect_vector(rect, points[i]))
			{
				return true;
			}
		}
		
		// now check intersection with rectangle sides
		
		var r1 = rect.get_top_left();
		var r2 = rect.get_bottom_left();
		var r3 = rect.get_top_right();
		var r4 = rect.get_bottom_right();
		
		var lines = linesstrip.get_abs_lines();
		for (var i = 0; i < lines.length; ++i)
		{
			var p1 = lines[i][0];
			var p2 = lines[i][1];
			
			// left side
			if (SSCD.Math.line_intersects(p1, p2, r1, r2))
			{
				return true;
			}
			
			// right side
			if (SSCD.Math.line_intersects(p1, p2, r3, r4))
			{
				return true;
			}

			// top side
			if (SSCD.Math.line_intersects(p1, p2, r1, r3))
			{
				return true;
			}
			
			// bottom side
			if (SSCD.Math.line_intersects(p1, p2, r2, r4))
			{
				return true;
			}
		}
			
		// no collision
		return false;
	},
	
	// test collision between two linestrips
	_test_collision_linestrip_linestrip: function (strip1, strip2)
	{
		var lines1 = strip1.get_abs_lines();
		var lines2 = strip2.get_abs_lines();
		for (var i = 0; i < lines1.length; ++i)
		{
				for (var j = 0; j < lines2.length; ++j)
				{
					if (SSCD.Math.line_intersects(	lines1[i][0], lines1[i][1],
																lines2[j][0], lines2[j][1]))
																{
																	return true;
																}
				}
		}
		return false;
	},
	
	// test composite shape with any other shape
	_test_collision_composite_shape: function(composite, other)
	{
		// get all shapes in composite shape
		var comp_shapes = composite.get_shapes();
		
		// special case: other shape is a composite shape as well
		if (other.__collision_type == "composite-shape")
		{
			var other_shapes = other.get_shapes();
			for (var i = 0; i < comp_shapes.length; ++i)
			{
				for (var j = 0; j < other_shapes.length; ++j)
				{
					if (SSCD.CollisionManager.test_collision(comp_shapes[i], other_shapes[j]))
					{
						return true;
					}
				}
			}
		}
		// normal case - other shape is a normal shape
		else
		{
			for (var i = 0; i < comp_shapes.length; ++i)
			{
				if (SSCD.CollisionManager.test_collision(comp_shapes[i], other))
				{
					return true;
				}
			}
		}
		
		// no collision found
		return false;
		
	},
	
	// test collision between circle and rectangle
	_test_collision_circle_rect: function (circle, rect)
	{
		// get circle center
		var circle_pos = circle.__position;
		
		// first check if circle center is inside the rectangle - easy case
		var collide = SSCD.CollisionManager._test_collision_rect_vector(rect, circle_pos);
		if (collide)
		{
			return true;
		}
		
		// get rectangle center
		var rect_center = rect.get_abs_center();
		
		// now check other simple case - collision between rect center and circle
		var collide = SSCD.CollisionManager._test_collision_circle_vector(circle, rect_center);
		if (collide)
		{
			return true;
		}
		
		// create a list of lines to check (in the rectangle) based on circle position to rect center
		var lines = [];
		if (rect_center.x > circle_pos.x)
		{
			lines.push([rect.get_top_left(), rect.get_bottom_left()]);
		}
		else
		{
			lines.push([rect.get_top_right(), rect.get_bottom_right()]);
		}
		if (rect_center.y > circle_pos.y)
		{
			lines.push([rect.get_top_left(), rect.get_top_right()]);
		}
		else
		{
			lines.push([rect.get_bottom_left(), rect.get_bottom_right()]);
		}
		
		// now check intersection between circle and each of the rectangle lines
		for (var i = 0; i < lines.length; ++i)
		{
			var dist_to_line = SSCD.Math.distance_to_line(circle_pos, lines[i][0], lines[i][1]);
			if (dist_to_line <= circle.__radius)
			{
				return true;
			}
		}
		
		// no collision..
		return false;		
	},
	
	// test collision between circle and rectangle
	_test_collision_rect_rect: function (a, b)
	{
		var r1 = {	left: a.__position.x, right: a.__position.x + a.__size.x, 
						top: a.__position.y, bottom: a.__position.y + a.__size.y};
		var r2 = {	left: b.__position.x, right: b.__position.x + b.__size.x, 
						top: b.__position.y, bottom: b.__position.y + b.__size.y};
		return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
	},
};

// exception when trying to check collision on shapes not supported
SSCD.UnsupportedShapes = function (a, b) {
    this.name = "Unsupported Shapes";
    this.message = "Unsupported shapes collision test! '" + a.get_name() + "' <-> '" + b.get_name() + "'.";
};
SSCD.UnsupportedShapes.prototype = Error.prototype;

