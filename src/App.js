import React, { useState } from "react";
import styled from "styled-components";
import dataset from "./dataset";
import Column from "./Column";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  display: flex;
`;

const App = () => {
  const [data, setData] = useState(dataset);
  const [newCard, setNewCard] = useState(false);
  const [title, setTitle] = useState("");

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    //If there is no destination
    if (!destination) {
      return;
    }

    //If source and destination is the same
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    //If you're dragging columns
    if (type === "column") {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      const newState = {
        ...data,
        columnOrder: newColumnOrder,
      };
      setData(newState);
      return;
    }

    //Anything below this happens if you're dragging tasks
    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    //If dropped inside the same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };
      setData(newState);
      return;
    }

    //If dropped in a different column
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newState);
  };

  const addGroup = () => {
    const dataObj = { ...data };
    dataObj.columnOrder.push(`column-${dataObj.columnOrder.length + 1}`);
    const newObj = {
      id: `column-${dataObj.columnOrder.length}`,
      title: title,
      taskIds: [],
    };
    const finalObj = {
      ...dataObj.columns,
      [`column-${dataObj.columnOrder.length}`]: newObj,
    };
    dataObj.columns = finalObj;
    setData(dataObj);
    setTitle("");
    setNewCard(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <Container
            style={{ flexWrap: "wrap" }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {data.columnOrder.map((id, index) => {
              const column = data.columns[id];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  index={index}
                  data={data}
                  setData={setData}
                />
              );
            })}
            {provided.placeholder}
            <div style={{ flexDirection: "column", flex: 1, display: "flex" }}>
              <button
                onClick={() => setNewCard(!newCard)}
                style={{ height: 30, marginTop: 18 }}
              >
                Add a Group
              </button>
              {newCard && (
                <>
                  <input
                    placeholder="title"
                    style={{ height: 25, marginTop: 18 }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <button
                    onClick={addGroup}
                    style={{ height: 30, marginTop: 18 }}
                  >
                    Create Card
                  </button>
                </>
              )}
            </div>
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default App;
