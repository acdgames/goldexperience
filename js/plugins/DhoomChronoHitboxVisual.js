//=============================================================================
// DhoomChronoHitboxVisual.js
//=============================================================================
var Imported = Imported || {};
Imported.Dhoom_ChronoHitboxVisual = true;

var Dhoom = Dhoom || {};
Dhoom.ChronoHitboxVisual = Dhoom.ChronoHitboxVisual || {};
/*:
 * @plugindesc Dhoom ChronoHitboxVisual v1.0 - 11/12/2018
 * @author DrDhoom - drd-workshop.blogspot.com
 * 
 * @param Character Hitbox
 * @desc Character hitbox switch and color setting.
 * @type struct<hitboxSetting>
 * @default {"switch":"0","color":"#2e7ba8","opacity":"128"}
 * 
 * @param Tool Hitbox
 * @desc Tool event hitbox switch and color setting.
 * @type struct<hitboxSetting>
 * @default {"switch":"0","color":"#f8ab51","opacity":"128"}
 *
 * @help Event Comment:
 * hitbox_visual : COLORHEXCODE : OPACITY : SWITCHID
 * - Use this comment to change hitbox color, opacity, and switch for specific event.
 */

/*~struct~hitboxSetting:
@param switch
@text Switch ID
@desc Switch ID to show this hitbox. 0 = Always on.
@type switch
@default 0

@param color
@text Box Color
@desc Box color hex code.
@type text
@default #FFFFFF

@param opacity
@text Box Opacity
@desc Box opacity.
@type number
@min 0
@max 255
@default 128
*/

Dhoom.Parameters = PluginManager.parameters('DhoomChronoHitboxVisual');
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

Dhoom.ChronoHitboxVisual.hitboxCharacter = Dhoom.loadParam('Character Hitbox');
Dhoom.ChronoHitboxVisual.hitboxTool = Dhoom.loadParam('Tool Hitbox');

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Event
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoHitboxVisual.Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
Game_Event.prototype.setupPageSettings = function () {
    Dhoom.ChronoHitboxVisual.Game_Event_setupPageSettings.call(this);
    this.processHitboxVisualComments();
};

Game_Event.prototype.processHitboxVisualComments = function () {
    this.list().forEach(function (list) {
        if (list.code === 108) {
            var comment = list.parameters[0].toLowerCase().split(' : ');
            if (comment[0] === 'hitbox_visual') {
                this._hitboxColor = comment[1];
                this._hitboxOpacity = Number(comment[2]);
                this._hitboxSwitch = Number(comment[3]);
            }
        }
    }, this);
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Sprite_ChronoHitbox
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function Sprite_ChronoHitbox() {
    this.initialize.apply(this, arguments);
}

Sprite_ChronoHitbox.prototype = Object.create(Sprite.prototype);
Sprite_ChronoHitbox.prototype.constructor = Sprite_ChronoHitbox;

Sprite_ChronoHitbox.prototype.initialize = function (setting, character) {
    Sprite.prototype.initialize.call(this);
    this._character = character;
    this._setting = setting;
    this.opacity = setting.opacity;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.x = setting.x || 0;
    this.y = setting.y || 0;
    this.createBitmap();
    this.refresh();
    this.update();
};

Sprite_ChronoHitbox.prototype.createBitmap = function () {
    this._tempWidth = this._setting.width;
    this._tempHeight = this._setting.height;
    this.bitmap = new Bitmap(this._setting.width, this._setting.height);
};

Sprite_ChronoHitbox.prototype.refresh = function () {
    this.bitmap.clear();
    this.bitmap.fillAll(this._setting.color);
};

Sprite_ChronoHitbox.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updateVisibility();
    this.updateBitmap();
    this.updatePosition();
};

Sprite_ChronoHitbox.prototype.updateVisibility = function () {
    this.visible = this._setting.switch ? $gameSwitches.value(this._setting.switch) : true;
};

Sprite_ChronoHitbox.prototype.updateBitmap = function () {
    if (this._setting.width !== this._tempWidth || this._setting.height !== this._tempHeight) {
        this.createBitmap();
        this.refresh();
    }
};

