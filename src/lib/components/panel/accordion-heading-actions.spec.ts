import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PanelHeadingActionsDirective } from '../../directives/panel-heading-actions.directive';
import { PanelHeadingDirective } from '../../directives/panel-heading.directive';
import { PanelsComponent } from '../panels/panels.component';
import { PanelComponent } from './panel.component';

@Component({
	standalone: true,
	imports: [PanelsComponent, PanelComponent, PanelHeadingDirective, PanelHeadingActionsDirective],
	template: `
		<hub-panels type="accordion" multiple [togglePosition]="togglePosition">
			<hub-panel>
				<ng-template hubPanelHeading>Group A</ng-template>
				<ng-template hubPanelHeadingActions>
					<button type="button" class="edit" (click)="edited = edited + 1">Edit</button>
				</ng-template>
				Body A
			</hub-panel>
			<hub-panel>
				<ng-template hubPanelHeading>Group B</ng-template>
				Body B
			</hub-panel>
		</hub-panels>
	`
})
class AccordionActionsHost {
	togglePosition: 'start' | 'end' = 'end';
	edited = 0;
}

describe('accordion heading actions', () => {
	beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

	it('renders the actions beside the disclosure button, never inside it', () => {
		const fixture = TestBed.createComponent(AccordionActionsHost);
		fixture.detectChanges();

		const header = fixture.nativeElement.querySelector('.hub-panels__accordion-header') as HTMLElement;
		const actions = header.querySelector('.hub-panels__accordion-actions') as HTMLElement;

		expect(actions).not.toBeNull();
		expect(actions.parentElement).toBe(header);
		// The whole point: a real <button> may live here, which is invalid inside
		// the disclosure <button> that hosts `hubPanelHeading`.
		expect(header.querySelector('.hub-panels__accordion-btn .edit')).toBeNull();
		expect(actions.querySelector('button.edit')).not.toBeNull();
	});

	it('omits the actions slot on a panel that does not supply the template', () => {
		const fixture = TestBed.createComponent(AccordionActionsHost);
		fixture.detectChanges();

		const headers = fixture.nativeElement.querySelectorAll('.hub-panels__accordion-header');
		expect(headers[1].querySelector('.hub-panels__accordion-actions')).toBeNull();
	});

	it('keeps the actions reachable while the panel is collapsed', () => {
		const fixture = TestBed.createComponent(AccordionActionsHost);
		fixture.detectChanges();

		const root = fixture.nativeElement as HTMLElement;
		const btn = root.querySelector('.hub-panels__accordion-btn') as HTMLButtonElement;
		expect(btn.classList).toContain('hub-panels__accordion-btn--collapsed');

		// The collapse region is inert while closed; the header row is not.
		const collapse = root.querySelector('.hub-panels__accordion-collapse') as HTMLElement;
		expect(collapse.hasAttribute('inert')).toBe(true);
		expect(root.querySelector('.hub-panels__accordion-actions')?.closest('[inert]')).toBeNull();
	});

	it('does not toggle the panel when an action is clicked', () => {
		const fixture = TestBed.createComponent(AccordionActionsHost);
		fixture.detectChanges();

		const root = fixture.nativeElement as HTMLElement;
		const editBtn = root.querySelector('button.edit') as HTMLButtonElement;
		editBtn.click();
		fixture.detectChanges();

		expect(fixture.componentInstance.edited).toBe(1);
		const btn = root.querySelector('.hub-panels__accordion-btn') as HTMLButtonElement;
		expect(btn.getAttribute('aria-expanded')).toBe('false');
	});

	it('marks the header row expanded so it can follow the button surface', () => {
		const fixture = TestBed.createComponent(AccordionActionsHost);
		fixture.detectChanges();

		const root = fixture.nativeElement as HTMLElement;
		const header = root.querySelector('.hub-panels__accordion-header') as HTMLElement;
		expect(header.classList).not.toContain('hub-panels__accordion-header--expanded');

		(root.querySelector('.hub-panels__accordion-btn') as HTMLButtonElement).click();
		fixture.detectChanges();

		expect(header.classList).toContain('hub-panels__accordion-header--expanded');
	});

	// Two stylesheet rules hang off this DOM shape, and both regressed once when the
	// button stopped spanning the row: the hairline that closes an open row is drawn
	// on the header, and the trailing chevron is anchored to the header's inline end
	// so it lands AFTER the actions. Both need the actions to be the header's last
	// child; reordering them would silently put the chevron back in the middle.
	it('keeps the actions last in the header, so the trailing chevron clears them', () => {
		const fixture = TestBed.createComponent(AccordionActionsHost);
		fixture.detectChanges();

		const header = fixture.nativeElement.querySelector('.hub-panels__accordion-header') as HTMLElement;
		const children = [...header.children];

		expect(children.at(0)?.classList).toContain('hub-panels__accordion-btn');
		expect(children.at(-1)?.classList).toContain('hub-panels__accordion-actions');
	});

	// The chevron moved out of the button's flow into absolute positioning, but it
	// must stay a CHILD of the button: that is what keeps clicking it a toggle, and
	// what keeps the actions from being nested inside another control.
	it('leaves the chevron owned by the disclosure button', () => {
		const fixture = TestBed.createComponent(AccordionActionsHost);
		fixture.detectChanges();

		const header = fixture.nativeElement.querySelector('.hub-panels__accordion-header') as HTMLElement;
		const button = header.querySelector('.hub-panels__accordion-btn') as HTMLElement;
		const actions = header.querySelector('.hub-panels__accordion-actions') as HTMLElement;

		expect(button.contains(actions)).toBe(false);
		expect(actions.querySelector('button')).not.toBeNull();
	});
});

