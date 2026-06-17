import BatCasinoDemo from "./BatCasinoDemo";
import SheBeautyDemo from "./SheBeautyDemo";
import ZukcDrukDemo from "./ZukcDrukDemo";
import IgStealthDemo from "./IgStealthDemo";

export const DEMOS: Record<
  "batcasino" | "shebeauty" | "zukcdruk" | "igstealth",
  React.ComponentType
> = {
  batcasino: BatCasinoDemo,
  shebeauty: SheBeautyDemo,
  zukcdruk: ZukcDrukDemo,
  igstealth: IgStealthDemo,
};
