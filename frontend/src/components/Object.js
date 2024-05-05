import React from "react";
import { Shape, Group, Line } from "react-konva";
import Shapes from "./Shapes";

class Object extends Shapes {
  constructor(props) {
    super(props);
    this.shapeRef = React.createRef();
    this.handleRef = React.createRef();
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
    // Cleanup on unmount
    return () => {
      handleNode.off("dragmove", onMouseMoveResize);
    };
  }

  render() {
    const { x, y, fill, handleDrop } = this.props;

    return (
      <Group draggable onDragEnd={(e) => handleDrop(e, "object")}>
        {/* Resize handle at bottom right corner */}
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
            const cornerRadius = 0; // Adjust this value to change the roundness of corners

            context.beginPath();
            context.moveTo(cornerRadius, 0); // Top-left corner
            context.arcTo(
              width,
              0,
              width,
              cornerRadius,
              cornerRadius
            ); // Top-right corner
            context.arcTo(
              width,
              height,
              width - cornerRadius,
              height,
              cornerRadius
            ); // Bottom-right corner
            context.arcTo(
              0,
              height,
              0,
              height - cornerRadius,
              cornerRadius
            ); // Bottom-left corner
            context.arcTo(0, 0, cornerRadius, 0, cornerRadius); // Back to Top-left corner
            context.closePath();

            // (!) Konva specific method, it is very important
            context.fillStrokeShape(shape);
          }}
          fill={fill}
          stroke="black" // Add stroke color here
          strokeWidth={1} // Add stroke width here
        />
      </Group>
    );
  }
}

export default Object;
