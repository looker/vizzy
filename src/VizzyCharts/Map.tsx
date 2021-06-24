import React from 'react'
import { Heading, Paragraph, SpaceVertical, FlexItem, Space } from '@looker/components'
import styled from "styled-components"

import { Alaska } from './Alaska'
import { Legend } from './Legend'
import {
  ChartConfigProvider
} from './ChartConfigContextProvider'

const MapWrapper = styled.div`height: 80vh`

export const Map = () => {
	return (
    <MapWrapper>
      <ChartConfigProvider>
        <SpaceVertical gap='small'>
          <SpaceVertical gap='none'>
            <Heading as='h1'>Presidential Election in Alaska, 1960</Heading>
            <Paragraph>total vote percentage estimate by county equivalent</Paragraph>
          </SpaceVertical>
          <Legend />
          <Alaska/>
        </SpaceVertical>
      </ChartConfigProvider>
    </MapWrapper>
  )
}

