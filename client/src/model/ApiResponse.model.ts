export type ApiResponse<DataType, ErrorType = undefined> = {
  message: string;
  errors?: ErrorType;
  data?: DataType;
};
