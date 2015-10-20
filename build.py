# a quick and dirty python script to build.

import os
import sys
import requests

def minifiy_js(code):
    '''
    minify and return javascript code
    '''
    r = requests.post("http://javascript-minifier.com/raw", data={'input': code})
    r.raise_for_status()
    return r.text

# combine all code into a single file
full_code = ""
for file in [
        "license.js",
        "sscd.js",
	"utils/math.js",
	"utils/vector.js",
	"utils/extend.js",
	"utils/aabb.js",
        "world.js",
        "tilemap.js",
	"shapes/shape.js",
	"shapes/circle.js",
	"shapes/rectangle.js",
	"shapes/line.js",
	"shapes/lines_strip.js",
	"shapes/composite_shape.js",
        "shapes/capsule.js",
	"shapes/shapes_collider.js",
        "packages/npm.js"]:
    with open(os.path.join("src", file), 'r') as src:
        full_code += "// FILE: " + file + "\r\n\r\n"
        full_code += src.read() + "\r\n\r\n"

# write full version
dest = open('dist/dev/sscd.dev.js', 'w')
dest.write(full_code)
dest.close()

# minify and write minified version
dest = open('dist/dev/sscd.dev.min.js', 'w')
minified = minifiy_js(full_code)
dest.write(minified)
dest.close()
