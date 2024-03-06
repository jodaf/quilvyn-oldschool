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
/* globals OldSchool, OSRIC, OSPsionics, Quilvyn, QuilvynRules, QuilvynUtils */
"use strict";

/*
 * This module loads the rules from the 2nd Edition Dark Sun boxed set. The
 * DarkSun2E function contains methods that load rules for particular parts
 * of the rule book; raceRules for character races, magicRules for spells, etc.
 * These member methods can be called independently in order to use a
 * subset of the DarkSun2E rules. Similarly, the constant fields of DarkSun2E
 * (CLASSES, RACES, etc.) can be manipulated to modify the choices.
 */
function DarkSun2E() {

  if(window.OSRIC == null || window.OldSchool == null || window.OSPsionics == null) {
    alert('The DarkSun2E module requires use of the OSRIC, OldSchool, and OSPsionics modules');
    return;
  }

  let rules = new QuilvynRules('Dark Sun - AD&D 2E', DarkSun2E.VERSION);
  rules.plugin = DarkSun2E;
  DarkSun2E.rules = rules;
  rules.edition = 'Second Edition';

  rules.defineChoice
    ('choices', ['Discipline', 'Power'].concat(OldSchool.CHOICES));
  rules.choiceEditorElements = OSRIC.choiceEditorElements;
  rules.choiceRules = DarkSun2E.choiceRules;
  rules.editorElements = DarkSun2E.initialEditorElements();
  rules.getFormats = OSRIC.getFormats;
  rules.getPlugins = DarkSun2E.getPlugins;
  rules.makeValid = OSRIC.makeValid;
  rules.randomizeOneAttribute = DarkSun2E.randomizeOneAttribute;
  rules.defineChoice
    ('random', OldSchool.RANDOMIZABLE_ATTRIBUTES.concat(['element']));
  rules.ruleNotes = DarkSun2E.ruleNotes;

  OSRIC.createViewers(rules, OSRIC.VIEWERS);
  rules.defineChoice('extras', 'feats', 'sanityNotes', 'validationNotes');
  rules.defineChoice
    ('preset', 'race:Race,select-one,races','levels:Class Levels,bag,levels');

  rules.edition = 'Second Edition';
  DarkSun2E.abilityRules(rules);
  DarkSun2E.combatRules
    (rules, DarkSun2E.ARMORS, DarkSun2E.SHIELDS, DarkSun2E.WEAPONS);
  DarkSun2E.magicRules(rules, DarkSun2E.SCHOOLS, DarkSun2E.SPELLS);
  DarkSun2E.talentRules
    (rules, DarkSun2E.FEATURES, DarkSun2E.GOODIES,
     DarkSun2E.LANGUAGES, DarkSun2E.SKILLS);
  DarkSun2E.identityRules(
    rules, DarkSun2E.ALIGNMENTS, DarkSun2E.CLASSES, DarkSun2E.RACES
  );
  OSPsionics.psionicsRules(rules, false);

  rules.defineSheetElement('Cleric Element', 'Levels+', ' <b>(%V)</b>');
  rules.defineSheetElement('Defiler Or Preserver', 'Levels+', ' <b>(%V)</b>');

  Quilvyn.addRuleSet(rules);

}

DarkSun2E.VERSION = '2.4.1.0';

DarkSun2E.ALIGNMENTS =
  OldSchool.editedRules('Second Edition', OldSchool.ALIGNMENTS, 'Alignment');
DarkSun2E.ARMORS =
  OldSchool.editedRules('Second Edition', OldSchool.ARMORS, 'Armor');
let classes2E =
  OldSchool.editedRules('Second Edition', OldSchool.CLASSES, 'Class');
