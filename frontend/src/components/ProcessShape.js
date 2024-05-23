import React from "react";
import { Shape, Group, Line, Rect, Transformer, Arrow } from "react-konva";
import Shapes from "./Shapes";
import TextAttachment from "./TextAttachment";

class ProcessShape extends Shapes {
  constructor(props) {
    super(props);
    this.shapeRef = React.createRef();
    // this.handleRef = React.createRef();
    this.transformerRef = React.createRef();
    this.textAttachmentRef = React.createRef();
    this.state = {
      textX: props.x + 5,
      textY: props.y + 5,
      isSelected: false,
      isHovered: false,
      isDraggable: true,
      line: false,
      isHoveredsmall: false,
    };
  }

  // componentDidMount() {
  //   const shapeNode = this.shapeRef.current;
  //   const handleNode = this.handleRef.current;

  //   const onMouseMoveResize = (event) => {
  //     const dx = event.evt.movementX;
  //     const dy = event.evt.movementY;
  //     shapeNode.width(shapeNode.width() + dx);
  //     shapeNode.height(shapeNode.height() + dy);
  //   };

  //   handleNode.on("dragmove", onMouseMoveResize);
  //   // Cleanup on unmount
  //   return () => {
  //     handleNode.off("dragmove", onMouseMoveResize);
  //   };
  // }

  componentDidMount() {
    this.attachTransformer();
}

componentDidUpdate() {
    this.attachTransformer();
}

attachTransformer() {
  const transformer = this.transformerRef.current;
  const shapeNode = this.shapeRef.current;

  if (transformer && shapeNode) {
    transformer.nodes([shapeNode]);
    transformer.getLayer().batchDraw();
  }
}


handleDragMove = (e) => {
  const node = this.shapeRef.current;
  if (node) {
    this.setState({
      textX: node.x() + 5,
      textY: node.y() + 5,
    });

    const textAttachment = this.textAttachmentRef.current;
    if (textAttachment && textAttachment.position) { // Check if position method exists
      textAttachment.position({ x: node.x() + 5, y: node.y() + 5 });
    }
  }

  if(this.props.id != 0){
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    this.props.onTransformEnd({
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });
  }
};

handleDragEnd = (e) => {
  const node = this.shapeRef.current;
  if(this.props.id == 0){
    this.props.handleDrop(e, "process")
    this.setState({
      textX: node.x() + 5,
      textY: node.y() + 5,
    });
  } else {
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    this.props.onTransformEnd({
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });
  }
}

handleTransformEnd = (e) => {
  const node = this.shapeRef.current;
  if (node) {
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    this.props.onTransformEnd({
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });

    this.setState({
      textX: node.x() + 5,
      textY: node.y() + 5,
    });

    const textAttachment = this.textAttachmentRef.current;
    if (textAttachment && textAttachment.position) { // Check if position method exists
      textAttachment.position({ x: node.x() + 5, y: node.y() + 5 });
    }
  }
};

handleOnClick = (e) => {
  if (this.props.id > 0) {
    // const circle = {id: this.props.id, x: this.props.x, y: this.props.y, fill: this.props.fill};
    this.props.setSelectedShape({id: this.props.id, x: this.props.x, y: this.props.y, fill: this.props.fill, type: 'process'})
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
    this.props.setSelectedShape({id: this.props.id, x: this.props.x, y: this.props.y, fill: this.props.fill, type: 'process'})
    this.props.circleOnclick(e)
  }
  // console.log("gggg");
};

handleMouseEnter = (e) => {
  this.setState({ isHovered: true });
  if(this.props.startPoint){
    this.props.setSelectedShape({id: this.props.id, x: this.props.x, y: this.props.y, fill: this.props.fill, type: 'process'})
  }
  // this.props.setSelectedShape(this.props)
  // console.log(e.target.getClientRect(), "sdfsdfsdfs");

};

handleMouseLeave = () => {
  if(this.state.line){
    this.setState({ isHovered: false });
  }
  // this.props.setSelectedShape(null);
  this.setState({ isHovered: false });
};

makeline = (e) => {
  this.setState({ isDraggable: false }); // Disable draggable property
  this.props.setline4shape(true);
  this.setState({ line: true });
  // console.log("hello" + this.props.id)
}

na_makeline = (e) => {
  this.setState({ isDraggable: true }); // Disable draggable property
  this.props.setline4shape(false);
  this.setState({ line: false });
  // console.log(this.props.selectedShape.toString() + "sfsdfsdf");
}

render() {
  const { x, y, width, height, fill, handleDrop, stroke } = this.props;
  const { textX, textY, isSelected } = this.state;

  return (
    <Group>
      <Rect
        ref={this.shapeRef}
        x={x}
        y={y}
        onDragEnd={this.handleDragEnd}
        onDragMove={this.handleDragMove}
        onClick={this.handleOnClick}
        onMouseEnter={this.handleMouseEnter}
        width={width}
        height={height}
        cornerRadius={10}
        fill={fill}
        stroke={stroke}
        draggable={true}
        onTransformEnd={(e) => {
          const node = this.shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          this.props.onTransformEnd({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY)
          });
        }}
      />
      {isSelected && ( // Conditionally render Transformer if isSelected is true
      <>
        <Transformer
          ref={this.transformerRef}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(5, newBox.width);
            newBox.height = Math.max(5, newBox.height);
            return newBox;
          }}
        />
        
        <Arrow
              points={[x + width / 2, y + height + 5, x + width / 2, y + height + 15]}
              pointerLength={10}
              pointerWidth={10}
              fill="black"
              stroke="black"
              onMouseEnter={this.makeline}
              onMouseLeave={this.na_makeline}
              // onClick={() => console.log("ddddd")}
            />
            </>
       )} 
      <TextAttachment
        ref={this.textAttachmentRef}
        x={textX}
        y={textY}
      />
    </Group>
  );
}
}

export default ProcessShape;
