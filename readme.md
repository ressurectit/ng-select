[![npm version](https://badge.fury.io/js/%40anglr%2Fselect.svg)](https://badge.fury.io/js/%40anglr%2Fselect)
[![Build status](https://ci.appveyor.com/api/projects/status/rib22utc0ap6vrxc?svg=true)](https://ci.appveyor.com/project/kukjevov/ng-select)

# Angular Select

- [API](https://ressurectit.github.io/#/content/api/ng-select/select)
- [API Extensions](https://ressurectit.github.io/#/content/api/ng-select-extensions/select-extensions)
- [Samples](https://ressurectit.github.io/#/content/select#samples)

# `@anglr/select` — Source Overview

Angular component representing an HTML `<select>`. Fully plugin-based and signal-driven, with support for multi-select, live search, keyboard navigation, absolute positioning, and deep customisation via swappable plugins.

---

## Directory Structure

```
src/
├── components/       # ng-select, ng-option, ng-option-group
├── decorators/       # MergeOptionsAsSignal property decorator
├── directives/       # Structural/behavioural directives
├── interfaces/       # TypeScript contracts for all public APIs
├── misc/             # Enums, types, tokens, providers, utils, classes
├── modules/          # NgModule wrappers
├── pipes/            # Template pipes
└── plugins/          # Nine swappable plugin slots with implementations
```

---

## Components

| Selector | Class | Purpose |
|---|---|---|
| `ng-select` | `Select<TValue>` | Core select/dropdown component. Hosts all plugins, manages CSS classes and plugin lifecycle. |
| `ng-option` | `Option<TValue>` | Declarative option element. Holds `value` and `text` input signals plus `active`/`selected` state. |
| `ng-option-group` | `OptionGroup` | Declarative option group element. Holds a `text` input and an optional custom group-header template. |

---

## Directives

| Selector | Class | Purpose |
|---|---|---|
| `[normalStateTemplate]` | `NormalStateTemplate` | Custom template for the select's closed/normal state. |
| `[normalStateTagTemplate]` | `NormalStateTagTemplate` | Custom per-tag template in multi-select normal state. |
| `[optionGroupTemplate]` | `OptionGroupTemplate` | Custom group-header template inside `ng-option-group`. |
| `[optionTemplate]` | `OptionTemplate` | Custom template for each option in the popup dropdown. |
| `ng-select[absolute]` | `SelectAbsolute` | Appends the popup to `document.body` instead of inline. |
| `ng-select[formControlName\|formControl\|ngModel]` | `SelectControlValueAccessor` | Bridges `ng-select` to Angular's `ControlValueAccessor`. |
| `ng-select[edit]` | `SelectEdit` | Switches to editable/type-ahead mode (`EditNormalState` + `EditLiveSearch`). |
| `ng-select[formField]` | `SelectFormControl` | Integrates with signal-based forms (`FormValueControl`). |
| `ng-select[multiple]` | `SelectMultipleKeepPopup` | Keeps popup open after each selection (`closeOnSelect = false`). |
| `ng-select[noCarret]` | `SelectNoCarret` | Hides the dropdown caret arrow. |
| `ng-select[placeholder]` | `SelectPlaceholder` | Reactively sets the placeholder text via a signal input. |
| `ng-select[withDirectAccess]` | `WithDirectAccess` | Exposes a two-way `value` model signal for template binding without a form control. |

---

## Plugins

The select behaviour is split into nine independently swappable plugin slots:

| `SelectPluginType` | Default | Purpose |
|---|---|---|
| `Interactions` | `SimpleInteractions` | User interaction logic (open/close, option click). |
| `KeyboardHandler` | `SimpleKeyboardHandler` | Keyboard navigation and shortcut handling. |
| `LiveSearch` | `NoLiveSearch` | Live filtering of options as the user types. |
| `NormalState` | `SimpleNormalState` | Renders the select's closed/normal state. |
| `OptionsHandler` | `SimpleOptionsHandler` | Manages the available options list and filtering. |
| `Popup` | `SimplePopup` | Renders the dropdown popup. |
| `Positioner` | `CommonPositioner` | Positions the popup relative to the host element. |
| `ReadonlyState` | `SimpleNormalState` | Renders the select when `readonly = true`. |
| `ValueHandler` | `StaticValueHandler` | Stores, sets, and reads the current selected value. |

Swap a plugin by providing a different type via one of the provider factories (e.g. `provideNormalStateType(MyNormalState)`).

---

## Pipes

| Pipe name | Class | Purpose |
|---|---|---|
| `addNewOption` | `AddNewOption` | Returns the "add new option" prefix text for a synthetic option. |
| `displayValue` | `DisplayValue` | Transforms a selected option (or array) into a display string. |
| `getPlugin` | `GetPlugin` | Retrieves a typed plugin instance from the `selectPlugins` map. |
| `groupedListOptions` | `GroupedListOptions` | Converts a flat `SelectOptionState[]` into grouped tuples for rendering. |
| `hasValue` | `HasValue` | Returns `true` when an option or array of options constitutes a selected value. |
| `optionCssClasses` | `OptionCssClasses` | Returns the CSS class array for a popup option (selected, active, grouped). |

---

## Interfaces

Key contracts defined under `src/interfaces/`:

| Interface | Purpose |
|---|---|
| `SelectApi` | Public API of the select: `initialized`, `selectOptions`, `events`, `getPlugin()`, `execute()`, `executeAndReturn()`. |
| `SelectOptions` | Full configuration of the select (plugins, CSS classes, display/value/text functions, etc.). |
| `SelectPlugin` | Base for all plugins; grants access to the `selectPlugins` map. |
| `SelectEvents` | Signal-based event streams on the select. |
| `SelectOption` | Single option data: `value`, `text`, and `group` signals. |
| `SelectOptionState` | Extends `SelectOption` with `active`, `selected`, and `index`. |
| `SelectOptionStateSyntetic` | Extends `SelectOptionState` with a `created` flag (add-new-option UX). |
| `SelectOptionGroup` | Group metadata: `id`, `text`, `index`, optional `template`. |
| `NormalStateContext` | Template context for custom normal-state rendering. |
| `NormalStateTagContext` | Template context for individual-tag rendering in multi-select. |
| `PopupContext` | Template context for custom option rendering in the popup. |
| `PluginDescription` | Pairs a plugin `type` with optional `options`. |

---

## Misc

### `enums.ts`
`SelectPluginType` — string enum naming all nine plugin slots.

### `types.ts`
Function and action aliases used throughout the library, including `SelectAction`, `SelectFunction`, `DisplayTextFunc`, `ValueEqualityFunc`, `TextComparerFunc`, `OptionGetterFunc`, and `NewOptionGetterFunc`.

### `tokens.ts`
One `InjectionToken` per plugin type and its options object, e.g. `SELECT_OPTIONS`, `NORMAL_STATE_TYPE`, `NORMAL_STATE_OPTIONS`.

### `providers.ts`
Convenience provider factories that wrap each token: `provideSelectOptions()`, `provideNormalStateType()`, `providePopupType()`, etc.

### `utils.ts`
Internal helpers: `compareValueAndOption()`, `compareSelectOptions()`, `togglePopup()`, `selectOption()`.

### `misc/classes/`

| Class | Purpose |
|---|---|
| `SelectBus` | Central reactive bus (signals) shared between the select and all plugins. |
| `SelectPluginInstances` | Live plugin references keyed by `SelectPluginType`. |
| `CodeOptionsGatherer` | `OptionsGatherer` implementation for supplying options programmatically. |

---

## Decorators

| Decorator | Purpose |
|---|---|
| `MergeOptionsAsSignal` | Property decorator that creates a `WritableSignal` and deep-merges partial options objects via `deepCopyWithArrayOverride`. Used on `Select.selectOptions` to make options reactive. |

---

## Modules

| Module | Purpose |
|---|---|
| `SelectModule` | Classic `NgModule` that declares and exports `Select`, `Option`, and `OptionGroup` for apps not using standalone imports. |
| `SelectEditModule` | `NgModule` that additionally includes the `SelectEdit` directive and its required plugins. |
