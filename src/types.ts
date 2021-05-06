import { VisualizationDefinition } from "./VizzyUtils"

// API Globals
export interface Looker {
  plugins: {
    visualizations: {
      add: (visualization: VisualizationDefinition) => void
    }
  }
}

export interface Turtle {
  dimension: {[key: string]: string}
  measure: {[key: string]: string}
  data: any[]
}

export interface Chunk {
  label: string
  name?: string
  percent?: string
  value: number
  value_rendered: string
  links: any
  percent_number?: number
  percent_rendered?: string
  percent_container?: number
  tooltip_rendered?: string
  left_rendered?: string
  inline_rendered?: string
  right_rendered?: string,
  turtle?: any
  series_color?: string
  chartType?: any
  scale?: any
  sort_index?: number
}

export interface CustomViz extends VisualizationDefinition {
  chart?: any
}
