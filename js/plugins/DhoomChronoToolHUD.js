//=============================================================================
// DhoomChronoToolHUD.js
//=============================================================================
var Imported = Imported || {};
Imported.Dhoom_ChronoToolHUD = true;

var Dhoom = Dhoom || {};
Dhoom.ChronoToolHUD = Dhoom.ChronoToolHUD || {};
/*:
 * @plugindesc Dhoom ChronoToolHUD v2.0 - 22/06/2019
 * @author DrDhoom - drd-workshop.blogspot.com
 * 
 * @param Main Switch ID
 * @desc Switch ID to hide/show all tools HUD.
 * @type switch
 * @default 0
 * 
 * @param Remap Option Vocabs
 * @desc Vocabs for all input in remap option.
 * @type struct<remapSetting>
 * @default {"title":"Battle Keys","chronoWeapon":"Attack","chronoShield":"Guard","chronoEquip":"Change Equipment","chronoItem":"Use Item %1","chronoChangeItem":"Change Item %1","chronoSkill":"Use Skill %1","chronoChangeSkill":"Change Skill %1"}
 * 
 * @param Weapon Setting
 * @type struct<toolSetting>
 * @default {"input":"#a","changeInput":"#l","x":"354","y":"569","background":"tool_background","iconX":"4","iconY":"4","iconWidth":"32","iconHeight":"32","texts":"[\"{\\\"x\\\":\\\"15\\\",\\\"y\\\":\\\"-3\\\",\\\"width\\\":\\\"10\\\",\\\"height\\\":\\\"10\\\",\\\"text\\\":\\\"%4\\\",\\\"style\\\":\\\"{\\\\\\\"name\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"size\\\\\\\":\\\\\\\"10\\\\\\\",\\\\\\\"color\\\\\\\":\\\\\\\"#FFFFFF\\\\\\\",\\\\\\\"outlineWidth\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"outlineColor\\\\\\\":\\\\\\\"#000000\\\\\\\",\\\\\\\"bold\\\\\\\":\\\\\\\"true\\\\\\\",\\\\\\\"italic\\\\\\\":\\\\\\\"false\\\\\\\",\\\\\\\"align\\\\\\\":\\\\\\\"center\\\\\\\"}\\\",\\\"background\\\":\\\"tool_key_background\\\",\\\"backgroundX\\\":\\\"-1\\\",\\\"backgroundY\\\":\\\"-1\\\"}\"]","switch":"2"}
 * 
 * @param Shield Setting
 * @type struct<toolSetting>
 * @default {"input":"#s","changeInput":"#l","x":"405","y":"569","background":"tool_background","iconX":"4","iconY":"4","iconWidth":"32","iconHeight":"32","texts":"[\"{\\\"x\\\":\\\"15\\\",\\\"y\\\":\\\"-3\\\",\\\"width\\\":\\\"10\\\",\\\"height\\\":\\\"10\\\",\\\"text\\\":\\\"%4\\\",\\\"style\\\":\\\"{\\\\\\\"name\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"size\\\\\\\":\\\\\\\"10\\\\\\\",\\\\\\\"color\\\\\\\":\\\\\\\"#FFFFFF\\\\\\\",\\\\\\\"outlineWidth\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"outlineColor\\\\\\\":\\\\\\\"#000000\\\\\\\",\\\\\\\"bold\\\\\\\":\\\\\\\"true\\\\\\\",\\\\\\\"italic\\\\\\\":\\\\\\\"false\\\\\\\",\\\\\\\"align\\\\\\\":\\\\\\\"center\\\\\\\"}\\\",\\\"background\\\":\\\"tool_key_background\\\",\\\"backgroundX\\\":\\\"-1\\\",\\\"backgroundY\\\":\\\"-1\\\"}\"]","switch":"0"}
 * 
 * @param Item Settings
 * @type struct<toolSetting>[]
 * @default ["{\"input\":\"#d\",\"changeInput\":\"#f\",\"x\":\"456\",\"y\":\"569\",\"background\":\"tool_background\",\"iconX\":\"4\",\"iconY\":\"4\",\"iconWidth\":\"32\",\"iconHeight\":\"32\",\"texts\":\"[\\\"{\\\\\\\"x\\\\\\\":\\\\\\\"15\\\\\\\",\\\\\\\"y\\\\\\\":\\\\\\\"-3\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"10\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"10\\\\\\\",\\\\\\\"text\\\\\\\":\\\\\\\"%4\\\\\\\",\\\\\\\"style\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"size\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"10\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"color\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#FFFFFF\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineWidth\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineColor\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#000000\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"bold\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"true\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"italic\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"align\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"center\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"background\\\\\\\":\\\\\\\"tool_key_background\\\\\\\",\\\\\\\"backgroundX\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"backgroundY\\\\\\\":\\\\\\\"-1\\\\\\\"}\\\",\\\"{\\\\\\\"x\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"y\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"32\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"32\\\\\\\",\\\\\\\"text\\\\\\\":\\\\\\\"-%3s\\\\\\\",\\\\\\\"style\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"size\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"12\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"color\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#FFFFFF\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineWidth\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineColor\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#000000\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"bold\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"italic\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"align\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"center\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"background\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundX\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundY\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"condition\\\\\\\":\\\\\\\"e > 0\\\\\\\"}\\\",\\\"{\\\\\\\"x\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"y\\\\\\\":\\\\\\\"29\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"40\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"18\\\\\\\",\\\\\\\"text\\\\\\\":\\\\\\\"%2\\\\\\\",\\\\\\\"style\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"size\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"18\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"color\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#0065b2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineWidth\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineColor\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#FFFFFF\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"bold\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"italic\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"align\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"center\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"background\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundX\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundY\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"condition\\\\\\\":\\\\\\\"b > 0 && c === 0\\\\\\\"}\\\",\\\"{\\\\\\\"x\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"y\\\\\\\":\\\\\\\"29\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"40\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"18\\\\\\\",\\\\\\\"text\\\\\\\":\\\\\\\"%2\\\\\\\",\\\\\\\"style\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"size\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"18\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"color\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#17ac0b\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineWidth\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineColor\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#FFFFFF\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"bold\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"italic\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"align\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"center\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"background\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundX\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundY\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"condition\\\\\\\":\\\\\\\"c > 0 && b === 0\\\\\\\"}\\\",\\\"{\\\\\\\"x\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"y\\\\\\\":\\\\\\\"29\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"40\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"18\\\\\\\",\\\\\\\"text\\\\\\\":\\\\\\\"%2\\\\\\\",\\\\\\\"style\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"size\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"18\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"color\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#000000\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineWidth\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineColor\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#FFFFFF\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"bold\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"italic\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"align\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"center\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"background\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundX\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundY\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"condition\\\\\\\":\\\\\\\"c === 0 && b === 0\\\\\\\"}\\\"]\",\"switch\":\"0\"}"]
 *
 * @param Skill Settings
 * @type struct<toolSkillSetting>[]
 * @default ["{\"input\":\"#w\",\"changeInput\":\"#q\",\"x\":\"379\",\"y\":\"506\",\"background\":\"tool_background\",\"iconX\":\"4\",\"iconY\":\"4\",\"iconWidth\":\"32\",\"iconHeight\":\"32\",\"texts\":\"[\\\"{\\\\\\\"x\\\\\\\":\\\\\\\"15\\\\\\\",\\\\\\\"y\\\\\\\":\\\\\\\"-3\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"10\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"10\\\\\\\",\\\\\\\"text\\\\\\\":\\\\\\\"%4\\\\\\\",\\\\\\\"style\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"size\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"10\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"color\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#FFFFFF\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineWidth\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineColor\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#000000\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"bold\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"true\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"italic\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"align\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"center\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"background\\\\\\\":\\\\\\\"tool_key_background\\\\\\\",\\\\\\\"backgroundX\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"backgroundY\\\\\\\":\\\\\\\"-1\\\\\\\"}\\\",\\\"{\\\\\\\"x\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"y\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"32\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"32\\\\\\\",\\\\\\\"text\\\\\\\":\\\\\\\"-%3s\\\\\\\",\\\\\\\"style\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"size\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"12\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"color\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#FFFFFF\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineWidth\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineColor\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#000000\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"bold\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"italic\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"align\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"center\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"background\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundX\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundY\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"condition\\\\\\\":\\\\\\\"e > 0\\\\\\\"}\\\",\\\"{\\\\\\\"x\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"y\\\\\\\":\\\\\\\"29\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"40\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"18\\\\\\\",\\\\\\\"text\\\\\\\":\\\\\\\"%2\\\\\\\",\\\\\\\"style\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"size\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"18\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"color\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#0065b2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineWidth\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineColor\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#FFFFFF\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"bold\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"italic\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"align\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"center\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"background\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundX\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundY\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"condition\\\\\\\":\\\\\\\"b > 0 && c === 0\\\\\\\"}\\\",\\\"{\\\\\\\"x\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"y\\\\\\\":\\\\\\\"29\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"40\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"18\\\\\\\",\\\\\\\"text\\\\\\\":\\\\\\\"%2\\\\\\\",\\\\\\\"style\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"size\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"18\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"color\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#17ac0b\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineWidth\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineColor\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#FFFFFF\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"bold\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"italic\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"align\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"center\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"background\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundX\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundY\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"condition\\\\\\\":\\\\\\\"c > 0 && b === 0\\\\\\\"}\\\",\\\"{\\\\\\\"x\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"y\\\\\\\":\\\\\\\"29\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"40\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"18\\\\\\\",\\\\\\\"text\\\\\\\":\\\\\\\"%2\\\\\\\",\\\\\\\"style\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"size\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"18\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"color\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#000000\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineWidth\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineColor\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#FFFFFF\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"bold\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"italic\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"align\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"center\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"background\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundX\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundY\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"condition\\\\\\\":\\\\\\\"c === 0 && b === 0\\\\\\\"}\\\"]\",\"switch\":\"0\"}","{\"input\":\"#e\",\"changeInput\":\"#r\",\"x\":\"430\",\"y\":\"506\",\"background\":\"tool_background\",\"iconX\":\"4\",\"iconY\":\"4\",\"iconWidth\":\"32\",\"iconHeight\":\"32\",\"texts\":\"[\\\"{\\\\\\\"x\\\\\\\":\\\\\\\"15\\\\\\\",\\\\\\\"y\\\\\\\":\\\\\\\"-3\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"10\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"10\\\\\\\",\\\\\\\"text\\\\\\\":\\\\\\\"%4\\\\\\\",\\\\\\\"style\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"size\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"10\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"color\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#FFFFFF\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineWidth\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineColor\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#000000\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"bold\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"true\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"italic\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"align\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"center\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"background\\\\\\\":\\\\\\\"tool_key_background\\\\\\\",\\\\\\\"backgroundX\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"backgroundY\\\\\\\":\\\\\\\"-1\\\\\\\"}\\\",\\\"{\\\\\\\"x\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"y\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"32\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"32\\\\\\\",\\\\\\\"text\\\\\\\":\\\\\\\"-%3s\\\\\\\",\\\\\\\"style\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"size\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"12\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"color\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#FFFFFF\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineWidth\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineColor\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#000000\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"bold\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"italic\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"align\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"center\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"background\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundX\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundY\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"condition\\\\\\\":\\\\\\\"e > 0\\\\\\\"}\\\",\\\"{\\\\\\\"x\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"y\\\\\\\":\\\\\\\"29\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"40\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"18\\\\\\\",\\\\\\\"text\\\\\\\":\\\\\\\"%2\\\\\\\",\\\\\\\"style\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"size\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"18\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"color\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#0065b2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineWidth\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineColor\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#FFFFFF\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"bold\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"italic\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"align\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"center\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"background\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundX\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundY\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"condition\\\\\\\":\\\\\\\"b > 0 && c === 0\\\\\\\"}\\\",\\\"{\\\\\\\"x\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"y\\\\\\\":\\\\\\\"29\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"40\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"18\\\\\\\",\\\\\\\"text\\\\\\\":\\\\\\\"%2\\\\\\\",\\\\\\\"style\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"size\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"18\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"color\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#17ac0b\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineWidth\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineColor\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#FFFFFF\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"bold\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"italic\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"align\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"center\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"background\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundX\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundY\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"condition\\\\\\\":\\\\\\\"c > 0 && b === 0\\\\\\\"}\\\",\\\"{\\\\\\\"x\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"y\\\\\\\":\\\\\\\"29\\\\\\\",\\\\\\\"width\\\\\\\":\\\\\\\"40\\\\\\\",\\\\\\\"height\\\\\\\":\\\\\\\"18\\\\\\\",\\\\\\\"text\\\\\\\":\\\\\\\"%2\\\\\\\",\\\\\\\"style\\\\\\\":\\\\\\\"{\\\\\\\\\\\\\\\"name\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"size\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"18\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"color\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#000000\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineWidth\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"outlineColor\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"#FFFFFF\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"bold\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"italic\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"align\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"center\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"background\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundX\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"backgroundY\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"condition\\\\\\\":\\\\\\\"c === 0 && b === 0\\\\\\\"}\\\"]\",\"switch\":\"0\"}"]
 * 
 * @help Changelogs:
 * • v2.0 - 22/06/2019
 * - Updated to use QInput and QInput+Remap. All input can be remapped in the option menu.
 * - 
 * • v1.1a - 28/12/2018
 * - Compatibility with YEP Skill Core.
 * • v1.1 - 26/11/2018
 * - Add Skill Type ID to Skill Settings parameter.
 * • v1.0 - 12/10/2018
 * - Initial release.
 * 
 * Plugin Commands:
 * set_actor_skill : ACTORID : SKILLID : TOOLINDEX(Optional)
 * - Tool index start from 0.
 * set_actor_item : ACTORID : ITEMID : TOOLINDEX(Optional)
 * - Tool index start from 0.
 */

