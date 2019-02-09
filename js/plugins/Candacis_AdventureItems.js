//=============================================================================
// Candacis - Adventure Items
// Candacis_AdventureItems.js
//=============================================================================

var Imported = Imported || {};
Imported.Candacis_AdventureItems = true;

var Liquidize = Liquidize || {};
Liquidize.AI = Liquidize.AI || {};
Liquidize.AI.version = 1.01;

//=============================================================================
/*:
 * @plugindesc v1.01 this plugin creates a adventure item menu that lets you
 * combine and separate items.
 * @author Liquidize
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * This plugin is a rudimentary system that allows the user to have a new menu
 * pop up that lets the player combine,separate, and examine items. It is fairly
 * basic and could be expanded upon rather easily.
 * ============================================================================
 * Parameters
 * ============================================================================
 *
 * @param Menu Name
 * @type text
 * @desc Text to display on the menu.
 * @default Adventure
 *
 * ============================================================================
 *  Notetags
 * ============================================================================
 *
 * ITEMS/ARMORS/WEAPONS
 *
 * <Item Separation: true/false> - This notetag lets you specify whether that Item
 * can be separated into its base components.  By default Items are able to be
 * so you do not need to set this unless you do not want the item to be.
 *
 * <Item Combo: ....>  This notetag sets the combination of items that combine
 * to create this item. The item's are the ID's of the items, separated by a comma.
 * If the item is an ARMOR item, prefix the id with an 'a', if the item is a weapon
 * prefix the item id with a 'w'. See the example below.
 *
 * EXAMPLE:
 * <Item Combo: 1,a4,w3>
 *
 *     The above example would be made by combining ITEM with id 1, ARMOR with
 *     id 4 and WEAPON with id 3.
 *
 * ============================================================================
 * Special Notes
 * ============================================================================
 * None
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.01:
 * - Fixed issue with separation always occurring.
 * - Fixed issue with weapons/armors not able to be the end result of a combination.
 * Version 1.00:
 * - Finished Plugin!
 */
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

Liquidize.Parameters = PluginManager.parameters("Candacis_AdventureItems");
Liquidize.Param = Liquidize.Param || {};
Liquidize.Param.AdventureMenuName = String(Liquidize.Parameters["Menu Name"]);

Liquidize.AI.ItemCombos = [];

//=============================================================================
// DataManager
//=============================================================================

Liquidize.AI.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    if (!Liquidize.AI.DataManager_isDatabaseLoaded.call(this)) return false;
    if (!Liquidize._loaded_Adventures_Items) {
        this.processItemComboNotetags($dataItems);
        this.processItemComboNotetags($dataArmors);
        this.processItemComboNotetags($dataWeapons);
        Liquidize._loaded_Adventures_Items = true;
    }
    return true;
};

DataManager.processItemComboNotetags = function (group) {
    var note1 = /<(?:ITEM COMBO): ([?a|w\d+(,(?!$))?]+)>/i;
    var note2 = /<(?:ITEM SEPARATION): (true|false)>/i;
    for (var n = 1; n < group.length; n++) {
        var obj = group[n];
        var notedata = obj.note.split(/[\r\n]+/);

        obj.itemCombo = null;
        obj.canSeparate = true;

        for (var i = 0; i < notedata.length; i++) {
            var line = notedata[i];
            if (line.match(note1)) {
              var combos = RegExp.$1.split(",");
              if (combos.length > 0) {
                  obj.itemCombo = combos;
                  var comboObj = {};
                  comboObj.combo = obj.itemCombo;
                  var prefix = "";
                  if (DataManager.isArmor(obj)) prefix = "a";
                  if (DataManager.isWeapon(obj)) prefix = "w";
                  var comboId = prefix + obj.id;
                  comboObj.output = comboId;
                  Liquidize.AI.ItemCombos.push(comboObj);
              }
            } else if (line.match(note2)) {
                obj.canSeparate = (RegExp.$1 == "true");
            }
        }
    }
};

DataManager.isItemCombinationForItem = function(haystack, needles) {
    if (needles.length < haystack.length) return false;
    var haystackMap = {};
    for (var i = 0; i < haystack.length; i++)
        haystackMap[haystack[i]] = true;
    for (var j = 0; j < needles.length; j++)
        if (!(needles[j] in haystackMap))
            return false;
    return true;
};

DataManager.isItemCombination = function(items) {
    if (items.length === 0) return null;
    for (var i = 0; i < Liquidize.AI.ItemCombos.length; i++) {
        if (this.isItemCombinationForItem(Liquidize.AI.ItemCombos[i].combo,items)) return Liquidize.AI.ItemCombos[i].output;
    }
    return null;
};

//=============================================================================
// ImageManager
//=============================================================================

//=============================================================================
// Window_AdventureItemCommand
//=============================================================================

