var random = new Random();
const numFloors = document.querySelector("#numOfFloors");
const numRooms = document.querySelector("#numOfRooms");
const towerStyle = document.querySelector("#towerStyle");

// Tower Object blueprint
function Tower(){
  name : "";
  numberOfRooms: 0;
  minNumberOfFloors: 0;
  numberOfFloors: 0;
  wealthLevel: 0;
  floors: null;

  // Generate a name for the tower, also selects a name for the original occupier
  this.generateName = function(){
    // Generate a new name for the Tower
    var builderTitleArrayMax = data.builder_name[0].length;
    var builderNameArrayMax = data.builder_name[1].length;
    // Get a first name
    this.name = data.builder_name[0][Math.floor(Math.random() * builderTitleArrayMax)] + " "
    + data.builder_name[1][random.randomInt(builderNameArrayMax)] + "'s "
    + data.name_suffix[Math.floor(Math.random() * data.name_suffix.length)];

  }

  // Assign a number of rooms depending on level of wealth
  this.setNumRooms = function(){
    // Minimum level of wealth, no additional calculations needed, just random number in the range
    if(this.wealthLevel === 0){
      this.numberOfRooms = Math.floor(Math.random() * data.wealth[this.wealthLevel].maxRooms + 1);
    // When wealth level increases, ensure min number of rooms is greater than the max of the previous wealth level
    } else {
      var minNumberOfRooms = data.wealth[this.wealthLevel - 1].maxRooms;
      var maxRooms = data.wealth[this.wealthLevel].maxRooms;
      this.numberOfRooms = Math.floor((Math.random() * (maxRooms - minNumberOfRooms + 1)) + minNumberOfRooms);
    }

  }

  // Simplified number of floors, no more floors than rooms
  this.setNumFloors = function(){
    this.numberOfFloors = (Math.floor(Math.random() * this.numberOfRooms + 1));
    this.floors = new Array();
    for(var i = 0; i < this.numberOfFloors; i++){
      this.floors[i] = new TowerFloor();
    }
  }

  this.distributeRooms = function(){
    var random = new Random();
    var MAX_ROOMS_PER_FLOOR = 5;
    var remainingRooms = this.numberOfRooms;
    // Put at least one room on all floors
    for(var i = 0; i < this.floors.length; i++){
      this.floors[i].addRoom();
      // Decrease number of remaining rooms as needed
      remainingRooms--;
    }

    // Fill the tower floors with the remaining rooms
    for(var j = remainingRooms; j > 0; j--){
      // Pick a random floor
      var tempFloor = random.randomInt(this.numberOfFloors);
      // Check how many rooms already exist on this floor
      var numRoomsOnThisFloor = this.floors[tempFloor].rooms.length;

      // If the random floor is the ground floor, add room without restrictions
      if(tempFloor === 0) {
        this.floors[tempFloor].addRoom();
        remainingRooms--;
        continue;
      }

      // Prevent over population
      if(numRoomsOnThisFloor === MAX_ROOMS_PER_FLOOR){
        continue;
      }

      // If the floor below has the same or more rooms (ground lower can be many higher), add a room
      var numRoomsOnFloorBelow = this.floors[tempFloor - 1].rooms.length;
      if(numRoomsOnFloorBelow >= numRoomsOnThisFloor){
          this.floors[tempFloor].addRoom();
          remainingRooms--;
      }
    }
  }

  // Return the word version of a specified number
  // TODO Move this to global
  this.getWordNum = function(number){
    return data.numberToWord[number];
  }

  //Returns a string detailing the number of rooms in the tower
  this.getWordNumRooms = function(){
    var textOut = "There ";
    if(this.numberOfRooms === 1) return textOut + "is one room in the tower.";
    return textOut + "are " + this.getWordNum(this.numberOfRooms) + " rooms in the tower.";
  };

  this.drawTower = function(){

    var div = document.createElement('div');
    div.className = 'towerRooms';
    var stringOfHTML = '<table>';

    var roomNumber = this.numberOfRooms;
    // Cycle through the tower floors from the top
    for(var i = this.floors.length - 1; i >= 0; i--){
      stringOfHTML += '<tr>';

      // Draw a new table cell for each room in the floor
      for(var j = 0; j < this.floors[i].rooms.length; j++){
        stringOfHTML += '<td>Room ' + roomNumber + '</td>';
        roomNumber--;
      }
      stringOfHTML += '</tr>';
    }

    stringOfHTML += '</table>';

    div.innerHTML = stringOfHTML;
    var oldChild = document.getElementById('towerAppearance').firstChild;
    document.getElementById('towerAppearance').replaceChild(div, oldChild);
  }

  //Generate name
  this.generateName();
  //this.name = data.name_prefix[ data.numberOfPrefixNames)] + " Tower";
  this.wealthLevel = Math.floor(Math.random() * data.levelsOfWealth)
  if(this.wealthLevel === 0) maxRooms = 1;
  this.setNumRooms(Math.floor((Math.random() * data.wealth[this.wealthLevel].maxRooms) + 1));
  this.setNumFloors();
  this.distributeRooms();

};

