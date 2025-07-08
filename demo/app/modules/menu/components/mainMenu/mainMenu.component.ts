import {Component, ChangeDetectionStrategy} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

/**
 * Component used for displaying application main menu
 */
@Component(
{
    selector: 'main-menu',
    templateUrl: 'mainMenu.component.html',
    imports:
    [
        RouterLink,
        RouterLinkActive,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainMenuComponent
{
}
