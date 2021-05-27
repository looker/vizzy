
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

import {VisOption, SelectOption, SectionOrder} from './types'

/**
 * The buffer between managed section options / the max number of option dependencies
 */
const OPTION_DEPEND_LIMIT = 10

export class VizzyOptionsManager {
  
  /**
   * A lookup structure for keeping track of available order indexes for each section.
   */
  order: SectionOrder

  constructor() {
    this.order = {}
  }

  /**
   * Gets the next available option index for a given section. This allows configuration options
   * to be ordered in the order they are called.
   * @param section the string name of the viz config section
   * @returns the request section index
   */
  getNextSectionOrder(section: string) {
    const sectionKey = encodeURI(section)
    const currentIndex = this.order[sectionKey] || 0
    this.order[sectionKey] = currentIndex + 1
    return currentIndex
  }

  makeToggle(section: string, label: string, init: boolean): VisOption {
    return {
      type: "boolean",
      label: label,
      default: init,
      section: section,
      order: this.getNextSectionOrder(section) * OPTION_DEPEND_LIMIT
    }
  }
  dependToggle(section: string, label: string, init: boolean, parentKey: string, parentObj: any): VisOption {
    return {
      type: "boolean",
      label: label,
      default: init,
      section: section,
      order: parentObj.options[parentKey].order + 1
    }
  }
  makeString(section: string, label: string, init: string): VisOption {
    return {
      type: "string",
      label: label,
      default: init,
      section: section,
      order: this.getNextSectionOrder(section) * OPTION_DEPEND_LIMIT
    }
  }
  makeNumber(section: string, label: string, init: number): VisOption {
    return {
      type: "number",
      label: label,
      default: init,
      section: section,
      order: this.getNextSectionOrder(section) * OPTION_DEPEND_LIMIT
    }
  }
  dependString(section: string, label: string, init: string, parentKey: string, parentObj: any): VisOption {
    return {
      type: "string",
      label: label,
      default: init,
      section: section,
      order: parentObj.options[parentKey].order + 1
    }
  }
  makeColor(section: string, label: string): VisOption {
    return {
      type: "array",
      label: label,
      section: section,
      display: "colors",
      order: this.getNextSectionOrder(section) * OPTION_DEPEND_LIMIT
    }
  }
  dependSingleColor(section: string, label: string, parentKey: string, parentObj: any): VisOption {
    return {
      type: "array",
      label: label,
      section: section,
      display: "color",
      order: parentObj.options[parentKey].order + 1,
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
      order: this.getNextSectionOrder(section) * OPTION_DEPEND_LIMIT,
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
      order: this.getNextSectionOrder(section) * OPTION_DEPEND_LIMIT,
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
      order: this.getNextSectionOrder(section) * OPTION_DEPEND_LIMIT,
      values: choices
    }
  }
  dependRadio(section: string, label: string, init: string, choices: SelectOption[], parentKey: string, parentObj: any): VisOption {
    return {
      type: "string",
      label: label,
      default: init,
      display: "radio",
      section: section,
      order: parentObj.options[parentKey].order + 1,
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
      order: this.getNextSectionOrder(section) * OPTION_DEPEND_LIMIT,
    }
  }
  makeNumberRange(section: string, label: string, init: string, choices: SelectOption[]): VisOption {
    return {
      type: "number",
      label: label,
      default: init,
      display: "range",
      section: section,
      order: this.getNextSectionOrder(section) * OPTION_DEPEND_LIMIT,
      values: choices
    }
  }
  dependNumberRange(section: string, label: string, init: string, choices: SelectOption[], parentKey: string, parentObj: any): VisOption {
    return {
      type: "number",
      label: label,
      default: init,
      display: "range",
      section: section,
      order: parentObj.options[parentKey].order + 1,
      values: choices
    }
  }
}
