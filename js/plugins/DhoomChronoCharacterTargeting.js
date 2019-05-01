//=============================================================================
// DhoomChronoCharacterTargeting.js
//=============================================================================
var Imported = Imported || {};
Imported.Dhoom_ChronoCTarget = true;

var Dhoom = Dhoom || {};
Dhoom.ChronoCTarget = Dhoom.ChronoCTarget || {};
/*:
 * @plugindesc Dhoom ChronoCTarget v1.0 - 07/12/2018
 * @author DrDhoom - drd-workshop.blogspot.com
 *
 * @help Event Notetag:
 * <chronoTarget: CONDITION, INDEX>
 * CONDITION: Script condition for selecting battler.
 * - a = this battler
 * - b = target battler
 * - c = this user character (refer to the caster)
 * - d = target character
 * - e = this character (refer to Tool Event)
 * - isInRange(CHARACTER, HORIZONTAL, VERTICAL)
 * - - CHARACTER = Character that will be checked.
 * - - HORIZONTAL = Horizontal range value from this character (x amount to the left and x amount to the right).
 * - - VERTICAL = Vertical range value from this character (x amount to the top and x amount to the bottom).
 * INDEX: Result index. 0 = The first character. -1 = The last character. random = Random character.
 * 
 * Event Comment:
 * chrono_target_fallback_page
 * - If the chronoTarget condition doesn't result any character, the page that has this comment will be activated.
 * 
 * this.moveTowardCharacter(this._chronoCharTargeting) = move toward target
 *
 * If the chronoTarget condition success, all player command in the event move route will be replaced with the chronoTarget.
 */

Dhoom.Parameters = PluginManager.parameters('DhoomChronoCharacterTargeting');
if (!Dhoom.jsonParse) {
    Dhoom.jsonParse = function (string) {
        try {
            return JSON.parse(string, function (key, value) {
                try {
                    return this.jsonParse(value);
                } catch (e) {
                    return value;
                }
            }.bind(this))
        } catch (e) {
            return string;
        }
    };
}
if (!Dhoom.loadParam) {
    Dhoom.loadParam = function (sym) {
        return Dhoom.jsonParse(Dhoom.Parameters[sym]);
    };
}

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Character
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Game_Character.prototype.chronoFindCharacter = function (condition, index) {
    var characters = $gameMap.events().concat($gamePlayer).filter(function (char) {
        return char !== this && !!char.battler() && !(char instanceof ToolEvent);
    }, this);
    var result = [];
    var a = this instanceof ToolEvent ? this.user().battler() : this.battler();
    var c = this;
    var e = this instanceof ToolEvent ? this.user() : this;
    var isInRange = this.chronoCharacterIsInRange.bind(this);
    for (var i = 0; i < characters.length; i++) {
        var b = characters[i].battler();
        var d = characters[i];
        try {
            if (eval(condition)) result.push(characters[i]);
        } catch (e) {
            console.warn('Move Route Find Character script error.');
            console.warn(e);
        }
    }
    var j = 0;
    if (index === 'random') j = Math.randomInt(result.length);
    if (index === '-1') j = result.length - 1;
    return result[j];
};

Game_Character.prototype.chronoCharacterIsInRange = function (character, horz, vert) {
    return character && character.x >= this.x - horz && character.x <= this.x + horz && character.y >= this.y - vert && character.y <= this.y + vert;
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Event
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoCTarget.Game_Event_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function (mapId, eventId) {
    Dhoom.ChronoCTarget.Game_Event_initialize.call(this, mapId, eventId);
    this.initChronoCharacterTargeting();
};

Game_Event.prototype.initChronoCharacterTargeting = function () {
    this._chronoCharTargeting = false;
    this._chronoTargetingPage = false;
    var notedata = this.event().note.split(/[\r\n]+/);
    for (var n = 0; n < notedata.length; n++) {
        if (notedata[n].match(/<chronotarget:\s*(.+),\s*(random|0|-1)>/i)) {
            this._chronoCharTargeting = { condition: RegExp.$1, index: RegExp.$2.toLowerCase() };
        }
    }
};

Dhoom.ChronoCTarget.Game_Event_update = Game_Event.prototype.update;
Game_Event.prototype.update = function () {
    Dhoom.ChronoCTarget.Game_Event_update.call(this);
    this.updateChronoCharacterTargeting();
};

Game_Event.prototype.updateChronoCharacterTargeting = function () {
    if (this._chronoCharTargeting) {
        this._chronoCharTarget = this.chronoFindCharacter(this._chronoCharTargeting.condition, this._chronoCharTargeting.index);
        if (this._chronoCharTarget) {
            if (!this._chronoTargetingPage) {
                this._chronoTargetingPage = true;
                this.refresh();
            }
        } else {
            if (this._chronoTargetingPage) {
                this._chronoTargetingPage = false;
                this.refresh();
            }
        }
    }
};

Dhoom.ChronoCTarget.Game_Event_turnTowardPlayer = Game_Event.prototype.turnTowardPlayer;
Game_Event.prototype.turnTowardPlayer = function () {
    if (this._chronoCharTarget) {
        this.turnTowardCharacter(this._chronoCharTarget);
    } else {
        Dhoom.ChronoCTarget.Game_Event_turnTowardPlayer.call(this);
    }
};

Dhoom.ChronoCTarget.Game_Event_turnAwayFromPlayer = Game_Event.prototype.turnAwayFromPlayer;
Game_Event.prototype.turnAwayFromPlayer = function () {
    if (this._chronoCharTarget) {
        this.turnAwayFromCharacter(this._chronoCharTarget);
    } else {
        Dhoom.ChronoCTarget.Game_Event_turnAwayFromPlayer.call(this);
    }
};

Dhoom.ChronoCTarget.Game_Event_moveTowardPlayer = Game_Event.prototype.moveTowardPlayer;
Game_Event.prototype.moveTowardPlayer = function () {
    if (this._chronoCharTarget) {
        this.moveTowardCharacter(this._chronoCharTarget);
    } else {
        Dhoom.ChronoCTarget.Game_Event_moveTowardPlayer.call(this);
    }
};

Dhoom.ChronoCTarget.Game_Event_moveAwayFromPlayer = Game_Event.prototype.moveAwayFromPlayer;
Game_Event.prototype.moveAwayFromPlayer = function () {
    if (this._chronoCharTarget) {
        this.moveAwayFromCharacter(this._chronoCharTarget);
    } else {
        Dhoom.ChronoCTarget.Game_Event_moveAwayFromPlayer.call(this);
    }
};

Dhoom.ChronoCTarget.Game_Event_meetsConditions = Game_Event.prototype.meetsConditions;
Game_Event.prototype.meetsConditions = function(page) {
    var result = Dhoom.ChronoCTarget.Game_Event_meetsConditions.call(this, page);
    if (result) {
        for (var i = 0; i < page.list.length; i++) {
            if (page.list[i].code === 108 && page.list[i].parameters[0].toLowerCase() === 'chrono_target_fallback_page') {
                return !this._chronoTargetingPage;
            }
        }
    }
    return result;
};