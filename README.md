

#Hard-level,automatic,multiplayer TICTACTOE against AI developed with Javascript



     The idea behind this side project was to create a small automated client side AI from SCRATCH using the basic principles of Javascript classes and async/await syntatic sugar without any third-party framework to order certain class methods.A quick look at the code shows that it's largely dependent on the await keyword because we need to ascertain that a method has been completed before the AI(code) moves unto the next,please understand that I only learnt Promises several hours before writing this project.Having said this,please permit any form of non professionalism.


    The major aim of this side project is to possibly determine moves that can be made by a human opponent in a tictactoe game and simply counter it to a stalemate,there's possibility the AI wins from time to time but against a skilled opponent,the AI will rely on it ability to stalemate.There's limitations to this if the opponent starts a round and not the AI.The bot offers a varying difficulty level to prevent walkover scenarios as you continue playing against it.The difficulty posed by this bot can be reduced/increased in further versions by simply changing the ordering in which bot(AI) uses.

ABOUT THE GUI

The GUI is a CSS flex box with 9 smaller boxes,each of this boxes are ID-ed in a unique way

   0       1        2
0  _____|_____|______
1  _____|_____|______
 2 _____|_____|______

So basically, the first box has an id of 0.0,second box(1.0),third box(0.2),fourth box(1.0),fifth box(1.1) e.t.c.The boxes are counted horizontally.

The "." delimiter is required to split the id which will be discussed later.


Working Principles
If you notice they're 8 rows of 3 boxes that can be filled for you/your opponent to win 

-3 horizontal rows
-3 vertical rows
-2 diagonal rows

Each represented that in a multidimensional array.
Here's an example 

[
[0,0,0], //1st horizontal row

[0,0,0], //2nd horizontal row

[0,0,0], //3rd horizontal row

[0,0,0], //1st vertical row

[0,0,0], //2nd vertical row

[0,0,0], //3rd vertical row

[0,0,0], //1st diagonal row (from the bottom left to the top right)

[0,0,0], //2nd diagonal row (from the top left to the bottom right)
]

There's a possibility that a box (in the GUI) in a row can be represented twice or thrice in those arrays.For example
The box ID-ed 0.0 (in the GUI) can be found in the:

-First element of the first child array in the multidimensional array: that represents the first horizontal array.
-First element of the fourth child array: that represents the first vertical array.
-First element of the seventh child array: that represents the first diagonal array.

The 0's represent each empty boxes.
These arrays can be populated with 1 and 2.
1 represents the human opponent,constant and doesn't vary 
2 represents the AI,constant and doesn't vary.


When a human opponent plays in an empty position on the table:
-An onclick event grabs the id of the box that has just being clicked.
-Checks if it's empty,if it's not.Throws an alert to play somewhere else.
-If the box is empty, the GUI is updated with the players symbol and a class method updates this change internally(alters the multidimensional array).


The bot uses 4 methods to play;
The AI calls the first method,then second method,third and finally fourth.If the conditions for any preceding method is met,then the suceeding methods will be skipped and the human opponent gets to play.

The first method:
It checks if it has an array that has almost being filled with 2s's without any 1's
If it exists,it just plays there and win.

The second method:
It checks if there's any array that is filled with 1's and no 2's,which means you have almost won,it plays there and blocks you move.

The third method:
The most intelligent of all.When the opponent wins a round.His/her moves sequence is stored in array and saved to local storage.The method checks the current positions of all the opponent symbols and compares it to the stored moves,if it matches any,the AI can get an idea of what move the opponent is trying to pull off.There's a limitation to this,even if the opponent starts from a particular spot,he/she can still initiate more than one move. 

The fourth method:
This allows the array fill a row on it own.After the conditions of the first three methods are not met,this looks for a row that has just one occurrence of the number 2,and no occurrence of 1,it means that the opponent hasn't played in a row that the AI has played.If such condition is met,the AI plays here and needs just one move after this to win (if the opponent doesn't block that block that row with his/her next move).

Then there's a fifth method that plays in any random position that is empty...It only runs if the conditions for the first four methods are not met.


There are helper methods that checks after each turns to see if there's a clear winner or it ends in a stalemate.
If a round comes to an end,the GUI and AI brain(the multidimensional array) is refreshed.

I hope this doc gives you an insight of how I came about this AI.Please leave a star if you liked the execution of this project.
                                                                              Thank You.