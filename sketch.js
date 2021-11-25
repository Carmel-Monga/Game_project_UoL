/*

The Game Project- Final submission.

Extensions completed : Create Enemies && Create Platformms.

Create Enemies:
 The create enemyfunction creates enemies that are randomly placed on the game scene
 The enemies move about the scene within a  range randomly generated.
 The idea is that whenever the game Character comes into collision with the enemy, the game character loses one life.
 the bits I found difficult was animating the enemy's mouth to give a more realistic and frightening effect.
 I practised the construction function really well, but I think there is still plenty of ground for me to cover.
 I can not say that I am 100 % comfortable using the constructor function. but I understand howit works.

Create Platformms:
 The createPlatforms function creates a platform that the game character can jump on.
 I generated one platform and placed at  a  random height.
 Using the factory pattern  I generated as many platforms as I wanted.
 I initially intended on giving the platforms some motion but I somehow managed to make my game not work anymore.
 I struggled to make the game character stand still  and also make him jump while on the [platform as he was plumetting.
 I ironed out the bug and now he can stand still  and jump form the platform.
 I got quite comfortable with the factory pattern and I think that with a bit more practice I will get better iover time.

*/

var distance
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var trees_x;
var collectables;
var clouds;
var mountains;
var canyons;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var game_score
var flagpole
var lives
var platforms
var enemies
var blink
var shake // platform
var chestMove



function setup()
{
	createCanvas(1064, 576);
	floorPos_y = height * 3/4;
  lives = 3
	startGame();

}




function draw()
{
	  background(100,155,255); //fill the  blue sky
		noStroke();
		fill(0,166,0);

		rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground
		fill(152, 169,93)
		rect(0, 265, width, 167); //draw some green ground for mountains
    push()
    translate(scrollPos, 0)

    // render background objects
    drawClouds();
    drawMountains();
    drawTrees();

		for ( var i = 0; i < platforms.length; i++){

			platforms[i].draw();
		}

    gameChar_world_x = gameChar_x - scrollPos


    //   calls on functions that draw canyons and make Character fall if over Canyon
    for ( var i = 0; i< canyons.length; i++)

    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);

    }


    //   calls on functions collectables and make Game Char interact with collectables


    for (var i= 0; i < collectables.length; i++)
    {
        if (!collectables[i].isFound)
        {

            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }



    //   Draws flagpole and moves flag up if Game Char recahes flagpole
    renderFlagpole()
    if (!flagpole.isReached)
    {

        checkFlagpole()
    }

		for ( var i = 0; i < enemies.length; i++){ // calls function( enemies[i].draw();) to draw enemies on the screen and check if GamChar has bumped into enemy

			enemies[i].draw();
			var isContact= enemies[i].checkContact(gameChar_world_x, gameChar_y);
			if (isContact){
				if (lives > 0){
					lives -= 1
					startGame();
					break;
				}

			}

		}

    pop()

    drawGameChar(); //   Draws  Game Char

    checkPlayerDie() //   checks lives of Game Char

    //   Draws the score and lives of the character onto the Canvas

    textSize(18)
    fill("white");
    text("Score: " + game_score, 20, 20)

    text("Lives: " + lives, 20, 40);
		for ( var i = 0; i < lives; i++){
			fill('pink')
			ellipse(100 + i * 31, 35, 20, 20, 100)
			fill('red')
			ellipse(100 + i * 30, 35, 20, 20, 100)


		}


    if (lives < 1)  //   stops game interaction if GameChar lives is less than one
    {

        fill("yellow");
        textSize(30);
        text("GAME OVER", (width/2) -100, height/2)
        fill(255);
        text("Press Space to Continue ", (width/2) -170, (height/2) + 50);
        return startGame()

    }



    if (flagpole.isReached)   //   returns level completion meassage if flagpole is reached
    {
        fill("yellow");
        textSize(30);
        text("LEVEL COMPLETE", (width/2) -100, height/2)
        fill(255);
        text("Press Space to Continue ", (width/2) -130, (height/2) + 50);
        isPlummeting = false
        gameChar_y = floorPos_y
        return
    }

    //------------------------------------------------------------------
	//      INTERACTION CODE
	//------------------------------------------------------------------

    if(isLeft)  // Moves GamChar to the left makes the cavas scroll to the right if GamChar is at 20% of the width
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 3;
		}
		else
		{
			scrollPos += 3;
            gameChar_x = width * 0.2
		}
	}

	if(isRight){  //Moves GamChar to the right makes the cavas scroll to the left if GamChar is at 80% of the width

		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 3;
		}
		else
		{
			scrollPos -= 3; // negative for moving against the background
            gameChar_x = width * 0.8
		}
	}


	var isContact = false

  if ( gameChar_y < floorPos_y) {

		 // true if the character is above any platform.

		for( var i = 0; i < platforms.length; i++) {

			if(platforms[i].checkContact(gameChar_world_x, gameChar_y)){
				console.log('on platfrom')
				isContact = true;
				isFalling = false;
				isPlummeting= false;

				break; // because we only need to detect if he is on one platform.

			}

		}

		if (!isContact){
			isFalling = true
			gameChar_y += 2
		}

    }

	else {
    isFalling = false
    isPlummeting = false

  }

}


