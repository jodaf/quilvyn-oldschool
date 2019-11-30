/*
Copyright 2015, James J. Hayes

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

var FirstEdition_VERSION = '1.4.0.2alpha';

/*
 */
function FirstEdition() {

  if(window.SRD35 == null) {
    alert('The FirstEdition module requires use of the SRD35 module');
    return;
  }

  var name = FirstEdition.USE_OSRIC_RULES ? 'OSRIC' : 'First Edition';
  var rules = new ScribeRules(name, FirstEdition_VERSION);
  SRD35.createViewers(rules, SRD35.VIEWERS);
  rules.editorElements = SRD35.initialEditorElements();
  // Remove some editor and character sheet elements that don't apply
  rules.defineEditorElement('skills');
  rules.defineEditorElement('feats');
  rules.defineEditorElement('specialize');
  rules.defineEditorElement('prohibit');
  rules.defineEditorElement('experience', 'Experience', 'text', [8], 'levels');
  rules.defineEditorElement
    ('weaponProficiency', 'Weapon Proficiency', 'set', 'weapons', 'spells');
  rules.defineSheetElement('ExperienceInfo', 'Level', null, '');
  rules.defineSheetElement('Experience', 'ExperienceInfo/');
  rules.defineSheetElement('Experience Needed', 'ExperienceInfo/', '/%V');
  rules.defineSheetElement('Weapon Proficiency Count', 'Combat Notes');
  rules.defineSheetElement('Weapon Proficiency', 'Combat Notes', null, '; ');

  FirstEdition.abilityRules(rules);
  FirstEdition.raceRules(rules, FirstEdition.LANGUAGES, FirstEdition.RACES);
  FirstEdition.classRules(rules, FirstEdition.CLASSES);
  FirstEdition.descriptionRules(rules, SRD35.ALIGNMENTS, SRD35.GENDERS);
  FirstEdition.equipmentRules
    (rules, FirstEdition.ARMORS, FirstEdition.SHIELDS, FirstEdition.WEAPONS);
  FirstEdition.combatRules(rules);
  FirstEdition.movementRules(rules);
  FirstEdition.magicRules(rules, FirstEdition.CLASSES, SRD35.SCHOOLS);
  FirstEdition.goodiesRules(rules, FirstEdition.GOODIES);
  FirstEdition.spellDescriptionRules
    (rules, null, FirstEdition.spellsDescriptions);
  rules.defineChoice('preset', 'race', 'level', 'levels');
  rules.defineChoice('random', FirstEdition.RANDOMIZABLE_ATTRIBUTES);
  rules.randomizeOneAttribute = FirstEdition.randomizeOneAttribute;
  rules.makeValid = SRD35.makeValid;
  rules.ruleNotes = FirstEdition.ruleNotes;
  Scribe.addRuleSet(rules);

}

FirstEdition.ARMORS = [
  'None', 'Banded', 'Chain', 'Elfin Chain', 'Leather', 'Padded', 'Plate',
  'Ring', 'Scale', 'Splint', 'Studded'
];
FirstEdition.CLASSES = [
  'Assassin', 'Cleric', 'Druid', 'Fighter', 'Illusionist', 'Magic User',
  'Paladin', 'Ranger', 'Thief'
];
FirstEdition.GOODIES = [
  'Chain +2',
  'Chain +4',
  'Ring Of Protection +1'
];
FirstEdition.LANGUAGES = [
  'Common', "Druids' Cant", 'Dwarfish', 'Elven', 'Gnoll', 'Gnomish', 'Goblin',
  'Halfling', 'Hobgoblin', 'Kobold', 'Orcish'
];
FirstEdition.RACES =
  ['Dwarf', 'Elf', 'Gnome', 'Half Elf', 'Half Orc', 'Halfling', 'Human'];
// Note: the order here handles dependencies among attributes when generating
// random characters
FirstEdition.RANDOMIZABLE_ATTRIBUTES = [
  'charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom',
  'extraStrength', 'name', 'race', 'gender', 'alignment', 'levels',
  'languages', 'hitPoints', 'proficiencies', 'armor', 'shield', 'weapons',
  'spells', 'goodies'
];
FirstEdition.SHIELDS = [
  'Large Shield', 'Medium Shield', 'None', 'Small Shield'
];
// OSRIC varies slightly from the classic 1E rules. If USE_OSRIC_RULES is true,
// FirstEdition incorporates these modifications into its rule set; otherwise,
// it sticks to the 1E PHB.
FirstEdition.USE_OSRIC_RULES = true;
FirstEdition.WEAPONS = [
  'Bastard Sword:2d4', 'Battle Axe:d8', 'Broad Sword:2d4',
  'Composite Long Bow:d6r60', 'Composite Short Bow:d6r50', 'Dagger:d4r10',
  'Dart:d3r15', 'Halberd:d10', 'Hammer:d4+1r10', 'Hand Axe:d6r10',
  'Heavy Flail:d6+1', 'Heavy Mace:d6+1', 'Heavy Pick:d6+1', 'Javelin:d6r20',
  'Light Flail:d4+1', 'Light Pick:d4+1', 'Long Bow:d6r70', 'Long Sword:d8',
  'Morning Star:2d4', 'Quarterstaff:d6', 'Scimitar Sword:d8', 'Short Bow:d6r50',
  'Short Sword:d6', 'Trident:d6+1', 'Two-Handed Sword:d10'
];
if(FirstEdition.USE_OSRIC_RULES) {
  FirstEdition.WEAPONS.push(
    'Club:d4r10', 'Heavy Crossbow:d6+1r60', 'Light Crossbow:d4+1r60',
    'Light Mace:d4+1', 'Sling:d4r35', 'Spear:d6r15',
    'Heavy War Hammer:d6+1', 'Lance:2d4+1', 'Light War Hammer:d4+1',
    'Pole Arm:d6+1'
  );
} else {
  FirstEdition.WEAPONS.push(
    'Club:d6r10', 'Heavy Crossbow:d4+1r80', 'Light Crossbow:d4r60',
    'Light Mace:d6', 'Sling:d4r40', 'Spear:d6r10',
    'Bardiche:2d4', 'Bec De Corbin:d8', 'Bill-Guisarme:2d4', 'Bo Stick:d6',
    'Fauchard:d6', 'Fauchard-Fork:d8', 'Glaive:d6', 'Glaive-Guisarme:2d4',
    'Guisarme:2d4', 'Guisarme-Voulge:2d4', 'Heavy Lance:d6+3', 'Jo Stick:d6',
    'Light Lance:d6', 'Lucern Hammer:2d4', 'Medium Lance:d6+1',
    'Military Fork:d8', 'Partisan:d6', 'Pike:d6', 'Ranseur:2d4', 'Spetum:d6+1',
    'Voulge:2d4'
  );
}

