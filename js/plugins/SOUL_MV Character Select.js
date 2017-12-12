// -------------------------------------------------------------------------------
// SOUL_MV Character Select.js
// Author: Soulpour777
// -------------------------------------------------------------------------------

/*:
* @help

SOUL_MV Character Select.js
Author: Soulpour777

Credits:

Additional Assets: Soulpour777
Background: Closet (https://sites.google.com/site/closetvx/)
Busts: Fayforest / Ruruga: (http://fayforest.sakura.ne.jp/)

Plugin Commands:

character_select        Use this plugin to do a character select.

All actor faces should be named actor_ + actor's id. For example, the
Actors in your database are:

Harold
Therese
Marcia
Lucius

actor_1 should be Harold's, actor_2...Therese's... and so on. Each
image corresponds to the actor id.

This goes the same for the name, scope and battlers shown.

each name is used with name_ + actor id
each battler is used with char_ + actor id
each scope is used with scope_ + actor id

Q: What is Actor Start Count and Actor End Count?

This is the starting point of where the character selection should be. For example, you placed
1 at Actor Start Count and 12 at Actor End Count. What this means is the plugin will
start counting from 1 to 12 from your Actor ID in your database. Which means, if you
have 17 actors in total, it will only make a selection of actor IDs 1 to 12.

With this feature, you can now assign which characters you want to count to
place in your character selection screen.


Place all images under img / char_sel folder.

To show the active actors in your party, turn the switch ID
(which you identified in the Plugin Manager) ON.


* @plugindesc V2.0 - Creates a custom scene to do Character / Party member selection screen.
* @author Soulpour777 - soulxregalia.wordpress.com
*
* @param Actor Start Count
* @desc Which actor id do you want to begin the character select be in? (Default: 1 - means counting starts at actor 1)
* @default 1
*
* @param Actor End Count
* @desc Which actor id do you want to end the character select? (Default: 12)
* @default 12
*
* @param Background Image
* @desc Your character Selection Screen image.
* @default SelectionBackground
*
* @param Scrolling Image
* @desc Your scrolling image.
* @default image_roll
*
* @param Header Image
* @desc Your top header image.
* @default top_header
*
* @param Scrolling Image Height
* @desc Your scrolling image height.
* @default 53
*
* @param Active Actor Switch
* @desc Switch ID used to show / hide active actors in the party members.
* @default 1
*
* @param Active Actors X
* @desc X axis location of the active actors in your party.
* @default 700
*
* @param Active Actors Y
* @desc Y axis location of the active actors in your party.
* @default 90
*
* @param Scope X
* @desc X axis location of the centered battler image in your selection screen.
* @default 0
*
* @param Scope Y
* @desc Y axis location of the centered battler image in your selection screen.
* @default 0
*
* @param Char Name X
* @desc X axis location of the centered character name image in your selection screen.
* @default 180
*
* @param Char Name Y
* @desc Y axis location of the centered character name image in your selection screen.
* @default 400
*
* @param Header X
* @desc X axis location of the header image in your selection screen.
* @default 0
*
* @param Header Y
* @desc Y axis location of the header image in your selection screen.
* @default 0
*
* @param Battler X
* @desc X axis location of the battler image in your selection screen.
* @default 750
*
* @param Battler Y
* @desc Y axis location of the battler image in your selection screen.
* @default 180
*
* @param Battler Scroll Distance
* @desc The distance of the battler to scroll right to left before it stops. (Original X axis to new x axis. New X Axis = Distance)
* @default 500
*
* @param Header Scroll Speed
* @desc The speed of the scrolling image on top of the image header.
* @default 1
*
* @param Scope Show Speed
* @desc The speed of the centered character image on the selection screen to fade in.
* @default 5
*
* @param Battler Show Speed
* @desc The speed of the battler image on the selection screen to fade in.
* @default 5
*
* @param Battler Scroll Speed
* @desc The speed of the bust image on the selection screen to scroll in.
* @default 20
*
*/

var SOUL_MV = SOUL_MV || {};
SOUL_MV.CharacterSelect = {};

SOUL_MV.CharacterSelect.StartCount = Number(PluginManager.parameters('SOUL_MV Character Select')['Actor Start Count'] || 1);
SOUL_MV.CharacterSelect.EndCount = Number(PluginManager.parameters('SOUL_MV Character Select')['Actor End Count'] || 12);

