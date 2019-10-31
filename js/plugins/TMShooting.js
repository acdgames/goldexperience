// ========================================================= =============================
// TMPlugin - Shooting
// Version: 1.3.3
/ / Last update date: 2018/01/18
// Distributor: http://hikimoki.sakura.ne.jp/
// ------------------------------------------------------------------------ -----------------------------
// Copyright (c) 2016 tomoaky
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
// ========================================================= =============================

/ *:
 * @ plugindesc Adds the ability to fire bullets to players and events.
 *
 * @ author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @ param shot
 * @ type struct <InputSetting>
 * @ Default {"text": "shot", "mandatory": "true", "keys": "AGHJ", "padButton": "6"}
 * 
 * @ param hold
 * @ type struct <InputSetting>
 * @default {"text": "hold", "mandatory": "false", "keys": "D", "padButton": "- 1"}
 * 
 * @ param holdType
 * @ type select
 * @ option SWITCH
 * @ option HOLD
 * @desc Orientation fixed method. For SWITCH, switch every time you press the fixed direction key,
 * HOLD only to switch while pressing.
 * @ Default SWITCH
 *
 * @ param deadSwitch
 * @ type string
 * @desc Self-switch that turns on when the event becomes unable to fight
 * Initial value: A
 * @ default A
 *
 * @ param resetDeadSwitch
 * @ type boolean
 * @desc Turn off deadSwitch when moving a map
 * Initial value: ON (false = OFF invalid / true = ON valid)
 * @ default true
 * 
 * @ param bulletBlockTag
 * @ type number
 * @ min -1
 * @desc terrain tag number that bullet can not pass
 * Initial value: -1 (0 to 7 = not applicable tag / 1 = invalid)
 * @ default -1
 *
 * @ param bulletBlockRegion
 * @ type number
 * @ min -1
 * @desc Region number where bullets can not pass
 * Initial value: -1 (0 to 255 = applicable region not allowed / -1 = invalid)
 * @ default -1
 *
 * @ param leaderShotSe
 * @ desc Player name of the bullet shot effect sound.
 * Initial value: Shot 1
 * @ Default Shot 1
 * @require 1
 * @ dir audio / se /
 * @ type file
 *
 * @ param leaderShotSeParam
 * @ type structure <SeParam>
 * @desc player parameter of bullet shot effect sound.
 * @default {"volume": "70", "pitch": "150", "pan": "0"}
 * 
 * @ param defaultDeadAnimeId
 * @desc Initial value of animation number to be displayed when fighting is impossible
 * Initial value: 67
 * @ default 66
 * @require 1
 * @ type animation
 *
 * @ param levelUpAnimeId
 * @desc Animation number to display at level up
 * Initial value: 52
 * @ default 52
 * @require 1
 * @ type animation
 *
 * @ param playerDeadEventId
 * @ type common_event
 * @ desc Common event number to be executed when the first actor is unable to fight
 * Initial value: 0 (0 = invalid / 1 or more = corresponding common event activation)
 * @ default 0
 *
 * @ param invincibleFollower
 * @ type boolean
 * @desc Make your followers invincible.
 * Initial value: false (false = OFF normal / true = ON invincible)
 * @ default false
 *
 * @ param useGameover
 * @ type boolean
 * @ desc Whether or not to shift to the game over scene at the time of extinction
 * Initial value: true (false = OFF does not shift / true = ON shift)
 * @ default true
 *
 * @ param maxPlayerBullet
 * @ type number
 * @ desc Maximum number of player bombs that can exist simultaneously
 * Initial value: 128
 * @ default 128
 *
 * @ param maxEnemyBullet
 * @ type number
 * @ desc Maximum number of enemy bullets that can exist simultaneously
 * Initial value: 128
 * @ default 128
 *
 * @ param bulletSizeTable
 * @ type string
 * @ desc Size of hit determination (dot number)
 * Initial value: 6, 6, 6, 6, 6, 6, 6, 6
 * @ default 6, 6, 6, 6, 6, 6, 6
 *
 * @ param bulletBlendTable
 * @ type string
 * @desc bullet blending mode
 * Initial value: 0, 0, 0, 0, 0, 0, 0
 * @ default 0,0,0,0,0,0,0,0
 *
 * @ param equipDummyX
 * @ type number
 * @ min - 9999
 * @desc X coordinate of the dummy to be displayed in the equipment scene
 * Initial value: 408
 * @ Default 408
 *
 * @ param equipDummyY
 * @ type number
 * @ min - 9999
 * @desc Y-coordinate of dummy to be displayed in equipment scene
 * Initial value: 312
 * @ default 312
 *
 * @ param useLevelUpMessage
 * @ type boolean
 * @desc Display level up message
 * Initial value: true (false = OFF not displayed / true = ON display)
 * @ default true
 *
 * @ noteparam shotSeName
 * @ noteRequire 1
 * @ noteDir audio / se /
 * @noteType file
 * @noteData weapons
 *
 * @requiredAssets img / system / shootingBullet1
 * @requiredAssets img / system / shootingBullet2
 * @requiredAssets img / system / shootingBullet3
 * @requiredAssets img / system / shootingBullet4
 * @requiredAssets img / system / shootingBullet5
 * @requiredAssets img / system / shootingBullet6
 * @requiredAssets img / system / shootingBullet7
 * @requiredAssets img / system / shootingBullet8
 * 
 * @ help
 * TMPlugin - Shooting ver1.3.3
 *
 * How to use:
 *
 * To operate this plug-in, images of bullets fired by players and events
 * will become necessary.
 *
 * Bomb image is shootingBullet1.png in the img / system folder with the filename
 * please put it in. In one file, there are eight sideways, any number of bullet images vertically
 * It can be inserted.
 * You can also use multiple files by changing the numeric part of the file name,
 * In case of making bullets of different sizes, hit judgment different, etc., file as necessary
 Please increase *.
 Up to 8 files can be used up to * shootingBullet8.png.
 *
 * When you are ready, insert the following tags in the notes field of weapons in the database.
 * <shotWay: 1>
 * <shotCount: 45>
 * <shotSpeed: 0.1>
 * <shotInterval: 15>
 * <shotType: 1>
 * <shotIndex: 8>
 *
 * Equip this weapon with the actor and press the A key to fire the bullet.
 * Insert a tag like <enemy: 3> in the memo field of enemy event hitting bullets.
 * With this, the parameter of enemy character 3 of number 3 is applied to this event, hit a bullet
 * When HP becomes 0, self-switch A turns on.
 *
 * This plugin is confirmed with RPG Menu Version 1.5.1.
 *
 * This plug-in is distributed under the MIT license, commercial use,
 * Modification, redistribution etc. You can use freely.
 * 
 *
 * Plugin parameter supplement:
 *
 * bulletSizeTable
 * Determine per-ball image judgment for each bullet image file, initial setting 6, 6, 6, 6, 6, 6, 6, 6
 * All shots from shootingBullet1.png to shootingBullet8.png are bulletproof
 * It is set to have a hit judgment of 6 dots in radius from the center.
 *
 * bulletBlendTable
 * Sets how to synthesize bullet images, correspondence between values ​​and synthesis method is as follows.
 * (0 = normal / 1 = addition / 2 = multiplication / 3 = screen)
 * As with bulletSizeTable, it is necessary to set as many as bullet image files.
 *
 * useLevelUpMessage
 * When acquiring experience value by defeating enemy event by bullet, level up of actor
 Set whether * is displayed in the message window or not.
 * We recommend that you hide it in games where action elements are strong.
 *
 *
 * Plugin command:
 *
 * startAutoShot
 * When this command is executed, the player character shoots automatically automatically
 It becomes *. This change also applies to party members.
 * 
 * stopAutoShot
 * When this command is executed, the automatic character shooting of the player character stops,
 * This change also applies to party members.
 *
 * nwayShot 3 0.4 0 0.1 60 1 3 1
 * The event that executed this command fires a bullet, the number following the command name is
 * Bullet number, distance, angle, speed, lifetime, type, index, skill number from the left
 It will be *.
 * If type is 1, index is 3, shootingBullet1.png as bullet image
 We use the fourth row from the top of *, the left. (The index is leading 0)
 *
 * nway Aim 3 0.4 0 0.1 60 1 3 1
 * The event that executed this command will fire bullets of your aim.
 * If the angle is other than 0, it is fired at the angle added with its value in the direction where yourself is
 * I will.
 *
 * nallShot 8 0 0.1 60 1 3 1
 * The event that executed this command will fire bullets in all directions,
 * Continued from the left bullet number, angle, speed, lifetime, type, index from the left,
 * It will be a skill number.
 * The bullet interval is adjusted automatically so that it fires in all directions.
 *
 * nallAim 8 0 0.1 60 1 3 1
 * It is the target version of nallShot.
 *
 * stopPlayerShot
 * Prohibit the firing of players (including party members) manually or automatically.
 *
 * startPlayerShot
 * Cancel the bullet prohibition state of players (including party members).
 * 
 * stopPlayerShot message
 * Event command "Display sentences" Only players (including party members)
 * The shoot bullet is prohibited manually or automatically.
 * 
 * startPlayerShot message
 * stopPlayerShot Cancels the effect of message.
 *
 * stopEnemyShot
 * Prohibits firing of events, if you are firing bullets in parallel events
 * Only the bullet command is invalidated and other commands are executed.
 *
 * startEnemyShot
 * Cancel the bullet prohibition state of the event.
 *
 * stopEnemyShot message
 * Prohibit firing of events only during execution of the event command "Display sentence".
 * 
 * startEnemyShot message
 * stopEnemyShot Cancels the effect of message.
 *
 * deletePlayerBullets
 * Delete all bullets fired by players (including party members).
 *
 * deleteEnemyBullets
 * Delete all bullets fired by the event.
 *
 * forceShot 0
 * Force the shot operation of the player forcibly. This command will delay
 * Ignore and firing bullets. Numbers are the order in which the party's head is 0,
 * If 0 is specified, only the leading character fires bullets.
 * If you omit the number, all parties fire bullets.
 *
 *
 * Memo field tag (actor, equipment, state):
 *
 * <shotWay: 3>
 * Set the number of bullets fired at once.
 *
 * <shotSpace: 0.4>
 * Set the distance (angle) between bullets fired at once.
 *
 * <shotSpeed: 0.1>
 * Set the movement speed of the bullet.
 *
 * <shotCount: 60>
 * Set the time until the bullet disappears by the number of frames.
 *
 * <shotInterval: 20>
 * Set the fire disable time up to re-launch in frames.
 * 
 * <shotInvincible: 60>
 * Set the unbeatable time generated by hitting by the number of frames.
 *
 *
 * Memo field tag (equipment, state):
 *
 * <shotIntervalRate: 1.4>
 * Set the non-fireable time until re-launch by magnification.
 It is calculated after addition correction by * shotInterval.
 *
 * Memo field tag (weapon, state):
 *
 * <shotType: 1>
 * Set the image file to use as the bullet's graphic. If the value is 1
 * Use shootingBullet1.png.
 * If there is this tag in both the weapon and the state, the one in the state takes precedence.
 *
 * <shotIndex: 3>
 * ShotType Specify the number of bullets in the image file selected by the tag.
 * If there is this tag in both the weapon and the state, the one in the state takes precedence.
 *
 * <shotSkill: 1>
 * Set skills to calculate damage when bullet hit the opponent.
 * If there is this tag in both the weapon and the state, the one in the state takes precedence.
 *
 *
 * Memo field tag (weapon):
 * 
 * <shotSeName: Shot1>
 * <shotSeVolume: 70>
 * <shotSePitch: 150>
 * Change the shooting sound of the bullet only while equipping the weapon with this tag.
 * You can set file name, volume, pitch, respectively.
 *
 *
 * Note column tag (skill):
 *
 * <mapThrough>
 * The bullet will not disappear even if it contacts the map's non-trafficable tile.
 *
 * <penetrate>
 * When touching a character, the bullet will penetrate without disappearing. The character is the same bullet
 * It will not receive multiple damage multiple times.
 *
 * <bulletAnime: 1>
 * When the bullet hit the character, animation of the specified number
 * It will be displayed on the character you strike.
 *
 *
 * Note column tag (event):
 *
 * <enemy: 1>
 * Set the enemy character number to use as a parameter of the event.
 *
 * <cw: 0.375>
 * The event and bullet hit determination size (width) is moved from the center of the event to the left (right) end
 Set by the length up to *. The value is 1.0, which is equivalent to one tile of map tiles.
 * If this tag does not exist, use 0.375 as the initial value.
 *
 * <ch: 0.75>
 * The hit determination size (height) of the event and bullet is set from the feet to the upper end of the event
 * Set by length. The value is 1.0, which is equivalent to one tile of map tiles.
 * If this tag does not exist, 0.75 is used as the initial value.
 *
 * <shiftFiringY: 0>
 * Move the bullet shooting position (Y coordinate) of the event by the specified number of dots.
 * If the value is positive, shift it downward, if it is negative shift it upward.
 * Normally, bullets are fired from the center of the hit judgment rectangle, but if there is inconvenience
 * Please adjust with this tag.
 *
 *
 * Memo field tag (actor):
 *
 * <cw: 0.375>
 * It is the same as for events.
 *
 * <ch: 0.75>
 * It is the same as for events.
 *
 * <shiftFiringY: 0>
 * It is the same as for events.
 *
 * <deadCharacter:! Flame, 5>
 * When this actor becomes unable to fight, change the walking graphics.
 * In this example, the bottom graphic of Flame.png, the second graphic from the left is adopted.
 *
 *
 * Memo field tag (actor, enemy character):
 *
 * <deadAnime: 67>
 * Set the animation to display when a battle impossible state is added.
 *
 *
 * Can be used together (Operation confirmed) Plug-in:
 *
 * SAN_AnalogMove.js ver1.4.3
 * SAN_AnalogMove.js ver 3.0.3
 * SAN_AnalogStick.js ver1.0.0
 * SAN_MapGenerator.js ver1.1.8
 * Author: San-siro (http://rev2nym.blog.fc2.com/)
 * 
 * CharacterPopupDamage.js Version 1.5.0
 * Author: Triacontan (http://triacontane.blogspot.jp/)
 *
 * CommonPopupCore.js ver1.05
 * GetInformation.js ver1.15
 * Author: Yana (https://twitter.com/yanatsuki_)
 * 
 * Mano_InputConfig.js ver 0.9.0
 * Author: Shiguren (https://twitter.com/Sigureya/)
 *
 * Reporting the problem due to using the plug-in above, the plug-in of combination
 * Please be sure to thank the tomoaky, not the author.
 *
 *
 * Other notes such as:
 *
 * Memo column tags such as shotWay and shotSpace, actor, equipment, state
 * Total value is adopted. If shotWay is 0 or shotCount is 0
 * If bullets are not launched, they disappear immediately after launch, bare hand state
 * If you want to shoot a bullet, also set the shotWay and shotCount tags for the actor
 * is needed.
 *
 * If you set a skill for a teammate target on a command such as nwayShot,
 Attacks with * can be expressed, depending on the skill setting the hit judgment functions correctly
 * I will not.
 * If bullets are not hit, add a state to the effect of using skills, meaningless, such as 0%
 * You can avoid this problem by setting the effect.
 *
 * Pad button layout is saved in config.rpgsave in save folder,
 * It will not be applied even if you change the setting of initial placement until this file is deleted.
 * /
/ * ~ struct ~ SeParam:
 *
 * @ param volume
 * @ type number
 * @ max 100
 * @desc Volume
 * Initial value: 70 (0 to 100)
 * @ default 70
 * 
 * @ param pitch
 * @ type number
 * @ min 50
 * @ max 150
 * @desc pitch
 * Initial value: 100 (50 to 150)
 * @ default 100
 * 
 * @ param pan
 * @ type number
 * @ min -100
 * @ max 100
 * @ desc phase
 * Initial value: 0 (-100 to 100)
 * @ default 0
* /
/ * ~ struct ~ InputSetting:
 * 
 * @ param text
 * @desc Command name
 * Used for reference in Mano_InputConfig
 * 
 * @ param mandatory
 * @desc Treat it as required by Mano_InputConfig.
 * @ type boolean
 * @ default false
 * 
 * @ param keys
 * @ desc keyboard assignment
 * @ type string
 * 
 * @ param padButton
 * @desc Game pad assignment
 * The parentheses are assignments by default
 * @ type select
 * @ default -1
 * @ option non (no assignment)
 * @ value -1
 * @ type select
 * @ option button 6
 * @ value 6
 * @ option button 7
 * @ value 7
 * @ option button 8
 * @ value 8
 * @ option button 9
 * @ value 9
 * @option button10
 * @ value 10
 * @ option button 11
 * @ value 11
 * @option button 0 (ok / decision)
 * @ value 0
 * @option button1 (cancel / cancel)
 * @ value 1
 * @ option button 2 (shift / dash)
 * @ value 2
 * @ option button 3 (menu / menu)
 * @ value 3
 * @option button 4 (pageup)
 * @ value 4
 * @ option button 5 (pagedown)
 * @ value 5
 * /



var Imported = Imported || {};
Imported.TMShooting = true;

var TMPlugin = TMPlugin || {};
TMPlugin.Shooting = {};
TMPlugin.Shooting.Parameters = PluginManager.parameters ('TMShooting');
TMPlugin.Shooting.HoldType = TMPlugin.Shooting.Parameters ['holdType'] || 'SWITCH';
TMPlugin.Shooting.DeadSwitch = TMPlugin.Shooting.Parameters ['deadSwitch'] || 'A';
TMPlugin.Shooting.ResetDeadSwitch = TMPlugin.Shooting.Parameters ['resetDeadSwitch'] === '1';
TMPlugin.Shooting.BulletBlockTag = + (TMPlugin.Shooting.Parameters ['bulletBlockTag'] || - 1);
TMPlugin.Shooting.BulletBlockRegion = + (TMPlugin.Shooting.Parameters ['bulletBlockRegion'] || - 1);
TMPlugin.Shooting.DefaultDeadAnimeId = + (TMPlugin.Shooting.Parameters ['defaultDeadAnimeId'] || 67);
TMPlugin.Shooting.LevelUpAnimeId = + (TMPlugin.Shooting.Parameters ['levelUpAnimeId'] || 52);
TMPlugin.Shooting.LeaderShotSe = JSON.parse (TMPlugin.Shooting.Parameters ['leaderShotSeParam'] || '{}');
TMPlugin.Shooting.LeaderShotSe.name = TMPlugin.Shooting.Parameters ['leaderShotSe'] || '';
TMPlugin.Shooting.PlayerDeadEventId = + (TMPlugin.Shooting.Parameters ['playerDeadEventId'] || 0);
TMPlugin.Shooting.InvincibleFollower = JSON.parse (TMPlugin.Shooting.Parameters ['invincibleFollower']));
TMPlugin.Shooting.UseGameover = JSON.parse (TMPlugin.Shooting.Parameters ['useGameover']));
TMPlugin.Shooting.MaxPlayerBullet = + (TMPlugin.Shooting.Parameters ['maxPlayerBullet'] || 128);
TMPlugin.Shooting.MaxEnemyBullet = + (TMPlugin.Shooting.Parameters ['maxEnemyBullet'] || 128);
TMPlugin.Shooting.EquipDummyX = + (TMPlugin.Shooting.Parameters ['equipDummyX'] || 408);
TMPlugin.Shooting.EquipDummyY = + (TMPlugin.Shooting.Parameters ['equipDummyY'] || 312);
TMPlugin.Shooting.UseLevelUpMessage = JSON.parse (TMPlugin.Shooting.Parameters ['useLevelUpMessage']));

/ **
 * change point
 * Remove plugin parameters shotKey, holdkey
 * Changed to shot, hold, more detailed setting
 * 
 * Remove option related functions
 * 
 * /
// Gruber: It's an additional part from here
var MA_InputSymbols = MA_InputSymbols || [];
(function () {
  'use strict';

  function addInputSetting (param, symbol) {
    var data = JSON.parse (param);
    Input.keyMapper [(data.keys.charCodeAt ())] = symbol;

    Input.gamepadMapper [data.padButton] = symbol; 

    MA_InputSymbols.push ({
      symbol: symbol,
      text: data.text,
      mandatory: data.mandatory,      
    });
  }
  addInputSetting (TMPlugin.Shooting.Parameters.shot, 'shot');
  addInputSetting (TMPlugin.Shooting.Parameters.hold, 'hold');  
}) ();
//So far
TMPlugin.Shooting.BulletSizeTable = [0];
TMPlugin.Shooting.Parameters ['bulletSizeTable']. Split (','). ForEach (function (size) {
  TMPlugin.Shooting.BulletSizeTable.push (+ size / 48);
});

TMPlugin.Shooting.BulletBlendTable = [0];
TMPlugin.Shooting.Parameters ['bulletBlendTable']. Split (','). ForEach (function (blendMode) {
  TMPlugin.Shooting.BulletBlendTable.push (+ blendMode);
});

function Game_Bullet () {
  this.initialize.apply (this, arguments);
}

function Game_PlayerBullet () {
    this.initialize.apply (this, arguments);
}

function Game_EnemyBullet () {
    this.initialize.apply (this, arguments);
}

(function () {

  // ------------------------------------------------------------------------ -----------------------------
  // Game_System
  //

  var _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call (this);
    this._playerShotEnabled = true;
    this._playerShotEnabledMessage = true;
    this._enemyShotEnabled = true;
    this._enemyShotEnabledMessage = true;
  };

  Game_System.prototype.isPlayerShotEnabled = function () {
    if (! this._playerShotEnabledMessage && $ gameMessage.isBusy ()) return false;
    return this._playerShotEnabled;
  };

  Game_System.prototype.setPlayerShotEnabled = function (value, flag) {
    if (flag === 'message') {
      this._playerShotEnabledMessage = value;
    } else {
      this._playerShotEnabled = value;
    }
  };

  Game_System.prototype.isEnemyShotEnabled = function () {
    if (! this._enemyShotEnabledMessage && $ gameMessage.isBusy ()) return false;
    return this._enemyShotEnabled;
  };

  Game_System.prototype.setEnemyShotEnabled = function (value, flag) {
    if (flag === 'message') {
      this._enemyShotEnabledMessage = value;
    } else {
      this._enemyShotEnabled = value;
    }
  };
  
  // ------------------------------------------------------------------------ -----------------------------
  // Game_Action
  //

  var _Game_Action_setSubject = Game_Action.prototype.setSubject;
  Game_Action.prototype.setSubject = function (subject) {
    _Game_Action_setSubject.call (this, subject);
    if (this._subjectActorId === 0 && this._subjectEnemyIndex <0) {
      this._subjectEnemyIndex = subject.screenX ();
    }
  };

  var _Game_Action_subject = Game_Action.prototype.subject;
  Game_Action.prototype.subject = function () {
    if (this._subjectActorId === 0 && this._subjectEnemyIndex <0) {
      return $ gameMap.bulletEvent (-this._subjectEnemyIndex) .battler ();
    } else {
      return _Game_Action_subject.call (this);
    }
  };

  // ------------------------------------------------------------------------ -----------------------------
  // Game_Actor
  //

  var _Game_Actor_changeExp = Game_Actor.prototype.changeExp;
  Game_Actor.prototype.changeExp = function (exp, show) {
    var lastLevel = this._level;
    _Game_Actor_changeExp.call (this, exp, show);
    if (TMPlugin.Shooting.LevelUpAnimeId && this._level> lastLevel) {
      var members = $ gameParty.battleMembers ();
      for (var i = 0; i <members.length; i ++) {
        if (members [i] .actorId () === this.actorId ()) {
          if (i === 0) {
            $ gamePlayer.requestAnimation (TMPlugin.Shooting.LevelUpAnimeId);
          } else {
            $ gamePlayer.followers (). follower (i - 1) .requestAnimation (TMPlugin.Shooting.LevelUpAnimeId);
          }
        }
      }
    }
  };

  var _Game_Actor_shouldDisplayLevelUp = Game_Actor.prototype.shouldDisplayLevelUp;
  Game_Actor.prototype.shouldDisplayLevelUp = function () {
    if (! TMPlugin.Shooting.UseLevelUpMessage) return false;
    return _Game_Actor_shouldDisplayLevelUp.call (this);
  };

  var _ Game _ Actor refresh = Game _ Actor.prototype.refresh;
  Game_Actor.prototype.refresh = function () {
    _Game_Actor_refresh.call (this);
    this.refreshShotParam ();
    this.refreshDeadCharacter ();
  };

  Game_Actor.prototype.refreshDeadCharacter = function () {
    var actor = this.actor ();
    var deadCharacter = actor.meta.deadCharacter;
    if (deadCharacter) {
      deadCharacter = deadCharacter.split (',');
      this._deadCharacterName = deadCharacter [0];
      this._deadCharacterIndex = + deadCharacter [1];
    } else {
      this._deadCharacterName = null;
      this._deadCharacterIndex = null;
    }
  };
  
  Game_Actor.prototype.refreshShotParam = function () {
    this._shotParams = {};
    var data = this.actor ();
    this._shotParams.way = + (data.meta.shotWay || 0);
    this._shotParams.space = + (data.meta.shotSpace || 0);
    this._shotParams.speed    = +(data.meta.shotSpeed || 0);
    this._shotParams.count    = +(data.meta.shotCount || 0);
    this._shotParams.interval = +(data.meta.shotInterval || 0);
    this._shotParams.invincible = +(data.meta.shotInvincible || 0);
    var items = this.equips().concat(this.states());
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item) {
        this._shotParams.way      += +(item.meta.shotWay || 0);
        this._shotParams.space    += +(item.meta.shotSpace || 0);
        this._shotParams.speed    += +(item.meta.shotSpeed || 0);
        this._shotParams.count    += +(item.meta.shotCount || 0);
        this._shotParams.interval += +(item.meta.shotInterval || 0);
        this._shotParams.invincible += +(item.meta.shotInvincible || 0);
      }
    }
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item) {
        this._shotParams.interval *= +(item.meta.shotIntervalRate || 1);
      }
    }
    var weapon = this.weapons()[0];
    if (weapon) {
      this._shotParams.type    = +(weapon.meta.shotType || 1);
      this._shotParams.index   = +(weapon.meta.shotIndex || 0);
      this._shotParams.skillId = +(weapon.meta.shotSkill || this.attackSkillId());
      this._shotParams.seName = weapon.meta.shotSeName;
      this._shotParams.seVolume = +(weapon.meta.shotSeVolume || 90);
      this._shotParams.sePitch = +(weapon.meta.shotSePitch || 100);
    } else {
      this._shotParams.type    = 1;
      this._shotParams.index   = 0;
      this._shotParams.skillId = this.attackSkillId();
      this._shotParams.seName = null;
    }
    var items = this.states();
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item) {
        if (item.meta.shotType)  this._shotParams.type = +item.meta.shotType;
        if (item.meta.shotIndex) this._shotParams.index = +item.meta.shotIndex;
        if (item.meta.shotSkill) this._shotParams.skillId = +item.meta.shotSkill;
      }
    }
  };
  
  Game_Actor.prototype.shotParams = function() {
    return this._shotParams;
  };
  
  Game_Actor.prototype.deadCharacterName = function() {
    return this._deadCharacterName;
  };

  Game_Actor.prototype.deadCharacterIndex = function() {
    return this._deadCharacterIndex;
  };
  
  //-----------------------------------------------------------------------------
  // Game_MapGenerator
  //

  if (Imported.SAN_MapGenerator) {

    // 非地面タイルを通路タイルに変換
    var _Game_MapGenerator_notGroundToPass = Game_MapGenerator.prototype.notGroundToPass;
    Game_MapGenerator.prototype.notGroundToPass = function(x, y) {
      _Game_MapGenerator_notGroundToPass.call(this, x, y);
      $gameMap.setBulletPassageTableXy(x, y, true);
    };

    // 指定したタイルを空白タイルに変換
    var _Game_MapGenerator_anyToSpace = Game_MapGenerator.prototype.anyToSpace;
    Game_MapGenerator.prototype.anyToSpace = function(x, y) {
      _Game_MapGenerator_anyToSpace.call(this, x, y);
      $gameMap.setBulletPassageTableXy(x, y, false);
    };

    // 大部屋
    var _Game_MapGenerator_bigRoom = Game_MapGenerator.prototype.bigRoom;
    Game_MapGenerator.prototype.bigRoom = function() {
      _Game_MapGenerator_bigRoom.call(this);
      $gameMap.createBulletPassageTable();
    };

  }

  //-----------------------------------------------------------------------------
  // Game_Map
  //

  // セットアップ
  var _Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup.call(this, mapId);
    this.setupBullets();
    this.createBulletPassageTable();
    if (TMPlugin.Shooting.ResetDeadSwitch) {
      this.events().forEach(function(event) {
        var key = [mapId, event.eventId(), TMPlugin.Shooting.DeadSwitch];
        $gameSelfSwitches.setValue(key, false);
      });
    }
  };

  // イベントのセットアップ
  var _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
  Game_Map.prototype.setupEvents = function() {
    this._eventIdCount = 0;
    _Game_Map_setupEvents.call(this);
  };

  Game_Map.prototype.issueEventIdCount = function() {
    this._eventIdCount++;
    return this._eventIdCount;
  };

  Game_Map.prototype.bulletEvent = function(ownerId) {
    for (var i = 1; i < this._events.length; i++) {
      if (this._events[i].ownerId() === ownerId) return this._events[i];
    }
    return null;
  };

  // 弾のセットアップ
  Game_Map.prototype.setupBullets = function() {
    this._playerBullets = [];
    this._alivePlayerBullets = [];
    this._blankPlayerBullets = [];
    for (var i = 0; i < TMPlugin.Shooting.MaxPlayerBullet; i++) {
      this._playerBullets.push(new Game_PlayerBullet());
      this._blankPlayerBullets.push(i);
    }
    this._enemyBullets = [];
    this._aliveEnemyBullets = [];
    this._blankEnemyBullets = [];
    for (var i = 0; i < TMPlugin.Shooting.MaxEnemyBullet; i++) {
      this._enemyBullets.push(new Game_EnemyBullet());
      this._blankEnemyBullets.push(i);
    }
  };

  Game_Map.prototype.playerBullets = function() {
    return this._playerBullets;
  };

  Game_Map.prototype.enemyBullets = function() {
    return this._enemyBullets;
  };
  
  // 弾の通行チェックに利用するテーブルを作成する
  Game_Map.prototype.createBulletPassageTable = function() {
    var flags = this.tilesetFlags();
    this._bulletPassageTable = [];
    for (var x = 0; x < $dataMap.width; x++) {
      this._bulletPassageTable.push([]);
      for (var y = 0; y < $dataMap.height; y++) {
        if (this.regionId(x, y) === TMPlugin.Shooting.BulletBlockRegion) {
          this._bulletPassageTable[x][y] = false;
          continue;
        }
        var passage = false;
        var tiles = this.layeredTiles(x, y);
        for (var i = 0; i < tiles.length; i++) {
          var flag = flags[tiles[i]];
          if (flag >> 12 === TMPlugin.Shooting.BulletBlockTag) {
            passage = false;
            break;
          };
          if ((flag & 0x10) !== 0) continue;
          if ((flag & 0x0f) !== 0x0f) {
            passage = true;
            break;
          }
          if ((flag & 0x0f) !== 0) break;
        }
        this._bulletPassageTable[x][y] = passage;
      }
    }
  };

  Game_Map.prototype.setBulletPassageTableXy = function(x, y, flag) {
    this._bulletPassageTable[x][y] = flag;
  };

  // 弾の通行チェック
  Game_Map.prototype.checkPassageBullet = function(x, y) {
    return this.isValid(x, y) && this._bulletPassageTable[x][y];
  };

  // フレーム更新
  var _Game_Map_update = Game_Map.prototype.update;
  Game_Map.prototype.update = function(sceneActive) {
    _Game_Map_update.call(this, sceneActive);
    this.updateBullets();
  };

  // 弾の更新
  Game_Map.prototype.updateBullets = function() {
    for (var i = this._alivePlayerBullets.length - 1; i >= 0; i--) {
      var index = this._alivePlayerBullets[i];
      if (!this._playerBullets[index].update()) {
        this._alivePlayerBullets.splice(i, 1);
        this._blankPlayerBullets.push(index);
      }
    }
    for (var i = this._aliveEnemyBullets.length - 1; i >= 0; i--) {
      var index = this._aliveEnemyBullets[i];
      if (!this._enemyBullets[index].update()) {
        this._aliveEnemyBullets.splice(i, 1);
        this._blankEnemyBullets.push(index);
      }
    }
  };

  // 弾の追加
  Game_Map.prototype.addBullet = function(x, y, z, vx, vy, angle, count, type,
                                          index, skillId, ownerId) {
    if (ownerId < 0) {
      if (this._blankPlayerBullets.length > 0) {
        var bulletIndex = this._blankPlayerBullets.shift();
        this._playerBullets[bulletIndex].setup(x, y, z, vx, vy, angle, count,
                                               type, index, skillId, ownerId);
        this._alivePlayerBullets.push(bulletIndex);
      }
    } else {
      if (this._blankEnemyBullets.length > 0) {
        var bulletIndex = this._blankEnemyBullets.shift();
        this._enemyBullets[bulletIndex].setup(x, y, z, vx, vy, angle, count,
                                              type, index, skillId, ownerId);
        this._aliveEnemyBullets.push(bulletIndex);
      }
    }
  };

  // プレイヤー弾の全削除
  Game_Map.prototype.clearPlayerBullets = function() {
    this._alivePlayerBullets.forEach(function(index) {
      this._playerBullets[index].erase();
    }, this);
    this._blankPlayerBullets.concat(this._alivePlayerBullets);
    this._alivePlayerBullets = [];
  };

  // エネミー弾の全削除
  Game_Map.prototype.clearEnemyBullets = function() {
    this._aliveEnemyBullets.forEach(function(index) {
      this._enemyBullets[index].erase();
    }, this);
    this._blankEnemyBullets.concat(this._aliveEnemyBullets);
    this._aliveEnemyBullets = [];
  };

  // すべての弾を削除
  Game_Map.prototype.clearAllBullets = function() {
    this.clearPlayerBullets();
    this.clearEnemyBullets();
  };

  // SAN_MapGenerator.js に対応
  if (Imported.SAN_MapGenerator) {
    var _Game_Map_generateMap = Game_Map.prototype.generateMap;
    Game_Map.prototype.generateMap = function(mapType) {
      _Game_Map_generateMap.call(this, mapType);
      this.createBulletPassageTable();
    };
  }

  //-----------------------------------------------------------------------------
  // Game_Bullet
  //

  // 初期化
  Game_Bullet.prototype.initialize = function() {
    this._opacity = 0;
  };

  // セットアップ
  Game_Bullet.prototype.setup = function(x, y, z, vx, vy, angle, count, type,
                                         index, skillId, ownerId) {
    this._opacity = 255;
    this._x = x;
    this._y = y;
    this._z = z;
    this._vx = vx;
    this._vy = vy;
    this._angle = angle;
    this._count = count;
    if (this._type !== type) {
      this._type = type;
      this._bulletName = 'shootingBullet' + type;
      this._collideSize = TMPlugin.Shooting.BulletSizeTable[type];
    }
    this._bulletIndex = index;
    this._skillId = skillId;
    this._ownerId = ownerId;
    var skill = $dataSkills[skillId];
    this._mapCollide = !skill.meta.mapThrough;
    this._penetrate = skill.meta.penetrate;
    this._friendly = skill.scope >= 7;
    this._collidedCharacters = [ownerId];
  };

  // 存在状態判定
  Game_Bullet.prototype.isExist = function() {
    return this._count > 0;
  };

  // 不透明度の取得
  Game_Bullet.prototype.opacity = function() {
    return this._opacity;
  };

  // 画像ファイル名の取得
  Game_Bullet.prototype.bulletName = function() {
    return this._bulletName;
  };

  // 画像ファイルインデックスの取得
  Game_Bullet.prototype.bulletIndex = function() {
    return this._bulletIndex;
  };

  // 弾タイプの取得
  Game_Bullet.prototype.type = function() {
    return this._type;
  };

  // 角度の取得
  Game_Bullet.prototype.angle = function() {
    return this._angle;
  };

  // 画面 X 座標の取得
  Game_Bullet.prototype.screenX = function() {
    var tw = $gameMap.tileWidth();
    return Math.round($gameMap.adjustX(this._x) * tw);
  };

  // 画面 Y 座標の取得
  Game_Bullet.prototype.screenY = function() {
    var th = $gameMap.tileHeight();
    return Math.round($gameMap.adjustY(this._y) * th);
  };

  // 画面 Z 座標の取得
  Game_Bullet.prototype.screenZ = function() {
    return this._z;
  };

  // キャラクターがいる方向（角度）を取得
  Game_Bullet.prototype.angleToCharacter = function(character) {
    return Math.atan2(character._realY - character.collideH / 2 - this._y,
                      character._realX - this._x);
  };

  // プレイヤーがいる方向（角度）を取得
  Game_Bullet.prototype.angleToPlayer = function() {
    return this.angleToCharacter($gamePlayer);
  };

  // フレーム更新
  Game_Bullet.prototype.update = function() {
    this._x += this._vx;
    this._y += this._vy;
    this._count--;
    if (this._count <= 0 || this.updateCollide()) {
      this.erase();
      return false;
    }
    return true;
  };

  // 削除
  Game_Bullet.prototype.erase = function() {
    this._count = 0;
    this._opacity = 0;
  };

  // 弾によるダメージ処理
  Game_Bullet.prototype.executeDamage = function(character) {
    if (character.isShotInvincible()) return;
    if (this._ownerId < 0) {
      var owner = this._ownerId === -1 ? $gamePlayer : $gamePlayer.followers().follower(-this._ownerId - 2);
    } else {
      var owner = this._ownerId > 0 ? $gameMap.bulletEvent(this._ownerId) : null;
    }
    var ownerBattler = owner ? owner.battler() : null;
    var targetBattler = character.battler();
    if (ownerBattler && targetBattler) {
      ownerBattler.clearActions();
      var action = new Game_Action(ownerBattler);
      action.setSkill(this._skillId);
      ownerBattler.setAction(0, action);
      ownerBattler.currentAction().apply(targetBattler);
      if (targetBattler.result().isHit()) {
        var animeId = action.item().meta.bulletAnime;
        if (animeId) character.requestAnimation(+animeId);
        character.setShotInvincible();
      }
      if (targetBattler.result().isStateAdded(targetBattler.deathStateId())) {
        character.battlerDead();
      }
      if (Game_CharacterBase.prototype.popupDamage) {
        this.showDamagePopup(character, owner);
      }
      targetBattler.clearResult();
    }
  };

  // ダメージポップアップの表示
  Game_Bullet.prototype.showDamagePopup = function(character, owner) {
    var result = character.battler().result();
    if (result.isHit()) {
      var damageType = $dataSkills[this._skillId].damage.type;
      if (damageType > 0 && damageType % 2 === 1) {
        character.popupDamage(result.hpDamage, result.critical);
        if (result.drain) {
          owner.popupDamage(-result.hpDamage, false);
        }
      } else {
        character.popupMpDamage(result.mpDamage, result.critical);
        if (result.drain) {
          owner.popupMpDamage(-result.mpDamage, false);
        }
      }
    } else {
      character.popupMiss();
    }
  };
  
  // キャラクターと接触しているかどうかを返す
  Game_Bullet.prototype.isCollidedWithCharacter = function(character) {
    var x = character._realX + 0.5 - this._x;
    var y = character._realY + 1 - this._y;
    return -this._collideSize <= x + character._collideW &&
           this._collideSize >= x - character._collideW &&
           -this._collideSize <= y &&
           this._collideSize >= y - character._collideH;
  };

  // イベントキャラクターと接触しているかどうかを返す
  Game_Bullet.prototype.isCollidedWithEvents = function() {
    var events = $gameMap.events();
    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      if (!event._through && this.isCollidedWithCharacter(event)) {
        if (this._collidedCharacters.indexOf(event.ownerId()) === -1) {
          this.executeDamage(event);
          this._collidedCharacters.push(event.ownerId());
          return !this._penetrate;
        }
      }
    }
    return false;
  };

  // プレイヤーキャラクターと接触しているかどうかを返す
  Game_Bullet.prototype.isCollidedWithPlayerCharacter = function() {
    if (this.isCollidedWithCharacter($gamePlayer)) {
      var battler = $gamePlayer.battler();
      if (battler && battler.isAlive() &&
          this._collidedCharacters.indexOf($gamePlayer.ownerId()) === -1) {
        this.executeDamage($gamePlayer);
        this._collidedCharacters.push($gamePlayer.ownerId());
        return !this._penetrate;
      }
    }
    if (TMPlugin.Shooting.InvincibleFollower) return false;
    return $gamePlayer.followers().visibleFollowers().some(function(follower) {
      if (this.isCollidedWithCharacter(follower)) {
        if (follower.battler().isAlive() &&
            this._collidedCharacters.indexOf(follower.ownerId()) === -1) {
          this.executeDamage(follower);
          this._collidedCharacters.push(follower.ownerId());
          return !this._penetrate;
        }
      }
      return false;
    }, this);
  };

  // マップと接触しているかどうかを返す
  Game_Bullet.prototype.isCollideMap = function() {
    var x = Math.floor(this._x);
    var y = Math.floor(this._y);
    return !$gameMap.checkPassageBullet(x, y);
  }

  //-----------------------------------------------------------------------------
  // Game_PlayerBullet
  //

  Game_PlayerBullet.prototype = Object.create(Game_Bullet.prototype);
  Game_PlayerBullet.prototype.constructor = Game_PlayerBullet;

  // 接触判定
  Game_PlayerBullet.prototype.updateCollide = function() {
    if (this._mapCollide && this.isCollideMap()) return true;
    if (this._friendly) return this.isCollidedWithPlayerCharacter();
    return this.isCollidedWithEvents();
  };

  //-----------------------------------------------------------------------------
  // Game_EnemyBullet
  //

  Game_EnemyBullet.prototype = Object.create(Game_Bullet.prototype);
  Game_EnemyBullet.prototype.constructor = Game_EnemyBullet;

  // 接触判定
  Game_EnemyBullet.prototype.updateCollide = function() {
    if (this._mapCollide && this.isCollideMap()) return true;
    if (this._friendly) return this.isCollidedWithEvents();
    return this.isCollidedWithPlayerCharacter();
  };

  //-----------------------------------------------------------------------------
  // Game_DummyBullet
  //

  function Game_DummyBullet() {
      this.initialize.apply(this, arguments);
  }

  Game_DummyBullet.prototype = Object.create(Game_Bullet.prototype);
  Game_DummyBullet.prototype.constructor = Game_DummyBullet;

  // 画面 X 座標の取得
  Game_DummyBullet.prototype.screenX = function() {
    var tw = $gameMap.tileWidth();
    return Math.round(this._x * tw);
  };

  // 画面 Y 座標の取得
  Game_DummyBullet.prototype.screenY = function() {
    var th = $gameMap.tileHeight();
    return Math.round(this._y * th);
  };

  // 接触判定
  Game_DummyBullet.prototype.updateCollide = function() {
    return false;
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase
  //

  var _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    _Game_CharacterBase_update.call(this);
    if (this._shotInvincible == null) this._shotInvincible = 0;
    if (this._shotInvincible > 0) this._shotInvincible--;
  };

  // 無敵状態かどうかを返す
  Game_Character.prototype.isShotInvincible = function() {
    if (this._shotInvincible == null) this._shotInvincible = 0;
    return this._shotInvincible > 0;
  };

  // 無敵時間のセット
  Game_Character.prototype.setShotInvincible = function() {
    var battler = this.battler();
    if (battler) {
      var shotParams = battler.shotParams();
      this._shotInvincible = shotParams.invincible;
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Character
  //

  // メンバ変数の初期化
  var _Game_Character_initMembers = Game_Character.prototype.initMembers;
  Game_Character.prototype.initMembers = function() {
    _Game_Character_initMembers.call(this);
    this._collideW     = 0.375;
    this._collideH     = 0.75;
    this._shiftFiringY = 0;
    this._shotDelay    = 0;
  };

  // イベントIDを返す（TMBossHpGauge.jsとの連携のため）
  Game_Character.prototype.eventId = function() {
    return -1;
  };

  // キャラクターのいる方向（角度）を取得
  Game_Character.prototype.angleToCharacter = function(character) {
    return Math.atan2(character._realY - character._collideH / 2 - (this._realY - this._collideH / 2),
                      character._realX - this._realX);
  };

  // プレイヤーのいる方向（角度）を取得
  Game_Character.prototype.angleToPlayer = function() {
    return this.angleToCharacter($gamePlayer);
  };
  
  // ｎ方向ショット
  Game_Character.prototype.nwayShot = function(n, space, angle, speed, count,
                                               type, index, skillId) {
    var ownerId = this.ownerId();
    if (ownerId < 0) {
      if (!$gameSystem.isPlayerShotEnabled()) return false;
    } else {
      if (!$gameSystem.isEnemyShotEnabled()) return false;
    }
    angle = angle - (space * (n - 1) / 2);
    var x = this._realX + 0.5;
    var y = this._realY + 1 - (this.shiftY() - this._shiftFiringY) / $gameMap.tileHeight() -
            this._collideH / 2;
    for (var i = 0; i < n; i++) {
      $gameMap.addBullet(x, y, 200 + i, Math.cos(angle) * speed,
                         Math.sin(angle) * speed, angle, count, type, index,
                         skillId, ownerId);
      angle += space;
    }
    return true;
  };

  // 自機狙いｎ方向ショット
  Game_Character.prototype.nwayAim = function(n, space, angle, speed, count,
                                              type, index, skillId) {
    var a = angle + this.angleToPlayer();
    this.nwayShot(n, space, a, speed, count, type, index, skillId);
  };

  // 全方位ショット
  Game_Character.prototype.nallShot = function(n, angle, speed, count, type,
                                               index, skillId) {
    var ownerId = this.ownerId();
    if (ownerId < 0) {
      if (!$gameSystem.isPlayerShotEnabled()) return;
    } else {
      if (!$gameSystem.isEnemyShotEnabled()) return;
    }
    var space = Math.PI * 2 / n;
    var x = this._realX + 0.5;
    var y = this._realY + 1 - (this.shiftY() - this._shiftFiringY) / $gameMap.tileHeight() -
            this._collideH / 2;
    for (var i = 0; i < n; i++) {
      $gameMap.addBullet(x, y, 200 + i, Math.cos(angle) * speed,
                         Math.sin(angle) * speed, angle, count, type, index,
                         skillId, ownerId);
      angle += space;
    }
  };

  // 自機狙い全方位ショット
  Game_Character.prototype.nallAim = function(n, angle, speed, count, type,
                                              index, skillId) {
    var a = angle + this.angleToPlayer()
    this.nallShot(n, a, speed, count, type, index, skillId);
  };
  
  // プレイヤー（フォロワー）のショット処理
  Game_Character.prototype.executeShot = function() {
    var battler = this.battler();
    if (battler && battler.canMove()) {
      var shotParams = battler.shotParams();
      if (shotParams.way > 0) {
        var angle = this._shotAngle == null ? this.shotAngleFromDirection() : this._shotAngle;
        this._shotDelay = shotParams.interval;
        return this.nwayShot(shotParams.way, shotParams.space, angle, shotParams.speed,
                             shotParams.count, shotParams.type, shotParams.index,
                             shotParams.skillId);
      }
    }
    return false;
  };

  // 向いている方向から弾発射角度を返す
  Game_Character.prototype.shotAngleFromDirection = function() {
    if (Imported.SAN_AnalogMove) {
      if (Sanshiro.AnalogMove && Sanshiro.AnalogMove.version.slice(0, 1) === '3') {
        if (this.hasMover()) return this.mover()._velVec.dir();
      } else {
        return -this.analogMove()._directionRadian - Math.PI / 2;
      }
    } else {
      if (this._direction === 2) {
        return 1.570796;
      } else if (this._direction === 4) {
        return Math.PI;
      } else if (this._direction === 6) {
        return 0;
      } else {
        return 4.712388;
      }
    }
  };

  // 発射方向を現在向いている方向に固定する
  Game_Character.prototype.holdShotAngle = function(release) {
    this._shotAngle = release ? null : this.shotAngleFromDirection();
  };

  // バトラーが戦闘不能になったときの処理
  Game_Character.prototype.battlerDead = function() {
    var animeId = this._deadAnime || TMPlugin.Shooting.DefaultDeadAnimeId;
    if (animeId) this.requestAnimation(animeId);
  };

  //-----------------------------------------------------------------------------
  // Game_Player
  //

  // メンバ変数の初期化
  var _Game_Player_initMembers = Game_Player.prototype.initMembers;
  Game_Player.prototype.initMembers = function() {
    _Game_Player_initMembers.call(this);
    this._autoShot = false;
  };
  
  // オート射撃のセット
  Game_Player.prototype.setAutoShot = function(autoShot) {
    this._autoShot = autoShot;
  };

  // バトラーを返す
  Game_Player.prototype.battler = function() {
    return $gameParty.leader();
  };

  // オーナーIDを返す
  Game_Player.prototype.ownerId = function() {
    return -1;
  };

  // 向き固定状態かどうかを返す
  var _Game_Player_isDirectionFixed = Game_Player.prototype.isDirectionFixed;
  Game_Player.prototype.isDirectionFixed = function() {
    if (this.isMoveRouteForcing()) return _Game_Player_isDirectionFixed.call(this);
    if (this._shotHold == null) this._shotHold = false;
    return this._shotHold;
  };

  // フレーム更新
  var _Game_Player_update = Game_Player.prototype.update;
  Game_Player.prototype.update = function(sceneActive) {
    if (sceneActive) {
      this.holdByInput();
      this.shotByInput();
    }
    _Game_Player_update.call(this, sceneActive);
  };

  // ボタン入力による向き固定
  Game_Player.prototype.holdByInput = function() {
    if (TMPlugin.Shooting.HoldType === 'SWITCH') {
      if (Input.isTriggered('hold')) {
        this._shotHold = !this._shotHold;
        this.holdShotAngle(!this._shotHold);
        this._followers.holdShotAngle(!this._shotHold);
      }
    } else {
      var lastShotHold = this._shotHold;
      this._shotHold = Input.isPressed('hold');
      if (this._shotHold !== lastShotHold) {
        this.holdShotAngle(!this._shotHold);
        this._followers.holdShotAngle(!this._shotHold);
      }
    }
  };

  // ボタン入力による攻撃
  Game_Player.prototype.shotByInput = function() {
    var shotInput = Input.isPressed('shot') || this._autoShot;
    if (this._shotDelay > 0) {
      this._shotDelay--;
    } else if (shotInput) {
      if (this.executeShot()) {
        var shotParams = this.battler().shotParams();
        if (shotParams.seName) {
          AudioManager.playSe({name:shotParams.seName, volume:shotParams.seVolume,
                               pitch:shotParams.sePitch, pan:0});
        } else if (TMPlugin.Shooting.LeaderShotSe) {
          AudioManager.playSe(TMPlugin.Shooting.LeaderShotSe);
        }
      }
    }
    this._followers.shotByInput(shotInput);
  };
  
  // リフレッシュ
  var _Game_Player_refresh = Game_Player.prototype.refresh;
  Game_Player.prototype.refresh = function() {
    _Game_Player_refresh.call(this);
    var actor = $gameParty.leader();
    if (actor) {
      var data = actor.actor();
      this._collideW     = +(data.meta.cw || 0.375);
      this._collideH     = +(data.meta.ch || 0.75);
      this._shiftFiringY = +(data.meta.shiftFiringY || 0);
      this._deadAnime    = +(data.meta.deadAnime || 0);
    }
  };

  var _Game_Player_characterName = Game_Player.prototype.characterName;
  Game_Player.prototype.characterName = function() {
    var actor = $gameParty.leader();
    if (actor && actor.isDead()) {
      var deadCharacterName = actor.deadCharacterName();
      if (deadCharacterName) return deadCharacterName;
    }
    return _Game_Player_characterName.call(this);
  };

  var _Game_Player_characterIndex = Game_Player.prototype.characterIndex;
  Game_Player.prototype.characterIndex = function() {
    var actor = $gameParty.leader();
    if (actor && actor.isDead()) {
      var deadCharacterIndex = actor.deadCharacterIndex();
      if (deadCharacterIndex !== null) return deadCharacterIndex;
    }
    return _Game_Player_characterIndex.call(this);
  };

  // バトラーが戦闘不能になったときの処理
  Game_Player.prototype.battlerDead = function() {
    Game_Character.prototype.battlerDead.call(this);
    if (TMPlugin.Shooting.PlayerDeadEventId) {
      $gameTemp.reserveCommonEvent(TMPlugin.Shooting.PlayerDeadEventId);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Follower
  //

  // バトラーを返す
  Game_Follower.prototype.battler = function() {
    return this.actor();
  };

  // オーナーIDを返す
  Game_Follower.prototype.ownerId = function() {
    return -this._memberIndex - 1;
  };

  var _Game_Follower_refresh = Game_Follower.prototype.refresh;
  Game_Follower.prototype.refresh = function() {
    _Game_Follower_refresh.call(this);
    var actor = this.actor();
    if (actor) {
      var data = actor.actor();
      this._collideW     = +(data.meta.cw || 0.375);
      this._collideH     = +(data.meta.ch || 0.75);
      this._shiftFiringY = +(data.meta.shiftFiringY || 0);
      this._deadAnime    = +(data.meta.deadAnime || 0);
    }
  };

  Game_Follower.prototype.shotByInput = function(shotInput) {
    if (this._shotDelay > 0) {
      this._shotDelay--;
    } else if (shotInput) {
      this.executeShot();
    }
  };
  
  var _Game_Follower_characterName = Game_Follower.prototype.characterName;
  Game_Follower.prototype.characterName = function() {
    var actor = this.actor();
    if (actor && actor.isDead()) {
      var deadCharacterName = actor.deadCharacterName();
      if (deadCharacterName) {
        return deadCharacterName;
      }
    }
    return _Game_Follower_characterName.call(this);
  };

  var _Game_Follower_characterIndex = Game_Follower.prototype.characterIndex;
  Game_Follower.prototype.characterIndex = function() {
    var actor = this.actor();
    if (actor && actor.isDead()) {
      var deadCharacterIndex = actor.deadCharacterIndex();
      if (deadCharacterIndex !== null) {
        return deadCharacterIndex;
      }
    }
    return _Game_Follower_characterIndex.call(this);
  };

  //-----------------------------------------------------------------------------
  // Game_Followers
  //

  Game_Followers.prototype.holdShotAngle = function(release) {
    this.forEach(function(follower) {
        follower.holdShotAngle(release);
    }, this);
  };

  Game_Followers.prototype.shotByInput = function(shotInput) {
    this.forEach(function(follower) {
        follower.shotByInput(shotInput);
    }, this);
  };

  //-----------------------------------------------------------------------------
  // Game_Event
  //

  // メンバ変数の初期化
  var _Game_Event_initMembers = Game_Event.prototype.initMembers;
  Game_Event.prototype.initMembers = function() {
    _Game_Event_initMembers.call(this);
    this._ownerId = $gameMap.issueEventIdCount();
    this._enemyId = 0;
    this._battler = null;
    this._deadSelfSwitch = null;
  };

  // バトラーを返す
  Game_Event.prototype.battler = function() {
    return this._battler;
  };

  // オーナーIDを返す
  Game_Event.prototype.ownerId = function() {
    return this._ownerId;
  };

  // イベントページのセットアップ
  var _Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    _Game_Event_setupPage.call(this);
    if (this._pageIndex >= 0) {
      var data = this.event();
      this._enemyId = +(data.meta.enemy || 0);
      if (this._enemyId > 0) {
        this._battler = new Game_Enemy(this._enemyId, -this._ownerId, 0);
        this._collideW = +(data.meta.cw || 0.375);
        this._collideH = +(data.meta.ch || 0.75);
        this._shiftFiringY = +(data.meta.shiftFiringY || 0);
        var enemy = this._battler.enemy();
        this._deadAnime = +(enemy.meta.deadAnime || 0);
      } else {
        this._battler = null;
      }
    }
  };

  // 無敵時間のセット
  Game_Event.prototype.setShotInvincible = function() {
  };

  // バトラーが戦闘不能になったときの処理
  Game_Event.prototype.battlerDead = function() {
    this.gainRewards();
    if (TMPlugin.Shooting.DeadSwitch) {
      var key = [$gameMap.mapId(), this._eventId, TMPlugin.Shooting.DeadSwitch];
      $gameSelfSwitches.setValue(key, true);
    }
    Game_Character.prototype.battlerDead.call(this);
  };
  
  Game_Event.prototype.gainRewards = function() {
    this.gainExp();
    this.gainGold();
    var items = this.battler().makeDropItems();
    for (var i = 0; i < items.length; i++) {
      this.gainRewardItem(items[i]);
    }
  };
  
  Game_Event.prototype.gainExp = function() {
    var exp = this.battler().exp()
    if (exp > 0) {
      if (Imported['GetInformation']) {
        CommonPopupManager._popEnable = CommonPopupManager.popEnable();
      }
      $gameParty.allMembers().forEach(function(actor) {
        actor.gainExp(exp);
      });
      if (Imported['GetInformation']) {
        CommonPopupManager._popEnable = false;
      }
    }
  };
  
  Game_Event.prototype.gainGold = function() {
    gold = this.battler().gold();
    if (gold > 0) {
      if (Imported['GetInformation']) {
        CommonPopupManager._popEnable = CommonPopupManager.popEnable();
      }
      $gameParty.gainGold(gold * ($gameParty.hasGoldDouble() ? 2 : 1));
      if (Imported['GetInformation']) {
        CommonPopupManager._popEnable = false;
      }
    }
  };

  Game_Event.prototype.gainRewardItem = function(item) {
    if (Imported['GetInformation']) {
      CommonPopupManager._popEnable = CommonPopupManager.popEnable();
    }
    $gameParty.gainItem(item, 1);
    if (Imported['GetInformation']) {
      CommonPopupManager._popEnable = false;
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'startAutoShot') {
      $gamePlayer.setAutoShot(true);
    } else if (command === 'stopAutoShot') {
      $gamePlayer.setAutoShot(false);
    } else if (command === 'nwayShot') {
      var character = this.character(0);
      var battler = character.battler();
      if (battler.canMove()) {
        character.nwayShot.apply(character, args.map(Number));
      }
    } else if (command === 'nwayAim') {
      var character = this.character(0);
      var battler = character.battler();
      if (battler.canMove()) {
        character.nwayAim.apply(character, args.map(Number));
      }
    } else if (command === 'nallShot') {
      var character = this.character(0);
      var battler = character.battler();
      if (battler.canMove()) {
        character.nallShot.apply(character, args.map(Number));
      }
    } else if (command === 'nallAim') {
      var character = this.character(0);
      var battler = character.battler();
      if (battler.canMove()) {
        character.nallAim.apply(character, args.map(Number));
      }
    } else if (command === 'stopPlayerShot') {
      $gameSystem.setPlayerShotEnabled(false, args[0]);
    } else if (command === 'startPlayerShot') {
      $gameSystem.setPlayerShotEnabled(true, args[0]);
    } else if (command === 'stopEnemyShot') {
      $gameSystem.setEnemyShotEnabled(false, args[0]);
    } else if (command === 'startEnemyShot') {
      $gameSystem.setEnemyShotEnabled(true, args[0]);
    } else if (command === 'deletePlayerBullets') {
      $gameMap.clearPlayerBullets();
    } else if (command === 'deleteEnemyBullets') {
      $gameMap.clearEnemyBullets();
    } else if (command === 'forceShot') {
      if (args[0] == null) {
        $gamePlayer.executeShot();
        $gamePlayer.followers().forEach(function(follower) {
          follower.executeShot();
        }, null);
      } else {
        if (+args[0] === 0) {
          $gamePlayer.executeShot();
        } else {
          $gamePlayer.followers().follower(+args[0] - 1).executeShot();
        }
      }
    }
  };
  
  //-----------------------------------------------------------------------------
  // Sprite_Bullet
  //

  function Sprite_Bullet() {
    this.initialize.apply(this, arguments);
  }

  Sprite_Bullet.prototype = Object.create(Sprite.prototype);
  Sprite_Bullet.prototype.constructor = Sprite_Bullet;

  // 初期化
  Sprite_Bullet.prototype.initialize = function(bullet) {
    Sprite.prototype.initialize.call(this);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._bullet = bullet;
    this._bulletName  = '';
    this._bulletIndex = 0;
  };

  // フレーム更新
  Sprite_Bullet.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.opacity = this._bullet.opacity();
    if (this.opacity > 0) {
      this.updateBitmap();
      this.x = this._bullet.screenX();
      this.y = this._bullet.screenY();
      this.z = this._bullet.screenZ();
      this.rotation = this._bullet.angle();
    }
  };

  // 転送元ビットマップの更新
  Sprite_Bullet.prototype.updateBitmap = function() {
    if (this._bulletName !== this._bullet.bulletName() ||
        this._bulletIndex !== this._bullet.bulletIndex()) {
      this._bulletName = this._bullet.bulletName();
      this._bulletIndex = this._bullet.bulletIndex();
      this.setBulletBitmap();
    }
  };

  // ビットマップの設定
  Sprite_Bullet.prototype.setBulletBitmap = function() {
    this.bitmap = ImageManager.loadSystem(this._bulletName);
    if (this.bitmap.width === 0) {
      this._bulletName = '';
    } else {
      var pw = Math.floor(this.bitmap.width / 8);
      var sx = this._bulletIndex % 8 * pw;
      var sy = Math.floor(this._bulletIndex / 8) * pw;
      this.setFrame(sx, sy, pw, pw);
      this.blendMode = TMPlugin.Shooting.BulletBlendTable[this._bullet.type()];
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_EquipDummy
  //

  function Sprite_EquipDummy() {
    this.initialize.apply(this, arguments);
  }

  Sprite_EquipDummy.prototype = Object.create(Sprite.prototype);
  Sprite_EquipDummy.prototype.constructor = Sprite_EquipDummy;

  Sprite_EquipDummy.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.x = TMPlugin.Shooting.EquipDummyX;
    this.y = TMPlugin.Shooting.EquipDummyY;
    this._actor = null;
    this._animationCount = 0;
    this._pattern = 0;
    this._shotShiftY = 0;
  };
  
  Sprite_EquipDummy.prototype.setActor = function(actor) {
    this._actor = actor;
    this._shotShiftY = +(actor.actor().meta.ch || 0.75) / 2;
    this._shiftFiringY = +(actor.actor().meta.shiftFiringY || 0) / $gameMap.tileHeight();
  };

  Sprite_EquipDummy.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    this.updateCharacterFrame();
    this.updateAnimation();
  };
  
  Sprite_EquipDummy.prototype.updateBitmap = function() {
    if (this.isImageChanged()) {
      this._characterName = this._actor.characterName();
      this._characterIndex = this._actor.characterIndex();
      this.setCharacterBitmap();
    }
  };
  
  Sprite_EquipDummy.prototype.isImageChanged = function() {
    return (this._characterName !== this._actor.characterName() ||
            this._characterIndex !== this._actor.characterIndex());
  };

  Sprite_EquipDummy.prototype.setCharacterBitmap = function() {
    this.bitmap = ImageManager.loadCharacter(this._characterName);
    this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
  };
  
  Sprite_EquipDummy.prototype.updateCharacterFrame = function() {
    var pw = this.patternWidth();
    var ph = this.patternHeight();
    var sx = (this.characterBlockX() + this.characterPatternX()) * pw;
    var sy = (this.characterBlockY() + this.characterPatternY()) * ph;
    this.setFrame(sx, sy, pw, ph);
  };

  Sprite_EquipDummy.prototype.characterBlockX = function() {
    if (this._isBigCharacter) {
      return 0;
    } else {
      var index = this._actor.characterIndex();
      return index % 4 * 3;
    }
  };

  Sprite_EquipDummy.prototype.characterBlockY = function() {
    if (this._isBigCharacter) {
      return 0;
    } else {
      var index = this._actor.characterIndex();
      return Math.floor(index / 4) * 4;
    }
  };

  Sprite_EquipDummy.prototype.characterPatternX = function() {
    return this._pattern === 3 ? 1 : this._pattern;
  };

  Sprite_EquipDummy.prototype.characterPatternY = function() {
    return 0;
  };

  Sprite_EquipDummy.prototype.patternWidth = function() {
    return this.bitmap.width / (this._isBigCharacter ? 3 : 12);
  };

  Sprite_EquipDummy.prototype.patternHeight = function() {
    return this.bitmap.height / (this._isBigCharacter ? 4 : 8);
  };

  Sprite_EquipDummy.prototype.updateAnimation = function() {
    this.updateAnimationCount();
    if (this._animationCount >= 18) {
      this.updatePattern();
      this._animationCount = 0;
    }
  };
  
  Sprite_EquipDummy.prototype.updateAnimationCount = function() {
    this._animationCount += 1.5;
  };

  Sprite_EquipDummy.prototype.updatePattern = function() {
    this._pattern = (this._pattern + 1) % 4;
  };

  Sprite_EquipDummy.prototype.shotX = function() {
    return this.x / $gameMap.tileWidth();
  };
  
  Sprite_EquipDummy.prototype.shotY = function() {
    return this.y / $gameMap.tileHeight() - this._shotShiftY + this._shiftFiringY;
  };
  
  //-----------------------------------------------------------------------------
  // Spriteset_Destination
  //

  var _Sprite_Destination_updatePosition = Sprite_Destination.prototype.updatePosition;
  Sprite_Destination.prototype.updatePosition = function() {
    if (Imported.SAN_AnalogMove && Sanshiro.SAN_AnalogMove &&
        Sanshiro.SAN_AnalogMove.version.slice(0, 1) === '1') {
        var tileWidth = $gameMap.tileWidth();
        var tileHeight = $gameMap.tileHeight();
        var x = $gamePlayer.analogMove()._targRealX;
        var y = $gamePlayer.analogMove()._targRealY;
        this.x = $gameMap.adjustX(x) * tileWidth;
        this.y = $gameMap.adjustY(y) * tileHeight;
    } else {
      _Sprite_Destination_updatePosition.call(this);
    }
  };

  //-----------------------------------------------------------------------------
  // Spriteset_Map
  //

  var _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
    _Spriteset_Map_createLowerLayer.call(this);
    this.createBullets();
  };

  // 弾スプライトの作成
  Spriteset_Map.prototype.createBullets = function() {
    this._bulletSprites = [];
    $gameMap.playerBullets().forEach(function(bullet) {
      this._bulletSprites.push(new Sprite_Bullet(bullet));
    }, this);
    $gameMap.enemyBullets().forEach(function(bullet) {
      this._bulletSprites.push(new Sprite_Bullet(bullet));
    }, this);
    for (var i = 0; i < this._bulletSprites.length; i++) {
      this._baseSprite.addChild(this._bulletSprites[i]);
    }
  };


  //-----------------------------------------------------------------------------
  // Scene_Base
  //

  var _Scene_Base_checkGameover = Scene_Base.prototype.checkGameover;
  Scene_Base.prototype.checkGameover = function() {
    if (TMPlugin.Shooting.UseGameover) {
      _Scene_Base_checkGameover.call(this);
    }
  };

  //-----------------------------------------------------------------------------
  // Scene_Equip
  //

  var _Scene_Equip_create = Scene_Equip.prototype.create;
  Scene_Equip.prototype.create = function() {
    this.createDummy();
    this.createBullets();
    _Scene_Equip_create.call(this);
    this.addChild(this._dummySprite);
    for (var i = 0; i < this._bulletSprites.length; i++) {
      this.addChild(this._bulletSprites[i]);
    }
  };
  
  Scene_Equip.prototype.createDummy = function() {
    this._dummySprite = new Sprite_EquipDummy();
    this._shotDelay = 0;
  };
  
  Scene_Equip.prototype.createBullets = function() {
    this._playerBullets = [];
    this._alivePlayerBullets = [];
    this._blankPlayerBullets = [];
    for (var i = 0; i < TMPlugin.Shooting.MaxPlayerBullet; i++) {
      this._playerBullets.push(new Game_DummyBullet());
      this._blankPlayerBullets.push(i);
    }
    this._bulletSprites = [];
    this._playerBullets.forEach(function(bullet) {
      this._bulletSprites.push(new Sprite_Bullet(bullet));
    }, this);
  };

  Scene_Equip.prototype.nwayShot = function(n, space, angle, speed, count,
                                            type, index, skillId) {
    angle = angle - (space * (n - 1) / 2);
    var x = this._dummySprite.shotX();
    var y = this._dummySprite.shotY();
    for (var i = 0; i < n; i++) {
      this.addBullet(x, y, 200 + i, Math.cos(angle) * speed,
                         Math.sin(angle) * speed, angle, count, type, index,
                         skillId, -1);
      angle += space;
    }
  };

  Scene_Equip.prototype.addBullet = function(x, y, z, vx, vy, angle, count, type,
                                          index, skillId, ownerId) {
    if (this._blankPlayerBullets.length > 0) {
      var bulletIndex = this._blankPlayerBullets.shift();
      this._playerBullets[bulletIndex].setup(x, y, z, vx, vy, angle, count,
                                             type, index, skillId, ownerId);
      this._alivePlayerBullets.push(bulletIndex);
    }
  };

  var _Scene_Equip_refreshActor = Scene_Equip.prototype.refreshActor;
  Scene_Equip.prototype.refreshActor = function() {
    _Scene_Equip_refreshActor.call(this);
    this._dummySprite.setActor(this.actor());
    this.clearPlayerBullets();
    this._shotDelay = 0;
  };

  var _Scene_Equip_update = Scene_Equip.prototype.update;
  Scene_Equip.prototype.update = function() {
    _Scene_Equip_update.call(this);
    this.updateBullets();
    this.updateShot();
  };

  Scene_Equip.prototype.updateBullets = function() {
    for (var i = this._alivePlayerBullets.length - 1; i >= 0; i--) {
      var index = this._alivePlayerBullets[i];
      if (!this._playerBullets[index].update()) {
        this._alivePlayerBullets.splice(i, 1);
        this._blankPlayerBullets.push(index);
      }
    }
  };
  
  Scene_Equip.prototype.updateShot = function() {
    if (this._shotDelay > 0) {
      this._shotDelay--;
    } else {
      if (this._itemWindow.active && this._statusWindow._tempActor) {
        var shotParams = this._statusWindow._tempActor.shotParams();
      } else {
        var shotParams = this.actor().shotParams();
      }
      if (shotParams.way > 0) {
        var angle = Math.PI / 2;
        this.nwayShot(shotParams.way, shotParams.space, angle, shotParams.speed,
                      shotParams.count, shotParams.type, shotParams.index,
                      shotParams.skillId);
        this._shotDelay = shotParams.interval;
      }
    }
  };
  
  Scene_Equip.prototype.clearPlayerBullets = function() {
    this._alivePlayerBullets.forEach(function(index) {
      this._playerBullets[index].erase();
    }, this);
    this._blankPlayerBullets.concat(this._alivePlayerBullets);
    this._alivePlayerBullets = [];
  };

})();