/* $Id: FirstEdition.js,v 1.2 2009/04/27 14:19:49 Jim Exp $ */

/*
Copyright 2008, James J. Hayes

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

var FirstEdition_VERSION = '1.0beta-080714';

/*
 */
function FirstEdition() {

  if(window.SRD35 == null) {
    alert('The FirstEdition module requires use of the SRD35 module');
    return;
  }

  var rules = new ScribeRules('First Edition');
  SRD35.createViewers(rules, SRD35.VIEWERS);
  rules.editorElements = SRD35.initialEditorElements();
  // Remove some editor and character sheet elements that don't apply
  rules.defineEditorElement('skills');
  rules.defineEditorElement('feats');
  rules.defineEditorElement('specialize');
  rules.defineEditorElement('prohibit');

  FirstEdition.abilityRules(rules);
  FirstEdition.raceRules(rules, FirstEdition.LANGUAGES, FirstEdition.RACES);
  FirstEdition.classRules(rules, FirstEdition.CLASSES);
  SRD35.descriptionRules(rules, SRD35.ALIGNMENTS, SRD35.DEITIES, SRD35.GENDERS);
  FirstEdition.equipmentRules
    (rules, FirstEdition.ARMORS, FirstEdition.GOODIES, FirstEdition.SHIELDS,
     FirstEdition.WEAPONS);
  FirstEdition.combatRules(rules);
  FirstEdition.movementRules(rules);
  FirstEdition.magicRules(rules, FirstEdition.CLASSES);
  rules.defineChoice('preset', 'race', 'level', 'levels');
  rules.defineChoice('random', FirstEdition.RANDOMIZABLE_ATTRIBUTES);
  rules.randomizeOneAttribute = SRD35.randomizeOneAttribute;
  rules.makeValid = SRD35.makeValid;
  rules.ruleNotes = FirstEdition.ruleNotes;
  Scribe.addRuleSet(rules);
  FirstEdition.rules = rules;

}

FirstEdition.ARMORS = [
  'None', 'Banded', 'Chain', 'Elfin Chain', 'Leather', 'Padded', 'Plate',
  'Ring', 'Scale', 'Studded'
];
FirstEdition.CLASSES = [
  'Assassin', 'Cleric', 'Druid', 'Fighter', 'Illusionist', 'Magic User',
  'Paladin', 'Ranger', 'Thief'
];
FirstEdition.GOODIES = [
  'Ring Of Protection +1',
  'Ring Of Protection +2',
  'Ring Of Protection +3',
  'Ring Of Protection +4'
];
FirstEdition.LANGUAGES = [
  'Common', 'Druids\' Cant', 'Dwarven', 'Elven', 'Gnoll', 'Gnomish', 'Goblin',
  'Halfling', 'Hobgoblin', 'Kobold', 'Orcish'
];
FirstEdition.RACES =
  ['Dwarf', 'Elf', 'Gnome', 'Half Elf', 'Half Orc', 'Halfling', 'Human'];
// Note: the order here handles dependencies among attributes when generating
// random characters
FirstEdition.RANDOMIZABLE_ATTRIBUTES = [
  'charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom',
  'extraStrength', 'name', 'race', 'gender', 'alignment', 'deity', 'levels',
  'languages', 'hitPoints', 'armor', 'shield',
  'weapons', 'spells', 'goodies'
];
FirstEdition.SHIELDS = [
  'Large Shield', 'Medium Shield', 'None', 'Small Shield'
];
FirstEdition.WEAPONS = [
  'Bastard Sword:2d4x1', 'Battle Axe:d8x1', 'Broad Sword:2d4x1', 'Club:d4+1x1',
  'Composite Long Bow:d6x1r60', 'Composite Short Bow:d6x1r50', 'Dagger:d4x1',
  'Dart:d3x1r15', 'Halbert:d10x1', 'Hand Axe:d6x1', 'Heavy Crossbow:d4+1x1r80',
  'Heavy Flail:d6+1x1', 'Heavy Mace:d6+1x1', 'Heavy Pick:d6+1x1',
  'Javelin:d6x1r20', 'Lance:2d4+1x1', 'Light Crossbow:d4x1r60',
  'Light Flail:d4+1x1', 'Light Mace:d4+1x1', 'Light Pick:d4+1x1',
  'Long Bow:d6x1r70', 'Long Sword:d8x1', 'Morning Star:2d4x1', 'Pole Arm:d6x1',
  'Scimitar Sword:d6x1', 'Short Bow:d6x1r50', 'Short Sword:d6x1', 'Spear:d6x1',
  'Staff:d6x1', 'Trident:d6+1x1', 'Two-Handed Sword:d10x1', 'War Hammer:d4+1'
];

// Related information used internally by FirstEdition
FirstEdition.armorsArmorClassBonuses = {
  'None' : null, 'Banded' : -6, 'Chain' : -5, 'Elfin Chain' : -5,
  'Leather' : -2, 'Padded' :-2, 'Plate' : -7, 'Ring' : -3, 'Scale' : -4,
  'Studded' : -3
};
FirstEdition.strengthDamageAdjustments = [
  -1, -1, null, null, null, null, null, 1, 1, 2, 3, 3, 4, 5, 6
];
FirstEdition.strengthEncumbranceAdjustments = [
  -35, -25, -15, null, null, 10, 20, 35, 50, 75, 100, 125, 150, 200, 300
];
FirstEdition.strengthMajorTestPercentages = [
  0, 0, 0, 1, 2, 4, 7, 10, 13, 16, 20, 25, 30, 35, 40
];

