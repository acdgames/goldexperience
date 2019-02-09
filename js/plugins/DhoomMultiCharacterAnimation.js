//=============================================================================
// DhoomMultiCharacterAnimation.js
//=============================================================================
var Imported = Imported || {};
Imported.Dhoom_MultiCharAnim = true;

var Dhoom = Dhoom || {};
Dhoom.MultiCharAnim = Dhoom.MultiCharAnim || {};
/*:
 * @plugindesc Dhoom MultiCharAnim v1.0 - 30/11/2018
 * @author DrDhoom - drd-workshop.blogspot.com
 *
 * @help 
 */

Dhoom.Parameters = PluginManager.parameters('DhoomMultiCharacterAnimation');
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
// Game_CharacterBase
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.MultiCharAnim.Game_CharacterBase_requestAnimation = Game_CharacterBase.prototype.requestAnimation;
Game_CharacterBase.prototype.requestAnimation = function (animationId) {
    Dhoom.MultiCharAnim.Game_CharacterBase_requestAnimation.call(this, animationId);
    if (SceneManager._scene instanceof Scene_Map) SceneManager._scene.startCharacterRequestAnimation(this);
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Scene_Map
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Scene_Map.prototype.startCharacterRequestAnimation = function (character, array) {
    if (!array) array = this.children;
    array.forEach(function (object) {
        if (object.children) this.startCharacterRequestAnimation(character, object.children);
        if (object instanceof Sprite_Character && object._character === character) {
            object.setupAnimation();
            return;
        }        
    }, this);
};