DarkSun2E.CLASSES = {
  'Abjurer':
    classes2E.Abjurer,
  'Bard':
    classes2E.Bard + ' ' +
    'SpellSlots= ' +
    'Features=' +
      '"Armor Proficiency (All)",' +
      '"Charming Music","Defensive Song","Legend Lore",' +
      '"Poetic Inspiration","Bard Skills","Master Of Poisons"',
  'Cleric':
    classes2E.Cleric
    .replace('Features=', 'Features="5:Elemental Indifference","7:Conjure Element",'),
  'Conjurer':
    classes2E.Conjurer,
  'Diviner':
    classes2E.Diviner,
  'Druid':
    classes2E.Druid
    .replace(/"[^"]*Armor\s+Proficiency[^"]*",/ig, '')
    .replaceAll('Features=',
      'Features=' +
        'Concealment,"Guarded Lands","3:Speak With Animals",' +
        '"charisma >= 16/wisdom >= 16 ? 1:Bonus Druid Experience",' +
        '"5:Speak With Plants","7:Live Off The Land",10:Shapeshift,') + ' ' +
    'Require=' +
      '"charisma >= 15","wisdom >= 12"',
  'Enchanter':
    classes2E.Enchanter,
  'Fighter':
    classes2E.Fighter + ' ' +
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"strength >= 16 ? 1:Bonus Fighter Experience",' +
      '3:Trainer,4:Artillerist,"6:Construct Defenses","7:Bonus Attacks",' +
      '7:Commander,"9:War Engineer",10:Leader', 
  'Gladiator':
    classes2E.Fighter + ' ' +
    'Require="constitution >= 15","dexterity >= 12","strength >= 13" ' +
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"strength >= 16 ? 1:Bonus Gladiator Experience",' +
      '"Weapons Expert",Brawler,"5:Optimized Armor","7:Bonus Attacks",9:Leader',
  'Illusionist':
    classes2E.Illusionist,
  'Invoker':
    classes2E.Invoker,
  'Magic User':
    classes2E['Magic User'],
  'Necromancer':
    classes2E.Necromancer,
  'Ranger':
    classes2E.Ranger + ' ' +
    'Require=' +
      '"alignment =~ \'Good\'","constitution >= 14","dexterity >= 13",' +
      '"strength >= 13","wisdom >= 14"',
  'Templar':
    classes2E.Cleric
    .replaceAll('Cleric', 'Templar') + ' ' +
    'Require="alignment !~ \'Good\'","intelligence >= 10","wisdom >= 9" ' +
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"1:Turn Undead","Command Slave","Pass Judgment","2:Enter Building",' +
      '"3:Requisition Soldiers","4:Make Accusation","6:Create Scroll",' +
      '"6:Draw Funds","8:Create Potion","17:Grant Pardon"' + ' ' +
    'SpellSlots=' +
      'P1:2=1;4=2;5=3;11=4;14=5;15=6;16=7;18=8;19=9,' +
      'P2:3=1;5=2;8=3;12=4;14=5;15=6;16=7;18=8;19=9,' +
      'P3:6=1;7=2;9=3;13=4;15=5;16=6;17=7;18=8;19=9,' +
      'P4:8=1;10=2;12=3;14=4;15=5;16=6;17=7;18=8;19=9,' +
      'P5:11=1;13=2;15=3;16=4;17=5;18=6;19=7;20=9,' +
      'P6:14=1;15=2;16=3;17=4;19=5;20=6,' +
      'P7:15=1;17=2;19=3;20=4',
  'Thief':
    classes2E.Thief
    .replaceAll('Features=', 'Features=10:Patron,') + ' ' +
    'Require=' +
      '"alignment != \'Lawful Good\'","dexterity >= 9"',
  'Transmuter':
    classes2E.Transmuter
};
DarkSun2E.FEATURES_ADDED = {

  // Class
  'Artillerist':
    'Section=combat Note="May operate bombardment and siege weapons"',
  'Bard Skills':
    'Section=skill ' +
    'Note="May Climb Walls, Find Traps, Hear Noise, Hide In Shadows, Move Silently, Open Locks, Pick Pockets, and Read Languages"',
  'Bonus Gladiator Experience':
    'Section=ability Note="10% added to awarded experience"',
  'Command Slave':
    'Section=feature Note="May command any slave within home city"',
  'Commander':
    'Section=combat Note="May lead up to %{levels.Fighter*100} troops"',
  'Concealment':
    'Section=feature Note="Undetectable non-magically within guarded lands"',
  'Conjure Element':
    'Section=magic ' +
    'Note="R50\' May bring %{levels.Cleric-6}\' cu of material from the Plane of %{element} 1/dy"',
  'Construct Defenses':
    'Section=combat Note="Knows how to construct defensive works"',
  'Defiler':'Section=ability Note="Advances in leval at an accelerated pace"',
  'Draw Funds':
    'Section=feature Note="May draw %{levels.Templar}d10 GP of city funds"',
  'Elemental Indifference':
    'Section=feature Note="Unaffected by %{element==\'Air\'?\'air\':element==\'Earth\'?\'earth\':element==\'Fire\':\'fire\':\'water\'} %{levels.Cleric} rd/dy"',
  'Enter Building':'Section=feature Note="May enter any freehold%{levels.Templar>=5?\', palace, or temple\':\'\'} within home city"',
  'Grant Pardon':
    'Section=feature Note="May pardon a condemned person within home city"',
  'Guarded Lands':
    'Section=feature ' +
    'Note="Must select a geography to protect %{levels.Druid>=12?\'and spend half time there\':\'\'}"',
  'Leader':
    'Section=combat ' +
    'Note="Leads %{(levels.Fighter||0)-9>?(levels.Gladiator||0)-8} units of followers"',
  'Live Off The Land':
    'Section=feature Note="Needs no food or water within guarded lands"',
  'Make Accusation':
    'Section=feature Note="May accuse a freeman%{levels.Templar>=10?\' or noble\':\'\'} of a crime within home city"',
  'Master Of Poisons':
    'Section=skill Note="Knows how to use up to %{levels.Bard} poisons"',
  'Optimized Armor':'Section=combat Note="-%V Armor Class in armor"',
  'Pass Judgment':
    'Section=feature ' +
    'Note="May pass judgment on a slave%{levels.Templar>=15?\', freeman, or noble\':levels.Templar>=7?\' or freeman\':\'\'} within home city"',
  'Patron':
    'Section=combat ' +
    'Note="Has a %{levels.Thief*5}% chance of finding a patron to assign tasks and provide protection"',
  'Requisition Soldiers':
    'Section=feature ' +
    'Note="May call upon %{levels.Templar}d4 soldiers within home city"',
  'Resist Enchantment':'Section=save Note="+2 vs. enchantment spells"',
  'Shapeshift':
    'Section=magic ' +
    'Note="May change into creatures common to guarded lands 3/dy"',
  'Speak With Animals':
    'Section=magic ' +
    'Note="May use <i>Speak With Animals</i> effects at will %{levels.Druid>=7 ? \'\' : \'within guarded lands\'}"',
  'Speak With Plants':
    'Section=magic ' +
    'Note="May use <i>Speak With Plants</i> effects at will %{levels.Druid>=9 ? \'\': \'within guarded lands\'}"',
  'Trainer':
    'Section=combat Note="May teach students how to use specialized weapons"',
  'War Engineer':'Section=combat Note="May build heavy war machines"',
  'Weapons Expert':
    'Section=combat ' +
    'Note="Proficient in all weapons and may specialize in multiple weapons"',

  // Race
  'Antennae':'Section=combat Note="Reduces melee vision penalty by 1"',
  'Bite Attack':'Section=combat Note="May attack w/bite"',
  'Brawler':
    'Section=combat ' +
    'Note="+%{(levels.Gladiator?4:0)+(race==\'Mul\'?1:0)} punching/+%{race==\'Mul\'?5:0}% KO"',
  'Brawny':'Section=combat Note="Dbl rolled hit points"',
  'Carnivore':'Section=feature Note="Considers others as potential food"',
  'Chatkcha Fighter':'Section=combat Note="Weapon Proficiency (Chatkcha)"',
  'Claw Attack':'Section=combat Note="May attack w/claws"',
  'Clannish':
    'Section=feature ' +
    'Note="Attached to halfling culture; will always help other halflings"',
  'Conditioned':
    'Section=feature Note="Unaffected by temperatures from 32F to 110F"',
  'Dodge Missiles':
    'Section=combat Note="Has a 12in20 chance to dodge missiles"',
  'Dwarf Ability Adjustment':
    'Section=ability ' +
    'Note="+2 Constitution/-2 Charisma/-1 Dexterity/+1 Strength"',
  'Elf Ability Adjustment':
    'Section=ability ' +
    'Note="-2 Constitution/+2 Dexterity/+1 Intelligence/-1 Wisdom"',
  'Elf Run':
    'Section=ability,ability ' +
    'Note=' +
      '"+%{dexterity>=16?(dexterity-12)*10:dexterity>=12?(dexterity-10)//2*10:0} Speed",' +
      '"May move 50 miles/dy"',
  'Exoskeleton':
    'Section=combat,combat ' +
    'Note=' +
      '"-5 Armor Class",' +
      '"Cannot use armor"',
  'Focused':
    'Section=feature,save,skill ' +
    'Note=' +
      '"Judges others based on contribution to focus",' +
      '"+1 saves while pursuing focus",' +
      '"+2 proficiencies while pursuing focus"',
  'Half-Elf Ability Adjustment':
    'Section=ability Note="-1 Constitution/+1 Dexterity"',
  'Half-Giant Ability Adjustment':
    'Section=ability ' +
    'Note="-2 Charisma/+2 Constitution/-2 Intelligence/+4 Strength/-2 Wisdom"',
  'Halfling Ability Adjustment':
    'Section=ability ' +
    'Note="-1 Charisma/-1 Constitution/+2 Dexterity/-2 Strength/+2 Wisdom"',
  'Hunter':'Section=feature Note="Focuses on procuring food"',
  'Imitator':
    'Section=feature Note="Will often take on habits of a nearby culture"',
  'Leaper':'Section=skill Note="May jump 20\' up or 50\' forward"',
  'Long Bow Precision':'Section=combat Note="+1 attack w/Long Bow"',
  'Long Sword Precision':'Section=combat Note="+1 attack w/Long Sword"',
  'Mul Ability Adjustment':
    'Section=ability ' +
    'Note="-2 Charisma/+1 Constitution/-1 Intelligence/+2 Strength"',
  'Pet':'Section=feature Note="May have a trained animal companion"',
  'Protective':
    'Section=combat Note="Instinctively leaps into battle to help companions"',
  'Resist Disease':'Section=save Note="+%{constitution//3.5} vs. disease"',
  'Respect For Place':
    'Section=feature ' +
    'Note="Will not remove resources from where they are found"',
  'Sleepless':'Section=feature Note="Does not sleep"',
  'Paralyzing Bite':
    'Section=combat ' +
    'Note="Bite paralyzes S/M/L creature for 2d10/2d8/1d8 rd (Save neg)"',
  'Survivalist':
    'Section=skill Note="Proficient in Survival (choice of terrain)"',
  'Thri-kreen Ability Adjustment':
    'Section=ability ' +
    'Note="-2 Charisma/+2 Dexterity/-1 Intelligence/+1 Wisdom"',
  'Thri-kreen Immunities':
    'Section=save Note="Immune to <i>Charm Person</i> and <i>Hold Person</i>"',
  'Variable Alignment':
    'Section=ability Note="One axis of alignment changes each morning"',
  'Vigorous':
    'Section=feature ' +
    'Note="May perform %{constitution*24}/%{constitution+48}/%{constitution+36}/%{constitution+24} hrs normal/light/medium/heavy labor w/out rest; recovers w/8 hrs rest"',
  'Walker':'Section=skill Note="Travels only on foot"',
  'Wilderness Stealth':
    'Section=skill Note="Foes -4 surprise in wilderness and wastes"',
  'Xenophobic':'Section=feature Note="Suspicious of those outside of tribe"'

};
DarkSun2E.FEATURES =
  Object.assign(OldSchool.editedRules('Second Edition', Object.assign({}, OSRIC.FEATURES, OldSchool.FEATURES_ADDED), 'Feature'), DarkSun2E.FEATURES_ADDED);
