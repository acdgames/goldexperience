//=============================================================================
// DhoomChronoSkillEquip.js
//=============================================================================
var Imported = Imported || {};
Imported.Dhoom_ChronoSkillEquip = true;

var Dhoom = Dhoom || {};
Dhoom.ChronoSkillEquip = Dhoom.ChronoSkillEquip || {};
/*:
 * @plugindesc Dhoom ChronoSkillEquip v1.0 - 24/11/2018
 * @author DrDhoom - drd-workshop.blogspot.com
 * 
 * @param Main Menu
 * 
 * @param Add To Main Menu
 * @desc Add Skill Equip command to main menu?
 * @type boolean
 * @default true
 * @parent Main Menu
 * 
 * @param Command Name
 * @desc Skill Equip command name.
 * @default Skill Equip
 * @parent Main Menu
 * 
 * @param Core
 * 
 * @param Scene Background
 * @desc Leave empty to use the default background.
 * @type file
 * @dir img/menu/
 * @default sequipbg
 * @parent Core
 * 
 * @param Help Window Setting
 * @desc Setting for Help Window.
 * @type struct<windowSetting>
 * @default {"x":"0","y":"0","width":"816","height":"108","opacity":"255","padding":"12","lineHeight":"32","background":"","backgroundPosition":"[0, 0]","style":"{\"name\":\"\",\"size\":\"28\",\"color\":\"#FFFFFF\",\"outlineWidth\":\"3\",\"outlineColor\":\"#000000\",\"bold\":\"false\",\"italic\":\"false\",\"align\":\"center\"}"}
 * @parent Core
 * 
 * @param Skill Category Window Setting
 * @desc Setting for Skill Category list.
 * @type struct<skillCategorySetting>
 * @default {"windowSetting":"{\"x\":\"0\",\"y\":\"108\",\"width\":\"300\",\"height\":\"516\",\"opacity\":\"0\",\"padding\":\"12\",\"lineHeight\":\"32\",\"background\":\"sebg\",\"backgroundPosition\":\"[0, 0]\",\"style\":\"{\\\"name\\\":\\\"\\\",\\\"size\\\":\\\"28\\\",\\\"color\\\":\\\"#FFFFFF\\\",\\\"outlineWidth\\\":\\\"3\\\",\\\"outlineColor\\\":\\\"#000000\\\",\\\"bold\\\":\\\"false\\\",\\\"italic\\\":\\\"false\\\",\\\"align\\\":\\\"center\\\"}\"}","cols":"1","spacing":"8","categorySpacing":"24","categoryText":"{\"x\":\"0\",\"y\":\"0\",\"text\":\"\\\\I[53]%1\",\"style\":\"{\\\"name\\\":\\\"\\\",\\\"size\\\":\\\"28\\\",\\\"color\\\":\\\"#3cb878\\\",\\\"outlineWidth\\\":\\\"3\\\",\\\"outlineColor\\\":\\\"#000000\\\",\\\"bold\\\":\\\"false\\\",\\\"italic\\\":\\\"false\\\",\\\"align\\\":\\\"left\\\"}\"}","itemText":"{\"x\":\"0\",\"y\":\"0\",\"text\":\"  %1%2\",\"style\":\"{\\\"name\\\":\\\"\\\",\\\"size\\\":\\\"24\\\",\\\"color\\\":\\\"#FFFFFF\\\",\\\"outlineWidth\\\":\\\"3\\\",\\\"outlineColor\\\":\\\"#000000\\\",\\\"bold\\\":\\\"false\\\",\\\"italic\\\":\\\"false\\\",\\\"align\\\":\\\"left\\\"}\"}","noItemText":"None","cursor":"secursor","cursorPosition":"[-12, 1]"}
 * @parent Core
 * 
 * @param Skill List Window Setting
 * @desc Setting for Skill List window.
 * @type struct<skillListSetting>
 * @default {"windowSetting":"{\"x\":\"300\",\"y\":\"108\",\"width\":\"516\",\"height\":\"408\",\"opacity\":\"255\",\"padding\":\"12\",\"lineHeight\":\"32\",\"background\":\"\",\"backgroundPosition\":\"[0, 0]\",\"style\":\"{\\\"name\\\":\\\"\\\",\\\"size\\\":\\\"28\\\",\\\"color\\\":\\\"#FFFFFF\\\",\\\"outlineWidth\\\":\\\"3\\\",\\\"outlineColor\\\":\\\"#000000\\\",\\\"bold\\\":\\\"false\\\",\\\"italic\\\":\\\"false\\\",\\\"align\\\":\\\"center\\\"}\"}","cols":"1","spacing":"16","unequipText":"{\"x\":\"0\",\"y\":\"0\",\"text\":\"Unequip %2\",\"style\":\"{\\\"name\\\":\\\"\\\",\\\"size\\\":\\\"28\\\",\\\"color\\\":\\\"#00aeef\\\",\\\"outlineWidth\\\":\\\"3\\\",\\\"outlineColor\\\":\\\"#000000\\\",\\\"bold\\\":\\\"false\\\",\\\"italic\\\":\\\"false\\\",\\\"align\\\":\\\"center\\\"}\"}","cursor":"","cursorPosition":"[0, 0]"}
 * @parent Core
 * 
 * @param Skill Status Window Setting
 * @desc Setting for Skill Status window.
 * @type struct<skillStatusSetting>
 * @default {"windowSetting":"{\"x\":\"300\",\"y\":\"516\",\"width\":\"516\",\"height\":\"108\",\"opacity\":\"255\",\"padding\":\"12\",\"lineHeight\":\"32\",\"background\":\"\",\"backgroundPosition\":\"[0, 0]\",\"style\":\"{\\\"name\\\":\\\"\\\",\\\"size\\\":\\\"28\\\",\\\"color\\\":\\\"#FFFFFF\\\",\\\"outlineWidth\\\":\\\"3\\\",\\\"outlineColor\\\":\\\"#000000\\\",\\\"bold\\\":\\\"false\\\",\\\"italic\\\":\\\"false\\\",\\\"align\\\":\\\"center\\\"}\"}","texts":"[\"{\\\"x\\\":\\\"0\\\",\\\"y\\\":\\\"0\\\",\\\"width\\\":\\\"246\\\",\\\"height\\\":\\\"32\\\",\\\"text\\\":\\\"Element: %3\\\",\\\"style\\\":\\\"{\\\\\\\"name\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"size\\\\\\\":\\\\\\\"28\\\\\\\",\\\\\\\"color\\\\\\\":\\\\\\\"#FFFFFF\\\\\\\",\\\\\\\"outlineWidth\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"outlineColor\\\\\\\":\\\\\\\"#000000\\\\\\\",\\\\\\\"bold\\\\\\\":\\\\\\\"false\\\\\\\",\\\\\\\"italic\\\\\\\":\\\\\\\"false\\\\\\\",\\\\\\\"align\\\\\\\":\\\\\\\"left\\\\\\\"}\\\",\\\"condition\\\":\\\"\\\"}\",\"{\\\"x\\\":\\\"246\\\",\\\"y\\\":\\\"0\\\",\\\"width\\\":\\\"246\\\",\\\"height\\\":\\\"32\\\",\\\"text\\\":\\\"Charge Time: %4\\\",\\\"style\\\":\\\"{\\\\\\\"name\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"size\\\\\\\":\\\\\\\"28\\\\\\\",\\\\\\\"color\\\\\\\":\\\\\\\"#FFFFFF\\\\\\\",\\\\\\\"outlineWidth\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"outlineColor\\\\\\\":\\\\\\\"#000000\\\\\\\",\\\\\\\"bold\\\\\\\":\\\\\\\"false\\\\\\\",\\\\\\\"italic\\\\\\\":\\\\\\\"false\\\\\\\",\\\\\\\"align\\\\\\\":\\\\\\\"left\\\\\\\"}\\\",\\\"condition\\\":\\\"\\\"}\",\"{\\\"x\\\":\\\"0\\\",\\\"y\\\":\\\"32\\\",\\\"width\\\":\\\"246\\\",\\\"height\\\":\\\"32\\\",\\\"text\\\":\\\"Cooldown: %5\\\",\\\"style\\\":\\\"{\\\\\\\"name\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"size\\\\\\\":\\\\\\\"28\\\\\\\",\\\\\\\"color\\\\\\\":\\\\\\\"#FFFFFF\\\\\\\",\\\\\\\"outlineWidth\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"outlineColor\\\\\\\":\\\\\\\"#000000\\\\\\\",\\\\\\\"bold\\\\\\\":\\\\\\\"false\\\\\\\",\\\\\\\"italic\\\\\\\":\\\\\\\"false\\\\\\\",\\\\\\\"align\\\\\\\":\\\\\\\"left\\\\\\\"}\\\",\\\"condition\\\":\\\"\\\"}\"]"}
 * @parent Core
 *
 * @help The Skill Category list will be obtained from DhoomChronoToolHUD Skill Settings, the order don't get sorted.
 */

