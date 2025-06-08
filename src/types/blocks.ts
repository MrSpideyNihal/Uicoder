export interface CodeBlock {
  id: string;
  type: string;
  category: 'variables' | 'control' | 'io' | 'functions' | 'lists';
  label: string;
  icon: string;
  color: string;
  x: number;
  y: number;
  inputs?: BlockInput[];
  outputs?: BlockOutput[];
  code?: string;
  template?: string;
}

export interface BlockInput {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'any';
  value?: string;
  connected?: boolean;
}

export interface BlockOutput {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'any';
}

export interface Connection {
  id: string;
  fromBlockId: string;
  fromOutputId: string;
  toBlockId: string;
  toInputId: string;
}

export interface WorkspaceState {
  blocks: CodeBlock[];
  connections: Connection[];
  selectedBlockId?: string;
}