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

var OldSchool_VERSION = '2.2.1.13';

/*
 * This module loads the rules from the 1st Edition and 2nd Edition core rules,
 * and those from the Old School Reference and Index Compilation adaptation of
 * 1st Edition (OSRIC). The OldSchool function contains methods that load
 * rules for particular parts of the rule book; raceRules for character races,
 * magicRules for spells, etc. These member methods can be called independently
 * in order to use a subset of the OldSchool rules. Similarly, the constant
 * fields of OldSchool (LANGUAGES, RACES, etc.) can be manipulated to modify
 * the choices.
 */
function OldSchool() {

  if(window.SRD35 == null) {
    alert('The OldSchool module requires use of the SRD35 module');
    return;
  }

  for(OldSchool.EDITION in OldSchool.EDITIONS) {

    var rules = new QuilvynRules(OldSchool.EDITION, OldSchool_VERSION);

    rules.defineChoice('choices', OldSchool.CHOICES);
    rules.choiceEditorElements = OldSchool.choiceEditorElements;
    rules.choiceRules = OldSchool.choiceRules;
    rules.editorElements = SRD35.initialEditorElements();
    rules.getFormats = SRD35.getFormats;
    rules.getPlugins = OldSchool.getPlugins;
    rules.makeValid = SRD35.makeValid;
    rules.randomizeOneAttribute = OldSchool.randomizeOneAttribute;
    rules.defineChoice('random', OldSchool.RANDOMIZABLE_ATTRIBUTES);
    rules.ruleNotes = OldSchool.ruleNotes;

    SRD35.createViewers(rules, SRD35.VIEWERS);
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

    // Remove some editor elements that don't apply
    rules.defineEditorElement('animalCompanion');
    rules.defineEditorElement('animalCompanionName');
    rules.defineEditorElement('experience');
    rules.defineEditorElement('familiar');
    rules.defineEditorElement('familiarName');
    rules.defineEditorElement('familiarEnhancement');
    rules.defineEditorElement('levels');
    if(OldSchool.EDITION != 'Second Edition')
      rules.defineEditorElement('skills');

    // Add additional elements to editor and sheet
    rules.defineEditorElement
      ('extraStrength', 'Extra Strength', 'text', [4], 'dexterity');
    rules.defineEditorElement
      ('experiencePoints', 'Experience', 'bag', 'levels', 'imageUrl');
    rules.defineEditorElement
      ('weaponProficiency', 'Weapon Proficiency', 'set', 'weapons', 'spells');
    if(OldSchool.EDITION != 'First Edition') {
      rules.defineEditorElement
        ('weaponSpecialization', 'Specialization', 'select-one',
         ['None'].concat(QuilvynUtils.getKeys(rules.getChoices('weapons'))),
         'spells');
      rules.defineEditorElement
        ('doubleSpecialization', '', 'checkbox', ['Doubled'], 'spells');
    }
    rules.defineSheetElement
      ('Experience Points', 'Level', '<b>Experience/Needed</b>: %V', '; ');
    rules.defineSheetElement('Extra Strength', 'Strength+', '/%V');
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
    rules.defineSheetElement
      ('Thac0Info', 'AttackInfo', '<b>THAC0 Melee/Ranged</b>: %V', '/');
    rules.defineSheetElement('Thac0 Melee', 'Thac0Info/', '%V');
    rules.defineSheetElement('Thac0 Ranged', 'Thac0Info/', '%V');
    rules.defineSheetElement
      ('Thac10Info', 'AttackInfo', '<b>THAC10 Melee/Ranged</b>: %V', '/');
    rules.defineSheetElement('Thac10 Melee', 'Thac10Info/', '%V');
    rules.defineSheetElement('Thac10 Ranged', 'Thac10Info/', '%V');
    rules.defineSheetElement('AttackInfo');
    rules.defineSheetElement('Turn Undead', 'Combat Notes', null);
    rules.defineSheetElement
      ('Understand Spell', 'Spell Slots', '<b>%N</b>: %V%');
    rules.defineSheetElement('Maximum Spells Per Level', 'Spell Slots');

    Quilvyn.addRuleSet(rules);

  }

}

