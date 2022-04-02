/*
Copyright 2021, James J. Hayes

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 59 Temple
Place, Suite 330, Boston, MA 02111-1307 USA.
*/

/*jshint esversion: 6 */
"use strict";

/*
 * This module loads the rules from the 1st Edition Unearthed Arcana supplement.
 * The UnearthedArcana1e function contains methods that load rules for
 * particular parts of the rule books; raceRules for character races,
 * magicRules for spells, etc. These member methods can be called independently
 * in order to use a subset of the UnearthedArcana1e rules. Similarly, the
 * constant fields of UnearthedArcana1e (RACES, SPELLS, etc.) can be
 * manipulated to modify the choices.
 */
function UnearthedArcana1e(edition, rules) {

  if(window.UnearthedArcana1e == null) {
    alert('The UnearthedArcana1e module requires use of the OldSchool module');
    return;
  }

  if(rules == null)
    rules = OldSchool.rules;

  UnearthedArcana1e.abilityRules(rules);
  UnearthedArcana1e.talentRules
    (rules, UnearthedArcana1e.FEATURES, UnearthedArcana1e.LANGUAGES);
  UnearthedArcana1e.identityRules
    (rules, UnearthedArcana1e.CLASSES, UnearthedArcana1e.RACES);
  rules.defineChoice('random', 'comeliness');
  rules.randomizeOneAttribute = UnearthedArcana1e.randomizeOneAttribute;

}

UnearthedArcana1e.VERSION = '2.3.1.0';

UnearthedArcana1e.CLASSES = {
  'Cavalier':
    'Require=' +
      '"alignment =~ \'Good\'","strength >= 15","dexterity >= 15",' +
      '"constitution >= 15","intelligence >= 10","wisdom >= 10" ' +
    'HitDie=d10,9,3 Attack=0,2,2,-2@19 WeaponProficiency=4,3,2 ' +
    'Breath=17,1.5,2 Death=14,1.5,2 Petrification=15,1.5,2 Spell=17,1.5,2 Wand=16,1.5,2 ' +
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"1:Continuous Training","1:Deadly Lancer","1:Deadly Rider",' +
      '1:Diehard,1:Equestrian,"1:Fear Immunity","1:Fighting The Unskilled",' +
      '"1:Lance Expertise","1:Mental Resistance","2:Extra Attacks",' +
      '"3:Quick Mount","3:Sword Expertise","4:Unicorn Rider","5:Fast Ride",' +
      '"5:Mace Expertise","7:Special Mount" ' +
    'Experience=0,2.5,5,10,18.5,37,85,140,220,300,600,900,1200,1500,1800',
};
UnearthedArcana1e.FEATURES = {

  // Comeliness
  'Gorgeous':
    'Section=magic ' +
    'Note="May <i>Fascinate</i> creatures with wisdom %V or lower"',

  // Class
  'Continuous Training':
    'Section=ability ' +
    'Note="Gains d100/100 strength, dexterity, and constitution at 1st level, 2d10/100 additional at each level"',
  'Deadly Lancer':
    'Section=combat ' +
    'Note="+%{levels.Cavalier} lance damage when mounted, +1 dismounted"',
  'Deadly Rider':'Section=combat Note="+%V attack when mounted"',
  'Diehard':'Section=combat Note="Remains conscious at negative HP"',
  'Equestrian':
    'Section=skill ' +
    'Note="%{16-levels.Cavalier}% chance of being unsaddled or being injured when mount falls"',
  'Extra Attacks':'Section=combat Note="+%V attacks/rd with expertise weapons"',
  'Fast Ride':'Section=skill Note="Can ride at +2\\" pace for 1 hr"',
  'Fear Immunity':'Section=save Note="R10\' Immune to fear"',
  'Lance Expertise':
    'Section=combat ' +
    'Note="+%V attack with lance when horsed, or parry for foe -%V attack"',
  'Mace Expertise':
    'Section=combat ' +
    'Note="+%V attack with choice of horseman\'s mace, flail, or military pick, or parry for foe -%V attack"',
  'Mental Resistance':
    'Section=save Note="90% resistance to mental attacks, +2 vs. illusions"',
  'Quick Mount':
    'Section=skill Note="Can vault into saddle in armor and ride in 1 seg"',
  'Special Mount':'Section=skill Note="Can ride a %V"',
  'Sword Expertise':
    'Section=combat ' +
    'Note="+%V attack with choice of broad sword, long sword, or scimitar, or parry for foe -%V attack"',
  'Unicorn Rider':'Section=skill Note="Can ride a unicorn"',

  // Race
  'Ambidextrous':
    'Section=combat Note="May fight w/a weapon in each hand w/out penalty"',
  'Animal Friend':
    'Section=magic Note="May befriend and train woodland creatures"',
  'Dark Elf Resistance':'Section=save Note="+2 vs. magic"',
  'Drow Magic':
    'Section=magic ' +
    'Note="Cast <i>Dancing Lights</i>, <i>Faerie Fire</i>, <i>Darkness</i> (5\' radius)%1%2 1/dy"',
  'Extended Infravision':'Section=feature Note="120\' vision in darkness"',
  'Gray Dwarf Immunities':
    'Section=save ' +
    'Note="Immunity to illusions, paralyzation, and non-natural poison"',
  'Gray Elf Ability Adjustment':
    'Section=ability Note="+1 Dexterity/-1 Constitution/+1 Intelligence"',
  'Light Sensitivity':
    'Section=ability,combat ' +
    'Note="-2 Dexterity in full light",' +
         '"-2 attacks and foes +2 saves in full light"',
  'Sharp Eye':'Section=combat Note="Surprised 1in8 in less than full light"',
  'Very Stealthy':
    'Section=combat ' +
    'Note="Surprised 1in10 and surprise 3in6 in less than full light"',
  'Wild Elf Ability Adjustment':
    'Section=ability Note="+1 Dexterity/-1 Constitution/+2 Strength"',
  'Wood Elf Ability Adjustment':
    'Section=ability Note="+1 Dexterity/-1 Constitution/+1 Strength/-1 Intelligence"',
  'Woodland Tongue':'Section=feature Note="May speak w/forest mammals"'

};
UnearthedArcana1e.LANGUAGES = {
  'Drow Sign':'',
  'Treant':'',
  'Undercommon':''
};
UnearthedArcana1e.RACES = {
  'Dark Elf':
    'Require=' +
      '"charisma >= 8","constitution >= 8","dexterity >= 7",' +
      '"intelligence >= 8" ' +
    'Features=' +
      'Ambidextrous,"Dark Elf Resistance","Detect Construction",' +
      '"Detect Secret Doors","Detect Sliding","Detect Traps",' +
      '"Determine Depth","Drow Magic","Extended Infravision","Resist Charm",' +
      '"Resist Sleep","Sharp Eye","Stealthy" ' +
    'Languages=' +
      'Common,Undercommon,Elf,Gnome,"Drow Sign"',
  'Gray Dwarf':
    OldSchool.RACES.Dwarf
      .replace(/"?(1:)?Infravision"?/, '"Extended Infravision"')
      .replace(/"(1:)?Dwarf Enmity"/, '"Gray Dwarf Immunities","Very Stealthy"') +
      ' Languages=Undercommon,Dwarf',
  'Gray Elf':
    OldSchool.RACES.Elf
      .replace(/Elf Ability Adjustment/, 'Gray Elf Ability Adustment'),
  'Valley Elf':
    OldSchool.RACES.Elf
      .replace(/Elf Ability Adjustment/, 'Valley Elf Ability Adustment')
      .replace(/Languages=/, 'Languages=Gnome,'),
  'Wild Elf':
    OldSchool.RACES.Elf
      .replace(/Elf Ability Adjustment/, 'Wild Elf Ability Adustment')
      .replace(/Features=/, 'Features="Animal Friend",Trapper,'),
  'Wood Elf':
    OldSchool.RACES.Elf
      .replace(/Elf Ability Adjustment/, 'Wood Elf Ability Adustment')
      .replace(/Features=/, 'Features="Woodland Tongue",') +
      ' Languages=Elf,Common,Treant'
};

