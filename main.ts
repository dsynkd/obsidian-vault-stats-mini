import { Plugin, TFile } from 'obsidian';

// Remember to rename these classes and interfaces!

export default class VaultStatsPlugin extends Plugin {
	noteCountItemEl: HTMLElement;
	vaultSizeItemEl: HTMLElement;
	noteCount: number;
	vaultSize: number;

	async onload() {
		this.noteCount = 0;
		this.vaultSize = 0;
		this.noteCountItemEl = this.addStatusBarItem();
		this.vaultSizeItemEl = this.addStatusBarItem();
		this.initalizeStats();
		this.registerEvent(this.app.vault.on('create', () => {
			this.noteCount++;
			this.updateStatusBarUI();
		}));
		this.registerEvent(this.app.vault.on('delete', () => {
			this.noteCount--;
			this.updateStatusBarUI();
		}));
	}

	onunload() {
		// Clean up if needed
	}

	initalizeStats() {
		const files = this.app.vault.getFiles();
		const markdownFiles = files.filter((file: TFile) => file.extension === 'md');
		const noteCount = markdownFiles.length;
		const totalSize = files.reduce((sum: number, file: TFile) => sum + file.stat.size, 0);
		const sizeInMB = (totalSize / (1024 * 1024));
		this.noteCount = noteCount;
		this.vaultSize = sizeInMB;
		this.updateStatusBarUI();
	}

	updateStatusBarUI() {
		this.noteCountItemEl.textContent = `${this.noteCount} notes`;
		this.vaultSizeItemEl.textContent = `${this.vaultSize.toFixed(2)}MB size`;
	}
}