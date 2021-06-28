import React, { useState } from 'react'
import {
  Card,
  SpaceVertical,
  Checkbox,
  Select,
  Space,
  Box,
  Heading,
  Label,
  Slider,
  Text,
  InputText
} from '@looker/components'
import {
  useChartConfig
} from '../ChartConfigContextProvider'
import { COLOR_SCHEMES } from '../Utils'
import { GiDonkey, GiElephant } from 'react-icons/gi'

export const Legend = () => {
  const [mouseEnter, setMouseEnter] = useState(false)
  const {
    getColorOptions,
    getChartMetadata,
    handleColorSchemeChange,
    handleRangeSlider,
    handleResultsCheckbox,
    handleDemChange,
    handleGopChange,
    handleStepsSlider,
    getColorPalette,
  } = useChartConfig()
  const w = window.innerWidth - 30
  const co = getColorOptions()
  const md = getChartMetadata()

  const handleMouseEnter = () => setMouseEnter(true)
  const handleMouseLeave = () => setMouseEnter(false)

  const colors = getColorPalette()

  const getQualifier = (color: string) => {
    const index = colors.indexOf(color)
    const step = Math.round((1 / colors.length)*co.rangeMax)
    if (co.scheme.includes('diverging')) {
      const mid = colors.indexOf(colors[colors.length / 2 | 0])
      const diff = Math.abs(index - mid)
      if (index < mid) {
        return 'D+' + (diff * step)
      } else if (index > mid) {
        return 'R+' + (diff * step)
      } else {
        return 'Even'
      }
    } else if (co.scheme.includes('continuous')) {
      const party = co.scheme.includes('Bu') ? 'D' : 'R'
      return party + '+' + (step * index)
    }
    return ''
  }

	return (
    <span 
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    style={{paddingBottom: '1rem'}}>
      <Space gap='none'>
        {colors.map((color: string) => (
          <SpaceVertical gap='none' align='center'>
            <Box
              // @ts-ignore
              height="30px"
              width={`${(1 / colors.length)*w}px`}
              bg={color}
            />
            <Text fontSize='small'>{getQualifier(color)}</Text>
          </SpaceVertical>
        ))}
      </Space>
      {mouseEnter && (
        <Card
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{position: 'absolute', left: '15px', top: '120px', width: '50px', height: 'auto', padding: 'small'}}>
          <SpaceVertical
            // @ts-ignore
            p='small'
            gap='xsmall'>
            <Heading as='h4'>Legend Settings</Heading>
            <Label>Scheme</Label>
            <Select
              options={[
                { value: 'BuRd (diverging)', label: 'BuRd (diverging)' },
                { value: 'BuPuRd (diverging)', label: 'BuPuRd (diverging)' },
                { value: 'Bu (continuous)', label: 'Bu (continuous)' },
                { value: 'Rd (continuous)', label: 'Rd (continuous)' },
              ]}
              defaultValue={co.scheme}
              onChange={handleColorSchemeChange}
            />
            {co.scheme.includes('continuous') && (<SpaceVertical>
              <Label>Steps</Label>
              <Slider onChange={handleStepsSlider} value={co.steps} min={0} max={COLOR_SCHEMES[co.scheme].length} step={1} />
            </SpaceVertical>)}
            <Label>Range</Label>
            <Slider onChange={handleRangeSlider} value={co.rangeMax} min={0} max={100} step={5} />
            <Label>Candidates</Label>
              <SpaceVertical>
                <InputText iconBefore={<GiDonkey />} value={md.dem} onChange={handleDemChange} />
                <InputText iconBefore={<GiElephant />} value={md.gop} onChange={handleGopChange} />
              </SpaceVertical>
            <Label>Results Table</Label>
            <Checkbox checked={md.resultsTable} onChange={handleResultsCheckbox} />
          </SpaceVertical>
        </Card>
      )}
    </span>
  )
}

