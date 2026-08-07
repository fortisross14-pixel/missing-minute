import { officeScene } from './01-department-office/scene.config';
import { interactOffice } from './01-department-office/scene.logic';
import { officeDialogues } from './01-department-office/scene.dialogue';
import { harborScene } from './02-gannets-end-harbor/scene.config';
import { interactHarbor } from './02-gannets-end-harbor/scene.logic';
import { harborDialogues } from './02-gannets-end-harbor/scene.dialogue';
import { lighthouseScene } from './03-gannets-end-lighthouse/scene.config';
import { interactLighthouse } from './03-gannets-end-lighthouse/scene.logic';
import { lighthouseDialogues } from './03-gannets-end-lighthouse/scene.dialogue';

export const SCENES = {
  [officeScene.id]: { ...officeScene, interact:interactOffice },
  [harborScene.id]: { ...harborScene, interact:interactHarbor },
  [lighthouseScene.id]: { ...lighthouseScene, interact:interactLighthouse }
};

export const DIALOGUES = { ...officeDialogues, ...harborDialogues, ...lighthouseDialogues };
