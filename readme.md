[![npm version](https://badge.fury.io/js/%40anglr%2Fselect.svg)](https://badge.fury.io/js/%40anglr%2Fselect)
[![Build status](https://ci.appveyor.com/api/projects/status/rib22utc0ap6vrxc?svg=true)](https://ci.appveyor.com/project/kukjevov/ng-select)

# @anglr/select

Angular component representing an HTML `<select>`. Fully plugin-based and signal-driven, with support for multi-select, live search, keyboard navigation, absolute positioning, and deep customisation via swappable plugins.

- [Resources](#resources)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Components](#components)
  - [Select](#select)
  - [Option](#option)
  - [OptionGroup](#optiongroup)
- [Form Integration](#form-integration)
  - [Reactive Forms (FormControl)](#reactive-forms-formcontrol)
  - [Signal Forms (FormField)](#signal-forms-formfield)
  - [Two-way Binding (withDirectAccess)](#two-way-binding-withdirectaccess)
- [Directives](#directives)
- [Plugins](#plugins)
  - [Plugin Architecture](#plugin-architecture)
  - [Available Plugins](#available-plugins)
  - [Configuring Plugins](#configuring-plugins)
  - [Implementing a Custom Plugin](#implementing-a-custom-plugin)
- [Extensions](#extensions)
- [Pipes](#pipes)
- [Styling](#styling)
  - [Setup](#setup)
  - [Themes](#themes)
  - [CSS Custom Properties](#css-custom-properties)
  - [Customizing a Theme](#customizing-a-theme)
  - [Building a Custom Theme](#building-a-custom-theme)
  - [Overriding Styles in Components](#overriding-styles-in-components)
- [Samples](#samples)
  - [Basic Select](#basic-select)
  - [Multiple Select](#multiple-select)
  - [Edit / Type-ahead Mode](#edit--type-ahead-mode)
  - [Live Search (Filter)](#live-search-filter)
  - [Custom Templates](#custom-templates)
  - [Lazy / Dynamic Options](#lazy--dynamic-options)
  - [Dynamic Options with Remote Data](#dynamic-options-with-remote-data)
  - [Dynamic Option Getter (Object Values)](#dynamic-option-getter-object-values)
  - [Absolute Popup](#absolute-popup)
  - [Popover Popup](#popover-popup)
  - [Cancel Value](#cancel-value)
  - [Hide Caret](#hide-caret)
  - [Add New Option](#add-new-option)
  - [Readonly](#readonly)
  - [Custom Readonly State](#custom-readonly-state)
  - [Styling Override](#styling-override)

## Resources

- **API reference**: https://ressurectit.github.io/#/content/api/ng-select/select
- **API extensions reference**: https://ressurectit.github.io/#/content/api/ng-select-extensions/select-extensions
- **Live samples**: https://ressurectit.github.io/#/content/select#samples

## Installation

```bash
npm install @anglr/select
```

**Peer dependencies**: `@angular/core`, `@angular/common`, `@angular/forms`, `@anglr/common`, `@jscrpt/common`, `@css-styles/common`, `rxjs`, `lodash-es`.

---

## Quick Start

Import the standalone components directly (no module required):

```typescript
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {form, FormField} from '@angular/forms/signals';
import {Select, Option, SelectFormControl} from '@anglr/select';

@Component(
{
    template: `
        <ng-select [formField]="myField">
            <ng-option value="a" text="Option A"/>
            <ng-option value="b" text="Option B"/>
            <ng-option value="c" text="Option C"/>
        </ng-select>
    `,
    imports:
    [
        Select,
        Option,
        FormField,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent
{
    protected myField = form(signal<string|null>(null));
}
```

---

## Components

### Select

**Selector**: `ng-select`

The root component. It manages the plugin lifecycle, template gathering, and options gathering.

| Input | Type | Description |
|---|---|---|
| `[selectOptions]` | `RecursivePartial<SelectOptions>` | Full configuration object (plugins, CSS classes, behaviour flags) |
| `[disabled]` | `boolean` | Signal-based disabled state |
| `[readonly]` | `boolean` | Signal-based readonly state |

| Property | Type | Description |
|---|---|---|
| `initialized` | `Signal<boolean>` | Emits `true` once every plugin is ready |
| `events` | `SelectEvents` | Observable streams for `focus`, `click`, `blur` |
| `availableOptions` | `Signal<SelectOptionState[]>` | Current list of `<ng-option>` children |

| Method | Returns | Description |
|---|---|---|
| `getPlugin(type)` | `SelectPlugin` | Retrieve a live plugin instance by `SelectPluginType` |
| `execute(...actions)` | `void` | Run one or more `SelectAction` lambdas |
| `executeAndReturn(fn)` | `TResult` | Run a `SelectFunction` and return its result |

### Option

**Selector**: `ng-option`

Declares a single selectable option inside `<ng-select>`.

| Input | Type | Description |
|---|---|---|
| `[value]` | `TValue` | The value stored when selected |
| `[text]` | `string` | Display text |

### OptionGroup

**Selector**: `ng-option-group`

Groups `<ng-option>` children under a labelled header.

| Input | Type | Description |
|---|---|---|
| `[text]` | `string` | **(required)** Group label text |

```html
<ng-select [formField]="field">
    <ng-option-group text="Fruits">
        <ng-option value="apple" text="Apple"/>
        <ng-option value="banana" text="Banana"/>
    </ng-option-group>
    <ng-option-group text="Vegetables">
        <ng-option value="carrot" text="Carrot"/>
        <ng-option value="pea" text="Pea"/>
    </ng-option-group>
</ng-select>
```

---

## Form Integration

### Reactive Forms (FormControl)

Use the `SelectControlValueAccessor` directive. It activates automatically on `ng-select[formControl]`, `ng-select[formControlName]`, or `ng-select[ngModel]`.

```typescript
import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Select, Option, SelectControlValueAccessor} from '@anglr/select';

@Component(
{
    template: `
        <ng-select [formControl]="ctrl">
            <ng-option value="a" text="A"/>
            <ng-option value="b" text="B"/>
        </ng-select>
    `,
    imports:
    [
        Select,
        Option,
        ReactiveFormsModule,
        SelectControlValueAccessor,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent
{
    protected ctrl: FormControl<string|null> = new FormControl<string|null>(null);
}
```

### Signal Forms (FormField)

Use the `SelectFormControl` directive with Angular's signal-based `form()` / `FormField`:

```typescript
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {form, FormField} from '@angular/forms/signals';
import {Select, Option, SelectFormControl} from '@anglr/select';

@Component(
{
    template: `
        <ng-select [formField]="myField">
            <ng-option value="x" text="X"/>
            <ng-option value="y" text="Y"/>
        </ng-select>
        <div>Value: {{ myField().value() | json }}</div>
    `,
    imports:
    [
        Select,
        Option,
        FormField,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent
{
    protected myField = form(signal<string|null>(null));
}
```

### Two-way Binding (withDirectAccess)

Use the `withDirectAccess` directive for simple two-way model binding without a form layer:

```typescript
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {Select, Option} from '@anglr/select';

@Component(
{
    template: `
        <ng-select [(value)]="selectedValue" withDirectAccess>
            <ng-option value="a" text="A"/>
        </ng-select>
    `,
    imports:
    [
        Select,
        Option,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent
{
    protected selectedValue = signal<string|null>(null);
}
```

---

## Directives

| Directive | Selector | Description |
|---|---|---|
| `SelectControlValueAccessor` | `ng-select[formControl]`, `ng-select[formControlName]`, `ng-select[ngModel]` | Bridges to Angular reactive/template-driven forms |
| `SelectFormControl` | `ng-select[formField]` | Bridges to Angular signal-based forms |
| `SelectEdit` | `ng-select[edit]` | Enables type-ahead / editable mode (swaps to `EditNormalState` + `EditLiveSearch`) |
| `SelectAbsolute` | `ng-select[absolute]` | Appends popup to `document.body` for overflow-safe positioning |
| `SelectMultipleKeepPopup` | `ng-select[multiple]` | Keeps popup open after each selection in multi-select mode |
| `SelectPlaceholder` | `ng-select[placeholder]` | Sets placeholder text reactively |
| `SelectNoCarret` | `ng-select[noCarret]` | Hides the dropdown caret |
| `NormalStateTemplate` | `[normalStateTemplate]` | Custom template for the closed/normal state display |
| `NormalStateTagTemplate` | `[normalStateTagTemplate]` | Custom template for individual tags in multi-select normal state |
| `OptionTemplate` | `[optionTemplate]` | Custom template for each option in the popup |
| `OptionGroupTemplate` | `[optionGroupTemplate]` | Custom template for option group headers |
| `WithDirectAccess` | `ng-select[withDirectAccess]` | Two-way value binding without a form control |

---

## Plugins

### Plugin Architecture

The select component is composed of **9 independent plugin slots**. Each slot has a default implementation that can be swapped for an alternative or custom one. Plugins communicate via a shared `SelectBus` — a centralized reactive bus with subjects/observables for events like option activation, popup show/hide, keyboard actions, etc.

```
┌─────────────────────────────────────────────┐
│                  ng-select                  │
│                                             │
│  ┌──────────────┐  ┌────────────────────┐   │
│  │  LiveSearch   │  │   Interactions     │   │
│  └──────────────┘  └────────────────────┘   │
│  ┌──────────────┐  ┌────────────────────┐   │
│  │OptionsHandler│  │  KeyboardHandler   │   │
│  └──────────────┘  └────────────────────┘   │
│  ┌──────────────┐  ┌────────────────────┐   │
│  │  Positioner   │  │   ValueHandler     │   │
│  └──────────────┘  └────────────────────┘   │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │          Visual Container            │   │
│  │  ┌──────────┐ ┌───────┐ ┌───────┐   │   │
│  │  │ReadonlyS.│ │Normal │ │ Popup │   │   │
│  │  └──────────┘ │ State │ │       │   │   │
│  │               └───────┘ └───────┘   │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

Every plugin implements the `SelectPlugin` base interface and receives:

- `selectPlugins` — references to all sibling plugin instances
- `pluginElement` — its own host `ElementRef`
- `options` — merged configuration object
- `selectBus` — the shared reactive bus

### Available Plugins

| Slot | Default | Alternatives | Purpose |
|---|---|---|---|
| **Interactions** | `SimpleInteractions` | — | Click-to-toggle, option click, click-outside handling |
| **KeyboardHandler** | `SimpleKeyboardHandler` | — | Arrow keys, Enter, Backspace, alphanumeric search |
| **LiveSearch** | `NoLiveSearch` | `FilterLiveSearch`, `EditLiveSearch` | Text-based filtering of options |
| **NormalState** | `SimpleNormalState` | `EditNormalState` | Closed-state appearance (value, caret, cancel button) |
| **OptionsHandler** | `SimpleOptionsHandler` | `NoOptionsHandler` | Options list management, filtering, add-new-option |
| **Popup** | `SimplePopup` | — | Dropdown panel rendering |
| **Positioner** | `CommonPositioner` | `PopoverPositioner`, `NoPositioner` | Popup positioning (z-index, absolute, popover API) |
| **ReadonlyState** | *(same as NormalState)* | Custom component | Display when readonly |
| **ValueHandler** | `StaticValueHandler` | `DynamicValueHandler` | Selected value storage, single/multi-select logic |

### Configuring Plugins

Pass a `[selectOptions]` object to override plugin types and/or their options. Partial objects are deep-merged with defaults:

```typescript
import {FilterLiveSearch, SelectOptions} from '@anglr/select';
import {RecursivePartial} from '@jscrpt/common';

const options: RecursivePartial<SelectOptions> =
{
    plugins:
    {
        liveSearch:
        {
            type: FilterLiveSearch,
        },
        popup:
        {
            options:
            {
                liveSearchEnabled: true,
            },
        },
    },
};
```

```html
<ng-select [selectOptions]="options" [formField]="field">
    <ng-option value="a" text="Alpha"/>
</ng-select>
```

You can also swap plugin types via dependency injection providers:

```typescript
import {provideNormalStateType, EditNormalState} from '@anglr/select';

@Component(
{
    providers:
    [
        provideNormalStateType(EditNormalState),
    ],
})
```

### Implementing a Custom Plugin

To create a custom plugin, implement the corresponding plugin interface and register it via `selectOptions` or a provider.

**Example: Custom ReadonlyState Plugin**

A custom readonly state that renders selected values differently.

```typescript
import {Component, ChangeDetectionStrategy, ElementRef} from '@angular/core';
import {ReadonlyState, ReadonlyStateOptions, SelectBus, SelectPluginInstances} from '@anglr/select';

@Component(
{
    selector: 'custom-readonly-state',
    template: `
        <div class="custom-readonly">
            @if (selectBus.selectedOptions(); as selected) {
                @if (isArray(selected)) {
                    @for (opt of selected; track opt.index) {
                        <span class="tag">{{ opt.text() }}</span>
                    }
                } @else {
                    <span>{{ selected.text() }}</span>
                }
            } @else {
                <em>No value selected</em>
            }
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomReadonlyStateComponent implements ReadonlyState<unknown, unknown>
{
    public readonly selectPlugins!: SelectPluginInstances<unknown, unknown>;
    public readonly pluginElement!: ElementRef<HTMLElement>;
    public options!: ReadonlyStateOptions;
    public readonly selectBus!: SelectBus<unknown, unknown>;

    protected isArray = Array.isArray;

    public focus(): void
    {
        // no-op for readonly
    }
}
```

**Register the custom plugin:**

```typescript
this.selectOptions =
{
    plugins:
    {
        readonlyState:
        {
            type: CustomReadonlyStateComponent,
        },
    },
};
```

```html
<ng-select [selectOptions]="selectOptions" [formField]="field">
    <ng-option value="a" text="A"/>
</ng-select>
```

**Example: Custom OptionsHandler Plugin**

You can extend `OptionsHandlerBase` to add custom filtering logic:

```typescript
import {Component} from '@angular/core';
import {OptionsHandlerBase} from '@anglr/select';

@Component(
{
    selector: 'custom-options-handler',
    template: '',
})
export class CustomOptionsHandlerComponent extends OptionsHandlerBase<string>
{
    // Override filtering, sorting, or add-new-option logic
}
```

---

## Extensions

The `@anglr/select/extensions` entry point provides helper functions for programmatic interaction with the select via `execute()` / `executeAndReturn()`:

```typescript
import {getSearch, getValue, setReadonly, setValue} from '@anglr/select/extensions';
```

| Function | Type | Description |
|---|---|---|
| `getValue()` | `SelectFunction` | Returns the current value (reactive) |
| `setValue(value)` | `SelectAction` | Sets the select's value programmatically |
| `getSearch()` | `SelectFunction` | Returns the current live-search text (reactive) |
| `setReadonly(flag?)` | `SelectAction` | Sets the select to readonly mode |

**Usage:**

```typescript
// Get the current value
const value = this.select().executeAndReturn(getValue());

// Set a value programmatically
this.select().execute(setValue('option-a'));

// Get current search text (in an effect for reactivity)
effect(() =>
{
    const search = this.select().executeAndReturn(getSearch());
    // fetch remote data based on search...
});
```

---

## Pipes

| Pipe | Pure | Description |
|---|---|---|
| `displayValue` | No | Transforms `SelectOption` or `SelectOption[]` into a display string |
| `hasValue` | Yes | Returns `true` when the option(s) represent a selected value |
| `getPlugin` | Yes | Retrieves a typed plugin instance from another plugin |
| `addNewOption` | Yes | Produces the "add new option" label for synthetic options |
| `groupedListOptions` | Yes | Converts a flat option list into grouped tuples for rendering |
| `optionCssClasses` | No | Returns CSS class array for a popup option (selected, active, grouped) |

---

## Styling

### Setup

The library ships pre-built SCSS that uses CSS custom properties for theming. Import styles in your global stylesheet:

```scss
// Import the light theme (includes core CSS + variables)
@use '@anglr/select/styles/themes/light' as selectLight;

// Apply the theme
@include selectLight.buildTheme();
```

Or for the dark theme:

```scss
@use '@anglr/select/styles/themes/dark' as selectDark;

@include selectDark.buildTheme();
```

### Themes

Two pre-built themes are included:

| Theme | Import Path | Description |
|---|---|---|
| **Light** | `@anglr/select/styles/themes/light` | Light grays, blue focus, black text |
| **Dark** | `@anglr/select/styles/themes/dark` | Dark grays, blue focus, white text |

Each theme exposes:
- `defineTheme($fontSize, $theme, $customization)` — returns a theme map
- `buildTheme()` — applies the theme to the document

### CSS Custom Properties

All visual aspects are driven by CSS custom properties. Here are the key ones:

**Normal State**

| Property | Default (Light) | Description |
|---|---|---|
| `--select-normalState-borderColor` | `#666` | Border color |
| `--select-normalState-background` | `#eee` | Background color |
| `--select-normalState-foreground` | `#000` | Text color |
| `--select-normalState-borderRadius` | `4px` | Corner rounding |
| `--select-normalState-padding` | `1px 2px` | Inner padding |
| `--select-normalState-focus-borderColor` | `#0066ff` | Focus border |
| `--select-normalState-focus-outlineColor` | `#0066ff` | Focus outline |
| `--select-normalState-tag-background` | `#ccc` | Multi-select tag background |
| `--select-normalState-tag-foreground` | `#000` | Multi-select tag text |
| `--select-normalState-disabled-background` | *(derived)* | Disabled background |

**Popup**

| Property | Default (Light) | Description |
|---|---|---|
| `--select-popup-container-background` | `#F0F0F0` | Popup background |
| `--select-popup-container-foreground` | `#000` | Popup text color |
| `--select-popup-container-borderColor` | `#acacac` | Popup border |
| `--select-popup-option-active-background` | *(derived from container)* | Hovered option |
| `--select-popup-option-selected-background` | *(derived from container)* | Selected option |

**Live Search**

| Property | Default (Light) | Description |
|---|---|---|
| `--select-liveSearch-placeholder-foreground` | `#000` | Placeholder color |

### Customizing a Theme

Override specific values when calling `defineTheme`:

```scss
@use '@anglr/select/styles/themes/light' as selectLight;
@use '@anglr/select/styles/core/mixins' as selectMixins;

$myTheme: selectLight.defineTheme(
    $fontSize: 16px,
    $customization: (
        select: (
            normalState: (
                borderColor: #999,
                background: #fff,
                foreground: #333,
                borderRadius: 8px,
                focus: (
                    borderColor: #ff6600,
                    outlineColor: #ff6600,
                ),
                tag: (
                    background: #e0e0e0,
                    borderRadius: 12px,
                ),
            ),
            popup: (
                container: (
                    background: #fff,
                    borderColor: #ddd,
                    borderRadius: 8px,
                ),
            ),
        ),
    ),
);

@include selectMixins.buildTheme($myTheme);
```

### Building a Custom Theme

Create a theme from scratch using the `defineTheme` function from the default theme:

```scss
@use '@anglr/select/styles/core/defaultTheme' as selectDefault;
@use '@anglr/select/styles/core/mixins' as selectMixins;

$customTheme: selectDefault.defineTheme(
    $fontSize: 14px,
    $theme: (
        select: (
            normalState: (
                borderColor: #3498db,
                background: #ecf0f1,
                foreground: #2c3e50,
                focus: (
                    borderColor: #2980b9,
                    outlineColor: #2980b9,
                ),
            ),
            popup: (
                container: (
                    background: #ecf0f1,
                    foreground: #2c3e50,
                    borderColor: #bdc3c7,
                ),
            ),
        ),
    ),
);

@include selectMixins.buildTheme($customTheme);
```

### Overriding Styles in Components

For component-scoped overrides, wrap the select in a container and override CSS custom properties:

```html
<div class="select-override">
    <ng-select [formField]="field">
        <ng-option value="a" text="A"/>
    </ng-select>
</div>
```

```scss
.select-override {
    --select-normalState-borderColor: tomato;
    --select-normalState-background: lightyellow;
    --select-normalState-focus-borderColor: red;
    --select-popup-container-background: lightyellow;
}
```

---

## Samples

### Basic Select

Minimal select with reactive forms:

```typescript
// basic.component.ts
import {Component, ChangeDetectionStrategy} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Option, Select, SelectControlValueAccessor} from '@anglr/select';

@Component(
{
    selector: 'basic-sample',
    templateUrl: 'basic.component.html',
    imports:
    [
        Select,
        Option,
        JsonPipe,
        ReactiveFormsModule,
        SelectControlValueAccessor,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicSampleComponent
{
    protected selectControl: FormControl<string|null> = new FormControl<string|null>(null);
}
```

```html
<!-- basic.component.html -->
<div>Value: {{ selectControl.value | json }}</div>

<ng-select [formControl]="selectControl">
    <ng-option value="first" text="First value text"/>
    <ng-option value="second" text="Second value text"/>
    <ng-option value="third" text="Third value text"/>
    <ng-option value="fourth" text="Fourth value text"/>
    <ng-option value="fifth" text="Fifth value text"/>
</ng-select>
```

### Multiple Select

Multi-select with signal forms. The `multiple` attribute enables multi-selection, and `SelectMultipleKeepPopup` keeps the popup open after each pick:

```typescript
// multiple.component.ts
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {Option, Select, SelectFormControl, SelectMultipleKeepPopup} from '@anglr/select';

@Component(
{
    selector: 'multiple-sample',
    templateUrl: 'multiple.component.html',
    imports:
    [
        Select,
        Option,
        JsonPipe,
        FormField,
        SelectFormControl,
        SelectMultipleKeepPopup,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleSampleComponent
{
    protected selectField = form(signal<string|null>(null));
}
```

```html
<!-- multiple.component.html -->
<div>Value: {{ selectField().value() | json }}</div>

<ng-select multiple [formField]="selectField">
    <ng-option value="first" text="First value text"/>
    <ng-option value="second" text="Second value text"/>
    <ng-option value="third" text="Third value text"/>
    <ng-option value="fourth" text="Fourth value text"/>
    <ng-option value="fifth" text="Fifth value text"/>
</ng-select>
```

### Edit / Type-ahead Mode

Add the `edit` directive for a type-ahead experience. Works for both single and multi-select:

```typescript
// edit.component.ts
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {Option, Select, SelectEdit, SelectFormControl, SelectMultipleKeepPopup} from '@anglr/select';

@Component(
{
    selector: 'edit-sample',
    templateUrl: 'edit.component.html',
    imports:
    [
        Select,
        Option,
        JsonPipe,
        FormField,
        SelectEdit,
        SelectFormControl,
        SelectMultipleKeepPopup,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditSampleComponent
{
    protected selectField = form(signal<string|null>(null));
    protected selectMultipleField = form(signal<string[]|null>([]));
}
```

```html
<!-- edit.component.html -->
<!-- Single edit -->
<ng-select [formField]="selectField" edit>
    <ng-option value="first" text="First value text"/>
    <ng-option value="second" text="Second value text"/>
    <ng-option value="third" text="Third value text"/>
</ng-select>

<!-- Multiple edit -->
<ng-select multiple [formField]="selectMultipleField" edit>
    <ng-option value="first" text="First value text"/>
    <ng-option value="second" text="Second value text"/>
    <ng-option value="third" text="Third value text"/>
</ng-select>
```

### Live Search (Filter)

Enable a filter text input inside the popup using `FilterLiveSearch`:

```typescript
// liveSearch.component.ts
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {Option, Select, SelectOptions, FilterLiveSearch, SelectFormControl} from '@anglr/select';
import {RecursivePartial} from '@jscrpt/common';

@Component(
{
    selector: 'live-search-sample',
    templateUrl: 'liveSearch.component.html',
    imports:
    [
        Select,
        Option,
        JsonPipe,
        FormField,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveSearchSampleComponent
{
    protected selectField = form(signal<string|null>(null));

    protected selectOptions: RecursivePartial<SelectOptions> =
    {
        plugins:
        {
            popup:
            {
                options:
                {
                    liveSearchEnabled: true,
                },
            },
            liveSearch:
            {
                type: FilterLiveSearch,
            },
        },
    };
}
```

```html
<!-- liveSearch.component.html -->
<div>Value: {{ selectField().value() | json }}</div>

<ng-select [selectOptions]="selectOptions" [formField]="selectField">
    <ng-option value="first" text="First value text"/>
    <ng-option value="second" text="Second value text"/>
    <ng-option value="third" text="Third value text"/>
    <ng-option value="fourth" text="Fourth value text"/>
    <ng-option value="fifth" text="Fifth value text"/>
</ng-select>
```

### Custom Templates

Use `[normalStateTemplate]` and `[optionTemplate]` to completely customize rendering:

```typescript
// customTemplate.component.ts
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {DisplayValue, NormalStateTemplate, Option, OptionTemplate, Select, SelectFormControl} from '@anglr/select';

@Component(
{
    selector: 'custom-template-sample',
    templateUrl: 'customTemplate.component.html',
    imports:
    [
        Select,
        Option,
        JsonPipe,
        FormField,
        DisplayValue,
        OptionTemplate,
        SelectFormControl,
        NormalStateTemplate,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomTemplateSampleComponent
{
    protected selectField = form(signal<string|null>(null));
}
```

```html
<!-- customTemplate.component.html -->
<div>Value: {{ selectField().value() | json }}</div>

<ng-select [formField]="selectField">
    <ng-option value="first" text="First value text"/>
    <ng-option value="second" text="Second value text"/>
    <ng-option value="third" text="Third value text"/>
    <ng-option value="fourth" text="Fourth value text"/>
    <ng-option value="fifth" text="Fifth value text"/>

    <!-- Custom normal state: shows arrows around the display value -->
    <span *normalStateTemplate="let normalState">
        =&gt; {{ normalState.selectBus.selectedOptions() | displayValue }} &lt;=
    </span>

    <!-- Custom option template: shows value and text -->
    <span *optionTemplate="let option">
        {{ option.value() }} - {{ option.text() }}
    </span>
</ng-select>
```

### Lazy / Dynamic Options

Options can be loaded asynchronously. Use signals and `@for` to render them once loaded:

```typescript
// basicLazy.component.ts
import {Component, ChangeDetectionStrategy, WritableSignal, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {Option, Select, SelectFormControl} from '@anglr/select';

interface KodPopisValue
{
    kod: string;
    popis: string;
}

@Component(
{
    selector: 'basic-lazy-sample',
    templateUrl: 'basicLazy.component.html',
    imports:
    [
        Select,
        Option,
        JsonPipe,
        FormField,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicLazySampleComponent
{
    protected selectField = form(signal<string|null>(null));
    protected lazyOptions: WritableSignal<KodPopisValue[]> = signal([]);

    constructor()
    {
        // Simulate async loading
        setTimeout(() =>
        {
            this.lazyOptions.set([
                {kod: 'first', popis: 'First value text'},
                {kod: 'second', popis: 'Second value text'},
                {kod: 'third', popis: 'Third value text'},
            ]);
        }, 2500);
    }
}
```

```html
<!-- basicLazy.component.html -->
<div>Value: {{ selectField().value() | json }}</div>

<ng-select [formField]="selectField">
    @for (option of lazyOptions(); track option) {
        <ng-option [value]="option.kod" [text]="option.popis"/>
    }
</ng-select>
```

### Dynamic Options with Remote Data

Use `CodeOptionsGatherer` + `DynamicValueHandler` + `FilterLiveSearch` to load options from a remote API:

```typescript
// dynamic.component.ts
import {Component, ChangeDetectionStrategy, effect, Signal, viewChild, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {CodeOptionsGatherer, DynamicValueHandler, DynamicValueHandlerOptions, FilterLiveSearch, Select, SelectFormControl, SelectOption, SelectOptions} from '@anglr/select';
import {getSearch} from '@anglr/select/extensions';
import {RecursivePartial} from '@jscrpt/common';

@Component(
{
    selector: 'dynamic-sample',
    templateUrl: 'dynamic.component.html',
    imports:
    [
        Select,
        JsonPipe,
        FormField,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicSampleComponent
{
    protected optionsGatherer: CodeOptionsGatherer<string> = new CodeOptionsGatherer<string>();
    protected selectField = form(signal<string|null>(null));
    protected select: Signal<Select<string>> = viewChild.required<Select<string>>('select');

    protected selectOptions: RecursivePartial<SelectOptions<string>> =
    {
        plugins:
        {
            liveSearch:
            {
                type: FilterLiveSearch,
            },
            valueHandler:
            {
                type: DynamicValueHandler,
                options: {} as DynamicValueHandlerOptions<string>,
            },
        },
        optionsGatherer: this.optionsGatherer,
    };

    constructor(private dataSvc: DataService)
    {
        effect(async () =>
        {
            const search = this.select().executeAndReturn(getSearch());
            const result = await this.dataSvc.search(search);

            this.optionsGatherer.setAvailableOptions(
                result.map(item =>
                ({
                    value: signal(item.id),
                    text: signal(item.name),
                    group: signal(null),
                })),
            );
        });
    }
}
```

```html
<!-- dynamic.component.html -->
<div>Value: {{ selectField().value() | json }}</div>

<ng-select #select [selectOptions]="selectOptions" [formField]="selectField"/>
```

### Dynamic Option Getter (Object Values)

When values are objects and you need to resolve them back from a server (e.g., when setting an initial value), use `DynamicValueHandlerOptions.optionGetter`:

```typescript
this.selectOptions =
{
    valueExtractor: itm => itm.value()?.kod ?? '',
    plugins:
    {
        valueHandler:
        {
            type: DynamicValueHandler,
            options:
            {
                optionGetter: async (value) =>
                {
                    const result = await lastValueFrom(dataSvc.getDetail(value));

                    return result
                        ? {
                              group: signal(null),
                              text: signal(result.name),
                              value: signal({kod: result.kod, label: result.name}),
                          }
                        : null;
                },
            },
        },
    },
    optionsGatherer: this.optionsGatherer,
};
```

### Absolute Popup

Use the `absolute` directive to render the popup as a direct child of `<body>`, preventing clipping by `overflow: hidden` containers:

```html
<ng-select [formField]="field" absolute>
    <ng-option value="a" text="A"/>
    <ng-option value="b" text="B"/>
</ng-select>
```

### Popover Popup

Use the native Popover API for popup positioning:

```typescript
import {PopoverPositioner, PopoverPositionerOptions, SelectOptions} from '@anglr/select';
import {RecursivePartial} from '@jscrpt/common';

const selectOptions: RecursivePartial<SelectOptions<string>> =
{
    plugins:
    {
        interactions:
        {
            options:
            {
                handleClickOutside: false,
            },
        },
        positioner:
        {
            type: PopoverPositioner,
            options:
            {
                popoverAuto: true,
            } as PopoverPositionerOptions,
        },
    },
};
```

```html
<ng-select [formField]="field" [selectOptions]="selectOptions">
    <ng-option value="a" text="A"/>
</ng-select>
```

### Cancel Value

Show a cancel/clear button to reset the selected value:

```typescript
const selectOptions: RecursivePartial<SelectOptions<string>> =
{
    plugins:
    {
        normalState:
        {
            options:
            {
                cancelValue: true,
            },
        },
    },
};
```

```html
<ng-select [formField]="field" [selectOptions]="selectOptions">
    <ng-option value="a" text="A"/>
    <ng-option value="b" text="B"/>
</ng-select>
```

### Hide Caret

In edit mode, hide the dropdown caret:

```typescript
import {EditNormalStateOptions, SelectOptions} from '@anglr/select';

const selectOptions: RecursivePartial<SelectOptions<string>> =
{
    plugins:
    {
        normalState:
        {
            options:
            {
                carret: false,
            } as EditNormalStateOptions,
        },
    },
};
```

```html
<ng-select [formField]="field" [selectOptions]="selectOptions" edit>
    <ng-option value="a" text="A"/>
</ng-select>
```

Or use the shorthand directive:

```html
<ng-select [formField]="field" noCarret>
    <ng-option value="a" text="A"/>
</ng-select>
```

### Add New Option

Allow users to create new options by typing. Configure `newOptionGetter` on the OptionsHandler:

```typescript
const selectOptions: RecursivePartial<SelectOptions<string>> =
{
    plugins:
    {
        optionsHandler:
        {
            options:
            {
                newOptionGetter: (value: string) =>
                ({
                    group: signal(null),
                    text: signal(value),
                    value: signal(value),
                }),
            },
        },
    },
};
```

```html
<ng-select [formField]="field" [selectOptions]="selectOptions" edit>
    <ng-option value="first" text="First value text"/>
    <ng-option value="second" text="Second value text"/>
</ng-select>
```

### Readonly

Use Angular signal forms' `readonly()` to toggle readonly state:

```typescript
import {signal} from '@angular/core';
import {form, FormField, readonly} from '@angular/forms/signals';

export class ReadonlySampleComponent
{
    protected readonly = signal(false);
    protected selectField = form(
        signal<string|null>(null),
        path => readonly(path, () => this.readonly()),
    );
}
```

```html
<button (click)="readonly.set(!readonly())">
    {{ readonly() ? 'to normal' : 'to readonly' }}
</button>

<ng-select [formField]="selectField">
    <ng-option value="a" text="A"/>
    <ng-option value="b" text="B"/>
</ng-select>
```

Or use the `setReadonly()` extension:

```typescript
import {setReadonly} from '@anglr/select/extensions';

this.select().execute(setReadonly(true));
```

### Custom Readonly State

Replace the readonly visual entirely with a custom plugin component:

```typescript
this.selectOptions =
{
    plugins:
    {
        readonlyState:
        {
            type: CustomReadonlyStateComponent,
        },
    },
};
```

### Styling Override

Override CSS custom properties in a scoped container:

```html
<div class="select-override">
    <ng-select [formField]="field">
        <ng-option value="first" text="First value text"/>
        <ng-option value="second" text="Second value text"/>
    </ng-select>
</div>
```

```scss
.select-override {
    --select-normalState-borderColor: tomato;
    --select-normalState-background: lightyellow;
    --select-normalState-foreground: #333;
    --select-normalState-focus-borderColor: red;
    --select-normalState-focus-outlineColor: red;
    --select-popup-container-background: lightyellow;
    --select-popup-container-borderColor: tomato;
}
```

---

## License

MIT
