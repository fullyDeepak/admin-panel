export type DashboardResponseType = {
  village_id: number;
  village_name: string;
  mandal_name: string;
  district_name: string;
  replacement_status: boolean;
  onboarding_status: boolean;
  replacement_count: string;
  temp_projects: string;
  projects: string;
  rera_untagged: string;
  sros: {
    id: number;
    code: number;
    name: string;
  }[];
  developers: string;
  developer_groups: string;
  jvs: string;
};
