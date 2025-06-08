// Simple Python-like code executor simulation
// In a real implementation, you'd use a sandboxed Python interpreter

export interface ExecutionResult {
  output: string[];
  error?: string;
}

export class CodeExecutor {
  private variables: Record<string, any> = {};
  private functions: Record<string, Function> = {};
  
  async executeCode(code: string): Promise<ExecutionResult> {
    const output: string[] = [];
    
    try {
      // Reset state for fresh execution
      this.variables = {};
      this.functions = {};
      
      // Split code into lines and execute
      const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
      
      for (const line of lines) {
        await this.executeLine(line.trim(), output);
      }
      
      return { output };
    } catch (error) {
      return {
        output,
        error: `ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  private async executeLine(line: string, output: string[]): Promise<void> {
    // Handle variable assignments
    if (line.includes(' = ') && !line.includes('==')) {
      const [varName, expression] = line.split(' = ', 2);
      const value = this.evaluateExpression(expression.trim());
      this.variables[varName.trim()] = value;
      return;
    }
    
    // Handle print statements
    if (line.startsWith('print(') && line.endsWith(')')) {
      const content = line.slice(6, -1);
      const value = this.evaluateExpression(content);
      output.push(String(value));
      return;
    }
    
    // Handle input statements (simulate with default values)
    if (line.includes('input(')) {
      const match = line.match(/input\("([^"]*)"\)/);
      if (match) {
        const prompt = match[1];
        output.push(`>>> ${prompt}`);
        // Simulate user input with a default value
        const simulatedInput = "Hello from the simulator!";
        output.push(simulatedInput);
        return;
      }
    }
    
    // Handle for loops
    if (line.startsWith('for ') && line.includes(' in range(')) {
      const match = line.match(/for (\w+) in range\((\d+),?\s*(\d+)?\):/);
      if (match) {
        const [, varName, start, end] = match;
        const startNum = parseInt(start);
        const endNum = end ? parseInt(end) : startNum;
        const actualStart = end ? startNum : 0;
        const actualEnd = end ? endNum : startNum;
        
        for (let i = actualStart; i < actualEnd; i++) {
          this.variables[varName] = i;
          // Note: In a real implementation, you'd need to handle the loop body
          output.push(`${varName} = ${i}`);
        }
        return;
      }
    }
    
    // Handle if statements
    if (line.startsWith('if ') && line.endsWith(':')) {
      const condition = line.slice(3, -1);
      const result = this.evaluateCondition(condition);
      if (result) {
        // Note: In a real implementation, you'd execute the if body
        output.push(`Condition "${condition}" is true`);
      }
      return;
    }
    
    // Handle function definitions (simplified)
    if (line.startsWith('def ') && line.endsWith(':')) {
      const match = line.match(/def (\w+)\((.*)\):/);
      if (match) {
        const [, funcName, params] = match;
        output.push(`Function "${funcName}" defined with parameters: ${params || 'none'}`);
        return;
      }
    }
    
    // Handle list operations
    if (line.includes('.append(')) {
      const match = line.match(/(\w+)\.append\((.+)\)/);
      if (match) {
        const [, listName, item] = match;
        if (!this.variables[listName]) {
          this.variables[listName] = [];
        }
        const value = this.evaluateExpression(item);
        this.variables[listName].push(value);
        output.push(`Added ${value} to ${listName}`);
        return;
      }
    }
    
    // Handle list creation
    if (line.startsWith('[') && line.endsWith(']')) {
      const items = line.slice(1, -1).split(',').map(item => this.evaluateExpression(item.trim()));
      output.push(`List created: [${items.join(', ')}]`);
      return;
    }
    
    // Default: show the line as executed
    output.push(`>>> ${line}`);
  }
  
  private evaluateExpression(expr: string): any {
    // Remove quotes for strings
    if ((expr.startsWith('"') && expr.endsWith('"')) || 
        (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.slice(1, -1);
    }
    
    // Check if it's a number
    if (!isNaN(Number(expr))) {
      return Number(expr);
    }
    
    // Check if it's a variable
    if (this.variables.hasOwnProperty(expr)) {
      return this.variables[expr];
    }
    
    // Handle simple math operations
    if (expr.includes(' + ')) {
      const [left, right] = expr.split(' + ');
      return this.evaluateExpression(left) + this.evaluateExpression(right);
    }
    
    if (expr.includes(' - ')) {
      const [left, right] = expr.split(' - ');
      return this.evaluateExpression(left) - this.evaluateExpression(right);
    }
    
    if (expr.includes(' * ')) {
      const [left, right] = expr.split(' * ');
      return this.evaluateExpression(left) * this.evaluateExpression(right);
    }
    
    if (expr.includes(' / ')) {
      const [left, right] = expr.split(' / ');
      return this.evaluateExpression(left) / this.evaluateExpression(right);
    }
    
    return expr;
  }
  
  private evaluateCondition(condition: string): boolean {
    // Simple condition evaluation
    if (condition.includes(' > ')) {
      const [left, right] = condition.split(' > ');
      return this.evaluateExpression(left) > this.evaluateExpression(right);
    }
    
    if (condition.includes(' < ')) {
      const [left, right] = condition.split(' < ');
      return this.evaluateExpression(left) < this.evaluateExpression(right);
    }
    
    if (condition.includes(' == ')) {
      const [left, right] = condition.split(' == ');
      return this.evaluateExpression(left) === this.evaluateExpression(right);
    }
    
    return Boolean(this.evaluateExpression(condition));
  }
}