function keyPressed()
{


    if (keyCode == 37)
    {
        isLeft = true
    }

    if (keyCode == 39)
    {
        isRight = true
    }

     if (keyCode == 32) {

			 if ( gameChar_y <= floorPos_y){

				 isPlummeting = true
 				 gameChar_y = gameChar_y - 120
			 }

			 else if ( lives== 0){

				 return startGame()
			 }



     }


    if ( gameChar_y > floorPos_y )
    {
        isPlummeting = false

        isLeft  = false
        isRight = false
    }


}

function keyReleased()
{
	// if statements to control the animation of the character when keys are released.

    if (keyCode == 37)
        {
            isLeft = false

        }
    if (keyCode == 39)
        {
            isRight = false

        }
}

function drawGameChar(){
	// Draws the game character



    if(isLeft && isFalling)
    {
		// add your jumping-left code
        fill(0);
        ellipse(gameChar_x+2,
                gameChar_y - 57,
                25, 25);
        fill(200, 100, 100);
        ellipse(gameChar_x,
                gameChar_y - 56,
                22, 26);
        stroke(0);
        line(gameChar_x - 8,
             gameChar_y - 50,
             gameChar_x - 5,
             gameChar_y - 50);
        noStroke();
        // Eyes
        fill(255);
        ellipse(gameChar_x - 5,
                gameChar_y -57,
                7, 6);

        // Pupils
        fill(0);
        ellipse(gameChar_x - 5,
                gameChar_y -57,
                2, 2);


        // Chest
        fill(255, 0, 0);
        rect(gameChar_x - 10,
             gameChar_y -42,
             20, 22);

        //Hands

        fill(255, 100, 100);
        rect(gameChar_x-7,
             gameChar_y - 75,
             4, 5, 1);
        fill(200, 100, 100);
        //rect(gameChar_x - 18, gameChar_y -30, 22, 6, 2);
        rect(gameChar_x-2,
             gameChar_y - 75,
             6, 45, 2);

        // Feets
        fill(0,100,155);
        rect(gameChar_x,
             gameChar_y -18,
             8, 8, 2);
        rect(gameChar_x - 13,
             gameChar_y -18,
             8, 8, 2);
        // shoes
        stroke(255); fill(255, 0, 0); strokeWeight(1.4)
        rect(gameChar_x - 14,
             gameChar_y - 8,
             8, 3);
        rect(gameChar_x - 1,
             gameChar_y - 8,
             8, 3);

   }
   else if(isRight && isFalling)
   {
        // add your jumping-right code

        fill(0);
        ellipse(gameChar_x-2,
                gameChar_y - 57,
                25, 25);
        fill(200, 100, 100);
        ellipse(gameChar_x,
                gameChar_y - 56,
                22, 26);
        stroke(0);
        line(gameChar_x+6,
             gameChar_y -50,
             gameChar_x+10,
             gameChar_y - 50);
        noStroke();
        // Eyes
        fill(255);
        ellipse(gameChar_x + 5,
                gameChar_y -57,
                7, 6);

        // Pupils
        fill(0);
        ellipse(gameChar_x + 5,
                gameChar_y -57,
                2, 2);


        // Chest
        fill(255, 0, 0);
        rect(gameChar_x - 10,
             gameChar_y -42,
             20, 22);

        //Hands

        fill(255, 100, 100);
        rect(gameChar_x + 5,
             gameChar_y - 75,
             4, 5, 1);
        fill(200, 100, 100);
        //rect(gameChar_x - 18, gameChar_y -30, 22, 6, 2);
        rect(gameChar_x-2,
             gameChar_y - 75,
             6, 45, 2);

        // Feets
        fill(0,100,155);
        rect(gameChar_x + 4,
             gameChar_y -18,
             8, 8, 2);
        rect(gameChar_x - 7,
             gameChar_y -18,
             8, 8, 2);
        // shoes
        stroke(255);
       fill(255, 0, 0);
       strokeWeight(1.4)
        rect(gameChar_x - 6,
             gameChar_y - 8,
             8, 3);
        rect(gameChar_x + 5,
             gameChar_y - 8,
             8, 3);
	}
	else if(isLeft)
	{
		// add your walking left code

            //Head
        fill(0);
        ellipse(gameChar_x+2,
                gameChar_y - 57,
                25, 25);
        fill(200, 100, 100);
        ellipse(gameChar_x,
                gameChar_y - 56,
                22, 26);
        stroke(0);
        line(gameChar_x-8,
             gameChar_y -50,
             gameChar_x-5,
             gameChar_y - 50);
        noStroke();
        // Eyes
        fill(255);
        ellipse(gameChar_x - 5,
                gameChar_y -57,
                7, 6);

        // Pupils
        fill(0);
        ellipse(gameChar_x - 5,
                gameChar_y -57,
                2, 2);


        // Chest
        fill(255, 0, 0);
        rect(gameChar_x - 10,
             gameChar_y -42,
             20, 22);

        //Hands
        fill(200, 100, 100);
        rect(gameChar_x - 18,
             gameChar_y -30,
             22, 6, 2);
        rect(gameChar_x-2,
             gameChar_y -39,
             6, 10, 2);

        // Feets
        fill(0,100,155);
        rect(gameChar_x + 1,
             gameChar_y -18,
             8, 14, 2);
        rect(gameChar_x -10,
             gameChar_y -18,
             8, 14, 2);
        // shoes
        stroke(255); fill(255, 0, 0);
        strokeWeight(1.4)
        rect(gameChar_x - 11,
             gameChar_y - 2,
             8, 3);
        rect(gameChar_x,
             gameChar_y - 2,
             8, 3);
        // Jersey number

	}
	else if(isRight)
	{
		// add your walking right code

        //Head
        fill(0);
        ellipse(gameChar_x-2,
                gameChar_y - 57,
                25, 25);
        fill(200, 100, 100);
        ellipse(gameChar_x,
                gameChar_y - 56,
                22, 26);
        stroke(0);
        line(gameChar_x+6,
             gameChar_y -50,
             gameChar_x+10,
             gameChar_y - 50);
        noStroke();
        // Eyes
        fill(255);
        ellipse(gameChar_x + 5,
                gameChar_y -57,
                7, 6);

        // Pupils
        fill(0);
        ellipse(gameChar_x + 5,
                gameChar_y -57,
                2, 2);


        // Chest
        fill(255, 0, 0);
        rect(gameChar_x - 10,
             gameChar_y -42,
             20, 22);

        //Hands
        fill(200, 100, 100);
        rect(gameChar_x-2,
             gameChar_y -30,
             22, 6, 2);
        rect(gameChar_x-2,
             gameChar_y -39, 6, 10, 2);

        // Feets
        fill(0,100,155);
        rect(gameChar_x+1,
             gameChar_y -18,
             8, 14, 2);
        rect(gameChar_x -10,
             gameChar_y -18,
             8, 14, 2);
        // shoes
        stroke(255);
        fill(255, 0, 0);
        strokeWeight(1.4)
        rect(gameChar_x - 9,
             gameChar_y - 2,
             8, 3);
        rect(gameChar_x+2,
             gameChar_y - 2,
             8, 3);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code

        // Head
        fill(0);
        ellipse(gameChar_x,
                gameChar_y - 57,
                25, 25);
        fill(200, 100, 100);
        ellipse(gameChar_x, gameChar_y - 55, 25, 25);

        // Mouth
        stroke(0);
        line(gameChar_x,
             gameChar_y -50,
             gameChar_x + 2,
             gameChar_y - 50);

        noStroke();
        // Eyes
        fill(255);
        ellipse(gameChar_x - 5,
                gameChar_y -55,
                6, 6);
        ellipse(gameChar_x + 5,
                gameChar_y -55,
                6, 6);
        // Pupils
        fill(0);
        ellipse(gameChar_x - 5,
                gameChar_y -55,
                2, 2);
        ellipse(gameChar_x + 5,
                gameChar_y -55,
                2, 2);

        // Chest
        fill(255, 0, 0);
        rect(gameChar_x - 10,
             gameChar_y -42,
             20, 18);

        //Hands
        fill(200, 100, 100);
        rect(gameChar_x - 22,
             gameChar_y -42,
             11, 6, 2);
        rect(gameChar_x + 12,
             gameChar_y -42,
             11, 6, 2);

        // Feets
        fill(0,100,155);
        rect(gameChar_x -12,
             gameChar_y -22,
             8, 8, 2);
        rect(gameChar_x+5,
             gameChar_y -22,
             8, 8, 2);

        // shoes
        stroke(255);
        fill(255, 0, 0);
        strokeWeight(1.4)
        arc(gameChar_x +10,
            gameChar_y - 8,
            10, 10, PI, PI+PI, CHORD);
        arc(gameChar_x -8,
            gameChar_y - 8,
            10, 10, PI, PI+PI, CHORD);
        // Jersey number
        textSize(13);
        fill('purple')
        text("23", gameChar_x -7, gameChar_y - 28);
        noStroke();
	}
	else
	{
		// add your standing front facing code
        noStroke();
        fill(0);
        ellipse(gameChar_x,
                gameChar_y - 57,
                25, 25);
        fill(200, 100, 100);
        ellipse(gameChar_x,
                gameChar_y - 55,
                25, 25);

        // Mouth
        stroke(0);
        line(gameChar_x,
             gameChar_y -50,
             gameChar_x + 2,
             gameChar_y - 50);

        noStroke();


				blink++

				if ( blink % 150 ===0 || blink % 150 ===0 || blink % 150 ===0){
					fill('brown')
					ellipse(gameChar_x - 5,
	                gameChar_y -55,
	                6, 6);
	        ellipse(gameChar_x + 5,
	                gameChar_y -55,
	                6, 6);
				}

				else {
					// Eyes
	        fill(255);
	        ellipse(gameChar_x - 5,
	                gameChar_y -55,
	                6, 6);
	        ellipse(gameChar_x + 5,
	                gameChar_y -55,
	                6, 6);
	        // Pupils
	        fill(0);
	        ellipse(gameChar_x - 5,
	                gameChar_y -55,
	                2, 2);
	        ellipse(gameChar_x + 5,
	                gameChar_y -55,
	                2, 2);

				}


        if (chestMove == chestMove){
					var c= random(-0.2,0.2)
				 gameChar_x += c
				 fill(255, 0, 0);
         rect(gameChar_x - 10,
             gameChar_y -42,
             20, 22);
				}



        //Hands
        fill(200, 100, 100);
        stroke(0);
        strokeWeight(0.2);
        rect(gameChar_x - 16,
             gameChar_y -42,
             6, 18, 2);
        rect(gameChar_x + 10,
             gameChar_y -42,
             6, 18, 2);


        // Feets
        fill(0,100,155);
        rect(gameChar_x + 1,
             gameChar_y -18,
             8, 14, 2);
        rect(gameChar_x -10,
             gameChar_y -18,
             8, 14, 2);
        // shoes
        stroke(255);
        fill(255, 0, 0);
        strokeWeight(1.4)
        arc(gameChar_x -6,
            gameChar_y,
            10, 10, PI, PI+PI, CHORD);
        arc(gameChar_x +6,
            gameChar_y,
            10, 10, PI, PI+PI, CHORD);
        // Jersey number
        textSize(13);
        fill('purple');
        text("23", gameChar_x -7, gameChar_y - 28);
        noStroke();
    }


}




