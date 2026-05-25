import * as propertyRepository from "@/server/repositories/property.repository";
import type { CreatePropertyInput } from "@/server/repositories/property.repository";

export const createListing = async (input: CreatePropertyInput) => {
  return propertyRepository.createProperty(input);
};

export const getPropertyBySlug = async (slug: string) => {
  return propertyRepository.findPropertyBySlug(slug);
};

export const getPropertyById = async (id: string) => {
  return propertyRepository.findPropertyById(id);
};

export const updateListing = async (
  id: string,
  patch: Partial<CreatePropertyInput>,
) => {
  return propertyRepository.updatePropertyById(id, patch);
};

export const removeListing = async (id: string) => {
  return propertyRepository.deletePropertyById(id);
};