/*~struct~statusTextSetting:
@param x
@text X Position
@desc Text x position.
@type number
@min 0
@default 0

@param y
@text Y Position
@desc Text y position.
@type number
@min 0
@default 0

@param width
@text Text Width
@desc Max text width
@type number
@min 4
@default 32

@param height
@text Text Height
@desc Max text height
@type number
@min 4
@default 32

@param text
@text Text Format
@desc %1 = MP cost, $2 = TP cost, %3 = Damage Element, %4 = Charge Time, %5 = Coolodown, %6 = SType Cooldown, %7 = Global Cooldown.
@type text
@default %1

@param style
@text Style Setting
@type struct<FontStyle>
@default {"name":"","size":"28","color":"#FFFFFF","outlineWidth":"3","outlineColor":"#000000","bold":"false","italic":"false","align":"left"}

@param condition
@text Text Condition
@desc Always enabled if empty. a = MP cost, b = TP cost, c = Damage Element, d = Charge Time, e = Coolodown, f = SType Cooldown, g = Global Cooldown.
*/

/*~struct~skillStatusSetting:
@param windowSetting
@text Window Setting
@desc Window settings.
@type struct<windowSetting>

@param texts
@text Text Settings
@desc Support control character.
@type struct<statusTextSetting>[]
*/