SOUL_MV.CharacterSelect.BackgroundScreen = PluginManager.parameters('SOUL_MV Character Select')['Background Image'] || 'SelectionBackground';
SOUL_MV.CharacterSelect.ImageRoll = PluginManager.parameters('SOUL_MV Character Select')['Scrolling Image'] || 'image_roll';
SOUL_MV.CharacterSelect.HeaderImage = PluginManager.parameters('SOUL_MV Character Select')['Top Header Image'] || 'top_header';

SOUL_MV.CharacterSelect.SwitchID = Number(PluginManager.parameters('SOUL_MV Character Select')['Active Actor Switch'] || 1);
SOUL_MV.CharacterSelect.ActiveActorsX = Number(PluginManager.parameters('SOUL_MV Character Select')['Active Actor X'] || 700);
SOUL_MV.CharacterSelect.ActiveActorsY = Number(PluginManager.parameters('SOUL_MV Character Select')['Active Actor Y'] || 90);
SOUL_MV.CharacterSelect.ScopeX = Number(PluginManager.parameters('SOUL_MV Character Select')['Scope X'] || 0);
SOUL_MV.CharacterSelect.ScopeY = Number(PluginManager.parameters('SOUL_MV Character Select')['Scope Y'] || 0);
SOUL_MV.CharacterSelect.NameX = Number(PluginManager.parameters('SOUL_MV Character Select')['Char Name X'] || 180);
SOUL_MV.CharacterSelect.NameY = Number(PluginManager.parameters('SOUL_MV Character Select')['Char Name Y'] || 400);
SOUL_MV.CharacterSelect.HeaderX = Number(PluginManager.parameters('SOUL_MV Character Select')['Header X'] || 0);
SOUL_MV.CharacterSelect.HeaderY = Number(PluginManager.parameters('SOUL_MV Character Select')['Header Y'] || 0);
SOUL_MV.CharacterSelect.BattlerX = Number(PluginManager.parameters('SOUL_MV Character Select')['Battler X'] || 750);
SOUL_MV.CharacterSelect.BattlerY = Number(PluginManager.parameters('SOUL_MV Character Select')['Battler Y'] || 180);
SOUL_MV.CharacterSelect.HeaderSpeed = Number(PluginManager.parameters('SOUL_MV Character Select')['Header Scroll Speed'] || 1);
SOUL_MV.CharacterSelect.ScopeSpeed = Number(PluginManager.parameters('SOUL_MV Character Select')['Scope Show Speed'] || 5);
SOUL_MV.CharacterSelect.BattlerSpeed = Number(PluginManager.parameters('SOUL_MV Character Select')['Battler Show Speed'] || 5);
SOUL_MV.CharacterSelect.BattlerScrollSpeed = Number(PluginManager.parameters('SOUL_MV Character Select')['Battler Scroll Speed'] || 20);
SOUL_MV.CharacterSelect.BattlerScrollDistance = Number(PluginManager.parameters('SOUL_MV Character Select')['Battler Scroll Distance'] || 500);
SOUL_MV.CharacterSelect.ScrollingImageHeight = Number(PluginManager.parameters('SOUL_MV Character Select')['Scrolling Image Height'] || 53);

SOUL_MV.CharacterSelect.pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    SOUL_MV.CharacterSelect.pluginCommand.call(this, command, args);
    if (command === 'character_select') {
        SceneManager.push(SOUL_MV_CharacterSelect);
    }
}

function SOUL_MV_SelectCommand() {
    this.initialize.apply(this, arguments);
}

SOUL_MV_SelectCommand.prototype = Object.create(Window_Command.prototype);
SOUL_MV_SelectCommand.prototype.constructor = SOUL_MV_SelectCommand;

SOUL_MV_SelectCommand.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
    this.selectLast();
};

SOUL_MV_SelectCommand._lastCommandSymbol = null;

SOUL_MV_SelectCommand.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

SOUL_MV_SelectCommand.prototype.windowWidth = function() {
    return 240;
};

SOUL_MV_SelectCommand.prototype.numVisibleRows = function() {
    return this.maxItems();
};

SOUL_MV_SelectCommand.prototype.makeCommandList = function() {
    this.addMainCommands();
};

