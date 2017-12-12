/*:
 @plugindesc |v1.1| This plugin in enables the developer to handle and manage in-battle action events.
 @author xDGameStudios Engine

 @help
 ========================================================================
 Help
 ========================================================================

 This plugin enables the execution of custom javascript code during the
 action performance. This will enable the creation of more complex game
 mechanics. Game variables and switches can be set and triggered upon the
 execution of a specific event stats can be changed, messages triggered,
 states applied, GabWindow controlled.... There's a whole new world of
 possibilities out there. Remember this plugin is meant for developers who
 have basic javascript knowledge.

 ========================================================================
 Note Tag Data
 ========================================================================

 The note tag data used within this plugin applies to the ACTORS, ENEMIES
 and CLASS tabs of the RPG Maker editor. You can use the following tags
 to execute code during the correct in-battle action moments.

 <Battle Event Attacking>
    code
    code
 </Battle Event Attacking>

 Place here the code to be executed every time the player/enemy/class
 attacks.
 ------------------------------------------------------------------------

 <Battle Event Attacked>
    code
    code
 </Battle Event Attacked>

 Place here the code to be executed every time the player/enemy/class is
 attacked.
 ------------------------------------------------------------------------

 <Battle Event Killing>
    code
    code
 </Battle Event Killing>

 Place here the code to be executed every time the player/enemy/class
 kills a target.
 ------------------------------------------------------------------------

 <Battle Event Killed>
    code
    code
 </Battle Event Killed>

 Place here the code to be executed every time the player/enemy/class is
 killed.
 ------------------------------------------------------------------------

 <Battle Event Healing>
    code
    code
 </Battle Event Healing>

 Place here the code to be executed every time the player/enemy/class
 heals.
 ------------------------------------------------------------------------

 <Battle Event Healed>
    code
    code
 </Battle Event Healed>

 Place here the code to be executed every time the player/enemy/class is
 healed.

 ========================================================================
 Code Builtin Variables
 ========================================================================

 target : is of Game_Battler class and has all its information.


 targetData : is the data structure corresponding to the target of the
 action $dataActors or $dataEnemies.


 subject : is of Game_Battler class and has all its information.


 subjectData : is the data structure corresponding to the performer of an
 action $dataActors or $dataEnemies.


 object : can be either a skill or an item from $dataItems or $dataSkills


 critical : a boolean to know if the current attack will be a critical
 hit or not (READ-ONLY).


 damage : the amount of damage that is going to be dealt to the target by
 this action (READ-ONLY).


 item/skill : boolean value to know if the action is an item use or a
 skill use.


 attack/guard : boolean value to identify the type of action attack
 or guard.


 targetActor/targetEnemy : boolean value to identify if the target is
 an actor or an enemy.

 ========================================================================
 Extra Data
 ========================================================================

 $dataActors, $dataEnemies, $dataClasses are added a new property that is
 an object called [battleEvents] containing the following structure.

 {
    attacking: "code",  attacked: "code",
    healing: "code",    healed: "code",
    killing: "code",    killed: "code"
 }

 Code evaluations are executed during the corresponding battle action.

 ========================================================================
 Updates History
 ========================================================================

 1.0: Initial Release
 1.1: [22-01-2016] Fixed some minor bugs and prepared for future updates.

 ========================================================================
 */

var Imported = Imported || {};
Imported.XDE_BattleEvents = true;

var XDE = XDE || {};
XDE.BattleEvents = XDE.BattleEvents || {};

