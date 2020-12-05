var SceneBattlePartyCommand = Scene_Battle.prototype.startPartyCommandSelection;
Scene_Battle.prototype.startPartyCommandSelection = function() {
    SceneBattlePartyCommand.call(this);
    this.selectNextCommand();
    this._helpWindow.clear();
    this._partyCommandWindow.deactivate();
};

