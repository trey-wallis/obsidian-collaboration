import { App, PluginSettingTab, Setting } from "obsidian";
import LiveSharePlugin from "main";

export class LiveShareSettingsTab extends PluginSettingTab {
	plugin: LiveSharePlugin;

	constructor(app: App, plugin: LiveSharePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h2", { text: "Live Share Settings" });

		new Setting(containerEl)
			.setName("Server URL")
			.setDesc(
				"The url and port of the live share server\nhttps://domain.com:port"
			)
			.addText((text) =>
				text
					.setPlaceholder("Server url...")
					.setValue(this.plugin.settings.serverUrl)
					.onChange(async (value) => {
						this.plugin.settings.serverUrl = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Vault path")
			.setDesc(
				"The absolute path of your vault\n/users/my-user/Desktop/vault"
			)
			.addText((text) =>
				text
					.setPlaceholder("Path...")
					.setValue(this.plugin.settings.vaultPath)
					.onChange(async (value) => {
						this.plugin.settings.vaultPath = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Live share on load")
			.setDesc("Start live sharing when you open Obsidian")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.connectOnLoad);
				toggle.onChange(async (value) => {
					this.plugin.settings.connectOnLoad = value;
					await this.plugin.saveSettings();
				});
			});
	}
}
