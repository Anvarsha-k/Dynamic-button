import { useContext, useState, useEffect, useRef } from 'react';
import { WorkflowContext } from '../App';
import './OutputPage.css';

function OutputPage() {
  const { workflow } = useContext(WorkflowContext);
  const [content, setContent] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [size, setSize] = useState(1);
  const [color, setColor] = useState('#3498db');
  const buttonRef = useRef(null);

  useEffect(() => {
  
    resetState();
  }, [workflow]);

  const resetState = () => {
    setContent([]);
    setIsDisabled(false);
    setSize(1);
    setColor('#3498db');
  };

  const handleClick = async () => {
    if (!workflow || !workflow.actions?.length) {
      alert('No actions found!');
      return;
    }
    for (let action of workflow.actions) {
      await performAction(action);
    }
  };

  const performAction = async (action) => {
    switch (action.type) {
      case 'alert':
        alert(action.param || 'Alert triggered!');
        break;

      case 'showText':
        updateContent('text', action.param || 'No text provided');
        break;

      case 'showImage':
        if (action.param) updateContent('image', action.param);
        break;

      case 'refreshPage':
        window.location.reload();
        break;

      case 'setLocalStorage':
        handleLocalStorage(action.param, true);
        break;

      case 'getLocalStorage':
        handleLocalStorage(action.param, false);
        break;

      case 'increaseButtonSize':
        setSize(prev => prev + 0.2);
        break;

      case 'closeWindow':
        window.close();
        break;

      case 'promptAndShow':
        const input = prompt(action.param || 'Enter some text:');
        if (input !== null) updateContent('text', input);
        break;

      case 'changeButtonColor':
        setColor(action.param || generateRandomColor());
        break;

      case 'disableButton':
        setIsDisabled(true);
        break;

      default:
        console.warn('Unknown action:', action.type);
    }
    await delay(300);
  };

  const updateContent = (type, data) => {
    setContent(prev => [...prev, { id: Date.now(), type, data }]);
  };

  const handleLocalStorage = (param, isSet) => {
    if (param && param.includes(':') && isSet) {
      const [key, value] = param.split(':').map(i => i.trim());
      localStorage.setItem(key, value);
      updateContent('text', `Saved: ${key} = ${value}`);
    } else if (!isSet && param) {
      const value = localStorage.getItem(param.trim()) || 'Not found';
      updateContent('text', `${param}: ${value}`);
    }
  };

  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="output-page">
      <div className="button-section">
        <button
          ref={buttonRef}
          onClick={handleClick}
          disabled={isDisabled}
          style={{
            transform: `scale(${size})`,
            backgroundColor: color
          }}
          className="dynamic-btn"
        >
          {workflow?.buttonLabel || 'Click Me'}
        </button>
      </div>

      <div className="output-section">
        {content.map(item => (
          <div key={item.id} className="output-item">
            {item.type === 'text' && <p>{item.data}</p>}
            {item.type === 'image' && <img src={item.data} alt="Displayed" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OutputPage;
