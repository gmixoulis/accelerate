"use client"

import { Hydrate as RQHydrate } from "@tanstack/react-query"

function Hydrate(props) {
  return React.createElement(RQHydrate, props)
}

export default Hydrate
