import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export class ResponseDto<TData> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty({ example: 'success' })
  message: string;

  data: TData;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassConstructor<T = any> = new (...args: any[]) => T;

interface ResponseSchema {
  allOf: {
    $ref?: string;
    properties?: Record<string, unknown>;
  }[];
}

const getCommonProperties = () => ({
  success: {
    type: 'boolean',
    example: true,
  },
  statusCode: {
    type: 'number',
    example: HttpStatus.OK,
  },
  message: {
    type: 'string',
    example: 'success',
  },
});

export const ApiResponseWrapper = (
  model?: ClassConstructor,
  summary?: string,
  array?: boolean,
) => {
  if (model) {
    const data = array
      ? {
          type: 'array',
          items: {
            $ref: getSchemaPath(model),
          },
        }
      : { $ref: getSchemaPath(model) };

    const schema: ResponseSchema = {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            ...getCommonProperties(),
            data,
          },
        },
      ],
    };

    return applyDecorators(
      ApiOperation({ summary }),
      ApiExtraModels(model),
      ApiExtraModels(ResponseDto),
      ApiOkResponse({ schema: schema as SchemaObject }),
    );
  }

  const schema: ResponseSchema = {
    allOf: [
      {
        properties: getCommonProperties(),
      },
    ],
  };

  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiOkResponse({ schema: schema as SchemaObject }),
  );
};
