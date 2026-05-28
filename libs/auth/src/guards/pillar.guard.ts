import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export enum PillarType {
  DIFFUSION = "diffusion",
  TRACE = "traceability_and_verification",
  CC = "certification_and_compliance",
  LIVELIHOOD_IMPROVEMENT = "livelihood_improvement",
}

export enum PillarRole {
  FIELD_OFFICE = "field_officer",
  PILLAR_HEAD = "pillar_head",
}

export const PILLAR_GUARD_META = "pillar_guard_meta";

export interface PillarGuardOptions {
  pillar: PillarType;
  requiredRole: PillarRole;
  requireApproval?: boolean;
}

export const PillarGuardMeta = (options: PillarGuardOptions) => {
  return (
    target: any,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) => {
    const existingMetadata =
      Reflect.getMetadata(PILLAR_GUARD_META, descriptor?.value || target) || [];
    const newMetadata = Array.isArray(existingMetadata)
      ? [...existingMetadata, options]
      : [existingMetadata, options];
    Reflect.defineMetadata(
      PILLAR_GUARD_META,
      newMetadata,
      descriptor?.value || target,
    );
  };
};

@Injectable()
export class PillarGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get accumulated metadata from multiple decorators
    const allOptions =
      this.reflector.get<PillarGuardOptions[]>(
        PILLAR_GUARD_META,
        context.getHandler(),
      ) || [];
    if (allOptions.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new UnauthorizedException("User not found");

    // Check if user matches any allowed pillar/role pair
    for (const options of allOptions) {
      console.log("PillarGuard - Checking option:", JSON.stringify(options));
      console.log(
        "PillarGuard - User pillar:",
        user.pillar?.name,
        "Required:",
        options.pillar,
      );
      console.log(
        "PillarGuard - User role:",
        user.role?.name,
        "Required:",
        options.requiredRole,
      );

      if (!user.pillar || user.pillar.name !== options.pillar) {
        console.log("PillarGuard - Pillar mismatch, continuing...");
        continue;
      }
      if (user.role && user.role.name === options.requiredRole) {
        console.log("PillarGuard - Match found! Allowing access.");
        return true;
      }
    }
    console.log("PillarGuard - No match found, denying access.");
    return false;
  }
}
