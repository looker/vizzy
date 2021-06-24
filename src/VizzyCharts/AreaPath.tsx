import React, {useState} from 'react'
import styled from "styled-components"
import {ComponentsProvider} from "@looker/components"

import {
  useChartConfig
} from './ChartConfigContextProvider'

const AreaPathWrapper = styled.path``

export const AreaPath = (props: any) => {
  const {handleAreaClick, getAreaColor} = useChartConfig()
	return (
    <AreaPathWrapper onClick={()=>handleAreaClick(props)} {...props} style={{fill: getAreaColor(props.id)}} />
  )
}