// Class for representing a floor in a tower. Holds Room objects
function TowerFloor(){
  this.rooms = new Array();

  this.setNumberOfRooms = function(numberOfRooms){
    for(var i = 0; i < numberOfRooms; i++){
      this.rooms[i] = new TowerRoom();
    }
  }

  this.addRoom = function(){
    this.rooms.push(new TowerRoom());
  }
}

function TowerRoom(){
}

// Class for producing random numbers
function Random(){
  // Random integer from given max
  this.randomInt = function(max){
    return Math.floor(Math.random() * max);
  }
}

function writeToDocument(){
  var towerObject = new Tower();
  var random = new Random();

  var towerName = document.getElementById('towerName');
  towerName.textContent = towerObject.name;

  // TODO Save this type of content to an object for reuse and for transferring to a database
  var el_wealthLevel = document.getElementById('wealthLevel');
  el_wealthLevel.textContent = "Home of a " + data.wealth[towerObject.wealthLevel].name + " occupant from " + data.homeland[random.randomInt(data.homeland.length)];


  var finalTextOutput = "";

  finalTextOutput += towerObject.getWordNumRooms();
  finalTextOutput += (towerObject.numberOfFloors > 1)? " They are spread over " + data.numberToWord[towerObject.numberOfFloors] + " floors."
  : " Even with only one floor, she considers it a tower.";
  //outputText.innerText = (finalTextOutput);

  towerObject.drawTower();

  numRooms.textContent = towerObject.numberOfRooms;
  numFloors.textContent = towerObject.numberOfFloors;

}

