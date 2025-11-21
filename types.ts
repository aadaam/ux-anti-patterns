import React from 'react';

export enum DemoType {
  FORM_FROM_HELL = 'FORM_FROM_HELL',
  JARGON_FILE = 'JARGON_FILE',
  MODAL_FROM_NOWHERE = 'MODAL_FROM_NOWHERE',
  OVER_CELEBRATING_TODO = 'OVER_CELEBRATING_TODO',
  HIT_SAVE = 'HIT_SAVE',
  TABS_WONT_SWITCH = 'TABS_WONT_SWITCH',
  WAIT_FOREVER = 'WAIT_FOREVER',
  TABS_PARADE = 'TABS_PARADE',
  EMPTY_SPACES = 'EMPTY_SPACES',
  GHOST_IN_THE_SHELL = 'GHOST_IN_THE_SHELL',
  FILTER_BY_ONE = 'FILTER_BY_ONE',
  LIST_VS_TABLE = 'LIST_VS_TABLE',
}

export interface DemoConfig {
  id: DemoType;
  title: string;
  description: string;
  icon: React.FC<any>;
}

export type Mode = 'bad' | 'good' | 'bad_v2';