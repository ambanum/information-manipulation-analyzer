import * as Highcharts from 'highcharts';

import {
  EdgeShapes,
  Filter,
  ForceAtlas2,
  ForceLink,
  LoadGEXF,
  LoadJSON,
  NodeShapes,
  RandomizeNodePositions,
  RelativeSize,
  Sigma,
} from 'react-sigma';

import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsNetworkGraph from 'highcharts/modules/networkgraph';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import classNames from 'classnames';
import { paletteColors } from '../components/Charts/config';
import s from './NetworkGraph.module.css';
import useSwr from 'swr';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

HighchartsNetworkGraph(Highcharts);

type NetworkGraphProps = {
  // TODO
  name?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const NetworkGraph: React.FC<NetworkGraphProps> = ({ children, className, name, ...props }) => {
  const { data } = useSwr(`/geolocalized.json`);
  // const { data } = useSwr(`/BoycottFranceCorrection.json`);
  console.log(''); //eslint-disable-line
  console.log('╔════START══data══════════════════════════════════════════════════'); //eslint-disable-line
  console.log(data); //eslint-disable-line
  console.log('╚════END════data══════════════════════════════════════════════════'); //eslint-disable-line

  const [options, setOptions] = React.useState<Highcharts.Options>({
    chart: {
      type: 'networkgraph',
      height: '100%',
    },
    title: {
      text: 'The Indo-European Language Tree',
    },
    subtitle: {
      text: 'A Force-Directed Network Graph in Highcharts',
    },
    plotOptions: {
      networkgraph: {
        keys: ['from', 'to'],
        layoutAlgorithm: {
          enableSimulation: true,
          friction: -0.9,
        },
      },
    },
    series: [
      {
        dataLabels: {
          enabled: true,
          linkFormat: '',
        },
        id: 'lang-tree',
        data: [
          ['Proto Indo-European', 'Balto-Slavic'],
          ['Proto Indo-European', 'Germanic'],
          ['Proto Indo-European', 'Celtic'],
          ['Proto Indo-European', 'Italic'],
          ['Proto Indo-European', 'Hellenic'],
          ['Proto Indo-European', 'Anatolian'],
          ['Proto Indo-European', 'Indo-Iranian'],
          ['Proto Indo-European', 'Tocharian'],
          ['Indo-Iranian', 'Dardic'],
          ['Indo-Iranian', 'Indic'],
          ['Indo-Iranian', 'Iranian'],
          ['Iranian', 'Old Persian'],
          ['Old Persian', 'Middle Persian'],
          ['Indic', 'Sanskrit'],
          ['Italic', 'Osco-Umbrian'],
          ['Italic', 'Latino-Faliscan'],
          ['Latino-Faliscan', 'Latin'],
          ['Celtic', 'Brythonic'],
          ['Celtic', 'Goidelic'],
          ['Germanic', 'North Germanic'],
          ['Germanic', 'West Germanic'],
          ['Germanic', 'East Germanic'],
          ['North Germanic', 'Old Norse'],
          ['North Germanic', 'Old Swedish'],
          ['North Germanic', 'Old Danish'],
          ['West Germanic', 'Old English'],
          ['West Germanic', 'Old Frisian'],
          ['West Germanic', 'Old Dutch'],
          ['West Germanic', 'Old Low German'],
          ['West Germanic', 'Old High German'],
          ['Old Norse', 'Old Icelandic'],
          ['Old Norse', 'Old Norwegian'],
          ['Old Norwegian', 'Middle Norwegian'],
          ['Old Swedish', 'Middle Swedish'],
          ['Old Danish', 'Middle Danish'],
          ['Old English', 'Middle English'],
          ['Old Dutch', 'Middle Dutch'],
          ['Old Low German', 'Middle Low German'],
          ['Old High German', 'Middle High German'],
          ['Balto-Slavic', 'Baltic'],
          ['Balto-Slavic', 'Slavic'],
          ['Slavic', 'East Slavic'],
          ['Slavic', 'West Slavic'],
          ['Slavic', 'South Slavic'],
          // Leaves:
          ['Proto Indo-European', 'Phrygian'],
          ['Proto Indo-European', 'Armenian'],
          ['Proto Indo-European', 'Albanian'],
          ['Proto Indo-European', 'Thracian'],
          ['Tocharian', 'Tocharian A'],
          ['Tocharian', 'Tocharian B'],
          ['Anatolian', 'Hittite'],
          ['Anatolian', 'Palaic'],
          ['Anatolian', 'Luwic'],
          ['Anatolian', 'Lydian'],
          ['Iranian', 'Balochi'],
          ['Iranian', 'Kurdish'],
          ['Iranian', 'Pashto'],
          ['Iranian', 'Sogdian'],
          ['Old Persian', 'Pahlavi'],
          ['Middle Persian', 'Persian'],
          ['Hellenic', 'Greek'],
          ['Dardic', 'Dard'],
          ['Sanskrit', 'Sindhi'],
          ['Sanskrit', 'Romani'],
          ['Sanskrit', 'Urdu'],
          ['Sanskrit', 'Hindi'],
          ['Sanskrit', 'Bihari'],
          ['Sanskrit', 'Assamese'],
          ['Sanskrit', 'Bengali'],
          ['Sanskrit', 'Marathi'],
          ['Sanskrit', 'Gujarati'],
          ['Sanskrit', 'Punjabi'],
          ['Sanskrit', 'Sinhalese'],
          ['Osco-Umbrian', 'Umbrian'],
          ['Osco-Umbrian', 'Oscan'],
          ['Latino-Faliscan', 'Faliscan'],
          ['Latin', 'Portugese'],
          ['Latin', 'Spanish'],
          ['Latin', 'French'],
          ['Latin', 'Romanian'],
          ['Latin', 'Italian'],
          ['Latin', 'Catalan'],
          ['Latin', 'Franco-Provençal'],
          ['Latin', 'Rhaeto-Romance'],
          ['Brythonic', 'Welsh'],
          ['Brythonic', 'Breton'],
          ['Brythonic', 'Cornish'],
          ['Brythonic', 'Cuymbric'],
          ['Goidelic', 'Modern Irish'],
          ['Goidelic', 'Scottish Gaelic'],
          ['Goidelic', 'Manx'],
          ['East Germanic', 'Gothic'],
          ['Middle Low German', 'Low German'],
          ['Middle High German', '(High) German'],
          ['Middle High German', 'Yiddish'],
          ['Middle English', 'English'],
          ['Middle Dutch', 'Hollandic'],
          ['Middle Dutch', 'Flemish'],
          ['Middle Dutch', 'Dutch'],
          ['Middle Dutch', 'Limburgish'],
          ['Middle Dutch', 'Brabantian'],
          ['Middle Dutch', 'Rhinelandic'],
          ['Old Frisian', 'Frisian'],
          ['Middle Danish', 'Danish'],
          ['Middle Swedish', 'Swedish'],
          ['Middle Norwegian', 'Norwegian'],
          ['Old Norse', 'Faroese'],
          ['Old Icelandic', 'Icelandic'],
          ['Baltic', 'Old Prussian'],
          ['Baltic', 'Lithuanian'],
          ['Baltic', 'Latvian'],
          ['West Slavic', 'Polish'],
          ['West Slavic', 'Slovak'],
          ['West Slavic', 'Czech'],
          ['West Slavic', 'Wendish'],
          ['East Slavic', 'Bulgarian'],
          ['East Slavic', 'Old Church Slavonic'],
          ['East Slavic', 'Macedonian'],
          ['East Slavic', 'Serbo-Croatian'],
          ['East Slavic', 'Slovene'],
          ['South Slavic', 'Russian'],
          ['South Slavic', 'Ukrainian'],
          ['South Slavic', 'Belarusian'],
          ['South Slavic', 'Rusyn'],
        ],
      },
    ],
  });

  return (
    <div className={classNames(s.wrapper, className)} {...props}>
      NetworkGraph {name}
      {children}
      <Sigma
        style={{
          width: '1000px',
          height: '600px',
          margin: '0 auto',
        }}
        settings={{
          /**
           * GRAPH SETTINGS:
           * ***************
           */
          // {boolean} Indicates if the data have to be cloned in methods to add
          //           nodes or edges.
          clone: true,
          // {boolean} Indicates if nodes "id" values and edges "id", "source" and
          //           "target" values must be set as immutable.
          immutable: true,
          // {boolean} Indicates if sigma can log its errors and warnings.
          verbose: false,

          /**
           * RENDERERS SETTINGS:
           * *******************
           */
          // {string}
          classPrefix: 'sigma',
          // {string}
          defaultNodeType: 'def',
          // {string}
          defaultEdgeType: 'def',
          // {string}
          defaultLabelColor: '#000',
          // {string}
          defaultEdgeColor: '#CCC',
          // {string}
          defaultNodeColor: '#000',
          // {string}
          defaultLabelSize: 14,
          // {string} Indicates how to choose the edges color. Available values:
          //          "source", "target", "default"
          edgeColor: 'source',
          // {number} Defines the minimal edge's arrow display size.
          minArrowSize: 0,
          // {string}
          font: 'arial',
          // {string} Example: 'bold'
          fontStyle: '',
          // {string} Indicates how to choose the labels color. Available values:
          //          "node", "default"
          labelColor: 'node',
          // {string} Indicates how to choose the labels size. Available values:
          //          "fixed", "proportional"
          labelSize: 'fixed',
          // {string} The ratio between the font size of the label and the node size.
          labelSizeRatio: 5,
          // {number} The minimum size a node must have to see its label displayed.
          labelThreshold: 3,
          // {number} The oversampling factor used in WebGL renderer.
          webglOversamplingRatio: 2,
          // {number} The size of the border of hovered nodes.
          borderSize: 2,
          // {number} The default hovered node border's color.
          defaultNodeBorderColor: '#000',
          // {number} The hovered node's label font. If not specified, will heritate
          //          the "font" value.
          hoverFont: '',
          // {boolean} If true, then only one node can be hovered at a time.
          singleHover: true,
          // {string} Example: 'bold'
          hoverFontStyle: '',
          // {string} Indicates how to choose the hovered nodes shadow color.
          //          Available values: "node", "default"
          labelHoverShadow: 'default',
          // {string}
          labelHoverShadowColor: '#000',
          // {string} Indicates how to choose the hovered nodes color.
          //          Available values: "node", "default"
          nodeHoverColor: 'node',
          // {string}
          defaultNodeHoverColor: '#000',
          // {string} Indicates how to choose the hovered nodes background color.
          //          Available values: "node", "default"
          labelHoverBGColor: 'default',
          // {string}
          defaultHoverLabelBGColor: '#fff',
          // {string} Indicates how to choose the hovered labels color.
          //          Available values: "node", "default"
          labelHoverColor: 'default',
          // {string}
          defaultLabelHoverColor: '#000',
          // {string} Indicates how to choose the edges hover color. Available values:
          //          "edge", "default"
          edgeHoverColor: 'edge',
          // {number} The size multiplicator of hovered edges.
          edgeHoverSizeRatio: 3,
          // {string}
          defaultEdgeHoverColor: '#000',
          // {boolean} Indicates if the edge extremities must be hovered when the
          //           edge is hovered.
          edgeHoverExtremities: true,
          // {booleans} The different drawing modes:
          //           false: Layered not displayed.
          //           true: Layered displayed.
          drawEdges: true,
          drawNodes: true,
          drawLabels: true,
          drawEdgeLabels: true,
          // {boolean} Indicates if the edges must be drawn in several frames or in
          //           one frame, as the nodes and labels are drawn.
          batchEdgesDrawing: true,
          // {boolean} Indicates if the edges must be hidden during dragging and
          //           animations.
          hideEdgesOnMove: true,
          // {numbers} The different batch sizes, when elements are displayed in
          //           several frames.
          canvasEdgesBatchSize: 500,
          webglEdgesBatchSize: 1000,

          /**
           * RESCALE SETTINGS:
           * *****************
           */
          // {string} Indicates of to scale the graph relatively to its container.
          //          Available values: "inside", "outside"
          scalingMode: 'inside',
          // {number} The margin to keep around the graph.
          sideMargin: 0,
          // {number} Determine the size of the smallest and the biggest node / edges
          //          on the screen. This mapping makes easier to display the graph,
          //          avoiding too big nodes that take half of the screen, or too
          //          small ones that are not readable. If the two parameters are
          //          equals, then the minimal display size will be 0. And if they
          //          are both equal to 0, then there is no mapping, and the radius
          //          of the nodes will be their size.
          minEdgeSize: 0.5,
          maxEdgeSize: 1,
          minNodeSize: 1,
          maxNodeSize: 8,

          /**
           * CAPTORS SETTINGS:
           * *****************
           */
          // {boolean}
          touchEnabled: true,
          // {boolean}
          mouseEnabled: true,
          // {boolean}
          mouseWheelEnabled: true,
          // {boolean}
          doubleClickEnabled: true,
          // {boolean} Defines whether the custom events such as "clickNode" can be
          //           used.
          eventsEnabled: true,
          // {number} Defines by how much multiplicating the zooming level when the
          //          user zooms with the mouse-wheel.
          zoomingRatio: 1.7,
          // {number} Defines by how much multiplicating the zooming level when the
          //          user zooms by double clicking.
          doubleClickZoomingRatio: 2.2,
          // {number} The minimum zooming level.
          zoomMin: 0.0625,
          // {number} The maximum zooming level.
          zoomMax: 3,
          // {number} The duration of animations following a mouse scrolling.
          mouseZoomDuration: 200,
          // {number} The duration of animations following a mouse double click.
          doubleClickZoomDuration: 200,
          // {number} The duration of animations following a mouse dropping.
          mouseInertiaDuration: 200,
          // {number} The inertia power (mouse captor).
          mouseInertiaRatio: 3,
          // {number} The duration of animations following a touch dropping.
          touchInertiaDuration: 200,
          // {number} The inertia power (touch captor).
          touchInertiaRatio: 3,
          // {number} The maximum time between two clicks to make it a double click.
          doubleClickTimeout: 300,
          // {number} The maximum time between two taps to make it a double tap.
          doubleTapTimeout: 300,
          // {number} The maximum time of dragging to trigger intertia.
          dragTimeout: 200,

          /**
           * GLOBAL SETTINGS:
           * ****************
           */
          // {boolean} Determines whether the instance has to refresh itself
          //           automatically when a "resize" event is dispatched from the
          //           window object.
          autoResize: true,
          // {boolean} Determines whether the "rescale" middleware has to be called
          //           automatically for each camera on refresh.
          autoRescale: true,
          // {boolean} If set to false, the camera method "goTo" will basically do
          //           nothing.
          enableCamera: true,
          // {boolean} If set to false, the nodes cannot be hovered.
          enableHovering: true,
          // {boolean} If set to true, the edges can be hovered.
          enableEdgeHovering: false,
          // {number} The size of the area around the edges to activate hovering.
          edgeHoverPrecision: 5,
          // {boolean} If set to true, the rescale middleware will ignore node sizes
          //           to determine the graphs boundings.
          rescaleIgnoreSize: false,
          // {boolean} Determines if the core has to try to catch errors on
          //           rendering.
          skipErrors: false,

          /**
           * CAMERA SETTINGS:
           * ****************
           */
          // {number} The power degrees applied to the nodes/edges size relatively to
          //          the zooming level. Basically:
          //           > onScreenR = Math.pow(zoom, nodesPowRatio) * R
          //           > onScreenT = Math.pow(zoom, edgesPowRatio) * T
          nodesPowRatio: 0.5,
          edgesPowRatio: 0.5,

          /**
           * ANIMATIONS SETTINGS:
           * ********************
           */
          // {number} The default animation time.
          animationsTime: 200,
        }}
      >
        <LoadJSON path={`${process.env.NEXT_PUBLIC_BASE_PATH}/geolocalized.json`}>
          <RelativeSize initialSize={15} />
          <RandomizeNodePositions />
        </LoadJSON>
      </Sigma>
      {/* <div style={{ width: '600px', height: '600px', border: '1px solid green' }}>
        <HighchartsReact highcharts={Highcharts} options={options} {...props} />
      </div> */}
      {/* <h2>{`${path}/public/arctic copy.json`}</h2>
      <Sigma style={{ width: '600px', height: '600px', border: '1px solid red' }}>
        <LoadJSON path={`${path}/public/arctic copy.json`} />
      </Sigma>
      <h2>{`${path}/public/arctic copy.json`}</h2>
      <Sigma
        settings={{
          batchEdgesDrawing: true,
          defaultLabelColor: '#777',
          defaultLabelSize: 8,
          defaultNodeColor: '#3388AA',
          drawEdgeLabels: false,
          drawEdges: true,
          hoverFontStyle: 'text-size: 11',
          labelThreshold: 12,
        }}
        style={{
          height: '600px',
          width: '600px',
          maxWidth: 'inherit',
          border: '1px solid blue',
        }}
      >
        <LoadJSON path={`${path}/public/arctic copy.json`} />
      </Sigma>
      <Sigma
        renderer="canvas"
        style={{ maxWidth: 'inherit', height: '600px', width: '600px' }}
        settings={{ drawEdges: false }}
        onOverNode={(e) => console.log('Mouse over node: ' + e.data.node.label)}
        graph={{ nodes: ['id0', 'id1'], edges: [{ id: 'e0', source: 'id0', target: 'id1' }] }}
      >
        <RelativeSize initialSize={8} />
      </Sigma> */}
    </div>
  );
};

export default NetworkGraph;
