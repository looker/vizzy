
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

import { VisualizationDefinition } from '../index'
import {VisOption, VisOptions, SelectOption, SectionOrder} from './types'

/**
 * The buffer between managed section options / the max number of option dependencies
 */
const OPTION_INDEX_BUFFER = 10

export class VizzyOptionsManager {
  
  /**
   * A lookup structure for keeping track of available order indexes for each section.
   */
  order: SectionOrder

  /**
   * The last loaded viz `options`, used for updating configuration and dynamic options
   */
  options: VisOptions

  constructor() {
    this.order = {}
    this.options = {}
  }

  /**
   * Gets the next available option index for a given section. This allows configuration options
   * to be ordered in the order they are called.
   * @param section - the string name of the viz config section
   * @returns the request section index
   */
  getNextSectionOrder(section: string) {
    const sectionKey = encodeURI(section)
    const currentIndex = this.order[sectionKey] || 0
    this.order[sectionKey] = currentIndex + 1
    return currentIndex * OPTION_INDEX_BUFFER
  }

  /**
   * Gets the given option's "order" (or index) for the child option's index
   * @param parentKey - The string key of the parent's option object
   * @returns - parent's option object section index
   */
  getParentSectionOrder(parentKey: string) {
    return this.options[parentKey].order || 0
  }

  /**
   * Adds options object to Vizzy
   * @param newOptions - the latest options object for Vizzy to use
   */
  loadOptions = (newOptions: VisOptions) => Object.assign(this.options, newOptions)

  /**
   * Updates the Looker viz config if changes have been made to the options object
   * @param newOptions - the latest options object to check for re-render against
   * @param viz - the object containing the re-render trigger
   */
  saveOptions = (newOptions: VisOptions, viz: VisualizationDefinition) => {
    if (JSON.stringify(this.options) !== JSON.stringify(newOptions)) {
      viz.trigger && viz.trigger('registerOptions', newOptions)
    }
  }

  makeToggle(section: string, label: string, init: boolean): VisOption {
    return {
      type: "boolean",
      label: label,
      default: init,
      section: section,
      order: this.getNextSectionOrder(section)
    }
  }
  dependToggle(section: string, label: string, init: boolean, parentKey: string): VisOption {
    return {
      type: "boolean",
      label: label,
      default: init,
      section: section,
      order: this.getParentSectionOrder(parentKey) + 1
    }
  }
  makeString(section: string, label: string, init: string): VisOption {
    return {
      type: "string",
      label: label,
      default: init,
      section: section,
      order: this.getNextSectionOrder(section)
    }
  }
  makeNumber(section: string, label: string, init: number): VisOption {
    return {
      type: "number",
      label: label,
      default: init,
      section: section,
      order: this.getNextSectionOrder(section)
    }
  }
  dependString(section: string, label: string, init: string, parentKey: string): VisOption {
    return {
      type: "string",
      label: label,
      default: init,
      section: section,
      order: this.getParentSectionOrder(parentKey) + 1
    }
  }
  makeColor(section: string, label: string): VisOption {
    return {
      type: "array",
      label: label,
      section: section,
      display: "colors",
      order: this.getNextSectionOrder(section)
    }
  }
  dependSingleColor(section: string, label: string, parentKey: string): VisOption {
    return {
      type: "array",
      label: label,
      section: section,
      display: "color",
      order: this.getParentSectionOrder(parentKey) + 1,
      display_size: "half",
      default: ["#282828"],
    }
  }
  makeList(section: string, label: string, init: string, choices: SelectOption[]): VisOption {
    return {
      type: "string",
      label: label,
      default: init,
      display: "select",
      section: section,
      order: this.getNextSectionOrder(section),
      values: choices
    }
  }
  makeSmallList(section: string, label: string, init: string, choices: SelectOption[]): VisOption {
    return {
      type: "string",
      label: label,
      default: init,
      display: "select",
      section: section,
      order: this.getNextSectionOrder(section),
      values: choices,
      display_size: "third"
    }
  }
  makeRadio(section: string, label: string, init: string, choices: SelectOption[]): VisOption {
    return {
      type: "string",
      label: label,
      default: init,
      display: "radio",
      section: section,
      order: this.getNextSectionOrder(section),
      values: choices
    }
  }
  dependRadio(section: string, label: string, init: string, choices: SelectOption[], parentKey: string): VisOption {
    return {
      type: "string",
      label: label,
      default: init,
      display: "radio",
      section: section,
      order: this.getParentSectionOrder(parentKey) + 1,
      values: choices
    }
  }
  makeDivider(section: string, label: string, init: string): VisOption {
    return {
      type: "string",
      label: label,
      default: init,
      display: "divider",
      section: section,
      order: this.getNextSectionOrder(section),
    }
  }
  makeNumberRange(section: string, label: string, init: string, choices: SelectOption[]): VisOption {
    return {
      type: "number",
      label: label,
      default: init,
      display: "range",
      section: section,
      order: this.getNextSectionOrder(section),
      values: choices
    }
  }
  dependNumberRange(section: string, label: string, init: string, choices: SelectOption[], parentKey: string): VisOption {
    return {
      type: "number",
      label: label,
      default: init,
      display: "range",
      section: section,
      order: this.getParentSectionOrder(parentKey) + 1,
      values: choices
    }
  }
}
