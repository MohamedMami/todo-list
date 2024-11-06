import "./style.css"
import 'regenerator-runtime/runtime'
import { useState } from "react"
import SpeechRecognition,{useSpeechRecognition} from "react-speech-recognition"


const app =()=> {
  // usestate to add a state to a functional component 
  const [tasks, setTasks] = useState([]); // first value is the current state , second is a function to update the state
  const [newTask, setNewTask] = useState('');
  const [editId, setEditId] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const {transcript, listening,resetTranscript} = useSpeechRecognition();

  const handleStartRec = () =>{
    SpeechRecognition.startListening({continuous:false})
  }
  const handleStopRec = () =>{
    SpeechRecognition.stopListening();
    console.log(transcript)
    if (transcript !== "") {
      setTasks([...tasks, { id: Date.now(), text: transcript, completed: false }]);
      resetTranscript(); // clear the input bar 
    }
  }

  const HandleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask(''); // clear the input bar 
    }
  };
  const HandleDelete = (taskID) =>{
    const updatedTasks = tasks.filter(task => task.id !== taskID)
    setTasks(updatedTasks)
  }
  const HandleEdit = (task)=>{
    setEditId(task.id)
    setEditedTask(task.text)
  }
  const HandleToggle = (taskID) =>{
    // we map through tasks until we match the task.id , then change the completed state 
    // using the ternary operator (?)
    const updatedTasks = tasks.map(task => task.id === taskID ? {...task, completed : !task.completed} : task);
    setTasks(updatedTasks);
  }
  const HandleUpdate = () =>{
    const updatedTasks = tasks.map(task => task.id === editId ? {...task, text : editedTask} : task);
    setTasks(updatedTasks);
    setEditId(null)
    setEditedTask()
  } 


  return (
    <div className="app">
      <h1>TODO APP</h1>
      <div className="input-container">
        <input type="text" 
        value={newTask} 
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="add new task" />
        <button onClick={HandleAddTask}>add tasks</button>
        
        <button onMouseDown={handleStartRec} onMouseUp={handleStopRec}>{listening ? 'Recording...' : 'Hold to Record'}</button>
      </div>

      <ul className="display-container">
        {tasks.map((task)=>(
          //mapping through the array tasks 
          // check if the task is complited or not 
          // the Ternary Operator (?) replaces the if-else statement  
          <li key={task.id} style={{textDecoration : task.completed ? "line-through" : "none"}}> 
            <input type="checkbox"
            checked = {task.completed}
            onChange={()=> HandleToggle(task.id)} />
            { task.id === editId ? (
              <>
              <input type="text"
              value = {editedTask}
              onChange={(e)=> setEditedTask(e.target.value)}/>
              <button onClick={HandleUpdate}>update</button>
              </>
            ):(
              <>
              {task.text}  
              <button onClick={()=>{HandleEdit(task)}}>Edit</button>
              <button onClick={()=>{HandleDelete(task.id)}}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>


    </div>


  )
}
export default app;