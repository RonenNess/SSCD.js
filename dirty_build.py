# a quick and dirty python script to build.

import os
import sys

dest = open('dist/sscd.dev.js', 'w')

for file in [
        "license.js",
        "world.js",
	"utils/math.js",
	"utils/vector.js",
	"utils/extend.js",
	"utils/aabb.js",
	"shapes/shape.js",
	"shapes/circle.js",
	"shapes/rectangle.js",
	"shapes/line.js",
	"shapes/lines_strip.js",
	"shapes/composite_shape.js",
	"shapes/shapes_collider.js"]:
    with open(os.path.join("src", file), 'r') as src:
        dest.write("// FILE: " + file + "\r\n\r\n")
        dest.write(src.read() + "\r\n\r\n")
    
