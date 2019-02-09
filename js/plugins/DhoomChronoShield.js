//=============================================================================
// DhoomChronoShield.js
//=============================================================================
var Imported = Imported || {};
Imported.Dhoom_ChronoShield = true;

var Dhoom = Dhoom || {};
Dhoom.ChronoShield = Dhoom.ChronoShield || {};
/*:
 * @plugindesc Dhoom ChronoShield v1.3a - 12/12/2018
 * @author DrDhoom - drd-workshop.blogspot.com
 * 
 * @param Shield Durability Damage Formula
 * @desc See plugin help section.
 * @default (e - d) / 2
 * 
 * @param Shield Lock Wait Frame
 * @desc Ignore shield lock when the player got hit when guarding before x amount of frames.
 * @type number
 * @default 15
 *
 * @help Changelog: 
 * v1.3 03/12/2018:
 * - Added shieldRegenRateMod notetag for weapon, armor and state.
 * - Added shieldDecayRateMod notetag for weapon, armor and state.
 * 
 * v1.2 30/11/2018:
 * - Added DAMAGERATE to ShieldNoLock notetag.
 * - ShieldDurability notetag changed from NUMBER to FORMULA.
 * - Added ShieldDamageFormula notetag.
 * 
 * • Shield Durability Damage Formula Help:
 * a = attacker.
 * b = target.
 * c = shield.
 * d = received damage.
 * e = received damage without guard effect.
 * f = current shield durability.
 * g = max shield durability.
 * 
 * • Armor Notetags:
 * <ShieldAnimation: ANIMATIONID>
 * - Animation ID that will be played when shield is up.
 * 
 * <ShieldDurability: FORMULA>
 * - Shield max durability. a = battler, b = shield;
 * 
 * <ShieldRate: FLOAT>
 * - Shield regeneration per frame.
 * 
 * <ShieldDecayRate: FLOAT>
 * - Shield cost per frame.
 * 
 * <ShieldActivation: FLOAT>
 * - Minimum shield durability for activation.
 * 
 * <ShieldRoll: COST, DISTANCE, MOVESPEED, ANIMATIONID>
 * - Enable moving while shield is up. MOVESPEED is 1~6 just like in the event. Set MOVESPEED to 0 if you don't want to change the movement speed.
 * - Set ANIMATIONID to 0 if you don't want to use it.
 * 
 * <ShieldBreak: STATEID>
 * - When shield durability drop to 0, apply a state.
 * 
 * <ShieldNoLock: FRAME, ANIMATIONID, DAMAGERATE>
 * - When shield duration is less than FRAME, do not apply the received attack knockback. Also modified the damage rate.
 * 
 * <ShieldDamageFormula: FORMULA>
 * - Formula is the same as Shield Durability Damage Formula.
 * 
 * • Skill Notetags:
 * <shieldDamageRate: PERCENTAGE>
 * - Damage rate to shield durability.
 * 
 * • Weapon, Armor, and State notetags:
 * <shieldRegenRateMod: PERCENTAGE>
 * - Modified shield regeneration rate.
 * <shieldDecayRateMod: PERCENTAGE>
 * - Modified shield decay rate.
 */

Dhoom.Parameters = PluginManager.parameters('DhoomChronoShield');
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

Dhoom.ChronoShield.shieldFormula = Dhoom.loadParam('Shield Durability Damage Formula');
Dhoom.ChronoShield.shieldLock = Dhoom.loadParam('Shield Lock Wait Frame');

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// DataManager
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoShield.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    if (!Dhoom.ChronoShield.DataManager_isDatabaseLoaded.call(this)) return false;
    if (!Dhoom.ChronoShield.isChronoShieldInitialized) {
        this.DhoomInitChronoShield();
        this.DhoomInitChronoShield2();
        this.DhoomInitChronoShield3();
        Dhoom.ChronoShield.isChronoShieldInitialized = true;
    }
    return true;
};

