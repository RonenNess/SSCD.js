# SSCD - Super Simple Collision Detection
This lib provide a simple 2d collision detection for JavaScript games.

## Table of Contents

- [What is it?](#what-is-it)
- [What is it not?](#what-is-it-not)
- [Key Features](#key-features)
- [How to use](#how-to-use)
- [License](#license)
- [Contact Me](#contact-me)

*TOC generated with [DocToc](http://doctoc.herokuapp.com/)*

## What is it?
Collision detection is the functionality of detecting when one shape intersects with another. This is what SSCD is all about.

## What is it not?
This lib is NOT a physics engine; It does not handle things like forces, friction, gravity Etc. 
It is meant to be extremely simple and lightweight, and provide only the necessary functionality for collision detection.

## Key Features
The following are the key features of SSCD:

- Collision detection with the following build-in shapes:
- - Points
- - Circles
- - Rectangles
- - Lines
- - Line strips (for complex shapes)
- - Composite shapes
- - Capsule
- Collision-World manager to hold and manage all collision shapes.
- Grid-based optimizations for efficient collision testing.
- Can easily handle massive worlds with lots of shapes.
- Collision filters and tags.
- Built-in debug rendering to show the collision world with all the objects in it (+ camera support).
- Built-in tilemap collision world for 2d rpg games.
- Lightweight minimalistic API.

SSCD should work on all modern browsers, and its tested and confirmed on Chrome, FireFox, and Internet Explorer 11.

## How to use

### For node.js

First install from npm:

    npm install sscd

Then require sscd like this:

```javascript
    var SSCD = require('sscd').sscd;
```
You can now access SSCD same way you would from a browser.

### For browsers

First get the latest version of SSCD from dist/ folder in this git and include it to your html header like this (note the version number):

```html
<script src="sscd.1.0.min.js"></script>
```

Or if you want the unminified version:

```html
<script src="sscd.1.0.js"></script>
```

You can also get SSCD from npm:

        npm install sscd

After including SSCD javascript in your page all you have to do is create a collision world, add some shapes to it, and test collisions.

### Quick example

Let's start with a minimal working example - collision a point with a circle:

```javascript
var world = new SSCD.World();
world.add(new SSCD.Circle(new SSCD.Vector(100, 100), 75));
if (world.test_collision(new SSCD.Vector(105, 125)))
{
	alert("Collision!")
}
```

The example above will pop an alert saying "Collision!", since position 105,125 collide with the single circle that is in the collision world.

### SSCD Tutorial

The following tutorial will cover all the basics of SSCD. The tutorial is fairly short so please take the 5 minutes required to read it :)

Also note the examples in the examples/ folder, they are very useful.

#### What is the collision world?

A collision world is a class that manage all your shapes and test collision between them, on demand, in an efficient way.
It makes sense to create separate collision world for every level in your game, and add collision shapes for all the walls and blocking objects in it.

Note that a collision world is not mandatory (you can create and test shapes outside any world instance), but using collision world will most likely be more efficient (it has grid-base optimizations) and it simplify everything. 

#### Create collision world and add shapes to it

First step to use SSCD is to create a collision world:

```javascript
var world = new SSCD.World({grid_size: 400});
```

Now we can add shapes to this world and use it to test collisions.

The grid_size param determine the size of the grid SSCD use for collision optimization.
Choose grid size that is about 4-5 times the size of your most common game object (in pixels). 
For example, if you have lots of trees in the size of 100x100, a grid size of 450 should be pretty good.
	
Now lets add some collision shapes to it - a Circle, Rectangle, and a Line:

```javascript
world.add(new SSCD.Circle(new SSCD.Vector(100, 380), 75));
world.add(new SSCD.Rectangle(new SSCD.Vector(210, 300), new SSCD.Vector(190, 150)));
world.add(new SSCD.Line(new SSCD.Vector(450, 300), new SSCD.Vector(100, 120)));
```

These shapes will be added to the world and you can now use the world to test collision against them.

Note that you can also create these shapes without adding them to the world, and test them individually against each other.

#### Testing collision

Now that we have some shapes we can start testing collision. This is how you test collision for a given point (in this case x = 100, y = 380):

```javascript
if (world.test_collision(new SSCD.Vector(100, 380)))
{
	console.debug("Collided!");
}
```

And if you want to get the list of shapes you collided with, you can pass a list as additional parameter (ignore the undefined param for now, we will explore it later):

```javascript
var collision_list = [];
if (world.test_collision(new SSCD.Vector(100, 380), undefined, collision_list))
{
	console.debug("Collided with: ", collision_list);
}
```

When testing collision, you don't have to use a vector. You can test collision for any type of shape.
For example, to test collision for a rectangle in the size of 50x50 pixels and position 100,380:

```javascript
var rect = new SSCD.Rectangle(new SSCD.Vector(100, 380), new SSCD.Vector(50, 50));
if (world.test_collision(rect))
{
	console.debug("Rectangle Collided!");
}
```

Another important functionality is object picking.
Object picking will check collision and return only the first object we collided with (or null if don't collide with anything). Object picking is usually faster than returning a list of collision objects, and can make your code more elegant:

```javascript
console.debug("Collide with: " + world.pick_object(new SSCD.Vector(100, 380));
```

The code above will either print the first object collided with or 'null' if nothing collided.
	
#### Built-In Shapes

The following is examples of how to use all the built-in shapes.

##### Circle

A simple circle shape. First param is the center or the circle, second param is radius.

```javascript
world.add(new SSCD.Circle(new SSCD.Vector(100, 380), 75));
```

##### Rectangle

A simple rectangle. First param is position, second param is size.

```javascript
world.add(new SSCD.Rectangle(new SSCD.Vector(210, 300), new SSCD.Vector(190, 150)));
```

##### Line

A line between two points

```javascript
world.add(new SSCD.Line(new SSCD.Vector(450, 300), new SSCD.Vector(100, 120)));
```

##### Line Strip

Line Strip is a string of lines, made from a list of vectors. Last param is weather or not to close the shape, eg add a line between starting point with last point:

```javascript
world.add(new SSCD.LineStrip(new SSCD.Vector(100, 100), 
									[new SSCD.Vector(100, 0), new SSCD.Vector(0, 100), new SSCD.Vector(100, 100)], false));
```

If last parameter is true, the line-strip will close itself automatically, meaning it will create additional line between the first and last point.

##### Composite shape

Composite shape is a shape made from a group of other shapes, that act as a single object:

```javascript
var comp = world.add(new SSCD.CompositeShape());
comp.add(new SSCD.Circle(new SSCD.Vector(150, 150), 100));
comp.add(new SSCD.Rectangle(new SSCD.Vector(100, 125), new SSCD.Vector(90, 90)));
```

When you move the composite shape all the shapes inside it will move accordingly.
Note that when you add a shape to a composite shape, the composite shape takes the child shape position and keep it as the offset from the composite-shape origin.
So if you add a circle to a composite shape when the circle position is 100,100, when you move the composite shape to position 50,50, the circle absolute position will be 100,100 + 50,50 = 150,150.

##### Capsule

Capsule is a shape composed by two circles and a rectangle:

```javascript
world.add(new SSCD.Capsule(new SSCD.Vector(1160, 350), new SSCD.Vector(100, 180), true));
```

This shape is ideal for platformer characters, because it describe a standing object but have smooth top and smooth bottom which allow the shape to 'slide' over small gaps and height differences.
Last param (boolean) determine if the capsule is standing or lying down (true = standing).

Note: Capsule is a sub-class of the composite-shape and share the same API. So you can add more shapes to the capsule in runtime.


#### Move shapes

You can move shapes after creating them by using .move(vector), or set their absolute position (relative to top-left corner) using .set_position(vector).

#### Render for debug

It's very useful to see all the shapes you have in your collision world. For that purpose, the SSCD world comes with a built-in debug render functions.

To render the collision world with all the shapes in it, simply use:

```javascript
world.render(canvas);
```

Where canvas is an HTML5 canvas element.
Note that if you already got context of this canvas for anything other than "2d", this render won't work on all browsers.

##### Render with camera

In most 2d games the actual level is much larger than the screen screen, and you navigate in it using a "camera" or a viewport. 
If you want to render the collision world based on a camera position, you can pass camera position as additional parameter (vector), like so:

```javascript
world.render(canvas, new SSCD.Vector(cam_pos_x, cam_pos_y));
```

##### Shapes rendering color

Note that shapes rendering color is based on their collision tags (will be covered shortly), but you can override the color of individual shapes if you need to highlight them:

```javascript
var fill = "rgba(255,255,255,1.0)";
var stroke = "black";
some_shape.set_debug_render_colors(fill, stroke);
```

#### Collision tags and filters

In some cases you might need to test collision with only a specific group of objects in the world, and not all of the shapes.

For example, in a shooting game you might want to add a special bullet that can pass through walls. In this case, you would want to test collision with enemies but not with walls.
To do this type of filtering, you can use **collision tags**. 

Collision tags are simply strings you can attach to objects, and when testing collision you can filter by them.

##### Tagging an object

You can only tag shapes that are inside a collision world, so be sure to add them first. To tag a shape, use the function .set_collision_tags():

```javascript
var wall = world.add(new SSCD.Rectangle(new SSCD.Vector(210, 300), new SSCD.Vector(190, 150)));
wall.set_collision_tags("wall");
```

The code above will tag the shape as a "wall". Easy, isn't it?
If you tried applying tags while rendering the collision world, you will notice it changes the shapes rendering color. This help to distinguish between shapes of different tags.

You can also apply multiple tags on a single shape, by providing a list of strings:

```javascript
var wall = world.add(new SSCD.Rectangle(new SSCD.Vector(210, 300), new SSCD.Vector(190, 150)));
wall.set_collision_tags(["wall", "glass"]);
```

Now the shape will be tagged as both "wall" and "glass". So if you filter by any of these tags, this shape will be a valid candidate for collision.

##### Filter by tags

When testing collision, you can filter which tags to test, by passing a tag parameter:

```javascript
if (world.test_collision(new SSCD.Vector(100, 380), "wall"))
{
	console.debug("This will collide only with walls.");
}
```

And similar to shapes, you can also pass a list of tags:

```javascript
if (world.test_collision(new SSCD.Vector(100, 380), ["wall", "glass"]))
{
	console.debug("This will collide with either walls or glasses (or both).");
}
```

By default, all new shapes will be accepted on all tags, unless you assign them a specific tag. So the example above will also collide with untagged shapes.

It's important to remember that due to internal optimizations you are limited to 32* different tags (theoretically more, its based on platform and browser, but 32 is a safe minimal value for all machines).

### Resolve penetration (or: penetration prevention)

While resolving penetration is a little bit outside of SSCD scope, the framework does provide a helper function to get you started.
Every shape has a repel() function that will repel/push an object outside of the shape center. You can use this function to prevent players from walking through walls, or even push them back from bullets.

Here's a quick example of how to use repel() to resolve penetration (player_shape is the collision shape representing the player):

```javascript
// pick object player collide with
var collide_with = world.pick_object(player_shape);

// if object found, use repel to prevent penetration
if (collide_with)
{
	collide_with.repel(player_shape, 10, 5);
	
	// here we will update the position of the player sprite to match its collision body..
}
```

As you can see repel() is very simple. 

First parameter is which shape or vector to push away (repel), second parameter is pushing force, and last parameter is how many iterations of repel to run (every iteration will check if the shapes still collide and will only push if they do).
You can play with the force and number of iterations to balance between performance and accuracy.  Weak force with lots of iterations will be smoother but more heavier to process, strong force with few iterations will be faster but more jumpy.

#### repel both ways

repel() accept two additional parameters we didn't mention before: factor_self and factor_other.

*factor_self* is a multiplier factor for the repelling force to apply on self while repelling. By default factor_self is 0, meaning the object that is doing the repelling will not be affected by it and will only push the other shape. 
*factor_other* is the multiplier for repelling the other object, which defaults to 1.

So if you want to do a repelling force that will move both objects away from each other, equally, you can set both factors to 1:

```javascript

monster.repel(player_shape, 10, 5, 1, 1);

```

In the example above player_shape and monster will push each other and both move.

You can also use these factors to simulate mass differences, eg one object being "heavier" than the other:

```javascript

var monster_mass = 120;
var player_mass = 80;
monster.repel(player_shape, 10, 5, player_mass / monster_mass, monster_mass / player_mass);

```

Note that while this method is good enough to get you started, for a serious game you might want to consider using a fully featured physics engine. If you start thinking about masses, friction, velocity etc, switch to physics...

### Tilemap

Most 2d rpg games are based on a simple tilemap, which is implemented by a 2d matrix of tiles that can either block or not.

For this purpose SSCD comes with a built-in tilemap world, which is a sub-class of the collision world but with extra tilemap helper functions and optimizations.

You create a tilemap world like this:

```javascript
var world = new SSCD.TilemapWorld(tile_size);
```

The tilemap world has the same API as the default collision world, with the following additions:

##### .set_from_matrix(matrix)

This function set the tilemap from a given matrix (array of arrays), where every cell is either 0 or 1 (0 = no collision/floor, 1 = collision/walls).

##### .set_tile(index, collision, tags)

Set the state of a single tile. Index is the tile index (vector), collision is a boolean (should collide or not), and tags are optional tags to set to tile.

##### .get_tile(index)

Get the shape of a given tile, or undefined if this tile is not collideable.

### Memory usage

SSCD is very memory-efficient, and should not cause any memory-related issues.

However, note that the world grid does not clean itself automatically, meaning that if you move objects around, over time you will get some empty world chunks unused.
Those empty grid chunks are left undeleted by design; they take really small amount of memory and by leaving them in memory its quicker to move objects in and out of them.

If this tiny memory waste bothers you (might be relevant if you have a single world that exists for a very, very long periods of time), you can make the collision world clean up itself by calling .cleanup():

```javascript
world.cleanup();
```

## Changelog

### 1.1

- Added repel() to shapes.
- Improved some performance, especially with moving objects aabb calculations.
- Fixed debug coloring bug with composite shapes.
- Added another example with resolving penetration.
- Extended Vectors API.
- Added render bounding-box functionality to all shapes.
- Fixed world render function to accept if should render grid and bounding boxes.

### 1.2

- Fixed ret_obj_count param that was mistakenly ignored before. This should make pick_object a lot more faster.
- Added grid_error optimization (good for moving lots of large objects by small steps).
- Added performance examples.

Note: building this version before attempting to become npm compliance.

### 1.3

- Fixed potential bug that vector of (0, 0) turns NaN on normalize. This caused issues when trying to prevent penetration between two objects with the same center.
- Fixed some javascript warnings etc.
- Made fully npm compatible.
- Added factor_self & factor_other to repel(), which make it possible for objects to repel each other simultaneously.

### 1.4

- Added capsule shape.
- Added tilemap world.
- Fixed bug that factor_self and factor_other not working in composite-shape repel().
- Added option to set collision tags to null for quick reset.
- Docs update.
	
### 1.5

- Minor optimization in collision detection by ditching "instanceof"
- Added field-of-view test.
- Fixed bug with line collision when line goes backwards.
- Some docs update.
- Fixed Vector.from_angle() to be really angle and not radian. added radian in addition.
- All code had been beautified.

## License
SSCD is provided under the zlib-license, and is absolutely free for use for educational & commercial purposes.
See LICENSE.txt for more info.

## Contact Me

For issues / bugs use the Report Issue button.

For anything else, feel free to contact me: ronenness@gmail.com.


