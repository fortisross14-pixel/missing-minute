import { officeScene } from './01-department-office/scene.config';
import { interactOffice } from './01-department-office/scene.logic';
import { officeDialogues } from './01-department-office/scene.dialogue';
import { harborScene } from './02-gannets-end-harbor/scene.config';
import { interactHarbor } from './02-gannets-end-harbor/scene.logic';
import { harborDialogues } from './02-gannets-end-harbor/scene.dialogue';

export const SCENES = {
  [officeScene.id]: { ...officeScene, interact:interactOffice },
  [harborScene.id]: { ...harborScene, interact:interactHarbor }
};

export const DIALOGUES = { ...officeDialogues, ...harborDialogues };