/*~struct~remapSetting:
@param title
@text Title Vocab
@default Battle Keys

@param chronoWeapon
@text Weapon Attack Vocab
@desc Set to false to disable.
@default Attack

@param chronoShield
@text Shield Guard Vocab
@desc Set to false to disable.
@default Guard

@param chronoEquip
@text Change Equipment Vocab
@desc Set to false to disable.
@default Change Equipment

@param chronoItem
@text Item Use Vocab
@desc %1 = Index, start from 1. Set to false to disable.
@default Use Item %1

@param chronoChangeItem
@text Change Item Vocab
@desc %1 = Index, start from 1. Set to false to disable.
@default Change Item %1

@param chronoSkill
@text Skill Use Vocab
@desc %1 = Index, start from 1. Set to false to disable.
@default Use Skill %1

@param chronoChangeSkill
@text Change Skill Vocab
@desc %1 = Index, start from 1. Set to false to disable.
@default Change Skill %1
*/

/*~struct~toolSetting:
@param input
@text Activation Input
@desc [QKey, Gamepad Key]. Loot at QInput plugin Key List. Leave empty if not used.
@type string[]

@param changeInput
@text Change Input
@desc [QKey, Gamepad Key]. Look at QInput plugin Key List. Leave empty if not used.
@type string[]

@param x
@text X Position
@desc X position on screen.
@type number
@default 0
@min -999999
@max 999999

@param y
@text Y Position
@desc Y position on sreen.
@type number
@default 0
@min -999999
@max 999999

@param background
@text Background Filename
@type file
@dir img/chrono/
@default tool_background

@param iconX
@text Icon X
@desc Icon x position, relative to X Position.
@type number
@default 4
@min -999999
@max 999999

@param iconY
@text Icon Y
@desc Icon y position, relative to Y Position.
@type number
@default 4
@min -999999
@max 999999

@param iconWidth
@text Icon Width
@desc Icon width.
@default 32
@type number
@min 0

@param iconHeight
@text Icon Height
@desc Icon height.
@default 32
@type number
@min 0

@param texts
@text Text Settings
@desc %1 = Item Name, %2 = Item Cost, %3 = Item Cooldown, %4 = Item Activation Input, %5 = Item Change Input.
@type struct<textSetting>[]

@param switch
@text Switch ID
@desc Switch ID to disable and hide this HUD.
@type switch
@default 0
*/

