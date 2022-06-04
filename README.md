## 1st and 2nd Edition plugin for the Quilvyn RPG character sheet generator

The quilvyn-oldschool package bundles modules that extend Quilvyn to work
with the 1st and 2nd editions of D&D, applying the rules of the
<a href="https://www.drivethrurpg.com/product/17003/Players-Handbook-1e">1st
Edition Players Handbook</a>, 
<a href="https://www.drivethrurpg.com/product/170096/Unearthed-Arcana-1e?term=unearthed+arcana">1st Edition Unearthed Arcana supplement</a>, and 
<a href="https://www.drivethrurpg.com/product/16868/Players-Handbook-Revised-2e">2nd
Edition Players Handbook</a>.

### Requirements

quilvyn-oldschool relies on the core and srd35 modules installed by the
quilvyn-core package and on the quilvyn-osric package.

### Installation

To use quilvyn-oldschool, unbundle the release package into the plugins/
subdirectory within the Quilvyn installation directory, then append the
following lines to the file plugins/plugins.js:

    RULESETS['AD&D First Edition (1E)'] = {
      url:'plugins/OldSchool.js',
      group:'Old School D&D',
      require:'OSRIC.js'
    };
    RULESETS['Unearthed Arcana (1E)'] = {
      url:'plugins/UnearthedArcana1e.js',
      group:'Old School D&D',
      supplement:'AD&D First Edition (1E)'
    };
    RULESETS['AD&D Second Edition (2E)'] = {
      url:'plugins/OldSchool.js',
      group:'Old School D&D',
      require:'OSRIC.js'
    };
    RULESETS['The Complete Psionics Handbook supplement (2E)'] = {
      url:'plugins/OSPsionics.js',
      group:'Old School D&D',
      supplement:'AD&D Second Edition (2E)'
    };

### Usage

Once the quilvyn-oldSchool package is installed as described above, start
Quilvyn and check the boxes next to one or more of the plugins listed above in
the rule sets menu of the initial window.
