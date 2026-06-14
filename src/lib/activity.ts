import { prisma } from './prisma';

export interface ActivityItem {
  id: string;
  type: 'report' | 'issue' | 'material_request';
  title: string;
  description: string;
  userName: string;
  date: Date;
  projectId: string;
  projectName: string;
  href: string;
}

export async function getRecentActivity(userId: string, projectId?: string): Promise<ActivityItem[]> {
  const projectFilter = projectId ? { id: projectId } : {};
  const userScopeFilter = {
    OR: [
      { assignedProjectManager: userId },
      { memberships: { some: { userId: userId } } }
    ]
  };

  const projectWhere = { ...projectFilter, ...userScopeFilter };

  const [reports, issues, requests] = await Promise.all([
    prisma.dailyReport.findMany({
      where: { project: projectWhere },
      include: {
        project: { select: { projectName: true } },
        submitter: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.issue.findMany({
      where: { project: projectWhere },
      include: {
        project: { select: { projectName: true } },
        creator: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.materialRequest.findMany({
      where: { project: projectWhere, status: 'approved' },
      include: {
        project: { select: { projectName: true } },
        requester: { select: { fullName: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    })
  ]);

  const activityItems: ActivityItem[] = [
    ...reports.map(r => ({
      id: r.id,
      type: 'report' as const,
      title: 'Report Submitted',
      description: `Daily report for ${r.reportDate.toLocaleDateString()}`,
      userName: r.submitter.fullName,
      date: r.createdAt,
      projectId: r.projectId,
      projectName: r.project.projectName,
      href: `/reports/${r.id}`
    })),
    ...issues.map(i => ({
      id: i.id,
      type: 'issue' as const,
      title: `Issue ${i.status === 'resolved' ? 'Resolved' : 'Reported'}`,
      description: i.title,
      userName: i.creator.fullName,
      date: i.status === 'resolved' ? i.updatedAt : i.createdAt,
      projectId: i.projectId,
      projectName: i.project.projectName,
      href: `/issues/${i.id}`
    })),
    ...requests.map(req => ({
      id: req.id,
      type: 'material_request' as const,
      title: 'Request Approved',
      description: `${req.quantity}x ${req.materialName}`,
      userName: req.requester.fullName,
      date: req.updatedAt,
      projectId: req.projectId,
      projectName: req.project.projectName,
      href: `/materials/${req.id}`
    }))
  ];

  return activityItems
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);
}