SOUL_MV_SelectCommand.prototype.addMainCommands = function() {
    for (var i = SOUL_MV.CharacterSelect.StartCount; i < SOUL_MV.CharacterSelect.EndCount+1; i++) {
        this.addCommand($dataActors[i].name, 'selectActor', true);
    }
};


SOUL_MV_SelectCommand.prototype.processOk = function() {
    SOUL_MV_SelectCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};

SOUL_MV_SelectCommand.prototype.selectLast = function() {
    this.selectSymbol(SOUL_MV_SelectCommand._lastCommandSymbol);
};


SOUL_MV_SelectCommand.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
        var lastIndex = this.index();
        if (Input.isRepeated('down')) {
            this.cursorDown(Input.isTriggered('down'));
        }
        if (Input.isRepeated('up')) {
            this.cursorUp(Input.isTriggered('up'));
        }
        if (Input.isRepeated('right')) {
            this.cursorDown(Input.isTriggered('down'));
        }
        if (Input.isRepeated('left')) {
            this.cursorUp(Input.isTriggered('up'));
        }
        if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.cursorPagedown();
        }
        if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
};

function SOUL_MV_CharacterSelect() {
    this.initialize.apply(this, arguments);
}

SOUL_MV_CharacterSelect.prototype = Object.create(Scene_MenuBase.prototype);
SOUL_MV_CharacterSelect.prototype.constructor = SOUL_MV_CharacterSelect;

SOUL_MV_CharacterSelect.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    preload();
};

SOUL_MV_CharacterSelect.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createCharacterScope();
    this.createCharacterBusts();
    this.createRingCommand();
    this.createTopHeader();
    this.createImageRoll();
    this.createCharacterName();
    if($gameSwitches.value(SOUL_MV.CharacterSelect.SwitchID))this.createOpenActors();
};

SOUL_MV_CharacterSelect.prototype.createOpenActors = function() {
    this._openActors = new SOUL_MV_OpenActors();
    this._openActors.opacity = 0;
    this._openActors.x = SOUL_MV.CharacterSelect.ActiveActorsX;
    this._openActors.y = SOUL_MV.CharacterSelect.ActiveActorsY;
    this.addWindow(this._openActors);
}

SOUL_MV_CharacterSelect.prototype.createCharacterScope = function() {
    this._characterScope = new Sprite();
    this._characterScope.x = SOUL_MV.CharacterSelect.ScopeX;
    this._characterScope.y = SOUL_MV.CharacterSelect.ScopeY;
    this.addChild(this._characterScope);
}

SOUL_MV_CharacterSelect.prototype.createCharacterName = function() {
    this._characterName = new Sprite();
    this._characterName.x = SOUL_MV.CharacterSelect.NameX;
    this._characterName.y = SOUL_MV.CharacterSelect.NameY;
    this.addChild(this._characterName);
}

SOUL_MV_CharacterSelect.prototype.createImageRoll = function() {
    this._imageroll = new TilingSprite();
    this._imageroll.move(0, 0, Graphics.width, SOUL_MV.CharacterSelect.ScrollingImageHeight);
    this._imageroll.bitmap = ImageManager.loadCharSel(SOUL_MV.CharacterSelect.ImageRoll);
    this.addChild(this._imageroll);
}

SOUL_MV_CharacterSelect.prototype.createTopHeader = function() {
    this._topHeader = new Sprite();
    this._topHeader.x = SOUL_MV.CharacterSelect.HeaderX;
    this._topHeader.y = SOUL_MV.CharacterSelect.HeaderY;
    this._topHeader.bitmap = ImageManager.loadCharSel(SOUL_MV.CharacterSelect.HeaderImage);
    this.addChild(this._topHeader);
}

SOUL_MV_CharacterSelect.prototype.createCharacterBusts = function() {
    this._characterBust = new Sprite();
    this._characterBust.x = SOUL_MV.CharacterSelect.BattlerX;
    this._characterBust.y = SOUL_MV.CharacterSelect.BattlerY;
    this.addChild(this._characterBust);
}

SOUL_MV_CharacterSelect.prototype.createRingCommand = function() {
    this._ringCommandIndex = this._commandWindow._index+1;
    this._ringCommandImage = new Sprite();

    this.addChild(this._ringCommandImage);
}


