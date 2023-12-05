import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { renderers } from "./Actions";

function getRenderer(type) {
  if (type === "spacer") {
    const SpacerComponent = () => {
      return <div className="spacer"></div>;
    };
    SpacerComponent.displayName = 'SpacerComponent';
    return SpacerComponent;
  }

  const RendererComponent = renderers[type] || (() => <div>No renderer found for {type}</div>);
  RendererComponent.displayName = 'RendererComponent';
  return RendererComponent;
}

export function Field(props) {
  const { field, overlay, ...rest } = props;
  const { type } = field;

  const Component = getRenderer(type);

  let className = "canvas-field";
  if (overlay) {
    className += " overlay";
  }

  return (
    <div className={className}>
      <Component {...rest} />
    </div>
  );
}

function SortableField(props) {
  const { id, index, field } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id,
    data: {
      index,
      id,
      field
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Field field={field} />
    </div>
  );
}

export default function Canvas(props) {
  const { fields } = props;

  const {
    listeners,
    setNodeRef,
    transform,
    transition
  } = useDroppable({
    id: "canvas_droppable",
    data: {
      parent: null,
      isContainer: true
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div className="flex flex-1 flex-col">
    <h3 className="text-xl">Steps</h3>
    <div
      ref={setNodeRef}
      className="canvas"
      style={style}
      {...listeners}
    >
      <div className="canvas-fields">
        {fields?.map((f, i) => (
          <SortableField key={f.id} id={f.id} field={f} index={i} />
        ))}
      </div>
    </div>
    </div>
  );
}