import React, { useState } from 'react'
import { Card, SpaceVertical, Select } from '@looker/components'
import styled from "styled-components"
import PlotFigure from './PlotFigure'
import {
  useChartConfig
} from './ChartConfigContextProvider'
// @ts-ignore
import * as Plot from "@observablehq/plot";

export const Legend = () => {
  const [configPanel, setConfigPanel] = useState(false)
  const {getColorOptions, handleColorSchemeChange} = useChartConfig()
  const w = window.innerWidth - 30
  const co = getColorOptions()
	return (
    <span>
      <span onClick={()=>setConfigPanel(!configPanel)} style={{userSelect: 'none'}}>
        <PlotFigure options={{
          width: w,
          color: {
            ...co
          },
          marks: [
            Plot.cell([-4, -3, -2, -1, 0, 1, 2, 3, 4], {x: (d: any) => d, fill: (d: any) => d})
          ]
        }}/>
      </span>
      {configPanel && (
        <Card style={{position: 'absolute', left: '15px', width: w, height: 'auto', zIndex: 2, padding: 'small'}}>
          <SpaceVertical>
            <Select
              options={[
                { value: 'BuRd', label: 'BuRd (diverging)' },
                { value: 'BuYlRd', label: 'BuYlRd (diverging)' },
              ]}
              defaultValue={co.scheme}
              onChange={handleColorSchemeChange}
            />
          </SpaceVertical>
        </Card>
      )}
    </span>
  )
}

