// Import stylesheets
import './style.css';
import PIXI from 'pixi.js'
import planck from "planck-js"


const appDiv = document.querySelector('#app');
const renderer = new PIXI.Renderer({width: 600, height: 400, backgroundColor: 0x000000 });
document.body.appendChild(renderer.view);
const loader = PIXI.Loader.shared;
// Layer our scene with containers
const stage = new PIXI.Container();				// Everything ends up here.
const spriteLayer = new PIXI.Container();		// Sprites in here.
stage.addChild(spriteLayer);
const debugLayer = new PIXI.Container();		// Outlines/planck shapes.
stage.addChild(debugLayer);
const uiLayer = new PIXI.Container();			// Text UI on top
stage.addChild(uiLayer);
const boundaryGraphics = new PIXI.Graphics();	// our stage boundaries are on their own graphics object we handle
debugLayer.addChild(boundaryGraphics);			// in the way planck.js provides us


let PixelsPerMeter = 50;					// How many pixels represent 1 meter.
let MetersPerPixel = 1/PixelsPerMeter;		// And the reverse.
let drawLines = false;						// Draw Debug lines
// Timing
let gameTime = 0;							// Elapsed time since updating began.
let lastTime = 0;
let frameTime = 0;
let accumulator = 0;
let physicsSteps = 60;						// How many physics steps per second.
let timestep = 1000/physicsSteps;			//
let deltaTime = timestep/1000;				// Since we're fixed, we don't need to divide constantly during simulation.
// Settings
let interpolation = true;					// Draw PIXI objects between physics states for smoother animation.
let forceStrength = 20;						// How much power our bunnies posses.
let deleteQueued = false;					// Destroying stuff during a physics step would be crashy.
let deleteAll = false;						// Flag to remove all objects next cycle (again, input polling it outside main loop, so we have to handle this cleanly)
let bulletMode = false;						// Flag new objects as bullets (prevents tunneling, but is harsh on performance)

// Our main Box2D world.
let world = planck.World({
  gravity: planck.Vec2(0,0)				// approximate normal earth gravity
});

let gameObjects = [];						// Our list of GameObject instances.

let ground = world.createBody({				// The confinement area for our sandbox
  userData: {
    myType: "boundary",
    label:"ground"
  }
});
// Shortcuts because lazy
const topLeft = planck.Vec2(MetersPerPixel,MetersPerPixel);
const topRight = planck.Vec2((renderer.screen.width)*MetersPerPixel,MetersPerPixel);
const bottomLeft = planck.Vec2(MetersPerPixel,(renderer.screen.height)*MetersPerPixel);
const bottomRight = planck.Vec2((renderer.screen.width)*MetersPerPixel,(renderer.screen.height)*MetersPerPixel);
// generate the fixtures on our ground body, one for each side of the room.
ground.createFixture(planck.Edge(topLeft,topRight));
ground.createFixture(planck.Edge(topRight,bottomRight));
ground.createFixture(planck.Edge(bottomRight,bottomLeft));
ground.createFixture(planck.Edge(bottomLeft,topLeft));

// The bread and butter.  This is (hopefully) a proper game loop, if I learned anything from the gaffer.
function step(t) {
  requestAnimationFrame(step);
  if(deleteQueued) {
    if(gameObjects.length) {
      gameObjects[0].destroy();
      gameObjects.splice(0,1);
    }
    deleteQueued = false; // dequeue if nothing is available
  }
  if(deleteAll) {
    for(let o = 0; o < gameObjects.length; o++) {
      gameObjects[o].destroy();
    }
    gameObjects = [];
    deleteAll = false;
  }
  if(lastTime) {
    frameTime = t - lastTime;
    if(frameTime > 100) { // Panic! In this state, we need to start removing objects!
      frameTime = 100;
      if(gameObjects.length) {
        gameObjects[0].destroy();
        gameObjects.splice(0,1);
        if(gameObjects.length > 10) {		// Be more aggressive.
          for(let d = 0; d < 10; d++) {
            gameObjects[0].destroy();
            gameObjects.splice(0,1);
          }
        }
      }
    }
    accumulator += frameTime;
    while(accumulator >= timestep) {
      // walk in reverse since we could be splicing.
      for(let o = gameObjects.length - 1; o >= 0; o--) {
        // delete objects flagged out of bounds
        if(gameObjects[o].dirty) {
          gameObjects[o].destroy();
          gameObjects.splice(o,1);
          continue;
        }
        if(!gameObjects[o].body.isStatic())
          gameObjects[o].update(deltaTime);
      }
      world.step(deltaTime);				// step box2d
      gameTime += timestep;
      accumulator -= timestep;
    }
    render(accumulator / timestep);			// PIXI time.
  }
  lastTime = t;
}

