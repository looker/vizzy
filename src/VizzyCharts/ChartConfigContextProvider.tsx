import React, { createContext, useState, useEffect, useContext } from "react"
import { COLOR_SCHEMES } from './Utils'

const defaultConfig: any = {
  colorOptions: {
    scheme: "BuRd (diverging)",
    rangeMax: 30,
    steps: 10
  },
  position: {
    x: -120,
    y: -350,
    active: false,
    scale: 1.5,
    offset: { }
  },
  res: {
    x: 65,
    y: 375,
    active: false,
    scale: 1.5,
    offset: { }
  },
  metadata: {
    chartTitle: "Presidential Election in ",
    chartDescription: "total vote percentage estimate by county equivalent",
    chartSource: "Data: US Election Reporting Project",
    chartAuthor: "@noahamac",
    geography: "Alaska",
    year: "2020",
    resultsTable: true,
    dem: "D",
    gop: "R",
  },
  data: {}
}

export const ChartConfigContext = createContext({
  config: defaultConfig,
  setChartConfig: (key: string, val: any)=>{}
});

export const ChartConfigProvider = (props: any) => {
  const [config, setConfig] = useState(defaultConfig);

  const [contextValue, setContextValue] = useState({
    config,
    setChartConfig: (key: string, val: any) => {
      setConfig((config: any) => {
        return { ...config, [key]: val };
      });
    }
  })

  useEffect(() => {
    setContextValue(currentValue => ({
      ...currentValue,
      config
    }));
  }, [config]);

  return (
    <ChartConfigContext.Provider value={contextValue}>
      {props.children}
    </ChartConfigContext.Provider>
  );
};

export function useChartConfig() {
  const { config, setChartConfig } = useContext(ChartConfigContext)

  const getAreaColor = (id: string) => {
    const colors = getColorPalette()
    if (config[id]) {
      return config[id].fill
    }
    let initStyle: any = {}
    const valueSeed = Math.floor(Math.random() * colors.length)
    initStyle = {
      fill: colors[valueSeed]
    }
    setChartConfig(id, initStyle)
    return initStyle.fill
  }

  const handleAreaClick = (props: any) => {
    const colors = getColorPalette()
    let nextIndex = colors.indexOf(config[props.id].fill) + 1
    if (nextIndex >= colors.length) {
      nextIndex = 0
    }
    setChartConfig(props.id, {
      ...config[props.id],
      fill: colors[nextIndex]
    })
  }

  const getColorPalette = () => COLOR_SCHEMES[config.colorOptions.scheme].slice(config.colorOptions.steps*-1)

  const handlePointerDown = (e: any) => {
    const el = e.target;
    const bbox = e.target.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    el.setPointerCapture(e.pointerId);
    setChartConfig('position', {
      ...config.position,
      active: true,
      offset: {
        x,
        y
      }
    })
  }

  const handlePointerMove = (e: any) => {
    const bbox = e.target.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    if (config.position.active) {
      setChartConfig('position', {
        ...config.position,
        x: config.position.x - (config.position.offset.x - x),
        y: config.position.y - (config.position.offset.y - y)
      })
    }
  }

  const handlePointerUp = (e: any) => {
    setChartConfig('position', {
      ...config.position,
      active: false
    })
  }

  const handleResultsDown = (e: any) => {
    const el = e.target;
    const bbox = e.target.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    el.setPointerCapture(e.pointerId);
    setChartConfig('res', {
      ...config.res,
      active: true,
      offset: {
        x,
        y
      }
    })
  }

  const handleResultsMove = (e: any) => {
    const bbox = e.target.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    if (config.res.active) {
      setChartConfig('res', {
        ...config.res,
        x: config.res.x - (config.res.offset.x - x),
        y: config.res.y - (config.res.offset.y - y)
      })
    }
  }

  const handleResultsUp = (e: any) => {
    setChartConfig('res', {
      ...config.res,
      active: false
    })
  }

  const getPosition = () => config.position

  const getResultsMetadata = () => config.res

  const getColorOptions = () => config.colorOptions

  const getChartMetadata = () => config.metadata

  const getColorBin = (unb: number) => {
    return getColorPalette()[unb]
  }

  const handleColorSchemeChange = (value: any) => {
    setChartConfig('colorOptions', {
    ...config.colorOptions,
    scheme: value
  })}

  const handleTitleChange = (e: any) => {
    setChartConfig('metadata', {
      ...config.metadata,
      chartTitle: e.currentTarget.value
    })
  }

  const handleDescriptionChange = (e: any) => {
    setChartConfig('metadata', {
      ...config.metadata,
      chartDescription: e.currentTarget.value
    })
  }

  const handleSourceChange = (e: any) => {
    setChartConfig('metadata',{
      ...config.metadata,
      chartSource: e.currentTarget.value
    })
  }

  const handleAuthorChange = (e: any) => {
    setChartConfig('metadata', {
      ...config.metadata,
      author: e.currentTarget.value
    })
  }
  const handleGeographyChange = (value: any) => {
    setChartConfig('metadata', {
      ...config.metadata,
      geography: value
    })
    setChartConfig('position', {
      ...config.position,
      x: -120,
      y: -350,
    })
  }

  const handleScaleSlider = (event: any) => {
    const k = event.target.value
    setChartConfig('position', {
      ...config.position,
      scale: k
    })
  }

  const handleRangeSlider = (event: any) => {
    const k = event.target.value
    setChartConfig('colorOptions', {
      ...config.colorOptions,
      rangeMax: k
    })
  }

  const handleResultsCheckbox = () => {
    setChartConfig('metadata', {
      ...config.metadata,
      resultsTable: !config.metadata.resultsTable
    })
  }

  const handleDemChange = (event: any) => {
    const name = event.target.value
    setChartConfig('metadata', {
      ...config.metadata,
      dem: name
    })
  }

  const handleGopChange = (event: any) => {
    const name = event.target.value
    setChartConfig('metadata', {
      ...config.metadata,
      gop: name
    })
  }

  const handleStepsSlider = (event: any) => {
    const k = event.target.value
    setChartConfig('colorOptions', {
      ...config.colorOptions,
      steps: k
    })
  }



  return { 
    handleAreaClick,
    getAreaColor,
    getColorPalette,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleResultsDown,
    handleResultsMove,
    handleResultsUp,
    getPosition,
    getColorOptions,
    handleColorSchemeChange,
    handleTitleChange,
    handleDescriptionChange,
    handleSourceChange,
    handleAuthorChange,
    getChartMetadata,
    handleGeographyChange,
    handleScaleSlider,
    handleRangeSlider,
    handleResultsCheckbox,
    handleDemChange,
    handleGopChange,
    handleStepsSlider,
    getColorBin,
    getResultsMetadata,
  }
}