DataManager.DhoomInitChronoShield = function () {
    var group = $dataArmors;
    for (var i = 1; i < group.length; i++) {
        var armor = group[i];
        if (armor) {
            var notedata = armor.note.split(/[\r\n]+/);
            for (var n = 0; n < notedata.length; n++) {
                if (notedata[n].match(/<shieldrate:\s*(.+)>/i)) {
                    armor.shieldRate = Number(RegExp.$1);
                }
                if (notedata[n].match(/<shielddurability:(.+)>/i)) {
                    armor.shieldDurability = RegExp.$1.trim();
                }
                if (notedata[n].match(/<shieldanimation:\s*(\d+)>/i)) {
                    armor.shieldAnimationId = Number(RegExp.$1);
                }
                if (notedata[n].match(/<shielddecayrate:\s*(.+)>/i)) {
                    armor.shieldDecayRate = Number(RegExp.$1);
                }
                if (notedata[n].match(/<shieldactivation:\s*(.+)>/i)) {
                    armor.shieldActivation = Number(RegExp.$1);
                }
                if (notedata[n].match(/<shieldroll:\s*(.+),\s*(\d+),\s*(\d+),\s*(\d+)>/i)) {
                    armor.shieldRoll = [Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), Number(RegExp.$4)];
                }
                if (notedata[n].match(/<shieldbreak:\s*(.+)>/i)) {
                    armor.shieldBreak = Number(RegExp.$1);
                }
                if (notedata[n].match(/<shieldnolock:\s*(.+),\s*(\d+),\s*(\d+)>/i)) {
                    armor.shieldNoLock = [Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3)];
                }
                if (notedata[n].match(/<shielddamageformula:(.+)>/i)) {
                    armor.shieldDamageFormula = RegExp.$1.trim();
                }
            }
        }
    }
};

DataManager.DhoomInitChronoShield2 = function () {
    var group = $dataSkills;
    for (var i = 1; i < group.length; i++) {
        var skill = group[i];
        if (skill) {
            skill.shieldDamageRate = 100;
            var notedata = skill.note.split(/[\r\n]+/);
            for (var n = 0; n < notedata.length; n++) {
                if (notedata[n].match(/<shielddamagerate:\s*(.+)>/i)) {
                    skill.shieldDamageRate = Number(RegExp.$1);
                }
            }
        }
    }
};

