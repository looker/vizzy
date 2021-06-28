import React, {useState} from 'react'
import styled from "styled-components"
import {ComponentsProvider} from "@looker/components"

import {
  useChartConfig
} from '../ChartConfigContextProvider'

const AreaPolylineWrapper = styled.polyline``

export const AreaPolyline = (props: any) => {
  const {handleAreaClick, getAreaColor} = useChartConfig()
	return (
    <AreaPolylineWrapper onClick={()=>handleAreaClick(props)} {...props} style={{fill: getAreaColor(props.id)}} />
  )
}

