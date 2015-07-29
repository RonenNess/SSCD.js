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

- Collision detection with the following shapes:
- - Points
- - Circles
- - Rectangles
- - Lines
- - Line strips (for complex shapes)
- - Composite shapes
- Collision-World manager to hold and manage all collision shapes.
- Grid-based optimizations for efficient collision testing.
- Can easily handle massive worlds with lots of shapes.
- Collision filters and tags.
- Built-in debug rendering to show the collision world with all the objects in it (+ camera support).
- Lightweight minimalistic API.

SSCD should work on all modern browsers, and its tested and confirmed on Chrome, FireFox, and Internet Explorer 11.


## How to use

First get the latest version of SSCD from dist/ folder in this git, and include it to your html header like this:

```html
<script src="sscd.1.0.min.js"></script>
```

Or

```html
<script src="sscd.1.0.js"></script>
```

For un-minified version.

Now all you have to do is create a collision world, add some shapes to it, and test collisions.

### Quick example

Let's start with a minimal working example - collision with a single circle:

```javascript
var world = new SSCD.World();
world.add(new SSCD.Circle(new SSCD.Vector(100, 100), 75));
if (world.test_collision(new SSCD.Vector(105, 125)))
{
	alert("Yeah!")
}
```

The example above will pop an alert saying "Yeah!", since position 105,125 collide with the single circle that is in the collision world.

### SSCD Tutorial

The following tutorial will cover all the basics of SSCD. The tutorial is fairly short so please take the 5 minutes required to read it :)

Also note the examples in the examples/ folder, they are very useful.

#### Create collision world and add shapes

First step to use SSCD is to create a collision world:

```javascript
var world = new SSCD.World({grid_size: 400});
```

Grid size determine the size of the grid SSCD use for collision optimization.
Choose grid size that is about 4-5 times the size of your most common game object (in pixels). 
For example, if you have lots of trees in the size of 100x100, grid size of 450 should be pretty good.
	
Now lets add some collision shapes to it - a Circle, Rectangle, and a Line:

```javascript
world.add(new SSCD.Circle(new SSCD.Vector(100, 380), 75));
world.add(new SSCD.Rectangle(new SSCD.Vector(210, 300), new SSCD.Vector(190, 150)));
world.add(new SSCD.Line(new SSCD.Vector(450, 300), new SSCD.Vector(100, 120)));
```

Note that you can also create shapes outside any collision world and match them individually against each other. But normally you wouldn't want to do that.

#### Testing collision

Now that we got some shapes we can start testing collision. This is how you test collision for a given point (in this case x = 100, y = 380):

```javascript
if (world.test_collision(new SSCD.Vector(100, 380)))
{
	console.debug("Yeah! Collided!");
}
```

In some cases you would want to get the objects you collided with. To do so, you can pass a list that will be filled with them (ignore the middle undefined parameter for now):

```javascript
var collision_list = [];
if (world.test_collision(new SSCD.Vector(100, 380), undefined, collision_list))
{
	console.debug("Collided with: ", collision_list);
}
```

You can also use any collision shape to test collision. 
For example, here we test collision for a rectangle in the size of 50x50 pixels and position 100,380:
```javascript
var rect = new SSCD.Rectangle(new SSCD.Vector(100, 380), new SSCD.Vector(50, 50));
if (world.test_collision(rect))
{
	console.debug("Rectangle Collided!");
}
```