// Related information used internally by FirstEdition
FirstEdition.armorsArmorClassBonuses = {
  'None' : null, 'Banded' : -6, 'Chain' : -5, 'Elfin Chain' : -5,
  'Leather' : -2, 'Padded' :-2, 'Plate' : -7, 'Ring' : -3, 'Scale' : -4,
  'Splint' : -6, 'Studded' : -3
};
if(FirstEdition.USE_OSRIC_RULES) {
  FirstEdition.thiefSkillsRacialAdjustments = {
    'Dwarf Climb Walls':-10, 'Dwarf Find Traps':15, 'Dwarf Move Quietly':-5,
    'Dwarf Open Locks':15, 'Dwarf Read Languages':-5,
    'Elf Climb Walls':-5, 'Elf Find Traps':5, 'Elf Hear Noise':5,
    'Elf Hide In Shadows':10, 'Elf Move Quietly':5, 'Elf Open Locks':-5,
    'Elf Pick Pockets':5, 'Elf Read Languages':10,
    'Gnome Climb Walls':-15, 'Gnome Hear Noise':5, 'Gnome Open Locks':10,
    'Half Elf Hide In Shadows':5, 'Half Elf Pick Pockets':10,
    'Halfling Climb Walls':-15, 'Halfling Hear Noise':5,
    'Halfling Hide In Shadows':15, 'Halfling Move Quietly':15,
    'Halfling Pick Pockets':5, 'Halfling Read Languages':-5,
    'Half Orc Climb Walls':5, 'Half Orc Find Traps':5, 'Half Orc Hear Noise':5,
    'Half Orc Open Locks':5, 'Half Orc Pick Pockets':-5,
    'Half Orc Read Languages':-10,
    'Human Climb Walls':5, 'Human Open Locks':5
  };
} else {
  FirstEdition.thiefSkillsRacialAdjustments = {
    'Dwarf Climb Walls':-10, 'Dwarf Find Traps':15, 'Dwarf Open Locks':10,
    'Dwarf Read Languages':-5,
    'Elf Hear Noise':5, 'Elf Hide In Shadows':10, 'Elf Move Quietly':5,
    'Elf Open Locks':-5, 'Elf Pick Pockets':5,
    'Gnome Climb Walls':-15, 'Gnome Find Traps':10, 'Gnome Hear Noise':10,
    'Gnome Hide In Shadows':5, 'Gnome Move Quietly':5, 'Gnome Open Locks':5,
    'Half Elf Hide In Shadows':5, 'Half Elf Pick Pockets':10,
    'Halfling Climb Walls':-15, 'Halfling Find Traps':5,
    'Halfling Hear Noise':5, 'Halfling Hide In Shadows':15,
    'Halfling Move Quietly':10, 'Halfling Open Locks':5,
    'Halfling Pick Pockets':5, 'Halfling Read Languages':-5,
    'Half Orc Climb Walls':5, 'Half Orc Find Traps':5, 'Half Orc Hear Noise':5,
    'Half Orc Open Locks':5, 'Half Orc Pick Pockets':-5,
    'Half Orc Read Languages':-10
  };
}
FirstEdition.spellsAbbreviations = {
  "L": "lvl",
  "L2": "lvl * 2",
  "L3": "lvl * 3",
  "L4": "lvl * 4",
  "L5": "lvl * 5",
  "L10": "lvl * 10",
  "L15": "lvl * 15",
  "L20": "lvl * 20",
  "L40": "lvl * 40",
  "L100": "lvl * 100",
  "L200": "lvl * 200",
  "Ldiv2": "Math.floor(lvl/2)",
  "Ldiv3": "Math.floor(lvl/3)",
  "Ldiv4": "Math.floor(lvl/4)",
  "Lmin5": "Math.min(source, 5)",
  "Lmin10": "Math.min(source, 10)",
  "Lmin15": "Math.min(source, 15)",
  "Lmin20": "Math.min(source, 20)",
  "Lmin25": "Math.min(source, 25)",
  "Lmin30": "Math.min(source, 30)",
  "Lmin35": "Math.min(source, 35)",
  "Lmin40": "Math.min(source, 40)",
  "RL": "400 + 40 * source",
  "RM": "100 + 10 * source",
  "RS": "25 + 5 * Math.floor(source / 2)"
};
FirstEdition.spellsDescriptions = {
  'Aerial Servant':'TODO',
  'Affect Normal Fires':'TODO',
  'Airy Water':'TODO',
  'Alter Reality':'TODO',
  'Animal Friendship':'TODO',
  'Animal Growth':'TODO',
  'Animal Summoning I':'TODO',
  'Animal Summoning II':'TODO',
  'Animal Summoning III':'TODO',
  'Animate Dead':'TODO',
  'Animate Object':'TODO',
  'Animate Rock':'TODO',
  'Anti-Animal Shell':'TODO',
  'Anti-Magic Shell':'TODO',
  'Anti-Plant Shell':'TODO',
  'Antipathy/Sympathy':'TODO',
  'Arcane Spells Level 1':'TODO',
  'Astral Spell':'TODO',
  'Atonement':'TODO',
  'Audible Glamer':'TODO',
  'Augury':"${70+lvl}% chance of determining weal/woe of action in next 3 turns",
  'Barkskin':'TODO',
  'Blade Barrier':'TODO',
  'Bless':"R60' Unengaged allies in 25' radius circle +1 attack/morale (reversable for foes) for 6 rds",
  'Blindness':'TODO',
  'Blink':'TODO',
  'Blur':'TODO',
  'Burning Hands':'TODO',
  'Cacodemon':'TODO',
  'Call Lightning':'TODO',
  'Call Woodland Beings':'TODO',
  'Change Self':'TODO',
  'Chant':'TODO',
  'Chaos':'TODO',
  'Chariot Of Fire':'TODO',
  'Charm Monster':'TODO',
  'Charm Person Or Mammal':'TODO',
  'Charm Person':'TODO',
  'Charm Plants':'TODO',
  'Clairaudience':'TODO',
  'Clairvoyance':'TODO',
  'Clenched Fist':'TODO',
  'Clone':'TODO',
  'Cloudkill':'TODO',
  'Color Spray':'TODO',
  'Command':"R10' Target obeys single-word command (save neg for Int 13+/HD 6+)",
  'Commune With Nature':'TODO',
  'Commune':'TODO',
  'Comprehend Languages':'TODO',
  'Cone Of Cold':'TODO',
  'Confusion':'TODO',
  'Conjure Animals':'TODO',
  'Conjure Earth Elemental':'TODO',
  'Conjure Elemental':'TODO',
  'Conjure Fire Elemental':'TODO',
  'Contact Other Plane':'TODO',
  'Continual Darkness':'TODO',
  'Continual Light':"R120' Target centers 60' radius light sphere (rev darkness) until dispelled",
  "Control Temperature 10' Radius":'TODO',
  'Control Weather':'TODO',
  'Control Winds':'TODO',
  'Create Food And Water':'TODO',
  'Create Water':"R10' Creates $L4 gallons potable water in 30' cube",
  'Creeping Doom':'TODO',
  'Crushing Hand':'TODO',
  'Cure Blindness':"Touched cured of blindness (rev blinds, save neg)",
  'Cure Critical Wounds':'TODO',
  'Cure Disease':"Touched cured of disease (rev infects, save neg)",
  'Cure Light Wounds':"Touched heals d8 HP (rev inflicts)",
  'Cure Serious Wounds':"Touched heals 2d8+1 HP (rev inflicts)",
  'Dancing Lights':'TODO',
  'Darkness':'TODO',
  'Deafness':'TODO',
  'Death Spell':'TODO',
  'Delayed Blast Fireball':'TODO',
  'Demi-Shadow Magic':'TODO',
  'Demi-Shadow Monsters':'TODO',
  'Detect Charm':'TODO',
  'Detect Evil':"Self dicerns evil (rev good) in 10'x120' path for 1 turn + $L5 rd",
  'Detect Illusion':'TODO',
  'Detect Invisibility':'TODO',
  'Detect Lie':"R30' Target dicerns lies for $L rd (rev makes lies believable)",
  'Detect Magic':'TODO',
  'Detect Pits And Snares':'TODO',
  'Dig':'TODO',
  'Dimension Door':'TODO',
  'Disintegrate':'TODO',
  'Dispel Exhaustion':'TODO',
  'Dispel Evil':'TODO',
  'Dispel Illusion':'TODO',
  'Dispel Magic':"R60' 50% (+5%/-2% per caster level delta) magic in 30' radius sphere extinguished",
  'Distance Distortion':'TODO',
  'Divination':'TODO',
  'Duo-Dimension':'TODO',
  'ESP':'TODO',
  'Earthquake':'TODO',
  'Emotion':'TODO',
  'Enchant An Item':'TODO',
  'Enchanted Weapon':'TODO',
  'Enlarge':'TODO',
  'Entangle':'TODO',
  'Erase':'TODO',
  'Exorcise':'TODO',
  'Explosive Runes':'TODO',
  'Extension I':'TODO',
  'Extension II':'TODO',
  'Extension III':'TODO',
  'Faerie Fire':'TODO',
  'False Trap':'TODO',
  'Fear':'TODO',
  'Feather Fall':'TODO',
  'Feeblemind':'TODO',
  'Feign Death':'TODO',
  'Find Familiar':'TODO',
  'Find The Path':'TODO',
  'Find Traps':"Detect traps in 30'x10' area for 3 turns",
  'Finger Of Death':'TODO',
  'Fire Charm':'TODO',
  'Fire Seeds':'TODO',
  'Fire Shield':'TODO',
  'Fire Storm':'TODO',
  'Fire Trap':'TODO',
  'Fireball':'TODO',
  'Flame Arrow':'TODO',
  'Flame Strike':'TODO',
  'Floating Disk':'TODO',
  'Fly':'TODO',
  'Fog Cloud':'TODO',
  "Fool's Gold":'TODO',
  'Forceful Hand':'TODO',
  'Forget':'TODO',
  'Freezing Sphere':'TODO',
  'Friends':'TODO',
  'Fumble':'TODO',
  'Gate':'TODO',
  'Gaze Reflection':'TODO',
  'Geas':'TODO',
  'Glass-Steel':'TODO',
  'Glasseye':'TODO',
  'Globe Of Invulnerability':'TODO',
  'Glyph Of Warding':"Touching ${lvl*25}' sq causes $L2 HP energy",
  'Grasping Hand':'TODO',
  'Guards And Wards':'TODO',
  'Gust Of Wind':'TODO',
  'Hallucinatory Forest':'TODO',
  'Hallucinatory Terrain':'TODO',
  'Haste':'TODO',
  'Heal':"Touched healed of all but 1d4 HP, cured of blindness, disease, feeblemind (rev drains all but 1d4 HP, save neg)",
  'Heat Metal':'TODO',
  'Hold Animal':'TODO',
  'Hold Monster':'TODO',
  'Hold Person':"R60' 1-3 medium targets immobilized (save neg) for ${lvl + 4} rd",
  'Hold Plant':'TODO',
  'Hold Portal':'TODO',
  'Holy Word':'TODO',
  'Hypnotic Pattern':'TODO',
  'Hypnotism':'TODO',
  'Ice Storm':'TODO',
  'Identify':'TODO',
  'Illusory Script':'TODO',
  'Imprisonment':'TODO',
  'Improved Invisibility':'TODO',
  'Improved Phantasmal Force':'TODO',
  'Incendiary Cloud':'TODO',
  'Infravision':'TODO',
  'Insect Plague':'TODO',
  'Instant Summons':'TODO',
  'Interposing Hand':'TODO',
  "Invisibility 10' Radius":'TODO',
  'Invisibility To Animals':'TODO',
  'Invisibility':'TODO',
  'Invisible Stalker':'TODO',
  'Irresistible Dance':'TODO',
  'Jump':'TODO',
  'Knock':'TODO',
  'Know Alignment':"Discern aura of 10 touched creatures in 1 turn",
  'Legend Lore':'TODO',
  'Levitate':'TODO',
  'Light':'TODO',
  'Lightning Bolt':'TODO',
  'Limited Wish':'TODO',
  'Locate Animals':'TODO',
  'Locate Object':'TODO',
  'Locate Plants':'TODO',
  'Lower Water':'TODO',
  "Mage's Faithful Hound":'TODO',
  "Mage's Sword":'TODO',
  'Magic Aura':'TODO',
  'Magic Jar':'TODO',
  'Magic Missle':'TODO',
  'Magic Mouth':'TODO',
  'Major Creation':'TODO',
  'Mass Charm':'TODO',
  'Mass Invisibility':'TODO',
  'Mass Suggestion':'TODO',
  'Massmorph':'TODO',
  'Maze':'TODO',
  'Mending':'TODO',
  'Message':'TODO',
  'Meteor Swarm':'TODO',
  'Mind Blank':'TODO',
  'Minor Creation':'TODO',
  'Minor Globe Of Invulnerability':'TODO',
  'Mirror Image':'TODO',
  'Misdirection':'TODO',
  'Mnemonic Enhancement':'TODO',
  'Monster Summoning I':'TODO',
  'Monster Summoning II':'TODO',
  'Monster Summoning III':'TODO',
  'Monster Summoning IV':'TODO',
  'Monster Summoning V':'TODO',
  'Monster Summoning VI':'TODO',
  'Monster Summoning VII':'TODO',
  'Move Earth':'TODO',
  'Neutralize Poison':"Touched detoxed (rev lethally poisoned, save neg)",
  'Non-Detection':'TODO',
  'Obscurement':'TODO',
  'Paralyzation':'TODO',
  'Part Water':'TODO',
  'Pass Plant':'TODO',
  'Pass Without Trace':'TODO',
  'Passwall':'TODO',
  'Permanency':'TODO',
  'Permanent Illusion':'TODO',
  'Phantasmal Force':'TODO',
  'Phantasmal Killer':'TODO',
  'Phase Door':'TODO',
  'Plane Shift':'TODO',
  'Plant Door':'TODO',
  'Plant Growth':'TODO',
  'Polymorph Object':'TODO',
  'Polymorph Other':'TODO',
  'Polymorph Self':'TODO',
  'Power Word Blind':'TODO',
  'Power Word Kill':'TODO',
  'Power Word Stun':'TODO',
  'Prayer':"Allies w/in 60' +1 attack, damage, saves (foes -1) for $L rd",
  'Predict Weather':'TODO',
  'Prismatic Sphere':'TODO',
  'Prismatic Spray':'TODO',
  'Prismatic Wall':'TODO',
  'Produce Fire':'TODO',
  'Produce Flame':'TODO',
  'Programmed Illusion':'TODO',
  'Project Image':'TODO',
  "Protection From Evil":"Touched untouchable by evil outsiders, -2 evil attacks, +2 saves for $L3 rd",
  "Protection From Evil 10' Radius":"All in 10' radius of touched untouchable by evil outsiders, -2 evil attacks, +2 saves for $L rd",
  'Protection From Fire':'TODO',
  'Protection From Lightning':'TODO',
  'Protection From Normal Missles':'TODO',
  'Purify Food And Drink':'TODO',
  'Purify Water':'TODO',
  'Push':'TODO',
  'Pyrotechnics':'TODO',
  'Quest':'TODO',
  'Raise Dead':'TODO',
  'Ray Of Enfeeblement':'TODO',
  'Read Magic':'TODO',
  'Regenerate':'TODO',
  'Reincarnation':'TODO',
  'Remove Curse':"Touched uncursed (rev cursed for $L turns)",
  'Remove Fear':"Touched +4 vs. fear for 1 turn, new +$L save if already afraid",
  'Repel Insects':'TODO',
  'Repulsion':'TODO',
  'Resist Cold':'TODO',
  'Resist Fire':"Touched immune normal fire, +3 vs. magical for $L turns",
  'Restoration':'TODO',
  'Resurrection':'TODO',
  'Reverse Gravity':'TODO',
  'Rope Trick':'TODO',
  'Sanctuary':"Foes save vs. magic to attack self for ${lvl + 2} rd",
  'Scare':'TODO',
  'Secret Chest':'TODO',
  'Shades':'TODO',
  'Shadow Door':'TODO',
  'Shadow Magic':'TODO',
  'Shadow Monsters':'TODO',
  'Shape Change':'TODO',
  'Shatter':'TODO',
  'Shield':'TODO',
  'Shillelagh':'TODO',
  'Shocking Grasp':'TODO',
  "Silence 15' Radius":"R120' No sound in 30' radius sphere for $L2 rd",
  'Simulacrum':'TODO',
  'Sleep':'TODO',
  'Slow Poison':"Touched takes only 1 HP/turn from poison, protected from death for ${lvl * 6} turns",
  'Slow':'TODO',
  'Snake Charm':"Charm angry snakes up to self HP 1d4+4 rd",
  'Snare':'TODO',
  'Speak With Animals':"Self converse w/animals for $L2 rd",
  'Speak With Dead':'TODO',
  'Speak With Monsters':'TODO',
  'Speak With Plants':'TODO',
  'Spectral Force':'TODO',
  'Spell Immunity':'TODO',
  'Spider Climb':'TODO',
  'Spirit-Wrack':'TODO',
  'Spiritual Weapon':"R30' magical force attacks for conc/$L rd",
  'Statue':'TODO',
  'Sticks To Snakes':"R30' $L sticks in 10' cu become snakes ($L5% venonous) (reversable) for $L2 rd",
  'Stinking Cloud':'TODO',
  'Stone Shape':'TODO',
  'Stone Tell':'TODO',
  'Stone To Flesh':'TODO',
  'Strength':'TODO',
  'Suggestion':'TODO',
  'Summon Insects':'TODO',
  'Summon Shadow':'TODO',
  'Symbol':'TODO',
  'Telekinesis':'TODO',
  'Teleport':'TODO',
  'Temporal Statis':'TODO',
  'Time Stop':'TODO',
  'Tiny Hut':'TODO',
  'Tongues':"Self understand any speach (reversable) in 30' radius for 1 turn",
  'Transformation':'TODO',
  'Transmute Metal To Wood':'TODO',
  'Transmute Rock To Mud':'TODO',
  'Transport Via Plants':'TODO',
  'Trap The Soul':'TODO',
  'Tree':'TODO',
  'Trip':'TODO',
  'True Seeing':'TODO',
  'True Sight':'TODO',
  'Turn Wood':'TODO',
  'Unseen Servant':'TODO',
  'Vanish':'TODO',
  'Veil':'TODO',
  'Ventriloquism':'TODO',
  'Vision':'TODO',
  'Wall Of Fire':'TODO',
  'Wall Of Fog':'TODO',
  'Wall Of Force':'TODO',
  'Wall Of Ice':'TODO',
  'Wall Of Iron':'TODO',
  'Wall Of Stone':'TODO',
  'Wall Of Thorns':'TODO',
  'Warp Wood':'TODO',
  'Water Breathing':'TODO',
  'Weather Summoning':'TODO',
  'Web':'TODO',
  'Wind Walk':'TODO',
  'Wish':'TODO',
  'Wizard Eye':'TODO',
  'Wizard Lock':'TODO',
  'Word Of Recall':'TODO',
  'Write':'TODO'
};
FirstEdition.spellsSchools = {
  'Aerial Servant':'Conjuration', 'Affect Normal Fires':'Transmutation',
  'Airy Water':'Transmutation', 'Alter Reality':'Illusion',
  'Animal Friendship':'Enchantment', 'Animal Growth':'Transmutation',
  'Animal Summoning I':'Conjuration', 'Animal Summoning II':'Conjuration',
  'Animal Summoning III':'Conjuration', 'Animate Dead':'Necromancy',
  'Animate Object':'Transmutation', 'Animate Rock':'Transmutation',
  'Anti-Animal Shell':'Abjuration', 'Anti-Magic Shell':'Abjuration',
  'Anti-Plant Shell':'Abjuration', 'Antipathy/Sympathy':'Enchantment',
  'Arcane Spells Level 1':'Universal', 'Astral Spell':'Transmutation',
  'Atonement':'Abjuration', 'Audible Glamer':'Illusion',
  'Augury':'Divination', 'Barkskin':'Transmutation',
  'Blade Barrier':'Evocation', 'Bless':'Conjuration', 'Blindness':'Illusion',
  'Blink':'Transmutation', 'Blur':'Illusion', 'Burning Hands':'Transmutation',
  'Cacodemon':'Conjuration', 'Call Lightning':'Transmutation',
  'Call Woodland Beings':'Conjuration', 'Change Self':'Illusion',
  'Chant':'Conjuration', 'Chaos':'Enchantment', 'Chariot Of Fire':'Evocation',
  'Charm Monster':'Enchantment', 'Charm Person Or Mammal':'Enchantment',
  'Charm Person':'Enchantment', 'Charm Plants':'Enchantment',
  'Clairaudience':'Divination', 'Clairvoyance':'Divination',
  'Clenched Fist':'Evocation', 'Clone':'Necromancy', 'Cloudkill':'Evocation',
  'Color Spray':'Transmutation', 'Command':'Enchantment',
  'Commune With Nature':'Divination', 'Commune':'Divination',
  'Comprehend Languages':'Transmutation', 'Cone Of Cold':'Evocation',
  'Confusion':'Enchantment', 'Conjure Animals':'Conjuration',
  'Conjure Earth Elemental':'Conjuration', 'Conjure Elemental':'Conjuration',
  'Conjure Fire Elemental':'Conjuration', 'Contact Other Plane':'Divination',
  'Continual Darkness':'Transmutation', 'Continual Light':'Transmutation',
  "Control Temperature 10' Radius":'Transmutation',
  'Control Weather':'Transmutation', 'Control Winds':'Transmutation',
  'Create Food And Water':'Transmutation', 'Create Water':'Transmutation',
  'Creeping Doom':'Conjuration', 'Crushing Hand':'Evocation',
  'Cure Blindness':'Abjuration', 'Cure Critical Wounds':'Necromancy',
  'Cure Disease':'Necromancy', 'Cure Light Wounds':'Necromancy',
  'Cure Serious Wounds':'Necromancy', 'Dancing Lights':'Transmutation',
  'Darkness':'Transmutation', 'Deafness':'Illusion',
  'Death Spell':'Necromancy', 'Delayed Blast Fireball':'Evocation',
  'Demi-Shadow Magic':'Illusion', 'Demi-Shadow Monsters':'Illusion',
  'Detect Charm':'Divination', 'Detect Evil':'Divination',
  'Detect Illusion':'Divination', 'Detect Invisibility':'Divination',
  'Detect Lie':'Divination', 'Detect Magic':'Divination',
  'Detect Pits And Snares':'Divination', 'Dig':'Evocation',
  'Dimension Door':'Transmutation', 'Disintegrate':'Transmutation',
  'Dispel Exhaustion':'Illusion', 'Dispel Evil':'Abjuration',
  'Dispel Illusion':'Abjuration', 'Dispel Magic':'Abjuration',
  'Distance Distortion':'Transmutation', 'Divination':'Divination',
  'Duo-Dimension':'Transmutation', 'ESP':'Divination',
  'Earthquake':'Transmutation', 'Emotion':'Enchantment',
  'Enchant An Item':'Conjuration', 'Enchanted Weapon':'Transmutation',
  'Enlarge':'Transmutation', 'Entangle':'Transmutation',
  'Erase':'Transmutation', 'Exorcise':'Abjuration',
  'Explosive Runes':'Transmutation', 'Extension I':'Transmutation',
  'Extension II':'Transmutation', 'Extension III':'Transmutation',
  'Faerie Fire':'Transmutation', 'False Trap':'Illusion', 'Fear':'Illusion',
  'Feather Fall':'Transmutation', 'Feeblemind':'Enchantment',
  'Feign Death':'Necromancy', 'Find Familiar':'Conjuration',
  'Find The Path':'Divination', 'Find Traps':'Divination',
  'Finger Of Death':'Enchantment', 'Fire Charm':'Enchantment',
  'Fire Seeds':'Conjuration', 'Fire Shield':'Evocation',
  'Fire Storm':'Evocation', 'Fire Trap':'Evocation', 'Fireball':'Evocation',
  'Flame Arrow':'Evocation', 'Flame Strike':'Evocation',
  'Floating Disk':'Evocation', 'Fly':'Transmutation',
  'Fog Cloud':'Transmutation', "Fool's Gold":'Transmutation',
  'Forceful Hand':'Evocation', 'Forget':'Enchantment',
  'Freezing Sphere':'Transmutation', 'Friends':'Enchantment',
  'Fumble':'Enchantment', 'Gate':'Conjuration',
  'Gaze Reflection':'Transmutation', 'Geas':'Enchantment',
  'Glass-Steel':'Transmutation', 'Glasseye':'Transmutation',
  'Globe Of Invulnerability':'Abjuration', 'Glyph Of Warding':'Abjuration',
  'Grasping Hand':'Evocation', 'Guards And Wards':'Abjuration',
  'Gust Of Wind':'Transmutation', 'Hallucinatory Forest':'Illusion',
  'Hallucinatory Terrain':'Illusion', 'Haste':'Transmutation',
  'Heal':'Necromancy', 'Heat Metal':'Necromancy', 'Hold Animal':'Enchantment',
  'Hold Monster':'Enchantment', 'Hold Person':'Enchantment',
  'Hold Plant':'Enchantment', 'Hold Portal':'Transmutation',
  'Holy Word':'Conjuration', 'Hypnotic Pattern':'Illusion',
  'Hypnotism':'Enchantment', 'Ice Storm':'Evocation', 'Identify':'Divination',
  'Illusory Script':'Illusion', 'Imprisonment':'Abjuration',
  'Improved Invisibility':'Illusion', 'Improved Phantasmal Force':'Illusion',
  'Incendiary Cloud':'Evocation', 'Infravision':'Transmutation',
  'Insect Plague':'Conjuration', 'Instant Summons':'Conjuration',
  'Interposing Hand':'Evocation', "Invisibility 10' Radius":'Illusion',
  'Invisibility To Animals':'Transmutation', 'Invisibility':'Illusion',
  'Invisible Stalker':'Conjuration', 'Irresistible Dance':'Enchantment',
  'Jump':'Transmutation', 'Knock':'Transmutation',
  'Know Alignment':'Divination', 'Legend Lore':'Divination',
  'Levitate':'Transmutation', 'Light':'Transmutation',
  'Lightning Bolt':'Evocation', 'Limited Wish':'Conjuration',
  'Locate Animals':'Divination', 'Locate Object':'Divination',
  'Locate Plants':'Divination', 'Lower Water':'Transmutation',
  "Mage's Faithful Hound":'Conjuration', "Mage's Sword":'Evocation',
  'Magic Aura':'Illusion', 'Magic Jar':'Necromancy',
  'Magic Missle':'Evocation', 'Magic Mouth':'Transmutation',
  'Major Creation':'Transmutation', 'Mass Charm':'Enchantment',
  'Mass Invisibility':'Illusion', 'Mass Suggestion':'Enchantment',
  'Massmorph':'Illusion', 'Maze':'Conjuration', 'Mending':'Transmutation',
  'Message':'Transmutation', 'Meteor Swarm':'Evocation',
  'Mind Blank':'Abjuration', 'Minor Creation':'Transmutation',
  'Minor Globe Of Invulnerability':'Abjuration', 'Mirror Image':'Illusion',
  'Misdirection':'Illusion', 'Mnemonic Enhancement':'Transmutation',
  'Monster Summoning I':'Conjuration', 'Monster Summoning II':'Conjuration',
  'Monster Summoning III':'Conjuration', 'Monster Summoning IV':'Conjuration',
  'Monster Summoning V':'Conjuration', 'Monster Summoning VI':'Conjuration',
  'Monster Summoning VII':'Conjuration', 'Move Earth':'Transmutation',
  'Neutralize Poison':'Transmutation', 'Non-Detection':'Abjuration',
  'Obscurement':'Transmutation', 'Paralyzation':'Illusion',
  'Part Water':'Transmutation', 'Pass Plant':'Transmutation',
  'Pass Without Trace':'Enchantment', 'Passwall':'Transmutation',
  'Permanency':'Transmutation', 'Permanent Illusion':'Illusion',
  'Phantasmal Force':'Illusion', 'Phantasmal Killer':'Illusion',
  'Phase Door':'Transmutation', 'Plane Shift':'Transmutation',
  'Plant Door':'Transmutation', 'Plant Growth':'Transmutation',
  'Polymorph Object':'Transmutation', 'Polymorph Other':'Transmutation',
  'Polymorph Self':'Transmutation', 'Power Word Blind':'Conjuration',
  'Power Word Kill':'Conjuration', 'Power Word Stun':'Conjuration',
  'Prayer':'Conjuration', 'Predict Weather':'Divination',
  'Prismatic Sphere':'Conjuration', 'Prismatic Spray':'Abjuration',
  'Prismatic Wall':'Abjuration', 'Produce Fire':'Transmutation',
  'Produce Flame':'Transmutation', 'Programmed Illusion':'Illusion',
  'Project Image':'Illusion', "Protection From Evil 10' Radius":'Abjuration',
  'Protection From Evil':'Abjuration', 'Protection From Fire':'Abjuration',
  'Protection From Lightning':'Abjuration',
  'Protection From Normal Missles':'Abjuration',
  'Purify Food And Drink':'Transmutation', 'Purify Water':'Transmutation',
  'Push':'Conjuration', 'Pyrotechnics':'Transmutation', 'Quest':'Enchantment',
  'Raise Dead':'Necromancy', 'Ray Of Enfeeblement':'Enchantment',
  'Read Magic':'Divination', 'Regenerate':'Necromancy',
  'Reincarnation':'Necromancy', 'Remove Curse':'Abjuration',
  'Remove Fear':'Abjuration', 'Repel Insects':'Abjuration',
  'Repulsion':'Abjuration', 'Resist Cold':'Transmutation',
  'Resist Fire':'Transmutation', 'Restoration':'Necromancy',
  'Resurrection':'Necromancy', 'Reverse Gravity':'Transmutation',
  'Rope Trick':'Transmutation', 'Sanctuary':'Abjuration', 'Scare':'Enchantment',
  'Secret Chest':'Transmutation', 'Shades':'Illusion', 'Shadow Door':'Illusion',
  'Shadow Magic':'Illusion', 'Shadow Monsters':'Illusion',
  'Shape Change':'Transmutation', 'Shatter':'Transmutation',
  'Shield':'Evocation', 'Shillelagh':'Transmutation',
  'Shocking Grasp':'Transmutation', "Silence 15' Radius":'Transmutation',
  'Simulacrum':'Illusion', 'Sleep':'Enchantment', 'Slow Poison':'Necromancy',
  'Slow':'Transmutation', 'Snake Charm':'Enchantment', 'Snare':'Enchantment',
  'Speak With Animals':'Transmutation', 'Speak With Dead':'Necromancy',
  'Speak With Monsters':'Transmutation', 'Speak With Plants':'Transmutation',
  'Spectral Force':'Illusion', 'Spell Immunity':'Abjuration',
  'Spider Climb':'Transmutation', 'Spirit-Wrack':'Abjuration',
  'Spiritual Weapon':'Evocation', 'Statue':'Transmutation',
  'Sticks To Snakes':'Transmutation', 'Stinking Cloud':'Evocation',
  'Stone Shape':'Transmutation', 'Stone Tell':'Divination',
  'Stone To Flesh':'Transmutation', 'Strength':'Transmutation',
  'Suggestion':'Enchantment', 'Summon Insects':'Conjuration',
  'Summon Shadow':'Conjuration', 'Symbol':'Conjuration',
  'Telekinesis':'Transmutation', 'Teleport':'Transmutation',
  'Temporal Statis':'Transmutation', 'Time Stop':'Transmutation',
  'Tiny Hut':'Transmutation', 'Tongues':'Transmutation',
  'Transformation':'Transmutation', 'Transmute Metal To Wood':'Transmutation',
  'Transmute Rock To Mud':'Transmutation',
  'Transport Via Plants':'Transmutation', 'Trap The Soul':'Conjuration',
  'Tree':'Transmutation', 'Trip':'Enchantment',
  'True Seeing':'Divination', 'True Sight':'Divination',
  'Turn Wood':'Transmutation', 'Unseen Servant':'Conjuration',
  'Vanish':'Transmutation', 'Veil':'Illusion',
  'Ventriloquism':'Illusion', 'Vision':'Divination', 'Wall Of Fire':'Evocation',
  'Wall Of Fog':'Transmutation', 'Wall Of Force':'Evocation',
  'Wall Of Ice':'Evocation', 'Wall Of Iron':'Evocation',
  'Wall Of Stone':'Evocation', 'Wall Of Thorns':'Conjuration',
  'Warp Wood':'Transmutation', 'Water Breathing':'Transmutation',
  'Weather Summoning':'Conjuration', 'Web':'Evocation',
  'Wind Walk':'Transmutation', 'Wish':'Conjuration',
  'Wizard Eye':'Transmutation', 'Wizard Lock':'Transmutation',
  'Word Of Recall':'Transmutation', 'Write':'Evocation'
};
FirstEdition.strengthEncumbranceAdjustments = [
  -35, -25, -15, null, null, 10, 20, 35, 50, 75, 100, 125, 150, 200, 300
];

