export interface MakeupOptions {
  customPropertyPrefix?: string;
  contextClassNamePrefix?: string;
  contextKeyword?: string;
}

export type FinalMakeupOptions = Readonly<Required<MakeupOptions>>;

export const DEFAULT_OPTIONS: FinalMakeupOptions = Object.freeze({
  customPropertyPrefix: 'ember-makeup/cfg/',
  contextClassNamePrefix: 'ember-makeup/context/',
  contextKeyword: 'context'
});

export function computeOptions(options?: MakeupOptions): FinalMakeupOptions {
  if (options && typeof options === 'object') {
    return Object.assign({}, DEFAULT_OPTIONS, options);
  }

  return Object.assign({}, DEFAULT_OPTIONS);
}
