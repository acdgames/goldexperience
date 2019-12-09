
var Imported = Imported || {};
Imported.SGS_Stats = true;

var SGS = SGS || {};
SGS.Stats = SGS.Stats || {};

/*:
@plugindesc v1.2 This plugin allows to attach additional stats to battlers (actors and enemies). 
These stats can be used in damage formulas or elsewhere. Stats can be influenced by states, 
equipment and can be automaticly changed by leveling up.

@author MagicMagor

@param Debug
@desc Set to true to have additional information put into the console (F8). Helpfull for debugging
@type boolean
@default false

@param Names
@desc A list of names for the additional stats.
@type text[]

@param Default
@desc A default value for a stat, which value was not defined by notetags
@type number
@default 0

@param Maximum
@desc The default maximum value for a stat. Leave empty for no maximum
@type number

@param Minimum
@desc The default minimum value for a stat. Leave empty for no minimum
@type number
@default -1

@param Formula
@desc The formula defining how the stats are calculated
@type text
@default base + plus

@param useEnemyFormula
@desc Set to true, to use a different stat-formula for enemies
@text Use seperate formula for enemies
@type boolean
@default false

@param Enemy Formula
@parent useEnemyFormula
@desc The seperate formula used for enemies.
@default base + plus

@help
======================================================================
With this plugin you can define additional stats for your battlers. 
They can be easily accessed for usage in damage formulas 
or other places. Classes, states and equipment can dynamicly change
a battlers stat.

======================================================================
Parameters
======================================================================
** Use Enemy Formula
This is a switch to decide if you want to use the same stat-formula
for actors and enemies. If set to false (default), the formula
'Formula' is used for both. If set to true, Formula will be used
only for actors and 'Enemy Formula' will be used for enemies.

** Formula/Enemy Formula
This is the formula that defines how the stats are calculated for an
actor or an enemy. This gets evaluated as javascript, with the return
value being the stat.
Formula is used for both or only actors (depending on 
'Use Enemy Formula') while 'Enemy Formula' isn't used at all, or used 
for enemies only.
The following values can be used inside the formula:
*** base
	This is the actual stat-base of the actor/enemy. This value is 
	set using the <SGS Stat: name=value> Notetag on the actor/enemy 
	or the configured default-value if no notetag is present
*** plus
	This is the calculated change to stat. This includes all changes
	done via the incSGSStat()-function as well as the stat-base 
	values	of:
	* All States, that are currently affecting the actor/enemy
	* All currently equiped equipment (weapon+armor) of the actor
	* The actors class
	This also includes all changes done to the actor by leveling up
	using the <SGS Stat Level: name=value> notetag
	
	All these values are added together to form the plus-value 
	in the formula
*** item
	This is a reference to the actual Game_Actor or Game_Enemy 
	object itself. Can be used for more advanced calculation
======================================================================
Notetags
======================================================================
** <SGS Stat: name=value>
(Actors, Classes, Enemies, Weapons, Armors, State)

With this you set the base value for the stat 'name' to 'value'. 
A battlers (actor, enemy) stat is influenced by the stat-value present 
on all states, that currently affect him.
In addition an actors stat is also influenced by his class and his 
current equipment. All values are added together to form the final 
stat-value. The exact formula can be changed with the Formula parameter.
For actors and enemies the stat value can easily be retrieved in damage 
formulas via
		a.name
----------------------------------------------------------------------
** <SGS Stat Level: name=value>
(Actors, Classes, Weapons, Armors, State)

With this notetag you can define the increase in a stat upon leveling
up an actor. The total increase when leveling up is the sum of all
these tags on the actor, the class and the states and equipment the
actor is affected by or wearing when leveling up.

Note: These bonuses are used when leveling up. If the actor has a
weapon with such a tag equipped when he levels up his stat will increase.
Unequipping the weapon afterwards will not lower his stat by this amount.
----------------------------------------------------------------------
** <SGS Stat Max: name=value>
(Actors, Classes, Enemies, Weapons, Armors, State)

With this notetag you can define a specific maximum for this stat of
this item.
----------------------------------------------------------------------
** <SGS Stat Min: name=value>
(Actors, Classes, Enemies, Weapons, Armors, State)

With this notetag you can define a specific minimum for this stat of
this item.

======================================================================
Advanced Notetags - Using javascript
======================================================================
** <SGS Stat: name>
	code
** </SGS Stat>

The entered code will be evaluated to calculate the stat-base for
the stat 'name'
----------------------------------------------------------------------
** <SGS Stat Level: name>
	code
** </SGS Stat Level>

The entered code will be evaluated to calculate the stat per level
increase for the stat 'name'
----------------------------------------------------------------------
In all advanced notetags the following variables are present:
** value

The actual value that will be returned. Will be initialized with the
value defined by the corresponding basic notetag or DEFAULT/0 if no
such notetag is present.

** baseValue

The value defined by the normal base-notetag or DEFAULT, if no notetag
is present.

** plusValue

The addition to the stat, changed by the incStat-calls. Is initialized
with 0 before any calls are made.

** perLevelValue

The value defined by the normal per-level notetag or 0 if no such
notetag exists.

** item

The actual database item, the stat belongs to. For example the actor,
enemy or weapon.

** name

The name of the stat.

** max

The maximum value for a stat. Defined by the Maximum-Parameter or
the specific maximum-notetag. Undefined when no maximum is defined.

** min

The minimum value for a stat. Defined by the Minimum-Parameter or
the specific minimum-notetag. Undefined when no minimum is defined.
----------------------------------------------------------------------
It is possible to evaluate the advanced notetags inside advanced
notetags.
* this.base()
Will evaluate the advanced base-notetag, if present, or return the
base-value
* this.level()
Will evaluate the advanced level-notetag if present, or return the
perLevel value.
----------------------------------------------------------------------
NOTE: Use these with caution as this can cause an infinite loop.
For example calling this.base() inside the advanced base-tag will
evaluate the base-tag, which will call the function etc.. causing
an infinite loop.
======================================================================
Javascript Functions
In all upcoming function-examples 'a' is the actor or enemy.
The name of the stat has to be written in '' as a string.
Like this: a.someFunction('strength')
======================================================================
** Getting a stat-value
To get a stat-value the following simple function can be used:
	a.sgsStat(name)
Name refers to the configured name of the stat you want to get.
(f.ex. 'strength') The value returned will be calculated based
on the Formula or EnemyFormula parameters (depending on whether you
use both or only a single formula and whether 'a' is an actor or an
enemy.
----------------------------------------------------------------------
** Changing a stat-value
To change the stat-value you can use the following function for actors 
and enemies
	a.incSGSStat(name, value)
Here name is the name of the stat (f.ex. 'willpower') and value is the 
value you want to add. Use negative values if you want to decrease the
stat.
----------------------------------------------------------------------
** Setting a stat-value
To set a specific stat-value you can use the following function for
actors and enemies
	a.setSGSStat(name, value)
This will set the plus value of the stat 'name' to 'value'. 
See description of the Formula parameter for an explanation of
the plus-value.
----------------------------------------------------------------------
** Getting the total level-increase
When leveling up, all stats will increase based on notetags on several
database-objects.
To get the total amount a stat will increase per level you can use:
	a.getSGSLevelInc(name)
With name being the stat in question. This will only work on actors.
======================================================================
Advanced Javascript
======================================================================
This section deals with the internal data-structure of this plugin.
Understanding this allows greater control of the plugin as well
as developing extending plugins.
======================================================================
* Database Objects
======================================================================
All database objects that allow SGS Stat notetags save their stats
in a private property.

** _sgs_stats
This is an object containing all stats. Acces should be done via
_sgs_stats[name]. This will return a SGS_Stat object or undefined
if the name is not known.

======================================================================
** SGS_Stat
======================================================================
This is the base class of this plugin. An instance of this class
represents a single stat. This class offers the following properties
and functions.
----------------------------------------------------------------------
** Properties
----------------------------------------------------------------------
** this.name
The name of the stat.

** this.baseValue
The base value of this stat as defined by the base-notetag. Defaults
to the configured DEFAULT-value, if no notetag is present.

** this.baseScript
The content of the advanced base-notag.

** this.plusValue
Contains the cummulative changes done to the stat via incStat-calls.
Is initialized with 0 and every incStat-call changes this value.

** this.perLevelValue
The value defined by the basic level-notetag, denoting the 
stat-increase when leveling up.

** this.perLevelScript
The content of the advanced level-notetag

** this.item (Currently not working)
The parent database-item this stat belongs to.
----------------------------------------------------------------------
** Functions
----------------------------------------------------------------------
** SGS_Stat(name)
*** name - The name of the stat
The constructor of the class.

** base(item)
*** item - The parent item of the stat
Calculates the base-value of this stat. Returns the baseValue as
modified after running the baseScript.

** plus()
Returns the plusValue.

** level(item)
*** item - The parent item of the stat
Calculates the perLevel-value of this stat. Returns the perLevelValue
as modified after running the perLevelScript

** readNoteTag(note)
*** The complete note-data
Reads all known notetags from the note and changes its values
accordingly.

** parseNoteTag(note, regex, isNumber)
*** The note-data
*** The Regex of the notetag
*** isNumber - true if the value is a number, false if returned as string
Returns the value of the parsed notetag. The regex needs two capture-
groups. The first should evaluate to the name of the stat, the 
second evaluates to the value returned by this function.
The third parameter defines if the value is returned as a number
(true) or as a String (false)
Will return undefined if no match with the regex was found.
Matches where the read name doesn't match the name of the stat
are ignored.

** incStat(value)
*** value - The value to change the stat
Will add the value to the plusValue.

** setPlusValue(value)
*** value - The value to set
Will set the plusValue to the given value.

*/

