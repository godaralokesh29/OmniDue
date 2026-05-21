import { AIAuditAgent } from '@/lib/agent';

/**
 * Example: Running the AI Agent Programmatically
 * 
 * This shows how to use the AI Agent outside of the React component
 */

async function runAgentExample() {
  const agent = new AIAuditAgent();

  try {
    // Start the audit with all data sources
    const result = await agent.runFullAudit({
      auditId: 'AUD-TEST-001',
      companyName: 'Example Corp',
      notionDatabaseId: 'your-database-id',
      githubOwner: 'your-org',
      githubRepo: 'your-repo',
    });

    console.log('Analysis Complete!');
    console.log('Risk Score:', result.risks.length);
    console.log('Inconsistencies Found:', result.inconsistencies.length);
    console.log('Aligned Areas:', result.correlations.filter(c => c.status === 'aligned').length);
    console.log('Confidence:', result.confidence + '%');

    // Process results
    result.risks.forEach((risk) => {
      console.log(`\n[${risk.severity.toUpperCase()}] ${risk.title}`);
      console.log(`Category: ${risk.category}`);
      console.log(`Impact: ${risk.potentialImpact}`);
    });

    result.recommendations.forEach((rec) => {
      console.log(`\n[${rec.priority.toUpperCase()}] ${rec.title}`);
      console.log(`Effort: ${rec.estimatedEffort}`);
      rec.actionItems.forEach(item => {
        console.log(`  - ${item}`);
      });
    });

    return result;
  } catch (error) {
    console.error('Agent failed:', error);
    throw error;
  }
}

/**
 * Example: Using the streaming version for real-time updates
 */

async function runAgentWithStreaming() {
  const agent = new AIAuditAgent();

  const result = await agent.streamAnalysisProgress(
    {
      auditId: 'AUD-TEST-002',
      companyName: 'Another Corp',
      notionDatabaseId: 'your-database-id',
      githubOwner: 'your-org',
      githubRepo: 'your-repo',
    },
    (state) => {
      // This callback is called frequently with progress updates
      console.log(`[${state.progress}%] ${state.currentStep}`);
    }
  );

  console.log('Analysis complete:', result.summary);
  return result;
}

/**
 * Example: Checking specific risk categories
 */

function analyzeRisksByCategory(result: any) {
  const risksByCategory: Record<string, any[]> = {};

  result.risks.forEach((risk: any) => {
    if (!risksByCategory[risk.category]) {
      risksByCategory[risk.category] = [];
    }
    risksByCategory[risk.category].push(risk);
  });

  for (const [category, risks] of Object.entries(risksByCategory)) {
    const criticalCount = (risks as any[]).filter(r => r.severity === 'critical').length;
    const highCount = (risks as any[]).filter(r => r.severity === 'high').length;
    
    console.log(`\n${category.toUpperCase()}`);
    console.log(`  Critical: ${criticalCount}`);
    console.log(`  High: ${highCount}`);
    console.log(`  Total: ${risks.length}`);
  }
}

/**
 * Example: Generating a remediation plan
 */

function generateRemediationPlan(result: any) {
  const plan: Record<string, any[]> = {
    'IMMEDIATE': [],
    'SHORT_TERM': [],
    'MEDIUM_TERM': [],
    'LONG_TERM': [],
  };

  result.recommendations.forEach((rec: any) => {
    plan[rec.estimatedEffort.toUpperCase().replace('-', '_')].push(rec);
  });

  console.log('📋 REMEDIATION PLAN\n');

  for (const [timeframe, items] of Object.entries(plan)) {
    if ((items as any[]).length > 0) {
      console.log(`${timeframe} (${(items as any[]).length} items)`);
      (items as any[]).forEach((item: any) => {
        console.log(`  [${item.priority.toUpperCase()}] ${item.title}`);
      });
      console.log('');
    }
  }

  return plan;
}

export { runAgentExample, runAgentWithStreaming, analyzeRisksByCategory, generateRemediationPlan };
