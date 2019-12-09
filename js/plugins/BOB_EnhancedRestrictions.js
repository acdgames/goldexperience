//=============================================================================
// Bobstah Plugins
// BOB_EnhancedRestrictions.js
// Version: 1.5.2
//=============================================================================
var Imported = Imported || {};
Imported.BOB_EnhancedRestrictions = true;

var Bobstah = Bobstah || {};
Bobstah.EnhancedRestrictions = Bobstah.EnhancedRestrictions || {};
//=============================================================================
/*:
 * @plugindesc Version 1.5.3 - Allows greater restrictions to be placed on
 * weapons, armor, skills, items, and skill types.
 * @author Bobstah
 * 
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * Allows you to set extra restrictions on Items, Weapons, and Armors
 * via notetags. You can also modify some global restrictions, such
 * as Skill Types, via a special notetag on any actor.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 * A group of restrictions is contained between the <Restrict> tags.
 * You can have more than one group of restrictions per item/equip,
 * and the actor only has to meet one set. If you want
 * multiple restrictions, use a single group.
 *
 * If desired, you can prefix any Restriction with an !.
 * This will cause it to check the opposite of what you
 * specify. If you use it with Actor: 1, for example,
 * anyone but Actor 1 can equip or use the item.
 *
 * You can also replace anything after : with Javascript code
 * inside of $(), like so: Actor: $(yourFunction();)
 *
 * You can even combine the two: !Actor: $(yourFunction();)
 *
 * Weapon, Armor, Item
 * <Restrict>
 * LevelMin: X - Minimum level. Supports NOT (!) and eval $().
 * LevelMax: X - Maximum level. Supports NOT (!) and eval $().
 * Class: ID - Actor must be class ID. Supports NOT (!) and eval $().
 * Actor: ID - Actor must be this ID. Supports NOT (!) and eval $().
 * State: ID - Actor must have this state applied. Supports NOT (!) and eval $().
 * Weapon: ID - Actor must be wearing this weapon. Supports NOT (!) and eval $().
 * Armor: ID - Actor must be wearing this armor. Supports NOT (!) and eval $().
 * StatMin(Symbol): X - Stat Symbol must be at least X. Supports NOT (!) and eval $().
 * StatMax(Symbol): X - Stat Symbol must be at most X. Supports NOT (!) and eval $().
 * Switch(ID): On/Off - Switch ID must be on/off. Supports NOT (!) and eval $().
 * VarMin(ID): X - Variable ID must be at least X. Supports NOT (!) and eval $().
 * VarMax(ID): X - Variable ID must be at most X. Supports NOT (!) and eval $().
 * Custom: $(codeHere) - Run some Javascript. . Supports NOT (!)
 * </Restrict>
 *
 * Actor
 * The below notetag will restrict the Skill Type for all actors and
 * enemies, not just the actor it is located on. You can even place
 * this on an usused or blank actor in your database.
 *
 * 
 * <Restrict SType: X,X,etc>
 * LevelMin: X - Minimum level. Supports NOT (!) and eval $().
 * LevelMax: X - Maximum level. Supports NOT (!) and eval $().
 * Class: ID - Actor must be class ID. Supports NOT (!) and eval $().
 * Actor: ID - Actor must be this ID. Supports NOT (!) and eval $().
 * State: ID - Actor must have this state applied. Supports NOT (!) and eval $().
 * Weapon: ID - Actor must be wearing this weapon. Supports NOT (!) and eval $().
 * Armor: ID - Actor must be wearing this armor. Supports NOT (!) and eval $().
 * StatMin(Symbol): X - Stat Symbol must be at least X. Supports NOT (!) and eval $().
 * StatMax(Symbol): X - Stat Symbol must be at most X. Supports NOT (!) and eval $().
 * Switch(ID): On/Off - Switch ID must be on/off. Supports NOT (!) and eval $().
 * VarMin(ID): X - Variable ID must be at least X. Supports NOT (!) and eval $().
 * VarMax(ID): X - Variable ID must be at most X. Supports NOT (!) and eval $().
 * Custom: $(codeHere) - Run some Javascript. . Supports NOT (!)
 * </Restrict>
 *
 * The below notetag will restrict item usage in battles for all actors.
 * <Restrict Items>
 * LevelMin: X - Minimum level. Supports NOT (!) and eval $().
 * LevelMax: X - Maximum level. Supports NOT (!) and eval $().
 * Class: ID - Actor must be class ID. Supports NOT (!) and eval $().
 * Actor: ID - Actor must be this ID. Supports NOT (!) and eval $().
 * State: ID - Actor must have this state applied. Supports NOT (!) and eval $().
 * Weapon: ID - Actor must be wearing this weapon. Supports NOT (!) and eval $().
 * Armor: ID - Actor must be wearing this armor. Supports NOT (!) and eval $().
 * StatMin(Symbol): X - Stat Symbol must be at least X. Supports NOT (!) and eval $().
 * StatMax(Symbol): X - Stat Symbol must be at most X. Supports NOT (!) and eval $().
 * Switch(ID): On/Off - Switch ID must be on/off. Supports NOT (!) and eval $().
 * VarMin(ID): X - Variable ID must be at least X. Supports NOT (!) and eval $().
 * VarMax(ID): X - Variable ID must be at most X. Supports NOT (!) and eval $().
 * Custom: $(codeHere) - Run some Javascript. . Supports NOT (!)
 * </Restrict Items>
 *
 * ============================================================================
 * Examples
 * ============================================================================
 * Let's make an Evil Sword that anyone but our Paladin, Actor#1,
 * can equip:
 * <Restrict>
 * !Actor: 1
 * </Restrict>
 *
 * Next, let's make a piece of armor that someone can only
 * wear at level 5, 6, 7, 8, 9, and 10:
 * <Restrict>
 * LevelMin: 5
 * LevelMax: 10
 * </Restrict>
 *
 * Building on that, let's go all out. The following example
 * will allow any class but class#1 to equip it as long
 * as their atk is high enough, variable#6 is at least 10,
 * and switch#4 is turned off:
 * <Restrict>
 * !Class: 1
 * VariableMin(6): 10
 * Switch(4): off
 *
 * Lastly, we'll check to see if an actor has state#3
 * using the eval feature:
 * <Restrict>
 * Custom: ($a.states().indexOf(3) !== -1;)
 * </Restrict>
 *
 * What if we want a skill type 13 to only be usable
 * if someone has 100 TP?
 * <Restrict SType: 13>
 * StatMin(tp): 100
 * </Restrict>
*/