SGS.Parameters = PluginManager.parameters('SGS_Stats');
SGS.Stats.Param = SGS.Param || {};
SGS.Stats.Param.NAMES = JSON.parse(SGS.Parameters['Names']);
SGS.Stats.Param.DEFAULT = Number(SGS.Parameters['Default']);
var m = SGS.Parameters['Maximum'];
if(m != "") {
	SGS.Stats.Param.MAX	= Number(m);
}
var m = SGS.Parameters['Minimum'];
if(m != "") {
	SGS.Stats.Param.MIN	= Number(m);
}
SGS.Stats.Param.DEBUG = Boolean(SGS.Parameters['Debug']);
SGS.Stats.Param.FORMULA = String(SGS.Parameters['Formula']);
SGS.Stats.Param.USE_ENEMY_FORMULA = Boolean(SGS.Parameters['useEnemyFormula']);
SGS.Stats.Param.ENEMY_FORMULA = String(SGS.Parameters['Enemy Formula']);


//======================================================================
// class SGS_Stat
//======================================================================
function SGS_Stat(name) {
	this.initialize(name);
}

SGS_Stat.prototype.initialize = function(name) {
	this.NOTE_TAG_BASE = /<SGS Stat:\s*([A-z]+)=(.+)\s*>/ig;
	this.NOTE_TAG_LEVEL = /<SGS Stat Level:\s*([A-z]+)=(.+)\s*>/ig;
	this.NOTE_TAG_BASE_SCRIPT = /<SGS Stat:\s*([A-z]+)\s*>([\s\S]+)\s*<\/SGS Stat>/ig;
	this.NOTE_TAG_LEVEL_SCRIPT = /<SGS Stat Level:\s*([A-z]+)\s*>([\s\S]+)\s*<\/SGS Stat Level>/igm;
	this.NOTE_TAG_MAX = /<SGS Stat Max:\s*([A-z]+)=(.+)\s*>/ig;
	this.NOTE_TAG_MIN = /<SGS Stat Min:\s*([A-z]+)=(.+)\s*>/ig;
	this.max = SGS.Stats.Param.MAX;
	this.min = SGS.Stats.Param.MIN;
	this.name = name;
	this.baseValue = SGS.Stats.Param.DEFAULT;
	this.plusValue = 0;
	this.perLevelValue = 0;
	this.baseScript = "";
	this.perLevelScript = "";
}
/*
SGS_Stat.prototype.max = function() {
	return this.max;
}

SGS_Stat.prototype.min = function() {
	return this.min;
}
*/
SGS_Stat.prototype.base = function(item) {
	var value = this.baseValue;
	if(this.baseScript !== "") {
		eval(this.baseScript);
	}
	return value;
}

