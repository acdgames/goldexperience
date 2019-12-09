//-----------------------------------------------------------------------------
// copyright 2019 Doktor_Q all rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc SRPG control and display improvements
 * @author Dr. Q
 *
 * @param Hide no EXP
 * @desc Don't show the exp bar if you didn't get any
 * @type boolean
 * @on YES
 * @off NO
 * @default true
 *
 *
 * @param Hide Self Target
 * @desc Hide the target window when self-targeting
 * @type boolean
 * @on YES
 * @off NO
 * @default false
 *
 *
 * @param Cursor-Style Movement
 * @desc Make the cursor move like a cursor
 * @type boolean
 * @on YES
 * @off NO
 * @default true
 * 
 * @param Cursor Delay
 * @desc Frame delay for cursor movement
 * @parent Cursor-Style Movement
 * @type number
 * @default 10
 *
 * @param Cursor Speed
 * @desc Cursor movement speed- uses RMMV event speeds
 * @parent Cursor-Style Movement
 * @type number
 * @default 6
 *
 *
 * @param Animate Cursor
 * @desc Makes the cursor animate automatically
 * @type boolean
 * @on YES
 * @off NO
 * @default true
 *
 * @param Animate Delay
 * @desc Frame delay between cursor frames
 * @parent Animate Cursor
 * @type number
 * @default 15
 *
 *
 * @param Quick Target
 * @desc Use Page Up / Page Down / Tab to cycle through valid selections
 * @type boolean
 * @on YES
 * @off NO
 * @default true
 * 
 * @param Auto Quick Target
 * @desc Cursor starts on a valid target
 * @parent Quick Target
 * @type boolean
 * @on YES
 * @off NO
 * @default true
 *
 * @param Auto Quick Actor
 * @desc Cursor goes to the next actor automatically
 * @parent Quick Target
 * @type boolean
 * @on YES
 * @off NO
 * @default true
 *
 *
 * @help
 * An assortment of changes and settings to make combat
 * easier to play
 * 
 * Options:
 * - Hide no EXP: Don't show the experience bar after
 *   battles that didn't grant experience, and hides
 *   the pop-up entirely if there were no rewards.
 *
 * - Hide Self Target: Only shows one status window for
 *   skills that target the user.
 *
 * - Cursor-Style Movement: The cursor moves quickly from
 *   one cell to the next with a sound effect. Cursor Delay
 *   controls how long it pauses after each movement, and
 *   Cursor Speed determines just how quickly it moves.
 *   This may conflict with SRPG_etcMod's cursor-style movement
 *
 * - Animate Cursor: Makes the map cursor animate even when
 *   not moving. Animate Delay controls how long it stays
 *   on each frame.
 *
 * - Quick Target: Pressing page up, page down, or tab
 *   cycles through controllable units on the actor phase.
 *   While targeting, it cycles through valid targets in range.
 *   Auto Quick Target will start the cursor on the first valid
 *   selection. Auto Quick Actor starts the cursor on the next
 *   actor when you finish an action.
 *
 * Automatic changes:
 * - Cancelling out of targeting, action select, or movement
 *   moves the cursor back to the actor
 *
 * - Status windows can also be closed with cancel/menu
 *
 * Known issues:
 * - Exp bar still appears when you get money or items, even if
 *   you didn't gain any experience.
 *
 */

