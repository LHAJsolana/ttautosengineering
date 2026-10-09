import type { Locale } from "@/lib/i18n";
import type { McvApiResult, McvBeneficiaryType } from "@/lib/mcv/types";

export type GarageChatRole = "user" | "assistant";

export type GarageChatMessage = {
  role: GarageChatRole;
  content: string;
};

export type GarageVehicleContext = {
  brand?: string;
  model?: string;
  year?: string;
  engine?: string;
  mileage?: string;
  market?: string;
};

export type GarageChatRequest = {
  locale?: Locale;
  messages?: GarageChatMessage[];
  vehicle?: GarageVehicleContext;
  tools?: {
    mcv?: {
      manufacturer?: string;
      model?: string;
      vehicleType?: string;
      firstRegistrationDate?: string;
      beneficiaryType?: McvBeneficiaryType;
    };
  };
  pageContext?: {
    pathname?: string;
    title?: string;
  };
};

export type GarageCitation = {
  title: string;
  href: string;
  type: string;
};

export type GarageAction = {
  label: string;
  href: string;
};

export type GarageAnswer = {
  text: string;
  citations: GarageCitation[];
  actions: GarageAction[];
  mode: "openai" | "local";
  tools?: {
    mcv?: McvApiResult | { status: "missing_fields"; message: string; missingFields: string[] };
  };
};