describe('accordion togglePosition', () => {
	beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

	it('trails the chevron by default', () => {
		const fixture = TestBed.createComponent(AccordionActionsHost);
		fixture.detectChanges();

		const container = fixture.nativeElement.querySelector('hub-panels') as HTMLElement;
		expect(container.classList).not.toContain('hub-panels--toggle-start');
	});

	it('leads the chevron when togglePosition is start', () => {
		const fixture = TestBed.createComponent(AccordionActionsHost);
		fixture.componentInstance.togglePosition = 'start';
		fixture.detectChanges();

		const container = fixture.nativeElement.querySelector('hub-panels') as HTMLElement;
		expect(container.classList).toContain('hub-panels--toggle-start');
	});

	it('does not leak the chevron placement into a nested accordion', () => {
		@Component({
			standalone: true,
			imports: [PanelsComponent, PanelComponent],
			template: `
				<hub-panels type="accordion" togglePosition="start">
					<hub-panel heading="Group" class="outer">
						<hub-panels type="accordion">
							<hub-panel heading="Field" class="inner">Body</hub-panel>
						</hub-panels>
					</hub-panel>
				</hub-panels>
			`
		})
		class NestedHost {}

		const fixture = TestBed.createComponent(NestedHost);
		fixture.detectChanges();

		const root = fixture.nativeElement as HTMLElement;
		// The flag rides the panel, so the inner accordion keeps its own default (`end`)
		// even though it sits inside a `toggle-start` container.
		expect((root.querySelector('.outer') as HTMLElement).classList).toContain('hub-panels__panel--toggle-start');
		expect((root.querySelector('.inner') as HTMLElement).classList).not.toContain('hub-panels__panel--toggle-start');
	});

	it('never flags toggle-start outside the accordion view', () => {
		@Component({
			standalone: true,
			imports: [PanelsComponent, PanelComponent],
			template: `
				<hub-panels type="tabs" togglePosition="start">
					<hub-panel heading="A">A</hub-panel>
				</hub-panels>
			`
		})
		class TabsHost {}

		const fixture = TestBed.createComponent(TabsHost);
		fixture.detectChanges();

		const container = fixture.nativeElement.querySelector('hub-panels') as HTMLElement;
		expect(container.classList).not.toContain('hub-panels--toggle-start');
	});
});
