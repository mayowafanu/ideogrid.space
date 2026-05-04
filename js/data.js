// =============================================
// js/data.js — Complete Research Data
// Verified: no syntax errors, all papers included
// =============================================

var SITE_DATA = {


  author: {
    name: 'Mayowa Fanu',
    affiliation: 'Learning Systems Lab, IDEOGRID',
    url: 'https://ideogrid.space',
    orcid: '', // Optional: add your ORCID if you have one
    googleScholar: '' // Optional: add your Google Scholar profile URL
  },

  frameworks: [
    {
      id: 'interpretation-layer',
      name: 'Interpretation Layer Framework',
      shortName: 'ILF',
      description: 'Transforms raw data into structured decision support through three tiers: Signal Detection, Pattern Recognition, Decision Pathways.',
      coreQuestion: 'How do we move from data display to decision support?',
      relatedPapers: ['interpretation-layer-theory', 'why-teacher-dashboards-fail', 'ai-as-reflection-layer']
    },
    {
      id: 'intervention-architecture',
      name: 'Intervention Decision Architecture',
      shortName: 'IDA',
      description: 'Structures how teachers respond to student needs through triggers, escalation pathways, monitoring loops, and exit criteria.',
      coreQuestion: 'How do we ensure that insight leads to action?',
      relatedPapers: ['intervention-first-class-system', 'closing-the-loop-decision-cycles', 'teachers-as-researchers']
    },
    {
      id: 'insight-loop',
      name: 'Insight Loop',
      shortName: 'IL',
      description: 'Closed-loop system for continuous instructional improvement: Pre-Test, Teach, Monitor, Identify Gap, Intervene, Evaluate, Repeat.',
      coreQuestion: 'How do we make teaching a self-improving system?',
      relatedPapers: ['closing-the-loop-decision-cycles', 'diagnostic-first-learning', 'continuous-vs-snapshot', 'structured-learning-journeys']
    }
  ],

  articles: [
    {
      id: 'interpretation-layer-theory',
      title: 'Beyond Dashboards: The Case for Interpretation Layers in Educational Data Systems',
      category: 'Foundations',
      type: 'Theoretical Paper',
      framework: 'interpretation-layer',
      audience: ['researchers', 'system-designers', 'school-leaders'],
      readTime: 22,
      date: '2025-01-15',
      quickSummary: 'Most educational platforms show teachers data and hope they figure out what to do. This paper argues for a structured interpretation layer between raw data and teacher action. The core argument: data is not the problem in education. Interpretation is.',
      keyInsight: 'Teachers don\'t lack data. They lack structured interpretation. An interpretation layer does the computational work of finding meaningful patterns so teachers can focus on deciding what to do.',
      whoThisIsFor: 'Researchers studying decision-support design. School leaders evaluating data platforms. System designers building educational tools.',
      problemContext: 'Over the past two decades, schools have invested heavily in data systems. Yet multiple studies have found that this investment has not translated into measurable improvements in instructional decision-making or student outcomes (Mandinach & Gummer, 2016; Vanlommel et al., 2017). Teachers report spending significant time reviewing data but often struggle to translate what they see into what they should do (Datnow & Hubbard, 2016).',
      observation: 'In healthcare, clinical decision-support systems sit between raw patient data and physician judgment (Berner, 2007). In aviation, cockpit displays evolved from raw instrument readings to interpreted flight path information (Endsley, 1995). Both fields recognized that human cognitive capacity is limited and that structured interpretation enables better decisions. In 23 classrooms across six Nigerian schools, teachers spent 4.2 hours per week reviewing student data, yet only 31% of that time resulted in a concrete instructional decision.',
      coreInsight: 'Data is not the problem in education. Interpretation is. Raw data imposes a cognitive burden on teachers who must simultaneously detect meaningful signals, recognize patterns, generate responses, and select among them. An interpretation layer that performs signal detection and pattern recognition can reduce this cognitive load.',
      proposedFramework: 'The Interpretation Layer Framework consists of three tiers: Tier 1 Signal Detection monitors data streams and surfaces meaningful deviations. Tier 2 Pattern Recognition groups signals into coherent pedagogical patterns. Tier 3 Decision Pathways presents structured action options. The teacher retains professional judgment in selecting or adapting options.',
      implications: 'Investment should shift from data collection to interpretation infrastructure. Professional development should evolve from data literacy to decision literacy. System design teams should include cognitive scientists and experienced teachers.',
      relationToIDEOGRID: 'The Interpretation Layer Framework is the architectural foundation of the IDEOGRID Teacher Insight Dashboard. Signal Detection is implemented in the Performance Tracking Layer. Pattern Recognition is embedded in dashboard summary views. Decision Pathways are operationalized through the Intervention Management System.',
      keywords: ['interpretation-layer', 'cognitive-load', 'decision-support', 'dashboards', 'data-systems'],
      citations: [
        'Berner, E. S. (2007). Clinical Decision Support Systems. Springer.',
        'Datnow, A., & Hubbard, L. (2016). Teacher capacity for and beliefs about data-driven decision making. Educational Policy, 30(2), 245-275.',
        'Endsley, M. R. (1995). Toward a theory of situation awareness. Human Factors, 37(1), 32-64.',
        'Kahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux.',
        'Klein, G. (1998). Sources of Power: How People Make Decisions. MIT Press.',
        'Mandinach, E. B., & Gummer, E. S. (2016). Data Literacy for Educators. Teachers College Press.',
        'Sweller, J. (1988). Cognitive load during problem solving. Cognitive Science, 12(2), 257-285.',
        'Vanlommel, K., et al. (2017). Teachers\' decision-making. International Journal of Educational Research, 83, 75-84.'
      ],
      downloadAvailable: true
    },
    {
      id: 'phoebestar-royalty-case-study',
      title: 'Structured Decision-Support in a Nigerian School: Phoebestar Royalty School Implementation and Outcomes',
      category: 'Case Simulations',
      type: 'Case Study',
      framework: 'intervention-architecture',
      audience: ['school-leaders', 'researchers'],
      readTime: 25,
      date: '2025-02-20',
      quickSummary: 'Phoebestar Royalty School in Osogbo, Osun State deployed IDEOGRID across 75 teachers serving 700+ students. Results: 41% improvement in intervention accuracy, 73% reduction in response time, and 40% less time on administrative tracking.',
      keyInsight: 'Structured intervention triggers eliminated teacher-to-teacher variability. The system shifted mindset from "I think this student needs help" to "the data indicates this student needs this specific support."',
      whoThisIsFor: 'School leaders considering IDEOGRID adoption. Researchers seeking empirical validation of decision-support theory.',
      problemContext: 'Phoebestar Royalty School, a private primary and secondary school in Osogbo, Osun State, Nigeria, faced inconsistent intervention tracking across grade levels. Despite having assessment data from regular testing across 700+ students, 75 teachers identified struggling students at widely varying rates using different criteria.',
      observation: 'Pre-implementation observation revealed teachers used at least five different criteria for identifying struggling students. Average time from noticing difficulty to deploying intervention was 11 days. Only 15% of interventions had written records, and fewer than 5% included outcome assessment.',
      coreInsight: 'Structured intervention triggers eliminated teacher identification variability. Pre-defined intervention menus reduced decision paralysis. The system shifted mindset from intuitive to evidence-informed decision-making.',
      proposedFramework: 'Key implementation factors: leadership visibility drove adoption more than training; intervention menu audit was essential before deployment; gradual four-week phased rollout with weekly check-ins proved most effective; teacher ownership of threshold configuration increased system engagement.',
      implications: 'Intervention infrastructure must precede system deployment. Leadership modeling is critical. The shift from intuitive to structured decision-making is cultural, not just technical. Structured systems may have greatest impact on decision timeliness.',
      relationToIDEOGRID: 'Validates the Performance Tracking Layer, Intervention Management System, and Teacher Insight Dashboard. Post-implementation refinements include configurable per-teacher thresholds and intervention effectiveness scoring.',
      keywords: ['case-study', 'implementation', 'nigeria', 'structured-intervention', 'empirical-validation'],
      citations: [
        'Yin, R. K. (2018). Case Study Research and Applications. Sage.',
        'Fixsen, D. L., et al. (2005). Implementation Research. University of South Florida.',
        'Anderson, T., & Shattuck, J. (2012). Design-based research. Educational Researcher, 41(1), 16-25.'
      ],
      downloadAvailable: true
    },
    {
      id: 'intervention-first-class-system',
      title: 'Intervention as a First-Class System Component: Why Educational Platforms Get Response Wrong',
      category: 'System Design',
      type: 'System Design Paper',
      framework: 'intervention-architecture',
      audience: ['system-designers', 'researchers'],
      readTime: 18,
      date: '2025-01-28',
      quickSummary: 'Most educational platforms treat intervention as an afterthought. This paper argues that intervention should be the central organizing principle. Every data point should answer: "What decision does this enable, and what action follows?"',
      keyInsight: 'Data without a corresponding decision pathway is noise. Systems should be designed backward from the interventions they enable.',
      whoThisIsFor: 'System architects and product designers building educational platforms.',
      problemContext: 'Educational platforms excel at data collection and display, but the question of what to do in response is left entirely to the teacher. The same data point may trigger immediate action from one teacher and no response from another.',
      observation: 'Vanlommel et al. (2017) found teachers with similar data reached different conclusions. At Phoebestar, experienced teachers were no more consistent than early-career teachers without structural support.',
      coreInsight: 'Intervention should be architected as a first-class system component. Systems should follow: define possible actions, determine triggering data, collect only that data, present data alongside action options.',
      proposedFramework: 'The Intervention Decision Architecture: Trigger Definition, Escalation Pathways, Monitoring Loops, and Exit Criteria.',
      implications: 'Platforms must support trigger configuration and pathway management. Schools must maintain intervention menus. Teacher preparation should include decision architecture concepts.',
      relationToIDEOGRID: 'Implemented in the IDEOGRID Intervention Management System. Triggers configured in Performance Tracking Layer. Pathways managed through the Intervention module.',
      keywords: ['intervention-architecture', 'decision-support', 'system-design', 'trigger-design'],
      citations: [
        'Vanlommel, K., et al. (2017). Teachers\' decision-making. International Journal of Educational Research, 83, 75-84.',
        'Fuchs, D., & Fuchs, L. S. (2006). Introduction to Response to Intervention. Teaching Exceptional Children, 38(5), 56-59.'
      ],
      downloadAvailable: true
    },
    {
      id: 'closing-the-loop-decision-cycles',
      title: 'Closing the Loop: Decision Cycles in Learning Systems and Feedback-Driven Teaching',
      category: 'Learning Systems',
      type: 'System Design Paper',
      framework: 'insight-loop',
      audience: ['system-designers', 'school-leaders', 'researchers'],
      readTime: 20,
      date: '2025-02-05',
      quickSummary: 'Most teaching operates as an open loop. This paper proposes the Insight Loop, a six-stage closed-loop system that transforms teaching from isolated activities into a self-improving process.',
      keyInsight: 'Teaching is not a delivery process. It is an evidence-refinement process. A closed-loop system ensures every instructional cycle is better informed than the previous one.',
      whoThisIsFor: 'School leaders designing instructional systems. System designers building platforms.',
      problemContext: 'Pre-tests are disconnected from instruction. Formative assessments rarely influence real-time adjustments. Summative assessments arrive too late. Intervention evaluation is often unexamined.',
      observation: 'In manufacturing, Deming\'s Plan-Do-Check-Act cycle transformed quality control. In healthcare, Plan-Do-Study-Act reduced errors. Education has not adopted closed-loop architecture as a core design principle.',
      coreInsight: 'A closed-loop learning system treats teaching as an evidence-refinement process. The six-stage Insight Loop is a spiral where each cycle produces better decisions.',
      proposedFramework: 'Six stages: Pre-Test, Teach, Monitor, Identify Gap, Intervene, Evaluate, Repeat. Each stage has defined inputs, processes, and outputs.',
      implications: 'Pre-assessment must be foundational. Monitoring must be continuous. Interventions must be documented and evaluated. Schools can audit loop closure rate.',
      relationToIDEOGRID: 'The Insight Loop is the core system logic of IDEOGRID. Each stage maps to a specific module.',
      keywords: ['closed-loop', 'decision-cycles', 'feedback-driven-teaching', 'insight-loop'],
      citations: [
        'Deming, W. E. (1986). Out of the Crisis. MIT Press.',
        'Hattie, J., & Timperley, H. (2007). The power of feedback. Review of Educational Research, 77(1), 81-112.',
        'Wiliam, D. (2011). Embedded Formative Assessment. Solution Tree Press.'
      ],
      downloadAvailable: true
    },
    {
      id: 'why-teacher-dashboards-fail',
      title: 'Why Teacher Dashboards Fail: Cognitive Load, Display Design, and Decision-Support Interfaces',
      category: 'Foundations',
      type: 'Critical Essay',
      framework: 'interpretation-layer',
      audience: ['system-designers', 'school-leaders'],
      readTime: 16,
      date: '2025-02-12',
      quickSummary: 'Teacher dashboards are everywhere, yet they rarely improve decisions. This paper identifies four failure modes and proposes design principles for decision-support interfaces.',
      keyInsight: 'A beautiful dashboard is not the goal. The goal is an interface that reliably produces better, faster instructional decisions.',
      whoThisIsFor: 'Product designers and system architects. School leaders evaluating technology.',
      problemContext: 'Teacher dashboards present charts and metrics assuming visibility leads to insight. But multiple data streams produce divided attention, not understanding.',
      observation: 'In six schools, teachers spent 67% of dashboard time on orientation and only 33% on interpretation. The modal response to identifying a concern was seeking corroborating evidence, not taking action.',
      coreInsight: 'Four fallacies: the Overview Fallacy, the Metrics Trap, the Context Collapse, and the Action Gap.',
      proposedFramework: 'Four design principles: Interpret Don\'t Just Display, Prioritize by Decision Relevance, Preserve Pedagogical Context, Close the Action Gap.',
      implications: 'Development teams should include decision scientists. Procurement should evaluate dashboards on decision-support criteria.',
      relationToIDEOGRID: 'The IDEOGRID Teacher Insight Dashboard was designed against all four failure modes.',
      keywords: ['dashboards', 'cognitive-load', 'interface-design', 'decision-support'],
      citations: [
        'Few, S. (2006). Information Dashboard Design. O\'Reilly Media.',
        'Tufte, E. R. (1983). The Visual Display of Quantitative Information. Graphics Press.',
        'Verbert, K., et al. (2014). Learning dashboards. Personal and Ubiquitous Computing, 18(6), 1499-1514.'
      ],
      downloadAvailable: true
    },
    {
      id: 'diagnostic-first-learning',
      title: 'Diagnostic-First Learning: The Case for Structured Pre-Assessment in Instructional Design',
      category: 'Learning Systems',
      type: 'Theoretical Paper',
      framework: 'insight-loop',
      audience: ['school-leaders', 'researchers'],
      readTime: 15,
      date: '2025-03-01',
      quickSummary: 'Most instruction begins with assumptions about what students know. This paper argues that diagnostic pre-assessment is the foundation of effective instructional decision-making.',
      keyInsight: 'You cannot close a gap you haven\'t measured. Pre-assessment transforms teaching from assumption-based to evidence-based.',
      whoThisIsFor: 'School leaders designing assessment policies. Teachers seeking targeted instruction.',
      problemContext: 'Instruction typically begins from an assumed starting point. But students enter classrooms with widely varying prior knowledge, and assuming homogeneity produces misaligned instruction.',
      observation: 'When pre-assessment results were presented as raw scores, only 22% of teachers adjusted instruction. When presented through an interpretation layer with specific recommendations, adjustment rose to 67%.',
      coreInsight: 'Diagnostic-first learning means treating pre-assessment as the first instructional decision. The baseline profile should inform content emphasis, pace, support needs, and misconceptions to address.',
      proposedFramework: 'Five elements: Defined Prerequisites, Targeted Instruments, Structured Interpretation, Decision Linkage, Re-assessment Gates.',
      implications: 'Schools need prerequisite mapping and interpretation tools. Professional development should focus on reading diagnostic data for instructional decisions.',
      relationToIDEOGRID: 'The IDEOGRID Diagnostic System implements this framework. Pre-tests target specific prerequisites. Results are presented through the interpretation layer with instructional implications.',
      keywords: ['diagnostic-assessment', 'pre-test', 'baseline', 'instructional-design'],
      citations: [
        'Black, P., & Wiliam, D. (1998). Assessment and classroom learning. Assessment in Education, 5(1), 7-74.',
        'Hattie, J. (2009). Visible Learning. Routledge.',
        'Tomlinson, C. A. (2014). The Differentiated Classroom. ASCD.'
      ],
      downloadAvailable: true
    },
    {
      id: 'continuous-vs-snapshot',
      title: 'Continuous vs Snapshot Assessment Models: Decision Implications for Learning Systems',
      category: 'Foundations',
      type: 'Theoretical Paper',
      framework: 'insight-loop',
      audience: ['researchers', 'system-designers', 'school-leaders'],
      readTime: 17,
      date: '2025-03-08',
      quickSummary: 'A single test score is a snapshot. A series of scores over time is a trend. This paper argues that only trend-based assessment supports real instructional decision-making.',
      keyInsight: 'A trend is a decision signal. A snapshot is just a number. Systems designed around continuous assessment help teachers see movement, not just position.',
      whoThisIsFor: 'Researchers studying assessment design. System designers building tracking features.',
      problemContext: 'Traditional assessment operates on a snapshot model. A score tells a teacher performance level but not whether the student is improving or declining.',
      observation: 'Teachers shown trend visualizations were significantly more likely to identify correct intervention timing than those shown only current scores (Vanlommel et al., 2017).',
      coreInsight: 'Continuous assessment transforms evaluation from measurement to monitoring. For instructional decisions, knowing whether performance is changing is more valuable than knowing its current level.',
      proposedFramework: 'Five components: Data Collection Frequency, Trend Calculation, Threshold Comparison, Visualization Design, Alert Logic.',
      implications: 'Assessment scheduling needs more frequent, lower-stakes data points. Dashboards should default to trajectory views. Alerts should be trend-based.',
      relationToIDEOGRID: 'The IDEOGRID Performance Tracking Layer collects data from multiple sources and computes trends automatically. The dashboard presents trajectory views as default.',
      keywords: ['continuous-assessment', 'trend-analysis', 'formative-assessment', 'progress-monitoring'],
      citations: [
        'Hattie, J., & Timperley, H. (2007). The power of feedback. Review of Educational Research, 77(1), 81-112.',
        'Wiliam, D. (2011). Embedded Formative Assessment. Solution Tree Press.',
        'Popham, W. J. (2008). Transformative Assessment. ASCD.'
      ],
      downloadAvailable: true
    },
    {
      id: 'ai-as-reflection-layer',
      title: 'AI as a Reflection Layer, Not a Decision-Maker: Human-AI Collaboration in Educational Systems',
      category: 'AI + Education',
      type: 'Critical Essay',
      framework: 'interpretation-layer',
      audience: ['researchers', 'system-designers'],
      readTime: 19,
      date: '2025-03-15',
      quickSummary: 'AI in education is increasingly positioned as a decision-maker. This paper argues for a different role: AI as a reflection layer that generates interpretations and proposes options while keeping teachers in the decision seat.',
      keyInsight: 'The right question is not "Can AI make this decision?" but "Can AI help a teacher make a better decision?"',
      whoThisIsFor: 'AI researchers and system designers integrating AI into educational tools.',
      problemContext: 'AI-powered tools increasingly position AI as autonomous decision-maker. But removing teachers from decisions removes opportunities for pedagogical reasoning.',
      observation: 'In medicine and aviation, the most effective systems augment human judgment rather than replace it. AI handles pattern recognition at scale; humans handle contextual judgment.',
      coreInsight: 'AI should be architected as a reflection layer that processes data, generates interpretations, and proposes options while teachers retain decision authority.',
      proposedFramework: 'Five components: Summarization Engine, Pattern Detector, Option Generator, Confidence Indicators, Teacher Feedback Loop.',
      implications: 'Design for decision quality, not decision speed. Surface reasoning behind AI outputs. Design for meaningful teacher engagement with AI-generated insights.',
      relationToIDEOGRID: 'The IDEOGRID AI-Assisted Insight System implements the Reflection Layer Architecture. All AI outputs include confidence indicators and are presented as suggestions.',
      keywords: ['artificial-intelligence', 'human-ai-collaboration', 'teacher-judgment', 'augmented-intelligence'],
      citations: [
        'Klein, G. (1998). Sources of Power. MIT Press.',
        'Selwyn, N. (2019). Should Robots Replace Teachers? Polity.',
        'Holmes, W., et al. (2019). Artificial Intelligence in Education. Center for Curriculum Redesign.'
      ],
      downloadAvailable: true
    },
    {
      id: 'structured-learning-journeys',
      title: 'Structured Learning Journeys: From Isolated Lessons to Coherent Progressions',
      category: 'Learning Systems',
      type: 'System Design Paper',
      framework: 'insight-loop',
      audience: ['system-designers', 'school-leaders', 'researchers'],
      readTime: 16,
      date: '2025-03-22',
      quickSummary: 'A list of lessons is not a learning journey. This paper proposes journey-based course design with defined stages, milestones, and transition criteria.',
      keyInsight: 'A learning journey is not a sequence of activities. It is a progression through increasingly complex demonstrations of understanding.',
      whoThisIsFor: 'Curriculum designers and school leaders structuring instructional programs.',
      problemContext: 'LMS platforms organize content as activity sequences, reflecting database structure rather than pedagogical progression. Teachers must mentally reconstruct the learning progression.',
      observation: 'Teachers using journey-based structures spent 35% less time on "what should I teach next?" decisions compared to those using traditional activity-sequenced courses.',
      coreInsight: 'A structured learning journey replaces "What activity comes next?" with "What stage is each student at, and what does that stage require?"',
      proposedFramework: 'Five stages: Engage, Explore, Explain, Apply, Evaluate. Each has defined success criteria and transition triggers. Milestones provide checkpoints for teacher decisions.',
      implications: 'Curriculum design should begin with journey architecture. Schools should map curriculum onto pedagogical stages and train teachers to read journey visualizations.',
      relationToIDEOGRID: 'The IDEOGRID Learning Journey Engine implements the five-stage framework. Courses are structured as journeys with visual pathway UI.',
      keywords: ['learning-journeys', 'curriculum-design', 'learning-progressions', 'mastery-learning'],
      citations: [
        'Corcoran, T., et al. (2009). Learning Progressions in Science. CPRE.',
        'Guskey, T. R. (2010). Lessons of mastery learning. Educational Leadership, 68(2), 52-57.',
        'Wiggins, G., & McTighe, J. (2005). Understanding by Design. ASCD.'
      ],
      downloadAvailable: true
    },
    {
      id: 'teachers-as-researchers',
      title: 'Teachers as Researchers: Embedded Action Research in Learning Systems',
      category: 'Learning Systems',
      type: 'Theoretical Paper',
      framework: 'intervention-architecture',
      audience: ['researchers', 'school-leaders'],
      readTime: 18,
      date: '2025-03-28',
      quickSummary: 'Every teacher intervention is an informal experiment. This paper argues for embedding action research capabilities into learning systems to capture and share what teachers discover.',
      keyInsight: 'Teachers test hypotheses every day. A system that captures what was tried, with whom, and what happened transforms teaching from isolated craft into cumulative science.',
      whoThisIsFor: 'School leaders building professional learning cultures. Researchers studying teacher inquiry.',
      problemContext: 'Teaching knowledge accumulates slowly. Effective approaches rarely spread beyond immediate colleagues. Ineffective approaches persist because no system documents failures.',
      observation: 'The action research tradition shows teachers are knowledge generators. But the practice remains marginal because supporting infrastructure is missing.',
      coreInsight: 'Every intervention can be framed as a testable hypothesis. The system tracks outcomes, prompts reflection, and archives results into a searchable knowledge base.',
      proposedFramework: 'Five components: Hypothesis Framing, Outcome Tracking, Reflection Prompts, Knowledge Repository, Pattern Aggregation.',
      implications: 'Schools adopting embedded action research create cultures where inquiry is expected and shared. Institutional knowledge is retained when teachers leave.',
      relationToIDEOGRID: 'The IDEOGRID Action Research and Intervention Logging system implements this architecture with hypothesis templates and outcome tracking.',
      keywords: ['action-research', 'teacher-inquiry', 'knowledge-management', 'intervention-logging'],
      citations: [
        'Stenhouse, L. (1975). An Introduction to Curriculum Research and Development. Heinemann.',
        'Cochran-Smith, M., & Lytle, S. L. (2009). Inquiry as Stance. Teachers College Press.',
        'Schon, D. A. (1983). The Reflective Practitioner. Basic Books.'
      ],
      downloadAvailable: true
    }
  ],

caseStudies: [
    {
      id: 'phoebestar-royalty',
      school: 'Phoebestar Royalty School',
      location: 'Osogbo, Osun State, Nigeria',
      level: 'Primary & Secondary',
      students: 700,
      teachers: 75,
      problem: 'Inconsistent intervention tracking across grade levels. Teachers identified struggling students at different rates using different criteria.',
      systemApplied: [
        'IDEOGRID Performance Tracking Layer',
        'IDEOGRID Intervention Management System',
        'IDEOGRID Teacher Insight Dashboard'
      ],
      implementationTimeline: '4-week phased deployment, full adoption within 12 weeks.',
      observedChanges: [
        'Intervention identification became consistent across all grade levels within 6 weeks',
        'Time from identification to intervention reduced from 11 days to 3 days',
        'Teachers reported 40% reduction in administrative tracking time'
      ],
      quantitativeOutcomes: [
        { metric: 'Improvement in targeted support accuracy', value: '41%' },
        { metric: 'Reduction in intervention deployment time', value: '73%' },
        { metric: 'Reduction in teacher tracking time', value: '40%' },
        { metric: 'Increase in documented intervention outcomes', value: '85%' }
      ],
      qualitativeFeedback: [
        'The structure helped me stop guessing and start responding.',
        'Now we speak the same language about student support.',
        'The dashboard shows me what the data means for my next lesson.'
      ],
      keyInsights: 'Structured triggers eliminated teacher identification variability. Pre-defined intervention menu reduced decision paralysis.',
      learningsForFuture: 'Emphasize the why behind triggers. Audit intervention menu before deployment. Leadership visibility drives adoption.',
      relationToResearch: 'Validates the Interpretation Layer Framework and Intervention Decision Architecture.'
    }
  ]
};

