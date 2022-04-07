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
/* jshint forin: false */
/* globals OldSchool, OSRIC, QuilvynUtils */
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

  if(rules == null)
    return; // Depend on OldSchool to invoke with 1E rules

  if(window.UnearthedArcana1e == null) {
    alert('The UnearthedArcana1e module requires use of the OldSchool module');
    return;
  }

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
  'Barbarian':
    'Require=' +
      '"alignment !~ \'Lawful\'","race == \'Human\'","strength >= 15",' +
      '"constitution >= 15","dexterity >= 14","wisdom <= 16" ' +
    'HitDie=d10,9,3 Attack=0,1,1,- WeaponProficiency=4,2,2 ' +
    'Breath=17,1.5,2 Death=14,1.5,2 Petrification=15,1.5,2 Spell=17,1.5,2 Wand=16,1.5,2 ' +
    'Features=' +
      '"Armor Proficiency (All)","Shield Proficiency (All)",' +
      '"Fighting The Unskilled","Bonus Attacks",' +
      '"Animal Handling","Back Protection","Barbarian Resistance",' +
      '"Climbing","Detect Magic",Fast,"First Aid",' +
      '"Hide In Natural Surroundings",Horsemanship,Leadership,' +
      '"Leaping And Springing","Long Distance Signaling","Outdoor Craft",' +
      'Running,"Small Craft","Snare Building","Sound Imitation",Surprise,' +
      'Survival,"Tough Hide",Tracking,"4:Irresistable Assault" ' +
    'Experience=' +
      '0,6,12,24,48,80,150,275,500,1000,1500,2000,2500,3000,3500,4000,4500,' +
      '5000,5500,6000,6500,7000,7500,8000,8500,9000,9500,10000,10500',
  'Cavalier':
    'Require=' +
      '"alignment =~ \'Good\'","strength >= 15","dexterity >= 15",' +
      '"constitution >= 15","intelligence >= 10","wisdom >= 10" ' +
    'HitDie=d10,9,3 Attack=0,2,2,-2@19 WeaponProficiency=4,3,2 ' +
    'Breath=17,1.5,2 Death=14,1.5,2 Petrification=15,1.5,2 Spell=17,1.5,2 Wand=16,1.5,2 ' +
    'Features=' +
      '"Armor Proficiency (All)","Shield Proficiency (All)",' +
      '"Bonus Attacks","Continuous Training","Deadly Lancer","Deadly Rider",' +
      'Diehard,Equestrian,"Fear Immunity","Fighting The Unskilled",' +
      '"Lance Expertise","Mental Resistance","2:Extra Attacks",' +
      '"3:Quick Mount","3:Sword Expertise","4:Unicorn Rider","5:Fast Ride",' +
      '"5:Mace Expertise","7:Special Mount" ' +
    'Experience=0,2.5,5,10,18.5,37,85,140,220,300,600,900,1200,1500,1800',
  'Druid':
    OldSchool.CLASSES.Druid
      .replace('Features=',
      'Features=' +
        '"16:Poison Immunity","16:Extra Longevity","16:Vigorous Health",' +
        '"16:Alter Appearance",17:Hibernate,"17:Planar Travel",' +
        '"17:Summon Elemental",'
      ) + ' ' +
      'Experience=0,2,4,7.5,12.5,20,35,60,90,125,200,300,750,1500,3000,3500,4000,4500,,5000,5500,6000,6500,7000 ',
  'Paladin':
    OldSchool.CLASSES.Paladin
      .replace('Features=',
      'Features=' +
        '"Armor Proficiency (All)","Shield Proficiency (All)",' +
        '"Bonus Attacks","Continuous Training","Deadly Lancer",' +
        '"Deadly Rider",Diehard,Equestrian,"Fear Immunity",' +
        '"Fighting The Unskilled","Lance Expertise","Mental Resistance",' +
        '"2:Extra Attacks","3:Quick Mount","3:Sword Expertise",' +
        '"4:Unicorn Rider","5:Fast Ride","5:Mace Expertise","7:Special Mount",'
      ) + ' ' +
      'Require=' +
        '"alignment =~ \'Lawful Good\'","strength>=15","dexterity>=15",' +
        '"constitution>=15","intelligence>=10","wisdom>=13","charisma>=17"',
  'Ranger':
    OldSchool.CLASSES.Ranger
      .replace('Features=', 'Features="Weapon Specialization",'),
  'Thief-Acrobat':
    OldSchool.CLASSES.Thief
      .replace('Features=',
      'Features=' +
        '"strength>=16/dexterity>=17 ? 6:Bonus Thief-Acrobat Experience",' +
        '"6:Thief-Acrobat Skills",' 
      ) + ' ' +
      'Require="alignment=~\'Neutral|Evil\'","strength>=15","dexterity>=16" ' +
      'Experience=' +
        '0,1.25,2.5,5,10,20,45,75,125,180,250,500,750,1000,1250,1500,1750,' +
        '2000,2250,2500,2750,3000,3250,3500,3750,4000,4250,4500,4750'
};
UnearthedArcana1e.FEATURES = {

  // Comeliness
  'Gorgeous':
    'Section=magic ' +
    'Note="May <i>Fascinate</i> creatures with wisdom %V or lower"',

  // Class
  'Alter Appearance':
    'Section=magic ' +
    'Note="May alter apparent age, height, weight, and facial features 1/seg"',
  'Animal Handling':'Section=skill Note="May handle and domescate wild dogs"',
  'Back Protection':
    'Section=combat ' +
    'Note="%{levels.Barbarian*5}% chance of noticing attacks from behind"',
  'Barbarian Resistance':
    'Section=save ' +
    'Note="+4 vs. poison/+3 Petrification/+3 Death/+3 vs. polymorph/+2 Wand/+2 Breath/+%1 Spell"',
  'Bonus Thief-Acrobat Experience':
    'Section=ability Note="10% added to awarded experience"',
  'Climbing':
    'Section=skill Note="Climb cliffs and trees; other surfaces with practice"',
  'Continuous Training':
    'Section=ability ' +
    'Note="Gains d100/100 strength, dexterity, and constitution at 1st level, 2d10/100 additional at each subsequent level"',
  'Deadly Lancer':
    'Section=combat ' +
    'Note="+%{levels.Cavalier} lance damage when mounted, +1 dismounted"',
  'Deadly Rider':'Section=combat Note="+%V attack when mounted"',
  'Detect Magic':
    'Section=save ' +
    'Note="%{levels.Barbarian*5<?75}% chance of detecting illusions, %{levels.Barbarian*5+20<?90}% other magic"',
  'Diehard':'Section=combat Note="Remains conscious at negative HP"',
  'Equestrian':
    'Section=skill ' +
    'Note="%{16-levels.Cavalier}% chance of being unsaddled or being injured when mount falls"',
  'Extra Attacks':'Section=combat Note="+%V attacks/rd with expertise weapons"',
  'Extra Longevity':
    'Section=feature Note="May live an additional %{levels.Druid*10} years"',
  'Fast Ride':'Section=skill Note="Can ride at +2\\" pace for 1 hr"',
  'Fear Immunity':'Section=save Note="R10\' Immune to fear"',
  'First Aid':
    'Section=skill ' +
    'Note="Binding wounds restores 1 HP and doubles healing rate; 10% chance of curing poison or disease"',
  'Hibernate':'Section=feature Note="May enter ageless hibernation"',
  'Hide In Natural Surroundings':
    'Section=skill Note="Use Hide In Shadows skill in natural surroundings"',
  'Horsemanship':'Section=combat Note="May ride horse into battle"',
  'Irresistable Assault':
    'Section=combat ' +
    'Note="Attacks bypass +%{(levels.Barbarian-2)//2} magic weapon requirement"',
  'Lance Expertise':
    'Section=combat ' +
    'Note="+%V attack with lance when horsed, or parry for foe -%V attack"',
  'Leadership':
    'Section=ability Note="+%{levels.Barbarian} Charisma (other barbarians)"',
  'Leaping And Springing':
    'Section=skill ' +
    'Note="May jump 10\' forward, 3\' up or back, from standing start; d6+15\' forward, d4/2+4\' up, with running start"',
  'Long Distance Signaling':
    'Section=skill Note="May send messages over distances"',
  'Mace Expertise':
    'Section=combat ' +
    'Note="+%V attack with choice of horseman\'s mace, flail, or military pick, or parry for foe -%V attack"',
  'Mental Resistance':
    'Section=save Note="90% resistance to mental attacks, +2 vs. illusions"',
  'Outdoor Craft':
    'Section=skill ' +
    'Note="Determine Direction and Druid\'s Knowledge features; able to Predict Weather as with the spell"',
  'Poison Immunity':'Section=save Note="Immunity to natural poisons"',
  'Planar Travel':'Section=magic Note="May move to %V 1/dy"',
  'Running':'Section=ability Note="May move at dbl speed for three days"',
  'Quick Mount':
    'Section=skill Note="Can vault into saddle in armor and ride in 1 seg"',
  'Small Craft':
    'Section=skill Note="May build and use rowed or paddled water transport"',
  'Snare Building':
    'Section=skill Note="Can construct and conceal traps and snares"',
  'Sound Imitation':'Section=skill Note="Can imitate birds and animal calls"',
  'Special Mount':'Section=skill Note="Can ride a %V"',
  'Summon Elemental':'Section=magic Note="Can conjure %V elemental 1/dy"',
  'Surprise':
    'Section=combat ' +
    'Note="Surprise 3in6 (4in6 familiar terrain); surprised 1in10 (1in20 familiar terrain)"',
  'Survival':'Section=skill Note="May hunt and forage in familiar terrain"',
  'Sword Expertise':
    'Section=combat ' +
    'Note="+%V attack with choice of broad sword, long sword, or scimitar, or parry for foe -%V attack"',
  'Thief-Acrobat Skills':
    'Section=skill ' +
    'Note="Tightrope Walking, Pole Vaulting, High Jumping, Standing Broad Jumping, Running Broad Jumping, Tumbling Attack, Tumbling Evasion, Tumbling Falling"',
  'Tough Hide':'Section=combat Note="+%V AC"',
  // Override OSRIC Tracking defn
  'Tracking':
    'Section=feature ' +
    'Note="%{((levels.Ranger||0)+(levels.Barbarian||0))*10+10<?110}% base change to track creature"',
  'Unicorn Rider':'Section=skill Note="Can ride a unicorn"',
  'Vigorous Health':'Section=feature Note="Has full health and vigor"',

  // Race
  'Ambidextrous':
    'Section=combat ' +
    'Note="May fight using a weapon in each hand without penalty"',
  'Animal Friend':
    'Section=magic Note="May befriend and train woodland creatures"',
  'Dark Elf Resistance':'Section=save Note="+2 vs. magic"',
  'Deep Gnome Enmity':'Section=combat Note="+1 attack vs. drow and kuo-toa"',
  'Deep Gnome Magic':'Section=magic Note="Cast <i>Blindness</i>, <i>Blur</i>, <i>Change Self</i>%1 1/dy"',
  'Deep Gnome Resistance':
    'Section=save Note="+2 vs. poison/+3 all others/Immune illusions"',
  'Drow Magic':
    'Section=magic ' +
    'Note="Cast <i>Dancing Lights</i>, <i>Faerie Fire</i>, <i>Darkness</i> (5\' radius)%1%2 1/dy"',
  'Extended Infravision':'Section=feature Note="120\' vision in darkness"',
  'Extremely Stealthy':
    'Section=combat Note="Surprised 1in12; surprise 9in10"',
  'Fast':'Section=ability Note="+30 Speed"',
  'Gray Dwarf Immunities':
    'Section=save ' +
    'Note="Immunity to illusions, paralyzation, and non-natural poison"',
  'Gray Elf Ability Adjustment':
    'Section=ability Note="+1 Dexterity/-1 Constitution/+1 Intelligence"',
  'Light Blindness':
    'Section=combat,feature ' +
    'Note="3\\" vision in bright light","-1 attack in bright light"',
  'Light Sensitivity':
    'Section=ability,combat ' +
    'Note="-2 Dexterity in full light",' +
         '"-2 attacks and foes +2 saves in full light"',
  'Sharp Eye':'Section=combat Note="Surprised 1in8 in less than full light"',
  'Shielded':'Section=magic Note="Continuous self <i>Non-Detection</i> effect"',
  'Stone Camouflage':
    'Section=feature Note="60% chance of hiding against natural stone"',
  'Trapper':'Section=skill Note="May set traps with 90% success"',
  'Valley Elf Ability Adjustment':
    'Section=ability Note="+1 Dexterity/-1 Constitution/+1 Intelligence"',
  'Very Stealthy':
    'Section=combat ' +
    'Note="Surprised 1in10 and surprise 3in6 in less than full light"',
  'Wild Elf Ability Adjustment':
    'Section=ability Note="+1 Dexterity/-1 Constitution/+2 Strength"',
  'Wood Elf Ability Adjustment':
    'Section=ability Note="+1 Dexterity/-1 Constitution/+1 Strength/-1 Intelligence"',
  'Woodland Tongue':'Section=feature Note="May speak with forest mammals"'

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
      '"Determine Depth","Drow Magic","Extended Infravision",Fast,' +
      '"Light Sensitivity","Resist Charm","Resist Sleep","Sharp Eye",Stealthy '+
    'Languages=' +
      'Common,Undercommon,Elf,Gnome,"Drow Sign"',
  'Deep Gnome':
    'Require=' +
      '"constitution >= 8","intelligence >= 7","strength >= 6" ' +
    'Features=' +
      '"Deep Gnome Enmity","Deep Gnome Magic","Deep Gnome Resistance",' +
      '"Detect Hazard","Detect Slope","Determine Depth",' +
      '"Determine Direction","Extended Infravision","Extremely Stealthy",' +
      '"Gnome Dodge","Light Blindness","Resist Magic","Resist Poison",' +
      'Shielded,Slow,"Stone Camouflage" ' +
    'Languages=' +
      'Gnome',
  'Gray Dwarf':
    OldSchool.RACES.Dwarf
      .replace(/"?(1:)?Infravision"?/, '"Extended Infravision"')
      .replace(/"(1:)?Dwarf Enmity"/, '"Gray Dwarf Immunities","Light Sensitivity","Very Stealthy"') +
      ' Languages=Undercommon,Dwarf',
  'Gray Elf':
    OldSchool.RACES.Elf
      .replace(/Elf Ability Adjustment/, 'Gray Elf Ability Adjustment'),
  'Valley Elf':
    OldSchool.RACES.Elf
      .replace(/Elf Ability Adjustment/, 'Valley Elf Ability Adjustment')
      .replace(/Languages=/, 'Languages=Gnome,'),
  'Wild Elf':
    OldSchool.RACES.Elf
      .replace(/Elf Ability Adjustment/, 'Wild Elf Ability Adjustment')
      .replace(/Features=/, 'Features="Animal Friend",Trapper,') +
      ' Languages=Elf',
  'Wood Elf':
    OldSchool.RACES.Elf
      .replace(/Elf Ability Adjustment/, 'Wood Elf Ability Adjustment')
      .replace(/Features=/, 'Features="Woodland Tongue",') +
      ' Languages=Elf,Common,Treant'
};