/* Defines the rules related to character abilities. */
FirstEdition.abilityRules = function(rules) {

  // Charisma
  rules.defineRule('loyaltyBase',
    'charisma', '=',
    'source <= 8 ? (source * 5 - 45) : source >= 14 ? (source * 5 - 65) : 0'
  )
  rules.defineRule('maximumHenchmen',
    'charisma', '=',
    'source<=10 ? Math.floor((source-1)/2) : source<=12 ? (source-7) : ' +
    'source<=16 ? (source-8) : ((source-15)* 5)'
  );
  rules.defineRule('reactionAdjustment',
    'charisma', '=',
    'source <= 7 ? (source * 5 - 40) : source >= 13 ? (source * 5 - 60) : 0'
  )

  // Constitution
  rules.defineRule('surviveResurrection',
    'constitution', '=', 'source <= 13 ? (source * 5 + 25) : (source * 2 + 64)'
  )
  rules.defineRule('surviveSystemShock',
    'constitution', '=', 'source <= 13 ? (source * 5 + 20) : (source * 3 + 46)'
  )
  rules.defineRule('combatNotes.constitutionHitPointsAdjustment',
    'constitution', '=',
    'source <= 3 ? -2 : source <= 6 ? -1 : source >= 15 ? (source - 14) : null',
    'warriorLevel', 'v', 'source == 0 ? 2 : null',
    'level', '*', null
  );
  rules.defineRule
    ('hitPoints', 'combatNotes.constitutionHitPointsAdjustment', '+', null);
  rules.defineSheetElement
    ('Survive Resurrection', 'SaveAndResistance/', '<b>%N</b>: %V%');
  rules.defineSheetElement
    ('Survive System Shock', 'SaveAndResistance/', '<b>%N</b>: %V%');

  // Dexterity
  rules.defineRule
    ('armorClass', 'combatNotes.dexterityArmorClassAdjustment', '+', null);
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'dexterity', '=',
    'source <= 6 ? (7 - source) : source >= 15 ? (14 - source) : null'
  );
  rules.defineRule('combatNotes.dexterityMissleAttackAdjustment',
    'dexterity', '=',
    'source <= 5 ? (source - 6) : source >= 16 ? (source - 15) : null'
  );
  rules.defineRule('combatNotes.dexteritySurpriseAdjustment',
    'dexterity', '=',
    'source <= 5 ? (source - 6) : source >= 16 ? (source - 15) : null'
  );

  // Intelligence
  rules.defineRule('languageBonus',
    'intelligence', '+',
    'source<=7 ? null : source<=15 ? Math.floor((source-6) / 2) : (source-11)'
  );
  rules.defineRule('languageCount', 'languageBonus', '+', null);

  // Strength
  rules.defineRule('abilityNotes.strengthEncumbranceAdjustment',
    'strengthRow', '=', 'FirstEdition.strengthEncumbranceAdjustments[source]'
  );
  rules.defineRule('combatNotes.strengthAttackAdjustment',
    'strengthRow', '=', 'source <= 2 ? (source - 3) : ' +
                        'source <= 7 ? null : Math.floor((source - 5) / 3)'
  );
  rules.defineRule('combatNotes.strengthDamageAdjustment',
    'strengthRow', '=', 'FirstEdition.strengthDamageAdjustments[source]'
  );
  rules.defineRule('strengthMajorTest',
    'strengthRow', '=', 'FirstEdition.strengthMajorTestPercentages[source]'
  );
  rules.defineRule('strengthMinorTest',
    'strengthRow', '=', 'source == 14 ? 5 : Math.floor((source + 5) / 4)'
  );
  rules.defineRule('strengthRow',
    'strength', '=', 'source >= 16 ? source - 9 : Math.floor((source - 2) / 2)',
    'extraStrength', '+', 'source <= 50 ? 1 : source <= 75 ? 2 : ' +
                          'source <= 90 ? 3 : source <= 99 ? 4 : 5'
  );
  rules.defineEditorElement
    ('extraStrength', 'Extra Strength', 'text', [4], 'intelligence');
  rules.defineSheetElement('Extra Strength', 'Strength+', '/%V');
  rules.defineSheetElement('StrengthTests', 'LoadInfo', '%V', '');
  rules.defineSheetElement
    ('Strength Minor Test', 'StrengthTests/',
     '<b>Strength Minor/Major Test</b>: %Vin6');
  rules.defineSheetElement('Strength Major Test', 'StrengthTests/', '/%V%');

  // Wisdom
  rules.defineRule('saveNotes.wisdomMentalSavingThrowAdjustment',
    'wisdom', '=',
    'source<=5 ? (source-6) : source<=7 ? -1 : source<=14 ? null : (source-14)'
  );

};

