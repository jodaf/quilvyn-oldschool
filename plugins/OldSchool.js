/*
Copyright 2024, James J. Hayes

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
/* globals OSPsionics, OSRIC, Quilvyn, QuilvynRules, QuilvynUtils, UnearthedArcana1e */
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

  edition =
    (edition + '').includes('1E') ? 'First Edition' :
    (edition + '').includes('2E') ? 'Second Edition' : 'First Edition';

  let rules = new QuilvynRules(edition, OldSchool.VERSION);
  rules.plugin = OSRIC;
  OSRIC.rules = rules;
  rules.edition = edition;

  rules.defineChoice('choices', OldSchool.CHOICES);
  rules.choiceEditorElements = OSRIC.choiceEditorElements;
  rules.choiceRules = OldSchool.choiceRules;
  rules.removeChoice = OSRIC.removeChoice;
  rules.editorElements = OldSchool.initialEditorElements(edition);
  rules.getFormats = OSRIC.getFormats;
  rules.getPlugins = OldSchool.getPlugins;
  rules.makeValid = OSRIC.makeValid;
  rules.randomizeOneAttribute = OldSchool.randomizeOneAttribute;
  rules.defineChoice('random', OldSchool.RANDOMIZABLE_ATTRIBUTES);
  rules.getChoices = OSRIC.getChoices;
  rules.ruleNotes = OldSchool.ruleNotes;

  OSRIC.createViewers(rules, OSRIC.VIEWERS);
  rules.defineChoice('extras', 'feats', 'sanityNotes', 'validationNotes');
  rules.defineChoice
    ('preset', 'race:Race,select-one,races','levels:Class Levels,bag,levels');

  OldSchool.abilityRules(rules);
  if(window.UnearthedArcana1e != null && edition == 'First Edition')
    UnearthedArcana1e.abilityRules(rules);
  OldSchool.combatRules
    (rules, OldSchool.editedRules(edition, OldSchool.ARMORS, 'Armor'),
     OldSchool.editedRules(edition, OldSchool.SHIELDS, 'Shield'),
     OldSchool.editedRules(edition, OldSchool.WEAPONS, 'Weapon'));
  OldSchool.magicRules
    (rules, OldSchool.editedRules(edition, OldSchool.SCHOOLS, 'School'),
     OldSchool.editedRules(edition, OldSchool.SPELLS, 'Spell'));
  if(window.OSPsionics != null)
    OSPsionics.psionicsRules(rules, edition == 'First Edition');
  OldSchool.talentRules
    (rules, OldSchool.editedRules(edition, OldSchool.FEATURES, 'Feature'),
     OldSchool.editedRules(edition, OldSchool.GOODIES, 'Goody'),
     OldSchool.editedRules(edition, OldSchool.LANGUAGES, 'Language'),
     OldSchool.editedRules(edition, OldSchool.SKILLS, 'Skill'));
  OldSchool.identityRules(
    rules, OldSchool.editedRules(edition, OldSchool.ALIGNMENTS, 'Alignment'),
    OldSchool.editedRules(edition, OldSchool.CLASSES, 'Class'),
    OldSchool.editedRules(edition, OldSchool.RACES, 'Race'));

  Quilvyn.addRuleSet(rules);

}

OldSchool.VERSION = '2.4.1.0';

/* List of choices that can be expanded by house rules. */
OldSchool.CHOICES = OSRIC.CHOICES;

/*
 * List of items handled by randomizeOneAttribute method. The order handles
 * dependencies among attributes when generating random characters.
 */
OldSchool.RANDOMIZABLE_ATTRIBUTES = OSRIC.RANDOMIZABLE_ATTRIBUTES;

OldSchool.ABILITIES = OSRIC.ABILITIES;
OldSchool.ALIGNMENTS = OSRIC.ALIGNMENTS;
OldSchool.ARMORS = {
  'None':
    'AC=0 Move=120 Weight=0 ' +
    'Skill="+10% Climb Walls/+5% Hide In Shadows/+10% Move Silently/+5% Pick Pockets"',
  'Banded Mail':'AC=-6 Move=90 Weight=35',
  'Chain Mail':
    'AC=-5 Move=90 Weight=30 ' +
    'Skill="-25% Climb Walls/-10% Find Traps/-10% Hear Noise/-15% Hide In Shadows/-15% Move Silently/-10% Open Locks/-25% Pick Pockets"',
  'Elven Chain Mail':
    'AC=-5 Move=120 Weight=15 ' +
    'Skill="-20% Climb Walls/-5% Find Traps/-5% Hear Noise/-10% Hide In Shadows/-10% Move Silently/-5% Open Locks/-20% Pick Pockets"',
  'Leather':'AC=-2 Move=120 Weight=15',
  'Padded':
    'AC=-2 Move=90 Weight=10 ' +
    'Skill="-30% Climb Walls/-10% Find Traps/-10% Hear Noise/-20% Hide In Shadows/-20% Move Silently/-10% Open Locks/-30% Pick Pockets"',
  'Plate Mail':'AC=-7 Move=60 Weight=45',
  'Ring Mail':'AC=-3 Move=90 Weight=25',
  'Scale Mail':'AC=-4 Move=60 Weight=40',
  'Splint Mail':'AC=-6 Move=60 Weight=40',
  'Studded Leather':
    'AC=-3 Move=90 Weight=20 ' +
    'Skill="-30% Climb Walls/-10% Find Traps/-10% Hear Noise/-20% Hide In Shadows/-20% Move Silently/-10% Open Locks/-30% Pick Pockets"'
};
OldSchool.CLASSES = {
  'Assassin':
    'Require=' +
      '"alignment =~ \'Evil\'","constitution >= 6","dexterity >= 12",' +
      '"intelligence >= 11","strength >= 12" ' +
    'HitDie=d6,15,1 THAC10="11 9@5 6@9 4@13 4@15" ' +
    'WeaponProficiency="3 4@5 ...6@13" NonproficientPenalty=-2 ' +
    'Breath="16 15@5 ...13@15" ' +
    'Death="13 12@5 ...10@15" ' +
    'Petrification="12 11@5 ...9@15" ' +
    'Spell="15 13@5 ...9@15" ' +
    'Wand="14 12@5 ...8@15" '+
    'Features=' +
      '"1:Armor Proficiency (Leather/Studded Leather)",' +
      '"1:Shield Proficiency (All)",' +
      '1:Assassination,1:Backstab,"1:Delayed Henchmen",1:Disguise,' +
      '"1:Poison Use","3:Thief Skills","4:Limited Henchmen Classes",' +
      '"intelligence >= 15 ? 9:Bonus Languages",' +
      '"12:Read Scrolls" ' +
    'Experience=' +
      '"0 1501 3001 6001 12001 25001 50001 100001 200001 300001 425001' +
      ' 575001 750001 1000001 1500001"',
  'Bard':
    'Require=' +
      '"alignment =~ \'Neutral\'","charisma >= 15","constitution >= 10",' +
      '"dexterity >= 15","intelligence >= 12","strength >= 15",' +
      '"wisdom >= 15","levels.Fighter >= 5","levels.Thief >= 5",' +
      '"race =~ \'Human|Half-Elf\'" ' +
    // "A bard always engages in combat at the level he or she attained as a
    // fighter." (PHB 118) So, no improvement to THAC10.
    'HitDie=d6,10,1 THAC10="20 20 ...20@23" ' +
    // Can't first Bard weapon proficiencies in the PHB; used UA values
    'WeaponProficiency="5 6@5 ...10@21" NonproficientPenalty=-2 ' +
    'Breath="16 15@4 13@7 12@10 11@13 10@16 8@19" ' +
    'Death="10 9@4 7@7 6@10 5@13 4@16 2@19" ' +
    'Petrification="13 12@4 10@7 9@10 8@13 7@16 5@19" ' +
    'Spell="15 14@4 12@7 11@10 10@13 9@16 7@19" ' +
    'Wand="14 13@4 11@7 10@10 9@13 8@16 6@19" '+
    'Features=' +
      '"1:Armor Proficiency (Leather)",' +
      '"wisdom >= 13 ? 1:Bonus Spells",' +
      '"1:Charming Music","1:Defensive Song","1:Druids\' Cant",' +
      '"1:Poetic Inspiration","1:Resist Fire","1:Resist Lightning",' +
      '"2:Legend Lore","3:Druid\'s Knowledge","3:Wilderness Movement",' +
      '"3:Woodland Languages","4:Additional Languages",' +
      '"7:Immunity To Fey Charm",7:Shapeshift ' +
    'Experience=' +
      '"0 2001 4001 8001 16001 25001 40001 60001 85001 110001 150001 200001' +
      ' 400001 600001 800001 1000001 1200001 1400001 1600001 1800001 2000001' +
      ' 2200001 3000001" ' +
    'SpellSlots=' +
      '"D1:1@1 2@2 3@3 4@16 5@19",' +
      '"D2:1@4 2@5 3@6 4@17 5@21",' +
      '"D3:1@7 2@8 3@9 4@18 5@22",' +
      '"D4:1@10 2@11 3@12 4@19 5@23",' +
      '"D5:1@13 2@14 3@15 4@20 5@23"',
  'Cleric':
    'Require=' +
      '"wisdom >= 9" ' +
    'HitDie=d8,9,2 THAC10="10 8@4 ...-1@19" ' +
    'WeaponProficiency="2 3@5 ...9@29" NonproficientPenalty=-3 ' +
    'Breath="16 15@4 13@7 12@10 11@13 10@16 8@19" ' +
    'Death="10 9@4 7@7 6@10 5@13 4@16 2@19" ' +
    'Petrification="13 12@4 10@7 9@10 8@13 7@16 5@19" ' +
    'Spell="15 14@4 12@7 11@10 10@13 9@16 7@19" ' +
    'Wand="14 13@4 11@7 10@10 9@13 8@16 6@19" '+
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"1:Turn Undead",' +
      '"wisdom >= 16 ? 1:Bonus Cleric Experience",' +
      '"wisdom >= 13 ? 1:Bonus Spells",' +
      '"wisdom <= 12 ? 1:Cleric Spell Failure" ' +
    'Experience=' +
      '"0 1501 3001 6001 13001 27501 55001 110001 225001 450001 675001 900001' +
      ' 1125001 1350001 1575001 1800001 2025001 2250001 2475001 2700001' +
      ' 2925001 3150001 3375001 3600001 3825001 4050001 4275001 4500001' +
      ' 4725000" ' +
    'SpellSlots=' +
      '"C1:1=1;2=2;4=3;9=4;11=5;12=6;15=7;17=8;19=9",' +
      '"C2:3=1;4=2;5=3;9=4;12=5;13=6;15=7;17=8;19=9",' +
      '"C3:5=1;6=2;8=3;11=4;12=5;13=6;15=7;17=8;19=9",' +
      '"C4:7=1;8=2;10=3;13=4;14=5;16=6;18=7;20=8;21=9",' +
      '"C5:9=1;10=2;14=3;15=4;16=5;18=6;20=7;21=8;22=9",' +
      '"C6:11=1;12=2;16=3;18=4;20=5;21=6;23=7;24=8;26=9",' +
      '"C7:16=1;19=2;22=3;25=4;27=5;28=6;29=7"',
  'Druid':
    'Require=' +
      '"alignment =~ \'Neutral\'","charisma >= 15","wisdom >= 12" ' +
    'HitDie=d8,14,1 THAC10="10 8@4 ...-1@19" ' +
    'WeaponProficiency="2 3@6 4@11" NonproficientPenalty=-4 ' +
    'Breath="16 15@4 13@7 12@10 11@13 10@16 8@19" ' +
    'Death="10 9@4 7@7 6@10 5@13 4@16 2@19" ' +
    'Petrification="13 12@4 10@7 9@10 8@13 7@16 5@19" ' +
    'Spell="15 14@4 12@7 11@10 10@13 9@16 7@19" ' +
    'Wand="14 13@4 11@7 10@10 9@13 8@16 6@19" '+
    'Features=' +
      '"1:Armor Proficiency (Leather)","1:Shield Proficiency (All)",' +
      '"charisma >= 16/wisdom >= 16 ? 1:Bonus Druid Experience",' +
      '"wisdom >= 13 ? 1:Bonus Spells",' +
      '"1:Druids\' Cant","1:Resist Fire","1:Resist Lightning",' +
      '"3:Druid\'s Knowledge","3:Wilderness Movement","3:Woodland Languages",' +
      '"7:Immunity To Fey Charm",7:Shapeshift ' +
    'Experience=' +
      '"0 2001 4001 7501 12501 20001 35001 60001 90001 125001 200001 300001' +
      ' 750001 1500001" ' +
    'SpellSlots=' +
      '"D1:2@1 3@3 4@4 5@9 6@13",' +
      '"D2:1@2 2@3 3@5 4@7 5@11 6@14",' +
      '"D3:1@3 2@4 3@7 4@12 5@13 6@14",' +
      '"D4:1@6 2@8 3@10 4@12 5@13 6@14",' +
      '"D5:1@9 2@10 3@12 4@13 5@14",' +
      '"D6:1@11 2@12 3@13 4@14",' +
      '"D7:1@12 2@13 3@14"',
  'Fighter':
    'Require="constitution >= 7","strength >= 9" ' +
    'HitDie=d10,9,3 THAC10="10 8@3 ...-6@17" ' +
    'WeaponProficiency="4 5@4 ...13@28" NonproficientPenalty=-2 ' +
    'Breath="17 16@3 13@5 12@7 9@9 8@11 5@13 4@15" ' +
    'Death="14 13@3 11@5 10@7 8@9 7@11 5@13 4@15 3@17" ' +
    'Petrification="15 14@3 12@5 11@7 9@9 8@11 6@13 5@15 4@17" ' +
    'Spell="17 16@3 14@5 13@7 11@9 10@11 8@13 7@15 6@17" ' +
    'Wand="16 15@3 13@5 12@7 10@9 9@11 7@13 6@15 5@17" ' +
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"strength >= 16 ? 1:Bonus Fighter Experience",' +
      '"1:Fighting The Unskilled","7:Bonus Attacks" ' +
    'Experience=' +
      '"0 2001 4001 8001 18001 25001 70001 125001 250001 500001 750001' +
      ' 1000001 1250001 1500001 1750001 2000001 2250001 2500001 2750001' +
      ' 3000001 3250001 3500001 3750001 4000001 4250001 4500001 475001' +
      ' 5000001 5250001"',
  'Illusionist':
    'Require="dexterity >= 16","intelligence >= 15" ' +
    'HitDie=d4,10,1 THAC10="11 9@6 6@11 3@16 1@21" ' +
    'WeaponProficiency="1 2@7 ...5@25" NonproficientPenalty=-5 ' +
    'Breath="15 13@6 ...7@21" ' +
    'Death="14 13@6 11@11 10@16 8@21" ' +
    'Petrification="13 11@6 ...5@21" ' +
    'Spell="12 10@6 ...4@21" ' +
    'Wand="11 9@6 ...3@21" '+
    'Features=' +
      '"1:Spell Book","10:Eldritch Craft" ' +
    'Experience=' +
      '"0 2251 4501 9001 18001 35001 60001 95001 145001 220001 440001 660001' +
      ' 880001 1100001 1320001 1540001 1760001 1980001 2200001 2420001' +
      ' 2640001 2860001 3080001 3300001 3520001 3740001 3960001 4180001' +
      ' 4400001" ' +
    'SpellSlots=' +
      '"I1:1@1 2@2 3@4 4@5 5@9 6@24 7@26",' +
      '"I2:1@3 2@4 3@6 4@10 5@12 6@24 7@26",' +
      '"I3:1@5 2@7 3@9 4@12 5@16 6@24 7@26",' +
      '"I4:1@8 2@9 3@11 4@15 5@17 6@24 7@26",' +
      '"I5:1@10 2@11 3@16 4@19 5@21 6@25",' +
      '"I6:1@12 2@13 3@18 4@21 5@22 6@25",' +
      '"I7:1@14 2@15 3@20 4@22 5@23 6@25"',
  'Magic User':
    'Require="dexterity >= 6","intelligence >= 9" ' +
    'HitDie=d4,11,1 THAC10="11 9@6 6@11 3@16 1@21" ' +
    'WeaponProficiency="1 2@7 ...5@25" NonproficientPenalty=-5 ' +
    'Breath="15 13@6 ...7@21" ' +
    'Death="14 13@6 11@11 10@16 8@21" ' +
    'Petrification="13 11@6 ...5@21" ' +
    'Spell="12 10@6 ...4@21" ' +
    'Wand="11 9@6 ...3@21" '+
    'Features=' +
      '"intelligence >= 16 ? 1:Bonus Magic User Experience",' +
      '"1:Spell Book","7:Eldritch Craft" ' +
    'Experience=' +
      '"0 2501 5001 10001 22501 40001 60001 90001 135001 250001 375001 750001' +
      ' 1125001 1500001 1875001 2250001 2625001 3000001 3375001 3750001' +
      ' 4125001 4500001 4875001 4250001 4625001 5000001 5375001 5750001' +
      ' 6125001" ' +
    'SpellSlots=' +
      '"M1:1@1 2@2 3@4 4@5 5@13 6@26 7@29",' +
      '"M2:1@3 2@4 3@7 4@10 5@13 6@26 7@29",' +
      '"M3:1@5 2@6 3@8 4@11 5@13 6@26 7@29",' +
      '"M4:1@7 2@8 3@11 4@12 5@15 6@26 7@29",' +
      '"M5:1@9 2@10 3@11 4@12 5@15 6@27",' +
      '"M6:1@12 2@13 3@16 4@20 5@22 6@27",' +
      '"M7:1@14 2@16 3@17 4@21 5@23 6@27",' +
      '"M8:1@16 2@17 3@19 4@21 5@23 6@28",' +
      '"M9:1@18 2@20 3@22 4@24 5@25 6@28"',
  'Monk':
    'Require=' +
      '"alignment =~ \'Lawful\'","constitution >= 11","dexterity >= 15",' +
      '"strength >= 15","wisdom >= 15" ' +
    'HitDie=2d4,18,1 THAC10="10 8@4 ...-1@19" ' +
    'WeaponProficiency="1 2@3 ... 9@17" NonproficientPenalty=-3 ' +
    'Breath="16 15@5 ...11@21" ' +
    'Death="13 12@5 ...8@21" ' +
    'Petrification="12 11@5 ...7@21" ' +
    'Spell="15 13@5 ...5@21" ' +
    'Wand="14 12@5 ...4@21" ' +
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
      '"0 2251 4751 10001 22501 47501 98001 200001 350001 500001 700001' +
      ' 950001 1250001 1750001 2250001 2750001 3250001"',
  'Paladin':
    'Require=' +
      '"alignment == \'Lawful Good\'","charisma >= 17","constitution >= 9",' +
      '"intelligence >= 9","strength >= 12","wisdom >= 13" ' +
    'HitDie=d10,9,3 THAC10="10 8@3 ...-6@17" ' +
    'WeaponProficiency="3 4@4 ...12@28" NonproficientPenalty=-2 ' +
    'Breath="17 16@3 13@5 12@7 9@9 8@11 5@13 4@15" ' +
    'Death="14 13@3 11@5 10@7 8@9 7@11 5@13 4@15 3@17" ' +
    'Petrification="15 14@3 12@5 11@7 9@9 8@11 6@13 5@15 4@17" ' +
    'Spell="17 16@3 14@5 13@7 11@9 10@11 8@13 7@15 6@17" ' +
    'Wand="16 15@3 13@5 12@7 10@9 9@11 7@13 6@15 5@17" ' +
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"strength >= 16/wisdom >= 16 ? 1:Bonus Paladin Experience",' +
      '"1:Cure Disease","1:Detect Evil",1:Discriminating,"1:Divine Health",' +
      '"1:Divine Protection","1:Fighting The Unskilled","1:Lay On Hands",' +
      '1:Non-Materialist,1:Philanthropist,"1:Protection From Evil",' +
      '"3:Turn Undead","4:Summon Warhorse","7:Bonus Attacks" ' +
    'Experience=' +
      '"0 2751 5501 12001 24001 45001 95001 175001 350001 700001 1050001' +
      ' 1400001 1750001 2100001 2450001 2800001 3150001 3500001 3850001' +
      ' 4200001 4550001 4900001 5250001 5600001 5950001 6300001 6650001' +
      ' 7000001 7350001" ' +
    'SpellSlots=' +
      '"C1:1@9 2@10 3@14 4@21",' +
      '"C2:1@11 2@12 3@16 4@22",' +
      '"C3:1@13 2@17 3@18 4@23",' +
      '"C4:1@15 2@19 3@20 4@24"',
  'Ranger':
    'Require=' +
      '"alignment =~ \'Good\'","constitution >= 14","dexterity >= 6",' +
      '"intelligence >= 13","strength >= 13","wisdom >= 14" ' +
    'HitDie=2d8,10,2 THAC10="10 8@3 ...-6@17" ' +
    'WeaponProficiency="3 4@4 ...12@28" NonproficientPenalty=-2 ' +
    'Breath="17 16@3 13@5 12@7 9@9 8@11 5@13 4@15" ' +
    'Death="14 13@3 11@5 10@7 8@9 7@11 5@13 4@15 3@17" ' +
    'Petrification="15 14@3 12@5 11@7 9@9 8@11 6@13 5@15 4@17" ' +
    'Spell="17 16@3 14@5 13@7 11@9 10@11 8@13 7@15 6@17" ' +
    'Wand="16 15@3 13@5 12@7 10@9 9@11 7@13 6@15 5@17" ' +
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"strength >= 16/intelligence >= 16/wisdom >= 16 ? 1:Bonus Ranger Experience",' +
      '"1:Alert Against Surprise","1:Delayed Henchmen","1:Favored Enemy",' +
      '"1:Fighting The Unskilled",1:Loner,1:Selective,1:Tracking,' +
      '"1:Travel Light","8:Bonus Attacks","10:Scrying Device Use" ' +
    'Experience=' +
      '"0 2251 4501 10001 20001 40001 90001 150001 225001 325001 650001' +
      ' 975001 1300001 1625001 2000001 2325001 2650001 2975001 3300001' +
      ' 3625001 3950001 4275001 4600001 4925001 5250001 5575001 5900001' +
      ' 6225001 6550001" ' +
    'SpellSlots=' +
      '"D1:1@8 2@10",' +
      '"D2:1@12 2@14",' +
      '"D3:1@16 2@17",' +
      '"M1:1@9 2@11",' +
      '"M2:1@12 2@14"',
  'Thief':
    'Require=' +
      '"alignment =~ \'Neutral|Evil\'","dexterity >= 9" ' +
    'HitDie=d6,10,2 THAC10="11 9@5 6@9 4@13 ...0@21" ' +
    'WeaponProficiency="2 3@5 ...9@29" NonproficientPenalty=-3 ' +
    'Breath="16 15@5 ...11@21" ' +
    'Death="13 12@5 ...8@21" ' +
    'Petrification="12 11@5 ...7@21" ' +
    'Spell="15 13@5 ...5@21" ' +
    'Wand="14 12@5 ...4@21" ' +
    'Features=' +
      '"1:Armor Proficiency (Leather/Studded Leather)",' +
      '"dexterity >= 16 ? 1:Bonus Thief Experience",' +
      '1:Backstab,"1:Thief Skills","1:Thieves\' Cant","10:Read Scrolls" ' +
    'Experience=' +
      '"0 1251 2501 5001 10001 20001 42501 70001 110001 160001 220001 440001' +
      ' 660001 880001 1100001 1320001 1540001 1760001 1980001 2200001' +
      ' 2420001 2640001 2860001 3080001 3300001 3520001 3740001 3960001' +
      ' 4180001"'
};
OldSchool.FEATURES_ADDED = {

  // Class
  'Additional Languages':
    'Section=skill ' +
    'Note="+%{levels.Bard<=17?levels.Bard-3-(levels.Bard-2)//3:(levels.Bard-8)} Language Count"',
  'Assassination':
    'Section=combat ' +
    'Note="Base %{levels.Assassin>=11?100:levels.Assassin==10?99:levels.Assassin==9?95:(levels.Assassin*5+45)}% chance that a strike kills a surprised target"',
  'Aware':'Section=combat Note="Surprised %{36-levels.Monk*2}%"',
  'Charming Music':
    'Section=magic ' +
    'Note="R40\' %V% chance to charm creatures with performance (Save 1 rd); may use <i>Suggestion</i> effects w/charmed creatures (Save -2 neg)"',
  'Cleric Spell Failure':'Section=magic Note="%{(13-wisdom)*5}%"',
  'Controlled Movement':
    'Section=save Note="Immune to <i>Haste</i> and <i>Slow</i> spells"',
  'Cure Disease':
    OSRIC.FEATURES['Cure Disease'].replace('<?3', ''),
  'Defensive Song':
    'Section=magic ' +
    'Note="Performance counteracts song attacks and soothes shriekers"',
  'Delayed Henchmen':
    'Section=ability ' +
    'Note="May not hire henchmen until level %{levels.Ranger?8:levels.Monk?6:4}"',
  'Diamond Body':'Section=save Note="Immune to poison"',
  'Divine Protection':'Section=save Note="+2 all saves"',
  'Dodge Missiles':
    'Section=combat ' +
    'Note="Successful petrification save dodges non-magical missiles"',
  'Evasion':
    'Section=save Note="Successful save yields no damage instead of half"',
  'Favored Enemy':
    'Section=combat Note="+%{levels.Ranger} melee damage vs. giant-class foes"',
  'Feign Death':
    'Section=feature Note="May appear dead for %{levels.Monk*2} tn"',
  'Flurry Of Blows':
    'Section=combat ' +
    'Note="May make %{levels.Monk<6?1.25:levels.Monk<9?1.5:levels.Monk<11?2:levels.Monk<14?2.5:levels.Monk<16?3:4} unarmed attacks/rd"',
  'Free Will':
    'Section=save Note="Immune to <i>Geas</i> and <i>Quest</i> spells"',
  'Improved Evasion':'Section=save Note="Failed save yields half damage"',
  'Killing Blow':
    'Section=combat ' +
    'Note="%{levels.Monk-7}+foe AC% chance to kill w/Stunning Blow"',
  'Legend Lore':
    'Section=skill Note="%{levels.Bard==23?99:levels.Bard>6?levels.Bard*5-15:levels.Bard>2?levels.Bard*3-2:(levels.Bard*5-5)}% chance to know info about a legendary item, person, or place"',
  'Limited Henchmen Classes':
    'Section=ability ' +
    'Note="Henchmen must be assassins%{levels.Monk?\', fighters, or thieves\':levels.Assassin<8?\'\':\' or thieves\'}"',
  'Masked Mind':'Section=save Note="%{62+levels.Monk*2}% resistance to ESP"',
  'Mental Discipline':
    'Section=save Note="Resists telepathy and mind blast as Intelligence 18"',
  'Monk Skills':
    'Section=skill ' +
    'Note="May Climb Walls, Find Traps, Hear Noise, Hide In Shadows, Move Silently, and Open Locks"',
  'Poetic Inspiration':
    'Section=magic ' +
    'Note="2 rd performance gives allies +1 attack and +10% morale for 1 tn"',
  'Precise Blow':'Section=combat Note="+%{levels.Monk/2} HP weapon damage"',
  'Purity Of Body':'Section=save Note="Immune to disease"',
  'Quivering Palm':
    'Section=combat ' +
    'Note="May kill w/in %{levels.Monk} dy a touched creature w/at most %{hitDice} HD and %{hitPoints*2} HP 1/wk"',
  'Read Scrolls':
    'Section=magic ' +
    'Note="May use arcane and druidic spell scrolls w/a %{levels.Bard?85:75}% chance of success"',
  'Resist Influence':
    'Section=save ' +
    'Note="%{levels.Monk*5+5}% resistance to beguiling, charm, hypnosis and suggestion spells"',
  'Slow Fall':'Section=save Note="Suffers no damage from a fall of %{levels.Monk<6?\\"20\'\\":levels.Monk<13?\\"30\'\\":\'any distance\'} w/in %{levels.Monk<6?1:levels.Monk<13?4:8}\' of wall"',
  'Speak With Animals':
    'Section=magic Note="May use <i>Speak With Animals</i> effects at will"',
  'Speak With Plants':
    'Section=magic Note="May use <i>Speak With Plants</i> effects at will"',
  'Spell Book':
    OSRIC.FEATURES['Spell Book'].replace('22', "'all'").replace('90', '95'),
  'Spiritual':
    'Section=feature ' +
    'Note="Must donate 100% after expenses to a religious institution"',
  'Stunning Blow':
     'Section=combat ' +
    'Note="Stuns foe for 1d6 rd when an unarmed attack succeeds by at least 5"',
  'Unburdened':'Section=feature Note="May own at most 5 magic items"',
  'Weapon Specialization':
    'Section=combat ' +
    'Note="+1 attack, +2 damage, and %{level<7?1.5:level<13?2:2.5} attacks/rd w/%{weaponSpecialization}"',
  'Wholeness Of Body':
    'Section=magic Note="May regain 1d4+%{levels.Monk-6} HP 1/dy"',
  'Woodland Languages':
    'Section=skill ' +
    'Note="+%{(levels.Bard||2)-2+(levels.Druid||2)-2} Language Count"'

};
OldSchool.FEATURES =
  Object.assign({}, OSRIC.FEATURES, OldSchool.FEATURES_ADDED);
