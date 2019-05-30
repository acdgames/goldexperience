//=============================================================================
// DhoomSkillCooldown.js
//=============================================================================
var Imported = Imported || {};
Imported.Dhoom_SkillCooldown = true;

var Dhoom = Dhoom || {};
Dhoom.SkillCooldown = Dhoom.SkillCooldown || {};
/*:
 * @plugindesc Dhoom SkillCooldown v2.1 - 14/05/2019
 * @author DrDhoom - drd-workshop.blogspot.com
 * 
 * @param Debug Log
 * @type boolean
 * @default true
 *
 * @help • Plugin Commands •
 * SkillCooldown clear x y z
 * Clear x actor skills cooldown.
 * x = Actor ID. When leave empty, clear all actors cooldowns.
 * y = Cooldown type: skill, stype, or global. Optional. When leave empty, clear all
 * cooldown types. Only if x is defined.
 * z = Skill ID or Skill Type ID, only if y is either skill or stype.
 * 
 * • Notetags •
 * === Skill:
 * 
 * <cooldown: x>
 * Set this skill cooldown value to x in frame.
 * x = Cooldown value.
 * Example:
 * <cooldown: 300> #Set cooldown value to 5 second.
 * 
 * <cooldown x: y>
 * Set skill x cooldown value to y in frame. 
 * x = Skill ID, y = Cooldown value.
 * 
 * <stypeCooldown: x>
 * Set this skill type cooldown value to x in frame.
 * x = Cooldown value.
 * 
 * <stypeCooldown x: y>
 * Set x skill type cooldown value to y in frame.
 * x = Skill Type ID, y = Cooldown value.
 * 
 * <globalCooldown: x>
 * x = Cooldown value.
 * 
 * <bypassCooldown>
 * This skill won't be affected by any cooldown.
 * 
 * <cooldownMax: x>
 * Set this cooldown max value to x in frame.
 * x = max value.
 * 
 * <cooldownMin: x>
 * Set this cooldown min value to x in frame.
 * x = min value.
 * 
 * === Skill, Item:
 * 
 * <targetCooldownModifier x: y>
 * Modify target skill cooldown. a = target, b = cooldown value, c = max cooldown value.
 * x = Skill ID, y = modifier.
 * Example:
 * <targetCooldownModifier 4: b + 120> #Increase target skill 4 cooldown value by 2 seconds.
 * 
 * <targetStypeCooldownModifier x: y>
 * x = Skill Type ID, y = modifier.
 * 
 * <targetGlobalCooldownModifier: x>
 * x = modifier.
 * 
 * === Actor, Class, Weapon, Armor, State, Enemy:
 * 
 * <cooldownModifier x: y>
 * Modifier for skill x cooldown, will be applied when said skill goes to cooldown.
 * x = Skill ID, y = modifier formula. a = Battler, b = Modified cooldown value, 
 * c = Original cooldown value.
 * Example:
 * <cooldownModifier 4: b - 100> #Decrease cooldown value by 100 frames.
 * <cooldownModifier 51: c * 20 / 100> #Set cooldown value to %20.
 * 
 * <stypeCooldownModifier x: y>
 * The same function as skill cooldown modifier above, but for skill type instead.
 * x = Skill Type ID. y = modifier formula.
 * 
 * <globalCooldownModifier: x>
 * The same function as skill cooldown modifier above, but for global cooldown instead.
 * x = modifier formula.
 * 
 * <skillCooldownMin x: y>
 * Set minimal cooldown value for skill cooldown.
 * x = Skill ID, y = Min Value.
 * Example:
 * <skillCooldownMin 4: 60> #Set skill 4 cooldown limit to 60 frames.
 * 
 * <skillCooldownMax x: y>
 * Set maximal cooldown value for skill cooldown.
 * x = Skill ID, y = Max Value.
 * 
 * <stypeCooldownMin x: y>
 * x = Skill Type ID, y = Min Value.
 * 
 * <stypeCooldownMax x: y>
 * x = Skill Type ID, y = Max Value.
 * 
 * <globalCooldownMin: x>
 * x = Min Value.
 * 
 * <globalCooldownMax: x>
 * x = Max Value.
 * 
 * <skillCooldownRate x: y>
 * Set skill cooldown decrease rate. Stack with other rate modifiers.
 * x = Skill ID, y = Rate value in percent.
 * Example:
 * <skillCooldownRate 10: 25> #Set skill 10 cooldown rate to 25%
 * <skillCooldownRate 5: 250> #Set skill 5 cooldown rate to 250%
 * 
 * <stypeCooldownRate x: y>
 * x = Skill Type ID, y = Rate value in percent.
 * 
 * <globalCooldownRate: x>
 * x = Rate value in percent.
 * 
 */

