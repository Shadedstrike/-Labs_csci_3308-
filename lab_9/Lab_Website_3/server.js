/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab, we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
**********************/
const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'football_db',
	user: 'postgres',
	password: 'a'
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory



/*********************************
 Below we'll add the get & post requests which will handle:
   - Database access
   - Parse parameters from get (URL) and post (data package)
   - Render Views - This will decide where the user will go after the get/post request has been processed

 Web Page Requests:

  Login Page:        Provided For your (can ignore this page)
  Registration Page: Provided For your (can ignore this page)
  Home Page:
  		/home - get request (no parameters)
  				This route will make a single query to the favorite_colors table to retrieve all of the rows of colors
  				This data will be passed to the home view (pages/home)

  		/home/pick_color - post request (color_message)
  				This route will be used for reading in a post request from the user which provides the color message for the default color.
  				We'll be "hard-coding" this to only work with the Default Color Button, which will pass in a color of #FFFFFF (white).
  				The parameter, color_message, will tell us what message to display for our default color selection.
  				This route will then render the home page's view (pages/home)

  		/home/pick_color - get request (color)
  				This route will read in a get request which provides the color (in hex) that the user has selected from the home page.
  				Next, it will need to handle multiple postgres queries which will:
  					1. Retrieve all of the color options from the favorite_colors table (same as /home)
  					2. Retrieve the specific color message for the chosen color
  				The results for these combined queries will then be passed to the home view (pages/home)

  		/team_stats - get request (no parameters)
  			This route will require no parameters.  It will require 3 postgres queries which will:
  				1. Retrieve all of the wifootball games in the Fall 2018 Season
  				2. Count the number of nning games in the Fall 2018 Season
  				3. Count the number of lossing games in the Fall 2018 Season
  			The three query results will then be passed onto the team_stats view (pages/team_stats).
  			The team_stats view will display all fo the football games for the season, show who won each game,
  			and show the total number of wins/losses for the season.

  		/player_info - get request (no parameters)
  			This route will handle a single query to the football_players table which will retrieve the id & name for all of the football players.
  			Next it will pass this result to the player_info view (pages/player_info), which will use the ids & names to populate the select tag for a form
************************************/

// login page
app.get('/', function(req, res) {
	res.render('pages/login',{
		local_css:"signin.css",
		my_title:"Login Page"
	});
});

// registration page
app.get('/register', function(req, res) {
	res.render('pages/register',{
		my_title:"Registration Page"
	});
});

/*Add your other get/post request handlers below here: */
app.get('/home', function(req, res) {
	var query = 'select * from favorite_colors;';
	db.any(query)
        .then(function (rows) {
            res.render('pages/home',{
				my_title: "Home Page",
				data: rows,
				color: '',
				color_msg: ''
			})

        })
        .catch(function (err) {
            console.log('error', err);
            res.render('pages/home', {
                my_title: 'Home Page',
                data: '',
                color: '',
                color_msg: ''
            })
        })
});


app.get('/home/pick_color', function(req, res) {

  console.warn("req,query = ", req.query);


	var color_choice = req.query.color_selection; // Investigate why the parameter is named "color_selection"
  console.warn("color choice is = ", color_choice);

	var color_options = 'select * from favorite_colors;' // Write a SQL query to retrieve the colors from the database
	var color_message = 'SELECT * FROM favorite_colors WHERE hex_value = ${color_selection};';// Write a SQL query to retrieve the color message for the selected color
	db.task('get-everything', task => {
        return task.batch([
            task.any(color_options, req.query),
            task.any(color_message, req.query)
        ]);
    })
    .then(info => {
      console.warn("app get pick_color", info);

      const colors = info[0]
      const chosen_color = info[1][0]

      console.warn("chosen_color =", chosen_color);


    	res.render('pages/home',{
				my_title: "Home Page",
				data: colors , // Return the color options
				color:chosen_color.hex_value, // Return the color choice
				color_msg: chosen_color.color_msg // Return the color message
			})
    })
    .catch(err => {
            console.log('error', err);
            res.render('pages/home', {
                my_title: 'Home Page',
                data: '',
                color: '',
                color_msg: ''
            })
    });

});////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/team_stats', function(req, res) {

  //load the sql queries, then feed them to the db to do the tasks

	var fall_games = `SELECT * FROM football_games WHERE game_date >= '2020-08-01'::DATE AND game_date <='2021-02-07'::DATE ORDER BY game_date;`;
	var fall_wins = `SELECT COUNT(*) FROM football_games WHERE home_score > visitor_score AND game_date >= '2020-08-01'::DATE AND game_date <='2021-02-07'::DATE;`;
	var fall_losses = `SELECT COUNT(*) FROM football_games WHERE home_score < visitor_score AND game_date >= '2020-08-01'::DATE AND game_date <='2021-02-07'::DATE;`;
	db.task('get-football-games', task => {
        return task.batch([
            task.any(fall_games, req.query),
            task.any(fall_wins, req.query),
            task.any(fall_losses, req.query)
        ]);
    })
    .then(info => {
      const [all, wins, losses] = info;
      // const all = info[0];
      // const wins = info[1];
      // const losses = info[2];

    	res.render('pages/team_stats',{
				my_title: "Team Stats",
				all,
				wins,
				losses,

			})
    })
    .catch(err => {
            console.log('error', err);
            res.render('pages/team_stats', {
                my_title: 'Team stats',
                all: '',
                wins: [{"count":'error'}],
                losses: [{"count":'error'}],
            })
    });

});



