import React from 'react';
import { Circle, Group } from 'react-konva';
import Shapes from './Shapes';

class CircleShape extends Shapes {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      isDraggable: true,
      line: false
    };
  }

  handleDragEnd = (e) => {
    const newX = e.target.x();
    const newY = e.target.y();

    if (this.props.id > 0) {
      this.props.handleDrop(newX, newY, this.props.id);
    } else {
      this.props.handleDrop(e, "circle");
    }
  };

  handleDragMove = (e) => {
    const newX = e.target.x();
    const newY = e.target.y();

    if (this.props.id > 0) {
      this.props.handleDrop(newX, newY, this.props.id);
    } else {
      // Do something else for the first instance
    }
  };

  handleonClick = (e) => {
    if (this.props.id > 0) {
      this.props.setSelectedShape(this.props)
    } else {
      this.props.setSelectedShape(this.props)
      this.props.circleOnclick(e)
    }
  };

  makeline = (e) => {
    this.setState({ isDraggable: false }); // Disable draggable property
    this.props.setline4shape(true);
    this.setState({ line: true });
    console.log("hello")
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
    this.props.setSelectedShape(this.props)
  };

  handleMouseLeave = () => {
    if(this.state.line){
      this.setState({ isHovered: false });
    }
    this.props.setSelectedShape(null)
  };
  
  render() {
    const { id, x, y, handleDrop, isSelected, setSelectedShape, circleOnclick } = this.props;
    const { isHovered, isDraggable } = this.state;

    return (
      <Group
        x={x}
        y={y}
        draggable={isDraggable}
        stroke={isSelected ? 'red' : 'black'} // Example: Change stroke color if selected
        strokeWidth={1}
        onDragEnd={this.handleDragEnd}
        onDragMove={this.handleDragMove}
        onClick={this.handleonClick} // Set selected shape on mouse down
        onMouseUp={this.handleMouseUp}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
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
          stroke={isSelected ? 'red' : 'black'}
          strokeWidth={1}
        />

        {/* Dot in the middle of the inner circle */}
        {isHovered && (
        <Circle
          x={100 / 2} // Center of the inner circle
          y={100 / 2} // Center of the inner circle
          radius={5} // Adjust the radius as needed for the dot size
          fill='black' // Color of the dot
          onMouseDown={this.makeline}
        />
      )}
      </Group>
    );
  }
}

export default CircleShape;