DarkSun2E.GOODIES =
  OldSchool.editedRules('Second Edition', OldSchool.GOODIES, 'Goody');
DarkSun2E.LANGUAGES = {
  'Aarakocra':'',
  'Anakore':'',
  'Belgoi':'',
  'Braxat':'',
  'Common':'',
  'Dwarf':'',
  'Elf':'',
  'Ettercap':'',
  'Genie':'',
  'Giant':'',
  'Gith':'',
  'Goblin Spider':'',
  'Halfling':'',
  'Jozhal':'',
  'Kenku':'',
  'Meazel':'',
  'Thri-kreen':'',
  'Yuan-ti':''
};
DarkSun2E.RACES = {
  'Dwarf':
    'Require=' +
      '"constitution >= 14","strength >= 10" ' +
    'Features=' +
      '"Dwarf Ability Adjustment",Focused,Infravision,"Resist Magic",' +
      '"Resist Poison" ' +
    'Languages=' +
      'Common,Dwarf',
  'Elf':
    'Require=' +
      '"constitution >= 8","dexterity >= 12","intelligence >= 8" ' +
    'Features=' +
      'Conditioned,"Elf Ability Adjustment","Elf Run",Infravision,' +
      '"Long Bow Precision","Long Sword Precision",Walker,' +
      '"Wilderness Stealth",Xenophobic ' +
    'Languages=' +
      'Common,Elf',
  'Half-Elf':
    'Require=' +
      '"dexterity >= 8" ' +
    'Features=' +
      '"Half-Elf Ability Adjustment",Infravision,3:Survivalist,5:Pet ' +
    'Languages=' +
      'Common,Elf',
  'Half-Giant':
    'Require=' +
      '"charisma <= 17","constitution >= 15","dexterity <= 15",' +
      '"intelligence <= 15","strength >= 17","wisdom <= 17" ' +
    'Features=' +
      'Brawny,"Half-Giant Ability Adjustment",Imitator,"Variable Alignment" ' +
    'Languages=' +
      'Common,Giant',
  'Halfling':
    'Require=' +
      '"dexterity >= 12","strength <= 18","wisdom >= 7" ' +
    'Features=' +
      'Carnivore,Clannish,"Deadly Aim","Halfling Ability Adjustment",' +
      '"Respect For Place","Resist Disease","Resist Magic","Resist Poison",' +
      'Stealthy ' +
    'Languages=' +
      'Common,Halfling',
  'Human':
    'Languages=' +
      'Common',
  'Mul':
    'Require=' +
      '"constitution >= 8","strength >= 10" ' +
    'Features=' +
      'Brawler,"Mul Ability Adjustment",Vigorous ' +
    'Languages=' +
      'Common,Dwarf',
  'Thri-kreen':
    'Require=' +
      '"charisma <= 17","dexterity >= 15","strength >= 8" ' +
    'Features=' +
      'Antennae,"Bite Attack",Carnivore,"Claw Attack",Exoskeleton,Hunter,' +
      'Protective,Sleepless,"Thri-kreen Ability Adjustment",' +
      '"Thri-kreen Immunities",3:Leaper,"5:Chatkcha Fighter",' +
      '"5:Paralyzing Bite","7:Dodge Missiles" ' +
    'Languages=' +
      'Common,Thri-kreen'
};
DarkSun2E.SCHOOLS =
  OldSchool.editedRules('Second Edition', OldSchool.SCHOOLS, 'School');
