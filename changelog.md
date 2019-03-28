# Changelog

## Version 6.0.0-beta

- initial version of new `NgSelectComponent`
- SSR support
- Angular IVY ready (APF compliant package)
- added support for ES2015 compilation
- new `NgSelectComponent` is modular with support of several plugins
   - selectors for component are `ng-select`, `ng-option`, `ng-optgroup`
- supported plugins
   - `KeyboardHandler` plugin, allows handling of keyboard events
   - `LiveSearch` plugin, allows user to filter options
      - `NoLiveSearchComponent` used when there is no need for *live search*, default
      - `BasicLiveSearchComponent` used when you want basic live search input
   - `NormalState` plugin, represents normal state of `NgSelect` which you can see
   - `Popup` plugin, represents popup with options
   - `Positioner` plugin, allows positioning of `Popup`
   - `ReadonlyState` plugin, if specified allows special look of readonly, disabled state of `NgSelect`, defaults to readonly `NormalState`
   - `TextsLocator` plugin, used for obtaining texts that are displayed
   - `ValueHandler` plugin, represents internal state of value in `NgSelect` and handling of value changes
      - `BasicValueHandlerComponent` allows only values that exists in options, default
      - `DynamicValueHandlerComponent` allows any value, even values non existing in options, best used for dynamically loaded options
- `OptionsGatherer` used for obtaining options, defaults to `NgSelectComponent` itself, allows obtaining *options* as `ContentChildren`
   - `DynamicOptionsGatherer` used for obtaining options dynamically, best with combination of *live search*
   - `CodeOptionsGatherer` used for obtaining *static* options but directly from code, not from html template
- `TemplateGatherer` allows gathering custom templates, defaults to `NgSelect` using `ContentChild`
   - `optionTemplate` - template that allows changing look of option content
   - `normalStateTemplate` - template that allows changing look of normal state content
- `NgSelect` support *extensions* that can execute some code over `NgSelect` and its *plugins*
   - `getValue` extension allows obtaining of current value of `NgSelect`
   - `onFocus` extension allows registration of callback when `NgSelect` gains focus
   - `reinitializeOptions` extension allows reinitialization of `selectOptions`
   - `setReadonly` extension allows changing state of `NgSelect`, readonly or normal
   - `setValue` extension allows changing current value of `NgSelect`
   - `valueChange` extension allows registration of callback when `NgSelect` value changes