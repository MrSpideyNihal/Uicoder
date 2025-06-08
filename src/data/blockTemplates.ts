import { CodeBlock } from '../types/blocks';

export const blockCategories = {
  variables: {
    name: 'Variables & Math',
    color: 'bg-blue-500',
    icon: 'Calculator'
  },
  control: {
    name: 'Control Flow',
    color: 'bg-green-500',
    icon: 'GitBranch'
  },
  io: {
    name: 'Input/Output',
    color: 'bg-purple-500',
    icon: 'MessageSquare'
  },
  functions: {
    name: 'Functions',
    color: 'bg-orange-500',
    icon: 'Zap'
  },
  lists: {
    name: 'Lists & Data',
    color: 'bg-pink-500',
    icon: 'List'
  }
};

export const blockTemplates: Omit<CodeBlock, 'id' | 'x' | 'y'>[] = [
  // Variables & Math
  {
    type: 'set_variable',
    category: 'variables',
    label: 'Set Variable',
    icon: 'Calculator',
    color: 'bg-blue-500',
    template: '{variable} = {value}',
    inputs: [
      { id: 'variable', label: 'Variable Name', type: 'string', value: 'x' },
      { id: 'value', label: 'Value', type: 'any', value: '10' }
    ]
  },
  {
    type: 'math_operation',
    category: 'variables',
    label: 'Math Operation',
    icon: 'Plus',
    color: 'bg-blue-500',
    template: '{left} {operator} {right}',
    inputs: [
      { id: 'left', label: 'Left', type: 'number', value: '5' },
      { id: 'operator', label: 'Operation', type: 'string', value: '+' },
      { id: 'right', label: 'Right', type: 'number', value: '3' }
    ],
    outputs: [
      { id: 'result', label: 'Result', type: 'number' }
    ]
  },
  
  // Control Flow
  {
    type: 'if_statement',
    category: 'control',
    label: 'If Statement',
    icon: 'GitBranch',
    color: 'bg-green-500',
    template: 'if {condition}:\n    {action}',
    inputs: [
      { id: 'condition', label: 'Condition', type: 'boolean', value: 'x > 5' },
      { id: 'action', label: 'Action', type: 'any', value: 'print("Yes!")' }
    ]
  },
  {
    type: 'for_loop',
    category: 'control',
    label: 'For Loop',
    icon: 'RotateCcw',
    color: 'bg-green-500',
    template: 'for {variable} in range({start}, {end}):\n    {action}',
    inputs: [
      { id: 'variable', label: 'Variable', type: 'string', value: 'i' },
      { id: 'start', label: 'Start', type: 'number', value: '0' },
      { id: 'end', label: 'End', type: 'number', value: '5' },
      { id: 'action', label: 'Action', type: 'any', value: 'print(i)' }
    ]
  },
  
  // Input/Output
  {
    type: 'print',
    category: 'io',
    label: 'Print',
    icon: 'MessageSquare',
    color: 'bg-purple-500',
    template: 'print({message})',
    inputs: [
      { id: 'message', label: 'Message', type: 'any', value: '"Hello World!"' }
    ]
  },
  {
    type: 'input',
    category: 'io',
    label: 'Get Input',
    icon: 'Keyboard',
    color: 'bg-purple-500',
    template: 'input({prompt})',
    inputs: [
      { id: 'prompt', label: 'Prompt', type: 'string', value: '"Enter something: "' }
    ],
    outputs: [
      { id: 'result', label: 'Input', type: 'string' }
    ]
  },
  
  // Functions
  {
    type: 'define_function',
    category: 'functions',
    label: 'Define Function',
    icon: 'Zap',
    color: 'bg-orange-500',
    template: 'def {name}({parameters}):\n    {body}\n    return {return_value}',
    inputs: [
      { id: 'name', label: 'Function Name', type: 'string', value: 'my_function' },
      { id: 'parameters', label: 'Parameters', type: 'string', value: 'x, y' },
      { id: 'body', label: 'Body', type: 'any', value: 'result = x + y' },
      { id: 'return_value', label: 'Return', type: 'any', value: 'result' }
    ]
  },
  
  // Lists & Data
  {
    type: 'create_list',
    category: 'lists',
    label: 'Create List',
    icon: 'List',
    color: 'bg-pink-500',
    template: '[{items}]',
    inputs: [
      { id: 'items', label: 'Items', type: 'string', value: '1, 2, 3, 4, 5' }
    ],
    outputs: [
      { id: 'list', label: 'List', type: 'any' }
    ]
  },
  {
    type: 'append_to_list',
    category: 'lists',
    label: 'Add to List',
    icon: 'ListPlus',
    color: 'bg-pink-500',
    template: '{list}.append({item})',
    inputs: [
      { id: 'list', label: 'List', type: 'any', value: 'my_list' },
      { id: 'item', label: 'Item', type: 'any', value: '6' }
    ]
  }
];