function Window_AdventureItemCommand() {
    this.initialize.apply(this, arguments);
}

Window_AdventureItemCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_AdventureItemCommand.prototype.constructor = Window_AdventureItemCommand;

Window_AdventureItemCommand.prototype.initialize = function() {
    Window_HorzCommand.prototype.initialize.call(this, 0, 0);
};

Window_AdventureItemCommand.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

Window_AdventureItemCommand.prototype.maxCols = function() {
    return 4;
};

Window_AdventureItemCommand.prototype.update = function() {
    Window_HorzCommand.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setCategory(this.currentSymbol());
    }
};

Window_AdventureItemCommand.prototype.makeCommandList = function() {
    this.addCommand("Examine",    'examine',this.canExamineOrCombine());
    this.addCommand("Combine",   'combine',this.canExamineOrCombine());
    this.addCommand("Separate", 'separate',this.canSeparate());
};

Window_AdventureItemCommand.prototype.setItemWindow = function(itemWindow) {
    this._itemWindow = itemWindow;
    this.update();
};

Window_AdventureItemCommand.prototype.canSeparate = function() {
    var item =  this._itemWindow ? this._itemWindow.item() : null;
    if (!this.active) return false;
    if (!item || !item.canSeparate) return false;
    return true;
};

Window_AdventureItemCommand.prototype.canExamineOrCombine = function() {
    var item =  this._itemWindow ? this._itemWindow.item() : null;
    if (!this.active) return false;
    if (!item) return false;
    return true;
};


//=============================================================================
// Window_CombineCommand
//=============================================================================

function Window_CombineCommand() {
    this.initialize.apply(this, arguments);
}

Window_CombineCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_CombineCommand.prototype.constructor = Window_CombineCommand;

Window_CombineCommand.prototype.initialize = function(x,y,width,height) {
    Window_HorzCommand.prototype.initialize.call(this, x, y);
    this.width = width;
    this.height = height;
    this.refresh();
};

Window_CombineCommand.prototype.maxCols = function() {
    return 2;
};

Window_CombineCommand.prototype.update = function() {
    Window_HorzCommand.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setCategory(this.currentSymbol());
    }
};

Window_CombineCommand.prototype.makeCommandList = function() {
    this.addCommand("Add",    'add',true);
    this.addCommand("Combine",  'docombine',true);
};

Window_CombineCommand.prototype.setItemWindow = function(itemWindow) {
    this._itemWindow = itemWindow;
    this.update();
};

//=============================================================================
// Window_AdventureItems
//=============================================================================

function Window_AdventureItems() {
    this.initialize.apply(this, arguments);
}

Window_AdventureItems.prototype = Object.create(Window_ItemList.prototype);
Window_AdventureItems.prototype.constructor = Window_AdventureItems;

Window_AdventureItems.prototype.initialize = function(x, y,width,height) {
    Window_ItemList.prototype.initialize.call(this, x, y,width,height);
    this.mode = 0;
    this._lastSelectedItem = null;
    this.refresh();
};

Window_AdventureItems.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
        var rect = this.itemRect(index);
        rect.width -= 4;
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y,rect.width);
        this.changePaintOpacity(1);
    }
};

Window_AdventureItems.prototype.isCurrentItemEnabled = function() {
    return true;
};

Window_AdventureItems.prototype.includes = function(item) {
    return true;
};

Window_AdventureItems.prototype.setLastSelectedItem = function(item) {
    this._lastSelectedItem = this._data.indexOf(item) >= 0 ? this._data.indexOf(item) : -1
};

Window_AdventureItems.prototype.selectLastItem = function() {
  this.select(this._lastSelectedItem >= 0 ? this._lastSelectedItem : 0);
};

//=============================================================================
// Window_AdventureCombineItems
//=============================================================================

function Window_AdventureCombineItems() {
    this.initialize.apply(this, arguments);
}

Window_AdventureCombineItems.prototype = Object.create(Window_ItemList.prototype);
Window_AdventureCombineItems.prototype.constructor = Window_AdventureCombineItems;

Window_AdventureCombineItems.prototype.initialize = function(x, y,width,height) {
    Window_ItemList.prototype.initialize.call(this, x, y,width,height);
    this._data = [];
    this.refresh();
};

Window_AdventureCombineItems.prototype.makeItemList = function() {
};

Window_AdventureCombineItems.prototype.maxCols = function() {
    return 1;
};

Window_AdventureCombineItems.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
        var rect = this.itemRect(index);
        rect.width -= 4;
        this.drawItemName(item, rect.x, rect.y,rect.width);
    }
};

Window_AdventureCombineItems.prototype.isCurrentItemEnabled = function() {
};

Window_AdventureCombineItems.prototype.includes = function(item) {
};

Window_AdventureCombineItems.prototype.addItem = function(item) {
    if (!this._data) return;
    this._data.push(item);
    this.refresh();
};

