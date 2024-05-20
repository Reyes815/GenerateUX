import React, { createRef } from 'react';
import { Shape, Group, Line } from 'react-konva';
import Shapes from './Shapes';
import TextAttachment from './TextAttachment';

class Object extends Shapes {
  constructor(props) {
    super(props);
    this.shapeRef = createRef();
    this.handleRef = createRef();
  }

  componentDidMount() {
    const shapeNode = this.shapeRef.current;
    const handleNode = this.handleRef.current;

    const onMouseMoveResize = (event) => {
      const dx = event.evt.movementX;
      const dy = event.evt.movementY;
      shapeNode.width(shapeNode.width() + dx);
      shapeNode.height(shapeNode.height() + dy);
    };

    handleNode.on("dragmove", onMouseMoveResize);

    return () => {
      handleNode.off("dragmove", onMouseMoveResize);
    };
  }

  render() {
    const { x, y, fill, handleDrop } = this.props;

    return (
      <Group draggable onDragEnd={(e) => handleDrop(e, "object")}>
        <Line
          ref={this.handleRef}
          points={[x + 100, y + 50, x + 110, y + 50, x + 110, y + 60]}
          stroke="blue"
          strokeWidth={4}
          draggable
        />
        <Shape
          x={x}
          y={y}
          width={100}
          height={50}
          ref={this.shapeRef}
          sceneFunc={(context, shape) => {
            const width = shape.width();
            const height = shape.height();
            const cornerRadius = 0;

            context.beginPath();
            context.moveTo(cornerRadius, 0);
            context.arcTo(width, 0, width, cornerRadius, cornerRadius);
            context.arcTo(width, height, width - cornerRadius, height, cornerRadius);
            context.arcTo(0, height, 0, height - cornerRadius, cornerRadius);
            context.arcTo(0, 0, cornerRadius, 0, cornerRadius);
            context.closePath();

            context.fillStrokeShape(shape);
          }}
          fill={fill}
          stroke="black"
          strokeWidth={1}
        />
        <TextAttachment x={x + 5} y={y + 5} />
      </Group>
    );
  }
}

export default Object;
