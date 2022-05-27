/*
Copyright 2022, James J. Hayes

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
 * OSPsionics is a placeholder for the items and functions defined by
 * the plugin. OldSchool invokes this plugin's abilityRules and choiceRules
 * functions directly and overrides the values of ARMORS, SPELLS, etc. with the
 * values defined in this plugin.
 */
function OSPsionics() {
}

OSPsionics.VERSION = '2.3.1.0';

OSPsionics.CLASSES = {
  'Psionicist':
    'Require=' +
      '"alignment !~ \'Chaotic\'","constitution >= 11","intelligence >= 13",' +
      '"wisdom >= 15" ' +
    'HitDie=d6,9,2 Attack=0,1,2,- WeaponProficiency=2,5,4 ' +
    'NonweaponProficiency=3,3 ' +
    'Breath=16,1,4 Death=13,1,4 Petrification=10,1,4 Spell=15,2,4 Wand=15,2,4 '+
    'Features=' +
      '"Armor Proficiency (Hide/Leather/Studded Leather)",' +
      '"Shield Proficiency (Small)",' +
      '"Psionic Powers","Resist Enchantment" ' +
    'Experience=' +
      '0,2.2,4.4,8.8,16.5,30,55,100,200,400,600,800,1000,1200,1500,1800,2100,' +
      '2400,2700,3000'
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
    'Note="Access to %V disciplines, %1 sciences, %2 devotions, and %3 defense modes"',
  'Resist Enchantment':'Section=save Note="+2 vs. enchantment spells"'
};
OSPsionics.POWERS = {
  'Aura Sight':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'Score=wisdom,-5 ' +
    'Cost=9,9/rd ' +
    'Description="R50\' Self learns 2 targets\' alignment or level"',
  'Clairaudience':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'Score=wisdom,-3 ' +
    'Cost=6,4/rd ' +
    'Description="Self hears known location"',
  'Clairvoyance':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'Score=wisdom,-4 ' +
    'Cost=7,4/rd ' +
    'Description="Self sees known location"',
  'Object Reading':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'Score=wisdom,-5 ' +
    'Preparation=1 ' +
    'Cost=16 ' +
    'Description="Self learns info about target object\'s prior owner"',
  'Precognition':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'Score=wisdom,-5 ' +
    'Preparation=5 ' +
    'Cost=24 ' +
    'Description="Self learns outcome of action over the next few hours"',
  'Sensitivity To Psychic Impressions':
    'Discipline=Clairsentience ' +
    'Type=Science ' +
    'Score=wisdom,-4 ' +
    'Preparation=2 ' +
    'Cost=12,2/rd ' +
    'Description="Self learns history of area"',
  'All-Round Vision':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Cost=6,4/rd ' +
    'Description="Self gains 360-degree vision"',
  'Combat Mind':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'Score=intelligence,-4 ' +
    'Cost=5,4/rd ' +
    'Description="Self gains -1 initiative"',
  'Danger Sense':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Cost=4,3/tn ' +
    'Description="R10\' Self detects nearby hazard or threat"',
  'Feel Light':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Cost=7,5/rd ' +
    'Description="Self sees via skin"',
  'Feel Sound':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Cost=5,3/rd ' +
    'Description="Self hears via skin"',
  'Hear Light':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Cost=6,3/rd ' +
    'Description="Self sees via ears"',
  'Know Direction':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'Score=intelligence ' +
    'Cost=1 ' +
    'Description="Self determines north"',
  'Know Location':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'Score=intelligence ' +
    'Preparation=5 ' +
    'Cost=10 ' +
    'Description="Self learns general location"',
  'Poison Sense':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'Score=wisdom ' +
    'Preparation=5 ' +
    'Cost=1 ' +
    'Description="R1\' Self detects presence of poison"',
  'Radial Navigation':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'Score=intelligence,-3 ' +
    'Cost=4,7/hr ' +
    'Description="Self knows distance and direction of starting point"',
  'See Sound':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Cost=6,3/rd ' +
    'Description="Self hears via eyes"',
  'Spirit Sense':
    'Discipline=Clairsentience ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Cost=10 ' +
    'Description="R15\' Self detects presence of spirits"',
  'Create Object':
    'Discipline=Psychokinesis ' +
    'Type=Science ' +
    'Score=intelligence,-4 ' +
    'Cost=16,3/rd ' +
    'Description="R20\' Creates object up to 4\' diameter"',
  'Detonate':
    'Discipline=Psychokinesis ' +
    'Type=Science ' +
    'Score=constitution,-3 ' +
    'Cost=18 ' +
    'Description="R60\' 10\' radius inflicts 1d10 HP (Breath save half)"',
  'Disintegrate':
    'Discipline=Psychokinesis ' +
    'Type=Science ' +
    'Score=wisdom,-4 ' +
    'Cost=40 ' +
    'Description="R50\' Target obliterated (Death save neg)"',
  'Molecular Rearrangement':
    'Discipline=Psychokinesis ' +
    'Type=Science ' +
    'Score=intelligence,-5 ' +
    'Preparation="2 hr" ' +
    'Cost=20,10/hr ' +
    'Description="R2\' Converts 1 oz from one material to another"',
  'Project Force':
    'Discipline=Psychokinesis ' +
    'Type=Science ' +
    'Score=constitution,-2 ' +
    'Cost=10 ' +
    'Description="R200\' Remote punch inflicts 1d6+AC HP"',
  'Telekinesis':
    'Discipline=Psychokinesis ' +
    'Type=Science ' +
    'Score=wisdom,-3 ' +
    'Cost=3,1/rd ' +
    'Description="R30\' Target object moves 60\'/rd"',
  'Animate Object':
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'Score=intelligence,-3 ' +
    'Cost=8,3/rd ' +
    'Description="Target up to 100 lb moves as if alive"',
  'Animate Shadow':
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Cost=7,3/rd ' +
    'Description="R40\' Target shadow moves independently of source"',
  'Ballistic Attack':
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'Score=constitution,-2 ' +
    'Cost=5 ' +
    'Description="R30\' 1 lb missile inflicts 1d6 HP"',
  'Control Body':
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'Score=constitution,-2 ' +
    'Cost=8,8/rd ' +
    'Description="R80\' Self controls target\'s movements"',
  'Control Flames':
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'Score=wisdom,-1 ' +
    'Cost=6,3/rd ' +
    'Description="R40\' Target 10\' sq flame doubles or halves size"',
  'Control Light':
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'Score=intelligence ' +
    'Cost=12,4/rd ' +
    'Description="R25\' Target 400\' sq area brightens or dims"',
  'Control Sound':
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'Score=intelligence,-5 ' +
    'Cost=5,2/rd ' +
    'Description="R100\' Modifies existing sounds"',
  'Control Wind':
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'Score=constitution,-4 ' +
    'Preparation=2 ' +
    'Cost=16,10/rd ' +
    'Description=' +
      '"R500\' Changes speed and direction of wind, up to 10 MPH and degrees"',
  'Create Sound':
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'Score=intelligence,-7 ' +
    'Cost=8,3/rd ' +
    'Description="R100\' Creates sound up to group shouting"',
  'Inertial Barrier':
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'Score=constitution,-3 ' +
    'Cost=7,5/rd ' +
    'Description=' +
      '"R3\' Barrier reduces damage from missiles, flames, breath, and gas"',
  'Levitation':
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Cost=12,2/rd ' +
    'Description="Self ascend or descend up to 60\'/rd"',
  'Molecular Agitation':
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'Score=wisdom ' +
    'Cost=7,6/rd ' +
    'Description="R40\' Heats targets"',
  'Molecular Manipulation':
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'Score=intelligence,-3 ' +
    'Preparation=1 ' +
    'Cost=6,5/rd ' +
    'Description="R15\' Creates weak spot in target"',
  'Soften':
    'Discipline=Psychokinesis ' +
    'Type=Devotion ' +
    'Score=intelligence ' +
    'Cost=4,3/rd ' +
    'Description="R30\' Target object softens"',
  'Animal Affinity':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'Score=constitution,-4 ' +
    'Cost=15,4/rd ' +
    'Description="Self gains one attribute of affinity animal"',
  'Complete Healing':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'Score=constitution ' +
    'Preparation="1 dy" ' +
    'Cost=30 ' +
    'Description="Self healed of all ailments, wounds, and normal disease"',
  'Death Field':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'Score=constitution,-8 ' +
    'Preparation=3 ' +
    'Cost=40 ' +
    'Description=' +
      '"R20\' All in range lose specified number of HP (Death save neg)"',
  'Energy Containment':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'Score=constitution,-2 ' +
    'Cost=10 ' +
    'Description="Specified energy type attacks on self reflected as light"',
  'Life Draining':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'Score=constitution,-3 ' +
    'Cost=11,5/rd ' +
    'Description=' +
      '"Transfers HP from touched to self, raising self HP up to %{hitPoints+10}"',
  'Metamorphosis':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'Score=constitution,-6 ' +
    'Preparation=5 ' +
    'Cost=21,1/tn ' +
    'Description="Self transforms into object of approximately same mass"',
  'Shadow-form':
    'Discipline=Psychometabolism ' +
    'Type=Science ' +
    'Score=constitution,-6 ' +
    'Cost=12,3/rd ' +
    'Description="Self transforms into shadow"',
  'Absorb Disease':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-3 ' +
    'Cost=12 ' +
    'Description="Transfers disease from touched to self"',
  'Adrenalin Control':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-3 ' +
    'Cost=8,4/rd ' +
    'Description="Self gains 1d6 Strength, Dexterity, or Constitution"',
  'Aging':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-7 ' +
    'Cost=15 ' +
    'Description="Touched ages 1d4+1 yr (Polymorph save 1d4 yr)"',
  'Biofeedback':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-2 ' +
    'Cost=6,3/rd ' +
    'Description=' +
      '"Self gains -1 AC, damage from attacks on self reduced by 2 HP"',
  'Body Control':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-4 ' +
    'Cost=7,5/tn ' +
    'Description="Self becomes comfortable in extreme environment"',
  'Body Equilibrium':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-3 ' +
    'Cost=2,2/rd ' +
    'Description=' +
      '"Self can walk on water or fragile surfaces, takes no damage from falling"',
  'Body Weaponry':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-3 ' +
    'Cost=9,4/rd ' +
    'Description="Self arm becomes chosen weapon"',
  'Catfall':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=dexterity,-2 ' +
    'Cost=4 ' +
    'Description=' +
      '"Self drops 30\' w/out damage; takes half damage from longer fall"',
  'Cause Decay':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-2 ' +
    'Cost=4 ' +
    'Description="Touched object decays or rusts"',
  'Cell Adjustment':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-3 ' +
    'Cost=5,20/rd ' +
    'Description="Cures touched of disease"',
  'Chameleon Power':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-1 ' +
    'Cost=6,3/rd ' +
    'Description="Self skin and clothes blend into background"',
  'Chemical Simulation':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-4 ' +
    'Preparation=1 ' +
    'Cost=9,6/rd ' +
    'Description="Self touch causes acid effects"',
  'Displacement':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-3 ' +
    'Cost=6,3/rd ' +
    'Description="Self gains -2 AC"',
  'Double Pain':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-3 ' +
    'Cost=7 ' +
    'Description="Touched takes double damage for 1 tn"',
  'Ectoplasmic Form':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-4 ' +
    'Preparation=1 ' +
    'Cost=9,9/rd ' +
    'Description="Self becomes insubstantial"',
  'Enhanced Strength':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Cost=2,1/rd ' +
    'Description="Self strength increases"',
  'Expansion':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-2 ' +
    'Cost=6,1/rd ' +
    'Description="Self dimension increased 50%-400%"',
  'Flesh Armor':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-3 ' +
    'Cost=8,4/rd ' +
    'Description="Self skin becomes armor"',
  'Graft Weapon':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-5 ' +
    'Cost=10,1/rd ' +
    'Description="Self weapon gains +1 attack and damage"',
  'Heightened Senses':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution ' +
    'Cost=5,1/rd ' +
    'Description=' +
      '"Self gains increased notice, tracking, hearing, poison detection, and touch identification"',
  'Immovability':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-5 ' +
    'Cost=9,6/rd ' +
    'Description=' +
      '"Self moved only by combined strength of %{(constitution-5)*10}"',
  'Lend Health':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-1 ' +
    'Cost=4 ' +
    'Description="Transfers HP from self to touched"',
  'Mind Over Body':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Cost=0,10/dy ' +
    'Description="Self needs no food, water, or sleep"',
  'Reduction':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-2 ' +
    'Cost=1,1/rd ' +
    'Description="Reduces self dimension down to 1\'"',
  'Share Strength':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-4 ' +
    'Cost=6,2/rd ' +
    'Description="Transfers strength from self to touched"',
  'Suspend Animation':
    'Discipline=Psychometabolism ' +
    'Type=Devotion ' +
    'Score=constitution,-3 ' +
    'Preparation=5 ' +
    'Cost=12 ' +
    'Description="Self appears dead"',
  'Banishment':
    'Discipline=Psychoportation ' +
    'Type=Science ' +
    'Score=intelligence,-1 ' +
    'Cost=30,10/rd ' +
    'Description="R5\' Target banished to pocket dimension"',
  'Probability Travel':
    'Discipline=Psychoportation ' +
    'Type=Science ' +
    'Score=intelligence ' +
    'Preparation=2 ' +
    'Cost=20,8/hr ' +
    'Description="Self travel astral plane"',
  'Summon Planar Creature':
    'Discipline=Psychoportation ' +
    'Type=Science ' +
    'Score=intelligence,-4 ' +
    'Preparation=12 ' +
    'Cost=45/90 ' +
    'Description="R200\' Brings and controls creature from another plane"',
  'Teleport':
    'Discipline=Psychoportation ' +
    'Type=Science ' +
    'Score=intelligence ' +
    'Cost=10 ' +
    'Description="Transfer self to familiar location"',
  'Teleport Other':
    'Discipline=Psychoportation ' +
    'Type=Science ' +
    'Score=intelligence,-2 ' +
    'Cost=20 ' +
    'Description="R10\' Transfers target to familiar location"',
  'Astral Projection':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'Score=intelligence ' +
    'Preparation=1 ' +
    'Cost=6,2/hr ' +
    'Description="Astral copy of self travels astral plane"',
  'Dimensional Door':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'Score=constitution,-1 ' +
    'Cost=4,2/rd ' +
    'Description="R50\' Creates portal that teleports passers"',
  'Dimension Walk':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'Score=constitution,-2 ' +
    'Preparation=2 ' +
    'Cost=8,4/tn ' +
    'Description="Self travels quickly through parallel dimension"',
  'Dream Travel':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'Score=wisdom,-4 ' +
    'Cost=1 ' +
    'Description="R500 miles Self and companions travel during sleep"',
  'Teleport Trigger':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'Score=intelligence,1 ' +
    'Cost=0,2/hr ' +
    'Description="Trigger teleports self to safe location"',
  'Time Shift':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'Score=intelligence ' +
    'Cost=16 ' +
    'Description="Self sees three rounds into the future"',
  'Time/Space Anchor':
    'Discipline=Psychoportation ' +
    'Type=Devotion ' +
    'Score=intelligence ' +
    'Cost=5,1/rd ' +
    'Description="Self cannot be involuntarily teleported"',
  'Domination':
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'Score=wisdom,-4 ' +
    'Cost=6,6/rd ' +
    'Description="R30\' Self controls target\'s actions (Spell save neg)"',
  'Ejection':
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'Score=wisdom,-4 ' +
    'Cost=6 ' +
    'Description="Forceably breaks psionic contact; may cause side effects"',
  'Fate Link':
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'Score=constitution,-5 ' +
    'Preparation=1 ' +
    'Cost=3,5/tn ' +
    'Description=' +
      '"Self share pain and HP loss w/target (Death save to avoid shared death)"',
  'Mass Domination':
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'Score=wisdom,-6 ' +
    'Preparation=2 ' +
    'Cost=3,2/rd+ ' +
    'Description="R40\' Self controls 5 targets\' actions (Spell save neg)"',
  'Mindlink':
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'Score=wisdom,-5 ' +
    'Cost=3,8/rd ' +
    'Description="Self converses telepathically w/target"',
  'Mindwipe':
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'Score=intelligence,-6 ' +
    'Preparation=1 ' +
    'Cost=3,8/rd ' +
    'Description=' +
      '"Touched suffers -1 intelligence, wisdom, and level (Spell save neg)"',
  'Probe':
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'Score=wisdom,-5 ' +
    'Cost=3,9/rd ' +
    'Description=' +
      '"R2\' Self gains access to all of target\'s memories (Spell save neg)"',
  'Psychic Crush':
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'Score=wisdom,-4 ' +
    'Cost=7 ' +
    'Description="R50\' Inflicts 1d8 HP (Paralyzation save neg)"',
  'Superior Invisibility':
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'Score=intelligence,-5 ' +
    'Cost=3,5/rd ' +
    'Description="Self invisible produces no sound or smell"',
  'Switch Personality':
    'Discipline=Telepathy ' +
    'Type=Science ' +
    'Score=constitution,-4 ' +
    'Preparation=3 ' +
    'Cost=33 ' +
    'Description=' +
      '"Self exchanges minds with touched, both become comatose (System Shock neg) and lose 1 constitution/dy (Con neg)"',
  'Tower Of Iron Will':
    'Discipline=Telepathy ' +
    'Type=Defense ' +
    'Score=wisdom,-2 ' +
    'Cost=6 ' +
    'Description="R3\' Creates psionic defense"',
  'Attraction':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom,-4 ' +
    'Cost=3,8/rd ' +
    'Description="R200\' Target overwhelmingly drawn to chosen item"',
  'Aversion':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom,-4 ' +
    'Cost=3,8/tn ' +
    'Description=' +
      '"R200\' Target overwhelmingly repelled by chosen item for 1 tn"',
  'Awe':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=charisma,-2 ' +
    'Cost=3,4/rd ' +
    'Description="Targets cowed by self, will flee or obey"',
  'Conceal Thoughts':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom ' +
    'Cost=5,3/rd ' +
    'Description="Self becomes shielded from mental probing"',
  'Contact':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom ' +
    'Cost=3,1/rd ' +
    'Description=' +
      '"Self links to known target (psionicist neg, others resist -2), can use with other telepathic powers"',
  'Daydream':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom ' +
    'Cost=3,3/rd ' +
    'Description="Target loses focus (intelligence 14 neg, concentration neg)"',
  'Ego Whip':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Cost=4 ' +
    'Description="Target becomes dazed for 1d4 rd"',
  'Empathy':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom ' +
    'Cost=1,1/rd ' +
    'Description="Self senses desires and emotions of target"',
  'ESP':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom,-4 ' +
    'Cost=3,6/rd ' +
    'Description="Self reads target\'s thoughts"',
  'False Sensory Input':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=intelligence,-3 ' +
    'Cost=3,4/rd ' +
    'Description="Modifies target\'s sensory input"',
  'Id Insinuation':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom,-4 ' +
    'Cost=5 ' +
    'Description="Target becomes unable to act for 1d4 rd"',
  'Identity Penetration':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Cost=3,6/rd ' +
    'Description="Self learns target\'s true identity"',
  'Incarnation Awareness':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom,-4 ' +
    'Cost=3,13/rd ' +
    'Description="Self learns about target\'s past lives"',
  'Inflict Pain':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=constitution,-4 ' +
    'Preparation=1 ' +
    'Cost=3,2/rd ' +
    'Description="Target suffers -4 attacks (Paralyzation save neg)"',
  'Intellect Fortress':
    'Discipline=Telepathy ' +
    'Type=Defense ' +
    'Score=wisdom,-3 ' +
    'Cost=4 ' +
    'Description="R3\' Protects from psionic attacks"',
  'Invincible Foes':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Cost=3,5/rd ' +
    'Description="Target believes any damage is fatal"',
  'Invisibility':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=intelligence,-5 ' +
    'Cost=3,2/rd ' +
    'Description="Self invisible to contacted minds"',
  'Life Detection':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=intelligence,-2 ' +
    'Cost=3,3/rd ' +
    'Description="R100\' Self detects living creatures"',
  'Mental Barrier':
    'Discipline=Telepathy ' +
    'Type=Defense ' +
    'Score=wisdom,-2 ' +
    'Cost=3 ' +
    'Description="Protects self from unwanted mental contact"',
  'Mind Bar':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=intelligence,-2 ' +
    'Cost=6,4/rd ' +
    'Description=' +
      '"Self gains 75% resistance to mental magic, immunity to possession"',
  'Mind Blank':
    'Discipline=Telepathy ' +
    'Type=Defense ' +
    'Score=wisdom,-7 ' +
    'Cost=0,0 ' +
    'Description="Protects self from psionic attacks"',
  'Mind Thrust':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom,-2 ' +
    'Cost=2 ' +
    'Description="Target loses 1 power for 2d6 dy"',
  'Phobia Amplification':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom,-2 ' +
    'Cost=3,4/rd ' +
    'Description="Target suffers overwhelming fear"',
  'Post-Hypnotic Suggestion':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=intelligence,-3 ' +
    'Cost=0,1 ' +
    'Description=' +
      '"Plants suggestion in target (intelligence &lt; 7 or &gt; 17 neg)"',
  'Psionic Blast':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom,-5 ' +
    'Cost=10 ' +
    'Description="Target believes 80% of HP are lost (Death save neg)"',
  'Psychic Impersonation':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom ' +
    'Cost=10,3/hr ' +
    'Description="Self mimic target\'s aura and thoughts"',
  'Psychic Messenger':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=constitution,-4 ' +
    'Preparation=2 ' +
    'Cost=4,3/rd ' +
    'Description="R200 mi Sends auditory and visual message"',
  'Repugnance':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom,-5 ' +
    'Cost=3,8/rd ' +
    'Description="R200\' Makes target wish to destroy chosen item"',
  'Send Thoughts':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=intelligence,-1 ' +
    'Cost=3,2/rd ' +
    'Description="Target receives self thoughts"',
  'Sight Link':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=constitution,-3 ' +
    'Preparation=1 ' +
    'Cost=3,5/tn ' +
    'Description="Self sees through target\'s eyes"',
  'Sound Link':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=constitution,-2 ' +
    'Preparation=1 ' +
    'Cost=3,4/tn ' +
    'Description="Self hears through target\'s ears"',
  'Synaptic Static':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=intelligence,-4 ' +
    'Cost=15,10/rd ' +
    'Description="90\' diameter interferes w/psionic activity"',
  'Taste Link':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=constitution,-2 ' +
    'Preparation=1 ' +
    'Cost=3,4/tn ' +
    'Description="Self tastes through target\'s tongue"',
  'Telempathic Projection':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom,-2 ' +
    'Preparation=1 ' +
    'Cost=3,4/rd ' +
    'Description="Modifies emotions in 10\' radius"',
  'Thought Shield':
    'Discipline=Telepathy ' +
    'Type=Defense ' +
    'Score=wisdom,-3 ' +
    'Cost=1 ' +
    'Description="Protects self from psionic attacks"',
  'Truthear':
    'Discipline=Telepathy ' +
    'Type=Devotion ' +
    'Score=wisdom ' +
    'Cost=4,2/rd ' +
    'Description="Self detects lies"',
  'Appraise':
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'Score=intelligence,-4 ' +
    'Cost=14 ' +
    'Description="Self determines likelihood of action success"',
  'Aura Alteration':
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'Score=wisdom,-4 ' +
    'Preparation=5 ' +
    'Cost=10 ' +
    'Description=' +
      '"Masks touched\'s alignment or level or removes curse or quest"',
  'Empower':
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'Score=wisdom,-12 ' +
    'Cost=150 ' +
    'Description="Imbues touched object with intelligence and psionic power"',
  'Psychic Clone':
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'Score=wisdom,-8 ' +
    'Preparation=10 ' +
    'Cost=50,5/rd ' +
    'Description="Extracts self psyche into insubstantial form"',
  'Psychic Surgery':
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'Score=wisdom,-5 ' +
    'Preparation=10 ' +
    'Cost=3,10/tn ' +
    'Description="Repairs psychic damage to touched"',
  'Split Personality':
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'Score=wisdom,-5 ' +
    'Preparation=1 ' +
    'Cost=40,6/rd ' +
    'Description="Self can use two powers each rd"',
  'Ultrablast':
    'Discipline=Metapsionic ' +
    'Type=Science ' +
    'Score=wisdom,-10 ' +
    'Preparation=3 ' +
    'Cost=75 ' +
    'Description=' +
      '"Inflicts unconsciousness (Paralyzation save neg) and loss of psionic power (Paralyzation save neg) in 50\' radius"',
  'Cannibalize':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=constitution ' +
    'Cost=0 ' +
    'Description="Self trades constitution points for 8x PSP, recovers 1/wk"',
  'Convergence':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=wisdom ' +
    'Preparation=1 ' +
    'Cost=8 ' +
    'Description=' +
      '"R10\' Creates joint psionic defense among multiple psionicists"',
  'Enhancement':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Preparation=5 ' +
    'Cost=30,8/rd ' +
    'Description="Doubles power scores in chosen discipline"',
  'Gird':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=intelligence,-3 ' +
    'Cost=0 ' +
    'Description="Maintains chosen powers w/out concentration"',
  'Intensify':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=varies,-3 ' +
    'Preparation=1 ' +
    'Cost=5,1/rd ' +
    'Description=' +
      '"Self trades psionic increase in intelligence, wisdom, or constitution for equal decrease in the others"',
  'Magnify':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=wisdom,-5 ' +
    'Preparation=5 ' +
    'Cost=25,1/rd ' +
    'Description="Doubles effects of chosen power"',
  'Martial Trance':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Preparation=1 ' +
    'Cost=7 ' +
    'Description="Trance grants +1 telepathy scores"',
  'Prolong':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=constitution,-4 ' +
    'Cost=5,2/rd ' +
    'Description="Increases range and area of powers by 50%"',
  'Psionic Inflation':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=wisdom,-5 ' +
    'Preparation=1 ' +
    'Cost=20,3/rd ' +
    'Description="Double cost of psionic powers in 100\' radius"',
  'Psionic Sense':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=wisdom,-3 ' +
    'Cost=4,1/rd ' +
    'Description="R200\' Self detects psionic activity"',
  'Psychic Drain':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=wisdom,-6 ' +
    'Cost=13 ' +
    'Description="Self drains sleeping targets\' constitution, intelligence, or wisdom for x10 PSP to power psionic powers"',
  'Receptacle':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=wisdom,-5 ' +
    'Preparation=1 ' +
    'Cost=0 ' +
    'Description="Stores PSP for later use"',
  'Retrospection':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=wisdom,-4 ' +
    'Preparation=10 ' +
    'Cost=120 ' +
    'Description="Self and two converged gain historical information"',
  'Splice':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=intelligence,-2 ' +
    'Cost=5,1/rd ' +
    'Description="Allows simultaneous use of multiple powers"',
  'Stasis Field':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=constitution,-3 ' +
    'Preparation=3 ' +
    'Cost=20,20/rd ' +
    'Description="Slows time in %{levels.Psionicist}\' radius"',
  'Wrench':
    'Discipline=Metapsionic ' +
    'Type=Devotion ' +
    'Score=wisdom,-4 ' +
    'Cost=15,8/rd ' +
    'Description="Forces target into single plane"'
};
OSPsionics.SKILLS = {
  'Harness Subconscious':'Ability=wisdom Modifier=-1 Class=Psionicist',
  'Hypnosis':'Ability=charisma Modifier=-2 Class=Psionicist',
  'Rejuvenation':'Ability=wisdom Modifier=-1 Class=Psionicist',
  'Meditative Focus':'Ability=wisdom Modifier=1 Class=Psionicist'
};

