## 1st Edition plugin for the Quilvyn RPG character sheet generator

The quilvyn-firstedition package bundles modules that extend Quilvyn to work
with the first edition of D&D, applying the rules of the
<a href="https://www.drivethrurpg.com/product/17003/Players-Handbook-1e">1st
edition Players Handbook</a>.

This package also supports the variant 1st edition rules defined in the
<a href="https://www.knights-n-knaves.com/osric/">Old School Reference and
Index Compilation</a> rule book.

### Requirements

quilvyn-firstedition relies on the core and srd35 modules installed by the
quilvyn-core package.

### Installation

To use quilvyn-firstedition, unbundle the release package into a plugins/
subdirectory within the Quilvyn installation directory, then add or uncomment
the 'plugins/FirstEdition.js' entry in the PLUGINS definition in quilvyn.html.

### Usage

Once the FirstEdition plugin is installed as described above, start Quilvyn and
choose First Edition from the Rules menu in the editor window. Choosing OSRIC
in the Rules menu selects the OSRIC variant rules.