/* Defines the rules related to character abilities. */
FirstEdition.abilityRules = function(rules) {

  for(var ability in {'charisma':'', 'constitution':'', 'dexterity':'',
                      'intelligence':'', 'strength':'', 'wisdom':''}) {
    rules.defineRule(ability, ability + 'Adjust', '+', null);
  }

  // Charisma
  rules.defineRule('abilityNotes.charismaLoyaltyAjustment',
    'charisma', '=',
    'source <= 8 ? source * 5 - 45 : source <= 13 ? null : ' +
    'source <= 15 ? source * 5 - 65 : (source * 10 - 140)'
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

  // Constitution
  rules.defineRule('surviveResurrection',
    'constitution', '=',
    'source <= 13 ? source * 5 + 25 : source <= 18 ? source * 2 + 64 : 100'
  );
  rules.defineRule('surviveSystemShock',
    'constitution', '=',
    'source <= 13 ? source * 5 + 20 : source == 16 ? 95 : ' +
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
  rules.defineSheetElement
    ('Survive Resurrection', 'SaveAndResistance/', '<b>%N</b>: %V%');
  rules.defineSheetElement
    ('Survive System Shock', 'SaveAndResistance/', '<b>%N</b>: %V%');

  // Dexterity
  rules.defineRule
    ('armorClass', 'combatNotes.dexterityArmorClassAdjustment', '+', null);
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'dexterity', '=',
    'source <= 6 ? (7 - source) : source <= 14 ? null : ' +
    'source <= 18 ? 14 - source : -4'
  );
  rules.defineRule('combatNotes.dexterityMissleAttackAdjustment',
    'dexterity', '=',
    'source <= 5 ? (source - 6) : source <= 15 ? null : ' +
    'source <= 18 ? source - 15 : 3'
  );
  rules.defineRule('combatNotes.dexteritySurpriseAdjustment',
    'dexterity', '=',
    'source <= 5 ? (source - 6) : source <= 15 ? null : ' +
    'source <= 18 ? source - 15 : 3'
  );

  // Intelligence
  rules.defineRule('featureNotes.intelligenceLanguageBonus',
    'intelligence', '=',
    'source<=7 ? null : source<=15 ? Math.floor((source-6) / 2) : (source-11)'
  );
  rules.defineRule
    ('languageCount', 'featureNotes.intelligenceLanguageBonus', '+', null);

  // Strength
  rules.defineRule('abilityNotes.strengthEncumbranceAdjustment',
    'strengthRow', '=', 'FirstEdition.strengthEncumbranceAdjustments[source]'
  );
  rules.defineRule('combatNotes.strengthAttackAdjustment',
    'strengthRow', '=', 'source <= 2 ? (source - 3) : ' +
                        'source <= 7 ? null : Math.floor((source - 5) / 3)'
  );
  rules.defineRule('combatNotes.strengthDamageAdjustment',
    'strengthRow', '=', 'source <= 1 ? -1 : source <= 6 ? null : ' +
                        'source == 7 ? 1 : (source - (source >= 11 ? 8 : 7))'
  );
  // TODO Extraordinary success 1/6 for row 13, 2/6 (OSRIC 1/6) for row 14
  rules.defineRule('strengthMajorTest',
    'strengthRow', '=', 'source <= 2 ? 0 : ' +
                        'source <= 5 ? Math.pow(2, source - 3) : ' +
                        'source <= 9 ? source * 3 - 11 : (source * 5 - 30)'
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

  rules.defineSheetElement('Maximum Henchmen', 'Alignment');

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

  rules.defineRule('warriorLevel', '', '=', '0');

  for(var i = 0; i < classes.length; i++) {

    var baseAttack, features, hitDie, nonProfPenalty, notes, profCount,
        saveBreath, saveDeath, savePetrification, saveSpell, saveWand,
        spellsKnown, thiefSkillLevel;
    var klass = classes[i];

    spellsKnown = null;
    thiefSkillLevel = null;
    //TODO level experience points

    if(klass == 'Assassin') {

      baseAttack = 'source <= 4 ? -1 : source <= 8 ? 1 : source <= 12 ? 4 : 6';
      features = [
        'Assassination', 'Backstab', 'Disguise', '9:Extra Languages',
        '12:Read Scrolls'
      ];
      hitDie = 6;
      notes = [
        'combatNotes.assassinationFeature:' +
          'Strike kills surprised target %V% - 5%/2 foe levels',
        // TODO OSRIC "when unobserved"
        'combatNotes.backstabFeature:' +
          '+4 melee attack/x%V damage from behind',
        'featureNotes.disguiseFeature:92%+ chance of successful disguise',
        'featureNotes.extraLanguagesFeature:' +
          "+%V alignment/druidic/thieves' languages",
        'magicNotes.readScrollsFeature:Cast arcane spells from scrolls',
        'validationNotes.assassinClassAlignment:Requires Alignment =~ Evil'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        notes.push(
          'validationNotes.assassinClassAbility:' +
            'Requires Constitution >= 6/Dexterity >= 12/Intelligence >= 11/' +
            'Strength >= 12/Wisdom >= 6'
        );
        nonProfPenalty = -3;
      } else {
        notes.push(
          'validationNotes.assassinClassAbility:' +
            'Requires Constitution >= 6/Dexterity >= 12/Intelligence >= 11/' +
            'Strength >= 12'
        );
        nonProfPenalty = -2;
      }
      profCount = '3 + Math.floor(source / 4)';
      saveBreath = '16 - Math.floor((source - 1) / 4)';
      saveDeath = '13 - Math.floor((source - 1) / 4)';
      savePetrification = '12 - Math.floor((source - 1) / 4)';
      saveSpell = '15 - Math.floor((source - 1) / 4) * 2';
      saveWand = '14 - Math.floor((source - 1) / 4) * 2';
      thiefSkillLevel = 'source >= 4 ? source - 2 : 1';
      rules.defineRule('combatNotes.assassinationFeature',
        'levels.Assassin', '=', '50 + 5 * source'
      );
      rules.defineRule('combatNotes.backstabFeature',
        'levels.Assassin', '+=', '2 + Math.floor((source - 1) / 4)'
      );
      rules.defineRule('featureNotes.extraLanguagesFeature',
        'intelligence', '=', 'source < 15 ? null : (source - 14)',
        'levels.Assassin', 'v', 'source >= 9 ? source - 8 : 0' 
      );
      rules.defineRule
        ('languageCount', 'featureNotes.extraLanguagesFeature', '+=', null);

    } else if(klass == 'Cleric') {

      baseAttack = 'source < 19 ? Math.floor(source / 3) * 2 : 11';
      features = [
        'Bonus Cleric Experience', 'Turn Undead', '9:Attract Followers'
      ];
      hitDie = 8;
      nonProfPenalty = -3;
      notes = [
        'combatNotes.turnUndeadFeature:' +
          'Turn 2d6, destroy (good) or control (evil) d6+6 undead creatures',
        'featureNotes.attractFollowersFeature:' +
          'May build stronghold and attract followers',
        'featureNotes.bonusClericExperienceFeature:' +
          '10% added to awarded experience',
        'magicNotes.clericSpellFailure:%V%'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        notes.push(
          'validationNotes.clericClassAbility:' +
            'Requires Charisma >= 6/Constitution >= 6/Intelligence >= 6/' +
            'Strength >= 6/Wisdom >= 9'
        );
        profCount = '2 + Math.floor(source / 3)';
      } else {
        notes.push(
          'validationNotes.clericClassAbility:Requires Wisdom >= 9'
        );
        profCount = '2 + Math.floor(source / 4)';
      }
      saveBreath = '16 - Math.floor(source / 3) - Math.floor((source+5) / 12)';
      saveDeath = '10 - Math.floor(source / 3) - Math.floor((source+5) / 12)';
      savePetrification =
        '13 - Math.floor(source / 3) - Math.floor((source+5) / 12)';
      saveSpell = '15 - Math.floor(source / 3) - Math.floor((source+5) / 12)';
      saveWand = '14 - Math.floor(source / 3) - Math.floor((source+5) / 12)';
      spellsKnown = [
        'C1:1:1/2:2/4:3/9:4/11:5/12:6/15:7/17:8/19:9',
        'C2:3:1/4:2/5:3/9:4/12:5/13:6/15:7/17:8/19:9',
        'C3:5:1/6:2/8:3/11:4/12:5/13:6/15:7/17:8/19:9',
        'C4:7:1/8:2/10:3/13:4/14:5/16:6/18:7/20:8/21:9',
        'C5:9:1/10:2/14:3/15:4/16:5/18:6/20:7/21:8/22:9',
        'C6:11:1/12:2/16:3/18:4/20:5/21:6/23:7/24:8/26:9',
        'C7:16:1/19:2/22:3/25:4/27:5/28:6/29:7'
      ];
      rules.defineRule('casterLevelDivine', 'levels.Cleric', '+=', null);
      rules.defineRule('clericFeatures.Bonus Cleric Experience',
        'wisdom', '?', 'source >= 16'
      );
      if(FirstEdition.USE_OSRIC_RULES) {
        rules.defineRule('magicNotes.clericSpellFailure',
          'levels.Cleric', '?', null,
          'wisdom', '=', 'source<=11 ? (12-source) * 5 : source==12 ? 1 : null'
        );
      } else {
        rules.defineRule('magicNotes.clericSpellFailure',
          'levels.Cleric', '?', null,
          'wisdom', '=', 'source<=12 ? (13-source) * 5 : null'
        );
      }
      rules.defineRule('turningLevel', 'levels.Cleric', '+=', null);
      rules.defineRule('spellBonus.C1',
        'levels.Cleric', '?', null,
        'wisdom', '=', 'source<=12 ? null : source==13 ? 1 : source<=18 ? 2 : 3'
      );
      rules.defineRule('spellBonus.C2',
        'levels.Cleric', '?', null,
        'wisdom', '=', 'source <= 14 ? null : source == 15 ? 1 : 2'
      );
      rules.defineRule('spellBonus.C3',
        'levels.Cleric', '?', null,
        'wisdom', '=', 'source <= 16 ? null : 1'
      );
      rules.defineRule('spellBonus.C4',
        'levels.Cleric', '?', null,
        'wisdom', '=', 'source <= 17 ? null : 1'
      );
      rules.defineRule('spellsKnown.C1', 'spellBonus.C1', '+', null);
      rules.defineRule('spellsKnown.C2', 'spellBonus.C2', '+', null);
      rules.defineRule('spellsKnown.C3', 'spellBonus.C3', '+', null);
      rules.defineRule('spellsKnown.C4', 'spellBonus.C4', '+', null);

    } else if(klass == 'Druid') {

      baseAttack = 'Math.floor(source / 3) * 2';
      features = [
        'Bonus Druid Experience', 'Resist Fire', 'Resist Lightning',
        "3:Druid's Knowledge", '3:Wilderness Movement', '7:Fey Immunity',
        '7:Shapeshift'
      ];
      hitDie = 8;
      nonProfPenalty = -4;
      notes = [
        'featureNotes.bonusDruidExperienceFeature:' +
          '10% added to awarded experience',
        "featureNotes.druid'sKnowledgeFeature:" +
          'Identify plant/animal types/water purity',
        'featureNotes.wildernessMovementFeature:' +
          'Normal, untrackable move through undergrowth',
        'magicNotes.shapeshiftFeature:' +
          'Change into natural animal 3/day, curing d6x10 HP',
        'saveNotes.feyImmunityFeature:Immune to fey enchantment',
        'saveNotes.resistFireFeature:+2 vs. fire',
        'saveNotes.resistLightningFeature:+2 vs. lightning',
        'validationNotes.druidClassAlignment:Requires Alignment == "Neutral"'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        notes.push(
          'validationNotes.druidClassAbility:' +
            'Requires Constitution >= 6/Dexterity >= 6/Intelligence >= 6/' +
            'Strength >= 6/Wisdom >= 12'
        );
        profCount = '2 + Math.floor(source / 3)';
      } else {
        notes.push(
          'validationNotes.druidClassAbility:' +
            'Requires Charisma >= 15/Wisdom >= 12'
        );
        profCount = '2 + Math.floor(source / 5)';
      }
      saveBreath = '16 - Math.floor(source / 3) - Math.floor((source+5) / 12)';
      saveDeath = '10 - Math.floor(source / 3) - Math.floor((source+5) / 12)';
      savePetrification =
        '13 - Math.floor(source / 3) - Math.floor((source+5) / 12)';
      saveSpell = '15 - Math.floor(source / 3) - Math.floor((source+5) / 12)';
      saveWand = '14 - Math.floor(source / 3) - Math.floor((source+5) / 12)';
      spellsKnown = [
        'D1:1:2/3:3/4:4/9:5/13:6',
        'D2:2:1/3:2/5:3/7:4/11:5/14:6',
        'D3:3:1/4:2/7:3/12:4/13:5/14:6',
        'D4:6:1/8:2/10:3/12:4/13:5/14:6',
        'D5:9:1/10:2/12:3/13:4/14:5',
        'D6:11:1/12:2/13:3/14:4',
        'D7:12:1/13:2/14:3'
      ];
      rules.defineRule('casterLevelDivine', 'levels.Druid', '+=', null);
      rules.defineRule('druidFeatures.Bonus Druid Experience',
        'charisma', '?', 'source >= 16',
        'wisdom', '?', 'source >= 16'
      );
      rules.defineRule('languageCount', 'levels.Druid', '+=', '1');
      rules.defineRule("languages.Druids' Cant", 'levels.Druid', '=', '1');
      rules.defineRule('spellBonus.D1',
        'levels.Druid', '?', null,
        'wisdom', '=', 'source<=12 ? null : source==13 ? 1 : source<=18 ? 2 : 3'
      );
      rules.defineRule('spellBonus.D2',
        'levels.Druid', '?', null,
        'wisdom', '=', 'source <= 14 ? null : source == 15 ? 1 : 2'
      );
      rules.defineRule('spellBonus.D3',
        'levels.Druid', '?', null,
        'wisdom', '=', 'source <= 16 ? null : 1'
      );
      rules.defineRule('spellBonus.D4',
        'levels.Druid', '?', null,
        'wisdom', '=', 'source <= 17 ? null : 1'
      );
      rules.defineRule('spellsKnown.D1', 'spellBonus.D1', '+', null);
      rules.defineRule('spellsKnown.D2', 'spellBonus.D2', '+', null);
      rules.defineRule('spellsKnown.D3', 'spellBonus.D3', '+', null);
      rules.defineRule('spellsKnown.D4', 'spellBonus.D4', '+', null);

    } else if(klass == 'Fighter') {

      if(FirstEdition.USE_OSRIC_RULES) {
        baseAttack = 'source - 1';
      } else {
        baseAttack = 'Math.floor((source-1) / 2) * 2';
      }
      features = [
        'Bonus Fighter Experience', '2:Fighting The Unskilled',
        '9:Attract Followers'
      ];
      hitDie = 10;
      nonProfPenalty = -2;
      notes = [
        'combatNotes.fightingTheUnskilledFeature:' +
          '%V attacks/round vs. creatures with lt 1d8 hit die',
        'featureNotes.attractFollowersFeature:' +
          'May build stronghold and attract followers',
        'featureNotes.bonusFighterExperienceFeature:' +
          '10% added to awarded experience'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        notes.push(
        'validationNotes.fighterClassAbility:' +
          'Requires Charisma >= 6/Constitution >= 7/Dexterity >= 6/' +
          'Strength >= 9/Wisdom >= 6'
        );
        profCount = '4 + Math.floor(source / 2)';
      } else {
        notes.push(
        'validationNotes.fighterClassAbility:' +
          'Requires Constitution >= 7/Strength >= 9'
        );
        profCount = '4 + Math.floor(source / 3)';
      }
      saveBreath =
        'source<=16 ? 17-Math.floor((source-1)/2)-Math.floor((source-1)/4)*2:' +
        'Math.floor((source - 9) / 2)';
      saveDeath =
        'source<=16 ? 14-Math.floor((source-1)/2)-Math.floor((source-1)/4) : ' +
        'Math.floor((source - 11) / 2)';
      savePetrification =
        'source<=16 ? 15-Math.floor((source-1)/2)-Math.floor((source-1)/4) : ' +
        'Math.floor((source - 9) / 2)';
      saveSpell =
        'source<=16 ? 17-Math.floor((source-1)/2)-Math.floor((source-1)/4) : ' +
        'Math.floor((source - 5) / 2)';
      saveWand =
        'source<=16 ? 16-Math.floor((source-1)/2)-Math.floor((source-1)/4) : ' +
        'Math.floor((source - 7) / 2)';
      rules.defineRule('attacksPerRound',
        'levels.Fighter', '+', 'Math.floor(source / 6) * 0.5'
      );
      rules.defineRule('combatNotes.fightingTheUnskilledFeature',
        'levels.Fighter', '+=', null
      );
      rules.defineRule('fighterFeatures.Bonus Fighter Experience',
        'strength', '?', 'source >= 16'
      );
      rules.defineRule('warriorLevel', 'levels.Fighter', '+=', null);
      // TODO weapon specialization

    } else if(klass == 'Illusionist') {

      if(FirstEdition.USE_OSRIC_RULES) {
        baseAttack = '-1 + Math.floor((source - 1) / 5) * 2';
      } else {
        baseAttack = '(source<6 ? -1 : -2) + Math.floor((source - 1) / 5) * 3';
      }
      features = [
        '10:Eldritch Craft',
        (FirstEdition.USE_OSRIC_RULES ? '10' : '12') + ':Attract Followers'
      ];
      hitDie = 4;
      nonProfPenalty = -5;
      notes = [
        'featureNotes.attractFollowersFeature:' +
          'May build stronghold and attract followers',
        'magicNotes.eldritchCraftFeature:' +
          'May create magical potion/scroll and rechage rods/staves/wands'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        notes.push(
          'validationNotes.illusionistClassAbility:' +
            'Requires Charisma >= 6/Dexterity >= 16/Intelligence >= 15/' +
            'Strength >= 6/Wisdom >= 6'
        );
        profCount = '1 + Math.floor(source / 5)';
      } else {
        notes.push(
          'validationNotes.illusionistClassAbility:' +
            'Requires Dexterity >= 16/Intelligence >= 15'
        );
        profCount = '1 + Math.floor(source / 6)';
      }
      saveBreath = '15 - Math.floor((source-1) / 5) * 2';
      saveDeath = '14 - Math.floor((source-1)/5) - Math.floor((source-1)/10)';
      savePetrification = '13 - Math.floor((source-1) / 5) * 2';
      saveSpell = '12 - Math.floor((source-1) / 5) * 2';
      saveWand = '11 - Math.floor((source-1) / 5) * 2';
      if(FirstEdition.USE_OSRIC_RULES) {
        spellsKnown = [
          'I1:1:1/2:2/4:3/5:4/9:5/17:6',
          'I2:3:1/4:2/5:3/10:4/12:5/18:6',
          'I3:5:1/6:2/9:3/12:4/16:5/20:6',
          'I4:7:1/8:2/11:3/15:4/19:5/21:6',
          'I5:10:1/11:2/16:3/18:4/19:5/23:6',
          'I6:12:1/13:2/17:3/20:4/22:5/24:6',
          'I7:14:1/15:2/21:3/23:4/24:5'
        ];
      } else {
        spellsKnown = [
          'I1:1:1/2:2/4:3/5:4/9:5/24:6/26:7',
          'I2:3:1/4:2/6:3/10:4/12:5/24:6/26:7',
          'I3:5:1/7:2/9:3/12:4/16:5/24:6/26:7',
          'I4:8:1/9:2/11:3/15:4/17:5/24:6/26:7',
          'I5:10:1/11:2/16:3/19:4/21:5/25:6',
          'I6:12:1/13:2/18:3/21:4/22:5/25:6',
          'I7:14:1/15:2/20:3/22:4/23:5/25:6'
        ];
      }
      rules.defineRule('casterLevelArcane', 'levels.Illusionist', '+=', null);

    } else if(klass == 'Magic User') {

      if(FirstEdition.USE_OSRIC_RULES) {
        baseAttack = '-1 + Math.floor((source - 1) / 5) * 2';
      } else {
        baseAttack = '(source<6 ? -1 : -2) + Math.floor((source - 1) / 5) * 3';
      }
      features = [
        'Bonus Magic User Experience', '7:Eldritch Craft',
        '11:Attract Followers', '12:Eldritch Power'
      ];
      hitDie = 4;
      nonProfPenalty = -5;
      notes = [
        'featureNotes.attractFollowersFeature:' +
          'May build stronghold and attract followers',
        'featureNotes.bonusMagicUserExperienceFeature:' +
          '10% added to awarded experience',
        'magicNotes.eldritchCraftFeature:' +
          'May create magical potion/scroll and rechage rods/staves/wands',
        'magicNotes.eldritchPowerFeature:May use <i>Enchant An Item</i> spell'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        notes.push(
          'validationNotes.magicUserClassAbility:' +
            'Requires Charisma >= 6/Constitution >= 6/Dexterity >= 6/' +
            'Intelligence >= 9/Wisdom >= 6'
        );
        profCount = '1 + Math.floor(source / 5)';
      } else {
        notes.push(
          'validationNotes.magicUserClassAbility:' +
            'Requires Dexterity >= 6/Intelligence >= 9'
        )
        profCount = '1 + Math.floor(source / 6)';
      }
      saveBreath = '15 - Math.floor((source-1) / 5) * 2';
      saveDeath = '14 - Math.floor((source-1)/5) - Math.floor((source-1)/10)';
      savePetrification = '13 - Math.floor((source-1) / 5) * 2';
      saveSpell = '12 - Math.floor((source-1) / 5) * 2';
      saveWand = '11 - Math.floor((source-1) / 5) * 2';
      if(FirstEdition.USE_OSRIC_RULES) {
        spellsKnown = [
          'M1:1:1/2:2/4:3/5:4/12:5/21:6',
          'M2:3:1/4:2/6:3/9:4/13:5/21:6',
          'M3:5:1/6:2/8:3/11:4/14:5/22:6',
          'M4:7:1/8:2/11:3/14:4/17:5/22:6',
          'M5:9:1/10:2/11:3/14:4/17:5/23:6',
          'M6:12:1/13:2/15:3/17:4/19:5/23:6',
          'M7:14:1/15:2/17:3/19:4/22:5/24:6',
          'M8:16:1/17:2/19:3/21:4/24:5',
          'M9:18:1/20:2/23:3'
        ];
      } else {
        spellsKnown = [
          'M1:1:1/2:2/4:3/5:4/13:5/26:6/29:7',
          'M2:3:1/4:2/7:3/10:4/13:5/26:6/29:7',
          'M3:5:1/6:2/8:3/11:4/13:5/26:6/29:7',
          'M4:7:1/8:2/11:3/12:4/15:5/26:6/29:7',
          'M5:9:1/10:2/11:3/12:4/15:5/27:6',
          'M6:12:1/13:2/16:3/20:4/22:5/27:6',
          'M7:14:1/16:2/17:3/21:4/23:5/27:6',
          'M8:16:1/17:2/19:3/21:4/23:5/28:6',
          'M9:18:1/20:2/22:3/24:4/25:5/28:6'
        ];
      }
      rules.defineRule('casterLevelArcane', 'levels.Magic User', '+=', null);
      rules.defineRule('intelligenceRow',
        'intelligence', '=', 'source <= 9 ? 0 : source <= 12 ? 1 : source <= 14 ? 2 : source <= 14 ? 3 : source <= 16 ? 4 : (source - 13)',
        'levels.Magic User', '?', null
      );
      rules.defineRule('magicUserFeatures.Bonus Magic User Experience',
        'intelligence', '?', 'source >= 16'
      );
      rules.defineRule('understandSpell',
        'intelligenceRow', '=', 'Math.min(35 + source * 10, 90)'
      );
      rules.defineRule('maximumSpellsPerLevel',
        'intelligenceRow', '=', 'source * 2 + 5 + (source == 0 ? -1 : source <= 3 ? 0 : source == 4 ? 1 : source == 5 ? 3 : 5)'
      );
      rules.defineRule('minimumSpellsPerLevel',
        'intelligenceRow', '=', 'source + 4'
      );
      rules.defineSheetElement
        ('Understand Spell', 'Spells Known', '<b>%N</b>: %V%');
      rules.defineSheetElement('SpellsPerLevel', 'Spells Known', '%V', '/');
      rules.defineSheetElement
        ('Minimum Spells Per Level', 'SpellsPerLevel/',
         '<b>Min/Max Spells/Level</b>: %V');
      rules.defineSheetElement
        ('Maximum Spells Per Level', 'SpellsPerLevel/', '%V');

    } else if(klass == 'Paladin') {

      if(FirstEdition.USE_OSRIC_RULES) {
        baseAttack = 'source - 1';
      } else {
        baseAttack = 'Math.floor((source-1) / 2) * 2';
      }
      features = [
        'Bonus Paladin Experience', 'Cure Disease', 'Detect Evil',
        'Discriminating', 'Divine Health', 'Fighting The Unskilled',
        'Lay On Hands', 'Nonmaterialist', 'Philanthropist',
        'Protection From Evil', '3:Turn Undead', '4:Summon Warhorse'
      ];
      hitDie = 10;
      nonProfPenalty = -2;
      notes = [
        'combatNotes.fightingTheUnskilledFeature:' +
          '%V attacks/round vs. creatures with lt 1d8 hit die',
        'combatNotes.turnUndeadFeature:' +
          'Turn 2d6, destroy (good) or control (evil) d6+6 undead creatures',
        'featureNotes.bonusPaladinExperienceFeature:' +
          '10% added to awarded experience',
        'featureNotes.discriminatingFeature:' +
          'Must not associate w/non-good characters',
        'featureNotes.nonmaterialistFeature:' +
          'May not own gt 10 magic items, including 1 armor suit and 1 shield',
        'featureNotes.philanthropistFeature:' +
          'Must donate 10% of gross income/100% net to lawful good causes',
        'featureNotes.summonWarhorseFeature:Call warhorse w/enhanced features',
        'magicNotes.cureDiseaseFeature:<i>Cure Disease</i> %V/week',
        "magicNotes.detectEvilFeature:<i>Detect Evil</i> 60' at will",
        'magicNotes.layOnHandsFeature:Heal %V HP 1/day',
        'magicNotes.protectionFromEvilFeature:' +
          "Continuous <i>Protection From Evil</i> 10' radius",
        'saveNotes.divineHealthFeature:Immune to disease',
        'validationNotes.paladinClassAlignment:' +
          'Requires Alignment == "Lawful Good"'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        notes.push(
          'validationNotes.paladinClassAbility:' +
            'Requires Charisma >= 17/Constitution >= 9/Dexterity >= 6/' +
            'Intelligence >= 9/Strength >= 12/Wisdom >= 13'
        );
        profCount = '3 + Math.floor(source / 2)';
        saveBreath =
          'source<=16?15-Math.floor((source-1)/2)-Math.floor((source-1)/4)*2 :'+
          '2';
        saveDeath =
          'source<=16?12-Math.floor((source-1)/2)-Math.floor((source-1)/4) : 2';
        savePetrification =
          'source<=16?13-Math.floor((source-1)/2)-Math.floor((source-1)/4) : 2';
        saveSpell =
          'source<=16?15-Math.floor((source-1)/2)-Math.floor((source-1)/4) : ' +
          'source <= 18 ? 4 : 3';
        saveWand =
          'source<=16?14-Math.floor((source-1)/2)-Math.floor((source-1)/4) : ' +
          'source<=18 ? 3 : 2';
      } else {
        notes.push(
          'validationNotes.paladinClassAbility:' +
            'Requires Charisma >= 17/Constitution >= 9/Intelligence >= 9/' +
            'Strength >= 12/Wisdom >= 13'
        );
        profCount = '3 + Math.floor(source / 3)';
        saveBreath =
          'source<=16?17-Math.floor((source-1)/2)-Math.floor((source-1)/4)*2:' +
          'Math.floor((source - 9) / 2)';
        saveDeath =
          'source<=16?14-Math.floor((source-1)/2)-Math.floor((source-1)/4) : ' +
          'Math.floor((source - 11) / 2)';
        savePetrification =
          'source<=16?15-Math.floor((source-1)/2)-Math.floor((source-1)/4) : ' +
          'Math.floor((source - 9) / 2)';
        saveSpell =
          'source<=16?17-Math.floor((source-1)/2)-Math.floor((source-1)/4) : ' +
          'Math.floor((source - 5) / 2)';
        saveWand =
          'source<=16?16-Math.floor((source-1)/2)-Math.floor((source-1)/4) : ' +
          'Math.floor((source - 7) / 2)';
      }
      spellsKnown = [
        'C1:9:1/10:2/14:3/21:4',
        'C2:11:1/12:2/16:3/22:4',
        'C3:13:1/17:2/18:3/23:4',
        'C4:15:1/19:2/20:3/24:4'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        rules.defineRule('attacksPerRound',
          'levels.Paladin', '+', 'Math.floor(source / 7) * 0.5'
        );
      } else {
        rules.defineRule('attacksPerRound',
          'levels.Paladin', '+', 'Math.floor(source / 6) * 0.5'
        );
      }
      rules.defineRule('casterLevelDivine',
        'levels.Paladin', '+=', 'source<=8 ? null : Math.min(source - 8, 8)'
      );
      if(! FirstEdition.USE_OSRIC_RULES) {
        rules.defineRule('combatNotes.fightingTheUnskilledFeature',
          'levels.Paladin', '+=', null
        );
      }
      rules.defineRule('paladinFeatures.Bonus Paladin Experience',
        'strength', '?', 'source >= 16',
        'wisdom', '?', 'source >= 16'
      );
      rules.defineRule('magicNotes.cureDiseaseFeature',
        'levels.Paladin', '=', 'Math.floor(source / 5) + 1'
      );
      rules.defineRule
        ('magicNotes.layOnHandsFeature', 'levels.Paladin', '=', '2 * source');
      rules.defineRule('turningLevel',
        'levels.Paladin', '+=', 'source > 2 ? source - 2 : null'
      );
      rules.defineRule('warriorLevel', 'levels.Paladin', '+=', null);
      // TODO weapon specialization
      // TODO PHB only Holy Sword

    } else if(klass == 'Ranger') {

      if(FirstEdition.USE_OSRIC_RULES) {
        baseAttack = 'source - 1';
      } else {
        baseAttack = 'Math.floor((source-1) / 2) * 2';
      }
      features = [
        'Alert', 'Bonus Ranger Experience', 'Fighting The Unskilled', 'Loner',
        'Selective', 'Ranger Favored Enemy', 'Track', 'Travel Light',
        '10:Scrying', '10:Band of Followers'
      ];
      hitDie = 8;
      nonProfPenalty = -2;
      notes = [
        'combatNotes.fightingTheUnskilledFeature:' +
          '%V attacks/round vs. creatures with lt 1d8 hit die',
        'combatNotes.alertFeature:Surprised 1/6, surprise 1/2',
        'featureNotes.bandOfFollowersFeature:Will attract followers',
        'featureNotes.bonusRangerExperienceFeature:' +
          '10% added to awarded experience',
        'featureNotes.lonerFeature:Will not work with gt 2 other rangers',
        'featureNotes.selectiveFeature:Must employ only good henchmen',
        'featureNotes.trackFeature:' +
          '90% rural/65% urban/dungeon base chance creature tracking',
        'featureNotes.travelLightFeature:' +
          'Will not possess more than can be carried',
        'magicNotes.scryingFeature:May scrying magic items',
        'validationNotes.rangerClassAlignment:Requires Alignment =~ Good'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        notes.push(
          'combatNotes.rangerFavoredEnemyFeature:' +
            '+%V melee damage vs. evil humanoid/giantish foe',
          'validationNotes.rangerClassAbility:' +
            'Requires Charisma >= 6/Constitution >= 14/Dexterity >= 6/' +
            'Intelligence >= 13/Strength >= 13/Wisdom >= 14'
        );
        profCount = '3 + Math.floor(source / 2)';
      } else {
        notes.push(
          'combatNotes.rangerFavoredEnemyFeature:' +
            '+%V melee damage vs. giantish foe',
          'validationNotes.rangerClassAbility:' +
            'Requires Constitution >= 14/Dexterity >= 6/Intelligence >= 13/' +
            'Strength >= 13/Wisdom >= 14'
        );
        profCount = '3 + Math.floor(source / 3)';
      }
      saveBreath =
        'source<=16 ? 17-Math.floor((source-1)/2)-Math.floor((source-1)/4)*2:' +
        'Math.floor((source - 9) / 2)';
      saveDeath =
        'source<=16 ? 14-Math.floor((source-1)/2)-Math.floor((source-1)/4) : ' +
        'Math.floor((source - 11) / 2)';
      savePetrification =
        'source<=16 ? 15-Math.floor((source-1)/2)-Math.floor((source-1)/4) : ' +
        'Math.floor((source - 9) / 2)';
      saveSpell =
        'source<=16 ? 17-Math.floor((source-1)/2)-Math.floor((source-1)/4) : ' +
        'Math.floor((source - 5) / 2)';
      saveWand =
        'source<=16 ? 16-Math.floor((source-1)/2)-Math.floor((source-1)/4) : ' +
        'Math.floor((source - 7) / 2)';
      spellsKnown = [
        'D1:8:1/10:2/18:3/23:4',
        'D2:12:1/14:2/20:3',
        'D3:16:1/17:2/22:3',
        'M1:9:1/11:2/19:3/24:4',
        'M2:13:1/15:2/21:3'
      ];
      rules.defineRule('attacksPerRound',
        'levels.Ranger', '+', 'Math.floor(source / 7) * 0.5'
      );
      rules.defineRule('casterLevelArcane',
        'levels.Ranger', '+=',
        'source <= 7 ? null : Math.min(Math.floor((source-6)/2), 6)'
      );
      rules.defineRule('casterLevelDivine',
        'levels.Ranger', '+=',
        'source <= 7 ? null : Math.min(Math.floor((source-6)/2), 6)'
      );
      if(! FirstEdition.USE_OSRIC_RULES) {
        rules.defineRule('combatNotes.fightingTheUnskilledFeature',
          'levels.Ranger', '+=', null
        );
      }
      rules.defineRule
        ('combatNotes.rangerFavoredEnemyFeature', 'levels.Ranger', '=', null);
      rules.defineRule('rangerFeatures.Bonus Ranger Experience',
        'strength', '?', 'source >= 16',
        'intelligence', '?', 'source >= 16',
        'wisdom', '?', 'source >= 16'
      );
      rules.defineRule('warriorLevel', 'levels.Ranger', '+=', null);
      // TODO weapon specialization

    } else if(klass == 'Thief') {

      baseAttack = '(source <= 8 ? -1 : 0) + Math.floor((source - 1) / 4) * 2'
      features = ['Bonus Thief Experience', '10:Read Scrolls'];
      hitDie = 6;
      nonProfPenalty = -3;
      notes = [
        // TODO OSRIC "when unobserved"
        'combatNotes.backstabFeature:' +
          '+4 melee attack/x%V damage from behind',
        'featureNotes.bonusThiefExperienceFeature:' +
          '10% added to awarded experience',
        'magicNotes.readScrollsFeature:Cast arcane spells from scrolls',
        'validationNotes.thiefClassAlignment:Requires Alignment =~ Neutral|Evil'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        notes.push(
          'validationNotes.thiefClassAbility:' +
            'Requires Charisma >= 6/Constitution >= 6/Dexterity >= 9/' +
            'Intelligence >= 6/Strength >= 6',
        );
      } else {
        notes.push(
          'validationNotes.thiefClassAbility:Requires Dexterity >= 9',
        );
      }
      profCount = '2 + Math.floor(source / 4)';
      saveBreath = '16 - Math.floor((source - 1) / 4)';
      saveDeath = '13 - Math.floor((source - 1) / 4)';
      savePetrification = '12 - Math.floor((source - 1) / 4)';
      saveSpell = '15 - Math.floor((source - 1) / 4) * 2';
      saveWand = '14 - Math.floor((source - 1) / 4) * 2';
      thiefSkillLevel = 'source';
      rules.defineRule('combatNotes.backstabFeature',
        'levels.Thief', '+=', '2 + Math.floor((source - 1) / 4)'
      );
      rules.defineRule('languageCount', 'levels.Thief', '+=', '1');
      rules.defineRule("languages.Thieves' Cant", 'levels.Thief', '=', '1');
      rules.defineRule('thiefFeatures.Bonus Thief Experience',
        'dexterity', '?', 'source >= 16'
      );

    } else
      continue;

    SRD35.defineClass
      (rules, klass, hitDie, null, baseAttack, null, null,
       null, null, null, null, null, features,
       spellsKnown, null, null);

    rules.defineRule('save.Breath', 'levels.' + klass, '+=', saveBreath);
    rules.defineRule('save.Death', 'levels.' + klass, '+=', saveDeath);
    rules.defineRule
      ('save.Petrification', 'levels.' + klass, '+=', savePetrification);
    rules.defineRule('save.Spell', 'levels.' + klass, '+=', saveSpell);
    rules.defineRule('save.Wand', 'levels.' + klass, '+=', saveWand);
    rules.defineRule
      ('weaponProficiencyCount', 'levels.' + klass, '+=', profCount);
    rules.defineRule
      ('weaponNonProficiencyPenalty', 'levels.' + klass, '^=', nonProfPenalty);

    if(thiefSkillLevel != null) {
      if(FirstEdition.USE_OSRIC_RULES) {
        rules.defineRule('thiefSkills.Climb Walls',
          'thiefSkillLevel', '=',
          'source <= 6 ? source*2+78 : Math.min(source+84, 99)'
        );
        rules.defineRule('thiefSkills.Find Traps',
          'thiefSkillLevel', '=',
          'source <= 17 ? source*4+21 : Math.min(source*2+55, 99)',
          'dexterity', '+',
          'source <= 11 ? (source-12)*5 : source >= 17 ? (source-16)*5 : null'
        );
        rules.defineRule
          ('thiefSkills.Hear Noise', 'thiefSkillLevel', '=', 'source*3+7');
        rules.defineRule('thiefSkills.Hide In Shadows',
          'thiefSkillLevel', '=',
          'source <= 15 ? source*5+15 : (source+75)',
          'dexterity', '+',
          'source <= 10 ? (source-11)*5 : source >= 17 ? (source-16)*5 : null'
        );
        rules.defineRule('thiefSkills.Move Quietly',
          'thiefSkillLevel', '=',
          'source <= 15 ? source * 5 + 15 : (source + 75)',
          'dexterity', '+',
          'source <= 12 ? (source-13)*5 : source >= 17 ? (source-16)*5 : null'
        );
        rules.defineRule('thiefSkills.Open Locks',
          'thiefSkillLevel', '=',
          'source <= 16 ? source * 4 + 26 : (source + 75)',
          'dexterity', '+',
          'source <= 10 ? (source-11)*5 : source >= 16 ? (source-15)*5 : null'
        );
        rules.defineRule('thiefSkills.Pick Pockets',
          'thiefSkillLevel', '=',
          'source <= 14 ? source * 4 + 31 : (source + 75)',
          'dexterity', '+',
          'source<=11 ? (source-12)*5 : source>=18 ? (source-17)*10-5 : null'
        );
        rules.defineRule('thiefSkills.Read Languages',
          'thiefSkillLevel', '=',
          'source <= 19 ? Math.max(source*5-5, 1) : Math.min(source*2+52, 99)'
        );
      } else {
        rules.defineRule('thiefSkills.Climb Walls',
          'thiefSkillLevel', '=',
          'source <= 4 ? 84 + source : Math.min(80 + source * 2, 99)'
        );
        rules.defineRule('thiefSkills.Find Traps',
          'thiefSkillLevel', '=', 'Math.min(source * 5 + 15, 99)',
          'dexterity', '+',
          'source <= 11 ? (source-12)*5 : source >= 18 ? (source-17)*5 : null'
        );
        rules.defineRule('thiefSkills.Hear Noise',
          'thiefSkillLevel', '=', 'Math.floor((source-1)/2) * 5 + 10'
        );
        rules.defineRule('thiefSkills.Hide In Shadows',
          'thiefSkillLevel', '=',
          'source <= 4 ? (source+1) * 5 : source <= 8 ? source * 6 + 1 : ' +
          'source <= 12 ? (source-1) * 7 : Math.min(source * 8 - 19, 99)',
          'dexterity', '+',
          'source <= 10 ? (source-11)*5 : source >= 17 ? (source-16)*5 : null'
        );
        rules.defineRule('thiefSkills.Move Quietly',
          'thiefSkillLevel', '=',
          'source <= 4 ? source*6+9 : source <= 7 ? source*7+5 : ' +
          'Math.min(source*8-2, 99)',
          'dexterity', '+',
          'source <= 12 ? (source-13)*5 : source >= 17 ? (source-16)*5 : null'
        );
        rules.defineRule('thiefSkills.Open Locks',
          'thiefSkillLevel', '=',
          'source <= 4 ? source*4+21 : Math.min(source*5+17, 99)',
          'dexterity', '+',
          'source <= 10 ? (source-11)*5 : source >= 16 ? (source-15)*5 : null'
        );
        rules.defineRule('thiefSkills.Pick Pockets',
          'thiefSkillLevel', '=',
          'source <= 9 ? source*5+25 : source <= 12 ? source*10-20 : ' +
          'Math.min(source*5+40, 125)',
          'dexterity', '+',
          'source <= 11 ? (source-12)*5 : source >= 17 ? (source-17)*5 : null'
        );
        rules.defineRule('thiefSkills.Read Languages',
          'thiefSkillLevel', '=',
          'source >= 4 ? Math.min(source*5, 80) : null'
        );
      }
      rules.defineRule
        ('thiefSkillLevel', 'levels.' + klass, '+=', thiefSkillLevel);
      rules.defineSheetElement('Thief Skills', 'Skills', null, ' * ');
      for(var skill in {'Climb Walls':'', 'Find Traps':'', 'Hear Noise':'',
                        'Hide In Shadows':'', 'Move Quietly':'',
                        'Open Locks':'', 'Pick Pockets':'',
                        'Read Languages':''}) {
        rules.defineRule('thiefSkills.' + skill,
          'race', '+',
          'FirstEdition.thiefSkillsRacialAdjustments[source + " ' + skill + '"]'
        );
      }
    }

    if(notes != null)
      rules.defineNote(notes);

  }

  rules.defineNote
    ('validationNotes.weaponProficiencyAllocation:%1 available vs. %2 allocated');
  rules.defineRule('validationNotes.weaponProficiencyAllocation.1',
    '', '=', '0',
    'weaponProficiencyCount', '=', null
  );
  rules.defineRule('validationNotes.weaponProficiencyAllocation.2',
    '', '=', '0',
    /^weaponProficiency\./, '+=', null
  );
  rules.defineRule('validationNotes.weaponProficiencyAllocation',
    'validationNotes.weaponProficiencyAllocation.1', '=', '-source',
    'validationNotes.weaponProficiencyAllocation.2', '+=', null
  );

};

/* Defines the rules related to combat. */
FirstEdition.combatRules = function(rules) {
  
  rules.defineRule('armorClass',
    '', '=', '10',
    'armor', '+', 'FirstEdition.armorsArmorClassBonuses[source]',
    'shield', '+', 'source=="None" ? null : -1'
  );
  rules.defineRule('attacksPerRound', '', '=', '1');
  rules.defineRule('baseAttack', '', '=', '0');
  rules.defineRule('meleeAttack', 'baseAttack', '=', null);
  rules.defineRule('rangedAttack', 'baseAttack', '=', null);
  rules.defineRule('turnUndeadColumn',
    'turningLevel', '=',
    'source <= 8 ? source : source <= 13 ? 9 : source <= 18 ? 10 : 11'
  );
  var turningTable = null;
  if(FirstEdition.USE_OSRIC_RULES) {
    turningTable = [
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
    ];
  } else {
    turningTable = [
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
  }
  for(var i = 0; i < turningTable.length; i++) {
    rules.defineRule('turnUndead.' + turningTable[i].split(':')[0].trim(),
      'turnUndeadColumn', '=', '"' + turningTable[i] +'".split(":")[source].trim()'
    );
  }

};

/* Defines the rules related to character description. */
FirstEdition.descriptionRules = function(rules, alignments, genders) {
  rules.defineChoice('alignments', alignments);
  rules.defineChoice('genders', genders);
};

/* Defines the rules related to equipment. */
FirstEdition.equipmentRules = function(rules, armors, shields, weapons) {

  rules.defineChoice('armors', armors);
  rules.defineChoice('shields', shields);
  rules.defineChoice('weapons', weapons);

  for(var i = 0; i < weapons.length; i++) {

    var pieces = weapons[i].split(':');
    var matchInfo = pieces[1].match(/(\d?d\d+(\+(\d+))?)(r(\d+))?/);
    if(! matchInfo)
      continue;

    var damage = matchInfo[1];
    var damagePlus = matchInfo[3];
    var name = pieces[0];
    var range = matchInfo[5];
    var sanityNote = 'sanityNotes.weaponNonProficiency.' + name;
    var weaponName = 'weapons.' + name;
    var attackBase = !range ? 'meleeAttack' : 'rangedAttack';

    var format = '%V (%1 %2%3';
    if(range)
      format += " R%4'";
    format += ')';

    rules.defineNote(weaponName + ':' + format);

    rules.defineRule('attackBonus.' + name,
      attackBase, '=', null,
      'combatNotes.strengthAttackAdjustment', '=', null,
      'weaponAttackAdjustment.' + name, '+', null,
      sanityNote, '+', null
    );
    rules.defineRule('damageBonus.' + name,
      '', '=', damagePlus || '0',
      'combatNotes.strengthDamageAdjustment', '=', null,
      'weaponDamageAdjustment.' + name, '+', null
    );

    rules.defineRule(weaponName + '.1',
      'attackBonus.' + name, '=', 'source < 0 ? source : ("+" + source)'
    );
    rules.defineRule(weaponName + '.2', '', '=', '"' + damage + '"');
    rules.defineRule(weaponName + '.3',
      'damageBonus.' + name, '=', 'source < 0 ? source : source == 0 ? "" : ("+" + source)'
    );

    if(range) {
      rules.defineRule('range.' + name,
        '', '=', range,
        'weaponRangeAdjustment.' + name, '+', null
      );
      rules.defineRule(weaponName + '.4', 'range.' + name, '=', null);
    }

    rules.defineNote(sanityNote + ':%V attack bonus');
    rules.defineRule(sanityNote,
      'weapons.' + name, '?', null,
      'weaponNonProficiencyPenalty', '=', null,
      'weaponProficiency.' + name, '^', '0'
    );

  }

};

/*
 * Defines rules for a specified set of goodies (generally magic items). The
 * method knows how to define rules for "* Of <skill> [+-]<amount>", "* Of
 * <ability> [+-]<amount>", "* Of Protection [+-]]<amount>" (improves * AC),
 * "<weapon> [+-]<amount>", "Masterwork <weapon>", "<armor> [+-]<amount>",
 * "Masterwork <armor>", and "Healer's Kit".
 */
FirstEdition.goodiesRules = function(rules, goodies) {
  rules.choices['skills'] = {};
  SRD35.goodiesRules(rules, goodies);
  delete rules.choices['skills'];
  rules.defineRule('combatNotes.goodiesArmorClassAdjustment', '', '*', '-1');
  rules.defineRule('skillNotes.goodiesSkillCheckAdjustment', '', 'v', '0');
};

/* Defines the rules related to spells. */
FirstEdition.magicRules = function(rules, classes, schools) {

  rules.defineChoice('schools', schools);
  schools = rules.getChoices('schools');

  var spellsDefined = {};

  for(var i = 0; i < classes.length; i++) {
    var klass = classes[i];
    var spells;
    if(klass == 'Cleric') {
      spells = [
        'C1:Bless:Command:Create Water:Cure Light Wounds:Detect Evil:' +
        'Detect Magic:Light:Protection From Evil:Purify Food And Drink:' +
        'Remove Fear:Resist Cold:Sanctuary',
        'C2:Augury:Chant:Detect Charm:Find Traps:Hold Person:Know Alignment:' +
        "Resist Fire:Silence 15' Radius:Slow Poison:Snake Charm:" +
        'Speak With Animals:Spiritual Weapon',
        'C3:Animate Dead:Continual Light:Create Food And Water:' +
        'Cure Blindness:Cure Disease:Dispel Magic:Feign Death:' +
        'Glyph Of Warding:Locate Object:Prayer:Remove Curse:Speak With Dead',
        'C4:Cure Serious Wounds:Detect Lie:Divination:Exorcise:Lower Water:' +
        "Neutralize Poison:Protection From Evil 10' Radius:" +
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
        "Control Temperature 10' Radius:Cure Serious Wounds:Dispel Magic:" +
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
        'Reincarnation:Transmute Metal To Wood'
      ];
    } else if(klass == 'Illusionist') {
      spells = [
        'I1:Audible Glamer:Change Self:Color Spray:Dancing Lights:Darkness:' +
        'Detect Illusion:Detect Invisibility:Gaze Reflection:Hypnotism:Light:' +
        'Phantasmal Force:Wall Of Fog',
        'I2:Blindness:Blur:Deafness:Detect Magic:Fog Cloud:Hypnotic Pattern:' +
        'Improved Phantasmal Force:Invisibility:Magic Mouth:Mirror Image:' +
        'Misdirection:Ventriloquism',
        'I3:Continual Darkness:Continual Light:Dispel Illusion:Fear:' +
        "Hallucinatory Terrain:Illusory Script:Invisibility 10' Radius:" +
        'Non-Detection:Paralyzation:Rope Trick:Spectral Force:Suggestion',
        'I4:Confusion:Dispel Exhaustion:Emotion:Improved Invisibility:' +
        'Massmorph:Minor Creation:Phantasmal Killer:Shadow Monsters',
        'I5:Chaos:Demi-Shadow Monsters:Major Creation:Maze:Project Image:' +
        'Shadow Door:Shadow Magic:Summon Shadow',
        'I6:Conjure Animals:Demi-Shadow Magic:Mass Suggestion:' +
        'Permanent Illusion:Programmed Illusion:Shades:True Sight:Veil',
        'I7:Alter Reality:Astral Spell:Prismatic Spray:Prismatic Wall:' +
        'Vision:Arcane Spells Level 1'
      ];
    } else if(klass == 'Magic User') {
      spells = [
        'M1:Affect Normal Fires:Burning Hands:Charm Person:' +
        'Comprehend Languages:Dancing Lights:Detect Magic:Enlarge:Erase:' +
        'Feather Fall:Find Familiar:Floating Disk:Friends:Hold Portal:' +
        'Identify:Jump:Light:Magic Aura:Magic Missle:Mending:Message:' +
        'Protection From Evil:Push:Read Magic:Shield:Shocking Grasp:Sleep:' +
        'Spider Climb:Unseen Servant:Ventriloquism:Write',
        "M2:Audible Glamer:Continual Light:Darkness:Detect Evil:" +
        "Detect Invisibility:ESP:False Trap:Fool's Gold:Forget:Invisibility:" +
        'Levitate:Locate Object:Magic Mouth:Mirror Image:' +
        'Pyrotechnics:Ray Of Enfeeblement:Rope Trick:Scare:Shatter:' +
        'Stinking Cloud:Strength:Web:Wizard Lock',
        'M3:Blink:Clairaudience:Clairvoyance:Dispel Magic:Explosive Runes:' +
        'Feign Death:Fireball:Flame Arrow:Fly:Gust Of Wind:Haste:Hold Person:' +
        "Infravision:Invisibility 10' Radius:Lightning Bolt:" +
        'Monster Summoning I:Phantasmal Force:' +
        "Protection From Evil 10' Radius:Protection From Normal Missles:" +
        'Slow:Suggestion:Tiny Hut:Tongues:Water Breathing',
        'W4:Charm Monster:Confusion:Dig:Dimension Door:Enchanted Weapon:' +
        'Extension I:Fear:Fire Charm:Fire Shield:Fire Trap:Fumble:' +
        'Hallucinatory Terrain:Ice Storm:Massmorph:' +
        'Minor Globe Of Invulnerability:Mnemonic Enhancement:' +
        'Monster Summoning II:Plant Growth:Polymorph Other:Polymorph Self:' +
        'Remove Curse:Wall Of Fire:Wall Of Ice:Wizard Eye',
        'W5:Airy Water:Animal Growth:Animate Dead:Cloudkill:Cone Of Cold:' +
        'Conjure Elemental:Contact Other Plane:Distance Distortion:' +
        'Extension II:Feeblemind:Hold Monster:Interposing Hand:' +
        "Mage's Faithful Hound:Magic Jar:Monster Summoning III:Passwall:" +
        'Secret Chest:Stone Shape:Telekinesis:Teleport:' +
        'Transmute Rock To Mud:Wall Of Force:Wall Of Iron:Wall Of Stone',
        'W6:Anti-Magic Shell:Control Weather:Death Spell:Disintegrate:' +
        'Enchant An Item:Extension III:Forceful Hand:Freezing Sphere:Geas:' +
        'Glasseye:Globe Of Invulnerability:Guards And Wards:' +
        'Invisible Stalker:Legend Lore:Lower Water:Monster Summoning IV:' +
        'Move Earth:Part Water:Project Image:Reincarnation:Repulsion:' +
        'Spirit-Wrack:Stone To Flesh:Transformation',
        'W7:Cacodemon:Charm Plants:Delayed Blast Fireball:Duo-Dimension:' +
        "Grasping Hand:Instant Summons:Limited Wish:Mage's Sword:" +
        'Mass Invisibility:Monster Summoning V:Phase Door:Power Word Stun:' +
        'Reverse Gravity:Simulacrum:Statue:Vanish',
        'W8:Antipathy/Sympathy:Clenched Fist:Clone:Glass-Steel:' +
        'Incendiary Cloud:Irresistible Dance:Mass Charm:Maze:Mind Blank:' +
        'Monster Summoning VI:Permanency:Polymorph Object:Power Word Blind:' +
        'Spell Immunity:Symbol:Trap The Soul',
        'W9:Astral Spell:Crushing Hand:Gate:Imprisonment:Meteor Swarm:' +
        'Monster Summoning VII:Power Word Kill:Prismatic Sphere:Shape Change:' +
        'Temporal Statis:Time Stop:Wish'
      ];
    } else if(klass == 'Paladin') {
      spells = [
        'C1:Bless:Command:Create Water:Cure Light Wounds:Detect Evil:' +
        'Detect Magic:Light:Protection From Evil:Purify Food And Drink:' +
        'Remove Fear:Resist Cold:Sanctuary',
        'C2:Augury:Chant:Detect Charm:Find Traps:Hold Person:Know Alignment:' +
        "Resist Fire:Silence 15' Radius:Slow Poison:Snake Charm:" +
        'Speak With Animals:Spiritual Weapon',
        'C3:Animate Dead:Continual Light:Create Food And Water:' +
        'Cure Blindness:Cure Disease:Dispel Magic:Feign Death:' +
        'Glyph Of Warding:Locate Object:Prayer:Remove Curse:Speak With Dead',
        'C4:Cure Serious Wounds:Detect Lie:Divination:Exorcise:Lower Water:' +
        "Neutralize Poison:Protection From Evil 10' Radius:" +
        'Speak With Plants:Sticks To Snakes:Tongues'
      ];
    } else if(klass == 'Ranger') {
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
        'M1:Affect Normal Fires:Burning Hands:Charm Person:' +
        'Comprehend Languages:Dancing Lights:Enlarge:Erase:Feather Fall:' +
        'Find Familiar:Floating Disk:Friends:Hold Portal:Identify:Jump:Light:' +
        'Magic Aura:Magic Missle:Mending:Message:Protection From Evil:Push:' +
        'Read Magic:Shield:Shocking Grasp:Sleep:Spider Climb:Unseen Servant:' +
        'Ventriloquism:Write',
        'M2:Audible Glamer:Continual Light:Darkness:Detect Evil:' +
        "Detect Invisibility:ESP:Fool's Gold:Forget:Invisibility:Knock:" +
        'False Trap:Levitate:Locate Object:Magic Mouth:Mirror Image:' +
        'Pyrotechnics:Ray Of Enfeeblement:Rope Trick:Scare:Shatter:' +
        'Stinking Cloud:Strength:Web:Wizard Lock'
      ];
    } else
      continue;
    if(spells != null) {
      for(var j = 0; j < spells.length; j++) {
        var pieces = spells[j].split(':');
        for(var k = 1; k < pieces.length; k++) {
          var spell = pieces[k];
          var school = FirstEdition.spellsSchools[spell];
          spellsDefined[spell] = '';
          spell += '(' + pieces[0] + ' ' +
                    (school == 'Universal' ? 'Univ' : schools[school]) + ')';
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
  rules.defineRule('loadMax',
    '', '=', '105',
    'abilityNotes.strengthEncumbranceAdjustment', '+', null
  );
  rules.defineRule('speed', '', '=', '120');
};

/* Defines the rules related to character races. */
FirstEdition.raceRules = function(rules, languages, races) {

  rules.defineChoice('languages', languages);
  rules.defineRule('featureNotes.intelligenceLanguageBonus',
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

    // TODO: level limits
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
        'Common', 'Elven', 'Gnoll', 'Gnome', 'Goblin', 'Halfling', 'Hobgoblin',
        'Orcish'
      ];
      notes = [
        'featureNotes.detectSecretDoorsFeature:' +
          '1in6 passing, 2in6 searching, 3in6 concealed',
        "featureNotes.infravisionFeature:%V' vision in darkness",
        'saveNotes.resistCharmFeature:%V% vs. charm',
        'saveNotes.resistSleepFeature:%V% vs. sleep',
        'validationNotes.halfElfRaceAbility:' +
          'Requires Constitution >= 6/Dexterity >= 6/Intelligence >= 4'
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
        "featureNotes.infravisionFeature:%V' vision in darkness",
        'validationNotes.halfOrcRaceAbility:' +
          'Requires Charisma <= 12/Constitution >= 13/Dexterity <= 17/' +
          'Intelligence <= 17/Strength >= 6/Wisdom <= 14'
      ];
      rules.defineRule('featureNotes.infravisionFeature',
        'halfOrcFeatures.Infravision', '+=', '60'
      );

    } else if(race.match(/Dwarf/)) {

      adjustment = '+1 constitution/-1 charisma';
      features = [
        'Dwarf Dodge', 'Dwarf Favored Enemy', 'Infravision', 'Know Depth',
        'Resist Magic', 'Resist Poison', 'Sense Construction', 'Sense Slope',
        'Trap Sense'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        features.push('Slow');
      }
      languages = [
        'Common', 'Dwarfish', 'Gnomish', 'Goblin', 'Kobold', 'Orcish'
      ];
      notes = [
        'abilityNotes.slowFeature:-30 speed',
        'combatNotes.dwarfDodgeFeature:-4 AC vs. giant/ogre/titan/troll',
        'combatNotes.dwarfFavoredEnemyFeature:+1 attack vs. goblinoid/orc',
        "featureNotes.infravisionFeature:%V' vision in darkness",
        'featureNotes.knowDepthFeature:' +
          'Determine approximate depth underground %V%',
        'featureNotes.senseConstructionFeature:' +
          "Detect new construction 75%/sliding walls 66% w/in 10'",
        "featureNotes.senseSlopeFeature:Detect slope/grade %V% w/in 10'",
        "featureNotes.trapSenseFeature:Detect stonework traps 50% w/in 10'",
        'saveNotes.resistMagicFeature:+%V vs. spell/wand',
        'saveNotes.resistPoisonFeature:+%V vs. poison',
        'validationNotes.'+raceNoSpace+'RaceAbility:' +
          'Requires Charisma <= 16/Constitution >= 12/Dexterity <= 17/' +
          'Strength >= 8'
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
      rules.defineRule('save.Spell', 'saveNotes.resistMagicFeature', '+', null);
      rules.defineRule('save.Wand', 'saveNotes.resistMagicFeature', '+', null);
      rules.defineRule('saveNotes.resistMagicFeature',
        'constitution', '=', 'Math.floor(source / 3.5)'
      );
      rules.defineRule('saveNotes.resistPoisonFeature',
        'constitution', '=', 'Math.floor(source / 3.5)'
      );
      rules.defineRule('speed', 'abilityNotes.slowFeature', '+', '-30');

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
        'combatNotes.stealthyFeature:4in6 surprise when traveling quietly',
        'combatNotes.swordPrecisionFeature:+1 attack w/longsword/short sword',
        'featureNotes.detectSecretDoorsFeature:' +
          '1in6 passing, 2in6 searching, 3in6 concealed',
        "featureNotes.infravisionFeature:%V' vision in darkness",
        'saveNotes.resistCharmFeature:%V% vs. charm',
        'saveNotes.resistSleepFeature:%V% vs. sleep',
        'validationNotes.'+raceNoSpace+'RaceAbility:' +
          'Requires Charisma >= 8/Constitution >= 8/Dexterity >= 7/' +
          'Intelligence >= 8'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        // TODO This doesn't work because of how rules are generated.
        // notes[notes.length - 1] += '/Constitution <= 17';
      }
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
        'Burrow Tongue', 'Direction Sense', 'Gnome Dodge',
        'Gnome Favored Enemy', 'Infravision', 'Know Depth', 'Resist Magic',
        'Resist Poison', 'Sense Hazard', 'Sense Slope'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        features.push('Slow');
      }
      languages = [
        'Common', 'Dwarfish', 'Gnomish', 'Goblin', 'Halfling', 'Kobold'
      ];
      notes = [
        'abilityNotes.slowFeature:-30 speed',
        'combatNotes.gnomeDodgeFeature:-4 AC vs. bugbear/giant/gnoll/ogre/titan/troll',
        'combatNotes.gnomeFavoredEnemyFeature:+1 attack vs. goblins/kobolds',
        'featureNotes.burrowTongueFeature:Speak w/burrowing animals',
        'featureNotes.directionSenseFeature:Determine N underground 50%',
        'featureNotes.knowDepthFeature:' +
          'Determine approximate depth underground %V%',
        'featureNotes.senseHazardFeature:' +
          "Detect unsafe wall/ceiling/floor 70% w/in 10'",
        "featureNotes.senseSlopeFeature:Detect slope/grade %V% w/in 10'",
        "featureNotes.infravisionFeature:%V' vision in darkness",
        'saveNotes.resistMagicFeature:+%V vs. spell/wand',
        'saveNotes.resistPoisonFeature:+%V vs. poison',
        'validationNotes.'+raceNoSpace+'RaceAbility:' +
          'Requires Constitution >= 8/Intelligence >= 7/Strength >= 6'
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
      rules.defineRule('save.Spell', 'saveNotes.resistMagicFeature', '+', null);
      rules.defineRule('save.Wand', 'saveNotes.resistMagicFeature', '+', null);
      rules.defineRule('saveNotes.resistMagicFeature',
        'constitution', '=', 'Math.floor(source / 3.5)'
      );
      rules.defineRule('saveNotes.resistPoisonFeature',
        'constitution', '=', 'Math.floor(source / 3.5)'
      );
      rules.defineRule('speed', 'abilityNotes.slowFeature', '+', '-30');

    } else if(race.match(/Halfling/)) {

      adjustment = '+1 dexterity/-1 strength';
      features = [
        'Accurate', 'Resist Magic', 'Infravision', 'Resist Poison', 'Stealthy'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        features.push('Slow');
      }
      languages = [
        'Common', 'Dwarfish', 'Gnome', 'Goblin', 'Halfling', 'Orcish'
      ];
      notes = [
        'abilityNotes.slowFeature:-30 speed',
        'combatNotes.accurateFeature:+3 attack with sling/bow',
        'combatNotes.stealthyFeature:4in6 surprise when traveling quietly',
        "featureNotes.infravisionFeature:%V' vision in darkness",
        'saveNotes.resistMagicFeature:+%V vs. spell/wand',
        'saveNotes.resistPoisonFeature:+%V vs. poison',
        // TODO also, Strength <= 17. Can't use Strength twice in this note
        // because of how rules are generated from it.
        'validationNotes.'+raceNoSpace+'RaceAbility:' +
          'Requires Constitution >= 10/Dexterity >= 8/Intelligence >= 6/' +
          'Strength >= 6/Wisdom <= 17'
      ];
      rules.defineRule('featureNotes.infravisionFeature',
        raceNoSpace + 'Features.Infravision', '+=', '60'
      );
      rules.defineRule('save.Spell', 'saveNotes.resistMagicFeature', '+', null);
      rules.defineRule('save.Wand', 'saveNotes.resistMagicFeature', '+', null);
      rules.defineRule('saveNotes.resistMagicFeature',
        'constitution', '=', 'Math.floor(source / 3.5)'
      );
      rules.defineRule('saveNotes.resistPoisonFeature',
        'constitution', '=', 'Math.floor(source / 3.5)'
      );
      rules.defineRule('speed', 'abilityNotes.slowFeature', '+', '-30');

    } else if(race.match(/Human/)) {

      adjustment = null;
      features = null;
      notes = null;
      languages = ['Common'];

    } else
      continue;

    SRD35.defineRace(rules, race, adjustment, features);

    rules.defineRule
      ('isRace.' + race, 'race', '=', 'source == "' + race + '" ? 1 : null');
    rules.defineRule('languageCount', 'isRace.' + race, '=', languages.length);
    for(var j = 0; j < languages.length; j++) {
      rules.defineRule('languages.' + languages[j], 'isRace.' + race, '=', '1');
    }

    if(notes != null)
      rules.defineNote(notes);

  }

};


/* Sets #attributes#'s #attribute# attribute to a random value. */
FirstEdition.randomizeOneAttribute = function(attributes, attribute) {
  var attr;
  var choices;
  if(attribute == 'armor') {
    choices = ScribeUtils.getKeys(this.getChoices('armors'));
    attributes['armor'] = choices[ScribeUtils.random(0, choices.length - 1)];
  } else if(attribute == 'proficiencies') {
    var attrs = this.applyRules(attributes);
    choices = [];
    var howMany = attrs.weaponProficiencyCount;
    for(attr in this.getChoices('weapons')) {
      if(attrs['weaponProficiency.' + attr] == null) {
        choices[choices.length] = attr;
      } else {
        howMany--;
      }
    }
    for( ; howMany > 0; howMany--) {
      var which = ScribeUtils.random(0, choices.length - 1);
      attributes['weaponProficiency.' + choices[which]] = 1;
      choices = choices.slice(0, which).concat(choices.slice(which + 1));
    }
  } else if(attribute == 'shield') {
    choices = ScribeUtils.getKeys(this.getChoices('shields'));
    attributes['shield'] = choices[ScribeUtils.random(0, choices.length - 1)];
  } else {
    SRD35.randomizeOneAttribute.apply(this, [attributes, attribute]);
  }
}

/* Returns HTML body content for user notes associated with this rule set. */
FirstEdition.ruleNotes = function() {
  return '' +
    '<h2>FirstEdition Scribe Module Notes</h2>\n' +
    'FirstEdition Scribe Module Version ' + FirstEdition_VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Although the 1E PHB doesn\'t discuss strongholds for illusionists,\n' +
    '    the description notes that the class mostly conforms to the\n' +
    '    characteristics of magic-users. The latter may build strongholds\n' +
    '    at level 12, and Scribe treats illusionists similarly.\n' +
    '  </li>\n' +
    '  <li>\n' +
    '    The OSRIC rules discuss illusionist scrolls, but does not give\n' +
    '    the minimum level required to create them. Scribe uses the 1E PHB\n' +
    '    limit of level 10.' +
    '  </li>\n' +
    '  <li>\n' +
    '    In general, Scribe uses the OSRIC names for spells, rather than\n' +
    '    those found in the 1E PHB. "Darkness" is used instead of "Darkness\n' +
    '    15\' Radius" and "Spirit-Wrack" instead of "Spirit-Rack".\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    The bard and monk classes from the 1E PHB are not included.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<ul>\n' +
    '</ul>\n' +
    '</p>\n';
};

/* Replaces spell names with longer descriptions on the character sheet. */
FirstEdition.spellDescriptionRules = function(rules, spells, descriptions) {

  if(spells == null) {
    spells = ScribeUtils.getKeys(rules.choices.spells);
  }
  if(descriptions == null) {
    descriptions = FiveE.spellsDescriptions;
  }

  rules.defineRule('casterLevels.B', 'levels.Bard', '=', null);
  rules.defineRule('casterLevels.C', 'levels.Cleric', '=', null);
  rules.defineRule('casterLevels.D', 'levels.Druid', '=', null);
  rules.defineRule('casterLevels.P', 'levels.Paladin', '=', null);
  rules.defineRule('casterLevels.R', 'levels.Ranger', '=', null);
  rules.defineRule('casterLevels.W', 'levels.Sorcerer', '=', null);
  rules.defineRule('casterLevels.W', 'levels.Wizard', '=', null);

  for(var i = 0; i < spells.length; i++) {

    var spell = spells[i];
    var matchInfo = spell.match(/^([^\(]+)\(([A-Za-z]+)(\d+)\s*\w*\)$/);
    if(matchInfo == null) {
      console.log("Bad format for spell " + spell);
      continue;
    }

    var abbr = matchInfo[2];
    var level = matchInfo[3];
    var name = matchInfo[1];
    var description = descriptions[name];

    if(description == null) {
      console.log("No description for spell " + name);
      continue;
    }

    var inserts = description.match(/\$(\w+|{[^}]+})/g);

    if(inserts != null) {
      for(var index = 1; index <= inserts.length; index++) {
        var insert = inserts[index - 1];
        var expr = insert[1] == "{" ?
            insert.substring(2, insert.length - 1) : insert.substring(1);
        if(FiveE.spellsAbbreviations[expr] != null) {
          expr = FiveE.spellsAbbreviations[expr];
        }
        expr = expr.replace(/lvl/g, "source");
        rules.defineRule
          ("spells." + spell + "." + index, "casterLevels." + abbr, "=", expr);
        description = description.replace(insert, "%" + index);
      }
    }

    rules.defineChoice("notes", "spells." + spell + ":" + description);

  }

};
