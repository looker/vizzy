# VizzyUtils
This file contains all of the various Vizzy submodules. This package was produced to aid in the development of Looker custom visualizations, specifically Marketplace visualizations.

These submodules manage various behavior that is considered Marketplace inclusion criteria, including:
- Drill support
- Cross filter support
- Error handling
- Proper labeling
- Proper value formatting (and overrides)
- Proper series color
- Tooltip


## Vizzy sub-module requirements
	`index.ts` - hoists all module components, types, and utils
	`types.ts` - defines all module TS types
	`utils.ts` - implements all module behavior
	`foo.tsx` - standalone module component file
