// ─── MOBILE SIDEBAR ──────────────────────────────────────────
const toggle = document.getElementById('mobileToggle');
const sidebar = document.getElementById('sidebar');

if (toggle) {
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

// ─── TABBED NAVIGATION LOGIC ──────────────────────────────────
const mainContainer = document.querySelector('.main');
const sections = document.querySelectorAll('.js-section');
const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

function showSection(id) {
  if (!id) return;
  
  // Hide all sections
  sections.forEach(s => s.classList.add('hidden-section'));
  
  // Show target section
  const target = document.getElementById(id);
  if (target) {
    target.classList.remove('hidden-section');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mainContainer.scrollTop = 0;
  }

  // Update nav links
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + id) {
      link.classList.add('active');
    }
  });

  // Close sidebar on mobile
  if (sidebar) sidebar.classList.remove('open');
}

// Attach click listeners to nav links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = link.getAttribute('href').replace('#', '');
    showSection(id);
  });
});

// Update Search handler to use showSection
function handleSearchSelection(id) {
  // If id is a skill ID like "skill-agency-...", find its parent section
  let targetId = id;
  const element = document.getElementById(id);
  if (element && element.closest('.js-section')) {
    targetId = element.closest('.js-section').id;
  }
  
  showSection(targetId);
  
  // If it was a specific skill, wait for section to show then scroll to it
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

// ─── COPY TO CLIPBOARD ──────────────────────────────────────
document.querySelectorAll('code').forEach(el => {
  el.style.cursor = 'pointer';
  el.title = 'Click to copy';
  el.addEventListener('click', () => {
    const text = el.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const originalText = el.textContent;
      el.textContent = '✓ Copied';
      el.style.color = '#10b981';
      setTimeout(() => {
        el.textContent = originalText;
        el.style.color = '';
      }, 1000);
    });
  });
});

// ─── FADE IN ANIMATION ───────────────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { root: mainContainer, threshold: 0.1 });

document.querySelectorAll('.hero, .comparison-table, .feature-card, .data-table-wrap, .section-title').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  fadeObserver.observe(el);
});

// ─── SEARCH & SLASH COMMANDS ──────────────────────────────────
const searchInput = document.getElementById('searchInput');
const suggestionsBox = document.getElementById('searchSuggestions');

