

// pages/ConfigPage.jsx
import { useContext, useState } from 'react';
import { WorkflowContext } from '../App';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './ConfigPage.css';

const availableActions = [
  { id: 'alert', label: 'Alert', hasParam: true, paramName: 'Message' },
  { id: 'showText', label: 'Show Text', hasParam: true, paramName: 'Text to display' },
  { id: 'showImage', label: 'Show Image', hasParam: true, paramName: 'Image URL' },
  { id: 'refreshPage', label: 'Refresh Page', hasParam: false },
  { id: 'setLocalStorage', label: 'Set LocalStorage', hasParam: true, paramName: 'Key:Value (e.g. name:John)' },
  { id: 'getLocalStorage', label: 'Get LocalStorage', hasParam: true, paramName: 'Key to retrieve' },
  { id: 'increaseButtonSize', label: 'Increase Button Size', hasParam: false },
  { id: 'closeWindow', label: 'Close Window', hasParam: false },
  { id: 'promptAndShow', label: 'Prompt and Show', hasParam: true, paramName: 'Prompt message' },
  { id: 'changeButtonColor', label: 'Change Button Color', hasParam: true, paramName: 'Color (empty for random)' },
  { id: 'disableButton', label: 'Disable Button', hasParam: false }
];

function ConfigPage() {
  const { workflow, saveWorkflow } = useContext(WorkflowContext);
  const [buttonLabel, setButtonLabel] = useState(workflow.buttonLabel || '');
  const [actions, setActions] = useState(workflow.actions || []);
  const [currentAction, setCurrentAction] = useState('');
  const [actionParam, setActionParam] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = () => {
    const newWorkflow = {
      buttonLabel: buttonLabel,
      actions: actions
    };
    
    saveWorkflow(newWorkflow);
    setSavedMessage('Workflow saved!');
    setTimeout(() => setSavedMessage(''), 2000);
  };

  const addAction = () => {
    if (!currentAction) return;
    
    const selectedAction = availableActions.find(a => a.id === currentAction);
    if (!selectedAction) return;
    
    const newAction = {
      id: `${currentAction}-${Date.now()}`,
      type: currentAction,
      label: selectedAction.label,
      param: selectedAction.hasParam ? actionParam : null
    };
    
    setActions([...actions, newAction]);
    setCurrentAction('');
    setActionParam('');
  };

  const removeAction = (index) => {
    const newActions = [...actions];
    newActions.splice(index, 1);
    setActions(newActions);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(actions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setActions(items);
  };

  return (
    <div className="config-page">
      <div className="config-section">
        <h2>Button Configuration</h2>
        
        <div className="form-group">
          <label>Button Label:</label>
          <input 
            type="text" 
            value={buttonLabel} 
            onChange={(e) => setButtonLabel(e.target.value)}
            placeholder="Enter button text"
          />
        </div>
        
        <div className="form-group">
          <label>Add Action:</label>
          <div className="action-selector">
            <select 
              value={currentAction} 
              onChange={(e) => setCurrentAction(e.target.value)}
            >
              <option value="">Select an action</option>
              {availableActions.map(action => (
                <option key={action.id} value={action.id}>{action.label}</option>
              ))}
            </select>
            
            {currentAction && availableActions.find(a => a.id === currentAction)?.hasParam && (
              <input 
                type="text" 
                value={actionParam} 
                onChange={(e) => setActionParam(e.target.value)}
                placeholder={availableActions.find(a => a.id === currentAction)?.paramName}
              />
            )}
            
            <button onClick={addAction} className="add-btn">Add</button>
          </div>
        </div>
      </div>
      
      <div className="workflow-section">
        <h2>Workflow Actions</h2>
        {actions.length === 0 ? (
          <p className="no-actions">No actions added yet. Start by selecting an action above.</p>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="actions">
              {(provided) => (
                <ul 
                  className="action-list"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {actions.map((action, index) => (
                    <Draggable key={action.id} draggableId={action.id} index={index}>
                      {(provided) => (
                        <li 
                          className="action-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span className="action-grip">⋮⋮</span>
                          <div className="action-info">
                            <span className="action-name">{index + 1}. {action.label}</span>
                            {action.param && <span className="action-param">"{action.param}"</span>}
                          </div>
                          <button onClick={() => removeAction(index)} className="remove-btn">×</button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        )}
        
        <div className="save-section">
          <button 
            onClick={handleSave} 
            className="save-btn"
            disabled={!buttonLabel || actions.length === 0}
          >
            Save Workflow
          </button>
          {savedMessage && <span className="save-message">{savedMessage}</span>}
        </div>
      </div>
      
      <div className="preview-section">
        <h2>Preview</h2>
        <div className="preview-container">
          <button className="preview-button">
            {buttonLabel || 'Button Label'}
          </button>
          <div className="action-sequence">
            {actions.map((action, index) => (
              <div key={index} className="preview-action">
                {index + 1}. {action.label} {action.param ? `→ "${action.param}"` : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigPage;