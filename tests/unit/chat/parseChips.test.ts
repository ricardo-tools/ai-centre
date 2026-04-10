import { describe, it, expect } from 'vitest';
import { parseChips } from '@/features/chat/widgets/ChatWidget/parseChips';

describe('parseChips', () => {
  it('extracts chips from a well-formed comment at end of message', () => {
    const raw = 'Here is your answer.\n\n<!-- chips: ["Explore design skills", "Start a new project", "Compare auth options"] -->';
    const result = parseChips(raw);
    expect(result.content).toBe('Here is your answer.');
    expect(result.chips).toEqual(['Explore design skills', 'Start a new project', 'Compare auth options']);
    expect(result.fact).toBeNull();
  });

  it('returns full content and empty chips when no comment found', () => {
    const raw = 'Just a regular message with no chips.';
    const result = parseChips(raw);
    expect(result.content).toBe(raw);
    expect(result.chips).toEqual([]);
    expect(result.fact).toBeNull();
  });

  it('handles trailing whitespace after the comment', () => {
    const raw = 'Answer.\n<!-- chips: ["A", "B"] -->  \n';
    const result = parseChips(raw);
    expect(result.content).toBe('Answer.');
    expect(result.chips).toEqual(['A', 'B']);
  });

  it('returns full content when JSON inside comment is invalid', () => {
    const raw = 'Answer.\n<!-- chips: [not valid json] -->';
    const result = parseChips(raw);
    expect(result.content).toBe(raw);
    expect(result.chips).toEqual([]);
  });

  it('returns full content when chips array contains non-strings', () => {
    const raw = 'Answer.\n<!-- chips: [1, 2, 3] -->';
    const result = parseChips(raw);
    expect(result.content).toBe(raw);
    expect(result.chips).toEqual([]);
  });

  it('does not match a chips comment in the middle of a message', () => {
    const raw = '<!-- chips: ["A"] -->\nMore text after.';
    const result = parseChips(raw);
    expect(result.content).toBe(raw);
    expect(result.chips).toEqual([]);
  });

  it('handles a single chip', () => {
    const raw = 'Done.\n<!-- chips: ["Only one option"] -->';
    const result = parseChips(raw);
    expect(result.content).toBe('Done.');
    expect(result.chips).toEqual(['Only one option']);
  });

  it('handles empty chips array', () => {
    const raw = 'Done.\n<!-- chips: [] -->';
    const result = parseChips(raw);
    expect(result.content).toBe('Done.');
    expect(result.chips).toEqual([]);
  });
});

describe('parseChips — fact extraction', () => {
  it('extracts a fun fact from a greeting message', () => {
    const raw = '<!-- fact: Did you know that today in 1849, Walter Hunt patented the safety pin? -->\n\nHey, need help with skills or a project?\n\n<!-- chips: ["Browse skills", "Start a project"] -->';
    const result = parseChips(raw);
    expect(result.fact).toBe('Did you know that today in 1849, Walter Hunt patented the safety pin?');
    expect(result.content).toBe('Hey, need help with skills or a project?');
    expect(result.chips).toEqual(['Browse skills', 'Start a project']);
  });

  it('returns null fact when no fact marker present', () => {
    const raw = 'Regular message.\n\n<!-- chips: ["A"] -->';
    const result = parseChips(raw);
    expect(result.fact).toBeNull();
  });

  it('handles fact without chips', () => {
    const raw = '<!-- fact: Fun fact here! -->\n\nSome follow-up text.';
    const result = parseChips(raw);
    expect(result.fact).toBe('Fun fact here!');
    expect(result.content).toBe('Some follow-up text.');
    expect(result.chips).toEqual([]);
  });
});
