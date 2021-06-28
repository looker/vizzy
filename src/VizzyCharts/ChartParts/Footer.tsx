import React from 'react'
import { 
  Space,
  Paragraph,
  InlineInputText
} from '@looker/components'
import {
  useChartConfig
} from '../ChartConfigContextProvider'

export const Footer = () => {
  const {
    getChartMetadata
  } = useChartConfig()

  const md = getChartMetadata()

	return (
    <Space between>
      <Paragraph fontSize='small' color='secondary'>
        <InlineInputText simple value={md.chartSource} />
      </Paragraph>
      <Paragraph fontSize='small' color='secondary'>
        <InlineInputText simple value={md.chartAuthor} />
      </Paragraph>
    </Space>
  )
}

