

const translateToPlantUML = async (data) => {
    // if (!data || !data.startEventId || !data.endEventId) {
    //   return '@startuml\nNo start or end event found\n@enduml';
    // }
    // Start with basic PlantUML BPMN syntax
    let plantUML = '@startuml\n';

    // Add sequence flows between activities
    let decision_count = 0;
    data.sequenceFlows.forEach(flow => {
    const sourceStart = data.startEventId;
    const targetEnd = data.endEvents.find(end => end.id === flow.targetRef);
    const sourceActivity = data.activities.find(activity => activity.id === flow.sourceRef);
    const targetActivity = data.activities.find(activity => activity.id === flow.targetRef);
    const sourceGateway = data.gateways.find(g => g.id === flow.sourceRef);
    const targetGateway = data.gateways.find(g => g.id === flow.targetRef);


    if(targetGateway && sourceStart === flow.sourceRef){
        plantUML += `(*) --> if "${targetGateway.name}" then\n`
    }

    if(targetActivity && sourceStart === flow.sourceRef){
        plantUML += `(*) --> "${targetActivity.name}"\n`
    }

    if (sourceActivity && targetActivity) {
        plantUML += `"${sourceActivity.name}" --> "${targetActivity.name}"\n`;
    }

    if(sourceActivity && targetGateway) {
        plantUML += `"${sourceActivity.name}" --> if "${targetGateway.name}" then\n`
    }

    if(sourceActivity && targetEnd) {
        plantUML += `"${sourceActivity.name}" --> (*)\n`;
    }

    if(sourceGateway) {
        plantUML += `-->[${flow.name}] "${targetActivity.name}"\n`;
        decision_count++;
        if(decision_count == 1){
            plantUML += `else\n`;
        }
    }
    });
    // End the diagram
    plantUML += '@enduml';
    return plantUML;
};

export default translateToPlantUML;