//=============================================================================
// Plugin Variables
//=============================================================================
Bobstah.EnhancedRestrictions.paramRef = {'mhp': 0,'mmp': 1,'atk': 2,'def': 3,'mat': 4,'mdf': 5,'agi': 6,'luk': 7};
Bobstah.EnhancedRestrictions.xparamRef = {'hit': 0,'eva': 1,'cri': 2,'cev': 3,'mev': 4,'mrf': 5,'cnt': 6,'hrg': 7,'mrg': 8,'trg': 9};
Bobstah.EnhancedRestrictions.sparamRef = {'tgr': 0,'grd': 1,'rec': 2,'pha': 3,'mcr': 4,'tcr': 5,'pdr': 6,'mdr': 7,'fdr': 8,'exr': 9};

//=============================================================================
// Plugin Functions
//=============================================================================
Bobstah.EnhancedRestrictions.createRestrictionsNode = function() {
	var obj = {
		'Class': [],
		'LevelMin': [],
		'LevelMax': [],
		'Actor': [],
		'Weapon': [],
		'Armor': [],
		'Switch': [],
		'StatMin': [],
		'StatMax': [],
		'VarMin': [],
		'VarMax': [],
		'Custom': [],
		'State': []
	};
	return obj;
};

Bobstah.EnhancedRestrictions.createRestrictionNode = function(val, not, evl, param) {
	param = param || null;
	var obj = {
		'Value': (evl === true ? val : Number(val)),
		'Not': not,
		'Eval': evl,
		'Param': param,
	};
	return obj;
};

