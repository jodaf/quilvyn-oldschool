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

var FirstEdition_VERSION = '1.5.1.0';

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
  rules.defineSheetElement('ExperienceInfo', 'Level', null, '');
  rules.defineSheetElement('Experience', 'ExperienceInfo/');
  rules.defineSheetElement('Experience Needed', 'ExperienceInfo/', '/%V');
  rules.defineSheetElement('EquipmentInfo', 'Combat Notes', null);
  rules.defineSheetElement('Allowed Armors', 'EquipmentInfo/', null, '; ');
  rules.defineSheetElement('Allowed Shields', 'EquipmentInfo/', null, '; ');
  rules.defineSheetElement('Weapon Proficiency Count', 'EquipmentInfo/');
  rules.defineSheetElement('Weapon Proficiency', 'EquipmentInfo/', null, '; ');

  FirstEdition.abilityRules(rules);
  FirstEdition.raceRules(rules, FirstEdition.LANGUAGES, FirstEdition.RACES);
  FirstEdition.classRules(rules, FirstEdition.CLASSES);
  FirstEdition.descriptionRules(rules, SRD35.ALIGNMENTS, SRD35.GENDERS);
  FirstEdition.equipmentRules
    (rules, FirstEdition.ARMORS, FirstEdition.SHIELDS,
     FirstEdition.WEAPONS.concat(FirstEdition.USE_OSRIC_RULES ? FirstEdition.OSRIC_ADDITIONAL_WEAPONS : FirstEdition.PHB1E_ADDITIONAL_WEAPONS));
  FirstEdition.combatRules(rules);
  FirstEdition.movementRules(rules);
  FirstEdition.magicRules(rules, FirstEdition.CLASSES, SRD35.SCHOOLS);
  FirstEdition.spellDescriptionRules
    (rules, null, FirstEdition.spellsDescriptions);
  rules.defineChoice('preset', 'race', 'level', 'levels');
  rules.defineChoice('random', FirstEdition.RANDOMIZABLE_ATTRIBUTES);
  rules.randomizeOneAttribute = FirstEdition.randomizeOneAttribute;
  rules.makeValid = SRD35.makeValid;
  rules.ruleNotes = FirstEdition.ruleNotes;

  rules.defineEditorElement
    ('weaponProficiency', 'Weapon Proficiency', 'set', 'weapons', 'spells');
  if(FirstEdition.USE_OSIRIC_RULES) {
    rules.defineEditorElement
      ('weaponSpecialization', 'Specialization', 'select-one',
       ['None'].concat(ScribeUtils.getKeys(rules.getChoices('weapons'))),
       'spells');
    rules.defineEditorElement
      ('doubleSpecialization', '', 'checkbox', ['Doubled'], 'spells');
  }

  Scribe.addRuleSet(rules);

}

FirstEdition.ARMORS = [
  'None', 'Banded', 'Chain', 'Elfin Chain', 'Leather', 'Padded', 'Plate',
  'Ring', 'Scale', 'Splint', 'Studded'
];
FirstEdition.CLASSES = [
  'Assassin', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Illusionist', 'Magic User',
  'Monk', 'Paladin', 'Ranger', 'Thief'
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
  'spells'
];
FirstEdition.SHIELDS = [
  'Large Shield', 'Medium Shield', 'None', 'Small Shield'
];
// OSRIC varies somewhat from the classic 1E rules. If USE_OSRIC_RULES is true,
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
  'Short Sword:d6', 'Trident:d6+1', 'Two-Handed Sword:d10', 'Unarmed:d2'
];
FirstEdition.OSRIC_ADDITIONAL_WEAPONS = [
  'Club:d4r10', 'Heavy Crossbow:d6+1r60', 'Light Crossbow:d4+1r60',
  'Light Mace:d4+1', 'Sling:d4r35', 'Spear:d6r15',
  'Heavy War Hammer:d6+1', 'Lance:2d4+1', 'Light War Hammer:d4+1',
  'Pole Arm:d6+1'
];
FirstEdition.PHB1E_ADDITIONAL_WEAPONS = [
  'Club:d6r10', 'Heavy Crossbow:d4+1r80', 'Light Crossbow:d4r60',
  'Light Mace:d6', 'Sling:d4r40', 'Spear:d6r10',
  'Bardiche:2d4', 'Bec De Corbin:d8', 'Bill-Guisarme:2d4', 'Bo Stick:d6',
  'Fauchard:d6', 'Fauchard-Fork:d8', 'Glaive:d6', 'Glaive-Guisarme:2d4',
  'Guisarme:2d4', 'Guisarme-Voulge:2d4', 'Heavy Lance:d6+3', 'Jo Stick:d6',
  'Light Lance:d6', 'Lucern Hammer:2d4', 'Medium Lance:d6+1',
  'Military Fork:d8', 'Partisan:d6', 'Pike:d6', 'Ranseur:2d4', 'Spetum:d6+1',
  'Voulge:2d4'
];