// ---------------------------
// BACKGROUND RENDER FUNCTIONS
// ---------------------------

// Function to draw cloud objects.

function drawClouds(){

    for (var i = 0; i< clouds.length; i++)
    {

        fill(255);
        ellipse(clouds[i].x_cord + 100,
                clouds[i].y_cord + 50,
                90,80);
        ellipse(clouds[i].x_cord + 50,
                clouds[i].y_cord + 50,
                60,55);
        ellipse(clouds[i].x_cord + 150,
                clouds[i].y_cord + 50,
                60,55);

    }


}

//Function to draw mountains objects.

function drawMountains() {

  for (var i= 0; i < mountains.length; i++)
  {
    noStroke();

		// moutain1
    fill(194,166,151);
    triangle((mountains[i].xcord + 450) *0.6,
             (mountains[i].ycord +50)*0.6 ,
             (mountains[i].xcord + 550)*0.6,
             (mountains[i].ycord + 332) *0.6,
             (mountains[i].xcord + 290) *0.6,
             (mountains[i].ycord + 332)*0.6);

    fill(238,221,145);

    triangle((mountains[i].xcord + 450)*0.6,
             (mountains[i].ycord +50) *0.6,
             (mountains[i].xcord + 550)*0.6,
             (mountains[i].ycord + 290)*0.6,
             (mountains[i].xcord + 450)*0.6,
             (mountains[i].ycord + 332)*0.6);


		// moutain 2
		fill(140, 110,85);
		triangle((mountains[i].xcord + 530)*0.6,
						 (mountains[i].ycord)*0.6,
						 (mountains[i].xcord + 600)*0.6,
						 (mountains[i].ycord + 332)*0.6,
						 (mountains[i].xcord + 430)*0.6,
						 (mountains[i].ycord + 332)*0.6);

		fill(162, 129,99);

		triangle((mountains[i].xcord + 530)*0.6,
						 (mountains[i].ycord)*0.6,
						 (mountains[i].xcord + 600)*0.6,
						 (mountains[i].ycord + 332)*0.6,
						 (mountains[i].xcord + 680)*0.6,
						 (mountains[i].ycord + 240)*0.6);
		// mountain 3
		fill(140, 110,85);
		triangle((mountains[i].xcord + 630)*0.6,
						 (mountains[i].ycord + 60)*0.6,
						 (mountains[i].xcord + 750)*0.6,
						 (mountains[i].ycord + 332)*0.6,
						 (mountains[i].xcord + 530)*0.6,
						 (mountains[i].ycord + 332)*0.6);

		fill(162, 129,99);

		triangle((mountains[i].xcord + 630)*0.6,
						 (mountains[i].ycord + 60)*0.6,
						 (mountains[i].xcord + 750)*0.6,
						 (mountains[i].ycord + 332)*0.6,
						 (mountains[i].xcord + 830)*0.6,
						 (mountains[i].ycord + 300)*0.6);

	 fill(250,230,165);

		triangle((mountains[i].xcord + 530)*0.6,
						 (mountains[i].ycord)*0.6,
						 (mountains[i].xcord + 552)*0.6,
						 (mountains[i].ycord + 110)*0.6,
						 (mountains[i].xcord + 574)*0.6,
						 (mountains[i].ycord + 70)*0.6);

		// GREEN MOUNTAINS

		// *Mountain 1

		fill(90,128,90);
		triangle((mountains[i].xcord + 400)*0.6,
						 (mountains[i].ycord + 260)*0.6,
						 (mountains[i].xcord + 450)*0.6,
						 (mountains[i].ycord + 358)*0.6,
						 (mountains[i].xcord + 240)*0.6,
						 (mountains[i].ycord + 358)*0.6);

		fill(133,185,89);

		triangle((mountains[i].xcord + 400)*0.6,
						 (mountains[i].ycord + 260)*0.6,
						 (mountains[i].xcord + 450)*0.6,
						 (mountains[i].ycord + 358)*0.6,
						 (mountains[i].xcord + 550)*0.6,
						 (mountains[i].ycord + 338)*0.6);

	  // Mountain 2

		fill(90,128,90);
		triangle((mountains[i].xcord + 700)*0.6,
						 (mountains[i].ycord + 260)*0.6,
						 (mountains[i].xcord + 750)*0.6,
						 (mountains[i].ycord + 358)*0.6,
						 (mountains[i].xcord + 540)*0.6,
						 (mountains[i].ycord + 358)*0.6);

		fill(133,185,89);

		triangle((mountains[i].xcord + 700)*0.6,
						 (mountains[i].ycord + 260)*0.6,
						 (mountains[i].xcord + 750)*0.6,
						 (mountains[i].ycord + 358)*0.6,
						 (mountains[i].xcord + 850)*0.6,
						 (mountains[i].ycord + 338)*0.6);

		// Mountain 3
		fill(151,169,93);
		triangle((mountains[i].xcord + 550)*0.6,
						 (mountains[i].ycord + 310)*0.6,
						 (mountains[i].xcord + 600)*0.6,
						 (mountains[i].ycord + 408)*0.6,
						 (mountains[i].xcord + 290)*0.6,
						 (mountains[i].ycord + 408)*0.6);

		fill(208,234,133);

		triangle((mountains[i].xcord + 550)*0.6,
						 (mountains[i].ycord + 310)*0.6,
						 (mountains[i].xcord + 600)*0.6,
						 (mountains[i].ycord + 408)*0.6,
						 (mountains[i].xcord + 720)*0.6,
						 (mountains[i].ycord + 388)*0.6);












    }


}