Bobstah.EnhancedRestrictions.getValue = function(objSrc, obj, objContext) {
	if (obj['Eval'] === true) {
		var a = objSrc;
		var b = objContext;
		var c = obj;
		var res = eval(obj['Value']);
	} else {
		var res = obj.Value;
	}
	return res;
};

Bobstah.EnhancedRestrictions.getRestrictionList = function (resType) {
	switch (resType) {
		case 'class':
			resList = 'Class';
		break;
		
		case 'actor':
			resList = 'Actor';
		break;
		
		case 'weapon':
			resList = 'Weapon';
		break;
		
		case 'armor':
			resList = 'Armor';
		break;
		
		case 'levelmin':
			resList = 'LevelMin';
		break;
		
		case 'levelmax':
			resList = 'LevelMax';
		break;
		
		case 'switch':
			resList = 'Switch';
		break;
		
		case 'varmin':
			resList = 'VarMin';
		break;
		
		case 'varmax':
			resList = 'VarMax';
		break;
		
		case 'statmin':
			resList = 'StatMin';
		break;
		
		case 'statmax':
			resList = 'StatMax';
		break;
		
		case 'custom':
			resList = 'Custom';
		break;
		
		case 'state':
			resList = 'State';
		break;
		
		default:
			resList = null;
		break;
					
	}
	return resList
};
				

//=============================================================================
// DataManager
//=============================================================================
Bobstah.EnhancedRestrictions.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!Bobstah.EnhancedRestrictions.DataManager_isDatabaseLoaded.call(this)) return false;
	DataManager.processBobstahEnhancedRestrictionNotes($dataWeapons);
	DataManager.processBobstahEnhancedRestrictionNotes($dataArmors);
	DataManager.processBobstahEnhancedRestrictionNotes($dataItems);
	DataManager.processBobstahEnhancedRestrictionNotes($dataSkills);
	
	
	return true;
};

Bobstah.EnhancedRestrictions.DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
	Bobstah.EnhancedRestrictions.DataManager_createGameObjects.call(this);
	DataManager.processBobstahEnhancedRestrictionGlobalNotes($dataActors);
};

DataManager.processBobstahEnhancedRestrictionNotes = function(group) {
	var tagregex = /<Restrict>[\s]+([\s\S]*?)[\s]+<\/Restrict>/ig;
	var resregex = /(!)?([A-z]+)\(?([A-z0-9]*)\)?:[\s]*(\S*)/ig;
	var valregex = /^\$\((.+)\)$/i;
	
	for (var n = 1; n < group.length; n++) {
		var obj = group[n];
		obj.Restrictions = obj.Restrictions || [];
		while (notedata = tagregex.exec(obj.note)) {
			obj.Restrictions.push(Bobstah.EnhancedRestrictions.createRestrictionsNode());
			var resStr = notedata[1];
			this.processBobstahEnhancedRestrictions(obj, resStr);
		}
	}
};