/* Defines rules related to character abilities. */
UnearthedArcana1e.abilityRules = function(rules) {

  rules.defineRule('abilityNotes.charismaComelinessModifier',
    'charismaComelinessModifier', '=', 'QuilvynUtils.signed(source)'
  );
  rules.defineRule('abilityNotes.raceComelinessModifier',
    'abilityNotes.raceComelinessModifier.1', '=', 'QuilvynUtils.signed(source)'
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
  if(name == 'Barbarian') {
    rules.defineRule('armorClass', 'combatRules.toughHide', '+', '-source');
    rules.defineRule('combatNotes.toughHide',
      'dexterity', '=', 'source>=15 ? (source - 14) * 2 : null',
      'armor', '*', 'source.match(/None|^Leather|Elfin Chain/) ? null : 0.5'
    );
    rules.defineRule('features.Determine Direction', classLevel, '=', '1');
    rules.defineRule("features.Druid's Knowledge", classLevel, '=', '1');
    rules.defineRule('saveNotes.barbarianResistance.1',
      classLevel, '=', 'Math.floor(source / 4)'
    );
    rules.defineRule('save.Breath', 'saveNotes.barbarianResistance', '+', '-2');
    rules.defineRule('save.Death', 'saveNotes.barbarianResistance', '+', '-3');
    rules.defineRule
      ('save.Petrification', 'saveNotes.barbarianResistance', '+', '-3');
    rules.defineRule
      ('save.Spell', 'saveNotes.barbarianResistance.1', '+', '-source');
    rules.defineRule('save.Wand', 'saveNotes.barbarianResistance', '+', '-2');
    rules.defineRule('skillLevel.Climb Walls', classLevel, '+=', null);
    rules.defineRule('skillLevel.Hide In Shadows', classLevel, '+=', null);
  } if(name == 'Cavalier' || name == 'Paladin') {
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
    rules.defineRule(name.toLowerCase() + 'Features.Unicorn Rider',
      'gender', '?', 'source == "Female"',
      'race', '?', 'source.match(/(^|\\s)Elf/)'
    );
    rules.defineRule('warriorLevel', classLevel, '+', null);
    if(name == 'Paladin') {
      rules.defineRule
        ('paladinFeatures.Bonus Paladin Experience', classLevel, 'v', '0');
    }
  } else if(name == 'Druid') {
    rules.defineRule('magicNotes.planarTravel',
      classLevel, '=', '"Plane" + (source>=18 ? "s" : "") + " of Earth" + (source>=18 ? ", Fire" : "") + (source>=19 ? ", Water" : "") + (source>=20 ? ", Air" : "") + (source>=21 ? ", Para-Elemental" : "") + (source>=22 ? ", Shadow" : "") + (source>=23 ? ", Inner Planes" : "")'
    );
    rules.defineRule('magicNotes.summonElemental',
      classLevel, '=', '"water" + (source>=18 ? ", air" : "") + (source>=19 ? ", magma, smoke" : "") + (source>=20 ? ", ice, ooze" : "")'
    );
  } else if(name == 'Thief-Acrobat') {

    rules.defineRule('combatNotes.backstab',
      classLevel, '+=', 'Math.min(Math.ceil(source / 4) + 1, 5)'
    );
    rules.defineRule('languageCount', classLevel, '+', '1');
    rules.defineRule("languages.Thieves' Cant", classLevel, '=', '1');
    rules.defineRule
      ('thief-AcrobatFeatures.Read Scrolls', classLevel, '=', '0');
    rules.defineRule('skillLevel.Climb Walls', classLevel, '+=', null);
    rules.defineRule
      ('skillLevel.Find Traps', classLevel, '+=', 'Math.min(source, 5)');
    rules.defineRule('skillLevel.Hear Noise', classLevel, '+=', null);
    rules.defineRule('skillLevel.Hide In Shadows', classLevel, '+=', null);
    rules.defineRule('skillLevel.Move Silently', classLevel, '+=', null);
    rules.defineRule
      ('skillLevel.Open Locks', classLevel, '+=', 'Math.min(source, 5)');
    rules.defineRule
      ('skillLevel.Pick Pockets', classLevel, '+=', 'Math.min(source, 5)');
    rules.defineRule('skillLevel.Read Languages', classLevel, '+=', null);
    rules.defineRule('skills.Tightrope Walking',
      classLevel, '=', 'source<6 ? null : source<12 ? source * 5 + 45 : 100'
    );
    rules.defineRule('skills.Pole Vaulting',
      classLevel, '=', 'source<6 ? null : (source * .5 + 6)'
    );
    rules.defineRule('skills.High Jumping',
      classLevel, '=', 'source<6 ? null : source<14 ? source * .25 + 2.5 : source==14 ? 6.25 : Math.min(source * .5 - 1, 9)'
    );
    rules.defineRule('skills.Standing Broad Jumping',
      classLevel, '=', 'source<6 ? null : Math.min(source * .5 + 2, 12)'
    );
    rules.defineRule('skills.Running Broad Jumping',
      classLevel, '=', 'source<6 ? null : source<13 ? source * .5 + 6 : Math.min(source, 22)'
    );
    rules.defineRule('skills.Tumbling Attack',
      classLevel, '=', 'source<6 ? null : Math.min(source, 20)',
    );
    rules.defineRule('skills.Tumbling Evasion',
      classLevel, '=', 'source<6 ? null : source<15 ? source * 5 - 20 : Math.min(source * 2 + 22, 60)'
    );
    rules.defineRule('skills.Tumbling Falling',
      classLevel, '=', 'Math.floor((source - 3) / 3) * 10 - (source==18||source==21||source==22 ? 10 : 0)'
    );
    rules.defineRule('skills.Tumbling Falling.1',
      classLevel, '=', 'source<6 ? null : source<15 ? (source % 3 + 1) * 25 : (source % 4 + 1) * 20'
    );
    rules.defineRule('skillNotes.dexteritySkillModifiers.1',
      'skillNotes.dexteritySkillModifiers', '?', null,
      '', '=', '""',
      'skillNotes.dexteritySkillModifiers.2', '=', null
    );
    rules.defineRule('skillNotes.dexteritySkillModifiers.2',
      'skillNotes.dexteritySkillModifiers', '?', null,
      classLevel, '?', 'source>=6',
      'dexterity', '=',
        '"/" + [' +
          'source>15 ? "+" + (source - 15) * 5 + "% Tightrope Walking" : "",' +
          'source>16 ? "+" + (source - 16) + "\' Pole Vaulting" : "",' +
          'source>15 ? "+" + (source - 15) + "% Tumbling Attack" : "",' +
          'source>15 ? "+" + [2,3,5,8][source - 16] + "% Tumbling Evasion" : "",' +
          'source>17 ? "+" + (source - 17) * 5 + "\' Tumbling Falling" : ""' +
        '].filter(x => x != "").join("/")'
    );
    rules.defineRule('skillNotes.raceSkillModifiers.1',
      'skillNotes.raceSkillModifiers', '?', null,
      '', '=', '""',
      'skillNotes.raceSkillModifiers.2', '=', null
    );
    rules.defineRule('skillNotes.raceSkillModifiers.2',
      'skillNotes.raceSkillModifiers', '?', null,
      classLevel, '?', 'source>=6',
    );
    rules.defineRule('skillNotes.strengthSkillModifiers',
      classLevel, '?', 'source>=6',
      'strength', '=',
        '[' +
          'source>16 ? "+" + source * .25 + "\' High Jumping" : "",' +
          'source>16 ? "+" + source * .25 + "\' Standing Broad Jumping" : "",' +
          'source>15 ? "+" + [.5,1,2][source - 16] + "\' Running Broad Jumping" : ""' +
        '].filter(x => x != "").join("/")'
    );
    for(var skill in {'Tightrope Walking':'', 'Pole Vaulting':'', 'High Jumping':'', 'Running Broad Jumping':'', 'Standing Broad Jumping':'', 'Tumbling Attack':'', 'Tumbling Evasion':'', 'Tumbling Falling':''}) {
      rules.defineRule('skills.' + skill,
        'skillNotes.dexteritySkillModifiers.1', '+',
          'source.match(/' + skill + '/) ? source.match(/([-+][\\d\\.]+). ' + skill + '/)[1] * 1 : null',
        'skillNotes.raceSkillModifiers.1', '+',
          'source.match(/' + skill + '/) ? source.match(/([-+][\\d\\.]+). ' + skill + '/)[1] * 1 : null',
        'skillNotes.strengthSkillModifiers', '+',
          'source.match(/' + skill + '/) ? source.match(/([-+][\\d\\.]+). ' + skill + '/)[1] * 1 : null'
      );
    }
    rules.defineChoice('notes',
      "skills.High Jumping:%V'",
      "skills.Pole Vaulting:%V'",
      "skills.Running Broad Jumping:%V'",
      "skills.Standing Broad Jumping:%V'",
      "skills.Tightrope Walking:%V%",
      "skills.Tumbling Attack:%V%",
      "skills.Tumbling Evasion:%V%",
      "skills.Tumbling Falling:%1%,%V'",
      "skillNotes.dexteritySkillModifiers:%V%1",
      "skillNotes.raceSkillModifiers:%V%1",
    );
  }
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the abilities passed to raceRules.
 */
UnearthedArcana1e.raceRulesExtra = function(rules, name) {

  var raceLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Level';

  // Extend thief skill racial modifiers to new sub-races
  if(name.includes('Dwarf')) {
    rules.defineRule('skillNotes.raceSkillModifiers',
      raceLevel, '=',
        '"-10% Climb Walls/+15% Find Traps/+10% Open Locks/-5% Read Languages"'
    );
    rules.defineRule('skillNotes.raceSkillModifiers.2',
      raceLevel, '=',
      '"/-5% Tightrope Walking/-2\' Pole Vaulting/-1\' High Jumping/-2\' Standing Broad Jumping/-3\' Running Broad Jumping/+10% Tumbling Attack/+5% Tumbling Evasion"'
    );
  } else if(name.includes('Half-Elf')) {
    rules.defineRule('skillNotes.raceSkillModifiers.2',
      raceLevel, '=',
      '"/+5% Tightrope Walking/+5% Tumbling Attack"'
    );
  } else if(name.includes('Elf')) {
    rules.defineRule('skillNotes.raceSkillModifiers',
      raceLevel, '=',
        '"+5% Hear Noise/+10% Hide In Shadows/+5% Move Silently/-5% Open Locks/+5% Pick Pockets"'
    );
    rules.defineRule('skillNotes.raceSkillModifiers.2',
      raceLevel, '=',
      '"/+10% Tightrope Walking/-1\' Running Broad Jumping/+5% Tumbling Evasion/+5% Tumbling Fall"'
    );
  } else if(name.includes('Gnome')) {
    rules.defineRule('skillNotes.raceSkillModifiers',
      raceLevel, '=',
        '"-15% Climb Walls/+10% Find Traps/+10% Hear Noise/+5% Hide In Shadows/+5% Move Silently/+5% Open Locks"'
    );
    rules.defineRule('skillNotes.raceSkillModifiers.2',
      raceLevel, '=',
        '"/-2\' Pole Vaulting/-1\' High Jumping/-1.5\' Standing Broad Jumping/-4\' Running Broad Jumping/+5% Tumbling Attack/+5% Tumbling Evasion"'
    );
  } else if(name.includes('Halfling')) {
    rules.defineRule('skillNotes.raceSkillModifiers.2',
      raceLevel, '=',
      '"/-2\' Pole Vaulting/-1\' High Jumping/-1.5\' Standing Broad Jumping/-4\' Running Broad Jumping/+5% Tumbling Attack/+5% Tumbling Evasion/+5% Tumbling Falling"'
    );
  } else if(name.includes('Half-Orc')) {
    rules.defineRule('skillNotes.raceSkillModifiers.2',
      raceLevel, '=', '"/+10% Tumbling Falling"'
    );
  }

  if(name == 'Dark Elf') {
    rules.defineRule('darkElfComelinessModifier',
      'race', '?', 'source == "Dark Elf"',
      'gender', '=', 'source == "Female" ? 1 : -1'
    );
    rules.defineRule('darkElfFeatures.Drowess Speed Bonus',
      'gender', '?', 'source == "Female"'
    );
    rules.defineRule('abilityNotes.raceComelinessModifier.1',
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
    rules.defineRule
      ('abilityNotes.raceComelinessModifier.1', raceLevel, '=', -1);
    if(name == 'Deep Gnome') {
      rules.defineRule('featureNotes.detectSlope', raceLevel, '+=', '80');
      rules.defineRule('featureNotes.determineDepth', raceLevel, '+=', '60');
      rules.defineRule('magicNotes.deepGnomeMagic.1',
        'features.Deep Gnome Magic', '?', null,
        raceLevel, '=', 'source<6 ? "" : ", <i>Conjure Elemental</i> (earth)"',
        'levels.Illusionist', '=', '""'
      );
    }
  } else if(name == 'Gray Dwarf') {
    rules.defineRule('featureNotes.detectSlope', raceLevel, '+=', '75');
    rules.defineRule('featureNotes.determineDepth', raceLevel, '+=', '50');
    rules.defineRule
      ('skillNotes.intelligenceLanguageBonus', raceLevel, 'v', '2');
  } else if(name == 'Gray Elf') {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier.1', raceLevel, '=', 2);
  } else if(name.includes('Half-Elf')) {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier.1', raceLevel, '=', 1);
  } else if(name.includes('Half-Orc')) {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier.1', raceLevel, '=', -3);
  } else if(name == 'High Elf' || name == 'Elf') {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier.1', raceLevel, '=', 2);
  } else if(name == 'Wild Elf') {
    rules.defineRule('skillNotes.intelligenceLanguageBonus', raceLevel, 'v', 0);
  } else if(name == 'Wood Elf') {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier.1', raceLevel, '=', 1);
    rules.defineRule('skillNotes.intelligenceLanguageBonus', raceLevel, 'v', 0);
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
