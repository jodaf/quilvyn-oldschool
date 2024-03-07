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

/* jshint esversion: 6 */
/* jshint forin: false */
/* jshint sub:true */
/* globals OldSchool, OSRIC, QuilvynUtils */
"use strict";

/*
 * UnearthedArcana1e is a placeholder for the items and functions defined by
 * the plugin. OldSchool invokes this plugin's abilityRules and choiceRules
 * functions directly and overrides the values of ARMORS, SPELLS, etc. with the
 * values defined in this plugin.
 */
function UnearthedArcana1e(edition, rules) {
}

UnearthedArcana1e.VERSION = '2.4.1.0';

UnearthedArcana1e.ARMORS = {
  // Two sets of skills are defined for each type of armor: one for Thief-
  // Acrobat skills and one for Thief skills. OldSchool handles the computations
  // for the Thief skills, and UnearthedArcana1e.armorRulesExtra handles those
  // for Thief-Acrobat skills.
  'None':OldSchool.ARMORS['None'] + ' ' +
    'Skill=' +
      '"+5% Tightrope Walking/+1\' Pole Vaulting/+1\' High Jumping/' +
      '+1\' Running Broad Jumping/+0.5\' Standing Broad Jumping/' +
      '+2% Tumbling Attack/+4% Tumbling Evasion/+5\' Tumbling Falling",' +
      '"+10% Climb Walls/+5% Hide In Shadows/+10% Move Silently/' +
      '+5% Pick Pockets"',
  'Banded Mail':OldSchool.ARMORS['Banded Mail'] + ' ' +
    'Skill=' +
      '"-70% Tightrope Walking/-8\' Pole Vaulting/-8\' High Jumping/' +
      '-10\' Running Broad Jumping/-5\' Standing Broad Jumping/' +
      '-20% Tumbling Attack/-60% Tumbling Evasion/-30\' Tumbling Falling",' +
      '"-90% Climb Walls/-20% Find Traps/-30% Hear Noise/' +
      '-50% Hide In Shadows/-60% Move Silently/-20% Open Locks/' +
      '-50% Pick Pockets"',
  'Chain Mail':OldSchool.ARMORS['Chain Mail'] + ' ' +
    'Skill=' +
      '"-40% Tightrope Walking/-4\' Pole Vaulting/-4\' High Jumping/' +
      '-5\' Running Broad Jumping/-3\' Standing Broad Jumping/' +
      '-20% Tumbling Attack/-30% Tumbling Evasion/-10\' Tumbling Falling",' +
      '"-40% Climb Walls/-15% Find Traps/-20% Hear Noise/' +
      '-30% Hide In Shadows/-40% Move Silently/-15% Open Locks/' +
      '-40% Pick Pockets"',
  'Elven Chain Mail':OldSchool.ARMORS['Elven Chain Mail'] + ' ' +
    'Skill=' +
      '"-0.5\' Pole Vaulting/-0.5\' High Jumping/' +
      '-5% Tumbling Attack/-5% Tumbling Evasion",' +
      '"-20% Climb Walls/-5% Find Traps/-5% Hear Noise/' +
      '-10% Hide In Shadows/-10% Move Silently/-5% Open Locks/' +
      '-20% Pick Pockets"',
  'Field Plate':
    'AC=-8 Move=60 Weight=55 ' +
    'Skill=' +
      '"-100% Tightrope Walking/-18\' Pole Vaulting/-18\' High Jumping/' +
      '-20\' Running Broad Jumping/-10\' Standing Broad Jumping/' +
      '-50% Tumbling Attack/-70% Tumbling Evasion/-70\' Tumbling Falling",' +
      '"-100% Climb Walls/-80% Find Traps/-70% Hear Noise/' +
      '-110% Hide In Shadows/-100% Move Silently/-80% Open Locks/' +
      '-100% Pick Pockets"',
  'Full Plate':
    'AC=-9 Move=60 Weight=65 ' +
    'Skill=' +
      '"-100% Tightrope Walking/-18\' Pole Vaulting/-18\' High Jumping/' +
      '-20\' Running Broad Jumping/-10\' Standing Broad Jumping/' +
      '-50% Tumbling Attack/-70% Tumbling Evasion/-70\' Tumbling Falling",' +
      '"-100% Climb Walls/-80% Find Traps/-70% Hear Noise/' +
      '-110% Hide In Shadows/-100% Move Silently/-80% Open Locks/' +
      '-100% Pick Pockets"',
  'Leather':OldSchool.ARMORS['Leather'],
  'Padded':OldSchool.ARMORS['Padded'] + ' ' +
    'Skill=' +
      '"-10% Tightrope Walking/-1\' Pole Vaulting/-1\' High Jumping/' +
      '-0.5\' Running Broad Jumping/-0.5\' Standing Broad Jumping/' +
      '-10% Tumbling Attack/-10% Tumbling Evasion/-5\' Tumbling Falling",' +
      '"-30% Climb Walls/-10% Find Traps/-10% Hear Noise/' +
      '-20% Hide In Shadows/-20% Move Silently/-10% Open Locks/' +
      '-30% Pick Pockets"',
  'Plate Mail':OldSchool.ARMORS['Plate Mail'] + ' ' +
    'Skill=' +
      '"-90% Tightrope Walking/-12\' Pole Vaulting/-12\' High Jumping/' +
      '-15\' Running Broad Jumping/-7\' Standing Broad Jumping/' +
      '-30% Tumbling Attack/-70% Tumbling Evasion/-50\' Tumbling Falling",' +
      '"-99% Climb Walls/-40% Find Traps/-50% Hear Noise/' +
      '-75% Hide In Shadows/-80% Move Silently/-40% Open Locks/' +
      '-75% Pick Pockets"',
  'Ring Mail':OldSchool.ARMORS['Ring Mail'] + ' ' +
    'Skill=' +
      '"-40% Tightrope Walking/-4\' Pole Vaulting/-4\' High Jumping/' +
      '-5\' Running Broad Jumping/-3\' Standing Broad Jumping/' +
      '-20% Tumbling Attack/-30% Tumbling Evasion/-10\' Tumbling Falling",' +
      '"-40% Climb Walls/-15% Find Traps/-20% Hear Noise/' +
      '-30% Hide In Shadows/-40% Move Silently/-15% Open Locks/' +
      '-40% Pick Pockets"',
  'Scale Mail':OldSchool.ARMORS['Scale Mail'] + ' ' +
    'Skill=' +
      '"-70% Tightrope Walking/-8\' Pole Vaulting/-8\' High Jumping/' +
      '-10\' Running Broad Jumping/-5\' Standing Broad Jumping/' +
      '-20% Tumbling Attack/-60% Tumbling Evasion/-30\' Tumbling Falling",' +
      '"-90% Climb Walls/-20% Find Traps/-30% Hear Noise/' +
      '-50% Hide In Shadows/-60% Move Silently/-20% Open Locks/' +
      '-50% Pick Pockets"',
  // Splint Mail not listed in Thieves Table II or V; assume equal to Banded
  'Splint Mail':OldSchool.ARMORS['Splint Mail'] + ' ' +
    'Skill=' +
      '"-70% Tightrope Walking/-8\' Pole Vaulting/-8\' High Jumping/' +
      '-10\' Running Broad Jumping/-5\' Standing Broad Jumping/' +
      '-20% Tumbling Attack/-60% Tumbling Evasion/-30\' Tumbling Falling",' +
      '"-90% Climb Walls/-20% Find Traps/-30% Hear Noise/' +
      '-50% Hide In Shadows/-60% Move Silently/-20% Open Locks/' +
      '-50% Pick Pockets"',
  'Studded Leather':OldSchool.ARMORS['Studded Leather'] + ' ' +
    'Skill=' +
      '"-10% Tightrope Walking/-1\' Pole Vaulting/-1\' High Jumping/' +
      '-0.5\' Running Broad Jumping/-0.5\' Standing Broad Jumping/' +
      '-10% Tumbling Attack/-10% Tumbling Evasion/-5\' Tumbling Falling",' +
      '"-30% Climb Walls/-10% Find Traps/-10% Hear Noise/' +
      '-20% Hide In Shadows/-20% Move Silently/-10% Open Locks/' +
      '-30% Pick Pockets"'
};
UnearthedArcana1e.CLASSES = {
  'Barbarian':
    'Require=' +
      '"alignment !~ \'Lawful\'","race == \'Human\'","strength >= 15",' +
      '"constitution >= 15","dexterity >= 14","wisdom <= 16" ' +
    'HitDie=d12,8,4 THAC10="10 8@3 ...-6@17" ' +
    'WeaponProficiency="6 7@3 ...20@29" NonproficientPenalty=-1 ' +
    'Breath="17 16@3 13@5 12@7 9@9 8@11 5@13 4@15" ' +
    'Death="14 13@3 11@5 10@7 8@9 7@11 5@13 4@15 3@17" ' +
    'Petrification="15 14@3 12@5 11@7 9@9 8@11 6@13 5@15 4@17" ' +
    'Spell="17 16@3 14@5 13@7 11@9 10@11 8@13 7@15 6@17" ' +
    'Wand="16 15@3 13@5 12@7 10@9 9@11 7@13 6@15 5@17" ' +
    'Features=' +
      '"Armor Proficiency (All)","Shield Proficiency (All)",' +
      '"Fighting The Unskilled","Animal Handling","Back Protection",' +
      '"Arcane Aversion","Barbarian Armor Bonus","Barbarian Hit Point Bonus",' +
      '"Barbarian Resistance","Climbing","Detect Magic",Fast,"First Aid",' +
      '"Hide In Natural Surroundings",Horsemanship,Leadership,' +
      '"Leaping And Springing","Long Distance Signaling","Outdoor Craft",' +
      'Running,"Small Craft","Snare Building","Sound Imitation",Surprise,' +
      'Survival,Tracking,"4:Irresistible Assault","6:Bonus Attacks" ' +
    'Experience=' +
      '"0 6001 12001 24001 48001 80001 150001 275001 500001 1000001 1500001' +
      ' 2000001 2500001 3000001 3500001 4000001 4500001 5000001 5500001' +
      ' 6000001 6500001 7000001 7500001 8000001 8500001 9000001 9500001' +
      ' 10000001 10500001"',
  'Cavalier':
    'Require=' +
      '"alignment =~ \'Good\'","strength >= 15","dexterity >= 15",' +
      '"constitution >= 15","intelligence >= 10","wisdom >= 10" ' +
    'HitDie=d10,10,3 THAC10="10 8@3 ...-6@17" ' +
    'WeaponProficiency="3 4@3 ...17@29" NonproficientPenalty=-3 ' +
    'Breath="17 16@3 13@5 12@7 9@9 8@11 5@13 4@15" ' +
    'Death="14 13@3 11@5 10@7 8@9 7@11 5@13 4@15 3@17" ' +
    'Petrification="15 14@3 12@5 11@7 9@9 8@11 6@13 5@15 4@17" ' +
    'Spell="17 16@3 14@5 13@7 11@9 10@11 8@13 7@15 6@17" ' +
    'Wand="16 15@3 13@5 12@7 10@9 9@11 7@13 6@15 5@17" ' +
    'Features=' +
      '"Armor Proficiency (All)","Shield Proficiency (All)",' +
      '"Continuous Training","Deadly Lancer",Diehard,Equestrian,' +
      '"Bonus Expertise Attacks","Fear Immunity","Fighting The Unskilled",' +
      '"Lance Expertise","Mental Resistance","Mount Knowledge",' +
      '"race =~ \'Human\' ? 1:Mounted Combatant",' +
      '"3:Quick Mount","3:Sword Expertise",' +
      '"gender == \'Female\' && race =~ \'^Elf| Elf\' ? 4:Unicorn Rider",' +
      '"5:Fast Ride","5:Mace Expertise","6:Bonus Attacks",' +
      '"7:Special Mount" ' +
    'Experience=' +
      '"1 2501 5001 10001 18501 37001 85001 140001 220001 300001 600001' +
      ' 900001 1200001 1500001 1800001 2100001 2400001 2700001 3000001' +
      ' 3300001 3600001 3900001 4200001 4500001 4800001 5100001 5400001' +
      ' 5700001 6000001"',
  'Druid':
    OldSchool.CLASSES.Druid
      .replace('Features=',
      'Features=' +
        '"16:Poison Immunity","16:Extra Longevity","16:Vigorous Health",' +
        '"16:Alter Appearance",17:Hibernate,"17:Planar Travel",' +
        '"17:Summon Elemental",'
      ) + ' ' +
    'WeaponProficiency="2 3@6 ...6@21" ' +
    'Experience=' +
      '"0 2001 4001 7501 12501 20001 35001 60001 90001 125001 200001 300001' +
      ' 750001 1500001 3000001 3500001 4000001 4500001 5000001 5500001' +
      ' 6000001 6500001 7000001"',
  'Paladin':
    OldSchool.CLASSES.Paladin
      .replace('Features=',
      'Features=' +
        '"Armor Proficiency (All)","Shield Proficiency (All)",' +
        '"Bonus Expertise Attacks","Continuous Training","Deadly Lancer",' +
        'Diehard,Equestrian,"Fear Immunity","Fighting The Unskilled",' +
        '"Lance Expertise","Mental Resistance","Mount Knowledge",' +
        '"race =~ \'Human\' ? 1:Mounted Combatant",' +
        '"3:Quick Mount","3:Sword Expertise",' +
        '"gender == \'Female\' && race =~ \'^Elf| Elf\' ? 4:Unicorn Rider",' +
        '"5:Fast Ride","5:Mace Expertise","7:Special Mount",'
      ) + ' ' +
    'Require=' +
      '"alignment =~ \'Lawful Good\'","strength>=15","dexterity>=15",' +
      '"constitution>=15","intelligence>=10","wisdom>=13","charisma>=17" ' +
    'WeaponProficiency="3 4@3 ...17@29" NonproficientPenalty=-3',
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
      '"0 1251 2501 5001 10001 20001 45001 75001 125001 180001 250001 500001' +
      ' 750001 1000001 1250001 1500001 1750001 2000001 2250001 2500001' +
      ' 2750001 3000001 3250001 3500001 3750001 4000001 4250001 4500001' +
      ' 4750001"'
};
UnearthedArcana1e.FEATURES = {

  // Comeliness
  'Gorgeous':
    'Section=magic ' +
    'Note="May <i>Fascinate</i> creatures with wisdom %{comeliness*(comeliness<26?0.667:0.75)//1} or lower"',

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
  // Thief-Acrobat advancement in Backstab ends at level 5 (3x damage)
  'Backstab':
    'Section=combat ' +
    'Note="+4 melee attack and x%{((levels.Assassin||0)+7>?(levels.Thief||0)+7>?(($\'levels.Thief-Acrobat\'||0)+7<?12))//4<?5} damage when surprising"',
  'Barbarian Armor Bonus':
    'Section=combat ' +
    'Note="+%{armor=~\'None|^Leather|Elfin Chain Mail\'&&dexterity>=15?14-dexterity:0} Armor Class"',
  'Barbarian Hit Point Bonus':
    'Section=combat ' +
    'Note="+%{(constitution-14)*(levels.Barbarian<?8)} Hit Points"',
  'Barbarian Resistance':
    'Section=save ' +
    'Note="+4 vs. poison/+3 Petrification/+3 Death/+3 vs. polymorph/+2 Wand/+2 Breath/+%1 Spell"',
  'Bonus Expertise Attacks':
    'Section=combat ' +
    'Note="+0.5 attacks per round when using an expertise weapon"',
  'Bonus Thief-Acrobat Experience':
    'Section=ability Note="10% added to awarded experience"',
  'Climbing':
    'Section=skill ' +
    'Note="May climb cliffs and trees; may climb other surfaces with practice"',
  'Continuous Training':
    'Section=ability ' +
    'Note="Gains d100/100 %{levels.Paladin?\'charisma, \':\'\'}strength, dexterity, and constitution at 1st level and 2d10/100 additional at each subsequent level"',
  'Deadly Lancer':
    'Section=combat ' +
    'Note="+%{(levels.Cavalier||0)>?(levels.Paladin||0)} lance damage when mounted; +1 when dismounted"',
  'Detect Magic':
    'Section=save ' +
    'Note="Has a %{levels.Barbarian*5<?75}% chance of detecting illusions and a %{levels.Barbarian*5+20<?90}% chance of detecting other magic"',
  'Diehard':'Section=combat Note="Remains conscious at negative Hit Points"',
  'Equestrian':
    'Section=skill ' +
    'Note="Has a %{16-((levels.Cavalier||0)>?(levels.Paladin||0))}% chance of being unsaddled or being injured when mount falls"',
  'Extra Longevity':
    'Section=feature Note="May live an additional %{levels.Druid*10} years"',
  'Fast Ride':'Section=skill Note="May ride at +2\\" pace for 1 hr"',
  'Fear Immunity':'Section=save Note="R10\' Immune to fear"',
  'First Aid':
    'Section=skill ' +
    'Note="Binding wounds restores 1 HP and doubles healing rate; has a 10% chance of curing poison or disease"',
  'Hibernate':'Section=feature Note="May enter an ageless hibernation"',
  'Hide In Natural Surroundings':
    'Section=skill Note="May use Hide In Shadows in natural surroundings"',
  'Horsemanship':'Section=combat Note="May ride a horse into battle"',
  'Irresistible Assault':
    'Section=combat ' +
    'Note="Attacks bypass +%{(levels.Barbarian-2)//2<?5} magic weapon requirement"',
  'Lance Expertise':
    'Section=combat ' +
    'Note="+%{(((levels.Cavalier||0)>?(levels.Paladin||0))+5)//6} attack with lance when mounted; may parry for foe -%{(((levels.Cavalier||0)>?(levels.Paladin||0))+5)//6+(combatNotes.strengthAttackAdjustment||0)} attack"',
  'Leadership':
    'Section=ability Note="+%{levels.Barbarian} Charisma (other barbarians)"',
  'Leaping And Springing':
    'Section=skill ' +
    'Note="May jump 10\' forward, 3\' up, or 3\' back from a standing start and d6+15\' forward or d4/2+4\' up with a running start"',
  'Long Distance Signaling':
    'Section=skill Note="May send messages over distances"',
  'Mace Expertise':
    'Section=combat ' +
    'Note="+%{(((levels.Cavalier||0)>?(levels.Paladin||0))+1)//6} attack with choice of horseman\'s mace, flail, or military pick; may parry for foe -%{(((levels.Cavalier||0)>?(levels.Paladin||0))+1)//6+(combatNotes.strengthAttackAdjustment||0)} attack"',
  'Mental Resistance':
    'Section=save Note="90% resistance to mental attacks/+2 vs. illusions"',
  'Mount Knowledge':'Section=feature Note="Knows basic worth of mounts"',
  'Mounted Combatant':'Section=combat Note="+1 attacks from mount"',
  'Outdoor Craft':
    'Section=magic,skill ' +
    'Note=' +
      '"May use <i>Predict Weather</i> effects at will",' +
      '"Has Determine Direction and Druid\'s Knowledge features"',
  'Poison Immunity':'Section=save Note="Immune to natural poisons"',
  'Planar Travel':'Section=magic Note="May move to Plane%{levels.Druid>=18?\'s\':\'\'} of Earth%{levels.Druid>=18?\', Fire\':\'\'}%{levels.Druid>=19?\', Water\':\'\'}%{levels.Druid>=20?\', Air\':\'\'}%{levels.Druid>=21?\', Para-Elemental\':\'\'}%{levels.Druid>=22?\', Shadow\':\'\'}%{levels.Druid>=23?\', Inner Planes\':\'\'} 1/dy"',
  'Running':'Section=ability Note="May move at dbl speed for three days"',
  'Quick Mount':'Section=skill Note="May vault into saddle and ride in 1 seg"',
  'Small Craft':
    'Section=skill Note="May build and use a rowed or paddled water transport"',
  'Snare Building':
    'Section=skill Note="May construct and conceal traps and snares"',
  'Sound Imitation':'Section=skill Note="May imitate birds and animal calls"',
  'Special Mount':'Section=skill Note="May ride a pegasus%{((levels.Cavalier||0)>?(levels.Paladin||0))>=11?\', hippogriff, or griffin\':((levels.Cavalier||0)>?(levels.Paladin||0))>=9?\' or hippogriff\':\'\'}"',
  'Summon Elemental':'Section=magic Note="May conjure a water%{levels.Druid>=18?\', air\':\'\'}%{levels.Druid>=19?\', magma, smoke\':\'\'}%{levels.Druid>=20?\', ice, ooze\':\'\'} elemental 1/dy"',
  'Surprise':
    'Section=combat ' +
    'Note="Surprised 1in10 (1in20 in familiar terrain); surprises 3in6 (4in6 in familiar terrain)"',
  'Survival':'Section=skill Note="May hunt and forage in familiar terrain"',
  'Sword Expertise':
    'Section=combat ' +
    'Note="+%{(((levels.Cavalier||0)>?(levels.Paladin||0))+3)//6} attack with choice of broad sword, long sword, or scimitar; may parry for foe -%{(((levels.Cavalier||0)>?(levels.Paladin||0))+3)//6+(combatNotes.strengthAttackAdjustment||0)} attack"',
  'Thief-Acrobat Skills':
    'Section=skill ' +
    'Note="May use Tightrope Walking, Pole Vaulting, High Jumping, Standing Broad Jumping, Running Broad Jumping, Tumbling Attack, Tumbling Evasion, and Tumbling Falling"',
  // Override OSRIC Tracking defn
  'Tracking':
    'Section=feature ' +
    'Note="%{((levels.Ranger||0)+(levels.Barbarian||0))*10+10<?110}% base change to track creature"',
  'Unicorn Rider':'Section=skill Note="May ride a unicorn"',
  'Vigorous Health':'Section=feature Note="Has full health and vigor"',

  // Race
  'Animal Friend':
    'Section=magic Note="May befriend and train woodland creatures"',
  'Dark Elf Resistance':'Section=save Note="+2 vs. magic"',
  'Deep Gnome Enmity':'Section=combat Note="+1 attack vs. drow and kuo-toa"',
  'Deep Gnome Magic':'Section=magic Note="May cast <i>Blindness</i>, <i>Blur</i>, <i>Change Self</i>%{levels.Illusionist||level<6?\'\':\', <i>Conjure Elemental</i> (earth)\'} 1/dy"',
  'Deep Gnome Resistance':
    'Section=save Note="+2 vs. poison/+3 all others/Immune to illusions"',
  'Determine Depth':
    'Section=feature ' +
    'Note="%{race=~\'Dwarf|Dark Elf\'?50:60}% chance to determine approximate depth underground"',
  'Drow Magic':
    'Section=magic ' +
    'Note="May cast <i>Dancing Lights</i>, <i>Faerie Fire</i>, <i>Darkness</i> (5\' radius)%{level<4?\'\':\', <i>Detect Magic</i>, <i>Know Alignment</i>, <i>Levitate</i>\'}%{level<4||gender!=\'Female\'?\'\':\', <i>Clairvoyance</i>, <i>Detect Lie</i>, <i>Suggestion</i>, <i>Dispel Magic</i>\'} 1/dy"',
  'Extended Infravision':'Section=feature Note="120\' vision in darkness"',
  'Extremely Stealthy':'Section=combat Note="Surprised 1in12; surprises 9in10"',
  'Fast':'Section=ability Note="+30 Speed"',
  'Gray Dwarf Immunities':
    'Section=save ' +
    'Note="Immune to illusions, paralyzation, and non-natural poisons"',
  'Gray Elf Ability Adjustment':
    'Section=ability Note="+1 Dexterity/-1 Constitution/+1 Intelligence"',
  'Light Blindness':
    'Section=combat,feature ' +
    'Note=' +
      '"-1 attack in bright light",' +
      '"3\\" vision in bright light"',
  'Light Sensitivity':
    'Section=ability,combat ' +
    'Note=' +
      '"-2 Dexterity in full light",' +
      '"-2 attacks, and foes +2 saves, in full light"',
  'Resist Magical Effects':'Section=save Note="+2 vs. magic"',
  'Sharp Eye':'Section=combat Note="Surprised 1in8 in less than full light"',
  'Shielded':
    'Section=magic Note="Has a continuous self <i>Non-Detection</i> effect"',
  'Stone Camouflage':
    'Section=feature ' +
    'Note="60% chance of hiding successfully against natural stone"',
  'Trapper':'Section=skill Note="May set traps with 90% success"',
  'Two-Weapon Fighter':
    'Section=combat ' +
    'Note="May fight using a weapon in each hand without penalty"',
  'Valley Elf Ability Adjustment':
    'Section=ability Note="+1 Dexterity/-1 Constitution/+1 Intelligence"',
  'Very Stealthy':
    'Section=combat ' +
    'Note="Surprised 1in10 and surprises 3in6 in less than full light"',
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
      '"Light Sensitivity","Resist Charm","Resist Magical Effects",' +
      '"Resist Sleep","Sharp Eye",Stealthy,"Two-Weapon Fighter",' +
      '"gender==\'Female\'? 1:Fast" ' +
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
    OldSchool.RULE_EDITS['Second Edition'].Spell.Combine + ' ' +
    'Level=C1',
  'Endure Cold/Endure Heat':
    'School=Alteration ' +
    'Level=C1 ' +
    'Description="Touched remains comfortable in -30F to 130F for %{lvl*1.5} hr"',
  'Invisibility To Undead':
    'School=Illusion ' +
    'Level=C1 ' +
    'Description=' +
      '"Touched cannot be detected by undead up to 4 HD (Save neg) for 6 rd"',
  'Magic Stone':
    'School=Alteration ' +
    'Level=C1 ' +
    'Description=' +
      '"Touched stone becomes a +1 weapon w/range 2/3/4 that does 1 HP and breaks concentration (Spell neg) for 6 rd"',
  'Penetrate Disguise':
    'School=Divination ' +
    'Level=C1 ' +
    'Description=' +
      '"R120\' Self may see through non-magical disguises (Save neg) for 1 rd"',
  'Portent':
    'School=Divination ' +
    'Level=C1 ' +
    'Description=' +
      '"Self learns of future increment or decrement to touched\'s attack or save roll"',
  'Precipitation':
    'School=Alteration ' +
    'Level=C1,D1,M1 ' +
    'Description=' +
      '"R%{lvl*10}\' Creates a 3\' diameter light rain for %{lvl} seg"',
  'Aid':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Aid + ' ' +
    'Level=C2',
  'Detect Life':
    'School=Divination ' +
    'Level=C2 ' +
    'Description=' +
      '"R%{lvl*100}\' Self may determine whether target is alive for 5 rd"',
  'Dust Devil':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Dust Devil']
      .replace('lvl*2', 'lvl') + ' ' +
    'Level=C2',
  'Enthrall':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Enthrall
      .replace('3 HD', '4 HD or Wisdom 15') + ' ' +
    'Level=C2',
  'Holy Symbol':
    'School=Conjuration ' +
    'Level=C2 ' +
    'Description="Converts touched into a holy symbol"',
  'Messenger':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Messenger
      .replace('Tiny', 'Small')
      .replace('dy', 'hr') + ' ' +
    'Level=C2',
  'Withdraw':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Withdraw + ' ' +
    'Level=C2',
  'Wyvern Watch':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Wyvern Watch'] + ' ' +
    'Level=C2',
  'Cloudburst':
    'School=Alteration ' +
    'Level=C3,D3,M3 ' +
    'Description="R%{lvl*10}\' Causes a 3\' diameter heavy rain for 1 rd"',
  "Death's Door":
    'School=Necromancy ' +
    'Level=C3 ' +
    'Description="Increases touched HP to 0 for %{lvl} hr"',
  'Flame Walk':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Flame Walk']
      .replace(' and half dmg', '')
      .replace('rd', 'tn') + ' ' +
    'Level=C3',
  'Magical Vestment':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Magical Vestment']
      .replace('7-(lvl+1)//3', '5-lvl//4', '')
      .replace('lvl*5', 'lvl*6') + ' ' +
    'School=Conjuration ' +
    'Level=C3',
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
    OldSchool.RULE_EDITS['Second Edition'].Spell.Abjure + ' ' +
    'Level=C4',
  'Cloak Of Fear':
    'School=Illusion ' +
    'Level=C4 ' +
    'Description=' +
      '"30\' radius causes creatures to flee for 6 rd (Save neg) for %{lvl} tn"',
  'Giant Insect':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Giant Insect']
      .replace('versions', 'versions for %{lvl*2} rd') + ' ' +
    'Level=C4',
  'Imbue With Spell Ability':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Imbue With Spell Ability'] + ' ' +
    'Level=C4',
  'Spell Immunity':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Spell Immunity']
      .replace('Level=', 'Level=C4,'),
  'Spike Growth':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Spike Growth']
      .replace('and slow to half speed for 1 dy (Save neg) ', '')
      .replace('3d4', '1d6') + ' ' +
    'Level=C4,D3',
  'Air Walk':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Air Walk'] + ' ' +
    'Level=C5',
  'Animate Dead Monsters':
    'School=Necromancy ' +
    'Level=C5 ' +
    'Description=' +
      '"R10\' Animates %{lvl//2} obedient humanoid or semi-humanoid corpse%{lvl>3?\'s\':\'\'}"',
  'Golem':
    'School=Enchantment ' +
    'Level=C5 ' +
    'Description=' +
      '"R10\' Animates an obedient construct made of straw%{lvl>10?\', rope\':\'\'}%{lvl>12?\', leather\':\'\'}%{lvl>14?\', wood\':\'\'}"',
  'Magic Font':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Magic Font']
      .replace('hr', 'rd') + ' ' +
    'School=Divination ' +
    'Level=C5',
  'Rainbow':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Rainbow + ' ' +
    'Level=C5 ' +
    'Description="Uses an existing rainbow to create a +3 bow, a %{lvl}\' wide bridge, a 10\' radius elevator, or a potion font, for %{lvl} rd"',
  'Spike Stones':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Spike Stones'] + ' ' +
    'Level=C5,D5',
  'Forbiddance':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Forbiddance + ' ' +
    'Level=C6',
  "Heroes' Feast":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Heroes' Feast"] + ' ' +
    'Level=C6',
  'Exaction':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Exaction + ' ' +
    'Level=C7',
  'Succor':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Succor + ' ' +
    'Level=C7,M9',
  'Detect Balance':
    'School=Divination ' +
    'Level=D1 ' +
    'Description=' +
      '"R60\' Self discerns non-neutral alignment in target object or creature 1/rd for %{lvl} rd"',
  'Detect Poison':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Detect Poison']
      .replace('lvl+10', 'lvl') + ' ' +
    'School=Divination ' +
    'Level=D1',
  'Flame Blade':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Flame Blade']
      .replace('lvl//2+4', 'lvl') + ' ' +
    'Level=D2',
  'Goodberry':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Goodberry + ' ' +
    'Level=D2',
  'Reflecting Pool':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Reflecting Pool'] + ' ' +
    'School=Evocation ' +
    'Level=D2',
  'Slow Poison':
    OSRIC.SPELLS['Slow Poison']
      .replace('{lvl*2} rd', '{lvl} hr')
      .replace('Level=', 'Level=D2,'),
  'Know Alignment':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Know Alignment']
      .replace('W2', 'M2')
      .replace('1 tn', "%{slvl=='D3'?'5 rd':slvl=='M2'?lvl+' rd':'1 tn'}") + ' ' +
    'School=Divination ' +
    'Level=C2,D3,M2',
  'Starshine':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Starshine + ' ' +
    'Level=D3',
  'Moonbeam':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Moonbeam
      .replace('+60', '')
      .replace("5' radius", "10' diameter") + ' ' +
    'Level=D5',
  'Liveoak':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Liveoak + ' ' +
    'Level=D6',
  'Transmute Water To Dust':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Transmute Water To Dust'] + ' ' +
    'Level=D6,M6',
  'Changestaff':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Changestaff + ' ' +
    'Level=D7',
  'Sunray':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Sunray
      .replace("5' radius", "10' diameter")
      .replace('2-5', '1') + ' ' +
    'Level=D7',
  'Chill':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Temperature in a 1\' cu drops 40F for 1/2 seg"',
  'Clean':
    'School=Abjuration ' +
    'Level=M0 ' +
    'Description="R10\' Removes dirt from 4 sq yd"',
  'Color':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Adds color to a 1 cu yd object"',
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
    'Description="R10\' Removes dust from a 10\' radius"',
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
    'Description="R10\' Accelerates plant growth in 1 cu yd"',
  'Stitch':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Sews seams in target cloth or leather object"',
  'Sweeten':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Adds sweet taste to target"',
  'Tie':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Causes target to wrap into a tight knot"',
  'Warm':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Temperature in a 1\' cu rises 40F for 1/2 seg"',
  'Wrap':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Creates wrapping around a 1 cu yd target"',
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
    'Description="R10\' Adds dust to a 10\' radius"',
  'Hairy':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R10\' Hair or fuzz on target grows 2d6\\""',
  'Knot':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description=' +
      '"R10\' Causes target to wrap into a knot that is difficult to untie"',
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
    'Description=' +
      '"R10\' Changes animal or vegetable target into a similar object for 1 tn+"',
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
    'Description="R10\' Alters shape and type of mineral target for 1 rd"',
  'Palm':
    'School=Illusion ' +
    'Level=M0 ' +
    'Description=' +
      '"R10\' Makes target invisible and creates an illusionary duplicate for 1 seg"',
  'Present':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="R2\' Brings target object to self hand"',
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
    'Description="R10\' Target laughs for 2-3 sec (Save brief laugh)"',
  'Nod':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Target nods (Save neg)"',
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
    'Description="R10\' Target winks repeatedly (Save unnoticeable)"',
  'Yawn':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description=' +
      '"R10\' Target yawns and becomes vulnerable to <i>Sleep</i> (Save neg) for 1 rd"',
  'Bee':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description="R10\' Creates a bee that stings target"',
  'Bluelight':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description="R10\' Creates a 3\\" sphere that dimly lights a 5\' radius"',
  'Bug':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description="R10\' Creates a crawling insect that attacks target"',
  'Firefinger':
    'School=Alteration ' +
    'Level=M0 ' +
    'Description="Creates a 5\' flame jet that ignites flammable objects"',
  'Gnats':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description=' +
      '"R10\' Creates a cloud of gnats that distracts target (Save vs. poison neg)"',
  'Mouse':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description="R10\' Creates a mouse"',
  'Smokepuff':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Creates a 1\' diameter smoke puff"',
  'Spider':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description="R10\' Creates a spider (5% poisonous) that attacks target"',
  'Tweak':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description="R10\' Creates a thumb and forefinger that tug on target"',
  'Unlock':
    'School=Conjuration ' +
    'Level=M0 ' +
    'Description="R10\' Unlocks a simple lock"',
  'Creak':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description=' +
      '"R10\' Creates the sound of squeaking hinges or floorboards for 1/2 seg"',
  'Footfall':
    'School=Illusion ' +
    'Level=M0 ' +
    'Description="R10\' Creates the sound of walking for 10\'"',
  'Groan':
    'School=Illusion ' +
    'Level=M0 ' +
    'Description="R10\' Creates the sound of a wracking cry"',
  'Moan':
    'School=Illusion ' +
    'Level=M0 ' +
    'Description="R10\' Creates the sound of a moan"',
  'Rattle':
    'School=Illusion ' +
    'Level=M0 ' +
    'Description="R10\' Creates a rattling sound for 2 sec"',
  'Tap':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Creates the sound of 1-3 taps"',
  'Thump':
    'School=Illusion ' +
    'Level=M0 ' +
    'Description="R10\' Creates the sound of a falling object"',
  'Whistle':
    'School=Evocation ' +
    'Level=M0 ' +
    'Description="R10\' Creates the sound of wind whistling"',
  'Alarm':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Alarm
      .replace('20', '%{lvl*20}')
      .replace('%{4+lvl*0.5} hr', '2d4+%{lvl} tn') + ' ' +
    'School=Evocation ' +
    'Level=M1',
  'Armor':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Armor
      .replace('Armor Class 6', '-1 Armor Class (max 8)') + ' ' +
    'School=Conjuration ' +
    'Level=M1',
  'Firewater':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description=' +
      '"Transforms %{lvl} pints of water into a flammable liquid for 1 rd"',
  'Grease':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Grease
      .replace("10' sq", "%{lvl}' sq")
      .replace(/, for.*rd/, '') + ' ' +
    'School=Evocation ' +
    'Level=M1',
  'Melt':
    'School=Alteration ' +
    'Level=M1 ' +
    'Description=' +
      '"R30\' Melts up to 2 cu yd of ice or snow or inflicts %{lvl*2} HP on cold creatures (Save half)"',
  'Mount':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Mount + ' ' +
    'Level=M1',
  'Run':
    'School=Enchantment ' +
    'Level=M1 ' +
    'Description=' +
      '"Touched may run 1d4+4 hr without tiring; must rest an equal time afterwards"',
  'Taunt':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Taunt + ' ' +
    'Description="R30\' %{lvl*2} HD of creatures in a 15\' radius attack caster" ' +
    'Level=M1',
  'Wizard Mark':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Wizard Mark'] + ' ' +
    'Level=M1',
  'Bind':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Bind + ' ' +
    'School=Alteration ' +
    'Level=M2',
  'Deeppockets':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Deeppockets
      .replace('lvl+12', 'lvl+4') + ' ' +
    'Level=M2',
  'Flaming Sphere':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Flaming Sphere']
      .replace("30'/rd", "10'/rd") + ' ' +
    'School=Alteration ' +
    'Level=M2',
  'Irritation':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Irritation
      .replace(/1-4.*itch/, 'Target itches')
      .replace('develop', 'develops')
      .replace('Charisma', 'Comeliness') + ' ' +
    'Level=M2',
  "Melf's Acid Arrow":
    'School=Evocation ' +
    'Level=M2 ' +
    'Description=' +
      '"R30\' +1 attack inflicts 1d4+1 HP plus 2d4 HP/rd for %{lvl//3+1} rd"',
  'Preserve':
    'School=Abjuration ' +
    'Level=M2 ' +
    'Description=' +
      '"Preserves %{lvl//2}\' cu touched material for later use"',
  'Protection From Cantrips':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Protection From Cantrips']
      .replace('lvl+5', 'lvl')
      .replace('hr', 'dy') + ' ' +
    'Level=M2',
  "Tasha's Uncontrollable Hideous Laughter":
    'School=Evocation ' +
    'Level=M2 ' +
    'Description=' +
      '"R50\' Target suffers -2 attack and damage for 2 rd (Save neg)"',
  'Vocalize':
    'School=Alteration ' +
    'Level=M2 ' +
    'Description="Touched may cast without a vocal component for 5 rd"',
  'Whip':
    'School=Evocation ' +
    'Level=M2 ' +
    'Description=' +
      '"R10\' Creates a remote whip that repels animals (Save neg) for %{lvl} rd"',
  'Zephyr':
    'School=Evocation ' +
    'Level=M2 ' +
    'Description="Creates a 10\'x%{lvl//2*10}\' gentle breeze for 1 seg"',
  'Detect Illusion':
    OSRIC.SPELLS['Detect Illusion']
      .replace('Level=', 'Level=M3,')
      .replace('lvl*2+3', "slvl=='M3'?lvl*2:(lvl*2+3)"),
  'Item':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Item + ' ' +
    'Level=M3',
  'Material':
    'School=Evocation ' +
    'Level=M3 ' +
    'Description="R10\' Creates %{lvl}\' cu of raw materials"',
  "Melf's Minute Meteors":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Melf's Minute Meteors"]
      .replace('+2 ', '')
      .replace('+70', '') + ' ' +
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
      .replace("%{lvl*10}'x5'", "10\'x%{lvl/2*5}'") + ' ' +
    'Level=M3',
  'Dispel Illusion':
    OSRIC.SPELLS['Dispel Illusion']
      .replace('Level=', 'Level=M4,')
      .replace('lvl*10', "slvl=='M4'?lvl/2*10:(lvl*10)"),
  "Evard's Black Tentacles":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Evard's Black Tentacles"]
      .replace('hr', 'rd') + ' ' +
    'Level=M4',
  "Leomund's Secure Shelter":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Leomund's Secure Shelter"]
      .replace('1d4+%{lvl+1}', '%{lvl}') + ' ' +
    'Level=M4',
  'Magic Mirror':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Magic Mirror'] + ' ' +
    'Level=M4,I5',
  "Otiluke's Resilient Sphere":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Otiluke's Resilient Sphere"] + ' ' +
    'Level=M4',
  'Shout':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Shout
      .replace('half duration deafness only', 'neg') + ' ' +
    'Level=M4',
  'Stoneskin':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Stoneskin
      .replace('1d4+%{lvl//2} blows', 'blow') + ' ' +
    'Level=M4',
  'Ultravision':
    'School=Alteration ' +
    'Level=M4,I2 ' +
    'Description=' +
      '"Touched sees 100 yd clearly at night for %{lvl*(slvl==\'M4\'?6:1)+6} tn"',
  'Avoidance':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Avoidance + ' ' +
    'Level=M5',
  'Dismissal':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Dismissal + ' ' +
    'Level=M5',
  'Dolor':
    'School=Enchantment ' +
    'Level=M5 ' +
    'Description=' +
      '"R10\' Target hostile extraplanar creature suffers penalty to save vs. command and non-offensive spells for 3 rd"',
  'Fabricate':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Fabricate + ' ' +
    'Level=M5',
  "Leomund's Lamentable Belabourment":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Leomund's Lamentable Belaborment"] + ' ' + // spelling change
    'Level=M5',
  'Sending':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Sending
      .replace('25-word', '%{lvl}-word') + ' ' +
    'Level=M5',
  'Chain Lightning':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Chain Lightning'] + ' ' +
    'Level=M6',
  'Contingency':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Contingency + ' ' +
    'Level=M6',
  'Ensnarement':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Ensnarement + ' ' +
    'Level=M6',
  'Eyebite':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Eyebite
      .replace('%{lvl//3}', '1') + ' ' +
    'Level=M6',
  "Mordenkainen's Lucubration":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Mordenkainen's Lucubration"] + ' ' +
    'Level=M6',
  'Banishment':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Banishment + ' ' +
    'Level=M7',
  'Forcecage':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Forcecage + ' ' +
    'Level=M7',
  "Mordenkainen's Magnificent Mansion":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Mordenkainen's Magnificent Mansion"] + ' ' +
    'Level=M7',
  'Sequester':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Sequester + ' ' +
    'Level=M7',
  'Teleport Without Error':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Teleport Without Error'] + ' ' +
    'Level=M7',
  'Torment':
    'School=Evocation ' +
    'Level=M7 ' +
    'Description=' +
      '"R10\' Causes pain in extraplanar target to force compliance (Save neg)"',
  'Truename':
    'School=Enchantment ' +
    'Level=M7 ' +
    'Description=' +
      '"R30\' Inflicts suggestions, surrender, polymorph, or transport on a target whose true name is known"',
  'Volley':
    'School=Abjuration ' +
    'Level=M7 ' +
    'Description="Reflects spell cast on self back onto caster"',
  'Binding':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Binding + ' ' +
    'Level=M8',
  'Demand':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Demand
      .replace('25-word', '%{lvl}-word')
      .replace('-2 ', '') + ' ' +
    'Level=M8',
  "Otiluke's Telekinetic Sphere":
    OldSchool.RULE_EDITS['Second Edition'].Spell["Otiluke's Telekinetic Sphere"]
      .replace('lvl*2', 'lvl') + ' ' +
    'Level=M8',
  'Sink':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Sink + ' ' +
    'Level=M8',
  'Crystalbrittle':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Crystalbrittle + ' ' +
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
    'Description=' +
      '"R10\' Creates 1\'-diameter movable colored lights for conc"',
  'Dim':
    'School=Alteration ' +
    'Level=I0 ' +
    'Description="Halves brightness in a 10\' radius"',
  'Haze':
    'School=Alteration ' +
    'Level=I0 ' +
    'Description=' +
      '"Fills a 10\' cu with a smoky haze, inflicting -1 missile attacks and giving +1 saves, for 1 rd"',
  'Mask':
    'School=Illusion ' +
    'Level=I0 ' +
    'Description="Changes touched facial features for 1d4+2 rd"',
  'Mirage':
    'School=Illusion ' +
    'Level=I0 ' +
    'Description="R10\' Covers a 20\' sq area w/an image of a known location for conc or until touched"',
  'Noise':
    'School=Illusion ' +
    'Level=I0 ' +
    'Description="R10\' Creates an indistinct sound for conc (Save neg)"',
  'Rainbow Cantrip':
    'School=Alteration ' +
    'Level=I0 ' +
    'Description=' +
      '"R10\' Creates a movable 30\' rainbow that fascinates (Save neg) for 1 rd"',
  "Two-D'lusion":
    'School=Illusion ' +
    'Level=I0 ' +
    'Description=' +
      '"R10\' Creates a 40\' sq illusion for conc or until touched (Save or angled view disbelieve)"',
  'Chromatic Orb':
    'School=Alteration ' +
    'Level=I1 ' +
    'Description="R30\' Hurled orb damages target on contact"',
  'Phantom Armor':
    'School=Alteration ' +
    'Level=I1 ' +
    'Description="Gives touched Armor Class 3 and absorbs %{lvl} HP of damage"',
  'Read Illusionist Magic':
    'School=Divination ' +
    'Level=I1 ' +
    'Description=' +
      '"Self may understand illusionist writing for %{lvl*2} rd (Reverse obscures)"',
  'Spook':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Spook + ' ' +
    'Level=I1',
  'Alter Self':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Alter Self'] + ' ' +
    'Level=I2',
  'Fascinate':
    'School=Illusion ' +
    'Level=I2 ' +
    'Description=' +
      '"R30\' Target becomes captivated by self (Save neg, failed comeliness ends) for 1d4 dy"',
  'Whispering Wind':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Whispering Wind']
      .replace('25', '12') + ' ' +
    'Level=I2',
  'Delude':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Delude + ' ' +
    'Level=I3',
  'Phantom Steed':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Phantom Steed']
      .replace('%{lvl+7} HP, Armor Class 2', '12 HP') + ' ' +
    'Level=I3',
  'Phantom Wind':
    'School=Alteration ' +
    'Level=I3 ' +
    'Description=' +
      '"R%{lvl*10}\' Creates a breeze that moves objects for %{lvl} rd"',
  'Wraithform':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Wraithform + ' ' +
    'Level=I3',
  'Dispel Magic':
    OSRIC.SPELLS['Dispel Magic']
      .replace('Level=', 'Level=I4,')
      .replace('120', "slvl=='I4'?90:120"),
  'Rainbow Pattern':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Rainbow Pattern'] + ' ' +
    'Level=I4',
  'Solid Fog':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Solid Fog']
      .replace('10', '20') + ' ' +
    'Level=I4',
  'Vacancy':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Vacancy
      .replace('hr', 'tn') + ' ' +
    'School=Alteration ' +
    'Level=I4',
  'Advanced Illusion':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Advanced Illusion'] + ' ' +
    'Level=I5',
  'Dream':
    'School=Alteration ' +
    'Level=I5 ' +
    'Description=' +
      '"A full night\'s sleep gives self <i>Limited Wish</i> effects"',
  'Tempus Fugit':
    'School=Illusion ' +
    'Level=I5 ' +
    'Description="10\' radius speeds time by 6x for %{lvl*5} tn"',
  'Death Fog':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Death Fog'] + ' ' +
    'Level=I6',
  'Mislead':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Mislead + ' ' +
    'Level=I6',
  'Phantasmagoria':
    'School=Illusion ' +
    'Level=I6 ' +
    'Description=' +
      '"R60\' Creates a triggered %{lvl*10+40}\' sq sight, sound, smell, and temperature illusion for %{lvl} rd"',
  'Mirage Arcane':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Mirage Arcana'] + ' ' +
    'Level=I6',
  'Shadow Walk':
    OldSchool.RULE_EDITS['Second Edition'].Spell['Shadow Walk']
      .replace('7 miles', '21 miles') + ' ' +
    'Level=I7',
  'Weird':
    OldSchool.RULE_EDITS['Second Edition'].Spell.Weird + ' ' +
    'School=Evocation ' +
    'Level=I7'
};
UnearthedArcana1e.WEAPONS = {
  'Aklys':'Category=One-Handed Damage=d6 Range=10',
  'Atlatl':'Category=Ranged Damage=d6 Range=30',
  'Blowgun':'Category=Ranged Damage=d1 Range=10',
  'Caltrop':'Category=Unarmed Damage=d1',
  'Falchion Sword':'Category=One-Handed Damage=d6+1',
  'Garrot':'Category=Two-Handed Damage=d4',
  'Hand Crossbow':'Category=Ranged Damage=d3 Range=20',
  'Harpoon':'Category=Ranged Damage=2d4 Range=10',
  'Hook Fauchard':'Category=Two-Handed Damage=d4',
  'Khopesh Sword':'Category=One-Handed Damage=2d4',
  'Knife':'Category=One-Handed Damage=d3 Range=10',
  'Man Catcher':'Category=Two-Handed Damage=d2',
  'Sap':'Category=One-Handed Damage=d2',
  'Spiked Buckler':'Category=One-Handed Damage=d4',
  'Staff Sling':'Category=Ranged Damage=2d4 Range=30',
  'Whip':'Category=One-Handed Damage=d2'
};