Window_AdventureCombineItems.prototype.combo = function() {
    return this._data;
};

Window_AdventureCombineItems.prototype.clearCombo = function() {
    this._data = [];
    this.refresh();
};

//=============================================================================
// Window_AdventureItemExamine
//=============================================================================

function Window_AdventureItemExamine() {
    this.initialize.apply(this, arguments);
}

Window_AdventureItemExamine.prototype = Object.create(Window_Selectable.prototype);
Window_AdventureItemExamine.prototype.constructor = Window_AdventureItemExamine;

Window_AdventureItemExamine.prototype.initialize = function(x,y,width,height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._text = "";
};

Window_AdventureItemExamine.prototype.setText = function(text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};

Window_AdventureItemExamine.prototype.clear = function() {
    this.setText("");
};

Window_AdventureItemExamine.prototype.setItem = function(item) {
    if (item) {
        this.setText(item.description ? item.description : "");
    } else {
        this.setText("");
    }
};

Window_AdventureItemExamine.prototype.refresh = function() {
    this.contents.clear();
    this.drawTextEx(this._text, this.textPadding(), 0);
};


//=============================================================================
// Window_MenuCommand
//=============================================================================

Liquidize.AI.Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
    this.addCommand(Liquidize.Param.AdventureMenuName, 'adventure', true);
};

//=============================================================================
// Scene_Menu
//=============================================================================

Liquidize.AI.Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    Liquidize.AI.Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler('adventure',this.commandAdventure.bind(this));
};

Scene_Menu.prototype.commandAdventure = function() {
    SceneManager.push(Scene_AdventureItem);
};


//=============================================================================
// Scene_AdventureItem
//=============================================================================

function Scene_AdventureItem() {
    this.initialize.apply(this, arguments);
}

Scene_AdventureItem.prototype = Object.create(Scene_Base.prototype);
Scene_AdventureItem.prototype.constructor = Scene_AdventureItem;

Scene_AdventureItem.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_AdventureItem.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createWindowLayer();
    this.createAllWindows();
};


Scene_AdventureItem.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
};

Scene_AdventureItem.prototype.setBackgroundOpacity = function(opacity) {
    this._backgroundSprite.opacity = opacity;
};

Scene_AdventureItem.prototype.createAllWindows = function() {
    this.createAdventureItemCommandWindow();
    this.createCombinationWindow();
    this.createCombinationCommandWindow();
    this.createExamineWindow();
    this.createAdventureItemList();
};

Scene_AdventureItem.prototype.createAdventureItemCommandWindow = function() {
    this._commandWindow = new Window_AdventureItemCommand();
    this._commandWindow.setHandler('cancel', this.onCommandCancel.bind(this));
    this._commandWindow.setHandler('examine',this.onCommandExamine.bind(this));
    this._commandWindow.setHandler('combine',this.onCommandCombine.bind(this));
    this._commandWindow.setHandler('separate', this.onCommandSeparate.bind(this));
    this._commandWindow.deactivate();
    this.addWindow(this._commandWindow);
};

Scene_AdventureItem.prototype.onCommandSeparate = function() {
    var item = this._adventureItemList.item();
    if (item && item.canSeparate === true) {
        if (!item.itemCombo || !item.itemCombo.length >= 1) {
            SoundManager.playBuzzer();
            this._commandWindow.activate();
            return false;
        }
        item.itemCombo.forEach(function(comboItem) {
            var prefix = comboItem.split('')[0];
            var actualItem = null;
            if (prefix === 'a') {
                actualItem = $dataArmors[prefix[1]];
            } else if (prefix === 'w') {
                actualItem = $dataWeapons[prefix[1]];
            } else {
                actualItem = $dataItems[prefix];
            }
            $gameParty.gainItem(actualItem,1,false);
        },this);
        $gameParty.gainItem(item,-1,false);
        this._adventureItemList.refresh();
        this._commandWindow.refresh();
        this.onCommandCancel();
        SoundManager.playOk();
    } else {
        SoundManager.playBuzzer();
        this._commandWindow.activate();
    }
};

Scene_AdventureItem.prototype.onCommandCombine = function() {
    this._commandWindow.deactivate();
    this._comboWindow.addItem(this._adventureItemList.item());
    this._comboCommandWindow.activate();
    this._adventureItemList.mode = 1;
};

Scene_AdventureItem.prototype.onCommandExamine = function() {
    this._commandWindow.deactivate();
    this._examineWindow.setItem(this._adventureItemList.item());
    this._examineWindow.activate();
    this._examineWindow.show();
    this._adventureItemList.hide();
};

Scene_AdventureItem.prototype.onCommandCancel = function() {
    this._commandWindow.refresh();
    this._commandWindow.deactivate();
    this._adventureItemList.activate();
};

