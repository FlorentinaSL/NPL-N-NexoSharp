using NexoLogic.Models.Enums;

namespace NexoLogic.Lexing;

public class Lexer {
    private readonly string _source;
    private int _pos = 0;

    public Lexer(string source) => _source = source;

    private char Current => _pos < _source.Length ? _source[_pos] : '\0';
    private char Peek(int dist = 1) => _pos + dist < _source.Length ? _source[_pos + dist] : '\0';

    public List<Token> Tokenize() {
        var tokens = new List<Token>();
        while (_pos < _source.Length) {
            if (char.IsWhiteSpace(Current)) { _pos++; continue; }

            // HEART COMMENT <3
            if (Current == '<' && Peek() == '3') {
                while (_pos < _source.Length && Current != '\n') _pos++;
                continue;
            }

            // STRINGS
            if (Current == '"') {
                _pos++; string val = "";
                while (_pos < _source.Length && Current != '"') val += _source[_pos++];
                _pos++; tokens.Add(new Token(TokenType.String, val));
                continue;
            }

            // NUMBERS
            if (char.IsDigit(Current)) {
                string val = "";
                while (char.IsDigit(Current)) val += _source[_pos++];
                tokens.Add(new Token(TokenType.Number, val));
                continue;
            }

            // IDENTIFIERS & KEYWORDS
            if (char.IsLetter(Current) || Current == '_') {
                string val = "";
                while (char.IsLetterOrDigit(Current) || Current == '_') val += _source[_pos++];
                var type = val.ToLower() switch {
                    "do" => TokenType.Do,
                    "using" => TokenType.Using,
                    "if" => TokenType.If, "else" => TokenType.Else, "while" => TokenType.While,
                    "return" => TokenType.Return,
                    "break" => TokenType.Break,
                    "continue" => TokenType.Continue,
                    "write" => TokenType.Write, "read" => TokenType.Read, "true" => TokenType.True,
                    "false" => TokenType.False, "and" => TokenType.And, "or" => TokenType.Or,
                    "not" => TokenType.Not, _ => TokenType.Identifier
                };
                tokens.Add(new Token(type, val));
                continue;
            }

            HandleOperators(tokens);
        }
        tokens.Add(new Token(TokenType.EOF, ""));
        return tokens;
    }

    private void HandleOperators(List<Token> tokens) {
        switch (Current) {
            case '=': if (Peek() == '=') { tokens.Add(new Token(TokenType.EqualEqual, "==")); _pos += 2; }
                      else { tokens.Add(new Token(TokenType.Assign, "=")); _pos++; } break;
            case '!': if (Peek() == '=') { tokens.Add(new Token(TokenType.NotEqual, "!=")); _pos += 2; }
                      else { tokens.Add(new Token(TokenType.Not, "!")); _pos++; } break;
            case '>': if (Peek() == '=') { tokens.Add(new Token(TokenType.GreaterEqual, ">=")); _pos += 2; }
                      else { tokens.Add(new Token(TokenType.GreaterThan, ">")); _pos++; } break;
            case '<': if (Peek() == '=') { tokens.Add(new Token(TokenType.LessEqual, "<=")); _pos += 2; }
                      else { tokens.Add(new Token(TokenType.LessThan, "<")); _pos++; } break;
            case '+': tokens.Add(new Token(TokenType.Plus, "+")); _pos++; break;
            case '-': tokens.Add(new Token(TokenType.Minus, "-")); _pos++; break;
            case '*': tokens.Add(new Token(TokenType.Multiply, "*")); _pos++; break;
            case '/': tokens.Add(new Token(TokenType.Divide, "/")); _pos++; break;
            case '(': tokens.Add(new Token(TokenType.OpenParen, "(")); _pos++; break;
            case ')': tokens.Add(new Token(TokenType.CloseParen, ")")); _pos++; break;
            case '{': tokens.Add(new Token(TokenType.OpenBrace, "{")); _pos++; break;
            case '}': tokens.Add(new Token(TokenType.CloseBrace, "}")); _pos++; break;
            case '[': tokens.Add(new Token(TokenType.OpenBracket, "[")); _pos++; break;
            case ']': tokens.Add(new Token(TokenType.CloseBracket, "]")); _pos++; break;
            case ':': tokens.Add(new Token(TokenType.Colon, ":")); _pos++; break;
            case ',': tokens.Add(new Token(TokenType.Comma, ",")); _pos++; break;
            case '.': tokens.Add(new Token(TokenType.Dot, ".")); _pos++; break;
            default: _pos++; break;
        }
    }
}