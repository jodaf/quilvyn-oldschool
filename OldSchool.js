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
 * This module loads the rules from the 1st Edition and 2nd Edition core rules.
 * The OldSchool function contains methods that load rules for particular parts
 * of the rule books; raceRules for character races, magicRules for spells,
 * etc. These member methods can be called independently in order to use a
 * subset of the OldSchool rules. Similarly, the constant fields of OldSchool
 * (LANGUAGES, RACES, etc.) can be manipulated to modify the choices. The
 * OldSchool function generates rules for the edition specified by #edition#.
 */
function OldSchool(edition) {

  if(window.OSRIC == null) {
    alert('The OldSchool module requires use of the OSRIC module');
    return;
  }

  OldSchool.EDITION =
    (edition + '').includes('1E') ? 'First Edition' :
    (edition + '').includes('2E') ? 'Second Edition' : 'First Edition';

  var rules = new QuilvynRules(OldSchool.EDITION, OldSchool.VERSION);

  rules.defineChoice('choices', OldSchool.CHOICES);
  rules.choiceEditorElements = OSRIC.choiceEditorElements;
  rules.choiceRules = OldSchool.choiceRules;
  rules.editorElements = OldSchool.initialEditorElements();
  rules.getFormats = OSRIC.getFormats;
  rules.getPlugins = OldSchool.getPlugins;
  rules.makeValid = OSRIC.makeValid;
  rules.randomizeOneAttribute = OSRIC.randomizeOneAttribute;
  rules.defineChoice('random', OldSchool.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = OldSchool.ruleNotes;

  OSRIC.createViewers(rules, OSRIC.VIEWERS);
  rules.defineChoice('extras', 'feats', 'sanityNotes', 'validationNotes');
  rules.defineChoice
    ('preset', 'race:Race,select-one,races','levels:Class Levels,bag,levels');

  OldSchool.abilityRules(rules);
  OldSchool.combatRules
    (rules, OldSchool.editedRules(OldSchool.ARMORS, 'Armor'),
     OldSchool.editedRules(OldSchool.SHIELDS, 'Shield'),
     OldSchool.editedRules(OldSchool.WEAPONS, 'Weapon'));
  OldSchool.magicRules
    (rules, OldSchool.editedRules(OldSchool.SCHOOLS, 'School'),
     OldSchool.editedRules(OldSchool.SPELLS, 'Spell'));
  OldSchool.talentRules
    (rules, OldSchool.editedRules(OldSchool.FEATURES, 'Feature'),
     OldSchool.editedRules(OldSchool.GOODIES, 'Goody'),
     OldSchool.editedRules(OldSchool.LANGUAGES, 'Language'),
     OldSchool.editedRules(OldSchool.SKILLS, 'Skill'));
  OldSchool.identityRules(
    rules, OldSchool.editedRules(OldSchool.ALIGNMENTS, 'Alignment'),
    OldSchool.editedRules(OldSchool.CLASSES, 'Class'),
    OldSchool.editedRules(OldSchool.RACES, 'Race'));

  // Add additional elements to sheet
  rules.defineSheetElement('Strength');
  rules.defineSheetElement
    ('StrengthInfo', 'Dexterity', '<b>Strength</b>: %V', '/');
  rules.defineSheetElement('Strength', 'StrengthInfo/', '%V');
  rules.defineSheetElement('Extra Strength', 'StrengthInfo/', '%V');
  rules.defineSheetElement
    ('Experience Points', 'Level', '<b>Experience</b>: %V', '; ');
  rules.defineSheetElement('SpeedInfo');
  rules.defineSheetElement('Speed', 'LoadInfo', '<b>%N</b>: %V');
  rules.defineSheetElement('StrengthTests', 'LoadInfo', '%V', '');
  var strengthMinorDie = OldSchool.EDITION == 'Second Edition' ? 20 : 6;
  rules.defineSheetElement
    ('Strength Minor Test', 'StrengthTests/',
     '<b>Strength Minor/Major Test</b>: %Vin' + strengthMinorDie);
  rules.defineSheetElement('Strength Major Test', 'StrengthTests/', '/%V%');
  rules.defineSheetElement('Maximum Henchmen', 'Alignment');
  rules.defineSheetElement('Survive System Shock', 'Save+', '<b>%N</b>: %V%');
  rules.defineSheetElement('Survive Resurrection', 'Save+', '<b>%N</b>: %V%');
  rules.defineSheetElement('EquipmentInfo', 'Combat Notes', null);
  rules.defineSheetElement('Weapon Proficiency Count', 'EquipmentInfo/');
  rules.defineSheetElement
    ('Weapon Proficiency', 'EquipmentInfo/', null, '; ');
  rules.defineSheetElement('Nonweapon Proficiency Count', 'SkillStats');
  rules.defineSheetElement
    ('Thac0Info', 'AttackInfo', '<b>THAC0 Melee/Ranged</b>: %V', '/');
  rules.defineSheetElement('Thac0Melee', 'Thac0Info/', '%V');
  rules.defineSheetElement('Thac0Ranged', 'Thac0Info/', '%V');
  rules.defineSheetElement
    ('Thac10Info', 'AttackInfo', '<b>THAC10 Melee/Ranged</b>: %V', '/');
  rules.defineSheetElement('Thac10Melee', 'Thac10Info/', '%V');
  rules.defineSheetElement('Thac10Ranged', 'Thac10Info/', '%V');
  rules.defineSheetElement('AttackInfo');
  rules.defineSheetElement('Turn Undead', 'Combat Notes', null);
  rules.defineSheetElement
    ('Understand Spell', 'Spell Slots', '<b>%N</b>: %V%');
  rules.defineSheetElement('Maximum Spells Per Level', 'Spell Slots');

  Quilvyn.addRuleSet(rules);

}

OldSchool.VERSION = '2.3.1.1';

OldSchool.EDITION = 'First Edition';
OldSchool.EDITIONS = {
  'First Edition':'',
  'Second Edition':''
};

/* List of items handled by choiceRules method. */
OldSchool.CHOICES = [
  'Alignment', 'Armor', 'Class', 'Feature', 'Language', 'Race', 'School',
  'Shield', 'Spell', 'Weapon'
];
/*
 * List of items handled by randomizeOneAttribute method. The order handles
 * dependencies among attributes when generating random characters.
 */
OldSchool.RANDOMIZABLE_ATTRIBUTES = [
  'abilities',
  'charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom',
  'extraStrength', 'name', 'race', 'gender', 'alignment', 'levels',
  'languages', 'hitPoints', 'proficiencies', 'skills', 'armor', 'shield',
  'weapons', 'spells'
];

OldSchool.ABILITIES = {
  'charisma':'',
  'constitution':'',
  'dexterity':'',
  'intelligence':'',
  'strength':'',
  'wisdom':''
};
OldSchool.ALIGNMENTS = {
  'Chaotic Evil':'',
  'Chaotic Good':'',
  'Chaotic Neutral':'',
  'Neutral Evil':'',
  'Neutral Good':'',
  'Neutral':'',
  'Lawful Evil':'',
  'Lawful Good':'',
  'Lawful Neutral':''
};
OldSchool.ARMORS = {
  'None':
    'AC=0 Move=120 Weight=0 ' +
    'Skill="+10% Climb Walls/+5% Hide In Shadows/+10% Move Silently/+5% Pick Pockets"',
  'Banded':'AC=6 Move=90 Weight=35',
  'Chain':
    'AC=5 Move=90 Weight=30 ' +
    'Skill="-25% Climb Walls/-10% Find Traps/-10% Hear Noise/-15% Hide In Shadows/-15% Move Silently/-10% Open Locks/-25% Pick Pockets"',
  'Elven Chain':
    'AC=5 Move=120 Weight=15 ' +
    'Skill="-20% Climb Walls/-5% Find Traps/-5% Hear Noise/-10% Hide In Shadows/-10% Move Silently/-5% Open Locks/-20% Pick Pockets"',
  'Leather':'AC=2 Move=120 Weight=15',
  'Padded':
    'AC=2 Move=90 Weight=10 ' +
    'Skill="-30% Climb Walls/-10% Find Traps/-10% Hear Noise/-20% Hide In Shadows/-20% Move Silently/-10% Open Locks/-30% Pick Pockets"',
  'Plate':'AC=7 Move=60 Weight=45',
  'Ring':'AC=3 Move=90 Weight=35',
  'Scale Mail':'AC=4 Move=60 Weight=40',
  'Splint':'AC=6 Move=60 Weight=40',
  'Studded Leather':
    'AC=3 Move=90 Weight=20 ' +
    'Skill="-30% Climb Walls/-10% Find Traps/-10% Hear Noise/-20% Hide In Shadows/-20% Move Silently/-10% Open Locks/-30% Pick Pockets"'
};
OldSchool.CLASSES = {
  'Assassin':
    'Require=' +
      '"alignment =~ \'Evil\'","constitution >= 6","dexterity >= 12",' +
      '"intelligence >= 11","strength >= 12" ' +
    'HitDie=d6,15,1 Attack=-1,2,4,+1@9 WeaponProficiency=3,4,2 ' +
    'Breath=16,1,4 Death=13,1,4 Petrification=12,1,4 Spell=15,2,4 Wand=14,2,4 '+
    'Features=' +
      '"1:Armor Proficiency (Leather/Studded Leather)",' +
      '"1:Shield Proficiency (All)",' +
      '1:Assassination,1:Backstab,"1:Delayed Henchmen",1:Disguise,' +
      '"1:Poison Use","3:Thief Skills","4:Limited Henchmen Classes",' +
      '"intelligence >= 15 ? 9:Bonus Languages",' +
      '"12:Read Scrolls" ' +
    'Experience=0,1.5,3,6,12,25,50,100,200,300,425,575,750,1000,1500',
  'Bard':
    'Require=' +
      '"alignment =~ \'Neutral\'","charisma >= 15","constitution >= 10",' +
      '"dexterity >= 15","intelligence >= 12","strength >= 15",' +
      '"wisdom >= 15","levels.Fighter >= 5","levels.Thief >= 5",' +
      '"race =~ \'Human|Half-Elf\'" ' +
    'HitDie=d6,10,1 Attack=0,2,3,-1@19 WeaponProficiency=2,5,4 ' +
    'Breath=16,1,3 Death=10,1,3 Petrification=13,1,3 Spell=15,1,3 Wand=14,1,3 '+
    'Features=' +
      '"1:Armor Proficiency (Leather)",' +
      '"wisdom >= 13 ? 1:Bonus Druid Spells",' +
      '"1:Charming Music","1:Defensive Song","1:Poetic Inspiration",' +
      '"1:Resist Fire","1:Resist Lightning","2:Legend Lore",' +
      '"3:Druid\'s Knowledge","3:Wilderness Movement","3:Woodland Languages",' +
      '"4:Additional Languages","7:Immunity To Fey Charm",7:Shapeshift ' +
    'Experience=' +
      '0,2,4,8,16,25,40,60,85,110,150,200,400,600,800,1000,1200,1400,1600,' +
      '1800,2000,2200,3000 ' +
    'CasterLevelDivine=levels.Bard ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'D1:1=1;2=2;3=3;16=4;19=5,' +
      'D2:4=1;5=2;6=3;17=4;21=5,' +
      'D3:7=1;8=2;9=3;18=4;22=5,' +
      'D4:10=1;11=2;12=3;19=4;23=5,' +
      'D5:13=1;14=2;15=3;20=4;23=5',
  'Cleric':
    'Require=' +
      '"wisdom >= 9" ' +
    'HitDie=d8,9,2 Attack=0,2,3,-1@19 WeaponProficiency=2,4,3 ' +
    'Breath=16,1,3 Death=10,1,3 Petrification=13,1,3 Spell=15,1,3 Wand=14,1,3 '+
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"1:Turn Undead",' +
      '"wisdom >= 16 ? 1:Bonus Cleric Experience",' +
      '"wisdom >= 13 ? 1:Bonus Cleric Spells",' +
      '"wisdom <= 12 ? 1:Cleric Spell Failure" ' +
    'Experience=' +
      '0,1.5,3,6,13,27.5,55,110,225,450,675,900,1125,1350,1575,1800,2025,' +
      '2250,2475,2700,2925,3150,3375,3600,3825,4050,4275,4500,4725 ' +
    'CasterLevelDivine=levels.Cleric ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'C1:1=1;2=2;4=3;9=4;11=5;12=6;15=7;17=8;19=9,' +
      'C2:3=1;4=2;5=3;9=4;12=5;13=6;15=7;17=8;19=9,' +
      'C3:5=1;6=2;8=3;11=4;12=5;13=6;15=7;17=8;19=9,' +
      'C4:7=1;8=2;10=3;13=4;14=5;16=6;18=7;20=8;21=9,' +
      'C5:9=1;10=2;14=3;15=4;16=5;18=6;20=7;21=8;22=9,' +
      'C6:11=1;12=2;16=3;18=4;20=5;21=6;23=7;24=8;26=9,' +
      'C7:16=1;19=2;22=3;25=4;27=5;28=6;29=7',
  'Druid':
    'Require=' +
      '"alignment =~ \'Neutral\'","charisma >= 15","wisdom >= 12" ' +
    'HitDie=d8,14,1 Attack=0,2,3,- WeaponProficiency=2,5,4 ' +
    'Breath=16,1,3 Death=10,1,3 Petrification=13,1,3 Spell=15,1,3 Wand=14,1,3 '+
    'Features=' +
      '"1:Armor Proficiency (Leather)","1:Shield Proficiency (All)",' +
      '"charisma >= 16/wisdom >= 16 ? 1:Bonus Druid Experience",' +
      '"wisdom >= 13 ? 1:Bonus Druid Spells",' +
      '"1:Resist Fire","1:Resist Lightning","3:Druid\'s Knowledge",' +
      '"3:Wilderness Movement","3:Woodland Languages",' +
      '"7:Immunity To Fey Charm",7:Shapeshift ' +
    'Experience=0,2,4,7.5,12.5,20,35,60,90,125,200,300,750,1500 ' +
    'CasterLevelDivine=levels.Druid ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'D1:1=2;3=3;4=4;9=5;13=6,' +
      'D2:2=1;3=2;5=3;7=4;11=5;14=6,' +
      'D3:3=1;4=2;7=3;12=4;13=5;14=6,' +
      'D4:6=1;8=2;10=3;12=4;13=5;14=6,' +
      'D5:9=1;10=2;12=3;13=4;14=5,' +
      'D6:11=1;12=2;13=3;14=4,' +
      'D7:12=1;13=2;14=3',
  'Fighter':
    'Require="constitution >= 7","strength >= 9" ' +
    'HitDie=d10,9,3 Attack=0,2,2,-2@19 WeaponProficiency=4,3,2 ' +
    'Breath=17,1.5,2 Death=14,1.5,2 Petrification=15,1.5,2 Spell=17,1.5,2 Wand=16,1.5,2 ' +
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"strength >= 16 ? 1:Bonus Fighter Experience",' +
      '"1:Fighting The Unskilled" ' +
    'Experience=' +
      '0,2,4,8,18,25,70,125,250,500,750,1000,1250,1500,1750,2000,2250,2500,' +
      '2750,3000,3250,3500,3750,4000,4250,4500,4750,5000,5250',
  'Illusionist':
    'Require="dexterity >= 16","intelligence >= 15" ' +
    'HitDie=d4,10,1 Attack=-1,3,5,-1@6 WeaponProficiency=1,6,5 ' +
    'Breath=15,2,5 Death=14,1.5,5 Petrification=13,2,5 Spell=12,2,5 Wand=11,2,5 '+
    'Features=' +
      '"10:Eldritch Craft" ' +
    'CasterLevelArcane=levels.Illusionist ' +
    'Experience=' +
      '0,2.25,4.5,9,18,35,60,95,145,220,440,660,880,1100,1320,1540,1760,1980,' +
      '2200,2420,2640,2860,3080,3300,3520,3740,3960,4180,4400 ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'I1:1=1;2=2;4=3;5=4;9=5;24=6;26=7,' +
      'I2:3=1;4=2;6=3;10=4;12=5;24=6;26=7,' +
      'I3:5=1;7=2;9=3;12=4;16=5;24=6;26=7,' +
      'I4:8=1;9=2;11=3;15=4;17=5;24=6;26=7,' +
      'I5:10=1;11=2;16=3;19=4;21=5;25=6,' +
      'I6:12=1;13=2;18=3;21=4;22=5;25=6,' +
      'I7:14=1;15=2;20=3;22=4;23=5;25=6',
  'Magic User':
    'Require="dexterity >= 6","intelligence >= 9" ' +
    'HitDie=d4,11,1 Attack=-1,3,5,-1@6 WeaponProficiency=1,6,5 ' +
    'Breath=15,2,5 Death=14,1.5,5 Petrification=13,2,5 Spell=12,2,5 ' +
    'Wand=11,2,5 '+
    'Features=' +
      '"intelligence >= 16 ? 1:Bonus Magic User Experience",' +
      '"7:Eldritch Craft" ' +
    'Experience=' +
      '0,2.5,5,10,22.5,40,60,90,135,250,375,750,1125,1500,1875,2250,2625,' +
      '3000,3375,3750,4125,4500,4875,4250,4625,5000,5375,5750,6125 ' +
    'CasterLevelArcane="levels.Magic User" ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'M1:1=1;2=2;4=3;5=4;13=5;26=6;29=7,' +
      'M2:3=1;4=2;7=3;10=4;13=5;26=6;29=7,' +
      'M3:5=1;6=2;8=3;11=4;13=5;26=6;29=7,' +
      'M4:7=1;8=2;11=3;12=4;15=5;26=6;29=7,' +
      'M5:9=1;10=2;11=3;12=4;15=5;27=6,' +
      'M6:12=1;13=2;16=3;20=4;22=5;27=6,' +
      'M7:14=1;16=2;17=3;21=4;23=5;27=6,' +
      'M8:16=1;17=2;19=3;21=4;23=5;28=6,' +
      'M9:18=1;20=2;22=3;24=4;25=5;28=6',
  'Monk':
    'Require=' +
      '"alignment =~ \'Lawful\'","constitution >= 11","dexterity >= 15",' +
      '"strength >= 15","wisdom >= 15" ' +
    'HitDie=2d4,18,1 Attack=0,2,3,- WeaponProficiency=1,2,3 ' +
    'Breath=16,1,4 Death=13,1,4 Petrification=12,1,4 Spell=15,2,4 Wand=14,2,4 '+
    'Features=' +
      '"1:Delayed Henchmen","1:Dodge Missiles",1:Evasion,"1:Killing Blow",' +
      '"1:Monk Skills","1:Precise Blow",1:Spiritual,"1:Stunning Blow",' +
      '1:Unburdened,2:Aware,"3:Speak With Animals","4:Flurry Of Blows",' +
      '"4:Masked Mind","4:Slow Fall","5:Controlled Movement",' +
      '"5:Purity Of Body","6:Feign Death","6:Limited Henchmen Classes",' +
      '"7:Wholeness Of Body","8:Speak With Plants","9:Improved Evasion",' +
      '"9:Resist Influence","10:Mental Discipline","11:Diamond Body",' +
      '"12:Free Will","13:Quivering Palm" ' +
    'Experience=' +
      '0,2.25,4.75,10,22.5,47.5,98,200,350,500,700,950,1250,1750,2250,2750,' +
      '3250',
  'Paladin':
    'Require=' +
      '"alignment == \'Lawful Good\'","charisma >= 17","constitution >= 9",' +
      '"intelligence >= 9","strength >= 12","wisdom >= 13" ' +
    'HitDie=d10,9,3 Attack=0,2,2,-2@19 WeaponProficiency=3,3,2 ' +
    'Breath=17,1.5,2 Death=14,1.5,2 Petrification=15,1.5,2 Spell=17,1.5,2 ' +
    'Wand=16,1.5,2 ' +
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"strength >= 16/wisdom >= 16 ? 1:Bonus Paladin Experience",' +
      '"1:Cure Disease","1:Detect Evil",1:Discriminating,"1:Divine Health",' +
      '"1:Divine Protection","1:Fighting The Unskilled","1:Lay On Hands",' +
      '1:Non-Materialist,1:Philanthropist,"1:Protection From Evil",' +
      '"3:Turn Undead","4:Summon Warhorse" ' +
    'Experience=' +
      '0,2.75,5.5,12,24,45,95,175,350,700,1050,1400,1750,2100,2450,2800,3150,' +
      '3500,3850,4200,4550,4900,5250,5600,5950,6300,6650,7000,7350 ' +
    'CasterLevelDivine="levels.Paladin >= 9 ? levels.Paladin - 8 : null" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'C1:9=1;10=2;14=3;21=4,' +
      'C2:11=1;12=2;16=3;22=4,' +
      'C3:13=1;17=2;18=3;23=4,' +
      'C4:15=1;19=2;20=3;24=4',
  'Ranger':
    'Require=' +
      '"alignment =~ \'Good\'","constitution >= 14","dexterity >= 6",' +
      '"intelligence >= 13","strength >= 13","wisdom >= 14" ' +
    'HitDie=2d8,10,2 Attack=0,2,2,-2@19 WeaponProficiency=3,3,2 ' +
    'Breath=17,1.5,2 Death=14,1.5,2 Petrification=15,1.5,2 Spell=17,1.5,2 ' +
    'Wand=16,1.5,2 ' +
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"strength >= 16/intelligence >= 16/wisdom >= 16 ? 1:Bonus Ranger Experience",' +
      '"1:Alert Against Surprise","1:Delayed Henchmen","1:Favored Enemy",' +
      '"1:Fighting The Unskilled",1:Loner,1:Selective,1:Tracking,' +
      '"1:Travel Light","10:Scrying Device Use" ' +
    'Experience=' +
      '0,2.25,4.5,10,20,40,90,150,225,325,650,975,1300,1625,2000,2325,2650,' +
      '2975,3300,3625,3950,4275,4600,4925,5250,5575,5900,6225,6550 ' +
    'CasterLevelArcane=' +
      '"levels.Ranger >= 8 ? Math.floor((levels.Ranger - 6) / 2) : null" ' +
    'CasterLevelDivine=' +
      '"levels.Ranger >= 9 ? Math.floor((levels.Ranger - 6) / 2) : null" ' +
      'SpellAbility=wisdom ' +
      'SpellSlots=' +
        'D1:8=1;10=2,' +
        'D2:12=1;14=2,' +
        'D3:16=1;17=2,' +
        'M1:9=1;11=2,' +
        'M2:12=1;14=2',
  'Thief':
    'Require=' +
      '"alignment =~ \'Neutral|Evil\'","dexterity >= 9" ' +
    'HitDie=d6,10,2 Attack=-1,2,4,+1@9 WeaponProficiency=2,4,3 ' +
    'Breath=16,1,4 Death=13,1,4 Petrification=12,1,4 Spell=15,2,4 Wand=14,2,4 '+
    'Features=' +
      '"1:Armor Proficiency (Leather/Studded Leather)",' +
      '"dexterity >= 16 ? 1:Bonus Thief Experience",' +
      '1:Backstab,"1:Thief Skills","10:Read Scrolls" ' +
    'Experience=' +
      '0,1.25,2.5,5,10,20,42.5,70,110,160,220,440,660,880,1100,1320,1540,' +
      '1760,1980,2200,2420,2640,2860,3080,3300,3520,3740,3960,4180'
};
OldSchool.FEATURES_ADDED = {

  // Class
  'Additional Languages':'Section=skill Note="+%V Language Count"',
  'Assassination':
    'Section=combat Note="Base %V% chance that strike kills surprised target"',
  'Aware':'Section=combat Note="Surprised %V%"',
  'Charming Music':
    'Section=magic ' +
    'Note="R40\' %V% charm creatures while playing (Save 1 rd), make suggestion to charmed (Save -2 neg)"',
  'Controlled Movement':
    'Section=save Note="Immune <i>Haste</i> and <i>Slow</i>"',
  'Defensive Song':
    'Section=magic Note="Counteract song attacks, soothe shriekers"',
  'Diamond Body':'Section=save Note="Immune to poison"',
  'Divine Protection':'Section=save Note="+2 all saves"',
  'Dodge Missiles':
    'Section=combat Note="Petrification save to dodge non-magical missiles"',
  'Evasion':
    'Section=save Note="Successful save yields no damage instead of half"',
  'Favored Enemy':'Section=combat Note="+%V melee damage vs. giant-class foes"',
  'Feign Death':'Section=feature Note="Appear dead for %V tn"',
  'Flurry Of Blows':'Section=combat Note="%V unarmed attacks/rd"',
  'Free Will':'Section=save Note="Immune <i>Geas</i> and <i>Quest</i> spells"',
  'Improved Evasion':'Section=save Note="Failed save yields half damage"',
  'Killing Blow':
    'Section=combat Note="%V+foe AC% kill w/Stunning Blow"',
  'Legend Lore':
    'Section=skill Note="%V% info about legendary item, person, place"',
  'Masked Mind':'Section=save Note="%V% resistance to ESP"',
  'Mental Discipline':
    'Section=save Note="Resist telepathy and mind blast as int 18"',
  'Monk Skills':
    'Section=skill ' +
    'Note="Climb Walls, Find Traps, Hear Noise, Hide In Shadows, Move Silently, Open Locks"',
  'Poetic Inspiration':
    'Section=magic ' +
    'Note="Performance gives allies +1 attack and +10% morale for 1 tn after 2 rd"',
  'Precise Blow':'Section=combat Note="+%V HP weapon damage"',
  'Purity Of Body':'Section=save Note="Immune to disease"',
  'Quivering Palm':
    'Section=combat ' +
    'Note="Touched w/at most %1 HD and %2 HP dies w/in %V dy 1/wk"',
  'Read Scrolls':
    'Section=magic Note="%V% cast arcane or druidic spell from scroll"',
  'Resist Influence':
    'Section=save ' +
    'Note="%V% resistance to beguiling, charm, hypnosis and suggestion spells"',
  'Slow Fall':'Section=save Note="No damage from fall of %1 w/in %2\' of wall"',
  'Speak With Animals':'Section=magic Note="<i>Speak With Animals</i> at will"',
  'Speak With Plants':'Section=magic Note="<i>Speak With Plants</i> at will"',
  'Spiritual':
    'Section=feature ' +
    'Note="Must donate 100% after expenses to religious institution"',
  'Stunning Blow':
     'Section=combat ' +
    'Note="Foe stunned for 1d6 rd when unarmed attack succeeds by at least 5"',
  'Unburdened':'Section=feature Note="Own at most 5 magic items"',
  'Wholeness Of Body':'Section=magic Note="Heal 1d4+%V damage to self 1/dy"',
  'Woodland Languages':'Section=skill Note="+%V Language Count"'

};
OldSchool.FEATURES =
  Object.assign({}, OSRIC.FEATURES, OldSchool.FEATURES_ADDED);
OldSchool.GOODIES = {
  'Armor':
    'Pattern="([-+]\\d).*(?:armor(?:\\s+class)?|AC)|(?:armor(?:\\s+class)?|AC)\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="-$1 || -$2" ' +
    'Attribute=armorClass ' +
    'Section=combat Note="%V Armor Class"',
  'Breath':
    'Pattern="([-+]\\d)\\s+breath\\s+save|breath\\s+save\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="-$1 || -$2" ' +
    'Attribute=save.Breath ' +
    'Section=save Note="%V Breath"',
  'Charisma':
    'Pattern="([-+]\\d)\\s+cha(?:risma)?|cha(?:risma)?\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=charisma ' +
    'Section=ability Note="%V Charisma"',
  'Constitution':
    'Pattern="([-+]\\d)\\s+con(?:stitution)?|con(?:stitution)?\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=constitution ' +
    'Section=ability Note="%V Constitution"',
  'Death':
    'Pattern="([-+]\\d)\\s+death\\s+save|death\\s+save\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="-$1 || -$2" ' +
    'Attribute=save.Death ' +
    'Section=save Note="%V Death"',
  'Dexterity':
    'Pattern="([-+]\\d)\\s+dex(?:terity)?|dex(?:terity)?\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=dexterity ' +
    'Section=ability Note="%V Dexterity"',
  'Intelligence':
    'Pattern="([-+]\\d)\\s+int(?:elligence)?|int(?:elligence)?\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=intelligence ' +
    'Section=ability Note="%V Intelligence"',
  'Petrification':
    'Pattern="([-+]\\d)\\s+petrification\\s+save|petrification\\s+save\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="-$1 || -$2" ' +
    'Attribute=save.Petrification ' +
    'Section=save Note="%V Petrification"',
  'Protection':
    'Pattern="([-+]\\d).*protection|protection\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="-$1 || -$2" ' +
    'Attribute=armorClass ' +
    'Section=combat Note="%V Armor Class"',
  'Shield':
    'Pattern="([-+]\\d).*\\s+shield|shield\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="-$1 || -$2" ' +
    'Attribute=armorClass ' +
    'Section=combat Note="%V Armor Class"',
  'Speed':
    'Pattern="([-+]\\d+).*\\s+speed|speed\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=speed ' +
    'Section=ability Note="%V Speed"',
  'Spell':
    'Pattern="([-+]\\d)\\s+spell\\s+save|spell\\s+save\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="-$1 || -$2" ' +
    'Attribute=save.Spell ' +
    'Section=save Note="%V Spell"',
  'Strength':
    'Pattern="([-+]\\d)\\s+str(?:ength)?|str(?:ength)?\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=strength ' +
    'Section=ability Note="%V Strength"',
  'Wand':
    'Pattern="([-+]\\d)\\s+wand\\s+save|wand\\s+save\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="-$1 || -$2" ' +
    'Attribute=save.Wand ' +
    'Section=save Note="%V Wand"',
  'Wisdom':
    'Pattern="([-+]\\d)\\s+wis(?:dom)?|wis(?:dom)?\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=wisdom ' +
    'Section=ability Note="%V Wisdom"'
};
OldSchool.LANGUAGES = {
  'Common':'',
  'Dwarf':'',
  'Elf':'',
  'Gnoll':'',
  'Gnome':'',
  'Goblin':'',
  'Halfling':'',
  'Hobgoblin':'',
  'Kobold':'',
  'Orc':''
};
OldSchool.RACES = {
  'Dwarf':
    'Require=' +
      '"charisma <= 16","constitution >= 12","dexterity <= 17",' +
      '"strength >= 8" ' +
    'Features=' +
      '"1:Detect Construction","1:Detect Sliding","1:Detect Slope",' +
      '"1:Detect Traps","1:Determine Depth","1:Dwarf Ability Adjustment",' +
      '"1:Dwarf Dodge","1:Dwarf Enmity",1:Infravision,"1:Resist Magic",' +
      '"1:Resist Poison" ' +
    'Languages=' +
      'Common,Dwarf,Gnome,Goblin,Kobold,Orc',
  'Elf':
    'Require=' +
      '"charisma >= 8","constitution >= 6","dexterity >= 7",' +
      '"intelligence >= 8" ' +
    'Features=' +
      '"1:Bow Precision","1:Detect Secret Doors","1:Elf Ability Adjustment",' +
      '1:Infravision,"1:Resist Charm","1:Resist Sleep",1:Stealthy,' +
      '"1:Sword Precision" ' +
    'Languages=' +
      'Common,Elf,Gnoll,Gnome,Goblin,Halfling,Hobgoblin,Orc',
  'Gnome':
    'Require=' +
      '"constitution >= 8","intelligence >= 7","strength >= 6" ' +
    'Features=' +
      '"1:Burrow Tongue","1:Detect Hazard","1:Detect Slope",' +
      '"1:Determine Depth","1:Determine Direction","1:Gnome Dodge",' +
      '"1:Gnome Enmity",1:Infravision,"1:Resist Magic" ' +
    'Languages=' +
      'Common,Dwarf,Gnome,Goblin,Halfling,Kobold',
  'Half-Elf':
    'Require=' +
      '"constitution >= 6","dexterity >= 6","intelligence >= 4" ' +
    'Features=' +
      '"1:Detect Secret Doors",1:Infravision,"1:Resist Charm",' +
      '"1:Resist Sleep" ' +
    'Languages=' +
      'Common,Elf,Gnoll,Gnome,Goblin,Halfling,Hobgoblin,Orc',
  'Half-Orc':
    'Require=' +
      '"charisma <= 12","constitution >= 13","dexterity <= 17",' +
      '"intelligence <= 17","strength >= 6","wisdom <= 14" ' +
    'Features=' +
      '"1:Half-Orc Ability Adjustment",1:Infravision ' +
    'Languages=' +
      'Common,Orc',
  'Halfling':
    'Require=' +
      '"constitution >= 10","dexterity >= 8","intelligence >= 6",' +
      '"strength >= 6","wisdom <= 17" ' +
    'Features=' +
      '"1:Detect Slope","1:Determine Direction",' +
      '"1:Halfling Ability Adjustment",1:Infravision,"1:Resist Magic",' +
      '"1:Resist Poison",1:Stealthy ' +
    'Languages=' +
      'Common,Dwarf,Elf,Gnome,Goblin,Halfling,Orc',
  'Human':
    'Languages=' +
      'Common'
};
OldSchool.SCHOOLS = {
  'Abjuration':'',
  'Alteration':'',
  'Conjuration':'',
  'Divination':'',
  'Enchantment':'',
  'Evocation':'',
  'Illusion':'',
  'Necromancy':'',
  'Possession':''
};
OldSchool.SHIELDS = {
  'None':'AC=0 Weight=0',
  'Large Shield':'AC=1 Weight=10',
  'Medium Shield':'AC=1 Weight=8',
  'Small Shield':'AC=1 Weight=5'
};
OldSchool.SKILLS = {
  'Climb Walls':'Class=Assassin,Monk,Thief',
  'Find Traps':'Class=Assassin,Monk,Thief',
  'Hear Noise':'Class=Assassin,Monk,Thief',
  'Hide In Shadows':'Class=Assassin,Monk,Thief',
  'Move Silently':'Class=Assassin,Monk,Thief',
  'Open Locks':'Class=Assassin,Monk,Thief',
  'Pick Pockets':'Class=Assassin,Thief',
  'Read Languages':'Class=Assassin,Thief'
};
/*
 * Differences between OSRIC and 1E spell descriptions. These could go into
 * RULE_EDITS, but, since 2E descriptions generally match 1E's pretty closely,
 * that would require duplicating these changes for 1E and 2E.
 */
OldSchool.SPELLS_CHANGES = {
  'Animal Summoning II':
    'Range="$L60\'"',
  'Animal Summoning III':
    'Description="R$R Draws 4 16 HD, 8 8 HD, or 16 4 HD animals to assist" ' +
    'Range="$L80\'"',
  'Blade Barrier':
    'Description="R$R 5\' - 60\' sq blade wall inflicts $E for $D"',
  'Call Woodland Beings':
    'Range="$L10plus120\'"',
  'Chaos':
    'Description="R$R Creatures in $E 10% wander away/50% stand confused/20% attack nearest creature/20% attack self or allies for $D (Save by illusionists and fighters neg 1 rd)"',
  'Confusion':
    'Description="R$R $E 10% wander away/50% stand confused/20% attack nearest creature/20% attack self or allies for $D (Save neg 1 rd)"',
  'Create Food And Water':
    'Effect="$L3 persons"',
  'Death Spell':
    'School=Conjuration',
  'Dispel Magic C3':
    'School=Abjuration',
  'Feeblemind':
    'Description="R$R Reduces target Intelligence to 2 (Save Cleric +1, Druid -1, MU -4, Illusionist -5, non-human -2 neg)"',
  'Feeblemind D6':
    'Range="160\'"',
  'Flame Arrow':
    'School=Conjuration',
  'Guards And Wards':
    'School=Evocation ' +
    'Duration="$L hr" ' +
    'Effect="$L10plus20\' radius"',
  'Heat Metal':
    'School=Alteration',
  'Hypnotic Pattern':
    'Effect="30\' sq totaling 24 HD"',
  'Know Alignment':
    'Effect="10 targets in 10\' radius"',
  'Mass Invisibility':
    'Effect="30\' sq"',
  'Mass Suggestion':
    'Range="30\'"',
  'Passwall':
    'Effect="5\'x8\'x10\'"',
  'Permanent Illusion':
    'Range="$L10\'"',
  'Phase Door':
    'Duration="$Ldiv2 times"',
  'Plane Shift':
    'Effect="Touched plus 6 touching"',
  'Produce Fire':
    'Effect="120\' sq"',
  'Slow Poison':
    'Duration="$L hr"',
  'Sticks To Snakes D5':
    'Effect="$L sticks in 10\' cu"',
  'Stinking Cloud':
    'Effect="20\' cu"',
  'Strength':
    'Description="Touched gains +1d4 (HD d4), +1d6 (HD d8), or +1d8 (HD d10) Strength for $L hr"',
  'Wall Of Fire M4':
    'Description="$R inflicts $E to passers, 2d6 HP to creatures w/in 10\', and 1d6 to creatures w/in 20\' for $D" ' +
    'Range="R60\' $L20\' sq wall or $Ldiv4plus10\' radius circle"',
  'Wall Of Force':
    'Duration="$Lplus10 rd"',
  'Water Breathing':
    'Duration="$L3 tn"'
};
/*
 * Mapping of OSRIC spell names to 1E/2E--mostly Americanized spellings and
 * adding TM wizard names.
 */
OldSchool.SPELLS_RENAMES = {
  'Audible Glamour':'Audible Glamer',
  'Audible Glamour M2':'Audible Glamer M2',
  'Chariot Of Fire':'Chariot Of Sustarre',
  'Clenched Fist':"Bigby's Clenched Fist",
  'Colour Spray':'Color Spray',
  'Crushing Hand':"Bigby's Crushing Hand",
  'Detect Pits And Snares':'Detect Snares And Pits',
  'False Trap':"Leomund's Trap",
  'Floating Disk':"Tenser's Floating Disc",
  'Freezing Sphere':"Otiluke's Freezing Sphere",
  "Fool's Gold":'Fools Gold',
  'Forceful Hand':"Bigby's Forceful Hand",
  'Glass-steel':'Glassteel',
  'Glasseye':'Glassee',
  'Grasping Hand':"Bigby's Grasping Hand",
  'Illusory Script':'Illusionary Script',
  'Instant Summons':"Drawmij's Instant Summons",
  'Interposing Hand':"Bigby's Interposing Hand",
  'Irresistible Dance':"Otto's Irresistible Dance",
  "Mage's Faithful Hound":"Mordenkainen's Faithful Hound",
  "Mage's Sword":"Mordenkainen's Sword",
  'Magic Aura':"Nystul's Magic Aura",
  'Mnemonic Enhancer':"Rary's Mnemonic Enhancer",
  'Paralysation':'Paralyzation',
  'Polymorph Object':'Polymorph Any Object',
  'Secret Chest':"Leomund's Secret Chest",
  'Spell Immunity':"Serten's Spell Immunity",
  'Spirit-Rack':'Spiritwrack',
  'Spiritual Weapon':'Spiritual Hammer',
  'Tiny Hut':"Leomund's Tiny Hut",
  'Transformation':"Tenser's Transformation"
};
OldSchool.SPELLS = Object.assign({}, OSRIC.SPELLS);
for(var s in OSRIC.SPELLS) {
  if(s in OldSchool.SPELLS_CHANGES)
    OldSchool.SPELLS[s] += ' ' + OldSchool.SPELLS_CHANGES[s];
  if(s in OldSchool.SPELLS_RENAMES) {
    OldSchool.SPELLS[OldSchool.SPELLS_RENAMES[s]] = OldSchool.SPELLS[s];
    delete OldSchool.SPELLS[s];
  }
}
OldSchool.WEAPONS = {
  'Awl Pike':'Category=2h Damage=d6',
  'Bardiche':'Category=2h Damage=2d4',
  'Bastard Sword':'Category=2h Damage=2d4',
  'Battle Axe':'Category=1h Damage=d8',
  'Bec De Corbin':'Category=2h Damage=d8',
  'Bill-Guisarme':'Category=2h Damage=2d4',
  'Bo Stick':'Category=2h Damage=d6',
  'Broad Sword':'Category=1h Damage=2d4', // Best guess on category
  'Club':'Category=1h Damage=d6 Range=10',
  'Composite Long Bow':'Category=R Damage=d6 Range=60',
  'Composite Short Bow':'Category=R Damage=d6 Range=50',
  'Dagger':'Category=Li Damage=d4 Range=10',
  'Dart':'Category=R Damage=d3 Range=15',
  'Fauchard':'Category=2h Damage=d6',
  'Fauchard-Fork':'Category=2h Damage=d8',
  "Footman's Flail":'Category=2h Damage=d6+1',
  "Footman's Mace":'Category=1h Damage=d6+1',
  "Footman's Military Pick":'Category=1h Damage=d6+1',
  'Glaive':'Category=2h Damage=d6',
  'Glaive-Guisarme':'Category=2h Damage=2d4',
  'Guisarme':'Category=2h Damage=2d4',
  'Guisarme-Voulge':'Category=2h Damage=2d4',
  'Halberd':'Category=2h Damage=d10',
  'Hammer':'Category=Li Damage=d4+1 Range=10',
  'Hand Axe':'Category=Li Damage=d6 Range=10',
  'Heavy Crossbow':'Category=R Damage=d4+1 Range=80',
  'Heavy Horse Lance':'Category=1h Damage=2d4+1',
  "Horseman's Flail":'Category=1h Damage=d4+1',
  "Horseman's Mace":'Category=Li Damage=d6',
  "Horseman's Military Pick":'Category=Li Damage=d4+1',
  'Javelin':'Category=R Damage=d6 Range=20',
  'Jo Stick':'Category=2h Damage=d6',
  'Light Crossbow':'Category=R Damage=d4 Range=60',
  'Light Horse Lance':'Category=1h Damage=d6',
  'Long Bow':'Category=R Damage=d6 Range=70',
  'Long Sword':'Category=1h Damage=d8',
  'Lucern Hammer':'Category=2h Damage=2d4',
  'Medium Horse Lance':'Category=1h Damage=d6+1',
  'Military Fork':'Category=2h Damage=d8',
  'Morning Star':'Category=1h Damage=2d4',
  'Partisan':'Category=2h Damage=d6',
  'Pike':'Category=2h Damage=d6',
  'Quarter Staff':'Category=2h Damage=d6',
  'Ranseur':'Category=2h Damage=2d4',
  'Scimitar':'Category=1h Damage=d8',
  'Short Bow':'Category=R Damage=d6 Range=50',
  'Short Sword':'Category=Li Damage=d6',
  'Sling':'Category=R Damage=d4+1 Range=50',
  'Spear':'Category=2h Damage=d6 Range=10',
  'Spetum':'Category=2h Damage=d6+1',
  'Trident':'Category=1h Damage=d6+1',
  'Two-Handed Sword':'Category=2h Damage=d10',
  'Unarmed':'Category=Un Damage=d2',
  'Voulge':'Category=2h Damage=2d4'
};

/*
 * Changes from 1st Edition to 2nd Edition--see editedRules.
 */
OldSchool.RULE_EDITS = {
  'First Edition':{},
  'Second Edition':{
    'Armor':{
      // Modified
      'Chain':'Weight=40',
      'Plate':'Weight=50',
      'Ring':'Weight=30',
      'Studded Leather':'Weight=20',
      // New
      'Brigandine':'AC=4 Move=120 Weight=35',
      'Bronze Plate':'AC=6 Move=120 Weight=45',
      'Field Plate':'AC=8 Move=120 Weight=60',
      'Full Plate':'AC=9 Move=120 Weight=70',
      'Hide':'AC=4 Move=120 Weight=30 Weight=15'
    },
    'Class':{
      // Removed
      'Assassin':null,
      'Monk':null,
      // Modified
      'Bard':
        'Require=' +
          '"alignment =~ \'Neutral\'","charisma >= 15","dexterity >= 12",' +
          '"intelligence >= 13" ' +
        'HitDie=d6,10,2 Attack=0,1,2,- ' +
        'Breath=16,1,4 Death=13,1,4 Petrification=12,1,4 Spell=15,2,4 Wand=14,2,4 '+
        'NonweaponProficiency=3,4 ' +
        'Features=' +
          '"1:Armor Proficiency (Leather/Padded/Studded Leather/Scale Mail/Hide/Chain)",' +
          '"1:Charming Music","1:Defensive Song","1:Legend Lore",' +
          '"1:Poetic Inspiration","1:Bard Skills","10:Read Scrolls" ' +
        'Experience=' +
          '0,1.25,2.5,5,10,20,42.5,70,110,160,220,440,660,880,1100,1320,1540,' +
          '1760,1980,2200 ' +
        'CasterLevelArcane=levels.Bard ' +
        'CasterLevelDivine=levels.Bard ? null : null ' +
        'SpellAbility=intelligence ' +
        'SpellSlots=' +
          'W1:2=1;3=2;5=3;16=4,' +
          'W2:4=1;6=2;8=3;17=4,' +
          'W3:7=1;9=2;11=3;18=4,' +
          'W4:10=1;12=2;14=3;19=4,' +
          'W5:13=1;15=2;17=3;20=4,' +
          'W6:16=1;18=2;20=3',
      'Cleric':
        'Attack=0,2,3,- NonweaponProficiency=4,3 ' +
        'Experience=' +
          '0,1.5,3,6,13,27.5,55,110,225,450,675,900,1125,1350,1575,1800,2025,' +
          '2250,2475,2700 ' +
        'SpellSlots=' +
          'P1:1=1;2=2;4=3;9=4;11=5;12=6;16=7;18=8;19=9,' +
          'P2:3=1;4=2;5=3;9=4;12=5;13=6;16=7;18=8;19=9,' +
          'P3:5=1;6=2;8=3;11=4;12=5;13=6;16=7;18=8;20=9,' +
          'P4:7=1;8=2;10=3;13=4;14=5;15=6;17=7;18=8,' +
          'P5:9=1;10=2;14=3;15=4;17=5;18=6;20=7,' +
          'P6:11=1;12=2;16=3;18=4;20=5,' +
          'P7:14=1;17=2',
      'Druid':
        'Require=' +
          '"race =~ \'Human|Half-Elf\'","charisma >= 15","wisdom >= 12" ' +
        'HitDie=d8,9,2 Attack=0,2,3,- NonweaponProficiency=4,3 ' +
        'Features=' +
          '"1:Armor Proficiency (Leather)","1:Shield Proficiency (All)",' +
          '"wisdom >= 13 ? 1:Bonus Druid Spells",' +
          '"1:Resist Fire","1:Resist Lightning","3:Druid\'s Knowledge",' +
          '"3:Wilderness Movement","3:Woodland Languages",' +
          '"7:Immunity To Fey Charm",7:Shapeshift,' +
          // Hierophant
          '16:Ageless,"16:Fluid Appearance","16:Poison Immunity",' +
          '"17:Hibernation","17:Planar Travel (Earth)",' +
          '"18:Planar Travel (Fire)","19:Planar Travel (Water)",' +
          '"20:Planar Travel (Air)" ' +
        'Experience=' +
          '0,1.5,3,6,13,27.5,55,110,225,450,675,900,1125,1350,1575,1800,2025,' +
          '2250,2475,2700 ' +
        'SpellSlots=' +
          'P1:1=1;2=2;4=3;9=4;11=5;12=6;16=7;18=8;19=9,' +
          'P2:3=1;4=2;5=3;9=4;12=5;13=6;16=7;18=8;19=9,' +
          'P3:5=1;6=2;8=3;11=4;12=5;13=6;16=7;18=8;20=9,' +
          'P4:7=1;8=2;10=3;13=4;14=5;15=6;17=7;18=8,' +
          'P5:9=1;10=2;14=3;15=4;17=5;18=6;20=7,' +
          'P6:11=1;12=2;16=3;18=4;20=5,' +
          'P7:14=1;17=2',
      'Fighter':
        'Require="strength >= 9" ' +
        'Attack=0,1,1,- NonweaponProficiency=3,3 ' +
        'Features-="1:Fighting The Unskilled" ' +
        'Features=' +
          '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
          '"strength >= 16 ? 1:Bonus Fighter Experience" ' +
        'Experience=' +
          '0,2,4,8,16,32,64,125,250,500,750,1000,1250,1500,1750,2000,2250,' +
          '2500,2750,3000',
      'Illusionist':
        'Require="dexterity >= 16","intelligence >= 9" ' +
        'Attack=0,1,3,- ' +
        'NonweaponProficiency=4,3 ' +
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Illusionist Experience",' +
          '"1:School Expertise","1:School Focus","1:School Opposition",' +
          '"1:School Specialization","9:Eldritch Craft" ' +
        'Experience=' +
          '0,2.5,5,10,20,40,60,90,135,250,375,750,1125,1500,1875,2250,2625,' +
          '3000,3375,3750 ' +
        'SpellSlots=' +
          'W1:1=1;2=2;4=3;5=4;13=5,' +
          'W2:3=1;4=2;7=3;10=4;13=5,' +
          'W3:5=1;6=2;8=3;11=4;13=5,' +
          'W4:7=1;8=2;11=3;12=4;15=5,' +
          'W5:9=1;10=2;11=3;12=4;15=5,' +
          'W6:12=1;13=2;16=3;20=4,' +
          'W7:14=1;16=2;17=3,' +
          'W8:16=1;17=2;19=3,' +
          'W9:18=1;20=2',
      'Magic User':
        'NonweaponProficiency=4,3 ' +
        'HitDie=d4,10,1 Attack=0,1,3,- ' +
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Magic User Experience",' +
          '"9:Eldritch Craft" ' +
        'Experience=' +
          '0,2.5,5,10,20,40,60,90,135,250,375,750,1125,1500,1875,2250,2625,' +
          '3000,3375,3750 ' +
        'SpellSlots=' +
          'W1:1=1;2=2;4=3;5=4;13=5,' +
          'W2:3=1;4=2;7=3;10=4;13=5,' +
          'W3:5=1;6=2;8=3;11=4;13=5,' +
          'W4:7=1;8=2;11=3;12=4;15=5,' +
          'W5:9=1;10=2;11=3;12=4;15=5,' +
          'W6:12=1;13=2;16=3;20=4,' +
          'W7:14=1;16=2;17=3,' +
          'W8:16=1;17=2;19=3,' +
          'W9:18=1;20=2',
      'Paladin':
        'Require=' +
          '"alignment == \'Lawful Good\'","charisma >= 17",' +
          '"constitution >= 9","strength >= 12","wisdom >= 13" ' +
        'Attack=0,1,1,- NonweaponProficiency=3,3 ' +
        'Features=' +
          '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
          '"strength >= 16/charisma >= 16 ? 1:Bonus Paladin Experience",' +
          '"1:Circle Of Power","1:Cure Disease","1:Detect Evil",' +
          '1:Discriminating,"1:Divine Health","1:Divine Protection",' +
          '"1:Lay On Hands",1:Non-Materialist,1:Philanthropist,' +
          '"1:Protection From Evil","3:Turn Undead","4:Summon Warhorse" ' +
        'Experience=' +
          '0,2,4,8,16,32,64,125,250,500,750,1000,1250,1500,1750,2000,2250,' +
          '2500,2750,3000 ' +
        'CasterLevelDivine=' +
          '"levels.Paladin < 9 ? null : Math.min(levels.Paladin - 8, 9)" ' +
        'SpellSlots=' +
          'P1:9=1;10=2;14=3,' +
          'P2:11=1;12=2;16=3,' +
          'P3:13=1;16=2;17=3,' +
          'P4:15=1;19=2;20=3',
      'Ranger':
        'Require=' +
          '"alignment =~ \'Good\'","constitution >= 14","dexterity >= 13",' +
          '"strength >= 13","wisdom >= 14" ' +
        'HitDie=10,9,3 Attack=0,1,1,- NonweaponProficiency=3,3 ' +
        'Features=' +
          '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
          '"strength >= 16/dexterity >= 16/wisdom >= 16 ? 1:Bonus Ranger Experience",' +
          '1:Ambidextrous,"1:Animal Empathy","1:Delayed Henchmen",' +
          '"1:Ranger Skills","1:Travel Light","2:Favored Enemy",3:Tracking ' +
        'Experience=' +
          '0,2,4,8,16,32,64,125,250,500,750,1000,1250,1500,1750,2000,2250,' +
          '2500,2750,3000 ' +
        'CasterLevelArcane=levels.Ranger ? null : null ' +
        'CasterLevelDivine=' +
          '"levels.Ranger < 8 ? null : Math.min(levels.Ranger-7, 9)" ' +
        'SpellSlots=' +
          'P1:8=1;9=2;13=3,' +
          'P2:10=1;11=2;15=3,' +
          'P3:12=1;14=2;16=3',
      'Thief':
        'Require=' +
          '"alignment != \'Lawful Good\'","dexterity >= 9" ' +
        'Attack=0,1,2,- ' +
        'Features=' +
          '"1:Armor Proficiency (Elven Chain/Leather/Padded/Studded Leather)",' +
          '"dexterity >= 16 ? 1:Bonus Thief Experience",' +
          '1:Backstab,"1:Thief Skills","10:Read Scrolls" ' +
         'Experience=' +
           '0,1.25,2.5,5,10,20,40,70,110,160,220,440,660,880,1100,1320,1540,' +
           '1760,1980,2200 ' +
        'NonweaponProficiency=3,4',
      // New
      'Abjurer':
        'Require="wisdom >= 15","intelligence >= 9" ' +
        'HitDie=d4,10,1 Attack=0,1,3,- WeaponProficiency=1,6,5 ' +
        'Breath=15,2,5 Death=14,1.5,5 Petrification=13,2,5 Spell=12,2,5 Wand=11,2,5 '+
        'NonweaponProficiency=4,3 ' +
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Abjurer Experience",' +
          '"1:School Expertise","1:School Focus","1:School Opposition",' +
          '"1:School Specialization","9:Eldritch Craft" ' +
        'CasterLevelArcane=levels.Abjurer ' +
        'Experience=' +
          '0,2.5,5,10,20,40,60,90,135,250,375,750,1125,1500,1875,2250,2625,' +
          '3000,3375,3750 ' +
        'SpellAbility=intelligence ' +
        'SpellSlots=' +
          'W1:1=1;2=2;4=3;5=4;13=5,' +
          'W2:3=1;4=2;7=3;10=4;13=5,' +
          'W3:5=1;6=2;8=3;11=4;13=5,' +
          'W4:7=1;8=2;11=3;12=4;15=5,' +
          'W5:9=1;10=2;11=3;12=4;15=5,' +
          'W6:12=1;13=2;16=3;20=4,' +
          'W7:14=1;16=2;17=3,' +
          'W8:16=1;17=2;19=3,' +
          'W9:18=1;20=2',
      'Conjurer':
        'Require="constitution >= 15","intelligence >= 9" ' +
        'HitDie=d4,10,1 Attack=0,1,3,- WeaponProficiency=1,6,5 ' +
        'Breath=15,2,5 Death=14,1.5,5 Petrification=13,2,5 Spell=12,2,5 Wand=11,2,5 '+
        'NonweaponProficiency=4,3 ' +
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Conjurer Experience",' +
          '"1:School Expertise","1:School Focus","1:School Opposition",' +
          '"1:School Specialization","9:Eldritch Craft" ' +
        'CasterLevelArcane=levels.Conjurer ' +
        'Experience=' +
          '0,2.5,5,10,20,40,60,90,135,250,375,750,1125,1500,1875,2250,2625,' +
          '3000,3375,3750 ' +
        'SpellAbility=intelligence ' +
        'SpellSlots=' +
          'W1:1=1;2=2;4=3;5=4;13=5,' +
          'W2:3=1;4=2;7=3;10=4;13=5,' +
          'W3:5=1;6=2;8=3;11=4;13=5,' +
          'W4:7=1;8=2;11=3;12=4;15=5,' +
          'W5:9=1;10=2;11=3;12=4;15=5,' +
          'W6:12=1;13=2;16=3;20=4,' +
          'W7:14=1;16=2;17=3,' +
          'W8:16=1;17=2;19=3,' +
          'W9:18=1;20=2',
      'Diviner':
        'Require="wisdom >= 16","intelligence >= 9" ' +
        'HitDie=d4,10,1 Attack=0,1,3,- WeaponProficiency=1,6,5 ' +
        'Breath=15,2,5 Death=14,1.5,5 Petrification=13,2,5 Spell=12,2,5 Wand=11,2,5 '+
        'NonweaponProficiency=4,3 ' +
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Diviner Experience",' +
          '"1:School Expertise","1:School Focus","1:School Opposition",' +
          '"1:School Specialization","9:Eldritch Craft" ' +
        'CasterLevelArcane=levels.Diviner ' +
        'Experience=' +
          '0,2.5,5,10,20,40,60,90,135,250,375,750,1125,1500,1875,2250,2625,' +
          '3000,3375,3750 ' +
        'SpellAbility=intelligence ' +
        'SpellSlots=' +
          'W1:1=1;2=2;4=3;5=4;13=5,' +
          'W2:3=1;4=2;7=3;10=4;13=5,' +
          'W3:5=1;6=2;8=3;11=4;13=5,' +
          'W4:7=1;8=2;11=3;12=4;15=5,' +
          'W5:9=1;10=2;11=3;12=4;15=5,' +
          'W6:12=1;13=2;16=3;20=4,' +
          'W7:14=1;16=2;17=3,' +
          'W8:16=1;17=2;19=3,' +
          'W9:18=1;20=2',
      'Enchanter':
        'Require="charisma >= 16","intelligence >= 9" ' +
        'HitDie=d4,10,1 Attack=0,1,3,- WeaponProficiency=1,6,5 ' +
        'Breath=15,2,5 Death=14,1.5,5 Petrification=13,2,5 Spell=12,2,5 Wand=11,2,5 '+
        'NonweaponProficiency=4,3 ' +
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Enchanter Experience",' +
          '"1:School Expertise","1:School Focus","1:School Opposition",' +
          '"1:School Specialization","9:Eldritch Craft" ' +
        'CasterLevelArcane=levels.Enchanter ' +
        'Experience=' +
          '0,2.5,5,10,20,40,60,90,135,250,375,750,1125,1500,1875,2250,2625,' +
          '3000,3375,3750 ' +
        'SpellAbility=intelligence ' +
        'SpellSlots=' +
          'W1:1=1;2=2;4=3;5=4;13=5,' +
          'W2:3=1;4=2;7=3;10=4;13=5,' +
          'W3:5=1;6=2;8=3;11=4;13=5,' +
          'W4:7=1;8=2;11=3;12=4;15=5,' +
          'W5:9=1;10=2;11=3;12=4;15=5,' +
          'W6:12=1;13=2;16=3;20=4,' +
          'W7:14=1;16=2;17=3,' +
          'W8:16=1;17=2;19=3,' +
          'W9:18=1;20=2',
      'Invoker':
        'Require="constitution >= 16","intelligence >= 9" ' +
        'HitDie=d4,10,1 Attack=0,1,3,- WeaponProficiency=1,6,5 ' +
        'Breath=15,2,5 Death=14,1.5,5 Petrification=13,2,5 Spell=12,2,5 Wand=11,2,5 '+
        'NonweaponProficiency=4,3 ' +
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Invoker Experience",' +
          '"1:School Expertise","1:School Focus","1:School Opposition",' +
          '"1:School Specialization","9:Eldritch Craft" ' +
        'CasterLevelArcane=levels.Invoker ' +
        'Experience=' +
          '0,2.5,5,10,20,40,60,90,135,250,375,750,1125,1500,1875,2250,2625,' +
          '3000,3375,3750 ' +
        'SpellAbility=intelligence ' +
        'SpellSlots=' +
          'W1:1=1;2=2;4=3;5=4;13=5,' +
          'W2:3=1;4=2;7=3;10=4;13=5,' +
          'W3:5=1;6=2;8=3;11=4;13=5,' +
          'W4:7=1;8=2;11=3;12=4;15=5,' +
          'W5:9=1;10=2;11=3;12=4;15=5,' +
          'W6:12=1;13=2;16=3;20=4,' +
          'W7:14=1;16=2;17=3,' +
          'W8:16=1;17=2;19=3,' +
          'W9:18=1;20=2',
      'Necromancer':
        'Require="wisdom >= 16","intelligence >= 9" ' +
        'HitDie=d4,10,1 Attack=0,1,3,- WeaponProficiency=1,6,5 ' +
        'Breath=15,2,5 Death=14,1.5,5 Petrification=13,2,5 Spell=12,2,5 Wand=11,2,5 '+
        'NonweaponProficiency=4,3 ' +
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Necromancer Experience",' +
          '"1:School Expertise","1:School Focus","1:School Opposition",' +
          '"1:School Specialization","9:Eldritch Craft" ' +
        'CasterLevelArcane=levels.Necromancer ' +
        'Experience=' +
          '0,2.5,5,10,20,40,60,90,135,250,375,750,1125,1500,1875,2250,2625,' +
          '3000,3375,3750 ' +
        'SpellAbility=intelligence ' +
        'SpellSlots=' +
          'W1:1=1;2=2;4=3;5=4;13=5,' +
          'W2:3=1;4=2;7=3;10=4;13=5,' +
          'W3:5=1;6=2;8=3;11=4;13=5,' +
          'W4:7=1;8=2;11=3;12=4;15=5,' +
          'W5:9=1;10=2;11=3;12=4;15=5,' +
          'W6:12=1;13=2;16=3;20=4,' +
          'W7:14=1;16=2;17=3,' +
          'W8:16=1;17=2;19=3,' +
          'W9:18=1;20=2',
      'Transmuter':
        'Require="dexterity >= 15","intelligence >= 9" ' +
        'HitDie=d4,10,1 Attack=0,1,3,- WeaponProficiency=1,6,5 ' +
        'Breath=15,2,5 Death=14,1.5,5 Petrification=13,2,5 Spell=12,2,5 Wand=11,2,5 '+
        'NonweaponProficiency=4,3 ' +
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Transmuter Experience",' +
          '"1:School Expertise","1:School Focus","1:School Opposition",' +
          '"1:School Specialization","9:Eldritch Craft" ' +
        'CasterLevelArcane=levels.Transmuter ' +
        'Experience=' +
          '0,2.5,5,10,20,40,60,90,135,250,375,750,1125,1500,1875,2250,2625,' +
          '3000,3375,3750 ' +
        'SpellAbility=intelligence ' +
        'SpellSlots=' +
          'W1:1=1;2=2;4=3;5=4;13=5,' +
          'W2:3=1;4=2;7=3;10=4;13=5,' +
          'W3:5=1;6=2;8=3;11=4;13=5,' +
          'W4:7=1;8=2;11=3;12=4;15=5,' +
          'W5:9=1;10=2;11=3;12=4;15=5,' +
          'W6:12=1;13=2;16=3;20=4,' +
          'W7:14=1;16=2;17=3,' +
          'W8:16=1;17=2;19=3,' +
          'W9:18=1;20=2'
    },
    'Feature':{
      // Modified
      'Charming Music':
        'Section=magic Note="Modify listener reaction 1 category (-%1 paralyzation save neg)"',
      'Defensive Song':
        'Note="R30\' Spell save to counteract magical song and poetry attacks"',
      'Detect Construction':'Note="R10\' 83% Detect new construction"',
      'Favored Enemy':'Note="+4 attack vs. chosen foe type"',
      'Legend Lore':'Note="%V% info about magic item"',
      'Poetic Inspiration':
        'Note="R%1\' 3 rd performance gives allies +1 attack, +1 saves, or +2 morale for %V rd"',
      'Read Scrolls':'Note="%V% cast spell from scroll"',
      'Stealthy':
        'Note="Foe -4 surprise roll when traveling quietly, -2 opening doors"',
      'Tracking':'Section=skill Note="+%V Tracking"',
      // New
      'Ageless':'Section=ability Note="No ability adjustments for age"',
      'Ambidextrous':
        'Section=combat ' +
        'Note="No penalty for two-handed fighting in light armor"',
      'Animal Empathy':
        'Section=skill ' +
        'Note="Befriend domestic animals, shift wild reaction one category (%V Wand save neg)"',
      'Bard Skills':
        'Section=skill ' +
        'Note="Climb Walls, Hear Noise, Pick Pockets, Read Languages"',
      'Bonus Abjurer Experience':
        'Section=ability Note="10% added to awarded experience"',
      'Bonus Conjurer Experience':
        'Section=ability Note="10% added to awarded experience"',
      'Bonus Diviner Experience':
        'Section=ability Note="10% added to awarded experience"',
      'Bonus Enchanter Experience':
        'Section=ability Note="10% added to awarded experience"',
      'Bonus Illusionist Experience':
        'Section=ability Note="10% added to awarded experience"',
      'Bonus Invoker Experience':
        'Section=ability Note="10% added to awarded experience"',
      'Bonus Necromancer Experience':
        'Section=ability Note="10% added to awarded experience"',
      'Bonus Transmuter Experience':
        'Section=ability Note="10% added to awarded experience"',
      'Circle Of Power':
        'Section=magic ' +
        'Note="R30\' Unsheathed <i>Holy Sword</i> dispels hostile magic up to level %V"',
      'Deadly Aim':'Section=combat Note="+1 attack w/slings and thrown"',
      'Fluid Appearance':'Section=magic Note="Alter appearance at will"',
      'Gnome Ability Adjustment':
        'Section=ability Note="+1 Intelligence/-1 Wisdom"',
      'Hibernation':
        'Section=feature Note="Lower body processes for chosen duration"',
      'Magic Mismatch':'Section=feature Note="20% magic item malfunction"',
      'Planar Travel (Air)':
        'Section=magic Note="At-will travel in Plane Of Air"',
      'Planar Travel (Earth)':
        'Section=magic Note="At-will travel in Plane Of Earth"',
      'Planar Travel (Fire)':
        'Section=magic Note="At-will travel in Plane Of Fire"',
      'Planar Travel (Water)':
        'Section=magic Note="At-will travel in Plane Of Water"',
      'Poison Immunity':'Section=save Note="Immune to poison"',
      'Ranger Skills':
        'Section=skill Note="Hide In Shadows, Move Silently"',
      'School Expertise':
        'Section=magic,save ' +
        'Note="Foes -1 save vs. %V spells","+1 vs. %V spells"',
      'School Focus':
        'Section=magic Note="+15% understand %V spells, -15% others"',
      'School Opposition':'Section=magic Note="Cannot learn or cast %V spells"',
      'School Specialization':
        'Section=magic Note="Extra %V spell each spell level"',
      'Slow':'Section=ability Note="-60 Speed"'
    },
    'Race':{
      // Removed
      'Half-Orc':null,
      // Modified
      'Dwarf':
        'Features+="1:Magic Mismatch",1:Slow ' +
        'Languages=Dwarf',
      'Elf':
        'Languages=Elf',
      'Gnome':
        'Features=' +
          '"1:Burrow Tongue","1:Detect Hazard","1:Detect Slope",' +
          '"1:Determine Depth","1:Determine Direction",' +
          '"1:Gnome Ability Adjustment","1:Gnome Dodge","1:Gnome Enmity",' +
          '1:Infravision,"1:Resist Magic","1:Magic Mismatch",1:Slow ' +
        'Languages=Gnome',
      'Half-Elf':
        'Languages=Common',
      'Halfling':
        'Features+="1:Deadly Aim",1:Slow ' +
        'Languages=Halfling'
    },
    'School':{
      // Removed
      'Divination':null,
      'Possession':null,
      // New
      'Greater Divination':'',
      'Lesser Divination':''
    },
    'Shield':{
      // Removed
      'Large Shield':null,
      // Modified
      'Medium Shield':'Weight=5',
      // New
      'Body Shield':'AC=1 Weight=15',
      'Buckler Shield':'AC=1 Weight=3'
    },
    'Skill':{
      // Modified
      'Climb Walls':'Class=Bard,Thief',
      'Find Traps':'Class=Thief',
      'Hear Noise':'Class=Bard,Thief',
      'Hide In Shadows':'Class=Ranger,Thief',
      'Move Silently':'Class=Ranger,Thief',
      'Open Locks':'Class=Thief',
      'Pick Pockets':'Class=Bard,Thief',
      'Read Languages':'Class=Bard,Thief',
      // New
      'Agriculture':'Ability=intelligence Class=all',
      'Airborne Riding':'Ability=wisdom Class=all',
      'Ancient History':
        'Ability=intelligence Class=Bard,Cleric,Druid,Illusionist,"Magic User",Thief',
      'Ancient Languages':
        'Ability=intelligence Class=Cleric,Druid,Illusionist,"Magic User"',
      'Animal Handling':'Ability=wisdom Class=all',
      'Animal Lore':'Ability=intelligence Class=Fighter,Paladin,Ranger',
      'Animal Training':'Ability=wisdom Class=all',
      'Appraising':'Ability=intelligence Class=Bard,Thief',
      'Armorer':'Ability=intelligence Class=Fighter,Paladin,Ranger',
      'Artistic Ability':'Ability=wisdom Class=all',
      'Astrology':
        'Ability=intelligence Class=Cleric,Druid,Illusionist,"Magic User"',
      'Blacksmithing':'Ability=strength Class=all',
      'Blind-Fighting':'Class=Bard,Fighter,Paladin,Ranger,Thief Ability=N/A',
      'Bowyer':'Ability=dexterity Class=Fighter,Paladin,Ranger',
      'Brewing':'Ability=intelligence Class=all',
      'Carpentry':'Ability=strength Class=all',
      'Charioteering':'Ability=dexterity Class=Fighter,Paladin,Ranger',
      'Cobbling':'Ability=dexterity Class=all',
      'Cooking':'Ability=intelligence Class=all',
      'Dancing':'Ability=dexterity Class=all',
      'Direction Sense':'Ability=wisdom Class=all',
      'Disguise':'Ability=charisma Class=Bard,Thief',
      'Endurance':'Ability=constitution Class=Fighter,Paladin,Ranger',
      'Engineering':
        'Ability=intelligence Class=Cleric,Druid,Illusionist,"Magic User"',
      'Etiquette':'Ability=charisma Class=all',
      'Fire-Building':'Ability=wisdom Class=all',
      'Fishing':'Ability=wisdom Class=all',
      'Forgery':'Ability=dexterity Class=Bard,Thief',
      'Gaming':'Ability=charisma Class=Bard,Fighter,Paladin,Ranger,Thief',
      'Gem Cutting':
        'Ability=dexterity Class=Bard,Illusionist,"Magic User",Thief',
      'Healing':'Ability=wisdom Class=Cleric,Druid',
      'Heraldry':'Ability=intelligence Class=all',
      'Herbalism':
        'Ability=intelligence Class=Cleric,Druid,Illusionist,"Magic User"',
      'Hunting':'Ability=wisdom Class=Fighter,Paladin,Ranger',
      'Juggling':'Ability=dexterity Class=Bard,Thief',
      'Jumping':'Ability=strength Class=Bard,Thief',
      'Land-Based Riding':'Ability=wisdom Class=all',
      'Leather Working':'Ability=intelligence Class=all',
      'Local History':'Ability=charisma Class=Bard,Cleric,Druid,Thief',
      'Mining':'Ability=wisdom Class=all',
      'Modern Languages':'Ability=intelligence Class=all',
      'Mountaineering':'Class=Fighter,Paladin,Ranger Ability=N/A',
      'Musical Instrument':'Ability=dexterity Class=Cleric,Druid',
      'Navigation':
        'Ability=intelligence Class=Fighter,Illusionist,"Magic User",Paladin,Ranger',
      'Pottery':'Ability=dexterity Class=all',
      'Reading And Writing':
        'Ability=intelligence Class=Cleric,Druid,Illusionist,"Magic User"',
      'Reading Lips':'Ability=intelligence Class=Bard,Thief',
      'Religion':'Ability=wisdom Class=Cleric,Druid,Illusionist,"Magic User"',
      'Rope Use':'Ability=dexterity Class=all',
      'Running':'Ability=constitution Class=Fighter,Paladin,Ranger',
      'Seamanship':'Ability=dexterity Class=all',
      'Set Snares':'Ability=dexterity Class=Bard,Fighter,Paladin,Ranger,Thief',
      'Singing':'Ability=charisma Class=all',
      'Spellcraft':
        'Ability=intelligence Class=Cleric,Druid,Illusionist,"Magic User"',
      'Stonemasonry':'Ability=strength Class=all',
      'Survival':'Ability=intelligence Class=Fighter,Paladin,Ranger',
      'Swimming':'Ability=strength Class=all',
      'Tailoring':'Ability=dexterity Class=all',
      'Tightrope Walking':'Ability=dexterity Class=Bard,Thief',
      'Tracking':'Ability=wisdom Class=Fighter,Paladin,Ranger',
      'Tumbling':'Ability=dexterity Class=Bard,Thief',
      'Ventriloquism':'Ability=intelligence Class=Bard,Thief',
      'Weaponsmithing':'Ability=intelligence Class=Fighter,Paladin,Ranger',
      'Weather Sense':'Ability=wisdom Class=all',
      'Weaving':'Ability=intelligence Class=all'
    },
    'Spell':{
      // Removed
      'Alter Reality':null,
      'Cacodemon':null,
      'Continual Darkness':null,
      'Cure Blindness':null,
      'Detect Illusion':null,
      'Dispel Exhaustion':null,
      'Dispel Illusion':null,
      'Exorcise':null,
      'Locate Animals':null,
      'Locate Plants':null,
      'Paralyzation':null,
      'Predict Weather':null,
      'Purify Water':null,
      'Push':null,
      'Spiritwrack':null,
      'True Sight':null,
      'Write':null,
      // Renamed
      'Anti-Animal Shell':null,
      'Antianimal Shell':OldSchool.SPELLS['Anti-Animal Shell'] + ' ' +
        'Level=P6',
      'Anti-Magic Shell':null,
      'Antimagic Shell':OldSchool.SPELLS['Anti-Magic Shell'] + ' ' +
        'Level=W6',
      'Anti-Plant Shell':null,
      'Antiplant Shell':OldSchool.SPELLS['Anti-Plant Shell'] + ' ' +
        'Level=P5 ' +
        'Range="7.5\' radius"',
      'Demi-Shadow Magic':null,
      'Demishadow Magic':OldSchool.SPELLS['Demi-Shadow Magic'] + ' ' +
        'Level=W6 ' +
        'Description="R$L10plus60\' Mimics spell level 4 - 5"',
      'Demi-Shadow Monsters':null,
      'Demishadow Monsters':OldSchool.SPELLS['Demi-Shadow Monsters'] + ' ' +
        'Level=W5',
      'Fools Gold':null,
      "Fool's Gold":OldSchool.SPELLS['Fools Gold'] + ' ' +
        'Level=W2',
      'Non-Detection':null,
      'Nondetection':OldSchool.SPELLS['Non-Detection'] + ' ' +
        'Level=W3 ' +
        'Duration="$L hr" ' +
        'Effect="Touched"',
      // Modified
      'Aerial Servant':
        'Level=P6',
      'Affect Normal Fires':
        'Level=W1 ' +
        'Duration="$L2 rd" ' +
        'Effect="10\' radius"',
      'Airy Water':
        'Level=W5',
      'Animal Growth':
        'Level=P5,W5',
      'Animal Growth P5':
        'Duration="$L2 rd" ' +
        'Range="80\'"',
      'Animal Friendship':
        'Level=P1',
      'Animal Summoning I':
        'Level=P4 ' +
        'Range="1 miles"',
      'Animal Summoning II':
        'Level=P5',
      'Animal Summoning III':
        'Level=P6 ' +
        'Range="$L100\'"',
      'Animate Dead':
        'Level=P3,W5',
      'Animate Object':
        'Level=P6',
      'Animate Rock':
        'Level=P7',
      'Antipathy/Sympathy':
        'Level=W8',
      'Astral Spell':
        'Level=P7,W9 ' +
        'Range="Self and 7 touched"',
      'Atonement':
        'Level=P5',
      'Audible Glamer':
        'Level=W1',
      'Augury':
        'Level=P2 ' +
        'School="Lesser Divination"',
      'Barkskin':
        'Level=P2 ' +
        'Effect="unarmored AC ${6-Math.floor(lvl/4)}, +1 non-spell saves"',
      "Bigby's Clenched Fist":
        'Level=W8',
      "Bigby's Crushing Hand":
        'Level=W9',
      "Bigby's Forceful Hand":
        'Level=W6',
      "Bigby's Grasping Hand":
        'Level=W7',
      "Bigby's Interposing Hand":
        'Level=W5',
      'Blade Barrier':
        'Level=P6',
      'Bless':
        'Level=P1',
      'Blindness':
        'Level=W2 ' +
        'Range="R$L10plus30\'"',
      'Blink':
        'Level=W3 ' +
        'Effect="10\'/rd"',
      'Blur':
        'Level=W2',
      'Burning Hands':
        'Level=W1 ' +
        'Effect="5\' cone"',
      'Call Lightning':
        'Level=P3',
      'Call Woodland Beings':
        'Level=P4 ' +
        'Range="$L100\'"',
      'Change Self':
        'Level=W1',
      'Chant':
        'Level=P2',
      'Chaos':
        'Level=W5',
      'Chariot Of Sustarre':
        'Level=P7 ' +
        'Duration="12 hr"',
      'Charm Monster':
        'Level=W4',
      'Charm Person':
        'Level=W1',
      'Charm Person Or Mammal':
        'Level=P2',
      'Charm Plants':
        'Level=W7',
      'Clairaudience':
        'Level=W3 ' +
        'School="Lesser Divination"',
      'Clairvoyance':
        'Level=W3 ' +
        'School="Lesser Divination"',
      'Clone':
        'Level=W8',
      'Cloudkill':
        'Level=W5',
      'Color Spray':
        'Level=W1 ' +
        'Effect="20\' cone"',
      'Command':
        'Level=P1 ' +
        'Range="30\'"',
      'Commune':
        'Level=P5 ' +
        'School="Greater Divination"',
      'Commune With Nature':
        'Level=P5 ' +
        'School="Greater Divination"',
      'Comprehend Languages':
        'Level=W1',
      'Cone Of Cold':
        'Level=W5',
      'Confusion':
        'Level=P7,W4 ' +
        'Description="R$R $E 10% wander away/50% stand confused/30% attack nearest creature/10% attack self or allies for $D (Save neg 1 rd)" ' +
        'Effect="1d4 + $L or more creatures in 60\' sq"',
      'Confusion P7':
        'Duration="$L rd" ' +
        'Effect="1d4 creatures in 40\' sq" ' +
        'Range="80\'"',
      'Conjure Animals':
        'Level=P6,W6 ' +
        'Effect="$L2 HD"',
      'Conjure Animals P6':
        'Duration="$L2 rd"',
      'Conjure Earth Elemental':
        'Level=P7 ' +
        'Effect="elemental"',
      'Conjure Elemental':
        'Level=W5',
      'Conjure Fire Elemental':
        'Level=P6 ' +
        'Effect="elemental"',
      'Contact Other Plane':
        'Level=W5 ' +
        'School="Greater Divination"',
      'Create Water':
        'Level=P1 ' +
        'Range="30\'"',
      'Continual Light':
        'Level=P3,W2',
      'Continual Light P3':
        'Range="120\'"',
      "Control Temperature 10' Radius":
        'Level=P4 ' +
        'Effect="${lvl*10}F"',
      'Control Weather':
        'Level=P7,W6',
      'Control Weather P7':
        'Duration="4d12 hr"',
      'Control Winds':
        'Level=P5',
      'Create Food And Water':
        'Level=P3 ' +
        'Effect="$L persons"',
      'Creeping Doom':
        'Level=P7 ' +
        'Effect="20\' sq"',
      'Cure Critical Wounds':
        'Level=P5',
      'Cure Disease':
        'Level=P3 ' +
        'School=Abjuration',
      'Cure Light Wounds':
        'Level=P1',
      'Cure Serious Wounds':
        'Level=P4',
      'Dancing Lights':
        'Level=W1',
      "Darkness 15' Radius":
        'Level=W2',
      'Deafness':
        'Level=W2',
      'Death Spell':
        'Level=W6 ' +
        'School=Necromancy ' +
        'Effect="$L30\' cu"',
      'Delayed Blast Fireball':
        'Level=W7',
      'Detect Charm':
        'Level=P2 ' +
        'School="Lesser Divination"',
      'Detect Evil':
        'Level=P1,W2 ' +
        'School="Lesser Divination"',
      'Detect Evil P1':
        'Duration="$L5plus10 rd" ' +
        'Range="10\'x120\' path"',
      'Detect Invisibility':
        'Level=W2 ' +
        'School="Lesser Divination"',
      'Detect Lie':
        'Level=P4 ' +
        'School="Lesser Divination" ' +
        'Effect="Self"',
      'Detect Magic':
        'Level=P1,W1 ' +
        'School="Lesser Divination"',
      'Detect Magic P1':
        'Duration="1 tn" ' +
        'Range="10\'x30\' path"',
      'Detect Snares And Pits':
        'Level=P1 ' +
        'School="Lesser Divination"',
      'Dig':
        'Level=W4',
      'Dimension Door':
        'Level=W4',
      'Dispel Evil':
        'Level=P5',
      'Dispel Magic':
        'Level=P3,W3 ' +
        'Description="R120\' Extinguishes magic in 30\' cu (50% +5%/-5% per caster level delta)"',
      'Dispel Magic P3':
        'Range="60\'"',
      'Disintegrate':
        'Level=W6 ' +
        'Effect="10\' sq"',
      'Distance Distortion':
        'Level=W5 ' +
        'Duration="$L2 tn" ' +
        'Effect="$L10\'"',
      'Divination':
        'Level=P4 ' +
        'School="Lesser Divination"',
      "Drawmij's Instant Summons":
        'Level=W7',
      'Duo-Dimension':
        'Level=W7',
      'Earthquake':
        'Level=P7',
      'Emotion':
        'Level=W4 ' +
        'Description="R$L10\' Targets in 20\' sq experience courage (gain +1 attack, +3 damage, +5 HP), fear (flee), friendship (react positively), happiness (+4 reaction), hate (react negatively), hope (gain +2 morale, save, attack, damage), hopelessness (walk away or surrender), or sadness (suffer -1 surprise, +1 init) for conc"',
      'Enchant An Item':
        'Level=W6 ' +
        'School=Enchantment',
      'Enchanted Weapon':
        'Level=W4 ' +
        'School=Enchantment ' +
        'Effect="(+1 attack and damage)"',
      'Enlarge':
        'Level=W1 ' +
        'Description="R$L5\' Creature or object grows $L10% for $L5 rd (rev shrinks, save neg)"',
      'Entangle':
        'Level=P1 ' +
        'Effect="40\' cu"',
      'Erase':
        'Level=W1 ' +
        'Description="R30\' Erases magical ($L5plus30% chance) or normal (90%) writing from 2-page area"',
      'ESP':
        'Level=W2 ' +
        'School="Lesser Divination"',
      'Explosive Runes':
        'Level=W3',
      'Extension I':
        'Level=W4',
      'Extension II':
        'Level=W5',
      'Extension III':
        'Level=W6',
      'Faerie Fire':
        'Level=P1',
      'Fear':
        'Level=W4',
      'Feather Fall':
        'Level=W1 ' +
        'Duration="$L rd"',
      'Feeblemind':
        'Level=W5 ' +
        'Description="R$L10\' Reduces target Intelligence to 2 (Save Priest +1, Wizard -4 and non-human -2 neg)"',
      'Feign Death':
        'Level=P3,W3 ' +
        'Duration="$Lplus6 tn"',
      'Feign Death P3':
        'Duration="$Lplus10 rd"',
      'Find Familiar':
        'Level=W1',
      'Find The Path':
        'Level=P6 ' +
        'School="Greater Divination"',
      'Find Traps':
        'Level=P2 ' +
        'School="Lesser Divination"',
      'Finger Of Death':
        'Level=W7 ' +
        'School=Necromancy',
      'Fire Charm':
        'Level=W4',
      'Fire Seeds':
        'Level=P6',
      'Fire Shield':
        'Level=W4',
      'Fire Storm':
        'Level=P7 ' +
        'Range="160\'"',
      'Fire Trap':
        'Level=P2,W4 ' +
        'School=Abjuration',
      'Fireball':
        'Level=W3 ' +
        'Effect="${Lmax10}d6 HP" ' +
        'Range="$L10plus10\'"',
      'Flame Arrow':
        'Level=W3 ' +
        'School=Conjuration ' +
        'Description="Touched arrow inflicts +1 HP fire damage within 1 rd or self casts $Ldiv5 R$L10plus30\' bolts that inflict 5d6 HP (Save half)"',
      'Flame Strike':
        'Level=P5',
      'Fly':
        'Level=W3 ' +
        'Duration="1d6 + $L tn" ' +
        'Effect="180\'/rd"',
      'Fog Cloud':
        'Level=W2',
      'Forget':
        'Level=W2',
      'Friends':
        'Level=W1 ' +
        'Description="R60\' Self gains +2d4 Charisma for 1d4 + $L rd"',
      'Gate':
        'Level=P7,W9',
      'Gaze Reflection':
        'Level=W1 ' +
        'Duration="$Lplus2 rd"',
      'Fumble':
        'Level=W4 ' +
        'Effect="30\' cu"',
      'Geas':
        'Level=W6 ' +
        'Range="R10\' Target"',
      'Glassee':
        'Level=W6',
      'Glassteel':
        'Level=W8',
      'Globe Of Invulnerability':
        'Level=W6',
      'Glyph Of Warding':
        'Level=P3 ' +
        'Effect="${lvl}d4 HP" ' +
        'Range="$L\' sq"',
      'Guards And Wards':
        'Level=W6 ' +
        'Effect="400\' sq"',
      'Gust Of Wind':
        'Level=W3 ' +
        'Duration="1 rd"',
      'Hallucinatory Forest':
        'Level=P4',
      'Hallucinatory Terrain':
        'Level=W4 ' +
        'Duration="for $L hr (Save disbelieve)" ' +
        'Effect="$L30\' cu"',
      'Haste':
        'Level=W3',
      'Heal':
        'Level=P6 ' +
        'Effect="all HP"',
      'Heat Metal':
        'Level=P2 ' +
        'School=Necromancy',
      'Hold Animal':
        'Level=P3',
      'Hold Monster':
        'Level=W5',
      'Hold Person':
        'Level=P2,W3',
      'Hold Plant':
        'Level=P4',
      'Hold Portal':
        'Level=W1 ' +
        'Effect="$L20\' sq"',
      'Holy Word':
        'Level=P7',
      'Hypnotic Pattern':
        'Level=W2',
      'Hypnotism':
        'Level=W1 ' +
        'Range="5\'"',
      'Ice Storm':
        'Level=W4',
      'Identify':
        'Level=W1 ' +
        'School="Lesser Divination" ' +
        'Effect="$L10%"',
      'Illusionary Script':
        'Level=W3 ' +
        'Description="Obscured writing transmits <i>Suggestion</i> (Save neg) to unauthorized readers for $L dy"',
      'Imprisonment':
        'Level=W9',
      'Improved Invisibility':
        'Level=W4',
      'Improved Phantasmal Force':
        'Level=W2 ' +
        'Effect="$L50plus200\' sq"',
      'Incendiary Cloud':
        'Level=W8 ' +
        'Effect="${lvl}d2, ${lvl}d4, ${lvl}d2 HP"',
      'Infravision':
        'Level=W3',
      'Insect Plague':
        'Level=P5 ' +
        'Range="120\'"',
      'Invisibility':
        'Level=W2',
      "Invisibility 10' Radius":
        'Level=W3',
      'Invisibility To Animals':
        'Level=P1 ' +
        'Effect="$L touched"',
      'Invisible Stalker':
        'Level=W6',
      'Jump':
        'Level=W1 ' +
        'Duration="for $L+1d3 rd"',
      'Knock':
        'Level=W2 ' +
        'Description="R60\' Opens stuck or locked item (rev locks)"',
      'Know Alignment':
        'Level=P2,W2 ' +
        'School="Lesser Divination" ' +
        'Effect="1 target/2 rd"',
      'Know Alignment P2':
        'Effect="1 target/rd"',
      'Legend Lore':
        'Level=W6 ' +
        'School="Greater Divination"',
      "Leomund's Secret Chest":
        'Level=W5',
      "Leomund's Tiny Hut":
        'Level=W3 ' +
        'Duration="$Lplus4 hr" ' +
        'Range="7.5\' radius"',
      "Leomund's Trap":
        'Level=W2',
      'Levitate':
        'Level=W2',
      'Lightning Bolt':
        'Level=W3 ' +
        'Effect="${Lmax10}d6"',
      'Light':
        'Level=P1,W1',
      'Light P1':
        'Duration="$Lplus6 tn" ' +
        'Range="120\'"',
      'Limited Wish':
        'Level=W7',
      'Locate Object':
        'Level=P3,W2 ' +
        'School="Lesser Divination"',
      'Locate Object P3':
        'Range="$L10plus60\'"',
      'Lower Water':
        'Level=P4,W6 ' +
        'Description="R$R $L10\' sq fluid subsides by $L2\' for $D (rev raises)" ' +
        'Duration="$L5 rd" ' +
        'Range="80\'"',
      'Lower Water P4':
        'Duration="$L tn" ' +
        'Range="120\'"',
      'Magic Jar':
        'School=Necromancy ' +
        'Level=W5',
      'Magic Missile':
        'Level=W1',
      'Magic Mouth':
        'Level=W2 ' +
        'Range="R10\' Target"',
      'Major Creation':
        'Level=W5 ' +
        'School=Illusion ' +
        'Duration="variable duration"',
      'Mass Charm':
        'Level=W8',
      'Mass Invisibility':
        'Level=W7 ' +
        'Effect="180\' sq"',
      'Mass Suggestion':
        'Level=W6',
      'Massmorph':
        'Level=W4 ' +
        'School=Alteration',
      'Maze':
        'Level=W8',
      'Mending':
        'Level=W1',
      'Message':
        'Level=W1 ' +
        'Description="Self has long-range whispered dialogues for $D" ' +
        'Duration="$L5 rd"',
      'Meteor Swarm':
        'Level=W9',
      'Mind Blank':
        'Level=W8 ' +
        'Effect="divination, mental control"',
      'Minor Creation':
        'Level=W4 ' +
        'School=Illusion',
      'Minor Globe Of Invulnerability':
        'Level=W4',
      'Mirror Image':
        'Level=W2 ' +
        'Effect="2d4"',
      'Misdirection':
        'Level=W2 ' +
        'Duration="8 hr"',
      'Monster Summoning I':
        'Level=W3',
      'Monster Summoning II':
        'Level=W4',
      'Monster Summoning III':
        'Level=W5',
      'Monster Summoning IV':
        'Level=W6 ' +
        'Effect="1d3 4 HD creatures"',
      'Monster Summoning V':
        'Level=W7 ' +
        'Effect="1d3 5 HD creatures"',
      'Monster Summoning VI':
        'Level=W8 ' +
        'Effect="1d3 6 HD creatures"',
      'Monster Summoning VII':
        'Level=W9',
      "Mordenkainen's Faithful Hound":
        'Level=W5 ' +
        'Duration="$L3plus6 tn"',
      "Mordenkainen's Sword":
        'Level=W7',
      'Move Earth':
        'Level=W6 ' +
        'Effect="40\'x40\'x10\'"',
      'Neutralize Poison':
        'Level=P4 ' +
        'School=Necromancy',
      "Nystul's Magic Aura":
        'Level=W1',
      'Obscurement':
        'Level=P2',
      "Otiluke's Freezing Sphere":
        'Level=W6',
      "Otto's Irresistible Dance":
        'Level=W8',
      'Part Water':
        'Level=P6,W6',
      'Part Water P6':
        'Duration="$L tn" ' +
        'Range="$L20\'"',
      'Pass Plant':
        'Level=P5',
      'Pass Without Trace':
        'Level=P1',
      'Passwall':
        'Level=W5',
      'Permanency':
        'Level=W8',
      'Permanent Illusion':
        'Level=W6 ' +
        'Effect="$L10plus20\' cu"',
      'Phase Door':
        'Level=W7',
      'Phantasmal Force':
        'Level=W1',
      'Phantasmal Killer':
        'Level=W4',
      'Plane Shift':
        'Level=P5  ' +
        'Effect="Touched plus 7 touching"',
      'Plant Door':
        'Level=P4',
      'Plant Growth':
        'Level=P3,W4',
      'Plant Growth P3':
        'Effect="$L20\' sq" ' +
        'Range="160\'"',
      'Polymorph Any Object':
        'Level=W8',
      'Polymorph Other':
        'Level=W4',
      'Polymorph Self':
        'Level=W4',
      'Power Word Blind':
        'Level=W8',
      'Power Word Kill':
        'Level=W9',
      'Power Word Stun':
        'Level=W7',
      'Prayer':
        'Level=P3',
      'Prismatic Sphere':
        'Level=W9 ' +
        'School=Abjuration',
      'Prismatic Spray':
        'Level=W7 ' +
        'School=Conjuration',
      'Prismatic Wall':
        'Level=W8 ' +
        'School=Conjuration',
      'Produce Fire':
        'Level=P4 ' +
        'Effect="12\' sq"',
      'Produce Flame':
        'Level=P2 ' +
        'Duration="$L rd"',
      'Programmed Illusion':
        'Level=W6 ' +
        'Effect="$L10plus20\' cu"',
      'Project Image':
        'Level=W6',
      'Protection From Evil':
        'Level=P1,W1',
      'Protection From Evil P1':
        'Duration="$L3 rd"',
      "Protection From Evil 10' Radius":
        'Level=P4,W3',
      "Protection From Evil 10' Radius P4":
        'Duration="$L tn"',
      'Protection From Fire':
        'Level=P3',
      'Protection From Lightning':
        'Level=P4',
      'Protection From Normal Missiles':
        'Level=W3',
      'Purify Food And Drink':
        'Level=P1',
      'Pyrotechnics':
        'Level=P3,W2',
      'Pyrotechnics P3':
        'Range="160\'"',
      'Quest':
        'Level=P5',
      'Raise Dead':
        'Level=P5',
      "Rary's Mnemonic Enhancer":
        'Level=W4',
      'Ray Of Enfeeblement':
        'Level=W2 ' +
        'Range="$L5plus10\'"',
      'Read Magic':
        'Level=W1 ' +
        'School="Lesser Divination"',
      'Regenerate':
        'Level=P7',
      'Reincarnate':
        'Level=P7',
      'Reincarnation':
        'Level=W6',
      'Remove Curse':
        'Level=P3,W4',
      'Remove Fear':
        'Level=P1 ' +
        'Effect="R10\' $Ldiv4plus1 targets"',
      'Repel Insects':
        'Level=P4',
      'Repulsion':
        'Level=W6',
      'Resist Cold':
        'Level=P2',
      'Resist Fire':
        'Level=P2',
      'Restoration':
        'Level=P7',
      'Resurrection':
        'Level=P7',
      'Reverse Gravity':
        'Level=W7 ' +
        'Duration="1 rd"',
      'Rope Trick':
        'Level=W2 ' +
        'Effect="8"',
      'Scare':
        'Level=W2 ' +
        'Duration="1d4 + $L rd" ' +
        'Range="$L10plus30\'"',
      'Sanctuary':
        'Level=P1 ' +
        'Effect="touched"',
      "Serten's Spell Immunity":
        'Level=W8 ' +
        'Description="Touched immune to specified spell for $L tn"',
      'Shades':
        'Level=W6',
      'Shadow Door':
        'Level=W5',
      'Shadow Magic':
        'Level=W5 ' +
        'Description="R$L10plus50\' Mimics spell level 1 - 3"',
      'Shadow Monsters':
        'Level=W4',
      'Shape Change':
        'Level=W9',
      'Shatter':
        'Level=W2 ' +
        'Range="$L10plus30\'"',
      'Shield':
        'Level=W1',
      'Shillelagh':
        'Level=P1 ' +
        'Duration="$Lplus4 rd"',
      'Shocking Grasp':
        'Level=W1',
      "Silence 15' Radius":
        'Level=P2',
      'Simulacrum':
        'Level=W7',
      'Sleep':
        'Level=W1 ' +
        'Range="30\'"',
      'Slow':
        'Level=W3',
      'Slow Poison':
        'Level=P2',
      'Snake Charm':
        'Level=P2',
      'Snare':
        'Level=P3',
      'Speak With Animals':
        'Level=P2',
      'Speak With Dead':
        'Level=P3',
      'Speak With Monsters':
        'Level=P6 ' +
        'Duration="$L2 rd"',
      'Speak With Plants':
        'Level=P4',
      'Spectral Force':
        'Level=W3 ' +
        'Range="$Lplus60\'"',
      'Spider Climb':
        'Level=W1 ' +
        'Duration="$Lplus3 rd"',
      'Spiritual Hammer':
        'Level=P2 ' +
        'Duration="$Lplus3 rd" ' +
        'Range="$L10\'"',
      'Statue':
        'Level=W7',
      'Sticks To Snakes':
        'Level=P4 ' +
        'Effect="1d4 + $L sticks in 10\' cu"',
      'Stinking Cloud':
        'Level=W2',
      'Stone Shape':
        'Level=P3,W5',
      'Stone Shape P3':
        'Effect="$Lplus3\' cu"',
      'Stone Tell':
        'Level=P6 ' +
        'School="Greater Divination"',
      'Stone To Flesh':
        'Level=W6',
      'Strength':
        'Level=W2',
      'Suggestion':
        'Level=W3',
      'Summon Insects':
        'Level=P3',
      'Summon Shadow':
        'Level=W5 ' +
        'Effect="$Ldiv3"',
      'Symbol':
        'Level=P7,W8',
      'Symbol P7':
        'Description="Glowing symbol causes hopelessness, pain, or persuasion for $L tn"',
      'Telekinesis':
        'Level=W5',
      'Teleport':
        'Level=W5',
      'Temporal Stasis':
        'Level=W9',
      "Tenser's Transformation":
        'Level=W6',
      "Tenser's Floating Disc":
        'Level=W1 ' +
        'Range="20\'"',
      'Time Stop':
        'Level=W9 ' +
        'Duration="1d3 rd"',
      'Tongues':
        'Level=P4,W3',
      'Tongues P4':
        'Duration="1 tn"',
      'Trap The Soul':
        'Level=W8',
      'Transmute Metal To Wood':
        'Level=P7 ' +
        'Effect="$L10 lb"',
      'Transmute Rock To Mud':
        'Level=P5,W5',
      'Transmute Rock To Mud P5':
        'Range="160\'"',
      'Transport Via Plants':
        'Level=P6',
      'Tree':
        'Level=P3',
      'Trip':
        'Level=P2 ' +
        'Effect="1 HP"',
      'True Seeing':
        'Level=P5,W6 ' +
        'School="Greater Divination" ' +
        'Effect="" ' +
        'Range="60\'"',
      'True Seeing P5':
        'Effect=", alignment auras" ' +
        'Range="40\'"',
      'Turn Wood':
        'Level=P6 ' +
        'Duration="$L rd"',
      'Unseen Servant':
        'Level=W1',
      'Vanish':
        'Level=W7',
      'Veil':
        'Level=W6',
      'Ventriloquism':
        'Level=W1',
      'Vision':
        'Level=W7 ' +
        'School="Greater Divination"',
      'Wall Of Thorns':
        'Level=P6 ' +
        'Effect="$L10\' cu"',
      'Water Breathing':
        'Level=P3,W3 ' +
        'Duration="1d4 + $L hr"',
      'Water Breathing P3':
        'Duration="$L hr"',
      'Wall Of Fire':
        'Level=P5,W4 ' +
        'Range="R60\' $L20\' sq wall or $L5div2plus10\' radius circle"',
      'Wall Of Fog':
        'Level=W1 ' +
        'Effect="$L10plus20\' cu"',
      'Wall Of Force':
        'Level=W5 ' +
        'Effect="$L10\' sq"',
      'Wall Of Ice':
        'Level=W4',
      'Wall Of Iron':
        'Level=W5',
      'Wall Of Stone':
        'Level=W5',
      'Warp Wood':
        'Level=P2',
      'Weather Summoning':
        'Level=P6',
      'Web':
        'Level=W2',
      'Wind Walk':
        'Level=P7',
      'Wish':
        'Level=W9',
      'Wizard Eye':
        'Level=W4',
      'Wizard Lock':
        'Level=W2',
      'Word Of Recall':
        'Level=P6',
      // New
      'Abjure':
        'Level=P4 ' +
        'School=Abjuration ' +
        'Description="R10\' Returns outsider to home plane 50%+HD delta"',
      'Advanced Illusion':
        'Level=W5 ' +
        'School=Illusion ' +
        'Description="R$L10plus60\' Creates $L10plus40\' sq sight, sound, smell, and temperature moving illusion for $L rd (Save disbelieve)"',
      'Aid':
        'Level=P2 ' +
        'School=Necromancy ' +
        'Description="Touched gains +1 attack and damage and +1d8 temporary HP for $Lplus1 rd"',
      'Air Walk':
        'Level=P5 ' +
        'School=Alteration ' +
        'Description="Touched walks on air for $Lplus6 tn"',
      'Alarm':
        'Level=W1 ' +
        'School=Abjuration ' +
        'Description="R10\' Entry into 20\' cu triggers audible alarm for $L30plus240 rd"',
      'Alter Self':
        'Level=W2 ' +
        'School=Alteration ' +
        'Description="Self takes on different humanoid form for 3d4 + $L2 rd"',
      'Armor':
        'Level=W1 ' +
        'School=Conjuration ' +
        'Description="Touched gains AC 6 for $Lplus8 HP"',
      'Avoidance':
        'Level=W5 ' +
        'School=Abjuration ' +
        'Description="R10\' 3\' cu target repels all but self"',
      'Banishment':
        'Level=W7 ' +
        'School=Abjuration ' +
        'Description="R20\' $L2 HD extraplanar creatures banished from plane (Save neg)"',
      'Bind':
        'Level=W2 ' +
        'School=Enchantment ' +
        'Description="R30\' $L5plus50\' rope-like item entangles or trips target (Save neg)"',
      'Binding':
        'Level=W8 ' +
        'School=Enchantment ' +
        'Description="R10\' Target magically imprisoned (Save neg)"',
      'Cantrip':
        'Level=W1 ' +
        'School=All ' +
        'Description="R10\' Self performs minor magical effects for $L hr"',
      'Changestaff':
        'Level=P7 ' +
        'School=Evocation ' +
        'Description="Touched staff becomes Treant (12 HD, 40 HP, AC 0)"',
      'Chain Lightning':
        'Level=W6 ' +
        'School=Evocation ' +
        'Description="R$L5plus40\' Bolt inflicts ${Lmin12}d6 HP down to 1d6 HP on $L targets (Save half)"',
      'Chill Touch':
        'Level=W1 ' +
        'School=Necromancy ' +
        'Description="Touched living suffer 1d4 HP and -1 Str (Save neg) or undead flee for 1d4 + $L rd for $Lplus3 rd"',
      'Cloak Of Bravery':
        'Level=P4 ' +
        'School=Conjuration ' +
        'Description="1 - 4 touched gain +4 - +1 on next save vs. fear (Reverse touched 3\' fear aura) for 8 hr"',
      'Combine':
        'Level=P1 ' +
        'School=Evocation ' +
        'Description="2 - 4 assistants give focus priest +2 - +4 level spellcasting and turning"',
      'Contagion':
        'Level=W4 ' +
        'School=Necromancy ' +
        'Description="R30\' Target suffers disease, -2 Strength, Dexterity, Charisma, and attack (Save neg)"',
      'Contingency':
        'Level=W6 ' +
        'School=Evocation ' +
        'Description="Sets trigger for level $Ldiv2min6 self spell for $L dy"',
      'Control Undead':
        'Level=W7 ' +
        'School=Necromancy ' +
        'Description="R20\' 1d6 undead totaling $L HD obey self for 3d4 + $L rd (Save 3 HD neg)"',
      'Crystalbrittle':
        'Level=W9 ' +
        'School=Alteration ' +
        'Description="Touched $L2\' cu becomes fragile"',
      'Cure Blindness Or Deafness':
        'Level=P3 ' +
        'School=Abjuration ' +
        'Description="Heals touched of blindness or deafness (Reverse inflicts, Save neg)"',
      'Death Fog':
        'Level=W6 ' +
        'School=Alteration ' +
        'Description="R30\' $L20\' fog kills plants, animals take 1, 2, 4, 8 HP for 1d4 + $L rd"',
      'Deeppockets':
        'Level=W2 ' +
        'School=Alteration ' +
        'Description="Touched garment carries 100 lbs comfortably for $Lplus12 hr"',
      'Delude':
        'Level=W3 ' +
        'School=Alteration ' +
        'Description="Self aura shows alignment of creature in 10\' radius for $L tn"',
      'Demand':
        'Level=W8 ' +
        'School=Evocation ' +
        'Description="Self sends 25-word message to target w/<i>Suggestion</i> (Save -2 neg)"',
      'Detect Poison':
        'Level=P1 ' +
        'School="Lesser Divination" ' +
        'Description="Self detects poison in target, $L5% to know type, for $Lplus10 rd"',
      'Detect Scrying':
        'Level=W4 ' +
        'School="Lesser Divination" ' +
        'Description="R120\' Self discerns scrying for 1d6 + $L tn"',
      'Detect Undead':
        'Level=W1 ' +
        'School="Lesser Divination" ' +
        'Description="60\'x$L10\' area gives self info on undead for 3 tn"',
      'Dismissal':
        'Level=W5 ' +
        'School=Abjuration ' +
        'Description="R10\' Returns outsider to home plane (Save +HD delta neg)"',
      'Domination':
        'Level=W5 ' +
        'School=Enchantment ' +
        'Description="R$L10\' Target obeys self thoughts until save"',
      'Dream':
        'Level=W5 ' +
        'School=Evocation ' +
        'Description="Touched sends message to sleeping target"',
      'Dust Devil':
        'Level=P2 ' +
        'School=Conjuration ' +
        'Description="R30\' Creates minor air elemental (AC 4, 2 HD, inflicts 1d4 HP) that attacks for $L2 rd"',
      'Endure Cold':
        'Level=P1 ' +
        'School=Alteration ' +
        'Description="Touched remains comfortable to -30F for $L30 min"',
      'Endure Heat':
        'Level=P1 ' +
        'School=Alteration ' +
        'Description="Touched remains comfortable to 130F for $L30 min"',
      'Energy Drain':
        'Level=W9 ' +
        'School=Evocation ' +
        'Description="Touched suffers -2 levels or HD"',
      'Enervation':
        'Level=W4 ' +
        'School=Necromancy ' +
        'Description="R$L10\' Target suffers -$Ldiv4 levels for 1d4 + $L hr (Save neg)"',
      'Ensnarement':
        'Level=W6 ' +
        'School=Conjuration ' +
        'Description="R10\' Entraps extra-planar creature"',
      'Enthrall':
        'Level=P2 ' +
        'School=Enchantment ' +
        'Description="R90\' Listeners up to 3 HD become captivated for conc or 1 hr (Save neg)"',
      "Evard's Black Tentacles":
        'Level=W4 ' +
        'School=Conjuration ' +
        'Description="R30\' Tentacles (AC 4, $L HP) in 30\' sq attack and inflict 2d4 - 3d4/rd for $L hr (Save suffer 1d4 HP)"',
      'Exaction':
        'Level=P7 ' +
        'School=Evocation ' +
        'Description="Demands service of extra-planar creature"',
      'Eyebite':
        'Level=W6 ' +
        'School=Enchantment ' +
        'Description="R20\' Self gains charm, fear, sicken, or sleep gaze attack for $Ldiv3 rd"',
      'Fabricate':
        'Level=W5 ' +
        'School=Enchantment ' +
        'Description="R$L5\' Creates $L3\' cu of finished items from raw materials"',
      'False Vision':
        'Level=W5 ' +
        'School="Greater Divination" ' +
        'Description="Scrying of 30\' radius shows illusion for 1d4 + $L rd"',
      'Flame Blade':
        'Level=P2 ' +
        'School=Evocation ' +
        'Description="Self wields flaming scimitar (inflicts 1d4+4 HP, +2 vs. vulnerable or undead) for $Ldiv2plus4 rd"',
      'Flame Walk':
        'Level=P3 ' +
        'School=Alteration ' +
        'Description="$Ldiv5plus1 touched gain immunity to non-magical fire and +2 saves and half dmg from magical fire for $Lplus1 rd"',
      'Flaming Sphere':
        'Level=W2 ' +
        'School=Evocation ' +
        'Description="R10\' 3\' radius sphere inflicts 2d4 HP (Save neg), moves 30\'/rd, for $L rd"',
      'Forbiddance':
        'Level=P6 ' +
        'School=Abjuration ' +
        'Description="R30\' $L60\' cu limits magical entry based on alignment and password"',
      'Forcecage':
        'Level=W7 ' +
        'School=Evocation ' +
        'Description="R$L5\' Creates 20\' cu of 1/2-inch-spaced bars for $Lplus6 tn"',
      'Foresight':
        'Level=W9 ' +
        'School="Greater Divination" ' +
        'Description="Self receives advance warning of harm to self or another for 2d4 + $L rd"',
      'Free Action':
        'Level=P4 ' +
        'School=Abjuration ' +
        'Description="Touched moves freely for $L tn"',
      'Giant Insect':
        'Level=P4 ' +
        'School=Alteration ' +
        'Description="R20\' 1 - 6 insects become ${lvl<10?3:lvl<13?4:6} HD giant versions"',
      'Glitterdust':
        'Level=W2 ' +
        'School=Conjuration ' +
        'Description="R10\' Creatures in 20\' cu lit and blind for 1d4 + 1 rd (Save neg) for 1d4 + $L rd"',
      'Grease':
        'Level=W1 ' +
        'School=Conjuration ' +
        'Description="R10\' 10\' sq becomes slippery, causing falls (Save neg) for $Lplus3 rd"',
      'Goodberry':
        'Level=P2 ' +
        'School=Alteration ' +
        'Description="2d4 berries provide full meal and heal 1 HP (Reverse 1 HP poison) for $Lplus1 day"',
      "Heroes' Feast":
        'Level=P6 ' +
        'School=Evocation ' +
        'Description="R10\' Food for $L creatures cures disease, heals 1d4+4 HP, gives +1 attack and immunity to poison and fear for 12 hr"',
      'Hold Undead':
        'Level=W3 ' +
        'School=Necromancy ' +
        'Description="R60\' Immobilizes 1 - 3 targets (Save neg) totaling $L HD for 1d4 + $L rd"',
      'Illusionary Wall':
        'Level=W4 ' +
        'School=Illusion ' +
        'Description="R30\' Creates false 10\' sq wall, floor, or ceiling"',
      'Imbue With Spell Ability':
        'Level=P4 ' +
        'School=Enchantment ' +
        'Description="Transfers divination or cure spellcasting to touched level 1 - 2 (1 1st), 3 - 4 (2 1st) or 5+ (2 1st and 1 2nd) non-caster"',
      'Invisibility To Undead':
        'Level=P1 ' +
        'School=Abjuration ' +
        'Description="Touched becomes undetectable by undead (Save 5 HD neg) for 6 rd"',
      'Irritation':
        'Level=W2 ' +
        'School=Alteration ' +
        'Description="RL10\' 1 - 4 targets in 15\' radius itch (-4 AC, -2 attack) for 3 rd or develop rash (-1 Charisma/dy) for 4 dy (Save neg)"',
      'Item':
        'Level=W3 ' +
        'School=Alteration ' +
        'Description="Shrinks touched $L2\' cu item to 1/12 size cloth for $L4 hr"',
      "Leomund's Lamentable Belaborment":
        'Level=W5 ' +
        'School=Enchantment ' +
        'Description="R10\' Targets in 10\' radius absorbed in conversation for 3 - 6 rd (Save neg; fail on rd 3 wander away, fail on rd 6 rage attack for 1d4 + 1 rd)"',
      "Leomund's Secure Shelter":
        'Level=W4 ' +
        'School=Alteration ' +
        'Description="R20\' Creates $L30\' sq shelter that lasts 1d4 + $Lplus1 hr"',
      'Liveoak':
        'Level=P6 ' +
        'School=Enchantment ' +
        'Description="Oak tree guards (S 7 - 8 HD, 2d8 dmg; M 9 - 10 HD, 3d6 dmg; L 11 - 12 HD, 4d6 dmg) based on $L-word command for $L dy"',
      'Locate Animals Or Plants':
        'Level=P1 ' +
        'School="Lesser Divination" ' +
        'Description="R$L20plus100\' Self discerns presence of animal or plant type in 20\' path for $L rd"',
      "Mordenkainen's Lucubration":
        'Level=W6 ' +
        'School=Alteration ' +
        'Description="Self recalls spell up to 5th level from past day"',
      'Magic Font':
        'Level=P5 ' +
        'School="Greater Divination" ' +
        'Description="Self scrys via touched holy water font for 1 hr/vial"',
      'Magic Mirror':
        'Level=W4 ' +
        'School=Enchantment ' +
        'Description="Touched mirror becomes scrying device for $L rd"',
      'Magical Stone':
        'Level=P1 ' +
        'School=Enchantment ' +
        'Description="Touched 3 pebbles become magical, inflict 1d4 HP, 2d4 HP vs. undead, for 30 min"',
      'Magical Vestment':
        'Level=P3 ' +
        'School=Enchantment ' +
        'Description="Touched vestment gives AC ${7-Math.floor((lvl+1)/3)} for $L5 rd"',
      'Meld Into Stone':
        'Level=P3 ' +
        'School=Alteration ' +
        'Description="Self passes into stone for 1d8 + 8 rd"',
      "Melf's Acid Arrow":
        'Level=W2 ' +
        'School=Conjuration ' +
        'Description="R180\' Inflicts 2d4 HP/rd for $Ldiv3plus1 rd"',
      "Melf's Minute Meteors":
        'Level=W3 ' +
        'School=Evocation ' +
        'Description="R$L10plus70\' $L +2 ranged globes inflict 1d4 HP"',
      'Messenger':
        'Level=P2 ' +
        'School=Enchantment ' +
        'Description="R$L20\' Tiny animal target goes to specified place for $L dy"',
      'Mirage Arcana':
        'Level=W6 ' +
        'School=Illusion ' +
        'Description="R$L10\' Creates $L10\' radius terrain or structure illusion for conc + $Lplus6 tn"',
      'Mislead':
        'Level=W6 ' +
        'School=Illusion ' +
        'Description="R10\' Makes self invisible for $L rd and creates false double for $L rd"',
      'Moonbeam':
        'Level=P5 ' +
        'School=Evocation ' +
        'Description="R$L10plus60\' 5\' radius shines with moonlight for $L rd"',
      "Mordenkainen's Disjunction":
        'Level=W9 ' +
        'School=Alteration ' +
        'Description="R30\' Dispels spells, disenchants magic items, $L% chance to disenchant artifacts or destroy antimagic field"',
      "Mordenkainen's Magnificent Mansion":
        'Level=W7 ' +
        'School=Alteration ' +
        'Description="R10\' Creates door to extradimensional mansion for $L hr"',
      'Mount':
        'Level=W1 ' +
        'School=Conjuration ' +
        'Description="R10\' Summons riding horse for $Lplus2 hr"',
      'Negative Plane Protection':
        'Level=P3 ' +
        'School=Abjuration ' +
        'Description="Touched gains save vs. death magic on next draining attack"',
      "Otiluke's Resilient Sphere":
        'Level=W4 ' +
        'School=Alteration ' +
        'Description="R20\' Impassible $L\'-diameter sphere surrounds target for $L rd (Save neg)"',
      "Otiluke's Telekinetic Sphere":
        'Level=W8 ' +
        'School=Evocation ' +
        'Description="R20\' Impassible $L\'-diameter sphere surrounds target and causes weightlessness for $L2 rd (Save neg)"',
      'Phantom Steed':
        'Level=W3 ' +
        'School=Conjuration ' +
        'Description="Creates mount ($Lplus7 HP, AC 2, MV $L4min48\') that only touched can ride for $L hr"',
      'Protection From Cantrips':
        'Level=W2 ' +
        'School=Abjuration ' +
        'Description="Touched gains immunity to cantrips for $Lplus5 hr"',
      'Rainbow':
        'Level=P5 ' +
        'School=Evocation ' +
        'Description="R120\' Creates magical +2 bow or 1x120 yd bridge for $L rd"',
      'Rainbow Pattern':
        'Level=W4 ' +
        'School=Alteration ' +
        'Description="R10\' Fascinates 24 HD of creatures in 30\' cu for conc (Save neg)"',
      'Reflecting Pool':
        'Level=P4 ' +
        'School="Lesser Divination" ' +
        'Description="R10\' Self uses pool to scry for $L rd"',
      'Remove Paralysis':
        'Level=P3 ' +
        'School=Abjuration ' +
        'Description="R$L10\' Frees 1d4 targets in 20\' cu from magical paralysis"',
      'Screen':
        'Level=W8 ' +
        'School="Greater Divination" ' +
        'Description="Illusion hides 30\' cu from vision and scrying for $L hr"',
      'Secret Page':
        'Level=W3 ' +
        'School=Alteration ' +
        'Description="Hides content of touched page permanently"',
      'Seeming':
        'Level=W5 ' +
        'School=Illusion ' +
        'Description="R10\' Appearance of $Ldiv2 targets changes for 12 hr"',
      'Sending':
        'Level=W5 ' +
        'School=Evocation ' +
        'Description="Self has two-way, 25-word exchange familiar target"',
      'Sepia Snake Sigil':
        'Level=W3 ' +
        'School=Conjuration ' +
        'Description="Immobilizes reader for 1d4 + $L dy"',
      'Sequester':
        'Level=W7 ' +
        'School=Illusion ' +
        'Description="Touched becomes invisible and unscryable for $Lplus7 dy (Save neg)"',
      'Shadow Walk':
        'Level=W7 ' +
        'School=Illusion ' +
        'Description="Self and touched move 7 miles/tn via Demiplane of Shadow for $L hr"',
      'Shout':
        'Level=W4 ' +
        'School=Evocation ' +
        'Description="R30\' Cone inflicts 2d6 HP and deafness for 2d6 rd (Save no damage and half duration)"',
      'Sink':
        'Level=W8 ' +
        'School=Enchantment ' +
        'Description="R$L10\' Target becomes embedded in floor (Save neg)"',
      'Solid Fog':
        'Level=W4 ' +
        'School=Alteration ' +
        'Description="R30\' Fog in $L10\' cu slows and reduces vision to 2\' for 2d4 + $L rd"',
      'Spell Immunity':
        'School=Abjuration ' +
        'Level=P4 ' +
        'Description="Touched gains immunity to specified spell for $L tn"',
      'Spike Growth':
        'Level=P3 ' +
        'School=Alteration ' +
        'Description="R60\' Spikes on vegetation in $L10\' sq inflict 2d4 HP each 10\' movement and slow to half speed for 1 dy (Save neg) for 3d4 + $L tn"',
      'Spike Stones':
        'Level=P5 ' +
        'School=Alteration ' +
        'Description="R30\' Sharp stones in $L10\' sq inflict 1d4 HP/rd for 3d4 + $L tn"',
      'Spectral Hand':
        'Level=W2 ' +
        'School=Necromancy ' +
        'Description="R$L5plus30 Glowing hand delivers +2 touch attacks for $L2 rd"',
      'Spell Turning':
        'Level=W7 ' +
        'School=Abjuration ' +
        'Description="Non-area, non-touch spells aimed at self reflect onto caster for $L3 rd"',
      'Spook':
        'Level=W1 ' +
        'School=Illusion ' +
        'Description="R10\' Target flees from self (Save neg)"',
      'Starshine':
        'Level=P3 ' +
        'School=Evocation ' +
        'Description="R$L10\' Creates soft illumination in $L10\' sq for $L tn"',
      'Stoneskin':
        'Level=W4 ' +
        'School=Alteration ' +
        'Description="Touched gains immunity to next 1d4 + $Ldiv2 blows"',
      'Succor':
        'Level=P7,W9 ' +
        'School=Alteration ' +
        'Description="Breaking item transports target to self home"',
      'Summon Swarm':
        'Level=W2 ' +
        'School=Conjuration ' +
        'Description="R60\' Calls vermin that inflict 1 HP/rd to 10\' cu for conc + 2 rd"',
      'Sunray':
        'Level=P7 ' +
        'School=Evocation ' +
        'Description="R10\' 5\' radius blinds 1d3 rd and inflicts 8d6 HP on undead (3d6 within 20\') for 2 - 5 rd"',
      "Tasha's Uncontrollable Hideous Laughter":
        'Level=W2 ' +
        'School=Enchantment ' +
        'Description="R60\' $Ldiv3 targets in 30\' cu suffer -2 attack and damage for $L rd"',
      'Taunt':
        'Level=W1 ' +
        'School=Enchantment ' +
        'Description="R60\' Targets in 30\' radius attack caster"',
      'Teleport Without Error':
        'Level=W7 ' +
        'School=Alteration ' +
        'Description="Instantly transports self + ${250+Math.max(lvl-10,0)*150} lb to known location"',
      'Transmute Water To Dust':
        'Level=W6,P6 ' +
        'School=Alteration ' +
        'Description="R60\' $E water becomes powder" ' +
        'Effect="$L10\' cu"',
      'Transmute Water To Dust P6':
        'Effect="$L3\' cu"',
      'Vacancy':
        'Level=W4 ' +
        'School=Illusion ' +
        'Description="R$L10\' $L10\' radius appears abandoned for $L hr"',
      'Vampiric Touch':
        'Level=W3 ' +
        'School=Necromancy ' +
        'Description="Touched suffers ${Ldiv2min6}d6 HP, self gains same as temporary HP for 1 hr"',
      'Water Walk':
        'Level=P3 ' +
        'School=Alteration ' +
        'Description="$Lminus4 touched walk on liquid as if it were a solid surface for $Lplus1 tn"',
      'Weird':
        'Level=W9 ' +
        'School=Illusion ' +
        'Description="R30\' Targets in 20\' radius fight illusionary nemeses to death (Save become paralyzed 1 rd and suffer -1d4 Str for 1 tn)"',
      'Whispering Wind':
        'Level=W2 ' +
        'School=Alteration ' +
        'Description="R$L miles Self sends 25-word message or sound to known location"',
      'Wind Wall':
        'Level=W3 ' +
        'School=Alteration ' +
        'Description="R$L10\' $L10\'x5\' curtain of air scatters objects, deflects arrows and bolts for $L rd"',
      'Withdraw':
        'Level=P2 ' +
        'School=Alteration ' +
        'Description="Self gains $Lplus1 rd extra time to cast divination or self cure"',
      'Wizard Mark':
        'Level=W1 ' +
        'School=Alteration ' +
        'Description="Permanent personal rune inscribed on touched"',
      'Wraithform':
        'Level=W3 ' +
        'School=Alteration ' +
        'Description="Self becomes insubstantial and immune to non-magical weapons for $L2 rd"',
      'Wyvern Watch':
        'Level=P2 ' +
        'School=Evocation ' +
        'Description="R30\' Paralyzes first trespasser in 10\' radius for $L rd (Save neg)"'
    },
    'Weapon':{
      // Removed
      'Bo Stick':null,
      "Footman's Military Pick":null,
      'Hammer':null,
      "Horseman's Military Pick":null,
      'Jo Stick':null,
      'Quarter Staff':null,
      // Modified
      'Dart':'Range=10',
      'Heavy Horse Lance':'Category=1h Damage=d8+1',
      // New
      'Arquebus':'Category=R Damage=d10 Range=50',
      'Awl Pike':'Category=2h Damage=d6',
      'Blowgun':'Category=R Damage=d3 Range=10',
      "Footman's Pick":'Category=1h Damage=d6+1',
      'Hand Crossbow':'Category=R Damage=d3 Range=20',
      'Harpoon':'Category=R Damage=2d4 Range=10',
      "Horseman's Pick":'Category=Li Damage=d4+1',
      'Knife':'Category=Li Damage=d3 Range=10',
      'Jousting Lance':'Category=1h Damage=d3-1',
      'Hook Fauchard':'Category=2h Damage=d4',
      'Khopesh':'Category=1h Damage=2d4',
      'Mancatcher':'Category=2h Damage=d0',
      'Quarterstaff':'Category=2h Damage=d6',
      'Scourge':'Category=1h Damage=d4',
      'Sickle':'Category=1h Damage=d4+1',
      'Staff Sling':'Category=R Damage=d4+1 Range=30',
      'Warhammer':'Category=Li Damage=d4+1 Range=10',
      'Whip':'Category=1h Damage=d2'
    },
  }
};

// Related information used internally by OldSchool
OldSchool.monkUnarmedDamage = [
  '0', '1d3', '1d4', '1d6', '1d6', '1d6+1', '2d4', '2d4+1', '2d6', '3d4',
  '2d6+1', '3d4+1', '4d4', '4d4+1', '5d4', '6d4', '5d6', '8d4'
];

/*
 * Uses the OldSchool.RULE_EDIT rules for #type# for the current edition
 * to modify the values in #base# and returns the result. Each value listed
 * in the edit rules can use = or +=,to indicate whether the new values
 * should replace or be added to the values in #base#.
 */
OldSchool.editedRules = function(base, type) {
  var edits = OldSchool.RULE_EDITS[OldSchool.EDITION][type];
  if(!edits)
    return base;
  var result = Object.assign({}, base);
  for(var a in edits) {
    if(edits[a] == null)
      delete result[a];
    else if(!(a in base))
      result[a] = edits[a];
    else {
      var matchInfo = edits[a].match(/[A-Z]\w*[-+]?=/g);
      for(var i = 0; i < matchInfo.length; i++) {
        var op = matchInfo[i].match(/\W+$/)[0];
        var attr = matchInfo[i].replace(op, '');
        var values =
          // .replace allows getAttrValueArray work with +=
          QuilvynUtils.getAttrValueArray(edits[a].replace(/\+=/g, '='), attr);
        for(var j = 0; j < values.length; j++) {
          if(!(values[j] + '').match(/^[-+]?\d+$/))
            values[j] = '"' + values[j] + '"';
        }
        var valuesText = values.join(',');
        if(op == '=') {
          // getAttrValue[Array] will pick up the last definition, so appending
          // the replacement is sufficient
          result[a] += ' ' + attr + '=' + valuesText;
        } else { // +=
          result[a] =
            result[a].replace(attr + '=', attr + '=' + valuesText + ',');
        }
      }
    }
  }
  return result;
};

/* Defines rules related to character abilities. */
OldSchool.abilityRules = function(rules) {

  // Charisma
  rules.defineRule('abilityNotes.charismaLoyaltyAdjustment',
    'charisma', '=',
    'source <= 8 ? source * 5 - 45 : source <= 13 ? null : ' +
    'source <= 15 ? source * 10 - 135 : (source * 10 - 140)'
  );
  rules.defineRule('maximumHenchmen',
    'charisma', '=',
    'source<=10 ? Math.floor((source-1)/2) : source<=12 ? (source-7) : ' +
    'source<=16 ? (source-8) : ((source-15)* 5)'
  );
  rules.defineRule('abilityNotes.charismaReactionAdjustment',
    'charisma', '=',
    'source <= 7 ? (source * 5 - 40) : source <= 12 ? null : ' +
    'source <= 15 ? source * 5 - 60 : (source * 5 - 55)'
  );
  if(OldSchool.EDITION == 'Second Edition') {
    // Expressed as mod to d20 instead of percentage
    rules.defineRule('abilityNotes.charismaLoyaltyAdjustment', '', '*', '0.2');
    rules.defineRule('abilityNotes.charismaReactionAdjustment', '', '*', '0.2');
  }

  // Constitution
  rules.defineRule('conHPAdjPerDie',
    'constitution', '=',
      'source<=3 ? -2 : source<=6 ? -1 : source<=14 ? null : (source - 14)',
    'warriorLevel', 'v', 'source == 0 ? 2 : null'
  );
  if(OldSchool.EDITION == 'Second Edition')
    rules.defineRule('saveNotes.constitutionPoisonSaveAdjustment',
      'constitution', '=', 'source>18 ? "+" + Math.floor((source - 17) / 2) : source<3 ? source - 3 : null',
      'features.Resist Poison', '=', '0'
    );
  rules.defineRule('surviveResurrection',
    'constitution', '=',
    'source <= 13 ? source * 5 + 25 : source <= 18 ? source * 2 + 64 : 100'
  );
  rules.defineRule('surviveSystemShock',
    'constitution', '=',
    'source <= 13 ? source * 5 + 20 : source == 16 ? 95 : ' +
    (OldSchool.EDITION == 'Second Edition' ? 'source == 15 ? 90 : ' : '') +
    'source <= 17 ? source * 3 + 46 : 99'
  );
  rules.defineRule('combatNotes.constitutionHitPointsAdjustment',
    'conHPAdjPerDie', '=', null,
    'hitDice', '*', null
  );
  rules.defineRule('hitPoints',
    'combatNotes.constitutionHitPointsAdjustment', '+', null,
    'hitDice', '^', null
  );

  // Dexterity
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'dexterity', '=',
    'source <= 6 ? (7 - source) : source <= 14 ? null : ' +
    'source <= 18 ? 14 - source : -4'
  );
  rules.defineRule('combatNotes.dexterityAttackAdjustment',
    'dexterity', '=',
    (OldSchool.EDITION == 'Second Edition' ? 'source == 18 ? 2 : ' : '') +
    'source <= 5 ? (source - 6) : source <= 15 ? null : ' +
    'source <= 18 ? source - 15 : 3'
  );
  rules.defineRule('combatNotes.dexteritySurpriseAdjustment',
    'dexterity', '=',
    (OldSchool.EDITION == 'Second Edition' ? 'source == 18 ? 2 : ' : '') +
    'source <= 5 ? (source - 6) : source <= 15 ? null : ' +
    'source <= 18 ? source - 15 : 3'
  );
  rules.defineRule('skillNotes.dexteritySkillModifiers',
    'dexterity', '=',
      '[' +
        'source<11 ? "-10% Find Traps" : "",' +
        'source==11 ? "-5% Find Traps" : "",' +
        'source>17 ? "+" + (source - 17) * 5 + "% Find Traps" : "",' +
        'source<11 ? (source - 11) * 5 + "% Hide In Shadows" : "",' +
        'source>16 ? "+" + (source - 16) * 5 + "% Hide In Shadows" : "",' +
        'source<13 ? (source - 13) * 5 + "% Move Silently" : "",' +
        'source>16 ? "+" + (source - 16) * 5 + "% Move Silently" : "",' +
        'source<11 ? (source - 11) * 5 + "% Open Locks" : "",' +
        'source>15 ? "+" + (source - 15) * 5 + "% Open Locks" : "",' +
        'source<12 ? (source - 12) * 5 + "% Pick Pockets" : "",' +
        'source>16 ? "+" + (source - 16) * 5 + "% Pick Pockets" : "",' +
      '].filter(x => x != "").join("/")'
  );
  rules.defineRule
    ('skillNotes.dexteritySkillModifiers', 'sumThiefSkills', '?', '1');

  // Intelligence
  if(OldSchool.EDITION == 'Second Edition') {
    rules.defineRule('skillNotes.intelligenceLanguageBonus',
      'intelligence', '=',
        'source<9 ? 1 : source == 9 ? 2 : source<=15 ? Math.floor((source-6)/2) : (source-11)'
    );
  } else {
    rules.defineRule('skillNotes.intelligenceLanguageBonus',
      'intelligence', '=',
        'source<=7 ? null : source<=15 ? Math.floor((source-6)/2) : (source-11)'
    );
  }
  rules.defineRule
    ('languageCount', 'skillNotes.intelligenceLanguageBonus', '+', null);


  // Strength
  rules.defineRule('combatNotes.strengthAttackAdjustment',
    'strengthRow', '=', 'source <= 2 ? (source - 3) : ' +
                        'source <= 7 ? 0 : Math.floor((source - 5) / 3)'
  );
  rules.defineRule('combatNotes.strengthDamageAdjustment',
    'strengthRow', '=', 'source <= 1 ? -1 : source <= 6 ? 0 : ' +
                        'source == 7 ? 1 : (source - (source >= 11 ? 8 : 7))'
  );
  if(OldSchool.EDITION == 'Second Edition') {
    rules.defineRule('loadLight',
      'strengthRow', '=', '[6, 11, 21, 36, 41, 46, 56, 71, 86, 111, 136, 161, 186, 236, 336][source]'
    );
    rules.defineRule('loadMedium',
      'strengthRow', '=', '[7, 14, 30, 51, 59, 70, 86, 101, 122, 150, 175, 200, 225, 275, 375][source]'
    );
    rules.defineRule('loadMax',
      'strengthRow', '=', '[8, 17, 39, 66, 77, 94, 116, 131, 158, 189, 214, 239, 264, 314, 414][source]'
    );
  } else {
    rules.defineRule('loadLight',
      'strengthRow', '=', '[0, 10, 20, 35, 35, 45, 55, 70, 85, 110, 135, 160, 185, 235, 335][source]'
    );
    rules.defineRule('loadMedium', 'loadLight', '=', 'source + 35');
    rules.defineRule('loadMax', 'loadMedium', '=', 'source + 35');
  }
  rules.defineRule('speed',
    '', '=', '120',
    'abilityNotes.armorSpeedMaximum', 'v', null
  );
  rules.defineRule('strengthMajorTest',
    'strengthRow', '=', 'source <= 2 ? 0 : ' +
                        'source <= 5 ? Math.pow(2, source - 3) : ' +
                        'source <= 9 ? source * 3 - 11 : (source * 5 - 30)'
  );
  if(OldSchool.EDITION == 'Second Edition') {
    rules.defineRule('strengthMinorTest', 'strengthRow', '=', 'source + 2');
  } else {
    rules.defineRule('strengthMinorTest',
      'strengthRow', '=', 'source == 14 ? 5 : Math.floor((source + 5) / 4)'
    );
  }
  rules.defineRule('strengthRow',
    'strength', '=', 'source >= 16 ? source - 9 : Math.floor((source - 2) / 2)',
    'extraStrength', '+', 'source <= 50 ? 1 : source <= 75 ? 2 : ' +
                          'source <= 90 ? 3 : source <= 99 ? 4 : 5'
  );
  rules.defineChoice('notes',
    'validationNotes.extraStrength:Characters with strength less than 18 cannot have extra strength',
    'validationNotes.extraStrengthClass:Only fighters, paladins, and rangers may have extra strength',
    'validationNotes.extraStrengthRange:Extra strength value must be in the range 1..100'
  );
  rules.defineRule('validationNotes.extraStrength',
    'extraStrength', '?', null,
    'strength', '=', 'source==18 ? null : 1'
  );
  rules.defineRule('validationNotes.extraStrengthClass',
    'extraStrength', '=', '1',
    'levels.Fighter', 'v', '0',
    'levels.Paladin', 'v', '0',
    'levels.Ranger', 'v', '0'
  );
  rules.defineRule('validationNotes.extraStrengthRange',
    'extraStrength', '=', 'source>=1 && source<=100 ? null : 1'
  );

  // Wisdom
  rules.defineRule('saveNotes.wisdomMentalSavingThrowAdjustment',
    'wisdom', '=',
      'source<=5 ? (source-6) : source<=7 ? -1 : source<=14 ? null : ' +
      'Math.min(source-14, 4)'
  );

};