// Function to draw trees objects.

function drawTrees() {

	noStroke();

  for (var i = 0; i < trees_x.length; i++) {
      fill(100,50,20);
      rect((trees_x[i] + 10)*0.7,(floorPos_y )*0.7, 40*0.7, 145*0.7);

      var treePos_y= floorPos_y- 50

      //branches of the tree
      fill(0,100,50);

      triangle((trees_x[i] - 50) * 0.7,
               (floorPos_y + 50)*0.7,
               (trees_x[i] + 30)*0.7,
               (floorPos_y - 58)*0.7,
               (trees_x[i] + 110)*0.7,
               (floorPos_y + 50)*0.7);

      triangle((trees_x[i] - 50)*0.7,
               (floorPos_y )*0.7,
               (trees_x[i] + 30)*0.7,
               (floorPos_y - 100)*0.7,
               (trees_x[i] + 110)*0.7,
               (floorPos_y )*0.7);


      ellipse((trees_x[i] + 30)*0.7,
              (floorPos_y - 4)*0.7,
              180 *0.7,30*0.7);


  }

}


// function to draw canyons
function drawCanyon(t_canyon) {
    fill('brown');
    stroke('black');
    strokeWeight(0.5);

    rect(t_canyon.x_pos +40,
        floorPos_y,
        t_canyon.width,
         150)
    fill('sienna');
    noStroke()
    rect(t_canyon.x_pos +50,
        floorPos_y,
        t_canyon.width - 20,
         150);
}

