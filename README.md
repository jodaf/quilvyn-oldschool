## 1st and 2nd Edition plugin for the Quilvyn RPG character sheet generator

The quilvyn-oldschool package bundles modules that extend Quilvyn to work
with the 1st and 2nd editions of D&D, applying the rules of the
<a href="https://www.drivethrurpg.com/product/17003/Players-Handbook-1e">1st
Edition Players Handbook</a> and
<a href="https://www.drivethrurpg.com/product/16868/Players-Handbook-Revised-2e">2nd
Edition Players Handbook</a>.

### Requirements

quilvyn-oldschool relies on the core and srd35 modules installed by the
quilvyn-core package.

### Installation

To use quilvyn-oldschool, unbundle the release package into the plugins/
subdirectory within the Quilvyn installation directory, then append the
following lines to the file plugins/plugins.js:

    RULESETS['AD&D First Edition (1E)'] = {
      url:'plugins/OldSchool.js',
      group:'Old School D&D',
      require:'SRD35.js'
    };
    RULESETS['AD&D Second Edition (2E)'] = {
      url:'plugins/OldSchool.js',
      group:'Old School D&D',
      require:'SRD35.js'
    };

### Usage

Once the quilvyn-oldSchool package is installed as described above, start
Quilvyn and check the box next to "AD&D First Edition (IE)" and/or the box
next to "AD&D Second Edition (2E)" from the rule sets menu in the initial
window.
