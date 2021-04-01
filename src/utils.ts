import * as d3 from 'd3'
import DOMPurify from 'dompurify'


import {
  Chunk
} from './types'
import {
  VisConfig,
  VisQueryResponse,
  VisualizationDefinition
} from "./VizzyUtils"

export const formatType = (valueFormat: string) => {
  if (!valueFormat) return undefined
  let format = ''
  switch (valueFormat.charAt(0)) {
    case '$':
      format += '$'; break
    case '£':
      format += '£'; break
    case '€':
      format += '€'; break
  }
  if (valueFormat.indexOf(',') > -1) {
    format += ','
  }
  const splitValueFormat = valueFormat.split('.')
  format += '.'
  format += splitValueFormat.length > 1 ? splitValueFormat[1].length : 0

  switch (valueFormat.slice(-1)) {
    case '%':
      format += '%'; break
    case '0':
      format += 'f'; break
  }
  return d3.format(format)
}

export const handleErrors = (vis: VisualizationDefinition, res: VisQueryResponse, options: VisConfig) => {

  const check = (group: string, noun: string, count: number, min: number, max: number): boolean => {
    if (!vis.addError || !vis.clearErrors) return false
    if (count < min) {
      vis.addError({
        title: `Not Enough ${noun}s`,
        message: `This visualization requires ${min === max ? 'exactly' : 'at least'} ${min} ${noun.toLowerCase()}${ min === 1 ? '' : 's' }.`,
        group
      })
      return false
    }
    if (count > max) {
      vis.addError({
        title: `Too Many ${noun}s`,
        message: `This visualization requires ${min === max ? 'exactly' : 'no more than'} ${max} ${noun.toLowerCase()}${ min === 1 ? '' : 's' }.`,
        group
      })
      return false
    }
    vis.clearErrors(group)
    return true
  }

  const { pivots, dimensions, measure_like: measures } = res.fields

  return (check('pivot-req', 'Pivot', pivots.length, options.min_pivots, options.max_pivots)
   && check('dim-req', 'Dimension', dimensions.length, options.min_dimensions, options.max_dimensions)
   && check('mes-req', 'Measure', measures.length, options.min_measures, options.max_measures))
}

const defaultConfig = {
  ADD_ATTR: ['target'], // allow <a href="..." target="_blank">...</a> links for example
}

// When running in an SSR environment, addHook is undefined.
if (typeof window !== 'undefined') {
  DOMPurify.addHook('afterSanitizeAttributes', node => {
    if (node.nodeName === 'A') {
      // Add the rel attribute to anchor tags to prevent https://www.owasp.org/index.php/Reverse_Tabnabbing
      node.setAttribute('rel', 'noopener noreferrer')
    } else if (node.nodeName === 'a') {
      // Strip our anchor SVG element to prevent https://www.owasp.org/index.php/Reverse_Tabnabbing
      // Anchor SVG elements don't respect the rel attribute, that the reason we need to strip them out
      node.remove()
    }
  })
}

export const Sanitizer = {
  defaultConfig,
  sanitizeDOM: (source: string | Node): string => {
    return DOMPurify.sanitize(source, defaultConfig)
  },

  sanitizeURL: (source: string): string => {
    const link = `<a href="${source}"></a>`
    const sanitizedLink = DOMPurify.sanitize(link, defaultConfig)
    const template = document.createElement('template')
    template.innerHTML = sanitizedLink
    const anchorTag = template.content!.firstChild! as HTMLAnchorElement
    return anchorTag.getAttribute('href') || ''
  },
}

export function getRendered(config: VisConfig, c: Chunk, key: string) {
  let label = config.label_position === key
  let percent = config.percent_position === key
  let value = config.value_position === key
  return `${label ? c.label : ""}${value ? (label ? ": " : "") + c.value_rendered : ""}${percent ? (value || label ? " (" : "")+c.percent_rendered+(value || label ? ")" : "") : ""}`
}