OldSchool.EDITION = 'First Edition';
OldSchool.EDITIONS = {
  'First Edition':'',
  'Second Edition':'',
  'OSRIC':''
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
  'charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom',
  'extraStrength', 'name', 'race', 'gender', 'alignment', 'levels',
  'languages', 'hitPoints', 'proficiencies', 'armor', 'shield', 'weapons',
  'spells'
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
  'None':'AC=0 Move=120 Weight=0',
  'Banded':'AC=6 Move=90 Weight=35',
  'Chain':'AC=5 Move=90 Weight=30',
  'Elven Chain':'AC=5 Move=120 Weight=15',
  'Leather':'AC=2 Move=120 Weight=15',
  'Padded':'AC=2 Move=90 Weight=10',
  'Plate':'AC=7 Move=60 Weight=45',
  'Ring':'AC=3 Move=90 Weight=35',
  'Scale Mail':'AC=4 Move=60 Weight=40',
  'Splint':'AC=6 Move=60 Weight=40',
  'Studded Leather':'AC=3 Move=90 Weight=20',
};
OldSchool.CLASSES = {
  'Assassin':
    'Require=' +
      '"alignment =~ \'Evil\'","constitution >= 6","dexterity >= 12",' +
      '"intelligence >= 11","strength >= 12" ' +
    'HitDie=d6 Attack=-1,2,4 WeaponProficiency=3,4,2 ' +
    'Breath=16,1,4 Death=13,1,4 Petrification=12,1,4 Spell=15,2,4 Wand=14,2,4 '+
    'Features=' +
      '"1:Armor Proficiency (Leather/Studded Leather)",' +
      '"1:Shield Proficiency (All)",' +
      '1:Assassination,1:Backstab,1:Disguise,"3:Rogue Skills",' +
      '"intelligence >= 15? 9:Bonus Languages",' +
      '"12:Read Scrolls" ' +
    'Experience=0,1.5,3,6,12,25,50,100,200,300,425,575,750,1000,1500',
  'Bard':
    'Require=' +
      '"alignment =~ \'Neutral\'","charisma >= 15","constitution >= 10",' +
      '"dexterity >= 15","intelligence >= 12","strength >= 15",' +
      '"wisdom >= 15","levels.Fighter >= 5","levels.Thief >= 5",' +
      '"race =~ \'Human|Half-Elf\'" ' +
    'HitDie=d6 Attack=0,2,2 WeaponProficiency=2,5,4 ' +
    'Breath=16,1,3 Death=10,1,3 Petrification=13,1,3 Spell=15,1,3 Wand=14,1,3 '+
    'Features=' +
      '"1:Armor Proficiency (Leather)",' +
      '"1:Charming Music","1:Defensive Song","1:Legend Lore",' +
      '"1:Poetic Inspiration","1:Resist Fire","1:Resist Lightning",' +
      '"3:Nature Knowledge","3:Wilderness Movement","7:Fey Immunity",' +
      '7:Shapeshift ' +
    'Experience=' +
      '0,2,4,8,16,25,40,60,85,110,150,200,400,600,800,1000,1200,1400,1600,' +
      '1800 ' +
    'CasterLevelDivine=levels.Bard ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'D1:1=1;2=2;3=3;16=4;19=5,' +
      'D2:4=1;5=2;6=3;17=4;21=5,' +
      'D3:7=1;8=2;9=3;18=4;22=5,' +
      'D4:9=1;10=2;11=3;19=4;23=5,' +
      'D5:9=1;10=2;12=3;13=4;14=5,' +
      'D6:13=1;14=2;15=3;20=4;23=5',
  'Cleric':
    'Require=' +
      '"wisdom >= 9" ' +
    'HitDie=d8 Attack=0,2,3 WeaponProficiency=2,4,3 ' +
    'Breath=16,1,3 Death=10,1,3 Petrification=13,1,3 Spell=15,1,3 Wand=14,1,3 '+
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"1:Turn Undead",' +
      '"wisdom >= 16 ? 1:Bonus Cleric Experience",' +
      '"wisdom >= 13 ? 1:Bonus Cleric Spells",' +
      '"wisdom <= 12 ? 1:Cleric Spell Failure" ' +
    'Experience=' +
      '0,1.5,3,6,13,27.5,55,110,225,450,675,900,1125,1350,1575,1800,2025,' +
      '2250,2475,2700 ' +
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
    'HitDie=d8 Attack=0,2,3 WeaponProficiency=2,5,4 ' +
    'Breath=16,1,3 Death=10,1,3 Petrification=13,1,3 Spell=15,1,3 Wand=14,1,3 '+
    'Features=' +
      '"1:Armor Proficiency (Leather)","1:Shield Proficiency (Small Shield)",' +
      '"charisma >= 16/wisdom >= 16 ? 1:Bonus Druid Experience",' +
      '"wisdom >= 13 ? 1:Bonus Druid Spells",' +
      '"1:Resist Fire","1:Resist Lightning","3:Nature Knowledge",' +
      '"3:Wilderness Movement","3:Woodland Languages","7:Fey Immunity",' +
      '7:Shapeshift ' +
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
    'HitDie=d10 Attack=0,2,2 WeaponProficiency=4,3,2 ' +
    'Breath=17,1.5,2 Death=14,1.5,2 Petrification=15,1.5,2 Spell=17,1.5,2 Wand=16,1.5,2 ' +
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"strength >= 16 ? 1:Bonus Fighter Experience",' +
      '"1:Fighting The Unskilled" ' +
    'Experience=' +
      '0,2,4,8,18,25,70,125,250,500,750,1000,1250,1500,1750,2000,2250,2500,' +
      '2750,3000',
  'Illusionist':
    'Require="dexterity >= 16","intelligence >= 15" ' +
    'HitDie=d4 Attack=-1,2,5 WeaponProficiency=1,6,5 ' +
    'Breath=15,2,5 Death=14,1.5,5 Petrification=13,2,5 Spell=12,2,5 Wand=11,2,5 '+
    'Features=' +
      '"10:Craft Minor Magic" ' +
    'CasterLevelArcane=levels.Illusionist ' +
    'Experience=' +
      '0,2.25,4.5,9,18,35,60,95,145,220,440,660,880,1100,1320,1540,1760,1980,' +
      '2200,2420 ' +
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
    'HitDie=d4 Attack=-1,2,5 WeaponProficiency=1,6,5 ' +
    'Breath=15,2,5 Death=14,1.5,5 Petrification=13,2,5 Spell=12,2,5 ' +
    'Wand=11,2,5 '+
    'Features=' +
      '"intelligence >= 16 ? 1:Bonus Magic User Experience",' +
      '"7:Craft Minor Magic" ' +
    'Experience=' +
      '0,2.5,5,10,22.5,40,60,90,135,250,375,750,1125,1500,1875,2250,2625,' +
      '3000,3375,3750 ' +
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
    'HitDie=d4 Attack=1,2,4 WeaponProficiency=1,2,3 ' +
    'Breath=16,1,4 Death=13,1,4 Petrification=12,1,4 Spell=15,2,4 Wand=14,2,4 '+
    'Features=' +
      '"1:Dodge Missiles",1:Evasion,"1:Killing Blow","1:Rogue Skills",' +
      '1:Spiritual,"1:Stunning Blow",1:Unburdened,2:Aware,' +
      '"3:Speak With Animals","4:Flurry Of Blows","4:Masked Mind",' +
      '"4:Slow Fall","5:Controlled Movement","5:Purity Of Body",' +
      '"6:Feign Death","7:Wholeness Of Body","8:Speak With Plants",' +
      '"9:Clear Mind","9:Improved Evasion","10:Steel Mind","11:Diamond Body",' +
      '"12:Free Will","13:Quivering Palm" ' +
    'Experience=' +
      '0,2.25,4.75,10,22.5,47.5,98,200,350,500,700,950,1250,1750,2250,2750,' +
      '3250',
  'Paladin':
    'Require=' +
      '"alignment == \'Lawful Good\'","charisma >= 17","constitution >= 9",' +
      '"intelligence >= 9","strength >= 12","wisdom >= 13" ' +
    'HitDie=d10 Attack=0,2,2 WeaponProficiency=3,3,2 ' +
    'Breath=17,1.5,2 Death=14,1.5,2 Petrification=15,1.5,2 Spell=17,1.5,2 ' +
    'Wand=14,1.5,2 ' +
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"strength >= 16/wisdom >= 16 ? 1:Bonus Paladin Experience",' +
      '"1:Cure Disease","1:Detect Evil",1:Discriminating,"1:Divine Health",' +
      '"1:Divine Protection","1:Fighting The Unskilled","1:Lay On Hands",' +
      '1:Non-Materialist,1:Philanthropist,"1:Protection From Evil",' +
      '"3:Turn Undead","4:Summon Warhorse" ' +
    'Experience=' +
      '0,2.75,5.5,12,24,45,95,175,350,700,1050,1400,1750,2100,2450,2800,3150,' +
      '3500,3850,4200 ' +
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
    'HitDie=d8 Attack=0,2,2 WeaponProficiency=3,3,2 ' +
    'Breath=17,1.5,2 Death=14,1.5,2 Petrification=15,1.5,2 Spell=17,1.5,2 ' +
    'Wand=16,1.5,2 ' +
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"strength >= 16/intelligence >= 16/wisdom >= 16 ? 1:Bonus Ranger Experience",' +
      '1:Alert,"1:Favored Enemy","1:Fighting The Unskilled",1:Loner,' +
      '1:Selective,1:Track,"1:Travel Light",10:Scrying,' +
      '"10:Band Of Followers" ' +
    'Experience=' +
      '0,2.25,4.5,10,20,40,90,150,225,325,650,975,1300,1625,2000,2325,2650,' +
      '2975,3300,3625 ' +
    'CasterLevelArcane=' +
      '"levels.Ranger >= 8 ? Math.floor((levels.Ranger - 6) / 2) : null" ' +
    'CasterLevelDivine=' +
      '"levels.Ranger >= 9 ? Math.floor((levels.Ranger - 6) / 2) : null" ' +
      'SpellAbility=wisdom ' +
      'SpellSlots=' +
        'D1:8=1;10=2;18=3;23=4,' +
        'D2:12=1;14=2;20=3,' +
        'D3:16=1;17=2;22=3,' +
        'M1:9=1;11=2;19=3;24=4,' +
        'M2:13=1;15=2;21=3',
  'Thief':
    'Require=' +
      '"alignment =~ \'Neutral|Evil\'","dexterity >= 9" ' +
    'HitDie=d6 Attack=-1,2,4 WeaponProficiency=2,4,3 ' +
    'Breath=16,1,4 Death=13,1,4 Petrification=12,1,4 Spell=15,2,4 Wand=14,2,4 '+
    'Features=' +
      '"1:Armor Proficiency (Leather/Studded Leather)",' +
      '"dexterity >= 16 ? 1:Bonus Thief Experience",' +
      '1:Backstab,"1:Rogue Skills","10:Read Scrolls" ' +
    'Experience=' +
      '0,1.25,2.5,5,10,20,42.5,70,110,160,220,440,660,880,1100,1320,1540,' +
      '1760,1980,2200'
};
OldSchool.FEATURES = {

  // Class
  'Alert':'Section=combat Note="Surprised 1/6, surprise 1/2"',
  'Assassination':
    'Section=combat Note="Strike kills surprised target %V% - 5%/2 foe levels"',
  'Aware':'Section=combat Note="Surprised %V%"',
  'Backstab':
    'Section=combat Note="+4 melee attack, x%V damage when surprising"',
  'Band Of Followers':'Section=feature Note="Will attract followers"',
  'Bonus Cleric Experience':
    'Section=ability Note="10% added to awarded experience"',
  'Bonus Cleric Spells':'Section=magic Note="%1/%2/%3/%4"',
  'Bonus Druid Experience':
    'Section=ability Note="10% added to awarded experience"',
  'Bonus Druid Spells':'Section=magic Note="%1/%2/%3/%4"',
  'Bonus Fighter Experience':
    'Section=ability Note="10% added to awarded experience"',
  'Bonus Languages':'Section=feature Note="+%V Language Count"',
  'Bonus Magic User Experience':
    'Section=ability Note="10% added to awarded experience"',
  'Bonus Paladin Experience':
    'Section=ability Note="10% added to awarded experience"',
  'Bonus Ranger Experience':
    'Section=feature Note="10% added to awarded experience"',
  'Bonus Thief Experience':
    'Section=ability Note="10% added to awarded experience"',
  'Charming Music':
    'Section=magic Note="R40\' %V% charm creatures while playing (save 1 rd)"',
  'Clear Mind':
    'Section=save ' +
    'Note="%V% resistance to beguiling, charm, hypnosis and suggestion spells"',
  'Cleric Spell Failure':'Section=magic Note="%V%"',
  'Controlled Movement':
    'Section=save Note="Immune <i>Haste</i> and <i>Slow</i>"',
  'Craft Minor Magic':
    'Section=magic ' +
    'Note="May create magical potions and scrolls and recharge rods, staves, and wands%1"',
  'Cure Disease':'Section=magic Note="<i>Cure Disease</i> %V/wk"',
  'Defensive Song':
    'Section=magic Note="Counteract song attacks, soothe shriekers"',
  'Detect Evil':'Section=magic Note="R60\' <i>Detect Evil</i> at will"',
  'Diamond Body':'Section=save Note="Immune to poison"',
  'Discriminating':
    'Section=feature Note="Must not associate w/non-good characters"',
  'Disguise':'Section=feature Note="92%+ successful disguise"',
  'Divine Health':'Section=save Note="Immune to disease"',
  'Divine Protection':
    'Section=save Note="-2 Breath/-2 Death/-2 Petrification/-2 Spell/-2 Wand"',
  'Dodge Missiles':
    'Section=combat Note="Petrification save to dodge non-magical missiles"',
  'Double Specialization':
    'Section=combat Note="+3 %V Attack Modifier/+3 %V Damage Modifier"',
  'Evasion':
    'Section=save Note="Successful save yields no damage instead of half"',
  'Favored Enemy':'Section=combat Note="+%V melee damage vs. giant foes"',
  'Feign Death':'Section=feature Note="Appear dead for %V tn"',
  'Fey Immunity':'Section=save Note="Immune to fey enchantment"',
  'Fighting The Unskilled':
    'Section=combat Note="%V attacks/rd vs. creatures with lt 1d8 hit die"',
  'Flurry Of Blows':'Section=combat Note="%V unarmed attacks/rd"',
  'Free Will':'Section=save Note="Immune <i>Geas</i> and <i>Quest</i> spells"',
  'Improved Evasion':'Section=save Note="Failed save yields half damage"',
  'Killing Blow':
    'Section=combat Note="%V+foe AC% kill w/Stunning Blow"',
  'Lay On Hands':'Section=magic Note="Touch heals %V HP 1/dy"',
  'Legend Lore':
    'Section=feature Note="%V% info about legendary item, person, place"',
  'Loner':'Section=feature Note="Will not work with gt 2 other rangers"',
  'Masked Mind':'Section=save Note="%V% resistance to ESP"',
  'Nature Knowledge':
    'Section=feature ' +
    'Note="Identify plant and animal types, determine water purity"',
  'Non-Materialist':
    'Section=feature Note="Owns le 10 magic items w/1 armor suit and 1 shield"',
  'Philanthropist':
    'Section=feature ' +
    'Note="Must donate 10% of income plus 100% after expenses to LG causes"',
  'Poetic Inspiration':
    'Section=magic ' +
    'Note="Performance gives allies +1 attack, +10% morale for 1 tn after 2 rd"',
  'Precise Blow':'Section=combat Note="+%V weapon damage"',
  'Protection From Evil':
    'Section=magic Note="Continuous <i>Protection From Evil</i> 10\' radius"',
  'Purity Of Body':'Section=save Note="Immune to normal disease"',
  'Quivering Palm':
    'Section=combat Note="Touched w/fewer hit dice dies w/in %V dy 1/wk"',
  'Read Scrolls':
    'Section=magic Note="75% cast arcane or druidic spell from scroll"',
  'Resist Fire':'Section=save Note="+2 vs. fire"',
  'Resist Lightning':'Section=save Note="+2 vs. lightning"',
  'Rogue Skills':
    'Section=skill ' +
    'Note="+%1 Climb Walls/+%2 Find Traps/+%3 Hear Noise/+%4 Hide In Shadows/+%5 Move Silently/+%6 Open Locks/+%7 Pick Pockets/+%8 Read Languages"',
  'Scrying':'Section=magic Note="May use scrying magic items"',
  'Selective':'Section=feature Note="Must employ only good henchmen"',
  'Shapeshift':
    'Section=magic Note="Change into natural animal 3/dy, healing d6x10% HP"',
  'Slow Fall':'Section=save Note="No damage from fall of %1 w/in %2\' of wall"',
  'Speak With Animals':'Section=magic Note="<i>Speak With Animals</i> at will"',
  'Speak With Plants':'Section=magic Note="<i>Speak With Plants</i> at will"',
  'Spiritual':
    'Section=feature ' +
    'Note="Must donate 100% after expenses to religious institution"',
  'Steel Mind':'Section=save Note="Resist telepathy and mind blast as int 18"',
  'Stunning Blow':
     'Section=combat ' +
    'Note="Foe stunned for 1d6 rd when unarmed attack succeeds by ge 5"',
  'Summon Warhorse':
    'Section=feature Note="Call warhorse w/enhanced features"',
  'Track':
    'Section=feature Note="90% rural, 65%+ urban or dungeon creature tracking"',
  'Travel Light':
    'Section=feature Note="Will not possess more than can be carried"',
  'Turn Undead':
    'Section=combat ' +
    'Note="2d6 undead turned, destroyed (good) or controlled (evil)"',
  'Unburdened':'Section=feature Note="Own le 5 magic items"',
  'Weapon Specialization':
     'Section=combat ' +
    'Note="+%1 %V Attack Modifier/+%2 %V Damage Modifier/+%3 attacks/rd"',
  'Wholeness Of Body':'Section=magic Note="Heal 1d4+%V damage to self 1/dy"',
  'Wilderness Movement':
     'Section=feature Note="Normal, untrackable move through undergrowth"',

  // Race
  'Bow Precision':
    'Section=combat ' +
    'Note="+1 Composite Longbow Attack Modifier/+1 Composite Shortbow Attack Modifier/+1 Longbow Attack Modifier/+1 Shortbow Attack Modifier"',
  'Burrow Tongue':'Section=feature Note="Speak w/burrowing animals"',
  'Deadly Aim':
    'Section=combat ' +
    'Note="+3 Composite Longbow Attack Modifier/+3 Composite Shortbow Attack Modifier/+3 Longbow Attack Modifier/+3 Shortbow Attack Modifier/+3 Sling Attack Modifier"',
  'Detect Secret Doors':
    'Section=feature Note="1in6 passing, 2in6 searching, 3in6 concealed"',
  'Direction Sense':'Section=feature Note="50% Determine direction of travel"',
  'Dwarf Ability Adjustment':
    'Section=ability Note="+1 Constitution/-1 Charisma"',
  'Dwarf Dodge':'Section=combat Note="-4 AC vs. giant, ogre, titan, troll"',
  'Dwarf Enmity':'Section=combat Note="+1 attack vs. goblinoid and orc"',
  'Dwarf Skill Modifiers':
    'Section=skill ' +
    'Note="-10 Climb Walls/+15 Find Traps/+10 Open Locks/-5 Read Languages"',
  'Elf Ability Adjustment':
    'Section=ability Note="+1 Dexterity/-1 Constitution"',
  'Elf Skill Modifiers':
    'Section=skill ' +
    'Note="+5 Hear Noise/+10 Hide In Shadows/+5 Move Silently/-5 Open Locks/+5 Pick Pockets"',
  'Gnome Dodge':
    'Section=combat Note="-4 AC vs. bugbear, giant, gnoll, ogre, titan, troll"',
  'Gnome Enmity':'Section=combat Note="+1 attack vs. goblins and kobolds"',
  'Gnome Skill Modifiers':
    'Section=skill ' +
    'Note="-15 Climb Walls/+10 Find Traps/+10 Hear Noise/+5 Hide In Shadows/+5 Move Silently/+5 Open Locks"',
  'Half-Elf Skill Modifiers':
    'Section=skill Note="+5 Hide In Shadows/+10 Pick Pockets"',
  'Half-Orc Ability Adjustment':
    'Section=ability Note="+1 Strength/+1 Constitution/-2 Charisma"',
  'Half-Orc Skill Modifiers':
    'Section=skill ' +
    'Note="+5 Climb Walls/+5 Find Traps/+5 Hear Noise/+5 Open Locks/-5 Pick Pockets/-10 Read Languages"',
  'Halfling Ability Adjustment':
    'Section=ability Note="+1 Dexterity/-1 Strength"',
  'Halfling Skill Modifiers':
    'Section=skill ' +
    'Note="-15 Climb Walls/+5 Find Traps/+5 Hear Noise/+15 Hide In Shadows/+10 Move Silently/+5 Open Locks/+5 Pick Pockets/-5 Read Languages"',
  'Infravision':'Section=feature Note="60\' vision in darkness"',
  'Know Depth':
    'Section=feature Note="%V% Determine approximate depth underground"',
  'Resist Charm':'Section=save Note="%V% vs. charm"',
  'Resist Magic':'Section=save Note="-%V Spell/-%V Wand"',
  'Resist Poison':'Section=save Note="+%V vs. poison"',
  'Resist Sleep':'Section=save Note="%V% vs. sleep"',
  'Sense Construction':
    'Section=feature Note="R10\' 75% Detect new construction"',
  'Sense Hazard':
    'Section=feature Note="R10\' 70% Detect unsafe wall, ceiling, floor"',
  'Sense Sliding':'Section=feature Note="R10\' 66% Detect sliding walls"',
  'Sense Slope':'Section=feature Note="R10\' %V% Detect slope and grade"',
  'Stealthy':
    'Section=combat ' +
    'Note="4in6 surprise when traveling quietly, 2in6 opening doors"',
  'Sword Precision':
    'Section=combat ' +
    'Note="+1 Long Sword Attack Modifier/+1 Short Sword Attack Modifier"',
  'Trap Sense':'Section=feature Note="R10\' 50% Detect stonework traps"'

};
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
    'Pattern="([-+]\\d)\\s+charisma|charisma\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=charisma ' +
    'Section=ability Note="%V Charisma"',
  'Constitution':
    'Pattern="([-+]\\d)\\s+constitution|constitution\\s+([-+]\\d)" ' +
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
    'Pattern="([-+]\\d)\\s+dexterity|dexterity\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=dexterity ' +
    'Section=ability Note="%V Dexterity"',
  'Intelligence':
    'Pattern="([-+]\\d)\\s+intelligence|intelligence\\s+([-+]\\d)" ' +
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
    'Pattern="([-+]\\d)\\s+strength|strength\\s+([-+]\\d)" ' +
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
    'Pattern="([-+]\\d)\\s+wisdom|wisdom\\s+([-+]\\d)" ' +
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
      '"1:Dwarf Ability Adjustment","1:Dwarf Dodge","1:Dwarf Enmity",' +
      '1:Infravision,"1:Know Depth","1:Resist Magic","1:Resist Poison",' +
      '"1:Sense Construction","1:Sense Sliding","1:Sense Slope",' +
      '"1:Trap Sense",' +
      '"rogueSkillLevel > 0 ? 1:Dwarf Skill Modifiers" ' +
    'Languages=' +
      'Common,Dwarf,Gnome,Goblin,Kobold,Orc',
  'Elf':
    'Require=' +
      '"charisma >= 8","constitution >= 8","dexterity >= 7",' +
      '"intelligence >= 8" ' +
    'Features=' +
      '"1:Bow Precision","1:Detect Secret Doors","1:Elf Ability Adjustment",' +
      '1:Infravision,"1:Resist Charm","1:Resist Sleep",1:Stealthy,' +
      '"1:Sword Precision",' +
      '"rogueSkillLevel > 0 ? 1:Elf Skill Modifiers" ' +
    'Languages=' +
      'Common,Elf,Gnoll,Gnome,Goblin,Halfling,Hobgoblin,Orc',
  'Gnome':
    'Require=' +
      '"constitution >= 8","intelligence >= 7","strength >= 6" ' +
    'Features=' +
      '"1:Burrow Tongue","1:Direction Sense","1:Gnome Dodge",' +
      '"1:Gnome Enmity",1:Infravision,"1:Know Depth","1:Resist Magic",' +
      '"1:Sense Hazard","1:Sense Slope",' +
      '"rogueSkillLevel > 0 ? 1:Gnome Skill Modifiers" ' +
    'Languages=' +
      'Common,Dwarf,Gnome,Goblin,Halfling,Kobold',
  'Half-Elf':
    'Require=' +
      '"constitution >= 6","dexterity >= 6","intelligence >= 4" ' +
    'Features=' +
      '"1:Detect Secret Doors",1:Infravision,"1:Resist Charm",' +
      '"1:Resist Sleep",' +
      '"rogueSkillLevel > 0 ? 1:Half-Elf Skill Modifiers" ' +
    'Languages=' +
      'Common,Elf,Gnoll,Gnome,Goblin,Halfling,Hobgoblin,Orc',
  'Half-Orc':
    'Require=' +
      '"charisma <= 12","constitution >= 13","dexterity <= 17",' +
      '"intelligence <= 17","strength >= 6","wisdom <= 14" ' +
    'Features=' +
      '"1:Half-Orc Ability Adjustment",1:Infravision,' +
      '"rogueSkillLevel > 0 ? 1:Half-Orc Skill Modifiers" ' +
    'Languages=' +
      'Common,Orc',
  'Halfling':
    'Require=' +
      '"constitution >= 10","dexterity >= 8","intelligence >= 6",' +
      '"strength >= 6","wisdom <= 17" ' +
    'Features=' +
      '"1:Deadly Aim","1:Direction Sense","1:Halfling Ability Adjustment",' +
      '1:Infravision,"1:Resist Magic","1:Resist Poison","1:Sense Slope",' +
      '1:Stealthy,' +
      '"rogueSkillLevel > 0 ? 1:Halfling Skill Modifiers" ' +
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
  'Necromancy':''
};
OldSchool.SHIELDS = {
  'None':'AC=0 Weight=0',
  'Large Shield':'AC=1 Weight=10',
  'Medium Shield':'AC=1 Weight=8',
  'Small Shield':'AC=1 Weight=5'
};
OldSchool.SKILLS = {
  'Climb Walls':'Ability=strength Class=Assassin,Monk,Thief',
  'Find Traps':'Ability=dexterity Class=Assassin,Monk,Thief',
  'Hear Noise':'Ability=wisdom Class=Assassin,Monk,Thief',
  'Hide In Shadows':'Ability=dexterity Class=Assassin,Monk,Thief',
  'Move Silently':'Ability=dexterity Class=Assassin,Monk,Thief',
  'Open Locks':'Ability=dexterity Class=Assassin,Monk,Thief',
  'Pick Pockets':'Ability=dexterity Class=Assassin,Thief',
  'Read Languages':'Ability=intelligence Class=Assassin,Thief'
};
// To support class- and version-based differences in spell description, spell
// attributes may include values for Duration, Effect, and Range that are
// plugged into the $D, $E, and $R placeholders in the description text before
// any level-based variation ($L) is computed.
OldSchool.SPELLS = {
  'Aerial Servant':
    'School=Conjuration ' +
    'Level=C6 ' +
    'Description="R10\' Summoned servant fetches request within $L days"',
  'Affect Normal Fires':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description="R$L5\' Change size of up to $E fire from candle flame to $E for $D" ' +
    'Duration="$L rd" ' +
    'Effect="1.5\' radius"',
  'Airy Water':
    'School=Alteration ' +
    'Level=M5 ' +
    'Description="Water in 10\' radius around self breathable for $L tn"',
  'Alter Reality':
    'School=Illusion ' +
    'Level=I7 ' +
    'Description="Use <i>Phantasmal Force</i> to fulfill limited wish"',
  'Animal Friendship':
    'School=Enchantment ' +
    'Level=D1 ' +
    'Description="R10\' Recruit animal companion (save neg)"',
  'Animal Growth':
    'School=Alteration ' +
    'Level=D5,M5 ' +
    'Description="R$R Dbl (rev halve) size, HD, and damage of 8 animals for $D" ' +
    'Duration="$L rd" ' +
    'Range="60\'"',
  'Animal Growth D5':
    'Duration="$L2 rd" ' +
    'Range="80\'"',
  'Animal Summoning I':
    'School=Conjuration ' +
    'Level=D4 ' +
    'Description="R$R Draw 8 4 HD animals to assist" ' +
    'Range="$L40\'"',
  'Animal Summoning II':
    'School=Conjuration ' +
    'Level=D5 ' +
    'Description="R$R Draw 6 8 HD or 12 4 HD animals to assist" ' +
    'Range="$L60\'"',
  'Animal Summoning III':
    'School=Conjuration ' +
    'Level=D6 ' +
    'Description="R$R Draw 4 16 HD, 8 8 HD, or 16 4 HD animals to assist" ' +
    'Range="$L80\'"',
  'Animate Dead':
    'School=Necromancy ' +
    'Level=C3,M5 ' +
    'Description="R10\' Animated humanoid remains totaling $L HD obey simple commands"',
  'Animate Object':
    'School=Alteration ' +
    'Level=C6 ' +
    'Description="R30\' Target object obeys simple commands for $L rd"',
  'Animate Rock':
    'School=Alteration ' +
    'Level=D7 ' +
    'Description="R40\' Target $L2\' cu rock obeys simple commands for $L rd"',
  'Anti-Animal Shell':
    'School=Abjuration ' +
    'Level=D6 ' +
    'Description="Self 10\' radius blocks animal matter for $L tn"',
  'Anti-Magic Shell':
    'School=Abjuration ' +
    'Level=M6 ' +
    'Description="$L5\' radius allows no magic inside, moves with self for $L tn"',
  'Anti-Plant Shell':
    'School=Abjuration ' +
    'Level=D5 ' +
    'Description="Self $R blocks plant matter for $L tn" ' +
    'Range="80\' radius"',
  'Antipathy/Sympathy':
    'School=Enchantment ' +
    'Level=M8 ' +
    'Description="R30\' $L10\' cu or object repels or attracts specified creature type or alignment for $L2 hr (save reduces effect)"',
  'Astral Spell':
    'School=Alteration ' +
    'Level=C7,I7,M9 ' +
    'Description="Self and $E others leave bodies to travel astral plane" ' +
    'Effect="5"',
  'Atonement':
    'School=Abjuration ' +
    'Level=C5 ' +
    'Description="Touched relieved of consequences of unwilling alignment violation"',
  'Audible Glamer':
    'School=Illusion ' +
    'Level=I1,M2 ' +
    'Description="R$L10plus60\' Sounds of ${(lvl-2)*4} shouting for $D (save disbelieve)" ' +
    'Duration="$L3 rd"',
  'Audible Glamer M2':
    'Duration="$L2 rd"',
  'Augury':
    'School=Divination ' +
    'Level=C2 ' +
    'Description="Self $Lplus70% determine weal or woe of action in next 3 tn"',
  'Barkskin':
    'School=Alteration ' +
    'Level=D2 ' +
    'Description="Touched $E for $Lplus4 rd" ' +
    'Effect="+1 AC, non-spell saves"',
  'Blade Barrier':
    'School=Evocation ' +
    'Level=C6 ' +
    'Description="R30\' Whirling blade wall 8d8 HP to passers for $L3 rd"',
  'Bless':
    'School=Conjuration ' +
    'Level=C1 ' +
    'Description="R60\' Unengaged allies in 50\' sq +1 attack and morale (rev foes -1) for 6 rds"',
  'Blindness':
    'School=Illusion ' +
    'Level=I2 ' +
    'Description="R$R Target blinded (save neg)" ' +
    'Range="30\'"',
  'Blink':
    'School=Alteration ' +
    'Level=M3 ' +
    'Description="Self random teleport $E for $L rd" ' +
    'Effect="2\'/rd"',
  'Blur':
    'School=Illusion ' +
    'Level=I2 ' +
    'Description="Self +1 magical saves, foes -4 first attack, -2 thereafter for $Lplus3 rd"',
  'Burning Hands':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description="Self $E of flame $L HP" ' +
    'Effect="3\' cone"',
  'Cacodemon':
    'School=Conjuration ' +
    'Level=M7 ' +
    'Description="R10\' Summon demon or devil"',
  'Call Lightning':
    'School=Alteration ' +
    'Level=D3 ' +
    'Description="R360\' Clouds release ${lvl+2}d8 (save half) 10\' bolt 1/tn for $L tn"',
  'Call Woodland Beings':
    'School=Conjuration ' +
    'Level=D4 ' +
    'Description="R$R Draw forest denizens to assist (save neg)" ' +
    'Range="$L10plus120\'"',
  'Change Self':
    'School=Illusion ' +
    'Level=I1 ' +
    'Description="Self take any humanoid appearance for 2d6+$L2 rd"',
  'Chant':
    'School=Conjuration ' +
    'Level=C2 ' +
    'Description="R30\' Allies +1 attack, damage, saves (foes -1) during chant"',
  'Chaos':
    'School=Enchantment ' +
    'Level=I5 ' +
    'Description="R$L5\' Creatures in 40\' sq unpredictable for $L rd (save neg)"',
  'Chariot Of Fire':
    'School=Evocation ' +
    'Level=D7 ' +
    'Description="R10\' Flaming chariot and horse pair (ea AC 2, HP 30) drive self and 8 others 240\'/rd, fly 480\'/rd for $D" ' +
    'Duration="$Lplus6 tn"',
  'Charm Monster':
    'School=Enchantment ' +
    'Level=M4 ' +
    'Description="R60\' Target 2d4 HD creatures treat self as trusted friend (save neg)"',
  'Charm Person Or Mammal':
    'School=Enchantment ' +
    'Level=D2 ' +
    'Description="R80\' Target mammal treats self as trusted friend (save neg)"',
  'Charm Person':
    'School=Enchantment ' +
    'Level=M1 ' +
    'Description="R120\' Target humanoid treats self as trusted friend (save neg)"',
  'Charm Plants':
    'School=Enchantment ' +
    'Level=M7 ' +
    'Description="R30\' Command plants in 30\'x10\' area (save neg)"',
  'Clairaudience':
    'School=Divination ' +
    'Level=M3 ' +
    'Description="Hear remote known location for $L rd"',
  'Clairvoyance':
    'School=Divination ' +
    'Level=M3 ' +
    'Description="See remote known location for $L rd"',
  'Clenched Fist':
    'School=Evocation ' +
    'Level=M8 ' +
    'Description="R$L5\' Force absorbs attacks, strikes foes 1d6-4d6 HP for conc or $L rd"',
  'Clone':
    'School=Necromancy ' +
    'Level=M8 ' +
    'Description="Grow copy of target creature, each destroy the other or insane"',
  'Cloudkill':
    'School=Evocation ' +
    'Level=M5 ' +
    'Description="R10\' Poisonous 40\'x20\'x20\' cloud kills (5+2 HD save, 4+1 HD -4 save neg) moves 10\'/rd for $L rd"',
  'Color Spray':
    'School=Alteration ' +
    'Level=I1 ' +
    'Description=" 6 targets in $E unconscious (lt $Lplus1 HD), blinded 1d4 rd ($Lplus1-$Lplus2) or stunned 2d4 seg (gt $Lplus2) (save neg)" ' +
    'Effect="$L10\' cone"',
  'Command':
    'School=Enchantment ' +
    'Level=C1 ' +
    'Description="R$R Target obeys single-word command (save neg for Int 13+/HD 6+)" ' +
    'Range="10\'"',
  'Commune':
    'School=Divination ' +
    'Level=C5 ' +
    'Description="Self deity answers $L yes/no questions"',
  'Commune With Nature':
    'School=Divination ' +
    'Level=D5 ' +
    'Description="Self discern nature info in $Ldiv2 mi radius"',
  'Comprehend Languages':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description="Self understand unknown writing and speech for $L5 rd (rev obscures)"',
  'Cone Of Cold':
    'School=Evocation ' +
    'Level=M5 ' +
    'Description="Self $L5\'-long cone ${lvl}d4+$L HP (save half)"',
  'Confusion':
    'School=Enchantment ' +
    'Level=D7,I4,M4 ' +
    'Description="R$R $E unpredictable for $D (save neg 1 rd)" ' +
    'Duration="$Lplus2 rd" ' +
    'Effect="2d8 or more creatures in 60\' sq" ' +
    'Range="120\'"',
  'Confusion I4':
    'Duration="$L rd" ' +
    'Effect="2d8 or more creatures in 40\' sq" ' +
    'Range="80\'"',
  'Confusion D7':
    'Duration="$L rd" ' +
    'Effect="2d4 or more creatures in 20\' radius" ' +
    'Range="80\'"',
  'Conjure Animals':
    'School=Conjuration ' +
    'Level=C6,I6 ' +
    'Description="R30\' $E of animals appear and fight for $D" ' +
    'Duration="$L rd" ' +
    'Effect="$L HD"',
  'Conjure Animals C6':
    'Duration="$L2 rd"',
  'Conjure Earth Elemental':
    'School=Conjuration ' +
    'Level=D7 ' +
    'Description="R40\' $E assists for $L tn (rev dismisses)" ' +
    'Effect="16 HD elemental"',
  'Conjure Elemental':
    'School=Conjuration ' +
    'Level=M5 ' +
    'Description="R60\' Summoned elemental obeys commands for conc or $L tn"',
  'Conjure Fire Elemental':
    'School=Conjuration ' +
    'Level=D6 ' +
    'Description="R80\' $E assists for $L tn (rev dismisses)" ' +
    'Effect="16 HD elemental"',
  'Contact Other Plane':
    'School=Divination ' +
    'Level=M5 ' +
    'Description="Self gain answers to $Ldiv2 yes/no questions"',
  'Continual Darkness':
    'School=Alteration ' +
    'Level=I3 ' +
    'Description="R60\' 30\' radius opaque"',
  'Continual Light':
    'School=Alteration ' +
    'Level=C3,I3,M2 ' +
    'Description="R$R Target centers 60\' radius light (rev darkness) until dispelled" ' +
    'Range="60\'"',
  'Continual Light C3':
    'Range="120\'"',
  "Control Temperature 10' Radius":
    'School=Alteration ' +
    'Level=D4 ' +
    'Description="Change temperature in 10\' radius by $E for $Lplus4 tn" ' +
    'Effect="${lvl*9}F"',
  'Control Weather':
    'School=Alteration ' +
    'Level=C7,D7,M6 ' +
    'Description="Self controls precipitation, temp, and wind within $E for $D" ' +
    'Duration="4d6 hr" ' +
    'Effect="4d4 mi sq"',
  'Control Weather C7':
    'Duration="4d12 hr"',
  'Control Weather D7':
    'Duration="8d12 hr" ' +
    'Effect="4d8 mi sq"',
  'Control Winds':
    'School=Alteration ' +
    'Level=D5 ' +
    'Description="Winds in $L40\' radius speed or slow for $L tn"',
  'Create Food And Water':
    'School=Alteration ' +
    'Level=C3 ' +
    'Description="R10\' Creates $E food and drink" ' +
    'Effect="$L3 person/dy"',
  'Create Water':
    'School=Alteration ' +
    'Level=C1,D2 ' +
    'Description="R$R Creates (rev destroys) $E potable water" ' +
    'Effect="$L4 gallons" ' +
    'Range="10\'"',
  'Create Water D2':
    'Effect="$L\' cu"',
  'Creeping Doom':
    'School=Conjuration ' +
    'Level=D7 ' +
    'Description="Bugs erupt, attack w/in $E for $L4 rd" ' +
    'Effect="80\' radius"',
  'Crushing Hand':
    'School=Evocation ' +
    'Level=M9 ' +
    'Description="R$L5\' Force absorbs attacks, squeezes 1d10-4d10 HP for $L rd"',
  'Cure Blindness':
    'School=Abjuration ' +
    'Level=C3 ' +
    'Description="Touched cured of blindness (rev blinds) (save neg)"',
  'Cure Critical Wounds':
    'School=Necromancy ' +
    'Level=C5,D6 ' +
    'Description="Touched heals 3d8+3 HP (rev inflicts)"',
  'Cure Disease':
    'School=Abjuration ' +
    'Level=C3,D3 ' +
    'Description="Touched cured of disease (rev infects) (save neg)"',
  'Cure Light Wounds':
    'School=Necromancy ' +
    'Level=C1,D2 ' +
    'Description="Touched heals 1d8 HP (rev inflicts)"',
  'Cure Serious Wounds':
    'School=Necromancy ' +
    'Level=C4,D4 ' +
    'Description="Touched heals 2d8+1 HP (rev inflicts)"',
  'Dancing Lights':
    'School=Alteration ' +
    'Level=I1,M1 ' +
    'Description="R$L10plus40\' Up to 4 movable lights for $L2 rd"',
  'Darkness':
    'School=Alteration ' +
    'Level=I1,M2 ' +
    'Description="R$L10\' 15\' radius lightless for $D" ' +
    'Duration="$Lplus10 rd"',
  'Darkness I1':
    'Duration="2d4+$L rd"',
  'Deafness':
    'School=Illusion ' +
    'Level=I2 ' +
    'Description="R60\' Target deafened (save neg)"',
  'Death Spell':
    'School=Conjuration ' +
    'Level=M6 ' +
    'Description="R$L10\' Kills 4d20 points of creatures lt 9 HD in $E" ' +
    'Effect="$L5\' sq"',
  'Delayed Blast Fireball':
    'School=Evocation ' +
    'Level=M7 ' +
    'Description="R$L10plus100\' ${lvl}d6+$L HP in 20\' radius (save half) after up to 5 rd"',
  'Demi-Shadow Magic':
    'School=Illusion ' +
    'Level=I6 ' +
    'Description="R$L10plus60\' Mimics <i>Cloudkill</i> (die, save neg), <i>Cone Of Cold</i> (${lvl}d4+$L HP), <i>Fireball</i> (${lvl}d6 HP), <i>Lightning Bolt</i> (${lvl}d6 HP), <i>Magic Missile</i> (${Math.floor((lvl+1)/2)}x1d4+1 HP) (ea save $L2 HP), <i>Wall Of Fire</i> (2d6+$L HP, save ${lvl}d4), or <i>Wall Of Ice</i>"',
  'Demi-Shadow Monsters':
    'School=Illusion ' +
    'Level=I5 ' +
    'Description="R30\' Create monsters $L HD total, 40% HP (save AC 8, 40% damage) for $L rd"',
  'Detect Charm':
    'School=Divination ' +
    'Level=C2 ' +
    'Description="Self discern up to 10 charmed creatures in 30\' for 1 tn (rev shields 1 target)"',
  'Detect Evil':
    'School=Divination ' +
    'Level=C1,M2 ' +
    'Description="Self discern evil (rev good) in $R for $D" ' +
    'Duration="$L5 rd" ' +
    'Range="10\'x60\' path"',
  'Detect Evil C1':
    'Duration="$L5plus10 rd" ' +
    'Range="10\'x120\' path"',
  'Detect Illusion':
    'School=Divination ' +
    'Level=I1 ' +
    'Description="Self discern illusions in 10\'x$L10\' path, touching reveals to others for $L2plus3 rd"',
  'Detect Invisibility':
    'School=Divination ' +
    'Level=I1,M2 ' +
    'Description="Self see invisible objects in 10\'x$L10\' path for $L5 rd"',
  'Detect Lie':
    'School=Divination ' +
    'Level=C4 ' +
    'Description="R30\' $E discerns lies for $L rd (rev makes lies believable)" ' +
    'Effect="Target"',
  'Detect Magic':
    'School=Divination ' +
    'Level=C1,D1,I2,M1 ' +
    'Description="Self discern magical auras in $E for $D" ' +
    'Duration="$L2 rd" ' +
    'Effect="10\'x60\' path"',
  'Detect Magic C1':
    'Duration="1 tn" ' +
    'Effect="10\'x30\' path"',
  'Detect Magic D1':
    'Duration="12 rd" ' +
    'Effect="10\'x40\' path"',
  'Detect Pits And Snares':
    'School=Divination ' +
    'Level=D1 ' +
    'Description="Self discern outdoor traps, indoor pits in 10\'x40\' path for $L4 rd"',
  'Dig':
    'School=Evocation ' +
    'Level=M4 ' +
    'Description="R30\' Excavate 5\' cube/rd for $L rd"',
  'Dimension Door':
    'School=Alteration ' +
    'Level=M4 ' +
    'Description="Self teleport $L30\'"',
  'Disintegrate':
    'School=Alteration ' +
    'Level=M6 ' +
    'Description="R$L5\' Obliterates $E matter (save neg)" ' +
    'Effect="$L10\' sq"',
  'Dispel Exhaustion':
    'School=Illusion ' +
    'Level=I4 ' +
    'Description="4 Touched regain 50% HP, dbl speed 1/tn for $L3 tn"',
  'Dispel Evil':
    'School=Abjuration ' +
    'Level=C5 ' +
    'Description="Return evil (rev good) creatures to home plane (save neg, -7 attack caster for $L rd)"',
  'Dispel Illusion':
    'School=Abjuration ' +
    'Level=I3 ' +
    'Description="R$L10\' Dispel one illusion, 50% (+5%/-2% per caster level delta) dispel one magic"',
  'Dispel Magic':
    'School=Abjuration ' +
    'Level=C3,D4,M3 ' +
    'Description="R$R 50% (+5%/-2% per caster level delta) magic in $E extinguished" ' +
    'Effect="30\' cu" ' +
    'Range="120\'"',
  'Dispel Magic C3':
    'Range="60\'"',
  'Dispel Magic D4':
    'Effect="40\' cu" ' +
    'Range="80\'"',
  'Distance Distortion':
    'School=Alteration ' +
    'Level=M5 ' +
    'Description="R$L10\' Travel through $E half or dbl for $D" ' +
    'Duration="$L tn" ' +
    'Effect="$L100\' sq"',
  'Divination':
    'School=Divination ' +
    'Level=C4 ' +
    'Description="Self $Lplus60% discern info about known location"',
  'Duo-Dimension':
    'School=Alteration ' +
    'Level=M7 ' +
    'Description="Self 2D, take 3x damage from front/back, for $Lplus3 rd"',
  'ESP':
    'School=Divination ' +
    'Level=M2 ' +
    'Description="R$L5max90\' Self hear surface thoughts for $L rd"',
  'Earthquake':
    'School=Alteration ' +
    'Level=C7 ' +
    'Description="R120\' Intense shaking in $L5\' diameter for 1 rd"',
  'Emotion':
    'School=Enchantment ' +
    'Level=I4 ' +
    'Description="R$L10\' Targets in 40\' sq experience fear (flee), hate (+2 save/attack/damage), hopelessness (walk away or surrender), or rage (+1 attack, +3 damage, +5 HP) for conc"',
  'Enchant An Item':
    'School=Conjuration ' +
    'Level=M6 ' +
    'Description="Touched item becomes magical"',
  'Enchanted Weapon':
    'School=Alteration ' +
    'Level=M4 ' +
    'Description="Touched weapon magical $E for $L5 rd" ' +
    'Effect="(no bonus)"',
  'Enlarge':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description="R$L5\' Creature grows $L20max200% or object $L10max100% for $L tn (rev shrinks, save neg)"',
  'Entangle':
    'School=Alteration ' +
    'Level=D1 ' +
    'Description="R80\' Plants in $E hold passers (save move half) for 1 tn" ' +
    'Effect="20\' radius"',
  'Erase':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description="R30\' Erase magical ($L2plus50% chance) or normal ($L4plus50%) writing from 2-page area (save neg)"',
  'Exorcise':
    'School=Abjuration ' +
    'Level=C4 ' +
    'Description="R10\' Target relieved of supernatural inhabitant and influence"',
  'Explosive Runes':
    'School=Alteration ' +
    'Level=M3 ' +
    'Description="Reading runes on touched 6d4+6 HP to reader (no save), 10\' radius (save half)"',
  'Extension I':
    'School=Alteration ' +
    'Level=M4 ' +
    'Description="Existing level 1-3 spell lasts 50% longer"',
  'Extension II':
    'School=Alteration ' +
    'Level=M5 ' +
    'Description="Existing level 1-4 spell lasts 50% longer"',
  'Extension III':
    'School=Alteration ' +
    'Level=M6 ' +
    'Description="Existing level 1-3 spell lasts 100% longer or level 4-5 50%"',
  'Faerie Fire':
    'School=Alteration ' +
    'Level=D1 ' +
    'Description="R80\' Outlines targets, allowing +2 attack, for $L4 rd"',
  'False Trap':
    'School=Illusion ' +
    'Level=M2 ' +
    'Description="Touched appears trapped (save disbelieve)"',
  'Fear':
    'School=Illusion ' +
    'Level=I3,M4 ' +
    'Description="Targets in 60\' cone 65%-5*HD flee for $L rd (save neg)"',
  'Feather Fall':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description="R$L10\' Objects in 10\' cu fall 2\'/sec for $D" ' +
    'Duration="$L6 secs"',
  'Feeblemind':
    'School=Enchantment ' +
    'Level=D6,M5 ' +
    'Description="R$R Target Int 2 (save Cleric +1, Druid -1, MU -4, Illusionist -5 and non-human -2 neg)" ' +
    'Range="$L10\'"',
  'Feeblemind D6':
    'Range="160\'"',
  'Feign Death':
    'School=Necromancy ' +
    'Level=C3,D2,M3 ' +
    'Description="Touched appears dead, takes half damage, immune draining for $D" ' +
    'Duration="$Lplus6 rd"',
  'Feign Death C3':
    'Duration="$Lplus10 rd"',
  'Feign Death D2':
    'Duration="$L2plus4 rd"',
  'Find Familiar':
    'School=Conjuration ' +
    'Level=M1 ' +
    'Description="Call beast to serve as familiar (HP 1d3+1, AC 7)"',
  'Find The Path':
    'School=Divination ' +
    'Level=C6 ' +
    'Description="Touched knows shortest route into and out of location for $L tn (rev causes indirection)"',
  'Find Traps':
    'School=Divination ' +
    'Level=C2 ' +
    'Description="Detect traps in 10\'x30\' area for 3 tn"',
  'Finger Of Death':
    'School=Enchantment ' +
    'Level=D7 ' +
    'Description="R60\' Target dies (save neg)"',
  'Fire Charm':
    'School=Enchantment ' +
    'Level=M4 ' +
    'Description="R10\' Fire mesmerizes viewers (save neg) in 15\' radius, makes suggestible for $L2 rd"',
  'Fire Seeds':
    'School=Conjuration ' +
    'Level=D6 ' +
    'Description="R40\' 4 acorn missiles 2d8 HP in 5\' area or 8 holly berries 1d8 in 5\' sq for $L tn (save half)"',
  'Fire Shield':
    'School=Evocation ' +
    'Level=M4 ' +
    'Description="Self +2 save and half damage vs. fire (rev cold), dbl damage vs. cold (rev fire) for $Lplus2 rd"',
  'Fire Storm':
    'School=Evocation ' +
    'Level=D7 ' +
    'Description="R$R Fire in $L20\' cu  area 2d8 HP (save half) for 1 rd (rev extinguishes)" ' +
    'Range="150\'"',
  'Fire Trap':
    'School=Evocation ' +
    'Level=D2,M4 ' +
    'Description="Touched causes 1d4+$L HP (save half) in 5\' radius when opened"',
  'Fireball':
    'School=Evocation ' +
    'Level=M3 ' +
    'Description="R$R $E in 20\' radius (save half)" ' +
    'Effect="${lvl}d6 HP" ' +
    'Range="$L10plus100\'"',
  'Flame Arrow':
    'School=Conjuration ' +
    'Level=M3 ' +
    'Description="Touched arrow or bolt 1 HP fire damage same rd"',
  'Flame Strike':
    'School=Evocation ' +
    'Level=C5 ' +
    'Description="R60\' 5\' radius fire column 6d8 HP (save half)"',
  'Floating Disk':
    'School=Evocation ' +
    'Level=M1 ' +
    'Description="3\' diameter disk holds $L100 lbs, follows self at $R for $Lplus3 tn" ' +
    'Range="6\'"',
  'Fly':
    'School=Alteration ' +
    'Level=M3 ' +
    'Description="Touched can fly $E for $D" ' +
    'Duration="1d6+$L6 tn" ' +
    'Effect="120\'/rd"',
  'Fog Cloud':
    'School=Alteration ' +
    'Level=I2 ' +
    'Description="R10\' Fog in 40\'x20\'x20\' area obscures vision, moves 10\'/rd for $Lplus4 rd"',
  "Fool's Gold":
    'School=Alteration ' +
    'Level=M2 ' +
    'Description="R10\' Copper and brass become gold for $L hr (-$L save disbelieve)"',
  'Forceful Hand':
    'School=Evocation ' +
    'Level=M6 ' +
    'Description="R$L10\' Force absorbs attacks, pushes away for $L rd"',
  'Forget':
    'School=Enchantment ' +
    'Level=M2 ' +
    'Description="R30\' 4 targets in 20\' sq forget last $Lplus3div3 rd (save neg)"',
  'Freezing Sphere':
    'School=Alteration ' +
    'Level=M6 ' +
    'Description="Freeze $L10\' sq water for $L rd, R$L10\' cold ray $L4 HP (save neg), or cold grenade 4d6 HP (save half) in 10\' radius"',
  'Friends':
    'School=Enchantment ' +
    'Level=M1 ' +
    'Description="R$L10plus10\' Self Cha +2d4 (save self Cha -1d4) for $L rd"',
  'Fumble':
    'School=Enchantment ' +
    'Level=M4 ' +
    'Description="R$L10\' $E falls and drops carried (save slowed) for $L rd" ' +
    'Effect="Target"',
  'Gate':
    'School=Conjuration ' +
    'Level=C7,M9 ' +
    'Description="R30\' Summon named extraplanar creature"',
  'Gaze Reflection':
    'School=Alteration ' +
    'Level=I1 ' +
    'Description="Gaze attacks reflected back for $D" ' +
    'Duration="1 rd"',
  'Geas':
    'School=Enchantment ' +
    'Level=M6 ' +
    'Description="$R fulfill quest or sicken and die in 1d4 wk" ' +
    'Range="Touched"',
  'Glassteel':
    'School=Alteration ' +
    'Level=M8 ' +
    'Description="Touched $L10 lb glass gains steel strength"',
  'Glassee':
    'School=Alteration ' +
    'Level=M6 ' +
    'Description="Touched 3\'x2\' area becomes transparent for $L rd"',
  'Globe Of Invulnerability':
    'School=Abjuration ' +
    'Level=M6 ' +
    'Description="Self 5\' radius blocks spells level 1-4 for $L rd"',
  'Glyph Of Warding':
    'School=Abjuration ' +
    'Level=C3 ' +
    'Description="Touching $R causes $E energy (save half or neg)" ' +
    'Effect="$L2 HP" ' +
    'Range="$L25\' sq"',
  'Grasping Hand':
    'School=Evocation ' +
    'Level=M7 ' +
    'Description="R$L10\' Force absorbs attacks, restrains for $L rd"',
  'Guards And Wards':
    'School=Evocation ' +
    'Level=M6 ' +
    'Description="Multiple effects protect $E for $D" ' +
    'Duration="$L hr" ' +
    'Effect="$L10plus20\' radius"',
  'Gust Of Wind':
    'School=Alteration ' +
    'Level=M3 ' +
    'Description="Wind in 10\'x$L10\' path extinguishes flames, moves small objects for $D" ' +
    'Duration="6 secs"',
  'Hallucinatory Forest':
    'School=Illusion ' +
    'Level=D4 ' +
    'Description="R80\' Illusion of $L40\' sq forest"',
  'Hallucinatory Terrain':
    'School=Illusion ' +
    'Level=I3,M4 ' +
    'Description="R$R $E mimics other terrain $D" ' +
    'Duration="until touched" ' +
    'Effect="$L10\' sq" ' +
    'Range="$L20\'"',
  'Hallucinatory Terrain I3':
    'Effect="10\'x$L10\' area" ' +
    'Range="$L10plus40\'"',
  'Haste':
    'School=Alteration ' +
    'Level=M3 ' +
    'Description="R60\' $L targets in 40\' sq dbl speed for $Lplus3 rd"',
  'Heal':
    'School=Necromancy ' +
    'Level=C6 ' +
    'Description="Touched healed of $E, cured of blindness, disease, feeblemind (rev causes disease and drains all but 1d4 HP)" ' +
    'Effect="all but 1d4 HP"',
  'Heat Metal':
    'School=Alteration ' +
    'Level=D2 ' +
    'Description="R40\' Metal dangerously hot (rev cold) for 7 rd"',
  'Hold Animal':
    'School=Enchantment ' +
    'Level=D3 ' +
    'Description="R80\' Immobilize 4 animals for $L2 rd"',
  'Hold Monster':
    'School=Enchantment ' +
    'Level=M5 ' +
    'Description="R$L5\' Immobilize 4 creatures (save neg) for $L rd"',
  'Hold Person':
    'School=Enchantment ' +
    'Level=C2,M3 ' +
    'Description="R$R Immobilize 1-4 medium targets (save neg) for $D" ' +
    'Duration="$L2 rd" ' +
    'Range="120\'"',
  'Hold Person C2':
    'Duration="$Lplus4 rd" ' +
    'Range="60\'"',
  'Hold Plant':
    'School=Enchantment ' +
    'Level=D4 ' +
    'Description="R80\' Mobile plants in 16 sq yd immobile for $L rd"',
  'Hold Portal':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description="R$L20\' $E item held shut for $L rd" ' +
    'Effect="$L80\' sq"',
  'Holy Word':
    'School=Conjuration ' +
    'Level=C7 ' +
    'Description="30\' radius banishes evil extraplanar, kills (lt 4 HD), paralyzes (4-7 HD), stuns (8-11 HD), deafens (gt 11 HD) non-good creatures (rev good)"',
  'Hypnotic Pattern':
    'School=Illusion ' +
    'Level=I2 ' +
    'Description="Viewers in 30\' sq totaling 24 HD transfixed for conc (save neg)"',
  'Hypnotism':
    'School=Enchantment ' +
    'Level=I1 ' +
    'Description="R$R 1d6 targets subject to suggestion for $Lplus1 rd" ' +
    'Range="30\'"',
  'Ice Storm':
    'School=Evocation ' +
    'Level=M4 ' +
    'Description="R$L10\' Hail in 40\' sq 3d10 HP or sleet in 80\' sq blinds, slows, causes falls for 1 rd"',
  'Identify':
    'School=Divination ' +
    'Level=M1 ' +
    'Description="$E determine magical properties of touched w/in $L hr of discovery (save neg or mislead), requires rest afterward" ' +
    'Effect="$L5plus15%"',
  'Illusionary Script':
    'School=Illusion ' +
    'Level=I3 ' +
    'Description="Obscured writing causes 5d4 rd confusion (save neg) for readers other than specified"',
  'Imprisonment':
    'School=Abjuration ' +
    'Level=M9 ' +
    'Description="Touched safely trapped underground permanently (rev frees)"',
  'Improved Invisibility':
    'School=Illusion ' +
    'Level=I4 ' +
    'Description="Touched invisible for $Lplus4 rd"',
  'Improved Phantasmal Force':
    'School=Illusion ' +
    'Level=I2 ' +
    'Description="R$L10plus60\' $E sight and sound illusion for conc + 2 rd" ' +
    'Effect="$L10plus40\' sq"',
  'Incendiary Cloud':
    'School=Alteration ' +
    'Level=M8 ' +
    'Description="R30\' 20\' radius smoke cloud for 1d6+4 rd, $E rd 3, 4, 5 (save half)" ' +
    'Effect="$Ldiv2, $L, $Ldiv2 HP"',
  'Infravision':
    'School=Alteration ' +
    'Level=M3 ' +
    'Description="Touched see 60\' in darkness for $Lplus2 hr"',
  'Insect Plague':
    'School=Conjuration ' +
    'Level=C5,D5 ' +
    'Description="R$R Stinging insects fill $E (lt 2 HD flee, 3-4 HD check morale) for $L tn" ' +
    'Effect="180\' radius" ' +
    'Range="360\'"',
  'Insect Plague D5':
    'Effect="160\' radius" ' +
    'Range="320\'"',
  'Instant Summons':
    'School=Conjuration ' +
    'Level=M7 ' +
    'Description="Prepared, unpossessed 8 lb item called to self hand"',
  'Interposing Hand':
    'School=Evocation ' +
    'Level=M5 ' +
    'Description="R$L10\' Force absorbs attacks, blocks passage for $L rd"',
  'Invisibility':
    'School=Illusion ' +
    'Level=I2,M2 ' +
    'Description="Touched invisible until attacking"',
  "Invisibility 10' Radius":
    'School=Illusion ' +
    'Level=I3,M3 ' +
    'Description="Creatures w/in 10\' of touched invisible until attacking"',
  'Invisibility To Animals':
    'School=Alteration ' +
    'Level=D1 ' +
    'Description="$E undetected by animals for $Lplus10 rd" ' +
    'Effect="Touched"',
  'Invisible Stalker':
    'School=Conjuration ' +
    'Level=M6 ' +
    'Description="R10\' Conjured 8 HD invisible creature performs 1 task"',
  'Irresistible Dance':
    'School=Enchantment ' +
    'Level=M8 ' +
    'Description="Touched -4 AC, fail saves for 1d4+1 rd"',
  'Jump':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description="Touched can jump 30\' forward, 10\' back or up $D" ' +
    'Duration="$Lplus2div3 times"',
  'Knock':
    'School=Alteration ' +
    'Level=M2 ' +
    'Description="R60\' Open stuck, locked item"',
  'Know Alignment':
    'School=Divination ' +
    'Level=C2 ' +
    'Description="Self discern aura of $E for 1 tn (rev obscures)" ' +
    'Effect="10 targets"',
  'Legend Lore':
    'School=Divination ' +
    'Level=M6 ' +
    'Description="Self gain info about specified object, person, or place"',
  'Levitate':
    'School=Alteration ' +
    'Level=M2 ' +
    'Description="R$L20\' Self move $L100 lb target up/down 10\'/rd for $L tn (save neg)"',
  'Light':
    'School=Alteration ' +
    'Level=C1,I1,M1 ' +
    'Description="R$R Target spot radiates 20\' radius light for $D (rev darkness half duration)" ' +
    'Duration="$L tn" ' +
    'Range="60\'"',
  'Light C1':
    'Duration="$Lplus6 tn" ' +
    'Range="120\'"',
  'Lightning Bolt':
    'School=Evocation ' +
    'Level=M3 ' +
    'Description="R$L10plus40\' Bolt $E HP (save half)" ' +
    'Effect="${lvl}d6"',
  'Limited Wish':
    'School=Conjuration ' +
    'Level=M7 ' +
    'Description="Minor reshaping of reality"',
  'Locate Animals':
    'School=Divination ' +
    'Level=D1 ' +
    'Description="Self discern animals in 20\'x$L20\' area for $L rd"',
  'Locate Object':
    'School=Divination ' +
    'Level=C3,M2 ' +
    'Description="R$R Self find desired object for $L rd (rev obscures)" ' +
    'Range="$L20\'"',
  'Locate Object C3':
    'Range="$L10plus60\'"',
  'Locate Plants':
    'School=Divination ' +
    'Level=D2 ' +
    'Description="Self discern plants in $L5\' radius for $L tn"',
  'Lower Water':
    'School=Alteration ' +
    'Level=C4,M6 ' +
    'Description="R$R $E fluid subsides by $L5% for $D (rev raises)" ' +
    'Duration="$L5 rd" ' +
    'Effect="$L5\' sq" ' +
    'Range="80\'"',
  'Lower Water C4':
    'Duration="$L tn" ' +
    'Effect="$L10\' sq" ' +
    'Range="120\'"',
  "Mage's Faithful Hound":
    'School=Conjuration ' +
    'Level=M5 ' +
    'Description="R10\' Invisible 10 HD dog guards, attacks 3d6 HP w/in 30\' of self for $D" ' +
    'Duration="$L2 rd"',
  "Mage's Sword":
    'School=Evocation ' +
    'Level=M7 ' +
    'Description="R30\' Control remote magic sword (19-20 hits, 5d4 HP) as F$Ldiv2 for $L rd"',
  'Magic Aura':
    'School=Illusion ' +
    'Level=M1 ' +
    'Description="Touched responds to <i>Detect Magic</i> for $L dy (save disbelieve)"',
  'Magic Jar':
    'School=Necromancy ' +
    'Level=M5 ' +
    'Description="R$L10\' Self trap target soul and possess target body (save neg)"',
  'Magic Missile':
    'School=Evocation ' +
    'Level=M1 ' +
    'Description="R$L10plus60\' $Lplus1div2 energy darts hit targets in 10\' sq 1d4+1 HP ea"',
  'Magic Mouth':
    'School=Alteration ' +
    'Level=I2,M2 ' +
    'Description="$R object responds to trigger by reciting 25 words" ' +
    'Range="Touched"',
  'Major Creation':
    'School=Alteration ' +
    'Level=I5 ' +
    'Description="R10\' Create $L\' cu object from component plant or mineral material for $D" ' +
    'Duration="$L hr"',
  'Mass Charm':
    'School=Enchantment ' +
    'Level=M8 ' +
    'Description="R$L5\' $L2 HD creature(s) in 30\' sq treat self as trusted friend (save neg)"',
  'Mass Invisibility':
    'School=Illusion ' +
    'Level=M7 ' +
    'Description="R$L10\' All in $E invisible until attacking" ' +
    'Effect="30\' sq"',
  'Mass Suggestion':
    'School=Enchantment ' +
    'Level=I6 ' +
    'Description="R$R $L targets carry out reasonable suggestion for $L4plus4 tn" ' +
    'Range="30\'"',
  'Massmorph':
    'School=Illusion ' +
    'Level=I4,M4 ' +
    'Description="R$L10\' 10 humanoids look like trees"',
  'Maze':
    'School=Conjuration ' +
    'Level=I5,M8 ' +
    'Description="R$L5\' Target sent to interdimensional maze for amount of time based on Int"',
  'Mending':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description="R30\' Repair small break"',
  'Message':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description="R$L10plus60\' remote whispering for ${(lvl+5)*6} secs"',
  'Meteor Swarm':
    'School=Evocation ' +
    'Level=M9 ' +
    'Description="R$L10plus40\' 4 meteors 10d4 HP in 30\' diameter or 8 meteors 5d4 HP in 15\' diameter (collateral save half)"',
  'Mind Blank':
    'School=Abjuration ' +
    'Level=M8 ' +
    'Description="R30\' Target immune $E for 1 dy" ' +
    'Effect="divination"',
  'Minor Creation':
    'School=Alteration ' +
    'Level=I4 ' +
    'Description="Create $L\' cu object from component plant material for $L hr"',
  'Minor Globe Of Invulnerability':
    'School=Abjuration ' +
    'Level=M4 ' +
    'Description="Self 5\' radius blocks spells level 1-3 for $L rd"',
  'Mirror Image':
    'School=Illusion ' +
    'Level=I2,M2 ' +
    'Description="Self $E duplicates draw attacks for $D" ' +
    'Duration="$L3 rd" ' +
    'Effect="1d4+1"',
  'Mirror Image M2':
    'Duration="$L2 rd" ' +
    'Effect="1d4"',
  'Misdirection':
    'School=Illusion ' +
    'Level=I2 ' +
    'Description="R30\' Divination spells cast on target return false info for $D" ' +
    'Duration="$L rd"',
  'Mnemonic Enhancer':
    'School=Alteration ' +
    'Level=M4 ' +
    'Description="Self retain 3 additional spell levels for 1 dy"',
  'Monster Summoning I':
    'School=Conjuration ' +
    'Level=M3 ' +
    'Description="R30\' 2d4 1 HD creatures fight for $Lplus2 rd"',
  'Monster Summoning II':
    'School=Conjuration ' +
    'Level=M4 ' +
    'Description="R40\' 1d6 2 HD creatures fight for $Lplus3 rd"',
  'Monster Summoning III':
    'School=Conjuration ' +
    'Level=M5 ' +
    'Description="R50\' 1d4 3 HD creatures fight for $Lplus4 rd"',
  'Monster Summoning IV':
    'School=Conjuration ' +
    'Level=M6 ' +
    'Description="R60\' $E 4 HD creatures fight for $Lplus5 rd" ' +
    'Effect="1d4"',
  'Monster Summoning V':
    'School=Conjuration ' +
    'Level=M7 ' +
    'Description="R70\' $E 5 HD creatures fight for $Lplus6 rd" ' +
    'Effect="1d2"',
  'Monster Summoning VI':
    'School=Conjuration ' +
    'Level=M8 ' +
    'Description="R80\' $E 6 HD creatures fight for $Lplus7 rd" ' +
    'Effect="1d2"',
  'Monster Summoning VII':
    'School=Conjuration ' +
    'Level=M9 ' +
    'Description="R90\' 1d2 7 HD creatures fight for $Lplus8 rd"',
  'Move Earth':
    'School=Alteration ' +
    'Level=M6 ' +
    'Description="R$L10\' Displace $E/tn" ' +
    'Effect="40\' cu"',
  'Neutralize Poison':
    'School=Alteration ' +
    'Level=C4,D3 ' +
    'Description="Touched detoxed (rev lethally poisoned, save neg)"',
  'Non-Detection':
    'School=Abjuration ' +
    'Level=I3 ' +
    'Description="$E invisible to divination for $D" ' +
    'Duration="$L tn" ' +
    'Effect="5\' radius"',
  'Obscurement':
    'School=Alteration ' +
    'Level=D2 ' +
    'Description="Mist limits vision in $L10\' cu for $L4 rd"',
  'Paralyzation':
    'School=Illusion ' +
    'Level=I3 ' +
    'Description="R$L10\' Immobilize $L2 HD creatures in 20\' sq"',
  'Part Water':
    'School=Alteration ' +
    'Level=C6,M6 ' +
    'Description="R$R Form 20\'x$L30\'x3\' water trench for $D" ' +
    'Duration="$L5 rd" ' +
    'Range="$L10\'"',
  'Part Water C6':
    'Duration="$L tn" ' +
    'Range="$L20\'"',
  'Pass Plant':
    'School=Alteration ' +
    'Level=D5 ' +
    'Description="Self teleport between trees"',
  'Pass Without Trace':
    'School=Enchantment ' +
    'Level=D1 ' +
    'Description="Touched leaves no sign of passage for $L tn"',
  'Passwall':
    'School=Alteration ' +
    'Level=M5 ' +
    'Description="R30\' Create 5\'x8\'x10\' passage through dirt and rock for $Lplus6 tn"',
  'Permanency':
    'School=Alteration ' +
    'Level=M8 ' +
    'Description="Effects of spell made permanent, costs 1 Con"',
  'Permanent Illusion':
    'School=Illusion ' +
    'Level=I6 ' +
    'Description="R$R $E sight, sound, smell, temperature illusion" ' +
    'Effect="$L10plus40\' sq" ' +
    'Range="$L10\'"',
  'Phantasmal Force':
    'School=Illusion ' +
    'Level=I1,M3 ' +
    'Description="R$R $E illusionary object for conc or until struck (save disbelieve)" ' +
    'Effect="$L10plus60\' sq" ' +
    'Range="$L10plus40\'"',
  'Phantasmal Force M3':
    'Effect="$L10plus80\' sq" ' +
    'Range="$L10plus80\'"',
  'Phantasmal Killer':
    'School=Illusion ' +
    'Level=I4 ' +
    'Description="R$L5\' Nightmare illusion attacks target as HD 4, kills on hit for $L rd (Int save neg)"',
  'Phase Door':
    'School=Alteration ' +
    'Level=M7 ' +
    'Description="Self pass through touched 10\' solid $E" ' +
    'Effect="$Ldiv2 times"',
  'Plane Shift':
    'School=Alteration ' +
    'Level=C5 ' +
    'Description="Touched plus 7 touching travel to another plane (save neg)"',
  'Plant Door':
    'School=Alteration ' +
    'Level=D4 ' +
    'Description="Self move effortlessly through vegetation for $L tn"',
  'Plant Growth':
    'School=Alteration ' +
    'Level=D3,M4 ' +
    'Description="R$R Vegetation in $E becomes thick and entangled" ' +
    'Effect="$L10\' sq" ' +
    'Range="$L10\'"',
  'Plant Growth D3':
    'Effect="$L20\' sq" ' +
    'Range="160\'"',
  'Polymorph Any Object':
    'School=Alteration ' +
    'Level=M8 ' +
    'Description="R$L5\' Transform any object (save -4 neg)"',
  'Polymorph Other':
    'School=Alteration ' +
    'Level=M4 ' +
    'Description="R$L5\' Target takes on named creature form and identity (save neg)"',
  'Polymorph Self':
    'School=Alteration ' +
    'Level=M4 ' +
    'Description="Self takes on named creature form for $L2 tn"',
  'Power Word Blind':
    'School=Conjuration ' +
    'Level=M8 ' +
    'Description="R$L5\' Creatures in 15\' radius blinded for 1d4+1 rd or 1d4+1 tn"',
  'Power Word Kill':
    'School=Conjuration ' +
    'Level=M9 ' +
    'Description="R$L10div4\' 1 60 HP target or 12 10 HP targets in 10\' radius die"',
  'Power Word Stun':
    'School=Conjuration ' +
    'Level=M7 ' +
    'Description="R$L5\' Target stunned for 1d4-4d4 rd"',
  'Prayer':
    'School=Conjuration ' +
    'Level=C3 ' +
    'Description="R60\' Allies +1 attack, damage, saves (foes -1) for $L rd"',
  'Predict Weather':
    'School=Divination ' +
    'Level=D1 ' +
    'Description="Discern local weather for next $L2 hr"',
  'Prismatic Sphere':
    'School=Abjuration ' +
    'Level=M9 ' +
    'Description="Self 10\' radius impenetrable for $L tn"',
  'Prismatic Spray':
    'School=Abjuration ' +
    'Level=I7 ' +
    'Description="Targets in 70\'x15\'x5\' area one of 20, 40, 80 HP (save half), fatal poison, stone, insane, planar teleport (save neg)"',
  'Prismatic Wall':
    'School=Abjuration ' +
    'Level=I7 ' +
    'Description="R10\' $L40\'x$L20\' multicolored wall blinds viewers 2d4 rd, blocks attacks for $L tn"',
  'Produce Fire':
    'School=Alteration ' +
    'Level=D4 ' +
    'Description="R40\' Fire in $E 1d4 HP for 1 rd (rev extinguishes)" ' +
    'Effect="120\' sq"',
  'Produce Flame':
    'School=Alteration ' +
    'Level=D2 ' +
    'Description="Flame from burning hand can be thrown 40\' for $D" ' +
    'Duration="$L2 rd"',
  'Programmed Illusion':
    'School=Illusion ' +
    'Level=I6 ' +
    'Description="R$L10\' Target responds to trigger, shows $E scene for $L rd" ' +
    'Effect="$L10plus40\' sq"',
  'Project Image':
    'School=Illusion ' +
    'Level=I5,M6 ' +
    'Description="R$R Self duplicate immune to attacks, can cast spells for $L rd" ' +
    'Range="$L10\'"',
  'Project Image I5':
    'Range="$L5\'"',
  'Protection From Evil':
    'School=Abjuration ' +
    'Level=C1,M1 ' +
    'Description="Touched untouchable by evil outsiders, -2 evil attacks, +2 saves for $D (rev good)" ' +
    'Duration="$L2 rd"',
  'Protection From Evil C1':
    'Duration="$L3 rd"',
  "Protection From Evil 10' Radius":
    'School=Abjuration ' +
    'Level=C4,M3 ' +
    'Description="Touched 10\' radius untouchable by evil outsiders, -2 evil attacks, +2 saves for $D (rev good)" ' +
    'Duration="$L2 rd"',
  "Protection From Evil 10' Radius C4":
    'Duration="$L tn"',
  'Protection From Fire':
    'School=Abjuration ' +
    'Level=D3 ' +
    'Description="Self immune normal, ignore $L12 HP magic fire or touched immune normal, +4 save and half damage vs magic fire for $L tn"',
  'Protection From Lightning':
    'School=Abjuration ' +
    'Level=D4 ' +
    'Description="Self immune normal, ignore $L12 HP magic electricity or touched immune normal, +4 save and half damage vs magic electricity for $L tn"',
  'Protection From Normal Missiles':
    'School=Abjuration ' +
    'Level=M3 ' +
    'Description="Touched invulnerable to arrows and bolts for $L tn"',
  'Purify Food And Drink':
    'School=Alteration ' +
    'Level=C1 ' +
    'Description="R30\' Consumables in $L\' cu uncontaminated (rev contaminates)"',
  'Purify Water':
    'School=Alteration ' +
    'Level=D1 ' +
    'Description="R40\' Decontaminates (rev contaminates) $L\' cu water"',
  'Push':
    'School=Conjuration ' +
    'Level=M1 ' +
    'Description="R$L3plus10\' Target $L lb object moves away from self"',
  'Pyrotechnics':
    'School=Alteration ' +
    'Level=D3,M2 ' +
    'Description="R$R Target fire emits fireworks (blind 1d4+1 rd) or obscuring smoke for $L rd" ' +
    'Range="120\'"',
  'Pyrotechnics D3':
    'Range="160\'"',
  'Quest':
    'School=Enchantment ' +
    'Level=C5 ' +
    'Description="R60\' Target saves -1/dy until fulfill quest (save neg)"',
  'Raise Dead':
    'School=Necromancy ' +
    'Level=C5 ' +
    'Description="R30\' Corpse restored to life w/in $L dy or destroy corporeal undead (rev slays, save 2d8+1 HP)"',
  'Ray Of Enfeeblement':
    'School=Enchantment ' +
    'Level=M2 ' +
    'Description="R$R Target loses $L2plus19% Str for $L rd" ' +
    'Range="$L3plus10\'"',
  'Read Magic':
    'School=Divination ' +
    'Level=M1 ' +
    'Description="Self understand magical writing for $L2 rd (rev obscures)"',
  'Regenerate':
    'School=Necromancy ' +
    'Level=C7 ' +
    'Description="Touched reattach or regrow appendages in 2d4 tn (rev wither)"',
  'Reincarnate':
    'School=Necromancy ' +
    'Level=D7 ' +
    'Description="Soul dead le 7 dy inhabits new body"',
  'Reincarnation':
    'School=Necromancy ' +
    'Level=M6 ' +
    'Description="Soul dead le $L dy inhabits new body"',
  'Remove Curse':
    'School=Abjuration ' +
    'Level=C3,M4 ' +
    'Description="Touched uncursed (rev cursed for $L tn)"',
  'Remove Fear':
    'School=Abjuration ' +
    'Level=C1 ' +
    'Description="$E +4 vs. fear for 1 tn, new +$L save if already afraid (rev cause fear)" ' +
    'Effect="Touched"',
  'Repel Insects':
    'School=Abjuration ' +
    'Level=D4 ' +
    'Description="Self 10\' radius expels normal insects, wards giant (save neg) for $L tn"',
  'Repulsion':
    'School=Abjuration ' +
    'Level=M6 ' +
    'Description="R$L10\' Move all in 10\' path away 30\'/rd for $Ldiv2 rd"',
  'Resist Cold':
    'School=Alteration ' +
    'Level=C1 ' +
    'Description="Touched comfortable to 0F, +3 save vs. cold for 1/4 or 1/2 damage for $L tn"',
  'Resist Fire':
    'School=Alteration ' +
    'Level=C2 ' +
    'Description="Touched comfortable to 212F, +3 vs. fire for 1/4 or 1/2 damage for $L tn"',
  'Restoration':
    'School=Necromancy ' +
    'Level=C7 ' +
    'Description="Touched regains levels and abilities lost w/in $L dy (rev drains)"',
  'Resurrection':
    'School=Necromancy ' +
    'Level=C7 ' +
    'Description="Touched restored to life w/in $L10 yr (rev slays)"',
  'Reverse Gravity':
    'School=Alteration ' +
    'Level=M7 ' +
    'Description="R$L5\' Items in 30\' sq fall up for $D" ' +
    'Duration="1 sec"',
  'Rope Trick':
    'School=Alteration ' +
    'Level=I3,M2 ' +
    'Description="Touched rope leads to interdimensional space that holds $E for $L2 tn" ' +
    'Effect="6"',
  'Sanctuary':
    'School=Abjuration ' +
    'Level=C1 ' +
    'Description="$E foes save vs. magic to attack for $Lplus2 rd" ' +
    'Effect="Self"',
  'Scare':
    'School=Enchantment ' +
    'Level=M2 ' +
    'Description="R$R Target lt 6 HD frozen in terror (save neg) for $D" ' +
    'Duration="3d4 rd" ' +
    'Range="10\'"',
  'Secret Chest':
    'School=Alteration ' +
    'Level=M5 ' +
    'Description="Create 12\' cu ethereal chest for 60 dy"',
  'Shades':
    'School=Illusion ' +
    'Level=I6 ' +
    'Description="R30\' Create monsters $L HD total, 60% HP (save AC 6, 60% damage) for $L rd"',
  'Shadow Door':
    'School=Illusion ' +
    'Level=I5 ' +
    'Description="R10\' Illusionary door makes self invisible for $L rd"',
  'Shadow Magic':
    'School=Illusion ' +
    'Level=I5 ' +
    'Description="R$L10plus50\' Mimics <i>Cone Of Cold</i> (${lvl}d4+$L HP), <i>Fireball</i> (${lvl}d6 HP), <i>Lightning Bolt</i> (${lvl}d6 HP), <i>Magic Missile</i> (${Math.floor((lvl+1)/2)}x1d4+1 HP) (save $L HP)"',
  'Shadow Monsters':
    'School=Illusion ' +
    'Level=I4 ' +
    'Description="R30\' Create monsters $L HD total, 20% HP (save AC 10, 20% damage) for $L rd"',
  'Shape Change':
    'School=Alteration ' +
    'Level=M9 ' +
    'Description="Self polymorph freely for $L tn"',
  'Shatter':
    'School=Alteration ' +
    'Level=M2 ' +
    'Description="R$R $L10 lbs brittle material shatters (save neg)" ' +
    'Range="60\'"',
  'Shield':
    'School=Evocation ' +
    'Level=M1 ' +
    'Description="Self frontal AC 2 vs thrown, AC 3 vs arrow or bolt, AC 4 vs melee, +1 save for $L5 rd"',
  'Shillelagh':
    'School=Alteration ' +
    'Level=D1 ' +
    'Description="Touched club +1 attack, 2d4 damage for $D" ' +
    'Duration="$L rd"',
  'Shocking Grasp':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description="Touched 1d8+$L HP"',
  "Silence 15' Radius":
    'School=Alteration ' +
    'Level=C2 ' +
    'Description="R120\' No sound in 15\' radius for $L2 rd"',
  'Simulacrum':
    'School=Illusion ' +
    'Level=M7 ' +
    'Description="Command half-strength copy of another creature"',
  'Sleep':
    'School=Enchantment ' +
    'Level=M1 ' +
    'Description="R$R Creatures up to 4+4 HD in 15\' radius sleep for $L5 rd" ' +
    'Range="$L10plus30\'"',
  'Slow':
    'School=Alteration ' +
    'Level=M3 ' +
    'Description="R$L10plus90\' $L targets in 40\' sq half speed for $Lplus3 rd"',
  'Slow Poison':
    'School=Necromancy ' +
    'Level=C2 ' +
    'Description="Touched takes only 1 HP/tn from poison, protected from death for $L hr"',
  'Snake Charm':
    'School=Enchantment ' +
    'Level=C2 ' +
    'Description="R30\' Charm angry snakes up to self HP 1d4+4 rd"',
  'Snare':
    'School=Enchantment ' +
    'Level=D3 ' +
    'Description="Touched snare 90% undetectable"',
  'Speak With Animals':
    'School=Alteration ' +
    'Level=C2,D1 ' +
    'Description="R$R Self converse w/1 type of animal for $L2 rd" ' +
    'Range="30\'"',
  'Speak With Animals D1':
    'Range="40\'"',
  'Speak With Dead':
    'School=Necromancy ' +
    'Level=C3 ' +
    'Description="R10\' Self question corpse"',
  'Speak With Monsters':
    'School=Alteration ' +
    'Level=C6 ' +
    'Description="R30\' Self converse w/intelligent creatures for $D" ' +
    'Duration="$L rd"',
  'Speak With Plants':
    'School=Alteration ' +
    'Level=C4,D4 ' +
    'Description="Self converse w/plants in $E for $L rd" ' +
    'Duration="$L rd" ' +
    'Effect="30\' radius"',
  'Speak With Plants D4':
    'Duration="$L2 rd" ' +
    'Effect="40\' radius"',
  'Spectral Force':
    'School=Illusion ' +
    'Level=I3 ' +
    'Description="R$R $L10plus40\' sq sight, sound, smell, temperature illusion for conc + 3 rd" ' +
    'Range="$L10plus60\'"',
  'Spell Immunity':
    'School=Abjuration ' +
    'Level=M8 ' +
    'Description="$Ldiv4 touched bonus vs. mind spells for $L tn"',
  'Spider Climb':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description="Touched move 30\'/rd on walls and ceilings for $D" ' +
    'Duration="$Lplus1 rd"',
  'Spiritwrack':
    'School=Abjuration ' +
    'Level=M6 ' +
    'Description="R$Lplus10\' Banish extraplanar for $L yr"',
  'Spiritual Weapon':
    'School=Evocation ' +
    'Level=C2 ' +
    'Description="R$R magical force attacks for conc or $L rd" ' +
    'Duration="$L rd" ' +
    'Range="30\'"',
  'Statue':
    'School=Alteration ' +
    'Level=M7 ' +
    'Description="Touched become stone at will for $L hr"',
  'Sticks To Snakes':
    'School=Alteration ' +
    'Level=C4,D5 ' +
    'Description="R$R $E in 10\' cu become snakes ($L5% venomous) (rev) for $L2 rd" ' +
    'Effect="$L sticks" ' +
    'Range="30\'"',
  'Sticks To Snakes D5':
    'Range="40\'"',
  'Stinking Cloud':
    'School=Evocation ' +
    'Level=M2 ' +
    'Description="R30\' Creatures w/in $E retch for 1d4+1 rd (save neg) for $L rd" ' +
    'Effect="20\' cu"',
  'Stone Shape':
    'School=Alteration ' +
    'Level=D3,M5 ' +
    'Description="Touched $E rock reshaped" ' +
    'Effect="$L\' cu"',
  'Stone Shape D3':
    'Effect="$Lplus3\' cu"',
  'Stone Tell':
    'School=Divination ' +
    'Level=C6 ' +
    'Description="Self converse w/3\' cu rock for 1 tn"',
  'Stone To Flesh':
    'School=Alteration ' +
    'Level=M6 ' +
    'Description="R$L10\' Restore stoned creature or convert $E (rev)" ' +
    'Effect="$L9\' cu"',
  'Strength':
    'School=Alteration ' +
    'Level=M2 ' +
    'Description="Touched Str +1d4 (HD d4), +1d6 (HD d8), or +1d8 (HD d10) for $L hr"',
  'Suggestion':
    'School=Enchantment ' +
    'Level=I3,M3 ' +
    'Description="R30\' Target carries out reasonable suggestion for $D (save neg)" ' +
    'Duration="$Lplus1 hr"',
  'Suggestion I3':
    'Duration="$L4plus4 hr"',
  'Summon Insects':
    'School=Conjuration ' +
    'Level=D3 ' +
    'Description="R30\' Target covered w/insects, 2 HP/rd for $L rd"',
  'Summon Shadow':
    'School=Conjuration ' +
    'Level=I5 ' +
    'Description="R10\' $E shadows obey commands for $Lplus1 rd" ' +
    'Effect="$L"',
  'Symbol':
    'School=Conjuration ' +
    'Level=C7,M8 ' +
    'Description="Glowing symbol causes death, discord 5d4 rd, fear (save -4 neg), hopelessness, insanity, pain 2d10 tn, sleep 4d4+1 tn, or stunning 3d4 rd"',
  'Symbol C7':
    'Description="Glowing symbol causes hopelessness, pain, or persuasion for $L tn"',
  'Telekinesis':
    'School=Alteration ' +
    'Level=M5 ' +
    'Description="R$L10\' Move $L25 lb for $Lplus2 rd"',
  'Teleport':
    'School=Alteration ' +
    'Level=M5 ' +
    'Description="Instantly transport self + ${250+Math.max(lvl-10,0)*150} lb to known location"',
  'Temporal Stasis':
    'School=Alteration ' +
    'Level=M9 ' +
    'Description="R10\' Target suspended animation permanently (rev wakens)"',
  'Time Stop':
    'School=Alteration ' +
    'Level=M9 ' +
    'Description="Self 15\' radius gains $D" ' +
    'Duration="1d8+$Ldiv2 x 6 secs"',
  'Tiny Hut':
    'School=Alteration ' +
    'Level=M3 ' +
    'Description="$E protects against view, elements for $D" ' +
    'Duration="$L hr" ' +
    'Effect="5\' radius"',
  'Tongues':
    'School=Alteration ' +
    'Level=C4,M3 ' +
    'Description="Self understand any speech (rev muddle) in 30\' radius for $D" ' +
    'Duration="$L rd"',
  'Tongues C4':
    'Duration="1 tn"',
  'Transformation':
    'School=Alteration ' +
    'Level=M6 ' +
    'Description="Self become warrior (HP x2, AC +4, 2/rd dagger +2 damage) for $L rd"',
  'Transmute Metal To Wood':
    'School=Alteration ' +
    'Level=D7 ' +
    'Description="R80\' $E object becomes wood" ' +
    'Effect="$L8 lb"',
  'Transmute Rock To Mud':
    'School=Alteration ' +
    'Level=D5,M5 ' +
    'Description="R$R $L20\' cu rock becomes mud (rev)" ' +
    'Range="$L10\'"',
  'Transmute Rock To Mud D5':
    'Range="160\'"',
  'Transport Via Plants':
    'School=Alteration ' +
    'Level=D6 ' +
    'Description="Self teleport between plants"',
  'Trap The Soul':
    'School=Conjuration ' +
    'Level=M8 ' +
    'Description="R10\' Target soul trapped in gem (save neg)"',
  'Tree':
    'School=Alteration ' +
    'Level=D3 ' +
    'Description="Self polymorph into tree for $Lplus6 tn"',
  'Trip':
    'School=Enchantment ' +
    'Level=D2 ' +
    'Description="Touched trips passers (save neg), $E damage, stunned 1d4+1 rd for $L tn" ' +
    'Effect="1d6 HP"',
  'True Seeing':
    'School=Divination ' +
    'Level=C5 ' +
    'Description="Touched sees past deceptions$E w/in $R for $L rd (rev obscures)" ' +
    'Effect=", alignment auras" ' +
    'Range="120\'"',
  'True Sight':
    'School=Divination ' +
    'Level=I6 ' +
    'Description="Touched sees through deceptions w/in 60\' for $L rd"',
  'Turn Wood':
    'School=Alteration ' +
    'Level=D6 ' +
    'Description="Wood in 120\'x$L20\' area forced away for $L4 rd" ' +
    'Duration="$L4 rd"',
  'Unseen Servant':
    'School=Conjuration ' +
    'Level=M1 ' +
    'Description="Invisible force does simple tasks w/in 30\' for $Lplus6 tn"',
  'Vanish':
    'School=Alteration ' +
    'Level=M7 ' +
    'Description="Touched teleported or replaced by stone"',
  'Veil':
    'School=Illusion ' +
    'Level=I6 ' +
    'Description="R$L10\' $L20\' sq mimics other terrain for $L tn"',
  'Ventriloquism':
    'School=Illusion ' +
    'Level=I2,M1 ' +
    'Description="R$R Self throw voice for $D ((Int - 12) * 10% disbelieve)" ' +
    'Duration="$Lplus4 rd" ' +
    'Range="$L10max90\'"',
  'Ventriloquism M1':
    'Duration="$Lplus2 rd" ' +
    'Range="$L10max60\'"',
  'Vision':
    'School=Divination ' +
    'Level=I7 ' +
    'Description="Self seek answer to question, may cause geas"',
  'Wall Of Fire':
    'School=Evocation ' +
    'Level=D5,M4 ' +
    'Description="R$R $E 4d4+$L HP to passers, 2d4 w/in 10\', 1d4 w/in 20\' for conc or $L rd" ' +
    'Effect="$L20\' sq wall or $L5\' radius circle" ' +
    'Range="80\'"',
  'Wall Of Fire M4':
    'Description="R60\' $L20\' sq wall or $Lplus3\' radius circle 2d6+$L HP to passers, 2d6 w/in 10\', 1d6 w/in 20\' for conc or $L rd"',
  'Wall Of Fog':
    'School=Alteration ' +
    'Level=I1 ' +
    'Description="R30\' Fog in $E obscures for 2d4+$L rd" ' +
    'Effect="$L20\' cu"',
  'Wall Of Force':
    'School=Evocation ' +
    'Level=M5 ' +
    'Description="R30\' Invisible $E wall impenetrable for $D" ' +
    'Duration="$Lplus10 rd" ' +
    'Effect="$L20\' sq"',
  'Wall Of Ice':
    'School=Evocation ' +
    'Level=M4 ' +
    'Description="R$L10\' Create $L10\' sq ice wall for $L tn"',
  'Wall Of Iron':
    'School=Evocation ' +
    'Level=M5 ' +
    'Description="R$L5\' Create ${lvl/4} in thick, $L15\' sq wall"',
  'Wall Of Stone':
    'School=Evocation ' +
    'Level=M5 ' +
    'Description="R$L5\' ${lvl/4} in thick, $L20\' sq wall emerges from stone"',
  'Wall Of Thorns':
    'School=Conjuration ' +
    'Level=D6 ' +
    'Description="R80\' Briars in $E 8 + AC HP for $L tn" ' +
    'Effect="$L100\' cu"',
  'Warp Wood':
    'School=Alteration ' +
    'Level=D2 ' +
    'Description="R$L10\' Bends $L in x $L15 in wood"',
  'Water Breathing':
    'School=Alteration ' +
    'Level=D3,M3 ' +
    'Description="Touched breathe water (rev air) for $D" ' +
    'Duration="$L3 tn"',
  'Water Breathing D3':
    'Duration="$L hr"',
  'Weather Summoning':
    'School=Conjuration ' +
    'Level=D6 ' +
    'Description="Self directs precipitation, temp, and wind within d100 mi sq"',
  'Web':
    'School=Evocation ' +
    'Level=M2 ' +
    'Description="R$L5\' 80\' cu webbing for $L2 tn"',
  'Wind Walk':
    'School=Alteration ' +
    'Level=C7 ' +
    'Description="Self and $Ldiv8 others insubstantial, travel 600\'/tn for $L hr"',
  'Wish':
    'School=Conjuration ' +
    'Level=M9 ' +
    'Description="Major reshaping of reality"',
  'Wizard Eye':
    'School=Alteration ' +
    'Level=M4 ' +
    'Description="Self see through invisible eye w/60\' vision, 10\' infravision, moves 30\'/rd for $L rd"',
  'Wizard Lock':
    'School=Alteration ' +
    'Level=M2 ' +
    'Description="Touched $L30\' sq item held closed"',
  'Word Of Recall':
    'School=Alteration ' +
    'Level=C6 ' +
    'Description="Self instant teleport to prepared sanctuary"',
  'Write':
    'School=Evocation ' +
    'Level=M1 ' +
    'Description="Self copy unknown spell (save vs spell, fail damage and unconsciousness) for $L hr"'
};
OldSchool.WEAPONS = {
  'Bardiche':'Category=2h Damage=2d4',
  'Bastard Sword':'Category=2h Damage=2d4',
  'Battle Axe':'Category=1h Damage=d8',
  'Bec De Corbin':'Category=2h Damage=d8',
  'Bill-Guisarme':'Category=2h Damage=2d4',
  'Bo Stick':'Category=2h Damage=d6',
  'Broad Sword':'Category=1h Damage=2d4', // Best guess on category
  'Club':'Category=1h Damage=d6 Range=10',
  'Composite Longbow':'Category=R Damage=d6 Range=60',
  'Composite Shortbow':'Category=R Damage=d6 Range=50',
  'Dagger':'Category=Li Damage=d4 Range=10',
  'Dart':'Category=R Damage=d3 Range=15',
  'Fauchard':'Category=2h Damage=d6',
  'Fauchard-Fork':'Category=2h Damage=d8',
  'Glaive':'Category=2h Damage=d6',
  'Glaive-Guisarme':'Category=2h Damage=2d4',
  'Guisarme':'Category=2h Damage=2d4',
  'Guisarme-Voulge':'Category=2h Damage=2d4',
  'Halberd':'Category=2h Damage=d10',
  'Hammer':'Category=Li Damage=d4+1 Range=10',
  'Hand Axe':'Category=Li Damage=d6 Range=10',
  'Heavy Crossbow':'Category=R Damage=d4+1 Range=80',
  'Heavy Flail':'Category=2h Damage=d6+1',
  'Heavy Lance':'Category=2h Damage=d6+3',
  'Heavy Mace':'Category=1h Damage=d6+1',
  'Heavy Pick':'Category=1h Damage=d6+1',
  'Javelin':'Category=R Damage=d6 Range=20',
  'Jo Stick':'Category=2h Damage=d6',
  'Light Crossbow':'Category=R Damage=d4 Range=60',
  'Light Flail':'Category=1h Damage=d4+1',
  'Light Lance':'Category=2h Damage=d6',
  'Light Mace':'Category=Li Damage=d6',
  'Light Pick':'Category=Li Damage=d4+1',
  'Longbow':'Category=R Damage=d6 Range=70',
  'Long Sword':'Category=1h Damage=d8',
  'Lucern Hammer':'Category=2h Damage=2d4',
  'Medium Lance':'Category=2h Damage=d6+1',
  'Military Fork':'Category=2h Damage=d8',
  'Morning Star':'Category=1h Damage=2d4',
  'Partisan':'Category=2h Damage=d6',
  'Pike':'Category=2h Damage=d6',
  'Quarterstaff':'Category=2h Damage=d6',
  'Ranseur':'Category=2h Damage=2d4',
  'Scimitar Sword':'Category=1h Damage=d8',
  'Shortbow':'Category=R Damage=d6 Range=50',
  'Short Sword':'Category=Li Damage=d6',
  'Sling':'Category=R Damage=d4 Range=40',
  'Spear':'Category=2h Damage=d6 Range=10',
  'Spetum':'Category=2h Damage=d6+1',
  'Trident':'Category=1h Damage=d6+1',
  'Two-Handed Sword':'Category=2h Damage=d10',
  'Unarmed':'Category=Un Damage=d2',
  'Voulge':'Category=2h Damage=2d4'
};

