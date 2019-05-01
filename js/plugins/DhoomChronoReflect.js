//=============================================================================
// DhoomChronoReflect.js
//=============================================================================
var Imported = Imported || {};
Imported.Dhoom_ChronoReflect = true;

var Dhoom = Dhoom || {};
Dhoom.ChronoReflect = Dhoom.ChronoReflect || {};
/*:
 * @plugindesc Dhoom ChronoReflect v2.0 - 12/12/2018
 * @author DrDhoom - drd-workshop.blogspot.com
 *
 * @help Actor, Armor, Enemy and State Notetags:
 * <reflection: CHANCE, DAMAGERATE, ANIMID>
 * - CHANCE = Probability chance that a skill will be reflected back. 0 ~ 100.
 * - DAMAGERATE = Damage rate percentage.
 * - ANIMID = Animation that will be played when a skill got reflected successfully.
 * 
 * Skill Notetag:
 * <reflectable>
 * - Set this skill to be reflectable.
 * 
 * Armor (Shield) Notetag:
 * <shieldReflection: CHANCE, DAMAGERATE, ANIMID>
 * - Only when the shield is up.
 * <shieldNoLockReflection: CHANCE, DAMAGERATE, ANIMID>
 * - Only when No Lock shield occurred.
 * 
 * Event Tool comment:
 * tool_reflection : CHANCE : DAMAGERATE : ANIMID
 * - This event will reflect other tool event that is reflectable.
 */

Dhoom.Parameters = PluginManager.parameters('DhoomChronoReflect');
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
// DataManager
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoReflect.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    if (!Dhoom.ChronoReflect.DataManager_isDatabaseLoaded.call(this)) return false;
    if (!Dhoom.ChronoReflect.isChronoReflectInitialized) {
        this.DhoomInitChronoReflect();
        this.DhoomInitChronoReflect2();
        this.DhoomInitChronoReflect3();
        Dhoom.ChronoReflect.isChronoReflectInitialized = true;
    }
    return true;
};

DataManager.DhoomInitChronoReflect = function () {
    var group = [].concat($dataArmors).concat($dataStates).concat($dataEnemies).concat($dataActors);
    for (var i = 1; i < group.length; i++) {
        var object = group[i];
        if (object) {
            var notedata = object.note.split(/[\r\n]+/);
            for (var n = 0; n < notedata.length; n++) {
                if (notedata[n].match(/<reflection:\s*(\d+),\s*(\d+),\s*(\d+)>/i)) {
                    object.chronoReflection = [Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3)];
                }
            }
        }
    }
};

DataManager.DhoomInitChronoReflect2 = function () {
    var group = [].concat($dataSkills);
    for (var i = 1; i < group.length; i++) {
        var object = group[i];
        if (object) {
            var notedata = object.note.split(/[\r\n]+/);
            for (var n = 0; n < notedata.length; n++) {
                if (notedata[n].match(/<reflectable>/i)) {
                    object.chronoReflectable = true;
                }
            }
        }
    }
};

DataManager.DhoomInitChronoReflect3 = function () {
    var group = [].concat($dataArmors);
    for (var i = 1; i < group.length; i++) {
        var object = group[i];
        if (object) {
            var notedata = object.note.split(/[\r\n]+/);
            for (var n = 0; n < notedata.length; n++) {
                if (notedata[n].match(/<shieldreflection:\s*(\d+),\s*(\d+),\s*(\d+)>/i)) {
                    object.chronoShieldReflection = [Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3)];
                }
                if (notedata[n].match(/<shieldnolockreflection:\s*(\d+),\s*(\d+),\s*(\d+)>/i)) {
                    object.chronoShieldNoLockReflection = [Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3)];
                }
            }
        }
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Chrono
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoReflect.Game_Chrono_executeTouchDamage = Game_Chrono.prototype.executeTouchDamage;
Game_Chrono.prototype.executeTouchDamage = function (user, target) {
    if (target.battler()._ras.collisionD > 0) { return };
    var obj = this.canReflectSkill(user, target, $dataSkills[user.battler().attackSkillId()]);
    if (obj) {
        var oldHP = user.battler()._hp;
        target.requestAnimation(obj[2]);
        this.performReflectSkill(user, target, user.battler().attackSkillId(), obj, []);
        user.battler()._ras.collisionD = 30;
        if (oldHP > user.battler()._hp) {
            this.executeTouchTouchAfterHit(target, user, user.battler().attackSkillId());
        };
        return;
    }
    Dhoom.ChronoReflect.Game_Chrono_executeTouchDamage.call(this, user, target);
};