DataManager.processBobstahEnhancedRestrictionGlobalNotes = function(group) {
	var tagregex = /<Restrict\s+([A-z]+)\s*:*\s*(\S*)>[\s]+([\s\S]*?)[\s]+<\/Restrict>/i;
	var idregex = /(\d+)/ig;
	$gameSystem.globalRestrictions = $gameSystem.globalRestrictions || {};
	var target = $gameSystem.globalRestrictions;
	for (var n = 1; n < group.length; n++) {
		var obj = group[n];
		
		if (obj.note.match(tagregex)) {
			var resType = RegExp.$1.toLowerCase();
			var resStr = RegExp.$3;
			var tempIds = RegExp.$2 || 0;
			while (tId = idregex.exec(tempIds)) {
				var id = tId[1];
				target[resType] = target[resType] || {};
				target[resType][id] = target[resType][id] || {};
				target[resType][id].Restrictions = target[resType][id].Restrictions || [];
				target[resType][id].Restrictions.push(Bobstah.EnhancedRestrictions.createRestrictionsNode());
				this.processBobstahEnhancedRestrictions(target[resType][id], resStr);
			}
		}
	}
};

DataManager.processBobstahEnhancedRestrictions = function(obj, resStr) {
	var resregex = /(!)?([A-z]+)\(?([A-z0-9]*)\)?:[\s]*(\S*)/ig;
	var valregex = /^\$\((.+)\)$/i;
	
	while (restricts = resregex.exec(resStr)) {
				var i = obj.Restrictions.length-1;
				var resNot = (restricts[1] ? true : false);
				var resType = restricts[2];
				var resParam = restricts[3] || null;
				var resValue = restricts[4];
				if (resValue.indexOf('$(') === -1) {
					var resEvl = false;
				} else {
					var resEvl = true;
					resValue.match(valregex);
					resValue = RegExp.$1;
				}
				var res = Bobstah.EnhancedRestrictions.getRestrictionList(resType.toLowerCase());
				if (res === null) { continue; }
				if (res === 'Switch') { resValue = (resValue.toLowerCase() === 'off' ? false : true); }
				var resList = obj.Restrictions[i][res];
				resList.push(Bobstah.EnhancedRestrictions.createRestrictionNode(resValue, resNot, resEvl, resParam));
			}
};

//=============================================================================
// Game_BattlerBase
//=============================================================================
Game_BattlerBase.prototype.makeRestrictedCopy = function(item, param) {
	
	//Ellye Damaging States compatibility patch
	if (typeof(this._stateCaster) !== "undefined") {
		var stateCaster = this._stateCaster.slice(0);	//Copy _stateCaster
		this._stateCaster = [];	//Remove _stateCaster from this object
	}
	
	var actor = JsonEx.makeDeepCopy(this);
	
	//Ellye Damaging States compatibility patch - Part 2
	if (typeof(this._stateCaster) !== "undefined") {
		this._stateCaster = stateCaster	//Add _stateCaster back into the object.
	}
	return actor;
};

Bobstah.EnhancedRestrictions.GameBattlerBase_meetsItemConditions = Game_BattlerBase.prototype.meetsItemConditions;
Game_BattlerBase.prototype.meetsItemConditions = function(item) {
	var res = Bobstah.EnhancedRestrictions.GameBattlerBase_meetsItemConditions.call(this, item);
	if (res === false) { return res; }
	return this.checkRestrictions(item);
};

Bobstah.EnhancedRestrictions.GameBattlerBase_meetsSkillConditions = Game_BattlerBase.prototype.meetsSkillConditions;
Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
	var res = Bobstah.EnhancedRestrictions.GameBattlerBase_meetsSkillConditions.call(this, skill);
	if (res === false) { return res; }
	return this.checkRestrictions(skill);
};

Bobstah.EnhancedRestrictions.GameBattlerBase_isSkillTypeSealed = Game_BattlerBase.prototype.isSkillTypeSealed;
Game_BattlerBase.prototype.isSkillTypeSealed = function(stypeId) {
	var res = Bobstah.EnhancedRestrictions.GameBattlerBase_isSkillTypeSealed.call(this, stypeId);
	if (res) { return res; }
	if (typeof($gameSystem.globalRestrictions.stype) !== "undefined") {
		if (typeof($gameSystem.globalRestrictions.stype[stypeId]) !== "undefined") {
			return !this.checkRestrictions($gameSystem.globalRestrictions.stype[stypeId]);
		}
	}
	return res;
};

