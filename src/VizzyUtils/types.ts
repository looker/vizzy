
/*

 MIT License

 Copyright (c) 2020 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

 import {
  VisOptions, 
  VisConfig,
  Cell,
  Link,
  VisData,
  VisQueryResponse
} from './index'

export interface VisualizationError {
  group?: string
  message?: string
  title?: string
  retryable?: boolean
  warning?: boolean
}

export interface VisUpdateDetails {
  changed: {
    config?: string[]
    data?: boolean
    queryResponse?: boolean
    size?: boolean
  }
}

export interface LookerChartUtils {
  Utils: {
    openDrillMenu: (options: { links: Link[], event: object }) => void
    openUrl: (url: string, event: object) => void
    textForCell: (cell: Cell) => string
    filterableValueForCell: (cell: Cell) => string
    htmlForCell: (cell: Cell, context?: string, fieldDefinitionForCell?: any, customHtml?: string) => string
  }
}

// Looker visualization types
export interface VisualizationDefinition {
  id?: string
  label?: string
  options: VisOptions
  addError?: (error: VisualizationError) => void
  clearErrors?: (errorName?: string) => void
  create?: (element: HTMLElement, settings: VisConfig) => void
  trigger?: (event: string, config: object[] | VisOptions) => void
  update?: (data: VisData, element: HTMLElement, config: VisConfig, queryResponse: VisQueryResponse, details?: VisUpdateDetails) => void
  updateAsync?: (data: VisData, element: HTMLElement, config: VisConfig, queryResponse: VisQueryResponse, details: VisUpdateDetails | undefined, updateComplete: () => void) => void
  destroy?: () => void
}
