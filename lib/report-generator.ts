import jsPDF from 'jspdf'
import { Audit, ComplianceFinding, RiskHeatmapData } from './types'

export interface ReportOptions {
  includeExecutiveSummary: boolean
  includeTechnicalDetails: boolean
  includeRecommendations: boolean
  format: 'pdf' | 'csv' | 'json'
}

export async function generateAuditReport(
  audit: Audit,
  findings: ComplianceFinding[],
  heatmapData?: RiskHeatmapData,
  options: Partial<ReportOptions> = {}
): Promise<Blob> {
  const mergedOptions: ReportOptions = {
    includeExecutiveSummary: true,
    includeTechnicalDetails: true,
    includeRecommendations: true,
    format: 'pdf',
    ...options,
  }

  if (mergedOptions.format === 'pdf') {
    return generatePDFReport(audit, findings, heatmapData, mergedOptions)
  } else if (mergedOptions.format === 'csv') {
    return generateCSVReport(audit, findings)
  } else {
    return generateJSONReport(audit, findings, heatmapData)
  }
}

function generatePDFReport(
  audit: Audit,
  findings: ComplianceFinding[],
  heatmapData: RiskHeatmapData | undefined,
  options: ReportOptions
): Promise<Blob> {
  return new Promise((resolve) => {
    const doc = new jsPDF()
    let yPosition = 20

    // Title
    doc.setFontSize(20)
    doc.text('M&A Compliance Audit Report', 20, yPosition)
    yPosition += 15

    // Date and Audit Info
    doc.setFontSize(10)
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, yPosition)
    yPosition += 6
    doc.text(`Company: ${audit.companyName}`, 20, yPosition)
    yPosition += 6
    doc.text(`Audit ID: ${audit.id}`, 20, yPosition)
    yPosition += 6
    doc.text(`Status: ${audit.status}`, 20, yPosition)
    yPosition += 12

    // Executive Summary
    if (options.includeExecutiveSummary) {
      doc.setFontSize(14)
      doc.text('Executive Summary', 20, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      const criticalCount = findings.filter(f => f.severity === 'critical').length
      const highCount = findings.filter(f => f.severity === 'high').length
      const mediumCount = findings.filter(f => f.severity === 'medium').length

      const summaryText = `This audit identified ${findings.length} compliance findings across the target organization. The overall risk score is ${audit.riskScore}%, indicating a ${audit.overallRisk} risk level. Critical findings: ${criticalCount}, High: ${highCount}, Medium: ${mediumCount}.`

      doc.setTextColor(0)
      doc.text(summaryText, 20, yPosition, { maxWidth: 170 })
      yPosition += 25
    }

    // Findings Summary
    doc.setFontSize(14)
    doc.text('Findings Summary', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    const summaryData = [
      ['Severity', 'Count'],
      ['Critical', findings.filter(f => f.severity === 'critical').length.toString()],
      ['High', findings.filter(f => f.severity === 'high').length.toString()],
      ['Medium', findings.filter(f => f.severity === 'medium').length.toString()],
      ['Low', findings.filter(f => f.severity === 'low').length.toString()],
    ]

    doc.autoTable({
      head: [summaryData[0]],
      body: summaryData.slice(1),
      startY: yPosition,
      margin: 20,
    })

    const tableHeight = (doc as any).lastAutoTable?.finalY || yPosition + 30
    yPosition = Math.min(tableHeight + 10, 250)

    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    // Top Findings
    if (options.includeTechnicalDetails && findings.length > 0) {
      doc.setFontSize(14)
      doc.text('Top Findings', 20, yPosition)
      yPosition += 10

      const topFindings = findings.slice(0, 5)
      doc.setFontSize(9)

      topFindings.forEach((finding, index) => {
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFont(undefined, 'bold')
        doc.text(`${index + 1}. ${finding.title}`, 20, yPosition)
        yPosition += 6

        doc.setFont(undefined, 'normal')
        doc.setTextColor(100)
        doc.text(`Severity: ${finding.severity.toUpperCase()} | Category: ${finding.category}`, 20, yPosition)
        yPosition += 5

        doc.setTextColor(0)
        const descriptionWrapped = doc.splitTextToSize(finding.description, 170)
        doc.text(descriptionWrapped, 20, yPosition)
        yPosition += descriptionWrapped.length * 4 + 3

        const remediationWrapped = doc.splitTextToSize(`Remediation: ${finding.remediation}`, 170)
        doc.setFont(undefined, 'bold')
        doc.setTextColor(50, 50, 150)
        doc.text(remediationWrapped, 20, yPosition)
        yPosition += remediationWrapped.length * 4 + 8
      })
    }

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text('Confidential - This report contains sensitive compliance information', 20, 280)

    const pdfBlob = doc.output('blob')
    resolve(pdfBlob)
  })
}

function generateCSVReport(audit: Audit, findings: ComplianceFinding[]): Promise<Blob> {
  return new Promise((resolve) => {
    const headers = ['Audit ID', 'Company', 'Finding Title', 'Severity', 'Category', 'Description', 'Remediation', 'Date']
    const rows = findings.map(finding => [
      audit.id,
      audit.companyName,
      finding.title,
      finding.severity,
      finding.category,
      finding.description,
      finding.remediation,
      new Date(finding.timestamp).toISOString(),
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    resolve(blob)
  })
}

function generateJSONReport(
  audit: Audit,
  findings: ComplianceFinding[],
  heatmapData: RiskHeatmapData | undefined
): Promise<Blob> {
  return new Promise((resolve) => {
    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        auditId: audit.id,
        company: audit.companyName,
        riskScore: audit.riskScore,
      },
      findings,
      heatmap: heatmapData,
      summary: {
        total: findings.length,
        critical: findings.filter(f => f.severity === 'critical').length,
        high: findings.filter(f => f.severity === 'high').length,
        medium: findings.filter(f => f.severity === 'medium').length,
        low: findings.filter(f => f.severity === 'low').length,
      },
    }

    const json = JSON.stringify(report, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    resolve(blob)
  })
}

export async function downloadReport(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
