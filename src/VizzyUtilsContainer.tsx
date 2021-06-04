import React from "react"
import ReactDOM from "react-dom"
import {Heading} from "@looker/components"
import {JsonViewer, ChartArea, VizzyUtils} from "./VizzyUtils"
import {
  Looker,
  CustomViz, 
} from './types'
import {
  LookerChartUtils
} from './VizzyUtils'

// Global values provided via the API
declare var looker: Looker
// TODO: Prototype LookerChartUtils examples
declare var LookerCharts: LookerChartUtils

// Instantiate the VizzyUtils helper class
const Vizzy = new VizzyUtils()

const viz: CustomViz = {
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
  create(element, config) {
    // Do Nothing
  },
  updateAsync(data, element, config, queryResponse, details, doneRendering) {
    // save a copy of previous render's options
    Vizzy.loadOptions(this.options)
    // add any dynamic options
    this.options.titleText = config.showTitle && Vizzy.dependString("Plot", "Title Override", "Hello, world!", "showTitle")
    this.options.strictDims = Vizzy.dependToggle("Plot", `Expect exactly ${config.numDims} dimensions`, false, "numDims")
    this.options.strictMeas = Vizzy.dependToggle("Plot", `Expect exactly ${config.numMeas} measures`, false, "numMeas")
    // register new options if options have changed since last render
    Vizzy.saveOptions(this.options, viz)

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