OldSchool.GOODIES = Object.assign({}, OSRIC.GOODIES);
OldSchool.LANGUAGES = OSRIC.LANGUAGES;
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
OldSchool.SCHOOLS = OSRIC.SCHOOLS;
OldSchool.SHIELDS = OSRIC.SHIELDS;
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
  'Animal Summoning I':OSRIC.SPELLS['Animal Summoning I'].replace('120', '40'),
  'Animal Summoning II':
    OSRIC.SPELLS['Animal Summoning II'].replace('180', '60'),
  'Animal Summoning III':
    OSRIC.SPELLS['Animal Summoning III'].replace('240', '80'),
  'Anti-Magic Shell':
    OSRIC.SPELLS['Anti-Magic Shell'].replace('lvl*5', 'lvl*0.5'),
  'Blade Barrier':OSRIC.SPELLS['Blade Barrier'].replace("10' radius", "20' sq"),
  'Chaos':
    'Description=' +
      '"R%{lvl*5}\' Causes creatures in a 40\' sq to: 20% attack self or allies; 50% stand confused; 10% wander away; 20% attack nearest creature (Save by illusionists and fighters neg 1 rd), each rd for %{lvl} rd"',
  'Confusion':
    OSRIC.SPELLS.Confusion.replace("20' radius", "40' sq"),
  'Darkness':
    OSRIC.SPELLS.Darkness.replace('40', '0'),
  'Death Spell':
    'School=Conjuration',
  'Disintegrate':
    OSRIC.SPELLS.Disintegrate.replace("%{lvl*10}' sq", "10' cu"),
  'Dispel Magic C3':
    'School=Abjuration',
  'Feeblemind':
    OSRIC.SPELLS.Feeblemind
      .replace('40', '160').replace('-4 neg', '-5, non-human -2 neg'),
  'Fire Storm':
    OSRIC.SPELLS['Fire Storm'].replace('150', '160'),
  'Flame Arrow':
    'School=Conjuration',
  'Fly':
    OSRIC.SPELLS.Fly.replace('lvl*6', 'lvl'),
  'Guards And Wards':
    OSRIC.SPELLS['Guards And Wards']
      .replace('lvl*200', 'lvl*10+10')
      .replace('sq', 'radius')
      .replace('lvl*2', 'lvl') + ' ' +
    'School=Evocation',
  'Heat Metal':
    'School=Alteration',
  'Hypnotic Pattern':
    OSRIC.SPELLS['Hypnotic Pattern'].replace('25', '24'),
  'Ice Storm':
    OSRIC.SPELLS['Ice Storm']
      .replace('40', '20').replace('80', '40')
      .replaceAll('sq ', 'radius '),
  'Incendiary Cloud':
    OSRIC.SPELLS['Incendiary Cloud'].replace('radius', 'sq'),
  'Know Alignment':
    OSRIC.SPELLS['Know Alignment']
      .replace('Self', "R10' Self").replace('touched', 'target'),
  'Major Creation':
    OSRIC.SPELLS['Major Creation']
      .replace('{lvl} hr', '{lvl} or %{lvl*2} hr'),
  'Mass Suggestion':
    OSRIC.SPELLS['Mass Suggestion'].replace('lvl*10', '30'),
  'Monster Summoning IV':
    OSRIC.SPELLS['Monster Summoning IV'].replace('1d4', '1d3'),
  'Part Water':
    OSRIC.SPELLS['Part Water'].replace("20'x%{lvl*30}'x3'", "3'x%{lvl}'x%{lvl*20}'"),
  'Passwall':
    OSRIC.SPELLS.Passwall.replace('10', '8'),
  'Permanent Illusion':
    OSRIC.SPELLS['Permanent Illusion'].replace('30', '%{lvl*10}'),
  'Phase Door':
    OSRIC.SPELLS['Phase Door'].replace('twice', '%{lvl//2} times'),
  'Plane Shift':
    OSRIC.SPELLS['Plane Shift']
      .replace('Self plus 7 touched', 'Touched plus 6 touching'),
  'Prismatic Sphere':
    'School=Abjuration',
  'Produce Fire':
    OSRIC.SPELLS['Produce Fire'].replace("60' radius", "12' sq"),
  'Project Image':
    OSRIC.SPELLS['Project Image'].replace('I5,', ''),
  'Push':
    OSRIC.SPELLS.Push.replace('3', '2.5'),
  'Ray Of Enfeeblement':
    OSRIC.SPELLS['Ray Of Enfeeblement'].replace('3', '2.5'),
  'Reverse Gravity':
    OSRIC.SPELLS['Reverse Gravity'].replace('1 sec', '1 seg'),
  'Slow Poison':
    OSRIC.SPELLS['Slow Poison'].replace('{lvl*2} rd', '{lvl} hr'),
  'Sticks To Snakes':
    OSRIC.SPELLS['Sticks To Snakes'].replace("5' radius", "10' cu"),
  'Stinking Cloud':
    OSRIC.SPELLS['Stinking Cloud'].replace('radius', 'cu'),
  'Strength':
    'Description=' +
      '"Touched gains +1d8 (warrior), +1d6 (priest or rogue), or +1d4 (wizard) Strength for %{lvl} hr"',
  'Summon Shadow':
    OSRIC.SPELLS['Summon Shadow'].replace('{lvl}', '{lvl//3}'),
  'Wall Of Force':
    OSRIC.SPELLS['Wall Of Force'].replace('lvl+1', 'lvl+10'),
  'Water Breathing':
    OSRIC.SPELLS['Water Breathing'].replace("+(slvl=='M3'?' rd':' hr')", "/(slvl=='M3'?2:1)+' hr'")
};
/*
 * Mapping of OSRIC spell names to 1E/2E--mostly Americanized spellings and
 * addition of (tm) wizard names.
 */
