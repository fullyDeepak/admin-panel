import { CSSObjectWithLabel } from 'react-select';

export function dropdownOptionStyle(base: CSSObjectWithLabel) {
  return {
    ...base,
    paddingTop: '1px',
    paddingBottom: '1px',
    fontSize: 14,
  };
}
