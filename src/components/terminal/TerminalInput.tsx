
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';

interface TerminalInputProps {
  currentInput: string;
  onInputChange: (value: string) => void;
  onSubmit: (input: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isProcessing: boolean;
  currentNode: string;
  currentDirectory: string;
}

export interface TerminalInputRef {
  focus: () => void;
}

export const TerminalInput = forwardRef<TerminalInputRef, TerminalInputProps>(({
  currentInput,
  onInputChange,
  onSubmit,
  onKeyDown,
  isProcessing,
  currentNode,
  currentDirectory
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() && !isProcessing) {
      onSubmit(currentInput.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center mt-2">
      <span className="text-matrix-cyan mr-2 text-sm flex-shrink-0">
        {currentNode}:{currentDirectory}$
      </span>
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="flex-1 bg-transparent border-none outline-none text-matrix-green font-mono text-sm min-w-0"
        disabled={isProcessing}
        autoFocus
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder={isProcessing ? "Processing..." : ""}
      />
      <span className="text-matrix-green animate-pulse ml-1">█</span>
    </form>
  );
});

TerminalInput.displayName = 'TerminalInput';
