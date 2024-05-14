import React from 'react';
import { Circle, Group } from 'react-konva';
import Shapes from './Shapes';

class CircleShape extends Shapes {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      isDraggable: true,
      line: false,
      isSelected: false,
      isHoveredsmall: false,
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

  componentDidUpdate(prevProps) {
    if (prevProps.selectedShape !== this.props.selectedShape) {
      if (this.props.selectedShape === null) {
        // Handle the case when selectedShape is set to null
        this.setState({ isSelected: false });
      } else {
        // Handle other cases if needed
      }
    }
  }

  handleonClick = (e) => {
    if (this.props.id > 0) {
      // const circle = {id: this.props.id, x: this.props.x, y: this.props.y, fill: this.props.fill};
      this.props.setSelectedShape({id: this.props.id, x: this.props.x, y: this.props.y, fill: this.props.fill})
      // console.log(this.props.selectedShape, this.props.id);

      // Schedule the toggle action after ensuring the state is updated
      setTimeout(() => {
        if (this.props.selectedShape && this.props.selectedShape.id === this.props.id) {
          this.setState((prevState) => ({ isSelected: !prevState.isSelected }));
        }
      }, 0);

      // if(this.props.selectedShape != null){
        // if(this.props.selectedShape.id == this.props.id){
        //   this.setState(prevState => ({ isSelected: !prevState.isSelected }), () => {
        //     // console.log(this.state.isSelected ? "HELLO" : "hello");
        //   });
        // }
      // }
      
      
      // this.props.setisSelected(prevState => ({ isSelected: !prevState.isSelected }), () => {
      //   console.log(this.state.isSelected ? "HELLO sdfsdf" : "hello");
      // });
      // console.log(this.props.isSelected);
    } else {
      this.props.setSelectedShape({id: this.props.id, x: this.props.x, y: this.props.y, fill: this.props.fill})
      this.props.circleOnclick(e)
    }
    // console.log("gggg");
  };

  makeline = (e) => {
    this.setState({ isDraggable: false }); // Disable draggable property
    this.props.setline4shape(true);
    this.setState({ line: true });
    console.log("hello" + this.props.id)
  }

  na_makeline = (e) => {
    this.setState({ isDraggable: true }); // Disable draggable property
    // this.props.setline4shape(false);
    this.setState({ line: false });
    // console.log(this.props.selectedShape.toString() + "sfsdfsdf");
  }

  handleMouseEnter = (e) => {
    this.setState({ isHovered: true });
    if(this.props.startPoint){
      this.props.setSelectedShape(this.props)
    }
    // this.props.setSelectedShape(this.props)
    // console.log(e.target.getClientRect(), "sdfsdfsdfs");

  };

  smallcircleMouseEnter = (e) => {
    this.setState({ isHovered: true });
  }

  handleMouseLeave = () => {
    if(this.state.line){
      this.setState({ isHovered: false });
    }
    // this.props.setSelectedShape(null);
    this.setState({ isHovered: false });
  };
  
  render() {
    const { id, x, y, handleDrop, setSelectedShape, circleOnclick, setisSelected } = this.props;
    const { isHovered, isDraggable, isSelected } = this.state;

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
        onMouseUp={this.na_makeline}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        fill='red'
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
        {isHovered && isSelected && (
         <Circle
          x={100 / 2} // Center of the inner circle
          y={100 / 2} // Center of the inner circle
          radius={5} // Adjust the radius as needed for the dot size
          fill='black' // Color of the dot
          onMouseEnter={this.makeline}
          onMouseLeave={this.na_makeline}
        /> 
       )}
      </Group>
    );
  }
}

export default CircleShape;