(function(){
	// parameters
	var parameters = PluginManager.parameters('SRPG_Q_UX+');
	var hideReward = !!eval(parameters['Hide no EXP']);
	var hideSelfTarget = !!eval(parameters['Hide Self Target']);
	var cursorStyle = !!eval(parameters['Cursor-Style Movement']);
	var cursorDelay = Number(parameters['Cursor Delay']) || 10;
	var cursorSpeed = Number(parameters['Cursor Speed']) || 6;
	var animateCursor = !!eval(parameters['Animate Cursor']);
	var animateDelay = Number(parameters['Animate Delay']) || 15;
	var quickTarget = !!eval(parameters['Quick Target']);
	var autoTarget = !!eval(parameters['Auto Quick Target']);
	var autoActor = !!eval(parameters['Auto Quick Actor']);

//====================================================================
// don't show exp rewards if you didn't get any
//====================================================================

	// rewritten victory processing, optionally skips reward window if there's no rewards
	BattleManager.processSrpgVictory = function() {
		if ($gameTroop.members()[0] && $gameTroop.isAllDead()) {
			$gameParty.performVictory();
		}
		this.makeRewards();
		// only show the rewards if there's something to show
		if (!hideReward || this._rewards.exp > 0 || this._rewards.gold > 0 || this._rewards.items.length > 0) {
			this._srpgBattleResultWindow.setRewards(this._rewards);
			var se = {}; // TODO: I'm pretty sure I can make this a parameter
			se.name = 'Item3';
			se.pan = 0;
			se.pitch = 100;
			se.volume = 90;
			AudioManager.playSe(se);
			this._srpgBattleResultWindow.open();
			this.gainRewards();
		}
		// otherwise, skip right to the end
		else {
			this.endBattle(3);
		}
	};

	// don't show the xp bar if no xp was gained
	// (protected from crashing if closures are misused)
	var Window_SrpgBattleResult = Window_SrpgBattleResult || null;
	if (Window_SrpgBattleResult) {
		Window_SrpgBattleResult.prototype.drawContents = function() {
			var lineHeight = this.lineHeight();
			var pos = 0;
			
			// check for exp
			if (this._rewards.exp > 0) {
				this.drawGainExp(6, lineHeight * pos);
				pos += 2;
			} else {
				this._changeExp = 0;
			}
			
			// check for gold
			if (this._rewards.gold > 0) {
				this.drawGainGold(6, lineHeight * pos);
				pos += 1;
			}
			
			// items are last, so they just happen
			this.drawGainItem(0, lineHeight * pos);
		};
	}

//====================================================================
// only show one window when self-targeting
//====================================================================

	// hide the second status window for self-target actions
	var _SRPG_SceneMap_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		_SRPG_SceneMap_update.call(this);
		if (!hideSelfTarget) return;
		var flag = $gameSystem.srpgBattleWindowNeedRefresh();
		if (flag[0] && flag[1][1] == flag[2][1]) {
			if (this._mapSrpgTargetWindow.isOpen() || this._mapSrpgTargetWindow.isOpening()) {
				this._mapSrpgTargetWindow.close();
			}
		}
	}

//====================================================================
// cursor-style movement
//====================================================================

	// Override cursor speed
	var _UX_player_realMoveSpeed = Game_Player.prototype.realMoveSpeed;
	Game_Player.prototype.realMoveSpeed = function() {
		if ($gameSystem.isSRPGMode() && cursorStyle) {
			return cursorSpeed;
		} else {
			return _UX_player_realMoveSpeed.call(this);
		}
	};

	// TODO: Find a better way to move the cursor around automatically, instead of using jump

	// don't bounce upward when using Jump to move the cursor around
	Game_Player.prototype.jumpHeight = function() {
		return $gameSystem.isSRPGMode() ? 0 : Game_CharacterBase.prototype.jumpHeight.call(this);
	};

	// move directly to the target location
	Game_Player.prototype.slideTo = function(x, y) {
		this.jump(x - this.x, y - this.y);
	};

	// override movement to act more like a cursor
	var _UX_moveByInput = Game_Player.prototype.moveByInput;
	Game_Player.prototype.moveByInput = function() {
		if ($gameSystem.isSRPGMode() && cursorStyle && !this.isMoving()) {
			// automatic movement
			if ($gameTemp.isAutoMoveDestinationValid()) {
				var x = $gameTemp.autoMoveDestinationX();
				var y = $gameTemp.autoMoveDestinationY();
				this.slideTo(x, y);
				$gameTemp.setAutoMoveDestinationValid(false);
			}
			// manual movement
			else if (this.canMove()) {
				this._cursorDelay = this._cursorDelay || 0;
				this._cursorDelay--;
				
				// mouse control (WIP)
				if ($gameTemp.isDestinationValid()) {
					var x = $gameTemp.destinationX();
					var y = $gameTemp.destinationY();
					if ((this.posX() != x || this.posY() != y) &&
							x >= 0 && x < $gameMap.width() && y >= 0 && y < $gameMap.height()) {
						SoundManager.playCursor();
						this.slideTo(x, y);
						this.setMovementSuccess(true);
					}
				} else if (this._cursorDelay <= 0) { // key control
					var direction = this.getInputDirection();
					if (direction > 0 && this.canPass(this._x, this._y, direction)) {
						SoundManager.playCursor();
						$gameTemp.clearDestination();
						this.setDirection(direction);
						this.executeMove(direction);
						this._cursorDelay = cursorDelay;
					}
				}
				return;
			}
		}
		_UX_moveByInput.call(this);
	}

//====================================================================
// cursor animates all the time
//====================================================================

	// cursor animates even while static
	_UX_player_hasStepAnime = Game_Player.prototype.hasStepAnime;
	Game_Player.prototype.hasStepAnime = function() {
		if ($gameSystem.isSRPGMode() && animateCursor) return true;
		return _UX_player_hasStepAnime.call(this);
	};

	// custom cursor animation rate
	_UX_player_animationWait = Game_Player.prototype.animationWait;
	Game_Player.prototype.animationWait = function() {
		if ($gameSystem.isSRPGMode() && animateCursor) return animateDelay;
		return _UX_player_animationWait.call(this);
	};

//====================================================================
// cursor automatically moves as needed
//====================================================================

	// Cancel while selecting movement or target
	var _UX_updateCallMenu = Scene_Map.prototype.updateCallMenu;
	Scene_Map.prototype.updateCallMenu = function() {
		if ($gameSystem.isSRPGMode() && !$gameSystem.srpgWaitMoving()) {
			// return cursor when deselecting
			if (($gameSystem.isSubBattlePhase() === 'actor_move' ||
				$gameSystem.isSubBattlePhase() === 'actor_target' ||
				$gameSystem.isSubBattlePhase() === 'actor_targetArea') &&
				this.isMenuCalled()) {
				var event = $gameTemp.activeEvent();
				$gamePlayer.slideTo(event.posX(), event.posY());
			}
			// page through valid selections
			else if (quickTarget && $gameSystem.isSubBattlePhase() === 'normal') {
				this.updateQuickSelection("actor");
			}
			else if (quickTarget && ($gameSystem.isSubBattlePhase() === 'actor_target' ||
			$gameSystem.isSubBattlePhase() === 'actor_targetArea')) {
				this.updateQuickSelection("target");
			}
			// close status windows with cancel
			else if ($gameSystem.isSubBattlePhase() === 'status_window' && this.isMenuCalled()) {
				$gameSystem.clearSrpgStatusWindowNeedRefresh();
				SoundManager.playCancel();
				$gameTemp.clearActiveEvent();
				$gameSystem.setSubBattlePhase('normal');
				$gameTemp.clearMoveTable();
				return;
			}
		}
		_UX_updateCallMenu.call(this);
	};

	// Cancel while selecting action
	var _UX_selectPreviousActorCommand = Scene_Map.prototype.selectPreviousActorCommand;
	Scene_Map.prototype.selectPreviousActorCommand = function() {
		_UX_selectPreviousActorCommand.call(this);
		var event = $gameTemp.activeEvent();
		$gamePlayer.slideTo(event.posX(), event.posY());
	};

//====================================================================
// cycle through valid selections
//====================================================================

	// (utility function) checks if an event is an actor the player can control
	Game_System.prototype.eventIsUsableActor = function(event) {
		if (!event) return false;
		var unitArray = this.EventToUnit(event.eventId());
		if (unitArray && (unitArray[0] === 'actor') && unitArray[1].canInput()) {
			return true;
		}
		return false;
	};

	// (utility function) checks if an event is within the current skill's range
	if (!Game_System.prototype.eventIsInRange) {
		Game_System.prototype.eventIsInRange = function(event) {
			if (!event) return false;
			var actor = this.EventToUnit($gameTemp.activeEvent().eventId())[1];
			if (!actor) return false;
			var action = actor.currentAction();
			if (!action) return false;
			
			// special handling for AoEs
			if (Game_Battler.prototype.srpgSkillAreaRange &&
			actor.srpgSkillAreaRange(action.item()) > 0 &&
			$gameSystem.isSubBattlePhase() !== 'actor_targetArea') {
				return this.eventIsInArea(event, actor.srpgSkillAreaRange(action.item()));
			}
			
			var dist = this.unitDistance($gameTemp.activeEvent(), event);
			var maxRange = actor.srpgSkillRange(action.item());
			var minRange = actor.srpgSkillMinRange(action.item());
			
			if (dist > maxRange || dist < minRange) {
				return false;
			}
			
			if (!$gameTemp.activeEvent().srpgRangeExtention($gameTemp.activeEvent().posX(), $gameTemp.activeEvent().posY(),
				event.posX(), event.posY(), action.item())) {
				return false;
			}
			return true;
		};
	}

	// (utility function) checks if an event is within the current skill's area of effect
	if (!Game_System.prototype.eventIsInArea) {
		Game_System.prototype.eventIsInArea = function(event, range) {
			if (!Game_Battler.prototype.srpgSkillAreaRange) return true;
			
			var dist = Math.abs(event.posX() - $gameTemp.areaX()) + Math.abs(event.posY() - $gameTemp.areaY())
			
			if (dist > range) {
				return false;
			}
			return true;
		};
	}

	// (utility function) checks if an event is a valid target for the current skill
	if (!Game_System.prototype.eventIsValidTarget) {
		Game_System.prototype.eventIsValidTarget = function(event) {
			if (!event || event.isErased()) return false;
			var unitArray = this.EventToUnit(event.eventId());
			if (!unitArray) return false;
			var action = this.EventToUnit($gameTemp.activeEvent().eventId())[1].currentAction();
			if (!action) return false;
			
			if (((unitArray[0] === 'enemy' && action.isForOpponent()) ||
				(unitArray[0] === 'actor' && action.isForFriend()))) {
				return true;
			}
		};
	}

	// cycle between valid event selections
	Scene_Map.prototype.updateQuickSelection = function(type) {
		// find our current event
		var id = 0;
		var events = $gameMap.eventsXyNt($gamePlayer.x, $gamePlayer.y);
		if (events && events.length > 0) {
			id = events[0].eventId();
		}
		// scan forward
		if (Input.isTriggered('pagedown') || Input.isTriggered('tab')) {
			SoundManager.playCursor();
			$gameTemp.findSelection(type, id);
		}
		// scan backward
		else if (Input.isTriggered('pageup')) {
			SoundManager.playCursor();
			$gameTemp.findSelection(type, id, true);
		}
	};

	// automatically highlight the first target when you start targeting
	var _UX_startActorTargetting = Scene_Map.prototype.startActorTargetting;
	Scene_Map.prototype.startActorTargetting = function() {
		_UX_startActorTargetting.call(this);
		if (autoTarget) {
			$gameTemp.findSelection("target");
		}
	};

	// automatically highlight the first target within an AoE
	var _Game_Player_triggerAction = Game_Player.prototype.triggerAction;
	Game_Player.prototype.triggerAction = function() {
		var wasAoE = (autoTarget && $gameSystem.isSubBattlePhase() === 'actor_targetArea');
		_Game_Player_triggerAction.call(this);
		if (wasAoE && $gameSystem.isSubBattlePhase() === 'actor_target') $gameTemp.findSelection("target");
	}

	// after completing an action, move the cursor to the next actor
	var _UX_srpgAfterAction = Scene_Map.prototype.srpgAfterAction;
	Scene_Map.prototype.srpgAfterAction = function() {
		_UX_srpgAfterAction.call(this);
		if (autoActor) {
			$gameTemp.findSelection("actor");
		}
	}

	// find a selectable event for the context (returns the event ID)
	Game_Temp.prototype.findSelection = function(type, id, reverse) {
		var max = $gameMap.isMaxEventId()+1;
		var step = reverse ? max-1 : 1;
		id = (+id) || 0;
		
		for (var off = (id+step)%max; off != id; off = (off+step)%max) {
			if (off == 0) continue;
			var event = $gameMap.event(off);
			if ((type === "actor" && $gameSystem.eventIsUsableActor(event)) ||
			(type === "target" && $gameSystem.eventIsValidTarget(event) && $gameSystem.eventIsInRange(event))) {
				this.setAutoMoveDestinationValid(true);
				this.setAutoMoveDestination(event.posX(), event.posY());
				return off;
			}
		}
	};

})();