SGS_Stat.prototype.perLevel = function(item) {
	var value = this.perLevelValue;
	if(this.perLevelScript !== "") {
		eval(this.perLevelScript);
	}
	return value;
}

SGS_Stat.prototype.plus = function() {
	return this.plusValue;
}

SGS_Stat.prototype.readNoteTag = function(note) {
	var v;
	// Base Value
	v = this.parseNoteTag(note, this.NOTE_TAG_BASE, true);
	if(v !== undefined) {
		this.baseValue = v;
	}
	v = undefined;
	// Base Advanced value
	v = this.parseNoteTag(note, this.NOTE_TAG_BASE_SCRIPT, false);
	if(v !== undefined) {
		this.baseScript = v;
	}
	v = undefined;
	// Per Level
	v = this.parseNoteTag(note, this.NOTE_TAG_LEVEL, true);
	if(v !== undefined) {
		this.perLevelValue = v;
	}
	v = undefined;
	// Per Level Advanced
	v = this.parseNoteTag(note, this.NOTE_TAG_LEVEL_SCRIPT, false);
	if(v !== undefined) {
		this.perLevelScript = v;
	}
	v = undefined;
	// Maximum value
	v = this.parseNoteTag(note, this.NOTE_TAG_MAX, true);
	if(v !== undefined) {
		this.max = v;
	}
	v = undefined;
	v = this.parseNoteTag(note, this.NOTE_TAG_MIN, true);
	if(v !== undefined) {
		this.min = v;
	}
	v = undefined;
}

