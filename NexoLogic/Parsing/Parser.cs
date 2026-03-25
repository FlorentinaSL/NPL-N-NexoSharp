using NexoLogic.Models;
using NexoLogic.Models.Enums;

namespace NexoLogic.Parsing;

public class Parser {
    private readonly List<Token> _tokens;
    private int _pos = 0;

    public Parser(List<Token> tokens) => _tokens = tokens;
    private Token Current => _pos < _tokens.Count ? _tokens[_pos] : _tokens[^1];
    private Token Peek(int dist) => _pos + dist < _tokens.Count ? _tokens[_pos + dist] : _tokens[^1];
    private Token Next() => _tokens[_pos++];

    public List<AstNodes.Statement> Parse() {
        var stmts = new List<AstNodes.Statement>();
        while (Current.Type != TokenType.EOF) stmts.Add(ParseStatement());
        return stmts;
    }

    private AstNodes.Statement ParseStatement() {
        if (Current.Type == TokenType.If) {
            Next(); var cond = ParseExpression(); if (Current.Type == TokenType.Colon) Next();
            var then = ParseBody(); AstNodes.Statement? @else = null;
            if (Current.Type == TokenType.Else) { Next(); if (Current.Type == TokenType.Colon) Next(); @else = ParseBody(); }
            return new AstNodes.IfStatement(cond, then, @else);
        }
        if (Current.Type == TokenType.While) {
            Next(); var cond = ParseExpression(); if (Current.Type == TokenType.Colon) Next();
            return new AstNodes.WhileStatement(cond, ParseBody());
        }
        if (Current.Type == TokenType.Write) { Next(); return new AstNodes.PrintStatement(ParseExpression()); }
        
        if (Current.Type == TokenType.Identifier && Peek(1).Type == TokenType.Assign) {
            var name = Next().Value; Next(); // =
            return new AstNodes.AssignmentStatement(name, ParseExpression());
        }
        if (Current.Type == TokenType.Using) {
            Next(); 
            if (Current.Type != TokenType.Identifier)
                throw new Exception("Expected module name after 'using'");
            
            string moduleName = Next().Value;
            while (Current.Type == TokenType.Dot) {
                Next(); // consuma il punto
                if (Current.Type != TokenType.Identifier)
                    throw new Exception("Expected module name part after '.' in 'using'");
                moduleName += "." + Next().Value;
            }
            return new AstNodes.UsingStatement(moduleName);
        }
        if (Current.Type == TokenType.Do) {
            Next(); 
            string name = Next().Value;
            
            Next(); 
            var parameters = new List<string>();
            while (Current.Type != TokenType.CloseParen) {
                parameters.Add(Next().Value);
                if (Current.Type == TokenType.Comma) Next();
            }
            Next(); 
            
            var body = ParseBody(); 
            return new AstNodes.FunctionStatement(name, parameters, (AstNodes.BlockStatement)body);
        }
        
        if (Current.Type == TokenType.Return) {
            Next();
            AstNodes.Expression? expr = null;
            // Assumiamo che il return possa non avere nulla dopo, nel qual caso è null.
            // Dato che il linguaggio non ha ancora punto e virgola, è complicato dire quando finisce.
            // Possiamo provare a parsare un'espressione solo se il prossimo token non è fine blocco o EOF.
            if (Current.Type != TokenType.CloseBrace && Current.Type != TokenType.EOF) {
                expr = ParseExpression();
            }
            return new AstNodes.ReturnStatement(expr);
        }
        
        if (Current.Type == TokenType.Break) {
            Next(); return new AstNodes.BreakStatement();
        }
        if (Current.Type == TokenType.Continue) {
            Next(); return new AstNodes.ContinueStatement();
        }
        
        // Se non è nessuno dei precedenti, o è un ExpressionStatement
        var expStmt = ParseExpression();
        return new AstNodes.ExpressionStatement(expStmt);
    }

    private AstNodes.Statement ParseBody() {
        if (Current.Type == TokenType.OpenBrace) {
            Next(); var stmts = new List<AstNodes.Statement>();
            while (Current.Type != TokenType.CloseBrace && Current.Type != TokenType.EOF) stmts.Add(ParseStatement());
            Next(); return new AstNodes.BlockStatement(stmts);
        }
        return ParseStatement();
    }

    private AstNodes.Expression ParseExpression() => ParseEquality();
    private AstNodes.Expression ParseEquality() {
        var left = ParseComparison();
        while (Current.Type is TokenType.EqualEqual or TokenType.NotEqual)
            left = new AstNodes.BinaryExpression(left, Next().Value, ParseComparison());
        return left;
    }
    private AstNodes.Expression ParseComparison() {
        var left = ParseTerm();
        while (Current.Type is TokenType.GreaterThan or TokenType.GreaterEqual or TokenType.LessThan or TokenType.LessEqual)
            left = new NexoLogic.Models.AstNodes.BinaryExpression(left, Next().Value, ParseTerm());
        return left;
    }
    private AstNodes.Expression ParseTerm() {
        var left = ParseFactor();
        while (Current.Type is TokenType.Plus or TokenType.Minus)
            left = new NexoLogic.Models.AstNodes.BinaryExpression(left, Next().Value, ParseFactor());
        return left;
    }
    private AstNodes.Expression ParseFactor() {
        var left = ParsePrimary();
        while (Current.Type is TokenType.Multiply or TokenType.Divide)
            left = new NexoLogic.Models.AstNodes.BinaryExpression(left, Next().Value, ParsePrimary());
        return left;
    }
    private AstNodes.Expression ParsePrimary() {
        if (Current.Type == TokenType.Read) { Next(); return new AstNodes.ReadExpression(); }
        if (Current.Type == TokenType.Number) return new AstNodes.NumberExpression(int.Parse(Next().Value));
        if (Current.Type == TokenType.String) return new AstNodes.StringExpression(Next().Value);
        if (Current.Type == TokenType.True) { Next(); return new AstNodes.BoolExpression(true); }
        if (Current.Type == TokenType.False) { Next(); return new AstNodes.BoolExpression(false); }
        if (Current.Type == TokenType.Identifier) {
            string name = Next().Value;
            if (Current.Type == TokenType.OpenParen) { // Function Call
                Next();
                var args = new List<AstNodes.Expression>();
                while (Current.Type != TokenType.CloseParen && Current.Type != TokenType.EOF) {
                    args.Add(ParseExpression());
                    if (Current.Type == TokenType.Comma) Next();
                }
                if (Current.Type == TokenType.CloseParen) Next();
                return new AstNodes.CallExpression(name, args);
            }
            return new AstNodes.VariableExpression(name);
        }
        if (Current.Type == TokenType.OpenParen) { Next(); var e = ParseExpression(); Next(); return e; }
        throw new Exception($"Invalid expression: {Current.Value}");
    }
}