import React from 'react';
import { Circle, Group } from 'react-konva';
import Shapes from './Shapes';

class CircleShape extends Shapes {
  render() {
      const { x, y, handleDrop } = this.props;

    return (
      <Group
        x={x}
        y={y}
        draggable
        stroke="black"
        strokeWidth={1}
        onDragEnd={(e) => handleDrop(e, "circle")}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
      >
        <Circle
          x={100 / 2}
          y={100 / 2}
          radius={45}
          fill='white'
          opacity={0.5}
        />
        <Circle
          x={100 / 2}
          y={100 / 2}
          radius={30}
          fill={'skyblue'}
          stroke={'black'}
          strokeWidth={1}
        />
      </Group>
    );
  }
}

export default CircleShape;
