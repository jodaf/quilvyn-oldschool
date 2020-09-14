/*
Copyright 2020, James J. Hayes

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

"use strict";

var FirstEdition_VERSION = '2.0.2.1';

/*
 * This module loads the rules from the 1st Edition and 2nd Edition core rules,
 * and those from the Old School Reference and Index Compilation adaptation of
 * 1st Edition (OSRIC). The FirstEdition function contains methods that load
 * rules for particular parts of the rule book; raceRules for character races,
 * magicRules for spells, etc. These member methods can be called independently
 * in order to use a subset of the FirstEdition rules. Similarly, the constant
 * fields of FirstEdition (LANGUAGES, RACES, etc.) can be manipulated to modify
 * the choices.
 */
function FirstEdition() {

  if(window.SRD35 == null) {
    alert('The FirstEdition module requires use of the SRD35 module');
    return;
  }

  for(FirstEdition.EDITION in FirstEdition.EDITIONS) {

    var rules = new QuilvynRules(FirstEdition.EDITION, FirstEdition_VERSION);

    rules.defineChoice('choices', FirstEdition.CHOICES);
    rules.choiceEditorElements = FirstEdition.choiceEditorElements;
    rules.choiceRules = FirstEdition.choiceRules;
    rules.editorElements = SRD35.initialEditorElements();
    rules.getFormats = SRD35.getFormats;
    rules.makeValid = SRD35.makeValid;
    rules.randomizeOneAttribute = FirstEdition.randomizeOneAttribute;
    rules.defineChoice('random', FirstEdition.RANDOMIZABLE_ATTRIBUTES);
    rules.ruleNotes = FirstEdition.ruleNotes;

    SRD35.createViewers(rules, SRD35.VIEWERS);
    rules.defineChoice('extras', 'feats', 'sanityNotes', 'validationNotes');
    rules.defineChoice('preset', 'race');

    FirstEdition.abilityRules(rules);
    FirstEdition.combatRules
      (rules, FirstEdition.editedRules(FirstEdition.ARMORS, 'Armor'),
       FirstEdition.editedRules(FirstEdition.SHIELDS, 'Shield'),
       FirstEdition.editedRules(FirstEdition.WEAPONS, 'Weapon'));
    // Spell definition is handled by each individual class and domain. Schools
    // have to be defined before this can be done.
    FirstEdition.magicRules
      (rules, FirstEdition.editedRules(FirstEdition.SCHOOLS, 'School'), {});
    // Feats must be defined before bloodlines
    FirstEdition.talentRules
      (rules, FirstEdition.editedRules(FirstEdition.FEATURES, 'Feature'),
       FirstEdition.editedRules(FirstEdition.LANGUAGES, 'Language'),
       FirstEdition.editedRules(FirstEdition.SKILLS, 'Skill'));
    FirstEdition.identityRules(
      rules, FirstEdition.editedRules(FirstEdition.ALIGNMENTS, 'Alignment'),
      FirstEdition.editedRules(FirstEdition.CLASSES, 'Class'),
      FirstEdition.editedRules(FirstEdition.GENDERS, 'Gender'),
      FirstEdition.editedRules(FirstEdition.RACES, 'Race'));
    FirstEdition.goodiesRules(rules);

    // Remove some editor elements that don't apply
    rules.defineEditorElement('animalCompanion');
    rules.defineEditorElement('animalCompanionName');
    rules.defineEditorElement('experience');
    rules.defineEditorElement('familiar');
    rules.defineEditorElement('familiarName');
    rules.defineEditorElement('familiarEnhancement');
    rules.defineEditorElement('levels');
    if(FirstEdition.EDITION != 'Second Edition')
      rules.defineEditorElement('skills');

    // Add additional elements to editor and sheet
    rules.defineEditorElement
      ('extraStrength', 'Extra Strength', 'text', [4], 'intelligence');
    rules.defineEditorElement
      ('experiencePoints', 'Experience', 'bag', 'levels', 'imageUrl');
    rules.defineEditorElement
      ('weaponProficiency', 'Weapon Proficiency', 'set', 'weapons', 'spells');
    if(FirstEdition.EDITION != 'First Edition') {
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
    var strengthMinorDie = FirstEdition.EDITION == 'Second Edition' ? 20 : 6;
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
    rules.defineSheetElement('Understand Spell', 'Spells Per Day', '<b>%N</b>: %V%');
    rules.defineSheetElement('Maximum Spells Per Level', 'Spells Per Day');

    Quilvyn.addRuleSet(rules);

  }

}
FirstEdition.EDITION = 'First Edition';
FirstEdition.EDITIONS = {
  'First Edition':'',
  'Second Edition':'',
  'OSRIC':''
};
FirstEdition.CHOICES = [
  'Alignment', 'Armor', 'Class', 'Feature', 'Gender', 'Language', 'Race',
  'School', 'Shield', 'Spell', 'Weapon'
];
// Note: the order here reflects dependencies among some of the attributes when
// generating random characters
FirstEdition.RANDOMIZABLE_ATTRIBUTES = [
  'charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom',
  'extraStrength', 'name', 'race', 'gender', 'alignment', 'levels',
  'languages', 'hitPoints', 'proficiencies', 'armor', 'shield', 'weapons',
  'spells'
];

FirstEdition.ALIGNMENTS = Object.assign({}, SRD35.ALIGNMENTS);
FirstEdition.ARMORS = {
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
FirstEdition.FEATURES = {
  // Class
  'Alert':'Section=combat Note="Surprised 1/6, surprise 1/2"',
  'Assassination':
    'Section=combat Note="Strike kills surprised target %V% - 5%/2 foe levels"',
  'Attract Followers':
    'Section=feature Note="May build stronghold and attract followers"',
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
    'Section=magic Note="R40\' %V% chance of charming creatures while playing (save 1 rd)"',
  'Clear Mind':
    'Section=save Note="%V% resistance to beguiling, charm, hypnosis and suggestion spells"',
  'Cleric Spell Failure':'Section=magic Note="%V%"',
  'Controlled Movement':
    'Section=save Note="Immune <i>Haste</i> and <i>Slow</i>"',
  'Cure Disease':'Section=magic Note="<i>Cure Disease</i> %V/wk"',
  'Defensive Song':
    'Section=magic Note="Counteract song attacks, soothe shriekers"',
  'Detect Evil':'Section=magic Note="R60\' <i>Detect Evil</i> at will"',
  'Diamond Body':'Section=save Note="Immune to poison"',
  'Discriminating':
    'Section=feature Note="Must not associate w/non-good characters"',
  'Disguise':'Section=feature Note="92%+ chance of successful disguise"',
  'Divine Health':'Section=save Note="Immune to disease"',
  'Divine Protection':
    'Section=save Note="+2 Breath/+2 Death/+2 Petrification/+2 Spell/+2 Wand"',
  'Dodge Missiles':
    'Section=combat Note="Petrification save to dodge non-magical missiles"',
  'Double Specialization':
    'Section=combat Note="+3 %V Attack Modifier/+3 %V Damage Modifier"',
  'Eldritch Craft':
    'Section=magic Note="May create magical potions and scrolls and recharge rods, staves, and wands"',
  'Eldritch Power':'Section=magic Note="May use <i>Enchant An Item</i> spell"',
  'Evasion':
    'Section=save Note="Successful save yields no damage instead of half"',
  'Favored Enemy':
    'Section=combat Note="+%V melee damage vs. evil humanoids and giant foes"',
  'Feign Death':'Section=feature Note="Appear dead for %V tn"',
  'Fey Immunity':'Section=save Note="Immune to fey enchantment"',
  'Fighting The Unskilled':
    'Section=combat Note="%V attacks/rd vs. creatures with lt 1d8 hit die"',
  'Flurry Of Blows':'Section=combat Note="%V unarmed attacks/rd"',
  'Free Will':'Section=save Note="Immune <i>Geas</i> and <i>Quest</i> spells"',
  'Improved Evasion':'Section=save Note="Failed save yields half damage"',
  'Killing Blow':
    'Section=combat Note="%V+foe AC % chance of killing w/Stunning Blow"',
  'Lay On Hands':'Section=magic Note="Touch heals %V HP 1/dy"',
  'Legend Lore':
    'Section=feature Note="%V% chance of info about legendary item, person, place"',
  'Loner':'Section=feature Note="Will not work with gt 2 other rangers"',
  'Masked Mind':'Section=save Note="%V% resistance to ESP"',
  'Nature Knowledge':
    'Section=feature Note="Identify plant and animal types, determine water purity"',
  'Nonmaterialist':
    'Section=feature Note="Owns le 10 magic items w/1 armor suit and 1 shield"',
  'Philanthropist':
    'Section=feature Note="Donate 10% of gross income, 100% net to LG causes"',
  'Poetic Inspiration':
    'Section=magic Note="Performance gives allies +1 attack, +10% morale for 1 tn after 2 rd"',
  'Precise Blow':'Section=combat Note="+%V weapon damage"',
  'Protection From Evil':
    'Section=magic Note="Continuous <i>Protection From Evil</i> 10\' radius"',
  'Purity Of Body':'Section=save Note="Immune to normal disease"',
  'Quivering Palm':
    'Section=combat Note="Touched w/fewer hit dice dies w/in %V dy 1/wk"',
  'Read Scrolls':'Section=magic Note="Cast arcane spells from scrolls"',
  'Resist Fire':'Section=save Note="+2 vs. fire"',
  'Resist Lightning':'Section=save Note="+2 vs. lightning"',
  'Rogue Skills':
    'Section=skill Note="+%1 Climb Walls/+%2 Find Traps/+%3 Hear Noise/+%4 Hide In Shadows/+%5 Move Silently/+%6 Open Locks/+%7 Pick Pockets/+%8 Read Languages"',
  'Scrying':'Section=magic Note="May use scrying magic items"',
  'Selective':'Section=feature Note="Must employ only good henchmen"',
  'Shapeshift':
    'Section=magic Note="Change into natural animal 3/dy, healing d6x10% HP"',
  'Slow Fall':'Section=save Note="No damage from fall of %1 w/in %2\' of wall"',
  'Speak With Animals':'Section=magic Note="<i>Speak With Animals</i> at will"',
  'Speak With Plants':'Section=magic Note="<i>Speak With Plants</i> at will"',
  'Spiritual':
    'Section=feature Note="Must donate net income to religious institution"',
  'Steel Mind':'Section=save Note="Resist telepathy and mind blast as int 18"',
  'Stunning Blow':
     'Section=combat Note="Foe stunned for 1d6 rd when unarmed attack succeeds by ge 5"',
  'Summon Warhorse':
    'Section=feature Note="Call warhorse w/enhanced features"',
  'Track':
    'Section=feature Note="90% rural, 65% urban or dungeon base chance creature tracking"',
  'Travel Light':
    'Section=feature Note="Will not possess more than can be carried"',
  'Turn Undead':
    'Section=combat Note="2d6 undead turned, destroyed (good) or controlled (evil)"',
  'Unburdened':'Section=feature Note="Own le 5 magic items"',
  'Weapon Specialization':
     'Section=combat Note="+%1 %V Attack Modifier/+%2 %V Damage Modifier/+%3 attacks/rd"',
  'Wholeness Of Body':'Section=magic Note="Heal 1d4+%V damage to self 1/dy"',
  'Wilderness Movement':
     'Section=ability Note="Normal, untrackable move through undergrowth"',
  // Race
  'Bow Precision':
    'Section=combat Note="+1 Composite Long Bow Attack Modifier/+1 Composite Short Bow Attack Modifier/+1 Long Bow Attack Modifier/+1 Short Bow Attack Modifier"',
  'Burrow Tongue':'Section=feature Note="Speak w/burrowing animals"',
  'Deadly Aim':
    'Section=combat Note="+3 Composite Long Bow Attack Modifier/+3 Composite Short Bow Attack Modifier/+3 Long Bow Attack Modifier/+3 Short Bow Attack Modifier/+3 Sling Attack Modifier"',
  'Detect Secret Doors':
    'Section=feature Note="1in6 passing, 2in6 searching, 3in6 concealed"',
  'Direction Sense':'Section=feature Note="50% Determine North underground"',
  'Dwarf Ability Adjustment':
    'Section=ability Note="+1 Constitution/-1 Charisma"',
  'Dwarf Dodge':'Section=combat Note="-4 AC vs. giant, ogre, titan, troll"',
  'Dwarf Enmity':'Section=combat Note="+1 attack vs. goblinoid and orc"',
  'Dwarf Skill Modifiers':
    'Section=skill Note="-10 Climb Walls/+15 Find Traps/+10 Open Locks/-5 Read Languages"',
  'Elf Ability Adjustment':
    'Section=ability Note="+1 Dexterity/-1 Constitution"',
  'Elf Skill Modifiers':
    'Section=skill Note="+5 Hear Noise/+10 Hide In Shadows/+5 Move Silently/-5 Open Locks/+5 Pick Pockets"',
  'Gnome Dodge':
    'Section=combat Note="-4 AC vs. bugbear, giant, gnoll, ogre, titan, troll"',
  'Gnome Enmity':'Section=combat Note="+1 attack vs. goblins and kobolds"',
  'Gnome Skill Modifiers':
    'Section=skill Note="-15 Climb Walls/+10 Find Traps/+10 Hear Noise/+5 Hide In Shadows/+5 Move Silently/+5 Open Locks"',
  'Half-Elf Skill Modifiers':
    'Section=skill Note="+5 Hide In Shadows/+10 Pick Pockets"',
  'Half-Orc Ability Adjustment':
    'Section=ability Note="+1 Strength/+1 Constitution/-2 Charisma"',
  'Half-Orc Skill Modifiers':
    'Section=skill Note="+5 Climb Walls/+5 Find Traps/+5 Hear Noise/+5 Open Locks/-5 Pick Pockets/-10 Read Languages"',
  'Halfling Ability Adjustment':
    'Section=ability Note="+1 Dexterity/-1 Strength"',
  'Halfling Skill Modifiers':
    'Section=skill Note="-15 Climb Walls/+5 Find Traps/+5 Hear Noise/+15 Hide In Shadows/+10 Move Silently/+5 Open Locks/+5 Pick Pockets/-5 Read Languages"',
  'Infravision':'Section=feature Note="60\' vision in darkness"',
  'Know Depth':
    'Section=feature Note="%V% Determine approximate depth underground"',
  'Resist Charm':'Section=save Note="%V% vs. charm"',
  'Resist Magic':'Section=save Note="+%V Spell/+%V Wand"',
  'Resist Poison':'Section=save Note="+%V vs. poison"',
  'Resist Sleep':'Section=save Note="%V% vs. sleep"',
  'Sense Construction':
    'Section=feature Note="R10\' 75% Detect new construction, 66% sliding walls"',
  'Sense Hazard':
    'Section=feature Note="R10\' 70% Detect unsafe wall, ceiling, floor"',
  'Sense Slope':'Section=feature Note="R10\' %V% Detect slope and grade"',
  'Stealthy':'Section=combat Note="4in6 surprise when traveling quietly"',
  'Sword Precision':
    'Section=combat Note="+1 Long Sword Attack Modifier/+1 Short Sword Attack Modifier"',
  'Trap Sense':'Section=feature Note="R10\' 50% Detect stonework traps"'
};
FirstEdition.GENDERS = Object.assign({}, SRD35.GENDERS);
FirstEdition.LANGUAGES = {
  'Common':'',
  "Druids' Cant":'',
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
FirstEdition.RACES = {
  'Dwarf':
    'Require=' +
      '"charisma <= 16","constitution >= 12","dexterity <= 17",' +
      '"strength >= 8" ' +
    'Features=' +
      '"1:Dwarf Ability Adjustment","1:Dwarf Dodge","1:Dwarf Enmity",' +
      '1:Infravision,"1:Know Depth","1:Resist Magic","1:Resist Poison",' +
      '"1:Sense Construction","1:Sense Slope","1:Trap Sense",' +
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
      '"1:Resist Poison","1:Sense Hazard","1:Sense Slope",' +
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
      '"1:Deadly Aim","1:Halfling Ability Adjustment",1:Infravision,' +
      '"1:Resist Magic","1:Resist Poison",1:Stealthy,' +
      '"rogueSkillLevel > 0 ? 1:Halfling Skill Modifiers" ' +
    'Languages=' +
      'Common,Dwarf,Gnome,Goblin,Halfling,Orc',
  'Human':
    'Languages=' +
      'Common'
};
FirstEdition.SCHOOLS = Object.assign({}, SRD35.SCHOOLS);
FirstEdition.SHIELDS = {
  'None':'AC=0 Weight=0',
  'Large Shield':'AC=1 Weight=10',
  'Medium Shield':'AC=1 Weight=8',
  'Small Shield':'AC=1 Weight=5'
};
FirstEdition.SKILLS = {
  'Climb Walls':'Ability=strength Class=Assassin,Monk,Thief',
  'Find Traps':'Ability=dexterity Class=Assassin,Monk,Thief',
  'Hear Noise':'Ability=wisdom Class=Assassin,Monk,Thief',
  'Hide In Shadows':'Ability=dexterity Class=Assassin,Monk,Thief',
  'Move Silently':'Ability=dexterity Class=Assassin,Monk,Thief',
  'Open Locks':'Ability=dexterity Class=Assassin,Monk,Thief',
  'Pick Pockets':'Ability=dexterity Class=Assassin,Thief',
  'Read Languages':'Ability=intelligence Class=Assassin,Thief'
};
// NOTE: Where class-based differences exist in descriptions of the same spell,
// the version below with no class specifier contains the Magic User attributes
// where applicable, the Cleric attributes otherwise.
FirstEdition.SPELLS = {
  'Aerial Servant':
    'School=Conjuration ' +
    'Description="R10\' Summoned servant fetches request within $L days"',
  'Affect Normal Fires':
    'School=Transmutation ' +
    'Description="R$L5\' Change size of up to 1.5\' radius fire from candle flame to 1.5\' radius for $L rd"',
  'Airy Water':
    'School=Transmutation ' +
    'Description="Water in 10\' radius around self breathable for $L tn"',
  'Alter Reality':
    'School=Illusion ' +
    'Description="Use <i>Phantasmal Force</i> to fulfill limited wish"',
  'Animal Friendship':
    'School=Enchantment ' +
    'Description="R10\' Recruit animal companion (save neg)"',
  'Animal Growth':
    'School=Transmutation ' +
    'Description="R60\' Dbl (rev halve) size, HD, and damage of 8 animals for $L rd"',
  'Animal Growth(D5 Tran)':
    'School=Transmutation ' +
    'Description="R80\' Dbl (rev halve) size, HD, damage of 8 animals for $L2 rd"',
  'Animal Summoning I':
    'School=Conjuration ' +
    'Description="R$L120\' Draw 8 4 HD animals to assist"',
  'Animal Summoning II':
    'School=Conjuration ' +
    'Description="R$L180\' Draw 6 8 HD or 12 4 HD animals to assist"',
  'Animal Summoning III':
    'School=Conjuration ' +
    'Description="R$L240\' Draw 4 16 HD or 16 4 HD animals to assist"',
  'Animate Dead':
    'School=Necromancy ' +
    'Description="R10\' Animated remains of $L humanoids obey simple commands"',
  'Animate Object':
    'School=Transmutation ' +
    'Description="R30\' Target object obeys simple commands for $L rd"',
  'Animate Rock':
    'School=Transmutation ' +
    'Description="R40\' Target $L2\' cu rock obeys simple commands for $L rd"',
  'Anti-Animal Shell':
    'School=Abjuration ' +
    'Description="10\' radius blocks animal matter for $L tn"',
  'Anti-Magic Shell':
    'School=Abjuration ' +
    'Description="$L5\' radius allows no magic inside, moves with self for $L tn"',
  'Anti-Plant Shell':
    'School=Abjuration ' +
    'Description="Self 80\' radius blocks plant matter for $L tn"',
  'Antipathy/Sympathy':
    'School=Enchantment ' +
    'Description="R30\' $L10\'x$L10\' area or object attracts or repels specified creature type for $L12 tn (save reduces effect)"',
  'Arcane Spells Level 1':
    'School=Universal ' +
    'Description="Memorize ${lvl-7} first level MU spells"',
  'Astral Spell':
    'School=Transmutation ' +
    'Description="Self and 5 others leave bodies to travel astral plane"',
  'Atonement':
    'School=Abjuration ' +
    'Description="Touched relieved of consequences of unwilling alignment violation"',
  'Audible Glamer':
    'School=Illusion ' +
    'Description="R$L10plus60\' Sounds of ${(lvl-2)*4} shouting for $L2 rd (save disbelieve)"',
  'Audible Glamer(I1 Illu)':
    'School=Illusion ' +
    'Description="R$L10plus60\' Sounds of ${(lvl-2)*4} shouting for $L3 rd (save disbelieve)"',
  'Augury':
    'School=Divination ' +
    'Description="Self $Lplus70% chance of determining weal or woe of action in next 3 tn"',
  'Barkskin':
    'School=Transmutation ' +
    'Description="Touched +1 AC, non-spell saves for $Lplus4 rd"',
  'Blade Barrier':
    'School=Evocation ' +
    'Description="R30\' Whirling blade wall 8d8 HP to passers for $L3 rd"',
  'Bless':
    'School=Conjuration ' +
    'Description="R60\' Unengaged allies in 5\'x5\' area +1 attack and morale (rev foes -1) for 6 rds"',
  'Blindness':
    'School=Illusion ' +
    'Description="R30\' Target blinded (save neg)"',
  'Blink':
    'School=Transmutation ' +
    'Description="Self random teleport 2\'/rd for $L rd"',
  'Blur':
    'School=Illusion ' +
    'Description="Self +1 magical saves, foes -4 first attack, -2 thereafter for $Lplus3 rd"',
  'Burning Hands':
    'School=Transmutation ' +
    'Description="Self 3\' cone of flame $L HP"',
  'Cacodemon':
    'School=Conjuration ' +
    'Description="R10\' Summon demon or devil"',
  'Call Lightning':
    'School=Transmutation ' +
    'Description="R360\' Clouds release ${lvl+2}d8 (save half) 10\' bolt 1/tn for $L tn"',
  'Call Woodland Beings':
    'School=Conjuration ' +
    'Description="R$L30plus360\' Draw forest denizens to assist (save neg)"',
  'Change Self':
    'School=Illusion ' +
    'Description="Self take any humanoid appearance for 2d6+$L2 rd"',
  'Chant':
    'School=Conjuration ' +
    'Description="R30\' Allies +1 attack, damage, saves (foes -1) as long as chant lasts"',
  'Chaos':
    'School=Enchantment ' +
    'Description="R$L5\' Creatures in 40\'x40\' area unpredictable for $L rd (save neg)"',
  'Chariot Of Fire':
    'School=Evocation ' +
    'Description="R10\' Flaming chariot and horse pair (ea AC 2, HP 30) drive self and 8 others 240\'/rd, fly 480\'/rd for $Lplus6 tn"',
  'Charm Monster':
    'School=Enchantment ' +
    'Description="R60\' Target creature treats self as trusted friend (save neg)"',
  'Charm Person Or Mammal':
    'School=Enchantment ' +
    'Description="R80\' Target mammal treats self as trusted friend (save neg)"',
  'Charm Person':
    'School=Enchantment ' +
    'Description="R120\' Target humanoid treats self as trusted friend (save neg)"',
  'Charm Plants':
    'School=Enchantment ' +
    'Description="R30\' Command plants in 30\'x10\' area for 1 tn (save neg)"',
  'Clairaudience':
    'School=Divination ' +
    'Description="Hear remote known location for $L rd"',
  'Clairvoyance':
    'School=Divination ' +
    'Description="See remote known location for $L rd"',
  'Clenched Fist':
    'School=Evocation ' +
    'Description="R$L5\' Force absorbs attacks, strikes foes 1d6-4d6 HP for conc or $L rd"',
  'Clone':
    'School=Necromancy ' +
    'Description="Grow copy of target creature, each destroy the other or insane"',
  'Cloudkill':
    'School=Evocation ' +
    'Description="R10\' Poisonous 40\'x20\'x20\' cloud kills (5+2 HD save, 4+1 HD -4 save neg) moves 10\'/rd for $L rd"',
  'Color Spray':
    'School=Transmutation ' +
    'Description="Targets in $L10\' cone unconscious (lt $Lplus1 HD), blinded 1d4 rd ($Lplus1-$Lplus2) or stunned 2d4 seg (gt $Lplus2) (save neg)"',
  'Command':
    'School=Enchantment ' +
    'Description="R10\' Target obeys single-word command (save neg for Int 13+/HD 6+)"',
  'Commune':
    'School=Divination ' +
    'Description="Self deity answers $L yes/no questions"',
  'Commune With Nature':
    'School=Divination ' +
    'Description="Self discern nature info in ${lvl/2} mi radius"',
  'Comprehend Languages':
    'School=Transmutation ' +
    'Description="Self understand unknown writing and speech for $L5 rd (rev obscures)"',
  'Cone Of Cold':
    'School=Evocation ' +
    'Description="Self $L5\'-long cone ${lvl}d4+$L HP (save half)"',
  'Confusion':
    'School=Enchantment ' +
    'Description="R120\' 2d8 or more creatures in 60\'x60\' area unpredictable for $Lplus2 rd"',
  'Confusion(D7 Ench)':
    'School=Enchantment ' +
    'Description="R80\' 2d4 or more creatures in 20\' radius unpredictable for $L rd"',
  'Confusion(I4 Ench)':
    'School=Enchantment ' +
    'Description="R80\' 2d8 or more creatures in 40\'x40\' area unpredictable for $L rd"',
  'Conjure Animals':
    'School=Conjuration ' +
    'Description="R30\' $L HD of animals appear and fight for $L2 rd"',
  'Conjure Animals(I6 Conj)':
    'School=Conjuration ' +
    'Description="R30\' $L HD of animals appear and fight for $L rd"',
  'Conjure Earth Elemental':
    'School=Conjuration ' +
    'Description="R40\' 16 HD elemental assists for $L tn (rev dismisses)"',
  'Conjure Elemental':
    'School=Conjuration ' +
    'Description="R60\' Summoned elemental obeys commands for conc or $L tn"',
  'Conjure Fire Elemental':
    'School=Conjuration ' +
    'Description="R80\' 16 HD elemental assists for $L tn (rev dismisses)"',
  'Contact Other Plane':
    'School=Divination ' +
    'Description="Self gain answers to ${Math.floor(lvl/2)} yes/no questions"',
  'Continual Darkness':
    'School=Transmutation ' +
    'Description="R60\' 30\' radius opaque"',
  'Continual Light':
    'School=Transmutation ' +
    'Description="R60\' Target centers 60\' radius light (rev darkness) until dispelled"',
  'Continual Light(C3 Tran)':
    'School=Transmutation ' +
    'Description="R120\' Target centers 60\' radius light (rev darkness) until dispelled"',
  "Control Temperature 10' Radius":
    'School=Transmutation ' +
    'Description="Change temperature in 10\' radius by $L9 deg F for $Lplus4 tn"',
  'Control Weather':
    'School=Transmutation ' +
    'Description="Self controls precipitation, temp, and wind within 4d4 mi sq for 4d6 hr"',
  'Control Weather(C7 Tran)':
    'School=Transmutation ' +
    'Description="Self controls precipitation, temp, and wind within 4d4 mi sq for 4d12 hr"',
  'Control Weather(D7 Tran)':
    'School=Transmutation ' +
    'Description="Self controls precipitation, temp, and wind within 4d8 mi sq for 8d12 hr"',
  'Control Winds':
    'School=Transmutation ' +
    'Description="Winds in 40\' radius speed/slow $L3 mph/rd for $L tn"',
  'Create Food And Water':
    'School=Transmutation ' +
    'Description="R10\' Creates $L3 person/days food and drink"',
  'Create Water':
    'School=Transmutation ' +
    'Description="R10\' Creates (rev destroys) $L4 gallons potable water"',
  'Creeping Doom':
    'School=Conjuration ' +
    'Description="R10\' Bugs erupt, attack w/in 80\' for $L4 rd"',
  'Crushing Hand':
    'School=Evocation ' +
    'Description="R$L5\' Force absorbs attacks, squeezes 1d10-4d10 HP for $L rd"',
  'Cure Blindness':
    'School=Abjuration ' +
    'Description="Touched cured of blindness (rev blinds) (save neg)"',
  'Cure Critical Wounds':
    'School=Necromancy ' +
    'Description="Touched heals 3d8+1 HP (rev inflicts)"',
  'Cure Disease':
    'School=Necromancy ' +
    'Description="Touched cured of disease (rev infects) (save neg)"',
  'Cure Light Wounds':
    'School=Necromancy ' +
    'Description="Touched heals d8 HP (rev inflicts)"',
  'Cure Serious Wounds':
    'School=Necromancy ' +
    'Description="Touched heals 2d8+1 HP (rev inflicts)"',
  'Dancing Lights':
    'School=Transmutation ' +
    'Description="R$L10plus40\' Up to 4 movable lights for $L2 rd"',
  'Darkness':
    'School=Transmutation ' +
    'Description="R$L10\' 15\' radius lightless for $Lplus10 rd"',
  'Darkness(I1 Tran)':
    'School=Transmutation ' +
    'Description="R$L10plus40\' 15\' radius lightless for 2d4+$L rd"',
  'Deafness':
    'School=Illusion ' +
    'Description="R60\' Target deafened (save neg)"',
  'Death Spell':
    'School=Necromancy ' +
    'Description="R$L10\' Kills creatures lt 9 HD in $L25\' sq area"',
  'Delayed Blast Fireball':
    'School=Evocation ' +
    'Description="R$L10plus100\' ${lvl}d6+$L HP in 20\' radius (save half) after up to 5 min"',
  'Demi-Shadow Magic':
    'School=Illusion ' +
    'Description="R$L10plus60\' Mimics <i>Cloudkill</i> (die, save neg), <i>Cone Of Cold</i> (${lvl}d4+$L HP), <i>Fireball</i> (${lvl}d6 HP), <i>Lightning Bolt</i> (${lvl}d6 HP), <i>Magic Missile</i> (${Math.floor((lvl+1)/2)}x1d4+1 HP) (ea save $L2 HP), <i>Wall Of Fire</i> (2d6+$L HP, save ${lvl}d4), or <i>Wall Of Ice</i>"',
  'Demi-Shadow Monsters':
    'School=Illusion ' +
    'Description="R30\' Create monsters $L HD total, 40% HP (save AC 8, 40% damage) for $L rd"',
  'Detect Charm':
    'School=Divination ' +
    'Description="Self discern up to 10 charmed creatures in 30\' for 1 tn (rev shields 1 target)"',
  'Detect Evil':
    'School=Divination ' +
    'Description="Self discern evil (rev good) in 10\'x60\' path for $L5 rd"',
  'Detect Evil(C1 Divi)':
    'School=Divination ' +
    'Description="Self discern evil (rev good) in 10\'x120\' path for $L5plus10 rd"',
  'Detect Illusion':
    'School=Divination ' +
    'Description="Self discern illusions in 10\'x$L10\' path, touching reveals to others for $L2plus3 rd"',
  'Detect Invisibility':
    'School=Divination ' +
    'Description="Self see invisible objects in 10\'x$L10\' path for $L5 rd"',
  'Detect Lie':
    'School=Divination ' +
    'Description="R30\' Target discerns lies for $L rd (rev makes lies believable)"',
  'Detect Magic':
    'School=Divination ' +
    'Description="Self discern magical auras in 10\'x60\' path for $L2 rd"',
  'Detect Magic(C1 Divi)':
    'School=Divination ' +
    'Description="Self discern magical auras in 10\'x30\' path for 10 rd"',
  'Detect Magic(D1 Divi)':
    'School=Divination ' +
    'Description="Self discern magical auras in 10\'x40\' path for 12 rd"',
  'Detect Pits And Snares':
    'School=Divination ' +
    'Description="Self discern outdoor traps, indoor pits in 10\'x40\' path for $L4 rd"',
  'Dig':
    'School=Evocation ' +
    'Description="R30\' Excavate 5\' cube/rd for $L rd"',
  'Dimension Door':
    'School=Transmutation ' +
    'Description="Self teleport $L30\'"',
  'Disintegrate':
    'School=Transmutation ' +
    'Description="R$L5\' Obliterates matter up to $L100\' sq (save neg)"',
  'Dispel Exhaustion':
    'School=Illusion ' +
    'Description="4 Touched regain 50% HP, dbl speed for $L3 tn"',
  'Dispel Evil':
    'School=Abjuration ' +
    'Description="Return evil (rev good) creatures to home plane (save neg, -7 attack caster for $L rd)"',
  'Dispel Illusion':
    'School=Abjuration ' +
    'Description="R$L10\' Dispel one illusion, $L2plus50% dispel one magic"',
  'Dispel Magic':
    'School=Abjuration ' +
    'Description="R120\' 50% (+5%/-2% per caster level delta) magic in 30\'x30\' area extinguished"',
  'Dispel Magic(C3 Abju)':
    'School=Abjuration ' +
    'Description="R60\' 50% (+5%/-2% per caster level delta) magic in 30\'x30\' area extinguished"',
  'Dispel Magic(D4 Abju)':
    'School=Abjuration ' +
    'Description="R80\' 50% (+5%/-2% per caster level delta) magic in 40\'x40\' area extinguished"',
  'Distance Distortion':
    'School=Transmutation ' +
    'Description="R$L10\' Travel through $L100\' sq area half or dbl for $L tn"',
  'Divination':
    'School=Divination ' +
    'Description="Self $Lplus60% chance discern info about known location"',
  'Duo-Dimension':
    'School=Transmutation ' +
    'Description="Self 2D, take 3x damage from front/back, for $Lplus3 rd"',
  'ESP':
    'School=Divination ' +
    'Description="R$L5max90\' Self hear surface thoughts for $L rd"',
  'Earthquake':
    'School=Transmutation ' +
    'Description="R120\' Intense shaking in $L5\' diameter for 1 rd"',
  'Emotion':
    'School=Enchantment ' +
    'Description="R$L10\' Targets in 40\'x40\' area experience fear (flee), hate (+2 save/attack/damage), hopelessness (walk away or surrender), or rage (+1 attack, +3 damage, +5 HP) for conc"',
  'Enchant An Item':
    'School=Conjuration ' +
    'Description="Touched item becomes magical"',
  'Enchanted Weapon':
    'School=Transmutation ' +
    'Description="Touched weapon magical (no bonus) for $L5 rd"',
  'Enlarge':
    'School=Transmutation ' +
    'Description="R$L5\' Creature grows $L20max200% or object $L10max100% for $L tn (rev shrinks, save neg)"',
  'Entangle':
    'School=Transmutation ' +
    'Description="R80\' Plants in 20\' radius hold passers (save half move) for 1 tn"',
  'Erase':
    'School=Transmutation ' +
    'Description="R30\' Erase magical ($L2plus50% chance) or normal ($L4plus50%) from 2-page area"',
  'Exorcise':
    'School=Abjuration ' +
    'Description="R10\' Target relieved of supernatural inhabitant and influence"',
  'Explosive Runes':
    'School=Transmutation ' +
    'Description="Reading runes on touched 6d4+6 HP to reader (no save), 10\' radius (save half)"',
  'Extension I':
    'School=Transmutation ' +
    'Description="Existing level 1-3 spell lasts 50% longer"',
  'Extension II':
    'School=Transmutation ' +
    'Description="Existing level 1-4 spell lasts 50% longer"',
  'Extension III':
    'School=Transmutation ' +
    'Description="Existing level 1-3 spell lasts 100% longer or level 4-5 50%"',
  'Faerie Fire':
    'School=Transmutation ' +
    'Description="R80\' Outlines targets, allowing +2 attack, for $L4 rd"',
  'False Trap':
    'School=Illusion ' +
    'Description="Touched appears trapped (observer save disbelieve)"',
  'Fear':
    'School=Illusion ' +
    'Description="Targets in 60\' cone flee for $L rd (save neg)"',
  'Feather Fall':
    'School=Transmutation ' +
    'Description="R$L10\' Objects in 10\'x10\'x10\' area fall 2\'/sec for $L6 secs"',
  'Feeblemind':
    'School=Enchantment ' +
    'Description="R$L10\' Target Int reduced (save Cleric +1, Druid -1, MU/Illusionist -4 neg)"',
  'Feeblemind(D6 Ench)':
    'School=Enchantment ' +
    'Description="R40\' Target Int reduced (save Cleric +1, Druid -1, MU/Illusionist -4 neg)"',
  'Feign Death':
    'School=Necromancy ' +
    'Description="Touched appears dead, takes half damage, immune draining for $Lplus6 rd"',
  'Feign Death(C3 Necr)':
    'School=Necromancy ' +
    'Description="Touched appears dead, takes half damage, immune draining for $Lplus10 rd"',
  'Feign Death(D2 Necr)':
    'School=Necromancy ' +
    'Description="R10\' Target appears dead, takes half damage, immune draining for $L2plus4 rd"',
  'Find Familiar':
    'School=Conjuration ' +
    'Description="Call beast to serve as familiar (HP 1d3+1, AC 7)"',
  'Find The Path':
    'School=Divination ' +
    'Description="Touched knows shortest route into and out of location for $L tn (rev causes indirection)"',
  'Find Traps':
    'School=Divination ' +
    'Description="Detect traps in 10\'x30\' area for 3 tn"',
  'Finger Of Death':
    'School=Enchantment ' +
    'Description="R60\' Target dies (save neg)"',
  'Fire Charm':
    'School=Enchantment ' +
    'Description="R10\' Fire mesmerizes viewers (save neg) in 15\' radius, makes suggestible for $L2 rd"',
  'Fire Seeds':
    'School=Conjuration ' +
    'Description="R40\' Acorn missiles 2d8 HP in 5\' area, holly berries 1d8 in 5\' sq for $L tn (save half)"',
  'Fire Shield':
    'School=Evocation ' +
    'Description="Self +2 save and half damage vs. fire (rev cold), dbl damage vs. cold (rev fire) for $Lplus2 rd"',
  'Fire Storm':
    'School=Evocation ' +
    'Description="R150\' Fire in $L8000\' cu  area 2d8 HP for 1 rd (save half) (rev extinguishes)"',
  'Fire Trap':
    'School=Evocation ' +
    'Description="Touched causes 1d4+$L HP in 5\' radius when opened (save half)"',
  'Fireball':
    'School=Evocation ' +
    'Description="R$L10plus100\' ${lvl}d6 HP in 20\' radius (save half)"',
  'Flame Arrow':
    'School=Evocation ' +
    'Description="Touched arrow 1 HP fire damage within $L6 secs"',
  'Flame Strike':
    'School=Evocation ' +
    'Description="R60\' 5\' radius fire column 6d8 HP (save half)"',
  'Floating Disk':
    'School=Evocation ' +
    'Description="3\' diameter disk holds $L100 lbs, follows self w/in 20\' for $Lplus3 tn"',
  'Fly':
    'School=Transmutation ' +
    'Description="Touched can fly 120\'/rd for 1d6+$L6 tn"',
  'Fog Cloud':
    'School=Transmutation ' +
    'Description="R10\' Fog in 40\'x20\'x20\' area obscures vision, moves 10\'/rd for $Lplus4 rd"',
  "Fool's Gold":
    'School=Transmutation ' +
    'Description="R10\' Copper and brass become gold for $L hr (observer save disbelieve)"',
  'Forceful Hand':
    'School=Evocation ' +
    'Description="R$L10\' Force absorbs attacks, pushes away for $L rd"',
  'Forget':
    'School=Enchantment ' +
    'Description="R30\' 4 targets in 20\' sq forget last ${Math.floor(lvl/3)+1} rd (save neg)"',
  'Freezing Sphere':
    'School=Transmutation ' +
    'Description="Freeze $L100\' sq water for $L rd, cold ray $L4 hp (save neg) in $L10\' path, or cold grenade 4d6 HP (save half) in 10\' radius"',
  'Friends':
    'School=Enchantment ' +
    'Description="Self Charisma +2d4 to all within $L10plus10\' radius (save Cha -1d4) for $L rd"',
  'Fumble':
    'School=Enchantment ' +
    'Description="R$L10\' Target falls and drops carried (save slowed) for $L rd"',
  'Gate':
    'School=Conjuration ' +
    'Description="R30\' Summon named extraplanar creature"',
  'Gaze Reflection':
    'School=Transmutation ' +
    'Description="Gaze attacks reflected back for 1 rd"',
  'Geas':
    'School=Enchantment ' +
    'Description="Touched fulfill quest or sicken and die in 1d4 wk"',
  'Glass-Steel':
    'School=Transmutation ' +
    'Description="Touched $L10 lb glass gains steel strength"',
  'Glasseye':
    'School=Transmutation ' +
    'Description="Touched 3\'x2\' area (metal 4\" depth, stone 6\', wood 20\') becomes transparent for $L rd"',
  'Globe Of Invulnerability':
    'School=Abjuration ' +
    'Description="Self 5\' radius blocks spells level 1-4 for $L rd"',
  'Glyph Of Warding':
    'School=Abjuration ' +
    'Description="Touching $L25\' sq causes $L2 HP energy (save half or neg)"',
  'Grasping Hand':
    'School=Evocation ' +
    'Description="R$L10\' Force absorbs attacks, restrains for $L rd"',
  'Guards And Wards':
    'School=Abjuration ' +
    'Description="Multiple effects protect $L200\' sq area for $L2 hr"',
  'Gust Of Wind':
    'School=Transmutation ' +
    'Description="Wind in 10\'x$L10\' path extinguishes flames, moves small objects for 6 secs"',
  'Hallucinatory Forest':
    'School=Illusion ' +
    'Description="R80\' Illusion of $L40\' sq forest"',
  'Hallucinatory Terrain':
    'School=Illusion ' +
    'Description="R$L20\' $L10\'x$L10\' area mimics other terrain until touched"',
  'Hallucinatory Terrain(I3 Illu)':
    'School=Illusion ' +
    'Description="R$L20plus20\' $L100plus1600\' sq area mimics other terrain until touched"',
  'Haste':
    'School=Transmutation ' +
    'Description="R60\' $L targets in 40\'x40\' area dbl speed for $Lplus3 rd"',
  'Heal':
    'School=Necromancy ' +
    'Description="Touched healed of all but 1d4 HP, cured of blindness, disease, feeblemind (rev causes disease and drains all but 1d4 HP)"',
  'Heat Metal':
    'School=Necromancy ' +
    'Description="R40\' Metal dangerously hot (rev cold) for 7 rd"',
  'Hold Animal':
    'School=Enchantment ' +
    'Description="R80\' Immobilize 4 animals for $L2 rd"',
  'Hold Monster':
    'School=Enchantment ' +
    'Description="R$L5\' Immobilize 4 creatures (save neg) for $L rd"',
  'Hold Person':
    'School=Enchantment ' +
    'Description="R120\' Immobilize 1-4 medium targets (save neg) for $L2 rd"',
  'Hold Person(C2 Ench)':
    'School=Enchantment ' +
    'Description="R60\' Immobilize 1-3 medium targets (save neg) for $Lplus4 rd"',
  'Hold Plant':
    'School=Enchantment ' +
    'Description="R80\' Mobile plants in 16 sq yd immobile for $L rd"',
  'Hold Portal':
    'School=Transmutation ' +
    'Description="R$L20\' $L80\' sq item held shut for $L rd"',
  'Holy Word':
    'School=Conjuration ' +
    'Description="30\' radius banishes evil extraplanar, kills (lt 4 HD), paralyzes (4-7 HD), stuns (8-11 HD), deafens (gt 11 HD) non-good creatures (rev good)"',
  'Hypnotic Pattern':
    'School=Illusion ' +
    'Description="Viewers in 30\' sq totaling 25 HD transfixed for conc (save neg)"',
  'Hypnotism':
    'School=Enchantment ' +
    'Description="R30\' 1d6 targets subject to suggestion for $Lplus1 rd"',
  'Ice Storm':
    'School=Evocation ' +
    'Description="R$L10\' Hail in 40\'x40\' area 3d10 HP or sleet in 80\'x80\' area blinds, slows, causes falls for 1 rd"',
  'Identify':
    'School=Divination ' +
    'Description="$L5plus15% chance of determining magical properties of touched if used w/in $L hr, requires rest afterward"',
  'Illusionary Script':
    'School=Illusion ' +
    'Description="Obscured writing causes 5d4 rd confusion (save neg) for readers other than specified"',
  'Imprisonment':
    'School=Abjuration ' +
    'Description="Touched safely trapped underground permanently (rev frees)"',
  'Improved Invisibility':
    'School=Illusion ' +
    'Description="Touched invisible for $Lplus4 rd"',
  'Improved Phantasmal Force':
    'School=Illusion ' +
    'Description="R$L10plus60\' $L10plus160\' sq sight and sound illusion for conc + 2 rd"',
  'Incendiary Cloud':
    'School=Evocation ' +
    'Description="R30\' 20\' radius smoke cloud for 1d6+4 rd, ${Math.floor(lvl/2)}, $L, ${Math.floor(lvl/2)} HP rd 3, 4, 5 (save half)"',
  'Infravision':
    'School=Transmutation ' +
    'Description="Touched see 60\' in darkness for $Lplus2 hr"',
  'Insect Plague':
    'School=Conjuration ' +
    'Description="R360\' Stinging insects fill 180\' radius (lt 2 HD flee, 3-4 HD check morale) for $L tn"',
  'Insect Plague(D5 Conj)':
    'School=Conjuration ' +
    'Description="R320\' Stinging insects fill 160\' radius (lt 2 HD flee, 3-4 HD check morale) for $L tn"',
  'Instant Summons':
    'School=Conjuration ' +
    'Description="Prepared, unpossessed 8 lb item called to self hand"',
  'Interposing Hand':
    'School=Evocation ' +
    'Description="R$L10\' Force absorbs attacks, blocks passage for $L rd"',
  'Invisibility':
    'School=Illusion ' +
    'Description="Touched invisible until attacking"',
  "Invisibility 10' Radius":
    'School=Illusion ' +
    'Description="Creatures w/in 10\' of touched invisible until attacking"',
  'Invisibility To Animals':
    'School=Transmutation ' +
    'Description="Touched undetected by animals until attack/$Lplus10 rd"',
  'Invisible Stalker':
    'School=Conjuration ' +
    'Description="R10\' Conjured invisible creature performs 1 task"',
  'Irresistible Dance':
    'School=Enchantment ' +
    'Description="Touched -4 AC, fail saves for 1d4+1 rd"',
  'Jump':
    'School=Transmutation ' +
    'Description="Touched can jump 30\' forward, 10\' back or up ${Math.floor((lvl+2)/3)} times"',
  'Knock':
    'School=Transmutation ' +
    'Description="R60\' Open stuck, locked item"',
  'Know Alignment':
    'School=Divination ' +
    'Description="Self discern aura of 10 creatures for 1 tn (rev obscures)"',
  'Legend Lore':
    'School=Divination ' +
    'Description="Gain info about specified object, person, or place"',
  'Levitate':
    'School=Transmutation ' +
    'Description="R$L20\' Self move target up/down 20\'/rd for $L tn (save neg)"',
  'Light':
    'School=Transmutation ' +
    'Description="R60\' Target spot radiates 20\' radius light for $L tn (rev darkness half duration)"',
  'Light(C1 Tran)':
    'School=Transmutation ' +
    'Description="R120\' Target spot radiates 20\' radius light for $Lplus6 tn (rev darkness half duration)"',
  'Lightning Bolt':
    'School=Evocation ' +
    'Description="R$L10plus40\' Bolt ${lvl}d6 HP (save half)"',
  'Limited Wish':
    'School=Conjuration ' +
    'Description="Minor reshaping of reality"',
  'Locate Animals':
    'School=Divination ' +
    'Description="Self discern animals in 20\'x$L20\' area for $L rd"',
  'Locate Object':
    'School=Divination ' +
    'Description="R$L20\' Self find desired object for $L rd (rev obscures)"',
  'Locate Object(C3 Divi)':
    'School=Divination ' +
    'Description="R$L10plus60\' Self find desired object for $L rd (rev obscures)"',
  'Locate Plants':
    'School=Divination ' +
    'Description="Self discern plants in $L5\' radius for $L tn"',
  'Lower Water':
    'School=Transmutation ' +
    'Description="R80\' $L5\'x$L5\' fluid subsides by $L5% for $L5 rd (rev raises $L\')"',
  'Lower Water(C4 Tran)':
    'School=Transmutation ' +
    'Description="R120\' $L10\'x$L10\' fluid subsides by $L5% for $L tn (rev raises $L\')"',
  "Mage's Faithful Hound":
    'School=Conjuration ' +
    'Description="R10\' Invisible dog guards, attacks 3d6 HP w/in 30\' of self for $L2 rd"',
  "Mage's Sword":
    'School=Evocation ' +
    'Description="R30\' Control remote magic sword (19-20 hits, 5d4 HP) as F${Math.floor(lvl/2)} for $L rd"',
  'Magic Aura':
    'School=Illusion ' +
    'Description="Touched responds to <i>Detect Magic</i> for $L days"',
  'Magic Jar':
    'School=Necromancy ' +
    'Description="R$L10\' Self trap target soul and possess target body (save neg)"',
  'Magic Missile':
    'School=Evocation ' +
    'Description="R$L10plus60\' ${Math.floor((lvl+1)/2)} energy darts hit targets in 10\'x10\' area 1d4+1 HP ea"',
  'Magic Mouth':
    'School=Transmutation ' +
    'Description="Touched object responds to trigger by reciting 25 words"',
  'Major Creation':
    'School=Transmutation ' +
    'Description="R10\' Create $L\' cu object from component plant or mineral material for $L6 tn"',
  'Mass Charm':
    'School=Enchantment ' +
    'Description="R$L5\' $L2 HD creature(s) in 30\'x30\' area treat self as trusted friend (save neg)"',
  'Mass Invisibility':
    'School=Illusion ' +
    'Description="R$L10\' All in 30\' radius invisible until attacking"',
  'Mass Suggestion':
    'School=Enchantment ' +
    'Description="R$L10\' $L targets carry out reasonable suggestion for $L4plus4 tn"',
  'Massmorph':
    'School=Illusion ' +
    'Description="R$L10\' 10 humanoids look like trees"',
  'Maze':
    'School=Conjuration ' +
    'Description="R$L5\' Target sent to interdimensional maze for amount of time based on Int"',
  'Mending':
    'School=Transmutation ' +
    'Description="R30\' Repair small break"',
  'Message':
    'School=Transmutation ' +
    'Description="R$L10plus60\' remote whispering for ${(lvl+5)*6} secs"',
  'Meteor Swarm':
    'School=Evocation ' +
    'Description="R$L10plus40\' 4 meteors 10d4 HP in 15\' radius or 8 meteors 5d4 HP in 7.5\' radius (collateral save half)"',
  'Mind Blank':
    'School=Abjuration ' +
    'Description="R30\' Target immune divination for 1 dy"',
  'Minor Creation':
    'School=Transmutation ' +
    'Description="Create $L\' cu object from component plant material for $L6 tn"',
  'Minor Globe Of Invulnerability':
    'School=Abjuration ' +
    'Description="Self $L5\' radius blocks spells level 1-3 for $L rd"',
  'Mirror Image':
    'School=Illusion ' +
    'Description="Self 1d4 duplicates in 6\' radius draw attacks for $L2 rd"',
  'Mirror Image(I2 Illu)':
    'School=Illusion ' +
    'Description="Self 1d4 duplicates in 6\' radius draw attacks for $L3 rd"',
  'Misdirection':
    'School=Illusion ' +
    'Description="R30\' Divination spells cast on target return false info for $L rd"',
  'Mnemonic Enhancement':
    'School=Transmutation ' +
    'Description="Self retain 3 additional spell levels for 1 dy"',
  'Monster Summoning I':
    'School=Conjuration ' +
    'Description="R30\' 2d4 creatures appear in 1d4 rd, fight for $Lplus2 rd"',
  'Monster Summoning II':
    'School=Conjuration ' +
    'Description="R40\' 1d6 creatures appear in 1d4 rd, fight for $Lplus3 rd"',
  'Monster Summoning III':
    'School=Conjuration ' +
    'Description="R50\' 1d4 creatures appear in 1d4 rd, fight for $Lplus4 rd"',
  'Monster Summoning IV':
    'School=Conjuration ' +
    'Description="R60\' 1d4 creatures appear in 1d4 rd, fight for $Lplus5 rd"',
  'Monster Summoning V':
    'School=Conjuration ' +
    'Description="R70\' 1d2 creatures appear in 1d4 rd, fight for $Lplus6 rd"',
  'Monster Summoning VI':
    'School=Conjuration ' +
    'Description="R80\' 1d2 creatures appear in 1d4 rd, fight for $Lplus7 rd"',
  'Monster Summoning VII':
    'School=Conjuration ' +
    'Description="R90\' 1d2 creatures appear in 1d4 rd, fight for $Lplus8 rd"',
  'Move Earth':
    'School=Transmutation ' +
    'Description="R$L10\' Displace 64,000\' cu/tn"',
  'Neutralize Poison':
    'School=Transmutation ' +
    'Description="Touched detoxed (rev lethally poisoned, save neg)"',
  'Non-Detection':
    'School=Abjuration ' +
    'Description="5\' radius invisible to divination for $L tn"',
  'Obscurement':
    'School=Transmutation ' +
    'Description="Mist limits vision in $L100\' sq for $L4 rd"',
  'Paralyzation':
    'School=Illusion ' +
    'Description="R$L10\' Immobilize $L2 HD creatures in 400\' sq"',
  'Part Water':
    'School=Transmutation ' +
    'Description="R$L10\' Form $L30\'x$L20\' water trench for $L5 rd"',
  'Part Water(C6 Tran)':
    'School=Transmutation ' +
    'Description="R$L20\' Form $L30\'x$L20\' water trench for $L tn"',
  'Pass Plant':
    'School=Transmutation ' +
    'Description="Self teleport between trees w/in 300\'"',
  'Pass Without Trace':
    'School=Enchantment ' +
    'Description="Touched leaves no sign of passage for $L tn"',
  'Passwall':
    'School=Transmutation ' +
    'Description="R30\' Create 5\'x10\'x10\' passage through dirt and rock for $Lplus6 tn"',
  'Permanency':
    'School=Transmutation ' +
    'Description="Effects of spell made permanent, costs 1 Con"',
  'Permanent Illusion':
    'School=Illusion ' +
    'Description="R30\' $L100plus1600\' sq sight, sound, smell, temperature illusion"',
  'Phantasmal Force':
    'School=Illusion ' +
    'Description="R$L10plus80\' $L10plus80\' sq illusionary object for conc or until struck"',
  'Phantasmal Force(I1 Illu)':
    'School=Illusion ' +
    'Description="R$L10plus60\' $L10plus40\' sq illusionary object for conc or until struck"',
  'Phantasmal Killer':
    'School=Illusion ' +
    'Description="R$L5\' Nightmare illusion attacks target as HD 4, kills on hit for $L rd (save neg)"',
  'Phase Door':
    'School=Transmutation ' +
    'Description="Self pass through touched 10\' solid twice"',
  'Plane Shift':
    'School=Transmutation ' +
    'Description="Touched plus 6 targets travel to another plane (save neg)"',
  'Plant Door':
    'School=Transmutation ' +
    'Description="Self move effortlessly through vegetation for $L tn"',
  'Plant Growth':
    'School=Transmutation ' +
    'Description="R$L10\' Vegetation in $L100\' sq becomes thick and entangled"',
  'Plant Growth(D3 Tran)':
    'School=Transmutation ' +
    'Description="R160\' Vegetation in $L400\' sq becomes thick and entangled"',
  'Polymorph Object':
    'School=Transmutation ' +
    'Description="R$L5\' Transform any object (save -4 neg)"',
  'Polymorph Other':
    'School=Transmutation ' +
    'Description="R$L5\' Target form and identity becomes named creature (save neg)"',
  'Polymorph Self':
    'School=Transmutation ' +
    'Description="Self form becomes named creature for $L2 tn"',
  'Power Word Blind':
    'School=Conjuration ' +
    'Description="R$L5\' Creatures in 15\' radius blinded for 1d4 rd or 1d4 tn"',
  'Power Word Kill':
    'School=Conjuration ' +
    'Description="R${lvl*2.5}\' 1 60 HP target or 12 10 HP targets in 10\' radius die"',
  'Power Word Stun':
    'School=Conjuration ' +
    'Description="R$L5\' Target stunned for 1d4-4d4 rd"',
  'Prayer':
    'School=Conjuration ' +
    'Description="R60\' Allies +1 attack, damage, saves (foes -1) for $L rd"',
  'Predict Weather':
    'School=Divination ' +
    'Description="Discern local weather for next $L2 hr"',
  'Prismatic Sphere':
    'School=Conjuration ' +
    'Description="Self 10\' radius impenetrable for $L tn"',
  'Prismatic Spray':
    'School=Abjuration ' +
    'Description="Targets in 70\'x15\'x5\' area one of 20, 40, 80 HP (save half), fatal poison, stone, insane, planar teleport (save neg)"',
  'Prismatic Wall':
    'School=Abjuration ' +
    'Description="R10\' $L40\'x$L20\' multicolored wall blinds viewers 2d4 rd, blocks attacks for $L tn"',
  'Produce Fire':
    'School=Transmutation ' +
    'Description="R40\' Fire in 60\' radius 1d4 HP for 1 rd (rev extinguishes)"',
  'Produce Flame':
    'School=Transmutation ' +
    'Description="Flame from burning hand can be thrown 40\' for $L2 rd"',
  'Programmed Illusion':
    'School=Illusion ' +
    'Description="R$L10\' Target responds to trigger, shows $L100plus1600\' sq scene for $L rd"',
  'Project Image':
    'School=Illusion ' +
    'Description="R$L10\' Self duplicate immune to attacks, can cast spells for $L rd"',
  'Project Image(I5 Illu)':
    'School=Illusion ' +
    'Description="R$L5\' Self duplicate immune to attacks, can cast spells for $L rd"',
  'Protection From Evil':
    'School=Abjuration ' +
    'Description="Touched untouchable by evil outsiders, -2 evil attacks, +2 saves for $L2 rd (rev good)"',
  'Protection From Evil(C1 Abju)':
    'School=Abjuration ' +
    'Description="Touched untouchable by evil outsiders, -2 evil attacks, +2 saves for $L3 rd (rev good)"',
  "Protection From Evil 10' Radius":
    'School=Abjuration ' +
    'Description="Touched 10\' radius untouchable by evil outsiders, -2 evil attacks, +2 saves for $L2 rd (rev good)"',
  "Protection From Evil 10' Radius(C4 Abju)":
    'School=Abjuration ' +
    'Description="Touched 10\' radius untouchable by evil outsiders, -2 evil attacks, +2 saves for $L tn (rev good)"',
  'Protection From Fire':
    'School=Abjuration ' +
    'Description="Self immune normal, ignore $L12 HP magic fire or touched immune normal, +4 save and half damage vs magic fire for $L tn"',
  'Protection From Lightning':
    'School=Abjuration ' +
    'Description="Self immune normal, ignore $L12 HP magic electricity or touched immune normal, +4 save and half damage vs magic electricity for $L tn"',
  'Protection From Normal Missiles':
    'School=Abjuration ' +
    'Description="Touched invulnerable to arrows/bolts for $L tn"',
  'Purify Food And Drink':
    'School=Transmutation ' +
    'Description="R30\' Consumables in $L\' cu uncontaminated (rev contaminates)"',
  'Purify Water':
    'School=Transmutation ' +
    'Description="R40\' Decontaminates (rev contaminates) $L\' cu water"',
  'Push':
    'School=Conjuration ' +
    'Description="R$L3plus10\' Target $L lb object moves away from self"',
  'Pyrotechnics':
    'School=Transmutation ' +
    'Description="R120\' Target fire emits fireworks (blind 1d4+1 rd) or obscuring smoke"',
  'Pyrotechnics(D3 Tran)':
    'School=Transmutation ' +
    'Description="R160\' Target fire emits fireworks (blind 1d4+1 rd) or obscuring smoke"',
  'Quest':
    'School=Enchantment ' +
    'Description="Target fulfill quest or -1 saves/day (save neg)"',
  'Raise Dead':
    'School=Necromancy ' +
    'Description="R30\' Corpse restored to life w/in $L dy or destroy corporeal undead (rev slays, save 2d8+1 HP)"',
  'Ray Of Enfeeblement':
    'School=Enchantment ' +
    'Description="R$L3plus10\' Target loses $Lplus25% Str, damage for $L rd"',
  'Read Magic':
    'School=Divination ' +
    'Description="Self understand magical writing for $L2 rd (rev obscures)"',
  'Regenerate':
    'School=Necromancy ' +
    'Description="Touched reattach/regrow appendages in 2d4 tn (rev wither)"',
  'Reincarnate':
    'School=Necromancy ' +
    'Description="Soul dead le 7 dy inhabits new body"',
  'Reincarnation':
    'School=Necromancy ' +
    'Description="Soul dead le $L dy inhabits new body"',
  'Remove Curse':
    'School=Abjuration ' +
    'Description="Touched uncursed (rev cursed for $L tn)"',
  'Remove Fear':
    'School=Abjuration ' +
    'Description="Touched +4 vs. fear for 1 tn, new +$L save if already afraid (rev cause fear)"',
  'Repel Insects':
    'School=Abjuration ' +
    'Description="Self 10\' radius expels normal insects, wards giant (save neg) for $L tn"',
  'Repulsion':
    'School=Abjuration ' +
    'Description="R$L10\' Move all in 10\' path away for ${Math.floor(lvl/2)} rd"',
  'Resist Cold':
    'School=Transmutation ' +
    'Description="Touched comfortable to 0F, +3 save vs. cold for 1/4 or 1/2 damage for $L tn"',
  'Resist Fire':
    'School=Transmutation ' +
    'Description="Touched immune normal fire, +3 vs. magical for for 1/4 or 1/2 damage for $L tn"',
  'Restoration':
    'School=Necromancy ' +
    'Description="Touched regains levels and abilities lost w/in $L dy (rev drains)"',
  'Resurrection':
    'School=Necromancy ' +
    'Description="R30\' Touched restored to life w/in $L10 yr (rev slays)"',
  'Reverse Gravity':
    'School=Transmutation ' +
    'Description="R$L5\' Items in 30\'x30\' area fall up for 1 sec"',
  'Rope Trick':
    'School=Transmutation ' +
    'Description="Touched rope leads to interdimensional space that holds 6 for $L2 tn"',
  'Sanctuary':
    'School=Abjuration ' +
    'Description="Foes save vs. magic to attack self for $Lplus2 rd"',
  'Scare':
    'School=Enchantment ' +
    'Description="R10\' Target lt 6 HD frozen in terror (save neg) for 3d4 rd"',
  'Secret Chest':
    'School=Transmutation ' +
    'Description="Create 12\' cu ethereal chest for 60 dy"',
  'Shades':
    'School=Illusion ' +
    'Description="R30\' Create monsters $L HD total, 60% HP (save AC 6, 60% damage) for $L rd"',
  'Shadow Door':
    'School=Illusion ' +
    'Description="R10\' Illusionary door makes self invisible for $L rd"',
  'Shadow Magic':
    'School=Illusion ' +
    'Description="R$L10plus50\' Mimics <i>Cone Of Cold</i> (${lvl}d4+$L HP), <i>Fireball</i> (${lvl}d6 HP), <i>Lightning Bolt</i> (${lvl}d6 HP), <i>Magic Missile</i> (${Math.floor((lvl+1)/2)}x1d4+1 HP) (save $L HP)"',
  'Shadow Monsters':
    'School=Illusion ' +
    'Description="R30\' Create monsters $L HD total, 20% HP (save AC 10, 20% damage) for $L rd"',
  'Shape Change':
    'School=Transmutation ' +
    'Description="Self polymorph freely for $L tn"',
  'Shatter':
    'School=Transmutation ' +
    'Description="R60\' $L10 lbs brittle material shatters (save neg)"',
  'Shield':
    'School=Evocation ' +
    'Description="Self frontal AC 2 vs hurled, AC 3 vs arrow/bolt, +1 AC vs melee for $L5 rd"',
  'Shillelagh':
    'School=Transmutation ' +
    'Description="Touched club +1 attack, 2d4 damage for $L rd"',
  'Shocking Grasp':
    'School=Transmutation ' +
    'Description="Touched 1d8+$L HP within 1 rd"',
  "Silence 15' Radius":
    'School=Transmutation ' +
    'Description="R120\' No sound in 15\' radius for $L2 rd"',
  'Simulacrum':
    'School=Illusion ' +
    'Description="Command half-strength copy of another creature"',
  'Sleep':
    'School=Enchantment ' +
    'Description="R$L10plus30\' Creatures up to 4+4 HD in 15\' radius sleep for $L5 rd"',
  'Slow':
    'School=Transmutation ' +
    'Description="R$L10plus90\' $L targets in 40\'x40\' area half speed for $Lplus3 rd"',
  'Slow Poison':
    'School=Necromancy ' +
    'Description="Touched takes only 1 HP/tn from poison, protected from death for $L hr"',
  'Snake Charm':
    'School=Enchantment ' +
    'Description="R30\' Charm angry snakes up to self HP 1d4+4 rd"',
  'Snare':
    'School=Enchantment ' +
    'Description="Touched snare 90% undetectable"',
  'Speak With Animals':
    'School=Transmutation ' +
    'Description="Self converse w/1 type of animal w/in 30\' for $L2 rd"',
  'Speak With Animals(D1 Tran)':
    'School=Transmutation ' +
    'Description="Self converse w/1 type of animal w/in 40\' for $L2 rd"',
  'Speak With Dead':
    'School=Necromancy ' +
    'Description="R10\' Self question corpse"',
  'Speak With Monsters':
    'School=Transmutation ' +
    'Description="Self converse w/intelligent creatures in 30\' radius for $L rd"',
  'Speak With Plants':
    'School=Transmutation ' +
    'Description="Self converse w/plants in 60\' radius for $L rd"',
  'Speak With Plants(D4 Tran)':
    'School=Transmutation ' +
    'Description="Self converse w/plants in 40\' radius for $L rd"',
  'Spectral Force':
    'School=Illusion ' +
    'Description="R$L10plus60\' $L10plus1600\' sq sight, sound, smell, temperature illusion for conc + 3 rd"',
  'Spell Immunity':
    'School=Abjuration ' +
    'Description="${Math.floor(lvl/4)} touched +8 vs. mind spells for $L tn"',
  'Spider Climb':
    'School=Transmutation ' +
    'Description="Touched move 30\'/rd on walls and ceilings for $Lplus1 rd"',
  'Spirit-Wrack':
    'School=Abjuration ' +
    'Description="R$Lplus10\' Banish extraplanar for $L yr"',
  'Spiritual Weapon':
    'School=Evocation ' +
    'Description="R30\' magical force attacks for conc or $L rd"',
  'Statue':
    'School=Transmutation ' +
    'Description="Touched become stone at will for $L6 tn"',
  'Sticks To Snakes':
    'School=Transmutation ' +
    'Description="R30\' $L sticks in 10\'x10\'x10\' area become snakes ($L5% venomous) (rev) for $L2 rd"',
  'Sticks To Snakes(D4 Tran)':
    'School=Transmutation ' +
    'Description="R40\' $L sticks in 10\'x10\'x10\' area become snakes ($L5% venonous) (rev) for $L2 rd"',
  'Stinking Cloud':
    'School=Evocation ' +
    'Description="R30\' Creatures w/in 20\' radius retch for d4+1 rd (save neg) for $L rd"',
  'Stone Shape':
    'School=Transmutation ' +
    'Description="Touched $L\' cu rock reshaped"',
  'Stone Shape(D3 Trans)':
    'School=Transmutation ' +
    'Description="Touched $Lplus3\' cu rock reshaped"',
  'Stone Tell':
    'School=Divination ' +
    'Description="Self converse w/3\' cu rock for 1 tn"',
  'Stone To Flesh':
    'School=Transmutation ' +
    'Description="R$L10\' Restore stoned creature or convert $L9\' cu (rev)"',
  'Strength':
    'School=Transmutation ' +
    'Description="Touched Str +1d6 (fighter additional +1) for $L6 tn"',
  'Suggestion':
    'School=Enchantment ' +
    'Description="R30\' Target carries out reasonable suggestion for $Lplus1 hr"',
  'Suggestion(I3 Ench)':
    'School=Enchantment ' +
    'Description="R30\' Target carries out reasonable suggestion for $L4plus4 tn"',
  'Summon Insects':
    'School=Conjuration ' +
    'Description="R30\' Target covered w/insects, 2 HP/rd for $L rd"',
  'Summon Shadow':
    'School=Conjuration ' +
    'Description="R10\' $L shadows obey commands for $Lplus1 rd"',
  'Symbol':
    'School=Conjuration ' +
    'Description="Glowing symbol causes death, discord 5d4 rd, fear (save -4 neg), hopelessness, insanity, pain 2d10 tn, sleep 4d4+1 tn, or stunning 3d4 rd"',
  'Symbol(C7 Conj)':
    'School=Conjuration ' +
    'Description="Glowing symbol causes hopelessness, pain, or persuasion for $L tn"',
  'Telekinesis':
    'School=Transmutation ' +
    'Description="R$L10\' Move $L25 lb for $Lplus2 rd"',
  'Teleport':
    'School=Transmutation ' +
    'Description="Instantly transport self + ${Math.max(lvl-10,0)*150+250} lb to known location"',
  'Temporal Statis':
    'School=Transmutation ' +
    'Description="R10\' Target suspended animation permanently (rev wakens)"',
  'Time Stop':
    'School=Transmutation ' +
    'Description="R10\' 15\' radius gains 1d8+${Math.floor(lvl/2)} x 6 secs"',
  'Tiny Hut':
    'School=Transmutation ' +
    'Description="5\' radius protects against view, elements for $L hr"',
  'Tongues':
    'School=Transmutation ' +
    'Description="Self understand any speech (rev muddle) in 30\' radius for $L rd"',
  'Tongues(C4 Tran)':
    'School=Transmutation ' +
    'Description="Self understand any speech (rev muddle) in 30\' radius for 10 rd"',
  'Transformation':
    'School=Transmutation ' +
    'Description="Change to warrior (HP x2, AC +4, 2/rd dagger +2 damage) for $L rd"',
  'Transmute Metal To Wood':
    'School=Transmutation ' +
    'Description="R80\' $L8 lb object becomes wood"',
  'Transmute Rock To Mud':
    'School=Transmutation ' +
    'Description="R$L10\' $L8000\' cu rock becomes mud (rev)"',
  'Transmute Rock To Mud(D5 Tran)':
    'School=Transmutation ' +
    'Description="R160\' $L8000\' cu rock becomes mud (rev)"',
  'Transport Via Plants':
    'School=Transmutation ' +
    'Description="Self teleport between plants"',
  'Trap The Soul':
    'School=Conjuration ' +
    'Description="R10\' Target soul trapped in gem (save neg)"',
  'Tree':
    'School=Transmutation ' +
    'Description="Self polymorph into tree for $Lplus6 tn"',
  'Trip':
    'School=Enchantment ' +
    'Description="Touched trips passers (save neg), 1d6 damage, stunned 1d4+1 rd for $L tn"',
  'True Seeing':
    'School=Divination ' +
    'Description="Touched sees past deceptions, alignment auras w/in 120\' for $L rd (rev obscures)"',
  'True Sight':
    'School=Divination ' +
    'Description="Touched sees past deceptions w/in 60\' for $L rd"',
  'Turn Wood':
    'School=Transmutation ' +
    'Description="Wood in 120\'x$L20\' area forced away for $L4 rd"',
  'Unseen Servant':
    'School=Conjuration ' +
    'Description="Invisible force does simple tasks w/in 30\' for $Lplus6 tn"',
  'Vanish':
    'School=Transmutation ' +
    'Description="Touched teleported or sent to aethereal plane"',
  'Veil':
    'School=Illusion ' +
    'Description="R$L10\' $L400\' sq area mimics other terrain for $L tn"',
  'Ventriloquism':
    'School=Illusion ' +
    'Description="R$L10max60\' Self throw voice for $Lplus2 rd ((Int - 12) * 10 % disbelieve)"',
  'Ventriloquism(I2 Illu)':
    'School=Illusion ' +
    'Description="R$L10max90\' Self throw voice for $Lplus4 rd ((Int - 12) * 10 % disbelieve)"',
  'Vision':
    'School=Divination ' +
    'Description="Self seek answer to question, may cause geas"',
  'Wall Of Fire':
    'School=Evocation ' +
    'Description="R60\' $L20\' sq wall or $L{lvl*3+10}\' radius circle 2d6+$L HP to passers, 2d6 w/in 10\', 1d6 w/in 20\' for conc or $L rd"',
  'Wall Of Fire(D5 Evoc)':
    'School=Evocation ' +
    'Description="R80\' $L20\' sq wall or $L5\' radius circle 4d4+1 HP to passers, 2d4 w/in 10\', 1d4 w/in 20\' for conc or $L rd"',
  'Wall Of Fog':
    'School=Transmutation ' +
    'Description="R30\' Fog in $L20\'x$L20\'x$L20\' area obscures for 2d4+$L rd"',
  'Wall Of Force':
    'School=Evocation ' +
    'Description="R30\' Invisible $L20\' sq wall impenetrable for $Lplus1 tn"',
  'Wall Of Ice':
    'School=Evocation ' +
    'Description="R$L10\' Create $L100\' sq ice wall for $L tn"',
  'Wall Of Iron':
    'School=Evocation ' +
    'Description="R$L5\' Create ${lvl/4} in thick, $L15\' sq wall"',
  'Wall Of Stone':
    'School=Evocation ' +
    'Description="R$L5\' ${lvl/4} in thick, $L400\' sq wall emerges from stone"',
  'Wall Of Thorns':
    'School=Conjuration ' +
    'Description="R80\' Briars in $L100\' sq area 8 + AC HP for $L tn"',
  'Warp Wood':
    'School=Transmutation ' +
    'Description="R$L10\' Bends 1 in x $L15 in wood"',
  'Water Breathing':
    'School=Transmutation ' +
    'Description="Touched breathe water (rev air) for $L3 tn"',
  'Water Breathing(D3 Tran)':
    'School=Transmutation ' +
    'Description="Touched breathe water (rev air) for $L6 tn"',
  'Weather Summoning':
    'School=Conjuration ' +
    'Description="Self directs precipitation, temp, and wind within d100 mi sq"',
  'Web':
    'School=Evocation ' +
    'Description="R$L5\' 80\' cu webbing for $L2 tn"',
  'Wind Walk':
    'School=Transmutation ' +
    'Description="Self and ${Math.floor(lvl/8)} others insubstantial, travel 600\'/tn for $L6 tn"',
  'Wish':
    'School=Conjuration ' +
    'Description="Major reshaping of reality"',
  'Wizard Eye':
    'School=Transmutation ' +
    'Description="Self see through invisible eye w/600\' vision, 100\' infravision, moves 30\'/rd for $L rd"',
  'Wizard Lock':
    'School=Transmutation ' +
    'Description="Touched $L900\' sq item held closed"',
  'Word Of Recall':
    'School=Transmutation ' +
    'Description="Self instant teleport to prepared sanctuary"',
  'Write':
    'School=Evocation ' +
    'Description="Self copy unknown spell (save vs spell, fail damage and unconsciousness) for $L hr"'
};
FirstEdition.WEAPONS = {
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
  'Long Bow':'Category=R Damage=d6 Range=70',
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
  'Short Bow':'Category=R Damage=d6 Range=50',
  'Short Sword':'Category=Li Damage=d6',
  'Sling':'Category=R Damage=d4 Range=40',
  'Spear':'Category=2h Damage=d6 Range=10',
  'Spetum':'Category=2h Damage=d6+1',
  'Trident':'Category=1h Damage=d6+1',
  'Two-Handed Sword':'Category=2h Damage=d10',
  'Unarmed':'Category=Un Damage=d2',
  'Voulge':'Category=2h Damage=2d4'
};
FirstEdition.CLASSES = {
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
    'SpellsPerDay=' +
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
      '"wisdom <= 12 ? 1:Cleric Spell Failure",' +
      '"9:Attract Followers" ' +
    'Experience=' +
      '0,1.5,3,6,13,27.5,55,110,225,450,675,900,1125,1350,1575,1800,2025,' +
      '2250,2475,2700 ' +
    'CasterLevelDivine=levels.Cleric ' +
    'SpellAbility=wisdom ' +
    'SpellsPerDay=' +
      'C1:1=1;2=2;4=3;9=4;11=5;12=6;15=7;17=8;19=9,' +
      'C2:3=1;4=2;5=3;9=4;12=5;13=6;15=7;17=8;19=9,' +
      'C3:5=1;6=2;8=3;11=4;12=5;13=6;15=7;17=8;19=9,' +
      'C4:7=1;8=2;10=3;13=4;14=5;16=6;18=7;20=8;21=9,' +
      'C5:9=1;10=2;14=3;15=4;16=5;18=6;20=7;21=8;22=9,' +
      'C6:11=1;12=2;16=3;18=4;20=5;21=6;23=7;24=8;26=9,' +
      'C7:16=1;19=2;22=3;25=4;27=5;28=6;29=7 ' +
    'Spells=' +
      '"C1:Bless;Command;Create Water;Cure Light Wounds;Detect Evil;' +
      'Detect Magic;Light;Protection From Evil;Purify Food And Drink;' +
      'Remove Fear;Resist Cold;Sanctuary",' +
      '"C2:Augury;Chant;Detect Charm;Find Traps;Hold Person;Know Alignment;' +
      "Resist Fire;Silence 15' Radius;Slow Poison;Snake Charm;" +
      'Speak With Animals;Spiritual Weapon",' +
      '"C3:Animate Dead;Continual Light;Create Food And Water;' +
      'Cure Blindness;Cure Disease;Dispel Magic;Feign Death;' +
      'Glyph Of Warding;Locate Object;Prayer;Remove Curse;Speak With Dead",' +
      '"C4:Cure Serious Wounds;Detect Lie;Divination;Exorcise;Lower Water;' +
      "Neutralize Poison;Protection From Evil 10' Radius;" +
      'Speak With Plants;Sticks To Snakes;Tongues",' +
      '"C5:Atonement;Commune;Cure Critical Wounds;Dispel Evil;Flame Strike;' +
      'Insect Plague;Plane Shift;Quest;Raise Dead;True Seeing",' +
      '"C6:Aerial Servant;Animate Object;Blade Barrier;Conjure Animals;' +
      'Find The Path;Heal;Part Water;Speak With Monsters;Stone Tell;' +
      'Word Of Recall",' +
      '"C7:Astral Spell;Control Weather;Earthquake;Gate;Holy Word;' +
      'Regenerate;Restoration;Resurrection;Symbol;Wind Walk"',
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
    'Experience=0,2,4,7.5,12.5,20,35,60,90,124,200,300,750,1500 ' +
    'CasterLevelDivine=levels.Druid ' +
    'SpellAbility=wisdom ' +
    'SpellsPerDay=' +
      'D1:1=2;3=3;4=4;9=5;13=6,' +
      'D2:2=1;3=2;5=3;7=4;11=5;14=6,' +
      'D3:3=1;4=2;7=3;12=4;13=5;14=6,' +
      'D4:6=1;8=2;10=3;12=4;13=5;14=6,' +
      'D5:9=1;10=2;12=3;13=4;14=5,' +
      'D6:11=1;12=2;13=3;14=4,' +
      'D7:12=1;13=2;14=3 ' +
    'Spells=' +
      '"D1:Animal Friendship;Detect Magic;Detect Pits And Snares;Entangle;' +
      'Faerie Fire;Invisibility To Animals;Locate Animals;' +
      'Pass Without Trace;Predict Weather;Purify Water;Shillelagh;' +
      'Speak With Animals",' +
      '"D2:Barkskin;Charm Person Or Mammal;Create Water;Cure Light Wounds;' +
      'Feign Death;Fire Trap;Heat Metal;Locate Plants;Obscurement;' +
      'Produce Flame;Trip;Warp Wood",' +
      '"D3:Call Lightning;Cure Disease;Hold Animal;Neutralize Poison;' +
      'Plant Growth;Protection From Fire;Pyrotechnics;Snare;Stone Shape;' +
      'Summon Insects;Tree;Water Breathing",' +
      '"D4:Animal Summoning I;Call Woodland Beings;' +
      "Control Temperature 10' Radius;Cure Serious Wounds;Dispel Magic;" +
      'Hallucinatory Forest;Hold Plant;Plant Door;Produce Fire;' +
      'Protection From Lightning;Repel Insects;Speak With Plants",' +
      '"D5:Animal Growth;Animal Summoning II;Anti-Plant Shell;' +
      'Commune With Nature;Control Winds;Insect Plague;Pass Plant;' +
      'Sticks To Snakes;Transmute Rock To Mud;Wall Of Fire",' +
      '"D6:Animal Summoning III;Anti-Animal Shell;Conjure Fire Elemental;' +
      'Cure Critical Wounds;Feeblemind;Fire Seeds;Transport Via Plants;' +
      'Turn Wood;Wall Of Thorns;Weather Summoning",' +
      '"D7:Animate Rock;Chariot Of Fire;Confusion;Conjure Earth Elemental;' +
      'Control Weather;Creeping Doom;Finger Of Death;Fire Storm;' +
      'Reincarnate;Transmute Metal To Wood"',
  'Fighter':
    'Require="constitution >= 7","strength >= 9" ' +
    'HitDie=d10 Attack=0,2,2 WeaponProficiency=4,3,2 ' +
    'Breath=17,1.5,2 Death=14,1.5,2 Petrification=15,1.5,2 Spell=17,1.5,2 Wand=16,1.5,2 ' +
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"strength >= 16 ? 1:Bonus Fighter Experience",' +
      '"2:Fighting The Unskilled","9:Attract Followers" ' +
    'Experience=' +
      '0,2,4,8,18,25,70,125,250,500,750,1000,1250,1500,1750,2000,2250,2500,' +
      '2750,3000',
  'Illusionist':
    'Require="dexterity >= 16","intelligence >= 15" ' +
    'HitDie=d4 Attack=-1,2,5 WeaponProficiency=1,6,5 ' +
    'Breath=15,2,5 Death=14,1.5,5 Petrification=13,2,5 Spell=12,2,5 Wand=11,2,5 '+
    'Features=' +
      '"10:Eldritch Craft","12:Attract Followers" ' +
    'CasterLevelArcane=levels.Illusionist ' +
    'Experience=' +
      '0,2.25,4.5,9,18,35,60,95,145,220,440,660,880,1100,1320,1540,1760,1980,' +
      '2200,2420 ' +
    'SpellAbility=intelligence ' +
    'SpellsPerDay=' +
      'I1:1=1;2=2;4=3;5=4;9=5;24=6;26=7,' +
      'I2:3=1;4=2;6=3;10=4;12=5;24=6;26=7,' +
      'I3:5=1;7=2;9=3;12=4;16=5;24=6;26=7,' +
      'I4:8=1;9=2;11=3;15=4;17=5;24=6;26=7,' +
      'I5:10=1;11=2;16=3;19=4;21=5;25=6,' +
      'I6:12=1;13=2;18=3;21=4;22=5;25=6,' +
      'I7:14=1;15=2;20=3;22=4;23=5;25=6 ' +
    'Spells=' +
      '"I1:Audible Glamer;Change Self;Color Spray;Dancing Lights;Darkness;' +
      'Detect Illusion;Detect Invisibility;Gaze Reflection;Hypnotism;Light;' +
      'Phantasmal Force;Wall Of Fog",' +
      '"I2:Blindness;Blur;Deafness;Detect Magic;Fog Cloud;Hypnotic Pattern;' +
      'Improved Phantasmal Force;Invisibility;Magic Mouth;Mirror Image;' +
      'Misdirection;Ventriloquism",' +
      '"I3:Continual Darkness;Continual Light;Dispel Illusion;Fear;' +
      "Hallucinatory Terrain;Illusionary Script;Invisibility 10' Radius;" +
      'Non-Detection;Paralyzation;Rope Trick;Spectral Force;Suggestion",' +
      '"I4:Confusion;Dispel Exhaustion;Emotion;Improved Invisibility;' +
      'Massmorph;Minor Creation;Phantasmal Killer;Shadow Monsters",' +
      '"I5:Chaos;Demi-Shadow Monsters;Major Creation;Maze;Project Image;' +
      'Shadow Door;Shadow Magic;Summon Shadow",' +
      '"I6:Conjure Animals;Demi-Shadow Magic;Mass Suggestion;' +
      'Permanent Illusion;Programmed Illusion;Shades;True Sight;Veil",' +
      '"I7:Alter Reality;Astral Spell;Prismatic Spray;Prismatic Wall;' +
      'Vision;Arcane Spells Level 1"',
  'Magic User':
    'Require="dexterity >= 6","intelligence >= 9" ' +
    'HitDie=d4 Attack=-1,2,5 WeaponProficiency=1,6,5 ' +
    'Breath=15,2,5 Death=14,1.5,5 Petrification=13,2,5 Spell=12,2,5 ' +
    'Wand=11,2,5 '+
    'Features=' +
      '"intelligence >= 16 ? 1:Bonus Magic User Experience",' +
      '"7:Eldritch Craft","11:Attract Followers","12:Eldritch Power" ' +
    'Experience=' +
      '0,2.5,5,10,22.5,40,60,90,135,250,375,750,1125,1500,1875,2250,2625,' +
      '3000,3375,3750 ' +
    'CasterLevelArcane="levels.Magic User" ' +
    'SpellAbility=intelligence ' +
    'SpellsPerDay=' +
      'M1:1=1;2=2;4=3;5=4;13=5;26=6;29=7,' +
      'M2:3=1;4=2;7=3;10=4;13=5;26=6;29=7,' +
      'M3:5=1;6=2;8=3;11=4;13=5;26=6;29=7,' +
      'M4:7=1;8=2;11=3;12=4;15=5;26=6;29=7,' +
      'M5:9=1;10=2;11=3;12=4;15=5;27=6,' +
      'M6:12=1;13=2;16=3;20=4;22=5;27=6,' +
      'M7:14=1;16=2;17=3;21=4;23=5;27=6,' +
      'M8:16=1;17=2;19=3;21=4;23=5;28=6,' +
      'M9:18=1;20=2;22=3;24=4;25=5;28=6 ' +
    'Spells=' +
      '"M1:Affect Normal Fires;Burning Hands;Charm Person;' +
      'Comprehend Languages;Dancing Lights;Detect Magic;Enlarge;Erase;' +
      'Feather Fall;Find Familiar;Floating Disk;Friends;Hold Portal;' +
      'Identify;Jump;Light;Magic Aura;Magic Missile;Mending;Message;' +
      'Protection From Evil;Push;Read Magic;Shield;Shocking Grasp;Sleep;' +
      'Spider Climb;Unseen Servant;Ventriloquism;Write",' +
      '"M2:Audible Glamer;Continual Light;Darkness;Detect Evil;' +
      "Detect Invisibility;ESP;False Trap;Fool's Gold;Forget;Invisibility;" +
      'Levitate;Locate Object;Magic Mouth;Mirror Image;' +
      'Pyrotechnics;Ray Of Enfeeblement;Rope Trick;Scare;Shatter;' +
      'Stinking Cloud;Strength;Web;Wizard Lock",' +
      '"M3:Blink;Clairaudience;Clairvoyance;Dispel Magic;Explosive Runes;' +
      'Feign Death;Fireball;Flame Arrow;Fly;Gust Of Wind;Haste;Hold Person;' +
      "Infravision;Invisibility 10' Radius;Lightning Bolt;" +
      'Monster Summoning I;Phantasmal Force;' +
      "Protection From Evil 10' Radius;Protection From Normal Missiles;" +
      'Slow;Suggestion;Tiny Hut;Tongues;Water Breathing",' +
      '"M4:Charm Monster;Confusion;Dig;Dimension Door;Enchanted Weapon;' +
      'Extension I;Fear;Fire Charm;Fire Shield;Fire Trap;Fumble;' +
      'Hallucinatory Terrain;Ice Storm;Massmorph;' +
      'Minor Globe Of Invulnerability;Mnemonic Enhancement;' +
      'Monster Summoning II;Plant Growth;Polymorph Other;Polymorph Self;' +
      'Remove Curse;Wall Of Fire;Wall Of Ice;Wizard Eye",' +
      '"M5:Airy Water;Animal Growth;Animate Dead;Cloudkill;Cone Of Cold;' +
      'Conjure Elemental;Contact Other Plane;Distance Distortion;' +
      'Extension II;Feeblemind;Hold Monster;Interposing Hand;' +
      "Mage's Faithful Hound;Magic Jar;Monster Summoning III;Passwall;" +
      'Secret Chest;Stone Shape;Telekinesis;Teleport;' +
      'Transmute Rock To Mud;Wall Of Force;Wall Of Iron;Wall Of Stone",' +
      '"M6:Anti-Magic Shell;Control Weather;Death Spell;Disintegrate;' +
      'Enchant An Item;Extension III;Forceful Hand;Freezing Sphere;Geas;' +
      'Glasseye;Globe Of Invulnerability;Guards And Wards;' +
      'Invisible Stalker;Legend Lore;Lower Water;Monster Summoning IV;' +
      'Move Earth;Part Water;Project Image;Reincarnation;Repulsion;' +
      'Spirit-Wrack;Stone To Flesh;Transformation",' +
      '"M7:Cacodemon;Charm Plants;Delayed Blast Fireball;Duo-Dimension;' +
      "Grasping Hand;Instant Summons;Limited Wish;Mage's Sword;" +
      'Mass Invisibility;Monster Summoning V;Phase Door;Power Word Stun;' +
      'Reverse Gravity;Simulacrum;Statue;Vanish",' +
      '"M8:Antipathy/Sympathy;Clenched Fist;Clone;Glass-Steel;' +
      'Incendiary Cloud;Irresistible Dance;Mass Charm;Maze;Mind Blank;' +
      'Monster Summoning VI;Permanency;Polymorph Object;Power Word Blind;' +
      'Spell Immunity;Symbol;Trap The Soul",' +
      '"M9:Astral Spell;Crushing Hand;Gate;Imprisonment;Meteor Swarm;' +
      'Monster Summoning VII;Power Word Kill;Prismatic Sphere;Shape Change;' +
      'Temporal Statis;Time Stop;Wish"',
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
    'Breath=15,1.5,2 Death=12,1.5,2 Petrification=13,1.5,2 Spell=15,1.5,2 ' +
    'Wand=14,1.5,2 ' +
    'Features=' +
      '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
      '"strength >= 16/wisdom >= 16 ? 1:Bonus Paladin Experience",' +
      '"1:Cure Disease","1:Detect Evil",1:Discriminating,"1:Divine Health",' +
      '"1:Fighting The Unskilled","1:Lay On Hands",1:Nonmaterialist,' +
      '1:Philanthropist,"1:Protection From Evil","3:Turn Undead",' +
      '"4:Summon Warhorse" ' +
    'Experience=' +
      '0,2.75,5.5,12,24,45,95,175,350,700,1050,1400,1750,2100,2450,2800,3150,' +
      '3500,3850,4200 ' +
    'CasterLevelDivine=' +
      '"levels.Paladin < 9 ? null : Math.min(levels.Paladin - 8, 8)" ' +
    'SpellAbility=wisdom ' +
    'SpellsPerDay=' +
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
      '"levels.Ranger<=7?null:Math.min(Math.floor((levels.Ranger-6)/2), 6)" ' +
    'CasterLevelDivine=' +
      '"levels.Ranger<=7?null:Math.min(Math.floor((levels.Ranger-6)/2), 6)" ' +
      'SpellAbility=wisdom ' +
      'SpellsPerDay=' +
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

/*
 * Changes from 1st Edition to 2nd Edition and OSRIC--see editedRules.
 */
FirstEdition.RULE_EDITS = {
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
        'SpellsPerDay=' +
          'W1:2=1;3=2;5=3;16=4,' +
          'W2:4=1;6=2;8=3;17=4,' +
          'W3:7=1;9=2;11=3;18=4,' +
          'W4:10=1;12=2;14=3;19=4,' +
          'W5:13=1;15=2;17=3;20=4,' +
          'W6:16=1;18=2;20=3',
      'Cleric':
        'SpellsPerDay=' +
          'P1:1=1;2=2;4=3;9=4;11=5;12=6;16=7;18=8;19=9,' +
          'P2:3=1;4=2;5=3;9=4;12=5;13=6;16=7;18=8;19=9,' +
          'P3:5=1;6=2;8=3;11=4;12=5;13=6;16=7;18=8;20=9,' +
          'P4:7=1;8=2;10=3;13=4;14=5;15=6;17=7;18=8,' +
          'P5:9=1;10=2;14=3;15=4;17=5;18=6;20=7,' +
          'P6:11=1;12=2;16=3;18=4;20=5,' +
          'P7:14=1;17=2 ' +
        'Spells=' +
          '"P1:Animal Friendship;Bless;Combine;Command;Create Water;' +
          'Cure Light Wounds;Detect Evil;Detect Magic;Detect Poison;' +
          'Detect Pits And Snares;Endure Cold;Endure Heat;Entangle;' +
          'Faerie Fire;Invisibility To Animals;Invisibility To Undead;Light;' +
          'Locate Animals Or Plants;Magical Stone;Pass Without Trace;' +
          'Protection From Evil;Purify Food And Drink;Remove Fear;Sanctuary;' +
          'Shillelagh",' +
          '"P2:Aid;Augury;Barkskin;Chant;Charm Person Or Mammal;Detect Charm;' +
          'Dust Devil;Enthrall;Find Traps;Fire Trap;Flame Blade;Goodberry;' +
          'Heat Metal;Hold Person;Know Alignment;Messenger;Obscurement;' +
          'Produce Flame;Resist Cold;Resist Fire;Silence 15\' Radius;' +
          'Slow Poison;Snake Charm;Speak With Animals;Spiritual Weapon;Trip;' +
          'Warp Wood;Withdraw;Wyvern Watch",' +
          '"P3:Animate Dead;Call Lightning;Continual Light;' +
          'Create Food And Water;Cure Blindness Or Deafness;Cure Disease;' +
          'Dispel Magic;Feign Death;Flame Walk;Glyph Of Warding;Hold Animal;' +
          'Locate Object;Magical Vestment;Meld Into Stone;' +
          'Negative Plane Protection;Plant Growth;Prayer;' +
          'Protection From Fire;Pyrotechnics;Remove Curse;Remove Paralysis;' +
          'Snare;Speak With Dead;Spike Growth;Starshine;Stone Shape;' +
          'Summon Insects;Tree;Water Breathing;Water Walk",' +
          '"P4:Abjure;Animal Summoning I;Call Woodland Beings;' +
          'Cloak Of Bravery;Control Temperature 10\' Radius;' +
          'Cure Serious Wounds;Detect Lie;Divination;Free Action;' +
          'Giant Insect;Hallucinatory Forest;Hold Plant;' +
          'Imbue With Spell Ability;Lower Water;Neutralize Poison;Plant Door;' +
          'Produce Fire;Protection From Evil 10\' Radius;' +
          'Protection From Lightning;Reflecting Pool;Repel Insects;' +
          'Speak With Plants;Spell Immunity;Sticks To Snakes;Tongues",' +
          '"P5:Air Walk;Animal Growth;Animal Summoning II;Anti-Plant Shell;' +
          'Atonement;Commune;Commune With Nature;Control Winds;' +
          'Cure Critical Wounds;Dispel Evil;Flame Strike;Insect Plague;' +
          'Magic Font;Moonbeam;Pass Plant;Plane Shift;Quest;Rainbow;' +
          'Raise Dead;Spike Stones;Transmute Rock To Mud;True Seeing;' +
          'Wall Of Fire",' +
          '"P6:Aerial Servant;Animal Summoning III;Animate Object;' +
          'Anti-Animal Shell;Blade Barrier;Conjure Animals;' +
          'Conjure Fire Elemental;Find The Path;Fire Seeds;Forbiddance;Heal;' +
          'Heroes\' Feast;Liveoak;Part Water;Speak With Monsters;Stone Tell;' +
          'Transmute Water To Dust;Transport Via Plants;Turn Wood;' +
          'Wall Of Thorns;Weather Summoning;Word Of Recall",' +
          '"P7:Animate Rock;Astral Spell;Changestaff;Chariot Of Fire;' +
          'Confusion;Conjure Earth Elemental;Control Weather;Creeping Doom;' +
          'Earthquake;Exaction;Fire Storm;Gate;Holy Word;Regenerate;' +
          'Reincarnate;Restoration;Resurrection;Succor;Sunray;Symbol;' +
          'Transmute Metal To Wood;Wind Walk"',
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
        'SpellsPerDay=' +
          'P1:1=1;2=2;4=3;9=4;11=5;12=6;16=7;18=8;19=9,' +
          'P2:3=1;4=2;5=3;9=4;12=5;13=6;16=7;18=8;19=9,' +
          'P3:5=1;6=2;8=3;11=4;12=5;13=6;16=7;18=8;20=9,' +
          'P4:7=1;8=2;10=3;13=4;14=5;15=6;17=7;18=8,' +
          'P5:9=1;10=2;14=3;15=4;17=5;18=6;20=7,' +
          'P6:11=1;12=2;16=3;18=4;20=5,' +
          'P7:14=1;17=2 ' +
        'Spells="P1:Animal Friendship"',
      'Fighter':
        'Require="strength >= 9" ' +
        'Features-="2:Fighting The Unskilled" ' +
        'Experience=' +
          '0,2,4,8,16,32,64,125,250,500,750,1000,1250,1500,1750,2000,2250,' +
          '2500,2750,3000',
      'Illusionist':
        'Require="dexterity >= 16","intelligence >= 9" ' +
        'Features=' +
          '"Intelligence >= 16 ? 1:Bonus Illusionist Experience",' +
          '"1:Empowered Illusions","1:Illusion Resistance",' +
          '"1:School Opposition (Abjuration)",' +
          '"1:School Opposition (Evocation)",' +
          '"1:School Opposition (Necromancy)",' +
          '"1:School Specialization (Illusion)" ' +
        'SpellsPerDay=' +
          'W1:1=2;2=3;4=4;5=5;13=6,' +
          'W2:3=2;4=3;7=4;10=5;13=6,' +
          'W3:5=2;6=3;8=4;11=5;13=6,' +
          'W4:7=2;8=3;11=4;12=5;15=6,' +
          'W5:9=2;10=3;11=4;12=5;15=6,' +
          'W6:12=2;13=3;16=4;20=5,' +
          'W7:14=2;16=3;17=4,' +
          'W8:16=2;17=3;19=4,' +
          'W9:18=2;20=3 ' +
        'Spells="P1:Animal Friendship"',
      'Magic User':
        'Features=' +
          '"intelligence >= 16 ? 1:Bonus Magic User Experience",' +
          '"9:Eldritch Craft" ' +
        'SpellsPerDay=' +
          'W1:1=1;2=2;4=3;5=4;13=5,' +
          'W2:3=1;4=2;7=3;10=4;13=5,' +
          'W3:5=1;6=2;8=3;11=4;13=5,' +
          'W4:7=1;8=2;11=3;12=4;15=5,' +
          'W5:9=1;10=2;11=3;12=4;15=5,' +
          'W6:12=1;13=2;16=3;20=4,' +
          'W7:14=1;16=2;17=3,' +
          'W8:16=1;17=2;19=3,' +
          'W9:18=1;20=2 ' +
        'Spells=' +
          '"W1:Affect Normal Fires;Alarm;Armor;Audible Glamer;Burning Hands;' +
          'Change Self;Charm Person;Chill Touch;Color Spray;' +
          'Comprehend Languages;Dancing Lights;Detect Magic;Detect Undead;' +
          'Enlarge;Erase;Feather Fall;Find Familiar;Friends;Gaze Reflection;' +
          'Grease;Hold Portal;Hypnotism;Identify;Jump;Light;Magic Missile;' +
          'Mending;Message;Mount;Magic Aura;Phantasmal Force;' +
          'Protection From Evil;Read Magic;Shield;Shocking Grasp;Sleep;' +
          'Spider Climb;Spook;Taunt;Floating Disk;Unseen Servant;' +
          'Ventriloquism;Wall Of Fog;Wizard Mark",' +
          '"W2:Alter Self;Bind;Blindness;Blur;Continual Light;Darkness;' +
          'Deafness;Deeppockets;Detect Evil;Detect Invisibility;ESP;' +
          'Flaming Sphere;Fog Cloud;Fool\'s Gold;Forget;Glitterdust;' +
          'Hypnotic Pattern;Improved Phantasmal Force;Invisibility;' +
          'Irritation;Knock;Know Alignment;False Trap;Levitate;Locate Object;' +
          'Magic Mouth;Acid Arrow;Mirror Image;Misdirection;' +
          'Protection From Cantrips;Pyrotechnics;Ray Of Enfeeblement;' +
          'Rope Trick;Scare;Shatter;Spectral Hand;Stinking Cloud;Strength;' +
          'Summon Swarm;Hideous Laughter;Web;Whispering Wind;Wizard Lock",' +
          '"W3:Blink;Clairaudience;Clairvoyance;Delude;Dispel Magic;' +
          'Explosive Runes;Feign Death;Fireball;Flame Arrow;Fly;Gust Of Wind;' +
          'Haste;Hold Person;Hold Undead;Illusionary Script;Infravision;' +
          'Invisibility 10\' Radius;Item;Tiny Hut;Lightning Bolt;' +
          'Minute Meteors;Monster Summoning I;Non-Detection;Phantom Steed;' +
          'Protection From Evil 10\' Radius;Protection From Normal Missiles;' +
          'Secret Page;Sepia Snake Sigil;Slow;Spectral Force;Suggestion;' +
          'Tongues;Vampiric Touch;Water Breathing;Wind Wall;Wraithform",' +
          '"W4:Charm Monster;Confusion;Contagion;Detect Scrying;Dig;' +
          'Dimension Door;Emotion;Enchanted Weapon;Enervation;' +
          'Black Tentacles;Extension I;Fear;Fire Charm;Fire Shield;' +
          'Fire Trap;Fumble;Hallucinatory Terrain;Ice Storm;Illusionary Wall;' +
          'Improved Invisibility;Secure Shelter;Magic Mirror;Massmorph;' +
          'Minor Creation;Minor Globe Of Invulnerability;' +
          'Monster Summoning II;Resilient Sphere;Phantasmal Killer;' +
          'Plant Growth;Polymorph Other;Polymorph Self;Rainbow Pattern;' +
          'Mnemonic Enhancement;Remove Curse;Shadow Monsters;Shout;Solid Fog;' +
          'Stoneskin;Vacancy;Wall Of Fire;Wall Of Ice;Wizard Eye",' +
          '"W5:Advanced Illusion;Airy Water;Animal Growth;Animate Dead;' +
          'Avoidance;Interposing Hand;Chaos;Cloudkill;Cone Of Cold;' +
          'Conjure Elemental;Contact Other Plane;Demi-Shadow Monsters;' +
          'Dismissal;Distance Distortion;Domination;Dream;Extension II;' +
          'Fabricate;False Vision;Feeblemind;Hold Monster;' +
          'Lamentable Belaborment;Secret Chest;Magic Jar;Major Creation;' +
          'Monster Summoning III;Mage\'s Faithful Hound;Passwall;Seeming;' +
          'Sending;Shadow Door;Shadow Magic;Stone Shape;Summon Shadow;' +
          'Telekinesis;Teleport;Transmute Rock To Mud;Wall Of Force;' +
          'Wall Of Iron;Wall Of Stone",' +
           '"W6:Anti-Magic Shell;Forceful Hand;Chain Lightning;' +
          'Conjure Animals;Contingency;Control Weather;Death Fog;Death Spell;' +
          'Demi-Shadow Magic;Disintegrate;Enchant An Item;Ensnarement;' +
          'Extension III;Eyebite;Geas;Glasseye;Globe Of Invulnerability;' +
          'Guards And Wards;Invisible Stalker;Legend Lore;Lower Water;' +
          'Mass Suggestion;Mirage Arcana;Mislead;Monster Summoning IV;' +
          'Mage\'s Lucubration;Move Earth;Freezing Sphere;Part Water;' +
          'Permanent Illusion;Programmed Illusion;Project Image;' +
          'Reincarnation;Repulsion;Shades;Stone To Flesh;Transformation;' +
          'Transmute Water To Dust;True Seeing;Veil",' +
           '"W7:Banishment;Grasping Hand;Charm Plants;Control Undead;' +
          'Delayed Blast Fireball;Instant Summons;Duo-Dimension;' +
          'Finger Of Death;Forcecage;Limited Wish;Mass Invisibility;' +
          'Monster Summoning V;Mage\'s Magnificent Mansion;Mage\'s Sword;' +
          'Phase Door;Power Word Stun;Prismatic Spray;Reverse Gravity;' +
          'Sequester;Shadow Walk;Simulacrum;Spell Turning;Statue;' +
          'Teleport Without Error;Vanish;Vision",' +
           '"W8:Antipathy/Sympathy;Clenched Fist;Binding;Clone;Demand;' +
          'Glass-Steel;Incendiary Cloud;Mass Charm;Maze;Mind Blank;' +
          'Monster Summoning VI;Telekinetic Sphere;Permanency;' +
          'Polymorph Object;Power Word Blind;Prismatic Wall;Screen;' +
          'Spell Immunity;Sink;Symbol;Trap The Soul",' +
           '"W9:Astral Spell;Crushing Hand;Crystalbrittle;Energy Drain;' +
          'Foresight;Gate;Imprisonment;Meteor Swarm;Monster Summoning VII;' +
          'Disjunction;Power Word Kill;Prismatic Sphere;Shape Change;Succor;' +
          'Temporal Stasis;Time Stop;Weird;Wish',
      'Paladin':
        'Require=' +
          '"alignment == \'Lawful Good\'","charisma >= 17",' +
          '"constitution >= 9","strength >= 12","wisdom >= 13" ' +
        'Features=' +
          '"1:Armor Proficiency (All)","1:Shield Proficiency (All)",' +
          '"strength >= 16/charisma >= 16 ? 1:Bonus Paladin Experience",' +
          '"1:Cure Disease","1:Detect Evil",1:Discriminating,' +
          '"1:Divine Health","1:Divine Protection","1:Lay On Hands",' +
          '1:Nonmaterialist,1:Philanthropist,"1:Protection From Evil",' +
          '"3:Turn Undead","4:Summon Warhorse" ' +
        'Experience=' +
          '0,2,4,8,16,32,64,125,250,500,750,1000,1250,1500,1750,2000,2250,' +
          '2500,2750,3000 ' +
        'CasterLevelDivine=' +
          '"levels.Paladin < 9 ? null : Math.min(levels.Paladin - 8, 9)" ' +
        'SpellsPerDay=' +
          'P1:9=1;10=2;14=3,' +
          'P2:11=1;12=2;16=3,' +
          'P3:13=1;16=2;17=3,' +
          'P4:15=1;19=2;20=3',
      'Ranger':
        'Require=' +
          '"alignment =~ \'Good\'","constitution >= 14","dexterity >= 13",' +
          '"strength >= 13","wisdom >= 14" ' +
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
        'SpellsPerDay=' +
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
      'Legend Lore':'Note="%V% chance of info about magic item"',
      'Poetic Inspiration':
        'Note="3 rd performance gives allies +1 attack, +1 saves, or +2 morale for %V rd"',
      'Sense Construction':
        'Note="R10\' 87% Detect new construction, 66% sliding walls"',
      'Stealthy':'Note="Foe -4 surprise roll when traveling quietly"',
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
        'Section=feature Note="20% chance of magic item malfunction"',
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
        'Features+="1:Sense Slope" ' +
        'Languages=Common,Halfling'
    },
    'School':{
      // Removed
      'Divination':null,
      'Transmutation':null,
      // New
      'Alteration':'',
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
      'Leatherworking':'Ability=intelligence Class=all',
      'Local History':'Ability=charisma Class=Bard,Cleric,Druid,Thief',
      'Mining':'Ability=wisdom Class=all',
      'Modern Languages':'Ability=intelligence Class=all',
      'Mountaineering':'Class=Fighter,Paladin,Ranger',
      'Musical Instrument':'Ability=dexterity Class=Cleric,Druid',
      'Navigation':'Ability=intelligence Class=Cleric,Druid',
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
      'Spirit-Wrack':null,
      'True Sight':null,
      'Write':null,
      // Modified
      'Affect Normal Fires':
        'Description="R${L}y change size of normal fires in 10\' radius for $L2 rd"',
      'Astral Spell':'School=Evocation',
      'Audible Glamer':
        'Description="R$L10plus60\' Sounds of $L4 shouting for $L3 rd (save disbelieve)"',
      'Augury':'School="Lesser Divination"',
      'Blindness':
        'Description="R$L10plus30\' Target blinded (save neg)"',
      'Blink':
        'Description="Self random teleport 10\'/rd for $L rd"',
      'Burning Hands':
        'Description="Self 5\' cone of flame 1d3+$L2 HP"',
      'Clairaudience':'School="Lesser Divination"',
      'Clairvoyance':'School="Lesser Divination"',
      'Color Spray':
        'Description="Targets in 20\' cone unconscious (lt $Lplus1 HD), blinded 1d4 rd ($Lplus1-$Lplus2) or stunned 1 rd (gt $Lplus2) (save neg)"',
      'Commune':'School="Greater Divination"',
      'Commune With Nature':'School="Greater Divination"',
      'Contact Other Plane':'School="Greater Divination"',
      'Cure Disease':'School=Abjuration',
      'Detect Charm':'School="Lesser Divination"',
      'Detect Evil':'School="Lesser Divination"',
      'Detect Invisibility':'School="Lesser Divination"',
      'Detect Lie':'School="Lesser Divination"',
      'Detect Magic':'School="Lesser Divination"',
      'Detect Pits And Snares':'School="Lesser Divination"',
      'Dispel Magic':
        'Description="R120\' 50% (+5%/-5% per caster level delta) magic in 30\'x30\' area extinguished"',
      'Divination':'School="Lesser Divination"',
      'Enchant An Item':'School=Enchantment',
      'Enchanted Weapon':'School=Enchantment',
      'Enlarge':
        'Description="R$L5\' Creature or object grows $L10% for $L5 rd (rev shrinks, save neg)"',
      'Erase':
        'Description="R30\' Erase magical ($L5plus30% chance) or normal (90%) from 2-page area"',
      'ESP':'School="Lesser Divination"',
      'Feather Fall':
        'Description="R$L10\' Objects in 10\'x10\'x10\' area fall 2\'/sec for $L rd"',
      'Feign Death':
        'Description="Touched appears dead, takes half damage, immune draining for $Lplus6 tn"',
      'Find The Path':'School="Greater Divination"',
      'Find Traps':'School="Lesser Divination"',
      'Finger Of Death':'School=Necromancy',
      'Fire Trap':'School=Abjuration',
      'Fireball':
        'Description="R$L10plus10\' ${Lmax10}d6 HP in 20\' radius (save half)"',
      'Flame Arrow':
        'School=Conjuration ' +
        'Description="Touched arrow 1 HP fire damage within 1 rd or R$L10plus30 self cast $Ldiv5 bolts for 5d6 HP (save half)"',
      'Fly':
        'Description="Touched can fly 180\'/rd for 1d6+$L6 tn"',
      'Gaze Reflection':'Description="Gaze attacks reflected back for $L rd"',
      'Guards And Wards':'School=Evocation',
      'Gust Of Wind':
        'Description="Wind in 10\'x$L10\' path extinguishes flames, moves small objects for 1 rd"',
      'Heat Metal':'School=Alteration',
      'Hypnotic Pattern':
        'Description="R30\' Viewers in 30\' sq totaling 24 HD transfixed for conc (save neg)"',
      'Hypnotism':
        'Description="R5\' 1d6 targets subject to suggestion for $Lplus1 rd"',
      'Identify':
        'School="Lesser Divination"' +
        'Description="$L10% chance of determining magical properties of touched if used w/in $L rd, requires rest afterward"',
      'Illusionary Script':
        'Description="Obscured writing transmits <i>Suggestion</i> (save neg) for readers other than specified for $L dy"',
      'Improved Phantasmal Force':
        'Description="R$L10plus60\' $L50plus200\' sq sight and sound illusion for conc + 2 rd"',
      'Incendiary Cloud':'School=Alteration',
      'Jump':
        'School=Transmutation ' +
        'Description="Touched can jump 30\' forward, 10\' back or up for $L+1d3 rd"',
      'Knock':
        'Description="R60\' Open stuck, locked item (rev locks)"',
      'Know Alignment':'School="Lesser Divination"',
      'Know Alignment':
        'School="Lesser Divination" ' +
        'Description="Self discern aura of 1 target/2 rd for $L rd (rev obscures)"',
      'Legend Lore':'School="Greater Divination"',
      'Lightning Bolt':
        'Description="R$L10plus40\' Bolt ${Lmax10}d6 HP (save half)"',
      'Locate Object':'School="Lesser Divination"',
      'Major Creation':'School=Illusion',
      'Massmorph':'School=Alteration',
      'Message':'Description="R$L10plus30\' remote whispering for $L5 rd"',
      'Minor Creation':'School=Illusion',
      'Mirror Image':
        'Description="Self 2d4 duplicates in 6\' radius draw attacks for $L3 rd"',
      'Misdirection':
        'Description="R30\' Divination spells cast on target return false info for 8 hr"',
      'Neutralize Poison':'School=Necromancy',
      'Non-Detection':
        'Description="Touched invisible to divination for $L hr"',
      'Phantasmal Force':
        'Description="R$L10plus60\' $L10plus40\' sq illusionary object for conc or until struck"',
      'Prismatic Sphere':'School=Abjuration',
      'Prismatic Wall':'School=Conjuration',
      'Ray Of Enfeeblement':
        'Description="R$L5plus10\' Target 5 Str (-2 attack, -1 damage) for $L rd"',
      'Read Magic':'School="Lesser Divination"',
      'Rope Trick':
        'Description="Touched rope leads to interdimensional space that holds 8 for $L2 tn"',
      'Scare':
        'Description="R$L10plus30\' Target lt 6 HD frozen in terror (save neg) for 1d4+$L rd"',
      'Shield':
        'Description="Self frontal AC 2 vs hurled, AC 3 vs arrow/bolt, AC 4 vs melee for $L5 rd"',
      'Shocking Grasp':'Description="Touched 1d8+$L HP within $L rd"',
      'Shatter':
        'Description="R$L10plus30\' $L10 lbs brittle material shatters (save neg)"',
      'Sleep':
        'Description="R30\' Creatures up to 4+4 HD in 15\' radius sleep for $L5 rd"',
      'Spectral Force':
        'Description="R$Lplus60\' $L10plus1600\' sq sight, sound, smell, temperature illusion for conc + 3 rd"',
      'Spider Climb':
        'Description="Touched move 60\'/rd on walls and ceilings for $Lplus3 rd"',
      'Stone Tell':'School="Greater Divination"',
      'Strength':
        'Description="Touched Str +1d4 (Wiz), +1d6 (Priest, Rogue), or +1d8 (Warrior) for 1 tn"',
      'Tiny Hut':
        'Description="15\' diameter protects against view, elements for $Lplus4 hr"',
      'True Seeing':'School="Greater Divination"',
      'Ventriloquism':
        'Description="R$L10max90\' Self throw voice for $Lplus4 rd (save disbelieve)"',
      'Vision':'School="Greater Divination"',
      'Water Breathing':
        'Description="Touched breathe water (rev air) for $L+1d4 hr"',
      // Added
      'Abjure':'School=Abjuration Description="TODO"',
      'Acid Arrow':
        'School=Conjuration ' +
        'Description="R180\' Ranged touch 2d4 HP/rd for $Ldiv3plus1 rd"',
      'Advanced Illusion':'School=Illusion Description="TODO"',
      'Aid':'School=Necromancy Description="TODO"',
      'Air Walk':'School=Alteration Description="TODO"',
      'Alarm':'School=Abjuration Description="R10\' 20\' cu alarmed for $L30plus240 min"',
      'Alter Self':
        'School=Alteration Description="Self change form for 3d4+$L2 rd"',
      'Armor':'School=Conjuration Description="Touched AC 6 for $Lplus8 HP"',
      'Avoidance':'School=Abjuration Description="TODO"',
      'Banishment':'School=Abjuration Description="TODO"',
      'Bind':
        'School=Enchantment ' +
        'Description="R30\' $L5plus50\' rope-like item entangles or trips single target (save neg)"',
      'Binding':'School=Enchantment Description="TODO"',
      'Black Tentacles':'School=Conjuration Description="TODO"',
      'Changestaff':'School=Evocation Description="TODO"',
      'Chain Lightning':'School=Evocation Description="TODO"',
      'Chill Touch':
        'School=Necromancy ' +
        'Description="Touched 1d4 HP, 1 Str damage for $Lplus3 rd"',
      'Cloak Of Bravery':'School=Conjuration Description="TODO"',
      'Combine':'School=Evocation Description="TODO"',
      'Contagion':'School=Necromancy Description="TODO"',
      'Contingency':'School=Evocation Description="TODO"',
      'Control Undead':'School=Necromancy Description="TODO"',
      'Crystalbrittle':'School=Alteration Description="TODO"',
      'Cure Blindness Or Deafness':'School=Abjuration Description="TODO"',
      'Death Fog':'School=Alteration Description="TODO"',
      'Deeppockets':
        'School=Alteration ' +
        'Description="Touched garment carries 100 lbs comfortably"',
      'Delude':
        'School=Alteration ' +
        'Description="Self aura show alignment of creature in 10\' radius for $L tn"',
      'Demand':'School=Evocation Description="TODO"',
      'Detect Poison':'School="Lesser Divination" Description="TODO"',
      'Detect Scrying':'School="Lesser Divination" Description="TODO"',
      'Detect Undead':
        'School="Lesser Divination" ' +
        'Description="Self discern undead in 10\'x60\' path for 3 tn"',
      'Disjunction':'School=Alteration Description="TODO"',
      'Dismissal':'School=Abjuration Description="TODO"',
      'Domination':'School=Enchantment Description="TODO"',
      'Dream':'School=Evocation Description="TODO"',
      'Dust Devil':'School=Conjuration Description="TODO"',
      'Endure Cold':'School=Alteration Description="TODO"',
      'Endure Heat':'School=Alteration Description="TODO"',
      'Energy Drain':'School=Evocation Description="TODO"',
      'Enervation':'School=Necromancy Description="TODO"',
      'Ensnarement':'School=Conjuration Description="TODO"',
      'Enthrall':'School=Enchantment Description="TODO"',
      'Exaction':'School=Evocation Description="TODO"',
      'Eyebite':'School=Enchantment Description="TODO"',
      'Fabricate':'School=Enchantment Description="TODO"',
      'False Vision':'School="Greater Divination" Description="TODO"',
      'Flame Blade':'School=Evocation Description="TODO"',
      'Flame Walk':'School=Alteration Description="TODO"',
      'Flaming Sphere':
        'School=Evocation ' +
        'Description="R10\' 5\' diameter sphere 2d4 HP (save neg) jump/move 30\' for $L rd"',
      "Fool's Gold":'School=Alteration Description="TODO"',
      'Forbiddance':'School=Abjuration Description="TODO"',
      'Forcecage':'School=Evocation Description="TODO"',
      'Foresight':'School="Greater Divination" Description="TODO"',
      'Free Action':'School=Abjuration Description="TODO"',
      'Giant Insect':'School=Alteration Description="TODO"',
      'Glitterdust':
        'School=Conjuration ' +
        'Description="R10\' 20\' cu glowing dust coats and blinds 1d4+1 rd for 1d4+$L rd"',
      'Grease':
        'School=Conjuration ' +
        'Description="R10\' 10\'x10\' area slippery for $Lplus3 rd"',
      'Goodberry':'School=Alteration Description="TODO"',
      "Heroes' Feast":'School=Evocation Description="TODO"',
      'Hideous Laughter':
        'School=Enchantment ' +
        'Description="R60\' $Ldiv3 targets in 30\' cu -2 attack and damage for $L rd"',
      'Hold Undead':
        'School=Necromancy ' +
        'Description="R60\' Immobilize 1-3 targets (save neg) totalling $L HD for $Lplus4 rd"',
      'Illusionary Wall':'School=Illusion Description="TODO"',
      'Imbue With Spell Ability':'School=Enchantment Description="TODO"',
      'Invisibility To Undead':'School=Abjuration Description="TODO"',
      'Irritation':
        'School=Alteration ' +
        'Description="RL10\' 1-4 targets in 15\' radius itch (-4 AC, -2 attack) for 3 rd or rash (-1 Cha/dy for 4 dy) (save neg)"',
      'Item':
        'School=Alteration ' +
        'Description="Shrink touched $L2\' cu item to 1/12 size, change to cloth for $L4 hr"',
      'Lamentable Belaborment':'School=Enchantment Description="TODO"',
      'Liveoak':'School=Enchantment Description="TODO"',
      'Locate Animals Or Plants':'School="Lesser Divination" Description="TODO"',
      "Mage's Lucubration":'School=Alteration Description="TODO"',
      "Mage's Magnificent Mansion":'School=Alteration Description="TODO"',
      'Magic Font':'School="Greater Divination" Description="TODO"',
      'Magic Mirror':'School=Enchantment Description="TODO"',
      'Magical Stone':'School=Enchantment Description="TODO"',
      'Magical Vestment':'School=Enchantment Description="TODO"',
      'Messenger':'School=Enchantment Description="TODO"',
      'Meld Into Stone':'School=Alteration Description="TODO"',
      'Minute Meteors':
        'School=Evocation ' +
        'Description="R$L10plus70\' $L +2 ranged globes 1d4 HP"',
      'Mirage Arcana':'School=Illusion Description="TODO"',
      'Mislead':'School=Illusion Description="TODO"',
      'Moonbeam':'School=Evocation Description="TODO"',
      'Mount':
        'School=Conjuration ' +
        'Description="R10\' Create obedient mount for $L+2 hr"',
      'Phantom Steed':
        'School=Conjuration ' +
        'Description="R10\' Create obedient mount w/special abilities for $L hr"',
      'Protection From Cantrips':
        'School=Abjuration ' +
        'Description="Touched immune to cantrips for $Lplus5 hr"',
      'Negative Plane Protection':'School=Abjuration Description="TODO"',
      'Rainbow':'School=Evocation Description="TODO"',
      'Rainbow Pattern':'School=Alteration Description="TODO"',
      'Reflecting Pool':'School="Lesser Divination" Description="TODO"',
      'Remove Paralysis':'School=Abjuration Description="TODO"',
      'Resilient Sphere':'School=Alteration Description="TODO"',
      'Screen':'School="Greater Divination" Description="TODO"',
      'Secret Page':
        'School=Alteration ' +
        'Description="Overlay page with different contents"',
      'Secure Shelter':'School=Alteration Description="TODO"',
      'Seeming':'School=Illusion Description="TODO"',
      'Sending':'School=Evocation Description="TODO"',
      'Sepia Snake Sigil':
        'School=Conjuration ' +
        'Description="R5\' Rune becomes $L HD snake when read; bite immobilizes for $L+1d4 dy"',
      'Sequester':'School=Illusion Description="TODO"',
      'Shadow Walk':'School=Illusion Description="TODO"',
      'Shout':'School=Evocation Description="TODO"',
      'Sink':'School=Enchantment Description="TODO"',
      'Solid Fog':'School=Alteration Description="TODO"',
      'Spike Growth':'School=Alteration Description="TODO"',
      'Spike Stones':'School=Alteration Description="TODO"',
      'Spectral Hand':
        'School=Necromancy ' +
        'Description="R$L5plus30 Glowing hand delivers +2 touch attacks for $L2 rd"',
      'Spell Turning':'School=Abjuration Description="TODO"',
      'Spook':
        'School=Illusion ' +
        'Description="Target flees from self (save neg)"',
      'Starshine':'School=Evocation Description="TODO"',
      'Stoneskin':'School=Alteration Description="TODO"',
      'Succor':'School=Alteration Description="TODO"',
      'Summon Swarm':
        'School=Conjuration ' +
        'Description="R60\' Vermin in 10\' cu 1 HP/rd for conc + 2 rd"',
      'Sunray':'School=Evocation Description="TODO"',
      'Taunt':
        'School=Enchantment ' +
        'Description="R60\' Targets in 30\' radius attack caster"',
      'Telekinetic Sphere':'School=Evocation Description="TODO"',
      'Teleport Without Error':'School=Alteration Description="TODO"',
      'Transmute Water To Dust':'School=Alteration Description="TODO"',
      'Vacancy':'School=Alteration Description="TODO"',
      'Vampiric Touch':
        'School=Necromancy ' +
        'Description="Touch causes $Ldiv2max6 HP"',
      'Water Walk':'School=Alteration Description="TODO"',
      'Weird':'School=Illusion Description="TODO"',
      'Whispering Wind':
        'School=Alteration ' +
        'Description="R$L mi Self send 25 words or sound to known location"',
      'Wind Wall':
        'School=Alteration ' +
        'Description="R$L10\' Strong wind in $L50\' sq for $L rd"',
      'Withdraw':'School=Alteration Description="TODO"',
      'Wizard Mark':
        'School=Alteration ' +
        'Description="Etch item w/personal mark"',
      'Wraithform':
        'School=Alteration ' +
        'Description="Self insubstantial, effected only by magical weapons for $L2 rd"',
      'Wyvern Watch':'School=Evocation Description="TODO"'
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
      "Footman's Flail":FirstEdition.WEAPONS['Heavy Flail'],
      "Footman's Mace":FirstEdition.WEAPONS['Heavy Mace'],
      "Footman's Pick":FirstEdition.WEAPONS['Heavy Pick'],
      'Harpoon':'Category=R Damage=2d4 Range=10',
      "Horseman's Flail":FirstEdition.WEAPONS['Light Flail'],
      "Horseman's Mace":FirstEdition.WEAPONS['Light Mace'],
      "Horseman's Pick":FirstEdition.WEAPONS['Light Pick'],
      'Knife':'Category=Li Damage=d3 Range=10',
      'Heavy Horse Lance':'Category=2h Damage=d8+1',
      'Light Horse Lance':'Category=2h Damage=d3+1',
      'Medium Horse Lance':FirstEdition.WEAPONS['Medium Lance'],
      'Hook Fauchard':'Category=2h Damage=d4',
      'Khopesh':'Category=1h Damage=2d4',
      'Scourge':'Category=1h Damage=d4',
      'Sickle':'Category=1h Damage=d4+1',
      'Staff Sling':'Category=R Damage=d4 Range=30',
      'Warhammer':FirstEdition.WEAPONS['Hammer'],
      'Whip':'Category=1h Damage=d2'
    },
  },
  'OSRIC':{
    'Class':{
      'Assassin':
        'Require+=' +
          '"wisdom >= 6" ' +
        'WeaponProficiency=3,4,3 ' +
        'Experience=' +
          '0,1.6,3,5.75,12.25,24.75,50,99,200.5,300,400,600,750,1000,1500',
      'Bard':null,
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
          '0,2.5,475,9,18,36,60.25,95,144.5,220,440,660,880,1100,1320,1540,' +
          '1760,1980,2200,2420 ' +
        'SpellsPerDay=' +
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
        'WeaponProficiency=1,5,5 ' +
        'Experience=' +
          '0,2.4,4.8,10.25,22,40,60,80,140,250,375,750,1125,1500,1875,2250,' +
          '2625,3000,3375,3750 ' +
        'SpellsPerDay=' +
          'M1:1=1;2=2;4=3;5=4;12=5;21=6,' +
          'M2:3=1;4=2;6=3;9=4;13=5;21=6,' +
          'M3:5=1;6=2;8=3;11=4;14=5;22=6,' +
          'M4:7=1;8=2;11=3;14=4;17=5;22=6,' +
          'M5:9=1;10=2;11=3;14=4;17=5;23=6,' +
          'M6:12=1;13=2;15=3;17=4;19=5;23=6,' +
          'M7:14=1;15=2;17=3;19=4;22=5;24=6,' +
          'M8:16=1;17=2;19=3;21=4;24=5,' +
          'M9:18=1;20=2;23=3',
      'Monk':null,
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
      'Gnome Skill Modifiers':
        'Note="-15 Climb Walls/+5 Hear Noise/+10 Open Locks"',
      'Half-Orc Skill Modifiers':
        'Note="+5 Climb Walls/+5 Find Traps/+5 Hear Noise/+5 Open Locks/-5 Pick Pockets/-10 Read Languages"',
      'Halfling Skill Modifiers':
        'Section=skill Note="-15 Climb Walls/+5 Hear Noise/+15 Hide In Shadows/+15 Move Silently/+5 Pick Pockets/-5 Read Languages"',
      // New
      'Human Skill Modifiers':
        'Section=skill Note="+5 Climb Walls/+5 Open Locks"',
      'Slow':'Section=ability Note="-60 Speed"'
    },
    'Race':{
      'Dwarf':
        'Features+=Slow',
      'Gnome':
        'Features+=Slow',
      'Halfling':
        'Features+=Slow',
      'Human':
        'Features="rogueSkillLevel > 0 ? 1:Human Skill Modifiers"'
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

// Related information used internally by FirstEdition
FirstEdition.monkUnarmedDamage = [
  '0', '1d3', '1d4', '1d6', '1d6', '1d6+1', '2d4', '2d4+1', '2d6', '3d4',
  '2d6+1', '3d4+1', '4d4', '4d4+1', '5d4', '6d4', '5d6', '8d4'
];

/*
 * Uses the FirstEdition.RULE_EDIT rules for #type# for the current edition
 * to modify the values in #base# and returns the result. Each value listed
 * in the edit rules can use =, +=, or -= to indicate whether the new values
 * should replace, be added to, or be removed from the values in #base#.
 */
FirstEdition.editedRules = function(base, type) {
  var edits = FirstEdition.RULE_EDITS[FirstEdition.EDITION][type];
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
FirstEdition.abilityRules = function(rules) {

  for(var ability in SRD35.ABILITIES) {
    ability = ability.toLowerCase();
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
  if(FirstEdition.EDITION == 'Second Edition') {
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
    (FirstEdition.EDITION == 'Second Edition' ? 'source == 15 ? 90 : ' : '') +
    'source <= 17 ? source * 3 + 46 : 99'
  );
  rules.defineRule('combatNotes.constitutionHitPointsAdjustment',
    'constitution', '=',
    'source <= 3 ? -2 : source <= 6 ? -1 : source <= 14 ? null : (source - 14)',
    'warriorLevel', 'v', 'source == 0 ? 2 : null',
    'level', '*', null
  );
  rules.defineRule
    ('hitPoints', 'combatNotes.constitutionHitPointsAdjustment', '+', null);

  // Dexterity
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'dexterity', '=',
    'source <= 6 ? (7 - source) : source <= 14 ? null : ' +
    'source <= 18 ? 14 - source : -4'
  );
  rules.defineRule('combatNotes.dexterityAttackAdjustment',
    'dexterity', '=',
    (FirstEdition.EDITION == 'Second Edition' ? 'source == 18 ? 2 : ' : '') +
    'source <= 5 ? (source - 6) : source <= 15 ? null : ' +
    'source <= 18 ? source - 15 : 3'
  );
  rules.defineRule('combatNotes.dexteritySurpriseAdjustment',
    'dexterity', '=',
    (FirstEdition.EDITION == 'Second Edition' ? 'source == 18 ? 2 : ' : '') +
    'source <= 5 ? (source - 6) : source <= 15 ? null : ' +
    'source <= 18 ? source - 15 : 3'
  );

  // Intelligence
  if(FirstEdition.EDITION == 'Second Edition') {
    rules.defineRule('featureNotes.intelligenceLanguageBonus',
      'intelligence', '=',
        'source<=9 ? 1 : source == 9 ? 2 : source<=15 ? Math.floor((source-6)/2) : (source-11)'
    );
  } else {
    rules.defineRule('featureNotes.intelligenceLanguageBonus',
      'intelligence', '=',
        'source<=7 ? null : source<=15 ? Math.floor((source-6)/2) : (source-11)',
      'race', 'v',
        'source == "Human" ? null : ' +
        'source == "Half-Elf" ? 2 : ' +
        'source.indexOf("Elf") >= 0 ? 3 : 2'
    );
  }
  rules.defineRule
    ('languageCount', 'featureNotes.intelligenceLanguageBonus', '+', null);


  if(FirstEdition.EDITION == 'Second Edition')
  // Strength
  rules.defineRule('combatNotes.strengthAttackAdjustment',
    'strengthRow', '=', 'source <= 2 ? (source - 3) : ' +
                        'source <= 7 ? 0 : Math.floor((source - 5) / 3)'
  );
  rules.defineRule('combatNotes.strengthDamageAdjustment',
    'strengthRow', '=', 'source <= 1 ? -1 : source <= 6 ? 0 : ' +
                        'source == 7 ? 1 : (source - (source >= 11 ? 8 : 7))'
  );
  if(FirstEdition.EDITION == 'Second Edition') {
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
  if(FirstEdition.EDITION == 'Second Edition') {
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
FirstEdition.combatRules = function(rules, armors, shields, weapons) {

  for(var armor in armors) {
    rules.choiceRules(rules, 'Armor', armor, armors[armor]);
  }
  for(var shield in shields) {
    rules.choiceRules(rules, 'Shield', shield, shields[shield]);
  }
  for(var weapon in weapons) {
    rules.choiceRules(rules, 'Weapon', weapon, weapons[weapon]);
  }

  rules.defineRule
    ('armorClass', 'combatNotes.dexterityArmorClassAdjustment', '+', null);
  rules.defineRule('attacksPerRound', '', '=', '1');
  rules.defineRule('baseAttack', '', '=', '0');
  rules.defineRule('combatNotes.weaponSpecialization',
    'weaponSpecialization', '=', 'source == "None" ? null : source'
  );
  if(FirstEdition.EDITION == 'Second Edition') {
    rules.defineRule('combatNotes.weaponSpecialization.1',
      'weaponSpecialization', '=', 'source.indexOf("Bow") >= 0 ? 2 : 1'
    );
    rules.defineRule('combatNotes.weaponSpecialization.2',
      'weaponSpecialization', '=', 'source.indexOf("Bow") >= 0 ? 0 : 2'
    );
    rules.defineRule('combatNotes.weaponSpecialization.3',
      'weaponSpecialization', '=',
        'source == "None" ? null : source.indexOf("Crossbow") >= 0 ? -0.5 : 0',
      'levels.Fighter', '+', 'source < 7 ? 0.5 : source < 13 ? 1 : 1.5',
    );
    SRD35.prerequisiteRules
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
    if(FirstEdition.EDITION == 'OSRIC') {
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
    'combatNotes.dexterityAttackAdjustment', '+', null,
    // Note: the rules seem to indicate that strength affects ranged attacks
    'combatNotes.strengthAttackAdjustment', '+', null
  );
  rules.defineRule
    ('thac0Melee', 'meleeAttack', '=', 'Math.min(20 - source, 20)');
  rules.defineRule
    ('thac0Ranged', 'rangedAttack', '=', 'Math.min(20 - source, 20)');
  rules.defineRule
    ('thac10Melee', 'meleeAttack', '=', 'Math.min(10 - source, 20)');
  rules.defineRule
    ('thac10Ranged', 'rangedAttack', '=', 'Math.min(10 - source, 20)');
  if(FirstEdition.EDITION == 'Second Edition')
    rules.defineRule('turnUndeadColumn',
      'turningLevel', '=',
      'source <= 9 ? source : source <= 11 ? 10 : source <= 13 ? 11 : 12'
    );
  else
    rules.defineRule('turnUndeadColumn',
      'turningLevel', '=',
      'source <= 8 ? source : source <= 13 ? 9 : source <= 18 ? 10 : 11'
    );
  var turningTable = FirstEdition.EDITION == 'OSRIC' ? [
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
  ] : FirstEdition.EDITION == 'Second Edition' ? [
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
  // Get rid of mention of "Buckler" in SRD35 two-handed weapon note
  var notes = rules.getChoices('notes');
  if(notes && notes['validationNotes.two-handedWeapon'])
    delete notes['validationNotes.two-handedWeapon'];
  rules.defineChoice
    ('notes', 'validationNotes.two-handedWeapon:Requires shield == "None"');
  rules.defineRule('weapons.Unarmed', '', '=', '1');
  rules.defineRule('weaponProficiencyCount', 'weapons.Unarmed', '=', '1');
  rules.defineRule('weaponProficiency.Unarmed', 'weapons.Unarmed', '=', '1');

};

/* Defines the rules related to goodies included in character notes. */
FirstEdition.goodiesRules = function(rules) {
  SRD35.goodiesRules(rules);
  // No changes needed to the rules defined by SRD35 method
};

/* Defines rules related to basic character identity. */
FirstEdition.identityRules = function(
  rules, alignments, classes, genders, races
) {

  for(var alignment in alignments) {
    rules.choiceRules(rules, 'Alignment', alignment, alignments[alignment]);
  }
  for(var clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
  }
  for(var gender in genders) {
    rules.choiceRules(rules, 'Gender', gender, genders[gender]);
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
  if(FirstEdition.EDITION == 'First Edition') {
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
  } else if(FirstEdition.EDITION == 'OSRIC') {
    rules.defineRule('skillNotes.rogueSkills.1',
      'rogueSkillLevel', '=', 'source<7 ? 2*source + 78 : Math.min(source + 84, 99)'
    );
    rules.defineRule('skillNotes.rogueSkills.2',
      'rogueSkillLevel', '=', 'source<18 ? 4*source+21 : Math.min(2*source+55, 99)'
    );
    rules.defineRule
      ('skillNotes.rogueSkills.3', 'rogueSkillLevel', '+=', '3* source + 7');
    rules.defineRule('skillNotes.rogueSkills.4',
      'rogueSkillLevel', '=', 'source < 16 ? 5 * source + 15 : (source + 75)',
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
  SRD35.validAllocationRules
    (rules, 'weaponProficiency', 'weaponProficiencyCount', 'Sum "^weaponProficiency\\."');
  rules.defineRule('validationNotes.weaponProficiencyAllocation.2',
    'weaponSpecialization', '+', 'source == "None" ? null : 1',
    'doubleSpecialization', '+', 'source ? 1 : null'
  );

};

/* Defines rules related to magic use. */
FirstEdition.magicRules = function(rules, schools, spells) {
  for(var school in schools) {
    rules.choiceRules(rules, 'School', school, schools[school]);
  }
  for(var spell in spells) {
    rules.choiceRules(rules, 'Spell', spell, spells[spell]);
  }
};

/* Defines rules related to character features, languages, and skills. */
FirstEdition.talentRules = function(rules, features, languages, skills) {

  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
  for(var language in languages) {
    rules.choiceRules(rules, 'Language', language, languages[language]);
  }
  for(var skill in skills) {
    rules.choiceRules(rules, 'Skill', skill, skills[skill]);
  }

  var rogueSkills = [
    '', 'Climb Walls', 'Find Traps', 'Hear Noise', 'Hide In Shadows',
    'Move Silently', 'Open Locks', 'Pick Pockets', 'Read Languages'
  ];
  for(var i = 1; i < rogueSkills.length; i++) {
    var skill = rogueSkills[i];
    if(FirstEdition.EDITION == 'Second Edition') {
      rules.defineRule('skills.' + skill, 'skillNotes.rogueSkills', '^=', '0');
      rules.defineRule
        ('skillModifier.' + skill, 'skillNotes.rogueSkills.' + i, '+', null);
    } else {
      rules.defineRule
        ('skills.' + skill, 'skillNotes.rogueSkills.' + i, '+=', null);
    }
  }
  if(FirstEdition.EDITION == 'Second Edition') {
    rules.defineChoice('notes', 'skillNotes.armorSkillModifiers:%1 Climb Walls/%2 Find Traps/%3 Hear Noise/%4 Hide In Shadows/%5 Move Silently/%6 Open Locks/%7 Pick Pockets');
    rules.defineRule
      ('skillNotes.armorSkillModifiers', 'rogueSkillLevel', '=', '1',);
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
  SRD35.validAllocationRules
    (rules, 'language', 'languageCount', 'Sum "^languages\\."');
  SRD35.validAllocationRules
    (rules, 'skill', 'skillPoints', 'Sum "^skills\\.[^\\.]*$"');

};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
FirstEdition.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Alignment')
    FirstEdition.alignmentRules(rules, name);
  else if(type == 'Armor')
    FirstEdition.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Move'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Class') {
    FirstEdition.classRules(rules, name,
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
      QuilvynUtils.getAttrValueArray(attrs, 'SpellsPerDay'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      FirstEdition.editedRules(FirstEdition.SPELLS, 'Spell')
    );
    FirstEdition.classRulesExtra(rules, name);
  } else if(type == 'Feature')
    FirstEdition.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Gender')
    FirstEdition.genderRules(rules, name);
  else if(type == 'Language')
    FirstEdition.languageRules(rules, name);
  else if(type == 'Race') {
    FirstEdition.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      FirstEdition.editedRules(FirstEdition.SPELLS, 'Spell')
    );
    FirstEdition.raceRulesExtra(rules, name);
  } else if(type == 'School')
    FirstEdition.schoolRules(rules, name);
  else if(type == 'Shield')
    FirstEdition.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight')
    );
  else if(type == 'Skill')
    FirstEdition.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      QuilvynUtils.getAttrValueArray(attrs, 'Class')
    );
  else if(type == 'Spell')
    FirstEdition.spellRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'School'),
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  else if(type == 'Weapon')
    FirstEdition.weaponRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'Range')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  if(type != 'Feature') {
    type = type == 'Class' ? 'levels' :
    (type.substring(0,1).toLowerCase() + type.substring(1).replace(/ /g, '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
FirstEdition.alignmentRules = function(rules, name) {
  if(!name) {
    console.log('Empty alignment name');
    return;
  }
  // No rules pertain to alignment
};

/*
 * Defines in #rules# the rules associated with armor #name#, which improves
 * the character's armor class by #ac# and imposes a maximum movement speed of
 * #maxMove# and weighs #weight# pounds.
 */
FirstEdition.armorRules = function(rules, name, ac, maxMove, weight) {

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

  if(FirstEdition.EDITION != 'Second Edition') {
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
 * character level attribute 'level'. #spellsPerDay# lists the number of spells
 * per level per day that the class can cast, and #spells# lists spells defined
 * by the class. #spellDict# is the dictionary of all spells used to look up
 * individual spell attributes.
 */
FirstEdition.classRules = function(
  rules, name, requires, experience, hitDie, attack, saveBreath, saveDeath,
  savePetrification, saveSpell, saveWand, features, selectables, languages,
  weaponProficiency, casterLevelArcane, casterLevelDivine, spellsPerDay,
  spells, spellDict
) {

  if(!name) {
    console.log('Empty class name');
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
  if(!Array.isArray(weaponProficiency) || weaponProficiency.length != 3) {
    console.log('Bad weaponProficiency "' + weaponProficiency + '" for class ' + name);
    return;
  }

  rules.defineChoice('preset', name);

  var classLevel = 'levels.' + name;
  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replace(/ /g, '');

  if(requires.length > 0)
    SRD35.prerequisiteRules
      (rules, 'validation', prefix + 'Class', classLevel, requires);

  rules.defineChoice('notes', 'experiencePoints.' + name + ':%V/%1');
  rules.defineRule('experiencePoints.' + name + '.1',
    classLevel, '=', 'source < ' + experience.length + ' ? [' + experience + '][source] * 1000 : ' + (experience[experience.length - 1] * 1000 + 1)
  );
  rules.defineRule(classLevel,
    'experiencePoints.' + name, '=', 'source >= ' + (experience[experience.length - 1] * 1000) + ' ? ' + experience.length + ' : [' + experience + '].findIndex(item => item * 1000 > source)'
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

  SRD35.featureListRules(rules, features, name, classLevel, false);
  for(var i = 0; i < features.length; i++) {
    if(features[i].match(/Armor Proficiency.*\//)) {
      var armors =
        features[i].replace(/^.*\(/, '').replace(/\)$/, '').split('/');
      for(var j = 0; j < armors.length; j++) {
        rules.defineRule('features.Armor Proficiency (' + armors[j] + ')',
          prefix + 'Features.' + features[i].replace(/^\d+:/, ''), '=', '1'
        );
      }
    }
  }
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

  if(spellsPerDay.length > 0) {
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
    if(casterLevelArcane) {
      rules.defineRule('casterLevelArcane', 'casterLevels.' + name, '+=', null);
    }
    if(casterLevelDivine) {
      rules.defineRule('casterLevelDivine', 'casterLevels.' + name, '+=', null);
    }
    for(var i = 0; i < spellsPerDay.length; i++) {
      var spellTypeAndLevel = spellsPerDay[i].split(/:/)[0];
      var spellType = spellTypeAndLevel.replace(/\d+/, '');
      var spellLevel = spellTypeAndLevel.replace(/[A-Z]*/, '');
      var code = spellsPerDay[i].substring(spellTypeAndLevel.length + 1).
                 replace(/=/g, ' ? ').
                 split(/;/).reverse().join(' : source >= ');
      code = 'source >= ' + code + ' : null';
      if(code.indexOf('source >= 1 ?') >= 0) {
        code = code.replace(/source >= 1 ./, '').replace(/ : null/, '');
      }
      rules.defineRule('spellsPerDay.' + spellTypeAndLevel,
        'levels.' + name, '+=', code
      );
      if(spellType != name) {
        rules.defineRule('casterLevels.' + spellType,
          'casterLevels.' + name, '=', null,
        );
      }
    }
  }

  for(var i = 0; i < spells.length; i++) {
    var pieces = spells[i].split(':');
    var matchInfo = pieces[0].match(/^(\w+)(\d)$/);
    if(pieces.length != 2 || !matchInfo) {
      console.log('Bad format for spell list "' + spells[i] + '"');
      break;
    }
    var group = matchInfo[1];
    var level = matchInfo[2];
    var spellNames = pieces[1].split(';');
    for(var j = 0; j < spellNames.length; j++) {
      var spellName = spellNames[j];
      if(spellDict[spellName] == null) {
        console.log('Unknown spell "' + spellName + '"');
        continue;
      }
      var school = QuilvynUtils.getAttrValue(spellDict[spellName], 'School');
      if(school == null) {
        console.log('No school given for spell ' + spellName);
        continue;
      }
      var fullSpell =
        spellName + '(' + group + level + ' ' + school.substring(0, 4) + ')';
      var dictEntry =
        fullSpell in spellDict ? spellDict[fullSpell] : spellDict[spellName];
      rules.choiceRules
        (rules, 'Spell', fullSpell,
         dictEntry + ' Group=' + group + ' Level=' + level);
    }
  }

};

/*
 * Defines in #rules# the rules associated with class #name# that are not
 * directly derived from the parameters passed to classRules.
 */
FirstEdition.classRulesExtra = function(rules, name) {

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
    rules.defineRule
      ('rogueSkillLevel', 'levels.Assassin', '+=', 'Math.max(source - 2, 1)');

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
    if(FirstEdition.EDITION == 'Second Edition') {
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

    var t = FirstEdition.EDITION == 'Second Edition' ? 'P' : 'C';

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
    if(FirstEdition.EDITION == 'OSRIC') {
      rules.defineRule('magicNotes.clericSpellFailure',
        'wisdom', '=', 'Math.max((12 - source) * 5, 1)'
      );
    } else {
      rules.defineRule('magicNotes.clericSpellFailure',
        'wisdom', '=', '(13 - source) * 5'
      );
      rules.defineRule('spellsPerDay.'+t+'6', 'wisdom', '?', 'source > 16');
      rules.defineRule('spellsPerDay.'+t+'7', 'wisdom', '?', 'source > 17');
    }
    rules.defineRule('spellsPerDay.'+t+'1', 'bonusClericSpells.1', '+', null);
    rules.defineRule('spellsPerDay.'+t+'2', 'bonusClericSpells.2', '+', null);
    rules.defineRule('spellsPerDay.'+t+'3', 'bonusClericSpells.3', '+', null);
    rules.defineRule('spellsPerDay.'+t+'4', 'bonusClericSpells.4', '+', null);
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
    rules.defineRule
      ('skillNotes.woodlandLanguages', 'levels.Druid', '=', 'source - 2');
    if(FirstEdition.EDITION != 'Second Edition') {
      rules.defineRule('spellsPerDay.D1', 'bonusDruidSpells.1', '+', null);
      rules.defineRule('spellsPerDay.D2', 'bonusDruidSpells.2', '+', null);
      rules.defineRule('spellsPerDay.D3', 'bonusDruidSpells.3', '+', null);
      rules.defineRule('spellsPerDay.D4', 'bonusDruidSpells.4', '+', null);
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

    if(!FirstEdition.EDITION == 'OSRIC') {
      rules.defineRule('classBaseAttackAdjustment',
        'levels.Illusionist', '+=', 'source > 15 ? 2 : source > 10 ? 1 : null'
      );
    }

  } else if(name == 'Magic User') {

    if(!FirstEdition.EDITION == 'OSRIC') {
      rules.defineRule('classBaseAttackAdjustment',
        'levels.Magic User', '+=', 'source > 15 ? 2 : source > 10 ? 1 : null'
      );
    }
    if(FirstEdition.EDITION == 'Second Edition') {
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
        'levels.Magic User', '?', null,
        'intelligence', '=', 'source < 10 ? 0 : source < 13 ? 1 : source < 15 ? 2 : source < 17 ? 3 : (source - 13)'
      );
      rules.defineRule('maximumSpellsPerLevel',
        'intelligenceRow', '=', 'source * 2 + 5 + (source == 0 ? 1 : source < 4 ? 0 : source == 4 ? 1 : source == 5 ? 3 : 5)'
      );
      rules.defineRule('understandSpell',
        'intelligenceRow', '=', 'Math.min(35 + source * 10, 90)'
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
      'levels.Monk', '=', 'FirstEdition.monkUnarmedDamage[source]'
    );

  } else if(name == 'Paladin') {

    if(FirstEdition.EDITION == 'OSRIC') {
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
    rules.defineRule('save.Breath', 'levels.Paladin', '^', '2');
    rules.defineRule('save.Death', 'levels.Paladin', '^', '2');
    rules.defineRule('save.Petrification', 'levels.Paladin', '^', '2');
    if(FirstEdition.EDITION == 'Second Edition') {
      rules.defineRule('saveNotes.circleOfPower', 'levels.Paladin', '=', null);
    }
    rules.defineRule('turningLevel',
      'levels.Paladin', '+=', 'source > 2 ? source - 2 : null'
    );
    rules.defineRule('warriorLevel', 'levels.Paladin', '+', null);

  } else if(name == 'Ranger') {

    if(FirstEdition.EDITION == 'Second Edition') {
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

  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
FirstEdition.featureRules = function(rules, name, sections, notes) {
  SRD35.featureRules(rules, name, sections, notes);
  // No changes needed to the rules defined by SRD35 method
};

/* Defines in #rules# the rules associated with gender #name#. */
FirstEdition.genderRules = function(rules, name) {
  if(!name) {
    console.log('Empty gender name');
    return;
  }
  // No rules pertain to gender
};

/* Defines in #rules# the rules associated with language #name#. */
FirstEdition.languageRules = function(rules, name) {
  if(!name) {
    console.log('Empty language name');
    return;
  }
  // No rules pertain to language
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features and #languages# the automatic languages. #spells# lists
 * any natural spells, and #spellDict# is the dictionary of all spells used to
 * look up individual spell attributes.
 */
FirstEdition.raceRules = function(
  rules, name, requires, features, selectables, languages, spells, spellDict
) {
  SRD35.raceRules(
    rules, name, requires, features, selectables, languages, 'intelligence',
    spells, spellDict
  );
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with race #name# that are not
 * directly derived from the parmeters passed to raceRules.
 */
FirstEdition.raceRulesExtra = function(rules, name) {

  if(name == 'Half-Elf') {
    rules.defineRule('saveNotes.resistCharm', 'half-ElfLevel', '+=', '30');
    rules.defineRule('saveNotes.resistSleep', 'half-ElfLevel', '+=', '30');
  } else if(name == 'Dwarf') {
    rules.defineRule('featureNotes.knowDepth', 'dwarfLevel', '+=', '50');
    rules.defineRule('featureNotes.senseSlope',
      'dwarfLevel', '+=', FirstEdition.EDITION == 'Second Edition' ? '87' : '75'
    );
  } else if(name == 'Elf') {
    rules.defineRule('saveNotes.resistCharm', 'elfLevel', '+=', '90');
    rules.defineRule('saveNotes.resistSleep', 'elfLevel', '+=', '90');
  } else if(name == 'Gnome') {
    rules.defineRule('featureNotes.knowDepth',
      'gnomeLevel', '+=', FirstEdition.EDITION == 'Second Edition' ? '50' : '60'
    );
    rules.defineRule('featureNotes.senseSlope',
      'gnomeLevel', '+=', FirstEdition.EDITION == 'Second Edition' ? '87' : '80'
    );
  }

};

/* Defines in #rules# the rules associated with magic school #name#. */
FirstEdition.schoolRules = function(rules, name) {
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
FirstEdition.shieldRules = function(rules, name, ac, weight) {

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
 * #ability# (one of 'strength', 'intelligence', etc.).  #classes# lists the
 * classes for which this is a class skill; a value of "all" indicates that
 * this is a class skill for all classes.
 */
FirstEdition.skillRules = function(rules, name, ability, classes) {

  if(!name) {
    console.log('Empty skill name');
    return;
  }
  if(ability != null &&
     !ability.match(/^(charisma|constitution|dexterity|intelligence|strength|wisdom)$/i)) {
    console.log('Bad ability "' + ability + '" for skill ' + name);
  }

  var nameNoSpace = name.replace(/ /g, '');

  rules.defineRule('skillModifier.' + name, 'skills.' + name, '=', null);
  rules.defineChoice('notes', 'skillNotes.dexteritySkillModifiers:%1 Find Traps/%2 Hide In Shadows/%3 Move Silently/%4 Open Locks/%5 Pick Pockets');
  if(FirstEdition.EDITION == 'OSRIC') {
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
FirstEdition.spellRules = function(
  rules, name, school, casterGroup, level, description
) {
  if(school == 'Transmutation' && FirstEdition.EDITION == 'Second Edition')
    school = 'Alteration';
  SRD35.spellRules(rules, name, school, casterGroup, level, description);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which belongs to
 * weapon category #category# (one of '1h', '2h', 'Li', 'R', 'Un' or their
 * spelled-out equivalents). The weapon does #damage# HP on a successful attack.
 * If specified, the weapon can be used as a ranged weapon with a range
 * increment of #range# feet.
 */
FirstEdition.weaponRules = function(rules, name, category, damage, range) {
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
FirstEdition.choiceEditorElements = function(rules, type) {
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
      ['SpellsPerDay', 'Spells Per Day', 'text', [40]],
      ['Spells', 'Spells', 'text', [40]]
    );
  else if(type == 'Weapon') {
    var oneToFive = [1, 2, 3, 4, 5];
    var sixteenToTwenty = [16, 17, 18, 19, 20];
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
  return result
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
FirstEdition.randomizeOneAttribute = function(attributes, attribute) {
  var attr;
  var attrs;
  var choices;
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
    attributes['armor'] = choices.length == 0 ? 'None' :
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
  } else if(attribute == 'levels') {
    var classes = this.getChoices('levels');
    var classAttrSet = false;
    for(attr in classes) {
      if(attr in attributes)
        classAttrSet = true;
    }
    if(!classAttrSet) {
      // Add a random class of level 1..4
      attributes[QuilvynUtils.randomKey(classes)] = QuilvynUtils.random(1, 4);
    }
    for(attr in classes) {
      if(!(attr in attributes))
        continue;
      // Delete the level attribute (from the random character preset);
      // calculate experience needed for this and prior levels to assign a
      // random experience value that will yield this level.
      attributes['levels.' + attr] = attributes[attr];
      delete attributes[attr];
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
    attributes['shield'] = choices.length == 0 ? 'None' :
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

/* Returns HTML body content for user notes associated with this rule set. */
FirstEdition.ruleNotes = function() {
  return '' +
    '<h2>FirstEdition Quilvyn Module Notes</h2>\n' +
    'FirstEdition Quilvyn Module Version ' + FirstEdition_VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Although the 1E PHB doesn\'t discuss strongholds for illusionists,\n' +
    '    the description notes that the class mostly conforms to the\n' +
    '    characteristics of magic-users. The latter may build strongholds\n' +
    '    at level 12, and Quilvyn treats illusionists similarly.\n' +
    '  </li>\n' +
    '  <li>\n' +
    '    The OSRIC rules discuss illusionist scrolls, but does not give\n' +
    '    the minimum level required to create them. Quilvyn uses the 1E PHB\n' +
    '    limit of level 10.\n' +
    '  </li>\n' +
    '  <li>\n' +
    '    Quilvyn generally uses the OSRIC names and effects for spells,\n' +
    '    rather than those found in the 1E PHB.\n',
    '  </li>\n' +
    '  <li>\n' +
    '    The OSRIC rules are unclear as to whether or not the Fighting the\n' +
    '    Unskilled feature applies to Paladins and Rangers. Quilvyn assumes\n' +
    '    that it does.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn does not note racial restrictions on class and level.\n' +
    '  </li>\n' +
    '  <li>\n' +
    '    Quilvyn does not note class restrictions on weapon choice.\n' +
    '  </li>\n' +
    '  <li>\n' +
    '    In Second Edition, Quilvyn does not consider sphere limitations\n' +
    '    to priest spell sections.\n' +
    '  </li>\n' +
    '  <li>\n' +
    '    Quilvyn does not note Halfling characters with a strength of 18,\n' +
    '    nor (OSRIC rules) Elf characters with a constitution of 18.\n' +
    '  </li>\n' +
    '  <li>\n' +
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