/* Defines rules related to combat. */
OldSchool.combatRules = function(rules, armors, shields, weapons) {

  QuilvynUtils.checkAttrTable(armors, ['AC', 'Move', 'Weight', 'Skill']);
  QuilvynUtils.checkAttrTable(shields, ['AC', 'Weight']);
  QuilvynUtils.checkAttrTable(weapons, ['Category', 'Damage', 'Range']);

  for(var armor in armors) {
    rules.choiceRules(rules, 'Armor', armor, armors[armor]);
  }
  for(var shield in shields) {
    rules.choiceRules(rules, 'Shield', shield, shields[shield]);
  }
  for(var weapon in weapons) {
    var pattern = weapon.replace(/  */g, '\\s+');
    var prefix =
      weapon.charAt(0).toLowerCase() + weapon.substring(1).replaceAll(' ', '');
    rules.choiceRules(rules, 'Goody', weapon,
      // To avoid triggering additional weapons with a common suffix (e.g.,
      // "* punching dagger +2" also makes regular dagger +2), require that
      // weapon goodies with a trailing value have no preceding word or be
      // enclosed in parentheses.
      'Pattern="([-+]\\d)\\s+' + pattern + '|(?:^\\W*|\\()' + pattern + '\\s+([-+]\\d)" ' +
      'Effect=add ' +
      'Attribute=' + prefix + 'AttackModifier,' + prefix + 'DamageModifier ' +
      'Value="$1 || $2" ' +
      'Section=combat Note="%V Attack and damage"'
    );
    rules.choiceRules(rules, 'Weapon', weapon, weapons[weapon]);
  }

  rules.defineRule
    ('armorClass', 'combatNotes.dexterityArmorClassAdjustment', '+', null);
  rules.defineRule('attacksPerRound', '', '=', '1');
  rules.defineRule('combatNotes.weaponSpecialization',
    'weaponSpecialization', '=', 'source == "None" ? null : source'
  );
  if(OldSchool.EDITION == 'Second Edition') {
    rules.defineRule('combatNotes.weaponSpecialization.1',
      'weaponSpecialization', '=', 'source.match(/bow/i) ? 2 : 1'
    );
    rules.defineRule('combatNotes.weaponSpecialization.2',
      'weaponSpecialization', '=', 'source.match(/bow/i) ? 0 : 2'
    );
    rules.defineRule('combatNotes.weaponSpecialization.3',
      'weaponSpecialization', '=',
        'source == "None" ? null : source.indexOf("Crossbow") >= 0 ? -0.5 : 0',
      'levels.Fighter', '+', 'source < 7 ? 0.5 : source < 13 ? 1 : 1.5'
    );
    QuilvynRules.prerequisiteRules
      (rules, 'validation', 'weaponSpecialization',
       'combatNotes.weaponSpecialization', 'levels.Fighter >= 1');
  } else {
    rules.defineRule
      ('combatNotes.weaponSpecialization.1', 'weaponSpecialization', '=', '1');
    rules.defineRule
      ('combatNotes.weaponSpecialization.2', 'weaponSpecialization', '=', '2');
    rules.defineRule('combatNotes.weaponSpecialization.3',
      'weaponSpecialization', '?', 'source != "None"',
      'level', '=', 'Math.floor(source / 2)'
    );
  }
  rules.defineRule
    ('features.Weapon Specialization', 'weaponSpecialization', '=', null);
  // Initial baseAttack value for classless characters, set lower than the
  // level 1 base attack value for any class.
  rules.defineRule('baseAttack', '', '=', '-2');
  rules.defineRule('meleeAttack', 'baseAttack', '=', null);
  rules.defineRule('rangedAttack', 'baseAttack', '=', null);
  rules.defineRule('thac0Melee',
    'meleeAttack', '=', 'Math.min(20 - source, 20)',
    'combatNotes.strengthAttackAdjustment', '+', '-source'
  );
  rules.defineRule('thac0Ranged',
    'rangedAttack', '=', 'Math.min(20 - source, 20)',
    'combatNotes.dexterityAttackAdjustment', '+', '-source'
  );
  rules.defineRule('thac10Melee',
    'meleeAttack', '=', '10 - source',
    'combatNotes.strengthAttackAdjustment', '+', '-source'
  );
  rules.defineRule('thac10Ranged',
    'rangedAttack', '=', '10 - source',
    'combatNotes.dexterityAttackAdjustment', '+', '-source'
  );
  if(OldSchool.EDITION == 'Second Edition')
    rules.defineRule('turnUndeadColumn',
      'turningLevel', '=',
      'source <= 9 ? source : source <= 11 ? 10 : source <= 13 ? 11 : 12'
    );
  else
    rules.defineRule('turnUndeadColumn',
      'turningLevel', '=',
      'source <= 8 ? source : source <= 13 ? 9 : source <= 18 ? 10 : 11'
    );
  var turningTable = OldSchool.EDITION == 'Second Edition' ? [
    'skeleton:10:7 :4 :T :T :D :D :D :D :D :D :D ',
    'zombie  :13:10:7 :4 :T :T :D :D :D :D :D :D ',
    'ghoul   :16:13:10:7 :4 :T :T :D :D :D :D :D ',
    'shadow  :19:16:13:10:7 :4 :T :T :D :D :D :D ',
    'wight   :20:19:16:13:10:7 :4 :T :T :D :D :D ',
    'ghast   :- :20:19:16:13:10:7 :4 :T :T :D :D ',
    'wraith  :- :- :20:19:16:13:10:7 :4 :T :T :D ',
    'mummy   :- :- :- :20:19:16:13:10:7 :4 :T :T ',
    'spectre :- :- :- :- :20:19:16:13:10:7 :4 :T ',
    'vampire :- :- :- :- :- :20:19:16:13:10:7 :4 ',
    'ghost   :- :- :- :- :- :- :20:19:16:13:10:7 ',
    'lich    :- :- :- :- :- :- :- :20:19:16:13:10',
    'fiend   :- :- :- :- :- :- :- :- :20:19:16:13'
  ] : [
    'skeleton:10:7 :4 :T :T :D :D :D :D :D :D',
    'zombie  :13:10:7 :T :T :D :D :D :D :D :D',
    'ghoul   :16:13:10:4 :T :T :D :D :D :D :D',
    'shadow  :19:16:13:7 :4 :T :T :D :D :D :D',
    'wight   :20:19:16:10:7 :4 :T :T :D :D :D',
    'ghast   :- :20:19:13:10:7 :4 :T :T :D :D',
    'wraith  :- :- :20:16:13:10:7 :4 :T :D :D',
    'mummy   :- :- :- :20:16:13:10:7 :4 :T :T',
    'spectre :- :- :- :- :20:16:13:10:7 :T :T',
    'vampire :- :- :- :- :- :20:16:13:10:4 :4',
    'ghost   :- :- :- :- :- :- :20:16:13:7 :7',
    'lich    :- :- :- :- :- :- :- :19:16:10:10',
    'fiend   :- :- :- :- :- :- :- :20:19:13:13'
  ];
  for(var i = 0; i < turningTable.length; i++) {
    rules.defineRule('turnUndead.' + turningTable[i].split(':')[0].trim(),
      'turnUndeadColumn', '=', '"' + turningTable[i] +'".split(":")[source].trim()'
    );
  }
  rules.defineRule
    ('skillNotes.armorSkillModifiers', 'sumThiefSkills', '?', '1');
  // Replace SRD35's two-handedWeapon validation note
  delete rules.choices.notes['validationNotes.two-handedWeapon'];
  rules.defineChoice
    ('notes', 'validationNotes.two-handedWeapon:Requires shield == "None"');
  rules.defineRule('weapons.Unarmed', '', '=', '1');
  rules.defineRule('weaponProficiencyCount', 'weapons.Unarmed', '=', '1');
  rules.defineRule('weaponProficiency.Unarmed', 'weapons.Unarmed', '=', '1');

};

