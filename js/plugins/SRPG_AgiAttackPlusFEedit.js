//=============================================================================
// SRPG_AgiAttackPlus.js
// バージョン   : 1.00
// 最終更新日   : 6/27/2019
// 制作         : 神鏡学斗
// 配布元       : http://www.lemon-slice.net/
// Modified By : Sissel Cabanela
//-----------------------------------------------------------------------------
// copyright 2017 - 2018 Lemon slice all rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc Allow battlers to use follow attacks based on speed and ability
 * @author Gakuto Mikagami + Sissel Cabanela
 *
 * @param srpgAgility
 * @desc This is the flat number difference needed to double attack an opponent by default. Based on the * Fire Emblem series.
 * @default 5
 *
 * @help This plugin does not provide plugin commands.
 * 
 * You need SRPG converter for MV Ver.1.12.
 * 
 * Typically, attacks are executed one by one in descending order of higher agility, 
 * but if you introduce this plug-in, you will act in the order of 
 * attacker → defender → agile high character additional attack.
 * Actions targeted on your side or yourself will not act twice.
 * Also, if you enter <doubleAction: false> in the note of skill, it will not act twice.
 * 
 * Unlike the base script, this uses a flat number to determine if the battlers can follow up attack
 * as well as uses unique notetags to change the flow of combat outside of numbers.
 *
 * New State Tags(case sensitive):
 * - <guarenteedFollowup(Atk/Def/All)> : Allows the user to follow up attack regardless of their speed.
 * <guarenteedFollowUpAtk> only occurs when attacking 
 * <guarenteedFollowUpDef> when defending
 * <guarenteedFollowUpAll> will occur on either phase. This group of tags also applies to Skills.
 *
 * - <negateFollowup(Atk/Def/All)> : Prevents the user from being followed up on by speed disadvantage.  
 * However if the opponent also has a 'guarenteed Followup', the winner of the speed tie gains priority.
 *
 * 
 * - <negateSelfFollowup(Atk/Def/All)> : Prevents the user from following up on the set phase.
 *
 * - <negateFollowup> : Neither the user nor opponent can follow up attack.
 *
 * - <nullnegateFollowup> : Nulls the effects of enemy skills that would negate the user's natural follow
 * ups.
 *
 * - <vantage> : The user will attack before the opponent when they are the Defender. Does not count as
 * being the 'attacker'. Can be applied to skills.
 * 
 * - <desperation> : The user will perform their followup attack(checks speed) before the opponent can
 * counter-attack when they are the Attacker.(In the event of the defender having Vantage, the order
 * goes Defender -> User -> User -> Defender) Can be applied to skills.
 *
*/

