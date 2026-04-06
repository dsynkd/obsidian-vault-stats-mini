import { Plugin, TFile } from 'obsidian';

// Remember to rename these classes and interfaces!

export default class VaultStatsPlugin extends Plugin {
	noteCountItemEl: HTMLElement;
	vaultSizeItemEl: HTMLElement;

	async onload() {
		this.noteCountItemEl = this.addStatusBarItem();
		this.vaultSizeItemEl = this.addStatusBarItem();
		this.updateStatusBar();
		this.registerEvent(this.app.vault.on('modify', () => this.updateStatusBar()));
		this.registerEvent(this.app.vault.on('create', () => this.updateStatusBar()));
		this.registerEvent(this.app.vault.on('delete', () => this.updateStatusBar()));
	}

	onunload() {
		// Clean up if needed
	}

	updateStatusBar() {
		const files = this.app.vault.getFiles();
		const markdownFiles = files.filter((file: TFile) => file.extension === 'md');
		const noteCount = markdownFiles.length;
		const totalSize = files.reduce((sum: number, file: TFile) => sum + file.stat.size, 0);
		const sizeInMB = totalSize / (1024 * 1024);
		const fmt = (n: number, opts?: Intl.NumberFormatOptions) =>
			n.toLocaleString(undefined, opts);
		this.noteCountItemEl.textContent = `${fmt(noteCount)} notes`;
		this.vaultSizeItemEl.textContent = `${fmt(sizeInMB, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}MB`;
	}
}