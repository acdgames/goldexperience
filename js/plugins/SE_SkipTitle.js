"use strict";
/*:
╔════════════════╗
║ Plugin Manager ║
╚════════════════╝
 * @plugindesc v1.00 - Skips the titlescreen and optionally can change the starting scene to whatever you want.
 * @author Squirting Elephant
   ╔════════════╗
   ║ Parameters ║
   ╚════════════╝
 * @param StartScene
 * @text Starting Scene
 * @desc The name of the scene to load when the game starts.
 * @type select
 * @option Scene_Battle
 * @option Scene_Boot
 * @option Scene_Debug
 * @option Scene_Equip
 * @option Scene_File
 * @option Scene_GameEnd
 * @option Scene_Gameover
 * @option Scene_Item
 * @option Scene_Load
 * @option Scene_Map
 * @option Scene_Menu
 * @option Scene_Name
 * @option Scene_Options
 * @option Scene_Save
 * @option Scene_Shop
 * @option Scene_Skill
 * @option Scene_Status
 * @option Scene_Title
 * @default Scene_Map
 * 
   ╔══════╗
   ║ Help ║
   ╚══════╝
 * @help
 * License: Public Domain or CC0.
 * 
 * Required Plugin(s):
 * * <None>
 *
 * Overrides:
 * * Scene_Boot.prototype.start()
 */

/*╔═══════════════════════╗
  ║ Plugin Initialization ║
  ╚═══════════════════════╝*/
var Imported = Imported || {};
Imported.SE_SkipTitle = { name: 'SE_SkipTitle', version: 1.00, author: 'Squirting Elephant', date:'2019-09-25'};
var SE = SE || {};
SE.Params = SE.Params || {};
SE.Params.SkipTitle = PluginManager.parameters('SE_SkipTitle');
SE.Params.SkipTitle.StartScene = SE.Params.SkipTitle.StartScene.replace('\r', ''); // Because: fix stupid RMMV bug (https://forums.rpgmakerweb.com/index.php?threads/parameter-string-does-not-equal-string.113697/)

(function()
{ 

  /*╔══════════════════════════════════════╗
    ║ Override: Scene_Boot.prototype.start ║
    ╚══════════════════════════════════════╝*/
  Scene_Boot.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    if (DataManager.isBattleTest()) {
        DataManager.setupBattleTest();
        SceneManager.goto(Scene_Battle);
    } else if (DataManager.isEventTest()) {
        DataManager.setupEventTest();
        SceneManager.goto(Scene_Map);
    } else {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        SceneManager.goto(eval(SE.Params.SkipTitle.StartScene)); // Note: This is the only overriden line.
        Window_TitleCommand.initCommandPosition();
    }
    this.updateDocumentTitle();
  };

})();

/*╔═════════════╗
  ║ End of File ║
  ╚═════════════╝*/