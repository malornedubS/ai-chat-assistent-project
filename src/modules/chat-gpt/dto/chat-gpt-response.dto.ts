import type { OpenAI } from 'openai';

export class OutputSchemaDto {
  outputText: string;
}

export type ChatGptParsedResponseDto<T> = OpenAI.Responses.Response & {
  output_parsed: T;
  _request_id?: string;
};

export type ChatGptResponseDto = OpenAI.Responses.Response & {
  output: (OpenAI.Responses.ResponseOutputItem | OpenAI.Responses.ResponseFunctionToolCall | OpenAI.Responses.ResponseFileSearchToolCall)[];
  _request_id?: string;
};

export type ChatGptAnyResponse<T = OutputSchemaDto> = ChatGptParsedResponseDto<T> | ChatGptResponseDto;
