/*
 * a special shape made from multiple shapes combined together
 * Author: Ronen Ness, 2015
 */
 
// create a capsule shape. implemented by a composite-shape with two circles and a rectangle.
// @param position - optional starting position (vector)
// @param size - size in pixels (vector)
// @param standing - if true, capsule will be standing. else, will lie down. (default: true)
SSCD.Capsule = function(position, size, standing) {
	// call init chain
	this.init();

	// default standing
	if (standing === undefined) standing = true;

	// create objects
	objects = [];
	if (standing) {
		size = size.clone();
		size.y -= size.x;
		objects.push(new SSCD.Rectangle(new SSCD.Vector(-size.x * 0.5, -size.y * 0.5), size));
		objects.push(new SSCD.Circle(new SSCD.Vector(0, -size.y * 0.5), size.x * 0.5));
		objects.push(new SSCD.Circle(new SSCD.Vector(0, size.y * 0.5), size.x * 0.5));
	} else {
		size = size.clone();
		size.y -= size.x;
		objects.push(new SSCD.Rectangle(new SSCD.Vector(-size.y * 0.5, -size.x * 0.5), size.flip()));
		objects.push(new SSCD.Circle(new SSCD.Vector(-size.y * 0.5, 0), size.x * 0.5));
		objects.push(new SSCD.Circle(new SSCD.Vector(size.y * 0.5, 0), size.x * 0.5));
	}

	// init composite shape
	this.__init_comp_shape(position, objects);
};

// Capsule prototype
SSCD.Capsule.prototype = {

	__type: "capsule",

};

// inherit from CompositeShape class.
// this will fill the missing functions from parent, but will not replace functions existing in child.
SSCD.extend(SSCD.CompositeShape.prototype, SSCD.Capsule.prototype);