const SLASH_COMMANDS = [

  {
    "name": "/init",
    "desc": "Khởi tạo dự án mới, cài đặt môi trường và cấu trúc folder ban đầu.",
    "id": "slash-commands"
  },
  {
    "name": "/brainstorm",
    "desc": "Động não, thảo luận ý tưởng, nghiên cứu giải pháp trước khi bắt tay làm.",
    "id": "slash-commands"
  },
  {
    "name": "/plan",
    "desc": "Lập kế hoạch chi tiết, phân rã công việc thành các task nhỏ và định rõ mục tiêu.",
    "id": "slash-commands"
  },
  {
    "name": "/design",
    "desc": "Thiết kế kỹ thuật: sơ đồ DB, logic API, luồng xử lý và kiến trúc hệ thống.",
    "id": "slash-commands"
  },
  {
    "name": "/visualize",
    "desc": "Thiết kế UI/UX mockup, tạo hình ảnh giao diện phác thảo để hình dung sản phẩm.",
    "id": "slash-commands"
  },
  {
    "name": "/code",
    "desc": "Bắt đầu viết code dựa trên Spec và thiết kế đã thống nhất.",
    "id": "slash-commands"
  },
  {
    "name": "/run",
    "desc": "Chạy thử ứng dụng trong môi trường local để kiểm tra chức năng.",
    "id": "slash-commands"
  },
  {
    "name": "/debug",
    "desc": "Truy tìm và sửa lỗi khi hệ thống gặp trục trặc hoặc không chạy đúng ý.",
    "id": "slash-commands"
  },
  {
    "name": "/test",
    "desc": "Thực hiện kiểm thử Unit Test, E2E để đảm bảo chất lượng code và logic.",
    "id": "slash-commands"
  },
  {
    "name": "/audit",
    "desc": "Kiểm tra bảo mật và tối ưu hóa code theo các tiêu chuẩn vận hành.",
    "id": "slash-commands"
  },
  {
    "name": "/deploy",
    "desc": "Triển khai mã nguồn lên môi trường Production (Vercel, Cloudflare, VPS).",
    "id": "slash-commands"
  },
  {
    "name": "/next",
    "desc": "Hỏi AI bước tiếp theo cần làm gì khi bạn cảm thấy bị tắc hoặc cần gợi ý.",
    "id": "slash-commands"
  },
  {
    "name": "/recap",
    "desc": "Tóm tắt lại toàn bộ tiến độ dự án để khôi phục ngữ cảnh làm việc.",
    "id": "slash-commands"
  },
  {
    "name": "/help",
    "desc": "Trợ giúp và hướng dẫn sử dụng các lệnh hoặc công cụ trong hệ thống.",
    "id": "slash-commands"
  },
  {
    "name": "/customize",
    "desc": "Cá nhân hóa AI, điều chỉnh tính cách và phong cách làm việc của trợ lý.",
    "id": "slash-commands"
  },
  {
    "name": "/refactor",
    "desc": "Làm sạch và tối ưu hóa lại code hiện có mà không làm thay đổi tính năng.",
    "id": "slash-commands"
  },
  {
    "name": "/review",
    "desc": "Tổng quan lại toàn bộ dự án trước khi bàn giao hoặc kết thúc session.",
    "id": "slash-commands"
  },
  {
    "name": "/save-brain",
    "desc": "Lưu lại các kiến thức quan trọng của dự án vào bộ nhớ Eternal Context.",
    "id": "slash-commands"
  },
  {
    "name": "/rollback",
    "desc": "Quay lại phiên bản trước đó nếu bản cập nhật mới gặp lỗi nghiêm trọng.",
    "id": "slash-commands"
  },
  {
    "name": "/awf-update",
    "desc": "Cập nhật hệ thống AWF lên phiên bản mới nhất từ Cloud.",
    "id": "slash-commands"
  },
  {
    "name": "/cloudflare-tunnel",
    "desc": "Quản lý Tunnel Cloudflare để public web từ local ra internet.",
    "id": "slash-commands"
  },
  {
    "name": "/Folder Organization System",
    "desc": "Hệ thống hóa và tổ chức lại cấu trúc folder/file một cách kh...",
    "id": "skill-Folder Organization System"
  },
  {
    "name": "/accessibility-review",
    "desc": "Audit thiết kế và code theo chuẩn WCAG 2.1 AA. Kích hoạt khi...",
    "id": "skill-accessibility-review"
  },
  {
    "name": "/account-research",
    "desc": "Nghiên cứu công ty hoặc cá nhân để thu thập thông tin bán hà...",
    "id": "skill-account-research"
  },
  {
    "name": "/agency-accessibility-auditor",
    "desc": "Chuyên gia kiểm định khả năng tiếp cận, audit giao diện theo...",
    "id": "skill-agency-accessibility-auditor"
  },
  {
    "name": "/agency-account-strategist",
    "desc": "Chiến lược gia tài khoản sau bán hàng, chuyên về mở rộng tài...",
    "id": "skill-agency-account-strategist"
  },
  {
    "name": "/agency-accounts-payable-agent",
    "desc": "Chuyên gia xử lý thanh toán tự động cho nhà cung cấp, hóa đơ...",
    "id": "skill-agency-accounts-payable-agent"
  },
  {
    "name": "/agency-ad-creative-strategist",
    "desc": "Chuyên gia sáng tạo nội dung quảng cáo trả phí, tối ưu hóa R...",
    "id": "skill-agency-ad-creative-strategist"
  },
  {
    "name": "/agency-agentic-identity-trust-architect",
    "desc": "Kiến trúc sư thiết kế hệ thống định danh và niềm tin cho các...",
    "id": "skill-agency-agentic-identity-trust-architect"
  },
  {
    "name": "/agency-agents-orchestrator",
    "desc": "Quản lý quy trình tự động, điều phối toàn bộ luồng phát triể...",
    "id": "skill-agency-agents-orchestrator"
  },
  {
    "name": "/agency-ai-data-remediation-engineer",
    "desc": "Chuyên gia về đường ống dữ liệu tự phục hồi, sử dụng SLM để ...",
    "id": "skill-agency-ai-data-remediation-engineer"
  },
  {
    "name": "/agency-ai-engineer",
    "desc": "Kỹ sư AI/ML chuyên nghiệp, phát triển và tích hợp các mô hìn...",
    "id": "skill-agency-ai-engineer"
  },
  {
    "name": "/agency-analytics-reporter",
    "desc": "Chuyên gia phân tích dữ liệu chuyên sâu, biến dữ liệu thô th...",
    "id": "skill-agency-analytics-reporter"
  },
  {
    "name": "/agency-api-tester",
    "desc": "Chuyên gia kiểm thử API toàn diện, xác thực hiệu suất và đảm...",
    "id": "skill-agency-api-tester"
  },
  {
    "name": "/agency-app-store-optimizer",
    "desc": "Chuyên gia marketing cửa hàng ứng dụng, tập trung vào ASO, t...",
    "id": "skill-agency-app-store-optimizer"
  },
  {
    "name": "/agency-automation-governance-architect",
    "desc": "Kiến trúc sư nội bộ cho tự động hóa kinh doanh, audit giá tr...",
    "id": "skill-agency-automation-governance-architect"
  },
  {
    "name": "/agency-autonomous-optimization-architect",
    "desc": "Người quản trị hệ thống thông minh, liên tục chạy shadow-tes...",
    "id": "skill-agency-autonomous-optimization-architect"
  },
  {
    "name": "/agency-backend-architect",
    "desc": "Kiến trúc sư backend cao cấp, chuyên thiết kế hệ thống mở rộ...",
    "id": "skill-agency-backend-architect"
  },
  {
    "name": "/agency-behavioral-nudge-engine",
    "desc": "Chuyên gia tâm lý học hành vi, điều chỉnh phong cách tương t...",
    "id": "skill-agency-behavioral-nudge-engine"
  },
  {
    "name": "/agency-blockchain-security-auditor",
    "desc": "Chuyên gia audit bảo mật smart contract, phát hiện lỗ hổng v...",
    "id": "skill-agency-blockchain-security-auditor"
  },
  {
    "name": "/agency-book-co-author",
    "desc": "Cộng tác viên chiến lược viết sách cho lãnh đạo, biến các gh...",
    "id": "skill-agency-book-co-author"
  },
  {
    "name": "/agency-brand-guardian",
    "desc": "Chuyên gia chiến lược và bảo vệ thương hiệu, duy trì tính nh...",
    "id": "skill-agency-brand-guardian"
  },
  {
    "name": "/agency-carousel-growth-engine",
    "desc": "Chuyên gia tạo nội dung carousel tự động cho TikTok/Instagra...",
    "id": "skill-agency-carousel-growth-engine"
  },
  {
    "name": "/agency-code-reviewer",
    "desc": "Chuyên gia review code tập trung vào tính chính xác, khả năn...",
    "id": "skill-agency-code-reviewer"
  },
  {
    "name": "/agency-compliance-auditor",
    "desc": "Chuyên gia audit tuân thủ kỹ thuật (SOC 2, ISO 27001, HIPAA)...",
    "id": "skill-agency-compliance-auditor"
  },
  {
    "name": "/agency-content-creator",
    "desc": "Chuyên gia chiến lược và sáng tạo nội dung đa nền tảng, quản...",
    "id": "skill-agency-content-creator"
  },
  {
    "name": "/agency-corporate-training-designer",
    "desc": "Chuyên gia thiết kế hệ thống đào tạo doanh nghiệp và chương ...",
    "id": "skill-agency-corporate-training-designer"
  },
  {
    "name": "/agency-cultural-intelligence-strategist",
    "desc": "Chuyên gia trí tuệ văn hóa, đảm bảo phần mềm cộng hưởng chân...",
    "id": "skill-agency-cultural-intelligence-strategist"
  },
  {
    "name": "/agency-data-consolidation-agent",
    "desc": "AI agent tổng hợp dữ liệu bán hàng vào dashboard báo cáo trự...",
    "id": "skill-agency-data-consolidation-agent"
  },
  {
    "name": "/agency-data-engineer",
    "desc": "Kỹ sư dữ liệu chuyên nghiệp, xây dựng đường ống dữ liệu tin ...",
    "id": "skill-agency-data-engineer"
  },
  {
    "name": "/agency-database-optimizer",
    "desc": "Chuyên gia tối ưu hóa DB, thiết kế schema, tối ưu truy vấn v...",
    "id": "skill-agency-database-optimizer"
  },
  {
    "name": "/agency-deal-strategist",
    "desc": "Chiến lược gia thương vụ cao cấp, chuyên về quy trình MEDDPI...",
    "id": "skill-agency-deal-strategist"
  },
  {
    "name": "/agency-developer-advocate",
    "desc": "Chuyên gia cộng đồng lập trình viên, tối ưu trải nghiệm DX v...",
    "id": "skill-agency-developer-advocate"
  },
  {
    "name": "/agency-devops-automator",
    "desc": "Kỹ sư DevOps chuyên nghiệp, tự động hóa hạ tầng và vận hành ...",
    "id": "skill-agency-devops-automator"
  },
  {
    "name": "/agency-discovery-coach",
    "desc": "Huấn luyện đội ngũ bán hàng về phương pháp khai thác thông t...",
    "id": "skill-agency-discovery-coach"
  },
  {
    "name": "/agency-document-generator",
    "desc": "Chuyên gia tạo tài liệu chuyên nghiệp (PDF, PPTX, DOCX) bằng...",
    "id": "skill-agency-document-generator"
  },
  {
    "name": "/agency-embedded-firmware-engineer",
    "desc": "Kỹ sư phần cứng nhúng và RTOS, chuyên về ESP32, STM32, ARM v...",
    "id": "skill-agency-embedded-firmware-engineer"
  },
  {
    "name": "/agency-evidence-collector",
    "desc": "Chuyên gia QA 'ám ảnh' bằng chứng hình ảnh, săn lùng lỗi và ...",
    "id": "skill-agency-evidence-collector"
  },
  {
    "name": "/agency-executive-summary-generator",
    "desc": "Chuyên gia AI cấp cố vấn chiến lược, tóm tắt các vấn đề kinh...",
    "id": "skill-agency-executive-summary-generator"
  },
  {
    "name": "/agency-experiment-tracker",
    "desc": "Quản lý dự án chuyên về thiết kế thử nghiệm A/B và ra quyết ...",
    "id": "skill-agency-experiment-tracker"
  },
  {
    "name": "/agency-feedback-synthesizer",
    "desc": "Chuyên gia thu thập và tổng hợp phản hồi người dùng đa kênh ...",
    "id": "skill-agency-feedback-synthesizer"
  },
  {
    "name": "/agency-finance-tracker",
    "desc": "Chuyên gia phân tích tài chính và kiểm soát, quản lý ngân sá...",
    "id": "skill-agency-finance-tracker"
  },
  {
    "name": "/agency-frontend-developer",
    "desc": "Lập trình viên frontend chuyên nghiệp, chuyên về React/Vue/A...",
    "id": "skill-agency-frontend-developer"
  },
  {
    "name": "/agency-game-audio-engineer",
    "desc": "Chuyên gia âm thanh tương tác trong game, thành thạo FMOD/Ww...",
    "id": "skill-agency-game-audio-engineer"
  },
  {
    "name": "/agency-game-designer",
    "desc": "Kiến trúc sư hệ thống game, chuyên về GDD, tâm lý người chơi...",
    "id": "skill-agency-game-designer"
  },
  {
    "name": "/agency-git-workflow-master",
    "desc": "Chuyên gia quy trình Git, chiến lược phân nhánh và các quy c...",
    "id": "skill-agency-git-workflow-master"
  },
  {
    "name": "/agency-government-digital-presales-consultant",
    "desc": "Cố vấn tiền bán hàng cho thị trường chính phủ, thành thạo ch...",
    "id": "skill-agency-government-digital-presales-consultant"
  },
  {
    "name": "/agency-growth-hacker",
    "desc": "Chiến lược gia tăng trưởng, chuyên thu hút người dùng nhanh ...",
    "id": "skill-agency-growth-hacker"
  },
  {
    "name": "/agency-healthcare-marketing-compliance-specialist",
    "desc": "Chuyên gia tuân thủ marketing y tế, thành thạo luật quảng cá...",
    "id": "skill-agency-healthcare-marketing-compliance-specialist"
  },
  {
    "name": "/agency-identity-graph-operator",
    "desc": "Người vận hành biểu đồ danh tính chung cho các AI agent tron...",
    "id": "skill-agency-identity-graph-operator"
  },
  {
    "name": "/agency-image-prompt-engineer",
    "desc": "Chuyên gia prompt hình ảnh, biến khái niệm thị giác thành ng...",
    "id": "skill-agency-image-prompt-engineer"
  },
  {
    "name": "/agency-incident-response-commander",
    "desc": "Chỉ huy ứng phó sự cố hệ thống, điều phối phản ứng có cấu tr...",
    "id": "skill-agency-incident-response-commander"
  },
  {
    "name": "/agency-inclusive-visuals-specialist",
    "desc": "Chuyên gia hình ảnh bao trùm, loại bỏ định kiến AI để tạo nộ...",
    "id": "skill-agency-inclusive-visuals-specialist"
  },
  {
    "name": "/agency-infrastructure-maintainer",
    "desc": "Chuyên gia duy trì hạ tầng hệ thống, tập trung vào độ tin cậ...",
    "id": "skill-agency-infrastructure-maintainer"
  },
  {
    "name": "/agency-instagram-curator",
    "desc": "Chuyên gia marketing Instagram, kể chuyện bằng hình ảnh và x...",
    "id": "skill-agency-instagram-curator"
  },
  {
    "name": "/agency-jira-workflow-steward",
    "desc": "Người quản lý quy trình Jira, đảm bảo commit có thể truy vết...",
    "id": "skill-agency-jira-workflow-steward"
  },
  {
    "name": "/agency-legal-compliance-checker",
    "desc": "Chuyên gia pháp lý và tuân thủ, đảm bảo hoạt động kinh doanh...",
    "id": "skill-agency-legal-compliance-checker"
  },
  {
    "name": "/agency-level-designer",
    "desc": "Chuyên gia thiết kế màn chơi, thành thạo kể chuyện qua môi t...",
    "id": "skill-agency-level-designer"
  },
  {
    "name": "/agency-linkedin-content-creator",
    "desc": "Chuyên gia nội dung LinkedIn, xây dựng thương hiệu cá nhân v...",
    "id": "skill-agency-linkedin-content-creator"
  },
  {
    "name": "/agency-livestream-commerce-coach",
    "desc": "Huấn luyện viên bán hàng livestream, đào tạo host và vận hàn...",
    "id": "skill-agency-livestream-commerce-coach"
  },
  {
    "name": "/agency-lsp-index-engineer",
    "desc": "Kỹ sư giao thức LSP, xây dựng hệ thống trí tuệ mã nguồn qua ...",
    "id": "skill-agency-lsp-index-engineer"
  },
  {
    "name": "/agency-macos-spatial-metal-engineer",
    "desc": "Kỹ sư Swift và Metal, xây dựng hệ thống dựng hình 3D cho mac...",
    "id": "skill-agency-macos-spatial-metal-engineer"
  },
  {
    "name": "/agency-mcp-builder",
    "desc": "Chuyên gia phát triển server MCP để mở rộng khả năng của AI ...",
    "id": "skill-agency-mcp-builder"
  },
  {
    "name": "/agency-mobile-app-builder",
    "desc": "Lập trình viên ứng dụng di động chuyên nghiệp (iOS/Android) ...",
    "id": "skill-agency-mobile-app-builder"
  },
  {
    "name": "/agency-model-qa-specialist",
    "desc": "Chuyên gia QA mô hình ML độc lập, audit toàn diện từ tài liệ...",
    "id": "skill-agency-model-qa-specialist"
  },
  {
    "name": "/agency-narrative-designer",
    "desc": "Kiến trúc sư nội dung và hội thoại game, xây dựng thế giới v...",
    "id": "skill-agency-narrative-designer"
  },
  {
    "name": "/agency-outbound-strategist",
    "desc": "Chuyên gia tiếp cận khách hàng dựa trên tín hiệu và cá nhân ...",
    "id": "skill-agency-outbound-strategist"
  },
  {
    "name": "/agency-paid-media-auditor",
    "desc": "Kiểm toán truyền thông trả phí, đánh giá hệ thống quảng cáo ...",
    "id": "skill-agency-paid-media-auditor"
  },
  {
    "name": "/agency-paid-social-strategist",
    "desc": "Chiến lược gia quảng cáo mạng xã hội đa nền tảng, thiết kế c...",
    "id": "skill-agency-paid-social-strategist"
  },
  {
    "name": "/agency-performance-benchmarker",
    "desc": "Chuyên gia đo lường và tối ưu hóa hiệu năng hệ thống trên to...",
    "id": "skill-agency-performance-benchmarker"
  },
  {
    "name": "/agency-pipeline-analyst",
    "desc": "Chuyên gia phân tích phễu doanh thu, chẩn đoán sức khỏe pipe...",
    "id": "skill-agency-pipeline-analyst"
  },
  {
    "name": "/agency-podcast-strategist",
    "desc": "Chuyên gia chiến lược podcast, định vị chương trình và phát ...",
    "id": "skill-agency-podcast-strategist"
  },
  {
    "name": "/agency-ppc-campaign-strategist",
    "desc": "Chiến lược gia PPC cao cấp, kiến trúc chiến dịch tìm kiếm qu...",
    "id": "skill-agency-ppc-campaign-strategist"
  },
  {
    "name": "/agency-programmatic-display-buyer",
    "desc": "Chuyên gia mua quảng cáo hiển thị lập trình và chiến lược hi...",
    "id": "skill-agency-programmatic-display-buyer"
  },
  {
    "name": "/agency-project-shepherd",
    "desc": "Quản lý dự án chuyên nghiệp, điều phối liên phòng ban và dẫn...",
    "id": "skill-agency-project-shepherd"
  },
  {
    "name": "/agency-proposal-strategist",
    "desc": "Kiến trúc sư đề xuất chiến lược, biến các cơ hội thầu thành ...",
    "id": "skill-agency-proposal-strategist"
  },
  {
    "name": "/agency-rapid-prototyper",
    "desc": "Chuyên gia tạo mẫu nhanh, xây dựng POC và MVP tốc độ cao bằn...",
    "id": "skill-agency-rapid-prototyper"
  },
  {
    "name": "/agency-reality-checker",
    "desc": "Kiểm chứng thực tế, ngăn chặn các phê duyệt mơ hồ và yêu cầu...",
    "id": "skill-agency-reality-checker"
  },
  {
    "name": "/agency-recruitment-specialist",
    "desc": "Chuyên gia tuyển dụng và thu hút nhân tài, thành thạo các nề...",
    "id": "skill-agency-recruitment-specialist"
  },
  {
    "name": "/agency-reddit-community-builder",
    "desc": "Chuyên gia marketing Reddit, tương tác cộng đồng chân thực v...",
    "id": "skill-agency-reddit-community-builder"
  },
  {
    "name": "/agency-report-distribution-agent",
    "desc": "AI agent tự động phân phối báo cáo bán hàng cho đại diện the...",
    "id": "skill-agency-report-distribution-agent"
  },
  {
    "name": "/agency-sales-coach",
    "desc": "Huấn luyện viên bán hàng, phát triển kỹ năng nhân viên và ch...",
    "id": "skill-agency-sales-coach"
  },
  {
    "name": "/agency-sales-data-extraction-agent",
    "desc": "AI agent trích xuất chỉ số bán hàng từ file Excel để báo cáo...",
    "id": "skill-agency-sales-data-extraction-agent"
  },
  {
    "name": "/agency-sales-engineer",
    "desc": "Kỹ sư bán hàng (tiền bán hàng), xây dựng demo và kết nối sản...",
    "id": "skill-agency-sales-engineer"
  },
  {
    "name": "/agency-search-query-analyst",
    "desc": "Chuyên gia phân tích truy vấn, cấu trúc từ khóa phủ định và ...",
    "id": "skill-agency-search-query-analyst"
  },
  {
    "name": "/agency-security-engineer",
    "desc": "Kỹ sư bảo mật ứng dụng, chuyên đánh giá lỗ hổng và thiết kế ...",
    "id": "skill-agency-security-engineer"
  },
  {
    "name": "/agency-senior-developer",
    "desc": "Chuyên gia triển khai cao cấp, thành thạo Laravel, CSS nâng ...",
    "id": "skill-agency-senior-developer"
  },
  {
    "name": "/agency-senior-project-manager",
    "desc": "Quản lý dự án cao cấp, bám sát phạm vi thực tế và không bao ...",
    "id": "skill-agency-senior-project-manager"
  },
  {
    "name": "/agency-seo-specialist",
    "desc": "Chuyên gia chiến lược SEO, tối ưu hóa kỹ thuật và nội dung đ...",
    "id": "skill-agency-seo-specialist"
  },
  {
    "name": "/agency-short-video-editing-coach",
    "desc": "Huấn luyện viên dựng video ngắn, thành thạo hậu kỳ và các cô...",
    "id": "skill-agency-short-video-editing-coach"
  },
  {
    "name": "/agency-social-media-strategist",
    "desc": "Chiến lược gia mạng xã hội, xây dựng cộng đồng và quản lý tư...",
    "id": "skill-agency-social-media-strategist"
  },
  {
    "name": "/agency-software-architect",
    "desc": "Kiến trúc sư phần mềm, thiết kế hệ thống lớn và đưa ra các q...",
    "id": "skill-agency-software-architect"
  },
  {
    "name": "/agency-solidity-smart-contract-engineer",
    "desc": "Kỹ sư Solidity, chuyên kiến trúc smart contract EVM và tối ư...",
    "id": "skill-agency-solidity-smart-contract-engineer"
  },
  {
    "name": "/agency-sprint-prioritizer",
    "desc": "Chuyên gia ưu tiên Sprint, lập kế hoạch Agile và phân bổ ngu...",
    "id": "skill-agency-sprint-prioritizer"
  },
  {
    "name": "/agency-sre-site-reliability-engineer",
    "desc": "Kỹ sư tin cậy hệ thống, chuyên về SLO và giảm tải công việc ...",
    "id": "skill-agency-sre-site-reliability-engineer"
  },
  {
    "name": "/agency-studio-operations",
    "desc": "Quản lý vận hành studio, tối ưu hóa quy trình và điều phối n...",
    "id": "skill-agency-studio-operations"
  },
  {
    "name": "/agency-studio-producer",
    "desc": "Lãnh đạo dự án Studio, điều phối các dự án sáng tạo và kỹ th...",
    "id": "skill-agency-studio-producer"
  },
  {
    "name": "/agency-study-abroad-advisor",
    "desc": "Chuyên gia tư vấn du học toàn diện cho các thị trường Âu-Mỹ-...",
    "id": "skill-agency-study-abroad-advisor"
  },
  {
    "name": "/agency-supply-chain-strategist",
    "desc": "Chiến lược gia chuỗi cung ứng, xây dựng mạng lưới cung ứng h...",
    "id": "skill-agency-supply-chain-strategist"
  },
  {
    "name": "/agency-support-responder",
    "desc": "Chuyên gia phản hồi hỗ trợ, giải quyết sự cố và tối ưu hóa t...",
    "id": "skill-agency-support-responder"
  },
  {
    "name": "/agency-technical-artist",
    "desc": "Chuyên gia kỹ thuật mỹ thuật, thành thạo shader và tối ưu hó...",
    "id": "skill-agency-technical-artist"
  },
  {
    "name": "/agency-technical-writer",
    "desc": "Chuyên gia viết tài liệu kỹ thuật, chuyển đổi khái niệm phức...",
    "id": "skill-agency-technical-writer"
  },
  {
    "name": "/agency-terminal-integration-specialist",
    "desc": "Chuyên gia tích hợp terminal và tối ưu hóa hiển thị văn bản ...",
    "id": "skill-agency-terminal-integration-specialist"
  },
  {
    "name": "/agency-test-results-analyzer",
    "desc": "Chuyên gia phân tích kết quả kiểm thử, đánh giá chất lượng t...",
    "id": "skill-agency-test-results-analyzer"
  },
  {
    "name": "/agency-threat-detection-engineer",
    "desc": "Kỹ sư phát hiện mối đe dọa, xây dựng quy tắc SIEM và đường ố...",
    "id": "skill-agency-threat-detection-engineer"
  },
  {
    "name": "/agency-tiktok-strategist",
    "desc": "Chiến lược gia TikTok, tập trung vào nội dung viral và tối ư...",
    "id": "skill-agency-tiktok-strategist"
  },
  {
    "name": "/agency-tool-evaluator",
    "desc": "Chuyên gia đánh giá công cụ công nghệ, đề xuất phần mềm tối ...",
    "id": "skill-agency-tool-evaluator"
  },
  {
    "name": "/agency-tracking-measurement-specialist",
    "desc": "Chuyên gia đo lường chuyển đổi, quản lý tag và các mô hình p...",
    "id": "skill-agency-tracking-measurement-specialist"
  },
  {
    "name": "/agency-trend-researcher",
    "desc": "Chuyên gia nghiên cứu xu hướng thị trường, phân tích đối thủ...",
    "id": "skill-agency-trend-researcher"
  },
  {
    "name": "/agency-twitter-engager",
    "desc": "Chuyên gia tương tác Twitter, xây dựng vị thế qua các thảo l...",
    "id": "skill-agency-twitter-engager"
  },
  {
    "name": "/agency-ui-designer",
    "desc": "Thiết kế UI chuyên nghiệp, xây dựng Design System và giao di...",
    "id": "skill-agency-ui-designer"
  },
  {
    "name": "/agency-ux-architect",
    "desc": "Kiến trúc sư UX, cung cấp nền tảng và hướng dẫn triển khai C...",
    "id": "skill-agency-ux-architect"
  },
  {
    "name": "/agency-ux-researcher",
    "desc": "Chuyên gia nghiên cứu UX, phân tích hành vi người dùng bằng ...",
    "id": "skill-agency-ux-researcher"
  },
  {
    "name": "/agency-visionos-spatial-engineer",
    "desc": "Kỹ sư không gian VisionOS, chuyên về tính toán không gian và...",
    "id": "skill-agency-visionos-spatial-engineer"
  },
  {
    "name": "/agency-visual-storyteller",
    "desc": "Chuyên gia kể chuyện bằng hình ảnh, biến thông tin thành các...",
    "id": "skill-agency-visual-storyteller"
  },
  {
    "name": "/agency-whimsy-injector",
    "desc": "Chuyên gia sáng tạo, thêm thắt cá tính và sự thú vị vào trải...",
    "id": "skill-agency-whimsy-injector"
  },
  {
    "name": "/agency-workflow-optimizer",
    "desc": "Chuyên gia tối ưu hóa quy trình, tự động hóa luồng công việc...",
    "id": "skill-agency-workflow-optimizer"
  },
  {
    "name": "/agency-xr-cockpit-interaction-specialist",
    "desc": "Chuyên gia tương tác buồng lái XR, thiết kế hệ thống điều kh...",
    "id": "skill-agency-xr-cockpit-interaction-specialist"
  },
  {
    "name": "/agency-xr-immersive-developer",
    "desc": "Lập trình viên XR nhập vai, chuyên các ứng dụng AR/VR/XR trê...",
    "id": "skill-agency-xr-immersive-developer"
  },
  {
    "name": "/agency-xr-interface-architect",
    "desc": "Kiến trúc sư giao diện XR, thiết kế tương tác không gian cho...",
    "id": "skill-agency-xr-interface-architect"
  },
  {
    "name": "/api-patterns",
    "desc": "Nguyên tắc thiết kế API (REST, GraphQL, tRPC) và ra quyết đị...",
    "id": "skill-api-patterns"
  },
  {
    "name": "/app-builder",
    "desc": "Nhạc trưởng điều phối xây dựng ứng dụng toàn diện từ yêu cầu...",
    "id": "skill-app-builder"
  },
  {
    "name": "/architecture",
    "desc": "Khung ra quyết định kiến trúc, đánh giá đánh đổi và tài liệu...",
    "id": "skill-architecture"
  },
  {
    "name": "/audit-support",
    "desc": "Hỗ trợ tuân thủ SOX 404 với phương pháp thử nghiệm và chuẩn ...",
    "id": "skill-audit-support"
  },
  {
    "name": "/awf-adaptive-language",
    "desc": "Điều chỉnh ngôn ngữ dựa trên trình độ kỹ thuật của người dùn...",
    "id": "skill-awf-adaptive-language"
  },
  {
    "name": "/awf-auto-save",
    "desc": "Hệ thống tự động lưu session để không mất dữ liệu ngữ cảnh.",
    "id": "skill-awf-auto-save"
  },
  {
    "name": "/awf-context-help",
    "desc": "Trợ giúp thông minh dựa trên ngữ cảnh công việc hiện tại.",
    "id": "skill-awf-context-help"
  },
  {
    "name": "/awf-error-translator",
    "desc": "Dịch lỗi kỹ thuật sang ngôn ngữ đời thường dễ hiểu.",
    "id": "skill-awf-error-translator"
  },
  {
    "name": "/awf-onboarding",
    "desc": "Trải nghiệm hướng dẫn cho người dùng mới sử dụng lần đầu.",
    "id": "skill-awf-onboarding"
  },
  {
    "name": "/awf-session-restore",
    "desc": "Tự động khôi phục ngữ cảnh làm việc giúp tiếp tục nhanh chón...",
    "id": "skill-awf-session-restore"
  },
  {
    "name": "/bash-linux",
    "desc": "Các mẫu terminal Bash/Linux, câu lệnh quan trọng và kỹ thuật...",
    "id": "skill-bash-linux"
  },
  {
    "name": "/behavioral-modes",
    "desc": "Các chế độ vận hành (brainstorm, implement, debug...) để thí...",
    "id": "skill-behavioral-modes"
  },
  {
    "name": "/brainstorming",
    "desc": "Quy trình đặt câu hỏi Socratic cho các yêu cầu phức tạp hoặc...",
    "id": "skill-brainstorming"
  },
  {
    "name": "/brand-voice",
    "desc": "Áp dụng và thực thi giọng điệu thương hiệu và hướng dẫn phon...",
    "id": "skill-brand-voice"
  },
  {
    "name": "/call-prep",
    "desc": "Chuẩn bị cho cuộc gọi bán hàng với bối cảnh tài khoản và ngh...",
    "id": "skill-call-prep"
  },
  {
    "name": "/campaign-planning",
    "desc": "Lập kế hoạch chiến dịch marketing, phân bổ ngân sách và xác ...",
    "id": "skill-campaign-planning"
  },
  {
    "name": "/canned-responses",
    "desc": "Tạo các mẫu phản hồi cho các yêu cầu pháp lý hoặc hỗ trợ phổ...",
    "id": "skill-canned-responses"
  },
  {
    "name": "/change-management",
    "desc": "Lập kế hoạch và thực hiện các thay đổi tổ chức hoặc kỹ thuật...",
    "id": "skill-change-management"
  },
  {
    "name": "/clean-code",
    "desc": "Các quy chuẩn code thực dụng, ngắn gọn, không làm quá (over-...",
    "id": "skill-clean-code"
  },
  {
    "name": "/close-management",
    "desc": "Quản lý quy trình chốt sổ tài chính cuối tháng và theo dõi t...",
    "id": "skill-close-management"
  },
  {
    "name": "/code-review",
    "desc": "Review code để tìm bug, lỗ hổng bảo mật và đảm bảo khả năng ...",
    "id": "skill-code-review"
  },
  {
    "name": "/code-review-checklist",
    "desc": "Các hướng dẫn review code bao quát chất lượng, bảo mật và be...",
    "id": "skill-code-review-checklist"
  },
  {
    "name": "/compensation-benchmarking",
    "desc": "So sánh mức lương thưởng với dữ liệu thị trường để có đề xuấ...",
    "id": "skill-compensation-benchmarking"
  },
  {
    "name": "/competitive-analysis",
    "desc": "Phân tích đối thủ về định vị, thông điệp và chiến lược sản p...",
    "id": "skill-competitive-analysis"
  },
  {
    "name": "/competitive-analysis",
    "desc": "Phân tích đối thủ về định vị, thông điệp và chiến lược sản p...",
    "id": "skill-competitive-analysis"
  },
  {
    "name": "/competitive-intelligence",
    "desc": "Nghiên cứu đối thủ và xây dựng các thẻ đối đầu (battlecard) ...",
    "id": "skill-competitive-intelligence"
  },
  {
    "name": "/compliance",
    "desc": "Điều hướng các quy định quyền riêng tư và xử lý yêu cầu dữ l...",
    "id": "skill-compliance"
  },
  {
    "name": "/compliance-tracking",
    "desc": "Theo dõi các yêu cầu tuân thủ và mức độ sẵn sàng cho audit c...",
    "id": "skill-compliance-tracking"
  },
  {
    "name": "/content-creation",
    "desc": "Soạn thảo nội dung marketing đa kênh (blog, social, email) c...",
    "id": "skill-content-creation"
  },
  {
    "name": "/contract-review",
    "desc": "Review hợp đồng dựa trên cẩm nang của tổ chức, đánh dấu các ...",
    "id": "skill-contract-review"
  },
  {
    "name": "/cowork-plugin-customizer",
    "desc": ">",
    "id": "skill-cowork-plugin-customizer"
  },
  {
    "name": "/create-an-asset",
    "desc": "Generate tailored sales assets (landing pages, decks, one-pa...",
    "id": "skill-create-an-asset"
  },
  {
    "name": "/create-cowork-plugin",
    "desc": ">",
    "id": "skill-create-cowork-plugin"
  },
  {
    "name": "/customer-research",
    "desc": "Nghiên cứu câu hỏi khách hàng dựa trên dữ liệu đa nguồn và t...",
    "id": "skill-customer-research"
  },
  {
    "name": "/daily-briefing",
    "desc": "Bản tin bán hàng đầu ngày với các cuộc họp và ưu tiên quan t...",
    "id": "skill-daily-briefing"
  },
  {
    "name": "/data-context-extractor",
    "desc": ">",
    "id": "skill-data-context-extractor"
  },
  {
    "name": "/data-exploration",
    "desc": "Khám phá bộ dữ liệu để hiểu cấu trúc và chất lượng trước khi...",
    "id": "skill-data-exploration"
  },
  {
    "name": "/data-validation",
    "desc": "QA các báo cáo phân tích để đảm bảo tính chính xác và không ...",
    "id": "skill-data-validation"
  },
  {
    "name": "/data-visualization",
    "desc": "Trực quan hóa dữ liệu hiệu quả bằng Python (matplotlib, seab...",
    "id": "skill-data-visualization"
  },
  {
    "name": "/database-design",
    "desc": "Nguyên tắc thiết kế DB, schema, indexing và chiến lược ORM.",
    "id": "skill-database-design"
  },
  {
    "name": "/deployment-procedures",
    "desc": "Nguyên tắc triển khai production an toàn và chiến lược rollb...",
    "id": "skill-deployment-procedures"
  },
  {
    "name": "/design-critique",
    "desc": "Đánh giá thiết kế về tính khả dụng, phân cấp thị giác và tín...",
    "id": "skill-design-critique"
  },
  {
    "name": "/design-handoff",
    "desc": "Tạo tài liệu bàn giao kỹ thuật chi tiết từ các bản thiết kế ...",
    "id": "skill-design-handoff"
  },
  {
    "name": "/design-system-management",
    "desc": "Quản lý Design Tokens, thư viện component và tài liệu quy ch...",
    "id": "skill-design-system-management"
  },
  {
    "name": "/documentation",
    "desc": "Viết và duy trì tài liệu kỹ thuật, README và hướng dẫn vận h...",
    "id": "skill-documentation"
  },
  {
    "name": "/documentation-templates",
    "desc": "Các mẫu tài liệu và hướng dẫn cấu trúc chuẩn AI-friendly.",
    "id": "skill-documentation-templates"
  },
  {
    "name": "/draft-outreach",
    "desc": "Nghiên cứu khách hàng tiềm năng và soạn thảo nội dung tiếp c...",
    "id": "skill-draft-outreach"
  },
  {
    "name": "/employee-handbook",
    "desc": "Giải đáp các câu hỏi về chính sách công ty, phúc lợi và quy ...",
    "id": "skill-employee-handbook"
  },
  {
    "name": "/escalation",
    "desc": "Đóng gói các yêu cầu hỗ trợ chuyển cấp cho đội kỹ thuật hoặc...",
    "id": "skill-escalation"
  },
  {
    "name": "/feature-spec",
    "desc": "Viết tài liệu yêu cầu sản phẩm (PRD) với User Stories và tiê...",
    "id": "skill-feature-spec"
  },
  {
    "name": "/financial-statements",
    "desc": "Tạo báo cáo kết quả kinh doanh và bảng cân đối kế toán chuẩn...",
    "id": "skill-financial-statements"
  },
  {
    "name": "/frontend-design",
    "desc": "Tư duy thiết kế và ra quyết định cho giao diện web thẩm mỹ.",
    "id": "skill-frontend-design"
  },
  {
    "name": "/game-development",
    "desc": "Nhạc trưởng điều phối phát triển game, điều hướng đến các sk...",
    "id": "skill-game-development"
  },
  {
    "name": "/geo-fundamentals",
    "desc": "Tối ưu hóa nội dung cho các công cụ tìm kiếm AI (Generative ...",
    "id": "skill-geo-fundamentals"
  },
  {
    "name": "/i18n-localization",
    "desc": "Mẫu thiết kế đa ngôn ngữ và quản lý bản dịch (L10n/I18n).",
    "id": "skill-i18n-localization"
  },
  {
    "name": "/incident-response",
    "desc": "Điều phối và quản lý các sự cố hệ thống ngay lập tức.",
    "id": "skill-incident-response"
  },
  {
    "name": "/instrument-data-to-allotrope",
    "desc": "Chuyển đổi dữ liệu thiết bị phòng thí nghiệm sang chuẩn ASM ...",
    "id": "skill-instrument-data-to-allotrope"
  },
  {
    "name": "/intelligent-routing",
    "desc": "Tự động chọn agent và điều phối nhiệm vụ thông minh theo yêu...",
    "id": "skill-intelligent-routing"
  },
  {
    "name": "/interactive-dashboard-builder",
    "desc": "Xây dựng dashboard HTML tương tác, không cần server để hoạt ...",
    "id": "skill-interactive-dashboard-builder"
  },
  {
    "name": "/interview-prep",
    "desc": "Tạo kế hoạch phỏng vấn có cấu trúc với bộ câu hỏi dựa trên n...",
    "id": "skill-interview-prep"
  },
  {
    "name": "/journal-entry-prep",
    "desc": "Chuẩn bị các bút toán kế toán cho quy trình chốt sổ tháng.",
    "id": "skill-journal-entry-prep"
  },
  {
    "name": "/knowledge-management",
    "desc": "Xây dựng bài viết cơ sở tri thức từ các vấn đề hỗ trợ đã giả...",
    "id": "skill-knowledge-management"
  },
  {
    "name": "/knowledge-synthesis",
    "desc": "Tổng hợp kết quả tìm kiếm đa nguồn thành câu trả lời thống n...",
    "id": "skill-knowledge-synthesis"
  },
  {
    "name": "/kwp-admin-nd30",
    "desc": "Soạn thảo văn bản hành chính chuẩn Nghị định 30/2020/NĐ-CP.",
    "id": "skill-kwp-admin-nd30"
  },
  {
    "name": "/legal-risk-assessment",
    "desc": "Đánh giá và phân loại rủi ro pháp lý theo mức độ nghiêm trọn...",
    "id": "skill-legal-risk-assessment"
  },
  {
    "name": "/lint-and-validate",
    "desc": "Kiểm soát chất lượng tự động, linting và phân tích tĩnh sau ...",
    "id": "skill-lint-and-validate"
  },
  {
    "name": "/mcp-builder",
    "desc": "Nguyên tắc xây dựng server MCP, thiết kế công cụ và tài nguy...",
    "id": "skill-mcp-builder"
  },
  {
    "name": "/meeting-briefing",
    "desc": "Chuẩn bị tài liệu briefing và theo dõi các hành động sau cuộ...",
    "id": "skill-meeting-briefing"
  },
  {
    "name": "/memory-management",
    "desc": "Hệ thống bộ nhớ hai tầng giúp AI hiểu các thuật ngữ nội bộ c...",
    "id": "skill-memory-management"
  },
  {
    "name": "/metrics-tracking",
    "desc": "Xác định và theo dõi các chỉ số sản phẩm cùng các khung mục ...",
    "id": "skill-metrics-tracking"
  },
  {
    "name": "/mobile-design",
    "desc": "Tư duy thiết kế ưu tiên di động (Mobile-first) cho iOS và An...",
    "id": "skill-mobile-design"
  },
  {
    "name": "/nda-triage",
    "desc": "Sàng lọc và phân loại mức độ rủi ro của các hợp đồng bảo mật...",
    "id": "skill-nda-triage"
  },
  {
    "name": "/nextflow-development",
    "desc": "Chạy các đường ống tin sinh học nf-core trên dữ liệu giải tr...",
    "id": "skill-nextflow-development"
  },
  {
    "name": "/nodejs-best-practices",
    "desc": "Nguyên tắc phát triển Node.js, framework và bảo mật phía ser...",
    "id": "skill-nodejs-best-practices"
  },
  {
    "name": "/org-planning",
    "desc": "Lập kế hoạch nhân sự, thiết kế tổ chức và tối ưu cấu trúc độ...",
    "id": "skill-org-planning"
  },
  {
    "name": "/parallel-agents",
    "desc": "Các mẫu điều phối đa tác nhân chạy song song cho nhiệm vụ ph...",
    "id": "skill-parallel-agents"
  },
  {
    "name": "/people-analytics",
    "desc": "Phân tích dữ liệu nhân sự về biến động, gắn kết và năng suất...",
    "id": "skill-people-analytics"
  },
  {
    "name": "/performance-analytics",
    "desc": "Phân tích hiệu quả marketing qua các chỉ số then chốt và xu ...",
    "id": "skill-performance-analytics"
  },
  {
    "name": "/performance-profiling",
    "desc": "Các phương pháp đo lường, phân tích và tối ưu hóa hiệu năng ...",
    "id": "skill-performance-profiling"
  },
  {
    "name": "/plan-writing",
    "desc": "Lập kế hoạch công việc có cấu trúc với các phụ thuộc và tiêu...",
    "id": "skill-plan-writing"
  },
  {
    "name": "/powershell-windows",
    "desc": "Các mẫu PowerShell cho Windows, xử lý lỗi và các bẫy kỹ thuậ...",
    "id": "skill-powershell-windows"
  },
  {
    "name": "/process-optimization",
    "desc": "Phân tích và cải thiện các quy trình kinh doanh hiện có.",
    "id": "skill-process-optimization"
  },
  {
    "name": "/python-patterns",
    "desc": "Nguyên tắc phát triển Python, cấu trúc dự án và các pattern ...",
    "id": "skill-python-patterns"
  },
  {
    "name": "/react-best-practices",
    "desc": "Tối ưu hóa hiệu năng React và Next.js từ kỹ thuật của Vercel...",
    "id": "skill-react-best-practices"
  },
  {
    "name": "/reconciliation",
    "desc": "Đối soát tài khoản giữa số dư sổ cái và các báo cáo bên thứ ...",
    "id": "skill-reconciliation"
  },
  {
    "name": "/recruiting-pipeline",
    "desc": "Theo dõi và quản lý các giai đoạn trong phễu tuyển dụng nhân...",
    "id": "skill-recruiting-pipeline"
  },
  {
    "name": "/red-team-tactics",
    "desc": "Các chiến thuật tấn công mô phỏng (Red team) dựa trên MITRE ...",
    "id": "skill-red-team-tactics"
  },
  {
    "name": "/resource-planning",
    "desc": "Lập kế hoạch và tối ưu hóa việc phân bổ nguồn lực (nhân sự, ...",
    "id": "skill-resource-planning"
  },
  {
    "name": "/response-drafting",
    "desc": "Soạn thảo các phản hồi khách hàng chuyên nghiệp, thấu cảm và...",
    "id": "skill-response-drafting"
  },
  {
    "name": "/risk-assessment",
    "desc": "Xác định, đánh giá và giảm thiểu các rủi ro vận hành doanh n...",
    "id": "skill-risk-assessment"
  },
  {
    "name": "/roadmap-management",
    "desc": "Lập kế hoạch và ưu tiên lộ trình sản phẩm (Now/Next/Later).",
    "id": "skill-roadmap-management"
  },
  {
    "name": "/rust-pro",
    "desc": "Thành thạo Rust 1.75+ với async pattern và hệ thống type nân...",
    "id": "skill-rust-pro"
  },
  {
    "name": "/scientific-problem-selection",
    "desc": "Hỗ trợ nhà khoa học lựa chọn vấn đề nghiên cứu và chiến lược...",
    "id": "skill-scientific-problem-selection"
  },
  {
    "name": "/scvi-tools",
    "desc": "Học sâu cho phân tích tế bào đơn bằng công cụ scvi-tools.",
    "id": "skill-scvi-tools"
  },
  {
    "name": "/search-strategy",
    "desc": "Chiến lược phân rã câu hỏi và điều phối tìm kiếm đa nguồn.",
    "id": "skill-search-strategy"
  },
  {
    "name": "/seo-fundamentals",
    "desc": "Nguyên tắc SEO bản chất, E-E-A-T và thuật toán tìm kiếm của ...",
    "id": "skill-seo-fundamentals"
  },
  {
    "name": "/server-management",
    "desc": "Nguyên tắc quản lý máy chủ, giám sát và ra quyết định mở rộn...",
    "id": "skill-server-management"
  },
  {
    "name": "/single-cell-rna-qc",
    "desc": "Thực hiện kiểm soát chất lượng dữ liệu RNA-seq tế bào đơn.",
    "id": "skill-single-cell-rna-qc"
  },
  {
    "name": "/source-management",
    "desc": "Quản lý các nguồn tri thức MCP cho tìm kiếm doanh nghiệp.",
    "id": "skill-source-management"
  },
  {
    "name": "/sql-queries",
    "desc": "Viết SQL hiệu năng cao trên các nền tảng (Snowflake, BigQuer...",
    "id": "skill-sql-queries"
  },
  {
    "name": "/stakeholder-comms",
    "desc": "Soạn thảo cập nhật cho cổ đông, lãnh đạo hoặc đối tác tùy lo...",
    "id": "skill-stakeholder-comms"
  },
  {
    "name": "/statistical-analysis",
    "desc": "Áp dụng phương pháp thống kê để giải mã ý nghĩa của dữ liệu.",
    "id": "skill-statistical-analysis"
  },
  {
    "name": "/system-design",
    "desc": "Thiết kế hệ thống, dịch vụ và kiến trúc phần mềm quy mô lớn.",
    "id": "skill-system-design"
  },
  {
    "name": "/systematic-debugging",
    "desc": "Phương pháp gỡ lỗi hệ thống 4 bước với phân tích nguyên nhân...",
    "id": "skill-systematic-debugging"
  },
  {
    "name": "/tailwind-patterns",
    "desc": "Sử dụng Tailwind CSS v4 với cấu trúc ưu tiên CSS và tokens.",
    "id": "skill-tailwind-patterns"
  },
  {
    "name": "/task-management",
    "desc": "Quản lý công việc đơn giản thông qua file chia sẻ TASKS.md.",
    "id": "skill-task-management"
  },
  {
    "name": "/tdd-workflow",
    "desc": "Quy trình phát triển hướng kiểm thử (TDD) theo chu kỳ Red-Gr...",
    "id": "skill-tdd-workflow"
  },
  {
    "name": "/tech-debt",
    "desc": "Xác định, phân loại và ưu tiên các nợ kỹ thuật cần giải quyế...",
    "id": "skill-tech-debt"
  },
  {
    "name": "/testing-patterns",
    "desc": "Các mẫu kiểm thử đơn vị, tích hợp và chiến lược giả lập (moc...",
    "id": "skill-testing-patterns"
  },
  {
    "name": "/testing-strategy",
    "desc": "Thiết kế chiến lược và kế hoạch kiểm thử tổng thể cho dự án.",
    "id": "skill-testing-strategy"
  },
  {
    "name": "/ticket-triage",
    "desc": "Phân loại và điều hướng các ticket hỗ trợ khách hàng theo mứ...",
    "id": "skill-ticket-triage"
  },
  {
    "name": "/user-research",
    "desc": "Lập kế hoạch, thực hiện và tổng hợp các nghiên cứu người dùn...",
    "id": "skill-user-research"
  },
  {
    "name": "/user-research-synthesis",
    "desc": "Tổng hợp nghiên cứu định tính và định lượng thành các bài họ...",
    "id": "skill-user-research-synthesis"
  },
  {
    "name": "/ux-writing",
    "desc": "Viết nội dung microcopy cho giao diện người dùng (nút bấm, t...",
    "id": "skill-ux-writing"
  },
  {
    "name": "/variance-analysis",
    "desc": "Phân tích chênh lệch tài chính và giải thích các yếu tố tác ...",
    "id": "skill-variance-analysis"
  },
  {
    "name": "/vendor-management",
    "desc": "Đánh giá, so sánh và quản lý mối quan hệ với các nhà cung cấ...",
    "id": "skill-vendor-management"
  },
  {
    "name": "/vulnerability-scanner",
    "desc": "Phân tích lỗ hổng bảo mật nâng cao theo chuẩn OWASP 2025.",
    "id": "skill-vulnerability-scanner"
  },
  {
    "name": "/web-design-guidelines",
    "desc": "Review code UI theo các tiêu chuẩn giao diện web và khả năng...",
    "id": "skill-web-design-guidelines"
  },
  {
    "name": "/webapp-testing",
    "desc": "Nguyên tắc kiểm thử web ứng dụng toàn diện (E2E, Playwright)...",
    "id": "skill-webapp-testing"
  }

]; // END_SLASH_COMMANDS

