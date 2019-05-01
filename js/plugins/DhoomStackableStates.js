//=============================================================================
// DhoomStackableStates.js
//=============================================================================
var Imported = Imported || {};
Imported.Dhoom_StackableStates = true;

var Dhoom = Dhoom || {};
Dhoom.StackableStates = Dhoom.StackableStates || {};
/*:
 * @plugindesc Dhoom StackableStates v1.0c - 20/04/2019
 * @author DrDhoom - drd-workshop.blogspot.com
 *
 * @help State Notetags:
 * <stackable>
 * - Set this state as stackable with no max limit.
 * 
 * <stackable: MAX>
 * - Set this state as stackable with MAX stack limit.
 * 
 * <stackFormula: FORMULA>
 * - Modify all traits and state effect value with this FORMULA. 
 *   Only applied to traits and effects that doesn't have its specific formula.
 * - FORMULA
 *   stack = this state stack.
 *   state = this state.
 *   value = original value.
 *   this = battler.
 * 
 * <stackFormula TYPE: FORMULA>
 * - Only modify trait and effect TYPE value with this FORMULA.
 * - TYPE
 *   elementRate
 *   debuffRate
 *   stateRate
 *   parameter
 *   exParameter
 *   spParameter
 *   attackState
 *   attackSpeed
 *   attackTimes
 *   actionTimes
 *   hp (ChronoStates)
 *   mp (ChronoStates)
 *   tp (ChronoStates)
 *   moveSpeed (ChronoStates)
 * - FORMULA
 *   stack = this state stack.
 *   state = this state.
 *   value = original value.
 *   this = battler.
 * 
 * <stackSpawn: STACK, TARGET, TOOLID>
 * - Spawn a tool event when this state stack has reached STACK value.
 * - TARGET = target or user.
 * - Event tool must have "tool_position: target" comment.
 */

Dhoom.Parameters = PluginManager.parameters('DhoomStackableStates');
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

Dhoom.StackableStates.traitCodes = [11, 12, 13, 21, 22, 23, 32, 33, 34, 61];

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// DataManager
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.StackableStates.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    if (!Dhoom.StackableStates.DataManager_isDatabaseLoaded.call(this)) return false;
    if (!Dhoom.StackableStates.isStackableStatesInitialized) {
        this.DhoomInitStackableStates();
        Dhoom.StackableStates.isStackableStatesInitialized = true;
    }
    return true;
};

