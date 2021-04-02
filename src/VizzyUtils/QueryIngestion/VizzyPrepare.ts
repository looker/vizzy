
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
import {VisConfig} from '../Configuration'
import { LookerChartUtils, VisualizationDefinition } from '../types'
import {FormattedQuery, VisQueryResponse, VisData, QueryFormatterRules} from './types'

export interface QueryFormatter {
  /**
   * Creates a slim, data-ful queryResponse. This function takes in the Looker query objects and returns a structure well suited for visualization development
   * @param data - data obj from Looker
   * @param config - config obj from Looker
   * @param queryResponse - queryResponse obj from Looker
   * @param vis - the vis obj itself
   * @param rules - some options for error handling/boundary checking
   */
  prepare: (data: VisData, config: VisConfig, queryResponse: VisQueryResponse, vis: VisualizationDefinition, rules: QueryFormatterRules) => FormattedQuery,
  /**
   * Retrieves the requested field metadata
   * @param queryFields - which queryResponse fields to consider
   * @param columns - first N fields to get
   */
  getQueryMetadata: (queryFields: any, columns: number) => any,
  /**
   * Ensure that the prepared data shape is as expected
   * @param data - single category data, from getQueryMetadata()
   * @param addError - function for reporting an error back to Looker
   * @param queryLength - actual length of category data, from Looker queryResponse
   * @param strictLength - whether or not to enforce length check
   */
  validateInputShape: (data: any, addError: any, queryLength: number, strictLength: boolean) => void,
  /**
   * Ensure that the input data is of a shape which can be properly prepared
   * @param data - data obj from Looker
   * @param queryResponse - queryResponse obj from Looker
   * @param rules - some options for error handling/boundary checking
   * @param addError - function for reporting an error back to Looker
   */
  validatePrepareShape: (data: any, queryResponse: VisQueryResponse, rules: QueryFormatterRules, addError: any) => void,
}

export const VizzyQueryFormatter: QueryFormatter = {
  validateInputShape(data, addError, queryLength, strictLength) {
    if (strictLength) {
      if (data.length !== queryLength) {
        addError({title: "Invalid input", message: `Expected ${data.length} ${data[0][0].field_category}s, found ${queryLength}.`})
      }
    }
  },
  validatePrepareShape(data, queryResponse, rules, addError) {
    const actualDims = queryResponse.fields.dimension_like.length
    const actualMeas = queryResponse.fields.measure_like.length
    if (data.length === 0) {
      addError({title: "No data"})
    }
    if (rules.strictDims && actualDims !== rules.numDims) {
      addError({title: "Invalid input", message: `Expected ${rules.numDims} dimensions, found ${actualDims}.`})
    }
    else if (rules.strictDims && actualMeas !== rules.numMeas) {
      addError({title: "Invalid input", message: `Expected ${rules.numMeas} measures, found ${actualMeas}.`})
    }
  },
  getQueryMetadata(queryFields, columns) {
    const filtered = queryFields.filter((d: any, i: number) => {
      return i <= columns - 1
    })
    return filtered.map((d: any) => {
      // this is where queryResponse metadata can be brought over to each Cell
      return {field_name: d.name, field_category: d.category, label: d.label_short}
    })
  },
  prepare(data, config, queryResponse, vis, rules) {
    this.validatePrepareShape(data, queryResponse, rules, vis.addError)
    
    const dims = this.getQueryMetadata(queryResponse.fields.dimension_like, rules.numDims || 0)
    const dimsData = dims.map((dim: any) => {
      return data.map((row: any) => {
        return {
          ...row[dim.field_name],
          ...dim
        }
      })
    })
    this.validateInputShape(dimsData, vis.addError, queryResponse.fields.dimension_like.length, rules.strictDims || false)
    
    const meas = this.getQueryMetadata(queryResponse.fields.measure_like, rules.numMeas || 0)
    const measData = meas.map((mea: any) => {
      return data.map((row: any) => {
        return {
          ...row[mea.field_name],
          ...mea
        }
      })
    })
    this.validateInputShape(measData, vis.addError, queryResponse.fields.measure_like.length, rules.strictMeas || false)
    return {
      dimensions: [...dimsData],
      measures: [...measData],
      ...rules
    }
  },
}