/* Defines rules related to basic character identity. */
OldSchool.identityRules = function(rules, alignments, classes, races) {

  QuilvynUtils.checkAttrTable(alignments, []);
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitDie', 'Attack', 'WeaponProficiency', 'NonweaponProficiency', 'Breath', 'Death', 'Petrification', 'Spell', 'Wand', 'Features', 'Selectables', 'Experience', 'CasterLevelArcane', 'CasterLevelDivine', 'SpellAbility', 'SpellSlots']);
  QuilvynUtils.checkAttrTable(races, ['Require', 'Features', 'Selectables', 'Languages']);

  for(var alignment in alignments) {
    rules.choiceRules(rules, 'Alignment', alignment, alignments[alignment]);
  }
  for(var clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
  }
  for(var race in races) {
    rules.choiceRules(rules, 'Race', race, races[race]);
  }

  // Rules that apply to multiple classes or races
  rules.defineRule('casterLevel',
    'casterLevelArcane', '=', null,
    'casterLevelDivine', '+=', null
  );
  rules.defineRule
    ('combatNotes.fightingTheUnskilled', 'warriorLevel', '+=', null);
  rules.defineRule('level', /^levels\./, '+=', null);
  rules.defineRule
    ('saveNotes.resistMagic', 'constitution', '=', 'Math.floor(source / 3.5)');
  rules.defineRule
    ('saveNotes.resistPoison', 'constitution', '=', 'Math.floor(source / 3.5)');
  rules.defineRule('warriorLevel', '', '=', '0');
  QuilvynRules.validAllocationRules
    (rules, 'weaponProficiency', 'weaponProficiencyCount', 'Sum "^weaponProficiency\\."');
  rules.defineRule('validationNotes.weaponProficiencyAllocation.2',
    'weaponSpecialization', '+', 'source == "None" ? null : 1',
    'doubleSpecialization', '+', 'source ? 1 : null'
  );

};

