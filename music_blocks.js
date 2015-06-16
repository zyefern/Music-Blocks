
//helper function
function rand(begin, end)
{
  return Math.floor((Math.random()*(end-begin+1)) + (begin)); // is there a built-in function to do the same thing?
}
//get canvas element
var canvas = document.getElementById("canvas");
//get canvas context to draw on
var context = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 300;

//block class that will define the collision objects
function Block(x, y, note){
  this.x = x;
  this.y = y;
  this.width = 20;
  this.height = 20;
  this.note = note.toUpperCase(); // make sure the note is ALWAYS upper
}

//drawing the block on the canvas
Block.prototype.draw = function(){
  context.fillStyle = "grey";
  context.fillRect(this.x,this.y, this.width,this.height);
  context.fillStyle = "black";
  context.font = "20px Courier";
  context.fillText(this.note,this.x,this.y+15);
}

// playing the note attached to the block
Block.prototype.playNote = function(){
  var sound = new Audio("notes/"+this.note+".wav");
  sound.play();
}
//array of block objects in the current scene
var blocks = [new Block(40,40,"C"), new Block(120,40,"D"), new Block(200,40, "E"), new Block(40, 120, "F"), new Block(40, 200, "G"), new Block(200, 120, "A"), new Block(200, 200, "B")];
//array of actor objects in the current scene
var actors = [new Actor(80,100), new Actor(80,200)]

//Actor class will define our moving (green) blocks in the scene
function Actor(init_x, init_y){
  this.x = init_x;
  this.x_speed = rand(1,2);
  this.y = init_y;
  this.y_speed = rand(1,2);

  this.width = 20;
  this.height = 20;

}

//movement and collision with the wall
Actor.prototype.move = function(){
  this.x += this.x_speed;
  this.y += this.y_speed;
  if (this.x+this.width > canvas.width) {
    this.x_speed = -this.x_speed;
  }
  else if (this.x < 0){
    this.x_speed = -this.x_speed;
  }
  if (this.y+this.height > canvas.height){
    this.y_speed = -this.y_speed;
  }
  else if (this.y < 0){
    this.y_speed = -this.y_speed;
  }
}
//actor drawing function
Actor.prototype.draw = function(){
  context.fillStyle = "green";
  context.fillRect(this.x,this.y, this.width,this.height);
}
//weird function to get collision with another (abstract) object
//returns which edge on the object the actor has collided
Actor.prototype.isCollidedWith = function(object){
  if (this.y <= object.y+object.height && this.x <= object.x+object.width && this.x+this.width >= object.x && this.y+this.height >= object.y){
    if (this.x+this.width == object.x) return "left";
    else if (this.y+this.width == object.y) return "top";
    else if (this.x == object.x+object.width) return "right";
    else if (this.y == object.y+object.width) return "bottom";
    else return null;
  }
  
}
// function to add a new actor to the current scene (in the html button element)
function addActor(){
  actors.push(new Actor(rand(0,canvas.width-20), rand(0,canvas.height-20)));
}
//add block with user input (currently not working)
function addBlock(){
  var x = document.getElementById("block_x").value;
  var y = document.getElementById("block_y").value;
  if (x>=canvas.width || y>=canvas.height || x<0 || y<0){
    var err = document.getElementById("block_input_error");
    err.textContent = "enter proper number";
    err.style.color = "red";
  }
  else{
    document.getElementById("block_input_error").textContent = "";
    blocks.push(new Block(x,y));
  }
}


//update function... this will occur on every animation frame
function update(){
  context.clearRect(0,0,canvas.width, canvas.height);
  actors.forEach(function(actor){
    actor.move();
    actor.draw();
    blocks.forEach(function(block){
      block.draw();
      var c = actor.isCollidedWith(block);
        if(c != null){
      
      
          if(c == "left" || c == "right"){
            actor.x_speed = -actor.x_speed;
	    block.playNote();
          }
          else if(c == "bottom" || c=="top"){
	    actor.y_speed = -actor.y_speed;
	    block.playNote();
	  }
	}
    });
  });
}
//get ready to animate with these lovely global variables
var done = false;
var start = null;
function animate(timestamp){
  if (!start) start = timestamp;
  var progress = timestamp - start;
  update();
  if (!done){
    window.requestAnimationFrame(animate);
  }
}


//pause function if user clicks the canvas
function stop(){
  if (done == true){
    done = false;
    window.requestAnimationFrame(animate);
  }
  else {
    done = true;
  }
}
window.requestAnimationFrame(animate);
canvas.addEventListener('click', stop, true);
document.getElementById("addActor").addEventListener('click', addActor, true);
//document.getElementById("addBlock").addEventListener('click', addBlock, true);
