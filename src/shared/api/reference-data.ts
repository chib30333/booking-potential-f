import { request } from "../lib/http";
import type { ReferenceDataResponse } from "../types/api";

export function getReferenceData() {
  return request<ReferenceDataResponse>("/reference-data");
}