function renderSuggestions(query) {
  const q = query.toLowerCase().replace('/', '');
  const filtered = SLASH_COMMANDS.filter(cmd => 
    cmd.name.toLowerCase().includes(q) || 
    cmd.desc.toLowerCase().includes(q)
  ).slice(0, 10);

  suggestionsBox.innerHTML = '';
  if (filtered.length === 0) {
    suggestionsBox.classList.remove('active');
    return;
  }

  filtered.forEach((cmd) => {
    const div = document.createElement('div');
    div.className = 'suggestion-item';
    div.dataset.id = cmd.id;
    div.dataset.name = cmd.name;
    div.innerHTML = `
      <div class="suggestion-name">${cmd.name}</div>
      <div class="suggestion-desc">${cmd.desc}</div>
    `;
    div.addEventListener('click', () => {
      selectSuggestion(cmd.name, cmd.id);
    });
    suggestionsBox.appendChild(div);
  });
  suggestionsBox.classList.add('active');
}

function selectSuggestion(name, id) {
  if (searchInput) {
    searchInput.value = name;
    suggestionsBox.classList.remove('active');
    handleSearchSelection(id);
  }
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (val.startsWith('/')) {
      renderSuggestions(val);
    } else {
      suggestionsBox.classList.remove('active');
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    const items = suggestionsBox.querySelectorAll('.suggestion-item');
    let activeIndex = Array.from(items).findIndex(item => item.classList.contains('active'));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (activeIndex < items.length - 1) {
        if (activeIndex >= 0) items[activeIndex].classList.remove('active');
        items[activeIndex + 1].classList.add('active');
        items[activeIndex + 1].scrollIntoView({ block: 'nearest' });
      } else if (activeIndex === -1 && items.length > 0) {
        items[0].classList.add('active');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeIndex > 0) {
        items[activeIndex].classList.remove('active');
        items[activeIndex - 1].classList.add('active');
        items[activeIndex - 1].scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'Enter') {
      if (suggestionsBox.classList.contains('active')) {
        const item = suggestionsBox.querySelector('.suggestion-item.active') || items[0];
        if (item) selectSuggestion(item.dataset.name, item.dataset.id);
      }
    } else if (e.key === 'Escape') {
      suggestionsBox.classList.remove('active');
    }
  });

  document.addEventListener('click', (e) => {
    if (suggestionsBox && !suggestionsBox.contains(e.target) && e.target !== searchInput) {
      suggestionsBox.classList.remove('active');
    }
  });
}
