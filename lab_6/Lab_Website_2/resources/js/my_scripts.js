$(document).ready(function() {
 // executes when HTML-Document is loaded and DOM is ready
});

/*
	players is an array to hold each player's information.
	Fields:
		name - Football player's name
		img  - The relative/absolute path to the image file.
		alt  - The alternative text that describes the image.
		year - The student's year in college (Freshman, Sophomore, Junior, Senior).
		major- The student's current college major.
		games_played    - The number of football games the student has played for the Buffs.
		pass_yards      - The total number of passing yards in the student's football career for the Buffs.
		rushing_yards   - The total number of rushing yards in the student's football career for the Buffs.
		receiving_yards - The total number of receiving yards in the student's football career for the Buffs.
*/
var players = [{name:"John Doe", img: "../resources/img/player1.jpg", alt:"Image of Player 1", year:"Sophomore", major:"Art", games_played: 23, pass_yards: 435, rushing_yards: 200, receiving_yards: 88},
				{name:"James Smith", img: "../resources/img/player2.jpg", alt:"Image of Player 2", year:"Junior", major:"Science", games_played: 17, pass_yards: 192, rushing_yards: 102, receiving_yards: 344},
				{name:"Samuel Phillips", img: "../resources/img/player3.jpg", alt:"Image of Player 3", year:"Freshman", major:"Math", games_played: 8, pass_yards: 35, rushing_yards: 70, receiving_yards: 98},
				{name:"Robert Myers", img: "../resources/img/player4.jpg", alt:"Image of Player 4", year:"Senior", major:"Computer Science", games_played: 31, pass_yards: 802, rushing_yards: 375, receiving_yards: 128}];



//declare constants
const PLAYER_STATS = {
	YEAR: {
		id: "p_year",
		key: 'year'
	},
	MAJOR: {
		id: "p_major",
		key: "major"
	},
	GAMES_PLAYED: {
		id: "g_played",
		key: "games_played"
	},
	PASSING_YARDS: {
		id: "p_yards",
		key: "pass_yards"
	},
	AVG_PASSING_YARDS: {
		id: "avg_p_yards",
		key: "avg_pass_yards"
	},
	RUSHING_YARDS: {
		id: "r_yards",
		key: "rushing_yards"
	},
	AVG_RUSHING_YARDS: {
		id: "avg_r_yards",
		key: "avg_rushing_yards"
	},
	RECEIVING_YARDS: {
		id: "rec_yards",
		key: "receiving_yards"
	},
	AVG_RECEIVING_YARDS: {
		id: "avg_rec_yards",
		key: "avg_receiving_yards"
	},
	IMAGE: {
		id: "player_img",
		key: "img"
	}
};

const INPUTS = {
	student_status: {
		YES: "studentStatusYes",
		NO: "studentStatusNo",
	},
	alumni_status: {
		YES: "alumniStatusYes",
		NO: "alumniStatusNo"
	},
	undergrad_select: {
		YES: "undergrad"
	},
	grad_select: {
		YES: "graduate"
	}
};

const STATUS = {
	STUDENT: "student_status",
	ALUMNI: "alumni_status",
	UNDERGRAD: "undergrad_select",
	GRAD: "grad_select"
};
/*
	Registration Page:
		viewStudentStats(id, toggle) method
			parameters:
				id - The css id of the html tag being updated.
				toggle -
					0 - hide the html tag
					1 - make the html tag visible

			purpose: This method will accept the id of an html tag and a toggle value.
					 The method will then set the html tag's css visibility and height.
					 To hide the html tag (toggle - 0), the visibility will be set to hidden and
					 the height will be set to 0.
					 To reveal the html tag (toggle - 1), the visibility will be set to visible and
					 the height will be set to auto.
*/

function hideStatus(id) {
	const statusElement = document.getElementById(id);

	if(statusElement) {
		statusElement.style.visibility = "hidden";
		statusElement.style.height = "0px";
	}
}

function showStatus(id) {
	const statusElement = document.getElementById(id);

	if (statusElement) {
		statusElement.style.visibility = "visible";
		statusElement.style.height = "auto";
	}
}

function viewStudentStats(id,toggle)
{
	console.log(id, toggle);
	if(toggle == 1)
	{
		showStatus(id);
	}
	if(toggle == 0)
	{
		hideStatus(id);
	}

	onStatusChange(id);
}


function onLoad()
{
	const statuses = Object.values(STATUS);

	checkStatuses(statuses);
}