ImageManager.loadCharSel = function(filename, hue) {
    return this.loadBitmap('img/char_sel/', filename, hue, true);
};

SOUL_MV_CharacterSelect.prototype.update = function() {
    this._ringCommandIndex = this._commandWindow._index+1;
    Scene_MenuBase.prototype.update.call(this);
    this._ringCommandImage.bitmap = ImageManager.loadCharSel('actor_' + this._ringCommandIndex);
    this._characterScope.bitmap = ImageManager.loadCharSel('scope_' + this._ringCommandIndex);
    this._characterBust.bitmap = ImageManager.loadCharSel('char_' + this._ringCommandIndex);
    this._characterName.bitmap = ImageManager.loadCharSel('name_' + this._ringCommandIndex);
    this._imageroll.origin.x += SOUL_MV.CharacterSelect.HeaderSpeed;
    if (Input.isTriggered('up') || Input.isTriggered('down') || Input.isTriggered('left') || Input.isTriggered('right')) {
        this.resetScopeSprite();
    }
    if (Input.isTriggered('up') || Input.isTriggered('down') || Input.isTriggered('left') || Input.isTriggered('right')) {
        this.resetBustSprite();
        this.resetBustPosition();
    }
    if (this._characterScope.opacity != 255) {
        if (this._characterScope.opacity >= 255) {
            this._characterScope.opacity = 255;
        } else {
            this._characterScope.opacity += SOUL_MV.CharacterSelect.ScopeSpeed;
        }
    }
    if (this._characterBust.opacity != 255) {
        if (this._characterBust.opacity >= 255) {
            this._characterBust.opacity = 255;
        } else {
            this._characterBust.opacity += SOUL_MV.CharacterSelect.BattlerSpeed;
        }
    }    

    if (this._characterBust.x != SOUL_MV.CharacterSelect.BattlerScrollDistance) {
        if (this._characterBust.x <= SOUL_MV.CharacterSelect.BattlerScrollDistance) {
            this._characterBust.x = SOUL_MV.CharacterSelect.BattlerScrollDistance;
        } else {
            this._characterBust.x -= SOUL_MV.CharacterSelect.BattlerScrollSpeed;

        }
    }
}

SOUL_MV_CharacterSelect.prototype.resetBustPosition = function() {
    this._characterBust.x = SOUL_MV.CharacterSelect.BattlerX;
}

SOUL_MV_CharacterSelect.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
};

SOUL_MV_CharacterSelect.prototype.resetScopeSprite = function() {
    this._characterScope.opacity = 0;
}
SOUL_MV_CharacterSelect.prototype.resetBustSprite = function() {
    this._characterBust.opacity = 0;
}

SOUL_MV_CharacterSelect.prototype.createCommandWindow = function() {
    this._commandWindow = new SOUL_MV_SelectCommand(0, 0);
    this._commandWindow.visible = false;
    this._commandWindow.x = Graphics.width * 2;
    this._commandWindow.y = Graphics.height * 2;
    for (var i = 1; i < $dataActors.length; i++) {
        this._commandWindow.setHandler('selectActor',      this.commandSelectCharacter.bind(this));
    }
    this.addWindow(this._commandWindow);
};

SOUL_MV_CharacterSelect.prototype.createBackground = function() {
    this._backSprite = new Sprite();
    this._backSprite.bitmap = ImageManager.loadCharSel(SOUL_MV.CharacterSelect.BackgroundScreen);
    this.addChild(this._backSprite);
}

SOUL_MV_CharacterSelect.prototype.commandSelectCharacter = function( ) {
    $gameParty.addActor(this._commandWindow._index+1);
    SceneManager.pop();
}

function preload() {
    for (var i = SOUL_MV.CharacterSelect.StartCount; i < SOUL_MV.CharacterSelect.EndCount; i++) {
        ImageManager.loadCharSel('actor_'+i);
    }
}

function SOUL_MV_OpenActors() {
    this.initialize.apply(this, arguments);
}

SOUL_MV_OpenActors.prototype = Object.create(Window_Selectable.prototype);
SOUL_MV_OpenActors.prototype.constructor = SOUL_MV_OpenActors;

SOUL_MV_OpenActors.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._formationMode = false;
    this._pendingIndex = -1;
    this.loadImages();
    this.refresh();
};

