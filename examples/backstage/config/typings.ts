import { ReactNode } from 'react';

export interface MenuDataItem {
  children?: MenuDataItem[];
  hideChildrenInMenu?: boolean;
  hideInMenu?: boolean;
  icon?: string;
  component?: ReactNode;
  locale?: string;
  name?: string;
  path: string;
  // eslint-disable-next-line
  [key: string]: any;
}