// Data objects for randomizer
var data = {

  // List of constants that may be used by the constructors as well as the web page
  constants : {
    maxRoomsPerFloor : 5
  },

  // Numbers in array as real words. numWordsDefined gives quick access to max available
  numWordsDefined : 20,
  numberToWord: [
      "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
      "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"
  ],

  // Homelands, origin places for our occupant
  homeland: [
    // Videogame names
    "Azeroth", "Tamriel", "Kalimdor", "Quel Thalas", "Northrend", "Argus",
    "Hyrule", "The Sword Coast", "Khanduras", "Dry Steppes", "Sharval Wilds",
    // Middle-Earth
    "Rohan", "Eriador", "Gondor", "The Shire", "The Iron Hills",
    // Kingkiller Series by Patrick Rothfuss
    "Imre", "Tarbean", "Vintas", "Ceald", "Modeg",
    // Night Angel Trilogy by Brent Weeks
    "Modai", "The Steppes", "Silk Bay", "Friaku",
    // The Malazan Book Of The Fallen by Steven Erickson
    "Genebackis", "Seven Cities", "Quon Tali", "Darujhistan",
    // Song of Ice and Fire by George R R Martin
    "Winterfell", "King's Landing", "Dorne", "Astapor", "Lannisport", "Myr", "Qarth", "Yunkai", "White Harbor",
    // Critical Role by Matt Mercer
    "Tal'Dorei", "Marquet", "The Underdark", "Wildmount"

  ],

  // Ranges for wealth
  levelsOfWealth: 7,
  wealth: [
    {name: 'destitute', maxGold: 10, maxRooms: 2},
    {name: 'poor', maxGold: 500, maxRooms: 4},
    {name: 'working class', maxGold: 2000, maxRooms: 6},
    {name: 'well off', maxGold: 10000, maxRooms: 8},
    {name: 'wealthy', maxGold: 50000, maxRooms: 10},
    {name: 'filthy rich', maxGold: 100000, maxRooms: 12},
    {name: 'royalty rich', maxGold: 250000, maxRooms: 14},
  ],

  // Tower description strings
  numberOfPrefixNames: 17,
  name_prefix : [
    //Descriptive words
    "Beautiful", "Majestic", "Terrifying", "Tall", "Short", "Stout", "Bright",
    "Gloomy", "Creepy", "Inviting", "Opulent", "Charming", "Stumpy", "Wonky",
    "Janky", "Dank", "Serene"
  ],

  // Builder name array
  // [0] Title
  // [1] name TODO Make names gender specific? For use of correct identifer (he, she etc)
  builder_name: [
    // Titles
    [
      "Grand Master", "Grand Vizier", "Queen", "King", "Prince", "Princess",
      "Earl", "Lord", "Baron",
      "Duke", "Maester", "Regent", "Artificer", "Archmage", "General", "Admiral",
      "Advisor", "Treasurer", "Keeper", "Ranger General", "Master of Coin", "Portmaster",
      "Warden", "Mayor"
    ],
    // Names
    [
      // Male
      "Harold", "Elrond", "Thrall", "Legolas", "Aragorn", "Frodo", "Gandelf",
      "Kael' Thas", "Zul'jin", "Anduin", "Varian", "Durzo", "Kvothe", "Abenthy",
      "Simmon", "Wilem", "Elodin", "Ambrose",
      "Merlin", "Solomon",
      // Female
      "Cleopatra", "Galadriel", "Arwen", "Denna", "Fela", "Devi", "Auri", "Lanre",
      "Rapunzel", "Cinderella", "Moana", "Elsa", "Arya", "Sansa", "Cersei", "Daenerys",
      "Ella", "Sylvanas", "Valla", "Li Li", "Johanna", "Brienne"
    ]
  ],

  // Second part for the name of the tower, when "tower" just won't do!
  name_suffix : [
    "Spire", "Rise", "Parapet", "Column", "Turret", "Stronghold", "Keep", "Obelisk",
    "Lookout", "Minaret", "Monolith", "Fortress", "Steeple", "Refuge", "Sanctuary",
    "Belfry", "Column", "Tower"
  ],

  tower_state: [
    "Magically Hidden", "Ruined", "Razed", "Abandoned", "Forgotten", "Revered",
    "Cursed", "Enchanted", "Lost", "Forbidden"
  ],

  // Room types
  roomTypes: [
    {name: "hall", description: "a room that connects to other rooms", weight: 1},
    {name: "kitchen", description: "a room for storing, preparing and cooking food", weight: 1},
    {name: "living room", description: "a relaxing space with comfortable seating", weight: 1},
    {name: "bedroom", description: "a place to sleep", weight: 1},
    {name: "closet", description: "a small room for storage", weight: 1},
    {name: "bathroom", description: "a place to take care of nature's call", weight: 1},
  ],

  // Furniture
  core : {
    bathroom : {
      toilet : [
        {name: "pisspot", value: 5, description: "A small, very well used ceramic pot. It may have been decorated at one point. Probably not though."},
        {name: "commode", value: 30, description: "A simple bench with a lidded seat. A bucket below can be removed when necessary."},
        {name: "toilet",  value: 150, description: "A glazed clay toilet, simply pour a bucket of water in when finished to send contents to the street gutters."}
      ],

      sink : [
        {name: "damp rag", value: 5, description: "A damp rag.. You aren't really sure how it became damp to begin with, but it always has been."},
        {name: "icy water bucket", value: 25, description: "Plunging your hands into its icy depths doesn't always seem worth it"},
        {name: "porcelain basin", value: 80, description: "The porcelain basin stands on its very own pedestal. Some fancy soap flakes sit in a bowl beside it."}
      ]
    }
  }

}


writeToDocument();
