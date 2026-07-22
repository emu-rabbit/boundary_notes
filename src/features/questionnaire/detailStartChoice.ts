interface DetailStartChoiceInput {
  answered: number;
  total: number;
}

export function shouldOfferDetailStartChoice(input: DetailStartChoiceInput): boolean {
  return input.answered > 0 && input.answered < input.total;
}