Game_BattlerBase.prototype.canEquipEnhanced = function(item, slotId) {
    if (!item) {
        return false;
    } else if (DataManager.isWeapon(item)) {
        return this.checkRestrictions(item, slotId);
    } else if (DataManager.isArmor(item)) {
        return this.checkRestrictions(item, slotId);
    } else {
        return false;
    }
};

Game_BattlerBase.prototype.canUseItems = function() {
	if (typeof($gameSystem.globalRestrictions.items) !== "undefined") {
		return this.checkRestrictions($gameSystem.globalRestrictions.items[0]);
	}
	return true;
};

Game_BattlerBase.prototype.checkRestrictions = function(item, param) {
	for (i = 0; i < item.Restrictions.length; i++) {
		var failed = null;
		var resObj = item.Restrictions[i];
		for (var category in resObj) {
			var catArr = resObj[category];
			if (catArr.length === 0) { continue; }
			var res = this.validateRestriction(category, catArr, item, param);
			if (res === false) { 
				failed = true; 
				break;
			}
		}
		if (failed === true) { continue; } else { break; }
	}
	if (failed === true) { return false; }
	return true;
	
};

Game_BattlerBase.prototype.validateRestriction = function(cat, catArr, item, param) {
	
	var actor = this.makeRestrictedCopy(item, param);
	switch (cat) {
		case "Class":
			if (!this.isActor()) { return true; }
			return this.validateClassRestriction(catArr);
		break;
		
		case "Actor":
			if (!this.isActor()) { return true; }
			return this.validateActorRestriction(catArr);
		break;
		
		case "Weapon":
			if (!this.isActor()) { return true; }
			return actor.validateWeaponRestriction(catArr);
		break;
		
		case "Armor":
			if (!this.isActor()) { return true; }
			return actor.validateArmorRestriction(catArr);
		break;
		
		case "StatMin":
			if (!this.isActor()) { return true; }
			return actor.validateStatMinRestriction(catArr);
		break;
		
		case "StatMax":
			if (!this.isActor()) { return true; }
			return actor.validateStatMaxRestriction(catArr);
		break;
		
		case "LevelMin":
			if (!this.isActor()) { return true; }
			return actor.validateLevelMinRestriction(catArr);
		break;
		
		case "LevelMax":
			if (!this.isActor()) { return true; }
			return actor.validateLevelMaxRestriction(catArr);
		break;
		
		case "VarMin":
			return actor.validateVarMinRestriction(catArr);
		break;
		
		case "VarMax":
			return actor.validateVarMaxRestriction(catArr);
		break;
		
		case "Switch":
			return actor.validateSwitchRestriction(catArr);
		break;
		
		case "State":
			return actor.validateStateRestriction(catArr);
		break;
		
		case "Custom":
			return actor.validateCustomRestriction(catArr);
		break;
		
		default:
			return true;
		break;
	}
};

Game_BattlerBase.prototype.validateStateRestriction = function(catArr) {
	for (var i = 0; i < catArr.length; i++) {
		var obj = catArr[i];
		var value = Bobstah.EnhancedRestrictions.getValue(this, obj);
		if (typeof($dataStates[value]) === "undefined") { return false; }
		if (obj.Not) {
			if (this.isStateAffected(value)) {
				return false;
			}
		} else {
			if (!this.isStateAffected(value)) {
				return false;
			}
		}
	}
	return true;
};

Game_BattlerBase.prototype.validateVarMinRestriction = function(catArr) {
	for (var i = 0; i < catArr.length; i++) {
		var obj = catArr[i];
		var value = Bobstah.EnhancedRestrictions.getValue(this, obj);
		if (typeof($gameVariables[obj.Param]) === "undefined") { return false; }
		if (obj.Not) {
			if ($gameVariables[obj.Param] > value) {
				return false;
			}
		} else {
			if ($gameVariables[obj.Param] < value) {
				return false;
			}
		}
	}
	return true;
};