/*~struct~skillListSetting:
@param windowSetting
@text Window Setting
@desc Window settings.
@type struct<windowSetting>

@param cols
@text Max Column
@desc Max column of the list.
@type number
@min 1
@default 1

@param spacing
@text Spacing
@desc Spacing between each item.
@type number

@param unequipText
@text Unequip Skill Text Setting
@desc Setting for unequip skill text.
@type struct<catSkillTextSetting>

@param cursor
@text Cursor Image
@desc Cursor image that will be shown on where the selected item is.
@type file
@dir img/menu/

@param cursorPosition
@text Cursor Position
@desc Cursor image position, relative to where the selected item is. [x, y]
@default [0, 0]
*/

/*~struct~skillCategorySetting:
@param windowSetting
@text Window Setting
@desc Window settings.
@type struct<windowSetting>

@param cols
@text Max Column
@desc Max column of the list.
@type number
@min 1
@default 1

@param spacing
@text Spacing
@desc Spacing between each item.
@type number

@param categorySpacing
@text Category Spacing
@desc Spacing between each category.
@type number

@param categoryText
@text Category Text Setting
@desc Category text setting.
@type struct<categoryTextSetting>

@param itemText
@text Item Text Setting
@desc Item text setting. 
@type struct<catSkillTextSetting>

@param noItemText
@text No Item Text
@desc Text when there is no item.
@default None

@param cursor
@text Cursor Image
@desc Cursor image that will be shown on where the selected item is.
@type file
@dir img/menu/

@param cursorPosition
@text Cursor Position
@desc Cursor image position, relative to where the selected item is. [x, y]
@default [0, 0]
*/

/*~struct~categoryTextSetting:
@param x
@text X Position
@desc Text x position.
@type number
@min 0
@default

@param y
@text Y Position
@desc Text y position.
@type number
@min 0
@default

@param text
@text Text Format
@desc %1 = Category name. Support control character.
@type text
@default %1

@param style
@text Style Setting
@type struct<FontStyle>
@default
*/

/*~struct~catSkillTextSetting:
@param x
@text X Position
@desc Text x position.
@type number
@min 0
@default

@param y
@text Y Position
@desc Text y position.
@type number
@min 0
@default

@param text
@text Text Format
@desc %1 = Skill Icon, %2 = Skill Name. Support control character.
@type text
@default %1

@param style
@text Style Setting
@type struct<FontStyle>
@default
*/

/*~struct~windowSetting:
@param x
@text Window X
@desc Window X
@default 0
@type number
@min -99999
@max 99999

@param y
@text Window Y
@desc Window Y
@default 0
@type number
@min -99999
@max 99999

@param width
@text Window Width
@desc Window width
@default 200
@type number
@min 2

@param height
@text Window Height
@desc Window height area
@default 120
@type number
@min 2

@param opacity
@text Window Opacity
@desc Window opacity
@default 255
@type number
@max 255

@param padding
@text Window Padding
@desc Window padding
@default 12
@type number

@param lineHeight
@text Window Line Height
@desc Line height
@default 32
@type number

@param background
@text Window Background
@desc Window background filename
@default
@type file
@dir img/menu/
@require

@param backgroundPosition
@text Window Background Position
@desc Background position, relative to window position [x, y]
@default [0, 0]

@param style
@text Window Text Style
@desc Text font setting
@default
@type struct<FontStyle>
*/

/*~struct~FontStyle:
@param name
@text Font Name
@desc Font name, leave empty if you want to use the default font.
@default 

@param size
@text Font Size
@desc Font size
@default 28
@type number
@min 1

@param color
@text Font Color
@desc Font color
@default #FFFFFF

@param outlineWidth
@text Font Outline Width
@desc Font outline width
@default 3
@type number

@param outlineColor
@text Font Outline Color
@desc Font outline color
@default #000000

@param bold
@text Font Bold
@desc Font bold
@default false
@type boolean

@param italic
@text Font Italic
@desc Font italic
@default false
@type boolean

@param align
@text Text Alignment
@desc Text alignment
@default center
@type select
@option left
@option center
@option right
*/

/*~struct~textSetting:
@param x
@text X Position
@desc Text x position.
@type number
@min 0
@default

@param y
@text Y Position
@desc Text y position.
@type number
@min 0
@default

@param width
@text Text Width
@desc Max text width
@type number
@min 4
@default

@param height
@text Text Height
@desc Max text height
@type number
@min 4
@default

@param text
@text Text Format
@desc %1 = Data
@type text
@default %1

@param style
@text Style Setting
@type struct<FontStyle>
@default
*/

Dhoom.Parameters = PluginManager.parameters('DhoomChronoSkillEquip');
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

