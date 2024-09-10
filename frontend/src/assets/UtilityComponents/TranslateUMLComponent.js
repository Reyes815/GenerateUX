import data from './ParseXMLComponent';

const translateToPlantUML = (data) => {
    // if (!data || !data.startEventId || !data.endEventId) {
    //   return '@startuml\nNo start or end event found\n@enduml';
    // }
  
    let plantUML = '@startuml\n';
    let done = true;
    let gatewayStack = []; // Stack to track active gateways
    let gatewayBranches = [];

    data.sequenceFlows.forEach((flow) => {
        // let currentFlow = queue.shift();
        const sourceGateway = data.gateways.find(g => g.id === flow.sourceRef);
        const sourceActivity = data.activities.find(activity => activity.id === flow.sourceRef);
        const targetActivity = data.activities.find(activity => activity.id === flow.targetRef);
        const targetGateway = data.gateways.find(g => g.id === flow.targetRef);
        const targetEnd = data.endEvents.find(end => end.id === flow.targetRef);

        // console.log('source: ', sourceGateway);
        // console.log('decision stack: ', gatewayStack[gatewayStack.length - 1]);

        // Process start event
        if (flow.sourceRef === data.startEventId) {
          if (targetGateway) {
            plantUML += `(*) --> if "${targetGateway.name}" then\n`;
            // gatewayStack.push(targetGateway.id); // Push gateway onto the stack
          } else if (targetActivity) {
            plantUML += `(*) --> "${targetActivity.name}"\n`;
          }
        }
    
        // Process activity-to-activity transitions
        if (sourceActivity && targetActivity) {
          plantUML += `"${sourceActivity.name}" --> "${targetActivity.name}"\n`;
        }
    
        // Process activity to gateway
        if (sourceActivity && targetGateway) {
          plantUML += `"${sourceActivity.name}" --> if "${targetGateway.name}" then\n`;
          // gatewayStack.push(targetGateway.id); // Push gateway onto the stack
        }

        // Process activity to end event
        if (sourceActivity && targetEnd) {
          plantUML += `"${sourceActivity.name}" --> (*)\n`;
          // if(!done) {
          //   plantUML += "endif\n";
          //   done = true;
          // }
        }

        if (flow.isGatewayEnd) {
          // if(gatewayBranches.length == 0) {
          //   gatewayBranches.push(flow.isEndOfBranch);
          //   console.log(gatewayBranches)
          // } else {
          //   gatewayBranches.pop();
            plantUML += "endif\n";
          //   console.log(gatewayBranches)
          // }
        }
    
        // Process gateway decisions
        if (sourceGateway) {

          console.log('current: ', sourceGateway.id);

          // Check for else condition before adding the current gateway to the stack
           if (sourceGateway.id === gatewayStack[gatewayStack.length - 1]) {
            // console.log(gatewayStack);
            plantUML += 'else\n';
            gatewayStack.pop(); // Pop the gateway after processing else
            console.log('pop: ', gatewayStack);

            if(targetGateway) {
              plantUML += `-->[${flow.name || 'true'}] if "${targetGateway.name}" then\n`;
              // gatewayStack.push(targetGateway.id); // Push gateway onto the stack
            } else {
              plantUML += `-->[${flow.name || 'true'}] "${targetActivity ? targetActivity.name : targetGateway.name}"\n`;
            }

            // if(gatewayStack.length > 0 || gatewayStack.length == 0) {
            //   done = false;
            // }

          } else {
            if(targetGateway) {
              plantUML += `-->[${flow.name || 'true'}] if "${targetGateway.name}" then\n`;
              // gatewayStack.push(targetGateway.id); // Push gateway onto the stack
            } else {
              plantUML += `-->[${flow.name || 'true'}] "${targetActivity ? targetActivity.name : targetGateway.name}"\n`;
            }
  
            // if(!gatewayStack.includes(sourceGateway.id)){
              gatewayStack.push(sourceGateway.id);
              console.log('pushed: ', gatewayStack);
  
            // }
  
            // console.log('gatewaystack: ', gatewayStack[gatewayStack.length - 1], ' ', 'source: ', sourceGateway.id); 
          }
        }

    });

    console.log('decision stack: ', gatewayStack);
  
    // End the diagram
    plantUML += '@enduml';
  
    return plantUML;
  };

export default translateToPlantUML;