// checks if GameChar is over canyon and fall into it if true.

function checkCanyon(t_canyon)
{
    if (gameChar_world_x > t_canyon.x_pos + 40 && gameChar_world_x <= t_canyon.x_pos + 110 && gameChar_y >= floorPos_y)
    {
        isPlummeting = true
        gameChar_y += 2
				isLeft = false
				isRight =false


        if (gameChar_world_x> t_canyon.x_pos + 110){

            isPlummeting = false
        }
     }
}




// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// function to draw collectable objects
function drawCollectable(t_collectable){

	t_collectable.x_pos += random(-0.2, 0.2)
	t_collectable.y_pos += random(-0.2, 0.2)

    strokeWeight(0.8)
    stroke(0)
    fill(255,215,0);
    ellipse(t_collectable.x_pos + 150,
    t_collectable.y_pos - 20,
    40,40);

    fill(218,165,32);
    ellipse(t_collectable.x_pos + 150,
    t_collectable.y_pos - 20,
    30, 30);
    fill(0,0,0);
    textSize(13);
    text("$$",
    t_collectable.x_pos + 143,
    t_collectable.y_pos - 15);
}

// function to check collectable objects
function checkCollectable(t_collectable)
{
    if (dist(gameChar_world_x, gameChar_y, t_collectable.x_pos + 150, t_collectable.y_pos - 20)  < 50)

        {
            t_collectable.isFound = true
            game_score += 1
        }
}

