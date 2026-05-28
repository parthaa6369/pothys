import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import {
  PillarGuard,
  PillarGuardMeta,
  PillarRole,
  PillarType,
} from "./pillar.guard";

export function CommonTracePillarGuards() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, PillarGuard),
    PillarGuardMeta({
      pillar: PillarType.TRACE,
      requiredRole: PillarRole.FIELD_OFFICE,
    }),
    PillarGuardMeta({
      pillar: PillarType.TRACE,
      requiredRole: PillarRole.PILLAR_HEAD,
    }),
  );
}

export function CommonCCPillarGuards() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, PillarGuard),
    PillarGuardMeta({
      pillar: PillarType.CC,
      requiredRole: PillarRole.FIELD_OFFICE,
    }),
    PillarGuardMeta({
      pillar: PillarType.CC,
      requiredRole: PillarRole.PILLAR_HEAD,
    }),
  );
}

export function CommonDiffusionPillarGuards() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, PillarGuard),
    PillarGuardMeta({
      pillar: PillarType.DIFFUSION,
      requiredRole: PillarRole.FIELD_OFFICE,
    }),
    PillarGuardMeta({
      pillar: PillarType.DIFFUSION,
      requiredRole: PillarRole.PILLAR_HEAD,
    }),
  );
}

export function CommonLivelihoodPillarGuards() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, PillarGuard),
    PillarGuardMeta({
      pillar: PillarType.LIVELIHOOD_IMPROVEMENT,
      requiredRole: PillarRole.FIELD_OFFICE,
    }),
    PillarGuardMeta({
      pillar: PillarType.LIVELIHOOD_IMPROVEMENT,
      requiredRole: PillarRole.PILLAR_HEAD,
    }),
  );
}