SOUL_MV_OpenActors.prototype.windowWidth = function() {
    return Graphics.boxWidth - 240;
};

SOUL_MV_OpenActors.prototype.windowHeight = function() {
    return Graphics.boxHeight;
};

SOUL_MV_OpenActors.prototype.maxItems = function() {
    return $gameParty.size();
};

SOUL_MV_OpenActors.prototype.itemHeight = function() {
    var clientHeight = this.height - this.padding * 2;
    return Math.floor(clientHeight / this.numVisibleRows());
};

SOUL_MV_OpenActors.prototype.numVisibleRows = function() {
    return 8;
};

SOUL_MV_OpenActors.prototype.loadImages = function() {
    $gameParty.members().forEach(function(actor) {
        ImageManager.loadFace(actor.faceName());
    }, this);
};

SOUL_MV_OpenActors.prototype.drawItem = function(index) {
    this.drawItemBackground(index);
    this.drawItemImage(index);
};

SOUL_MV_OpenActors.prototype.drawItemBackground = function(index) {
    if (index === this._pendingIndex) {
        var rect = this.itemRect(index);
        var color = this.pendingColor();
        this.changePaintOpacity(false);
        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.changePaintOpacity(true);
    }
};

SOUL_MV_OpenActors.prototype.drawItemImage = function(index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRect(index);
    this.changePaintOpacity(actor.isBattleMember());
    this.drawActorFace(actor, rect.x + 1, rect.y + 1, 144, rect.height - 2);
    this.changePaintOpacity(true);
};

SOUL_MV_OpenActors.prototype.drawItemStatus = function(index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRect(index);
    var x = rect.x + 162;
    var y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
    var width = rect.width - x - this.textPadding();
    this.drawActorSimpleStatus(actor, x, y, width);
};

SOUL_MV_OpenActors.prototype.processOk = function() {
    Window_Selectable.prototype.processOk.call(this);
    $gameParty.setMenuActor($gameParty.members()[this.index()]);
};

SOUL_MV_OpenActors.prototype.isCurrentItemEnabled = function() {
    if (this._formationMode) {
        var actor = $gameParty.members()[this.index()];
        return actor && actor.isFormationChangeOk();
    } else {
        return true;
    }
};

SOUL_MV_OpenActors.prototype.selectLast = function() {
    this.select($gameParty.menuActor().index() || 0);
};

SOUL_MV_OpenActors.prototype.formationMode = function() {
    return this._formationMode;
};

SOUL_MV_OpenActors.prototype.setFormationMode = function(formationMode) {
    this._formationMode = formationMode;
};

SOUL_MV_OpenActors.prototype.pendingIndex = function() {
    return this._pendingIndex;
};

SOUL_MV_OpenActors.prototype.setPendingIndex = function(index) {
    var lastPendingIndex = this._pendingIndex;
    this._pendingIndex = index;
    this.redrawItem(this._pendingIndex);
    this.redrawItem(lastPendingIndex);
};


SOUL_MV_OpenActors.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};

SOUL_MV_OpenActors.prototype.drawActorFace = function(actor, x, y, width, height) {
   var img = ImageManager.loadSvActor(actor._battlerName,0)
   var xIndex = this.breathFrame();
   var yIndex = 0;
      var pw = img.width/9;
   var ph = img.height/6;
   var sx = xIndex * pw;
   var sy = yIndex * ph;
   this.contents.blt(img, sx, sy, pw, ph, x+(width-pw)/2, y+(height-ph));
};
 
SOUL_MV_OpenActors.prototype.update = function() {
   Window_Selectable.prototype.update.call(this);
   if(this._breathTimer === undefined)
    this._breathTimer = 0;
   this._breathTimer = this._breathTimer+=1;
   if(this._breathTimer>20){
    this._breathTimer = 0;
    if(this._breathFrame === undefined)
    this._breathFrame = 1;
    else
    this._breathFrame = (this._breathFrame + 1) % 4;
    this.refresh();
   }
};
 
SOUL_MV_OpenActors.prototype.breathFrame = function(){
     if(this._breathFrame === undefined)
     return 0;
     else
     if(this._breathFrame == 3)
     return 1;
     else
     return this._breathFrame;
}

