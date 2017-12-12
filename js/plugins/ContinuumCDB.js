//=============================================================================
// ContinuumCDB.js
//=============================================================================

/*:
 * @plugindesc Battle System as commissioned by kranasAngel
 * @author Continuumg
 *
 * @param Frames per Turn
 * @desc Number of frames between each 'On Turn End' effect. (Not including time spent in menus)
 * @default 100
 *
 * @param Default Cast Time
 * @desc The default time it takes to cast a skill or use an item.
 * @default 1000
 *
 * @param Enemy Action Bias
 * @desc The number of times to skew the number of actions a battler will take (I recomend 0-2)
 * @default 0
 *
 * @param Enemy High Bias
 * @desc If set true, enemies will tend to use more actions, rather than fewer, if Enemy Action Bias is greater than 0.
 * @default true
 *
 * @param Instant Cast
 * @desc If set true, turns will jump from one action to the next. (Might cause lag)
 * @default false
 *
 * @param Speed Stat
 * @desc If left blank, all battlers will have the same speed before haste
 * @default agi
 *
 * @param Global Speed Modifier
 * @desc 0 = Fixed, 1 = Highest Speed Based, 2 = Average Speed Based
 * @default 0
 *
 * @param Gauge Colour
 * @desc Windowskin colour index for the Queue Gauges
 * @default 20
 *
 * @param Enemy Icons
 * @desc -1 = Don't show, 0 = show action icon, 1 = show icon 1, etc.
 * @default 5
 *
 * @param Time Cost Icon
 * @desc Icon Id for time cost in menus (If used with Yanfly's Skill Core)
 * @default 0
 *
 * @param Time Cost Text
 * @desc This text will be added to the cost in menus. (If used with Yanfly's Skill Core)
 * @default Time
 *
 * @param End Turn Command Text
 * @desc The text displayed for the command to stop inputting for the queue
 * @default Confirm
 *
 *
 * @help
 *#######################################################
 *            Damage Formulae functions
 *#######################################################
 *
 * this.time <- returns the action's time cost
 *
 * this.qid <- returns the action's position in its user's queue
 *
 * a.qlength <- returns the number of actions the actor has queued
 *
 * a.qcost <- returns the total time cost of the actor's queue
 *
 * a.combool('string')
 * Returns true if the previous action in the queue has the tag <string>
 *
 * a.combadd('string')
 * Returns value if the previous action in the queue has the tag <string:value>
 * Otherwise Returns 0
 *
 * a.combx('string')
 * Returns value if the previous action in the queue has the tag <string:value>
 * Otherwise Returns 1
 *
 *#######################################################
 *                      Notetags
 *#######################################################
 *
 * <haste:percent>
 * <haste:75> <haste:150>
 * Works on States, Classes, Enemies, Equipment
 *
 * <high_bias> <low_bias>
 * Overrides Enemy High Bias parameter
 *
 * <action_bias:number>
 * Overrides Enemy Action Bias parameter
 *
 * <time:number>
 * On skills or items, determines the time cost.
 *
 */
var Imported = Imported || {}
Imported.ContinuumCDB = true;
var parameters = PluginManager.parameters('ContinuumCDB');
var Continuum = Continuum || {};
Continuum.CDB = {};
Continuum.CDB.Imported = true;
Continuum.CDB.fpt = Number(parameters['Frames per Turn'])
Continuum.CDB.defaultCastTime = Number(parameters['Default Cast Time'])
Continuum.CDB.acionBias = Number(parameters['Enemy Action Bias'])
Continuum.CDB.highBias = eval(parameters['Enemy High Bias'])
Continuum.CDB.instant = eval(parameters['Instant Cast'])
Continuum.CDB.speedStat = String(parameters['Speed Stat'])
Continuum.CDB.globalSpeed = Number(parameters['Global Speed Modifier'])
Continuum.CDB.gaugeColor = Number(parameters['Gauge Colour'])
Continuum.CDB.enemyIcons = Number(parameters['Enemy Icons'])
Continuum.CDB.costIcon = Number(parameters['Time Cost Icon'])
Continuum.CDB.costText = String(parameters['Time Cost Text'])
Continuum.CDB.confirmText = String(parameters['End Turn Command Text'])
Continuum.CDB.BattleManager = {};
Continuum.CDB.Battle = {};
Continuum.CDB.Battler = {};
Continuum.CDB.Actor = {};
Continuum.CDB.Enemy = {};
Continuum.CDB.Sprite = {};
Continuum.CDB.Item = {};
Continuum.CDB.Action = {};
Continuum.CDB.SkillList = {};
Continuum.CDB.ActorCommand = {};

