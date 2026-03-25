using System.Collections.Generic;
using NexoLogic.Models.Enums;

namespace NexoLogic.Lexing;

/// <summary>
/// Lexical Analyzer for the Nexo Programming Language (NPL).
/// Responsible for streaming raw source code strings and converting them into structured LL(k) token definitions.
/// Utilizes a single pass state machine with O(1) lookahead bounds.
/// </summary>
public class Lexer {
    private readonly string _source;
    
    /// <summary>
    /// Represents the current physical pointer offset within the MSIL abstract string memory block.
    /// </summary>
    private int _pos = 0;

    public Lexer(string source) => _source = source;

    /// <summary>
    /// Retrieves the character at the current lexical pointer, returning the null terminator on bound overflows.
    /// </summary>
    private char Current => _pos < _source.Length ? _source[_pos] : '\0';

    /// <summary>
    /// Safely performs a forward lookahead operation relative to the current evaluation pointer.
    /// Essential for disambiguating compound operators (e.g. distinguishing '=' from '==').
    /// </summary>
    private char Peek(int dist = 1) => _pos + dist < _source.Length ? _source[_pos + dist] : '\0';

    /// <summary>
    /// Executes the primary tokenization loop to break down the monolithic source payload.
    /// Emits a contiguous stream of <see cref="Token"/> structured instances.
    /// </summary>
    public List<Token> Tokenize() {
        var tokens = new List<Token>();
        
        while (_pos < _source.Length) {
            // Memory Optimization: Bypass contiguous whitespace and line breaks blindly
            if (char.IsWhiteSpace(Current)) { _pos++; continue; }

            // Semantic Annotation Bypass: Line Comments ('<3')
            // Using a custom syntax where '<3' signals a full line comment block ignore until new line.
            if (Current == '<' && Peek() == '3') {
                while (_pos < _source.Length && Current != '\n') _pos++;
                continue;
            }

            // String Literal Allocation
            // Traverses characters capturing pure text until an enclosing double-quote is registered.
            if (Current == '"') {
                _pos++; 
                string val = "";
                while (_pos < _source.Length && Current != '"') val += _source[_pos++];
                _pos++; 
                tokens.Add(new Token(TokenType.String, val));
                continue;
            }

            // Integer Literal Allocation
            // Scans contiguous blocks of Base-10 digits, coalescing them into numerical descriptors.
            if (char.IsDigit(Current)) {
                string val = "";
                while (char.IsDigit(Current)) val += _source[_pos++];
                tokens.Add(new Token(TokenType.Number, val));
                continue;
            }

            // Symbol Binding: Identifiers, Native Methods, and Language Defined Keywords
            // Automatically permits underscore '_' character for native library interop bridging support.
            if (char.IsLetter(Current) || Current == '_') {
                string val = "";
                while (char.IsLetterOrDigit(Current) || Current == '_') val += _source[_pos++];
                
                // Map logical strings into reserved language keywords avoiding runtime resolution faults
                var type = val.ToLower() switch {
                    "do" => TokenType.Do,
                    "using" => TokenType.Using,
                    "if" => TokenType.If, 
                    "else" => TokenType.Else, 
                    "while" => TokenType.While,
                    "return" => TokenType.Return,
                    "break" => TokenType.Break,
                    "continue" => TokenType.Continue,
                    "foreach" => TokenType.Foreach,
                    "in" => TokenType.In,
                    "write" => TokenType.Write, 
                    "read" => TokenType.Read, 
                    "true" => TokenType.True,
                    "false" => TokenType.False, 
                    "and" => TokenType.And, 
                    "or" => TokenType.Or,
                    "not" => TokenType.Not, 
                    _ => TokenType.Identifier
                };
                tokens.Add(new Token(type, val));
                continue;
            }

            // Operator Routing & Compound Verification
            HandleOperators(tokens);
        }
        
        // Finalize token chain with absolute End-Of-File marker for LL(n) parser synchronization
        tokens.Add(new Token(TokenType.EOF, ""));
        return tokens;
    }

    /// <summary>
    /// Resolves primitive mathematical offsets and comparative operator binding logic.
    /// Modifies the token accumulation vector directly by reference memory pointer.
    /// </summary>
    private void HandleOperators(List<Token> tokens) {
        switch (Current) {
            case '=': 
                if (Peek() == '=') { tokens.Add(new Token(TokenType.EqualEqual, "==")); _pos += 2; }
                else { tokens.Add(new Token(TokenType.Assign, "=")); _pos++; } 
                break;
            case '!': 
                if (Peek() == '=') { tokens.Add(new Token(TokenType.NotEqual, "!=")); _pos += 2; }
                else { tokens.Add(new Token(TokenType.Not, "!")); _pos++; } 
                break;
            case '>': 
                if (Peek() == '=') { tokens.Add(new Token(TokenType.GreaterEqual, ">=")); _pos += 2; }
                else { tokens.Add(new Token(TokenType.GreaterThan, ">")); _pos++; } 
                break;
            case '<': 
                if (Peek() == '=') { tokens.Add(new Token(TokenType.LessEqual, "<=")); _pos += 2; }
                else { tokens.Add(new Token(TokenType.LessThan, "<")); _pos++; } 
                break;
                
            // Binary Arithmetic Node Symbols
            case '+': tokens.Add(new Token(TokenType.Plus, "+")); _pos++; break;
            case '-': tokens.Add(new Token(TokenType.Minus, "-")); _pos++; break;
            case '*': tokens.Add(new Token(TokenType.Multiply, "*")); _pos++; break;
            case '/': tokens.Add(new Token(TokenType.Divide, "/")); _pos++; break;
            
            // Scope & Access Modifier Symbols
            case '(': tokens.Add(new Token(TokenType.OpenParen, "(")); _pos++; break;
            case ')': tokens.Add(new Token(TokenType.CloseParen, ")")); _pos++; break;
            case '{': tokens.Add(new Token(TokenType.OpenBrace, "{")); _pos++; break;
            case '}': tokens.Add(new Token(TokenType.CloseBrace, "}")); _pos++; break;
            case '[': tokens.Add(new Token(TokenType.OpenBracket, "[")); _pos++; break;
            case ']': tokens.Add(new Token(TokenType.CloseBracket, "]")); _pos++; break;
            case ':': tokens.Add(new Token(TokenType.Colon, ":")); _pos++; break;
            case ',': tokens.Add(new Token(TokenType.Comma, ",")); _pos++; break;
            case '.': tokens.Add(new Token(TokenType.Dot, ".")); _pos++; break;
            
            // Unrecognized payload fallback
            default: _pos++; break;
        }
    }
}