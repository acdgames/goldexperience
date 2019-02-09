//=============================================================================
// DhoomChronoYEPAbsorptionBarrier.js
//=============================================================================
var Imported = Imported || {};
Imported.Dhoom_ChronoYEPAbsorp = true;

var Dhoom = Dhoom || {};
Dhoom.ChronoYEPAbsorp = Dhoom.ChronoYEPAbsorp || {};
/*:
 * @plugindesc Dhoom ChronoYEPAbsorp v1.0 - 14/12/2018
 * @author DrDhoom - drd-workshop.blogspot.com
 * 
 * @param Update Interval
 * @desc Absorption Barrier update interval in frame. Each update is 1 turn counter.
 * @type number
 * @min 0
 * @default 60
 *
 * @help 
 */

Dhoom.Parameters = PluginManager.parameters('DhoomChronoYEPAbsorptionBarrier');
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

Dhoom.ChronoYEPAbsorp.updateInterval = Dhoom.loadParam('Update Interval');

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Battler
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Game_Battler.prototype.updateAbsorptionBarrierRegeneration = function () {
    if (this.isAlive()) {
        this._absorptionBarrierUpdateInterval = this._absorptionBarrierUpdateInterval || Dhoom.ChronoYEPAbsorp.updateInterval;
        this._absorptionBarrierUpdateInterval--;
        if (this._absorptionBarrierUpdateInterval <= 0) {
            this.updateBarrierTurns();
            this.regenBarriers();
        }
    }
};

Dhoom.ChronoYEPAbsorp.Game_Battler_startBarrierAnimation = Game_Battler.prototype.startBarrierAnimation;
Game_Battler.prototype.startBarrierAnimation = function () {
    if ($gameSystem.isNonBattleMode()) {
        Dhoom.ChronoYEPAbsorp.Game_Battler_startBarrierAnimation.call(this);
    } else {
        if (this.barrierPoints() > 0) {
            if (Yanfly.Param.ABRAni1 > 0) this.getSpriteCharacter().startAnimation($dataAnimations[Yanfly.Param.ABRAni1]);
        } else {
            if (Yanfly.Param.ABRAni2 > 0) this.getSpriteCharacter().startAnimation($dataAnimations[Yanfly.Param.ABRAni2]);
        }
    }
};

Game_Battler.prototype.getSpriteCharacter = function () {
    if (SceneManager._scene instanceof Scene_Map) {
        var sprites = SceneManager._scene._spriteset._characterSprites;
        for (var i = 0; i < sprites.length; i++) {
            if (sprites[i]._character && sprites[i]._character.battler() === this) return sprites[i];
        }
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Sprite_Character
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoYEPAbsorp.Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function () {
    Dhoom.ChronoYEPAbsorp.Sprite_Character_update.call(this);
    this.updateBattlerChronoAbsorptionBarrier();
};

Sprite_Character.prototype.updateBattlerChronoAbsorptionBarrier = function () {
    if (this._character && this._character.battler() && !$gameSystem.isNonBattleMode() && !$gameMap.isEventRunning() && !$gameMessage.isBusy()) {
        this._character.battler().updateAbsorptionBarrierRegeneration();
    }
};