/* Defines the rules related to character classes. */
FirstEdition.classRules = function(rules, classes) {

  rules.defineNote
    ('validationNotes.levelsTotal:' +
     'Allocated levels differ from level total by %V');
  rules.defineRule('validationNotes.levelsTotal',
    'level', '+=', '-source',
    /^levels\./, '+=', null
  );

  rules.defineRule('warriorLevel', null, '=', '0');

  for(var i = 0; i < classes.length; i++) {

    var baseAttack, feats, features, hitDie, notes, saveAimed, saveBreath,
        saveDeath, savePetrification, saveUnclassified, selectableFeatures,
        spellAbility, spellsKnown;
    var klass = classes[i];

    selectableFeatures = null;
    spellAbility = null;
    spellsKnown = null;
    //TODO experience bonus for high ability score
    //TODO armor/shield proficiency

    if(klass == 'Assassin') {
      baseAttack = 'source <= 4 ? -1 : source <= 8 ? 1 : source <= 4 ? 6 : 6';
      features = [
        'Assassination', 'Backstab', 'Disguise', '9:Extra Languages',
        '12:Read Scrolls'
      ];
      hitDie = 6;
      notes = [
        'combatNotes.assassinationFeature:' +
          '%V% - 5%/2 foe levels chance of killing surprised foe',
        'combatNotes.backstabFeature:+4 attack/x%V damage from behind',
        'featureNotes.disguiseFeature:92+% chance of successful disguise',
        'featureNotes.extraLanguagesFeature:+%V languages of any type',
        'magicNotes.readScrollsFeature:Cast spell from scroll',
        'validationNotes.assassinClassAlignment:Requires Alignment =~ Evil',
        'validationNotes.assassinClassConstitution:Requires Constitution >= 6',
        'validationNotes.assassinClassDexterity:Requires Dexterity >= 12',
        'validationNotes.assassinClassIntelligence:Requires Intelligence >= 11',
        'validationNotes.assassinClassStrength:Requires Strength >= 12',
        'validationNotes.assassinClassWisdom:Requires Wisdom >= 6'
      ];
      saveAimed = '14 - 2 * Math.floor(source / 4)'
      saveBreath = '16 - Math.floor(source / 4)'
      saveDeath = '13 - Math.floor(source / 4)'
      savePetrification = '12 - Math.floor(source / 4)'
      saveUnclassified = '15 - 2 * Math.floor(source / 4)'
      rules.defineRule('combatNotes.assassinationFeature',
        'levels.Assassin', '=', '50 + 5 * source'
      );
      rules.defineRule('combatNotes.backstabFeature',
        'levels.Assassin', '+=', '2 + Math.floor((source - 1) / 4)'
      );
      rules.defineRule('featureNotes.extraLanguagesFeature',
        'intelligence', '=', 'source < 15 ? null : (source - 15)'
      );
      rules.defineRule
        ('languageCount', '+=', 'featureNotes.extraLanguagesFeature', null);

    } else if(klass == 'Cleric') {
      baseAttack = 'source < 19 ? Math.floor(source / 3) : 21';
      features = [
        '9:Attract Followers', 'Turn Undead'
      ];
      hitDie = 8;
      notes = [
        'featureNotes.attractFollowersFeature:' +
          'May build stronghold and attract followers',
        'validationNotes.clericClassCharisma:Requires Charisma >= 6',
        'validationNotes.clericClassConstitution:Requires Constitution >= 6',
        'validationNotes.clericClassIntelligence:Requires Intelligence >= 6',
        'validationNotes.clericClassStrength:Requires Strength >= 6',
        'validationNotes.clericClassWisdom:Requires Wisdom >= 9'
      ];
      spellAbility = 'wisdom';
      spellsKnown = [
        'C1:1:1/2:2/4:3/9:4/11:5/12:6/15:7/17:8/19:9',
        'C2:3:1/4:2/5:3/9:4/12:5/13:6/15:7/17:8/19:9',
        'C3:5:1/6:2/8:3/11:4/12:5/13:6/15:7/17:8/19:9',
        'C4:7:1/8:2/10:3/13:4/14:5/16:6/18:7/20:8/21:9',
        'C5:9:1/10:2/14:3/15:4/16:5/18:6/20:7/21:8/22:9',
        'C6:11:1/12:2/16:3/18:4/20:5/21:6/23:7/24:8/26:9',
        'C7:16:1/19:2/22:3/25:4/27:5/28:6/29:7'
      ];
      rules.defineRule('turnUndead.level', 'levels.Cleric', '+=', null);
      rules.defineRule('turningLevel', 'turnUndead.level', '^=', null);

    } else if(klass == 'Druid') {
      baseAttack = '2 * Math.floor(source / 3)';
      features = [
        'Resist Fire', 'Resist Lightning', '3:Druid\'s Knowledge',
        '3:Wilderness Movement', '7:Fey Immunity', '7:Shapeshift'
      ];
      hitDie = 8;
      notes = [
        'featureNotes.druid\'sKnowledgeFeature:' +
          'Identify plant/animal types/water purity',
        'featureNotes.wildernessMovementFeature:' +
          'Normal, untrackable movement through undergrowth',
        'magicNotes.shapeshiftFeature:Change into natural animal 3/day',
        'saveNotes.feyImmunityFeature:Immune to fey enchantment',
        'saveNotes.resistFireFeature:+2 vs. fire',
        'saveNotes.resistLightningFeature:+2 vs. lightning',
        'validationNotes.druidClassAlignment:Requires Alignment == Neutral',
        'validationNotes.druidClassCharisma:Requires Charisma >= 15',
        'validationNotes.druidClassConstitution:Requires Constitution >= 6',
        'validationNotes.druidClassDexterity:Requires Dexterity >= 6',
        'validationNotes.druidClassIntelligence:Requires Intelligence >= 6',
        'validationNotes.druidClassStrength:Requires Strength >= 6',
        'validationNotes.druidClassWisdom:Requires Wisdom >= 12'
      ];
      saveAimed = '(source < 7 ? 14 : 13) - Math.floor(source / 3)'
      saveBreath = '(source < 7 ? 16 : 15) - Math.floor(source / 3)'
      saveDeath = '(source < 7 ? 10 : 9) - Math.floor(source / 3)'
      savePetrification = '(source < 7 ? 13 : 12) - Math.floor(source / 3)'
      saveUnclassified = '(source < 7 ? 15 : 14) - Math.floor(source / 3)'
      spellAbility = 'wisdom';
      spellsKnown = [
        'D1:1:2/3:3/4:4/9:5/13:6',
        'D2:2:1/3:2/5:3/7:4/11:5/14:6',
        'D3:3:1/4:2/7:3/12:4/13:5/14:6',
        'D4:6:1/8:2/10:3/12:4/13:5/14:6',
        'D5:9:1/10:2/12:3/13:4/14:5',
        'D6:11:1/12:2/13:3/14:4',
        'D7:12:1/13:2/14:3'
      ];
      rules.defineRule('languageCount', '+=', 'levels.Druid', '1');
      rules.defineRule('languages.Druids\' Cant', '=', 'levels.Druid', '1');

    } else if(klass == 'Fighter') {
      baseAttack = 'source - 1';
      features = [
        'Fighting the Unskilled', '9:Attract Followers'
      ];
      hitDie = 10;
      notes = [
        'combatNotes.fightingTheUnskilledFeature:' +
          '%V attacks/round vs. creatures with < 1d8 hit die',
        'featureNotes.attractFollowersFeature:' +
          'May build stronghold and attract followers',
        'validationNotes.fighterClassCharisma:Requires Charisma >= 6',
        'validationNotes.fighterClassConstitution:Requires Constitution >= 7',
        'validationNotes.fighterClassDexterity:Requires Dexterity >= 6',
        'validationNotes.fighterClassStrength:Requires Strength >= 9',
        'validationNotes.fighterClassWisdom:Requires Wisdom >= 6'
      ];
      saveAimed =
        '16 - Math.floor((source-1) / 2) - Math.floor((source-1) / 4)';
      saveBreath =
        '17 - Math.floor((source-1) / 2) - 2 * Math.floor((source-1) / 4)';
      saveDeath =
        '14 - Math.floor((source-1) / 2) - Math.floor((source-1) / 4)';
      savePetrification =
        '15 - Math.floor((source-1) / 2) - Math.floor((source-1) / 4)';
      saveUnclassified =
        '17 - Math.floor((source-1) / 2) - Math.floor((source-1) / 4)';
      rules.defineRule('attacksPerRound',
        'levels.Fighter', '+=', 'Math.floor(source / 6) * 0.5'
      );
      rules.defineRule('combatNotes.fightingTheUnskilledFeature',
        'levels.Fighter', '=', null
      );
      rules.defineRule('warriorLevel', 'levels.Fighter', '+', null);

    } else if(klass == 'Illusionist') {
      baseAttack =
        'source<6 ? -1 : source<11 ? 1 : source<16 ? 4 : source<21 ? 7 : 9';
      features = [
        '7:Eldritch Craft', '10:Attract Followers'
      ];
      hitDie = 4;
      notes = [
        'featureNotes.attractFollowersFeature:' +
          'May build stronghold and attract followers',
        'magicNotes.eldritchCraftFeature:May create magical items',
        'validationNotes.illusionistClassCharisma:Requires Charisma >= 6',
        'validationNotes.illusionistClassDexterity:Requires Dexterity >= 16',
        'validationNotes.illusionistClassIntelligence:' +
          'Requires Intelligence >= 15',
        'validationNotes.illusionistClassStrength:Requires Strength >= 6',
        'validationNotes.illusionistClassWisdom:Requires Wisdom >= 6'
      ];
      saveAimed = '11 - 2 * Math.floor((source-1) / 5)';
      saveBreath = '15 - 2 * Math.floor((source-1) / 5)';
      saveDeath = 'source < 6 ? 14 : source < 11 ? 13 : source < 16 ? 11 : ' +
                  'source < 21 ? 10 : 8';
      savePetrification = '13 - 2 * Math.floor((source-1) / 5)';
      saveUnclassified = '12 - 2 * Math.floor((source-1) / 5)';
      spellAbility = 'intelligence';
      spellsKnown = [
        'I1:1:1/2:2/4:3/5:4/9:5/24:6',
        'I2:3:1/4:2/5:3/10:4/12:5/24:6',
        'I3:5:1/7:2/9:3/12:4/16:5/24:6',
        'I4:8:1/9:2/11:3/15:4/18:5/24:6',
        'I5:10:1/11:2/16:3/19:4/21:5/25:6',
        'I6:12:1/13:2/18:3/21:4/22:5/25:6',
        'I7:14:1/15:2/20:3/22:4/23:5/25:6'
      ];

    } else if(klass == 'Magic User') {
      baseAttack =
        'source<6 ? -1 : source<11 ? 1 : source<16 ? 4 : source<21 ? 7 : 9';
      features = [
        '7:Eldritch Craft', '10:Attract Followers', '17:Eldritch Power'
      ];
      hitDie = 4;
      notes = [
        'featureNotes.attractFollowersFeature:' +
          'May build stronghold and attract followers',
        'magicNotes.eldritchCraftFeature:May create magical items',
        'magicNotes.eldritchPowerFeature:May use <i>Enchant an Item</i> spell',
        'validationNotes.magicUserClassCharisma:Requires Charisma >= 6',
        'validationNotes.magicUserClassConstitution:Requires Constitution >= 6',
        'validationNotes.magicUserClassDexterity:Requires Dexterity >= 6',
        'validationNotes.magicUserClassIntelligence:Requires Intelligence >= 9',
        'validationNotes.magicUserClassWisdom:Requires Wisdom >= 6'
      ];
      saveAimed = '11 - 2 * Math.floor((source-1) / 5)';
      saveBreath = '15 - 2 * Math.floor((source-1) / 5)';
      saveDeath = 'source < 6 ? 14 : source < 11 ? 13 : source < 16 ? 11 : ' +
                  'source < 21 ? 10 : 8';
      savePetrification = '13 - 2 * Math.floor((source-1) / 5)';
      saveUnclassified = '12 - 2 * Math.floor((source-1) / 5)';
      spellAbility = 'intelligence';
      spellsKnown = [
        'M1:1:1/2:2/4:3/5:4/13:5/26:6/29:7',
        'M2:3:1/4:2/5:3/9:4/12:5/26:6/29:7',
        'M3:5:1/6:2/8:3/11:4/13:5/26:6/29:7',
        'M4:7:1/8:2/11:3/12:4/15:5/26:6/29:7',
        'M5:9:1/10:2/11:3/12:4/15:5/27:6',
        'M6:12:1/13:2/16:3/20:4/22:5/27:6',
        'M7:14:1/16:2/17:3/21:4/23:5/27:6',
        'M8:16:1/17:2/19:3/21:4/23:5/28:6',
        'M9:18:1/20:2/22:3/24:4/25:5/28:6'
      ];

    } else if(klass == 'Paladin') {
      baseAttack = 'Math.floor((source - 1) / 2) * 2';
      features = [
        'Cure Disease', 'Discriminating', 'Divine Health', 'Lay on Hands',
        'Nonmaterialist', 'Philanthropist', '3:Turn Undead', '4:Summon Warhorse'
      ];
      hitDie = 10;
      notes = [
        'featureNotes.nonmaterialistFeature:' +
          'May not own > 10 magic items, including 1 armor suit and 1 shield',
        'featureNotes.philanthropistFeature:' +
          'Must donate 10% of income to lawful good causes',
        'featureNotes.discriminatingFeature:' +
          'Must not associate w/non-good characters',
        'magicNotes.cureDiseaseFeature:<i>Cure Disease</i> %V/week',
        'magicNotes.layOnHandsFeature:Heal %V HP/day',
        'saveNotes.divineHealthFeature:Immune to disease',
        'validationNotes.paladinClassAlignment:' +
          'Requires Alignment == Lawful Good',
        'validationNotes.paladinClassCharisma:Requires Charisma >= 17',
        'validationNotes.paladinClassConstitution:Requires Constitution >= 9',
        'validationNotes.paladinClassDexterity:Requires Dexterity >= 6',
        'validationNotes.paladinClassIntelligence:Requires Intelligence >= 9',
        'validationNotes.paladinClassStrength:Requires Strength >= 12',
        'validationNotes.paladinClassWisdom:Requires Wisdom >= 13'
      ];
      saveAimed =
        '14 - Math.floor((source-1) / 2) - Math.floor((source-1) / 4)';
      saveBreath =
        '15 - Math.floor((source-1) / 2) - 2 * Math.floor((source-1) / 4)';
      saveDeath =
        '12 - Math.floor((source-1) / 2) - Math.floor((source-1) / 4)';
      savePetrification =
        '13 - Math.floor((source-1) / 2) - Math.floor((source-1) / 4)';
      saveUnclassified =
        '15 - Math.floor((source-1) / 2) - Math.floor((source-1) / 4)';
      spellAbility = 'wisdom';
      spellsKnown = [
        'C1:9:1/10:2/14:3',
        'C2:11:1/12:2/16:3',
        'C3:13:1/17:2/18:3',
        'C4:15:1/19:2/20:2'
      ];
      rules.defineRule('attacksPerRound',
        'levels.Paladin', '+=', 'Math.floor(source / 7) * 0.5'
      );
      rules.defineRule('magicNotes.cureDiseaseFeature',
        'levels.Paladin', '=', 'Math.floor(source / 5) + 1'
      );
      rules.defineRule
        ('magicNotes.layOnHandsFeature', 'levels.Paladin', '+=', '2 * source');
      rules.defineRule('turnUndead.level',
        'levels.Paladin', '+=', 'source > 2 ? source - 2 : null'
      );
      rules.defineRule('turningLevel', 'turnUndead.level', '^=', null);
      rules.defineRule('warriorLevel', 'levels.Paladin', '+', null);

    } else if(klass == 'Ranger') {
      baseAttack = 'Math.floor((source - 1) / 2) * 2';
      features = [
        'Loner', 'Selective', 'Ranger Favored Enemy', 'Tracking',
        'Travel Light', 'Unsurprised', '10:Scrying', '10:Band of Followers'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.unsurprisedFeature:Surprised only 1/6 time',
        'combatNotes.rangerFavoredEnemyFeature:' +
          '+%V melee damage vs. evil humanoid/giant foe',
        'featureNotes.bandOfFollowersFeature:Will attract followers',
        'featureNotes.lonerFeature:Will not work with > 2 other rangers',
        'featureNotes.selectiveFeature:Must employ only good henchmen',
        'featureNotes.trackingFeature:' +
          '90% rural/65% urban/dungeon base chance creature tracking',
        'featureNotes.travelLightFeature:' +
          'Will not possess more than can be carried',
        'magicNotes.scryingFeature:May use crystal balls and simiar devices',
        'validationNotes.rangerClassAlignment:Requires Alignment =~ Good',
        'validationNotes.rangerClassCharisma:Requires Charisma >= 6',
        'validationNotes.rangerClassConstitution:Requires Constitution >= 14',
        'validationNotes.rangerClassDexterity:Requires Dexterity >= 6',
        'validationNotes.rangerClassIntelligence:Requires Intelligence >= 13',
        'validationNotes.rangerClassStrength:Requires Strength >= 13',
        'validationNotes.rangerClassWisdom:Requires Wisdom >= 14'
      ];
      saveAimed =
        '16 - Math.floor((source-1) / 2) - Math.floor((source-1) / 4)';
      saveBreath =
        '17 - Math.floor((source-1) / 2) - 2 * Math.floor((source-1) / 4)';
      saveDeath =
        '14 - Math.floor((source-1) / 2) - Math.floor((source-1) / 4)';
      savePetrification =
        '15 - Math.floor((source-1) / 2) - Math.floor((source-1) / 4)';
      saveUnclassified =
        '17 - Math.floor((source-1) / 2) - Math.floor((source-1) / 4)';
      spellAbility = 'wisdom';
      spellsKnown = [
        'D1:8:1/10:2',
        'D2:12:1/14:2',
        'D3:16:1/17:2',
        'M1:9:1/11:2',
        'M2:13:1/15:2'
      ];
      rules.defineRule('attacksPerRound',
        'levels.Ranger', '+=', 'Math.floor(source / 7) * 0.5'
      );
      rules.defineRule
        ('combatNotes.rangerFavoredEnemyFeature', 'levels.Ranger', '=', null);
      rules.defineRule('warriorLevel', 'levels.Ranger', '+', null);

    } else if(klass == 'Thief') {
      baseAttack = '(source < 9 ? -1 : 0) + Math.floor((source - 1) / 4) * 2'
      hitDie = 6;
      notes = [
        'validationNotes.thiefClassAlignment:Requires Alignment !~ Good',
        'validationNotes.thiefClassCharisma:Requires Charisma >= 6',
        'validationNotes.thiefClassConstitution:Requires Constitution >= 6',
        'validationNotes.thiefClassDexterity:Requires Dexterity >= 9',
        'validationNotes.thiefClassIntelligence:Requires Intelligence >= 6',
        'validationNotes.thiefClassStrength:Requires Strength >= 6'
      ];
      saveAimed = '14 - Math.floor((source - 1) / 4) * 2';
      saveBreath = '16 - Math.floor((source - 1) / 4)';
      saveDeath = '13 - Math.floor((source - 1) / 4)';
      savePetrification = '12 - Math.floor((source - 1) / 4)';
      saveUnclassified = '15 - Math.floor((source - 1) / 4) * 2';
      rules.defineRule('languageCount', '+=', 'levels.Thief', '1');
      rules.defineRule('languages.Thieves\' Cant', '=', 'levels.Thief', '1');

    } else
      continue;

    SRD35.defineClass
      (rules, klass, hitDie, null, baseAttack, null, null,
       null, null, null, null, null, features,
       spellsKnown, null, spellAbility);
    if(notes != null)
      rules.defineNote(notes);
    if(feats != null) {
      for(var j = 0; j < feats.length; j++) {
        rules.defineChoice('feats', feats[j] + ':' + klass);
      }
    }
    if(selectableFeatures != null) {
      for(var j = 0; j < selectableFeatures.length; j++) {
        var selectable = selectableFeatures[j];
        rules.defineChoice('selectableFeatures', selectable + ':' + klass);
        rules.defineRule('features.' + selectable,
          'selectableFeatures.' + selectable, '+=', null
        );
      }
    }

  }

  rules.defineNote
    ('validationNotes.selectableFeaturesTotal:' +
     'Allocated selectable features differ from selectable features count ' +
     'total by %V');
  rules.defineRule('validationNotes.selectableFeaturesTotal',
    /^selectableFeatureCount\./, '+=', '-source',
    /^selectableFeatures\./, '+=', 'source'
  );

};

