
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

import {VisOption, SelectOption} from './types'

export interface MarketplaceOptionsManager {
  makeToggle: (section: string, label: string, init: boolean, order: number) => VisOption,
  makeString: (section: string, label: string, init: string, order: number) => VisOption,
  makeColor: (section: string, label: string, order: number) => VisOption,
  dependToggle: (section: string, label: string, init: boolean, parentKey: string, parentObj: any) => VisOption,
  dependSingleColor: (section: string, label: string, parentKey: string, parentObj: any) => VisOption,
  dependString: (section: string, label: string, init: string, parentKey: string, parentObj: any) => VisOption,
  makeNumber: (section: string, label: string, init: number, order: number) => VisOption
  makeList: (section: string, label: string, init: string, choices: SelectOption[], order: number) => VisOption,
  makeSmallList: (section: string, label: string, init: string, choices: SelectOption[], order: number) => VisOption,
}

export const VizzyOptionsManager: MarketplaceOptionsManager = {
  makeToggle(section: string, label: string, init: boolean, order: number): VisOption {
    return {
      type: "boolean",
      label: label,
      default: init,
      section: section,
      order: order * 10
    }
  },
  dependToggle(section: string, label: string, init: boolean, parentKey: string, parentObj: any): VisOption {
    return {
      type: "boolean",
      label: label,
      default: init,
      section: section,
      order: parentObj.options[parentKey].order + 1
    }
  },
  makeString(section: string, label: string, init: string, order: number): VisOption {
    return {
      type: "string",
      label: label,
      default: init,
      section: section,
      order: order * 10
    }
  },
  makeNumber(section: string, label: string, init: number, order: number): VisOption {
    return {
      type: "number",
      label: label,
      default: init,
      section: section,
      order: order * 10
    }
  },
  dependString(section: string, label: string, init: string, parentKey: string, parentObj: any): VisOption {
    return {
      type: "string",
      label: label,
      default: init,
      section: section,
      order: parentObj.options[parentKey].order + 1
    }
  },
  makeColor(section: string, label: string, order: number): VisOption {
    return {
      type: "array",
      label: label,
      section: section,
      display: "colors",
      order: order * 10
    }
  },
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
  },
  makeList(section: string, label: string, init: string, choices: SelectOption[], order: number,): VisOption {
    return {
      type: "string",
      label: label,
      default: init,
      display: "select",
      section: section,
      order: order * 10,
      values: choices
    }
  },
  makeSmallList(section: string, label: string, init: string, choices: SelectOption[], order: number,): VisOption {
    return {
      type: "string",
      label: label,
      default: init,
      display: "select",
      section: section,
      order: order * 10,
      values: choices,
      display_size: "third"
    }
  }
}