Scene_AdventureItem.prototype.onComboCommandCancel = function() {
    this._comboCommandWindow.deactivate();
    this._commandWindow.activate();
    this._adventureItemList.mode = 0;
    this._adventureItemList.selectLastItem();
};

Scene_AdventureItem.prototype.onCommandAdd = function() {
  this._comboCommandWindow.deactivate();
  this._adventureItemList.mode = 1;
  this._adventureItemList.activate();
};

Scene_AdventureItem.prototype.createCombinationWindow = function() {
    var width = 200;
    var height = Graphics.boxHeight - this._commandWindow.height * 2;
    var y = this._commandWindow.y + this._commandWindow.height;
    this._comboWindow = new Window_AdventureCombineItems(0,y,width,height);
    this._comboWindow.deactivate();
    this.addWindow(this._comboWindow);
};

Scene_AdventureItem.prototype.createCombinationCommandWindow = function() {
    var width = 200;
    var height = Graphics.boxHeight - (this._comboWindow.y + this._comboWindow.height);
    var y = this._comboWindow.y + this._comboWindow.height;
    this._comboCommandWindow = new Window_CombineCommand(0,y,width,height);
    this._comboCommandWindow.setHandler('cancel',this.onComboCommandCancel.bind(this));
    this._comboCommandWindow.setHandler('docombine',this.processItemCombine.bind(this));
    this._comboCommandWindow.setHandler('add',this.onCommandAdd.bind(this));
    this._comboCommandWindow.deactivate();
    this.addWindow(this._comboCommandWindow);
};

Scene_AdventureItem.prototype.createAdventureItemList = function() {
    var width = Graphics.boxWidth - this._comboWindow.width;
    var height = Graphics.boxHeight - this._commandWindow.height;
    var x = this._comboWindow.x + this._comboWindow.width;
    var y = this._commandWindow.y + this._commandWindow.height;
    this._adventureItemList = new Window_AdventureItems(x,y,width,height);
    this._adventureItemList.setHandler('ok',     this.onItemOk.bind(this));
    this._adventureItemList.setHandler('cancel', this.popScene.bind(this));
    this._adventureItemList.activate();
    this._commandWindow.setItemWindow(this._adventureItemList);
    this.addWindow(this._adventureItemList);
};

Scene_AdventureItem.prototype.createExamineWindow = function() {
    var width = Graphics.boxWidth - this._comboWindow.width;
    var height = Graphics.boxHeight - this._commandWindow.height;
    var x = this._comboWindow.x + this._comboWindow.width;
    var y = this._commandWindow.y + this._commandWindow.height;
    this._examineWindow = new Window_AdventureItemExamine(x,y,width,height);
    this._examineWindow.setHandler('cancel', this.onExamineCancel.bind(this));
    this.addWindow(this._examineWindow);
};

Scene_AdventureItem.prototype.onExamineCancel = function() {
    this._examineWindow.deactivate();
    this._commandWindow.activate();
    this._examineWindow.hide();
    this._adventureItemList.show();
};

Scene_AdventureItem.prototype.processItemCombine = function() {
        var prefixedCombos = [];
        for (var i = 0; i < this._comboWindow.combo().length; i++) {
            var item = this._comboWindow.combo()[i];
            var prefix = "";
            if (DataManager.isArmor(item)) prefix = "a";
            if (DataManager.isWeapon(item)) prefix = "w";
            var comboId = prefix + item.id;
            prefixedCombos.push(comboId);
        }
        var combined = DataManager.isItemCombination(prefixedCombos);
        if (combined !== null) {
            SoundManager.playOk();
            var prefix = combined.split('')[0];
            var item = null;
            if (prefix === 'a') {
                item = $dataArmors[combined.split('')[1]];
            } else if (prefix === 'w') {
                item = $dataWeapons[combined.split('')[1]];
            } else {
                item = $dataItems[prefix];
            }
            $gameParty.gainItem(item,1,false);
            this._comboWindow.combo().forEach(function (item) {
                $gameParty.gainItem(item,-1,false);
            },this);
            this._comboWindow.clearCombo();
            this.onComboCommandCancel();
            this._adventureItemList.refresh();
            this._commandWindow.refresh();
        } else {
            SoundManager.playBuzzer();
            this._comboWindow.clearCombo();
            this.onComboCommandCancel();
        }
};

Scene_AdventureItem.prototype.onItemOk = function() {
    if (this._adventureItemList.mode === 1) {
        this._comboWindow.addItem(this._adventureItemList.item());
        this._adventureItemList.mode = 0;
        this._adventureItemList.deactivate();
        this._comboCommandWindow.activate();
    } else {
        this._adventureItemList.setLastSelectedItem(this._adventureItemList.item());
        this._adventureItemList.deactivate();
        this._commandWindow.activate();
        this._commandWindow.refresh();
    }
};