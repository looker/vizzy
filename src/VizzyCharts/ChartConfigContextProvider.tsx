import React, { createContext, useState, useEffect, useContext } from "react";

const defaultConfig: any = {
  colors: ["#003f5c", "#58508d", "#bc5090", "#ff6361", "#ffa600"],
  colorOptions: {
    type: "diverging",
    scheme: "BuRd",
  },
  position: {
    x: -120,
    y: -350,
    active: false,
    offset: { }
  }
}

export const ChartConfigContext = createContext({
  config: defaultConfig,
  setChartConfig: (key: string, val: any)=>{}
});

export const ChartConfigProvider = (props: any) => {
  // replace with useReducer for more flexiblity
  const [config, setConfig] = useState(defaultConfig);

  const [contextValue, setContextValue] = useState({
    config,
    setChartConfig: (key: string, val: any) => {
      setConfig((config: any) => {
        return { ...config, [key]: val };
      });
    }
    // other stuff you need in context
  });

  // avoids deep re-renders
  // when instances of stuff in context change
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
    if (config[id]) {
      return config[id].fill
    }
    let initStyle: any = {}
    Object.assign(initStyle, config)
    const valueSeed = Math.floor(Math.random() * config.colors.length)
    initStyle[id] = {
      fill: config.colors[valueSeed]
    }
    setChartConfig(id, initStyle[id])
    return initStyle[id].fill
  }

  const getNextPaletteIndex = (id: string) => {
    return config.colors.indexOf(config[id].fill) === (config.colors.length - 1) ? 0 : config.colors.indexOf(config[id].fill) + 1
  }

  const handleAreaClick = (props: any) => {
    let newStyle: any = {}
    Object.assign(newStyle, config)
    const nextIndex = getNextPaletteIndex(props.id)
    newStyle[props.id] = {
      fill: config.colors[nextIndex]
    }
    setChartConfig(props.id, newStyle[props.id])
  }

  const getColorPalette = () => config.colors

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

  const getPosition = () => config.position

  const getColorOptions = () => config.colorOptions

  const handleColorSchemeChange = (value: any) => setChartConfig('colorOptions', {
    type: config.colorOptions.type,
    scheme: value
  })

  return { 
    handleAreaClick,
    getAreaColor,
    getColorPalette,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    getPosition,
    getColorOptions,
    handleColorSchemeChange
  }
}
