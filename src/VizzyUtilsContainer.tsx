import React from "react"
import ReactDOM from "react-dom"
import {Heading, Button, TabPanel, Tabs, TabList, Tab, TabPanels} from "@looker/components"
import {JsonViewer, ChartArea, VizzyUtils} from "./VizzyUtils"
import {
  Looker,
  CustomViz, 
} from './types'
import {
  LookerChartUtils
} from './VizzyUtils'
import {
  Map
} from './VizzyCharts/Map'

// Global values provided via the API
declare var looker: Looker
// TODO: Prototype LookerChartUtils examples
declare var LookerCharts: LookerChartUtils

// Instantiate the VizzyUtils helper class
const Vizzy = new VizzyUtils()

const viz: CustomViz = {
  options: {
    vizType: Vizzy.makeList("Plot", "Visualization Type", "example", 
    [
      {"example": "example"},
      {"map": "map"},
    ]),
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
        {config.vizType === 'example' && <Tabs>
          <TabList>
            <Tab>JSON Viewer</Tab>
            <Tab>{`<Map/>`}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {config.showTitle && <Heading>{config.titleText}</Heading>}
              {details?.crossfilterEnabled && <Button onClick={() => LookerCharts.Utils.toggleCrossfilter({row: data[0]})}>Add to Crossfilter</Button>}
              <JsonViewer 
                data={eval(config.view)}
              />
            </TabPanel>
            <TabPanel><Map/></TabPanel>
          </TabPanels>
        </Tabs>}
        {config.vizType === 'map' && <Map/>}
      </ChartArea>,
      element
    )

    // tell Looker we're done rendering
    doneRendering();
  }
}

looker.plugins.visualizations.add(viz)