/*
 * Changes from 1st Edition to 2nd Edition and OSRIC--see editedRules.
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
        'Features=' +
          '"1:Armor Proficiency (Leather/Padded/Studded Leather/Scale Mail/Hide/Chain)",' +
          '"1:Charming Music","1:Defensive Song","1:Legend Lore",' +
          '"1:Poetic Inspiration","1:Rogue Skills" ' +
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
        'Features=' +
          '"1:Armor Proficiency (Leather)","1:Shield Proficiency (All)",' +
          '"wisdom >= 13 ? 1:Bonus Cleric Spells",' +
          '"1:Resist Fire","1:Resist Lightning","3:Nature Knowledge",' +
          '"3:Wilderness Movement","3:Woodland Languages","7:Fey Immunity",' +
          '7:Shapeshift ' +
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
        'Features-="1:Fighting The Unskilled" ' +
        'Experience=' +
          '0,2,4,8,16,32,64,125,250,500,750,1000,1250,1500,1750,2000,2250,' +
          '2500,2750,3000',
      'Illusionist':
        'Require="dexterity >= 16","intelligence >= 9" ' +
        'Features=' +
          '"Intelligence >= 16 ? 1:Bonus Illusionist Experience",' +
          '"1:Empowered Illusions","1:Illusion Resistance",' +
          '"9:Craft Minor Magic",' +
          '"1:School Opposition (Abjuration)",' +
          '"1:School Opposition (Evocation)",' +
          '"1:School Opposition (Necromancy)",' +
          '"1:School Specialization (Illusion)" ' +
        'SpellSlots=' +
          'W1:1=2;2=3;4=4;5=5;13=6,' +
          'W2:3=2;4=3;7=4;10=5;13=6,' +
          'W3:5=2;6=3;8=4;11=5;13=6,' +
          'W4:7=2;8=3;11=4;12=5;15=6,' +
          'W5:9=2;10=3;11=4;12=5;15=6,' +
          'W6:12=2;13=3;16=4;20=5,' +
          'W7:14=2;16=3;17=4,' +
          'W8:16=2;17=3;19=4,' +
          'W9:18=2;20=3',
      'Magic User':
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Magic User Experience",' +
          '"9:Craft Minor Magic" ' +
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
        'Features=' +
          '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
          '"strength >= 16/charisma >= 16 ? 1:Bonus Paladin Experience",' +
          '"1:Cure Disease","1:Detect Evil",1:Discriminating,' +
          '"1:Divine Health","1:Divine Protection","1:Lay On Hands",' +
          '1:Non-Materialist,1:Philanthropist,"1:Protection From Evil",' +
          '"3:Turn Undead","4:Summon Warhorse" ' +
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
        'HitDie=d10 ' +
        'Features=' +
          '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
          '"strength >= 16/dexterity >= 16/wisdom >= 16 ? 1:Bonus Ranger Experience",' +
          '"1:Animal Empathy","1:Ranger Skills","1:Track","1:Travel Light",' +
          '"2:Favored Enemy","10:Band Of Followers" ' +
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
           '"alignment != \'Lawful Good\'","dexterity >= 9"'
    },
    'Feature':{
      // Modified
      'Charming Music':
        'Section=feature Note="Modify listener reaction 1 category (-%1 paralyzation save neg)"',
      'Deadly Aim':
        'Note="+1 Sling Attack Modifier/+1 Staff Sling Attack Modifier/+1 thrown weapon attack"',
      'Defensive Song':
        'Note="Spell save to counteract magical song and poetry attacks"',
      'Favored Enemy':'Note="+4 attack vs. chosen foe type"',
      'Legend Lore':'Note="%V% info about magic item"',
      'Poetic Inspiration':
        'Note="3 rd performance gives allies +1 attack, +1 saves, or +2 morale for %V rd"',
      'Read Scrolls':'Note="75% cast any spell from scroll"',
      'Sense Construction':'Note="R10\' 87% Detect new construction"',
      'Stealthy':
        'Note="Foe -4 surprise roll when traveling quietly, -2 opening doors"',
      'Track':'Section=skill Note="+%V Tracking"',
      // New
      'Ambidextrous':'Section=combat Note="No penalty for two-handed fighting"',
      'Animal Empathy':
        'Section=skill Note="Automatic friend to domestic animals, shift wild reaction one category (%V Wand save neg)"',
      'Bonus Illusionist Experience':
        'Section=ability Note="10% added to awarded experience"',
      'Circle Of Power':
        'Section=save Note="R30\' Unsheathed <i>Holy Sword</i> dispels hostile magic up to level %V"',
      'Empowered Illusions':
        'Section=magic Note="Foes -1 save vs. illusion spells"',
      'Illusion Focus':
        'Section=magic Note="+1 illusion spell each level"',
      'Illusion Resistance':
        'Section=save Note="+1 vs. illusions"',
      'Gnome Ability Adjustment':
        'Section=ability Note="+1 Intelligence/-1 Wisdom"',
      'Magic Mismatch':
        'Section=feature Note="20% magic item malfunction"',
      'Ranger Skills':
        'Section=skill Note="%1 Hide In Shadows/%2 Move Silently"',
      'School Opposition (Abjuration)':
        'Section=magic Note="Cannot learn or cast Abjuration spells"',
      'School Opposition (Alteration)':
        'Section=magic Note="Cannot learn or cast Alteration spells"',
      'School Opposition (Conjuration)':
        'Section=magic Note="Cannot learn or cast Conjuration spells"',
      'School Opposition (Divination)':
        'Section=magic Note="Cannot learn or cast Greater Divination spells"',
      'School Opposition (Enchantment)':
        'Section=magic Note="Cannot learn or cast Enchantment spells"',
      'School Opposition (Evocation)':
        'Section=magic Note="Cannot learn or cast Evocation spells"',
      'School Opposition (Illusion)':
        'Section=magic Note="Cannot learn or cast Illusion spells"',
      'School Opposition (Necromancy)':
        'Section=magic Note="Cannot learn or cast Necromancy spells"',
      'School Specialization (Abjuration)':
        'Section=magic,save Note="Extra Abjuration spell/dy each spell level","+1 vs. Abjuration spells"',
      'School Specialization (Alteration)':
        'Section=magic,save Note="Extra Alteration spell/dy each spell level","+1 vs. Abjuration spells"',
      'School Specialization (Conjuration)':
        'Section=magic,save Note="Extra Conjuration spell/dy each spell level","+1 vs. Abjuration spells"',
      'School Specialization (Divination)':
        'Section=magic,save Note="Extra Divination spell/dy each spell level","+1 vs. Abjuration spells"',
      'School Specialization (Enchantment)':
        'Section=magic,save Note="Extra Enchantment spell/dy each spell level","+1 vs. Abjuration spells"',
      'School Specialization (Evocation)':
        'Section=magic,save Note="Extra Evocation spell/dy each spell level","+1 vs. Abjuration spells"',
      'School Specialization (Illusion)':
        'Section=magic,save Note="Extra Illusion spell/dy each spell level","+1 vs. Abjuration spells"',
      'School Specialization (Necromancy)':
        'Section=magic,save Note="Extra Necromancy spell/dy each spell level","+1 vs. Abjuration spells"',
      'Woodland Languages':'Section=skill Note="+%V Language Count"'
    },
    'Race':{
      // Removed
      'Half-Orc':null,
      // Modified
      'Dwarf':
        'Require=' +
          '"charisma <= 17","constitution >= 11","dexterity <= 17",' +
          '"strength >= 8" ' +
        'Features+="1:Magic Mismatch" ' +
        'Languages=Common,Dwarf',
      'Elf':
        'Require=' +
          '"charisma >= 8","constitution >= 7","dexterity >= 6",' +
          '"intelligence >= 8" ' +
        'Languages=Common,Elf',
      'Gnome':
        'Require=' +
          '"constitution >= 8","intelligence >= 6","strength >= 6" ' +
        'Features=' +
          '"1:Burrow Tongue","1:Direction Sense","1:Gnome Dodge",' +
          '"1:Gnome Enmity",1:Infravision,"1:Know Depth","1:Resist Magic",' +
          '"1:Magic Mismatch","1:Sense Hazard","1:Sense Slope",' +
          '"rogueSkillLevel > 0 ? 1:Gnome Skill Modifiers" ' +
        'Languages=Common,Gnome',
      'Half-Elf':
        'Languages=Common',
      'Halfling':
        'Require=' +
          '"constitution >= 10","dexterity >= 7","intelligence >= 6",' +
          '"strength >= 7","wisdom <= 17" ' +
        'Languages=Common,Halfling'
    },
    'School':{
      // Removed
      'Divination':null,
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
      'Blind-Fighting':'Class=Bard,Fighter,Paladin,Ranger,Thief',
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
      'Mountaineering':'Class=Fighter,Paladin,Ranger',
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
        'Level=P5 ' +
        'Duration="$L2 rd" ' +
        'Range="80\'"',
      'Animal Friendship':
        'Level=P1',
      'Animal Summoning I':
        'Level=P4 ' +
        'Range="1 mi"',
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
      'Anti-Animal Shell':
        'Level=P6',
      'Anti-Magic Shell':
        'Level=W6',
      'Anti-Plant Shell':
        'Level=P5 ' +
        'Range="7.5\' radius"',
      'Antipathy/Sympathy':
        'Level=W8',
      'Astral Spell':
        'Level=P7,W9 ' +
        'Effect="7"',
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
      'Chariot Of Fire':
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
      'Clenched Fist':
        'Level=W8',
      'Clone':
        'Level=W8',
      'Cloudkill':
        'Level=W5',
      'Color Spray':
        'Level=W1 ' +
        'Effect="20\' cone"',
      'Combine':
        'Level=P1',
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
        'Effect="1d4+$L or more creatures in 60\' sq"',
      'Confusion P7':
        'Level=P7 ' +
        'Duration="$L rd" ' +
        'Effect="1d4 creatures in 40\' sq" ' +
        'Range="80\'"',
      'Conjure Animals':
        'Level=P6,W6 ' +
        'Effect="$L2 HD"',
      'Conjure Animals P6':
        'Level=P6 ' +
        'Duration="$L2 rd"',
      'Conjure Earth Elemental':
        'Level=P7 ' +
        'Effect="elemental"',
      'Conjure Elemental':
        'Level=W5',
      'Conjure Fire Elemental':
        'Level=P6 ' +
        'Effect="Elemental creature"',
      'Contact Other Plane':
        'Level=W5 ' +
        'School="Greater Divination"',
      'Create Water':
        'Level=P1 ' +
        'Range="30\'"',
      'Continual Light':
        'Level=P3,W2',
      'Continual Light P3':
        'Level=P3 ' +
        'Range="120\'"',
      "Control Temperature 10' Radius":
        'Level=P4 ' +
        'Effect="${lvl*10}F"',
      'Control Weather':
        'Level=P7,W6',
      'Control Weather P7':
        'Level=P7 ' +
        'Duration="4d12 hr"',
      'Control Winds':
        'Level=P5',
      'Create Food And Water':
        'Level=P3 ' +
        'Effect="$L person/dy"',
      'Creeping Doom':
        'Level=P7 ' +
        'Effect="20\' sq"',
      'Crushing Hand':
        'Level=W9',
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
      'Darkness':
        'Level=W2',
      'Deafness':
        'Level=W2',
      'Death Spell':
        'Level=W6 ' +
        'School=Necromancy ' +
        'Effect="$L30\' cu"',
      'Delayed Blast Fireball':
        'Level=W7',
      'Demi-Shadow Magic':
        'Level=W6 ' +
        'Description="R$L10plus60\' Mimics spell level 4-5"',
      'Demi-Shadow Monsters':
        'Level=W5',
      'Detect Charm':
        'Level=P2 ' +
        'School="Lesser Divination"',
      'Detect Evil':
        'Level=P1,W2 ' +
        'School="Lesser Divination"',
      'Detect Evil P1':
        'Level=P1 ' +
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
        'Level=P1 ' +
        'Duration="1 tn" ' +
        'Effect="10\'x30\' path"',
      'Detect Pits And Snares':
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
        'Description="R120\' 50% (+5%/-5% per caster level delta) magic in 30\' cu extinguished"',
      'Dispel Magic P3':
        'Level=P3 ' +
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
      'Duo-Dimension':
        'Level=W7',
      'Earthquake':
        'Level=P7',
      'Emotion':
        'Level=W4 ' +
        'Description="R$L10\' Targets in 20\' sq experience courage (+1 attack, +3 damage, +5 HP), fear (flee), friendship (react positively), happiness (+4 reaction), hate (react negatively), hope (+2 morale, save, attack, damage), hopelessness (walk away or surrender), or sadness (-1 surprise, +1 init) for conc"',
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
        'Description="R30\' Erase magical ($L5plus30% chance) or normal (90%) from 2-page area"',
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
      'False Trap':
        'Level=W2',
      'Faerie Fire':
        'Level=P1',
      'Fear':
        'Level=W4',
      'Feather Fall':
        'Level=W1 ' +
        'Duration="$L rd"',
      'Feeblemind':
        'Level=W5 ' +
        'Description="R$L10\' Target Int 2 (save Priest +1, Wizard -4 and non-human -2 neg)"',
      'Feign Death':
        'Level=P3,W3 ' +
        'Duration="$Lplus6 tn"',
      'Feign Death P3':
        'Level=P3 ' +
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
        'Description="Touched arrow 1 HP fire damage within 1 rd or R$L10plus30 self cast $Ldiv5 bolts for 5d6 HP (save half)"',
      'Flame Strike':
        'Level=P5',
      'Floating Disk':
        'Level=W1 ' +
        'Range="20\'"',
      'Fly':
        'Level=W3 ' +
        'Duration="1d6+$L tn" ' +
        'Effect="180\'/rd"',
      'Fog Cloud':
        'Level=W2',
      "Fool's Gold":
        'Level=W2',
      'Forceful Hand':
        'Level=W6',
      'Forget':
        'Level=W2',
      'Freezing Sphere':
        'Level=W6',
      'Friends':
        'Level=W1 ' +
        'Description="R60\' Self Cha +2d4 for 1d4+$L rd"',
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
      'Grasping Hand':
        'Level=W7',
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
        'Duration="for $L hr (save disbelieve)" ' +
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
        'Description="Obscured writing transmits <i>Suggestion</i> (save neg) for readers other than specified for $L dy"',
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
      'Instant Summons':
        'Level=W7',
      'Interposing Hand':
        'Level=W5',
      'Invisibility':
        'Level=W2',
      "Invisibility 10' Radius":
        'Level=W3',
      'Invisibility To Animals':
        'Level=P1 ' +
        'Effect="$L touched"',
      'Invisible Stalker':
        'Level=W6',
      'Irresistible Dance':
        'Level=W8',
      'Jump':
        'Level=W1 ' +
        'Duration="for $L+1d3 rd"',
      'Knock':
        'Level=W2 ' +
        'Description="R60\' Open stuck, locked item (rev locks)"',
      'Know Alignment':
        'Level=P2,W2 ' +
        'School="Lesser Divination" ' +
        'Effect="1 target/2 rd"',
      'Know Alignment P2':
        'Level=P2 ' +
        'Effect="1 target/rd"',
      'Legend Lore':
        'Level=W6 ' +
        'School="Greater Divination"',
      'Levitate':
        'Level=W2',
      'Lightning Bolt':
        'Level=W3 ' +
        'Effect="${Lmax10}d6"',
      'Light':
        'Level=P1,W1',
      'Light P1':
        'Level=P1 ' +
        'Duration="$Lplus6 tn" ' +
        'Range="120\'"',
      'Limited Wish':
        'Level=W7',
      'Locate Object':
        'Level=P3,W2 ' +
        'School="Lesser Divination"',
      'Locate Object P3':
        'Level=P3 ' +
        'Range="$L10plus60\'"',
      'Lower Water':
        'Level=P4,W6 ' +
        'Description="R$R $L10\' sq fluid subsides by $L2\' for $D (rev raises)" ' +
        'Duration="$L5 rd" ' +
        'Range="80\'"',
      'Lower Water P4':
        'Level=P4 ' +
        'Duration="$L tn" ' +
        'Range="120\'"',
      "Mage's Faithful Hound":
        'Level=W5 ' +
        'Duration="$L3plus6 tn"',
      "Mage's Sword":
        'Level=W7',
      'Magic Aura':
        'Level=W1',
      'Magic Jar':
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
        'Description="Remote whispering for $L5 rd"',
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
      'Mnemonic Enhancer':
        'Level=W4',
      'Monster Summoning I':
        'Level=W3',
      'Monster Summoning II':
        'Level=W4',
      'Monster Summoning III':
        'Level=W5',
      'Monster Summoning IV':
        'Level=W6 ' +
        'Effect="1d3"',
      'Monster Summoning V':
        'Level=W7 ' +
        'Effect="1d3"',
      'Monster Summoning VI':
        'Level=W8 ' +
        'Effect="1d3"',
      'Monster Summoning VII':
        'Level=W9',
      'Move Earth':
        'Level=W6 ' +
        'Effect="40\'x40\'x10\'"',
      'Neutralize Poison':
        'Level=P4 ' +
        'School=Necromancy',
      'Non-Detection':
        'Level=W3 ' +
        'Duration="$L hr" ' +
        'Effect="Touched"',
      'Obscurement':
        'Level=P2',
      'Part Water':
        'Level=P6,W6',
      'Part Water P6':
        'Level=P6 ' +
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
      'Phantasmal Force':
        'Level=W1',
      'Phantasmal Killer':
        'Level=W4',
      'Plane Shift':
        'Level=P5',
      'Plant Door':
        'Level=P4',
      'Plant Growth':
        'Level=P3,W4',
      'Plant Growth P3':
        'Level=P3 ' +
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
        'Level=P1 ' +
        'Duration="$L3 rd"',
      "Protection From Evil 10' Radius":
        'Level=P4,W3',
      "Protection From Evil 10' Radius P4":
        'Level=P4 ' +
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
        'Level=P3 ' +
        'Range="160\'"',
      'Quest':
        'Level=P5',
      'Raise Dead':
        'Level=P5',
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
        'Duration="1d4+$L rd" ' +
        'Range="$L10+30\'"',
      'Sanctuary':
        'Level=P1 ' +
        'Effect="Touched"',
      'Secret Chest':
        'Level=W5',
      'Shades':
        'Level=W6',
      'Shadow Door':
        'Level=W5',
      'Shadow Magic':
        'Level=W5 ' +
        'Description="R$L10plus50\' Mimics spell level 1-3"',
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
      'Sleep':
        'Level=W1 ' +
        'Range="30\'"',
      'Spectral Force':
        'Level=W3 ' +
        'Range="$Lplus60\'"',
      'Spell Immunity':
        'Level=P4,W8 ' +
        'Description="Touched immune to specified spell for $L tn"',
      'Spider Climb':
        'Level=W1 ' +
        'Duration="$Lplus3 rd"',
      'Spiritual Weapon':
        'Level=P2 ' +
        'Duration="$Lplus3 rd" ' +
        'Range="$L10\'"',
      'Statue':
        'Level=W7',
      'Sticks To Snakes':
        'Level=P4 ' +
        'Effect="1d4+$L sticks"',
      'Stone Shape':
        'Level=P3,W5',
      'Stone Shape P3':
        'Level=P3 ' +
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
        'Level=P7 ' +
        'Description="Glowing symbol causes hopelessness, pain, or persuasion for $L tn"',
      'Telekinesis':
        'Level=W5',
      'Temporal Stasis':
        'Level=W9',
      'Time Stop':
        'Level=W9 ' +
        'Duration="1d3 rd"',
      'Tiny Hut':
        'Level=W3 ' +
        'Duration="$Lplus4 hr" ' +
        'Effect="7.5\' radius"',
      'Tongues':
        'Level=P4,W3',
      'Tongues P4':
        'Level=P4 ' +
        'Duration="1 tn"',
      'Trap The Soul':
        'Level=W8',
      'Transformation':
        'Level=W6',
      'Transmute Metal To Wood':
        'Level=P7 ' +
        'Effect="$L10 lb"',
      'Transmute Rock To Mud':
        'Level=P5,W5',
      'Transmute Rock To Mud P5':
        'Level=P5 ' +
        'Range="160\'"',
      'Transmute Water To Dust':
        'Level=P6,W6 ' +
        'Effect="$L3\' cu"',
      'Transport Via Plants':
        'Level=P6',
      'Tree':
        'Level=P3',
      'True Seeing':
        'Level=P5,W6 ' +
        'School="Greater Divination" ' +
        'Effect="" ' +
        'Range="60\'"',
      'True Seeing P5':
        'Level=P5 ' +
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
        'Duration="1d4+$L hr"',
      'Water Breathing P3':
        'Level=P3 ' +
        'Duration="$L hr"',
      'Wall Of Fire':
        'Level=P5,W4 ' +
        'Effect="$L20\' sq wall or $L5div2plus10\' radius circle" ' +
        'Range="60\'"',
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
      // Added
      'Abjure':
        'Level=P4 ' +
        'School=Abjuration ' +
        'Description="R10\' Return outsider to home plane 50%+HD delta"',
      'Acid Arrow':
        'Level=W2 ' +
        'School=Conjuration ' +
        'Description="R180\' Ranged touch 2d4 HP/rd for $Ldiv3plus1 rd"',
      'Advanced Illusion':
        'Level=W5 ' +
        'School=Illusion ' +
        'Description="R$L10plus60\' $L10plus40\' sq sight, sound, smell, temperature moving illusion for $L rd (save disbelieve)"',
      'Aid':
        'Level=P2 ' +
        'School=Necromancy ' +
        'Description="Touched +1 attack and damage, +1d8 HP for $Lplus1 rd"',
      'Air Walk':
        'Level=P5 ' +
        'School=Alteration ' +
        'Description="Touched walk on air for $Lplus6 tn"',
      'Alarm':
        'Level=W1 ' +
        'School=Abjuration ' +
        'Description="R10\' 20\' cu alarmed for $L30plus240 rd"',
      'Alter Self':
        'Level=W2 ' +
        'School=Alteration ' +
        'Description="Self change form for 3d4+$L2 rd"',
      'Armor':
        'Level=W1 ' +
        'School=Conjuration ' +
        'Description="Touched AC 6 for $Lplus8 HP"',
      'Avoidance':
        'Level=W5 ' +
        'School=Abjuration ' +
        'Description="R10\' 3\' cu target moves away from all but self"',
      'Banishment':
        'Level=W7 ' +
        'School=Abjuration ' +
        'Description="R20\' For $L2 HD creatures out of plane (save neg)"',
      'Bind':
        'Level=W2 ' +
        'School=Enchantment ' +
        'Description="R30\' $L5plus50\' rope-like item entangles or trips single target (save neg)"',
      'Binding':
        'Level=W8 ' +
        'School=Enchantment ' +
        'Description="R10\' Magical effect restrains creature (save neg)"',
      'Black Tentacles':
        'Level=W4 ' +
        'School=Conjuration ' +
        'Description="R30\' Many 10\' tentacles in 30\' sq AC 4, $L HP, Damage 2d4-3d4 (save 1d4)"',
      'Changestaff':
        'Level=P7 ' +
        'School=Evocation ' +
        'Description="Staff becomes Treant (12 HD, 40 HP, AC 0)"',
      'Chain Lightning':
        'Level=W6 ' +
        'School=Evocation ' +
        'Description="R$L5plus40\' Bolt arcs between $L targets for ${Lmax12}d6 HP down to 1d6 HP (save half)"',
      'Chill Touch':
        'Level=W1 ' +
        'School=Necromancy ' +
        'Description="Touched 1d4 HP, 1 Str damage for $Lplus3 rd"',
      'Cloak Of Bravery':
        'Level=P4 ' +
        'School=Conjuration ' +
        'Description="1-4 touched +4-1 vs. fear (rev touched 3\' fear aura)"',
      'Combine':
        'School=Evocation ' +
        'Description="2-4 Assistants give focus priest +2-4 level spellcasting and turning"',
      'Contagion':
        'Level=W4 ' +
        'School=Necromancy ' +
        'Description="R30\' Target diseased, -2 Str, Dex, Cha, and attack (save neg)"',
      'Contingency':
        'Level=W6 ' +
        'School=Evocation ' +
        'Description="Trigger self spell conditionally for $L dy"',
      'Control Undead':
        'Level=W7 ' +
        'School=Necromancy ' +
        'Description="R20\' Command 1d6 undead totaling $L HD for 3d4+$L rd (3 HD save neg)"',
      'Crystalbrittle':
        'Level=W9 ' +
        'School=Alteration ' +
        'Description="Touched $L2\' cu becomes fragile"',
      'Cure Blindness Or Deafness':
        'Level=P3 ' +
        'School=Abjuration ' +
        'Description="Touch cures (rev causes, save neg) non-organic blindness or deafness"',
      'Death Fog':
        'Level=W6 ' +
        'School=Alteration ' +
        'Description="R30\' $L20\' fog kills plants, animals take 1, 2, 4, 8 HP for 1d4+$L rd"',
      'Deeppockets':
        'Level=W2 ' +
        'School=Alteration ' +
        'Description="Touched garment carries 100 lbs comfortably for $Lplus12 hr"',
      'Delude':
        'Level=W3 ' +
        'School=Alteration ' +
        'Description="Self aura show alignment of creature in 10\' radius for $L tn"',
      'Demand':
        'Level=W8 ' +
        'School=Evocation ' +
        'Description="Remote 25-word <i>Suggestion</i> (-2 save neg)"',
      'Detect Poison':
        'Level=P1 ' +
        'School="Lesser Divination" ' +
        'Description="Detect whether object has been poisoned, $L5% type, for $Lplus10 rd"',
      'Detect Scrying':
        'Level=W4 ' +
        'School="Lesser Divination" ' +
        'Description="Note scrying in 120\' radius for 1d6+$L tn"',
      'Detect Undead':
        'Level=W1 ' +
        'School="Lesser Divination" ' +
        'Description="Self discern undead in 60\'x$L10\' area for 3 tn"',
      'Disjunction':
        'Level=W9 ' +
        'School=Alteration ' +
        'Description="R30\' Magic removed (artifacts $L%)"',
      'Dismissal':
        'Level=W5 ' +
        'School=Abjuration ' +
        'Description="R10\' Outsider returned to home plane (+HD delta save neg)"',
      'Domination':
        'Level=W5 ' +
        'School=Enchantment ' +
        'Description="R$L10\' Self control target actions until save"',
      'Dream':
        'School=Evocation ' +
        'Description="Touched sends message to named recipient in dream"',
      'Dust Devil':
        'Level=P2 ' +
        'School=Conjuration ' +
        'Description="R30\' AC 4, 2 HD, dmg 1d4 air elemental attacks for $L2 rd"',
      'Endure Cold':
        'Level=P1 ' +
        'School=Alteration ' +
        'Description="Touched withstand -30F for $L30 min"',
      'Endure Heat':
        'Level=P1 ' +
        'School=Alteration ' +
        'Description="Touched withstand 130F for $L30 min"',
      'Energy Drain':
        'Level=W9 ' +
        'School=Evocation ' +
        'Description="Touched loses 2 levels or HD"',
      'Enervation':
        'Level=W4 ' +
        'School=Necromancy ' +
        'Description="Target drained of $Ldiv4 levels for 1d4+$L hr (save neg)"',
      'Ensnarement':
        'Level=W6 ' +
        'School=Conjuration ' +
        'Description="R10\' Entrap extra-planar creature"',
      'Enthrall':
        'Level=P2 ' +
        'School=Enchantment ' +
        'Description="Self fascinate 90\' radius (save neg)"',
      'Exaction':
        'Level=P7 ' +
        'School=Evocation ' +
        'Description="Demand service of extra-planar creature"',
      'Eyebite':
        'Level=W6 ' +
        'School=Enchantment ' +
        'Description="R20\' Self gaze charm, fear, sicken, or sleep attack for $Ldiv3 rd"',
      'Fabricate':
        'Level=W5 ' +
        'School=Enchantment ' +
        'Description="R$L5\' Convert $L3\' cu material into product"',
      'False Vision':
        'Level=W5 ' +
        'School="Greater Divination" ' +
        'Description="Mislead scrying of 30\' radius for 1d4+$L rd"',
      'Flame Blade':
        'Level=P2 ' +
        'School=Evocation ' +
        'Description="Self wield flaming scimitar (1d4+4 HP, +2 vs. vulnerable or undead) for $Ldiv2plus4 rd"',
      'Flame Walk':
        'Level=P3 ' +
        'School=Alteration ' +
        'Description="$Ldiv5plus1 touched immune non-magical fire, +2 and half dmg magical for $Lplus1 rd"',
      'Flaming Sphere':
        'Level=W2 ' +
        'School=Evocation ' +
        'Description="R10\' 3\' radius sphere 2d4 HP (save neg) move 30\'/rd for $L rd"',
      'Forbiddance':
        'Level=P6 ' +
        'School=Abjuration ' +
        'Description="R30\' $L60\' cu limits magical entry based on alignment, password"',
      'Forcecage':
        'Level=W7 ' +
        'School=Evocation ' +
        'Description="R$L5\' 20\' cu of bars w/1/2 in gaps for $Lplus6 tn"',
      'Foresight':
        'Level=W9 ' +
        'School="Greater Divination" ' +
        'Description="Advance warning of harm to self or another for 2d4+$L rd"',
      'Free Action':
        'Level=P4 ' +
        'School=Abjuration ' +
        'Description="Touched move freely for $L tn"',
      'Giant Insect':
        'Level=P4 ' +
        'School=Alteration ' +
        'Description="R20\' 1-6 insects become ${lvl<10?3:lvl<13?4:6} HD giant version"',
      'Glitterdust':
        'Level=W2 ' +
        'School=Conjuration ' +
        'Description="R10\' 20\' cu glowing dust coats and blinds 1d4+1 rd for 1d4+$L rd"',
      'Grease':
        'Level=W1 ' +
        'School=Conjuration ' +
        'Description="R10\' 10\' sq slippery for $Lplus3 rd"',
      'Goodberry':
        'Level=P2 ' +
        'School=Alteration ' +
        'Description="2d4 berries provide full meal, heal 1 HP (rev 1 HP poison) for $Lplus1 day"',
      "Heroes' Feast":
        'Level=P6 ' +
        'School=Evocation ' +
        'Description="R10\' Meal for $L cures disease, heal 1d4+4 HP, +1 attack and immune poison and fear for 12 hr"',
      'Hold Undead':
        'Level=W3 ' +
        'School=Necromancy ' +
        'Description="R60\' Immobilize 1-3 targets (save neg) totaling $L HD for 1d4+$L rd"',
      'Illusionary Wall':
        'Level=W4 ' +
        'School=Illusion ' +
        'Description="R30\' False 10\' sq wall, floor, or ceiling"',
      'Imbue With Spell Ability':
        'Level=P4 ' +
        'School=Enchantment ' +
        'Description="Transfer divination or cure spellcasting to touched level 1-2 (1 1st), 3-4 (2 1st) or 5+ (2 1st and 1 2nd) non-caster"',
      'Invisibility To Undead':
        'Level=P1 ' +
        'School=Abjuration ' +
        'Description="Touched undetectable by undead (5 HD save) for 6 rd"',
      'Irritation':
        'Level=W2 ' +
        'School=Alteration ' +
        'Description="RL10\' 1-4 targets in 15\' radius itch (-4 AC, -2 attack) for 3 rd or rash (-1 Cha/dy for 4 dy) (save neg)"',
      'Item':
        'Level=W3 ' +
        'School=Alteration ' +
        'Description="Shrink touched $L2\' cu item to 1/12 size, change to cloth for $L4 hr"',
      'Lamentable Belaborment':
        'Level=W5 ' +
        'School=Enchantment ' +
        'Description="R10\' Targets in 10\' radius absorbed in conversation for 3-6 rd (save neg; failed save rd 3 wander away, failed save rd 6 rage attack for 1d4+1 rd)"',
      'Liveoak':
        'Level=P6 ' +
        'School=Enchantment ' +
        'Description="Oak tree guards (S 7-8 HD, 2d8 dmg; M 9-10 HD, 3d6 dmg; L 11-12 HD, 4d6 dmg) based on $L-word command for $L dy"',
      'Locate Animals Or Plants':
        'Level=P1 ' +
        'School="Lesser Divination" ' +
        'Description="$L20plus100 Self discern presence of animal or plant type in 20\' path for $L rd"',
      "Mage's Lucubration":
        'Level=W6 ' +
        'School=Alteration ' +
        'Description="Recall level 1-5 spell uses in prior dy"',
      "Mage's Magnificent Mansion":
        'Level=W7 ' +
        'School=Alteration ' +
        'Description="R10\' Extra-dimensional refuge for $L hr"',
      'Magic Font':
        'Level=P5 ' +
        'School="Greater Divination" ' +
        'Description="Scry via touched holy water font for 1 hr/vial"',
      'Magic Mirror':
        'Level=W4 ' +
        'School=Enchantment ' +
        'Description="Touched mirror becomes scrying device for $L rd"',
      'Magical Stone':
        'Level=P1 ' +
        'School=Enchantment ' +
        'Description="Enchant 3 pebbles (+1 equiv but no bonus, 1d4 dmg, 2d4 vs. undead) for 30 min"',
      'Magical Vestment':
        'Level=P3 ' +
        'School=Enchantment ' +
        'Description="Touched vestment ${7-Math.floor((lvl+1)/3)} for $L5 rd"',
      'Messenger':
        'Level=P2 ' +
        'School=Enchantment ' +
        'Description="R$L20\' Tiny creature delivers note for $L dy"',
      'Meld Into Stone':
        'Level=P3 ' +
        'School=Alteration ' +
        'Description="Self merge into rock for 8+1d8 rd"',
      'Minute Meteors':
        'Level=W3 ' +
        'School=Evocation ' +
        'Description="R$L10plus70\' $L +2 ranged globes 1d4 HP"',
      'Mirage Arcana':
        'Level=W6 ' +
        'School=Illusion ' +
        'Description="R$L10\' $L10\' radius looks like familiar area for conc + $Lplus6 tn"',
      'Mislead':
        'Level=W6 ' +
        'School=Illusion ' +
        'Description="R10\' Self invisible, illusionary double moves and speaks for $L rd"',
      'Moonbeam':
        'Level=P5 ' +
        'School=Evocation ' +
        'Description="R$L10+60\' Moonlight 5\' radius for $L rd"',
      'Mount':
        'Level=W1 ' +
        'School=Conjuration ' +
        'Description="R10\' Create obedient mount for $Lplus2 hr"',
      'Phantom Steed':
        'Level=W3 ' +
        'School=Conjuration ' +
        'Description="R10\' Create obedient mount w/special abilities for $L hr"',
      'Protection From Cantrips':
        'Level=W2 ' +
        'School=Abjuration ' +
        'Description="Touched immune to cantrips for $Lplus5 hr"',
      'Negative Plane Protection':
        'Level=P3 ' +
        'School=Abjuration ' +
        'Description="Touched gains save vs. death magic next draining attack"',
      'Rainbow':
        'Level=P5 ' +
        'School=Evocation ' +
        'Description="R120\' Create magical +2 bow or 3\' x 120 yd bridge for $L rd"',
      'Rainbow Pattern':
        'Level=W4 ' +
        'School=Alteration ' +
        'Description="R10\' 30\' cu captivates 24 HD (save neg), moves 30\'/rd for conc"',
      'Reflecting Pool':
        'Level=P4 ' +
        'School="Lesser Divination" ' +
        'Description="R10\' Use pool to scry for $L rd"',
      'Remove Paralysis':
        'Level=P3 ' +
        'School=Abjuration ' +
        'Description="R$L10\' 1d4 targets in 20\' cu released from magical paralysis"',
      'Resilient Sphere':
        'Level=W4 ' +
        'School=Alteration ' +
        'Description="R20\' Sphere safely entraps target for $L rd (save neg)"',
      'Screen':
        'Level=W8 ' +
        'School="Greater Divination" ' +
        'Description="Divination of $L30\' cu misleads for $L hr"',
      'Secret Page':
        'Level=W3 ' +
        'School=Alteration ' +
        'Description="Overlay page with different contents"',
      'Secure Shelter':
        'Level=W4 ' +
        'School=Alteration ' +
        'Description="R20\' $L30\' sq shelter against elements, intrusion for 1d4+$Lplus1 hr"',
      'Seeming':
        'Level=W5 ' +
        'School=Illusion ' +
        'Description="Alter appearance of $Ldiv2 w/in 30\'"',
      'Sending':
        'Level=W5 ' +
        'School=Evocation ' +
        'Description="Send/receive 25-word message/reply with known recipient"',
      'Sepia Snake Sigil':
        'Level=W3 ' +
        'School=Conjuration ' +
        'Description="R5\' Rune becomes $L HD snake when read; bite immobilizes for $L+1d4 dy"',
      'Sequester':
        'Level=W7 ' +
        'School=Illusion ' +
        'Description="Touched invisible and unscryable for $Lplus7 dy"',
      'Shadow Walk':
        'Level=W7 ' +
        'School=Illusion ' +
        'Description="Self and touched move 7 mi/tn via shadow plane for $L hr"',
      'Shout':
        'Level=W4 ' +
        'School=Evocation ' +
        'Description="Sound in 30\' cone 2d6 HP (save neg) and deafens 2d6 rd (save half)"',
      'Sink':
        'Level=W8 ' +
        'School=Enchantment ' +
        'Description="R$L10\' Target embedded in floor (save neg)"',
      'Solid Fog':
        'Level=W4 ' +
        'School=Alteration ' +
        'Description="R30\' $L10\' cu slows, reduces vision to 2\' for 2d4+$L rd"',
      'Spike Growth':
        'Level=P3 ' +
        'School=Alteration ' +
        'Description="R60\' Plants in $L10\' sq grow thorns (2d4 HP/10\' move) for 3d4+$L tn"',
      'Spike Stones':
        'Level=P5 ' +
        'School=Alteration ' +
        'Description="R30\' Sharp stone in $L10\' sq 1d4 HP for 3d4+$L tn"',
      'Spectral Hand':
        'Level=W2 ' +
        'School=Necromancy ' +
        'Description="R$L5plus30 Glowing hand delivers +2 touch attacks for $L2 rd"',
      'Spell Turning':
        'Level=W7 ' +
        'School=Abjuration ' +
        'Description="Spells aimed at self reflect on caster for $L3 rd"',
      'Spook':
        'Level=W1 ' +
        'School=Illusion ' +
        'Description="R10\' Target flees from self (save neg)"',
      'Starshine':
        'Level=P3 ' +
        'School=Evocation ' +
        'Description="R$L10\' Soft illumination in $L10\' sq for $L tn"',
      'Stoneskin':
        'Level=W4 ' +
        'School=Alteration ' +
        'Description="Touched immune to next 1d4+$Ldiv2 blows"',
      'Succor':
        'Level=P7,W9 ' +
        'School=Alteration ' +
        'Description="Breaking item teleports to self abode"',
      'Summon Swarm':
        'Level=W2 ' +
        'School=Conjuration ' +
        'Description="R60\' Vermin in 10\' cu 1 HP/rd for conc + 2 rd"',
      'Sunray':
        'Level=P7 ' +
        'School=Evocation ' +
        'Description="R10\' 5\' radius blinds 1d3 rd, undead 8d6 HP (3d6 within 20\') for 2-5 rd"',
      'Taunt':
        'Level=W1 ' +
        'School=Enchantment ' +
        'Description="R60\' Targets in 30\' radius attack caster"',
      'Telekinetic Sphere':
        'Level=W8 ' +
        'School=Evocation ' +
        'Description="R20\' Sphere safely entraps and floats target for $L rd (save neg)"',
      'Teleport':
        'Level=W5',
      'Teleport Without Error':
        'Level=W7 ' +
        'School=Alteration ' +
        'Description="Instantly transport self + ${250+Math.max(lvl-10,0)*150} lb to known location"',
      'Transmute Water To Dust':
        'School=Alteration ' +
        'Description="R60\' $E water becomes powder" ' +
        'Effect="$L10\' cu"',
      'Trip':
        'Level=P2 ' +
        'Effect="1 HP"',
      'Uncontrollable Hideous Laughter':
        'Level=W2 ' +
        'School=Enchantment ' +
        'Description="R60\' $Ldiv3 targets in 30\' cu -2 attack and damage for $L rd"',
      'Vacancy':
        'Level=W4 ' +
        'School=Illusion ' +
        'Description="R$L10\' $L10\' radius appears abandoned for $L hr"',
      'Vampiric Touch':
        'Level=W3 ' +
        'School=Necromancy ' +
        'Description="Touch causes $Ldiv2max6 HP added to self"',
      'Water Walk':
        'Level=P3 ' +
        'School=Alteration ' +
        'Description="${lvl-4} touched walk on liquid for $Lplus1 tn"',
      'Weird':
        'Level=W9 ' +
        'School=Illusion ' +
        'Description="R30\' Targets in 20\' radius fight nemeses to death (save paralyze 1 rd, -1d4 Str 1 tn)"',
      'Whispering Wind':
        'Level=W2 ' +
        'School=Alteration ' +
        'Description="R$L mi Self send 25 words or sound to known location"',
      'Wind Wall':
        'Level=W3 ' +
        'School=Alteration ' +
        'Description="R$L10\' Strong wind in $L10\'x5\' area for $L rd"',
      'Withdraw':
        'Level=P2 ' +
        'School=Alteration ' +
        'Description="Self $Lplus1 rd extra time to think, cast divination or self cure"',
      'Wizard Mark':
        'Level=W1 ' +
        'School=Alteration ' +
        'Description="Etch item w/personal mark"',
      'Wraithform':
        'Level=W3 ' +
        'School=Alteration ' +
        'Description="Self insubstantial, effected only by magical weapons for $L2 rd"',
      'Wyvern Watch':
        'Level=P2 ' +
        'School=Evocation ' +
        'Description="R30\' First trespasser in 10\' radius paralyzed $L rd (save neg)"'
    },
    'Weapon':{
      // Removed
      'Bo Stick':null,
      'Hammer':null,
      'Heavy Flail':null,
      'Heavy Lance':null,
      'Heavy Mace':null,
      'Heavy Pick':null,
      'Jo Stick':null,
      'Light Flail':null,
      'Light Lance':null,
      'Light Mace':null,
      'Light Pick':null,
      'Medium Lance':null,
      // Modified
      'Dart':'Range=10',
      // New
      'Arquebus':'Category=R Damage=d10 Range=50',
      'Blowgun':'Category=R Damage=d3 Range=10',
      'Hand Crossbow':'Category=R Damage=d3 Range=60',
      "Footman's Flail":OldSchool.WEAPONS['Heavy Flail'],
      "Footman's Mace":OldSchool.WEAPONS['Heavy Mace'],
      "Footman's Pick":OldSchool.WEAPONS['Heavy Pick'],
      'Harpoon':'Category=R Damage=2d4 Range=10',
      "Horseman's Flail":OldSchool.WEAPONS['Light Flail'],
      "Horseman's Mace":OldSchool.WEAPONS['Light Mace'],
      "Horseman's Pick":OldSchool.WEAPONS['Light Pick'],
      'Knife':'Category=Li Damage=d3 Range=10',
      'Heavy Horse Lance':'Category=2h Damage=d8+1',
      'Light Horse Lance':'Category=2h Damage=d3+1',
      'Medium Horse Lance':OldSchool.WEAPONS['Medium Lance'],
      'Hook Fauchard':'Category=2h Damage=d4',
      'Khopesh':'Category=1h Damage=2d4',
      'Scourge':'Category=1h Damage=d4',
      'Sickle':'Category=1h Damage=d4+1',
      'Staff Sling':'Category=R Damage=d4 Range=30',
      'Warhammer':OldSchool.WEAPONS.Hammer,
      'Whip':'Category=1h Damage=d2'
    },
  },
  'OSRIC':{
    'Class':{
      // Removed
      'Bard':null,
      'Monk':null,
      // Modified
      'Assassin':
        'Require+=' +
          '"wisdom >= 6" ' +
        'WeaponProficiency=3,4,3 ' +
        'Experience=' +
          '0,1.6,3,5.75,12.25,24.75,50,99,200.5,300,400,600,750,1000,1500',
      'Cleric':
        'Require+=' +
          '"charisma >= 6","constitution >= 6","intelligence >= 6",' +
          '"strength >= 6" ' +
        'WeaponProficiency=2,3,3 ' +
        'Experience=' +
          '0,1.55,2.9,6,13.25,27,55,110,220,450,675,900,1125,1350,1575,1800,' +
          '2025,2250,2475,2700',
      'Druid':
        'Require+=' +
          '"constitution >= 6","dexterity >= 6","intelligence >= 6",' +
          '"strength >= 6" ' +
        'WeaponProficiency=2,3,4 ' +
        'Experience=' +
          '0,2,4,8,12,20,35,60,90,125,200,300,750,1500',
      'Fighter':
        'Require+=' +
          '"charisma >= 6","dexterity >= 6","wisdom >= 6" ' +
        'Attack=0,1,1 WeaponProficiency=4,2,2 ' +
        'Experience=' +
          '0,1.9,4.25,7.75,16,35,75,125,250,500,750,1000,1250,1500,1750,2000,' +
          '2250,2500,2750,3000',
      'Illusionist':
        'Require+=' +
          '"charisma >= 6","strength >= 6","wisdom >= 6" ' +
        'WeaponProficiency=1,5,5 ' +
        'Experience=' +
          '0,2.5,4.75,9,18,36,60.25,95,144.5,220,440,660,880,1100,1320,1540,' +
          '1760,1980,2200,2420 ' +
        'SpellSlots=' +
          'I1:1=1;2=2;4=3;5=4;9=5;17=6,' +
          'I2:3=1;4=2;5=3;10=4;12=5;18=6,' +
          'I3:5=1;6=2;9=3;12=4;16=5;20=6,' +
          'I4:7=1;8=2;11=3;15=4;19=5;21=6,' +
          'I5:10=1;11=2;16=3;18=4;19=5;23=6,' +
          'I6:12=1;13=2;17=3;20=4;22=5;24=6,' +
          'I7:14=1;15=2;21=3;23=4;24=5',
      'Magic User':
        'Require+=' +
          '"charisma >= 6","constitution >= 6","wisdom >= 6" ' +
        'Features="7:Craft Minor Magic" ' +
        'WeaponProficiency=1,5,5 ' +
        'Experience=' +
          '0,2.4,4.8,10.25,22,40,60,80,140,250,375,750,1125,1500,1875,2250,' +
          '2625,3000,3375,3750 ' +
        'SpellSlots=' +
          'M1:1=1;2=2;4=3;5=4;12=5;21=6,' +
          'M2:3=1;4=2;6=3;9=4;13=5;21=6,' +
          'M3:5=1;6=2;8=3;11=4;14=5;22=6,' +
          'M4:7=1;8=2;11=3;14=4;17=5;22=6,' +
          'M5:9=1;10=2;11=3;14=4;17=5;23=6,' +
          'M6:12=1;13=2;15=3;17=4;19=5;23=6,' +
          'M7:14=1;15=2;17=3;19=4;22=5;24=6,' +
          'M8:16=1;17=2;19=3;21=4;24=5,' +
          'M9:18=1;20=2;23=3',
      'Paladin':
        'Require+=' +
          '"dexterity >= 6" ' +
        'Features+="1:Circle Of Power" ' +
        'Attack=0,1,1 WeaponProficiency=3,2,2 ' +
        'Experience=' +
          '0,2.55,5.5,12.5,25,45,95,175,325,600,1000,1350,1700,2050,2400,' +
          '2750,3100,3450,3800,4150',
      'Ranger':
        'Require+=' +
          '"charisma >= 6" ' +
        'Features+="1:Ambidextrous" ' +
        'Attack=0,1,1 WeaponProficiency=3,2,2 ' +
        'Experience=' +
          '0,2.25,4.5,9.5,20,40,90,150,225,325,650,975,1300,1625,1950,2275,' +
          '2600,2925,3250,3575',
      'Thief':
        'Require+=' +
          '"charisma >= 6","constitution >= 6","intelligence >= 6",' +
          '"strength >= 6" ' +
        'Experience=' +
          '0,1.25,2.5,5,10,20,40,70,110,160,220,440,660,880,1100,1320,1540,' +
          '1760,1980,2200'
    },
    'Feature':{
      // Modified
      'Dwarf Skill Modifiers':
        'Note="-10 Climb Walls/+15 Find Traps/-5 Move Silently/+15 Open Locks/-5 Read Languages"',
      'Elf Skill Modifiers':
        'Note="-5 Climb Walls/+5 Find Traps/+5 Hear Noise/+10 Hide In Shadows/+5 Move Silently/-5 Open Locks/+5 Pick Pockets/+10 Read Languages"',
      'Favored Enemy':
        'Note="+%V melee damage vs. evil humanoids and giant foes"',
      'Gnome Skill Modifiers':
        'Note="-15 Climb Walls/+5 Hear Noise/+10 Open Locks"',
      'Half-Orc Skill Modifiers':
        'Note="+5 Climb Walls/+5 Find Traps/+5 Hear Noise/+5 Open Locks/-5 Pick Pockets/-10 Read Languages"',
      'Halfling Skill Modifiers':
        'Note="-15 Climb Walls/+5 Hear Noise/+15 Hide In Shadows/+15 Move Silently/+5 Pick Pockets/-5 Read Languages"',
      'Read Scrolls':'Note="%V% cast arcane spell from scroll"',
      // New
      'Human Skill Modifiers':
        'Section=skill Note="+5 Climb Walls/+5 Open Locks"',
      'Slow':'Section=ability Note="-60 Speed"'
    },
    'Race':{
      // Modified
      'Dwarf':
        'Features+=1:Slow',
      'Gnome':
        'Features+=1:Slow,"1:Resist Poison"',
      'Halfling':
        'Features=' +
          '"1:Deadly Aim","1:Halfling Ability Adjustment",1:Infravision,' +
          '"1:Resist Magic","1:Resist Poison","1:Slow",1:Stealthy,' +
          '"rogueSkillLevel > 0 ? 1:Halfling Skill Modifiers" ' +
        'Languages-=Elf',
      'Human':
        'Features="rogueSkillLevel > 0 ? 1:Human Skill Modifiers"'
    },
    'Spell':{
      // Modified
      'Animal Summoning I':
        'Range="$L120\'"',
      'Animal Summoning II':
        'Range="$L180\'"',
      'Animal Summoning III':
        'Range="$L240\'"',
      'Call Woodland Beings':
        'Range="$L30plus360\'"',
      'Create Food And Water':
        'Effect="$L5 person/day"',
      'Darkness I1':
        'Range="$L10plus40\'"',
      'Dispel Magic C3':
        'Effect="30\' radius"',
      'Dispel Magic D4':
        'Effect="$L40\' cu"',
      'Feeblemind D6':
        'Range="40\'"',
      'Fire Storm':
        'Range="150\'"',
      'Floating Disk':
        'Range="20\'"',
      'Guards And Wards':
        'Duration="$L2 hr"',
      'Hallucinatory Terrain I3':
        'Effect="$L10plus40\' sq" ' +
        'Range="$L20plus20\'"',
      'Heat Metal':
        'School=Necromancy',
      'Mass Suggestion':
        'Range="$L10\'"',
      'Permanent Illusion':
        'Range="30\'"',
      'Phase Door':
        'Level=W7 ' +
        'Effect="twice"',
      'Produce Fire':
        'Effect="60\' radius"',
      'Stinking Cloud':
        'Level=W2 ' +
        'Effect="20\' radius"',
      'Stone To Flesh':
        'Effect="$L10\' cu"',
      'Wall Of Force':
        'Duration="$Lplus1 tn"',
      'Water Breathing':
        'Duration="$L rd"'
    },
    'Weapon':{
      // Removed
      'Bardiche':null,
      'Bec De Corbin':null,
      'Bill-Guisarme':null,
      'Bo Stick':null,
      'Fauchard':null,
      'Fauchard-Fork':null,
      'Glaive':null,
      'Glaive-Guisarme':null,
      'Guisarme':null,
      'Guisarme-Voulge':null,
      'Heavy Lance':null,
      'Jo Stick':null,
      'Light Lance':null,
      'Lucern Hammer':null,
      'Medium Lance':null,
      'Military Fork':null,
      'Partisan':null,
      'Pike':null,
      'Ranseur':null,
      'Spetum':null,
      'Voulge':null,
      // Modified
      'Club':'Damage=d4',
      'Heavy Crossbow':'Damage=d6+1 Range=60',
      'Light Crossbow':'Damage=d4+1',
      'Light Mace':'Damage=d4+1',
      'Sling':'Range=35',
      'Spear':'Range=15',
      // New
      'Heavy War Hammer':'Category=1h Damage=d6+1', // Best guess on category
      'Lance':'Category=2h Damage=2d4+1',
      'Light War Hammer':'Category=Li Damage=d4+1',
      'Pole Arm':'Category=2h Damage=d6+1'
    }
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
 * in the edit rules can use =, +=, or -= to indicate whether the new values
 * should replace, be added to, or be removed from the values in #base#.
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
          // .replace allows getAttrValueArray work with [-+]=
          QuilvynUtils.getAttrValueArray(edits[a].replace(/[-+]=/g, '='), attr);
        for(var j = 0; j < values.length; j++) {
          if(!(values[j] + '').match(/^[-+]?\d+$/))
            values[j] = '"' + values[j] + '"';
        }
        var valuesText = values.join(',');
        if(op == '=') {
          // getAttrValue[Array] will pick up the last definition, so appending
          // the replacement is sufficient
          result[a] += ' ' + attr + '=' + valuesText;
        } else if(op == '+=') {
          result[a] =
            result[a].replace(attr + '=', attr + '=' + valuesText + ',');
        } else if(op == '-=') {
          for(var j = 0; j < values.length; j++) {
            var pat = new RegExp(',' + values[j] + '|(?<==)' + values[j] + ',?');
            result[a] = result[a].replace(pat, '');
          }
        }
      }
    }
  }
  return result;
};

/* Defines rules related to character abilities. */
OldSchool.abilityRules = function(rules) {

  for(var ability in OldSchool.ABILITIES) {
    rules.defineRule(ability, ability + 'Adjust', '+', null);
  }

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
    'constitution', '=',
    'source <= 3 ? -2 : source <= 6 ? -1 : source <= 14 ? null : (source - 14)',
    'warriorLevel', 'v', 'source == 0 ? 2 : null',
    'level', '*', null
  );
  rules.defineRule('hitPoints',
    'combatNotes.constitutionHitPointsAdjustment', '+', null,
    'level', '^', null
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

  // Intelligence
  if(OldSchool.EDITION == 'Second Edition') {
    rules.defineRule('featureNotes.intelligenceLanguageBonus',
      'intelligence', '=',
        'source<=9 ? 1 : source == 9 ? 2 : source<=15 ? Math.floor((source-6)/2) : (source-11)'
    );
  } else {
    rules.defineRule('featureNotes.intelligenceLanguageBonus',
      'intelligence', '=',
        'source<=7 ? null : source<=15 ? Math.floor((source-6)/2) : (source-11)'
    );
  }
  rules.defineRule
    ('languageCount', 'featureNotes.intelligenceLanguageBonus', '+', null);


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

  // Wisdom
  rules.defineRule('saveNotes.wisdomMentalSavingThrowAdjustment',
    'wisdom', '=',
    'source<=5 ? (source-6) : source<=7 ? -1 : source<=14 ? null : (source-14)'
  );

};

