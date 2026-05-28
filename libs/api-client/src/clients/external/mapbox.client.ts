import { Injectable } from "@nestjs/common";
import { ServiceResponse } from "../../types";
import { BaseServiceClient } from "../base-service-client";

// Mapbox API Types
export interface GeocodeRequest {
  address: string;
  limit?: number;
  country?: string;
  proximity?: [number, number]; // [longitude, latitude]
}

export interface GeocodeResponse {
  features: Array<{
    id: string;
    type: string;
    place_name: string;
    geometry: {
      type: string;
      coordinates: [number, number]; // [longitude, latitude]
    };
    properties: Record<string, any>;
  }>;
}

export interface DirectionsRequest {
  coordinates: Array<[number, number]>; // Array of [longitude, latitude]
  profile?: "driving" | "walking" | "cycling";
  geometries?: "geojson" | "polyline" | "polyline6";
  overview?: "full" | "simplified" | "false";
}

export interface DirectionsResponse {
  routes: Array<{
    geometry: any;
    duration: number;
    distance: number;
    weight: number;
  }>;
  waypoints: Array<{
    name: string;
    location: [number, number];
  }>;
}

@Injectable()
export class MapboxClient extends BaseServiceClient {
  private readonly baseUrl = "https://api.mapbox.com";
  private readonly accessToken: string;

  constructor() {
    super();
    this.accessToken = process.env.MAPBOX_ACCESS_TOKEN || "";
    if (!this.accessToken) {
      throw new Error("MAPBOX_ACCESS_TOKEN environment variable is required");
    }
  }

  /**
   * Geocode an address to get coordinates
   * Usage: await mapboxClient.geocode({ address: '1600 Amphitheatre Parkway, Mountain View, CA' })
   */
  async geocode(
    request: GeocodeRequest,
  ): Promise<ServiceResponse<GeocodeResponse>> {
    const { address, limit = 5, country, proximity } = request;

    const params = new URLSearchParams({
      access_token: this.accessToken,
      limit: limit.toString(),
    });

    if (country) params.append("country", country);
    if (proximity) params.append("proximity", proximity.join(","));

    const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?${params}`;

    return this.get<GeocodeResponse>(url);
  }

  /**
   * Reverse geocode coordinates to get address
   * Usage: await mapboxClient.reverseGeocode({ longitude: -122.4194, latitude: 37.7749 })
   */
  async reverseGeocode(request: {
    longitude: number;
    latitude: number;
  }): Promise<ServiceResponse<GeocodeResponse>> {
    const { longitude, latitude } = request;

    const params = new URLSearchParams({
      access_token: this.accessToken,
    });

    const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${longitude},${latitude}.json?${params}`;

    return this.get<GeocodeResponse>(url);
  }

  /**
   * Get directions between multiple points
   * Usage: await mapboxClient.getDirections({ coordinates: [[-122.4194, 37.7749], [-122.4094, 37.7849]] })
   */
  async getDirections(
    request: DirectionsRequest,
  ): Promise<ServiceResponse<DirectionsResponse>> {
    const {
      coordinates,
      profile = "driving",
      geometries = "geojson",
      overview = "full",
    } = request;

    const coordinatesString = coordinates
      .map((coord) => coord.join(","))
      .join(";");

    const params = new URLSearchParams({
      access_token: this.accessToken,
      geometries,
      overview,
    });

    const url = `${this.baseUrl}/directions/v5/mapbox/${profile}/${coordinatesString}?${params}`;

    return this.get<DirectionsResponse>(url);
  }

  /**
   * Get static map image URL
   * Usage: const imageUrl = mapboxClient.getStaticMapUrl({ longitude: -122.4194, latitude: 37.7749, zoom: 15 })
   */
  getStaticMapUrl(request: {
    longitude: number;
    latitude: number;
    zoom?: number;
    width?: number;
    height?: number;
    retina?: boolean;
  }): string {
    const {
      longitude,
      latitude,
      zoom = 15,
      width = 600,
      height = 400,
      retina = false,
    } = request;
    const retinaString = retina ? "@2x" : "";

    return `${this.baseUrl}/styles/v1/mapbox/streets-v11/static/${longitude},${latitude},${zoom}/${width}x${height}${retinaString}?access_token=${this.accessToken}`;
  }
}
