import { defineState } from "eve/context";

export interface Bike {
  make: string;
  model: string;
  wheelSize?: string;
  notes?: string;
}

export interface Garage {
  readonly bikes: Readonly<Record<string, Bike>>;
}

// A typed, named slot that survives across step and turn boundaries within a
// session. Read it with `garage.get()`, change it with `garage.update()`.
export const garage = defineState<Garage>("bikeshop.garage", () => ({
  bikes: {},
}));