DarkSun2E.SHIELDS =
  OldSchool.editedRules('Second Edition', OldSchool.SHIELDS, 'Shield');
let skills2E
  = OldSchool.editedRules('Second Edition', OldSchool.SKILLS, 'Skill');
DarkSun2E.SKILLS_ADDED = {
  'Find Traps':skills2E['Find Traps'].replaceAll('Class=', 'Class=Bard,'),
  'Hide In Shadows':
    skills2E['Hide In Shadows'].replaceAll('Class=', 'Class=Bard,'),
  'Move Silently':skills2E['Move Silently'].replaceAll('Class=', 'Class=Bard,'),
  'Open Locks':skills2E['Open Locks'].replaceAll('Class=', 'Class=Bard,')
};
DarkSun2E.SKILLS = Object.assign(skills2E, DarkSun2E.SKILLS_ADDED);
DarkSun2E.SPELLS_PRIEST_SPHERES = {
  'Aerial Servant':'Air',
  'Air Walk':'Air',
  'Animate Rock':'Earth',
  'Astral Spell':'Air',
  'Call Lightning':'Air',
  'Chariot Of Sustarre':'Fire',
  "Control Temperature 10' Radius":'Air',
  'Control Weather':'Air',
  'Control Winds':'Air',
  'Create Food And Water':'Water',
  'Create Water':'Water',
  'Dust Devil':'Air/Earth',
  'Earthquake':'Earth',
  'Endure Cold':'Fire',
  'Endure Heat':'Fire',
  'Faerie Fire':'Fire',
  'Fire Seeds':'Fire',
  'Fire Storm':'Fire',
  'Fire Trap':'Fire',
  'Flame Blade':'Fire',
  'Flame Strike':'Fire',
  'Flame Walk':'Fire',
  'Heat Metal':'Fire',
  'Insect Plague':'Air',
  'Lower Water':'Water',
  'Magic Font':'Water',
  'Magical Stone':'Earth',
  'Meld Into Stone':'Earth',
  'Part Water':'Water',
  'Plane Shift':'Air',
  'Produce Fire':'Fire',
  'Produce Flame':'Fire',
  'Protection From Fire':'Fire',
  'Protection From Lightning':'Air',
  'Purify Food And Drink':'Water',
  'Pyrotechnics':'Fire',
  'Reflecting Pool':'Water',
  'Resist Cold':'Fire',
  'Resist Fire':'Fire',
  'Spike Stones':'Earth',
  'Stone Shape':'Earth',
  'Transmute Metal To Wood':'Earth',
  'Transmute Water To Dust':'Earth/Water',
  'Wall Of Fire':'Fire',
  'Water Breathing':'Water',
  'Water Walk':'Water',
  'Weather Summoning':'Air',
  'Wind Walk':'Air'
};
DarkSun2E.SPELLS =
  OldSchool.editedRules('Second Edition', OldSchool.SPELLS, 'Spell');