(function ($) {

    "use strict";

    var getInnerText = function (text, tag) {
        var pattern = new RegExp('<' + tag + '[\\s]*>' + '(([^<]*?))' + '</' + tag + '>', 'im');

        var ret = undefined;
        if (text.match(pattern)) {
            ret = RegExp.$1;
        }
        return ret;
    };

    //=============================================================================
    // Data Objects
    //=============================================================================

    $.Alias = $.Alias || {};

    //=============================================================================
    // DataManager
    //=============================================================================

    $.Alias._dataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!$.Alias._dataManager_isDatabaseLoaded.call(this)) return false;
        this.processXDEBattleEventsTags();
        return true;
    };

    DataManager.processXDEBattleEventsTags = function () {
        var i, len;
        len = $dataActors.length;
        for (i = 1; i < len; i++) {
            var actor = $dataActors[i];
            this.addBattleEventsData(actor);
        }
        len = $dataEnemies.length;
        for (i = 1; i < len; i++) {
            var enemy = $dataEnemies[i];
            this.addBattleEventsData(enemy);
        }
        len = $dataClasses.length;
        for (i = 1; i < len; i++) {
            var cl = $dataClasses[i];
            this.addBattleEventsData(cl);
        }
    };

    DataManager.addBattleEventsData = function (dbItem) {
        dbItem.battleEvents = {};
        var result;

        if (result = getInnerText(dbItem.note, 'Battle Event Attacking')) {
            dbItem.battleEvents.attacking = result;
        }
        if (result = getInnerText(dbItem.note, 'Battle Event Attacked')) {
            dbItem.battleEvents.attacked = result;
        }
        if (result = getInnerText(dbItem.note, 'Battle Event Killing')) {
            dbItem.battleEvents.killing = result;
        }
        if (result = getInnerText(dbItem.note, 'Battle Event Killed')) {
            dbItem.battleEvents.killed = result;
        }
        if (result = getInnerText(dbItem.note, 'Battle Event Healing')) {
            dbItem.battleEvents.healing = result;
        }
        if (result = getInnerText(dbItem.note, 'Battle Event Healed')) {
            dbItem.battleEvents.healed = result;
        }
    };

    //=============================================================================
    // Game_Action
    //=============================================================================

    $.Alias._game_action_executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function(target, value) {
        $.Alias._game_action_executeDamage.call(this, target, value);
        BattleManager.runDamageEvents(this, target, target.result(), value);
    };

    $.Alias._game_action_applyItemEffect = Game_Action.prototype.applyItemEffect;
    Game_Action.prototype.applyItemEffect = function (target, effect) {
        $.Alias._game_action_applyItemEffect.call(this, target, effect);
        BattleManager.runEffectEvents(this, target, target.result(), effect);
    };

    //=============================================================================
    // BattleManager
    //=============================================================================

    BattleManager.runDamageEvents = function (action, target, result, damage) {
        var subject = action.subject();

        var item = action.isItem();
        var skill = action.isSkill();
        var guard = action.isGuard();
        var attack = action.isAttack();
        var critical = result.critical;
        
        var targetActor = target.isActor();
        var subjectActor = subject.isActor();

        var targetEnemy = target.isEnemy();


        var object = action._item;

        var subjectData = subject.actor() || subject.enemy();
        var targetData = target.actor() || target.enemy();
        var classData;

        if (damage > 0) {
            if (subjectData.battleEvents.attacking) {
                eval(subjectData.battleEvents.attacking);
            }
            if (targetData.battleEvents.attacked) {
                eval(targetData.battleEvents.attacked);
            }
            if (target.hp <= 0) {
                if (subjectData.battleEvents.killing) {
                    eval(subjectData.battleEvents.killing);
                }
                if (targetData.battleEvents.killed) {
                    eval(targetData.battleEvents.killed);
                }
            }
            if (subjectActor) {
                classData = subject.currentClass();
                eval(classData.battleEvents.attacking);
                if (target.hp <= 0 && classData.battleEvents.killing) {
                    eval(classData.battleEvents.killing);
                }
            }
            if (targetActor) {
                classData = target.currentClass();
                eval(classData.battleEvents.attacked);
                if (target.hp <= 0 && classData.battleEvents.killed) {
                    eval(classData.battleEvents.killed);
                }
            }
        } else if (damage < 0) {
            if (subjectData.battleEvents.healing) {
                eval(subjectData.battleEvents.healing);
            }
            if (targetData.battleEvents.healed) {
                eval(targetData.battleEvents.healed);
            }
            if (subjectActor) {
                classData = subject.currentClass();
                if (classData.battleEvents.healing) {
                    eval(classData.battleEvents.healing);
                }
            }
            if (targetActor) {
                classData = target.currentClass();
                if (classData.battleEvents.healed) {
                    eval(classData.battleEvents.healed);
                }
            }
        }
    };

    BattleManager.runEffectEvents = function (action, target, result, effect) {
        //TODO
    };

})(XDE.BattleEvents);