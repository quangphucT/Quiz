export interface Question {
  id: number;
  question: string;
  answer: string;
  hint?: string;
  keywordIndex: number; // Index of the letter that belongs to keyword
}

export interface CrosswordData {
  questions: Question[];
  keyword: string;
  keywordColumn: number; // Column index where keyword letters are
}