delete DarkSun2E.SPELLS['Conjure Earth Elemental'];
delete DarkSun2E.SPELLS['Conjure Fire Elemental'];
DarkSun2E.WEAPONS_ADDED = {
  'Chatkcha':'Category=Ranged Damage=d6+2 Range=90',
  'Gythka':'Category=Two-Handed Damage=2d4',
  'Impaler':'Category=Two-Handed Damage=d8',
  'Quabone':'Category=Light Damage=d4',
  'Wrist Razor':'Category=Light Damage=d6+1'
};
DarkSun2E.WEAPONS =
  Object.assign(OldSchool.editedRules('Second Edition', OldSchool.WEAPONS, 'Weapon'), DarkSun2E.WEAPONS_ADDED);
DarkSun2E.DEFILER_EXPERIENCE_THRESHOLD = [
  0, 1750, 3500, 7000, 14000, 28000, 42000, 63000, 94.5000, 180000, 270000,
  540000, 820000, 1080000, 1350000, 1620000, 1890000, 2160000, 2430000, 2700000
];

/* Defines rules related to character abilities. */
DarkSun2E.abilityRules = function(rules) {
  OldSchool.abilityRules(rules);
  // No changes needed to the rules defined by OldSchool method
};

/* Defines rules related to combat. */
DarkSun2E.combatRules = function(rules, armors, shields, weapons) {
  OldSchool.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by OldSchool method
};

/* Defines rules related to basic character identity. */
DarkSun2E.identityRules = function(rules, alignments, classes, races) {
  OldSchool.identityRules(rules, alignments, classes, races);
  // No changes needed to the rules defined by OldSchool method
  rules.defineRule('clericElement',
    'levels.Cleric', '?', null,
    'element', '=', null
  );
  rules.defineRule('defilerOrPreserver',
    'spellSlots.W1', '=', '"Preserver"',
    'features.Defiler', '=', '"Defiler"'
  );
  rules.defineRule('features.Defiler', 'defiler', '=', '1');
  rules.defineChoice('notes',
    'validationNotes.defilerAlignment:Requires alignment !~ \'Good\''
  );
  rules.defineRule('validationNotes.defilerAlignment',
    'features.Defiler', '?', null,
    'alignment', '=', 'source.includes("Good") ? 1 : null'
  );
};

/* Defines rules related to magic use. */
DarkSun2E.magicRules = function(rules, schools, spells) {
  OldSchool.magicRules(rules, schools, spells);
  // No changes needed to the rules defined by OldSchool method
};

