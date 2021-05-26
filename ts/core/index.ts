import {DotEndpointHandler} from "./endpoint/dot-endpoint"
import {BlankEndpointHandler} from "./endpoint/blank-endpoint"
import {RectangleEndpointHandler} from "./endpoint/rectangle-endpoint"

import {StraightConnector} from "./connector/straight-connector"
import {FlowchartConnector} from "./connector/flowchart-connector"
import {BezierConnector} from "./connector/bezier-connector"
import {StateMachineConnector} from "./connector/statemachine-connector"

import { Connectors } from './connector/connectors'
import {EndpointFactory} from "./factory/endpoint-factory"

export * from "./constants"
export * from './common'
export * from "./core"
export * from "./defaults"
//export * from "./event-generator"
export * from './viewport'

export * from "./group/group"
export * from "./group/group-manager"

export * from "./component/component"

//export * from "./geom"
//export * from "./bezier"

export * from "./connector/abstract-connector"
export * from "./connector/abstract-segment"
export * from "./connector/arc-segment"
export * from "./connector/bezier-segment"
export * from "./connector/connection-impl"
export * from "./connector/connectors"
export * from "./connector/straight-segment"
export * from './connector/flowchart-connector'
export * from './connector/straight-connector'
export * from './connector/abstract-bezier-connector'
export * from './connector/bezier-connector'
export * from './connector/statemachine-connector'

export * from "./selection/connection-selection"

export * from './endpoint/endpoint'
export * from './endpoint/endpoint-options'
export * from './factory/endpoint-factory'
export * from './endpoint/endpoints'
export * from './endpoint/dot-endpoint'
export * from './endpoint/rectangle-endpoint'
export * from './endpoint/blank-endpoint'

export * from "./selection/endpoint-selection"

export * from './source-selector'

export * from "./overlay/overlay"
export * from "./overlay/label-overlay"
export * from "./overlay/arrow-overlay"
export * from "./overlay/plain-arrow-overlay"
export * from "./overlay/diamond-overlay"
export * from "./overlay/custom-overlay"
export * from "./factory/overlay-factory"

export * from './router/router'

export * from "./factory/anchor-record-factory"
export * from './router/lightweight-router'

export * from "./styles"
//export * from "./util"

EndpointFactory.registerHandler(DotEndpointHandler)
EndpointFactory.registerHandler(RectangleEndpointHandler)
EndpointFactory.registerHandler(BlankEndpointHandler)

Connectors.register(BezierConnector.type, BezierConnector)
Connectors.register(StraightConnector.type, StraightConnector)
Connectors.register(FlowchartConnector.type, FlowchartConnector)
Connectors.register(StateMachineConnector.type, StateMachineConnector)