Game_BattlerBase.prototype.validateVarMaxRestriction = function(catArr) {
	for (var i = 0; i < catArr.length; i++) {
		var obj = catArr[i];
		var value = Bobstah.EnhancedRestrictions.getValue(this, obj);
		if (typeof($gameVariables[obj.Param]) === "undefined") { return false; }
		if (obj.Not) {
			if ($gameVariables[obj.Param] >= value) {
				return false;
			}
		} else {
			if ($gameVariables[obj.Param] >= value) {
				return false;
			}
		}
	}
	return true;
};

Game_BattlerBase.prototype.validateSwitchRestriction = function(catArr) {
	for (var i = 0; i < catArr.length; i++) {
		var obj = catArr[i];
		var value = Bobstah.EnhancedRestrictions.getValue(this, obj);
		var param = obj.Param;
		if (typeof($gameSwitches.value(param)) === "undefined") { return false; }
		value = (obj.Not ? !value : value);
		if ($gameSwitches.value(param) != value) {
			return false;
		}
	}
	return true;
};

Game_BattlerBase.prototype.validateCustomRestriction = function(catArr) {
	for (var i = 0; i < catArr.length; i++) {
		var obj = catArr[i];
		var value = Bobstah.EnhancedRestrictions.getValue(this, obj);
		value = (obj.Not ? !value : value);
		if (!value) { return false; }
	}
	return true;
};

//=============================================================================
// Game_Actor
//=============================================================================
Bobstah.EnhancedRestrictions.GameActor_makeRestrictedCopy = Game_Actor.prototype.makeRestrictedCopy;
Game_Actor.prototype.makeRestrictedCopy = function(item, param) {
	var actor = Bobstah.EnhancedRestrictions.GameActor_makeRestrictedCopy.call(this, item, param);
	
	// Unequip for comparison if item is equip
	if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
		if (param !== null) { actor.forceChangeEquip(param, null) };
	}
	
	return actor;
};

Game_Actor.prototype.validateClassRestriction = function(catArr) {
	for (var i = 0; i < catArr.length; i++) {
		var obj = catArr[i];
		var value = Bobstah.EnhancedRestrictions.getValue(this, obj);
		if (obj.Not) {
			if (this._classId === value) {
				return false;
			}
		} else {
			if (this._classId !== value) {
				return false;
			}
		}
	}
	return true;
};

Game_Actor.prototype.validateActorRestriction = function(catArr) {
	for (var i = 0; i < catArr.length; i++) {
		var obj = catArr[i];
		var value = Bobstah.EnhancedRestrictions.getValue(this, obj);
		if (obj.Not) {
			if (this._actorId === value) {
				return false;
			}
		} else {
			if (this._actorId !== value) {
				return false;
			}
		}
	}
	return true;
};

Game_Actor.prototype.validateWeaponRestriction = function(catArr) {
	for (var i = 0; i < catArr.length; i++) {
		var obj = catArr[i];
		var value = Bobstah.EnhancedRestrictions.getValue(this, obj);
		if (obj.Not) {
			if (this.hasWeapon($dataWeapons[value])) {
				return false;
			}
		} else {
			if (!this.hasWeapon($dataWeapons[value])) {
				return false;
			}
		}
	}
	return true;
};

Game_Actor.prototype.validateArmorRestriction = function(catArr) {
	for (var i = 0; i < catArr.length; i++) {
		var obj = catArr[i];
		var value = Bobstah.EnhancedRestrictions.getValue(this, obj);
		if (obj.Not) {
			if (this.hasArmor($dataArmors[value])) {
				return false;
			}
		} else {
			if (!this.hasArmor($dataArmors[value])) {
				return false;
			}
		}
	}
	return true;
};