Dhoom.ChronoSkillEquip.mainDir = 'img/menu/';
Dhoom.ChronoSkillEquip.addCommand = Dhoom.loadParam('Add To Main Menu');
Dhoom.ChronoSkillEquip.commandName = Dhoom.loadParam('Command Name');
Dhoom.ChronoSkillEquip.sceneBackground = Dhoom.loadParam('Scene Background');
Dhoom.ChronoSkillEquip.helpWindowSetting = Dhoom.loadParam('Help Window Setting');
Dhoom.ChronoSkillEquip.categoryWindowSetting = Dhoom.loadParam('Skill Category Window Setting');
Dhoom.ChronoSkillEquip.skillWindowSetting = Dhoom.loadParam('Skill List Window Setting');
Dhoom.ChronoSkillEquip.statusWindowSetting = Dhoom.loadParam('Skill Status Window Setting');

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Bitmap
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
if (typeof Bitmap.prototype.changeTextStyle === 'undefined') {
    Dhoom.ChronoSkillEquip.Bitmap_initialize = Bitmap.prototype.initialize;
    Bitmap.prototype.initialize = function (width, height) {
        Dhoom.ChronoSkillEquip.Bitmap_initialize.call(this, width, height);
        this.fontBold = false;
    };

    Dhoom.ChronoSkillEquip.Bitmap_makeFontNameText = Bitmap.prototype._makeFontNameText;
    Bitmap.prototype._makeFontNameText = function () {
        if (this.fontBold) return 'Bold ' + (this.fontItalic ? 'Italic ' : '') + this.fontSize + 'px ' + this.fontFace;
        return Dhoom.ChronoSkillEquip.Bitmap_makeFontNameText.call(this);
    };

    Bitmap.prototype.changeTextStyle = function (style) {
        this.fontFace = style.name.length > 0 ? style.name : 'GameFont';
        this.fontSize = style.size;
        this.textColor = style.color;
        this.outlineWidth = style.outlineWidth;
        this.outlineColor = style.outlineColor;
        this.fontBold = style.bold;
        this.fontItalic = style.italic;
    };

    Dhoom.ChronoSkillEquip.Bitmap_drawTextOutline = Bitmap.prototype._drawTextOutline;
    Bitmap.prototype._drawTextOutline = function (text, tx, ty, maxWidth) {
        if (this.outlineWidth === 0) return;
        Dhoom.ChronoSkillEquip.Bitmap_drawTextOutline.call(this, text, tx, ty, maxWidth);
    };
}

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Actor
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Game_Actor.prototype.isSkillEquipped = function (skillId) {
    return this._toolSkillId.contains(skillId);
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Window_SkillEquipCategory
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function Window_SkillEquipCategory() {
    this.initialize.apply(this, arguments);
}

Window_SkillEquipCategory.prototype = Object.create(Window_Selectable.prototype);
Window_SkillEquipCategory.prototype.constructor = Window_SkillEquipCategory;

Window_SkillEquipCategory.prototype.initialize = function () {
    var x = this.setting().windowSetting.x;
    var y = this.setting().windowSetting.y;
    var width = this.setting().windowSetting.width;
    var height = this.setting().windowSetting.height;
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this.opacity = this.setting().windowSetting.opacity;
    this.createCursorSprite();
    this.createBackground();
    this.refresh();
    this.select(1);
    this.activate();
};

Window_SkillEquipCategory.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.resetScroll();
    }
};

Window_SkillEquipCategory.prototype.setting = function () {
    return Dhoom.ChronoSkillEquip.categoryWindowSetting;
};

Window_SkillEquipCategory.prototype.standardPadding = function () {
    return this.setting().windowSetting.padding;
};

Window_SkillEquipCategory.prototype.lineHeight = function () {
    return this.setting().windowSetting.lineHeight;
};

Window_SkillEquipCategory.prototype.createBackground = function () {
    this._background = new Sprite();
    this._background.bitmap = ImageManager.loadBitmap(Dhoom.ChronoSkillEquip.mainDir, this.setting().windowSetting.background);
    this._background.x = this.setting().windowSetting.backgroundPosition[0];
    this._background.y = this.setting().windowSetting.backgroundPosition[1];
    this.addChildToBack(this._background);
};

Window_SkillEquipCategory.prototype.createCursorSprite = function () {
    if (this.setting().cursor) {
        this._cursorSprite = new Sprite();
        this._cursorSprite.bitmap = ImageManager.loadBitmap(Dhoom.ChronoSkillEquip.mainDir, this.setting().cursor);
        this.addChildToBack(this._cursorSprite);
    }
};

Window_SkillEquipCategory.prototype.maxCols = function () {
    return this.setting().cols;
};

Window_SkillEquipCategory.prototype.spacing = function () {
    return this.setting().spacing;
};

Window_SkillEquipCategory.prototype.categorySpacing = function () {
    return this.setting().categorySpacing;
};

Window_SkillEquipCategory.prototype.maxItems = function () {
    return this._list ? this._list.length : 0;
};

Window_SkillEquipCategory.prototype.itemRect = function (index) {
    var rect = this._rectList ? this._rectList[index] : new Rectangle();
    rect.x -= this._scrollX;
    rect.y -= this._scrollY;
    return rect;
};

