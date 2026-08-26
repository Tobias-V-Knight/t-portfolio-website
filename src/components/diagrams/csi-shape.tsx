// The CSI pipeline shape. ADR-0002 for the drawing, ADR-0003 for what it may
// and may not say.
import { Box, Arrow } from '../diagram-primitives'

// CSI, and the only thing this diagram is allowed to say.
//
// ADR-0003 splits what is being protected in two. The SHAPE is the pipeline
// every system in this category has and appears in every document intelligence
// vendor's marketing, so publishing it tells a competitor nothing they could
// not write down themselves. The MECHANISM is the stage internals, the corpus,
// the cost per unit, the model choices and the method, and it never ships.
//
// These six boxes are the shape as ADR-0003 writes it, word for word, and the
// test before changing any of them is the one the ADR sets: could a competitor
// build something meaningfully closer to the client's system having seen this?
// If the answer is anything but a confident no, cut detail until it is. Adding
// a label here is a client confidentiality decision, not a design one.
const CSI_STAGES: string[][] = [
  ['BID PDF'],
  ['PARSE +', 'CHUNK'],
  ['RETRIEVAL'],
  ['AGENTS', 'AND LLM'],
  ['STRUCTURED', 'EXTRACTION'],
  ['ESTIMATOR', 'UI'],
]

const CSI_TITLE = 'CSI bid intelligence, the pipeline shape'
const CSI_DESC =
  'Six stages in order: a bid PDF, parse and chunk, retrieval, agents and LLM, structured extraction, and the estimator interface. The shape only. The stage internals belong to the client and are not drawn.'

// Two drawings of one pipeline, and the reason there are two is measured
// rather than aesthetic. The wide one is 848 user units across; in a full
// bleed window on a 390px phone it renders at about 0.42 scale, which sets
// Silkscreen at four pixels. A bitmap face at four pixels is not small type,
// it is noise. The tall one renders at better than 1:1 on the same phone.
//
// This is not the breakpoint ADR-0004 rules out. That decision is about the
// document grid, which stays one layout at every width; a diagram is a picture,
// and a picture that is illegible at the width it is shown at has not been
// shown. Both render, and system.css picks one on a container query, so the
// choice follows the window rather than the viewport: a case study window is
// resizable and can be narrow on a large screen.

// Box width is set by the longest label, STRUCTURED and EXTRACTION at ten
// characters. Silkscreen advances about 0.78em, so ten characters at eleven
// units plus the tracking is roughly ninety, and a 120 unit box leaves fifteen
// either side. Adding a longer label than that is a redraw, not a string edit.
const W_BOX_W = 120
const W_BOX_H = 64
const W_GAP = 22
const W_X0 = 9
const W_Y = 30

function CsiShapeWide() {
  return (
    <svg className="mac-diagram mac-diagram-wide" viewBox="0 0 848 124" role="img" shapeRendering="crispEdges">
      <title>{CSI_TITLE}</title>
      <desc>{CSI_DESC}</desc>
      {CSI_STAGES.map((lines, i) => {
        const x = W_X0 + i * (W_BOX_W + W_GAP)
        return (
          <g key={lines.join(' ')}>
            <Box x={x} y={W_Y} w={W_BOX_W} h={W_BOX_H} lines={lines} />
            {i < CSI_STAGES.length - 1 && <Arrow x={x + W_BOX_W + 5} y={W_Y + W_BOX_H / 2} len={W_GAP - 10} />}
          </g>
        )
      })}
    </svg>
  )
}

const T_BOX_W = 160
const T_BOX_H = 46
const T_GAP = 30
const T_X = 30
const T_Y0 = 8

function CsiShapeTall() {
  return (
    <svg className="mac-diagram mac-diagram-tall" viewBox="0 0 220 452" role="img" shapeRendering="crispEdges">
      <title>{CSI_TITLE}</title>
      <desc>{CSI_DESC}</desc>
      {CSI_STAGES.map((lines, i) => {
        const y = T_Y0 + i * (T_BOX_H + T_GAP)
        return (
          <g key={lines.join(' ')}>
            <Box x={T_X} y={y} w={T_BOX_W} h={T_BOX_H} lines={lines} />
            {i < CSI_STAGES.length - 1 && (
              <Arrow x={T_X + T_BOX_W / 2} y={y + T_BOX_H + 6} len={T_GAP - 12} down />
            )}
          </g>
        )
      })}
    </svg>
  )
}

export default function CsiShape() {
  return (
    <>
      <CsiShapeWide />
      <CsiShapeTall />
    </>
  )
}
