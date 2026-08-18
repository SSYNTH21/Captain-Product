export type ManualStatus = 'In progress' | 'Pending approval';
export type DemoStatus = ManualStatus | 'Validated';

export interface FeatureDemo {
  flowTitle: string;
  route: string;
  createdDate: string;
  lastUpdated: string;
  teamApproved: boolean;
  stakeholderApproved: boolean;
  manualStatus: ManualStatus;
}

export function demoStatus(demo: FeatureDemo): DemoStatus {
  return demo.teamApproved && demo.stakeholderApproved ? 'Validated' : demo.manualStatus;
}