/* Defines rules related to character abilities. */
UnearthedArcana1e.abilityRules = function(rules) {

  rules.defineRule('abilityNotes.charismaComelinessModifier',
    'charismaComelinessModifier', '=', 'QuilvynUtils.signed(source)'
  );
  rules.defineRule('charismaComelinessModifier',
    'charisma', '=', 'source<3 ? -8 : source<4 ? -5 : source<6 ? -3 : source<9 ? -1 : source<13 ? null : source<16 ? 1 : source<18 ? 2 : source<19 ? 3 : 5'
  );
  rules.defineRule('comeliness',
    'abilityNotes.charismaComelinessModifier', '+', null,
    'abilityNotes.raceComelinessModifier', '+', null
  );
  rules.defineRule
    ('features.Gorgeous', 'comeliness', '=', 'source<18 ? null : 1');
  rules.defineRule('magicNotes.gorgeous',
    'comeliness', '=', 'Math.floor(source * (source<26 ? 0.667 : 0.75))'
  );

  rules.defineChoice('notes',
    'abilityNotes.charismaComelinessModifier:%V',
    'abilityNotes.raceComelinessModifier:%V'
  );
  rules.defineEditorElement
    ('comeliness', 'Comeliness', 'select-one', [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 'gender');
  rules.defineSheetElement('Comeliness', 'Charisma+', null);
};

/* Defines rules related to basic character identity. */
UnearthedArcana1e.identityRules = function(rules, classes, races) {
  OldSchool.identityRules(rules, {}, classes, races);
  for(var clas in classes) {
    UnearthedArcana1e.classRulesExtra(rules, clas);
  }
  for(var race in races) {
    UnearthedArcana1e.raceRulesExtra(rules, race);
  }
};

/* Defines rules related to character aptitudes. */
UnearthedArcana1e.talentRules = function(rules, features, languages) {
  OldSchool.talentRules(rules, features, {}, languages, {});
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the abilities passed to classRules.
 */
UnearthedArcana1e.classRulesExtra = function(rules, name) {
  var classLevel = 'levels.' + name;
  if(name == 'Cavalier') {
    rules.defineRule
      ('combatNotes.deadlyRider', classLevel, '=', 'source % 2==0 ? 2 : null');
    rules.defineRule('combatNotes.lanceExpertise',
      classLevel, '=', 'Math.floor((source + 1) / 6)'
    );
    rules.defineRule('combatNotes.maceExpertise',
      classLevel, '=', 'Math.floor((source + 5) / 6)'
    );
    rules.defineRule('combatNotes.swordExpertise',
      classLevel, '=', 'Math.floor((source + 3) / 6)'
    );
    rules.defineRule('combatNotes.extraAttacks',
      classLevel, '=', 'source==1||source==7||source>13 ? null : 0.5'
    );
    rules.defineRule('skillNotes.specialMount',
      classLevel, '=', '"pegasus" + (source>=11 ? ", hippogriff, or griffin" : source>9 ? " or hippogriff" : "")'
    );
    rules.defineRule('cavalierFeatures.Unicorn Rider',
      'gender', '?', 'source == "Female"',
      'race', '?', 'source.match(/(^|\\s)Elf/)'
    );
    rules.defineRule('warriorLevel', classLevel, '+', null);
  }
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the abilities passed to raceRules.
 */
UnearthedArcana1e.raceRulesExtra = function(rules, name) {

  var raceLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Level';

  if(name == 'Dark Elf') {
    rules.defineRule('darkElfComelinessModifier',
      raceLevel, '=', '1',
      'gender', '*', '-1'
    );
    rules.defineRule('abilityNotes.raceComelinessModifier',
      'darkElfComelinessModifier', '=', null
    );
    rules.defineRule('featureNotes.determineDepth', raceLevel, '+=', '50');
    rules.defineRule('magicNotes.drowMagic.1',
      'level', '=', 'source<4 ? "" : ", <i>Detect Magic</i>, <i>Know Alignment</i>, <i>Levitate</i>"'
    );
    rules.defineRule('magicNotes.drowMagic.2',
      'level', '=', 'source<4 ? "" : ", <i>Clairvoyance</i>, <i>Detect Lie</i>, <i>Suggestion</i>, <i>Dispel Magic</i>"',
      'gender', '=', 'source != "Female" ? "" : null'
    );
    rules.defineRule('saveNotes.resistCharm', raceLevel, '+=', '90');
    rules.defineRule('saveNotes.resistSleep', raceLevel, '+=', '90');
  } else if(name.includes('Gnome')) {
    rules.defineRule('abilityNotes.raceComelinessModifier', raceLevel, '=', -1);
  } else if(name == 'Gray Dwarf') {
    rules.defineRule('featureNotes.detectSlope', raceLevel, '+=', '75');
    rules.defineRule('featureNotes.determineDepth', raceLevel, '+=', '50');
    rules.defineRule
      ('skillNotes.intelligenceLanguageBonus', raceLevel, 'v', '2');
  } else if(name == 'Gray Elf') {
    rules.defineRule('abilityNotes.raceComelinessModifier', raceLevel, '=', 2);
  } else if(name == 'Half-Elf') {
    rules.defineRule('abilityNotes.raceComelinessModifier', raceLevel, '=', 1);
  } else if(name == 'Half-Orc') {
    rules.defineRule('abilityNotes.raceComelinessModifier', raceLevel, '=', -3);
  } else if(name == 'High Elf' || name == 'Elf') {
    rules.defineRule('abilityNotes.raceComelinessModifier', raceLevel, '=', 2);
  } else if(name == 'Sylvan Elf') {
    rules.defineRule('abilityNotes.raceComelinessModifier', raceLevel, '=', 1);
  }

};

/* Sets #attributes#'s #attribute# attribute to a random value. */
UnearthedArcana1e.randomizeOneAttribute = function(attributes, attribute) {
  if(attribute == 'comeliness' || attribute == 'abilities') {
    var rolls = [];
    for(var i = 0; i < 4; i++)
      rolls.push(QuilvynUtils.random(1, 6));
    rolls.sort();
    attributes.comeliness = rolls[1] + rolls[2] + rolls[3];
    if(attribute == 'abilities')
      OSRIC.randomizeOneAttribute.apply(this, [attributes, attribute]);
  } else {
    OSRIC.randomizeOneAttribute.apply(this, [attributes, attribute]);
  }
};