/* Defines rules related to combat. */
OldSchool.combatRules = function(rules, armors, shields, weapons) {

  QuilvynUtils.checkAttrTable(armors, ['AC', 'Move', 'Weight']);
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
  rules.defineRule('baseAttack', '', '=', '0');
  rules.defineRule('combatNotes.weaponSpecialization',
    'weaponSpecialization', '=', 'source == "None" ? null : source'
  );
  if(OldSchool.EDITION == 'Second Edition') {
    rules.defineRule('combatNotes.weaponSpecialization.1',
      'weaponSpecialization', '=', 'source.indexOf("Bow") >= 0 ? 2 : 1'
    );
    rules.defineRule('combatNotes.weaponSpecialization.2',
      'weaponSpecialization', '=', 'source.indexOf("Bow") >= 0 ? 0 : 2'
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
    if(OldSchool.EDITION == 'OSRIC') {
      rules.defineRule('combatNotes.doubleSpecialization',
        'doubleSpecialization', '?', null,
        'weaponSpecialization', '=', 'source == "None" ? null : source'
      );
      rules.defineRule
        ('features.Double Specialization', 'doubleSpecialization', '=', null);
    }
  }
  rules.defineRule
    ('features.Weapon Specialization', 'weaponSpecialization', '=', null);
  rules.defineRule('meleeAttack',
    'baseAttack', '=', null,
    'combatNotes.strengthAttackAdjustment', '+', null
  );
  rules.defineRule('rangedAttack',
    'baseAttack', '=', null,
    'combatNotes.dexterityAttackAdjustment', '+', null
  );
  rules.defineRule
    ('thac0Melee', 'meleeAttack', '=', 'Math.min(20 - source, 20)');
  rules.defineRule
    ('thac0Ranged', 'rangedAttack', '=', 'Math.min(20 - source, 20)');
  rules.defineRule
    ('thac10Melee', 'meleeAttack', '=', 'Math.min(10 - source, 20)');
  rules.defineRule
    ('thac10Ranged', 'rangedAttack', '=', 'Math.min(10 - source, 20)');
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
  var turningTable = OldSchool.EDITION == 'OSRIC' ? [
    'skeleton:10:7 :4 :T :T :D :D :D :D :D :D',
    'zombie  :13:10:7 :T :T :D :D :D :D :D :D',
    'ghoul   :16:13:10:4 :T :T :D :D :D :D :D',
    'shadow  :19:16:13:7 :4 :T :T :D :D :D :D',
    'wight   :20:19:16:10:7 :4 :T :T :D :D :D',
    'ghast   :- :20:19:13:10:7 :4 :T :T :D :D',
    'wraith  :- :- :20:16:13:10:7 :4 :T :T :D',
    'mummy   :- :- :- :19:16:13:10:7 :4 :T :D',
    'spectre :- :- :- :20:19:16:13:10:7 :T :T',
    'vampire :- :- :- :- :20:19:16:13:10:7 :4',
    'ghost   :- :- :- :- :- :20:19:16:13:10:7',
    'lich    :- :- :- :- :- :- :20:19:16:13:10',
    'fiend   :- :- :- :- :- :- :- :20:19:16:13'
  ] : OldSchool.EDITION == 'Second Edition' ? [
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
  // Replace SRD35's two-handeWeapon validation note
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
    (classes, ['Require', 'HitDie', 'Attack', 'WeaponProficiency', 'Breath', 'Death', 'Petrification', 'Spell', 'Wand', 'Features', 'Selectables', 'Experience', 'CasterLevelArcane', 'CasterLevelDivine', 'SpellAbility', 'SpellSlots']);
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
  for(var save in {
    'Breath':'', 'Death':'', 'Petrification':'', 'Spell':'', 'Wand':''
  }) {
    rules.defineRule('save.' + save,
      'class' + save + 'Save', '=', null,
      'classSaveAdjustment', '+', null
    );
  }
  rules.defineRule('save.Breath', 'classBreathSaveAdjustment', '+', null);
  rules.defineRule
    ('saveNotes.resistMagic', 'constitution', '=', 'Math.floor(source / 3.5)');
  rules.defineRule
    ('saveNotes.resistPoison', 'constitution', '=', 'Math.floor(source / 3.5)');
  if(OldSchool.EDITION == 'First Edition') {
    rules.defineRule('skillNotes.rogueSkills.1',
      'rogueSkillLevel', '=', 'source<=4 ? source+84 : Math.min(2*source+80, 99)'
    );
    rules.defineRule('skillNotes.rogueSkills.2',
      'rogueSkillLevel', '+=', 'Math.min(5*source + 15, 99)'
    );
    rules.defineRule('skillNotes.rogueSkills.3',
      'rogueSkillLevel', '=', '5*Math.floor((source-1)/2) + (source>=15 ? 15 : 10)'
    );
    rules.defineRule('skillNotes.rogueSkills.4',
      'rogueSkillLevel', '=', 'source<5 ? 5*source + 5 : source < 9 ? 6*source + 1 : source<13 ? 7*source - 7 : Math.min(8*source - 19, 99)'
    );
    rules.defineRule('skillNotes.rogueSkills.5',
      'rogueSkillLevel', '=', 'source<5 ? 6*source + 9 : source<7 ? 7*source + 5 : source==7 ? 55 : Math.min(8*source - 2, 99)'
    );
    rules.defineRule('skillNotes.rogueSkills.6',
      'rogueSkillLevel', '=', 'source<5 ? 4*source + 21 : Math.min(5*source+17, 99)'
    );
    rules.defineRule('skillNotes.rogueSkills.7',
      'rogueSkillLevel', '=', 'source < 10 ? 5*source+25 : source<13 ? 10*source-20 : source<16 ? 5*source+40 : 125'
    );
    rules.defineRule('skillNotes.rogueSkills.8',
      'rogueSkillLevel', '=', 'source > 3 ? Math.min(5 * source, 80) : 0'
    );
  } else if(OldSchool.EDITION == 'OSRIC') {
    rules.defineRule('skillNotes.rogueSkills.1',
      'rogueSkillLevel', '=', 'source<7 ? 2*source + 78 : Math.min(source + 84, 99)'
    );
    rules.defineRule('skillNotes.rogueSkills.2',
      'rogueSkillLevel', '=', 'source<18 ? 4*source+21 : Math.min(2*source+55, 99)'
    );
    rules.defineRule
      ('skillNotes.rogueSkills.3', 'rogueSkillLevel', '+=', '3* source + 7');
    rules.defineRule('skillNotes.rogueSkills.4',
      'rogueSkillLevel', '=', 'source < 16 ? 5 * source + 15 : (source + 75)'
    );
    rules.defineRule('skillNotes.rogueSkills.5',
      'rogueSkillLevel', '=', 'source < 16 ? 5 * source + 15 : (source + 75)'
    );
    rules.defineRule('skillNotes.rogueSkills.6',
      'rogueSkillLevel', '=', 'source < 17 ? 4 * source + 26 : (source + 75)'
    );
    rules.defineRule('skillNotes.rogueSkills.7',
      'rogueSkillLevel', '=', 'source < 15 ? 4 * source + 31 : (source + 75)'
    );
    rules.defineRule('skillNotes.rogueSkills.8',
      'rogueSkillLevel', '=', 'source<20 ? Math.max(5*source-5, 1) : Math.min(2*source+52, 99)'
    );
  } else { // Second Edition
    rules.defineRule('maxAllowedSkillAllocation',
      'skillPoints', '=', 'Math.min(Math.floor(source / 2), 95)'
    );
    rules.defineRule('skillPoints',
      'levels.Bard', '+=', '15 * source + 5',
      'levels.Thief', '+=', '30 * source + 30'
    );
    rules.defineRule('skillNotes.rogueSkills.1',
      'levels.Bard', '+=', '50',
      'levels.Thief', '+=', '60'
    );
    rules.defineRule('skillNotes.rogueSkills.2',
      'levels.Bard', '+=', '0',
      'levels.Thief', '+=', '5'
    );
    rules.defineRule('skillNotes.rogueSkills.3',
      'levels.Bard', '+=', '20',
      'levels.Thief', '+=', '15'
    );
    rules.defineRule('skillNotes.rogueSkills.4',
      'levels.Bard', '+=', '0',
      'levels.Thief', '+=', '5'
    );
    rules.defineRule('skillNotes.rogueSkills.5',
      'levels.Bard', '+=', '0',
      'levels.Thief', '+=', '10'
    );
    rules.defineRule('skillNotes.rogueSkills.6',
      'levels.Bard', '+=', '0',
      'levels.Thief', '+=', '10'
    );
    rules.defineRule('skillNotes.rogueSkills.7',
      'levels.Bard', '+=', '10',
      'levels.Thief', '+=', '15'
    );
    rules.defineRule('skillNotes.rogueSkills.8',
      'levels.Bard', '+=', '5',
      'levels.Thief', '+=', '0'
    );
  }
  // No-op to get Rogue Skills note to appear in italics
  rules.defineRule
    ('skillNotes.rogueSkills.1', 'skillNotes.rogueSkills', '+', 'null');
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

  var rogueSkills = [
    '', 'Climb Walls', 'Find Traps', 'Hear Noise', 'Hide In Shadows',
    'Move Silently', 'Open Locks', 'Pick Pockets', 'Read Languages'
  ];
  for(var i = 1; i < rogueSkills.length; i++) {
    var skill = rogueSkills[i];
    if(OldSchool.EDITION == 'Second Edition') {
      rules.defineRule('skills.' + skill, 'skillNotes.rogueSkills', '^=', '0');
      rules.defineRule
        ('skillModifier.' + skill, 'skillNotes.rogueSkills.' + i, '+', null);
    } else {
      rules.defineRule
        ('skills.' + skill, 'skillNotes.rogueSkills.' + i, '+=', null);
    }
  }
  if(OldSchool.EDITION == 'Second Edition') {
    rules.defineChoice('notes', 'skillNotes.armorSkillModifiers:%1 Climb Walls/%2 Find Traps/%3 Hear Noise/%4 Hide In Shadows/%5 Move Silently/%6 Open Locks/%7 Pick Pockets');
    rules.defineRule
      ('skillNotes.armorSkillModifiers', 'rogueSkillLevel', '=', '1');
    for(var i = 1; i < rogueSkills.length; i++) {
      var skill = rogueSkills[i];
      if(skill == 'Read Languages')
        continue;
      rules.defineRule('skillNotes.armorSkillModifiers.' + i,
        'skills.' + skill, '?', '1',
        '', '=', '"+0"'
      );
      rules.defineRule('skillModifier.' + skill,
        'skillNotes.armorSkillModifiers.' + i, '+', null
      );
    }
    rules.defineRule('skillNotes.armorSkillModifiers.1',
      'armor', '=', '{"None":"+10", "Elven Chain":-20, "Chain":-25, "Padded":-30, "Studded Leather":-30}[source]'
    );
    rules.defineRule('skillNotes.armorSkillModifiers.2',
      'armor', '=', '{"Elven Chain":-5, "Chain":-10, "Padded":-10, "Studded Leather":-10}[source]'
    );
    rules.defineRule('skillNotes.armorSkillModifiers.3',
      'armor', '=', '{"Elven Chain":-5, "Chain":-10, "Padded":-10, "Studded Leather":-10}[source]'
    );
    rules.defineRule('skillNotes.armorSkillModifiers.4',
      'armor', '=', '{"None":"+5", "Elven Chain":-10, "Chain":-15, "Padded":-20, "Studded Leather":-20}[source]'
    );
    rules.defineRule('skillNotes.armorSkillModifiers.5',
      'armor', '=', '{"None":"+10", "Elven Chain":-10, "Chain":-15, "Padded":-20, "Studded Leather":-20}[source]'
    );
    rules.defineRule('skillNotes.armorSkillModifiers.6',
      'armor', '=', '{"Elven Chain":-5, "Chain":-10, "Padded":-10, "Studded Leather":-10}[source]'
    );
    rules.defineRule('skillNotes.armorSkillModifiers.7',
      'armor', '=', '{"None":"+5", "Elven Chain":-20, "Chain":-25, "Padded":-30, "Studded Leather":-30}[source]'
    );
    // No-op to get Armor Skill Modifiers note to appear in italics
    rules.defineRule('skillNotes.armorSkillModifiers.1',
      'skillNotes.armorSkillModifiers', '+', 'null'
    );
  }
  QuilvynRules.validAllocationRules
    (rules, 'language', 'languageCount', 'Sum "^languages\\."');
  QuilvynRules.validAllocationRules
    (rules, 'skill', 'skillPoints', 'Sum "^skills\\.[^\\.]*$"');

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
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Class') {
    OldSchool.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Experience'),
      QuilvynUtils.getAttrValue(attrs, 'HitDie'),
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
  else if(type == 'Skill')
    OldSchool.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      QuilvynUtils.getAttrValueArray(attrs, 'Class')
    );
  else if(type == 'Spell') {
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
 * #maxMove#, and weighs #weight# pounds.
 */
OldSchool.armorRules = function(rules, name, ac, maxMove, weight) {

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

  if(rules.armorStats == null) {
    rules.armorStats = {
      ac:{},
      move:{},
      weight:{}
    };
  }
  rules.armorStats.ac[name] = ac;
  rules.armorStats.move[name] = maxMove;
  rules.armorStats.weight[name] = weight;

  if(OldSchool.EDITION != 'Second Edition') {
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
 * progression required to advance levels in the class. The class grants
 * #hitDie# (format [n]'d'n) additional hit points with each level advance.
 * #attack# is a triplet indicating: the attack bonus for a level 1 character;
 * the amount this increases as the character gains levels; the number of levels
 * between increases. Similarly, #saveBreath#, #saveDeath#, #savePetrification#,
 * #saveSpell#, and #saveWand# are each triplets indicating: the saving throw
 * for a level 1 character; the amount this decreases as the character gains
 * levels; the number of levels between decreases. #features# and #selectables#
 * list the fixed and selectable features acquired as the character advances in
 * class level, and #languages# lists any automatic languages for the class.
 * #weaponProficiency# is a triplet indicating: the number of weapon
 * proficiencies for a level 1 character; the number of levels between
 * increments of weapon proficiencies; the penalty for using a non-proficient
 * weapon. #casterLevelArcane# and #casterLevelDivine#, if specified, give the
 * Javascript expression for determining the caster level for the class; these
 * can incorporate a class level attribute (e.g., 'levels.Cleric') or the
 * character level attribute 'level'. If the class grants spell slots,
 * #spellSlots# lists the number of spells per level per day granted.
 */
OldSchool.classRules = function(
  rules, name, requires, experience, hitDie, attack, saveBreath, saveDeath,
  savePetrification, saveSpell, saveWand, features, selectables, languages,
  weaponProficiency, casterLevelArcane, casterLevelDivine, spellSlots
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
  if(!hitDie.match(/^(\d+)?d\d+$/)) {
    console.log('Bad hitDie "' + hitDie + '" for class ' + name);
    return;
  }
  if(!Array.isArray(attack) || attack.length != 3) {
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
    // 2E and OSRIC change level at round number; 1E at round number + 1
    if(OldSchool.EDITION == 'First Edition' && i > 0)
      experience[i] += 1;
  }
  rules.defineRule('experiencePoints.' + name + '.1',
    classLevel, '=', 'source < ' + experience.length + ' ? [' + experience + '][source] : "-"'
  );
  rules.defineRule(classLevel,
    'experiencePoints.' + name, '=', 'source >= ' + experience[experience.length - 1] + ' ? ' + experience.length + ' : [' + experience + '].findIndex(item => item > source)'
  );

  rules.defineRule('baseAttack',
    classLevel, '+', attack[0] + ' + Math.floor((source - 1) / ' + attack[2] + ') * ' + attack[1],
    'classBaseAttackAdjustment', '+', null
  );

  var saves = {
    'Breath':saveBreath, 'Death':saveDeath, 'Petrification':savePetrification,
    'Spell':saveSpell, 'Wand':saveWand
  };
  for(var save in saves) {
    rules.defineRule('class' + save + 'Save',
      classLevel, '+=', saves[save][0] + ' - Math.floor(Math.floor((source - 1) / ' + saves[save][2] + ') * ' + saves[save][1] + ')'
    );
  }

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

  if(name == 'Assassin') {

    rules.defineRule('classBaseAttackAdjustment',
      'levels.Assassin', '+=', 'source > 8 ? 1 : null'
    );
    rules.defineRule
      ('combatNotes.assassination', 'levels.Assassin', '=', '5 * source + 50');
    rules.defineRule('combatNotes.backstab',
      'levels.Assassin', '+=', '2 + Math.floor((source - 1) / 4)'
    );
    rules.defineRule('featureNotes.bonusLanguages',
      'intelligence', '=', 'source - 14',
      'levels.Assassin', 'v', 'source >= 9 ? source - 8 : 0'
    );
    if(OldSchool.EDITION == 'OSRIC') {
      // Override level at which Rogue Skills is awarded
      rules.defineRule
        ('assassinFeatures.Rogue Skills', 'levels.Assassin', '=', '1');
      rules.defineRule
        ('rogueSkillLevel', 'levels.Assassin', '+=', 'Math.max(source - 2, 1)');
      // Unclear whether Assassins have same chance of failure as Thieves
      rules.defineRule
        ('magicNotes.readScrolls', 'intelligence', '=', 'source * 5 - 10');
   } else {
      rules.defineRule('rogueSkillLevel',
        'levels.Assassin', '+=', 'source > 2 ? source - 2 : null'
      );
   }

  } else if(name == 'Bard') {

    rules.defineRule('classBaseAttackAdjustment',
      'levels.Bard', '+=', 'source > 18 ? -1 : null'
    );
    rules.defineRule('classSaveAdjustment',
      'levels.Bard', '=', 'source >= 19 ? -2 : source >= 7 ? -1 : null'
    );
    rules.defineRule('languageCount',
      'levels.Bard', '+', 'source>17 ? source - 7 : source>3 ? source - 2 - Math.floor((source-3) / 3) : 1'
    );
    rules.defineRule("languages.Druids' Cant", 'levels.Bard', '=', '1');
    if(OldSchool.EDITION == 'Second Edition') {
      rules.defineRule
        ('featureNotes.legendLore', 'levels.Bard', '=', 'source * 5');
      rules.defineRule('featureNotes.charmingMusic.1',
        'levels.Bard', '=', 'Math.floor(source / 3)'
      );
      rules.defineRule
       ('magicNotes.poeticInspiration', 'levels.Bard', '=', null);
      rules.defineRule('rogueSkillLevel', 'levels.Bard', '=', null);
    } else {
      rules.defineRule('featureNotes.legendLore',
        'levels.Bard', '=', 'source==23 ? 99 : source > 6 ? source*5 - 15 : source > 2 ? source*3 - 2 : (source*5 - 5)'
      );
      rules.defineRule('magicNotes.charmingMusic',
        'levels.Bard', '=', '[0,15,20,22,24,30,32,34,40,42,44,50,53,56,60,63,66,70,73,76,80,84,88,95][source]'
      );
    }

  } else if(name == 'Cleric') {

    var t = OldSchool.EDITION == 'Second Edition' ? 'P' : 'C';

    rules.defineRule('classBaseAttackAdjustment',
      'levels.Cleric', '+=', 'source > 18 ? -1 : null'
    );
    rules.defineRule('classSaveAdjustment',
      'levels.Cleric', '=', 'source >= 19 ? -2 : source >= 7 ? -1 : null'
    );
    rules.defineRule('magicNotes.bonusClericSpells.1',
      'features.Bonus Cleric Spells', '?', null,
      'wisdom', '=', 'source<=12 ? 0 : source==13 ? 1 : source<=18 ? 2 : 3'
    );
    rules.defineRule('magicNotes.bonusClericSpells.2',
      'features.Bonus Cleric Spells', '?', null,
      'wisdom', '=', 'source <= 14 ? 0 : source == 15 ? 1 : 2'
    );
    rules.defineRule('magicNotes.bonusClericSpells.3',
      'features.Bonus Cleric Spells', '?', null,
      'wisdom', '=', 'source <= 16 ? 0 : 1'
    );
    rules.defineRule('magicNotes.bonusClericSpells.4',
      'features.Bonus Cleric Spells', '?', null,
      'wisdom', '=', 'source <= 17 ? 0 : 1'
    );
    if(OldSchool.EDITION == 'OSRIC') {
      rules.defineRule('magicNotes.clericSpellFailure',
        'wisdom', '=', 'Math.max((12 - source) * 5, 1)'
      );
    } else {
      rules.defineRule('magicNotes.clericSpellFailure',
        'wisdom', '=', '(13 - source) * 5'
      );
      rules.defineRule('spellSlots.'+t+'6', 'wisdom', '?', 'source > 16');
      rules.defineRule('spellSlots.'+t+'7', 'wisdom', '?', 'source > 17');
    }
    rules.defineRule('spellSlots.'+t+'1', 'bonusClericSpells.1', '+', null);
    rules.defineRule('spellSlots.'+t+'2', 'bonusClericSpells.2', '+', null);
    rules.defineRule('spellSlots.'+t+'3', 'bonusClericSpells.3', '+', null);
    rules.defineRule('spellSlots.'+t+'4', 'bonusClericSpells.4', '+', null);
    rules.defineRule('turningLevel', 'levels.Cleric', '+=', null);

  } else if(name == 'Druid') {

    rules.defineRule('classBaseAttackAdjustment',
      'levels.Druid', '+=', 'source > 18 ? -1 : null'
    );
    rules.defineRule('classSaveAdjustment',
      'levels.Druid', '=', 'source >= 19 ? -2 : source >= 7 ? -1 : null'
    );
    rules.defineRule('languageCount', 'levels.Druid', '+', '1');
    rules.defineRule("languages.Druids' Cant", 'levels.Druid', '=', '1');
    rules.defineRule('magicNotes.bonusDruidSpells.1',
      'features.Bonus Druid Spells', '?', null,
      'wisdom', '=', 'source<=12 ? 0 : source==13 ? 1 : source<=18 ? 2 : 3'
    );
    rules.defineRule('magicNotes.bonusDruidSpells.2',
      'features.Bonus Druid Spells', '?', null,
      'wisdom', '=', 'source <= 14 ? 0 : source == 15 ? 1 : 2'
    );
    rules.defineRule('magicNotes.bonusDruidSpells.3',
      'features.Bonus Druid Spells', '?', null,
      'wisdom', '=', 'source <= 16 ? 0 : 1'
    );
    rules.defineRule('magicNotes.bonusDruidSpells.4',
      'features.Bonus Druid Spells', '?', null,
      'wisdom', '=', 'source <= 17 ? 0 : 1'
    );
    rules.defineRule('skillNotes.woodlandLanguages',
      'levels.Druid', '=', 'source > 2 ? source - 2 : null'
    );
    if(OldSchool.EDITION != 'Second Edition') {
      rules.defineRule('spellSlots.D1', 'bonusDruidSpells.1', '+', null);
      rules.defineRule('spellSlots.D2', 'bonusDruidSpells.2', '+', null);
      rules.defineRule('spellSlots.D3', 'bonusDruidSpells.3', '+', null);
      rules.defineRule('spellSlots.D4', 'bonusDruidSpells.4', '+', null);
    }

  } else if(name == 'Fighter') {

    rules.defineRule('attacksPerRound',
      'levels.Fighter', '+', 'source < 7 ? null : source < 13 ? 0.5 : 1'
    );
    rules.defineRule('classBreathSaveAdjustment',
      'levels.Fighter', '=', 'source>=17 ? -2 : -Math.floor((source - 1) / 4)'
    );
    rules.defineRule('classSaveAdjustment',
      'levels.Fighter', '=', 'source >= 17 ? 1 : null'
    );
    rules.defineRule('warriorLevel', 'levels.Fighter', '+', null);

  } else if(name == 'Illusionist') {

    if(OldSchool.EDITION != 'OSRIC') {
      rules.defineRule('classBaseAttackAdjustment',
        'levels.Illusionist', '+=', 'source > 15 ? 2 : source > 10 ? 1 : null'
      );
    }

  } else if(name == 'Magic User') {

    if(OldSchool.EDITION != 'OSRIC') {
      rules.defineRule('classBaseAttackAdjustment',
        'levels.Magic User', '+=', 'source > 15 ? 2 : source > 10 ? 1 : null'
      );
    }
    if(OldSchool.EDITION == 'Second Edition') {
      rules.defineRule('maximumSpellsPerLevel',
        'levels.Magic User', '?', null,
        'intelligence', '=', 'source==9 ? 6 : source<13 ? 7 : source<15 ? 9 : source<17 ? 11 : source==17 ? 14 : source==18 ? 18 : "all"'
      );
      rules.defineRule('understandSpell',
        'levels.Magic User', '?', null,
        'intelligence', '=', 'source * 5 - 10'
      );
    } else {
      rules.defineRule('intelligenceRow',
        'intelligence', '=', 'source < 10 ? 0 : source < 13 ? 1 : source < 15 ? 2 : source < 17 ? 3 : (source - 13)'
      );
      rules.defineRule('maximumSpellsPerLevel',
        'levels.Magic User', '?', null,
        'intelligenceRow', '=', 'source * 2 + 5 + (source == 0 ? 1 : source < 4 ? 0 : source == 4 ? 1 : source == 5 ? 3 : 5)'
      );
      rules.defineRule('understandSpell',
        'levels.Magic User', '?', null,
        'intelligenceRow', '=', 'Math.min(35 + source * 10, 90)'
      );
    }
    rules.defineRule('magicNotes.craftMinorMagic.1', '', '=', '""');
    if(OldSchool.EDITION != 'Second Edition') {
      rules.defineRule('magicNotes.craftMinorMagic.1',
        'levels.Magic User', '=', 'source < 11 ? " with aid of an alchemist" : null'
      );
    }

  } else if(name == 'Monk') {

    rules.defineRule('armorClass',
      'levels.Monk', '=', '11 - source + Math.floor(source / 5)'
    );
    rules.defineRule('classBaseAttackAdjustment',
      'levels.Monk', '+=', 'source > 8 ? 1 : null'
    );
    rules.defineRule
      ('combatNotes.aware', 'levels.Monk', '=', '34 - source * 2');
    rules.defineRule
      ('combatNotes.dexterityArmorClassAdjustment', 'levels.Monk', '*', '0');
    rules.defineRule('combatNotes.flurryOfBlows',
      'levels.Monk', '=', 'source < 6 ? 1.25 : source < 9 ? 1.5 : source < 11 ? 2 : source < 14 ? 2.5 : source < 16 ? 3 : 4'
    );
    rules.defineRule
      ('combatNotes.killingBlow', 'levels.Monk', '=', 'source - 7');
    rules.defineRule
      ('combatNotes.preciseBlow', 'levels.Monk', '=', 'Math.floor(source / 2)');
    rules.defineRule('combatNotes.quiveringPalm', 'levels.Monk', '=', null);
    rules.defineRule
      ('combatNotes.strengthAttackAdjustment', 'levels.Monk', '*', '0');
    rules.defineRule
      ('combatNotes.strengthDamageAdjustment', 'levels.Monk', '*', '0');
    rules.defineRule('dexterityArmorClassAdjustment', 'levels.Monk', '*', '0');
    rules.defineRule
      ('featureNotes.feignDeath', 'levels.Monk', '=', 'source * 2');
    rules.defineRule
      ('magicNotes.wholenessOfBody', 'levels.Monk', '=', 'source - 6');
    rules.defineRule
      ('maximumHenchmen', 'levels.Monk', 'v', 'source < 6 ? 0 : source - 4');
    rules.defineRule
      ('saveNotes.clearMind', 'levels.Monk', '=', '95 - source * 5');
    rules.defineRule
      ('saveNotes.maskedMind', 'levels.Monk', '=', '38 - source * 2');
    rules.defineRule('saveNotes.slowFall.1',
      'levels.Monk', '=', 'source < 6 ? "20\'" : source < 13 ? "30\'" : "any distance"'
    );
    rules.defineRule('saveNotes.slowFall.2',
      'levels.Monk', '=', 'source < 6 ? 1 : source < 13 ? 4 : 8'
    );
    rules.defineRule('skills.Pick Pockets', 'levels.Monk', '*', '0');
    rules.defineRule
      ('speed', 'levels.Monk', '+', 'source * 10 + (source > 16 ? 30 : 20)');
    rules.defineRule('rogueSkillLevel', 'levels.Monk', '+=', null);
    rules.defineRule('skillModifier.Pick Pockets', 'levels.Monk', '*', '0');
    rules.defineRule('skillModifier.Read Languages', 'levels.Monk', '*', '0');
    rules.defineRule('skills.Pick Pockets', 'levels.Monk', '*', '0');
    rules.defineRule('skills.Read Languages', 'levels.Monk', '*', '0');
    rules.defineRule('weapons.Unarmed.2',
      'levels.Monk', '=', 'OldSchool.monkUnarmedDamage[source]'
    );

  } else if(name == 'Paladin') {

    if(OldSchool.EDITION == 'OSRIC') {
      rules.defineRule('attacksPerRound',
        'levels.Paladin', '+', 'source < 8 ? null : source < 15 ? 0.5 : 1'
      );
    } else {
      rules.defineRule('attacksPerRound',
        'levels.Paladin', '+', 'source < 7 ? null : source < 13 ? 0.5 : 1'
      );
    }
    rules.defineRule('classBreathSaveAdjustment',
      'levels.Paladin', '=', 'source>=17 ? -2 : -Math.floor((source - 1) / 4)'
    );
    rules.defineRule('classSaveAdjustment',
      'levels.Paladin', '=', 'source >= 17 ? 1 : null'
    );
    rules.defineRule('magicNotes.cureDisease',
      'levels.Paladin', '=', 'Math.floor(source / 5) + 1'
    );
    rules.defineRule
      ('magicNotes.layOnHands', 'levels.Paladin', '=', '2 * source');
    if(OldSchool.EDITION == 'Second Edition') {
      rules.defineRule('saveNotes.circleOfPower', 'levels.Paladin', '=', null);
    }
    rules.defineRule('turningLevel',
      'levels.Paladin', '+=', 'source > 2 ? source - 2 : null'
    );
    rules.defineRule('warriorLevel', 'levels.Paladin', '+', null);

  } else if(name == 'Ranger') {

    if(OldSchool.EDITION == 'Second Edition') {
      rules.defineRule('attacksPerRound',
        'levels.Ranger', '+', 'source < 7 ? null : source < 13 ? 0.5 : 1'
      );
      rules.defineRule('skillNotes.animalEmpathy',
        'levels.Ranger', '=', '-Math.floor((source + 2) / 3)'
      );
      rules.defineRule
        ('skillNotes.track', 'levels.Ranger', '=', 'Math.floor(source / 3)');
      rules.defineRule('skillNotes.rangerSkills.1',
        'levels.Ranger', '+=', 'source < 5 ? source * 5 + 5 : source < 9 ? source * 6 + 1 : source < 13 ? source * 7 - 7 : source < 15 ? source * 8 - 19 : 99'
      );
      rules.defineRule('skillNotes.rangerSkills.2',
        'levels.Ranger', '+=', 'source < 5 ? source * 6 + 9 : source < 7 ? source * 7 + 5 : source == 7 ? 55 : source == 8 ? 62 : source < 13 ? source * 8 - 2 : 99'
      );
    } else {
      rules.defineRule('attacksPerRound',
        'levels.Ranger', '+', 'source < 8 ? null : source < 15 ? 0.5 : 1'
      );
      rules.defineRule('combatNotes.favoredEnemy', 'levels.Ranger', '=', null);
    }
    rules.defineRule('classBreathSaveAdjustment',
      'levels.Ranger', '=', 'source>=17 ? -2 : -Math.floor((source - 1) / 4)'
    );
    rules.defineRule('classSaveAdjustment',
      'levels.Ranger', '=', 'source >= 17 ? 1 : null'
    );
    rules.defineRule('warriorLevel', 'levels.Ranger', '+', null);

  } else if(name == 'Thief') {

    rules.defineRule('classBaseAttackAdjustment',
      'levels.Thief', '+=', 'source > 8 ? 1 : null'
    );
    rules.defineRule('combatNotes.backstab',
      'levels.Thief', '+=', '2 + Math.floor((source - 1) / 4)'
    );
    rules.defineRule('languageCount', 'levels.Thief', '+', '1');
    rules.defineRule("languages.Thieves' Cant", 'levels.Thief', '=', '1');
    rules.defineRule('rogueSkillLevel', 'levels.Thief', '+=', null);
    if(OldSchool.EDITION == 'OSRIC')
      rules.defineRule
        ('magicNotes.readScrolls', 'intelligence', '=', 'source * 5 - 10');

  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
OldSchool.featureRules = function(rules, name, sections, notes) {
  SRD35.featureRules(rules, name, sections, notes);
  // No changes needed to the rules defined by SRD35 method
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
  SRD35.raceRules(
    rules, name, requires, features, selectables, languages, null, [], [], null
  );
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the abilities passed to raceRules.
 */
OldSchool.raceRulesExtra = function(rules, name) {

  if(name == 'Dwarf') {
    rules.defineRule('featureNotes.knowDepth', 'dwarfLevel', '+=', '50');
    rules.defineRule('featureNotes.senseSlope',
      'dwarfLevel', '+=', OldSchool.EDITION == 'Second Edition' ? '87' : '75'
    );
    if(OldSchool.EDITION != 'Second Edition')
      rules.defineRule('featureNotes.intelligenceLanguageBonus',
        'dwarfLevel', 'v', '2',
        '', '^', '0'
      );
  } else if(name == 'Elf') {
    rules.defineRule('saveNotes.resistCharm', 'elfLevel', '+=', '90');
    rules.defineRule('saveNotes.resistSleep', 'elfLevel', '+=', '90');
    if(OldSchool.EDITION != 'Second Edition')
      rules.defineRule('featureNotes.intelligenceLanguageBonus',
        'elfLevel', '+', '-4',
        '', '^', '0'
      );
  } else if(name == 'Gnome') {
    rules.defineRule('featureNotes.knowDepth',
      'gnomeLevel', '+=', OldSchool.EDITION == 'Second Edition' ? '50' : '60'
    );
    rules.defineRule('featureNotes.senseSlope',
      'gnomeLevel', '+=', OldSchool.EDITION == 'Second Edition' ? '87' : '80'
    );
    if(OldSchool.EDITION != 'Second Edition')
      rules.defineRule('featureNotes.intelligenceLanguageBonus',
        'gnomeLevel', 'v', '2',
        '', '^', '0'
      );
  } else if(name == 'Half-Elf') {
    rules.defineRule('saveNotes.resistCharm', 'half-ElfLevel', '+=', '30');
    rules.defineRule('saveNotes.resistSleep', 'half-ElfLevel', '+=', '30');
    if(OldSchool.EDITION == 'First Edition')
      rules.defineRule('featureNotes.intelligenceLanguageBonus',
        'half-ElfLevel', '+', '-5',
        '', '^', '0'
      );
  } else if(name == 'Half-Orc') {
    if(OldSchool.EDITION != 'Second Edition')
      rules.defineRule('featureNotes.intelligenceLanguageBonus',
        'half-OrcLevel', 'v', '2',
        '', '^', '0'
      );
  } else if(name == 'Halfling') {
    rules.defineRule('featureNotes.senseSlope', 'halflingLevel', '+=', '75');
    if(OldSchool.EDITION != 'Second Edition')
      rules.defineRule('featureNotes.intelligenceLanguageBonus',
        'halflingLevel', '+', '-5',
        '', '^', '0'
      );
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
    if(!(ability in OldSchool.ABILITIES)) {
      console.log('Bad ability "' + ability + '" for skill ' + name);
      return;
    }
  }
  if(!Array.isArray(classes)) {
    console.log('Bad classes list "' + classes + '" for skill ' + name);
    return;
  }

  rules.defineRule('skillModifier.' + name, 'skills.' + name, '=', null);
  rules.defineChoice('notes', 'skillNotes.dexteritySkillModifiers:%1 Find Traps/%2 Hide In Shadows/%3 Move Silently/%4 Open Locks/%5 Pick Pockets');
  if(OldSchool.EDITION == 'OSRIC') {
    rules.defineRule('skillNotes.dexteritySkillModifiers.1',
      'skills.Find Traps', '?', '1',
      'dexterity', '=', 'QuilvynUtils.signed(5*(source<12 ? source-12 : source>16 ? source-16 : 0))'
    );
    rules.defineRule('skillNotes.dexteritySkillModifiers.5',
      'skills.Pick Pockets', '?', '1',
      'dexterity', '=', 'QuilvynUtils.signed(5*(source<12 ? source-12 : source>17 ? 2*(source-18)+1 : 0))'
    );
  } else {
    rules.defineRule('skillNotes.dexteritySkillModifiers.1',
      'skills.Find Traps', '?', '1',
      'dexterity', '=', 'QuilvynUtils.signed(5*(source<11 ? -2 : source==11 ? -1 : source>17 ? source-17 : 0))'
    );
    rules.defineRule('skillNotes.dexteritySkillModifiers.5',
      'skills.Pick Pockets', '?', '1',
      'dexterity', '=', 'QuilvynUtils.signed(5*(source<12 ? source-12 : source>16 ? source-16 : 0))'
    );
  }
  rules.defineRule('skillNotes.dexteritySkillModifiers.2',
    'skills.Hide In Shadows', '?', '1',
    'dexterity', '=', 'QuilvynUtils.signed(5*(source<11 ? source-11 : source>16 ? source-16 : 0))'
  );
  rules.defineRule('skillNotes.dexteritySkillModifiers.3',
    'skills.Climb Walls', '?', '1',
    'dexterity', '=', 'QuilvynUtils.signed(5*(source<13 ? source-13 : source>16 ? source-16 : 0))'
  );
  rules.defineRule('skillNotes.dexteritySkillModifiers.4',
    'skills.Open Locks', '?', '1',
    'dexterity', '=', 'QuilvynUtils.signed(5*(source<11 ? source-11 : source>15 ? source-15 : 0))'
  );
  rules.defineRule('skillNotes.dexteritySkillModifiers',
    'rogueSkillLevel', '?', null,
    'dexterity', '=', 'source < 13 || source > 15 ? 1 : null'
  );
  rules.defineRule('skillModifier.Find Traps',
    'skillNotes.dexteritySkillModifiers.1', '+', null
  );
  rules.defineRule('skillModifier.Hide In Shadows',
    'skillNotes.dexteritySkillModifiers.2', '+', null
  );
  rules.defineRule('skillModifier.Move Silently',
    'skillNotes.dexteritySkillModifiers.3', '+', null
  );
  rules.defineRule('skillModifier.Open Locks',
    'skillNotes.dexteritySkillModifiers.4', '+', null
  );
  rules.defineRule('skillModifier.Pick Pockets',
    'skillNotes.dexteritySkillModifiers.5', '+', null
  );
  // No-op to get Dexterity Skill Modifiers note to appear in italics
  rules.defineRule('skillNotes.dexteritySkillModifiers.1',
    'skillNotes.dexteritySkillModifiers', '+', 'null'
  );
  rules.defineChoice('notes', 'skills.' + name + ':%V (%1)');
  rules.defineRule('skills.' + name + '.1', 'skillModifier.' + name, '=', null);

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
  SRD35.spellRules(rules, name, school, casterGroup, level, description, false);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which belongs to
 * weapon category #category# (one of '1h', '2h', 'Li', 'R', 'Un' or their
 * spelled-out equivalents). The weapon does #damage# HP on a successful attack.
 * If specified, the weapon can be used as a ranged weapon with a range
 * increment of #range# feet.
 */
OldSchool.weaponRules = function(rules, name, category, damage, range) {
  SRD35.weaponRules(rules, name, 0, category, damage, 20, 2, range);
  delete rules.getChoices('notes')['weapons.' + name];
  rules.defineChoice
    ('notes', 'weapons.' + name + ':%V (%1 %2%3' + (range ? ' R%5\')' : ')'));
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

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
OldSchool.choiceEditorElements = function(rules, type) {
  var result = [];
  if(type == 'Armor' || type == 'Shield')
    result.push(
      ['AC', 'AC Bonus', 'select-one', [0, 1, 2, 3, 4, 5]],
      ['Move', 'Max Movement', 'select-one', [60, 90, 120]]
    );
  else if(type == 'Class')
    result.push(
      ['Require', 'Prerequisites', 'text', [40]],
      ['HitDie', 'Hit Die', 'select-one', ['d4', 'd6', 'd8', 'd10', 'd12']],
      ['Attack', 'Base Attack', 'text', [20]],
      ['WeaponProficiency', 'Weapon Proficiency', 'text', [20]],
      ['Breath', 'Breath Save', 'text', [20]],
      ['Death', 'Death Save', 'text', [20]],
      ['Petrification', 'Petrification Save', 'text', [20]],
      ['Spell', 'Spell Save', 'text', [20]],
      ['Wand', 'Wand Save', 'text', [20]],
      ['Features', 'Features', 'text', [40]],
      ['Languages', 'Languages', 'text', [30]],
      ['CasterLevelArcane', 'Arcane Level', 'text', [10]],
      ['CasterLevelDivine', 'Divine Level', 'text', [10]],
      ['SpellAbility', 'Spell Ability', 'select-one', ['charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom']],
      ['SpellSlots', 'Spell Slots', 'text', [40]],
      ['Spells', 'Spells', 'text', [40]]
    );
  else if(type == 'Weapon') {
    var zeroToOneFifty =
     [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    result.push(
      ['Category', 'Category', 'select-one',
       ['Unarmed', 'Light', 'One-Handed', 'Two-Handed', 'Ranged']],
      ['Damage', 'Damage', 'select-one',
       QuilvynUtils.getKeys(SRD35.LARGE_DAMAGE)],
      ['Range', 'Range in Feet', 'select-one', zeroToOneFifty]
    );
  } else
    result = SRD35.choiceEditorElements(rules, type);
  return result;
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
OldSchool.randomizeOneAttribute = function(attributes, attribute) {
  var attr;
  var attrs;
  var choices;
  var matchInfo;
  if(attribute == 'armor') {
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in this.getChoices('armors')) {
      if(attr == 'None' ||
         attrs['features.Armor Proficiency (All)'] != null ||
         attrs['features.Armor Proficiency (' + attr + ')'] != null) {
        choices[choices.length] = attr;
      }
    }
    attributes.armor = choices.length == 0 ? 'None' :
      choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'proficiencies') {
    attrs = this.applyRules(attributes);
    choices = [];
    var howMany = attrs.weaponProficiencyCount;
    for(attr in this.getChoices('weapons')) {
      if(attrs['weaponProficiency.' + attr] != null) {
        howMany--;
      } else {
        choices[choices.length] = attr;
      }
    }
    for( ; howMany > 0; howMany--) {
      var which = QuilvynUtils.random(0, choices.length - 1);
      attributes['weaponProficiency.' + choices[which]] = 1;
      choices = choices.slice(0, which).concat(choices.slice(which + 1));
    }
  } else if(attribute == 'hitPoints') {
    // Differs from 3.5 in that per-class level is computed, not chosen, and
    // characters don't automatically get full HP at level 1.
    attributes.hitPoints = 0;
    attrs = this.applyRules(attributes);
    for(var clas in this.getChoices('levels')) {
      if((attr = attrs['levels.' + clas]) == null)
        continue;
      matchInfo = QuilvynUtils.getAttrValue(this.getChoices('levels')[clas], 'HitDie').match(/^((\d+)?d)?(\d+)$/);
      var number = matchInfo == null || matchInfo[2] == null ||
                   matchInfo[2] == '' ? 1 : (matchInfo[2] * 1);
      var sides = matchInfo == null ? 6 : (matchInfo[3] * 1);
      while(attr-- > 0)
        attributes.hitPoints += QuilvynUtils.random(number, number * sides);
      // Monks and 1E/OSRIC Rangers get an extra die at 1st level
      if(clas == 'Monk' || (clas == 'Ranger' && sides == 8))
        attributes.hitPoints += QuilvynUtils.random(number, number * sides);
    }
  } else if(attribute == 'levels') {
    var classes = this.getChoices('levels');
    var classAttrSet = false;
    for(attr in classes) {
      if('levels.' + attr in attributes)
        classAttrSet = true;
    }
    if(!classAttrSet) {
      // Add a random class of level 1..4
      attributes['levels.' + QuilvynUtils.randomKey(classes)] =
        QuilvynUtils.random(1, 4);
    }
    for(attr in classes) {
      if(!('levels.' + attr in attributes))
        continue;
      // Calculate experience needed for this and prior levels to assign a
      // random experience value that will yield this level.
      attrs = this.applyRules(attributes);
      var max = attrs['experiencePoints.' + attr + '.1'] - 1;
      attributes['levels.' + attr]--;
      attrs = this.applyRules(attributes);
      var min = attrs['experiencePoints.' + attr + '.1'];
      delete attributes['levels.' + attr];
      attributes['experiencePoints.' + attr] = QuilvynUtils.random(min, max);
    }
  } else if(attribute == 'shield') {
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in this.getChoices('shields')) {
      if(attr == 'None' ||
         attrs['features.Shield Proficiency (All)'] != null ||
         attrs['features.Shield Proficiency (' + attr + ')'] != null) {
        choices[choices.length] = attr;
      }
    }
    attributes.shield = choices.length == 0 ? 'None' :
      choices[QuilvynUtils.random(0, choices.length - 1)];
  } else if(attribute == 'weapons') {
    var howMany = 3;
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in this.getChoices('weapons')) {
      if(attrs['weapons.' + attr] != null) {
        howMany--;
      } else if(attrs['weaponProficiency.' + attr] != null) {
        choices[choices.length] = attr;
      }
    }
    if(howMany > choices.length)
      howMany = choices.length;
    for(var i = 0; i < howMany; i++) {
      var index = QuilvynUtils.random(0, choices.length - 1);
      attributes['weapons.' + choices[index]] = 1;
      choices.splice(index, 1);
    }
  } else {
    SRD35.randomizeOneAttribute.apply(this, [attributes, attribute]);
  }
};

/* Returns an array of plugins upon which this one depends. */
OldSchool.getPlugins = function() {
  return [SRD35];
};

/* Returns HTML body content for user notes associated with this rule set. */
OldSchool.ruleNotes = function() {
  return '' +
    '<h2>OldSchool Quilvyn Module Notes</h2>\n' +
    'OldSchool Quilvyn Module Version ' + OldSchool_VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    The OSRIC rules discuss illusionist scrolls, but does not give\n' +
    '    the minimum level required to create them. Quilvyn uses the 1E PHB\n' +
    '    limit of level 10.\n' +
    '  </li><li>\n' +
    '    Quilvyn generally uses the OSRIC names and effects for spells,\n' +
    '    rather than those found in the 1E PHB.\n' +
    '  </li><li>\n' +
    '    The 1E DMG and OSRIC rules mention that Magic Users of levels 7\n' +
    '    through 10 can create scrolls and potions only with the aid of an\n' +
    '    alchemist; at level 11 they can do such crafting unaided. The 1E\n' +
    '    DMG also mentions that higher-level Clerics and Druids can create\n' +
    '    potions and scrolls of their own spells.\n' +
    '  </li><li>\n' +
    '    The OSRIC rules are unclear as to whether or not the Fighting the\n' +
    '    Unskilled feature applies to Paladins and Rangers. Quilvyn assumes\n' +
    '    that it does.\n' +
    '  </li><li>\n' +
    '    2E spell ranges are generally given in yards rather than feet, so,\n' +
    '    for example, "R10\'" in the W1 Grease spell should be read as 10\n' +
    '    yards for 2E characters.\n' +
    '  </li><li>\n' +
    '    The 2E spell Spiritual Hammer is modified to Spiritual Weapon to\n' +
    '    match the 1E spell.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn does not note racial restrictions on class and level.\n' +
    '  </li><li>\n' +
    '    Quilvyn does not note class restrictions on weapon choice.\n' +
    '  </li><li>\n' +
    '    Quilvyn does not note the First Edition prohibition on Neutral\n' +
    '    clerics.\n' +
    '  </li><li>\n' +
    '    Quilvyn does not note the First Edition lower strength maximum\n' +
    '    for female characters.\n' +
    '  </li><li>\n' +
    '    Quilvyn assumes that Halfling characters are of pure Stoutish\n' +
    '    for the Direction Sense, Infravision, and Sense Slope features.\n' +
    '  </li><li>\n' +
    '    Fractional percentages for First Edition Thief skills are not\n' +
    '    reported.\n' +
    '  </li><li>\n' +
    '    Minimum levels for building strongholds and attracting followers\n' +
    '    are not reported.\n' +
    '  </li><li>\n' +
    '    In Second Edition, Quilvyn does not consider sphere limitations\n' +
    '    to priest spell sections.\n' +
    '  </li><li>\n' +
    '    Quilvyn does not note Halfling characters with a strength of 18,\n' +
    '    nor (OSRIC rules) Elf characters with a constitution of 18.\n' +
    '  </li><li>\n' +
    '    Quilvyn does not report the chance of extraordinary success on\n' +
    '    strength tests for characters with strength 18/91 and higher.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<ul>\n' +
    '</ul>\n' +
    '</p>\n';
};
