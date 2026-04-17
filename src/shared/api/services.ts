import { request } from "../lib/http";
import type { PaginatedResponse, PublicServiceCardDto } from "../types/api";

export function listPublicServices() {
  return request<PaginatedResponse<PublicServiceCardDto>>("/services?limit=24");
}
