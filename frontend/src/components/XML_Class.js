// Define the DiagramInfo class
class DiagramInfo {
    constructor(userId, name, bpmn) {
      this.userId = userId;
      this.name = name;
      this.bpmn = bpmn;
    }
  
    logDetails() {
      console.log(`Diagram Name: ${this.name}\nUser ID: ${this.userId}\nBPMN: ${this.bpmn}`);
    }
  }
  // Export the DiagramInfo class so it can be used in other files
export default DiagramInfo;