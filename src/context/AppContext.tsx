import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  ApprovalItem,
  ApprovalDependency,
  DocumentItem,
  QueryItem,
  InspectionItem,
  ComplianceObligation,
  GovernmentScheme,
  NotificationItem,
  AuditLog,
  SLARecord,
  UserRole,
  ApprovalStatus,
} from '../types';
import {
  DEMO_USERS,
  DemoUser,
  INITIAL_PROJECT,
  INITIAL_APPROVALS,
  INITIAL_DEPENDENCIES,
  INITIAL_DOCUMENTS,
  INITIAL_QUERIES,
  INITIAL_INSPECTIONS,
  INITIAL_COMPLIANCE,
  INITIAL_SCHEMES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SLAS,
} from '../data/demoData';

interface AppContextType {
  currentUser: DemoUser;
  activeRoleKey: string;
  currentProject: Project;
  allProjects: Project[];
  approvals: ApprovalItem[];
  dependencies: ApprovalDependency[];
  documents: DocumentItem[];
  queries: QueryItem[];
  inspections: InspectionItem[];
  compliance: ComplianceObligation[];
  schemes: GovernmentScheme[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  slas: SLARecord[];
  isDemoMode: boolean;
  switchRole: (roleKey: string) => void;
  logout: () => void;
  setCurrentProject: (proj: Project) => void;
  createProject: (projData: Partial<Project>) => Project;
  updateApprovalStatus: (approvalId: string, status: ApprovalStatus, details?: string) => void;
  submitApplication: (approvalId: string) => void;
  raiseQuery: (data: {
    approvalId: string;
    approvalName: string;
    department: any;
    subject: string;
    description: string;
    requiredDocuments: string[];
    dueDate: string;
  }) => void;
  respondQuery: (queryId: string, responseText: string, documents: string[]) => void;
  resolveQuery: (queryId: string, officerRemarks: string) => void;
  scheduleInspection: (data: {
    approvalId: string;
    approvalName: string;
    department: any;
    inspectorName: string;
    inspectorId: string;
    scheduledDate: string;
    checklist: { item: string; verified: boolean; notes: string }[];
    coordinatedWindow?: string;
  }) => void;
  completeInspection: (
    inspectionId: string,
    status: InspectionItem['status'],
    findings: string,
    checklist: InspectionItem['checklist'],
    evidence: string[],
    remarks: string
  ) => void;
  uploadDocument: (doc: {
    id?: string;
    approvalId?: string;
    approvalName?: string;
    name: string;
    category: string;
    fileType: string;
    size: string;
    documentNumber?: string;
    issuingAuthority?: string;
    issueDate?: string;
    validUntil?: string;
    extractedParameters?: Record<string, string>;
  }) => DocumentItem;
  updateDocumentStatus: (docId: string, status: DocumentItem['status'], findings: string[]) => void;
  resolveDocumentIssue: (docId: string) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  applyForScheme: (schemeId: string) => void;
  grantStatutoryApproval: (approvalId: string, remarks?: string) => void;
  rejectStatutoryApproval: (approvalId: string, reason: string) => void;
  resetToDemoData: () => void;
  authenticateUser: (
    emailOrKey: string,
    passwordInput: string
  ) => { success: boolean; error?: string; user?: DemoUser };
  canApproveApproval: (approval: ApprovalItem) => { allowed: boolean; reason?: string };
  canRaiseQuery: (approval: ApprovalItem) => { allowed: boolean; reason?: string };
  canScheduleInspection: (approval: ApprovalItem) => { allowed: boolean; reason?: string };
  canConductInspection: () => { allowed: boolean; reason?: string };
  canSubmitApplication: () => { allowed: boolean; reason?: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'udyamsetu_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRoleKey, setActiveRoleKey] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('udyamsetu_auth_role');
      if (saved && DEMO_USERS[saved]) return saved;
    } catch (e) {}
    return 'entrepreneur';
  });
  const [currentUser, setCurrentUser] = useState<DemoUser>(() => {
    try {
      const saved = localStorage.getItem('udyamsetu_auth_role');
      if (saved && DEMO_USERS[saved]) return DEMO_USERS[saved];
    } catch (e) {}
    return DEMO_USERS.entrepreneur;
  });
  const [currentProject, setCurrentProject] = useState<Project>(INITIAL_PROJECT);
  const [allProjects, setAllProjects] = useState<Project[]>([INITIAL_PROJECT]);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(INITIAL_APPROVALS);
  const [dependencies, setDependencies] = useState<ApprovalDependency[]>(INITIAL_DEPENDENCIES);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [queries, setQueries] = useState<QueryItem[]>(INITIAL_QUERIES);
  const [inspections, setInspections] = useState<InspectionItem[]>(INITIAL_INSPECTIONS);
  const [compliance, setCompliance] = useState<ComplianceObligation[]>(INITIAL_COMPLIANCE);
  const [schemes, setSchemes] = useState<GovernmentScheme[]>(INITIAL_SCHEMES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [slas, setSlas] = useState<SLARecord[]>(INITIAL_SLAS);
  const [isDemoMode] = useState<boolean>(true);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentProject) setCurrentProject(parsed.currentProject);
        if (parsed.approvals) setApprovals(parsed.approvals);
        if (parsed.documents) setDocuments(parsed.documents);
        if (parsed.queries) setQueries(parsed.queries);
        if (parsed.inspections) setInspections(parsed.inspections);
        if (parsed.compliance) setCompliance(parsed.compliance);
        if (parsed.schemes) setSchemes(parsed.schemes);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      }
    } catch (e) {
      console.warn('Failed to load local state:', e);
    }
  }, []);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentProject,
          approvals,
          documents,
          queries,
          inspections,
          compliance,
          schemes,
          notifications,
          auditLogs,
        })
      );
    } catch (e) {
      console.warn('Failed to persist local state:', e);
    }
  }, [currentProject, approvals, documents, queries, inspections, compliance, schemes, notifications, auditLogs]);

  const addAuditLog = (action: string, entity: string, entityId: string, details: string, prev?: string, next?: string) => {
    const newLog: AuditLog = {
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      user: currentUser.name,
      role: currentUser.role,
      action,
      entity,
      entityId,
      details,
      previousState: prev,
      newState: next,
    };
    setAuditLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  const canApproveApproval = (approval: ApprovalItem): { allowed: boolean; reason?: string } => {
    if (currentUser.role === 'SUPER_ADMIN') {
      return { allowed: true };
    }
    if (currentUser.role === 'DEPARTMENT_OFFICER') {
      if (currentUser.department === approval.department) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: `Statutory Jurisdiction Denial: You are currently acting as an officer of "${currentUser.department}". Statutory authority to sanction or reject "${approval.name}" belongs exclusively to designated officers of "${approval.department}".`,
      };
    }
    if (currentUser.role === 'INSPECTOR') {
      return {
        allowed: false,
        reason: 'Separation of Powers: Field Safety Inspectors conduct technical site verification and submit inspection reports. Final statutory approval certificates can only be sanctioned by the designated Department Officer.',
      };
    }
    if (currentUser.role === 'ENTREPRENEUR') {
      return {
        allowed: false,
        reason: 'Access Denied: Industry promoters and applicants cannot self-sanction statutory government approvals.',
      };
    }
    if (currentUser.role === 'DISTRICT_ADMIN') {
      return {
        allowed: false,
        reason: 'Statutory Limitation: District Administration oversees timeline enforcement and coordinates DLICC reviews, but individual statutory sanctions must be issued by the competent line department officer.',
      };
    }
    if (currentUser.role === 'STATE_ADMIN') {
      return {
        allowed: false,
        reason: 'Policy Oversight: State Administration reviews department-wide compliance and policy governance, while statutory approval execution rests with the designated sanctioning authority of the department.',
      };
    }
    return {
      allowed: false,
      reason: 'Access Denied: Your assigned role does not hold statutory sanction authority.',
    };
  };

  const canRaiseQuery = (approval: ApprovalItem): { allowed: boolean; reason?: string } => {
    if (currentUser.role === 'SUPER_ADMIN') return { allowed: true };
    if (currentUser.role === 'DEPARTMENT_OFFICER') {
      if (currentUser.department === approval.department) return { allowed: true };
      return {
        allowed: false,
        reason: `Jurisdiction Restriction: Only scrutiny officers of ${approval.department} can issue formal statutory queries for this docket.`,
      };
    }
    return {
      allowed: false,
      reason: 'Access Denied: Only authorized department scrutiny officers can issue formal queries.',
    };
  };

  const canScheduleInspection = (approval: ApprovalItem): { allowed: boolean; reason?: string } => {
    if (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'DISTRICT_ADMIN') return { allowed: true };
    if (currentUser.role === 'DEPARTMENT_OFFICER') {
      if (currentUser.department === approval.department) return { allowed: true };
      return {
        allowed: false,
        reason: `Jurisdiction Restriction: Only officers of ${approval.department} or District Coordinators can order site inspections.`,
      };
    }
    return {
      allowed: false,
      reason: 'Access Denied: Only Department Officers and District Administrators can issue formal inspection orders.',
    };
  };

  const canConductInspection = (): { allowed: boolean; reason?: string } => {
    if (currentUser.role === 'INSPECTOR' || currentUser.role === 'SUPER_ADMIN') {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Role Restriction: Only designated Safety & Field Inspectors can conduct site visits and record technical checklist observations.',
    };
  };

  const canSubmitApplication = (): { allowed: boolean; reason?: string } => {
    if (currentUser.role === 'ENTREPRENEUR' || currentUser.role === 'SUPER_ADMIN') {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Role Restriction: Official applications can only be submitted by registered industry promoters/entrepreneurs.',
    };
  };

  const authenticateUser = (
    emailOrKey: string,
    passwordInput: string
  ): { success: boolean; error?: string; user?: DemoUser } => {
    let foundKey = Object.keys(DEMO_USERS).find(
      (k) => k === emailOrKey || DEMO_USERS[k].email.toLowerCase() === emailOrKey.toLowerCase()
    );

    if (!foundKey) {
      return {
        success: false,
        error: 'Official profile not found in authenticated registry. Please select a valid designated role.',
      };
    }

    const user = DEMO_USERS[foundKey];
    const validPassword = user.password || 'Demo@123';

    if (!passwordInput || passwordInput.trim() !== validPassword) {
      addAuditLog(
        'AUTH_FAILURE',
        'UserSession',
        user.id,
        `Failed authentication attempt for ${user.name} (${user.role}) - Invalid password provided.`
      );
      return {
        success: false,
        error: `Authentication Denied: Invalid security credentials for ${user.name}. Prototype password is "Demo@123".`,
      };
    }

    setActiveRoleKey(foundKey);
    setCurrentUser(user);
    try {
      localStorage.setItem('udyamsetu_auth_role', foundKey);
    } catch (e) {}
    addAuditLog(
      'AUTHENTICATED_LOGIN',
      'UserSession',
      user.id,
      `Authenticated session for ${user.name} (${user.role} - ${user.department || user.company || 'Governance'})`
    );

    return { success: true, user };
  };

  const logout = () => {
    try {
      localStorage.removeItem('udyamsetu_auth_role');
    } catch (e) {}
    addAuditLog(
      'USER_LOGOUT',
      'UserSession',
      currentUser.id,
      `User ${currentUser.name} (${currentUser.role}) logged out.`
    );
    setActiveRoleKey('entrepreneur');
    setCurrentUser(DEMO_USERS.entrepreneur);
  };

  const switchRole = (roleKey: string) => {
    if (DEMO_USERS[roleKey]) {
      setActiveRoleKey(roleKey);
      setCurrentUser(DEMO_USERS[roleKey]);
      try {
        localStorage.setItem('udyamsetu_auth_role', roleKey);
      } catch (e) {}
      addAuditLog(
        'ROLE_SWITCH',
        'UserSession',
        DEMO_USERS[roleKey].id,
        `Switched active role to ${DEMO_USERS[roleKey].role} (${DEMO_USERS[roleKey].name})`
      );
    }
  };

  const createProject = (projData: Partial<Project>): Project => {
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      name: projData.name || 'New Industrial Unit',
      promoterName: projData.promoterName || currentUser.name,
      promoterDin: projData.promoterDin || 'DIN-99999999',
      enterpriseType: projData.enterpriseType || 'Small',
      sector: projData.sector || 'Agro & Food Processing',
      projectType: projData.projectType || 'New Manufacturing Unit',
      state: projData.state || 'Bihar',
      district: projData.district || 'Vaishali',
      location: projData.location || 'Industrial Area',
      investmentCr: projData.investmentCr || 5.0,
      employees: projData.employees || 50,
      landStatus: projData.landStatus || 'Allotted',
      powerLoadKva: projData.powerLoadKva || 100,
      waterRequirementKld: projData.waterRequirementKld || 20,
      pollutionCategory: projData.pollutionCategory || 'Orange',
      hazardousMaterials: projData.hazardousMaterials || false,
      products: projData.products || ['Finished Goods'],
      rawMaterials: projData.rawMaterials || ['Agri Raw Material'],
      submissionReadiness: 65,
      createdAt: new Date().toISOString(),
      status: 'Analyzing',
    };

    setAllProjects((prev) => [newProj, ...prev]);
    setCurrentProject(newProj);
    addAuditLog('PROJECT_CREATED', 'Project', newProj.id, `Created new project ${newProj.name}`);
    return newProj;
  };

  const updateApprovalStatus = (approvalId: string, status: ApprovalStatus, details?: string) => {
    setApprovals((prev) =>
      prev.map((appr) => {
        if (appr.id === approvalId) {
          const oldStatus = appr.status;
          addAuditLog(
            'APPROVAL_STATUS_CHANGED',
            'Approval',
            approvalId,
            details || `Status updated from ${oldStatus} to ${status}`,
            oldStatus,
            status
          );
          return { ...appr, status };
        }
        return appr;
      })
    );
  };

  const submitApplication = (approvalId: string) => {
    setApprovals((prev) =>
      prev.map((appr) => {
        if (appr.id === approvalId) {
          const updated = {
            ...appr,
            status: 'UNDER_SCRUTINY' as ApprovalStatus,
            submittedAt: new Date().toISOString(),
            applicationId: appr.applicationId || `APP-${appr.department.slice(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            nextAction: 'Under formal statutory scrutiny by departmental scrutiny officer.',
          };
          addAuditLog('APPLICATION_SUBMITTED', 'Application', approvalId, `Submitted application for ${appr.name}`, appr.status, 'UNDER_SCRUTINY');
          return updated;
        }
        return appr;
      })
    );

    // Push notification to department
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'New Application Submitted for Scrutiny',
      message: `Mithila Foods Pvt. Ltd. submitted formal docket for approval #${approvalId}.`,
      type: 'APPROVAL',
      read: false,
      timestamp: new Date().toISOString(),
      linkTo: '/applications',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const raiseQuery = (data: {
    approvalId: string;
    approvalName: string;
    department: any;
    subject: string;
    description: string;
    requiredDocuments: string[];
    dueDate: string;
  }) => {
    const newQry: QueryItem = {
      id: `qry_${Date.now()}`,
      projectId: currentProject.id,
      approvalId: data.approvalId,
      approvalName: data.approvalName,
      department: data.department,
      subject: data.subject,
      description: data.description,
      requiredDocuments: data.requiredDocuments,
      raisedAt: new Date().toISOString(),
      dueDate: data.dueDate,
      status: 'PENDING_RESPONSE',
    };

    setQueries((prev) => [newQry, ...prev]);
    updateApprovalStatus(data.approvalId, 'QUERY_RAISED', `Query raised: ${data.subject}`);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Statutory Query Raised by ${data.department}`,
      message: data.subject,
      type: 'QUERY',
      read: false,
      timestamp: new Date().toISOString(),
      linkTo: '/queries',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    addAuditLog('QUERY_RAISED', 'Query', newQry.id, `Raised query for ${data.approvalName}: "${data.subject}"`);
  };

  const respondQuery = (queryId: string, responseText: string, docNames: string[]) => {
    setQueries((prev) =>
      prev.map((q) => {
        if (q.id === queryId) {
          addAuditLog('QUERY_RESPONDED', 'Query', queryId, `Entrepreneur responded with clarification and ${docNames.length} document(s)`);
          return {
            ...q,
            status: 'RESPONDED',
            responseText,
            responseDocuments: docNames,
            respondedAt: new Date().toISOString(),
          };
        }
        return q;
      })
    );

    // Update approval status to QUERY_RESPONDED
    const targetQry = queries.find((q) => q.id === queryId);
    if (targetQry) {
      updateApprovalStatus(targetQry.approvalId, 'QUERY_RESPONDED', 'Entrepreneur submitted response to query');
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: `Response Received for Query #${queryId}`,
        message: `Entrepreneur submitted compliance response for ${targetQry.approvalName}.`,
        type: 'QUERY',
        read: false,
        timestamp: new Date().toISOString(),
        linkTo: '/department-scrutiny',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const resolveQuery = (queryId: string, officerRemarks: string) => {
    setQueries((prev) =>
      prev.map((q) => {
        if (q.id === queryId) {
          addAuditLog('QUERY_RESOLVED', 'Query', queryId, `Department accepted response: ${officerRemarks}`);
          return {
            ...q,
            status: 'RESOLVED',
            officerRemarks,
          };
        }
        return q;
      })
    );

    const targetQry = queries.find((q) => q.id === queryId);
    if (targetQry) {
      updateApprovalStatus(targetQry.approvalId, 'UNDER_SCRUTINY', 'Query resolved; returned to formal scrutiny');
    }
  };

  const scheduleInspection = (data: {
    approvalId: string;
    approvalName: string;
    department: any;
    inspectorName: string;
    inspectorId: string;
    scheduledDate: string;
    checklist: { item: string; verified: boolean; notes: string }[];
    coordinatedWindow?: string;
  }) => {
    const newInsp: InspectionItem = {
      id: `insp_${Date.now()}`,
      projectId: currentProject.id,
      approvalId: data.approvalId,
      approvalName: data.approvalName,
      department: data.department,
      inspectorName: data.inspectorName,
      inspectorId: data.inspectorId,
      scheduledDate: data.scheduledDate,
      status: 'SCHEDULED',
      checklist: data.checklist,
      findings: 'Site inspection date fixed. Entrepreneur notified to keep physical compliance records ready.',
      evidenceUploaded: [],
      remarks: data.coordinatedWindow ? `Joint inspection window: ${data.coordinatedWindow}` : '',
      coordinatedWindow: data.coordinatedWindow,
    };

    setInspections((prev) => [newInsp, ...prev]);
    updateApprovalStatus(data.approvalId, 'INSPECTION_SCHEDULED', `Site verification scheduled for ${new Date(data.scheduledDate).toLocaleDateString()}`);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Statutory Inspection Scheduled',
      message: `${data.department} scheduled site visit by ${data.inspectorName} on ${new Date(data.scheduledDate).toLocaleDateString()}.`,
      type: 'INSPECTION',
      read: false,
      timestamp: new Date().toISOString(),
      linkTo: '/inspections',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    addAuditLog('INSPECTION_SCHEDULED', 'Inspection', newInsp.id, `Scheduled inspection for ${data.approvalName} on ${data.scheduledDate}`);
  };

  const completeInspection = (
    inspectionId: string,
    status: InspectionItem['status'],
    findings: string,
    checklist: InspectionItem['checklist'],
    evidence: string[],
    remarks: string
  ) => {
    setInspections((prev) =>
      prev.map((insp) => {
        if (insp.id === inspectionId) {
          addAuditLog('INSPECTION_COMPLETED', 'Inspection', inspectionId, `Inspection completed with finding: ${status}`);
          return {
            ...insp,
            status,
            findings,
            checklist,
            evidenceUploaded: [...insp.evidenceUploaded, ...evidence],
            remarks,
          };
        }
        return insp;
      })
    );

    const targetInsp = inspections.find((i) => i.id === inspectionId);
    if (targetInsp) {
      if (status === 'RECOMMENDED_APPROVAL') {
        updateApprovalStatus(targetInsp.approvalId, 'DECISION_PENDING', 'Site inspection successful; recommended for statutory decision');
      } else {
        updateApprovalStatus(targetInsp.approvalId, 'UNDER_SCRUTINY', 'Inspection recommended revision of safety parameters');
      }

      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: 'Site Inspection Report Submitted',
        message: `Inspector concluded site inspection for ${targetInsp.approvalName}. Status: ${status.replace('_', ' ')}.`,
        type: 'INSPECTION',
        read: false,
        timestamp: new Date().toISOString(),
        linkTo: '/inspections',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const uploadDocument = (doc: {
    id?: string;
    approvalId?: string;
    approvalName?: string;
    name: string;
    category: string;
    fileType: string;
    size: string;
    documentNumber?: string;
    issuingAuthority?: string;
    issueDate?: string;
    validUntil?: string;
    extractedParameters?: Record<string, string>;
  }): DocumentItem => {
    let resultDoc: DocumentItem;
    const existingIndex = documents.findIndex(
      (d) => (doc.id && d.id === doc.id) || d.name.toLowerCase() === doc.name.toLowerCase()
    );

    if (existingIndex >= 0) {
      const existing = documents[existingIndex];
      resultDoc = {
        ...existing,
        name: doc.name || existing.name,
        category: doc.category || existing.category,
        fileType: doc.fileType || existing.fileType,
        size: doc.size || existing.size,
        documentNumber: doc.documentNumber || existing.documentNumber,
        issuingAuthority: doc.issuingAuthority || existing.issuingAuthority,
        issueDate: doc.issueDate || existing.issueDate,
        validUntil: doc.validUntil || existing.validUntil,
        extractedParameters: doc.extractedParameters || existing.extractedParameters,
        status: 'VALID',
        validationFindings: [
          'Statutory parameter validation passed.',
          'Digital certificate authenticity confirmed.',
          'Parameters successfully mapped into Single Window docket.',
        ],
        uploadedAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
        confidence: 0.97,
      };

      const updatedDocs = [...documents];
      updatedDocs[existingIndex] = resultDoc;
      setDocuments(updatedDocs);
      addAuditLog('DOCUMENT_FILED_UPDATED', 'Document', resultDoc.id, `Filled and validated ${resultDoc.name} (#${resultDoc.documentNumber || 'NEW'})`);
    } else {
      resultDoc = {
        id: doc.id || `doc_${Date.now()}`,
        projectId: currentProject.id,
        approvalId: doc.approvalId,
        approvalName: doc.approvalName,
        name: doc.name,
        category: doc.category,
        fileType: doc.fileType || 'PDF',
        size: doc.size || '3.5 MB',
        documentNumber: doc.documentNumber,
        issuingAuthority: doc.issuingAuthority,
        issueDate: doc.issueDate || new Date().toISOString().split('T')[0],
        validUntil: doc.validUntil,
        extractedParameters: doc.extractedParameters,
        status: 'VALID',
        validationFindings: ['AI pre-validation completed.', 'Seal and signature detection passed.', 'Plot coordinates confirmed.'],
        uploadedAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
        confidence: 0.96,
      };

      setDocuments((prev) => [resultDoc, ...prev]);
      addAuditLog('DOCUMENT_UPLOADED', 'Document', resultDoc.id, `Uploaded new artifact ${resultDoc.name} (${resultDoc.category})`);
    }

    // Recalculate submission readiness towards 100%
    setCurrentProject((prevProj) => {
      const nextReadiness = Math.min(98, prevProj.submissionReadiness + 3);
      return { ...prevProj, submissionReadiness: nextReadiness };
    });

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Statutory Document Filed & Validated',
      message: `${resultDoc.name} (${resultDoc.category}) successfully attached to project docket.`,
      type: 'DOCUMENT',
      read: false,
      timestamp: new Date().toISOString(),
      linkTo: '/documents',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return resultDoc;
  };

  const updateDocumentStatus = (docId: string, status: DocumentItem['status'], findings: string[]) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          return { ...d, status, validationFindings: findings };
        }
        return d;
      })
    );
  };

  const resolveDocumentIssue = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          addAuditLog('DOCUMENT_RESOLVED', 'Document', docId, `Resolved validation flag on ${d.name}`);
          return {
            ...d,
            status: 'VALID',
            missingElements: [],
            validationFindings: [...d.validationFindings, 'Updated document revision validated successfully by AI pre-validation.'],
            confidence: 0.98,
          };
        }
        return d;
      })
    );

    // Update project readiness score
    setCurrentProject((prev) => ({
      ...prev,
      submissionReadiness: Math.min(96, prev.submissionReadiness + 5),
    }));
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const applyForScheme = (schemeId: string) => {
    setSchemes((prev) =>
      prev.map((s) => {
        if (s.id === schemeId) {
          addAuditLog('SCHEME_APPLICATION', 'Scheme', schemeId, `Initiated application for government support: ${s.schemeName}`);
          return { ...s, isApplied: true };
        }
        return s;
      })
    );

    const targetScheme = schemes.find((s) => s.id === schemeId);
    if (targetScheme) {
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: 'Scheme Application Docket Prepared',
        message: `Application packet for ${targetScheme.schemeName} generated with verified project profile.`,
        type: 'SCHEME',
        read: false,
        timestamp: new Date().toISOString(),
        linkTo: '/government-support',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const grantStatutoryApproval = (approvalId: string, remarks?: string) => {
    const targetAppr = approvals.find((a) => a.id === approvalId);
    if (targetAppr) {
      const check = canApproveApproval(targetAppr);
      if (!check.allowed) {
        addAuditLog(
          'UNAUTHORIZED_SANCTION_ATTEMPT',
          'Approval',
          approvalId,
          `Statutory approval blocked for ${currentUser.name} (${currentUser.role}): ${check.reason}`
        );
        throw new Error(check.reason);
      }
    }

    setApprovals((prev) =>
      prev.map((a) => {
        if (a.id === approvalId) {
          const updated = {
            ...a,
            status: 'APPROVED' as ApprovalStatus,
            approvedAt: new Date().toISOString(),
            nextAction: 'Statutory certificate sanctioned and digitally signed.',
          };
          addAuditLog(
            'APPROVAL_GRANTED',
            'Approval',
            approvalId,
            remarks || `Authorized Department Officer granted statutory approval for ${a.name}`,
            a.status,
            'APPROVED'
          );
          return updated;
        }
        return a;
      })
    );

    if (targetAppr) {
      // Add a compliance obligation automatically upon approval
      const newComp: ComplianceObligation = {
        id: `comp_${Date.now()}`,
        projectId: currentProject.id,
        approvalName: targetAppr.name,
        obligationName: `Post-Approval Periodic Compliance & Environmental Log (${targetAppr.category})`,
        authority: targetAppr.statutoryAuthority,
        frequency: 'Annual',
        nextDueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'UPCOMING',
        complianceDocumentRequired: 'Annual Self-Declaration & Statutory Inspection Register',
      };
      setCompliance((prev) => [newComp, ...prev]);

      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: `Statutory Approval Granted: ${targetAppr.name}`,
        message: `Competent Authority signed certificate. Active obligation added to Compliance Continuum.`,
        type: 'APPROVAL',
        read: false,
        timestamp: new Date().toISOString(),
        linkTo: '/compliance',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const rejectStatutoryApproval = (approvalId: string, reason: string) => {
    const targetAppr = approvals.find((a) => a.id === approvalId);
    if (targetAppr) {
      const check = canApproveApproval(targetAppr);
      if (!check.allowed) {
        addAuditLog(
          'UNAUTHORIZED_REJECTION_ATTEMPT',
          'Approval',
          approvalId,
          `Statutory rejection blocked for ${currentUser.name} (${currentUser.role}): ${check.reason}`
        );
        throw new Error(check.reason);
      }
    }

    setApprovals((prev) =>
      prev.map((a) => {
        if (a.id === approvalId) {
          addAuditLog('APPROVAL_REJECTED', 'Approval', approvalId, `Statutory authority rejected: ${reason}`, a.status, 'REJECTED');
          return {
            ...a,
            status: 'REJECTED' as ApprovalStatus,
            nextAction: `Rejected with reason: ${reason}. Appeal may be lodged within 30 days.`,
          };
        }
        return a;
      })
    );
  };

  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentProject(INITIAL_PROJECT);
    setAllProjects([INITIAL_PROJECT]);
    setApprovals(INITIAL_APPROVALS);
    setDependencies(INITIAL_DEPENDENCIES);
    setDocuments(INITIAL_DOCUMENTS);
    setQueries(INITIAL_QUERIES);
    setInspections(INITIAL_INSPECTIONS);
    setCompliance(INITIAL_COMPLIANCE);
    setSchemes(INITIAL_SCHEMES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSlas(INITIAL_SLAS);
    setActiveRoleKey('entrepreneur');
    setCurrentUser(DEMO_USERS.entrepreneur);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRoleKey,
        currentProject,
        allProjects,
        approvals,
        dependencies,
        documents,
        queries,
        inspections,
        compliance,
        schemes,
        notifications,
        auditLogs,
        slas,
        isDemoMode,
        switchRole,
        logout,
        setCurrentProject,
        createProject,
        updateApprovalStatus,
        submitApplication,
        raiseQuery,
        respondQuery,
        resolveQuery,
        scheduleInspection,
        completeInspection,
        uploadDocument,
        updateDocumentStatus,
        resolveDocumentIssue,
        markNotificationRead,
        markAllNotificationsRead,
        applyForScheme,
        grantStatutoryApproval,
        rejectStatutoryApproval,
        resetToDemoData,
        authenticateUser,
        canApproveApproval,
        canRaiseQuery,
        canScheduleInspection,
        canConductInspection,
        canSubmitApplication,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