Dhoom.Parameters = PluginManager.parameters('DhoomSkillCooldown');
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

Dhoom.SkillCooldown.debugLog = Dhoom.loadParam('Debug Log');

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// DataManager
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.SkillCooldown.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    if (!Dhoom.SkillCooldown.DataManager_isDatabaseLoaded.call(this)) return false;
    if (!Dhoom.SkillCooldown.isSkillCooldownInitialized) {
        this.DhoomInitSkillCooldown1();
        this.DhoomInitSkillCooldown2();
        this.DhoomInitSkillCooldown3();
        Dhoom.SkillCooldown.isSkillCooldownInitialized = true;
    }
    return true;
};

DataManager.DhoomInitSkillCooldown1 = function () {
    var group = $dataSkills;
    for (var i = 1; i < group.length; i++) {
        var skill = group[i];
        if (skill) {
            skill._cooldown = [];
            skill._stypeCooldown = [];
            var notedata = skill.note.split(/[\r\n]+/);
            for (var n = 0; n < notedata.length; n++) {
                if (notedata[n].match(/<cooldown:\s*(.+)>/i)) {
                    skill._cooldown.push([skill.id, parseInt(RegExp.$1)]);
                }
                if (notedata[n].match(/<cooldown\s*(\d+):\s*(.+)>/i)) {
                    skill._cooldown.push([parseInt(RegExp.$1), parseInt(RegExp.$2)]);
                }
                if (notedata[n].match(/stypecooldown:\s*(.+)/i)) {
                    skill._stypeCooldown.push([skill.stypeId, parseInt(RegExp.$1)]);
                }
                if (notedata[n].match(/<stypecooldown\s*(\d+):\s*(.+)>/i)) {
                    skill._stypeCooldown.push([parseInt(RegExp.$1), parseInt(RegExp.$2)]);
                }
                if (notedata[n].match(/<bypasscooldown>/i)) {
                    skill._bypassCooldown = true;
                }
                if (notedata[n].match(/<globalcooldown:\s*(.+)>/i)) {
                    skill._globalCooldown = parseInt(RegExp.$1);
                }
                if (notedata[n].match(/<cooldownmax:\s*(.+)>/i)) {
                    skill._cooldownMaxLimit = parseInt(RegExp.$1);
                }
                if (notedata[n].match(/<cooldownmin:\s*(.+)>/i)) {
                    skill._cooldownMinLimit = parseInt(RegExp.$1);
                }
            }
        }
    }
};

DataManager.DhoomInitSkillCooldown2 = function () {
    var group = [].concat($dataSkills).concat($dataItems);
    for (var i = 1; i < group.length; i++) {
        var item = group[i];
        if (item) {
            item._targetSkillCooldownModifier = {};
            item._targetStypeCooldownModifier = {};
            var notedata = item.note.split(/[\r\n]+/);
            for (var n = 0; n < notedata.length; n++) {
                if (notedata[n].match(/<targetcooldownmodifier\s*(\d+):\s*(.+)>/i)) {
                    item._targetSkillCooldownModifier[parseInt(RegExp.$1)] = RegExp.$2;
                }
                if (notedata[n].match(/<targetstypecooldownmodifier\s*(\d+):\s*(.+)>/i)) {
                    item._targetStypeCooldownModifier[parseInt(RegExp.$1)] = RegExp.$2;
                }
                if (notedata[n].match(/<targetglobalcooldownmodifier\s*(\d+):\s*(.+)>/i)) {
                    item._targetGlobalCooldownModifier = RegExp.$1;
                }
            }
        }
    }
};

