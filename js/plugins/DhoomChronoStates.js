//=============================================================================
// DhoomChronoStates.js
//=============================================================================
var Imported = Imported || {};
Imported.Dhoom_ChronoStates = true;

var Dhoom = Dhoom || {};
Dhoom.ChronoStates = Dhoom.ChronoStates || {};
/*:
 * @plugindesc Dhoom ChronoStates v1.1e - 09/05/2019
 * @author DrDhoom - drd-workshop.blogspot.com
 * 
 * @param Minimum Character Move Speed
 * @desc Minimum character move speed allowed.
 * @type number
 * @min 0
 * @default 0
 * 
 * @param Maximum Character Move Speed
 * @desc Maximum character move speed allowed.
 * @type number
 * @min 1
 * @max 20
 * @default 20
 *
 * @help Changelog:
 * • v1.1e 09/05/2019:
 * - Fix state effects not restored when all states has been cleared.
 * 
 * • v1.1b 29/12/2018:
 * - Compatibility with YEP Buffs and States Core.
 * 
 * • v1.1a 17/12/2018:
 * - Fixed a state can't be applied when that state just run out of duration.
 * 
 * • v1.1 07/12/2018:
 * - Added moveroute state effect.
 * 
 * • v1.0 03/12/2018:
 * - Initial release.
 * 
 * State notetags:
 * <duration: INTEGER>
 * - Set state duration in frame.
 * 
 * <effects: TYPE, FORMULA, INTERVAL>
 * - Add state effect. A state can have more than one effect.
 * - TYPE: hp, mp, tp, movespeed or moveroute.
 * - FORMULA: Value formula. a = battler, b = state. For moveroute type, this will be the Event ID of the copied event move route.
 * - INTERVAL: Effect interval in frame. Set to 0 for one time effect. Always set to 0 for moveroute type.
 */

Dhoom.Parameters = PluginManager.parameters('DhoomChronoStates');
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

Dhoom.ChronoStates.minMoveSpeed = Dhoom.loadParam('Minimum Character Move Speed');
Dhoom.ChronoStates.maxMoveSpeed = Dhoom.loadParam('Maximum Character Move Speed');

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// DataManager
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoStates.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    if (!Dhoom.ChronoStates.DataManager_isDatabaseLoaded.call(this)) return false;
    if (!Dhoom.ChronoStates.isChronoStatesInitialized) {
        this.DhoomInitChronoStates();
        Dhoom.ChronoStates.isChronoStatesInitialized = true;
    }
    return true;
};

