export const MCV_OFFICIAL_URL = "https://www.douane.gov.ma/mcv/#/view?pageId=4";
export const MCV_SOURCE_URL = "https://www.douane.gov.ma/mcv/#/view?pageId=2";

export type McvBeneficiaryType = "AUTRE" | "MRE" | "MRED" | "PBS";

export type McvCalculationRequest = {
  manufacturer: string;
  model: string;
  vehicleType?: string;
  firstRegistrationDate: string;
  beneficiaryType: McvBeneficiaryType;
};

export type McvDiagnosticEvent = {
  attempt: number;
  step: McvProgressStep;
  message: string;
  elapsedMs: number;
};

export type McvOption = {
  label: string;
  code?: string;
  valueNew?: number;
};

export type McvOptionsRequest = {
  manufacturer?: string;
  modelQuery?: string;
};

export type McvOptionsResult = {
  manufacturers: McvOption[];
  models: McvOption[];
  vehicleTypes: McvOption[];
};

export type McvProgressStep =
  | "connecting"
  | "loading-selection"
  | "matching-configuration"
  | "selecting-configuration"
  | "running-simulation"
  | "extracting-results"
  | "validating-amounts";

export type McvMoneyField = {
  label: string;
  amountMad: number;
  raw: string;
};

export type McvCalculationResult = {
  status: "success";
  sourceUrl: string;
  calculatedAt: string;
  consultationLabel?: string;
  vehicle: {
    genre?: string;
    manufacturer: string;
    model: string;
    vehicleType: string;
    firstRegistrationDate: string;
    beneficiaryType: McvBeneficiaryType;
  };
  fields: McvMoneyField[];
  total: McvMoneyField;
  warnings: string[];
  diagnostics?: McvDiagnosticEvent[];
};

export type McvFailureCode =
  | "VALIDATION_ERROR"
  | "VEHICLE_NOT_FOUND"
  | "AMBIGUOUS_MODEL"
  | "AMBIGUOUS_TYPE"
  | "MCV_UNAVAILABLE"
  | "SIMULATION_FAILED"
  | "EXTRACTION_FAILED"
  | "TIMEOUT"
  | "CONCURRENCY_LIMIT";

export type McvFailureResult = {
  status: "error";
  code: McvFailureCode;
  message: string;
  options?: McvOption[];
  progress?: McvProgressStep;
  diagnostics?: McvDiagnosticEvent[];
};

export type McvApiResult = McvCalculationResult | McvFailureResult;