Window_SkillEquipCategory.prototype.createItemList = function () {
    this._list = [];
    var lastStypeId = null;
    var settings = Dhoom.ChronoToolHUD.skillSettings;
    for (var i = 0; i < settings.length; i++) {
        var setting = settings[i];
        if (!setting.switch || $gameSwitches.value(setting.switch)) {
            if (setting.stypeId !== lastStypeId) {
                lastStypeId = setting.stypeId;
                this._list.push(['stypeId', setting.stypeId]);
            }
            this._list.push(['skill', i, lastStypeId]);
        }
    }
};

Window_SkillEquipCategory.prototype.createItemRectList = function () {
    this._rectList = [];
    var x = 0;
    var y = 0;
    var height = this.itemHeight();
    var maxCols = this.maxCols();
    for (var i = 0; i < this._list.length; i++) {
        var rect = new Rectangle();
        var width = this.itemWidth();
        if (this._list[i][0] === 'stypeId') {
            x = 0;
            if (i > 0) {
                y -= this.spacing();
                y += this.categorySpacing();
            }
            width = this.contents.width;
        }
        rect.x = x;
        rect.y = y;
        rect.width = width;
        rect.height = height;
        this._rectList.push(rect);
        if (maxCols > 1 && this._list[i][0] === 'skill') {
            x += rect.width + this.spacing();
            if (x >= this.contents.width || (this._list[i + 1] && this._list[i + 1][0] === 'stypeId')) {
                x = 0;
                y += rect.height + this.spacing();
            }
        } else {
            x = 0;
            y += rect.height + this.spacing();
        }
    }
};

Window_SkillEquipCategory.prototype.refresh = function () {
    this.createItemList();
    this.createItemRectList();
    if (!this._actor) return;
    Window_Selectable.prototype.refresh.call(this);
    this.updateHelp();
};

Window_SkillEquipCategory.prototype.drawItem = function (index) {
    var setting = this._list[index][0] === 'stypeId' ? this.setting().categoryText : this.setting().itemText;
    this.contents.changeTextStyle(setting.style);
    var rect = this.itemRect(index);
    rect.x += setting.x;
    rect.y += setting.y;
    if (this._list[index][0] === 'stypeId') {
        var text = setting.text.format($dataSystem.skillTypes[this._list[index][1]]);
    } else {
        var skill = this._actor._toolSkillId[this._list[index][1]] ? $dataSkills[this._actor._toolSkillId[this._list[index][1]]] : null;
        var icon = skill ? skill.iconIndex : 0;
        var name = skill ? skill.name : this.setting().noItemText;
        var text = setting.text.format(icon ? '\x1bI[' + icon + ']' : '', name);
    }
    text = text.replace(/\\/g, '\x1b');
    var textRect = this.measureDrawTextEx(text);
    this.contents.changeTextStyle(setting.style);
    var x = 0;
    if (setting.style.align === 'center') {
        x = (rect.width - textRect.width) / 2;
    } else if (setting.style.align === 'right') {
        x = rect.width - textRect.width;
    }
    this.drawTextEx(text, rect.x + x, rect.y + (rect.height - textRect.height) / 2);
};

Window_SkillEquipCategory.prototype.measureDrawTextEx = function (text) {
    var rect = new Rectangle();
    var textState = { index: 0, x: 0, y: 0, left: 0 };
    textState.text = this.convertEscapeCharacters(text);
    rect.height = this.calcTextHeight(textState, false);
    while (textState.index < textState.text.length) {
        if (textState.text[textState.index] === 'x1b') {
            var code = this.obtainEscapeCode(textState);
            switch (code) {
                case 'I':
                    this.obtainEscapeParam(textState);
                    rect.width += Window_Base._iconWidth + 4;
                    if (rect.height < Window_Base._iconHeight) rect.height = Window_Base._iconHeight;
                    break;
                case '{':
                    this.makeFontBigger();
                    break;
                case '}':
                    this.makeFontSmaller();
                    break;
            }
        } else {
            rect.width += this.contents.measureTextWidth(textState.text[textState.index]);
            textState.index++;
        }
    }
    return rect;
};

Window_SkillEquipCategory.prototype.resetFontSettings = function () { };

Window_SkillEquipCategory.prototype.select = function (index) {
    if (this._list) {
        var operator = index > this._index ? 1 : -1;
        while (this._list[index][0] === 'stypeId') {
            index += operator;
            if (index < 0 || index >= this.maxItems()) return;
        }
    }
    Window_Selectable.prototype.select.call(this, index);
};

Window_SkillEquipCategory.prototype.hitTest = function (x, y) {
    var index = Window_Selectable.prototype.hitTest.call(this, x, y);
    if (index >= 0 && this._list && this._list[index][0] === 'stypeId') return -1;
    return index;
};

Window_SkillEquipCategory.prototype.skillIndex = function () {
    return this._list ? this._list[this.index()][1] : -1;
};

Window_SkillEquipCategory.prototype.updateCursor = function () {
    if (this._cursorSprite) {
        this.setCursorRect(0, 0, 0, 0);
        var rect = this.itemRect(this.index());
        this._cursorSprite.x = this.setting().cursorPosition[0] + rect.x + this.standardPadding() - this._scrollX;
        this._cursorSprite.y = this.setting().cursorPosition[1] + rect.y + this.standardPadding() - this._scrollY;
    } else {
        Window_Selectable.prototype.updateCursor.call(this);
    }
};