/* Defines rules related to magic use. */
OldSchool.magicRules = function(rules, schools, spells) {

  QuilvynUtils.checkAttrTable(schools, ['Features']);
  QuilvynUtils.checkAttrTable
    (spells, ['School', 'Level', 'Description', 'Effect', 'Duration', 'Range']);

  for(var school in schools) {
    rules.choiceRules(rules, 'School', school, schools[school]);
  }
  for(var level = 1; level <= 9; level++) {
    rules.defineRule
      ('spellSlots.W' + level, 'magicNotes.schoolSpecialization', '+', '1');
  }
  for(var spell in spells) {
    if(spell.match(/\s[A-Z]\d$/))
      continue;
    var groupLevels = QuilvynUtils.getAttrValueArray(spells[spell], 'Level');
    for(var i = 0; i < groupLevels.length; i++) {
      var groupLevel = groupLevels[i];
      var attrs =
        spells[spell] + ' ' + (spells[spell + ' ' + groupLevel] || '');
      rules.choiceRules(rules, 'Spell', spell, attrs + ' Level=' + groupLevel);
    }
  }

};

/* Defines rules related to character aptitudes. */
OldSchool.talentRules = function(rules, features, goodies, languages, skills) {

  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);
  QuilvynUtils.checkAttrTable
    (goodies, ['Pattern', 'Effect', 'Value', 'Attribute', 'Section', 'Note']);
  QuilvynUtils.checkAttrTable(languages, []);
  QuilvynUtils.checkAttrTable(skills, ['Ability', 'Class']);

  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
  for(var goody in goodies) {
    rules.choiceRules(rules, 'Goody', goody, goodies[goody]);
  }
  for(var language in languages) {
    rules.choiceRules(rules, 'Language', language, languages[language]);
  }
  for(var skill in skills) {
    rules.choiceRules(rules, 'Goody', skill,
      'Pattern="([-+]\\d).*\\s+' + skill + '\\s+Skill|' + skill + '\\s+skill\\s+([-+]\\d)"' +
      'Effect=add ' +
      'Value="$1 || $2" ' +
      'Attribute="skillModifier.' + skill + '" ' +
      'Section=skill Note="%V ' + skill + '"'
    );
    rules.choiceRules(rules, 'Skill', skill, skills[skill]);
  }
  if(OldSchool.EDITION == 'Second Edition')
    QuilvynRules.validAllocationRules
      (rules, 'skill', 'skillPoints', 'sumThiefSkills');
  QuilvynRules.validAllocationRules
    (rules, 'language', 'languageCount', 'Sum "^languages\\."');
  QuilvynRules.validAllocationRules
    (rules, 'nonweaponProficiency', 'nonweaponProficiencyCount', 'sumNonThiefSkills');

};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
OldSchool.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Alignment')
    OldSchool.alignmentRules(rules, name);
  else if(type == 'Armor')
    OldSchool.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Move'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Skill')
    );
  else if(type == 'Class') {
    OldSchool.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Experience'),
      QuilvynUtils.getAttrValueArray(attrs, 'HitDie'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attack'),
      QuilvynUtils.getAttrValueArray(attrs, 'Breath'),
      QuilvynUtils.getAttrValueArray(attrs, 'Death'),
      QuilvynUtils.getAttrValueArray(attrs, 'Petrification'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spell'),
      QuilvynUtils.getAttrValueArray(attrs, 'Wand'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValueArray(attrs, 'WeaponProficiency'),
      QuilvynUtils.getAttrValueArray(attrs, 'NonweaponProficiency'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelArcane'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelDivine'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    OldSchool.classRulesExtra(rules, name);
  } else if(type == 'Feature')
    OldSchool.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Goody')
    OldSchool.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Language')
    OldSchool.languageRules(rules, name);
  else if(type == 'Race') {
    OldSchool.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages')
    );
    OldSchool.raceRulesExtra(rules, name);
  } else if(type == 'School')
    OldSchool.schoolRules(rules, name);
  else if(type == 'Shield')
    OldSchool.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Skill') {
    OldSchool.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      QuilvynUtils.getAttrValueArray(attrs, 'Class')
    );
    OldSchool.skillRulesExtra(rules, name);
  } else if(type == 'Spell') {
    var description = QuilvynUtils.getAttrValue(attrs, 'Description');
    var duration = QuilvynUtils.getAttrValue(attrs, 'Duration');
    var effect =  QuilvynUtils.getAttrValue(attrs, 'Effect');
    var groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    var range = QuilvynUtils.getAttrValue(attrs, 'Range');
    var school = QuilvynUtils.getAttrValue(attrs, 'School');
    var schoolAbbr = school.substring(0, 4);
    for(var i = 0; i < groupLevels.length; i++) {
      var matchInfo = groupLevels[i].match(/^(\D+)(\d+)$/);
      if(!matchInfo) {
        console.log('Bad level "' + groupLevels[i] + '" for spell ' + name);
        continue;
      }
      var group = matchInfo[1];
      var level = matchInfo[2] * 1;
      var fullName = name + '(' + group + level + ' ' + schoolAbbr + ')';
      OldSchool.spellRules
        (rules, fullName, school, group, level, description, duration, effect,
         range);
      rules.addChoice('spells', fullName, attrs);
    }
  } else if(type == 'Weapon')
    OldSchool.weaponRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'Range')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  if(type != 'Feature' && type != 'Spell') {
    type = type == 'Class' ? 'levels' :
    (type.substring(0,1).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
OldSchool.alignmentRules = function(rules, name) {
  if(!name) {
    console.log('Empty alignment name');
    return;
  }
  // No rules pertain to alignment
};

/*
 * Defines in #rules# the rules associated with armor #name#, which adds #ac#
 * to the character's armor class, imposes a maximum movement speed of
 * #maxMove#, weighs #weight# pounds, and modifies skills as specified in
 * #skill#.
 */
OldSchool.armorRules = function(rules, name, ac, maxMove, weight, skill) {

  if(!name) {
    console.log('Empty armor name');
    return;
  }
  if(typeof ac != 'number') {
    console.log('Bad ac "' + ac + '" for armor ' + name);
    return;
  }
  if(typeof maxMove != 'number') {
    console.log('Bad maxMove "' + maxMove + '" for armor ' + name);
    return;
  }
  if(typeof weight != 'number') {
    console.log('Bad weight "' + weight + '" for armor ' + name);
    return;
  }
  if(skill && typeof skill != 'string') {
    console.log('Bad skill "' + skill + '" for armor ' + name);
    return;
  }

  if(rules.armorStats == null) {
    rules.armorStats = {
      ac:{},
      move:{},
      weight:{},
      skill:{}
    };
  }
  rules.armorStats.ac[name] = ac;
  rules.armorStats.move[name] = maxMove;
  rules.armorStats.weight[name] = weight;
  rules.armorStats.skill[name] = skill;

  if(OldSchool.EDITION == 'Second Edition') {
    rules.defineRule('skillNotes.armorSkillModifiers',
      'armor', '=', QuilvynUtils.dictLit(rules.armorStats.skill) + '[source]'
    );
  } else {
    rules.defineRule('abilityNotes.armorSpeedMaximum',
      'armor', '+', QuilvynUtils.dictLit(rules.armorStats.move) + '[source]'
    );
  }
  rules.defineRule('armorClass',
    '', '=', '10',
    'armor', '+', '-' + QuilvynUtils.dictLit(rules.armorStats.ac) + '[source]'
  );
  rules.defineRule('armorWeight',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.weight) + '[source]'
  );

};

/*
 * Defines in #rules# the rules associated with class #name#, which has the list
 * of hard prerequisites #requires#. #experience# lists the experience point
 * progression required to advance levels in the class. #hitDie# is a triplet
 * indicating the additional hit points granted with each level advance--the
 * first element (format [n]'d'n) specifies the number of side on each die,
 * the second the maximum number of hit dice for the class, and the third the
 * number of points added each level after the maximum hit dice are reached.
 * #hitDie# (format [n]'d'n) additional hit points with each level advance.
 * #attack# is a quadruplet indicating: the attack bonus for a level 1
 * character; the amount this increases as the character gains levels; the
 * number of levels between increases; any adjustment in this pattern at a
 * specific level. Similarly, #saveBreath#, #saveDeath#, #savePetrification#,
 * #saveSpell#, and #saveWand# are each triplets indicating: the saving throw
 * for a level 1 character; the amount this decreases as the character gains
 * levels; the number of levels between decreases. #features# and #selectables#
 * list the fixed and selectable features acquired as the character advances in
 * class level, and #languages# lists any automatic languages for the class.
 * #weaponProficiency# is a triplet indicating: the number of weapon
 * proficiencies for a level 1 character; the number of levels between
 * increments of weapon proficiencies; the penalty for using a non-proficient
 * weapon. #weaponProficiency# is a pair indicating the number of nonweapon
 * proficiencies for a level 1 character and the number of levels between
 * increments of nonweapon proficiencies. #casterLevelArcane# and
 * #casterLevelDivine#, if specified, give the Javascript expression for
 * determining the caster level for the class; these can incorporate a class
 * level attribute (e.g., 'levels.Cleric') or the character level attribute
 * 'level'. If the class grants spell slots, #spellSlots# lists the number of
 * spells per level per day granted.
 */
OldSchool.classRules = function(
  rules, name, requires, experience, hitDie, attack, saveBreath, saveDeath,
  savePetrification, saveSpell, saveWand, features, selectables, languages,
  weaponProficiency, nonweaponProficiency, casterLevelArcane,
  casterLevelDivine, spellSlots
) {

  if(!name) {
    console.log('Empty class name');
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires list "' + requires + '" for class ' + name);
    return;
  }
  if(!Array.isArray(experience)) {
    console.log('Bad experience "' + experience + '" for class ' + name);
    return;
  }
  if(!Array.isArray(hitDie) || hitDie.length != 3) {
    console.log('Bad hitDie "' + hitDie + '" for class ' + name);
    return;
  }
  if(!Array.isArray(attack) || attack.length != 4) {
    console.log('Bad attack "' + attack + '" for class ' + name);
    return;
  }
  if(!Array.isArray(saveBreath) || saveBreath.length != 3 ||
     typeof saveBreath[0] != 'number' ||
     !(saveBreath[1] + '').match(/^\d+(\.\d+)?$/)) {
    console.log('Bad saveBreath "' + saveBreath + '" for class ' + name);
    return;
  }
  if(!Array.isArray(saveDeath) || saveDeath.length != 3 ||
     typeof saveDeath[0] != 'number' ||
    !(saveDeath[1] + '').match(/^\d+(\.\d+)?$/)) {
    console.log('Bad saveDeath "' + saveDeath + '" for class ' + name);
    return;
  }
  if(!Array.isArray(savePetrification) || savePetrification.length != 3 ||
     typeof savePetrification[0] != 'number' ||
     !(savePetrification[1] + '').match(/^\d+(\.\d+)?$/)) {
    console.log('Bad savePetrification "' + savePetrification + '" for class ' + name);
    return;
  }
  if(!Array.isArray(saveSpell) || saveSpell.length != 3 ||
     typeof saveSpell[0] != 'number' ||
     !(saveSpell[1] + '').match(/^\d+(\.\d+)?$/)) {
    console.log('Bad saveSpell "' + saveSpell + '" for class ' + name);
    return;
  }
  if(!Array.isArray(saveWand) || saveWand.length != 3 ||
     typeof saveWand[0] != 'number' ||
     !(saveWand[1] + '').match(/^\d+(\.\d+)?$/)) {
    console.log('Bad saveWand "' + saveWand + '" for class ' + name);
    return;
  }
  if(!Array.isArray(features)) {
    console.log('Bad features list "' + features + '" for class ' + name);
    return;
  }
  if(!Array.isArray(selectables)) {
    console.log('Bad selectables list "' + selectables + '" for class ' + name);
    return;
  }
  if(!Array.isArray(languages)) {
    console.log('Bad languages list "' + languages + '" for class ' + name);
    return;
  }
  if(!Array.isArray(weaponProficiency) || weaponProficiency.length != 3) {
    console.log('Bad weaponProficiency "' + weaponProficiency + '" for class ' + name);
    return;
  }
  if(!Array.isArray(nonweaponProficiency) ||
     (nonweaponProficiency.length != 2 && nonweaponProficiency.length != 0)) {
    console.log('Bad nonweaponProficiency "' + nonweaponProficiency + '" for class ' + name);
    return;
  }
  if(!Array.isArray(spellSlots)) {
    console.log('Bad spellSlots list "' + spellSlots + '" for class ' + name);
    return;
  }

  var classLevel = 'levels.' + name;
  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');

  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Class', classLevel, requires);

  rules.defineChoice('notes', 'experiencePoints.' + name + ':%V/%1');
  for(var i = 0; i < experience.length; i++) {
    experience[i] *= 1000;
    // 2E changes level at round number; 1E at round number + 1
    if(OldSchool.EDITION == 'First Edition' && i > 0)
      experience[i] += 1;
  }
  rules.defineRule('experiencePoints.' + name + '.1',
    classLevel, '=', 'source < ' + experience.length + ' ? [' + experience + '][source] : "-"'
  );
  rules.defineRule(classLevel,
    'experiencePoints.' + name, '=', 'source >= ' + experience[experience.length - 1] + ' ? ' + experience.length + ' : [' + experience + '].findIndex(item => item > source)'
  );

  var attackStep = '';
  if(attack[3].includes('@')) {
    attackStep = attack[3].split('@');
    attackStep =
      ' + (source>=' + attackStep[1] + ' ? ' + attackStep[0] + ' : 0)';
  }
  rules.defineRule('baseAttack',
    classLevel, '^=', attack[0] + ' + Math.floor((source - 1) / ' + attack[2] + ') * ' + attack[1] + attackStep
  );

  var extraHitDie = (hitDie[0] + '').startsWith('2');
  rules.defineRule('hitDice',
    classLevel, '^=',
      'Math.min(source' + (extraHitDie ? ' + 1' : '') + ', ' + hitDie[1] + ')'
  );

  var saves = {
    'Breath':saveBreath, 'Death':saveDeath, 'Petrification':savePetrification,
    'Spell':saveSpell, 'Wand':saveWand
  };
  for(var save in saves) {
    rules.defineRule('class' + name + save + 'Save',
      classLevel, '=', saves[save][0] + ' - Math.floor(Math.floor((source - 1) / ' + saves[save][2] + ') * ' + saves[save][1] + ')',
      'class' + name + 'SaveAdjustment', '+', null
    );
    rules.defineRule
      ('save.' + save, 'class' + name + save + 'Save', 'v=', null);
  }
  rules.defineRule('class' + name + 'BreathSave',
    'class' + name + 'BreathSaveAdjustment', '+', null
  );

  QuilvynRules.featureListRules(rules, features, name, classLevel, false);
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

  if(languages.length > 0)
    rules.defineRule('languageCount', classLevel, '+', languages.length);
  for(var i = 0; i < languages.length; i++) {
    if(languages[i] != 'any')
      rules.defineRule('languages.' + languages[i], classLevel, '=', '1');
  }

  rules.defineRule('weaponProficiencyCount',
    'levels.' + name, '+', weaponProficiency[0] + ' + Math.floor(source / ' + weaponProficiency[1] + ')'
  );
  rules.defineRule('weaponNonProficiencyPenalty',
    'levels.' + name, '^=', weaponProficiency[2]
  );
  if(nonweaponProficiency.length == 2)
    rules.defineRule('nonweaponProficiencyCount',
      'levels.' + name, '+=', nonweaponProficiency[0] + ' + Math.floor(source / ' + nonweaponProficiency[1] + ')'
    );

  if(spellSlots.length > 0) {
    var casterLevelExpr = casterLevelArcane || casterLevelDivine || classLevel;
    if(casterLevelExpr.match(new RegExp('\\b' + classLevel + '\\b', 'i'))) {
      rules.defineRule('casterLevels.' + name,
        classLevel, '=', casterLevelExpr.replace(new RegExp('\\b' + classLevel + '\\b', 'gi'), 'source')
      );
    } else {
      rules.defineRule('casterLevels.' + name,
        classLevel, '?', null,
        'level', '=', casterLevelExpr.replace(new RegExp('\\blevel\\b', 'gi'), 'source')
      );
    }
    if(casterLevelArcane)
      rules.defineRule('casterLevelArcane', 'casterLevels.' + name, '+=', null);
    if(casterLevelDivine)
      rules.defineRule('casterLevelDivine', 'casterLevels.' + name, '+=', null);
    QuilvynRules.spellSlotRules(rules, classLevel, spellSlots);
    for(var j = 0; j < spellSlots.length; j++) {
      var spellTypeAndLevel = spellSlots[j].split(/:/)[0];
      var spellType = spellTypeAndLevel.replace(/\d+/, '');
      if(spellType != name)
        rules.defineRule('casterLevels.' + spellType,
          'casterLevels.' + name, '=', null
        );
    }
  }

};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the abilities passed to classRules.
 */
OldSchool.classRulesExtra = function(rules, name) {

  var classLevel = 'levels.' + name;

  if(name == 'Abjurer') {

    rules.defineRule('magicNotes.eldritchCraft.1', '', '=', '""');
    rules.defineRule('magicNotes.eldritchCraft.1',
      classLevel, '=', 'source<11 ? " with aid of an alchemist" : null'
    );
    rules.defineRule
      ('magicNotes.schoolExpertise', classLevel, '=', '"Abjuration"');
    rules.defineRule('magicNotes.schoolFocus', classLevel, '=', '"Abjuration"');
    rules.defineRule('magicNotes.schoolOpposition',
      classLevel, '=', '"Alteration or Illusion"'
    );
    rules.defineRule
      ('magicNotes.schoolSpecialization', classLevel, '=', '"Abjuration"');
    rules.defineRule
      ('saveNotes.schoolExpertise', classLevel, '=', '"Abjuration"');
    rules.defineRule('wizardLevel', classLevel, '+=', null);

  } else if(name == 'Assassin') {

    rules.defineRule('abilityNotes.limitedHenchmenClasses',
      classLevel, '=', 'source<8 ? "assassins" : source<12 ? "assassins and thieves" : "any class"'
    );
    rules.defineRule('abilityNotes.delayedHenchmen', classLevel, '=', '4');
    rules.defineRule('combatNotes.assassination',
      classLevel, '=', 'Math.min(5 * source + 45, 100)'
    );
    rules.defineRule('combatNotes.backstab',
      classLevel, '+=', 'Math.min(Math.ceil(source / 4) + 1, 5)'
    );
    rules.defineRule('magicNotes.readScrolls', classLevel, '^=', '75');
    rules.defineRule('maximumHenchmen', classLevel, 'v', 'source<4 ? 0 : null');
    rules.defineRule('skillNotes.bonusLanguages',
      'intelligence', '=', 'source>14 ? source - 14 : null',
      classLevel, 'v', 'Math.min(source - 8, 4)'
    );
    var skillLevel = 'source>2 ? source - 2 : null';
    rules.defineRule('skillLevel.Climb Walls', classLevel, '+=', skillLevel);
    rules.defineRule('skillLevel.Find Traps', classLevel, '+=', skillLevel);
    rules.defineRule('skillLevel.Hear Noise', classLevel, '+=', skillLevel);
    rules.defineRule
      ('skillLevel.Hide In Shadows', classLevel, '+=', skillLevel);
    rules.defineRule('skillLevel.Move Silently', classLevel, '+=', skillLevel);
    rules.defineRule('skillLevel.Open Locks', classLevel, '+=', skillLevel);
    rules.defineRule('skillLevel.Pick Pockets', classLevel, '+=', skillLevel);
    rules.defineRule('skillLevel.Read Languages', classLevel, '+=', skillLevel);

  } else if(name == 'Bard') {

    if(OldSchool.EDITION == 'Second Edition') {
      rules.defineRule('magicNotes.readScrolls', classLevel, '^=', '85');
      rules.defineRule('magicNotes.charmingMusic.1',
        classLevel, '=', 'Math.floor(source / 3)'
      );
      rules.defineRule('magicNotes.poeticInspiration', classLevel, '=', null);
      rules.defineRule
        ('magicNotes.poeticInspiration.1', classLevel, '=', 'source * 10');
      rules.defineRule('skillLevel.Climb Walls', classLevel, '+=', null);
      rules.defineRule('skillLevel.Hear Noise', classLevel, '+=', null);
      rules.defineRule('skillLevel.Pick Pockets', classLevel, '+=', null);
      rules.defineRule('skillLevel.Read Languages', classLevel, '+=', null);
      rules.defineRule('skillModifier.Climb Walls', classLevel, '+=', '50',);
      rules.defineRule('skillModifier.Hear Noise', classLevel, '+=', '20');
      rules.defineRule('skillModifier.Pick Pockets', classLevel, '+=', '10');
      rules.defineRule('skillModifier.Read Languages', classLevel, '+=', '5');
      rules.defineRule('skillNotes.legendLore', classLevel, '=', 'source * 5');
      rules.defineRule('skillPoints', classLevel, '+=', '15 * source + 5');
    } else {
      rules.defineRule('classBardSaveAdjustment',
        classLevel, '=', 'source>=19 ? -2 : source>=7 ? -1 : null'
      );
      rules.defineRule('languageCount',
        classLevel, '+', 'source>17 ? source - 7 : source>3 ? source - 2 - Math.floor((source-3) / 3) : 1'
      );
      rules.defineRule("languages.Druids' Cant", classLevel, '=', '1');
      rules.defineRule('magicNotes.charmingMusic',
        classLevel, '=', '[0,15,20,22,24,30,32,34,40,42,44,50,53,56,60,63,66,70,73,76,80,84,88,95][source]'
      );
      rules.defineRule('skillNotes.additionalLanguages',
        classLevel, '=', 'source<=17 ? source - 3 - Math.floor((source - 2) / 3) : (source - 8)'
      );
      rules.defineRule('skillNotes.legendLore',
        classLevel, '=', 'source==23 ? 99 : source > 6 ? source*5 - 15 : source > 2 ? source*3 - 2 : (source*5 - 5)'
      );
      rules.defineRule('skillNotes.woodlandLanguages',
        classLevel, '=', 'source>2 ? source - 2 : null'
      );
    }

  } else if(name == 'Cleric') {

    var t = OldSchool.EDITION == 'Second Edition' ? 'P' : 'C';

    rules.defineRule('classClericSaveAdjustment',
      classLevel, '=', 'source>=19 ? -2 : source>=7 ? -1 : null'
    );
    rules.defineRule('magicNotes.bonusClericSpells',
      'wisdom', '=',
       '"Spell level ' + t + '1" + ' +
       '(source>=14 ? source>=19 ? "x3" : "x2" : "") + ' +
       '(source>=15 ? ", ' + t + '2" : "") + ' +
       '(source>=16 ? "x2"  : "") + ' +
       '(source>=17 ? ", ' + t + '3" : "") + ' +
       (OldSchool.EDITION == 'Second Edition' ? '(source>=19 ? "x2" : "") + ' : '') +
       '(source>=18 ? ", ' + t + '4" : "")'
    );
    rules.defineRule('magicNotes.clericSpellFailure',
      'wisdom', '=', '(13 - source) * 5'
    );
    rules.defineRule('spellSlots.'+t+'6', 'wisdom', '?', 'source > 16');
    rules.defineRule('spellSlots.'+t+'7', 'wisdom', '?', 'source > 17');
    for(var level = 1; level <= 4; level++) {
      rules.defineRule('spellSlots.' + t + level,
        'magicNotes.bonusClericSpells', '+', 'source.match(/' + t + level + 'x3/) ? 3 : source.match(/' + t + level + 'x2/) ? 2 : source.match(/' + t + level + '/) ? 1 : 0'
      );
    }
    rules.defineRule('turningLevel', classLevel, '+=', null);

  } else if(name == 'Conjurer') {

    rules.defineRule('magicNotes.eldritchCraft.1', '', '=', '""');
    rules.defineRule('magicNotes.eldritchCraft.1',
      classLevel, '=', 'source<11 ? " with aid of an alchemist" : null'
    );
    rules.defineRule
      ('magicNotes.schoolExpertise', classLevel, '=', '"Conjuration"');
    rules.defineRule
      ('magicNotes.schoolFocus', classLevel, '=', '"Conjuration"');
    rules.defineRule('magicNotes.schoolOpposition',
      classLevel, '=', '"Divination or Evocation"'
    );
    rules.defineRule
      ('magicNotes.schoolSpecialization', classLevel, '=', '"Conjuration"');
    rules.defineRule
      ('saveNotes.schoolExpertise', classLevel, '=', '"Conjuration"');
    rules.defineRule('wizardLevel', classLevel, '+=', null);

  } else if(name == 'Diviner') {

    rules.defineRule('magicNotes.eldritchCraft.1', '', '=', '""');
    rules.defineRule('magicNotes.eldritchCraft.1',
      classLevel, '=', 'source<11 ? " with aid of an alchemist" : null'
    );
    rules.defineRule
      ('magicNotes.schoolExpertise', classLevel, '=', '"Divination"');
    rules.defineRule('magicNotes.schoolFocus', classLevel, '=', '"Divination"');
    rules.defineRule
      ('magicNotes.schoolOpposition', classLevel, '=', '"Conjuration"');
    rules.defineRule
      ('magicNotes.schoolSpecialization', classLevel, '=', '"Divination"');
    rules.defineRule
      ('saveNotes.schoolExpertise', classLevel, '=', '"Divination"');
    rules.defineRule('wizardLevel', classLevel, '+=', null);

  } else if(name == 'Druid') {

    var t = OldSchool.EDITION == 'Second Edition' ? 'P' : 'D';

    rules.defineRule('classDruidSaveAdjustment',
      classLevel, '=', 'source>=19 ? -2 : source>=7 ? -1 : null'
    );
    rules.defineRule('languageCount', classLevel, '+', '1');
    rules.defineRule("languages.Druids' Cant", classLevel, '=', '1');
    rules.defineRule('magicNotes.bonusDruidSpells',
      'wisdom', '=',
       '"Spell level ' + t + '1" + ' +
       '(source>=14 ? source>=19 ? "x3" : "x2" : "") + ' +
       '(source>=15 ? ", ' + t + '2" : "") + ' +
       '(source>=16 ? "x2"  : "") + ' +
       '(source>=17 ? ", ' + t + '3" : "") + ' +
       (OldSchool.EDITION == 'Second Edition' ? '(source>=19 ? "x2" : "") + ' : '') +
       '(source>=18 ? ", ' + t + '4" : "")'
    );
    rules.defineRule('skillNotes.woodlandLanguages',
      classLevel, '=', 'source>2 ? source - 2 : null'
    );
    for(var level = 1; level <= 4; level++) {
      rules.defineRule('spellSlots.' + t + level,
        'magicNotes.bonusDruidSpells', '+', 'source.match(/' + t + level + 'x3/) ? 3 : source.match(/' + t + level + 'x2/) ? 2 : source.match(/' + t + level + '/) ? 1 : 0'
      );
    }

  } else if(name == 'Enchanter') {

    rules.defineRule('magicNotes.eldritchCraft.1', '', '=', '""');
    rules.defineRule('magicNotes.eldritchCraft.1',
      classLevel, '=', 'source<11 ? " with aid of an alchemist" : null'
    );
    rules.defineRule
      ('magicNotes.schoolExpertise', classLevel, '=', '"Enchantment"');
    rules.defineRule
      ('magicNotes.schoolFocus', classLevel, '=', '"Enchantment"');
    rules.defineRule('magicNotes.schoolOpposition',
      classLevel, '=', '"Evocation or Necromancy"'
    );
    rules.defineRule
      ('magicNotes.schoolSpecialization', classLevel, '=', '"Enchantment"');
    rules.defineRule
      ('saveNotes.schoolExpertise', classLevel, '=', '"Enchantment"');
    rules.defineRule('wizardLevel', classLevel, '+=', null);

  } else if(name == 'Fighter') {

    rules.defineRule('attacksPerRound',
      classLevel, '+', 'source<7 ? null : source<13 ? 0.5 : 1'
    );
    rules.defineRule('classFighterBreathSaveAdjustment',
      classLevel, '=', 'source>=17 ? -2 : -Math.floor((source - 1) / 4)'
    );
    rules.defineRule('classFighterSaveAdjustment',
      classLevel, '=', 'source<17 ? null : source>18 ? 2 : 1'
    );
    rules.defineRule('warriorLevel', classLevel, '+', null);

  } else if(name == 'Illusionist') {

    rules.defineRule('wizardLevel', classLevel, '+=', null);
    rules.defineRule('magicNotes.eldritchCraft.1', '', '=', '""');
    rules.defineRule('magicNotes.eldritchCraft.1',
      classLevel, '=', 'source<11 ? " with aid of an alchemist" : null'
    );
    if(OldSchool.EDITION == 'Second Edition') {
      rules.defineRule
        ('magicNotes.schoolExpertise', classLevel, '=', '"Illusion"');
      rules.defineRule('magicNotes.schoolFocus', classLevel, '=', '"Illusion"');
      rules.defineRule('magicNotes.schoolOpposition',
        classLevel, '=', '"Abjuration, Evocation, or Necromancy"'
      );
      rules.defineRule
        ('magicNotes.schoolSpecialization', classLevel, '=', '"Illusion"');
      rules.defineRule
        ('saveNotes.schoolExpertise', classLevel, '=', '"Illusion"');
    }

  } else if(name == 'Invoker') {

    rules.defineRule('magicNotes.eldritchCraft.1', '', '=', '""');
    rules.defineRule('magicNotes.eldritchCraft.1',
      classLevel, '=', 'source<11 ? " with aid of an alchemist" : null'
    );
    rules.defineRule
      ('magicNotes.schoolExpertise', classLevel, '=', '"Evocation"');
    rules.defineRule('magicNotes.schoolFocus', classLevel, '=', '"Evocation"');
    rules.defineRule('magicNotes.schoolOpposition',
      classLevel, '=', '"Conjuration or Enchantment"'
    );
    rules.defineRule
      ('magicNotes.schoolSpecialization', classLevel, '=', '"Evocation"');
    rules.defineRule
      ('saveNotes.schoolExpertise', classLevel, '=', '"Evocation"');
    rules.defineRule('wizardLevel', classLevel, '+=', null);

  } else if(name == 'Magic User') {

    rules.defineRule('wizardLevel', classLevel, '+=', null);
    rules.defineRule('magicNotes.eldritchCraft.1', '', '=', '""');
    rules.defineRule('magicNotes.eldritchCraft.1',
      classLevel, '=', 'source<11 ? " with aid of an alchemist" : null'
    );
    rules.defineRule('maximumSpellsPerLevel',
      'wizardLevel', '?', null,
      'intelligence', '=',
        'source==9 ? 6 : source<=12 ? 7 : source<=14 ? 9 : source<=16 ? 11 : ' +
        'source==17 ? 14 : source==18 ? 18 : "all"'
    );
    rules.defineRule('understandSpell',
      'wizardLevel', '?', null,
      'intelligence', '=',
      OldSchool.EDITION != 'Second Edition' ?
        'source>=19 ? 95 : ' +
          'source==18 ? 85 : source==17 ? 75 : source>=15 ? 65 : ' +
          'source>=13 ? 55 : source>=10 ? 45 : 35' :
        'source>=19 ? 95 : source==18 ? 85 : source * 5 - 10'
    );
    rules.defineRule('magicNotes.craftMinorMagic.1', '', '=', '""');
    if(OldSchool.EDITION != 'Second Edition') {
      rules.defineRule('magicNotes.craftMinorMagic.1',
        classLevel, '=', 'source<11 ? " with aid of an alchemist" : null'
      );
    }

  } else if(name == 'Monk') {

    rules.defineRule('abilityNotes.limitedHenchmenClasses',
      classLevel, '=', '"assassins, fighters, and thieves"'
    );
    rules.defineRule('abilityNotes.delayedHenchmen', classLevel, '=', '6');
    rules.defineRule
      ('armorClass', classLevel, '=', '11 - source + Math.floor(source / 5)');
    rules.defineRule
      ('combatNotes.aware', classLevel, '=', '36 - source * 2');
    rules.defineRule
      ('combatNotes.dexterityArmorClassAdjustment', classLevel, '*', '0');
    rules.defineRule('combatNotes.flurryOfBlows',
      classLevel, '=', 'source<6 ? 1.25 : source<9 ? 1.5 : source<11 ? 2 : source<14 ? 2.5 : source<16 ? 3 : 4'
    );
    rules.defineRule('combatNotes.killingBlow', classLevel, '=', 'source - 7');
    rules.defineRule('combatNotes.preciseBlow', classLevel, '=', 'source / 2');
    rules.defineRule('combatNotes.quiveringPalm', classLevel, '=', null);
    rules.defineRule('combatNotes.quiveringPalm.1',
      'features.Quivering Palm', '?', null,
      'hitDice', '=', null
    );
    rules.defineRule('combatNotes.quiveringPalm.2',
      'features.Quivering Palm', '?', null,
      'hitPoints', '=', 'source * 2'
    );
    rules.defineRule
      ('combatNotes.strengthAttackAdjustment', classLevel, '*', '0');
    rules.defineRule
      ('combatNotes.strengthDamageAdjustment', classLevel, '*', '0');
    rules.defineRule('featureNotes.feignDeath', classLevel, '=', 'source * 2');
    rules.defineRule
      ('magicNotes.wholenessOfBody', classLevel, '=', 'source - 6');
    rules.defineRule
      ('maximumHenchmen', classLevel, 'v', 'source>=6 ? source - 4 : 0');
    rules.defineRule
      ('saveNotes.maskedMind', classLevel, '=', '62 + source * 2');
    rules.defineRule
      ('saveNotes.resistInfluence', classLevel, '=', '5 + source * 5');
    rules.defineRule('saveNotes.slowFall.1',
      classLevel, '=', 'source<6 ? "20\'" : source<13 ? "30\'" : "any distance"'
    );
    rules.defineRule('saveNotes.slowFall.2',
      classLevel, '=', 'source<6 ? 1 : source<13 ? 4 : 8'
    );
    if(OldSchool.EDITION == 'First Edition') {
      rules.defineRule('skillLevel.Climb Walls', classLevel, '+=', null);
      rules.defineRule('skillLevel.Find Traps', classLevel, '+=', null);
      rules.defineRule('skillLevel.Hear Noise', classLevel, '+=', null);
      rules.defineRule('skillLevel.Hide In Shadows', classLevel, '+=', null);
      rules.defineRule('skillLevel.Move Silently', classLevel, '+=', null);
      rules.defineRule('skillLevel.Open Locks', classLevel, '+=', null);
    }
    rules.defineRule
      ('speed', classLevel, '+', 'source * 10 + (source>16 ? 30 : 20)');
    rules.defineRule('weapons.Unarmed.2',
      classLevel, '=', 'OldSchool.monkUnarmedDamage[source]'
    );

  } else if(name == 'Necromancer') {

    rules.defineRule('magicNotes.eldritchCraft.1', '', '=', '""');
    rules.defineRule('magicNotes.eldritchCraft.1',
      classLevel, '=', 'source<11 ? " with aid of an alchemist" : null'
    );
    rules.defineRule
      ('magicNotes.schoolExpertise', classLevel, '=', '"Necromancy"');
    rules.defineRule('magicNotes.schoolFocus', classLevel, '=', '"Necromancy"');
    rules.defineRule('magicNotes.schoolOpposition',
      classLevel, '=', '"Enchantment or Illusion"'
    );
    rules.defineRule
      ('magicNotes.schoolSpecialization', classLevel, '=', '"Necromancy"');
    rules.defineRule
      ('saveNotes.schoolExpertise', classLevel, '=', '"Necromancy"');
    rules.defineRule('wizardLevel', classLevel, '+=', null);

  } else if(name == 'Paladin') {

    rules.defineRule('attacksPerRound',
      classLevel, '+', 'source<7 ? null : source<13 ? 0.5 : 1'
    );
    rules.defineRule('classPaladinBreathSaveAdjustment',
      classLevel, '=', 'source>=17 ? -2 : -Math.floor((source - 1) / 4)'
    );
    rules.defineRule('classPaladinSaveAdjustment',
      classLevel, '=', 'source<17 ? null : source>18 ? 2 : 1'
    );
    if(OldSchool.EDITION == 'Second Edition') {
      rules.defineRule('magicNotes.circleOfPower', classLevel, '=', null);
    }
    rules.defineRule
      ('magicNotes.cureDisease', classLevel, '=', 'Math.ceil(source / 5)');
    rules.defineRule('magicNotes.layOnHands', classLevel, '=', '2 * source');
    rules.defineRule
      ('turningLevel', classLevel, '+=', 'source>2 ? source - 2 : null');
    rules.defineRule('warriorLevel', classLevel, '+', null);

  } else if(name == 'Ranger') {

    if(OldSchool.EDITION == 'Second Edition') {
      rules.defineRule('attacksPerRound',
        classLevel, '+', 'source<7 ? null : source<13 ? 0.5 : 1'
      );
      // Suppress v3.5 Tracking sanity note
      rules.defineRule('sanityNotes.tracking', classLevel, '?', '0');
      rules.defineRule('skillLevel.Hide In Shadows', classLevel, '+=', null);
      rules.defineRule('skillLevel.Move Silently', classLevel, '+=', null);
      rules.defineRule('skillNotes.animalEmpathy',
        classLevel, '=', '-Math.floor((source + 2) / 3)'
      );
      rules.defineRule
        ('skillNotes.tracking', classLevel, '=', 'Math.floor(source / 3)');
      rules.defineRule
        ('skillModifier.Tracking', 'skillNotes.tracking', '+=', null);
      rules.defineRule('skills.Tracking', 'skillNotes.tracking', '+=', '0');
      rules.defineRule('skillModifier.Hide In Shadows',
        classLevel, '+=', 'source<5 ? source * 5 + 5 : source<9 ? source * 6 + 1 : source<13 ? source * 7 - 7 : source<15 ? source * 8 - 19 : 99'
      );
      rules.defineRule('skillModifier.Move Silently',
        classLevel, '+=', 'source<5 ? source * 6 + 9 : source<7 ? source * 7 + 5 : source==7 ? 55 : source==8 ? 62 : source<13 ? source * 8 - 2 : 99'
      );
      rules.defineRule('skillPoints', classLevel, '+=', '0');
    } else {
      rules.defineRule('attacksPerRound',
        classLevel, '+', 'source<8 ? null : source<15 ? 0.5 : 1'
      );
      rules.defineRule('combatNotes.favoredEnemy', classLevel, '=', null);
    }
    rules.defineRule('abilityNotes.delayedHenchmen', classLevel, '=', '8');
    rules.defineRule('classRangerBreathSaveAdjustment',
      classLevel, '=', 'source>=17 ? -2 : -Math.floor((source - 1) / 4)'
    );
    rules.defineRule('classRangerSaveAdjustment',
      classLevel, '=', 'source<17 ? null : source>18 ? 2 : 1'
    );
    rules.defineRule('maximumHenchmen',
      // Noop to show Delayed Henchmen note in italics
      'abilityNotes.delayedHenchmen', '+', 'null',
      classLevel, 'v', 'source<8 ? 0 : null'
    );
    rules.defineRule('warriorLevel', classLevel, '+', null);

  } else if(name == 'Thief') {

    rules.defineRule('combatNotes.backstab',
      classLevel, '+=', 'Math.min(Math.ceil(source / 4) + 1, 5)'
    );
    rules.defineRule('languageCount', classLevel, '+', '1');
    rules.defineRule("languages.Thieves' Cant", classLevel, '=', '1');

    rules.defineRule('magicNotes.readScrolls', classLevel, '^=', '75');

    rules.defineRule('skillLevel.Climb Walls', classLevel, '+=', null);
    rules.defineRule('skillLevel.Find Traps', classLevel, '+=', null);
    rules.defineRule('skillLevel.Hear Noise', classLevel, '+=', null);
    rules.defineRule('skillLevel.Hide In Shadows', classLevel, '+=', null);
    rules.defineRule('skillLevel.Move Silently', classLevel, '+=', null);
    rules.defineRule('skillLevel.Open Locks', classLevel, '+=', null);
    rules.defineRule('skillLevel.Pick Pockets', classLevel, '+=', null);
    rules.defineRule('skillLevel.Read Languages', classLevel, '+=', null);

    if(OldSchool.EDITION == 'Second Edition') {
      rules.defineRule('maxAllowedSkillAllocation',
        'skillPoints', '=', 'Math.min(Math.floor(source / 2), 95)'
      );
      rules.defineRule('skillModifier.Climb Walls', classLevel, '+=', '60',);
      rules.defineRule('skillModifier.Find Traps', classLevel, '+=', '5');
      rules.defineRule('skillModifier.Hear Noise', classLevel, '+=', '15');
      rules.defineRule('skillModifier.Hide In Shadows', classLevel, '+=', '5');
      rules.defineRule('skillModifier.Move Silently', classLevel, '+=', '10');
      rules.defineRule('skillModifier.Open Locks', classLevel, '+=', '10');
      rules.defineRule('skillModifier.Pick Pockets', classLevel, '+=', '15');
      rules.defineRule('skillModifier.Read Languages', classLevel, '+=', '0');
      rules.defineRule('skillPoints', classLevel, '+=', '30 * source + 30');
    }

  } else if(name == 'Transmuter') {

    rules.defineRule('magicNotes.eldritchCraft.1', '', '=', '""');
    rules.defineRule('magicNotes.eldritchCraft.1',
      classLevel, '=', 'source<11 ? " with aid of an alchemist" : null'
    );
    rules.defineRule
      ('magicNotes.schoolExpertise', classLevel, '=', '"Alteration"');
    rules.defineRule('magicNotes.schoolFocus', classLevel, '=', '"Alteration"');
    rules.defineRule('magicNotes.schoolOpposition',
      classLevel, '=', '"Abjuration or Necromancy"'
    );
    rules.defineRule
      ('magicNotes.schoolSpecialization', classLevel, '=', '"Alteration"');
    rules.defineRule
      ('saveNotes.schoolExpertise', classLevel, '=', '"Alteration"');
    rules.defineRule('wizardLevel', classLevel, '+=', null);

  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
OldSchool.featureRules = function(rules, name, sections, notes) {
  OSRIC.featureRules(rules, name, sections, notes);
  // No changes needed to the rules defined by OSRIC method
};

/*
 * Defines in #rules# the rules associated with goody #name#, triggered by
 * a starred line in the character notes that matches #pattern#. #effect#
 * specifies the effect of the goody on each attribute in list #attributes#.
 * This is one of "increment" (adds #value# to the attribute), "set" (replaces
 * the value of the attribute by #value#), "lower" (decreases the value to
 * #value#), or "raise" (increases the value to #value#). #value#, if null,
 * defaults to 1; occurrences of $1, $2, ... in #value# reference capture
 * groups in #pattern#. #sections# and #notes# list the note sections
 * ("attribute", "combat", "companion", "feature", "magic", "save", or "skill")
 * and formats that show the effects of the goody on the character sheet.
 */
OldSchool.goodyRules = function(
  rules, name, pattern, effect, value, attributes, sections, notes
) {
  QuilvynRules.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
};

/* Defines in #rules# the rules associated with language #name#. */
OldSchool.languageRules = function(rules, name) {
  if(!name) {
    console.log('Empty language name');
    return;
  }
  // No rules pertain to language
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features and #languages# any automatic languages.
 */
OldSchool.raceRules = function(
  rules, name, requires, features, selectables, languages
) {
  OSRIC.raceRules(
    rules, name, requires, features, selectables, languages, null, [], [], null
  );
  // No changes needed to the rules defined by OSRIC method
  rules.defineRule
    ('skillNotes.raceSkillModifiers', 'sumThiefSkills', '?', '1');
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the abilities passed to raceRules.
 */
OldSchool.raceRulesExtra = function(rules, name) {

  var raceLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Level';

  if(name == 'Dwarf') {
    rules.defineRule('featureNotes.detectSlope',
      raceLevel, '+=', OldSchool.EDITION == 'Second Edition' ? '83' : '75'
    );
    rules.defineRule('featureNotes.determineDepth', raceLevel, '+=', '50');
    if(OldSchool.EDITION != 'Second Edition')
      rules.defineRule('skillNotes.intelligenceLanguageBonus',
        raceLevel, 'v', '2',
        '', '^', '0'
      );
    rules.defineRule('skillNotes.raceSkillModifiers',
      raceLevel, '=',
        '"-10% Climb Walls/+15% Find Traps/+10% Open Locks/-5% Read Languages"'
      );
  } else if(name == 'Elf') {
    rules.defineRule('saveNotes.resistCharm', raceLevel, '+=', '90');
    rules.defineRule('saveNotes.resistSleep', raceLevel, '+=', '90');
    if(OldSchool.EDITION != 'Second Edition')
      rules.defineRule('skillNotes.intelligenceLanguageBonus',
        raceLevel, '+', '-4',
        '', '^', '0'
      );
    rules.defineRule('skillNotes.raceSkillModifiers',
      raceLevel, '=',
        '"+5% Hear Noise/+10% Hide In Shadows/+5% Move Silently/-5% Open Locks/+5% Pick Pockets"'
      );
  } else if(name == 'Gnome') {
    rules.defineRule('featureNotes.detectSlope',
      raceLevel, '+=', OldSchool.EDITION == 'Second Edition' ? '83' : '80'
    );
    rules.defineRule('featureNotes.determineDepth',
      raceLevel, '+=', OldSchool.EDITION == 'Second Edition' ? '67' : '60'
    );
    if(OldSchool.EDITION != 'Second Edition')
      rules.defineRule('skillNotes.intelligenceLanguageBonus',
        raceLevel, 'v', '2',
        '', '^', '0'
      );
    rules.defineRule('skillNotes.raceSkillModifiers',
      raceLevel, '=',
        '"-15% Climb Walls/+10% Find Traps/+10% Hear Noise/+5% Hide In Shadows/+5% Move Silently/+5% Open Locks"'
      );
  } else if(name == 'Half-Elf') {
    rules.defineRule('saveNotes.resistCharm', raceLevel, '+=', '30');
    rules.defineRule('saveNotes.resistSleep', raceLevel, '+=', '30');
    if(OldSchool.EDITION == 'First Edition')
      rules.defineRule('skillNotes.intelligenceLanguageBonus',
        raceLevel, '+', '-5',
        '', '^', '0'
      );
    rules.defineRule('skillNotes.raceSkillModifiers',
      raceLevel, '=', '"+5% Hide In Shadows/+10% Pick Pockets"'
    );
  } else if(name == 'Half-Orc') {
    if(OldSchool.EDITION != 'Second Edition')
      rules.defineRule('skillNotes.intelligenceLanguageBonus',
        raceLevel, 'v', '2',
        '', '^', '0'
      );
    rules.defineRule('skillNotes.raceSkillModifiers',
      raceLevel, '=',
        '"+5% Climb Walls/+5% Find Traps/+5% Hear Noise/+5% Open Locks/-5% Pick Pockets/-10% Read Languages"'
      );
  } else if(name == 'Halfling') {
    rules.defineRule('featureNotes.detectSlope', raceLevel, '+=', '75');
    if(OldSchool.EDITION != 'Second Edition')
      rules.defineRule('skillNotes.intelligenceLanguageBonus',
        raceLevel, '+', '-5',
        '', '^', '0'
      );
    rules.defineRule('skillNotes.raceSkillModifiers',
      raceLevel, '=',
        '"-15% Climb Walls/+5% Find Traps/+5% Hear Noise/+15% Hide In Shadows/+10% Move Silently/+5% Open Locks/+5% Pick Pockets/-5% Read Languages"'
      );
  } else if(name == 'Human') {
    // empty
  }

};

/* Defines in #rules# the rules associated with magic school #name#. */
OldSchool.schoolRules = function(rules, name) {
  if(!name) {
    console.log('Empty school name');
    return;
  }
  // No rules pertain to school
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class and weight #weight# pounds
 */
OldSchool.shieldRules = function(rules, name, ac, weight) {

  if(!name) {
    console.log('Empty shield name');
    return;
  }
  if(typeof ac != 'number') {
    console.log('Bad ac "' + ac + '" for shield ' + name);
    return;
  }
  if(typeof weight != 'number') {
    console.log('Bad weight "' + weight + '" for shield ' + name);
    return;
  }

  if(rules.shieldStats == null) {
    rules.shieldStats = {
      ac:{},
      weight:{}
    };
  }
  rules.shieldStats.ac[name] = ac;
  rules.shieldStats.weight[name] = weight;

  rules.defineRule('armorClass',
    'shield', '+', '-' + QuilvynUtils.dictLit(rules.shieldStats.ac) + '[source]'
  );
  rules.defineRule('armorWeight',
    'shield', '+', QuilvynUtils.dictLit(rules.shieldStats.weight) + '[source]'
  );

};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * basic ability #ability#.  #classes# lists the classes for which this is a
 * class skill; a value of "all" indicates that this is a class skill for all
 * classes.
 */
OldSchool.skillRules = function(rules, name, ability, classes) {

  if(!name) {
    console.log('Empty skill name');
    return;
  }
  if(ability) {
    ability = ability.toLowerCase();
    if(!(ability in OldSchool.ABILITIES) && ability != 'n/a') {
      console.log('Bad ability "' + ability + '" for skill ' + name);
      return;
    }
  }
  if(!Array.isArray(classes)) {
    console.log('Bad classes list "' + classes + '" for skill ' + name);
    return;
  }

  for(var i = 0; i < classes.length; i++) {
    var clas = classes[i];
    if(clas == 'all')
      rules.defineRule('classSkill.' + name, 'level', '=', '1');
    else
      rules.defineRule('classSkill.' + name, 'levels.' + clas, '=', '1');
  }
  rules.defineRule('skillModifier.' + name,
    'skills.' + name, '=', null,
    'skillNotes.armorSkillModifiers', '+',
      'source.match(/' + name + '/) ? source.match(/([-+]\\d+)% ' + name + '/)[1] * 1 : null',
    'skillNotes.raceSkillModifiers', '+',
      'source.match(/' + name + '/) ? source.match(/([-+]\\d+)% ' + name + '/)[1] * 1 : null',
    'skillNotes.dexteritySkillModifiers', '+',
      'source.match(/' + name + '/) ? source.match(/([-+]\\d+)% ' + name + '/)[1] * 1 : null'
  );
  if(ability)
    rules.defineRule('sumNonThiefSkills', 'skills.' + name, '+=', null);
  else
    rules.defineRule('sumThiefSkills', 'skills.' + name, '+=', null);
  if(ability) {
    rules.defineChoice
      ('notes', 'skills.' + name + ': (' + ability.substring(0, 3) + ') %V (%1)');
    if(ability != 'n/a')
      rules.defineRule('skillModifier.' + name, ability, '+', null);
  } else if(OldSchool.EDITION == 'Second Edition') {
    rules.defineChoice('notes', 'skills.' + name + ':%V (%1%)');
  } else {
    rules.defineChoice('notes', 'skills.' + name + ':%1%');
  }
  rules.defineRule('skills.' + name + '.1', 'skillModifier.' + name, '=', null);

};

/*
 * Defines in #rules# the rules associated with skill #name# that cannot be
 * derived directly from the abilities passed to skillRules.
 */
OldSchool.skillRulesExtra = function(rules, name) {
  if(name == 'Climb Walls') {
    rules.defineRule('skills.Climb Walls',
      'skillLevel.Climb Walls', '+=',
        OldSchool.EDITION == 'First Edition' ?
          'source<=4 ? source + 84 : Math.min(2 * source + 80, 99)'
        : '0'
    );
  } else if(name == 'Find Traps') {
    rules.defineRule('skills.Find Traps',
      'skillLevel.Find Traps', '+=',
        OldSchool.EDITION == 'First Edition' ?
          'Math.min(5 * source + 15, 99)'
        : '0'
    );
  } else if(name == 'Hear Noise') {
    rules.defineRule('skills.Hear Noise',
      'skillLevel.Hear Noise', '+=',
        OldSchool.EDITION == 'First Edition' ?
          'Math.min(5 * Math.floor((source-1)/2) + (source>=15 ? 15 : 10), 55)'
        : '0'
    );
  } else if(name == 'Hide In Shadows') {
    rules.defineRule('skills.Hide In Shadows',
      'skillLevel.Hide In Shadows', '+=',
        OldSchool.EDITION == 'First Edition' ?
          'source<5 ? 5 * source + 5 : source<9 ? 6 * source + 1 : ' +
          'source<13 ? 7 * source - 7 : Math.min(8 * source - 19, 99)'
        : '0'
    );
  } else if(name == 'Move Silently') {
    rules.defineRule('skills.Move Silently',
      'skillLevel.Move Silently', '+=',
        OldSchool.EDITION == 'First Edition' ?
          'source<5 ? 6 * source + 9 : source<7 ? 7 * source + 5 : ' +
          'source==7 ? 55 : Math.min(8 * source - 2, 99)'
        : '0'
    );
  } else if(name == 'Open Locks') {
    rules.defineRule('skills.Open Locks',
      'skillLevel.Open Locks', '+=',
        OldSchool.EDITION == 'First Edition' ?
          'source<5 ? 4 * source + 21 : Math.min(5 * source + 17, 99)'
        : '0'
    );
  } else if(name == 'Pick Pockets') {
    rules.defineRule('skills.Pick Pockets',
      'skillLevel.Pick Pockets', '+=',
        OldSchool.EDITION == 'First Edition' ?
          'source<10 ? 5 * source + 25 : source<13 ? 10 * source - 20 : ' +
          'source<16 ? 5 * source + 40 : 125'
        : '0'
    );
  } else if(name == 'Read Languages') {
    rules.defineRule('skills.Read Languages',
      'skillLevel.Read Languages', '+=',
        OldSchool.EDITION == 'First Edition' ?
          'source>3 ? Math.min(5 * source, 80) : null'
        : '0'
    );
  }
};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a verbose
 * description of the spell's effects.
 */
OldSchool.spellRules = function(
  rules, name, school, casterGroup, level, description, duration, effect, range
) {
  if(duration != null)
    description = description.replaceAll('$D', duration);
  if(effect != null)
    description = description.replaceAll('$E', effect);
  if(range != null)
    description = description.replaceAll('$R', range);
  if(school == 'All') // Cantrip spell
    school = 'Conjuration';
  OSRIC.spellRules(rules, name, school, casterGroup, level, description, false);
  // No changes needed to the rules defined by OSRIC method
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which belongs to
 * weapon category #category# (one of '1h', '2h', 'Li', 'R', 'Un' or their
 * spelled-out equivalents). The weapon does #damage# HP on a successful attack.
 * If specified, the weapon can be used as a ranged weapon with a range
 * increment of #range# feet.
 */
OldSchool.weaponRules = function(rules, name, category, damage, range) {
  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  OSRIC.weaponRules(rules, name, category, damage, range);
  // Override effect of melee/rangedAttack, since those values are incorporated
  // into THACO/THAC10.
  if(category.match(/^R/i))
    rules.defineRule(prefix + 'AttackModifier', 'rangedAttack', '=', '0');
  else
    rules.defineRule(prefix + 'AttackModifier', 'meleeAttack', '=', '0');
  delete rules.getChoices('notes')['weapons.' + name];
  rules.defineChoice
    ('notes', 'weapons.' + name + ':%V (%1 %2%3' + (range ? ' R%5\')' : ')'));
  var specializationAttackBonus =
    OldSchool.EDITION == 'Second Edition' && name.match(/bow/i) ? 2 : 1;
  var specializationDamageBonus =
    OldSchool.EDITION == 'Second Edition' && name.match(/bow/i) ? 0 : 2;
  rules.defineRule(prefix + 'AttackModifier',
    'combatNotes.weaponSpecialization', '+',
      'source == "' + name + '" ? ' + specializationAttackBonus + ' : null'
  );
  if(name.match(/Bow/)) {
    rules.defineRule
      (prefix + 'AttackModifier', 'combatNotes.bowPrecision', '+', '1');
  }
  if(name == 'Long Sword' || name == 'Short Sword') {
    rules.defineRule
      (prefix + 'AttackModifier', 'combatNotes.swordPrecision', '+', '1');
  }
  if(OldSchool.EDITION == 'Second Edition' &&
     range != null && !name.match(/bow|gun|arquebus/i)) {
    rules.defineRule
      (prefix + 'AttackModifier', 'combatNotes.deadlyAim', '+', '1');
  }
  rules.defineRule(prefix + 'DamageModifier',
    'combatNotes.weaponSpecialization', '+',
      'source == "' + name + '" ? ' + specializationDamageBonus + ' : null'
  );
  rules.defineRule('combatNotes.nonproficientWeaponPenalty.' + name,
    'weapons.' + name, '?', null,
    'weaponProficiencyLevelShortfall.' + name, '?', 'source > 0',
    'weaponNonProficiencyPenalty', '=', '-source'
  );
  rules.defineRule('weaponProficiencyLevelShortfall.' + name,
    'weapons.' + name, '?', null,
    'weaponNonProficiencyPenalty', '=', '1',
    'weaponProficiency.' + name, 'v', '0'
  );
};

/* Returns the elements in a basic OldSchool character editor. */
OldSchool.initialEditorElements = function() {
  var abilityChoices = [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
  ];
  var editorElements = [
    ['name', 'Name', 'text', [20]],
    ['imageUrl', 'Image URL', 'text', [20]],
    ['strength', 'Strength', 'select-one', abilityChoices],
    ['extraStrength', 'Extra Strength', 'text', [4, '(\\+?[0-9]+)?']],
    ['dexterity', 'Dexterity', 'select-one', abilityChoices],
    ['constitution', 'Constitution', 'select-one', abilityChoices],
    ['intelligence', 'Intelligence', 'select-one', abilityChoices],
    ['wisdom', 'Wisdom', 'select-one', abilityChoices],
    ['charisma', 'Charisma', 'select-one', abilityChoices],
    ['gender', 'Gender', 'text', [10]],
    ['race', 'Race', 'select-one', 'races'],
    ['experiencePoints', 'Experience', 'bag', 'levels'],
    ['alignment', 'Alignment', 'select-one', 'alignments'],
    ['origin', 'Origin', 'text', [20]],
    ['player', 'Player', 'text', [20]]
  ];
  if(OldSchool.EDITION == 'Second Edition') {
    editorElements.push(
      ['skills', 'Skills', 'bag', 'skills'],
    );
  }
  editorElements.push(
    ['languages', 'Languages', 'set', 'languages'],
    ['hitPoints', 'Hit Points', 'text', [4, '(\\+?\\d+)']],
    ['armor', 'Armor', 'select-one', 'armors'],
    ['shield', 'Shield', 'select-one', 'shields'],
    ['weapons', 'Weapons', 'setbag', 'weapons'],
    ['weaponProficiency', 'Weapon Proficiency', 'set', 'weapons']
  );
  if(OldSchool.EDITION != 'First Edition') {
    editorElements.push(
      ['weaponSpecialization', 'Specialization', 'select-one',
       ['None'].concat(QuilvynUtils.getKeys(OldSchool.WEAPONS))]
    );
  }
  editorElements.push(
    ['spells', 'Spells', 'fset', 'spells'],
    ['notes', 'Notes', 'textarea', [40,10]],
    ['hiddenNotes', 'Hidden Notes', 'textarea', [40,10]]
  );
  return editorElements;
};

/* Returns an array of plugins upon which this one depends. */
OldSchool.getPlugins = function() {
  return [OSRIC].concat(OSRIC.getPlugins());
};

/* Returns HTML body content for user notes associated with this rule set. */
OldSchool.ruleNotes = function() {
  return '' +
    '<h2>Quilvyn First and Second Edition Rule Sets Notes</h2>\n' +
    'Quilvyn First and Second Edition Rule Sets Version ' + OldSchool.VERSION + '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    For convenience, Quilvyn reports THAC0 values for First Edition\n' +
    '    characters. It also reports THAC10 ("To Hit Armor Class\n' +
    '    10"), which can be more useful with characters who need a 20 to\n' +
    '    hit AC 0.\n' +
    '  </li><li>\n' +
    '    The 1E DMG rules mention that Magic Users of levels 7\n' +
    '    through 10 can create scrolls and potions only with the aid of an\n' +
    '    alchemist; at level 11 they can do such crafting unaided. The 1E\n' +
    '    DMG also mentions that higher-level Clerics and Druids can create\n' +
    '    potions and scrolls of their own spells.\n' +
    '  </li><li>\n' +
    '    Quilvyn assumes that Halfling characters are of pure Stoutish blood\n'+
    '    for the Infravision, Detect Slope, and Determine Direction features.\n' +
    '  </li><li>\n' +
    '    2E spell ranges are generally given in yards rather than feet, so,\n' +
    '    for example, "R10\'" in the W1 Grease spell should be read as 10\n' +
    '    yards for 2E characters.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn does not note racial restrictions on class and level.\n' +
    '  </li><li>\n' +
    '    Quilvyn does not note class restrictions on weapon choice.\n' +
    '  </li><li>\n' +
    '    Quilvyn does not note the First Edition prohibition on Neutral\n' +
    '    clerics.\n' +
    '  </li><li>\n' +
    '    Support for character levels 21+ is incomplete.\n' +
    '  </li><li>\n' +
    '    Quilvyn does not note the First Edition lower strength maximum\n' +
    '    for female characters.\n' +
    '  </li><li>\n' +
    '    Fractional percentages for First Edition Thief skills are not\n' +
    '    reported.\n' +
    '  </li><li>\n' +
    '    Minimum levels for building strongholds and attracting followers\n' +
    '    are not reported.\n' +
    '  </li><li>\n' +
    '    In Second Edition, Quilvyn does not consider sphere limitations\n' +
    '    on priest spell selections.\n' +
    '  </li><li>\n' +
    '    Quilvyn does not note Halfling characters with a strength of 18.\n' +
    '  </li><li>\n' +
    '    Quilvyn does not report the chance of extraordinary success on\n' +
    '    strength tests for characters with strength 18/91 and higher.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    'Quilvyn\'s First Edition and Second Edition rule sets are unofficial ' +
    'Fan Content permitted under Wizards of the Coast\'s ' +
    '<a href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</a>.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Wizards of the Coast. Portions ' +
    'of the materials used are property of Wizards of the Coast. ©Wizards of ' +
    'the Coast LLC.\n' +
    '</p><p>\n' +
    'Advanced Dungeons & Dragons Players Handbook © 2012 Wizards of the ' +
    'Coast LLC.\n' +
    '</p><p>\n' +
    'Advanced Dungeons & Dragons 2nd Edition Player\'s Handbook © 1989, ' +
    '1995, 2013 Wizards of the Coast LLC.\n' +
    '</p>\n';
};