function render(alpha) {
  for(let o = 0; o < gameObjects.length; o++) {
    gameObjects[o].integrate(alpha);
  }

  boundaryGraphics.clear(); // render
  for (let body = world.getBodyList(); body; body = body.getNext()) {
    let userData = body.getUserData();
    if("gameObject" in userData) continue;	// we skip to the next object if this is a gameObject (handled these above already)
    for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
      let shape = fixture.getShape();
      if(shape.getType() === 'edge' && userData.myType === 'boundary') {  // init color and thick of edges
        boundaryGraphics.lineStyle(3,0x999999,1);
        boundaryGraphics.moveTo(shape.m_vertex1.x*PixelsPerMeter,shape.m_vertex1.y*PixelsPerMeter);
        boundaryGraphics.lineTo(shape.m_vertex2.x*PixelsPerMeter,shape.m_vertex2.y*PixelsPerMeter);
      }
    }
  }
  boundaryGraphics.endFill();

  // And finally...
  renderer.render(stage);
}
// When files are loaded and ready, we may begin.
loader.load((loader,resources) => {
  requestAnimationFrame(step);
});

// Buttons
document.querySelector('#removeShape').addEventListener('click', removeShapeFoo)
document.querySelector('#addGravity').addEventListener('click', addGravityFoo)
document.querySelector('#addShappe').addEventListener('click', addShappeFoo)
document.querySelector('#removeGravity').addEventListener('click', removeGravityFoo)

function removeShapeFoo() {
  deleteQueued = true;
};
function addShappeFoo() {
  let shape;
  let r = randrange(1,100)
  if(r < 33) shape = 'triangle';
  if(r >= 33 && r < 66) shape = 'box';
  if(r >= 66) shape = 'circle';
  let size = randrange(25,60);
  let o = new GameObject({
    world: world,
    position: {x:50,y:50},
    angle: Math.random(),
    angularVelocity: 0,//randrange(1,5),
    radius: size,
    type: 'dynamic',
    shape: shape,
    color: randcolor(),
    restitution: (100-size) / 100,
    friction: size / 100,
    density: (size * 2) / 100,
    texture: null
  });
  let force = planck.Vec2(forceStrength,forceStrength).mul(deltaTime*PixelsPerMeter);
  o.body.applyLinearImpulse(force, o.body.getWorldCenter());
}
function addGravityFoo() {
  let g = world.getGravity().clone();
  g.y += 1;
  if(g.y > 99) g.y = 99;
  world.setGravity(g);
}
function removeGravityFoo() {
  let g = world.getGravity().clone();
  g.y -= 1;
  if(g.y < -99) g.y = -99;
  world.setGravity(g);

}

document.querySelector('#shapesCount').value = 0;

class GameObject {
  constructor(opts) {
    // If no texture is supplied we become a solid shape.
    this.sprite = typeof opts.texture === 'string' ? new PIXI.Sprite.from(opts.texture) : new PIXI.Graphics();
    this.debug = new PIXI.Graphics();
    this.container = new PIXI.Container();
    this.shapeType = opts.shape;
    this.bulletCounter = 0;			// Expire our bullet flag after a short time; it's only needed for launching really.
    this.world = opts.world;
    this.dirty = false;				// Outside the game area, I should get removed.
    this.body = this.world.createBody({
      type: opts.type,
      bullet: bulletMode,
      angularVelocity: opts.angularVelocity,
      position: { x: opts.position.x * MetersPerPixel, y: opts.position.y * MetersPerPixel },
      userData: {	// We assign some userData for this body for future handling
        gameObject:true
      }
    });
    if(this.shapeType === 'box') { //create box
      this.body.createFixture(planck.Box((opts.radius/2)*MetersPerPixel,(opts.radius/2)*MetersPerPixel),{
        friction: opts.friction,
        restitution: opts.restitution,
        density: opts.density
      });
      if(this.sprite instanceof PIXI.Sprite === false) {
        this.sprite.beginFill(opts.color,1);
        this.sprite.drawRect(0,0, opts.radius, opts.radius);
        this.sprite.endFill();
        // Boxes need their origin centralized, because box2d uses center of mass (this keeps our "sprite" within our body.
        // Circles do this naturally
        this.sprite.pivot.x = this.sprite.width / 2;
        this.sprite.pivot.y = this.sprite.height / 2;
      }
    }
    else if(this.shapeType === 'triangle') { //create triangle
      this.body.createFixture(planck.Polygon([
        planck.Vec2(-opts.radius*MetersPerPixel, opts.radius*MetersPerPixel),
        planck.Vec2(0, opts.radius*2*MetersPerPixel),
        planck.Vec2(opts.radius*MetersPerPixel, opts.radius*MetersPerPixel)]), {
        friction: opts.friction,
        restitution: opts.restitution,
        density: opts.density
      });
      if(this.sprite instanceof PIXI.Sprite === false) {
        this.sprite.beginFill(opts.color,1);
        this.sprite.drawPolygon([
          new PIXI.Point(-opts.radius, opts.radius),
          new PIXI.Point(0, opts.radius*2),
          new PIXI.Point(opts.radius, opts.radius)
        ]);
        this.sprite.endFill();
      }
    }
    else if(this.shapeType == 'circle') { //create citcle
      this.body.createFixture(planck.Circle(opts.radius*MetersPerPixel), {
        friction: opts.friction,
        restitution: opts.restitution,
        density: opts.density
      });
      if(this.sprite instanceof PIXI.Sprite === false) {
        this.sprite.beginFill(opts.color,1);
        this.sprite.drawCircle(0,0,opts.radius);
        this.sprite.endFill();
      }
    } else throw("Unsupported physics shape!");
    // For interpolation, we need to know our Body's previous physics state.
    this.previousState = new PhysicsState();
    this.previousState.assign(this.body.getPosition(),this.body.getAngle());
    // Container is our main interface to PIXI.
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
    this.container.x = opts.position.x * PixelsPerMeter;
    this.container.y = opts.position.y * PixelsPerMeter;
    this.container.addChild(this.sprite);	// Add the sprite after you setup the container, lest it gets goofy.
    spriteLayer.addChild(this.container);

    this.container.interactive = true;
    this.container.buttonMode = true;
    // Debug lines
    this.debug.x = this.container.x = opts.position.x;
    this.debug.y = this.container.y = opts.position.y;
    debugLayer.addChild(this.debug);
    // Finally, we add ourselves to the list of game objects for future iteration.
    gameObjects.push(this);
  }


