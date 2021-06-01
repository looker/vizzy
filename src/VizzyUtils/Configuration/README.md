# Configuration Manager
This submodule defines various helpers for configuration/option management. 

## API Reference
Vizzy contains option-generation helpers of `make` and `depend` variants.

### makeOption
Available makeOptions: [makeToggle, makeString, makeNumber, makeColor, makeList, makeSmallList, makeRadio, makeDivider, makeNumberRange]

```
interface props<makeOption> {
  /**
  `section` - The Visualization Configuration pane's Tab text
  */
  section: string
  /**
  `label` - The label accompanying the option input
  */
  label: string
  /**
  `init` - The default value
  */
  init?: any
  /**
  `choices` - The list of choices for Select option inputs
  */
  choices?: SelectOption[]
}
```

### Example usage
```
const viz: CustomViz = {
  options: {
    showFeature: Vizzy.makeToggle("Styles", "Show Feature", false)
  },
  ...
}
```
Note! Option keys should contain at least two parts and be written/referenced in camelCase.

### dependOption
Available dependOptions: [dependToggle, dependString, dependSingleColor, dependRadio, dependNumberRange]

```
interface props<dependOption> {
  /**
  `section` - The Visualization Configuration pane's Tab text
  */
  section: string
  /**
  `label` - The label accompanying the option input
  */
  label: string
  /**
  `init` - The default value
  */
  init?: any
  /**
  `choices` - The list of choices for Select option inputs
  */
  choices?: SelectOption[]
  /**
  `parentKey` - The option key of the parent
  */
  parentKey: string
  /**
  `parentObj` - The current Visualization object, whose options are indexed into
  */
  parentObj: CustomViz
}
```

### Example usage
```
const viz: CustomViz = {
  options: {
    showFeature: Vizzy.makeToggle("Styles", "Show Feature", false)
  },
  updateAsync(data, element, config, queryResponse, details, doneRendering) {
    ...
    this.options.featureValue = config.showFeature && 
      Vizzy.dependString("Plot", "Feature Input", "Hello, world!", "showFeature", viz)
    ...
  },
  ...
}
```
Note! Option keys should contain at least two parts and be written/referenced in camelCase.


## Adding New Configuration Options:
In src/ChartContainer.tsx, find:
options: {
  ...
}
This object contains all of the visualization base options; the configuration options that will be present in the viz config panel on initial load.
To add a new base option, add a key-value pair to this object. The key should be the lowercase, underscore separated label. For example:

“Label Left Axis” -> label_left_axis


Then, use Vizzy to return a properly shaped option object. 

options: {
  label_left_axis: Vizzy.makeToggle("Axes", "Label Left Axis", false, 1),
}


You can find the Vizzy functions available at src/types.ts > MarketplaceVizHelpers . For each option type, both make and depend variants are available. The difference in these variants is whether or not the returned option is placed linearly in the section, or below a target option. Generally, make options will be used for base options and depend options will be used for dynamic options.

Dynamic options are options that should only be displayed if a condition is true, this may be that a toggle is enabled, a field exists, a certain option is applied, etc. Dynamic options are defined following the // add any dynamic options comment in updateAsync.

The key-value definition pattern applies here, but instead of defining this object inside the options object, we have to reference it externally. 
this.options.left_axis_label = config.label_left_axis && Vizzy.dependString("Axes", "Left Axis Label", "", "label_left_axis", vis)
This dynamic option is only applied if config.label_left_axis is true. 

You may need to make a new Vizzy “option manager”. You can do this by copy-pasting the provided pattern, and modifying the object to match the desired option found here .
Once an option has been applied in the above ways, it will be available via its key on the config object. For an option defined as options.label_left_axis, you can retrieve its configured value with config.label_left_axis. This configured value is either the option’s default value, or the value entered by a user in the vis config panel. 

The config object is passed into our chart component at src/FunnelChart/FunnelChart.tsx, and can be referenced as expected via the config object within this component. Notice how a config option is passed into the following component:


<FunnelStepOuterContents 
  color={config.bar_colors[i]}
  padding={stepWidthPct}
  bottom={outerStepTextY}>
  {stepText.element}
</FunnelStepOuterContents>


And how it is used by this component:

export const FunnelStepOuterContents = styled.span`
  overflow: hidden;
  font-size: 2em;
  color: ${(props: FunnelStepOuterContentsProps) => props.color};
  position: absolute;
  left: 50%;
  z-index: -1;
  padding-left: ${(props: FunnelStepOuterContentsProps) => (props.padding * 100) * 0.75}%;
  top: ${(props: FunnelStepOuterContentsProps) => (props.bottom)}px;
`

This is specifically how a config option is used by a styled component. Keep in mind, this is effectively the same thing as a prop being used by a “normal” (functional) component, like src/FunnelChart/FunnelChart.tsx. We pass in a variable as a prop, to a function of a certain type. This type is defined in the local ./types.ts file. If you are ever confused about where a certain type, or function, has “come from”, you should look at the imports at the top of the page. In VS Code, highlighting an import, and pressing F12, will take you to its declaration. 