DataManager.DhoomInitSkillCooldown3 = function () {
    var group = [].concat($dataEnemies).concat($dataActors).concat($dataClasses).concat($dataWeapons).concat($dataArmors).concat($dataStates);
    for (var i = 1; i < group.length; i++) {
        var item = group[i];
        if (item) {
            item._skillCooldownModifier = [];
            item._skillTypeCooldownModifier = [];
            item._stypeCooldownMin = [];
            item._stypeCooldownMax = [];
            item._skillCooldownMin = [];
            item._skillCooldownMax = [];
            item._skillCooldownRate = [];
            item._stypeCooldownRate = [];
            var notedata = item.note.split(/[\r\n]+/);
            for (var n = 0; n < notedata.length; n++) {
                if (notedata[n].match(/<cooldownmodifier\s*(\d+):\s*(.+)>/i)) {
                    item._skillCooldownModifier[parseInt(RegExp.$1)] = RegExp.$2;
                }
                if (notedata[n].match(/<stypecooldownmodifier\s*(\d+):\s*(.+)>/i)) {
                    item._skillTypeCooldownModifier[parseInt(RegExp.$1)] = RegExp.$2;
                }
                if (notedata[n].match(/<globalcooldownmodifier:\s*(.+)>/i)) {
                    item._globalCooldownModifier = RegExp.$1;
                }
                if (notedata[n].match(/<stypecooldownmin\s*(\d+):\s*(.+)>/i)) {
                    item._stypeCooldownMin[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
                }
                if (notedata[n].match(/<stypecooldownmax\s*(\d+):\s*(.+)>/i)) {
                    item._stypeCooldownMax[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
                }
                if (notedata[n].match(/<globalcooldownmin:\s*(.+)>/i)) {
                    item._globalCooldownMin = parseInt(RegExp.$1);
                }
                if (notedata[n].match(/<globalcooldownmax:\s*(.+)>/i)) {
                    item._globalCooldownMax = parseInt(RegExp.$1);
                }
                if (notedata[n].match(/<skillcooldownmin\s*(\d+):\s*(.+)>/i)) {
                    item._skillCooldownMin[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
                }
                if (notedata[n].match(/<skillcooldownmax\s*(\d+):\s*(.+)>/i)) {
                    item._skillCooldownMax[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
                }
                if (notedata[n].match(/<skillcooldownrate\s*(\d+):\s*(.+)>/i)) {
                    item._skillCooldownRate[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
                }
                if (notedata[n].match(/<stypecooldownrate\s*(\d+):\s*(.+)>/i)) {
                    item._stypeCooldownRate[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
                }
                if (notedata[n].match(/<gloobalcooldownrate:\s*(\d+)>/i)) {
                    item._globalCooldownRate = parseInt(RegExp.$1);
                }
            }
        }
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// ToolEvent
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.SkillCooldown.ToolEvent_canPayActionCost = ToolEvent.prototype.canPayActionCost;
ToolEvent.prototype.canPayActionCost = function () {
    return Dhoom.SkillCooldown.ToolEvent_canPayActionCost.call(this) && !this.actionInCooldown();
};

ToolEvent.prototype.actionInCooldown = function () {
    if (this._tool.skill) {
        if (this.user().battler()) {
            return this.user().battler().isSkillInCooldown(this._tool.skill);
        } else if ($gameParty.leader()) {
            return $gameParty.leader().isSkillInCooldown(this._tool.skill);
        }
    }
    return false;
};

Dhoom.SkillCooldown.ToolEvent_payCost = ToolEvent.prototype.payCost;
ToolEvent.prototype.payCost = function () {
    Dhoom.SkillCooldown.ToolEvent_payCost.call(this);
    this.setActionCooldown();
};

ToolEvent.prototype.setActionCooldown = function () {
    if (this._tool.skill) {
        if (this.user().battler()) {
            this.user().battler().setSkillCooldown(this._tool.skill);
        } else if ($gameParty.leader()) {
            $gameParty.leader().setSkillCooldown(this._tool.skill);
        }
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_BattlerBase
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.SkillCooldown.Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
Game_BattlerBase.prototype.initMembers = function () {
    Dhoom.SkillCooldown.Game_BattlerBase_initMembers.call(this);
    this.clearAllSkillsCooldown();
};

Game_BattlerBase.prototype.clearAllSkillsCooldown = function () {
    this._skillsCooldown = {};
    this._skillsCooldownMax = {};
};

Game_BattlerBase.prototype.clearSkillCooldown = function (skillId) {
    this._skillsCooldown[skillId] = 0;
    this._skillsCooldownMax[skillId] = 0;
};

Game_BattlerBase.prototype.clearSkillTypeCooldown = function (stypeId) {
    var skills = this.isActor() ? this.skills() : [];
    skills.filter(function (s) { return s && s.stypeId === stypeId; }).forEach(function (s) {
        this.clearSkillCooldown(s.id);
    }, this);
};

Dhoom.SkillCooldown.Game_BattlerBase_meetsSkillConditions = Game_BattlerBase.prototype.meetsSkillConditions;
Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
    return Dhoom.SkillCooldown.Game_BattlerBase_meetsSkillConditions.call(this, skill) && !this.isSkillInCooldown(skill);
};

Game_BattlerBase.prototype.getSkillCooldown = function (skill) {
    if (skill && skill._bypassCooldown) return [0, 0];
    return this._skillsCooldown[skill.id] ? [this._skillsCooldown[skill.id], this._skillsCooldownMax[skill.id]] : [0, 0];
};

Game_BattlerBase.prototype.getMaxSkillCooldown = function (skill, cooldown, type) {
    var battler = this.isActor() ? this.actor() : this.enemy();
    var min1 = this.getCooldownLimitValue('Min', skill, 'skill');
    var min2 = this.getCooldownLimitValue('Min', skill, 'stype');
    var min3 = this.getCooldownLimitValue('Min', skill, 'global');
    var min = [min1, min2, min3].filter(function (v) {
        return typeof v === 'number';
    }).sort(function (a, b) {
        return a > b;
    })[0];
    var max1 = this.getCooldownLimitValue('Max', skill, 'skill');
    var max2 = this.getCooldownLimitValue('Max', skill, 'stype');
    var max3 = this.getCooldownLimitValue('Max', skill, 'global');
    var max = [max1, max2, max3].filter(function (v) {
        return typeof v === 'number';
    }).sort(function (a, b) {
        return a < b;
    })[0];
    var modifiers = this.getAllSkillCooldownModifiers('_skillCooldownModifier', skill.id);
    modifiers = modifiers.concat(this.getAllSkillCooldownModifiers('_skillTypeCooldownModifier', skill.stypeId));
    modifiers = modifiers.concat(this.getAllSkillCooldownModifiers('_globalCooldownModifier', null));
    var a = this;
    var b = cooldown;
    var c = cooldown;
    for (var mod of modifiers) {
        try {
            b = eval(mod);
        } catch (error) {
            console.error('Skill Cooldown modifier error: ' + mod);
            console.error(error.message);
        }
    }
    b = Math.round(b);
    if (typeof max === 'number') b = Math.min(max, b);
    if (typeof min === 'number') b = Math.max(min, b);
    return b;
};

Game_BattlerBase.prototype.getCooldownLimitValue = function (mode, skill, type) {
    var array = [];
    var sym, battler, index;
    if (this.isActor()) battler = this.actor();
    if (this.isEnemy()) battler = this.enemy();
    var states = this.states();
    if (this.isActor()) var equips = this.equips();
    switch (type) {
        case 'skill':
            index = skill.id;
            sym = '_skillCooldown' + mode;
            array.push(skill['_cooldown' + mode + 'Limit']);
            break;
        case 'stype':
            index = skill.stypeId;
            sym = '_stypeCooldown' + mode;
            break;
        case 'global':
            sym = '_globalCooldown' + mode;
            break;
    }
    if (typeof index !== 'number') {
        if (battler) array.push(battler[sym]);
        if (this.isActor()) array.push(this.currentClass()[sym]);
        for (var state of states) {
            array.push(state[sym]);
        }
        if (equips) {
            for (var obj of equips) {
                if (obj) array.push(obj[sym]);
            }
        }
    } else {
        if (battler) array.push(battler[sym][index]);
        if (this.isActor()) array.push(this.currentClass()[sym][index]);
        for (var state of states) {
            array.push(state[sym][index]);
        }
        if (equips) {
            for (var obj of equips) {
                if (obj) array.push(obj[sym][index]);
            }
        }
    }
    return array.filter(function (a) { return typeof a === 'number'; }).sort(function (a, b) { return mode === 'Min' ? b - a : a - b; })[0];
};

Game_BattlerBase.prototype.getAllSkillCooldownModifiers = function (sym, id) {
    var result = [];
    var objects = this.states();
    for (var object of objects) {
        if (object && object[sym] && (id === null || object[sym][id])) {
            result.push(id === null ? object[sym] : object[sym][id]);
        }
    }
    return result;
};

Game_BattlerBase.prototype.isSkillInCooldown = function (skill) {
    return this.getSkillCooldown(skill)[0] > 0;
};

Dhoom.SkillCooldown.Game_BattlerBase_paySkillCost = Game_BattlerBase.prototype.paySkillCost;
Game_BattlerBase.prototype.paySkillCost = function (skill) {
    Dhoom.SkillCooldown.Game_BattlerBase_paySkillCost.call(this, skill);
    this.setSkillCooldown(skill);
};

Game_BattlerBase.prototype.setSkillCooldown = function (skill) {
    if (skill._cooldown && skill._cooldown.length) {
        for (var setting of skill._cooldown) {
            var value = this.getMaxSkillCooldown($dataSkills[setting[0]], setting[1], 'skill');
            this._skillsCooldown[setting[0]] = this._skillsCooldown[setting[0]] || 0;
            this._skillsCooldownMax[setting[0]] = this._skillsCooldownMax[setting[0]] || 0;
            if (value > this._skillsCooldown[setting[0]]) {
                this._skillsCooldown[setting[0]] = value;
                this._skillsCooldownMax[setting[0]] = value;
            }
            if (Dhoom.SkillCooldown.debugLog) console.log(this.name() + ': ' + skill.id + ':' + skill.name + ': ' + this._skillsCooldown[setting[0]]);
        }
    }
    if (skill._stypeCooldown && skill._stypeCooldown.length) {
        var skills = this.isActor() ? this.skills() : [];
        for (var setting of skill._stypeCooldown) {
            var askills = skills.filter(function (s) { return s && s.stypeId === setting[0]; });
            for (var i = 0; i < askills.length; i++) {
                var value = this.getMaxSkillCooldown(askills[i], setting[1], 'skill');
                var id = askills[i].id;
                this._skillsCooldown[id] = this._skillsCooldown[id] || 0;
                this._skillsCooldownMax[id] = this._skillsCooldownMax[id] || 0;
                if (value > this._skillsCooldown[id]) {
                    this._skillsCooldown[id] = value;
                    this._skillsCooldownMax[id] = value;
                }
            }
            if (Dhoom.SkillCooldown.debugLog) console.log(this.name() + ': ' + skill.stypeId + ':' + $dataSystem.skillTypes[skill.stypeId] + ': ' + setting[1]);
        }
    }
    if (skill._globalCooldown) {
        var skills = this.isActor() ? this.skills() : [];
        for (var i = 0; i < skills.length; i++) {
            var value = this.getMaxSkillCooldown(skills[i], skill._globalCooldown, 'skill');
            var id = skills[i].id;
            this._skillsCooldown[id] = this._skillsCooldown[id] || 0;
            this._skillsCooldownMax[id] = this._skillsCooldownMax[id] || 0;
            if (value > this._skillsCooldown[id]) {
                this._skillsCooldown[id] = value;
                this._skillsCooldownMax[id] = value;
            }
            if (Dhoom.SkillCooldown.debugLog) console.log(this.name() + ': ' + skills[i].id + ':' + skills[i].name + ': ' + this._skillsCooldown[id]);
        }
        if (Dhoom.SkillCooldown.debugLog) console.log(this.name() + ': ' + 'Global cooldown: ' + skill._globalCooldown);
    }
};

Game_BattlerBase.prototype.updateSkillsCooldown = function () {
    for (var id in this._skillsCooldown) {
        this._skillsCooldown[id] -= this.getSkillCooldownRate(id) + this.getSkillTypeCooldownRate($dataSkills[id].stypeId) + this.getGlobalCooldownRate();
        if (this._skillsCooldown[id] <= 0) {
            delete this._skillsCooldown[id];
            delete this._skillsCooldownMax[id];
            if (Dhoom.SkillCooldown.debugLog) console.log(this.name() + ': ' + id + ':' + $dataSkills[id].name + ' cooldown removed.');
        }
    }
};

Game_BattlerBase.prototype.getSkillCooldownRate = function (id) {
    var array = [];
    if (this.isActor()) {
        var battler = this.actor();
        var equips = this.equips();
    }
    if (this.isEnemy()) var battler = this.enemy();
    var states = this.states();
    if (battler) array.push(battler._skillCooldownRate[id]);
    if (this.isActor()) array.push(this.currentClass()._skillCooldownRate[id]);
    for (var state of states) {
        array.push(state._skillCooldownRate[id]);
    }
    if (equips) {
        for (var obj of equips) {
            if (obj) array.push(obj._skillCooldownRate[id]);
        }
    }
    var mod = array.filter(function (a) { return !isNaN(a) }).reduce(function (a, b) { return a + b }, 0);
    if (!mod) mod = 100;
    return 1 * mod / 100;
};

Game_BattlerBase.prototype.getSkillTypeCooldownRate = function (id) {
    var array = [];
    if (this.isActor()) {
        var battler = this.actor();
        var equips = this.equips();
    }
    if (this.isEnemy()) var battler = this.enemy();
    var states = this.states();
    if (battler) array.push(battler._stypeCooldownRate[id]);
    if (this.isActor()) array.push(this.currentClass()._stypeCooldownRate[id]);
    for (var state of states) {
        array.push(state._stypeCooldownRate[id]);
    }
    if (equips) {
        for (var obj of equips) {
            if (obj) array.push(obj._stypeCooldownRate[id]);
        }
    }
    var mod = array.filter(function (a) { return !isNaN(a) }).reduce(function (a, b) { return a + b }, 0);
    if (!mod) mod = 0;
    return 1 * mod / 100;
};

Game_BattlerBase.prototype.getGlobalCooldownRate = function () {
    var array = [];
    if (this.isActor()) {
        var battler = this.actor();
        var equips = this.equips();
    }
    if (this.isEnemy()) var battler = this.enemy();
    var states = this.states();
    if (battler) array.push(battler._globalCooldownRate);
    if (this.isActor()) array.push(this.currentClass()._globalCooldownRate);
    for (var state of states) {
        array.push(state._globalCooldownRate);
    }
    if (equips) {
        for (var obj of equips) {
            if (obj) array.push(obj._globalCooldownRate);
        }
    }
    var mod = array.filter(function (a) { return !isNaN(a) }).reduce(function (a, b) { return a + b }, 0);
    if (!mod) mod = 0;
    return 1 * mod / 100;
};

Game_BattlerBase.prototype.applyItemCooldownModifier = function (item) {
    for (var id in item._targetSkillCooldownModifier) {
        this.applyCooldownModifier(item._targetSkillCooldownModifier[id], parseInt(id));
    }
    if (item._targetStypeCooldownModifier) {
        var skills = this.isActor() ? this.skills() : [];
        for (var di in item._targetStypeCooldownModifier) {
            id = parseInt(di);
            var askills = skills.filter(function (s) { return s && s.stypeId === id; });
            for (var i = 0; i < askills.length; i++) {
                this.applyCooldownModifier(item._targetStypeCooldownModifier[id], askills[i].id);
            }
        }
    }
    if (item._targetGlobalCooldownModifier) {
        var skills = this.isActor() ? this.skills() : [];
        for (var i = 0; i < skills.length; i++) {
            this.applyCooldownModifier(item._targetGlobalCooldownModifier, skills[i].id);
        }
    }
};

Game_BattlerBase.prototype.applyCooldownModifier = function (modifier, id) {
    if (modifier) {
        var a = this;
        var value;
        var b = this._skillsCooldown[id] || 0;
        var c = this._skillsCooldownMax[id] || 0;
        try {
            value = eval(modifier);
            if (value > this._skillsCooldownMax[id]) this._skillsCooldownMax[id] = value;
            this._skillsCooldown[id] = value;
            if (Dhoom.SkillCooldown.debugLog) console.log(this.name() + ': skill:' + id + ':' + $dataSkills[id].name + ' cooldown set to: ' + this._skillsCooldown[id]);
        } catch (error) {
            console.error('Target skill cooldown modifier error: ' + modifier);
            console.error(error.message);
        }
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Actor
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Game_Actor.prototype.getAllSkillCooldownModifiers = function (sym, id) {
    var result = Game_Battler.prototype.getAllSkillCooldownModifiers.call(this, sym, id);
    var objects = [this.actor(), this.currentClass()].concat(this.equips());
    for (var object of objects) {
        if (object && object[sym] && (id === null || object[sym][id])) {
            result.push(id === null ? object[sym] : object[sym][id]);
        }
    }
    return result;
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Enemy
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Game_Enemy.prototype.getAllSkillCooldownModifiers = function (sym, id) {
    var result = Game_Battler.prototype.getAllSkillCooldownModifiers.call(this, sym, id);
    if (this.enemy()[sym] && (id === null || this.enemy()[sym][id])) {
        result.push(id === null ? this.enemy()[sym] : this.enemy()[sym][id]);
    }
    return result;
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Action
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.SkillCooldown.Game_Action_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function (target) {
    Dhoom.SkillCooldown.Game_Action_apply.call(this, target);
    var result = target.result();
    if (result.isHit() && this.item()) {
        target.applyItemCooldownModifier(this.item());
    }
};

Dhoom.SkillCooldown.Game_Action_applyCN = Game_Action.prototype.applyCN;
Game_Action.prototype.applyCN = function (target, coopUsers) {
    Dhoom.SkillCooldown.Game_Action_applyCN.call(this, target, coopUsers);
    var result = target.result();
    if (result.isHitCR() && this.item()) {
        target.applyItemCooldownModifier(this.item());
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_CharacterBase
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.SkillCooldown.Game_CharacterBase_prepareCast = Game_CharacterBase.prototype.prepareCast;
Game_CharacterBase.prototype.prepareCast = function (toolID) {
    var action = $gameMap.toolEvent(toolID);
    var item = action.item();
    if (!item) { return };
    if (DataManager.isSkill(item) && this.battler().isSkillInCooldown(item)) return;
    Dhoom.SkillCooldown.Game_CharacterBase_prepareCast.call(this, toolID);
};

Dhoom.SkillCooldown.Game_CharacterBase_canUseTool = Game_CharacterBase.prototype.canUseTool;
Game_CharacterBase.prototype.canUseTool = function (toolID) {
    var result = Dhoom.SkillCooldown.Game_CharacterBase_canUseTool.call(this, toolID);
    if (result && this._user.actionTimes[1] === 0) {
        var item = $gameMap.toolEvent(toolID).item();
        if (item && DataManager.isSkill(item) && this.battler().isSkillInCooldown(item)) return false;
    }
    return result;
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Player
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.SkillCooldown.Game_Player_commandChargeUsable = Game_Player.prototype.commandChargeUsable;
Game_Player.prototype.commandChargeUsable = function () {
    var result = Dhoom.SkillCooldown.Game_Player_commandChargeUsable.call(this);
    if (result && this.battler().isSkillInCooldown(this.battler()._ras.charge.id)) return false;
    return result;
};

Dhoom.SkillCooldown.Game_Player_commandSkillUsable = Game_Player.prototype.commandSkillUsable;
Game_Player.prototype.commandSkillUsable = function () {
    var result = Dhoom.SkillCooldown.Game_Player_commandSkillUsable.call(this);
    if (result) {
        var action = $gameMap.toolEvent(this.battler().toolSkillID());
        if (action && action.item() && DataManager.isSkill(action.item()) && this.battler().isSkillInCooldown(action.item())) return false;
    }
    return result;
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Map
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.SkillCooldown.Game_Map_update = Game_Map.prototype.update;
Game_Map.prototype.update = function (sceneActive) {
    Dhoom.SkillCooldown.Game_Map_update.call(this, sceneActive);
    this.updateSkillsCooldown();
};

Game_Map.prototype.updateSkillsCooldown = function () {
    if (!this.isEventRunning() && !$gameMessage.isBusy()) {
        var battlers = $gameParty.members();
        for (var char of this.allEnemiesOnMap()) {
            if (!battlers.contains(char)) battlers.push(char.battler());
        }
        for (var battler of battlers) {
            battler.updateSkillsCooldown();
        }
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Interpreter
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.SkillCooldown.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    Dhoom.SkillCooldown.Game_Interpreter_pluginCommand.call(this, command, args);
    if (command.toLowerCase() === 'SkillCooldown') {
        switch (args[0].toLowerCase()) {
            case 'clear':
                var actorId = parseInt(args[1]);
                var type = args[2];
                var id = parseInt(args[3]);
                if (actorId) {
                    var actor = $gameActors.actor(actorId);
                    if (type && id && type !== 'global') {
                        if (type === 'skill') {
                            actor.clearSkillCooldown(id);
                            if (Dhoom.SkillCooldown.debugLog) {
                                console.log(actorId + ':' + actor.name() + ': ' + type + ' ' + id + ' cooldown cleared.');
                            }
                        } else if (type === 'stype') {
                            actor.clearSkillTypeCooldown(id);
                            if (Dhoom.SkillCooldown.debugLog) {
                                console.log(actorId + ':' + actor.name() + ': ' + type + ' ' + id + ' cooldown cleared.');
                            }
                        }
                    } else {
                        actor.clearAllSkillsCooldown();
                        if (Dhoom.SkillCooldown.debugLog) {
                            console.log(actorId + ':' + actor.name() + ': all cooldowns cleared.');
                        }
                    }
                } else {
                    $gameParty.members().forEach(function (a) {
                        a.clearAllSkillsCooldown();
                        if (Dhoom.SkillCooldown.debugLog) {
                            console.log(a.actorId() + ':' + a.name() + ': all cooldowns cleared.');
                        }
                    });
                }
                break;
        }
    }
};