  integrate(alpha) {
    // Interpolate or snap?
    this.container.x = interpolation ? (this.body.getPosition().x * alpha) * PixelsPerMeter + (this.previousState.position.x * (1-alpha)) * PixelsPerMeter : this.body.getPosition().x * PixelsPerMeter;
    this.container.y = interpolation ? (this.body.getPosition().y * alpha) * PixelsPerMeter + (this.previousState.position.y * (1-alpha)) * PixelsPerMeter : this.body.getPosition().y * PixelsPerMeter;
    this.container.rotation = interpolation ? this.body.getAngle() * alpha + this.previousState.angle * (1-alpha) : this.body.getAngle();	// we don't convert rotations


    //add value of Shapes
    if (gameObjects.length > 0){document.querySelector('#shapesCount').value = gameObjects.length};
    if (Object.keys(this).length === 0){document.querySelector('#shapesCount').value = 0};
    //add value of Gravity
    document.querySelector('#gravityCount').value = this.world.getGravity().y.toFixed(0)/2;

    // If something is off the screen, we should get rid of it.
    let p = this.body.getWorldCenter();
    if( (p.x > renderer.screen.width*MetersPerPixel || p.x < 0) || (p.y > renderer.screen.height*MetersPerPixel || p.y < 0) )
      this.dirty = true;
    else this.dirty = false;

    // Debug lines -- Yeah, these are not very fast, but useful for a testbed.
    this.debug.clear();
    if(drawLines) {
      this.debug.x = this.container.x;
      this.debug.y = this.container.y;
      this.debug.rotation = interpolation ? this.body.getAngle() * alpha + this.previousState.angle * (1-alpha) : this.body.getAngle();
      this.debug.lineStyle(1,0x00ff2a,1);
      if(this.shapeType != 'circle') { // width and height don't seem to be a concept to boxes in box2d, so we go by their vertices.
        for(let fixture = this.body.getFixtureList(); fixture; fixture = fixture.getNext()) {
          let shape = fixture.getShape(); // we do make an assumption that there's just one fixture; keep this in mind if you add more.
          this.debug.moveTo(shape.getVertex(0).x * PixelsPerMeter, shape.getVertex(0).y * PixelsPerMeter);
          for(let v = 1; v < shape.m_count; v++) {
            this.debug.lineTo(shape.getVertex(v).x * PixelsPerMeter, shape.getVertex(v).y * PixelsPerMeter);
          }
          this.debug.lineTo(shape.getVertex(0).x * PixelsPerMeter, shape.getVertex(0).y * PixelsPerMeter);
        }
      }
      else if(this.shapeType === 'circle') {
        let r = this.body.getFixtureList().getShape().m_radius;
        this.debug.drawCircle(0,0,r * PixelsPerMeter);
      }
      this.debug.endFill();
    }
  }

  update(dt) {
    // turn off bullet mode after launch
    if(this.body.isBullet()) this.bulletCounter += dt;
    if(this.bulletCounter > 1) {
      this.bulletCounter = 0;
      this.body.setBullet(false);
    }
    // Store previous state
    this.previousState.assign(this.body.getPosition(),this.body.getAngle());
  }
  destroy() {
    // box2d cleanup
    this.world.destroyBody(this.body);
    // pixi cleanup
    this.container.destroy({children: true});
    this.debug.destroy();
  }
}
class PhysicsState {
  constructor() {
    this.position = planck.Vec2(0,0);
    this.angle = 0;
  }
  assign(position,a) {
    this.position = planck.Vec2.clone(position);	// avoid the reference boogie-man
    this.angle = a;
  }
}

//add shape for example from start game
addShappeFoo();


// Some helpers, just for fun.
function randrange(min,max) { return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min); }
function randcolor() { return '0x'+Math.floor(Math.random()*16777215).toString(16) }