Game_Actor.prototype.validateStatMinRestriction = function(catArr) {
	for (var i = 0; i < catArr.length; i++) {
		var obj = catArr[i];
		var value = Bobstah.EnhancedRestrictions.getValue(this, obj);
		if (typeof(this[obj.Param]) === "undefined") { return false; }
		if (obj.Not) {
			if (this[obj.Param] >= value) {
				return false;
			}
		} else {
			if (this[obj.Param] <= value) {
				return false;
			}
		}
	}
	return true;
};

Game_Actor.prototype.validateStatMaxRestriction = function(catArr) {
	for (var i = 0; i < catArr.length; i++) {
		var obj = catArr[i];
		var value = Bobstah.EnhancedRestrictions.getValue(this, obj);
		if (typeof(this[obj.Param]) === "undefined") { return false; }
		if (obj.Not) {
			if (this[obj.Param] <= value) {
				return false;
			}
		} else {
			if (this[obj.Param] >= value) {
				return false;
			}
		}
	}
	return true;
};

Game_Actor.prototype.validateLevelMinRestriction = function(catArr) {
	for (var i = 0; i < catArr.length; i++) {
		var obj = catArr[i];
		var value = Bobstah.EnhancedRestrictions.getValue(this, obj);
		if (obj.Not) {
			if (this.level > value) {
				return false;
			}
		} else {
			if (this.level < value) {
				return false;
			}
		}
	}
	return true;
};

Game_Actor.prototype.validateLevelMaxRestriction = function(catArr) {
	for (var i = 0; i < catArr.length; i++) {
		var obj = catArr[i];
		var value = Bobstah.EnhancedRestrictions.getValue(this, obj);
		if (obj.Not) {
			if (this.level <= value) {
				return false;
			}
		} else {
			if (this.level >= value) {
				return false;
			}
		}
	}
	return true;
};

//=============================================================================
// Window_EquipItem
// This adds Enhanced Restrictions to the equipment window.
//=============================================================================
Bobstah.EnhancedRestrictions.WindowEquipItem_includes = Window_EquipItem.prototype.includes;
Window_EquipItem.prototype.includes = function(item) {
    var res = Bobstah.EnhancedRestrictions.WindowEquipItem_includes.call(this, item);
	if (res === false) { return res; }
	if (this._actor !== null) {
		return this._actor.canEquipEnhanced(item, this._slotId);
	} else {
		return res;
	}
};

//=============================================================================
// Window_ActorCommand
// This adds Enhanced Restrictions to various actor commands.
//=============================================================================
Bobstah.EnhancedRestrictions.WindowActorCommand_addItemCommand = Window_ActorCommand.prototype.addItemCommand;
Window_ActorCommand.prototype.addItemCommand = function() {
	if (this._actor.canUseItems()) { return Bobstah.EnhancedRestrictions.WindowActorCommand_addItemCommand.call(this); }
	return false;
};

//=============================================================================
// Window_BattleItem
// This adds Enhanced Restrictions to item usage on a per-actor basis.
//=============================================================================
Bobstah.EnhancedRestrictions.WindowBattleItem_includes = Window_BattleItem.prototype.includes
Window_BattleItem.prototype.includes = function(item) {
    var res = Bobstah.EnhancedRestrictions.WindowBattleItem_includes.call(this, item);
	if (!res) { return res; }
	return BattleManager.actor().meetsItemConditions(item);
};

//=============================================================================
// Yanfly Equip Core Support
// This will maintain the Remove option in the equipment window.
//=============================================================================
if (Imported.YEP_EquipCore) {
	Game_BattlerBase.prototype.canEquipEnhanced = function(item, slotId) {
		if (item === null) {
			return true;
		} else if (DataManager.isWeapon(item)) {
			return this.checkRestrictions(item, slotId);
		} else if (DataManager.isArmor(item)) {
			return this.checkRestrictions(item, slotId);
		} else {
			return false;
		}
	};
}