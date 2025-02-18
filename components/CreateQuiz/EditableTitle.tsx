"use client";

import { useState, useRef } from "react";

export default function EditableTitle({ initialText = "Add Title", onTextChange }) {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const handleBlur = () => {
    setIsEditing(false);
    onTextChange?.(text); // Trigger onTextChange on blur
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onTextChange?.(text); // Trigger onTextChange when Enter is pressed
    }
  };

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    // Optionally trigger onTextChange on every change
    // onTextChange?.(newText);
  };

  return (
    <div className="p-2 flex-1 rounded-lg cursor-pointer">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur} // Trigger onBlur event when focus changes
          placeholder="Enter Title Here"
          onKeyDown={handleKeyDown} // Trigger onKeyDown for Enter key
          autoFocus
          className="border-none w-full outline-none text-black"
        />
      ) : (
        <span className="text-gray-500" onClick={() => setIsEditing(true)}>{text}</span>
      )}
    </div>
  );
}
