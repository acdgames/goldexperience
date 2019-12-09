//-----------------------------------------------------------------------------
// copyright 2019 Doktor_Q all rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc SRPG skills with no targets
 * @author Dr. Q
 *
 * @help
 * Skills with the scope of "none" can now target
 * unoccupied cells on the map. The user is considered
 * the target for the purposes of SRPG_Core.
 *
 * Combined with common events, script calls, and other plugins.
 * it becomes possible to make skills that teleport the user,
 * summon allies, or other such effects.
 *
 * skill notetags:
 * <srpgTargetTag:X> # you can target cells with terrain tags equal to or less than X
 * <srpgTargetTag:-1> # you can target cells with terrain tags less than or equal to your srpgThroughTag
 *
 */

(function(){
	var coreParameters = PluginManager.parameters('SRPG_core');
	var _srpgPredictionWindowMode = Number(coreParameters['srpgPredictionWindowMode'] || 1);

	var parameters = PluginManager.parameters('SRPG_NoTargetSkill');

//====================================================================
// utility functions and checks
//====================================================================

	// (utility) check if a position is open
	Game_Map.prototype.positionIsOpen = function(x, y) {
		var empty = true;
		this.eventsXy(x, y).forEach(function(event) {
			if (!event.isErased() && event.isType() && event.isType() !== 'unitEvent') {
				empty = false;
			}
		});
		return empty;
	};

	// (utility function) checks if a position is within the current skill's range
	Game_System.prototype.positionInRange = function(x, y) {
		var area = $gameTemp.moveList();
		for (var i = 0; i < area.length; i++) {
			if (area[i][0] == x && area[i][1] == y) return true;
		}
		return false;
	};

	// check if a position is within range and unoccupied
	Game_System.prototype.positionIsValidTarget = function(x, y) {
		var user = this.EventToUnit($gameTemp.activeEvent().eventId())[1];
		if (!user) return false;
		var action = user.currentAction();
		if (!action) return false;
		var tag = action.item().meta.srpgTargetTag
		if (tag < 0 ) tag = user.srpgThroughTag();

		if (action.isForOpponent() || action.isForFriend()) return false;
		if ($gameMap.terrainTag(x, y) > 0 && $gameMap.terrainTag(x, y) > tag) return false;
		return ($gameSystem.positionInRange(x, y) && $gameMap.positionIsOpen(x, y));
	}

//====================================================================
// select empty cells
//====================================================================

	// allow selection of empty spaces
	var _selection_triggerAction = Game_Player.prototype.triggerAction;
	Game_Player.prototype.triggerAction = function() {
		if ($gameSystem.isSRPGMode() &&(Input.isTriggered('ok') || TouchInput.isTriggered())) {
			if ($gameSystem.isSubBattlePhase() === 'actor_target') {
				var x = $gamePlayer.posX();
				var y = $gamePlayer.posY();
				if ($gameSystem.positionIsValidTarget(x, y)) {
					$gameTemp.selectUser();
					return;
				}
			}
		}
		_selection_triggerAction.call(this);
	}

	// select the user as the target, for non-target skills
	Game_Temp.prototype.selectUser = function() {
		var event = $gameTemp.activeEvent();
		var target = $gamePlayer;
		var battlerArray = $gameSystem.EventToUnit(event.eventId());
		var item = battlerArray[1].currentAction().item();

		SoundManager.playOk();
		$gameSystem.clearSrpgActorCommandStatusWindowNeedRefresh();
		if (_srpgPredictionWindowMode != 3) $gameSystem.setSrpgStatusWindowNeedRefresh(battlerArray);
		$gameSystem.setSrpgBattleWindowNeedRefresh(battlerArray, battlerArray);
		$gameTemp.setSrpgDistance($gameSystem.unitDistance(event, target));
		$gameTemp.setSrpgSpecialRange(event.srpgRangeExtention(target.posX(), target.posY(), event.posX(), event.posY(), item));
		$gameTemp.setTargetEvent(event);
		$gameSystem.setSubBattlePhase('battle_window');
	};

})();