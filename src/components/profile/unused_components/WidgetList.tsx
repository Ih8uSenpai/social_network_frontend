import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../styles/Widget.module.css';

interface Widget {
    id: string;
    title: string;
    content: string;
}

interface WidgetListProps {
    count: number;
    width?: string;
    height?: string;
}

const generateWidgets = (count: number): Widget[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `widget-${i + 1}`,
        title: `Widget ${i + 1}`,
        content: `Content for widget ${i + 1}`,
    }));
};

const WidgetList: React.FC<WidgetListProps> = ({ count , width, height}) => {
    const [widgets, setWidgets] = useState<Widget[]>(generateWidgets(count));


    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(widgets);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setWidgets(items);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="widgets" direction="horizontal">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={styles.widgetContainer}
                        style={{height:height, width:width}}
                    >
                        {widgets.map((widget, index) => (
                            <Draggable key={widget.id} draggableId={widget.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={styles.widgetCard}
                                    >
                                        <div className={styles.widgetTitle}>{widget.title}</div>
                                        <div className={styles.widgetContent}>{widget.content}</div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

        </DragDropContext>
    );
};

export default WidgetList;
