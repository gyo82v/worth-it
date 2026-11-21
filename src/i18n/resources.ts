import enCommon from "./locales/en/common.json";
import itCommon from "./locales/it/common.json";
import esCommon from "./locales/es/common.json";
import frCommon from "./locales/fr/common.json";
import deCommon from "./locales/de/common.json";
import enHome from "./locales/en/home.json";
import itHome from "./locales/it/home.json";
import esHome from "./locales/es/home.json";
import frHome from "./locales/fr/home.json";
import deHome from "./locales/de/home.json";
import enEvaluation from "./locales/en/evaluation.json";
import itEvaluation from "./locales/it/evaluation.json";
import esEvaluation from "./locales/es/evaluation.json";
import frEvaluation from "./locales/fr/evaluation.json";
import deEvaluation from "./locales/de/evaluation.json";


export const resources = {
  en: {
    common: enCommon,
    home: enHome,
    evaluation: enEvaluation
  },
  it: {
    common: itCommon,
    home: itHome,
    evaluation: itEvaluation
  },
  es: {
    common: esCommon,
    home: esHome,
    evaluation: esEvaluation
  },
  fr: {
    common: frCommon,
    home: frHome,
    evaluation: frEvaluation
  },
  de: {
    common: deCommon,
    home: deHome,
    evaluation: deEvaluation
  },
} as const;