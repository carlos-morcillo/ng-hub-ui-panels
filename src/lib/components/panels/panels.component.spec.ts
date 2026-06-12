import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import type { PanelChangeEvent, PanelsType } from '../../models/panels.types';
import { PanelComponent } from '../panel/panel.component';
import { PanelsComponent } from './panels.component';

@Component({
	standalone: true,
	imports: [PanelsComponent, PanelComponent],
	template: `
		<hub-panels [type]="type" [multiple]="multiple" (panelChange)="onPanelChange($event)">
			<hub-panel heading="One" value="one">Uno</hub-panel>
			<hub-panel heading="Two" value="two" [disabled]="twoDisabled">Dos</hub-panel>
			<hub-panel heading="Three" value="three" removable>Tres</hub-panel>
		</hub-panels>
	`
})
class HostComponent {
	type: PanelsType = 'tabs';
	multiple = false;
	twoDisabled = false;
	readonly changes: PanelChangeEvent[] = [];

	onPanelChange(event: PanelChangeEvent): void {
		this.changes.push(event);
	}
}

/** Settles `afterNextRender` + `queueMicrotask` housekeeping. */
async function settle(fixture: ComponentFixture<HostComponent>): Promise<void> {
	fixture.detectChanges();
	await fixture.whenStable();
	fixture.detectChanges();
}

describe('PanelsComponent', () => {
	let fixture: ComponentFixture<HostComponent>;
	let host: HostComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HostComponent],
			providers: [provideRouter([])]
		}).compileComponents();

		fixture = TestBed.createComponent(HostComponent);
		host = fixture.componentInstance;
	});

	function navLinks(): HTMLButtonElement[] {
		return Array.from(fixture.nativeElement.querySelectorAll('.hub-panels__nav-link'));
	}

	function headerGroups(): HTMLElement[] {
		return Array.from(fixture.nativeElement.querySelectorAll('.hub-panels__multiple-block .hub-panels__nav'));
	}

	function multipleBlocks(): HTMLElement[] {
		return Array.from(fixture.nativeElement.querySelectorAll('.hub-panels__multiple-block'));
	}

	it('renders one nav link per panel in tabs view', async () => {
		await settle(fixture);
		expect(navLinks().length).toBe(3);
		expect(fixture.nativeElement.querySelector('.hub-panels__nav--tabs')).toBeTruthy();
	});

	it('activates the first enabled panel by default', async () => {
		await settle(fixture);
		expect(navLinks()[0].classList).toContain('hub-panels__nav-link--active');
	});

	it('activates a panel on click and emits panelChange', async () => {
		await settle(fixture);
		navLinks()[2].click();
		await settle(fixture);

		expect(navLinks()[2].classList).toContain('hub-panels__nav-link--active');
		expect(navLinks()[0].classList).not.toContain('hub-panels__nav-link--active');
		expect(host.changes.at(-1)?.current.heading()).toBe('Three');
	});

	it('does not activate a disabled panel', async () => {
		host.twoDisabled = true;
		await settle(fixture);

		const before = host.changes.length;
		navLinks()[1].click();
		await settle(fixture);

		expect(navLinks()[1].classList).not.toContain('hub-panels__nav-link--active');
		expect(host.changes.length).toBe(before);
	});

	it('applies the pills modifier when type is pills', async () => {
		host.type = 'pills';
		await settle(fixture);
		expect(fixture.nativeElement.querySelector('.hub-panels__nav--pills')).toBeTruthy();
	});

	describe('multiple selection (tabs)', () => {
		beforeEach(() => {
			host.multiple = true;
		});

		it('starts with no open pane when no form value is bound', async () => {
			await settle(fixture);

			const open = fixture.nativeElement.querySelectorAll('.hub-panels__panel--active');
			expect(open.length).toBe(0);
			expect(multipleBlocks().length).toBe(1);
		});

		it('splits the strip into header groups started by active tabs', async () => {
			await settle(fixture);
			navLinks()[0].click();
			navLinks()[2].click();
			await settle(fixture);

			expect(multipleBlocks().length).toBe(2);
			expect(headerGroups()[0].textContent?.replace(/\s+/g, ' ').trim()).toBe('One Two');
			expect(headerGroups()[1].textContent?.replace(/\s+/g, ' ').trim()).toBe('Three');
		});

		it('includes leading inactive tabs in the first active block', async () => {
			await settle(fixture);
			navLinks()[1].click();
			await settle(fixture);

			expect(multipleBlocks().length).toBe(1);
			expect(headerGroups()[0].textContent?.replace(/\s+/g, ' ').trim()).toBe('One Two Three');
			expect(navLinks()[1].classList).toContain('hub-panels__nav-link--active');
			expect(navLinks()[0].classList).not.toContain('hub-panels__nav-link--active');
		});

		it('toggles an active block closed and merges its headers into the previous block', async () => {
			await settle(fixture);
			navLinks()[0].click();
			navLinks()[2].click();
			await settle(fixture);

			navLinks()[2].click();
			await settle(fixture);

			expect(multipleBlocks().length).toBe(1);
			expect(headerGroups()[0].textContent?.replace(/\s+/g, ' ').trim()).toBe('One Two Three');
			expect(navLinks()[2].classList).not.toContain('hub-panels__nav-link--active');
		});

		it('applies the minimum block width to each visible multiple block', async () => {
			await settle(fixture);
			navLinks()[0].click();
			navLinks()[2].click();
			await settle(fixture);

			const firstBlock = multipleBlocks()[0];
			expect(getComputedStyle(firstBlock).minWidth).toBe('256px');
		});
	});

	describe('accordion view', () => {
		beforeEach(() => {
			host.type = 'accordion';
		});

		function accordionButtons(): HTMLButtonElement[] {
			return Array.from(fixture.nativeElement.querySelectorAll('.hub-panels__accordion-btn'));
		}

		it('renders disclosure headers and no tablist', async () => {
			await settle(fixture);
			expect(accordionButtons().length).toBe(3);
			expect(fixture.nativeElement.querySelector('.hub-panels__nav')).toBeNull();
		});

		it('starts with every panel collapsed', async () => {
			await settle(fixture);
			for (const button of accordionButtons()) {
				expect(button.classList).toContain('hub-panels__accordion-btn--collapsed');
			}
		});

		it('opens a single panel at a time by default', async () => {
			await settle(fixture);
			accordionButtons()[0].click();
			accordionButtons()[2].click();
			await settle(fixture);

			expect(accordionButtons()[0].classList).toContain('hub-panels__accordion-btn--collapsed');
			expect(accordionButtons()[2].classList).not.toContain('hub-panels__accordion-btn--collapsed');
		});

		it('keeps several panels open with multiple', async () => {
			host.multiple = true;
			await settle(fixture);
			accordionButtons()[0].click();
			accordionButtons()[1].click();
			await settle(fixture);

			expect(accordionButtons()[0].classList).not.toContain('hub-panels__accordion-btn--collapsed');
			expect(accordionButtons()[1].classList).not.toContain('hub-panels__accordion-btn--collapsed');
		});
	});
});