Window_SkillEquipCategory.prototype.setListWindow = function (window) {
    this._listWindow = window;
    this.updateHelp();
};

Window_SkillEquipCategory.prototype.setStatusWindow = function (window) {
    this._statusWindow = window;
    this.updateHelp();
};

Window_SkillEquipCategory.prototype.updateHelp = function () {
    this.setHelpWindowItem(this._list && this._actor ? $dataSkills[this._actor._toolSkillId[this._list[this.index()][1]]] : null);
    if (this._listWindow && this._list) {
        this._listWindow.setStypeId(this._list[this.index()][2] || 0);
        this._listWindow._selectedSkill = this._actor ? $dataSkills[this._actor._toolSkillId[this._list[this.index()][1]]] : null;
        this._listWindow.refresh();
    }
    if (this._statusWindow && this._list) {
        this._statusWindow.setItem(this._actor ? $dataSkills[this._actor._toolSkillId[this._list[this.index()][1]]] : null);
    }
};

Window_SkillEquipCategory.prototype.currentItem = function () {
    return this._list[this.index()];
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Window_SkillEquipList
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function Window_SkillEquipList() {
    this.initialize.apply(this, arguments);
}

Window_SkillEquipList.prototype = Object.create(Window_SkillList.prototype);
Window_SkillEquipList.prototype.constructor = Window_SkillEquipList;

Window_SkillEquipList.prototype.initialize = function () {
    var x = this.setting().windowSetting.x;
    var y = this.setting().windowSetting.y;
    var width = this.setting().windowSetting.width;
    var height = this.setting().windowSetting.height;
    Window_SkillList.prototype.initialize.call(this, x, y, width, height);
    this._stypeId = 0;
    this.opacity = this.setting().windowSetting.opacity;
    this.createCursorSprite();
    this.createBackground();
};

Window_SkillEquipList.prototype.setting = function () {
    return Dhoom.ChronoSkillEquip.skillWindowSetting;
};

Window_SkillEquipList.prototype.standardPadding = function () {
    return this.setting().windowSetting.padding;
};

Window_SkillEquipList.prototype.lineHeight = function () {
    return this.setting().windowSetting.lineHeight;
};

Window_SkillEquipList.prototype.createBackground = function () {
    this._background = new Sprite();
    this._background.bitmap = ImageManager.loadBitmap(Dhoom.ChronoSkillEquip.mainDir, this.setting().windowSetting.background);
    this._background.x = this.setting().windowSetting.backgroundPosition[0];
    this._background.y = this.setting().windowSetting.backgroundPosition[1];
    this.addChildToBack(this._background);
};

Window_SkillEquipList.prototype.createCursorSprite = function () {
    if (this.setting().cursor) {
        this._cursorSprite = new Sprite();
        this._cursorSprite.bitmap = ImageManager.loadBitmap(Dhoom.ChronoSkillEquip.mainDir, this.setting().cursor);
        this.addChildToBack(this._cursorSprite);
    }
};

Window_SkillEquipList.prototype.maxCols = function () {
    return this.setting().cols;
};

Window_SkillEquipList.prototype.spacing = function () {
    return this.setting().spacing;
};

Window_SkillEquipList.prototype.isEnabled = function (item) {
    return this._actor && item;
};

Window_SkillEquipList.prototype.itemRect = function (index) {
    var rect = Window_SkillList.prototype.itemRect.call(this, index);
    rect.y += Math.floor(index / this.maxCols()) * this.spacing();
    return rect;
};

Window_SkillEquipList.prototype.includes = function (item) {
    var enable = false;
    var abs_mode = false;
    if (!item) return false;
    var item_notes = item.note.split(/[\r\n]+/);
    item_notes.forEach(function (note) {
        var note_data = note.split(' : ')
        if (note_data[0].toLowerCase() == "tool id") {
            enable = true;
        } else {
            abs_mode = true;
        };
        if (enable && abs_mode) return;
    }, this);
    return enable && abs_mode && item.stypeId === this._stypeId && item !== this._selectedSkill && !this._actor.isSkillEquipped(item.id);
};

Window_SkillEquipList.prototype.makeItemList = function () {
    Window_SkillList.prototype.makeItemList.call(this);
    if (this._actor && this._selectedSkill) {
        this._data.splice(0, 0, this._selectedSkill);
    }
};

Window_SkillEquipList.prototype.drawItem = function (index) {
    this.contents.changeTextStyle(this.setting().windowSetting.style);
    var skill = this._data[index];
    if (this._selectedSkill && skill === this._selectedSkill) {
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(skill));
        var setting = this.setting().unequipText;
        this.contents.changeTextStyle(setting.style);
        rect.x += setting.x;
        rect.y += setting.y;
        var text = setting.text.format('\x1bI[' + skill.iconIndex + ']', skill.name);
        this.drawTextEx(text, rect.x, rect.y);
        this.changePaintOpacity(1);
    } else {
        Window_SkillList.prototype.drawItem.call(this, index);
    }
};

