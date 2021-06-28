import React from 'react'
import {
  InlineInputText,
  Text,
  Space,
  SpaceVertical,
  Heading
} from '@looker/components'
import {
  useChartConfig
} from '../ChartConfigContextProvider'

export const ResultsTable = () => {
  const {
    getChartMetadata
  } = useChartConfig()
  const md = getChartMetadata()
	return (
    <Space 
      // @ts-ignore
      p='xsmall'
      gap='small'>
      <SpaceVertical gap='xxsmall'>
        <Text>{md.dem}</Text>
        <Text>{md.gop}</Text>
      </SpaceVertical>
      <SpaceVertical gap='xxsmall'>
        <InlineInputText simple value={'50.3%'} />
        <InlineInputText simple value={'49.7%'} />
      </SpaceVertical>
      <Heading color={'#00B8F5'}><InlineInputText simple value={'+0.6%'} /></Heading>
    </Space>
  )
}