SGS_Stat.prototype.parseNoteTag = function(note, regex, isNumber) {
	var match;
	var value;
	while(match=regex.exec(note)) {
		var name = match[1];
		if(name === this.name) {
			if(isNumber) {
				value = Number(match[2]);
			} else {
				value = String(match[2]);
			}
		}
	}
	return value;
}

SGS_Stat.prototype.incStat = function(value) {
	this.plusValue += value;
}

SGS_Stat.prototype.setPlusValue = function(value) {
	this.plusValue = value;
}

//======================================================================
// End of class Stat
//======================================================================


SGS.Stats.verifyParams = function() {
	return true;
}


SGS.ensureStatPresent = function(object) {
	var stats = {};
	for(var i=0; i < SGS.Stats.Param.NAMES.length; i++) {
		var name = SGS.Stats.Param.NAMES[i];
		var single_stat = new SGS_Stat(name);
		single_stat.readNoteTag(object.note);
		stats[name] = single_stat;
	}
	object._sgs_stats = stats;
}

SGS.loadSGSBaseStats = function(group) {
	var statregex = /<SGS Stat:\s*([A-z]+)=(.+)\s*>/ig;
	for (var i = 1; i < group.length; i++) {
  		var dataObject = group[i];
		SGS.ensureStatPresent(dataObject);
  	}
}

SGS.getStatSumFromList = function(list, name, property) {
	var sum = 0;
	for(var i=0; i < list.length; i++) {
		var item = list[i];
		sum += SGS.getStatFromItem(item, name, property);
	}
	return sum;
}

SGS.getStatFromItem = function(item, name, property) {
		var value = 0;
		if(item && item._sgs_stats[name]) {
			switch(property) {
				case 'base':
					value = item._sgs_stats[name].base(item);
					break;
				case 'plus':
					value = item._sgs_stats[name].plus();
					break;
				case 'perLevel':
					value = item._sgs_stats[name].perLevel(item);
					break;
				default:
					console.log("Property '"+property+"' unknown");
					break;
			}
		} else {
			console.log("Stat '"+name+"' not defined");
		}
		return value;
}


//======================================================
// DataManager
//======================================================
// Initializing stats from note-tags
//======================================================
SGS.Stats.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!SGS.Stats.DataManager_isDatabaseLoaded.call(this)) return false;
    if(!SGS.Stats.verifyParams()) {
    	throw "SGS Stats: Invalid parameters";
    }
    this.sgsStatsLoadBase();
    return true;
}

DataManager.sgsStatsLoadBase = function() {
    if(SGS.Stats.Param.NAMES.length > 0) {
    	SGS.loadSGSBaseStats($dataActors);
    	SGS.loadSGSBaseStats($dataEnemies);
    	SGS.loadSGSBaseStats($dataStates);
    	SGS.loadSGSBaseStats($dataClasses);
    	SGS.loadSGSBaseStats($dataWeapons);
    	SGS.loadSGSBaseStats($dataArmors);
    }
}

DataManager.sgsStatsLoadLevel = function() {
    if(SGS.Stats.Param.NAMES.length > 0) {
    	SGS.loadSGSLevelIncrease($dataActors);
    	SGS.loadSGSLevelIncrease($dataEnemies);
    	SGS.loadSGSLevelIncrease($dataStates);
    	SGS.loadSGSLevelIncrease($dataClasses);
    	SGS.loadSGSLevelIncrease($dataWeapons);
    	SGS.loadSGSLevelIncrease($dataArmors);
    }
}