//function to draw flagpole with flag up or down if GmeChar reaches flagpole.
function renderFlagpole()
{

    if (flagpole.isReached)

    {

        stroke("beige")
        strokeWeight(8)
        line(flagpole.x_pos,
            floorPos_y,
            flagpole.x_pos,
            floorPos_y - 250,0)
        noStroke();
        fill(255, 0, 0);
        rect(flagpole.x_pos, floorPos_y - 250, 55, 50)
        fill(255, 255, 255);
        rect(flagpole.x_pos+ 27.5, floorPos_y - 250, 27.5, 25)
        rect(flagpole.x_pos, floorPos_y - 222.5, 27.5, 25)

    }

    else

    {
        stroke("beige")
        strokeWeight(8)
        line(flagpole.x_pos,
            floorPos_y,
            flagpole.x_pos,
            floorPos_y - 250)
        noStroke();
        fill(255, 0, 0);
        rect(flagpole.x_pos, floorPos_y - 50, 55, 50)
        fill(255, 255, 255);
        rect(flagpole.x_pos+ 27.5, floorPos_y - 50 , 27.5, 25)
        rect(flagpole.x_pos, floorPos_y - 24.5, 27.5, 25)

    }

}
// returns true if GameChar reaches flagpole
function checkFlagpole()

