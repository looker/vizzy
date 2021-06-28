import React, { useState } from 'react'
import styled from "styled-components"
import {
  Card,
  Select,
  SpaceVertical,
  Heading,
  Slider,
  Label,
} from "@looker/components"

import {Alaska} from '../Geos/Alaska'
import {California} from '../Geos/California'
import {ResultsTable} from './ResultsTable'
import {
  useChartConfig
} from '../ChartConfigContextProvider'
import { USStates } from '../Geos/USStates'

//@ts-ignore
const ConfigCard = styled(Card)`padding: small`

export const Region = () => {
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    getPosition,
    getChartMetadata,
    handleGeographyChange,
    handleScaleSlider,
    getResultsMetadata,
    handleResultsDown,
    handleResultsMove,
    handleResultsUp
  } = useChartConfig()
  const [mouseEnter, setMouseEnter] = useState(false)
  const w = window.innerWidth - 40
  const h = window.innerHeight - 190
  const pos = getPosition()
  const res = getResultsMetadata()
  const md = getChartMetadata()
  const handleMouseEnter = () => setMouseEnter(true)
  const handleMouseLeave = () => setMouseEnter(false)
  const getGeographySvg = (geo: string) => {
    if (geo === 'Alaska') {
      return <Alaska />
    }
    else if (geo === 'California') {
      return <California />
    }
    else if (geo === 'United States') {
      return <USStates />
    }
    return <></>
  }
	return (
    <>
      {mouseEnter && <ConfigCard
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{position: 'absolute', top: '175px', right: '15px', width: '50px', height: 'auto'}}
      >
      <SpaceVertical
        // @ts-ignore
        p='small'
        gap='xsmall'>
        <Heading as='h4'>Geography Settings</Heading>
        <Label>Region</Label>
        <Select
          options={[
            { value: 'Alaska', label: 'Alaska' },
            { value: 'California', label: 'California' },
            { value: 'United States', label: 'US States' },
          ]}
          defaultValue={md.geography}
          onChange={handleGeographyChange}
        />
        <Label>Scale</Label>
        <Slider onChange={handleScaleSlider} value={pos.scale} min={0} max={3} step={0.1} />
      </SpaceVertical>
      </ConfigCard>}
      <svg
        width={w}
        height={h}
        id="svg5598"
        viewBox={`0 0 ${w} ${h}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <g
          id="layer1"
          transform={`translate(${pos.x},${pos.y}) scale(${pos.scale})`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
        >
          {getGeographySvg(md.geography)}
        </g>
      </svg>
      {md.resultsTable && <Card
        style={{
          position: 'absolute',
          left: `${res.x}px`,
          top: `${res.y}px`,
          height: 'auto',
          width: '60px'
        }}
        onPointerDown={handleResultsDown}
        onPointerUp={handleResultsUp}
        onPointerMove={handleResultsMove}
      >
        <ResultsTable />
      </Card>}
    </>
  )
}
