//=============================================================================
// DhoomScriptItemDescription.js
//=============================================================================
var Imported = Imported || {};
Imported.Dhoom_ScriptItemDesc = true;

var Dhoom = Dhoom || {};
Dhoom.ScriptItemDesc = Dhoom.ScriptItemDesc || {};
/*:
 * @plugindesc Dhoom ScriptItemDesc v2.0 - 31/01/2019
 * @author DrDhoom - drd-workshop.blogspot.com
 *
 * @help Description script tag:
 * <script>ACTUAL SCRIPT</script>
 * - a = item object.
 * Example: <script>a.name</script>
 *          <script>a.price</script>
 *          <script>a.mpCost</script>
 */

Dhoom.Parameters = PluginManager.parameters('DhoomScriptItemDescription');
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
// Window_Base
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ScriptItemDesc.Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
Window_Base.prototype.convertEscapeCharacters = function (text) {
    text = text.replace(/<script>(.*?)<\/script>/gi, function () {
        var a = this._lastDrawTextExItem;
        try {
            return eval(arguments[1]);
        } catch (e) {
            console.log('Escape character script error');
            console.error(e);
            return '';
        }
    }.bind(this));
    text = Dhoom.ScriptItemDesc.Window_Base_convertEscapeCharacters.call(this, text);
    return text;
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Window_Help
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ScriptItemDesc.Window_Help_setItem = Window_Help.prototype.setItem;
Window_Help.prototype.setItem = function (item) {
    this._lastDrawTextExItem = item;
    Dhoom.ScriptItemDesc.Window_Help_setItem.call(this, item);
};