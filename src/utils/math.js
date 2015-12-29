/*
 * Some useful Math functions.
 * Author: Ronen Ness, 2015
 */
 
// set namespace
SSCD.Math = {};

// Converts from degrees to radians.
SSCD.Math.to_radians = function(degrees) {
	return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
SSCD.Math.to_degrees = function(radians) {
	return radians * 180 / Math.PI;
};

// get distance between vectors
SSCD.Math.distance = function(p1, p2) {
	var dx = p2.x - p1.x,
		dy = p2.y - p1.y;
	return Math.sqrt(dx * dx + dy * dy);
};

// get distance without sqrt
SSCD.Math.dist2 = function(p1, p2) {
	var dx = p2.x - p1.x,
		dy = p2.y - p1.y;
	return (dx * dx + dy * dy);
};

// angle between two vectors
SSCD.Math.angle = function(P1, P2) {
	var deltaY = P2.y - P1.y,
		deltaX = P2.x - P1.x;

	return Math.atan2(deltaY, deltaX) * 180 / Math.PI;
};

// distance from point to line
// p is point to check
// v and w are the two edges of the line segment
SSCD.Math.distance_to_line = function(p, v, w) {

	var l2 = SSCD.Math.dist2(v, w);
	var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
	if (t < 0) {
		return SSCD.Math.distance(p, v);
	}
	if (t > 1) {
		return SSCD.Math.distance(p, w);
	}
	return SSCD.Math.distance(p, {
		x: v.x + t * (w.x - v.x),
		y: v.y + t * (w.y - v.y)
	});
};

// Adapted from: http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
// check if two lines intersect
SSCD.Math.line_intersects = function(p0, p1, p2, p3) {

	var s1_x, s1_y, s2_x, s2_y;
	s1_x = p1.x - p0.x;
	s1_y = p1.y - p0.y;
	s2_x = p3.x - p2.x;
	s2_y = p3.y - p2.y;

	var s, t;
	s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y);
	t = (s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);

	if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
		// Collision detected
		return 1;
	}

	return 0; // No collision
};

// return if point is on given line
SSCD.Math.is_on_line = function(v, l1, l2) {
	return SSCD.Math.distance_to_line(v, l1, l2) <= 5;
};


// return shortest, positive distance between two given angles.
// for example:
//  50, 100 will return 50
//  350, 10 will return 20
// angles shoule be in 0-360 values (but negatives and >360 allowed as well)
SSCD.Math.angles_dis = function(a0, a1) {

	// convert to radians
	a0 = SSCD.Math.to_radians(a0);
	a1 = SSCD.Math.to_radians(a1);

	// get distance
	var max = Math.PI * 2;
	var da = (a1 - a0) % max;
	var distance = 2 * da % max - da;

	// convert back to degrees
	distance = SSCD.Math.to_degrees(distance);

	// return abs value
	return Math.abs(distance);
};