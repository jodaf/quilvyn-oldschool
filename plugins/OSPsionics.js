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
/* globals Expr, OldSchool, OSRIC, QuilvynRules, QuilvynUtils */
"use strict";

/*
 * OSPsionics is a placeholder for the items and functions defined by the
 * plugin. OldSchool invokes this plugin's abilityRules and choiceRules
 * functions directly and overrides the values of ARMORS, SPELLS, etc. with the
 * values defined in this plugin.
 */
function OSPsionics() {
}

OSPsionics.VERSION = '2.4.1.0';

OSPsionics.CLASSES = {
  'Psionicist':
    'Require=' +
      '"alignment !~ \'Chaotic\'","constitution >= 11","intelligence >= 13",' +
      '"wisdom >= 15" ' +
    'HitDie=d6,9,2 THAC10="10 9@3 ...1@19" ' +
    'WeaponProficiency="2 3@6 ...5@16" NonproficientPenalty=-4 ' +
    'NonweaponProficiency="3 4@4 ...9@19" ' +
    'Breath="16 15@5 13@9 12@13 11@17 9@21" ' +
    'Death="13 12@5 ...8@21" ' +
    'Petrification="10 9@5 ...5@21" ' +
    'Spell="15 14@5 12@9 11@13 9@17 7@21" ' +
    'Wand="15 13@5 ...5@21" '+
    'Features=' +
      '"Armor Proficiency (Hide/Leather/Studded Leather)",' +
      '"Shield Proficiency (Small)",' +
      '"Psionic Powers","Resist Enchantment" ' +
    'Experience=' +
      '"0 2200 4400 8800 16500 30000 55000 100000 200000 400000 600000 800000' +
      ' 1000000 1200000 1500000 1800000 2100000 2400000 2700000 3000000"'
};
OSPsionics.DISCIPLINES = {
  'Clairsentience':'',
  'Psychokinesis':'',
  'Psychometabolism':'',
  'Psychoportation':'',
  'Telepathy':'',
  'Metapsionic':''
};
OSPsionics.FEATURES = {
  'Psionic Powers':
    'Section=magic ' +
    'Note="May access %V disciplines, %1 sciences, %2 devotions, and %3 defense modes"',
  'Psionic Talent':
    'Section=magic ' +
    'Note="May access 1 or more powers; has sufficient power to use the powers and maintain them 4 times"',
  'Resist Enchantment':'Section=save Note="+2 vs. enchantment spells"'
};
OSPsionics.GOODIES = {
};
OSPsionics.POWERS = {
  'Aura Sight':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'PowerScore="Wisdom -5" ' +
    'InitialCost=9 ' +
    'MaintenanceCost=9/rd ' +
    'Description="R50\' Reveals the alignment or level of 2 targets"',
  'Clairaudience':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=4/rd ' +
    'Description="Allows self to hear a known location"',
  'Clairvoyance':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=7 ' +
    'MaintenanceCost=4/rd ' +
    'Description="Allows self to see a known location"',
  'Object Reading':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'PowerScore="Wisdom -5" ' +
    'Preparation=1 ' +
    'InitialCost=16 ' +
    'Description="Reveals info about a target object\'s prior owner"',
  'Precognition':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'PowerScore="Wisdom -5" ' +
    'Preparation=5 ' +
    'InitialCost=24 ' +
    'Description=' +
      '"Reveals the likely outcome of a proposed action up to few hours in the future"',
  'Sensitivity To Psychic Impressions':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'PowerScore="Wisdom -4" ' +
    'Preparation=2 ' +
    'InitialCost=12 ' +
    'MaintenanceCost=2/rd ' +
    'Description="Reveals the history of a 60\' radius"',
  'All-Round Vision':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=4/rd ' +
    'Description=' +
      '"Gives self vision in all directions; inflicts -4 save vs. gaze"',
  'Combat Mind':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -4" ' +
    'InitialCost=5 ' +
    'MaintenanceCost=4/rd ' +
    'Description="Self gains -1 initiative"',
  'Danger Sense':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=4 ' +
    'MaintenanceCost=3/tn ' +
    'Description="R10\' Reveals nearby hazards and threats"',
  'Feel Light':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=7 ' +
    'MaintenanceCost=5/rd ' +
    'Description="Self may see via skin"',
  'Feel Sound':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=5 ' +
    'MaintenanceCost=3/rd ' +
    'Description="Self may hear via skin and gains +2 save vs. sonic"',
  'Hear Light':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=3/rd ' +
    'Description="Self may see via ears"',
  'Know Direction':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore=Intelligence ' +
    'InitialCost=1 ' +
    'Description="Reveals which direction is north"',
  'Know Location':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore=Intelligence ' +
    'Preparation=5 ' +
    'InitialCost=10 ' +
    'Description="Gives general info about current location"',
  'Poison Sense':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'InitialCost=1 ' +
    'Description="R1\' Reveals the presence of poison"',
  'Radial Navigation':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -3" ' +
    'InitialCost=4 ' +
    'MaintenanceCost=7/hr ' +
    'Description="Gives the distance and direction to initial location"',
  'See Sound':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=3/rd ' +
    'Description="Self may hear via eyes"',
  'Spirit Sense':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=10 ' +
    'Description="R15\' Reveals the presence of spirits"',
  'Create Object':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Science ' +
    'PowerScore="Intelligence -4" ' +
    'InitialCost=16 ' +
    'MaintenanceCost=3/rd ' +
    'Description="R20\' Creates an object of up to 10 lbs and 4\' in diameter"',
  'Detonate':
    'Require=powers.Telekinesis,"powers.Molecular Agitation" ' +
    'Discipline=Psychokinesis ' +
    'Type=Science ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=18 ' +
    'Description="R60\' 10\' radius inflicts 1d10 HP (Breath save half)"',
  'Disintegrate':
    'Require=powers.Telekinesis,powers.Soften ' +
    'Discipline=Psychokinesis ' +
    'Type=Science ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=40 ' +
    'Description="R50\' Obliterates target (Death save neg)"',
  'Molecular Rearrangement':
    'Require=powers.Telekinesis,"powers.Molecular Manipulation" ' +
    'Discipline=Psychokinesis ' +
    'Type=Science ' +
    'PowerScore="Intelligence -5" ' +
    'Preparation="2 hr" ' +
    'InitialCost=20 ' +
    'MaintenanceCost=10/hr ' +
    'Description="R2\' Converts 1 oz from one material to another"',
  'Project Force':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Science ' +
    'PowerScore="Constitution -2" ' +
    'InitialCost=10 ' +
    'Description="R200\' Remote punch inflicts 1d6+AC HP (Breath save half)"',
  'Telekinesis':
    'Discipline=Psychokinesis ' +
    'Type=Science ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=3 ' +
    'MaintenanceCost=1/rd ' +
    'Description="R30\' Moves target object 60\'/rd"',
  'Animate Object':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -3" ' +
    'InitialCost=8 ' +
    'MaintenanceCost=3/rd ' +
    'Description=' +
      '"R50\' Moves target object of up to 100 lb 60\'/rd in a lifelike fashion"',
  'Animate Shadow':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=7 ' +
    'MaintenanceCost=3/rd ' +
    'Description=' +
      '"R40\' Moves target 100\' sq shadow independently of its source"',
  'Ballistic Attack':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -2" ' +
    'InitialCost=5 ' +
    'Description="R30\' 1 lb missile inflicts 1d6 HP"',
  'Control Body':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -2" ' +
    'InitialCost=8 ' +
    'MaintenanceCost=8/rd ' +
    'Description=' +
      '"R80\' Allows self to control target\'s movement (Strength save neg)"',
  'Control Flames':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -1" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=3/rd ' +
    'Description=' +
      '"R40\' Doubles or halves the size and/or heat of a 10\' sq flame "',
  'Control Light':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore=Intelligence ' +
    'InitialCost=12 ' +
    'MaintenanceCost=4/rd ' +
    'Description="R25\' Brightens or dims a 400\' sq area"',
  'Control Sound':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -5" ' +
    'InitialCost=5 ' +
    'MaintenanceCost=2/rd ' +
    'Description="R100\' Modifies existing sounds"',
  'Control Wind':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'Preparation=2 ' +
    'InitialCost=16 ' +
    'MaintenanceCost=10/rd ' +
    'Description=' +
      '"R500\' Changes the speed and direction of wind up to 10 MPH and 90 degrees"',
  'Create Sound':
    'Require=powers.Telekinesis,"powers.Control Sound" ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -7" ' +
    'InitialCost=8 ' +
    'MaintenanceCost=3/rd ' +
    'Description="R100\' Creates a sound as loud as a group shouting"',
  'Inertial Barrier':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=7 ' +
    'MaintenanceCost=5/rd ' +
    'Description=' +
      '"R3\' Barrier reduces damage from missiles, flames, breath, and gas"',
  'Levitation':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=12 ' +
    'MaintenanceCost=2/rd ' +
    'Description="Allows self to ascend or descend 60\'/rd"',
  'Molecular Agitation':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'InitialCost=7 ' +
    'MaintenanceCost=6/rd ' +
    'Description="R40\' Heats targets"',
  'Molecular Manipulation':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -3" ' +
    'Preparation=1 ' +
    'InitialCost=6 ' +
    'MaintenanceCost=5/rd ' +
    'Description="R15\' Creates a weak spot in target"',
  'Soften':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore=Intelligence ' +
    'InitialCost=4 ' +
    'MaintenanceCost=3/rd ' +
    'Description="R30\' Softens target object"',
  'Animal Affinity':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'PowerScore="Constitution -4" ' +
    'InitialCost=15 ' +
    'MaintenanceCost=4/rd ' +
    'Description="Gives self one attribute of affinity animal"',
  'Complete Healing':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'PowerScore=Constitution ' +
    'Preparation="1 dy" ' +
    'InitialCost=30 ' +
    'Description="Heals self of all ailments, wounds, and normal diseases"',
  'Death Field':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'PowerScore="Constitution -8" ' +
    'Preparation=3 ' +
    'InitialCost=40 ' +
    'Description=' +
      '"R20\' Inflicts a specified number of HP on all within range (Death save neg)"',
  'Energy Containment':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'PowerScore="Constitution -2" ' +
    'InitialCost=10 ' +
    'Description=' +
      '"Self gains double saves and takes half damage vs. specified energy"',
  'Life Draining':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=11 ' +
    'MaintenanceCost=5/rd ' +
    'Description=' +
      '"Transfers 1d6 HP/rd from touched to self; up to 10 HP above maximum may be transferred for 1 hr"',
  'Metamorphosis':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'PowerScore="Constitution -6" ' +
    'Preparation=5 ' +
    'InitialCost=21 ' +
    'MaintenanceCost=1/tn ' +
    'Description=' +
      '"Transforms self into an object of approximately the same mass"',
  'Shadow-form':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'PowerScore="Constitution -6" ' +
    'InitialCost=12 ' +
    'MaintenanceCost=3/rd ' +
    'Description="Transforms self into a shadow"',
  'Absorb Disease':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=12 ' +
    'Description="Transfers disease from touched to self"',
  'Adrenalin Control':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=8 ' +
    'MaintenanceCost=4/rd ' +
    'Description=' +
      '"Gives self an additional 1d6 Strength, Dexterity, or Constitution"',
  'Aging':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -7" ' +
    'InitialCost=15 ' +
    'Description="Touched ages 1d4+1 yr (Polymorph save 1d4 yr)"',
  'Biofeedback':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -2" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=3/rd ' +
    'Description=' +
      '"Gives self -1 AC and reduces damage from attacks by 2 HP"',
  'Body Control':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'InitialCost=7 ' +
    'MaintenanceCost=5/tn ' +
    'Description="Allows self to remain comfortable in extreme environments"',
  'Body Equilibrium':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=2 ' +
    'MaintenanceCost=2/rd ' +
    'Description=' +
      '"Makes self very light, allowing walking on water and fragile surfaces and negating damage from falling"',
  'Body Weaponry':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=9 ' +
    'MaintenanceCost=4/rd ' +
    'Description="Transforms self arm into chosen weapon"',
  'Catfall':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Dexterity -2" ' +
    'InitialCost=4 ' +
    'Description=' +
      '"Allows self to fall 30\' w/out damage; longer falls inflict half damage"',
  'Cause Decay':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -2" ' +
    'InitialCost=4 ' +
    'Description="Decays or rusts touched object"',
  'Cell Adjustment':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=5 ' +
    'MaintenanceCost=20/rd ' +
    'Description="Cures touched of disease"',
  'Chameleon Power':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -1" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=3/rd ' +
    'Description="Visually blends self skin and clothes into background"',
  'Chemical Simulation':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'Preparation=1 ' +
    'InitialCost=9 ' +
    'MaintenanceCost=6/rd ' +
    'Description="Touch causes acid effects"',
  'Displacement':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=3/rd ' +
    'Description="Gives self -2 AC"',
  'Double Pain':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=7 ' +
    'Description="Touched suffers double damage, regaining half after 1 tn"',
  'Ectoplasmic Form':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'Preparation=1 ' +
    'InitialCost=9 ' +
    'MaintenanceCost=9/rd ' +
    'Description="Makes self insubstantial"',
  'Enhanced Strength':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=2 ' +
    'MaintenanceCost=1/rd ' +
    'Description="Increases self Strength"',
  'Expansion':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -2" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=1/rd ' +
    'Description="Increases self dimensions up to 4x"',
  'Flesh Armor':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=8 ' +
    'MaintenanceCost=4/rd ' +
    'Description="Transforms self skin into armor"',
  'Graft Weapon':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -5" ' +
    'InitialCost=10 ' +
    'MaintenanceCost=1/rd ' +
    'Description="Gives self weapon +1 attack and damage"',
  'Heightened Senses':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore=Constitution ' +
    'InitialCost=5 ' +
    'MaintenanceCost=1/rd ' +
    'Description=' +
      '"Gives self increased notice, tracking, hearing, poison detection, and touch identification"',
  'Immovability':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -5" ' +
    'InitialCost=9 ' +
    'MaintenanceCost=6/rd ' +
    'Description=' +
      '"Make self movable only by a combined Strength of %{(constitution-5)*10}"',
  'Lend Health':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -1" ' +
    'InitialCost=4 ' +
    'Description="Transfers HP from self to touched"',
  'Mind Over Body':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=10/dy ' +
    'Description="Allows self to function without food, water, or sleep"',
  'Reduction':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -2" ' +
    'InitialCost=1 ' +
    'MaintenanceCost=1/rd ' +
    'Description="Decreases self dimensions as small as 1\'"',
  'Share Strength':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=2/rd ' +
    'Description="Transfers Strength from self to touched"',
  'Suspend Animation':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'Preparation=5 ' +
    'InitialCost=12 ' +
    'Description="Allows self or touched to appear dead"',
  'Banishment':
    'Require=powers.Teleport ' +
    'Discipline=Psychoportation ' +
    'Type=Science ' +
    'PowerScore="Intelligence -1" ' +
    'InitialCost=30 ' +
    'MaintenanceCost=10/rd ' +
    'Description="R5\' Banishes target to a pocket dimension"',
  'Probability Travel':
    'Discipline=Psychoportation ' +
    'Type=Science ' +
    'PowerScore=Intelligence ' +
    'Preparation=2 ' +
    'InitialCost=20 ' +
    'MaintenanceCost=8/hr ' +
    'Description="Allows self to travel to astral plane"',
  'Summon Planar Creature':
    'Require=powers.Teleport ' +
    'Discipline=Psychoportation ' +
    'Type=Science ' +
    'PowerScore="Intelligence -4" ' +
    'Preparation=12 ' +
    'InitialCost=45 ' + // TODO or 90
    'Description="R200\' Summons and controls a creature from another plane"',
  'Teleport':
    'Discipline=Psychoportation ' +
    'Type=Science ' +
    'PowerScore=Intelligence ' +
    'InitialCost=10 ' +
    'Description="Transfers self to a familiar location"',
  'Teleport Other':
    'Require=powers.Teleport ' +
    'Discipline=Psychoportation ' +
    'Type=Science ' +
    'PowerScore="Intelligence -2" ' +
    'InitialCost=20 ' +
    'Description="R10\' Transfers target to a familiar location"',
  'Astral Projection':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'PowerScore=Intelligence ' +
    'Preparation=1 ' +
    'InitialCost=6 ' +
    'MaintenanceCost=2/hr ' +
    'Description="Transfers astral body to astral plane"',
  'Dimensional Door':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -1" ' +
    'InitialCost=4 ' +
    'MaintenanceCost=2/rd ' +
    'Description=' +
      '"R50\' Creates a pair of portals that teleports users between them, inflicting dazed for 1 rd"',
  'Dimension Walk':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -2" ' +
    'Preparation=2 ' +
    'InitialCost=8 ' +
    'MaintenanceCost=4/tn ' +
    'Description=' +
      '"Self may travel 7 miles/tn via a parallel dimension; a failed Wisdom check randomizes the exit point"',
  'Dream Travel':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=1 ' +
    'Description="R500 miles Self and companions may travel during sleep"',
  'Teleport Trigger':
    'Require=powers.Teleport ' +
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence +1" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=2/hr ' +
    'Description="Teleports self to a safe location when triggered"',
  'Time Shift':
    'Require=powers.Teleport ' +
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'PowerScore=Intelligence ' +
    'InitialCost=16 ' +
    'Description="Allows self to travel up to three rounds into the future"',
  'Time/Space Anchor':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'PowerScore=Intelligence ' +
    'InitialCost=5 ' +
    'MaintenanceCost=1/rd ' +
    'Description="3\' radius prevents involuntarily teleportation"',
  'Domination':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=6/rd ' +
    'Description=' +
      '"R30\' Gives self control of a contact\'s actions (Spell save neg)"',
  'Ejection':
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=variable ' +
    'Description="Forcibly breaks psionic contact; may harm self"',
  'Fate Link':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Constitution -5" ' +
    'Preparation=1 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=5/tn ' +
    'Description=' +
      '"Joins self and a contact to share each other\'s pain and HP loss (Death save avoids sharing death)"',
  'Mass Domination':
    'Require=powers.Mindlink,powers.Contact,powers.Domination ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Wisdom -6" ' +
    'Preparation=2 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=variable ' +
    'Description=' +
      '"R40\' Allows self to control 5 contacts\' actions (Spell save neg)"',
  'Mindlink':
    'Require=powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Wisdom -5" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=8/rd ' +
    'Description="Allows self to converse telepathically w/a contact"',
  'Mindwipe':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Intelligence -6" ' +
    'Preparation=1 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=8/rd ' +
    'Description=' +
      '"Touched contact suffers -1 Intelligence, Wisdom, and level (Spell save neg)"',
  'Probe':
    'Require=powers.ESP,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Wisdom -5" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=9/rd ' +
    'Description=' +
      '"R2\' Gives self access to all of a contact\'s memories (Spell save neg)"',
  'Psychic Crush':
    'Require=powers.Mindlink ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=7 ' +
    'Description=' +
      '"R50\' Inflicts 1d8 HP upon a contact (Paralyzation save neg)"',
  'Superior Invisibility':
    'Require=powers.Mindlink,powers.Contact,powers.Invisibility ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Intelligence -5" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=5/rd ' +
    'Description="Prevents a contact from seeing, hearing, or smelling self"',
  'Switch Personality':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Constitution -4" ' +
    'Preparation=3 ' +
    'InitialCost=30 ' +
    'Description=' +
      '"Allows self to exchange minds with a touched contact; each becomes comatose (System Shock neg) and loses 1 Constitution/dy (Constitution neg)"',
  'Tower Of Iron Will':
    'Require=powers.Mindlink ' +
    'Discipline=Telepathy ' +
    'Type=Defense ' +
    'PowerScore="Wisdom -2" ' +
    'InitialCost=6 ' +
    'Description="R1\' Creates a psionic defense"',
  'Attraction':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=8/rd ' +
    'Description="R200\' Draws a contact to a chosen item"',
  'Aversion':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=8/tn ' +
    'Description="R200\' Repels a contact from a chosen item for 1 tn"',
  'Awe':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Charisma -2" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=4/rd ' +
    'Description="Causes contacts to flee or to obey self (Spell save neg)"',
  'Conceal Thoughts':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'InitialCost=5 ' +
    'MaintenanceCost=3/rd ' +
    'Description="Shields self from mental probing"',
  'Contact':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'InitialCost=3 ' +
    'MaintenanceCost=1/rd ' +
    'Description=' +
      '"Allows self to contact a known creature psionically (psionicist neg, others resist -2) in order to apply other telepathic powers"',
  'Daydream':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'InitialCost=0 ' +
    'MaintenanceCost=3/rd ' +
    'Description=' +
      '"Distracts a contact (Intelligence &gt; 14 neg, concentration neg)"',
  'Ego Whip':
    'Require=powers.Mindlink ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=4 ' +
    'Description=' +
      '"Establishes contact with a psionicist target and dazes (-5 rolls) for 1d4 rd"',
  'Empathy':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'InitialCost=1 ' +
    'MaintenanceCost=1/rd ' +
    'Description="Reveals desires and emotions of creatures in a 20\' sq"',
  'ESP':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=6/rd ' +
    'Description="Reveals a contact\'s surface thoughts"',
  'False Sensory Input':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -3" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=4/rd ' +
    'Description="Modifies a contacts\'s sensory input"',
  'Id Insinuation':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=5 ' +
    'Description="Prevents a contact from acting for 1d4 rd"',
  'Identity Penetration':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=6/rd ' +
    'Description="Reveals a contact\'s true identity"',
  'Incarnation Awareness':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=13/rd ' +
    'Description="Reveals info about a contact\'s past lives"',
  'Inflict Pain':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'Preparation=1 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=2/rd ' +
    'Description="Touched contact suffers -4 attacks (Paralyzation save neg)"',
  'Intellect Fortress':
    'Require=powers.Mindlink ' +
    'Discipline=Telepathy ' +
    'Type=Defense ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=4 ' +
    'Description="9\' radius protects from psionic attacks"',
  'Invincible Foes':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=5/rd ' +
    'Description=' +
      '"Convinces a contact that any damage taken (Reverse damage dealt) is fatal"',
  'Invisibility':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -5" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=2/rd ' +
    'Description="R100\' Prevents contacts from seeing chosen creature"',
  'Life Detection':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -2" ' +
    'InitialCost=3 ' +
    'MaintenanceCost=3/rd ' +
    'Description="R100\' Allows self to discern living creatures"',
  'Mental Barrier':
    'Require=powers.Mindlink ' +
    'Discipline=Telepathy ' +
    'Type=Defense ' +
    'PowerScore="Wisdom -2" ' +
    'InitialCost=3 ' +
    'Description="Protects self from unwanted psionic contact"',
  'Mind Bar':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -2" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=4/rd ' +
    'Description=' +
      '"Gives self 75% resistance to mental magic and immunity to possession and non-contact psionic attacks"',
  'Mind Blank':
    'Require=powers.Mindlink ' +
    'Discipline=Telepathy ' +
    'Type=Defense ' +
    'PowerScore="Wisdom -7" ' +
    'InitialCost=0 ' +
    'Description="Protects self from psionic attacks"',
  'Mind Thrust':
    'Require=powers.Mindlink ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -2" ' +
    'InitialCost=2 ' +
    'Description=' +
      '"Establishes contact w/a target psionicist or suppresses an existing contact\'s power for 2d6 dy"',
  'Phobia Amplification':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -2" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=4/rd ' +
    'Description="Inflicts overwhelming fear on a contact"',
  'Post-Hypnotic Suggestion':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -3" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=1/level ' +
    'Description=' +
      '"Plants a suggestion in target (Intelligence &lt; 7 or &gt; 17 neg)"',
  'Psionic Blast':
    'Require=powers.Telekinesis ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -5" ' +
    'InitialCost=10 ' +
    'Description=' +
      '"Convinces a contact that 80% of its HP are lost (Death save neg) for 6 tn"',
  'Psychic Impersonation':
    'Require=powers.Mindlink,powers.Probe ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'Preparation="1 tn" ' +
    'InitialCost=10 ' +
    'MaintenanceCost=3/hr ' +
    'Description=' +
      '"Allows self to mimic target\'s aura and thoughts; inflicts -1 power scores on self"',
  'Psychic Messenger':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'Preparation=2 ' +
    'InitialCost=4 ' +
    'MaintenanceCost=3/rd ' +
    'Description="R200 miles Sends an auditory and visual message"',
  'Repugnance':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -5" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=8/rd ' +
    'Description="R200\' Convinces a contact to destroy a chosen item"',
  'Send Thoughts':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -1" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=2/rd ' +
    'Description=' +
      '"Sends self thoughts to a contact, inflicting -2 attacks and a save vs. Spells to cast a spell"',
  'Sight Link':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'Preparation=1 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=5/tn ' +
    'Description="Allows self to see through a contact\'s eyes"',
  'Sound Link':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -2" ' +
    'Preparation=1 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=4/tn ' +
    'Description="Allows self to hear through a contact\'s ears"',
  'Synaptic Static':
    'Require=powers.Mindlink ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -4" ' +
    'InitialCost=15 ' +
    'MaintenanceCost=10/rd ' +
    'Description="60\' radius interferes w/psionic activity"',
  'Taste Link':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -2" ' +
    'Preparation=1 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=4/tn ' +
    'Description="Allows self to tastes through a contact\'s tongue"',
  'Telempathic Projection':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -2" ' +
    'Preparation=1 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=4/rd ' +
    'Description=' +
      '"Amplifies or dampens the emotions of contacts in a 15\' radius"',
  'Thought Shield':
    'Require=powers.Mindlink ' +
    'Discipline=Telepathy ' +
    'Type=Defense ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=1 ' +
    'Description="Protects self from psionic attacks"',
  'Truthear':
    'Require=powers.Mindlink ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'InitialCost=4 ' +
    'MaintenanceCost=2/rd ' +
    'Description="Allows self to detect lies"',
  'Appraise':
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'PowerScore="Intelligence -4" ' +
    'InitialCost=14 ' +
    'Description=' +
      '"Allows self to determine the likelihood of success of a proposed action"',
  'Aura Alteration':
    'Require="powers.Psychic Surgery","level >= 5" ' +
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'PowerScore="Wisdom -4" ' +
    'Preparation=5 ' +
    'InitialCost=10 ' +
    'Description=' +
      '"Masks touched\'s alignment or level for 1d6 hr or removes a curse or geas"',
  'Empower':
    'Require="level >= 10" ' +
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'PowerScore="Wisdom -12" ' +
    'InitialCost=150 ' +
    'Description="Imbues touched object with Intelligence and psionic power"',
  'Psychic Clone':
    'Require=' +
      'powers.Clairaudience,' +
      'powers.Clairvoyance,' +
      '"powers.Psychic Messenger",' +
      '"level >= 5" ' +
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'PowerScore="Wisdom -8" ' +
    'Preparation=10 ' +
    'InitialCost=50 ' +
    'MaintenanceCost=5/rd ' +
    'Description="Extracts self psyche into an insubstantial form"',
  'Psychic Surgery':
    'Require=disciplines.Telepathy,powers.Contact ' +
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'PowerScore="Wisdom -5" ' +
    'Preparation=10 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=10/tn ' +
    'Description=' +
      '"Repairs psychic damage to a touched contact or makes a telepathic power permanent"',
  'Split Personality':
    'Require="powers.Psychic Surgery","level >= 10" ' +
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'PowerScore="Wisdom -5" ' +
    'Preparation=1 ' +
    'InitialCost=40 ' +
    'MaintenanceCost=6/rd ' +
    'Description="Allows self to use 2 powers each rd"',
  'Ultrablast':
    'Require="level >= 10" ' +
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'PowerScore="Wisdom -10" ' +
    'Preparation=3 ' +
    'InitialCost=75 ' +
    'Description=' +
      '"Inflicts unconsciousness (Paralyzation save neg) and loss of psionic power (Paralyzation save neg) in a 50\' radius"',
  'Cannibalize':
    'Require="level >= 5" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore=Constitution ' +
    'InitialCost=0 ' +
    'Description="Allows self to convert Constitution points into 8x PSP; recovery requires 1 wk/point"',
  'Convergence':
    'Require=powers.Contact,"level >= 4" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'Preparation=1 ' +
    'InitialCost=8 ' +
    'Description=' +
      '"R10\' Creates a joint psionic defense among multiple psionicists"',
  'Enhancement':
    'Require="level >= 6" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'Preparation=5 ' +
    'InitialCost=30 ' +
    'MaintenanceCost=8/rd ' +
    'Description=' +
      '"Allows self to gain +2 power scores in chosen discipline and suffer -1 in others"',
  'Gird':
    'Require="level >= 3" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -3" ' +
    'InitialCost=0 ' +
    'Description=' +
      '"Maintains chosen powers w/out concentration at double normal cost"',
  'Intensify':
    'Require="level >= 3" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="variable -3" ' +
    'Preparation=1 ' +
    'InitialCost=5 ' +
    'MaintenanceCost=1/rd ' +
    'Description=' +
      '"Allows self to gain a psionic increase in Intelligence, Wisdom, or Constitution; inflicts an equal decrease in the others"',
  'Magnify':
    'Require="level >= 6" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -5" ' +
    'Preparation=5 ' +
    'InitialCost=25 ' +
    'MaintenanceCost=1/rd ' +
    'Description="Doubles the effects of a chosen power"',
  'Martial Trance':
    'Require="level >= 3" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'Preparation=1 ' +
    'InitialCost=7 ' +
    'Description="Gives self +1 telepathy scores"',
  'Prolong':
    'Require="level >= 4" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'InitialCost=5 ' +
    'MaintenanceCost=2/rd ' +
    'Description="Increases the range and area of powers by 50%"',
  'Psionic Inflation':
    'Require="level >= 3" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -5" ' +
    'Preparation=1 ' +
    'InitialCost=20 ' +
    'MaintenanceCost=3/rd ' +
    'Description="100\' radius doubles the cost of psionic powers for others"',
  'Psionic Sense':
    'Require=disciplines.Telepathy ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=4 ' +
    'MaintenanceCost=1/rd ' +
    'Description="R200\' Allows self to detect psionic activity"',
  'Psychic Drain':
    'Require=disciplines.Telepathy,powers.Contact,"level >= 6" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -6" ' +
    'InitialCost=10 ' +
    'Description="Self may power psionic powers by draining sleeping contacts\' Constitution, Intelligence, or Wisdom for 10x PSP"',
  'Receptacle':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -5" ' +
    'Preparation=1 ' +
    'InitialCost=0 ' +
    'Description="Allows self to store PSP in an object for later use"',
  'Retrospection':
    'Require=powers.Convergence,"level >= 7" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'Preparation=10 ' +
    'InitialCost=120 ' +
    'Description="Allows three psionicists to learn historical information"',
  'Splice':
    'Require="level >= 2" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -2" ' +
    'InitialCost=5 ' +
    'MaintenanceCost=1/rd ' +
    'Description="Allows the simultaneous use of multiple powers"',
  'Stasis Field':
    'Require="level >= 8" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'Preparation=3 ' +
    'InitialCost=20 ' +
    'MaintenanceCost=20/rd ' +
    'Description="Slows time in a %{levels.Psionicist*3}\' radius"',
  'Wrench':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=15 ' +
    'MaintenanceCost=8/rd ' +
    'Description="R30\' Forces a multi-planar target into a single plane"'
};
OSPsionics.SKILLS = {
  'Harness Subconscious':'Ability=wisdom Modifier=-1 Class=Psionicist',
  'Hypnosis':'Ability=charisma Modifier=-2 Class=Psionicist',
  'Meditative Focus':'Ability=wisdom Modifier=1 Class=Psionicist',
  'Rejuvenation':'Ability=wisdom Modifier=-1 Class=Psionicist'
};

