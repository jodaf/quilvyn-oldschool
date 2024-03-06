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
/* globals OldSchool, QuilvynRules, QuilvynUtils */
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
    'Note="May access 1 or more powers/Has %V Psionic Strength Points"',
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
    'MaintenanceCost=9 ' +
    'Description="R50\' Self learns 2 targets\' alignment or level"',
  'Clairaudience':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=4 ' +
    'Description="Self hears known location"',
  'Clairvoyance':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=7 ' +
    'MaintenanceCost=4 ' +
    'Description="Self sees known location"',
  'Object Reading':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'PowerScore="Wisdom -5" ' +
    'Preparation=1 ' +
    'InitialCost=16 ' +
    'Description="Self learns info about target object\'s prior owner"',
  'Precognition':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'PowerScore="Wisdom -5" ' +
    'Preparation=5 ' +
    'InitialCost=24 ' +
    'Description=' +
      '"Self learns probable outcome of action over the next few hours"',
  'Sensitivity To Psychic Impressions':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'PowerScore="Wisdom -4" ' +
    'Preparation=2 ' +
    'InitialCost=12 ' +
    'MaintenanceCost=2 ' +
    'Description="Self learns history of 60\' radius"',
  'All-Round Vision':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=4 ' +
    'Description=' +
      '"Self gains vision in all directions, suffers -4 save vs. gaze"',
  'Combat Mind':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -4" ' +
    'InitialCost=5 ' +
    'MaintenanceCost=4 ' +
    'Description="Self gains -1 initiative"',
  'Danger Sense':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=4 ' +
    'MaintenanceCost=3/tn ' +
    'Description="R10\' Self detects nearby hazards and threats"',
  'Feel Light':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=7 ' +
    'MaintenanceCost=5 ' +
    'Description="Self sees via skin"',
  'Feel Sound':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=5 ' +
    'MaintenanceCost=3 ' +
    'Description="Self hears via skin, gains +2 save vs. sonic"',
  'Hear Light':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=3 ' +
    'Description="Self sees via ears"',
  'Know Direction':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore=Intelligence ' +
    'InitialCost=1 ' +
    'Description="Self determines north"',
  'Know Location':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore=Intelligence ' +
    'Preparation=5 ' +
    'InitialCost=10 ' +
    'Description="Self learns general location"',
  'Poison Sense':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'InitialCost=1 ' +
    'Description="R1\' Self detects presence of poison"',
  'Radial Navigation':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -3" ' +
    'InitialCost=4 ' +
    'MaintenanceCost=7/hr ' +
    'Description="Self knows distance and direction from starting point"',
  'See Sound':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=3 ' +
    'Description="Self hears via eyes"',
  'Spirit Sense':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=10 ' +
    'Description="R15\' Self detects presence of spirits"',
  'Create Object':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Science ' +
    'PowerScore="Intelligence -4" ' +
    'InitialCost=16 ' +
    'MaintenanceCost=3 ' +
    'Description="R20\' Creates object up to 10 lbs and 4\' diameter"',
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
    'Description="R50\' Target obliterated (Death save neg)"',
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
    'MaintenanceCost=1 ' +
    'Description="R30\' Target object moves 60\'/rd"',
  'Animate Object':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -3" ' +
    'InitialCost=8 ' +
    'MaintenanceCost=3 ' +
    'Description="R50\' Target up to 100 lb moves up to 60\'/rd as if alive"',
  'Animate Shadow':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=7 ' +
    'MaintenanceCost=3 ' +
    'Description="R40\' Target 100\' sq shadow moves independently of source"',
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
    'MaintenanceCost=8 ' +
    'Description="R80\' Self controls target\'s movements (Strength save neg)"',
  'Control Flames':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -1" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=3 ' +
    'Description=' +
      '"R40\' Target 10\' sq flame doubles or halves size and/or heat"',
  'Control Light':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore=Intelligence ' +
    'InitialCost=12 ' +
    'MaintenanceCost=4 ' +
    'Description="R25\' Target 400\' sq area brightens or dims"',
  'Control Sound':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -5" ' +
    'InitialCost=5 ' +
    'MaintenanceCost=2 ' +
    'Description="R100\' Modifies existing sounds"',
  'Control Wind':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'Preparation=2 ' +
    'InitialCost=16 ' +
    'MaintenanceCost=10 ' +
    'Description=' +
      '"R500\' Changes speed and direction of wind, up to 10 MPH and 90 degrees"',
  'Create Sound':
    'Require=powers.Telekinesis,"powers.Control Sound" ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -7" ' +
    'InitialCost=8 ' +
    'MaintenanceCost=3 ' +
    'Description="R100\' Creates sound up to group shouting"',
  'Inertial Barrier':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=7 ' +
    'MaintenanceCost=5 ' +
    'Description=' +
      '"R3\' Barrier reduces damage from missiles, flames, breath, and gas"',
  'Levitation':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=12 ' +
    'MaintenanceCost=2 ' +
    'Description="Self ascend or descend up to 60\'/rd"',
  'Molecular Agitation':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'InitialCost=7 ' +
    'MaintenanceCost=6 ' +
    'Description="R40\' Heats targets"',
  'Molecular Manipulation':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -3" ' +
    'Preparation=1 ' +
    'InitialCost=6 ' +
    'MaintenanceCost=5 ' +
    'Description="R15\' Creates weak spot in target"',
  'Soften':
    'Require=powers.Telekinesis ' +
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'PowerScore=Intelligence ' +
    'InitialCost=4 ' +
    'MaintenanceCost=3 ' +
    'Description="R30\' Target object softens"',
  'Animal Affinity':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'PowerScore="Constitution -4" ' +
    'InitialCost=15 ' +
    'MaintenanceCost=4 ' +
    'Description="Self gains one attribute of affinity animal"',
  'Complete Healing':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'PowerScore=Constitution ' +
    'Preparation="1 dy" ' +
    'InitialCost=30 ' +
    'Description="Self healed of all ailments, wounds, and normal disease"',
  'Death Field':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'PowerScore="Constitution -8" ' +
    'Preparation=3 ' +
    'InitialCost=40 ' +
    'Description=' +
      '"R20\' All in range lose specified number of HP (Death save neg)"',
  'Energy Containment':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'PowerScore="Constitution -2" ' +
    'InitialCost=10 ' +
    'Description=' +
      '"Self doubles saves and takes half damage vs. specified energy"',
  'Life Draining':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=11 ' +
    'MaintenanceCost=5 ' +
    'Description=' +
      '"Transfers 1d6 HP/rd from touched to self, raising self HP up to %{hitPoints+10}"',
  'Metamorphosis':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'PowerScore="Constitution -6" ' +
    'Preparation=5 ' +
    'InitialCost=21 ' +
    'MaintenanceCost=1/tn ' +
    'Description="Self transforms into object of approximately same mass"',
  'Shadow-form':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'PowerScore="Constitution -6" ' +
    'InitialCost=12 ' +
    'MaintenanceCost=3 ' +
    'Description="Self transforms into shadow"',
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
    'MaintenanceCost=4 ' +
    'Description="Self gains 1d6 Strength, Dexterity, or Constitution"',
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
    'MaintenanceCost=3 ' +
    'Description=' +
      '"Self gains -1 AC, damage from attacks on self reduced by 2 HP"',
  'Body Control':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'InitialCost=7 ' +
    'MaintenanceCost=5/tn ' +
    'Description="Self becomes comfortable in extreme environment"',
  'Body Equilibrium':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=2 ' +
    'MaintenanceCost=2 ' +
    'Description=' +
      '"Self becomes very light, can walk on water or fragile surfaces, takes no damage from falling"',
  'Body Weaponry':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=9 ' +
    'MaintenanceCost=4 ' +
    'Description="Self arm becomes chosen weapon"',
  'Catfall':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Dexterity -2" ' +
    'InitialCost=4 ' +
    'Description=' +
      '"Self drops 30\' w/out damage, takes half damage from longer fall"',
  'Cause Decay':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -2" ' +
    'InitialCost=4 ' +
    'Description="Touched object decays or rusts"',
  'Cell Adjustment':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=5 ' +
    'MaintenanceCost=20 ' +
    'Description="Cures touched of disease"',
  'Chameleon Power':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -1" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=3 ' +
    'Description="Self skin and clothes blend into background"',
  'Chemical Simulation':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'Preparation=1 ' +
    'InitialCost=9 ' +
    'MaintenanceCost=6 ' +
    'Description="Touch causes acid effects"',
  'Displacement':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=3 ' +
    'Description="Self gains -2 AC"',
  'Double Pain':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=7 ' +
    'Description="Touched takes double damage, regains half after 1 tn"',
  'Ectoplasmic Form':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'Preparation=1 ' +
    'InitialCost=9 ' +
    'MaintenanceCost=9 ' +
    'Description="Self becomes insubstantial"',
  'Enhanced Strength':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=2 ' +
    'MaintenanceCost=1 ' +
    'Description="Self strength increases"',
  'Expansion':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -2" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=1 ' +
    'Description="Self dimension increased 50%-400%"',
  'Flesh Armor':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'InitialCost=8 ' +
    'MaintenanceCost=4 ' +
    'Description="Self skin becomes armor"',
  'Graft Weapon':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -5" ' +
    'InitialCost=10 ' +
    'MaintenanceCost=1 ' +
    'Description="Self weapon gains +1 attack and damage"',
  'Heightened Senses':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore=Constitution ' +
    'InitialCost=5 ' +
    'MaintenanceCost=1 ' +
    'Description=' +
      '"Self gains increased notice, tracking, hearing, poison detection, and touch identification"',
  'Immovability':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -5" ' +
    'InitialCost=9 ' +
    'MaintenanceCost=6 ' +
    'Description=' +
      '"Self moved only by combined strength of %{(constitution-5)*10}"',
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
    'Description="Self needs no food, water, or sleep"',
  'Reduction':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -2" ' +
    'InitialCost=1 ' +
    'MaintenanceCost=1 ' +
    'Description="Reduces self dimension down to 1\'"',
  'Share Strength':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=2 ' +
    'Description="Transfers strength from self to touched"',
  'Suspend Animation':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'Preparation=5 ' +
    'InitialCost=12 ' +
    'Description="Self or touched appears dead"',
  'Banishment':
    'Require=powers.Teleport ' +
    'Discipline=Psychoportation ' +
    'Type=Science ' +
    'PowerScore="Intelligence -1" ' +
    'InitialCost=30 ' +
    'MaintenanceCost=10 ' +
    'Description="R5\' Target banished to pocket dimension"',
  'Probability Travel':
    'Discipline=Psychoportation ' +
    'Type=Science ' +
    'PowerScore=Intelligence ' +
    'Preparation=2 ' +
    'InitialCost=20 ' +
    'MaintenanceCost=8/hr ' +
    'Description="Self travels astral plane"',
  'Summon Planar Creature':
    'Require=powers.Teleport ' +
    'Discipline=Psychoportation ' +
    'Type=Science ' +
    'PowerScore="Intelligence -4" ' +
    'Preparation=12 ' +
    'InitialCost=45 ' + // TODO or 90
    'Description="R200\' Brings and controls creature from another plane"',
  'Teleport':
    'Discipline=Psychoportation ' +
    'Type=Science ' +
    'PowerScore=Intelligence ' +
    'InitialCost=10 ' +
    'Description="Transfer self to familiar location"',
  'Teleport Other':
    'Require=powers.Teleport ' +
    'Discipline=Psychoportation ' +
    'Type=Science ' +
    'PowerScore="Intelligence -2" ' +
    'InitialCost=20 ' +
    'Description="R10\' Transfers target to familiar location"',
  'Astral Projection':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'PowerScore=Intelligence ' +
    'Preparation=1 ' +
    'InitialCost=6 ' +
    'MaintenanceCost=2/hr ' +
    'Description="Astral copy of self travels astral plane"',
  'Dimensional Door':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -1" ' +
    'InitialCost=4 ' +
    'MaintenanceCost=2 ' +
    'Description=' +
      '"R50\' Creates a pair of portals that teleport users between them, followed by 1 rd dazed"',
  'Dimension Walk':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -2" ' +
    'Preparation=2 ' +
    'InitialCost=8 ' +
    'MaintenanceCost=4/tn ' +
    'Description=' +
      '"Self travels 7 miles/tn via parallel dimension; failed Wisdom check randomizes exit point"',
  'Dream Travel':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=1 ' +
    'Description="R500 miles Self and companions travel during sleep"',
  'Teleport Trigger':
    'Require=powers.Teleport ' +
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence +1" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=2/hr ' +
    'Description="Trigger teleports self to safe location"',
  'Time Shift':
    'Require=powers.Teleport ' +
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'PowerScore=Intelligence ' +
    'InitialCost=16 ' +
    'Description="Self travels up to three rounds into the future"',
  'Time/Space Anchor':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'PowerScore=Intelligence ' +
    'InitialCost=5 ' +
    'MaintenanceCost=1 ' +
    'Description="Creature in 3\' radius cannot be involuntarily teleported"',
  'Domination':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=6 ' +
    'MaintenanceCost=6 ' +
    'Description="R30\' Self controls contact\'s actions (Spell save neg)"',
  'Ejection':
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=2 ' + // TODO or more
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
      '"Self share pain and HP loss w/contact (Death save avoids sharing death)"',
  'Mass Domination':
    'Require=powers.Mindlink,powers.Contact,powers.Domination ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Wisdom -6" ' +
    'Preparation=2 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=2+ ' +
    'Description="R40\' Self controls 5 contacts\' actions (Spell save neg)"',
  'Mindlink':
    'Require=powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Wisdom -5" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=8 ' +
    'Description="Self converses telepathically w/contact"',
  'Mindwipe':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Intelligence -6" ' +
    'Preparation=1 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=8 ' +
    'Description=' +
      '"Touched contact suffers -1 intelligence, wisdom, and level (Spell save neg)"',
  'Probe':
    'Require=powers.ESP,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Wisdom -5" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=9 ' +
    'Description=' +
      '"R2\' Self gains access to all of contact\'s memories (Spell save neg)"',
  'Psychic Crush':
    'Require=powers.Mindlink ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=7 ' +
    'Description="R50\' Inflicts 1d8 HP upon contact (Paralyzation save neg)"',
  'Superior Invisibility':
    'Require=powers.Mindlink,powers.Contact,powers.Invisibility ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Intelligence -5" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=5 ' +
    'Description="Contact cannot see, hear, or smell self"',
  'Switch Personality':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'PowerScore="Constitution -4" ' +
    'Preparation=3 ' +
    'InitialCost=30 ' +
    'Description=' +
      '"Self exchanges minds with touched contact, both become comatose (System Shock neg) and lose 1 constitution/dy (Con neg)"',
  'Tower Of Iron Will':
    'Require=powers.Mindlink ' +
    'Discipline=Telepathy ' +
    'Type=Defense ' +
    'PowerScore="Wisdom -2" ' +
    'InitialCost=6 ' +
    'Description="R1\' Creates psionic defense"',
  'Attraction':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=8 ' +
    'Description="R200\' Contact overwhelmingly drawn to chosen item"',
  'Aversion':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=8/tn ' +
    'Description=' +
      '"R200\' Contact overwhelmingly repelled by chosen item for 1 tn"',
  'Awe':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Charisma -2" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=4 ' +
    'Description="Contacts will flee or obey self (Spell save neg)"',
  'Conceal Thoughts':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'InitialCost=5 ' +
    'MaintenanceCost=3 ' +
    'Description="Self becomes shielded from mental probing"',
  'Contact':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'InitialCost=3 ' +
    'MaintenanceCost=1 ' +
    'Description=' +
      '"Self psionically contacts known target (psionicist neg, others resist -2) to use other telepathic powers"',
  'Daydream':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'InitialCost=0 ' +
    'MaintenanceCost=3 ' +
    'Description=' +
      '"Contact becomes distracted (intelligence &gt; 14 neg, concentration neg)"',
  'Ego Whip':
    'Require=powers.Mindlink ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=4 ' +
    'Description=' +
      '"Establishes contact and dazes (-5 rolls) for 1d4 rd target psionicist"',
  'Empathy':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'InitialCost=1 ' +
    'MaintenanceCost=1 ' +
    'Description="Self senses desires and emotions of creatures in 20\' sq"',
  'ESP':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=6 ' +
    'Description="Self reads contact\'s surface thoughts"',
  'False Sensory Input':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -3" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=4 ' +
    'Description="Modifies contacts\'s sensory input"',
  'Id Insinuation':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=5 ' +
    'Description="Contact becomes unable to act for 1d4 rd"',
  'Identity Penetration':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=6 ' +
    'Description="Self learns contact\'s true identity"',
  'Incarnation Awareness':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=13 ' +
    'Description="Self learns about contact\'s past lives"',
  'Inflict Pain':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'Preparation=1 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=2 ' +
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
    'MaintenanceCost=5 ' +
    'Description=' +
      '"Contact believes any damage taken (rev damage dealt) is fatal"',
  'Invisibility':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -5" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=2 ' +
    'Description="R100\' Self invisible to contacts"',
  'Life Detection':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -2" ' +
    'InitialCost=3 ' +
    'MaintenanceCost=3 ' +
    'Description="R100\' Self detects living creatures"',
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
    'MaintenanceCost=4 ' +
    'Description=' +
      '"Self gains 75% resistance to mental magic, immunity to possession and non-contact psionic attacks"',
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
      '"Establishes contact w/target psionicist, or contact loses 1 power for 2d6 dy"',
  'Phobia Amplification':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -2" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=4 ' +
    'Description="Contact suffers overwhelming fear"',
  'Post-Hypnotic Suggestion':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -3" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=1 ' +
    'Description=' +
      '"Plants suggestion in target (intelligence &lt; 7 or &gt; 17 neg)"',
  'Psionic Blast':
    'Require=powers.Telekinesis ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -5" ' +
    'InitialCost=10 ' +
    'Description=' +
      '"Contact believes 80% of HP are lost for 6 tn (Death save neg)"',
  'Psychic Impersonation':
    'Require=powers.Mindlink,powers.Probe ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'Preparation="1 tn" ' +
    'InitialCost=10 ' +
    'MaintenanceCost=3/hr ' +
    'Description=' +
      '"Self mimic target\'s aura and thoughts, suffers -1 power scores"',
  'Psychic Messenger':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'Preparation=2 ' +
    'InitialCost=4 ' +
    'MaintenanceCost=3 ' +
    'Description="R200 miles Sends auditory and visual message"',
  'Repugnance':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -5" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=8 ' +
    'Description="R200\' Makes contact wish to destroy chosen item"',
  'Send Thoughts':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -1" ' +
    'InitialCost=0 ' +
    'MaintenanceCost=2 ' +
    'Description=' +
      '"Contact receives self thoughts (-2 attacks, save vs. spells to cast)"',
  'Sight Link':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'Preparation=1 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=5/tn ' +
    'Description="Self sees through contact\'s eyes"',
  'Sound Link':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -2" ' +
    'Preparation=1 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=4/tn ' +
    'Description="Self hears through contact\'s ears"',
  'Synaptic Static':
    'Require=powers.Mindlink ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -4" ' +
    'InitialCost=15 ' +
    'MaintenanceCost=10 ' +
    'Description="60\' radius interferes w/psionic activity"',
  'Taste Link':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -2" ' +
    'Preparation=1 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=4/tn ' +
    'Description="Self tastes through contact\'s tongue"',
  'Telempathic Projection':
    'Require=powers.Mindlink,powers.Contact ' +
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -2" ' +
    'Preparation=1 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=4 ' +
    'Description="Amplifies or dampens emotions of contacts in 15\' radius"',
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
    'MaintenanceCost=2 ' +
    'Description="Self detects lies"',
  'Appraise':
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'PowerScore="Intelligence -4" ' +
    'InitialCost=14 ' +
    'Description="Self determines likelihood of action success"',
  'Aura Alteration':
    'Require="powers.Psychic Surgery","level >= 5" ' +
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'PowerScore="Wisdom -4" ' +
    'Preparation=5 ' +
    'InitialCost=10 ' +
    'Description=' +
      '"Masks touched\'s alignment or level for 1d6 hr or removes curse or geas"',
  'Empower':
    'Require="level >= 10" ' +
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'PowerScore="Wisdom -12" ' +
    'InitialCost=150 ' +
    'Description="Imbues touched object with intelligence and psionic power"',
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
    'MaintenanceCost=5 ' +
    'Description="Extracts self psyche into insubstantial form"',
  'Psychic Surgery':
    'Require=disciplines.Telepathy,powers.Contact ' +
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'PowerScore="Wisdom -5" ' +
    'Preparation=10 ' +
    'InitialCost=0 ' +
    'MaintenanceCost=10/tn ' +
    'Description=' +
      '"Repairs psychic damage to touched contact or makes telepathic power permanent"',
  'Split Personality':
    'Require="powers.Psychic Surgery","level >= 10" ' +
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'PowerScore="Wisdom -5" ' +
    'Preparation=1 ' +
    'InitialCost=40 ' +
    'MaintenanceCost=6 ' +
    'Description="Self can use two powers each rd"',
  'Ultrablast':
    'Require="level >= 10" ' +
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'PowerScore="Wisdom -10" ' +
    'Preparation=3 ' +
    'InitialCost=75 ' +
    'Description=' +
      '"Inflicts unconsciousness (Paralyzation save neg) and loss of psionic power (Paralyzation save neg) in 50\' radius"',
  'Cannibalize':
    'Require="level >= 5" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore=Constitution ' +
    'InitialCost=0 ' +
    'Description="Self trades constitution points for 8x PSP, recovers 1/wk"',
  'Convergence':
    'Require=powers.Contact,"level >= 4" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore=Wisdom ' +
    'Preparation=1 ' +
    'InitialCost=8 ' +
    'Description=' +
      '"R10\' Creates joint psionic defense among multiple psionicists"',
  'Enhancement':
    'Require="level >= 6" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'Preparation=5 ' +
    'InitialCost=30 ' +
    'MaintenanceCost=8 ' +
    'Description=' +
      '"Self gains +2 power scores in chosen discipline, suffers -1 in others"',
  'Gird':
    'Require="level >= 3" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -3" ' +
    'InitialCost=0 ' +
    'Description="Maintains chosen powers w/out concentration at double cost"',
  'Intensify':
    'Require="level >= 3" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="variable -3" ' +
    'Preparation=1 ' +
    'InitialCost=5 ' +
    'MaintenanceCost=1 ' +
    'Description=' +
      '"Self trades psionic increase in intelligence, wisdom, or constitution for equal decrease in the others"',
  'Magnify':
    'Require="level >= 6" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -5" ' +
    'Preparation=5 ' +
    'InitialCost=25 ' +
    'MaintenanceCost=1 ' +
    'Description="Doubles effects of chosen power"',
  'Martial Trance':
    'Require="level >= 3" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'Preparation=1 ' +
    'InitialCost=7 ' +
    'Description="Trance grants +1 telepathy scores"',
  'Prolong':
    'Require="level >= 4" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -4" ' +
    'InitialCost=5 ' +
    'MaintenanceCost=2 ' +
    'Description="Increases range and area of powers by 50%"',
  'Psionic Inflation':
    'Require="level >= 3" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -5" ' +
    'Preparation=1 ' +
    'InitialCost=20 ' +
    'MaintenanceCost=3 ' +
    'Description="Doubles cost of psionic powers for others in 100\' radius"',
  'Psionic Sense':
    'Require=disciplines.Telepathy ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -3" ' +
    'InitialCost=4 ' +
    'MaintenanceCost=1 ' +
    'Description="R200\' Self detects psionic activity"',
  'Psychic Drain':
    'Require=disciplines.Telepathy,powers.Contact,"level >= 6" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -6" ' +
    'InitialCost=10 ' +
    'Description="Self powers psionic powers by draining sleeping contacts\' constitution, intelligence, or wisdom for x10 PSP"',
  'Receptacle':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -5" ' +
    'Preparation=1 ' +
    'InitialCost=0 ' +
    'Description="Self stores PSP in object for later use"',
  'Retrospection':
    'Require=powers.Convergence,"level >= 7" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'Preparation=10 ' +
    'InitialCost=120 ' +
    'Description="Self and two converged gain historical information"',
  'Splice':
    'Require="level >= 2" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Intelligence -2" ' +
    'InitialCost=5 ' +
    'MaintenanceCost=1 ' +
    'Description="Allows simultaneous use of multiple powers"',
  'Stasis Field':
    'Require="level >= 8" ' +
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Constitution -3" ' +
    'Preparation=3 ' +
    'InitialCost=20 ' +
    'MaintenanceCost=20 ' +
    'Description="Slows time in %{levels.Psionicist*3}\' radius"',
  'Wrench':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'PowerScore="Wisdom -4" ' +
    'InitialCost=15 ' +
    'MaintenanceCost=8 ' +
    'Description="R30\' Forces multi-planar target into single plane"'
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
  rules.defineRule
    ('magicNotes.psionicTalent', 'level', '=', '4 * (source - 1)');
  rules.defineRule
    ('psionicDisciplineCount', 'magicNotes.psionicTalent', '+=', '1');
  rules.defineRule
    ('psionicDevotionCount', 'magicNotes.psionicTalent', '+=', '1');
  rules.defineRule
    ('psionicStrengthPoints', 'magicNotes.psionicTalent', '+=', null);
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
  if(typeof(initialCost) != 'number') {
    console.log('Bad initialCost "' + initialCost + '" for power ' + name);
    return;
  }
  if(maintenanceCost &&
     typeof(maintenanceCost) != 'number' &&
     typeof(maintenanceCost) != 'string') {
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

  let ability = powerScore.replace(/\s*[-+].*/, '').toLowerCase();
  let modifier = powerScore.replace(/^[^-+]*/, '').replaceAll(' ', '');
  let testAndCost = ability.substring(0, 3) + modifier;
  if(ability != 'variable')
    testAndCost += ' (%{' + ability.toLowerCase() + modifier + '})';
  if(maintenanceCost && !(maintenanceCost + '').includes('/'))
    maintenanceCost += '/rd';
  testAndCost += '; ' + initialCost + (maintenanceCost ? '+' + maintenanceCost: '') + ' PSP';
  if(preparation)
    testAndCost += '; Prep ' + preparation;
  rules.defineChoice
    ('notes', 'powers.' + name + ':(' + testAndCost + ') ' + description);
  if(ability != 'variable')
    rules.defineRule('magicNotes.psionicTalent',
      'powers.' + name, '+',
      ability + (maintenanceCost ? (maintenanceCost+'').replace(/\/.*/, '') : 0) * 4
    );
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
      ['Discipline', 'Discipline', 'select-one', QuilvynUtils.getKeys(rules.getChoices('disciplines'))],
      ['Type', 'Type', 'select-one', ['Defense', 'Devotion', 'Science']],
      ['Score', 'Score', 'text', [20]],
      ['Cost', 'Cost', 'text', [20]],
      ['Description', 'Description', 'text', [40]]
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
    for(attr in attrs) {
      if(attr.match(/^disciplines\./))
        allowedDisciplines[attr.replace('disciplines.', '')] = 1;
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
        attributes['powers.' + choices[i]] = 1;
        choices.splice(i, 1);
        howMany--;
      }
    });
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
