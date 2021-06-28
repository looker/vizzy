import React from 'react'
import { 
  Heading,
  SpaceVertical,
  Paragraph,
  InlineInputText
} from '@looker/components'
import {
  useChartConfig
} from '../ChartConfigContextProvider'

export const Header = () => {
  const {
    getChartMetadata
  } = useChartConfig()

  const md = getChartMetadata()

	return (
    <SpaceVertical gap='none'>
      <Heading as='h1'>
        <InlineInputText simple value={md.chartTitle} />
        {md.geography}
        {', ' + md.year.toString()}
      </Heading>
      <Paragraph>
        <InlineInputText simple value={md.chartDescription} />
      </Paragraph>
    </SpaceVertical>
  )
}
