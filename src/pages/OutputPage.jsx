import { useContext, useState, useEffect, useRef } from 'react';
import { WorkflowContext } from '../App';
import './OutputPage.css';

function OutputPage() {
  const { workflow } = useContext(WorkflowContext);
  const [displayContent, setDisplayContent] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [buttonSize, setButtonSize] = useState(1);
  const [buttonColor, setButtonColor] = useState('#3498db');
  const buttonRef = useRef(null);

  useEffect(() => {
    // Reset state when workflow changes
    setDisplayContent([]);
    setIsButtonDisabled(false);
    setButtonSize(1);
    setButtonColor('#3498db');
  }, [workflow]);

  const executeWorkflow = async () => {
    if (!workflow || !workflow.actions || workflow.actions.length === 0) {
      alert('No workflow configured!');
      return;
    }

    // Execute each action in sequence
    for (const action of workflow.actions) {
      await executeAction(action);
    }
  };

  const executeAction = async (action) => {
    switch (action.type) {
      case 'alert':
        alert(action.param || 'Alert!');
        break;
        
      case 'showText':
        setDisplayContent(prev => [...prev, { 
          type: 'text', 
          content: action.param || 'No text provided',
          id: Date.now()
        }]);
        break;
        
      case 'showImage':
        if (action.param) {
          setDisplayContent(prev => [...prev, { 
            type: 'image', 
            content: action.param,
            id: Date.now()
          }]);
        }
        break;
        
      case 'refreshPage':
        window.location.reload();
        break;
        
      case 'setLocalStorage':
        if (action.param && action.param.includes(':')) {
          const [key, value] = action.param.split(':');
          localStorage.setItem(key.trim(), value.trim());
          setDisplayContent(prev => [...prev, { 
            type: 'text', 
            content: `Saved to localStorage: ${key.trim()} = ${value.trim()}`,
            id: Date.now()
          }]);
        }
        break;
        
      case 'getLocalStorage':
        if (action.param) {
          const value = localStorage.getItem(action.param.trim());
          setDisplayContent(prev => [...prev, { 
            type: 'text', 
            content: `${action.param}: ${value || 'Not found'}`,
            id: Date.now()
          }]);
        }
        break;
        
      case 'increaseButtonSize':
        setButtonSize(prev => prev + 0.2);
        break;
        
      case 'closeWindow':
        window.close();
        break;
        
      case 'promptAndShow':
        const userInput = prompt(action.param || 'Enter your input:');
        if (userInput !== null) {
          setDisplayContent(prev => [...prev, { 
            type: 'text', 
            content: userInput,
            id: Date.now()
          }]);
        }
        break;
        
      case 'changeButtonColor':
        if (action.param) {
          setButtonColor(action.param);
        } else {
          // Random color if no param
          const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
          setButtonColor(randomColor);
        }
        break;
        
      case 'disableButton':
        setIsButtonDisabled(true);
        break;
        
      default:
        console.log('Unknown action type:', action.type);
    }

    // Small delay between actions for visual effect
    return new Promise(resolve => setTimeout(resolve, 300));
  };

  return (
    <div className="output-page">
      <div className="button-container">
        <button
          ref={buttonRef}
          onClick={executeWorkflow}
          disabled={isButtonDisabled}
          style={{ 
            transform: `scale(${buttonSize})`,
            backgroundColor: buttonColor
          }}
          className="dynamic-button"
        >
          {workflow.buttonLabel || 'Button'}
        </button>
      </div>
      
      <div className="output-container">
        {displayContent.map((item) => (
          <div key={item.id} className="output-item">
            {item.type === 'text' ? (
              <p>{item.content}</p>
            ) : item.type === 'image' ? (
              <img src={item.content} alt="Dynamic content" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OutputPage;