/* Defines the rules related to combat. */
FirstEdition.combatRules = function(rules) {
  
  rules.defineRule('armorClass',
    null, '=', '10',
    'armor', '+', 'FirstEdition.armorsArmorClassBonuses[source]',
    'shield', '+', 'source=="None" ? null : -1'
  );
  rules.defineRule('attacksPerRound', '=', '1');
  rules.defineRule('baseAttack', '', '=', '0');
  rules.defineRule('meleeAttack', 'baseAttack', '=', null);
  rules.defineRule('rangedAttack', 'baseAttack', '=', null);
  // TODO

};

/* Defines the rules related to equipment. */
FirstEdition.equipmentRules = function(rules, armors, goodies, shields, weapons) {

  rules.defineChoice('armors', armors);
  rules.defineChoice('goodies', goodies);
  rules.defineChoice('shields', shields);
  rules.defineChoice('weapons', weapons);
  // TODO combatNotes.strengthDamageAdjustment handled directly by Scribe
  // Hack to get it to appear in italics
  rules.defineRule
    ('level', 'combatNotes.strengthDamageAdjustment', '=', 'null');

};

/* Defines the rules related to spells. */
FirstEdition.magicRules = function(rules, classes) {

  for(var i = 0; i < classes.length; i++) {
    var klass = classes[i];
    var spells;
    if(klass == 'Cleric') {
      spells = [
        'C1:Bless:Command:Create Water:Cure Light Wounds:Detect Evil:' +
        'Detect Magic:Light:Protection From Evil:Purify Food And Drink:' +
        'Remove Fear:Resist Cold:Sanctuary',
        'C2:Augury:Chant:Detect Charm:Find Traps:Hold Person:Know Alignment:' +
        'Resist Fire:Silence 15\' Radius:Slow Poison:Snake Charm:' +
        'Speak With Animals:Spiritual Weapon',
        'C3:Animate Dead:Continual Light:Create Food And Water:' +
        'Cure Blindness:Cure Disease:Dispel Magic:Feign Death:' +
        'Glyph Of Warding:Locate Object:Prayer:Remove Curse:Speak With Dead',
        'C4:Cure Serious Wounds:Detect Lie:Divination:Exorcise:Lower Water:' +
        'Neutralize Poison:Protection From Evil 10\' Radius:' +
        'Speak With Plants:Sticks To Snakes:Tongues',
        'C5:Atonement:Commune:Cure Critical Wounds:Dispel Evil:Flame Strike:' +
        'Insect Plague:Plane Shift:Quest:Raise Dead:True Seeing',
        'C6:Aerial Servant:Animate Object:Blade Barrier:Conjure Animals:' +
        'Find The Path:Heal:Part Water:Speak With Monsters:Stone Tell:' +
        'Word Of Recall',
        'C7:Astral Spell:Control Weather:Earthquake:Gate:Holy Word:' +
        'Regenerate:Restoration:Resurrection:Symbol:Wind Walk'
      ];
    } else if(klass == 'Druid') {
      spells = [
        'D1:Animal Friendship:Detect Magic:Detect Pits And Snares:Entangle:' +
        'Faerie Fire:Invisibility To Animals:Locate Animals:' +
        'Pass Without Trace:Predict Weather:Purify Water:Shillelagh:' +
        'Speak With Animals',
        'D2:Barkskin:Charm Person Or Mammal:Create Water:Cure Light Wounds:' +
        'Feign Death:Fire Trap:Heat Metal:Locate Plants:Obscurement:' +
        'Produce Flame:Trip:Warp Wood',
        'D3:Call Lightning:Cure Disease:Hold Animal:Neutralize Poison:' +
        'Plant Growth:Protection From Fire:Pyrotechnics:Snare:Stone Shape:' +
        'Summon Insects:Tree:Water Breathing',
        'D4:Animal Summoning I:Call Woodland Beings:' +
        'Control Temperature 100\':Cure Serious Wounds:Dispel Magic:' +
        'Hallucinatory Forest:Hold Plant:Plant Door:Produce Fire:' +
        'Protection From Lightning:Repel Insects:Speak With Plants',
        'D5:Animal Growth:Animal Summoning II:Anti-Plant Shell:' +
        'Commune With Nature:Control Winds:Insect Plague:Pass Plant:' +
        'Sticks To Snakes:Transmute Rock To Mud:Wall Of Fire',
        'D6:Animal Summoning III:Anti-Animal Shell:Conjure Fire Elemental:' +
        'Cure Critical Wounds:Feeblemind:Fire Seeds:Transport Via Plants:' +
        'Turn Wood:Wall Of Thorns:Weather Summoning',
        'D7:Animate Rock:Chariot Of Fire:Confusion:Conjure Earth Elemental:' +
        'Control Weather:Creeping Doom:Finger Of Death:Fire Storm:' +
        'Reincarnate:Transmute Metal To Wood'
      ];
    } else
      continue;
    if(spells != null) {
      for(var j = 0; j < spells.length; j++) {
        var pieces = spells[j].split(':');
        for(var k = 1; k < pieces.length; k++) {
          var spell = pieces[k];
          spell += '(' + pieces[0] + ')';
          rules.defineChoice('spells', spell);
        }
      }
    }
  }

  rules.defineRule('casterLevel',
    'casterLevelArcane', '+=', null,
    'casterLevelDivine', '+=', null
  );

}