Window_SkillEquipList.prototype.resetFontSettings = function () { };

Window_SkillEquipList.prototype.setStatusWindow = function (window) {
    this._statusWindow = window;
    this.updateHelp();
};

Window_SkillEquipList.prototype.updateHelp = function () {
    Window_SkillList.prototype.updateHelp.call(this);
    if (this._statusWindow) {
        this._statusWindow.setItem(this.item());
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Window_SkillEquipHelp
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function Window_SkillEquipHelp() {
    this.initialize.apply(this, arguments);
}

Window_SkillEquipHelp.prototype = Object.create(Window_Help.prototype);
Window_SkillEquipHelp.prototype.constructor = Window_SkillEquipHelp;

Window_SkillEquipHelp.prototype.initialize = function () {
    var x = this.setting().x;
    var y = this.setting().y;
    var width = this.setting().width;
    var height = this.setting().height;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._text = '';
    this.opacity = this.setting().opacity;
    this.createBackground();
};

Window_SkillEquipHelp.prototype.setting = function () {
    return Dhoom.ChronoSkillEquip.helpWindowSetting;
};

Window_SkillEquipHelp.prototype.standardPadding = function () {
    return this.setting().padding;
};

Window_SkillEquipHelp.prototype.lineHeight = function () {
    return this.setting().lineHeight;
};

Window_SkillEquipHelp.prototype.createBackground = function () {
    this._background = new Sprite();
    this._background.bitmap = ImageManager.loadBitmap(Dhoom.ChronoSkillEquip.mainDir, this.setting().background);
    this._background.x = this.setting().backgroundPosition[0];
    this._background.y = this.setting().backgroundPosition[1];
    this.addChildToBack(this._background);
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Window_SkillEquipStatus
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function Window_SkillEquipStatus() {
    this.initialize.apply(this, arguments);
}

Window_SkillEquipStatus.prototype = Object.create(Window_Base.prototype);
Window_SkillEquipStatus.prototype.constructor = Window_SkillEquipStatus;

Window_SkillEquipStatus.prototype.initialize = function () {
    var x = this.setting().windowSetting.x;
    var y = this.setting().windowSetting.y;
    var width = this.setting().windowSetting.width;
    var height = this.setting().windowSetting.height;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.opacity = this.setting().windowSetting.opacity;
    this.createBackground();
    this._item = null;
};

Window_SkillEquipStatus.prototype.setting = function () {
    return Dhoom.ChronoSkillEquip.statusWindowSetting;
};

Window_SkillEquipStatus.prototype.standardPadding = function () {
    return this.setting().windowSetting.padding;
};

Window_SkillEquipStatus.prototype.lineHeight = function () {
    return this.setting().windowSetting.lineHeight;
};

Window_SkillEquipStatus.prototype.createBackground = function () {
    this._background = new Sprite();
    this._background.bitmap = ImageManager.loadBitmap(Dhoom.ChronoSkillEquip.mainDir, this.setting().windowSetting.background);
    this._background.x = this.setting().windowSetting.backgroundPosition[0];
    this._background.y = this.setting().windowSetting.backgroundPosition[1];
    this.addChildToBack(this._background);
};

Window_SkillEquipStatus.prototype.setItem = function (item) {
    if (this._item !== item) {
        this._item = item;
        this.refresh();
    }
};

Window_SkillEquipStatus.prototype.refresh = function () {
    this.contents.clear();
    if (this._item) {
        for (var i = 0; i < this.setting().texts.length; i++) {
            this.drawTextCustom(this.setting().texts[i]);
        }
    }
};

Window_SkillEquipStatus.prototype.drawTextCustom = function (setting) {
    this.contents.changeTextStyle(setting.style);
    var cooldown = 0;
    var scooldown = 0;
    var gcooldown = 0;
    if (Imported.Dhoom_SkillCooldown) {
        for (var i = 0; i < this._item._cooldown.length; i++) {
            if (this._item._cooldown[i][0] === this._item.id) cooldown = Math.max(cooldown, this._item._cooldown[i][1]);
        }
        for (var i = 0; i < this._item._stypeCooldown.length; i++) {
            if (this._item._stypeCooldown[i][0] === this._item.stypeId) scooldown = Math.max(scooldown, this._item._stypeCooldown[i][1]);
        }
        if (this._item._globalCooldown) gcooldown = this._item._globalCooldown;
    }
    cooldown = (cooldown / 60).toFixed(2);
    scooldown = (scooldown / 60).toFixed(2);
    gcooldown = (gcooldown / 60).toFixed(2);
    var charge = (Math.abs(this._item.speed) / 60).toFixed(2);
    var text = setting.text.format(this._item.mpCost, this._item.tpCost, this._item.damage ? $dataSystem.elements[this._item.damage.elementId] : '', charge, cooldown, scooldown, gcooldown);
    var textRect = this.measureDrawTextEx(text);
    this.contents.changeTextStyle(setting.style);
    var x = 0;
    if (setting.style.align === 'center') {
        x = (setting.width - textRect.width) / 2;
    } else if (setting.style.align === 'right') {
        x = setting.width - textRect.width;
    }
    var y = (setting.height - textRect.height) / 2;
    this.drawTextEx(text, setting.x + x, setting.y + y);
};

Window_SkillEquipStatus.prototype.measureDrawTextEx = function (text) {
    var rect = new Rectangle();
    var textState = { index: 0, x: 0, y: 0, left: 0 };
    textState.text = this.convertEscapeCharacters(text);
    rect.height = this.calcTextHeight(textState, false);
    while (textState.index < textState.text.length) {
        if (textState.text[textState.index] === 'x1b') {
            var code = this.obtainEscapeCode(textState);
            switch (code) {
                case 'I':
                    this.obtainEscapeParam(textState);
                    rect.width += Window_Base._iconWidth + 4;
                    if (rect.height < Window_Base._iconHeight) rect.height = Window_Base._iconHeight;
                    break;
                case '{':
                    this.makeFontBigger();
                    break;
                case '}':
                    this.makeFontSmaller();
                    break;
            }
        } else {
            rect.width += this.contents.measureTextWidth(textState.text[textState.index]);
            textState.index++;
        }
    }
    return rect;
};

Window_SkillEquipStatus.prototype.resetFontSettings = function () { };

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Window_MenuCommand
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoSkillEquip.Window_MenuCommand_addCommand = Window_MenuCommand.prototype.addCommand;
Window_MenuCommand.prototype.addCommand = function (name, symbol, enabled) {
    Dhoom.ChronoSkillEquip.Window_MenuCommand_addCommand.call(this, name, symbol, enabled);
    if (symbol === 'skill' && Dhoom.ChronoSkillEquip.addCommand) {
        Dhoom.ChronoSkillEquip.Window_MenuCommand_addCommand.call(this, Dhoom.ChronoSkillEquip.commandName, 'skillequip', enabled);
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Scene_SkillEquip
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function Scene_SkillEquip() {
    this.initialize.apply(this, arguments);
}

Scene_SkillEquip.prototype = Object.create(Scene_MenuBase.prototype);
Scene_SkillEquip.prototype.constructor = Scene_SkillEquip;

Scene_SkillEquip.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createStatusWindow();
    this.createListWindow();
    this.createCategoryWindow();
    this.refreshActor();
};

Scene_SkillEquip.prototype.createBackground = function () {
    Scene_MenuBase.prototype.createBackground.call(this);
    if (Dhoom.ChronoSkillEquip.sceneBackground) {
        this._backgroundSprite.bitmap = ImageManager.loadBitmap(Dhoom.ChronoSkillEquip.mainDir, Dhoom.ChronoSkillEquip.sceneBackground);
    }
};

Scene_SkillEquip.prototype.createHelpWindow = function () {
    this._helpWindow = new Window_SkillEquipHelp();
    this.addChild(this._helpWindow);
};

Scene_SkillEquip.prototype.createStatusWindow = function () {
    this._skillStatusWindow = new Window_SkillEquipStatus();
    this.addChild(this._skillStatusWindow);
};

Scene_SkillEquip.prototype.createListWindow = function () {
    this._listWindow = new Window_SkillEquipList();
    this._listWindow.setHandler('ok', this.onListOk.bind(this));
    this._listWindow.setHandler('cancel', this.onListCancel.bind(this));
    this._listWindow.setHelpWindow(this._helpWindow);
    this._listWindow.setStatusWindow(this._skillStatusWindow);
    this.addChild(this._listWindow);
};

Scene_SkillEquip.prototype.createCategoryWindow = function () {
    this._categoryWindow = new Window_SkillEquipCategory();
    this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.setListWindow(this._listWindow);
    this._categoryWindow.setStatusWindow(this._skillStatusWindow);
    this.addChild(this._categoryWindow);
};

Scene_SkillEquip.prototype.refreshActor = function () {
    var actor = this.actor();
    this._categoryWindow.setActor(actor);
    this._listWindow.setActor(actor);
};

Scene_SkillEquip.prototype.onCategoryOk = function () {
    this._listWindow.activate();
    this._listWindow.select(0);
};

Scene_SkillEquip.prototype.onListOk = function () {
    $gameTemp._chronoToolMenuSkill = [this._categoryWindow.currentItem()[1]];
    if (this._listWindow.index() === 0 && this._listWindow._selectedSkill) {
        this.actor().equipToolSkillID(0);
    } else {
        this.actor().equipToolSkillID(this._listWindow.item().id);
    }
    this._categoryWindow.refresh();
    this.onListCancel();
};

Scene_SkillEquip.prototype.onListCancel = function () {
    this._listWindow.deselect();
    this._categoryWindow.activate();
    this._categoryWindow.reselect();
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Scene_Menu
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoSkillEquip.Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function () {
    Dhoom.ChronoSkillEquip.Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler('skillequip', this.commandPersonal.bind(this));
};

Dhoom.ChronoSkillEquip.Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
Scene_Menu.prototype.onPersonalOk = function () {
    Dhoom.ChronoSkillEquip.Scene_Menu_onPersonalOk.call(this);
    if (this._commandWindow.currentSymbol() === 'skillequip') {
        SceneManager.push(Scene_SkillEquip);
    }
};