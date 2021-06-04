import React from 'react'
import styled from "styled-components"
import {ComponentsProvider} from "@looker/components"

const ChartAreaWrapper = styled.div``

export const ChartArea = (props: any) => {
	return (
    <ComponentsProvider
      loadGoogleFonts
      themeCustomizations={{colors: {key: "rgb(45, 126, 234)"}}}>
        <ChartAreaWrapper>{...props.children}</ChartAreaWrapper>
    </ComponentsProvider>
  )
}

