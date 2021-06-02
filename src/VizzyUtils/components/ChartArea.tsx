import React from 'react'
import styled from "styled-components"
import {ComponentsProvider, Tab, Tabs, TabList, TabPanels, TabPanel} from "@looker/components"

const ChartAreaWrapper = styled.div``

export const ChartArea = (props: any) => {
	return <ComponentsProvider
    loadGoogleFonts
    themeCustomizations={{colors: {key: "rgb(45, 126, 234)"}}}>
      <ChartAreaWrapper>{...props.children}
        <Tabs>
          <TabList distribute>
            <Tab>
            JSON Viewer
            </Tab>
            <Tab>
            Example Vizualization
            </Tab>
            <Tab>
            API Explorer
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
            JSON Viewer
            </TabPanel>
            <TabPanel>
            Example Vizualization
            </TabPanel>
            <TabPanel>
            API Explorer
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ChartAreaWrapper>
  </ComponentsProvider>
}

