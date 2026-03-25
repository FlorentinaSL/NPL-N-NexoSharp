namespace NexoLogic.Models.Enums;

public enum TokenType
{
    // --- Using ---
    Using,
    // --- Funzioni ---
    Do,
    // --- Valori Primari ---
    Number,         // Es: 10, 42
    String,         // Es: "Ciao Luca"
    Identifier,     // Nomi di variabili: x, pippo, contatore
    True,           // vero
    False,          // falso
    
    // --- Operatori Matematici ---
    Plus,           // +
    Minus,          // -
    Multiply,       // *
    Divide,         // /
    Assign,         // = (Assegnazione)

    // --- Operatori Logici (Per i Bivi del Flowchart) ---
    EqualEqual,     // == (Confronto uguaglianza)
    NotEqual,       // != (Diverso)
    GreaterThan,    // >
    LessThan,       // <
    GreaterEqual,   // >=
    LessEqual,      // <=
    And,            // e (logico)
    Or,             // o (logico)
    Not,            // non / !

    // --- Parole Chiave (Keywords) ---
    If,             // se
    Else,           // altrimenti
    While,          // finché (per i cicli)
    Write,          // scrivi (output)
    Read,           // leggi (input)
    Return,         // ritorna da una funzione
    Break,          // esci dal ciclo
    Continue,       // passa alla prossima iterazione
    
    // --- Simboli di Struttura ---
    OpenParen,      // (
    CloseParen,     // )
    OpenBrace,      // { (Inizio blocco)
    CloseBrace,     // } (Fine blocco)
    OpenBracket,    // [ (Inizio lista)
    CloseBracket,   // ] (Fine lista)
    Colon,          // : (Stile Python)
    Comma,          // , (Per separare argomenti)
    Dot,            // . (Accesso proprietà o filepath)
    
    // --- Speciali ---
    Comment,        // Il mitico <3
    EOF             // End of File (Fine del programma)
}

public record Token(TokenType Type, string Value);