(function() {

    Continuum.CDB.Battle.initMembers = Game_Battler.prototype.initMembers
    Game_Battler.prototype.initMembers = function() {
    	Continuum.CDB.Battle.initMembers.call(this)
    	this._lastUsedAction = new Game_Item();
    	this._time = 0;
    	this._queueCosts = [];
    	this._queueCost = 0;
    	this._queueLength = 0
    }

    Game_Battler.prototype.queueRates = function() {
    	var rates = [];
    	var time = this._time
    	var finished = false;
	    for (var i = 0; i < this._queueCosts.length; i++) {
	    	if (!finished) {
		    	if (time >= this._queueCosts[i]) {
		    		time -= this._queueCosts[i]
		    		rates.push(1)
		    	} else {
		    		rates.push(time/this._queueCosts[i])
		    		finished = true
		    	}
	    	} else {
	    		rates.push(0)
	    	}
	    }
	    return rates
    }

    Continuum.CDB.Actor.selectNextCommand = Game_Actor.prototype.selectNextCommand
	Game_Actor.prototype.selectNextCommand = function() {
	    if (Continuum.CDB.Actor.selectNextCommand.call(this)) {
    		this._queueLength++;
	        return true;
	    } else {
    		this._queueLength++;
	    	this._queueCost = this.makeQueueCost()
	        return false;
	    }
	};

	Continuum.CDB.Battle.selectNextCommand = Scene_Battle.prototype.selectNextCommand
	Scene_Battle.prototype.selectNextCommand = function() {
		Continuum.CDB.Battle.selectNextCommand.call(this)
		this._statusWindow.refresh()
	};

	Continuum.CDB.Battle.selectPreviousCommand = Scene_Battle.prototype.selectPreviousCommand
	Scene_Battle.prototype.selectPreviousCommand = function() {
		Continuum.CDB.Battle.selectPreviousCommand.call(this)
		this._statusWindow.refresh()
	};

    Continuum.CDB.Actor.selectPreviousCommand = Game_Actor.prototype.selectPreviousCommand
	Game_Actor.prototype.selectPreviousCommand = function() {
	    if (Continuum.CDB.Actor.selectPreviousCommand.call(this)) {
	    	this._queueLength--;
	    	this._queueCosts.pop();
	        return true;
	    } else {
	        return false;
	    }
	};

    BattleManager.selectPreviousCommand = function() {
	    do {
	        if (!this.actor() || !this.actor().selectPreviousCommand()) {
	        	return
	        }
	    } while (!this.actor().canInput());
    };

    BattleManager.endTurn = function() {
        this._phase = 'turnEnd';
        this._preemptive = false;
        this._surprise = false;
        this.clearActor();
    };

    Game_Battler.prototype.makeQueueCost = function() {
    	var total = 0
    	this._queueCosts.forEach(function(cost) {
    		total += cost
    	}, this)
    	return total
    }

    Game_Battler.prototype.haste = function() {
    	var value = 100;
        this.states().forEach(function(item) {
	          newval = (typeof item.meta.haste !== 'undefined') ? Number(item.meta.haste) : 100;
	          value *= (newval/100);
	          newval = 100;
        });
        return value
    }

	Game_Actor.prototype.haste = function() {
		var value = Game_Battler.prototype.haste.call(this)
	    var equips = this.equips();
	    var newval = 100;
	    for (var i = 0; i < equips.length; i++) {
	        var item = equips[i];
	        if (item) {
	        	newval = (typeof item.meta.haste !== 'undefined') ? Number(item.meta.haste) : 100;
	        	value *= (newval/100);
	        	newval = 100;
	        }
	    }
	    var classitem = this.currentClass()
	    if (classitem) {
	        newval = (typeof classitem.meta.haste !== 'undefined') ? Number(classitem.meta.haste) : 100;
	        value *= (newval/100);
	    }
	    return value
	}

	Game_Enemy.prototype.haste = function() {
		var value = Game_Battler.prototype.haste.call(this)
	    var item = this.enemy();
	    var newval = 100;
	    newval = (typeof item.meta.haste !== 'undefined') ? Number(item.meta.haste) : 100;
	    value *= (newval/100);
	    return value
	}

	Continuum.CDB.Battler.addState = Game_Battler.prototype.addState
	Game_Battler.prototype.addState = function(stateId) {
		Continuum.CDB.Battler.addState.call(this, stateId) 
		if ($dataStates[stateId].meta.cancel_queue !== 'undefined') {

		}
	};

    Continuum.CDB.Enemy.initMembers = Game_Enemy.prototype.initMembers
    Game_Enemy.prototype.initMembers = function() {
    	Continuum.CDB.Enemy.initMembers.call(this)
    	this._turns = 0
    }

    Continuum.CDB.BattleManager.initMembers = BattleManager.initMembers
	BattleManager.initMembers = function() {
		Continuum.CDB.BattleManager.initMembers.call(this)
		this._time = 0
	};

	Game_Troop.prototype.turnCount = function() {
		var highest = 0;
		this.members().forEach(function(enemy) {
			highest = Math.max(highest,enemy._turns)
		})
		this._turnCount = highest;
	    return highest
	};

	Game_Action.prototype.castTime = function() {
		if (this.item() && typeof this.item().meta.time !== 'undefined') {
			return Number(this.item().meta.time)
		} else if (this.isValid()) {
			return Continuum.CDB.defaultCastTime;
		}
	    return 0
	};

	Continuum.CDB.Battler.makeActionTimes = Game_Battler.prototype.makeActionTimes
	Game_Battler.prototype.makeActionTimes = function() {
		var times = Continuum.CDB.Battler.makeActionTimes.call(this)
		return times + 4
	};

	Game_Battler.prototype.combool = function(meta) {
		if (this._lastUsedAction && this._lastUsedAction.meta && (typeof this._lastUsedAction.meta[meta] !== 'undefined')) return true;
	    return false;
	};

	Game_Battler.prototype.combadd = function(meta) {
		if (this._lastUsedAction && this._lastUsedAction.meta && (typeof this._lastUsedAction.meta[meta] !== 'undefined')) return Number(this._lastUsedAction.meta[meta]);
	    return 0;
	};

	Game_Battler.prototype.combx = function(meta) {
		if (this._lastUsedAction && this._lastUsedAction.meta && (typeof this._lastUsedAction.meta[meta] !== 'undefined')) return Number(this._lastUsedAction.meta[meta]);
	    return 1;
	};

	Continuum.CDB.Battler.clearActions = Game_Battler.prototype.clearActions
	Game_Battler.prototype.clearActions = function() {
	    Continuum.CDB.Battler.clearActions.call(this)
	    this._lastUsedAction = new Game_Item;
	    this._queueCosts = [];
	    this._queueCost = 0;
    	this._queueLength = 0
	};

	Game_Battler.prototype.onAllActionsEnd = function() {
	    this.clearResult();
	    this.removeStatesAuto(1);
	    this.removeBuffsAuto();
	    this.clearActions();
	};

	Continuum.CDB.Item.initialize = Game_Item.prototype.initialize
	Game_Item.prototype.initialize = function(item) {
		Continuum.CDB.Item.initialize.call(this,item)
		this._qid = 0;
	};

	Continuum.CDB.Action.setSkill = Game_Action.prototype.setSkill
	Game_Action.prototype.setSkill = function(skillId) {
		Continuum.CDB.Action.setSkill.call(this,skillId)
	    if (this.subject()) {
	    	index = this.subject()._actions.indexOf(this)
	    	this._qid = index+1
	    	this.subject()._queueCosts[index] = this.castTime()
	    }
	};

	Continuum.CDB.Action.setItem = Game_Action.prototype.setItem
	Game_Action.prototype.setItem = function(itemId) {
		Continuum.CDB.Action.setItem.call(this,itemId)
	    if (this.subject()) {
	    	index = this.subject()._actions.indexOf(this)
	    	this._qid = index+1
	    	this.subject()._queueCosts[index] = this.castTime()
	    }
	};

	Object.defineProperties(Game_Action.prototype, {

	    qid: { get: function() { return this._qid; }, configurable: true },
	    time: { get: function() { return this.castTime(); }, configurable: true },
	
	});

	Object.defineProperties(Game_Battler.prototype, {

	    qlength: { get: function() { return this._queueLength; }, configurable: true },
	    qcost: { get: function() { return this.makeQueueCost(); }, configurable: true },
	
	});

	Continuum.CDB.ActorCommand.makeCommandList = Window_ActorCommand.prototype.makeCommandList
	Window_ActorCommand.prototype.makeCommandList = function() {
		Continuum.CDB.ActorCommand.makeCommandList.call(this)
	    if (this._actor) {
	        this.addConfirmCommand()
	    }
	};

	Window_ActorCommand.prototype.addConfirmCommand = function() {
	    this.addCommand(Continuum.CDB.confirmText, 'confirm', this._actor._actionInputIndex > 0);
	};

	Continuum.CDB.Battle.createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow
	Scene_Battle.prototype.createActorCommandWindow = function() {
		Continuum.CDB.Battle.createActorCommandWindow.call(this)
	    this._actorCommandWindow.setHandler('confirm', this.commandConfirm.bind(this));
	};

	Game_Actor.prototype.selectFinalCommand = function() {
	    this._actionInputIndex = this.numActions() - 1;
	    this._queueCost = this.makeQueueCost()
	};

	Game_Battler.prototype.battleSpeed = function() {
		if (Continuum.CDB.speedStat === '') {
			return 100*(this.haste()/100)
		} else {
			return this[Continuum.CDB.speedStat]*(this.haste()/100)
		}
	};

    BattleManager.globalSpeed = function() {
    	if (Continuum.CDB.globalSpeed === 1) {
    		return this.maxSpeed
    	} else if (Continuum.CDB.globalSpeed === 2) {
    		return this.avrgSpeed
    	}
    	return 10
    }

    BattleManager.maxSpeed = function() {
	    var speed = 0
	    this.allBattleMembers().forEach(function(battler) {
	    	speed = Math.max(battler.battleSpeed(),speed)
	    }, this);
	    return speed/10;
    }

    BattleManager.avrgSpeed = function() {
	    var sum = this.allBattleMembers().reduce(function(a, b) {
	    	return a + b.battleSpeed();
	    },0);
		var avg = sum / this.allBattleMembers().length;
	    return avg;
    }

	Scene_Battle.prototype.commandConfirm = function() {
		BattleManager.actor().selectFinalCommand()
	    this.selectNextCommand();
	};

    BattleManager.addTime = function() {
        var loop = true;
        do {
            this._time += 1;
            if (this._time >= Continuum.CDB.fpt) {
                this._time -= Continuum.CDB.fpt;
                this.allBattleMembers().forEach(function(battler) {
                    battler.onTurnEnd();
                    this.refreshStatus();
                    this._logWindow.displayAutoAffectedStatus(battler);
                    this._logWindow.displayRegeneration(battler);
                }, this);
            }
            this.allBattleMembers().forEach(function(battler) {
            	if (loop) {
                    if (battler.isDead()) {
                        battler._time = -1;
                    } else if (battler._queueCost === 0) {
                        battler.setActionState('undecided');
                        this.makeTurn(battler);
                        loop = false;
                    } else if (battler._time < battler._queueCost) {
                        if (battler.canMove()) {
                            battler._time += Math.max(Math.floor(battler.battleSpeed()/this.globalSpeed()),1);
                            if (battler._time >= battler._queueCost) {
                                battler._time = 0;
            	           		this.takeTurn(battler);
            		            loop = false;
            	            }
            	        }
            	    }
            	}
            }, this);
        } while (loop && this._phase === 'time' && Continuum.CDB.instant);
        this.refreshStatus();
    };

    BattleManager.getNextSubject = function() {
        return null;
    };

    BattleManager.isTime = function() {
        return this._phase === 'time';
    };

    Scene_Battle.prototype.startPartyCommandSelection = function() {
        this.refreshStatus();
        BattleManager._phase = 'time';
    };

    BattleManager.updateTurnEnd = function() {
        this._phase = 'time';
    };

    Continuum.CDB.BattleManager.update = BattleManager.update;
    BattleManager.update = function() {
        if (!this.isBusy() && !this.updateEvent() && this.isTime()) {
            this.addTime();
        } else {
            Continuum.CDB.BattleManager.update.call(this);  
        }
    };

    Continuum.CDB.Battler.onBattleStart = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function() {
        this._time = 0
        Continuum.CDB.Battler.onBattleStart.call(this);
    };

    Continuum.CDB.Battler.startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function() {
        Continuum.CDB.Battler.startBattle.call(this);
        $gameParty.makeActions();
        $gameTroop.makeActions();
        this.makeActionOrders();
        this._phase = 'start';
        this._actorIndex = -1;
    };

    BattleManager.makeTurn = function(battler) {
        BattleManager.refreshStatus();
        this._subject = battler;
        if (battler.isActor()) {
            battler.makeActions();
            if (battler.canInput()) {
                this._actorIndex = battler.index();
                battler.setActionState('inputting');
                this._phase = 'input';
            } else {
                this._phase = 'time';
            }
        } else if (battler.isEnemy()) {
            battler.makeActions();
            this._phase = 'time';
        }
    };

    BattleManager.takeTurn = function(battler) {
        BattleManager.refreshStatus();
        this._subject = battler;
        this._phase = 'turn';
    };

    BattleManager.selectNextCommand = function() {
        do {
            if (!this.actor() || !this.actor().selectNextCommand()) {
                $gameParty.requestMotionRefresh();
                if (this.actor() !== null) {
                    this.actor().setActionState('waiting');
                    this._phase = 'time';
                    break;
                }
                this._phase = 'turn';
                break;
            }
        } while (!this.actor().canInput());
    };

	Game_Enemy.prototype.selectAllActions = function(actionList) {
	    var ratingMax = Math.max.apply(null, actionList.map(function(a) {
	        return a.rating;
	    }));
	    var ratingZero = ratingMax - 3;
	    actionList = actionList.filter(function(a) {
	        return a.rating > ratingZero;
	    });
	    var rand = Math.random()
	    for (var h = 0; h < this.actionBias(); h++) {
	    	rand *= Math.random()
	    }
	    var num = this.numActions();
	    var value = Math.floor(rand*num)
	    if (this.highBias()) {
	    	value = num - value;
	    } else {
	    	value += 1;
	    }
	    for (var i = 0; i < value; i++) {
	        this.action(i).setEnemyAction(this.selectAction(actionList, ratingZero));
    		this._queueLength++;
	    }
	    this._queueCost = this.makeQueueCost()
	};

	Game_Enemy.prototype.actionBias = function() {
		if (this.enemy().meta && typeof this.enemy().meta.action_bias !== 'undefined') {
			return Number(this.enemy().meta.action_bias)
		}
		return Continuum.CDB.actionBias;
	};

	Game_Enemy.prototype.highBias = function() {
		if (this.enemy().meta && typeof this.enemy().meta.high_bias !== 'undefined') {
			return true
		}
		if (this.enemy().meta && typeof this.enemy().meta.low_bias !== 'undefined') {
			return false
		}
		return Continuum.CDB.highBias;
	};

	Window_Base.prototype.drawQueueIcons = function(actor, x, y, width) {
	    width = width || 160;
	    var icons = actor.queueIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
	    for (var i = 0; i < icons.length; i++) {
	        this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
	    }
	};

	Window_Base.prototype.drawQueueGauge = function(actor, x, y, width) {
	    width = width || 160;
	    var gauges = actor.queueRates()
	    var length = Math.min(gauges.length,Math.floor(width / Window_Base._iconWidth))
	    for (var i = 0; i < length; i++) {
		    var color = this.textColor(Continuum.CDB.gaugeColor);
		    this.drawGauge(x+(i*Window_Base._iconWidth), y, Window_Base._iconWidth, gauges[i], color, color);
	    }
	};

	Game_BattlerBase.prototype.queueIcons = function() {
		var icons = []
			this._actions.forEach(function(action) {
				if (action.item()) {
					icons.push(action.item().iconIndex)
				}
			})
	    return icons.filter(function(iconIndex) {
	        return iconIndex > 0;
	    });
	};

	Game_Enemy.prototype.queueIcons = function() {
		var icons = []
		if (Continuum.CDB.enemyIcons < 0) {
		} else if (Continuum.CDB.enemyIcons === 0) {
			icons = Game_BattlerBase.prototype.queueIcons.call(this);
		} else {
			this._actions.forEach(function(action) {
				if (action.item()) {
					icons.push(Continuum.CDB.enemyIcons)
				}
			})
		}
	    return icons
	};

	Window_Base.prototype.drawIconBackdrop = function(actor, x, y, width) {
	    width = width || 160;
	    for (var i = 0; i < Math.floor(width / Window_Base._iconWidth); i++) {
	        this.drawIcon(16, x + Window_Base._iconWidth * i, y + 2);
	    }
	};

	Window_BattleStatus.prototype.drawItem = function(index) {
	    var actor = $gameParty.battleMembers()[index];
	    this.drawBasicArea(this.basicAreaRect(index), actor);
	    this.drawGaugeArea(this.gaugeAreaRect(index), actor);
	};

	Window_BattleStatus.prototype.drawBasicArea = function(rect, actor) {
	    this.drawActorName(actor, rect.x, rect.y, rect.width-168);
	    this.drawIconBackdrop(actor, rect.width-160, rect.y, 160);
	    this.drawQueueIcons(actor, rect.width-160, rect.y, 160);
	    this.drawQueueGauge(actor, rect.width-160, rect.y, 160);
	};

    Continuum.CDB.Sprite.initMembers = Sprite_Enemy.prototype.initMembers;
    Sprite_Enemy.prototype.initMembers = function() {
        Continuum.CDB.Sprite.initMembers.call(this);
        this._timeGauge = null;
    };

    Continuum.CDB.Sprite.updatebitmap = Sprite_Enemy.prototype.updateBitmap;
    Sprite_Enemy.prototype.updateBitmap = function() {
        Continuum.CDB.Sprite.updatebitmap.call(this);
        if (this._timeGauge === null && typeof this.bitmap !== 'undefined' && this.bitmap !== null && this.bitmap.height !== 0) {
            this._timeGauge = new Window_Base();
            var y = 0;
            var width = 160;
            if (this.bitmap.width <= 1) {
                this._timeGauge.initialize(width / 2, y, width + 36, this._timeGauge.lineHeight() + 2 * this._timeGauge.standardPadding() + 26);
                this._timeGauge.scale.x *= -1;
            } else {
                this._timeGauge.initialize(-width / 2, y, width + 36, this._timeGauge.lineHeight() + 2 * this._timeGauge.standardPadding() + 26);
            }
            this._timeGauge.padding = 0;
            this._timeGauge.margin = 0;
            this._timeGauge.backOpacity = 0;
            this._timeGauge.opacity = 0;
            this._timeGauge.hideBackgroundDimmer();
            this._timeGauge.contents.paintOpacity = 200;
            this.addChild(this._timeGauge);
        }
        if (this._timeGauge !== null && this._battler !== null) {
            this._timeGauge.contents.clear();
	        if (!this._battler.isDead() && !this._battler.isHidden()) {
	        	if (Continuum.CDB.enemyIcons >= 0) {
	    			this._timeGauge.drawIconBackdrop(this._battler, 0, 12, 160);
	    		}
	    		this._timeGauge.drawQueueIcons(this._battler, 0, 12, 160);
	            this._timeGauge.drawQueueGauge(this._battler, 0, 12, 160);
            }
        }
    };

    Continuum.CDB.SkillList.drawSkillCost = Window_SkillList.prototype.drawSkillCost
    Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
    	if (Imported.YEP_SkillCore) {
    		var dw = Continuum.CDB.SkillList.drawSkillCost.call(this,skill,x,y,width)
    		return dw
    	} else {
    		Continuum.CDB.SkillList.drawSkillCost.call(this,skill,x,y,width)
		   	this.changeTextColor(this.textColor(Continuum.CDB.gaugeColor));
			if (typeof skill.meta.time !== 'undefined') {
				this.drawText(skill.meta.time, x, y, width, 'center');
			} else {
				this.drawText(Continuum.CDB.defaultCastTime, x, y, width, 'center');
			}
    	}
	};

    Continuum.CDB.SkillList.drawOtherCost = Window_SkillList.prototype.drawOtherCost
	Window_SkillList.prototype.drawOtherCost = function(skill, wx, wy, dw) {
		var dw = Continuum.CDB.SkillList.drawOtherCost.call(this, skill, wx, wy, dw)
		dw = this.drawTimeCost(skill, wx, wy, dw)
		return dw
	};

	Window_SkillList.prototype.drawTimeCost = function(skill, wx, wy, dw) {
		var timecost = (typeof skill.meta.time !== 'undefined') ? Number(skill.meta.time) : Continuum.CDB.defaultCastTime;
	    if (timecost <= 0) return dw;
		var text = String(timecost)
	    if (Continuum.CDB.costIcon > 0) {
	      var iw = wx + dw - Window_Base._iconWidth;
	      this.drawIcon(Continuum.CDB.costIcon, iw, wy + 2);
	      dw -= Window_Base._iconWidth + 2;
	    }
	    text += Continuum.CDB.costText
	    this.changeTextColor(this.textColor(Continuum.CDB.gaugeColor));
	    this.contents.fontSize = Yanfly.Param.SCCMpFontSize;
	    this.drawText(text, wx, wy, dw, 'right');
	    var returnWidth = dw - this.textWidth(text) - Yanfly.Param.SCCCostPadding;
	    this.resetFontSettings();
	    return returnWidth;
	};

	Continuum.CDB.BattleManager.endAction = BattleManager.endAction
	BattleManager.endAction = function() {
		Continuum.CDB.BattleManager.endAction.call(this)
		this._action.subject()._lastUsedAction = this._action.item()
	};

})();