DataManager.DhoomInitStackableStates = function () {
    var group = $dataStates;
    for (var i = 1; i < group.length; i++) {
        var object = group[i];
        if (object) {
            object.stackFormulaCode = {};
            object.stackSpawn = {};
            var notedata = object.note.split(/[\r\n]+/);
            for (var n = 0; n < notedata.length; n++) {
                if (notedata[n].match(/<stackable>/i)) {
                    object.stackable = 0;
                }
                if (notedata[n].match(/<stackable:\s*(\d+)>/i)) {
                    object.stackable = Number(RegExp.$1);
                }
                if (notedata[n].match(/<stackformula:\s*(.+)>/i)) {
                    object.stackFormula = RegExp.$1;
                }
                if (notedata[n].match(/<stackformula (.+):\s*(.+)>/i)) {
                    var code = 0;
                    switch (RegExp.$1.trim().toLowerCase()) {
                        case 'elementrate':
                            code = 11;
                            break;
                        case 'debuffrate':
                            code = 12;
                            break;
                        case 'staterate':
                            code = 13;
                            break;
                        case 'parameter':
                            code = 21;
                            break;
                        case 'exparameter':
                            code = 22;
                            break;
                        case 'spparameter':
                            code = 23;
                            break;
                        case 'attackstate':
                            code = 32;
                            break;
                        case 'attackspeed':
                            code = 33;
                            break;
                        case 'attacktimes':
                            code = 34;
                            break;
                        case 'actiontimes':
                            code = 61;
                            break;
                        case 'hp':
                            code = 91;
                            break;
                        case 'mp':
                            code = 92;
                            break;
                        case 'tp':
                            code = 93;
                            break;
                        case 'movespeed':
                            code = 94;
                            break;
                    }
                    if (code) object.stackFormulaCode[code] = RegExp.$2;
                }
                if (notedata[n].match(/<stackspawn:\s*(\d+),\s*(.+),\s*(\d+)>/i)) {
                    object.stackSpawn[Number(RegExp.$1)] = object.stackSpawn[Number(RegExp.$1)] || [];
                    object.stackSpawn[Number(RegExp.$1)].push([RegExp.$2.trim().toLowerCase(), Number(RegExp.$3)]);
                }
            }
        }
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_BattlerBase
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.StackableStates.Game_BattlerBase_clearStates = Game_BattlerBase.prototype.clearStates;
Game_BattlerBase.prototype.clearStates = function () {
    Dhoom.StackableStates.Game_BattlerBase_clearStates.call(this);
    this._stateStacks = {};
};

Game_BattlerBase.prototype.stateStack = function (stateId) {
    return this._stateStacks[stateId] || 0;
};

Game_BattlerBase.prototype.maxStateStack = function (stateId) {
    var state = $dataStates[stateId];
    return this.isStateStackable(stateId) ? (state.stackable > 0 ? state.stackable : 999999999) : 0;
};

Game_BattlerBase.prototype.isStateStackable = function (stateId) {
    return !isNaN($dataStates[stateId].stackable);
};

Game_BattlerBase.prototype.addStateStack = function (stateId, value) {
    this._stateStacks[stateId] = this._stateStacks[stateId] || 0;
    this._stateStacks[stateId] = Math.min(this._stateStacks[stateId] + value, this.maxStateStack(stateId));
    if (this._stateStacks[stateId] <= 0) delete this._stateStacks[stateId];
};

Game_BattlerBase.prototype.removeStateStack = function (stateId, value) {
    this.addStateStack(stateId, -value);
};

Dhoom.StackableStates.Game_BattlerBase_eraseState = Game_BattlerBase.prototype.eraseState;
Game_BattlerBase.prototype.eraseState = function (stateId) {
    Dhoom.StackableStates.Game_BattlerBase_eraseState.call(this, stateId);
    delete this._stateStacks[stateId];
};

Dhoom.StackableStates.Game_BattlerBase_stateIcons = Game_BattlerBase.prototype.stateIcons;
Game_BattlerBase.prototype.stateIcons = function () {
    this._lastStateIconsCall = [];
    this.states().map(function (state, i) {
        this._lastStateIconsCall[i] = this.stateStack(state.id);
        return state.iconIndex;
    }, this).filter(function (iconIndex, i) {
        if (iconIndex <= 0) this._lastStateIconsCall.splice(i, 1);
        return iconIndex > 0;
    }, this);
    return Dhoom.StackableStates.Game_BattlerBase_stateIcons.call(this);
};

Game_BattlerBase.prototype.applyStateStackTraits = function (stateId) {
    var state = $dataStates[stateId];
    var stackFormula = state.stackFormula;
    var stack = this.stateStack(stateId);
    return JsonEx.makeDeepCopy(state.traits).map(function (trait) {
        if (Dhoom.StackableStates.traitCodes.contains(trait.code)) {
            var value = trait.value;
            var formula = state.stackFormulaCode[trait.code] || stackFormula;
            if (formula) {
                try {
                    trait.value = Number(eval(formula).toFixed(3));
                } catch (e) {
                    console.log('State Stack Formula Error: ' + formula);
                    console.log(e);
                }
            }
        }
        return trait;
    }, this);
};

Dhoom.StackableStates.Game_BattlerBase_allTraits = Game_BattlerBase.prototype.allTraits;
Game_BattlerBase.prototype.allTraits = function () {
    var thisRef = this;
    return this.traitObjects().reduce(function (r, obj) {
        return r.concat($dataStates.contains(obj) && thisRef.isStateStackable(obj.id) ? thisRef.applyStateStackTraits(obj.id) : obj.traits);
    }, []);
};

if (Imported.Dhoom_ChronoStates) {
    Dhoom.StackableStates.Game_BattlerBase_applyStateEffect = Game_BattlerBase.prototype.applyStateEffect;
    Game_BattlerBase.prototype.applyStateEffect = function (stateId, effect, index, sprite) {
        var state = $dataStates[stateId];
        if (['hp', 'mp', 'tp', 'movespeed'].contains(effect.type) && this.isStateStackable(stateId)) {
            effect = JsonEx.makeDeepCopy(effect);
            var code = 91 + ['hp', 'mp', 'tp', 'movespeed'].indexOf(effect.type);
            var formula = state.stackFormulaCode[code] || state.stackFormula;
            var stack = this.stateStack(stateId);
            var regValue = /(^| |"|'|\(|-|\+|\/|\*)(value)/g;
            var regStack = /(^| |"|'|\(|-|\+|\/|\*)(stack)/g;
            var regState = /(^| |"|'|\(|-|\+|\/|\*)(state)/g;
            if (code && formula) {
                effect.value = formula.replace(regValue, '$1(' + effect.value + ')').replace(regStack, '$1' + stack).replace(regState, '$1$dataStates[' + stateId + ']');
            }
        }
        Dhoom.StackableStates.Game_BattlerBase_applyStateEffect.call(this, stateId, effect, index, sprite);
    };
}

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Battler
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.StackableStates.Game_Battler_addState = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function (stateId) {
    Dhoom.StackableStates.Game_Battler_addState.call(this, stateId);
    if (this.isStateAddable(stateId) && this.isStateStackable(stateId)) {
        this.addStateStack(stateId, 1);
    }
};

Game_Battler.prototype.addStateStack = function (stateId, value) {
    Game_BattlerBase.prototype.addStateStack.call(this, stateId, value);
    this.applyStateStackSpawn(stateId);
};

Game_Battler.prototype.applyStateStackSpawn = function (stateId) {
    var value = this.stateStack(stateId);
    var state = $dataStates[stateId];
    if (state.stackSpawn[value] && this._lastInflictingStateUser) {
        var char = this._lastInflictingStateUser.getSpriteCharacter()._character;
        state.stackSpawn[value].forEach(function (effect) {
            var battler;
            if (effect[0] === 'user') battler = char;
            if (effect[0] === 'target') battler = this.getSpriteCharacter()._character;
            if (battler) {
                char._user.autoTarget = battler;
                char.act(effect[1]);
            }
        }, this);
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
// Game_Action
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.StackableStates.Game_Action_itemEffectAddState = Game_Action.prototype.itemEffectAddState;
Game_Action.prototype.itemEffectAddState = function (target, effect) {
    target._lastInflictingStateUser = this.subject();
    Dhoom.StackableStates.Game_Action_itemEffectAddState.call(this, target, effect);
    target._lastInflictingStateUser = null;
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Window_Base
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.StackableStates.Window_Base_drawIcon = Window_Base.prototype.drawIcon;
Window_Base.prototype.drawIcon = function (iconIndex, x, y) {
    Dhoom.StackableStates.Window_Base_drawIcon.call(this, iconIndex, x, y);
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    if (this._drawIconActor && this._drawIconActor._lastStateIconsCall) {
        var stack = this._drawIconActor._lastStateIconsCall[this._drawIconActorIndex];
        if (stack && stack > 1) {
            this.contents.drawText(stack, x, y, pw, ph, 'center');
        }
        this._drawIconActorIndex++;
    }
};

Dhoom.StackableStates.Window_Base_drawActorIcons = Window_Base.prototype.drawActorIcons;
Window_Base.prototype.drawActorIcons = function (actor, x, y, width) {
    this._drawIconActor = actor;
    this._drawIconActorIndex = 0;
    Dhoom.StackableStates.Window_Base_drawActorIcons.call(this, actor, x, y, width);
    this._drawIconActor = null;
    this._drawIconActorIndex = null;
    actor._lastStateIconsCall = null;
};