Another important functionality is object picking. 
Object picking will check collision and return only the first object we collide with (or null if don't collide with anything).
To do object picking use:

```javascript
var obj = world.pick_object(new SSCD.Vector(100, 380));
console.debug(obj);
```

The code above will either print the first object collided or 'null' if nothing collided.
	
#### Other shapes

If you need more complicated shapes you can also use the following shapes:

##### Line Strip

Line Strip is a string of lines, made from a list of vectors:

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

#### Move shapes

You can move shapes after creating them by using .move(vector), or you can set their absolute position relative to top-left corner with .set_position(vector).

#### Render for debug

It's very useful to see the shapes you set-up in your collision world. To render the collision world with all the shapes in it, simply use:

```javascript
world.render(canvas);
```

Where canvas is an HTML5 canvas element.
In most 2d games the actual level is larger than the screen, and you navigate in it using a camera. If you want to render the collision world based on a camera position, you can pass camera as a second argument (as vector), like so:

```javascript
world.render(canvas, new SSCD.Vector(cam_pos_x, cam_pos_y));
```

Note that shapes rendering color is based on their collision tags (up next), but you can override individual shapes color if you want:

```javascript
var fill = "rgba(255,255,255,1.0)";
var stroke = "black";
shape.set_debug_render_colors(fill, stroke);
```

#### Collision tags and filters

In some cases you might want to test collision against a specific set of objects in the world, based on their "type" or category. 

For example, if you develop a shooting game you might want to create a special bullet that can pass through walls. As they fly, these bullets will test collision against enemies, but not against walls.
To do this type of filtering, you can use collision tags. 

Collision tags are simply string tags you can attach to objects and when checking collision you can filter them out.

##### Tagging an object

Lets give a single tag to a shape:

```javascript
// NOTE: you can only tag objects that are inside a collision world.
var wall = world.add(new SSCD.Rectangle(new SSCD.Vector(210, 300), new SSCD.Vector(190, 150)));
wall.set_collision_tags("wall");
```

The code above will tag the shape as a "wall". Easy, isn't it?

If you try applying tags while rendering the collision world, you will notice it will change their default rendering color. This help you distinguish between shapes of different tags.

You can also apply multiple tags to a single shape, by providing a list of strings:

```javascript
var wall = world.add(new SSCD.Rectangle(new SSCD.Vector(210, 300), new SSCD.Vector(190, 150)));
wall.set_collision_tags(["wall", "glass"]);
```

Now the shape will be tagged as both "wall" AND "glass". So if you filter against any of these tags, this shape will be a valid candidate for collision.

##### Filter by tags

When testing collision, you can filter which tags to test, like this:

```javascript
if (world.test_collision(new SSCD.Vector(100, 380), "wall"))
{
	console.debug("This will collide only with walls.");
}
```

And similar to shapes, you can use multiple tags:

```javascript
if (world.test_collision(new SSCD.Vector(100, 380), ["wall", "glass"]))
{
	console.debug("This will collide with either walls or glasses (or both).");
}
```

That's it. You can use any string as tag and they don't need any special initialize, just use them.
All new shapes are tagged as everything by default, and all collision tests will accept any tag unless stated otherwise.
Note however that you are limited to only *32 different tags. (*can be more on some OS and browsers, but 32 is a safe number that should work for all machines).

### Resolve penetration

While resolving penetration is a little bit outside SSCD scope, the framework does provide a helper function to get you started.
Every shape has a repel() function that will repel/push an object outside of the center of the shape.

Here's a quick example of how you can use it to resolve penetration, assuming player_shape is the shape representing player collision:

```javascript
// pick object player collide with
var collide_with = world.pick_object(player_shape);

// if object found, use repel to prevent penetration
if (collide_with)
{
	collide_with.repel(player_shape, 1, 1);
	
	// here we will set the position of the player sprite to match its collision body..
}
```

As you can see repel() is very simple. First param is which shape or vector to push outside, second param is pushing force, and last param is how many iterations of repel to run, while every iteration we check and if no longer collide we stop pushing.

Note that while this method is good enough to get you started, for a serious game you'd probably want to implement a better penetration resolving algorithm.

### Memory usage

SSCD is very memory-efficient, and should not pose any problems.
However, note that the world grid does not clean itself automatically, meaning that if you move objects around over time you will get some empty world chunks.
Those empty grid chunks are left by design; they take really small amount of memory and by leaving them in memory its quicker to move objects back into them.

If this insignificant memory waste really bother you, you can tell the collision world to cleanup any unused grid chunks by calling:

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
	
## License
SSCD is provided under the zlib-license, and is absolutely free for use for educational & commercial purposes.
See LICENSE.txt for more info.

## Contact Me

For issues / bugs use the Report Issue button.

For anything else, feel free to contact me: ronenness@gmail.com.