{
   var d = abs(gameChar_world_x - flagpole.x_pos)

   if (d < 20)
   {
       flagpole.isReached = true
   }

}


// decreases the lives of GameChar if it falls in the canyon

function checkPlayerDie()
{
        if (gameChar_y > height)
        {
            lives = lives - 1
            startGame()
        }

}

//initialise all values if GameChar dies.

function startGame()
{

    gameChar_x = 500;
	gameChar_y = floorPos_y;
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    scrollPos = 0
    game_score = 0
    flagpole= { x_pos: 2500, isReached: false}
	blink = 0

    // different objects


    trees_x= [-500,50,250,600,700,1000,1600,1900];


    collectables=
        [

        {x_pos: 20, y_pos: floorPos_y-20,isFound: false},
        {x_pos: -100, y_pos: floorPos_y,isFound: false},
        {x_pos: 200, y_pos: floorPos_y-30,isFound: false},
        {x_pos: 280, y_pos: floorPos_y-50,isFound: false},
        {x_pos: 500, y_pos: floorPos_y-50,isFound: false},
        {x_pos: 600, y_pos: floorPos_y-60,isFound: false},
        {x_pos: 660, y_pos: floorPos_y-35,isFound: false},
        {x_pos: 1200, y_pos: floorPos_y-20,isFound: false},
        {x_pos: -400, y_pos: floorPos_y-40,isFound: false},
        {x_pos: -600, y_pos: floorPos_y-25,isFound: false},
        {x_pos: 1450, y_pos: floorPos_y-20,isFound: false},
        {x_pos: 1600, y_pos: floorPos_y-150,isFound: false},
        {x_pos: 2250, y_pos: floorPos_y-39,isFound: false}


        ]

    clouds =
        [
        {x_cord: 100, y_cord: 100},
        {x_cord: 400, y_cord: 50},
        {x_cord: 800, y_cord: 100},
        {x_cord: 1250, y_cord: 100},
        {x_cord: 1500, y_cord: 50},
        {x_cord: 1900, y_cord: 80}

         ];
    mountains =
        [

        {xcord: 0, ycord: 200},
        {xcord: 800, ycord: 200},
        {xcord: 1600, ycord: 200},
        {xcord: 2300, ycord: 200},
        {xcord: -800, ycord: 200},

        ];

     canyons =
        [
        { x_pos: -400, width: 70},
        { x_pos: 300, width: 70},
        { x_pos: 800, width: 70},
        { x_pos: 1300, width: 70},
        { x_pos: 2300, width: 70}
        ];

				enemies = [];

				if (lives> 0){
					for ( var i= 0; i < 6; i++){
						enemies.push(new Enemy(random(-800,300), random(floorPos_y -10, floorPos_y -50), random(80, 150)))
						enemies.push(new Enemy(random(600,2000), random(floorPos_y -10, floorPos_y -50), random(80, 150)))

					}

					platforms =[];
					platforms.push(createPlatforms(300, random(floorPos_y - 50, floorPos_y - 120), 100))
					platforms.push(createPlatforms(600, random(floorPos_y - 50, floorPos_y - 120), 200))
					platforms.push(createPlatforms(900, random(floorPos_y - 50, floorPos_y - 120), 150))
					platforms.push(createPlatforms(1300, random(floorPos_y - 50, floorPos_y - 120), 100))
					platforms.push(createPlatforms(1800, random(floorPos_y - 50, floorPos_y - 120), 200))
					platforms.push(createPlatforms(2100, random(floorPos_y - 50, floorPos_y - 120), 200))

				}

			  chestMove = random(-0.5, 0.5)


				shake= random(-0.05, 0.05)




}

