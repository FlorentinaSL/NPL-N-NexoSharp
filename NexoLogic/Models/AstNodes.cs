using System.Collections.Generic;

namespace NexoLogic.Models;

/// <summary>
/// Architecture definition for the Abstract Syntax Tree (AST).
/// Contains strongly typed node paradigms used to represent semantic instructions post-parsing, 
/// directly mapped to Common Intermediate Language (CIL) execution flows.
/// </summary>
public class AstNodes
{
    /// <summary>
    /// Base polymorphic structural token representing any executable or evaluatable NPL construct.
    /// </summary>
    public abstract record Node;

    // =========================================================================
    // EXPRESSIONS (R-Values: Logic that computes and returns raw data)
    // =========================================================================
    public abstract record Expression : Node;

    // --- Scalar Literals ---
    public record NumberExpression(int Value) : Expression;
    public record StringExpression(string Value) : Expression;
    public record BoolExpression(bool Value) : Expression;
    public record NullExpression() : Expression;

    // --- Memory Access ---
    public record VariableExpression(string Name) : Expression;
    
    // Memory Indexing (Heap Access via Pointer Dereferencing)
    public record IndexAccessExpression(Expression Obj, Expression Index) : Expression;

    // --- Operations ---
    public record BinaryExpression(Expression Left, string Op, Expression Right) : Expression;
    public record UnaryExpression(string Op, Expression Right) : Expression;

    // --- Invocation & Native Bridging ---
    /// <summary>
    /// Represents an execution dispatch, either passing control flow to an internal NPL function 
    /// or bridging to the underlying framework via Reflection (Native Calls).
    /// </summary>
    public record CallExpression(string Callee, List<Expression> Arguments) : Expression;

    // --- Pipeline I/O ---
    /// <summary>
    /// Stream blocking I/O expression awaiting synchronous buffer input.
    /// </summary>
    public record ReadExpression() : Expression;

    // =========================================================================
    // STATEMENTS (L-Values & Operations: Void actions mutating memory states)
    // =========================================================================
    public abstract record Statement : Node;

    // --- Core Operations ---
    public record PrintStatement(Expression Expression) : Statement;
    public record AssignmentStatement(string VariableName, Expression Value) : Statement;
    
    /// <summary>
    /// Transparent wrapper evaluating standard expressions purely for their side-effects.
    /// </summary>
    public record ExpressionStatement(Expression Expression) : Statement;
    
    /// <summary>
    /// Explicit transient allocation in the local symbolic stack.
    /// </summary>
    public record VarDeclarationStatement(string Name, Expression Initializer) : Statement;

    // --- Control Flow & Routing ---
    public record BlockStatement(List<Statement> Statements) : Statement;
    public record IfStatement(Expression Condition, Statement ThenBranch, Statement? ElseBranch) : Statement;
    public record WhileStatement(Expression Condition, Statement Body) : Statement;
    
    // --- Loop Synchronization ---
    public record BreakStatement() : Statement;
    public record ContinueStatement() : Statement;

    // --- Execution Paradigms ---
    /// <summary>
    /// Encapsulates a reusable execution block acting as an internal module definition.
    /// </summary>
    public record FunctionStatement(
        string Name, 
        List<string> Parameters, 
        BlockStatement Body
    ) : Statement;

    /// <summary>
    /// Evaluates attached logic, popping constraints and safely mutating the call stack downward.
    /// </summary>
    public record ReturnStatement(Expression? Value) : Statement;
    
    // --- Codebase Organization ---
    /// <summary>
    /// Pre-compilation linker directive binding fragmented `.nexo` logic files into a unified binary.
    /// </summary>
    public record UsingStatement(string ModuleName) : Statement;
}