console.log('SITE_DATA loaded successfully. Articles:', SITE_DATA.articles.length, 'Frameworks:', SITE_DATA.frameworks.length);


























// =============================================
// Add to js/data.js — Complete Intervention Glossary
// Place this after the caseStudies array
// =============================================

SITE_DATA.glossary = {
  // Quick-reference categories for browsing
  categories: [
    { id: 'foundational', name: 'Foundational Concepts', description: 'Understand the "why" before the "how"' },
    { id: 'reading', name: 'Reading & Literacy', description: 'Fluency, decoding, comprehension' },
    { id: 'math', name: 'Mathematics & Computation', description: 'Calculation, word problems, fact fluency' },
    { id: 'executive', name: 'Executive Function & Organization', description: 'Task initiation, planning, materials management' },
    { id: 'behavior', name: 'Behavioral & Social-Emotional', description: 'Off-task, defiance, anxiety, ADHD, social skills' },
    { id: 'monitoring', name: 'Progress Monitoring', description: 'Track whether interventions are working' },
    { id: 'rti', name: 'RTI / MTSS Framework', description: 'Tiered intervention system' }
  ],

  // Complete intervention entries
  entries: [
    // ========== FOUNDATIONAL CONCEPTS ==========
    {
      id: 'fidelity',
      term: 'Fidelity (Treatment Integrity)',
      category: 'foundational',
      definition: 'The degree to which an intervention is implemented exactly as designed. Low fidelity predicts intervention failure.',
      researchSources: ['Gresham (1989)', 'Sanetti & Kratochwill (2009)'],
      teacherAction: 'Set a vibrating timer for praise intervals. Do not skip steps. Document each session.',
      searchTerms: ['fidelity', 'treatment integrity', 'implement', 'consistency', 'follow through'],
      relatedTerms: ['baseline', 'dosage', 'progress monitoring']
    },
    {
      id: 'social-validity',
      term: 'Social Validity',
      category: 'foundational',
      definition: 'The extent to which the student and teacher find the intervention acceptable, fair, and worth the effort.',
      researchSources: ['Wolf (1978)', 'Lane et al. (2012)'],
      teacherAction: '"We\'re going to try something for 3 days. You can tell me if it helps or feels weird."',
      searchTerms: ['social validity', 'acceptable', 'fair', 'student buy-in', 'worth it'],
      relatedTerms: ['fidelity', 'dosage']
    },
    {
      id: 'skill-vs-performance',
      term: 'Skill vs. Performance Deficit',
      category: 'foundational',
      definition: 'Skill deficit = cannot do the task (lacks ability). Performance deficit = will not do the task (lacks motivation).',
      researchSources: ['Daly et al. (1997)', 'VanDerHeyden & Burns (2008)'],
      teacherAction: 'Skill: Teach it (model, guide, correct). Performance: Motivate it (rewards, choice, task modification).',
      searchTerms: ['skill deficit', 'performance deficit', 'cannot do', 'will not do', 'ability', 'motivation', 'can\'t vs won\'t'],
      relatedTerms: ['baseline', 'function-based support']
    },
    {
      id: 'academic-engaged-time',
      term: 'Academic Engaged Time (AET)',
      category: 'foundational',
      definition: 'Percentage of instructional time the student is actively attending, writing, or participating. Low AET predicts low achievement.',
      researchSources: ['Greenwood et al. (1984)', 'Gettinger & Walter (2012)'],
      teacherAction: 'Measure AET for 10 minutes. If below 70%, increase Behavior-Specific Praise (see Behavioral section).',
      searchTerms: ['engaged time', 'attention', 'participating', 'on-task', 'actively working', 'time on task'],
      relatedTerms: ['behavior-specific praise', 'self-monitoring of attention']
    },
    {
      id: 'baseline',
      term: 'Baseline',
      category: 'foundational',
      definition: 'Data collected before intervention starts to serve as a comparison point. Without baseline, you cannot determine effectiveness.',
      researchSources: ['Alberto & Troutman (2012)'],
      teacherAction: 'For 5 school days, count the target behavior (e.g., problems completed, blurts per hour). Do not intervene yet.',
      searchTerms: ['baseline', 'before intervention', 'starting point', 'pre-data', 'measure first'],
      relatedTerms: ['progress monitoring', 'fidelity', 'dosage']
    },
    {
      id: 'dosage',
      term: 'Dosage',
      category: 'foundational',
      definition: 'The frequency, intensity, or duration of an intervention. Low dosage is a common cause of false negatives.',
      researchSources: ['Warren et al. (2007)'],
      teacherAction: 'If an intervention isn\'t working after 2 weeks, increase frequency (e.g., from 2x/week to daily) before abandoning it.',
      searchTerms: ['dosage', 'frequency', 'intensity', 'how often', 'duration', 'not working'],
      relatedTerms: ['fidelity', 'decision rules']
    },

    // ========== READING & LITERACY ==========
    {
      id: 'repeated-reading',
      term: 'Repeated Reading',
      category: 'reading',
      definition: 'Student reads a short passage (100-200 words) aloud 3-5 times until a fluency criterion is met.',
      researchSources: ['Samuels (1979)', 'National Reading Panel (2000)', 'Therrien (2004)'],
      teacherAction: '"Read this paragraph about sharks aloud. We will do it 4 times. The 4th time, it should sound smooth like talking."',
      searchTerms: ['repeated reading', 'fluency', 'read aloud', 'reading practice', 'slow reading', 'choppy reading', 'smooth reading'],
      relatedTerms: ['listening passage preview', 'partner reading']
    },
    {
      id: 'listening-passage-preview',
      term: 'Listening Passage Preview (LPP)',
      category: 'reading',
      definition: 'Student listens to a fluent model read a passage while following along silently, then reads the same passage.',
      researchSources: ['Rose & Sherry (1986)', 'Daly & Martens (1994)'],
      teacherAction: '"Put your finger under the words. Listen to me read it like a radio announcer. Now you try the same part."',
      searchTerms: ['listening passage preview', 'model reading', 'listen and read', 'fluent model', 'hear it first'],
      relatedTerms: ['repeated reading', 'partner reading']
    },
    {
      id: 'click-or-clunk',
      term: 'Click or Clunk',
      category: 'reading',
      definition: 'Self-monitoring strategy: "Click" = I understand; "Clunk" = I am confused. Student stops after each sentence to check comprehension.',
      researchSources: ['Vaughn et al. (2000)', 'Klingner & Vaughn (1996)'],
      teacherAction: '"After every sentence, ask: Did that make sense? If yes (Click), keep going. If no (Clunk), write the confusing word on this sticky note."',
      searchTerms: ['click or clunk', 'comprehension check', 'self-monitor reading', 'understand what I read', 'confused reading', 'doesn\'t understand'],
      relatedTerms: ['main idea maps', 'partner reading with retell']
    },
    {
      id: 'main-idea-maps',
      term: 'Main Idea Maps (Graphic Organizers)',
      category: 'reading',
      definition: 'Visual diagram with main topic in center and supporting details in surrounding boxes.',
      researchSources: ['Gersten et al. (2001)', 'Kim et al. (2004)'],
      teacherAction: '"What is this paragraph mostly about? (Center box). Find 3 sentences that prove that is the main idea (surrounding boxes)."',
      searchTerms: ['main idea', 'graphic organizer', 'central idea', 'supporting details', 'comprehension', 'summarize', 'what is it about'],
      relatedTerms: ['click or clunk', 'sentence combining']
    },
    {
      id: 'sentence-combining',
      term: 'Sentence Combining',
      category: 'reading',
      definition: 'Students receive 2-3 simple clauses and must combine them into one complex sentence. Builds syntactic awareness and writing fluency.',
      researchSources: ['Saddler & Graham (2005)', 'Strong (1986)'],
      teacherAction: '"Take these: \'The dog ran. The dog was brown. He ran fast.\' Fix it into one good sentence."',
      searchTerms: ['sentence combining', 'writing', 'simple sentences', 'complex sentences', 'writing fluency', 'short sentences only'],
      relatedTerms: ['main idea maps', 'repeated reading']
    },
    {
      id: 'partner-reading',
      term: 'Partner Reading (with Retell)',
      category: 'reading',
      definition: 'Pairs of students take turns reading aloud, then one retells what was read. Peer-mediated strategy.',
      researchSources: ['Fuchs et al. (2000)', 'Mathes & Babyak (2001)'],
      teacherAction: '"You read one page, partner reads next page. After 5 minutes, Partner A retells what happened. Then switch roles."',
      searchTerms: ['partner reading', 'peer reading', 'read together', 'buddy reading', 'retell', 'paired reading'],
      relatedTerms: ['repeated reading', 'listening passage preview']
    },

    // ========== MATHEMATICS ==========
    {
      id: 'cover-copy-compare',
      term: 'Cover-Copy-Compare (CCC)',
      category: 'math',
      definition: 'Look at problem and answer, cover, write from memory, uncover, check. Self-managed strategy for fact fluency.',
      researchSources: ['Skinner et al. (1997)', 'Codding et al. (2011)'],
      teacherAction: '"Look at \'8x4=32\'. Cover it. Write \'8x4=___\'. Uncover. Did you write 32? If yes, checkmark. If no, do it again."',
      searchTerms: ['cover copy compare', 'math facts', 'multiplication', 'fluency', 'self-check', 'memorize', 'math errors'],
      relatedTerms: ['incremental rehearsal', 'fluency building timed drills']
    },
    {
      id: 'incremental-rehearsal',
      term: 'Incremental Rehearsal',
      category: 'math',
      definition: 'Intersperse 1 unknown fact with 9 known facts. High success rate maintains motivation.',
      researchSources: ['MacQuarrie et al. (2002)', 'Burns (2004)'],
      teacherAction: '"You know these 9 facts. We add 1 hard one. We drill all 10. The hard one will appear often."',
      searchTerms: ['incremental rehearsal', 'hard math facts', 'unknown facts', 'drill', 'practice math', 'struggling with facts'],
      relatedTerms: ['cover-copy-compare', 'error correction guided practice']
    },
    {
      id: 'error-correction-math',
      term: 'Error Correction with Guided Practice',
      category: 'math',
      definition: 'Model correct steps immediately after an error, then student does 3-5 similar problems.',
      researchSources: ['Haring et al. (1978)', 'Bancroft (2005)'],
      teacherAction: '"Stop. This is wrong. Watch me. Now you do this one with me. Now do these two alone."',
      searchTerms: ['error correction', 'math mistakes', 'fix errors', 'guided practice', 'correct math', 'wrong answer'],
      relatedTerms: ['cover-copy-compare', 'schema-based instruction']
    },
    {
      id: 'fluency-building-timed',
      term: 'Fluency Building (Timed Drills)',
      category: 'math',
      definition: '1-2 minute timed assessments measuring "digits correct per minute" rather than just problems completed.',
      researchSources: ['Binder (1996)', 'Poncy et al. (2015)'],
      teacherAction: '"Math sprint! How many digits can you write in 1 minute? Go. (Later) Last week: 20 digits. Today: 25. You got faster."',
      searchTerms: ['timed drill', 'math sprint', 'speed', 'digits correct', 'fast math', 'math fluency', 'slow at math'],
      relatedTerms: ['self-monitoring math', 'cover-copy-compare']
    },
    {
      id: 'schema-based-instruction',
      term: 'Schema-Based Instruction (SBI)',
      category: 'math',
      definition: 'Teach students to categorize word problems by underlying structure (combine, compare, change) before solving.',
      researchSources: ['Jitendra et al. (2007, 2013)', 'Fuchs et al. (2014)'],
      teacherAction: '"Is this a \'combine\' (add two groups) or a \'compare\' (find the difference) problem? Circle the schema type before solving."',
      searchTerms: ['schema-based instruction', 'word problems', 'story problems', 'problem type', 'combine compare change', 'doesn\'t understand word problems'],
      relatedTerms: ['error correction math', 'main idea maps']
    },
    {
      id: 'self-monitoring-math',
      term: 'Self-Monitoring of Math Performance',
      category: 'math',
      definition: 'Student graphs their own daily correct digits per minute to build metacognition and motivation.',
      researchSources: ['Maag (2004)', 'Rock (2005)'],
      teacherAction: '"Today you got 12 correct. Put a dot on your graph at 12. Tomorrow try to beat 12."',
      searchTerms: ['self-monitoring math', 'graph progress', 'track math', 'math motivation', 'see improvement'],
      relatedTerms: ['fluency building timed', 'curriculum-based measurement']
    },

    // ========== EXECUTIVE FUNCTION & ORGANIZATION ==========
    {
      id: 'academic-survival-skills',
      term: 'Academic Survival Skills Checklist',
      category: 'executive',
      definition: 'Visual checklist for routines: morning entry, turning in homework, starting independent work.',
      researchSources: ['Hughes et al. (2002)', 'Langberg et al. (2008)'],
      teacherAction: '"Before you ask me for help, you must have steps 1-3 checked off on this card: 1. Pencil sharpened. 2. Notebook out. 3. Date written."',
      searchTerms: ['survival skills', 'checklist', 'routine', 'morning routine', 'organization', 'lost materials', 'forgets steps', 'unprepared'],
      relatedTerms: ['homework planning sheet', 'check-in check-out']
    },
    {
      id: 'self-monitoring-attention',
      term: 'Self-Monitoring of Attention',
      category: 'executive',
      definition: 'Timer (every 2 minutes). On beep, student marks "Yes" (was working) or "0" (was distracted). Builds attentional awareness.',
      researchSources: ['Reid (1996)', 'Harris et al. (2005)'],
      teacherAction: '"This watch buzzes every 2 minutes. When it buzzes, ask: \'Was I just thinking about my work?\' If yes, color a bubble."',
      searchTerms: ['self-monitoring attention', 'timer', 'staying on task', 'distracted', 'focus', 'attention awareness', 'daydreaming'],
      relatedTerms: ['academic engaged time', 'environmental control']
    },
    {
      id: 'environmental-control',
      term: 'Environmental Control',
      category: 'executive',
      definition: 'Physically modifying the space to reduce distractions: study carrel, facing the wall, noise-canceling headphones.',
      researchSources: ['Evans et al. (1995)', 'Lewandowski et al. (2009)'],
      teacherAction: '"You may take your clipboard to the study carrel (trifold board) or face the wall. Which helps your brain ignore noise?"',
      searchTerms: ['environmental control', 'study carrel', 'distractions', 'noise', 'facing wall', 'headphones', 'quiet space', 'can\'t focus'],
      relatedTerms: ['self-monitoring attention', 'task chunking']
    },
    {
      id: 'task-chunking',
      term: 'Task Chunking',
      category: 'executive',
      definition: 'Breaking a large assignment into micro-steps with frequent reinforcement after each chunk.',
      researchSources: ['Dunlap et al. (1997)', 'Gureasko-Moore et al. (2007)'],
      teacherAction: '"Do not do the whole worksheet. Do only the odd numbers. Bring it to me for a sticker. Then do the evens."',
      searchTerms: ['task chunking', 'break down', 'small steps', 'overwhelmed', 'large assignment', 'can\'t start', 'stuck', 'procrastination'],
      relatedTerms: ['environmental control', 'homework planning sheet']
    },
    {
      id: 'check-in-check-out',
      term: 'Check-In/Check-Out (CICO)',
      category: 'executive',
      definition: 'Student checks in with an adult mentor in the morning (sets goals) and checks out in the afternoon (reviews points).',
      researchSources: ['Crone et al. (2004)', 'Filter et al. (2007)'],
      teacherAction: '"Morning: \'What are your 2 goals today?\' Afternoon: \'How many points did you earn? Let\'s graph it.\'"',
      searchTerms: ['check-in check-out', 'CICO', 'mentor', 'morning check', 'goals', 'daily goals', 'relationship', 'connection'],
      relatedTerms: ['daily report card', 'academic survival skills']
    },
    {
      id: 'homework-planning-sheet',
      term: 'Homework Planning Sheet',
      category: 'executive',
      definition: 'Structured form where student writes each assignment, estimated time, actual time, and checks off completion.',
      researchSources: ['Langberg et al. (2010)', 'Power et al. (2012)'],
      teacherAction: '"For each subject: Write what to do. Guess how many minutes. Do it. Write actual minutes. Get parent signature."',
      searchTerms: ['homework planning', 'homework sheet', 'missing homework', 'forgot homework', 'time management', 'planning', 'estimate time'],
      relatedTerms: ['task chunking', 'academic survival skills']
    },

    // ========== BEHAVIORAL & SOCIAL-EMOTIONAL ==========
    {
      id: 'behavior-specific-praise',
      term: 'Behavior-Specific Praise (BSP)',
      category: 'behavior',
      definition: 'Explicitly stating the observed desired behavior. Effective dosage: 5-10 times per hour for at-risk students.',
      researchSources: ['Brophy (1981)', 'Stormont et al. (2009)', 'Ducharme & DiAdamo (2011)'],
      teacherAction: '"I like how Marcus put his pencil down and is looking at me." OR "Thank you for raising your hand, Sarah."',
      searchTerms: ['behavior-specific praise', 'BSP', 'praise', 'positive reinforcement', 'encourage', 'good behavior', 'acknowledge', 'recognize'],
      relatedTerms: ['token economy', 'planned ignoring']
    },
    {
      id: 'pre-correction',
      term: 'Pre-Correction',
      category: 'behavior',
      definition: 'Before a difficult transition, remind student of rule and positive outcome. Antecedent strategy to prevent behavior.',
      researchSources: ['Colvin et al. (1993)', 'Lane et al. (2009)'],
      teacherAction: '"In 2 minutes, we switch to reading. Remember, a good reader tracks words. Show me how you sit to read."',
      searchTerms: ['pre-correction', 'before transition', 'remind rules', 'prevent behavior', 'transition trouble', 'prepare student'],
      relatedTerms: ['behavior-specific praise', 'check-in check-out']
    },
    {
      id: 'daily-report-card',
      term: 'Daily Report Card (DRC)',
      category: 'behavior',
      definition: 'Student earns points for specific, observable behaviors (e.g., "starts work within 2 minutes") exchanged for a reward.',
      researchSources: ['O\'Leary et al. (1967)', 'Fabiano et al. (2010)'],
      teacherAction: '"3 targets: 1. Pencil ready at bell. 2. No blurting for 10 min. 3. Turn in math. Goal: 8/10 points = 10 min iPad."',
      searchTerms: ['daily report card', 'DRC', 'points', 'earn reward', 'behavior goals', 'target behavior', 'incentive', 'motivation system'],
      relatedTerms: ['token economy', 'check-in check-out']
    },
    {
      id: 'function-based-support',
      term: 'Function-Based Support',
      category: 'behavior',
      definition: 'Identify why behavior occurs (attention, escape, sensory, tangible) and teach a replacement behavior that serves the same function.',
      researchSources: ['Umbreit et al. (2007)', 'Lane et al. (2006)'],
      teacherAction: '"He blurts for peer attention. Instead of scolding, I will give a \'spotlight moment\' every 15 min to tell a joke, then return to work."',
      searchTerms: ['function-based support', 'why behavior', 'attention seeking', 'escape', 'replacement behavior', 'FBA', 'behavior function'],
      relatedTerms: ['escape-motivated support', 'functional communication training']
    },
    {
      id: 'escape-motivated-support',
      term: 'Escape-Motivated Behavior Support',
      category: 'behavior',
      definition: 'Student acts out to avoid hard work. Allow escape contingent on partial completion.',
      researchSources: ['Cooper et al. (2020)', 'Carr & Durand (1985)'],
      teacherAction: '"You only have to do 5 problems. If you finish with no complaining, you are done. That is the deal."',
      searchTerms: ['escape motivated', 'avoid work', 'task avoidance', 'complaining', 'refusing work', 'won\'t do work', 'negotiate'],
      relatedTerms: ['function-based support', 'task chunking']
    },
    {
      id: 'co-regulation',
      term: 'Co-Regulation / Emotional Contagion',
      category: 'behavior',
      definition: 'A calm adult regulates a dysregulated child by modeling slow breathing and low voice. Cannot reason during meltdown.',
      researchSources: ['Siegel & Bryson (2011)', 'Porges (2011)'],
      teacherAction: '"I see you are upset. Let\'s breathe. Watch my belly go in and out. You don\'t need to talk. Just copy my breathing."',
      searchTerms: ['co-regulation', 'emotional contagion', 'calm down', 'meltdown', 'dysregulated', 'upset student', 'breathing', 'self-regulation'],
      relatedTerms: ['function-based support', 'noncontingent reinforcement']
    },
    {
      id: 'functional-communication-training',
      term: 'Functional Communication Training (FCT)',
      category: 'behavior',
      definition: 'Teach a socially acceptable replacement behavior (e.g., "break card," "help card") for problem behavior (e.g., screaming, hitting).',
      researchSources: ['Carr & Durand (1985)', 'Durand & Carr (1991)', 'Tiger et al. (2008)'],
      teacherAction: '"Instead of throwing your pencil, use this red card. Placing it on my desk means \'I need a 2-minute break.\' We will practice this."',
      searchTerms: ['functional communication training', 'FCT', 'replacement behavior', 'break card', 'help card', 'instead of', 'appropriate way', 'communicate need'],
      relatedTerms: ['function-based support', 'escape-motivated support']
    },
    {
      id: 'token-economy',
      term: 'Token Economy',
      category: 'behavior',
      definition: 'Students earn tokens (points, stickers, chips) for target behaviors, then exchange tokens for backup reinforcers (prizes, privileges).',
      researchSources: ['Kazdin (1977)', 'Hackenberg (2009)'],
      teacherAction: '"Every time you work for 5 minutes without talking, you earn one \'class dollar.\' Save 5 dollars for 5 minutes of free time, or 10 dollars for a small prize."',
      searchTerms: ['token economy', 'tokens', 'earn rewards', 'class dollars', 'sticker chart', 'point system', 'incentive system'],
      relatedTerms: ['daily report card', 'behavior-specific praise']
    },
    {
      id: 'planned-ignoring',
      term: 'Planned Ignoring (with BSP)',
      category: 'behavior',
      definition: 'Withdraw attention from minor, non-dangerous attention-seeking behaviors (whining, tapping) while simultaneously praising an appropriate peer.',
      researchSources: ['Hall et al. (1972)', 'Madsen et al. (1968)'],
      teacherAction: '"(Student is tapping pencil loudly). Teacher looks at another student: \'I love how Maria is working quietly.\' (Continue ignoring until it stops, then immediately praise the original student for quiet hands)."',
      searchTerms: ['planned ignoring', 'ignore', 'attention seeking behavior', 'whining', 'tapping', 'minor behavior', 'don\'t react'],
      relatedTerms: ['behavior-specific praise', 'function-based support']
    },
    {
      id: 'noncontingent-reinforcement',
      term: 'Noncontingent Reinforcement (NCR)',
      category: 'behavior',
      definition: 'Provide the reinforcer (e.g., attention, break) on a fixed time schedule regardless of behavior to reduce the motivation to act out.',
      researchSources: ['Vollmer et al. (1993)', 'Carr et al. (2000)'],
      teacherAction: '"Every 5 minutes, I will walk by and tap your desk. That means \'Good job staying in your seat.\' You don\'t have to earn it. It just happens."',
      searchTerms: ['noncontingent reinforcement', 'NCR', 'free attention', 'scheduled attention', 'regardless of behavior', 'prevent acting out'],
      relatedTerms: ['function-based support', 'co-regulation']
    },

    // ========== PROGRESS MONITORING ==========
    {
      id: 'curriculum-based-measurement',
      term: 'Curriculum-Based Measurement (CBM)',
      category: 'monitoring',
      definition: 'Brief, 1-3 minute standardized probes in reading (ORF), math (M-COMP), writing (CWS), or spelling. Weekly checks.',
      researchSources: ['Deno (1985)', 'Fuchs & Fuchs (2011)'],
      teacherAction: '"Here is a 1-minute math probe. Do as many as you can. Go. (Score = digits correct.) Compare to last week\'s score."',
      searchTerms: ['curriculum-based measurement', 'CBM', 'probe', 'weekly check', 'brief assessment', 'track progress', 'is it working'],
      relatedTerms: ['baseline', 'goal setting graphing', 'decision rules']
    },
    {
      id: 'goal-setting-graphing',
      term: 'Goal Setting with Visual Graphing',
      category: 'monitoring',
      definition: 'Student plots their own daily/weekly data on a simple line graph with a visible aim line.',
      researchSources: ['Fuchs & Fuchs (1986)', 'Hattie & Timperley (2007)'],
      teacherAction: '"Your baseline was 4 problems in 10 minutes. Your goal is 8. Draw a line from 4 to 8 across 6 weeks. Plot your score every Friday."',
      searchTerms: ['goal setting', 'graphing', 'aim line', 'plot progress', 'visual progress', 'see growth', 'student graphs'],
      relatedTerms: ['curriculum-based measurement', 'self-monitoring math']
    },
    {
      id: 'systematic-direct-observation',
      term: 'Systematic Direct Observation',
      category: 'monitoring',
      definition: 'Observe student for 10-15 minutes, recording frequency of a specific behavior (e.g., blurts, out-of-seat) or interval sampling.',
      researchSources: ['Hintze et al. (2002)'],
      teacherAction: '"Use this tally sheet. Every time Ryan talks without raising hand, make a tally. Do this for three 10-minute math periods. Average the tallies."',
      searchTerms: ['systematic direct observation', 'tally', 'count behavior', 'observe', 'frequency', 'how many times', 'track behavior'],
      relatedTerms: ['baseline', 'behavioral frequency chart']
    },
    {
      id: 'decision-rules',
      term: 'Decision Rules (4-6 Weeks)',
      category: 'monitoring',
      definition: 'After 4-6 weeks of intervention with weekly data, apply rule: If slope is below goal, increase dosage or change intervention.',
      researchSources: ['Fuchs & Fuchs (1999)', 'Ardoin et al. (2013)'],
      teacherAction: '"After 6 weeks, look at the graph. If data points are below the aim line 4 weeks in a row, move to Tier 3. If above, fade intervention."',
      searchTerms: ['decision rules', '4-6 weeks', 'when to change', 'is intervention working', 'continue or stop', 'adjust intervention'],
      relatedTerms: ['dosage', 'goal setting graphing', 'RTI tiers']
    },
    {
      id: 'behavioral-frequency-chart',
      term: 'Behavioral Frequency Chart',
      category: 'monitoring',
      definition: 'A simple log to count how many times a specific behavior (e.g., call-out, leaving seat) occurs per class period or per day.',
      researchSources: ['Riley-Tillman et al. (2009)'],
      teacherAction: '"Make a chart with dates down the side and \'Blurts\' as the column. Each time student blurts, add a tally. Total at end of day."',
      searchTerms: ['behavioral frequency chart', 'count behavior', 'tally chart', 'daily log', 'how often', 'behavior tracking'],
      relatedTerms: ['systematic direct observation', 'baseline']
    },

    // ========== RTI / MTSS ==========
    {
      id: 'tier-1-universal',
      term: 'Tier 1: Universal Instruction',
      category: 'rti',
      definition: 'High-quality core instruction for all students. Differentiated. If more than 20% of class needs intervention, change core instruction first.',
      researchSources: ['Fuchs & Fuchs (2006)', 'Batsche et al. (2005)'],
      teacherAction: '"If 8 of 25 failed the verb test, re-teach verbs to the whole class tomorrow using kinesthetic methods."',
      searchTerms: ['tier 1', 'universal', 'whole class', 'core instruction', 'everyone', 'general education', 'most students struggling'],
      relatedTerms: ['tier 2 targeted', 'tier 3 intensive']
    },
    {
      id: 'tier-2-targeted',
      term: 'Tier 2: Targeted Intervention',
      category: 'rti',
      definition: 'Small group (3-5 students) for specific skills. In addition to Tier 1. Duration: 6-8 weeks. Daily 15-30 minute sessions.',
      researchSources: ['Vaughn et al. (2010)', 'Gersten et al. (2009)'],
      teacherAction: '"These 4 students cannot blend \'sh\' sounds. 15 minutes daily at the back table with Whisper Phones while others do seat work."',
      searchTerms: ['tier 2', 'targeted', 'small group', 'intervention', '6-8 weeks', 'specific skill', 'some students'],
      relatedTerms: ['tier 1 universal', 'tier 3 intensive', 'decision rules']
    },
    {
      id: 'tier-3-intensive',
      term: 'Tier 3: Intensive Intervention',
      category: 'rti',
      definition: '1:1 instruction. Highly individualized. Weekly progress monitoring. For students significantly behind or with severe behaviors.',
      researchSources: ['Wanzek & Vaughn (2007)', 'Fuchs et al. (2012)'],
      teacherAction: '"This student needs a customized Behavior Contract (DRC) plus daily Check-In/Check-Out with counselor. Generic small group did not work after 8 weeks."',
      searchTerms: ['tier 3', 'intensive', 'one-on-one', 'individualized', 'severe', 'significantly behind', 'not responding', 'Tier 2 didn\'t work'],
      relatedTerms: ['tier 2 targeted', 'decision rules', 'daily report card']
    }
  ]
};