/* Defines rules related to character aptitudes. */
DarkSun2E.talentRules = function(rules, features, goodies, languages, skills) {
  OldSchool.talentRules(rules, features, goodies, languages, skills);
  // No changes needed to the rules defined by OldSchool method
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
DarkSun2E.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Alignment')
    DarkSun2E.alignmentRules(rules, name);
  else if(type == 'Armor')
    DarkSun2E.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Move'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Skill')
    );
  else if(type == 'Class') {
    DarkSun2E.classRules(rules, name,
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
    DarkSun2E.classRulesExtra(rules, name);
  } else if(type == 'Feature')
    DarkSun2E.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Goody')
    DarkSun2E.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Language')
    DarkSun2E.languageRules(rules, name);
  else if(type == 'Race') {
    DarkSun2E.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages')
    );
    DarkSun2E.raceRulesExtra(rules, name);
  } else if(type == 'School')
    DarkSun2E.schoolRules(rules, name);
  else if(type == 'Shield')
    DarkSun2E.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Skill') {
    DarkSun2E.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      QuilvynUtils.getAttrValue(attrs, 'Modifier'),
      QuilvynUtils.getAttrValueArray(attrs, 'Class')
    );
    DarkSun2E.skillRulesExtra(rules, name);
  } else if(type == 'Spell') {
    let description = QuilvynUtils.getAttrValue(attrs, 'Description');
    let duration = QuilvynUtils.getAttrValue(attrs, 'Duration');
    let effect =  QuilvynUtils.getAttrValue(attrs, 'Effect');
    let groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    let range = QuilvynUtils.getAttrValue(attrs, 'Range');
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
      if(group == 'P')
        schoolAbbr = DarkSun2E.SPELLS_PRIEST_SPHERES[name] || 'Cosmos';
      let fullName = name + '(' + group + level + ' ' + schoolAbbr + ')';
      DarkSun2E.spellRules
        (rules, fullName, school, group, level, description, duration, effect,
         range);
      rules.addChoice('spells', fullName, attrs);
    }
  } else if(type == 'Weapon')
    DarkSun2E.weaponRules(rules, name,
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
DarkSun2E.alignmentRules = function(rules, name) {
  OldSchool.alignmentRules(rules, name);
  // No changes needed to the rules defined by OldSchool method
};

/*
 * Defines in #rules# the rules associated with armor #name#, which adds #ac#
 * to the character's armor class, imposes a maximum movement speed of
 * #maxMove#, weighs #weight# pounds, and modifies skills as specified in
 * #skill#.
 */
DarkSun2E.armorRules = function(rules, name, ac, maxMove, weight, skill) {
  OldSchool.armorRules(rules, name, ac, maxMove, weight, skill);
  // No changes needed to the rules defined by OldSchool method
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
DarkSun2E.classRules = function(
  rules, name, requires, experience, hitDie, thac10, saveBreath, saveDeath,
  savePetrification, saveSpell, saveWand, features, weaponProficiency,
  nonproficientPenalty, nonweaponProficiency, spellSlots
) {
  OldSchool.classRules(
    rules, name, requires, experience, hitDie, thac10, saveBreath, saveDeath,
    savePetrification, saveSpell, saveWand, features, weaponProficiency,
    nonproficientPenalty, nonweaponProficiency, spellSlots
  );
  // No changes needed to the rules defined by OldSchool method
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the abilities passed to classRules.
 */
DarkSun2E.classRulesExtra = function(rules, name) {
  let classLevel = 'levels.' + name;
  OldSchool.classRulesExtra(rules, name);
  if(name.match(/Magic User|Abjurer|Conjurer|Diviner|Enchanter|Illusionist|Invoker|Necromancer|Transmuter/)) {
    rules.defineRule(classLevel, 'defilerLevel', '^', null);
    rules.defineRule('experiencePoints.' + name + '.1', 'defilerLevel', '=', 'DarkSun2E.DEFILER_EXPERIENCE_THRESHOLD[source]');
    rules.defineRule('defilerLevel',
      'abilityNotes.defiler', '?', null,
      'experiencePoints.' + name, '=', 'DarkSun2E.DEFILER_EXPERIENCE_THRESHOLD.findIndex(item => item > source)'
    );
  }
  if(name == 'Bard') {
    // Override values from OldSchool
    rules.defineRule('skillLevel.Find Traps', classLevel, '+=', null);
    rules.defineRule('skillLevel.Hide In Shadows', classLevel, '+=', null);
    rules.defineRule('skillLevel.Move Silently', classLevel, '+=', null);
    rules.defineRule('skillLevel.Open Locks', classLevel, '+=', null);
    rules.defineRule('skillModifier.Climb Walls', classLevel, '+=', '60');
    rules.defineRule('skillModifier.Find Traps', classLevel, '+=', '5');
    rules.defineRule('skillModifier.Hear Noise', classLevel, '+=', '15');
    rules.defineRule('skillModifier.Hide In Shadows', classLevel, '+=', '5');
    rules.defineRule('skillModifier.Move Silently', classLevel, '+=', '10');
    rules.defineRule('skillModifier.Open Locks', classLevel, '+=', '10');
    rules.defineRule('skillModifier.Pick Pockets', classLevel, '+=', '15');
    rules.defineRule('skillModifier.Read Languages', classLevel, '+=', '0');
    rules.defineRule('skillPoints', classLevel, '+=', '20 * (source - 1)');
  } else if(name == 'Gladiator') {
    rules.defineRule
      ('combatNotes.optimizedArmor', classLevel, '=', 'Math.floor(source / 5)');
    rules.defineRule
      ('armorClass', 'combatNotes.optimizedArmor.1', '+', '-source');
    rules.defineRule('combatNotes.optimizedArmor.1',
      'armor', '?', 'source != "None"',
      'combatNotes.optimizedArmor', '=', null
    );
    rules.defineRule('warriorLevel', classLevel, '+', null);
    rules.defineRule
      ('validationNotes.weaponSpecialization', classLevel, '^', '0');
    rules.defineRule
      ('weaponNonProficiencyPenalty', 'combatNotes.weaponsExpert', '^', '0');
  } else if(name == 'Templar') {
    rules.defineRule('turningLevel', classLevel, '+=', null);
    rules.defineRule('warriorLevel', classLevel, '+', null);
  } else if(name == 'Thief') {
    rules.defineRule('highDexSkillModifiers', 'dexterity', '=',
      'source==20 ? "+12% Find Traps/+17% Hide In Shadows/+20% Move Silently/+25% Open Locks/+20% Pick Pockets" : ' +
      'source==21 ? "+15% Find Traps/+20% Hide In Shadows/+25% Move Silently/+27% Open Locks/+25% Pick Pockets" : ' +
      'source==22 ? "+17% Find Traps/+22% Hide In Shadows/+30% Move Silently/+30% Open Locks/+27% Pick Pockets" : ' +
      'null'
    );
    rules.defineRule('skillNotes.dexteritySkillModifiers',
      'highDexSkillModifiers', '=', null
    );
  }
};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
DarkSun2E.featureRules = function(rules, name, sections, notes) {
  OldSchool.featureRules(rules, name, sections, notes);
  // No changes needed to the rules defined by OldSchool method
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
DarkSun2E.goodyRules = function(
  rules, name, pattern, effect, value, attributes, sections, notes
) {
  OldSchool.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
  // No changes needed to the rules defined by OldSchool method
};

/* Defines in #rules# the rules associated with language #name#. */
DarkSun2E.languageRules = function(rules, name) {
  OldSchool.languageRules(rules, name);
  // No changes needed to the rules defined by OldSchool method
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# lists associated features and
 * #languages# any automatic languages.
 */
DarkSun2E.raceRules = function(
  rules, name, requires, features, languages
) {
  OldSchool.raceRules(rules, name, requires, features, languages);
  // No changes needed to the rules defined by OldSchool method
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the abilities passed to raceRules.
 */
DarkSun2E.raceRulesExtra = function(rules, name) {
  let raceLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Level';
  if(name == 'Elf') {
    rules.defineRule('compoundLongBowAttackModifier',
      'combatNotes.longBowPrecision', '+', '1'
    );
    rules.defineRule
      ('longBowAttackModifier', 'combatNotes.longBowPrecision', '+', '1');
    rules.defineRule
      ('longSwordAttackModifier', 'combatNotes.longSwordPrecision', '+', '1');
  } else if(name == 'Half-Elf') {
    rules.defineRule
      ('nonweaponProficiencyCount', 'skillNotes.survivalist', '+=', '1');
    rules.defineRule('skills.Survival', 'skillNotes.survivalist', '^=', '1');
  } else if(name == 'Mul') {
    rules.defineRule('skillNotes.raceSkillModifiers',
      raceLevel, '=',
        '"+5% Climb Walls/-5% Open Locks/+5% Move Silently/-5% Read Languages"'
      );
  } else if(name == 'Thri-kreen') {
    DarkSun2E.weaponRules(rules, 'Bite', 'Unarmed', 'd4+1', null);
    DarkSun2E.weaponRules(rules, 'Claws', 'Unarmed', 'd4', null);
    rules.defineRule('weaponProficiencyCount',
      raceLevel, '+', '2',
      'combatNotes.chatkchaFighter', '+', '1'
    );
    rules.defineRule('weaponProficiency.Bite', raceLevel, '=', '1');
    rules.defineRule('weaponProficiency.Claws', raceLevel, '=', '1');
    rules.defineRule
      ('weaponProficiency.Chatkcha', 'combatNotes.chatkchaFighter', '=', '1');
    rules.defineRule('weapons.Bite', raceLevel, '=', '1');
    rules.defineRule('weapons.Claws', raceLevel, '=', '1');
  }
};

/* Defines in #rules# the rules associated with magic school #name#. */
DarkSun2E.schoolRules = function(rules, name) {
  OldSchool.schoolRules(rules, name);
  // No changes needed to the rules defined by OldSchool method
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class and weight #weight# pounds
 */
DarkSun2E.shieldRules = function(rules, name, ac, weight) {
  OldSchool.shieldRules(rules, name, ac, weight);
  // No changes needed to the rules defined by OldSchool method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * basic ability #ability# plus #modifier#. #classes# lists the classes for
 * which this is a class skill; a value of "all" indicates that this is a class
 * skill for all classes.
 */
DarkSun2E.skillRules = function(rules, name, ability, modifier, classes) {
  OldSchool.skillRules(rules, name, ability, modifier, classes);
  // No changes needed to the rules defined by OldSchool method
};

/*
 * Defines in #rules# the rules associated with skill #name# that cannot be
 * derived directly from the abilities passed to skillRules.
 */
DarkSun2E.skillRulesExtra = function(rules, name) {
  OldSchool.skillRulesExtra(rules, name);
  // No changes needed to the rules defined by OldSchool method
};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a verbose
 * description of the spell's effects.
 */
DarkSun2E.spellRules = function(
  rules, name, school, casterGroup, level, description, duration, effect, range
) {
  OldSchool.spellRules(
    rules, name, school, casterGroup, level, description, duration, effect,
    range
  );
  // No changes needed to the rules defined by OldSchool method
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which belongs to
 * weapon category #category# (one of '1h', '2h', 'Li', 'R', 'Un' or their
 * spelled-out equivalents). The weapon does #damage# HP on a successful attack.
 * If specified, the weapon can be used as a ranged weapon with a range
 * increment of #range# feet.
 */
DarkSun2E.weaponRules = function(rules, name, category, damage, range) {
  OldSchool.weaponRules(rules, name, category, damage, range);
  // No changes needed to the rules defined by OldSchool method
};

/* Returns the elements in a basic OldSchool character editor. */
DarkSun2E.initialEditorElements = function() {
  let result = OldSchool.initialEditorElements('Second Edition');
  let abilityChoices = [
    5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
  ];
  for(let i = 0; i < result.length; i++) {
    if(result[i][0] in OldSchool.ABILITIES)
      result[i][3] = abilityChoices;
    else if(result[i][0] == 'weaponSpecialization')
      result[i][3] = ['None'].concat(QuilvynUtils.getKeys(DarkSun2E.WEAPONS));
  }
  let index = result.findIndex(x => x[0] == 'alignment');
  result.splice(index, 0, ['element', 'Element', 'select-one', ['Air', 'Earth', 'Fire', 'Water']]);
  result.splice(index, 0, ['defiler', '', 'checkbox', ['Defiler']]);
  return result;
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
DarkSun2E.randomizeOneAttribute = function(attributes, attribute) {
  let attr;
  let attrs;
  let choices;
  let howMany;
  let i;
  if(attribute == 'element') {
    attributes[attribute] =
      ['Air', 'Earth', 'Fire', 'Water'][QuilvynUtils.random(0, 3)];
  } else if(attribute == 'spells' &&
            ('levels.Cleric' in attributes ||
             'experiencePoints.Cleric' in attributes)) {
    attrs = this.applyRules(attributes);
    for(let level = 1; level < 8; level++) {
      attr = 'spellSlots.P' + level;
      if(!(attr in attrs))
        continue;
      howMany = attrs[attr];
      choices = [];
      for(let spell in this.getChoices('spells')) {
        if(!spell.includes('P' + level))
          continue;
        if('spells.' + spell in attrs)
          howMany--;
        else if(spell.includes('Cosmos') || spell.includes(attrs.element))
          choices.push(spell);
      }
      while(howMany > 0 && choices.length > 0) {
        i = QuilvynUtils.random(0, choices.length - 1);
        attributes['spells.' + choices[i]] = 1;
        choices.splice(i, 1);
        howMany--;
      }
    }
    // Call OldSchool in case of multiclass caster
    OldSchool.randomizeOneAttribute.apply(this, [attributes, attribute]);
  } else if(attribute == 'weapons' &&
            ('levels.Gladiator' in attributes ||
             'experiencePoints.Gladiator' in attributes)) {
    for(let w in this.getChoices('weapons'))
      attributes['weaponProficiency.' + w] = 1;
    OldSchool.randomizeOneAttribute.apply(this, [attributes, attribute]);
    for(let w in this.getChoices('weapons'))
      delete attributes['weaponProficiency.' + w];
  } else {
    OldSchool.randomizeOneAttribute.apply(this, [attributes, attribute]);
  }
};

/* Returns an array of plugins upon which this one depends. */
DarkSun2E.getPlugins = function() {
  return [OldSchool].concat(OldSchool.getPlugins());
};

/* Returns HTML body content for user notes associated with this rule set. */
DarkSun2E.ruleNotes = function() {
  return '' +
    '<h2>Quilvyn Second Edition Dark Sun Rule Set Notes</h2>\n' +
    'Quilvyn Second Edition Rule Set Version ' + DarkSun2E.VERSION + '\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    'Quilvyn\'s Second Edition Dark Sun rule set is unofficial ' +
    'Fan Content permitted under Wizards of the Coast\'s ' +
    '<a href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</a>.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Wizards of the Coast. Portions ' +
    'of the materials used are property of Wizards of the Coast. ©Wizards of ' +
    'the Coast LLC.\n' +
    '</p><p>\n' +
    'Dark Sun Rule Book © 1991 TSR Inc.\n' +
    '</p><p>\n' +
    'Advanced Dungeons & Dragons 2nd Edition Player\'s Handbook © 1989, ' +
    '1995, 2013 Wizards of the Coast LLC.\n' +
    '</p>\n';
};