/*
	Home Page:
		changeColor(color) method
			parameter:
				color- A css color

			purpose: This method will set the html body's background color to the
					 provided parameter.
*/
function changeColor(color)
{
	console.log(color);
	document.body.style.background = color;
}
/*
	Football Season Stats Page:
		loadStatsPage method:
			parameters: none

			purpose: This method will iterate through the stats table and
					 do the following:
						1. Read through each row of the table & determine which team won
						   the game.

						2. Update the winner column to the name of the winning team.

						3. Keep track of the number of wins/losses for the Buffs.

						4. Update the second table to show the total number of wins/losses for the Buffs.
*/
function loadStatsPage()
{
	var winTotal = 0;
	var lossTotal = 0;

	//stats_table
	var table = document.getElementById("stats_table");
	var row_counter;

	for(row_counter = 2; row_counter < table.rows.length; row_counter++)
		{//Outer for loop iterates over each row
			var row = table.rows[row_counter];
			var homeScore = row.cells[2].innerHTML; //extract the data to compare it
			var oppScore = row.cells[3].innerHTML;

		//do the compare!
			if(homeScore>oppScore) //win case
			{
				row.cells[4].innerHTML += "CU Boulder"; //add the text
				winTotal +=1;
			}
			else //loss
			{
				row.cells[4].innerHTML += row.cells[1].innerHTML;
				lossTotal +=1;
			}

			var total_wins = document.getElementById("wins");
			var total_losses = document.getElementById("losses");

			total_wins.innerHTML = winTotal; //update the bottom with the overalls
		total_losses.innerHTML = lossTotal; //
		}
}

/*
	Football Player Information Page
		loadPlayersPage method:
			parameters: none

			purpose: This method will populate the dropdown menu to allow the
					 user to select which player's information to view.

					 To handle this, you will need to iterate through the players array
					 and do the following for each player:
						1. Create an anchor tag
						2. Set the href to "#", this will make sure the
							anchor tag doesn't change pages
						3. Set the onclick to call switchPlayers method
							(this will need to pass in the index inside the players array)
						4. Set the anchor tag's text to the player's name.

					After setting all of the anchor tags, update the innerHTML of the dropdown menu.
					As a note, the id for the dropdown menu is player_selector.

		switchPlayers(playerNum) method:
			parameters:
				playerNum - The index of the football player in the players array.

			purpose:
				This method will update the the spans on the player's information pageX
				and calculate the average passing, rushing, and receiving yards.

				Span ids:
					p_year     - the player's year in college
					p_major    - the player's major in college
					g_played   - the number of games played for Buffs
					player_img - the player's photo (must set src and alt)
					p_yards    - the number of passing yards
					r_yards    - the number of rushing yards
					rec_yards  - the number of receiving yards

					Calculated values:
					  avg_p_yards   - the average number of passing yards for the player's Buff career
					  avg_r_yards   - the average number of rushing yards for the player's Buff career
					  avg_rec_yards - the average number of receiving yards for the player's Buff career
*/
function addPlayerToDropdown(player, selector){
	const {name, img, alt, year, major, games_played, pass_yards, rushing_yards, receiving_yards} = player;
	const playerOption = document.createElement('a');

	playerOption.href = "#";
	playerOption.onclick =  () => {
		switchPlayers(players.indexOf(player))
	},
	playerOption.innerHTML = name;
	playerOption.style.display = 'block';

	selector.appendChild(playerOption)
}

function loadPlayersPage()
{
	const playerSelectorId = "player_selector";
	const playerSelectorElement = document.getElementById(playerSelectorId);

	players.forEach((player)=>{
		addPlayerToDropdown(player, playerSelectorElement)
	})
}

function switchPlayers(playerNum)
{
	const player = players[playerNum];
	const stats = Object.values(PLAYER_STATS);

	// will make an array of the players stat's  { element id + object key }
	// i.e  [{id: g_played, key: games_played}, ]

	player['avg_receiving_yards'] = (player[PLAYER_STATS.RECEIVING_YARDS.key] / player[PLAYER_STATS.GAMES_PLAYED.key]).toFixed(2);

	player['avg_pass_yards'] = (player[PLAYER_STATS.PASSING_YARDS.key] / player[PLAYER_STATS.GAMES_PLAYED.key]).toFixed(2);

	player['avg_rushing_yards'] =(player[PLAYER_STATS.RUSHING_YARDS.key] / player[PLAYER_STATS.GAMES_PLAYED.key]).toFixed(2);

	stats.forEach(({id, key}) => {
		const statElement = document.getElementById(id);
		statElement.innerHTML = player[key];
	})

	const playerImgElement = document.getElementById(PLAYER_STATS.IMAGE.id);
	playerImgElement.src = player[PLAYER_STATS.IMAGE.key];

}


//***My Helper Functions***
function isButtonChecked(id)
{
    //returns a boolean true or false if this button id is checked
    return !!$(`#${id}:checked`).val();
}

function checkStatus(statusId)
{
	//returns a boolean true or false if this status i.e 'student_status' is checked / checked true
	try {
		return isButtonChecked(INPUTS[statusId].YES);
	} catch (e) {
		console.log(`YES input was not found for #${statusId} `);
		return false;
	}
}

function checkStatuses(statuses)
{
	statuses.forEach((statusId) => {
		onStatusChange(statusId);
	});

	console.log('\n');
}


function onStatusChange(statusId)
{
	const statusIsTrue = checkStatus(statusId);

	if (statusIsTrue) {
		//Code for status input being Yes or True or Checked goes here
		console.log(`Status for #${statusId} is true!`)
		showStatus(statusId)
	} else {
		//Code for status input being No or False or Unchecked goes here
		console.log(`Status for #${statusId} is false!`)
		hideStatus(statusId);
	}

	console.log('\n');
}


onLoad();
