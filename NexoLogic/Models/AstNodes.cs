namespace NexoLogic.Models;

public class AstNodes
{
    public abstract record Node;

    // --- EXPRESSIONS (Values) ---
    public abstract record Expression : Node;

    // Literals
    public record NumberExpression(int Value) : Expression;
    public record StringExpression(string Value) : Expression;
    public record BoolExpression(bool Value) : Expression;
    public record NullExpression() : Expression;

    // Variables & Access
    public record VariableExpression(string Name) : Expression;
    
    // NEW: Access to arrays/lists (e.g., list[0])
    public record IndexAccessExpression(Expression Obj, Expression Index) : Expression;

    // Operators
    public record BinaryExpression(Expression Left, string Op, Expression Right) : Expression;
    public record UnaryExpression(string Op, Expression Right) : Expression;

    // NEW: Function Calls (e.g., calculate(10, 20))
    public record CallExpression(string Callee, List<Expression> Arguments) : Expression;

    // NEW: User Input as Expression (e.g., x = read + 1)
    public record ReadExpression() : Expression;


    // --- STATEMENTS (Actions) ---
    public abstract record Statement : Node;

    // Basic Actions
    public record PrintStatement(Expression Expression) : Statement;
    public record AssignmentStatement(string VariableName, Expression Value) : Statement;
    public record ExpressionStatement(Expression Expression) : Statement;
    
    // NEW: Variable Declaration (distinta dall'assegnazione se vuoi scoping)
    public record VarDeclarationStatement(string Name, Expression Initializer) : Statement;

    // Flow Control
    public record BlockStatement(List<Statement> Statements) : Statement;
    public record IfStatement(Expression Condition, Statement ThenBranch, Statement? ElseBranch) : Statement;
    public record WhileStatement(Expression Condition, Statement Body) : Statement;
    
    // NEW: Loop Control
    public record BreakStatement() : Statement;
    public record ContinueStatement() : Statement;

    // NEW: Functions (Defining custom commands)
    public record FunctionStatement(
        string Name, 
        List<string> Parameters, 
        BlockStatement Body
    ) : Statement;

    // NEW: Return Statement
    public record ReturnStatement(Expression? Value) : Statement;
    //Using Statement
    public record UsingStatement(string ModuleName) : Statement;
}