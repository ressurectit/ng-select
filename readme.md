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
  - [Search Highlighting](#search-highlighting)
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
- [License](#license)

## Resources

- **API reference**: https://ressurectit.github.io/#/content/api/ng-select/select
- **API extensions reference**: https://ressurectit.github.io/#/content/api/ng-select-extensions/select-extensions
- **Live samples**: https://ressurectit.github.io/#/content/select#samples

## Installation

```bash
npm install @anglr/select
```

**Dependencies**: `@angular/core`, `@angular/common`, `@angular/forms`, `@anglr/common`, `@jscrpt/common`, `@css-styles/common`, `rxjs`, `lodash-es`.

The default popup positioner (`CommonPositioner`) places the popup using the `Position` service from `@anglr/common`, so an implementation has to be registered once in the application, for example the Floating UI based one:

```typescript
// app.config.ts
import {ApplicationConfig} from '@angular/core';
import {providePosition} from '@anglr/common';
import {FloatingUiDomPosition} from '@anglr/common/floating-ui';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        providePosition(FloatingUiDomPosition),
    ],
};
```

The styles have to be included as well, see [Styling](#styling).

---

## Quick Start

Import the standalone components directly (no module required). `SelectFormControl` connects the select to an Angular signal form field:

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

The popup renders a header for each group, followed by its options (`OptionGroup` has to be imported next to `Option`):

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

Values written to the control are applied to the select even when the value handler resolves them asynchronously (for example `DynamicValueHandler`). The control keeps the written value while it's being resolved.

### Signal Forms (FormField)

Use the `SelectFormControl` directive with Angular's signal-based `form()` / `FormField`:

```typescript
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
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
        JsonPipe,
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

The field's `disabled()` and `readonly()` states are reflected by the select (see [Readonly](#readonly)).

### Two-way Binding (withDirectAccess)

Use the `WithDirectAccess` directive (`withDirectAccess` attribute) for simple two-way model binding without a form layer. Its `value` model works with any signal:

```typescript
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {Select, Option, WithDirectAccess} from '@anglr/select';

@Component(
{
    template: `
        <ng-select [(value)]="selectedValue" withDirectAccess>
            <ng-option value="a" text="A"/>
            <ng-option value="b" text="B"/>
        </ng-select>
        <div>Value: {{ selectedValue() }}</div>
    `,
    imports:
    [
        Select,
        Option,
        WithDirectAccess,
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
| `SelectEdit` | `ng-select[edit]` | Enables type-ahead / editable mode (swaps to `EditNormalState` + `EditLiveSearch`, Space is typed into the input instead of opening the popup) |
| `SelectAbsolute` | `ng-select[absolute]` | Appends popup to `document.body` for overflow-safe positioning |
| `SelectMultipleKeepPopup` | `ng-select[multiple]` | Keeps popup open after each selection in multi-select mode |
| `SelectPlaceholder` | `ng-select[placeholder]` | Sets placeholder text reactively |
| `SelectNoCarret` | `ng-select[noCarret]` | Hides the dropdown caret |
| `NormalStateTemplate` | `[normalStateTemplate]` | Custom template for the closed/normal state display |
| `NormalStateTagTemplate` | `[normalStateTagTemplate]` | Custom template for individual tags in multi-select normal state |
| `OptionTemplate` | `[optionTemplate]` | Custom template for each option in the popup |
| `OptionGroupTemplate` | `[optionGroupTemplate]` | Custom template for option group headers |
| `HighlightInstance` | `[highlightInstance]` | Manages `::highlight(search-query)` CSS Highlight API ranges for the popup (bound to `SimplePopup`) |
| `HighlightSearch` | `[highlightSearch]` | Attached to a popup option element; produces `Range` objects for every occurrence of the live-search query in its text nodes |
| `HighlightText` | `[highlightText]` | Marks an inner element inside a custom `optionTemplate` whose text should participate in search highlighting (nested under `HighlightSearch`) |
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
| **KeyboardHandler** | `SimpleKeyboardHandler` | — | Arrow keys, Enter, Backspace, Space (opens popup), alphanumeric search |
| **LiveSearch** | `NoLiveSearch` | `FilterLiveSearch`, `EditLiveSearch` | Text-based filtering of options |
| **NormalState** | `SimpleNormalState` | `EditNormalState` | Closed-state appearance (value, caret, cancel button) |
| **OptionsHandler** | `SimpleOptionsHandler` | `NoOptionsHandler` | Options list management, filtering, add-new-option |
| **Popup** | `SimplePopup` | — | Dropdown panel rendering (supports live-search text highlighting via the CSS Highlight API) |
| **Positioner** | `CommonPositioner` | `PopoverPositioner`, `NoPositioner` | Popup positioning (z-index, absolute, popover API) |
| **ReadonlyState** | *(same as NormalState)* | Custom component | Display when readonly |
| **ValueHandler** | `StaticValueHandler` | `DynamicValueHandler` | Selected value storage, single/multi-select logic |

### Configuring Plugins

Pass a `[selectOptions]` object to override plugin types and/or their options. Partial objects are deep-merged with defaults. This select gets a filter input inside its popup:

```typescript
// configuringPlugins.component.ts
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {form, FormField} from '@angular/forms/signals';
import {FilterLiveSearch, Option, Select, SelectFormControl, SelectOptions} from '@anglr/select';
import {RecursivePartial} from '@jscrpt/common';

@Component(
{
    selector: 'configuring-plugins-sample',
    templateUrl: 'configuringPlugins.component.html',
    imports:
    [
        Select,
        Option,
        FormField,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfiguringPluginsSampleComponent
{
    protected field = form(signal<string|null>(null));

    protected options: RecursivePartial<SelectOptions> =
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
}
```

```html
<!-- configuringPlugins.component.html -->
<ng-select [selectOptions]="options" [formField]="field">
    <ng-option value="a" text="Alpha"/>
    <ng-option value="b" text="Beta"/>
</ng-select>
```

Plugin types and options can also be provided through dependency injection (`provide<Plugin>Type()` and `provide<Plugin>Options()` for every plugin slot). They apply to every select inside the providing component, or the whole application when registered in the application config. The following providers switch the selects to an editable mode, which is the same thing the `edit` directive does:

```typescript
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {form, FormField} from '@angular/forms/signals';
import {EditLiveSearch, EditNormalState, Option, provideKeyboardHandlerOptions, provideLiveSearchType, provideNormalStateType, Select, SelectFormControl, SimpleKeyboardHandlerOptions} from '@anglr/select';

@Component(
{
    selector: 'plugin-providers-sample',
    template: `
        <ng-select [formField]="field">
            <ng-option value="a" text="Alpha"/>
            <ng-option value="b" text="Beta"/>
        </ng-select>
    `,
    imports:
    [
        Select,
        Option,
        FormField,
        SelectFormControl,
    ],
    providers:
    [
        provideNormalStateType(EditNormalState),
        provideLiveSearchType(EditLiveSearch),
        provideKeyboardHandlerOptions<SimpleKeyboardHandlerOptions>(
        {
            alphanumericSearch: false,
            liveSearchEvents: true,
            openPopupOnSpace: false,
        }),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PluginProvidersSampleComponent
{
    protected field = form(signal<string|null>(null));
}
```

`SimpleKeyboardHandler` options (`SimpleKeyboardHandlerOptions`):

| Option | Type | Default | Description |
|---|---|---|---|
| `selectFirstDebounceTimeout` | `number` | `300` | Debounce timeout for selecting the first option while typing |
| `openPopupOnSpace` | `boolean` | `true` | Whether the Space key opens the popup |
| `alphanumericSearch` | `boolean` | `true` | Typing alphanumeric keys (outside of live search) selects the first option whose text starts with the typed text |
| `liveSearchEvents` | `boolean` | `false` | Whether keyboard events coming from the live search input are processed |

### Implementing a Custom Plugin

To create a custom plugin, implement the corresponding plugin interface (or extend a provided base class) and register it via `selectOptions` or a provider. A plugin is a standalone component that the select creates dynamically. It gets the shared `SelectPluginInstances`, its own `ElementRef` and the `SelectBus` through `inject()`, and the select assigns `options` from the plugin description.

**Example: Custom ReadonlyState Plugin**

A custom readonly state that renders the selected values as plain text, or "No value selected":

```typescript
import {Component, ChangeDetectionStrategy, ElementRef, inject} from '@angular/core';
import {ReadonlyState, ReadonlyStateOptions, SelectBus, SelectPluginInstances} from '@anglr/select';

@Component(
{
    selector: 'custom-readonly-state',
    template: `
        <div class="custom-readonly">
            @if (selectBus.selectedOptions(); as selected) {
                @if (isArray(selected)) {
                    @for (opt of selected; track $index) {
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
export class CustomReadonlyStateComponent implements ReadonlyState
{
    public readonly selectPlugins: SelectPluginInstances = inject(SelectPluginInstances);
    public readonly pluginElement: ElementRef<HTMLElement> = inject(ElementRef);
    public readonly selectBus: SelectBus = inject(SelectBus);

    public options: ReadonlyStateOptions =
    {
        cancelValue: false,
        texts:
        {
            cancelTitle: '',
        },
        cssClasses: {},
    };

    protected isArray = Array.isArray;

    public focus(): void
    {
        // no-op for readonly
    }
}
```

**Register the custom plugin.** The select below is readonly, so it renders the custom component instead of the normal state:

```typescript
// customReadonlyState.component.ts
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {form, FormField, readonly} from '@angular/forms/signals';
import {Option, Select, SelectFormControl, SelectOptions} from '@anglr/select';
import {RecursivePartial} from '@jscrpt/common';

import {CustomReadonlyStateComponent} from './customReadonlyStatePlugin.component';

@Component(
{
    selector: 'custom-readonly-state-sample',
    templateUrl: 'customReadonlyState.component.html',
    imports:
    [
        Select,
        Option,
        FormField,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomReadonlyStateSampleComponent
{
    protected field = form(signal<string|null>('a'), path => readonly(path));

    protected selectOptions: RecursivePartial<SelectOptions> =
    {
        plugins:
        {
            readonlyState:
            {
                type: CustomReadonlyStateComponent,
            },
        },
    };
}
```

```html
<!-- customReadonlyState.component.html -->
<ng-select [selectOptions]="selectOptions" [formField]="field">
    <ng-option value="a" text="A"/>
    <ng-option value="b" text="B"/>
</ng-select>
```

**Example: Custom OptionsHandler Plugin**

`OptionsHandlerBase` provides the injected plugin fields and the *add new option* support, so a custom options handler only needs `options`, `availableOptions` and `listOptions`. This one filters options by the live-search text and lists them sorted alphabetically, regardless of the order of the `<ng-option>` elements:

```typescript
import {Component, ChangeDetectionStrategy, computed, Signal} from '@angular/core';
import {OptionsHandler, OptionsHandlerBase, OptionsHandlerOptions, SelectOptionState} from '@anglr/select';

/**
 * Options handler that filters options by live search text and lists them sorted alphabetically by text
 */
@Component(
{
    selector: 'sorted-options-handler',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortedOptionsHandler<TValue = unknown, TPublicValue = TValue> extends OptionsHandlerBase<TValue, TPublicValue> implements OptionsHandler<TValue, TPublicValue>
{
    public options: OptionsHandlerOptions<TValue> =
    {
        newOptionGetter: null,
        newOptionOnlyWhenNoOptions: false,
    };

    public readonly availableOptions: Signal<readonly SelectOptionState<TValue>[]|undefined|null> = computed(() => this.selectBus.selectOptions().optionsGatherer.availableOptions());

    public readonly listOptions: Signal<readonly SelectOptionState<TValue>[]|undefined|null> = computed(() =>
    {
        const search = this.selectPlugins.LiveSearch.search();
        const options = this.selectBus.selectOptions();

        return this.availableOptions()
            ?.filter(option => !search || options.textCompare(options.normalize(options.textExtractor(option)), options.normalize(search)))
            .sort((first, second) => options.textExtractor(first).localeCompare(options.textExtractor(second)));
    });
}
```

```typescript
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {form, FormField} from '@angular/forms/signals';
import {FilterLiveSearch, Option, Select, SelectFormControl, SelectOptions} from '@anglr/select';
import {RecursivePartial} from '@jscrpt/common';

import {SortedOptionsHandler} from './sortedOptionsHandler.component';

@Component(
{
    selector: 'custom-options-handler-sample',
    template: `
        <ng-select [selectOptions]="selectOptions" [formField]="field">
            <ng-option value="c" text="Cherry"/>
            <ng-option value="a" text="Apple"/>
            <ng-option value="b" text="Banana"/>
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
export class CustomOptionsHandlerSampleComponent
{
    protected field = form(signal<string|null>(null));

    protected selectOptions: RecursivePartial<SelectOptions> =
    {
        plugins:
        {
            optionsHandler:
            {
                type: SortedOptionsHandler,
            },
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
}
```

**Custom ValueHandler**

A value handler implements `ValueHandler`: a `value` signal and a `setValue(value)` method. `setValue` returns `PromiseOr<void>`, so a value handler can resolve the written value asynchronously, as `DynamicValueHandler` does with its `optionGetter`. `SelectFormControl`, `SelectControlValueAccessor` and `WithDirectAccess` wait for the returned promise and keep the written value meanwhile.

---

## Extensions

The `@anglr/select/extensions` entry point provides helper functions for programmatic interaction with the select via `execute()` / `executeAndReturn()`:

```typescript
import {getSearch, getSelectedOption, getSelectedOptions, getValue, setReadonly, setValue} from '@anglr/select/extensions';
```

| Function | Type | Description |
|---|---|---|
| `getValue()` | `SelectFunction` | Returns the current value (reactive) |
| `setValue(value)` | `SelectAction` | Sets the select's value programmatically |
| `getSearch()` | `SelectFunction` | Returns the current live-search text (reactive) |
| `getSelectedOption()` | `SelectFunction` | Returns the selected `SelectOption` of a single-value select (reactive); throws when the select is `multiple` |
| `getSelectedOptions()` | `SelectFunction` | Returns the selected `SelectOption` or `SelectOption[]` (reactive) |
| `setReadonly(flag?)` | `SelectAction` | Sets the select to readonly mode (`true` when the flag is omitted) |

The `get*` functions return `undefined` (`''` for `getSearch()`) until the select is initialized. They read signals, so used inside `computed()` or `effect()` they track changes of the select.

**Usage:** the page shows the value, live-search text and selected option text of the first select, and the texts of all options selected in the multiple select. The buttons change the value and toggle readonly:

```typescript
// extensions.component.ts
import {Component, ChangeDetectionStrategy, computed, Signal, viewChild} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {FilterLiveSearch, Option, Select, SelectOption, SelectOptions} from '@anglr/select';
import {getSearch, getSelectedOption, getSelectedOptions, getValue, setReadonly, setValue} from '@anglr/select/extensions';
import {RecursivePartial} from '@jscrpt/common';

@Component(
{
    selector: 'extensions-sample',
    templateUrl: 'extensions.component.html',
    imports:
    [
        Select,
        Option,
        JsonPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtensionsSampleComponent
{
    protected select: Signal<Select<string>> = viewChild.required<Select<string>>('select');
    protected multiSelect: Signal<Select<string>> = viewChild.required<Select<string>>('multiSelect');

    protected selectOptions: RecursivePartial<SelectOptions<string>> =
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

    // reactive reads, recomputed whenever the select changes
    protected value: Signal<string|string[]|undefined|null> = computed(() => this.select().executeAndReturn(getValue()));
    protected search: Signal<string> = computed(() => this.select().executeAndReturn(getSearch()));
    protected selectedOption: Signal<SelectOption<string>|undefined|null> = computed(() => this.select().executeAndReturn(getSelectedOption()));
    protected selectedTexts: Signal<string[]> = computed(() =>
    {
        const options = this.multiSelect().executeAndReturn(getSelectedOptions());

        return (Array.isArray(options) ? options : options ? [options] : []).map(option => option.text());
    });

    protected selectSecond(): void
    {
        this.select().execute(setValue('second'));
    }

    protected toggleReadonly(): void
    {
        const select = this.select();

        select.execute(setReadonly(!select.selectOptions.readonly));
    }
}
```

```html
<!-- extensions.component.html -->
<ng-select #select [selectOptions]="selectOptions">
    <ng-option value="first" text="First value text"/>
    <ng-option value="second" text="Second value text"/>
    <ng-option value="third" text="Third value text"/>
</ng-select>

<button type="button" (click)="selectSecond()">select second</button>
<button type="button" (click)="toggleReadonly()">toggle readonly</button>

<div>Value: {{ value() | json }}</div>
<div>Search: {{ search() }}</div>
<div>Selected option text: {{ selectedOption()?.text() }}</div>

<ng-select #multiSelect multiple>
    <ng-option value="first" text="First value text"/>
    <ng-option value="second" text="Second value text"/>
    <ng-option value="third" text="Third value text"/>
</ng-select>

<div>Selected texts: {{ selectedTexts().join(', ') }}</div>
```

---

## Pipes

| Pipe | Pure | Description |
|---|---|---|
| `displayValue` | No | Transforms `SelectOption` or `SelectOption[]` into a display string (for normal/readonly state) |
| `displayOptionValue` | No | Transforms a single `SelectOption` shown in the popup into a display string; falls back to `displaySelectedValue` when `displayOptionValue` is not configured on `SelectBusOptions` |
| `hasValue` | Yes | Returns `true` when the option(s) represent a selected value |
| `getPlugin` | Yes | Retrieves a typed plugin instance from another plugin |
| `addNewOption` | Yes | Produces the "add new option" label for synthetic options |
| `groupedListOptions` | Yes | Converts a flat option list into grouped tuples for rendering |
| `optionCssClasses` | No | Returns CSS class array for a popup option (selected, active, grouped) |

---

## Styling

### Setup

The library ships SCSS that uses CSS custom properties for theming. Import a theme in your global stylesheet and include it **inside a style rule** (the mixins output custom-property declarations and nested rules, so they can't be used at the stylesheet root):

```scss
// Import the light theme (includes core CSS + variables)
@use '@anglr/select/styles/themes/light' as selectLight;

// Apply the theme
:root
{
    @include selectLight.buildTheme();
}
```

Or for the dark theme:

```scss
@use '@anglr/select/styles/themes/dark' as selectDark;

:root
{
    @include selectDark.buildTheme();
}
```

### Themes

Two pre-built themes are included:

| Theme | Import Path | Description |
|---|---|---|
| **Light** | `@anglr/select/styles/themes/light` | Light grays, blue focus, black text |
| **Dark** | `@anglr/select/styles/themes/dark` | Dark grays, blue focus, white text |

Each theme exposes:
- `defineTheme($fontSize, $theme, $customization)` — returns a theme map
- `buildTheme()` — outputs the theme variables and the select CSS

The `@anglr/select/styles` entry point exposes the building blocks:
- `defineTheme($fontSize, $theme)` — builds a theme map from the default theme
- `buildTheme($theme)` — outputs the theme variables and the select CSS
- `buildThemeVars($theme)` / `buildThemeCss` — output only the variables or only the CSS, useful when switching between several themes (variables per theme class, CSS once)

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
| `--select-popup-option-searchHighlight-textDecoration` | `underline` | Decoration applied to `::highlight(search-query)` matches inside the popup |
| `--select-popup-option-searchHighlight-textShadow` | `0 0 2px hsl(from currentColor h s 45%)` | Shadow applied to `::highlight(search-query)` matches inside the popup |

**Live Search**

| Property | Default (Light) | Description |
|---|---|---|
| `--select-liveSearch-placeholder-foreground` | `#000` | Placeholder color |

### Customizing a Theme

Override specific values when calling `defineTheme` of a theme:

```scss
@use '@anglr/select/styles' as select;
@use '@anglr/select/styles/themes/light' as selectLight;

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

:root
{
    @include select.buildTheme($myTheme);
}
```

### Building a Custom Theme

Create a theme from scratch using `defineTheme` from `@anglr/select/styles`, which starts from the default theme values:

```scss
@use '@anglr/select/styles' as select;

$customTheme: select.defineTheme(
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

:root
{
    @include select.buildTheme($customTheme);
}
```

### Overriding Styles in Components

For component-scoped overrides, wrap the select in a container and override CSS custom properties in the component's styles. Only selects inside the container change:

```html
<!-- stylingOverride.component.html -->
<div class="select-override">
    <ng-select [formField]="field">
        <ng-option value="first" text="First value text"/>
        <ng-option value="second" text="Second value text"/>
    </ng-select>
</div>
```

```scss
// stylingOverride.component.scss
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

## Samples

Each sample prints the current value next to the select (where it makes sense), so you can see what the select writes into the form.

### Basic Select

Minimal select with reactive forms. Picking an option writes its `value` into the `FormControl`:

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

Multi-select with signal forms. The `multiple` attribute enables multi-selection: the value is an array and the selected options are shown as tags. `SelectMultipleKeepPopup` keeps the popup open after each pick:

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
    protected selectField = form(signal<string[]|null>(null));
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

Add the `edit` directive for a type-ahead experience. The normal state becomes a text input that filters options as you type (Space is typed as text). Works for both single and multi-select:

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
<div>Value: {{ selectField().value() | json }}</div>

<!-- Single edit -->
<ng-select [formField]="selectField" edit>
    <ng-option value="first" text="First value text"/>
    <ng-option value="second" text="Second value text"/>
    <ng-option value="third" text="Third value text"/>
</ng-select>

<div>Values: {{ selectMultipleField().value() | json }}</div>

<!-- Multiple edit -->
<ng-select multiple [formField]="selectMultipleField" edit>
    <ng-option value="first" text="First value text"/>
    <ng-option value="second" text="Second value text"/>
    <ng-option value="third" text="Third value text"/>
</ng-select>
```

### Live Search (Filter)

Enable a filter text input inside the popup using `FilterLiveSearch`. The popup only lists options whose text contains the typed text:

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

### Search Highlighting

The popup highlights live-search matches in option texts using the CSS Highlight API. For custom option templates, mark the elements whose text should be highlighted with the `HighlightText` directive. Typing into the filter highlights matches only in the text part, not in the bold value:

```typescript
// searchHighlighting.component.ts
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {form, FormField} from '@angular/forms/signals';
import {FilterLiveSearch, HighlightText, Option, OptionTemplate, Select, SelectFormControl, SelectOptions} from '@anglr/select';
import {RecursivePartial} from '@jscrpt/common';

@Component(
{
    selector: 'search-highlighting-sample',
    templateUrl: 'searchHighlighting.component.html',
    imports:
    [
        Select,
        Option,
        FormField,
        HighlightText,
        OptionTemplate,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchHighlightingSampleComponent
{
    protected field = form(signal<string|null>(null));

    protected selectOptions: RecursivePartial<SelectOptions> =
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
}
```

```html
<!-- searchHighlighting.component.html -->
<ng-select [selectOptions]="selectOptions" [formField]="field">
    <ng-option value="a" text="Apple"/>
    <ng-option value="b" text="Banana"/>

    <span *optionTemplate="let option">
        <strong>{{ option.value() }}</strong>
        <span highlightText> - {{ option.text() }}</span>
    </span>
</ng-select>
```

### Custom Templates

Use `[normalStateTemplate]` and `[optionTemplate]` to completely customize rendering. The selected value is shown between arrows and every option shows its value and text:

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

Options can be loaded asynchronously. Use signals and `@for` to render them once loaded; here the options show up after 2.5 seconds:

```typescript
// basicLazy.component.ts
import {Component, ChangeDetectionStrategy, WritableSignal, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {Option, Select, SelectFormControl} from '@anglr/select';

interface Item
{
    id: string;
    name: string;
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
    protected lazyOptions: WritableSignal<Item[]> = signal([]);

    constructor()
    {
        // Simulate async loading
        setTimeout(() =>
        {
            this.lazyOptions.set(
            [
                {id: 'first', name: 'First value text'},
                {id: 'second', name: 'Second value text'},
                {id: 'third', name: 'Third value text'},
            ]);
        }, 2500);
    }
}
```

```html
<!-- basicLazy.component.html -->
<div>Value: {{ selectField().value() | json }}</div>

<ng-select [formField]="selectField">
    @for (option of lazyOptions(); track option.id) {
        <ng-option [value]="option.id" [text]="option.name"/>
    }
</ng-select>
```

### Dynamic Options with Remote Data

Use `CodeOptionsGatherer` + `DynamicValueHandler` + `FilterLiveSearch` to load options from a remote API. The options are fetched again whenever the live-search text changes. `ItemsService.search(query)` returns a `Promise<Item[]>`, where `Item` has an `id` and a `name`:

```typescript
// dynamic.component.ts
import {Component, ChangeDetectionStrategy, effect, inject, Signal, viewChild, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {CodeOptionsGatherer, DynamicValueHandler, FilterLiveSearch, Select, SelectFormControl, SelectOptions} from '@anglr/select';
import {getSearch} from '@anglr/select/extensions';
import {RecursivePartial} from '@jscrpt/common';

import {ItemsService} from './items.service';

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
    providers:
    [
        ItemsService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicSampleComponent
{
    private itemsSvc: ItemsService = inject(ItemsService);

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
            popup:
            {
                options:
                {
                    liveSearchEnabled: true,
                },
            },
            valueHandler:
            {
                type: DynamicValueHandler,
            },
        },
        optionsGatherer: this.optionsGatherer,
    };

    constructor()
    {
        effect(async () =>
        {
            const search = this.select().executeAndReturn(getSearch());
            const result = await this.itemsSvc.search(search);

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

When option values are objects but the form stores only a key, use `valueExtractor` to produce the public value, and `DynamicValueHandlerOptions.optionGetter` to resolve the option for a value written from outside (such as the initial value). The form below starts with `'second'` and the select displays its text once `ItemsService.getDetail(id)` (returning `Promise<Item|null>`) resolves:

```typescript
// dynamicOptionGetter.component.ts
import {Component, ChangeDetectionStrategy, effect, inject, Signal, viewChild, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {CodeOptionsGatherer, DynamicValueHandler, FilterLiveSearch, Select, SelectFormControl, SelectOptions} from '@anglr/select';
import {getSearch} from '@anglr/select/extensions';
import {RecursivePartial} from '@jscrpt/common';

import {Item, ItemsService} from './items.service';

@Component(
{
    selector: 'dynamic-option-getter-sample',
    templateUrl: 'dynamicOptionGetter.component.html',
    imports:
    [
        Select,
        JsonPipe,
        FormField,
        SelectFormControl,
    ],
    providers:
    [
        ItemsService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicOptionGetterSampleComponent
{
    private itemsSvc: ItemsService = inject(ItemsService);

    protected optionsGatherer: CodeOptionsGatherer<Item> = new CodeOptionsGatherer<Item>();
    protected select: Signal<Select<Item, string>> = viewChild.required<Select<Item, string>>('select');

    // initial value is only an id, the option for it is resolved using optionGetter
    protected selectField = form(signal<string|null>('second'));

    protected selectOptions: RecursivePartial<SelectOptions<Item, string>> =
    {
        valueExtractor: option => option.value()?.id ?? '',
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
            valueHandler:
            {
                type: DynamicValueHandler,
                options:
                {
                    optionGetter: async (value: string) =>
                    {
                        const item = await this.itemsSvc.getDetail(value);

                        if(!item)
                        {
                            return null;
                        }

                        return {
                            group: signal(null),
                            text: signal(item.name),
                            value: signal(item),
                        };
                    },
                },
            },
        },
        optionsGatherer: this.optionsGatherer,
    };

    constructor()
    {
        effect(async () =>
        {
            const search = this.select().executeAndReturn(getSearch());
            const result = await this.itemsSvc.search(search);

            this.optionsGatherer.setAvailableOptions(
                result.map(item =>
                ({
                    value: signal(item),
                    text: signal(item.name),
                    group: signal(null),
                })),
            );
        });
    }
}
```

```html
<!-- dynamicOptionGetter.component.html -->
<div>Value: {{ selectField().value() | json }}</div>

<ng-select #select [selectOptions]="selectOptions" [formField]="selectField"/>
```

### Absolute Popup

Use the `absolute` directive (`SelectAbsolute`) to render the popup as a direct child of `<body>`. The popup isn't clipped by the `overflow: hidden` container around the select:

```html
<!-- absolute.component.html -->
<div style="overflow: hidden; height: 40px;">
    <ng-select [formField]="field" absolute>
        <ng-option value="a" text="A"/>
        <ng-option value="b" text="B"/>
    </ng-select>
</div>
```

### Popover Popup

Use `PopoverPositioner` to display the popup using the native Popover API, so it's rendered in the top layer above any other content. With `popoverAuto` the browser closes the popup on outside click, so the click-outside handling of the interactions plugin is turned off:

```typescript
// popover.component.ts
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {form, FormField} from '@angular/forms/signals';
import {Option, PopoverPositioner, PopoverPositionerOptions, Select, SelectFormControl, SelectOptions} from '@anglr/select';
import {RecursivePartial} from '@jscrpt/common';

@Component(
{
    selector: 'popover-sample',
    templateUrl: 'popover.component.html',
    imports:
    [
        Select,
        Option,
        FormField,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopoverSampleComponent
{
    protected field = form(signal<string|null>(null));

    protected selectOptions: RecursivePartial<SelectOptions<string>> =
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
}
```

```html
<!-- popover.component.html -->
<ng-select [formField]="field" [selectOptions]="selectOptions">
    <ng-option value="a" text="A"/>
    <ng-option value="b" text="B"/>
</ng-select>
```

### Cancel Value

Show a cancel button in the normal state that clears the selected value:

```typescript
// cancelValue.component.ts
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {form, FormField} from '@angular/forms/signals';
import {Option, Select, SelectFormControl, SelectOptions} from '@anglr/select';
import {RecursivePartial} from '@jscrpt/common';

@Component(
{
    selector: 'cancel-value-sample',
    templateUrl: 'cancelValue.component.html',
    imports:
    [
        Select,
        Option,
        FormField,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CancelValueSampleComponent
{
    protected field = form(signal<string|null>(null));

    protected selectOptions: RecursivePartial<SelectOptions<string>> =
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
}
```

```html
<!-- cancelValue.component.html -->
<ng-select [formField]="field" [selectOptions]="selectOptions">
    <ng-option value="a" text="A"/>
    <ng-option value="b" text="B"/>
</ng-select>
```

### Hide Caret

Hide the dropdown caret, either through the `carret` option of `EditNormalState` (in edit mode), or with the `noCarret` shorthand directive (`SelectNoCarret`):

```typescript
// hideCaret.component.ts
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {form, FormField} from '@angular/forms/signals';
import {EditNormalStateOptions, Option, Select, SelectEdit, SelectFormControl, SelectNoCarret, SelectOptions} from '@anglr/select';
import {RecursivePartial} from '@jscrpt/common';

@Component(
{
    selector: 'hide-caret-sample',
    templateUrl: 'hideCaret.component.html',
    imports:
    [
        Select,
        Option,
        FormField,
        SelectEdit,
        SelectNoCarret,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HideCaretSampleComponent
{
    protected field = form(signal<string|null>(null));
    protected otherField = form(signal<string|null>(null));

    protected selectOptions: RecursivePartial<SelectOptions<string>> =
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
}
```

```html
<!-- hideCaret.component.html -->
<ng-select [formField]="field" [selectOptions]="selectOptions" edit>
    <ng-option value="a" text="A"/>
</ng-select>

<ng-select [formField]="otherField" noCarret>
    <ng-option value="a" text="A"/>
</ng-select>
```

### Add New Option

Allow users to create new options by typing. Configure `newOptionGetter` on the OptionsHandler: while typing, the popup offers the typed text as the first option, and picking it sets it as the value:

```typescript
// addNewOption.component.ts
import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {Option, Select, SelectEdit, SelectFormControl, SelectOptions} from '@anglr/select';
import {RecursivePartial} from '@jscrpt/common';

@Component(
{
    selector: 'add-new-option-sample',
    templateUrl: 'addNewOption.component.html',
    imports:
    [
        Select,
        Option,
        JsonPipe,
        FormField,
        SelectEdit,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNewOptionSampleComponent
{
    protected field = form(signal<string|null>(null));

    protected selectOptions: RecursivePartial<SelectOptions<string>> =
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
}
```

```html
<!-- addNewOption.component.html -->
<div>Value: {{ field().value() | json }}</div>

<ng-select [formField]="field" [selectOptions]="selectOptions" edit>
    <ng-option value="first" text="First value text"/>
    <ng-option value="second" text="Second value text"/>
</ng-select>
```

### Readonly

Use Angular signal forms' `readonly()` rule to toggle the readonly state of the first select. The second select is switched to readonly programmatically with the `setReadonly()` extension:

```typescript
// readonly.component.ts
import {Component, ChangeDetectionStrategy, Signal, signal, viewChild} from '@angular/core';
import {form, FormField, readonly} from '@angular/forms/signals';
import {Option, Select, SelectFormControl} from '@anglr/select';
import {setReadonly} from '@anglr/select/extensions';

@Component(
{
    selector: 'readonly-sample',
    templateUrl: 'readonly.component.html',
    imports:
    [
        Select,
        Option,
        FormField,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadonlySampleComponent
{
    protected isReadonly = signal(false);
    protected selectField = form(
        signal<string|null>(null),
        path => readonly(path, () => this.isReadonly()),
    );

    protected select: Signal<Select<string>> = viewChild.required<Select<string>>('select');

    protected setSelectReadonly(): void
    {
        this.select().execute(setReadonly(true));
    }
}
```

```html
<!-- readonly.component.html -->
<button type="button" (click)="isReadonly.set(!isReadonly())">
    {{ isReadonly() ? 'to normal' : 'to readonly' }}
</button>

<ng-select [formField]="selectField">
    <ng-option value="a" text="A"/>
    <ng-option value="b" text="B"/>
</ng-select>

<button type="button" (click)="setSelectReadonly()">set readonly via extension</button>

<ng-select #select>
    <ng-option value="a" text="A"/>
    <ng-option value="b" text="B"/>
</ng-select>
```

### Custom Readonly State

To replace the readonly visual entirely, register a custom `readonlyState` plugin, see [Example: Custom ReadonlyState Plugin](#implementing-a-custom-plugin).

### Styling Override

To restyle selects in one place of an application only, override the CSS custom properties in a container, see [Overriding Styles in Components](#overriding-styles-in-components).

---

## License

MIT
