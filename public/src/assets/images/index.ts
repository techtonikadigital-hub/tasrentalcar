import toyotaHiace12 from './toyota_hiace_12_seater_1792057594958.jpg';
import kiaCarnival from './kia_carnival_7_seater_1792057596047.jpg';
import toyotaHiaceCargo from './toyota_hiace_cargo_van_1792059258794.jpg';
import renaultMaster from './renault_master_van_1792059303316.jpg';
import toyotaEstima from './toyota_estima_van_1792059277596.jpg';
import vanFleetShowcase from './aussie_van_fleet_showcase_1792057595502.jpg';
import luxuryFleetShowcase from './luxury_fleet_showcase_1792052324112.jpg';

export const VAN_IMAGES = {
  hiace12: toyotaHiace12,
  carnival: kiaCarnival,
  cargoVan: toyotaHiaceCargo,
  renaultMaster: renaultMaster,
  estima: toyotaEstima,
  fleetShowcase: vanFleetShowcase,
  luxuryShowcase: luxuryFleetShowcase,
} as const;

/**
 * Resolves any image URL (including old /src/assets/images paths stored in localStorage)
 * into a production-safe bundled asset URL.
 */
export function resolveCarImage(url: string | null | undefined): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return VAN_IMAGES.fleetShowcase;
  }

  const cleanUrl = url.trim();

  // If already a data URL or external https (other than broken old ones)
  if (cleanUrl.startsWith('data:')) {
    return cleanUrl;
  }

  // Map known vehicle image tokens to bundled Vite assets
  const lower = cleanUrl.toLowerCase();
  if (lower.includes('hiace_12') || lower.includes('12-seater') || lower.includes('commuter')) {
    return VAN_IMAGES.hiace12;
  }
  if (lower.includes('carnival')) {
    return VAN_IMAGES.carnival;
  }
  if (lower.includes('estima')) {
    return VAN_IMAGES.estima;
  }
  if (lower.includes('renault') || lower.includes('master')) {
    return VAN_IMAGES.renaultMaster;
  }
  if (lower.includes('cargo') || lower.includes('hiace')) {
    return VAN_IMAGES.cargoVan;
  }
  if (lower.includes('fleet_showcase') || lower.includes('aussie_van')) {
    return VAN_IMAGES.fleetShowcase;
  }
  if (lower.includes('luxury_fleet')) {
    return VAN_IMAGES.luxuryShowcase;
  }

  // If path is root-relative (/images/... or /src/assets/images/...)
  return cleanUrl;
}
