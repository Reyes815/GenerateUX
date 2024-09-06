const sortSequenceFlows = async (sequenceFlows, startEventId) => {
    // Find the flow that starts with the startEventId
    let sortedFlows = [];
    let flowMap = new Map();
  
    // Create a map for easy lookup of flows by sourceRef
    sequenceFlows.forEach(flow => {
      const sourceRef = flow.sourceRef;
      if (!flowMap.has(sourceRef)) {
        flowMap.set(sourceRef, []);
      }
      flowMap.get(sourceRef).push(flow);
    });

    console.log('sorted: ', flowMap);
  
    // // Start from the event id (start event) and traverse the flows
    // let queue = flowMap.get(startEventId) || [];
  
    // while (queue.length > 0) {
    //   let currentFlow = queue.shift();
    //   sortedFlows.push(currentFlow);
  
    //   // Get the next flows whose sourceRef matches the current flow's targetRef
    //   let nextFlows = flowMap.get(currentFlow.targetRef);
    //   if (nextFlows) {
    //     queue.push(...nextFlows);
    //   }
    // }
  
    return sortedFlows;
};

export default sortSequenceFlows;