(function() {

    var parameters = PluginManager.parameters('SRPG_AgiAttackPlus');
    var _srpgAgility = Number(parameters['srpgAgility'] || 5);

//====================================================================
// ●Game_Action
//====================================================================
    var _SRPG_AAP_Game_Action_speed = Game_Action.prototype.speed;
    Game_Action.prototype.speed = function() {
        if ($gameSystem.isSRPGMode() == true) {
            return this.subject().agi;
        } else {
            return _SRPG_AAP_Game_Action_speed.call(this);
        }
    };

//====================================================================
// ●Game_Battler
//====================================================================
    var _SRPG_AAP_Game_Battler_initMembers = Game_Battler.prototype.initMembers;
    Game_Battler.prototype.initMembers = function() {
        _SRPG_AAP_Game_Battler_initMembers.call(this);
        this._reserveAction = null;
    };

    Game_Battler.prototype.reserveSameAction = function() {
		//console.log(this._actions[0]);
        this._reserveAction = this._actions[0];
    };

    Game_Battler.prototype.addSameAction = function() {
        if (!this.currentAction() && this._reserveAction) {
                this._actions = this._actions.concat(this._reserveAction);
                var targets = this._actions[0].makeTargets();
                if (targets.length == 0) {
                    this._actions = [];
                }
            this._reserveAction = null;
        }
    };

//====================================================================
// ●BattleManager
//====================================================================
    var _SRPG_AAP_BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function() {
        _SRPG_AAP_BattleManager_initMembers.call(this);
        this._agilityRate = 0;
    };

    var _SRPG_AAP_BattleManager_makeActionOrders = BattleManager.makeActionOrders;
    BattleManager.makeActionOrders = function() {
        _SRPG_AAP_BattleManager_makeActionOrders.call(this);
		var speedcheck = false;
        var battlers = this._actionBattlers;
        var fastBattler = battlers[0];
        var slowBattler = battlers[1];
		var af_skill = false;
		var df_skill = false;
		var afn_skill = false;
		var dfn_skill = false;
		var vantage = false;
		var desperation = false;
		var no_counter = false;
		battlers.sort(function(a, b) {
                return a.srpgActionTiming() - b.srpgActionTiming();
            });
		var attacker = battlers[0];
		var defender = (battlers[1] ? battlers[1] : battlers[0]);
		//console.log(attacker);
		//console.log(defender);
		//Attacker Follow Up Skill Initial Check
		attacker.states().forEach(function(state) {
            if (state.meta.guarenteedFollowupAll || state.meta.guarenteedFollowupAtk) {
                af_skill = true;
            }
            if (state.meta.noCounter) {
                no_counter = true;
            }
        });
		if (attacker.currentAction()) {
		if (attacker.currentAction().item().meta.guarenteedFollowupAll || attacker.currentAction().item().meta.guarenteedFollowupAtk) {
			af_skill = true;
		};
		if (attacker.currentAction().item().meta.noCounter) {
			no_counter = true;
		};
		};
		//Defender Follow Up Skill Initial Check
		defender.states().forEach(function(state) {
            if (state.meta.guarenteedFollowupAll || state.meta.guarenteedFollowupDef) {
                df_skill = true;
            }
            if (state.meta.cannotCounter) {
                no_counter = true;
            }
        });
		if (defender.currentAction() && defender.currentAction().item() !== null) {
		if (defender.currentAction().item().meta.guarenteedFollowupAll || defender.currentAction().item().meta.guarenteedFollowupDef) {
			df_skill = true;
		};
		};
		//Followup Negations
		attacker.states().forEach(function(state) {
            if (state.meta.negateFollowup || state.meta.negateFollowupAll || state.meta.negateFollowupAtk) {
                dfn_skill = true;
            };
            if (state.meta.noCounter) {
                no_counter = true;
            };
        });
		defender.states().forEach(function(state) {
            if (state.meta.negateFollowup || state.meta.negateFollowupAll || state.meta.negateFollowupDef) {
                afn_skill = true;
            };
        });
		attacker.states().forEach(function(state) {
            if (state.meta.negateFollowup || state.meta.negateSelfFollowupAll || state.meta.negateSelfFollowupAtk) {
				afn_skill = true;
            };
        });
		defender.states().forEach(function(state) {
            if (state.meta.negateFollowup || state.meta.negateSelfFollowupAll || state.meta.negateSelfFollowupDef) {
				dfn_skill = true;
            };
        });
		//Null Negate
		if (afn_skill == true) {
		attacker.states().forEach(function(state) {
            if (state.meta.nullnegateFollowup) {
				afn_skill = false;
            };
        });
		}
		if (dfn_skill == true) {
		defender.states().forEach(function(state) {
            if (state.meta.nullnegateFollowup) {
				dfn_skill = false;
            }
        });
		};
		//Null Followup Skill
		attacker.states().forEach(function(state) {
            if (state.meta.nullFollowupSkill) {
				df_skill = false;
            }
        });
		defender.states().forEach(function(state) {
            if (state.meta.nullFollowupSkill) {
				af_skill = false;
            }
        });
		//};
		//End Skill Checking
        if (!fastBattler.currentAction()) {
            return;
        }
		//console.log(fastBattler.states());
		//Speed Check
		if (fastBattler.currentAction() && fastBattler.currentAction().item() !== null){
        if (fastBattler.currentAction().isForOpponent() &&
            !fastBattler.currentAction().item().meta.doubleAction) {
            var dif = fastBattler.agi - slowBattler.agi;
			if (dif >= _srpgAgility) {
			speedcheck = true;
			}
			//Final Calculation
            if (attacker == fastBattler && speedcheck && !afn_skill || attacker == fastBattler && speedcheck && afn_skill && af_skill || af_skill && !afn_skill) {
            attacker.reserveSameAction();
            } 
	        if (defender == fastBattler && speedcheck && !dfn_skill || defender == fastBattler && speedcheck && dfn_skill && df_skill || df_skill && !dfn_skill) {
            defender.reserveSameAction();
			}
		//Set Up Final Turn Order
		defender.states().forEach(function(state) {
            if (state.meta.vantage) {
				vantage = true;
            }
        });
		if (defender.currentAction().item().meta.vantage) {
			vantage = true;
		}
		attacker.states().forEach(function(state) {
            if (state.meta.desperation) {
				desperation = true;
            }
        });
		if (attacker.currentAction().item().meta.desperation) {
			desperation = true;
		}
		battlers = battlers.concat(battlers);
		if (vantage == true) {
		battlers = battlers.reverse();
		}
		if (desperation == true) {
		battlers.splice(battlers.lastIndexOf(attacker),1);
		battlers.splice(battlers.indexOf(attacker),0,attacker);
		}
		if (no_counter == true) {
		battlers.splice(battlers.lastIndexOf(defender),1);
		battlers.splice(battlers.lastIndexOf(defender),1);
		}
			//console.log(battlers);
            this._actionBattlers = battlers;
        }
		}
    }

    var _SRPG_AAP_BattleManager_getNextSubject = BattleManager.getNextSubject;
    BattleManager.getNextSubject = function() {
        var battler = _SRPG_AAP_BattleManager_getNextSubject.call(this);
        if (battler) {
            battler.addSameAction();
        }
        return battler;
    };

})();