/* Defines rules related to magic use. */
OSPsionics.psionicsRules = function(rules, disciplines, powers) {

  QuilvynUtils.checkAttrTable(disciplines, []);
  QuilvynUtils.checkAttrTable
    (powers, ['Discipline', 'Type', 'Score', 'Preparation', 'Cost', 'Description']);

  for(var d in disciplines) {
    OldSchool.choiceRules(rules, 'Discipline', d, disciplines[d]);
  }
  for(var p in powers) {
    OldSchool.choiceRules(rules, 'Power', p, powers[p]);
  }

  QuilvynRules.validAllocationRules
    (rules, 'discipline', 'psionicDisciplineCount', 'Sum "^disciplines\\."');
  rules.defineRule
    ('features.Wild Talent', 'wildTalent', '=', 'source ? 1 : null');
  rules.defineRule('psionicStrengthPoints', 'magicNotes.wildTalent', '+=', null);
  rules.defineRule('magicNotes.wildTalent',
    'features.Wild Talent', '?', null,
    'level', '=', '4 * (source - 1)'
  );
  rules.defineRule
    ('psionicDisciplineCount', 'magicNotes.wildTalent', '+=', '1');
  rules.defineRule('psionicDevotionCount', 'magicNotes.wildTalent', '+=', '1');
  rules.defineChoice('choices', 'Discipline', 'Power');
  rules.defineChoice('random', 'disciplines', 'powers');
  rules.defineRule('classSkill.Gem Cutting', 'levels.Psionicist', '=', '1');
  rules.defineRule
    ('classSkill.Musical Instrument', 'levels.Psionicist', '=', '1');
  rules.defineRule
    ('classSkill.Reading And Writing', 'levels.Psionicist', '=', '1');
  rules.defineRule('classSkill.Religion', 'levels.Psionicist', '=', '1');
  rules.defineChoice('preset', 'wildTalent:Wild Talent,checkbox,');

  // Add items to character sheet
  rules.defineEditorElement
    ('wildTalent', 'Wild Talent', 'checkbox', [''], 'spells');
  rules.defineEditorElement
    ('disciplines', 'Disciplines', 'set', 'disciplines', 'spells');
  rules.defineEditorElement('powers', 'Powers', 'set', 'powers', 'spells');
  rules.defineSheetElement('Disciplines', 'Spell Points+', null, '; ');
  rules.defineSheetElement('Psionic Strength Points', 'Disciplines+');
  rules.defineSheetElement
    ('Powers', 'Spells', '<b>Powers</b>:\n%V', '\n');

};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
OSPsionics.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Class')
    OSPsionics.classRulesExtra(rules, name);
  else if(type == 'Discipline')
    OSPsionics.disciplineRules(rules, name);
  else if(type == 'Power')
    OSPsionics.powerRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Discipline'),
      QuilvynUtils.getAttrValue(attrs, 'Type'),
      QuilvynUtils.getAttrValueArray(attrs, 'Score'),
      QuilvynUtils.getAttrValue(attrs, 'Preparation'),
      QuilvynUtils.getAttrValueArray(attrs, 'Cost'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the abilities passed to classRules.
 */
OSPsionics.classRulesExtra = function(rules, name) {
  var classLevel = 'levels.' + name;
  if(name == 'Psionicist') {
    rules.defineRule('classPsionicistBreathSaveAdjustment',
      classLevel, '=', 'source>=21 ? -2 : source>=9 ? -1 : null'
    );
    rules.defineRule('classPsionicistSpellSaveAdjustment',
      classLevel, '=', 'source>=13 ? 2 : source>=5 ? 1 : null'
    );
    rules.defineRule('classPsionicistSpellSave',
      'classPsionicistSpellSaveAdjustment', '+', null
    );
    rules.defineRule
      ('psionicDisciplineCount', 'magicNotes.psionicPowers', '+=', null);
    rules.defineRule
      ('psionicScienceCount', 'magicNotes.psionicPowers.1', '+=', null);
    rules.defineRule
      ('psionicDevotionCount', 'magicNotes.psionicPowers.2', '+=', null);
    rules.defineRule
      ('psionicDefenseCount', 'magicNotes.psionicPowers.2', '+=', null);
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
 * discipline #discipline#, which has type #type# ('Science', 'Devotion', or
 * 'Defense'), score #score# (either an ability name or a tuple consisting of
 * an ability name and a modifier), requires #preparation# time to prepare
 * (may be undefined if no prep required), cost #cost# (either a single value
 * or a two-value tuple with initial and maintenance costs). #description# is
 * a brief description of the power's effects.
 */