DataManager.DhoomInitChronoShield3 = function () {
    var group = [].concat($dataStates).concat($dataArmors).concat($dataWeapons);
    for (var i = 1; i < group.length; i++) {
        var object = group[i];
        if (object) {
            var notedata = object.note.split(/[\r\n]+/);
            for (var n = 0; n < notedata.length; n++) {
                if (notedata[n].match(/<shieldregenratemod:\s*(.+)>/i)) {
                    object.shieldRegenRateMod = Number(RegExp.$1);
                }
                if (notedata[n].match(/<shielddecayratemod:\s*(.+)>/i)) {
                    object.shieldDecayRateMod = Number(RegExp.$1);
                }
            }
        }
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Chrono
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Game_Chrono.prototype.executeGuardTouch = function (user, target) {
    target.battler()._ras.collisionD = 20;
    var animationID = Moghunter.ras_guardAnimationID;
    if (animationID) target.requestAnimation(animationID);
    var subject = user.battler();
    var action = new Game_Action(subject);
    action.setAbsSubject(subject)
    var oldHP = target.battler()._hp;
    var coop = [];
    var skillId = user.battler().attackSkillId();
    action.setSkill(skillId);
    action.applyCN(target.battler(), coop);
    target.battler().startDamagePopup();
    target.battler()._ras.collisionD = 30;
    if (oldHP > target.battler()._hp) {
        if (target.canKnockback(target)) {
            target.clearActing();
            target.turnTowardCharacter(user);
            var obj = target.battler().equips()[1];
            var lockFrame = obj.shieldNoLock ? obj.shieldNoLock[0] : Dhoom.ChronoShield.shieldLock;
            if (target._shieldActiveDuration >= lockFrame) {
                target.moveBackward();
                target.battler()._ras.knockback[1] = 55;
            }
            target.battler()._ras.collisionD = 60;
        }
    }
};

Dhoom.ChronoShield.ToolEvent_collisionGuard = ToolEvent.prototype.collisionGuard;
ToolEvent.prototype.collisionGuard = function (char, battler) {
    Dhoom.ChronoShield.ToolEvent_collisionGuard.call(this, char, battler);
    this.collisionBattler(char, battler);
};

Dhoom.ChronoShield.ToolEvent_collisionAfterHitBattler = ToolEvent.prototype.collisionAfterHitBattler;
ToolEvent.prototype.collisionAfterHitBattler = function (char, battler, oldHP) {
    if (oldHP > battler._hp && battler._ras.guard.active) {
        if (this.needScreenShake()) this.executeScreenShake();
        var obj = battler.equips()[1];
        var lockFrame = obj.shieldNoLock ? obj.shieldNoLock[0] : Dhoom.ChronoShield.shieldLock;
        if (char._shieldActiveDuration >= lockFrame) {
            if (this.canKnockback(char, battler)) this.executeKnockback(char, battler);
        }
        oldHP = battler._hp;
    }
    Dhoom.ChronoShield.ToolEvent_collisionAfterHitBattler.call(this, char, battler, oldHP);
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Action
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoShield.Game_Action_applyGuard = Game_Action.prototype.applyGuard;
Game_Action.prototype.applyGuard = function (damage, target) {
    this._damageNoGuard = Math.round(damage);
    var value = Dhoom.ChronoShield.Game_Action_applyGuard.call(this, damage, target);
    if (target === $gamePlayer.battler() && target.isGuard()) {
        var obj = target.equips()[1];
        if (obj.shieldNoLock && $gamePlayer._shieldActiveDuration < obj.shieldNoLock[0]) {
            value = value * obj.shieldNoLock[2] / 100;
            $gamePlayer.requestAnimation(obj.shieldNoLock[1]);
        }
    }
    return value;
};

Dhoom.ChronoShield.Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
Game_Action.prototype.executeHpDamage = function (target, value) {
    var damage = this._damageNoGuard;
    var value2 = value;
    if (this.isDrain()) {
        damage = Math.min(target.hp, damage);
        value2 = Math.min(target.hp, value);
    }
    if (target._ras.guard.active) this.applyShieldDamage(target, value2, damage);
    Dhoom.ChronoShield.Game_Action_executeHpDamage.call(this, target, value);
};

Dhoom.ChronoShield.Game_Action_executeMpDamage = Game_Action.prototype.executeMpDamage;
Game_Action.prototype.executeMpDamage = function (target, value) {
    var damage = this._damageNoGuard;
    var value2 = value;
    if (!this.isMpRecover()) {
        damage = Math.min(target.mp, damage);
        value2 = Math.min(target.mp, value);
    }
    if (target._ras.guard.active) this.applyShieldDamage(target, value2, damage);
    Dhoom.ChronoShield.Game_Action_executeMpDamage.call(this, target, value);
};

Game_Action.prototype.applyShieldDamage = function (target, value1, value2) {
    var a = this.subject();
    var b = target;
    var c = target.equips()[1];
    var d = value1;
    var e = value2;
    var f = target.chronoShieldDurability(c.id);
    var g = target.chronoShieldMaxDurability(c.id);
    var formula = c.shieldDamageFormula ? c.shieldDamageFormula : Dhoom.ChronoShield.shieldFormula;
    try {
        b.chronoShieldGainDurability(c.id, eval(formula) * -1 * (this.item().shieldDamageRate || 100) / 100);
    } catch (error) {
        console.error('Shield Formula error');
        console.error(error);
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Actor
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoShield.Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function (actorId) {
    Dhoom.ChronoShield.Game_Actor_setup.call(this, actorId);
    this.initChronoShield();
};

Game_Actor.prototype.initChronoShield = function () {
    this._chronoShields = {};
};

Game_Actor.prototype.chronoShieldUsable = function (armorId) {
    return this.chronoShieldDurabilityPercentage(armorId) > this.chronoShieldActivation(armorId);
};

Game_Actor.prototype.chronoCurrentShieldUsable = function () {
    return this.equips()[1] && this.chronoShieldUsable(this.equips()[1].id);
};

Game_Actor.prototype.chronoShieldDurabilityPercentage = function (armorId) {
    if (!armorId) return 0;
    return this.chronoShieldDurability(armorId) / this.chronoShieldMaxDurability(armorId);
};

Game_Actor.prototype.chronoShieldDurability = function (armorId) {
    if (!armorId) return 0;
    if (isNaN(this._chronoShields[armorId])) {
        return this.chronoShieldMaxDurability(armorId);
    } else {
        return this._chronoShields[armorId];
    }
};

Game_Actor.prototype.chronoShieldMaxDurability = function (armorId) {
    var a = this;
    var b = $dataArmors[armorId];
    try {
        return eval($dataArmors[armorId].shieldDurability);
    } catch (e) {
        return 0;
    }
};

Game_Actor.prototype.chronoShieldActivation = function (armorId) {
    return $dataArmors[armorId].shieldActivation && !this._tempChronoGuardActive ? $dataArmors[armorId].shieldActivation / this.chronoShieldMaxDurability(armorId) : 0;
};

Game_Actor.prototype.chronoShieldApply = function () {
    var obj = this.equips()[1];
    if (isNaN(this._chronoShields[obj.id])) this._chronoShields[obj.id] = this.chronoShieldMaxDurability(obj.id);
};

Game_Actor.prototype.updateChronoShield = function () {
    for (var id in this._chronoShields) {
        var obj = $dataArmors[id];
        var max = this.chronoShieldMaxDurability(obj.id);
        var decay = obj.shieldDecayRate * this.getShieldDecayRateModifiers();
        var rate = obj.shieldRate * this.getShieldRegenRateModifiers();
        if (this.equips()[1] === obj && this._ras.guard.active) {
            this.chronoShieldGainDurability(id, -decay);
        } else {
            if (this.equips()[1] !== obj || !Input.isPressed(Moghunter.ras_buttonGuard)) this.chronoShieldGainDurability(id, rate);
            if (this._chronoShields[id] >= max) delete this._chronoShields[id];
        }
    }
    this._tempChronoGuardActive = this._ras.guard.active;
};

Dhoom.ChronoShield.Game_Actor_specialFlag = Game_Actor.prototype.specialFlag;
Game_Actor.prototype.specialFlag = function (flagId) {
    if (flagId === Game_BattlerBase.FLAG_ID_GUARD && this._ras.guard.active) return true;
    return Dhoom.ChronoShield.Game_Actor_specialFlag.call(this, flagId);
};

Game_Actor.prototype.chronoShieldGainDurability = function (armorId, value) {
    var obj = $dataArmors[armorId];
    if (isNaN(this._chronoShields[armorId])) this._chronoShields[armorId] = this.chronoShieldMaxDurability(armorId);
    this._chronoShields[armorId] = Math.max(0, Math.min(this._chronoShields[armorId] + value, this.chronoShieldMaxDurability(armorId)));
    if (this._chronoShields[armorId] === 0 && obj.shieldBreak) {
        this.addState(obj.shieldBreak);
    }
};

Game_Actor.prototype.getShieldRegenRateModifiers = function () {
    var result;
    var objects = this.states().concat(this.equips());
    for (var i = 0; i < objects.length; i++) {
        if (objects[i] && !isNaN(objects[i].shieldRegenRateMod)) result += objects[i].shieldRegenRateMod;
    }
    return isNaN(result) ? 1 : result / 100;
};

Game_Actor.prototype.getShieldDecayRateModifiers = function () {
    var result;
    var objects = this.states().concat(this.equips());
    for (var i = 0; i < objects.length; i++) {
        if (objects[i] && !isNaN(objects[i].shieldDecayRateMod)) result += objects[i].shieldDecayRateMod;
    }
    return isNaN(result) ? 1 : result / 100;
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Player
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoShield.Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function (sceneActive) {
    Dhoom.ChronoShield.Game_Player_update.call(this, sceneActive);
    if (this.battler()) {
        this.battler().updateChronoShield();
    }
};

Dhoom.ChronoShield.Game_Player_commandGuardUsable = Game_Player.prototype.commandGuardUsable;
Game_Player.prototype.commandGuardUsable = function () {
    var result = Dhoom.ChronoShield.Game_Player_commandGuardUsable.call(this);
    if (result) result = this.battler().chronoCurrentShieldUsable();
    if (result) {
        this._shieldActiveDuration++;
    } else {
        this._shieldActiveDuration = 0;
    }
    return result;
};

Dhoom.ChronoShield.Game_Player_commandRasGuard = Game_Player.prototype.commandRasGuard;
Game_Player.prototype.commandRasGuard = function () {
    Dhoom.ChronoShield.Game_Player_commandRasGuard.call(this);
    this.battler().chronoShieldApply();
};

Dhoom.ChronoShield.Game_Player_updateGuardDirection = Game_Player.prototype.updateGuardDirection;
Game_Player.prototype.updateGuardDirection = function () {
    var dir = 0;
    if (Input.isTriggered('left')) {
        dir = 4;
    } else if (Input.isTriggered('right')) {
        dir = 6;
    } else if (Input.isTriggered('up')) {
        dir = 8
    } else if (Input.isTriggered('down')) {
        dir = 2;
    }
    var obj = this.battler().equips()[1];
    if (dir && obj.shieldRoll && this.battler().chronoShieldDurability(obj.id) >= obj.shieldRoll[0]) {
        this.battler().chronoShieldGainDurability(obj.id, -obj.shieldRoll[0]);
        var distance = obj.shieldRoll[1];
        var speed = obj.shieldRoll[2];
        var anim = obj.shieldRoll[3];
        var route = {};
        route.skippable = true;
        route.repeat = false;
        route.wait = true;
        route.list = [];
        route.list.push({ code: 35 });
        if (speed) route.list.push({ code: 29, parameters: [speed] });
        var dcode = dir / 2;
        for (var i = 0; i < distance; i++) {
            route.list.push({ code: dcode });
        }
        if (!this.isDirectionFixed()) route.list.push({ code: 36 });
        route.list.push({ code: 29, parameters: [this.moveSpeed()] });
        route.list.push({ code: 0 });
        this.battler()._ras.collisionD = 60;
        this.requestAnimation(anim);
        this.forceMoveRoute(route);
    } else if (!this.isMoving() && !this._isShieldRolling && dir) {
        this.setDirection(dir);
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Sprite_Animation
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoShield.Sprite_Animation_processTimingData = Sprite_Animation.prototype.processTimingData;
Sprite_Animation.prototype.processTimingData = function (timing) {
    Dhoom.ChronoShield.Sprite_Animation_processTimingData.call(this, timing);
    if (!this._duplicated && timing.se) {
        this._playedSe = this._playedSe || [];
        this._playedSe = this._playedSe.filter(function (audio) {
            return audio.isPlaying();
        });
        this._playedSe.push(AudioManager._seBuffers[AudioManager._seBuffers.length - 1]);
    }
};

Sprite_Animation.prototype.stopAllSe = function () {
    if (this._playedSe) {
        this._playedSe.forEach(function (buffer) {
            buffer.stop();
        });
    }
    this._playedSe = [];
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Sprite_Character
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoShield.Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function () {
    Dhoom.ChronoShield.Sprite_Character_update.call(this);
    if (this._character === $gamePlayer) this.updateShieldAnimation();
};

Sprite_Character.prototype.updateShieldAnimation = function () {
    if (this._character.commandGuardUsable()) {
        if (!this._shieldAnimationSprite || !this._animationSprites.contains(this._shieldAnimationSprite)) {
            this.startAnimation($dataAnimations[this._character.battler().equips()[1].shieldAnimationId], [4, 8].contains(this._character.direction()));
            this._shieldAnimationSprite = this._animationSprites[this._animationSprites.length - 1];
        }
    } else {
        if (this._shieldAnimationSprite) {
            this._shieldAnimationSprite.stopAllSe();
            this._shieldAnimationSprite.remove();
            this._shieldAnimationSprite = null;
        }
    }
};

if (Imported.Dhoom_ChronoToolHUD) {

    //vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    // Sprite_ChronoToolHUD
    //vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    Dhoom.ChronoShield.Sprite_ChronoToolHUD_isUsable = Sprite_ChronoToolHUD.prototype.isUsable;
    Sprite_ChronoToolHUD.prototype.isUsable = function () {
        if (this._item && this.isActive() && this.parent && this.parent.isActive() && DataManager.isArmor(this._item) && $gamePlayer.battler().chronoShieldMaxDurability(this._item.id)) {
            return $gamePlayer.battler().chronoShieldUsable(this._item.id);
        }
        return Dhoom.ChronoShield.Sprite_ChronoToolHUD_isUsable.call(this);
    };

    Dhoom.ChronoShield.Sprite_ChronoToolHUD_refreshText = Sprite_ChronoToolHUD.prototype.refreshText;
    Sprite_ChronoToolHUD.prototype.refreshText = function () {
        Dhoom.ChronoShield.Sprite_ChronoToolHUD_refreshText.call(this);
        if (DataManager.isArmor(this._item)) {
            this._tempCooldown = $gamePlayer.battler().chronoShieldDurabilityPercentage(this._item.id);
        }
    };

    Dhoom.ChronoShield.Sprite_ChronoToolHUD_updateCooldownSprite = Sprite_ChronoToolHUD.prototype.updateCooldownSprite;
    Sprite_ChronoToolHUD.prototype.updateCooldownSprite = function () {
        if (DataManager.isArmor(this._item)) {
            var rate = $gamePlayer.battler().chronoShieldDurabilityPercentage(this._item.id);
            if (rate < 1) {
                var y = Math.round(this._cooldownSprite.bitmap.height - (this._cooldownSprite.bitmap.height * rate));
                if (y > 2 || this._glCheckerDone) {
                    this._cooldownSprite.setFrame(0, 0, this._cooldownSprite.bitmap.width, y);
                    this._glCheckerDone = true;
                }
            }
            this._cooldownSprite.visible = rate < 1;
            return;
        }
        Dhoom.ChronoShield.Sprite_ChronoToolHUD_updateCooldownSprite.call(this);
    };

    Dhoom.ChronoShield.Sprite_ChronoToolHUD_isNeedRefresh = Sprite_ChronoToolHUD.prototype.isNeedRefresh;
    Sprite_ChronoToolHUD.prototype.isNeedRefresh = function () {
        if (DataManager.isArmor(this._item)) {
            if ($gamePlayer.battler().chronoShieldDurabilityPercentage(this._item.id) !== this._tempCooldown) return true;
        }
        return Dhoom.ChronoShield.Sprite_ChronoToolHUD_isNeedRefresh.call(this);
    };

    Dhoom.ChronoShield.Sprite_ChronoToolHUD_drawText = Sprite_ChronoToolHUD.prototype.drawText;
    Sprite_ChronoToolHUD.prototype.drawText = function (setting) {
        if (!this.checkTextCondition(setting.condition)) return;
        if (DataManager.isArmor(this._item)) {
            this._textSprite.bitmap.changeTextStyle(setting.style);
            var name = '';
            var cost = '';
            var cooldown = '';
            var key = this.input().toUpperCase().replace('#', '');
            var ckey = this.changeInput().toUpperCase().replace('#', '');
            name = this._item.name;
            cooldown = Math.round($gamePlayer.battler().chronoShieldDurabilityPercentage(this._item.id) * 100);
            cost = $gameParty.numItems(this._item);
            this._tempCost = cost;
            var text = setting.text.format(name, cost, cooldown, key, ckey);
            var x = setting.x + this.x;
            var y = setting.y + this.y;
            var width = setting.width;
            var height = setting.height;
            var align = setting.style.align;
            var bitmap = ImageManager.loadBitmap(this.directory(), setting.background);
            if (bitmap) {
                if (bitmap.isReady()) {
                    this._textSprite.bitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x + setting.backgroundX, y + setting.backgroundY);
                } else {
                    this._needRefresh = true;
                }
            }
            this._textSprite.bitmap.drawText(text, x, y, width, height, align);
            return;
        }
        Dhoom.ChronoShield.Sprite_ChronoToolHUD_drawText.call(this, setting);
    };

}