/* Defines rules related to psionics use. */
OSPsionics.psionicsRules = function(rules, firstEdition) {

  let classes = Object.assign({}, firstEdition ? {} : OSPsionics.CLASSES);
  let disciplines = Object.assign({}, OSPsionics.DISCIPLINES);
  let features = Object.assign({}, OSPsionics.FEATURES);
  let goodies = Object.assign({}, OSPsionics.GOODIES);
  let powers = Object.assign({}, OSPsionics.POWERS);
  let skills = Object.assign({}, firstEdition ? {} : OSPsionics.SKILLS);

  QuilvynUtils.checkAttrTable(disciplines, []);
  QuilvynUtils.checkAttrTable
    (powers, ['Require', 'Discipline', 'Type', 'PowerScore', 'Preparation', 'InitialCost', 'MaintenanceCost', 'Description']);

  OldSchool.identityRules(rules, {}, classes, {});
  for(let c in classes)
    OSPsionics.classRulesExtra(rules, c);
  OldSchool.talentRules(rules, features, goodies, {}, skills);
  for(let d in disciplines)
    OSPsionics.choiceRules(rules, 'Discipline', d, disciplines[d]);
  for(let p in powers)
    OSPsionics.choiceRules(rules, 'Power', p, powers[p]);

  QuilvynRules.validAllocationRules
    (rules, 'discipline', 'psionicDisciplineCount', 'Sum "^disciplines\\."');
  rules.defineRule
    ('features.Psionic Talent', 'psionicTalent', '=', 'source ? 1 : null');
  rules.defineChoice('choices', 'Discipline', 'Power');
  rules.defineChoice('random', 'disciplines', 'powers');
  rules.choiceEditorElements = OSPsionics.choiceEditorElements;
  if(!firstEdition) {
    rules.defineRule('classSkill.Gem Cutting', 'levels.Psionicist', '=', '1');
    rules.defineRule
      ('classSkill.Musical Instrument', 'levels.Psionicist', '=', '1');
    rules.defineRule
      ('classSkill.Reading And Writing', 'levels.Psionicist', '=', '1');
    rules.defineRule('classSkill.Religion', 'levels.Psionicist', '=', '1');
  }
  rules.defineChoice('preset', 'psionicTalent:Psionic Talent,checkbox,');

  // Add items to character sheet
  rules.defineEditorElement
    ('psionicTalent', 'Psionic Talent', 'checkbox', [''], 'spells');
  rules.defineEditorElement
    ('disciplines', 'Disciplines', 'set', 'disciplines', 'spells');
  rules.defineEditorElement('powers', 'Powers', 'set', 'powers', 'spells');
  rules.defineSheetElement('Disciplines', 'Spell Points+', null, '; ');
  rules.defineSheetElement('Psionic Strength Points', 'Disciplines+');
  // defineSheetElement doesn't allow specification of columns; have to access
  // viewers directly
  let element = {
    name:'Powers', format: '<b>Powers</b>:\n%V', before:'Spells',
    separator: '\n', columns:'1L'
  };
  for(let v in rules.viewers)
    rules.viewers[v].addElements(element);

};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
OSPsionics.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Discipline')
    OSPsionics.disciplineRules(rules, name);
  else if(type == 'Power')
    OSPsionics.powerRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Discipline'),
      QuilvynUtils.getAttrValue(attrs, 'Type'),
      QuilvynUtils.getAttrValue(attrs, 'PowerScore'),
      QuilvynUtils.getAttrValue(attrs, 'Preparation'),
      QuilvynUtils.getAttrValue(attrs, 'InitialCost'),
      QuilvynUtils.getAttrValue(attrs, 'MaintenanceCost'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  rules.addChoice(type.toLowerCase() + 's', name, attrs);
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the abilities passed to classRules.
 */
OSPsionics.classRulesExtra = function(rules, name) {
  let classLevel = 'levels.' + name;
  if(name == 'Psionicist') {
    rules.defineRule
      ('psionicDisciplineCount', 'magicNotes.psionicPowers', '+=', null);
    rules.defineRule
      ('psionicScienceCount', 'magicNotes.psionicPowers.1', '+=', null);
    rules.defineRule
      ('psionicDevotionCount', 'magicNotes.psionicPowers.2', '+=', null);
    rules.defineRule
      ('psionicDefenseCount', 'magicNotes.psionicPowers.3', '+=', null);
    rules.defineRule('magicNotes.psionicPowers',
      classLevel, '+=', 'Math.floor((source + 6) / 4)'
    );
    rules.defineRule('magicNotes.psionicPowers.1',
      classLevel, '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('magicNotes.psionicPowers.2',
      classLevel, '+=', 'source>=4 ? source + 5 : (source * 2 + 1)'
    );
    rules.defineRule('magicNotes.psionicPowers.3',
      classLevel, '+=', 'Math.min(Math.floor((source + 1) / 2), 5)'
    );
    rules.defineRule('magicNotes.constitutionPsionicStrengthPointsBonus',
      classLevel, '?', null,
      'constitution', '=', 'source>=16 ? source - 15 : null'
    );
    rules.defineRule('magicNotes.intelligencePsionicStrengthPointsBonus',
      classLevel, '?', null,
      'intelligence', '=', 'source>=16 ? source - 15 : null'
    );
    rules.defineRule('magicNotes.wisdomPsionicStrengthPoints',
      classLevel, '?', null,
      'wisdom', '=', '20 + (source - 15) * 2',
      'levelPsionicStrengthPoints', '+', null
    );
    rules.defineRule('levelPsionicStrengthPoints',
      classLevel, '=', 'source - 1',
      'wisdom', '*', 'source - 5'
    );
    rules.defineRule('psionicStrengthPoints',
      'magicNotes.wisdomPsionicStrengthPoints', '=', null,
      'magicNotes.constitutionPsionicStrengthPointsBonus', '+', null,
      'magicNotes.intelligencePsionicStrengthPointsBonus', '+', null
    );
  }
};

/* Defines in #rules# the rules associated with discipline #name#. */
OSPsionics.disciplineRules = function(rules, name) {
  if(!name) {
    console.log('Empty discipline name');
    return;
  }
  // No rules pertain to discipline
};

/*
 * Defines in #rules# the rules associated with psionic power #name# from
 * discipline #discipline#, which has optional prerequisites #require#, type
 * #type# ('Science', 'Devotion', or 'Defense'), power score #powerScore# (an
 * ability name optionally followed by a positive or negative modifier),
 * requires #preparation# time to prepare (may be undefined if no prep
 * required), initial cost #initialCost#, and, optionally, maintenance cost
 * #maintenanceCost#. #description# is a brief description of the power's
 * effects.
 */
OSPsionics.powerRules = function(
  rules, name, requires, discipline, type, powerScore, preparation,
  initialCost, maintenanceCost, description
) {
  if(!name) {
    console.log('Empty power name');
    return;
  }
  if(!Array.isArray(requires)) {
    console.log('Bad requires list "' + requires + '" for power ' + name);
    return;
  }
  if(!((discipline + '') in rules.getChoices('disciplines'))) {
    console.log('Bad discipline "' + discipline + '" for power ' + name);
    return;
  }
  if(!(type + '').match(/^(Science|Devotion|Defense)$/i)) {
    console.log('Bad type "' + type + '" for power ' + name);
    return;
  }
  if(typeof(powerScore) != 'string' ||
     !powerScore.match(/\w+\s*([-+]\s*\d+)?$/) ||
     !(powerScore.replace(/\s*[-+].*/, '').toLowerCase() == 'variable' ||
       powerScore.replace(/\s*[-+].*/, '').toLowerCase() in OldSchool.ABILITIES)) {
    console.log('Bad power score "' + powerScore + '" for power ' + name);
    return;
  }
  if(preparation &&
     typeof(preparation) != 'number' &&
     typeof(preparation) != 'string') {
    console.log('Bad preparation "' + preparation + '" for power ' + name);
    return;
  }
  if(!(initialCost+'').match(/^variable$/i) &&
     typeof(initialCost) != 'number') {
    console.log('Bad initialCost "' + initialCost + '" for power ' + name);
    return;
  }
  if(maintenanceCost && typeof(maintenanceCost) != 'string') {
    console.log('Bad maintenanceCost "' + maintenanceCost + '" for power ' + name);
    return;
  }
  if(typeof(description) != 'string') {
    console.log('Bad description "' + description + '" for power ' + name);
    return;
  }

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  if(requires.length > 0)
    QuilvynRules.prerequisiteRules
      (rules, 'validation', prefix + 'Power', 'powers.' + name, requires);

  let ability = powerScore.replace(/\s*[-+].*/, '');
  let modifier = powerScore.replace(/^[^-+]*/, '').replaceAll(' ', '');
  let testAndCost;

  if(ability.match(/^variable$/i))
    testAndCost = 'Variable' + modifier;
  else
    testAndCost =
      ability.substring(0, 3) + modifier + ' (%{' + ability.toLowerCase() + modifier + '})';
  testAndCost += '; ' + initialCost + (maintenanceCost ? '+' + maintenanceCost: '') + ' PSP';
  if(preparation)
    testAndCost += '; Prep ' + preparation;
  rules.defineChoice
    ('notes', 'powers.' + name + ':(' + testAndCost + ') ' + description);

};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
OSPsionics.choiceEditorElements = function(rules, type) {
  let result = [];
  if(type == 'Discipline')
    ; // empty
  else if(type == 'Power')
    result.push(
      ['Require', 'Prerequisite', 'text', [40]],
      ['Discipline', 'Discipline', 'select-one', QuilvynUtils.getKeys(rules.getChoices('disciplines'))],
      ['Type', 'Type', 'select-one', ['Defense', 'Devotion', 'Science']],
      ['PowerScore', 'Power Score', 'text', [20]],
      ['InitialCost', 'Initial Cost', 'text', [10]],
      ['MaintenanceCost', 'Maintenance Cost', 'text', [10]],
      ['Description', 'Description', 'text', [60]]
    );
  else
   result = OSRIC.choiceEditorElements(rules, type);
  return result;
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
OSPsionics.randomizeOneAttribute = function(attributes, attribute) {
  let attr;
  let attrs;
  let choices;
  let howMany;
  let i;
  if(attribute == 'disciplines') {
    attrs = this.applyRules(attributes);
    howMany = attrs.psionicDisciplineCount || 0;
    choices = [];
    for(attr in this.getChoices('disciplines')) {
      if('disciplines.' + attr in attrs)
        howMany--;
      else
        choices.push(attr);
    }
    while(howMany > 0 && choices.length > 0) {
      i = QuilvynUtils.random(0, choices.length - 1);
      attributes['disciplines.' + choices[i]] = 1;
      choices.splice(i, 1);
      howMany--;
    }
  } else if(attribute == 'powers') {
    attrs = this.applyRules(attributes);
    let allowedDisciplines = {};
    let chooseWildDevotion = attributes.psionicTalent != null;
    for(attr in attrs) {
      if(attr.match(/^disciplines\./)) {
        allowedDisciplines[attr.replace('disciplines.', '')] = 1;
        chooseWildDevotion = false;
      }
    }
    let allPowers = this.getChoices('powers');
    ['Science', 'Devotion', 'Defense'].forEach(type => {
      howMany = attrs['psionic' + type + 'Count'] || 0;
      choices = [];
      for(attr in allPowers) {
        if(!allPowers[attr].includes('Type=' + type))
          continue;
        let discipline =
          QuilvynUtils.getAttrValue(allPowers[attr], 'Discipline');
        if(type != 'Defense' && !(discipline in allowedDisciplines))
          continue;
        if('powers.' + attr in attrs)
          howMany--;
        else
          choices.push(attr);
      }
      while(howMany > 0 && choices.length > 0) {
        i = QuilvynUtils.random(0, choices.length - 1);
        attr = choices[i];
        let prereq = QuilvynUtils.getAttrValueArray(allPowers[attr], 'Require');
        if(prereq.length == 0 || new Expr(prereq.join('&&')).eval(attrs)) {
          attributes['powers.' + attr] = 1;
          attrs['powers.' + attr] = 1;
          howMany--;
        }
        choices.splice(i, 1);
      }
    });
    if(chooseWildDevotion) {
      choices = [];
      howMany = 1;
      for(attr in allPowers) {
        if(!allPowers[attr].includes('Type=Devotion'))
          continue;
        if('powers.' + attr in attrs)
          howMany--;
        else
          choices.push(attr);
      }
      if(howMany > 0 && choices.length > 0) {
        let toAdd = [choices[QuilvynUtils.random(0, choices.length - 1)]];
        while(toAdd.length > 0) {
          attr = toAdd.shift();
          if(!(attr in allPowers)) {
            console.log('Unknown power "' + attr + '"');
            continue;
          }
          attributes['powers.' + attr] = 1;
          QuilvynUtils.getAttrValueArray(allPowers[attr], 'Require').forEach(p => {
            if(p.startsWith('powers.'))
              toAdd.push(p.replace('powers.', ''));
          });
        }
      }
    }
  }
};

/* Returns HTML body content for user notes associated with this rule set. */
OSPsionics.ruleNotes = function() {
  return '' +
    '<h2>Quilvyn Old School Psionics Supplement Notes</h2>\n' +
    'Quilvyn Old School Psionics Supplement Version ' + OSPsionics.VERSION + '\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    'Quilvyn\'s Old School Psionics Supplement is unofficial ' +
    'Fan Content permitted under Wizards of the Coast\'s ' +
    '<a href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</a>.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Wizards of the Coast. Portions ' +
    'of the materials used are property of Wizards of the Coast. ©Wizards of ' +
    'the Coast LLC.\n' +
    '</p><p>\n' +
    'The Complete Psionics Handbook © 1991 TSR, Inc.\n' +
    '</p><p>\n' +
    'Advanced Dungeons & Dragons Players Handbook © 2012 Wizards of the ' +
    'Coast LLC.\n' +
    '</p>\n';
};