/* Defines the rules related to character movement. */
FirstEdition.movementRules = function(rules) {
  rules.defineRule('loadLight',
    '', '=', '35',
    'abilityNotes.strengthEncumbranceAdjustment', '+', null
  );
  rules.defineRule('loadMedium',
    '', '=', '70',
    'abilityNotes.strengthEncumbranceAdjustment', '+', null
  );
  rules.defineRule('loadHeavy',
    '', '=', '105',
    'abilityNotes.strengthEncumbranceAdjustment', '+', null
  );
  rules.defineRule('loadMax',
    '', '=', '150',
    'abilityNotes.strengthEncumbranceAdjustment', '+', null
  );
};

/* Defines the rules related to character races. */
FirstEdition.raceRules = function(rules, languages, races) {

  rules.defineChoice('languages', languages);
  rules.defineRule('languageBonus',
    'race', 'v',
    'source == "Human" ? null : ' +
    'source.indexOf("Elf") >= 0 && source != "Half Elf" ? 3 : 2'
  );

  rules.defineNote
    ('validationNotes.languagesTotal:Allocated languages differ from ' +
     'language total by %V');
  rules.defineRule('validationNotes.languagesTotal',
    'languageCount', '+=', '-source',
    /^languages\./, '+=', null
  );

  for(var i = 0; i < races.length; i++) {

    // TODO: ability limits, level limits
    var adjustment, features, languages, notes;
    var race = races[i];
    var raceNoSpace =
      race.substring(0,1).toLowerCase() + race.substring(1).replace(/ /g, '');

    if(race == 'Half Elf') {

      adjustment = null;
      features = [
        'Detect Secret Doors', 'Infravision', 'Resist Charm', 'Resist Sleep'
      ];
      languages = [
        'Common', 'Elvish', 'Gnoll', 'Gnome', 'Goblin', 'Halfling',
        'Hobgoblin', 'Orcish'
      ];
      notes = [
        'featureNotes.detectSecretDoorsFeature:' +
          '1in6 passing, 2in6 searching, 3in6 concealed',
        'featureNotes.infravisionFeature:%V ft vision in darkness',
        'featureNotes.senseSecretDoorsFeature:' +
          '1in6 passing, 2in6 searching, 3in6 concealed',
        'saveNotes.resistCharmFeature:%V% vs. charm',
        'saveNotes.resistSleepFeature:%V% vs. sleep'
      ];
      rules.defineRule('featureNotes.infravisionFeature',
        'halfElfFeatures.Infravision', '+=', '60'
      );
      rules.defineRule('saveNotes.resistCharmFeature',
        'halfElfFeatures.Resist Charm', '+=', '30'
      );
      rules.defineRule('saveNotes.resistSleepFeature',
        'halfElfFeatures.Resist Sleep', '+=', '30'
      );

    } else if(race == 'Half Orc') {

      adjustment = '+1 strength/+1 constitution/-2 charisma';
      features = ['Infravision'];
      languages = ['Common', 'Orcish'];
      notes = [
        'featureNotes.infravisionFeature:%V ft vision in darkness'
      ];
      rules.defineRule('featureNotes.infravisionFeature',
        'halfOrcFeatures.Infravision', '+=', '60'
      );

    } else if(race.match(/Dwarf/)) {

      adjustment = '+1 constitution/-1 charisma';
      features = [
        'Dodge Giants', 'Dwarf Favored Enemy', 'Infravision', 'Know Depth',
        'Know Stone', 'Resist Magic', 'Resist Poison', 'Sense Construction',
        'Sense Slope', 'Slow'
      ];
      languages = [
        'Common', 'Dwarven', 'Gnomish', 'Goblin', 'Kobold', 'Orcish'
      ];
      notes = [
        'combatNotes.dodgeGiantsFeature:-4 AC vs. giant creatures',
        'combatNotes.dwarfFavoredEnemyFeature:+1 attack vs. goblinoid/orc',
        'featureNotes.infravisionFeature:%V ft vision in darkness',
        'featureNotes.knowDepthFeature:' +
          'Determine approximate depth underground %V%',
        'featureNotes.knowStoneFeature:Detect stonework traps 50% w/in 10 ft',
        'featureNotes.senseConstructionFeature:' +
          'Detect new construction 75%/sliding walls 66% w/in 10 ft',
        'featureNotes.senseSlopeFeature:Detect slope/grade %V% w/in 10 ft',
        'saveNotes.resistMagicFeature:+%V vs. spells',
        'saveNotes.resistPoisonFeature:+%V vs. poison'
      ];

      rules.defineRule('featureNotes.infravisionFeature',
        raceNoSpace + 'Features.Infravision', '+=', '60'
      );
      rules.defineRule('featureNotes.knowDepthFeature',
        raceNoSpace + 'Features.Know Depth', '+=', '50'
      );
      rules.defineRule('featureNotes.senseSlopeFeature',
        raceNoSpace + 'Features.Sense Slope', '+=', '75'
      );
      rules.defineRule('saveNotes.resistMagicFeature',
        'constitution', '=', 'Math.floor(source / 3.5)'
      );
      rules.defineRule('saveNotes.resistPoisonFeature',
        'constitution', '=', 'Math.floor(source / 3.5)'
      );

    } else if(race.match(/Elf/)) {

      adjustment = '+1 dexterity/-1 constitution';
      features = [
        'Bow Precision', 'Detect Secret Doors', 'Infravision', 'Resist Charm',
        'Resist Sleep', 'Stealthy', 'Sword Precision'
      ];
      languages = [
        'Common', 'Elven', 'Gnoll', 'Gnomish', 'Goblin', 'Halfling',
        'Hobgoblin', 'Orcish'
      ];
      notes = [
        'combatNotes.bowPrecisionFeature:+1 attack w/bows',
        'combatNotes.swordPrecisionFeature:+1 attack w/longsword/short sword',
        'combatNotes.stealthyFeature:4in6 surprise when traveling quietly',
        'featureNotes.detectSecretDoorsFeature:' +
          '1in6 passing, 2in6 searching, 3in6 concealed',
        'featureNotes.infravisionFeature:%V ft vision in darkness',
        'saveNotes.resistCharmFeature:%V% vs. charm',
        'saveNotes.resistSleepFeature:%V% vs. sleep'
      ];

      // TODO rules for bow/sword precision
      rules.defineRule('featureNotes.infravisionFeature',
        raceNoSpace + 'Features.Infravision', '+=', '60'
      );
      rules.defineRule('saveNotes.resistCharmFeature',
        raceNoSpace + 'Features.Resist Charm', '+=', '90'
      );
      rules.defineRule('saveNotes.resistSleepFeature',
        raceNoSpace + 'Features.Resist Sleep', '+=', '90'
      );

    } else if(race.match(/Gnome/)) {

      adjustment = null;
      features = [
        'Burrow Friend', 'Direction Sense', 'Dodge Giants', 'Infravision',
        'Know Depth', 'Resist Magic', 'Resist Poison', 'Sense Hazard',
        'Sense Slope', 'Slow'
      ];
      languages = [
        'Common', 'Dwarven', 'Gnomish', 'Goblin', 'Halfling', 'Kobold'
      ];
      notes = [
        'combatNotes.dodgeGiantsFeature:-4 AC vs. giant creatures',
        'featureNotes.burrowFriendFeature:Speak w/burrowing animals',
        'featureNotes.directionSenseFeature:Determine N underground 50%',
        'featureNotes.infravisionFeature:%V ft vision in darkness',
        'featureNotes.senseHazardFeature:' +
          'Detect unsafe wall/ceiling/floor 75% w/in 10 ft',
        'featureNotes.senseSlopeFeature:Detect slope/grade %V% w/in 10 ft',
        'saveNotes.resistMagicFeature:+%V vs. spells',
        'saveNotes.resistPoisonFeature:+%V vs. poison'
      ];
      rules.defineRule('featureNotes.infravisionFeature',
        raceNoSpace + 'Features.Infravision', '+=', '60'
      );
      rules.defineRule('featureNotes.knowDepthFeature',
        raceNoSpace + 'Features.Know Depth', '+=', '60'
      );
      rules.defineRule('featureNotes.senseSlopeFeature',
        raceNoSpace + 'Features.Sense Slope', '+=', '80'
      );
      rules.defineRule('saveNotes.resistMagicFeature',
        'constitution', '=', 'Math.floor(source / 3.5)'
      );
      rules.defineRule('saveNotes.resistPoisonFeature',
        'constitution', '=', 'Math.floor(source / 3.5)'
      );

    } else if(race.match(/Halfling/)) {

      adjustment = '+1 dexterity/-1 strength';
      features = [
        'Accurate', 'Resist Magic', 'Resist Poison', 'Slow', 'Stealthy'
      ];
      languages = [
        'Common', 'Dwarven', 'Gnome', 'Goblin', 'Halfling', 'Orcish'
      ];
      notes = [
        'combatNotes.accurateFeature:+3 attack with sling/bow',
        'combatNotes.stealthyFeature:4in6 surprise when traveling quietly',
        'saveNotes.resistMagicFeature:+%V vs. spells',
        'saveNotes.resistPoisonFeature:+%V vs. poison'
      ];
      rules.defineRule('saveNotes.resistMagicFeature',
        'constitution', '=', 'Math.floor(source / 3.5)'
      );
      rules.defineRule('saveNotes.resistPoisonFeature',
        'constitution', '=', 'Math.floor(source / 3.5)'
      );

    } else if(race.match(/Human/)) {

      adjustment = null;
      features = null;
      notes = null;

    } else
      continue;

    SRD35.defineRace(rules, race, adjustment, features);
    if(notes != null) {
      rules.defineNote(notes);
    }

  }

};