Sprite_ChronoHitbox.prototype.updatePosition = function () {
    if (this.parent) {
        this.y = -this.height / 2;
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Sprite_ChronoHitboxTool
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function Sprite_ChronoHitboxTool() {
    this.initialize.apply(this, arguments);
}

Sprite_ChronoHitboxTool.prototype = Object.create(Sprite_ChronoHitbox.prototype);
Sprite_ChronoHitboxTool.prototype.constructor = Sprite_ChronoHitboxTool;

Sprite_ChronoHitboxTool.prototype.createBitmap = function () {
    this._tempWidth = this._setting.width;
    this._tempHeight = this._setting.height;
    var tw = $gameMap.tileWidth();
    var th = $gameMap.tileHeight();
    var range = this._character._tool.range;
    var mode = this._character._tool.area;
    var w = 0;
    var h = 0;
    switch (mode) {
        case 0: case 1: case 3: case 4: case 6:
            w = tw * (1 + range * 2);
            h = th * (1 + range * 2);
            break;
        case 2:
            w = tw * (1 + range);
            h = th;
            break;
        case 5:
            w = tw;
            h = th * (1 + range * 2);
            break;
    }
    this.bitmap = new Bitmap(w, h);
};

Sprite_ChronoHitboxTool.prototype.refresh = function () {
    this.bitmap.clear();
    var color = this._setting.color;
    var tw = $gameMap.tileWidth();
    var th = $gameMap.tileHeight();
    var cx = this.width / 2;
    var cy = this.height / 2;
    var range = this._character._tool.range;
    var mode = this._character._tool.area;
    switch (mode) {
        case 0:
            var dir = 0;
            var x = 0;
            var c = 1;
            var ax, ay, aw, ah;
            aw = tw;
            while (x < this.width) {
                ax = x;
                ah = c * th;
                ay = (this.height - ah) / 2;
                x += tw;
                if (dir) {
                    c -= 2;
                } else {
                    c += 2;
                    if (x + tw > cx) dir = 1;
                }
                this.bitmap.fillRect(ax, ay, aw, ah, color);
            }
            break;
        case 1: case 2: case 5:
            this.bitmap.fillAll(color);
            break;
        case 3:
            var c = this.height / th;
            var x = cx - tw / 2;
            var ax, ay, aw, ah;
            aw = tw;
            while (x < this.width) {
                ax = x;
                ah = c * th;
                ay = (this.height - ah) / 2;
                x += tw;
                c -= 2;
                this.bitmap.fillRect(ax, ay, aw, ah, color);
            }
            break;
        case 4:
            this.bitmap.fillRect(cx - tw / 2, 0, cx + tw / 2, this.height, color);
            break;
        case 6:
            this.bitmap.fillRect(cx - tw / 2, 0, tw, this.height, color);
            this.bitmap.fillRect(0, cy - th / 2, this.width, th, color);
            break;
    }
};

Sprite_ChronoHitboxTool.prototype.updatePosition = function () {
    if (this.parent) {
        var horz = [4, 6].contains(this._character.direction());
        this.rotation = horz ? 0 : 90 * (Math.PI / 180);
        this.x = 0;
        this.y = (this._character.screenY() - this.parent.y) - $gameMap.tileHeight() / 2;
        switch (this._character._tool.area) {
            case 2:
                var ax = this.width / 2 - $gameMap.tileWidth() / 2;
                switch (this._character.direction()) {
                    case 2:
                        this.y += ax;
                        break;
                    case 8:
                        this.y -= ax;
                        break;
                    case 6:
                        this.x = ax
                        break;
                    case 4:
                        this.x = -ax;
                        break;
                }
                break;
            case 3: case 4:
                var a = [6, 2, 4, 8].indexOf(this._character.direction());
                this.rotation = a * 90 * (Math.PI / 180);
                break;
        }
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Sprite_Character
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoHitboxVisual.Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function () {
    Dhoom.ChronoHitboxVisual.Sprite_Character_update.call(this);
    this.updateChronoHitboxVisual();
};

Sprite_Character.prototype.updateChronoHitboxVisual = function () {
    if (this.battler()) {
        if (!this._hitboxSprite || this._hitboxSprite._character !== this._character) {
            this.createChronoHitboxVisual();
        }
    } else if (this._hitboxSprite) {
        this.removeChronoHitboxVisual();
    }
};

Sprite_Character.prototype.createChronoHitboxVisual = function () {
    if (this._hitboxSprite) this.removeChronoHitboxVisual();
    var tw = $gameMap.tileWidth();
    var th = $gameMap.tileHeight();
    if (this._character instanceof ToolEvent) {
        var setting = JsonEx.makeDeepCopy(Dhoom.ChronoHitboxVisual.hitboxTool);
        if (this._character._hitboxColor) setting.color = this._character._hitboxColor;
        if (this._character._hitboxOpacity) setting.opacity = this._character._hitboxOpacity;
        if (this._character._hitboxSwitch) setting.switch = this._character._hitboxSwitch;
        this._hitboxSprite = new Sprite_ChronoHitboxTool(setting, this._character);
    } else {
        var setting = JsonEx.makeDeepCopy(Dhoom.ChronoHitboxVisual.hitboxCharacter);
        if (this._character._hitboxColor) setting.color = this._character._hitboxColor;
        if (this._character._hitboxOpacity) setting.opacity = this._character._hitboxOpacity;
        if (this._character._hitboxSwitch) setting.switch = this._character._hitboxSwitch;
        var bodySize = 0;
        if (this.battler()._ras.bodySize) bodySize = this.battler()._ras.bodySize;
        setting.width = tw + tw * bodySize * 2;
        setting.height = th + th * bodySize;
        this._hitboxSprite = new Sprite_ChronoHitbox(setting, this._character);
    }
    this.addChild(this._hitboxSprite);
};

Sprite_Character.prototype.removeChronoHitboxVisual = function () {
    this.removeChild(this._hitboxSprite);
    this._hitboxSprite = null;
};