/*~struct~toolSkillSetting:
@param stypeId
@text Skill Type ID
@desc Skill type ID for this tool. Set to 0 to include all skills.
@type number
@min 0
@default 0

@param input
@text Activation Input
@desc [QKey, Gamepad Key]. Loot at QInput plugin Key List. Leave empty if not used.
@type string[]

@param changeInput
@text Change Input
@desc [QKey, Gamepad Key]. Look at QInput plugin Key List. Leave empty if not used.
@type string[]

@param x
@text X Position
@desc X position on screen.
@type number
@default 0
@min -999999
@max 999999

@param y
@text Y Position
@desc Y position on sreen.
@type number
@default 0
@min -999999
@max 999999

@param background
@text Background Filename
@type file
@dir img/chrono/
@default tool_background

@param iconX
@text Icon X
@desc Icon x position, relative to X Position.
@type number
@default 4
@min -999999
@max 999999

@param iconY
@text Icon Y
@desc Icon y position, relative to Y Position.
@type number
@default 4
@min -999999
@max 999999

@param iconWidth
@text Icon Width
@desc Icon width.
@default 32
@type number
@min 0

@param iconHeight
@text Icon Height
@desc Icon height.
@default 32
@type number
@min 0

@param texts
@text Text Settings
@desc %1 = Item Name, %2 = Item Cost, %3 = Item Cooldown, %4 = Item Activation Input, %5 = Item Change Input.
@type struct<textSetting>[]

@param switch
@text Switch ID
@desc Switch ID to disable and hide this HUD.
@type switch
@default 0
*/

/*~struct~textSetting:
@param x
@text Text X
@desc Text X position
@default 86
@type number
@min -999999

@param y
@text Text Y
@desc Text Y position
@default 17
@type number
@min -999999

@param width
@text Text Width
@desc Text width area
@default 187
@type number
@min 1

@param height
@text Text Height
@desc Text height area
@default 21
@type number
@min 1

@param text
@text Text Format
@desc %1 = Data1, %2 = Data2, ..., %n = DataN
@default %1

@param style
@text Text Style
@desc Text style
@type struct<FontStyle>

@param background
@text Text Background
@type file
@dir img/chrono/

@param backgroundX
@text Text Background X
@type number
@min -999999

@param backgroundY
@text Text Background Y
@type number
@min -999999

@param condition
@text Text Condition
@desc Condition for the text to appear. a = item, b = mp cost, c = tp cost, d = item number, e = cooldown.
@default
*/

