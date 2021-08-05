import React, { useState } from "react";
import styled from "styled-components";
import Task from "./Task";
import { Droppable, Draggable } from "react-beautiful-dnd";
const Container = styled.div`
  margin: 1rem;
  border: 1px solid lightgrey;
  border-radius: 5px;
  width: 250px;
  display: flex;
  flex-direction: column;
  background-color: white;
`;
const Title = styled.h3`
  padding: 0 1rem;
  margin: 1rem 0;
`;
const TaskList = styled.div`
  padding: 1rem;
  background-color: ${(props) =>
    props.isDraggingOver ? "#d5f3ff" : "inherit"};
  min-height: 100px;
`;

function Column(props) {
  const [show, setShow] = useState(false);
  const [task, setTask] = useState("");

  const addTask = () => {
    const dataObj = { ...props.data };
    const newTaskId = `task-${Object.keys(dataObj.tasks).length + 1}`;

    const newObj = {
      id: newTaskId,
      content: task,
    };
    const finalObj = {
      ...dataObj.tasks,
      [newTaskId]: newObj,
    };
    dataObj.tasks = finalObj;
    dataObj.columns["column-1"].taskIds.push(newTaskId);
    props.setData(dataObj);
    setShow(false);
    setTask("");
  };

  return (
    <Draggable draggableId={props.column.id} index={props.index}>
      {(provided) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <div style={{ flexDirection: "row", display: "flex" }}>
            <Title style={{ flex: 1 }} {...provided.dragHandleProps}>
              {props.column.title}
            </Title>
            {props.column.title === "Todo" && (
              <button onClick={() => setShow(!show)} style={{ margin: 22 }}>
                Add
              </button>
            )}
          </div>
          {show && props.column.title === "Todo" && (
            <>
              <input
                placeholder="task"
                style={{ height: 25, margin: 18 }}
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <button
                onClick={addTask}
                style={{ marginLeft: 18, marginRight: 18 }}
              >
                Add Task
              </button>
            </>
          )}
          <Droppable droppableId={props.column.id} type="task">
            {(provided, snapshot) => (
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {props.tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
}

export default Column;