/* Defines rules related to character abilities. */
UnearthedArcana1e.abilityRules = function(rules) {
  rules.defineRule('abilityNotes.charismaComelinessModifier',
    'charisma', '=', 'source<3 ? -8 : source<4 ? -5 : source<6 ? -3 : source<9 ? -1 : source<13 ? null : source<16 ? 1 : source<18 ? 2 : source<19 ? 3 : 5'
  );
  rules.defineRule('comeliness',
    'abilityNotes.charismaComelinessModifier', '+', null,
    'abilityNotes.raceComelinessModifier', '+', null
  );
  rules.defineRule
    ('features.Gorgeous', 'comeliness', '=', 'source<18 ? null : 1');
  rules.defineChoice('random', 'comeliness');
  rules.defineChoice('notes',
    'abilityNotes.charismaComelinessModifier:%S',
    'abilityNotes.raceComelinessModifier:%S'
  );
  rules.defineEditorElement
    ('comeliness', 'Comeliness', 'select-one', [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 'gender');
  rules.defineSheetElement('Comeliness', 'Charisma+', null);
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
UnearthedArcana1e.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Armor')
    UnearthedArcana1e.armorRulesExtra(rules, name, attrs);
  else if(type == 'Class')
    UnearthedArcana1e.classRulesExtra(rules, name, attrs);
  else if(type == 'Race')
    UnearthedArcana1e.raceRulesExtra(rules, name, attrs);
};

/*
 * Defines in #rules# the rules associated with armor #name# that cannot be
 * derived directly from the abilities passed to armorRules.
 */
UnearthedArcana1e.armorRulesExtra = function(rules, name, attrs) {
  if(rules.armorStats.acrobatics == null)
    rules.armorStats.acrobatics = {};
  let allSkills = QuilvynUtils.getAttrValueArray(attrs, 'Skill');
  rules.armorStats.acrobatics[name] =
    allSkills.length > 1 ? '/' + allSkills[allSkills.length - 2] : '';
  rules.defineRule('skillNotes.armorSkillModifiers.1',
    'armor', '=', QuilvynUtils.dictLit(rules.armorStats.acrobatics) + '[source]'
  );
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the abilities passed to classRules.
 */
UnearthedArcana1e.classRulesExtra = function(rules, name, attrs) {
  let classLevel = 'levels.' + name;
  if(name == 'Barbarian') {
    rules.defineRule('features.Determine Direction', classLevel, '=', '1');
    rules.defineRule("features.Druid's Knowledge", classLevel, '=', '1');
    rules.defineRule('save.Breath', 'saveNotes.barbarianResistance', '+', '-2');
    rules.defineRule('save.Death', 'saveNotes.barbarianResistance', '+', '-3');
    rules.defineRule
      ('save.Petrification', 'saveNotes.barbarianResistance', '+', '-3');
    rules.defineRule
      ('save.Spell', 'saveNotes.barbarianResistance.1', '+', null);
    rules.defineRule('save.Wand', 'saveNotes.barbarianResistance', '+', '-2');
    rules.defineRule('saveNotes.barbarianResistance.1',
      classLevel, '=', 'Math.floor(source / 4)'
    );
    rules.defineRule('skillLevel.Climb Walls', classLevel, '+=', null);
    rules.defineRule('skillLevel.Hide In Shadows', classLevel, '+=', null);
  } else if(name == 'Cavalier') {
    // Override bonus attacks computation to reflect additional 0.5 at level 16
    rules.defineRule('combatNotes.bonusAttacks',
      classLevel, '^=', 'source<6 ? null : source<11 ? 0.5 : source<16 ? 1 : 1.5'
    );
  } else if(name == 'Paladin') {
    // Override bonus attacks computation to reflect additional 0.5 at level 19
    rules.defineRule('combatNotes.bonusAttacks',
      classLevel, '^=', 'source<7 ? null : source<13 ? 0.5 : source<19 ? 1 : 1.5'
    );
    rules.defineRule
      ('paladinFeatures.Bonus Paladin Experience', classLevel, 'v', '0');
  } else if(name == 'Thief-Acrobat') {

    ['Climb Walls', 'Hear Noise', 'Hide In Shadows', 'Move Silently',
     'Read Languages'].forEach(s => {
      rules.defineRule('skillLevel.' + s, classLevel, '+=', null);
    });
    ['Find Traps', 'Open Locks', 'Pick Pockets'].forEach(s => {
      rules.defineRule
        ('skillLevel.' + s, classLevel, '+=', 'Math.min(source, 5)');
    });
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
    rules.defineRule('skillNotes.armorSkillModifiers.1',
      'skillNotes.armorSkillModifiers', '?', null,
      classLevel, '?', 'source>=6',
      '', '=', '""'
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

    ['High Jumping', 'Pole Vaulting', 'Running Broad Jumping',
     'Standing Broad Jumping', 'Tightrope Walking', 'Tumbling Attack',
     'Tumbling Evasion', 'Tumbling Falling'].forEach(s => {
      rules.defineChoice
        ('notes', 'skills.' + s + ':' + (s=='Tumbling Falling' ? "%1%,%V'" : s.charAt(0) == 'T' ? '%V%' : "%V'"));
      rules.defineRule('skills.' + s,
        'skillNotes.armorSkillModifiers.1', '+',
          'source.match(/' + s + '/) ? source.match(/([-+][\\d\\.]+). ' + s + '/)[1] * 1 : null',
        'skillNotes.dexteritySkillModifiers.1', '+',
          'source.match(/' + s + '/) ? source.match(/([-+][\\d\\.]+). ' + s + '/)[1] * 1 : null',
        'skillNotes.strengthSkillModifiers', '+',
          'source.match(/' + s + '/) ? source.match(/([-+][\\d\\.]+). ' + s + '/)[1] * 1 : null'
      );
      rules.defineRule('skills.' + s + (s == 'Tumbling Falling' ? '.1' : ''),
        'skillNotes.raceSkillModifiers.1', '+',
          'source.match(/' + s + '/) ? source.match(/([-+][\\d\\.]+). ' + s + '/)[1] * 1 : null'
      );
    });
    rules.defineChoice('notes',
      "skillNotes.armorSkillModifiers:%V%1",
      "skillNotes.dexteritySkillModifiers:%V%1",
      "skillNotes.raceSkillModifiers:%V%1"
    );
  }
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the abilities passed to raceRules.
 */
UnearthedArcana1e.raceRulesExtra = function(rules, name, attrs) {

  let raceLevel =
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
      raceLevel, '=', '"/+5% Tightrope Walking/+5% Tumbling Attack"'
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
    rules.defineRule('abilityNotes.raceComelinessModifier',
      'darkElfComelinessModifier', '=', null
    );
  } else if(name.includes('Dwarf')) {
    rules.defineRule
      ('skillNotes.intelligenceLanguageBonus', raceLevel, 'v', '2');
    rules.defineRule
      ('abilityNotes.raceComelinessModifier', raceLevel, '=', -1);
  } else if(name.includes('Gnome')) {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier', raceLevel, '=', -1);
  } else if(name == 'Gray Elf' || name == 'High Elf' || name == 'Elf') {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier', raceLevel, '=', 2);
  } else if(name.includes('Half-Elf')) {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier', raceLevel, '=', 1);
  } else if(name.includes('Half-Orc')) {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier', raceLevel, '=', -3);
  } else if(name == 'Wild Elf') {
    rules.defineRule('skillNotes.intelligenceLanguageBonus', raceLevel, 'v', 0);
  } else if(name == 'Wood Elf') {
    rules.defineRule
      ('abilityNotes.raceComelinessModifier', raceLevel, '=', 1);
    rules.defineRule('skillNotes.intelligenceLanguageBonus', raceLevel, 'v', 0);
  }

};

/* Sets #attributes#'s #attribute# attribute to a random value. */
UnearthedArcana1e.randomizeOneAttribute = function(attributes, attribute) {
  if(attribute == 'comeliness' || attribute == 'abilities') {
    let rolls = [];
    for(let i = 0; i < 4; i++)
      rolls.push(QuilvynUtils.random(1, 6));
    rolls.sort();
    attributes.comeliness = rolls[1] + rolls[2] + rolls[3];
  }
};

/* Returns HTML body content for user notes associated with this rule set. */
UnearthedArcana1e.ruleNotes = function() {
  return '' +
    '<h2>Quilvyn Unearthed Arcana 1E Plugin Notes</h2>\n' +
    'Quilvyn Unearthed Arcana 1E Plugin Version ' + UnearthedArcana1e.VERSION + '\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    'Quilvyn\'s Unearthed Arcana 1E plugin is unofficial Fan Content ' +
    'permitted under Wizards of the Coast\'s ' +
    '<a href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</a>.\n' +
    '</p><p>\n' +
    'Unearthed Arcana © 2013 Wizards of the Coast LLC.\n' +
    '</p>\n';
};
