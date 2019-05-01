//=============================================================================
// DhoomChronoYEPSkillCore.js
//=============================================================================
var Imported = Imported || {};
Imported.Dhoom_ChronoYEPSkillCore = true;

var Dhoom = Dhoom || {};
Dhoom.ChronoYEPSkillCore = Dhoom.ChronoYEPSkillCore || {};
/*:
 * @plugindesc Dhoom Chrono Engine and YEP Skill Core Compatibility Patch v1.0 - 28/12/2018
 * @author DrDhoom - drd-workshop.blogspot.com
 *
 * @help 
 */

Dhoom.Parameters = PluginManager.parameters('DhoomChronoYEPSkillCore');
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
// Game_Action
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoYEPSkillCore.Game_Action_executeDamageCN = Game_Action.prototype.executeDamageCN;
Game_Action.prototype.executeDamageCN = function (target, value) {
    this.applyPreDamageEffect(target, value);
    value = this.applyPreDamageEval(target, value);
    Dhoom.ChronoYEPSkillCore.Game_Action_executeDamageCN.call(this, target, value);
    this.applyPostDamageEffect(target, value);
    this.applyPostDamageEval(target, value);
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// ToolEvent
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoYEPSkillCore.ToolEvent_canPayMPCost = ToolEvent.prototype.canPayMPCost;
ToolEvent.prototype.canPayMPCost = function () {
    var skillCost = this._tool.mpCost;
    if (!skillCost || skillCost <= 0) { return true };
    if (this.user().battler()) {
        if (this._tool.skill) {
            skillCost -= this._tool.skill.mpCost;
            skillCost += this.user().battler().skillMpCost(this._tool.skill);
        }
        if (this.user().battler()._mp < skillCost) { return false };
        this._payCost.mp = skillCost;
        return true;
    };
    if (this.user()._user.isEvent) { return true };
    var actor = $gameParty.leader();
    if (!actor) { return false };
    if (this._tool.skill) {
        skillCost -= this._tool.skill.mpCost;
        skillCost += actor.skillMpCost(this._tool.skill);
    }
    if (actor._mp < skillCost) { return false };
    this._payCost.mp = skillCost;
    return true;
};

Dhoom.ChronoYEPSkillCore.ToolEvent_canPayTPCost = ToolEvent.prototype.canPayTPCost;
ToolEvent.prototype.canPayTPCost = function () {
    var skillCost = this._tool.tpCost;
    if (!skillCost || skillCost <= 0) { return true };
    if (this.user().battler()) {
        if (this._tool.skill) {
            skillCost -= this._tool.skill.tpCost;
            skillCost += this.user().battler().skillTpCost(this._tool.skill);
        }
        if (this.user().battler()._tp < skillCost) { return false };
        this._payCost.tp = skillCost;
        return true;
    };
    if (this.user()._user.isEvent) { return true };
    var actor = $gameParty.leader();
    if (!actor) { return false };
    if (this._tool.skill) {
        skillCost -= this._tool.skill.tpCost;
        skillCost += actor.skillTpCost(this._tool.skill);
    }
    if (actor._tp < skillCost) { return false };
    this._payCost.tp = skillCost;
    return true;
};

Dhoom.ChronoYEPSkillCore.ToolEvent_payCost = ToolEvent.prototype.payCost;
ToolEvent.prototype.payCost = function () {
    Dhoom.ChronoYEPSkillCore.ToolEvent_payCost.call(this);
    if (DataManager.isSkill(this.item())) {
        this.user().battler().paySkillHpCost(this.item());
        this.user().battler().paySkillEvalCost(this.item());
    }
};