function createPlatforms(x, y, length){
	var p = {
		x: x,
		y: y,
		length: length,
		draw: function(){
			this.x
			this.y

			fill(0,166,0)
			rect (this.x , this.y , this.length, 05)
			fill(160,40,30)
			rect (this.x, this.y + 5, this.length, 20)

		},
		checkContact: function (gc_x, gc_y){ // detects if the character is  above the platform.
			if (gc_x > this.x && gc_x < this.x + this.length){
				var d= this.y - gc_y
				if (d > 0 && d < 5){
				 return true
				}

			}

			return false;
		}

	}
	return p
}

function Enemy(x, y, range){
	this.x = x;
	this.y = y;
	this.range= range;
	this.currentx = x;
	this.inc = 1

	this.colour = undefined;



	this.update= function(){

		this.currentx += this.inc
		if ( this.currentx >= this.x + this.range){
			this.inc = -1


		}

		else if(this.currentx < this.x) {

			this.inc = 1

		}
	}

	this.draw = function (){

		if (this.inc == 1){
			this.colour = color('white')

		}

		else {
			this.colour= color('red')

		}
		this.update()
		stroke(0);
		line(this.currentx + 35, this.y - 70, this.currentx + 35, this.y - 78); // antenna line
		strokeWeight(1);
		fill(200);
		rect(this.currentx, this.y- 70, 70, 70, 15)

		fill(231,84,128) // pink eyes
		ellipse(this.currentx + 17, this.y -45, 20, 20);
		ellipse(this.currentx + 50, this.y- 45, 20, 20);

		fill(255,255, 0); // yellow eyes & ears
		ellipse(this.currentx + 17, this.y -45, 9, 9);
		ellipse(this.currentx + 50, this.y- 45, 9, 9);
		rect(this.currentx -7,this.y -50, 8,25, 2);
		rect(this.currentx + 69,this.y -50, 8,25, 2);

		fill(this.colour);
		ellipse(this.currentx + 17, this.y- 45, 5, 5);
		ellipse(this.currentx + 50, this.y- 45, 5, 5);


		fill(255);
		strokeWeight(1.8); // mouth
		rect(this.currentx + 12, this.y - 25, 46, 15, 5);
		strokeWeight(0.6)
		line(this.currentx + 12, this.y - 16.5, this.currentx + 58, this.y - 16.5);
		var n = 8
		strokeWeight(1.8)
		for ( var i = 0; i < n; i++){
			line(this.currentx + 17  +(i * 5), this.y - 25, this.currentx + 17  +(i * 5), this.y - 10);
		}

	}

	this. checkContact = function(gc_x, gc_y){

		var d = dist(this.currentx, this.y, gc_x, gc_y)

		if (d < 50){

			return true
		}
		return false
	}



}
