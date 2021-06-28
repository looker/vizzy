import React from 'react'
import { SpaceVertical } from '@looker/components'
import styled from "styled-components"

import {
  Region,
  Legend,
  Footer,
  Header
} from './ChartParts'
import {
  ChartConfigProvider
} from './ChartConfigContextProvider'

const MapWrapper = styled.div`height: 95vh`

export const Map = () => {
	return (
    <MapWrapper>
      <ChartConfigProvider>
        <SpaceVertical gap='xsmall'>
          <Header />
          <Legend />
          <Region/>
          <Footer />
        </SpaceVertical>
      </ChartConfigProvider>
    </MapWrapper>
  )
}

