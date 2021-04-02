import * as React from "react";
import * as ReactDOM from "react-dom";
import {ComponentsProvider} from "@looker/components"
import {JsonViewer} from "./VizzyUtils"
import {
  Chunk,
  Looker,
  CustomViz, 
} from './types'
import {
  Vizzy,
  VisOptions,
  Link,
  Row,
  LookerChartUtils
} from './VizzyUtils'

// Global values provided via the API
declare var looker: Looker
declare var LookerCharts: LookerChartUtils

const vis: CustomViz = {
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
    ],
    0),
    numDims: Vizzy.makeNumber("Plot", "Number of Dimensions", 1, 1),
    numMeas: Vizzy.makeNumber("Plot", "Number of Measures", 1, 2),
  },
  // this happens exactly once
  create(element, config) {
    // DO NOTHING
  },
  // this happens for every render n > 0
  updateAsync(data, element, config, queryResponse, details, doneRendering) {
    // save a copy of previous render's options
    let previousOptions: VisOptions = {}
    Object.assign(previousOptions, this.options)

    // add any dynamic options
    this.options.strictDims = Vizzy.dependToggle("Plot", `Expect exactly ${config.numDims} dimensions`, false, "numDims", vis)
    this.options.strictMeas = Vizzy.dependToggle("Plot", `Expect exactly ${config.numMeas} measures`, false, "numMeas", vis)

    // register new options if options has changed since last render
    if (JSON.stringify(previousOptions) !== JSON.stringify(this.options)) {
      this.trigger && this.trigger('registerOptions', this.options)
    }

    // use Vizzy to create a slim, data-ful queryResponse
    const vizData = Vizzy.prepare(data, config, queryResponse, vis, {
      numDims: config.numDims,
      strictDims: config.strictDims,
      numMeas: config.numMeas,
      strictMeas: config.strictMeas,
    })

    // render chart
    this.chart = ReactDOM.render(
      <ComponentsProvider>
        <JsonViewer 
          data={eval(config.view)}
        />
      </ComponentsProvider>,
      element
    )

    // tell Looker we're done rendering
    doneRendering();
  }
}


looker.plugins.visualizations.add(vis)
