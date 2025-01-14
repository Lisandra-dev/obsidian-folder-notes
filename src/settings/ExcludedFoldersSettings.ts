import { addExcludeFolderListItem, ExcludedFolder, addExcludedFolder, ExcludePattern, addExcludePatternListItem } from '../excludedFolder';
import { Setting } from 'obsidian';
import { SettingsTab } from "./SettingsTab";


export async function renderExcludeFolders(settingsTab: SettingsTab) {
    settingsTab.settingsPage.createEl('h1', { text: 'Exclude folders settings' });
    const containerEl = settingsTab.settingsPage;
    const manageExcluded = new Setting(containerEl)
        .setHeading()
        .setClass('fn-excluded-folder-heading')
        .setName('Manage excluded folders');
    const desc3 = document.createDocumentFragment();
    desc3.append(
        'Add {regex} at the beginning of the folder name to use a regex pattern.',
        desc3.createEl('br'),
        'Use * before and after to exclude folders that include the name between the *s.',
        desc3.createEl('br'),
        'Use * before the folder name to exclude folders that end with the folder name.',
        desc3.createEl('br'),
        'Use * after the folder name to exclude folders that start with the folder name.',
    );
    manageExcluded.setDesc(desc3);
    manageExcluded.infoEl.appendText('The regexes and wildcards are only for the folder name, not the path.');
    manageExcluded.infoEl.createEl('br');
    manageExcluded.infoEl.appendText('If you want to switch to a folder path delete the pattern first.');
    manageExcluded.infoEl.style.color = settingsTab.app.vault.getConfig('accentColor') as string || '#7d5bed';

    new Setting(containerEl)
        .setName('Add excluded folder')
        .setClass('add-exclude-folder-item')
        .addButton((cb) => {
            cb.setIcon('plus');
            cb.setClass('add-exclude-folder');
            cb.setTooltip('Add excluded folder');
            cb.onClick(() => {
                const excludedFolder = new ExcludedFolder('', settingsTab.plugin.settings.excludeFolders.length);
                addExcludeFolderListItem(settingsTab, containerEl, excludedFolder);
                addExcludedFolder(settingsTab.plugin, excludedFolder);
                settingsTab.display();
            });
        });
    settingsTab.plugin.settings.excludeFolders.sort((a, b) => a.position - b.position).forEach((excludedFolder) => {
        if (excludedFolder.string?.trim() !== '' && excludedFolder.path?.trim() === '') {
            addExcludePatternListItem(settingsTab, containerEl, excludedFolder);
        } else {
            addExcludeFolderListItem(settingsTab, containerEl, excludedFolder);
        }
    });
}