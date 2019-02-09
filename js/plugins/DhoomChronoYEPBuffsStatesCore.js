//=============================================================================
// DhoomChronoYEPBuffsStatesCore.js
//=============================================================================
var Imported = Imported || {};
Imported.Dhoom_ChronoYEPBfStCore = true;

var Dhoom = Dhoom || {};
Dhoom.ChronoYEPBfStCore = Dhoom.ChronoYEPBfStCore || {};
/*:
 * @plugindesc Dhoom Chrono Engine & YEP Buffs and States Core Compatibility Patch v1.0a - 31/12/2018
 * @author DrDhoom - drd-workshop.blogspot.com
 *
 * @help All the state turns functionality will be applied to state duration instead.
 * Custom Timing Effects that will NOT work are:
 * - Turn Start
 * - Turn End
 * - Battle
 * - Victory
 * - Escape
 * - Defeat
 *
 * target.getSpriteCharacter()._character.act(ID);
 * -Target use Tool
 * target.getSpriteCharacter().startAnimation($dataAnimations[ANIMATIONID], MIRROR?) 
 * - Play animation on character
 * user.getSpriteCharacter().x - Get character X coordinate
 * user.getSpriteCharacter().y - Ditto for Y
 * user.getSpriteCharacter()._character.locate(x, y) - Set character coordinate
 *
 */

Dhoom.Parameters = PluginManager.parameters('DhoomChronoYEPBuffsStatesCore');
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
// Game_BattlerBase
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoYEPBfStCore.Game_BattlerBase_stateTurns = Game_BattlerBase.prototype.stateTurns;
Game_BattlerBase.prototype.stateTurns = function (stateId) {
    return this.stateDuration(stateId);
};

Dhoom.ChronoYEPBfStCore.Game_BattlerBase_setStateTurns = Game_BattlerBase.prototype.setStateTurns;
Game_BattlerBase.prototype.setStateTurns = function (stateId, turns) {
    this.setStateDuration(stateId, turns);
};

Dhoom.ChronoYEPBfStCore.Game_BattlerBase_updateChronoStatesAutoRemoval = Game_BattlerBase.prototype.updateChronoStatesAutoRemoval;
Game_BattlerBase.prototype.updateChronoStatesAutoRemoval = function () {
    $gameTemp._customLeaveEffectEval = true;
    Dhoom.ChronoYEPBfStCore.Game_BattlerBase_updateChronoStatesAutoRemoval.call(this);
    $gameTemp._customLeaveEffectEval = undefined;
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Action
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoYEPBfStCore.Game_Action_applyModifyStateTurns = Game_Action.prototype.applyModifyStateTurns;
Game_Action.prototype.applyModifyStateTurns = function (target) {
    if (!this.item()) return;
    var affected = false;
    var states = target.states()
    var length = states.length;
    var removed = [];
    for (var i = 0; i < length; ++i) {
        var state = states[i];
        if (isNaN(state.duration)) continue;
        if (!target.isStateAffected(state.id)) continue;
        var turn = target.stateTurns(state.id);
        if (this.item().modifyTurnState[state.id]) {
            turn += this.item().modifyTurnState[state.id];
        }
        turn = this.applyStateTurnsEval(turn, state.id, target);
        target.setStateTurns(state.id, turn);
        if (target.stateTurns(state.id) <= 0) removed.push(state.id);
    }
    for (var i = 0; i < removed.length; ++i) {
        target.removeState(removed[i]);
        affected = true;
    }
    if (affected) target.refresh();
};

Dhoom.ChronoYEPBfStCore.Game_Action_applyCN = Game_Action.prototype.applyCN;
Game_Action.prototype.applyCN = function (target, coopUsers) {
    this.onApplyStateEffects(target);
    this.onSelectStateEffects(target);
    Dhoom.ChronoYEPBfStCore.Game_Action_applyCN.call(this, target, coopUsers);
    this.onDeselectStateEffects(target);
    this.offApplyStateEffects(target);
};

Dhoom.ChronoYEPBfStCore.Game_Action_executeDamageCN = Game_Action.prototype.executeDamageCN;
Game_Action.prototype.executeDamageCN = function (target, value) {
    value = this.onPreDamageStateEffects(target, value);
    value = this.onReactStateEffects(target, value);
    Dhoom.ChronoYEPBfStCore.Game_Action_executeDamageCN.call(this, target, value);
    value = this.onRespondStateEffects(target, value);
    value = this.onPostDamageStateEffects(target, value);
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_CharacterBase
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoYEPBfStCore.Game_CharacterBase_act = Game_CharacterBase.prototype.act;
Game_CharacterBase.prototype.act = function (toolID) {
    var temp = $gameSystem._eventDataTool ? $gameSystem._eventDataTool.length : 0;
    Dhoom.ChronoYEPBfStCore.Game_CharacterBase_act.call(this, toolID);
    if (temp !== ($gameSystem._eventDataTool ? $gameSystem._eventDataTool.length : 0)) {
        this._actionEndBuffStateFlag = true;
        this.battler().onActionStartStateEffects();
    }
};

Dhoom.ChronoYEPBfStCore.Game_CharacterBase_canMoveABSBase = Game_CharacterBase.prototype.canMoveABSBase;
Game_CharacterBase.prototype.canMoveABSBase = function () {
    var result = Dhoom.ChronoYEPBfStCore.Game_CharacterBase_canMoveABSBase.call(this);
    if (result && this._actionEndBuffStateFlag) {
        this._actionEndBuffStateFlag = undefined;
        this.battler().onActionEndStateEffects();
    }
    return result;
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Player
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Game_Player.prototype.act = function (toolID) {
    Game_Character.prototype.act.call(this, toolID);
    if (Imported.MOG_PickupThrow) { $gamePlayer._pickup.wait = 2 };
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Sprite_StateIcon
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoYEPBfStCore.Sprite_StateIcon_textColor = Sprite_StateIcon.prototype.textColor;
Sprite_StateIcon.prototype.textColor = function (n) {
    if (SceneManager._scene instanceof Scene_Battle) return Dhoom.ChronoYEPBfStCore.Sprite_StateIcon_textColor.call(this, n);
    return SceneManager._scene._mapNameWindow.textColor(n);
};

Sprite_StateIcon.prototype.drawStateTurns = function (state) {
    this.drawStateStacks(state);
    if (!state) return;
    if (!state.showTurns) return;
    if (!state.duration) return;
    var turns = this._battler.stateDuration(state.id);
    if (turns !== 0 && !turns) return;
    var turns = Yanfly.Util.toGroup((turns / 60).toFixed(2));
    var wx = state.turnBufferX;
    var wy = state.turnBufferY - 2;
    var ww = Window_Base._iconWidth;
    var wh = Window_Base.prototype.lineHeight.call(this);
    var contents = this._turnCounterSprite.bitmap;
    contents.fontSize = state.turnFontSize;
    contents.textColor = this.textColor(state.turnColor);
    contents.drawText(turns, wx, wy, ww, wh, state.turnAlign);
};

Sprite_StateIcon.prototype.drawStateStacks = function (state) {
    if (!state) return;
    var value = this._battler.stateStack(state.id);
    if (!value || value <= 1) return;
    value = Yanfly.Util.toGroup(value);
    var ww = Window_Base._iconWidth;
    var wh = Window_Base.prototype.lineHeight.call(this);
    var contents = this._turnCounterSprite.bitmap;
    contents.fontSize = 20;
    contents.textColor = this.textColor(3);
    contents.drawText(value, 0, 8, ww, wh - 8, 'center');
};