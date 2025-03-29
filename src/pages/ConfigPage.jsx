import { useContext, useState } from 'react';
import { WorkflowContext } from '../App';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './ConfigPage.css';

const actionList = [
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
  const [label, setLabel] = useState(workflow.buttonLabel || '');
  const [taskList, setTaskList] = useState(workflow.actions || []);
  const [selectedAction, setSelectedAction] = useState('');
  const [paramInput, setParamInput] = useState('');
  const [saveNotice, setSaveNotice] = useState('');

  const handleSave = () => {
    saveWorkflow({ buttonLabel: label, actions: taskList });
    setSaveNotice('Workflow saved!');
    setTimeout(() => setSaveNotice(''), 2000);
  };

  const addAction = () => {
    if (!selectedAction) return;
    const action = actionList.find(item => item.id === selectedAction);
    if (!action) return;

    const newTask = {
      id: `${selectedAction}-${Date.now()}`,
      type: selectedAction,
      label: action.label,
      param: action.hasParam ? paramInput : null
    };

    setTaskList(prev => [...prev, newTask]);
    setSelectedAction('');
    setParamInput('');
  };

  const removeTask = (index) => {
    setTaskList(prev => prev.filter((_, i) => i !== index));
  };

  const handleReorder = (result) => {
    if (!result.destination) return;
    const reorderedList = Array.from(taskList);
    const [movedItem] = reorderedList.splice(result.source.index, 1);
    reorderedList.splice(result.destination.index, 0, movedItem);
    setTaskList(reorderedList);
  };

  return (
    <div className="config-page">
      <h2>Button Setup</h2>

      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Button label"
      />

      <div className="action-adder">
        <select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)}>
          <option value="">Select an action</option>
          {actionList.map(action => (
            <option key={action.id} value={action.id}>{action.label}</option>
          ))}
        </select>

        {selectedAction && actionList.find(a => a.id === selectedAction)?.hasParam && (
          <input
            type="text"
            value={paramInput}
            onChange={(e) => setParamInput(e.target.value)}
            placeholder={actionList.find(a => a.id === selectedAction)?.paramName}
          />
        )}

        <button onClick={addAction}>Add</button>
      </div>

      <DragDropContext onDragEnd={handleReorder}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps}>
              {taskList.map((task, i) => (
                <Draggable key={task.id} draggableId={task.id} index={i}>
                  {(provided) => (
                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <span>{i + 1}. {task.label} {task.param && `"${task.param}"`}</span>
                      <button onClick={() => removeTask(i)}>X</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <button onClick={handleSave} disabled={!label || taskList.length === 0}>Save</button>
      {saveNotice && <p>{saveNotice}</p>}
    </div>
  );
}

export default ConfigPage;