//======================================================
// Game_BattlerBase
//======================================================
// Getter function
//======================================================
Game_BattlerBase.prototype.sgsStat = function(name) {
	var base;
	var plus;
	if(this._sgs_stats[name] === 'undefined') {
		if(SGS.Stats.Param.DEBUG) {
			console.log("SGS Stats: Battler '"+this.name()+"' has no SGS Stat '"+name+"' defined. Using default value: " + SGS.Stats.Param.DEFAULT);
		}
		base = SGS.Stats.Param.DEFAULT;
		plus = 0;
	} else {
		base = this._sgs_stats[name].base(this);
		plus = SGS.getStatFromItem(this, name, 'plus');
	}
	// Check affecting states
	plus += SGS.getStatSumFromList(this.states(), name, 'base');
	if(this.isActor()) {
		// * Check class
		var c = this.currentClass();
		plus += SGS.getStatFromItem(c, name, 'base');
		// * Check equipment
		var weapons = this.weapons();
		plus += SGS.getStatSumFromList(weapons, name, 'base');
		var armors = this.armors();
		plus += SGS.getStatSumFromList(armors, name, 'base');		
	}
	// Calculate the result using the configured formula
	var formula = SGS.Stats.Param.FORMULA;
	if(SGS.Stats.Param.USE_ENEMY_FORMULA && this.isEnemy()) {
		formula = SGS.Stats.Param.ENEMY_FORMULA;
	}
	var result = SGS.Stats.Param.DEFAULT;
	var item = this;	
	try {
		result = eval(formula);
	} catch(e) {
		if(SGS.Stats.Param.DEBUG) {
			console.log(e);
		}
	}
	if(this._sgs_stats[name].max !== undefined && result > this._sgs_stats[name].max) {
		result = this._sgs_stats[name].max;
	}
	if(this._sgs_stats[name].min !== undefined && result < this._sgs_stats[name].min) {
		result = this._sgs_stats[name].min;
	}
	return result;
}

var code = "Object.defineProperties(Game_BattlerBase.prototype, {"

for(var i=0;  i < SGS.Stats.Param.NAMES.length; i++) {
	var statName = SGS.Stats.Param.NAMES[i].trim();
	var property = statName + ": { get: function() { return this.sgsStat('" + statName + "');}, configurable: false},";
	code = code + property
}
// Remove trailing comma
code = code.slice(0, -1);
code = code + "});"
console.log(code);
eval(code)


//======================================================================================================================
// Increase stat by certain value. Use negative values to decrease.
// * name - The name of the stat to increase
// * value - The value by which to increase.
//======================================================================================================================
Game_BattlerBase.prototype.incSGSStat = function(name, value) {
	this._sgs_stats[name].incStat(value);
}

Game_BattlerBase.prototype.setSGSStat = function(name, value) {
	this._sgs_stats[name].setPlusValue(value);
}

//======================================================
// Game_Actor
//======================================================
// Copying stats from database to actor
//======================================================
SGS.Stats.Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
	SGS.Stats.Game_Actor_setup.call(this, actorId);
    var actor = $dataActors[actorId];
    this._sgs_stats = actor._sgs_stats;
}

//======================================================
// Increasing stats on level up
//======================================================
SGS.Stats.Game_Actor_levelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
	SGS.Stats.Game_Actor_levelUp.call(this);
	for(var i=0; i < SGS.Stats.Param.NAMES.length; i++) {
		var name = SGS.Stats.Param.NAMES[i];
		var levelInc = this.getSGSLevelInc(name);
		this.incSGSStat(name, levelInc);
	}
}

Game_Actor.prototype.getSGSLevelInc = function(name) {
	var levelInc = 0;
	levelInc += SGS.getStatSumFromList(this.states(), name, 'perLevel');
	levelInc += SGS.getStatSumFromList(this.weapons(), name, 'perLevel');
	levelInc += SGS.getStatSumFromList(this.armors(), name, 'perLevel');
	levelInc += SGS.getStatFromItem(this.currentClass(), name, 'perLevel');
	return levelInc;
}

//======================================================
// Game_Enemy
//======================================================
// Copying stats from database to enemy
//======================================================
 SGS.Stats.Game_Enemy_setup = Game_Enemy.prototype.setup;
 Game_Enemy.prototype.setup = function(enemyId, x, y) {
	SGS.Stats.Game_Enemy_setup.call(this, enemyId, x, y);
    var enemy = $dataEnemies[enemyId];
    this._sgs_stats = enemy._sgs_stats;
	//YANFLY PASSIVE STATE SLAPPED ON
	this._passiveStatesRaw = enemy._passiveStatesRaw;
 }