app.get('/player_info', function(req, res) {

	var select_players = `SELECT id,name FROM football_players;`;
	db.task('get-football-players', task => {
    return task.batch([
      task.any(select_players , req.query),
    ]);
  })
  .then(info => {
    const [players] = info;
    console.log(players, info);
    res.render('pages/player_info',{
      my_title: "player info",
      player: false,
      players
    })
  }).catch(err => {
    console.log('error', err);
    res.render('pages/player_info', {
      my_title: 'Player info',
      player: false,
      players: [{'id':0,'name':'error'}],

    })
  });

});



app.get('/player_info/post', function(req, res) {
  console.log(req.query.player_choice);
  let id = req.query.player_choice;
  var select_players = `SELECT id,name FROM football_players;`;
  if(Number.isNaN(Number(id))){
    id = 0
  } //catch empty player case

  var select_player = `SELECT * FROM football_players WHERE id = ${Number(id)} LIMIT 1`;
  var select_games = `SELECT COUNT(*) FROM football_games WHERE ${Number(id)} = ANY (players);`;
  var select_averages = `SELECT AVG(passing_yards) AS passing, AVG(rushing_yards) AS rushing, AVG(receiving_yards) AS receiving FROM football_players WHERE id = ${Number(id)} LIMIT 1;`;
	db.task('get-football-players', task => {
    return task.batch([
      task.any(select_players , req.query),
      task.any(select_player , req.query),
      task.any(select_games , req.query),
      task.any(select_averages , req.query),
    ]);
  })
  .then(info => {
      var [players, player, games, averages] = info;

      console.log("averages: ", averages);
      if(player.length === 0) player = false;
      else player = player[0]
    	res.render('pages/player_info',{
        my_title: "player info",
        players,
        player,
        games: games[0].count, //pass game count and other info to the html
        averages: averages[0]
			})
    }).catch(err => {
            console.log('error', err);
            res.render('pages/player_info', {
                my_title: 'Player info',
                players: [{'id':0,'name':'error'}],
                player: false
            })
    });
});



//await db.none('INSERT INTO users(first_name, last_name, age) VALUES(${name.first}, $<name.last>, $/age/)', {
    //name: {first: 'John', last: 'Dow'},
  //  age: 30
//}/);



app.post('/home/pick_color', function(req, res) {
  console.warn("req, body = req,body", req.body);
  console.warn("pasta");

  try {
    var color_hex = req.body.color_hex;
    var color_name = req.body.color_name;
    var color_message = req.body.color_message;
    console.warn("VALUES (${color_hex}, ${color_name}, ${color_message =", color_hex, color_name, color_message);

    var insert_statement =  'INSERT INTO favorite_colors(hex_value, name, color_msg) VALUES (${color_hex}, ${color_name}, ${color_message}) RETURNING *;';// Write a SQL statement to insert a color into the favorite_colors table
    var color_select =  'select * from favorite_colors;';// Write a SQL statement to retrieve all of the colors in the favorite_colors table
    const color_to_add = {
      color_hex,
      color_name,
      color_message,
    }

    db.task('get-everything', task => {
          return task.batch([
              task.any(insert_statement, color_to_add),
              task.any(color_select)
          ]);
      })
      .then(info => {
        console.warn("colors LALALALLAL =",info);

        const newcolor = info[0]
        console.warn("newcolor =",  newcolor)

        res.render('pages/home',{
          my_title: "Home Page",
          data: info[1],// Return the color choices
          color: newcolor.hex_value, // Return the hex value of the color added to the table
          color_msg: newcolor.color_msg,// Return the color message of the color added to the table
        })
      })
      .catch(err => {
              console.log('error', err);
              console.log('pago');

              res.render('pages/home', {
                  my_title: '404 not found fam',
                  data: '',
                  color: '',
                  color_msg: ''
              })
      });


  } catch (e) {
    console.log('error: ', e);

    res.render('pages/home', {
        my_title: 'request body not found',
        data: '',
        color: '',
        color_msg: ''
    })

  }
});





app.listen(3000);
console.log('3000 is the magic port');