// Related information used internally by FirstEdition
FirstEdition.armorsArmorClassBonuses = {
  'None' : null, 'Banded' : -6, 'Chain' : -5, 'Elfin Chain' : -5,
  'Leather' : -2, 'Padded' :-2, 'Plate' : -7, 'Ring' : -3, 'Scale' : -4,
  'Splint' : -6, 'Studded' : -3
};
FirstEdition.monkUnarmedDamage = [
  "0", "1d3", "1d4", "1d6", "1d6", "1d6+1", "2d4", "2d4+1", "2d6", "3d4",
  "2d6+1", "3d4+1", "4d4", "4d4+1", "5d4", "6d4", "5d6", "8d4"
];
FirstEdition.spellsAbbreviations = {
  "L": "lvl",
  "L2": "lvl * 2",
  "L3": "lvl * 3",
  "L4": "lvl * 4",
  "L5": "lvl * 5",
  "L6": "lvl * 6",
  "L8": "lvl * 8",
  "L9": "lvl * 9",
  "L10": "lvl * 10",
  "L12": "lvl * 12",
  "L15": "lvl * 15",
  "L20": "lvl * 20",
  "L25": "lvl * 25",
  "L30": "lvl * 30",
  "L40": "lvl * 40",
  "L80": "lvl * 80",
  "L100": "lvl * 100",
  "L120": "lvl * 120",
  "L180": "lvl * 180",
  "L200": "lvl * 200",
  "L240": "lvl * 240",
  "L400": "lvl * 400",
  "L900": "lvl * 900",
  "L8000": "lvl * 8000",
  "Lplus1":"lvl + 1",
  "Lplus2":"lvl + 2",
  "Lplus3":"lvl + 3",
  "Lplus4":"lvl + 4",
  "Lplus5":"lvl + 5",
  "Lplus6":"lvl + 6",
  "Lplus7":"lvl + 7",
  "Lplus8":"lvl + 8",
  "Lplus10":"lvl + 10",
  "Lplus25":"lvl + 25",
  "Lplus60":"lvl + 60",
  "Lplus70":"lvl + 70",
  "L2plus3": "lvl*2 + 3",
  "L2plus4": "lvl*2 + 4",
  "L2plus50": "lvl*2 + 50",
  "L3plus10": "lvl*3 + 10",
  "L4plus4": "lvl*4 + 4",
  "L4plus50": "lvl*4 + 50",
  "L5plus10": "lvl*5 + 10",
  "L5plus15": "lvl*5 + 15",
  "L6plus6": "lvl*6 + 6",
  "L6plus12": "lvl*6 + 12",
  "L10plus10": "lvl*10 + 10",
  "L10plus30": "lvl*10 + 30",
  "L10plus50": "lvl*10 + 50",
  "L10plus40": "lvl*10 + 40",
  "L10plus60": "lvl*10 + 60",
  "L10plus80": "lvl*10 + 80",
  "L10plus90": "lvl*10 + 90",
  "L10plus100": "lvl*10 + 100",
  "L10plus160": "lvl*10 + 160",
  "L10plus1600": "lvl*10 + 1600",
  "L20plus20": "lvl*20 + 20",
  "L30plus360": "lvl*30 + 360",
  "L100plus1600": "lvl*100 + 1600"
};
// NOTE: Where class-based differences exist in descriptions of the same spell,
// the version below with no class specifier contains the Magic User attributes
// where applicable, the Cleric attributes otherwise.
FirstEdition.spellsDescriptions = {
  'Aerial Servant':"R10' Summoned servant fetches request within $L days",
  'Affect Normal Fires':"R$L5' Change size of up to 1.5' radius fire from candle flame to 1.5' radius for $L rd",
  'Airy Water':"Water in 10' radius around self breathable for $L turns",
  'Alter Reality':"Use <i>Phantasmal Force</i> to fulfil limited wish",
  'Animal Friendship':"R10' Recruit animal companion (save neg)",
  'Animal Growth':"R60' Double (rev halve) size/HD/damage of 8 animals for $L rd",
  'Animal Growth(D5 Tran)':"R80' Double (rev halve) size/HD/damage of 8 animals for $L2 rd",
  'Animal Summoning I':"R$L120' Draw 8 4 HD animals to assist",
  'Animal Summoning II':"R$L180' Draw 6 8 HD or 12 4 HD animals to assist",
  'Animal Summoning III':"R$L240' Draw 4 16 HD or 16 4 HD animals to assist",
  'Animate Dead':"R10' Animated remains of $L humanoids obey simple commands",
  'Animate Object':"R30' Target object obeys simple commands for $L rd",
  'Animate Rock':"R40' Target $L2' cu rock obeys simple commands for $L rd",
  'Anti-Animal Shell':"10' radius blocks animal matter for $L turns",
  'Anti-Magic Shell':"$L5' radius allows no magic inside, moves with self for $L turns",
  'Anti-Plant Shell':"80' radius blocks plant matter for $L turns",
  'Antipathy/Sympathy':"R30' $L10'x$L10 area or object attracts or repels specified creature type for $L12 turns (save reduces effect)",
  'Arcane Spells Level 1':"Memorize ${lvl-7} first level MU spells",
  'Astral Spell':"Self and 5 others leave bodies to travel astral plane",
  'Atonement':"Touched relieved of consequences of unwilling alignment violation",
  'Audible Glamer':"R$L10plus60' Sounds of ${(lvl-2)*4} shouting for $L2 rd (save disbelieve)",
  'Audible Glamer(I1 Illu)':"R$L10plus60' Sounds of ${(lvl-2)*4} shouting for $L3 rd (save disbelieve)",
  'Augury':"Self $Lplus70% chance of determining weal/woe of action in next 3 turns",
  'Barkskin':"Touched +1 AC, non-spell saves for $Lplus4 rd",
  'Blade Barrier':"R30' Whirling blade wall 8d8 HP to passers for $L3 rd",
  'Bless':"R60' Unengaged allies in 5'x5' area +1 attack/morale (rev foes -1) for 6 rds",
  'Blindness':"R30' Target blinded (save neg)",
  'Blink':"Self random teleport 2' 1/rd for $L rd",
  'Blur':"Self +1 magical saves, foes -4 first attack, -2 thereafter for $Lplus3 rd",
  'Burning Hands':"3' cone of flame $L HP",
  'Cacodemon':"R10' Summon demon/devil",
  'Call Lightning':"R360' Clouds release ${lvl+2}d8 (save half) 10' bolt 1/turn for $L turns",
  'Call Woodland Beings':"R$L30plus360' Draw forest denizens to assist (save neg)",
  'Change Self':"Self take any humanoid appearance for 2d6+$L2 rd",
  'Chant':"Allies w/in 30' +1 attack, damage, saves (foes -1) as long as chant lasts",
  'Chaos':"R$L5' Creatures in 40'x40' area unpredictable for $L rd (save neg)",
  'Chariot Of Fire':"R10' Flaming chariot and horse pair (ea AC 2, HP 30) drive self and 8 others 240'/rd, fly 480'/rd for $Lplus6 turns",
  'Charm Monster':"R60' Target creature(s) treats self as trusted friend (save neg)",
  'Charm Person Or Mammal':"R80' Target mammal treats self as trusted friend (save neg)",
  'Charm Person':"R120' Target humanoid treats self as trusted friend (save neg)",
  'Charm Plants':"R30' Command plants in 30'x10' area for 1 turn (save neg)",
  'Clairaudience':"Hear remote known location for $L rd",
  'Clairvoyance':"See remote known location for $L rd",
  'Clenched Fist':"R$L5' Force absorbs attacks, strikes foes 1d6-4d6 HP for conc/$L rd",
  'Clone':"Grow copy of target creature, each destroy the other or insane",
  'Cloudkill':"R10' Poisonous 40'x20'x20' cloud kills (5+2 HD save, 4+1 HD -4 save neg) moves 10'/rd for $L rd",
  'Color Spray':"Targets in $L10' cone unconscious (lt $Lplus1 HD), blinded 1d4 rd ($Lplus1-$Lplus2) or stunned 2d4 seg (gt $Lplus2) (save neg)",
  'Command':"R10' Target obeys single-word command (save neg for Int 13+/HD 6+)",
  'Commune':"Self deity answers $L yes/no questions",
  'Commune With Nature':"Self discern nature info in ${lvl/2} mi radius",
  'Comprehend Languages':"Self understand unknown writing/speech for $L5 rd (rev obscures)",
  'Cone Of Cold':"$L5'-long cone ${lvl}d4+$L HP (save half)",
  'Confusion':"R120' 2d8 or more creatures in 60'x60' area unpredictable for $Lplus2 rd",
  'Confusion(D7 Ench)':"R80' 2d4 or more creatures in 20' radius unpredictable for $L rd",
  'Confusion(I4 Ench)':"R80' 2d8 or more creatures in 40'x40' area unpredictable for $L rd",
  'Conjure Animals':"R30' $L HD of animals appear and fight for $L2 rd",
  'Conjure Animals(I6 Conj)':"R30' $L HD of animals appear and fight for $L rd",
  'Conjure Earth Elemental':"R40' 16 HD elemental assists for $L turns (rev dismisses)",
  'Conjure Elemental':"R60' Summoned elemental obeys commands for conc/$L turns",
  'Conjure Fire Elemental':"R80' 16 HD elemental assists for $L turns (rev dismisses)",
  'Contact Other Plane':"Self gain answers to ${Math.floor(lvl/2)} yes/no questions",
  'Continual Darkness':"R60' 30' radius opaque",
  'Continual Light':"R60' Target centers 60' radius light (rev darkness) until dispelled",
  'Continual Light(C3 Tran)':"R120' Target centers 60' radius light (rev darkness) until dispelled",
  "Control Temperature 10' Radius":"Change temperature in 10' radius by $L9 deg F for $Lplus4 turns",
  'Control Weather':"Self controls precipitation, temp, and wind within 4d4 mi sq for 4d6 hr",
  'Control Weather(C7 Tran)':"Self controls precipitation, temp, and wind within 4d4 mi sq for 4d12 hr",
  'Control Weather(D7 Tran)':"Self controls precipitation, temp, and wind within 4d8 mi sq for 8d12 hr",
  'Control Winds':"Winds in 40' radius speed/slow $L3 mph/rd for $L turns",
  'Create Food And Water':"R10' Creates $L3 person/days food and drink",
  'Create Water':"R10' Creates (rev destroys) $L4 gallons potable water",
  'Creeping Doom':"R10' Bugs erupt, attack w/in 80' for $L4 rd",
  'Crushing Hand':"R$L5' Force absorbs attacks, squeezes 1d10-4d10 HP for $L rd",
  'Cure Blindness':"Touched cured of blindness (rev blinds, save neg)",
  'Cure Critical Wounds':"Touched heals 3d8+1 HP (rev inflicts)",
  'Cure Disease':"Touched cured of disease (rev infects, save neg)",
  'Cure Light Wounds':"Touched heals d8 HP (rev inflicts)",
  'Cure Serious Wounds':"Touched heals 2d8+1 HP (rev inflicts)",
  'Dancing Lights':"R$L10plus40' Up to 4 movable lights for $L2 rd",
  'Darkness':"R$L10' 15' radius lightless for $Lplus10 rd",
  'Darkness(I1 Tran)':"R$L10plus40' 15' radius lightless for 2d4+$L rd",
  'Deafness':"R60' Target deafened (save neg)",
  'Death Spell':"R$L10' Kills creatures lt 9 HD in $L25' sq area",
  'Delayed Blast Fireball':"R$L10plus100' ${lvl}d6+$L HP in 20' radius (save half) after up to 5 min",
  'Demi-Shadow Magic':"R$L10plus60' Mimics <i>Cloudkill</i> (die, save neg), <i>Cone Of Cold</i> (${lvl}d4+$L HP), <i>Fireball</i> (${lvl}d6 HP), <i>Lightning Bolt</i> (${lvl}d6 HP), <i>Magic Missile</i> (${Math.floor((lvl+1)/2)}x1d4+1 HP) (ea save $L2 HP), <i>Wall Of Fire</i> (2d6+$L HP, save ${lvl}d4), or <i>Wall Of Ice</i>",
  'Demi-Shadow Monsters':"R30' Create monsters $L HD total, 40% HP (save AC 8, 40% damage) for $L rd",
  'Detect Charm':"Self discern up to 10 charmed creatures in 30' for 1 turn (rev shields 1 target)",
  'Detect Evil':"Self discern evil (rev good) in 10'x60' path for $L5 rd",
  'Detect Evil(C1 Divi)':"Self discern evil (rev good) in 10'x120' path for $L5plus10 rd",
  'Detect Illusion':"Self discern illusions in 10'x$L10' path, touching reveals to others for $L2plus3 rd",
  'Detect Invisibility':"Self see invisible objects in 10'x$L10' path for $L5 rd",
  'Detect Lie':"R30' Target dicerns lies for $L rd (rev makes lies believable)",
  'Detect Magic':"Self discern magical auras in 10'x60' path for $L2 rd",
  'Detect Magic(C1 Divi)':"Self discern magical auras in 10'x30' path for 10 rd",
  'Detect Magic(D1 Divi)':"Self discern magical auras in 10'x40' path for 12 rd",
  'Detect Pits And Snares':"Self discern outdoor traps, indoor pits in 10'x40' path for $L4 rd",
  'Dig':"R30' Excavate 5' cube/rd for $L rd",
  'Dimension Door':"Self teleport $L30'",
  'Disintegrate':"R$L5' Obliterates matter up to $L100' sq (save neg)",
  'Dispel Exhaustion':"4 Touched regain 50% HP, double speed for $L3 turns",
  'Dispel Evil':"Return evil (rev good) creatures to home plane (save neg, -7 attack caster for $L rd)",
  'Dispel Illusion':"R$L10' Dispel one illusion, $L2plus50% dispel one magic",
  'Dispel Magic':"R120' 50% (+5%/-2% per caster level delta) magic in 30'x30' area extinguished",
  'Dispel Magic(C3 Abju)':"R60' 50% (+5%/-2% per caster level delta) magic in 30'x30' area extinguished",
  'Dispel Magic(D4 Abju)':"R80' 50% (+5%/-2% per caster level delta) magic in 40'x40' area extinguished",
  'Distance Distortion':"R$L10' Travel through $L100' sq area halved or doubled for $L turns",
  'Divination':"Self $Lplus60% chance discern info about known location",
  'Duo-Dimension':"Self 2D, take 3x damage from front/back, for $Lplus3 rd",
  'Earthquake':"R120' Intense shaking in $L5' diameter for 1 rd",
  'Emotion':"R$L10' Targets in 40'x40' area experience fear (flee), hate (+2 save/attack/damage), hopelessness (walk away or surrender), or rage (+1 attack, +3 damage, +5 HP) for conc",
  'Enchant An Item':"Touched item becomes magical",
  'Enchanted Weapon':"Touched weapon magical (no bonus) for $L5 rd",
  'Enlarge':"R$L5' Creature grows ${Math.min(lvl*20,200)}% or object ${Math.min(lvl*10,100)}% for $L turns (rev shrinks, save neg)",
  'Entangle':"R80' Plants in 20' radius hold passers (save half move) for 1 turn",
  'Erase':"R30' Erase magical ($L2plus50% chance) or normal ($L4plus50%) from 2-page area",
  'ESP':"R${Math.min(lvl*5,90)}' Self hear others' surface thoughts for $L rd",
  'Exorcise':"R10' Target relieved of supernatural inhabitant/influence",
  'Explosive Runes':"Reading runes on touched 6d4+6 HP to reader (no save), 10' radius (save half)",
  'Extension I':"Existing level 1-3 spell lasts 50% longer",
  'Extension II':"Existing level 1-4 spell lasts 50% longer",
  'Extension III':"Existing level 1-3 spell lasts 100% longer or level 4-5 50%",
  'Faerie Fire':"R80' Outlines targets, allowing +2 attack, for $L4 rd",
  'False Trap':"Touched appears trapped (observer save disbelieve)",
  'Fear':"Targets in 60' cone flee for $L rd (save neg)",
  'Feather Fall':"R$L10' Objects in 10'x10'x10' area fall 2'/sec for $L6 secs",
  'Feeblemind':"R$L10' Target Int reduced (save Cleric +1, Druid -1, MU/Illusionist -4 neg)",
  'Feeblemind(D6 Ench)':"R40' Target Int reduced (save Cleric +1, Druid -1, MU/Illusionist -4 neg)",
  'Feign Death':"Touched appears dead, takes half damage, immune draining for $Lplus6 rd",
  'Feign Death(C3 Necr)':"Touched appears dead, takes half damage, immune draining for $Lplus10 rd",
  'Feign Death(D2 Necr)':"R10' Target appears dead, takes half damage, immune draining for $L2plus4 rd",
  'Find Familiar':"Call beast to serve as familiar (HP 1d3+1, AC 7, Int 6)",
  'Find The Path':"Touched knows shortest route into/out of location for $L turns (rev causes indirection)",
  'Find Traps':"Detect traps in 10'x30' area for 3 turns",
  'Finger Of Death':"R60' Target dies (save neg)",
  'Fire Charm':"R10' Fire mesmerizes viewers (save neg) in 15' radius, makes suggestible for $L2 rd",
  'Fire Seeds':"R40' Acorn missiles 2d8 HP in 5' area, holly berries 1d8 in 5' sq for $L turns (save half)",
  'Fire Shield':"Self +2 save and half damage vs. fire (rev cold), double damage vs. cold (rev fire) for $Lplus2 rd",
  'Fire Storm':"R150' Fire in $L8000' cu  area 2d8 HP for 1 rd (save half) (rev extinguishes)",
  'Fire Trap':"Touched causes 1d4+$L HP in 5' radius when opened (save half)",
  'Fireball':"R$L10plus100' ${lvl}d6 HP in 20' radius (save half)",
  'Flame Arrow':"Touched arrow 1 HP fire damage within $L6 secs",
  'Flame Strike':"R60' 5' radius fire column 6d8 HP (save half)",
  'Floating Disk':"3' diameter disk holds $L100 lbs, follows self w/in 20' for $Lplus3 turns",
  'Fly':"Touched can fly 120'/rd for 1d6+$L6 turns",
  'Fog Cloud':"R10' Fog in 40'x20'x20' area obscures vision, moves 10'/rd for $Lplus4 rd",
  "Fool's Gold":"R10' Copper/brass becomes gold for $L6 turns (observer save disbelieve)",
  'Forceful Hand':"R$L10' Force absorbs attacks, pushes away for $L rd",
  'Forget':"R30' 4 targets in 20' sq forget last ${Math.floor(lvl/3)+1} rd (save neg)",
  'Freezing Sphere':"Freeze $L100' sq water for $L rd, cold ray $L4 hp (save neg) in $L10' path, or cold grenade 4d6 HP (save half) in 10' radius",
  'Friends':"Self Charisma +2d4 to all within $L10plus10' radius (save Cha -1d4) for $L rd",
  'Fumble':"R$L10' Target falls and drops carried (save slowed) for $L rd",
  'Gate':"R30' Summon named extraplanar creature",
  'Gaze Reflection':"Gaze attacks reflected back for 1 rd",
  'Geas':"Touched fulfill quest or sicken and die in 1d4 wk",
  'Glass-Steel':"Touched $L10 lb glass gains steel strength",
  'Glasseye':"Touched 3'x2' area (metal 4\" depth, stone 6', wood 20') becomes transparent for $L rd",
  'Globe Of Invulnerability':"Self 5' radius blocks spells level 1-4 for $L rd",
  'Glyph Of Warding':"Touching $L25' sq causes $L2 HP energy (save half or neg)",
  'Grasping Hand':"R$L10' Force absorbs attacks, restrains for $L rd",
  'Guards And Wards':"Multiple effects protect $L200' sq area for $L2 hr",
  'Gust Of Wind':"Wind in 10'x$L10' path extinguishes flames, moves small objects for 6 secs",
  'Hallucinatory Forest':"R80' Illusion of $L40' sq forest",
  'Hallucinatory Terrain':"R$L20' $L10'x$L10' area mimics other terrain until touched",
  'Hallucinatory Terrain(I3 Illu)':"R$L20plus20' $L100plus1600' sq area mimics other terrain until touched",
  'Haste':"R60' $L targets in 40'x40' area double speed for $Lplus3 rd",
  'Heal':"Touched healed of all but 1d4 HP, cured of blindness, disease, feeblemind (rev causes disease and drains all but 1d4 HP)",
  'Heat Metal':"R40' Metal dangerously hot (rev cold) for 7 rd",
  'Hold Animal':"R80' Immobilize 4 animals for $L2 rd",
  'Hold Monster':"R$L5' Immobilize 4 creatures (save neg) for $L rd",
  'Hold Person':"R120' Immobilize 1-4 medium targets (save neg) for $L2 rd",
  'Hold Person(C2 Ench)':"R60' Immobilize 1-3 medium targets (save neg) for $Lplus4 rd",
  'Hold Plant':"R80' Mobile plants in 16 sq yd immobile for $L rd",
  'Hold Portal':"R$L20' $L80' sq item held shut for $L rd",
  'Holy Word':"30' radius banishes evil extraplanar, kills (lt 4 HD), paralyzes (4-7 HD), stuns (8-11 HD), deafens (gt 11 HD) non-good creatures (rev good)",
  'Hypnotic Pattern':"Viewers in 30' sq totalling 25 HD transfixed for conc (save neg)",
  'Hypnotism':"R30' 1d6 targets subject to suggestion for $Lplus1 rd",
  'Ice Storm':"R$L10' Hail in 40'x40' area 3d10 HP or sleet in 80'x80' area blinds, slows, causes falls for 1 rd",
  'Identify':"$L5plus15% chance of determining magical properties of touched if used w/in $L hr, requires rest afterward",
  'Illusory Script':"Obscured writing causes 5d4 rd confusion (save neg) for readers other than specified",
  'Imprisonment':"Touched safely trapped underground permanently (rev frees)",
  'Improved Invisibility':"Touched invisible for $Lplus4 rd",
  'Improved Phantasmal Force':"R$L10plus60' $L10plus160' sq sight/sound illusion for conc + 2 rd",
  'Incendiary Cloud':"R30' 20' radius smoke cloud for 1d6+4 rd, ${Math.floor(lvl/2)}, $L, ${Math.floor(lvl/2)} HP rd 3, 4, 5 (save half)",
  'Infravision':"Touched see 60' in darkness for $L6plus12 turns",
  'Insect Plague':"R360' Stinging insects fill 180' radius (lt 2 HD flee, 3-4 HD check morale) for $L turns",
  'Insect Plague(D5 Conj)':"R320' Stinging insects fill 160' radius (lt 2 HD flee, 3-4 HD check morale) for $L turns",
  'Instant Summons':"Prepared, unpossessed 8 lb item called to self hand",
  'Interposing Hand':"R$L10' Force absorbs attacks, blocks passage for $L rd",
  'Invisibility':"Touched invisible until attacking",
  "Invisibility 10' Radius":"Creatures w/in 10' of touched invisible until attacking",
  'Invisibility To Animals':"Touched undetected by animals until attack/$Lplus10 rd",
  'Invisible Stalker':"R10' Conjured invisible creature performs 1 task",
  'Irresistible Dance':"Touched -4 AC, fail saves for 1d4+1 rd",
  'Jump':"Touched can jump 30' forward, 10' back/up ${Math.floor((lvl+2)/3)} times",
  'Knock':"R60' Open stuck, locked item",
  'Know Alignment':"Self discern aura of 10 creatures for 1 turn (rev obscures)",
  'Legend Lore':"Gain info about specified object, person, or place",
  'Levitate':"R$L20' Self move target up/down 20'/rd for $L turns (save neg)",
  'Light':"R60' Target spot radiates 20' radius light for $L turns (rev darkness half duration)",
  'Light(C1 Tran)':"R120' Target spot radiates 20' radius light for $Lplus6 turns (rev darkness half duration)",
  'Lightning Bolt':"R$L10plus40' Bolt ${lvl}d6 HP (save half)",
  'Limited Wish':"Minor reshaping of reality",
  'Locate Animals':"Self discern animals in 20'x$L20' area for $L rd",
  'Locate Object':"R$L20' Self find desired object for $L rd (rev obscures)",
  'Locate Object(C3 Divi)':"R$L10plus60' Self find desired object for $L rd (rev obscures)",
  'Locate Plants':"Self discern plants in $L5' radius for $L turns",
  'Lower Water':"R80' $L5'x$L5' fluid subsides by $L5% for $L5 rd (rev raises $L')",
  'Lower Water(C4 Tran)':"R120' $L10'x$L10' fluid subsides by $L5% for $L turns (rev raises $L')",
  "Mage's Faithful Hound":"R10' Invisible dog guards, attacks 3d6 HP w/in 30' of self for $L2 rd",
  "Mage's Sword":"R30' Control remote magic sword (19-20 hits, 5d4 HP) as F${Math.floor(lvl/2)} for $L rd",
  'Magic Aura':"Touched responds to <i>Detect Magic</i> for $L days",
  'Magic Jar':"R$L10' Self trap target soul and possess target body (save neg)",
  'Magic Missile':"R$L10plus60' ${Math.floor((lvl+1)/2)} energy darts hit targets in 10'x10' area 1d4+1 HP ea",
  'Magic Mouth':"Touched object responds to trigger by reciting 25 words",
  'Major Creation':"R10' Create $L' cu object from component plant/mineral material for $L6 turns",
  'Mass Charm':"R$L5' $L2 HD creature(s) in 30'x30' area treat self as trusted friend (save neg)",
  'Mass Invisibility':"R$L10' All in 30' radius invisible until attacking",
  'Mass Suggestion':"R$L10' $L targets carry out reasonable suggestion for $L4plus4 turns",
  'Massmorph':"R$L10' 10 humanoids look like trees",
  'Maze':"R$L5' Target sent to interdimensional maze for amount of time based on Int",
  'Mending':"R30' Repair small break",
  'Message':"R$L10plus60' remote whispering for ${(lvl+5)*6} secs",
  'Meteor Swarm':"R$L10plus40' 4 meteors 10d4 HP in 15' radius or 8 meteors 5d4 HP in 7.5' radius (collateral save half)",
  'Mind Blank':"R30' Target immune divination for 1 dy",
  'Minor Creation':"Create $L' cu object from component plant material for $L6 turns",
  'Minor Globe Of Invulnerability':"Self $L5' radius blocks spells level 1-3 for $L rd",
  'Mirror Image':"Self 1d4 duplicates in 6' radius draw attacks for $L2 rd",
  'Mirror Image(I2 Illu)':"Self 1d4 duplicates in 6' radius draw attacks for $L3 rd",
  'Misdirection':"R30' Divination spells cast on target return false info for $L rd",
  'Mnemonic Enhancement':"Self retain 3 additional spell levels for 1 dy",
  'Monster Summoning I':"R30' 2d4 creatures appear in 1d4 rd, fight for $Lplus2 rd",
  'Monster Summoning II':"R40' 1d6 creatures appear in 1d4 rd, fight for $Lplus3 rd",
  'Monster Summoning III':"R50' 1d4 creatures appear in 1d4 rd, fight for $Lplus4 rd",
  'Monster Summoning IV':"R60' 1d4 creatures appear in 1d4 rd, fight for $Lplus5 rd",
  'Monster Summoning V':"R70' 1d2 creatures appear in 1d4 rd, fight for $Lplus6 rd",
  'Monster Summoning VI':"R80' 1d2 creatures appear in 1d4 rd, fight for $Lplus7 rd",
  'Monster Summoning VII':"R90' 1d2 creatures appear in 1d4 rd, fight for $Lplus8 rd",
  'Move Earth':"R$L10' Displace 64,000' cu/turn",
  'Neutralize Poison':"Touched detoxed (rev lethally poisoned, save neg)",
  'Non-Detection':"5' radius invisible to divination for $L turns",
  'Obscurement':"Mist limits vision in $L100' sq for $L4 rd",
  'Paralyzation':"R$L10' Immobilize $L2 HD creatures in 400' sq",
  'Part Water':"R$L10' Form $L30'x$L20' water trench for $L5 rd",
  'Part Water(C6 Tran)':"R$L20' Form $L30'x$L20' water trench for $L turns",
  'Pass Plant':"Self teleport between trees w/in 300'",
  'Pass Without Trace':"Touched leaves no sign of passage for $L turns",
  'Passwall':"R30' Create 5'x10'x10' passage through dirt/rock for $Lplus6 turns",
  'Permanency':"Effects of spell made permanent, costs 1 Con",
  'Permanent Illusion':"R30' $L100plus1600' sq sight/sound/smell/temperature illusion",
  'Phantasmal Force':"R$L10plus80' $L10plus80' sq illusionary object for conc/until struck",
  'Phantasmal Force(I1 Illu)':"R$L10plus60' $L10plus40' sq illusionary object for conc/until struck",
  'Phantasmal Killer':"R$L5' Nightmare illusion attacks target as HD 4, kills on hit for $L rd (save neg)",
  'Phase Door':"Self pass through touched 10' solid twice",
  'Plane Shift':"Touched plus 6 targets travel to another plane (save neg)",
  'Plant Door':"Self move effortlessly through vegetation for $L turns",
  'Plant Growth':"R$L10' Vegetation in $L100' sq becomes thick and entangled",
  'Plant Growth(D3 Tran)':"R160' Vegetation in $L400' sq becomes thick and entangled",
  'Polymorph Object':"R$L5' Transform any object (save -4 neg)",
  'Polymorph Other':"R$L5' Target form and identity becomes named creature (save neg)",
  'Polymorph Self':"Self form becomes named creature for $L2 turns",
  'Power Word Blind':"R$L5' Creatures in 15' radius blinded for 1d4 rd or 1d4 turns",
  'Power Word Kill':"R${lvl*2.5}' 1 60 HP target or 12 10 HP targets in 10' radius die",
  'Power Word Stun':"R$L5' Target stunned for 1d4-4d4 rd",
  'Prayer':"Allies w/in 60' radius +1 attack, damage, saves (foes -1) for $L rd",
  'Predict Weather':"Discern local weather for next $L2 hr",
  'Prismatic Sphere':"Self 10' radius impenetrable for $L turns",
  'Prismatic Spray':"Targets in 70'x15'x5' area one of 20, 40, 80 HP (save half), fatal poison, stone, insane, planar teleport (save neg)",
  'Prismatic Wall':"R10' $L40'x$L20' multicolored wall blinds viewers 2d4 rd, blocks attacks for $L turns",
  'Produce Fire':"R40' Fire in 60' radius 1d4 HP for 1 rd (rev extinguishes)",
  'Produce Flame':"Flame from burning hand can be thrown 40' for $L2 rd",
  'Programmed Illusion':"R$L10' Target responds to trigger, shows $L100plus1600' sq scene for $L rd",
  'Project Image':"R$L10' Self duplicate immune to attacks, can cast spells for $L rd",
  'Project Image(I5 Illu)':"R$L5' Self duplicate immune to attacks, can cast spells for $L rd",
  "Protection From Evil":"Touched untouchable by evil outsiders, -2 evil attacks, +2 saves for $L2 rd (rev good)",
  "Protection From Evil(C1 Abju)":"Touched untouchable by evil outsiders, -2 evil attacks, +2 saves for $L3 rd (rev good)",
  "Protection From Evil 10' Radius":"Touched 10' radius untouchable by evil outsiders, -2 evil attacks, +2 saves for $L2 rd (rev good)",
  "Protection From Evil 10' Radius(C4 Abju)":"Touched 10' radius untouchable by evil outsiders, -2 evil attacks, +2 saves for $L turns (rev good)",
  'Protection From Fire':"Self immune normal, ignore $L12 HP magic fire or touched immune normal, +4 save and half damage vs magic fire for $L turns",
  'Protection From Lightning':"Self immune normal, ignore $L12 HP magic electricity or touched immune normal, +4 save and half damage vs magic electricity for $L turns",
  'Protection From Normal Missiles':"Touched invulnerable to arrows/bolts for $L turns",
  'Purify Food And Drink':"R30' Consumables in $L' cu uncontaminated (rev contaminates)",
  'Purify Water':"R40' Decontaminates (rev contaminates) $L' cu water",
  'Push':"R$L3plus10' Target $L lb object moves away from self",
  'Pyrotechnics':"R120' Target fire emits fireworks (blind 1d4+1 rd) or obscuring smoke",
  'Pyrotechnics(D3 Tran)':"R160' Target fire emits fireworks (blind 1d4+1 rd) or obscuring smoke",
  'Quest':"Target fulfill quest or -1 saves/day (save neg)",
  'Raise Dead':"R30' Corpse restored to life w/in $L dy or destroy corporeal undead (rev slays, save 2d8+1 HP)",
  'Ray Of Enfeeblement':"R$L3plus10' Target loses $Lplus25% Str, damage for $L rd",
  'Read Magic':"Self understand magical writing for $L2 rd (rev obscures)",
  'Regenerate':"Touched reattach/regrow appendages in 2d4 turns (rev wither)",
  'Reincarnate':"Soul dead le 7 dy inhabits new body",
  'Reincarnation':"Soul dead le $L dy inhabits new body",
  'Remove Curse':"Touched uncursed (rev cursed for $L turns)",
  'Remove Fear':"Touched +4 vs. fear for 1 turn, new +$L save if already afraid (rev cause fear)",
  'Repel Insects':"10' radius expels normal insects, wards giant (save neg) for $L turns",
  'Repulsion':"R$L10' Move all in 10' path away for ${Math.floor(lvl/2)} rd",
  'Resist Cold':"Touched comfortable to 0F, +3 save vs. cold for 1/4 or 1/2 damage for $L turns",
  'Resist Fire':"Touched immune normal fire, +3 vs. magical for for 1/4 or 1/2 damage for $L turns",
  'Restoration':"Touched regains levels and abilities lost w/in $L dy (rev drains)",
  'Resurrection':"R30' Touched restored to life w/in $L10 yr (rev slays)",
  'Reverse Gravity':"R$L5' Items in 30'x30' area fall up for 1 sec",
  'Rope Trick':"Touched rope leads to interdimensional space that holds 6 for $L2 turns",
  'Sanctuary':"Foes save vs. magic to attack self for $Lplus2 rd",
  'Scare':"R10' Target lt 6 HD frozen in terror (save neg) for 3d4 rd",
  'Secret Chest':"Create 12' cu ethereal chest for 60 dy",
  'Shades':"R30' Create monsters $L HD total, 60% HP (save AC 6, 60% damage) for $L rd",
  'Shadow Door':"R10' Illusory door makes self invisible for $L rd",
  'Shadow Magic':"R$L10plus50' Mimics <i>Cone Of Cold</i> (${lvl}d4+$L HP), <i>Fireball</i> (${lvl}d6 HP), <i>Lightning Bolt</i> (${lvl}d6 HP), <i>Magic Missile</i> (${Math.floor((lvl+1)/2)}x1d4+1 HP) (save $L HP)",
  'Shadow Monsters':"R30' Create monsters $L HD total, 20% HP (save AC 10, 20% damage) for $L rd",
  'Shape Change':"Self polymorph freely for $L turns",
  'Shatter':"R60' $L10 lbs brittle material shatters (save neg)",
  'Shield':"Self frontal AC 2 vs hurled, AC 3 vs arrow/bolt, +1 AC vs melee for $L5 rd",
  'Shillelagh':"Touched club +1 attack, 2d4 damage for $L rd",
  'Shocking Grasp':"Touched 1d8+$L HP within 1 rd",
  "Silence 15' Radius":"R120' No sound in 15' radius for $L2 rd",
  'Simulacrum':"Command half-strength copy of another creature",
  'Sleep':"R$L10plus30' Creatures up to 4+4 HD in 15' radius sleep for $L5 rd",
  'Slow':"R$L10plus90' $L targets in 40'x40' area half speed for $Lplus3 rd",
  'Slow Poison':"Touched takes only 1 HP/turn from poison, protected from death for $L hr",
  'Snake Charm':"R30' Charm angry snakes up to self HP 1d4+4 rd",
  'Snare':"Touched snare 90% undetectable",
  'Speak With Animals':"Self converse w/1 type of animal w/in 30' for $L2 rd",
  'Speak With Animals(D1 Tran)':"Self converse w/1 type of animal w/in 40' for $L2 rd",
  'Speak With Dead':"R10' Self question corpse",
  'Speak With Monsters':"Self converse w/intelligent creatures in 30' radius for $L rd",
  'Speak With Plants':"Self converse w/plants in 60' radius for $L rd",
  'Speak With Plants(D4 Tran)':"Self converse w/plants in 40' radius for $L rd",
  'Spectral Force':"R$L10plus60' $L10plus1600' sq sight/sound/smell/temperature illusion for conc + 3 rd",
  'Spell Immunity':"${Math.floor(lvl/4)} touched +8 vs. mind spells for $L turns",
  'Spider Climb':"Touched move 30'/rd on walls/ceilings for $Lplus1 rd",
  'Spirit-Wrack':"R$Lplus10' Banish extraplanar for $L yr",
  'Spiritual Weapon':"R30' magical force attacks for conc/$L rd",
  'Statue':"Touched become stone at will for $L6 turns",
  'Sticks To Snakes':"R30' $L sticks in 10'x10'x10' area become snakes ($L5% venonous) (rev) for $L2 rd",
  'Sticks To Snakes(D4 Tran)':"R40' $L sticks in 10'x10'x10' area become snakes ($L5% venonous) (rev) for $L2 rd",
  'Stinking Cloud':"R30' Creatures w/in 20' radius retch for d4+1 rd (save neg) for $L rd",
  'Stone Shape':"Touched $L' cu rock reshaped",
  'Stone Shape(D3 Trans)':"Touched $Lplus3' cu rock reshaped",
  'Stone Tell':"Self converse w/3' cu rock for 1 turn",
  'Stone To Flesh':"R$L10' Restore stoned creature or convert $L9' cu (rev)",
  'Strength':"Touched Str +1d6 (fighter additional +1) for $L6 turns",
  'Suggestion':"R30' Target carries out reasonable suggestion for $L6plus6 turns",
  'Suggestion(I3 Ench)':"R30' Target carries out reasonable suggestion for $L4plus4 turns",
  'Summon Insects':"R30' Target covered w/insects, 2 HP/rd for $L rd",
  'Summon Shadow':"R10' $L shadows obey commands for $Lplus1 rd",
  'Symbol':"Glowing symbol causes death, discord 5d4 rd, fear (save -4 neg), hopelessness, insanity, pain 2d10 turns, sleep 4d4+1 turns, or stunning 3d4 rd",
  'Symbol(C7 Conj)':"Glowing symbol causes hopelessness, pain, or persuasion for $L turns",
  'Telekinesis':"R$L10' Move $L25 lb for $Lplus2 rd",
  'Teleport':"Instantly transport self + ${Math.max(lvl-10,0)*150+250} lb to known location",
  'Temporal Statis':"R10' Target suspended animation permanently (rev wakens)",
  'Time Stop':"R10' 15' radius gains 1d8+${Math.floor(lvl/2)} x 6 secs",
  'Tiny Hut':"5' radius protects against view, elements for $L6 turns",
  'Tongues':"Self understand any speech (rev muddle) in 30' radius for $L rd",
  'Tongues(C4 Tran)':"Self understand any speech (rev muddle) in 30' radius for 10 rd",
  'Transformation':"Change to warrior (HP x2, AC +4, 2/rd dagger +2 damage) for $L rd",
  'Transmute Metal To Wood':"R80' $L8 lb object becomes wood",
  'Transmute Rock To Mud':"R$L10' $L8000' cu rock becomes mud (rev)",
  'Transmute Rock To Mud(D5 Tran)':"R160' $L8000' cu rock becomes mud (rev)",
  'Transport Via Plants':"Self teleport between plants",
  'Trap The Soul':"R10' Target soul trapped in gem (save neg)",
  'Tree':"Self polymorph into tree for $Lplus6 turns",
  'Trip':"Touched trips passers (save neg), 1d6 damage, stunned 1d4+1 rd for $L turns",
  'True Seeing':"Touched sees past deceptions, alignment auras w/in 120' for $L rd (rev obscures)",
  'True Sight':"Touched sees past deceptions w/in 60' for $L rd",
  'Turn Wood':"Wood in 120'x$L20' area forced away for $L4 rd",
  'Unseen Servant':"Invisible force does simple tasks w/in 30' for $Lplus6 turns",
  'Vanish':"Touched teleported or sent to aethereal plane",
  'Veil':"R$L10' $L400' sq area mimics other terrain for $L turns",
  'Ventriloquism':"R${Math.min(lvl*10,60)}' Self throw voice for $Lplus2 rd ((Int - 12) * 10 % disbelieve)",
  'Ventriloquism(I2 Illu)':"R${Math.min(lvl*10,90)}' Self throw voice for $Lplus4 rd ((Int - 12) * 10 % disbelieve)",
  'Vision':"Self seek answer to question, may cause geas",
  'Wall Of Fire':"R60' $L20' sq wall or $L{lvl*3+10}' radius circle 2d6+$L HP to passers, 2d6 w/in 10', 1d6 w/in 20' for conc/$L rd",
  'Wall Of Fire(D5 Evoc)':"R80' $L20' sq wall or $L5' radius circle 4d4+1 HP to passers, 2d4 w/in 10', 1d4 w/in 20' for conc/$L rd",
  'Wall Of Fog':"R30' Fog in $L20'x$L20'x$L20' area obscures for 2d4+$L rd",
  'Wall Of Force':"R30' Invisible $L20' sq wall impenetrable for $Lplus1 turns",
  'Wall Of Ice':"R$L10' Create $L100' sq ice wall for $L turns",
  'Wall Of Iron':"R$L5' Create ${lvl/4}\" thick, $L15' sq wall",
  'Wall Of Stone':"R$L5' ${lvl/4}\" thick, $L400' sq wall emerges from stone",
  'Wall Of Thorns':"R80' Briars in $L100' sq area 8 + AC HP for $L turns",
  'Warp Wood':"R$L10' Bends 1\"x$L15\" wood",
  'Water Breathing':"Touched breathe water (rev air) for $L3 turns",
  'Water Breathing(D3 Tran)':"Touched breathe water (rev air) for $L6 turns",
  'Weather Summoning':"Self directs precipitation, temp, and wind within d100 mi sq",
  'Web':"R$L5' 80' cu webbing for $L2 turns",
  'Wind Walk':"Self and ${Math.floor(lvl/8)} others insubstantial, travel 600'/turn for $L6 turns",
  'Wish':"Major reshaping of reality",
  'Wizard Eye':"Self see through invisible eye w/600' vision, 100' infravision, moves 30'/rd for $L rd",
  'Wizard Lock':"Touched $L900' sq item held closed",
  'Word Of Recall':"Self instant teleport to prepared sanctuary",
  'Write':"Self copy unknown spell (save vs spell, fail damage and unconsciousness) for $L hr"
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
  'Magic Missile':'Evocation', 'Magic Mouth':'Transmutation',
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
  'Protection From Normal Missiles':'Abjuration',
  'Purify Food And Drink':'Transmutation', 'Purify Water':'Transmutation',
  'Push':'Conjuration', 'Pyrotechnics':'Transmutation', 'Quest':'Enchantment',
  'Raise Dead':'Necromancy', 'Ray Of Enfeeblement':'Enchantment',
  'Read Magic':'Divination', 'Regenerate':'Necromancy',
  'Reincarnate':'Necromancy', 'Reincarnation':'Necromancy',
  'Remove Curse':'Abjuration', 'Remove Fear':'Abjuration',
  'Repel Insects':'Abjuration', 'Repulsion':'Abjuration',
  'Resist Cold':'Transmutation', 'Resist Fire':'Transmutation',
  'Restoration':'Necromancy', 'Resurrection':'Necromancy',
  'Reverse Gravity':'Transmutation', 'Rope Trick':'Transmutation',
  'Sanctuary':'Abjuration', 'Scare':'Enchantment',
  'Secret Chest':'Transmutation', 'Shades':'Illusion', 'Shadow Door':'Illusion',
  'Shadow Magic':'Illusion', 'Shadow Monsters':'Illusion',
  'Shape Change':'Transmutation', 'Shatter':'Transmutation',
  'Shield':'Evocation', 'Shillelagh':'Transmutation',
  'Shocking Grasp':'Transmutation', "Silence 15' Radius":'Transmutation',
  'Simulacrum':'Illusion', 'Sleep':'Enchantment', 'Slow':'Transmutation',
  'Slow Poison':'Necromancy', 'Snake Charm':'Enchantment','Snare':'Enchantment',
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
  rules.defineRule('combatNotes.dexterityMissileAttackAdjustment',
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
  rules.defineRule('divineSpellBonus.1',
    'casterLevelDivine', '?', null,
    'wisdom', '=', 'source<=12 ? null : source==13 ? 1 : source<=18 ? 2 : 3'
  );
  rules.defineRule('divineSpellBonus.2',
    'casterLevelDivine', '?', null,
    'wisdom', '=', 'source <= 14 ? null : source == 15 ? 1 : 2'
  );
  rules.defineRule('divineSpellBonus.3',
    'casterLevelDivine', '?', null,
    'wisdom', '=', 'source <= 16 ? null : 1'
  );
  rules.defineRule('divineSpellBonus.4',
    'casterLevelDivine', '?', null,
    'wisdom', '=', 'source <= 17 ? null : 1'
  );

  rules.defineSheetElement('Maximum Henchmen', 'Alignment');

};

/* Defines the rules related to character classes. */
FirstEdition.classRules = function(rules, classes) {

  var thiefSkillsRacialAdjustments =
    FirstEdition.USE_OSRIC_RULES ?
    {
      'Climb Walls':
        "{'Dwarf':-10, 'Elf':-5, 'Gnome':-15, 'Halfling':-15, 'Half Orc':5, 'Human':5}",
      'Find Traps':
        "{'Dwarf':15, 'Elf':5, 'Half Orc':5}",
      'Hear Noise':
        "{'Elf':5, 'Gnome':5, 'Halfling':5, 'Half Orc':5}",
      'Hide In Shadows':
        "{'Elf':10, 'Half Elf':5, 'Halfling':15}",
      'Move Quietly':
        "{'Dwarf':-5, 'Elf':5, 'Halfling':15}",
      'Open Locks':
        "{'Dwarf':15, 'Elf':-5, 'Gnome':10, 'Half Orc':5, 'Human':5}",
      'Pick Pockets':
        "{'Elf':5, 'Half Elf':10, 'Halfling':5, 'Half Orc':-5}",
      'Read Languages':
        "{'Dwarf':-5, 'Elf':10, 'Halfling':-5, 'Half Orc':-10}"
    } :
    {
      'Climb Walls':
        "{'Dwarf':-10, 'Gnome':-15, 'Halfling':-15, 'Half Orc':5}",
      'Find Traps':
        "{'Dwarf':15, 'Gnome':10, 'Halfling':5, 'Half Orc':5}",
      'Hear Noise':
        "{'Elf':5, 'Gnome':10, 'Halfling':5, 'Half Orc':5}",
      'Hide In Shadows':
        "{'Elf':10, 'Gnome':5, 'Half Elf':5, 'Halfling':15}",
      'Move Quietly':
        "{'Elf':5, 'Gnome':5, 'Halfling':10}",
      'Open Locks':
        "{'Dwarf':10, 'Elf':-5, 'Gnome':5, 'Halfling':5, 'Half Orc':5}",
      'Pick Pockets':
        "{'Elf':5, 'Half Elf':10, 'Halfling':5, 'Half Orc':-5}",
      'Read Languages':
        "{'Dwarf':-5, 'Halfling':-5, 'Half Orc':-10}"
    };

  rules.defineNote
    ('validationNotes.levelsTotal:' +
     'Allocated levels differ from level total by %V');
  rules.defineRule('validationNotes.levelsTotal',
    'level', '+=', '-source',
    /^levels\./, '+=', null
  );

  rules.defineRule('warriorLevel', '', '=', '0');

  for(var i = 0; i < classes.length; i++) {

    var allowedArmors, allowedShields, baseAttack, features, hitDie, notes,
        profWeaponPenalty, profWeaponCount, saveBreath, saveDeath,
        savePetrification, saveSpell, saveWand, spellsKnown, thiefSkillLevel;
    var klass = classes[i];

    spellsKnown = null;
    thiefSkillLevel = null;

    if(klass == 'Assassin') {

      allowedArmors = ['Leather', 'Studded'];
      allowedShields = ['All'];
      baseAttack = 'source <= 4 ? -1 : source <= 8 ? 1 : source <= 12 ? 4 : 6';
      features = [
        'Assassination', 'Backstab', 'Disguise', '9:Extra Languages',
        '12:Read Scrolls'
      ];
      hitDie = 6;
      notes = [
        'combatNotes.assassinationFeature:' +
          'Strike kills surprised target %V% - 5%/2 foe levels',
        'combatNotes.backstabFeature:' +
          '+4 melee attack/x%V damage when surprising',
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
        profWeaponPenalty = -3;
      } else {
        notes.push(
          'validationNotes.assassinClassAbility:' +
            'Requires Constitution >= 6/Dexterity >= 12/Intelligence >= 11/' +
            'Strength >= 12'
        );
        profWeaponPenalty = -2;
      }
      profWeaponCount = '3 + Math.floor(source / 4)';
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

      allowedArmors = ['All'];
      allowedShields = ['All'];
      baseAttack = 'source < 19 ? Math.floor(source / 3) * 2 : 11';
      features = [
        'Bonus Cleric Experience', 'Turn Undead', '9:Attract Followers'
      ];
      hitDie = 8;
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
        profWeaponCount = '2 + Math.floor(source / 3)';
      } else {
        notes.push(
          'validationNotes.clericClassAbility:Requires Wisdom >= 9'
        );
        profWeaponCount = '2 + Math.floor(source / 4)';
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
      profWeaponPenalty = -3;
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
      rules.defineRule('spellsKnown.C1', 'divineSpellBonus.1', '+', null);
      rules.defineRule('spellsKnown.C2', 'divineSpellBonus.2', '+', null);
      rules.defineRule('spellsKnown.C3', 'divineSpellBonus.3', '+', null);
      rules.defineRule('spellsKnown.C4', 'divineSpellBonus.4', '+', null);

    } else if(klass == 'Druid' ||
              (klass == 'Bard' && !FirstEdition.USE_OSRIC_RULES)) {

      allowedArmors = ['Leather'];
      allowedShields = klass == 'Druid' ? ['Small Shield'] : [];
      baseAttack = 'Math.floor(source / 3) * 2';
      features = [
        'Resist Fire', 'Resist Lightning', '3:Nature Knowledge',
        '3:Wilderness Movement', '7:Fey Immunity', '7:Shapeshift'
      ];
      hitDie = klass == 'Druid' ? 8 : 6;
      notes = [
        'featureNotes.natureKnowledgeFeature:' +
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
      if(klass == 'Druid') {
        features.push('Bonus Druid Experience');
        notes.push(
          'featureNotes.bonusDruidExperienceFeature:' +
            '10% added to awarded experience',
        );
      } else {
        features.push('Charming Music', 'Defensive Song', 'Legend Lore', 'Poetic Inspiration');
        notes.push(
          'featureNotes.legendLoreFeature:' +
            '%V% chance of info about legendary item/person/place',
          'magicNotes.charmingMusicFeature:' +
            "%V% chance of charming creatures within 40' while playing (save 1 rd)",
          'magicNotes.defensiveSongFeature:' +
            'Counteract song attacks, soothe shriekers',
          'magicNotes.poeticInspirationFeature:' +
            'Performance gives allies +1 attack, +10% morale for 1 turn after 2 rd'
        );
      }
      if(FirstEdition.USE_OSRIC_RULES) {
        notes.push(
          'validationNotes.druidClassAbility:' +
            'Requires Constitution >= 6/Dexterity >= 6/Intelligence >= 6/' +
            'Strength >= 6/Wisdom >= 12'
        );
        profWeaponCount = '2 + Math.floor(source / 3)';
      } else if(klass == 'Bard') {
        notes.push(
          'validationNotes.bardClassAbility:' +
            'Requires Charisma >= 15/Constitution >= 10/Dexterity >= 15/' +
            'Intelligence >= 12/Strength >= 15/Wisdom >= 15',
          'validationNotes.bardClassAlignment:Requires Alignment =~ Neutral',
          'validationNotes.bardClassLevels:Requires Fighter >= 5/Thief >= 5',
          'validationNotes.bardClassRace:Requires Race =~ Human|Half Elf'
        );
        profWeaponCount = '2 + Math.floor(source / 5)';
      } else {
        notes.push(
          'validationNotes.druidClassAbility:' +
            'Requires Charisma >= 15/Wisdom >= 12'
        );
        profWeaponCount = '2 + Math.floor(source / 5)';
      }
      saveBreath = '16 - Math.floor(source / 3) - Math.floor((source+5) / 12)';
      saveDeath = '10 - Math.floor(source / 3) - Math.floor((source+5) / 12)';
      savePetrification =
        '13 - Math.floor(source / 3) - Math.floor((source+5) / 12)';
      saveSpell = '15 - Math.floor(source / 3) - Math.floor((source+5) / 12)';
      saveWand = '14 - Math.floor(source / 3) - Math.floor((source+5) / 12)';
      if(klass == 'Druid') {
        spellsKnown = [
          'D1:1:2/3:3/4:4/9:5/13:6',
          'D2:2:1/3:2/5:3/7:4/11:5/14:6',
          'D3:3:1/4:2/7:3/12:4/13:5/14:6',
          'D4:6:1/8:2/10:3/12:4/13:5/14:6',
          'D5:9:1/10:2/12:3/13:4/14:5',
          'D6:11:1/12:2/13:3/14:4',
          'D7:12:1/13:2/14:3'
        ];
      } else {
        spellsKnown = [
          'D1:1:1/2:2/3:3/16:4/19:5',
          'D2:4:1/5:2/6:3/17:4/21:5',
          'D3:7:1/8:2/9:3/18:4/22:5',
          'D4:9:1/10:2/11:3/19:4/23:5',
          'D5:9:1/10:2/12:3/13:4/14:5',
          'D6:13:1/14:2/15:3/20:4/23:5'
        ];
      }
      profWeaponPenalty = -4;
      rules.defineRule('casterLevelDivine', 'levels.' + klass, '+=', null);
      if(klass == 'Druid') {
        rules.defineRule('druidFeatures.Bonus Druid Experience',
          'charisma', '?', 'source >= 16',
          'wisdom', '?', 'source >= 16'
        );
      }
      if(klass == 'Druid') {
        rules.defineRule('languageCount', 'levels.' + klass, '+=', '1');
      } else {
        rules.defineRule('languageCount',
          'levels.' + klass, '+=', 'source >= 18 ? source - 7 : source >= 4 ? source - 2 - Math.floor((source-3) / 3) : 1'
        );
      }
      rules.defineRule("languages.Druids' Cant", 'levels.' + klass, '=', '1');
      rules.defineRule('spellsKnown.D1', 'divineSpellBonus.1', '+', null);
      rules.defineRule('spellsKnown.D2', 'divineSpellBonus.2', '+', null);
      rules.defineRule('spellsKnown.D3', 'divineSpellBonus.3', '+', null);
      rules.defineRule('spellsKnown.D4', 'divineSpellBonus.4', '+', null);

      if(klass == 'Bard') {
        rules.defineRule('featureNotes.legendLoreFeature',
          'levels.Bard', '=', 'source == 23 ? 99 : source >= 7 ? source * 5 - 15 : source >= 3 ? source * 3 - 2 : (source * 5 - 5)'
        );
        rules.defineRule('magicNotes.charmingMusicFeature',
          'levels.Bard', '=', 'source == 23 ? 95 : source >= 21 ? source * 4 : source >= 2 ? 20 + Math.floor((source-2) * 10 / 3) : 15'
        );
        rules.defineRule('maximumHenchmen',
          'levels.Bard', 'v', 'source < 23 ? Math.floor((source-2) / 3) : null'
        );
      }

    } else if(klass == 'Fighter') {

      allowedArmors = ['All'];
      allowedShields = ['All'];
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
        profWeaponCount = '4 + Math.floor(source / 2)';
      } else {
        notes.push(
        'validationNotes.fighterClassAbility:' +
          'Requires Constitution >= 7/Strength >= 9'
        );
        profWeaponCount = '4 + Math.floor(source / 3)';
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
      profWeaponPenalty = -2;
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

    } else if(klass == 'Illusionist') {

      allowedArmors = [];
      allowedShields = [];
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
      notes = [
        'featureNotes.attractFollowersFeature:' +
          'May build stronghold and attract followers',
        'magicNotes.eldritchCraftFeature:' +
          'May create magical potion/scroll and recharge rods/staves/wands'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        notes.push(
          'validationNotes.illusionistClassAbility:' +
            'Requires Charisma >= 6/Dexterity >= 16/Intelligence >= 15/' +
            'Strength >= 6/Wisdom >= 6'
        );
        profWeaponCount = '1 + Math.floor(source / 5)';
      } else {
        notes.push(
          'validationNotes.illusionistClassAbility:' +
            'Requires Dexterity >= 16/Intelligence >= 15'
        );
        profWeaponCount = '1 + Math.floor(source / 6)';
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
      profWeaponPenalty = -5;
      rules.defineRule('casterLevelArcane', 'levels.Illusionist', '+=', null);

    } else if(klass == 'Magic User') {

      allowedArmors = [];
      allowedShields = [];
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
      notes = [
        'featureNotes.attractFollowersFeature:' +
          'May build stronghold and attract followers',
        'featureNotes.bonusMagicUserExperienceFeature:' +
          '10% added to awarded experience',
        'magicNotes.eldritchCraftFeature:' +
          'May create magical potion/scroll and recharge rods/staves/wands',
        'magicNotes.eldritchPowerFeature:May use <i>Enchant An Item</i> spell'
      ];
      if(FirstEdition.USE_OSRIC_RULES) {
        notes.push(
          'validationNotes.magicUserClassAbility:' +
            'Requires Charisma >= 6/Constitution >= 6/Dexterity >= 6/' +
            'Intelligence >= 9/Wisdom >= 6'
        );
        profWeaponCount = '1 + Math.floor(source / 5)';
      } else {
        notes.push(
          'validationNotes.magicUserClassAbility:' +
            'Requires Dexterity >= 6/Intelligence >= 9'
        )
        profWeaponCount = '1 + Math.floor(source / 6)';
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
      profWeaponPenalty = -5;
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

    } else if(klass == 'Monk' && !FirstEdition.USE_OSRIC_RULES) {

      allowedArmors = [];
      allowedShields = [];
      baseAttack = '(source <= 8 ? -1 : 0) + Math.floor((source - 1) / 4) * 2';
      features = [
        'Dodge Missiles', 'Evasion', 'Killing Blow', 'Spiritual',
        'Stunning Blow', 'Unburdened', '2:Aware', '3:Speak With Animals',
        '4:Flurry Of Blows', '4:Masked Mind', '4:Slow Fall',
        '5:Controlled Movement', '5:Purity Of Body', '6:Feign Death',
        '7:Wholeness Of Body', '8:Speak With Plants', '9:Clear Mind',
        '9:Improved Evasion', '10:Steel Mind', '11:Diamond Body',
        '12:Free Will', '13:Quivering Palm'
      ];
      hitDie = 4;
      notes = [
        'combatNotes.awareFeature:Surprised %V%',
        'combatNotes.dodgeMissilesFeature:' +
          'Petrification save to dodge non-magical missiles',
        'combatNotes.flurryOfBlowsFeature:%1 unarmed attacks per rd',
        'combatNotes.killingBlowFeature:' +
          '%1+foe AC % chance of killing w/unarmed strike',
        'combatNotes.monkDamageAdjustment:+%V damage',
        'combatNotes.stunningBlowFeature:' +
          'Foe stunned for 1d6 rd when unarmed attack succeeds by ge 5',
        'featureNotes.feignDeathFeature:Appear dead for %V turns',
        'featureNotes.spiritualFeature:' +
          'Must donate net income to religious institution',
        'featureNotes.unburdenedFeature:May not own gt 5 magic items',
        'magicNotes.speakWithAnimalsFeature:<i>Speak With Animals</i> at will',
        'magicNotes.speakWithPlantsFeature:<i>Speak With Plants</i> at will',
        'magicNotes.wholenessOfBodyFeature:Heal 1d4+%V damage to self 1/day',
        'saveNotes.clearMindFeature:' +
          '%V% resistance to beguiling, charm, hypnosis and suggestion spells',
        'saveNotes.controlledMovementFeature:' +
          'Immune <i>Haste</i> and <i>Slow</i>',
        'saveNotes.diamondBodyFeature:Immune to poison',
        'saveNotes.evasionFeature:' +
          'Successful save yields no damage instead of 1/2',
        'saveNotes.freeWillFeature:Immune <i>Geas</i> and <i>Quest</i> spells',
        'saveNotes.improvedEvasionFeature:Failed save yields 1/2 damage',
        'saveNotes.maskedMindFeature:%V% resistance to ESP',
        'saveNotes.purityOfBodyFeature:Immune to normal disease',
        "saveNotes.slowFallFeature:No damage from fall of %1 w/in %2' of wall",
        'saveNotes.steelMindFeature:Resist telepathy and mind blast as int 18',
        'validationNotes.monkClassAbility:' +
          'Requires Constitution >= 11/Dexterity >= 15/Strength >= 15/' +
          'Wisdom >= 15',
        'validationNotes.monkClassAlignment:Requires Alignment =~ Lawful'
      ];
      saveBreath = '16 - Math.floor((source - 1) / 4)';
      saveDeath = '13 - Math.floor((source - 1) / 4)';
      savePetrification = '12 - Math.floor((source - 1) / 4)';
      saveSpell = '15 - Math.floor((source - 1) / 4) * 2';
      saveWand = '14 - Math.floor((source - 1) / 4) * 2';
      thiefSkillLevel = 'source';
      profWeaponPenalty = -3;
      profWeaponCount = '1 + Math.floor(source / 2)';
      rules.defineRule('armorClass',
        'levels.Monk', '=', '11 - source + Math.floor(source / 5)'
      );
      rules.defineRule
        ('combatNotes.awareFeature', 'levels.Monk', '=', '34 - source * 2');
      rules.defineRule('combatNotes.flurryOfBlowsFeature.1',
        'levels.Monk', '=', 'source <= 5 ? 1.25 : source <= 8 ? 1.5 : source <= 10 ? 2 : source <= 13 ? 2.5 : source <= 15 ? 3 : 4'
      );
      rules.defineRule
        ('combatNotes.dexterityArmorClassAdjustment', 'levels.Monk', '*', '0');
      rules.defineRule
        ('combatNotes.killingBlowFeature.1', 'levels.Monk', '=', 'source - 7');
      rules.defineRule('combatNotes.monkDamageAdjustment',
        'levels.Monk', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule
        ('featureNotes.feignDeathFeature', 'levels.Monk', '=', 'source * 2');
      rules.defineRule
        ('magicNotes.wholenessOfBodyFeature', 'levels.Monk', '=', 'source - 7');
      rules.defineRule
        ('maximumHenchmen', 'levels.Monk', 'v', 'source < 6 ? 0 : source - 4');
      rules.defineRule
        ('saveNotes.clearMindFeature', 'levels.Monk', '=', '95 - source * 5');
      rules.defineRule
        ('saveNotes.maskedMindFeature', 'levels.Monk', '=', '38 - source * 2');
      rules.defineRule('saveNotes.slowFallFeature.1',
        'levels.Monk', '=', 'source < 6 ? "20\'" : source < 13 ? "30\'" : "any distance"'
      );
      rules.defineRule('saveNotes.slowFallFeature.2',
        'levels.Monk', '=', 'source < 6 ? 1 : source < 13 ? 4 : 8'
      );
      rules.defineRule('speed', 'levels.Monk', '+', 'source * 10 + 20');
      rules.defineRule
        ('combatNotes.dexterityArmorClassAdjustment', 'levels.Monk', '=', '0');
      rules.defineRule
        ('combatNotes.strengthAttackAdjustment', 'levels.Monk', '=', '0');
      rules.defineRule
        ('combatNotes.strengthDamageAdjustment', 'levels.Monk', '=', '0');
      rules.defineRule('weapons.Unarmed.2',
        'levels.Monk', '=', 'FirstEdition.monkUnarmedDamage[source]'
      );

    } else if(klass == 'Paladin') {

      allowedArmors = ['All'];
      allowedShields = ['All'];
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
        profWeaponCount = '3 + Math.floor(source / 2)';
      } else {
        notes.push(
          'validationNotes.paladinClassAbility:' +
            'Requires Charisma >= 17/Constitution >= 9/Intelligence >= 9/' +
            'Strength >= 12/Wisdom >= 13'
        );
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
        profWeaponCount = '3 + Math.floor(source / 3)';
      }
      spellsKnown = [
        'C1:9:1/10:2/14:3/21:4',
        'C2:11:1/12:2/16:3/22:4',
        'C3:13:1/17:2/18:3/23:4',
        'C4:15:1/19:2/20:3/24:4'
      ];
      profWeaponPenalty = -2;
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
      rules.defineRule('combatNotes.fightingTheUnskilledFeature',
        'levels.Paladin', '+=', null
      );
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

    } else if(klass == 'Ranger') {

      allowedArmors = ['All'];
      allowedShields = ['All'];
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
        profWeaponCount = '3 + Math.floor(source / 2)';
      } else {
        notes.push(
          'combatNotes.rangerFavoredEnemyFeature:' +
            '+%V melee damage vs. giantish foe',
          'validationNotes.rangerClassAbility:' +
            'Requires Constitution >= 14/Dexterity >= 6/Intelligence >= 13/' +
            'Strength >= 13/Wisdom >= 14'
        );
        profWeaponCount = '3 + Math.floor(source / 3)';
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
      profWeaponPenalty = -2;
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
      rules.defineRule('combatNotes.fightingTheUnskilledFeature',
        'levels.Ranger', '+=', null
      );
      rules.defineRule
        ('combatNotes.rangerFavoredEnemyFeature', 'levels.Ranger', '=', null);
      rules.defineRule('rangerFeatures.Bonus Ranger Experience',
        'strength', '?', 'source >= 16',
        'intelligence', '?', 'source >= 16',
        'wisdom', '?', 'source >= 16'
      );
      rules.defineRule('warriorLevel', 'levels.Ranger', '+=', null);

    } else if(klass == 'Thief') {

      allowedArmors = ['Leather', 'Studded'];
      allowedShields = [];
      baseAttack = '(source <= 8 ? -1 : 0) + Math.floor((source - 1) / 4) * 2';
      features = ['Backstab', 'Bonus Thief Experience', '10:Read Scrolls'];
      hitDie = 6;
      notes = [
        'combatNotes.backstabFeature:' +
          '+4 melee attack/x%V damage when surprising',
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
      saveBreath = '16 - Math.floor((source - 1) / 4)';
      saveDeath = '13 - Math.floor((source - 1) / 4)';
      savePetrification = '12 - Math.floor((source - 1) / 4)';
      saveSpell = '15 - Math.floor((source - 1) / 4) * 2';
      saveWand = '14 - Math.floor((source - 1) / 4) * 2';
      thiefSkillLevel = 'source';
      profWeaponPenalty = -3;
      profWeaponCount = '2 + Math.floor(source / 4)';
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
      ('weaponProficiencyCount', 'levels.' + klass, '+=', profWeaponCount);
    rules.defineRule('weaponNonProficiencyPenalty',
      'levels.' + klass, '^=', profWeaponPenalty
    );

    for(var j = 0; j < allowedArmors.length; j++) {
      rules.defineRule
        ('allowedArmors.' + allowedArmors[j], 'levels.' + klass, '=', '1');
    }
    for(var j = 0; j < allowedShields.length; j++) {
      rules.defineRule
        ('allowedShields.' + allowedShields[j], 'levels.' + klass, '=', '1');
    }

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
          'source <= 11 ? (source-12)*5 : source >= 17 ? (source-16)*5 : null',
          'levels.Monk', '*', '0'
        );
        rules.defineRule('thiefSkills.Read Languages',
          'thiefSkillLevel', '=', 'source >= 4 ? Math.min(source*5, 80) : null',
          'levels.Monk', '*', '0'
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
          'race', '+', thiefSkillsRacialAdjustments[skill] + '[source]'
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
    /^weaponProficiency\./, '+=', null,
    'weaponSpecialization', '+', 'source == "None" ? null : 1',
    'doubleSpecialization', '+', 'source ? 1 : null'
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
    var matchInfo = pieces[1].match(/(\d?d\d+)(\+(\d+))?(r(\d+))?/);
    if(! matchInfo)
      continue;

    var damageDie = matchInfo[1];
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
      'weaponSpecialization', '+', 'source == "' + name + '" ? 1 : null',
      sanityNote, '+', null
    );
    rules.defineRule('damageBonus.' + name,
      '', '=', damagePlus || '0',
      'combatNotes.monkDamageAdjustment', '+', null,
      'combatNotes.strengthDamageAdjustment', '+', null,
      'weaponDamageAdjustment.' + name, '+', null,
      'weaponSpecialization', '+', 'source == "' + name + '" ? 2 : null'
    );

    rules.defineRule(weaponName + '.1',
      'attackBonus.' + name, '=', 'source < 0 ? source : ("+" + source)'
    );
    rules.defineRule(weaponName + '.2', '', '=', '"' + damageDie + '"');
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

  rules.defineRule('weapons.Unarmed', '', '=', '1');
  rules.defineRule('weaponProficiency.Unarmed', '', '=', '1');
  rules.defineRule('weaponProficiencyCount', 'weapons.Unarmed', '+', '1');

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
        'Reincarnate:Transmute Metal To Wood'
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
        'Identify:Jump:Light:Magic Aura:Magic Missile:Mending:Message:' +
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
        "Protection From Evil 10' Radius:Protection From Normal Missiles:" +
        'Slow:Suggestion:Tiny Hut:Tongues:Water Breathing',
        'M4:Charm Monster:Confusion:Dig:Dimension Door:Enchanted Weapon:' +
        'Extension I:Fear:Fire Charm:Fire Shield:Fire Trap:Fumble:' +
        'Hallucinatory Terrain:Ice Storm:Massmorph:' +
        'Minor Globe Of Invulnerability:Mnemonic Enhancement:' +
        'Monster Summoning II:Plant Growth:Polymorph Other:Polymorph Self:' +
        'Remove Curse:Wall Of Fire:Wall Of Ice:Wizard Eye',
        'M5:Airy Water:Animal Growth:Animate Dead:Cloudkill:Cone Of Cold:' +
        'Conjure Elemental:Contact Other Plane:Distance Distortion:' +
        'Extension II:Feeblemind:Hold Monster:Interposing Hand:' +
        "Mage's Faithful Hound:Magic Jar:Monster Summoning III:Passwall:" +
        'Secret Chest:Stone Shape:Telekinesis:Teleport:' +
        'Transmute Rock To Mud:Wall Of Force:Wall Of Iron:Wall Of Stone',
        'M6:Anti-Magic Shell:Control Weather:Death Spell:Disintegrate:' +
        'Enchant An Item:Extension III:Forceful Hand:Freezing Sphere:Geas:' +
        'Glasseye:Globe Of Invulnerability:Guards And Wards:' +
        'Invisible Stalker:Legend Lore:Lower Water:Monster Summoning IV:' +
        'Move Earth:Part Water:Project Image:Reincarnation:Repulsion:' +
        'Spirit-Wrack:Stone To Flesh:Transformation',
        'M7:Cacodemon:Charm Plants:Delayed Blast Fireball:Duo-Dimension:' +
        "Grasping Hand:Instant Summons:Limited Wish:Mage's Sword:" +
        'Mass Invisibility:Monster Summoning V:Phase Door:Power Word Stun:' +
        'Reverse Gravity:Simulacrum:Statue:Vanish',
        'M8:Antipathy/Sympathy:Clenched Fist:Clone:Glass-Steel:' +
        'Incendiary Cloud:Irresistible Dance:Mass Charm:Maze:Mind Blank:' +
        'Monster Summoning VI:Permanency:Polymorph Object:Power Word Blind:' +
        'Spell Immunity:Symbol:Trap The Soul',
        'M9:Astral Spell:Crushing Hand:Gate:Imprisonment:Meteor Swarm:' +
        'Monster Summoning VII:Power Word Kill:Prismatic Sphere:Shape Change:' +
        'Temporal Statis:Time Stop:Wish'
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
        notes.push('validationNotes.'+raceNoSpace+'RaceConMax:' +
                   'Requires Constitution <= 17');
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
        // Can't specify both min and max Strength in a single note because of
        // how rules are generated from it.
        'validationNotes.'+raceNoSpace+'RaceAbility:' +
          'Requires Constitution >= 10/Dexterity >= 8/Intelligence >= 6/' +
          'Strength >= 6/Wisdom <= 17',
        'validationNotes.'+raceNoSpace+'RaceStrMax:Requires Strength <= 17'
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
  var attrs;
  var choices;
  if(attribute == 'armor') {
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in this.getChoices('armors')) {
      if(attr == 'None' ||
         attrs['allowedArmors.All'] != null ||
         attrs['allowedArmors.' + attr] != null) {
        choices[choices.length] = attr;
      }
    }
    attributes['armor'] = choices.length == 0 ? 'None' :
      choices[ScribeUtils.random(0, choices.length - 1)];
  } else if(attribute == 'proficiencies') {
    attrs = this.applyRules(attributes);
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
    attrs = this.applyRules(attributes);
    choices = [];
    for(attr in this.getChoices('shields')) {
      if(attr == 'None' ||
         attrs['allowedShields.All'] != null ||
         attrs['allowedShields.' + attr] != null) {
        choices[choices.length] = attr;
      }
    }
    attributes['shield'] = choices.length == 0 ? 'None' :
      choices[ScribeUtils.random(0, choices.length - 1)];
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
    '    limit of level 10.\n' +
    '  </li>\n' +
    '  <li>\n' +
    '    Scribe generally uses the OSRIC names and effects for spells, rather\n' +
    '    than those found in the 1E PHB.\n',
    '  </li>\n' +
    '  <li>\n' +
    '    The OSRIC rules are unclear as to whether or not the Fighting the\n' +
    '    Unskilled feature applies to Paladins and Rangers. Scribe assumes\n' +
    '    that it does.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Scribe does not note racial restrictions on class and level.\n' +
    '  </li>\n' +
    '  <li>\n' +
    '    Scribe does not compute class level from experience points.\n' +
    '  </li>\n' +
    '  <li>\n' +
    '    Scribe does not report the chance of extraordinary success on\n' +
    '    strength tests for characters with strength 18/91 and higher.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Percentage calculations for the bard Charming Music effect differ\n' +
    '    slightly from the 1E PHB table for some bard levels.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n';
};

/* Replaces spell names with longer descriptions on the character sheet. */
FirstEdition.spellDescriptionRules = function(rules, spells, descriptions) {

  if(spells == null) {
    spells = ScribeUtils.getKeys(rules.choices.spells);
  }
  if(descriptions == null) {
    descriptions = FirstEdition.spellsDescriptions;
  }

  rules.defineRule('casterLevels.C',
    'levels.Cleric', '+=', null,
    'levels.Paladin', '+=', 'source<=8 ? null : Math.min(source - 8, 8)'
  );
  rules.defineRule('casterLevels.D',
    'levels.Bard', '+=', null,
    'levels.Druid', '+=', null,
    'levels.Ranger', '+=', 'source<=7 ? null : Math.min(Math.floor((source-6)/2), 6)'
  );
  rules.defineRule('casterLevels.I', 'levels.Illusionist', '=', null);
  rules.defineRule('casterLevels.M',
    'levels.Magic User', '+=', null,
    'levels.Ranger', '+=', 'source<=7 ? null : Math.min(Math.floor((source-6)/2), 6)'
  );

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
    var description = descriptions[spell] || descriptions[name];

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
        if(FirstEdition.spellsAbbreviations[expr] != null) {
          expr = FirstEdition.spellsAbbreviations[expr];
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