Game_Chrono.prototype.canReflectSkill = function (user, target, skill) {
    if (!user || !target) return false;
    if (user === target || user.battler() === target.battler()) return false;
    if (!skill || !skill.chronoReflectable) return false;
    if (!target.canMove()) return false;
    var objects = [];
    if (target.battler().isActor()) {
        objects = objects.concat(target.battler().equips().filter(function (obj) {
            return DataManager.isArmor(obj);
        }));
        objects.push(target.battler().actor());
    }
    if (target.battler().isEnemy()) objects.push(target.battler().enemy());
    objects = objects.concat(target.battler().states());
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].chronoReflection && Math.randomInt(100) <= objects[i].chronoReflection[0]) {
            return objects[i].chronoReflection;
        }
        if (Imported.Dhoom_ChronoShield && objects[i].chronoShieldNoLockReflection && target.battler()._ras.guard.active) {
            var obj = target.battler().equips()[1];
            var lockFrame = obj.shieldNoLock ? obj.shieldNoLock[0] : Dhoom.ChronoShield.shieldLock;
            if (target._shieldActiveDuration >= lockFrame && Math.randomInt(100) <= objects[i].chronoShieldNoLockReflection[0]) {
                return objects[i].chronoShieldNoLockReflection;
            }
        }
        if (objects[i].chronoShieldReflection && target.battler()._ras.guard.active && Math.randomInt(100) <= objects[i].chronoShieldReflection[0]) {
            return objects[i].chronoShieldReflection;
        }
    }
    return false;
};

Game_Chrono.prototype.canReflectTool = function (user, target, skill) {
    if (!user || !target) return false;
    if (user === target || user.battler() === target.battler()) return false;
    if (!skill || !skill.chronoReflectable) return false;
    if (target._tool.toolReflection) {
        if (Math.randomInt(100) <= target._tool.toolReflection[0]) return target._tool.toolReflection;
    }
    return false;
};

