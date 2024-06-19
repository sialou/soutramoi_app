import { FormGroup } from '@angular/forms';
import { LngLatLike } from 'mapbox-gl';

export const DEFAULT_GEO_LOCATION: LngLatLike = [-3.9655, 5.2834];

export const hexToRGB = (hex: string, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const matchValidator = (passwords: string[]) => (form: FormGroup) => {
  const password = form.get(passwords[0]).value;
  const confirm = form.get(passwords[1]).value;

  if (password === confirm) {
    return null;
  }

  return {
    match: true,
  };
};
