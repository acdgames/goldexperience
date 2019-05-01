//=============================================================================
// RemoveKeyItem.js
//=============================================================================

/*:

 *@plugindesc Removes key item option when selling.

 *@author Bananabelle

 *
 *@help

 */

 function Window_ItemCategory2() {
     this.initialize.apply(this, arguments);
 }

 Window_ItemCategory2.prototype = Object.create(Window_HorzCommand.prototype);
 Window_ItemCategory2.prototype.constructor = Window_ItemCategory2;

 Window_ItemCategory2.prototype.initialize = function() {
     Window_HorzCommand.prototype.initialize.call(this, 0, 0);
 };

 Window_ItemCategory2.prototype.windowWidth = function() {
     return Graphics.boxWidth;
 };

 Window_ItemCategory2.prototype.maxCols = function() {
     return 3;
 };

 Window_ItemCategory2.prototype.update = function() {
     Window_HorzCommand.prototype.update.call(this);
     if (this._itemWindow) {
         this._itemWindow.setCategory(this.currentSymbol());
     }
 };

 Window_ItemCategory2.prototype.makeCommandList = function() {
     this.addCommand(TextManager.item,    'item');
     this.addCommand(TextManager.weapon,  'weapon');
     this.addCommand(TextManager.armor,   'armor');
 };

 Window_ItemCategory2.prototype.setItemWindow = function(itemWindow) {
     this._itemWindow = itemWindow;
     this.update();
 };


 Scene_Shop.prototype.createCategoryWindow = function() {
     this._categoryWindow = new Window_ItemCategory2();
     this._categoryWindow.setHelpWindow(this._helpWindow);
     this._categoryWindow.y = this._dummyWindow.y;
     this._categoryWindow.hide();
     this._categoryWindow.deactivate();
     this._categoryWindow.setHandler('ok',     this.onCategoryOk.bind(this));
     this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
     this.addWindow(this._categoryWindow);
 };
