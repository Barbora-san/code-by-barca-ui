import { basics } from "./basics";
import { forms } from "./forms";
import { display } from "./display";
import { feedback } from "./feedback";
import { overlays } from "./overlays";
import { navigation } from "./navigation";
import { dataCat, utils } from "./data";
import type { Category } from "./types";

export const CATEGORIES: Category[] = [basics, forms, display, feedback, overlays, navigation, dataCat, utils];
export type { Category, Doc } from "./types";