DataManager.DhoomInitChronoStates = function () {
    var group = $dataStates;
    for (var i = 1; i < group.length; i++) {
        var object = group[i];
        if (object) {
            var notedata = object.note.split(/[\r\n]+/);
            for (var n = 0; n < notedata.length; n++) {
                if (notedata[n].match(/<duration:\s*(.+)>/i)) {
                    object.duration = Number(RegExp.$1);
                }
                if (notedata[n].match(/<effects:\s*(.+),\s*(.+),\s*(\d+)>/i)) {
                    object.effects = object.effects || [];
                    object.effects.push({ type: RegExp.$1.toLowerCase(), value: RegExp.$2, interval: Number(RegExp.$3) });
                }
            }
        }
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_CharacterBase
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Object.defineProperties(Game_CharacterBase.prototype, {
    _moveSpeed: {
        get: function () {
            var result = this.__moveSpeed;
            this._speedBuff = this._speedBuff || {};
            var keys = Object.keys(this._speedBuff);
            keys.forEach(function (key) {
                this._speedBuff[key].forEach(function (value) {
                    if (!isNaN(value)) result += value;
                }, this);
            }, this);
            result = Math.max(Dhoom.ChronoStates.minMoveSpeed, Math.min(Dhoom.ChronoStates.maxMoveSpeed, result));
            return result;
        },
        set: function (value) {
            this.__moveSpeed = value;
        },
        configurable: true
    }
});

Dhoom.ChronoStates.Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function () {
    Dhoom.ChronoStates.Game_CharacterBase_initMembers.call(this);
    this._speedBuff = {};
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Player
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoStates.Game_Player_canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function () {
    var result = Game_Character.prototype.canMove.call(this);
    return result && Dhoom.ChronoStates.Game_Player_canMove.call(this);
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_BattlerBase
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoStates.Game_BattlerBase_clearStates = Game_BattlerBase.prototype.clearStates;
Game_BattlerBase.prototype.clearStates = function () {
    if (this._states) {
        var states = this.states();
        for (var i = 0; i < states.length; i++) {
            this.eraseState(states[i].id);
        }
    }
    Dhoom.ChronoStates.Game_BattlerBase_clearStates.call(this);
    this._stateDurations = {};
    this._stateEffectIntervals = {};
    this._stateMoveRouteData = null;
    this._stateMoveRouteEventId = null;
    this._stateMoveRouteStateId = null;
};

Dhoom.ChronoStates.Game_BattlerBase_eraseState = Game_BattlerBase.prototype.eraseState;
Game_BattlerBase.prototype.eraseState = function (stateId) {
    Dhoom.ChronoStates.Game_BattlerBase_eraseState.call(this, stateId);
    var state = $dataStates[stateId];
    var sprite = this.getSpriteCharacter();
    if (state.effects && sprite) {
        delete sprite._character._speedBuff[stateId];
    }
    delete this._stateDurations[stateId];
    delete this._stateEffectIntervals[stateId];
    if (stateId === this._stateMoveRouteStateId) {
        this._stateMoveRouteData = null;
        this._stateMoveRouteEventId = null;
        this._stateMoveRouteStateId = null;
        sprite._character._moveRouteForcing = false;
        sprite._character.restoreMoveRoute();
    }
};

Game_BattlerBase.prototype.resetStateDurations = function (stateId) {
    delete this._stateEffectIntervals[stateId];
    var state = $dataStates[stateId];
    if (!isNaN(state.duration)) this.setStateDuration(stateId, state.duration);
};

Game_BattlerBase.prototype.applyStateEffect = function (stateId, effect, index, sprite) {
    var state = $dataStates[stateId];
    if (sprite) {
        var oldHp = this.hp;
        var oldMp = this.mp;
        var oldTp = this.tp;
    }
    switch (effect.type) {
        case 'hp':
            this.applyStateHPRegeneration(effect.value, state);
            break;
        case 'mp':
            this.applyStateMPRegeneration(effect.value, state);
            break;
        case 'tp':
            this.applyStateTPRegeneration(effect.value, state);
            break;
        case 'movespeed':
            this.applyStateMoveSpeed(effect.value, state, index, sprite);
            break;
        case 'moveroute':
            this.applyStateMoveRoute(Number(effect.value), stateId, sprite);
    }
    if (sprite && (this.hp !== oldHp || this.mp !== oldMp || this.tp !== oldTp)) {
        this.startDamagePopup();
        sprite.setupDamagePopup();
    }
};

Game_BattlerBase.prototype.applyStateHPRegeneration = function (formula, source) { };

Game_BattlerBase.prototype.applyStateMPRegeneration = function (formula, source) { };

Game_BattlerBase.prototype.applyStateTPRegeneration = function (formula, source) { };

Game_BattlerBase.prototype.applyStateMoveRoute = function (eventId, stateId) { };

Game_BattlerBase.prototype.applyStateMoveSpeed = function (formula, source, index, sprite) {
    if (sprite && sprite._character) {
        var a = this;
        var b = source;
        try {
            sprite._character._speedBuff[b.id] = sprite._character._speedBuff[b.id] || [];
            sprite._character._speedBuff[b.id][index] = Number(eval(formula));
        } catch (e) {
            console.log('State move speed formula error.');
            console.log(e);
        }
    }
};

Game_BattlerBase.prototype.updateChronoStates = function () {
    this.updateChronoStatesEffect();
    this.updateChronoStatesAutoRemoval();
};

Game_BattlerBase.prototype.updateChronoStatesEffect = function () {
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
        var state = states[i];
        if (state.effects) {
            this._stateEffectIntervals[state.id] = this._stateEffectIntervals[state.id] || [];
            state.effects.forEach(function (effect, i) {
                if (isNaN(this._stateEffectIntervals[state.id][i])) this._stateEffectIntervals[state.id][i] = 0;
                if (this._stateEffectIntervals[state.id][i] > 0) {
                    this._stateEffectIntervals[state.id][i]--;
                } else if (this._stateEffectIntervals[state.id][i] === 0) {
                    this.applyStateEffect(state.id, effect, i, this.getSpriteCharacter());
                    this._stateEffectIntervals[state.id][i] = effect.interval > 0 ? effect.interval : -1;
                }
            }, this);
        }
    }
};

Game_BattlerBase.prototype.updateChronoStatesAutoRemoval = function () {
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
        var state = states[i];
        if (!isNaN(state.duration)) {
            this._stateDurations[state.id]--;
            if (!this._stateDurations[state.id]) this.removeState(state.id);
        }
    }
};

Game_BattlerBase.prototype.stateDuration = function (stateId) {
    return this._stateDurations[stateId] || 0;
};

Game_BattlerBase.prototype.setStateDuration = function (stateId, value) {
    this._stateDurations[stateId] = value;
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Battler
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoStates.Game_Battler_addState = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function (stateId) {
    if (this.isStateAddable(stateId)) {
        this.resetStateDurations(stateId);
    }
    Dhoom.ChronoStates.Game_Battler_addState.call(this, stateId);
};

Dhoom.ChronoStates.Game_Battler_removeState = Game_Battler.prototype.removeState;
Game_Battler.prototype.removeState = function (stateId) {
    Dhoom.ChronoStates.Game_Battler_removeState.call(this, stateId);
    this._result.removedStates.splice(this._result.removedStates.indexOf(stateId), 1);
};

Game_Battler.prototype.applyStateHPRegeneration = function (formula, source) {
    var a = this;
    var b = source;
    try {
        var value = Number(eval(formula));
        value = Math.max(value, -this.maxSlipDamage());
        this.gainHp(value);
    } catch (e) {
        console.log('State HP Regeneration formula error.');
        console.log(e);
    }
};

Game_Battler.prototype.applyStateMPRegeneration = function (formula, source) {
    var a = this;
    var b = source;
    try {
        this.gainMp(Number(eval(formula)));
    } catch (e) {
        console.log('State MP Regeneration formula error.');
        console.log(e);
    }
};

Game_Battler.prototype.applyStateTPRegeneration = function (formula, source) {
    var a = this;
    var b = source;
    try {
        this.gainTp(Number(eval(formula)));
    } catch (e) {
        console.log('State TP Regeneration formula error.');
        console.log(e);
    }
};

Game_Battler.prototype.applyStateMoveRoute = function (eventId, stateId, sprite) {
    if (this._stateMoveRouteEventId !== eventId) {
        this._stateMoveRouteEventId = eventId;
        this._stateMoveRouteData = $dataMapTool.events[eventId].pages[0].moveRoute;
        this._stateMoveRouteStateId = stateId;
        sprite._character.forceMoveRoute(this._stateMoveRouteData);
    }
};

Game_Battler.prototype.getSpriteCharacter = function () {
    if (SceneManager._scene instanceof Scene_Map && SceneManager._scene._spriteset && SceneManager._scene._spriteset._characterSprites) {
        var sprites = SceneManager._scene._spriteset._characterSprites;
        for (var i = 0; i < sprites.length; i++) {
            if (sprites[i]._character && !(sprites[i]._character instanceof ToolEvent) && sprites[i]._character.battler() === this) return sprites[i];
        }
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Sprite_Character
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoStates.Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function () {
    Dhoom.ChronoStates.Sprite_Character_update.call(this);
    this.updateBattlerChronoStates();
};

Sprite_Character.prototype.updateBattlerChronoStates = function () {
    if (this._character && this._character.battler() && !$gameMap.isEventRunning() && !$gameMessage.isBusy()) {
        this._character.battler().updateChronoStates();
    }
};