OSPsionics.powerRules = function(
  rules, name, discipline, type, score, preparation, cost, description
) {
  if(!name) {
    console.log('Empty power name');
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
  if(!Array.isArray(score) || score.length < 1 || score.length > 2) {
    console.log('Bad score "' + score + '" for power ' + name);
    return;
  } else if(!(score[0] in OldSchool.ABILITIES) && score[0] != 'varies') {
    console.log('Bad score "' + score + '" for power ' + name);
    return;
  } else if(score.length == 2 && typeof(score[1]) != 'number') {
    console.log('Bad score "' + score + '" for power ' + name);
    return;
  }
  if(!Array.isArray(cost) || cost.length < 1 || cost.length > 2) {
    console.log('Bad cost "' + cost + '" for power ' + name);
    return;
  }

  var testAndCost =
    score[0].substring(0, 3) +
    (score.length==1 ? '' : score[1]>=0 ? '+' + score[1] : score[1]) +
    ' (%{' + score[0] + (score.length>1 ? '+' + score[1] : '') + '})' + '; ' +
    cost[0] + (cost.length>1 ? '+' + cost[1] : '') + ' PSP';
  if(preparation)
    testAndCost += '; Prep ' + preparation;
  rules.defineChoice
    ('notes', 'powers.' + name + ':(' + testAndCost + ') ' + description);
  rules.defineRule('magicNotes.wildTalent',
    'powers.' + name, '+',
      cost[0] + (cost.length>1 ? (cost[1]+'').replace(/\/.*/, '') : 0) * 4
  );
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
OSPsionics.randomizeOneAttribute = function(attributes, attribute) {
  var attr;
  var attrs;
  var choices;
  var howMany;
  var i;
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
    var allowedDisciplines = {};
    for(attr in attrs) {
      if(attr.match(/^disciplines\./))
        allowedDisciplines[attr.replace('disciplines.', '')] = 1;
    }
    var allPowers = this.getChoices('powers');
    ['Science', 'Devotion', 'Defense'].forEach(type => {
      howMany = attrs['psionic' + type + 'Count'] || 0;
      choices = [];
      for(attr in allPowers) {
        if(!allPowers[attr].includes('Type=' + type))
          continue;
        var discipline =
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
    'Advanced Dungeons & Dragons Players Handbook © 2012 Wizards of the ' +
    'Coast LLC.\n' +
    '</p><p>\n' +
    'The Complete Psionics Handbook © 1991 TSR, Inc.\n' +
    'Coast LLC.\n' +
    '</p>\n';
};