Game_Chrono.prototype.performReflectSkill = function (user, target, skillId, object, coop) {
    var subject = target.battler();
    var action = new Game_Action(subject);
    action.setAbsSubject(subject);
    action._reflectDamageMultiplier = object[1];
    action.setSkill(skillId);
    action.applyCN(user.battler(), coop);
    user.battler().startDamagePopup();
    if ($dataSkills[skillId].damage.type > 4) {
        target.battler().startDamagePopup();
    };
    if ($gameSystem.isNonBattleMode() && user.battler().isActor() && user.battler().isDead()) {
        user.battler().setHp(1);
    };
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Action
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoReflect.Game_Action_executeDamageCN = Game_Action.prototype.executeDamageCN;
Game_Action.prototype.executeDamageCN = function (target, value) {
    if (this._reflectDamageMultiplier) {
        value = Math.round(value * this._reflectDamageMultiplier / 100);
        this._reflectDamageMultiplier = null;
    }
    Dhoom.ChronoReflect.Game_Action_executeDamageCN.call(this, target, value);
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// ToolEvent
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoReflect.ToolEvent_targets = ToolEvent.prototype.targets;
ToolEvent.prototype.targets = function () {
    return Dhoom.ChronoReflect.ToolEvent_targets.call(this).sort(function (a, b) {
        return a._character instanceof ToolEvent ? -1 : 1;
    });
};

Dhoom.ChronoReflect.ToolEvent_collisionBattler = ToolEvent.prototype.collisionBattler;
ToolEvent.prototype.collisionBattler = function (char, battler) {
    if (!this._isReflected) {
        if (char instanceof ToolEvent) {
            var reflect = $gameChrono.canReflectTool(this.user(), char, this._tool.skill);
        } else {
            var reflect = $gameChrono.canReflectSkill(this.user(), char, this._tool.skill);
        }
        if (reflect) {
            char.requestAnimation(reflect[2]);
            this._tool.duration = this._tool.durationBase;
            if (this.canSetAngleSprite()) {
                this._user.diagonal[1] = this.setReverseDiagonal();
                this.setAngleSprite();
            } else {
                this.turn180();
            }
            this._isReflected = [char instanceof ToolEvent ? char.user() : char, reflect];
            this._collided = [char];
            if (char instanceof ToolEvent) this._collided.push(char.user());
            this.forceMoveRoute(this.page().moveRoute);
            return;
        }
        if (char instanceof ToolEvent) return;
    }
    Dhoom.ChronoReflect.ToolEvent_collisionBattler.call(this, char, battler);
};

Dhoom.ChronoReflect.ToolEvent_turnTowardPlayer = ToolEvent.prototype.turnTowardPlayer;
ToolEvent.prototype.turnTowardPlayer = function () {
    if (this._isReflected && this._isReflected[0]._user.isPlayer) {
        this.turnTowardCharacter(this.user());
        return;
    }
    Dhoom.ChronoReflect.ToolEvent_turnTowardPlayer.call(this);
};

Dhoom.ChronoReflect.ToolEvent_turnAwayFromPlayer = ToolEvent.prototype.turnAwayFromPlayer;
ToolEvent.prototype.turnAwayFromPlayer = function () {
    if (this._isReflected && this._isReflected[0]._user.isPlayer) {
        this.turnAwayFromCharacter(this.user());
        return;
    }
    Dhoom.ChronoReflect.ToolEvent_turnAwayFromPlayer.call(this);
};

Dhoom.ChronoReflect.ToolEvent_moveTowardPlayer = ToolEvent.prototype.moveTowardPlayer;
ToolEvent.prototype.moveTowardPlayer = function () {
    if (this._isReflected && this._isReflected[0]._user.isPlayer) {
        this.moveTowardCharacter(this.user());
        return;
    }
    Dhoom.ChronoReflect.ToolEvent_moveTowardPlayer.call(this);
};

Dhoom.ChronoReflect.ToolEvent_moveAwayFromPlayer = ToolEvent.prototype.moveAwayFromPlayer;
ToolEvent.prototype.moveAwayFromPlayer = function () {
    if (this._isReflected && this._isReflected[0]._user.isPlayer) {
        this.moveAwayFromCharacter(this.user());
        return;
    }
    Dhoom.ChronoReflect.ToolEvent_moveAwayFromPlayer.call(this);
};

Dhoom.ChronoReflect.ToolEvent_inScope = ToolEvent.prototype.inScope;
ToolEvent.prototype.inScope = function (user, target) {
    if (this._isReflected) {
        user = this._isReflected[0].battler();
    }
    return Dhoom.ChronoReflect.ToolEvent_inScope.call(this, user, target);
};

Dhoom.ChronoReflect.ToolEvent_executeDamage = ToolEvent.prototype.executeDamage;
ToolEvent.prototype.executeDamage = function (target) {
    if (this._isReflected) {
        $gameChrono.performReflectSkill(this.user(), this._isReflected[0], this._tool.skill.id, this._isReflected[1], this._coopMembers);
        return;
    }
    Dhoom.ChronoReflect.ToolEvent_executeDamage.call(this, target);
};

Dhoom.ChronoReflect.ToolEvent_processMoveCommand = ToolEvent.prototype.processMoveCommand;
ToolEvent.prototype.processMoveCommand = function (command) {
    var gc = Game_Character;
    var params = command.parameters;
    if (this._isReflected && command.code === gc.ROUTE_SCRIPT && params[0].contains('$gamePlayer') && this._isReflected[0]._user.isPlayer) {
        eval(params[0].replace('$gamePlayer', 'this.user()'));
        return;
    }
    Dhoom.ChronoReflect.ToolEvent_processMoveCommand.call(this, command);
};


Dhoom.ChronoReflect.ToolEvent_checkToolNotes = ToolEvent.prototype.checkToolNotes;
ToolEvent.prototype.checkToolNotes = function () {
    Dhoom.ChronoReflect.ToolEvent_checkToolNotes.call(this);
    if (!this._erased && this.page()) {
        this.list().forEach(function (l) {
            if (l.code === 108) {
                var comment = l.parameters[0].split(' : ');
                if (comment[0].toLowerCase() == "tool_reflection") {
                    this._tool.toolReflection = [Number(comment[1]), Number(comment[2]), Number(comment[3])];
                }
            }
        }, this);
    }
};

Dhoom.ChronoReflect.ToolEvent_canCollide = ToolEvent.prototype.canCollide;
ToolEvent.prototype.canCollide = function (target) {
    var tempEnabled = target._tool.enabled;
    if (target._tool.toolReflection) target._tool.enabled = false;
    var result = Dhoom.ChronoReflect.ToolEvent_canCollide.call(this, target);
    target._tool.enabled = tempEnabled;
    return result;
};

Dhoom.ChronoReflect.ToolEvent_collidedXY = ToolEvent.prototype.collidedXY;
ToolEvent.prototype.collidedXY = function (target) {
    if (target instanceof ToolEvent && target._tool.toolReflection && this._tool.skill && this._tool.skill.chronoReflectable) {
        var trange = this._tool.range;
        var range = target._tool.range;
        if ((Math.abs(this.x - trange - target.x - range) * 2 < (this.x + trange + target.x + range)) && (Math.abs(this.y - trange - target.y - range) * 2 < (this.y + trange + target.y + range))) {
            var mode = target._tool.area;
            var dir = target.direction();
            var cords = [];
            var ax, ay;
            for (var x = target.x - range; x <= target.x + range; x++) {
                for (var y = target.y - range; y <= target.y + range; y++) {
                    var inc = false;
                    switch (mode) {
                        case 0:
                            var blank = Math.abs(x - target.x);
                            inc = (y >= target.y - range + blank && y <= target.y + range - blank);
                            break;
                        case 1:
                            inc = true;
                            break;
                        case 2:
                            if (dir === 2 && target.x === x && y >= target.y) {
                                inc = true;
                            }
                            if (dir === 8 && target.x === x && y <= target.y) {
                                inc = true;
                            }
                            if (dir === 6 && target.y === y && x >= target.x) {
                                inc = true;
                            }
                            if (dir === 4 && target.y === y && x <= target.x) {
                                inc = true;
                            }
                            break;
                        case 3:
                            var blank = Math.abs(x - target.x);
                            switch (dir) {
                                case 2:
                                    inc = y >= target.y && y >= target.y - range + blank && y <= target.y + range - blank;
                                    break;
                                case 4:
                                    inc = x <= target.x && y >= target.y - range + blank && y <= target.y + range - blank;
                                    break;
                                case 6:
                                    inc = x >= target.x && y >= target.y - range + blank && y <= target.y + range - blank;
                                    break;
                                case 8:
                                    inc = y <= target.y && y >= target.y - range + blank && y <= target.y + range - blank;
                                    break;
                            }
                            break;
                        case 4:
                            switch (dir) {
                                case 2:
                                    inc = y >= target.y;
                                    break;
                                case 4:
                                    inc = x <= target.x;
                                    break;
                                case 6:
                                    inc = x >= target.x;
                                    break;
                                case 8:
                                    inc = y <= target.y;
                                    break;
                            }
                            break;
                        case 5:
                            if ([4, 6].contains(dir)) inc = x === target.x;
                            if ([2, 8].contains(dir)) inc = y === target.y;
                            break;
                        case 6:
                            inc = x === target.x || y === target.y;
                            break;
                    }
                    if (inc) cords.push([x, y]);
                }
            }
            for (var i = 0; i < cords.length; i++) {
                ax = cords[i][0];
                ay = cords[i][1];
                if (ax >= 0 && ay >= 0 && ax < $gameMap.width() && ay < $gameMap.height()) {
                    var cxy = [ax, ay];
                    var dx = cxy[0] - this.x;
                    var dy = cxy[1] - this.y;
                    var dx = dx >= 0 ? Math.max(dx, 0) : Math.min(dx, 0);
                    var dy = dy >= 0 ? Math.max(dy, 0) : Math.min(dy, 0);
                    if (this.inRange(dx, dy)) return true;
                }
            }
        }
        return false;
    } else {
        return Dhoom.ChronoReflect.ToolEvent_collidedXY.call(this, target);
    }
};