OldSchool.SPELLS_RENAMES = {
  'Audible Glamour':'Audible Glamer',
  'Chariot Of Fire':'Chariot Of Sustarre',
  'Clenched Fist':"Bigby's Clenched Fist",
  'Colour Spray':'Color Spray',
  'Create Food And Water':'Create Food & Water',
  'Crushing Hand':"Bigby's Crushing Hand",
  'Detect Pits And Snares':'Detect Snares & Pits',
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
OldSchool.SPELLS['Projected Image'] =
  OSRIC.SPELLS['Project Image'].replace(',M6', '');
for(let s in OSRIC.SPELLS) {
  if(s in OldSchool.SPELLS_CHANGES)
    OldSchool.SPELLS[s] += ' ' + OldSchool.SPELLS_CHANGES[s];
  if(s in OldSchool.SPELLS_RENAMES) {
    OldSchool.SPELLS[OldSchool.SPELLS_RENAMES[s]] = OldSchool.SPELLS[s];
    delete OldSchool.SPELLS[s];
  }
}
OldSchool.WEAPONS = {
  'Awl Pike':'Category=Two-Handed Damage=d6',
  'Bardiche':'Category=Two-Handed Damage=2d4',
  'Bastard Sword':'Category=Two-Handed Damage=2d4',
  'Battle Axe':'Category=One-Handed Damage=d8',
  'Bec De Corbin':'Category=Two-Handed Damage=d8',
  'Bill-Guisarme':'Category=Two-Handed Damage=2d4',
  'Bo Stick':'Category=Two-Handed Damage=d6',
  'Broad Sword':'Category=One-Handed Damage=2d4', // Best guess on category
  'Club':'Category=One-Handed Damage=d6 Range=10',
  'Composite Long Bow':'Category=Ranged Damage=d6 Range=60',
  'Composite Short Bow':'Category=Ranged Damage=d6 Range=50',
  'Dagger':'Category=Light Damage=d4 Range=10',
  'Dart':'Category=Ranged Damage=d3 Range=15',
  'Fauchard':'Category=Two-Handed Damage=d6',
  'Fauchard-Fork':'Category=Two-Handed Damage=d8',
  "Footman's Flail":'Category=Two-Handed Damage=d6+1',
  "Footman's Mace":'Category=One-Handed Damage=d6+1',
  "Footman's Military Pick":'Category=One-Handed Damage=d6+1',
  'Glaive':'Category=Two-Handed Damage=d6',
  'Glaive-Guisarme':'Category=Two-Handed Damage=2d4',
  'Guisarme':'Category=Two-Handed Damage=2d4',
  'Guisarme-Voulge':'Category=Two-Handed Damage=2d4',
  'Halberd':'Category=Two-Handed Damage=d10',
  'Hammer':'Category=Light Damage=d4+1 Range=10',
  'Hand Axe':'Category=Light Damage=d6 Range=10',
  'Heavy Crossbow':'Category=Ranged Damage=d4+1 Range=80',
  'Heavy Horse Lance':'Category=One-Handed Damage=2d4+1',
  "Horseman's Flail":'Category=One-Handed Damage=d4+1',
  "Horseman's Mace":'Category=Light Damage=d6',
  "Horseman's Military Pick":'Category=Light Damage=d4+1',
  'Javelin':'Category=Ranged Damage=d6 Range=20',
  'Jo Stick':'Category=Two-Handed Damage=d6',
  'Light Crossbow':'Category=Ranged Damage=d4 Range=60',
  'Light Horse Lance':'Category=One-Handed Damage=d6',
  'Long Bow':'Category=Ranged Damage=d6 Range=70',
  'Long Sword':'Category=One-Handed Damage=d8',
  'Lucern Hammer':'Category=Two-Handed Damage=2d4',
  'Medium Horse Lance':'Category=One-Handed Damage=d6+1',
  'Military Fork':'Category=Two-Handed Damage=d8',
  'Morning Star':'Category=One-Handed Damage=2d4',
  'Partisan':'Category=Two-Handed Damage=d6',
  'Pike':'Category=Two-Handed Damage=d6',
  'Quarter Staff':'Category=Two-Handed Damage=d6',
  'Ranseur':'Category=Two-Handed Damage=2d4',
  'Scimitar':'Category=One-Handed Damage=d8',
  'Short Bow':'Category=Ranged Damage=d6 Range=50',
  'Short Sword':'Category=Light Damage=d6',
  'Sling':'Category=Ranged Damage=d4+1 Range=50',
  'Spear':'Category=Two-Handed Damage=d6 Range=10',
  'Spetum':'Category=Two-Handed Damage=d6+1',
  'Trident':'Category=One-Handed Damage=d6+1',
  'Two-Handed Sword':'Category=Two-Handed Damage=d10',
  'Unarmed':'Category=Unarmed Damage=d2',
  'Voulge':'Category=Two-Handed Damage=2d4'
};

/*
 * Changes from 1st Edition to 2nd Edition--see editedRules.
 */
OldSchool.RULE_EDITS = {
  'First Edition':{},
  'Second Edition':{
    'Armor':{
      // Modified
      'Chain Mail':'Weight=40',
      'Plate Mail':'Weight=50',
      'Ring Mail':'Weight=30',
      'Studded Leather':'Weight=25',
      // New
      'Brigandine':'AC=-4 Move=120 Weight=35',
      'Bronze Plate Mail':'AC=-6 Move=120 Weight=45',
      'Field Plate':'AC=-8 Move=120 Weight=60',
      'Full Plate':'AC=-9 Move=120 Weight=70',
      'Hide':'AC=-4 Move=120 Weight=30 Weight=15'
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
        'HitDie=d6,10,2 THAC10="10 9@3 ...1@20" ' +
        'WeaponProficiency="2 3@5 ...7@21" NonproficientPenalty=-3 ' +
        'NonweaponProficiency="3 4@5 ...8@21" ' +
        'Breath="16 15@5 ...11@21" ' +
        'Death="13 12@5 ...8@21" ' +
        'Petrification="12 11@5 ...7@21" ' +
        'Spell="15 13@5 ...5@21" ' +
        'Wand="14 12@5 ...4@21" ' +
        'Features=' +
          '"1:Armor Proficiency (Leather/Padded/Studded Leather/Scale Mail/Hide/Chain Mail)",' +
          '"1:Charming Music","1:Defensive Song","1:Legend Lore",' +
          '"1:Poetic Inspiration","1:Bard Skills","10:Read Scrolls" ' +
        'Experience=' +
          '"0 1250 2500 5000 10000 20000 42500 70000 110000 160000 220000' +
          ' 440000 660000 880000 1100000 1320000 1540000 1760000 1980000' +
          ' 2200000" ' +
        'SpellSlots=' +
          '"W1:1@2 2@3 3@5 4@16",' +
          '"W2:1@4 2@6 3@8 4@17",' +
          '"W3:1@7 2@9 3@11 4@18",' +
          '"W4:1@10 2@12 3@14 4@19",' +
          '"W5:1@13 2@15 3@17 4@20",' +
          '"W6:1@16 2@18 3@20"',
      'Cleric':
        'THAC10="10 8@4 ...-2@20" ' +
        'NonweaponProficiency="4 5@4 ...11@22" ' +
        'Experience=' +
          '"0 1500 3000 6000 13000 27500 55000 110000 225000 450000 675000' +
          ' 900000 1125000 1350000 1575000 1800000 2025000 2250000 2475000' +
          ' 2700000" ' +
        'SpellSlots=' +
          '"P1:1@1 2@2 3@4 4@9 5@11 6@12 7@16 8@18 9@19",' +
          '"P2:1@3 2@4 3@5 4@9 5@12 6@13 7@16 8@18 9@19",' +
          '"P3:1@5 2@6 3@8 4@11 5@12 6@13 7@16 8@18 9@20",' +
          '"P4:1@7 2@8 3@10 4@13 5@14 6@15 7@17 8@18",' +
          '"P5:1@9 2@10 3@14 4@15 5@17 6@18 7@20",' +
          '"P6:1@11 2@12 3@16 4@18 5@20",' +
          '"P7:1@14 2@17"',
      'Druid':
        'Require=' +
          '"race =~ \'Human|Half-Elf\'","charisma >= 15","wisdom >= 12" ' +
        'HitDie=d8,9,2 THAC10="10 8@4 ...-2@20" ' +
        'WeaponProficiency="2 3@5 ...7@21" NonproficientPenalty=-3 ' +
        'NonweaponProficiency="4 5@4 ...11@22" ' +
        'Features=' +
          '"1:Armor Proficiency (Leather)","1:Shield Proficiency (All)",' +
          '"wisdom >= 13 ? 1:Bonus Spells",' +
          '"1:Druids\' Cant","1:Resist Fire","1:Resist Lightning",' +
          '"3:Druid\'s Knowledge","3:Wilderness Movement",' +
          '"3:Woodland Languages","7:Immunity To Fey Charm",7:Shapeshift,' +
          // Hierophant
          '16:Ageless,"16:Fluid Appearance","16:Poison Immunity",' +
          '"17:Hibernation","17:Planar Travel (Earth)",' +
          '"18:Planar Travel (Fire)","19:Planar Travel (Water)",' +
          '"20:Planar Travel (Air)" ' +
        'Experience=' +
          '"0 1500 3000 6000 13000 27500 55000 110000 225000 450000 675000' +
          ' 900000 1125000 1350000 1575000 1800000 2025000 2250000 2475000' +
          ' 2700000" ' +
        'SpellSlots=' +
          '"P1:1@1 2@2 3@4 4@9 5@11 6@12 7@16 8@18 9@19",' +
          '"P2:1@3 2@4 3@5 4@9 5@12 6@13 7@16 8@18 9@19",' +
          '"P3:1@5 2@6 3@8 4@11 5@12 6@13 7@16 8@18 9@20",' +
          '"P4:1@7 2@8 3@10 4@13 5@14 6@15 7@17 8@18",' +
          '"P5:1@9 2@10 3@14 4@15 5@17 6@18 7@20",' +
          '"P6:1@11 2@12 3@16 4@18 5@20",' +
          '"P7:1@14 2@17"',
      'Fighter':
        'Require="strength >= 9" ' +
        'THAC10="10 9@2 ...-9@20" ' +
        'NonweaponProficiency="3 4@4 ...10@22" ' +
        'Features=' +
          '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
          '"strength >= 16 ? 1:Bonus Fighter Experience","7:Bonus Attacks" ' +
        'Experience=' +
          '"0 2000 4000 8000 16000 32000 64000 125000 250000 500000 750000' +
          ' 1000000 1250000 1500000 1750000 2000000 2250000 2500000 2750000' +
          ' 3000000"',
      'Illusionist':
        'Require="dexterity >= 16","intelligence >= 9" ' +
        'THAC10="10 9@4 ...4@20" ' +
        'NonweaponProficiency="4 5@4 ...11@22" ' +
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Illusionist Experience",' +
          '"1:Spell Book","1:School Expertise","1:School Focus",' +
          '"1:School Opposition","1:School Specialization","9:Eldritch Craft" '+
        'Experience=' +
          '"0 2500 5000 10000 20000 40000 60000 90000 135000 250000 375000' +
          ' 750000 1125000 1500000 1875000 2250000 2625000 3000000 3375000' +
          ' 3750000" ' +
        'SpellSlots=' +
          '"W1:1@1 2@2 3@4 4@5 5@13",' +
          '"W2:1@3 2@4 3@7 4@10 5@13",' +
          '"W3:1@5 2@6 3@8 4@11 5@13",' +
          '"W4:1@7 2@8 3@11 4@12 5@15",' +
          '"W5:1@9 2@10 3@11 4@12 5@15",' +
          '"W6:1@12 2@13 3@16 4@20",' +
          '"W7:1@14 2@16 3@17",' +
          '"W8:1@16 2@17 3@19",' +
          '"W9:1@18 2@20"',
      'Magic User':
        'HitDie=d4,10,1 THAC10="10 9@4 ...4@20" ' +
        'NonweaponProficiency="4 5@4 ...11@22" ' +
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Magic User Experience",' +
          '"1:Spell Book","9:Eldritch Craft" ' +
        'Experience=' +
          '"0000 2500 5000 10000 20000 40000 60000 90000 135000 250000 375000' +
          ' 750000 1125000 1500000 1875000 2250000 2625000 3000000 3375000' +
          ' 3750000" ' +
        'SpellSlots=' +
          '"W1:1@1 2@2 3@4 4@5 5@13",' +
          '"W2:1@3 2@4 3@7 4@10 5@13",' +
          '"W3:1@5 2@6 3@8 4@11 5@13",' +
          '"W4:1@7 2@8 3@11 4@12 5@15",' +
          '"W5:1@9 2@10 3@11 4@12 5@15",' +
          '"W6:1@12 2@13 3@16 4@20",' +
          '"W7:1@14 2@16 3@17",' +
          '"W8:1@16 2@17 3@19",' +
          '"W9:1@18 2@20"',
      'Paladin':
        'Require=' +
          '"alignment == \'Lawful Good\'","charisma >= 17",' +
          '"constitution >= 9","strength >= 12","wisdom >= 13" ' +
        'THAC10="10 9@2 ...-9@20" ' +
        'WeaponProficiency="4 5@4 ...11@22" NonproficientPenalty=-2 ' +
        'NonweaponProficiency="3 4@4 ...10@22" ' +
        'Features=' +
          '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
          '"strength >= 16/charisma >= 16 ? 1:Bonus Paladin Experience",' +
          '"1:Circle Of Power","1:Cure Disease","1:Detect Evil",' +
          '1:Discriminating,"1:Divine Health","1:Divine Protection",' +
          '"1:Lay On Hands",1:Non-Materialist,1:Philanthropist,' +
          '"1:Protection From Evil","3:Turn Undead","4:Summon Warhorse",' +
          '"7:Bonus Attacks" ' +
        'Experience=' +
          '"0 2000 4000 8000 16000 32000 64000 125000 250000 500000 750000' +
          ' 1000000 1250000 1500000 1750000 2000000 2250000 2500000 2750000' +
          ' 3000000" ' +
        'SpellSlots=' +
          '"P1:1@9 2@10 3@14",' +
          '"P2:1@11 2@12 3@16",' +
          '"P3:1@13 2@16 3@17",' +
          '"P4:1@15 2@19 3@20"',
      'Ranger':
        'Require=' +
          '"alignment =~ \'Good\'","constitution >= 14","dexterity >= 13",' +
          '"strength >= 13","wisdom >= 14" ' +
        'HitDie=d10,9,3 THAC10="10 9@2 ...-9@20" ' +
        'WeaponProficiency="4 5@4 ...11@22" NonproficientPenalty=-2 ' +
        'NonweaponProficiency="3 4@4 ...10@22" ' +
        'Features=' +
          '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
          '"strength >= 16/dexterity >= 16/wisdom >= 16 ? 1:Bonus Ranger Experience",' +
          '1:Ambidextrous,"1:Animal Empathy","1:Delayed Henchmen",' +
          '"1:Ranger Skills","1:Travel Light","2:Favored Enemy",3:Tracking,' +
          '"7:Bonus Attacks" ' +
        'Experience=' +
          '"0 2000 4000 8000 16000 32000 64000 125000 250000 500000 750000' +
          ' 1000000 1250000 1500000 1750000 2000000 2250000 2500000 2750000' +
          ' 3000000" ' +
        'SpellSlots=' +
          '"P1:1@8 2@9 3@13",' +
          '"P2:1@10 2@11 3@15",' +
          '"P3:1@12 2@14 3@16"',
      'Thief':
        'Require=' +
          '"alignment != \'Lawful Good\'","dexterity >= 9" ' +
        'THAC10="10 9@3 ...1@20" ' +
        'NonweaponProficiency="3 4@5 ...8@21" ' +
        'Features=' +
          '"1:Armor Proficiency (Elven Chain Mail/Leather/Padded/Studded Leather)",' +
          '"dexterity >= 16 ? 1:Bonus Thief Experience",' +
          '1:Backstab,"1:Thief Skills","1:Thieves\' Cant","10:Read Scrolls" ' +
         'Experience=' +
           '"0 1250 2500 5000 10000 20000 40000 70000 110000 160000 220000' +
           ' 440000 660000 880000 1100000 1320000 1540000 1760000 1980000' +
           ' 2200000"',
      // New
      'Abjurer':
        'Require="wisdom >= 15","intelligence >= 9" ' +
        'HitDie=d4,10,1 THAC10="10 9@4 ...4@20" ' +
        'WeaponProficiency="1 2@7 ...5@25" NonproficientPenalty=-5 ' +
        'NonweaponProficiency="4 5@4 ...11@22" ' +
        'Breath="15 13@6 ...7@21" ' +
        'Death="14 13@6 11@11 10@16 8@21" ' +
        'Petrification="13 11@6 ...5@21" ' +
        'Spell="12 10@6 ...4@21" ' +
        'Wand="11 9@6 ...3@21" '+
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Abjurer Experience",' +
          '"1:Spell Book","1:School Expertise","1:School Focus",' +
          '"1:School Opposition","1:School Specialization","9:Eldritch Craft" '+
        'Experience=' +
          '"0 2500 5000 10000 20000 40000 60000 90000 135000 250000 375000' +
          ' 750000 1125000 1500000 1875000 2250000 2625000 3000000 3375000' +
          ' 3750000" ' +
        'SpellSlots=' +
          '"W1:1@1 2@2 3@4 4@5 5@13",' +
          '"W2:1@3 2@4 3@7 4@10 5@13",' +
          '"W3:1@5 2@6 3@8 4@11 5@13",' +
          '"W4:1@7 2@8 3@11 4@12 5@15",' +
          '"W5:1@9 2@10 3@11 4@12 5@15",' +
          '"W6:1@12 2@13 3@16 4@20",' +
          '"W7:1@14 2@16 3@17",' +
          '"W8:1@16 2@17 3@19",' +
          '"W9:1@18 2@20"',
      'Conjurer':
        'Require="constitution >= 15","intelligence >= 9" ' +
        'HitDie=d4,10,1 THAC10="10 9@4 ...4@20" ' +
        'WeaponProficiency="1 2@7 ...5@25" NonproficientPenalty=-5 ' +
        'NonweaponProficiency="4 5@4 ...11@22" ' +
        'Breath="15 13@6 ...7@21" ' +
        'Death="14 13@6 11@11 10@16 8@21" ' +
        'Petrification="13 11@6 ...5@21" ' +
        'Spell="12 10@6 ...4@21" ' +
        'Wand="11 9@6 ...3@21" '+
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Conjurer Experience",' +
          '"1:Spell Book","1:School Expertise","1:School Focus",' +
          '"1:School Opposition","1:School Specialization","9:Eldritch Craft" '+
        'Experience=' +
          '"0 2500 5000 10000 20000 40000 60000 90000 135000 250000 375000' +
          ' 750000 1125000 1500000 1875000 2250000 2625000 3000000 3375000' +
          ' 3750000" ' +
        'SpellSlots=' +
          '"W1:1@1 2@2 3@4 4@5 5@13",' +
          '"W2:1@3 2@4 3@7 4@10 5@13",' +
          '"W3:1@5 2@6 3@8 4@11 5@13",' +
          '"W4:1@7 2@8 3@11 4@12 5@15",' +
          '"W5:1@9 2@10 3@11 4@12 5@15",' +
          '"W6:1@12 2@13 3@16 4@20",' +
          '"W7:1@14 2@16 3@17",' +
          '"W8:1@16 2@17 3@19",' +
          '"W9:1@18 2@20"',
      'Diviner':
        'Require="wisdom >= 16","intelligence >= 9" ' +
        'HitDie=d4,10,1 THAC10="10 9@4 ...4@20" ' +
        'WeaponProficiency="1 2@7 ...5@25" NonproficientPenalty=-5 ' +
        'NonweaponProficiency="4 5@4 ...11@22" ' +
        'Breath="15 13@6 ...7@21" ' +
        'Death="14 13@6 11@11 10@16 8@21" ' +
        'Petrification="13 11@6 ...5@21" ' +
        'Spell="12 10@6 ...4@21" ' +
        'Wand="11 9@6 ...3@21" '+
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Diviner Experience",' +
          '"1:Spell Book","1:School Expertise","1:School Focus",' +
          '"1:School Opposition","1:School Specialization","9:Eldritch Craft" '+
        'Experience=' +
          '"0 2500 5000 10000 20000 40000 60000 90000 135000 250000 375000' +
          ' 750000 1125000 1500000 1875000 2250000 2625000 3000000 3375000' +
          ' 3750000" ' +
        'SpellSlots=' +
          '"W1:1@1 2@2 3@4 4@5 5@13",' +
          '"W2:1@3 2@4 3@7 4@10 5@13",' +
          '"W3:1@5 2@6 3@8 4@11 5@13",' +
          '"W4:1@7 2@8 3@11 4@12 5@15",' +
          '"W5:1@9 2@10 3@11 4@12 5@15",' +
          '"W6:1@12 2@13 3@16 4@20",' +
          '"W7:1@14 2@16 3@17",' +
          '"W8:1@16 2@17 3@19",' +
          '"W9:1@18 2@20"',
      'Enchanter':
        'Require="charisma >= 16","intelligence >= 9" ' +
        'HitDie=d4,10,1 THAC10="10 9@4 ...4@20" ' +
        'WeaponProficiency="1 2@7 ...5@25" NonproficientPenalty=-5 ' +
        'NonweaponProficiency="4 5@4 ...11@22" ' +
        'Breath="15 13@6 ...7@21" ' +
        'Death="14 13@6 11@11 10@16 8@21" ' +
        'Petrification="13 11@6 ...5@21" ' +
        'Spell="12 10@6 ...4@21" ' +
        'Wand="11 9@6 ...3@21" '+
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Enchanter Experience",' +
          '"1:Spell Book","1:School Expertise","1:School Focus",' +
          '"1:School Opposition","1:School Specialization","9:Eldritch Craft" '+
        'Experience=' +
          '"0 2500 5000 10000 20000 40000 60000 90000 135000 250000 375000' +
          ' 750000 1125000 1500000 1875000 2250000 2625000 3000000 3375000' +
          ' 3750000" ' +
        'SpellSlots=' +
          '"W1:1@1 2@2 3@4 4@5 5@13",' +
          '"W2:1@3 2@4 3@7 4@10 5@13",' +
          '"W3:1@5 2@6 3@8 4@11 5@13",' +
          '"W4:1@7 2@8 3@11 4@12 5@15",' +
          '"W5:1@9 2@10 3@11 4@12 5@15",' +
          '"W6:1@12 2@13 3@16 4@20",' +
          '"W7:1@14 2@16 3@17",' +
          '"W8:1@16 2@17 3@19",' +
          '"W9:1@18 2@20"',
      'Invoker':
        'Require="constitution >= 16","intelligence >= 9" ' +
        'HitDie=d4,10,1 THAC10="10 9@4 ...4@20" ' +
        'WeaponProficiency="1 2@7 ...5@25" NonproficientPenalty=-5 ' +
        'NonweaponProficiency="4 5@4 ...11@22" ' +
        'Breath="15 13@6 ...7@21" ' +
        'Death="14 13@6 11@11 10@16 8@21" ' +
        'Petrification="13 11@6 ...5@21" ' +
        'Spell="12 10@6 ...4@21" ' +
        'Wand="11 9@6 ...3@21" '+
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Invoker Experience",' +
          '"1:Spell Book","1:School Expertise","1:School Focus",' +
          '"1:School Opposition","1:School Specialization","9:Eldritch Craft" '+
        'Experience=' +
          '"0 2500 5000 10000 20000 40000 60000 90000 135000 250000 375000' +
          ' 750000 1125000 1500000 1875000 2250000 2625000 3000000 3375000' +
          ' 3750000" ' +
        'SpellSlots=' +
          '"W1:1@1 2@2 3@4 4@5 5@13",' +
          '"W2:1@3 2@4 3@7 4@10 5@13",' +
          '"W3:1@5 2@6 3@8 4@11 5@13",' +
          '"W4:1@7 2@8 3@11 4@12 5@15",' +
          '"W5:1@9 2@10 3@11 4@12 5@15",' +
          '"W6:1@12 2@13 3@16 4@20",' +
          '"W7:1@14 2@16 3@17",' +
          '"W8:1@16 2@17 3@19",' +
          '"W9:1@18 2@20"',
      'Necromancer':
        'Require="wisdom >= 16","intelligence >= 9" ' +
        'HitDie=d4,10,1 THAC10="10 9@4 ...4@20" ' +
        'WeaponProficiency="1 2@7 ...5@25" NonproficientPenalty=-5 ' +
        'NonweaponProficiency="4 5@4 ...11@22" ' +
        'Breath="15 13@6 ...7@21" ' +
        'Death="14 13@6 11@11 10@16 8@21" ' +
        'Petrification="13 11@6 ...5@21" ' +
        'Spell="12 10@6 ...4@21" ' +
        'Wand="11 9@6 ...3@21" '+
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Necromancer Experience",' +
          '"1:Spell Book","1:School Expertise","1:School Focus",' +
          '"1:School Opposition","1:School Specialization","9:Eldritch Craft" '+
        'Experience=' +
          '"0 2500 5000 10000 20000 40000 60000 90000 135000 250000 375000' +
          ' 750000 1125000 1500000 1875000 2250000 2625000 3000000 3375000' +
          ' 3750000" ' +
        'SpellSlots=' +
          '"W1:1@1 2@2 3@4 4@5 5@13",' +
          '"W2:1@3 2@4 3@7 4@10 5@13",' +
          '"W3:1@5 2@6 3@8 4@11 5@13",' +
          '"W4:1@7 2@8 3@11 4@12 5@15",' +
          '"W5:1@9 2@10 3@11 4@12 5@15",' +
          '"W6:1@12 2@13 3@16 4@20",' +
          '"W7:1@14 2@16 3@17",' +
          '"W8:1@16 2@17 3@19",' +
          '"W9:1@18 2@20"',
      'Transmuter':
        'Require="dexterity >= 15","intelligence >= 9" ' +
        'HitDie=d4,10,1 THAC10="10 9@4 ...4@20" ' +
        'WeaponProficiency="1 2@7 ...5@25" NonproficientPenalty=-5 ' +
        'NonweaponProficiency="4 5@4 ...11@22" ' +
        'Breath="15 13@6 ...7@21" ' +
        'Death="14 13@6 11@11 10@16 8@21" ' +
        'Petrification="13 11@6 ...5@21" ' +
        'Spell="12 10@6 ...4@21" ' +
        'Wand="11 9@6 ...3@21" '+
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Transmuter Experience",' +
          '"1:Spell Book","1:School Expertise","1:School Focus",' +
          '"1:School Opposition","1:School Specialization","9:Eldritch Craft" '+
        'Experience=' +
          '"0 2500 5000 10000 20000 40000 60000 90000 135000 250000 375000' +
          ' 750000 1125000 1500000 1875000 2250000 2625000 3000000 3375000' +
          ' 3750000" ' +
        'SpellSlots=' +
          '"W1:1@1 2@2 3@4 4@5 5@13",' +
          '"W2:1@3 2@4 3@7 4@10 5@13",' +
          '"W3:1@5 2@6 3@8 4@11 5@13",' +
          '"W4:1@7 2@8 3@11 4@12 5@15",' +
          '"W5:1@9 2@10 3@11 4@12 5@15",' +
          '"W6:1@12 2@13 3@16 4@20",' +
          '"W7:1@14 2@16 3@17",' +
          '"W8:1@16 2@17 3@19",' +
          '"W9:1@18 2@20"'
    },
    'Feature':{
      // Modified
      'Charming Music':
        'Section=magic ' +
        'Note="May use performance to modify listener reaction by 1 category (-%{levels.Bard//3} paralyzation save neg)"',
      'Defensive Song':
        'Note="R30\' Successful spell save during performance counteracts magical song and poetry attacks"',
      'Detect Construction':
        'Note="R10\' 83% chance to detect new construction"',
      'Detect Slope':
        OSRIC.FEATURES['Detect Slope']
          .replace("race=~'Gnome'?80:75", "race=~'Halfling'?75:83"),
      'Determine Depth':
        OSRIC.FEATURES['Determine Depth'].replace('60', '67'),
      'Favored Enemy':'Note="+4 attack vs. chosen foe type"',
      'Legend Lore':
        'Note="%{levels.Bard*5}% chance to know info about a magic item"',
      'Poetic Inspiration':
        'Note="R%{levels.Bard*10}\' 3 rd performance gives allies +1 attack, +1 saves, or +2 morale for %{levels.Bard} rd"',
      'Read Scrolls':
        'Note="May use spell scrolls w/a %{levels.Bard?85:75}% chance of success"',
      'Spell Book':
        'Note="Understands %{intelligence>=19?10:intelligence==18?9:intelligence==17?8:intelligence>=15?7:intelligence>=13?6:intelligence>=10?5:4}-%{intelligence>=19?\'all\':intelligence==18?18:intelligence==17?14:intelligence>=15?11:intelligence>=13?9:intelligence>=10?7:6} spells of each level; has a %{intelligence<18?75-(17-intelligence)*5:intelligence==18?85:(76+intelligence<?100)}% chance to understand a particular spell"',
      'Stealthy':
        'Note="When traveling quietly, foes suffer -4 on surprise roll or -2 when opening doors"',
      'Tracking':'Section=skill Note="+%V Tracking"',
      // New
      'Ageless':'Section=ability Note="Suffers no ability adjustments for age"',
      'Ambidextrous':
        'Section=combat ' +
        'Note="Suffers no penalty for two-handed fighting in light armor"',
      'Animal Empathy':
        'Section=skill ' +
        'Note="May befriend domestic animals and shift wild animals\' reaction 1 category (-%{(levels.Ranger+2)//3} Wand save neg)"',
      'Bard Skills':
        'Section=skill ' +
        'Note="May Climb Walls, Hear Noise, Pick Pockets, and Read Languages"',
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
        'Note="R30\' May use a Holy Sword to dispel hostile magic up to level %{levels.Paladin}"',
      'Deadly Aim':'Section=combat Note="+1 attack w/slings and thrown"',
      'Fluid Appearance':
        'Section=magic Note="May alter self appearance at will"',
      'Gnome Ability Adjustment':
        'Section=ability Note="+1 Intelligence/-1 Wisdom"',
      'Hibernation':
        'Section=feature ' +
        'Note="May minimize bodily processes, appearing dead, for a chosen length of time"',
      'Magic Mismatch':
        'Section=feature Note="20% chance of magic item malfunction"',
      'Planar Travel (Air)':
        'Section=magic Note="May travel in the Plane Of Air at will"',
      'Planar Travel (Earth)':
        'Section=magic Note="May travel in the Plane Of Earth at will"',
      'Planar Travel (Fire)':
        'Section=magic Note="May travel in the Plane Of Fire at will"',
      'Planar Travel (Water)':
        'Section=magic Note="May travel in the Plane Of Water at will"',
      'Poison Immunity':'Section=save Note="Immune to poison"',
      'Ranger Skills':
        'Section=skill Note="May Hide In Shadows and Move Silently"',
      'School Expertise':
        'Section=magic,save ' +
        'Note=' +
          '"Foes suffer -1 save vs. spells from specialization school",' +
          '"+1 vs. spells from specialization school"',
      'School Focus':
        'Section=magic ' +
        'Note="Has a +15% chance to understand spells from specialization school and a -15% chance to understand spells from other schools"',
      'School Opposition':
        'Section=magic ' +
        'Note=' +
          '"Cannot learn or cast %{' +
          'levels.Abjurer?\'Alteration or Illusion\':' +
          'levels.Conjurer?\'Divination or Evocation\':' +
          'levels.Diviner?\'Conjuration\':' +
          'levels.Enchanter?\'Evocation or Necromancy\':' +
          'levels.Invoker?\'Conjuration or Enchantment\':' +
          'levels.Necromancer?\'Enchantment or Illusion\':' +
          'levels.Transmuter?\'Abjuration or Necromancy\':' +
          // Illusionist
          '\'Abjuration, Evocation, or Necromancy\'' +
          '} spells"',
      'School Specialization':
        'Section=magic ' +
        'Note=' +
          '"Gains an extra %{' +
          'levels.Abjurer?\'Abjuration\':' +
          'levels.Conjurer?\'Conjuration\':' +
          'levels.Diviner?\'Divination\':' +
          'levels.Enchanter?\'Enchantment\':' +
          'levels.Invoker?\'Evocation\':' +
          'levels.Necromancer?\'Necromancy\':' +
          'levels.Transmuter?\'Alteration\':' +
          // Illusionist
          '\'Illusion\'' +
          '} spell at each spell level"',
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
      'Body Shield':'AC=-1 Weight=15',
      'Buckler Shield':'AC=-1 Weight=3'
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
      'Airborne Riding':'Ability=wisdom Modifier=-2 Class=all',
      'Ancient History':
        'Ability=intelligence Modifier=-1 Class=Bard,Cleric,Druid,Illusionist,"Magic User",Thief',
      'Ancient Languages':
        'Ability=intelligence Class=Cleric,Druid,Illusionist,"Magic User"',
      'Animal Handling':'Ability=wisdom Modifier=-1 Class=all',
      'Animal Lore':'Ability=intelligence Class=Fighter,Paladin,Ranger',
      'Animal Training':'Ability=wisdom Class=all',
      'Appraising':'Ability=intelligence Class=Bard,Thief',
      'Armorer':'Ability=intelligence Modifier=-2 Class=Fighter,Paladin,Ranger',
      'Artistic Ability':'Ability=wisdom Class=all',
      'Astrology':
        'Ability=intelligence Class=Cleric,Druid,Illusionist,"Magic User"',
      'Blacksmithing':'Ability=strength Class=all',
      'Blind-Fighting':'Class=Bard,Fighter,Paladin,Ranger,Thief Ability=N/A',
      'Bowyer':'Ability=dexterity Modifier=-1 Class=Fighter,Paladin,Ranger',
      'Brewing':'Ability=intelligence Class=all',
      'Carpentry':'Ability=strength Class=all',
      'Charioteering':'Ability=dexterity Modifier=2 Class=Fighter,Paladin,Ranger',
      'Cobbling':'Ability=dexterity Class=all',
      'Cooking':'Ability=intelligence Class=all',
      'Dancing':'Ability=dexterity Class=all',
      'Direction Sense':'Ability=wisdom Modifier=1 Class=all',
      'Disguise':'Ability=charisma Modifier=-1 Class=Bard,Thief',
      'Endurance':'Ability=constitution Class=Fighter,Paladin,Ranger',
      'Engineering':
        'Ability=intelligence Modifier=-3 Class=Cleric,Druid,Illusionist,"Magic User"',
      'Etiquette':'Ability=charisma Class=all',
      'Fire-Building':'Ability=wisdom Modifier=-1 Class=all',
      'Fishing':'Ability=wisdom Modifier=-1 Class=all',
      'Forgery':'Ability=dexterity Modifier=-1 Class=Bard,Thief',
      'Gaming':'Ability=charisma Class=Bard,Fighter,Paladin,Ranger,Thief',
      'Gem Cutting':
        'Ability=dexterity Modifier=-2 Class=Bard,Illusionist,"Magic User",Thief',
      'Healing':'Ability=wisdom Modifier=-2 Class=Cleric,Druid',
      'Heraldry':'Ability=intelligence Class=all',
      'Herbalism':
        'Ability=intelligence Modifier=-2 Class=Cleric,Druid,Illusionist,"Magic User"',
      'Hunting':'Ability=wisdom Modifier=-1 Class=Fighter,Paladin,Ranger',
      'Juggling':'Ability=dexterity Modifier=-1 Class=Bard,Thief',
      'Jumping':'Ability=strength Class=Bard,Thief',
      'Land-Based Riding':'Ability=wisdom Modifier=+3 Class=all',
      'Leather Working':'Ability=intelligence Class=all',
      'Local History':'Ability=charisma Class=Bard,Cleric,Druid,Thief',
      'Mining':'Ability=wisdom Modifier=-3 Class=all',
      'Modern Languages':'Ability=intelligence Class=all',
      'Mountaineering':'Class=Fighter,Paladin,Ranger Ability=N/A',
      'Musical Instrument':'Ability=dexterity Modifier=-1 Class=Cleric,Druid',
      'Navigation':
        'Ability=intelligence Modifier=-2 Class=Fighter,Illusionist,"Magic User",Paladin,Ranger',
      'Pottery':'Ability=dexterity Modifier=-2 Class=all',
      'Reading And Writing':
        'Ability=intelligence Modifier=1 Class=Cleric,Druid,Illusionist,"Magic User"',
      'Reading Lips':'Ability=intelligence Modifier=-2 Class=Bard,Thief',
      'Religion':'Ability=wisdom Class=Cleric,Druid,Illusionist,"Magic User"',
      'Rope Use':'Ability=dexterity Class=all',
      'Running':'Ability=constitution Modifier=-6 Class=Fighter,Paladin,Ranger',
      'Seamanship':'Ability=dexterity Modifier=+1 Class=all',
      'Set Snares':'Ability=dexterity Modifier=-1 Class=Bard,Fighter,Paladin,Ranger,Thief',
      'Singing':'Ability=charisma Class=all',
      'Spellcraft':
        'Ability=intelligence Modifier=-2 Class=Cleric,Druid,Illusionist,"Magic User"',
      'Stonemasonry':'Ability=strength Modifier=-2 Class=all',
      'Survival':'Ability=intelligence Class=Fighter,Paladin,Ranger',
      'Swimming':'Ability=strength Class=all',
      'Tailoring':'Ability=dexterity Modifier=-1 Class=all',
      'Tightrope Walking':'Ability=dexterity Class=Bard,Thief',
      'Tracking':'Ability=wisdom Class=Fighter,Paladin,Ranger',
      'Tumbling':'Ability=dexterity Class=Bard,Thief',
      'Ventriloquism':'Ability=intelligence Modifier=-2 Class=Bard,Thief',
      'Weaponsmithing':'Ability=intelligence Modifier=-3 Class=Fighter,Paladin,Ranger',
      'Weather Sense':'Ability=wisdom Modifier=-1 Class=all',
      'Weaving':'Ability=intelligence Modifier=-1 Class=all'
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
      'Projected Image':null,
      'Purify Water':null,
      'Push':null,
      'Spiritwrack':null,
      'True Sight':null,
      'Write':null,
      // Renamed
      'Anti-Animal Shell':null,
      'Antianimal Shell':
        OSRIC.SPELLS['Anti-Animal Shell'] + ' ' +
        'Level=P6',
      'Anti-Magic Shell':null,
      'Antimagic Shell':
        OSRIC.SPELLS['Anti-Magic Shell'].replace('lvl*5', 'lvl*0.5') + ' ' +
        'Level=W6',
      'Anti-Plant Shell':null,
      'Antiplant Shell':
        OSRIC.SPELLS['Anti-Plant Shell'].replace('80', '7.5') + ' ' +
        'Level=P5 ' +
        'Range="7.5\' radius"',
      'Antipathy/Sympathy':null,
      'Antipathy-Sympathy':
        OSRIC.SPELLS['Antipathy/Sympathy'] + ' ' +
        'Level=W8',
      'Demi-Shadow Magic':null,
      'Demishadow Magic':OSRIC.SPELLS['Demi-Shadow Magic'] + ' ' +
        'Level=W6 ' +
        'Description="R%{lvl*10+60}\' Mimics Wizard level 1-5 spells"',
      'Demi-Shadow Monsters':null,
      'Demishadow Monsters':OSRIC.SPELLS['Demi-Shadow Monsters'] + ' ' +
        'Level=W5',
      'Fools Gold':null,
      "Fool's Gold":OSRIC.SPELLS["Fool's Gold"] + ' ' +
        'Level=W2',
      'Non-Detection':null,
      'Nondetection':
        OSRIC.SPELLS['Non-Detection']
          .replace('Self', 'Touched').replace('tn', 'hr') + ' ' +
        'Level=W3',
      // Modified
      'Aerial Servant':
        'Level=P6',
      'Affect Normal Fires':
        OSRIC.SPELLS['Affect Normal Fires'].replaceAll('1.5', '10').replace('{lvl} rd', '{lvl*2} rd') + ' ' +
        'Level=W1',
      'Airy Water':
        'Level=W5',
      'Animal Friendship':
        'Level=P1',
      'Animal Growth':
        OSRIC.SPELLS['Animal Growth'].replaceAll('D5', 'P5') + ' ' +
        'Level=P5,W5',
      'Animal Summoning I':
        OSRIC.SPELLS['Animal Summoning I'].replace("%{lvl*120}'", '1 mile') + ' ' +
        'Level=P4',
      'Animal Summoning II':
        'Level=P5',
      'Animal Summoning III':
        OSRIC.SPELLS['Animal Summoning III'].replace('240', '100') + ' ' +
        'Level=P6',
      'Animate Dead':
        'Level=P3,W5',
      'Animate Object':
        'Level=P6',
      'Animate Rock':
        'Level=P7',
      'Astral Spell':
        OSRIC.SPELLS['Astral Spell'].replace('5', '7') + ' ' +
        'Level=P7,W9',
      'Astral Spell W9':
        'School=Evocation',
      'Atonement':
        'Level=P5',
      'Audible Glamer':
        'Level=W1',
      'Augury':
        'Level=P2 ' +
        'School="Lesser Divination"',
      'Barkskin':
        OSRIC.SPELLS.Barkskin.replace('-1 Armor Class', '-%{4+lvl//4} Armor Class') + ' ' +
        'Level=P2',
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
        OSRIC.SPELLS['Blade Barrier'].replace("10' radius", "60' sq") + ' ' +
        'Level=P6',
      'Bless':
        'Level=P1',
      'Blindness':
        OSRIC.SPELLS.Blindness.replace('30', '%{lvl*10+30}') + ' ' +
        'Level=W2',
      'Blink':
        OSRIC.SPELLS.Blink.replace('2', '10') + ' ' +
        'Level=W3',
      'Blur':
        'Level=W2',
      'Burning Hands':
        OSRIC.SPELLS['Burning Hands'].replace("3'", "5'") + ' ' +
        'Level=W1',
      'Call Lightning':
        'Level=P3',
      'Call Woodland Beings':
        OSRIC.SPELLS['Call Woodland Beings'].replace('30+360', '100') + ' '+
        'Level=P4',
      'Change Self':
        'Level=W1',
      'Chant':
        'Level=P2',
      'Chaos':
        'Level=W5',
      'Chariot Of Sustarre':
        OSRIC.SPELLS['Chariot Of Fire'].replace('%{lvl+6} tn', '12 hr') + ' ' +
        'Level=P7',
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
        OSRIC.SPELLS['Colour Spray'].replace('%{lvl*10}', '20') + ' ' +
        'Level=W1',
      'Command':
        OSRIC.SPELLS.Command.replace('10', '30') + ' ' +
        'Level=P1',
      'Commune':
        'Level=P5 ' +
        'School="Greater Divination"',
      'Commune With Nature':
        OSRIC.SPELLS['Commune With Nature'].replace("%{lvl//2} mile", "%{lvl*30}'") + ' ' +
        'Level=P5 ' +
        'School="Greater Divination"',
      'Comprehend Languages':
        'Level=W1',
      'Cone Of Cold':
        'Level=W5',
      'Confusion':
        OSRIC.SPELLS.Confusion
          .replaceAll('D7', 'P7').replaceAll('M4', 'W4')
          .replace("20' radius", "40' sq")
          .replace(/2d\S*/, "1d4+%{lvl//(slvl=='W4'?2:1)}"),
      'Conjure Animals':
        OSRIC.SPELLS['Conjure Animals']
          .replaceAll('C6', 'P6').replaceAll('I6', 'W6')
          .replace('lvl', 'lvl*2'),
      'Conjure Earth Elemental':
        'Level=P7',
      'Conjure Elemental':
        'Level=W5',
      'Conjure Fire Elemental':
        'Level=P6',
      'Contact Other Plane':
        'Level=W5 ' +
        'School="Greater Divination"',
      'Continual Light':
        OSRIC.SPELLS['Continual Light']
          .replaceAll('C3', 'P3').replaceAll('M2', 'W2'),
      "Control Temperature, 10' Radius":
        OSRIC.SPELLS["Control Temperature, 10' Radius"]
          .replace('lvl*9', 'lvl*10') + ' ' +
        'Level=P4',
      'Control Weather':
        OSRIC.SPELLS['Control Weather']
          .replaceAll('C7', 'P7').replaceAll('M6', 'W6'),
      'Control Winds':
        'Level=P5',
      'Create Food & Water':
        'Level=P3',
      'Create Water':
        OSRIC.SPELLS['Create Water']
          .replace('10', '30').replaceAll('C1', 'P1') + ' ' +
        'Level=P1',
      'Creeping Doom':
        'Level=P7',
      'Cure Critical Wounds':
        'Level=P5',
      'Cure Disease':
        'Level=P3',
      'Cure Light Wounds':
        'Level=P1',
      'Cure Serious Wounds':
        'Level=P4',
      'Dancing Lights':
        'Level=W1',
      "Darkness, 15' Radius":
        'Level=W2',
      'Deafness':
        'Level=W2',
      'Death Spell':
        OSRIC.SPELLS['Death Spell']
          .replace('M6', 'W6').replace('lvl*5', 'lvl*30'),
      'Delayed Blast Fireball':
        'Level=W7',
      'Detect Charm':
        'Level=P2 ' +
        'School="Lesser Divination"',
      'Detect Evil':
        OSRIC.SPELLS['Detect Evil']
          .replaceAll('C1', 'P1').replaceAll('M2', 'W2') + ' ' +
        'School="Lesser Divination"',
      'Detect Invisibility':
        'Level=W2 ' +
        'School="Lesser Divination"',
      'Detect Lie':
        OSRIC.SPELLS['Detect Lie'].replace('Target', 'Self') + ' ' +
        'Level=P4 ' +
        'School="Lesser Divination"',
      'Detect Magic':
        OSRIC.SPELLS['Detect Magic'].replaceAll('C1', 'P1') + ' ' +
        'Level=P1,W1 ' +
        'School="Lesser Divination"',
      'Detect Snares & Pits':
        'Level=P1 ' +
        'School="Lesser Divination"',
      'Dig':
        'Level=W4',
      'Dimension Door':
        'Level=W4',
      'Disintegrate':
        'Level=W6',
      'Dispel Evil':
        'Level=P5',
      'Dispel Magic':
        OSRIC.SPELLS['Dispel Magic']
          .replaceAll('C3', 'P3')
          .replace('radius', 'cu') + ' ' +
        'Level=P3,W3',
      'Distance Distortion':
        OSRIC.SPELLS['Distance Distortion']
          .replace("{lvl*100}' sq", "{lvl*10}' cu")
          .replace('{lvl}', '{lvl*2}') + ' ' +
        'Level=W5',
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
        'Description=' +
          '"R%{lvl*10}\' Targets in a 20\' cu experience courage (gain +1 attack, +3 damage, +5 HP), fear (flee), friendship (react positively), happiness (+4 reaction), hate (react negatively), hope (gain +2 morale, save, attack, damage), hopelessness (walk away or surrender), or sadness (suffer -1 surprise, +1 init) for conc"',
      'Enchant An Item':
        'Level=W6 ' +
        'School=Enchantment',
      'Enchanted Weapon':
        OSRIC.SPELLS['Enchanted Weapon']
          .replace('but w/no attack bonuses', '+1 attack and damage')
          .replace(' or until next hit', '') + ' ' +
        'Level=W4 ' +
        'School=Enchantment',
      'Enlarge':
        'Level=W1 ' +
        'Description="R%{lvl*5}\' Expands (Reverse shrinks) target creature or object by %{lvl*10}% (Save neg) for %{lvl*5} rd"',
      'Entangle':
        OSRIC.SPELLS.Entangle.replace("20' radius", "40' cu") + ' ' +
        'Level=P1',
      'Erase':
        'Level=W1 ' +
        'Description="R30\' Erases magical (%{lvl*5+30}% chance) or normal (90% chance) writing from a 2-page area"',
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
        OSRIC.SPELLS['Feather Fall'].replace('seg', 'rd') + ' ' +
        'Level=W1',
      'Feeblemind':
        OSRIC.SPELLS.Feeblemind.replace(/Save.*neg/, 'Save Priest +1, Wizard -4, nonhuman -2 neg') + ' ' +
        'Level=W5',
      'Feign Death':
        OSRIC.SPELLS['Feign Death'].replace('M3', 'W3').replace('lvl+6', 'lvl*10+60') + ' ' +
        'Level=P3,W3',
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
        OSRIC.SPELLS['Fire Storm']
          .replace('150', '160')
          .replace('a %{lvl*20}', '%{lvl*2} 10') + ' ' +
        'Level=P7',
      'Fire Trap':
        'Level=P2,W4',
      'Fireball':
        OSRIC.SPELLS.Fireball
          .replace('100', '10')
          .replace('lvl}d6', 'lvl<?10}d6') + ' ' +
        'Level=W3',
      'Flame Arrow':
        'Level=W3 ' +
        'School=Conjuration ' +
        'Description="Touched arrows or bolts inflict +1 HP fire damage and disintegrate after 1 rd, or self casts %{lvl//5} R%{lvl*10+30}\' bolts that inflict 5d6 HP (Save half)"',
      'Flame Strike':
        'Level=P5',
      'Fly':
        OSRIC.SPELLS.Fly.replace('lvl*6', 'lvl').replace('120', '180') + ' ' +
        'Level=W3',
      'Fog Cloud':
        'Level=W2',
      'Forget':
        'Level=W2',
      'Friends':
        'Level=W1 ' +
        'Description="R60\' Self gains +2d4 Charisma for 1d4+%{lvl} rd"',
      'Fumble':
        OSRIC.SPELLS.Fumble
          .replace('Target falls and drops', "Creatures in 30' sq fall and drop") + ' ' +
        'Level=W4',
      'Gate':
        'Level=P7,W9',
      'Gaze Reflection':
        OSRIC.SPELLS['Gaze Reflection'].replace('1 rd', '%{lvl+2} rd') + ' ' +
        'Level=W1',
      'Geas':
        OSRIC.SPELLS.Geas.replace('Touched', "R10' Target") + ' ' +
        'Level=W6',
      'Glassee':
        'Level=W6',
      'Glassteel':
        'Level=W8',
      'Globe Of Invulnerability':
        'Level=W6',
      'Glyph Of Warding':
        OSRIC.SPELLS['Glyph Of Warding']
          .replace('*25', '').replace('{lvl*2}', '{lvl}d4') + ' ' +
        'Level=P3',
      'Guards And Wards':
        OSRIC.SPELLS['Guards And Wards']
          .replace('lvl*200', '400').replace('lvl*2', 'lvl') + ' ' +
        'Level=W6 ' +
        'School=Evocation',
      'Gust Of Wind':
        OSRIC.SPELLS['Gust Of Wind'].replace('seg', 'rd') + ' ' +
        'Level=W3',
      'Hallucinatory Forest':
        'Level=P4',
      'Hallucinatory Terrain':
        OSRIC.SPELLS['Hallucinatory Terrain']
          .replace('*10', '*30')
          .replace('until touched', 'for %{lvl} hr (Save disbelieve)') + ' ' +
        'Level=W4',
      'Haste':
        'Level=W3',
      'Heal':
        OSRIC.SPELLS.Heal.replace('all but 1d4', 'full') + ' ' +
        'Level=P6',
      'Heat Metal':
        'Level=P2',
      'Hold Animal':
        'Level=P3',
      'Hold Monster':
        'Level=W5',
      'Hold Person':
        'Level=P2,W3',
      'Hold Plant':
        'Level=P4',
      'Hold Portal':
        'Level=W1',
      'Holy Word':
        'Level=P7',
      'Hypnotic Pattern':
        OSRIC.SPELLS['Hypnotic Pattern']
          .replace('25', '24')
          .replace('conc', 'conc + 2 rd') + ' ' +
        'Level=W2',
      'Hypnotism':
        OSRIC.SPELLS.Hypnotism
          .replace('30', '5')
          .replace('creatures', "creatures in a 30' sq") + ' ' +
        'Level=W1',
      'Ice Storm':
        'Level=W4',
      'Identify':
        OSRIC.SPELLS.Identify.replace('5+15', '10<?90') + ' ' +
        'Level=W1 ' +
        'School="Lesser Divination"',
      'Illusionary Script':
        OSRIC.SPELLS['Illusory Script']
          .replace('inflicts confusion for 5d4 rd', 'inflicts <i>Suggestion</i>') + ' ' +
        'Level=W3',
      'Imprisonment':
        'Level=W9',
      'Improved Invisibility':
        'Level=W4',
      'Improved Phantasmal Force':
        OSRIC.SPELLS['Improved Phantasmal Force']
          .replace('10+40', '50+200') + ' ' +
        'Level=W2',
      'Incendiary Cloud':
        OSRIC.SPELLS['Incendiary Cloud']
          .replace('radius', 'sq')
          .replace('{lvl}', '{lvl}d4')
          .replaceAll('{lvl//2}', '{lvl}d2') + ' ' +
        'Level=W8',
      'Infravision':
        'Level=W3',
      'Insect Plague':
        OSRIC.SPELLS['Insect Plague'].replace('{lvl} tn', '{lvl*2} rd') + ' ' +
        'Level=P5',
      'Invisibility':
        'Level=W2',
      "Invisibility, 10' Radius":
        'Level=W3',
      'Invisibility To Animals':
        OSRIC.SPELLS['Invisibility To Animals']
          .replace('Touched', '%{lvl} touched') + ' ' +
        'Level=P1',
      'Invisible Stalker':
        'Level=W6',
      'Jump':
        OSRIC.SPELLS.Jump
          .replace(/%.*times/, '1/rd for 1d3+%{lvl} rd') + ' ' +
        'Level=W1',
      'Knock':
        'Level=W2 ' +
        'Description="R60\' Opens stuck or locked item (rev locks)"',
      'Know Alignment':
        'Description="R10\' Self discerns alignment aura of 1 target/%{slvl==\'W2\'?\'2 \':\'\'}rd for 1 tn (Reverse obscures)" ' +
        'Level=P2,W2 ' +
        'School="Lesser Divination"',
      'Legend Lore':
        'Level=W6 ' +
        'School="Greater Divination"',
      "Leomund's Secret Chest":
        'Level=W5',
      "Leomund's Tiny Hut":
        OSRIC.SPELLS['Tiny Hut']
          .replace('5', "7.5").replace('lvl', 'lvl+4') + ' ' +
        'Level=W3',
      "Leomund's Trap":
        'Level=W2',
      'Levitate':
        'Level=W2',
      'Light':
        OSRIC.SPELLS.Light.replaceAll('C1', 'P1') + ' ' +
        'Level=P1,W1',
      'Lightning Bolt':
        OSRIC.SPELLS['Lightning Bolt'].replace('{lvl}', '{lvl<?10}') + ' ' +
        'Level=W3',
      'Limited Wish':
        'Level=W7',
      'Locate Object':
        OSRIC.SPELLS['Locate Object']
          .replaceAll('C3', 'P3').replace('{lvl} rd', "{slvl!='P3'?lvl+' rd':'8 hr'}") + ' ' +

        'Level=P3,W2 ' +
        'School="Lesser Divination"',
      'Lower Water':
        OSRIC.SPELLS['Lower Water']
          .replaceAll('M6', 'W6').replace('5:10', '10:10') + ' ' +
        'Level=P4,W6',
      'Magic Jar':
        'School=Necromancy ' +
        'Level=W5',
      'Magic Missile':
        'Level=W1',
      'Magic Mouth':
        OSRIC.SPELLS['Magic Mouth'].replace('Touched', "R10' Target") + ' ' +
        'Level=W2',
      'Major Creation':
        OSRIC.SPELLS['Major Creation']
          .replace('%{lvl} hr', 'up to %{lvl*2} hr') + ' ' +
        'Level=W5 ' +
        'School=Illusion',
      'Mass Charm':
        'Level=W8',
      'Mass Invisibility':
        OSRIC.SPELLS['Mass Invisibility'].replace('30', '60') + ' ' +
        'Level=W7',
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
        OSRIC.SPELLS.Message
          .replace('60', '30').replace('{lvl+5} seg', '{lvl*5} rd') + ' ' +
        'Level=W1',
      'Meteor Swarm':
        'Level=W9',
      'Mind Blank':
        OSRIC.SPELLS['Mind Blank']
          .replace('divination', 'divination and mental control') + ' ' +
        'Level=W8',
      'Minor Creation':
        'Level=W4 ' +
        'School=Illusion',
      'Minor Globe Of Invulnerability':
        'Level=W4',
      'Mirror Image':
        OSRIC.SPELLS['Mirror Image']
          .replace(/1d4.*copies/, '2d4 copies') + ' ' +
        'Level=W2',
      'Misdirection':
        OSRIC.SPELLS.Misdirection.replace('%{lvl} rd', '8 hr') + ' ' +
        'Level=W2',
      'Monster Summoning I':
        'Level=W3',
      'Monster Summoning II':
        'Level=W4',
      'Monster Summoning III':
        'Level=W5',
      'Monster Summoning IV':
        'Level=W6',
      'Monster Summoning V':
        OSRIC.SPELLS['Monster Summoning V'].replace('1d2', '1d3') + ' ' +
        'Level=W7',
      'Monster Summoning VI':
        OSRIC.SPELLS['Monster Summoning VI'].replace('1d2', '1d3') + ' ' +
        'Level=W8',
      'Monster Summoning VII':
        'Level=W9',
      "Mordenkainen's Faithful Hound":
        OSRIC.SPELLS["Mage's Faithful Hound"]
          .replace('{lvl*2} rd', '{1+lvl/2} hr') + ' ' +
        'Level=W5',
      "Mordenkainen's Sword":
        'Level=W7',
      'Move Earth':
        OSRIC.SPELLS['Move Earth'].replace("40' cu", "40'x40'x10'") + ' ' +
        'Level=W6',
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
        OSRIC.SPELLS['Part Water']
          .replaceAll('M6', 'W6')
          .replace("20'x%{lvl*30}'x3'", "%{lvl*3}'x%{slvl=='W6'?lvl*30:(lvl*20)}'x%{slvl=='W6'?20:30}'") + ' ' +
        'Level=P6,W6',
      'Pass Plant':
        'Level=P5',
      'Pass Without Trace':
        'Level=P1',
      'Passwall':
        'Level=W5',
      'Permanency':
        'Level=W8',
      'Permanent Illusion':
        OSRIC.SPELLS['Permanent Illusion']
          .replace('30', '%{lvl*10}').replace('40', '20') + ' ' +
        'Level=W6',
      'Phantasmal Force':
        OSRIC.SPELLS['Phantasmal Force'].replace('40', '20') + ' ' +
        'Level=W1',
      'Phantasmal Killer':
        'Level=W4',
      'Phase Door':
        'Level=W7',
      'Plane Shift':
        OSRIC.SPELLS['Plane Shift']
          .replace('Self plus 7 touched', 'Touched plus 7 touching') + ' ' +
        'Level=P5',
      'Plant Door':
        'Level=P4',
      'Plant Growth':
        OSRIC.SPELLS['Plant Growth'].replaceAll('M4', 'W4') + ' ' +
        'Level=P3,W4',
      'Polymorph Any Object':
        'Level=W8',
      'Polymorph Other':
        'Level=W4',
      'Polymorph Self':
        'Level=W4',
      'Power Word, Blind':
        OSRIC.SPELLS['Power Word, Blind']
          .replace(' or 1d4+1 tn', ', 1d4+1 tn, or permanently') + ' ' +
        'Level=W8',
      'Power Word, Kill':
        'Level=W9',
      'Power Word, Stun':
        'Level=W7',
      'Prayer':
        'Level=P3',
      'Prismatic Sphere':
        'Level=W9',
      'Prismatic Spray':
        'Level=W7 ' +
        'School=Conjuration',
      'Prismatic Wall':
        OSRIC.SPELLS['Prismatic Wall']
          .replace('40', '4').replace('20', '2') + ' ' +
        'Level=W8 ' +
        'School=Conjuration',
      'Produce Fire':
        'Level=P4',
      'Produce Flame':
        OSRIC.SPELLS['Produce Flame'].replace('lvl*2', 'lvl') + ' ' +
        'Level=P2',
      'Programmed Illusion':
        OSRIC.SPELLS['Programmed Illusion'].replace('40', '20') + ' ' +
        'Level=W6',
      'Project Image':
        'Level=W6',
      'Protection From Evil':
        OSRIC.SPELLS['Protection From Evil'].replaceAll('M1', 'W1') + ' ' +
        'Level=P1,W1',
      "Protection From Evil, 10' Radius":
        OSRIC.SPELLS["Protection From Evil, 10' Radius"]
          .replaceAll('M3', 'W3') + ' ' +
        'Level=P4,W3',
      'Protection From Fire':
        'Level=P3',
      'Protection From Lightning':
        'Level=P4',
      'Protection From Normal Missiles':
        'Level=W3',
      'Purify Food And Drink':
        'Level=P1',
      'Pyrotechnics':
        OSRIC.SPELLS.Pyrotechnics.replaceAll('M2', 'W2') + ' ' +
        'Level=P3,W2',
      'Quest':
        'Level=P5',
      'Raise Dead':
        'Level=P5',
      "Rary's Mnemonic Enhancer":
        'Level=W4',
      'Ray Of Enfeeblement':
        OSRIC.SPELLS['Ray Of Enfeeblement'].replace('3', '5') + ' ' +
        'Level=W2',
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
        OSRIC.SPELLS['Remove Fear']
          .replace('Touched', "R10\' %{lvl//4+1} targets") + ' ' +
        'Level=P1',
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
        OSRIC.SPELLS['Reverse Gravity'].replace('1 sec', '%{lvl} rd') + ' ' +
        'Level=W7',
      'Rope Trick':
        OSRIC.SPELLS['Rope Trick'].replace('6', '8') + ' ' +
        'Level=W2',
      'Sanctuary':
        OSRIC.SPELLS.Sanctuary.replace('self', 'touched') + ' ' +
        'Level=P1',
      'Scare':
        OSRIC.SPELLS.Scare
          .replace('R10', 'R%{lvl*10+30}')
          .replace('Target', "Creatures in a 15' radius")
          .replace('becomes', 'become')
          .replace('3d4 rd', '1d4+%{lvl} rd') + ' ' +
        'Level=W2',
      "Serten's Spell Immunity":
        'Level=W8',
      'Shades':
        'Level=W6',
      'Shadow Door':
        'Level=W5',
      'Shadow Magic':
        'Level=W5 ' +
        'Description="R%{lvl*10+50}\' Mimics a level 1-3 Evocation spell"',
      'Shadow Monsters':
        'Level=W4',
      'Shape Change':
        'Level=W9',
      'Shatter':
        OSRIC.SPELLS.Shatter.replace('60', '%{lvl*10+30}') + ' ' +
        'Level=W2',
      'Shield':
        'Level=W1',
      'Shillelagh':
        OSRIC.SPELLS.Shillelagh.replace('{lvl} rd', '{lvl+4} rd') + ' ' +
        'Level=P1',
      'Shocking Grasp':
        'Level=W1',
      "Silence, 15' Radius":
        'Level=P2',
      'Simulacrum':
        'Level=W7',
      'Sleep':
        OSRIC.SPELLS.Sleep.replace('%{lvl*10+30}', '30') + ' ' +
        'Level=W1',
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
        OSRIC.SPELLS['Speak With Monsters']
          .replace('{lvl} rd', '{lvl*2} rd') + ' ' +
        'Level=P6',
      'Speak With Plants':
        'Level=P4',
      'Spectral Force':
        OSRIC.SPELLS['Spectral Force'].replace('lvl*10+60', 'lvl+60') + ' ' +
        'Level=W3',
      'Spider Climb':
        OSRIC.SPELLS['Spider Climb'].replace('lvl+1', 'lvl+3') + ' ' +
        'Level=W1',
      'Spiritual Hammer':
        OSRIC.SPELLS['Spiritual Weapon']
          .replace('30', '%{lvl*10}').replace('{lvl}', '{3+lvl}') + ' ' +
        'Level=P2',
      'Statue':
        'Level=W7',
      'Sticks To Snakes':
        'Level=P4',
      'Stinking Cloud':
        'Level=W2',
      'Stone Shape':
        OSRIC.SPELLS['Stone Shape']
          .replaceAll('D3', 'P3').replace('3:0', '9:0') + ' ' +
        'Level=P3,W5',
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
        'Level=W5',
      'Symbol':
        'Level=P7,W8',
      'Symbol P7':
        'Description=' +
          '"Glowing symbol causes hopelessness, pain, or persuasion for %{lvl} tn"',
      'Telekinesis':
        'Level=W5',
      'Teleport':
        'Level=W5',
      'Temporal Stasis':
        'Level=W9',
      "Tenser's Floating Disc":
        'Level=W1',
      "Tenser's Transformation":
        'Level=W6',
      'Time Stop':
        OSRIC.SPELLS['Time Stop'].replace("1d8+%{lvl//2} seg", '1d3 rd') + ' ' +
        'Level=W9',
      'Tongues':
        OSRIC.SPELLS.Tongues.replaceAll('M3', 'W3') + ' ' +
        'Level=P4,W3',
      'Trap The Soul':
        'Level=W8',
      'Transmute Metal To Wood':
        OSRIC.SPELLS['Transmute Metal To Wood']
          .replace('lvl*8', 'lvl*10') + ' ' +
        'Level=P7',
      'Transmute Rock To Mud':
        OSRIC.SPELLS['Transmute Rock To Mud'].replaceAll('M5', 'W5') + ' ' +
        'Level=P5,W5',
      'Transport Via Plants':
        'Level=P6',
      'Tree':
        'Level=P3',
      'Trip':
        'Level=P2',
      'True Seeing':
        OSRIC.SPELLS['True Seeing']
          .replace(' and alignment auras', "%{slvl=='P5'?' and alignment auras':''}")
          .replace('120', "%{slvl=='P5'?120:60}") + ' ' +
        'Level=P5,W6 ' +
        'School="Greater Divination"',
      'Turn Wood':
        OSRIC.SPELLS['Turn Wood'].replace('{lvl*4}', '{lvl}') + ' ' +
        'Level=P6',
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
      'Wall Of Fire':
        OSRIC.SPELLS['Wall Of Fire'].replaceAll('M4', 'W4') + ' ' +
        'Level=P5,W4',
      'Wall Of Fire P5':
        'School=Conjuration',
      'Wall Of Fog':
        OSRIC.SPELLS['Wall Of Fog'].replace('lvl*20', 'lvl*10+20') + ' ' +
        'Level=W1 ' +
        'School=Evocation',
      'Wall Of Force':
        OSRIC.SPELLS['Wall Of Force'].replace('lvl*20', 'lvl*10') + ' ' +
        'Level=W5 ' +
        'Effect="%{lvl*10}\' sq"',
      'Wall Of Ice':
        'Level=W4',
      'Wall Of Iron':
        'Level=W5',
      'Wall Of Stone':
        'Level=W5',
      'Wall Of Thorns':
        OSRIC.SPELLS['Wall Of Thorns'].replace('lvl*100', 'lvl*10') + ' ' +
        'Level=P6',
      'Warp Wood':
        'Level=P2',
      'Water Breathing':
        OSRIC.SPELLS['Water Breathing'].replace("+(slvl=='M3'?' rd':' hr')", "+' hr'+(slvl=='W3'?'+1d4 rd':'')") + ' ' +
        'Level=P3,W3',
      'Weather Summoning':
        'Level=P6',
      'Web':
        OSRIC.SPELLS.Web.replace('80', '8000') + ' ' +
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
        'Description=' +
          '"R10\' Returns an outsider to its home plane (50%+HD difference chance)"',
      'Advanced Illusion':
        'Level=W5 ' +
        'School=Illusion ' +
        'Description=' +
          '"R%{lvl*10+60}\' Creates a %{lvl*10+40}\' sq sight, sound, smell, and temperature moving illusion for %{lvl} rd (Save disbelieve)"',
      'Aid':
        'Level=P2 ' +
        'School=Necromancy ' +
        'Description=' +
          '"Touched gains +1 attack and damage and +1d8 temporary HP for %{lvl+1} rd"',
      'Air Walk':
        'Level=P5 ' +
        'School=Alteration ' +
        'Description="Touched may walk on air for %{lvl+6} tn"',
      'Alarm':
        'Level=W1 ' +
        'School=Abjuration ' +
        'Description=' +
          '"R10\' Entry into a 20\' cu triggers an audible alarm for %{4+lvl*0.5} hr"',
      'Alter Self':
        'Level=W2 ' +
        'School=Alteration ' +
        'Description=' +
          '"Self may take on a different humanoid form for 3d4+%{lvl*2} rd"',
      'Armor':
        'Level=W1 ' +
        'School=Conjuration ' +
        'Description="Touched gains Armor Class 6 for %{lvl+8} HP"',
      'Avoidance':
        'Level=W5 ' +
        'School=Abjuration ' +
        'Description="R10\' 3\' cu repels all creatures other than self"',
      'Banishment':
        'Level=W7 ' +
        'School=Abjuration ' +
        'Description=' +
          '"R20\' Banishes extraplanar creatures totaling %{lvl*2} HD from plane (Save neg)"',
      'Bind':
        'Level=W2 ' +
        'School=Enchantment ' +
        'Description=' +
          '"R30\' Causes a %{lvl*5+50}\' rope-like item to entangle or trip target (Save neg) for %{lvl} rd"',
      'Binding':
        'Level=W8 ' +
        'School=Enchantment ' +
        'Description="R10\' Magically imprisons target (Save neg)"',
      'Cantrip':
        'Level=W1 ' +
        'School=All ' +
        'Description=' +
          '"R10\' Self may perform minor magical effects for %{lvl} hr"',
      'Changestaff':
        'Level=P7 ' +
        'School=Evocation ' +
        'Description=' +
          '"Touched staff becomes a treant (12 HD, 40 HP, Armor Class 0)"',
      'Chain Lightning':
        'Level=W6 ' +
        'School=Evocation ' +
        'Description=' +
          '"R%{lvl*5+40}\' Inflicts %{lvl<?12}d6 HP down to 1d6 HP on %{lvl} targets (Save half)"',
      'Chill Touch':
        'Level=W1 ' +
        'School=Necromancy ' +
        'Description=' +
          '"Touched living suffer 1d4 HP and -1 Str (Save neg), or undead flee for 1d4+%{lvl} rd, for %{lvl+3} rd"',
      'Cloak Of Bravery':
        'Level=P4 ' +
        'School=Conjuration ' +
        'Description=' +
          '"1-4 touched gain +4-+1 on next save vs. fear (Reverse touched radiates a 3\' fear aura) for 8 hr"',
      'Combine':
        'Level=P1 ' +
        'School=Evocation ' +
        'Description=' +
          '"2-4 assistants give self +2-+4 effective level for spellcasting and turning"',
      'Contagion':
        'Level=W4 ' +
        'School=Necromancy ' +
        'Description=' +
          '"R30\' Target suffers a disease that inflicts -2 Strength, Dexterity, Charisma, and attack (Save neg)"',
      'Contingency':
        'Level=W6 ' +
        'School=Evocation ' +
        'Description=' +
          '"Sets a trigger for a level %{lvl//3<?6} self spell for %{lvl} dy"',
      'Control Undead':
        'Level=W7 ' +
        'School=Necromancy ' +
        'Description=' +
          '"R20\' 1d6 undead targets totaling %{lvl} HD obey self for 3d4+%{lvl} rd (Save 3 HD neg)"',
      'Crystalbrittle':
        'Level=W9 ' +
        'School=Alteration ' +
        'Description="Touched %{lvl*2}\' cu of metal becomes fragile"',
      'Cure Blindness Or Deafness':
        'Level=P3 ' +
        'School=Abjuration ' +
        'Description=' +
          '"Touched recovers from blindness or deafness (Reverse inflicts, Save neg)"',
      'Death Fog':
        'Level=W6 ' +
        'School=Alteration ' +
        'Description=' +
          '"R30\' %{lvl*2}x10\' cu fog kills plants; animals suffer 1, 2, 4, 8 HP for 1d4+%{lvl} rd"',
      'Deeppockets':
        'Level=W2 ' +
        'School=Alteration ' +
        'Description=' +
          '"Touched garment carries 100 lbs comfortably for %{lvl+12} hr"',
      'Delude':
        'Level=W3 ' +
        'School=Alteration ' +
        'Description=' +
          '"R30\' Self aura shows alignment of chosen creature for %{lvl} tn"',
      'Demand':
        'Level=W8 ' +
        'School=Evocation ' +
        'Description=' +
          '"Allows self to send a 25-word message w/a <i>Suggestion</i> to a target (Save -2 neg)"',
      'Detect Poison':
        'Level=P1 ' +
        'School="Lesser Divination" ' +
        'Description=' +
          '"Self discerns poison in 1 target/rd, w/a %{lvl*5}% chance to know the type, for %{lvl+10} rd"',
      'Detect Scrying':
        'Level=W4 ' +
        'School="Lesser Divination" ' +
        'Description="R120\' Self discerns scrying for 1d6+%{lvl} tn"',
      'Detect Undead':
        'Level=W1 ' +
        'School="Lesser Divination" ' +
        'Description=' +
          '"Self discerns undead in a 60\'x%{lvl*10}\' area for 3 tn"',
      'Dismissal':
        'Level=W5 ' +
        'School=Abjuration ' +
        'Description=' +
          '"R10\' Returns an outsider to its home plane (Save +HD difference neg)"',
      'Domination':
        'Level=W5 ' +
        'School=Enchantment ' +
        'Description="R%{lvl*10}\' Target obeys self thoughts (Save ends)"',
      'Dream':
        'Level=W5 ' +
        'School=Illusion ' +
        'Description="Allows touched to send a message to a sleeping target"',
      'Dust Devil':
        'Level=P2 ' +
        'School=Conjuration ' +
        'Description=' +
          '"R30\' Creates a minor air elemental (Armor Class 4, 2 HD, inflicts 1d4 HP) that attacks for %{lvl*2} rd"',
      'Endure Cold':
        'Level=P1 ' +
        'School=Alteration ' +
        'Description="Touched remains comfortable to -30F for %{lvl*1.5} hr"',
      'Endure Heat':
        'Level=P1 ' +
        'School=Alteration ' +
        'Description="Touched remains comfortable to 130F for %{lvl*1.5} hr"',
      'Energy Drain':
        'Level=W9 ' +
        'School=Evocation ' +
        'Description="Touched suffers -2 levels or HD"',
      'Enervation':
        'Level=W4 ' +
        'School=Necromancy ' +
        'Description=' +
          '"R%{lvl*10}\' Target suffers -%{lvl//4} levels for 1d4+%{lvl} hr (Save neg)"',
      'Ensnarement':
        'Level=W6 ' +
        'School=Conjuration ' +
        'Description="R10\' Entraps an extra-planar creature"',
      'Enthrall':
        'Level=P2 ' +
        'School=Enchantment ' +
        'Description=' +
          '"R90\' Captivates listeners w/up to 3 HD for conc up to 1 hr (Save neg)"',
      "Evard's Black Tentacles":
        'Level=W4 ' +
        'School=Conjuration ' +
        'Description=' +
          '"R30\' Tentacles (Armor Class 4, %{lvl} HP) in a %{lvl*30}\' sq attack and inflict 2d4-3d4 HP/rd for %{lvl} hr (Save suffer 1d4 HP)"',
      'Exaction':
        'Level=P7 ' +
        'School=Evocation ' +
        'Description="R10\' Demands service of extra-planar creature"',
      'Eyebite':
        'Level=W6 ' +
        'School=Enchantment ' +
        'Description=' +
          '"R20\' Gives self a charm, fear, sicken, or sleep gaze attack for %{lvl//3} rd"',
      'Fabricate':
        'Level=W5 ' +
        'School=Enchantment ' +
        'Description=' +
          '"R%{lvl*5}\' Creates %{lvl*3}\' cu of finished items from raw materials"',
      'False Vision':
        'Level=W5 ' +
        'School="Greater Divination" ' +
        'Description=' +
          '"Scrying of a 30\' radius shows an illusion for 1d4+%{lvl} rd"',
      'Flame Blade':
        'Level=P2 ' +
        'School=Evocation ' +
        'Description=' +
          '"Self may attack w/a flaming scimitar (inflicts 1d4+4 HP, +2 vs. vulnerable or undead) for %{lvl//2+4} rd"',
      'Flame Walk':
        'Level=P3 ' +
        'School=Alteration ' +
        'Description=' +
          '"Gives %{lvl//5+1} touched immunity to non-magical fire and +2 saves and half dmg from magical fire for %{lvl+1} rd"',
      'Flaming Sphere':
        'Level=W2 ' +
        'School=Evocation ' +
        'Description=' +
          '"R10\' 3\' radius sphere inflicts 2d4 HP (Save neg) and moves 30\'/rd for %{lvl} rd"',
      'Forbiddance':
        'Level=P6 ' +
        'School=Abjuration ' +
        'Description=' +
          '"R30\' %{lvl*60}\' cu limits magical entry based on alignment and a password"',
      'Forcecage':
        'Level=W7 ' +
        'School=Evocation ' +
        'Description=' +
          '"R%{lvl*5}\' Creates a 20\' cu cage w/1/2\\"-spaced bars for %{lvl+6} tn"',
      'Foresight':
        'Level=W9 ' +
        'School="Greater Divination" ' +
        'Description=' +
          '"Gives self advance warning of harm to self or another for 2d4+%{lvl} rd"',
      'Free Action':
        'Level=P4 ' +
        'School=Abjuration ' +
        'Description="Touched may move freely for %{lvl} tn"',
      'Giant Insect':
        'Level=P4 ' +
        'School=Alteration ' +
        'Description=' +
          '"R20\' Transforms 1-6 insects into %{lvl<10?3:lvl<13?4:6} HD giant versions"',
      'Glitterdust':
        'Level=W2 ' +
        'School=Conjuration ' +
        'Description=' +
          '"R10\' Illuminates and blinds for 1d4+1 rd (Save neg) creatures in a 20\' cu for 1d4+%{lvl} rd"',
      'Grease':
        'Level=W1 ' +
        'School=Conjuration ' +
        'Description=' +
          '"R10\' 10\' sq becomes slippery, causing falls (Save neg), for %{lvl+3} rd"',
      'Goodberry':
        'Level=P2 ' +
        'School=Alteration ' +
        'Description=' +
          '"Each of 2d4 target berries provide a full meal and heal 1 HP (Reverse inflict 1 HP poison) for %{lvl+1} day"',
      "Heroes' Feast":
        'Level=P6 ' +
        'School=Evocation ' +
        'Description=' +
          '"R10\' Creates food for %{lvl} creatures that cures disease, heals 1d4+4 HP, gives +1 attack, and gives immunity to poison and fear for 12 hr"',
      'Hold Undead':
        'Level=W3 ' +
        'School=Necromancy ' +
        'Description=' +
          '"R60\' Immobilizes 1-3 undead targets totaling %{lvl} HD (Save neg) for 1d4+%{lvl} rd"',
      'Illusionary Wall':
        'Level=W4 ' +
        'School=Illusion ' +
        'Description="R30\' Creates a false 10\' sq wall, floor, or ceiling"',
      'Imbue With Spell Ability':
        'Level=P4 ' +
        'School=Enchantment ' +
        'Description=' +
          '"Transfers divination or healing spellcasting to touched level 1-2 (1 level 1 spell), level 3-4 (2 level 1 spells) or level 5+ (2 level 1 and 1 level 2 spells) non-caster"',
      'Invisibility To Undead':
        'Level=P1 ' +
        'School=Abjuration ' +
        'Description=' +
          '"Touched cannot be detected by undead (Save 5 HD neg) for 6 rd"',
      'Irritation':
        'Level=W2 ' +
        'School=Alteration ' +
        'Description=' +
          '"R%{lvl*10}\' 1-4 targets in a 15\' radius itch (suffer +4 Armor Class and -2 attack) for 3 rd or develop a rash (suffer -1 Charisma/dy) for 4 dy (Save neg)"',
      'Item':
        'Level=W3 ' +
        'School=Alteration ' +
        'Description=' +
          '"Transforms touched %{lvl*2}\' cu item into a 1/12 size cloth for %{lvl*4} hr"',
      "Leomund's Lamentable Belaborment":
        'Level=W5 ' +
        'School=Enchantment ' +
        'Description=' +
          '"R10\' Targets in a 10\' radius become absorbed in conversation for 3-6 rd (Save neg; fail on rd 3 wander away, fail on rd 6 rage attack for 1d4+1 rd)"',
      "Leomund's Secure Shelter":
        'Level=W4 ' +
        'School=Alteration ' +
        'Description=' +
          '"R20\' Creates a %{lvl*30}\' sq shelter that lasts 1d4+%{lvl+1} hr"',
      'Liveoak':
        'Level=P6 ' +
        'School=Enchantment ' +
        'Description=' +
          '"Animates an oak tree (Small 7-8 HD and 2d8 damage; Medium 9-10 HD and 3d6 dmg; Large 11-12 HD and 4d6 dmg) to guard based on a %{lvl}-word command for %{lvl} dy"',
      'Locate Animals Or Plants':
        'Level=P1 ' +
        'School="Lesser Divination" ' +
        'Description=' +
          '"R%{lvl*20+100}\' Self discerns presence of chosen animal or plant type in a 20\' path for %{lvl} rd"',
      "Mordenkainen's Lucubration":
        'Level=W6 ' +
        'School=Alteration ' +
        'Description=' +
          '"Allows self to recall a spell of up to 5th level cast during the past day"',
      'Magic Font':
        'Level=P5 ' +
        'School="Greater Divination" ' +
        'Description=' +
          '"Allows self to scry via a touched holy water font for 1 hr/vial"',
      'Magic Mirror':
        'Level=W4 ' +
        'School=Enchantment ' +
        'Description="Touched mirror becomes a scrying device for %{lvl} rd"',
      'Magical Stone':
        'Level=P1 ' +
        'School=Enchantment ' +
        'Description=' +
          '"3 touched pebbles become magical and may be hurled to inflict 1d4 HP (2d4 HP vs. undead) for 30 min"',
      'Magical Vestment':
        'Level=P3 ' +
        'School=Enchantment ' +
        'Description=' +
          '"Touched vestment gives Armor Class %{7-(lvl+1)//3} for %{lvl*5} rd"',
      'Meld Into Stone':
        'Level=P3 ' +
        'School=Alteration ' +
        'Description="Self may pass into stone for 1d8+8 rd"',
      "Melf's Acid Arrow":
        'Level=W2 ' +
        'School=Conjuration ' +
        'Description="R180\' Inflicts 2d4 HP/rd for %{lvl//3+1} rd"',
      "Melf's Minute Meteors":
        'Level=W3 ' +
        'School=Evocation ' +
        'Description="R%{lvl*10+70}\' %{lvl} +2 ranged attacks inflict 1d4 HP each"',
      'Messenger':
        'Level=P2 ' +
        'School=Enchantment ' +
        'Description=' +
          '"R%{lvl*20}\' Tiny animal target goes to a specified place for %{lvl} dy"',
      'Mirage Arcana':
        'Level=W6 ' +
        'School=Illusion ' +
        'Description=' +
          '"R%{lvl*10}\' Creates a %{lvl*10}\' radius terrain or structure illusion for conc + %{lvl+6} tn"',
      'Mislead':
        'Level=W6 ' +
        'School=Illusion ' +
        'Description=' +
          '"R10\' Makes self invisible for %{lvl} rd and creates a false double for %{lvl} rd"',
      'Moonbeam':
        'Level=P5 ' +
        'School=Evocation ' +
        'Description=' +
          '"R%{lvl*10+60}\' 5\' radius shines with moonlight for %{lvl} rd"',
      "Mordenkainen's Disjunction":
        'Level=W9 ' +
        'School=Alteration ' +
        'Description=' +
          '"30\' radius dispels spells, disenchants magic items, and has a %{lvl}% chance to disenchant artifacts or destroy an antimagic field"',
      "Mordenkainen's Magnificent Mansion":
        'Level=W7 ' +
        'School=Alteration ' +
        'Description=' +
          '"R10\' Creates a door to an extradimensional mansion for %{lvl} hr"',
      'Mount':
        'Level=W1 ' +
        'School=Conjuration ' +
        'Description="R10\' Summons a riding horse for %{lvl+2} hr"',
      'Negative Plane Protection':
        'Level=P3 ' +
        'School=Abjuration ' +
        'Description=' +
          '"Touched gains a save vs. death magic on next draining attack"',
      "Otiluke's Resilient Sphere":
        'Level=W4 ' +
        'School=Alteration ' +
        'Description=' +
          '"R20\' Impassible %{lvl}\'-diameter sphere surrounds target for %{lvl} rd (Save neg)"',
      "Otiluke's Telekinetic Sphere":
        'Level=W8 ' +
        'School=Evocation ' +
        'Description=' +
          '"R20\' Impassible %{lvl}\'-diameter sphere surrounds target and causes weightlessness for %{lvl*2} rd (Save neg)"',
      'Phantom Steed':
        'Level=W3 ' +
        'School=Conjuration ' +
        'Description=' +
          '"Creates a mount (%{lvl+7} HP, Armor Class 2, move %{lvl*4<?48}\') that only touched can ride for %{lvl} hr"',
      'Protection From Cantrips':
        'Level=W2 ' +
        'School=Abjuration ' +
        'Description="Touched gains immunity to cantrips for %{lvl+5} hr"',
      'Rainbow':
        'Level=P5 ' +
        'School=Evocation ' +
        'Description=' +
          '"R120\' Creates a magical +2 bow or a 1x120 yd bridge for %{lvl} rd"',
      'Rainbow Pattern':
        'Level=W4 ' +
        'School=Alteration ' +
        'Description=' +
          '"R10\' Fascinates 24 HD of creatures in a 30\' cu for conc (Save neg)"',
      'Reflecting Pool':
        'Level=P4 ' +
        'School="Lesser Divination" ' +
        'Description="R10\' Self may use a pool to scry for %{lvl} rd"',
      'Remove Paralysis':
        'Level=P3 ' +
        'School=Abjuration ' +
        'Description=' +
          '"R%{lvl*10}\' Gives 1d4 paralyzed targets in a 20\' cu an extra save"',
      'Screen':
        'Level=W8 ' +
        'School="Greater Divination" ' +
        'Description=' +
          '"Illusion hides a 30\' cu from vision and scrying for %{lvl} hr"',
      'Secret Page':
        'Level=W3 ' +
        'School=Alteration ' +
        'Description="Permanently hides the content of touched page"',
      'Seeming':
        'Level=W5 ' +
        'School=Illusion ' +
        'Description="R10\' Changes appearance of %{lvl//2} targets for 12 hr"',
      'Sending':
        'Level=W5 ' +
        'School=Evocation ' +
        'Description=' +
          '"Self may have a two-way, 25-word exchange w/a familiar target"',
      'Sepia Snake Sigil':
        'Level=W3 ' +
        'School=Conjuration ' +
        'Description="Safely immobilizes reader for 1d4+%{lvl} dy"',
      'Sequester':
        'Level=W7 ' +
        'School=Illusion ' +
        'Description=' +
          '"Touched becomes invisible and unscryable for %{lvl+7} dy (Save neg)"',
      'Shadow Walk':
        'Level=W7 ' +
        'School=Illusion ' +
        'Description=' +
          '"Self and touched may move 7 miles/tn via the Demiplane of Shadow for %{lvl} hr"',
      'Shout':
        'Level=W4 ' +
        'School=Evocation ' +
        'Description=' +
          '"R30\' Cone inflicts 2d6 HP and deafness for 2d6 rd (Save half duration deafness only)"',
      'Sink':
        'Level=W8 ' +
        'School=Enchantment ' +
        'Description=' +
          '"R%{lvl*10}\' Target becomes embedded in the floor (Save neg)"',
      'Solid Fog':
        'Level=W4 ' +
        'School=Alteration ' +
        'Description=' +
          '"R30\' Fog in a %{lvl*10}\' cu slows and reduces vision to 2\' for 2d4+%{lvl} rd"',
      'Spell Immunity':
        'School=Abjuration ' +
        'Level=P4 ' +
        'Description=' +
          '"Touched gains immunity to specified spell for %{lvl} tn"',
      'Spike Growth':
        'Level=P3 ' +
        'School=Alteration ' +
        'Description=' +
          '"R60\' Spikes on vegetation in a %{lvl*10}\' sq inflict 2d4 HP per 10\' movement and slow to half speed for 1 dy (Save neg) for 3d4+%{lvl} tn"',
      'Spike Stones':
        'Level=P5 ' +
        'School=Alteration ' +
        'Description=' +
          '"R30\' Sharp stones in a %{lvl*10}\' sq inflict 1d4 HP/rd for 3d4+%{lvl} tn"',
      'Spectral Hand':
        'Level=W2 ' +
        'School=Necromancy ' +
        'Description=' +
          '"R%{lvl*5+30} Self may use a glowing hand to deliver +2 touch attacks for %{lvl*2} rd"',
      'Spell Turning':
        'Level=W7 ' +
        'School=Abjuration ' +
        'Description=' +
          '"Reflects non-area, non-touch spells aimed at self onto caster for %{lvl*3} rd"',
      'Spook':
        'Level=W1 ' +
        'School=Illusion ' +
        'Description="R10\' Target flees from self (Save neg)"',
      'Starshine':
        'Level=P3 ' +
        'School=Evocation ' +
        'Description=' +
          '"R%{lvl*10}\' Creates soft illumination in %{lvl*10}\' sq for %{lvl} tn"',
      'Stoneskin':
        'Level=W4 ' +
        'School=Alteration ' +
        'Description="Touched gains immunity to next 1d4+%{lvl//2} blows"',
      'Succor':
        'Level=P7,W9 ' +
        'School=Alteration ' +
        'Description="Breaking a prepared item transports target to self home"',
      'Summon Swarm':
        'Level=W2 ' +
        'School=Conjuration ' +
        'Description=' +
          '"R60\' Calls vermin that inflict 1 HP/rd in a 10\' cu for conc + 2 rd"',
      'Sunray':
        'Level=P7 ' +
        'School=Evocation ' +
        'Description=' +
          '"R%{lvl*10}\' 5\' radius blinds for 1d3 rd and inflicts 8d6 HP on undead (3d6 within 20\') for 2-5 rd"',
      "Tasha's Uncontrollable Hideous Laughter":
        'Level=W2 ' +
        'School=Enchantment ' +
        'Description=' +
          '"R60\' %{lvl//3} targets in a 30\' cu suffer -2 attack and damage for %{lvl} rd"',
      'Taunt':
        'Level=W1 ' +
        'School=Enchantment ' +
        'Description="R60\' Targets in a 30\' radius attack caster"',
      'Teleport Without Error':
        OSRIC.SPELLS.Teleport + ' ' +
        'Level=W7',
      'Transmute Water To Dust':
        'Level=W6,P6 ' +
        'School=Alteration ' +
        'Description=' +
          '"R60\' Changes %{lvl*(slvl==\'P6\'?3:10)}\' cu of water into powder"',
      'Vacancy':
        'Level=W4 ' +
        'School=Illusion ' +
        'Description=' +
          '"R%{lvl*10}\' Causes a %{lvl*10}\' radius to appear abandoned for %{lvl} hr"',
      'Vampiric Touch':
        'Level=W3 ' +
        'School=Necromancy ' +
        'Description=' +
          '"Touched suffers %{lvl//2<?6}d6 HP, and self gains the same amount as temporary HP for 1 hr"',
      'Water Walk':
        'Level=P3 ' +
        'School=Alteration ' +
        'Description=' +
          '"%{(lvl-4)>?1} touched may walk on liquid for %{lvl+1} tn"',
      'Weird':
        'Level=W9 ' +
        'School=Illusion ' +
        'Description=' +
          '"R30\' Forces targets in a 20\' radius to fight illusionary nemeses to the death (Save become paralyzed 1 rd and suffer -1d4 Str for 1 tn)"',
      'Whispering Wind':
        'Level=W2 ' +
        'School=Alteration ' +
        'Description=' +
          '"R%{lvl} miles Self may send a 25-word message or a sound to a familiar location"',
      'Wind Wall':
        'Level=W3 ' +
        'School=Alteration ' +
        'Description=' +
          '"R%{lvl*10}\' %{lvl*10}\'x5\' curtain of air scatters objects and deflects arrows and bolts for %{lvl} rd"',
      'Withdraw':
        'Level=P2 ' +
        'School=Alteration ' +
        'Description=' +
          '"Gives self an extra %{lvl+1} rd to cast divination or self cure spells"',
      'Wizard Mark':
        'Level=W1 ' +
        'School=Alteration ' +
        'Description="Inscribes a permanent personal rune on touched"',
      'Wraithform':
        'Level=W3 ' +
        'School=Alteration ' +
        'Description=' +
          '"Makes self insubstantial and immune to non-magical weapons for %{lvl*2} rd"',
      'Wyvern Watch':
        'Level=P2 ' +
        'School=Evocation ' +
        'Description=' +
          '"R30\' Paralyzes the first trespasser in a 10\' radius for %{lvl} rd (Save neg)"'
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
      'Heavy Horse Lance':'Category=One-Handed Damage=d8+1',
      // New
      'Arquebus':'Category=Ranged Damage=d10 Range=50',
      'Awl Pike':'Category=Two-Handed Damage=d6',
      'Blowgun':'Category=Ranged Damage=d3 Range=10',
      "Footman's Pick":'Category=One-Handed Damage=d6+1',
      'Hand Crossbow':'Category=Ranged Damage=d3 Range=20',
      'Harpoon':'Category=Ranged Damage=2d4 Range=10',
      "Horseman's Pick":'Category=Light Damage=d4+1',
      'Knife':'Category=Light Damage=d3 Range=10',
      'Jousting Lance':'Category=One-Handed Damage=d3-1',
      'Hook Fauchard':'Category=Two-Handed Damage=d4',
      'Khopesh':'Category=One-Handed Damage=2d4',
      'Mancatcher':'Category=Two-Handed Damage=d0',
      'Quarterstaff':'Category=Two-Handed Damage=d6',
      'Scourge':'Category=One-Handed Damage=d4',
      'Sickle':'Category=One-Handed Damage=d4+1',
      'Staff Sling':'Category=Ranged Damage=d4+1 Range=30',
      'Warhammer':'Category=Light Damage=d4+1 Range=10',
      'Whip':'Category=One-Handed Damage=d2'
    },
  }
};

// Related information used internally by OldSchool
OldSchool.monkUnarmedDamage = [
  '0', '1d3', '1d4', '1d6', '1d6', '1d6+1', '2d4', '2d4+1', '2d6', '3d4',
  '2d6+1', '3d4+1', '4d4', '4d4+1', '5d4', '6d4', '5d6', '8d4'
];

/*
 * Uses the OldSchool.RULE_EDIT rules for #type# for edition #edition#
 * to modify the values in #base# and returns the result. Each value listed
 * in the edit rules can use = or +=,to indicate whether the new values
 * should replace or be added to the values in #base#.
 */
OldSchool.editedRules = function(edition, base, type) {
  let pluginVar = type.toUpperCase() + (type=='Class' ? 'ES' : 'S');
  if(window.UnearthedArcana1e != null &&
     edition == 'First Edition' &&
     UnearthedArcana1e[pluginVar] != null)
    base = Object.assign({}, base, UnearthedArcana1e[pluginVar]);
  let edits = OldSchool.RULE_EDITS[edition][type];
  if(!edits)
    return base;
  let result = Object.assign({}, base);
  for(let a in edits) {
    if(edits[a] == null)
      delete result[a];
    else if(!(a in base))
      result[a] = edits[a];
    else {
      let matchInfo = edits[a].match(/[A-Z]\w*[-+]?=/g);
      for(let i = 0; i < matchInfo.length; i++) {
        let op = matchInfo[i].match(/\W+$/)[0];
        let attr = matchInfo[i].replace(op, '');
        let values =
          // .replace allows getAttrValueArray work with +=
          QuilvynUtils.getAttrValueArray(edits[a].replace(/\+=/g, '='), attr);
        for(let j = 0; j < values.length; j++) {
          if(!(values[j] + '').match(/^[-+]?\d+$/))
            values[j] = '"' + values[j].replaceAll('"', '\\"') + '"';
        }
        let valuesText = values.join(',');
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
      'source <= 8 ? source * 5 - 45 : ' +
      'source <= 13 ? null : ' +
      'source <= 15 ? source * 10 - 135 : ' +
      'source == 25 ? 100 : ' +
      '(source * 10 - 140)'
  );
  rules.defineRule('maximumHenchmen',
    'charisma', '=',
      'source <= 10 ? Math.floor((source - 1) / 2) : ' +
      'source <= 12 ? source - 7 : ' +
      'source <= 16 ? source - 8 : ' +
      '((source - 15) * 5)'
  );
  rules.defineRule('abilityNotes.charismaReactionAdjustment',
    'charisma', '=',
      'source <= 7 ? (source * 5 - 40) : ' +
      'source <= 12 ? null : ' +
      'source <= 15 ? source * 5 - 60 : ' +
      '(source * 5 - 55)'
  );
  if(rules.edition == 'Second Edition') {
    // Expressed as mod to d20 instead of percentage
    rules.defineRule('abilityNotes.charismaLoyaltyAdjustment', '', '*', '0.2');
    rules.defineRule('abilityNotes.charismaReactionAdjustment', '', '*', '0.2');
  }

  // Constitution
  rules.defineRule('conHPAdjPerDie',
    'constitution', '=',
      'source <= 3 ? -2 : ' +
      'source <= 6 ? -1 : ' +
      'source <= 14 ? null : ' +
      'source <= 19 ? source - 14 : ' +
      '(Math.floor(source / 3) - 1)',
    'warriorLevel', 'v', 'source == 0 ? 2 : null'
  );
  if(rules.edition == 'Second Edition')
    rules.defineRule('saveNotes.constitutionPoisonSaveAdjustment',
      'constitution', '=',
        'source > 18 ? "+" + Math.floor((source - 17) / 2) : ' +
        'source < 3 ? source - 3 : null',
      'features.Resist Poison', '=', '0'
    );
  rules.defineRule('surviveResurrection',
    'constitution', '=',
      'source <= 13 ? source * 5 + 25 : ' +
      'source <= 18 ? source * 2 + 64 : 100'
  );
  rules.defineRule('surviveSystemShock',
    'constitution', '=',
      'source <= 13 ? source * 5 + 20 : ' +
      'source == 16 ? 95 : ' +
      (rules.edition == 'Second Edition' ? 'source == 15 ? 90 : ' : '') +
      'source <= 17 ? source * 3 + 46 : ' +
      'source == 25 ? 100 : 99'
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
    'source <= 18 ? 14 - source : (-Math.floor(source / 3) + 2)'
  );
  rules.defineRule('combatNotes.dexterityAttackAdjustment',
    'dexterity', '=',
      (rules.edition == 'Second Edition' ? 'source == 18 ? 2 : ' : '') +
      'source <= 5 ? (source - 6) : source <= 15 ? null : ' +
      'source <= 18 ? source - 15 : (Math.floor(source / 3) - 3)'
  );
  rules.defineRule('combatNotes.dexteritySurpriseAdjustment',
    'dexterity', '=',
      (rules.edition == 'Second Edition' ? 'source == 18 ? 2 : ' : '') +
      'source <= 5 ? (source - 6) : source <= 15 ? null : ' +
      'source <= 18 ? source - 15 : (Math.floor(source / 3) - 3)'
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
    ('skillNotes.dexteritySkillModifiers', 'hasSkills', '?', null);

  // Intelligence
  if(rules.edition == 'Second Edition') {
    rules.defineRule('skillNotes.intelligenceLanguageBonus',
      'intelligence', '=',
        'source < 9 ? 1 : ' +
        'source == 9 ? 2 : ' +
        'source <= 15 ? Math.floor((source - 6) / 2) : ' +
        'source <= 23 ? source - 11 : ' +
        'source == 24 ? 15 : 20'
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
    'strengthRow', '=',
      'source <= 2 ? source - 3 : ' +
      'source <= 7 ? 0 : ' +
      'source >= 19 ? source - 14 : ' +
      'Math.floor((source - 5) / 3)'
  );
  rules.defineRule('combatNotes.strengthDamageAdjustment',
    'strengthRow', '=',
      'source <= 1 ? -1 : ' +
      'source <= 6 ? 0 : ' +
      'source == 7 ? 1 : ' +
      'source == 21 ? 14 : ' +
      '(source - (source >= 11 ? 8 : 7))'
  );
  if(rules.edition == 'Second Edition') {
    rules.defineRule('loadLight',
      'strengthRow', '=', '[6, 11, 21, 36, 41, 46, 56, 71, 86, 111, 136, 161, 186, 236, 336, 486, 536, 636, 786, 936, 1236, 1536][source]'
    );
    rules.defineRule('loadMedium',
      'strengthRow', '=', '[7, 14, 30, 51, 59, 70, 86, 101, 122, 150, 175, 200, 225, 275, 375, 525, 575, 675, 825, 975, 1275, 1575][source]'
    );
    rules.defineRule('loadMax',
      'strengthRow', '=', '[8, 17, 39, 66, 77, 94, 116, 131, 158, 189, 214, 239, 264, 314, 414, 564, 614, 714, 864, 1014, 1314, 1614][source]'
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
    'strengthRow', '=',
      'source <= 2 ? 0 : ' +
      'source <= 5 ? Math.pow(2, source - 3) : ' +
      'source <= 9 ? source * 3 - 11 : ' +
      'source <= 14 ? source * 5 - 30 : ' +
      'source <= 19 ? source * 10 - 100 : ' +
      'source == 20 ? 95 : 99'
  );
  if(rules.edition == 'Second Edition') {
    rules.defineRule('strengthMinorTest',
      'strengthRow', '=',
        'source <= 14 ? source + 2 : (Math.floor(source / 2) + 9)'
    );
  } else {
    rules.defineRule('strengthMinorTest',
      'strengthRow', '=', 'source == 14 ? 5 : Math.floor((source + 5) / 4)'
    );
  }
  rules.defineRule('strengthRow',
    'strength', '=',
      'source >= 19 ? source - 4 : ' +
      'source >= 16 ? source - 9 : ' +
      'Math.floor((source - 2) / 2)',
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
      'source <= 5 ? source - 6 : ' +
      'source <= 7 ? -1 : ' +
      'source <= 14 ? null : ' +
      'Math.min(source - 14, 4)'
  );

  // Add items to the character sheet
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
  let strengthMinorDie = rules.edition == 'Second Edition' ? 20 : 6;
  rules.defineSheetElement
    ('Strength Minor Test', 'StrengthTests/',
     '<b>Strength Minor/Major Test</b>: %Vin' + strengthMinorDie);
  rules.defineSheetElement('Strength Major Test', 'StrengthTests/', '/%V%');
  rules.defineSheetElement('Maximum Henchmen', 'Alignment');
  rules.defineSheetElement('Survive System Shock', 'Save+', '<b>%N</b>: %V%');
  rules.defineSheetElement('Survive Resurrection', 'Save+', '<b>%N</b>: %V%');

};

/* Defines rules related to combat. */
OldSchool.combatRules = function(rules, armors, shields, weapons) {

  QuilvynUtils.checkAttrTable(armors, ['AC', 'Move', 'Weight', 'Skill']);
  QuilvynUtils.checkAttrTable(shields, ['AC', 'Weight']);
  QuilvynUtils.checkAttrTable(weapons, ['Category', 'Damage', 'Range']);

  for(let a in armors)
    rules.choiceRules(rules, 'Armor', a, armors[a]);
  for(let s in shields)
    rules.choiceRules(rules, 'Shield', s, shields[s]);
  for(let w in weapons) {
    let pattern = w.replace(/  */g, '\\s+');
    let prefix = w.charAt(0).toLowerCase() + w.substring(1).replaceAll(' ', '');
    rules.choiceRules(rules, 'Goody', w,
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
    rules.choiceRules(rules, 'Weapon', w, weapons[w]);
  }

  rules.defineRule
    ('armorClass', 'combatNotes.dexterityArmorClassAdjustment', '+', null);
  rules.defineRule('attacksPerRound', '', '=', '1');
  rules.defineRule('features.Weapon Specialization',
    'weaponSpecialization', '=', 'source == "None" ? null : source'
  );
  if(rules.edition == 'Second Edition') {
    rules.defineRule('combatNotes.weaponSpecialization.1',
      'weaponSpecialization', '=', 'source.indexOf("Crossbow") >= 0 ? -0.5 : 0',
      'levels.Fighter', '+', 'source < 7 ? 0.5 : source < 13 ? 1 : 1.5'
    );
    QuilvynRules.prerequisiteRules
      (rules, 'validation', 'weaponSpecialization',
       'combatNotes.weaponSpecialization', 'levels.Fighter >= 1');
  }
  rules.defineRule('thac0Melee',
    'thac10Base', '=', 'Math.min(source + 10, 20)',
    'combatNotes.strengthAttackAdjustment', '+', '-source'
  );
  rules.defineRule('thac0Ranged',
    'thac10Base', '=', 'Math.min(source + 10, 20)',
    'combatNotes.dexterityAttackAdjustment', '+', '-source'
  );
  rules.defineRule('thac10Melee',
    'thac10Base', '=', null,
    'combatNotes.strengthAttackAdjustment', '+', '-source'
  );
  rules.defineRule('thac10Ranged',
    'thac10Base', '=', null,
    'combatNotes.dexterityAttackAdjustment', '+', '-source'
  );
  if(rules.edition == 'Second Edition')
    rules.defineRule('turnUndeadColumn',
      'turningLevel', '=',
      'source <= 9 ? source - 1 : source <= 11 ? 9 : source <= 13 ? 10 : 11'
    );
  else
    rules.defineRule('turnUndeadColumn',
      'turningLevel', '=',
      'source <= 8 ? source - 1 : source <= 13 ? 8 : source <= 18 ? 9 : 10'
    );
  let turningTable = rules.edition == 'Second Edition' ? {
    'Skeleton':'10:7 :4 :T :T :D :D :D :D :D :D :D ',
    'Zombie'  :'13:10:7 :4 :T :T :D :D :D :D :D :D ',
    'Ghoul'   :'16:13:10:7 :4 :T :T :D :D :D :D :D ',
    'Shadow'  :'19:16:13:10:7 :4 :T :T :D :D :D :D ',
    'Wight'   :'20:19:16:13:10:7 :4 :T :T :D :D :D ',
    'Ghast'   :'- :20:19:16:13:10:7 :4 :T :T :D :D ',
    'Wraith'  :'- :- :20:19:16:13:10:7 :4 :T :T :D ',
    'Mummy'   :'- :- :- :20:19:16:13:10:7 :4 :T :T ',
    'Spectre' :'- :- :- :- :20:19:16:13:10:7 :4 :T ',
    'Vampire' :'- :- :- :- :- :20:19:16:13:10:7 :4 ',
    'Ghost'   :'- :- :- :- :- :- :20:19:16:13:10:7 ',
    'Lich'    :'- :- :- :- :- :- :- :20:19:16:13:10',
    'Fiend'   :'- :- :- :- :- :- :- :- :20:19:16:13'
  } : {
    'Skeleton':'10:7 :4 :T :T :D :D :D :D :D :D',
    'Zombie'  :'13:10:7 :T :T :D :D :D :D :D :D',
    'Ghoul'   :'16:13:10:4 :T :T :D :D :D :D :D',
    'Shadow'  :'19:16:13:7 :4 :T :T :D :D :D :D',
    'Wight'   :'20:19:16:10:7 :4 :T :T :D :D :D',
    'Ghast'   :'- :20:19:13:10:7 :4 :T :T :D :D',
    'wraith'  :'- :- :20:16:13:10:7 :4 :T :D :D',
    'Mummy'   :'- :- :- :20:16:13:10:7 :4 :T :T',
    'Spectre' :'- :- :- :- :20:16:13:10:7 :T :T',
    'Vampire' :'- :- :- :- :- :20:16:13:10:4 :4',
    'Ghost'   :'- :- :- :- :- :- :20:16:13:7 :7',
    'Lich'    :'- :- :- :- :- :- :- :19:16:10:10',
    'Fiend'   :'- :- :- :- :- :- :- :20:19:13:13'
  };
  for(let u in turningTable) {
    rules.defineRule('turnUndead.' + u,
      'turnUndeadColumn', '=', '"' + turningTable[u] +'".split(":")[source].trim()'
    );
  }
  rules.defineRule('skillNotes.armorSkillModifiers', 'hasSkills', '?', null);
  // Replace SRD35's two-handedWeapon validation note
  delete rules.choices.notes['validationNotes.two-handedWeapon'];
  rules.defineChoice
    ('notes', 'validationNotes.two-handedWeapon:Requires shield == "None"');
  rules.defineRule('weapons.Unarmed', '', '=', '1');
  rules.defineRule('weaponProficiencyCount', 'weapons.Unarmed', '=', '1');
  rules.defineRule('weaponProficiency.Unarmed', 'weapons.Unarmed', '=', '1');

  // Add items to character sheet
  rules.defineSheetElement('EquipmentInfo', 'Combat Notes', null);
  rules.defineSheetElement('Weapon Proficiency Count', 'EquipmentInfo/');
  rules.defineSheetElement
    ('Weapon Proficiency', 'EquipmentInfo/', null, '; ');
  rules.defineSheetElement
    ('Thac0Info', 'CombatStats/', '<b>THAC0 Melee/Ranged</b>: %V', '/');
  rules.defineSheetElement('Thac0 Melee', 'Thac0Info/', '%V');
  rules.defineSheetElement('Thac0 Ranged', 'Thac0Info/', '%V');
  rules.defineSheetElement
    ('Thac10Info', 'CombatStats/', '<b>THAC10 Melee/Ranged</b>: %V', '/');
  rules.defineSheetElement('Thac10 Melee', 'Thac10Info/', '%V');
  rules.defineSheetElement('Thac10 Ranged', 'Thac10Info/', '%V');
  rules.defineSheetElement('AttackInfo');
  rules.defineSheetElement('Turn Undead', 'Combat Notes', null);

};

/* Defines rules related to basic character identity. */
OldSchool.identityRules = function(rules, alignments, classes, races) {

  QuilvynUtils.checkAttrTable(alignments, []);
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitDie', 'THAC10', 'WeaponProficiency', 'NonproficientPenalty', 'NonweaponProficiency', 'Breath', 'Death', 'Petrification', 'Spell', 'Wand', 'Features', 'Experience', 'SpellSlots']);
  QuilvynUtils.checkAttrTable(races, ['Require', 'Features', 'Languages']);

  for(let a in alignments)
    rules.choiceRules(rules, 'Alignment', a, alignments[a]);
  for(let c in classes)
    rules.choiceRules(rules, 'Class', c, classes[c]);
  for(let r in races)
    rules.choiceRules(rules, 'Race', r, races[r]);

  // Rules that apply to multiple classes or races
  rules.defineRule('level', /^levels\./, '+=', null);
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

  for(let s in schools)
    rules.choiceRules(rules, 'School', s, schools[s]);
  for(let level = 1; level <= 9; level++) {
    rules.defineRule
      ('spellSlots.W' + level, 'magicNotes.schoolSpecialization', '+', '1');
  }
  for(let s in spells) {
    if(s.match(/\s[A-Z]\d$/))
      continue;
    let groupLevels = QuilvynUtils.getAttrValueArray(spells[s], 'Level');
    for(let i = 0; i < groupLevels.length; i++) {
      let groupLevel = groupLevels[i];
      let attrs =
        spells[s] + ' ' + (spells[s + ' ' + groupLevel] || '');
      rules.choiceRules(rules, 'Spell', s, attrs + ' Level=' + groupLevel);
    }
  }

  // Add items to character sheet
  rules.defineSheetElement
    ('Understand Spell', 'Spell Slots', '<b>%N</b>: %V%');
  rules.defineSheetElement('Maximum Spells Per Level', 'Spell Slots');

};

/* Defines rules related to character aptitudes. */
OldSchool.talentRules = function(rules, features, goodies, languages, skills) {

  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);
  QuilvynUtils.checkAttrTable
    (goodies, ['Pattern', 'Effect', 'Value', 'Attribute', 'Section', 'Note']);
  QuilvynUtils.checkAttrTable(languages, []);
  QuilvynUtils.checkAttrTable(skills, ['Ability', 'Modifier', 'Class']);

  for(let f in features)
    rules.choiceRules(rules, 'Feature', f, features[f]);
  for(let g in goodies)
    rules.choiceRules(rules, 'Goody', g, goodies[g]);
  for(let l in languages)
    rules.choiceRules(rules, 'Language', l, languages[l]);
  for(let s in skills) {
    rules.choiceRules(rules, 'Goody', s,
      'Pattern="([-+]\\d).*\\s+' + s + '\\s+Skill|' + s + '\\s+skill\\s+([-+]\\d)"' +
      'Effect=add ' +
      'Value="$1 || $2" ' +
      'Attribute="skillModifier.' + s + '" ' +
      'Section=skill Note="%V ' + s + '"'
    );
    rules.choiceRules(rules, 'Skill', s, skills[s]);
  }
  rules.defineRule('hasSkills',
    'features.Bard Skills', '=', '1',
    'features.Ranger Skills', '=', '1',
    'features.Thief Skills', '=', '1'
  );
  QuilvynRules.validAllocationRules
    (rules, 'language', 'languageCount', 'Sum "^languages\\."');
  if(rules.edition == 'Second Edition') {
    QuilvynRules.validAllocationRules
      (rules, 'skill', 'skillPoints', 'sumThiefSkills');
    QuilvynRules.validAllocationRules
      (rules, 'nonweaponProficiency', 'nonweaponProficiencyCount', 'sumNonThiefSkills');
    rules.defineSheetElement('Nonweapon Proficiency Count', 'SkillStats');
  }

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
      QuilvynUtils.getAttrValue(attrs, 'Experience'),
      QuilvynUtils.getAttrValueArray(attrs, 'HitDie'),
      QuilvynUtils.getAttrValue(attrs, 'THAC10'),
      QuilvynUtils.getAttrValue(attrs, 'Breath'),
      QuilvynUtils.getAttrValue(attrs, 'Death'),
      QuilvynUtils.getAttrValue(attrs, 'Petrification'),
      QuilvynUtils.getAttrValue(attrs, 'Spell'),
      QuilvynUtils.getAttrValue(attrs, 'Wand'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValue(attrs, 'WeaponProficiency'),
      QuilvynUtils.getAttrValue(attrs, 'NonproficientPenalty'),
      QuilvynUtils.getAttrValue(attrs, 'NonweaponProficiency'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    OldSchool.classRulesExtra(rules, name);
  } else if(type == 'Discipline') {
    if(window.OSPsionics != null)
      OSPsionics.choiceRules(rules, type, name, attrs);
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
  else if(type == 'Power') {
    if(window.OSPsionics != null)
      OSPsionics.choiceRules(rules, type, name, attrs);
  } else if(type == 'Race') {
    OldSchool.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
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
      QuilvynUtils.getAttrValue(attrs, 'Modifier'),
      QuilvynUtils.getAttrValueArray(attrs, 'Class')
    );
    OldSchool.skillRulesExtra(rules, name);
  } else if(type == 'Spell') {
    let description = QuilvynUtils.getAttrValue(attrs, 'Description');
    let groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    let school = QuilvynUtils.getAttrValue(attrs, 'School');
    let schoolAbbr = school.substring(0, 4);
    for(let i = 0; i < groupLevels.length; i++) {
      let matchInfo = groupLevels[i].match(/^(\D+)(\d+)$/);
      if(!matchInfo) {
        console.log('Bad level "' + groupLevels[i] + '" for spell ' + name);
        continue;
      }
      let group = matchInfo[1];
      let level = matchInfo[2] * 1;
      let fullName = name + '(' + group + level + ' ' + schoolAbbr + ')';
      OldSchool.spellRules(rules, fullName, school, group, level, description);
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
  if(window.UnearthedArcana1e != null && rules.edition == 'First Edition')
    UnearthedArcana1e.choiceRules(rules, type, name, attrs);
  if(type != 'Spell') {
    type = type == 'Class' ? 'levels' :
    (type.substring(0,1).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
OldSchool.alignmentRules = function(rules, name) {
  OSRIC.alignmentRules(rules, name);
  // No changes needed to the rules defined by OSRIC method
};

/*
 * Defines in #rules# the rules associated with armor #name#, which adds #ac#
 * to the character's armor class, imposes a maximum movement speed of
 * #maxMove#, weighs #weight# pounds, and modifies skills as specified in
 * #skill#.
 */
OldSchool.armorRules = function(rules, name, ac, maxMove, weight, skill) {

  if(skill && typeof skill != 'string') {
    console.log('Bad skill "' + skill + '" for armor ' + name);
    return;
  }

  OSRIC.armorRules(rules, name, ac, maxMove, weight);

  if(rules.armorStats.skill == null)
    rules.armorStats.skill = {};
  rules.armorStats.skill[name] = skill;

  if(rules.edition == 'Second Edition')
    // Disable armor speed maximum--not defined in 2E
    rules.defineRule('abilityNotes.armorSpeedMaximum', 'armor', '?', null);
  if(rules.edition == 'Second Edition' || window.UnearthedArcana1e != null) {
    rules.defineRule('skillNotes.armorSkillModifiers',
      'armor', '=', QuilvynUtils.dictLit(rules.armorStats.skill) + '[source]'
    );
  }

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
 * levels; the number of levels between decreases. #features# lists the
 * features acquired as the character advances in class level, and #languages#
 * lists any automatic languages for the class. #weaponProficiency# is a
 * triplet indicating: the number of weapon proficiencies for a level 1
 * character; the number of levels between increments of weapon proficiencies;
 * the penalty for using a non-proficient weapon. #weaponProficiency# is a pair
 * indicating the number of nonweapon proficiencies for a level 1 character and
 * the number of levels between increments of nonweapon proficiencies. If the
 * class grants spell slots, #spellSlots# lists the number of spells per level
 * per day granted.
 */
OldSchool.classRules = function(
  rules, name, requires, experience, hitDie, thac10, saveBreath, saveDeath,
  savePetrification, saveSpell, saveWand, features, weaponProficiency,
  nonproficientPenalty, nonweaponProficiency, spellSlots
) {

  if(nonweaponProficiency && typeof(nonweaponProficiency) != 'string') {
    console.log('Bad nonweaponProficiency "' + nonweaponProficiency + '" for class ' + name);
    return;
  }

  OSRIC.classRules(
    rules, name, requires, experience, hitDie, thac10, saveBreath, saveDeath,
    savePetrification, saveSpell, saveWand, features, weaponProficiency,
    nonproficientPenalty, spellSlots
  );

  if(nonweaponProficiency) {
    let nonweaponProgress = OSRIC.progressTable(nonweaponProficiency);
    rules.defineRule('nonweaponProficiencyCount',
      '', '=', '0',
      'levels.' + name, '+', 'source<' + nonweaponProgress.length + ' ? [' + nonweaponProgress.join(',') + '][source] : ' + nonweaponProgress[nonweaponProgress.length - 1]
    );
  }

  if(rules.edition == 'Second Edition' &&
     features.join('').includes('Bonus Spells')) {
    // Override and extend OSRIC values as per 2E PHB
    rules.defineRule('bonusSpellTemplate',
      'features.Bonus Spells', '?', null,
      'wisdom', '=',
        'source==25 ? "t1x4, t2x3, t3x3, t4x3, t5x3, t6x3, t7" : ' +
        'source==24 ? "t1x4, t2x3, t3x3, t4x3, t5x3, t6x2" : ' +
        'source==23 ? "t1x4, t2x3, t3x3, t4x3, t5x2, t6" : ' +
        'source==22 ? "t1x3, t2x3, t3x3, t4x3, t5x2" : ' +
        'source==21 ? "t1x3, t2x3, t3x3, t4x2, t5" : ' +
        'source==20 ? "t1x3, t2x3, t3x2, t4x2" : ' +
        'source==19 ? "t1x3, t2x2, t3x2, t4" : ' +
        'source==18 ? "t1x2, t2x2, t3, t4" : ' +
        'source==17 ? "t1x2, t2x2, t3" : ' +
        'source==16 ? "t1x2, t2x2" : ' +
        'source==15 ? "t1x2, t2" : ' +
        'source==14 ? "t1x2" : "t1"'
    );
  }

};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the abilities passed to classRules.
 */
OldSchool.classRulesExtra = function(rules, name) {

  let classLevel = 'levels.' + name;

  if(name == 'Assassin') {

    // Remove Limited Henchmen Classes note once level 12 is reached
    rules.defineRule('assassinFeatures.Limited Henchmen Classes',
      classLevel, '=', 'source>=4 && source<12 ? 1 : null'
    );
    rules.defineRule('maximumHenchmen', classLevel, 'v', 'source<4 ? 0 : null');
    let skillLevel = 'source>2 ? source - 2 : null';
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

    if(rules.edition == 'Second Edition') {
      rules.defineRule('skillLevel.Climb Walls', classLevel, '+=', null);
      rules.defineRule('skillLevel.Hear Noise', classLevel, '+=', null);
      rules.defineRule('skillLevel.Pick Pockets', classLevel, '+=', null);
      rules.defineRule('skillLevel.Read Languages', classLevel, '+=', null);
      rules.defineRule('skillModifier.Climb Walls', classLevel, '+=', '50');
      rules.defineRule('skillModifier.Hear Noise', classLevel, '+=', '20');
      rules.defineRule('skillModifier.Pick Pockets', classLevel, '+=', '10');
      rules.defineRule('skillModifier.Read Languages', classLevel, '+=', '5');
      rules.defineRule('skillPoints', classLevel, '+=', '15 * source + 5');
    } else {
      rules.defineRule('languageCount',
        classLevel, '+', 'source>17 ? source - 7 : source>3 ? source - 2 - Math.floor((source-3) / 3) : 1'
      );
      rules.defineRule('magicNotes.charmingMusic',
        classLevel, '=', '[0,15,20,22,24,30,32,34,40,42,44,50,53,56,60,63,66,70,73,76,80,84,88,95][source]'
      );
    }

  } else if(name == 'Cleric') {

    let t = rules.edition == 'Second Edition' ? 'P' : 'C';
    rules.defineRule('spellSlots.' + t + '6', 'wisdom', '?', 'source > 16');
    rules.defineRule('spellSlots.' + t + '7', 'wisdom', '?', 'source > 17');

  } else if(name == 'Monk') {

    rules.defineRule
      ('armorClass', classLevel, '=', '11 - source + Math.floor(source / 5)');
    rules.defineRule
      ('combatNotes.dexterityArmorClassAdjustment', classLevel, '*', '0');
    rules.defineRule
      ('combatNotes.strengthAttackAdjustment', classLevel, '*', '0');
    rules.defineRule
      ('combatNotes.strengthDamageAdjustment', classLevel, '*', '0');
    rules.defineRule
      ('maximumHenchmen', classLevel, 'v', 'source>=6 ? source - 4 : 0');
    if(rules.edition == 'First Edition') {
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

  } else if(name == 'Ranger') {

    // Override casterLevel calculations from classRules
    rules.defineRule('casterLevels.D',
      classLevel, '^=', 'source<9 ? null : Math.min(Math.floor((source - 6) / 2), 6)'
    );
    rules.defineRule('casterLevels.M',
      classLevel, '^=', 'source<9 ? null : Math.min(Math.floor((source - 6) / 2), 6)'
    );
    rules.defineRule('maximumHenchmen',
      // Noop to show Delayed Henchmen note in italics
      'abilityNotes.delayedHenchmen', '+', 'null',
      classLevel, 'v', 'source<8 ? 0 : null'
    );
    if(rules.edition == 'Second Edition') {
      // Suppress v3.5 Tracking sanity note
      rules.defineRule('sanityNotes.tracking', classLevel, '?', '0');
      rules.defineRule('skillLevel.Hide In Shadows', classLevel, '+=', null);
      rules.defineRule('skillLevel.Move Silently', classLevel, '+=', null);
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
    }

  } else if(name == 'Thief') {

    rules.defineRule('skillLevel.Climb Walls', classLevel, '+=', null);
    rules.defineRule('skillLevel.Find Traps', classLevel, '+=', null);
    rules.defineRule('skillLevel.Hear Noise', classLevel, '+=', null);
    rules.defineRule('skillLevel.Hide In Shadows', classLevel, '+=', null);
    rules.defineRule('skillLevel.Move Silently', classLevel, '+=', null);
    rules.defineRule('skillLevel.Open Locks', classLevel, '+=', null);
    rules.defineRule('skillLevel.Pick Pockets', classLevel, '+=', null);
    rules.defineRule('skillLevel.Read Languages', classLevel, '+=', null);

    if(rules.edition == 'Second Edition') {
      rules.defineRule('maxAllowedSkillAllocation',
        'skillPoints', '=', 'Math.min(Math.floor(source / 2), 95)'
      );
      rules.defineRule('skillModifier.Climb Walls', classLevel, '+=', '60');
      rules.defineRule('skillModifier.Find Traps', classLevel, '+=', '5');
      rules.defineRule('skillModifier.Hear Noise', classLevel, '+=', '15');
      rules.defineRule('skillModifier.Hide In Shadows', classLevel, '+=', '5');
      rules.defineRule('skillModifier.Move Silently', classLevel, '+=', '10');
      rules.defineRule('skillModifier.Open Locks', classLevel, '+=', '10');
      rules.defineRule('skillModifier.Pick Pockets', classLevel, '+=', '15');
      rules.defineRule('skillModifier.Read Languages', classLevel, '+=', '0');
      rules.defineRule('skillPoints', classLevel, '+=', '30 * source + 30');
    }

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
  OSRIC.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
  // No changes needed to the rules defined by OSRIC method
};

/* Defines in #rules# the rules associated with language #name#. */
OldSchool.languageRules = function(rules, name) {
  OSRIC.languageRules(rules, name);
  // No changes needed to the rules defined by OSRIC method
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# lists associated features and
 * #languages# any automatic languages.
 */
OldSchool.raceRules = function(rules, name, requires, features, languages) {
  OSRIC.raceRules(rules, name, requires, features, languages);
  // No changes needed to the rules defined by OSRIC method
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the abilities passed to raceRules.
 */
OldSchool.raceRulesExtra = function(rules, name) {

  let raceLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Level';

  if(name == 'Dwarf') {
    if(rules.edition != 'Second Edition')
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
    if(rules.edition != 'Second Edition')
      rules.defineRule('skillNotes.intelligenceLanguageBonus',
        raceLevel, '+', '-4',
        '', '^', '0'
      );
    rules.defineRule('skillNotes.raceSkillModifiers',
      raceLevel, '=',
        '"+5% Hear Noise/+10% Hide In Shadows/+5% Move Silently/-5% Open Locks/+5% Pick Pockets"'
     );
  } else if(name == 'Gnome') {
    if(rules.edition != 'Second Edition')
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
    if(rules.edition == 'First Edition')
      rules.defineRule('skillNotes.intelligenceLanguageBonus',
        raceLevel, '+', '-5',
        '', '^', '0'
      );
    rules.defineRule('skillNotes.raceSkillModifiers',
      raceLevel, '=', '"+5% Hide In Shadows/+10% Pick Pockets"'
    );
  } else if(name == 'Half-Orc') {
    if(rules.edition != 'Second Edition')
      rules.defineRule('skillNotes.intelligenceLanguageBonus',
        raceLevel, 'v', '2',
        '', '^', '0'
      );
    rules.defineRule('skillNotes.raceSkillModifiers',
      raceLevel, '=',
        '"+5% Climb Walls/+5% Find Traps/+5% Hear Noise/+5% Open Locks/-5% Pick Pockets/-10% Read Languages"'
     );
  } else if(name == 'Halfling') {
    if(rules.edition != 'Second Edition')
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
  OSRIC.schoolRules(rules, name);
  // No changes needed to the rules defined by OSRIC method
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class and weight #weight# pounds
 */
OldSchool.shieldRules = function(rules, name, ac, weight) {
  OSRIC.shieldRules(rules, name, ac, weight);
  // No changes needed to the rules defined by OSRIC method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * basic ability #ability# plus #modifier#. #classes# lists the classes for
 * which this is a class skill; a value of "all" indicates that this is a class
 * skill for all classes.
 */
OldSchool.skillRules = function(rules, name, ability, modifier, classes) {

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

  rules.defineRule('skillModifier.' + name,
    'skills.' + name, '=', ability ? '0' : 'source',
    'skillNotes.armorSkillModifiers', '+',
      'source.match(/' + name + '/) ? source.match(/([-+][\\d\\.]+)% ' + name + '/)[1] * 1 : null',
    'skillNotes.raceSkillModifiers', '+',
      'source.match(/' + name + '/) ? source.match(/([-+][\\d\\.]+)% ' + name + '/)[1] * 1 : null',
    'skillNotes.dexteritySkillModifiers', '+',
      'source.match(/' + name + '/) ? source.match(/([-+][\\d\\.]+)% ' + name + '/)[1] * 1 : null'
  );
  if(ability)
    rules.defineRule('sumNonThiefSkills', 'skills.' + name, '+=', null);
  else
    rules.defineRule('sumThiefSkills', 'skills.' + name, '+=', null);
  if(ability) {
    let abil = ability.substring(0, 3);
    if(modifier)
      abil += (modifier > 0 ? '+' : '') + modifier;
    rules.defineChoice('notes', 'skills.' + name + ': (' + abil + ') %V (%1)');
    if(ability != 'n/a')
      rules.defineRule('skillModifier.' + name,
         ability, '+', 'source' + (modifier ? '+' + modifier : '')
      );
  } else if(rules.edition == 'Second Edition') {
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
        rules.edition == 'First Edition' ?
          'source<=4 ? source + 84 : Math.min(2 * source + 80, 99)'
        : '0'
    );
  } else if(name == 'Find Traps') {
    rules.defineRule('skills.Find Traps',
      'skillLevel.Find Traps', '+=',
        rules.edition == 'First Edition' ?
          'Math.min(5 * source + 15, 99)'
        : '0'
    );
  } else if(name == 'Hear Noise') {
    rules.defineRule('skills.Hear Noise',
      'skillLevel.Hear Noise', '+=',
        rules.edition == 'First Edition' ?
          'Math.min(5 * Math.floor((source-1)/2) + (source>=15 ? 15 : 10), 55)'
        : '0'
    );
  } else if(name == 'Hide In Shadows') {
    rules.defineRule('skills.Hide In Shadows',
      'skillLevel.Hide In Shadows', '+=',
        rules.edition == 'First Edition' ?
          'source<5 ? 5 * source + 5 : source<9 ? 6 * source + 1 : ' +
          'source<13 ? 7 * source - 7 : Math.min(8 * source - 19, 99)'
        : '0'
    );
  } else if(name == 'Move Silently') {
    rules.defineRule('skills.Move Silently',
      'skillLevel.Move Silently', '+=',
        rules.edition == 'First Edition' ?
          'source<5 ? 6 * source + 9 : source<7 ? 7 * source + 5 : ' +
          'source==7 ? 55 : Math.min(8 * source - 2, 99)'
        : '0'
    );
  } else if(name == 'Open Locks') {
    rules.defineRule('skills.Open Locks',
      'skillLevel.Open Locks', '+=',
        rules.edition == 'First Edition' ?
          'source<5 ? 4 * source + 21 : Math.min(5 * source + 17, 99)'
        : '0'
    );
  } else if(name == 'Pick Pockets') {
    rules.defineRule('skills.Pick Pockets',
      'skillLevel.Pick Pockets', '+=',
        rules.edition == 'First Edition' ?
          'source<10 ? 5 * source + 25 : source<13 ? 10 * source - 20 : ' +
          'source<16 ? 5 * source + 40 : 125'
        : '0'
    );
  } else if(name == 'Read Languages') {
    rules.defineRule('skills.Read Languages',
      'skillLevel.Read Languages', '+=',
        rules.edition == 'First Edition' ?
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
  rules, name, school, casterGroup, level, description
) {
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
  OSRIC.weaponRules(rules, name, category, damage, range);
  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  let specializationAttackBonus =
    rules.edition == 'Second Edition' && name.match(/bow/i) ? 2 : 1;
  let specializationDamageBonus =
    rules.edition == 'Second Edition' && name.match(/bow/i) ? 0 : 2;
  rules.defineRule(prefix + 'AttackModifier',
    'combatNotes.weaponSpecialization', '+',
      'source == "' + name + '" ? ' + specializationAttackBonus + ' : null'
  );
  if(rules.edition == 'Second Edition' &&
     range != null && !name.match(/bow|gun|arquebus/i)) {
    rules.defineRule
      (prefix + 'AttackModifier', 'combatNotes.deadlyAim', '+', '1');
  }
  rules.defineRule(prefix + 'DamageModifier',
    'combatNotes.weaponSpecialization', '+',
      'source == "' + name + '" ? ' + specializationDamageBonus + ' : null'
  );
};

/* Returns the elements in a basic OldSchool character editor. */
OldSchool.initialEditorElements = function(edition) {
  let result = OSRIC.initialEditorElements();
  if(edition == 'Second Edition') {
    let index = result.findIndex(x => x[0] == 'languages');
    result.splice(index, 0, ['skills', 'Skills', 'bag', 'skills']);
  }
  if(edition == 'First Edition' && window.UnearthedArcana1e != null)
    ; // empty -- both specialization and double specialization applicable
  else if(edition == 'Second Edition') {
    let index = result.findIndex(x => x[0] == 'doubleSpecialization');
    result.splice(index, 1);
  } else {
    let index = result.findIndex(x => x[0] == 'weaponSpecialization');
    result.splice(index, 2);
  }
  return result;
};

/* Returns an array of plugins upon which this one depends. */
OldSchool.getPlugins = function() {
  let result = [OSRIC].concat(OSRIC.getPlugins());
  if(window.UnearthedArcana1e != null && this.edition == 'First Edition')
    result.unshift(UnearthedArcana1e);
  if(window.OSPsionics != null)
    result.unshift(OSPsionics);
  return result;
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
OldSchool.randomizeOneAttribute = function(attributes, attribute) {
  if(window.UnearthedArcana1e != null && this.edition == 'First Edition')
    UnearthedArcana1e.randomizeOneAttribute.apply(this, [attributes,attribute]);
  if(window.OSPsionics != null)
    OSPsionics.randomizeOneAttribute.apply(this, [attributes, attribute]);
  OSRIC.randomizeOneAttribute.apply(this, [attributes, attribute]);
};

/* Returns HTML body content for user notes associated with this rule set. */
OldSchool.ruleNotes = function() {
  return '' +
    '<h2>Quilvyn First and Second Edition Rule Sets Notes</h2>\n' +
    'Quilvyn First and Second Edition Rule Sets Version ' + OldSchool.VERSION + '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '  For convenience, Quilvyn reports THAC0 values for First Edition' +
    '  characters. It also reports THAC10 ("To Hit Armor Class 10"), which' +
    '  can be more useful for characters who need a 20 to hit AC 0.\n' +
    '  </li><li>\n' +
    '  The 1E DMG rules mention that Magic Users of levels 7 through 10 can' +
    '  can create scrolls and potions only with the aid of an alchemist; at' +
    '  at level 11 they can do such crafting unaided. The 1E DMG also' +
    '  mentions that higher-level Clerics and Druids can create potions and' +
    '  scrolls of their own spells.\n' +
    '  </li><li>\n' +
    '  Quilvyn assumes that Halfling characters are of pure Stoutish blood'+
    '  for the Infravision, Detect Slope, and Determine Direction features.\n' +
    '  </li><li>\n' +
    '  2E spell ranges are generally given in yards rather than feet, so, for' +
    '  example, "R10\'" in the W1 Grease spell should be read as 10 yards' +
    '  for 2E characters.\n' +
    '  </li><li>\n' +
    '  Discussion of adding different types of homebrew options to the' +
    '  OldSchool rule sets can be found in <a href="plugins/homebrew-oldschool.html">OldSchool Homebrew Examples</a>.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '  Quilvyn does not note racial restrictions on class and level, class' +
    '  restrictions on weapon choice, or the First Edition prohibition on' +
    '  Neutral clerics.\n' +
    '  </li><li>\n' +
    '  Support for character levels 21+ is incomplete.\n' +
    '  </li><li>\n' +
    '  Quilvyn does not note the First Edition lower strength maximum for' +
    '  female characters.\n' +
    '  </li><li>\n' +
    '  Fractional percentages for First Edition Thief skills are not' +
    '  reported.\n' +
    '  </li><li>\n' +
    '  Minimum levels for building strongholds and attracting followers are' +
    '  not reported.\n' +
    '  </li><li>\n' +
    '  In Second Edition, Quilvyn does not consider sphere limitations on' +
    '  priest spell selections.\n' +
    '  </li><li>\n' +
    '  Quilvyn does not note Halfling characters with a strength of 18.\n' +
    '  </li><li>\n' +
    '  Quilvyn does not report the chance of extraordinary success on' +
    '  strength tests for characters with strength 18/91 and higher.\n' +
    '  </li><li>\n' +
    '  In Second Edition, Quilvyn does not report the spell immunities of\n' +
    '  characters with wisdom 19 or greater.\n' +
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
