//-----------------------------------------------------------------------------
// copyright 2019 Doktor_Q all rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc SRPG script calls for making movement skills
 * @author Dr. Q
 *
 * @help
 * Script calls that can be put in damage formulas or lunatic notetags
 * to make skills that push, pull, move, and teleport
 *
 * Script calls:
 *
 * a.event() returns the event associated with the battler in SRPG mode
 *
 * a.push(b, distance) pushes b away from a
 * a.pull(b, distance) pulls b toward a
 *
 * a.forward(distance) moves a in the direction they're facing
 * a.back(distance) moves a in the opposite direction they're facing
 *
 * a.approach(b) moves a to the open space nearest to b (best for skills that target in a straight line)
 * a.swap(b) switches the positions of a and b
 *
 * a.pushAoE(b, distance) pushes b away from the center of the AoE (requires AreaAttack.js)
 * a.pullAoE(b, distance) pulls b toward the center of the AoE (requires AreaAttack.js)
 *
 * If you specify a distance but the route is blocked, the script call returns the 
 * number of spaces remaining.
 *
 * Providing a negative distance will have no effect.
 *
 * Damage formula examples:
 * a.push(b, 1); a.atk - b.def
 * This will push the target 1 space and deal damage
 *
 * a.forward(5) + a.atk - b.def
 * this will move the user up to 5 spaces forward. If he hits an obstacle before moving 5 spaces,
 * he does 1 additional damage per remaining space.
 *
 */

(function(){
	// get parameter values
	var parameters = PluginManager.parameters('SRPG_MoveEffects');

//====================================================================
// Utility effects for getting information
//====================================================================

	// get the event for a general battler
	Game_BattlerBase.prototype.event = function() {
		var currentBattler = this;
		var eventId = 0;
		$gameSystem._EventToUnit.forEach(function (battleAry, index) {
			if (battleAry[1] === currentBattler) eventId = index;
		});
		return $gameMap.event(eventId);
	};

	// get the event for an actor specifically
	Game_Actor.prototype.event = function() {
		var eventId = $gameSystem.ActorToEvent(this.actorId())
		return $gameMap.event(eventId);
	};

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

	// find the direction to a fixed point, discounting obstacles
	Game_Character.prototype.dirTo = function(x, y) {
		var dir = 5;
		var dx = this.posX() - x;
		var dy = this.posY() - y;
		if (Math.abs(dx) > Math.abs(dy)) {
			dir = dx > 0 ? 4 : 6;
		} else if (dy !== 0) {
			dir = dy > 0 ? 8 : 2;
		}
		return dir;
	};

//====================================================================
// SRPG-map-aware movement functions
//====================================================================

	// try to move a character, stopping if it hits an obstacle, and returns the remaining distance
	Game_Character.prototype.srpgTryMove = function(dir, distance, instant) {
		// set the starting position
		var x = this.posX();
		var y = this.posY();
		var tag = $gameSystem.EventToUnit(this.eventId())[1].srpgThroughTag();

		// check the clear path
		for (var i = 0; i < distance; i++) {
			if (!this.srpgMoveCanPass(x, y, dir, tag)) break;
			var newX = $gameMap.roundXWithDirection(x, dir);
			var newY = $gameMap.roundYWithDirection(y, dir);
			if (!$gameMap.positionIsOpen(newX, newY)) break;
			x = newX;
			y = newY;
		}

		// move to the new position
		this._realX = instant ? x : this.posX();
		this._realY = instant ? y : this.posY();
		this._x = x;
		this._y = y;
		return distance - i;
	};

	// move to the nearest positiong to another character
	Game_Character.prototype.srpgApproach = function(x, y, instant) {
		// get the starting properties
		var tag = $gameSystem.EventToUnit(this.eventId())[1].srpgThroughTag();
		var dir = 10-this.dirTo(x, y);
		var distance = Math.max(Math.abs(this.posX()-x), Math.abs(this.posY()-y));

		// check the clear path
		for (var i = 0; i < distance; i++) {
			var pass = this.srpgMoveCanPass(x, y, dir, tag);
			x = $gameMap.roundXWithDirection(x, dir);
			y = $gameMap.roundYWithDirection(y, dir);
			if (pass && $gameMap.positionIsOpen(x, y)) break;
		}

		// move to the new position
		this._realX = instant ? x : this.posX();
		this._realY = instant ? y : this.posY();
		this._x = x;
		this._y = y;
	};

//====================================================================
// Common movement effects
//====================================================================

	// move forward
	Game_BattlerBase.prototype.forward = function(distance) {
		var userEvent = this.event();
		if (!userEvent) return 0;
		return userEvent.srpgTryMove(userEvent.direction(), distance);
	};
	// move backward
	Game_BattlerBase.prototype.back = function(distance) {
		var userEvent = this.event();
		if (!userEvent) return 0;
		return userEvent.srpgTryMove(10-userEvent.direction(), distance);
	};
	// push target away
	Game_BattlerBase.prototype.push = function(target, distance) {
		var userEvent = this.event();
		var targetEvent = target.event();
		if (!userEvent || !targetEvent) return 0;
		return targetEvent.srpgTryMove(10-targetEvent.dirTo(userEvent.posX(), userEvent.posY()), distance);
	};
	// pull target in
	Game_BattlerBase.prototype.pull = function(target, distance) {
		var userEvent = this.event();
		var targetEvent = target.event();
		if (!userEvent || !targetEvent) return 0;
		return targetEvent.srpgTryMove(targetEvent.dirTo(userEvent.posX(), userEvent.posY()), distance);
	};

	// teleport next to the target
	Game_BattlerBase.prototype.approach = function(target) {
		var userEvent = this.event();
		var targetEvent = target.event();
		if (!userEvent || !targetEvent) return;
		userEvent.srpgApproach(targetEvent.posX(), targetEvent.posY(), true);
	};
	// swap positions
	Game_BattlerBase.prototype.swap = function(target) {
		var userEvent = this.event();
		var targetEvent = target.event();
		if (!userEvent || !targetEvent) return;
		userEvent.swap(targetEvent);
	};

	// push target away (from an AoE)
	Game_BattlerBase.prototype.pushAoE = function(target, distance) {
		var targetEvent = target.event();
		if (!targetEvent) return 0;
		return targetEvent.srpgTryMove(10-targetEvent.dirTo($gameTemp.areaX(), $gameTemp.areaY()), distance);
	};
	// pull target in (to an AoE)
	Game_BattlerBase.prototype.pullAoE = function(target, distance) {
		var targetEvent = target.event();
		if (!targetEvent) return 0;
		return targetEvent.srpgTryMove(targetEvent.dirTo($gameTemp.areaX(), $gameTemp.areaY()), distance);
	};

})();