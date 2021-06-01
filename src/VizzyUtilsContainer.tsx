import * as React from "react"
import * as ReactDOM from "react-dom"
import {ComponentsProvider, ProgressCircular, Space, Heading} from "@looker/components"
import {JsonViewer, ChartArea, VizzyUtils} from "./VizzyUtils"
import {
  Looker,
  CustomViz, 
} from './types'
import {
  VisOptions,
  LookerChartUtils
} from './VizzyUtils'

// Global values provided via the API
declare var looker: Looker
// TODO: Prototype LookerChartUtils examples
declare var LookerCharts: LookerChartUtils

// Instantiate the VizzyUtils helper class
const Vizzy = new VizzyUtils()

const viz: CustomViz = {
  // initial options applied to viz
  options: {
    view: Vizzy.makeList("Plot", "Json Inspector", "vizData", 
    [
      {"data": "data"},
      {"element": "element"},
      {"config": "config"},
      {"queryResponse": "queryResponse"},
      {"details": "details"},
      {"done": "done"},
      {"prepared data": "vizData"},
    ]),
    showTitle: Vizzy.makeToggle("Plot", "Show Title Override", false),
    numDims: Vizzy.makeNumber("Plot", "Number of Dimensions", 1),
    numMeas: Vizzy.makeNumber("Plot", "Number of Measures", 1),
  },
  // this happens exactly once
  create(element, config) {
    // Do Nothing
  },
  // this happens for every render n > 0
  updateAsync(data, element, config, queryResponse, details, doneRendering) {
    // save a copy of previous render's options
    // TODO move to Vizzy.loadOptions
    let previousOptions: VisOptions = {}
    Object.assign(previousOptions, this.options)

    // add any dynamic options
    this.options.titleText = config.showTitle && Vizzy.dependString("Plot", "Title Override", "Hello, world!", "showTitle", viz)
    this.options.strictDims = Vizzy.dependToggle("Plot", `Expect exactly ${config.numDims} dimensions`, false, "numDims", viz)
    this.options.strictMeas = Vizzy.dependToggle("Plot", `Expect exactly ${config.numMeas} measures`, false, "numMeas", viz)

    // register new options if options have changed since last render
    // TODO move to Vizzy.saveOptions
    if (JSON.stringify(previousOptions) !== JSON.stringify(this.options)) {
      this.trigger && this.trigger('registerOptions', this.options)
    }

    // use Vizzy to create a slim, data-ful queryResponse
    const vizData = Vizzy.prepare(data, config, queryResponse, viz, {
      numDims: config.numDims,
      strictDims: config.strictDims,
      numMeas: config.numMeas,
      strictMeas: config.strictMeas,
    })

    // render chart
    this.chart = ReactDOM.render(
      <ChartArea>
        {config.showTitle && <Heading>{config.titleText}</Heading>}
        <JsonViewer 
          data={eval(config.view)}
        />
      </ChartArea>,
      element
    )

    // tell Looker we're done rendering
    doneRendering();
  }
}

looker.plugins.visualizations.add(viz)