/*~struct~FontStyle:
@param name
@text Font Name
@desc Font name, leave empty if you want to use the default font.
@default 

@param size
@text Font Size
@desc Font size
@default 32
@type number
@min 1

@param color
@text Font Color
@desc Font color
@default #FFFFFF

@param outlineWidth
@text Font Outline Width
@desc Font outline width
@default 1
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

Dhoom.Parameters = PluginManager.parameters('DhoomChronoToolHUD');
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

Dhoom.ChronoToolHUD.mainSwitch = Dhoom.loadParam('Main Switch ID');
Dhoom.ChronoToolHUD.remapVocabs = Dhoom.loadParam('Remap Option Vocabs');
Dhoom.ChronoToolHUD.weaponSetting = Dhoom.loadParam('Weapon Setting');
Dhoom.ChronoToolHUD.weaponSetting.type = 'chronoWeapon';
Dhoom.ChronoToolHUD.shieldSetting = Dhoom.loadParam('Shield Setting');
Dhoom.ChronoToolHUD.shieldSetting.type = 'chronoShield';
Dhoom.ChronoToolHUD.itemSettings = Dhoom.loadParam('Item Settings');
Dhoom.ChronoToolHUD.skillSettings = Dhoom.loadParam('Skill Settings');

Moghunter.ras_buttonWeapon = '';
Moghunter.ras_buttonGuard = '';
Moghunter.ras_buttonItem = '';
Moghunter.ras_buttonSkill = '';
Moghunter.ras_buttonItemW = '';
Moghunter.ras_buttonSkillW = '';

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// QInput
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
QInput.remapped.chronoWeapon = Dhoom.ChronoToolHUD.weaponSetting.input;
QInput.remapped.chronoShield = Dhoom.ChronoToolHUD.shieldSetting.input;
QInput.remapped.chronoEquip = [].concat(Dhoom.ChronoToolHUD.weaponSetting.changeInput).concat(Dhoom.ChronoToolHUD.shieldSetting.changeInput);
for (var i = 0; i < Dhoom.ChronoToolHUD.itemSettings.length; i++) {
    QInput.remapped['chronoItem' + (i + 1)] = Dhoom.ChronoToolHUD.itemSettings[i].input;
    QInput.remapped['chronoChangeItem' + (i + 1)] = Dhoom.ChronoToolHUD.itemSettings[i].changeInput;
    Dhoom.ChronoToolHUD.itemSettings[i].type = 'chronoItem';
}
for (var i = 0; i < Dhoom.ChronoToolHUD.skillSettings.length; i++) {
    QInput.remapped['chronoSkill' + (i + 1)] = Dhoom.ChronoToolHUD.skillSettings[i].input;
    QInput.remapped['chronoChangeSkill' + (i + 1)] = Dhoom.ChronoToolHUD.skillSettings[i].changeInput;
    Dhoom.ChronoToolHUD.skillSettings[i].type = 'chronoSkill';
}

Dhoom.ChronoToolHUD.QInput_remap = QInput.remap;
QInput.remap = function (key) {
    if (key.contains('chrono')) {
        return ConfigManager.keys[key];
    }
    return Dhoom.ChronoToolHUD.QInput_remap.call(this, key);
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// ConfigManager
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
ConfigManager.keys = JsonEx.makeDeepCopy(QInput.remapped);

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Bitmap
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
if (typeof Bitmap.prototype.changeTextStyle === 'undefined') {
    Dhoom.ChronoToolHUD.Bitmap_initialize = Bitmap.prototype.initialize;
    Bitmap.prototype.initialize = function (width, height) {
        Dhoom.ChronoToolHUD.Bitmap_initialize.call(this, width, height);
        this.fontBold = false;
    };

    Dhoom.ChronoToolHUD.Bitmap_makeFontNameText = Bitmap.prototype._makeFontNameText;
    Bitmap.prototype._makeFontNameText = function () {
        if (this.fontBold) return 'Bold ' + this.fontSize + 'px ' + this.fontFace;
        return Dhoom.ChronoToolHUD.Bitmap_makeFontNameText.call(this);
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

    Dhoom.ChronoToolHUD.Bitmap_drawTextOutline = Bitmap.prototype._drawTextOutline;
    Bitmap.prototype._drawTextOutline = function (text, tx, ty, maxWidth) {
        if (this.outlineWidth === 0) return;
        Dhoom.ChronoToolHUD.Bitmap_drawTextOutline.call(this, text, tx, ty, maxWidth);
    };
}

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// TouchInput
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
if (typeof TouchInput._mouseX === 'undefined') {
    Dhoom.ChronoToolHUD.TouchInput_clear = TouchInput.clear;
    TouchInput.clear = function () {
        Dhoom.ChronoToolHUD.TouchInput_clear.call(this);
        this._mouseX = 0;
        this._mouseY = 0;
    };

    Object.defineProperty(TouchInput, 'mouseX', {
        get: function () {
            return this._mouseX;
        },
        configurable: true
    });

    Object.defineProperty(TouchInput, 'mouseY', {
        get: function () {
            return this._mouseY;
        },
        configurable: true
    });

    Dhoom.ChronoToolHUD.TouchInput_onMouseMove = TouchInput._onMouseMove;
    TouchInput._onMouseMove = function (event) {
        Dhoom.ChronoToolHUD.TouchInput_onMouseMove.call(this, event);
        this._mouseX = Graphics.pageToCanvasX(event.pageX);
        this._mouseY = Graphics.pageToCanvasY(event.pageY);
    };
}

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Actor
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoToolHUD.Game_Actor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function () {
    Dhoom.ChronoToolHUD.Game_Actor_initMembers.call(this);
    this._toolItemId = [];
    this._toolSkillId = [];
    this._toolItemActionId = [];
    this._toolSkillActionId = [];
};

Dhoom.ChronoToolHUD.Game_Actor_refresh = Game_Actor.prototype.refresh;
Game_Actor.prototype.refresh = function () {
    this.releaseUnequippableItemsSkillsTool();
    Dhoom.ChronoToolHUD.Game_Actor_refresh.call(this);
};

Game_Actor.prototype.releaseUnequippableItemsSkillsTool = function () {
    for (var i = 0; i < Dhoom.ChronoToolHUD.skillSettings.length; i++) {
        var stypeId = Dhoom.ChronoToolHUD.skillSettings[i].stypeId;
        if (this._toolSkillId[i] && (!this.hasSkill(this._toolSkillId[i]) || (stypeId && $dataSkills[this._toolSkillId[i]].stypeId !== stypeId))) {
            this._toolSkillId[i] = 0;
        }
    }
    this.setToolSkillID();
};

Dhoom.ChronoToolHUD.Game_Actor_forgetSkill = Game_Actor.prototype.forgetSkill;
Game_Actor.prototype.forgetSkill = function (skillId) {
    if (this.isSkillEquipped(skillId)) {
        $gameTemp._chronoToolMenuSkill = [this._toolSkillId.indexOf(skillId)];
        this.equipToolSkillID(0);
    }
    Dhoom.ChronoToolHUD.Game_Actor_forgetSkill.call(this, skillId);
};

Game_Actor.prototype.equipToolItemID = function (itemid) {
    var index = $gameTemp._chronoToolMenuItem || 0;
    this._toolItemId[index] = itemid;
    this.setToolItemID();
};

Game_Actor.prototype.equipToolSkillID = function (itemid) {
    var index = $gameTemp._chronoToolMenuSkill ? $gameTemp._chronoToolMenuSkill[0] : 0;
    $gameTemp._chronoToolMenuSkill = null;
    this._toolSkillId[index] = itemid;
    this.setToolSkillID();
};

Game_Actor.prototype.setToolItemID = function () {
    for (var i = 0; i < Dhoom.ChronoToolHUD.itemSettings.length; i++) {
        var item = $dataItems[this._toolItemId[i] || 0];
        if (item) {
            this._toolItemActionId[i] = this.getToolActionID(item);
        } else {
            this._toolItemActionId[i] = 0;
        };
    }
};

Game_Actor.prototype.setToolSkillID = function () {
    for (var i = 0; i < Dhoom.ChronoToolHUD.skillSettings.length; i++) {
        var item = $dataSkills[this._toolSkillId[i] || 0];
        if (item && this.hasSkill(item.id)) {
            this._toolSkillActionId[i] = this.getToolActionID(item);
        } else {
            this._toolSkillActionId[i] = 0;
        };
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Player
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoToolHUD.Game_Player_updateToolCommand = Game_Player.prototype.updateToolCommand;
Game_Player.prototype.updateToolCommand = function () {
    var spriteset = SceneManager._scene._spritesetChronoToolHUD;
    if (this.isCommandToolMenuUsable() && spriteset && spriteset.isActive()) {
        if ($gameSystem._chronoCom.windowItem) {
            var sprites = spriteset._itemSprites;
            for (var i = 0; i < sprites.length; i++) {
                if (sprites[i].isActive() && Input.isTriggered('chronoChangeItem' + (i + 1))) {
                    SoundManager.playOk();
                    this.commandToolMenuItem(sprites[i]);
                    return;
                }
            }
        }
        if ($gameSystem._chronoCom.windowSkill) {
            var sprites = spriteset._skillSprites;
            for (var i = 0; i < sprites.length; i++) {
                if (sprites[i].isActive() && Input.isTriggered('chronoChangeSkill' + (i + 1))) {
                    SoundManager.playOk();
                    this.commandToolMenuSkill(sprites[i]);
                    return;
                }
            }
        };
        if ((spriteset._shieldSprite.isActive() || spriteset._weaponSprite.isActive()) && Input.isTriggered('chronoEquip')) {
            SoundManager.playOk();
            SceneManager.push(Scene_Equip);
            return;
        }
    };
    Dhoom.ChronoToolHUD.Game_Player_updateToolCommand.call(this);
};

Dhoom.ChronoToolHUD.Game_Player_commandToolMenuItem = Game_Player.prototype.commandToolMenuItem;
Game_Player.prototype.commandToolMenuItem = function (sprite) {
    if (sprite) $gameTemp._chronoToolMenuItem = Dhoom.ChronoToolHUD.itemSettings.indexOf(sprite._setting);
    Dhoom.ChronoToolHUD.Game_Player_commandToolMenuItem.call(this);
};

Dhoom.ChronoToolHUD.Game_Player_commandToolMenuSkill = Game_Player.prototype.commandToolMenuSkill;
Game_Player.prototype.commandToolMenuSkill = function (sprite) {
    if (sprite) $gameTemp._chronoToolMenuSkill = [Dhoom.ChronoToolHUD.skillSettings.indexOf(sprite._setting), sprite._setting.stypeId];
    Dhoom.ChronoToolHUD.Game_Player_commandToolMenuSkill.call(this);
};

Game_Player.prototype.commandSkillUsable = function () {
    if (!$gameSystem._chronoCom.skill) return false;
    var spriteset = SceneManager._scene._spritesetChronoToolHUD;
    if (spriteset && spriteset.isActive()) {
        for (var i = 0; i < spriteset._skillSprites.length; i++) {
            if (spriteset._skillSprites[i].isActive() && Input.isTriggered('chronoSkill' + (i + 1))) {
                if (spriteset._skillSprites[i].isUsable()) {
                    $gameTemp._chronoToolActivateSkill = i;
                    return true;
                } else {
                    SoundManager.playBuzzer();
                    return false;
                }
            }
        }
    }
    return false;
};

Game_Player.prototype.commandItemUsable = function () {
    if (!$gameSystem._chronoCom.item) return false;
    var spriteset = SceneManager._scene._spritesetChronoToolHUD;
    if (spriteset && spriteset.isActive()) {
        for (var i = 0; i < spriteset._itemSprites.length; i++) {
            if (spriteset._itemSprites[i].isActive() && Input.isTriggered('chronoItem' + (i + 1))) {
                if (spriteset._itemSprites[i].isUsable()) {
                    $gameTemp._chronoToolActivateItem = i;
                    return true;
                } else {
                    SoundManager.playBuzzer();
                    return false;
                }
            }
        }
    }
    return false;
};

Game_Player.prototype.commandRasSkill = function () {
    var actionID = this.battler().toolSkillID()[$gameTemp._chronoToolActivateSkill];
    if (this.battler()._ras.combo.id != 0) {
        if (this.battler()._ras.combo.type != 1) {
            this.battler().clearRasCombo();
            return
        };
        var actionID = this.battler()._ras.combo.id
    };
    this.act(actionID);
    this.prepareCombo(actionID, 1);
};

Game_Player.prototype.commandRasItem = function () {
    var actionID = $gameSystem._toolActorMode ? this.battler().toolItemID()[$gameTemp._chronoToolActivateItem] : $gameParty.tool_id();
    if (this.battler()._ras.combo.id != 0) {
        if (this.battler()._ras.combo.type != 2) {
            this.battler().clearRasCombo();
            return
        };
        var actionID = this.battler()._ras.combo.id
    };
    this.act(actionID);
    this.prepareCombo(actionID, 2);
};

Dhoom.ChronoToolHUD.Game_Player_commandGuardUsable = Game_Player.prototype.commandGuardUsable;
Game_Player.prototype.commandGuardUsable = function () {
    var spriteset = SceneManager._scene._spritesetChronoToolHUD;
    if (!spriteset || !spriteset._shieldSprite || !spriteset.isActive() || !spriteset._shieldSprite.isActive()) return false;
    if ($gameSystem.isAbsMode() && this.guardIsUsable() && $gameSystem._chronoCom.shield && Input.isPressed('chronoShield')) return true;
    return Dhoom.ChronoToolHUD.Game_Player_commandGuardUsable.call(this);
};

Dhoom.ChronoToolHUD.Game_Player_commandAttackUsable = Game_Player.prototype.commandAttackUsable;
Game_Player.prototype.commandAttackUsable = function () {
    var spriteset = SceneManager._scene._spritesetChronoToolHUD;
    if (!spriteset || !spriteset._weaponSprite || !spriteset.isActive() || !spriteset._weaponSprite.isActive()) return false;
    if ($gameSystem._chronoCom.attack && Input.isTriggered('chronoWeapon')) return true;
    return Dhoom.ChronoToolHUD.Game_Player_commandAttackUsable.call(this);
};

Dhoom.ChronoToolHUD.Game_Player_commandChargeUsable = Game_Player.prototype.commandChargeUsable;
Game_Player.prototype.commandChargeUsable = function () {
    var spriteset = SceneManager._scene._spritesetChronoToolHUD;
    if (!spriteset || !spriteset._weaponSprite || !spriteset.isActive() || !spriteset._weaponSprite.isActive()) return false;
    return Dhoom.ChronoToolHUD.Game_Player_commandChargeUsable.call(this);
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Party
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoToolHUD.Game_Party_inBattle = Game_Party.prototype.inBattle;
Game_Party.prototype.inBattle = function () {
    return Dhoom.ChronoToolHUD.Game_Party_inBattle.call(this) || (SceneManager._scene instanceof Scene_Map && !$gameSystem.isNonBattleMode() && !$gameMap._interpreter.isRunning());
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Game_Interpreter
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoToolHUD.Game_Interpreter_setChronoInterpreter = Game_Interpreter.prototype.setChronoInterpreter;
Game_Interpreter.prototype.setChronoInterpreter = function (command, args) {
    if (command === "set_actor_skill") {
        var actorId = Number(args[1]);
        $gameTemp._chronoToolMenuSkill = [Number(args[5]) || 0, 0];
    } else if (command === "set_actor_item") {
        $gameTemp._chronoToolMenuItem = Number(args[5]) || 0;
    };
    Dhoom.ChronoToolHUD.Game_Interpreter_setChronoInterpreter.call(this, command, args);
    if (actorId) $gameActors.actor(actorId).refresh();
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Sprite_ChronoToolHUD
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function Sprite_ChronoToolHUD() {
    this.initialize.apply(this, arguments);
}

Sprite_ChronoToolHUD.prototype = Object.create(Sprite.prototype);
Sprite_ChronoToolHUD.prototype.constructor = Sprite_ChronoToolHUD;

Sprite_ChronoToolHUD.prototype.initialize = function (setting) {
    Sprite.prototype.initialize.call(this);
    this._setting = setting;
    this._item = null;
    this.x = this._setting.x;
    this.y = this._setting.y;
    this.refreshBackground();
    this.createIconSprite();
    this.createTextSprite();
};

Sprite_ChronoToolHUD.prototype.directory = function () {
    return 'img/chrono/';
};

Sprite_ChronoToolHUD.prototype.input = function () {
    return this._setting.input;
};

Sprite_ChronoToolHUD.prototype.changeInput = function () {
    return this._setting.changeInput;
};

Sprite_ChronoToolHUD.prototype.refreshBackground = function () {
    this.bitmap = ImageManager.loadBitmap(this.directory(), this._setting.background);
};

Sprite_ChronoToolHUD.prototype.createIconSprite = function () {
    this._iconSprite = new Sprite();
    this._iconSprite.bitmap = new Bitmap(this._setting.iconWidth, this._setting.iconHeight);
    this._iconSprite.x = this._setting.iconX;
    this._iconSprite.y = this._setting.iconY;
    this.addChild(this._iconSprite);
    this._cooldownSprite = new Sprite();
    this._cooldownSprite.bitmap = new Bitmap(this._setting.iconWidth, this._setting.iconHeight);
    this._cooldownSprite.x = this._setting.iconX;
    this._cooldownSprite.y = this._setting.iconY;
    this._cooldownSprite.visible = false;
    this.addChild(this._cooldownSprite);
};

Sprite_ChronoToolHUD.prototype.createTextSprite = function () {
    this._textSprite = new Sprite();
    this._textSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
    this._textSprite.x = -this.x;
    this._textSprite.y = -this.y;
    this.addChild(this._textSprite);
};

Sprite_ChronoToolHUD.prototype.refreshIcon = function () {
    this._iconSprite.setColorTone([0, 0, 0, 0]);
    this._cooldownSprite.setColorTone([0, 0, 0, 0]);
    this._iconSprite.bitmap.clear();
    this._cooldownSprite.bitmap.clear();
    if (this._item) {
        var iconIndex = this._item.iconIndex;
        var bitmap = ImageManager.loadSystem('IconSet');
        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var sx = iconIndex % 16 * pw;
        var sy = Math.floor(iconIndex / 16) * ph;
        this._iconSprite.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0, this._iconSprite.width, this._iconSprite.height);
        this._cooldownSprite.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0, this._iconSprite.width, this._iconSprite.height);
    };
    this._tempIconIndex = this._item ? this._item.iconIndex : null;
    this._cooldownSprite.setColorTone([-80, -80, -80, 255]);
};

Sprite_ChronoToolHUD.prototype.refreshText = function () {
    this._textSprite.bitmap.clear();
    for (var i = 0; i < this._setting.texts.length; i++) {
        this.drawText(this._setting.texts[i]);
    }
    this._tempName = this._item ? this._item.name : null;
    this._tempCooldown = this._item && DataManager.isSkill(this._item) ? $gameParty.leader().getSkillCooldown(this._item)[0] : null;
};

Sprite_ChronoToolHUD.prototype.drawText = function (setting) {
    if (!this.checkTextCondition(setting.condition)) return;
    this._textSprite.bitmap.changeTextStyle(setting.style);
    var name = '';
    var cost = '';
    var cooldown = '';
    if (this._setting.type === 'chronoItem') {
        var index = Dhoom.ChronoToolHUD.itemSettings.indexOf(this._setting);
        var inputs = ConfigManager.keys['chronoItem' + (index + 1)];
        var cInputs = ConfigManager.keys['chronoChangeItem' + (index + 1)];
    } else if (this._setting.type === 'chronoSkill') {
        var index = Dhoom.ChronoToolHUD.skillSettings.indexOf(this._setting);
        var inputs = ConfigManager.keys['chronoSkill' + (index + 1)];
        var cInputs = ConfigManager.keys['chronoChangeSkill' + (index + 1)];
    } else {
        var inputs = ConfigManager.keys[this._setting.type];
        var cInputs = ConfigManager.keys['chronoEquip'];
    }
    var keyName = '';
    var cKeyName = '';
    if (Input.preferKeyboard()) {
        regex = /^#(.*)/;
    } else {
        regex = /^\$(.*)/;
    }
    for (var i = 0; i < inputs.length; i++) {
        if (regex.test(inputs[i])) keyName = inputs[i];
    }
    for (var i = 0; i < cInputs.length; i++) {
        if (regex.test(cInputs[i])) cKeyName = cInputs[i];
    }
    var key = keyName.toUpperCase().replace('#', '').replace('$', '');
    var ckey = cKeyName.toUpperCase().replace('#', '').replace('$', '');
    if (this._item) {
        name = this._item.name;
        if (DataManager.isSkill(this._item)) {
            cost = this._item.mpCost;
            if (this._item.tpCost) cost = this._item.tpCost;
            cooldown = ($gameParty.leader().getSkillCooldown(this._item)[0] / 60).toFixed(1);
            if (cooldown <= 0) cooldown = '';
        } else {
            cost = $gameParty.numItems(this._item);
        }
        this._tempCost = cost
    }
    var text = setting.text.format(name, cost, cooldown, key, ckey);
    var x = setting.x + this.x;
    var y = setting.y + this.y;
    var width = setting.width;
    var height = setting.height;
    var align = setting.style.align;
    var bitmap = ImageManager.loadBitmap(this.directory(), setting.background);
    if (bitmap) {
        if (bitmap.isReady()) {
            this._textSprite.bitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x + setting.backgroundX, y + setting.backgroundY);
        } else {
            this._needRefresh = true;
        }
    }
    this._textSprite.bitmap.drawText(text, x, y, width, height, align);
};

Sprite_ChronoToolHUD.prototype.checkTextCondition = function (condition) {
    if (!condition) return true;
    var a = this._item;
    var b = this._item && DataManager.isSkill(this._item) ? this._item.mpCost : 0;
    var c = this._item && DataManager.isSkill(this._item) ? this._item.tpCost : 0;
    var d = this._item && DataManager.isItem(this._item) ? $gameParty.numItems(this._item) : 0;
    var e = this._item && DataManager.isSkill(this._item) ? $gameParty.leader().getSkillCooldown(this._item)[0] : 0;
    try {
        return eval(condition);
    } catch (error) {
        console.log('Tool Text Condition Error');
        console.log(condition);
        console.log(error);
        return false;
    }
};

Sprite_ChronoToolHUD.prototype.setItem = function (item, actionId) {
    if (this._item === item && this._actionId === actionId) return;
    this._actionId = actionId;
    this._item = item;
    this.refreshIcon();
    this.refreshText();
};

Sprite_ChronoToolHUD.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this._needRefresh && ImageManager.isReady()) {
        this.refreshIcon();
        this.refreshText();
        this._preferKeyboard = Input.preferKeyboard();
        this._needRefresh = false;
    }
    this.updateCooldownSprite();
    if (!this._needRefresh) this._needRefresh = this.isNeedRefresh();
    this.visible = this.isActive();
    this.updateOpacity();
};

Sprite_ChronoToolHUD.prototype.updateCooldownSprite = function () {
    this._cooldownSprite.visible = !this.isUsable();
    if (this._cooldownSprite.visible) {
        var rate = 1;
        if (this._item && DataManager.isSkill(this._item)) {
            var value = $gameParty.leader().getSkillCooldown(this._item);
            rate = (value[1] - value[0]) / value[1];
        }
        var y = this._cooldownSprite.bitmap.height - (this._cooldownSprite.bitmap.height * rate);
        this._cooldownSprite.setFrame(0, 0, this._cooldownSprite.bitmap.width, y);
    }
};

Sprite_ChronoToolHUD.prototype.isNeedRefresh = function () {
    if (this._item) {
        if (DataManager.isSkill(this._item)) {
            if ($gameParty.leader().getSkillCooldown(this._item)[0] !== this._tempCooldown || this._tempCost !== this._item.mpCost) return true;
        } else {
            if (this._tempCost !== $gameParty.numItems(this._item)) return true;
        }
        if (this._item.name !== this._tempName) return true;
    } else {
        if (this._tempName || this._tempCooldown || this._tempCost) return true;
    }
    return this._preferKeyboard !== Input.preferKeyboard();
};

Sprite_ChronoToolHUD.prototype.isUsable = function () {
    if (this._item && this.isActive() && this.parent && this.parent.isActive()) {
        if (DataManager.isSkill(this._item)) {
            return $gameParty.leader().canUse(this._item);
        } else {
            return $gameParty.numItems(this._item) > 0;
        }
    }
    return false;
};

Sprite_ChronoToolHUD.prototype.isActive = function () {
    return !this._setting.switch || $gameSwitches.value(this._setting.switch);
};

Sprite_ChronoToolHUD.prototype.isHovered = function () {
    if (!this.visible) return false;
    var x = (TouchInput.mouseX - this.parent.x) / this.parent.scale.x;
    var y = (TouchInput.mouseY - this.parent.y) / this.parent.scale.y;
    var tx = this.x;
    var ty = this.y;
    var w = this.width / this.parent.scale.x;
    var h = this.height / this.parent.scale.y;
    return x >= tx && y >= ty && x < tx + w && y < ty + h;
};

Sprite_ChronoToolHUD.prototype.updateOpacity = function () {
    var big = ImageManager.isBigCharacter($gamePlayer.characterName());
    var bitmap = ImageManager.loadCharacter($gamePlayer.characterName());
    var pw = bitmap.width / (big ? 3 : 12);
    var ph = bitmap.height / (big ? 4 : 8);
    var cx = $gamePlayer.screenX() - pw / 2;
    var cy = $gamePlayer.screenY() - ph;
    var hovered = !(cx > this.x + this.width || cx + pw < this.x || cy > this.y + this.height || cy + ph < this.y);
    this.opacity = hovered ? 128 : 255;
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Spriteset_ChronoToolHUD
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
function Spriteset_ChronoToolHUD() {
    this.initialize.apply(this, arguments);
}

Spriteset_ChronoToolHUD.prototype = Object.create(Sprite.prototype);
Spriteset_ChronoToolHUD.prototype.constructor = Spriteset_ChronoToolHUD;

Spriteset_ChronoToolHUD.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._actor = null;
    this.createSprites();
};

Spriteset_ChronoToolHUD.prototype.createSprites = function () {
    this._weaponSprite = new Sprite_ChronoToolHUD(Dhoom.ChronoToolHUD.weaponSetting);
    this.addChild(this._weaponSprite);
    this._shieldSprite = new Sprite_ChronoToolHUD(Dhoom.ChronoToolHUD.shieldSetting);
    this.addChild(this._shieldSprite);
    this._itemSprites = [];
    var setting = Dhoom.ChronoToolHUD.itemSettings;
    for (var i = 0; i < setting.length; i++) {
        var sprite = new Sprite_ChronoToolHUD(setting[i]);
        this.addChild(sprite);
        this._itemSprites.push(sprite);
    }
    this._skillSprites = [];
    setting = Dhoom.ChronoToolHUD.skillSettings;
    for (i = 0; i < setting.length; i++) {
        var sprite = new Sprite_ChronoToolHUD(setting[i]);
        this.addChild(sprite);
        this._skillSprites.push(sprite);
    }
};

Spriteset_ChronoToolHUD.prototype.setActor = function (actor) {
    if (this._actor === actor) return;
    this._actor = actor;
    this.updateItems();
};

Spriteset_ChronoToolHUD.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.visible = this.isActive();
    this.updateActor();
    this.updateItems();
};

Spriteset_ChronoToolHUD.prototype.updateActor = function () {
    this.setActor($gameParty.leader());
};

Spriteset_ChronoToolHUD.prototype.updateItems = function () {
    if (this._actor) {
        this._weaponSprite.setItem(this._actor.equips()[0]);
        this._shieldSprite.setItem(this._actor.equips()[1]);
        this._itemSprites.forEach(function (sprite, i) {
            sprite.setItem($dataItems[this._actor._toolItemId[i]]);
        }, this);
        this._skillSprites.forEach(function (sprite, i) {
            sprite.setItem($dataSkills[this._actor._toolSkillId[i]]);
        }, this);
    } else {
        this._weaponSprite.setItem(null);
        this._shieldSprite.setItem(null);
        this._itemSprites.concat(this._skillSprites).forEach(function (sprite) {
            sprite.setItem(null);
        });
    }
};

Spriteset_ChronoToolHUD.prototype.isActive = function () {
    return !Dhoom.ChronoToolHUD.mainSwitch || $gameSwitches.value(Dhoom.ChronoToolHUD.mainSwitch);
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Window_ToolSkill
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoToolHUD.Window_ToolSkill_includes = Window_ToolSkill.prototype.includes;
Window_ToolSkill.prototype.includes = function (item) {
    var result = Dhoom.ChronoToolHUD.Window_ToolSkill_includes.call(this, item);
    var contained = true;
    if (result && $gameTemp._chronoToolMenuSkill && $gameTemp._chronoToolMenuSkill[1]) {
        if (item.stypeId !== $gameTemp._chronoToolMenuSkill[1]) contained = false;
    }
    return result && contained;
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Window_InputRemap
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoToolHUD.Window_InputRemap_addMoveKeys = Window_InputRemap.prototype.addMoveKeys;
Window_InputRemap.prototype.addMoveKeys = function () {
    Dhoom.ChronoToolHUD.Window_InputRemap_addMoveKeys.call(this);
    this.addChronoToolKeys();
};

Window_InputRemap.prototype.addChronoToolKeys = function () {
    this.addCommand(Dhoom.ChronoToolHUD.remapVocabs.title, 'spaceholder', false);
    var keys = ['chronoWeapon', 'chronoShield', 'chronoEquip'];
    for (var i = 0; i < Dhoom.ChronoToolHUD.itemSettings.length; i++) {
        keys.push('chronoItem' + (i + 1));
        keys.push('chronoChangeItem' + (i + 1));
    }
    for (var i = 0; i < Dhoom.ChronoToolHUD.skillSettings.length; i++) {
        keys.push('chronoSkill' + (i + 1));
        keys.push('chronoChangeSkill' + (i + 1));
    }
    for (var i = 0; i < keys.length; i++) {
        this.addChronoKey(keys[i]);
    }
};

Window_InputRemap.prototype.addChronoKey = function (key) {
    if (!ConfigManager.keys.hasOwnProperty(key)) return;
    var keyName = key;
    var index = "";
    if (/(.+)(\d+)/i.exec(key)) {
        keyName = RegExp.$1.trim();
        index = Number(RegExp.$2);
    }
    if (Dhoom.ChronoToolHUD.remapVocabs[keyName]) {
        var vocab = Dhoom.ChronoToolHUD.remapVocabs[keyName].format(index);
        this.addCommand(vocab, 'set', true, key);
    }
};

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// Scene_Map
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
Dhoom.ChronoToolHUD.Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
Scene_Map.prototype.createSpriteset = function () {
    Dhoom.ChronoToolHUD.Scene_Map_createSpriteset.call(this);
    this.createChronoToolHUDSpriteset();
};

Scene_Map.prototype.createChronoToolHUDSpriteset = function () {
    this._spritesetChronoToolHUD = new Spriteset_ChronoToolHUD();
    this.addChild(this._spritesetChronoToolHUD);
};