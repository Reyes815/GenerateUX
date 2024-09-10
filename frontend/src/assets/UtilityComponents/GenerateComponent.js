import DiagramInfo from '../../components/XML_Class'; 
import parseXML from './ParseXMLComponent'; 
import translateToPlantUML from './TranslateUMLComponent';

const GenerateComponent = async (modeler, user_id, setgenerateInfo) => {
    try {
        const { xml } = await modeler.current.saveXML({ format: true });
        const data = parseXML(xml);
        const plantUML = translateToPlantUML(data);

        const generateInfo = new DiagramInfo(user_id, "", "", plantUML);
        setgenerateInfo(generateInfo);
        
        console.log(generateInfo);
        console.log(plantUML);
        console.log("GenerateButton");
    } catch (err) {
    console.log("error", err);
    }
};

export default GenerateComponent;
