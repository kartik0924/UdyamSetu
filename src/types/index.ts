export type UserRole =
  | 'ENTREPRENEUR'
  | 'DEPARTMENT_OFFICER'
  | 'INSPECTOR'
  | 'DISTRICT_ADMIN'
  | 'STATE_ADMIN'
  | 'SUPER_ADMIN';

export type DepartmentType =
  | 'Industries'
  | 'Pollution Control'
  | 'Fire & Emergency'
  | 'Factory / Labour'
  | 'Electricity'
  | 'Water Resources'
  | 'Local Municipal'
  | 'Environment'
  | 'Land / Revenue'
  | 'Food Safety'
  | 'District Admin'
  | 'MSME Support';

export type ApprovalStatus =
  | 'NOT_STARTED'
  | 'PRE_VALIDATION'
  | 'SUBMITTED'
  | 'UNDER_SCRUTINY'
  | 'QUERY_RAISED'
  | 'QUERY_RESPONDED'
  | 'INSPECTION_PENDING'
  | 'INSPECTION_SCHEDULED'
  | 'DECISION_PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CLOSED';

export type DocumentValidationStatus =
  | 'VALID'
  | 'NEEDS_ATTENTION'
  | 'MISSING'
  | 'LOW_CONFIDENCE';

export interface Project {
  id: string;
  name: string;
  promoterName: string;
  promoterDin: string;
  promoterEmail?: string;
  promoterPhone?: string;
  enterpriseType: 'Micro' | 'Small' | 'Medium' | 'Large';
  sector: string;
  projectType: string;
  state: string;
  district: string;
  location: string;
  plotNumber?: string;
  landAreaSqMeters?: number;
  investmentCr: number;
  employees: number;
  landStatus: string;
  powerLoadKva: number;
  waterRequirementKld: number;
  pollutionCategory: 'White' | 'Green' | 'Orange' | 'Red';
  hazardousMaterials: boolean;
  products: string[];
  rawMaterials: string[];
  submissionReadiness: number;
  createdAt: string;
  status: 'Draft' | 'Analyzing' | 'Orchestrating' | 'Active';
  gstin?: string;
  udyamNumber?: string;
  panNumber?: string;
}

export interface ApprovalItem {
  id: string;
  projectId: string;
  name: string;
  category: string;
  department: DepartmentType;
  whyRequired: string;
  trigger: string;
  prerequisites: string[];
  canRunParallel: boolean;
  status: ApprovalStatus;
  nextAction: string;
  sourceRef: string;
  actName: string;
  estimatedDays: number;
  fee: number;
  statutoryAuthority: string;
  applicationId?: string;
  submittedAt?: string;
  approvedAt?: string;
}

export interface ApprovalDependency {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'prerequisite' | 'parallel' | 'dependent';
  label: string;
}

export interface DocumentItem {
  id: string;
  projectId: string;
  approvalId?: string;
  approvalName?: string;
  name: string;
  category: string;
  fileType: string;
  size: string;
  status: DocumentValidationStatus;
  validationFindings: string[];
  uploadedAt: string;
  verifiedAt?: string;
  fileUrl?: string;
  missingElements?: string[];
  confidence: number;
  documentNumber?: string;
  issuingAuthority?: string;
  issueDate?: string;
  validUntil?: string;
  extractedParameters?: Record<string, string>;
  isMandatory?: boolean;
}

export interface QueryItem {
  id: string;
  projectId: string;
  approvalId: string;
  approvalName: string;
  department: DepartmentType;
  subject: string;
  description: string;
  requiredDocuments: string[];
  raisedAt: string;
  dueDate: string;
  status: 'PENDING_RESPONSE' | 'RESPONDED' | 'RESOLVED';
  responseText?: string;
  responseDocuments?: string[];
  respondedAt?: string;
  officerRemarks?: string;
}

export interface InspectionChecklistItem {
  item: string;
  verified: boolean;
  notes: string;
}

export interface InspectionItem {
  id: string;
  projectId: string;
  approvalId: string;
  approvalName: string;
  department: DepartmentType;
  inspectorName: string;
  inspectorId: string;
  scheduledDate: string;
  status:
    | 'PENDING'
    | 'SCHEDULED'
    | 'COMPLETED'
    | 'RECOMMENDED_APPROVAL'
    | 'RECOMMENDED_REVISION';
  checklist: InspectionChecklistItem[];
  findings: string;
  evidenceUploaded: string[];
  remarks: string;
  coordinatedWindow?: string;
}

export interface ComplianceObligation {
  id: string;
  projectId: string;
  approvalName: string;
  obligationName: string;
  authority: string;
  frequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Annual' | 'One-Time';
  nextDueDate: string;
  status: 'UPCOMING' | 'DUE_SOON' | 'OVERDUE' | 'COMPLETED';
  complianceDocumentRequired: string;
  lastFulfilled?: string;
}

export interface GovernmentScheme {
  id: string;
  schemeName: string;
  ministry: string;
  department: string;
  benefitDescription: string;
  maxBenefit: string;
  eligibilityCriteria: string[];
  whyRelevant: string;
  documentsRequired: string[];
  officialPortalUrl: string;
  category:
    | 'Capital Subsidy'
    | 'Interest Subvention'
    | 'Employment'
    | 'Food Processing'
    | 'Infrastructure';
  isApplied?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type:
    | 'QUERY'
    | 'DOCUMENT'
    | 'INSPECTION'
    | 'SLA'
    | 'APPROVAL'
    | 'COMPLIANCE'
    | 'SCHEME'
    | 'SYSTEM';
  read: boolean;
  timestamp: string;
  linkTo: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  previousState?: string;
  newState?: string;
}

export interface SLARecord {
  approvalId: string;
  approvalName: string;
  department: DepartmentType;
  standardDays: number;
  elapsedDays: number;
  dueDate: string;
  slaStatus: 'ON_TRACK' | 'APPROACHING' | 'RISK' | 'OVERDUE';
}
