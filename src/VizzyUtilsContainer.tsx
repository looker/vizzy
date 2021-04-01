import * as React from "react";
import * as ReactDOM from "react-dom";
import {ComponentsProvider} from "@looker/components"
import {JsonViewer} from "./VizzyUtils"
import {
  Chunk,
  Looker,
  SteppedFunnelChart, 
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

const vis: SteppedFunnelChart = {
  // initial options applied to viz
  options: {
    // AXES
    label_left_axis: Vizzy.makeToggle("Axes", "Label Left Axis", false, 1),
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
    this.options.left_axis_label = config.label_left_axis && Vizzy.dependString("Axes", "Left Axis Label", "", "label_left_axis", vis)

    // register new options if options has changed since last render
    if (JSON.stringify(previousOptions) !== JSON.stringify(this.options)) {
      this.trigger && this.trigger('registerOptions', this.options)
    }

    // render chart
    this.chart = ReactDOM.render(
      <ComponentsProvider>
        <JsonViewer 
          data={data}
        />
      </ComponentsProvider>,
      element
    )

    // tell Looker we're done rendering
    doneRendering();
  }
}


looker.plugins.visualizations.add(vis)
