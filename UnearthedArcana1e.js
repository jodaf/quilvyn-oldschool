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

/* jshint esversion: 6 */
/* jshint forin: false */
/* jshint sub:true */
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
    (rules, UnearthedArcana1e.FEATURES, UnearthedArcana1e.LANGUAGES,
     UnearthedArcana1e.SPELLS);
  UnearthedArcana1e.identityRules
    (rules, UnearthedArcana1e.CLASSES, UnearthedArcana1e.RACES);
  UnearthedArcana1e.magicRules(rules, UnearthedArcana1e.SPELLS);
  rules.defineChoice('random', 'comeliness');
  rules.randomizeOneAttribute = UnearthedArcana1e.randomizeOneAttribute;

}

UnearthedArcana1e.VERSION = '2.3.1.0';

UnearthedArcana1e.CLASSES = {
  'Barbarian':
    'Require=' +
      '"alignment !~ \'Lawful\'","race == \'Human\'","strength >= 15",' +
      '"constitution >= 15","dexterity >= 14","wisdom <= 16" ' +
    'HitDie=d10,8,4 Attack=0,1,1,- WeaponProficiency=4,2,2 ' +
    'Breath=17,1.5,2 Death=14,1.5,2 Petrification=15,1.5,2 Spell=17,1.5,2 Wand=16,1.5,2 ' +
    'Features=' +
      '"Armor Proficiency (All)","Shield Proficiency (All)",' +
      '"Fighting The Unskilled","Animal Handling","Back Protection",' +
      '"Arcane Aversion","Barbarian Armor Bonus","Barbarian Hit Point Bonus",' +
      '"Barbarian Resistance","Climbing","Detect Magic",Fast,"First Aid",' +
      '"Hide In Natural Surroundings",Horsemanship,Leadership,' +
      '"Leaping And Springing","Long Distance Signaling","Outdoor Craft",' +
      'Running,"Small Craft","Snare Building","Sound Imitation",Surprise,' +
      'Survival,Tracking,"4:Irresistible Assault" ' +
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
      '"Continuous Training","Deadly Lancer",Diehard,Equestrian,' +
      '"Fear Immunity","Fighting The Unskilled","Lance Expertise",' +
      '"Mental Resistance","Mount Knowledge","Mounted Combatant",' +
      '"2:Extra Attacks","3:Quick Mount","3:Sword Expertise",' +
      '"4:Unicorn Rider","5:Fast Ride","5:Mace Expertise","7:Special Mount" ' +
    'Experience=' +
      '0,2.5,5,10,18.5,37,85,140,220,300,600,900,1200,1500,1800,2100,2400,' +
      '2700,3000,3300,3600,3900,4200,4500,4800,5100,5400,5700,6000',
  'Druid':
    OldSchool.CLASSES.Druid
      .replace('Features=',
      'Features=' +
        '"16:Poison Immunity","16:Extra Longevity","16:Vigorous Health",' +
        '"16:Alter Appearance",17:Hibernate,"17:Planar Travel",' +
        '"17:Summon Elemental",'
      ) + ' ' +
      'Experience=' +
        '0,2,4,7.5,12.5,20,35,60,90,125,200,300,750,1500,3000,3500,4000,' +
        '4500,5000,5500,6000,6500,7000 ',
  'Paladin':
    OldSchool.CLASSES.Paladin
      .replace('Features=',
      'Features=' +
        '"Armor Proficiency (All)","Shield Proficiency (All)",' +
        '"Continuous Training","Deadly Lancer",Diehard,Equestrian,' +
        '"Fear Immunity","Fighting The Unskilled","Lance Expertise",' +
        '"Mental Resistance","Mount Knowledge","Mounted Combatant",' +
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
      ).replace(/,"(\d+:)?Read Scrolls"/, '') + ' ' +
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
  'Animal Handling':'Section=skill Note="May handle and domesticate wild dogs"',
  'Arcane Aversion':
    'Section=feature ' +
    'Note="Despises arcane magic; seeks to destroy magic items"',
  'Back Protection':
    'Section=combat ' +
    'Note="%{levels.Barbarian*5}% chance of noticing attacks from behind"',
  'Barbarian Armor Bonus':'Section=combat Note="-%V AC"',
  'Barbarian Hit Point Bonus':'Section=combat Note="+%V HP"',
  'Barbarian Resistance':
    'Section=save ' +
    'Note="+4 vs. poison/+3 Petrification/+3 Death/+3 vs. polymorph/+2 Wand/+2 Breath/+%1 Spell"',
  'Bonus Thief-Acrobat Experience':
    'Section=ability Note="10% added to awarded experience"',
  'Climbing':
    'Section=skill Note="Climb cliffs and trees; other surfaces with practice"',
  'Continuous Training':
    'Section=ability ' +
    'Note="Gains d100/100 %1strength, dexterity, and constitution at 1st level, 2d10/100 additional at each subsequent level"',
  'Deadly Lancer':
    'Section=combat Note="+%V lance damage when mounted, +1 dismounted"',
  'Detect Magic':
    'Section=save ' +
    'Note="%{levels.Barbarian*5<?75}% chance of detecting illusions, %{levels.Barbarian*5+20<?90}% other magic"',
  'Diehard':'Section=combat Note="Remains conscious at negative HP"',
  'Equestrian':
    'Section=skill ' +
    'Note="%V% chance of being unsaddled or being injured when mount falls"',
  'Extra Attacks':
    'Section=combat Note="+0.5 attacks/rd with expertise weapons"',
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
  'Irresistible Assault':
    'Section=combat ' +
    'Note="Attacks bypass +%{(levels.Barbarian-2)//2<?5} magic weapon requirement"',
  'Lance Expertise':
    'Section=combat ' +
    'Note="+%1 attack with lance when mounted, or parry for foe -%2 attack"',
  'Leadership':
    'Section=ability Note="+%{levels.Barbarian} Charisma (other barbarians)"',
  'Leaping And Springing':
    'Section=skill ' +
    'Note="May jump 10\' forward, 3\' up or back, from standing start; d6+15\' forward, d4/2+4\' up, with running start"',
  'Long Distance Signaling':
    'Section=skill Note="May send messages over distances"',
  'Mace Expertise':
    'Section=combat ' +
    'Note="+%1 attack with choice of horseman\'s mace, flail, or military pick, or parry for foe -%2 attack"',
  'Mental Resistance':
    'Section=save Note="90% resistance to mental attacks, +2 vs. illusions"',
  'Mount Knowledge':'Section=feature Note="Knows basic worth of mounts"',
  'Mounted Combatant':'Section=combat Note="+1 attack from mount"',
  'Outdoor Craft':
    'Section=skill ' +
    'Note="Determine Direction and Druid\'s Knowledge features; able to Predict Weather as with the spell"',
  'Poison Immunity':'Section=save Note="Immunity to natural poisons"',
  'Planar Travel':'Section=magic Note="May move to %V 1/dy"',
  'Running':'Section=ability Note="May move at dbl speed for three days"',
  'Quick Mount':'Section=skill Note="Can vault into saddle and ride in 1 seg"',
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
    'Note="+%1 attack with choice of broad sword, long sword, or scimitar, or parry for foe -%2 attack"',
  'Thief-Acrobat Skills':
    'Section=skill ' +
    'Note="Tightrope Walking, Pole Vaulting, High Jumping, Standing Broad Jumping, Running Broad Jumping, Tumbling Attack, Tumbling Evasion, Tumbling Falling"',
  // Override OSRIC Tracking defn
  'Tracking':
    'Section=feature ' +
    'Note="%{((levels.Ranger||0)+(levels.Barbarian||0))*10+10<?110}% base change to track creature"',
  'Unicorn Rider':'Section=skill Note="Can ride a unicorn"',
  'Vigorous Health':'Section=feature Note="Has full health and vigor"',

  // Race
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
  'Resist Magical Effects':'Section=save Note="+2 vs. magic"',
  'Sharp Eye':'Section=combat Note="Surprised 1in8 in less than full light"',
  'Shielded':'Section=magic Note="Continuous self <i>Non-Detection</i> effect"',
  'Stone Camouflage':
    'Section=feature Note="60% chance of hiding against natural stone"',
  'Trapper':'Section=skill Note="May set traps with 90% success"',
  'Two-Weapon Fighter':
    'Section=combat ' +
    'Note="May fight using a weapon in each hand without penalty"',
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
      '"Detect Construction","Detect Secret Doors","Detect Sliding",' +
      '"Detect Traps","Determine Depth","Drow Magic","Extended Infravision",' +
      'Fast,"Light Sensitivity","Resist Charm","Resist Magical Effects",' +
      '"Resist Sleep","Sharp Eye",Stealthy,"Two-Weapon Fighter" '+
    'Languages=' +
      'Common,Undercommon,Elf,Gnome,"Drow Sign"',
  'Deep Gnome':
    'Require=' +
      '"constitution >= 8","intelligence >= 7","strength >= 6" ' +
    'Features=' +
      '"Deep Gnome Enmity","Deep Gnome Magic","Deep Gnome Resistance",' +
      '"Detect Hazard","Detect Slope","Determine Depth",' +
      '"Determine Direction","Extended Infravision","Extremely Stealthy",' +
      '"Gnome Dodge","Light Blindness",Shielded,Slow,"Stone Camouflage" ' +
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

UnearthedArcana1e.SPELLS = {

  'Ceremony':
    'School=Evocation ' +
    'Level=C1,D1 ' +
    'Description="Hour-long rite conveys various effects on touched"',
  'Combine':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Combine'] + ' ' +
    'Level=C1',
  'Endure Cold/Endure Heat':
    'School=Alteration ' +
    'Level=C1 ' +
    'Description="Touched comfortable in -30F/130F for $L9 tn"',
  'Invisibility To Undead':
    'School=Illusion ' +
    'Level=C1 ' +
    'Description="Touched becomes undetectable by undead up to 4 HD (Save neg) for 6 rd"',
  'Magic Stone':
    'School=Alteration ' +
    'Level=C1 ' +
    'Description="Touched stone becomes +1 weapon w/range 2/3/4, does 1 HP and breaks casting concentration (Spell neg)"',
  'Penetrate Disguise':
    'School=Divination ' +
    'Level=C1 ' +
    'Description="R120\' Self sees through non-magical disguise (Save neg) for 1 rd"',
  'Portent':
    'School=Divination ' +
    'Level=C1 ' +
    'Description="Self notes increment or decrement to touched\'s future attack or save roll"',
  'Precipitation':
    'School=Alteration ' +
    'Level=C1,D1,M1 ' +
    'Description="R$L10\' Causes 3\' diameter light rain for $L seg"',
  'Aid':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Aid'] + ' ' +
    'Level=C2',
  'Detect Life':
    'School=Divination ' +
    'Level=C2 ' +
    'Description="R$L100\' Self determine whether target is alive for 5 rd"',
  'Dust Devil':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Dust Devil'] + ' ' +
    'Level=C2',
  'Enthrall':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Enthrall']
    .replace('3 HD', '4 HD/Wisdom 15') + ' ' +
    'Level=C2',
  'Holy Symbol':
    'School=Conjuration ' +
    'Level=C2 ' +
    'Description="Makes touched into a holy symbol"',
  'Messenger':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Messenger']
    .replace('dy', 'hr') + ' ' +
    'Level=C2',
  'Withdraw':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Withdraw'] + ' ' +
    'Level=C2',
  'Wyvern Watch':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Wyvern Watch'] + ' ' +
    'Level=C2 ' +
    'Description="R30\' Paralyzes trespassers in 10\' radius for $L rd (Save neg) for 8 hr"',
  'Cloudburst':
    'School=Alteration ' +
    'Level=C3,D3,M3 ' +
    'Description="R$L10\' Causes 3\' diameter heavy rain for 1 rd"',
  "Death's Door":
    'School=Alteration ' +
    'Level=C3 ' +
    'Description="Raises touched to 0 HP for $L hr"',
  'Flame Walk':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Flame Walk']
    .replace('rd', 'tn') + ' ' +
    'Level=C3',
  'Magical Vestment':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Magical Vestment'] + ' ' +
    'School=Alteration ' +
    'Level=C3 ' +
    'Description="Touched vestment gives AC ${5-(lvl//4)} for $L6 rd"',
  'Meld Into Stone':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Meld Into Stone'] + ' ' +
    'Level=C3',
  'Negative Plane Protection':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Negative Plane Protection'] + ' ' +
    'Level=C3',
  'Remove Paralysis':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Remove Paralysis'] + ' ' +
    'Level=C3',
  'Water Walk':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Water Walk'] + ' ' +
    'Level=C3',
  'Abjure':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Abjure'] + ' ' +
    'School=Alteration ' +
    'Level=C4',
  'Cloak Of Fear':
    'School=Illusion ' +
    'Level=C4 ' +
    'Description="30\' radius causes creatures to run away (Spell Save neg) for 6 rd w/in $L tn"',
  'Giant Insect':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Giant Insect'] + ' ' +
    'Level=C4 ' +
    'Description="R20\' 1 - 6 insects become ${lvl<10?3:lvl<13?4:6} HD giant versions for $L2 rd"',
  'Imbue With Spell Ability':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Imbue With Spell Ability'] + ' ' +
    'Level=C4',
  'Spell Immunity':
    OSRIC.SPELLS['Spell Immunity']
    .replace('Level=', 'Level=C4,') + ' ' +
    'Description="Touched immune to named spell for $L tn"',
  'Spike Growth':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Spike Growth'] + ' ' +
    'Level=C4,D3 ' +
    'Description="R60\' Spikes on vegetation in $L10\' sq inflict 2x1d4 HP each 10\' movement (Requires successful attack)"',
  'Air Walk':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Air Walk'] + ' ' +
    'Level=C5',
  'Animate Dead Monsters':
    'School=Necromancy ' +
    'Level=C5 ' +
    'Description="R10\' %{lvl//2} humanoid or semi-humanoid corpses animate and obey self"',
  'Golem':
    'School=Alteration ' +
    'Level=C5 ' +
    'Description="R10\' Construct made of straw%{lvl>10?\', rope\':\'\'}%{lvl>12?\', leather\':\'\'}%{lvl>14?\', wood\':\'\'} animates and obeys self"',
  'Magic Font':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Magic Font']
    .replace('hr', 'rd') + ' ' +
    'School=Divination ' +
    'Level=C5',
  'Rainbow':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Rainbow'] + ' ' +
    'Level=C5 ' +
    'Description="Uses existing rainbow to create +3 bow, $L\' wide bridge, 10\' radius elevator, or potion font for $L rd"',
  'Spike Stones':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Spike Stones']
    .replace('R30', 'R$R') + ' ' +
    'Range=30 ' +
    'Level=C5,D5',
  'Forbiddance':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Forbiddance'] + ' ' +
    'Level=C6',
  "Heroes' Feast":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Heroes' Feast"] + ' ' +
    'School=Abjuration ' +
    'Level=C6',
  'Exaction':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Exaction'] + ' ' +
    'Level=C7',
  'Succor':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Succor'] + ' ' +
    'Level=C7,M9',
  'Detect Balance':
    'School=Divination ' +
    'Level=D1 ' +
    'Description="R60\' Self detects non-neutral alignment in target object or creature"',
  'Detect Poison':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Detect Poison']
    .replace(/for\s\+\srd/, 'for $L rd') + ' ' +
    'School=Divination ' +
    'Level=D1',
  'Flame Blade':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Flame Blade']
    .replace(/for\s\s+\srd/, 'for $L rd') + ' ' +
    'Level=D2',
  'Goodberry':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Goodberry'] + ' ' +
    'Level=D2',
  'Reflecting Pool':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Reflecting Pool'] + ' ' +
    'School=Evocation ' +
    'Level=D2',
  'Slow Poison':
    OSRIC.SPELLS['Slow Poison']
    .replace('Level=', 'Level=D2,') + ' ' +
    'Duration="$L hr"',
  'Know Alignment':
    OSRIC.SPELLS['Know Alignment']
    .replace('10 touched', '5 touched')
    .replace('1 tn', '5 rd')
    .replace('Level=', 'Level=D3,M2,'),
  'Spike Growth D3':
    'Range=60',
  'Starshine':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Starshine'] + ' ' +
    'Level=D3',
  'Moonbeam':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Moonbeam']
    .replace(/Description=\S+/, 'Description="$L10\'')
    .replace("5' radius", "10\\' diameter") + ' ' +
    'Level=D5',
  'Liveoak':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Liveoak'] + ' ' +
    'Level=D6',
  'Transmute Water To Dust':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Transmute Water To Dust'] + ' ' +
    'Level=D6,M6',
  'Changestaff':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Changestaff'] + ' ' +
    'Level=D7',
  'Sunray':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Sunray']
    .replace(/5.*radius/, "10' diameter")
    .replace(/2 - 5/, '1') + ' ' +
    'Level=D7',
  'Chill':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Target 1\' cu drops 40F for 1/2 seg"',
  'Clean':
    'School=Abjuration ' +
    'Level=M0 ' +
    'Description="R10\' Removes dirt from 4 sq yd"',
  'Color':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Adds color to 1 cu yd object"',
  'Dampen':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Moistens 1 cu yd"',
  'Dry':
    'School=Abjuration ' +
    'Level=M0 ' +
    'Description="R10\' Removes dampness from 1 cu yd"',
  'Dust':
    'School=Abjuration ' +
    'Level=M0 ' +
    'Description="R10\' Remove dust from 10\' radius"',
  'Exterminate':
    'School=Abjuration ' +
    'Level=M0 ' +
    'Description="R10\' Kills target small pest"',
  'Flavor':
    'School=Enchantment ' +
    'Level=M0 ' +
    'Description="R10\' Improves taste of target object"',
  'Freshen':
    'School=Enchantment ' +
    'Level=M0 ' +
    'Description="R10\' Removes staleness or wilting from target"',
  'Gather':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Tidies 1 sq yd"',
  'Polish':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Smooths and brings luster to target object"',
  'Salt':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Sprinkles salt on target"',
  'Shine':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Removes rust or corrosion from target"',
  'Spice':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Adds spice taste to target"',
  'Sprout':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Accellerates plant growth in 1 cu yd"',
  'Stitch':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Sews seems in target cloth or leather object"',
  'Sweeten':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Adds sweetener taste to target"',
  'Tie':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Causes target to wrap into a tight knot"',
  'Warm':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Target 1\' cu rises 40F for 1/2 seg"',
  'Wrap':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Creates wrapping around 1 cu yd target"',
  'Curdle':
    'School=Enchantment ' +
    'Level=M0 ' +
    'Description="R10\' Hastens spoilage of target object"',
  'Dirty':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Adds dirt to 4 sq yd"',
  'Dusty':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Addes dust to 10\' radius"',
  'Hairy':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Hair or fuzz on target grows 2d6\\""',
  'Knot':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Causes target to wrap into a knot that is difficult to untie"',
  'Ravel':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Undoes seam on target object"',
  'Sour':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Adds sour taste to target"',
  'Spill':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Dumps contents of target container"',
  'Tangle':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Causes target material to become entangled"',
  'Tarnish':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Add rust or corrosion to target object"',
  'Untie':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Removes knot from target object"',
  'Wilt':
    'School=Enchantment ' +
    'Level=M0 ' +
    'Description="R10\' Adds staleness or wilting to target"',
  'Change':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Changes animal or vegetable object to similar object for 1 tn+"',
  'Distract':
    'School=Enchantment ' +
    'Level=M0 ' +
    'Description="R10\' Redirects viewers\' attention (Save neg) for 1 seg"',
  'Hide':
    'School=Illusion ' +
    'Level=M0 ' +
    'Description="R10\' Makes target invisible for up to 1 tn"',
  'Mute':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Alters shape of mineral target for 1 rd"',
  'Palm':
    'School=Illusion ' +
    'Level=M0 ' +
    'Description="R10\' Makes target invisilble and creates illusionary duplicate for 1 seg"',
  'Present':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R2\' Brings target object to hand"',
  'Belch':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Target burps (Save silent)"',
  'Blink':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Target blinks (Save wink)"',
  'Cough':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Target coughs for 1d3 sec (Save brief cough)"',
  'Giggle':
    'School=Enchantment ' +
    'Level=M0 ' +
    'Description="R10\' Target laughs for 2 - 3 sec (Save brief laugh)"',
  'Nod':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Target nodes (Save neg)"',
  'Scratch':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Target scratches itch (Save neg)"',
  'Sneeze':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Target sneezes (Save neg)"',
  'Twitch':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Target twitches (Save neg)"',
  'Wink':
    'School=Enchantment ' +
    'Level=M0 ' +
    'Description="R10\' Target winks repeatedly (Save once)"',
  'Yawn':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Target yawns and becomes vulnerable to <i>Sleep/i> (Save neg) for 1 rd"',
  'Bee':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description="R10\' Bee appears and stings target"',
  'Bluelight':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description="R10\' Creates 3\\" sphere that dimly lights 5\' radius"',
  'Bug':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description="R10\' Crawling insect appears and attacks target"',
  'Firefinger':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="5\' flame jet ignites flammable objects"',
  'Gnats':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description="R10\' Cloud of gnats appears and distracts target (Save vs. poison neg)"',
  'Mouse':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description="R10\' Mouse appears"',
  'Smokepuff':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Creates smoke puff"',
  'Spider':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description="R10\' Spider (5% poisonous) appears and attacks target"',
  'Tweak':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description="R10\' Creates thumb and forefinger that tugs on target"',
  'Unlock':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description="R10\' Unlocks simple lock"',
  'Creak':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Creates sound of squeaking hinges or floorboards for a few secs"',
  'Footfall':
    'School=Illusion ' +
    'Level=M0 ' +
    'Description="R10\' Creates sound of walking for 10\'"',
  'Groan':
    'School=Illusion ' +
    'Level=M0 ' +
    'Description="R10\' Creates sound of wracking cry"',
  'Moan':
    'School=Illusion ' +
    'Level=M0 ' +
    'Description="R10\' Creates sound of moan"',
  'Rattle':
    'School=Illusion ' +
    'Level=M0 ' +
    'Description="R10\' Creates rattling sound for 2 sec"',
  'Tap':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Creates sound of 1 - 3 taps"',
  'Thump':
    'School=Illusion ' +
    'Level=M0 ' +
    'Description="R10\' Creates sound of falling object"',
  'Whistle':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Creates sound of wind whistling"',
  'Alarm':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Alarm'] + ' ' +
    'School=Evocation ' +
    'Level=M1 ' +
    'Description="R10\' Entry into $L20\' sq triggers audible alarm for 2d4 + $L tn"',
  'Armor':
    'School=Conjuration ' +
    'Level=M1 ' +
    'Description="Touched gains +1 AC (min 8) until touched takes $Lplus8 HP"',
  'Firewater':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description="Transmutes $L pints of water into flammable liquid for 1 rd"',
  'Grease':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Grease']
    .replace(/ for.*rd/, '') + ' ' +
    'School=Evocation ' +
    'Level=M1',
  'Melt':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description="R30\' Melts up to 2 cu yd ice or snow or inflicts $L2 HP on cold creatures (Save half)"',
  'Mount':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Mount'] + ' ' +
    'Level=M1',
  'Run':
    'School=Enchantment ' +
    'Level=M1 ' +
    'Description="Touched can run 1d4 + 4 hr without tiring, must rest equal time afterwards"',
  'Taunt':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Taunt'] + ' ' +
    'Level=M1 ' +
    'Description="R30\' $L2 HD of targets attack caster"',
  'Wizard Mark':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Wizard Mark'] + ' ' +
    'Level=M1',
  'Bind':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Bind'] + ' ' +
    'School=Alteration ' +
    'Level=M2',
  'Deeppockets':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Deeppockets']
    .replace('Lplus12', 'Lplus4') + ' ' +
    'Level=M2',
  'Flaming Sphere':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Flaming Sphere'] + ' ' +
    'School=Alteration ' +
    'Level=M2',
  'Irritation':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Irritation']
    .replace(/1 - 4.*radius/, 'Target') + ' ' +
    'Level=M2',
  "Melf's Acid Arrow":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Melf's Acid Arrow"]
    .replace('180', '30') + ' ' +
    'School=Evocation ' +
    'Level=M2',
  'Preserve':
    'School=Abjuration ' +
    'Level=M2 ' +
    'Description="Preserves touched material for later use"',
  'Protection From Cantrips':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Protection From Cantrips']
    .replace('Lplus5 hr', 'L dy') + ' ' +
    'Level=M2',
  "Tasha's Uncontrollable Hideous Laughter":
    'School=Alteration ' +
    'Level=M2 ' +
    'Description="R30\' Target suffers -2 attack and damage for 2 rd (Save neg)"',
  'Vocalize':
    'School=Alteration ' +
    'Level=M2 ' +
    'Description="Touched can cast without vocal component for 5 rd"',
  'Whip':
    'School=Evocation ' +
    'Level=M2 ' +
    'Description="R10\' Remote whip repels animals (Save neg) for $L rd"',
  'Zephyr':
    'School=Evocation ' +
    'Level=M2 ' +
    'Description="Creates 10\' x ${lvl//2*10}\' gentle breeze for 1 seg"',
  'Detect Illusion':
    OSRIC.SPELLS['Detect Illusion'].replace('Level=', 'Level=M3,'),
  'Detect Illusion M3':
    'Duration="$Lplus2 rd"',
  'Item':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Item'] + ' ' +
    'Level=M3',
  'Material':
    'School=Evocation ' +
    'Level=M3 ' +
    'Description="R10\' Creates $L\' cu of raw materials"',
  "Melf's Minute Meteors":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Melf's Minute Meteors"]
    .replace('L10plus70', 'L10') + ' ' +
    'Level=M3',
  'Secret Page':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Secret Page'] + ' ' +
    'Level=M3',
  'Sepia Snake Sigil':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Sepia Snake Sigil']
    .replace(/for.*dy/, 'until released') + ' ' +
    'Level=M3',
  'Wind Wall':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Wind Wall']
    .replace(/L10.x5/, "10\'x%{lvl//2}") + ' ' +
    'Level=M3',
  'Dispel Illusion':
    OSRIC.SPELLS['Dispel Illusion'].replace('Level=', 'Level=M4,'),
  'Dispel Illusion M4':
    'Range="%{lvl//2*10}\'"',
  "Evard's Black Tentacles":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Evard's Black Tentacles"]
    .replace('in 30', 'in $L30')
    .replace('hr', 'rd') + ' ' +
    'Level=M4',
  "Leomund's Secure Shelter":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Leomund's Secure Shelter"]
   .replace(/1d4.*hr/, '$L hr') + ' ' +
    'Level=M4',
  'Magic Mirror':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Magic Mirror'] + ' ' +
    'Level=M4,I5',
  "Otiluke's Resilient Sphere":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Otiluke's Resilient Sphere"] + ' ' +
    'Level=M4',
  'Shout':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Shout'] + ' ' +
    'Level=M4',
  'Stoneskin':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Stoneskin']
    .replace(/next.*blows/, 'next blow') + ' ' +
    'Level=M4',
  'Ultravision':
    'School=Alteration ' +
    'Level=M4,I2 ' +
    'Description="Touched sees 100 yd clearly at night"',
  'Avoidance':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Avoidance'] + ' ' +
    'Level=M5',
  'Dismissal':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Dismissal'] + ' ' +
    'Level=M5',
  'Dolor':
    'School=Enchantment ' +
    'Level=M5 ' +
    'Description="R10\' Target hostile extraplanar creature suffers penalty to save vs. command and non-offensive spells for 3 rd"',
  'Fabricate':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Fabricate'] + ' ' +
    'Level=M5',
  "Leomund's Lamentable Belabourment":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Leomund's Lamentable Belaborment"] + ' ' + // spelling change
    'Level=M5',
  'Sending':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Sending']
    .replace('25-word', '$L-word') + ' ' +
    'Level=M5',
  'Chain Lightning':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Chain Lightning'] + ' ' +
    'Level=M6',
  'Contingency':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Contingency'] + ' ' +
    'Level=M6',
  'Ensnarement':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Ensnarement'] + ' ' +
    'Level=M6',
  'Eyebite':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Eyebite'] + ' ' +
    'Level=M6',
  "Mordenkainen's Lucubration":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Mordenkainen's Lucubration"] + ' ' +
    'Level=M6',
  'Banishment':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Banishment'] + ' ' +
    'Level=M7',
  'Forcecage':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Forcecage'] + ' ' +
    'Level=M7',
  "Mordenkainen's Magnificent Mansion":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Mordenkainen's Magnificent Mansion"] + ' ' +
    'Level=M7',
  'Sequester':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Sequester'] + ' ' +
    'Level=M7',
  'Teleport Without Error':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Teleport Without Error'] + ' ' +
    'Level=M7',
  'Torment':
    'School=Evocation ' +
    'Level=M7 ' +
    'Description="FILL"',
  'Truename':
    'School=Enchantment ' +
    'Level=M7 ' +
    'Description="FILL"',
  'Volley':
    'School=Abjuration ' +
    'Level=M7 ' +
    'Description="FILL"',
  'Binding':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Binding'] + ' ' +
    'Level=M8',
  'Demand':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Demand'] + ' ' +
    'Level=M8',
  "Otiluke's Telekinetic Sphere":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Otiluke's Telekinetic Sphere"] + ' ' +
    'Level=M8',
  'Sink':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Sink'] + ' ' +
    'Level=M8',
  'Crystalbrittle':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Crystalbrittle'] + ' ' +
    'Level=M9',
  'Energy Drain':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Energy Drain'] + ' ' +
    'Level=M9',
  "Mordenkainen's Disjunction":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Mordenkainen's Disjunction"] + ' ' +
    'Level=M9',
  'Colored Lights':
    'School=Alteration ' +
    'Level=I0 ' +
    'Description="FILL"',
  'Dim':
    'School=Alteration ' +
    'Level=I0 ' +
    'Description="FILL"',
  'Haze':
    'School=Alteration ' +
    'Level=I0 ' +
    'Description="FILL"',
  'Mask':
    'School=Illusion ' +
    'Level=I0 ' +
    'Description="FILL"',
  'Mirage':
    'School=Illusion ' +
    'Level=I0 ' +
    'Description="FILL"',
  'Noise':
    'School=Illusion ' +
    'Level=I0 ' +
    'Description="FILL"',
  'Rainbow Cantrip':
    'School=Alteration ' +
    'Level=I0 ' +
    'Description="FILL"',
  "Two-D'lusion":
    'School=Illusion ' +
    'Level=I0 ' +
    'Description="FILL"',
  'Chromatic Orb':
    'School=Alteration ' +
    'Level=I1 ' +
    'Description="FILL"',
  'Phantom Armor':
    'School=Alteration ' +
    'Level=I1 ' +
    'Description="FILL"',
  'Read Illusionist Magic':
    'School=Divination ' +
    'Level=I1 ' +
    'Description="FILL"',
  'Spook':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Spook'] + ' ' +
    'Level=I1',
  'Alter Self':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Alter Self'] + ' ' +
    'Level=I2',
  'Fascinate':
    'School=Illusion ' +
    'Level=I2 ' +
    'Description="FILL"',
  'Whispering Wind':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Whispering Wind'] + ' ' +
    'Level=I2',
  'Delude':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Delude'] + ' ' +
    'Level=I3',
  'Phantom Steed':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Phantom Steed'] + ' ' +
    'Level=I3',
  'Phantom Wind':
    'School=Alteration ' +
    'Level=I3 ' +
    'Description="FILL"',
  'Wraithform':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Wraithform'] + ' ' +
    'Level=I3',
  'Dispel Magic':
    OSRIC.SPELLS['Dispel Magic'].replace('Level=', 'Level=I4,'),
  'Rainbow Pattern':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Rainbow Pattern'] + ' ' +
    'Level=I4',
  'Solid Fog':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Solid Fog'] + ' ' +
    'Level=I4',
  'Vacancy':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Vacancy'] + ' ' +
    'School=Alteration ' +
    'Level=I4',
  'Advanced Illusion':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Advanced Illusion'] + ' ' +
    'Level=I5',
  'Dream':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Dream'] + ' ' +
    'School=Alteration ' +
    'Level=I5',
  'Tempus Fugit':
    'School=Illusion ' +
    'Level=I5 ' +
    'Description="FILL"',
  'Death Fog':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Death Fog'] + ' ' +
    'Level=I6',
  'Mislead':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Mislead'] + ' ' +
    'Level=I6',
  'Phantasmagoria':
    'School=Illusion ' +
    'Level=I6 ' +
    'Description="FILL"',
  'Mirage Arcane':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Mirage Arcana'] + ' ' +
    'Level=I6',
  'Shadow Walk':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Shadow Walk'] + ' ' +
    'Level=I7',
  'Weird':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Weird'] + ' ' +
    'School=Evocation ' +
    'Level=I7'
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

/* Defines rules related to magic use. */
UnearthedArcana1e.magicRules = function(rules, spells) {
  OldSchool.magicRules(rules, {}, spells);
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
    rules.defineRule('classBarbarianBreathSaveAdjustment',
      classLevel, '=', 'source>=17 ? -2 : -Math.floor((source - 1) / 4)'
    );
    rules.defineRule('classBarbarianSaveAdjustment',
      classLevel, '=', 'source<17 ? null : source>18 ? 2 : 1'
    );
    rules.defineRule('combatNotes.barbarianArmorBonus',
      'armor', '?', 'source.match(/None|^Leather|Elfin Chain/)',
      'dexterity', '=', 'source>=15 ? source - 14 : null'
    );
    rules.defineRule('combatNotes.barbarianHitPointBonus',
      'constitution', '=', 'source - 14',
      classLevel, '*', 'Math.min(source, 8)'
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
    rules.defineRule(name.toLowerCase() + 'Features.Mounted Combatant',
      'race', '?', 'source =~ /Human/'
    );
    rules.defineRule(name.toLowerCase() + 'Features.Unicorn Rider',
      'gender', '?', 'source == "Female"',
      'race', '?', 'source.match(/(^|\\s)Elf/)'
    );
    rules.defineRule('combatNotes.deadlyLancer', classLevel, '+=', null);
    rules.defineRule('combatNotes.lanceExpertise.1',
      classLevel, '=', 'Math.floor((source + 5) / 6)'
    );
    rules.defineRule('combatNotes.lanceExpertise.2',
      'combatNotes.lanceExpertise.1', '=', null,
      'combatNotes.strengthAttackAdjustment', '+', null
    );
    rules.defineRule('combatNotes.maceExpertise.1',
      classLevel, '=', 'Math.floor((source + 1) / 6)'
    );
    rules.defineRule('combatNotes.maceExpertise.2',
      'combatNotes.maceExpertise.1', '=', null,
      'combatNotes.strengthAttackAdjustment', '+', null
    );
    rules.defineRule('combatNotes.swordExpertise.1',
      classLevel, '=', 'Math.floor((source + 3) / 6)'
    );
    rules.defineRule('combatNotes.swordExpertise.2',
      'combatNotes.swordExpertise.1', '=', null,
      'combatNotes.strengthAttackAdjustment', '+', null
    );
    rules.defineRule('skillNotes.equestrian', classLevel, '=', '16 - source');
    rules.defineRule('skillNotes.specialMount',
      classLevel, '=', '"pegasus" + (source>=11 ? ", hippogriff, or griffin" : source>9 ? " or hippogriff" : "")'
    );
    rules.defineRule('warriorLevel', classLevel, '+', null);
    if(name == 'Paladin') {
      rules.defineRule
        ('abilityNotes.continuousTraining.1', classLevel, '=', '"charisma, "');
      rules.defineRule('attacksPerRound',
        classLevel, '+', 'source<7?null : source<13?0.5 : source<19?1 : 1.5'
      );
      rules.defineRule
        ('paladinFeatures.Bonus Paladin Experience', classLevel, 'v', '0');
      rules.defineRule('paladinFeatures.Extra Attacks',
        classLevel, '=', 'source==1||source==7||source==13||source>18 ? null : 1'
      );
    } else {
      rules.defineRule
        ('abilityNotes.continuousTraining.1', classLevel, '=', '""');
      rules.defineRule('attacksPerRound',
        classLevel, '+', 'source<6?null : source<11?0.5 : source<16?1 : 1.5'
      );
      rules.defineRule('classCavalierBreathSaveAdjustment',
        classLevel, '=', 'source>=17 ? -2 : -Math.floor((source - 1) / 4)'
      );
      rules.defineRule('classCavalierSaveAdjustment',
        classLevel, '=', 'source<17 ? null : source>18 ? 2 : 1'
      );
      rules.defineRule('cavalierFeatures.Extra Attacks',
        classLevel, '=', 'source>16 ? null : 1'
      );
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
      classLevel, '=', 'source<6 ? null : Math.min(source, 20)'
    );
    rules.defineRule('skills.Tumbling Evasion',
      classLevel, '=', 'source<6 ? null : source<15 ? source * 5 - 20 : Math.min(source * 2 + 22, 60)'
    );
    rules.defineRule('skills.Tumbling Falling',
      classLevel, '=', 'Math.floor((source - 3) / 3) * 10 - (source==18||source==21||source==22 ? 10 : 0)'
    );
    rules.defineRule('skills.Tumbling Falling.1',
      classLevel, '=', 'source<6 ? null : source<15 ? (source % 3 + 1) * 25 : (((source + 1) % 4 + 1) * 20)'
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
      classLevel, '?', 'source>=6'
    );
    rules.defineRule('skillNotes.strengthSkillModifiers',
      classLevel, '?', 'source>=6',
      'strength', '=',
        '[' +
          'source>16 ? "+" + (source - 16) * .25 + "\' High Jumping" : "",' +
          'source>16 ? "+" + (source - 16) * .25 + "\' Standing Broad Jumping" : "",' +
          'source>15 ? "+" + [.5,1,2][source - 16] + "\' Running Broad Jumping" : ""' +
        '].filter(x => x != "").join("/")'
    );
    for(var skill in {'Tightrope Walking':'', 'Pole Vaulting':'', 'High Jumping':'', 'Running Broad Jumping':'', 'Standing Broad Jumping':'', 'Tumbling Attack':'', 'Tumbling Evasion':'', 'Tumbling Falling':''}) {
      rules.defineRule('skills.' + skill,
        'skillNotes.dexteritySkillModifiers.1', '+',
          'source.match(/' + skill + '/) ? source.match(/([-+][\\d\\.]+). ' + skill + '/)[1] * 1 : null',
        'skillNotes.strengthSkillModifiers', '+',
          'source.match(/' + skill + '/) ? source.match(/([-+][\\d\\.]+). ' + skill + '/)[1] * 1 : null'
      );
      rules.defineRule('skills.' + skill + (skill == 'Tumbling Falling' ? '.1' : ''),
        'skillNotes.raceSkillModifiers.1', '+',
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
      "skillNotes.raceSkillModifiers:%V%1"
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
      '"/+10% Tightrope Walking/-1\' Running Broad Jumping/+5% Tumbling Evasion/+5% Tumbling Falling"'
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
  } else if(name == 'Dwarf') {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier.1', raceLevel, '=', -1);
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
    rules.defineRule
      ('abilityNotes.raceComelinessModifier.1', raceLevel, '=', -1);
    rules.defineRule('featureNotes.detectSlope', raceLevel, '+=', '75');
    rules.defineRule('featureNotes.determineDepth', raceLevel, '+=', '50');
    rules.defineRule
      ('skillNotes.intelligenceLanguageBonus', raceLevel, 'v', '2');
  } else if(name == 'Gray Elf') {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier.1', raceLevel, '=', 2);
    rules.defineRule('saveNotes.resistCharm', raceLevel, '+=', '90');
    rules.defineRule('saveNotes.resistSleep', raceLevel, '+=', '90');
  } else if(name.includes('Half-Elf')) {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier.1', raceLevel, '=', 1);
  } else if(name.includes('Half-Orc')) {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier.1', raceLevel, '=', -3);
  } else if(name == 'High Elf' || name == 'Elf') {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier.1', raceLevel, '=', 2);
  } else if(name == 'Valley Elf') {
    rules.defineRule('saveNotes.resistCharm', raceLevel, '+=', '90');
    rules.defineRule('saveNotes.resistSleep', raceLevel, '+=', '90');
  } else if(name == 'Wild Elf') {
    rules.defineRule('saveNotes.resistCharm', raceLevel, '+=', '90');
    rules.defineRule('saveNotes.resistSleep', raceLevel, '+=', '90');
    rules.defineRule('skillNotes.intelligenceLanguageBonus', raceLevel, 'v', 0);
  } else if(name == 'Wood Elf') {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier.1', raceLevel, '=', 1);
    rules.defineRule('saveNotes.resistCharm', raceLevel, '+=', '90');
    rules.defineRule('saveNotes.resistSleep', raceLevel, '+=', '90');
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
