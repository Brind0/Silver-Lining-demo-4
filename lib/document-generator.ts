interface DocumentData {
  projectName: string
  requester: string
  generatedAt: string
  data: any
}

interface ExecutiveBrief {
  id: string
  filename: string
  title: string
  generatedAt: string
  projectId: string
  projectName: string
  requester: string
  content: DocumentSection[]
}

interface DocumentSection {
  id: string
  title: string
  content: string | DocumentSubsection[]
  type: 'text' | 'metrics' | 'list' | 'table'
}

interface DocumentSubsection {
  subtitle?: string
  content: string
  type: 'paragraph' | 'bullet' | 'metric' | 'highlight'
}

export function generateExecutiveBrief(data: DocumentData): ExecutiveBrief {
  const date = new Date(data.generatedAt)
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.')

  const document: ExecutiveBrief = {
    id: `exec-brief-${Date.now()}`,
    filename: `${data.projectName} - Meeting Brief ${formattedDate}`,
    title: `Meeting Brief: ${data.projectName}`,
    generatedAt: data.generatedAt,
    projectId: data.projectName === 'Henderson Golf Sim' ? '1' : '2',
    projectName: data.projectName,
    requester: data.requester,
    content: [
      {
        id: 'project-context',
        title: 'Project Context & Recent Developments',
        type: 'text',
        content: [
          {
            content: `${data.projectName} - ${data.requester}'s Project. Equipment delivery delay recovered through weekend installation. Currently in Week 2 of installation phase, back on May 15th target completion.`,
            type: 'highlight'
          },
          {
            subtitle: 'Critical Numbers',
            content: '• 2 weeks lost due to TechnoGolf component shortage\n• 2 weeks recovered through weekend crew deployment\n• £2,400 overtime costs to maintain timeline\n• £8,000 penalty clause avoided through recovery actions',
            type: 'bullet'
          }
        ]
      },
      {
        id: 'timeline-events',
        title: 'Detailed Timeline Recovery Analysis',
        type: 'text',
        content: [
          {
            subtitle: 'Root Cause Analysis',
            content: `TechnoGolf experienced component shortage in their German supply chain affecting projection screen assemblies. Original equipment delivery scheduled for March 15th was delayed to March 25th (10 days). This impacted the critical path as projection system installation is prerequisite for electrical calibration and interior finishing work.`,
            type: 'paragraph'
          },
          {
            subtitle: 'Comprehensive Recovery Strategy Implementation',
            content: '• Deployed 2-person weekend crew (James Mitchell + certified assistant) for 3 consecutive weekends\n• Restructured work sequence to overlap electrical rough-in with flooring preparation (normally sequential phases)\n• Expedited calibration equipment delivery through TechnoGolf priority shipping (£180 additional cost)\n• Secured TechnoGolf weekend technical support for system integration testing\n• Extended daily work hours Monday-Friday from 8 hours to 10 hours during recovery period\n• Coordinated with electrical contractor for parallel conduit installation during equipment setup',
            type: 'bullet'
          },
          {
            subtitle: 'Current Status and Measurable Progress',
            content: 'Full 14-day recovery achieved through accelerated schedule. Installation progress: projection system 100% complete, electrical integration 95% complete, calibration hardware 80% complete, interior finishing 85% complete. Critical path items remain on schedule for May 15th target completion.',
            type: 'paragraph'
          },
          {
            subtitle: 'Lessons Learned and Process Improvements',
            content: 'Established backup supplier relationships with UK-based projection equipment vendors. Implemented earlier equipment delivery scheduling (3-week buffer instead of 1-week). Created detailed dependency mapping for all future installations to identify critical path vulnerabilities earlier in project lifecycle.',
            type: 'paragraph'
          }
        ]
      },
      {
        id: 'financial-reality',
        title: 'Comprehensive Financial Analysis',
        type: 'text',
        content: [
          {
            subtitle: 'Detailed Cost Breakdown of Recovery Actions',
            content: 'Total overtime investment: £2,400 breakdown as follows: Weekend crew overtime (3 weekends × £600) = £1,800; Extended weekday hours (15 days × £40) = £600; Expedited shipping costs = £180. This represents 5.3% of the £45,000 total project budget, well within the allocated 8% contingency fund.',
            type: 'paragraph'
          },
          {
            subtitle: 'Industry Benchmarking and Variance Analysis',
            content: 'Current project variance of 6% positions significantly below industry standards for golf simulator installations. Based on 2024 industry data: average variance 8-12% for similar projects, with 23% of projects exceeding 15% variance. Our controlled 6% variance ranks in top quartile of project performance, demonstrating exceptional cost management despite external supply chain disruptions.',
            type: 'paragraph'
          },
          {
            subtitle: 'Value Protection and Risk Mitigation',
            content: 'Strategic decision to invest £2,400 in recovery actions protected £8,000 late delivery penalty clause in Simon\'s contract. Additional value protected: maintained May 15th completion enables Simon\'s planned corporate event schedule (estimated value £12,000). Net financial benefit: £17,600 value protected through £2,400 investment = 733% return on recovery investment.',
            type: 'paragraph'
          },
          {
            subtitle: 'Budget Forecast and Remaining Contingency',
            content: 'Remaining project phases (final calibration, testing, documentation) budgeted at £2,700 with £1,100 contingency remaining. Weather delay contingency (if required) estimated at maximum £800 additional cost. Project tracking to complete within £47,100 total spend (4.7% variance) assuming no further supply chain disruptions.',
            type: 'paragraph'
          }
        ]
      },
      {
        id: 'simon-intelligence',
        title: 'Client Relationship Intelligence & Communication History',
        type: 'text',
        content: [
          {
            subtitle: 'Historical Concern Patterns and Communication Preferences',
            content: 'Simon has consistently prioritized three areas in all project communications: timeline adherence (mentioned in 6 of 8 conversations), quality standards (specifically asked about certification 4 times), and budget control (requested detailed breakdowns twice). He prefers detailed technical explanations over summary updates and values proactive communication about potential issues. Response time expectation: within 4 hours for timeline questions, same-day for quality concerns.',
            type: 'paragraph'
          },
          {
            subtitle: 'Warranty and Quality Assurance Documentation',
            content: 'TechnoGolf has provided written warranty confirmation: full 5-year comprehensive coverage remains intact despite installation timeline changes. Weekend work performed under same certification standards with James Mitchell (TechnoGolf certified Level 3 technician) supervising all installations. Documentation package includes: certified installer work logs, photo documentation of all connection points, system integration test results, and TechnoGolf remote monitoring reports confirming installation quality standards.',
            type: 'paragraph'
          },
          {
            subtitle: 'Corporate Event Integration Requirements',
            content: 'Simon\'s May 15th completion requirement driven by corporate entertainment event scheduled for May 22nd (200+ attendees). Event planning includes simulator demonstrations as key attraction. Backup event contingency exists if completion delayed beyond May 18th, but preference strongly for original timeline. User training must accommodate event preparation timeline - recommend completion by May 13th to allow event rehearsal time.',
            type: 'paragraph'
          },
          {
            subtitle: 'Future Project Considerations and Relationship Development',
            content: 'Simon has indicated potential for additional simulator installation at secondary location (estimated £65,000 project value) pending successful completion of current project. His decision criteria for future work: on-time delivery, quality of installation, and post-completion support responsiveness. Current project performance directly impacts future business relationship worth potentially £150,000+ over 3-year period.',
            type: 'paragraph'
          }
        ]
      },
      {
        id: 'predictive-elements',
        title: 'Risk Analysis and Strategic Planning',
        type: 'text',
        content: [
          {
            subtitle: 'Weather Impact Analysis and Probability Assessment',
            content: 'Based on 5-year weather data for final installation week (May 8-15), 30% probability of 2+ consecutive days of precipitation that could affect exterior work. Specific risks: external equipment housing installation requires dry conditions, cable routing through exterior walls weather-dependent, final system grounding cannot be completed in wet conditions. Critical threshold: 48+ hours continuous precipitation would trigger indoor contingency plan.',
            type: 'paragraph'
          },
          {
            subtitle: 'Technical Risk Factors and Dependencies',
            content: 'Final calibration phase requires controlled environment: temperature 18-24°C, humidity below 60%, minimal electromagnetic interference. Current facility conditions marginally acceptable (humidity averaging 65%). Calibration window: 72-hour period required for full system optimization. Backup calibration scheduling: alternative indoor location identified with optimal conditions if primary location unsuitable.',
            type: 'paragraph'
          },
          {
            subtitle: 'Client Decision Timeline and Critical Path Dependencies',
            content: 'Key decisions required from Simon with deadlines: User training format preference (group vs individual) - decision needed by May 1st to schedule appropriate resources. Final walkthrough scheduling - must occur by May 12th to allow any final adjustments within timeline. Documentation delivery preference (digital portal vs printed manuals) affects final week resource allocation. Corporate event coordination details needed by May 8th for any simulator demonstration requirements.',
            type: 'paragraph'
          },
          {
            subtitle: 'Future Business Development Opportunities',
            content: 'Current project success metrics directly influence £150,000+ future business potential. Secondary location project (£65,000 estimated value) dependent on May 15th completion and positive corporate event feedback. Long-term maintenance contract negotiations (£8,000 annual value) scheduled for post-completion discussion. Referral potential to Simon\'s business network estimated at 3-5 additional projects over 18-month period based on corporate event exposure.',
            type: 'paragraph'
          }
        ]
      },
      {
        id: 'detailed-contingency-planning',
        title: 'Detailed Contingency Planning',
        type: 'text',
        content: [
          {
            subtitle: 'Weather Risk Mitigation - Indoor Work Plan',
            content: 'With 30% probability of weather delays in final week based on seasonal patterns, comprehensive indoor backup plan has been developed. Alternative completion sequence moves all weather-dependent exterior work (cable runs, external unit placement) to covered areas or delays to post-completion. Interior calibration work prioritized during any weather windows.',
            type: 'paragraph'
          },
          {
            subtitle: 'Equipment and Resources on Standby',
            content: '• Dehumidification units pre-positioned for calibration requirements\n• Alternative power routing through basement access (weather-independent)\n• Mobile shelter system available for external equipment installation\n• Extended crew availability secured through May 20th if needed',
            type: 'bullet'
          },
          {
            subtitle: 'Quality Assurance Protocols',
            content: 'Enhanced quality protocols implemented following equipment delay recovery include: dual technician sign-off on all weekend work, photo documentation of all connections, TechnoGolf remote monitoring during installation phases, and pre-completion system stress testing beyond standard requirements.',
            type: 'paragraph'
          },
          {
            subtitle: 'Client Communication Schedule',
            content: 'Weekly progress updates established with Simon including photo documentation of installation milestones. Final walkthrough scheduled for May 10th (5 business days before completion) to allow for any final adjustments. User training session to be scheduled based on Simon\'s team availability - options prepared for both group training (all users together) and individual sessions.',
            type: 'paragraph'
          }
        ]
      }
    ]
  }

  return document
}

export function formatDocumentForViewing(document: ExecutiveBrief): string {
  let html = `
    <div class="document-viewer">
      <div class="document-header">
        <h1>${document.title}</h1>
        <div class="document-meta">
          <p>Generated: ${new Date(document.generatedAt).toLocaleString()}</p>
          <p>Requested by: ${document.requester}</p>
        </div>
      </div>
  `

  document.content.forEach(section => {
    html += `<div class="document-section">
      <h2>${section.title}</h2>`

    if (typeof section.content === 'string') {
      html += `<div class="section-content">${section.content}</div>`
    } else {
      section.content.forEach(subsection => {
        if (subsection.subtitle) {
          html += `<h3>${subsection.subtitle}</h3>`
        }

        if (subsection.type === 'bullet') {
          const bullets = subsection.content.split('\n').filter(line => line.trim())
          html += '<ul>'
          bullets.forEach(bullet => {
            html += `<li>${bullet.replace('•', '').trim()}</li>`
          })
          html += '</ul>'
        } else if (subsection.type === 'highlight') {
          html += `<div class="highlight-box">${subsection.content}</div>`
        } else {
          html += `<p>${subsection.content}</p>`
        }
      })
    }

    html += '</div>'
  })

  html += '</div>'
  return html
}