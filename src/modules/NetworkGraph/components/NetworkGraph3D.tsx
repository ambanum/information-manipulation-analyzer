import * as THREE from 'three';

import ForceGraph3D, { ForceGraphProps } from 'react-force-graph-3d';
import type { NetworkGraphJson } from './NetworkGraph.d';
// @ts-nocheck
import React from 'react';
import SpriteText from 'three-spritetext';
import classNames from 'classnames';

type NetworkGraphReact3DProps = {
  graph: NetworkGraphJson;
  onLinkClick: any;
  onNodeHover: ForceGraphProps['onNodeHover'];
  onLinkHover: ForceGraphProps['onLinkHover'];
} & React.HTMLAttributes<HTMLDivElement>;

const NetworkGraphReactTree: React.FC<NetworkGraphReact3DProps> = React.memo(
  ({ children, className, graph, onLinkClick, onNodeHover, onLinkHover, ...props }) => {
    const [highlightNodes, setHighlightNodes] = React.useState(new Set());
    const [highlightLinks, setHighlightLinks] = React.useState(new Set());
    // const [hoverNode, setHoverNode] = React.useState<any>(null);

    const updateHighlight = () => {
      setHighlightNodes(highlightNodes);
      setHighlightLinks(highlightLinks);
    };

    // const handleNodeHover: ForceGraphProps['onNodeHover'] = (node) => {
    //   highlightNodes.clear();
    //   highlightLinks.clear();
    //   if (node) {
    //     highlightNodes.add(node);
    //     if (node.neighbors) {
    //       node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
    //     }
    //     if (node.links) {
    //       node.links.forEach((link) => highlightLinks.add(link));
    //     }
    //   }

    //   setHoverNode(node || null);
    //   updateHighlight();
    // };
    const handleNodeHover: ForceGraphProps['onNodeHover'] = (node, ...rest) => {
      if (!node) {
        return;
      }
      if (onNodeHover) onNodeHover(node, ...rest);
    };

    const handleLinkHover = React.useCallback(
      (link, previousLink) => {
        highlightNodes.clear();
        highlightLinks.clear();

        if (link) {
          highlightLinks.add(link);
          highlightNodes.add(link.source);
          highlightNodes.add(link.target);
        }

        updateHighlight();
        if (onLinkHover && link) onLinkHover(link, previousLink);
      },
      [highlightNodes, highlightLinks, setHighlightNodes, setHighlightLinks]
    );

    return (
      <div className={classNames(className)} {...props}>
        <ForceGraph3D
          graphData={{ nodes: graph.nodes, links: graph.edges }}
          backgroundColor="#1b1b35"
          nodeAutoColorBy="color"
          linkAutoColorBy="color"
          nodeVal={(node) => node.size}
          nodeLabel={({ label, size }) => `${label} (${size} time${size >= 2 ? 's' : ''})`}
          nodeOpacity={1} /* Nodes sphere opacity, between [0,1 */
          nodeResolution={6} /* Nodes sphere resolution */
          linkDirectionalArrowRelPos={0.5} /* if arrow is on the edge or in the middle */
          linkDirectionalArrowLength={6} /* Size of arrow */
          linkDirectionalArrowColor={() => '#fff'} /* Arrow color */
          linkDirectionalArrowResolution={3} /* Arrow resolution */
          linkResolution={2}
          linkOpacity={0.1} /* Links opacity, between 0 and 1 */
          linkCurvature={0.25} /* curvature radius of the link line */
          linkLabel={({ label, size, source, target, ...rest }) => {
            return `${source?.label} ${label} ${target?.label} (${size} time${
              size >= 2 ? 's' : ''
            })`;
          }}
          linkWidth={({ size }) => Math.sqrt(size)}
          enableNodeDrag={false} /* disable node drag */
          onNodeHover={handleNodeHover}
          onLinkHover={handleLinkHover}
          onLinkClick={onLinkClick}
          // nodeThreeObject={(node) => {
          //   const s = new THREE.SphereGeometry(node.size);
          //   const canvas1 = document.createElement('canvas');
          //   const context1 = canvas1.getContext('2d');
          //   context1.font = 'Bold 10px Arial';
          //   context1.fillStyle = 'rgba(255,0,0,1)';
          //   context1.fillText('Hello, world!', 0, 60);

          //   // canvas contents will be used for a texture
          //   const t = new THREE.Texture(canvas1);
          //   // const group = new THREE.Group();
          //   // group.add(s);
          //   // group.add(t);

          //   const object3d = new THREE.Object3D();
          //   object3d.add(s);
          //   object3d.add(t);
          //   return object3d;
          // }}

          // linkDirectionalParticles={1}
          // linkDirectionalParticleColor={() => '#fff'}
          // linkDirectionalParticleResolution={1}
          // linkDirectionalParticleWidth={(link) => (highlightLinks.has(link) ? 2 : 0)}
          // linkDirectionalParticles={({ size }) => size}
          // linkDirectionalParticleColor="black"
          // linkDirectionalParticleResolution={1}
          // linkDirectionalParticleWidth={(link) => (highlightLinks.has(link) ? 2 : 0)}
        />
      </div>
    );
  }
);

export default NetworkGraphReactTree;
